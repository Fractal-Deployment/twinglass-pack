let meta = #{
    name: "twinglass",
    description: "Canonical TwinGlass: spectral evidence-driven research, outside SI+data auditors, pre-debate tetrahedral self-critique, clean debate/synthesis.",
    when_to_use: "A research charge needs evidence-following orchestration without assigned thesis/antithesis.",
    phases: ["lock", "dispatch", "gather", "spawn-gate", "pair", "pre-debate-critique", "audit-clearance", "meet", "collapse", "rewrite"]
};

let telos = args.telos;
let charge = args.charge;
let start = args.start_mode;

fn walker_brief(track, pad_charge, vector, debts, persona) {
    `PERSONA: ${persona}
TELOS (does not move): ${telos}
PRIORS: Logic-Ration-Reason lock. Consume; do not rewrite the laws.
VECTOR MAP (born with): ${vector}
OPEN INTEGRITY DEBTS (gather, do not reset): ${debts}
TRACK: ${track}
CHARGE (isolated): ${pad_charge}
Follow real evidence. Do not read sibling pads. Do not hunt sessions.
Do not manufacture an antithesis or search merely to falsify another route.
If evidence reveals a distinct route, write divergenceEvidence + otherTrackEvidence + necessaryBecause and keep walking.`
}

phase("dispatch") {
    agent(walker_brief("charge", charge, args.vector, "none", "lattice-walker"), #{
        label: "walk charge",
        persona: "lattice-walker",
        capability_mode: "read-only",
        subagent_type: "explore"
    });
}

phase("spawn-gate") {
    // assertLegalSpawnNote: divergenceEvidence AND otherTrackEvidence + necessaryBecause.
    // Parent route need not be wrong. Assigned antithesis refuses.
    // Active sessions typical <=25, hard STOP 30. Engine SENS_CAP remains 10.
}

phase("gather") {
    // Outside Semantic Integrity + Data Integrity/LCD watch pads.
    // They flag holds/pair candidates; they do not steer conclusions.
}

phase("pair") {
    // Orchestrator pairs only when evidence makes the relation mature.
    // Outside SI + Data Integrity/LCD classify the relation as complementary,
    // incompatible, or not-yet-comparable.
}

phase("pre-debate-critique") {
    // Only on a genuine DEBATE path: each agent independently runs the
    // 3D tetrahedron on its own pad. Complementary synthesis skips this phase.
}

phase("audit-clearance") {
    // SI + Data Integrity clear every meet; after a debate-path tetrahedron,
    // they re-clear both cleaned packets.
}

phase("meet") {
    // SYNTHESIS if complementary. DEBATE only after both own-pad tetrahedra
    // and dual re-clearance when genuinely incompatible.
    // Falsification/replacement are downstream outcomes, never assigned research roles.
}

phase("collapse") {
    agent("Collapse writes one working prompt, not Ω. Telos held.", #{
        label: "collapse rewrite",
        persona: "rewriter"
    });
}
