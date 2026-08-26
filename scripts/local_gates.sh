#!/usr/bin/env bash
# Pack-real gates. No soft green. measured_omega=false
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail=0
run() {
  echo "+ $*"
  if ! "$@"; then
    echo "FAIL: $*" >&2
    fail=1
  fi
}
run node --experimental-strip-types --test engine/*.test.ts
run bash scripts/pr-seal-check.sh
run bash scripts/occupant-bleed-check.sh
run bash scripts/tests/ci_poll.test.sh
if [[ "$fail" -ne 0 ]]; then
  echo "local_gates FAIL"
  exit 1
fi
echo "local_gates OK measured_omega=false"
exit 0
