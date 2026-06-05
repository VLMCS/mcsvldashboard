/* ══════════════════════════════════════════════════════════════
   DOM / data leaf utilities.
   Tiny side-effect-free helpers — loaded before app.js so the
   global names exist by the time anything calls them.
   ══════════════════════════════════════════════════════════════ */

// Deep clone via JSON. Fine for our data shapes (plain objects,
// arrays, strings, numbers, booleans). Does NOT preserve Date /
// Map / Set / functions — none of which appear in our data.
function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

// Strip HTML tags and collapse whitespace. Used for sidebar
// excerpts and search-result snippets that need the prose
// content of a rich-text body without any markup.
function stripHtml(h) {
  const d = document.createElement('div');
  d.innerHTML = h;
  return (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
}
