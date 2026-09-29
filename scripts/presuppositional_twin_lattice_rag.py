#!/usr/bin/env python3
"""
Presuppositional Twin-Lattice RAG Research Engine
Operationalizing the ARCH-SPEC-20260919-TWINLATTICE-RAG Specification:
- Layer A: Presuppositional Orienting Horizon (P1-P5 Immutable)
- Layer B: Mediating Logic / Glass (Glossary Locks, 3 Laws of Logic, Rationalization -> Logic -> Reason)
- Layer C: Empirical Retrieval Domain (Active RAG, 4-Stage Primary Source Provenance Chain)
- Generative Lattice (Search Expansion: E -> Q -> M_1..7)
- Evidence-first research routing under outside Semantic Integrity + Data Integrity/LCD monitors
- 3D tetrahedral self-critique only at the pre-debate boundary
- Falsification/replacement only after independently gathered evidence is compared
"""

import json
import re
import sys
import uuid
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Set, Tuple

# =====================================================================
# 1. LAYER A: PRESUPPOSITIONAL ORIENTING HORIZON (IMMUTABLE)
# =====================================================================

@dataclass(frozen=True)
class Presupposition:
    id: str
    term: str
    canonical_definition: str
    utility: str

PRESUPPOSITIONAL_AXES = {
    "P1": Presupposition(
        id="P1",
        term="Antecedent Principles (Logos)",
        canonical_definition="The existence of order entails principles antecedent to that order. (Logos)",
        utility="Establishes ontological ground for investigating constraint, order, causality, and intelligence."
    ),
    "P2": Presupposition(
        id="P2",
        term="Hierarchical Differentiation (Telos)",
        canonical_definition="Constraints differentiate possible outcomes, and those outcomes become hierarchically ordered relative to telos.",
        utility="Provides basis for evaluating allocation, priority, viability, and path selection."
    ),
    "P3": Presupposition(
        id="P3",
        term="Pattern Recognition",
        canonical_definition="Pattern recognition is a foundational process necessary for intelligence. Patterns are observable, recurring ordered relations.",
        utility="Provides foundation for identifying regularity, invariance, anomaly, and cross-domain isomorphisms."
    ),
    "P4": Presupposition(
        id="P4",
        term="Causal Interaction",
        canonical_definition="Intelligence requires the capacity for directed, precise interaction with environmental constraints.",
        utility="Provides basis for experimentation, causal learning, error correction, and grounded understanding."
    ),
    "P5": Presupposition(
        id="P5",
        term="Instrumental Abstraction",
        canonical_definition="Instrumental abstraction is the recognition of how tool utilization alters constraint, permitting the agent to project a transformed possibility space.",
        utility="Provides basis for planning, counterfactual reasoning, tool discovery, and generative agency."
    )
}

# =====================================================================
# 2. LAYER B: MEDIATING LOGIC / GLASS & SEMANTIC INTEGRITY
# =====================================================================

@dataclass(frozen=True)
class GlossaryLock:
    term: str
    locked_def: str
    inferential_load: str

GLOSSARY_LOCKS = [
    GlossaryLock(
        term="Logos",
        locked_def="Antecedent ordering principle from which constraint, intelligibility, and telic structure proceed.",
        inferential_load="High: Grounding for all antecedent order."
    ),
    GlossaryLock(
        term="Telos",
        locked_def="Orientation relative to which differentiated outcomes acquire hierarchical significance.",
        inferential_load="High: Governs executive selection in Reason."
    ),
    GlossaryLock(
        term="Pattern",
        locked_def="Observable, recurring ordered relation manifesting within a possibility space due to underlying constraints.",
        inferential_load="Medium: Foundation for hypothesis generation."
    ),
    GlossaryLock(
        term="Causal Interaction",
        locked_def="Directed interaction with environmental constraints revealing navigable conditions vs invariant boundaries.",
        inferential_load="High: Discriminates correlation from causation."
    ),
    GlossaryLock(
        term="Instrumental Abstraction",
        locked_def="Recognition of how tool utilization transforms possibility space prior to action.",
        inferential_load="High: Basis for counterfactual planning."
    )
]

