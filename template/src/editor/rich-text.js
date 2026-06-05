/* ══════════════════════════════════════════════════════════════
   RICH TEXT EDITOR (Tiptap) + IMAGE HELPERS  (from app.js, PR-15)
   Image size limits + fileToDataUrl/resizeImage (shared with team
   avatars), the lazy Tiptap loader (offline bundle or CDN), custom
   extensions, initEditor, toolbar/tables/video-embed/image-upload
   handlers, getEditorHTML. Global; loaded before app.js; reads
   activeEditor/RT_EDITORS and calls escape/custom-modal cross-file
   at runtime. AVATAR_* consts here are used by team-directory.js.
   ══════════════════════════════════════════════════════════════ */

// Image size limits
const RT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;   // 2 MB for content images
const AVATAR_MAX_BYTES   = 1 * 1024 * 1024;   // 1 MB for avatars
const AVATAR_MAX_DIM     = 128;               // 128x128 max for avatars

// Convert a File/Blob to a data URL. If the file exceeds maxBytes (and we can't
// fix it by resizing), reject. Returns Promise<string>.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Resize an image to fit within maxDim×maxDim, preserving aspect. Returns data URL.
function resizeImage(dataUrl, maxDim, mime) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w <= maxDim && h <= maxDim) { resolve(dataUrl); return; }
      const scale = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * scale); h = Math.round(h * scale);
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // Use JPEG if input has no alpha (saves bytes); fall back to PNG
      const out = cv.toDataURL(mime === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
      resolve(out);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/* ════════════════════════════════════════════════════════════════════
   RICH TEXT EDITOR — Tiptap (ProseMirror) engine.
   Real undo/redo history and clean semantic-HTML output that renders in the
   read-only views with no editor runtime. Modules load lazily via loadTiptap().
   ════════════════════════════════════════════════════════════════════ */
const RT_EDITORS = {};
const TIPTAP_VERSION = '2.11.5';
const RT_HL_SWATCHES = [
  { c:'#fff176', t:'Yellow' }, { c:'#aed581', t:'Green' },
  { c:'#80deea', t:'Blue' }, { c:'#f48fb1', t:'Pink' }, { c:'#ffb74d', t:'Orange' }
];
const RT_TT_NAMES = ['core','starter-kit','extension-underline','extension-highlight',
  'extension-link','extension-superscript','extension-subscript','extension-text-align',
  'extension-image','extension-task-list','extension-task-item','extension-placeholder',
  'extension-table','extension-table-row','extension-table-header','extension-table-cell'];
let _tiptapPromise = null;
let _ttImportMapDone = false;

// When the vendored offline bundle is present, register each module as a blob
// URL via an import map under the `tiptapmod:<id>` scheme, so the editor loads
// with zero network (works even from file://).
function _setupOfflineImportMap(bundle) {
  if (_ttImportMapDone) return;
  _ttImportMapDone = true;
  const map = { imports: {} };
  bundle.modules.forEach((code, i) => {
    map.imports['tiptapmod:' + i] = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  });
  const s = document.createElement('script');
  s.type = 'importmap';
  s.textContent = JSON.stringify(map);
  document.head.appendChild(s);
}

// Load all Tiptap modules once — from the offline bundle if available, else CDN.
function loadTiptap() {
  if (_tiptapPromise) return _tiptapPromise;
  const bundle = window.__TIPTAP_BUNDLE;
  let specs;
  if (bundle && bundle.modules && bundle.entries) {
    _setupOfflineImportMap(bundle);
    specs = RT_TT_NAMES.map(n => 'tiptapmod:' + bundle.entries[n]);
  } else {
    const V = TIPTAP_VERSION, base = 'https://esm.sh/@tiptap/';
    specs = RT_TT_NAMES.map(n => base + n + '@' + V);
  }
  _tiptapPromise = Promise.all(specs.map(s => import(s))).then(m => {
    const [core, sk, underline, highlight, link, sup, sub, align, image, taskList, taskItem, placeholder, table, tableRow, tableHeader, tableCell] = m;
    return {
      Editor: core.Editor, Node: core.Node, mergeAttributes: core.mergeAttributes,
      StarterKit: sk.default, Underline: underline.default,
      Highlight: highlight.default, Link: link.default, Superscript: sup.default,
      Subscript: sub.default, TextAlign: align.default, Image: image.default,
      TaskList: taskList.default, TaskItem: taskItem.default, Placeholder: placeholder.default,
      Table: table.default, TableRow: tableRow.default, TableHeader: tableHeader.default, TableCell: tableCell.default
    };
  }).catch(err => { _tiptapPromise = null; throw err; });
  return _tiptapPromise;
}

// Custom extensions built from the loaded Tiptap classes (memoized).
let _rtTableCellExt = null, _rtTableHeaderExt = null, _rtVideoNodeExt = null, _rtImageExt = null;

// Convert an embed src back to a normal "watch" URL for the fallback link.
function _rtVideoWatchUrl(src) {
  let m = (src || '').match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (m) return 'https://www.youtube.com/watch?v=' + m[1];
  m = (src || '').match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (m) return 'https://drive.google.com/file/d/' + m[1] + '/view';
  return src || '#';
}
// A clickable poster shown instead of the iframe when inline playback is blocked
// (e.g. opened from file:// — YouTube/Drive reject embeds with a "config error").
// `asLink` true → a real <a> (read-only views); false → a non-navigating <div> (editor).
function _rtVideoPoster(src, asLink) {
  const isDrive = /drive\.google\.com/.test(src || '');
  const label = (isDrive ? 'Watch on Google Drive' : 'Watch on YouTube') + ' ↗';
  const el = document.createElement(asLink ? 'a' : 'div');
  el.className = 'rt-video-poster';
  if (asLink) { el.href = _rtVideoWatchUrl(src); el.target = '_blank'; el.rel = 'noopener'; }
  el.innerHTML = '<span class="rt-video-play">▶</span><span class="rt-video-label">' + label + '</span>';
  return el;
}
// On file:// only, swap the embedded iframe for a clickable "Watch on YouTube/Drive ↗"
// link (embeds are blocked from a null origin). On http/https videos render normally
// as the saved inline iframe — nothing to do.
function _rtSetupVideoFallback() {
  if (location.protocol !== 'file:') return;
  if (window._rtVideoObs) return;
  const hydrate = root => {
    if (!root || root.nodeType !== 1) return;
    const list = (root.matches && root.matches('.rt-video[data-video-embed]'))
      ? [root] : (root.querySelectorAll ? root.querySelectorAll('.rt-video[data-video-embed]') : []);
    list.forEach(box => {
      if (box.closest('.ProseMirror') || box.dataset.rtHy === '1') return;
      const ifr = box.querySelector('iframe');
      const src = box.getAttribute('data-src') || (ifr ? ifr.getAttribute('src') : '');
      if (!src) return;
      box.dataset.rtHy = '1';
      box.innerHTML = '';
      box.appendChild(_rtVideoPoster(src, true));
    });
  };
  hydrate(document.body);
  const obs = new MutationObserver(muts => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) hydrate(n);
  });
  obs.observe(document.body, { childList: true, subtree: true });
  window._rtVideoObs = obs;
}

