---
name: diamond-mutex
description: Legacy mutex command for one-at-a-time pre-debate critique. Not the Research Diamond.
---
# Pre-debate critique mutex

Canonical geometry: `RESEARCH_GEOMETRIES.md`.

The engine still stores the active pre-debate critique holder in legacy field `diamondId`.
Use `enterPreDebateCritique`; `enterCritiqueDiamond` remains a compatibility alias.

Only one leg may occupy the legacy critique substrate at a time. Other spectral legs hibernate during that critique and resume afterward.

This mutex does **not** define the Research Diamond.
