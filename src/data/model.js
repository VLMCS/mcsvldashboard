/* ══════════════════════════════════════════════════════════════
   DATA MODEL (Phase B — B3)  ·  DORMANT until USE_NEW_DATA_MODEL=true

   Translates the app's in-memory state arrays (HANDBOOK, SECTIONS,
   TEAM_DIRECTORY, …) to/from per-entity Firestore collections, so the
   rest of the app (views, sidebar, editors) needs NO changes — it keeps
   reading/writing the same globals; only the persistence plumbing moves
   here when the flag flips.

   Collections (see firestore.rules):
     /entries/{base__id}        one doc per handbook/project/custom entry
     /sections/{base__num}      section/project/custom-category section defs
     /categories/{catId}        custom-category metadata (label/type/order)
     /team/{tmId}               profile (NO passkey)
     /team-secrets/{tmId}       { passkeyHash, salt }   (managed separately)
     /project-secrets/{base__num} { passkeyHash, salt } (managed separately)
     /announcements/{annId}
     /site/main /sidebar/main /synonyms/main   (small singletons)

   Doc IDs are namespaced by base ('handbook__1.1' vs 'projects__1.1')
   because per-base entry/section numbering is NOT globally unique.

   READ path:  dataLoadAll() (boot) + dataSubscribe() (live) fill _dataRaw
   from snapshots, then _dataRebuildArrays() derives the globals.
   WRITE path: dataSyncKey(key, arr) diffs against a write-cache and
   upserts only changed docs + deletes removed ones (Spark write-quota).
   Passkey hashes are written via dataSetPasskeyHash / dataSetProjectPasskey
   (used by migration + the reset flow), never by the bulk profile sync.
   ══════════════════════════════════════════════════════════════ */

const _DSEP = '__';
function _entryDocId(base, id) { return base + _DSEP + id; }
function _sectionDocId(base, num) { return base + _DSEP + num; }

// Raw snapshot mirrors (filled by load + onSnapshot); arrays derive from these.
let _dataRaw = {
  entries: [], sections: [], categories: [], team: [], announcements: [],
  site: null, sidebar: null, synonyms: null
};
// Write-path cache: subsetKey -> Map(docId -> last-written JSON). Lets a save
// write only the docs that actually changed.
let _dataSyncCache = {};
let _dataUnsubs = [];

/* ── SHA-256 (matches bind.js / admin-password / migration) ── */
async function _data_sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function _data_randomHex(bytes) {
  const a = new Uint8Array(bytes); crypto.getRandomValues(a);
  return [...a].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ════════════════ READ: rebuild in-memory globals from _dataRaw ════════════════ */
// Natural, segment-wise comparator for dotted IDs / numbers ("2" < "10",
// "2.1" < "2.10", "2.1.a" < "2.1.b"). Firestore returns docs in lexicographic
// doc-ID order, which would put "10" before "2" — so we re-sort on load to
// restore the intended numeric/tree order.
function _natCmpId(a, b) {
  const pa = String(a).split('.'), pb = String(b).split('.');
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    if (pa[i] === undefined) return -1;
    if (pb[i] === undefined) return 1;
    const na = parseInt(pa[i], 10), nb = parseInt(pb[i], 10);
    const aNum = !isNaN(na) && String(na) === pa[i];
    const bNum = !isNaN(nb) && String(nb) === pb[i];
    if (aNum && bNum) { if (na !== nb) return na - nb; }
    else if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  }
  return 0;
}

