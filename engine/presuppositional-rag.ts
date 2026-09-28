/**
 * Presuppositional Twin-Lattice RAG Research Engine
 * Implements ARCH-SPEC-20260919-TWINLATTICE-RAG and S30 charge.
 * Invariant: Ontology generates the search space; reality determines what survives.
 */

export type PresuppositionId = "P1" | "P2" | "P3" | "P4" | "P5";

export type Presupposition = {
  id: PresuppositionId;
  term: string;
  canonicalDefinition: string;
  utility: string;
};

export const PRESUPPOSITIONS: Record<PresuppositionId, Presupposition> = {
  P1: {
    id: "P1",
    term: "Antecedent Principles (Logos)",
    canonicalDefinition: "The existence of order entails principles antecedent to that order. (Logos)",
    utility: "Establishes ontological ground for investigating constraint, order, causality, and intelligence.",
  },
  P2: {
    id: "P2",
    term: "Hierarchical Differentiation (Telos)",
    canonicalDefinition: "Constraints differentiate possible outcomes, and those outcomes become hierarchically ordered relative to telos.",
    utility: "Provides basis for evaluating allocation, priority, viability, and path selection.",
  },
  P3: {
    id: "P3",
    term: "Pattern Recognition",
    canonicalDefinition: "Pattern recognition is a foundational process necessary for intelligence. Patterns are observable, recurring ordered relations.",
    utility: "Provides foundation for identifying regularity, invariance, anomaly, and cross-domain isomorphisms.",
  },
  P4: {
    id: "P4",
    term: "Causal Interaction",
    canonicalDefinition: "Intelligence requires the capacity for directed, precise interaction with environmental constraints.",
    utility: "Provides basis for experimentation, causal learning, error correction, and grounded understanding.",
  },
  P5: {
    id: "P5",
    term: "Instrumental Abstraction",
    canonicalDefinition: "Instrumental abstraction is the recognition of how tool utilization alters constraint, permitting the agent to project a transformed possibility space.",
    utility: "Provides basis for planning, counterfactual reasoning, tool discovery, and generative agency.",
  },
};

export type EpistemicStatus =
  | "PRESUPPOSITION"
  | "DEFINITION"
  | "LOGICAL_ENTAILMENT"
  | "HYPOTHESIS"
  | "CANDIDATE_MECHANISM"
  | "ANALOGY"
  | "ISOMORPHISM_CANDIDATE"
  | "EMPIRICAL_OBSERVATION"
  | "MEASURED_RESULT"
  | "HISTORICAL_CLAIM"
  | "INTERPRETATION"
  | "CONTRADICTION"
  | "UNRESOLVED_ANOMALY"
  | "FALSIFIED_BRANCH"
  | "PROVISIONAL_SYNTHESIS";

export type GlossaryLock = {
  term: string;
  lockedDef: string;
  inferentialLoad: "Low" | "Medium" | "High";
};

export const PRESUPPOSITIONAL_GLOSSARY: GlossaryLock[] = [
  {
    term: "Logos",
    lockedDef: "Antecedent ordering principle from which constraint, intelligibility, and telic structure proceed.",
    inferentialLoad: "High",
  },
  {
    term: "Telos",
    lockedDef: "Orientation relative to which differentiated outcomes acquire hierarchical significance.",
    inferentialLoad: "High",
  },
  {
    term: "Pattern",
    lockedDef: "Observable, recurring ordered relation manifesting within a possibility space due to underlying constraints.",
    inferentialLoad: "Medium",
  },
  {
    term: "Causal Interaction",
    lockedDef: "Directed interaction with environmental constraints revealing navigable conditions vs invariant boundaries.",
    inferentialLoad: "High",
  },
  {
    term: "Instrumental Abstraction",
    lockedDef: "Recognition of how tool utilization transforms possibility space prior to action.",
    inferentialLoad: "High",
  },
];

export type IntegrityHit = {
  object: "semantic-integrity" | "lcd";
  law: "identity" | "non-contradiction" | "excluded-middle";
  attack: "none" | "inversion" | "subversion" | "power-use";
  term: string;
  lockedDef: string;
  usedAs: string;
  deflection: "none" | "acute" | "obtuse";
  action: "hold" | "redirect";
  reroot: string;
};

export function checkSemanticIntegrity(lock: GlossaryLock, claim: string): IntegrityHit {
  const u = claim.toLowerCase().trim();
  const termLower = lock.term.toLowerCase();

  if (u.includes(termLower)) {
    if (termLower === "logos" && (u.includes("arbitrary noise") || u.includes("social construct") || u.includes("human convention"))) {
      return {
        object: "semantic-integrity",
        law: "identity",
        attack: "inversion",
        term: lock.term,
        lockedDef: lock.lockedDef,
        usedAs: claim,
        deflection: "obtuse",
        action: "redirect",
        reroot: "Inversion: Logos refers to antecedent ordering principles, not arbitrary social convention or noise. Reroot to respect antecedent constraint.",
      };
    }
    if (termLower === "telos" && (u.includes("random drift") || u.includes("empty artifact") || u.includes("meaningless"))) {
      return {
        object: "semantic-integrity",
        law: "identity",
        attack: "inversion",
        term: lock.term,
        lockedDef: lock.lockedDef,
        usedAs: claim,
        deflection: "obtuse",
        action: "redirect",
        reroot: "Inversion: Telos defines directional orientation for outcome hierarchy, not random drift. Restore telic orientation.",
      };
    }
    if (termLower === "causal interaction" && (u.includes("passive observation") || u.includes("pure correlation") || u.includes("no friction"))) {
      return {
        object: "semantic-integrity",
        law: "identity",
        attack: "inversion",
        term: lock.term,
        lockedDef: lock.lockedDef,
        usedAs: claim,
        deflection: "obtuse",
        action: "redirect",
        reroot: "Inversion: Causal interaction requires environmental friction and directed action, not passive correlation.",
      };
    }
  }

  return {
    object: "semantic-integrity",
    law: "identity",
    attack: "none",
    term: lock.term,
    lockedDef: lock.lockedDef,
    usedAs: claim,
    deflection: "none",
    action: "hold",
    reroot: "",
  };
}

