/* ══════════════════════════════════════════════════════════════
   TEAM DIRECTORY + KPI RENDERING  (extracted from app.js, PR-13)

   The team-directory UI (grid modal, profile detail, avatars,
   projects, saveTm) and the KPI viewer/render (gauges, sections,
   trends, animations, coaching notes, CSV upload) are kept TOGETHER
   because they are deeply interwoven via shared _tmDraft /
   TEAM_DIRECTORY state — separating them cleanly would need surgical
   multi-cut changes and risk the most intricate feature in the app.

   The standalone KPI CSV PARSER + quarter helpers live separately in
   src/kpi/. Functions/state here stay global; loaded before app.js;
   cross-file calls (escape, access, fbSync, etc.) resolve at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   TEAM DIRECTORY
   ══════════════════════════════════════════ */
// Timezone list with friendly labels. The IANA name is the stored value (`tz`);
// `label` is what appears in the dropdown so people can find their country.
const TIMEZONES = [
  { tz:'Pacific/Honolulu',                label:'Hawaii (HST) — Honolulu' },
  { tz:'America/Anchorage',               label:'Alaska (AKT) — Anchorage' },
  { tz:'America/Los_Angeles',             label:'US Pacific (PT) — Los Angeles' },
  { tz:'America/Denver',                  label:'US Mountain (MT) — Denver' },
  { tz:'America/Phoenix',                 label:'US Arizona (MST, no DST) — Phoenix' },
  { tz:'America/Chicago',                 label:'US Central (CT) — Chicago' },
  { tz:'America/New_York',                label:'US Eastern (ET) — New York' },
  { tz:'America/Toronto',                 label:'Canada Eastern (ET) — Toronto' },
  { tz:'America/Mexico_City',             label:'Mexico (CT) — Mexico City' },
  { tz:'America/Sao_Paulo',               label:'Brazil (BRT) — São Paulo' },
  { tz:'America/Argentina/Buenos_Aires',  label:'Argentina (ART) — Buenos Aires' },
  { tz:'UTC',                             label:'UTC — Coordinated Universal Time' },
  { tz:'Europe/London',                   label:'UK (GMT/BST) — London' },
  { tz:'Europe/Berlin',                   label:'Germany (CET) — Berlin' },
  { tz:'Europe/Paris',                    label:'France (CET) — Paris' },
  { tz:'Europe/Madrid',                   label:'Spain (CET) — Madrid' },
  { tz:'Europe/Athens',                   label:'Greece (EET) — Athens' },
  { tz:'Africa/Cairo',                    label:'Egypt (EET) — Cairo' },
  { tz:'Africa/Johannesburg',             label:'South Africa (SAST) — Johannesburg' },
  { tz:'Asia/Dubai',                      label:'UAE (GST) — Dubai' },
  { tz:'Asia/Karachi',                    label:'Pakistan (PKT) — Karachi' },
  { tz:'Asia/Kolkata',                    label:'India (IST) — Kolkata' },
  { tz:'Asia/Bangkok',                    label:'Thailand (ICT) — Bangkok' },
  { tz:'Asia/Singapore',                  label:'Singapore (SGT)' },
  { tz:'Asia/Manila',                     label:'Philippines (PHT) — Manila' },
  { tz:'Asia/Hong_Kong',                  label:'Hong Kong (HKT)' },
  { tz:'Asia/Shanghai',                   label:'China (CST) — Shanghai' },
  { tz:'Asia/Tokyo',                      label:'Japan (JST) — Tokyo' },
  { tz:'Asia/Seoul',                      label:'South Korea (KST) — Seoul' },
  { tz:'Australia/Perth',                 label:'Australia Western (AWST) — Perth' },
  { tz:'Australia/Sydney',                label:'Australia Eastern (AET) — Sydney' },
  { tz:'Pacific/Auckland',                label:'New Zealand (NZT) — Auckland' }
];

function tzLabel(tz) {
  if (!tz) return '';
  const found = TIMEZONES.find(o => o.tz === tz);
  return found ? found.label : tz; // fall back to raw IANA if not in our list
}

let editingTmId = null;
let tmEditMode = false;
let _tmDraft = null; // draft of current edit

// KPI section UI state — reset on profile open so each profile starts fresh.
let _kpiYear = null;            // currently-selected year (number)
let _kpiQuarter = null;         // currently-selected quarter 1..4
let _kpiSubview = 'quarter';    // 'quarter' | 'trends'
let _kpiOpenCats = new Set();   // category indices currently expanded in the drill-in
// Trends (pairwise comparison) state:
let _kpiCmpFrom = null;         // 'YYYY-QN' key of the "from" quarter
let _kpiCmpTo = null;           // 'YYYY-QN' key of the "to" quarter
let _kpiCmpSort = 'worst';      // 'worst' (worst-first) | 'best' (best-first)
let _kpiNoteEdit = null;        // { pair, cat, id|null } while a coaching note is being added/edited
// Remembers the last-displayed animated value per logical element (keyed by a
// stable data-anim-key like "overall-gauge" / "cat-bar-0"). On a quarter
// switch the next fill/count animates FROM the remembered value TO the new one,
// so an increase or decrease is immediately visible (instead of refilling from
// 0). Reset when a different profile is opened.
let _kpiLastAnim = {};
function _kpiResetUiState() {
  _kpiYear = null; _kpiQuarter = null; _kpiSubview = 'quarter'; _kpiOpenCats = new Set();
  _kpiCmpFrom = null; _kpiCmpTo = null; _kpiCmpSort = 'worst';
  _kpiNoteEdit = null;
  _kpiLastAnim = {};
}

function openTeamDirectory() {
  renderTeamRoster();
  // Show the admin-only "All Passkeys" button when admin mode is on so admins
  // can quickly look up / rotate codes when teammates DM "I lost my passkey".
  const pkBtn = document.getElementById('team-passkeys-btn');
  if (pkBtn) pkBtn.style.display = isAdminMode ? '' : 'none';
  document.getElementById('team-modal-overlay').classList.add('open');
}
function closeTeamModal() { document.getElementById('team-modal-overlay').classList.remove('open'); }
function maybeCloseTeamModal(e) { if (_shouldCloseOverlay(e, 'team-modal-overlay')) closeTeamModal(); }

function renderTeamRoster() {
  const grid = document.getElementById('team-roster-grid');
  const cards = TEAM_DIRECTORY.map(m => `
    <div class="tm-card" onclick="openTmDetail('${escJsAttr(m.id)}')">
      <div class="tm-card-avatar">
        ${m.image ? `<img src="${escAttr(m.image)}" alt="${escAttr(m.realName||'')}"/>` : defaultPersonIconSvg(40)}
      </div>
      <div class="tm-card-name">${escapeHtml(m.slackName ? '@' + m.slackName.replace(/^@/, '') : '(no slack)')}</div>
      <div class="tm-card-slack">${escapeHtml(m.realName || 'Unnamed')}</div>
      <div class="tm-card-projects">
        ${(m.projects||[]).slice(0,3).map(p => `<span class="tm-card-project-chip">${escapeHtml(p)}</span>`).join('')}
        ${(m.projects||[]).length > 3 ? `<span class="tm-card-project-chip">+${(m.projects||[]).length-3}</span>` : ''}
      </div>
    </div>
  `).join('');
  const addCard = `<div class="tm-add-card" onclick="openNewTeamMember()">＋<br>Add Team Member</div>`;
  grid.innerHTML = cards + addCard;
}

function defaultPersonIconSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;
}

function blankTm() {
  return {
    id: 'tm-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
    image: '',
    slackName: '',
    realName: '',
    projects: [],
    schedule: { signIn: '', signOut: '', timezone: 'America/New_York' },
    badges: '',
    expertise: '',
    artStyle: '',
    favoriteGenre: '',
    favoriteGames: '',
    portfolio: '',
    // Each profile gets a unique 8-char passkey on creation. Only the holder
    // of this code can edit/update the profile (unless admin mode is on).
    // Visible to the owner once at creation time via a "Save this passkey!"
    // modal, and to admins via the bottom of the profile view in admin mode.
    passkey: generatePasskey(),
    // KPI store: keys are scope strings like "2026-Q1", values are the parsed
    // KPI report (see parseKpiCsv). Empty by default. Visible to the owner
    // (via their passkey) and to admins; uploads are admin-only.
    kpi: {},
    // Coaching notes on KPI comparisons. Keyed by comparison pair then
    // category title: { "2026-Q1->2026-Q2": { "Creative Vision …": [ {id,text,ts} ] } }.
    // Admin-authored, viewable by owner+admin. Tied to the exact From→To pair.
    kpiNotes: {},
    _createdAt: Date.now(),
    _updatedAt: Date.now()
  };
}

function openTmDetail(id) {
  const m = TEAM_DIRECTORY.find(x => x.id === id);
  if (!m) return;
  editingTmId = id;
  _tmDraft = JSON.parse(JSON.stringify(m));
  if (!_tmDraft.kpi || typeof _tmDraft.kpi !== 'object') _tmDraft.kpi = {};
  tmEditMode = false;
  _kpiResetUiState();
  document.getElementById('tm-detail-title').textContent = m.realName || 'Team Member';
  // Delete is owner-or-admin; hide otherwise. renderTmDetail() reasserts this
  // each render so we stay correct after admin-mode toggle while open.
  document.getElementById('tm-delete-btn').style.display = canEditTm(m) ? '' : 'none';
  renderTmDetail();
  document.getElementById('tm-detail-overlay').classList.add('open');
}

function openNewTeamMember() {
  editingTmId = null;
  _tmDraft = blankTm();
  tmEditMode = true;
  document.getElementById('tm-detail-title').textContent = 'New Team Member';
  document.getElementById('tm-delete-btn').style.display = 'none';
  renderTmDetail();
  document.getElementById('tm-detail-overlay').classList.add('open');
}

function closeTmDetail() {
  document.getElementById('tm-detail-overlay').classList.remove('open');
  editingTmId = null; _tmDraft = null; tmEditMode = false;
}
function maybeCloseTmDetail(e) {
  if (_shouldCloseOverlay(e, 'tm-detail-overlay')) closeTmDetail();
}

function toggleTmEditMode() {
  // Guard: a non-owner non-admin shouldn't be able to flip into edit mode even
  // if they craft a click. The Edit toggle is hidden via CSS for them, but
  // defense-in-depth keeps state consistent.
  if (!canEditTm(_tmDraft)) { tmEditMode = false; renderTmDetail(); return; }
  tmEditMode = !tmEditMode;
  renderTmDetail();
}

