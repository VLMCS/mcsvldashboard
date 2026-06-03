/* ══════════════════════════════════════════
   FIREBASE DATA LAYER
   ──────────────────────────────────────────
   Fill in FIREBASE_CONFIG below to enable real-time sharing.
   Setup instructions:
   1. Go to https://console.firebase.google.com → "Add project" → name it (e.g. "vl-dashboard")
   2. Disable Google Analytics (not needed) → Create
   3. In project: Build → Firestore Database → Create database → Start in TEST MODE
      (Test mode lets anyone read/write for 30 days; renew or set rules later)
   4. In project Settings (⚙ icon) → General → Your apps → click </> "Web"
   5. Register the app, copy the firebaseConfig object
   6. Paste it into FIREBASE_CONFIG below replacing the placeholder
   7. Reload — the page will now sync data across all users in real time

   If FIREBASE_CONFIG.apiKey is left as 'PASTE_YOUR_CONFIG_HERE', the page falls
   back to localStorage (single-user mode), so the dashboard still works offline.
   ══════════════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBx1DVX_duRg1_ueNLoeg3fl5L4Of0a81c",
  authDomain: "mcs-vl-dashboard.firebaseapp.com",
  projectId: "mcs-vl-dashboard",
  storageBucket: "mcs-vl-dashboard.firebasestorage.app",
  messagingSenderId: "870550200391",
  appId: "1:870550200391:web:2ebe322f936391d0845162"
};
const FIREBASE_DOC_PATH = ['dashboards', 'main']; // collection, doc

// ── Phase B feature flag ──────────────────────────────────────────────────
// false (current): app reads/writes the single dashboards/main doc.
// true  (post-migration): app reads/writes per-entity collections.
// Lets the new data model + auth binding ship dormant and flip in one place,
// with instant rollback by setting this back to false (dashboards/main is
// never deleted until well after the flip is verified).
let USE_NEW_DATA_MODEL = true;

let _fbApp = null, _fbDb = null, _fbDoc = null, _fbUnsub = null;
let _fbReady = false;
let _fbWriting = false;       // suppress our own writes triggering re-read
let _fbWriteTimer = null;
let _fbPendingWrite = {};     // accumulate writes for debounce

// Anonymous Auth (Phase B): every device gets a stable Firebase UID so the
// locked-down rules can identify the caller. Additive in the current model —
// signing in anonymously changes nothing about how data is read/written today.
let _fbAuth = null;
let _fbUid = null;            // current anonymous UID, or null until signed in
function fbCurrentUid() { return _fbUid; }

function fbConfigured() {
  return FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'PASTE_YOUR_CONFIG_HERE';
}

// Firestore doesn't allow nested arrays (array-of-array). SYNONYMS is one
// (each group is an array). We wrap each group as { terms: [...] } on write
// and unwrap on read. Other fields are objects-in-arrays, which Firestore allows.
function encodeForFirestore(key, value) {
  if (key === 'synonyms' && Array.isArray(value)) {
    return value.map(g => ({ terms: Array.isArray(g) ? g : [] }));
  }
  return value;
}
function decodeFromFirestore(key, value) {
  if (key === 'synonyms' && Array.isArray(value)) {
    // Accept both shapes for forward/backward compatibility
    return value.map(g => Array.isArray(g) ? g : (g && Array.isArray(g.terms) ? g.terms : []));
  }
  return value;
}

async function initFirebase() {
  if (!fbConfigured()) return false;
  try {
    // Use Firebase Web v10 modular SDK (loaded via CDN)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js');
    const { getFirestore, doc, onSnapshot, setDoc, getDoc, deleteDoc, collection, getDocs, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
    _fbApp = initializeApp(FIREBASE_CONFIG);
    _fbDb  = getFirestore(_fbApp);
    _fbDoc = doc(_fbDb, FIREBASE_DOC_PATH[0], FIREBASE_DOC_PATH[1]);
    _fb_setDoc = setDoc;
    _fb_onSnapshot = onSnapshot;
    _fb_getDoc = getDoc;
    _fb_doc = doc;             // build refs to other docs (admin-password.js, bind.js, data layer)
    _fb_deleteDoc = deleteDoc; // bind.js (sign-out), data layer (deletes)
    _fb_collection = collection;
    _fb_getDocs = getDocs;     // collection scans (bind.js team-secrets lookup, data layer)
    _fb_serverTimestamp = serverTimestamp; // bind.js boundAt (rules require == request.time)

    // ── Anonymous Auth (best-effort, non-fatal) ──
    // Sign in anonymously so request.auth.uid exists for the locked-down rules.
    // If it fails (e.g. Anonymous provider disabled), we log and continue —
    // the current single-doc model works without it; binding stays dormant.
    try {
      const { getAuth, signInAnonymously, onAuthStateChanged } =
        await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js');
      _fbAuth = getAuth(_fbApp);
      await new Promise((resolve) => {
        let settled = false;
        const done = () => { if (!settled) { settled = true; resolve(); } };
        onAuthStateChanged(_fbAuth, (user) => { if (user) { _fbUid = user.uid; done(); } });
        signInAnonymously(_fbAuth).catch((err) => { console.error('Anonymous auth failed:', err); done(); });
        setTimeout(done, 4000); // don't hang init if auth never settles
      });
    } catch (err) {
      console.error('Auth SDK load failed (continuing without it):', err);
    }

    // ── NEW DATA MODEL (Phase B) ──
    // Just become ready here — do NOT load collections yet. Under the
    // locked-down rules, collection reads require a BOUND user, and at boot
    // we're not bound. dataActivate() (load + subscribe) runs only AFTER the
    // device is bound — from the resume/login paths. This short-circuits the
    // entire single-doc path below.
    if (USE_NEW_DATA_MODEL) {
      _fbReady = true;
      return true;
    }

    // If the previous session had unsaved writes pending (refresh happened
    // before the debounced fbSync fired or before the network round-trip
    // completed), the local cache is newer than Firestore for those keys.
    // Skip pulling them down — and re-push them up after we're ready.
    let pendingKeys = [];
    try {
      const raw = localStorage.getItem('vl_pending');
      if (raw) pendingKeys = JSON.parse(raw) || [];
    } catch(e) { pendingKeys = []; }
    const skip = new Set(pendingKeys);

    // First load from Firestore (if doc exists, overwrite local; if not, push local up)
    const snap = await getDoc(_fbDoc);
    if (snap.exists()) {
      const remote = snap.data() || {};
      if (remote.sections         && !skip.has('sections'))         SECTIONS          = decodeFromFirestore('sections', remote.sections);
      if (remote.handbook         && !skip.has('handbook'))         HANDBOOK          = decodeFromFirestore('handbook', remote.handbook);
      if (remote.projects         && !skip.has('projects'))         PROJECTS          = decodeFromFirestore('projects', remote.projects);
      if (remote.projectEntries   && !skip.has('projectEntries'))   PROJECT_ENTRIES   = decodeFromFirestore('projectEntries', remote.projectEntries);
      if (remote.customCategories && !skip.has('customCategories')) CUSTOM_CATEGORIES = decodeFromFirestore('customCategories', remote.customCategories);
      if (remote.settings         && !skip.has('settings'))         SITE_SETTINGS     = Object.assign({}, DEFAULT_SITE_SETTINGS, decodeFromFirestore('settings', remote.settings));
      if (remote.sidebar          && !skip.has('sidebar'))          SIDEBAR_CFG       = decodeFromFirestore('sidebar', remote.sidebar);
      if (remote.announcements    && !skip.has('announcements'))    ANNOUNCEMENTS     = decodeFromFirestore('announcements', remote.announcements);
      if (remote.synonyms         && !skip.has('synonyms'))         SYNONYMS          = decodeFromFirestore('synonyms', remote.synonyms);
      if (remote.team             && !skip.has('team'))             TEAM_DIRECTORY    = decodeFromFirestore('team', remote.team);
      if (!skip.has('team')) _ensureTeamPasskeys();  // backfill any pre-passkey rows in the remote doc
      // Persist what we just fetched to localStorage as cache (only for keys
      // we actually pulled from remote — leaving locally-dirty keys alone).
      try {
        if (!skip.has('sections'))         localStorage.setItem('vl_sections', JSON.stringify(SECTIONS));
        if (!skip.has('handbook'))         localStorage.setItem('vl_hb',       JSON.stringify(HANDBOOK));
        if (!skip.has('projects'))         localStorage.setItem('vl_projects', JSON.stringify(PROJECTS));
        if (!skip.has('projectEntries'))   localStorage.setItem('vl_pe',       JSON.stringify(PROJECT_ENTRIES));
        if (!skip.has('customCategories')) localStorage.setItem('vl_cats',     JSON.stringify(CUSTOM_CATEGORIES));
        if (!skip.has('settings'))         localStorage.setItem('vl_settings', JSON.stringify(SITE_SETTINGS));
        if (!skip.has('sidebar'))          localStorage.setItem('vl_sb',       JSON.stringify(SIDEBAR_CFG));
        if (!skip.has('announcements'))    localStorage.setItem('vl_ann',      JSON.stringify(ANNOUNCEMENTS));
        if (!skip.has('synonyms'))         localStorage.setItem('vl_syn',      JSON.stringify(SYNONYMS));
        if (!skip.has('team'))             localStorage.setItem('vl_team',     JSON.stringify(TEAM_DIRECTORY));
      } catch(e){}
    } else {
      // First-time: seed Firestore from local
      await setDoc(_fbDoc, {
        sections:         encodeForFirestore('sections',         SECTIONS),
        handbook:         encodeForFirestore('handbook',         HANDBOOK),
        projects:         encodeForFirestore('projects',         PROJECTS),
        projectEntries:   encodeForFirestore('projectEntries',   PROJECT_ENTRIES),
        customCategories: encodeForFirestore('customCategories', CUSTOM_CATEGORIES),
        settings:         encodeForFirestore('settings',         SITE_SETTINGS),
        sidebar:          encodeForFirestore('sidebar',          SIDEBAR_CFG),
        announcements:    encodeForFirestore('announcements',    ANNOUNCEMENTS),
        synonyms:         encodeForFirestore('synonyms',         SYNONYMS),
        team:             encodeForFirestore('team',             TEAM_DIRECTORY),
        _updatedAt: Date.now()
      });
    }

    // Real-time listener
    _fbUnsub = onSnapshot(_fbDoc, (snap) => {
      if (_fbWriting) return; // ignore our own write echo
      const raw = snap.data();
      if (!raw) return;
      const remote = {
        sections:         raw.sections         ? decodeFromFirestore('sections', raw.sections) : null,
        handbook:         raw.handbook         ? decodeFromFirestore('handbook', raw.handbook) : null,
        projects:         raw.projects         ? decodeFromFirestore('projects', raw.projects) : null,
        projectEntries:   raw.projectEntries   ? decodeFromFirestore('projectEntries', raw.projectEntries) : null,
        customCategories: raw.customCategories ? decodeFromFirestore('customCategories', raw.customCategories) : null,
        settings:         raw.settings         ? Object.assign({}, DEFAULT_SITE_SETTINGS, decodeFromFirestore('settings', raw.settings)) : null,
        sidebar:          raw.sidebar          ? decodeFromFirestore('sidebar', raw.sidebar) : null,
        announcements:    raw.announcements    ? decodeFromFirestore('announcements', raw.announcements) : null,
        synonyms:          raw.synonyms        ? decodeFromFirestore('synonyms', raw.synonyms) : null,
        team:             raw.team             ? decodeFromFirestore('team', raw.team) : null
      };
      let changed = false;
      if (remote.sections         && JSON.stringify(remote.sections)         !== JSON.stringify(SECTIONS))          { SECTIONS = remote.sections; changed = true; }
      if (remote.handbook         && JSON.stringify(remote.handbook)         !== JSON.stringify(HANDBOOK))          { HANDBOOK = remote.handbook; changed = true; }
      if (remote.projects         && JSON.stringify(remote.projects)         !== JSON.stringify(PROJECTS))          { PROJECTS = remote.projects; changed = true; }
      if (remote.projectEntries   && JSON.stringify(remote.projectEntries)   !== JSON.stringify(PROJECT_ENTRIES))   { PROJECT_ENTRIES = remote.projectEntries; changed = true; }
      if (remote.customCategories && JSON.stringify(remote.customCategories) !== JSON.stringify(CUSTOM_CATEGORIES)) { CUSTOM_CATEGORIES = remote.customCategories; changed = true; }
      if (remote.settings         && JSON.stringify(remote.settings)         !== JSON.stringify(SITE_SETTINGS))     { SITE_SETTINGS = remote.settings; changed = true; }
      if (remote.sidebar          && JSON.stringify(remote.sidebar)          !== JSON.stringify(SIDEBAR_CFG))       { SIDEBAR_CFG = remote.sidebar; changed = true; }
      if (remote.announcements    && JSON.stringify(remote.announcements)    !== JSON.stringify(ANNOUNCEMENTS))     { ANNOUNCEMENTS = remote.announcements; changed = true; }
      if (remote.synonyms         && JSON.stringify(remote.synonyms)         !== JSON.stringify(SYNONYMS))          { SYNONYMS = remote.synonyms; changed = true; }
      if (remote.team             && JSON.stringify(remote.team)             !== JSON.stringify(TEAM_DIRECTORY))    { TEAM_DIRECTORY = remote.team; changed = true; _ensureTeamPasskeys(); }
      if (changed) {
        applyAllSettings();
        renderSidebar();
        renderAnnouncements();
        if (currentView === 'section' && currentSectionNum) showSection(currentSectionNum);
        else if (currentView === 'entry' && currentEntryId) showEntry(currentEntryId);
        showToast('Updated from team');
      }
    });

    _fbReady = true;

    // Any keys that were locally-dirty when the previous session ended —
    // push them up now that Firestore is ready. The current in-memory
    // values came from localStorage (we deliberately did NOT overwrite
    // them from the remote snapshot above), so this re-publishes them.
    if (pendingKeys.length) {
      const valueFor = {
        sections: SECTIONS, handbook: HANDBOOK, projects: PROJECTS,
        projectEntries: PROJECT_ENTRIES, customCategories: CUSTOM_CATEGORIES,
        settings: SITE_SETTINGS, sidebar: SIDEBAR_CFG,
        announcements: ANNOUNCEMENTS, synonyms: SYNONYMS, team: TEAM_DIRECTORY
      };
      for (const k of pendingKeys) {
        if (k in valueFor) fbSyncKey(k, valueFor[k]);
      }
    }
    return true;
  } catch (err) {
    console.error('Firebase init failed:', err);
    showToast('Firebase failed — running offline');
    return false;
  }
}
let _fb_setDoc, _fb_onSnapshot, _fb_getDoc, _fb_doc, _fb_deleteDoc, _fb_collection, _fb_getDocs, _fb_serverTimestamp;

function fbSync() {
  if (!_fbReady) return;
  fbSyncKey('sections', SECTIONS);
  fbSyncKey('handbook', HANDBOOK);
  fbSyncKey('projects', PROJECTS);
  fbSyncKey('projectEntries', PROJECT_ENTRIES);
  fbSyncKey('customCategories', CUSTOM_CATEGORIES);
  fbSyncKey('settings', SITE_SETTINGS);
  fbSyncKey('sidebar', SIDEBAR_CFG);
  fbSyncKey('announcements', ANNOUNCEMENTS);
  fbSyncKey('synonyms', SYNONYMS);
  fbSyncKey('team', TEAM_DIRECTORY);
}

// Track which keys have edits that haven't yet landed in Firestore. This
// flag is also mirrored to localStorage so that if the user refreshes
// before the debounced write fires, the next session can detect that the
// local cache is newer than Firestore and push it up instead of being
// overwritten by stale remote data.
function _markPending(keys) {
  try {
    if (keys && keys.length) localStorage.setItem('vl_pending', JSON.stringify(keys));
    else                     localStorage.removeItem('vl_pending');
  } catch(e) {}
  _renderSaveIndicator(keys && keys.length > 0, false);
}

function _renderSaveIndicator(saving, justSaved) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  const label = el.querySelector('.si-label');
  if (saving) {
    if (label) label.textContent = 'Saving…';
    el.classList.add('show'); el.classList.remove('saved');
    clearTimeout(el._t);
  } else if (justSaved) {
    if (label) label.textContent = 'Saved';
    el.classList.add('show', 'saved');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 1500);
  } else {
    el.classList.remove('show', 'saved');
  }
}

// Fire the queued payload to Firestore right now, bypassing the debounce.
// Used by the page-unload handler so a refresh can't drop in-flight edits.
function _fbFlushNow() {
  if (!_fbReady || !_fb_setDoc) return;
  if (_fbWriteTimer) { clearTimeout(_fbWriteTimer); _fbWriteTimer = null; }
  if (!Object.keys(_fbPendingWrite).length) return;
  const payload = { ..._fbPendingWrite, _updatedAt: Date.now() };
  _fbPendingWrite = {};
  _fbWriting = true;
  // Fire-and-let-the-browser-finish-it: modern browsers keep this fetch in
  // flight through unload. We don't await; that would block the unload path.
  try {
    _fb_setDoc(_fbDoc, payload, { merge: true })
      .then(() => { _markPending([]); })
      .catch(err => console.error('Firestore flush failed:', err))
      .finally(() => { setTimeout(() => { _fbWriting = false; }, 200); });
  } catch (err) {
    console.error('Firestore flush threw:', err);
  }
}

// In-flight Firestore writes counter. fbWritesIdle() returns a Promise that
// resolves the next time the counter hits zero (resolves immediately if
// nothing is in flight). Used by the sidebar to keep its "Saving…" overlay
// up until destructive batch operations (e.g. section reorder, which rewrites
// many docs) have actually landed before letting the user act again.
let _fbInFlight = 0;
let _fbIdleResolvers = [];
function _fbWriteBegin() { _fbInFlight++; }
function _fbWriteEnd() {
  if (_fbInFlight > 0) _fbInFlight--;
  if (_fbInFlight === 0 && _fbIdleResolvers.length) {
    const list = _fbIdleResolvers; _fbIdleResolvers = [];
    for (const r of list) { try { r(); } catch (e) {} }
  }
}
function fbWritesIdle() {
  if (_fbInFlight === 0) return Promise.resolve();
  return new Promise(resolve => _fbIdleResolvers.push(resolve));
}

function fbSyncKey(key, value) {
  if (!_fbReady) return;
  // NEW DATA MODEL (Phase B): route whole-array saves to per-doc collection
  // writes. Dormant today (flag false). Keeps the save indicator behaviour.
  if (USE_NEW_DATA_MODEL) {
    _markPending([key]);
    _fbWriteBegin();
    dataSyncKey(key, value)
      .then(() => { _markPending([]); _renderSaveIndicator(false, true); })
      .catch(err => console.error('dataSyncKey failed:', err))
      .finally(() => _fbWriteEnd());
    return;
  }
  _fbPendingWrite[key] = encodeForFirestore(key, value);
  _markPending(Object.keys(_fbPendingWrite));
  if (_fbWriteTimer) clearTimeout(_fbWriteTimer);
  _fbWriteTimer = setTimeout(async () => {
    const payload = { ..._fbPendingWrite, _updatedAt: Date.now() };
    _fbPendingWrite = {};
    _fbWriting = true;
    try {
      await _fb_setDoc(_fbDoc, payload, { merge: true });
      // Only clear pending if no NEW writes piled on while we were in flight.
      if (!Object.keys(_fbPendingWrite).length) {
        _markPending([]);
        _renderSaveIndicator(false, true);
      }
    } catch (err) {
      console.error('Firestore write failed:', err);
      // Leave the pending flag set so the next session knows local is dirty.
    } finally {
      setTimeout(() => { _fbWriting = false; }, 200);
    }
  }, 300);
}
