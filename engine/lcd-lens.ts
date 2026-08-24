/** LCD lens: look at function sets. Guard uses three laws on functions only. Skip if no data. */

export type Fn = { id: string; does: string };

export type SourceFns = {
  id: string;
  collection: Fn[];
  claimed: Fn[];
};

export type Demand = {
  charge: string;
  need: Fn[];
};

export type LcdLensVerdict = {
  meet: Fn[];
  onlyTheirs: Fn[];
  onlyOurs: Fn[];
  claimedNotHeld: Fn[];
  exclusive: boolean;
  handToSteelman: boolean;
  reroot: string;
};

export const FN = {
  snapshot: { id: "weight-geometry-snapshot", does: "Dump SVD / erank-proxy on weights." },
  viability: { id: "viability-P_L", does: "Hold, find, let fail on a residual path. Not select." },
  hold: { id: "hold-series", does: "hold_id / hold_m on residual path." },
  steer: {
    id: "manifold-steer",
    does: "Inference-time residual / Price-surface steer. Does not rewrite Mythos.",
  },
} as const;

export const SOURCES: Record<string, SourceFns> = {
  phi4int8: {
    id: "phi4-int8-attn.o",
    collection: [FN.snapshot],
    claimed: [FN.snapshot, FN.viability],
  },
  steerPaper: {
    id: "manifold-steer-paper",
    collection: [FN.snapshot, FN.steer],
    claimed: [FN.steer, FN.viability],
  },
  residualBoard: {
    id: "residual-board",
    collection: [FN.viability, FN.hold],
    claimed: [FN.viability, FN.hold],
  },
};

export const DEMANDS: Record<string, Demand> = {
  isPl: {
    charge: "Is the INT8 erank-proxy viability P_L?",
    need: [FN.viability],
  },
  trackW: {
    charge: "Take a Track W weight-geometry snapshot.",
    need: [FN.snapshot],
  },
  mythos: {
    charge: "Is this evidence of Mythos routing (not a Mythos number)?",
    need: [FN.snapshot],
  },
  friction: {
    charge: "What systemic issue makes the manifold need steer? Substrate friction vs Mythos hold. Open.",
    need: [FN.steer, FN.snapshot],
  },
};

function ids(fns: Fn[]): Set<string> {
  return new Set(fns.map((f) => f.id));
}

function pick(fns: Fn[], keep: Set<string>): Fn[] {
  return fns.filter((f) => keep.has(f.id));
}

export function lcdLens(source: SourceFns, demand: Demand): LcdLensVerdict {
  const coll = ids(source.collection);
  const claim = ids(source.claimed);
  const need = ids(demand.need);

  const meetIds = new Set([...coll].filter((id) => need.has(id)));
  const onlyTheirsIds = new Set([...coll].filter((id) => !need.has(id)));
  const onlyOursIds = new Set([...need].filter((id) => !coll.has(id)));
  const claimedNotHeldIds = new Set([...claim].filter((id) => !coll.has(id)));

  const meet = pick([...source.collection, ...demand.need], meetIds);
  const onlyTheirs = pick(source.collection, onlyTheirsIds);
  const onlyOurs = pick(demand.need, onlyOursIds);
  const claimedNotHeld = pick(source.claimed, claimedNotHeldIds);

  const exclusive = [...claimedNotHeldIds].some((id) => need.has(id));
  const handToSteelman = exclusive || (meet.length === 0 && claimedNotHeld.length > 0);

  let reroot: string;
  if (exclusive) {
    reroot = `LCD lens: they claim a function we demand (${[...claimedNotHeldIds].filter((id) => need.has(id)).join(", ")}) that their collection does not hold. Two accounts of what the data does. Steelman both. Do not import the claimed function.`;
  } else if (meet.length > 0 && claimedNotHeld.length > 0) {
    reroot = `LCD lens: meet = ${meet.map((f) => f.id).join(", ")}. They also claim ${claimedNotHeld.map((f) => f.id).join(", ")} which collection does not hold. Use the meet. Drop the claim.`;
  } else if (meet.length > 0) {
    reroot = `LCD lens: meet = ${meet.map((f) => f.id).join(", ")}. Their function set covers the demand. Still not the same study. Juxtapose on the meet.`;
  } else {
    reroot = `LCD lens: empty meet. They can ${source.collection.map((f) => f.id).join(", ") || "nothing"}. We need ${demand.need.map((f) => f.id).join(", ")}. No shared function. Do not force a join.`;
  }

  return {
    meet,
    onlyTheirs,
    onlyOurs,
    claimedNotHeld,
    exclusive,
    handToSteelman,
    reroot,
  };
}

export type LcdGuard =
  | { active: false; reason: "no-function-set-data" }
  | {
      active: true;
      law: "identity" | "non-contradiction" | "excluded-middle";
      action: "hold" | "redirect";
      reroot: string;
      exclusive: boolean;
    };

/** Three laws as LCD guard on functions. Skip when there is no data. Not SI. Not LRR. */
export function lcdGuard(source?: SourceFns | null, demand?: Demand | null): LcdGuard {
  if (!source || !demand || source.collection.length === 0 || demand.need.length === 0) {
    return { active: false, reason: "no-function-set-data" };
  }
  const v = lcdLens(source, demand);
  if (v.exclusive) {
    return {
      active: true,
      law: "non-contradiction",
      action: "redirect",
      exclusive: true,
      reroot: v.reroot,
    };
  }
  if (v.meet.length === 0) {
    return {
      active: true,
      law: "identity",
      action: "redirect",
      exclusive: false,
      reroot: v.reroot,
    };
  }
  if (v.claimedNotHeld.length > 0) {
    return {
      active: true,
      law: "excluded-middle",
      action: "hold",
      exclusive: false,
      reroot: v.reroot,
    };
  }
  return {
    active: true,
    law: "identity",
    action: "hold",
    exclusive: false,
    reroot: v.reroot,
  };
}
