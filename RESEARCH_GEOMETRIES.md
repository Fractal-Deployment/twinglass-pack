# TwinGlass Research Geometries and Integrity Envelope

This file is the canonical geometry map for TwinGlass research orchestration.

## Governing distinction

TwinGlass does **not** use thesis/antithesis research assignment. Its default job is **research gathering**: send agents down legitimate divergent routes, collect real evidence, preserve provenance, and compare what was found.

```text
research first
→ gather evidence
→ follow genuine divergent routes
→ compare accumulated research
→ synthesize / replace / debate / remain unresolved as warranted
```

There is **no built-in falsifier in the normal research gait**. If the operator later wants an explicit falsification campaign, that is a separate commissioned research operation with its own team; it is not silently embedded in ordinary evidence gathering.

The research geometry may change. The outside integrity envelope does not.

---

## 1. Diamond — one two-agent research action space

A Diamond is a single **action space**: send two research agents down distinct legitimate evidence routes, let each gather research, then bring their evidence back together for comparison. "Single" describes the shape of one Diamond action, **not** a limit on how many Diamonds a workflow may run. Diamonds may be repeated or composed whenever the research requires another two-agent split-and-return action.

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
      synthesize / replace / debate /
               remain unresolved
```

Rules:

- The two routes are **not** assigned opposites.
- Neither side is tasked to disprove the other.
- Each side gathers real evidence on its own route.
- Each route may branch locally as evidence opens additional sub-paths.
- The Diamond itself does not contain a falsifier.
- One Diamond action sends two agents out and brings those two evidence packets back together. Another Diamond action can be run later if needed.

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
- The pair terminates when sufficient information closes the charge, one account is replaced by a better-supported account, or the operator ends the research cycle.

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

## 6. 3D tetrahedral self-critique — pre-debate, per-agent

The tetrahedron is **not** a research-spawn geometry and is **not** the Diamond.

It is a self-critique run by each research agent on its own pad **when the agents are preparing to enter an actual debate**. It is not required merely because two evidence packets are being synthesized.

### Four tracks

1. **T1 — Bare Data Inscription**: what was actually measured, quoted, or observed.
2. **T2 — Literature / Narrative Frame**: what authors, consensus, or the researcher inferred from T1.
3. **T3 — Prior Bias / Pre-training Disentanglement**: what the model likely brought before the evidence and where RAG echo may have entered.
4. **T4 — Current Causal Trajectory**: the mechanism the agent currently believes best accounts for the evidence.

The six cross-track relations test the agent **against itself**, not against its future debate partner.

```text
debate identified
      ↓
Agent A tetrahedron     Agent B tetrahedron
      ↓                       ↓
semantic + data audit of each cleaned pad
      ↓                       ↓
        clean convergence / debate
```

Invariant:

> Debate is discovered, not assigned. The tetrahedron cleans each agent's own account immediately before debate.

---

## 7. Comparison and optional falsification campaigns

Normal TwinGlass research compares gathered evidence without requiring a falsifier. A comparison may synthesize complementary findings, prefer one account over another, expose a real contradiction, or remain unresolved.

If the operator explicitly wants to test whether an assembled claim can be broken, that becomes a **separate falsification campaign**: another research team is commissioned to gather evidence relevant to that challenge. Do not smuggle that mission into ordinary research agents.

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

- `DiamondCoordinator` — one two-agent split-and-return action space; repeatable as needed.
- `HourglassCoordinator` — persistent pair, repeated divergence/constriction.
- `SpectralCoordinator` — recursive evidence-driven spawning and auditor-selected pairing.

Do not flatten these into one generic lattice state machine.
