/* ══════════════════════════════════════════════════════════════
   ADMIN TOOLS LAUNCHER

   Replaces the long stack of admin-mode buttons in the sidebar with a
   single "⚙ Admin Tools…" button that opens an organized panel
   (Content / Site / Security). Each entry calls the existing tool
   function and closes the launcher. Built dynamically — no static
   markup. Scales as more tools are added.
   ══════════════════════════════════════════════════════════════ */

// Groups → items. `fn` is a global function name; `note` is an optional hint.
const _ADMIN_TOOL_GROUPS = [
  { label: 'Content', items: [
    { icon: '📑', text: 'Documentation View', fn: 'showDocView',        note: 'Full read-through with inline editing' },
    { icon: '🧠', text: 'Manage Synonyms',    fn: 'openSynonymsEditor', note: 'Search synonym groups' },
    { icon: '📤', text: 'Export backup',      fn: 'exportData',            note: 'Download a JSON backup' },
    { icon: '🔀', text: 'Merge import',       fn: '_adminToolsMergeImport', note: 'Upsert from a file — updates/adds, never deletes' },
    { icon: '📥', text: 'Import backup',      fn: '_adminToolsImport',     note: 'Replace ALL data from a JSON backup' }
  ] },
  { label: 'Site', items: [
    { icon: '⚙️', text: 'Site Settings', fn: 'openSiteSettings', note: 'Names, search, favicon, theme' }
  ] },
  { label: 'Security', items: [
    { icon: '🔑', text: 'Change Admin Password', fn: 'changeAdminPassword', note: 'Requires the master recovery key' },
    { icon: '👥', text: 'Manage Admins',         fn: 'openManageAdmins',    note: 'Promote / revoke admin devices' },
    { icon: '🗄', text: 'Data & Storage',        fn: 'openDataTools',       note: 'Firestore usage + orphan cleanup' }
  ] },
  { label: 'Sync', items: [
    { icon: '🔄', text: 'Not synced', fn: 'openNotSyncedPanel', note: 'Review & clear changes that never reached Firestore' }
  ] }
];

// Import is triggered via the hidden file input in the sidebar.
function _adminToolsImport() {
  const inp = document.getElementById('import-file');
  if (inp) inp.click();
}

// Non-destructive merge import — separate hidden input so it can't be
// confused with the replace-all path.
function _adminToolsMergeImport() {
  const inp = document.getElementById('merge-import-file');
  if (inp) inp.click();
}

function _closeAdminTools() {
  const ov = document.getElementById('admin-tools-overlay');
  if (ov) ov.classList.remove('open');
}

