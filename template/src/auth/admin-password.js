/* ══════════════════════════════════════════════════════════════
   ADMIN PASSWORD + MASTER RECOVERY KEY  (PR-8)

   Lets an admin change the Admin-Mode password. Changes are
   authorized by a one-time MASTER RECOVERY KEY that is generated
   the first time a custom password is set and shown to the admin
   exactly once (copy-to-clipboard). The recovery key stays the
   same across password changes — it is the "master key".

   Storage: a dedicated Firestore doc `system/adminAuth`, holding
   only SALTED SHA-256 hashes (never plaintext):
       { pwHash, pwSalt, recoveryHash, recoverySalt, updatedAt }
   This doc is independent of the big single dashboard doc and is
   forward-compatible with the locked-down rules (which already
   define /system/{docId}).

   Bootstrap: until a custom password is configured, the legacy
   ADMIN_PW (from session.js) still unlocks Admin Mode, and the
   admin is offered a one-time setup to replace it.

   SECURITY NOTE: while the permissive Firestore rules are live,
   this doc is world-readable/writable like everything else. The
   hashes prevent plaintext leakage; tamper-resistance arrives
   with the rules-lockdown PR.
   ══════════════════════════════════════════════════════════════ */

// undefined = never loaded; null = loaded, not configured; object = configured
let _ap_cache = undefined;