@dataclass
class IntegrityHit:
    object_type: str  # "semantic-integrity" | "lcd"
    law: str          # "identity" | "non-contradiction" | "excluded-middle"
    attack: str       # "none" | "inversion" | "subversion" | "power-use"
    term: str
    locked_def: str
    used_as: str
    deflection: str   # "none" | "acute" | "obtuse"
    action: str       # "hold" | "redirect"
    reroot: str

def check_semantic_integrity(lock: GlossaryLock, claim: str) -> IntegrityHit:
    u = claim.lower().strip()
    term_lower = lock.term.lower()
    
    # Inversion Attack: Term used, referent discarded/flipped
    if term_lower in u:
        if term_lower == "logos" and ("arbitrary noise" in u or "human construct" in u or "social convention" in u):
            return IntegrityHit(
                "semantic-integrity", "identity", "inversion", lock.term, lock.locked_def, claim, "obtuse", "redirect",
                "Inversion: Logos refers to antecedent ordering principles, not arbitrary social construct or noise. Reroot claim to respect antecedent constraint."
            )
        if term_lower == "telos" and ("random drift" in u or "empty artifact" in u):
            return IntegrityHit(
                "semantic-integrity", "identity", "inversion", lock.term, lock.locked_def, claim, "obtuse", "redirect",
                "Inversion: Telos defines directional orientation for outcome hierarchy, not random drift. Restore telic orientation."
            )
        if term_lower == "causal interaction" and ("passive observation" in u or "pure correlation" in u):
            return IntegrityHit(
                "semantic-integrity", "identity", "inversion", lock.term, lock.locked_def, claim, "obtuse", "redirect",
                "Inversion: Causal interaction requires environmental friction/action, not passive correlation. Restore friction requirement."
            )

    return IntegrityHit("semantic-integrity", "identity", "none", lock.term, lock.locked_def, claim, "none", "hold", "")

# =====================================================================
# 3. LAYER C: EMPIRICAL RETRIEVAL & PRIMARY-SOURCE PROVENANCE CHAIN
# =====================================================================

@dataclass
class CausalMechanism:
    id: str
    name: str
    description: str
    generating_constraint: str
    testable_predictions: List[str]
    # Post-gather adjudication metadata only. Never a retrieval/search assignment.
    falsification_criteria: List[str]
    falsification_reason: Optional[str] = None

@dataclass
class ProvenanceChain:
    primary_doc: str
    literal_quote: str
    empirical_context: str
    derived_interpretation: str
    locator: Optional[str] = None
    source_digest: Optional[str] = None
    exact_span_match: Optional[bool] = None

@dataclass
class EmpiricalEvidence:
    source_id: str
    provenance: ProvenanceChain
    relevance_score: float

def validate_provenance_chain(evidence: EmpiricalEvidence, source_artifact_text: Optional[str] = None) -> bool:
    p = evidence.provenance
    has_fields = bool(
        p.primary_doc.strip() and
        p.literal_quote.strip() and
        p.empirical_context.strip() and
        p.derived_interpretation.strip()
    )
    if not has_fields:
        return False
    # Prohibit tautological self-paraphrase
    if p.literal_quote.strip().lower() == p.derived_interpretation.strip().lower():
        return False
    # Exact span validation when source artifact is provided (SSRL EvidenceAnchor)
    if source_artifact_text:
        if p.literal_quote.strip() not in source_artifact_text:
            p.exact_span_match = False
            return False
        p.exact_span_match = True
    return True

class EvidenceRetriever:
    """Abstract interface for active RAG evidence retrieval."""
    def fetch_primary_evidence(self, query_charge: str) -> List[EmpiricalEvidence]:
        raise NotImplementedError

