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
      if (!s.passkeyHash || !s.salt) continue;
      const h = await _bind_sha256Hex(s.salt + entered);
      if (h === s.passkeyHash) { matchTmId = docSnap.id; break; }
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

// Unbind this device (sign-out): drop /users/{uid}. The anonymous auth
// session itself is left as-is (a fresh passkey can re-bind the same UID).
async function fbUnbindUser() {
  if (!_bind_ready()) return;
  try { await _fb_deleteDoc(_fb_doc(_fbDb, 'users', fbCurrentUid())); }
  catch (e) { console.error('fbUnbindUser failed:', e); }
}
