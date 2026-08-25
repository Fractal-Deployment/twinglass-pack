# HardNote required fields

Next to `export type HardNote` in `diamond-engine.ts`.

Spawn (`assertLegalSpawnNote` / `diverge`) requires **quoted** strings, not vibes:

| Field | Required to spawn |
|---|---|
| `cannotFollow` | note only; **not** a spawn by itself |
| `functionSet` | lane name |
| `necessaryBecause` | telos link |
| `improperEvidence` | **yes** — this track is not the proper object |
| `otherTrackEvidence` | **yes** — different function-set; not a live-lane synonym; not assigned antithesis |

Missing either evidence field → throw. Synonym of a live lane → throw. Assigned antithesis → throw.

`measured_omega=false` · no invent-green
