/* ══════════════════════════════════════════════════════════════
   EDITOR MODALS  (extracted from app.js, PR-16)
   Entry editor, Section/Project editor, and Sidebar-item (Quick
   Links / Team) editor. Global; loaded before app.js. Use edit*
   state vars + populateSectionSelect/initEditor/generatePasskey/
   saveAll/renderSidebar cross-file at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   ENTRY EDITOR
   ══════════════════════════════════════════ */
function populateSectionSelect(selectedNum, base) {
  base = base || 'handbook';
  const sel = document.getElementById('ef-section-select');
  const list = sectionsOf(base);
  sel.innerHTML = list.map(s => `<option value="${escAttr(s.num)}">${escapeHtml(s.num + '. ' + s.title)}</option>`).join('')
                + `<option value="__new__">＋ New ${base === 'projects' ? 'project' : 'section'}…</option>`;
  if (selectedNum) sel.value = String(selectedNum);
  onSectionSelectChange();
}

function onSectionSelectChange() {
  const sel = document.getElementById('ef-section-select');
  document.getElementById('ef-new-section-group').style.display = (sel.value === '__new__') ? '' : 'none';
  // Entry IDs are assigned automatically on save — nothing to compute here.
}

function openEntryEditor(id, base) {
  base = base || 'handbook';
  if (!findEntry(id, base)) {
    const found = findEntryAnywhere(id);
    if (found) base = found.base;
  }
  const sectionNum = sectionNumOf(id);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to edit handbook entries.');
    return;
  }
  const entry = findEntry(id, base);
  if (!entry) return;
  editEntryId = id;
  editEntryPresetId = null;
  editEntryBase = base;
  editEntrySrcSection = sectionNumOf(id);
  document.getElementById('entry-modal-title-text').textContent = base === 'projects' ? 'Edit Project Entry' : 'Edit Entry';
  document.getElementById('delete-entry-btn').style.display = '';
  populateSectionSelect(sectionNumOf(id), base);
  // Editing keeps the entry where it is — the section/ID are fixed.
  document.getElementById('ef-section-field').style.display = 'none';
  document.getElementById('ef-new-section-group').style.display = 'none';
  document.getElementById('ef-title').value = entry.title;
  document.getElementById('ef-keywords').value = (entry.keywords || []).join(', ');
  initEditor('ef-content-editor', 'ef-rt-toolbar', entry.content);
  document.getElementById('entry-modal-overlay').classList.add('open');
}

function openNewEntryEditor(sectionNum, base, presetId) {
  base = base || 'handbook';
  if (sectionNum && !canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to add entries.');
    return;
  }
  editEntryId = null;
  editEntryPresetId = presetId || null;   // for a sub-entry, the parent fixes the (auto) ID
  editEntryBase = base;
  editEntrySrcSection = null;
  const isSub = presetId && idComponents(presetId).length > 2;
  document.getElementById('entry-modal-title-text').textContent =
    isSub ? 'New Sub-Entry' : (base === 'projects' ? 'New Project Entry' : 'New Entry');
  document.getElementById('delete-entry-btn').style.display = 'none';
  const firstSec = sectionsOf(base)[0];
  populateSectionSelect(sectionNum || (firstSec && firstSec.num), base);
  // Sub-entries belong to a fixed parent → hide the section picker; top-level new entries keep it.
  document.getElementById('ef-section-field').style.display = isSub ? 'none' : '';
  document.getElementById('ef-title').value = '';
  document.getElementById('ef-keywords').value = '';
  initEditor('ef-content-editor', 'ef-rt-toolbar', '');
  document.getElementById('ef-new-section-title').value = '';
  document.getElementById('entry-modal-overlay').classList.add('open');
}

function closeEntryModal() { document.getElementById('entry-modal-overlay').classList.remove('open'); }
function maybeCloseEntry(e) { if (_shouldCloseOverlay(e, 'entry-modal-overlay')) closeEntryModal(); }

