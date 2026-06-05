/* ══════════════════════════════════════════
   DEFAULT DATA
   ══════════════════════════════════════════ */
const DEFAULT_SECTIONS = [
  { num:'1', title:'Getting Started', description:'Welcome to your new dashboard. Edit or replace this section to fit your team.' }
];

const DEFAULT_HANDBOOK = [
  { id:'1.1', section:'1. Getting Started', title:'Welcome',
    keywords:['welcome','getting started','intro','introduction','setup','help'],
    content:`<p>This is your dashboard's first handbook entry. Enter <strong>Admin Mode</strong> to edit or delete it, add new sections from the sidebar, and start building out your team's handbook.</p><p>Use <em>Site Settings</em> to change the name, colors, and logo at any time.</p>`
  }
];

const DEFAULT_SIDEBAR_CFG = [
  { id:'quicklinks', label:'Quick Links', items:[] }
];

// Editable branding strings. Admins change these via "⚙ Site Settings" and the
// new values propagate everywhere on the page + Firestore. Generic defaults —
// the setup wizard overwrites these with the new owner's answers.
const DEFAULT_SITE_SETTINGS = {
  siteName:        'Dashboard',
  studioName:      'Your Studio',
  departmentName:  'Your Department',
  heroSub:         'Browse from the sidebar, or search for anything below.',
  handbookLabel:   'Handbook',
  quicklinksLabel: 'Quick Links',
  projectsLabel:   'Projects',
  favicon:         '',  // data URL of an .ico/.png (empty = browser default)
  keywordSearchEnabled: true,
  aiSearchEnabled:      true,
  theme: {
    light: { accent: '#2563eb', bg: '#f5f6f8', text: '#0d0d0d', sidebarBg: '#fafafa' },
    dark:  { accent: '#60a5fa', bg: '#161616', text: '#ededeb', sidebarBg: '#111111' }
  }
};
const FAVICON_MAX_BYTES = 64 * 1024; // 64 KB cap

// A small, generic starter synonym set (the art-specific groups were removed).
const DEFAULT_SYNONYMS = [
  ['handbook','guide','docs','documentation','manual'],
  ['team','staff','people','members','directory'],
  ['onboarding','getting started','setup','orientation','first day'],
  ['search','find','lookup','look up'],
  ['settings','config','configuration','preferences','options']
];

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
let SECTIONS = [];          // Handbook section definitions
let HANDBOOK = [];          // Handbook entries
let PROJECTS = [];          // Project "section" definitions (parallel to SECTIONS)
let PROJECT_ENTRIES = [];   // Project entries (parallel to HANDBOOK)
let CUSTOM_CATEGORIES = []; // [{ id, label, sections: [{num,title,description}], entries: [...] }]
let SITE_SETTINGS = null;   // see DEFAULT_SITE_SETTINGS
let SIDEBAR_CFG = [];
// ── AI semantic search state (Transformers.js / MiniLM) ──
// EMBED_VERSION is bumped if the model or the embed-source format ever changes —
// any entry with a different _embV is re-embedded on next backfill pass.
const EMBED_VERSION = 1;
let EMBEDDER = null;          // singleton Transformers.js pipeline (set once load resolves)
let EMBEDDER_LOADING = null;  // in-flight Promise during model download; null when idle or ready
let EMBEDDER_FAILED = false;  // sticky flag: load was attempted and failed (keyword-only forever this session)
let BACKFILL_RUNNING = false; // prevents two backfill passes overlapping (e.g. user search triggers load while initial backfill is queued)
let ANNOUNCEMENTS = [];
let SYNONYMS = [];
let TEAM_DIRECTORY = [];
let dismissedAnns = new Set();
let expandedSections = new Set();  // tracks expanded sidebar groups — keys are "handbook:1" / "projects:1"
let collapsedCategories = new Set();  // main category IDs the user has collapsed in the sidebar
let unlockedProjects = new Set();     // project section nums where user entered the correct passkey this session

// ── Login / current user ──────────────────────────────────────────────────
// currentUser is the team member whose passkey was used at login (or null if
// the dashboard was unlocked via admin password without a specific identity).
// Only the holder of a profile's passkey can edit it; admins can edit anyone.
//
// Persistence: "Stay signed in for this session" stores in **sessionStorage** —
// survives refresh + same-tab navigation, ends when the browser is closed.
// Unchecked → no storage at all, so every refresh requires re-login (a strict
// opt-in for shared/public devices). localStorage is intentionally NOT used;
// a one-shot legacy migration in loadCurrentUser folds older localStorage
// sessions forward so existing users aren't surprise-signed-out.
let currentUser = null;             // { tmId, slackName, passkey } | null
let currentUserPersistent = false;  // true → stored in sessionStorage; false → not stored
const LOGIN_KEY = 'vl_session_user';

