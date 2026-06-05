# `data/` — local working copies for content edits

This folder is where exported dashboard content lives **while it's being
edited**. The JSON files here are git-ignored (`data/*.json`) on purpose:
the site publishes to **public** GitHub Pages, and an admin-made backup can
contain handbook content and **plaintext passkeys**
(`src/data/model.js` → `dataMergeAdminPasskeys`). Keep them off the remote.

## The edit loop

1. **Export** — in the app: `⚙ Admin Tools… → 📤 Export backup`. Save the
   downloaded `vl-dashboard-backup.json` into this folder (e.g.
   `data/content.json`).
2. **Edit** — Claude reads/edits the file on disk. For a small change, it's
   best to produce a **patch file** containing only the records that changed
   (see "Partial / patch files" below) rather than re-importing everything.
3. **Merge import** — in the app: `⚙ Admin Tools… → 🔀 Merge import`, pick the
   edited file. Matching IDs are updated, new records are added, and
   **nothing is deleted**.

There's also a `📥 Import backup` (replace-all) for a full restore — it wipes
and replaces everything. Use **🔀 Merge import** for normal content edits.

## File shape

A full export (and any valid patch) is a JSON object with any of these keys:

| Key                | Shape          | Record identity        |
| ------------------ | -------------- | ---------------------- |
| `handbook`         | array          | `id`   (e.g. `"1.1"`)  |
| `projectEntries`   | array          | `id`                   |
| `sections`         | array          | `num`                  |
| `projects`         | array          | `num`                  |
| `customCategories` | array          | `id` (nested `sections` by `num`, `entries` by `id`) |
| `announcements`    | array          | `id`                   |
| `team`             | array          | `id`                   |
| `settings`         | object         | (shallow field-merge)  |
| `sidebar`          | array/object   | replaced if present    |
| `synonyms`         | array          | replaced if present    |

## Partial / patch files

Merge import only touches keys that are present, and within an array only the
records whose key matches. So the safest change is a minimal file:

```json
{
  "handbook": [
    { "id": "1.1", "title": "Onboarding", "body": "…edited text…" }
  ]
}
```

This updates only handbook entry `1.1` — every other entry, and every other
collection, is left exactly as-is. Field-level merge means fields you omit on
a matched record (e.g. an entry's `embedding`) are preserved.

> Heads-up: the merge upserts but never deletes. To remove a record you still
> use the in-app delete, not an import.
