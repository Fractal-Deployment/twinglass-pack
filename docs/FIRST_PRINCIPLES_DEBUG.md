# First-principles debug

From the beginning of the system under test. No mid-stack guess.

D0 clean tree + SHA · D1 restate invariant (marker / test) · D2 cold reproduce from repo root · D3 first failing layer (install → unit → CI-only) · D4 bisect after D2–D3 · D5 minimal restore · D6 full `local_gates.sh` · D7 push PR (do not merge).

Forbidden: shotgun edits; deleting tests to green; invent-green.