let isAdminMode = false;
let _isGuest = false;               // true → read-only "Sign in as guest" session (no identity, no edit)
let sidebarCollapsed = false;
let isDark = false;
let currentView = 'home';
let currentSectionNum = null;
let currentEntryId = null;
let currentBase = 'handbook';    // 'handbook' or 'projects'
let docViewBase = 'handbook';    // base currently shown in the Documentation View
let lightboxZoom = 1;

let dragSrcSection = null;
let dragSrcItemId = null;
let dragSrcType = null;     // 'entry' | 'section' | 'siItem'
let dragSrcBase = null;     // base id for 'entry' and 'section' drags (cross-base drops are rejected)

let editEntryId = null;
let editEntryPresetId = null;     // preset (auto) id for a new entry/sub being created via the modal
let editEntryBase = 'handbook';   // base of the entry currently being edited
let editSectionNum = null;
let editSectionBase = 'handbook'; // base of the section being edited
let editSISection = null;
let editSIItemId = null;
let editAnnId = null;
let editEntrySrcSection = null;

let activeEditor = null;

/* ══════════════════════════════════════════
   PERSISTENCE
   ══════════════════════════════════════════ */
function loadFromStorage() {
  try { const v=localStorage.getItem('vl_sections'); SECTIONS = v ? JSON.parse(v) : clone(DEFAULT_SECTIONS); } catch(e){ SECTIONS=clone(DEFAULT_SECTIONS); }
  try { const v=localStorage.getItem('vl_hb');       HANDBOOK = v ? JSON.parse(v) : clone(DEFAULT_HANDBOOK); } catch(e){ HANDBOOK=clone(DEFAULT_HANDBOOK); }
  try { const v=localStorage.getItem('vl_projects'); PROJECTS = v ? JSON.parse(v) : []; } catch(e){ PROJECTS=[]; }
  try { const v=localStorage.getItem('vl_pe');       PROJECT_ENTRIES = v ? JSON.parse(v) : []; } catch(e){ PROJECT_ENTRIES=[]; }
  try { const v=localStorage.getItem('vl_cats');     CUSTOM_CATEGORIES = v ? JSON.parse(v) : []; } catch(e){ CUSTOM_CATEGORIES=[]; }
  try {
    const v=localStorage.getItem('vl_settings');
    SITE_SETTINGS = v ? Object.assign({}, DEFAULT_SITE_SETTINGS, JSON.parse(v)) : clone(DEFAULT_SITE_SETTINGS);
  } catch(e){ SITE_SETTINGS = clone(DEFAULT_SITE_SETTINGS); }
  try { const v=localStorage.getItem('vl_sb');       SIDEBAR_CFG = v ? JSON.parse(v) : clone(DEFAULT_SIDEBAR_CFG); } catch(e){ SIDEBAR_CFG=clone(DEFAULT_SIDEBAR_CFG); }
  try { const v=localStorage.getItem('vl_ann');      ANNOUNCEMENTS = v ? JSON.parse(v) : []; } catch(e){ ANNOUNCEMENTS=[]; }
  try { const v=localStorage.getItem('vl_syn');      SYNONYMS = v ? JSON.parse(v) : clone(DEFAULT_SYNONYMS); } catch(e){ SYNONYMS=clone(DEFAULT_SYNONYMS); }
  try { const v=localStorage.getItem('vl_team');     TEAM_DIRECTORY = v ? JSON.parse(v) : []; } catch(e){ TEAM_DIRECTORY=[]; }
  try { const v=localStorage.getItem('vl_dis');      dismissedAnns = new Set(v ? JSON.parse(v) : []); } catch(e){ dismissedAnns=new Set(); }
  try { const v=localStorage.getItem('vl_exp');      expandedSections = new Set(v ? JSON.parse(v) : []); } catch(e){ expandedSections=new Set(); }
  try { const v=localStorage.getItem('vl_cc');       collapsedCategories = new Set(v ? JSON.parse(v) : []); } catch(e){ collapsedCategories=new Set(); }
  // Project unlocks persist for THIS browser session via sessionStorage (cleared on browser close).
  try { const v=sessionStorage.getItem('vl_unlocked'); unlockedProjects = new Set(v ? JSON.parse(v) : []); } catch(e){ unlockedProjects=new Set(); }
  try { sidebarCollapsed = localStorage.getItem('vl_sc') === '1'; } catch(e){}
  try { isDark = localStorage.getItem('vl_dark') === '1'; } catch(e){}

  // ── Migrate legacy data ──
  // Old versions stored Handbook items + divider entries inside SIDEBAR_CFG.
  // The new sidebar auto-generates the Handbook section, so strip those.
  if (Array.isArray(SIDEBAR_CFG)) {
    // Strip legacy/obsolete sections: dividers, the old auto-handbook entry, and the
    // old "team" section (Team Directory is now a modal, not a sidebar section).
    const cleaned = SIDEBAR_CFG.filter(s =>
      s && !s.divider && Array.isArray(s.items) && s.id && s.id !== 'handbook' && s.id !== 'team'
    );
    // Make sure Quick Links exists
    const hasQL = cleaned.some(s => s.id === 'quicklinks');
    if (!hasQL) cleaned.push(clone(DEFAULT_SIDEBAR_CFG.find(s => s.id === 'quicklinks')));
    if (cleaned.length !== SIDEBAR_CFG.length) {
      SIDEBAR_CFG = cleaned;
      try { localStorage.setItem('vl_sb', JSON.stringify(SIDEBAR_CFG)); } catch(e){}
    } else {
      SIDEBAR_CFG = cleaned;
    }
  } else {
    SIDEBAR_CFG = clone(DEFAULT_SIDEBAR_CFG);
  }
  if (!Array.isArray(SECTIONS) || SECTIONS.length === 0) SECTIONS = clone(DEFAULT_SECTIONS);
  if (!Array.isArray(HANDBOOK) || HANDBOOK.length === 0) HANDBOOK = clone(DEFAULT_HANDBOOK);

  // Backfill passkeys for any existing team members that pre-date the passkey
  // system. New members get one in blankTm() so this is only relevant for
  // upgrade — but is also safe to run on every boot (no-op if all have one).
  _ensureTeamPasskeys();
}