function renderTmDetail() {
  const m = _tmDraft;
  // Force view-only if the current viewer doesn't own this profile and isn't
  // an admin. They can still browse but can never enter edit mode.
  if (!canEditTm(m)) tmEditMode = false;
  const editing = tmEditMode;
  const canEdit = canEditTm(m);
  const body = document.getElementById('tm-detail-body');

  // Mode toggle button: visible only when the viewer can edit. Save button is
  // visible only when in edit mode. Delete button mirrors edit permission.
  const modeBtn = document.getElementById('tm-mode-btn');
  if (canEdit) {
    modeBtn.style.display = '';
    modeBtn.textContent = editing ? '👁 View Mode' : '✎ Edit';
    modeBtn.classList.toggle('editing', editing);
  } else {
    modeBtn.style.display = 'none';
  }
  document.getElementById('tm-save-btn').style.display = editing ? 'inline-block' : 'none';
  // Hide delete unless owner/admin AND the profile already exists (i.e. has an id in the directory).
  const delBtn = document.getElementById('tm-delete-btn');
  if (delBtn) {
    const existsInDir = editingTmId && (TEAM_DIRECTORY || []).some(x => x.id === editingTmId);
    delBtn.style.display = (canEdit && existsInDir) ? '' : 'none';
  }

  // `filled` indicates whether the field currently has data. When true (and not
  // in edit mode), we hide the helper description so the card reads cleanly.
  // Callers that have a custom viewer must pass `filled` explicitly.
  const renderField = (opts) => {
    const { label, required, desc, value, editor, viewer } = opts;
    const filled = (opts.filled !== undefined) ? opts.filled : !!value;
    // In view mode: show desc only when empty (acts as helper for first-time fill).
    // In edit mode: show desc only when empty (so it disappears as user fills in).
    const showDesc = desc && !filled;
    return `<div class="tm-field">
      <div class="tm-field-label${required?' tm-field-required':''}">${escapeHtml(label)}</div>
      ${showDesc ? `<div class="tm-field-desc">${escapeHtml(desc)}</div>` : ''}
      ${editing ? editor : (viewer || `<div class="tm-field-value ${value?'':'empty'}">${value ? escapeHtml(value) : '(not set)'}</div>`)}
    </div>`;
  };

  const html = `
    <!-- ── IDENTITY ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">👤</div>
        <div class="tm-section-title">Identity</div>
      </div>
      <div class="tm-section-body">
        ${editing ? `
          <div class="tm-identity" style="margin-bottom:14px">
            <div class="tm-avatar-big">
              ${m.image ? `<img src="${escAttr(m.image)}" alt=""/>` : defaultPersonIconSvg(48)}
            </div>
            <div class="tm-avatar-buttons" style="flex-direction:column;align-items:flex-start">
              <button class="btn btn-secondary" onclick="uploadTmImage()">📷 Upload Image</button>
              ${m.image ? `<button class="btn btn-danger" onclick="clearTmImage()">Remove Image</button>` : ''}
            </div>
          </div>
          ${renderField({
            label: 'Slack Name', required: true,
            desc: 'How can we ping you in Slack?',
            filled: !!m.slackName,
            editor: `<input class="form-input" id="tm-slackName" value="${escAttr(m.slackName||'')}" placeholder="@yourhandle"/>`
          })}
          ${renderField({
            label: 'Real Name', required: true,
            desc: "Let's see that beautiful name!",
            filled: !!m.realName,
            editor: `<input class="form-input" id="tm-realName" value="${escAttr(m.realName||'')}" placeholder="Your name"/>`
          })}
        ` : `
          <div class="tm-identity">
            <div class="tm-avatar-big">
              ${m.image ? `<img src="${escAttr(m.image)}" alt=""/>` : defaultPersonIconSvg(48)}
            </div>
            <div class="tm-identity-text">
              <div class="tm-identity-slack">${m.slackName ? escapeHtml('@' + m.slackName.replace(/^@/,'')) : '(no slack)'}</div>
              <div class="tm-identity-real">${m.realName ? escapeHtml(m.realName) : '(no name set)'}</div>
            </div>
          </div>
        `}
      </div>
    </div>

    <!-- ── WORK ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">💼</div>
        <div class="tm-section-title">Work</div>
      </div>
      <div class="tm-section-body">
        ${renderField({
          label: 'Projects', required: true,
          desc: 'Where are you assigned right now?',
          filled: (m.projects||[]).length > 0,
          editor: `<div class="tm-chips" id="tm-projects-chips">
            ${(m.projects||[]).map((p, i) => `
              <span class="tm-chip">${escapeHtml(p)}<button class="tm-chip-x" onclick="removeTmProject(${i})" title="Remove">×</button></span>
            `).join('')}
            <input class="tm-chip-input" id="tm-project-input" placeholder="Type project + Enter" onkeydown="if(event.key==='Enter'){event.preventDefault();addTmProject(this.value);this.value='';}"/>
          </div>`,
          viewer: `<div class="tm-chips">
            ${(m.projects||[]).length
              ? (m.projects||[]).map(p => `<span class="tm-chip">${escapeHtml(p)}</span>`).join('')
              : `<div class="tm-field-value empty">(not assigned)</div>`}
          </div>`
        })}
        ${renderField({
          label: 'Schedule',
          desc: 'Your typical work hours and timezone.',
          filled: !!(m.schedule && m.schedule.signIn),
          editor: `<div class="tm-schedule-row">
            <input type="time" class="form-input" id="tm-signIn" value="${escAttr((m.schedule&&m.schedule.signIn)||'')}" title="Sign-in time"/>
            <input type="time" class="form-input" id="tm-signOut" value="${escAttr((m.schedule&&m.schedule.signOut)||'')}" title="Sign-out time"/>
            <select class="form-select" id="tm-timezone">
              ${TIMEZONES.map(o => `<option value="${escAttr(o.tz)}" ${((m.schedule&&m.schedule.timezone)===o.tz)?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}
            </select>
          </div>`,
          viewer: `<div class="tm-field-value ${(!m.schedule||!m.schedule.signIn)?'empty':''}">
            ${(m.schedule&&m.schedule.signIn) ? `<strong>${escapeHtml(m.schedule.signIn)} – ${escapeHtml(m.schedule.signOut||'?')}</strong> <span style="color:var(--mid)">${escapeHtml(tzLabel(m.schedule.timezone))}</span>` : '(not set)'}
          </div>`
        })}
      </div>
    </div>

    <!-- ── EXPERTISE ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🎨</div>
        <div class="tm-section-title">Expertise & Style</div>
      </div>
      <div class="tm-section-body">
        ${renderField({
          label: 'Areas of Expertise',
          desc: 'Where do you shine the most?',
          value: m.expertise,
          editor: `<textarea class="form-textarea" id="tm-expertise" rows="2" placeholder="VFX, lighting, character design…">${escapeHtml(m.expertise||'')}</textarea>`
        })}
        ${renderField({
          label: 'Art Style',
          desc: 'What art style do you usually prefer working on?',
          value: m.artStyle,
          editor: `<input class="form-input" id="tm-artStyle" value="${escAttr(m.artStyle||'')}" placeholder="Stylized, semi-realistic, pixel art…"/>`
        })}
        ${renderField({
          label: 'Badge Showcase',
          editor: `<div class="tm-badge-placeholder">Related to the badge profession system. Coming soon!</div>`,
          viewer: `<div class="tm-badge-placeholder">Related to the badge profession system. Coming soon!</div>`
        })}
      </div>
    </div>

    <!-- ── PERSONAL ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🎮</div>
        <div class="tm-section-title">Personal</div>
      </div>
      <div class="tm-section-body">
        <div class="tm-grid-2">
          ${renderField({
            label: 'Favorite Genre',
            desc: 'Your favorite game genre',
            value: m.favoriteGenre,
            editor: `<input class="form-input" id="tm-favoriteGenre" value="${escAttr(m.favoriteGenre||'')}" placeholder="JRPG, Soulslike, Roguelike…"/>`
          })}
          ${renderField({
            label: 'Portfolio Link',
            desc: 'Bless us with your art style!',
            filled: !!m.portfolio,
            editor: `<input class="form-input" id="tm-portfolio" value="${escAttr(m.portfolio||'')}" placeholder="https://..."/>`,
            viewer: `<div class="tm-field-value ${m.portfolio?'':'empty'}">${m.portfolio
              ? `<a class="tm-portfolio-link" href="${escAttr(m.portfolio)}" target="_blank" rel="noopener">🔗 ${escapeHtml(m.portfolio.length > 38 ? m.portfolio.substring(0, 38) + '…' : m.portfolio)}</a>`
              : '(not set)'}</div>`
          })}
        </div>
        ${renderField({
          label: 'Favorite Video Games',
          desc: 'Top 5 favorite games? Top 10? Top 20? Top 999 games?',
          filled: !!m.favoriteGames,
          editor: `<textarea class="form-textarea" id="tm-favoriteGames" rows="3" placeholder="One per line, or comma-separated">${escapeHtml(m.favoriteGames||'')}</textarea>`,
          viewer: `<div class="tm-field-value ${m.favoriteGames?'':'empty'}" style="white-space:pre-wrap">${m.favoriteGames ? escapeHtml(m.favoriteGames) : '(not set)'}</div>`
        })}
      </div>
    </div>

    ${canViewKpi(m) ? `
    <!-- ── KPI launcher (full report lives in its own modal) ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">📊</div>
        <div class="tm-section-title">Key Performance Indicators${isAdminMode ? ' <span class="admin-tag" style="margin-left:6px">Admin can upload</span>' : ''}</div>
      </div>
      <div class="tm-section-body">
        <div class="kpi-launcher">
          <button class="btn btn-primary" onclick="openKpiViewer()">📊 Open KPI Report</button>
          <span class="kpi-launcher-hint">View quarterly evaluations, drill into metrics, and see multi-quarter trends${isAdminMode ? '. Admins can also upload new CSVs from inside the report' : ''}.</span>
        </div>
      </div>
    </div>
    ` : ''}

    ${isAdminMode && m.passkey ? `
    <!-- ── PASSKEY (admin-only view) ── -->
    <!-- The owner saw this code once at creation time. This section lets admins
         look it up later (e.g. when someone DMs "I lost my passkey") and rotate
         it if needed — rotating invalidates the old code immediately. -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🔑</div>
        <div class="tm-section-title">Passkey <span class="admin-tag" style="margin-left:6px">Admin</span></div>
      </div>
      <div class="tm-section-body">
        <div class="tm-field-desc">Only this person (with this passkey) can edit their profile. Share securely if they lost it; rotate if compromised.</div>
        <div style="display:flex;gap:6px;align-items:center;margin-top:8px">
          <input class="form-input" id="tm-pk-display" readonly value="${escAttr(m.passkey)}"
            style="flex:1;font-family:'Consolas','Courier New',monospace;letter-spacing:0.12em;font-size:15px;text-align:center"/>
          <button type="button" class="btn btn-secondary" onclick="copyTmPasskey()">📋 Copy</button>
          <button type="button" class="btn btn-secondary" onclick="regenerateTmPasskey()" title="Generate a new passkey — the old one stops working immediately">↻ New</button>
        </div>
      </div>
    </div>
    ` : ''}
  `;
  body.innerHTML = html;
}

// Copy / rotate handlers for the admin-only passkey section.
function copyTmPasskey() {
  const inp = document.getElementById('tm-pk-display');
  if (!inp || !inp.value) return;
  navigator.clipboard.writeText(inp.value).then(
    () => showToast('Passkey copied'),
    () => { inp.select(); document.execCommand && document.execCommand('copy'); showToast('Passkey copied'); }
  );
}
async function regenerateTmPasskey() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  if (!await customConfirm('Generate a new passkey for this profile? The old one will stop working immediately, including for any existing logged-in session.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  // NEW DATA MODEL (viewable): generate a new plaintext passkey, store it in
  // /team-secrets, and keep it on the in-memory profile so admins can see it.
  if (USE_NEW_DATA_MODEL) {
    const used = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
    let next; do { next = generatePasskey(); } while (used.has(next.toUpperCase()));
    try { await dataSetPasskey(editingTmId, next); }
    catch (e) { await customAlert('Could not save the new passkey (are you online?).', { title: 'Error' }); return; }
    _tmDraft.passkey = next;
    const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
    if (idx >= 0) TEAM_DIRECTORY[idx].passkey = next;
    if (currentUser && currentUser.tmId === editingTmId) setCurrentUser({ id: currentUser.tmId, slackName: currentUser.slackName, passkey: next }, currentUserPersistent);
    renderTmDetail();
    showToast('Passkey rotated');
    return;
  }
  // New code, globally unique within the directory.
  const used = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
  let next;
  do { next = generatePasskey(); } while (used.has(next.toUpperCase()));
  _tmDraft.passkey = next;
  // Persist immediately to TEAM_DIRECTORY (so refresh / reopen sees it), even
  // if the admin doesn't click Save on other field edits. Keeps the rotation
  // atomic and surprise-free.
  const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
  if (idx >= 0) {
    TEAM_DIRECTORY[idx].passkey = next;
    saveTeamOnly();
  }
  // If we just rotated the CURRENT user's own passkey, refresh their stored
  // creds so they don't get bounced to the login screen on next reload.
  if (currentUser && currentUser.tmId === editingTmId) {
    setCurrentUser({ id: currentUser.tmId, slackName: currentUser.slackName, passkey: next }, currentUserPersistent);
  }
  renderTmDetail();
  showToast('Passkey rotated');
}

/* ══════════════════════════════════════════
   KPI VIEW — rendered inside the team-member profile modal.
   Privacy: only the owner (currentUser.tmId === m.id) OR an admin can see
   this section. The "Upload CSV" affordance is admin-only.
   ══════════════════════════════════════════ */

// Visibility predicate for the entire KPI section.
function canViewKpi(m) {
  if (!m) return false;
  if (isAdminMode) return true;
  if (currentUser && currentUser.tmId === m.id) return true;
  return false;
}

// Map a score percentage (0-100) onto the 1-5 band used for color + label.
function _kpiBandForPercent(pct) {
  if (pct < 20)  return { n: 1, label: 'Needs Improvement' };
  if (pct < 40)  return { n: 2, label: 'Meets Minimum' };
  if (pct < 60)  return { n: 3, label: 'Solid Performer' };
  if (pct < 80)  return { n: 4, label: 'Exceeds Expectations' };
  return            { n: 5, label: 'Outstanding' };
}
function _kpiPercent(score, max) { return max ? Math.max(0, Math.min(100, (score / max) * 100)) : 0; }

// All scope keys for a member sorted oldest → newest (chronological).
function _kpiSortedKeys(m) {
  const keys = Object.keys(m.kpi || {});
  return keys.sort((a, b) => {
    const [ay, aq] = a.split('-Q').map(Number);
    const [by, bq] = b.split('-Q').map(Number);
    return ay === by ? aq - bq : ay - by;
  });
}

// SVG: circular gauge showing overall % with a band color + score label.
function _kpiGaugeSvg(score, max, label) {
  const pct  = _kpiPercent(score, max);
  const band = _kpiBandForPercent(pct);
  const r = 50, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  // SVG stroke colors mirror the .kpi-band-N classes so the gauge matches
  // the bar chart's color language.
  const fill = ['#c0392b','#e67e22','#f1c40f','#27ae60','#16a085'][band.n - 1];
  const offset = circ * (1 - pct / 100);
  // data-kpi-gauge/-off/-circ + data-count-to drive the open animation
  // (ring fills from empty, number counts 0→value). Rendered at final state
  // so no-animation / reduced-motion still shows the correct values.
  return `<svg class="kpi-gauge-svg" viewBox="0 0 120 120">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="10"
      stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"
      data-kpi-gauge data-anim-key="overall-gauge" data-off="${offset.toFixed(2)}" data-circ="${circ.toFixed(2)}"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="800" fill="var(--text-body)" data-anim-key="overall-num" data-count-to="${Math.round(score)}">${Math.round(score)}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="9" fill="var(--mid)" letter-spacing="1">OF ${Math.round(max)}</text>
  </svg>
  <div class="kpi-gauge-label kpi-band-${band.n}">${escapeHtml(label || band.label)}</div>`;
}

// Small radial gauge used in the pairwise comparison (before/after). Shows
// the score in the center, ring colored by band. `size` is the rendered px.
function _kpiMiniGauge(score, max, size) {
  size = size || 50;
  const pct = _kpiPercent(score, max);
  const band = _kpiBandForPercent(pct);
  const fill = ['#c0392b','#e67e22','#f1c40f','#27ae60','#16a085'][band.n - 1];
  const r = 20, cx = 24, cy = 24, sw = 5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const disp = (score % 1 === 0) ? String(score) : (+score).toFixed(1);
  return `<svg class="kpi-mini-gauge" viewBox="0 0 48 48" width="${size}" height="${size}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="${sw}"
      stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"
      data-kpi-gauge data-off="${offset.toFixed(2)}" data-circ="${circ.toFixed(2)}"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text-body)" data-count-to="${disp}">${disp}</text>
  </svg>`;
}

// LITERAL up / down / flat arrow icon — chunky, vertical (never sloped).
// `dir` is positive / negative / ~0; size controls viewBox dimension.
function _kpiArrowIcon(dir, size) {
  size = size || 14;
  // 14×14 viewBox; arrow body is a thick rectangle, head is a triangle.
  // Up: head at top, shaft going down. Down: head at bottom, shaft going up.
  // Flat: a horizontal dash (no triangle).
  if (dir > 0.5) {
    return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="up">
      <path d="M7 1 L13 7 L9.5 7 L9.5 13 L4.5 13 L4.5 7 L1 7 Z" fill="currentColor"/>
    </svg>`;
  }
  if (dir < -0.5) {
    return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="down">
      <path d="M7 13 L13 7 L9.5 7 L9.5 1 L4.5 1 L4.5 7 L1 7 Z" fill="currentColor"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="flat">
    <rect x="2" y="6" width="10" height="2" rx="1" fill="currentColor"/>
  </svg>`;
}

// Trend chip — JUST a chunky vertical arrow, no delta number. Hover
// tooltip carries the exact +/- pts for users who want the specifics.
// Returns empty string when only one quarter exists (foundational upload
// has nothing to compare against).
function _kpiTrendChip(series) {
  if (!series || series.length < 2) return '';
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const d = last - prev;
  const cls = d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  const sign = d > 0 ? '+' : '';
  const tipText = (cls === 'flat' ? 'No meaningful change' : `${sign}${d.toFixed(1)} pts vs previous quarter`);
  return `<span class="kpi-trend-chip ${cls}" title="${escapeHtml(tipText)}" data-arrow-dir="${cls}">${_kpiArrowIcon(d, 16)}</span>`;
}

// The whole KPI section HTML — returned as a string and dropped into
// renderTmDetail's body. Hidden entirely for non-owners/non-admins.
function renderKpiSection(m) {
  if (!canViewKpi(m)) return '';

  const kpi = m.kpi || {};
  const allKeys = _kpiSortedKeys(m);

  // Build the year dropdown set: every year that has data + the current year.
  // Sorted DESCENDING so the most recent year shows first.
  const cur = _currentQuarter();
  const years = Array.from(new Set([
    ...allKeys.map(k => parseInt(k.split('-Q')[0], 10)).filter(n => isFinite(n)),
    cur.year
  ])).sort((a, b) => b - a);

  if (!_kpiYear || !years.includes(_kpiYear)) _kpiYear = years[0];
  // Default quarter pick: current quarter if viewing current year and it has
  // data; otherwise first quarter with data; otherwise Q1.
  if (!_kpiQuarter) {
    const candidates = [1, 2, 3, 4];
    const dataQ = candidates.find(q => kpi[_scopeKey(_kpiYear, q)]);
    if (_kpiYear === cur.year && kpi[_scopeKey(cur.year, cur.quarter)]) _kpiQuarter = cur.quarter;
    else if (dataQ) _kpiQuarter = dataQ;
    else _kpiQuarter = 1;
  }

  const yearOpts = years.map(y => `<option value="${y}" ${y === _kpiYear ? 'selected' : ''}>${y}</option>`).join('');

  // Quarter tabs with status pills.
  const quarterTabsHtml = [1, 2, 3, 4].map(q => {
    const has = !!kpi[_scopeKey(_kpiYear, q)];
    const future = _isFutureQuarter(_kpiYear, q);
    const cls = ['kpi-tab'];
    if (q === _kpiQuarter && !future) cls.push('active');
    if (!has && !future) cls.push('missing');
    if (future) cls.push('disabled');
    const mark = has ? '✓' : (future ? '·' : '⚠');
    const label = future ? 'Future' : (has ? 'Uploaded' : 'Missing');
    const click = future ? '' : `onclick="kpiSelectQuarter(${q})"`;
    return `<div class="${cls.join(' ')}" ${click} title="Q${q} ${_kpiYear} — ${label}">
      <span>Q${q}</span><span class="kpi-tab-mark">${mark}</span>
    </div>`;
  }).join('');

  const hasMultiQuarters = allKeys.length >= 2;
  const subviewHtml = hasMultiQuarters ? `
    <div class="kpi-subtabs">
      <div class="kpi-subtab${_kpiSubview === 'quarter' ? ' active' : ''}" onclick="kpiSetSubview('quarter')">KPI View</div>
      <div class="kpi-subtab${_kpiSubview === 'trends' ? ' active' : ''}" onclick="kpiSetSubview('trends')">Trends</div>
    </div>` : '';

  // Admin-only controls: upload + (when the current quarter has data) delete.
  const currentSelectedKey = _scopeKey(_kpiYear, _kpiQuarter);
  const currentHasData = !!kpi[currentSelectedKey];
  const isTrends = _kpiSubview === 'trends' && hasMultiQuarters;

  // Toolbar left side:
  //   KPI View → YEAR dropdown.
  //   Trends   → the From→To compare controls (live here, in the same box as
  //              Upload CSV / Print, styled like the YEAR dropdown), so the
  //              Q1–Q4 tabs and a separate picker card aren't needed.
  let leftControls;
  if (isTrends) {
    const cmpKeys = _kpiSortedKeys(m);   // ascending (chronological)
    // Chronological-only comparison: From must come strictly BEFORE To.
    // Default = earliest → latest, then clamp so the pair is always forward.
    if (!_kpiCmpFrom || !cmpKeys.includes(_kpiCmpFrom)) _kpiCmpFrom = cmpKeys[0];
    if (!_kpiCmpTo   || !cmpKeys.includes(_kpiCmpTo))   _kpiCmpTo   = cmpKeys[cmpKeys.length - 1];
    let fromIdx = cmpKeys.indexOf(_kpiCmpFrom);
    let toIdx   = cmpKeys.indexOf(_kpiCmpTo);
    // The last quarter can't be a "From" (nothing after it to compare to).
    if (fromIdx >= cmpKeys.length - 1) { fromIdx = cmpKeys.length - 2; _kpiCmpFrom = cmpKeys[fromIdx]; }
    // Keep To strictly after From — bump it forward if it landed at/before.
    if (toIdx <= fromIdx) { toIdx = fromIdx + 1; _kpiCmpTo = cmpKeys[toIdx]; }

    const cmpLabel = (key) => { const [y, q] = key.split('-Q'); return `Q${q} ${y}`; };
    // From list: only quarters that have at least one later quarter.
    const fromOpts = cmpKeys.slice(0, cmpKeys.length - 1)
      .map(k => `<option value="${k}" ${k === _kpiCmpFrom ? 'selected' : ''}>${cmpLabel(k)}</option>`).join('');
    // To list: only quarters chronologically AFTER the selected From.
    const toOpts = cmpKeys.slice(fromIdx + 1)
      .map(k => `<option value="${k}" ${k === _kpiCmpTo ? 'selected' : ''}>${cmpLabel(k)}</option>`).join('');
    const sortLabel = _kpiCmpSort === 'worst' ? 'Worst first' : 'Strongest first';
    leftControls = `
      <label style="font-size:11.5px;color:var(--text-sub);font-weight:600;letter-spacing:0.06em">COMPARE</label>
      <select class="form-select" onchange="kpiCmpSetFrom(this.value)" style="min-width:90px">${fromOpts}</select>
      <span style="color:var(--mid);font-weight:700">→</span>
      <select class="form-select" onchange="kpiCmpSetTo(this.value)" style="min-width:90px">${toOpts}</select>
      <button class="btn btn-secondary" onclick="kpiCmpToggleSort()" title="Flip the ordering">⇅ ${escapeHtml(sortLabel)}</button>`;
  } else {
    leftControls = `
      <label style="font-size:11.5px;color:var(--text-sub);font-weight:600;letter-spacing:0.06em">YEAR</label>
      <select class="form-select" onchange="kpiSelectYear(this.value)" style="min-width:90px">${yearOpts}</select>`;
  }
  const uploadBtn = isAdminMode
    ? `<button class="btn btn-admin" onclick="kpiUploadStart()" title="Upload a CSV exported from the KPI Google Sheet">⬆ Upload CSV</button>`
    : '';
  // Delete is tied to the specific quarter being viewed — only in KPI View.
  const deleteBtn = (!isTrends && isAdminMode && currentHasData)
    ? `<button class="btn btn-danger" onclick="kpiDeleteQuarter()" title="Remove the CSV record for the quarter currently being viewed">🗑 Delete this quarter</button>`
    : '';

  const toolbar = `
    <div class="kpi-toolbar">
      ${leftControls}
      <div class="kpi-toolbar-spacer"></div>
      ${uploadBtn}
      ${deleteBtn}
      <button class="btn btn-secondary" onclick="kpiPrint()" title="Print or save as PDF">🖨 Print</button>
    </div>`;

  const tabs = isTrends ? '' : `<div class="kpi-tabs">${quarterTabsHtml}</div>`;

  // Body: either the selected quarter's report, the trends view, or an empty state.
  let body = '';
  if (_kpiSubview === 'trends' && hasMultiQuarters) {
    body = _renderKpiTrends(m);
  } else {
    const key = _scopeKey(_kpiYear, _kpiQuarter);
    const data = kpi[key];
    const future = _isFutureQuarter(_kpiYear, _kpiQuarter);
    if (future) {
      body = `<div class="kpi-empty">
        <div class="kpi-empty-icon">🗓</div>
        <strong>Q${_kpiQuarter} ${_kpiYear}</strong> hasn't happened yet.<br>
        Come back at the end of the quarter to upload evaluation data.
      </div>`;
    } else if (!data) {
      body = `<div class="kpi-empty">
        <div class="kpi-empty-icon">⚠</div>
        No KPI data uploaded for <strong>Q${_kpiQuarter} ${_kpiYear}</strong> yet.
        ${isAdminMode ? '<br>Click <strong>⬆ Upload CSV</strong> above to add it.' : '<br>Ask an admin to upload your evaluation CSV.'}
      </div>`;
    } else {
      body = _renderKpiQuarter(m, data);
    }
  }

  return `
    <!-- ── KPI ── -->
    <div class="tm-section kpi-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">📊</div>
        <div class="tm-section-title">Key Performance Indicators${isAdminMode ? ' <span class="admin-tag" style="margin-left:6px">Admin can upload</span>' : ''}</div>
      </div>
      <div class="tm-section-body">
        ${subviewHtml}
        ${toolbar}
        ${tabs}
        ${body}
      </div>
    </div>
  `;
}

// Single-quarter report body — gauge + category bars + drill-in.
function _renderKpiQuarter(m, data) {
  const meta = data.meta || {};
  const cats = data.categories || [];

  // Trend chips compare the CURRENTLY-VIEWED quarter against the
  // chronologically-previous one (not the full series), so Q1 — which has
  // nothing before it on record — gets no chip, while Q2 compares to Q1.
  const allKeys = _kpiSortedKeys(m);
  const currentKey = data.meta.scope.key;
  const idxInSorted = allKeys.indexOf(currentKey);
  const prevKey = idxInSorted > 0 ? allKeys[idxInSorted - 1] : null;
  const prevReport = prevKey ? m.kpi[prevKey] : null;
  const trendChipFor = (catIdx) => {
    if (!prevReport) return '';
    const prevCat = (prevReport.categories || [])[catIdx];
    const curCat  = cats[catIdx];
    if (!prevCat || !curCat) return '';
    return _kpiTrendChip([prevCat.subtotal, curCat.subtotal]);
  };

  // Overall trend vs previous quarter — chunky arrow circle sitting beside
  // the radial gauge. Reuses the prevReport already computed above for the
  // per-category chips, so the comparison reference is identical and
  // first-time uploads get no arrow anywhere.
  let overallTrendHtml = '';
  if (prevReport) {
    const prevOverall = prevReport.meta?.overall || 0;
    const d = (meta.overall || 0) - prevOverall;
    const cls = d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
    const sign = d > 0 ? '+' : '';
    const [py, pq] = prevKey.split('-Q');
    const niceTip = (cls === 'flat')
      ? `No meaningful change vs Q${pq} ${py}`
      : `${sign}${d.toFixed(1)} pts vs Q${pq} ${py} (was ${prevOverall} of ${meta.overallMax})`;
    overallTrendHtml = `<div class="kpi-gauge-trend ${cls}" title="${escapeHtml(niceTip)}" aria-label="Overall trend" data-arrow-dir="${cls}">${_kpiArrowIcon(d, 22)}</div>`;
  }

  const header = `
    <div class="kpi-report-header">
      <div class="kpi-report-meta">
        <div class="kpi-meta-row"><span class="kpi-meta-label">Evaluator</span><strong>${escapeHtml(meta.evaluatorName || '—')}</strong>${meta.evaluatorPosition ? ` · <span style="color:var(--mid)">${escapeHtml(meta.evaluatorPosition)}</span>` : ''}</div>
        <div class="kpi-meta-row"><span class="kpi-meta-label">Evaluated</span><strong>${escapeHtml(meta.name || m.realName || '—')}</strong>${meta.position ? ` · <span style="color:var(--mid)">${escapeHtml(meta.position)}</span>` : ''}</div>
        <div class="kpi-meta-row"><span class="kpi-meta-label">Scope</span><strong>Q${meta.scope?.quarter} ${meta.scope?.year}</strong></div>
        ${meta.overallLabel ? `<div class="kpi-meta-row"><span class="kpi-meta-label">Rating</span><strong>${escapeHtml(meta.overallLabel)}</strong></div>` : ''}
      </div>
      <div class="kpi-report-gauge">
        ${overallTrendHtml}
        <div class="kpi-gauge-inner">
          ${_kpiGaugeSvg(meta.overall || 0, meta.overallMax || 100, meta.overallLabel || '')}
        </div>
      </div>
    </div>`;

  // Trend chips only appear when there is a chronologically-previous
  // quarter to compare the currently-viewed quarter against. First-time
  // uploads (and the first quarter on record) get no arrows per spec.
  const catList = cats.map((cat, ci) => {
    const pct  = _kpiPercent(cat.subtotal, cat.maxSubtotal);
    const band = _kpiBandForPercent(pct);
    const isOpen = _kpiOpenCats.has(ci);

    // Drill-in metric rows — pip-bar gauge + rating value chip. The pip bar
    // visually communicates "X out of 5" at a glance and partial-fills the
    // last active pip if the rating is a decimal (which the CSV format
    // may carry in the future). No "score / max" text — that was confusing
    // weight noise per user feedback.
    const metricRows = (cat.metrics || []).map((m2, mi) => {
      const rating = +(m2.rating || 0);
      // Color the pips by the rating's band (1..5 maps to band-1..5).
      // Use Math.ceil so a rating of 3.x still shows the band-4 color.
      const bandN  = Math.max(1, Math.min(5, Math.ceil(rating)));
      // Format rating for display: integer if whole, else 1 decimal.
      const ratingDisplay = (rating % 1 === 0) ? String(rating) : rating.toFixed(1);
      // Build five squircle pips.
      let pipsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const fillFrac = Math.max(0, Math.min(1, rating - (i - 1)));
        const w = (fillFrac * 100).toFixed(1) + '%';
        // No per-pip data-fill-to — the whole bar animates as ONE sweep
        // (see _kpiAnimPipBar) driven by data-pip-rating on the wrapper.
        pipsHtml += `<div class="kpi-pip"><div class="kpi-pip-fill kpi-band-${bandN}" style="width:${w}"></div></div>`;
      }
      return `<div class="kpi-metric">
        <div class="kpi-metric-head">
          <div>
            <div class="kpi-metric-title">${escapeHtml(m2.title)}
              <span class="kpi-metric-rating-chip kpi-band-${bandN}">${ratingDisplay}</span>
            </div>
            ${m2.description ? `<div class="kpi-metric-desc">${escapeHtml(m2.description)}</div>` : ''}
          </div>
        </div>
        <div class="kpi-pip-bar" aria-label="Rating ${ratingDisplay} of 5" data-pip-rating="${rating}" data-anim-key="pip-${ci}-${mi}">${pipsHtml}</div>
        ${_kpiNotesBlock(m, currentKey, _kpiMetricNoteKey(cat.title, m2.title))}
      </div>`;
    }).join('');

    return `<div class="kpi-cat${isOpen ? ' open' : ''}" data-cat-idx="${ci}">
      <div class="kpi-cat-head" onclick="kpiToggleCat(${ci})">
        <span class="kpi-cat-chev">▶</span>
        <div>
          <div class="kpi-cat-title">${escapeHtml(cat.title)}</div>
        </div>
        ${trendChipFor(ci) || '<span></span>'}
        <div class="kpi-cat-score"><span data-anim-key="cat-score-${ci}" data-count-to="${(+cat.subtotal).toFixed(cat.subtotal % 1 ? 1 : 0)}">${(+cat.subtotal).toFixed(cat.subtotal % 1 ? 1 : 0)}</span><span class="kpi-score-max"> / ${cat.maxSubtotal}</span></div>
        <div class="kpi-cat-bar-wrap"><div class="kpi-cat-bar kpi-band-${band.n}" style="width:${pct.toFixed(1)}%" data-fill-to="${pct.toFixed(1)}%" data-anim-key="cat-bar-${ci}"></div></div>
      </div>
      <div class="kpi-cat-body">${metricRows}</div>
    </div>`;
  }).join('');

  return `${header}<div class="kpi-cat-list">${catList}</div>`;
}

// ── Trends view = PAIRWISE QUARTER COMPARISON ────────────────────────────
// Pick a "from" and a "to" quarter; the tab becomes a scannable "what
// changed" report — per-category before/after mini-gauges, status chips,
// and auto-generated phrases, grouped + sorted worst-first so problem
// areas surface instantly. No chart (removed — it didn't communicate well).

// Classify one category's from→to movement into a status, a priority
// "concern" score (higher = worse, sorts to top in worst-first), and a
// plain-English phrase. Thresholds: low = <40% of max at the "to" quarter;
// sharp drop = lost ≥15% of max; critical = both.
function _kpiClassifyCmp(r) {
  const lowNow    = r.toPct < 40;
  const sharpDrop = r.deltaPct <= -15;
  const declined  = r.delta < -0.5;
  const improved  = r.delta > 0.5;
  const level = r.toPct < 20 ? 'critical' : r.toPct < 40 ? 'weak'
              : r.toPct < 60 ? 'solid'    : r.toPct < 80 ? 'strong' : 'outstanding';

  let status, statusLabel;
  if (lowNow && sharpDrop)      { status = 'critical';  statusLabel = 'Critical'; }
  else if (lowNow || sharpDrop) { status = 'attention'; statusLabel = 'Needs attention'; }
  else if (declined)            { status = 'regressed'; statusLabel = 'Slipped'; }
  else if (improved)            { status = 'improved';  statusLabel = 'Improved'; }
  else                          { status = 'steady';    statusLabel = 'Steady'; }
  // Celebrate genuinely strong, non-declining areas.
  if ((level === 'strong' || level === 'outstanding') && !declined && status !== 'critical' && status !== 'attention') {
    status = 'strong'; statusLabel = (level === 'outstanding' ? 'Outstanding' : 'Strong');
  }

  // Concern score — drives worst-first sort.
  let concern = (100 - r.toPct);
  if (r.delta < 0) concern += Math.abs(r.deltaPct) * 1.5;
  if (status === 'critical')  concern += 1000;
  else if (status === 'attention') concern += 500;

  // Phrase = trend clause + level clause + (priority nudge).
  //
  // Connector logic: when the trend and the level point in the same
  // direction (e.g. improved → solid, slipped → weak) use "now …" — the
  // landing state is the result of the move. When they disagree (improved
  // → still weak, slipped → still solid) use "but still …" so the
  // contrast is explicit instead of reading as a contradiction. When the
  // category held steady there's no "now" at all (nothing newly true).
  const dabs = Math.abs(r.delta).toFixed(1);
  const dpos = r.delta.toFixed(1);
  const trendUp   = improved || r.deltaPct >= 15;
  const trendDown = declined || r.deltaPct <= -15;
  const levelGood = (level === 'solid' || level === 'strong' || level === 'outstanding');
  const levelTail = {
    critical:    'at a critical low',
    weak:        'in the weak range',
    solid:       'at a solid level',
    strong:      'strong',
    outstanding: 'outstanding'
  }[level];
  let phrase;
  if (!trendUp && !trendDown) {
    // No meaningful change — describe the stable state, no "now".
    const steadyTail = (level === 'strong' || level === 'outstanding')
      ? `— still ${levelTail}` : levelTail;
    phrase = `Held steady ${steadyTail}.`;
  } else {
    const trendClause =
        r.deltaPct >= 15  ? `Surged +${dpos} pts`
      : trendUp           ? `Improved +${dpos} pts`
      : r.deltaPct <= -15 ? `Dropped sharply −${dabs} pts`
      :                     `Slipped −${dabs} pts`;
    const sameDir = (trendUp && levelGood) || (trendDown && !levelGood);
    const connector = sameDir ? 'now' : 'but still';
    phrase = `${trendClause} — ${connector} ${levelTail}.`;
  }
  if (status === 'critical')        phrase += ' Top priority to address.';
  else if (status === 'attention' && lowNow && !sharpDrop) phrase += ' A persistent weak spot worth a focused push.';
  else if (status === 'attention' && sharpDrop) phrase += ' Watch this closely next quarter.';

  return Object.assign({}, r, { level, status, statusLabel, concern, phrase });
}

function _renderKpiTrends(m) {
  const allKeys = _kpiSortedKeys(m);            // chronological ascending
  if (allKeys.length < 2) return '';

  // Defaults: earliest → latest (full arc). Re-validate stored picks in case
  // the underlying data was deleted since the last render. (The From→To
  // selectors themselves live in the toolbar — built in renderKpiSection —
  // so this body only renders the verdict + comparison cards.)
  if (!_kpiCmpFrom || !allKeys.includes(_kpiCmpFrom)) _kpiCmpFrom = allKeys[0];
  if (!_kpiCmpTo   || !allKeys.includes(_kpiCmpTo))   _kpiCmpTo   = allKeys[allKeys.length - 1];

  const labelFor = (key) => { const [y, q] = key.split('-Q'); return `Q${q} ${y}`; };

  if (_kpiCmpFrom === _kpiCmpTo) {
    return `<div class="kpi-cmp-hint">Pick two different quarters to compare.</div>`;
  }

  const fromData = m.kpi[_kpiCmpFrom];
  const toData   = m.kpi[_kpiCmpTo];

  // Per-category comparison records (driven by the "to" quarter's category
  // list, matched positionally to the "from" quarter).
  let cats = (toData.categories || []).map((c, i) => {
    const fromCat = (fromData.categories || [])[i] || {};
    const max   = c.maxSubtotal || fromCat.maxSubtotal || 25;
    const fromV = fromCat.subtotal != null ? fromCat.subtotal : 0;
    const toV   = c.subtotal != null ? c.subtotal : 0;
    const delta = +(toV - fromV).toFixed(2);
    const toPct = _kpiPercent(toV, max);
    const deltaPct = max ? (delta / max) * 100 : 0;
    return _kpiClassifyCmp({ title: c.title, max, fromV, toV, delta, toPct, deltaPct });
  });

  // Sort by concern. Worst-first = descending concern; flip for best-first.
  cats.sort((a, b) => _kpiCmpSort === 'worst' ? b.concern - a.concern : a.concern - b.concern);

  // Overall figures for the verdict banner.
  const oMax  = toData.meta.overallMax || 100;
  const oFrom = fromData.meta.overall || 0;
  const oTo   = toData.meta.overall || 0;
  const oDelta = +(oTo - oFrom).toFixed(1);

  const improvedCount  = cats.filter(c => c.delta > 0.5).length;
  const regressedCount = cats.filter(c => c.delta < -0.5).length;
  const attentionCount = cats.filter(c => c.status === 'critical' || c.status === 'attention').length;
  const criticalCount  = cats.filter(c => c.status === 'critical').length;

  // Verdict tone. Red = the OVERALL score declined (the headline bad news).
  // Amber = overall held/improved but there are problem areas to flag.
  // Green = improved with nothing flagged. (A critical category still shows
  // up loudly via its red card + the red "need attention" sub-text, so amber
  // here isn't burying it — it just keeps the banner honest about the net.)
  let vClass, vIcon;
  if (oDelta < -0.5)                                          { vClass = 'bad';   vIcon = '🔻'; }
  else if (criticalCount > 0 || regressedCount > 0 || attentionCount > 0) { vClass = 'mixed'; vIcon = '⚠️'; }
  else                                                        { vClass = 'good';  vIcon = '📈'; }

  const headline = oDelta > 0.5
      ? `Overall improved <strong>+${oDelta.toFixed(1)} pts</strong> (${oFrom} → ${oTo} of ${oMax})`
      : oDelta < -0.5
      ? `Overall declined <strong>−${Math.abs(oDelta).toFixed(1)} pts</strong> (${oFrom} → ${oTo} of ${oMax})`
      : `Overall held steady (${oTo} of ${oMax})`;
  const countBits = [
    improvedCount  ? `${improvedCount} improved`   : null,
    regressedCount ? `${regressedCount} regressed` : null,
    attentionCount ? `<strong style="color:#c0392b">${attentionCount} need${attentionCount > 1 ? '' : 's'} attention</strong>` : null
  ].filter(Boolean).join(' · ');
  const verdict = `<div class="kpi-verdict ${vClass}">
    <div class="kpi-verdict-icon">${vIcon}</div>
    <div>
      <div class="kpi-verdict-text">${headline} between <strong>${escapeHtml(labelFor(_kpiCmpFrom))}</strong> and <strong>${escapeHtml(labelFor(_kpiCmpTo))}</strong>.</div>
      ${countBits ? `<div class="kpi-verdict-sub">${countBits}.</div>` : ''}
    </div>
  </div>`;

  // Card render helpers.
  const pairKey = _kpiCmpFrom + '->' + _kpiCmpTo;   // note key for this comparison
  const statusIcon = (s) => ({ critical:'🔴', attention:'🟠', regressed:'📉', improved:'📈', steady:'➖', strong:'🌟' }[s] || '');
  const dirCls   = (d) => d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  const dirColor = (d) => d > 0.5 ? '#27ae60' : d < -0.5 ? '#c0392b' : 'var(--mid)';
  const card = (c) => `<div class="kpi-cmp-card s-${c.status}">
    <div class="kpi-cmp-card-main">
      <div class="kpi-cmp-card-head">
        <span class="kpi-cmp-card-title">${escapeHtml(c.title)}</span>
        <span class="kpi-cmp-chip s-${c.status}">${statusIcon(c.status)} ${escapeHtml(c.statusLabel)}</span>
      </div>
      <div class="kpi-cmp-phrase">${c.phrase}</div>
    </div>
    <div class="kpi-cmp-gauges">
      <div class="kpi-cmp-gauge">${_kpiMiniGauge(c.fromV, c.max)}<div class="kpi-cmp-gauge-q">${escapeHtml(labelFor(_kpiCmpFrom))}</div></div>
      <div class="kpi-cmp-mid">
        <span style="color:${dirColor(c.delta)}" data-arrow-dir="${dirCls(c.delta)}">${_kpiArrowIcon(c.delta, 18)}</span>
        <div class="kpi-cmp-mid-delta ${dirCls(c.delta)}">${c.delta > 0 ? '+' : c.delta < 0 ? '−' : ''}${Math.abs(c.delta).toFixed(1)}</div>
      </div>
      <div class="kpi-cmp-gauge">${_kpiMiniGauge(c.toV, c.max)}<div class="kpi-cmp-gauge-q">${escapeHtml(labelFor(_kpiCmpTo))}</div></div>
    </div>
    ${_kpiNotesBlock(m, pairKey, c.title)}
  </div>`;

  // Walk the sorted list; insert a group divider whenever the bucket changes
  // (buckets respect the current sort direction automatically).
  const bucketOf = (c) =>
      (c.status === 'critical' || c.status === 'attention') ? 'attention'
    : c.status === 'regressed' ? 'regressed'
    : c.status === 'steady'    ? 'steady' : 'well';
  const bucketLabel = {
    attention: '🔴 Needs attention',
    regressed: '📉 Slipped',
    steady:    '➖ Held steady',
    well:      '📈 Doing well'
  };
  let listHtml = '', lastBucket = null;
  for (const c of cats) {
    const b = bucketOf(c);
    if (b !== lastBucket) { listHtml += `<div class="kpi-cmp-group-label">${bucketLabel[b]}</div>`; lastBucket = b; }
    listHtml += card(c);
  }

  return `${verdict}<div class="kpi-cmp-list">${listHtml}</div>`;
}

// ── KPI viewer modal ─────────────────────────────────────────────────────
// The KPI report lives in its own modal layered above the team profile so
// it has the screen real estate it needs and doesn't fight the profile
// editor. The profile detail just hosts a "📊 Open KPI Report" button.

// Currently-viewed member id. While the overlay is open, all KPI actions
// (year/quarter/subview/expand/upload) re-render this modal — not the
// profile. The team profile underneath remains untouched.
let _kpiViewingMemberId = null;

// Open the KPI viewer for the profile currently open (or an explicit id).
// Privacy is enforced again here as defense-in-depth — the launcher button
// is also gated on canViewKpi but a programmatic call shouldn't bypass.
function openKpiViewer(memberId) {
  const id = memberId || editingTmId;
  if (!id) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return;
  if (!canViewKpi(m)) { showToast("You don't have access to this KPI."); return; }
  _kpiViewingMemberId = id;
  renderKpiViewer();
  document.getElementById('kpi-overlay').classList.add('open');
}

function closeKpiViewer() {
  document.getElementById('kpi-overlay').classList.remove('open');
  _kpiViewingMemberId = null;
}
function maybeCloseKpi(e) { if (_shouldCloseOverlay(e, 'kpi-overlay')) closeKpiViewer(); }

// Render (or re-render) the modal contents. Reads the latest member data
// from TEAM_DIRECTORY in case Firebase pushed an update while the modal
// was open. Falls back to _tmDraft if the member id matches the open
// profile (so unsaved profile edits like uploaded KPI are reflected).
function renderKpiViewer() {
  if (!_kpiViewingMemberId) return;
  let m = (TEAM_DIRECTORY || []).find(x => x.id === _kpiViewingMemberId);
  if (_tmDraft && _tmDraft.id === _kpiViewingMemberId) m = _tmDraft;
  if (!m) { closeKpiViewer(); return; }

  // Header: avatar + name + slack/projects subtitle.
  const av = document.getElementById('kpi-modal-avatar');
  const nm = document.getElementById('kpi-modal-name');
  const sb = document.getElementById('kpi-modal-sub');
  if (av) av.innerHTML = m.image
    ? `<img src="${escAttr(m.image)}" alt=""/>`
    : defaultPersonIconSvg(28);
  if (nm) nm.textContent = (m.realName || 'Team Member') + ' · KPI Report';
  if (sb) {
    const slack = m.slackName ? '@' + String(m.slackName).replace(/^@/, '') : '';
    const projects = (m.projects || []).slice(0, 3).join(', ');
    sb.textContent = [slack, projects].filter(Boolean).join('  ·  ');
  }
  // Body: reuse the existing renderKpiSection() output. The function
  // returns an empty string for non-viewers, but we already gated via
  // canViewKpi above, so we expect a non-empty section here.
  const body = document.getElementById('kpi-modal-body');
  if (body) {
    body.innerHTML = renderKpiSection(m);
    // Run the open/refresh animations, then reset the mode to the default.
    // Handlers that shouldn't replay everything (drill-in, note editing) set
    // _kpiAnimMode/_kpiAnimCat just before calling renderKpiViewer.
    const mode = _kpiAnimMode, cat = _kpiAnimCat;
    _kpiAnimMode = 'full'; _kpiAnimCat = null;
    _kpiRunAnimations(body, mode, cat);
  }
}

// ── KPI animations ───────────────────────────────────────────────────────
// Everything is rendered at its FINAL value in the HTML, so reduced-motion /
// no-JS still shows correct numbers. These helpers reset an element to its
// "empty/zero" state and transition it back to final for a satisfying
// fill / count-up / arrow-bounce on open.
let _kpiAnimMode = 'full';   // 'full' | 'drillin' | 'none'
let _kpiAnimCat  = null;     // category index for 'drillin'

function _kpiReducedMotion() {
  try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch(e) { return false; }
}
function _kpiCountUp(el, carry) {
  const tgt = parseFloat(el.getAttribute('data-count-to'));
  if (!isFinite(tgt)) return;
  const dec = (String(el.getAttribute('data-count-to')).indexOf('.') >= 0) ? 1 : 0;
  // Carry-over: count FROM the previously-displayed value for this element
  // (so the number ticks up OR down to the new quarter's value) when we have
  // a remembered value; otherwise count up from 0.
  const key = el.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = tgt;
  const dur = 750;
  let t0 = null;
  const step = (ts) => {
    if (t0 === null) t0 = ts;
    const t = Math.min(1, (ts - t0) / dur);
    const eased = 1 - Math.pow(1 - t, 3);   // easeOutCubic
    el.textContent = (from + (tgt - from) * eased).toFixed(dec);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = tgt.toFixed(dec);
  };
  requestAnimationFrame(step);
}
// NOTE on technique: CSS transitions on SVG paint properties (stroke-
// dashoffset) proved unreliable to (re)trigger after innerHTML replacement —
// they stall at the start value. So we JS-tween every value frame-by-frame
// with requestAnimationFrame (the same mechanism the count-up uses, which is
// rock-solid here). easeOutCubic gives a quick-then-settle feel.
function _kpiTween(setFn, from, to, dur) {
  dur = dur || 800;
  let t0 = null, done = false;
  const finish = () => { if (done) return; done = true; setFn(to); };
  const step = (ts) => {
    if (done) return;
    if (t0 === null) t0 = ts;
    const t = Math.min(1, (ts - t0) / dur);
    const eased = 1 - Math.pow(1 - t, 3);   // easeOutCubic
    setFn(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
    else finish();
  };
  requestAnimationFrame(step);
  // Safety net: if rAF is starved (backgrounded / headless tab that isn't
  // painting), still land on the final value so content is never left stuck
  // in its reset/empty state. In a normal foreground tab rAF finishes first
  // and this becomes a no-op.
  setTimeout(finish, dur + 250);
}
function _kpiAnimGauge(circle, carry) {
  const off = parseFloat(circle.getAttribute('data-off'));
  const circ = parseFloat(circle.getAttribute('data-circ'));
  if (!isFinite(off) || !isFinite(circ)) return;
  // Carry-over: start the ring from the previously-displayed offset (so it
  // visibly grows or shrinks toward the new quarter's value) when remembered;
  // otherwise start from empty (full circumference).
  const key = circle.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : circ;
  if (key) _kpiLastAnim[key] = off;
  // Drive the SVG presentation attribute directly — assigning a raw number to
  // circle.style.strokeDashoffset silently fails in some engines, whereas
  // setAttribute is reliable for SVG.
  _kpiTween(v => { circle.setAttribute('stroke-dashoffset', v.toFixed(2)); }, from, off, 850);
}
function _kpiAnimFill(el, carry) {
  const w = parseFloat(el.getAttribute('data-fill-to'));   // "100.0%" → 100
  if (!isFinite(w)) return;
  const key = el.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = w;
  el.style.transition = 'none';
  _kpiTween(v => { el.style.width = v + '%'; }, from, w, 700);
}
// Animate a 5-pip bar as ONE continuous bar sweeping left→right. A single
// value tweens from→rating; each frame distributes it across the pips
// (pip i fills as the value passes i), so the fill front moves through pip 1,
// then 2, then 3… rather than every pip filling at once. With carry-over the
// "from" is the previous quarter's rating so a metric visibly rises or falls.
function _kpiAnimPipBar(barEl, carry) {
  const rating = parseFloat(barEl.getAttribute('data-pip-rating'));
  if (!isFinite(rating)) return;
  const key = barEl.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = rating;
  const fills = barEl.querySelectorAll('.kpi-pip-fill');
  // Don't reset width synchronously — let the tween's first frame set the
  // start distribution. That way, if rAF never fires the pips simply stay at
  // their rendered final widths instead of getting stuck empty.
  fills.forEach(f => { f.style.transition = 'none'; });
  _kpiTween(v => {
    fills.forEach((f, idx) => {
      const frac = Math.max(0, Math.min(1, v - idx));
      f.style.width = (frac * 100).toFixed(1) + '%';
    });
  }, from, rating, 700);
}
function _kpiAnimArrow(el) {
  const dir = el.getAttribute('data-arrow-dir') || 'flat';
  el.classList.remove('kpi-anim-arrow', 'up', 'down', 'flat');
  void el.getBoundingClientRect();
  el.classList.add('kpi-anim-arrow', dir);
}
function _kpiRunAnimations(root, mode, openCatIdx) {
  if (!root || mode === 'none' || _kpiReducedMotion()) return;
  if (mode === 'drillin') {
    // Only the just-expanded category's pip bars animate — no full-page replay.
    // carry=false: a freshly-revealed drill-in sweeps from empty (it's a
    // reveal within the SAME quarter, not a quarter-to-quarter change).
    const cat = root.querySelector('.kpi-cat.open[data-cat-idx="' + openCatIdx + '"]');
    if (cat) cat.querySelectorAll('.kpi-pip-bar[data-pip-rating]').forEach(b => _kpiAnimPipBar(b, false));
    return;
  }
  // 'full' — animate everything currently visible. carry=true so gauges/bars/
  // numbers/pips animate FROM the previously-displayed value (visible up/down)
  // when one is remembered, else from 0/empty (first open).
  root.querySelectorAll('[data-kpi-gauge]').forEach(c => _kpiAnimGauge(c, true));
  root.querySelectorAll('.kpi-cat-bar[data-fill-to]').forEach(e => _kpiAnimFill(e, true));
  root.querySelectorAll('.kpi-cat.open .kpi-pip-bar[data-pip-rating]').forEach(b => _kpiAnimPipBar(b, true));
  root.querySelectorAll('[data-count-to]').forEach(e => _kpiCountUp(e, true));
  root.querySelectorAll('[data-arrow-dir]').forEach(_kpiAnimArrow);
}

// ── KPI interaction handlers ─────────────────────────────────────────────
// All handlers re-render the KPI VIEWER (not the profile underneath) so
// state changes are localized to the open modal.
function kpiSelectYear(y)    { _kpiYear = parseInt(y, 10); _kpiQuarter = null; renderKpiViewer(); }
function kpiSelectQuarter(q) { _kpiQuarter = q; renderKpiViewer(); }
function kpiSetSubview(v)    { _kpiSubview = v; renderKpiViewer(); }
function kpiToggleCat(i) {
  const opening = !_kpiOpenCats.has(i);
  if (opening) _kpiOpenCats.add(i); else _kpiOpenCats.delete(i);
  // Drill-in: animate only the newly-revealed pip bars, not the whole page.
  _kpiAnimMode = 'drillin'; _kpiAnimCat = i;
  renderKpiViewer();
}
function kpiPrint() { window.print(); }

// Trends pairwise-comparison handlers.
function kpiCmpSetFrom(key) { _kpiCmpFrom = key; renderKpiViewer(); }
function kpiCmpSetTo(key)   { _kpiCmpTo = key;   renderKpiViewer(); }
function kpiCmpToggleSort() { _kpiCmpSort = (_kpiCmpSort === 'worst' ? 'best' : 'worst'); renderKpiViewer(); }

// ── Coaching notes (admin-authored, owner+admin viewable) ────────────────
// Notes are tied to the exact From→To comparison pair AND category title.
// Multiple notes stack per (pair, category), each timestamped. Admin can
// add/edit/delete; non-admins only see existing notes.
function _kpiFmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch(e) { return ''; }
}
function _kpiNoteMember() {
  // The member being viewed. Mutating its kpiNotes + saveTeamOnly() persists
  // and syncs. Keep _tmDraft pointing at the same kpiNotes object so both
  // render sources agree.
  const id = _kpiViewingMemberId;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return null;
  if (!m.kpiNotes || typeof m.kpiNotes !== 'object') m.kpiNotes = {};
  if (_tmDraft && _tmDraft.id === id) _tmDraft.kpiNotes = m.kpiNotes;
  return m;
}
function _kpiNotesFor(m, pair, cat) {
  return (m && m.kpiNotes && m.kpiNotes[pair] && m.kpiNotes[pair][cat]) || [];
}
// Inner-key for per-metric coaching notes. Notes for metrics live under the
// QUARTER scope key (e.g. "2026-Q1", which never contains "->" so it can't
// collide with the Trends pair keys), with this composite category|||metric
// inner key. The whole coaching-note machinery (_kpiNotesBlock + handlers) is
// generic over (outerKey, innerKey), so metrics reuse it unchanged.
function _kpiMetricNoteKey(catTitle, metricTitle) { return catTitle + ' ||| ' + metricTitle; }

// Seed CSV per-metric comments as the first coaching note for each metric on
// upload. Seeded notes carry `seeded:true`. To avoid duplicating on re-upload
// we drop any prior STILL-seeded note for the metric and re-seed from the new
// CSV; admin-authored notes (and seeds the admin later edited — see kpiNoteSave
// which clears the flag on edit) are preserved.
function _kpiSeedMetricNotes(member, scopeKey, data) {
  if (!member.kpiNotes || typeof member.kpiNotes !== 'object') member.kpiNotes = {};
  if (!member.kpiNotes[scopeKey]) member.kpiNotes[scopeKey] = {};
  const bucket = member.kpiNotes[scopeKey];
  for (const cat of (data.categories || [])) {
    for (const met of (cat.metrics || [])) {
      const nk = _kpiMetricNoteKey(cat.title, met.title);
      const kept = (bucket[nk] || []).filter(n => !n.seeded);   // keep manual/edited
      const comment = (met.comment || '').trim();
      if (comment) {
        kept.unshift({ id: 'note-seed-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), text: comment, ts: Date.now(), seeded: true });
      }
      if (kept.length) bucket[nk] = kept; else delete bucket[nk];
    }
  }
}

// Returns the notes block HTML for a comparison card OR a metric. Empty string
// when a non-admin has no notes to show (so the card stays clean).
function _kpiNotesBlock(m, pair, cat) {
  const notes = _kpiNotesFor(m, pair, cat);
  const editing = _kpiNoteEdit && _kpiNoteEdit.pair === pair && _kpiNoteEdit.cat === cat;
  const pj = escJsAttr(pair), cj = escJsAttr(cat);
  let inner = '';

  for (const n of notes) {
    if (editing && _kpiNoteEdit.id === n.id) {
      inner += `<div class="kpi-note editing">
        <textarea class="form-textarea" id="kpi-note-input" rows="3" placeholder="Coaching note…">${escapeHtml(n.text)}</textarea>
        <div class="kpi-note-actions">
          <button class="btn btn-secondary" onclick="kpiNoteCancel()">Cancel</button>
          <button class="btn btn-primary" onclick="kpiNoteSave('${pj}','${cj}','${escJsAttr(n.id)}')">Save</button>
        </div>
      </div>`;
    } else {
      inner += `<div class="kpi-note">
        <div class="kpi-note-head">
          <span class="kpi-note-badge">📝 Coaching note</span>
          <span class="kpi-note-date">${escapeHtml(_kpiFmtDate(n.ts))}</span>
          ${isAdminMode ? `<span class="kpi-note-tools">
            <button class="kpi-note-tool" title="Edit note" onclick="kpiNoteStartEdit('${pj}','${cj}','${escJsAttr(n.id)}')">✎</button>
            <button class="kpi-note-tool danger" title="Delete note" onclick="kpiNoteDelete('${pj}','${cj}','${escJsAttr(n.id)}')">🗑</button>
          </span>` : ''}
        </div>
        <div class="kpi-note-text">${escapeHtml(n.text)}</div>
      </div>`;
    }
  }

  if (isAdminMode) {
    if (editing && _kpiNoteEdit.id === null) {
      inner += `<div class="kpi-note editing">
        <textarea class="form-textarea" id="kpi-note-input" rows="3" placeholder="How can they pull this up coming into the next quarter?"></textarea>
        <div class="kpi-note-actions">
          <button class="btn btn-secondary" onclick="kpiNoteCancel()">Cancel</button>
          <button class="btn btn-primary" onclick="kpiNoteSave('${pj}','${cj}','')">Add note</button>
        </div>
      </div>`;
    } else if (!editing) {
      inner += `<button class="kpi-note-add" onclick="kpiNoteStartAdd('${pj}','${cj}')">＋ Add coaching note</button>`;
    }
  }

  if (!inner) return '';   // non-admin, no notes → render nothing
  return `<div class="kpi-cmp-notes">${inner}</div>`;
}
function _kpiFocusNoteInput() {
  setTimeout(() => {
    const t = document.getElementById('kpi-note-input');
    if (t) { t.focus(); try { t.setSelectionRange(t.value.length, t.value.length); } catch(e){} }
  }, 60);
}
function kpiNoteStartAdd(pair, cat)  { _kpiNoteEdit = { pair, cat, id: null }; _kpiAnimMode = 'none'; renderKpiViewer(); _kpiFocusNoteInput(); }
function kpiNoteStartEdit(pair, cat, id) { _kpiNoteEdit = { pair, cat, id }; _kpiAnimMode = 'none'; renderKpiViewer(); _kpiFocusNoteInput(); }
function kpiNoteCancel() { _kpiNoteEdit = null; _kpiAnimMode = 'none'; renderKpiViewer(); }
function kpiNoteSave(pair, cat, id) {
  if (!isAdminMode) return;
  const ta = document.getElementById('kpi-note-input');
  const text = ta ? ta.value.trim() : '';
  if (!text) { _kpiNoteEdit = null; _kpiAnimMode = 'none'; renderKpiViewer(); return; }
  const m = _kpiNoteMember();
  if (!m) return;
  if (!m.kpiNotes[pair]) m.kpiNotes[pair] = {};
  if (!m.kpiNotes[pair][cat]) m.kpiNotes[pair][cat] = [];
  const arr = m.kpiNotes[pair][cat];
  if (id) {
    const n = arr.find(x => x.id === id);
    if (n) {
      n.text = text;                 // keep original timestamp on edit
      delete n.seeded;               // an edited seed becomes an admin-owned note (won't be re-seeded on re-upload)
    }
  } else {
    arr.push({ id: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), text, ts: Date.now() });
  }
  saveTeamOnly();
  _kpiNoteEdit = null;
  _kpiAnimMode = 'none';
  renderKpiViewer();
  showToast(id ? 'Coaching note updated' : 'Coaching note added');
}
async function kpiNoteDelete(pair, cat, id) {
  if (!isAdminMode) return;
  if (!await customConfirm('Delete this coaching note? This cannot be undone.', { danger: true, confirmLabel: 'Delete note' })) return;
  const m = _kpiNoteMember();
  if (!m || !m.kpiNotes[pair] || !m.kpiNotes[pair][cat]) return;
  m.kpiNotes[pair][cat] = m.kpiNotes[pair][cat].filter(x => x.id !== id);
  saveTeamOnly();
  _kpiAnimMode = 'none';
  renderKpiViewer();
  showToast('Coaching note deleted');
}

// ── Admin delete-quarter action ──────────────────────────────────────────
// Removes the KPI record for the currently-viewed quarter. Used when the
// wrong CSV was uploaded. Confirmation modal shows the year/quarter and
// member name so the admin doesn't fat-finger the wrong record.
async function kpiDeleteQuarter() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  const key = _scopeKey(_kpiYear, _kpiQuarter);
  const existing = _tmDraft.kpi && _tmDraft.kpi[key];
  if (!existing) return;

  const who = _tmDraft.realName || _tmDraft.slackName || 'this team member';
  const ok = await customConfirm(
    `Delete the Q${_kpiQuarter} ${_kpiYear} KPI record for ${who}?\n\n` +
    `Overall score on file: ${existing.meta?.overall ?? '?'} / ${existing.meta?.overallMax ?? '?'}.\n` +
    `This cannot be undone — you'll need to re-upload the correct CSV to restore.`,
    { danger: true, confirmLabel: 'Delete this quarter' }
  );
  if (!ok) return;

  // Wipe from the open draft AND the directory; persist immediately.
  delete _tmDraft.kpi[key];
  const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
  if (idx >= 0 && TEAM_DIRECTORY[idx].kpi) {
    delete TEAM_DIRECTORY[idx].kpi[key];
    saveTeamOnly();
  }
  // Re-render. If the deleted quarter was the only one on record, the
  // section auto-falls-back to the empty state. The currently-selected
  // quarter is preserved so the admin can see "now missing" feedback.
  if (document.getElementById('kpi-overlay').classList.contains('open')) renderKpiViewer();
  else renderTmDetail();
  showToast(`Deleted Q${_kpiQuarter} ${_kpiYear} record.`);
}

