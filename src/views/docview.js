/* ══════════════════════════════════════════════════════════════
   DOCUMENTATION VIEW  (extracted from app.js, PR-14). The admin
   read-through doc view + its inline entry/section edit/create.
   Global; loaded before app.js; cross-file calls resolve at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   DOCUMENTATION VIEW
   ══════════════════════════════════════════ */
function showDocView() {
  pauseInlineVideos();
  if (!isAdminMode) { showToast('Documentation View requires Admin Mode.'); return; }
  setView('docview'); updateBreadcrumb(); renderDocView();
}

function dvSetBase(base) {
  docViewBase = base;
  renderDocView();
}

function renderDocView() {
  const outline = document.getElementById('docview-outline');
  const content = document.getElementById('docview-content');
  const base = docViewBase || 'handbook';
  const sectionsArr = sectionsOf(base);
  let baseLabel = getCategoryLabel(base);
  let itemLabel = base === 'projects' ? 'Project' : 'Section';

  // Outline with base tabs for ALL kb categories
  let tabsHtml = `<button class="dv-tab${base==='handbook'?' active':''}" onclick="dvSetBase('handbook')">📘 ${escapeHtml(getCategoryLabel('handbook'))}</button>
    <button class="dv-tab${base==='projects'?' active':''}" onclick="dvSetBase('projects')">🗂 ${escapeHtml(getCategoryLabel('projects'))}</button>`;
  for (const cc of (CUSTOM_CATEGORIES || [])) {
    if (!cc || !cc.id) continue;
    tabsHtml += `<button class="dv-tab${base===cc.id?' active':''}" onclick="dvSetBase('${escJsAttr(cc.id)}')">📂 ${escapeHtml(cc.label)}</button>`;
  }
  let oh = `<div class="dv-outline-heading">Outline</div>
    <div class="dv-base-toggle" style="flex-wrap:wrap">
      ${tabsHtml}
    </div>`;
  if (sectionsArr.length === 0) {
    oh += `<div style="font-size:12px;color:var(--mid);font-style:italic;padding:8px 0">No ${baseLabel.toLowerCase()} yet.</div>`;
  }
  for (const sec of sectionsArr) {
    oh += `<div class="dv-out-parent" onclick="document.getElementById('dv-sec-${escAttr(base)}-${escAttr(sec.num)}').scrollIntoView({behavior:'smooth',block:'start'})">
      ${escapeHtml(sec.num + '. ' + sec.title)}
    </div>`;
    const entries = entriesTreeOrder(sec.num, base);
    if (entries.length) {
      oh += `<div class="dv-out-children">`;
      for (const e of entries) {
        const ind = entryDepthBelowSection(e.id) * 12;
        oh += `<div class="dv-out-child" style="padding-left:${6 + ind}px" onclick="document.getElementById('dv-en-${escAttr(base)}-${escAttr(e.id)}').scrollIntoView({behavior:'smooth',block:'start'})">${escapeHtml(e.id + ' ' + e.title)}</div>`;
      }
      oh += `</div>`;
    }
  }
  outline.innerHTML = oh;

  // Content
  let ch = `<div class="dv-title-bar">
    <div>
      <div class="dv-title">VL ${escapeHtml(baseLabel)} — Documentation View</div>
      <div class="dv-title-meta">Edit any entry inline. Changes save when you click "Save".</div>
    </div>
    <button class="btn btn-admin" onclick="dvNewSectionInline('${escJsAttr(base)}')">＋ New ${escapeHtml(itemLabel)}</button>
  </div>`;

  if (sectionsArr.length === 0) {
    ch += `<div style="padding:40px 20px;text-align:center;color:var(--mid)">
      <div style="font-size:36px;margin-bottom:8px;opacity:0.5">🗂</div>
      <div>No ${baseLabel.toLowerCase()} yet — click <strong>＋ New ${escapeHtml(itemLabel)}</strong> above to add one.</div>
    </div>`;
  }

  for (const sec of sectionsArr) {
    ch += `<div class="dv-section" id="dv-sec-${escAttr(base)}-${escAttr(sec.num)}">
      <div class="dv-section-header">
        <span class="dv-section-num">${escapeHtml(itemLabel.toUpperCase())} ${escapeHtml(sec.num)}</span>
        <span class="dv-section-title">${escapeHtml(sec.title)}</span>
        <button class="dv-entry-edit-btn" onclick="dvEditSectionInline('${escJsAttr(sec.num)}','${escJsAttr(base)}')">⚙ Edit</button>
      </div>
      <div class="dv-section-body">
        <div class="dv-section-desc">${sec.description || '<em style="color:var(--mid)">(no description)</em>'}</div>`;
    const entries = entriesTreeOrder(sec.num, base);
    for (const e of entries) {
      const ind = entryDepthBelowSection(e.id) * 22;
      ch += `<div class="dv-entry" id="dv-en-${escAttr(base)}-${escAttr(e.id)}" data-entry-id="${escAttr(e.id)}" data-base="${escAttr(base)}" style="margin-left:${ind}px${ind?';border-left:2px solid var(--border);padding-left:14px':''}">
        <div class="dv-entry-head">
          <span class="dv-entry-num">${escapeHtml(e.id)}</span>
          <span class="dv-entry-title">${escapeHtml(e.title)}</span>
          <div class="dv-entry-actions">
            <button class="dv-entry-edit-btn" onclick="dvNewSubInline('${escJsAttr(e.id)}','${escJsAttr(base)}')" title="Add a sub-entry under this">＋ Sub</button>
            <button class="dv-entry-edit-btn" onclick="dvEditEntryInline('${escJsAttr(e.id)}','${escJsAttr(base)}')">✎ Edit</button>
          </div>
        </div>
        <div class="dv-entry-content" id="dv-content-${escAttr(base)}-${escAttr(e.id)}">${e.content}</div>
      </div>`;
    }
    ch += `<button class="dv-add-entry-btn" onclick="dvNewEntryInline('${escJsAttr(sec.num)}','${escJsAttr(base)}')">＋ Add Entry to ${escapeHtml(itemLabel)} ${escapeHtml(sec.num)}</button>`;
    ch += `</div></div>`;
  }

  content.innerHTML = ch;
  content.querySelectorAll('.dv-entry-content img').forEach(i => i.classList.add('entry-img'));
}