// Stop any playing read-only video iframes (set src to about:blank). Called when
// switching to another section/entry so a hidden view's video doesn't keep playing.
// The view rebuilds its content on return, so a fresh iframe appears (ready to play).
function pauseInlineVideos() {
  document.querySelectorAll('.rt-video[data-video-embed] iframe').forEach(ifr => {
    if (ifr.closest('.ProseMirror')) return;   // skip the editor's live preview iframe
    if (ifr.src && ifr.src !== 'about:blank') ifr.src = 'about:blank';
  });
}

// Shared resize NodeView for media (image / video). Aspect ratio is preserved:
// width drives layout, height follows (img height:auto; video box is 16:9).
function _rtMediaNodeView(kind) {
  return ({ node, editor, getPos }) => {
    let current = node;
    const dom = document.createElement(kind === 'img' ? 'span' : 'div');
    dom.className = 'rt-resizable ' + (kind === 'img' ? 'rt-resizable-img' : 'rt-video');
    let media;
    if (kind === 'img') {
      media = document.createElement('img');
      media.src = current.attrs.src || '';
      if (current.attrs.alt) media.alt = current.attrs.alt;
      if (current.attrs.title) media.title = current.attrs.title;
    } else {
      dom.setAttribute('data-video-embed', '');
      dom.setAttribute('data-src', current.attrs.src || '');
      if (location.protocol === 'file:') {
        // Opened as a local file → embeds are blocked; show the clickable poster.
        media = _rtVideoPoster(current.attrs.src, false);
      } else {
        media = document.createElement('iframe');
        media.src = current.attrs.src || '';
        media.setAttribute('frameborder', '0');
        media.setAttribute('allowfullscreen', 'true');
        media.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
      }
    }
    dom.appendChild(media);
    const handle = document.createElement('span');
    handle.className = 'rt-resize-handle';
    handle.title = 'Drag to resize';
    dom.appendChild(handle);
    const applyWidth = w => { dom.style.width = w ? (w + 'px') : ''; };
    applyWidth(current.attrs.width);
    handle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX, startW = dom.offsetWidth;
      const maxW = dom.parentElement ? dom.parentElement.clientWidth : 1600;
      const onMove = ev => { let w = startW + (ev.clientX - startX); w = Math.max(48, Math.min(w, maxW)); dom.style.width = Math.round(w) + 'px'; };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        const w = Math.round(dom.offsetWidth);
        if (typeof getPos === 'function') {
          editor.chain().command(({ tr }) => { tr.setNodeMarkup(getPos(), undefined, Object.assign({}, current.attrs, { width: w })); return true; }).run();
        }
      };
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    });
    return {
      dom,
      update(updated) {
        if (updated.type.name !== current.type.name) return false;
        current = updated;
        if (media.tagName === 'IMG' || media.tagName === 'IFRAME') media.src = current.attrs.src || '';
        if (kind === 'video') dom.setAttribute('data-src', current.attrs.src || '');
        applyWidth(current.attrs.width);
        return true;
      },
      ignoreMutation() { return true; }
    };
  };
}
function _rtImage(T) {
  if (_rtImageExt) return _rtImageExt;
  _rtImageExt = T.Image.extend({
    addAttributes() {
      return Object.assign({}, this.parent ? this.parent() : {}, {
        width: {
          default: null,
          parseHTML: el => { const w = el.getAttribute('width') || (el.style.width ? parseInt(el.style.width, 10) : null); return w ? parseInt(w, 10) : null; },
          renderHTML: attrs => attrs.width ? { width: attrs.width, style: `width:${attrs.width}px;height:auto` } : {}
        }
      });
    },
    addNodeView() { return _rtMediaNodeView('img'); }
  });
  return _rtImageExt;
}
function _rtBgAttribute(parentAttrs) {
  return Object.assign({}, parentAttrs, {
    backgroundColor: {
      default: null,
      parseHTML: el => el.style.backgroundColor || null,
      renderHTML: attrs => attrs.backgroundColor ? { style: `background-color:${attrs.backgroundColor}` } : {}
    }
  });
}
function _rtTableCell(T) {
  if (_rtTableCellExt) return _rtTableCellExt;
  _rtTableCellExt = T.TableCell.extend({
    addAttributes() { return _rtBgAttribute(this.parent ? this.parent() : {}); }
  });
  return _rtTableCellExt;
}
function _rtTableHeader(T) {
  if (_rtTableHeaderExt) return _rtTableHeaderExt;
  _rtTableHeaderExt = T.TableHeader.extend({
    addAttributes() { return _rtBgAttribute(this.parent ? this.parent() : {}); }
  });
  return _rtTableHeaderExt;
}
function _rtVideoNode(T) {
  if (_rtVideoNodeExt) return _rtVideoNodeExt;
  _rtVideoNodeExt = T.Node.create({
    name: 'videoEmbed', group: 'block', atom: true, selectable: true, draggable: true,
    addAttributes() {
      return {
        src: { default: null },
        width: {
          default: null,
          parseHTML: el => (el.style && el.style.width ? parseInt(el.style.width, 10) : null) || null,
          renderHTML: attrs => attrs.width ? { style: `width:${attrs.width}px;max-width:${attrs.width}px` } : {}
        }
      };
    },
    parseHTML() { return [{ tag: 'div[data-video-embed]', getAttrs: el => ({ src: el.getAttribute('data-src') || (el.querySelector('iframe') ? el.querySelector('iframe').getAttribute('src') : ''), width: el.style && el.style.width ? parseInt(el.style.width, 10) : null }) }]; },
    renderHTML({ node }) {
      const src = node.attrs.src || '';
      const attrs = { 'data-video-embed': '', 'data-src': src, class: 'rt-video' };
      if (node.attrs.width) attrs.style = `width:${node.attrs.width}px;max-width:${node.attrs.width}px`;
      return ['div', attrs,
        ['iframe', { src, frameborder: '0', allowfullscreen: 'true', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen' }]];
    },
    addNodeView() { return _rtMediaNodeView('video'); },
    addCommands() {
      const name = this.name;
      return { setVideoEmbed: attrs => ({ commands }) => commands.insertContent({ type: name, attrs }) };
    }
  });
  return _rtVideoNodeExt;
}

async function initEditor(editorId, toolbarId, content) {
  const mount = document.getElementById(editorId);
  const toolbar = document.getElementById(toolbarId);
  if (!mount) return;
  if (RT_EDITORS[editorId]) { try { RT_EDITORS[editorId].destroy(); } catch(e){} delete RT_EDITORS[editorId]; }
  mount.removeAttribute('contenteditable');
  mount.innerHTML = '';
  if (toolbar) toolbar.innerHTML = '<span class="rt-loading">Loading editor…</span>';
  let T;
  try { T = await loadTiptap(); }
  catch (e) {
    // Offline with no cached bundle: fall back to a plain editable so content
    // is never lost, even though the rich toolbar is unavailable.
    if (toolbar) toolbar.innerHTML = '<span class="rt-loading">Rich editor unavailable offline — plain text only.</span>';
    mount.setAttribute('contenteditable','true');
    mount.classList.add('rt-prose');
    mount.innerHTML = content || '';
    return;
  }
  if (!document.body.contains(mount)) return;   // modal closed while loading
  const placeholder = mount.getAttribute('data-placeholder') || 'Write here…';
  let editor;
  editor = new T.Editor({
    element: mount,
    extensions: [
      T.StarterKit.configure({ heading: { levels: [1,2,3,4] } }),
      T.Underline,
      T.Highlight.configure({ multicolor: true }),
      T.Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { target:'_blank', rel:'noopener nofollow' } }),
      T.Superscript, T.Subscript,
      T.TextAlign.configure({ types: ['heading','paragraph'] }),
      _rtImage(T).configure({ inline: false, allowBase64: true }),
      T.TaskList, T.TaskItem.configure({ nested: true }),
      T.Table.configure({ resizable: true, lastColumnResizable: true, allowTableNodeSelection: true }),
      T.TableRow, _rtTableHeader(T), _rtTableCell(T),
      _rtVideoNode(T),
      T.Placeholder.configure({ placeholder })
    ],
    content: content || '',
    editorProps: {
      attributes: { class: 'rt-prose' },
      handlePaste: (view, event) => rtHandleImagePaste(editorId, event),
      // Shift+Enter normally inserts a soft <br> (HardBreak). ProseMirror
      // also collapses consecutive hard breaks in some paths, so pressing
      // it multiple times to "add space" doesn't produce visible spacing.
      // Override it to split the block — same effect as Enter — so the
      // user reliably gets a new paragraph with paragraph margin every
      // time. Plain Enter is unchanged.
      handleKeyDown: (_view, event) => {
        if (event.key === 'Enter' && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          editor.chain().focus().splitBlock().run();
          return true;
        }
        return false;
      }
    },
    onSelectionUpdate: () => rtUpdateToolbar(editorId),
    onTransaction: () => rtUpdateToolbar(editorId)
  });
  RT_EDITORS[editorId] = editor;
  rtBuildToolbar(toolbarId, editorId);
  rtUpdateToolbar(editorId);
}

// Read an editor's HTML for saving. Treats Tiptap's empty doc as empty string.
function getEditorHTML(editorId) {
  const e = RT_EDITORS[editorId];
  if (e) { const html = e.getHTML(); return html === '<p></p>' ? '' : html; }
  const el = document.getElementById(editorId);
  return el ? el.innerHTML : '';
}

/* ── Command dispatch ── */
function rtCmd(editorId, action, arg) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  switch (action) {
    case 'bold': c.toggleBold().run(); break;
    case 'italic': c.toggleItalic().run(); break;
    case 'underline': c.toggleUnderline().run(); break;
    case 'strike': c.toggleStrike().run(); break;
    case 'sup': c.toggleSuperscript().run(); break;
    case 'sub': c.toggleSubscript().run(); break;
    case 'bullet': c.toggleBulletList().run(); break;
    case 'ordered': c.toggleOrderedList().run(); break;
    case 'task': c.toggleTaskList().run(); break;
    case 'blockquote': c.toggleBlockquote().run(); break;
    case 'codeblock': c.toggleCodeBlock().run(); break;
    case 'align': c.setTextAlign(arg).run(); break;
    case 'highlight': c.toggleHighlight({ color: arg }).run(); break;
    case 'unhighlight': c.unsetHighlight().run(); break;
    case 'undo': c.undo().run(); break;
    case 'redo': c.redo().run(); break;
    case 'clear': c.unsetAllMarks().clearNodes().run(); break;
  }
  rtUpdateToolbar(editorId);
}
function rtSetHeading(editorId, level) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  if (!level || level === '0') c.setParagraph().run();
  else c.toggleHeading({ level: parseInt(level, 10) }).run();
  rtUpdateToolbar(editorId);
}
async function rtSetLink(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const prev = e.getAttributes('link').href || '';
  const url = await customPrompt('Link URL (leave empty to remove the link):', prev || 'https://', {
    title: 'Insert / edit link', placeholder: 'https://…', confirmLabel: 'Apply link'
  });
  if (url === null) return;
  if (url.trim() === '') e.chain().focus().extendMarkRange('link').unsetLink().run();
  else e.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  rtUpdateToolbar(editorId);
}
function rtPickImage(editorId) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async ev => {
    const file = ev.target.files[0]; if (!file) return;
    if (file.size > RT_IMAGE_MAX_BYTES) { alert(`Image is too large (${(file.size/1024/1024).toFixed(2)} MB). Maximum is 2 MB.`); return; }
    try { const url = await fileToDataUrl(file); const e = RT_EDITORS[editorId]; if (e) e.chain().focus().setImage({ src: url }).run(); }
    catch (err) { alert('Could not read image: ' + err.message); }
  };
  inp.click();
}
// Paste image → insert as data URL. Returns true when it handled the paste.
function rtHandleImagePaste(editorId, event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (!items) return false;
  for (const it of items) {
    if (it.type && it.type.startsWith('image/')) {
      const blob = it.getAsFile();
      if (!blob) continue;
      if (blob.size > RT_IMAGE_MAX_BYTES) { alert('Pasted image is too large (max 2 MB).'); return true; }
      fileToDataUrl(blob).then(url => { const e = RT_EDITORS[editorId]; if (e) e.chain().focus().setImage({ src: url }).run(); });
      return true;
    }
  }
  return false;
}

