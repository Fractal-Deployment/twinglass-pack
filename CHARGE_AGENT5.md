# CHARGE — AGENT-5 (Twinglass advanced)

GitHub reviewer: **AGENT-5**. Not Agent-4. Do not merge from a self-review as Jadon-Fox pretending to be AGENT-5.

`measured_omega=false` · no invent-green  
Meaning **0.3.4**. Do not list `G1`, `train_ok`, `feeds_omega`.

## A. Engine spawn lock (code)

Skill text already says: spawn only with **improper-track evidence** AND **other-track evidence** (quoted, not antithesis, not synonym). Engine `diverge()` / `spawnLegsBurst()` still spawn on any hard note.

**Do:**

1. Extend `HardNote` (or the spawn call) with quoted `improperEvidence` + `otherTrackEvidence`.
2. Refuse spawn if either is missing, if other-track is a synonym of a live lane, or if it is an assigned antithesis.
3. Tests in `engine/main-lattice.test.ts`. Existing 31 tests must still pass.
4. Wire `commands/run-apparatus.md` step 3 to this lock (not “any cannotFollow”).
5. Same conclusion / synthesis stays legal. Logic-fail = three laws broke on **this** track, not “you agreed.”

## B. Finish-evidence board (on disk)

`FINISH_BOARD.md` is **missing**. `FINISH_EVIDENCE.md` is the gait. Prior Mythos 5-leg board is **ore** — **do not recrawl** Conley/MDL.

**Do:** inventory `skills/` vs README. One row per skill. `diverge()` on overlap or stale seals. Collate-hourglass. Steelman only if exclusive leftover. Land `FINISH_BOARD.md` on this branch. Keep / Morph / Delete / HOLD. HOLD `llmve-factor-compute`.

Pack tip ≥ `a123a05`. Meaning 0.3.4 not 0.3.1.

## C. Do not

Twin on this charge. Mint Ω. Factor-compute. Isolation cathedral. Grok Bot. `/loop`. Merge #2-style banner fights. Implement Conley as Mythos.

When A tests are green and B is on disk, request review **AGENT-5** (collaborator write required or the request no-ops).
