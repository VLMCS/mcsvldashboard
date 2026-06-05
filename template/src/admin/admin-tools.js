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
        g.items.map(it =>
          '<button class="at-tile" data-fn="' + escAttr(it.fn) + '" title="' + escAttr(it.note || it.text) + '">' +
            '<span class="at-badge">' + it.icon + '</span>' +
            '<span class="at-label">' + escapeHtml(it.text) + '</span>' +
          '</button>'
        ).join('') +
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
