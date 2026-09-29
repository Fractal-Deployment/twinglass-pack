/**
 * Canonical TwinGlass research geometries.
 *
 * Geometry is orchestration. Integrity is an outside envelope.
 * Debate/falsification are downstream results, never research assignments.
 */

export const INTEGRITY_PAIR = ["semantic-integrity", "lcd-lens"] as const;

export type MeetMode = "debate" | "synthesis";
export type AdjudicationOutcome = "synthesis" | "replacement" | "falsification" | "unresolved";

export type IntegrityAudit = {
  semanticClean: boolean;
  dataClean: boolean;
  reasons: string[];
};

export type PreDebatePacket = {
  agentId: string;
  selfCritiqueComplete: boolean;
  audit: IntegrityAudit;
};

export function integrityReady(packet: PreDebatePacket): boolean {
  return packet.audit.semanticClean && packet.audit.dataClean;
}

export function preDebateReady(packet: PreDebatePacket): boolean {
  return packet.selfCritiqueComplete && integrityReady(packet);
}

export type EvidenceLeg = {
  id: string;
  direction: string;
  evidence: string[];
  ready: boolean;
};

export type ResearchDiamond = {
  charge: string;
  legs: EvidenceLeg[];
  state: "gathering" | "ready-to-converge" | "closed";
  result?: {
    outcome: AdjudicationOutcome;
    summary: string;
  };
};

export function openResearchDiamond(charge: string, directions: string[]): ResearchDiamond {
  if (directions.length < 2) throw new Error("research diamond requires at least two divergent evidence routes");
  return {
    charge,
    legs: directions.map((direction, i) => ({
      id: `d-leg-${i + 1}`,
      direction,
      evidence: [],
      ready: false,
    })),
    state: "gathering",
  };
}

export function addDiamondEvidence(diamond: ResearchDiamond, legId: string, evidence: string): ResearchDiamond {
  if (diamond.state === "closed") throw new Error("research diamond already closed");
  if (!evidence.trim()) throw new Error("empty evidence");
  let found = false;
  const legs = diamond.legs.map((leg) => {
    if (leg.id !== legId) return leg;
    found = true;
    return { ...leg, evidence: [...leg.evidence, evidence] };
  });
  if (!found) throw new Error("unknown diamond leg");
  return { ...diamond, legs };
}

export function finishDiamondLeg(diamond: ResearchDiamond, legId: string): ResearchDiamond {
  if (diamond.state === "closed") throw new Error("research diamond already closed");
  let found = false;
  const legs = diamond.legs.map((leg) => {
    if (leg.id !== legId) return leg;
    found = true;
    if (leg.evidence.length === 0) throw new Error("cannot finish empty evidence leg");
    return { ...leg, ready: true };
  });
  if (!found) throw new Error("unknown diamond leg");
  return {
    ...diamond,
    legs,
    state: legs.every((leg) => leg.ready) ? "ready-to-converge" : "gathering",
  };
}

/** Falsification can occur here because evidence gathering is complete. Never on an outbound leg. */
export function closeResearchDiamond(
  diamond: ResearchDiamond,
  outcome: AdjudicationOutcome,
  summary: string,
): ResearchDiamond {
  if (diamond.state !== "ready-to-converge") throw new Error("diamond convergence waits for all evidence legs");
  if (!summary.trim()) throw new Error("diamond convergence needs a summary");
  return { ...diamond, state: "closed", result: { outcome, summary } };
}

export type Hourglass = {
  leftAgent: string;
  rightAgent: string;
  leftDirection: string;
  rightDirection: string;
  round: number;
  /** Planning/review horizon only. Reaching it never forces closure without sufficient information. */
  maxRounds: number;
  state: "researching" | "complete";
  history: {
    round: number;
    mode: MeetMode;
    summary: string;
  }[];
};

