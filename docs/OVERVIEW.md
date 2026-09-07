# Foss Arcade — mass-adoption model overview

Foss Arcade is an open forge for FOSS games: a **forum** for proposals and debate, plus a **token harness** that turns funded work into parallel, judged attempts. Authority sits in public specs and merge process—not in a Creative Director, private Discord, or single maintainer crown.

## Core shape

### Forum + token harness

- **Forum** (issues, RFCs, ADRs, season boards, and official Reddit [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)): where problems, pillars, and funding targets are proposed and accepted.
- **Token harness**: contributors stake or fund work against accepted targets; the harness opens **races** (parallel attempts), runs gates, and records public judgments.

Tokens are a coordination and funding signal, not a substitute for code review or DESIGN.md. Economics can evolve; process must stay public.

### Active pool, not single crown

There is no permanent “project king.” Maintainership is an **active pool**: people who merge ADRs, keep CI green, and steward seasons. Designers and codeowners earn rights through merged work. Anyone can fork out if the pool drifts.

### Vote / fund split

- **Vote** (or equivalent public signal): which targets and seasons are worth opening.
- **Fund**: which attempts get token backing and harness compute.

Voting alone does not buy merge. Funding alone does not waive acceptance tests. Both feed the same public board.

Anti-sybil and grief defenses keep those signals costly to fake **without KYC**: soft identity roots, escrow and slashable grief bonds (burned to commons infra), attempt caps, and sunshine ledgers. See [04-sybil-grief.md](./governance/04-sybil-grief.md).

### Parallel attempts (races) + AI judge

For an open target, multiple agents or humans may submit attempts in parallel. The harness:

1. Runs mechanical gates (CI, schema, secrets, SBOM, size budgets).
2. Runs executable acceptance tests (hard gates).
3. Scores remaining candidates with a **public, versioned rubric** (LLM assist is a capped minority weight—see [02-judge-anti-gaming.md](./governance/02-judge-anti-gaming.md)).

Winner selection is reproducible enough to audit. Ties break by smaller diff → stronger tests → earlier complete submission.

### Tiered merge

Not every merge is equal:

| Tier | Typical path | Extra scrutiny |
| --- | --- | --- |
| L0 | Docs / typo / config that cannot break play | CI + human or light check |
| L1 | Small safe code / tests aligned to DESIGN | CI + AC + simple rubric |
| L2 | Feature / balance / content | Full gates + multi-signal score; optional panel |
| L3 | Pillar-touching or cross-variant | Spec first + panel / canary emphasis |

Medium+ work requires an **accepted spec** before code attempts (see design authority).

### Staggered per-game seasons

Each game runs its own **season** calendar: open targets, race windows, merge freezes, and cool-downs. Seasons are staggered across the catalog so the org and judge harness are not overloaded by every title peaking at once.

### fossarcade org — separate identity

