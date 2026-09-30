import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("project corpus benchmark compares retriever with grep baseline on the same fixture", () => {
  const root = mkdtempSync(join(tmpdir(), "twinglass-benchmark-"));
  try {
    mkdirSync(join(root, "docs"), { recursive: true });
    writeFileSync(
      join(root, "docs", "step-speed.md"),
      [
        "# Runtime history",
        "Phi-4-mini LoRA step speed was measured on the registered warm baseline.",
      ].join("\n")
    );
    writeFileSync(
      join(root, "docs", "other.md"),
      "Generic phi topology paper with no model-runtime evidence.\n"
    );

    const proc = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "scripts/benchmark_project_corpus.ts",
        "--root",
        root,
        "--query",
        "Phi-4 LoRA step speed",
        "--grep-regex",
        "Phi-4|LoRA|step speed",
        "--expect",
        "docs/step-speed.md",
        "--k",
        "10",
      ],
      { encoding: "utf8" }
    );

    assert.equal(proc.status, 0, proc.stderr);
    const report = JSON.parse(proc.stdout);
    assert.equal(report.benchmark_id, "twinglass_project_corpus_vs_grep_v1");
    assert.equal(report.authority_effect, "none");
    assert.equal(report.metrics.retriever_expected_recall, 1);
    assert.equal(report.metrics.grep_expected_recall, 1);
    assert.equal(
      report.retriever_hits.includes("docs/other.md"),
      false,
      "compound Phi-4 query must not degrade into generic phi"
    );
    assert.match(report.verdict, /matches_grep|exceeds_grep/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
