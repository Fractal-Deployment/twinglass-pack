---
name: cli-spawn-lock
description: CLI spawn requires divergenceEvidence and otherTrackEvidence. Same lock as engine assertLegalSpawnNote.
---
# CLI spawn-lock

Engine: `assertLegalSpawnNote` in `engine/main-lattice.ts`.

A hard note may spawn a new **spectral research leg** only when:
1. `divergenceEvidence` — quoted evidence that a distinct route exists.
2. `otherTrackEvidence` — quoted evidence naming that distinct route/function-set.
3. `necessaryBecause` — why separating it preserves the research telos.

Refuse (`SPAWN_REFUSED`, do not clone):
- missing `divergenceEvidence`
- missing `otherTrackEvidence`
- route is a synonym of a live lane
- route is an assigned antithesis

`cannotFollow` alone is **not** a spawn. Parent keeps walking.

The parent route does **not** have to be wrong. `improperEvidence` is retired vocabulary retained only for old serialized notes.

## Board
```text
SPAWNED_FROM_HARD_NOTES: n=
SPAWN_REFUSED: n=
```

A legal note dispatches an isolated `workflow.agent()` brief; it does not clone the parent transcript.
