# Game lifecycle (incubate / archive / sunset)

**Status:** living governance doc  
**Audience:** newGame proposers, maintainers, Shelf operators, season stewards, forkers, reviewers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **Archive is hygiene; deletion of history is not.** Fork-out is encouraged when custody fails.

Catalogs fill with zombies, shame piles, and silent deletions unless lifecycle is public. This document is the contract for **states from proposal through archive and sunset**, **incubation caps**, **who may archive**, and **how forks keep parent metadata**—without infinite incubating slots or erasing git history.

If a rule here conflicts with quiet unlisting as punishment, deleting repos to “clean the org,” or parking forever-incubating titles that block newcomers—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: lineage / Shelf in [lineage-and-shelf.md](./lineage-and-shelf.md); staggered seasons in [03b-unstable-to-stable.md](./03b-unstable-to-stable.md) and [OVERVIEW.md](../OVERVIEW.md); content policy for official incubation in [content-policy.md](./content-policy.md); succession when maintainers vanish in [09-dispute-capture.md](./09-dispute-capture.md); cold-start incubation load in [10-cold-start.md](./10-cold-start.md).

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **Infinite incubating slots** | Every idea holds a catalog seat forever | New titles cannot enter; Shelf noise |
| **Zombie actives** | No maintainers, no plays, targets still “open” | Players hit dead channels; harness waste |
| **Shame archives** | Archive used as public dunk, not hygiene | Contributors hide work; forks go hostile |
| **Silent deletion** | Repo or artifacts disappear without notice | Provenance break; anti-FOSS; distrust |
| **Forced unity** | Disagreement stays in parent until bitterness | Bad DESIGN compromises; capture ([09](./09-dispute-capture.md)) |

### Principles

1. **States are public and boring.**  
   Proposed → incubating → active → season-freeze → archived → (optional) forked-out. Badge them on Shelf / docs; no shadow “we still kind of ship it.”

2. **Incubation is scarce; graduation is evidence.**  
   Caps from the mass-adoption model; graduate on playable slice + harness conformance + content policy + licenses—not vibes.

3. **Archive keeps play where artifacts exist; sunset dims browse.**  
   Read-only can stay playable. Sunset removes default Shelf browse without deleting history.

4. **Never delete git history** for lifecycle politics.  
   Takedowns for illegal/malware follow [content-policy.md](./content-policy.md) / [06](./06-security-supply-chain.md)—not taste or embarrassment.

5. **Fork-out is success when custody fails.**  
   Disagreement and archive both welcome lawful forks with parent metadata ([lineage-and-shelf.md](./lineage-and-shelf.md), [09](./09-dispute-capture.md)).

---

## States

| State | Meaning | Targets / races | Shelf |
| --- | --- | --- | --- |
| **proposed** | newGame / RFC packet; not yet org-incubated | None (or discussion only) | Not listed as playable title |
| **incubating** | Org-hosted path toward official `games/<slug>/` | Limited bootstrap jobs only if policy allows | Optional “incubating” badge; not verified-stable |
| **active** | Graduated; seasons and races in normal dials | Open per season board | Normal listing; channels per [03](./03-player-ship-path.md) |
| **season-freeze** | In-season merge/promote freeze window | New feature races paused per season rules; hotfixes per policy | Tip may stay playable; changelog notes freeze |
| **archived** | No active custodianship expectation | **Targets closed**; no new races | Badge **archived**; read-only channels **stay playable if artifacts exist** |
| **forked-out** (optional marker) | Continuity moved to variant or external fork | Parent may be archived or slim; child carries lineage | Related-fork / parent metadata links encouraged |

Transitions are **public** (issue/PR / slow target). Skipping proposed→active without graduation evidence is out of process (Snake Seed exception is cold-start only—[10](./10-cold-start.md)).

---

## Incubation

### Caps

From the mass-adoption model: **max incubating games** is a published org dial (stage-sensitive—[10](./10-cold-start.md)). Seed may allow **0–1** beyond Snake; Village/Town raise carefully. Hitting the cap means **graduate, archive, fork-out, or wait**—not silent overflow.

### Graduation

Incubating → **active** when **all** hold:

| Gate | Intent |
| --- | --- |
| **Playable slice** | Evidence of play (not docs-only green)—channel artifact or equivalent |
| **Harness conformance** | `game.yaml` / DESIGN / targets shape accept harness gates for that engine ([engines.md](../engines.md)) |
| **Content policy** | Official-surface policy satisfied ([content-policy.md](./content-policy.md)) |
| **Licenses** | Inbound=outbound defaults / provenance ([07](./07-legal-ip.md)) |

Graduation is a **public checklist PR**, not a private blessing.

---

## Archive