function _dataRebuildArrays() {
  const entries  = _dataRaw.entries  || [];
  const sections = _dataRaw.sections || [];
  const byBaseEntries  = (b) => entries.filter(e => e.base === b).sort((x, y) => _natCmpId(x.id, y.id));
  const byBaseSections = (b) => sections.filter(s => s.base === b).sort((x, y) => _natCmpId(x.num, y.num));

  HANDBOOK        = byBaseEntries('handbook');
  PROJECT_ENTRIES = byBaseEntries('projects');
  SECTIONS        = byBaseSections('handbook');
  PROJECTS        = byBaseSections('projects');

  // Custom categories: metadata doc + its own sections/entries by base=catId.
  CUSTOM_CATEGORIES = (_dataRaw.categories || []).map(cat => Object.assign({}, cat, {
    sections: byBaseSections(cat.id),
    entries:  byBaseEntries(cat.id)
  }));

  TEAM_DIRECTORY = (_dataRaw.team || []).slice();
  ANNOUNCEMENTS  = (_dataRaw.announcements || []).slice();

  if (_dataRaw.site)     SITE_SETTINGS = Object.assign({}, DEFAULT_SITE_SETTINGS, _dataRaw.site);
  if (_dataRaw.sidebar)  SIDEBAR_CFG   = Array.isArray(_dataRaw.sidebar.items) ? _dataRaw.sidebar.items : (Array.isArray(_dataRaw.sidebar) ? _dataRaw.sidebar : SIDEBAR_CFG);
  if (_dataRaw.synonyms) SYNONYMS      = decodeFromFirestore('synonyms', Array.isArray(_dataRaw.synonyms.groups) ? _dataRaw.synonyms.groups : []);
}

async function _readCollection(name) {
  const snap = await _fb_getDocs(_fb_collection(_fbDb, name));
  return snap.docs.map(d => d.data());
}
async function _readDoc(coll, id) {
  const snap = await _fb_getDoc(_fb_doc(_fbDb, coll, id));
  return snap.exists() ? snap.data() : null;
}

async function dataLoadAll() {
  const [entries, sections, categories, team, announcements, site, sidebar, synonyms] = await Promise.all([
    _readCollection('entries'),
    _readCollection('sections'),
    _readCollection('categories'),
    _readCollection('team'),
    _readCollection('announcements'),
    _readDoc('site', 'main'),
    _readDoc('sidebar', 'main'),
    _readDoc('synonyms', 'main')
  ]);
  _dataRaw = { entries, sections, categories, team, announcements, site, sidebar, synonyms };
  _dataRebuildArrays();
}

/* ════════════════ LIVE: per-collection onSnapshot ════════════════ */
function dataSubscribe() {
  dataUnsubscribe();
  // Each onSnapshot fires once immediately on attach with the data dataLoadAll
  // already has — skip that initial fire so boot doesn't trigger a re-render
  // storm + a flurry of "Updated from team" toasts.
  const sub = (coll, apply) => {
    let first = true;
    const unsub = _fb_onSnapshot(_fb_collection(_fbDb, coll), (snap) => {
      if (_fbWriting) return;               // ignore our own write echoes
      apply(snap.docs.map(d => d.data()));
      _dataRebuildArrays();
      if (first) { first = false; return; }
      _dataReRender();
    });
    _dataUnsubs.push(unsub);
  };
  const subDoc = (coll, key) => {
    let first = true;
    const unsub = _fb_onSnapshot(_fb_doc(_fbDb, coll, 'main'), (snap) => {
      if (_fbWriting) return;
      _dataRaw[key] = snap.exists() ? snap.data() : null;
      _dataRebuildArrays();
      if (first) { first = false; return; }
      _dataReRender();
    });
    _dataUnsubs.push(unsub);
  };
  sub('entries',       arr => { _dataRaw.entries = arr; });
  sub('sections',      arr => { _dataRaw.sections = arr; });
  sub('categories',    arr => { _dataRaw.categories = arr; });
  sub('team',          arr => { _dataRaw.team = arr; });
  sub('announcements', arr => { _dataRaw.announcements = arr; });
  subDoc('site', 'site');
  subDoc('sidebar', 'sidebar');
  subDoc('synonyms', 'synonyms');
}
function dataUnsubscribe() {
  _dataUnsubs.forEach(u => { try { u(); } catch (e) {} });
  _dataUnsubs = [];
}
function _dataReRender() {
  try {
    applyAllSettings();
    renderSidebar();
    renderAnnouncements();
    if (currentView === 'section' && currentSectionNum) showSection(currentSectionNum, currentBase);
    else if (currentView === 'entry' && currentEntryId) showEntry(currentEntryId, currentBase);
    showToast('Updated from team');
  } catch (e) { console.error('re-render after data change failed:', e); }
}

