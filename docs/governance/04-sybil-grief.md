# Sybil, grief funding & sock attempts

**Status:** living governance doc  
**Audience:** harness authors, funders, voters, race participants, reviewers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. Cost of faking influence over KYC theater.

Vote and fund signals open seasons and races. If those signals are cheap to fake, the active pool becomes theater: sock votes, grief funding that burns commons compute, and duplicate attempts that starve real work. This document is the contract for keeping **identity light, influence costly to fake, and every throttle public and appealable**—without passports, mandatory KYC, or a private ban crown.

If a rule here conflicts with a closed identity API, a private Discord override, or unpublished heuristics—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: scoring blindness and sock-attempt notes in [02-judge-anti-gaming.md](./02-judge-anti-gaming.md); contribution credit / **dual trust** (game vs general soft powers) in [08-credit-economy.md](./08-credit-economy.md). Funding opens races; it must **not** boost score.

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **Cheap fake consensus** | Many new accounts vote the same target | Seasons track noise, not players |
| **Grief funding** | Tiny or disposable stakes open races that waste CI / judge / canary | Commons infra burned; good work delayed |
| **Sock attempts** | Same human/agent fleet under many keys flooding a race | Parallelism becomes spam; fair racers lose slots |
| **Pay-to-win reputation** | Spend or fund history treated as merit | Crowns return; DESIGN-fit and merges lose weight |
| **KYC / passport gate** | “Prove you are a real person” to participate | Excludes FOSS contributors; recreates closed platforms |

### Principles

1. **Raise the cost of faking influence—do not demand passports.**  
   Soft roots, escrow, bonds, rate limits, and ramps beat mandatory KYC. If influence is free to mint, governance is free to capture.

2. **No KYC / passport requirement for vote, fund, or attempt.**  
   Soft identity roots (public forge age/activity, vouch) are optional weight boosters—not admission tickets. Anonymous and newcomer paths exist with tighter dials.

3. **Sunshine over secret sauce.**  
   Ledgers, heuristics, vetoes, and slash reasons are public. Unpublished “trust scores” that decide outcomes are invalid process.

4. **Fork escape.**  
   If dials or heuristics drift into gatekeeping, **fork out**. Exportable reputation and public ledgers make exit real, not theater.

5. **Funding ≠ score; losing a fair race ≠ grief.**  
   Fund opens compute. Score stays blind to funder identity ([02](./02-judge-anti-gaming.md)). Good-faith race loss never triggers grief slash.

---

## Attack split

| Attack class | Surface | Primary defenses |
| --- | --- | --- |
| **Sybil votes** | Vote / signal which targets and seasons open | Template gate; soft identity roots; quadratic voting in batches; new-account weight ramp; safety veto (narrow) |
| **Grief funding** | Token / escrow that opens races and burns commons compute | Min escrow; slashable grief bond → commons infra pot; per-funder rate limits; challengeable sock-cluster heuristics for funding weight |
| **Sock attempts** | Parallel submissions under many keys flooding slots | `max_attempts`; newcomer concurrency limits; duplicate throttle; public cluster flags (appealable) |

Collusion can span all three. Defenses stack; no single dial is a crown.

---

## Voting

Votes (and equivalent public signals) answer: **which targets and seasons are worth opening?** They do not buy merge and do not waive acceptance tests.

### Template gate

- Votes only count on **in-template** proposals (required fields: target id, DESIGN/ADR cites where Medium+, season board link, non-goals check).
- Free-form “vibes for X” without the template is discussion, not vote weight.
- Template changes are **slow lane** (same as rubric).

### Soft identity roots (optional weight, not admission)

Prefer **public, portable roots**—never a passport:

| Root | Intent |
| --- | --- |
| **Forge age / activity** | GitHub (or forge) account age + public contribution history as a soft multiplier |
| **Public vouch** | Existing rooted accounts vouch in-repo (issue/PR); vouch graph is public and challengeable |
| **None** | Newcomers may still vote at **ramped** weight (below) |

Roots **boost** weight within caps; they do **not** unlock a private franchise. Forks may choose different roots; fossarcade org defaults stay documented here.

### Quadratic voting in batches

- Votes apply in **batches** (e.g. per season board window or weekly tally)—not continuous micro-spam.
- Prefer **quadratic** (or square-root) aggregation of vote intensity so whale + sock fleets pay superlinearly for concentrated influence.
- Exact curve and batch length live in-repo config; changes are slow lane + public notice before the next batch.

