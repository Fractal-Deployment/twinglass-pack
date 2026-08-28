# Agent 4 — S-queue runner

Agent 4 = **this session** (login Jadon-Fox). Not github.com/Agent-4. Do not invite that account. Do not CODEOWNERS it.

Map: `AGENT_FIVE_QUEUE.md` + `charges/S0N-*.md`.  
This file is **how the session executes** that map. Pack only.

`measured_omega=false` · no invent-green

## Design space (picked B)

| Arm | Shape | Verdict |
|-----|--------|---------|
| A | Fold runner into `commands/agent5-next.md` only | Mixes Five’s map with Four’s PR/board/TDD |
| **B** | `AGENT4_FRAMEWORK.md` SSOT + thin pointer from `agent5-next.md` | **Selected** — one runner, queue stays the map |
| C | Second command `agent4-next.md` | Flavor of A; skip |

## 1. Unit selection

1. Pull `origin/main`. Read `AGENT_FIVE_QUEUE.md`.
2. Take the **lowest S-number that is not Done** (queue “landed” / merged charge = Done).
3. One unit per PR. Do not batch S0N+S0N+1 unless the charge file is already a batch (`S10–S12`, `S13–S15`, `S16–S19`, `S20–S24`).
4. If chat names a unit that is already Done, **verify acceptance on disk**, close the leftover issue if open, do **not** re-implement. Then take the next open S.

## 2. Spawn discipline

Skill/command changes that **fork** behavior require quoted:

- `improperEvidence`
- `otherTrackEvidence`

Refuse (record `SPAWN_REFUSED`, do not clone):

- missing either quote
- other-track is a synonym of a live lane
- antithesis as assigned persona (`antithesis` / `assigned opposite` / `opposite account`)

`cannotFollow` alone is not a spawn. Engine: `assertLegalSpawnNote` in `engine/main-lattice.ts`. CLI: `commands/cli-spawn-lock.md` + `run-apparatus.md` step 3.

Do not load twin and lattice on the same charge.

## 3. TDD / gates (before merge)

```bash
node --experimental-strip-types --test engine/*.test.ts
bash scripts/pr-seal-check.sh
bash scripts/occupant-bleed-check.sh
```

Plus the unit’s own script when it exists (`scripts/cli-spawn-lock-check.sh`, `scripts/telos-hold-check.sh`, …).

No invent-green. No Ω.

## 4. PR shape

- Branch: `charge/s0N-<short-name>` (framework-only: `charge/agent4-framework`)
- Title: `S0N: <deliverable>`
- Body: charge path + acceptance checklist + `measured_omega=false`
- Reviewers: not github.com/Agent-4, not github.com/AGENT-5
- Open PR when acceptance is met. **Do not merge** (S25). Human merges.
- Pull main only after a human merge. Next S.

## 5. Board after every unit

```
S: 0N
DELIVERABLE: …
TESTS: pass/fail
RESTATE: one sentence
SEALS: measured_omega=false · no invent-green
NEXT: S0N+1 or HOLD if blocked
```

## 6. Scope wall

Pack `Fractal-Deployment/twinglass-pack` only. Orch, sensors, Ω, Bot, `/loop` → write **HOLD** and stay on the S-queue.

Empty meet: Conley ≠ Mythos. Do not recrawl Mythos.

## Never

- Mint Ω
- Equate Conley with Mythos
- Twin + lattice same charge
- Invite github.com/Agent-4 or github.com/AGENT-5
- Expand into `training_orchestrator` or `llmve-sensors` under this runner
