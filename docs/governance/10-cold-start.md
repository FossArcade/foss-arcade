# Cold-start dials (3 → 30 → 300)

**Status:** living governance doc  
**Audience:** bootstrap maintainers, newGame proposers, harness authors, early contributors, reviewers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **Same constitution; dials turned down.** Publish which stage you are in.

Rules designed for thousands break—or overkill—at three people. Empty DESIGNERS lists, empty credit ledgers, and no soft roots are normal at birth, not failures. This document is the contract for **scaling process with headcount and load without changing the constitution**—and for saying honestly when a bootstrap exception is in force.

If a rule here conflicts with “we’ll just wing it in Discord until we feel big,” or with flipping City dials on day one for theater—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: sybil / fund / attempt dials in [04-sybil-grief.md](./04-sybil-grief.md); infra budgets in [05-infra-cost.md](./05-infra-cost.md); credit boot in [08-credit-economy.md](./08-credit-economy.md); succession bootstrap in [09-dispute-capture.md](./09-dispute-capture.md); lifecycle incubation caps in [11-game-lifecycle.md](./11-game-lifecycle.md); Snake bootstrap note in [reddit-formats.md](./reddit-formats.md).

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **City rules at Seed** | Quadratic vote batches, grief bonds, N-of-M donated pools, auto-promote—for three humans | Process theater; nobody ships; newcomers bounce |
| **No dials, only vibes** | “We’ll add rules when it hurts” with no published stage | Capture by whoever shouts; no audit of what was waived |
| **Incumbent gatekeeping** | Empty ledgers used as “you have no rep, so no races” | Cold start never thaws; founders become kings |
| **Fake history** | Seed Hall with invented veterans or imported prestige | Sunshine lie; forks cannot trust export |
| **Forever bootstrap** | Snake-style exceptions never sunset | Constitution hollow; strangers inherit secret crowns |

### Principles

1. **Same constitution, dials turned down.**  
   DESIGN.md law, no CD, merge ≠ ship, sunshine, fork escape, content policy—**always on**. What scales is **intensity** of vote/fund/CI/judge/promote/credit/sybil machinery.

2. **Publish the stage.**  
   Org or per-game `stage` (or equivalent) is **public**: Seed / Village / Town / City (names below). Vibes-only advancement is invalid.

3. **Bootstrap exceptions are logged and temporary.**  
   Snake may ship without a newGame vote; the next title does not inherit silence. Exceptions live in-repo with sunset or stage triggers.

4. **Newcomers can earn without incumbents as tollbooths.**  
   Empty DESIGNERS and empty ledgers mean **open nomination and manual credit**, not “closed until the founder likes you.”

