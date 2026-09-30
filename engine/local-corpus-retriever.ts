import { createHash } from "node:crypto";
import {
  lstatSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import {
  basename,
  extname,
  join,
  relative,
  resolve,
} from "node:path";
import type {
  EmpiricalEvidence,
  LiveEvidenceFetch,
} from "./presuppositional-rag.ts";

export type LocalCorpusHit = {
  sourceId: string;
  sourcePath: string;
  sourceDigest: string;
  locator: string;
  literalQuote: string;
  relevanceScore: number;
  matchedTerms: string[];
};

export type LocalCorpusSearchOptions = {
  roots: string[];
  maxResults?: number;
  maxFileBytes?: number;
  extensions?: string[];
};

export type LocalCorpusInterpretation = (
  hit: LocalCorpusHit,
  queryCharge: string
) => string;

const DEFAULT_EXTENSIONS = [".md", ".txt", ".json", ".jsonl", ".yaml", ".yml"];
const DEFAULT_MAX_RESULTS = 20;
const DEFAULT_MAX_FILE_BYTES = 2 * 1024 * 1024;
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".venv",
  "venv",
  "__pycache__",
  ".cache",
]);

/**
 * Tokenization deliberately preserves hyphenated/underscored compounds.
 *
 * This prevents the historical bug where a query for "Phi-4" degraded into
 * the generic token "phi" and matched unrelated neuroscience material.
 */
export function tokenizeCorpusText(input: string): string[] {
  return (
    input
      .normalize("NFKC")
      .toLowerCase()
      .match(/[a-z0-9]+(?:[-_][a-z0-9]+)*/g) ?? []
  );
}

function termMatchesToken(term: string, token: string): boolean {
  const compound = term.includes("-") || term.includes("_");
  if (!compound) return token === term;
  return (
    token === term ||
    token.startsWith(`${term}-`) ||
    token.startsWith(`${term}_`)
  );
}

function matchingTerms(queryTerms: string[], text: string): string[] {
  const tokens = tokenizeCorpusText(text);
  return queryTerms.filter((term) =>
    tokens.some((token) => termMatchesToken(term, token))
  );
}

function collectFiles(root: string, extensions: Set<string>, out: string[]): void {
  const abs = resolve(root);
  let stat;
  try {
    stat = lstatSync(abs);
  } catch {
    return;
  }

  if (stat.isSymbolicLink()) return;

  if (stat.isFile()) {
    if (extensions.has(extname(abs).toLowerCase())) out.push(abs);
    return;
  }

  if (!stat.isDirectory()) return;

  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    collectFiles(join(abs, entry.name), extensions, out);
  }
}

function bestMatchingLine(
  text: string,
  queryTerms: string[]
): { line: string; lineNumber: number; matchedTerms: string[] } | null {
  const lines = text.split(/\r?\n/);
  let best:
    | { line: string; lineNumber: number; matchedTerms: string[] }
    | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;
    const matched = matchingTerms(queryTerms, line);
    const specificity = matched.reduce(
      (sum, term) => sum + (term.includes("-") || term.includes("_") ? 2 : 1),
      0
    );
    const bestSpecificity =
      best?.matchedTerms.reduce(
        (sum, term) => sum + (term.includes("-") || term.includes("_") ? 2 : 1),
        0
      ) ?? -1;
    if (
      matched.length > 0 &&
      (!best ||
        matched.length > best.matchedTerms.length ||
        (matched.length === best.matchedTerms.length &&
          specificity > bestSpecificity))
    ) {
      best = { line, lineNumber: index + 1, matchedTerms: matched };
    }
  }

  return best;
}

function stableRelevance(
  matchedCount: number,
  queryCount: number,
  pathMatchedCount: number
): number {
  if (queryCount <= 0) return 0;
  const coverage = matchedCount / queryCount;
  const pathBonus = Math.min(0.15, (pathMatchedCount / queryCount) * 0.15);
  return Math.min(1, Number((coverage + pathBonus).toFixed(6)));
}

/**
 * Search a caller-selected local research corpus without changing authority.
 *
 * This is a structured lexical baseline with provenance, not a semantic
 * authority system and not a claim that lexical search beats embeddings.
 */
export function searchLocalCorpus(
  queryCharge: string,
  options: LocalCorpusSearchOptions
): LocalCorpusHit[] {
  const queryTerms = Array.from(new Set(tokenizeCorpusText(queryCharge)));
  if (queryTerms.length === 0) return [];

  const extensions = new Set(
    (options.extensions ?? DEFAULT_EXTENSIONS).map((x) => x.toLowerCase())
  );
  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  const maxFileBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
  const files: string[] = [];

  for (const root of options.roots) {
    collectFiles(root, extensions, files);
  }

  const hits: LocalCorpusHit[] = [];

  for (const file of files) {
    let raw: Buffer;
    try {
      raw = readFileSync(file);
    } catch {
      continue;
    }
    if (raw.byteLength === 0 || raw.byteLength > maxFileBytes) continue;

    const text = raw.toString("utf8");
    const best = bestMatchingLine(text, queryTerms);
    const pathMatched = matchingTerms(
      queryTerms,
      `${basename(file)} ${file}`
    );

    if (!best && pathMatched.length === 0) continue;

    const line = best?.line ?? basename(file);
    const lineNumber = best?.lineNumber ?? 1;
    const matched = Array.from(
      new Set([...(best?.matchedTerms ?? []), ...pathMatched])
    );

    const digest = createHash("sha256").update(raw).digest("hex");
    const owningRoot =
      options.roots
        .map((root) => resolve(root))
        .find((root) => file === root || file.startsWith(`${root}/`)) ??
      resolve(options.roots[0] ?? ".");
    const displayPath = relative(owningRoot, file) || basename(file);

    hits.push({
      sourceId: `LOCAL-${digest.slice(0, 16)}`,
      sourcePath: displayPath,
      sourceDigest: digest,
      locator: `${displayPath}:L${lineNumber}`,
      literalQuote: line,
      relevanceScore: stableRelevance(
        matched.length,
        queryTerms.length,
        pathMatched.length
      ),
      matchedTerms: matched,
    });
  }

  return hits
    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore ||
        b.matchedTerms.length - a.matchedTerms.length ||
        a.sourcePath.localeCompare(b.sourcePath)
    )
    .slice(0, maxResults);
}

/**
 * Compose the local corpus search with an explicit interpretation step so
 * retrieval never silently manufactures the derived causal interpretation.
 */
export function makeLocalCorpusLiveFetch(
  options: LocalCorpusSearchOptions,
  deriveInterpretation: LocalCorpusInterpretation
): LiveEvidenceFetch {
  if (typeof deriveInterpretation !== "function") {
    throw new TypeError(
      "Local corpus live retrieval requires an explicit interpretation function"
    );
  }

  return (queryCharge: string): EmpiricalEvidence[] =>
    searchLocalCorpus(queryCharge, options).map((hit) => ({
      sourceId: hit.sourceId,
      provenance: {
        primaryDoc: hit.sourcePath,
        literalQuote: hit.literalQuote,
        empiricalContext:
          "Local project corpus retrieval; exact line locator and SHA-256 digest recorded.",
        derivedInterpretation: deriveInterpretation(hit, queryCharge),
        locator: hit.locator,
        sourceDigest: hit.sourceDigest,
      },
      relevanceScore: hit.relevanceScore,
    }));
}
