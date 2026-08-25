#!/usr/bin/env bash
# S05 — LCD empty meet looks elsewhere; does not translate.
# improper: monitor converts empty meet into help/translate.
# other-track: collection ∩ demand empty → redirect, not convert.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

LENS="$ROOT/skills/lcd-lens/SKILL.md"
TR="$ROOT/skills/llmve-translate/SKILL.md"

grep -q 'look elsewhere' "$LENS" || red "lcd-lens missing look elsewhere"
if grep -q 'let-fail' "$LENS"; then
  pass "lcd-lens names let-fail"
else
  red "lcd-lens missing let-fail on empty meet"
fi
if grep -q 'empty meet' "$LENS" && grep -q 'look elsewhere' "$LENS"; then
  pass "empty meet paired with look elsewhere"
else
  red "empty meet not tied to look elsewhere"
fi

if grep -q 'Not LCD' "$TR" || grep -q 'not LCD' "$TR"; then
  pass "llmve-translate is not LCD"
else
  red "llmve-translate does not refuse LCD occupant"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "LCD_LOOK_RED fail=$fail"
  exit 1
fi
echo "LCD_LOOK_GREEN measured_omega=false"
exit 0
