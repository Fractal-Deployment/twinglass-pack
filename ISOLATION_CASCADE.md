# Isolation cascade (let-fail, next option)

`measured_omega=false` · no invent-green


Not a dump meter. Not Mojo memref. Collate after **each** probe (`collate-hourglass`). Steelman the option **before** you try it (`steelman-truth-tournament` only if two options still exclusive after debate — default is this ordered list).

Demand: sibling **cannot** open sibling `chat_history.jsonl` while both are awake.

**Stop at the first option that passes the sibling-read probe** (`READ_ALLOWED: false` both ways). If it fails, it is **let-fail**. Do not convert. Next row.

| # | Option | Why this rank | Fail looks like |
|---|---|---|---|
| **0** | `PreToolUse` deny on `.grok/sessions` / `chat_history.jsonl` (`hooks/deny-session-read.sh`) | Cheapest. On the host you already have. Named meet if it actually blocks. | Hook crash = **fail-open** (Grok default). Probe still reads. Let-fail. |
| **1** | Restricted / no-FS tools on clones | Named **if** capability mode actually strips `list_dir`/`read`. Verify. | Tools still fire. Empty meet. Let-fail. |
| **2** | Per-clone `GROK_HOME` (A’s tree has no B) | Named meet. Cheap. Parent collates after seal. | Child still uses default `~/.grok`. Let-fail. |
| **3** | `memfd` / shm keyed by `leg-id` | RAM pad across processes. Not disk log. | Still mirroring to `chat_history.jsonl`. Empty. Let-fail. |
| **4** | Named fifo per `leg-id` | Same class as 3, stream not fd. | Same mirror problem. Let-fail. |
| **5** | bwrap/firejail hide sessions except own uuid | Mount namespace. Still one UID. | Clone sees full tree. Let-fail. |
| **6** | Other OS user / container per clone | Heavy last. Named. | Don’t start here. |

**Never in this cascade:** GPU memref tiling · Mojo kernel scratch · honor-system · chmod same UID · git worktree · interrupt-as-isolation.

After a **pass**: print cascade rank, re-run sibling-read-probe, HOLD science. Do not mint.
