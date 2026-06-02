/* ══════════════════════════════════════════════════════════════
   ANNOUNCEMENTS  (extracted from app.js, PR-17). Render + admin
   editor for the home-screen announcements banner. Global; loaded
   before app.js; uses ANNOUNCEMENTS/dismissedAnns/edit state +
   saveAnnsOnly cross-file at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   ANNOUNCEMENTS
   ══════════════════════════════════════════ */
function renderAnnouncements() {
  const c = document.getElementById('whats-new');
  const visible = ANNOUNCEMENTS.filter(a => !dismissedAnns.has(a.id));
  const show = visible.length > 0 || isAdminMode;
  if (!show) { c.innerHTML = ''; return; }
  const itemsHtml = visible.map(a => `
    <div class="ann-item" data-ann-id="${escAttr(a.id)}">
      <div class="ann-dot"></div>
      <div class="ann-content">
        <div class="ann-date">${escapeHtml(a.date)}${a.author ? ' · ' + escapeHtml(a.author) : ''}</div>
        <div class="ann-text">${escapeHtml(a.text)}</div>
      </div>
      <div class="ann-actions">
        ${isAdminMode ? `
          <button class="ann-edit-btn" onclick="openAnnEditor('${escJsAttr(a.id)}')" title="Edit">✎</button>
          <button class="ann-dismiss-btn" onclick="deleteAnnouncementAdmin('${escJsAttr(a.id)}')" title="Delete announcement (visible to everyone)">🗑</button>
        ` : ''}
      </div>
    </div>
  `).join('');
  const addBtn = isAdminMode ? `<button class="ann-add-btn" onclick="openNewAnnEditor()">＋ New</button>` : '';
  c.innerHTML = `<div class="ann-header"><span class="ann-label">What's New</span>${addBtn}</div>
    ${itemsHtml}${visible.length === 0 && isAdminMode ? '<div style="font-size:12px;color:var(--mid)">No announcements yet.</div>' : ''}`;
}
function dismissAnn(id) { /* deprecated — kept for back-compat */ dismissedAnns.add(id); saveAnnsOnly(); renderAnnouncements(); }
async function deleteAnnouncementAdmin(id) {
  if (!isAdminMode) return;
  if (!await customConfirm('Delete this announcement for everyone? This cannot be undone.', { danger: true, confirmLabel: 'Delete announcement' })) return;
  ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== id);
  dismissedAnns.delete(id);
  saveAnnsOnly();
  fbSyncKey('announcements', ANNOUNCEMENTS);
  renderAnnouncements();
  showToast('Announcement deleted');
}
function openAnnEditor(id) {
  const a = ANNOUNCEMENTS.find(x => x.id === id); if (!a) return;
  editAnnId = id;
  document.getElementById('ann-modal-title-text').textContent = 'Edit Announcement';
  document.getElementById('ann-text-input').value = a.text;
  document.getElementById('ann-author-input').value = a.author || '';
  document.getElementById('delete-ann-btn').style.display = '';
  document.getElementById('ann-modal-overlay').classList.add('open');
}
function openNewAnnEditor() {
  editAnnId = null;
  document.getElementById('ann-modal-title-text').textContent = 'New Announcement';
  document.getElementById('ann-text-input').value = '';
  document.getElementById('ann-author-input').value = '';
  document.getElementById('delete-ann-btn').style.display = 'none';
  document.getElementById('ann-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('ann-text-input').focus(), 60);
}
function closeAnnModal() { document.getElementById('ann-modal-overlay').classList.remove('open'); }
function maybeCloseAnn(e) { if (_shouldCloseOverlay(e, 'ann-modal-overlay')) closeAnnModal(); }
function saveAnn() {
  const text = document.getElementById('ann-text-input').value.trim();
  if (!text) { alert('Message required.'); return; }
  const author = document.getElementById('ann-author-input').value.trim();
  const date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  if (editAnnId) {
    const idx = ANNOUNCEMENTS.findIndex(a => a.id === editAnnId);
    if (idx !== -1) { ANNOUNCEMENTS[idx].text = text; ANNOUNCEMENTS[idx].author = author; }
    dismissedAnns.delete(editAnnId);
  } else {
    ANNOUNCEMENTS.unshift({ id:'ann-'+Date.now(), date, author, text });
  }
  closeAnnModal(); saveAnnsOnly(); renderAnnouncements();
  showToast('Announcement posted');
}
async function deleteCurrentAnn() {
  if (!editAnnId) return;
  if (!await customConfirm('Delete this announcement?', { danger: true, confirmLabel: 'Delete' })) return;
  ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== editAnnId);
  dismissedAnns.delete(editAnnId);
  closeAnnModal(); saveAnnsOnly(); renderAnnouncements();
}
