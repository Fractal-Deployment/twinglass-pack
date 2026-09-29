#!/usr/bin/env bash
# Canonical geometry lock: Diamond, Hourglass, Spectral, outside integrity pair,
# and pre-debate tetrahedral self-critique must remain distinct.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
red() { echo "FAIL: $*" >&2; fail=$((fail + 1)); }
pass() { echo "PASS: $*"; }

GEO="$ROOT/RESEARCH_GEOMETRIES.md"
APP="$ROOT/APPARATUS.md"
LAT="$ROOT/skills/twinglass-lattice/SKILL.md"
HOUR="$ROOT/skills/collate-hourglass/SKILL.md"
RAG="$ROOT/PRESUPPOSITIONAL_RAG.md"
ENG="$ROOT/engine/main-lattice.ts"
RG="$ROOT/engine/research-geometries.ts"

grep -q 'Research Diamond' "$GEO" && grep -q 'Spectral lattice' "$GEO" && grep -q 'Hourglass' "$GEO"   || red "canonical geometry document missing Diamond/Hourglass/Spectral separation"
grep -q 'Tetrahedron = self-comparison, not opponent-comparison' "$GEO"   || red "tetrahedron self-comparison invariant missing"
grep -q 'Semantic Integrity' "$GEO" && grep -q 'Data Integrity / LCD' "$GEO"   || red "outside dual integrity pair missing"

grep -q 'divergenceEvidence' "$LAT" || red "spectral lattice missing divergenceEvidence"
grep -qi 'parent route does.*not.*have to be wrong' "$LAT" || red "spectral spawn still requires parent failure"
grep -qi 'assigned antithesis' "$LAT" || red "spectral antithesis refusal missing"

grep -q 'DEBATE or SYNTHESIS' "$HOUR" || red "hourglass lost meet modes"
grep -qi 'pre-debate' "$HOUR" || red "hourglass missing pre-debate critique"
grep -Eq '4.?5|four.*five' "$HOUR" || red "hourglass repeated-cycle horizon missing"

grep -qi 'no target DFR' "$RAG" || grep -qi 'There is .*no target DFR' "$RAG"   || red "RAG still treats DFR as a steering target"
grep -qi 'pre-debate' "$RAG" || red "RAG tetrahedron placement missing"
grep -qi 'retrospective only' "$RAG" || red "RAG post-gather adjudication boundary missing"

grep -q 'enterPreDebateCritique' "$ENG" || red "engine missing canonical pre-debate entrypoint"
grep -q 'spawn refuses: evidence-backed divergence required' "$ENG" || red "engine missing divergence evidence gate"
grep -q 'openResearchDiamond' "$RG" && grep -q 'openHourglass' "$RG" && grep -q 'openSpectralLattice' "$RG"   || red "executable geometry module incomplete"
grep -q 'preDebateReady' "$RG" || red "dual-clearance pre-debate gate missing"

if grep -q 'falsification.*retrieval objective' "$APP"; then
  pass "apparatus explicitly keeps falsification downstream"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "RESEARCH_GEOMETRY_RED fail=$fail"
  exit 1
fi

echo "RESEARCH_GEOMETRY_GREEN"
