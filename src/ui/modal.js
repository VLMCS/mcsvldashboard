/* ══════════════════════════════════════════════════════════════
   MODAL INFRASTRUCTURE  (extracted from app.js, PR-20)
   Modal drag-out guard (_shouldCloseOverlay, used by every modal's
   maybeClose*), the promise-based custom alert/confirm/prompt, and
   the window.alert override. Global; loaded before app.js so these
   exist when other modules call them at runtime.
   ══════════════════════════════════════════════════════════════ */

/* ── MODAL DRAG-OUT GUARD ──
   When you mousedown inside a text input and accidentally drag outside the modal,
   the browser fires `click` on the overlay (the closest common ancestor) which used
   to close the modal and discard your input. We track where mousedown happened and
   only close if BOTH mousedown AND mouseup happened on the overlay itself.
*/
let _overlayMdTarget = null;
document.addEventListener('mousedown', (e) => {
  const t = e.target;
  // Mousedown is "on the overlay" only when the target IS the overlay element itself
  if (t && t.classList && (
    t.classList.contains('admin-modal-overlay') ||
    t.id === 'search-modal-overlay' ||
    t.id === 'lightbox-overlay' ||
    t.id === 'team-modal-overlay' ||
    t.id === 'tm-detail-overlay'
  )) {
    _overlayMdTarget = t.id;
  } else {
    _overlayMdTarget = null;
  }
}, true);

function _shouldCloseOverlay(e, overlayId) {
  // Click target AND prior mousedown target must both be the overlay itself.
  return _overlayMdTarget === overlayId && e.target.id === overlayId;
}

/* ══════════════════════════════════════════
   CUSTOM ALERT / CONFIRM / PROMPT
   Drop-in replacements for window.alert / confirm / prompt with the dashboard's
   own styling. Promise-based so callers do `await customConfirm(...)` instead
   of relying on synchronous browser dialogs. window.alert is overridden below
   so existing fire-and-forget alert() callers continue to work unchanged.
   ══════════════════════════════════════════ */
let _customModalResolver = null;     // active Promise resolve fn
let _customModalKeyHandler = null;   // active document keydown handler

function _customModalResolve(value) {
  // Centralized close: resolves the active Promise with `value`, hides the
  // overlay, and tears down the keyboard handler. value semantics differ per
  // helper — alert always resolves true (no cancel button), confirm resolves
  // true or false, prompt resolves the typed string or null (cancelled).
  const overlay = document.getElementById('custom-modal-overlay');
  const inputEl = document.getElementById('custom-modal-input');
  let resolved = value;
  // Prompt → string-or-null. Anything else → boolean.
  if (overlay && overlay.dataset.kind === 'prompt') {
    if (value === true)       resolved = inputEl ? inputEl.value : '';
    else if (value === null)  resolved = null;
    else                      resolved = value;
  } else {
    resolved = (value === true);
  }
  if (overlay) {
    overlay.classList.remove('open');
    overlay.dataset.kind = '';
  }
  if (_customModalKeyHandler) {
    document.removeEventListener('keydown', _customModalKeyHandler, true);
    _customModalKeyHandler = null;
  }
  const resolver = _customModalResolver;
  _customModalResolver = null;
  if (resolver) resolver(resolved);
}

function _customModalBackdropClick(e) {
  // Treat backdrop-click as cancel only when the click started AND ended on
  // the overlay element (so dragging text inside the modal body doesn't
  // accidentally dismiss). Reuses the same _overlayMdTarget machinery as the
  // other overlays via _shouldCloseOverlay().
  if (_shouldCloseOverlay(e, 'custom-modal-overlay')) _customModalResolve(null);
}

function _openCustomModal(opts) {
  // Resolve any pre-existing modal first so we don't strand a Promise.
  if (_customModalResolver) _customModalResolve(null);
  return new Promise(resolve => {
    _customModalResolver = resolve;
    const overlay   = document.getElementById('custom-modal-overlay');
    const titleEl   = document.getElementById('custom-modal-title');
    const bodyEl    = document.getElementById('custom-modal-message');
    const inputEl   = document.getElementById('custom-modal-input');
    const okBtn     = document.getElementById('custom-modal-ok');
    const cancelBtn = document.getElementById('custom-modal-cancel');

    const kind = opts.kind || 'confirm';   // 'alert' | 'confirm' | 'prompt'
    overlay.dataset.kind = kind;

    // Title — defaults vary by kind. Plain text only.
    const defaultTitle = kind === 'alert' ? 'Notice'
                       : kind === 'prompt' ? 'Enter a value'
                       : 'Confirm';
    titleEl.textContent = opts.title || defaultTitle;

    // Message body. Allow HTML when caller explicitly opts in (e.g. for bold).
    if (opts.html) {
      bodyEl.innerHTML = opts.html;
    } else {
      bodyEl.textContent = opts.message || '';
    }

    // Input field — only visible for prompt.
    if (kind === 'prompt') {
      inputEl.style.display = '';
      inputEl.value = opts.defaultValue != null ? String(opts.defaultValue) : '';
      inputEl.placeholder = opts.placeholder || '';
    } else {
      inputEl.style.display = 'none';
      inputEl.value = '';
    }

    // Buttons — alert is single-button (no Cancel).
    cancelBtn.style.display = kind === 'alert' ? 'none' : '';
    cancelBtn.textContent   = opts.cancelLabel || 'Cancel';
    okBtn.textContent       = opts.confirmLabel || (kind === 'alert' ? 'OK' : kind === 'prompt' ? 'Submit' : 'Confirm');

    // Visual hint for destructive actions — switches OK to red.
    okBtn.classList.remove('btn-primary', 'btn-danger');
    okBtn.classList.add(opts.danger ? 'btn-danger' : 'btn-primary');

    overlay.classList.add('open');
    setTimeout(() => {
      if (kind === 'prompt') { inputEl.focus(); inputEl.select(); }
      else                   { okBtn.focus(); }
    }, 60);

    // Keyboard shortcuts. Use capture phase so we beat the global Esc handler
    // that would otherwise close the next-modal-in-the-list and leave ours up.
    _customModalKeyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        _customModalResolve(null);
      } else if (e.key === 'Enter' && kind !== 'prompt') {
        // Prompt has its own Enter handler on the input itself.
        if (e.target && e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        _customModalResolve(true);
      }
    };
    document.addEventListener('keydown', _customModalKeyHandler, true);
  });
}

// Public API. Always returns a Promise. Callers can pass either a plain
// message string or an options object as the second arg.
function customAlert(message, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'alert', message: String(message ?? '') });
}
function customConfirm(message, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'confirm', message: String(message ?? '') });
}
function customPrompt(message, defaultValue, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'prompt', message: String(message ?? ''), defaultValue: defaultValue ?? '' });
}

// window.alert override: existing call sites in the dashboard are
// fire-and-forget (they don't read alert()'s return), so we can replace the
// browser dialog with our custom modal transparently. We do NOT override
// window.confirm / window.prompt because those are synchronous and return
// values — replacing them with async Promises would break callers. Those
// call sites are refactored explicitly to use customConfirm / customPrompt.
const _origWindowAlert = window.alert ? window.alert.bind(window) : null;
window.alert = function(msg) {
  try { customAlert(msg); }
  catch(e) { if (_origWindowAlert) _origWindowAlert(msg); }
};
