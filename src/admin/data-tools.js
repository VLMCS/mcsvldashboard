/* ══════════════════════════════════════════════════════════════
   ADMIN · DATA & STORAGE TOOLS  (Phase B — #3 cleanup + #4 viewer)

   New-model only. An admin-mode panel that:
   • #4 USAGE VIEWER: walks every Firestore collection on demand, sums
     approximate byte sizes, shows per-collection counts + a total vs
     the Spark 1 GiB Firestore quota, and flags any entry doc nearing
     the hard 1 MiB per-doc limit (e.g. a big inline base64 image).
   • #3 ORPHAN CLEANUP: finds docs that nothing references anymore —
     entries/sections under a deleted category, team-secrets/kpis for a
     removed member, project-secrets/unlocks for a removed project,
     /users bindings to a deleted member, plus a tally of inline base64
     images — and lets the admin review and delete them.

   All reads are getDocs walks (admin-triggered, occasional — well under
   the Spark 50k/day cap). Deletes are admin-only (the rules enforce it).
   ══════════════════════════════════════════════════════════════ */

const _DT_COLLS = ['entries', 'sections', 'categories', 'team', 'team-secrets',
  'kpis', 'project-secrets', 'project-unlocks', 'announcements', 'users', 'admins', 'system'];
const _DT_SINGLETONS = [['site', 'main'], ['sidebar', 'main'], ['synonyms', 'main']];
const _DT_FS_QUOTA_BYTES = 1024 * 1024 * 1024;   // Spark: 1 GiB Firestore
const _DT_DOC_LIMIT_BYTES = 1024 * 1024;         // hard 1 MiB per-doc limit

let _dtOrphans = [];   // [{coll, id, why}] from the last scan

function _dtBytes(obj) { try { return JSON.stringify(obj).length; } catch (e) { return 0; } }
function _dtFmt(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}
function _dtCountBase64(entries) {
  let count = 0, bytes = 0;
  const re = /data:image\/[a-zA-Z0-9.+-]+;base64,([^"')\s]+)/g;
  for (const e of entries) {
    const html = String((e.data && e.data.content) || ''); let m;
    while ((m = re.exec(html)) !== null) { count++; bytes += Math.floor(m[1].length * 0.75); }
  }
  return { count, bytes };
}

async function openDataTools() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  if (!USE_NEW_DATA_MODEL) { showToast('Available after the data-model migration.'); return; }
  if (!_fbReady) { showToast('Reconnect to view storage.'); return; }
  let ov = document.getElementById('data-tools-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'data-tools-overlay';
    ov.className = 'admin-modal-overlay';
    ov.innerHTML =
      '<div class="admin-modal" style="max-width:640px">' +
        '<h3 style="margin:0 0 4px">Data &amp; Storage</h3>' +
        '<p style="font-size:12.5px;color:var(--text-sub);margin:0 0 12px">Firestore usage and orphaned-document cleanup. Reads are computed on demand.</p>' +
        '<div id="data-tools-body" style="max-height:62vh;overflow-y:auto"></div>' +
        '<div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">' +
          '<button class="btn btn-secondary" id="data-tools-rescan">↻ Rescan</button>' +
          '<button class="btn btn-primary" id="data-tools-close">Done</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#data-tools-close').onclick = () => ov.classList.remove('open');
    ov.querySelector('#data-tools-rescan').onclick = () => _dtScanAndRender();
  }
  ov.classList.add('open');
  _dtScanAndRender();
}

