#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ "${AUTO_AGENT_REQUIRE_CLEAN:-1}" != "1" ]]; then
  echo "TREE=not-enforced"
  exit 0
fi
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "TREE=no-git"
  exit 0
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "TREE=dirty" >&2
  git status --porcelain >&2
  exit 1
fi
echo "TREE=clean"
echo "SHA=$(git rev-parse --short HEAD)"
exit 0
