/* ══════════════════════════════════════════════════════════════
   SIDEBAR + DRAG & DROP  (extracted from app.js, PR-19). Sidebar
   render (categories, sections, entries, quick links) + admin
   drag-to-reorder. Global; loaded before app.js. renderSidebar is
   called from boot/Firebase-sync/saves; dnd uses dragSrc* state +
   saveSidebarOnly/saveExpandedOnly cross-file at runtime.
   (The MODAL DRAG-OUT GUARD that followed stays with ui/modal.js.)
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════ */
function renderSidebar() {
  try { _renderSidebarUnsafe(); }
  catch (err) {
    console.error('renderSidebar failed:', err);
    // Recover by resetting to defaults and trying once more
    SECTIONS = clone(DEFAULT_SECTIONS);
    HANDBOOK = clone(DEFAULT_HANDBOOK);
    SIDEBAR_CFG = clone(DEFAULT_SIDEBAR_CFG);
    try { _renderSidebarUnsafe(); } catch(e2) {
      document.getElementById('sidebar-sections-container').innerHTML =
        '<div style="padding:20px;font-size:12px;color:#c0392b">Sidebar failed to render. Open DevTools (F12) for details, or click ↑ Import in Admin Mode to restore.</div>';
    }
  }
}

// Recursively render one entry row + (if expanded) its child branches.
function _renderEntryBranch(entry, base, canEdit, depth) {
  const kids = childrenOf(entry.id, base);
  const hasKids = kids.length > 0;
  const key = expandKey(base, entry.id);
  const isExpanded = expandedSections.has(key);
  const isActive = currentView === 'entry' && currentBase === base && currentEntryId === entry.id;
  const indent = 8 + depth * 12; // px left padding per nesting level

  const chevron = hasKids
    ? `<span class="sb-chevron${isExpanded?' expanded':''}" onclick="event.stopPropagation();toggleSectionExpand('${escJsAttr(entry.id)}','${escJsAttr(base)}')">▶</span>`
    : `<span class="sb-chevron" style="visibility:hidden">▶</span>`;
  const editBtn = canEdit
    ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openEntryEditor('${escJsAttr(entry.id)}','${escJsAttr(base)}')" title="Edit entry">✎</button>`
    : '';
  const addSubBtn = canEdit
    ? `<button class="sb-add-btn" onclick="event.stopPropagation();openNewSubEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}')" title="Add sub-entry">＋</button>`
    : '';

  let html = `<div class="sb-child${isActive?' active':''}" style="padding-left:${indent}px" data-entry-id="${escAttr(entry.id)}" data-section-num="${escAttr(sectionNumOf(entry.id))}" data-base="${escAttr(base)}" ${canEdit?'draggable="true"':''}>
    ${canEdit ? `<span class="drag-handle" title="Drag to reorder">⠿</span>` : ''}
    ${chevron}
    <span class="sb-child-text" onclick="showEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}')">${escapeHtml(entry.id + ' ' + entry.title)}</span>
    ${addSubBtn}
    ${editBtn}
  </div>`;

  if (hasKids && isExpanded) {
    html += `<div class="sb-subchildren${isExpanded?' expanded':''}">`;
    for (const k of kids) html += _renderEntryBranch(k, base, canEdit, depth + 1);
    html += `</div>`;
  }
  return html;
}

