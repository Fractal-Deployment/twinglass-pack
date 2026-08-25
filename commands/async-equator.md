---
name: async-equator
description: Four diamond equator paths are async. pendingProjection is per-path, not global.
---

# Async equator paths

Engine: `pendingProjection: Partial<Record<EquatorId, true>>` in `engine/diamond-engine.ts`.  
Seal on `define` does not block `redefine`. `projectIntegrity` is **this path**.

`measured_omega=false` · no invent-green

## Lock

- Four paths: define / redefine / explore / adapt. Async to each other.
- `pendingProjection[path]` — per-path. Not a global pending flag.
- South mark (`markSouth`) joins only when **all four pads are sealed** and **no path still has pending projection**.
- A pending projection on `explore` does not freeze `adapt`.

## Do not

Treat one `project integrity first` as blocking every equator. Twin. Mint Ω.
