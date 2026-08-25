#!/usr/bin/env bash
# S10–S12: fork-sens / clone-experiment / clone-paces match engine spawn lock.
# Volume gates on clone-paces must stay.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

need_lock() {
  local f="$1" name="$2"
  [[ -f "$f" ]] || { red "missing $name"; return; }
  grep -q 'improperEvidence' "$f" || red "$name missing improperEvidence"
  grep -q 'otherTrackEvidence' "$f" || red "$name missing otherTrackEvidence"
  grep -Eq 'SPAWN_REFUSED|assertLegalSpawnNote' "$f" || red "$name missing SPAWN_REFUSED or assertLegalSpawnNote"
  grep -Eq 'synonym' "$f" || red "$name missing synonym refuse"
  grep -Eq 'antithesis' "$f" || red "$name missing antithesis refuse"
}

need_lock "$ROOT/commands/fork-sens.md" "fork-sens.md"
need_lock "$ROOT/commands/clone-experiment.md" "clone-experiment.md"
need_lock "$ROOT/commands/clone-paces.md" "clone-paces.md"

PAC="$ROOT/commands/clone-paces.md"
if [[ -f "$PAC" ]]; then
  grep -q 'Forced volume' "$PAC" || red "clone-paces dropped Forced volume"
  grep -q '8' "$PAC" && grep -q '12' "$PAC" && grep -q '24' "$PAC" || red "clone-paces volume minima 8/12/24 missing"
  pass "clone-paces volume gates present"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "S10_S12_ALIGN_RED fail=$fail"
  exit 1
fi
echo "S10_S12_ALIGN_GREEN measured_omega=false"
exit 0
