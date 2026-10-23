# Mindobix Website

Marketing and portfolio site for **Mindobix** — Ganesh Subramanian's AI-powered software development consulting practice. Live at [mindobix.com](https://mindobix.com).

## What's Here

- Company narrative ("Vibe Coding" — building production software with Claude Code AI agents)
- Catalog of 15+ free, local-first apps built with Claude Code
- **App Store** (`/appstore`) — browse, download, and run every app in one place
- Mobile architecture libraries (Android Kotlin + Apple Swift)
- API framework showcase
- Consulting offer (fixed-bid / monthly retainer, no hourly billing)
- Live GitHub clone counts as social proof, updated daily

## Tech Stack

Plain HTML5 · Hand-written CSS · Vanilla JavaScript (ES5/ES6) · No build step · No framework · No package manager

Static files served by **GitHub Pages** at `mindobix.com`. A GitHub Actions cron job fetches clone counts from the GitHub Traffic API daily and commits them to `data/clones.json`.

## Local Development

No install step. Just serve the directory:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open any `.html` file directly in a browser (most pages work without a server; `fetch()` calls to `data/` require a server).

## Project Structure

```
/
├── index.html              # Home page
├── useful-apps.html        # Apps catalog
├── top-apps.html           # Apps ranked by clone count
├── app.html                # Per-app detail (?id=<slug>)
├── about.html              # About Ganesh
├── consulting.html         # Consulting offer
├── analysis.html           # AI Analysis
├── android.html / apple.html
├── android-lib.html / ios-lib.html
├── api-framework.html / cc-api-framework.html / cc-apis-demo-monorepo.html
├── devtools.html / sam.html
├── privacy.html
│
├── appstore/
│   └── index.html          # App Store — browse & download all apps
│
├── css/
│   └── main.css            # Shared styles + design tokens (:root CSS variables)
│
├── js/
│   ├── site-chrome.js      # Injects <nav>, App Store promo band, and <footer> on every page
│   ├── apps-meta.js        # Single source of truth for all app/library metadata
│   └── clone-badges.js     # Renders clone-count badges on app cards
│
├── data/
│   ├── tracked-repos.json  # Repos to track (edit this to add/remove tracking)
│   ├── clones.json         # Cumulative clone totals (auto-generated — do not hand-edit)
│   └── clones-history.json # Daily history (auto-generated — do not hand-edit)
│
├── subdomains/
│   └── tradingjournal/     # Standalone SEO landing page → tradingjournal.mindobix.com
│
└── .github/workflows/
    ├── deploy.yml          # Deploys master → mindobix.github.io on every push
    └── sync-clones.yml     # Daily clone-count sync (triggers a redeploy on success)
```

## Adding a New App

1. **`js/apps-meta.js`** — add an entry with `name`, `category`, `icon`, `href`, `group: "Useful App"`, `repoUrl`, `desc`, `tags`, `iconClass`, `badgeClass`, `badgeText`
2. **`data/tracked-repos.json`** — add the repo slug to start tracking clone counts
3. **`useful-apps.html`** — add a card in the appropriate category section
4. **`app.html`** — add a detail entry in the `APPS` object (tagline, highlights, stats, forWho)
5. The **App Store** (`appstore/index.html`) picks up the app automatically from `apps-meta.js` + `clones.json`

## Shared Chrome

`js/site-chrome.js` injects three things into every page via mount elements:

| Mount element | Replaced with |
|---|---|
| `<div id="site-nav-mount">` | `<nav>` (top navigation bar) |
| `<div id="site-footer-mount">` | App Store promo band + `<footer>` |

The App Store promo band is skipped on pages with `data-page="useful-apps"` (covers `useful-apps.html` and `appstore/index.html`, which both have their own App Store entry points).

## Deployment

Every push to `master` triggers `deploy.yml`, which rsyncs the working tree to `mindobix/mindobix.github.io` and pushes. That repo is GitHub Pages source — do not edit it directly.

Subdomain landing pages under `subdomains/*/` are deployed to separate repos (e.g. `mindobix/tradingjournal.mindobix.com`) via the same workflow using the `SUBDOMAIN_DEPLOY_TOKEN` secret.

## Key Rules

- **Never** commit or push without explicit instruction — pushes to `master` deploy to production immediately
- **Never** hand-edit `data/clones.json` or `data/clones-history.json`
- **Never** remove or modify `CNAME` or `.github/workflows/`
- **Never** introduce a build system, framework, or package manager
- GA4 tag is `G-V460QPM640` — do not change it

See `CLAUDE.md` for the full coding conventions and AI agent instructions.
