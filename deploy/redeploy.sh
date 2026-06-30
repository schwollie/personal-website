#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

COMPOSE_FILES=(-f docker/docker-compose.yml)
ROOT="$(pwd)"

if ! docker network inspect proxy >/dev/null 2>&1; then
  echo "Docker network 'proxy' not found. Start ~/reverse-proxy first:" >&2
  echo "  cd ~/reverse-proxy && ./deploy/restart.sh" >&2
  exit 1
fi

echo "Building static site..."
npm ci
npm run build

if [ ! -d out ]; then
  echo "Build failed: out/ directory not found." >&2
  exit 1
fi

echo "Docker: $(docker -v)"
echo "Redeploying personal website (nginx on shared proxy network)..."
docker compose --project-directory "$ROOT" "${COMPOSE_FILES[@]}" up -d --force-recreate --remove-orphans

echo "Done. Site URL: https://christiansen-lars.de"
echo ""
echo "After content changes, run ./deploy/redeploy.sh to rebuild and redeploy."
echo "Hard-refresh the browser (Ctrl+Shift+R) if cached assets still show."
echo "Ensure reverse-proxy is running: cd ~/reverse-proxy && ./deploy/restart.sh"