The **FossArcade** GitHub org (`fossarcade` brand; URLs use [github.com/FossArcade](https://github.com/FossArcade)) is a distinct public identity: repos, bots, harness configs, and Arcade Shelf manifests live there. Individual studios, agents, or maintainers may contribute; they do not *own* the org narrative. Forks and mirrors are expected and welcomed.

### BYO keys at v1

v1 assumes **bring your own keys** for LLM judge assist, agent attempts, and optional paid compute. The harness coordinates; it does not centralize secret model APIs as sole authority. Closed proprietary judge-as-sole-arbiter is explicitly out of scope.

### Infra cost (commons compute)

BYO inference does **not** erase org cost: CI, artifacts, judge/canary runners, ops, and bots still need a **commons pot**, public budgets/caps, and rate limits—**no toll to play**, no paywalled `stable`, no selling votes. Web stays cheap on the pot; Godot higher caps; Unity/Unreal need directed funding or self-hosted runners. **Unload burn** via local-first, BYO runners, job-scoped gifts, sandboxed donated pools (N-of-M attestation), and volunteer mirrors—donors get thanks + infra-rep, not governance. See [05-infra-cost.md](./governance/05-infra-cost.md).

### Security & supply chain

Attempts, donated runners, and Shelf installs are **hostile by default**. Policy lives in-repo: path/dependency allowlists, SBOM, secret hygiene, sandbox/egress, N-of-M attestation for donated compute, pinned harness + Shelf checksums, and a public SECURITY.md process—license checks do not replace supply-chain gates. Sideload stays free with warnings; mods are opt-in. See [06-security-supply-chain.md](./governance/06-security-supply-chain.md) (ties to [02](./governance/02-judge-anti-gaming.md) and [05](./governance/05-infra-cost.md)).

### Legal & IP

**Not legal advice.** Org defaults: inbound=outbound, **DCO** (not copyright-assignment CLA to a founder), harness Apache-2.0 / game code MIT (Apache-2.0 alt) / assets CC0 or CC-BY-4.0 / docs CC-BY-4.0, AI disclosure, third-party provenance, engines ≠ game IP, fork sacred. Trademark stays light until a dedicated note. Community conduct: see root [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md). See [07-legal-ip.md](./governance/07-legal-ip.md).

### Credit economy

Races mint **one merge winner** and many serious attempts. Credit accrues for **useful work**—serious attempts, merges, specs, playtests, accurate flags, design ADRs—not victory alone and not spend. Split ledgers keep contribution credit, infra-rep, and human CREDITS/Hall apart; non-winning serious attempters belong in Hall recaps. Soft powers use **dual trust** (per-game vs general) with caps so specialists cannot capture a title. See [08-credit-economy.md](./governance/08-credit-economy.md).

### Official content policy

Official fossarcade org surfaces, Shelf listing/verified badge, and org-hosted incubation are an **all-ages** venue. Full rules (and what is / isn't in scope): [content-policy.md](./governance/content-policy.md).

### Code of Conduct

Official community spaces (org issues/PRs/discussions, official Reddit/Discord if any, Shelf comments if any) stay usable for contributing and playing together: respect, good faith, no harassment/doxxing/threats/hate, no endless sealioning. **CoC ≠ content policy**—people behavior vs game content. Enforcement: warning → temp ban → permanent ban; logged reasons; multi-maintainer for serious actions; appeals via [09](./governance/09-dispute-capture.md). Canonical: [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md).

### Dispute, capture & succession

Thin race appeals are not enough. Maintainer succession, emergency removal, quiet-root honesty, and forced-fork norms keep **no irreplaceable kings**—public process, fork escape, org steward ≠ owner-of-souls. See [09-dispute-capture.md](./governance/09-dispute-capture.md).

### Cold-start dials

Rules for thousands overkill three people. **Same constitution; dials turned down.** Publish Seed / Village / Town / City; advance on triggers not vibes; Snake bootstrap is a logged exception—next newGame needs votes when leaving Seed. See [10-cold-start.md](./governance/10-cold-start.md).

### Game lifecycle

Titles move **proposed → incubating → active → season-freeze → archived → (optional) forked-out**. Incubation caps; graduation on playable evidence + policy + licenses; archive keeps playable artifacts; sunset dims default Shelf browse; **never delete git history** for optics. See [11-game-lifecycle.md](./governance/11-game-lifecycle.md).

### Arcade Shelf

A Steam/Epic-like **FOSS launcher**: no DRM, open manifests, sideload-friendly. Players browse games and variants, switch channels/mods, and install from public manifests. See [lineage-and-shelf.md](./governance/lineage-and-shelf.md).

### Player & ship

**Merge ≠ ship.** The merge train accepts code; the ship train promotes builds onto player channels (`unstable`, `stable`, `season-N`) with public evidence and rollback. Shelf is the player front door. See [03-player-ship-path.md](./governance/03-player-ship-path.md) and [03b-unstable-to-stable.md](./governance/03b-unstable-to-stable.md).

### Lineage / variants

Games live under `games/<slug>/` with **channels** (`unstable`, `stable`, `season-N`, …) and **variants** (`variants/<sub-slug>/`) that declare parent metadata. Targets and races are scoped per game or variant; a **split-to-variant** job type forks lineage when a direction should not force the parent.

### Engines (v1 stacks)

**v1 playable stacks are web and Godot**—both first-class FOSS paths (e.g. Phaser/Svelte browser titles and Godot exports). Manifests stay engine-agnostic (`engine` + play method); Unity/Unreal come later behind open-game/closed-engine badges and heavier CI. Same pool, races, judge, channels, and Shelf; runners and budgets differ. See [engines.md](./engines.md).

## First game — Foss Snake

Phase-0 pilot and **harness prover**: slug `snake`, design constitution + manifest sketch under [`games/snake/`](../games/snake/), docs index at [`games/snake.md`](./games/snake.md). Web stack first (Godot optional later). Premise (DESIGN / `game.yaml` / docs) is in-tree plus a **playable vanilla-JS stub**—do not treat that stub as a shipped `stable` build.

## Phases (brief)

| Phase | Focus |
| --- | --- |
| **0 — Bootstrap** | Org skeleton, **first game = Foss Snake** (`games/snake/`: DESIGN.md + `game.yaml` premise), CI templates, docs tree, local/BYO harness stub |
| **1 — Closed races** | Trusted contributors only; hard AC + CI; simple rubric; canary suite before strangers |
| **2 — Public seasons** | Open targets, token/fund board, Arcade Shelf alpha, lineage + variants live |
| **3 — Judge maturity** | Full anti-gaming layers, rubric semver, appeals feeding ADRs, multi-judge on L2+ |
| **4 — Mass adoption** | Many games, staggered seasons, Shelf as default install path, fork-friendly federation notes |

Phases overlap in practice; gates tighten as the pool widens.

## Related

- [Foss Snake (first game)](./games/snake.md)
- [Engines & play stacks](./engines.md)
- [Design authority](./governance/01-design-authority.md)
- [Lineage and Arcade Shelf](./governance/lineage-and-shelf.md)
- [Judge anti-gaming](./governance/02-judge-anti-gaming.md)
- [Player & ship path](./governance/03-player-ship-path.md)
- [Unstable → stable promotion](./governance/03b-unstable-to-stable.md)
- [Sybil, grief funding & sock attempts](./governance/04-sybil-grief.md)
- [Infra cost & abuse](./governance/05-infra-cost.md)
- [Security & supply chain](./governance/06-security-supply-chain.md)
- [Legal & IP](./governance/07-legal-ip.md)
- [Credit economy](./governance/08-credit-economy.md)
- [Official content policy](./governance/content-policy.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md) ([governance stub](./governance/CODE_OF_CONDUCT.md))
- [Dispute, capture & succession](./governance/09-dispute-capture.md)
- [Cold-start dials](./governance/10-cold-start.md)
- [Game lifecycle](./governance/11-game-lifecycle.md)
- [Gaps / TODOs](./governance/GAPS.md)
