---
name: transformer-stage-atlas
description: >
  Map of every transformer matmul stage, pathologies, design levers.
  Theory. Replaces transformer-matmul-geometry. Does not measure Omega.
when-to-use: transformer stages, QKVO, residual stream, softmax geometry, atlas, pathologies
user-invocable: true
metadata:
  short-description: "Stage map. Not a meter."
---

# transformer-stage-atlas

**One job:** the map. Not the measurement.

`train_ok=false · measured_omega=false · G1=OPEN`

## Do

- Name the stage, the matmul, the shape, the failure mode.
- Point at meaning if a stage is being used as a fake Omega.

## Do not

- Claim `measured_omega` from the atlas.
- Absorb factor-compute.
- Become a second vram-geometry-mapper.

Grok.com: Atlas. CLI: this folder. Long-form stage notes stay in grok-morph-skills references if you still need them — this skill is the job lock.
