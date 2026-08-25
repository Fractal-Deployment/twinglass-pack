#!/usr/bin/env bash
# S03 — telos identity after two diverges.
# improper: spawn can drop working telos while LRR stays local.
# other-track: rewrite → 2 diverges → original telos named or SI redirect.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

PROBE="$ROOT/commands/telos-hold-probe.md"
RW="$ROOT/skills/honest-prompt-rewrite/SKILL.md"

if [[ -f "$PROBE" ]]; then
  pass "telos-hold-probe.md present"
else
  red "missing commands/telos-hold-probe.md"
fi

if [[ -f "$PROBE" ]]; then
  grep -q 'original telos' "$PROBE" || red "probe missing original telos"
  grep -qi 'diverge' "$PROBE" || red "probe missing diverge"
  grep -q 'SI redirect' "$PROBE" || red "probe missing SI redirect"
  grep -q 'silent telos swap' "$PROBE" || red "probe missing silent telos swap fail"
fi

if grep -q 'Telos does not move' "$RW"; then
  pass "rewrite holds Telos does not move"
else
  red "rewrite lost Telos does not move"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "TELOS_HOLD_RED fail=$fail"
  exit 1
fi
echo "TELOS_HOLD_GREEN measured_omega=false"
exit 0
