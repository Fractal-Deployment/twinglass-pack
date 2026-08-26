---
name: auto-agent
description: Outer telos-marker loop. SELECT via agent5-next. CI red → CI_FIX. Do not merge PRs. T3 ≠ Zed.
---

# /auto-agent

Pack: `Fractal-Deployment/twinglass-pack`. Inner map: `AGENT_FIVE_QUEUE.md`. Inner runner: `AGENT4_FRAMEWORK.md`.

1. Clean tree. `git fetch && git checkout main && git pull --ff-only`.
2. `scripts/telos_next.sh` — next unmet marker. Failures regain this; do not swap telos.
3. SELECT: `commands/agent5-next.md` (lowest open S; do not restart S00–S24).
4. Branch `charge/<id>-<slug>`. Implement acceptance only. Spawn lock = engine.
5. `scripts/local_gates.sh` — red = no push.
6. `scripts/solution_spot.sh --msg "S0N: …"` — commit, push, open PR, `ci_poll`. **Do not merge.**
7. CI red → `docs/CI_FIX_LOOP.md` ≤5. Then HOLD.
8. ADVANCE next marker / next open S.

T3 parent = grok CLI unattended. Zed parent = ACP desk. Do not fuse.

`measured_omega=false` · no invent-green · do not invite github.com/Agent-4 or github.com/AGENT-5
