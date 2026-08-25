---
name: agent5-next
description: Pull lowest open Agent Five charge PR and implement only that unit.
---

# Agent Five — next charge

1. Read `AGENT_FIVE_QUEUE.md` on main.
2. `gh pr list --repo Fractal-Deployment/twinglass-pack --state open`
3. Open the **lowest S0N** charge PR still open.
4. Implement **only** that charge. Do not start S0N+1 in the same unit.
5. Keep engine tests, seal grep, occupant-bleed green.
6. Merge. Pull main. Stop. Print board.

Agent Five = this session (login Jadon-Fox). Not github.com/AGENT-5.

`measured_omega=false` · no invent-green
