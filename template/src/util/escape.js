/* ══════════════════════════════════════════════════════════════
   HTML / Attribute / JS-string escapers.

   These three utilities make it safe to interpolate arbitrary
   strings into HTML output. Loaded before app.js so the global
   functions exist by the time the rest of the codebase runs.
   ══════════════════════════════════════════════════════════════ */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function escAttr(s) {
  return String(s)
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Safe for embedding inside an onclick="foo('___')" style handler — survives BOTH
// HTML-attribute parsing AND the inner JS-string parsing. `escAttr` alone has a
// subtle bug: in `onclick="foo('${escJsAttr(s)}')"` it emits `&#39;` for `'`, but
// the HTML parser decodes that back to a bare `'` before handing the value to
// the JS parser, which then sees a prematurely-terminated string literal — the
// handler silently breaks (clicking does nothing). Encoding troublesome chars
// as JS escape sequences (`\xNN` / `\uNNNN`) avoids HTML decoding altogether —
// they reach the JS parser as escape sequences and evaluate to the right char.
function escJsAttr(s) {
  var out = '';
  var str = String(s);
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    var ch   = str.charAt(i);
    // Escape: backslash, both quote styles, newline, CR, tab, < > & (HTML-attr
    // boundary safety), and the JS-line-terminators U+2028 / U+2029.
    if (ch === '\\' || ch === "'" || ch === '"' ||
        code === 0x0A || code === 0x0D || code === 0x09 ||
        ch === '<'  || ch === '>'  || ch === '&' ||
        code === 0x2028 || code === 0x2029) {
      var hex = code.toString(16);
      if (code <= 0xff) {
        out += '\\x' + (hex.length < 2 ? '0' + hex : hex);
      } else {
        out += '\\u' + ('0000' + hex).slice(-4);
      }
    } else {
      out += ch;
    }
  }
  return out;
}
