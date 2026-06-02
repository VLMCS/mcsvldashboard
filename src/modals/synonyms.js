/* ══════════════════════════════════════════════════════════════
   SYNONYMS EDITOR (admin)  (extracted from app.js, PR-17). Edit the
   search synonym groups. Global; loaded before app.js; uses
   SYNONYMS/_synWorking/DEFAULT_SYNONYMS + saveSynonymsOnly cross-file.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   SYNONYMS EDITOR (admin)
   ══════════════════════════════════════════ */
let _synWorking = [];

function openSynonymsEditor() {
  _synWorking = JSON.parse(JSON.stringify(SYNONYMS));
  renderSynGroups();
  document.getElementById('syn-modal-overlay').classList.add('open');
}
function closeSynModal() { document.getElementById('syn-modal-overlay').classList.remove('open'); }
function maybeCloseSyn(e) { if (_shouldCloseOverlay(e, 'syn-modal-overlay')) closeSynModal(); }

function renderSynGroups() {
  const list = document.getElementById('syn-groups-list');
  list.innerHTML = _synWorking.map((group, i) => `
    <div class="syn-group-row">
      <textarea class="syn-group-input" rows="1" oninput="updateSynGroup(${i}, this.value)"
        placeholder="comma-separated, terms, here">${escapeHtml(Array.isArray(group) ? group.join(', ') : '')}</textarea>
      <button class="syn-del-btn" onclick="removeSynGroup(${i})" title="Delete group">✕</button>
    </div>
  `).join('');
}
function updateSynGroup(i, value) {
  _synWorking[i] = value.split(',').map(s => s.trim()).filter(Boolean);
}
function addSynGroup() {
  _synWorking.push([]);
  renderSynGroups();
  // Focus the last input
  setTimeout(() => {
    const inputs = document.querySelectorAll('.syn-group-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 30);
}
function removeSynGroup(i) {
  _synWorking.splice(i, 1);
  renderSynGroups();
}
function saveSynonyms() {
  SYNONYMS = _synWorking.filter(g => Array.isArray(g) && g.length > 0);
  saveSynonymsOnly();
  closeSynModal();
}
async function resetSynonymsToDefault() {
  if (!await customConfirm('Reset all synonyms to defaults? Your custom groups will be lost.', { danger: true, confirmLabel: 'Reset synonyms' })) return;
  _synWorking = JSON.parse(JSON.stringify(DEFAULT_SYNONYMS));
  renderSynGroups();
}
