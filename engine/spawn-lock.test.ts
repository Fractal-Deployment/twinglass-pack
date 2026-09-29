import assert from "node:assert/strict";
import test from "node:test";
import { diverge, openMain } from "./main-lattice.ts";

test("spawn refuses: no other-track evidence", () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "other math",
        functionSet: "friction",
        necessaryBecause: "different tax",
        divergenceEvidence: "quoted: evidence opens a distinct substrate-friction route",
        otherTrackEvidence: "",
      }),
    /other-track/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn refuses: assigned antithesis is not other-track evidence", () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "the opposite account",
        functionSet: "antithesis-lane",
        necessaryBecause: "assigned opposite",
        divergenceEvidence: "quoted: an assigned opposite was requested",
        otherTrackEvidence: "quoted: assigned opposite / antithesis of the live lane",
      }),
    /antithesis/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn refuses: no evidence-backed divergence", () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "interesting tangent",
        functionSet: "friction",
        necessaryBecause: "different tax",
        divergenceEvidence: "",
        otherTrackEvidence: "quoted: substrate friction is a distinct function-set",
      }),
    /divergence/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn refuses: other-track is a synonym of the live lane", () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "same map again",
        functionSet: "spawn-lock",
        necessaryBecause: "looks parallel",
        divergenceEvidence: "quoted: another source names the same route",
        otherTrackEvidence: "quoted: spawn-lock again",
      }),
    /synonym/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn allows: distinct evidence route; parent need not be wrong", () => {
  const m0 = openMain("spawn-lock");
  const root = m0.legs[0].id;
  const m = diverge(m0, root, {
    cannotFollow: "friction deserves its own evidence trail",
    functionSet: "substrate-friction",
    necessaryBecause: "separate causal tax without cluttering the parent route",
    divergenceEvidence: "quoted: occupancy/interference measurements create a separate causal path",
    otherTrackEvidence: "quoted: substrate friction is a distinct function-set",
  });
  assert.equal(m.legs.length, 2);
  assert.equal(m.legs[0].id, root);
  assert.equal(m.legs[0].state, "walking");
  assert.equal(m.legs[1].parentId, root);
  assert.equal(m.legs[1].state, "walking");
});
