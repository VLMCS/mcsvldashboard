/* ══════════════════════════════════════════════════════════════
   SEARCH ENGINE  (extracted from app.js, PR-11)
   Stemming + tokenizing + synonym/bigram keyword scoring + the
   combined keyword/AI ranking, plus open/closeSearchModal. Stays
   global; loaded before app.js. performSearchModal (still in
   app.js) calls into this cross-file; reads SYNONYMS/entriesOf/
   EMBEDDER/cosineSim as globals at call-time.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   SEARCH (synonyms + stemming + bigrams + section fallback)
   ══════════════════════════════════════════ */

// Light Porter-ish stemmer — strips common English suffixes
function stem(word) {
  if (!word || word.length < 4) return word;
  // Order matters: try longer suffixes first
  const rules = [
    [/ies$/, 'y'],     // studies → study
    [/ied$/, 'y'],     // studied → study
    [/tions$/, 'tion'],
    [/ments$/, 'ment'],
    [/(at|bl|iz)e$/, '$1'],  // create → creat
    [/tion$/, 'tion'],  // keep
    [/ment$/, 'ment'],  // keep
    [/sses$/, 'ss'],
    [/ings$/, ''],
    [/ing$/, ''],
    [/edly$/, ''],
    [/ed$/, ''],
    [/ly$/, ''],
    [/ers$/, ''],
    [/er$/, ''],
    [/est$/, ''],
    [/s$/, '']
  ];
  for (const [re, rep] of rules) {
    const m = word.match(re);
    if (m) {
      const next = word.replace(re, rep);
      if (next.length >= 3) return next;
    }
  }
  return word;
}

function tokenize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

// Briefly highlight every occurrence of any query token inside `root`,
// scroll the first hit into view, then auto-remove the highlights so the
// entry returns to its normal styling. Called when an entry is opened
// from a search result so the user can see what part of the article
// matched their query. If no body match is found, falls back to
// flashing the entry title (which is the most likely thing that matched
// when the body has no literal token hit).
function flashSearchMatches(root, query) {
  if (!root || !query) return;
  // Stop-words we never want to flash (would just create noise).
  const STOP = new Set(['the','a','an','and','or','of','to','for','in','on','at','by','is','are','be','this','that','with','as','it']);
  const tokens = tokenize(query).filter(t => t.length >= 2 && !STOP.has(t));
  if (!tokens.length) return;

  // Build a single regex that matches any token (longest first so multi-
  // word phrases or longer terms win over shorter substrings).
  const escaped = tokens
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(' + escaped.join('|') + ')', 'gi');

  // Wrap all matches inside `node`, returning the first <mark> created
  // (or null if nothing matched). Skips <script>/<style>/<mark> and
  // never wraps inside an existing flash mark.
  function wrapMatches(node) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('mark.search-flash')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const targets = [];
    while (walker.nextNode()) targets.push(walker.currentNode);
    let first = null;
    for (const tn of targets) {
      const text = tn.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) continue;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const mark = document.createElement('mark');
        mark.className = 'search-flash';
        mark.textContent = m[0];
        frag.appendChild(mark);
        if (!first) first = mark;
        last = m.index + m[0].length;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    }
    return first;
  }

  let firstMark = wrapMatches(root);

  // No body match? The hit was probably on the title (or a synonym/
  // semantic match). Flash the title element itself instead.
  const titleEl = document.getElementById('ev-title');
  const cleanupRoots = [root];
  if (!firstMark && titleEl) {
    const titleMark = wrapMatches(titleEl);
    if (titleMark) { firstMark = titleMark; cleanupRoots.push(titleEl); }
  }

  if (firstMark) {
    setTimeout(() => {
      try { firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
    }, 50);
  }

  // Strip the wrappers after the animation finishes. 2.6s gives the
  // 2.4s CSS animation a small grace period.
  setTimeout(() => {
    cleanupRoots.forEach(r => {
      r.querySelectorAll('mark.search-flash').forEach(el => {
        const parent = el.parentNode;
        if (!parent) return;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
        parent.normalize();
      });
    });
  }, 2600);
}

