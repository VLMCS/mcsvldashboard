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
function _dataRebuildArrays() {
  const entries  = _dataRaw.entries  || [];
  const sections = _dataRaw.sections || [];
  const byBaseEntries  = (b) => entries.filter(e => e.base === b);
  const byBaseSections = (b) => sections.filter(s => s.base === b);

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
  const sub = (coll, apply) => {
    const unsub = _fb_onSnapshot(_fb_collection(_fbDb, coll), (snap) => {
      if (_fbWriting) return;               // ignore our own write echoes
      apply(snap.docs.map(d => d.data()));
      _dataRebuildArrays();
      _dataReRender();
    });
    _dataUnsubs.push(unsub);
  };
  const subDoc = (coll, key) => {
    const unsub = _fb_onSnapshot(_fb_doc(_fbDb, coll, 'main'), (snap) => {
      if (_fbWriting) return;
      _dataRaw[key] = snap.exists() ? snap.data() : null;
      _dataRebuildArrays();
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

// Upsert changed items + delete removed ones for one logical subset of a
// collection (e.g. entries with base 'handbook'). idFn → doc id; docFn → data.
async function _syncSubset(collName, subsetKey, items, idFn, docFn) {
  const cache = _dataSyncCache[subsetKey] || (_dataSyncCache[subsetKey] = new Map());
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
          e => _entryDocId('handbook', e.id), e => Object.assign({}, e, { base: 'handbook' }));
      case 'projectEntries':
        return _syncSubset('entries', 'entries:projects', value || [],
          e => _entryDocId('projects', e.id), e => Object.assign({}, e, { base: 'projects' }));
      case 'sections':
        return _syncSubset('sections', 'sections:handbook', value || [],
          s => _sectionDocId('handbook', s.num), s => Object.assign(_stripPasskey(s), { base: 'handbook', num: String(s.num) }));
      case 'projects':
        return _syncSubset('sections', 'sections:projects', value || [],
          s => _sectionDocId('projects', s.num), s => Object.assign(_stripPasskey(s), { base: 'projects', num: String(s.num) }));
      case 'announcements':
        return _syncSubset('announcements', 'announcements', value || [],
          a => String(a.id), a => Object.assign({}, a));
      case 'team':
        return _syncSubset('team', 'team', value || [],
          m => String(m.id), m => _stripPasskey(m));
      case 'customCategories': {
        const cats = value || [];
        // category metadata docs (without the nested sections/entries arrays)
        await _syncSubset('categories', 'categories', cats,
          c => String(c.id), c => { const o = Object.assign({}, c); delete o.sections; delete o.entries; return o; });
        // each category's sections + entries, namespaced by base=catId
        for (const c of cats) {
          await _syncSubset('sections', 'sections:' + c.id, c.sections || [],
            s => _sectionDocId(c.id, s.num), s => Object.assign(_stripPasskey(s), { base: c.id, num: String(s.num) }));
          await _syncSubset('entries', 'entries:' + c.id, c.entries || [],
            e => _entryDocId(c.id, e.id), e => Object.assign({}, e, { base: c.id }));
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

/* ════════════════ Passkey hashes (migration + reset flow) ════════════════ */
async function dataSetPasskeyHash(tmId, plaintextPasskey) {
  const salt = _data_randomHex(16);
  const passkeyHash = await _data_sha256Hex(salt + String(plaintextPasskey).trim().toUpperCase());
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'team-secrets', String(tmId)), { passkeyHash, salt }); }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}
async function dataSetProjectPasskey(base, num, plaintextPasskey) {
  const salt = _data_randomHex(16);
  const passkeyHash = await _data_sha256Hex(salt + String(plaintextPasskey).trim().toUpperCase());
  _fbWriting = true;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'project-secrets', _sectionDocId(base, num)), { passkeyHash, salt }); }
  finally { setTimeout(() => { _fbWriting = false; }, 200); }
}
