#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
set +e
node "$ROOT/scripts/lib/telos.mjs" "$@"
EC=$?
set -e
exit "$EC"
