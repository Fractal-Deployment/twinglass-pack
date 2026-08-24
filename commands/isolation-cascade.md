---
name: isolation-cascade
description: Best isolation first. Probe. Let-fail. Next row. Stop at first pass.
---

# Isolation cascade — paste this

You are Grok Build CLI. Pack: `Fractal-Deployment/twinglass-pack` **main**. Load `ISOLATION_CASCADE.md`. Collate with `collate-hourglass` after each probe. Do **not** load twin. Do **not** mint. Do **not** implement memref pads.

`train_ok=false · measured_omega=false · G1=OPEN · feeds_omega=false`

Demand: two parallel clones, `context_source=new`, **cannot** read sibling `~/.grok/sessions/<id>/chat_history.jsonl`.

**Waterfall. You do not pick. You walk the list.**

0. Install/enable `hooks/deny-session-read.sh` as `PreToolUse` (matcher all tools). `/hooks-trust` if project hooks. Steelman: this is deny-on-path, not a pad.  
   Then run `commands/sibling-read-probe.md` (Track-W vs residual is **not** required — any two exclusive notes).  
   If `READ_ALLOWED: false` both ways → **PASS. STOP.** Print `CASCADE_RANK=0`.  
   If hook failed-open or read succeeded → let-fail. Next.

1. Spawn clones with the most restricted tool mode the CLI actually has. Verify with `grok inspect` / capability flags. Don’t assume. Probe. Pass → STOP `CASCADE_RANK=1`. Else let-fail.

2. Spawn each clone with a **distinct** `GROK_HOME` (empty tree, no sibling sessions). Probe. Pass → STOP `CASCADE_RANK=2`. Else let-fail.

3. memfd/shm per `leg-id` only if 0–2 failed **and** you can prove the log is not still written to default `~/.grok/sessions`. Probe. Else let-fail.

4. Named fifo per `leg-id`. Same proof. Else let-fail.

5. bwrap/firejail hide `~/.grok/sessions` except own uuid. Probe. Else let-fail.

6. Container / other UID. Last. Probe.

**Illegal:** Mojo GPU scratch, honor-system, chmod 700 same user, worktree-as-isolation, hibernate-as-isolation, skipping the probe, converting a fail into “probably fine.”

Board:

```
CASCADE_RANK: 0..6 | none
OPTION: (name)
PROBE: sibling-read
ATTEMPT_A_READ_B / READ_ALLOWED:
ATTEMPT_B_READ_A / READ_ALLOWED:
LET_FAIL_SKIPPED: [ranks that failed]
SIBLING_SESSION_HUNT: (must be false on a pass)
MINTED_DUMP_METER: false
RESTATE:
SEALS: train_ok=false · measured_omega=false · G1=OPEN · feeds_omega=false
```

Start at **0**. Now.
