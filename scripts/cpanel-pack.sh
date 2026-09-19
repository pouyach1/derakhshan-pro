#!/usr/bin/env bash
# Build a cPanel upload archive AFTER `npm run build:node`.
# Excludes Cloudflare artifacts, forensics dumps, and extractor scripts.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-"$ROOT/derakhshan-pro-cpanel.tgz"}"

cd "$ROOT"

if [[ ! -d .next ]]; then
  echo "Missing .next — run: npm run build:node" >&2
  exit 1
fi

tar -czf "$OUT" \
  --exclude='./node_modules' \
  --exclude='./.git' \
  --exclude='./.open-next' \
  --exclude='./.wrangler' \
  --exclude='./website-forensics' \
  --exclude='./extract-*.js' \
  --exclude='./index.js' \
  --exclude='./hero-video.mp4' \
  --exclude='./.env' \
  --exclude='./.env.local' \
  --exclude='./.dev.vars' \
  --exclude='./data/*.json' \
  --exclude='./derakhshan-pro-cpanel.tgz' \
  \
  ./package.json \
  ./package-lock.json \
  ./.npmrc \
  ./.nvmrc \
  ./.node-version \
  ./next.config.ts \
  ./tsconfig.json \
  ./tailwind.config.ts \
  ./postcss.config.js \
  ./server.cjs \
  ./open-next.config.ts \
  ./wrangler.jsonc \
  ./.env.example \
  ./CPANEL_DEPLOY.md \
  ./CPANEL_DEPLOY_CHECKLIST.md \
  ./README.md \
  ./public \
  ./src \
  ./scripts \
  ./docs \
  ./data \
  ./.next

echo "Created: $OUT"
echo "Note: upload node_modules separately via npm ci --omit=dev on the server,"
echo "      or include them if the host cannot install native modules."
echo "      Copy data/agency.json and set env vars in cPanel (never commit secrets)."