async function _dtScanAndRender() {
  const body = document.getElementById('data-tools-body');
  if (!body) return;
  body.innerHTML = '<div style="color:var(--mid);font-size:13px;padding:12px">Scanning Firestore…</div>';
  let scan;
  try { scan = await _dtScan(); }
  catch (e) { body.innerHTML = '<div class="err" style="color:#c0392b">Scan failed: ' + escapeHtml(e.message) + '</div>'; return; }

  // ── Usage table ──
  let total = 0;
  const rows = scan.collections.map(c => { total += c.bytes; return c; });
  total += scan.singletonBytes;
  const pct = Math.min(100, (total / _DT_FS_QUOTA_BYTES) * 100);

  const usageHtml =
    '<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mid);font-weight:700;margin:4px 0 8px">Firestore usage</div>' +
    '<div style="height:10px;background:var(--bg-form-input);border:1px solid var(--border);border-radius:999px;overflow:hidden;margin-bottom:6px">' +
      '<div style="height:100%;width:' + pct.toFixed(3) + '%;background:' + (pct > 80 ? '#c0392b' : 'var(--admin-accent)') + '"></div></div>' +
    '<div style="font-size:12px;color:var(--text-sub);margin-bottom:12px">' + _dtFmt(total) + ' of 1 GiB (' + pct.toFixed(pct < 1 ? 4 : 1) + '%) · Spark free tier</div>' +
    '<table class="pk-table"><thead><tr><th>Collection</th><th style="text-align:right">Docs</th><th style="text-align:right">Size</th></tr></thead><tbody>' +
    rows.map(c => c.denied
      ? '<tr style="color:#c0392b"><td>' + escapeHtml(c.name) + '</td><td colspan="2" style="text-align:right">🔒 not readable</td></tr>'
      : '<tr><td>' + escapeHtml(c.name) + '</td><td style="text-align:right">' + c.count + '</td><td style="text-align:right">' + _dtFmt(c.bytes) + '</td></tr>'
    ).join('') +
    '<tr><td>site/sidebar/synonyms</td><td style="text-align:right">3</td><td style="text-align:right">' + _dtFmt(scan.singletonBytes) + '</td></tr>' +
    '</tbody></table>' +
    (scan.denied && scan.denied.length
      ? '<div style="margin-top:10px;padding:8px 12px;background:#fdf0ec;border-left:3px solid #c0392b;border-radius:3px;font-size:12px">' +
        '<strong>Couldn’t read:</strong> ' + escapeHtml(scan.denied.join(', ')) +
        '. Your published Firestore rules are blocking these for this admin — usage totals + orphan checks for them are skipped. ' +
        '(If you expected fully-permissive rules, they may not be the ones currently published.)</div>'
      : '');

  // ── Large-doc + base64 notices ──
  let notices = '';
  if (scan.largeDocs.length) {
    notices += '<div style="margin-top:12px;padding:8px 12px;background:#fdf0ec;border-left:3px solid #c0392b;border-radius:3px;font-size:12px">' +
      '<strong>' + scan.largeDocs.length + ' doc(s) near the 1 MiB per-doc limit:</strong> ' +
      escapeHtml(scan.largeDocs.map(d => d.id + ' (' + _dtFmt(d.bytes) + ')').join(', ')) + '</div>';
  }
  notices += '<div style="margin-top:8px;font-size:12px;color:var(--text-sub)">Inline base64 images in entries: <strong>' +
    scan.base64.count + '</strong> (~' + _dtFmt(scan.base64.bytes) + ')</div>';

  // ── Orphans ──
  _dtOrphans = scan.orphans;
  let orphanHtml = '<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mid);font-weight:700;margin:18px 0 8px">Orphaned documents</div>';
  if (!scan.orphans.length) {
    orphanHtml += '<div style="font-size:13px;color:#3a7;">✓ No orphans found — nothing to clean up.</div>';
  } else {
    const byWhy = {};
    scan.orphans.forEach(o => { (byWhy[o.why] = byWhy[o.why] || []).push(o); });
    orphanHtml += '<div style="font-size:12px;color:var(--text-sub);margin-bottom:8px">' + scan.orphans.length + ' orphaned doc(s) — safe to delete:</div>';
    orphanHtml += Object.keys(byWhy).map(why =>
      '<div style="margin-bottom:6px;font-size:12.5px"><strong>' + escapeHtml(why) + '</strong> (' + byWhy[why].length + '): ' +
      '<span style="color:var(--mid)">' + escapeHtml(byWhy[why].slice(0, 12).map(o => o.coll + '/' + o.id).join(', ')) + (byWhy[why].length > 12 ? ' …' : '') + '</span></div>'
    ).join('');
    orphanHtml += '<div style="margin-top:10px"><button class="btn btn-danger" id="data-tools-clean">🗑 Delete ' + scan.orphans.length + ' orphan(s)</button></div>';
  }

  body.innerHTML = usageHtml + notices + orphanHtml;
  const cleanBtn = document.getElementById('data-tools-clean');
  if (cleanBtn) cleanBtn.onclick = _dtDeleteOrphans;
}