function saveAll(label, opts) {
  localStorage.setItem('vl_sections', JSON.stringify(SECTIONS));
  localStorage.setItem('vl_hb',       JSON.stringify(HANDBOOK));
  localStorage.setItem('vl_projects', JSON.stringify(PROJECTS));
  localStorage.setItem('vl_pe',       JSON.stringify(PROJECT_ENTRIES));
  localStorage.setItem('vl_cats',     JSON.stringify(CUSTOM_CATEGORIES));
  localStorage.setItem('vl_settings', JSON.stringify(SITE_SETTINGS));
  localStorage.setItem('vl_sb',       JSON.stringify(SIDEBAR_CFG));
  localStorage.setItem('vl_ann',      JSON.stringify(ANNOUNCEMENTS));
  localStorage.setItem('vl_syn',      JSON.stringify(SYNONYMS));
  localStorage.setItem('vl_team',     JSON.stringify(TEAM_DIRECTORY));
  localStorage.setItem('vl_dis',      JSON.stringify([...dismissedAnns]));
  localStorage.setItem('vl_exp',      JSON.stringify([...expandedSections]));
  fbSync(); // push to Firebase if configured
  if (!opts || !opts.silent) showToast(label || 'Changes saved');
}

function saveSynonymsOnly() {
  localStorage.setItem('vl_syn', JSON.stringify(SYNONYMS));
  fbSyncKey('synonyms', SYNONYMS);
  showToast('Synonyms updated');
}

function saveTeamOnly() {
  localStorage.setItem('vl_team', JSON.stringify(TEAM_DIRECTORY));
  fbSyncKey('team', TEAM_DIRECTORY);
  showToast('Team directory saved');
}

function saveSidebarOnly() {
  localStorage.setItem('vl_hb', JSON.stringify(HANDBOOK));
  localStorage.setItem('vl_pe', JSON.stringify(PROJECT_ENTRIES));
  localStorage.setItem('vl_sb', JSON.stringify(SIDEBAR_CFG));
  fbSyncKey('handbook', HANDBOOK);
  fbSyncKey('projectEntries', PROJECT_ENTRIES);
  fbSyncKey('sidebar', SIDEBAR_CFG);
  showToast('Sidebar updated');
}

