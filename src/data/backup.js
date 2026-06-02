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

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.handbook) { alert('Invalid backup file.'); return; }
      if (!await customConfirm('This will replace all data (handbook, projects, sidebar, announcements, synonyms, team). Continue?', { danger: true, confirmLabel: 'Replace all data' })) return;
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
    } catch(err) { alert('Could not parse file: ' + err.message); }
  };
  r.readAsText(file); e.target.value = '';
}
