#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Turnkey, programmatic Scalingo deployment for Agora.
# Mirrors the hackathon workflow: create the app, provision the Redis addon,
# push via git, scale the container, then verify in production.
#
# Prerequisites:
#   - SCALINGO_API_TOKEN exported (from https://dashboard.scalingo.com -> API tokens)
#   - git remote 'origin' already pushed to GitHub (optional but recommended)
#
# Usage:
#   SCALINGO_API_TOKEN=tk-xxx ./scripts/deploy-scalingo.sh agora-demo osc-fr1
# ----------------------------------------------------------------------------
set -euo pipefail

APP_NAME="${1:-agora-agentic-tutor}"
REGION="${2:-osc-fr1}"

say() { printf "\n\033[1;35m▶ %s\033[0m\n" "$1"; }

if ! command -v scalingo >/dev/null 2>&1; then
  say "Installing the Scalingo CLI"
  curl -sSL https://cli-dl.scalingo.com/install | bash
  export PATH="$HOME/bin:$PATH"
fi

: "${SCALINGO_API_TOKEN:?Set SCALINGO_API_TOKEN before running this script}"

say "Logging in to Scalingo"
scalingo login --api-token "$SCALINGO_API_TOKEN"

say "Creating app '$APP_NAME' in region '$REGION' (ignore error if it exists)"
scalingo --region "$REGION" create "$APP_NAME" || true

say "Provisioning the Redis addon"
scalingo --region "$REGION" --app "$APP_NAME" addons-add redis redis-starter-512 || \
  echo "Redis addon may already exist — continuing."

say "Configuring environment"
scalingo --region "$REGION" --app "$APP_NAME" env-set NODE_ENV=production MAX_RUN_STEPS=60

say "Adding the Scalingo git remote and pushing"
scalingo --region "$REGION" --app "$APP_NAME" git-setup
git push scalingo "$(git rev-parse --abbrev-ref HEAD):master"

say "Scaling the web container"
scalingo --region "$REGION" --app "$APP_NAME" scale web:1:S

say "Tailing recent logs"
scalingo --region "$REGION" --app "$APP_NAME" logs -n 50 || true

APP_URL="https://${APP_NAME}.${REGION}.scalingo.io"
say "Verifying production endpoints at $APP_URL"
curl -fsS "$APP_URL/api/health" && echo
SMOKE_URL="$APP_URL" node scripts/smoke-test.mjs || echo "Smoke test reported issues — inspect logs."

say "Done. Open the app:"
echo "  $APP_URL"
