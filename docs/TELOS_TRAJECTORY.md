# Telos trajectory

**Telos** = ending in `queue/telos.json`. **Markers** = ordered waypoints, each with `acceptance` + `prove`. A fail is off-trajectory, not a new telos.

```bash
scripts/telos_next.sh    # first unmet marker (exit 0) or TELOS_MET (exit 1)
```

Regain: first-principles D0–D7 on the failing prove → local gates → push PR (no merge) → `telos_next` again.

`measured_omega=false`. Markers do not close Ω.