/* ════════════════ WRITE: whole-array sync → per-doc upserts/deletes ════════════════ */

// Existing (last-persisted) items for a subset, from the loaded/live snapshot.
function _rawEntries(base)  { return (_dataRaw.entries  || []).filter(e => e.base === base); }
function _rawSections(base) { return (_dataRaw.sections || []).filter(s => s.base === base); }

// Upsert changed items + delete removed ones for one logical subset of a
// collection (e.g. entries with base 'handbook'). idFn → doc id; docFn → data.
// `existing` is the last-persisted items for this subset (from _dataRaw); it
// SEEDS the diff cache so deletions are detected even on a fresh page load
// (the in-memory cache alone is empty after a refresh) and unchanged docs
// aren't needlessly rewritten.
async function _syncSubset(collName, subsetKey, items, idFn, docFn, existing) {
  const cache = _dataSyncCache[subsetKey] || (_dataSyncCache[subsetKey] = new Map());
  if (existing) for (const ex of existing) {
    const id = idFn(ex);
    if (!cache.has(id)) { try { cache.set(id, JSON.stringify(docFn(ex))); } catch (e) {} }
  }
  const seen = new Set();
  _fbWriting = true;
  try {
    for (const it of items) {
      const id = idFn(it);
      seen.add(id);
      const data = docFn(it);
      const json = JSON.stringify(data);
      if (cache.get(id) === json) continue;   // unchanged → skip write
      await _fb_setDoc(_fb_doc(_fbDb, collName, id), data);
      cache.set(id, json);
    }
    for (const id of [...cache.keys()]) {
      if (!seen.has(id)) {
        await _fb_deleteDoc(_fb_doc(_fbDb, collName, id));
        cache.delete(id);
      }
    }
  } finally {
    setTimeout(() => { _fbWriting = false; }, 200);
  }
}

async function _syncSingleton(coll, data) {
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, coll, 'main'), data); }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}

// strip a passkey field from section/profile docs (passkeys live in *-secrets)
function _stripPasskey(obj) { const o = Object.assign({}, obj); delete o.passkey; return o; }

