# PROJECT: Mindobix Website

> Last updated: 2026-04-25 — keep this file current. If something here is wrong, fix it before doing anything else.

---

## 1. What This Is

The marketing and portfolio site for **Mindobix**, Ganesh Subramanian's AI-powered software development consulting practice. It hosts the company narrative ("Vibe Coding"), the catalog of apps and libraries built with Claude Code, and the consulting offer (fixed-bid / monthly retainer, no hourly billing). The site doubles as a live showcase: GitHub clone counts for every tracked repo are pulled daily and rendered as social proof on the home and portfolio pages.

**Stage:** Production (publicly live at mindobix.com)
**Primary user:** Prospective consulting clients evaluating Ganesh, plus developers browsing the open-source apps and libraries.
**Success metric:** Inbound consulting inquiries to ganesh@mindobix.com and clone counts on the showcased GitHub repos.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Markup | Plain HTML5 | One `.html` file per page at repo root. No templating engine. |
| Styling | Hand-written CSS | Single shared sheet at [css/main.css](css/main.css); page-specific styles inline in `<style>` blocks at the top of each HTML file. CSS variables in `:root` define the design tokens. |
| Scripting | Vanilla JavaScript (ES5/ES6, no modules) | Plain `<script defer>` tags. No bundler, no transpiler. |
| Data | Static JSON files in [data/](data/) | Updated by a GitHub Action; read by the browser via `fetch`. |
| Analytics | Google Analytics 4 (`G-V460QPM640`) | Inline `gtag.js` snippet in the `<head>` of every page. |
| Hosting | GitHub Pages on a custom domain | [CNAME](CNAME) → `mindobix.com`. |
| Deployment | GitHub Actions | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) syncs this repo to the public `mindobix/mindobix.github.io` repo on every push to `master`. |
| Data sync | GitHub Actions cron (daily, 06:00 UTC) | [.github/workflows/sync-clones.yml](.github/workflows/sync-clones.yml) fetches GitHub Traffic API clone counts for every repo in `data/tracked-repos.json` and commits the results. |

**Build tooling:** None. There is no `package.json`, no `node_modules`, no `npm`/`pnpm`/`yarn`. Do not introduce one without asking.
**Node:** Not required to develop. Only the GitHub Action runners use Node.
**Local dev:** Open the `.html` files directly in a browser, or serve the directory with any static server (`python3 -m http.server`, etc.).

---

## 3. Project Structure

```
/
├── index.html              # Home page
├── about.html              # About Ganesh
├── consulting.html         # Consulting offer
├── analysis.html           # AI Analysis page
├── useful-apps.html        # Apps catalog (grid of cards)
├── top-apps.html           # Apps ranked by clone count
├── app.html                # Per-app detail page (?id=<slug> query param)
├── android.html            # Android Kotlin demo app
├── android-lib.html        # Per-Android-library detail (?id=<slug>)
├── apple.html              # Apple Swift demo app
├── ios-lib.html            # Per-iOS-library detail (?id=<slug>)
├── api-framework.html      # API Framework overview
├── cc-api-framework.html   # CC API Framework detail
├── cc-apis-demo-monorepo.html
├── devtools.html           # Developer tools
├── sam.html                # SAM Framework
├── privacy.html            # Privacy policy
│
├── css/
│   └── main.css            # All shared styles + design tokens
├── js/
│   ├── site-chrome.js      # Injects shared <nav> and <footer> into every page
│   ├── apps-meta.js        # The single source of truth for app/library metadata
│   └── clone-badges.js     # Renders clone-count badges on app cards
├── data/
│   ├── tracked-repos.json  # List of GitHub repos to fetch traffic for
│   ├── clones.json         # Cumulative totals per repo (rendered by the site)
│   └── clones-history.json # Daily history, used to recompute totals
│
├── subdomains/             # Per-app marketing landing pages (each is its own GitHub Pages site)
│   └── tradingjournal/
│       ├── index.html      # Standalone, SEO-optimized landing page
│       ├── CNAME           # tradingjournal.mindobix.com
│       ├── robots.txt
│       └── sitemap.xml
│
├── .github/workflows/
│   ├── deploy.yml          # Push master → mindobix.github.io + each subdomain repo
│   └── sync-clones.yml     # Daily clone-count sync
│
├── CNAME                   # Custom domain (mindobix.com) — DO NOT remove
└── .claude/
    └── settings.local.json # Local permission allowlist (gitignored)
```

