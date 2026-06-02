/* ══════════════════════════════════════════════════════════════
   AUTH / ACCESS
   Passkey generation + edit-permission checks. Extracted from
   app.js (PR-9). Functions stay global; loaded before app.js.
   Reads globals (isAdminMode, unlockedProjects, currentUser,
   TEAM_DIRECTORY) at call-time, and calls fbSyncKey/generatePasskey
   cross-file — all resolved by the time these run during boot.
   ══════════════════════════════════════════════════════════════ */

function generatePasskey() {
  // 8-char alphanumeric, easy to read (no 0/O/1/I/l)
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

// True if the user can edit entries within (base, sectionNum):
//   - Admin can always edit anything.
//   - For Projects: non-admin needs to have unlocked the section's passkey.
//   - For Handbook / custom: only admin (no passkey system).
function canEditSection(base, sectionNum) {
  if (isAdminMode) return true;
  if (base === 'projects') return unlockedProjects.has(String(sectionNum));
  return false;
}

// Backfill: any team member without a passkey gets one, and any member
// without a kpi map gets an empty one. Returns true if any member was
// updated, so the caller can re-persist + push to Firebase. Also regenerates
// duplicate passkeys so login-by-passkey is unambiguous.
function _ensureTeamPasskeys() {
  if (!Array.isArray(TEAM_DIRECTORY)) return false;
  let changed = false;
  const seen = new Set();
  for (const m of TEAM_DIRECTORY) {
    if (!m || typeof m !== 'object') continue;
    if (!m.passkey || seen.has(m.passkey.toUpperCase())) {
      // Rotate until we land on something globally unique within the directory.
      do { m.passkey = generatePasskey(); } while (seen.has(m.passkey.toUpperCase()));
      changed = true;
    }
    seen.add(m.passkey.toUpperCase());
    // KPI map backfill — profiles pre-dating the KPI feature have no `kpi`
    // field. Initialize it to an empty object so the rest of the code can
    // assume it exists.
    if (!m.kpi || typeof m.kpi !== 'object') { m.kpi = {}; changed = true; }
    if (!m.kpiNotes || typeof m.kpiNotes !== 'object') { m.kpiNotes = {}; changed = true; }
  }
  if (changed) {
    try { localStorage.setItem('vl_team', JSON.stringify(TEAM_DIRECTORY)); } catch(e){}
    if (typeof fbSyncKey === 'function') { try { fbSyncKey('team', TEAM_DIRECTORY); } catch(e){} }
  }
  return changed;
}

// Ownership / edit-permission check for a team-member profile.
// Admin can always edit; the holder of the profile's passkey (= currentUser)
// can edit their own profile; everyone else gets a view-only experience.
function canEditTm(m) {
  if (isAdminMode) return true;
  if (!m) return false;
  if (currentUser && currentUser.tmId === m.id) return true;
  return false;
}
