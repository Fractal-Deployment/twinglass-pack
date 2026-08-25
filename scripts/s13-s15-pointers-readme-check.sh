#!/usr/bin/env bash
# S13–S15: lattice/twin thin pointers; README occupant column.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

LAT="$ROOT/commands/lattice.md"
TWIN="$ROOT/commands/twin.md"
README="$ROOT/README.md"

grep -q 'run-apparatus' "$LAT" || red "lattice.md missing run-apparatus"
grep -q 'twinglass-lattice' "$LAT" || red "lattice.md missing skills/twinglass-lattice pointer"
grep -q 'collate-hourglass' "$LAT" || red "lattice.md does not hand meet to collate-hourglass"
grep -q 'does not own meet' "$LAT" || red "lattice.md missing does not own meet"

grep -q 'twinglass-twin' "$TWIN" || red "twin.md missing twinglass-twin"
grep -q 'twinglass-lattice' "$TWIN" || red "twin.md must name lattice to refuse it"
grep -Eq 'never load with lattice|Do not load \*\*twinglass-lattice\*\*' "$TWIN" || red "twin.md missing never-with-lattice"

grep -q '| Occupant |' "$README" || red "README missing Occupant column"
grep -q 'collate-hourglass' "$README" && grep -q 'meet' "$README" || red "README occupant table missing collate meet"
# one lattice row, one twin row
lat_rows=$(grep -c '`twinglass-lattice`' "$README" || true)
twin_rows=$(grep -c '`twinglass-twin`' "$README" || true)
[[ "$lat_rows" -eq 1 ]] || red "README lattice rows=$lat_rows want 1"
[[ "$twin_rows" -eq 1 ]] || red "README twin rows=$twin_rows want 1"

if [[ "$fail" -ne 0 ]]; then
  echo "S13_S15_RED fail=$fail"
  exit 1
fi
echo "S13_S15_GREEN measured_omega=false"
exit 0
