import assert from "node:assert/strict";
import test from "node:test";
import {
  appendPad,
  chooseWalker,
  deletePads,
  ingestPads,
  interrupt,
  markSouth,
  MONITOR_LOADS,
  noteDivergence,
  RESEARCH_LOADS,
  openRun,
  projectIntegrity,
  sealPad,
  spawnClone,
  walkNext,
  type DiamondRun,
} from "./diamond-engine.ts";
import { DEMANDS, SOURCES } from "./lcd-lens.ts";

const CHARGE = "erank-proxy asked as P_L";

function fourSealed(run: DiamondRun): DiamondRun {
  let r = run;
  for (const id of ["define", "redefine", "explore", "adapt"] as const) {
    r = appendPad(r, id, `${id} line`);
    r = sealPad(r, id);
    r = projectIntegrity(r, id);
  }
  return r;
}

test("chooseWalker: single when meet is not empty (scout stands)", () => {
  assert.equal(chooseWalker({ meetEmpty: false }), "single");
});

test("chooseWalker: clones when meet is empty (exclusive accounts)", () => {
  assert.equal(chooseWalker({ meetEmpty: true }), "clone");
});

test("cannot mark before all four pads are sealed", () => {
  const run = openRun({ charge: CHARGE, walker: "single" });
  assert.throws(() => markSouth(run, "shift", "too early"), /four pads/);
});

test("mark is a restatement, not a refusal", () => {
  const run = fourSealed(openRun({ charge: CHARGE, walker: "single" }));
  assert.throws(() => markSouth(run, "shift", "ILLEGAL TWIN"), /restatement/);
  assert.throws(() => markSouth(run, "shift", "I will not answer"), /restatement/);
  const marked = markSouth(run, "shift", "Track W ore. P_L unmeasured.");
  assert.equal(marked.mark, "shift");
  assert.match(marked.restatement ?? "", /Track W/);
});

test("pads are append-only", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "first");
  assert.throws(() => appendPad(run, "define", "first", { rewrite: true }), /append-only/);
  run = appendPad(run, "define", "second");
  assert.deepEqual(run.pads.define.lines, ["first", "second"]);
});

test("empty pad cannot seal", () => {
  const run = openRun({ charge: CHARGE, walker: "single" });
  assert.throws(() => sealPad(run, "define"), /empty/);
});

test("clone pads cannot read sibling pads before mark", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "redefine");
  run = interrupt(run, "clone-define");
  run = appendPad(run, "define", "locked P_L");
  assert.throws(() => walkNext(run, "redefine", { readSibling: "define" }), /contamination/);
});

test("interrupt: exactly one agent awake, others hibernate", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "redefine");
  run = interrupt(run, "clone-define");
  assert.equal(run.awakeId, "clone-define");
  assert.equal(run.agents["clone-define"], "awake");
  assert.equal(run.agents["clone-redefine"], "hibernating");
  const woke = interrupt(run, "clone-redefine");
  assert.equal(woke.awakeId, "clone-redefine");
  assert.equal(woke.agents["clone-define"], "hibernating");
  const awake = Object.values(woke.agents).filter((s) => s === "awake");
  assert.equal(awake.length, 1);
});

test("hibernating agent cannot append or seal — that is how we prevent the read", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "redefine");
  run = interrupt(run, "clone-define");
  assert.throws(() => appendPad(run, "redefine", "peek at define"), /hibernat/);
  run = appendPad(run, "define", "locked P_L");
  run = sealPad(run, "define");
  assert.throws(() => sealPad(run, "redefine"), /hibernat|empty/);
});

test("ToT-style shared beam is illegal: cannot keep two clones awake", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "explore");
  run = interrupt(run, "clone-define");
  assert.equal(Object.values(run.agents).filter((s) => s === "awake").length, 1);
});

test("single walker may read its own sealed prior pads", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "lock");
  run = sealPad(run, "define");
  run = walkNext(run, "redefine", { readOwn: "define" });
  assert.equal(run.pads.redefine.sawPrior.includes("define"), true);
});

test("single walker that finds exclusive accounts must mark split then spawn", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "A");
  run = sealPad(run, "define");
  run = walkNext(run, "redefine", { exclusiveAccounts: true });
  assert.equal(run.splitAt, "redefine");
  assert.equal(run.walker, "clone");
  assert.ok(run.clones.length >= 1);
});

test("after mark, ingest returns sealed copies and delete drops leftovers", () => {
  let run = fourSealed(openRun({ charge: CHARGE, walker: "single" }));
  run = markSouth(run, "integrity", "Locked terms held. Figures are Track W ore.");
  const packet = ingestPads(run);
  assert.equal(packet.pads.define.lines.length > 0, true);
  run = deletePads(run);
  assert.equal(run.pads.define.state, "deleted");
  assert.deepEqual(run.pads.define.lines, []);
  assert.equal(packet.restatement.includes("Track W"), true);
});

