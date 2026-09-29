import assert from "node:assert/strict";
import test from "node:test";
import {
  INTEGRITY_PAIR,
  addDiamondEvidence,
  closeResearchDiamond,
  finishDiamondLeg,
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

test("hourglass keeps persistent pair across repeated meet cycles", () => {
  let h = openHourglass({
    leftAgent: "A",
    rightAgent: "B",
    leftDirection: "direction-a",
    rightDirection: "direction-b",
    maxRounds: 5,
  });
  const clean = (agentId: string) => ({
    agentId,
    selfCritiqueComplete: true,
    audit: { semanticClean: true, dataClean: true, reasons: [] },
  });
  h = meetHourglass(h, {
    left: clean("A"),
    right: clean("B"),
    mode: "synthesis",
    summary: "round one synthesis",
    sufficientInformation: false,
  });
  assert.equal(h.round, 2);
  assert.equal(h.state, "researching");
  h = meetHourglass(h, {
    left: clean("A"),
    right: clean("B"),
    mode: "debate",
    summary: "round two incompatibility",
    sufficientInformation: true,
  });
  assert.equal(h.state, "complete");
  assert.equal(h.history.length, 2);
});
