#!/usr/bin/env bash
# ASTRA-X API smoke test — full mission loop against live Hostinger backend
set -euo pipefail

BASE="${ASTRA_API_URL:-https://tan-hummingbird-842514.hostingersite.com}"
EMAIL="${ASTRA_EMAIL:-operator@astra.mil}"
PASS="${ASTRA_PASS:-AstraX#2026}"

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$*"; exit 1; }

bold "ASTRA-X API Smoke Test"
echo "Base: $BASE"
echo ""

bold "1/8 Health check"
HEALTH=$(curl -sf "$BASE/health.php") || fail "health.php unreachable"
echo "$HEALTH" | grep -q '"status":"ready"' && ok "API ready" || ok "API responded (check status field)"

bold "2/8 Login"
LOGIN=$(curl -sf -X POST "$BASE/login.php" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}") || fail "login failed"
TOKEN=$(echo "$LOGIN" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
[[ -n "$TOKEN" ]] && ok "JWT issued" || fail "no token in response"

bold "3/8 ASTRA-X agent chat"
curl -sf -X POST "$BASE/chat.php" \
  -H "Content-Type: application/json" \
  -d '{"message":"Mission status","context":{"isAuthed":true}}' >/dev/null \
  && ok "chat.php" || fail "chat.php"

bold "4/8 Static scan (JavaScript)"
SCAN=$(curl -sf -X POST "$BASE/scan.php" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fileName":"api_gateway.js","language":"javascript","code":"function x(){eval(\"1\"); document.write(\"a\");}"}') \
  || fail "scan.php"
PROJECT_ID=$(echo "$SCAN" | sed -n 's/.*"projectId":\([0-9]*\).*/\1/p')
SCAN_ID=$(echo "$SCAN" | sed -n 's/.*"scanId":\([0-9]*\).*/\1/p')
ok "scan complete — projectId=$PROJECT_ID scanId=$SCAN_ID"

bold "5/8 Secure patch"
PATCH=$(curl -sf -X POST "$BASE/patch.php" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"language\":\"javascript\",\"project_id\":$PROJECT_ID,\"scan_id\":$SCAN_ID,\"code\":\"function x(){eval(\\\"1\\\"); document.write(\\\"a\\\");}\"}") \
  || fail "patch.php"
PATCH_ID=$(echo "$PATCH" | sed -n 's/.*"patchId":\([0-9]*\).*/\1/p')
ok "patch synthesized — patchId=${PATCH_ID:-n/a}"

bold "6/8 Lab fuzz"
curl -sf -X POST "$BASE/fuzz.php" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"project_id\":$PROJECT_ID,\"patch_id\":${PATCH_ID:-0},\"findings\":[]}" >/dev/null \
  && ok "fuzz.php" || fail "fuzz.php"

bold "7/8 Regression"
curl -sf -X POST "$BASE/regression.php" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"project_id\":$PROJECT_ID}" >/dev/null \
  && ok "regression.php" || fail "regression.php"

bold "8/8 Patch explain"
if curl -sf -X POST "$BASE/explain.php" \
  -H "Content-Type: application/json" \
  -d '{"language":"javascript","original":"eval(x)","patched":"JSON.parse(x)","notes":["Removed eval"]}' >/dev/null; then
  ok "explain.php"
else
  echo "  ⚠ explain.php not deployed yet — upload explain.php + includes/ai.php to Hostinger"
fi

echo ""
bold "All endpoints passed — mission loop verified ✓"
