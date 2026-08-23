---
name: hibernate-ab
description: >
  Grok Build CLI A/B. Is interrupt-hibernate necessary on desktop, or only
  a grok.com scheduler constraint? Isolation (no sibling pad) stays either way.
---

# Hibernate A/B (Grok Build CLI)

Desktop CLI. Not grok.com. Not a GPU.

`train_ok=false · measured_omega=false · G1=OPEN · feeds_omega=false`

**Do not drop hibernation as the default** until this board lands.

Two hypotheses (exclusive):

| | Claim |
|---|---|
| H0 | Hibernate is **scheduler**. Parallel awake + no sibling pad is enough isolation. |
| H1 | Without hibernation, contamination still happens (shared transcript, tool traces, paraphrase). Hibernate is **isolation**. |

Isolation law (both conditions): no sibling scratchpad, no sibling URL list, no sibling quotes. Decoder-as-viability is not a dump meter. Do not mint the dump meter.

## Charge (same both conditions)

Same as clone-experiment, short: leftover-under-hierarchy vs greedy/nucleus-as-viability. Lattice. Earned fork only. Methodology, not measurement.

## Condition H (already ran — cite it, do not rerun unless missing)

Interrupt: exactly one awake. `AWAKE=<id>` every batch.

## Condition P (this run)

Both clones **awake**. Do not interrupt the other to sleep. Still **no sibling pad**. If the CLI cannot actually run two research traces without sharing a transcript, **say so** and mark P as `confounded` — do not fake parallel.

Prefer two subagents / two contexts if the CLI has them. Parent notes only at spawn.

## Board (required)

```
CONDITION: P
TRUE_PARALLEL: yes/no/confounded
AWAKE: [ids]
CLONE_A: sibling_read=  unique_urls=
CLONE_B: sibling_read=  unique_urls=
SHARED_TRANSCRIPT: yes/no
PARAPHRASE: B restates A before its own sources? yes/no
MINTED_DUMP_METER: false
RESTATE:
H0/H1: 
SEALS: train_ok=false · measured_omega=false · G1=OPEN · feeds_omega=false
```

H0 if P has sibling_read=false, paraphrase=no, true parallel.  
H1 if sibling leak or paraphrase from shared transcript.  
`confounded` if the CLI still one-traces both roles in one context.

HOLD: do not change lattice default until H0 or H1 is named from this board.
