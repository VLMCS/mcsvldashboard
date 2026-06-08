/* ══════════════════════════════════════════════════════════════
   NAVIGATION + VIEWS  (extracted from app.js, PR-21). setView,
   breadcrumb, showHome, showSection, showEntry, sub-entry create,
   category overview, entry cards. Global; loaded before app.js;
   the boot block calls showHome/setView and these call render/
   persistence/edit helpers cross-file at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   NAVIGATION (views)
   ══════════════════════════════════════════ */
function setView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  currentView = name;
  window.scrollTo(0, 0);
  // Show back-to-home FAB only when reading content (not on home or doc view)
  const fab = document.getElementById('back-to-home-fab');
  if (fab) fab.classList.toggle('visible', name === 'section' || name === 'entry' || name === 'category');
  // Mirror the current view into the URL hash so it's shareable / bookmarkable.
  if (typeof _syncUrlToView === 'function') _syncUrlToView();
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let parts = [`<span class="bc-item" onclick="showHome()">${escapeHtml(SITE_SETTINGS.siteName || 'Dashboard')}</span>`];
  const baseLabel = getCategoryLabel(currentBase);
  if (currentView === 'category' && currentCategoryId) {
    let catLabel = 'Category';
    catLabel = getCategoryLabel(currentCategoryId);
    parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(catLabel)}</span>`);
  } else if (currentView === 'section' && currentSectionNum) {
    const sec = findSection(currentSectionNum, currentBase);
    if (sec) {
      parts.push(`<span class="bc-sep">/</span><span class="bc-item">${escapeHtml(baseLabel)}</span>`);
      parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(sec.num + '. ' + sec.title)}</span>`);
    }
  } else if (currentView === 'entry' && currentEntryId) {
    const entry = findEntry(currentEntryId, currentBase);
    if (entry) {
      const secNum = sectionNumOf(entry.id);
      const sec = findSection(secNum, currentBase);
      parts.push(`<span class="bc-sep">/</span><span class="bc-item">${escapeHtml(baseLabel)}</span>`);
      if (sec) parts.push(`<span class="bc-sep">/</span><span class="bc-item" onclick="showSection('${escJsAttr(secNum)}','${escJsAttr(currentBase)}')">${escapeHtml(sec.num + '. ' + sec.title)}</span>`);
      // Walk the ancestor entry chain (e.g. 14.1 → 14.1.a → current) so each level is clickable.
      const chain = [];
      let pid = parentOf(entry.id);
      while (pid && idComponents(pid).length >= 2) { // stop before the section-only id
        const anc = findEntry(pid, currentBase);
        if (anc) chain.unshift(anc);
        pid = parentOf(pid);
      }
      for (const anc of chain) {
        parts.push(`<span class="bc-sep">/</span><span class="bc-item" onclick="showEntry('${escJsAttr(anc.id)}','${escJsAttr(currentBase)}')">${escapeHtml(anc.title)}</span>`);
      }
      parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(entry.title)}</span>`);
    }
  } else if (currentView === 'docview') {
    parts.push(`<span class="bc-sep">/</span><span class="bc-item active">📑 Documentation View</span>`);
  }
  bc.innerHTML = parts.join('');
}

function showHome() {
  pauseInlineVideos();
  currentSectionNum = null; currentEntryId = null;
  setView('home'); updateBreadcrumb();
  renderAnnouncements();
  renderSidebar();
}

function expandKey(base, num) { return (base||'handbook') + ':' + String(num); }

// A clickable card for an entry (used in section view + entry view child grids).
function entryCardHtml(e, base, canEdit) {
  const kids = childrenOf(e.id, base).length;
  const badge = kids ? ` · ${kids} sub-${kids===1?'entry':'entries'}` : '';
  const excerpt = (() => {
    const txt = stripHtml(e.content || '');
    return txt.length > 90 ? txt.slice(0, 90) + '…' : txt;
  })();
  return `<div class="section-card" data-entry-id="${escAttr(e.id)}" onclick="showEntry('${escJsAttr(e.id)}','${escJsAttr(base)}')">
    <div class="section-card-id">${escapeHtml(e.id)}${badge}</div>
    <div class="section-card-title">${escapeHtml(e.title)}</div>
    ${excerpt ? `<div style="font-size:12px;color:var(--mid);margin-top:5px;line-height:1.4">${escapeHtml(excerpt)}</div>` : ''}
    ${canEdit ? `<div class="section-card-actions">
      <button onclick="event.stopPropagation();openEntryEditor('${escJsAttr(e.id)}','${escJsAttr(base)}')" title="Edit">✎</button>
    </div>` : ''}
  </div>`;
}

function showSection(num, base) {
  pauseInlineVideos();
  base = base || 'handbook';
  currentBase = base;
  currentSectionNum = String(num); currentEntryId = null;
  const sec = findSection(num, base);
  if (!sec) { showHome(); return; }
  document.getElementById('sv-num').textContent = base === 'projects' ? `Project ${sec.num}` : `Section ${sec.num}`;
  document.getElementById('sv-title').textContent = `${sec.num}. ${sec.title}`;
  const svDesc = document.getElementById('sv-desc');
  svDesc.innerHTML = sec.description || '';
  svDesc.querySelectorAll('img').forEach(img => img.classList.add('entry-img'));
  // Section view shows only DIRECT children of the section (e.g. 14.1, 14.2 — not 14.1.a)
  const entries = childrenOf(num, base);
  const canEdit = canEditSection(base, num);
  const grid = document.getElementById('sv-grid');
  grid.innerHTML = entries.map(e => entryCardHtml(e, base, canEdit)).join('')
    + (canEdit ? `<div class="add-card" onclick="openNewEntryEditor('${escJsAttr(num)}','${escJsAttr(base)}')">＋ Add Entry</div>` : '');

  // ── Render the section-actions row based on access level ──
  // Real admin: "Edit Section Info" (incl. passkey + delete)
  // Project + passkey unlocked: "Edit Mode Active" badge + "Edit Section Info"
  //                              (scoped admin: rename/edit description, NOT delete or passkey)
  //                              + "Exit Edit Mode"
  // Project + locked: the "Enter Edit Mode" CTA
  // Handbook + non-admin: nothing
  const actionsEl = document.getElementById('sv-actions');
  let actionsHtml = '';
  if (isAdminMode) {
    actionsHtml = `<button class="btn btn-secondary" onclick="openSectionEditor('${escJsAttr(num)}','${escJsAttr(base)}')">⚙ Edit Section Info</button>`;
  } else if (base === 'projects') {
    if (unlockedProjects.has(String(num))) {
      actionsHtml = `
        <span class="edit-mode-active">Edit Mode Active for this section</span>
        <button class="btn btn-secondary" onclick="openSectionEditor('${escJsAttr(num)}','${escJsAttr(base)}')">⚙ Edit Section Info</button>
        <button class="btn btn-secondary" onclick="lockProjectSection('${escJsAttr(num)}')">🔒 Exit Edit Mode</button>
      `;
    } else {
      actionsHtml = `<button class="btn btn-cta-edit" onclick="promptUnlockProjectSection('${escJsAttr(num)}')">🔑 Enter Edit Mode</button>`;
    }
  }
  actionsEl.innerHTML = actionsHtml;

  expandedSections.add(expandKey(base, num)); saveExpandedOnly();
  setView('section'); updateBreadcrumb(); renderSidebar();
}

function showEntry(id, base, highlightQuery) {
  pauseInlineVideos();
  base = base || 'handbook';
  // If caller didn't specify base but the id only exists in projects, find it
  if (!findEntry(id, base)) {
    const found = findEntryAnywhere(id);
    if (found) base = found.base;
  }
  currentBase = base;
  const entry = findEntry(id, base);
  if (!entry) { showHome(); return; }
  currentEntryId = id; currentSectionNum = sectionNumOf(id);

  document.getElementById('ev-id').textContent = `${entry.id} · ${entry.section}`;
  document.getElementById('ev-title').textContent = entry.title;
  const content = document.getElementById('ev-content');
  content.innerHTML = entry.content;
  // Mark images for lightbox
  content.querySelectorAll('img').forEach(img => img.classList.add('entry-img'));

  // If we arrived here from a search result, briefly flash the matched
  // tokens inside the entry so the user sees *why* it matched.
  if (highlightQuery) flashSearchMatches(content, highlightQuery);

  // Show/hide "Edit Entry" button based on access level for this section
  const canEdit = canEditSection(base, currentSectionNum);
  const editBtn = document.querySelector('#view-entry .entry-actions .btn');
  if (editBtn) editBtn.style.display = canEdit ? 'inline-flex' : 'none';

  // ── Sub-entries (direct children of this entry) ──
  const kids = childrenOf(id, base);
  const childWrap = document.getElementById('ev-children-wrap');
  const childGrid = document.getElementById('ev-children-grid');
  if (kids.length || canEdit) {
    childWrap.style.display = '';
    childGrid.innerHTML = kids.map(k => entryCardHtml(k, base, canEdit)).join('')
      + (canEdit ? `<div class="add-card" onclick="openNewSubEntry('${escJsAttr(id)}','${escJsAttr(base)}')">＋ Add Sub-Entry</div>` : '');
    document.getElementById('ev-children-label').style.display = (kids.length || canEdit) ? '' : 'none';
  } else {
    childWrap.style.display = 'none';
  }

  expandedSections.add(expandKey(base, currentSectionNum));
  expandedSections.add(expandKey(base, id)); // expand this entry's branch in sidebar
  saveExpandedOnly();
  setView('entry'); updateBreadcrumb(); renderSidebar();
}

// Back button: go to the entry's PARENT (entry or section), not just the section.
function backToSection() {
  if (currentView === 'entry' && currentEntryId) {
    const pid = parentOf(currentEntryId);
    if (pid && findEntry(pid, currentBase)) { showEntry(pid, currentBase); return; }
  }
  if (currentSectionNum) showSection(currentSectionNum, currentBase);
  else showHome();
}

// Open the entry editor pre-filled to create a child of parentId.
function openNewSubEntry(parentId, base) {
  base = base || currentBase || 'handbook';
  const sectionNum = sectionNumOf(parentId);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need edit access to add sub-entries.');
    return;
  }
  openNewEntryEditor(sectionNum, base, suggestChildId(parentId, base));
}

let currentCategoryId = null;     // id of category currently in overview view
let currentCategoryType = null;   // 'kb' or 'links'

// Show the category overview: a thumbnail card grid of all top-level entries
// in the given category. catType is 'kb' for sectioned KBs, 'links' for Quick-Links.
function showCategoryOverview(catId, catType) {
  pauseInlineVideos();
  currentCategoryId = catId;
  currentCategoryType = catType;
  currentSectionNum = null; currentEntryId = null;
  if (catType === 'kb') currentBase = catId; // handbook/projects/custom id

  const labelEl = document.getElementById('cv-label');
  const titleEl = document.getElementById('cv-title');
  const descEl  = document.getElementById('cv-desc');
  const grid    = document.getElementById('cv-grid');

  if (catType === 'kb') {
    const sectionsArr = sectionsOf(catId);
    const isCustom = (catId !== 'handbook' && catId !== 'projects');
    const friendlyLabel = getCategoryLabel(catId);
    labelEl.textContent = friendlyLabel;
    titleEl.textContent = `${friendlyLabel} — Overview`;
    descEl.innerHTML = `<span style="color:var(--mid)">All ${escapeHtml(friendlyLabel.toLowerCase())} sections at a glance. Click a card to dive in.</span>`
      + (isCustom && isAdminMode ? `<div style="margin-top:10px"><button class="btn btn-secondary" onclick="openEditCategoryModal('${escJsAttr(catId)}')">⚙ Rename / Delete Category</button></div>` : '');

    let cards = sectionsArr.map(sec => {
      const childCount = entriesInSection(sec.num, catId).length;
      const descText = stripHtml(sec.description || '');
      const excerpt = descText.length > 130 ? descText.substring(0, 130) + '…' : descText;
      return `<div class="section-card" onclick="showSection('${escJsAttr(sec.num)}','${escJsAttr(catId)}')">
        <div class="section-card-id">
          <span class="section-card-num">${escapeHtml(sec.num)}</span>
          <span class="section-card-entries">${childCount} ${childCount === 1 ? 'entry' : 'entries'}</span>
        </div>
        <div class="section-card-title">${escapeHtml(sec.title)}</div>
        ${excerpt ? `<div style="font-size:12px;color:var(--mid);margin-top:6px;line-height:1.45">${escapeHtml(excerpt)}</div>` : ''}
        ${isAdminMode ? `<div class="section-card-actions"><button onclick="event.stopPropagation();openSectionEditor('${escJsAttr(sec.num)}','${escJsAttr(catId)}')" title="Edit">✎</button></div>` : ''}
      </div>`;
    }).join('');
    if (sectionsArr.length === 0) {
      cards = `<div style="grid-column:1/-1;text-align:center;color:var(--mid);padding:30px 0;font-style:italic">No ${escapeHtml(friendlyLabel.toLowerCase())} sections yet.</div>`;
    }
    if (isAdminMode) {
      cards += `<div class="add-card" onclick="openNewSectionEditor('${escJsAttr(catId)}')">＋ Add ${escapeHtml(friendlyLabel === 'Projects' ? 'Project' : 'Section')}</div>`;
    }
    grid.innerHTML = cards;
  } else if (catType === 'links') {
    // Quick Links — show each link as a card
    const sec = SIDEBAR_CFG.find(s => s.id === catId);
    if (!sec) { showHome(); return; }
    const qlLabel = getCategoryLabel(catId);
    labelEl.textContent = qlLabel;
    titleEl.textContent = `${qlLabel} — Overview`;
    descEl.innerHTML = `<span style="color:var(--mid)">All quick links at a glance. Click a card to open the link.</span>`;

    const items = sec.items.filter(i => i && i.id && (i.visible || isAdminMode));
    let cards = items.map(item => {
      const isPlaceholder = !item.href;
      const onclick = item.href
        ? `window.open('${escJsAttr(item.href)}', '_blank', 'noopener')`
        : '';
      return `<div class="section-card${isPlaceholder?' add-card':''}" ${onclick?`onclick="${onclick}"`:''} style="${isPlaceholder?'cursor:default':''}">
        <div class="section-card-id">${isPlaceholder ? 'placeholder' : '🔗 link'}</div>
        <div class="section-card-title">${escapeHtml(item.text)}</div>
        ${item.href ? `<div style="font-size:11px;color:var(--mid);margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(item.href)}</div>` : ''}
        ${isAdminMode ? `<div class="section-card-actions"><button onclick="event.stopPropagation();openSIEditor('${escJsAttr(catId)}','${escJsAttr(item.id)}')" title="Edit">✎</button></div>` : ''}
      </div>`;
    }).join('');
    if (items.length === 0) {
      cards = `<div style="grid-column:1/-1;text-align:center;color:var(--mid);padding:30px 0;font-style:italic">No links yet.</div>`;
    }
    if (isAdminMode) {
      cards += `<div class="add-card" onclick="openNewSIEditor('${escJsAttr(catId)}')">＋ Add Link</div>`;
    }
    grid.innerHTML = cards;
  }

  setView('category');
  updateBreadcrumb();
  renderSidebar();
}

function lookupCustomCategoryLabel(catId) {
  if (typeof CUSTOM_CATEGORIES === 'undefined' || !Array.isArray(CUSTOM_CATEGORIES)) return null;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === catId);
  return cc ? cc.label : null;
}
