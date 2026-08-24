import assert from "node:assert/strict";
import test from "node:test";
import { appendPad, projectIntegrity, sealPad, type DiamondRun } from "./diamond-engine.ts";
import {
  awaiting,
  completeCritiqueDiamond,
  converge,
  enterCritiqueDiamond,
  noteOnLeg,
  openMain,
  spawnLegsBurst,
} from "./main-lattice.ts";

const CHARGE = "parallel-could-diverge research";

function fourSeal(run: DiamondRun): DiamondRun {
  let r = run;
  for (const id of ["define", "redefine", "explore", "adapt"] as const) {
    r = appendPad(r, id, `${id} critique`);
    r = sealPad(r, id);
    r = projectIntegrity(r, id);
  }
  return r;
}

test("hard notes spawn MAIN lattice legs, not diamonds", () => {
  let m = openMain(CHARGE);
  const root = m.legs[0].id;
  for (let i = 0; i < 5; i++) {
    m = noteOnLeg(m, root, {
      cannotFollow: `diff ${i}`,
      functionSet: `fn-${i}`,
      necessaryBecause: "cannot clutter this leg",
    });
  }
  m = spawnLegsBurst(m, root);
  assert.equal(m.legs.length, 6);
  assert.equal(m.sens, 5);
  assert.equal(m.legs[0].state, "walking");
  assert.ok(m.legs.slice(1).every((l) => l.state === "walking" && l.parentId === root));
  assert.equal(m.diamondId, null);
});

test("one diamond: others hibernate; complete awaits meet", () => {
  let m = openMain(CHARGE);
  const root = m.legs[0].id;
  m = noteOnLeg(m, root, {
    cannotFollow: "other fn",
    functionSet: "B",
    necessaryBecause: "parallel",
  });
  m = spawnLegsBurst(m, root);
  const child = m.legs[1].id;
  m = enterCritiqueDiamond(m, child);
  assert.equal(m.diamondId, child);
  assert.equal(m.legs.find((l) => l.id === child)?.state, "in-diamond");
  assert.equal(m.legs.find((l) => l.id === root)?.state, "hibernating");
  const sealed = fourSeal(m.legs.find((l) => l.id === child)!.run);
  m = { ...m, legs: m.legs.map((l) => (l.id === child ? { ...l, run: sealed } : l)) };
  m = completeCritiqueDiamond(m, child, "Child diamond restated. Path capacity unmeasured.");
  assert.equal(m.diamondId, null);
  assert.equal(m.legs.find((l) => l.id === child)?.state, "awaiting-meet");
  assert.equal(m.legs.find((l) => l.id === root)?.state, "walking");
});

test("converge waits for two diamond-complete legs; emit walks", () => {
  let m = openMain(CHARGE);
  const root = m.legs[0].id;
  m = noteOnLeg(m, root, { cannotFollow: "A", functionSet: "fa", necessaryBecause: "p" });
  m = noteOnLeg(m, root, { cannotFollow: "B", functionSet: "fb", necessaryBecause: "p" });
  m = spawnLegsBurst(m, root);
  const a = m.legs[1].id;
  const b = m.legs[2].id;
  function diamond(id: string, text: string) {
    m = enterCritiqueDiamond(m, id);
    const sealed = fourSeal(m.legs.find((l) => l.id === id)!.run);
    m = { ...m, legs: m.legs.map((l) => (l.id === id ? { ...l, run: sealed } : l)) };
    m = completeCritiqueDiamond(m, id, text);
  }
  diamond(a, "A restated. Complementary account.");
  assert.equal(awaiting(m).length, 1);
  assert.throws(
    () => converge(m, a, b, "synthesis", "too early"),
    /both finished diamond/,
  );
  diamond(b, "B restated. Complementary account.");
  m = converge(m, a, b, "synthesis", "Both legs complementary. Not the same function. Unmeasured.");
  assert.equal(m.legs.find((l) => l.id === a)?.state, "emitted");
  const out = m.legs.find((l) => l.emit?.kind === "synthesis");
  assert.ok(out);
  assert.equal(out?.state, "walking");
});
