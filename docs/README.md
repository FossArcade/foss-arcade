# Foss Arcade docs

**Foss Arcade** is a mass-adoption FOSS game forge: a public forum plus a token harness where anyone can propose, fund, race, and merge improvements into open games—no single crown, no closed process, no kings. Specs live in-repo; attempts run in parallel; winners earn merge by passing mechanical gates and public judgment. The org (`fossarcade`) is a separate identity from any one maintainer or studio.

These docs are **living**. They describe the intended model, governance, and judge harness as we bootstrap. Canonical home: [github.com/FossArcade](https://github.com/FossArcade) (org) / [foss-arcade](https://github.com/FossArcade/foss-arcade) (this repo).

## Index

| Doc | What it covers |
| --- | --- |
| [OVERVIEW.md](./OVERVIEW.md) | Mass-adoption model: forum + harness, pools, races, seasons, Arcade Shelf, phases 0–4 |
| [games/snake.md](./games/snake.md) | First game (Foss Snake): design index, harness prover, example races |
| [engines.md](./engines.md) | Engine-agnostic manifests; v1 web + Godot; Unity/Unreal later |
| [governance/01-design-authority.md](./governance/01-design-authority.md) | Design authority, DESIGN.md + ADR law, block rights, fork-out |
| [governance/lineage-and-shelf.md](./governance/lineage-and-shelf.md) | Games / channels / variants, Arcade Shelf launcher, targets |
| [governance/02-judge-anti-gaming.md](./governance/02-judge-anti-gaming.md) | Judge anti-gaming: threats, defense layers, ties, v1 dials |
| [governance/03-player-ship-path.md](./governance/03-player-ship-path.md) | Player & ship path: merge vs ship trains, channels, playtest, Shelf front door |
| [governance/03b-unstable-to-stable.md](./governance/03b-unstable-to-stable.md) | Unstable → stable promotion at phase-3 scale (FOSS, no silent admin ship) |
| [governance/04-sybil-grief.md](./governance/04-sybil-grief.md) | Sybil + grief funding: soft identity, escrow/bonds, attempt caps, sunshine ledgers |
| [governance/05-infra-cost.md](./governance/05-infra-cost.md) | Infra cost & abuse: no toll to play, commons pot, donated compute / mirrors, budgets/caps, engine dials, sunshine |
| [governance/06-security-supply-chain.md](./governance/06-security-supply-chain.md) | Security & supply chain: path/dep allowlists, SBOM, sandbox/N-of-M, Shelf checksums, incident process, player surface |
| [governance/07-legal-ip.md](./governance/07-legal-ip.md) | Legal & IP: not legal advice; inbound=outbound, DCO (not founder CLA), default licenses, AI disclosure, provenance, trademark light |
| [governance/08-credit-economy.md](./governance/08-credit-economy.md) | Credit economy: useful work not victory alone; split ledgers; loser dignity; anti-gaming; exportable JSON |
| [governance/09-dispute-capture.md](./governance/09-dispute-capture.md) | Dispute, capture & succession: dispute layers, maintainer rotation, quiet-root honesty, forced-fork norms |
| [governance/10-cold-start.md](./governance/10-cold-start.md) | Cold-start dials 3→30→300: Seed/Village/Town/City; publish stage; Snake exception; what not to turn on early |
| [governance/11-game-lifecycle.md](./governance/11-game-lifecycle.md) | Game lifecycle: incubate → active → archive/sunset; caps; fork-out; never delete history |
| [governance/content-policy.md](./governance/content-policy.md) | Official content policy: all-ages official surfaces; illegal hard ban; forks OK elsewhere; active Snake era |
| [../CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community Code of Conduct (people behavior); stub: [governance/CODE_OF_CONDUCT.md](./governance/CODE_OF_CONDUCT.md) |
| [governance/GAPS.md](./governance/GAPS.md) | Remaining planning gaps (TODO checklist) |
| [ALIGN.md](./ALIGN.md) | Alignment notes (2026-09-06): naming / URLs / dual-trust / reddit status |
| [governance/reddit-formats.md](./governance/reddit-formats.md) | **DRAFT / LATER** — Reddit tags & proposal formats ([r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) live; process not yet promoted) |
| [harness/target.schema.md](./harness/target.schema.md) | Minimal harness target YAML schema (`games/<game>/targets/`) |
| [design/shopfront-deepen-snake-community.md](./design/shopfront-deepen-snake-community.md) | Shopfront deepen: tile/game-page schema + Snake Community IA (ForumPort-facing) |
| [shopfront/community-forum.md](./shopfront/community-forum.md) | Snake Seed Community: ForumPort, GitHub Discussions first port, brief export, swap-via-meta |
| [shopfront/discussion-seed.md](./shopfront/discussion-seed.md) | Ops checklist: enable Discussions, create categories, confirm pipeline labels |
| [walkthroughs/implement-snake-target.md](./walkthroughs/implement-snake-target.md) | Human walkthrough: implement a Snake target end-to-end |
| [reddit/](./reddit/) | Ops kit: [SETUP.md](./reddit/SETUP.md) checklist, flairs, Automoderator, templates, welcome/about copy (paste-ready; sub [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) live) |

## How to use these docs

- Treat **DESIGN.md** and **adr/** inside each game as law for that game (see design authority).
- Treat **Foss Snake** (`games/snake/`) as the phase-0 pilot / harness prover—design + `game.yaml` plus a playable vanilla-JS stub; first race targets still follow.
- Treat the **judge anti-gaming** doc as the contract for how races are scored—mechanical first, LLM last.
- Treat the **player & ship path** doc as the contract for how builds reach players—merge ≠ ship.
- Treat **engines** as the contract for stack choice: same pool/judge/Shelf; runners and budgets differ.
- Treat **unstable → stable** as the contract for promote targets, soak, and phase-3 dials.
- Treat **sybil / grief** as the contract for vote/fund/attempt anti-abuse—cost of faking influence, no KYC, sunshine ledgers.
- Treat **infra cost** as the contract for commons compute—no toll to play, public ledger, shared pot, donated compute unload, rate limits over hidden control.
- Treat **security & supply chain** as the contract for hostile attempts—in-repo allowlists, SBOM, sandbox/N-of-M, checksummed Shelf, sunshine incidents.
- Treat **legal & IP** as the contract for licenses, DCO, AI disclosure, and provenance—not legal advice; inbound=outbound; license ≠ security.
- Treat **credit economy** as the contract for contribution credit, infra-rep, and Hall/CREDITS—useful work not victory alone; losers keep dignity; exportable ledgers; spend ≠ rank.
- Treat **content policy** as the contract for **all-ages official surfaces**—see [content-policy.md](./governance/content-policy.md); illegal hard ban; forks elsewhere welcome but not official.
- Treat the **Code of Conduct** as the contract for people behavior in official spaces—not game content; no private kingmaking; appeals via dispute process.
- Treat **dispute / capture** as the contract for succession and escalation—no irreplaceable kings; public process; fork escape; quiet-root honesty.
- Treat **cold-start dials** as the contract for Seed→City intensity—same constitution, publish the stage; Snake exception does not inherit forever.
- Treat **game lifecycle** as the contract for incubate/archive/sunset—caps, graduation evidence, Shelf badges; never delete git history for optics.
- Propose doc changes like any other FOSS change: PR, public review, merge. Rubric and governance edits are **slow lane**.

## Tone

Open. Forkable. Public process. Sunshine over secret sauce. If a rule cannot be audited, it does not belong here.

---

*Docs bootstrap for Foss Arcade. Patch freely; cite reasons.*
