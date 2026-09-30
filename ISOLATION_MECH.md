# Isolation failure mechanism (sibling-read probe)
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
| Per-clone `GROK_HOME` / `XDG` relocation only | **Partial only.** Reduces default discovery, but same-UID ambient filesystem authority can still reach a sibling path if it is otherwise visible. |
| Per-clone Landlock filesystem ruleset | **Named first probe.** Process-scoped restrictions can reduce filesystem authority below ordinary same-UID DAC; validate own-path access and cross-agent isolation on the real CLI runtime. |
| bubblewrap/firejail: hide `~/.grok/sessions` except own uuid | **Named meet.** Mount namespace, still one UID. |
| Different OS user / container per clone | **Named meet.** Heavy. |
LCD: chmod/ACL-same-user **look elsewhere**. Convert-as-LCD would be “chmod and call it isolated.”
## Later ops (not this unit)
1. **First probe: Landlock per clone.** Preserve the clone's required runtime/workspace paths while constraining session persistence to the clone's own allowed hierarchy. Record the kernel version, Landlock ABI, policy revision, and validation result. This is not MEASURED isolation until the boundary is exercised on the real CLI runtime.
2. Else **sandbox hide sessions** except own with a mount-namespace tool such as bubblewrap.
3. Else **strip FS tools** on research clones (if the CLI has a real restricted mode — verify, don’t assume).
4. Treat per-clone `GROK_HOME` / `XDG` as organization only unless a kernel-enforced or namespace boundary also prevents sibling-path access. Do not treat worktree or hibernate as this fix.

Research basis:
- Linux Landlock userspace API: https://www.kernel.org/doc/html/latest/userspace-api/landlock.html
- Ubuntu Noble Landlock manpage: https://manpages.ubuntu.com/manpages/noble/man7/landlock.7.html
- bubblewrap mount namespace: https://manpages.ubuntu.com/manpages/focal/man1/bwrap.1.html

HOLD on declaring the isolation residual closed here. Lattice default not rewritten. No factor-compute.
