# Asynchronous timing

**Canonical geometry map:** `RESEARCH_GEOMETRIES.md`. `diamondId` is a legacy mutex/API name for the older internal-critique implementation; it is not the canonical Diamond research geometry.
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
## Legacy octahedral critique mutex
One legacy critique at a time on the current main-lattice implementation (hibernate others). Its define / redefine / explore / adapt equator paths remain **async to each other** as historical machinery and must not be conflated with either:
- the canonical **Diamond** repeatable two-agent split-and-return action space; or
- the **mandatory pre-comparison tetrahedral self-critique** defined in `RESEARCH_GEOMETRIES.md` and `PRESUPPOSITIONAL_RAG.md`.
## Structure
```text
main DAG: leg →* legs (clone) … diamond? … join(2+) → emit → …
diamond: north → {define ∥ redefine ∥ explore ∥ adapt} → south
```
HOLD. No dump meter.
