# Infra cost & abuse (commons compute)

**Status:** living governance doc  
**Audience:** harness authors, funders, sponsors, race participants, ops, reviewers  
**Spirit:** FOSS — open, forkable, no kings, public process. **No toll to play.** Sunshine ledgers beat hidden throttles. Shared pot + rate limits beat paywalls and secret admin dials.

BYO inference keys do **not** erase org cost. CI, CDN, artifacts, judge/canary runners, and bots still burn real money and volunteer ops. This document is the contract for **who pays what, how the commons pot works, how contributors unload burn via donated compute, how budgets and caps stay public, and how engines dial cost**—without ads, paywalled `stable`, or selling votes.

If a rule here conflicts with a private sponsor deal, unpublished quota, or “just turn off strangers” knob—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: grief bonds → commons pot in [04-sybil-grief.md](./04-sybil-grief.md); runners/budgets in [engines.md](../engines.md); promote capacity in [03b-unstable-to-stable.md](./03b-unstable-to-stable.md).

---

## Problem and principle

### The problem

**Bring-your-own inference ≠ free forge.**

| Myth | Reality |
| --- | --- |
| “Agents BYO LLM keys, so the org costs nothing” | Keys cover **inference assist** only. Org still pays (or volunteers) **CI minutes, artifact storage, CDN, race runners, canaries, bots, ops time**. |
| “GitHub Actions / free tier will forever absorb races” | Parallel races at phase 2+ blow free tiers. Unbounded strangers + grief funding = **commons burn**. |
| “We’ll just soft-ban heavy users privately” | Hidden control recreates a crown. Throttles without sunshine are invalid process ([04](./04-sybil-grief.md)). |
| “Charge to play / unlock stable” | Paywalls on play or ship trains break mass-adoption FOSS and invite capture. |

Without a public cost model, either (a) the forge dies under load, (b) a sponsor or maintainer becomes silent king via wallet, or (c) strangers are locked out by unpublished dials.

### Principles

1. **No toll to play.**  
   Playing Shelf builds, cloning repos, reading scorecards, and opening good-faith issues/PRs must not require payment. Optional sponsorship never gates `stable` or basic participation.

2. **Public ledger.**  
   Money in, money out, soft/hard caps, rate-limit hits, and sponsor perks are sunshine—boring CSV/JSONL or dashboard + raw export. Unpublished “priority lanes” that buy merge or judge weight are invalid.

3. **Shared pot.**  
   Org CI, shared runners, canaries, and default harness jobs draw from a **commons infra pot** (grief slashes, sponsors, Open Collective–style donations)—not founder pockets as a crown, and not ads.

4. **Rate limits over hidden control.**  
   Fair-use quotas, soft/hard budget caps, and deferred jobs beat shadowbans and private Discord “turn them off.” Caps are logged and appealable.

5. **Self-hosted escape.**  
   Anyone can mirror, self-host runners, or fork with their own compute. Org pot scarcity must not trap contributors; document the escape hatches.

6. **Funding ≠ score; sponsorship ≠ design authority.**  
   Directed infra sponsors may fund **compute bands** (see Money in). They do not buy DESIGN edits, rubric weight, or Shelf placement ([01](./01-design-authority.md), [02](./02-judge-anti-gaming.md)).

