#!/usr/bin/env bash
# I1: push to main must schedule the same engine test command as PRs.
# Root cause: pr-checks.yml on: pull_request only.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WF="$ROOT/.github/workflows/pr-checks.yml"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

grep -q 'pull_request:' "$WF" || red "workflow missing pull_request"
if grep -A20 '^on:' "$WF" | grep -q '^  push:'; then
  pass "on.push present"
else
  red "on.push missing (pull_request-only: engine never runs on main tip)"
fi
if grep -A40 '^on:' "$WF" | grep -q 'main'; then
  pass "on.push.branches includes main"
else
  red "on.push.branches does not include main"
fi
grep -q 'node --experimental-strip-types --test engine/\*\.test.ts' "$WF" \
  || grep -q 'engine/\*.test.ts' "$WF" \
  || red "workflow missing engine/*.test.ts command"

if [[ "$fail" -ne 0 ]]; then
  echo "CI_PUSH_ENGINE_RED fail=$fail"
  exit 1
fi
echo "CI_PUSH_ENGINE_GREEN measured_omega=false"
exit 0