function stemTokens(tokens) { return tokens.map(stem); }

// Build a flat lookup: term → Set of all related terms (by membership in same group)
function buildSynonymIndex() {
  const idx = new Map();
  const groups = Array.isArray(SYNONYMS) ? SYNONYMS : [];
  for (const group of groups) {
    if (!Array.isArray(group) || !group.length) continue;
    const lowerGroup = group.map(g => String(g).toLowerCase().trim()).filter(Boolean);
    for (const term of lowerGroup) {
      if (!idx.has(term)) idx.set(term, new Set());
      for (const other of lowerGroup) {
        if (other !== term) idx.get(term).add(other);
      }
      // Also map the stemmed form
      const st = stem(term);
      if (st !== term) {
        if (!idx.has(st)) idx.set(st, new Set());
        for (const other of lowerGroup) {
          if (other !== term) idx.get(st).add(other);
        }
      }
    }
  }
  // Auto-extend from each entry's own keywords (entry-as-synonym-group)
  for (const entry of HANDBOOK) {
    const titleLower = entry.title.toLowerCase();
    const terms = new Set([titleLower, ...(entry.keywords || []).map(k => k.toLowerCase())]);
    for (const term of terms) {
      if (!term) continue;
      if (!idx.has(term)) idx.set(term, new Set());
      for (const other of terms) {
        if (other !== term) idx.get(term).add(other);
      }
    }
  }
  return idx;
}

// Returns { phrase, tokens, stemmedTokens, expandedPhrases, expandedTokens, bigrams }
function buildQuery(query) {
  const phrase = query.trim().toLowerCase();
  const tokens = tokenize(query);
  const stemmedTokens = stemTokens(tokens);
  const synIdx = buildSynonymIndex();

  // Expand: each token contributes its synonym group
  const expandedPhrases = new Set();
  const expandedTokens = new Set();

  // First, full phrase lookup
  if (synIdx.has(phrase)) {
    for (const t of synIdx.get(phrase)) {
      if (t.includes(' ')) expandedPhrases.add(t);
      else expandedTokens.add(t);
    }
  }
  // Then each individual token
  for (const tok of tokens) {
    if (synIdx.has(tok)) {
      for (const t of synIdx.get(tok)) {
        if (t.includes(' ')) expandedPhrases.add(t);
        else expandedTokens.add(t);
      }
    }
    const st = stem(tok);
    if (st !== tok && synIdx.has(st)) {
      for (const t of synIdx.get(st)) {
        if (t.includes(' ')) expandedPhrases.add(t);
        else expandedTokens.add(t);
      }
    }
  }
  // Bigrams from original tokens
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + ' ' + tokens[i+1]);

  return { phrase, tokens, stemmedTokens, expandedPhrases: [...expandedPhrases], expandedTokens: [...expandedTokens], bigrams };
}

// Stem an entry's searchable text once per call
function entrySearchableText(entry) {
  const stripped = entry.content.replace(/<[^>]*>/g, ' ');
  const raw = (entry.title + ' ' + entry.section + ' ' + (entry.keywords||[]).join(' ') + ' ' + stripped).toLowerCase();
  // Stemmed bag of words for stemmed-token matching
  const stemmedSet = new Set(tokenize(raw).map(stem));
  return { raw, stemmedSet };
}

