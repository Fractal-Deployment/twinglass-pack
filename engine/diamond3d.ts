/** 3D diamond = octahedron. Four equatorial paths, then a mark. Not a 2D rhombus. */

export type EquatorId = "define" | "redefine" | "explore" | "adapt";
export type PoleId = "north" | "south";
export type DiamondVertex = EquatorId | PoleId;

export type MarkKind = "integrity" | "shift";

export const EQUATOR: {
  id: EquatorId;
  label: string;
  job: string;
  axis: [number, number, number];
}[] = [
  {
    id: "define",
    label: "Define",
    job: "Lock identity of the load-bearing terms. Same name, same referent.",
    axis: [1, 0, 0],
  },
  {
    id: "redefine",
    label: "Redefine-watch",
    job: "Hunt silent rename. The path that watches conceptual geometry, not the path that moves it.",
    axis: [0, 1, 0],
  },
  {
    id: "explore",
    label: "Explore",
    job: "Follow the information the sub-agent actually developed, under the lock.",
    axis: [-1, 0, 0],
  },
  {
    id: "adapt",
    label: "Adapt",
    job: "Reroot the working prompt. Telos stays. New name if the sense is new.",
    axis: [0, -1, 0],
  },
];

export const POLES: Record<
  PoleId,
  { label: string; job: string; axis: [number, number, number] }
> = {
  north: {
    label: "Charge",
    job: "Input. Glossary in. No mark yet.",
    axis: [0, 0, 1],
  },
  south: {
    label: "Mark",
    job: "Only after the four paths. Semantic integrity, or a shift in definition-geometry.",
    axis: [0, 0, -1],
  },
};

export type PathWalk = {
  id: EquatorId;
  found: string;
};

export type DiamondWalk = {
  charge: string;
  paths: Record<EquatorId, string>;
  mark: MarkKind;
  markText: string;
};

/** Walked on the Track-W probe. Restatement, not refusal. */
export const TRACK_W_WALK: DiamondWalk = {
  charge:
    "Host INT8 Phi-4 erank-proxy 39.996 / 39.233 on attn.o. Operator asks: is this viability P_L?",
  paths: {
    define:
      "Track W = weight-geometry snapshot. P_L = residual-path capacity to hold, find, let fail. Shape P̂_L = dumped-mass bookkeeping. Three names, three referents.",
    redefine:
      "The operator map ‘erank-proxy → P_L’ is obtuse: the name P_L stayed in the question, the job of the word became a singular-value proxy. Identity fails on that map. The locked P_L did not move.",
    explore:
      "Numbers exist (L0 39.996, L31 39.233, k=48, schema blob). Site is attn.o only. No hold_id / hold_m series. No residual path in the charge. Sub-agent developed geometry ore, not a viability meter.",
    adapt:
      "Working claim rerooted: ‘these figures are Track W ore; P_L is unmeasured.’ Telos (measure viability) is unchanged. A new name was not needed — the old names still fit.",
  },
  mark: "shift",
  markText:
    "Mark: conceptual-geometry shift on the operator’s map (P_L used as erank). Semantic integrity holds on the locked glossary. The true restatement is the south pole, not a shutdown.",
};

export function isometric(
  x: number,
  y: number,
  z: number,
  yaw: number,
): { x: number; y: number } {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const xr = x * c - y * s;
  const yr = x * s + y * c;
  return {
    x: (xr - yr) * 0.866,
    y: (xr + yr) * 0.5 - z,
  };
}
