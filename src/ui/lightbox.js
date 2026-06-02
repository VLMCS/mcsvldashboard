/* ══════════════════════════════════════════════════════════════
   IMAGE LIGHTBOX  (extracted from app.js, PR-12). Global; loaded
   before app.js. Registers a delegated click listener for entry
   images; openLightbox/zoom referenced cross-file by the keyboard
   handler. ══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   IMAGE LIGHTBOX
   ══════════════════════════════════════════ */
function openLightbox(src) {
  lightboxZoom = 1;
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.style.transform = 'scale(1)';
  document.getElementById('lightbox-zoom-label').textContent = '100%';
  document.getElementById('lightbox-overlay').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.getElementById('lightbox-img').src = '';
}
function maybeCloseLightbox(e) {
  if (e.target.id === 'lightbox-overlay' || e.target.id === 'lightbox-stage') closeLightbox();
}
function zoomLightbox(d) {
  lightboxZoom = Math.min(4, Math.max(0.25, lightboxZoom + d));
  document.getElementById('lightbox-img').style.transform = `scale(${lightboxZoom})`;
  document.getElementById('lightbox-zoom-label').textContent = Math.round(lightboxZoom * 100) + '%';
}
function resetLightboxZoom() { zoomLightbox(1 - lightboxZoom); }

// Delegated image click for lightbox
document.addEventListener('click', e => {
  const t = e.target;
  if (t.tagName !== 'IMG') return;
  // Skip toolbar/UI images
  if (t.closest('.rt-toolbar') || t.closest('.icon-btn') || t.closest('#lightbox-overlay')) return;
  // Trigger lightbox for content images
  if (t.closest('.entry-content') || t.closest('.dv-entry-content') || t.classList.contains('entry-img')) {
    openLightbox(t.src);
  }
});
