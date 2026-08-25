#!/usr/bin/env bash
# S08 — per-path pendingProjection; south mark joins sealed paths only.
# improper: global pending blocks independent equator seals.
# other-track: engine pendingProjection is Partial<Record<EquatorId, true>>.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

CMD="$ROOT/commands/async-equator.md"
APP="$ROOT/APPARATUS.md"
ASYNC="$ROOT/ASYNC_TIMING.md"
ENG="$ROOT/engine/diamond-engine.ts"

[[ -f "$CMD" ]] || red "missing commands/async-equator.md"
if [[ -f "$CMD" ]]; then
  grep -q 'pendingProjection' "$CMD" || red "async-equator missing pendingProjection"
  grep -q 'per-path' "$CMD" || grep -q 'this path' "$CMD" || red "async-equator missing per-path pending"
  grep -qi 'south' "$CMD" || red "async-equator missing south mark"
fi

grep -q 'pendingProjection' "$ENG" || red "engine missing pendingProjection"
grep -q 'cannot mark before four pads are sealed' "$ENG" || red "engine south-mark seal gate drifted"

if grep -q 'per-path' "$APP" || grep -q 'pendingProjection' "$APP"; then
  pass "APPARATUS names per-path pending"
else
  red "APPARATUS missing per-path pendingProjection"
fi

grep -q 'async to each other' "$ASYNC" || red "ASYNC_TIMING lost equator async"

if [[ "$fail" -ne 0 ]]; then
  echo "ASYNC_EQUATOR_RED fail=$fail"
  exit 1
fi
echo "ASYNC_EQUATOR_GREEN measured_omega=false"
exit 0