/* ── Toolbar dropdown menus (Table) ── */
function rtToggleMenu(btn) {
  const menu = btn.closest('.rt-menu');
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
  if (!window._rtMenuCloser) {
    window._rtMenuCloser = true;
    document.addEventListener('mousedown', ev => { if (!ev.target.closest('.rt-menu')) document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open')); });
  }
}

/* ── Tables ── */
// Number of columns in the row containing the current selection (for the 6-col cap).
function _rtColCount(e) {
  try {
    const dom = e.view.domAtPos(e.state.selection.from);
    let n = dom.node; if (n && n.nodeType === 3) n = n.parentNode;
    const cell = n && n.closest ? n.closest('td,th') : null;
    return cell && cell.parentNode ? cell.parentNode.children.length : 0;
  } catch (err) { return 0; }
}
function rtTable(editorId, op) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  switch (op) {
    case 'insert': c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
    case 'rowAfter': c.addRowAfter().run(); break;
    case 'rowBefore': c.addRowBefore().run(); break;
    case 'colAfter': if (_rtColCount(e) >= 6) { showToast('Tables are limited to 6 columns.'); break; } c.addColumnAfter().run(); break;
    case 'colBefore': if (_rtColCount(e) >= 6) { showToast('Tables are limited to 6 columns.'); break; } c.addColumnBefore().run(); break;
    case 'delRow': c.deleteRow().run(); break;
    case 'delCol': c.deleteColumn().run(); break;
    case 'toggleHeaderRow': c.toggleHeaderRow().run(); break;
    case 'merge': c.mergeCells().run(); break;
    case 'split': c.splitCell().run(); break;
    case 'clearCellColor': c.setCellAttribute('backgroundColor', null).run(); break;
    case 'delTable': c.deleteTable().run(); break;
  }
  document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open'));
  rtUpdateToolbar(editorId);
}
function rtTableCellColor(editorId, color) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  e.chain().focus().setCellAttribute('backgroundColor', color || null).run();
}