function _renderKbSection(base, label, sectionsArr, emptyHint, addLabel) {
  // The 'base' value IS the category ID for KB-type sections (handbook/projects/custom).
  const catId = base;
  const collapsed = collapsedCategories.has(catId);
  let html = `<div class="sidebar-section">
    <div class="sidebar-section-label sb-cat-label" onclick="event.stopPropagation();navigateCategory('${escJsAttr(catId)}','kb')">
      <span class="sb-cat-chevron${collapsed?'':' expanded'}" onclick="event.stopPropagation();toggleCategoryCollapsed('${escJsAttr(catId)}')">▶</span>
      <span class="sb-cat-text">${escapeHtml(label)}</span>
      <button class="sb-cat-rename" onclick="event.stopPropagation();renameCategoryInline('${escJsAttr(catId)}')" title="Rename this category">✎</button>
    </div>
    <div class="sb-cat-body${collapsed?' collapsed':''}">`;
  if (sectionsArr.length === 0 && !isAdminMode) {
    html += `<div style="font-size:12px;color:var(--mid);font-style:italic;padding:2px 8px 4px">${escapeHtml(emptyHint)}</div>`;
  }
  for (const sec of sectionsArr) {
    const key = expandKey(base, sec.num);
    const isExpanded = expandedSections.has(key);
    const isActiveParent = currentView === 'section' && currentBase === base && currentSectionNum === sec.num;
    const canEdit = canEditSection(base, sec.num);
    const isProjectsNonAdmin = base === 'projects' && !isAdminMode;
    const lockBtn = isProjectsNonAdmin
      ? (unlockedProjects.has(String(sec.num))
          ? `<button class="sb-lock-btn unlocked" onclick="event.stopPropagation();lockProjectSection('${escJsAttr(sec.num)}')" title="Click to lock this section's edit access">🔓</button>`
          : `<button class="sb-lock-btn" onclick="event.stopPropagation();promptUnlockProjectSection('${escJsAttr(sec.num)}')" title="Enter passkey to edit this section">🔒</button>`)
      : '';
    const sectionEditBtn = isAdminMode
      ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openSectionEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')" title="Edit section info (admin only)">⚙</button>`
      : '';
    const addEntryBtn = canEdit
      ? `<button class="sb-add-btn" onclick="event.stopPropagation();openNewEntryEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')" title="Add entry">＋</button>`
      : '';
    html += `<div class="sb-parent${isActiveParent?' active':''}" data-section-num="${escAttr(sec.num)}" data-base="${escAttr(base)}">
      <span class="sb-chevron${isExpanded?' expanded':''}" onclick="event.stopPropagation();toggleSectionExpand('${escJsAttr(sec.num)}','${escJsAttr(base)}')">▶</span>
      <span class="sb-parent-text" onclick="showSection('${escJsAttr(sec.num)}','${escJsAttr(base)}')">${escapeHtml(sec.num + '. ' + sec.title)}</span>
      ${lockBtn}
      ${sectionEditBtn}
      ${addEntryBtn}
    </div>
    <div class="sb-children${isExpanded?' expanded':''}" data-section-num="${escAttr(sec.num)}" data-base="${escAttr(base)}">`;
    // Render the entry tree recursively (direct children of the section, each expandable)
    for (const e of childrenOf(sec.num, base)) {
      html += _renderEntryBranch(e, base, canEdit, 0);
    }
    if (canEdit) html += `<button class="admin-add-btn" onclick="openNewEntryEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')">＋ Add Entry</button>`;
    html += `</div>`;
  }
  // Adding a new TOP-LEVEL section/project is admin-only (passkey unlock is scoped to one section).
  if (isAdminMode) html += `<button class="admin-add-btn" onclick="openNewSectionEditor('${escJsAttr(base)}')">＋ ${escapeHtml(addLabel)}</button>`;
  html += `</div></div><div class="sb-divider"></div>`;
  return html;
}

function _renderSidebarUnsafe() {
  const c = document.getElementById('sidebar-sections-container');
  let html = '';

  // HANDBOOK
  html += _renderKbSection('handbook', getCategoryLabel('handbook'), SECTIONS,
    'No handbook sections.', 'Add New Section');

  // SIDEBAR_CFG sections (Quick Links)
  for (const section of SIDEBAR_CFG) {
    if (!section || !Array.isArray(section.items) || !section.id) continue;
    const collapsed = collapsedCategories.has(section.id);
    html += `<div class="sidebar-section">
      <div class="sidebar-section-label sb-cat-label" onclick="event.stopPropagation();navigateCategory('${escJsAttr(section.id)}','links')">
        <span class="sb-cat-chevron${collapsed?'':' expanded'}" onclick="event.stopPropagation();toggleCategoryCollapsed('${escJsAttr(section.id)}')">▶</span>
        <span class="sb-cat-text">${escapeHtml(getCategoryLabel(section.id) || section.label || '')}</span>
        <button class="sb-cat-rename" onclick="event.stopPropagation();renameCategoryInline('${escJsAttr(section.id)}')" title="Rename this category">✎</button>
      </div>
      <div class="sb-cat-body${collapsed?' collapsed':''}">`;
    for (const item of section.items) {
      if (!item || !item.id) continue;
      if (!item.visible && !isAdminMode) continue;
      const inner = item.href
        ? `<span class="sb-link-text"><a href="${escAttr(item.href)}" target="_blank" rel="noopener">${escapeHtml(item.text)}</a></span>`
        : `<span class="sb-link-text placeholder">${escapeHtml(item.text)}</span>`;
      // Admin-only affordances for Quick Links (drag + edit)
      const adminAffordances = isAdminMode ? `<span class="drag-handle" title="Drag to reorder">⠿</span>` : '';
      const editBtn = isAdminMode ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openSIEditor('${escJsAttr(section.id)}','${escJsAttr(item.id)}')" title="Edit link">✎</button>` : '';
      html += `<div class="sb-link" data-section-id="${escAttr(section.id)}" data-item-id="${escAttr(item.id)}" ${isAdminMode?'draggable="true"':''}>
        ${adminAffordances}
        ${inner}
        ${editBtn}
      </div>`;
    }
    if (isAdminMode) {
      html += `<button class="admin-add-btn" onclick="openNewSIEditor('${escJsAttr(section.id)}')">＋ Add Link</button>`;
    }
    html += `</div></div><div class="sb-divider"></div>`;
  }

  // PROJECTS (after Quick Links)
  html += _renderKbSection('projects', getCategoryLabel('projects'), PROJECTS,
    'No projects yet. Sign in as admin to add one.', 'Add New Project');

  // Custom categories (admin can add) — render each one with the same KB UX
  for (const cat of (CUSTOM_CATEGORIES || [])) {
    if (!cat || !cat.id) continue;
    if (!Array.isArray(cat.sections)) cat.sections = [];
    if (!Array.isArray(cat.entries)) cat.entries = [];
    html += _renderKbSection(cat.id, cat.label || 'Untitled Category', cat.sections,
      `No sections yet in ${cat.label || 'this category'}.`, 'Add New Section');
  }

  // Admin-only: "Add Category" at the very bottom
  if (isAdminMode) {
    html += `<div class="sidebar-section">
      <button class="admin-add-btn" style="margin-top:4px" onclick="openNewCategoryModal()">＋ Add New Category</button>
    </div>`;
  }

  c.innerHTML = html;
  attachSidebarDnD();
}

