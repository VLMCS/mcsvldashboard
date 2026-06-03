/* ══════════════════════════════════════════════════════════════
   MAINTENANCE + LOGIN OVERLAYS  (extracted from app.js, PR-14).
   Under-maintenance overlay (Firebase-down gate, admin/emergency
   bypass), the passkey login overlay, post-login welcome animation,
   and the sign-out chip. Global; loaded before app.js; the boot
   block in app.js calls showLogin/loadCurrentUser/_renderSignOutChip
   at runtime. loginTry uses verifyAdminPassword/setCurrentUser etc.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   UNDER MAINTENANCE overlay
   Shown whenever the dashboard isn't connected to Firebase (server down,
   no internet, or unconfigured). An admin can skip it for the session.
   ══════════════════════════════════════════ */
let _maintBypassed = false;   // resets on refresh — bypass lasts only this session
function showMaintenance(state) {
  if (_maintBypassed) return;
  const o = document.getElementById('maint-overlay');
  const sub = document.getElementById('maint-sub');
  if (sub) sub.textContent = (state === 'connecting')
    ? 'Connecting to the dashboard…'
    : 'Still trying to reach the server…';
  if (o) o.classList.add('open');
}
function hideMaintenance() {
  const o = document.getElementById('maint-overlay');
  if (o) o.classList.remove('open');
}
function maintShowPwd() {
  const w = document.getElementById('maint-pwd-wrap');
  w.classList.add('open');
  const i = document.getElementById('maint-pwd');
  i.value = ''; i.classList.remove('error');
  document.getElementById('maint-pwd-err').textContent = '';
  setTimeout(() => i.focus(), 50);
}
async function maintTryPwd() {
  const i = document.getElementById('maint-pwd');
  // Emergency override is checked FIRST: it's network-free and must work even
  // when Firebase is down (the whole reason this screen is showing). Falls
  // through to the normal admin password if Firebase happens to be reachable.
  if (await verifyEmergencyOverride(i.value) || await verifyAdminPassword(i.value)) {
    _maintBypassed = true;
    hideMaintenance();
    showToast('Maintenance screen bypassed for this session');
  } else {
    i.classList.add('error');
    document.getElementById('maint-pwd-err').textContent = 'Incorrect password.';
    i.value = '';
    setTimeout(() => i.classList.remove('error'), 400);
  }
}

/* ══════════════════════════════════════════
   LOGIN overlay
   First gate before the dashboard loads. Closed by either a valid team-member
   passkey (which identifies the user → owns their profile in TEAM_DIRECTORY)
   or the admin password (no specific identity, just turns Admin Mode on).
   ══════════════════════════════════════════ */
function showLogin() {
  // Sync the dashboard/studio name to whatever SITE_SETTINGS currently has so
  // the login screen reflects renames the admin made.
  const nameEl   = document.getElementById('login-site-name');
  const studioEl = document.getElementById('login-studio-name');
  if (nameEl)   nameEl.textContent   = (SITE_SETTINGS && SITE_SETTINGS.siteName)   || 'VL Dashboard';
  if (studioEl) studioEl.textContent = (SITE_SETTINGS && SITE_SETTINGS.studioName) || 'Mega Cat Studios';
  const inp = document.getElementById('login-pwd');
  if (inp) { inp.value = ''; inp.classList.remove('error'); }
  const err = document.getElementById('login-err');
  if (err) err.textContent = '';
  document.getElementById('login-overlay').classList.add('open');
  setTimeout(() => { if (inp) inp.focus(); }, 80);
}

function hideLogin() {
  const o = document.getElementById('login-overlay');
  if (!o) return;
  o.classList.add('fading-out');
  // Match the CSS animation duration (0.45s).
  setTimeout(() => { o.classList.remove('open'); o.classList.remove('fading-out'); }, 460);
}