export function openHourglass(opts: {
  leftAgent: string;
  rightAgent: string;
  leftDirection: string;
  rightDirection: string;
  maxRounds?: number;
}): Hourglass {
  if (opts.leftAgent === opts.rightAgent) throw new Error("hourglass requires two persistent agents");
  return {
    leftAgent: opts.leftAgent,
    rightAgent: opts.rightAgent,
    leftDirection: opts.leftDirection,
    rightDirection: opts.rightDirection,
    round: 1,
    maxRounds: opts.maxRounds ?? 5,
    state: "researching",
    history: [],
  };
}

export function meetHourglass(
  hourglass: Hourglass,
  opts: {
    left: PreDebatePacket;
    right: PreDebatePacket;
    mode: MeetMode;
    summary: string;
    sufficientInformation: boolean;
  },
): Hourglass {
  if (hourglass.state === "complete") throw new Error("hourglass already complete");
  if (opts.left.agentId !== hourglass.leftAgent || opts.right.agentId !== hourglass.rightAgent) {
    throw new Error("hourglass meet must use the persistent pair");
  }
  if (!integrityReady(opts.left) || !integrityReady(opts.right)) {
    throw new Error("hourglass meet requires semantic and data integrity clearance");
  }
  if (opts.mode === "debate" && (!preDebateReady(opts.left) || !preDebateReady(opts.right))) {
    throw new Error("hourglass debate requires each agent's own tetrahedral self-critique plus dual integrity clearance");
  }
  if (!opts.summary.trim()) throw new Error("hourglass meet needs a summary");

  const history = [...hourglass.history, { round: hourglass.round, mode: opts.mode, summary: opts.summary }];
  const complete = opts.sufficientInformation;
  return {
    ...hourglass,
    history,
    state: complete ? "complete" : "researching",
    round: complete ? hourglass.round : hourglass.round + 1,
  };
}

export type DivergenceNote = {
  divergenceEvidence: string;
  otherTrackEvidence: string;
  necessaryBecause: string;
  route: string;
};

export type SpectralNode = {
  id: string;
  parentId: string | null;
  route: string;
  state: "researching" | "paired" | "complete";
};

export type SpectralLattice = {
  charge: string;
  nodes: SpectralNode[];
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

export function openSpectralLattice(charge: string, rootRoute = "root"): SpectralLattice {
  return { charge, nodes: [{ id: "s-1", parentId: null, route: rootRoute, state: "researching" }] };
}

export function spawnSpectralRoute(
  lattice: SpectralLattice,
  parentId: string,
  note: DivergenceNote,
): SpectralLattice {
  const parent = lattice.nodes.find((n) => n.id === parentId);
  if (!parent) throw new Error("unknown spectral parent");
  if (parent.state !== "researching") throw new Error("spawn requires researching parent");
  if (!note.divergenceEvidence.trim()) throw new Error("spawn refuses: evidence-backed divergence required");
  if (!note.otherTrackEvidence.trim()) throw new Error("spawn refuses: other-track evidence required");
  if (!note.necessaryBecause.trim()) throw new Error("spawn refuses: necessaryBecause required");
  if (/antithesis|assigned opposite|opposite account/i.test(`${note.route} ${note.otherTrackEvidence}`)) {
    throw new Error("spawn refuses: assigned antithesis is not a research route");
  }
  const live = new Set(lattice.nodes.filter((n) => n.state !== "complete").map((n) => norm(n.route)));
  if (live.has(norm(note.route))) throw new Error("spawn refuses: route is a synonym of a live lane");

  const id = `s-${lattice.nodes.length + 1}`;
  return {
    ...lattice,
    nodes: [...lattice.nodes, { id, parentId, route: note.route, state: "researching" }],
  };
}

export type PairCandidate = {
  leftId: string;
  rightId: string;
  relation: "complementary" | "incompatible";
};

/** Pairing is a routing decision only; it does not manufacture debate or alter evidence. */
export function pairSpectralNodes(
  lattice: SpectralLattice,
  leftId: string,
  rightId: string,
  relation: PairCandidate["relation"],
): PairCandidate {
  if (leftId === rightId) throw new Error("cannot pair a pad with itself");
  if (!lattice.nodes.some((n) => n.id === leftId) || !lattice.nodes.some((n) => n.id === rightId)) {
    throw new Error("unknown spectral pair");
  }
  return { leftId, rightId, relation };
}
