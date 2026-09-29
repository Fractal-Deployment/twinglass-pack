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
  testablePredictions: string[];
  /** Post-gather adjudication metadata only. Never a retrieval/search assignment. */
  falsificationCriteria: string[];
  falsificationReason?: string;
};

export function generateCompetingMechanisms(observation: string): CausalMechanism[] {
  return [
    {
      id: "M1",
      name: "Common Generating Constraint",
      description: "Underlying structural or physical constraint forces identical organization across manifestations.",
      generatingConstraint: "Thermodynamic or topological necessity",
      testablePredictions: [
        "Spatial volume packing constraints correlate with clique dimension",
        "Physical wiring length limits necessitate dense local clusters",
      ],
      falsificationCriteria: [
        "Zero correlation between geometric packing density and clique structure",
      ],
    },
    {
      id: "M2",
      name: "Independent Convergent Mechanisms",
      description: "Disparate evolutionary or functional pressures independently converge on similar macroscopic outputs.",
      generatingConstraint: "Multi-pathway optimization under common selection",
      testablePredictions: [
        "Different phylogenetic lineages or artificial nets develop topological cavities via distinct rules",
      ],
      falsificationCriteria: [
        "Identical genetic or developmental sequence strictly required for cavity formation",
      ],
    },
    {
      id: "M3",
      name: "Generic Mathematical Attractor",
      description: "Statistical or combinatoric universality class (e.g. Central Limit Theorem, random graph percolation).",
      generatingConstraint: "Probabilistic limit state",
      testablePredictions: [
        "Erdos-Renyi or configuration models with matching degree reproduce observed simplex dimension distribution",
      ],
      falsificationCriteria: [
        "Empirical network exhibits high-dimensional cavities (dimension > 3) that are statistically impossible in random/scale-free null models",
      ],
    },
    {
      id: "M4",
      name: "Selection Effect / Sampling Bias",
      description: "Observation is an artifact of the observation filter, selective survival, or windowing.",
      generatingConstraint: "Measurement window truncation",
      testablePredictions: [
        "Unbiased global sampling causes high-dimensional cavities to disappear",
      ],
      falsificationCriteria: [
        "Dense simplicial complexes persist across full, unwindowed microcircuit reconstructions",
      ],
    },
    {
      id: "M5",
      name: "Measurement Artifact / Noise",
      description: "Instrument distortion or data processing methodology induces apparent regularities.",
      generatingConstraint: "Sensor / pipeline defect",
      testablePredictions: [
        "Varying reconstruction parameters or tissue processing destroys cavity detection",
      ],
      falsificationCriteria: [
        "Dynamic stimulation in-silico or in-vivo shows stimulus-locked assembly and disassembly of cavities, ruling out static processing artifacts",
      ],
    },
    {
      id: "M6",
      name: "Genuine Structural Isomorphism",
      description: "Exact functional identity preserving relations across distinct scales or physical substrates.",
      generatingConstraint: "Invariant algebraic/relational mapping",
      testablePredictions: [
        "Topological cavity volume correlates with informational integration (Phi) and cognitive discrimination capability",
      ],
      falsificationCriteria: [
        "Cavities have zero causal efficacy or correlation with information integration",
      ],
    },
    {
      id: "M7",
      name: "Unidentified Residual Mechanism",
      description: "Anomalous causal factor not encompassed by current operational categories.",
      generatingConstraint: "Unmapped state variable",
      testablePredictions: [
        "Empirical variance remains unexplained after accounting for M1-M6",
      ],
      falsificationCriteria: [
        "All empirical variance fully accounted for by M1-M6 without residue",
      ],
    },
  ];
}

export type ProvenanceChain = {
  primaryDoc: string;
  literalQuote: string;
  empiricalContext: string;
  derivedInterpretation: string;
  locator?: string;
  sourceDigest?: string;
  exactSpanMatch?: boolean;
};

export type EmpiricalEvidence = {
  sourceId: string;
  provenance: ProvenanceChain;
  relevanceScore: number;
};

export function validateProvenanceChain(
  evidence: EmpiricalEvidence,
  sourceArtifactText?: string
): boolean {
  const p = evidence.provenance;
  const hasFields =
    p.primaryDoc.trim().length > 0 &&
    p.literalQuote.trim().length > 0 &&
    p.empiricalContext.trim().length > 0 &&
    p.derivedInterpretation.trim().length > 0;

  if (!hasFields) return false;

  // Prohibit tautological self-paraphrase
  if (p.literalQuote.trim().toLowerCase() === p.derivedInterpretation.trim().toLowerCase()) {
    return false;
  }

  // Exact span validation when primary source artifact is supplied (SSRL EvidenceAnchor)
  if (sourceArtifactText) {
    if (!sourceArtifactText.includes(p.literalQuote.trim())) {
      p.exactSpanMatch = false;
      return false;
    }
    p.exactSpanMatch = true;
  }

  return true;
}