function scoreEntry(entry, q) {
  const title = entry.title.toLowerCase();
  const section = entry.section.toLowerCase();
  const kws = (entry.keywords || []).map(k => k.toLowerCase());
  const kwStr = kws.join(' ');
  const content = entry.content.replace(/<[^>]*>/g, ' ').toLowerCase();
  const stext = entrySearchableText(entry);

  let score = 0;

  // ─── PHRASE / EXACT (highest priority) ───
  if (title === q.phrase) score += 250;
  else if (title.startsWith(q.phrase)) score += 130;
  else if (title.includes(q.phrase)) score += 95;

  if (kws.some(k => k === q.phrase)) score += 140;
  else if (kws.some(k => k.includes(q.phrase))) score += 80;
  else if (kwStr.includes(q.phrase)) score += 55;

  if (section.includes(q.phrase)) score += 45;
  if (content.includes(q.phrase)) score += 18;

  // ─── ORIGINAL TOKENS ───
  const valid = q.tokens.filter(t => t.length >= 2);
  if (valid.length > 1) {
    let kwHits = 0, titleHits = 0;
    for (const t of valid) {
      if (kws.some(k => k.includes(t))) { score += 8; kwHits++; }
      if (title.includes(t)) { score += 6; titleHits++; }
      else if (content.includes(t)) score += 1;
    }
    if (kwHits >= valid.length) score += 25;
    if (titleHits >= valid.length) score += 20;
  } else if (valid.length === 1) {
    const t = valid[0];
    if (kws.some(k => k === t)) score += 14;
    else if (kws.some(k => k.startsWith(t))) score += 8;
    else if (kwStr.includes(t)) score += 4;
    else if (title.includes(t)) score += 10;
    else if (content.includes(t)) score += 1;
  }

  // ─── STEMMED TOKEN MATCHES (catches plural/tense variants) ───
  let stemHits = 0;
  for (const st of q.stemmedTokens) {
    if (st.length >= 3 && stext.stemmedSet.has(st)) stemHits++;
  }
  if (stemHits) score += stemHits * 3;

  // ─── BIGRAM BOOST (adjacent pairs win over scattered tokens) ───
  for (const bg of q.bigrams) {
    if (title.includes(bg)) score += 12;
    else if (kwStr.includes(bg)) score += 8;
    else if (content.includes(bg)) score += 4;
  }

  // ─── SYNONYM / CONCEPT EXPANSIONS (lower weight than originals) ───
  for (const ep of q.expandedPhrases) {
    if (title.includes(ep)) score += 18;
    else if (kwStr.includes(ep)) score += 14;
    else if (content.includes(ep)) score += 6;
  }
  for (const et of q.expandedTokens) {
    if (et.length < 2) continue;
    if (kws.some(k => k === et)) score += 6;
    else if (title.includes(et)) score += 4;
    else if (kwStr.includes(et)) score += 3;
    else if (content.includes(et)) score += 1;
  }

  return score;
}