7. **Donated compute ≠ governance.**  
   Contributors may unload org burn with local runs, BYO runners, job-scoped capacity, pooled donated machines, and volunteer mirrors. Donors earn **thanks + infra-rep**—never merge rights, DESIGN seats, or judge weight (see [Unloading infra](#unloading-infra-donated-compute)).

---

## Cost surfaces

What actually burns money or scarce volunteer attention:

| Surface | Examples | Notes |
| --- | --- | --- |
| **CI** | PR checks, merge gates, race attempt builds, matrix per engine | Primary burn at phase 2+; cache/reuse mandatory |
| **Artifacts** | Build outputs, Shelf manifests, checksums, rollback tips, logs | Storage + bandwidth; retention policies in budgets |
| **Judge / canaries** | Mechanical gates, canary corpus runs, multi-judge on L2+, soak metrics jobs | LLM assist remains **BYO keys** where possible; org still pays runner wall-time |
| **Ops** | On-call for broken runners, secret rotation, incident write-ups, forge admin | Volunteer-scarce; prefer automation + public runbooks |
| **Bots** | Harness bots, Shelf tip updaters, ledger posters, rate-limit notifiers | API quotas + hosting; keep boring and auditable |

CDN / download bandwidth for Shelf installs sits under **artifacts** unless split in `budgets.yaml`. Forum hosting (issues/Discussions) is usually forge-included; if the org runs a separate forum, treat it as **ops + artifacts**.

---

## Money in

### Commons pot (default)

Feeds **shared** org CI, default race runners, canaries, bots, and retention for public artifacts.

| Source | Role |
| --- | --- |
| **Grief bond slashes** | Burned to pot only under public grief rules ([04](./04-sybil-grief.md))—not to maintainers |
| **Sponsors / Open Collective–style** | Recurring or one-shot donations into a transparent fiscal host |
| **Directed infra sponsors** | Earmarked for named cost surfaces or engine bands (below)—still ledgered |
| **Self-hosted escapes** | Contributors attach **their own** runners/mirrors; reduces draw on pot (credit optional, never required) |

Token/play-money meaning at v1 remains a separate gap; **shape** here is required: real or play units that open compute must map to escrow/pot rules without inventing a toll to play.

### Directed infra sponsors

A sponsor may fund, publicly:

- Extra **CI minute** packs for a game, season, or engine class  
- **Godot / Unity / Unreal** runner images or license escrow (engine-specific)  
- Artifact retention or CDN for a catalog spike  
- Canary corpus expansion jobs  

Directed funds **cannot** purchase: merge, judge score, DESIGN overrides, exclusive Shelf featuring, vote weight, or silent priority over fair-use queues (they may add **capacity**—more parallel slots—without skipping gates).

### Not OK — money in

| Not OK | Why |
| --- | --- |
| **Ads** in Shelf, scorecards, or play builds as pot funding | Captures player attention; conflicts with no-toll FOSS feel |
| **Paywalled `stable`** (or pay-to-promote) | Ship train must stay earn-by-evidence ([03](./03-player-ship-path.md), [03b](./03b-unstable-to-stable.md)) |
| **Selling votes** or fund-weight as a product | Captures seasons; anti-sybil contract broken |
| **Founder-pocketed “donations”** with no ledger | Crown via wallet |
| **Pay-to-skip gates / canaries** | Invalid process |

### OK vs not-OK sponsor perks

| OK (public, non-gating) | Not OK |
| --- | --- |
| Name/logo on **infra sponsors** page / ledger footnote | Logo on every play session or scorecard as ads |
| “Thanks” forum post; sticker in CONTRIBUTORS-style list | Exclusive merge rights or CODEOWNERS seat bought |
| Earmark visible on funded runner pool (“Godot runners: Sponsor X”) | Hidden priority queue that jumps fair-use |
| Optional **sponsor-funded** extra canary capacity for all racers on a season | Private canary results only for sponsor pets |
| Mirror hosting credit (“downloads also at …”) | DRM, telemetry mandate, or CLA that assigns copyright to sponsor |

Forks may refuse all sponsors; fossarcade org defaults allow **transparent infra sponsorship** under this table.

---

## Money out

### `budgets.yaml` sketch

Canonical numbers live in-repo (harness + per-game overlays). Illustrative shape:

```yaml
# budgets.yaml (sketch — not normative numbers)
version: 1
commons_pot:
  soft_cap_monthly: null    # warn + forum note when crossed
  hard_cap_monthly: null    # defer non-essential org jobs
surfaces:
  ci:
    soft_minutes: null
    hard_minutes: null
    cache_required: true
  artifacts:
    retain_stable_days: null
    retain_unstable_days: null
    max_artifact_mb: null
  judge_canaries:
    org_runner_minutes: null
    byo_inference: true
  bots:
    api_calls_soft: null
engines:
  web:
    org_ci_multiplier: 1.0
  godot:
    org_ci_multiplier: 2.0   # higher caps; still pot-eligible
  unity:
    org_ci_multiplier: null  # directed funding or self-hosted required
  unreal:
    org_ci_multiplier: null
fair_use:
  concurrent_org_jobs_per_identity: null
  defer_when_soft_cap: true
stable_play:
  preserve_under_soft_cap: true   # prefer defer races over breaking Shelf stable CDN
```

Exact integers are phase dials (Boot vs scale). Changing caps mid-season needs **public notice** before the next budget window.

### Soft vs hard caps

| Cap | Behavior |
| --- | --- |
| **Soft** | Warn on dashboard + monthly forum infra note; defer low-priority / newcomer-flood jobs; keep **stable play** and rollback artifacts when possible |
| **Hard** | Stop or queue **org-paid** non-essential jobs (extra race slots, non-promote CI fluff); publish reason; point to **self-host / mirror** paths |

**Stable play preserved when possible:** under soft pressure, prefer cutting speculative parallel races and long retention of failed attempt artifacts **before** cutting Shelf `stable` downloads, rollback tips, or security patch CI. Hard-cap emergencies still sunshine-logged; never a quiet “stable is down for non-sponsors.”

### Mirror / self-host guidance

When pot is tight or strangers need more parallelism:

1. **Attach self-hosted runners** labeled for game/engine (public docs; no secret allowlist crown).  
2. **Mirror artifacts** (IPFS, Forgejo, community CDN)—Shelf manifests may list multiple install URLs with checksums.  
3. **Fork the harness** with local budgets; export reputation/ledgers per [04](./04-sybil-grief.md).  
4. **BYO race compute**: attempt author pays runner; org still records scorecard if gates are reproducible.

Org scarcity is a dial trigger, not a loyalty test.

---

## Unloading infra: donated compute

FOSS spirit: **shrink the always-on bill by moving work onto contributors**, not by inventing tolls. Money pots fund scarcity and glue; donated machines and mirrors unload the burn. Same sunshine rules—capacity gifts never buy process.

Ladder (prefer earlier steps when they suffice):

| Step | What it is | Org pot draw |
| --- | --- | --- |
| **1. Local-first** | Author runs attempts, tests, and agent loops on their own machine | None |
| **2. BYO self-hosted runners** | Contributor attaches labeled runners for their PRs / races | None (or tiny orchestration) |
| **3. Job-scoped donated capacity** | Someone funds or hosts **one job / one race / one promote soak**—not a standing crown | Deferred or zero |
| **4. Donated compute pool** | Volunteers register sandboxed capacity into a shared pool | Orchestration + attestation only |
| **5. Volunteer mirrors** | Community hosts Shelf artifact copies with checksums | Core pointer + signing stay org |

### Local-first attempts

Default for development and most L0–L1 loops:

- Clone, build, test, and iterate **locally** (or on the author's own CI).
- BYO inference keys stay with the author; org never needs those secrets.
- Publish scorecards / evidence when gates are **reproducible** against public harness configs—org re-runs only when merge trust or promote capacity requires it.

Local-first is not a dodge of review; it is the cheapest honest path before touching commons minutes.

### Bring-your-own self-hosted runners

Contributors (and directed sponsors) may attach **self-hosted runners** labeled by game/engine/season:

- Registration and labels are **public docs**—no secret allowlist that recreates a crown.
- Prefer runners scoped to the contributor's fork PRs or explicitly opted-in org jobs.
- Images and cache policies follow harness docs so results stay comparable.
- Failure or disappearance of a BYO runner is the owner's problem; org pot is not obligated to backfill instantly.

Credit on the infra sponsors / donors page is optional. Runner ownership never grants CODEOWNERS, DESIGN edits, or judge weight.

### Job-scoped donated capacity

When a single race, canary pack, or promote soak would blow fair-use:

- A donor may underwrite **that job** (host a machine for the window, or earmark directed funds for those minutes only).
- Scope is named in the public board / ledger (“race R-… runners: Donor Y through date Z”).
- When the job ends, capacity ends—no evergreen privilege.
- Still subject to the same mechanical gates; donation does not skip canaries or buy promote.

### Donated compute pool

A standing **volunteer pool** can absorb parallel races and CI when pot soft-caps bite. Trust model is FOSS-paranoid by design:

| Rule | Why |
| --- | --- |
| **Sandboxing** | Jobs run in disposable, rootless (or equivalent) sandboxes with network egress policy; no privileged host access for untrusted workloads |
| **Reproducible artifacts** | Outputs are content-addressed (checksums / SBOM / attested logs). Consumers verify hashes, not “trust this donor's word” |
| **N-of-M attestation for merge gates** | Merge- and promote-blocking results must be confirmed by **N of M** independent executors (org core and/or distinct donors). **Never trust a single donor** as sole merge-gate oracle |
| **No secrets to random donors** | Signing keys, deploy tokens, inference org keys, and fiscal credentials **never** leave the tiny always-on core. Donors receive only public job specs + ephemeral workload credentials with least privilege |
| **Donor reputation / poison handling** | Track public infra-rep (uptime, hash agreement rate, incident notes). Poison or equivocation → quarantine that donor's attestations, sunshine the incident, require re-run on trusted set. Reputation is **infra hygiene**, not governance rank |

Pool admission can start invite-light (known contributors) and widen with attestations; widening is a public dial, not a private Discord favor.

### Volunteer mirrors for Shelf artifacts

Shelf installs should survive pot pressure and single-CDN failure:

- Volunteers host mirrors (Forgejo releases, object storage, IPFS, community CDN).
- Official manifests list **multiple install URLs** with the **same checksums**; clients verify before play.
- Mirrors copy bytes; they do not mint `stable` tips or rewrite manifests.
- Bad mirrors (corrupt or trojanized payloads) fail checksum and get delisted via public process—same sunshine as abuse response.

### Tiny always-on core (what stays paid / org-held)

Unload aggressively, but keep a **minimal trusted core** that donated chaos must not replace:

| Core surface | Why it stays |
| --- | --- |
| **DNS / canonical names** | Players and forges need a stable pointer |
| **Signing / release keys** | Only core signs official channel tips and harness releases |
| **Official pointer** | Canonical Shelf manifest index / tip URLs (mirrors are alternatives, not replacements) |
| **Abuse mailbox + incident intake** | Public process needs a reachable, logged contact |
| **Minimal orchestration** | Job scheduler that assigns work, records attestations, posts ledgers—thin glue, not a fat cloud |

Everything else—bulk CI minutes, race parallelism, artifact bandwidth, long retention—should prefer local-first → BYO → job-scoped → pool → mirrors before draining the pot.

### Donor thanks and infra-rep (not governance)

| OK | Not OK |
| --- | --- |
| Public thanks; ledger footnote; CONTRIBUTORS-style **infra donors** list | Bought CODEOWNERS / active-pool seat |
| **Infra-rep** badges (capacity offered, attestation agreement, mirror uptime)—hygiene signal only | Infra-rep as vote weight, fund weight, or judge score |
| Earmark visibility (“Godot pool slot: Donor Z”) | Exclusive priority queue that jumps fair-use |
| Optional sticker / forum shout-out | DESIGN.md authority, rubric edits, or Shelf featuring as perk |
| Quarantine + appeal after poison incidents | Silent ban that erases attestation audit rows |

**Donated compute ≠ sponsorship authority.** Same firewall as money: capacity gifts fund runners and mirrors, never process capture ([01](./01-design-authority.md), [02](./02-judge-anti-gaming.md)).

---

## Who burns what

| Activity | Money / pot (default) | Donated compute | Notes |
| --- | --- | --- | --- |
| **Local attempts / agent loops** | None | **Local-first** (author machine + BYO inference keys) | Always free of org pot |
| **PR CI on contributor fork** | Forge free tier / contributor | **BYO self-hosted** runners welcome | Org may re-run on merge; cache shared policies |
| **Org CI on `fossarcade` repos** (merge, `unstable` land) | **Commons pot** | Pool OK for non-sole attestation; **N-of-M** before merge trust | Soft/hard caps; never single-donor merge gate |
| **Race attempt jobs** | Escrow / funder band first; overflow **pot** within fair-use | **Job-scoped** donor or **pool** slots | Under-escrow races do not open ([04](./04-sybil-grief.md)) |
| **Canaries / multi-judge wall-time** | Pot + escrow; LLM tokens **BYO** | Pool with sandbox + reproducible logs | Mechanical gates preferred; N-of-M on blocking canaries |
| **Promote / soak evidence jobs** | Pot (capacity-capped at phase 3) | Job-scoped or pool soak capacity | See [03b](./03b-unstable-to-stable.md); core still signs tips |
| **Shelf CDN for `stable`** | Pot (tiny core pointer) | **Volunteer mirrors** (checksummed URLs) | Preserve official pointer under soft cap |
| **Heavy engine runners (Unity/Unreal)** | **Directed sponsor** | **Self-hosted** / pool with licenses on donor side | Not default pot drain |
| **Ops incidents** | Volunteer pool; pot may fund tooling only | N/A (humans + runbooks) | No private retainer crown without ledger |
| **DNS, signing, abuse mailbox** | **Tiny always-on core** (pot / fiscal host) | **Never** donated as sole control | Secrets stay core-only |

---

## Engine cost dials

Same forge spine; **runners and budgets differ** ([engines.md](../engines.md)).

| Engine class | Org pot posture | Caps / funding |
| --- | --- | --- |
| **Web** (Phaser/Svelte/etc.) | **Cheap default** — first-class pot eligibility | Lowest `org_ci_multiplier`; generous fair-use relative to heavier stacks |
| **Godot** | First-class FOSS; **higher caps** (export matrix, larger artifacts) | Pot-eligible with tighter soft/hard minutes; directed top-ups welcome |
| **Unity / Unreal** (later) | **Not default pot** | Need **directed infra funding** and/or **self-hosted** licensed runners; open-game/closed-engine badge honesty still required |

Do not invent a second governance crown per engine. Cost policy is YAML + this doc—not a private Unity lane.

---

## Transparency dashboard + monthly forum notes

### Dashboard (public)

Minimum sunshine surfaces (raw export alongside any UI):

- Pot balance / burn rate by **cost surface**  
- Soft/hard cap proximity  
- Rate-limit and deferral counters (pseudonymous)  
- Sponsor inflows (commons vs directed earmarks)  
- Engine-class spend split  
- Grief → pot slash totals (link [04](./04-sybil-grief.md) ledger)
- Donated capacity offered / consumed; N-of-M attestation agreement rates; quarantined donors (public)

Unpublished priority that changes who gets compute is **invalid**. Prefer boring meters over gamified “trust scores.”

### Monthly forum infra notes

Each month (or budget window), post a short **forum infra note**:

- Burn vs caps; what was deferred  
- Sponsor + **infra donor** thanks (OK perks only; no governance gifts)  
- Upcoming dial changes (notice before effective window)  
- Mirror / self-host / donated-pool call-outs if soft cap hit  
- Link to raw ledger export

Silence during sustained soft-cap breach is a process bug.

---

## Boot vs scale dials

Bootstrap cheap and strict; widen capacity when ledgers and appeals work—not when a sponsor demands a private lane.

| Dial | Boot / early (phases 0–1) | Scale (phases 2–4) |
| --- | --- | --- |
| Org runners | Minimal / manual; BYO-first | Pot-funded pools + labeled self-hosted |
| Donated compute | Local-first + optional BYO runners; no standing pool required | Job-scoped gifts + sandboxed pool with N-of-M; volunteer mirrors |
| Caps | Low hard caps; soft ≈ hard | Soft warn band; hard as backstop |
| Fair-use per identity | Strict concurrent jobs | Higher but load-aware; still public |
| Cache / reuse | Required from day one | Shared caches + artifact dedupe |
| Sponsors | Optional; ledger even if tiny | Open Collective–style + directed engine packs |
| Ads / paywalled stable | **Forbidden** | **Forbidden** |
| Web vs Godot | Both welcome; Godot fewer parallel org slots | Godot caps rise with directed + pot growth |
| Unity / Unreal | Out of default catalog | Directed or self-hosted only |
| Dashboard | Manual ledger OK | First-class dashboard + monthly notes |
| Stable play under pressure | Protect `stable` CDN / rollback first | Same; defer races before ship-train breakage |
| Abuse response | Public issue + rate limit | Runbook + sunshine; still no shadowban crown |

**Order of operations:** BYO local + tiny pot + public caps → fair-use + cache → donated runners/mirrors → sponsors/directed engine packs → richer dashboard. Do not invert for hype or for a closed billing vendor that hides ledgers.

---

## Abuse response (public-process-first)

Infra abuse (spam targets, malicious deps burning CI, artifact bombs) is handled with **sunshine**, not secret admin delete:

1. **Rate limit / defer** with public counter and reason.  
2. **Issue template** for abuse; evidence in-repo or linked logs.  
3. **Narrow safety path** aligns with [04](./04-sybil-grief.md) veto class (malware, illegal, license sabotage, harassment)—written, appealable.  
4. **Dependency / forbidden-path** hits fail closed in CI; false-positive appeal follows [06-security-supply-chain.md](./06-security-supply-chain.md)—still public.  
5. **No silent account erasure** that wipes ledger rows needed for audit.

Detailed malware runbooks may deepen later; shape here is required: **public process first**.

---

## What we deliberately avoid

- **Toll to play** — payment to download, launch, or stay on `stable`.  
- **“BYO keys means free org”** myth — ignore CI/CDN/runners in planning.  
- **Ads** as primary pot funding.  
- **Paywalled stable / pay-to-promote / pay-to-skip gates.**  
- **Selling votes** or judge weight.  
- **Hidden quotas / shadowbans** that gate compute without ledger.  
- **Sponsor design authority** — money funds runners, not DESIGN.md.  
- **Founder-pocketed pot** with no sunshine.  
- **Draining commons pot for Unity/Unreal by default** — directed or self-hosted.  
- **Cutting Shelf `stable` before deferring speculative races** under soft pressure (when avoidable).  
- **Cache-hostile harness** that rebuilds the world every parallel attempt.  
- **Private Discord as the real budget authority.**
- **Single-donor merge gates** — no sole attestation from one volunteer machine.
- **Shipping secrets to random donors** — signing/deploy keys stay on the tiny core.
- **Donated compute as governance perk** — thanks + infra-rep only; never DESIGN/vote/judge weight.
- **Mirror-as-authority** — volunteer mirrors copy checksummed bytes; they do not mint official tips.

Forks may tune numbers; the fossarcade org harness stays on this contract unless this doc is amended in public.

---

## Patching this doc

Infra cost rules change who can burn commons compute and whether play stays free. Edits are **slow lane**: PR, rationale, impact on open budget windows / in-flight directed sponsors, merge. Quietly granting a sponsor a priority lane mid-season is itself an attack—treat it that way.

## Related

- [Sybil, grief funding & sock attempts](./04-sybil-grief.md) (grief → pot, rate limits, ledgers)
- [Engines & play stacks](../engines.md) (runners and budgets)
- [Unstable → stable promotion](./03b-unstable-to-stable.md) (promote capacity caps)
- [Player & ship path](./03-player-ship-path.md)
- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Security & supply chain](./06-security-supply-chain.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