// ── Admin upload flow ────────────────────────────────────────────────────
async function kpiUploadStart() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.csv,text/csv';
  inp.onchange = async ev => {
    const file = ev.target.files[0];
    if (!file) return;
    let text = '';
    try { text = await file.text(); }
    catch(e) { alert('Could not read the file: ' + e.message); return; }

    const parsed = parseKpiCsv(text);
    if (!parsed.ok) { alert('Cannot use this CSV.\n\n' + parsed.error); return; }

    const meta = parsed.data.meta;
    const key = meta.scope.key;

    // Name match guard — refuse to upload someone else's CSV to this profile.
    // Comparison is case-insensitive and collapses internal whitespace so
    // "John  Smith" still matches "john smith". Skipped silently when either
    // side is empty (the parser already ensures Name is present, but profiles
    // without a Real Name don't trigger the check).
    const _norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const csvName = _norm(meta.name);
    const memberName = _norm(_tmDraft.realName);
    if (csvName && memberName && csvName !== memberName) {
      alert(
        'This CSV is for "' + (meta.name || '?') + '" but you are uploading it to ' +
        (_tmDraft.realName || '(unnamed profile)') + "'s profile.\n\n" +
        'The Real Name on the profile must match the Name field in the CSV. Please verify you have the right CSV for the right person.'
      );
      return;
    }

    // Future-quarter block (defense in depth — UI hides future tabs anyway).
    if (_isFutureQuarter(meta.scope.year, meta.scope.quarter)) {
      alert(`Q${meta.scope.quarter} ${meta.scope.year} hasn't happened yet. You can only upload data for the current or past quarters.`);
      return;
    }

    // Overwrite confirmation if data already exists for this scope.
    const existing = _tmDraft.kpi[key];
    if (existing) {
      const ok = await customConfirm(
        `Overwrite the existing ${key} record? The current overall score is ${existing.meta?.overall ?? '?'}/${existing.meta?.overallMax ?? '?'}; the new CSV says ${meta.overall}/${meta.overallMax}.`,
        { danger: true, confirmLabel: 'Replace' }
      );
      if (!ok) return;
    } else {
      const ok = await customConfirm(
        `Upload ${key} for ${escapeHtml(meta.name || m.realName)}? Overall: ${meta.overall}/${meta.overallMax} (${escapeHtml(meta.overallLabel || '')}).`,
        { confirmLabel: 'Upload' }
      );
      if (!ok) return;
    }

    // Commit to draft AND directory (immediate persistence — admin doesn't
    // need to also click "Save" to seal the KPI upload).
    _tmDraft.kpi[key] = parsed.data;
    const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
    if (idx >= 0) {
      if (!TEAM_DIRECTORY[idx].kpi || typeof TEAM_DIRECTORY[idx].kpi !== 'object') TEAM_DIRECTORY[idx].kpi = {};
      TEAM_DIRECTORY[idx].kpi[key] = parsed.data;
      // Seed each metric's CSV comment as its first coaching note (de-duped).
      _kpiSeedMetricNotes(TEAM_DIRECTORY[idx], key, parsed.data);
      _tmDraft.kpiNotes = TEAM_DIRECTORY[idx].kpiNotes;   // keep the draft in sync
      saveTeamOnly();
    } else {
      // No directory entry (shouldn't normally happen) — seed on the draft.
      _kpiSeedMetricNotes(_tmDraft, key, parsed.data);
    }
    // Jump straight to the newly-uploaded quarter so the admin sees the result.
    _kpiYear = meta.scope.year;
    _kpiQuarter = meta.scope.quarter;
    _kpiSubview = 'quarter';
    // Re-render whichever surface is currently visible — the dedicated KPI
    // viewer if open (typical path now), otherwise fall back to the inline
    // profile re-render (in case kpiUploadStart is ever called from there).
    if (document.getElementById('kpi-overlay').classList.contains('open')) renderKpiViewer();
    else renderTmDetail();
    showToast(`KPI uploaded: ${key}`);
  };
  inp.click();
}

