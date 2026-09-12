#!/usr/bin/env bash
# PreToolUse: deny only when the TOOL ARG path is a session log.
# Do not grep the whole Grok envelope (it always contains .grok/sessions).
set -euo pipefail
input=$(cat || true)
paths=$(printf '%s' "$input" | jq -r '
  .tool_input // {}
  | [
      .target_file, .path, .file_path, .targetFile, .filePath, .filename
    ]
  | map(select(. != null and . != ""))
  | .[]
' 2>/dev/null || true)
if printf '%s' "$paths" | grep -qiE '\.grok/sessions|chat_history\.jsonl'; then
  printf '%s\n' '{"decision":"deny","reason":"contamination: session-log hunt is not a track"}'
  exit 0
fi
exit 0
