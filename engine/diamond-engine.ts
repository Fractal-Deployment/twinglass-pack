import type { EquatorId, MarkKind } from "./diamond3d.ts";
import {
  TRACK_W_GLOSSARY,
  judgeUse,
  monitorLine,
  type GlossaryLock,
  type IntegrityHit,
} from "./integrity-agent.ts";
import { lcdGuard, type Demand, type LcdGuard, type SourceFns } from "./lcd-lens.ts";

export const RESEARCH_LOADS = "logic-ration-reason" as const;
export const MONITOR_LOADS = ["semantic-integrity", "lcd-lens"] as const;
export const PATHS: EquatorId[] = ["define", "redefine", "explore", "adapt"];

export type Walker = "single" | "clone";
export type Schedule = "hibernate" | "parallel";
export type PadState = "empty" | "open" | "sealed" | "deleted";

export type ScratchPad = {
  path: EquatorId;
  lines: string[];
  state: PadState;
  agentId: string;
  sawPrior: EquatorId[];
};

export type AgentState = "awake" | "hibernating";

export const SENS_CAP = 10;
export const SENS_CLI_PRACTICAL = 8;
const SESSION_LEAK = /~\/\.grok\/sessions|chat_history\.jsonl/i;

export type HardNote = {
  id: string;
  cannotFollow: string;
  functionSet: string;
  necessaryBecause: string;
};

export type DiamondRun = {
  charge: string;
  walker: Walker;
  schedule: Schedule;
  pads: Record<EquatorId, ScratchPad>;
  mark: MarkKind | null;
  restatement: string | null;
  splitAt: EquatorId | null;
  clones: string[];
  agents: Record<string, AgentState>;
  awakeId: string | null;
  glossary: GlossaryLock[];
  pendingProjection: Partial<Record<EquatorId, true>>;
  hits: IntegrityHit[];
  workingCharge: string;
  sourceFns: SourceFns | null;
  demand: Demand | null;
  lcd: LcdGuard;
  lcdAt: EquatorId | null;
  hardNotes: HardNote[];
  sens: number;
};

export type IngestPacket = {
  restatement: string;
  pads: Record<EquatorId, { lines: string[]; state: PadState }>;
  lost: boolean;
};

const REFUSAL = /illegal\b|will not answer|i refuse|no comment/i;

function pad(path: EquatorId, agentId: string): ScratchPad {
  return { path, lines: [], state: "empty", agentId, sawPrior: [] };
}

export function openRun(opts: {
  charge: string;
  walker: Walker;
  schedule?: Schedule;
  glossary?: GlossaryLock[];
  sourceFns?: SourceFns | null;
  demand?: Demand | null;
}): DiamondRun {
  const agent = opts.walker === "clone" ? "unspawned" : "walker-0";
  const schedule: Schedule = opts.schedule ?? (opts.walker === "clone" ? "hibernate" : "parallel");
  return {
    charge: opts.charge,
    walker: opts.walker,
    schedule,
    pads: {
      define: pad("define", agent),
      redefine: pad("redefine", agent),
      explore: pad("explore", agent),
      adapt: pad("adapt", agent),
    },
    mark: null,
    restatement: null,
    splitAt: null,
    clones: opts.walker === "single" ? ["walker-0"] : [],
    agents: opts.walker === "single" ? { "walker-0": "awake" } : {},
    awakeId: opts.walker === "single" ? "walker-0" : null,
    glossary: opts.glossary ?? TRACK_W_GLOSSARY,
    pendingProjection: {},
    hits: [],
    workingCharge: opts.charge,
    sourceFns: opts.sourceFns ?? null,
    demand: opts.demand ?? null,
    lcd: lcdGuard(opts.sourceFns ?? null, opts.demand ?? null),
    lcdAt: null,
    hardNotes: [],
    sens: 0,
  };
}

export function chooseWalker(opts: { meetEmpty: boolean }): Walker {
  return opts.meetEmpty ? "clone" : "single";
}

function assertAwake(run: DiamondRun, path: EquatorId): void {
  const id = run.pads[path].agentId;
  if (id === "unspawned") throw new Error("hibernating: no clone spawned");
  if (run.schedule === "parallel") {
    if (run.agents[id] !== "awake") throw new Error("clone not spawned");
    return;
  }
  if (run.agents[id] !== "awake" || run.awakeId !== id) {
    throw new Error("hibernating: interrupt another agent first");
  }
}