function addTmProject(value) {
  const v = (value || '').trim();
  if (!v) return;
  if (!_tmDraft.projects) _tmDraft.projects = [];
  if (_tmDraft.projects.includes(v)) return;
  _tmDraft.projects.push(v);
  renderTmDetail();
  setTimeout(() => { const inp = document.getElementById('tm-project-input'); if (inp) inp.focus(); }, 30);
}
function removeTmProject(i) {
  if (!_tmDraft.projects) return;
  _tmDraft.projects.splice(i, 1);
  renderTmDetail();
}

function uploadTmImage() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async ev => {
    const file = ev.target.files[0]; if (!file) return;
    if (file.size > AVATAR_MAX_BYTES) {
      alert(`Avatar is too large (${(file.size/1024/1024).toFixed(2)} MB). Maximum allowed is 1 MB.`);
      return;
    }
    try {
      const originalUrl = await fileToDataUrl(file);
      // Auto-resize to fit AVATAR_MAX_DIM × AVATAR_MAX_DIM
      const resized = await resizeImage(originalUrl, AVATAR_MAX_DIM, file.type);
      _tmDraft.image = resized;
      renderTmDetail();
    } catch(err) {
      alert('Could not process image: ' + err.message);
    }
  };
  inp.click();
}
function clearTmImage() { _tmDraft.image = ''; renderTmDetail(); }