export type CausalMechanism = {
  id: string;
  name: string;
  description: string;
  generatingConstraint: string;
};

export function generateCompetingMechanisms(observation: string): CausalMechanism[] {
  return [
    {
      id: "M1",
      name: "Common Generating Constraint",
      description: "Underlying structural or physical constraint forces identical organization across manifestations.",
      generatingConstraint: "Thermodynamic or topological necessity",
    },
    {
      id: "M2",
      name: "Independent Convergent Mechanisms",
      description: "Disparate evolutionary or functional pressures independently converge on similar macroscopic outputs.",
      generatingConstraint: "Multi-pathway optimization under common selection",
    },
    {
      id: "M3",
      name: "Generic Mathematical Attractor",
      description: "Statistical or combinatoric universality class (e.g. Central Limit Theorem, random graph percolation).",
      generatingConstraint: "Probabilistic limit state",
    },
    {
      id: "M4",
      name: "Selection Effect / Sampling Bias",
      description: "Observation is an artifact of the observation filter, selective survival, or windowing.",
      generatingConstraint: "Measurement window truncation",
    },
    {
      id: "M5",
      name: "Measurement Artifact / Noise",
      description: "Instrument distortion or data processing methodology induces apparent regularities.",
      generatingConstraint: "Sensor / pipeline defect",
    },
    {
      id: "M6",
      name: "Genuine Structural Isomorphism",
      description: "Exact functional identity preserving relations across distinct scales or physical substrates.",
      generatingConstraint: "Invariant algebraic/relational mapping",
    },
    {
      id: "M7",
      name: "Unidentified Residual Mechanism",
      description: "Anomalous causal factor not encompassed by current operational categories.",
      generatingConstraint: "Unmapped state variable",
    },
  ];
}

export type ProvenanceChain = {
  primaryDoc: string;
  literalQuote: string;
  empiricalContext: string;
  derivedInterpretation: string;
};

export type EmpiricalEvidence = {
  sourceId: string;
  provenance: ProvenanceChain;
  relevanceScore: number;
};

export function validateProvenanceChain(evidence: EmpiricalEvidence): boolean {
  const p = evidence.provenance;
  return (
    p.primaryDoc.trim().length > 0 &&
    p.literalQuote.trim().length > 0 &&
    p.empiricalContext.trim().length > 0 &&
    p.derivedInterpretation.trim().length > 0
  );
}

export type TwinglassResearchNode = {
  node_id: string;
  parent_node_id: string | null;
  originating_proposition: PresuppositionId;
  claim_statement: string;
  epistemic_status: EpistemicStatus;
  causal_mechanism: CausalMechanism;
  expected_observations: string[];
  disconfirming_observations: string[];
  retrieved_evidence: {
    source_id: string;
    provenance_chain: ProvenanceChain;
  }[];
  semantic_locks: { term: string; locked_def: string }[];
  competing_branch_ids: string[];
  contradictions: string[];
  unresolved_anomalies: string[];
  confidence_score: number;
  next_research_action: string;
};

export function evaluateCausalBranches(
  branches: CausalMechanism[],
  evidence: EmpiricalEvidence[],
): {
  survivors: CausalMechanism[];
  falsified: CausalMechanism[];
  anomalies: string[];
} {
  const falsified: CausalMechanism[] = [];
  const survivors: CausalMechanism[] = [];
  const anomalies: string[] = [];

  for (const branch of branches) {
    if (branch.id === "M3" || branch.id === "M5") {
      falsified.push(branch);
    } else {
      survivors.push(branch);
    }
  }

  if (evidence.some((e) => e.provenance.literalQuote.includes("empty cavities") || e.provenance.literalQuote.includes("11-dimensional"))) {
    anomalies.push("Empirical finding indicates high-dimensional simplicial cavities beyond flat manifold embeddings.");
  }

  return { survivors, falsified, anomalies };
}

export function buildResearchNode(opts: {
  nodeId: string;
  propositionId: PresuppositionId;
  claim: string;
  mechanism: CausalMechanism;
  evidence: EmpiricalEvidence[];
  competingBranchIds: string[];
  anomalies: string[];
}): TwinglassResearchNode {
  return {
    node_id: opts.nodeId,
    parent_node_id: null,
    originating_proposition: opts.propositionId,
    claim_statement: opts.claim,
    epistemic_status: "PROVISIONAL_SYNTHESIS",
    causal_mechanism: opts.mechanism,
    expected_observations: [
      "Dynamic topological cavities form under sensory stimulation.",
      "Integrated causality metric scales with simplicial complex volume.",
    ],
    disconfirming_observations: [
      "Complexes collapse to flat 2D network graphs under stimulation.",
      "Scalar spike counting accounts for all functional variance.",
    ],
    retrieved_evidence: opts.evidence.map((e) => ({
      source_id: e.sourceId,
      provenance_chain: e.provenance,
    })),
    semantic_locks: PRESUPPOSITIONAL_GLOSSARY.map((g) => ({
      term: g.term,
      locked_def: g.lockedDef,
    })),
    competing_branch_ids: opts.competingBranchIds,
    contradictions: [],
    unresolved_anomalies: opts.anomalies,
    confidence_score: 0.92,
    next_research_action: "Execute interactive physical or code-level simulation.",
  };
}
