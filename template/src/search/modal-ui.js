/* ══════════════════════════════════════════════════════════════
   SEARCH MODAL UI  (extracted from app.js, PR-20). The search
   overlay: performSearchModal (calls search() in search/engine.js),
   renderSearchResults, result cards, runHomeSearch, chip. Global;
   loaded before app.js; cross-file calls resolve at runtime.
   ══════════════════════════════════════════════════════════════ */

function maybeCloseSearchModal(e) { if (_shouldCloseOverlay(e, 'search-modal-overlay')) closeSearchModal(); }

async function performSearchModal() {
  const q = document.getElementById('search-modal-input').value.trim();
  const list = document.getElementById('results-list');
  const count = document.getElementById('results-count');
  if (!q) { list.innerHTML = ''; count.textContent = ''; return; }
  // First-ever semantic search downloads ~25MB of model — give the user a hint so the wait isn't silent.
  if (aiSearchOn() && !EMBEDDER && !EMBEDDER_FAILED) {
    count.textContent = 'Loading AI model (one-time, ~25MB)…';
    list.innerHTML = '';
  }
  const results = await search(q);
  renderSearchResults(q, results);
}

function runHomeSearch() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) return;
  openSearchModal(q);
}

function chip(q) { openSearchModal(q); }

function renderSearchResults(query, results) {
  const list = document.getElementById('results-list');
  const count = document.getElementById('results-count');

  if (!results.length) {
    count.textContent = '';
    list.innerHTML = `<div class="no-results">No handbook sections matched "<strong>${escapeHtml(query)}</strong>".<br>Try different keywords.</div>`;
    return;
  }

  const tokens = tokenize(query);
  count.textContent = `${results.length} match${results.length !== 1 ? 'es' : ''} found`;

  const top = results.slice(0, 3);
  const others = results.slice(3);

  let html = `<div class="search-segment-label"><span>★ Best Matches</span><span class="segment-line"></span></div>`;
  html += top.map(e => resultCardHtml(e, tokens)).join('');

  if (others.length) {
    html += `<button class="others-toggle" onclick="toggleOthers()">▼ Show ${others.length} other result${others.length !== 1 ? 's' : ''} that could be relevant</button>`;
    html += `<div id="others-section" style="display:none">
      <div class="search-segment-label" style="margin-top:14px"><span>Other Results That Could Be Relevant</span><span class="segment-line"></span></div>
      ${others.map(e => resultCardHtml(e, tokens)).join('')}
    </div>`;
  }

  list.innerHTML = html;
}

function toggleOthers() {
  const sec = document.getElementById('others-section');
  const btn = document.querySelector('.others-toggle');
  const open = sec.style.display !== 'none';
  sec.style.display = open ? 'none' : 'block';
  btn.textContent = open
    ? btn.textContent.replace('▲ Hide', '▼ Show').replace('other results', 'other results that could be relevant')
    : btn.textContent.replace('▼ Show', '▲ Hide').replace(' that could be relevant', '');
}

function resultCardHtml(entry, tokens) {
  const idDisplay = entry.id;
  const base = entry.__base || 'handbook';
  let baseLabel = getCategoryLabel(base).toUpperCase();
  // The original query the user typed (re-derived from the search input
  // so we don't have to thread it through every call site). Used to
  // briefly highlight the matched keywords inside the opened entry.
  const _q = (document.getElementById('search-modal-input') || {}).value || '';
  const qAttr = escJsAttr(_q);  // embedded inside an onclick="...showEntry('…','…','${qAttr}')" JS string — must use the JS-string-safe encoder so apostrophes & other special chars in the user's query don't break the handler

  // Quick-Link result — opens the URL (or shows a "coming soon" note if no URL yet)
  if (entry.__link) {
    const action = entry.href
      ? `<button class="result-go-btn" onclick="closeSearchModal();window.open('${escJsAttr(entry.href)}','_blank','noopener')">Open link ↗</button>`
      : `<span style="font-size:11px;color:var(--mid);font-style:italic">no link yet</span>`;
    return `<div class="result-card">
      <div class="result-card-header">
        <span class="result-section-id">🔗 ${escapeHtml(baseLabel)}</span>
        <span class="result-section-title">${escapeHtml(entry.title)}</span>
        ${action}
      </div>
    </div>`;
  }

  if (entry.__section) {
    return `<div class="result-card">
      <div class="result-card-header">
        <span class="result-section-id">${escapeHtml(baseLabel)} · ${escapeHtml(idDisplay)}</span>
        <span class="result-section-title">${escapeHtml(entry.title)}</span>
        <button class="result-go-btn" onclick="closeSearchModal();showSection('${escJsAttr(entry.num)}','${escJsAttr(base)}')">Open ${base==='projects'?'project':'section'} →</button>
      </div>
    </div>`;
  }
  return `<div class="result-card">
    <div class="result-card-header">
      <span class="result-section-id">${escapeHtml(baseLabel)} · ${escapeHtml(idDisplay)}</span>
      <span class="result-section-title">${escapeHtml(entry.title)}</span>
      <button class="result-edit-btn" onclick="event.stopPropagation();openEntryEditor('${escJsAttr(entry.id)}','${escJsAttr(base)}')">✎ Edit</button>
      <button class="result-go-btn" onclick="closeSearchModal();showEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}','${qAttr}')">Open →</button>
    </div>
  </div>`;
}
