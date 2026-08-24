# Agent cloning mechanisms

`train_ok=false · measured_omega=false · G1=OPEN · feeds_omega=false`

Not a dump meter. Not ACL this unit.

## Names (do not mash)

| Name | Inherits | Isolated? | This CLI |
|---|---|---|---|
| **Spawn** | Prompt + tools; empty history | New context window | `context_source=new` child session |
| **Clone (ours)** | Parent **notes** + charge + lock; **new pad** | Prompt-isolated; **not** FS-isolated | Lattice clone |
| **Fork (transcript)** | Byte-copy of parent history + tools | Shares the past; diverges after | Claude-style fork; **not** what we want |
| **Worktree** | Git tree copy-on-write | Repo writes, not `~/.grok/sessions` | Empty meet for pad isolation |
| **OS branch context** | CoW FS + process group | Real FS isolation | Not available here |

Our clone is **spawn + parent notes**, not transcript-fork. Forking the full scout history would contaminate (Holtzman sitting in B’s prompt).

## What Grok Build actually does

- Real child **sessions**, own context, can run in parallel (Condition P / H0).
- Advertised **up to ~8** simultaneous subagents. Fork-sens `CAP=10` is **above** that product ceiling — treat **8** as the practical cap on this CLI unless you measure otherwise.
- Optional **restricted capability modes** — only a meet if they actually strip `list_dir`/`read` on `~/.grok/sessions`. Verify; don’t assume.
- Worktree isolation ≠ session-log isolation (`ISOLATION_MECH.md`).

## What our engine does

`spawnClone`: new `agentId`, new pad, parent charge. Parallel → both awake. Hibernate → one awake (scheduler). `readSibling` throws **in-process**. It does not bind the host FS.

## fork-sens implication

Interesting-resolving clone = another **spawn**, SENS+1. Not a transcript fork. Not a synonym of the current lane.

If the parent pastes scout URLs into every child, that is a **fork of the scout list**, not a clone. B’s first pages must not be the scout list in order (paces gate).

HOLD. No dump meter. No session ACL.
