#!/usr/bin/env bash
# S09 — FINISH_BOARD refresh after S01–S08.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }
B="$ROOT/FINISH_BOARD.md"
grep -q 'Occupant bleed \*\*landed\*\*' "$B" || grep -q 'Occupant bleed **landed**' "$B" || red "FINISH_BOARD Morph not marked landed"
if grep -q 'Not this commit' "$B"; then
  red "FINISH_BOARD still says Morph Not this commit"
else
  pass "Morph not stuck as Not this commit"
fi
if grep -q 'AGENT_FIVE_QUEUE' "$B" || grep -q 'S10' "$B"; then
  pass "FINISH_BOARD points at queue / S10"
else
  red "FINISH_BOARD missing next legal S10 / AGENT_FIVE_QUEUE"
fi
if [[ "$fail" -ne 0 ]]; then echo "FINISH_BOARD_RED fail=$fail"; exit 1; fi
exit 0
