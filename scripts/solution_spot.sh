#!/usr/bin/env bash
# Solution spot: gates → commit → push → PR → ci_poll. NEVER merge.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
MSG="auto-agent: solution spot"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --msg) MSG="${2:-$MSG}"; shift 2 ;;
    --help|-h) echo "solution_spot.sh --msg 'S0N: …'  (does not merge)"; exit 0 ;;
    *) echo "unknown $1" >&2; exit 2 ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "HOLD PERMISSION: no git"
  exit 4
fi

bash "$ROOT/scripts/local_gates.sh"

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "$MSG"
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo "HOLD: refuse solution-spot on main. Use charge/<id>-<slug>."
  exit 2
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "HOLD PERMISSION: no origin"
  exit 4
fi
git push -u origin HEAD

if ! command -v gh >/dev/null 2>&1; then
  echo "HOLD PERMISSION: gh missing; branch pushed"
  exit 4
fi

PR="$(gh pr view --json number -q .number 2>/dev/null || true)"
if [[ -z "$PR" ]]; then
  gh pr create --title "$MSG" --body "$(cat <<EOF
S25 auto-agent solution spot.

Do not merge this PR from the agent.

SEALS: measured_omega=false · no invent-green
EOF
)" || true
  PR="$(gh pr view --json number -q .number 2>/dev/null || true)"
fi

if [[ -n "$PR" ]]; then
  set +e
  node "$ROOT/scripts/lib/ci_poll.mjs" --pr "$PR"
  EC=$?
  set -e
  echo "GITHUB: pr-open #$PR"
  echo "POLL_EXIT=$EC"
else
  echo "GITHUB: pr-open-failed"
fi

echo "HOLD MERGE_POLICY — user forbids agent merge"
echo "measured_omega=false"
exit 0
