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

  // draggable goes on the handle span (not the row) so dragstart only fires
  // when the user grabs the ⠿, matching the section-drag pattern. The row
  // remains the drop target.
  const entryDragHandle = canEdit ? `<span class="drag-handle" draggable="true" title="Drag to reorder or move to another section">⠿</span>` : '';
  let html = `<div class="sb-child${isActive?' active':''}" style="padding-left:${indent}px" data-entry-id="${escAttr(entry.id)}" data-section-num="${escAttr(sectionNumOf(entry.id))}" data-base="${escAttr(base)}">
    ${entryDragHandle}
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
  // If a recent section reorder is still inside its highlight window,
  // re-apply the flash class to the new DOM so the pulse survives
  // re-renders (snapshot echoes, showSection refresh, etc).
  applyPendingSectionFlash();
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
  // Entries — dragstart fires from the handle span, drop target is the row.
  document.querySelectorAll('.sb-child').forEach(el => {
    const handle = el.querySelector(':scope > .drag-handle[draggable]');
    if (handle) {
      handle.addEventListener('dragstart', e => onDragStart(e, 'entry'));
      handle.addEventListener('dragend', onDragEnd);
    }
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropEntry);
  });
  // Sections — dragstart fires from the handle (only present on renumberable
  // bases). Drop is wired on EVERY .sb-parent so entries can also be dropped
  // onto a section header to move them into that section.
  document.querySelectorAll('.sb-parent').forEach(el => {
    const handle = el.querySelector(':scope > .drag-handle[draggable]');
    if (handle) {
      handle.addEventListener('dragstart', e => onDragStart(e, 'section'));
      handle.addEventListener('dragend', onDragEnd);
    }
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
  // The handle span is the drag origin for all types now; the row that
  // describes the data lives one level up (.sb-child for entries,
  // .sb-parent for sections, .sb-link for quick links).
  if (type === 'entry') {
    const row = e.currentTarget.closest('.sb-child');
    if (!row) { e.preventDefault(); return; }
    dragSrcBase = row.dataset.base || 'handbook';
    dragSrcSection = row.dataset.sectionNum;
    dragSrcItemId = row.dataset.entryId;
  } else if (type === 'section') {
    const row = e.currentTarget.closest('.sb-parent');
    if (!row) { e.preventDefault(); return; }
    dragSrcBase = row.dataset.base || 'handbook';
    dragSrcSection = dragSrcBase; // back-compat for any callers reading dragSrcSection
    dragSrcItemId = row.dataset.sectionNum;
  } else {
    if (!e.target.closest('.drag-handle')) { e.preventDefault(); return; }
    dragSrcBase = null;
    dragSrcSection = e.currentTarget.dataset.sectionId;
    dragSrcItemId = e.currentTarget.dataset.itemId;
  }
  if (!dragSrcItemId) { e.preventDefault(); return; }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcItemId);
  // Whole row is the visible drag preview, not the small ⠿ handle.
  const rowEl =
    type === 'section' ? (e.currentTarget.closest('.sb-parent') || e.currentTarget)
  : type === 'entry'   ? (e.currentTarget.closest('.sb-child')  || e.currentTarget)
  :                       e.currentTarget;
  if (rowEl !== e.currentTarget && e.dataTransfer.setDragImage) {
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
function onDragEnd() { clearDragStyles(); dragSrcType=dragSrcSection=dragSrcItemId=dragSrcBase=null; }
function clearDragStyles() {
  document.querySelectorAll('.drag-over-above,.drag-over-below,.dragging').forEach(el => el.classList.remove('drag-over-above','drag-over-below','dragging'));
}

function onDropEntry(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'entry') { clearDragStyles(); return; }
  const tgtBase    = e.currentTarget.dataset.base || 'handbook';
  const tgtEntryId = e.currentTarget.dataset.entryId;
  if (dragSrcBase !== tgtBase) { clearDragStyles(); return; }   // no cross-base
  if (dragSrcItemId === tgtEntryId) { clearDragStyles(); return; }
  const srcEntry = findEntry(dragSrcItemId, tgtBase);
  const tgtEntry = findEntry(tgtEntryId, tgtBase);
  if (!srcEntry || !tgtEntry) { clearDragStyles(); return; }
  // Reject dropping a node onto one of its own descendants (would create a cycle).
  if (String(tgtEntryId).startsWith(srcEntry.id + '.')) { clearDragStyles(); return; }
  // Source becomes a sibling of the target — same parent in the tree.
  const newParent = parentOf(tgtEntry.id);
  const oldParent = parentOf(srcEntry.id);
  let newSiblings = childrenOf(newParent, tgtBase).filter(s => s.id !== srcEntry.id);
  const tgtIdx = newSiblings.findIndex(s => s.id === tgtEntryId);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  if (tgtIdx === -1) newSiblings.push(srcEntry);
  else newSiblings.splice(after ? tgtIdx + 1 : tgtIdx, 0, srcEntry);
  _commitEntryMove(srcEntry, oldParent, newParent, newSiblings, tgtBase);
}

// Shared tail for entry moves (same-parent reorder OR cross-section/cross-
// parent move via onDropEntry / onDropSection). Renumbers the new parent's
// children to match the supplied order (cascading to descendants), then
// closes the gap in the old parent if the move crossed parents. Wraps the
// save in the same overlay + flash pattern as section reorder.
function _commitEntryMove(srcEntry, oldParent, newParent, newSiblings, base) {
  // Depth guard: the entry-id naming style alternates between numbers and
  // letters by depth (parent at length 1 → numeric children "14.1", parent
  // at length 2 → letter children "14.1.a"). A cross-depth drop would
  // require re-styling every descendant's last segment, not just rewriting
  // the prefix. Reject those drops for now — both of the user-requested
  // cases (sibling reorder, cross-section move at the section level) are
  // depth-preserving and still work.
  const newParentLen = idComponents(String(newParent)).length;
  const oldParentLen = idComponents(String(oldParent)).length;
  if (newParentLen !== oldParentLen) {
    clearDragStyles();
    if (typeof showToast === 'function') {
      showToast('Use Edit Entry to change nesting depth — drag only reorders within the same level.');
    }
    return;
  }
  renumberChildrenInOrder(newParent, base, newSiblings);
  if (String(oldParent) !== String(newParent)) {
    // Source's row is gone from oldParent's children now (its id was rewritten)
    // — childrenOf returns the survivors in their current array order.
    renumberChildrenInOrder(oldParent, base, childrenOf(oldParent, base));
  }
  const movedNewId = srcEntry.id; // mutated by renumberChildrenInOrder
  clearDragStyles();
  showSidebarSaving();
  saveAll('Entry moved');
  renderSidebar();
  if (currentView === 'entry' && currentBase === base && currentEntryId) {
    showEntry(currentEntryId, base);
  } else if (currentView === 'section' && currentBase === base && currentSectionNum) {
    showSection(currentSectionNum, base);
  } else if (currentView === 'category' && currentCategoryId === base) {
    if (typeof showCategoryOverview === 'function') showCategoryOverview(currentCategoryId, currentCategoryType);
  } else if (currentView === 'docview') {
    if (typeof renderDocView === 'function') renderDocView();
  }
  const overlayStart = Date.now();
  const idleP = (typeof fbWritesIdle === 'function') ? fbWritesIdle() : Promise.resolve();
  Promise.race([idleP, new Promise(r => setTimeout(r, 10000))]).then(() => {
    const wait = Math.max(0, 350 - (Date.now() - overlayStart));
    setTimeout(() => {
      hideSidebarSaving();
      // Make sure the section that now holds the entry is expanded so the
      // flash is actually visible (the user can't see a row that's hidden
      // inside a collapsed branch).
      const ancestorIds = [];
      let cur = parentOf(movedNewId);
      while (cur) { ancestorIds.push(cur); cur = parentOf(cur); }
      // The outermost ancestor is the section num — expand that branch + every
      // intermediate entry so the row renders.
      let expanded = false;
      for (const a of ancestorIds) {
        const k = expandKey(base, a);
        if (!expandedSections.has(k)) { expandedSections.add(k); expanded = true; }
      }
      if (expanded) { saveExpandedOnly(); renderSidebar(); }
      const row = [...document.querySelectorAll('.sb-child')].find(el =>
        el.dataset.entryId === String(movedNewId) && (el.dataset.base || 'handbook') === base
      );
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      startEntryFlash(base, movedNewId);
    }, wait);
  });
}

// ── Sidebar "busy" lock ──────────────────────────────────────────────────
// While locked, the sidebar shows a dimmed scrim + spinner, every sidebar
// control is non-interactive (CSS: .sidebar-saving > * { pointer-events:none }),
// and EXITING Admin Mode is blocked (see exitAdminMode). Used whenever the
// sidebar list is rewritten in a batch — drag-reorder, JSON import, and
// incoming remote (team) updates — so the user can't act on, or get knocked
// out of admin by, a list that's changing under them.
//
// Two kinds of hold, OR'd together by isSidebarBusy():
//   • _sbLockCount — balanced show/hide pairs for operations with a known end
//     (reorder, import). Counted so overlapping ops don't unlock each other.
//   • _sbFlashTimer — a brief, self-coalescing lock for transient updates
//     (a burst of remote snapshots), auto-released after a quiet period.
let _sbLockCount = 0;
let _sbFlashTimer = null;

function isSidebarBusy() { return _sbLockCount > 0 || _sbFlashTimer !== null; }

function _applySidebarSaving() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('sidebar-saving', isSidebarBusy());
}

// Balanced pair (kept by these names for the existing reorder call sites).
function showSidebarSaving() { _sbLockCount++; _applySidebarSaving(); }
function hideSidebarSaving() { _sbLockCount = Math.max(0, _sbLockCount - 1); _applySidebarSaving(); }

// Briefly lock the sidebar, coalescing rapid calls (e.g. several remote
// snapshots landing during a teammate's import). Auto-releases after `ms`
// of quiet. Safe to interleave with the counted lock above.
function flashSidebarSaving(ms) {
  if (_sbFlashTimer) clearTimeout(_sbFlashTimer);
  _sbFlashTimer = setTimeout(() => { _sbFlashTimer = null; _applySidebarSaving(); }, ms || 500);
  _applySidebarSaving();
}

// Run an async, sidebar-mutating operation behind the saving overlay: lock,
// run fn, then keep the overlay up until Firestore writes settle (10s ceiling)
// with a small minimum so it doesn't flash out on a cache hit. Mirrors the
// drag-reorder UX. Used by JSON import.
async function withSidebarSaving(fn) {
  showSidebarSaving();
  const start = Date.now();
  try {
    await fn();
    const idleP = (typeof fbWritesIdle === 'function') ? fbWritesIdle() : Promise.resolve();
    await Promise.race([idleP, new Promise(r => setTimeout(r, 10000))]);
    const wait = Math.max(0, 350 - (Date.now() - start));
    if (wait) await new Promise(r => setTimeout(r, wait));
  } finally {
    hideSidebarSaving();
  }
}

/* "Just moved" highlight — kept in module state so it survives the
   renderSidebar calls that happen when Firestore snapshot echoes from our
   own writes arrive after fbWritesIdle resolves (without this, the
   .sb-just-moved class gets wiped half a second into the animation). */
const FLASH_DURATION_MS = 2400;
let _justMovedFlash = null; // { base, kind: 'section' | 'entry', id, startedAt }

function startSectionFlash(base, num) { _startFlash(base, 'section', num); }
function startEntryFlash(base, id)    { _startFlash(base, 'entry',   id); }
function _startFlash(base, kind, id) {
  _justMovedFlash = { base, kind, id: String(id), startedAt: Date.now() };
  applyPendingSectionFlash();
  setTimeout(() => {
    if (_justMovedFlash && Date.now() - _justMovedFlash.startedAt >= FLASH_DURATION_MS) {
      _justMovedFlash = null;
    }
  }, FLASH_DURATION_MS + 50);
}

// Re-applies the flash class to the matching .sb-parent / .sb-child row
// after a renderSidebar call. Uses a negative animation-delay so the pulse
// picks up where it left off instead of restarting from frame 0 each time.
// Name kept for back-compat with the renderSidebar hook.
function applyPendingSectionFlash() {
  if (!_justMovedFlash) return;
  const elapsed = Date.now() - _justMovedFlash.startedAt;
  if (elapsed >= FLASH_DURATION_MS) { _justMovedFlash = null; return; }
  const { base, kind, id } = _justMovedFlash;
  let row;
  if (kind === 'entry') {
    row = [...document.querySelectorAll('.sb-child')].find(el =>
      el.dataset.entryId === id && (el.dataset.base || 'handbook') === base
    );
  } else {
    row = [...document.querySelectorAll('.sb-parent')].find(el =>
      el.dataset.sectionNum === id && (el.dataset.base || 'handbook') === base
    );
  }
  if (!row) return;
  row.style.animationDelay = `-${(elapsed / 1000).toFixed(3)}s`;
  row.classList.remove('sb-just-moved');
  void row.offsetWidth;
  row.classList.add('sb-just-moved');
}

function onDropSection(e) {
  e.preventDefault();
  if (!isAdminMode) { clearDragStyles(); return; }
  // Entry dropped onto a section header → move that entry into this section
  // as its last direct child. Works for any base (including projects);
  // renumberChildrenInOrder only touches entry IDs, not section nums or
  // /project-secrets keys.
  if (dragSrcType === 'entry') {
    const tgtBase = e.currentTarget.dataset.base || 'handbook';
    const tgtSecNum = e.currentTarget.dataset.sectionNum;
    if (dragSrcBase !== tgtBase) { clearDragStyles(); return; } // no cross-base
    const srcEntry = findEntry(dragSrcItemId, tgtBase);
    if (!srcEntry) { clearDragStyles(); return; }
    const oldParent = parentOf(srcEntry.id);
    const newParent = String(tgtSecNum);
    // Append source at the end of this section's direct children.
    const newSiblings = childrenOf(newParent, tgtBase).filter(s => s.id !== srcEntry.id);
    newSiblings.push(srcEntry);
    _commitEntryMove(srcEntry, oldParent, newParent, newSiblings, tgtBase);
    return;
  }
  if (dragSrcType !== 'section') { clearDragStyles(); return; }
  const tgtBase = e.currentTarget.dataset.base || 'handbook';
  const tgtSecNum = e.currentTarget.dataset.sectionNum;
  // No cross-category drops, no self-drops, no drops into a non-renumberable base.
  if (dragSrcBase !== tgtBase) { clearDragStyles(); return; }
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
      // Scroll the moved row into view (if needed) before starting the flash.
      const row = [...document.querySelectorAll('.sb-parent')].find(el =>
        el.dataset.sectionNum === String(movedNewNum) && (el.dataset.base || 'handbook') === tgtBase
      );
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      startSectionFlash(tgtBase, movedNewNum);
    }, wait);
  });
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
