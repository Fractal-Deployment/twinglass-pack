#!/usr/bin/env node
/**
 * Map gh pr checks JSON → exit 0/2/3/4. Fixture path skips network.
 * measured_omega=false — does not invent check conclusions.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

export function normalizeChecks(input) {
  if (Array.isArray(input)) return input;
  if (input && Array.isArray(input.checks)) return input.checks;
  if (input && Array.isArray(input.statusCheckRollup)) return input.statusCheckRollup;
  return [];
}

export function classifyConclusion(name, conclusion, status, bucket) {
  const n = String(name || "").toLowerCase();
  const c = String(conclusion || "").toLowerCase();
  const s = String(status || "").toLowerCase();
  const b = String(bucket || "").toLowerCase();
  if (b === "auth") return "PERMISSION";
  if (
    b === "pending" ||
    s === "in_progress" ||
    s === "queued" ||
    s === "pending" ||
    s === "expected" ||
    c === "" ||
    c === "null"
  ) {
    if (s === "success" || s === "failure" || s === "error" || s === "cancelled") {
      /* fall through */
    } else {
      return "PENDING";
    }
  }
  if (c === "success" || s === "success" || c === "skipped" || c === "neutral" || s === "neutral") {
    return "OK";
  }
  if (/infra|runner|network|actions.?outage/.test(n) || c === "startup_failure") return "INFRA_FAIL";
  if (/flake/.test(n)) return "FLAKE";
  if (/seal|occupant|omega/.test(n)) return "SEAL_FAIL";
  if (/lint|format|typecheck|eslint/.test(n)) return "LINT_FAIL";
  return "TEST_FAIL";
}

export function evaluateChecks(checks) {
  const rows = checks.map((ch) => {
    const name = ch.name || ch.context || ch.workflowName || "unknown";
    const status = ch.status || ch.state || "";
    const conclusion = ch.conclusion || ch.state || "";
    const class_ = classifyConclusion(name, conclusion, status, ch.bucket);
    return { name, conclusion: String(conclusion), status: String(status), class: class_ };
  });
  if (rows.some((r) => r.class === "PERMISSION")) return { exit: 4, rows, reason: "PERMISSION" };
  if (rows.some((r) => r.class === "PENDING")) return { exit: 3, rows, reason: "PENDING" };
  const fails = rows.filter((r) => r.class !== "OK");
  if (fails.length) return { exit: 2, rows, reason: fails[0].class, failing: fails };
  return { exit: 0, rows, reason: "SUCCESS" };
}

export function loadFixture(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function ghJson(args) {
  const r = spawnSync("gh", args, { encoding: "utf8" });
  if (r.error || r.status === 127) return { error: 4, message: r.error?.message || "gh missing" };
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").toLowerCase();
    if (/auth|403|401|permission denied/.test(err)) return { error: 4, message: r.stderr || r.stdout };
    return { error: 4, message: r.stderr || r.stdout || `gh exit ${r.status}` };
  }
  try {
    return { json: JSON.parse(r.stdout || "[]") };
  } catch (e) {
    return { error: 4, message: `bad json: ${e.message}` };
  }
}

export function poll({ pr, runId, fixture }) {
  if (fixture) return evaluateChecks(normalizeChecks(loadFixture(fixture)));
  if (!pr && !runId) return { exit: 4, rows: [], reason: "USAGE", message: "need --pr, --run-id, or --fixture" };
  const args = pr
    ? ["pr", "checks", String(pr), "--json", "name,state,bucket,workflow,link"]
    : ["run", "view", String(runId), "--json", "jobs,conclusion,status"];
  const got = ghJson(args);
  if (got.error) return { exit: 4, rows: [], reason: "INFRA_FAIL", message: got.message };
  let checks = normalizeChecks(got.json);
  if (got.json && Array.isArray(got.json.jobs)) {
    checks = got.json.jobs.map((j) => ({ name: j.name, conclusion: j.conclusion, status: j.status }));
  }
  return evaluateChecks(checks);
}

const isMain = process.argv[1] && process.argv[1].endsWith("ci_poll.mjs");
if (isMain) {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("ci_poll --pr N | --run-id ID | --fixture FILE\n  exit 0 green · 2 fail · 3 pending · 4 auth/infra\n");
    process.exit(0);
  }
  const get = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const result = poll({ pr: get("--pr"), runId: get("--run-id"), fixture: get("--fixture") });
  const failing = (result.failing || []).map((f) => `${f.name}:${f.conclusion}:${f.class}`);
  console.log(JSON.stringify({ EXIT: result.exit, REASON: result.reason, FAILING: failing, ROWS: result.rows, message: result.message || null }, null, 2));
  process.exit(result.exit);
}
