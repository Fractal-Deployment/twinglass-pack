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

function runGrep(regex: string, roots: string[]): string[] {
  const proc = spawnSync(
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

  if (proc.error) {
    throw new Error(`grep baseline failed to start: ${proc.error.message}`);
  }

  // ripgrep exits 1 when it finds no matches.
  if (proc.status !== 0 && proc.status !== 1) {
    throw new Error(
      `grep baseline failed with rc=${proc.status}: ${proc.stderr.trim()}`
    );
  }

  return proc.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((path) => relativeToAnyRoot(path, roots));
}

try {
  const args = parseArgs(process.argv.slice(2));

  const retrieverHits = searchLocalCorpus(args.query, {
    roots: args.roots,
    maxResults: args.k,
  }).map((hit) => hit.sourcePath);

  const grepHits = runGrep(args.grepRegex, args.roots);

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
        benchmark_id: "twinglass_project_corpus_vs_rg_v1",
        authority_effect: "none",
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
