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
    const canReorderSection = isAdminMode && sectionsRenumberable(base);
    // draggable goes on the handle (not the row) so dragstart can only fire
    // from the handle — no risk of accidentally starting a drag from clicking
    // the row title, and no need for an e.target.closest gate (which fails
    // when the mousedown lands a pixel off the ⠿ glyph onto the parent's flex
    // gap and reports e.target as the row itself).
    const secDragHandle = canReorderSection ? `<span class="drag-handle" draggable="true" title="Drag to reorder section">⠿</span>` : '';
    html += `<div class="sb-parent${isActiveParent?' active':''}" data-section-num="${escAttr(sec.num)}" data-base="${escAttr(base)}">
      ${secDragHandle}
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
  // Sections (draggable within their category — handbook + custom only).
  // dragstart fires from the .drag-handle SPAN itself (so it's the only
  // valid drag origin); the .sb-parent row is the drop target. We only
  // wire drop on rows that ALSO have a handle, so projects rows (which we
  // exclude from renumbering) never show drop-here feedback.
  document.querySelectorAll('.sb-parent').forEach(el => {
    const handle = el.querySelector(':scope > .drag-handle[draggable]');
    if (!handle) return;
    handle.addEventListener('dragstart', e => onDragStart(e, 'section'));
    handle.addEventListener('dragend', onDragEnd);
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropSection);
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
  dragSrcType = type;
  if (type === 'entry') {
    // entry drag handle gate (dragstart fires on the row, not the handle)
    if (!e.target.closest('.drag-handle')) { e.preventDefault(); return; }
    dragSrcSection = e.currentTarget.dataset.sectionNum;
    dragSrcItemId = e.currentTarget.dataset.entryId;
  } else if (type === 'section') {
    // dragstart fires on the .drag-handle span itself (the row isn't
    // draggable). Read the section context from the surrounding .sb-parent.
    const row = e.currentTarget.closest('.sb-parent');
    if (!row) { e.preventDefault(); return; }
    dragSrcSection = row.dataset.base || 'handbook';
    dragSrcItemId = row.dataset.sectionNum;
  } else {
    if (!e.target.closest('.drag-handle')) { e.preventDefault(); return; }
    dragSrcSection = e.currentTarget.dataset.sectionId;
    dragSrcItemId = e.currentTarget.dataset.itemId;
  }
  if (!dragSrcItemId) { e.preventDefault(); return; }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcItemId);
  const rowEl = type === 'section' ? (e.currentTarget.closest('.sb-parent') || e.currentTarget) : e.currentTarget;
  // For section drag the dragstart target is the small ⠿ handle — use the
  // whole row as the drag preview so the user sees what's actually moving.
  if (type === 'section' && rowEl !== e.currentTarget && e.dataTransfer.setDragImage) {
    try { e.dataTransfer.setDragImage(rowEl, 12, rowEl.offsetHeight / 2); } catch (err) {}
  }
  setTimeout(() => rowEl.classList.add('dragging'), 0);
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

// Toggle the sidebar's "saving in progress" overlay. Hides the sidebar
// behind a dimmed scrim + spinner and blocks pointer events on its rows
// until the in-flight writes settle. Used by onDropSection — a section
// reorder rewrites every entry doc under that section and we don't want
// the user starting a second drag while the first is mid-flight.
function showSidebarSaving() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.add('sidebar-saving');
}
function hideSidebarSaving() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.remove('sidebar-saving');
}

function onDropSection(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'section') { clearDragStyles(); return; }
  const tgtBase = e.currentTarget.dataset.base || 'handbook';
  const tgtSecNum = e.currentTarget.dataset.sectionNum;
  // No cross-category drops, no self-drops, no drops into a non-renumberable base.
  if (dragSrcSection !== tgtBase) { clearDragStyles(); return; }
  if (!sectionsRenumberable(tgtBase)) { clearDragStyles(); return; }
  if (dragSrcItemId === tgtSecNum) { clearDragStyles(); return; }
  const arr = sectionsOf(tgtBase);
  const srcIdx = arr.findIndex(s => String(s.num) === String(dragSrcItemId));
  if (srcIdx === -1) { clearDragStyles(); return; }
  const [moved] = arr.splice(srcIdx, 1);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const tgtIdx = arr.findIndex(s => String(s.num) === String(tgtSecNum));
  if (tgtIdx === -1) { arr.splice(srcIdx, 0, moved); clearDragStyles(); return; }
  arr.splice(after ? tgtIdx + 1 : tgtIdx, 0, moved);
  renumberSectionsForBase(tgtBase);
  // Capture the moved section's POST-renumber num so we can flash the
  // accent color on its new sidebar row once the save settles.
  const movedNewNum = String(moved.num);
  clearDragStyles();
  showSidebarSaving();
  // Section reorder rewrites entry IDs + section nums across the category —
  // saveAll covers sections, entries (handbook/projects/per-category), and
  // custom-category metadata.
  saveAll('Section moved');
  renderSidebar();
  if (currentView === 'section' && currentBase === tgtBase && currentSectionNum) {
    showSection(currentSectionNum, tgtBase);
  } else if (currentView === 'entry' && currentBase === tgtBase && currentEntryId) {
    showEntry(currentEntryId, tgtBase);
  } else if (currentView === 'category' && currentCategoryId === tgtBase) {
    if (typeof showCategoryOverview === 'function') showCategoryOverview(currentCategoryId, currentCategoryType);
  } else if (currentView === 'docview') {
    if (typeof renderDocView === 'function') renderDocView();
  }
  // Hide the overlay once all Firestore writes for this batch have settled.
  // Enforce a small minimum visible duration so the overlay doesn't flash
  // out instantly on cache hits (or when offline → no writes at all).
  const overlayStart = Date.now();
  const idleP = (typeof fbWritesIdle === 'function') ? fbWritesIdle() : Promise.resolve();
  // 10s ceiling so a stuck/dropped write can't lock the sidebar indefinitely.
  Promise.race([idleP, new Promise(r => setTimeout(r, 10000))]).then(() => {
    const wait = Math.max(0, 350 - (Date.now() - overlayStart));
    setTimeout(() => {
      hideSidebarSaving();
      flashMovedSection(tgtBase, movedNewNum);
    }, wait);
  });
}

// Briefly highlight the moved section's new sidebar row in the accent color
// so the user can spot where it landed after the saving overlay clears.
// Looks up the row in the live DOM (rather than relying on a stale node
// reference) because renderSidebar may have replaced the entire sidebar
// content between the drop and this call.
function flashMovedSection(base, num) {
  const row = [...document.querySelectorAll('.sb-parent')].find(el =>
    el.dataset.sectionNum === String(num) && (el.dataset.base || 'handbook') === base
  );
  if (!row) return;
  row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  row.classList.remove('sb-just-moved');
  // Reflow so re-adding the class restarts the animation if the user does
  // a second reorder before the previous flash finished.
  void row.offsetWidth;
  row.classList.add('sb-just-moved');
  setTimeout(() => row.classList.remove('sb-just-moved'), 1700);
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