### New-account vote weight ramp

- Fresh accounts start at **low vote weight** and ramp with time and/or public activity (forge age, merged contributions, accurate flags—see Reputation).
- Ramp schedule is public YAML; no silent mid-batch edits.
- Ramp does not require KYC—only elapsed public signal.

### Safety veto (narrow)

A safety veto may **block opening** a target (or strip a vote batch’s effect on that target) **only** for:

- **Malware / supply-chain malice**
- **Illegal content** (as defined by published CoC + applicable law notes—not vibe)
- **Policy-banned sexual content** on official surfaces (pornography / explicit sexual content / hentai / fetish exhibition intended to arouse—see [content-policy.md](./content-policy.md); not anime style alone)
- **License sabotage** (e.g. sneaking proprietary or incompatible terms)
- **Harassment** (as defined by published CoC)

Rules:

- Veto reasons must be **written, public, and appealable**.
- Veto is **not** taste, balance preference, or “I don’t like this pillar.”
- Panel / active-pool application of veto uses the same public criteria; private Discord veto is **invalid**.
- Outcomes may spawn ADRs if law was ambiguous.

---

## Funding

Fund answers: **which attempts get backing and harness compute?** Funding alone does not waive gates or boost score.

### Min escrow

- Opening or sustaining a race requires **minimum escrow** (play-money or real—token meaning is a separate gap; the *shape* is required).
- Escrow covers expected compute / canary cost band for the target tier; under-escrow targets do not open.

### Slashable grief bond → commons infra pot

- Alongside escrow, funders post a **grief bond**.
- Bond is **slashed and burned to a commons infra pot** (CI, race runners, canaries—**not** to founders, maintainers, or private wallets) **only** when grief/spam is established under public rules.
- **Good-faith race loss does not slash.** Losing fairly is normal FOSS competition.
- Slash criteria examples (illustrative; exact list in-repo): clear duplicate-spam funding, sock-cluster open-flood after warning, malware-tied fund opens, repeated void-for-abuse.
- Every slash emits a **public reason** + appeal path. Silent slash is invalid.

### Per-funder rate limits

- Caps on opens / concurrent funded races **per funding identity** (and soft-linked clusters when challenged).
- Limits scale with phase (see Boot vs scale dials). Strangers get fair-use quotas—not a ban crown.
- Rate-limit hits are logged publicly (identity pseudonym + counter), not whispered.

### Challengeable sock-cluster heuristics (funding weight)

- Harness may apply **public heuristics** that reduce funding weight or raise escrow for suspected sock clusters (shared patterns: timing, graph, forge metadata—**declared** in-repo).
- Heuristics are **challengeable**: flagged funder can appeal with evidence; false positives restore weight and may credit bond fees back per policy.
- Unpublished ML “risk scores” that silently cut weight are **out of process**.
- Separation held firm: even full-weight funding **never** appears as a positive feature inside the judge score model ([02](./02-judge-anti-gaming.md) blindness).

---

## Attempts (sock / flood)

Parallel attempts are a feature. Unbounded sock fleets are grief.

| Control | Intent |
| --- | --- |
| **`max_attempts`** | Hard cap on concurrent or per-race attempts per identity (and per soft-linked cluster when challenged). |
| **Newcomer concurrency limits** | Tighter caps for new / unramped keys until soft roots or earned reputation ramp. |
| **Duplicate throttle** | Near-duplicate diffs / manifests (public similarity thresholds) share a slot budget or defer—anti-flood, not anti-fork. Honest independent approaches stay welcome. |

- Caps are in harness config, sunshine-logged when hit.
- Appeals: “I am not a sock / this is not a duplicate” → public issue → thin panel → written outcome.
- Attempt identity is stripped from **scoring** packages where practical; caps still apply on the submission plane.

---

## Reputation

Reputation is **earned**, not bought.

| Earns reputation | Does not |
| --- | --- |
| Merges that stick | Token spend / escrow size |
| Accepted specs / ADRs | Merely opening many races |
| Useful playtests / evidence bundles | Loud forum vibes |
| **Accurate** safety / grief / sock flags | False or spam flags (may reverse) |

Rules:

