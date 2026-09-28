---
name: presuppositional-rag
description: Execute Presuppositional Twin-Lattice RAG research. Expands 7 causal mechanisms from P1-P5 entailments, enforces 4-stage primary provenance, and prunes via discriminating lattice.
---
# /presuppositional-rag
Load `PRESUPPOSITIONAL_RAG.md`, `skills/presuppositional-rag`, `logic-ration-reason`, `lcd-glossary-integrity`.
Then execute the active research cycle from `charges/S30-presuppositional-rag.md`.

## Board fields to print
```text
LAYER_A_PROP: P1 | P2 | P3 | P4 | P5
ENTAILMENTS: E_1 .. E_k
RESEARCH_Q: Q_1 .. Q_k
BRANCHES_M: M_1 .. M_7 (causal, not dialectic)
ACTIVE_RAG_PROVENANCE: primary-doc -> quote -> context -> derived
SI_GATE: HOLD | REDIRECT (precision proportional to inferential load)
FALSIFIED_BRANCHES: count / total (target DFR >= 0.40)
ANOMALIES: unexplained residue
SURVIVOR_NODE: TwinglassResearchNode ID
HUMAN_ESCALATION: true | false (P_n -> P_{n+1}?)
```

## Gait
1. **Orient (Layer A)**: Select presupposition $P_n \in \{P_1..P_5\}$. Do not allow empirical context to overwrite $P_n$.
2. **Project (Rationalization)**: Generate logical entailment $E_i$ and discriminating research question $Q_i$.
3. **Branch**: Expand 7 competing causal explanations ($M_1..M_7$). No binary pro/con camps.
4. **Active RAG**: Formulate targeted queries for disconfirming observations. Fetch primary sources with 4-stage provenance chain.
5. **Constrain (Logic)**: Apply Semantic Integrity gate and Laws of Formal Logic. Term inversions trigger obtuse redirect. Prune falsified branches.
6. **Select (Reason)**: Evaluate surviving branches relative to Telos. Isolate anomalies. Export `TwinglassResearchNode` JSON.
7. **Escalate**: If residual anomaly challenges foundational axioms, halt for human escalation before modifying presuppositions.
