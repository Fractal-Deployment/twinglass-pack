#!/usr/bin/env bash
# S06 — monitor watches two objects only (SI + LCD).
# improper: LRR + SI + LCD together drifts.
# other-track: dual only; third object = overload refuse.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

APP="$ROOT/commands/run-apparatus.md"
GLOSS="$ROOT/skills/lcd-glossary-integrity/SKILL.md"
LENS="$ROOT/skills/lcd-lens/SKILL.md"

grep -q 'lcd-glossary-integrity' "$APP" && grep -q 'lcd-lens' "$APP" || red "run-apparatus missing SI+LCD monitor pair"
if grep -qi 'overload refuse' "$APP"; then
  pass "run-apparatus names overload refuse"
else
  red "run-apparatus missing overload refuse"
fi
if grep -q 'logic-ration-reason' "$APP" && grep -q 'research' "$APP"; then
  pass "LRR stays on research agent"
else
  red "LRR not pinned to research agent"
fi
grep -q 'overload' "$GLOSS" || grep -q 'two objects' "$GLOSS" || red "lcd-glossary missing dual-cap / overload"

if [[ "$fail" -ne 0 ]]; then
  echo "MONITOR_DUAL_RED fail=$fail"
  exit 1
fi
echo "MONITOR_DUAL_GREEN measured_omega=false"
exit 0
