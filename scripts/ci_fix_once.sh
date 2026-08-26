#!/usr/bin/env bash
# Classify last failure. Does NOT edit product. Does NOT merge.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE=""
PR=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --pr) PR="${2:-}"; shift 2 ;;
    --fixture) FIXTURE="${2:-}"; shift 2 ;;
    --help|-h) echo "ci_fix_once.sh --pr N | --fixture FILE"; exit 0 ;;
    *) echo "unknown $1" >&2; exit 2 ;;
  esac
done
ARGS=()
if [[ -n "$FIXTURE" ]]; then ARGS=(--fixture "$FIXTURE")
elif [[ -n "$PR" ]]; then ARGS=(--pr "$PR")
else echo "need --pr or --fixture" >&2; exit 2
fi
set +e
OUT="$(node "$ROOT/scripts/lib/ci_poll.mjs" "${ARGS[@]}")"
EC=$?
set -e
CLASS="$(printf '%s\n' "$OUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{console.log(JSON.parse(s).REASON||"TEST_FAIL")}catch{console.log("TEST_FAIL")}})')"
echo "CLASS=$CLASS"
echo "POLL_EXIT=$EC"
echo "$OUT"
case "$CLASS" in
  TEST_FAIL) echo "REPRODUCE=node --experimental-strip-types --test engine/*.test.ts" ;;
  SEAL_FAIL) echo "REPRODUCE=bash scripts/pr-seal-check.sh && bash scripts/occupant-bleed-check.sh" ;;
  INFRA_FAIL) echo "REPRODUCE=sleep backoff; do not edit product" ;;
  PERMISSION) echo "REPRODUCE=HOLD PERMISSION — do not force-push main" ;;
  *) echo "REPRODUCE=bash scripts/local_gates.sh" ;;
esac
exit "$EC"