/* ── Documentation-view INLINE editing & creation ──
   In doc view the editor never uses the modal: editing and creating
   entries/sections happen inline, in the content column, so the full-width
   Tiptap editor is usable. (The sidebar and other views still use the modal.)
   Saves/deletes reuse the same data helpers and globals as the modal. ── */

// Shared entry form (ID / Title / Keywords / Tiptap content + buttons).
function dvEntryFormHTML(edId, tbId, titleVal, kwVal, saveOnclick, deleteBtn) {
  return `<div class="dv-inline-form">
    <label class="form-label">Title</label>
    <input class="form-input" id="${edId}__title" value="${escAttr(titleVal)}">
    <label class="form-label">Keywords</label>
    <input class="form-input" id="${edId}__kw" value="${escAttr(kwVal)}" placeholder="comma, separated — used by the search engine">
    <label class="form-label">Content</label>
    <div class="rt-wrap"><div class="rt-toolbar" id="${tbId}"></div><div class="rt-editor" id="${edId}" data-placeholder="Write the entry content…"></div></div>
    <div class="dv-edit-controls">
      <button class="btn btn-primary" onclick="${saveOnclick}">Save</button>
      <button class="btn btn-secondary" onclick="renderDocView()">Cancel</button>
      ${deleteBtn || ''}
    </div>
  </div>`;
}

