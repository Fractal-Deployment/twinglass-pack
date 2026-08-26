#!/usr/bin/env bash
# Lowest open S after S00–S24 drain: look for OPEN / not-landed in AGENT_FIVE_QUEUE.md
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
Q="${AUTO_AGENT_QUEUE:-$ROOT/AGENT_FIVE_QUEUE.md}"
if [[ ! -f "$Q" ]]; then
  echo "QUEUE_MISSING" >&2
  exit 1
fi
NEXT="$(grep -E '\| S[0-9]+ \|' "$Q" | grep -vi 'landed' | grep -E 'OPEN|open' | head -1 || true)"
if [[ -z "$NEXT" ]]; then
  echo "NEXT=DRAINED"
  exit 1
fi
ID="$(printf '%s\n' "$NEXT" | grep -oE 'S[0-9]+' | head -1)"
echo "NEXT=$ID"
echo "TITLE=$NEXT"
exit 0
