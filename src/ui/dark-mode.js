/* ══════════════════════════════════════════════════════════════
   DARK MODE + SIDEBAR TOGGLE  (extracted from app.js, PR-21).
   applyDark (called at boot), toggleDark, toggleSidebar. Global;
   loaded before app.js.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   DARK MODE
   ══════════════════════════════════════════ */
function applyDark(d) {
  isDark = d;
  document.body.classList.toggle('dark', d);
  const icon = document.getElementById('dark-icon');
  if (d) {
    icon.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  } else {
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  }
}
function toggleDark() {
  applyDark(!isDark);
  try { localStorage.setItem('vl_dark', isDark ? '1' : '0'); } catch(e){}
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  try { localStorage.setItem('vl_sc', sidebarCollapsed ? '1' : '0'); } catch(e){}
}
