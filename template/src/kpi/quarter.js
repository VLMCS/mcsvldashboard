/* ══════════════════════════════════════════════════════════════
   KPI quarter helpers.
   Pure date/quarter arithmetic — used by the KPI upload UI to
   block future quarters and by the year/quarter picker to mark
   "missing" past quarters.
   ══════════════════════════════════════════════════════════════ */

// Returns { year, quarter } for the given Date (defaults to now).
// Quarter is 1-4: Jan-Mar=1, Apr-Jun=2, Jul-Sep=3, Oct-Dec=4.
function _currentQuarter(date) {
  const d = date || new Date();
  return { year: d.getFullYear(), quarter: Math.floor(d.getMonth() / 3) + 1 };
}

// True if (year, quarter) is strictly in the future relative to today.
function _isFutureQuarter(year, quarter) {
  const cur = _currentQuarter();
  if (year > cur.year) return true;
  if (year === cur.year && quarter > cur.quarter) return true;
  return false;
}

// Canonical string key for a quarter — e.g., `2026-Q2`.
function _scopeKey(year, quarter) {
  return `${year}-Q${quarter}`;
}