function saveEntry() {
  const base = editEntryBase || 'handbook';
  const sel = document.getElementById('ef-section-select');
  let sectionNum = sel.value;
  let sectionTitle = null;

  if (sectionNum === '__new__') {
    sectionTitle = document.getElementById('ef-new-section-title').value.trim();
    if (!sectionTitle) { alert(`Please enter the new ${base==='projects'?'project':'section'} title.`); return; }
    // Section number is auto-assigned (next available).
    const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
    sectionNum = String(nums.length ? Math.max(...nums) + 1 : 1);
    const ns = { num: sectionNum, title: sectionTitle, description: '' };
    if (base === 'projects') ns.passkey = generatePasskey();
    sectionsOf(base).push(ns);
  }

  const title = document.getElementById('ef-title').value.trim();
  const kwRaw = document.getElementById('ef-keywords').value.trim();
  const content = getEditorHTML('ef-content-editor');

  if (!title) { alert('Title is required.'); return; }
  if (!stripHtml(content)) { alert('Entry content cannot be empty.'); return; }

  // IDs are auto-assigned: editing keeps the existing id; a new sub-entry uses
  // its preset (parent-derived) id; a new top-level entry gets next "<section>.<n>".
  let id;
  if (editEntryId) id = editEntryId;
  else if (editEntryPresetId) id = editEntryPresetId;
  else {
    const existing = entriesInSection(sectionNum, base).map(e => e.id);
    let n = 1; while (existing.includes(`${sectionNum}.${n}`)) n++;
    id = `${sectionNum}.${n}`;
  }

  const sec = findSection(sectionNum, base);
  const sectionLabel = sec ? `${sec.num}. ${sec.title}` : sectionNum;
  const keywords = kwRaw.split(',').map(k => k.trim()).filter(Boolean);
  const store = entriesOf(base);

  let savedEntry;
  if (editEntryId) {
    const idx = store.findIndex(e => e.id === editEntryId);
    if (idx === -1) { alert('Entry not found.'); return; }
    if (id !== editEntryId && store.some(e => e.id === id)) {
      alert(`An entry with ID "${id}" already exists.`); return;
    }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store[idx] = savedEntry;
    if (currentEntryId === editEntryId && currentBase === base) currentEntryId = id;
  } else {
    if (store.some(e => e.id === id)) { alert(`An entry with ID "${id}" already exists.`); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store.push(savedEntry);
  }

  closeEntryModal();
  saveAll('Entry saved');
  // Embed in background; a second silent saveAll persists the embedding when ready.
  attachEmbedding(savedEntry, base);
  renderSidebar();
  if (currentView === 'entry' && currentEntryId === id && currentBase === base) showEntry(id, base);
  else if (currentView === 'section' && currentBase === base) showSection(currentSectionNum, base);
  else if (currentView === 'docview') renderDocView();
}

async function deleteCurrentEntry() {
  if (!editEntryId) return;
  const base = editEntryBase || 'handbook';
  const descCount = descendantsOf(editEntryId, base).length;
  const msg = descCount
    ? `Delete this entry AND its ${descCount} nested sub-${descCount===1?'entry':'entries'}? This cannot be undone.`
    : 'Delete this entry permanently?';
  if (!await customConfirm(msg, { danger: true, confirmLabel: 'Delete entry' })) return;
  // Remove the entry and every descendant (ids starting with "<id>.")
  const prefix = editEntryId + '.';
  const keep = e => e.id !== editEntryId && !e.id.startsWith(prefix);
  if (base === 'projects') PROJECT_ENTRIES = PROJECT_ENTRIES.filter(keep);
  else if (base === 'handbook') HANDBOOK = HANDBOOK.filter(keep);
  else {
    const cc = CUSTOM_CATEGORIES.find(c => c.id === base);
    if (cc) cc.entries = cc.entries.filter(keep);
  }
  const deletedId = editEntryId;
  closeEntryModal();
  saveAll('Entry deleted');
  if (currentBase === base && (currentEntryId === deletedId || String(currentEntryId).startsWith(prefix))) {
    // We were viewing the deleted entry (or one of its descendants) — go to its parent
    const pid = parentOf(deletedId);
    if (pid && findEntry(pid, base)) showEntry(pid, base);
    else if (currentSectionNum) showSection(currentSectionNum, base);
    else showHome();
  }
  renderSidebar();
  if (currentView === 'docview') renderDocView();
}

/* ══════════════════════════════════════════
   SECTION EDITOR
   ══════════════════════════════════════════ */
function openSectionEditor(num, base) {
  base = base || 'handbook';
  const sec = findSection(num, base);
  if (!sec) return;
  // Access check: real admin OR a passkey-unlocked project section.
  if (!isAdminMode && !(base === 'projects' && unlockedProjects.has(String(num)))) {
    if (base === 'projects') promptUnlockProjectSection(num);
    else alert('Admin Mode required to edit section info.');
    return;
  }
  editSectionNum = num;
  editSectionBase = base;
  document.getElementById('section-modal-title-text').textContent = base === 'projects' ? 'Edit Project' : 'Edit Section';
  // Delete is admin-only — passkey-unlocked users cannot delete the section.
  document.getElementById('delete-section-btn').style.display = isAdminMode ? '' : 'none';
  document.getElementById('sef-title').value = sec.title;
  initEditor('sef-desc-editor', 'sef-rt-toolbar', sec.description || '');
  // Passkey row is real-admin only (an unlocked user shouldn't be able to view/change it).
  const showPasskey = (base === 'projects') && isAdminMode;
  document.getElementById('sef-passkey-row').style.display = showPasskey ? '' : 'none';
  if (showPasskey) {
    if (!sec.passkey) sec.passkey = generatePasskey();
    document.getElementById('sef-passkey').value = sec.passkey;
  }
  document.getElementById('section-modal-overlay').classList.add('open');
}
function openNewSectionEditor(base) {
  base = base || 'handbook';
  editSectionNum = null;
  editSectionBase = base;
  document.getElementById('section-modal-title-text').textContent = base === 'projects' ? 'New Project' : 'New Section';
  document.getElementById('delete-section-btn').style.display = 'none';
  document.getElementById('sef-title').value = '';
  initEditor('sef-desc-editor', 'sef-rt-toolbar', '');
  // Show passkey preview for new project sections (will be saved on Save)
  const showPasskey = (base === 'projects') && isAdminMode;
  document.getElementById('sef-passkey-row').style.display = showPasskey ? '' : 'none';
  if (showPasskey) {
    document.getElementById('sef-passkey').value = generatePasskey();
  }
  document.getElementById('section-modal-overlay').classList.add('open');
}

function _saveUnlocks() {
  try { sessionStorage.setItem('vl_unlocked', JSON.stringify([...unlockedProjects])); } catch(e){}
}

async function promptUnlockProjectSection(num) {
  const sec = findSection(num, 'projects');
  if (!sec) return;
  if (!sec.passkey) {
    if (await customConfirm(`Project "${sec.title}" has no passkey set. Only admins can edit it. Continue to Section view?`, { confirmLabel: 'Continue' })) {
      showSection(num, 'projects');
    }
    return;
  }
  const entered = await customPrompt(`Enter the edit passkey for "${sec.num}. ${sec.title}":`, '', {
    title: 'Unlock project section', placeholder: 'Passkey', confirmLabel: 'Unlock'
  });
  if (entered === null) return;
  if (entered.trim().toUpperCase() === sec.passkey.toUpperCase()) {
    unlockedProjects.add(String(num));
    _saveUnlocks();
    renderSidebar();
    if (currentView === 'section' && currentBase === 'projects' && currentSectionNum === String(num)) showSection(num, 'projects');
    showToast(`🔓 Edit access granted for "${sec.title}"`);
  } else {
    alert('Incorrect passkey.');
  }
}

function lockProjectSection(num) {
  unlockedProjects.delete(String(num));
  _saveUnlocks();
  renderSidebar();
  if (currentView === 'section' && currentBase === 'projects' && currentSectionNum === String(num)) showSection(num, 'projects');
  showToast('🔒 Edit access locked');
}

function copySectionPasskey() {
  const inp = document.getElementById('sef-passkey');
  if (!inp.value) return;
  navigator.clipboard.writeText(inp.value).then(() => showToast('Passkey copied'));
}
async function regenerateSectionPasskey() {
  if (!await customConfirm('Generate a new passkey? The old one will no longer work for anyone using it.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  document.getElementById('sef-passkey').value = generatePasskey();
}
function closeSectionModal() { document.getElementById('section-modal-overlay').classList.remove('open'); }
function maybeCloseSection(e) { if (_shouldCloseOverlay(e, 'section-modal-overlay')) closeSectionModal(); }

function saveSection() {
  const base = editSectionBase || 'handbook';
  const title = document.getElementById('sef-title').value.trim();
  const desc = getEditorHTML('sef-desc-editor');
  const passkeyInp = document.getElementById('sef-passkey');
  const passkey = passkeyInp ? passkeyInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  const sectionsArr = sectionsOf(base);
  const entriesArr = entriesOf(base);

  if (editSectionNum) {
    // Number is auto-managed and immutable; only title/description/passkey change.
    const sec = findSection(editSectionNum, base);
    if (!sec) return;
    sec.title = title; sec.description = desc;
    if (base === 'projects' && passkey) sec.passkey = passkey;
    entriesArr.forEach(e => {
      if (sectionNumOf(e.id) === editSectionNum) e.section = `${editSectionNum}. ${title}`;
    });
  } else {
    // New section number is auto-assigned (next available), never typed.
    const nums = sectionsArr.map(s => parseInt(s.num)).filter(n => !isNaN(n));
    const num = String(nums.length ? Math.max(...nums) + 1 : 1);
    const newSec = { num, title, description: desc };
    if (base === 'projects') newSec.passkey = passkey || generatePasskey();
    sectionsArr.push(newSec);
  }

  closeSectionModal();
  saveAll('Saved');
  renderSidebar();
  if (currentView === 'section' && currentBase === base) showSection(currentSectionNum, base);
  else if (currentView === 'docview') renderDocView();
}

async function deleteCurrentSection() {
  if (!editSectionNum) return;
  if (!isAdminMode) { alert('Deleting a section requires real Admin Mode (the passkey only grants edit access within the section).'); return; }
  const base = editSectionBase || 'handbook';
  const label = base === 'projects' ? 'Project' : 'Section';
  const hasEntries = entriesInSection(editSectionNum, base).length > 0;
  if (hasEntries && !await customConfirm(`${label} ${editSectionNum} has entries. Delete the ${label.toLowerCase()} AND all its entries permanently?`, { danger: true, confirmLabel: 'Delete ' + label.toLowerCase() })) return;
  if (!hasEntries && !await customConfirm(`Delete ${label.toLowerCase()} ${editSectionNum}?`, { danger: true, confirmLabel: 'Delete ' + label.toLowerCase() })) return;
  if (base === 'projects') {
    PROJECT_ENTRIES = PROJECT_ENTRIES.filter(e => sectionNumOf(e.id) !== editSectionNum);
    PROJECTS = PROJECTS.filter(s => s.num !== editSectionNum);
  } else {
    HANDBOOK = HANDBOOK.filter(e => sectionNumOf(e.id) !== editSectionNum);
    SECTIONS = SECTIONS.filter(s => s.num !== editSectionNum);
  }
  closeSectionModal();
  saveAll(`${label} deleted`);
  if (currentSectionNum === editSectionNum && currentBase === base) showHome();
  else renderSidebar();
  if (currentView === 'docview') renderDocView();
}

/* ══════════════════════════════════════════
   SIDEBAR ITEM EDITOR (Quick Links / Team)
   ══════════════════════════════════════════ */
function openSIEditor(sectionId, itemId) {
  const sec = SIDEBAR_CFG.find(s => s.id === sectionId);
  if (!sec) return;
  const item = sec.items.find(i => i.id === itemId);
  if (!item) return;
  editSISection = sectionId; editSIItemId = itemId;
  document.getElementById('si-text').value = item.text;
  document.getElementById('si-href').value = item.href || '';
  document.getElementById('si-visible').value = String(item.visible !== false);
  document.getElementById('si-modal-overlay').classList.add('open');
}
function openNewSIEditor(sectionId) {
  editSISection = sectionId; editSIItemId = null;
  document.getElementById('si-text').value = '';
  document.getElementById('si-href').value = '';
  document.getElementById('si-visible').value = 'true';
  document.getElementById('si-modal-overlay').classList.add('open');
}
function closeSIModal() { document.getElementById('si-modal-overlay').classList.remove('open'); }
function maybeCloseSI(e) { if (_shouldCloseOverlay(e, 'si-modal-overlay')) closeSIModal(); }
function saveSidebarItem() {
  const sec = SIDEBAR_CFG.find(s => s.id === editSISection); if (!sec) return;
  const text = document.getElementById('si-text').value.trim();
  if (!text) { alert('Display text is required.'); return; }
  const href = document.getElementById('si-href').value.trim() || null;
  const visible = document.getElementById('si-visible').value === 'true';
  if (editSIItemId) {
    const item = sec.items.find(i => i.id === editSIItemId);
    if (item) { item.text = text; item.href = href; item.visible = visible; }
  } else {
    sec.items.push({ id: 'item-' + Date.now(), text, href, visible });
  }
  closeSIModal(); saveSidebarOnly(); renderSidebar();
}
async function deleteSidebarItem() {
  if (!editSIItemId) return;
  if (!await customConfirm('Remove this sidebar item?', { danger: true, confirmLabel: 'Remove' })) return;
  const sec = SIDEBAR_CFG.find(s => s.id === editSISection);
  if (sec) sec.items = sec.items.filter(i => i.id !== editSIItemId);
  closeSIModal(); saveSidebarOnly(); renderSidebar();
}