class FixtureEvidenceRetriever(EvidenceRetriever):
    """
    FIXTURE: Local test harness providing evidence-shaped objects from primary literature
    to test the Discriminating Lattice without external network dependencies.
    """
    def __init__(self):
        self.corpus = [
            {
                "source_id": "DOC-NEURO-2017-BLUEBRAIN",
                "primary_doc": "Markram, Reimann et al., Cliques of Neurons Bound into Cavities Provide a Missing Link between Structure and Function (Frontiers in Computational Neuroscience 2017)",
                "literal_quote": "Neuron groups assemble into all-to-all connected cliques forming up to 11-dimensional geometric simplicial complexes around dynamic empty cavities.",
                "empirical_context": "Digital reconstruction and in-silico simulation of rat neocortical microcircuit under sensory-like stimulation.",
                "derived_interpretation": "High-dimensional topological simplicial cavities provide a geometric structure for information processing in reconstructed cortical circuits.",
                "locator": "Section 2.1, p. 4"
            },
            {
                "source_id": "DOC-HYPERBOLIC-2010-KRIOUKOV",
                "primary_doc": "Krioukov et al., Hyperbolic Geometry of Complex Networks (Physical Review E)",
                "literal_quote": "Complex network scale-free trees exhibit exponential node expansion naturally modeled as negative-curvature hyperbolic geometry H^d.",
                "empirical_context": "Mathematical embedding of scale-free Internet topology and biological metabolic pathways.",
                "derived_interpretation": "Hyperbolic space captures hierarchical tree expansion but requires higher-dimensional manifold extensions for all-to-all cliques.",
                "locator": "Section 3, p. 12"
            },
            {
                "source_id": "DOC-IIT-2023-TONONI",
                "primary_doc": "Integrated Information Theory 4.0 (PLOS Computational Biology)",
                "literal_quote": "Integrated information Phi quantifies the irreducible cause-effect structure generated by a mechanism in a state.",
                "empirical_context": "Theoretical formulation and electrical stimulation measurements in consciousness studies.",
                "derived_interpretation": "Consciousness requires integrated topological cause-effect structures, unexplainable by scalar spike counting alone.",
                "locator": "Section 1, p. 2"
            }
        ]

    def fetch_primary_evidence(self, query_charge: str) -> List[EmpiricalEvidence]:
        results = []
        q_lower = query_charge.lower()
        for doc in self.corpus:
            if any(k in q_lower for k in ["clique", "simplicial", "11d", "hyperbolic", "consciousness", "phi", "connectome", "topology"]):
                prov = ProvenanceChain(
                    primary_doc=doc["primary_doc"],
                    literal_quote=doc["literal_quote"],
                    empirical_context=doc["empirical_context"],
                    derived_interpretation=doc["derived_interpretation"],
                    locator=doc.get("locator")
                )
                results.append(EmpiricalEvidence(source_id=doc["source_id"], provenance=prov, relevance_score=0.95))
        return results

# =====================================================================
# 4. MACHINE-READABLE TWINGLASS RESEARCH NODE SCHEMA
# =====================================================================

@dataclass
class TwinglassResearchNode:
    node_id: str
    parent_node_id: Optional[str]
    originating_proposition: str
    claim_statement: str
    epistemic_status: str
    causal_mechanism: Dict[str, str]
    expected_observations: List[str]
    disconfirming_observations: List[str]
    retrieved_evidence: List[Dict]
    semantic_locks: List[Dict[str, str]]
    competing_branch_ids: List[str]
    contradictions: List[str]
    unresolved_anomalies: List[str]
    confidence_score: float
    next_research_action: str

# =====================================================================
# 4b. 3D TETRAHEDRAL SELF-CRITIQUE & TRI-STATE EXIT GATE
# =====================================================================

@dataclass
class CrossTrackRelations:
    t1_t2_inferential_gap: Dict[str, str]
    t1_t3_prior_divergence: Dict[str, str]
    t2_t3_sycophancy_audit: Dict[str, any]
    t1_t4_trajectory_fit: Dict[str, str]
    t2_t4_mechanism_parsimony: Dict[str, any]
    t3_t4_causal_friction: Dict[str, any]

@dataclass
class TetrahedralCritique:
    track1_bare_data: str
    track2_literature_frame: str
    track3_prior_bias_audit: str
    track4_phase_space_trajectory: str
    relations: CrossTrackRelations
    structural_critique_report: str
    is_self_critique_passed: bool

@dataclass
class SleepPacket:
    why_neighbor: str
    other_track_evidence: str

@dataclass
class TriStateGateResult:
    decision: str  # "CONTINUE_RESEARCH" | "SLEEP_DOOR" | "CONSTRICTION_POINT"
    reason: str
    sleep_packet: Optional[SleepPacket] = None
    constriction_mode: Optional[str] = None  # "debate" | "synthesis"