function saveTm() {
  // Permission check (defense in depth — UI hides the Save button for viewers
  // who can't edit, but make sure a programmatic call can't bypass).
  if (editingTmId) {
    const existing = (TEAM_DIRECTORY || []).find(x => x.id === editingTmId);
    if (existing && !canEditTm(existing)) {
      alert('You can only edit your own profile (or sign in as admin).');
      return;
    }
  }
  // Pull in-edit-mode values from inputs into draft
  if (tmEditMode) {
    const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    _tmDraft.slackName     = get('tm-slackName');
    _tmDraft.realName      = get('tm-realName');
    _tmDraft.expertise     = get('tm-expertise');
    _tmDraft.artStyle      = get('tm-artStyle');
    _tmDraft.favoriteGenre = get('tm-favoriteGenre');
    _tmDraft.favoriteGames = get('tm-favoriteGames');
    _tmDraft.portfolio     = get('tm-portfolio');
    _tmDraft.schedule = {
      signIn: get('tm-signIn'),
      signOut: get('tm-signOut'),
      timezone: get('tm-timezone') || 'America/New_York'
    };
    // Capture any unsubmitted text in the project input as a final chip
    const remaining = document.getElementById('tm-project-input');
    if (remaining && remaining.value.trim()) {
      addTmProject(remaining.value.trim());
      // re-capture inputs after re-render
      return saveTm();
    }
  }

  // Validation
  if (!_tmDraft.slackName) { alert('Slack Name is required.'); return; }
  if (!_tmDraft.realName) { alert('Real Name is required.'); return; }
  if (!_tmDraft.projects || _tmDraft.projects.length === 0) { alert('Please add at least one project.'); return; }

  _tmDraft._updatedAt = Date.now();

  // Track first-save (= profile creation) so we can show the one-time
  // "Save this passkey!" notice to the new owner.
  const isFirstSave = !editingTmId || !TEAM_DIRECTORY.some(m => m.id === editingTmId);

  if (editingTmId) {
    const idx = TEAM_DIRECTORY.findIndex(m => m.id === editingTmId);
    if (idx === -1) { TEAM_DIRECTORY.push(_tmDraft); }
    else { TEAM_DIRECTORY[idx] = _tmDraft; }
  } else {
    TEAM_DIRECTORY.push(_tmDraft);
    editingTmId = _tmDraft.id;
  }

  // Make sure the new profile got a passkey (blankTm() always does, but in
  // case a future code path constructs one without going through blankTm).
  if (isFirstSave && !_tmDraft.passkey) {
    const used = new Set(TEAM_DIRECTORY.map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
    do { _tmDraft.passkey = generatePasskey(); } while (used.has(_tmDraft.passkey.toUpperCase()));
  }

  saveTeamOnly();
  tmEditMode = false;

  // On profile creation: auto-sign-in the new owner so the next thing they do
  // (edit their own profile, see "their" pages) just works. Only do this if
  // nobody is currently signed in (otherwise this would hijack the session of
  // whoever opened the "Add Team Member" card — e.g. an admin onboarding a
  // teammate, where the admin should remain admin).
  if (isFirstSave && !currentUser && !isAdminMode) {
    setCurrentUser(_tmDraft, true /* stay signed in by default after creation */);
    _renderSignOutChip();
  }

  renderTmDetail();
  renderTeamRoster();
  document.getElementById('tm-detail-title').textContent = _tmDraft.realName || 'Team Member';

  // NEW DATA MODEL: the generated plaintext passkey isn't stored on the profile
  // (it's stripped on write) — hash it into /team-secrets so the new member can
  // log in. Fire-and-forget with an error toast; the plaintext is shown once below.
  if (isFirstSave && USE_NEW_DATA_MODEL && _tmDraft.passkey) {
    dataSetPasskeyHash(_tmDraft.id, _tmDraft.passkey)
      .catch(() => showToast('Could not save the passkey — reset it from All Passkeys.'));
  }

  // Show the one-time passkey notice AFTER persisting and re-rendering, so the
  // user sees their card already updated underneath the modal.
  if (isFirstSave) showNewProfilePasskey(_tmDraft);
}

async function deleteCurrentTm() {
  if (!editingTmId) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === editingTmId);
  if (!m) return;
  if (!canEditTm(m)) { alert('You can only delete your own profile (or sign in as admin).'); return; }
  if (!await customConfirm('Remove this team member profile? This cannot be undone — and the passkey will stop working.', { danger: true, confirmLabel: 'Delete profile' })) return;
  const wasSelf = currentUser && currentUser.tmId === editingTmId;
  TEAM_DIRECTORY = TEAM_DIRECTORY.filter(m => m.id !== editingTmId);
  saveTeamOnly();
  renderTeamRoster();
  closeTmDetail();
  // If the user just deleted their own profile, sign them out so they don't
  // sit on a phantom session pointing at a missing member.
  if (wasSelf) signOut();
}

