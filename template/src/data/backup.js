/* ══════════════════════════════════════════════════════════════
   EXPORT / IMPORT  (extracted from app.js, PR-17). JSON backup
   download + restore-all. Global; loaded before app.js; reads/writes
   all in-memory state arrays + DEFAULT_* + saveAll cross-file.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   EXPORT / IMPORT
   ══════════════════════════════════════════ */
function exportData() {
  const data = {
    sections: SECTIONS, handbook: HANDBOOK,
    projects: PROJECTS, projectEntries: PROJECT_ENTRIES,
    customCategories: CUSTOM_CATEGORIES,
    settings: SITE_SETTINGS,
    sidebar: SIDEBAR_CFG,
    announcements: ANNOUNCEMENTS, synonyms: SYNONYMS, team: TEAM_DIRECTORY,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'vl-dashboard-backup.json'; a.click();
  URL.revokeObjectURL(a.href);
  showToast('Exported backup');
}

/* ──────────────────────────────────────────────────────────
   NON-DESTRUCTIVE MERGE IMPORT
   Upsert-by-key: records whose key matches a live one are
   field-merged (incoming wins); unmatched records are added;
   nothing live is ever deleted. Collections absent from the
   file are left untouched — so a partial "patch" file (e.g.
   just { handbook: [oneEntry] }) touches only that record.
   Keys mirror model.js:219-223 — entries/team/announcements
   by `id`, sections by `num`, categories by `id` (with their
   nested sections/entries merged by their own keys).
   ────────────────────────────────────────────────────────── */
function _mergeByKey(target, incoming, keyFn) {
  if (!Array.isArray(incoming)) return target;
  const arr = Array.isArray(target) ? target.slice() : [];
  const idx = new Map(arr.map((rec, i) => [keyFn(rec), i]));
  for (const rec of incoming) {
    const k = keyFn(rec);
    if (idx.has(k)) arr[idx.get(k)] = Object.assign({}, arr[idx.get(k)], rec); // field-level merge
    else { idx.set(k, arr.length); arr.push(rec); }
  }
  return arr;
}

function _mergeCategories(target, incoming) {
  if (!Array.isArray(incoming)) return target;
  const arr = Array.isArray(target) ? target.slice() : [];
  const idx = new Map(arr.map((c, i) => [String(c.id), i]));
  for (const inc of incoming) {
    const k = String(inc.id);
    if (idx.has(k)) {
      const cur = arr[idx.get(k)];
      const merged = Object.assign({}, cur, inc);
      merged.sections = _mergeByKey(cur.sections || [], inc.sections || [], s => String(s.num));
      merged.entries  = _mergeByKey(cur.entries  || [], inc.entries  || [], e => String(e.id));
      arr[idx.get(k)] = merged;
    } else { idx.set(k, arr.length); arr.push(inc); }
  }
  return arr;
}

const _MERGE_KNOWN_KEYS = ['sections','handbook','projects','projectEntries','customCategories','settings','sidebar','announcements','synonyms','team'];

function mergeImportData(e) {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data || typeof data !== 'object' || Array.isArray(data)) { alert('Invalid backup file.'); return; }
      const present = _MERGE_KNOWN_KEYS.filter(k => data[k] !== undefined);
      if (!present.length) { alert('No recognizable data in file (expected handbook, sections, team, etc.).'); return; }
      if (!await customConfirm('Merge ' + present.join(', ') + ' from this file?\n\nMatching IDs are updated, new records are added, and nothing is deleted.', { confirmLabel: 'Merge' })) return;

      // Lock the sidebar (scrim + spinner + no controls, can't leave admin)
      // until the import's writes settle — same UX as drag-reorder.
      await withSidebarSaving(async () => {
        if (data.handbook       !== undefined) HANDBOOK          = _mergeByKey(HANDBOOK,        data.handbook,       x => String(x.id));
        if (data.projectEntries !== undefined) PROJECT_ENTRIES   = _mergeByKey(PROJECT_ENTRIES, data.projectEntries, x => String(x.id));
        if (data.sections       !== undefined) SECTIONS          = _mergeByKey(SECTIONS,        data.sections,       x => String(x.num));
        if (data.projects       !== undefined) PROJECTS          = _mergeByKey(PROJECTS,        data.projects,       x => String(x.num));
        if (data.announcements  !== undefined) ANNOUNCEMENTS     = _mergeByKey(ANNOUNCEMENTS,   data.announcements,  x => String(x.id));
        if (data.team           !== undefined) TEAM_DIRECTORY    = _mergeByKey(TEAM_DIRECTORY,  data.team,           x => String(x.id));
        if (data.customCategories !== undefined) CUSTOM_CATEGORIES = _mergeCategories(CUSTOM_CATEGORIES, data.customCategories);
        if (data.settings       !== undefined) SITE_SETTINGS     = Object.assign({}, SITE_SETTINGS, data.settings);
        if (data.sidebar        !== undefined) SIDEBAR_CFG       = data.sidebar;   // singleton: replace-if-present
        if (data.synonyms       !== undefined) SYNONYMS          = data.synonyms;  // singleton: replace-if-present

        saveAll('Merge complete');
        // Edited entries may carry stale/missing embeddings — backfill in the background.
        setTimeout(() => runBackfillEmbeddings(), 500);
        applyAllSettings(); renderSidebar(); renderAnnouncements(); showHome();
      });
    } catch(err) { alert('Could not parse file: ' + err.message); }
  };
  r.readAsText(file); e.target.value = '';
}

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.handbook) { alert('Invalid backup file.'); return; }
      if (!await customConfirm('This will replace all data (handbook, projects, sidebar, announcements, synonyms, team). Continue?', { danger: true, confirmLabel: 'Replace all data' })) return;
      // Lock the sidebar (scrim + spinner + no controls, can't leave admin)
      // until the import's writes settle — same UX as drag-reorder.
      await withSidebarSaving(async () => {
        SECTIONS = data.sections || clone(DEFAULT_SECTIONS);
        HANDBOOK = data.handbook;
        PROJECTS = data.projects || [];
        PROJECT_ENTRIES = data.projectEntries || [];
        CUSTOM_CATEGORIES = data.customCategories || [];
        SITE_SETTINGS = data.settings ? Object.assign({}, DEFAULT_SITE_SETTINGS, data.settings) : clone(DEFAULT_SITE_SETTINGS);
        SIDEBAR_CFG = data.sidebar || clone(DEFAULT_SIDEBAR_CFG);
        ANNOUNCEMENTS = data.announcements || [];
        SYNONYMS = data.synonyms || clone(DEFAULT_SYNONYMS);
        TEAM_DIRECTORY = data.team || [];
        dismissedAnns = new Set();
        saveAll('Import complete');
        // Imported entries likely lack current-version embeddings — backfill in the background.
        setTimeout(() => runBackfillEmbeddings(), 500);
        applyAllSettings(); renderSidebar(); renderAnnouncements(); showHome();
      });
    } catch(err) { alert('Could not parse file: ' + err.message); }
  };
  r.readAsText(file); e.target.value = '';
}
