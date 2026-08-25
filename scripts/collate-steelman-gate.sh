#!/usr/bin/env bash
# S04 — steelman only after collate names exclusive leftover.
# improper: meet defaults to tournament.
# other-track: exclusive leftover only after collate.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

STL="$ROOT/skills/steelman-truth-tournament/SKILL.md"
COL="$ROOT/skills/collate-hourglass/SKILL.md"

if grep -q 'collate-hourglass' "$STL" && grep -qi 'exclusive' "$STL"; then
  pass "steelman gated on collate exclusive leftover"
else
  red "steelman missing collate exclusive leftover gate"
fi

if grep -q 'steelman-truth-tournament' "$COL"; then
  pass "collate names steelman-truth-tournament"
else
  red "collate does not hand exclusive leftover to steelman"
fi

if grep -qi 'default meet' "$STL" || grep -qi 'not the lattice meet' "$STL" || grep -q 'Be the default meet' "$STL"; then
  pass "steelman is not the default meet"
else
  red "steelman does not refuse default meet"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "COLLATE_STEELMAN_RED fail=$fail"
  exit 1
fi
echo "COLLATE_STEELMAN_GREEN measured_omega=false"
exit 0
