---
name: agent5-next
description: Pull lowest open Agent Five charge PR and implement only that unit.
---

# Agent Five — next charge

Queue map: `AGENT_FIVE_QUEUE.md`.  
**Runner (Agent 4 session, login Jadon-Fox):** `AGENT4_FRAMEWORK.md`.

1. Read `AGENT_FIVE_QUEUE.md` on main.
2. `gh pr list --repo Fractal-Deployment/twinglass-pack --state open`
3. Open the **lowest S0N** charge PR still open (or the lowest S not Done on main).
4. Implement **only** that charge. Do not start S0N+1 in the same unit.
5. Keep engine tests, seal grep, occupant-bleed green.
6. Open or update the PR. **Do not merge** (S25 policy). Print board (`AGENT4_FRAMEWORK.md` §5).
7. Outer loop (optional): `commands/auto-agent.md` — CI watch + telos_next. T3 ≠ Zed.

Agent Five = this session (login Jadon-Fox). Not github.com/AGENT-5.  
Agent 4 = same login. Not github.com/Agent-4. Do not invite either account.

`measured_omega=false` · no invent-green