async function _dtScan() {
  // Read each collection independently — a permission denial on one (e.g. the
  // per-user /users or /project-unlocks under locked rules) must NOT abort the
  // whole scan. Track which collections we couldn't read.
  const got = {};
  const denied = [];
  for (const c of _DT_COLLS) {
    try {
      const snap = await _fb_getDocs(_fb_collection(_fbDb, c));
      got[c] = snap.docs.map(d => ({ id: d.id, data: d.data() }));
    } catch (e) {
      got[c] = []; denied.push(c);
      console.warn('data-tools: could not read /' + c + ' —', e && e.code);
    }
  }
  const readable = (c) => denied.indexOf(c) === -1;

  let singletonBytes = 0;
  for (const [coll, id] of _DT_SINGLETONS) {
    try { const s = await _fb_getDoc(_fb_doc(_fbDb, coll, id)); if (s.exists()) singletonBytes += _dtBytes(s.data()); } catch (e) {}
  }

  const collections = _DT_COLLS.map(name => ({
    name, denied: !readable(name),
    count: got[name].length,
    bytes: got[name].reduce((a, d) => a + _dtBytes(d.data) + d.id.length, 0)
  }));

  // Large docs (near 1 MiB) — almost always an entry with a big base64 image.
  const largeDocs = [];
  for (const name of _DT_COLLS) for (const d of got[name]) {
    const b = _dtBytes(d.data);
    if (b > _DT_DOC_LIMIT_BYTES * 0.7) largeDocs.push({ id: name + '/' + d.id, bytes: b });
  }

  const base64 = _dtCountBase64(got.entries);

  // ── Orphan detection ── (only run a check when every collection it relies on
  // was actually readable, so a permission gap can't produce false orphans.)
  const orphans = [];
  const catIds = new Set(got.categories.map(c => c.id));
  const validBases = new Set(['handbook', 'projects', ...catIds]);
  const tmIds = new Set(got.team.map(t => t.id));
  const projSectionIds = new Set(got.sections.filter(s => s.data.base === 'projects').map(s => 'projects__' + s.data.num));

  if (readable('entries') && readable('categories'))
    for (const e of got.entries)  if (!validBases.has(e.data.base)) orphans.push({ coll: 'entries', id: e.id, why: 'Entry under a deleted category' });
  if (readable('sections') && readable('categories'))
    for (const s of got.sections) if (!validBases.has(s.data.base)) orphans.push({ coll: 'sections', id: s.id, why: 'Section under a deleted category' });
  if (readable('team-secrets') && readable('team'))
    for (const s of got['team-secrets']) if (!tmIds.has(s.id)) orphans.push({ coll: 'team-secrets', id: s.id, why: 'Passkey for a removed member' });
  if (readable('kpis') && readable('team'))
    for (const k of got.kpis) if (!tmIds.has(String(k.id).split('__')[0])) orphans.push({ coll: 'kpis', id: k.id, why: 'KPI for a removed member' });
  if (readable('users') && readable('team'))
    for (const u of got.users) if (u.data.tmId && !tmIds.has(u.data.tmId)) orphans.push({ coll: 'users', id: u.id, why: 'Login binding to a removed member' });
  if (readable('project-secrets') && readable('sections'))
    for (const p of got['project-secrets']) if (!projSectionIds.has(p.id)) orphans.push({ coll: 'project-secrets', id: p.id, why: 'Passkey for a removed project section' });
  if (readable('project-unlocks') && readable('sections'))
    for (const u of got['project-unlocks']) {
      const sid = String(u.id).split('__').slice(1).join('__');   // strip uid prefix → 'projects__num'
      if (!projSectionIds.has(sid)) orphans.push({ coll: 'project-unlocks', id: u.id, why: 'Unlock for a removed project section' });
    }

  return { collections, singletonBytes, largeDocs, base64, orphans, denied };
}

async function _dtDeleteOrphans() {
  if (!_dtOrphans.length) return;
  if (!await customConfirm('Permanently delete ' + _dtOrphans.length + ' orphaned document(s)? This cannot be undone.', { danger: true, confirmLabel: 'Delete orphans' })) return;
  let ok = 0, fail = 0;
  for (const o of _dtOrphans) {
    try { await _fb_deleteDoc(_fb_doc(_fbDb, o.coll, o.id)); ok++; }
    catch (e) { fail++; console.error('orphan delete failed:', o, e); }
  }
  showToast('Deleted ' + ok + ' orphan(s)' + (fail ? ', ' + fail + ' failed' : ''));
  _dtScanAndRender();
}
