#!/usr/bin/env bash
# S02 PROXY — docs/strings vs engine throw text. Not a CLI process suite.
# improper: engine can pass while CLI clones on any cannotFollow.
# other-track: run-apparatus.md vs engine refuse paths.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

CLI="$ROOT/commands/cli-spawn-lock.md"
APP="$ROOT/commands/run-apparatus.md"
ENG="$ROOT/engine/main-lattice.ts"

if [[ -f "$CLI" ]]; then
  pass "cli-spawn-lock.md present"
else
  red "missing commands/cli-spawn-lock.md"
fi

if [[ -f "$CLI" ]]; then
  grep -q 'improperEvidence' "$CLI" || red "cli-spawn-lock missing improperEvidence"
  grep -q 'otherTrackEvidence' "$CLI" || red "cli-spawn-lock missing otherTrackEvidence"
  grep -q 'SPAWN_REFUSED' "$CLI" || red "cli-spawn-lock missing SPAWN_REFUSED"
  grep -Eq 'cannotFollow.{0,3} alone is' "$CLI" || red "cli-spawn-lock missing cannotFollow-alone is not a spawn"
  if grep -q 'assertLegalSpawnNote' "$CLI"; then
    pass "cli-spawn-lock names assertLegalSpawnNote"
  else
    red "cli-spawn-lock missing assertLegalSpawnNote"
  fi
fi

grep -q 'improper-track evidence' "$APP" || red "run-apparatus missing improper-track evidence"
grep -q 'other-track evidence' "$APP" || red "run-apparatus missing other-track evidence"
if grep -q 'SPAWN_REFUSED' "$APP"; then
  pass "run-apparatus board has SPAWN_REFUSED"
else
  red "run-apparatus board missing SPAWN_REFUSED"
fi

grep -q 'spawn refuses: improper-track evidence required' "$ENG" || red "engine lock string drifted"
grep -q 'spawn refuses: other-track evidence required' "$ENG" || red "engine other-track string drifted"

if [[ "$fail" -ne 0 ]]; then
  echo "CLI_SPAWN_LOCK_RED fail=$fail"
  exit 1
fi
echo "CLI_SPAWN_LOCK_PROXY_GREEN measured_omega=false"
exit 0