// One-time "save this passkey!" notice shown right after profile creation.
// The owner sees their 8-char code in big mono, can copy it to clipboard,
// and must acknowledge before dismissing. After this they only see it again
// at creation in this same modal — admins can look it up later via the
// admin-only passkey section at the bottom of the profile.
function showNewProfilePasskey(m) {
  if (!m || !m.passkey) return;
  const overlay = document.getElementById('new-pk-overlay');
  if (!overlay) return;
  const code  = document.getElementById('new-pk-code');
  const intro = document.getElementById('new-pk-intro');
  if (code)  code.textContent  = m.passkey;
  if (intro) intro.innerHTML   = 'Profile saved for <strong>' +
    escapeHtml(m.slackName ? '@' + String(m.slackName).replace(/^@/, '') : (m.realName || 'this team member')) +
    '</strong>.';
  overlay.classList.add('open');
  // Auto-focus the Copy button so Enter copies + closes is one fast path.
  setTimeout(() => {
    const btn = document.getElementById('new-pk-copy-btn');
    if (btn) btn.focus();
  }, 80);
}
function copyNewPasskey() {
  const t = document.getElementById('new-pk-code');
  if (!t || !t.textContent) return;
  navigator.clipboard.writeText(t.textContent).then(
    () => showToast('Passkey copied — paste it somewhere safe!'),
    () => showToast('Could not copy automatically — select and copy manually.')
  );
}
function closeNewPasskey() {
  const overlay = document.getElementById('new-pk-overlay');
  if (overlay) overlay.classList.remove('open');
}