async function search(query) {
  if (!query || !query.trim()) return [];
  const q = buildQuery(query);

  const kwOn = keywordSearchOn();

  // Semantic side: embed the query if AI search is enabled. Two cases:
  //  • Both modes on (default): if the model isn't loaded yet, kick off the load
  //    in the background and return keyword-only results this round — the user
  //    sees something immediately and gets the full hybrid score next time.
  //  • Keyword off, AI on: we MUST await the model load, because there's no
  //    other path to results. The caller already shows a "loading model" hint.
  let qEmb = null;
  if (aiSearchOn()) {
    if (EMBEDDER) {
      try { qEmb = await embedText(query); } catch (e) { qEmb = null; }
    } else if (!kwOn) {
      try { qEmb = await embedText(query); } catch (e) { qEmb = null; }
    } else {
      loadEmbedder(); // background warmup for the next query
    }
  }
  // Search across all knowledge bases. Tag results with __base.
  const scoredAll = [];
  for (const base of allBaseIds()) {
    const arr = entriesOf(base);
    for (const e of arr) {
      const kwScore = kwOn ? scoreEntry(e, q) : 0;
      let semScore = 0;
      if (qEmb) {
        const eVec = entryEmbeddingVector(e);
        if (eVec) {
          // cosineSim ∈ [-1,1]; scale to a 0–100 range that lives alongside keyword scores.
          // Floor at 0 so dissimilar entries don't actively suppress keyword matches.
          const sim = cosineSim(qEmb, eVec);
          semScore = Math.max(0, sim) * 100;
        }
      }
      // Hybrid: take the stronger signal, then add a small bonus when both agree.
      // This preserves keyword dominance for exact matches (IDs, names) while letting
      // pure-semantic results surface, and rewards entries where both signals point the same way.
      const score = Math.max(kwScore, semScore) + Math.min(kwScore, semScore) * 0.15;
      // Use a slightly higher floor when only the semantic signal contributed —
      // raw similarity will produce small nonzero scores for everything.
      const floor = kwScore > 0 ? 4 : 28;
      if (score >= floor) scoredAll.push({ entry: { ...e, __base: base }, score });
    }
  }

  // Also search Quick Links–style link items (SIDEBAR_CFG). These are links, not
  // content entries, so we score a synthetic entry built from the link text + URL.
  // Quick Links have no content to embed semantically, so they're skipped entirely
  // when keyword search is off.
  if (kwOn) {
    for (const section of (SIDEBAR_CFG || [])) {
      if (!section || !Array.isArray(section.items)) continue;
      for (const item of section.items) {
        if (!item || !item.id || item.visible === false) continue;
        const synthetic = {
          title: item.text || '',
          section: getCategoryLabel(section.id),
          keywords: [],
          content: item.href || ''
        };
        const score = scoreEntry(synthetic, q);
        if (score >= 4) {
          scoredAll.push({
            entry: {
              __link: true,
              sectionId: section.id,
              itemId: item.id,
              id: item.id,
              title: item.text || '(untitled link)',
              href: item.href || null,
              __base: section.id
            },
            score
          });
        }
      }
    }
  }

  scoredAll.sort((a, b) => b.score - a.score);
  let results = scoredAll.map(r => r.entry);

  // ─── SECTION-LEVEL FALLBACK ───
  // Pure keyword path; section descriptions aren't embedded, so skip when kw is off.
  if (kwOn && results.length < 2) {
    const sectionResults = [];
    const scanSections = (arr, base) => {
      for (const sec of arr) {
        const blob = (sec.num + ' ' + sec.title + ' ' + (sec.description || '')).toLowerCase();
        let s = 0;
        if (blob.includes(q.phrase)) s += 80;
        for (const t of q.tokens) if (blob.includes(t)) s += 10;
        for (const ep of q.expandedPhrases) if (blob.includes(ep)) s += 6;
        for (const et of q.expandedTokens) if (blob.includes(et)) s += 3;
        if (s >= 10) sectionResults.push({ entry: { __section: true, __base: base, num: sec.num, title: sec.title, id: sec.num, section: sec.num + '. ' + sec.title, content: sec.description || '' }, score: s });
      }
    };
    scanSections(SECTIONS, 'handbook');
    scanSections(PROJECTS, 'projects');
    for (const cc of (CUSTOM_CATEGORIES || [])) {
      if (cc && Array.isArray(cc.sections)) scanSections(cc.sections, cc.id);
    }
    sectionResults.sort((a, b) => b.score - a.score);
    const haveIds = new Set(results.map(r => r.id + '|' + (r.__base||'handbook')));
    for (const r of sectionResults) {
      const key = r.entry.id + '|' + r.entry.__base;
      if (!haveIds.has(key)) results.push(r.entry);
    }
  }

  return results;
}

function openSearchModal(initialQ) {
  const inp = document.getElementById('search-modal-input');
  if (typeof initialQ === 'string') { inp.value = initialQ; performSearchModal(); }
  else { inp.value = ''; document.getElementById('results-list').innerHTML = ''; document.getElementById('results-count').textContent = ''; }
  document.getElementById('search-modal-overlay').classList.add('open');
  setTimeout(() => inp.focus(), 50);
}
function closeSearchModal() { document.getElementById('search-modal-overlay').classList.remove('open'); }
