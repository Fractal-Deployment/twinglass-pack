#!/usr/bin/env bash
# I2: HardNote evidence fields required; tests must not lie with as never.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

if grep -n 'as never' "$ROOT/engine/spawn-lock.test.ts"; then
  red "spawn-lock.test.ts uses as never (type lie)"
else
  pass "spawn-lock.test.ts has no as never"
fi
if grep -n 'improperEvidence?.trim' "$ROOT/engine/main-lattice.ts"; then
  red "assertLegalSpawnNote optional-chains required improperEvidence"
else
  pass "improperEvidence.trim without ?."
fi
if grep -n 'otherTrackEvidence?.trim' "$ROOT/engine/main-lattice.ts"; then
  red "assertLegalSpawnNote optional-chains required otherTrackEvidence"
else
  pass "otherTrackEvidence.trim without ?."
fi

if [[ "$fail" -ne 0 ]]; then
  echo "HARDNOTE_TYPE_RED fail=$fail"
  exit 1
fi
echo "HARDNOTE_TYPE_GREEN measured_omega=false"
exit 0
