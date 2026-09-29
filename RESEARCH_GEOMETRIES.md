# TwinGlass Research Geometries and Integrity Envelope

This file is the canonical geometry map for TwinGlass research orchestration.

## Governing distinction

TwinGlass does **not** use thesis/antithesis research assignment. Research agents follow legitimate divergent evidence routes. Debate, synthesis, replacement, or falsification are **downstream outcomes of evidence comparison**, never the initial research instruction.

```text
research first
→ relationship discovery second
→ self-critique before comparison
→ integrity clearance
→ debate / synthesis / replacement / falsification only at convergence
```

The research geometry may change. The outside integrity envelope does not.

---

## 1. Diamond — one bounded divergent evidence round

A Diamond is one bounded research charge that deliberately sends researchers down distinct legitimate evidence routes so the round covers more of the possibility space.

```text
                 CHARGE
                   │
             divergent routes
              /           \
             /             \
       research A       research B
          │                │
      local lattice    local lattice
          │                │
           \              /
            \            /
              CONVERGENCE
                   │
          compare evidence sets
                   │
      synthesize / replace / falsify /
               remain unresolved
```

Rules:

- The two routes are **not** assigned opposites.
- Neither side is tasked to disprove the other.
- Each side gathers real evidence on its own route.
- Each route may branch locally as evidence opens additional sub-paths.
- Falsification, if it occurs, occurs only after the evidence packets are compared.
- A Diamond normally has one primary convergence event.

---

## 2. Local lattice — evidence-driven branching inside a research route

The local lattice is not a debate structure. It is the topology produced while an agent follows evidence.

```text
research leg
   ├─ source / mechanism path
   │    └─ follow-up
   ├─ dataset path
   └─ anomaly / new relation
```

A local branch exists because the evidence opens a meaningful route, not because the orchestrator needs an opponent.

---

## 3. Hourglass — two persistent research directions with repeated constrictions

An Hourglass starts with two independent research directions from the beginning. Each side researches outward, then they meet and compare evidence. The comparison may be debate or synthesis. They then separate again and research further.

```text
A1                 B1
 \                 /
  \               /
    CONSTRICTION 1
  /               \
 /                 \
A2                 B2
 \                 /
  \               /
    CONSTRICTION 2
          ...
```

Rules:

- The initial pair is directional, not thesis/antithesis.
- Each side may use its own local lattice while researching.
- At constriction, compare evidence directly.
- If the accounts are incompatible, debate the actual discovered incompatibility.
- If complementary, synthesize and diverge again from the synthesis.
- A typical run may perform several research→constriction cycles.
- The pair terminates when sufficient information closes the charge or one account is conclusively replaced/falsified by the accumulated evidence.

---

## 4. Spectral lattice — emergent recursive research topology

The Spectral lattice starts with one research agent.

When real evidence reveals a sufficiently independent route that the current agent cannot pursue without corrupting or overloading its own track, that route can spawn a new agent.

```text
A
├── B
│   ├── D
│   └── E
├── C
└── F
```

Rules:

- Spawn because a genuine new research route appeared.
- Never spawn an assigned antithesis.
- Parent continues its own path.
- Spawned agents may themselves spawn further evidence-driven routes.
- The topology is not predetermined.
- Outside auditors can identify agents whose evidence should be compared.
- Pairing for a meet is therefore discovered from the accumulated pads, not assigned at birth.

---

## 5. Invariant outside integrity envelope

Every Diamond, Hourglass, and Spectral run is watched by an outside pair of integrity agents.

### Semantic Integrity Auditor

Watches meaning and inference:

- locked referents and definitions;
- silent definition drift;
- scope changes;
- equivocation;
- category errors;
- premise→conclusion jumps;
- apparent disagreement caused only by different meanings;
- apparent agreement produced by broadened or shifted meanings.

### Data Integrity Auditor / LCD data plane

Watches evidence quality and identity:

- source identity;
- exact provenance and locators;
- measurement context;
- duplicate or derivative sources counted as independent;
- observation/interpretation mixing;
- unsupported completeness claims;
- omitted contradictory measurements;
- evidence packet integrity.

The auditors do not research the answer and do not assign opponents. They continuously observe, flag, and hold where necessary.

```text
research topology
      ⟂
integrity topology
```

A meet is clean only when both planes clear the participating pads.

```text
CONVERGENCE_ELIGIBLE =
    semantic_integrity_clear
    AND
    data_integrity_clear
```

---

## 6. 3D tetrahedral self-critique — pre-meet, per-agent

The tetrahedron is **not** a research-spawn geometry and is **not** the Diamond.

It is a self-critique run by each research agent on its own pad **after a pairing/constriction is identified and before debate or synthesis**.

Each agent performs the critique independently before seeing the opponent's completed comparative argument.

### Four tracks

1. **T1 — Bare Data Inscription**: what was actually measured, quoted, or observed.
2. **T2 — Literature / Narrative Frame**: what authors, consensus, or the researcher inferred from T1.
3. **T3 — Prior Bias / Pre-training Disentanglement**: what the model likely brought before the evidence and where RAG echo may have entered.
4. **T4 — Current Causal Trajectory**: the mechanism the agent currently believes best accounts for the evidence.

The six cross-track relations test the agent **against itself**, not against its future debate partner.

```text
pairing identified
      ↓
Agent A tetrahedron     Agent B tetrahedron
      ↓                       ↓
semantic + data audit of each cleaned pad
      ↓                       ↓
        clean convergence / debate
```

Invariant:

> Debate is discovered, not assigned. Self-critique cleans the account immediately before comparison.

---

## 7. Adjudication timing

During evidence gathering, researchers gather, follow, branch, and self-correct. They are not driven by a falsifier quota.

At convergence, the cleaned evidence packets may yield:

- synthesis;
- replacement/refinement;
- contradiction;
- falsification;
- continued uncertainty.

Falsification is therefore a **downstream adjudication result**, not a research-search instruction.

---

## 8. Shared primitives, separate coordinators

The geometries may share primitives such as:

- ResearchPad
- EvidenceAnchor
- ResearchRoute
- ScratchState
- SleepPacket
- SemanticIntegrityHit
- DataIntegrityHit
- TetrahedralCritique
- CompareEvidence
- Synthesize
- Debate
- ResearchComplete

But orchestration semantics remain separate:

- `DiamondCoordinator` — bounded divergent round, one primary convergence.
- `HourglassCoordinator` — persistent pair, repeated divergence/constriction.
- `SpectralCoordinator` — recursive evidence-driven spawning and auditor-selected pairing.

Do not flatten these into one generic lattice state machine.