**Conventions:**
- Every page has `<div id="site-nav-mount"></div>` near the top of `<body>` and `<div id="site-footer-mount"></div>` near the bottom. [js/site-chrome.js](js/site-chrome.js) replaces these at load time. Do not hand-write nav/footer HTML in pages.
- Every page sets `<body data-page="<key>">` so `site-chrome.js` can mark the active nav link. Keys live in the `ACTIVE_MAP` table in that file.
- The Google Analytics snippet must be the **first** thing inside `<head>` on every page. The current tag is `G-V460QPM640` — do not change it without being asked.
- Every app/library shown anywhere on the site MUST have an entry in [js/apps-meta.js](js/apps-meta.js). That file is the single catalog. Adding an app means: (1) add it to `apps-meta.js`, (2) add its repo to `data/tracked-repos.json` if you want clone tracking, (3) link to it from the relevant page.

---

## 4. Coding Standards

**HTML**
- Hand-written, indented two spaces. Match the existing house style (lots of inline `style=` attributes for one-off tweaks; that is intentional, not tech debt).
- Self-contained per page. Each page can be opened directly in a browser without a server.
- Always include the GA snippet, the `<meta name="viewport">` tag, the `<link>` to `css/main.css`, the `data-page` body attribute, and the two chrome mount points.

**CSS**
- Use the design tokens defined in `:root` of `css/main.css` (`--navy`, `--accent`, `--text`, `--surface`, `--border`, etc.). Do not hardcode brand colors.
- Page-specific styles go in a `<style>` block in that page's `<head>`. Truly shared styles (anything used by 2+ pages) go in `main.css`.
- Mobile breakpoint is `@media (max-width: 768px)`.

**JavaScript**
- Vanilla ES5/ES6. No frameworks, no modules, no JSX, no TypeScript, no build step.
- IIFE wrappers (`(function () { 'use strict'; ... })();`) for top-level scripts — match the pattern in `site-chrome.js`.
- Use `<script defer src="...">` to load. Do not block the parser.
- `fetch()` for data files; cache-bust with `{ cache: 'no-cache' }` when reading the JSON in `data/`.
- Guard for missing DOM elements before touching them — pages share scripts but not all pages have all mount points.

**Naming**
- HTML files: `kebab-case.html`.
- JS/CSS files: `kebab-case.js` / `kebab-case.css`.
- App/repo slugs in `apps-meta.js`: keep them identical to the GitHub repo name (the slug is used as the lookup key against the GitHub API and `data/clones.json`).

---

## 5. What I Am Building Right Now

**Current focus:** Maintenance and incremental polish — adding new apps to the catalog, tweaking copy, and keeping the clone-count showcase accurate.

**Out of scope (do not touch unless asked):**
- Introducing a build system, framework, or package manager.
- Replacing vanilla JS with TypeScript or any framework.
- Adding analytics tags beyond the existing GA4 (`G-V460QPM640`).
- Touching the `mindobix.github.io` destination repo directly — this repo is the source of truth and Actions deploys it.

---

## 6. How I Want You to Work

**Before writing code**
- Read the relevant page(s) and the relevant shared file (`main.css`, `site-chrome.js`, `apps-meta.js`) before editing. Don't guess at structure.
- For changes touching more than 2 pages, propose a plan first and wait for approval. The same visual element often appears on many pages.
- If a request is ambiguous, ask one clarifying question rather than assuming.

