#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail() { echo "FAIL: $*" >&2; exit 1; }
PATHS=(
  "$ROOT/README.md"
  "$ROOT/APPARATUS.md"
  "$ROOT/FINISH_EVIDENCE.md"
  "$ROOT/commands"
  "$ROOT/skills"
  "$ROOT/engine"
)
if grep -RIq --include='*.md' --include='*.ts' --include='*.json' 'train_ok=false\|train_ok=true' "${PATHS[@]}"; then
  echo "hits:" >&2
  grep -RIn --include='*.md' --include='*.ts' 'train_ok=' "${PATHS[@]}" >&2 || true
  fail "train_ok still used as a seal in live pack files"
fi
if grep -RIq --include='*.md' --include='*.ts' --include='*.json' 'feeds_omega=' "${PATHS[@]}"; then
  grep -RIn --include='*.md' 'feeds_omega=' "${PATHS[@]}" >&2 || true
  fail "feeds_omega still used as a seal in live pack files"
fi
if grep -RIq --include='*.md' --include='*.ts' --include='*.json' 'G1=OPEN\|G1=CLOSED\|G1=closed' "${PATHS[@]}"; then
  grep -RIn --include='*.md' 'G1=' "${PATHS[@]}" >&2 || true
  fail "G1 still used as a seal in live pack files"
fi
if grep -RIqE --include='*.md' 'measured_omega[[:space:]]*=[[:space:]]*true' "$ROOT"; then
  fail "measured_omega=true"
fi
if [[ -d "$ROOT/.github" ]] && grep -RIqE '@AGENT-5|reviewers: \["AGENT-5"\]' "$ROOT/.github"; then
  fail "do not route PRs to github.com/AGENT-5 (session role, not a collaborator)"
fi
echo "OK: pr-seal-check"