/* ── ALL PASSKEYS admin lookup ───────────────────────────────────────────
   A searchable table of every team member + their passkey, with quick copy
   and rotate buttons. Built for the "I forgot my passkey, can you help?"
   support flow — admins can grab the code and DM it back in a few seconds. */
function openAllPasskeys() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  // The All Passkeys page is a focused admin workspace — close the Team
  // Directory window underneath so the user isn't stacking two related
  // panels. The 🔑 button in the team directory header is the only way in,
  // so dismissing the parent is safe and reduces visual clutter.
  closeTeamModal();
  const inp = document.getElementById('pk-filter');
  if (inp) inp.value = '';
  document.getElementById('pk-modal-overlay').classList.add('open');
  // NEW DATA MODEL: passkeys live in /team-secrets — pull them in (admin-only)
  // before rendering so the table shows real values, not blanks.
  if (typeof USE_NEW_DATA_MODEL !== 'undefined' && USE_NEW_DATA_MODEL && typeof dataMergeAdminPasskeys === 'function') {
    renderPasskeysTable();   // immediate (may be blank), then refresh after merge
    dataMergeAdminPasskeys().then(() => renderPasskeysTable());
  } else {
    renderPasskeysTable();
  }
  setTimeout(() => { if (inp) inp.focus(); }, 60);
}
function closeAllPasskeys() { document.getElementById('pk-modal-overlay').classList.remove('open'); }
function maybeClosePk(e)    { if (_shouldCloseOverlay(e, 'pk-modal-overlay')) closeAllPasskeys(); }