**While writing code**
- Match the existing style. Inline styles, IIFEs, vanilla JS — don't "modernize" without being asked.
- If you change the shared chrome (nav, footer, GA snippet, common styles), the change ripples to every page automatically via `site-chrome.js` / `main.css`. Verify across a few pages before declaring done.
- New app on the site? Update `js/apps-meta.js` AND `data/tracked-repos.json` together — they must stay in sync.
- No placeholder content, no `// implement later`. The site is live.

**After writing code**
- Summarize which files changed.
- For visible changes, suggest opening the affected pages in a browser to verify (`open index.html`). You cannot test the UI from the terminal — say so explicitly rather than claiming it works.
- Mention any pages that share the changed component but were not directly opened for verification.

**Communication**
- Be direct. Skip the praise.
- If I'm wrong about something, tell me.
- Length should match the task. One-line answers for one-line questions.

---

## 7. Hard Rules — Never Do These

- **Never** read, write, modify, or reference `.env`, `.env.local`, or any file matching `*secret*`, `*credentials*`, `*key*`, `*token*`, `*password*`. There are no secrets in this repo by design — deploy keys live in GitHub Actions secrets only.
- **Never** commit or push to git without my explicit instruction in that same message. **Pushing to `master` triggers an immediate production deploy to mindobix.com via GitHub Actions** — treat every push as a production release.
- **Never** force-push to `master` (`git push --force`, `git push -f`).
- **Never** delete files. Move them, rename them, or ask — but do not delete. In particular, never delete or modify [CNAME](CNAME) (it controls the custom domain) or anything under `.github/workflows/`.
- **Never** edit the `mindobix/mindobix.github.io` destination repo. It is overwritten by `deploy.yml` on every push.
- **Never** edit the GitHub Action workflow files (`.github/workflows/*.yml`) without explicit confirmation. They have shell-injection-safe patterns (read [deploy.yml](.github/workflows/deploy.yml) — `HEAD_COMMIT_MSG` is intentionally piped through env + a heredoc, not interpolated). Don't simplify that away.
- **Never** introduce a build system, package manager, framework, or transpiler without asking first. The "no build step" property is load-bearing.
- **Never** change the Google Analytics measurement ID (`G-V460QPM640`) or remove the snippet from any page.
- **Never** hand-edit `data/clones.json` or `data/clones-history.json`. They are regenerated by [.github/workflows/sync-clones.yml](.github/workflows/sync-clones.yml) from the GitHub Traffic API. Edit `data/tracked-repos.json` instead if you want to add/remove tracked repos.
- **Never** run destructive shell commands (`rm -rf`, `git reset --hard`, etc.) without explicit confirmation.

---

## 8. Security and Privacy Defaults

