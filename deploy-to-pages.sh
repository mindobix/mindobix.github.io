#!/usr/bin/env bash
#
# Manual deploy of the Mindobix site to the public mindobix.github.io repo.
#
# Use this only when the GitHub Actions deploy (.github/workflows/deploy.yml)
# can't run (e.g. billing). It mirrors what the Action does, but from the
# COMMITTED tree (git archive) so no untracked/gitignored local files can
# leak, and it additionally drops internal docs that aren't site assets.
#
# Requires: gh CLI authenticated with push access to mindobix/mindobix.github.io.
#
#   bash deploy-to-pages.sh
#
set -euo pipefail

# Never drop into a pager (git diff/log default to `less`, which stops the
# script at a `:` prompt). Force plain, non-interactive output everywhere.
export GIT_PAGER=cat
export PAGER=cat
export GH_PAGER=cat
export GIT_TERMINAL_PROMPT=0

DEST_REPO="mindobix/mindobix.github.io"
DEST_BRANCH="master"
DEST_DIR="/tmp/mdbx-pages-dest"

# Internal/source-only files that must NOT be published.
EXCLUDES=( --exclude=CLAUDE.md --exclude=README.md --exclude=deploy-to-pages.sh )

# --- locate repo root + the commit we're deploying ---------------------------
SRC="$(git rev-parse --show-toplevel)"
cd "$SRC"
REF="$(git rev-parse HEAD)"
SHORT="$(git rev-parse --short HEAD)"
SUBJECT="$(git log -1 --pretty=%s)"

echo "Source repo : $SRC"
echo "Deploying   : $SHORT  ($SUBJECT)"
echo "Destination : $DEST_REPO ($DEST_BRANCH)"
echo

# Refuse to deploy a tree that has uncommitted changes — we publish the commit.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "WARNING: working tree has uncommitted changes; only commit $SHORT will be deployed."
fi

# --- clone destination --------------------------------------------------------
rm -rf "$DEST_DIR"
gh repo clone "$DEST_REPO" "$DEST_DIR" -- --depth=1

# --- repopulate dest from the committed tree (minus excludes) -----------------
find "$DEST_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
git archive "$REF" | tar -x -C "$DEST_DIR" "${EXCLUDES[@]}"

# The destination is a GitHub Pages repo and must NOT carry this repo's CI
# workflows. If deploy.yml ("Deploy to GitHub Pages") lands in
# mindobix.github.io, GitHub tries to RUN it there on every push and it
# fails in seconds (no secrets in that repo), spamming failure emails. The
# Actions deploy.yml already rsyncs with --exclude=.github; mirror that here.
rm -rf "$DEST_DIR/.github"

# --- review, commit, push -----------------------------------------------------
cd "$DEST_DIR"
git config user.email "deploy@mindobix.com"
git config user.name  "MindObix Deploy"
git add -A

echo
echo "=== changes to be deployed ==="
git diff --staged --stat
echo

if git diff --staged --quiet; then
  echo "No changes to deploy. Live site already matches $SHORT."
  exit 0
fi

git commit -q -m "Deploy: ${SUBJECT} (manual deploy of ${SHORT})"
git push origin "$DEST_BRANCH"

echo
echo "✓ Pushed to $DEST_REPO@$DEST_BRANCH."
echo "  GitHub Pages will rebuild mindobix.com in ~1-2 minutes."
