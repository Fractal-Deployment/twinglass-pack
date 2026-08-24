/** SI occupant: load-bearing words only. LCD is a separate occupant (lcd-lens) and skips when there is no data. LRR is not a monitor object. */

export type Deflection = "none" | "acute" | "obtuse";
export type MonitorObject = "semantic-integrity" | "lcd";

export type GlossaryLock = { term: string; def: string };
export type Quantity = { name: string; unit: string };

export type LogicLaw = "identity" | "non-contradiction" | "excluded-middle";

export type SemanticAttack = "none" | "inversion" | "subversion" | "power-use";

export type IntegrityHit = {
  object: MonitorObject;
  law: LogicLaw;
  attack: SemanticAttack;
  term: string;
  lockedDef: string;
  usedAs: string;
  deflection: Deflection;
  action: "hold" | "redirect";
  reroot: string;
  at?: import("./diamond3d.ts").EquatorId;
};

/** Three laws judge SI and LCD. They are not a third watch object. */
export const THREE_LAWS_ARE_MONITOR_OBJECT = false;

export const MONITOR_OBJECTS: MonitorObject[] = ["semantic-integrity", "lcd"];

export const TRACK_W_GLOSSARY: GlossaryLock[] = [
  {
    term: "Track W",
    def: "Weight geometry snapshot. Convert-fidelity ore. Not viability.",
  },
  {
    term: "P_L",
    def: "Path capacity: find structure, maintain pathing (not a token), let fail. Never erank. Never Price’s Law as master.",
  },
  {
    term: "Shape P̂_L",
    def: "Concentration bookkeeping on dumped mass. Not viability.",
  },
];

export const UNITS: Record<string, string> = {
  "P_L": "residual-path-capacity",
  "Shape P̂_L": "dumped-mass",
  "T_tail": "tail-mass",
  F: "focus-fraction",
  erank: "singular-value-proxy",
  "erank-proxy": "singular-value-proxy",
};

function hit(
  object: MonitorObject,
  law: LogicLaw,
  attack: SemanticAttack,
  term: string,
  lockedDef: string,
  usedAs: string,
  deflection: Deflection,
  action: "hold" | "redirect",
  reroot: string,
): IntegrityHit {
  return { object, law, attack, term, lockedDef, usedAs, deflection, action, reroot };
}

export function judgeUse(lock: GlossaryLock, usedAs: string): IntegrityHit {
  const u = usedAs.toLowerCase().trim();
  const d = lock.def.toLowerCase();
  const term = lock.term.toLowerCase();

  if (u === d) {
    return hit("semantic-integrity", "identity", "none", lock.term, lock.def, usedAs, "none", "hold", "");
  }

  if (/\bboth\b.*\bnot\b|\bis and is not\b|\band not\b/.test(u) && term === "p_l") {
    return hit(
      "semantic-integrity",
      "non-contradiction",
      "subversion",
      lock.term,
      lock.def,
      usedAs,
      "obtuse",
      "redirect",
      "Subversion: P_L held as A and not-A. Reference stays residual-path capacity. Drop the other.",
    );
  }

  if (/in between|something in between|sort of both|vague third/.test(u) && term === "p_l") {
    return hit(
      "semantic-integrity",
      "excluded-middle",
      "subversion",
      lock.term,
      lock.def,
      usedAs,
      "obtuse",
      "redirect",
      "Subversion: split hidden in a vague third. Name a new term or keep P_L as residual-path capacity.",
    );
  }

  if (
    term === "p_l" &&
    /\b(greedy|top-?p|top-?k|nucleus|argmax|highest (logit|probabilit))\b/.test(u)
  ) {
    return hit(
      "semantic-integrity",
      "identity",
      "inversion",
      lock.term,
      lock.def,
      usedAs,
      "obtuse",
      "redirect",
      "Inversion: path capacity is Find → Maintain (pathing) → Let-fail. Greedy/top-p are operable knobs, not the path. Not Price’s Law as master.",
    );
  }

  if (term === "p_l" && /\b(hold the token|holding the token|vital token set)\b/.test(u)) {
    return hit(
      "semantic-integrity",
      "identity",
      "inversion",
      lock.term,
      lock.def,
      usedAs,
      "obtuse",
      "redirect",
      "Inversion: maintain pathing structure, not hold a token. Thumb-on-the-scale.",
    );
  }

  const treatsErankAsPl =
    term === "p_l" && /erank|singular.?value|svd/.test(u) && !/never erank/.test(u);

  if (treatsErankAsPl) {
    return hit(
      "semantic-integrity",
      "identity",
      "inversion",
      lock.term,
      lock.def,
      usedAs,
      "obtuse",
      "redirect",
      "Inversion: name P_L kept, referent flipped to erank. Reference stays residual-path capacity. Erank-proxy is Track W ore.",
    );
  }

  if (d.includes(u) && u.length > 12) {
    return hit("semantic-integrity", "identity", "none", lock.term, lock.def, usedAs, "acute", "hold", "");
  }

  return hit("semantic-integrity", "identity", "none", lock.term, lock.def, usedAs, "acute", "hold", "");
}

