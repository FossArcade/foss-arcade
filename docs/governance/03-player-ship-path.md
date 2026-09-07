# Player & ship path

Foss Arcade exists so **players get playable games**, not only so contributors get merge green checks. A merged PR that never reaches a Shelf channel is unfinished work. This doc defines the **ship train**: how builds become public releases players can trust, audit, and roll back—without DRM, account walls, or a private release crown.

## Problem: contributor factory vs players

Open forges drift toward a **contributor factory**: races, scorecards, CI, ADRs—all healthy—while the thing a stranger can *play* lags weeks behind `main`. Symptoms:

- Merge is celebrated as “shipped.”
- Stable channels stale while `unstable` is a junk drawer.
- Players cannot see lineage, changelogs, or open races without spelunking git.
- “Online required” creeps in for single-player.
- Promotion is tribal (“ask in Discord”) instead of auditable gates.

**Merge ≠ ship.** Merge lands code on a branch. **Ship** promotes a build onto a **player channel** with evidence, rollback pointers, and Shelf visibility. Both trains matter; only one faces the public by default.

## Principle

| Pillar | Meaning |
| --- | --- |
| **Players first-class public** | Channel tips, changelogs, playtest reports, and promote decisions are public artifacts—same sunshine as races. |
| **Open auditable ship pipeline** | Promote steps are in-repo targets with logged evidence; no secret sauce release button. |
| **No DRM** | Shelf and games never gate play behind proprietary locks. Sideload and fork installs stay first-class. |

If a release rule cannot be audited from the repo + public harness logs, it does not belong here.

---

## Two trains

| | **Merge train** | **Ship train** |
| --- | --- | --- |
| **Question** | Is this change acceptable into the design spine? | Is this build acceptable for players on a named channel? |
| **Primary gates** | CI, AC, DESIGN-fit, race/scorecard (see [02-judge-anti-gaming.md](./02-judge-anti-gaming.md)) | Playtest / regress / perf / migration evidence + channel policy |
| **Output** | Commit on `main` (or agreed integration branch) | Channel tip + Shelf manifest + changelog entry |
| **Audience** | Contributors, judges, active pool | Players, Shelf, sideloaders |
| **Failure mode** | Bad merge, revert, ADR | Bad promote: rollback pointer, Shelf banner, slow-lane hold |
| **Speed** | Fast lane for L0–L1; slow for L2–L3 / law | Often slower than merge; stable is deliberately sticky |

Races and merges may run hot while ship stays cool. That is healthy. Shipping every merge to `stable` is a footgun—treat it as L2/L3 process when it would break saves or player trust.

---

## Channels as releases

Channels are **named player release streams**, not vibes. Typical set (per game; names in manifests):

| Channel | Intent | Who should use it |
| --- | --- | --- |
| **unstable** | Tip of integration (was “nightly”); expect breakage | Contributors, brave playtesters |
| **stable** | Default player train; save-compat sticky | Most players |
| **season-N** | Season-scoped train (content/balance window) | Season participants; may promote into or fork from stable |

Prefer the name **`unstable`** over “nightly” in manifests and Shelf. Other names (`beta`, `experimental`) are fine if declared in-repo and labeled honestly on Shelf.

Phase-3 promote flow (soak, gates, races, dials) is detailed in [03b-unstable-to-stable.md](./03b-unstable-to-stable.md).

### `promote-channel` target type

Promotion is a **harness target**, not a private maintainer whisper. A `promote-channel` job declares:

- **Source** — git sha / build id / artifact set
- **Destination channel** — e.g. `unstable` → `stable`, or `season-3` tip refresh
- **Evidence bundle** — required artifacts for that destination (below)
- **Rollback pointer** — previous channel tip (or explicit “first ship”)
- **Migration notes** — save / schema / mod compatibility

| Evidence class | Role |
| --- | --- |
| **playtest** | Structured player/agent reports against the candidate build |
| **regress** | Automated regression suite (smoke + known bug corpus) |
| **perf** | Budget checks (frame time, load, size)—fail closed when budgets exist |
| **migration** | Save/compat checks per `game.yaml` policies |

**Races allowed:** competing promote candidates (or competing “is this tip ready?” attempts) may race under the same public rubric pin. Winner does not waive evidence—it still must attach a complete bundle.

**L2 / L3 on footguns:** promoting to `stable` when saves break, pillars shift without ADR, or Shelf would show a silent downgrade is **L2+** (often L3): accepted spec / slow lane, not a drive-by button. See [01-design-authority.md](./01-design-authority.md).

---

## Playable v1

v1 ships **playable** before it ships **online-social**. **Playable stacks at v1 are web and Godot** (both first-class FOSS)—not web-only. See [engines.md](../engines.md).

| Requirement | v1 rule |
| --- | --- |
| **Offline-first (web or Godot)** | Single-player (and local multi where designed) works without a Foss Arcade account or always-on server—browser title or Godot export alike. |
| **No account wall for single-player** | Optional identity for Shelf sync, funding, or online modes—never required to start a FOSS title’s core loop. |
| **Online as opt-in** | Multiplayer, leaderboards, cloud saves, etc. are **opt-in services**, preferably **forkable** (open protocol / self-host notes). Core game must not soft-lock if the service is down. |

Playable means a stranger can install from Shelf (or sideload) and finish a meaningful session offline. Anything less is a preview label, not `stable`.