function saveAnnsOnly() {
  localStorage.setItem('vl_ann', JSON.stringify(ANNOUNCEMENTS));
  localStorage.setItem('vl_dis', JSON.stringify([...dismissedAnns]));
  fbSyncKey('announcements', ANNOUNCEMENTS);
}

function saveExpandedOnly() {
  localStorage.setItem('vl_exp', JSON.stringify([...expandedSections]));
}
function saveCollapsedCategories() {
  localStorage.setItem('vl_cc', JSON.stringify([...collapsedCategories]));
}
function toggleCategoryCollapsed(catId) {
  if (collapsedCategories.has(catId)) collapsedCategories.delete(catId);
  else collapsedCategories.add(catId);
  saveCollapsedCategories();
  renderSidebar();
}

// Called when the user clicks a main category label (Handbook, Projects, custom, Quick Links).
// Shows a thumbnail grid of all its top-level entries in the main area.
function navigateCategory(catId, type) {
  showCategoryOverview(catId, type);
}

function sectionNumOf(entryId) { return String(entryId).split('.')[0]; }
// Generalized helpers — accept an optional `base` ID:
//   'handbook' (default), 'projects', or a custom category id (e.g. 'cat-1701234567').
function sectionsOf(base) {
  base = base || 'handbook';
  if (base === 'handbook') return SECTIONS;
  if (base === 'projects') return PROJECTS;
  const cc = (Array.isArray(CUSTOM_CATEGORIES) ? CUSTOM_CATEGORIES : []).find(c => c.id === base);
  return cc ? cc.sections : SECTIONS; // safe fallback
}
function entriesOf(base) {
  base = base || 'handbook';
  if (base === 'handbook') return HANDBOOK;
  if (base === 'projects') return PROJECT_ENTRIES;
  const cc = (Array.isArray(CUSTOM_CATEGORIES) ? CUSTOM_CATEGORIES : []).find(c => c.id === base);
  return cc ? cc.entries : HANDBOOK;
}
function findSection(num, base) { return sectionsOf(base).find(s => s.num === String(num)); }
function findEntry(id, base) { return entriesOf(base).find(e => e.id === id); }
function entriesInSection(num, base) { return entriesOf(base).filter(e => sectionNumOf(e.id) === String(num)); }

/* ── NESTED-ENTRY HELPERS ──
   Entry IDs encode the tree: "14" (section) → "14.1" → "14.1.a" → "14.1.a.1".
   Depth = (# of dot-components) − 1. Section has depth 0.
*/
function idComponents(id) { return String(id).split('.'); }
function parentOf(id) {
  const c = idComponents(id);
  if (c.length <= 1) return null;          // section-level, no entry parent
  return c.slice(0, -1).join('.');
}
// Direct children only (one level deeper, same prefix).
function childrenOf(parentId, base) {
  const pid = String(parentId);
  const targetLen = idComponents(pid).length + 1;
  return entriesOf(base).filter(e => {
    const c = idComponents(e.id);
    return c.length === targetLen && e.id.startsWith(pid + '.');
  });
}
// All nested descendants (for delete cascade + counting).
function descendantsOf(parentId, base) {
  const prefix = String(parentId) + '.';
  return entriesOf(base).filter(e => e.id.startsWith(prefix) && e.id !== String(parentId));
}
function hasChildren(id, base) { return childrenOf(id, base).length > 0; }
// Depth-first descendants of a section/entry, in tree order (14.1, 14.1.a, 14.1.a.1, 14.1.b, 14.2…).
function entriesTreeOrder(parentId, base, acc) {
  acc = acc || [];
  for (const c of childrenOf(parentId, base)) { acc.push(c); entriesTreeOrder(c.id, base, acc); }
  return acc;
}
// Relative depth of an entry below its section (14.1 → 0, 14.1.a → 1, 14.1.a.1 → 2).
function entryDepthBelowSection(id) { return Math.max(0, idComponents(id).length - 2); }

