#!/usr/bin/env bash
# S16–S19: meet-mode test, HardNote docs, SENS CAP=10 board.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }

grep -q 'converge debate vs synthesis selection under lock' "$ROOT/engine/main-lattice.test.ts" \
  || red "missing meet-mode engine test"
grep -q 'improperEvidence' "$ROOT/engine/HARD_NOTE.md" || red "HARD_NOTE.md missing improperEvidence"
grep -q 'otherTrackEvidence' "$ROOT/engine/HARD_NOTE.md" || red "HARD_NOTE.md missing otherTrackEvidence"
grep -q 'CAP: 10' "$ROOT/commands/run-apparatus.md" || red "run-apparatus board missing CAP: 10"
grep -q 'STOP_OVER_CAP' "$ROOT/commands/run-apparatus.md" || red "run-apparatus missing STOP_OVER_CAP"

if [[ "$fail" -ne 0 ]]; then
  echo "S16_S19_RED fail=$fail"
  exit 1
fi
echo "S16_S19_GREEN"
exit 0
