import assert from "node:assert/strict";
import test from "node:test";
import {
  INTEGRITY_PAIR,
  addDiamondEvidence,
  closeResearchDiamond,
  finishDiamondLeg,
  integrityReady,
  meetHourglass,
  openHourglass,
  openResearchDiamond,
  openSpectralLattice,
  pairSpectralNodes,
  preDebateReady,
  spawnSpectralRoute,
} from "./research-geometries.ts";

test("outside integrity envelope is exactly semantic + data/LCD", () => {
  assert.deepEqual([...INTEGRITY_PAIR], ["semantic-integrity", "lcd-lens"]);
});

test("research diamond gathers independently and only adjudicates at convergence", () => {
  let d = openResearchDiamond("charge", ["route-a", "route-b"]);
  d = addDiamondEvidence(d, "d-leg-1", "evidence A");
  d = addDiamondEvidence(d, "d-leg-2", "evidence B");
  d = finishDiamondLeg(d, "d-leg-1");
  assert.throws(() => closeResearchDiamond(d, "falsification", "too early"), /all evidence legs/);
  d = finishDiamondLeg(d, "d-leg-2");
  d = closeResearchDiamond(d, "synthesis", "combined evidence");
  assert.equal(d.state, "closed");
  assert.equal(d.result?.outcome, "synthesis");
});

test("spectral spawn follows evidence-backed distinct route; parent need not fail", () => {
  let s = openSpectralLattice("charge", "main-route");
  s = spawnSpectralRoute(s, "s-1", {
    route: "substrate-friction",
    divergenceEvidence: "measurements expose a separate substrate interaction",
    otherTrackEvidence: "substrate-friction is a distinct function-set",
    necessaryBecause: "separate causal route avoids clutter",
  });
  assert.equal(s.nodes.length, 2);
  assert.equal(s.nodes[0].state, "researching");
  assert.equal(s.nodes[1].parentId, "s-1");
});

test("spectral spawn refuses assigned antithesis", () => {
  const s = openSpectralLattice("charge", "main-route");
  assert.throws(
    () =>
      spawnSpectralRoute(s, "s-1", {
        route: "assigned-antithesis",
        divergenceEvidence: "operator asked for opposite",
        otherTrackEvidence: "assigned opposite account",
        necessaryBecause: "force a fight",
      }),
    /antithesis/,
  );
});

test("pairing is routing only", () => {
  let s = openSpectralLattice("charge", "main-route");
  s = spawnSpectralRoute(s, "s-1", {
    route: "route-b",
    divergenceEvidence: "evidence B",
    otherTrackEvidence: "route B distinct",
    necessaryBecause: "separate evidence trail",
  });
  const pair = pairSpectralNodes(s, "s-1", "s-2", "complementary");
  assert.deepEqual(pair, { leftId: "s-1", rightId: "s-2", relation: "complementary" });
  assert.equal(s.nodes[0].state, "researching");
  assert.equal(s.nodes[1].state, "researching");
});

test("pre-debate readiness requires self-critique and both outside auditors", () => {
  assert.equal(
    preDebateReady({
      agentId: "A",
      selfCritiqueComplete: true,
      audit: { semanticClean: true, dataClean: true, reasons: [] },
    }),
    true,
  );
  assert.equal(
    preDebateReady({
      agentId: "A",
      selfCritiqueComplete: true,
      audit: { semanticClean: false, dataClean: true, reasons: ["referent drift"] },
    }),
    false,
  );
});

test("hourglass synthesis needs dual integrity but not tetrahedron; debate does", () => {
  let h = openHourglass({
    leftAgent: "A",
    rightAgent: "B",
    leftDirection: "direction-a",
    rightDirection: "direction-b",
    maxRounds: 5,
  });
  const packet = (agentId: string, selfCritiqueComplete: boolean) => ({
    agentId,
    selfCritiqueComplete,
    audit: { semanticClean: true, dataClean: true, reasons: [] },
  });

  assert.equal(integrityReady(packet("A", false)), true);

  h = meetHourglass(h, {
    left: packet("A", false),
    right: packet("B", false),
    mode: "synthesis",
    summary: "complementary evidence",
    sufficientInformation: false,
  });
  assert.equal(h.round, 2);
  assert.equal(h.state, "researching");

  assert.throws(
    () =>
      meetHourglass(h, {
        left: packet("A", false),
        right: packet("B", false),
        mode: "debate",
        summary: "genuine incompatibility",
        sufficientInformation: false,
      }),
    /tetrahedral self-critique/,
  );

  h = meetHourglass(h, {
    left: packet("A", true),
    right: packet("B", true),
    mode: "debate",
    summary: "genuine incompatibility after self-critique",
    sufficientInformation: true,
  });
  assert.equal(h.state, "complete");
  assert.equal(h.history.length, 2);
});

test("hourglass planning horizon never forces closure without sufficient information", () => {
  let h = openHourglass({
    leftAgent: "A",
    rightAgent: "B",
    leftDirection: "a",
    rightDirection: "b",
    maxRounds: 1,
  });
  const packet = (agentId: string) => ({
    agentId,
    selfCritiqueComplete: false,
    audit: { semanticClean: true, dataClean: true, reasons: [] },
  });
  h = meetHourglass(h, {
    left: packet("A"),
    right: packet("B"),
    mode: "synthesis",
    summary: "not enough information yet",
    sufficientInformation: false,
  });
  assert.equal(h.state, "researching");
  assert.equal(h.round, 2);
});
