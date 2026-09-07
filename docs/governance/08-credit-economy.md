# Credit economy (contribution, not crowns)

**Status:** living governance doc  
**Audience:** race participants, designers, playtesters, infra donors, harness authors, reviewers, Hall / CREDITS maintainers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **Credit for useful work, not victory alone.** Exportable ledgers beat platform lock-in. Spend never buys rank.

Races produce **one merge winner** and many serious attempts. If only the winner is famous, participation dies. If spend or escrow buys prestige, crowns return. This document is the contract for **how credit is earned, split across ledgers, kept for losers with dignity, defended against gaming, and exported**—without burn-to-rank, private scoreboards, or infra-rep as governance.

If a rule here conflicts with a private “VIP list,” unpublished trust score, or spend-for-badge perk—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: race scorecards and blindness in [02-judge-anti-gaming.md](./02-judge-anti-gaming.md); earned reputation / export stubs in [04-sybil-grief.md](./04-sybil-grief.md); donated compute **infra-rep** (not governance) in [05-infra-cost.md](./05-infra-cost.md); DCO / inbound=outbound for salvage in [07-legal-ip.md](./07-legal-ip.md); DESIGNERS path in [01-design-authority.md](./01-design-authority.md); dispute / capture in [09-dispute-capture.md](./09-dispute-capture.md).

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **Winner-only fame** | CREDITS / Hall / forum shout-outs name the merge tip only | Most racers learn “place = erase”; next season empties |
| **Races → most lose** | Parallel attempts are the point; by design **N−1** do not merge | Without credit for useful work, rational agents stop attempting |
| **Spend-to-rank poison** | Escrow size, sponsor tiers, or token burn treated as merit | Pay-to-win reputation ([04](./04-sybil-grief.md)); DESIGN-fit and merges lose weight |
| **Burned losers** | Superseded diffs deleted from narrative; salvage stolen without dual credit | Fork hostility; license/provenance fights; culture of concealment |
| **Single opaque score** | One private “trust” number mixes merge merit, infra hygiene, and vibes | Cannot audit; cannot export; easy to capture |

Without a FOSS-shaped credit economy, the forge either (a) becomes a spectator sport around one winner, (b) recreates crowns via spend/infra, or (c) drives serious attempters to silent forks.

### Principles

1. **Credit for useful work—not victory alone, not burn.**  
   Merges, accepted specs, serious attempts, playtests, accurate flags, and design ADRs earn. Token spend, escrow size, and grief-bond theater do **not**.

2. **Public and exportable.**  
   Ledgers are sunshine (CSV/JSONL or dashboard + raw export). Contributors carry attestations to forks. Lock-in is anti-FOSS ([04](./04-sybil-grief.md)).

3. **Split ledgers, split meanings.**  
   Contribution credit (two scopes: **general** + **per-game**) ≠ infra-rep ≠ human CREDITS / Hall narrative. Mixing them recreates a single crown score.

4. **Loser dignity.**  
   Fair loss is not grief. Superseded work keeps credit; scorecards stay public; salvage dual-credits; seasons recap non-winners who shipped useful evidence.

