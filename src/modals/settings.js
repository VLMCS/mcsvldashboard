/* ══════════════════════════════════════════════════════════════
   SITE SETTINGS (admin)  (extracted from app.js, PR-18). Settings
   modal (names, search toggles, favicon upload, theme) + applyTheme/
   applyFavicon. Global; loaded before app.js; applyAllSettings (in
   app.js) calls applyTheme/applyFavicon cross-file at boot.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   SITE SETTINGS (admin)
   ══════════════════════════════════════════ */
function openSiteSettings() {
  if (!isAdminMode) return;
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  document.getElementById('set-siteName').value        = s.siteName        || '';
  document.getElementById('set-studioName').value      = s.studioName      || '';
  document.getElementById('set-departmentName').value  = s.departmentName  || '';
  document.getElementById('set-heroSub').value         = s.heroSub         || '';
  document.getElementById('set-kwSearch').checked      = s.keywordSearchEnabled !== false;
  document.getElementById('set-aiSearch').checked      = s.aiSearchEnabled      !== false;
  // Live warning when both toggles are off
  const updateBothOffWarning = () => {
    const kw = document.getElementById('set-kwSearch').checked;
    const ai = document.getElementById('set-aiSearch').checked;
    document.getElementById('search-both-off-warning').style.display = (!kw && !ai) ? 'block' : 'none';
  };
  document.getElementById('set-kwSearch').onchange = updateBothOffWarning;
  document.getElementById('set-aiSearch').onchange = updateBothOffWarning;
  updateBothOffWarning();

  // Favicon preview + clear button
  _settingsFaviconDraft = s.favicon || '';
  _renderFaviconPreview();

  // Theme color pickers
  const t = (s.theme && s.theme.light) ? s.theme : DEFAULT_SITE_SETTINGS.theme;
  document.getElementById('theme-light-accent').value  = t.light.accent;
  document.getElementById('theme-light-bg').value      = t.light.bg;
  document.getElementById('theme-light-text').value    = t.light.text;
  document.getElementById('theme-light-sidebar').value = t.light.sidebarBg;
  document.getElementById('theme-dark-accent').value   = t.dark.accent;
  document.getElementById('theme-dark-bg').value       = t.dark.bg;
  document.getElementById('theme-dark-text').value     = t.dark.text;
  document.getElementById('theme-dark-sidebar').value  = t.dark.sidebarBg;

  // Live preview on color change
  _settingsThemeDraft = JSON.parse(JSON.stringify(t));
  ['theme-light-accent','theme-light-bg','theme-light-text','theme-light-sidebar',
   'theme-dark-accent','theme-dark-bg','theme-dark-text','theme-dark-sidebar'
  ].forEach(id => {
    const el = document.getElementById(id);
    el.oninput = () => {
      const mode = id.indexOf('light') > -1 ? 'light' : 'dark';
      const key  = id.split('-').pop(); // accent / bg / text / sidebar
      const slot = key === 'sidebar' ? 'sidebarBg' : key;
      _settingsThemeDraft[mode][slot] = el.value;
      applyTheme(_settingsThemeDraft);
    };
  });

  document.getElementById('settings-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('set-siteName').focus(), 60);
}
function closeSettingsModal() {
  document.getElementById('settings-modal-overlay').classList.remove('open');
  // Revert any live preview to what's actually saved
  applyTheme(SITE_SETTINGS.theme);
  _settingsFaviconDraft = null;
  _settingsThemeDraft = null;
}
function maybeCloseSettings(e) { if (_shouldCloseOverlay(e, 'settings-modal-overlay')) closeSettingsModal(); }

let _settingsFaviconDraft = null;
let _settingsThemeDraft = null;

function saveSiteSettings() {
  const wasAiOn = SITE_SETTINGS && SITE_SETTINGS.aiSearchEnabled !== false;
  const aiOn = document.getElementById('set-aiSearch').checked;
  const kwOn = document.getElementById('set-kwSearch').checked;
  const next = Object.assign({}, SITE_SETTINGS, {
    siteName:        document.getElementById('set-siteName').value.trim()        || DEFAULT_SITE_SETTINGS.siteName,
    studioName:      document.getElementById('set-studioName').value.trim()      || DEFAULT_SITE_SETTINGS.studioName,
    departmentName:  document.getElementById('set-departmentName').value.trim()  || DEFAULT_SITE_SETTINGS.departmentName,
    heroSub:         document.getElementById('set-heroSub').value.trim()         || DEFAULT_SITE_SETTINGS.heroSub,
    keywordSearchEnabled: kwOn,
    aiSearchEnabled:      aiOn,
    favicon:         _settingsFaviconDraft != null ? _settingsFaviconDraft : (SITE_SETTINGS.favicon || ''),
    theme:           _settingsThemeDraft || SITE_SETTINGS.theme || DEFAULT_SITE_SETTINGS.theme
  });
  SITE_SETTINGS = next;
  // If AI search was just enabled, start indexing in the background.
  if (!wasAiOn && aiOn) setTimeout(() => runBackfillEmbeddings(), 300);
  // Close before calling functions that might trigger renders
  document.getElementById('settings-modal-overlay').classList.remove('open');
  saveAll('Site settings saved');
  applyAllSettings();
  renderSidebar();
  updateBreadcrumb();
  if (currentView === 'category' && currentCategoryId) showCategoryOverview(currentCategoryId, currentCategoryType);
}
async function resetSiteSettings() {
  if (!await customConfirm('Reset all site settings (including theme + favicon) to defaults? Your customizations will be lost.', { danger: true, confirmLabel: 'Reset' })) return;
  SITE_SETTINGS = clone(DEFAULT_SITE_SETTINGS);
  closeSettingsModal();
  saveAll('Reset to defaults');
  applyAllSettings();
  renderSidebar();
  // Reopen with refreshed values
  setTimeout(openSiteSettings, 30);
}

// ── Favicon upload ──
function uploadFavicon() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.ico,image/x-icon,image/vnd.microsoft.icon';
  inp.onchange = ev => {
    const file = ev.target.files[0];
    if (!file) return;
    const isIco = /\.ico$/i.test(file.name) || file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon';
    if (!isIco) {
      alert('Please upload a .ico file (standard favicon format).');
      return;
    }
    if (file.size > FAVICON_MAX_BYTES) {
      alert(`Favicon is too large (${(file.size/1024).toFixed(1)} KB). Maximum ${FAVICON_MAX_BYTES/1024} KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      _settingsFaviconDraft = e.target.result;
      _renderFaviconPreview();
      applyFavicon(_settingsFaviconDraft); // live preview
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}
function clearFavicon() {
  _settingsFaviconDraft = '';
  _renderFaviconPreview();
  applyFavicon('');
}
function _renderFaviconPreview() {
  const wrap = document.getElementById('favicon-preview');
  const clearBtn = document.getElementById('favicon-clear-btn');
  if (!wrap) return;
  const url = _settingsFaviconDraft != null ? _settingsFaviconDraft : (SITE_SETTINGS.favicon || '');
  if (url) {
    wrap.innerHTML = `<img src="${escAttr(url)}" alt="favicon" style="width:32px;height:32px;object-fit:contain">`;
    if (clearBtn) clearBtn.style.display = '';
  } else {
    wrap.innerHTML = `<span style="color:var(--mid);font-size:10px">none</span>`;
    if (clearBtn) clearBtn.style.display = 'none';
  }
}

// ── Inline category rename (admin only) ──
async function renameCategoryInline(catId) {
  if (!isAdminMode) return;
  const currentLabel = getCategoryLabel(catId);
  const next = await customPrompt(`Rename "${currentLabel}" to:`, currentLabel, {
    title: 'Rename category', placeholder: 'New name', confirmLabel: 'Rename'
  });
  if (next === null) return;
  const trimmed = next.trim();
  if (!trimmed) { alert('Category name cannot be empty.'); return; }
  if (catId === 'handbook')        SITE_SETTINGS.handbookLabel = trimmed;
  else if (catId === 'projects')   SITE_SETTINGS.projectsLabel = trimmed;
  else if (catId === 'quicklinks') SITE_SETTINGS.quicklinksLabel = trimmed;
  else {
    const cc = (CUSTOM_CATEGORIES || []).find(c => c.id === catId);
    if (cc) cc.label = trimmed;
    else { alert('Unknown category.'); return; }
  }
  saveAll('Category renamed');
  applyAllSettings();
  renderSidebar();
  updateBreadcrumb();
  if (currentView === 'category' && currentCategoryId === catId) showCategoryOverview(catId, currentCategoryType);
}

// ── Favicon application ──
function applyFavicon(dataUrl) {
  const url = (dataUrl == null) ? (SITE_SETTINGS.favicon || '') : dataUrl;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (url) { link.type = 'image/x-icon'; link.href = url; }
  else { link.removeAttribute('href'); }
}

// ── Theme application ──
// Injects a <style id="theme-overrides"> block that overrides CSS variables.
function applyTheme(theme) {
  const t = theme || SITE_SETTINGS.theme || DEFAULT_SITE_SETTINGS.theme;
  const l = t.light || DEFAULT_SITE_SETTINGS.theme.light;
  const d = t.dark  || DEFAULT_SITE_SETTINGS.theme.dark;
  const css = `
:root {
  --admin-accent: ${l.accent};
  --white: ${l.bg};
  --black: ${l.text};
  --bg-sidebar: ${l.sidebarBg};
}
body.dark {
  --admin-accent: ${d.accent};
  --white: ${d.bg};
  --black: ${d.text};
  --bg-sidebar: ${d.sidebarBg};
}
  `;
  let styleEl = document.getElementById('theme-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-overrides';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}
