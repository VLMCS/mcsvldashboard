/* ══════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS  (extracted from app.js, PR-12). Global;
   loaded before app.js. Registers the global keydown handler
   (Esc to close modals, / to open search, lightbox zoom keys);
   calls close/openSearchModal + lightbox fns cross-file.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   KEYBOARD
   ══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  // Lightbox first
  if (document.getElementById('lightbox-overlay').classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === '+' || e.key === '=') zoomLightbox(0.25);
    else if (e.key === '-' || e.key === '_') zoomLightbox(-0.25);
    else if (e.key === '0') resetLightboxZoom();
    return;
  }

  if (e.key === 'Escape') {
    for (const id of ['new-pk-overlay','pk-modal-overlay','kpi-overlay','tm-detail-overlay','team-modal-overlay','syn-modal-overlay','settings-modal-overlay','entry-modal-overlay','section-modal-overlay','si-modal-overlay','ann-modal-overlay','pwd-modal-overlay','cat-modal-overlay']) {
      const m = document.getElementById(id);
      if (m && m.classList.contains('open')) { m.classList.remove('open'); return; }
    }
    if (document.getElementById('search-modal-overlay').classList.contains('open')) { closeSearchModal(); return; }
  }
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    e.preventDefault();
    openSearchModal();
  }
});