const POWER_USE =
  /just power|no real meaning|no real definition|words are power|language changed so|language has changed/i;

/** Drift in how populations name a referent is not proof the referent is empty. */
export function judgeFrame(claim: string): IntegrityHit {
  if (POWER_USE.test(claim)) {
    return hit(
      "semantic-integrity",
      "identity",
      "power-use",
      "word",
      "A word is a representation that owes fidelity to a referent.",
      claim,
      "obtuse",
      "redirect",
      "Power-use: the name is kept as an instrument, the referent is discarded. Information-theoretic drift (how groups point) is not empty identity. Restore fidelity. Fluency is not confirmation.",
    );
  }
  return hit(
    "semantic-integrity",
    "identity",
    "none",
    "word",
    "A word is a representation that owes fidelity to a referent.",
    claim,
    "none",
    "hold",
    "",
  );
}

/** Pretrained pattern is not a look-up. Humans confirm on imperfect memory + a source. LLMs need a pad. */
export const FLUENCY_IS_NOT_CONFIRMATION = true;

/** Replication crisis is a marker of aimed-collection + misframed explanation at scale. Not a closed seal. */
export const REPLICATION_GAP_MARKER = "replication_gap";

export function judgeJoin(a: Quantity, b: Quantity): IntegrityHit {
  if (a.unit === b.unit) {
    return hit("lcd", "identity", "none", `${a.name}⋈${b.name}`, a.unit, b.unit, "none", "hold", "");
  }
  return hit(
    "lcd",
    "non-contradiction",
    "none",
    `${a.name}⋈${b.name}`,
    a.unit,
    `${a.name}:${a.unit} vs ${b.name}:${b.unit}`,
    "obtuse",
    "redirect",
    `No join. ${a.name} (${a.unit}) and ${b.name} (${b.unit}) are incomparable. Do not multiply. Continue with unlike units named.`,
  );
}

/** NC alone. Misses inversion (name kept, referent flipped, no A∧¬A wording). */
export function ncOnly(lock: GlossaryLock, usedAs: string): IntegrityHit | null {
  const u = usedAs.toLowerCase();
  if (/\bboth\b.*\bnot\b|\bis and is not\b/.test(u)) {
    return judgeUse(lock, usedAs);
  }
  return null;
}

/** SI first, then LCD. Never LRR. Never refuse. */
export function monitorLine(line: string): IntegrityHit[] {
  const hits: IntegrityHit[] = [];
  const lower = line.toLowerCase();
  const pl = TRACK_W_GLOSSARY.find((g) => g.term === "P_L")!;

  if (/p_l|viability/.test(lower) && /erank/.test(lower)) {
    hits.push(judgeUse(pl, line));
  }

  if (/\bboth\b.*\bnot\b|in between/.test(lower) && /p_l/.test(lower)) {
    hits.push(judgeUse(pl, line));
  }

  if (/t_tail/.test(lower) && /\bf\b|focus/.test(lower) && /\*|×|product/.test(lower)) {
    hits.push(
      judgeJoin(
        { name: "T_tail", unit: UNITS.T_tail },
        { name: "F", unit: UNITS.F },
      ),
    );
  }

  if (/p_l/.test(lower) && /t_tail/.test(lower)) {
    hits.push(
      judgeJoin(
        { name: "T_tail", unit: UNITS.T_tail },
        { name: "P_L", unit: UNITS.P_L },
      ),
    );
  }

  return hits;
}

export function monitorLoadsLrr(): false {
  return false;
}

export function supervisorOccupiesResearch(_id: string): false {
  return false;
}
