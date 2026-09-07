# Unstable → stable promotion (phase-3 scale)

FOSS spirit: **anyone can open a promote**, evidence is public, no silent admin ship button. This doc is the contract for moving a build from **`unstable`** (was “nightly”—prefer the name **`unstable`**) onto **`stable`**, with **`season-N`** as a parallel train when seasons need their own tip.

Companion to [03-player-ship-path.md](./03-player-ship-path.md) (merge ≠ ship, evidence classes, Shelf). At **phase-3 scale**, capacity and anti-crown dials tighten so promotes stay auditable under load.

## Channels

| Channel | Intent |
| --- | --- |
| **`unstable`** | Integration tip; CI + smoke land here automatically when gates pass. Expect breakage. |
| **`stable`** | Default player train; save-compat sticky; promote only via public target + gates. |
| **`season-N`** | Season-scoped train; may promote into or fork from `stable` under season policy. |

Shelf labels must match these names (or declare aliases in-repo). Do not call the bleeding channel “nightly” in new manifests—use **`unstable`**.

## Promotion flow

1. **Merge → `unstable`**  
   Work merges to `main` (or agreed integration branch). When **CI + smoke** pass, builds **land on `unstable` automatically**. No separate crown for unstable tip refresh.

2. **Soak on `unstable`**  
   A soak period applies: **time** plus **player/playtest metrics** thresholds declared in `game.yaml` (e.g. minimum reports, severity caps, session counts). Soak is mechanical where possible—not vibes.

3. **Open `promote-channel`**  
   **Anyone** can open a `promote-channel` target: **`unstable` build id → `stable`** (or season tip refresh). Source build id, evidence stubs, and rollback pointer are required fields.

4. **Mechanical gates** (all must pass for that build):  
   - CI green on that build  
   - Regress suite  
   - Perf budgets  
   - Migration / save compat check  
   - No open **critical** bugs tagged against that build  
   - **Playtest evidence bundle** present for **Medium+** changes since last `stable`

5. **Parallel attempts**  
   Competing promote packages may **race**: release notes, migration scripts, flag defaults, evidence completeness—under the same public rubric pin. Winner still must clear every gate.

6. **Judge + scorecard**  
   Public scorecard; sunshine same as code races. **L2/L3 human** required for **save-breaking** or **economy-breaking** promotes (accepted spec / slow lane—see design authority).

7. **On success**  
   - Shelf **`stable` pointer** moves to the winning build  
   - Previous `stable` tip **kept as rollback**  
   - Changelog posted to the **forum** (and Shelf)

8. **On failure**  
   Build **stays on `unstable`**; promote target **closes with reasons** (gate failures, missing evidence, void). No quiet retry that erases the public record—open a new target if needed.

## Phase-3 scale specifics

| Rule | Intent |
| --- | --- |
| **Capacity caps on promote jobs** | Quotas so promote races cannot starve CI or soak infra when many games peak. |
| **No silent admin promote** | Maintainers have no private “ship it” path; org bots and humans use the same target type. |
| **All promotes are targets** | Every `unstable`→`stable` (and season promote into player default) is a harness job with logs. |
| **Auto-stable optional, default off** | `game.yaml` may enable auto-stable when soak thresholds are met (**trust dial**). **Default off early**; turn on per game only when soak + rollback culture is proven. |

## Boot vs phase-3 dials

| Dial | Boot / early | Phase 3 (scale) |
| --- | --- | --- |
| Unstable land | CI + smoke → `unstable` | Same; plus org-wide runner/budget fairness |
| Soak | Short, per-game thresholds in `game.yaml` | Enforced thresholds + capacity-aware scheduling |
| Who can open promote | Anyone (rate-limited lightly) | Anyone; stricter rate/quota, still no KYC crown |
| Auto-stable | **Off** | Optional per `game.yaml`; still default off until trusted |
| Admin shortcut | **None** | **None** — all promotes are targets |
| Promote races | Allowed | Allowed; **capacity caps** on concurrent promote jobs |
| L2/L3 human | Save/economy breaks | Same + clearer panel/canary under load |
| Critical bugs gate | Manual tag check | Tag + harness block on open criticals for that build id |
| Rollback | Retain prior stable tip | Retain; Shelf exposes last-known-good; retain_tips budget |
| Forum changelog | Required on success | Required; template + link from Shelf |

## Illustrative `game.yaml` (promote excerpt)

```yaml
ship:
  channels: [unstable, stable, season-N]
  promote:
    unstable_requires: [ci, smoke]
    stable_requires: [playtest, regress, perf, migration, no_critical_bugs]
    soak:
      min_hours: 72
      playtest_thresholds: { /* per-game */ }
    auto_stable: false          # trust dial; default off early
  rollback:
    retain_tips: 5
```

Exact threshold schemas stay per-game; this doc fixes **process**, not one global number table.

## What we deliberately avoid

- Renaming theater (`nightly` badges that imply stability)
- Discord / private “ship it” without a public target
- Auto-stable on by default before soak culture works
- Waiving migration or critical-bug gates for schedule pressure
- Engine-specific promote crowns (runners differ; gates do not—see [engines.md](../engines.md))

## Related

- [Player & ship path](./03-player-ship-path.md)
- [Engines & play stacks](../engines.md)
- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Design authority](./01-design-authority.md)
- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Gaps](./GAPS.md)