- All URLs in HTML/JS are hand-authored. Do not generate or interpolate user-supplied strings into href/src without escaping. (There is no user input on this site, so the risk is low — but the rule stands.)
- All third-party scripts go through `<script async>` or `<script defer>` from a known CDN (currently only Google's `googletagmanager.com`). No new third-party scripts without asking.
- The GitHub Action [deploy.yml](.github/workflows/deploy.yml) treats commit messages as untrusted input (env var → file → `git commit -F`). If you touch that workflow, preserve that pattern — see commit `f63f793` for the fix history.
- No PII is collected on the site beyond what GA4 records by default. Do not add forms, login, or any backend.

---

## 9. Git Workflow

- Default branch is **`master`** (not `main`). Pushes to `master` deploy to production immediately.
- Commit messages: imperative mood, descriptive subject, body explaining *why* if non-obvious. Match the existing log style (see `git log --oneline -20`).
- One logical change per commit.
- Before any commit: show me the staged diff and the proposed message. Wait for approval.
- For risky changes, work on a branch (`type/short-description`, e.g. `feat/new-app-card`, `fix/nav-mobile`) and open a PR rather than pushing to `master`.

---

## 10. Common Commands

```bash
# Open a page locally in the default browser (no server needed)
open index.html
open useful-apps.html

# Or serve the directory if you need clean URLs / fetch() over file://
python3 -m http.server 8000     # then visit http://localhost:8000

# Inspect deploy and data-sync runs
gh run list --workflow=deploy.yml
gh run list --workflow=sync-clones.yml

# Manually trigger the daily clone sync (instead of waiting for cron)
gh workflow run sync-clones.yml
```

There is no `pnpm`, `npm`, `yarn`, `build`, `test`, or `lint` command in this project. If a command isn't in this list, ask before running it.

---

## 11. Skills and Routines

Reusable workflows live in `.claude/skills/` (none defined yet). If you find yourself repeating the same multi-step instruction to me, suggest turning it into a skill.

---

## 12. Important Context

**The "live from GitHub" feature.** The home page and `top-apps.html` rank the apps by lifetime `git clone` count. Those numbers come from `data/clones.json`, which is regenerated daily by [.github/workflows/sync-clones.yml](.github/workflows/sync-clones.yml) using the GitHub Traffic API (`getClones`). The Traffic API only returns the last 14 days, so `clones-history.json` is the long-term store and `clones.json` is just the rolled-up totals derived from it. Do not delete `clones-history.json` — losing it loses everything before the last 14 days of clone data.

**Deploy is two-stage.** A push to `master` here triggers `deploy.yml`, which `rsync`s the working tree into a clone of `mindobix/mindobix.github.io` and pushes that. The `sync-clones.yml` action also chains into `deploy.yml` on success (via `workflow_run`), so the daily clone-count refresh redeploys the site automatically.

**Per-app subdomains.** Each folder under [subdomains/](subdomains/) is a self-contained marketing/SEO landing page that gets deployed to its own GitHub Pages repo. The repo name is derived from the folder's `CNAME` file — e.g. `subdomains/tradingjournal/CNAME` containing `tradingjournal.mindobix.com` deploys to `mindobix/tradingjournal.mindobix.com`. The `Deploy subdomain landing pages` step in [deploy.yml](.github/workflows/deploy.yml) loops over `subdomains/*/`, clones each destination repo via HTTPS+PAT (`SUBDOMAIN_DEPLOY_TOKEN` secret), rsyncs, and pushes. The step skips silently if the secret is missing, so it doesn't break the main-site deploy. Subdomain pages are intentionally standalone — they don't use `site-chrome.js` or `css/main.css` (different domain, different repo). They reuse the same GA4 tag (`G-V460QPM640`) for unified analytics. To add a new subdomain: (1) create `subdomains/<name>/` with `index.html` + `CNAME` + `robots.txt` + `sitemap.xml`, (2) create the empty `mindobix/<cname>` repo with an initial commit on `master`, (3) enable Pages in that repo's settings (source: `master` branch, root, custom domain matching the CNAME), (4) add the Route 53 `CNAME` record pointing to `mindobix.github.io.`.

**The chrome is dynamic, the rest is not.** `<nav>` and `<footer>` are injected by [js/site-chrome.js](js/site-chrome.js) at runtime. Everything else (hero, sections, cards) is hand-written per page. Do not be surprised that the same hero pattern is duplicated across pages — that is the chosen tradeoff for "no build step."

**Decisions log (don't relitigate):**
- We chose vanilla HTML/CSS/JS over any framework because the site is small, the team is one person, and the AI agents that maintain it work better with plain files than with a framework's conventions. Don't suggest switching.
- We chose GitHub Pages + a separate destination repo over Vercel/Netlify because the source repo contains workflow history and design notes we don't want public. Don't suggest a unified setup.
- We removed Google Ads in commit `5a03d91`. GA4 is the only tag now. Don't add Ads back without being asked.
