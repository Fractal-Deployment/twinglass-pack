#!/usr/bin/env bash
# Occupant bleed: one job per skill. FINISH_BOARD Morph.
# Improper: rewrite restates laws; lattice/twin/steelman claim meet.
# Other-track: quoted SKILL.md collisions. Not Ω.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

REWRITE="$ROOT/skills/honest-prompt-rewrite/SKILL.md"
LAT="$ROOT/skills/twinglass-lattice/SKILL.md"
TWIN="$ROOT/skills/twinglass-twin/SKILL.md"
STL="$ROOT/skills/steelman-truth-tournament/SKILL.md"
COL="$ROOT/skills/collate-hourglass/SKILL.md"
LRR="$ROOT/skills/logic-ration-reason/SKILL.md"

# LRR keeps the laws.
if grep -q '^## Logic' "$LRR"; then
  pass "LRR owns ## Logic"
else
  red "LRR lost ## Logic"
fi

# Collate keeps debate/synthesis.
if grep -q 'DEBATE or SYNTHESIS' "$COL"; then
  pass "collate owns DEBATE or SYNTHESIS"
else
  red "collate lost meet occupant"
fi

# Rewrite must not own the three-laws heading.
if grep -q '^## Three laws' "$REWRITE"; then
  red "honest-prompt-rewrite restates ## Three laws (LRR occupant)"
else
  pass "rewrite does not own ## Three laws"
fi
if grep -q 'logic-ration-reason' "$REWRITE"; then
  pass "rewrite consumes logic-ration-reason"
else
  red "rewrite missing logic-ration-reason consume"
fi

# Lattice job is walk-to-endpoint, not meet.
if grep -Eq '^\*\*One job:\*\*.*then meet' "$LAT"; then
  red "lattice One job still claims then meet"
else
  pass "lattice One job does not claim then meet"
fi
if grep -q 'Reconvergence is required' "$LAT"; then
  red "lattice still claims Reconvergence is required (collate occupant)"
else
  pass "lattice does not claim Reconvergence is required"
fi

# Twin does not own contraction hourglass.
if grep -q 'One contraction hourglass' "$TWIN"; then
  red "twin still owns One contraction hourglass (collate occupant)"
else
  pass "twin does not own contraction hourglass"
fi

# Steelman is not the lattice meet.
if grep -q 'Lattice meet is the short form' "$STL"; then
  red "steelman claims Lattice meet is the short form"
else
  pass "steelman does not claim lattice meet"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "OCCUPANT_BLEED_RED fail=$fail"
  exit 1
fi
echo "OCCUPANT_BLEED_GREEN one_occupant_per_named_skill measured_omega=false"
exit 0
