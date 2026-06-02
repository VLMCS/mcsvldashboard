/* ══════════════════════════════════════════
   KPI CSV PARSER
   Reads the quarterly Key-Performance-Indicator CSV exported from Google
   Sheets (see "KPI CSV Export Test - KPI Form - Art Directors.csv" for the
   reference template). The parser is STRICT: it expects the exact 4-category
   × 5-metric template, with required header fields (Name, Position,
   Evaluator Name, Evaluator Position, Scope) and a Scope cell of exactly
   "Q[1-4]-YYYY" (single, exact match — multiple values, missing year, or
   freeform text are rejected). On invalid input it returns
   { ok:false, error:"…" } so the upload UI can surface a clear message.
   ══════════════════════════════════════════ */

// Low-level CSV → 2D-array parser. Handles RFC-4180-style double-quoted
// cells that may contain commas and embedded newlines (Google Sheets emits
// these for multiline cells — the metric title+description rows depend on
// this). Doubled "" inside a quoted cell unescapes to a single ".
function _parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  const len = text.length;
  for (let i = 0; i < len; i++) {
    const ch = text[i];
    const next = i + 1 < len ? text[i + 1] : '';
    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell); cell = '';
      } else if (ch === '\n' || ch === '\r') {
        // Normalize CRLF — consume the LF after CR.
        if (ch === '\r' && next === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else {
        cell += ch;
      }
    }
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

function _kpiCell(rows, r, c) {
  return (rows[r] && rows[r][c] !== undefined) ? String(rows[r][c]).trim() : '';
}

// Public parser. Returns { ok:true, data:{…} } or { ok:false, error:"…" }.
function parseKpiCsv(text) {
  const rows = _parseCsv(text);
  if (!rows.length) return { ok: false, error: 'CSV is empty.' };

  // 1) Sniff: must look like a KPI sheet at all. The Google-Sheets template
  //    has the literal text "Key Performance Indicator" in row 2 col 2.
  const hasKpiMarker = rows.some(r =>
    (r || []).some(c => String(c || '').trim() === 'Key Performance Indicator')
  );
  if (!hasKpiMarker) return {
    ok: false,
    error: 'This doesn\'t look like a KPI form CSV — missing the "Key Performance Indicator" header.'
  };

  // 2) Header labels: find each by exact match in column 2. STRICT — each
  //    label must appear EXACTLY ONCE so we can't accidentally pick up a
  //    duplicate "Scope:" in a comment or copy-pasted section.
  const findExactlyOne = (label) => {
    const hits = [];
    for (let i = 0; i < rows.length; i++) {
      if (_kpiCell(rows, i, 2) === label) hits.push(i);
    }
    return hits;
  };
  const must = (label) => {
    const hits = findExactlyOne(label);
    if (hits.length === 0) return { error: `Missing "${label}" header row.` };
    if (hits.length > 1) return { error: `Multiple "${label}" rows found — there must be exactly one.` };
    return { row: hits[0] };
  };

  const checks = ['Name:', 'Position/Job Level:', 'Evaluator Name:', 'Evaluator Position:', 'Scope:']
    .map(L => ({ label: L, ...must(L) }));
  for (const c of checks) if (c.error) return { ok: false, error: c.error };
  const [nameRow, positionRow, evalNameRow, evalPosRow, scopeRow] = checks.map(c => c.row);

  // 3) Scope — the single most important validation per the spec. Must be
  //    EXACTLY "Q[1-4]-YYYY" in col 4 of the Scope row, with no other
  //    quarter-looking string anywhere else in the file. Reject otherwise.
  const scopeText = _kpiCell(rows, scopeRow, 4);
  const scopeMatch = /^Q([1-4])-(\d{4})$/.exec(scopeText);
  if (!scopeMatch) return {
    ok: false,
    error: 'Scope cell must be exactly "Q1-YYYY", "Q2-YYYY", "Q3-YYYY", or "Q4-YYYY" ' +
           '(e.g. "Q1-2026"). Found: ' + (scopeText ? `"${scopeText}"` : '(empty)') + '.'
  };
  // Additional sanity: make sure no OTHER cell in the sheet contains a
  // standalone "Q[1-4]-YYYY" string. (Comments mentioning quarters in
  // free-form prose like "Q1 review" are fine; the strict pattern is what
  // we're guarding against — "multiple values" per the spec.)
  let strayScope = null;
  for (let i = 0; i < rows.length; i++) {
    if (i === scopeRow) continue;
    for (let c = 0; c < (rows[i] || []).length; c++) {
      const v = _kpiCell(rows, i, c);
      if (/^Q[1-4]-\d{4}$/.test(v)) { strayScope = { row: i, col: c, value: v }; break; }
    }
    if (strayScope) break;
  }
  if (strayScope) return {
    ok: false,
    error: `Multiple scope values detected — extra "${strayScope.value}" found outside the Scope row. Only one scope per CSV.`
  };

  const scopeQuarter = parseInt(scopeMatch[1], 10);
  const scopeYear    = parseInt(scopeMatch[2], 10);

  // 4) Header meta — straightforward text reads.
  const nameVal             = _kpiCell(rows, nameRow, 4);
  const positionVal         = _kpiCell(rows, positionRow, 4);
  const evaluatorName       = _kpiCell(rows, evalNameRow, 4);
  const evaluatorPosition   = _kpiCell(rows, evalPosRow, 4);
  const overallScoreRaw     = _kpiCell(rows, positionRow, 10);
  const overallScore        = parseFloat(overallScoreRaw);
  const overallLabel        = _kpiCell(rows, scopeRow, 10);

  // 5) Find category title rows. A category header is a row where col 1 has
  //    text and ALL other columns are empty. Exclude the topmost "Key
  //    Performance Indicator" marker and the "Score Range" sub-headers.
  const categoryStarts = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || [];
    const c1 = (r[1] || '').trim();
    if (!c1) continue;
    if (c1 === 'Score Range' || c1 === 'Key Performance Indicator') continue;
    const restEmpty = r.slice(2).every(c => !String(c || '').trim());
    if (!restEmpty) continue;
    categoryStarts.push({ rowIdx: i, title: c1 });
  }
  if (categoryStarts.length !== 4) return {
    ok: false,
    error: `Expected exactly 4 categories, found ${categoryStarts.length}.`
  };

  // 6) Parse each category in turn. Within the row range belonging to that
  //    category, locate the rating header row ("5,4,3,2,1,,Score"), the
  //    subtotal row immediately below it, and 5 metric rows.
  const categories = [];
  for (let i = 0; i < 4; i++) {
    const start = categoryStarts[i];
    const end   = i + 1 < 4 ? categoryStarts[i + 1].rowIdx : rows.length;

    // Score Range descriptions: rows where col 1 = "Score Range", col 4 is
    // the rating (5..1), col 5 is the description text.
    const scoreDescriptions = { 1:'', 2:'', 3:'', 4:'', 5:'' };
    for (let k = start.rowIdx; k < end; k++) {
      if (_kpiCell(rows, k, 1) === 'Score Range') {
        const rating = parseInt(_kpiCell(rows, k, 4), 10);
        if (rating >= 1 && rating <= 5) scoreDescriptions[rating] = _kpiCell(rows, k, 5);
        // continue — there are 5 of these rows but only the first has the
        // "Score Range" label. The rest below just have the rating in col 4.
        // Read continuation: scan downward while col 4 is 1..5.
        for (let k2 = k + 1; k2 < end; k2++) {
          const ratingRaw = _kpiCell(rows, k2, 4);
          const rating2 = parseInt(ratingRaw, 10);
          if (rating2 >= 1 && rating2 <= 5 && !_kpiCell(rows, k2, 1)) {
            scoreDescriptions[rating2] = _kpiCell(rows, k2, 5);
          } else if (ratingRaw === '' && !_kpiCell(rows, k2, 5)) {
            // empty row — keep scanning a couple rows before giving up
            continue;
          } else {
            break;
          }
        }
        break;
      }
    }

    // Rating header row.
    let headerRowIdx = -1;
    for (let k = start.rowIdx; k < end; k++) {
      if (_kpiCell(rows, k, 3) === '5' && _kpiCell(rows, k, 4) === '4' &&
          _kpiCell(rows, k, 5) === '3' && _kpiCell(rows, k, 6) === '2' &&
          _kpiCell(rows, k, 7) === '1' && _kpiCell(rows, k, 9) === 'Score') {
        headerRowIdx = k; break;
      }
    }
    if (headerRowIdx < 0) return {
      ok: false,
      error: `Category "${start.title}" is missing the rating header row (5,4,3,2,1,,Score).`
    };
    const subtotalRowIdx = headerRowIdx + 1;
    const subtotal = parseFloat(_kpiCell(rows, subtotalRowIdx, 9)) || 0;

    // Metric rows: scan from subtotal+1 forward. A metric row has a non-
    // empty col 1 (title+description) AND non-trivial rating cells. A
    // comment row has empty col 1 and "Comments/Recommendations:" in col 3.
    const metrics = [];
    for (let k = subtotalRowIdx + 1; k < end && metrics.length < 5; k++) {
      const titleDesc = (rows[k] && rows[k][1] || '').trim();
      if (!titleDesc) continue;
      if (_kpiCell(rows, k, 3) === 'Comments/Recommendations:') continue;

      const ratingCells = [3, 4, 5, 6, 7].map(c => parseFloat(_kpiCell(rows, k, c)) || 0);
      // Cells map left→right to ratings 5,4,3,2,1.
      let rating = 0, score = 0;
      for (let m = 0; m < 5; m++) {
        if (ratingCells[m] > 0) {
          rating = 5 - m;
          score  = ratingCells[m];
          break;
        }
      }
      // Cell at col 8 is the per-metric total. Fall back to `score` if blank.
      const total  = parseFloat(_kpiCell(rows, k, 8));
      const finalScore = isFinite(total) && total > 0 ? total : score;
      const weight   = rating > 0 ? +(finalScore / rating).toFixed(3) : 0;
      const maxScore = +(weight * 5).toFixed(3);

      const lines = titleDesc.split(/\r?\n/);
      const mTitle = (lines[0] || '').trim();
      const mDesc  = lines.slice(1).join('\n').trim();

      // Comment lives in the very next row, col 4 onwards (concatenate any
      // non-empty cells in case the comment was split across columns).
      let comment = '';
      const commentRow = rows[k + 1] || [];
      if ((commentRow[3] || '').trim() === 'Comments/Recommendations:') {
        comment = commentRow.slice(4).map(c => String(c || '').trim()).filter(Boolean).join(' ').trim();
      }

      metrics.push({ title: mTitle, description: mDesc, rating, weight, score: finalScore, maxScore, comment });
    }
    if (metrics.length !== 5) return {
      ok: false,
      error: `Category "${start.title}" has ${metrics.length} metrics; expected 5.`
    };

    // Max-subtotal: subtotal is the average of metric scores, so the
    // theoretical max is also the average of metric maxes.
    const maxSubtotal = +(metrics.reduce((a, m) => a + m.maxScore, 0) / 5).toFixed(3);
    categories.push({ title: start.title, scoreDescriptions, subtotal, maxSubtotal, metrics });
  }

  // Overall max = sum of all four category max-subtotals.
  const overallMax = +categories.reduce((a, c) => a + c.maxSubtotal, 0).toFixed(3);

  return {
    ok: true,
    data: {
      meta: {
        name: nameVal,
        position: positionVal,
        evaluatorName,
        evaluatorPosition,
        scope: { quarter: scopeQuarter, year: scopeYear, key: `${scopeYear}-Q${scopeQuarter}`, raw: scopeText },
        overall: isFinite(overallScore) ? overallScore : 0,
        overallMax: overallMax || 100,
        overallLabel
      },
      categories,
      _parsedAt: Date.now()
    }
  };
}
