#!/usr/bin/env bash
# S20–S24 close loop.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }

LENS="$ROOT/skills/lcd-lens/SKILL.md"
TR="$ROOT/skills/llmve-translate/SKILL.md"
RT="$ROOT/skills/reason-telos-lookup/SKILL.md"
FC="$ROOT/skills/llmve-factor-compute/SKILL.md"
APP="$ROOT/APPARATUS.md"
AHEAD="$ROOT/LATTICE_AHEAD.md"
FB="$ROOT/FINISH_BOARD.md"

# S20
grep -q 'llmve-translate' "$LENS" || red "lcd-lens missing translate pointer"
grep -qi 'not LCD' "$TR" || red "llmve-translate missing Not LCD"
if grep -Eqi 'One job:.*convert' "$LENS"; then red "lcd-lens One job claims convert"; fi
grep -q 'Do not convert' "$LENS" || red "lcd-lens missing Do not convert"

# S21
grep -q 'logic-ration-reason' "$RT" || red "reason-telos missing LRR pointer for laws"
grep -qi 'not meet' "$RT" || red "reason-telos missing not meet"
if grep -q '^## Logic' "$RT"; then red "reason-telos owns ## Logic (LRR occupant)"; fi
if grep -q 'DEBATE or SYNTHESIS' "$RT"; then red "reason-telos claims meet"; fi

# S22
grep -q 'HOLD' "$FC" || red "factor-compute missing HOLD"
grep -qi 'dumps' "$FC" || red "factor-compute missing dumps refuse"
grep -qi 'operator' "$FC" || red "factor-compute missing operator gate"

# S23
grep -q 'assertLegalSpawnNote' "$APP" || red "APPARATUS.md missing assertLegalSpawnNote"
grep -q 'cannotFollow' "$APP" || red "APPARATUS.md missing cannotFollow-alone note"

# S24
grep -q 'landed' "$AHEAD" || red "LATTICE_AHEAD missing landed marks"
grep -q 'S02' "$AHEAD" || grep -q 'CLI spawn-lock' "$AHEAD" || red "LATTICE_AHEAD missing CLI spawn-lock row update"
grep -q 'drained\|S10–S24\|queue drained' "$FB" || red "FINISH_BOARD missing drained/residual pointer"

if [[ "$fail" -ne 0 ]]; then
  echo "S20_S24_RED fail=$fail"
  exit 1
fi
echo "S20_S24_GREEN measured_omega=false"
exit 0
