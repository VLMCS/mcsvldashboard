/* ══════════════════════════════════════════════════════════════
   SEARCH / AI EMBEDDINGS  (extracted from app.js, PR-10)
   Lazy Transformers.js MiniLM pipeline + cosine similarity +
   on-load backfill. Functions stay global; loaded before app.js.
   EMBED_VERSION/EMBEDDER/EMBEDDER_LOADING/EMBEDDER_FAILED state
   stays declared in app.js and is read/written here cross-file.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   AI SEMANTIC EMBEDDINGS (Transformers.js + MiniLM)
   ──────────────────────────────────────────
   Runs entirely in-browser. The model (~25 MB) loads lazily on first
   semantic search, then is cached by the browser forever. Embeddings
   are quantized to int8 (~384 B/entry) and stored on the entry itself
   as `_emb`, so they ride along through localStorage + Firestore sync.
   ══════════════════════════════════════════ */

// CDN source for the Transformers.js ESM build. Pinned to a major version.
const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
const EMBEDDING_MODEL  = 'Xenova/all-MiniLM-L6-v2';

function aiSearchOn() {
  return !!(SITE_SETTINGS && SITE_SETTINGS.aiSearchEnabled !== false) && !EMBEDDER_FAILED;
}
function keywordSearchOn() {
  return !!(SITE_SETTINGS && SITE_SETTINGS.keywordSearchEnabled !== false);
}

// Lazy-load the embedding pipeline. Multiple callers safely share one load.
async function loadEmbedder() {
  if (EMBEDDER) return EMBEDDER;
  if (EMBEDDER_FAILED) return null;
  if (EMBEDDER_LOADING) return EMBEDDER_LOADING;
  EMBEDDER_LOADING = (async () => {
    try {
      // Dynamic ESM import from CDN — first call downloads the wrapper (~few hundred KB),
      // then the model weights (~25 MB) stream in via .pipeline(). Both are HTTP-cached.
      const transformers = await import(/* @vite-ignore */ TRANSFORMERS_CDN + '/dist/transformers.min.js');
      // Disable the local-files-only mode and let it fetch model files from the HF CDN.
      if (transformers.env) {
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
      }
      EMBEDDER = await transformers.pipeline('feature-extraction', EMBEDDING_MODEL, { quantized: true });
      return EMBEDDER;
    } catch (err) {
      console.warn('[AI search] Embedder failed to load — falling back to keyword-only search.', err);
      EMBEDDER_FAILED = true;
      return null;
    } finally {
      EMBEDDER_LOADING = null;
    }
  })();
  return EMBEDDER_LOADING;
}

// Plain-text representation of an entry used as the embedding input.
function entryEmbedSource(entry) {
  const stripped = stripHtml(entry.content || '');
  return [
    entry.title || '',
    entry.section || '',
    (entry.keywords || []).join(' '),
    stripped
  ].filter(Boolean).join(' \n ');
}

// Run the model on a string, return a normalized Float32Array (length 384 for MiniLM).
async function embedText(text) {
  const pipe = await loadEmbedder();
  if (!pipe) return null;
  // pooling:'mean' averages token vectors; normalize:true gives unit-length output so
  // cosine similarity is just a dot product.
  const out = await pipe(text, { pooling: 'mean', normalize: true });
  // `out.data` is a Float32Array view. Copy so it survives outside the tensor's lifetime.
  return new Float32Array(out.data);
}

