#!/usr/bin/env bash
set -euo pipefail

cmd="commands/sleep.md"
readme="README.md"

test -f "$cmd"

grep -Fq 'reports/circular_packets/<seat>.pad.md' "$cmd"
! grep -Fq 'packets/<name>.md' "$cmd" || {
  echo "stale sleep path returned: packets/<name>.md" >&2
  exit 1
}

for field in   name   coordinate_language   'plane_tag?'   'chart_axes?'   word_problem   candidate_form   thesis_expression   'negation_map[]'   'empty_meets[]'   why_neighbor   'improperEvidence?'   'otherTrackEvidence?'   dump_backed   layer_index   brief   next_intention
do
  grep -Fq "$field" "$cmd" || {
    echo "missing RING packet field: $field" >&2
    exit 1
  }
done

grep -Fq 'ordinary CLI/workspace file writer' "$cmd"
grep -Fq 'new empty-history session' "$cmd"
grep -Fq 'collate-hourglass' "$cmd"
grep -Fq '/sleep' "$readme"

echo "SLEEP_WRITER_CURRENT_PATH_GREEN"