// Route a whole-array sync (the existing fbSyncKey keys) to collection writes.
async function dataSyncKey(key, value) {
  try {
    switch (key) {
      case 'handbook':
        return _syncSubset('entries', 'entries:handbook', value || [],
          e => _entryDocId('handbook', e.id), e => Object.assign({}, e, { base: 'handbook' }), _rawEntries('handbook'));
      case 'projectEntries':
        return _syncSubset('entries', 'entries:projects', value || [],
          e => _entryDocId('projects', e.id), e => Object.assign({}, e, { base: 'projects' }), _rawEntries('projects'));
      case 'sections':
        return _syncSubset('sections', 'sections:handbook', value || [],
          s => _sectionDocId('handbook', s.num), s => Object.assign(_stripPasskey(s), { base: 'handbook', num: String(s.num) }), _rawSections('handbook'));
      case 'projects':
        return _syncSubset('sections', 'sections:projects', value || [],
          s => _sectionDocId('projects', s.num), s => Object.assign(_stripPasskey(s), { base: 'projects', num: String(s.num) }), _rawSections('projects'));
      case 'announcements':
        return _syncSubset('announcements', 'announcements', value || [],
          a => String(a.id), a => Object.assign({}, a), _dataRaw.announcements || []);
      case 'team':
        return _syncSubset('team', 'team', value || [],
          m => String(m.id), m => _stripPasskey(m), _dataRaw.team || []);
      case 'customCategories': {
        const cats = value || [];
        const catMeta = c => { const o = Object.assign({}, c); delete o.sections; delete o.entries; return o; };
        // category metadata docs (without the nested sections/entries arrays)
        await _syncSubset('categories', 'categories', cats,
          c => String(c.id), catMeta, _dataRaw.categories || []);
        // each surviving category's sections + entries, namespaced by base=catId
        for (const c of cats) {
          await _syncSubset('sections', 'sections:' + c.id, c.sections || [],
            s => _sectionDocId(c.id, s.num), s => Object.assign(_stripPasskey(s), { base: c.id, num: String(s.num) }), _rawSections(c.id));
          await _syncSubset('entries', 'entries:' + c.id, c.entries || [],
            e => _entryDocId(c.id, e.id), e => Object.assign({}, e, { base: c.id }), _rawEntries(c.id));
        }
        // Clean up sections/entries belonging to REMOVED categories (their
        // subsets aren't visited by the loop above, so sync them empty to
        // delete the orphaned docs).
        const liveIds = new Set(cats.map(c => String(c.id)));
        const removedIds = (_dataRaw.categories || [])
          .map(c => String(c.id)).filter(id => !liveIds.has(id));
        for (const rid of removedIds) {
          await _syncSubset('sections', 'sections:' + rid, [],
            s => _sectionDocId(rid, s.num), s => Object.assign(_stripPasskey(s), { base: rid, num: String(s.num) }), _rawSections(rid));
          await _syncSubset('entries', 'entries:' + rid, [],
            e => _entryDocId(rid, e.id), e => Object.assign({}, e, { base: rid }), _rawEntries(rid));
        }
        return;
      }
      case 'settings':
        return _syncSingleton('site', Object.assign({}, value));
      case 'sidebar':
        return _syncSingleton('sidebar', { items: value || [] });
      case 'synonyms':
        return _syncSingleton('synonyms', { groups: encodeForFirestore('synonyms', value || []) });
      default:
        console.warn('dataSyncKey: unknown key', key);
    }
  } catch (e) {
    console.error('dataSyncKey failed for', key, e);
  }
}

/* ════════════════ Passkeys (VIEWABLE plaintext model) ════════════════
   Per the product decision, passkeys are stored as plaintext in /team-secrets
   and /project-secrets so admins can view/copy them (like the old model). The
   rules keep these readable only by admins + not-yet-bound clients (the login
   check) — NOT by bound non-admins. Better than the original fully-public doc,
   weaker than hashing. (dataSetPasskeyHash kept as an alias so existing callers
   don't break; it now stores plaintext.) */
async function dataSetPasskey(tmId, plaintextPasskey) {
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'team-secrets', String(tmId)), { passkey: String(plaintextPasskey).trim() }); }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}
const dataSetPasskeyHash = dataSetPasskey;   // back-compat alias (now plaintext)

async function dataSetProjectPasskey(base, num, plaintextPasskey) {
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'project-secrets', _sectionDocId(base, num)), { passkey: String(plaintextPasskey).trim() }); }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}

// Admin-only: read /team-secrets and merge plaintext passkeys into
// TEAM_DIRECTORY[i].passkey so the All-Passkeys + profile UI can show them.
// Safe to call repeatedly; silently no-ops if reads are denied (non-admin).
async function dataMergeAdminPasskeys() {
  if (!USE_NEW_DATA_MODEL || !_fbReady) return;
  try {
    const snap = await _fb_getDocs(_fb_collection(_fbDb, 'team-secrets'));
    const byId = {};
    snap.docs.forEach(d => { byId[d.id] = (d.data() || {}).passkey || ''; });
    (TEAM_DIRECTORY || []).forEach(m => { if (m && byId[m.id] !== undefined) m.passkey = byId[m.id]; });
  } catch (e) { /* non-admin read denied under locked rules — ignore */ }
}
