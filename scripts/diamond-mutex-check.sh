#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }
CMD="$ROOT/commands/diamond-mutex.md"
ENG="$ROOT/engine/main-lattice.ts"
[[ -f "$CMD" ]] || red "missing commands/diamond-mutex.md"
if [[ -f "$CMD" ]]; then
  grep -q 'diamondId' "$CMD" || red "diamond-mutex missing diamondId"
  grep -qi 'hibernate' "$CMD" || red "diamond-mutex missing hibernate"
  grep -q 'enterCritiqueDiamond' "$CMD" || red "diamond-mutex missing enterCritiqueDiamond"
fi
grep -q 'another leg is already in diamond' "$ENG" || red "engine mutex string drifted"
if [[ "$fail" -ne 0 ]]; then echo "DIAMOND_MUTEX_RED fail=$fail"; exit 1; fi
echo "DIAMOND_MUTEX_GREEN measured_omega=false"
exit 0