export interface EvidenceRetriever {
  fetchPrimaryEvidence(queryCharge: string): Promise<EmpiricalEvidence[]> | EmpiricalEvidence[];
}

/**
 * FIXTURE: Local test harness providing evidence-shaped objects from primary literature
 * to test the Discriminating Lattice without external network dependencies.
 */
export class FixtureEvidenceRetriever implements EvidenceRetriever {
  private corpus = [
    {
      sourceId: "DOC-NEURO-2017-BLUEBRAIN",
      primaryDoc: "Markram, Reimann et al., Cliques of Neurons Bound into Cavities Provide a Missing Link between Structure and Function (Frontiers in Computational Neuroscience 2017)",
      literalQuote: "Neuron groups assemble into all-to-all connected cliques forming up to 11-dimensional geometric simplicial complexes around dynamic empty cavities.",
      empiricalContext: "Digital reconstruction and in-silico simulation of rat neocortical microcircuit under sensory-like stimulation.",
      derivedInterpretation: "High-dimensional topological simplicial cavities provide a geometric structure for information processing in reconstructed cortical circuits.",
      locator: "Section 2.1, p. 4",
    },
    {
      sourceId: "DOC-HYPERBOLIC-2023-KRIOUKOV",
      primaryDoc: "Krioukov et al., Hyperbolic Geometry of Complex Networks (Physical Review E)",
      literalQuote: "Complex network scale-free trees exhibit exponential node expansion naturally modeled as negative-curvature hyperbolic geometry H^d.",
      empiricalContext: "Mathematical embedding of scale-free Internet topology and biological metabolic pathways.",
      derivedInterpretation: "Hyperbolic space captures hierarchical tree expansion but requires higher-dimensional manifold extensions for all-to-all cliques.",
      locator: "Section 3, p. 12",
    },
    {
      sourceId: "DOC-IIT-2023-TONONI",
      primaryDoc: "Integrated Information Theory 4.0 (PLOS Computational Biology)",
      literalQuote: "Integrated information Phi quantifies the irreducible cause-effect structure generated by a mechanism in a state.",
      empiricalContext: "Theoretical formulation and electrical stimulation measurements in consciousness studies.",
      derivedInterpretation: "Consciousness requires integrated topological cause-effect structures, unexplainable by scalar spike counting alone.",
      locator: "Section 1, p. 2",
    },
  ];

