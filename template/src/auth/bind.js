/* ══════════════════════════════════════════════════════════════
   AUTH / DEVICE BINDING  (Phase B — B2 scaffold)

   Ties this device's anonymous Firebase UID to a team-member row so
   the locked-down rules can answer "who is this?":

     /users/{uid}         { tmId, slackName, boundAt }
     /team-secrets/{tmId} { passkeyHash, salt }   (salted SHA-256 of passkey)
     /admins/{uid}        presence == admin

   DORMANT until USE_NEW_DATA_MODEL is true AND the new collections
   exist (created by the B4/B5 migration). Nothing here is called
   while the app runs on the single dashboards/main model — these
   functions are wired into the login flow in a later step (B3/B6),
   after which they replace the client-side passkey compare.

   Read cost note: fbBindByPasskey scans /team-secrets (one read per
   member) on a login attempt — fine for a small team, well under the
   Spark 50k/day cap.
   ══════════════════════════════════════════════════════════════ */

// SHA-256 hex (matches the hashing used for admin-password + migration).
async function _bind_sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function _bind_ready() {
  return !!(USE_NEW_DATA_MODEL && _fbReady && _fb_doc && _fbDb && fbCurrentUid());
}

// The /users/{uid} binding for this device, or null if unbound / not ready.
async function fbBoundUser() {
  if (!_bind_ready()) return null;
  try {
    const snap = await _fb_getDoc(_fb_doc(_fbDb, 'users', fbCurrentUid()));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error('fbBoundUser failed:', e); return null; }
}

// True if this device's UID is an admin (presence of /admins/{uid}).
async function fbIsBoundAdmin() {
  if (!_bind_ready()) return false;
  try {
    const snap = await _fb_getDoc(_fb_doc(_fbDb, 'admins', fbCurrentUid()));
    return snap.exists();
  } catch (e) { console.error('fbIsBoundAdmin failed:', e); return false; }
}

// Verify a passkey against /team-secrets (scan + salted-hash compare). On a
// match, bind this device by writing /users/{uid}. Returns { tmId } or null.
async function fbBindByPasskey(passkey, slackNameHint) {
  if (!_bind_ready()) return null;
  const entered = String(passkey || '').trim().toUpperCase();
  if (!entered) return null;
  try {
    const secrets = await _fb_getDocs(_fb_collection(_fbDb, 'team-secrets'));
    let matchTmId = null;
    for (const docSnap of secrets.docs) {
      const s = docSnap.data() || {};
      // VIEWABLE model: plaintext compare (case-insensitive). (Older hashed
      // docs, if any, are still matched via the salted-hash fallback.)
      if (s.passkey != null) {
        if (String(s.passkey).trim().toUpperCase() === entered) { matchTmId = docSnap.id; break; }
      } else if (s.passkeyHash && s.salt) {
        const h = await _bind_sha256Hex(s.salt + entered);
        if (h === s.passkeyHash) { matchTmId = docSnap.id; break; }
      }
    }
    if (!matchTmId) return null;
    await _fb_setDoc(_fb_doc(_fbDb, 'users', fbCurrentUid()), {
      tmId: matchTmId,
      slackName: slackNameHint || '',
      boundAt: _fb_serverTimestamp()
    });
    return { tmId: matchTmId };
  } catch (e) { console.error('fbBindByPasskey failed:', e); return null; }
}

// GUEST (view-only) session — no passkey required. The locked rules only grant
// read access to a "bound" device (one with a /users/{uid} doc), so to let a
// guest see the dashboard we bind this device to SOME existing team member.
// The bound identity is never surfaced as the current user: the guest login
// path keeps currentUser=null, so canEditTm/canEditSection both return false
// and the whole dashboard renders read-only. Returns true on success.
//
// Used to demo the site without issuing a real passkey. The /team bind rule
// only requires the tmId to exist — no passkey check — and an unbound signed-in
// device is explicitly allowed to read /team-secrets (rules line ~128), which
// is how we obtain a valid tmId before we're bound.
async function fbEnterGuest() {
  if (!_bind_ready()) return false;
  try {
    // Returning guest on the same anonymous UID? Reuse the existing binding.
    const existing = await fbBoundUser();
    if (existing && existing.tmId) return true;
    const secrets = await _fb_getDocs(_fb_collection(_fbDb, 'team-secrets'));
    const first = secrets.docs[0];
    if (!first) return false;   // empty directory — nothing to bind to
    await _fb_setDoc(_fb_doc(_fbDb, 'users', fbCurrentUid()), {
      tmId: first.id,
      slackName: 'Guest',
      boundAt: _fb_serverTimestamp()
    });
    return true;
  } catch (e) { console.error('fbEnterGuest failed:', e); return false; }
}

// Unbind this device (sign-out): drop /users/{uid}. The anonymous auth
// session itself is left as-is (a fresh passkey can re-bind the same UID).
async function fbUnbindUser() {
  if (!_bind_ready()) return;
  try { await _fb_deleteDoc(_fb_doc(_fbDb, 'users', fbCurrentUid())); }
  catch (e) { console.error('fbUnbindUser failed:', e); }
}

/* ── Admin model: bootstrap once, then promote devices ─────────────────────
   Admin == presence of /admins/{uid}. The very first admin self-promotes via
   the admin password (one-shot, gated by /system/adminsBootstrapped). After
   that, only existing admins can promote other devices. */

// Has the one-time bootstrap already happened?
async function fbAdminsExist() {
  if (!_bind_ready()) return false;
  try {
    const s = await _fb_getDoc(_fb_doc(_fbDb, 'system', 'adminsBootstrapped'));
    return s.exists();
  } catch (e) { console.error('fbAdminsExist failed:', e); return false; }
}

