#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"
ZIP="$OUT/astra-x-backend-hostinger.zip"

mkdir -p "$OUT"

if [[ ! -f "$ROOT/backend/config/secrets.php" ]]; then
  echo "Missing backend/config/secrets.php — copy secrets.example.php and configure DB first." >&2
  exit 1
fi

rm -f "$ZIP"

(
  cd "$ROOT/backend"
  zip -r "$ZIP" . \
    -x "*.DS_Store" \
    -x "config/secrets.example.php"
)

echo "Created $ZIP"
echo "Upload and extract into public_html/ on Hostinger (site root)."
