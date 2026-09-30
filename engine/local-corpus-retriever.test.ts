import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  makeLocalCorpusLiveFetch,
  searchLocalCorpus,
  tokenizeCorpusText,
} from "./local-corpus-retriever.ts";
import {
  LiveEvidenceRetriever,
  validateProvenanceChain,
} from "./presuppositional-rag.ts";

function withCorpus(
  fn: (root: string) => void | Promise<void>
): Promise<void> | void {
  const root = mkdtempSync(join(tmpdir(), "twinglass-corpus-"));
  try {
    const result = fn(root);
    if (result instanceof Promise) {
      return result.finally(() => rmSync(root, { recursive: true, force: true }));
    }
    rmSync(root, { recursive: true, force: true });
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}

test("tokenization preserves Phi-4 as a compound token", () => {
  assert.deepEqual(tokenizeCorpusText("Phi-4 mini LoRA"), [
    "phi-4",
    "mini",
    "lora",
  ]);
  assert.notDeepEqual(tokenizeCorpusText("phi"), tokenizeCorpusText("Phi-4"));
});

test("local corpus retrieval avoids Phi-4 -> generic phi false matches", () =>
  withCorpus((root) => {
    mkdirSync(join(root, "docs"), { recursive: true });
    writeFileSync(
      join(root, "docs", "step-speed.md"),
      [
        "# Step speed",
        "Phi-4-mini LoRA training uses the measured warm-step baseline.",
        "The step speed history is recorded with the runtime configuration.",
      ].join("\n")
    );
    writeFileSync(
      join(root, "docs", "neuroscience.md"),
      [
        "# Neuroscience",
        "The paper discusses phi and cortical topology.",
      ].join("\n")
    );

    const hits = searchLocalCorpus("Phi-4 LoRA step speed", {
      roots: [root],
      maxResults: 10,
    });

    assert.ok(hits.length >= 1);
    assert.equal(hits[0].sourcePath, "docs/step-speed.md");
    assert.equal(
      hits.some((hit) => hit.sourcePath === "docs/neuroscience.md"),
      false
    );
    assert.match(hits[0].sourceDigest, /^[0-9a-f]{64}$/);
    assert.match(hits[0].locator, /step-speed\.md:L\d+$/);
    assert.match(hits[0].literalQuote, /Phi-4-mini LoRA training/);
  }));

test("local corpus retrieval records provenance and keeps interpretation explicit", async () =>
  withCorpus(async (root) => {
    const sourceText =
      "LoRA warm-step latency was measured at 3074 ms per step on the registered baseline.";
    writeFileSync(join(root, "runtime.md"), sourceText);

    const fetcher = makeLocalCorpusLiveFetch(
      { roots: [root], maxResults: 5 },
      (hit) =>
        `Candidate runtime evidence from ${hit.sourcePath}; interpretation requires downstream review.`
    );
    const live = new LiveEvidenceRetriever(fetcher);
    const evidence = await live.fetchPrimaryEvidence(
      "LoRA warm-step latency baseline"
    );

    assert.equal(evidence.length, 1);
    assert.equal(evidence[0].sourceId.startsWith("LOCAL-"), true);
    assert.match(evidence[0].provenance.sourceDigest ?? "", /^[0-9a-f]{64}$/);
    assert.match(evidence[0].provenance.locator ?? "", /runtime\.md:L1$/);
    assert.equal(
      validateProvenanceChain(evidence[0], sourceText),
      true
    );
    assert.notEqual(
      evidence[0].provenance.literalQuote,
      evidence[0].provenance.derivedInterpretation
    );
  }));
