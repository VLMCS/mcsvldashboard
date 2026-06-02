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
    { icon: '↓',  text: 'Export backup',      fn: 'exportData',         note: 'Download a JSON backup' },
    { icon: '↑',  text: 'Import backup',      fn: '_adminToolsImport',  note: 'Restore from a JSON backup' }
  ] },
  { label: 'Site', items: [
    { icon: '⚙', text: 'Site Settings', fn: 'openSiteSettings', note: 'Names, search, favicon, theme' }
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

function _closeAdminTools() {
  const ov = document.getElementById('admin-tools-overlay');
  if (ov) ov.classList.remove('open');
}

function openAdminTools() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  let ov = document.getElementById('admin-tools-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'admin-tools-overlay';
    ov.className = 'admin-modal-overlay';
    ov.innerHTML =
      '<style>' +
        '#admin-tools-overlay .at-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}' +
        '#admin-tools-overlay .at-tile{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:7px;padding:16px 10px;border:1px solid var(--border);border-radius:11px;background:var(--bg-form-input);cursor:pointer;text-align:center;transition:border-color .15s,background .15s,transform .12s,box-shadow .15s}' +
        '#admin-tools-overlay .at-tile:hover{border-color:var(--admin-accent);background:var(--admin-accent-light);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.08)}' +
        '#admin-tools-overlay .at-tile:active{transform:translateY(0)}' +
        '#admin-tools-overlay .at-ico{font-size:24px;line-height:1}' +
        '#admin-tools-overlay .at-label{font-size:12px;font-weight:600;color:var(--text-body);line-height:1.25}' +
        '#admin-tools-overlay .at-head{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mid);font-weight:700;margin:0 0 9px}' +
        '@media(max-width:480px){#admin-tools-overlay .at-grid{grid-template-columns:repeat(2,1fr)}}' +
      '</style>' +
      '<div class="admin-modal" style="max-width:460px">' +
        '<h3 style="margin:0 0 14px">Admin Tools</h3>' +
        '<div id="admin-tools-groups" style="display:flex;flex-direction:column;gap:18px"></div>' +
        '<div style="margin-top:18px;text-align:right"><button class="btn btn-secondary" id="admin-tools-close">Close</button></div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#admin-tools-close').onclick = _closeAdminTools;
    ov.addEventListener('mousedown', e => { if (e.target === ov) _closeAdminTools(); });
  }

  const wrap = ov.querySelector('#admin-tools-groups');
  wrap.innerHTML = _ADMIN_TOOL_GROUPS.map(g =>
    '<div>' +
      '<div class="at-head">' + escapeHtml(g.label) + '</div>' +
      '<div class="at-grid">' +
        g.items.map(it =>
          '<button class="at-tile" data-fn="' + escAttr(it.fn) + '" title="' + escAttr(it.note || it.text) + '">' +
            '<span class="at-ico">' + it.icon + '</span>' +
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
