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
  if (info && info.isAdmin) {
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
  if (currentUser && currentUser.slackName) {
    chip.innerHTML = '<span>Logged in as</span><span class="so-name">@' +
      escapeHtml(String(currentUser.slackName).replace(/^@/, '')) +
      '</span><span>· Sign out</span>';
    chip.classList.add('visible');
  } else {
    chip.classList.remove('visible');
  }
}
