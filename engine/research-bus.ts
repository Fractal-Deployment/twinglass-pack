/**
 * Variable-centered research bus for the LLMVE Agent Research Kernel.
 *
 * This module is intentionally deterministic. It does not decide truth and it
 * does not own LLMVE meaning. It sequences admission, classifies declared
 * relationship signals, and enforces the TwinGlass pre-comparison gates.
 */

export type EvidenceClass =
  | "MEASURED"
  | "PROXY"
  | "DEMO"
  | "INVALID"
  | "EMPIRICAL_OBSERVATION"
  | "INTERPRETATION"
  | "PROVISIONAL_SYNTHESIS";

export type IntegrityClearance = {
  semanticIntegrityClear: boolean;
  dataIntegrityClear: boolean;
  reasons?: string[];
};

export type ResearchContribution = {
  contributionId: string;
  taskId: string;
  workerId: string;
  variableTargets: string[];
  relationTargets?: string[];
  wordProblemIds?: string[];
  claimClass: EvidenceClass;
  observationIds?: string[];
  sourceAnchors?: string[];
  sourceDigests?: string[];
  literalObservations?: string[];
  interpretations?: string[];
  conditioningAssumptions?: string[];
  units?: string[];
  unresolvedQuestions?: string[];
  proposedNextActions?: string[];
  padDigest: string;
  authorityDigest: string;
};

export type AdmittedContribution = ResearchContribution & {
  admissionSequence: number;
};

export type RelationshipClass =
  | "INDEPENDENT"
  | "SUPPORTING"
  | "COMPLEMENTARY"
  | "DUPLICATIVE"
  | "INCOMPARABLE"
  | "SEMANTIC_CONFLICT"
  | "DATA_CONFLICT"
  | "CAUSAL_CONFLICT"
  | "EXCLUSIVE";

export type RelationshipSignals = {
  sameTarget: boolean;
  duplicateSource?: boolean;
  referentConflict?: boolean;
  unitsComparable?: boolean;
  dataConflict?: boolean;
  causalConflict?: boolean;
  mutuallyExclusive?: boolean;
  complementary?: boolean;
  supporting?: boolean;
};

export const MEET_OUTCOMES = [
  "SYNTHESIS",
  "REPLACEMENT",
  "DEBATE",
  "UNRESOLVED",
] as const;

export type MeetOutcome = (typeof MEET_OUTCOMES)[number];

export type SelfCritiqueRef = {
  contributionId: string;
  passed: boolean;
  artifactPtr: string;
};

export type MeetPacket = {
  meetId: string;
  participants: string[];
  authorityDigest: string;
  relationship: RelationshipClass;
  contributionIds: string[];
  tetrahedralCritiques: SelfCritiqueRef[];
  semanticIntegrityHits: string[];
  dataIntegrityHits: string[];
  allowedOutcomes: readonly MeetOutcome[];
};

export type ExperimentDiscriminator = {
  discriminatingQuestion: string;
  variableTargets: string[];
  requiredMeasurements: string[];
  controls?: string[];
  resources: {
    cpuCores: number;
    ramGb: number;
    gpuCount: number;
    gpuVramMinGb: number;
    exclusiveGpu: boolean;
  };
};

export class ResearchBus {
  private sequence = 0;
  private admitted = new Map<string, AdmittedContribution>();

  admit(
    contribution: ResearchContribution,
    currentAuthorityDigest: string,
    integrity: IntegrityClearance,
  ): AdmittedContribution {
    if (contribution.authorityDigest !== currentAuthorityDigest) {
      throw new Error("authority snapshot stale: reread live llmve-meaning before admission");
    }
    if (!integrity.semanticIntegrityClear || !integrity.dataIntegrityClear) {
      const why = (integrity.reasons ?? []).join("; ") || "integrity clearance incomplete";
      throw new Error(`integrity gate blocked admission: ${why}`);
    }
    if (this.admitted.has(contribution.contributionId)) {
      throw new Error(`duplicate contribution id: ${contribution.contributionId}`);
    }

    const admitted: AdmittedContribution = {
      ...contribution,
      admissionSequence: ++this.sequence,
    };
    this.admitted.set(admitted.contributionId, admitted);
    return admitted;
  }

  get(contributionId: string): AdmittedContribution | undefined {
    return this.admitted.get(contributionId);
  }

  list(): AdmittedContribution[] {
    return [...this.admitted.values()].sort(
      (a, b) => a.admissionSequence - b.admissionSequence,
    );
  }
}

/**
 * Classify declared/measured relationship signals. This is deliberately not a
 * semantic LLM judge: upstream auditors/detectors produce the signals; this
 * function only applies deterministic precedence.
 */
export function classifyRelationship(s: RelationshipSignals): RelationshipClass {
  if (s.referentConflict) return "SEMANTIC_CONFLICT";
  if (s.duplicateSource) return "DUPLICATIVE";
  if (s.sameTarget && s.unitsComparable === false) return "INCOMPARABLE";
  if (s.dataConflict) return "DATA_CONFLICT";
  if (s.mutuallyExclusive) return "EXCLUSIVE";
  if (s.causalConflict) return "CAUSAL_CONFLICT";
  if (s.complementary) return "COMPLEMENTARY";
  if (s.supporting) return "SUPPORTING";
  return "INDEPENDENT";
}

/**
 * Open a TwinGlass meet only after every participant has independently passed
 * the tetrahedral self-critique and the outside SI + Data Integrity pair has
 * re-cleared the material. The packet intentionally has no selected outcome.
 */
export function buildMeetPacket(args: {
  meetId: string;
  contributions: AdmittedContribution[];
  relationship: RelationshipClass;
  critiques: SelfCritiqueRef[];
  integrity: IntegrityClearance;
  semanticIntegrityHits?: string[];
  dataIntegrityHits?: string[];
}): MeetPacket {
  if (args.contributions.length < 2) {
    throw new Error("meet requires at least two admitted contributions");
  }
  if (!args.integrity.semanticIntegrityClear || !args.integrity.dataIntegrityClear) {
    throw new Error("pre-comparison integrity clearance incomplete");
  }

  const participantIds = new Set(args.contributions.map((c) => c.contributionId));
  for (const id of participantIds) {
    const critique = args.critiques.find((c) => c.contributionId === id);
    if (!critique?.passed) {
      throw new Error(`mandatory tetrahedral self-critique incomplete for ${id}`);
    }
  }

  const authorityDigests = new Set(args.contributions.map((c) => c.authorityDigest));
  if (authorityDigests.size !== 1) {
    throw new Error("participants do not share the same authority snapshot");
  }

  return {
    meetId: args.meetId,
    participants: args.contributions.map((c) => c.workerId),
    authorityDigest: args.contributions[0].authorityDigest,
    relationship: args.relationship,
    contributionIds: args.contributions.map((c) => c.contributionId),
    tetrahedralCritiques: args.critiques,
    semanticIntegrityHits: args.semanticIntegrityHits ?? [],
    dataIntegrityHits: args.dataIntegrityHits ?? [],
    allowedOutcomes: MEET_OUTCOMES,
  };
}

export function unresolvedToExperiment(
  meet: MeetPacket,
  discriminator: ExperimentDiscriminator,
) {
  if (!meet.allowedOutcomes.includes("UNRESOLVED")) {
    throw new Error("meet does not permit unresolved outcome");
  }
  return {
    originatingMeetId: meet.meetId,
    outcome: "UNRESOLVED" as const,
    discriminator,
  };
}
