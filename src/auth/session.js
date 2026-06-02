/* ══════════════════════════════════════════════════════════════
   AUTH / SESSION
   Admin-mode gate (ADMIN_PW) + passkey login identity (currentUser).
   Extracted from app.js (PR-7). Functions remain global; loaded
   before app.js. generatePasskey / canEditSection / canEditTm /
   _ensureTeamPasskeys stay in app.js for now (deferred to a future
   src/auth/access.js extraction) and resolve cross-file as globals.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   ADMIN AUTH
   ══════════════════════════════════════════ */
const ADMIN_PW = 'VLMCS123';
async function openAdminAuth() {
  if (isAdminMode) { exitAdminMode(); return; }
  // NEW DATA MODEL: admin is a bound device (/admins/{uid}).
  if (USE_NEW_DATA_MODEL) {
    if (_boundIsAdmin || await fbIsBoundAdmin()) { _boundIsAdmin = true; enterAdminMode(); return; }
    if (await fbAdminsExist()) {
      await customAlert('This device isn’t an admin. Ask an existing admin to promote it via “Manage Admins”.', { title: 'Admin access' });
      return;
    }
    // No admin exists yet → allow the password modal to bootstrap the first one.
  }
  document.getElementById('pwd-input').value = '';
  document.getElementById('pwd-error').textContent = '';
  document.getElementById('pwd-input').classList.remove('error');
  document.getElementById('pwd-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('pwd-input').focus(), 60);
}
function closePwdModal() { document.getElementById('pwd-modal-overlay').classList.remove('open'); }
function maybeClosePwd(e) { if (_shouldCloseOverlay(e, 'pwd-modal-overlay')) closePwdModal(); }
async function checkPassword() {
  const inp = document.getElementById('pwd-input');
  // verifyAdminPassword (admin-password.js) checks the stored salted hash;
  // until a custom password is configured it falls back to the legacy ADMIN_PW.
  let ok = false;
  try { ok = await verifyAdminPassword(inp.value); }
  catch (e) { console.error('verifyAdminPassword failed:', e); ok = false; }
  if (ok) {
    closePwdModal();
    // NEW DATA MODEL: the password reached here only via the bootstrap path
    // (no admins exist yet) — promote this device to the first admin.
    if (USE_NEW_DATA_MODEL) {
      if (!(await fbAdminsExist())) { await fbBootstrapAdmin(); }
      _boundIsAdmin = true;
      enterAdminMode();
      return;
    }
    enterAdminMode();
    // Still on the built-in default? Offer one-time setup of a custom password
    // + master recovery key (only when Firebase is connected).
    if (typeof isAdminAuthConfigured === 'function' && !isAdminAuthConfigured() && _fbReady) {
      setTimeout(() => { _ap_firstTimeSetup(); }, 400);
    }
  } else {
    document.getElementById('pwd-error').textContent = 'Incorrect password.';
    inp.classList.add('error'); inp.value = '';
    setTimeout(() => inp.classList.remove('error'), 400);
    inp.focus();
  }
}
function _swapAdminIcons(adminOn) {
  const locked = document.getElementById('admin-icon-locked');
  const unlocked = document.getElementById('admin-icon-unlocked');
  if (locked) locked.style.display = adminOn ? 'none' : '';
  if (unlocked) unlocked.style.display = adminOn ? '' : 'none';
  const btn = document.getElementById('admin-btn');
  if (btn) btn.title = adminOn ? 'Admin Mode active — click to exit' : 'Admin Mode';
}
function enterAdminMode() {
  isAdminMode = true;
  document.body.classList.add('admin-mode');
  _swapAdminIcons(true);
  // NEW DATA MODEL (viewable passkeys): pull plaintext passkeys from
  // /team-secrets into TEAM_DIRECTORY so the admin can view them.
  if (USE_NEW_DATA_MODEL && typeof dataMergeAdminPasskeys === 'function') {
    dataMergeAdminPasskeys();
  }
  renderSidebar(); renderAnnouncements();
  showToast('Admin mode active');
}
function exitAdminMode() {
  isAdminMode = false;
  document.body.classList.remove('admin-mode');
  _swapAdminIcons(false);
  if (currentView === 'docview') showHome();
  renderSidebar(); renderAnnouncements();
  showToast('Admin mode exited');
}

/* ══════════════════════════════════════════
   LOGIN / CURRENT USER
   The dashboard sits behind a passkey login. Each TEAM_DIRECTORY member has a
   unique 8-char passkey (auto-generated on profile creation). Entering that
   passkey at the login screen identifies that person as `currentUser` — they
   can then edit their own profile and (in the future) view information that
   only they should see. The admin password (ADMIN_PW) also bypasses login but
   without attaching a specific identity; it just turns Admin Mode on.
   ══════════════════════════════════════════ */
function _findMemberByPasskey(code) {
  if (!code) return null;
  const norm = String(code).trim().toUpperCase();
  if (!norm) return null;
  return (TEAM_DIRECTORY || []).find(m => m && m.passkey && String(m.passkey).toUpperCase() === norm) || null;
}

function setCurrentUser(member, remember) {
  currentUser = member ? {
    tmId: member.id,
    slackName: member.slackName || '',
    passkey: member.passkey || ''
  } : null;
  currentUserPersistent = !!remember;
  const payload = currentUser ? JSON.stringify(currentUser) : '';
  // Always clear any legacy localStorage copy so older "remember on this
  // device" data doesn't shadow the new session-scoped storage.
  try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
  try {
    if (remember && payload) sessionStorage.setItem(LOGIN_KEY, payload);
    else                     sessionStorage.removeItem(LOGIN_KEY);
  } catch(e){}
}

function loadCurrentUser() {
  // Session-scoped: read from sessionStorage only. (Closing the browser ends
  // the session — same-tab refresh keeps it.) Legacy migration: if an older
  // build stashed creds in localStorage, fold them forward into sessionStorage
  // ONCE so the existing user isn't bounced back to login on this load.
  let raw = '';
  try { raw = sessionStorage.getItem(LOGIN_KEY) || ''; } catch(e){}
  if (!raw) {
    try {
      const legacy = localStorage.getItem(LOGIN_KEY);
      if (legacy) {
        raw = legacy;
        try { sessionStorage.setItem(LOGIN_KEY, legacy); } catch(e){}
        try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
      }
    } catch(e){}
  }
  if (!raw) return null;
  let stored = null;
  try { stored = JSON.parse(raw); } catch(e){ return null; }
  if (!stored || !stored.tmId) return null;
  // Validate against TEAM_DIRECTORY: if the member was deleted OR their passkey
  // was rotated (by an admin), the stored creds no longer count — re-prompt.
  const member = (TEAM_DIRECTORY || []).find(m => m && m.id === stored.tmId);
  if (!member) return null;
  if (!member.passkey || String(member.passkey).toUpperCase() !== String(stored.passkey || '').toUpperCase()) return null;
  currentUser = { tmId: member.id, slackName: member.slackName || '', passkey: member.passkey };
  currentUserPersistent = true;
  return currentUser;
}

async function signOut() {
  // NEW DATA MODEL: drop this device's binding (/users/{uid}) so the next load
  // returns to the login screen instead of silently resuming.
  if (USE_NEW_DATA_MODEL) {
    try { await fbUnbindUser(); } catch (e) { console.error('unbind on sign-out failed:', e); }
    _boundIsAdmin = false;
    try { localStorage.removeItem('vl_bound_hint'); } catch (e) {}
  }
  currentUser = null;
  currentUserPersistent = false;
  try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
  try { sessionStorage.removeItem(LOGIN_KEY); } catch(e){}
  // Also exit admin mode on sign-out (clean slate) and reload to surface the
  // login screen, which is the cleanest way to reset all view state.
  if (isAdminMode) { isAdminMode = false; document.body.classList.remove('admin-mode'); }
  location.reload();
}

// True if the currently logged-in identity owns this team member profile.
function isOwnerOfProfile(m) {
  return !!(currentUser && m && currentUser.tmId === m.id);
}