/* ── Crypto helpers ── */
async function _ap_sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function _ap_randomHex(bytes) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map(b => b.toString(16).padStart(2, '0')).join('');
}
// 4 groups of 5 from an unambiguous alphabet (no 0/O/1/I/L) → ~20 chars.
function _ap_genRecoveryKey() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const group = () => {
    const a = new Uint8Array(5);
    crypto.getRandomValues(a);
    let s = '';
    for (let i = 0; i < 5; i++) s += alphabet[a[i] % alphabet.length];
    return s;
  };
  return [group(), group(), group(), group()].join('-');
}
// Normalize so dashes/case/spacing don't matter when entering the key.
function _ap_normKey(k) {
  return String(k).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/* ── Firestore access ── */
function _ap_ref() {
  if (!_fbReady || !_fb_doc || !_fbDb) return null;
  return _fb_doc(_fbDb, 'system', 'adminAuth');
}
// Persistent breadcrumb: once we've seen a configured adminAuth doc, we
// remember it so the legacy default can't sneak back in during a Firebase
// outage / boot race (when we can't read the doc to verify the real hash).
const _AP_SET_FLAG = 'vl_admin_pw_set';
function _ap_markConfigured() { try { localStorage.setItem(_AP_SET_FLAG, '1'); } catch (e) {} }
function _ap_clearConfigured() { try { localStorage.removeItem(_AP_SET_FLAG); } catch (e) {} }
function _ap_knownConfigured() { try { return localStorage.getItem(_AP_SET_FLAG) === '1'; } catch (e) { return false; } }

async function loadAdminAuth(force) {
  if (_ap_cache !== undefined && !force) return _ap_cache;
  // The login overlay shows BEFORE Firebase finishes initializing. If init is
  // still in flight, wait for it — otherwise we'd fall back to the legacy
  // default during the race window and wrongly accept the old password.
  if (!_fbReady && typeof _fbInitPromise !== 'undefined' && _fbInitPromise) {
    try { await _fbInitPromise; } catch (e) {}
  }
  const ref = _ap_ref();
  if (!ref) return _ap_cache;            // truly offline — keep whatever we have
  try {
    const snap = await _fb_getDoc(ref);
    if (snap.exists()) {
      _ap_cache = snap.data();
      _ap_markConfigured();
    } else {
      // Doc absent → genuine first-run, OR an admin deleted it to reset.
      // Clear the breadcrumb so the legacy default works again (escape hatch).
      _ap_cache = null;
      _ap_clearConfigured();
    }
  } catch (e) {
    console.error('loadAdminAuth failed:', e);  // leave cache untouched
  }
  return _ap_cache;
}
function isAdminAuthConfigured() {
  return !!(_ap_cache && _ap_cache.pwHash);
}

/* ── Verification ── */
async function verifyAdminPassword(input) {
  await loadAdminAuth();
  if (isAdminAuthConfigured()) {
    const h = await _ap_sha256Hex(_ap_cache.pwSalt + String(input));
    return h === _ap_cache.pwHash;
  }
  // Not configured in this session's cache. If we KNOW a custom password was
  // set (breadcrumb) but couldn't load it (offline/unreachable), refuse the
  // legacy default so a changed password can never be bypassed.
  if (_ap_knownConfigured()) return false;
  // True first-run bootstrap — the built-in default still works.
  return String(input) === ADMIN_PW;
}
async function verifyRecoveryKey(input) {
  await loadAdminAuth();
  if (!isAdminAuthConfigured()) return false;
  const h = await _ap_sha256Hex(_ap_cache.recoverySalt + _ap_normKey(input));
  return h === _ap_cache.recoveryHash;
}

// ── Emergency maintenance override ───────────────────────────────────────────
// A fixed override that dismisses the maintenance screen even when Firebase is
// unreachable (so an admin is never locked out by a connectivity failure).
// Stored as a SHA-256 hash ONLY — the plaintext is deliberately NOT in the
// source, so reading the code/repo does not reveal it. Pure client-side check;
// no network needed. (A short password's hash is brute-forceable by a
// determined attacker — acceptable for an internal emergency hatch.)
const _AP_EMERGENCY_HASH = 'd0531650c4121bb47b262c329b6d451d9d340c2ef33b716b91dc5f7e40018145';
async function verifyEmergencyOverride(input) {
  if (!(crypto && crypto.subtle)) return false;
  const h = await _ap_sha256Hex(String(input).trim());
  return h === _AP_EMERGENCY_HASH;
}

/* ── Persistence ── */
async function _ap_saveInitial(password, recoveryKeyNorm) {
  const ref = _ap_ref();
  if (!ref) throw new Error('offline');
  const pwSalt = _ap_randomHex(16);
  const recoverySalt = _ap_randomHex(16);
  const data = {
    pwHash:       await _ap_sha256Hex(pwSalt + String(password)),
    pwSalt,
    recoveryHash: await _ap_sha256Hex(recoverySalt + recoveryKeyNorm),
    recoverySalt,
    updatedAt:    Date.now()
  };
  await _fb_setDoc(ref, data);
  _ap_cache = data;
  _ap_markConfigured();
}
async function _ap_savePasswordOnly(password) {
  const ref = _ap_ref();
  if (!ref) throw new Error('offline');
  if (!isAdminAuthConfigured()) throw new Error('not configured');
  const pwSalt = _ap_randomHex(16);
  const data = Object.assign({}, _ap_cache, {
    pwHash:    await _ap_sha256Hex(pwSalt + String(password)),
    pwSalt,
    updatedAt: Date.now()
  });
  await _fb_setDoc(ref, data);
  _ap_cache = data;
}

/* ── Recovery-key reveal modal (built dynamically, shown once) ── */
function _ap_showRecoveryKey(key) {
  return new Promise(resolve => {
    let ov = document.getElementById('ap-recovery-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'ap-recovery-overlay';
      ov.className = 'admin-modal-overlay';
      ov.innerHTML =
        '<div class="admin-modal" style="max-width:460px;text-align:center">' +
          '<h3 style="margin:0 0 8px">Your master recovery key</h3>' +
          '<p style="font-size:13px;color:var(--text-sub);line-height:1.5;margin:0 0 14px">' +
            'Store this somewhere safe (a password manager). You will need it to ' +
            'change the admin password later. <strong>It is shown only now</strong> ' +
            'and cannot be recovered if lost.</p>' +
          '<div id="ap-recovery-code" style="font-family:\'Consolas\',\'Courier New\',monospace;' +
            'font-size:20px;font-weight:700;letter-spacing:0.1em;padding:14px;' +
            'background:var(--bg-form-input);border:1px solid var(--border);border-radius:8px;' +
            'margin-bottom:14px;user-select:all;word-break:break-all"></div>' +
          '<div style="display:flex;gap:8px;justify-content:center">' +
            '<button class="btn btn-secondary" id="ap-recovery-copy">📋 Copy</button>' +
            '<button class="btn btn-primary" id="ap-recovery-done">I\'ve saved it</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ov);
    }
    ov.querySelector('#ap-recovery-code').textContent = key;
    ov.classList.add('open');
    ov.querySelector('#ap-recovery-copy').onclick = () =>
      navigator.clipboard.writeText(key).then(
        () => showToast('Recovery key copied — store it safely!'),
        () => showToast('Could not copy — select the text and copy manually.')
      );
    ov.querySelector('#ap-recovery-done').onclick = () => {
      ov.classList.remove('open');
      resolve();
    };
    setTimeout(() => { const b = ov.querySelector('#ap-recovery-done'); if (b) b.focus(); }, 80);
  });
}

/* ── Shared "enter new password twice" prompt ── */
async function _ap_promptNewPassword() {
  const p1 = await customPrompt('Enter the new admin password:', '', {
    title: 'New admin password', placeholder: 'New password', confirmLabel: 'Next'
  });
  if (p1 === null) return null;
  if (!p1 || p1.length < 4) {
    await customAlert('Password must be at least 4 characters. Nothing changed.', { title: 'Too short' });
    return null;
  }
  const p2 = await customPrompt('Re-enter the new admin password to confirm:', '', {
    title: 'Confirm password', placeholder: 'Repeat password', confirmLabel: 'Save'
  });
  if (p2 === null) return null;
  if (p1 !== p2) {
    await customAlert('The passwords did not match. Nothing changed.', { title: 'Mismatch' });
    return null;
  }
  return p1;
}

/* ── First-time setup: replace the legacy default with a custom password ── */
async function _ap_firstTimeSetup() {
  const go = await customConfirm(
    'No custom admin password is set yet — Admin Mode still uses the built-in default. ' +
    'Set a custom password now? You will receive a one-time master recovery key needed ' +
    'to change it in the future.',
    { confirmLabel: 'Set password now' }
  );
  if (!go) return;
  const np = await _ap_promptNewPassword();
  if (np === null) return;
  const recoveryKey = _ap_genRecoveryKey();
  try {
    await _ap_saveInitial(np, _ap_normKey(recoveryKey));
  } catch (e) {
    await customAlert('Could not save — are you online? Nothing changed.', { title: 'Save failed' });
    return;
  }
  await _ap_showRecoveryKey(recoveryKey);
  await customAlert('Admin password set. The built-in default no longer works.', { title: 'Done' });
}

/* ── Public entry point: wired to the admin-toolbar button ── */
async function changeAdminPassword() {
  if (!isAdminMode) return;
  if (!(crypto && crypto.subtle)) {
    showToast('Secure crypto is unavailable in this context — open the deployed site.');
    return;
  }
  if (!_fbReady) { showToast('Reconnect to change the admin password.'); return; }
  await loadAdminAuth(true);

  if (!isAdminAuthConfigured()) { await _ap_firstTimeSetup(); return; }

  const rk = await customPrompt('Enter your master recovery key to authorize this change:', '', {
    title: 'Change admin password', placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX', confirmLabel: 'Verify'
  });
  if (rk === null) return;
  if (!(await verifyRecoveryKey(rk))) {
    await customAlert('That recovery key is not correct. Password unchanged.', { title: 'Authorization failed' });
    return;
  }
  const np = await _ap_promptNewPassword();
  if (np === null) return;
  try {
    await _ap_savePasswordOnly(np);
    await customAlert('Admin password updated.', { title: 'Done' });
  } catch (e) {
    await customAlert('Could not save — are you online? Password unchanged.', { title: 'Save failed' });
  }
}