async function loginTry() {
  const inp = document.getElementById('login-pwd');
  const err = document.getElementById('login-err');
  const submitBtn = document.getElementById('login-submit');
  const remember = !!document.getElementById('login-remember').checked;
  const raw = (inp.value || '').trim();
  if (!raw) {
    err.textContent = 'Enter your passkey.';
    return;
  }

  // NEW DATA MODEL: bind by passkey (hash compare) + bootstrap-admin flow.
  if (USE_NEW_DATA_MODEL) return _loginTryNewModel(raw, err, submitBtn);

  // 1) Admin password — bypass without attaching a specific user identity.
  //    verifyAdminPassword waits for Firebase init, checks the stored salted
  //    hash, and only falls back to the legacy ADMIN_PW on a genuine first run
  //    (never once a custom password has been configured).
  if (await verifyAdminPassword(raw)) {
    currentUser = null;
    currentUserPersistent = false;
    try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
    try { sessionStorage.removeItem(LOGIN_KEY); } catch(e){}
    isAdminMode = true;
    document.body.classList.add('admin-mode');
    _swapAdminIcons(true);
    _bootProceedAfterLogin({ slackName: 'Admin', isAdmin: true });
    return;
  }

  // 2) Team-member passkey — first try local cache (fast path).
  let member = _findMemberByPasskey(raw);

  // 2a) If the local cache misses but Firebase is still loading, wait for
  //     it before declaring the passkey invalid. This is what makes cross-
  //     browser logins work: a profile created in Opera lives on Firebase,
  //     not yet in this Chrome's localStorage — so we MUST give the remote
  //     pull a chance to complete before saying "incorrect passkey."
  if (!member && _fbInitResult === null) {
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Syncing with team…';
    err.textContent = '';
    try { await _fbInitPromise; } catch(e) {}
    submitBtn.disabled = false;
    submitBtn.textContent = origText;
    member = _findMemberByPasskey(raw);
  }

  if (member) {
    setCurrentUser(member, remember);
    _bootProceedAfterLogin({ slackName: member.slackName || member.realName || '', isAdmin: false });
    return;
  }

  // 3) Failed — distinguish "couldn't reach server" from "wrong code" so the
  //    user knows whether to retry the code or check their connection.
  inp.classList.add('error');
  if (_fbInitResult === false) {
    err.textContent = "Couldn't reach the team server. Check your connection, or use the admin password.";
  } else {
    err.textContent = 'Incorrect passkey. Try again, or use the admin password.';
  }
  inp.value = '';
  setTimeout(() => inp.classList.remove('error'), 400);
  inp.focus();
}

// NEW DATA MODEL login: admin-password (bootstrap / existing admin) first,
// then team passkey → device binding via /team-secrets hash compare.
async function _loginTryNewModel(raw, err, submitBtn) {
  const inp = document.getElementById('login-pwd');
  const origText = submitBtn.textContent;
  submitBtn.disabled = true; submitBtn.textContent = 'Signing in…'; err.textContent = '';
  try {
    if (_fbInitResult === null) { try { await _fbInitPromise; } catch (e) {} }
    if (_fbInitResult !== true) { err.textContent = "Couldn't reach the team server. Check your connection."; return; }

    // 1) Admin password → admin (bootstrap the first admin, or an already-
    //    promoted device). After bootstrap, the password alone can't promote a
    //    new device — an existing admin must, via Manage Admins.
    if (await verifyAdminPassword(raw)) {
      const alreadyAdmin = await fbIsBoundAdmin();
      const noAdminsYet  = !(await fbAdminsExist());
      if (alreadyAdmin || noAdminsYet) {
        if (noAdminsYet) await fbBootstrapAdmin();
        currentUser = null; currentUserPersistent = false;
        _boundIsAdmin = true;
        isAdminMode = true; document.body.classList.add('admin-mode'); _swapAdminIcons(true);
        try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
        try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
        _bootProceedAfterLogin({ slackName: 'Admin', isAdmin: true });
        return;
      }
      err.textContent = 'Correct password, but this device isn’t an admin yet. Sign in with your passkey, then ask an admin to promote this device.';
      return;
    }

    // 2) Team passkey → bind this device (/users/{uid}), then load collections
    //    (now allowed — we're bound) and resolve the member for the welcome.
    const bound = await fbBindByPasskey(raw);
    if (bound && bound.tmId) {
      try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
      const m = (TEAM_DIRECTORY || []).find(x => x.id === bound.tmId) || { id: bound.tmId };
      setCurrentUser(m, true);
      _boundIsAdmin = await fbIsBoundAdmin();   // lock button enters admin w/o pw; not auto-entered
      try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
      _bootProceedAfterLogin({ slackName: (m.slackName || m.realName || ''), isAdmin: false });
      return;
    }

    // 3) No match.
    inp.classList.add('error');
    err.textContent = 'Incorrect passkey. Try again, or use the admin password.';
    inp.value = '';
    setTimeout(() => inp.classList.remove('error'), 400);
    inp.focus();
  } finally {
    submitBtn.disabled = false; submitBtn.textContent = origText;
  }
}

