# CI fix loop

```bash
scripts/ci_poll.sh --pr N                 # 0 green · 2 fail · 3 pending · 4 auth/infra
scripts/ci_poll.sh --fixture FILE
scripts/ci_fix_once.sh --pr N             # CLASS=… + reproduce cmd; does not edit code
```

Backoff 30s/60s/120s. Timeout 30 min. Max 5 product-fix cycles. Then HOLD. **Do not merge**, red or green.

| CLASS | Job names (this pack) | Action |
|-------|----------------------|--------|
| TEST_FAIL | engine tests, CLI spawn-lock, telos-hold, diamond, async, S-align | reproduce locally → minimal patch |
| SEAL_FAIL | no deleted live seals, occupant bleed | fix docs/strings; seals stay open |
| INFRA_FAIL | runner/network | backoff; no product change |
| FLAKE | non-deterministic | rerun-failed ≤2 then harden |
| PERMISSION | 403 | HOLD PERMISSION |

No invent-green. No deleting checks. No force-push main.
