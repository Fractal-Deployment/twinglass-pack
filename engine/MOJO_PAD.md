# Mojo memref / named pipes / RAM pad

`train_ok=false · measured_omega=false · G1=OPEN

Demand: a **leg’s scratch pad** other legs cannot open, not on `~/.grok/sessions`.

| Collection | What it is | Meet? |
|---|---|---|
| **memref tiling** | MLIR/Mojo layout of a tensor (tile sizes, cache). Kernel codegen. | **Empty.** Wrong object. |
| GPU shared memory / `max.gpu` scratch | Per-block kernel scratch | **Empty.** |
| Host Mojo `List[String]` | RAM in **one** process | Partial. CLI clones are other processes. |
| **Named pipes (FIFOs)** | Byte stream IPC. `mkfifo` per `leg-id`. | **Possible named meet** if siblings cannot open another leg’s fifo and nothing is mirrored to `chat_history.jsonl`. Not built. |
| `memfd` / POSIX shm | Anonymous RAM fd named by leg | Same class as fifo. Not built. |
| **TS `ScratchPad.lines`** | Engine heap | **Named meet in-process.** This is the pad today. |

Do not tile memrefs “for the lattice.” Do not put pads on VRAM. `mojo-cuda` stays silicon.

If you implement IPC later: one fifo/shm **per leg id**, parent notes only at spawn, never a shared `pads.json` on disk.

HOLD.
