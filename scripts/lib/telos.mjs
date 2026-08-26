#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function repoRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

export function nextMarker(root = repoRoot()) {
  const p = process.env.AUTO_AGENT_TELOS || join(root, "queue", "telos.json");
  if (!existsSync(p)) return { exit: 2, reason: "NO_TELOS_FILE" };
  const data = JSON.parse(readFileSync(p, "utf8"));
  const results = [];
  for (const m of data.markers || []) {
    const r = spawnSync("bash", ["-lc", m.prove], { cwd: root, encoding: "utf8" });
    const ok = r.status === 0;
    results.push({ id: m.id, name: m.name, ok, acceptance: m.acceptance });
    if (!ok) {
      return { exit: 0, state: "OFF_TRAJECTORY", next: m, telos: data.telos, measured_omega: false, results };
    }
  }
  return { exit: 1, state: "TELOS_MET", next: null, telos: data.telos, measured_omega: false, results };
}

const isMain = process.argv[1] && process.argv[1].endsWith("telos.mjs");
if (isMain) {
  const r = nextMarker();
  console.log(JSON.stringify({
    STATE: r.state,
    TELOS: r.telos,
    NEXT: r.next ? `${r.next.id} ${r.next.name}` : "TELOS_MET",
    MARKER_ID: r.next?.id || "TELOS_MET",
    ACCEPTANCE: r.next?.acceptance || r.telos,
    measured_omega: false,
    RESULTS: r.results,
  }, null, 2));
  process.exit(r.exit);
}
