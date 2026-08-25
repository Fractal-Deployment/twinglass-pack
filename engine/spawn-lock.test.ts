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
        improperEvidence: "quoted: this track packed tiling as if it were the pad",
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
        improperEvidence: "quoted: this track is not the proper object",
        otherTrackEvidence: "quoted: assigned opposite / antithesis of the live lane",
      }),
    /antithesis/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn refuses: no improper-track evidence", () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "other math",
        functionSet: "friction",
        necessaryBecause: "different tax",
        improperEvidence: "",
        otherTrackEvidence: "",
      }),
    /improper/i,
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
        improperEvidence: "quoted: this pad never named the live object",
        otherTrackEvidence: "quoted: spawn-lock again",
      }),
    /synonym/i,
  );
  assert.equal(m.legs.length, 1);
});

test("spawn allows: improper + other-track, parent keeps walking", () => {
  const m0 = openMain("spawn-lock");
  const root = m0.legs[0].id;
  const m = diverge(m0, root, {
    cannotFollow: "friction is not Mythos",
    functionSet: "substrate-friction",
    necessaryBecause: "different tax",
    improperEvidence: "quoted: this track packed tiling as if it were the pad",
    otherTrackEvidence: "quoted: occupancy/interference is a different function-set",
  });
  assert.equal(m.legs.length, 2);
  assert.equal(m.legs[0].id, root);
  assert.equal(m.legs[0].state, "walking");
  assert.equal(m.legs[1].parentId, root);
  assert.equal(m.legs[1].state, "walking");
});
