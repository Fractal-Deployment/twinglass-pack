# Isolation failure mechanism (sibling-read probe)

`measured_omega=false` · no invent-green


Not a dump meter. Not Condition P overturned. H0 (hibernate = scheduler) still holds.

## What actually leaked

Two child sessions, `context_source=new`, 4 ms apart, disjoint returned URL sets. Context windows were separate. **Tools were not.**

Both clones run as the **same OS user**. Grok persists every session under:

```
~/.grok/sessions/<uuid>/chat_history.jsonl
~/.grok/sessions/<uuid>/updates (or equivalent)
```

`list_dir` + grep/read on that tree is a legal tool for a research clone. So A opened B’s log **while B was still writing**. Honor-system `sibling_read=false` never bound the filesystem.

Leak class: **same-UID session-log omniscience**. Not parent injecting pads at spawn. Not Jaccard on returned URLs.

```text
parent
 ├─ clone A (ctx new) ──tools──► ~/.grok/sessions/B/chat_history.jsonl
 └─ clone B (ctx new) ──tools──► ~/.grok/sessions/A/chat_history.jsonl
```

## Why ACL-on-the-same-user is a weak meet

Demand: sibling **cannot** open sibling log.

| Collection | Meet? |
|---|---|
| `chmod 700` session dir | **Empty.** Same UID still reads its own files. |
| POSIX ACL `user:jfox rwx` | **Empty.** Clones are not different users. |
| Interrupt / hibernate | **Empty.** Scheduler. Log still on disk. |
| Git worktree isolation | **Empty.** Isolates repo writes, not `~/.grok/sessions`. |
| “Don’t pass the URL list” | **Empty.** Attack board. |
| Restricted tools (no `list_dir` / no shell on clones) | **Maybe.** Only if the CLI capability mode actually strips FS. |
| Per-clone `GROK_HOME` (or `XDG` data dir) so A’s tree has no B | **Named meet.** Sibling path does not exist in that home. |
| bubblewrap/firejail: hide `~/.grok/sessions` except own uuid | **Named meet.** Mount namespace, still one UID. |
| Different OS user / container per clone | **Named meet.** Heavy. |

LCD: chmod/ACL-same-user **look elsewhere**. Convert-as-LCD would be “chmod and call it isolated.”

## Later ops (not this unit)

1. Prefer **per-clone data root** (cheap, matches demand). Parent collates after seal.
2. Else **sandbox hide sessions** except own.
3. Else **strip FS tools** on research clones (if the CLI has a real restricted mode — verify, don’t assume).
4. Do not treat worktree or hibernate as this fix.

HOLD on implementing ACL/sandbox here. Lattice default not rewritten. No factor-compute.
