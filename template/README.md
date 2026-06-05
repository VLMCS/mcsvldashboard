# Dashboard Template

A clean, self-contained copy of the dashboard — handbook + team directory +
search + admin tools — with **no existing content**. Each department/team that
uses it runs on **its own Firebase project**, so data is fully separate.

Setup is a one-time, in-browser wizard (`setup.html`). No build step, no
install. Total time: ~15 minutes.

---

## What you'll end up with

- A static website you host (GitHub Pages works great and is free).
- Your own Firebase/Firestore backend that all your visitors share in real time.
- Your branding (name, colors, logo), one starter category, and **you** set up
  as the first admin with a personal passkey + a master recovery key.

---

## Step 1 — Create your Firebase project

In the [Firebase console](https://console.firebase.google.com):

1. **Add project** → name it → (you can disable Google Analytics) → Create.
2. **Build → Firestore Database → Create database** → **Production mode** →
   choose a region.
3. **Build → Authentication → Get started → Sign-in method** → enable
   **Anonymous**.
4. **Authentication → Settings → Authorized domains** → **Add domain** for
   wherever you'll host (e.g. `yourname.github.io`). *(Add `localhost` too if you
   want to test locally.)*
5. **Firestore → Rules** tab → paste the contents of [`firestore.rules`](firestore.rules)
   from this folder → **Publish**.
6. **Project settings ⚙ → General → Your apps → `</>` (Web)** → register an app
   → copy the `firebaseConfig` object. You'll paste it in Step 3.

> The web config (apiKey, etc.) is **public by design** — it's safe to host.
> Your data is protected by the security rules + Anonymous Auth, not by hiding
> the config.

---

## Step 2 — Put the files online (GitHub Pages)

1. Create a new GitHub repository (Public is fine).
2. Upload everything in this `template/` folder to the repo root
   (`index.html`, `setup.html`, `styles.css`, `firebase-config.js`, `src/`, …).
3. Repo **Settings → Pages →** Source = **Deploy from a branch**, Branch =
   `main` / `/ (root)` → Save.
4. After a minute your site is live at
   `https://<you>.github.io/<repo>/`.

*(Any static host works — Netlify, Cloudflare Pages, internal web server, etc.
The only requirement is that the host's domain is in your Firebase Authorized
domains list from Step 1.4.)*

---

## Step 3 — Run the setup wizard (on the LIVE url)

> **Order matters.** Run the wizard at your **deployed URL**, not a local file.
> Your admin account is bound to the exact browser + domain you run it on, so it
> must be the domain you'll actually use.

1. Go to `https://<you>.github.io/<repo>/setup.html`.
2. **Connect:** paste the `firebaseConfig` you copied → **Connect & verify**.
3. **Branding:** dashboard name, studio, department, subtitle, favicon, theme
   colors, and your first category name.
4. **Admin profile:** your name + handle, and an admin-mode password.
5. **Create.** When it finishes you'll see, **once**:
   - your **personal passkey** (to sign in), and
   - your **master recovery key** (to manage admin access later).
   Copy both somewhere safe.
6. Click **Download `firebase-config.js`**, replace the placeholder file in your
   repo with it, and redeploy. *(If you already pasted your config into
   `firebase-config.js` before deploying, the wizard detects it and this is just
   a confirmation.)*

---

## Step 4 — Use it

- Open `index.html` and sign in with your passkey.
- Enter **Admin Mode** (your password) to add sections, entries, team members,
  quick links, announcements, and to tweak Site Settings any time.
- Add teammates from the **Team Directory** — each gets their own passkey.
- Optional: delete `setup.html` from your host once you're done.

---

## How the data is laid out (FYI)

Everything lives in your Firestore as per-entity collections:

| Collection / doc        | Holds                                            |
| ----------------------- | ------------------------------------------------ |
| `entries/{base__id}`    | handbook / project / category entries            |
| `sections/{base__num}`  | section definitions                              |
| `categories/{id}`       | extra sidebar categories you add                 |
| `team/{tmId}`           | team profiles (no passkeys)                      |
| `team-secrets/{tmId}`   | each member's passkey                            |
| `announcements/{id}`    | "What's new" posts                               |
| `site/main`             | branding + theme + search toggles                |
| `sidebar/main`          | quick-links groups                               |
| `synonyms/main`         | search synonym groups                            |
| `admins/{uid}`          | which devices are admins                         |
| `system/adminAuth`      | hashed admin password + recovery key             |
| `system/adminsBootstrapped` | one-time "first admin created" marker        |

---

## Troubleshooting

- **"auth/operation-not-allowed"** → enable **Anonymous** sign-in (Step 1.3).
- **"unauthorized domain" / sign-in popup blocked** → add your host's domain to
  **Authorized domains** (Step 1.4).
- **"permission-denied" during Create** → make sure you **published the rules**
  (Step 1.5) and that the project doesn't already have an admin.
- **Site loads but is empty / says single-user** → `firebase-config.js` still
  has the placeholder. Fill it in (or use the wizard's download) and redeploy.
- **Need a new admin device** → sign in as admin → **Admin Tools → Manage
  Admins**. Lost access entirely? Use your **master recovery key**.
