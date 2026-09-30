#!/usr/bin/env -S node --experimental-strip-types

import { searchLocalCorpus } from "../engine/local-corpus-retriever.ts";

type Args = {
  roots: string[];
  query: string;
  maxResults: number;
};

function parseArgs(argv: string[]): Args {
  const roots: string[] = [];
  let query = "";
  let maxResults = 20;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") {
      const value = argv[i + 1];
      if (!value) throw new Error("--root requires a path");
      roots.push(value);
      i += 1;
      continue;
    }
    if (arg === "--query") {
      const value = argv[i + 1];
      if (!value) throw new Error("--query requires text");
      query = value;
      i += 1;
      continue;
    }
    if (arg === "--max-results") {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error("--max-results requires a positive integer");
      }
      maxResults = value;
      i += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  if (roots.length === 0) {
    throw new Error("at least one --root is required");
  }
  if (!query.trim()) {
    throw new Error("--query is required");
  }

  return { roots, query, maxResults };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const hits = searchLocalCorpus(args.query, {
    roots: args.roots,
    maxResults: args.maxResults,
  });

  process.stdout.write(
    JSON.stringify(
      {
        retrieval_mode: "live_local_corpus_lexical",
        authority_effect: "none",
        query: args.query,
        roots: args.roots,
        hits,
      },
      null,
      2
    ) + "\n"
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`search_project_corpus: ${message}\n`);
  process.exitCode = 2;
}
