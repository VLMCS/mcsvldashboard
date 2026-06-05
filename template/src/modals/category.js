/* ══════════════════════════════════════════════════════════════
   CUSTOM CATEGORIES (admin)  (extracted from app.js, PR-18). Create/
   rename/delete custom knowledge or quick-link categories. Global;
   loaded before app.js; uses CUSTOM_CATEGORIES/SIDEBAR_CFG + saveAll/
   renderSidebar cross-file at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   CUSTOM CATEGORIES (admin)
   ══════════════════════════════════════════ */
let _editingCategoryId = null;

function openNewCategoryModal() {
  if (!isAdminMode) return;
  _editingCategoryId = null;
  document.getElementById('cat-modal-title-text').textContent = 'New Category';
  document.getElementById('cat-label-input').value = '';
  document.getElementById('delete-cat-btn').style.display = 'none';
  document.getElementById('cat-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('cat-label-input').focus(), 60);
}
function openEditCategoryModal(catId) {
  if (!isAdminMode) return;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === catId);
  if (!cc) return;
  _editingCategoryId = catId;
  document.getElementById('cat-modal-title-text').textContent = 'Edit Category';
  document.getElementById('cat-label-input').value = cc.label || '';
  document.getElementById('delete-cat-btn').style.display = '';
  document.getElementById('cat-modal-overlay').classList.add('open');
}
function closeCatModal() { document.getElementById('cat-modal-overlay').classList.remove('open'); }
function maybeCloseCat(e) { if (_shouldCloseOverlay(e, 'cat-modal-overlay')) closeCatModal(); }
function saveCategory() {
  const label = document.getElementById('cat-label-input').value.trim();
  if (!label) { alert('Category label is required.'); return; }
  if (_editingCategoryId) {
    const cc = CUSTOM_CATEGORIES.find(c => c.id === _editingCategoryId);
    if (cc) cc.label = label;
  } else {
    CUSTOM_CATEGORIES.push({
      id: 'cat-' + Date.now(),
      label,
      sections: [],
      entries: []
    });
  }
  closeCatModal();
  saveAll('Category saved');
  renderSidebar();
}
async function deleteCurrentCategory() {
  if (!_editingCategoryId) return;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === _editingCategoryId);
  if (!cc) return;
  const hasContent = (cc.sections && cc.sections.length) || (cc.entries && cc.entries.length);
  const msg = hasContent
    ? `Category "${cc.label}" contains ${cc.sections.length} section(s) and ${cc.entries.length} entries. Delete EVERYTHING in this category permanently?`
    : `Delete category "${cc.label}"?`;
  if (!await customConfirm(msg, { danger: true, confirmLabel: 'Delete category' })) return;
  CUSTOM_CATEGORIES = CUSTOM_CATEGORIES.filter(c => c.id !== _editingCategoryId);
  if (currentBase === _editingCategoryId) showHome();
  closeCatModal();
  saveAll('Category deleted');
  renderSidebar();
}
