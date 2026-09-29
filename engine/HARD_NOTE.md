# HardNote required fields

Next to `export type HardNote` in `diamond-engine.ts`.

Spawn (`assertLegalSpawnNote` / `diverge`) requires evidence, not manufactured opposition:

| Field | Required to spawn |
|---|---|
| `cannotFollow` | note/context only; **not** a spawn by itself |
| `functionSet` | route/lane name |
| `necessaryBecause` | telos-preserving reason to separate the route |
| `divergenceEvidence` | **yes** — quoted evidence that a distinct research route exists |
| `otherTrackEvidence` | **yes** — quoted evidence naming the distinct function-set; not a synonym; not assigned antithesis |
| `improperEvidence` | legacy compatibility only; retired as a canonical spawn requirement |

The parent path does **not** have to be wrong.

Missing either current evidence field -> throw. Synonym of a live lane -> throw. Assigned antithesis -> throw.
