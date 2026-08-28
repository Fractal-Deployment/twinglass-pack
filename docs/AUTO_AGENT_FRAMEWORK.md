# Auto-agent — outer loop (S25)

Pack only. Inner S-queue runner stays `AGENT4_FRAMEWORK.md`. This file is CI watch + telos markers around it.

`measured_omega=false` · no invent-green · **do not merge PRs** · T3 ≠ Zed

```text
CLEAN → SELECT → IMPLEMENT → LOCAL_GATE → PR_OPEN → CI_WATCH
     → (CI_FIX | FIRST_PRINCIPLES_DEBUG | LATTICE_DIVERGE)
     → CONVERGE → PR_READY → ADVANCE → HOLD
```

**PR_READY ≠ merge.** Open the PR. Poll until green or HOLD. Leave it for a human. Never `gh pr merge`. Never fuse T3 (unattended grok CLI) with Zed (ACP desk).

SELECT uses `commands/agent5-next.md` (lowest open S). Do not restart S00–S24.

Spawn lock remains engine truth (`assertLegalSpawnNote`). Diverge only with quoted improper ∧ other. Twin and lattice never on the same charge.

## Telos

`queue/telos.json` is the ending. Markers are waypoints. Fail → `scripts/telos_next.sh` (next unmet marker). Do not swap telos.

## Commands

```bash
bin/auto-agent dry-run
bin/auto-agent next
scripts/local_gates.sh
scripts/ci_poll.sh --pr N
scripts/ci_fix_once.sh --pr N
scripts/solution_spot.sh --msg "S25: …"   # commit + push + PR; does NOT merge
```

CI red → `docs/CI_FIX_LOOP.md`, not a human paste. Max 5 product-fix cycles then HOLD with CLASS + log excerpt.