- **Losing a fair race does not tank reputation.** Place, learn, try again.
- Grief slash, sustained false flags, or malware-tied work **can** dent reputation—publicly, with reasons.
- Reputation is **exportable** (machine-readable attestations / ledgers contributors can carry to forks). Lock-in is anti-FOSS.
- Reputation may soft-boost vote ramp or attempt concurrency within caps; it never waives AC tests or DESIGN-fit. Soft powers follow **dual trust** in [08](./08-credit-economy.md#dual-trust-game-based-vs-general)—**game trust** for that title’s dials, **general trust** for org-wide dials, both capped.

---

## Sunshine ledgers

Publish (append-only or versioned public logs) for:

- Vote batches (weights after ramp/quadratic, not secret ballots that decide seasons without audit)
- Fund opens, escrow, bond status, slashes → commons pot movements
- Rate-limit hits and `max_attempts` deferrals
- Safety vetoes and appeal outcomes
- Sock-cluster flags, challenges, and resolutions
- Reputation attestations suitable for export

Unpublished influence that changes who wins a season or who gets compute is **invalid**. Prefer boring CSV/JSONL over clever opaque dashboards.

Privacy: prefer **pseudonymous** forge/harness ids over doxxing. Soft roots use **public** forge activity—not government ID.

---

## Boot vs scale dials

Bootstrap tight against grief; widen when sunshine culture and appeals actually work. Never “widen” into KYC.

| Dial | Boot / early (phases 0–1) | Scale (phases 2–4) |
| --- | --- | --- |
| KYC / passport | **Never** | **Never** |
| Vote template | Required | Required; richer fields OK |
| Soft roots | Optional; forge age enough | Age + activity + public vouch graph |
| Vote aggregation | Simple capped weight + ramp | Quadratic (or equiv.) in batches |
| New-account ramp | Steep / slow | Still present; faster earn via merges/flags |
| Safety veto | Narrow list; human-written reasons | Same list; faster panel rotation, still public |
| Min escrow | Small but **non-zero** | Tiered by target L0–L3 / compute band |
| Grief bond | Required on fund open; slash rare, loud | Same; commons pot feeds org runners |
| Per-funder rate limits | Strict | Fair-use quotas; still capped under load |
| Sock-cluster heuristics | Conservative; high precision | Broader public ruleset; still challengeable |
| `max_attempts` | Low | Higher but capacity-aware |
| Newcomer concurrency | Very low | Low until ramp |
| Duplicate throttle | On | On; tuned thresholds in-repo |
| Reputation export | Schema stub | Stable export format + fork import notes |
| Ledgers | Manual or simple logs OK | First-class dashboard + raw export |

**Order of operations:** public ledgers + min escrow + attempt caps → soft roots and quadratic batches → richer heuristics. Do not invert for hype or for a closed identity vendor.

---

## What we deliberately avoid

- **Mandatory KYC / passport / phone-gate** to vote, fund, or attempt.
- **Founder- or maintainer-pocketed slash proceeds** — grief burns to **commons infra**, or process is corrupt.
- **Slashing good-faith race losers** — competition is not grief.
- **Funding as a score feature** — opens races only; judge stays blind ([02](./02-judge-anti-gaming.md)).
- **Unpublished trust / risk scores** that silently gate influence.
- **Taste veto disguised as safety** — safety is malware, illegal, policy-banned sexual content on official surfaces ([content-policy.md](./content-policy.md)), license sabotage, harassment—with written appealable reasons.
- **Pay-to-win reputation** — spend ≠ merit.
- **Permanent shadowbans without ledger** — throttles and flags are sunshine or invalid.
- **Duplicate throttle as anti-fork** — independent lineages and honest variants stay welcome ([lineage-and-shelf.md](./lineage-and-shelf.md)).
- **Identity roots as admission tickets** — soft boosts only; newcomers keep a ramped path.

Forks may tune dials; the fossarcade org harness stays on this contract unless this doc is amended in public.

---

## Patching this doc

Sybil and grief rules change who can steer seasons and burn commons compute. Edits are **slow lane**: PR, rationale, impact on open vote batches / in-flight bonds, merge. Quietly tightening heuristics mid-batch to favor one camp is itself an attack—treat it that way.

## Related

- [Judge anti-gaming](./02-judge-anti-gaming.md) (blindness, sock attempts in threat model)
- [Official content policy](./content-policy.md) (policy-banned sexual content in safety veto)
- [Dispute, capture & succession](./09-dispute-capture.md) (safety/content veto ≠ taste; capture resistance)
- [Cold-start dials](./10-cold-start.md) (vote/fund/sybil intensity by stage)
- [Design authority](./01-design-authority.md)
- [Player & ship path](./03-player-ship-path.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