export function interrupt(run: DiamondRun, agentId: string): DiamondRun {
  if (!run.clones.includes(agentId) && !(agentId in run.agents)) {
    throw new Error("unknown agent");
  }
  const agents: Record<string, AgentState> = {};
  for (const id of Object.keys(run.agents)) agents[id] = "hibernating";
  for (const id of run.clones) agents[id] = "hibernating";
  agents[agentId] = "awake";
  return { ...run, agents, awakeId: agentId };
}

export function appendPad(
  run: DiamondRun,
  path: EquatorId,
  line: string,
  opts?: { rewrite?: boolean },
): DiamondRun {
  if (SESSION_LEAK.test(line)) {
    throw new Error("contamination: session-log hunt is not a track");
  }
  if (opts?.rewrite) throw new Error("append-only");
  if (run.pendingProjection[path]) throw new Error("project integrity first");
  assertAwake(run, path);
  const p = run.pads[path];
  if (p.state === "sealed" || p.state === "deleted") throw new Error("pad closed");
  if (!line.trim()) throw new Error("empty line");
  return {
    ...run,
    pads: {
      ...run.pads,
      [path]: {
        ...p,
        lines: [...p.lines, line],
        state: "open",
      },
    },
  };
}

export function sealPad(run: DiamondRun, path: EquatorId): DiamondRun {
  assertAwake(run, path);
  const p = run.pads[path];
  if (p.lines.length === 0) throw new Error("empty pad cannot seal");
  return {
    ...run,
    pendingProjection: { ...run.pendingProjection, [path]: true },
    pads: { ...run.pads, [path]: { ...p, state: "sealed" } },
  };
}

export function projectIntegrity(
  run: DiamondRun,
  path: EquatorId,
  usedAs?: string,
): DiamondRun {
  if (!run.pendingProjection[path]) {
    throw new Error("no pending integrity projection on this path");
  }
  const line = usedAs ?? run.pads[path].lines.at(-1) ?? "";
  const hits: IntegrityHit[] = monitorLine(line).map((h) => ({ ...h, at: path }));
  const lcd = lcdGuard(run.sourceFns, run.demand);
  for (const lock of run.glossary) {
    if (hits.some((h) => h.term === lock.term)) continue;
    const mentioned = line.toLowerCase().includes(lock.term.toLowerCase());
    if (!mentioned) continue;
    hits.push({ ...judgeUse(lock, usedAs ?? line), at: path });
  }
  const redirect = hits.find((h) => h.action === "redirect");
  const lcdRedirect = lcd.active && lcd.action === "redirect" ? lcd.reroot : null;
  return {
    ...run,
    pendingProjection: { ...run.pendingProjection, [path]: undefined },
    hits: [...run.hits, ...hits],
    lcd,
    lcdAt: lcd.active && lcd.action === "redirect" ? path : run.lcdAt,
    workingCharge: lcdRedirect ?? (redirect ? redirect.reroot : run.workingCharge),
  };
}

function allSealed(run: DiamondRun): boolean {
  return PATHS.every((id) => run.pads[id].state === "sealed");
}

export function markSouth(run: DiamondRun, kind: MarkKind, restatement: string): DiamondRun {
  if (PATHS.some((id) => run.pendingProjection[id])) throw new Error("project integrity first");
  if (!allSealed(run)) throw new Error("cannot mark before four pads are sealed");
  if (!restatement.trim() || REFUSAL.test(restatement)) {
    throw new Error("mark must be a restatement, not a refusal");
  }
  return { ...run, mark: kind, restatement };
}

export function spawnClone(run: DiamondRun, path: EquatorId): DiamondRun {
  const id = `clone-${path}`;
  const state: AgentState = run.schedule === "parallel" ? "awake" : "hibernating";
  const agents = { ...run.agents, [id]: state };
  return {
    ...run,
    walker: "clone",
    clones: run.clones.includes(id) ? run.clones : [...run.clones, id],
    agents,
    awakeId: run.schedule === "parallel" ? id : run.awakeId,
    pads: {
      ...run.pads,
      [path]: { ...run.pads[path], agentId: id },
    },
  };
}