// Validate + persist an entry from an inline form. IDs are auto-assigned —
// editing keeps the existing id; a new sub-entry uses suggestChildId(parent);
// a new top-level entry gets the next free "<section>.<n>".
function _dvCommitEntry(base, edId, origId, ctxSection, ctxParent) {
  base = base || 'handbook';
  const title = document.getElementById(edId + '__title').value.trim();
  const kwRaw = document.getElementById(edId + '__kw').value.trim();
  const content = getEditorHTML(edId);
  if (!title) { alert('Title is required.'); return; }
  if (!stripHtml(content)) { alert('Entry content cannot be empty.'); return; }
  let id;
  if (origId) id = origId;
  else if (ctxParent) id = suggestChildId(ctxParent, base);
  else {
    const existing = entriesInSection(ctxSection, base).map(e => e.id);
    let n = 1; while (existing.includes(`${ctxSection}.${n}`)) n++;
    id = `${ctxSection}.${n}`;
  }
  const sec = findSection(sectionNumOf(id), base);
  if (!sec) { alert('Could not resolve the section for this entry.'); return; }
  const store = entriesOf(base);
  const keywords = kwRaw.split(',').map(k => k.trim()).filter(Boolean);
  const sectionLabel = `${sec.num}. ${sec.title}`;
  let savedEntry;
  if (origId) {
    const idx = store.findIndex(e => e.id === origId);
    if (idx === -1) { alert('Entry not found.'); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store[idx] = savedEntry;
  } else {
    if (store.some(e => e.id === id)) { alert(`An entry with ID "${id}" already exists.`); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store.push(savedEntry);
  }
  saveAll('Entry saved');
  attachEmbedding(savedEntry, base);
  renderSidebar();
  renderDocView();
}

function dvEditEntryInline(id, base) {
  base = base || 'handbook';
  const entry = findEntry(id, base); if (!entry) return;
  const sectionNum = sectionNumOf(id);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to edit handbook entries.');
    return;
  }
  const card = document.getElementById(`dv-en-${base}-${id}`); if (!card) return;
  const edId = `dvE-ed-${base}-${id}`, tbId = `dvE-tb-${base}-${id}`;
  const del = `<button class="dv-del-btn" type="button" title="Delete entry" onclick="dvDeleteEntryInline('${escJsAttr(id)}','${escJsAttr(base)}')">🗑</button>`;
  card.innerHTML = dvEntryFormHTML(edId, tbId, entry.title, (entry.keywords || []).join(', '),
    `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','${escJsAttr(id)}','','')`, del);
  initEditor(edId, tbId, entry.content);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function dvDeleteEntryInline(id, base) {
  editEntryId = id; editEntryBase = base || 'handbook'; editEntrySrcSection = sectionNumOf(id);
  deleteCurrentEntry();   // reuses the modal's delete logic (handles descendants)
}

function dvNewEntryInline(sectionNum, base) {
  base = base || 'handbook';
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to add entries.');
    return;
  }
  const secEl = document.getElementById(`dv-sec-${base}-${sectionNum}`);
  const body = secEl ? secEl.querySelector('.dv-section-body') : null;
  if (!body) return;
  const edId = `dvNE-ed-${base}-${sectionNum}`, tbId = `dvNE-tb-${base}-${sectionNum}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New entry — ID assigned automatically</div>` +
    dvEntryFormHTML(edId, tbId, '', '', `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','','${escJsAttr(sectionNum)}','')`, '') + `</div>`;
  const addBtn = body.querySelector('.dv-add-entry-btn');
  if (addBtn) addBtn.insertAdjacentHTML('beforebegin', html); else body.insertAdjacentHTML('beforeend', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function dvNewSubInline(parentId, base) {
  base = base || 'handbook';
  const sectionNum = sectionNumOf(parentId);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need edit access to add sub-entries.');
    return;
  }
  const card = document.getElementById(`dv-en-${base}-${parentId}`); if (!card) return;
  const edId = `dvNS-ed-${base}-${parentId}`, tbId = `dvNS-tb-${base}-${parentId}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New sub-entry under ${escapeHtml(parentId)} — ID assigned automatically</div>` +
    dvEntryFormHTML(edId, tbId, '', '', `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','','','${escJsAttr(parentId)}')`, '') + `</div>`;
  card.insertAdjacentHTML('afterend', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ── Section inline edit / create ── */
function dvSectionFormHTML(itemLabel, edId, tbId, titleVal, passkeyHtml, saveOnclick, deleteBtn) {
  return `<div class="dv-inline-form">
    <label class="form-label">${escapeHtml(itemLabel)} Title</label>
    <input class="form-input" id="${edId}__title" value="${escAttr(titleVal)}">
    <label class="form-label">Description</label>
    <div class="rt-wrap"><div class="rt-toolbar" id="${tbId}"></div><div class="rt-editor" id="${edId}" data-placeholder="Brief description shown on the section page…"></div></div>
    ${passkeyHtml || ''}
    <div class="dv-edit-controls">
      <button class="btn btn-primary" onclick="${saveOnclick}">Save</button>
      <button class="btn btn-secondary" onclick="renderDocView()">Cancel</button>
      ${deleteBtn || ''}
    </div>
  </div>`;
}
function _dvPasskeyHtml(edId, val) {
  return `<label class="form-label">Edit Passkey <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--mid)">(share with users who can edit this project)</span></label>
    <div style="display:flex;gap:6px">
      <input class="form-input" id="${edId}__pk" readonly value="${escAttr(val)}" style="flex:1;font-family:'Consolas','Courier New',monospace;letter-spacing:0.08em">
      <button class="btn btn-secondary" type="button" onclick="dvCopyPasskey('${escJsAttr(edId)}')">Copy</button>
      <button class="btn btn-secondary" type="button" onclick="dvRegenPasskey('${escJsAttr(edId)}')">↻ New</button>
    </div>`;
}
function dvCopyPasskey(edId) { const i = document.getElementById(edId + '__pk'); if (i && i.value) navigator.clipboard.writeText(i.value).then(() => showToast('Passkey copied')); }
async function dvRegenPasskey(edId) {
  if (!await customConfirm('Generate a new passkey? The old one will stop working for anyone using it.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  const i = document.getElementById(edId + '__pk');
  if (i) i.value = generatePasskey();
}

function dvEditSectionInline(num, base) {
  base = base || 'handbook';
  const sec = findSection(num, base); if (!sec) return;
  if (!isAdminMode && !(base === 'projects' && unlockedProjects.has(String(num)))) {
    if (base === 'projects') promptUnlockProjectSection(num);
    else alert('Admin Mode required to edit section info.');
    return;
  }
  const secEl = document.getElementById(`dv-sec-${base}-${num}`); if (!secEl) return;
  const header = secEl.querySelector('.dv-section-header'); if (!header) return;
  const descEl = secEl.querySelector('.dv-section-desc'); if (descEl) descEl.style.display = 'none';
  const itemLabel = base === 'projects' ? 'Project' : 'Section';
  const edId = `dvS-ed-${base}-${num}`, tbId = `dvS-tb-${base}-${num}`;
  let pk = '';
  if ((base === 'projects') && isAdminMode) { if (!sec.passkey) sec.passkey = generatePasskey(); pk = _dvPasskeyHtml(edId, sec.passkey); }
  const del = isAdminMode ? `<button class="dv-del-btn" type="button" title="Delete ${escapeHtml(itemLabel)}" onclick="dvDeleteSectionInline('${escJsAttr(num)}','${escJsAttr(base)}')">🗑</button>` : '';
  const form = `<div class="dv-inline-new"><div class="dv-inline-new-title">Edit ${escapeHtml(itemLabel)} ${escapeHtml(num)}</div>` +
    dvSectionFormHTML(itemLabel, edId, tbId, sec.title, pk, `dvSaveSectionInline('${escJsAttr(num)}','${escJsAttr(base)}')`, del) + `</div>`;
  header.outerHTML = form;
  initEditor(edId, tbId, sec.description || '');
}

function dvSaveSectionInline(origNum, base) {
  base = base || 'handbook';
  const edId = `dvS-ed-${base}-${origNum}`;
  const title = document.getElementById(edId + '__title').value.trim();
  const desc = getEditorHTML(edId);
  const pkInp = document.getElementById(edId + '__pk');
  const passkey = pkInp ? pkInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  const sec = findSection(origNum, base); if (!sec) return;
  // Number is auto-managed and immutable; only title/description/passkey change.
  sec.title = title; sec.description = desc;
  if (base === 'projects' && passkey) sec.passkey = passkey;
  entriesOf(base).forEach(e => { if (sectionNumOf(e.id) === origNum) e.section = `${origNum}. ${title}`; });
  saveAll('Saved');
  renderSidebar();
  renderDocView();
}

function dvDeleteSectionInline(num, base) {
  editSectionNum = num; editSectionBase = base || 'handbook';
  deleteCurrentSection();   // reuses the modal's delete logic (admin-only)
}

function dvNewSectionInline(base) {
  base = base || 'handbook';
  const content = document.getElementById('docview-content'); if (!content) return;
  const itemLabel = base === 'projects' ? 'Project' : 'Section';
  const edId = `dvNSEC-ed-${base}`, tbId = `dvNSEC-tb-${base}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
  const nextNum = nums.length ? Math.max(...nums) + 1 : 1;
  const pk = (base === 'projects' && isAdminMode) ? _dvPasskeyHtml(edId, generatePasskey()) : '';
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New ${escapeHtml(itemLabel)} — number ${nextNum} assigned automatically</div>` +
    dvSectionFormHTML(itemLabel, edId, tbId, '', pk, `dvSaveNewSectionInline('${escJsAttr(base)}')`, '') + `</div>`;
  const titleBar = content.querySelector('.dv-title-bar');
  if (titleBar) titleBar.insertAdjacentHTML('afterend', html); else content.insertAdjacentHTML('afterbegin', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function dvSaveNewSectionInline(base) {
  base = base || 'handbook';
  const edId = `dvNSEC-ed-${base}`;
  const title = document.getElementById(edId + '__title').value.trim();
  const desc = getEditorHTML(edId);
  const pkInp = document.getElementById(edId + '__pk');
  const passkey = pkInp ? pkInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  // Section number is auto-assigned (next available), never typed.
  const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
  const num = String(nums.length ? Math.max(...nums) + 1 : 1);
  const newSec = { num, title, description: desc };
  if (base === 'projects') newSec.passkey = passkey || generatePasskey();
  sectionsOf(base).push(newSec);
  saveAll('Saved');
  renderSidebar();
  renderDocView();
}
