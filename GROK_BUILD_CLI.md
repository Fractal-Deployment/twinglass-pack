# Grok Build CLI — paste this as the session prompt
You are installing **Twinglass pack** as the only cognition skill set on this machine.
Repo: `https://github.com/Fractal-Deployment/twinglass-pack`
**Install from `main` (plugin 1.4.1).** If the clone is 1.3.0, you have the old pack — fetch again.
Job: clean install. Remove aliases, leftover plugins that only wrap a skill, and duplicate config paths. Do not touch silicon, hooks, or security plugins except to stop copying their skills.
**After install, the gait is** [`commands/run-apparatus.md`](./commands/run-apparatus.md) **plus** [`WORKFLOW_HOST.md`](./WORKFLOW_HOST.md) — one apparatus, two start intents, not twin, not battle.
Spawn is a **CLI notification** (`workflow.agent()`, new-context). SI **gathers**. Meet **staggers**. Collapse writes a **prompt**, not Ω.
## 0. Do not
- Do not copy `mojo-cuda` into `~/.grok/skills`. It stays a plugin.
- Do not uninstall `hookify-plugin` or `security-control-plugin`.
- Do not rewrite LLMVE meters.
- Do not keep `morph-shared` next to `logic-ration-reason` or `honest-prompt-rewrite`.
- Do not load lattice and twin on the same charge.
- Do not ingest Google Drive LLMVE copies. They are **past**. Live meaning is GitHub `Fractal-Deployment/llmve-meaning` `VERSION`.
- Do not `session/fork` or load the parent transcript into a child. Isolation is empty history + parent notes.
- Do not fill cap as an init ritual. Start size = research priorities + situation.
## 1. Inventory (print before you delete)
List, if they exist:
- `~/.grok/skills/`
- `~/.grok/plugins/`
- `~/.grok/plugins/marketplaces/`
- `./.grok/skills/` (walk up from cwd to repo root)
- `~/.agents/skills/`
- `~/.grok/config.toml` — `[skills] paths`, `[plugins]`, marketplace sources
- Installed plugins named: `precise-activate`, `precise-activate-plugin`, `mojo-cuda`, `hookify`, `security-control`, `twinglass`
## 2. Delete alias skill folders (every copy)
Remove these directories wherever they appear (user skills, project `.grok/skills`, plugin `skills/` copies, `~/.agents/skills`):
```
morph-shared
deep-think
deep-research
argueforge
llmve-matmul-algebra
transformer-matmul-geometry
breakthrough-multi-path-thinking
evidence-hourglass-research
```
If a folder is only a stub that `reads` one of the nine pack skills, delete the stub.
## 3. Uninstall skill-wrapper plugins
Uninstall / disable:
- `precise-activate`
- `precise-activate-plugin`
These only pasted LRR. The pack command `/activate` loads `logic-ration-reason`, then `honest-prompt-rewrite`. `/lrr` loads the lock only.
Keep:
- `mojo-cuda` (plugin, not a second skill copy)
- `hookify` (hooks are not skills)
- `security-control` (gates, not a gait)
If `mojo-cuda` also exists under `~/.grok/skills/mojo-cuda`, **delete that skill copy**. One source: the plugin.
## 4. Install the pack (one source)
```bash
git clone https://github.com/Fractal-Deployment/twinglass-pack.git /tmp/twinglass-pack
# confirm plugin.json version is 1.4.1 or newer; if 1.3.0, git -C /tmp/twinglass-pack pull
mkdir -p ~/.grok/skills
rm -rf ~/.grok/skills/logic-ration-reason \
  ~/.grok/skills/llmve-meaning \
  ~/.grok/skills/lcd-glossary-integrity \
  ~/.grok/skills/reason-telos-lookup \
  ~/.grok/skills/honest-prompt-rewrite \
  ~/.grok/skills/twinglass-lattice \
  ~/.grok/skills/twinglass-twin \
  ~/.grok/skills/steelman-truth-tournament \
  ~/.grok/skills/llmve-factor-compute \
  ~/.grok/skills/transformer-stage-atlas \
  ~/.grok/skills/twinglass-dispatch \
  ~/.grok/skills/twinglass-tracker
cp -R /tmp/twinglass-pack/skills/* ~/.grok/skills/
mkdir -p ~/.grok/skills/_twinglass ~/.grok/commands ~/.grok/workflows
cp /tmp/twinglass-pack/DISCOVERED.md ~/.grok/skills/_twinglass/DISCOVERED.md
cp /tmp/twinglass-pack/DISCOVERED.md ~/.grok/skills/twinglass-lattice/DISCOVERED.md
cp /tmp/twinglass-pack/WORKFLOW_HOST.md ~/.grok/skills/_twinglass/WORKFLOW_HOST.md
cp /tmp/twinglass-pack/commands/*.md ~/.grok/commands/ 2>/dev/null || true
cp /tmp/twinglass-pack/.grok/workflows/twinglass.rhai ~/.grok/workflows/twinglass.rhai
```
Old plugin dirs named `twinglass-pack-<oldsha>` (e.g. `2fecf99d`) **lack** `DISCOVERED.md` and `commands/clone-paces.md`. Uninstall those. Reinstall from current `main`. Do not load paces from memory if the file is missing — clone GitHub.
Preferred if plugin install works:
```bash
grok plugin uninstall twinglass || true
grok plugin install /tmp/twinglass-pack --trust
# then do not also keep the skill folders in ~/.grok/skills — pick ONE source
```
**One source of truth.** Either the plugin *or* `~/.grok/skills`. Not both.
## 5. Config.toml
Edit `~/.grok/config.toml`:
- Remove extra `[skills] paths` that point at old `grok-morph-skills` alias trees, `precise-activate`, or `/home/jfox/src/mojo-cuda-plugin` skill copies.
- Do not add a path that reintroduces `morph-shared`.
- Marketplace local paths like `/home/jfox/src/...` — delete. Git/plugin install only.
## 6. Project overlays
In the current repo, if `.grok/skills/` still has alias folders, delete them. If `.grok/plugins/` vendors an old activate plugin, remove it.
`AGENTS.md` / `CLAUDE.md`: if they say “load morph-shared + deep-think + deep-research”, replace with:
```
Cognition pack is Twinglass.
Load honest-prompt-rewrite on every think/research round.
Unearned split → twinglass-lattice.
Known Reason vs Disconfirm → twinglass-twin.
Do not load both gaits. Do not load morph-shared, deep-think, or deep-research.
Spawn is workflow.agent() new-context (twinglass-dispatch). SI gathers (twinglass-tracker). Meet is collate-hourglass.
```
## 7. Verify (fail if any check fails)
Print a table:
| Skill | Count of copies | Paths |
|---|---|---|
| the original nine pack ids | must be 1 each | |
| twinglass-dispatch | must be 1 | |
| twinglass-tracker | must be 1 | |
| morph-shared | must be 0 | |
| deep-think | must be 0 | |
| deep-research | must be 0 | |
| argueforge | must be 0 | |
| mojo-cuda as a *skill folder* | must be 0 (plugin only) | |
| precise-activate plugin | must be 0 | |
Nine pack skills plus two workflow-host occupants:
1. `llmve-meaning`
2. `lcd-glossary-integrity`
3. `reason-telos-lookup`
4. `honest-prompt-rewrite`
5. `twinglass-lattice`
6. `twinglass-twin`
7. `steelman-truth-tournament`
8. `llmve-factor-compute`
9. `transformer-stage-atlas`
10. `twinglass-dispatch`
11. `twinglass-tracker`
Also on disk: `WORKFLOW_HOST.md`, `commands/workflow-host.md`, `.grok/workflows/twinglass.rhai`.
Slash commands that must exist: `/activate` (pack), `/twinglass-lattice`, `/twinglass-twin`, `/workflow-host`.
Confirm `plugin.json` version ≥ 1.4.1.
Reload plugins (`r` on Plugins tab) or start a new session.
## 8. After install — run this gait
Load: `WORKFLOW_HOST.md` + `commands/run-apparatus.md` + `commands/workflow-host.md`.
Print the board every turn, including:
```
START_INTENT: A | B
LEGS:
SENS:
CAP: 10
ACTIVE:
TYPICAL: 25
HARD: 30
STOP_OVER_CAP:
DIAMOND_MUTEX:
AWAITING_MEET:
MEET: debate | synthesis | waiting
SPAWNED_FROM_HARD_NOTES:
SPAWN_REFUSED:
SIBLING_SESSION_HUNT: false
MINTED_DUMP_METER: false
RESTATE:
```
Width law:
- Start harvest from **research priorities and the situation**. Do not fan to 25 as ritual. Do not fill 10 as ritual.
- Engine `SENS_CAP` = 10 stays (do not delete that lock).
- Concurrent CLI `workflow.agent()` sessions: typical ≤ 25; hard STOP 30 (crash observed). Sleeping / awaiting-meet pads are not active.
- Occupants are not width. Octahedron and hourglasses add zero width.
Start:
- **A generate** — default when the partition is unknown. One or more function-sets as the charge actually needs.
- **B converge** — only if court-named packets are already held. Then return to A.
- **PAIR** — only if one pad would clutter a named gutter. Two isolated agents. Complementary, not exclusive.
- **Twin** — XOR leftover. Separate charge. Never with lattice.
Spawn: legal note (`improperEvidence` AND `otherTrackEvidence`) → `twinglass-dispatch` brief → `workflow.agent()` new-context. Parent keeps walking. `cannotFollow` alone is not a spawn. Assigned antithesis refuses. Live-lane synonym refuses.
SI: `twinglass-tracker` ledger. Gather. Do not wipe the pad. Stagger meet until axes named. Complementary named planes = protocol synthesis. Meet occupant remains `collate-hourglass`.
Collapse writes a working prompt. Project telos does not move. `llmve-factor-compute` HOLD. No Ω.
## 9. Workflow host (1.4.1, additive)
Do not delete the nine. Also copy `twinglass-dispatch`, `twinglass-tracker`.
Google Drive LLMVE files are past. Do not install them. Meaning stays a pointer to `Fractal-Deployment/llmve-meaning`.
Do not rewrite LLMVE meters. `llmve-factor-compute` remains HOLD.
Then stop.
