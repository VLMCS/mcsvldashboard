// Entry point for the modular VL Dashboard refactor.
//
// Currently a no-op placeholder. The original inline <script> in index.html
// still runs the app end-to-end. Subsequent PRs incrementally move code from
// that inline script into modules under src/, in the order:
//
//   PR-2  src/firebase.js + src/auth/  (Anonymous Auth + bind flow)
//   PR-3  src/data/                    (per-entity collection CRUD)
//   PR-4  migrate.html + migrate.js    (one-time single-doc → collections)
//   PR-5  Flip USE_NEW_DATA_MODEL flag; remove old single-doc code
//   PR-6  Deploy firestore.rules, bootstrap admin, remove ADMIN_PW
//   PR-7  Convert inline onclick → delegated events; drop escJsAttr
//   PR-8  Admin Firestore usage viewer + base64 orphan cleanup
//
// Once PR-2 lands, index.html will load this module via
//   <script type="module" src="src/main.js"></script>
//
// in addition to the inline <script>. The two coexist until the inline
// script is fully drained.
