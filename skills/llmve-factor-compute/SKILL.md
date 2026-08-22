---
name: llmve-factor-compute
description: >
  Compute F, T_tail, P_L, Phi_E from real orch dumps. Boards must exist.
  Replaces llmve-matmul-algebra. Never a debate score. Never invent-green.
when-to-use: compute P_L, factor boards, dumps exist, matmul algebra, active calculation
user-invocable: true
metadata:
  short-description: "Meters from dumps, not from debate"
---

# llmve-factor-compute

**One job:** multiply only what the dumps contain.

`train_ok=false · measured_omega=false · G1=OPEN · no invent-green`

Meaning of the symbols is `llmve-meaning`. This skill does not redefine them.

## Do

- Read orch dumps / sensor joins / boards.
- Refuse the compute if the board is missing.
- Name the dump ids in the answer.

## Do not

- Use a tournament ranking as P_L.
- Close Omega from a clean writeup.
- Run lattice in order to get a number.

Grok.com: no runner (needs dumps). CLI: this folder.
