import assert from "node:assert/strict";
import test from "node:test";
import {
  ResearchBus,
  buildMeetPacket,
  classifyRelationship,
  unresolvedToExperiment,
  type ResearchContribution,
} from "./research-bus.ts";

function contribution(id: string, worker: string, authority = "meaning@abc"): ResearchContribution {
  return {
    contributionId: id,
    taskId: "TASK-0001",
    workerId: worker,
    variableTargets: ["Path capacity"],
    relationTargets: ["Path capacity->C_d"],
    claimClass: "MEASURED",
    sourceAnchors: [`source:${id}`],
    sourceDigests: [`sha:${id}`],
    literalObservations: ["measured value"],
    interpretations: ["candidate interpretation"],
    padDigest: `pad:${id}`,
    authorityDigest: authority,
  };
}

const clear = { semanticIntegrityClear: true, dataIntegrityClear: true };

test("admission is serialized and stale authority fails closed", () => {
  const bus = new ResearchBus();
  const a = bus.admit(contribution("A", "cursor"), "meaning@abc", clear);
  const b = bus.admit(contribution("B", "claude"), "meaning@abc", clear);
  assert.equal(a.admissionSequence, 1);
  assert.equal(b.admissionSequence, 2);
  assert.deepEqual(bus.list().map((x) => x.contributionId), ["A", "B"]);

  assert.throws(
    () => bus.admit(contribution("C", "grok", "meaning@old"), "meaning@abc", clear),
    /authority snapshot stale/,
  );
});

test("both outside integrity planes gate admission", () => {
  const bus = new ResearchBus();
  assert.throws(
    () =>
      bus.admit(contribution("A", "cursor"), "meaning@abc", {
        semanticIntegrityClear: false,
        dataIntegrityClear: true,
        reasons: ["referent drift"],
      }),
    /integrity gate blocked admission/,
  );
  assert.throws(
    () =>
      bus.admit(contribution("B", "claude"), "meaning@abc", {
        semanticIntegrityClear: true,
        dataIntegrityClear: false,
        reasons: ["source lineage unresolved"],
      }),
    /integrity gate blocked admission/,
  );
});

test("relationship classification is deterministic and does not manufacture debate", () => {
  assert.equal(classifyRelationship({ sameTarget: true, duplicateSource: true }), "DUPLICATIVE");
  assert.equal(
    classifyRelationship({ sameTarget: true, unitsComparable: false, causalConflict: true }),
    "INCOMPARABLE",
  );
  assert.equal(classifyRelationship({ sameTarget: true, causalConflict: true }), "CAUSAL_CONFLICT");
  assert.equal(classifyRelationship({ sameTarget: true, complementary: true }), "COMPLEMENTARY");
  assert.equal(classifyRelationship({ sameTarget: false }), "INDEPENDENT");
});

test("meet cannot start before per-agent tetrahedral critique and SI/LCD re-clearance", () => {
  const bus = new ResearchBus();
  const a = bus.admit(contribution("A", "cursor"), "meaning@abc", clear);
  const b = bus.admit(contribution("B", "claude"), "meaning@abc", clear);

  assert.throws(
    () =>
      buildMeetPacket({
        meetId: "MEET-1",
        contributions: [a, b],
        relationship: "CAUSAL_CONFLICT",
        critiques: [{ contributionId: "A", passed: true, artifactPtr: "crit/A.json" }],
        integrity: clear,
      }),
    /self-critique incomplete for B/,
  );

  assert.throws(
    () =>
      buildMeetPacket({
        meetId: "MEET-1",
        contributions: [a, b],
        relationship: "CAUSAL_CONFLICT",
        critiques: [
          { contributionId: "A", passed: true, artifactPtr: "crit/A.json" },
          { contributionId: "B", passed: true, artifactPtr: "crit/B.json" },
        ],
        integrity: { semanticIntegrityClear: true, dataIntegrityClear: false },
      }),
    /integrity clearance incomplete/,
  );
});

test("clean meet exposes outcomes without preselecting debate or synthesis", () => {
  const bus = new ResearchBus();
  const a = bus.admit(contribution("A", "cursor"), "meaning@abc", clear);
  const b = bus.admit(contribution("B", "claude"), "meaning@abc", clear);
  const meet = buildMeetPacket({
    meetId: "MEET-2",
    contributions: [a, b],
    relationship: "CAUSAL_CONFLICT",
    critiques: [
      { contributionId: "A", passed: true, artifactPtr: "crit/A.json" },
      { contributionId: "B", passed: true, artifactPtr: "crit/B.json" },
    ],
    integrity: clear,
  });

  assert.deepEqual(meet.allowedOutcomes, ["SYNTHESIS", "REPLACEMENT", "DEBATE", "UNRESOLVED"]);
  assert.equal("selectedOutcome" in meet, false);
});

test("unresolved meet emits a discriminating physical experiment request", () => {
  const bus = new ResearchBus();
  const a = bus.admit(contribution("A", "cursor"), "meaning@abc", clear);
  const b = bus.admit(contribution("B", "claude"), "meaning@abc", clear);
  const meet = buildMeetPacket({
    meetId: "MEET-3",
    contributions: [a, b],
    relationship: "CAUSAL_CONFLICT",
    critiques: [
      { contributionId: "A", passed: true, artifactPtr: "crit/A.json" },
      { contributionId: "B", passed: true, artifactPtr: "crit/B.json" },
    ],
    integrity: clear,
  });

  const out = unresolvedToExperiment(meet, {
    discriminatingQuestion: "Does resistance rise while path geometry remains intact?",
    variableTargets: ["Path capacity", "C_d"],
    requiredMeasurements: ["layer path series", "attention resistance"],
    controls: ["same prompt", "same checkpoint"],
    resources: { cpuCores: 4, ramGb: 16, gpuCount: 1, gpuVramMinGb: 10, exclusiveGpu: true },
  });
  assert.equal(out.outcome, "UNRESOLVED");
  assert.equal(out.discriminator.resources.gpuCount, 1);
});