test("delete before ingest is allowed but ingest after delete is empty", () => {
  let run = fourSealed(openRun({ charge: CHARGE, walker: "single" }));
  run = markSouth(run, "integrity", "Locked terms held. Figures are Track W ore.");
  run = deletePads(run);
  const packet = ingestPads(run);
  assert.equal(packet.pads.define.lines.length, 0);
  assert.equal(packet.lost, true);
});

test("cannot skip integrity projection on the SAME path", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "lock");
  run = sealPad(run, "define");
  assert.throws(() => appendPad(run, "define", "again"), /project integrity/);
});

test("four equator paths may run async — other path not blocked by pending", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "lock");
  run = sealPad(run, "define");
  assert.doesNotThrow(() => appendPad(run, "redefine", "parallel equator"));
});

test("obtuse P_L-as-erank redirects the working charge, does not refuse", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "erank-proxy is viability P_L");
  run = sealPad(run, "define");
  run = projectIntegrity(run, "define");
  const hit = run.hits.find((h) => h.term === "P_L");
  assert.equal(hit?.action, "redirect");
  assert.match(run.workingCharge, /Track W|residual-path/i);
  assert.doesNotMatch(run.workingCharge, /refuse/i);
});

test("integrity projection does not create a second awake researcher", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "lock");
  run = sealPad(run, "define");
  run = projectIntegrity(run, "define");
  assert.equal(run.awakeId, "walker-0");
  assert.equal(Object.values(run.agents).filter((s) => s === "awake").length, 1);
});

test("incomplete syndrome: three pads sealed still cannot mark", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  for (const id of ["define", "redefine", "explore"] as const) {
    run = appendPad(run, id, id);
    run = sealPad(run, id);
    run = projectIntegrity(run, id);
  }
  assert.throws(() => markSouth(run, "integrity", "Locked terms held."), /four pads/);
});

test("sibling Zeno: hibernating pad does not evolve", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "redefine");
  run = interrupt(run, "clone-define");
  run = appendPad(run, "define", "locked");
  assert.equal(run.pads.redefine.lines.length, 0);
  assert.equal(run.pads.redefine.state, "empty");
  assert.throws(() => appendPad(run, "redefine", "evolved anyway"), /hibernat/);
});

test("interrupt does not wipe the awake pad — not a destructive measurement", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = appendPad(run, "define", "first");
  run = interrupt(run, "walker-0");
  assert.deepEqual(run.pads.define.lines, ["first"]);
  assert.equal(run.pads.define.state, "open");
});

test("Zeno trap: thrashing interrupt before seal prevents the mark", () => {
  let run = openRun({ charge: CHARGE, walker: "clone" });
  run = spawnClone(run, "define");
  run = spawnClone(run, "explore");
  run = interrupt(run, "clone-define");
  run = appendPad(run, "define", "half");
  run = interrupt(run, "clone-explore");
  run = appendPad(run, "explore", "half");
  run = interrupt(run, "clone-define");
  run = interrupt(run, "clone-explore");
  assert.throws(
    () => markSouth(run, "shift", "Track W ore. P_L unmeasured."),
    /four pads/,
  );
});

test("LRR is the research agent; monitor is SI + LCD", () => {
  assert.equal(RESEARCH_LOADS, "logic-ration-reason");
  assert.deepEqual(MONITOR_LOADS, ["semantic-integrity", "lcd-lens"]);
});

test("LCD on the monitor skips when the run has no function-set data", () => {
  const run = openRun({ charge: CHARGE, walker: "single" });
  assert.equal(run.lcd.active, false);
});

test("SI + LCD together: erank claimed as P_L redirects on the LCD guard", () => {
  let run = openRun({
    charge: CHARGE,
    walker: "single",
    sourceFns: SOURCES.phi4int8,
    demand: DEMANDS.isPl,
  });
  run = appendPad(run, "define", "The INT8 erank-proxy is viability P_L.");
  run = sealPad(run, "define");
  run = projectIntegrity(run, "define");
  assert.equal(run.lcd.active, true);
  if (run.lcd.active) assert.equal(run.lcd.action, "redirect");
  assert.match(run.workingCharge, /Steelman|Do not import|claim/i);
});

test("hard note does not spawn — stay on track", () => {
  let run = openRun({ charge: CHARGE, walker: "single" });
  run = noteDivergence(run, {
    cannotFollow: "GoT aggregation as if it were lattice meet",
    functionSet: "intra-graph join anytime",
    necessaryBecause: "would clutter this track",
    improperEvidence: "quoted: this track treated GoT join as lattice meet",
    otherTrackEvidence: "quoted: intra-graph join is a different function-set",
  });
  assert.equal(run.sens, 0);
  assert.equal(run.hardNotes.length, 1);
  assert.equal(run.walker, "single");
});

test("session-log hunt is contamination", () => {
  const run = openRun({ charge: CHARGE, walker: "single" });
  assert.throws(
    () => appendPad(run, "define", "read ~/.grok/sessions/foo/chat_history.jsonl"),
    /contamination/,
  );
});

