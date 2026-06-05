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
// Entry doc shape. sectionNum is denormalized onto the doc so the strict rules
// can map an entry to its project section for the passkey-unlock check.
function _entryDocData(e, base) {
  return Object.assign({}, e, { base, sectionNum: (typeof sectionNumOf === 'function' ? sectionNumOf(e.id) : String(e.id).split('.')[0]) });
}

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

// Load collections + attach live listeners. Called AFTER the device is bound
// (locked rules require a bound user to read collections), so it runs from the
// resume/login paths rather than at boot. Idempotent enough to call once per
// session; dataSubscribe() detaches any prior listeners first.
let _dataActivated = false;
async function dataActivate() {
  await dataLoadAll();
  _seedSyncBaseline();   // capture last-persisted state for change detection
  dataSubscribe();
  _dataActivated = true;
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
      _seedSyncBaseline();                  // remote change → refresh baseline
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
      _seedSyncBaseline();
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
    // Incoming remote (team) change is rewriting the sidebar list — briefly
    // lock it (scrim + spinner + no controls, can't leave admin) so the user
    // isn't clicking rows that are shifting under them. Coalesces snapshot
    // bursts. Same visual as the reorder / import flow.
    if (typeof flashSidebarSaving === 'function') flashSidebarSaving();
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

// Order-insensitive canonical JSON (recursively sorted keys) for change
// detection, so field-order differences don't trigger spurious writes —
// essential under strict per-doc rules where a non-owner write is DENIED.
function _canon(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(_canon).join(',') + ']';
  return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + _canon(v[k])).join(',') + '}';
}

// Rebuild the write baseline (last-persisted canonical JSON per doc) from the
// current snapshot (_dataRaw), using the SAME transforms as dataSyncKey so the
// comparison lines up. Captured as frozen strings at load/snapshot time so
// later in-memory edits can't corrupt the baseline. This makes _syncSubset
// write ONLY genuinely-changed docs (so a non-owner save never touches docs it
// doesn't own) and delete docs removed since the last load.
function _seedSyncBaseline() {
  const cache = {};
  const set = (key, id, data) => { (cache[key] || (cache[key] = new Map())).set(id, _canon(data)); };
  for (const e of (_dataRaw.entries || []))   set('entries:'  + e.base, _entryDocId(e.base, e.id),   _entryDocData(e, e.base));
  for (const s of (_dataRaw.sections || []))  set('sections:' + s.base, _sectionDocId(s.base, s.num), Object.assign(_stripPasskey(s), { base: s.base, num: String(s.num) }));
  for (const c of (_dataRaw.categories || [])) { const o = Object.assign({}, c); delete o.sections; delete o.entries; set('categories', String(c.id), o); }
  for (const m of (_dataRaw.team || []))          set('team', String(m.id), _stripPasskey(m));
  for (const a of (_dataRaw.announcements || [])) set('announcements', String(a.id), Object.assign({}, a));
  _dataSyncCache = cache;
  // Singletons: seed from the in-memory values computed the SAME way the write
  // serializes them, so an unchanged save is correctly skipped.
  if (typeof SITE_SETTINGS !== 'undefined' && SITE_SETTINGS) _dataSyncCache['__singleton:site'] = _canon(Object.assign({}, SITE_SETTINGS));
  if (typeof SIDEBAR_CFG !== 'undefined') _dataSyncCache['__singleton:sidebar'] = _canon({ items: SIDEBAR_CFG || [] });
  if (typeof SYNONYMS !== 'undefined') _dataSyncCache['__singleton:synonyms'] = _canon({ groups: encodeForFirestore('synonyms', SYNONYMS || []) });
}

// Upsert changed items + delete removed ones for one logical subset of a
// collection (e.g. entries with base 'handbook'). idFn → doc id; docFn → data.
// Diffs against the baseline pre-seeded by _seedSyncBaseline. (Extra trailing
// args from older call sites are ignored.)
async function _syncSubset(collName, subsetKey, items, idFn, docFn) {
  const cache = _dataSyncCache[subsetKey] || (_dataSyncCache[subsetKey] = new Map());
  const seen = new Set();
  _fbWriting = true;
  try {
    for (const it of items) {
      const id = idFn(it);
      seen.add(id);
      const data = docFn(it);
      const json = _canon(data);
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
  // Skip if unchanged — important under strict rules so a non-admin save
  // doesn't fire denied writes at these admin-only docs every time.
  const k = '__singleton:' + coll;
  const json = _canon(data);
  if (_dataSyncCache[k] === json) return;
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, coll, 'main'), data); _dataSyncCache[k] = json; }
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
          e => _entryDocId('handbook', e.id), e => _entryDocData(e, 'handbook'), _rawEntries('handbook'));
      case 'projectEntries':
        return _syncSubset('entries', 'entries:projects', value || [],
          e => _entryDocId('projects', e.id), e => _entryDocData(e, 'projects'), _rawEntries('projects'));
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
            e => _entryDocId(c.id, e.id), e => _entryDocData(e, c.id), _rawEntries(c.id));
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
            e => _entryDocId(rid, e.id), e => _entryDocData(e, rid), _rawEntries(rid));
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

// Project passkey read (for the unlock prompt) + per-device unlock record so
// the strict rules permit this device to edit that project section's entries.
async function dataReadProjectPasskey(base, num) {
  try {
    const snap = await _fb_getDoc(_fb_doc(_fbDb, 'project-secrets', _sectionDocId(base, num)));
    return snap.exists() ? (snap.data().passkey || '') : '';
  } catch (e) { console.error('dataReadProjectPasskey failed:', e); return ''; }
}
async function dataWriteProjectUnlock(base, num) {
  const uid = fbCurrentUid();
  if (!uid) return false;
  const lockId = uid + '__' + _sectionDocId(base, num);   // uid__projects__num
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'project-unlocks', lockId), { unlockedAt: _fb_serverTimestamp() }); return true; }
  catch (e) { console.error('dataWriteProjectUnlock failed:', e); return false; }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}
async function dataDeleteProjectUnlock(base, num) {
  const uid = fbCurrentUid();
  if (!uid) return;
  _fbWriting = true;
  try { await _fb_deleteDoc(_fb_doc(_fbDb, 'project-unlocks', uid + '__' + _sectionDocId(base, num))); }
  catch (e) { console.error('dataDeleteProjectUnlock failed:', e); }
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