---

## Arcade Shelf as player front door

[Arcade Shelf](./lineage-and-shelf.md) is the default **player** surface—not a closed store.

Players should be able to, from Shelf:

1. **Play** — install/update from open channel manifests.
2. **See lineage** — parent, variants, channel tips, design pins.
3. **Read changelog** — human-facing notes tied to promote events (not only git log).
4. **Browse open races** — optional but first-class: what is being competed on this title right now.
5. **Sideload manifests** — local path / URL install with clear trust warnings, **no DRM**.

If Shelf hides ship state that only contributors can see in CI, the ship train has failed sunshine.

---

## Playtest lane

Playtest is a **structured lane**, not emoji reactions.

- Reports use a **schema** (build id, channel candidate, scenario, result, repro steps, optional clips/logs).
- **`stable` promote** requires a minimum evidence set defined per game (count/severity thresholds in-repo)—not “feels fine.”
- Automated **regress / perf / migration** do not replace playtest where human feel matters; they gate the floor.
- **AI may summarize** playtest corpora for Shelf and promote reviews; summaries **must not invent** findings. Every claim cites report ids / artifact paths. Hallucinated bugs or greenwashed “all clear” are process defects.

Playtest evidence is public by default (redact only true secrets / abuse material via documented process).

---

## Save / compat / rollback

Policies live in **`game.yaml`** (or equivalent in-repo ship config) so harness and Shelf share one source of truth. Illustrative fields:

```yaml
# games/<slug>/game.yaml  (ship-relevant excerpt)
ship:
  channels: [unstable, stable, season-N]
  saves:
    compat_policy: "stable-sticky"   # or documented alternative
    format_version: 3
  rollback:
    retain_tips: 5                   # prior channel tips keep installable
  promote:
    stable_requires: [playtest, regress, migration]
```

| Rule | Intent |
| --- | --- |
| **Rollback pointers** | Every promote records previous tip; Shelf can reinstall last-known-good. |
| **Breaking stable saves** | Requires **slow-lane** ADR/spec + **Shelf warning** (banner + changelog severity). Prefer migrate-forward tools; never silent wipe on `stable`. |
| **unstable** | May break saves more freely if labeled; still log format bumps. |

Compat lies are worse than delayed ships. If migration is incomplete, do not promote to `stable`.

---

## Feature flags

- Flags live **in-repo** (config + code), reviewable like any other change.
- Prefer **dark merge**: land code behind a flag on the merge train, then **channel flip** (or flag default flip) on the ship train when evidence is ready.
- Flag flips that change player-visible behavior on `stable` follow promote/evidence norms—not silent mid-season switches without changelog.
- Dead flags get removed; flag soup is not a substitute for variants (see lineage doc).

---

## Player moderation (v1)

v1 keeps the **player social surface small** so moderation stays light and FOSS-compatible:

- Less chat / UGC blast radius at ship time; prefer async reports and forum/issue links.
- Abuse response for ship artifacts (malware in sideload, doxxing in playtest) follows public runbooks when they exist ([GAPS.md](./GAPS.md) still tracks broader CoC / abuse gaps).
- Do not invent a private trust-and-safety crown to unblock `stable`; shrink surface until process exists.

---

## v1 boot dials

Bootstrap tight; widen when playtest culture and rollback actually work.

| Dial | v1 setting |
| --- | --- |
| Default player channel | **`stable`** (or “preview” label until first stable promote) |
| Account for single-player | **Off / unused** |
| Online services | **Opt-in**, documented, forkable where possible |
| `stable` promote | **Evidence-required** (`playtest` + `regress` + `migration` minimum when saves exist) |
| `unstable` land | CI + smoke auto-land; playtest welcome but not theater |
| Rollback | **Pointers retained**; Shelf exposes last-known-good |
| Feature flags | **In-repo**; dark merge → channel/flag flip |
| AI on playtest | **Summarize only with citations**; no invented verdicts |
| Races on promote | **Allowed**; same sunshine as code races |
| DRM / account wall | **Never** for core FOSS play |

**Order of operations:** playable offline build (web or Godot) → Shelf manifest → `unstable` → evidence → `stable`. Do not invert for launch hype.

---

## What we deliberately avoid

- **Merge theater as release** — green `main` is not a player promise.
- **DRM / anti-sideload** — closed store gates are out of scope for Shelf.
- **Account walls on single-player** — identity is optional frosting, not the cake.
- **Private promote crowns** — Discord (or equivalent) “ship it” without public evidence is invalid process.
- **Silent stable save breaks** — no wipe-without-warning; slow-lane + Shelf banner required.
- **AI-invented playtest** — summaries cite or they do not ship.
- **Always-online core loops** at v1 — online is opt-in forkable service territory.
- **Chat-first launch** — do not grow moderation surface before ship pipeline maturity.

Forks may ship differently; the fossarcade org harness and Shelf contract stay on this path unless this doc is amended in public.

---

## Patching this doc

Ship-path rules affect player trust. Edits are **slow lane**: PR, rationale, note impact on open channels and in-flight promotes. Changing promote evidence mid-promote without void/restart is itself a footgun—treat it that way.

## Related

- [Unstable → stable promotion](./03b-unstable-to-stable.md)
- [Engines & play stacks](../engines.md)
- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Design authority](./01-design-authority.md)
- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
