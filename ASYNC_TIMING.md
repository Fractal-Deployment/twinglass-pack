# Asynchronous timing (two lattices)

`measured_omega=false` · no invent-green


Not a wall-clock. Not “wait for all five.” Event-driven joins.

## Main lattice (research legs)

| Event | Clock |
|---|---|
| Walking | Parallel. No barrier. |
| Hard note | Local. Parent keeps walking. |
| Burst spawn | Fan-out. New legs start walking immediately. |
| Enter 3D diamond | **Mutex:** `diamondId`. Other legs hibernate. |
| Diamond complete | This leg → `awaiting-meet`. Others **resume**. |
| Converge | **Join of ≥2** `awaiting-meet`. Not a join of all legs. The other three of five may still be walking. |
| Emit | One walking survivor. May diamond again. |

Dataflow DAG with anastomosing (split then join). Not a tree. Not a math lattice (partial order) except that meet is a join. Not Pathways TPU scheduling — same *word* “async dataflow,” unlike function.

## 3D diamond (internal critique)

Four equatorial paths are **async to each other**. Seal on `define` does not block `redefine`. South mark is the join: all four sealed **and** each projected.

One diamond at a time on the main lattice (hibernate others). Inside the diamond, the four paths are not a second main lattice.

## Structure

```text
main DAG: leg →* legs (clone) … diamond? … join(2+) → emit → …
diamond: north → {define ∥ redefine ∥ explore ∥ adapt} → south
```

HOLD. No dump meter.