function toggleSectionExpand(num, base) {
  base = base || 'handbook';
  const key = expandKey(base, num);
  if (expandedSections.has(key)) expandedSections.delete(key);
  else expandedSections.add(key);
  saveExpandedOnly();
  renderSidebar();
}

/* ══════════════════════════════════════════
   DRAG & DROP
   ══════════════════════════════════════════ */
function attachSidebarDnD() {
  // Entries (draggable within section)
  document.querySelectorAll('.sb-child[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => onDragStart(e, 'entry'));
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropEntry);
    el.addEventListener('dragend', onDragEnd);
  });
  // SI Items
  document.querySelectorAll('.sb-link[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => onDragStart(e, 'siItem'));
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropSI);
    el.addEventListener('dragend', onDragEnd);
  });
}

function onDragStart(e, type) {
  if (!isAdminMode) { e.preventDefault(); return; }
  if (!e.target.closest('.drag-handle')) { e.preventDefault(); return; }
  dragSrcType = type;
  if (type === 'entry') {
    dragSrcSection = e.currentTarget.dataset.sectionNum;
    dragSrcItemId = e.currentTarget.dataset.entryId;
  } else {
    dragSrcSection = e.currentTarget.dataset.sectionId;
    dragSrcItemId = e.currentTarget.dataset.itemId;
  }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcItemId);
  setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
}
function onDragOver(e) {
  if (!isAdminMode || !dragSrcItemId) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  clearDragStyles();
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drag-over-above' : 'drag-over-below');
}
function onDragLeave(e) { e.currentTarget.classList.remove('drag-over-above','drag-over-below'); }
function onDragEnd() { clearDragStyles(); dragSrcType=dragSrcSection=dragSrcItemId=null; }
function clearDragStyles() {
  document.querySelectorAll('.drag-over-above,.drag-over-below,.dragging').forEach(el => el.classList.remove('drag-over-above','drag-over-below','dragging'));
}

function onDropEntry(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'entry') return;
  const tgtSection = e.currentTarget.dataset.sectionNum;
  const tgtEntryId = e.currentTarget.dataset.entryId;
  const tgtBase = e.currentTarget.dataset.base || 'handbook';
  const srcBase = (document.querySelector('.sb-child.dragging')||{}).dataset && document.querySelector('.sb-child.dragging').dataset.base || 'handbook';
  if (srcBase !== tgtBase) { clearDragStyles(); return; } // no cross-base drops
  if (dragSrcSection !== tgtSection) { clearDragStyles(); return; }
  if (dragSrcItemId === tgtEntryId) { clearDragStyles(); return; }
  // Only allow reordering between true siblings (same parent in the tree).
  if (String(parentOf(dragSrcItemId)) !== String(parentOf(tgtEntryId))) { clearDragStyles(); return; }
  const arr = entriesOf(tgtBase);
  const srcEntry = arr.find(en => en.id === dragSrcItemId);
  const allIdxOfSrc = arr.findIndex(en => en.id === dragSrcItemId);
  if (allIdxOfSrc === -1) { clearDragStyles(); return; }
  arr.splice(allIdxOfSrc, 1);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const newTgtIdx = arr.findIndex(en => en.id === tgtEntryId);
  arr.splice(after ? newTgtIdx + 1 : newTgtIdx, 0, srcEntry);
  clearDragStyles();
  saveSidebarOnly();
  renderSidebar();
}

function onDropSI(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'siItem') return;
  const tgtSecId = e.currentTarget.dataset.sectionId;
  const tgtItemId = e.currentTarget.dataset.itemId;
  if (dragSrcItemId === tgtItemId) { clearDragStyles(); return; }
  const srcSec = SIDEBAR_CFG.find(s => s.id === dragSrcSection);
  const tgtSec = SIDEBAR_CFG.find(s => s.id === tgtSecId);
  if (!srcSec || !tgtSec) return;
  const srcIdx = srcSec.items.findIndex(i => i.id === dragSrcItemId);
  const tgtIdx = tgtSec.items.findIndex(i => i.id === tgtItemId);
  if (srcIdx === -1 || tgtIdx === -1) return;
  const [moved] = srcSec.items.splice(srcIdx, 1);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const finalIdx = after ? tgtIdx + (srcSec === tgtSec && srcIdx < tgtIdx ? 0 : 1) : tgtIdx;
  tgtSec.items.splice(finalIdx, 0, moved);
  clearDragStyles();
  saveSidebarOnly();
  renderSidebar();
}
