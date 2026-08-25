---
name: cli-spawn-lock
description: CLI spawn must quote improperEvidence and otherTrackEvidence. Same lock as engine assertLegalSpawnNote.
---

# CLI spawn-lock

Engine: `assertLegalSpawnNote` in `engine/main-lattice.ts` (`spawnLegsBurst`).  
CLI gait: this file + `run-apparatus.md` step 3.

`measured_omega=false` · no invent-green

## Lock (same as engine)

A hard note may spawn a new **leg** only when **both** are quoted:

1. `improperEvidence` — this track is not the proper object (quoted, not a vibe).
2. `otherTrackEvidence` — a different function-set is evidenced (quoted).

Refuse (count `SPAWN_REFUSED`, do not clone):

- missing `improperEvidence`
- missing `otherTrackEvidence`
- other-track is a synonym of a live lane
- other-track is an assigned antithesis (`antithesis` / `assigned opposite` / `opposite account`)

`cannotFollow` alone is **not** a spawn. Keep walking. Write the note. Do not clone.

## Board

```
SPAWNED_FROM_HARD_NOTES: n=
SPAWN_REFUSED: n=
```

## Do not

Change passing engine tests. Twin. Mint Ω.