5. **Do not turn on load-bearing trust early.**  
   Donated pools, auto-promote, and shared inference wait for attestation culture and soak—see [What not to turn on early](#what-not-to-turn-on-early).

---

## Stages

Illustrative bands. Exact numeric dials live in harness / `budgets.yaml` / per-game config; this table is the **contract for which machinery is appropriate**.

| Stage | Rough size | Intent |
| --- | --- | --- |
| **Seed** | 1–10 active contributors | Prove harness + one playable path; minimal ceremony |
| **Village** | 10–50 | First public seasons; light anti-grief; still human-heavy |
| **Town** | 50–300 | Real parallelism; QV/ramp, bonds, richer CI; mechanical-first judge |
| **City** | 300+ | Mass adoption; capacity caps; donated N-of-M; automation with sunshine |

Size is **active contributors / weekly attempt load**, not vanity GitHub stars. A quiet org with 400 watchers can still be Village.

### Stage dials (summary)

| Dial | Seed (1–10) | Village (10–50) | Town (50–300) | City (300+) |
| --- | --- | --- | --- | --- |
| **`max_active_jobs`** | Tiny (pilot-sized) | Low | Capacity-aware | Org-wide fairness + stagger ([03b](./03b-unstable-to-stable.md)) |
| **`max_attempts`** | Very low | Low | Higher, capped | Capacity-aware + duplicate throttle ([04](./04-sybil-grief.md)) |
| **Vote system** | Simple upvote / explicit ack; template if voting at all | Capped weight + new-account ramp | Quadratic (or equiv.) in batches + ramp | QV + richer soft roots / vouch graph |
| **Funding** | Min escrow optional or tiny; human grief watch | Min escrow on; slash rare/loud | Grief bonds → commons pot | Tiered escrow/bonds by L0–L3 / compute band |
| **CI** | GitHub (or forge) free tier / single runner | Free + light self-host | Donated runners **without** shared trust theater | Sandboxed donated pools with **N-of-M attestation** ([05](./05-infra-cost.md), [06](./06-security-supply-chain.md)) |
| **Judge** | Mechanical only (CI + AC); rubric optional/manual | Mechanical + simple rubric; LLM **off** or tiny BYO | LLM assist **capped** minority weight ([02](./02-judge-anti-gaming.md)) | Multi-signal; multi-judge on L2+; still mechanical-first |
| **Promote** | Manual / explicit `promote-channel` by humans OK if logged | Promote-channel targets preferred | Promote-channel **only**; no admin shortcut ([03b](./03b-unstable-to-stable.md)) | Same + capacity caps; auto-stable still default off |
| **Credit** | `CREDITS.md` / season notes by hand; include non-winners | Semi-manual labels + CSV | Harness credit events | Automated ledger + Hall draft + export ([08](./08-credit-economy.md)) |
| **Sybil** | Manual eyes; steep ramp if votes exist | Soft forge-age roots; public flags | Vouch + challengeable heuristics | Broader public ruleset; still no KYC ([04](./04-sybil-grief.md)) |

Publish current org stage (and per-game overrides if any) in README, `game.yaml`, or a small `stage` file—**one obvious place**.

---

## Snake bootstrap exception

**Foss Snake** used a documented bootstrap: first-game premise and early targets without a full newGame vote / Village ceremony ([reddit-formats.md](./reddit-formats.md), [GAPS.md](./GAPS.md), [games/snake.md](../games/snake.md)).

| Rule | Intent |
| --- | --- |
| **Logged exception** | Snake’s no-vote (or minimal-ack) start is **in-repo history**, not a secret privilege |
| **Next `newGame`** | When leaving **Seed** (or when opening a second org title, whichever comes first), **votes / public ack per stage dials are required**—no silent second pilot |
| **No inheritance** | “Snake didn’t vote” is not precedent for skipping content policy, DESIGN.md, or licenses |
| **Sunset** | Once Village triggers fire, cite this section as closed for new titles unless a new `[meta]` exception is logged |

---

## Explicit triggers to advance stages

Advance on **evidence**, not vibes alone. Meeting **any strong trigger** (or a published combination) justifies a public stage bump PR.

| From → to | Example triggers (pick concrete numbers in-repo) |
| --- | --- |
| **Seed → Village** | ≥ ~10 distinct contributors with merged work **or** sustained weekly attempts above Seed cap **or** first season complete with public scorecards |
| **Village → Town** | ≥ ~50 active contributors **or** concurrent games/seasons needing stagger **or** repeated grief/sybil pressure that manual eyes cannot cover |
| **Town → City** | ≥ ~300 active **or** Shelf as default install path under load **or** donated-pool demand that requires N-of-M |

| Always required for a bump | |
| --- | --- |
| **Public PR / `[meta]` note** | Old stage → new stage; checklist of which dials flip |
| **No silent widen** | Especially not KYC, auto-promote-on, or donated pool without attestation |
| **May stay put** | Hitting vanity metrics without process readiness is **not** a duty to advance |

Regression (City → Town under collapse) is allowed with the same sunshine—prefer honest dial-down over fake City theater.

---

## What not to turn on early

| Leave off (until stage / culture ready) | Why |
| --- | --- |
| **Donated compute pool before attestation** | Untrusted shared runners without N-of-M / sandbox are supply-chain gifts to attackers ([05](./05-infra-cost.md), [06](./06-security-supply-chain.md)) |
| **Auto-promote / auto-stable** | Default off until soak + rollback culture works ([03b](./03b-unstable-to-stable.md)) |
| **Shared org inference as sole judge** | BYO + mechanical-first; closed proprietary judge-as-arbiter is out of scope ([OVERVIEW](../OVERVIEW.md), [02](./02-judge-anti-gaming.md)) |
| **Quadratic + heavy bonds at Seed** | Overkill; burns goodwill; use simple upvote + human grief watch |
| **Fake Hall veterans** | Seed Hall from real merges/attempts only ([08](./08-credit-economy.md)) |
| **Private Discord bootstrap law** | Log exceptions in-repo ([09](./09-dispute-capture.md)) |

---

## Boot vs scale (meta)

| Dial | Boot | Later |
| --- | --- | --- |
| Stage publish | README one-liner + Snake exception note | `stage` in org config + per-game overrides |
| Exception log | `docs/` or `adr/` bootstrap log | Same; refuse undocumented waivers |
| newGame gate | Snake exempt (logged); next title votes when leaving Seed | Stage table above |
| Credit / DESIGNERS empty | Manual CREDITS + open nomination | Automated events + earn thresholds ([08](./08-credit-economy.md), [09](./09-dispute-capture.md)) |

**Order of operations:** publish Seed + mechanical gates + content policy → first season / contributors → Village dials → only then Town trust machinery. Do not invert for launch hype.

---

## What we deliberately avoid

- **City process at Seed** — ceremony that blocks the only three contributors.
- **Vibes-only stage changes** — no public trigger, no PR.
- **Forever Snake exception** — second game without votes/acks when past Seed.
- **Incumbent tollbooth** — empty rep ledger as a ban on newcomers.
- **Fake history / imported crowns** — Hall and soft roots must be earnable and honest.
- **Early donated pool / auto-promote / shared inference arbiter** — trust before attestation.
- **Silent dial flips mid-season** to favor one camp.
- **KYC “because we grew”** — never a stage reward ([04](./04-sybil-grief.md)).

Forks may choose different band names; fossarcade org publishes stage and keeps this contract unless amended in public.

---

## Patching this doc

Cold-start dials change who may open races and how hard anti-grief bites. Edits are **slow lane**: PR, rationale, impact on published stage and open exceptions, merge. Quietly claiming City powers at Seed—or Seed waivers at City—is itself an attack—treat it that way.

## Related

- [Sybil, grief funding & sock attempts](./04-sybil-grief.md)
- [Infra cost & abuse](./05-infra-cost.md)
- [Credit economy](./08-credit-economy.md)
- [Dispute, capture & succession](./09-dispute-capture.md)
- [Game lifecycle](./11-game-lifecycle.md)
- [Unstable → stable promotion](./03b-unstable-to-stable.md)
- [Reddit tags & proposal formats](./reddit-formats.md) (Snake bootstrap / deferred subreddit)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