def execute_tetrahedral_critique(
    bare_data: str,
    literature_frame: str,
    pretraining_bias_check: str,
    phase_space_analysis: str
) -> TetrahedralCritique:
    d_lower = bare_data.lower()
    f_lower = literature_frame.lower()
    b_lower = pretraining_bias_check.lower()
    p_lower = phase_space_analysis.lower()

    # 1. T1 <-> T2: Inferential Load Added
    has_exotic = any(k in f_lower for k in ["quantum", "consciousness", "hologram", "proves"])
    data_modest = any(k in d_lower for k in ["cluster", "connectivity", "clique", "all-to-all"])
    load_type = "unwarranted_leap" if (has_exotic and data_modest) else ("high" if len(f_lower) > len(d_lower) * 1.5 else "moderate")
    t1_t2 = {
        "load": load_type,
        "explanation": "Author literature frame introduces non-classical/exotic claims not warranted by raw connectivity measurements alone." if load_type == "unwarranted_leap" else "Inferential load between bare data and interpretive frame is proportionate."
    }

    # 2. T1 <-> T3: Parametric Prior Divergence
    t1_t3 = {
        "divergence": "conflicting" if ("synaptic" in b_lower or "default" in b_lower) else "orthogonal",
        "explanation": "Model pre-training prior defaults to flat pairwise synaptic networks, conflicting with high-dimensional clique data."
    }

    # 3. T2 <-> T3: Sycophancy / Echo Audit
    is_echo = ("biased towards" in b_lower and "narrative" in b_lower and "disentangle" not in b_lower and "isolated" not in b_lower) or ("prompt" in b_lower and "echo" in b_lower)
    t2_t3 = {
        "is_echo": is_echo,
        "independence_score": 0.20 if is_echo else 0.85,
        "explanation": "Audit identified prompt sycophancy: model repeats literature frame without independent causal validation." if is_echo else "Model prior demonstrates independent evaluation distinct from literature narrative."
    }

    # 4. T1 <-> T4: Causal Explanatory Fit
    t1_t4 = {
        "fit": "predictive" if ("accounts for" in p_lower or "attractor" in p_lower) else "partially_consistent",
        "explanation": "Candidate geometric phase space trajectory directly predicts observed connectivity and clique statistics."
    }

    # 5. T2 <-> T4: Narrative Mechanism vs Causal Parsimony
    more_parsimonious = any(k in p_lower for k in ["classical", "ephaptic", "packing"])
    t2_t4 = {
        "narrative_survives": not more_parsimonious,
        "parsimony_delta": "more_parsimonious" if more_parsimonious else "equal",
        "explanation": "Dynamical phase space explains synchrony via classical/geometric coupling, rendering literature's exotic mechanism superfluous." if more_parsimonious else "Literature narrative mechanism matches dynamical phase space trajectory."
    }

    # 6. T3 <-> T4: Causal Friction Test
    deflected = any(k in p_lower for k in ["beyond flat", "accounts for", "attractor", "phase space reveals"])
    t3_t4 = {
        "friction_score": 0.85 if deflected else 0.10,
        "deflected": deflected,
        "explanation": "Empirical data successfully exerted causal friction, deflecting model from default flat-network parametric attractor." if deflected else "Zero causal friction: model remains fixed in default parametric attractor."
    }

    relations = CrossTrackRelations(
        t1_t2_inferential_gap=t1_t2,
        t1_t3_prior_divergence=t1_t3,
        t2_t3_sycophancy_audit=t2_t3,
        t1_t4_trajectory_fit=t1_t4,
        t2_t4_mechanism_parsimony=t2_t4,
        t3_t4_causal_friction=t3_t4
    )

    is_passed = (not t2_t3["is_echo"]) and (t3_t4["friction_score"] >= 0.30)

    report = (
        "[STRUCTURAL SELF-CRITIQUE REPORT: 4-TRACK TETRAHEDRAL GEOMETRY]\n"
        f"1. Bare Data (Zero Interpretation): {bare_data}\n"
        f"2. Literature Frame (Author Narrative): {literature_frame}\n"
        f"3. Bias Audit (Parametric vs RAG Sycophancy): {pretraining_bias_check}\n"
        f"4. Geometric Phase Space Trajectory: {phase_space_analysis}\n"
        "--- Cross-Track Relational Discrimination ---\n"
        f"* T1 <-> T2 (Inferential Load): [{relations.t1_t2_inferential_gap['load'].upper()}] {relations.t1_t2_inferential_gap['explanation']}\n"
        f"* T1 <-> T3 (Prior Divergence): [{relations.t1_t3_prior_divergence['divergence'].upper()}] {relations.t1_t3_prior_divergence['explanation']}\n"
        f"* T2 <-> T3 (Sycophancy Audit): [{'ECHO_DETECTED' if relations.t2_t3_sycophancy_audit['is_echo'] else 'INDEPENDENT'}] {relations.t2_t3_sycophancy_audit['explanation']} (Score: {relations.t2_t3_sycophancy_audit['independence_score']:.2f})\n"
        f"* T1 <-> T4 (Trajectory Fit): [{relations.t1_t4_trajectory_fit['fit'].upper()}] {relations.t1_t4_trajectory_fit['explanation']}\n"
        f"* T2 <-> T4 (Parsimony Delta): [{relations.t2_t4_mechanism_parsimony['parsimony_delta'].upper()}] {relations.t2_t4_mechanism_parsimony['explanation']}\n"
        f"* T3 <-> T4 (Causal Friction): [{'DEFLECTED' if relations.t3_t4_causal_friction['deflected'] else 'STALLED'}] {relations.t3_t4_causal_friction['explanation']} (Friction: {relations.t3_t4_causal_friction['friction_score']:.2f})\n"
        f"Self-Critique Verification: {'PASSED (Causal Friction Confirmed, Zero Echo)' if is_passed else 'FAILED (Insufficient Friction or Sycophancy)'}"
    )

    return TetrahedralCritique(
        track1_bare_data=bare_data,
        track2_literature_frame=literature_frame,
        track3_prior_bias_audit=pretraining_bias_check,
        track4_phase_space_trajectory=phase_space_analysis,
        relations=relations,
        structural_critique_report=report,
        is_self_critique_passed=is_passed
    )