function renderPasskeysTable() {
  const wrap = document.getElementById('pk-table-wrap');
  if (!wrap) return;
  const q = (document.getElementById('pk-filter')?.value || '').trim().toLowerCase();
  const rows = (TEAM_DIRECTORY || [])
    .filter(m => m && m.id)
    .filter(m => {
      if (!q) return true;
      const hay = [m.slackName, m.realName, m.passkey, ...(m.projects || [])]
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => String(a.realName || a.slackName || '').localeCompare(String(b.realName || b.slackName || '')));

  if (!rows.length) {
    wrap.innerHTML = `<div class="pk-empty">${q ? 'No matches.' : 'No team members yet.'}</div>`;
    return;
  }
  const html = `<table class="pk-table">
    <thead><tr>
      <th style="width:36px"></th>
      <th>Slack</th>
      <th>Real Name</th>
      <th>Passkey</th>
      <th style="width:1px;white-space:nowrap">Actions</th>
    </tr></thead>
    <tbody>
      ${rows.map(m => `<tr>
        <td>${m.image ? `<img class="pk-avatar" src="${escAttr(m.image)}" alt=""/>` : `<div class="pk-avatar"></div>`}</td>
        <td>${m.slackName ? escapeHtml('@' + m.slackName.replace(/^@/, '')) : '<span style="color:var(--mid)">(no slack)</span>'}</td>
        <td>${m.realName ? escapeHtml(m.realName) : '<span style="color:var(--mid)">(unnamed)</span>'}</td>
        <td><span class="pk-code">${escapeHtml(m.passkey || '—')}</span></td>
        <td><div class="pk-actions">
          <button class="pk-mini-btn" title="Copy passkey to clipboard"
                  onclick="copyPasskeyForId('${escJsAttr(m.id)}')">📋 Copy</button>
          <button class="pk-mini-btn danger" title="Rotate — old code stops working immediately"
                  onclick="rotatePasskeyForId('${escJsAttr(m.id)}')">↻ Rotate</button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table>`;
  wrap.innerHTML = html;
}

function copyPasskeyForId(id) {
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m || !m.passkey) return;
  navigator.clipboard.writeText(m.passkey).then(
    () => showToast('Passkey copied for ' + (m.slackName ? '@' + m.slackName.replace(/^@/, '') : (m.realName || 'member'))),
    () => showToast('Could not copy — select and copy manually.')
  );
}

async function rotatePasskeyForId(id) {
  if (!isAdminMode) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return;
  const who = m.slackName ? '@' + m.slackName.replace(/^@/, '') : (m.realName || 'this member');
  if (!await customConfirm('Rotate passkey for ' + who + '? The old code will stop working immediately.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  // NEW DATA MODEL (viewable): generate plaintext, store in /team-secrets,
  // keep on the in-memory profile so it stays viewable in the table.
  if (USE_NEW_DATA_MODEL) {
    const usedN = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
    let nextN; do { nextN = generatePasskey(); } while (usedN.has(nextN.toUpperCase()));
    try { await dataSetPasskey(id, nextN); }
    catch (e) { await customAlert('Could not save the new passkey (are you online?).', { title: 'Error' }); return; }
    m.passkey = nextN;
    if (editingTmId === id && _tmDraft) _tmDraft.passkey = nextN;
    if (currentUser && currentUser.tmId === id) setCurrentUser(m, currentUserPersistent);
    renderPasskeysTable();
    showToast('Passkey rotated');
    return;
  }
  const used = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
  let next;
  do { next = generatePasskey(); } while (used.has(next.toUpperCase()));
  m.passkey = next;
  saveTeamOnly();
  // If we're rotating the open profile, keep the drafts in sync so the admin
  // sees the new value if they pop the detail open afterwards.
  if (editingTmId === id && _tmDraft) _tmDraft.passkey = next;
  // If we just rotated the CURRENT user's own passkey, refresh their session.
  if (currentUser && currentUser.tmId === id) {
    setCurrentUser(m, currentUserPersistent);
  }
  renderPasskeysTable();
  showToast('Passkey rotated');
}
