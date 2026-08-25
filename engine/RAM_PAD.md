# RAM scratch pad vs Mojo/MLIR

`train_ok=false · measured_omega=false · G1=OPEN

LCD. Collection vs demand.

**Demand:** agent pads that live **in RAM**, not `~/.grok/sessions/*/chat_history.jsonl` (that leak is named). Sibling cannot open sibling pad.

| Collection | Meet? |
|---|---|
| This engine `ScratchPad.lines` (TypeScript heap) | **Named** — grok.com / in-process. Already RAM. Delete after ingest. |
| Node `--experimental-strip-types` | Empty — that’s how we **run tests**, not a pad. |
| Mojo GPU shared memory / `memref` / `max.gpu` scratch | **Empty** — kernel tile scratch. Wrong object. `mojo-cuda` stays silicon plugin. |
| Mojo host `List[String]` in one process | Partial — RAM, but CLI children are **other processes**. No attach. |
| POSIX `memfd` / shm named by `leg-id` only | Named meet **if** children cannot list `~/.grok/sessions` and cannot open another leg’s fd. Not implemented. |
| Per-clone `GROK_HOME` | Named in `ISOLATION_MECH.md`. Ops, not Mojo. |

Do **not** put lattice pads on VRAM “because Mojo.” That is convert-as-LCD.

**Utility that is real today:** TypeScript pads + `deletePads` after ingest. Session-log hunt throws.

**Later (not this unit):** shm/memfd keyed by leg id, or strip FS tools on clones. Mojo/MLIR only if the pad is a **host** buffer with an explicit IPC story — not a GPU kernel.

HOLD. No dump meter. Do not copy `mojo-cuda` into `~/.grok/skills`.