function openAdminTools() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  const toolCount = _ADMIN_TOOL_GROUPS.reduce((n, g) => n + g.items.length, 0);
  let ov = document.getElementById('admin-tools-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'admin-tools-overlay';
    ov.className = 'admin-modal-overlay';
    ov.innerHTML =
      '<style>' +
        '#admin-tools-overlay .admin-modal{max-width:520px;padding:26px 26px 22px}' +
        '#admin-tools-overlay .at-titlebar{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:22px}' +
        '#admin-tools-overlay .at-title{margin:0;font-size:19px;font-weight:700;letter-spacing:-0.01em;line-height:1.1}' +
        '#admin-tools-overlay .at-sub{margin:4px 0 0;font-size:11.5px;color:var(--text-sub);letter-spacing:0.01em}' +
        '#admin-tools-overlay .at-x{flex-shrink:0;width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--bg-form-input);color:var(--mid);font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}' +
        '#admin-tools-overlay .at-x:hover{border-color:var(--admin-accent);color:var(--admin-accent)}' +
        '#admin-tools-overlay .at-group{margin-bottom:20px}' +
        '#admin-tools-overlay .at-group:last-child{margin-bottom:0}' +
        '#admin-tools-overlay .at-head{display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--mid);font-weight:700;margin:0 0 11px}' +
        '#admin-tools-overlay .at-head::after{content:"";flex:1;height:1px;background:var(--border)}' +
        '#admin-tools-overlay .at-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}' +
        '#admin-tools-overlay .at-tile{display:flex;flex-direction:column;align-items:center;gap:10px;padding:17px 8px 15px;border:1px solid var(--border);border-radius:14px;background:var(--bg-form-input);cursor:pointer;text-align:center;min-height:104px;justify-content:center;transition:border-color .15s,background .15s,transform .12s,box-shadow .15s}' +
        '#admin-tools-overlay .at-tile:hover{border-color:var(--admin-accent);background:var(--admin-accent-light);transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.10)}' +
        '#admin-tools-overlay .at-tile:active{transform:translateY(0);box-shadow:none}' +
        '#admin-tools-overlay .at-badge{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(128,128,128,0.16);font-size:21px;line-height:1;transition:transform .15s}' +
        '#admin-tools-overlay .at-tile:hover .at-badge{transform:scale(1.06)}' +
        '#admin-tools-overlay .at-label{font-size:12px;font-weight:600;color:var(--text-body);line-height:1.25}' +
        '#admin-tools-overlay .at-tile-alert{border-color:#c0392b;background:rgba(192,57,43,0.07)}' +
        '#admin-tools-overlay .at-tile-alert:hover{border-color:#c0392b;background:rgba(192,57,43,0.12)}' +
        '#admin-tools-overlay .at-ns-count{display:inline-block;min-width:18px;padding:0 5px;margin-left:4px;border-radius:9px;background:#c0392b;color:#fff;font-size:11px;font-weight:700;line-height:18px;vertical-align:middle}' +
        '@media(max-width:520px){#admin-tools-overlay .at-grid{grid-template-columns:repeat(2,1fr)}}' +
      '</style>' +
      '<div class="admin-modal">' +
        '<div class="at-titlebar">' +
          '<div>' +
            '<h3 class="at-title">Admin Tools</h3>' +
            '<p class="at-sub" id="admin-tools-sub"></p>' +
          '</div>' +
          '<button class="at-x" id="admin-tools-close" title="Close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div id="admin-tools-groups"></div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#admin-tools-close').onclick = _closeAdminTools;
    ov.addEventListener('mousedown', e => { if (e.target === ov) _closeAdminTools(); });
  }

  ov.querySelector('#admin-tools-sub').textContent =
    'Content, site & security · ' + toolCount + ' tools';

  const wrap = ov.querySelector('#admin-tools-groups');
  wrap.innerHTML = _ADMIN_TOOL_GROUPS.map(g =>
    '<div class="at-group">' +
      '<div class="at-head">' + escapeHtml(g.label) + '</div>' +
      '<div class="at-grid">' +
        g.items.map(it => {
          // Surface the not-synced count right on the tile (red) so it's visible
          // the moment Admin Tools opens.
          const nsCount = (it.fn === 'openNotSyncedPanel' && typeof notSyncedCount === 'function') ? notSyncedCount() : 0;
          const label = nsCount ? (escapeHtml(it.text) + ' <span class="at-ns-count">' + nsCount + '</span>') : escapeHtml(it.text);
          return '<button class="at-tile' + (nsCount ? ' at-tile-alert' : '') + '" data-fn="' + escAttr(it.fn) + '" title="' + escAttr(it.note || it.text) + '">' +
            '<span class="at-badge">' + it.icon + '</span>' +
            '<span class="at-label">' + label + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
    '</div>'
  ).join('');

  wrap.querySelectorAll('[data-fn]').forEach(btn => {
    btn.onclick = () => {
      const fn = btn.getAttribute('data-fn');
      _closeAdminTools();
      // Defer so the launcher is visually gone before the tool's own modal opens.
      setTimeout(() => { try { if (typeof window[fn] === 'function') window[fn](); } catch (e) { console.error('admin tool', fn, 'failed:', e); } }, 60);
    };
  });

  ov.classList.add('open');
}

/* ══════════════════════════════════════════════════════════════
   NOT-SYNCED PANEL
   Lists changes saved in THIS browser that Firestore rejected (so they'd
   flicker into the sidebar then vanish). Retry pushes them again; Discard
   reverts to the Firestore version so they can never reappear in the site.
   Live-refreshed by _renderNotSyncedState() (firebase.js) while open.
   ══════════════════════════════════════════════════════════════ */
function _closeNotSyncedPanel() {
  const ov = document.getElementById('not-synced-overlay');
  if (ov) ov.classList.remove('open');
}
function _notSyncedRowsHtml() {
  const list = (typeof notSyncedList === 'function') ? notSyncedList() : [];
  if (!list.length) {
    return '<div class="ns-empty">✓ Everything is synced — nothing is stuck in the queue.</div>';
  }
  return list.map(r => {
    let t = '';
    try { const d = new Date(r.ts); t = isNaN(d.getTime()) ? '' : d.toLocaleTimeString(); } catch (e) {}
    return '<div class="ns-row">' +
        '<div class="ns-label">' + escapeHtml(r.label || r.id) + '</div>' +
        '<div class="ns-meta">' + escapeHtml(r.coll) + (t ? ' · ' + escapeHtml(t) : '') + '</div>' +
        '<div class="ns-err">' + escapeHtml(r.error || '') + '</div>' +
      '</div>';
  }).join('');
}
function _refreshNotSyncedPanel() {
  const ov = document.getElementById('not-synced-overlay');
  if (!ov || !ov.classList.contains('open')) return;
  const list = ov.querySelector('#ns-list');
  if (list) list.innerHTML = _notSyncedRowsHtml();
  const count = (typeof notSyncedCount === 'function') ? notSyncedCount() : 0;
  const sub = ov.querySelector('#ns-sub');
  if (sub) sub.textContent = count
    ? (count + ' change' + (count === 1 ? '' : 's') + ' did not reach Firestore')
    : 'All changes are synced';
  const actions = ov.querySelector('#ns-actions');
  if (actions) actions.style.display = count ? 'flex' : 'none';
}
function openNotSyncedPanel() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  let ov = document.getElementById('not-synced-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'not-synced-overlay';
    ov.className = 'admin-modal-overlay';
    ov.innerHTML =
      '<style>' +
        '#not-synced-overlay .admin-modal{max-width:560px;padding:24px 24px 20px}' +
        '#not-synced-overlay .ns-titlebar{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}' +
        '#not-synced-overlay .ns-title{margin:0;font-size:19px;font-weight:700;line-height:1.1}' +
        '#not-synced-overlay .ns-sub{margin:4px 0 0;font-size:11.5px;color:var(--text-sub)}' +
        '#not-synced-overlay .ns-help{font-size:12.5px;color:var(--text-sub);line-height:1.5;margin:0 0 14px}' +
        '#not-synced-overlay #ns-list{display:flex;flex-direction:column;gap:8px;max-height:46vh;overflow-y:auto}' +
        '#not-synced-overlay .ns-empty{padding:22px 8px;text-align:center;color:var(--mid);font-size:13px}' +
        '#not-synced-overlay .ns-row{padding:10px 12px;border:1px solid var(--border);border-left:3px solid #c0392b;border-radius:8px;background:var(--bg-form-input)}' +
        '#not-synced-overlay .ns-label{font-size:13px;font-weight:600;color:var(--text-body)}' +
        '#not-synced-overlay .ns-meta{font-size:11px;color:var(--mid);margin-top:2px}' +
        '#not-synced-overlay .ns-err{font-size:11px;color:#c0392b;margin-top:4px;word-break:break-word}' +
        '#not-synced-overlay .ns-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}' +
        '#not-synced-overlay .ns-btn-danger{background:#c0392b;color:#fff;border-color:#c0392b}' +
        '#not-synced-overlay .ns-btn-danger:hover{background:#a93226;border-color:#a93226}' +
        '#not-synced-overlay .at-x{flex-shrink:0;width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--bg-form-input);color:var(--mid);font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
        '#not-synced-overlay .at-x:hover{border-color:var(--admin-accent);color:var(--admin-accent)}' +
      '</style>' +
      '<div class="admin-modal">' +
        '<div class="ns-titlebar">' +
          '<div><h3 class="ns-title">Not synced</h3><p class="ns-sub" id="ns-sub"></p></div>' +
          '<button class="at-x" id="ns-close" title="Close" aria-label="Close">✕</button>' +
        '</div>' +
        '<p class="ns-help">These changes were saved in <strong>this browser</strong> but Firestore rejected them, so they can appear briefly then vanish on the next sync. <strong>Retry</strong> pushes them again; <strong>Discard</strong> drops them and reverts to the version in Firestore so they never reappear.</p>' +
        '<div id="ns-list"></div>' +
        '<div id="ns-actions" class="ns-actions">' +
          '<button class="btn btn-secondary" id="ns-retry">🔄 Retry sync</button>' +
          '<button class="btn ns-btn-danger" id="ns-discard">🗑 Discard local changes</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#ns-close').onclick = _closeNotSyncedPanel;
    ov.addEventListener('mousedown', e => { if (e.target === ov) _closeNotSyncedPanel(); });
    ov.querySelector('#ns-retry').onclick = () => {
      if (typeof fbRetryNotSynced === 'function') fbRetryNotSynced();
    };
    ov.querySelector('#ns-discard').onclick = async () => {
      const ok = await customConfirm(
        'Discard ALL not-synced changes and revert to the version stored in Firestore? Anything that never synced will be lost. This cannot be undone.',
        { danger: true, confirmLabel: 'Discard changes' });
      if (!ok) return;
      if (typeof fbDiscardNotSynced === 'function') fbDiscardNotSynced();
      _refreshNotSyncedPanel();
      showToast('Not-synced changes discarded');
    };
  }
  ov.classList.add('open');
  _refreshNotSyncedPanel();
}
