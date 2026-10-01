#!/usr/bin/env bash
# Same-UID Landlock fixture for issue #50.
# PASS here is DEMO evidence only; real CLI runtime validation is still required for MEASURED.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/twinglass-landlock-build.XXXXXX")"
trap 'rm -rf "$BUILD_DIR"' EXIT

CC="${CC:-cc}"
"$CC" -std=c11 -O2 -Wall -Wextra -pedantic \
  "$ROOT/scripts/landlock-isolation-probe.c" \
  -o "$BUILD_DIR/landlock-isolation-probe"

set +e
OUTPUT="$("$BUILD_DIR/landlock-isolation-probe")"
RC=$?
set -e

printf '%s\n' "$OUTPUT"

case "$RC" in
  0)
    if [[ "$OUTPUT" != *'"claim_status":"DEMO"'* || "$OUTPUT" != *'"status":"PASS"'* ]]; then
      echo "FAIL: probe exited 0 without DEMO/PASS result" >&2
      exit 1
    fi
    ;;
  77)
    if [[ "$OUTPUT" != *'"status":"UNSUPPORTED"'* ]]; then
      echo "FAIL: probe returned skip code without UNSUPPORTED result" >&2
      exit 1
    fi
    echo "SKIP: running kernel does not expose a usable Landlock ABI; no isolation claim made."
    ;;
  *)
    echo "FAIL: Landlock isolation fixture failed (rc=$RC)" >&2
    exit "$RC"
    ;;
esac
