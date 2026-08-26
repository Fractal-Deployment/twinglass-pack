#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POLL=(node "$ROOT/scripts/lib/ci_poll.mjs")
expect() {
  local fx="$1" want="$2" label="$3"
  set +e
  "${POLL[@]}" --fixture "$ROOT/scripts/fixtures/$fx" >/tmp/ci_poll_out.json
  ec=$?
  set -e
  if [[ "$ec" != "$want" ]]; then
    echo "FAIL $label expected $want got $ec" >&2
    cat /tmp/ci_poll_out.json >&2
    exit 1
  fi
  echo "pass $label exit=$ec"
}
expect gh-pr-checks-green.json 0 green
expect gh-pr-checks-fail.json 2 fail
expect gh-pr-checks-pending.json 3 pending
expect gh-pr-checks-seal.json 2 seal
set +e
CLASS="$(bash "$ROOT/scripts/ci_fix_once.sh" --fixture "$ROOT/scripts/fixtures/gh-pr-checks-fail.json" | grep '^CLASS=')"
set -e
[[ "$CLASS" == "CLASS=TEST_FAIL" ]] || { echo "FAIL classify $CLASS" >&2; exit 1; }
echo "pass classify TEST_FAIL"
set +e
CLASS2="$(bash "$ROOT/scripts/ci_fix_once.sh" --fixture "$ROOT/scripts/fixtures/gh-pr-checks-seal.json" | grep '^CLASS=')"
set -e
[[ "$CLASS2" == "CLASS=SEAL_FAIL" ]] || { echo "FAIL classify $CLASS2" >&2; exit 1; }
echo "pass classify SEAL_FAIL"
echo '{"ok":true,"measured_omega":false}'