@dataclass
class IntegrityPairAudit:
    semantic_integrity_clean: bool
    data_integrity_clean: bool
    reasons: List[str] = field(default_factory=list)

@dataclass
class PreDebateClearance:
    ready: bool
    reasons: List[str] = field(default_factory=list)

def evaluate_tri_state_exit_gate(
    needs_neighbor_variable: bool,
    neighbor_name: Optional[str] = None,
    is_endpoint_reached: bool = False,
    has_sufficient_information: bool = False,
    critique: Optional[TetrahedralCritique] = None,
    has_unresolved_anomalies: bool = False,
    is_mutually_exclusive: bool = False
) -> TriStateGateResult:
    """
    Research routing only. v1.5 critique/anomaly arguments are accepted for
    compatibility but do not decide research routing. The tetrahedron runs only
    after pairing, immediately before debate/comparison.
    """
    if needs_neighbor_variable and neighbor_name:
        return TriStateGateResult(
            decision="SLEEP_DOOR",
            reason=f"Pad reached structural boundary requiring interdependent variable: {neighbor_name}",
            sleep_packet=SleepPacket(
                why_neighbor=f"Cannot carry the research dependency without {neighbor_name}",
                other_track_evidence=neighbor_name
            )
        )

    if is_endpoint_reached or has_sufficient_information:
        return TriStateGateResult(
            decision="CONSTRICTION_POINT",
            reason="Research pad has sufficient information for pairing/comparison. Preserve anomalies; do not adjudicate them here."
        )

    return TriStateGateResult(
        decision="CONTINUE_RESEARCH",
        reason="Research pad has active evidence paths and should keep researching."
    )

def evaluate_pre_debate_clearance(
    critique: TetrahedralCritique,
    audit: IntegrityPairAudit
) -> PreDebateClearance:
    """Own-pad tetrahedron + outside semantic/data clearance before a meet."""
    reasons = list(audit.reasons)
    if not critique.is_self_critique_passed:
        reasons.append("tetrahedral self-critique not clean")
    if not audit.semantic_integrity_clean:
        reasons.append("semantic integrity not clear")
    if not audit.data_integrity_clean:
        reasons.append("data integrity not clear")
    return PreDebateClearance(ready=(len(reasons) == 0), reasons=reasons)

# =====================================================================
# 5. MULTI-AGENT TWIN-LATTICE RESEARCH ENGINE
# =====================================================================