// First-admin bootstrap: write /admins/{uid} then the marker (sequential —
// the marker write needs isAdmin() to already be true under the locked rules).
async function fbBootstrapAdmin() {
  if (!_bind_ready()) return false;
  try {
    const uid = fbCurrentUid();
    await _fb_setDoc(_fb_doc(_fbDb, 'admins', uid), { promotedAt: _fb_serverTimestamp(), promotedBy: 'bootstrap' });
    await _fb_setDoc(_fb_doc(_fbDb, 'system', 'adminsBootstrapped'), { at: _fb_serverTimestamp(), by: uid });
    return true;
  } catch (e) { console.error('fbBootstrapAdmin failed:', e); return false; }
}

// Bound devices (for the "Manage Admins" picker): [{ uid, tmId, slackName }].
async function fbListBoundUsers() {
  if (!_bind_ready()) return [];
  try {
    const snap = await _fb_getDocs(_fb_collection(_fbDb, 'users'));
    return snap.docs.map(d => Object.assign({ uid: d.id }, d.data()));
  } catch (e) { console.error('fbListBoundUsers failed:', e); return []; }
}
async function fbListAdminUids() {
  if (!_bind_ready()) return [];
  try {
    const snap = await _fb_getDocs(_fb_collection(_fbDb, 'admins'));
    return snap.docs.map(d => d.id);
  } catch (e) { console.error('fbListAdminUids failed:', e); return []; }
}
async function fbPromoteAdmin(uid) {
  if (!_bind_ready() || !uid) return false;
  try { await _fb_setDoc(_fb_doc(_fbDb, 'admins', uid), { promotedAt: _fb_serverTimestamp(), promotedBy: fbCurrentUid() }); return true; }
  catch (e) { console.error('fbPromoteAdmin failed:', e); return false; }
}
async function fbDemoteAdmin(uid) {
  if (!_bind_ready() || !uid) return false;
  try { await _fb_deleteDoc(_fb_doc(_fbDb, 'admins', uid)); return true; }
  catch (e) { console.error('fbDemoteAdmin failed:', e); return false; }
}

/* ── Manage Admins UI (dynamic modal) ── */
async function openManageAdmins() {
  if (!USE_NEW_DATA_MODEL) { showToast('Available after the data-model migration.'); return; }
  if (!(_boundIsAdmin || await fbIsBoundAdmin())) { await customAlert('Admins only.', { title: 'Manage Admins' }); return; }
  let ov = document.getElementById('manage-admins-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'manage-admins-overlay';
    ov.className = 'admin-modal-overlay';
    ov.innerHTML = '<div class="admin-modal" style="max-width:520px">' +
      '<h3 style="margin:0 0 6px">Manage Admins</h3>' +
      '<p style="font-size:12.5px;color:var(--text-sub);margin:0 0 12px">Promote a signed-in device to admin, or revoke it. Admins can edit all content.</p>' +
      '<div id="manage-admins-list" style="display:flex;flex-direction:column;gap:6px;max-height:50vh;overflow-y:auto"></div>' +
      '<div style="margin-top:14px;text-align:right"><button class="btn btn-primary" id="manage-admins-close">Done</button></div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#manage-admins-close').onclick = () => ov.classList.remove('open');
  }
  ov.classList.add('open');
  await _renderManageAdmins();
}
async function _renderManageAdmins() {
  const list = document.getElementById('manage-admins-list');
  if (!list) return;
  list.innerHTML = '<div style="color:var(--mid);font-size:13px">Loading…</div>';
  const [users, adminUids] = await Promise.all([fbListBoundUsers(), fbListAdminUids()]);
  const adminSet = new Set(adminUids);
  const myUid = fbCurrentUid();
  // Union of bound devices + any admin uids not in the bound list (pure admins).
  const rows = users.slice();
  for (const uid of adminUids) if (!users.find(u => u.uid === uid)) rows.push({ uid, tmId: null, slackName: '(admin device, no profile)' });
  if (!rows.length) { list.innerHTML = '<div style="color:var(--mid);font-size:13px">No signed-in devices yet.</div>'; return; }
  list.innerHTML = rows.map(u => {
    const m = u.tmId ? (TEAM_DIRECTORY || []).find(x => x.id === u.tmId) : null;
    const name = m ? (m.realName || ('@' + String(m.slackName || '').replace(/^@/, ''))) : (u.slackName || u.tmId || u.uid);
    const isAdm = adminSet.has(u.uid);
    const isMe = u.uid === myUid;
    const btn = isAdm
      ? `<button class="btn btn-secondary" data-demote="${escAttr(u.uid)}">Revoke admin${isMe ? ' (you)' : ''}</button>`
      : `<button class="btn btn-primary" data-promote="${escAttr(u.uid)}">Make admin</button>`;
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px">
      <span style="font-size:13px">${escapeHtml(String(name))}${isAdm ? ' <span style="color:var(--admin-accent);font-weight:700">· admin</span>' : ''}</span>
      ${btn}</div>`;
  }).join('');
  list.querySelectorAll('[data-promote]').forEach(b => b.onclick = async () => {
    await fbPromoteAdmin(b.getAttribute('data-promote')); showToast('Promoted to admin'); _renderManageAdmins();
  });
  list.querySelectorAll('[data-demote]').forEach(b => b.onclick = async () => {
    const uid = b.getAttribute('data-demote');
    if (uid === myUid && !await customConfirm('Revoke YOUR OWN admin access? You may lock yourself out.', { danger: true, confirmLabel: 'Revoke mine' })) return;
    await fbDemoteAdmin(uid); showToast('Admin revoked'); _renderManageAdmins();
  });
}