// 0-indexed → a, b, …, z, aa, ab …
function letterFor(i) {
  let s = '';
  do { s = String.fromCharCode(97 + (i % 26)) + s; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return s;
}
// Suggest the next available child ID under parentId. Levels alternate:
// depth 1 = number (14.1), depth 2 = letter (14.1.a), depth 3 = number (14.1.a.1)…
function suggestChildId(parentId, base) {
  const childLen = idComponents(parentId).length + 1; // # components the child will have
  const useLetter = (childLen % 2 === 1);              // odd length → letter
  const existing = new Set(childrenOf(parentId, base).map(e => idComponents(e.id).pop()));
  if (useLetter) {
    let i = 0;
    while (existing.has(letterFor(i))) i++;
    return parentId + '.' + letterFor(i);
  } else {
    let n = 1;
    while (existing.has(String(n))) n++;
    return parentId + '.' + n;
  }
}

function allBaseIds() {
  const out = ['handbook', 'projects'];
  for (const c of (CUSTOM_CATEGORIES || [])) if (c && c.id) out.push(c.id);
  return out;
}

// Sections in `base` participate in 1..N auto-numbering (drag-reorder + close
// gaps after delete). Excludes 'projects' because project section numbers are
// part of /project-secrets and /project-unlocks doc IDs — renumbering there
// would orphan passkey + unlock records.
function sectionsRenumberable(base) { return (base || 'handbook') !== 'projects'; }

// Renumber sections of `base` to 1..N in their current array order, and
// rewrite every entry ID under those sections to use its new section number.
// Mutates in-memory arrays. No-op for 'projects'. Also rewrites the keys in
// `expandedSections` and updates `currentSectionNum` / `currentEntryId` if the
// active view targets a renumbered item, so the same logical row stays
// selected. Returns { numRemap, idRemap } for callers that need to fix up
// extra references (e.g. recently-viewed lists).
function renumberSectionsForBase(base) {
  base = base || 'handbook';
  const numRemap = new Map();   // oldNum -> newNum
  const idRemap  = new Map();   // oldEntryId -> newEntryId
  if (!sectionsRenumberable(base)) return { numRemap, idRemap };
  const sections = sectionsOf(base);
  const entries  = entriesOf(base);
  sections.forEach((sec, i) => {
    const newNum = String(i + 1);
    if (String(sec.num) !== newNum) numRemap.set(String(sec.num), newNum);
    sec.num = newNum;
  });
  if (numRemap.size === 0) return { numRemap, idRemap };
  for (const e of entries) {
    const oldSec = sectionNumOf(e.id);
    if (!numRemap.has(oldSec)) continue;
    const newSec = numRemap.get(oldSec);
    idRemap.set(e.id, newSec + String(e.id).slice(oldSec.length));
  }
  for (const e of entries) {
    if (!idRemap.has(e.id)) continue;
    e.id = idRemap.get(e.id);
    const sec = findSection(sectionNumOf(e.id), base);
    if (sec) e.section = `${sec.num}. ${sec.title}`;
  }
  // Migrate expandedSections keys (stored as "base:numOrId").
  if (typeof expandedSections !== 'undefined' && expandedSections instanceof Set) {
    for (const key of [...expandedSections]) {
      const colon = key.indexOf(':');
      if (colon === -1 || key.slice(0, colon) !== base) continue;
      const v = key.slice(colon + 1);
      const nv = idRemap.has(v) ? idRemap.get(v) : (numRemap.has(v) ? numRemap.get(v) : null);
      if (nv !== null) { expandedSections.delete(key); expandedSections.add(base + ':' + nv); }
    }
  }
  // Keep the active view pointing at the same logical item.
  if (typeof currentBase !== 'undefined' && currentBase === base) {
    if (currentView === 'entry' && currentEntryId && idRemap.has(currentEntryId)) {
      currentEntryId = idRemap.get(currentEntryId);
      currentSectionNum = sectionNumOf(currentEntryId);
    } else if (currentSectionNum != null && numRemap.has(String(currentSectionNum))) {
      currentSectionNum = numRemap.get(String(currentSectionNum));
    }
  }
  return { numRemap, idRemap };
}

// Renumber the direct children of `parentId` (which can be a section number
// like "14" OR an entry id like "14.2") to take positions 0..N-1 in the order
// given by `orderedChildren` (an array of entry objects already present in
// entriesOf(base)). Cascades the rename to EVERY descendant of every renamed
// child (a child's subtree follows when its root id changes). Mutates the
// entries in place. Also migrates expandedSections keys and the active-view
// globals so the same logical entry stays selected. Returns Map(oldEntryId →
// newEntryId).
//
// Naming follows the same depth-alternating pattern as suggestChildId: a
// parent at length L gets children with last-segment numbers when L+1 is
// even ("14"→"14.1", "14.2") and letters when L+1 is odd ("14.1"→"14.1.a").
function renumberChildrenInOrder(parentId, base, orderedChildren) {
  base = base || 'handbook';
  const idRemap = new Map();
  if (!Array.isArray(orderedChildren) || orderedChildren.length === 0) return idRemap;
  const parentStr = String(parentId);
  const childLen = idComponents(parentStr).length + 1;
  const useLetter = (childLen % 2 === 1);
  for (let i = 0; i < orderedChildren.length; i++) {
    const kid = orderedChildren[i];
    if (!kid || !kid.id) continue;
    const newLast = useLetter ? letterFor(i) : String(i + 1);
    const newKidId = parentStr + '.' + newLast;
    if (kid.id === newKidId) continue;
    idRemap.set(kid.id, newKidId);
    // Cascade: every descendant of this kid inherits the new prefix.
    for (const d of descendantsOf(kid.id, base)) {
      idRemap.set(d.id, newKidId + d.id.slice(kid.id.length));
    }
  }
  if (idRemap.size === 0) return idRemap;
  const arr = entriesOf(base);
  for (const e of arr) {
    if (!idRemap.has(e.id)) continue;
    e.id = idRemap.get(e.id);
    const sec = findSection(sectionNumOf(e.id), base);
    if (sec) e.section = `${sec.num}. ${sec.title}`;
  }
  // Re-sort the array by natural id order so childrenOf (which preserves
  // array order) returns the user's intended order on the very next render.
  // A swap-style reorder (e.g. 14.2 ↔ 14.1) only rewrites IDs without
  // moving array positions, so without this resort the new "14.1" still
  // lives at the old "14.2" slot in the array and the rows render in the
  // wrong order until the next snapshot rebuild sorts it for us.
  if (typeof _natCmpId === 'function') arr.sort((x, y) => _natCmpId(x.id, y.id));
  // Migrate expandedSections keys (entry ids appear as "base:entryId").
  if (typeof expandedSections !== 'undefined' && expandedSections instanceof Set) {
    for (const key of [...expandedSections]) {
      const colon = key.indexOf(':');
      if (colon === -1 || key.slice(0, colon) !== base) continue;
      const v = key.slice(colon + 1);
      if (idRemap.has(v)) {
        expandedSections.delete(key);
        expandedSections.add(base + ':' + idRemap.get(v));
      }
    }
  }
  // Keep the active view pointing at the same logical entry.
  if (typeof currentBase !== 'undefined' && currentBase === base
      && currentView === 'entry' && currentEntryId && idRemap.has(currentEntryId)) {
    currentEntryId = idRemap.get(currentEntryId);
    currentSectionNum = sectionNumOf(currentEntryId);
  }
  return idRemap;
}
// Lookup an entry by id across all bases — returns { entry, base } or null.
function findEntryAnywhere(id) {
  for (const base of allBaseIds()) {
    const e = entriesOf(base).find(x => x.id === id);
    if (e) return { entry: e, base };
  }
  return null;
}
function showToast(msg) {
  const t = document.getElementById('save-toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2000);
}

// Look up the display label for a top-level category (uses SITE_SETTINGS
// for built-ins, CUSTOM_CATEGORIES[].label for custom, fall back to SIDEBAR_CFG).
function getCategoryLabel(catId) {
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  if (catId === 'handbook')  return s.handbookLabel  || 'Handbook';
  if (catId === 'projects')  return s.projectsLabel  || 'Projects';
  if (catId === 'quicklinks') return s.quicklinksLabel || 'Quick Links';
  const cc = (CUSTOM_CATEGORIES || []).find(c => c.id === catId);
  if (cc) return cc.label;
  const sec = (SIDEBAR_CFG || []).find(s => s.id === catId);
  return sec ? sec.label : catId;
}

// Apply all SITE_SETTINGS values to the live DOM (title, logo, hero, favicon, theme).
// Called once on init and after each Save in the settings modal.
function applyAllSettings() {
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  // Document title
  document.title = `${s.siteName} — ${s.studioName}`;
  // Sidebar logo
  const studioLbl = document.querySelector('#sidebar-logo .studio-label');
  const siteH1    = document.querySelector('#sidebar-logo h1');
  if (studioLbl) studioLbl.textContent = s.studioName;
  if (siteH1)    siteH1.textContent    = s.siteName;
  // Home hero
  const heroLbl   = document.querySelector('#view-home .hero-label');
  const heroTitle = document.querySelector('#view-home .hero-title');
  const heroSub   = document.querySelector('#view-home .hero-sub');
  if (heroLbl)   heroLbl.textContent   = `${s.departmentName} · ${s.studioName}`;
  if (heroTitle) heroTitle.textContent = s.siteName;
  if (heroSub)   heroSub.textContent   = s.heroSub;
  // Favicon
  applyFavicon(s.favicon || '');
  // Theme
  applyTheme(s.theme);
}

/* ══════════════════════════════════════════
   INIT
   The boot sequence is now:
     1. loadFromStorage()                    — populates SITE_SETTINGS / TEAM_DIRECTORY etc.
     2. Apply theme + render sidebar (login overlay sits on top).
     3. _startFirebaseInBackground()         — kicks off Firebase init NON-BLOCKINGLY.
        Why up here instead of after login: a fresh browser (e.g. you created
        your profile in Opera, then opened Chrome) has no cached TEAM_DIRECTORY
        in localStorage, so the login passkey lookup would miss every time.
        Pre-fetching the remote team data in parallel with showing the login
        screen fixes that — by the time the user types their code, the
        directory is available. Refreshes also no longer flash a blocking
        "LOADING…" overlay; the maintenance overlay only appears if Firebase
        actually fails for an extended period.
     4. Decide login vs resume:
          - Session restored from sessionStorage → just paint the dashboard.
          - Otherwise                            → show the login screen.
     5. loginTry awaits the Firebase fetch when the local lookup misses, so
        cross-browser logins always see the latest team list.
   ══════════════════════════════════════════ */
loadFromStorage();
if (sidebarCollapsed) document.getElementById('sidebar').classList.add('collapsed');
applyDark(isDark);
applyAllSettings();
renderSidebar();
renderAnnouncements();
showHome();
_rtSetupVideoFallback();   // local-file: swap blocked video embeds for clickable posters

// Background Firebase pre-fetch — sets _fbInitPromise / _fbInitResult so
// loginTry can await it. Surfaces status via the #fb-status-dot in the
// sidebar; only escalates to the blocking "LOADING…" maintenance overlay
// on hard failure (after a grace period) or hang (12s timeout).
let _fbInitPromise = null;
let _fbInitResult  = null;  // null = pending, true = ok, false = failed
function _startFirebaseInBackground() {
  if (_fbInitPromise) return _fbInitPromise;

  const _fbDot = document.getElementById('fb-status-dot');
  if (_fbDot) {
    _fbDot.classList.remove('connected', 'offline');
    _fbDot.title = 'Connecting to shared dashboard…';
  }

  if (!fbConfigured()) {
    _fbInitResult = false;
    if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Running offline (no Firebase config). See FIREBASE_CONFIG in the file to enable sharing.'; }
    // Surface the "down" overlay shortly after boot so the user understands
    // why nothing is syncing — but don't BLOCK the page on it.
    setTimeout(() => { if (_fbInitResult === false && !_maintBypassed) showMaintenance('down'); }, 4000);
    _fbInitPromise = Promise.resolve(false);
    return _fbInitPromise;
  }

  _fbInitPromise = initFirebase().then(ok => {
    _fbInitResult = !!ok;
    if (ok) {
      // Hide the maintenance overlay if it had been escalated.
      hideMaintenance();
      // Repaint anything that may have changed from the remote pull —
      // sidebar (entries / projects / sections), announcements, and the
      // sign-out chip (slack name may have been edited remotely).
      renderSidebar();
      renderAnnouncements();
      _renderSignOutChip();
      if (_fbDot) { _fbDot.classList.add('connected'); _fbDot.title = 'Connected to shared dashboard'; }
      // Backfill any entries missing embeddings, deferred so boot stays snappy.
      setTimeout(() => runBackfillEmbeddings(), 1500);
    } else {
      if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Cannot reach the shared dashboard.'; }
      // Give the user a moment with whatever local data we have, then surface
      // the down overlay so it's clear something's wrong. Admin can bypass.
      setTimeout(() => { if (_fbInitResult === false && !_maintBypassed) showMaintenance('down'); }, 6000);
    }
    return ok;
  }).catch(e => {
    _fbInitResult = false;
    if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Firebase init error.'; }
    return false;
  });

  // Hard hang: if neither path settles in 12s, escalate to the overlay so
  // the user has the admin-bypass affordance and isn't staring at a dead UI.
  setTimeout(() => {
    if (_fbInitResult === null && !_maintBypassed) showMaintenance('down');
  }, 12000);

  return _fbInitPromise;
}

// Kick off Firebase NOW — non-blocking. The login screen will show
// immediately on top while this loads in the background.
_startFirebaseInBackground();

// Tracks whether this device's UID is a bound admin (new model). Set during
// resume + after admin bootstrap/promote.
let _boundIsAdmin = false;

// Decide login vs resume.
//  - OLD model: synchronous sessionStorage check (passkey validated locally).
//  - NEW model: the "is this device logged in?" answer is a Firestore read of
//    /users/{uid}, which needs Firebase ready — so we show the login overlay,
//    wait for init, then resume if the device is bound.
function _decideLoginOrResume() {
  if (!USE_NEW_DATA_MODEL) {
    const restored = loadCurrentUser();
    if (restored) _renderSignOutChip();   // straight to dashboard
    else showLogin();
    return;
  }
  // Avoid flashing the login overlay for a returning (bound) user: a
  // localStorage hint predicts resume so we keep the (cached) dashboard up
  // while we confirm the binding asynchronously. Cleared on sign-out / when
  // the binding turns out to be gone.
  // The hint is the authoritative "this device has an active session" signal.
  // Sign-out clears it, so when it's absent we show login and do NOT attempt
  // any resume — otherwise a lingering /admins grant (e.g. from a bootstrap)
  // would silently re-log-in as a pure admin right after sign-out.
  // Guest (view-only demo) session — re-enter read-only mode without a passkey.
  // Checked before the bound-member resume so a guest never resumes AS the
  // team member their device is incidentally bound to.
  let isGuest = false;
  try { isGuest = localStorage.getItem('vl_guest') === '1'; } catch (e) {}
  if (isGuest) {
    (async () => {
      try {
        await _fbInitPromise;
        if (_fbInitResult !== true) { showLogin(); return; }
        if (!await fbEnterGuest()) { try { localStorage.removeItem('vl_guest'); } catch (e) {} showLogin(); return; }
        currentUser = null; isAdminMode = false; _boundIsAdmin = false; _isGuest = true;
        try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
        _renderSignOutChip(); _runMainBootstrap(); hideLogin();
      } catch (e) { console.error('guest resume failed:', e); showLogin(); }
    })();
    return;
  }
  let likelyBound = false;
  try { likelyBound = localStorage.getItem('vl_bound_hint') === '1'; } catch (e) {}
  if (!likelyBound) { showLogin(); return; }
  (async () => {
    try {
      await _fbInitPromise;
      if (_fbInitResult !== true) { if (likelyBound) showLogin(); return; }  // offline → must log in
      const bound = await fbBoundUser();
      const isAdm = await fbIsBoundAdmin();
      if (bound && bound.tmId) {
        // Bound team member (may also be an admin — lock button enters w/o pw).
        const m = (TEAM_DIRECTORY || []).find(x => x.id === bound.tmId)
                  || { id: bound.tmId, slackName: bound.slackName || '' };
        setCurrentUser(m, true);
        _boundIsAdmin = isAdm;
        try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
        try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
        _renderSignOutChip(); _runMainBootstrap(); hideLogin();
        return;
      }
      if (isAdm) {
        // Pure admin device (bootstrap admin, no team profile) — resume as admin.
        currentUser = null; _boundIsAdmin = true;
        isAdminMode = true; document.body.classList.add('admin-mode'); _swapAdminIcons(true);
        try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
        if (typeof dataMergeAdminPasskeys === 'function') dataMergeAdminPasskeys();
        try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
        _runMainBootstrap(); hideLogin();
        return;
      }
      // Not bound and not admin → clear stale hint and show login.
      try { localStorage.removeItem('vl_bound_hint'); } catch (e) {}
      showLogin();
    } catch (e) { console.error('resume binding check failed:', e); showLogin(); }
  })();
}
_decideLoginOrResume();

// Kept as a stub for the post-login welcome handoff (called from
// _bootProceedAfterLogin). Firebase already started; just refresh chrome
// in case the post-login state needs a final render.
function _runMainBootstrap() {
  renderSidebar();
  renderAnnouncements();
  _renderSignOutChip();
}

// Flush any debounced Firestore writes before the page unloads. Without
// this, hitting refresh during the 300ms debounce window (or before the
// network round-trip completes) drops the queued edit on the floor, and
// the next session re-pulls the stale remote doc — making the just-added
// entry vanish until the user waits long enough for the write to land.
function _fbHandleUnload() {
  if (_fbWriteTimer || Object.keys(_fbPendingWrite).length) {
    _fbFlushNow();
  }
}
window.addEventListener('pagehide',     _fbHandleUnload);
window.addEventListener('beforeunload', _fbHandleUnload);