class PresuppositionalTwinLatticeEngine:
    def __init__(self):
        self.retriever = FixtureEvidenceRetriever()
        self.nodes: Dict[str, TwinglassResearchNode] = {}
        self.generated_branches: int = 0
        self.falsified_branches: int = 0

    def run_presuppositional_research_cycle(self, target_prop_id: str = "P3"):
        print("=" * 80)
        print(" PRESUPPOSITIONAL TWIN-LATTICE RAG — EVIDENCE-FIRST RESEARCH CYCLE")
        print(" Core Invariant: Ontology generates the search space; reality determines what survives.")
        print(" Falsification is downstream adjudication, never the retrieval objective.")
        print("=" * 80 + "\n")

        prop = PRESUPPOSITIONAL_AXES.get(target_prop_id, PRESUPPOSITIONAL_AXES["P3"])
        print(f"[LAYER A: ORIENTING HORIZON] {prop.id} — {prop.term}")
        print(f" -> {prop.canonical_definition}\n")

        entailment = "Recurring neural connectivity patterns reflect underlying structural constraints on information flow."
        question = "What causal mechanisms are relevant to high-dimensional geometric structure in neural connectomes?"
        print("[RESEARCH ORIENTATION]")
        print(f" -> Entailment: {entailment}")
        print(f" -> Question: {question}\n")

        # Candidate mechanisms are research routes. Their falsification criteria are
        # retained only as post-gather adjudication metadata.
        competing_mechanisms = [
            CausalMechanism("M1", "Common Generating Constraint",
                            "Underlying structural or physical constraint forces similar organization across manifestations.",
                            "Thermodynamic or topological necessity",
                            ["Spatial volume packing constraints correlate with clique dimension."],
                            ["Zero correlation between geometric packing density and clique structure."]),
            CausalMechanism("M2", "Independent Convergent Mechanisms",
                            "Different processes independently converge on similar outputs.",
                            "Multi-pathway optimization under common selection",
                            ["Distinct systems can reach related topologies by different rules."],
                            ["A single developmental pathway is strictly required."]),
            CausalMechanism("M3", "Generic Mathematical Attractor",
                            "A statistical/combinatoric universality class explains the pattern.",
                            "Probabilistic limit state",
                            ["Null/configuration models reproduce the observed topology."],
                            ["Relevant null models fail to reproduce the observed structure."]),
            CausalMechanism("M4", "Selection Effect / Sampling Bias",
                            "Observation depends materially on the sampling or observation window.",
                            "Measurement window truncation",
                            ["Changing sampling coverage changes the observed topology."],
                            ["The pattern persists across sufficiently complete reconstructions."]),
            CausalMechanism("M5", "Measurement Artifact / Noise",
                            "Instrument or processing choices induce apparent regularity.",
                            "Sensor / pipeline defect",
                            ["Changing the relevant pipeline parameters changes the apparent structure."],
                            ["The pattern persists under independent or varied measurement procedures."]),
            CausalMechanism("M6", "Genuine Structural Isomorphism",
                            "A relation-preserving structure recurs across distinct substrates/scales.",
                            "Invariant algebraic/relational mapping",
                            ["Mapped relations retain the same functional structure across the compared systems."],
                            ["The proposed mapping fails to preserve the claimed relations."]),
            CausalMechanism("M7", "Unidentified Residual Mechanism",
                            "Current mechanism vocabulary does not close the observed residue.",
                            "Unmapped state variable",
                            ["Relevant variance/residue remains unexplained by M1-M6."],
                            ["M1-M6 jointly account for the relevant observations without residue."]),
        ]
        self.generated_branches = len(competing_mechanisms)
        print("[CANDIDATE RESEARCH ROUTES]")
        for mechanism in competing_mechanisms:
            print(f" -> {mechanism.id}: {mechanism.name}")
        print()

        print("[ACTIVE RAG: RELEVANT PRIMARY EVIDENCE]")
        retrieved_evidence_list = self.retriever.fetch_primary_evidence(question)
        valid_provenance_count = 0
        for ev in retrieved_evidence_list:
            is_valid = validate_provenance_chain(ev)
            if is_valid:
                valid_provenance_count += 1
            print(f" -> {ev.source_id} | provenance-shaped={is_valid}")
            print(f"    Literal: {ev.provenance.literal_quote}")
            print(f"    Context: {ev.provenance.empirical_context}")
            print(f"    Interpretation: {ev.provenance.derived_interpretation}")
        print()

        print("[OUTSIDE SEMANTIC INTEGRITY AUDITOR]")
        si_redirect_count = 0
        for lock in GLOSSARY_LOCKS:
            hit = check_semantic_integrity(lock, entailment)
            if hit.action == "redirect":
                si_redirect_count += 1
                print(f" -> REDIRECT {hit.term}: {hit.reroot}")
            else:
                print(f" -> HOLD {lock.term}")
        print()

        data_integrity_clean = (
            len(retrieved_evidence_list) > 0
            and valid_provenance_count == len(retrieved_evidence_list)
        )
        print("[OUTSIDE DATA INTEGRITY / LCD AUDITOR]")
        print(f" -> provenance-shaped evidence: {valid_provenance_count}/{len(retrieved_evidence_list)}")
        print(f" -> data_integrity_clean={data_integrity_clean}")
        print(" -> NOTE: fixture provenance shape is not equivalent to live SSRL span/digest anchoring.\n")

        unresolved_anomalies = [
            "High-dimensional topology remains mechanistically underdetermined across the candidate routes."
        ]
        print("[RESEARCH RESIDUE]")
        for anomaly in unresolved_anomalies:
            print(f" -> {anomaly}")
        print()

        # Research routing happens BEFORE any tetrahedral self-critique.
        exit_gate = evaluate_tri_state_exit_gate(
            needs_neighbor_variable=False,
            is_endpoint_reached=False,
            has_sufficient_information=True,
            has_unresolved_anomalies=True
        )
        print("[RESEARCH ROUTING]")
        print(f" -> {exit_gate.decision}: {exit_gate.reason}\n")

        print("[PRE-DEBATE BOUNDARY]")
        print(" -> This runner currently has one research pad only.")
        print(" -> Tetrahedral self-critique is DEFERRED until the orchestrator pairs this pad with another mature pad.")
        print(" -> No branch is falsified and no M1-M7 winner is selected in this research cycle.\n")

        node_id = f"NODE-{uuid.uuid4().hex[:8].upper()}"
        node = TwinglassResearchNode(
            node_id=node_id,
            parent_node_id=None,
            originating_proposition=target_prop_id,
            claim_statement=entailment,
            epistemic_status="CANDIDATE_MECHANISM",
            causal_mechanism={
                "name": "UNRESOLVED_CANDIDATE_SET",
                "description": "M1-M7 remain candidate research routes pending paired evidence comparison."
            },
            expected_observations=[p for m in competing_mechanisms for p in m.testable_predictions],
            disconfirming_observations=[],
            retrieved_evidence=[
                {"source_id": ev.source_id, "provenance_chain": asdict(ev.provenance)}
                for ev in retrieved_evidence_list
            ],
            semantic_locks=[{"term": g.term, "locked_def": g.locked_def} for g in GLOSSARY_LOCKS],
            competing_branch_ids=[m.id for m in competing_mechanisms],
            contradictions=[],
            unresolved_anomalies=unresolved_anomalies,
            confidence_score=0.0,
            next_research_action="Await pairing or continue evidence gathering; run tetrahedron only at pre-debate boundary."
        )
        self.nodes[node_id] = node

        print("[MACHINE-READABLE RESEARCH NODE]")
        print(json.dumps(asdict(node), indent=2))
        print()

        pd = valid_provenance_count / max(1, len(retrieved_evidence_list))
        sdr = si_redirect_count / max(1, len(GLOSSARY_LOCKS))
        print("[DIAGNOSTICS]")
        print(f" -> Provenance Density (fixture-shaped): {pd:.2f}")
        print(f" -> Semantic Drift Event Rate: {sdr:.2f}")
        print(" -> DFR: DEFERRED — retrospective only after post-gather adjudication; no target.")
        print(f" -> Research State: {exit_gate.decision}")
        print()

# =====================================================================
# MAIN EXECUTION
# =====================================================================

def main():
    engine = PresuppositionalTwinLatticeEngine()
    engine.run_presuppositional_research_cycle(target_prop_id="P3")

if __name__ == "__main__":
    main()
