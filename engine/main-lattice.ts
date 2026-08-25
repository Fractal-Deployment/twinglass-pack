/** Main lattice (clone legs) ≠ 3D diamond (one agent's internal critique). */
import {
  markSouth,
  noteDivergence,
  openRun,
  SENS_CAP,
  type DiamondRun,
  type HardNote,
} from "./diamond-engine.ts";

export const MEET_MODES = ["debate", "synthesis"] as const;
export type MeetMode = (typeof MEET_MODES)[number];

export type LegState =
  | "walking"
  | "in-diamond"
  | "awaiting-meet"
  | "hibernating"
  | "emitted";

export type LatticeLeg = {
  id: string;
  parentId: string | null;
  state: LegState;
  run: DiamondRun;
  emit: { kind: MeetMode | "correction"; restatement: string } | null;
};

export type MainLattice = {
  charge: string;
  legs: LatticeLeg[];
  sens: number;
  diamondId: string | null;
  resume: Record<string, LegState>;
};

function nid(n: number) {
  return `leg-${n}`;
}

function normLane(s: string): string {
  return s.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

function liveFunctionSets(m: MainLattice): string[] {
  const out = new Set<string>();
  out.add(normLane(m.charge.split("\n")[0] ?? m.charge));
  for (const leg of m.legs) {
    const mFn = /function-set:\s*(.+)/i.exec(leg.run.charge);
    if (mFn) out.add(normLane(mFn[1]));
  }
  return [...out];
}

function assertLegalSpawnNote(
  note: Omit<HardNote, "id">,
  live: string[],
): void {
  if (!note.improperEvidence?.trim()) {
    throw new Error("spawn refuses: improper-track evidence required");
  }
  if (!note.otherTrackEvidence?.trim()) {
    throw new Error("spawn refuses: other-track evidence required");
  }
  if (/antithesis|assigned opposite|opposite account/i.test(note.otherTrackEvidence)) {
    throw new Error("spawn refuses: assigned antithesis is not other-track evidence");
  }
  const fs = normLane(note.functionSet);
  if (live.includes(fs)) {
    throw new Error("spawn refuses: other-track is a synonym of a live lane");
  }
}

export function openMain(charge: string): MainLattice {
  const run = openRun({ charge, walker: "single", schedule: "parallel" });
  return {
    charge,
    legs: [{ id: nid(1), parentId: null, state: "walking", run, emit: null }],
    sens: 0,
    diamondId: null,
    resume: {},
  };
}

function mapLeg(m: MainLattice, id: string, fn: (leg: LatticeLeg) => LatticeLeg): MainLattice {
  return { ...m, legs: m.legs.map((l) => (l.id === id ? fn(l) : l)) };
}

/** Stay on this leg. Note data you cannot follow. Do not enter diamond. Do not switch tracks. */
export function noteOnLeg(
  m: MainLattice,
  legId: string,
  note: Omit<HardNote, "id">,
): MainLattice {
  const leg = m.legs.find((l) => l.id === legId);
  if (!leg) throw new Error("unknown leg");
  if (leg.state !== "walking") throw new Error("only a walking leg writes hard notes");
  return mapLeg(m, legId, (l) => ({ ...l, run: noteDivergence(l.run, note) }));
}

/** Main lattice: burst-spawn new LEGS from this leg's hard notes. Parent keeps walking. */
export function spawnLegsBurst(m: MainLattice, parentId: string): MainLattice {
  const parent = m.legs.find((l) => l.id === parentId);
  if (!parent) throw new Error("unknown leg");
  if (parent.state !== "walking") throw new Error("spawn from a walking parent");
  const notes = parent.run.hardNotes;
  if (notes.length === 0) throw new Error("no hard notes — nothing to clone");
  const live = liveFunctionSets(m);
  for (const n of notes) assertLegalSpawnNote(n, live);
  const room = Math.max(0, SENS_CAP - m.sens);
  if (room === 0) throw new Error("SENS cap: do not spawn");
  const take = notes.slice(0, room);
  const leftover = notes.slice(room);
  let seq = m.legs.length;
  const spawned: LatticeLeg[] = take.map((note) => {
    seq += 1;
    const run = openRun({
      charge: `${m.charge}\nLEG from ${parentId}: ${note.cannotFollow}\nfunction-set: ${note.functionSet}`,
      walker: "single",
      schedule: "parallel",
    });
    return { id: nid(seq), parentId, state: "walking" as const, run, emit: null };
  });
  const legs = m.legs.map((l) =>
    l.id === parentId
      ? { ...l, run: { ...l.run, hardNotes: leftover }, state: "walking" as const }
      : l,
  );
  return { ...m, legs: [...legs, ...spawned], sens: m.sens + take.length };
}

/**
 * Dedicated track: cannotFollow secondary research → spawn a NEW walking leg.
 * Parent keeps walking. This is the gait, not optional later burst.
 */
export function diverge(
  m: MainLattice,
  parentId: string,
  note: Omit<HardNote, "id">,
): MainLattice {
  return spawnLegsBurst(noteOnLeg(m, parentId, note), parentId);
}

/** One agent enters 3D diamond (internal critique). All other legs hibernate. */
export function enterCritiqueDiamond(m: MainLattice, legId: string): MainLattice {
  if (m.diamondId) throw new Error("another leg is already in diamond");
  const leg = m.legs.find((l) => l.id === legId);
  if (!leg) throw new Error("unknown leg");
  if (leg.state !== "walking") throw new Error("only walking enters diamond");
  const resume: Record<string, LegState> = {};
  const legs = m.legs.map((l) => {
    if (l.id === legId) return { ...l, state: "in-diamond" as const };
    if (l.state === "emitted") return l;
    resume[l.id] = l.state;
    return { ...l, state: "hibernating" as const };
  });
  return { ...m, diamondId: legId, resume, legs };
}

/** Diamond finished: this leg awaits a partner. Restore others. */
export function completeCritiqueDiamond(
  m: MainLattice,
  legId: string,
  restatement: string,
): MainLattice {
  if (m.diamondId !== legId) throw new Error("this leg is not in diamond");
  const leg = m.legs.find((l) => l.id === legId)!;
  const marked = markSouth(leg.run, "integrity", restatement);
  return {
    ...m,
    diamondId: null,
    resume: {},
    legs: m.legs.map((l) => {
      if (l.id === legId) return { ...l, state: "awaiting-meet" as const, run: marked };
      if (l.state === "hibernating" && m.resume[l.id]) {
        return { ...l, state: m.resume[l.id] };
      }
      return l;
    }),
  };
}

export function awaiting(m: MainLattice): LatticeLeg[] {
  return m.legs.filter((l) => l.state === "awaiting-meet");
}

/**
 * Two (or more) diamond-complete legs meet.
 * Debate if they diverged; synthesis if complementary. Not battle.
 * Exclusive leftover after debate → steelman-truth-tournament (not this function).
 */
export function converge(
  m: MainLattice,
  aId: string,
  bId: string,
  mode: MeetMode,
  restatement: string,
): MainLattice {
  const a = m.legs.find((l) => l.id === aId);
  const b = m.legs.find((l) => l.id === bId);
  if (!a || !b) throw new Error("unknown leg");
  if (a.state !== "awaiting-meet" || b.state !== "awaiting-meet") {
    throw new Error("converge waits until both finished diamond");
  }
  if (!restatement.trim()) throw new Error("meet needs a restatement");
  const emitId = nid(m.legs.length + 1);
  const childRun = openRun({
    charge: `${m.charge}\nMEET ${mode} of ${aId}+${bId}`,
    walker: "single",
    schedule: "parallel",
  });
  const emitted: LatticeLeg = {
    id: emitId,
    parentId: aId,
    state: "walking",
    run: childRun,
    emit: { kind: mode, restatement },
  };
  return {
    ...m,
    legs: [
      ...m.legs.map((l) =>
        l.id === aId || l.id === bId ? { ...l, state: "emitted" as const } : l,
      ),
      emitted,
    ],
  };
}
