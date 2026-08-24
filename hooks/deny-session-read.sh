#!/usr/bin/env bash
# PreToolUse: deny sibling session-log reads. Fail-closed on this pattern only.
# Grok stdin = JSON (tool_name, tool_input, ...). Deny JSON on stdout, exit 0.
set -euo pipefail
input=$(cat || true)
if printf '%s' "$input" | grep -qiE '\.grok/sessions|chat_history\.jsonl'; then
  printf '%s\n' '{"decision":"deny","reason":"contamination: session-log hunt is not a track"}'
  exit 0
fi
exit 0