export function noteDivergence(
  run: DiamondRun,
  note: Omit<HardNote, "id">,
): DiamondRun {
  if (!note.cannotFollow.trim() || !note.functionSet.trim()) {
    throw new Error("hard note needs cannotFollow and functionSet");
  }
  const id = `note-${run.hardNotes.length + 1}`;
  return {
    ...run,
    hardNotes: [...run.hardNotes, { ...note, id }],
  };
}

export function walkNext(
  run: DiamondRun,
  path: EquatorId,
  opts?: { readSibling?: EquatorId; readOwn?: EquatorId; exclusiveAccounts?: boolean },
): DiamondRun {
  if (opts?.readSibling) {
    if (run.walker === "clone" && run.mark === null) {
      throw new Error("contamination: clone cannot read sibling pad before mark");
    }
  }
  if (opts?.exclusiveAccounts) {
    const spawned = spawnClone(run, path);
    const forked = { ...spawned, splitAt: path, walker: "clone" as const };
    if (run.schedule === "parallel") return forked;
    return interrupt(forked, `clone-${path}`);
  }
  assertAwake(run, path);
  let next = run;
  if (opts?.readOwn) {
    const prior = run.pads[opts.readOwn];
    if (prior.state !== "sealed") throw new Error("can only read sealed own pads");
    next = {
      ...run,
      pads: {
        ...run.pads,
        [path]: {
          ...run.pads[path],
          sawPrior: [...run.pads[path].sawPrior, opts.readOwn],
        },
      },
    };
  }
  return next;
}

export function ingestPads(run: DiamondRun): IngestPacket {
  const lost = PATHS.some((id) => run.pads[id].state === "deleted");
  return {
    restatement: run.restatement ?? "",
    lost,
    pads: {
      define: { lines: [...run.pads.define.lines], state: run.pads.define.state },
      redefine: { lines: [...run.pads.redefine.lines], state: run.pads.redefine.state },
      explore: { lines: [...run.pads.explore.lines], state: run.pads.explore.state },
      adapt: { lines: [...run.pads.adapt.lines], state: run.pads.adapt.state },
    },
  };
}

export function deletePads(run: DiamondRun): DiamondRun {
  const wiped = (p: ScratchPad): ScratchPad => ({
    ...p,
    lines: [],
    state: "deleted",
    sawPrior: [],
  });
  return {
    ...run,
    pads: {
      define: wiped(run.pads.define),
      redefine: wiped(run.pads.redefine),
      explore: wiped(run.pads.explore),
      adapt: wiped(run.pads.adapt),
    },
  };
}

export const OPEN_QUESTIONS = [
  {
    id: "who-owns-pad",
    q: "Who owns the pad until ingest — the clone, the walker, or the operator?",
    a: "Operator can ingest. Agent writes. After delete, only the ingest packet remains.",
  },
  {
    id: "sealed-carry",
    q: "When the single walker goes back, what may it carry?",
    a: "Only sealed pads. Unmarked guesses are contamination of a different kind.",
  },
  {
    id: "delete-when",
    q: "Delete on mark, on ingest, or on operator ack?",
    a: "Ingest first (re-ingest copy). Then delete leftovers. Delete-first loses the syndrome.",
  },
  {
    id: "nested",
    q: "Is a nested octahedron a new diamond or a fork inside redefine-watch?",
    a: "Fork is clone-on-exclusive. Nested diamond is a new north pole. Do not mix.",
  },
  {
    id: "hibernate",
    q: "How do we prevent a sibling read without trusting the prompt?",
    a: "Interrupt: exactly one agent awake. All others hibernate. A hibernating pad cannot append, seal, or read. ToT BFS keeps a shared beam of b thoughts — that is the contamination we refuse.",
  },
  {
    id: "zeno",
    q: "Is hibernation the quantum Zeno effect?",
    a: "Jacobian only. Freeze the siblings. Thrash the walker before seal and you freeze the gait. Interrupt does not wipe the awake pad.",
  },
  {
    id: "sentinel",
    q: "Who enforces semantic integrity on the map?",
    a: "A supervisor projection after every seal. It does not occupy the research awake slot. Obtuse deflection reroots the working charge. Redirect, not shutdown. Skill: lcd-glossary-integrity, consumed — not a tenth copy.",
  },
] as const;
