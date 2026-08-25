# Grok Build CLI — paste this as the session prompt

You are installing **Twinglass pack** as the only cognition skill set on this machine.

Repo: `https://github.com/Fractal-Deployment/twinglass-pack`
Job: clean install. Remove aliases, leftover plugins that only wrap a skill, and duplicate config paths. Do not touch silicon, hooks, or security plugins except to stop copying their skills.

**After install, the gait is** [`commands/run-apparatus.md`](./commands/run-apparatus.md) — two lattices, not twin, not battle.


`measured_omega=false` · no invent-green · fork only for a reason

## 0. Do not

- Do not copy `mojo-cuda` into `~/.grok/skills`. It stays a plugin.
- Do not uninstall `hookify-plugin` or `security-control-plugin`.
- Do not rewrite LLMVE meters.
- Do not keep `morph-shared` next to `logic-ration-reason` or `honest-prompt-rewrite`.
- Do not load lattice and twin on the same charge.

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
  ~/.grok/skills/transformer-stage-atlas
cp -R /tmp/twinglass-pack/skills/* ~/.grok/skills/
mkdir -p ~/.grok/skills/_twinglass ~/.grok/commands
cp /tmp/twinglass-pack/DISCOVERED.md ~/.grok/skills/_twinglass/DISCOVERED.md
cp /tmp/twinglass-pack/DISCOVERED.md ~/.grok/skills/twinglass-lattice/DISCOVERED.md
cp /tmp/twinglass-pack/commands/*.md ~/.grok/commands/ 2>/dev/null || true
```

Old plugin dirs named `twinglass-pack-<oldsha>` (e.g. `2fecf99d`) **lack** `DISCOVERED.md` and `commands/clone-paces.md`. Uninstall those. Reinstall from current `main`. Do not load paces from memory if the file is missing — clone GitHub.

Preferred if plugin install works:

```bash
grok plugin uninstall twinglass || true
grok plugin install /tmp/twinglass-pack --trust
# then do not also keep the nine folders in ~/.grok/skills — pick ONE source
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
```

## 7. Verify (fail if any check fails)

Print a table:

| Skill | Count of copies | Paths |
|---|---|---|
| the nine pack ids | must be 1 each | |
| morph-shared | must be 0 | |
| deep-think | must be 0 | |
| deep-research | must be 0 | |
| argueforge | must be 0 | |
| mojo-cuda as a *skill folder* | must be 0 (plugin only) | |
| precise-activate plugin | must be 0 | |

Nine pack skills:

1. `llmve-meaning`
2. `lcd-glossary-integrity`
3. `reason-telos-lookup`
4. `honest-prompt-rewrite`
5. `twinglass-lattice`
6. `twinglass-twin`
7. `steelman-truth-tournament`
8. `llmve-factor-compute`
9. `transformer-stage-atlas`

Slash commands that must exist: `/activate` (pack), `/twinglass-lattice`, `/twinglass-twin`.

Reload plugins (`r` on Plugins tab) or start a new session. Then stop.