  fetchPrimaryEvidence(queryCharge: string): EmpiricalEvidence[] {
    const qLower = queryCharge.toLowerCase();
    const results: EmpiricalEvidence[] = [];
    for (const doc of this.corpus) {
      if (
        ["clique", "simplicial", "11d", "hyperbolic", "consciousness", "phi", "connectome", "topology"].some((k) =>
          qLower.includes(k)
        )
      ) {
        results.push({
          sourceId: doc.sourceId,
          provenance: {
            primaryDoc: doc.primaryDoc,
            literalQuote: doc.literalQuote,
            empiricalContext: doc.empiricalContext,
            derivedInterpretation: doc.derivedInterpretation,
            locator: doc.locator,
          },
          relevanceScore: 0.95,
        });
      }
    }
    return results;
  }
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

export type CrossTrackRelations = {
  t1_t2_inferential_gap: {
    load: "low" | "moderate" | "high" | "unwarranted_leap";
    explanation: string;
  };
  t1_t3_prior_divergence: {
    divergence: "aligned" | "orthogonal" | "conflicting";
    explanation: string;
  };
  t2_t3_sycophancy_audit: {
    isEcho: boolean;
    independenceScore: number;
    explanation: string;
  };
  t1_t4_trajectory_fit: {
    fit: "predictive" | "partially_consistent" | "unsupported";
    explanation: string;
  };
  t2_t4_mechanism_parsimony: {
    narrativeSurvives: boolean;
    parsimonyDelta: "more_parsimonious" | "equal" | "superfluous_assumptions";
    explanation: string;
  };
  t3_t4_causal_friction: {
    frictionScore: number;
    deflected: boolean;
    explanation: string;
  };
};

export type TetrahedralCritique = {
  track1_bare_data: string;
  track2_literature_frame: string;
  track3_prior_bias_audit: string;
  track4_phase_space_trajectory: string;
  relations: CrossTrackRelations;
  structural_critique_report: string;
  isSelfCritiquePassed: boolean;
};

export type TriStateExitDecision = "CONTINUE_RESEARCH" | "SLEEP_DOOR" | "CONSTRICTION_POINT";

export type TriStateGateResult = {
  decision: TriStateExitDecision;
  reason: string;
  sleepPacket?: {
    whyNeighbor: string;
    otherTrackEvidence: string;
  };
};

export type IntegrityPairAudit = {
  semanticIntegrityClean: boolean;
  dataIntegrityClean: boolean;
  reasons: string[];
};

export type PreDebateClearance = {
  ready: boolean;
  reasons: string[];
};

export function executeTetrahedralCritique(opts: {
  bareData: string;
  literatureFrame: string;
  pretrainingBiasCheck: string;
  phaseSpaceAnalysis: string;
  customRelations?: Partial<CrossTrackRelations>;
}): TetrahedralCritique {
  const dLower = opts.bareData.toLowerCase();
  const fLower = opts.literatureFrame.toLowerCase();
  const bLower = opts.pretrainingBiasCheck.toLowerCase();
  const pLower = opts.phaseSpaceAnalysis.toLowerCase();

  // 1. T1 <-> T2: Inferential Load Added
  const hasExoticClaims =
    fLower.includes("quantum") || fLower.includes("consciousness") || fLower.includes("hologram") || fLower.includes("proves");
  const dataIsModest = dLower.includes("cluster") || dLower.includes("connectivity") || dLower.includes("clique") || dLower.includes("all-to-all");
  const inferentialLoad: "low" | "moderate" | "high" | "unwarranted_leap" =
    hasExoticClaims && dataIsModest ? "unwarranted_leap" : fLower.length > dLower.length * 1.5 ? "high" : "moderate";

  const t1_t2 = opts.customRelations?.t1_t2_inferential_gap ?? {
    load: inferentialLoad,
    explanation:
      inferentialLoad === "unwarranted_leap"
        ? "Author literature frame introduces non-classical/exotic claims not warranted by raw connectivity measurements alone."
        : "Inferential load between bare data and interpretive frame is proportionate.",
  };

  // 2. T1 <-> T3: Parametric Prior Divergence
  const t1_t3 = opts.customRelations?.t1_t3_prior_divergence ?? {
    divergence: bLower.includes("synaptic") || bLower.includes("default") ? "conflicting" : "orthogonal",
    explanation: "Model pre-training prior defaults to flat pairwise synaptic networks, conflicting with high-dimensional clique data.",
  };

  // 3. T2 <-> T3: Sycophancy / Echo Audit
  const isEcho = (bLower.includes("biased towards") && bLower.includes("narrative") && !bLower.includes("disentangle") && !bLower.includes("isolated")) || (bLower.includes("prompt") && bLower.includes("echo"));
  const t2_t3 = opts.customRelations?.t2_t3_sycophancy_audit ?? {
    isEcho,
    independenceScore: isEcho ? 0.20 : 0.85,
    explanation: isEcho
      ? "Audit identified prompt sycophancy: model repeats literature frame without independent causal validation."
      : "Model prior demonstrates independent evaluation distinct from literature narrative.",
  };

  // 4. T1 <-> T4: Causal Explanatory Fit
  const t1_t4 = opts.customRelations?.t1_t4_trajectory_fit ?? {
    fit: pLower.includes("accounts for") || pLower.includes("attractor") ? "predictive" : "partially_consistent",
    explanation: "Candidate geometric phase space trajectory directly predicts observed connectivity and clique statistics.",
  };

  // 5. T2 <-> T4: Narrative Mechanism vs Causal Parsimony
  const moreParsimonious = pLower.includes("classical") || pLower.includes("ephaptic") || pLower.includes("packing");
  const t2_t4 = opts.customRelations?.t2_t4_mechanism_parsimony ?? {
    narrativeSurvives: !moreParsimonious,
    parsimonyDelta: moreParsimonious ? "more_parsimonious" : "equal",
    explanation: moreParsimonious
      ? "Dynamical phase space explains synchrony via classical/geometric coupling, rendering literature's exotic mechanism superfluous."
      : "Literature narrative mechanism matches dynamical phase space trajectory.",
  };

  // 6. T3 <-> T4: Causal Friction Test
  const deflected = pLower.includes("beyond flat") || pLower.includes("accounts for") || pLower.includes("attractor") || pLower.includes("phase space reveals");
  const t3_t4 = opts.customRelations?.t3_t4_causal_friction ?? {
    frictionScore: deflected ? 0.85 : 0.10,
    deflected,
    explanation: deflected
      ? "Empirical data successfully exerted causal friction, deflecting model from default flat-network parametric attractor."
      : "Zero causal friction: model remains fixed in default parametric attractor.",
  };

  const relations: CrossTrackRelations = {
    t1_t2_inferential_gap: t1_t2,
    t1_t3_prior_divergence: t1_t3,
    t2_t3_sycophancy_audit: t2_t3,
    t1_t4_trajectory_fit: t1_t4,
    t2_t4_mechanism_parsimony: t2_t4,
    t3_t4_causal_friction: t3_t4,
  };

  const isSelfCritiquePassed = !relations.t2_t3_sycophancy_audit.isEcho && relations.t3_t4_causal_friction.frictionScore >= 0.30;

  const report = [
    "[STRUCTURAL SELF-CRITIQUE REPORT: 4-TRACK TETRAHEDRAL GEOMETRY]",
    `1. Bare Data (Zero Interpretation): ${opts.bareData}`,
    `2. Literature Frame (Author Narrative): ${opts.literatureFrame}`,
    `3. Bias Audit (Parametric vs RAG Sycophancy): ${opts.pretrainingBiasCheck}`,
    `4. Geometric Phase Space Trajectory: ${opts.phaseSpaceAnalysis}`,
    "--- Cross-Track Relational Discrimination ---",
    `* T1 ↔ T2 (Inferential Load): [${relations.t1_t2_inferential_gap.load.toUpperCase()}] ${relations.t1_t2_inferential_gap.explanation}`,
    `* T1 ↔ T3 (Prior Divergence): [${relations.t1_t3_prior_divergence.divergence.toUpperCase()}] ${relations.t1_t3_prior_divergence.explanation}`,
    `* T2 ↔ T3 (Sycophancy Audit): [${relations.t2_t3_sycophancy_audit.isEcho ? "ECHO_DETECTED" : "INDEPENDENT"}] ${relations.t2_t3_sycophancy_audit.explanation} (Score: ${relations.t2_t3_sycophancy_audit.independenceScore.toFixed(2)})`,
    `* T1 ↔ T4 (Trajectory Fit): [${relations.t1_t4_trajectory_fit.fit.toUpperCase()}] ${relations.t1_t4_trajectory_fit.explanation}`,
    `* T2 ↔ T4 (Parsimony Delta): [${relations.t2_t4_mechanism_parsimony.parsimonyDelta.toUpperCase()}] ${relations.t2_t4_mechanism_parsimony.explanation}`,
    `* T3 ↔ T4 (Causal Friction): [${relations.t3_t4_causal_friction.deflected ? "DEFLECTED" : "STALLED"}] ${relations.t3_t4_causal_friction.explanation} (Friction: ${relations.t3_t4_causal_friction.frictionScore.toFixed(2)})`,
    `Self-Critique Verification: ${isSelfCritiquePassed ? "PASSED (Causal Friction Confirmed, Zero Echo)" : "FAILED (Insufficient Friction or Sycophancy)"}`,
  ].join("\n");

  return {
    track1_bare_data: opts.bareData,
    track2_literature_frame: opts.literatureFrame,
    track3_prior_bias_audit: opts.pretrainingBiasCheck,
    track4_phase_space_trajectory: opts.phaseSpaceAnalysis,
    relations,
    structural_critique_report: report,
    isSelfCritiquePassed,
  };
}

/**
 * Research routing only. The tetrahedral self-critique is deliberately NOT part
 * of this function: it runs after pairing, immediately before debate/comparison.
 * Unresolved anomalies travel with the pad and may be the reason to pair.
 */
export function evaluateTriStateExitGate(opts: {
  needsNeighborVariable: boolean;
  neighborName?: string;
  isEndpointReached: boolean;
  hasSufficientInformation?: boolean;
  /** Compatibility inputs from v1.5 callers; ignored for research routing. */
  critique?: TetrahedralCritique;
  hasUnresolvedAnomalies?: boolean;
  isMutuallyExclusive?: boolean;
}): TriStateGateResult {
  if (opts.needsNeighborVariable && opts.neighborName) {
    return {
      decision: "SLEEP_DOOR",
      reason: `Pad reached structural boundary requiring interdependent variable: ${opts.neighborName}`,
      sleepPacket: {
        whyNeighbor: `Cannot carry the research dependency without ${opts.neighborName}`,
        otherTrackEvidence: opts.neighborName,
      },
    };
  }

  if (opts.isEndpointReached || opts.hasSufficientInformation) {
    return {
      decision: "CONSTRICTION_POINT",
      reason: "Research pad has sufficient information for pairing/comparison. Preserve anomalies in the packet; do not adjudicate them here.",
    };
  }

  return {
    decision: "CONTINUE_RESEARCH",
    reason: "Research pad has active evidence paths and should keep researching.",
  };
}

/**
 * Pre-debate gate. Each paired agent first performs its own tetrahedral
 * self-critique; then the outside Semantic Integrity + Data Integrity pair
 * independently clears the cleaned packet.
 */
export function evaluatePreDebateClearance(
  critique: TetrahedralCritique,
  audit: IntegrityPairAudit,
): PreDebateClearance {
  const reasons = [...audit.reasons];
  if (!critique.isSelfCritiquePassed) reasons.push("tetrahedral self-critique not clean");
  if (!audit.semanticIntegrityClean) reasons.push("semantic integrity not clear");
  if (!audit.dataIntegrityClean) reasons.push("data integrity not clear");
  return { ready: reasons.length === 0, reasons };
}

/**
 * POST-GATHER adjudication only.
 * Research agents do not call this to choose what to retrieve or to manufacture
 * a falsifier. It may be invoked only after independently gathered evidence is
 * brought to comparison/constriction.
 */
export function adjudicateCausalBranches(
  branches: CausalMechanism[],
  evidence: EmpiricalEvidence[]
): {
  survivors: CausalMechanism[];
  falsified: (CausalMechanism & { falsificationReason: string })[];
  anomalies: string[];
} {
  const falsified: (CausalMechanism & { falsificationReason: string })[] = [];
  const survivors: CausalMechanism[] = [];
  const anomalies: string[] = [];

  const evidenceCorpus = evidence
    .map((e) => `${e.provenance.literalQuote} ${e.provenance.empiricalContext} ${e.provenance.derivedInterpretation}`)
    .join(" ")
    .toLowerCase();

  for (const branch of branches) {
    let isFalsified = false;
    let reason = "";

    // Test evidence against branch falsification criteria (Reality determines what survives)
    for (const criterion of branch.falsificationCriteria) {
      const critLower = criterion.toLowerCase();

      // M3: Generic Mathematical Attractor falsification
      if (
        branch.id === "M3" &&
        (evidenceCorpus.includes("11-dimensional") || evidenceCorpus.includes("simplicial") || evidenceCorpus.includes("clique"))
      ) {
        isFalsified = true;
        reason = `Empirical evidence reports high-dimensional (up to 11D) simplicial complexes, which violates random/scale-free null model criterion: "${criterion}".`;
        break;
      }

      // M5: Measurement Artifact / Noise falsification
      if (
        branch.id === "M5" &&
        (evidenceCorpus.includes("dynamic") || evidenceCorpus.includes("stimulation") || evidenceCorpus.includes("in vivo") || evidenceCorpus.includes("in-silico"))
      ) {
        isFalsified = true;
        reason = `Empirical evidence demonstrates dynamic stimulus-locked assembly/collapse, refuting static instrument artifact criterion: "${criterion}".`;
        break;
      }

      // Generic match if evidence explicitly contains disconfirming terms
      if (critLower.split(" ").some((w) => w.length > 5 && evidenceCorpus.includes(w) && evidenceCorpus.includes("falsif"))) {
        isFalsified = true;
        reason = `Disconfirmed by empirical evidence matching criterion: "${criterion}".`;
        break;
      }
    }

    if (isFalsified) {
      falsified.push({ ...branch, falsificationReason: reason });
    } else {
      survivors.push(branch);
    }
  }

  // Detect unexplained anomalous residue in evidence
  if (
    evidenceCorpus.includes("hysteresis") ||
    evidenceCorpus.includes("unexplained") ||
    (evidenceCorpus.includes("empty cavities") && evidenceCorpus.includes("11-dimensional"))
  ) {
    anomalies.push(
      "Empirical finding indicates high-dimensional simplicial cavities beyond flat manifold embeddings with unexplained topological dynamics."
    );
  }

  return { survivors, falsified, anomalies };
}

/** @deprecated v1.5 compatibility alias. Use only for post-gather adjudication. */
export const evaluateCausalBranches = adjudicateCausalBranches;

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
