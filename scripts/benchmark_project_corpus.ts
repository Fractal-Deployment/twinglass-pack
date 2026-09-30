#!/usr/bin/env -S node --experimental-strip-types

import { spawnSync } from "node:child_process";
import { relative, resolve, sep } from "node:path";
import { searchLocalCorpus } from "../engine/local-corpus-retriever.ts";

type Args = {
  roots: string[];
  query: string;
  grepRegex: string;
  expected: string[];
  k: number;
};

function parseArgs(argv: string[]): Args {
  const roots: string[] = [];
  const expected: string[] = [];
  let query = "";
  let grepRegex = "";
  let k = 20;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--root") {
      if (!next) throw new Error("--root requires a path");
      roots.push(next);
      i += 1;
      continue;
    }
    if (arg === "--query") {
      if (!next) throw new Error("--query requires text");
      query = next;
      i += 1;
      continue;
    }
    if (arg === "--grep-regex") {
      if (!next) throw new Error("--grep-regex requires a pattern");
      grepRegex = next;
      i += 1;
      continue;
    }
    if (arg === "--expect") {
      if (!next) throw new Error("--expect requires a path or suffix");
      expected.push(next.replaceAll("\\", "/"));
      i += 1;
      continue;
    }
    if (arg === "--k") {
      const value = Number(next);
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error("--k requires a positive integer");
      }
      k = value;
      i += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  if (roots.length === 0) throw new Error("at least one --root is required");
  if (!query.trim()) throw new Error("--query is required");
  if (!grepRegex.trim()) throw new Error("--grep-regex is required");
  if (expected.length === 0) throw new Error("at least one --expect is required");

  return { roots, query, grepRegex, expected, k };
}

function normalizePath(path: string): string {
  return path.replaceAll(sep, "/");
}

function relativeToAnyRoot(path: string, roots: string[]): string {
  const abs = resolve(path);
  for (const rootRaw of roots) {
    const root = resolve(rootRaw);
    if (abs === root) return normalizePath(relative(root, abs));
    if (abs.startsWith(root + sep)) return normalizePath(relative(root, abs));
  }
  return normalizePath(abs);
}

function matchesExpected(path: string, expected: string): boolean {
  const normalized = normalizePath(path);
  return normalized === expected || normalized.endsWith("/" + expected);
}

function recall(paths: string[], expected: string[]): number {
  const found = expected.filter((want) =>
    paths.some((path) => matchesExpected(path, want))
  ).length;
  return expected.length === 0 ? 0 : found / expected.length;
}

function precisionAtK(paths: string[], expected: string[], k: number): number {
  const top = paths.slice(0, k);
  if (top.length === 0) return 0;
  const relevant = top.filter((path) =>
    expected.some((want) => matchesExpected(path, want))
  ).length;
  return relevant / top.length;
}

function normalizeBaselineOutput(stdout: string, roots: string[]): string[] {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((path) => relativeToAnyRoot(path, roots));
}

function runGrep(
  regex: string,
  roots: string[]
): { implementation: "rg" | "grep"; hits: string[] } {
  const rg = spawnSync(
    "rg",
    [
      "-i",
      "-l",
      "--hidden",
      "--glob",
      "!.git/**",
      "--glob",
      "!node_modules/**",
      "--glob",
      "!.venv/**",
      "--glob",
      "!venv/**",
      "--glob",
      "!__pycache__/**",
      "-e",
      regex,
      ...roots,
    ],
    { encoding: "utf8" }
  );

  if (!rg.error) {
    // ripgrep exits 1 when it finds no matches.
    if (rg.status !== 0 && rg.status !== 1) {
      throw new Error(
        `rg baseline failed with rc=${rg.status}: ${rg.stderr.trim()}`
      );
    }
    return {
      implementation: "rg",
      hits: normalizeBaselineOutput(rg.stdout, roots),
    };
  }

  // GitHub-hosted runners do not guarantee ripgrep. Keep a plain GNU grep
  // fallback because the historical hard baseline in #39 was "plain grep".
  const grep = spawnSync(
    "grep",
    [
      "-R",
      "-I",
      "-i",
      "-l",
      "-E",
      "--exclude-dir=.git",
      "--exclude-dir=node_modules",
      "--exclude-dir=.venv",
      "--exclude-dir=venv",
      "--exclude-dir=__pycache__",
      regex,
      ...roots,
    ],
    { encoding: "utf8" }
  );

  if (grep.error) {
    throw new Error(
      `grep baseline failed to start: rg=${rg.error.message}; grep=${grep.error.message}`
    );
  }
  // GNU grep exits 1 when it finds no matches.
  if (grep.status !== 0 && grep.status !== 1) {
    throw new Error(
      `grep baseline failed with rc=${grep.status}: ${grep.stderr.trim()}`
    );
  }

  return {
    implementation: "grep",
    hits: normalizeBaselineOutput(grep.stdout, roots),
  };
}

try {
  const args = parseArgs(process.argv.slice(2));

  const retrieverHits = searchLocalCorpus(args.query, {
    roots: args.roots,
    maxResults: args.k,
  }).map((hit) => hit.sourcePath);

  const grepBaseline = runGrep(args.grepRegex, args.roots);
  const grepHits = grepBaseline.hits;

  const retrievalRecall = recall(retrieverHits, args.expected);
  const grepRecall = recall(grepHits, args.expected);
  const retrievalPrecisionAtK = precisionAtK(
    retrieverHits,
    args.expected,
    args.k
  );
  const grepPrecisionAtK = precisionAtK(grepHits, args.expected, args.k);

  const verdict =
    retrievalRecall > grepRecall
      ? "retriever_exceeds_grep_on_expected_recall"
      : retrievalRecall === grepRecall
        ? "retriever_matches_grep_on_expected_recall"
        : "retriever_below_grep_on_expected_recall";

  process.stdout.write(
    JSON.stringify(
      {
        benchmark_id: "twinglass_project_corpus_vs_grep_v1",
        authority_effect: "none",
        grep_implementation: grepBaseline.implementation,
        query: args.query,
        grep_regex: args.grepRegex,
        roots: args.roots,
        expected: args.expected,
        k: args.k,
        retriever_hits: retrieverHits,
        grep_hits: grepHits,
        metrics: {
          retriever_expected_recall: retrievalRecall,
          grep_expected_recall: grepRecall,
          retriever_precision_at_k: retrievalPrecisionAtK,
          grep_precision_at_k: grepPrecisionAtK,
        },
        verdict,
      },
      null,
      2
    ) + "\n"
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`benchmark_project_corpus: ${message}\n`);
  process.exitCode = 2;
}
