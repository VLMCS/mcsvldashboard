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
      '<div class="admin-modal" style="max-width:440px">' +
        '<h3 style="margin:0 0 12px">Admin Tools</h3>' +
        '<div id="admin-tools-groups" style="display:flex;flex-direction:column;gap:16px"></div>' +
        '<div style="margin-top:16px;text-align:right"><button class="btn btn-secondary" id="admin-tools-close">Close</button></div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#admin-tools-close').onclick = _closeAdminTools;
    ov.addEventListener('mousedown', e => { if (e.target === ov) _closeAdminTools(); });
  }

  const wrap = ov.querySelector('#admin-tools-groups');
  wrap.innerHTML = _ADMIN_TOOL_GROUPS.map(g =>
    '<div>' +
      '<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mid);font-weight:700;margin-bottom:8px">' + escapeHtml(g.label) + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        g.items.map(it =>
          '<button class="admin-tool-launch-item" data-fn="' + escAttr(it.fn) + '" ' +
            'style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 12px;border:1px solid var(--border);border-radius:7px;background:var(--bg-form-input);cursor:pointer;font-size:13px;color:var(--text-body)">' +
            '<span style="font-size:15px;width:20px;text-align:center;flex-shrink:0">' + it.icon + '</span>' +
            '<span style="display:flex;flex-direction:column;line-height:1.3">' +
              '<span style="font-weight:600">' + escapeHtml(it.text) + '</span>' +
              (it.note ? '<span style="font-size:11px;color:var(--text-sub)">' + escapeHtml(it.note) + '</span>' : '') +
            '</span>' +
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