/* ── Video embeds (YouTube + Google Drive → responsive iframe) ── */
function _rtVideoEmbedSrc(url) {
  url = (url || '').trim(); if (!url) return null;
  let m;
  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/
  m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  // Google Drive: /file/d/ID/... or ?id=ID
  m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([A-Za-z0-9_-]{10,})/);
  if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
  return null;
}
async function rtInsertVideo(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const url = await customPrompt('Paste a YouTube or Google Drive link:', '', {
    title: 'Embed video', placeholder: 'https://youtu.be/… or https://drive.google.com/…', confirmLabel: 'Embed'
  });
  if (url === null) return;
  const src = _rtVideoEmbedSrc(url);
  if (!src) { alert('Could not recognize that as a YouTube or Google Drive video link.'); return; }
  e.chain().focus().setVideoEmbed({ src }).run();
}

/* ── Toolbar ── */
function rtBtn(editorId, action, label, title, arg) {
  const ed = escAttr(editorId);
  const argCall = arg !== undefined ? `,'${escJsAttr(arg)}'` : '';
  const argAttr = arg !== undefined ? ` data-arg="${escAttr(arg)}"` : '';
  return `<button class="rt-btn" type="button" data-act="${escAttr(action)}"${argAttr} title="${escAttr(title)}" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','${escJsAttr(action)}'${argCall})">${label}</button>`;
}
function rtBuildToolbar(toolbarId, editorId) {
  const ed = escAttr(editorId);
  const sep = '<div class="rt-sep"></div>';
  const headingSel = `<select class="rt-select" title="Paragraph style" onchange="rtSetHeading('${ed}', this.value)">
    <option value="0">Normal</option>
    <option value="1">Heading 1</option>
    <option value="2">Heading 2</option>
    <option value="3">Heading 3</option>
    <option value="4">Heading 4</option>
  </select>`;
  const hl = `<span class="rt-hl-group"><span class="rt-hl-icon" title="Highlight">🖍</span>` +
    RT_HL_SWATCHES.map(h => `<button class="rt-hl-swatch" type="button" title="Highlight ${h.t}" style="background:${h.c}" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','highlight','${h.c}')"></button>`).join('') +
    `<button class="rt-btn" type="button" title="Remove highlight" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','unhighlight')">✕</button></span>`;
  const mi = (op, label) => `<button class="rt-menu-item" type="button" onmousedown="event.preventDefault()" onclick="rtTable('${ed}','${op}')">${label}</button>`;
  const tableMenu = `<span class="rt-menu">
    <button class="rt-btn" type="button" title="Table" onmousedown="event.preventDefault()" onclick="rtToggleMenu(this)">▦ ▾</button>
    <div class="rt-menu-panel">
      ${mi('insert','▦  Insert table')}
      <div class="rt-menu-sep"></div>
      ${mi('rowAfter','＋ Row below')}${mi('rowBefore','＋ Row above')}
      ${mi('colAfter','＋ Column right')}${mi('colBefore','＋ Column left')}
      ${mi('delRow','−  Delete row')}${mi('delCol','−  Delete column')}
      <div class="rt-menu-sep"></div>
      ${mi('toggleHeaderRow','Toggle header row')}
      ${mi('merge','Merge cells')}${mi('split','Split cell')}
      <label class="rt-menu-item" onmousedown="event.preventDefault()">🎨 Cell color <input type="color" class="rt-cell-color" oninput="rtTableCellColor('${ed}', this.value)"></label>
      ${mi('clearCellColor','Clear cell color')}
      <div class="rt-menu-sep"></div>
      <button class="rt-menu-item rt-menu-danger" type="button" onmousedown="event.preventDefault()" onclick="rtTable('${ed}','delTable')">🗑 Delete table</button>
    </div>
  </span>`;
  const html =
    rtBtn(editorId,'undo','↶','Undo (Ctrl+Z)') +
    rtBtn(editorId,'redo','↷','Redo (Ctrl+Y)') + sep +
    headingSel + sep +
    rtBtn(editorId,'bold','<b>B</b>','Bold (Ctrl+B)') +
    rtBtn(editorId,'italic','<i>I</i>','Italic (Ctrl+I)') +
    rtBtn(editorId,'underline','<u>U</u>','Underline (Ctrl+U)') +
    rtBtn(editorId,'strike','<s>S</s>','Strikethrough') +
    rtBtn(editorId,'sup','x<sup>2</sup>','Superscript') +
    rtBtn(editorId,'sub','x<sub>2</sub>','Subscript') + sep +
    hl + sep +
    `<button class="rt-btn" type="button" data-act="link" title="Insert / edit link" onmousedown="event.preventDefault()" onclick="rtSetLink('${ed}')">🔗</button>` + sep +
    rtBtn(editorId,'bullet','• List','Bullet list') +
    rtBtn(editorId,'ordered','1. List','Numbered list') +
    rtBtn(editorId,'task','☑','Task list') + sep +
    rtBtn(editorId,'blockquote','❝','Blockquote') +
    rtBtn(editorId,'codeblock','&lt;/&gt;','Code block') + sep +
    rtBtn(editorId,'align','⇤','Align left','left') +
    rtBtn(editorId,'align','≡','Align center','center') +
    rtBtn(editorId,'align','⇥','Align right','right') +
    rtBtn(editorId,'align','☰','Justify','justify') + sep +
    `<button class="rt-btn" type="button" title="Insert image (or paste from clipboard)" onmousedown="event.preventDefault()" onclick="rtPickImage('${ed}')">🖼</button>` +
    `<button class="rt-btn" type="button" title="Embed a YouTube or Google Drive video" onmousedown="event.preventDefault()" onclick="rtInsertVideo('${ed}')">▶</button>` +
    tableMenu + sep +
    rtBtn(editorId,'clear','⌫','Clear formatting');
  const tb = document.getElementById(toolbarId);
  if (tb) tb.innerHTML = html;
}
function rtUpdateToolbar(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const mount = document.getElementById(editorId);
  const tb = mount && mount.parentElement ? mount.parentElement.querySelector('.rt-toolbar') : null;
  if (!tb) return;
  const state = {
    bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'),
    strike: e.isActive('strike'), sup: e.isActive('superscript'), sub: e.isActive('subscript'),
    bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'), task: e.isActive('taskList'),
    blockquote: e.isActive('blockquote'), codeblock: e.isActive('codeBlock'), link: e.isActive('link')
  };
  tb.querySelectorAll('.rt-btn[data-act]').forEach(btn => {
    const act = btn.dataset.act;
    if (act === 'align') btn.classList.toggle('active', e.isActive({ textAlign: btn.dataset.arg }));
    else if (act === 'undo') btn.disabled = !e.can().undo();
    else if (act === 'redo') btn.disabled = !e.can().redo();
    else if (act in state) btn.classList.toggle('active', !!state[act]);
  });
  const sel = tb.querySelector('.rt-select');
  if (sel) {
    let v = '0';
    for (let lvl = 1; lvl <= 4; lvl++) if (e.isActive('heading', { level: lvl })) { v = String(lvl); break; }
    sel.value = v;
  }
}