| Rule | Intent |
| --- | --- |
| **When** | No maintainers (idle succession exhausted—[09](./09-dispute-capture.md)), sustained no plays / no seasons, or explicit maintainer+community choice; also policy-driven custody end without full sunset |
| **Targets** | **Closed** — no new races or promote jobs |
| **Play** | Read-only channels remain **installable/playable if artifacts and manifests still exist** |
| **Shelf** | Badge **`archived`**; still discoverable via archive/history views |
| **Tone** | Hygiene and honesty—not a shame wall. Recap may thank contributors ([08](./08-credit-economy.md)) |

Archive may follow a **notice period** (below) so fork-out can organize.

---

## Sunset

Stronger than archive:

| Rule | Intent |
| --- | --- |
| **Default Shelf browse** | Removed from default catalog browse / featured surfaces |
| **History kept** | Artifacts + manifests retained for history and sideload; **never delete git history** for sunset politics |
| **Badge / docs** | Mark **sunset** (or archived+sunset) with pointer to forks if any |
| **When** | Long archive with zero revive interest; org capacity; or steward decision after notice—still public |

Illegal/malware removals are **incident takedowns**, not sunset theater ([06](./06-security-supply-chain.md), [content-policy.md](./content-policy.md)).

---

## Fork-out

| Encouraged when | Norm |
| --- | --- |
| Design disagreement | `split-to-variant` or external fork ([lineage-and-shelf.md](./lineage-and-shelf.md)) |
| Archive / idle custody | Forkers keep parent metadata; Shelf may list related forks ([09](./09-dispute-capture.md)) |
| Sunset | Continuity lives in forks; parent remains historical |

Parent metadata (`parent`, variant pointers) stays honest. No harassment of forks.

---

## Staggered seasons

Lifecycle does not replace season calendars. **Season-freeze** and active peaking still stagger across the catalog so harness and org load stay sane—see [OVERVIEW.md](../OVERVIEW.md) (staggered per-game seasons) and promote capacity in [03b-unstable-to-stable.md](./03b-unstable-to-stable.md). Archive/sunset reduce load; they are not a substitute for stagger among actives.

---

## Who can archive (or sunset)

| Path | Requirements |
| --- | --- |
| **Slow public process** | `[meta]` or lifecycle target/PR: reason, state transition, notice period, fork pointers |
| **Maintainer + notice** | Game maintainers may propose archive/sunset with a **published notice period** (dial, e.g. 14–30 days) for objections and fork-out |
| **Org steward assist** | When maintainer pool is empty, steward opens the same public process—not a silent unlisting |
| **Not** | Private Discord decision; shame-driven surprise; delete-first |

Emergency removals of **content** (policy/malware) follow safety paths; the **game shell** may then archive/sunset with sunshine.

---

## Boot

| Dial | Boot (Snake era / Seed) |
| --- | --- |
| **Active** | **Only Foss Snake** expected active as pilot |
| **Incubation** | **Empty** (or cap 0) until Village / explicit second-title process ([10](./10-cold-start.md)) |
| **Archive/sunset machinery** | Document states now; first real archive may be manual checklist |
| **Shelf badges** | Implement as manifests allow; docs badge OK before UI |

Do not fill incubating slots “for show” during Seed.

---

## Boot vs scale dials

| Dial | Boot / Seed–Village | Scale / Town–City |
| --- | --- | --- |
| Max incubating | 0–1 (besides logged exceptions) | Published cap; queue when full |
| Graduation evidence | Human checklist + playable proof | Harness-assisted checklist |
| Notice period | Short but real | Documented minimum |
| Shelf archive/sunset UX | Docs + manual manifest flags | First-class badges + history browse |
| Revive from archive | Public PR + maintainer nomination ([09](./09-dispute-capture.md)) | Same + stage dials for load |

---

## What we deliberately avoid

- **Silent deletion** of repos/history to tidy optics.
- **Shame archives** — dunking contributors instead of stating custody facts.
- **Infinite zombie incubating slots** — caps without enforcement.
- **Forever-active with no maintainers** — close targets; archive or fork.
- **Sunset as secret ban** — browse dimming without public reason and retained artifacts.
- **Blocking lawful fork-out** at archive time.
- **Skipping graduation gates** for hype listing.

Forks may keep titles alive outside the org; official Shelf states follow this contract unless amended in public.

---

## Patching this doc

Lifecycle rules change what the catalog promises players and incubators. Edits are **slow lane**: PR, rationale, impact on incubating caps and open notice periods, merge. Quietly sunset-listing a rival mid-dispute is capture—treat it that way ([09](./09-dispute-capture.md)).

## Related

- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Official content policy](./content-policy.md)
- [Dispute, capture & succession](./09-dispute-capture.md)
- [Cold-start dials](./10-cold-start.md)
- [Unstable → stable promotion](./03b-unstable-to-stable.md)
- [Player & ship path](./03-player-ship-path.md)
- [Credit economy](./08-credit-economy.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
