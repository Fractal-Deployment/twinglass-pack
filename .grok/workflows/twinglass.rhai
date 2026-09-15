let meta = #{
    name: "twinglass",
    description: "Lattice apparatus: isolated walkers, diamond as a phase, gated spawn as CLI agent() dispatch, SI gather instead of reset, staggered meet, collapse to a prompt.",
    when_to_use: "A research charge needs LRR-locked walking with optional spawn, not a fight.",
    phases: ["lock", "dispatch", "diamond", "spawn-gate", "gather", "meet", "collapse", "rewrite"]
};

let telos = args.telos;
let charge = args.charge;
let start = args.start_mode;

fn walker_brief(track, pad_charge, vector, debts, persona) {
    `PERSONA: ${persona}
TELOS (does not move): ${telos}
PRIORS: Logic-Ration-Reason lock. Consume; do not rewrite the laws.
VECTOR MAP (born with): ${vector}
OPEN SI DEBTS (gather, do not reset): ${debts}
TRACK: ${track}
CHARGE (isolated): ${pad_charge}
Do not read sibling pads. Do not hunt sessions. Diamond is a phase on this pad.
If debts are open, fill them. Keep locks. Do not wipe the pad.`
}

phase("dispatch") {
    if start == "PAIR" {
        parallel([
            agent(walker_brief("priors-as-claimed", args.left_charge, args.left_vector, "none", "lattice-walker"), #{
                label: "walk priors",
                persona: "lattice-walker",
                capability_mode: "read-only",
                subagent_type: "explore"
            }),
            agent(walker_brief("reality-event-plane", args.right_charge, args.right_vector, "none", "lattice-walker"), #{
                label: "walk outcomes",
                persona: "lattice-walker",
                capability_mode: "read-only",
                subagent_type: "explore"
            })
        ]);
    } else {
        agent(walker_brief("charge", charge, args.vector, "none", "lattice-walker"), #{
            label: "walk charge",
            persona: "lattice-walker",
            capability_mode: "read-only",
            subagent_type: "explore"
        });
    }
}

phase("spawn-gate") {
    // Hard note → notification. Not a local clone of the parent transcript.
    // assertLegalSpawnNote: improperEvidence AND otherTrackEvidence.
    // Width cap 10. Parent keeps walking.
}

phase("gather") {
    // SI debts are open items. The walker continues. The pad is not wiped.
}

phase("meet") {
    // Combine only when coordinate maps are named.
    // Complementary PAIR tracks may sit on different planes — protocol synthesis.
}

phase("collapse") {
    agent("Collapse writes one working prompt, not Ω. Telos held.", #{
        label: "collapse rewrite",
        persona: "rewriter"
    });
}