// GUEST sign-in — no passkey. Binds this device read-only (see fbEnterGuest)
// so the locked rules let the dashboard load, but keeps currentUser=null and
// admin off, so every edit affordance stays hidden. Intended for demoing the
// site. We deliberately DON'T set vl_bound_hint (that path resumes as the bound
// member); instead vl_guest re-enters this same view-only mode on reload.
async function loginAsGuest() {
  const err = document.getElementById('login-err');
  const btn = document.getElementById('login-guest');
  if (err) err.textContent = '';
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Entering…'; }
  try {
    if (!USE_NEW_DATA_MODEL) {
      // Old single-doc model has no per-device read gate — just enter view-only.
      currentUser = null; currentUserPersistent = false;
      isAdminMode = false; _isGuest = true;
      try { sessionStorage.removeItem(LOGIN_KEY); } catch (e) {}
      try { localStorage.setItem('vl_guest', '1'); } catch (e) {}
      _bootProceedAfterLogin({ slackName: 'Guest', isAdmin: false, guest: true });
      return;
    }
    if (_fbInitResult === null) { try { await _fbInitPromise; } catch (e) {} }
    if (_fbInitResult !== true) {
      if (err) err.textContent = "Couldn't reach the team server. Check your connection.";
      return;
    }
    if (!await fbEnterGuest()) {
      if (err) err.textContent = "Couldn't start a guest session. Try again, or sign in with a passkey.";
      return;
    }
    currentUser = null; currentUserPersistent = false;
    isAdminMode = false; _boundIsAdmin = false; _isGuest = true;
    try { await dataActivate(); } catch (e) { console.error('dataActivate failed:', e); }
    try { localStorage.setItem('vl_guest', '1'); } catch (e) {}
    _bootProceedAfterLogin({ slackName: 'Guest', isAdmin: false, guest: true });
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = orig; }
  }
}

// Plays the welcome fade, then dismisses the login overlay and lets the rest
// of the boot sequence (maintenance overlay + Firebase init) take over.
function _bootProceedAfterLogin(info) {
  playWelcome(info, () => {
    hideLogin();
    _runMainBootstrap();      // Firebase + initial render — see INIT block
    _renderSignOutChip();     // expose the sign-out chip if a user is logged in
  });
}

function playWelcome(info, done) {
  const overlay = document.getElementById('welcome-overlay');
  const msg = document.getElementById('welcome-msg');
  const sub = document.getElementById('welcome-sub');
  if (!overlay || !msg) { done && done(); return; }
  if (info && info.guest) {
    msg.textContent = 'Welcome!';
    sub.textContent = 'Viewing as guest — read-only.';
  } else if (info && info.isAdmin) {
    msg.textContent = 'Welcome, Admin!';
    sub.textContent = 'Admin Mode enabled for this session.';
  } else {
    const name = (info && info.slackName) ? '@' + String(info.slackName).replace(/^@/, '') : 'friend';
    msg.textContent = 'Welcome, ' + name + '!';
    sub.textContent = '';
  }
  overlay.classList.add('open');
  // The CSS animation runs ~1.7s. Hand off to the next step shortly before it
  // finishes so the maintenance overlay is already visible underneath the
  // tail end of the fade-out (smoother feel than waiting for full transparency).
  setTimeout(() => {
    overlay.classList.remove('open');
    done && done();
  }, 1450);
}

function _renderSignOutChip() {
  const chip = document.getElementById('signout-chip');
  if (!chip) return;
  if (_isGuest) {
    chip.innerHTML = '<span>Viewing as</span><span class="so-name">Guest</span><span>· Sign out</span>';
    chip.classList.add('visible');
  } else if (currentUser && currentUser.slackName) {
    chip.innerHTML = '<span>Logged in as</span><span class="so-name">@' +
      escapeHtml(String(currentUser.slackName).replace(/^@/, '')) +
      '</span><span>· Sign out</span>';
    chip.classList.add('visible');
  } else {
    chip.classList.remove('visible');
  }
}