5. **Credit ≠ merge, ≠ DESIGN seat, ≠ judge weight.**  
   Soft boosts (vote ramp, concurrency, design-path hints within caps) may use contribution credit—**general** for org-wide soft powers, **game trust** for that title’s soft powers—same firewall as reputation in [04](./04-sybil-grief.md). Never waive AC, DESIGN-fit, or gates ([02](./02-judge-anti-gaming.md)). Local knowledge earns more say on a game; hard caps stop specialist capture ([dual trust](#dual-trust-game-based-vs-general)).

6. **Infra-rep is hygiene only.**  
   Donated compute earns thanks + infra-rep, never governance ([05](./05-infra-cost.md)).

---

## Earning table

What earns **contribution credit** (and related human recognition). Exact point weights live in-repo ledger schema and move only via slow lane; this table is the **contract for which events count**.

| Event | Earns | Notes |
| --- | --- | --- |
| **Serious attempt** | Yes — contribution credit | Meets the [serious-attempt bar](#anti-gaming); green enough to score or clearly documented gate fail with honest evidence bundle. Place (1st…Nth) may tier amounts; **loss still credits**. |
| **Merge** (race winner or L0–L1 land that sticks) | Yes — contribution credit + CREDITS / Hall eligibility | Sticky merge > tip that reverts under public rollback. Reverts may annotate credit (not silent erase). |
| **Accepted spec** (issue + ADR or equivalent before Medium+) | Yes — contribution credit | Spec authors earn even if they never race the code. |
| **Playtest / evidence bundle** | Yes — contribution credit | Useful playtest reports, regress/perf packs, soak evidence tied to ship/promote jobs ([03](./03-player-ship-path.md), [03b](./03b-unstable-to-stable.md)). Noise or empty “LGTM” does not. |
| **Accurate flags** | Yes — contribution credit | Accurate safety / grief / sock / supply-chain flags that hold under challenge ([04](./04-sybil-grief.md), [06](./06-security-supply-chain.md)). False/spam flags may reverse. |
| **Infra-rep** (donated compute, mirrors, attestation hygiene) | **Separate ledger** — infra-rep only | Capacity offered, hash agreement, mirror uptime ([05](./05-infra-cost.md)). **Not** contribution credit; **not** vote/judge weight. |
| **Design ADR** (merged) | Yes — contribution credit + path toward **DESIGNERS** / block rights | Merged ADRs earn stewardship rights per [01-design-authority.md](./01-design-authority.md)—credit and CODEOWNERS/DESIGNERS are related but not the same dial. |

### What does **not** earn credit

| Does not earn | Why |
| --- | --- |
| Token spend / escrow size / “I funded the race” | Funding opens compute; it is score-blind and credit-blind ([02](./02-judge-anti-gaming.md), [04](./04-sybil-grief.md)) |
| Grief-bond theater / getting slashed “for the pot” | Slash is commons hygiene, not a donation badge that buys rank |
| Merely opening many races or vote-spamming | Volume without useful work is noise |
| Loud forum vibes / untemplated cheerleading | Discussion ≠ credit event |
| Infra-rep alone | Wrong ledger; hygiene ≠ contribution merit |
| Winning by unpublished score or Discord override | Invalid process—no credit for illegitimate wins |
| Copy-paste “attempts” under the serious bar | Anti-gaming ([below](#anti-gaming)) |
| Buying stickers, sponsor tiers, or ads placement | Perks ≠ merit ([05](./05-infra-cost.md)) |

---

## Split ledgers

Keep the books separate. Do not collapse them into one “power score.”

Contribution credit itself has **two scopes**—**general** (arcade-wide) and **per-game** (`games/<slug>`)—plus the separate **infra-rep** and **Hall / CREDITS** ledgers. Four surfaces, not one crown.

### 1. Contribution credit (general + per-game)

Machine-readable ledger of **useful work** events: serious attempts, merges, specs, playtests, accurate flags, design ADRs.

- Events are attributed to **general trust** and, when scoped to a title, also to that game’s **game trust** ([dual trust](#dual-trust-game-based-vs-general)).
- Soft-boosts vote ramp / attempt concurrency / design-path hints within caps only ([04](./04-sybil-grief.md)).
- Exportable JSON/JSONL attestations (event id, race/target sha, rubric pin, actor pseudonym, timestamp, reason codes, optional `game` slug).
- Never appears as a positive feature inside the judge score model ([02](./02-judge-anti-gaming.md)).

### 2. Infra-rep

Hygiene signal for **donated compute and mirrors**: uptime, attestation agreement rate, incident notes, quarantine history ([05](./05-infra-cost.md)).

- Thanks + badges OK.
- **Never** vote weight, fund weight, judge score, DESIGN seat, or Shelf featuring as perk.

### 3. Human CREDITS / Hall of fame

Narrative, human-facing recognition: `CREDITS`, season Hall posts, Shelf “made with” notes where appropriate.

**Must include non-winning serious attempters**—not only merge winners. Typical Hall lanes:

| Lane | Who |
| --- | --- |
| **Merged** | Race winners / sticky lands for the season |
| **Serious attempts** | Non-winners who cleared the serious-attempt bar (list or link to scorecards) |
| **Specs & ADRs** | Accepted design / architecture authors |
| **Playtest & evidence** | Named evidence bundles that unblocked ship/promote |
| **Flags & stewardship** | Accurate flags; active-pool stewardship notes (public) |
| **Infra donors** | Optional thanks list—clearly labeled **infra**, not contribution rank |

Hall copy that names only winners is **out of process** for season recaps once this doc is in force.

---

## Dual trust: game-based vs general

Two contribution-trust scores (still separate from infra-rep):

1. **General trust** — useful work across the arcade (any game, harness, specs, playtests, accurate flags). Used for org-wide soft powers: vouch weight ramp, newcomer concurrency, meta/slow-lane voice within caps.

2. **Game trust** (per `games/<slug>`) — useful work on that game only (attempts, merges, specs, playtests, ADRs scoped to that title). Used for that game’s soft powers: design-block eligibility path, review weight hints, claim/attempt priority within that game’s pool — **NEVER** judge scorecards, **NEVER** waive AC.

### Principles

- Frequent contributors to a game earn **more say on that game** than a generally trusted stranger — local knowledge matters.
- They **cannot get overwhelming say**: hard caps / diminishing returns / quorum rules so one specialist (or clique) cannot unilaterally crown targets, block all design forever, or outvote the rest into capture.
- Suggested shape (illustrative numbers dialable in Seed→City):
  - Soft weight from game trust is capped (e.g. max ~2–3× a baseline contributor, or max X% of any single decision’s weight pool)
  - Important actions still need multi-person / public process ([09-dispute-capture.md](./09-dispute-capture.md))
  - General trust does not fully substitute for game trust on that title’s design seats — and game trust does not grant org-wide kingship
- Cross-links: sybil / soft boosts ([04-sybil-grief.md](./04-sybil-grief.md)); design authority ([01-design-authority.md](./01-design-authority.md)); dispute / capture ([09-dispute-capture.md](./09-dispute-capture.md)).

Exact weight tables, cap percentages, and quorum N live in harness schema and move only via slow lane—this section is the **contract for two scopes and capture-resistant caps**, not the dial numbers.

---

## Loser dignity

Fair races create losers by design. Dignity is process, not pity.

| Practice | Rule |
| --- | --- |
| **Superseded keeps credit** | When a later merge supersedes an attempt, prior serious-attempt / salvage credit **remains** on the ledger. Supersession annotates; it does not erase. |
| **Public scorecards** | Every scored attempt keeps a public scorecard ([02](./02-judge-anti-gaming.md)). Unpublished “you lost, trust us” is invalid. |
| **Salvage dual credit** | If winner (or later PR) lifts ideas/code from a losing attempt under outbound license + DCO honesty ([07](./07-legal-ip.md)), **both** salvage source and merger earn credit events (salvage cite required in PR/scorecard notes). Silent lift without cite is process failure. |
| **Season recaps** | End-of-season forum/Shelf notes highlight non-winning serious attempters alongside winners—same Hall lanes as above. |

Losing a fair race **does not tank** contribution credit or reputation ([04](./04-sybil-grief.md)). Grief slash, sustained false flags, or malware-tied work **can** dent—publicly, with reasons.

---

## Anti-gaming

| Defense | Intent |
| --- | --- |
| **Serious-attempt bar** | Credit requires a complete attempt bundle (manifest, diff, gate/AC outputs or honest fail log, rubric-addressable artifacts)—not a empty branch or title-only PR. Exact checklist lives in harness; bar is public and slow-lane. |
| **Diminishing returns** | Repeat near-duplicate attempts, spam flags, or copy-paste playtests earn **less** per event (and may hit duplicate throttle ([04](./04-sybil-grief.md))). First useful work pays; farming does not. |
| **No skip gates** | Credit never unlocks skip of CI, AC, DESIGN-fit, allowlists, or promote evidence. Soft concurrency/vote ramp only—within caps. |
| **Exportable JSON** | Attestations and ledgers export in boring machine-readable form. Opaque dashboards without raw export are insufficient; forks must be able to import or ignore. |

Sock fleets farming credit are treated as sock attempts / cluster flags under [04](./04-sybil-grief.md)—challengeable, sunshine, not private bans.

---

## Boot dials vs later automation

Bootstrap with **honest human ledgers**; automate when schemas and culture hold. Never automate spend-to-rank.

| Dial | Boot / early (phases 0–1) | Later automation (phases 2–4) |
| --- | --- | --- |
| Contribution events | Manual or semi-manual log (issue/PR labels + season CSV) | Harness emits credit events from race complete / merge / ADR merge / flag resolve |
| Serious-attempt bar | Written checklist; maintainer confirm on pilot | Machine checklist in harness; appeal for false negatives |
| Hall / CREDITS | Season forum post + in-repo `CREDITS` stub including non-winners | Generated Hall draft from ledger + human edit window |
| Salvage dual credit | PR template cite + reviewer check | Optional diff-similarity hints; **human confirm** still required for credit event |
| Diminishing returns | Soft social norm + duplicate throttle | In-repo curve / caps per actor per target |
| Infra-rep | Thanks list only | Badges from attestation/mirror metrics ([05](./05-infra-cost.md))—still non-governance |
| Export | JSONL schema stub + sample | Stable schema semver + fork import notes |
| Soft boosts from credit | Off or tiny | Optional ramp within [04](./04-sybil-grief.md) caps; never gate skip |

**Order of operations:** public scorecards + loser-inclusive CREDITS → schema stub export → automated events → optional soft boosts. Do not invert for hype or for a closed reputation vendor.

---

## What we deliberately avoid

- **Winner-only fame** — Hall/CREDITS that erase serious non-winners.
- **Spend-to-rank / burn-to-badge** — escrow, tokens, or sponsor tiers as contribution merit.
- **Single opaque trust score** — mixing contribution, infra-rep, and vibes into one private number.
- **Game-trust capture / general-trust kingship** — uncapped specialist weight on one title, or treating arcade-wide trust as a substitute for that game’s design seats ([dual trust](#dual-trust-game-based-vs-general)).
- **Erasing superseded credit** — annotations only; no silent ledger amnesia.
- **Salvage without dual credit or DCO honesty** — lifts cite sources ([07](./07-legal-ip.md)).
- **Infra-rep as governance** — no vote/fund/judge/DESIGN weight ([05](./05-infra-cost.md)).
- **Credit that skips gates** — never waive AC, DESIGN-fit, or ship evidence ([02](./02-judge-anti-gaming.md)).
- **Non-exportable reputation** — lock-in is anti-FOSS ([04](./04-sybil-grief.md)).
- **Farming via spam attempts / false flags** — diminishing returns + reversals.
- **Private VIP lists** — unpublished prestige that steers seasons or merges.

Forks may tune weights; the fossarcade org harness stays on this contract unless this doc is amended in public.

---

## Cross-links

| Topic | Doc |
| --- | --- |
| Judge races, scorecards, blindness, ties | [02-judge-anti-gaming.md](./02-judge-anti-gaming.md) |
| Sybil, grief, earned reputation, export, soft boosts | [04-sybil-grief.md](./04-sybil-grief.md) |
| Infra donated compute, infra-rep ≠ governance | [05-infra-cost.md](./05-infra-cost.md) |
| Legal DCO, inbound=outbound, salvage license | [07-legal-ip.md](./07-legal-ip.md) |
| Design authority, DESIGNERS / ADR path | [01-design-authority.md](./01-design-authority.md) |
| Dispute, capture, multi-person process | [09-dispute-capture.md](./09-dispute-capture.md) |
| Ship / promote evidence as playtest credit | [03-player-ship-path.md](./03-player-ship-path.md), [03b-unstable-to-stable.md](./03b-unstable-to-stable.md) |

---

## Patching this doc

Credit rules change who gets remembered and who gets soft influence. Edits are **slow lane**: PR, rationale, impact on open seasons / in-flight ledgers, merge. Quietly rewriting Hall history or ledger weights mid-season to favor one camp is itself an attack—treat it that way.

## Related

- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Sybil, grief funding & sock attempts](./04-sybil-grief.md)
- [Infra cost & abuse](./05-infra-cost.md)
- [Legal & IP](./07-legal-ip.md)
- [Design authority](./01-design-authority.md)
- [Dispute, capture & succession](./09-dispute-capture.md) (credit thresholds → DESIGNERS succession)
- [Cold-start dials](./10-cold-start.md) (manual CREDITS at Seed → automation later)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