// Both inputs assumed normalized → cosine similarity = dot product, in [-1, 1].
function cosineSim(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// Int8 quantization: one shared scale per vector. ~4x smaller, <1% quality loss.
function quantizeEmbedding(f32) {
  let max = 0;
  for (let i = 0; i < f32.length; i++) { const v = Math.abs(f32[i]); if (v > max) max = v; }
  if (max === 0) return { s: 0, q: new Array(f32.length).fill(0) };
  const scale = max / 127;
  const q = new Array(f32.length);
  for (let i = 0; i < f32.length; i++) q[i] = Math.max(-127, Math.min(127, Math.round(f32[i] / scale)));
  return { s: scale, q };
}
function dequantizeEmbedding(stored) {
  if (!stored || !Array.isArray(stored.q)) return null;
  const f32 = new Float32Array(stored.q.length);
  const s = stored.s || 0;
  for (let i = 0; i < stored.q.length; i++) f32[i] = stored.q[i] * s;
  return f32;
}

// Cached dequantized view on each entry. Avoids re-allocating a Float32Array per search.
function entryEmbeddingVector(entry) {
  if (!entry || !entry._emb || entry._embV !== EMBED_VERSION) return null;
  if (!entry.__embCache) entry.__embCache = dequantizeEmbedding(entry._emb);
  return entry.__embCache;
}

// Embed an entry and stash the quantized result on it. Used by both
// save-time embedding and the on-load backfill pass.
async function computeEntryEmbedding(entry) {
  const text = entryEmbedSource(entry);
  if (!text.trim()) return false;
  const vec = await embedText(text);
  if (!vec) return false;
  entry._emb = quantizeEmbedding(vec);
  entry._embV = EMBED_VERSION;
  // Invalidate the cached Float32Array so the next search re-reads from the new _emb.
  entry.__embCache = null;
  return true;
}

// Walk every entry across every base and embed the ones that don't yet have a
// current-version embedding. Processes in small batches yielding to the event loop
// so the UI stays responsive. Updates a corner badge with progress.
async function runBackfillEmbeddings() {
  if (BACKFILL_RUNNING) return;
  if (!aiSearchOn()) return;

  const todo = [];
  for (const base of allBaseIds()) {
    for (const e of entriesOf(base)) {
      if (!e._emb || e._embV !== EMBED_VERSION) todo.push(e);
    }
  }
  if (!todo.length) return;

  BACKFILL_RUNNING = true;
  showBackfillIndicator(0, todo.length);
  // Load the model up front so the first item doesn't pay a misleadingly large cost.
  const pipe = await loadEmbedder();
  if (!pipe) { hideBackfillIndicator(); BACKFILL_RUNNING = false; return; }

  const BATCH = 5;
  let done = 0;
  for (let i = 0; i < todo.length; i += BATCH) {
    const batch = todo.slice(i, i + BATCH);
    for (const entry of batch) {
      try { await computeEntryEmbedding(entry); } catch (e) { /* skip bad entries */ }
      done++;
      showBackfillIndicator(done, todo.length);
    }
    // Yield so the page stays interactive between batches.
    await new Promise(r => setTimeout(r, 0));
  }

  // Persist all embeddings (localStorage + Firebase) in one go.
  saveAll('Indexing complete', { silent: true });
  hideBackfillIndicator();
  BACKFILL_RUNNING = false;
}

function showBackfillIndicator(done, total) {
  let el = document.getElementById('ai-index-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ai-index-indicator';
    el.innerHTML = '<span class="ai-dot"></span><span class="ai-text"></span>';
    document.body.appendChild(el);
  }
  el.querySelector('.ai-text').textContent = `Indexing for AI search… ${done}/${total}`;
  el.classList.add('visible');
}
function hideBackfillIndicator() {
  const el = document.getElementById('ai-index-indicator');
  if (el) el.classList.remove('visible');
}

// Fire-and-forget embed for a freshly saved entry. Re-checks the entry is still in
// place with the same source text before writing — if the user edited again mid-embed,
// the next attachEmbedding call will handle the new state.
function attachEmbedding(entry, base) {
  if (!aiSearchOn()) return;
  const sourceAtStart = entryEmbedSource(entry);
  computeEntryEmbedding(entry).then(ok => {
    if (!ok) return;
    // Verify the entry still exists in its store and content is unchanged.
    const store = entriesOf(base);
    const live = store && store.find(e => e.id === entry.id);
    if (!live || live !== entry) return; // entry was replaced (re-edited) — leave its newer call to handle it
    if (entryEmbedSource(live) !== sourceAtStart) return; // content drifted — same reasoning
    saveAll('Entry indexed', { silent: true });
  });
}
