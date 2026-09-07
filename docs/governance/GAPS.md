# Governance & planning gaps (TODO)

Living checklist of what is **not yet specified** enough to implement or open to strangers. Items are FOSS-spirited: prefer public ADRs over private decisions when closing a gap.

Mark progress in PRs; do not delete a gap until there is a linked ADR or shipped doc section.

---

## Priority / numbered leftovers (planning 3–6+)

### DONE (premise) — First game: Foss Snake

**Premise closed** under [`games/snake/`](../../games/snake/) + [`docs/games/snake.md`](../games/snake.md):

- [x] `DESIGN.md` constitution (pillars, loop, controls, mods, determinism, variants pointer)
- [x] `game.yaml` sketch (slug, web engine, `unstable`/`stable`, tiny `max_active_jobs`, soak placeholders, `parent: null`)
- [x] Docs index + README; `targets/.gitkeep`
- [x] Playable stub (vanilla JS under games/snake/; not a shipped stable build)
- [ ] Full game / richer content beyond the stub
- [ ] Open first race targets under `games/snake/targets/`
- [ ] CI / headless replay harness wired to snake

Playable stub is in-tree; first races remain **open**. Do not mark the pilot “shipped `stable`” from the stub alone.

### DONE — 3. Player / ship path

Closed in [03-player-ship-path.md](./03-player-ship-path.md): merge ≠ ship, two trains, channels as releases (`promote-channel` + playtest/regress/perf/migration), playable v1 offline-first (**web + Godot** stacks—see [engines.md](../engines.md)), Shelf as player front door, save/compat/rollback in `game.yaml`, feature flags, boot dials / avoid list. Channel tip train renamed to **`unstable`** (was nightly).

### DONE — 3b. Unstable → stable promotion

Closed in [03b-unstable-to-stable.md](./03b-unstable-to-stable.md): soak + metrics thresholds, anyone-opens `promote-channel`, mechanical gates, promote races, public judge/scorecard, L2/L3 for save/economy breaks, Shelf pointer + rollback + forum changelog, phase-3 capacity caps, no silent admin promote, auto-stable trust dial default off, boot vs phase-3 dials table.

Residual (optional follow-ups, not blocking these gaps):

- [ ] Crash/telemetry policy detail (opt-in, no dark patterns)—mentioned as FOSS-compatible intent; full schema still open under Security / community as needed.
- [ ] Exact numeric soak / playtest threshold defaults (per-game `game.yaml` schemas beyond illustrative fields).

### DONE — 4. Sybil / identity / collusion

Closed in [04-sybil-grief.md](./04-sybil-grief.md): problem/principle (cost of faking influence, no KYC, sunshine, fork escape); attack split (sybil votes / grief funding / sock attempts); voting (template gate, soft roots, quadratic batches, new-account ramp, narrow safety veto); funding (min escrow, slashable grief bond → commons infra pot, rate limits, challengeable sock-cluster heuristics); attempt caps; earned exportable reputation; sunshine ledgers; boot vs scale dials; avoid list. Funding stays score-blind (see also [02-judge-anti-gaming.md](./02-judge-anti-gaming.md)).

### DONE — 5. Infra cost & abuse

Closed in [05-infra-cost.md](./05-infra-cost.md): problem (BYO inference ≠ CI/CDN/runners); principles (no toll to play, public ledger, shared pot, rate limits over hidden control, self-hosted escape); cost surfaces table; money in (commons pot, directed infra sponsors, self-hosted—**not** ads/paywalled stable/selling votes; OK vs not-OK perks); money out (`budgets.yaml` sketch, soft/hard caps, stable-play preservation, mirror/self-host); who-burns-what; engine dials (web cheap, Godot higher, Unity/Unreal directed or self-hosted); transparency dashboard + monthly forum infra notes; boot vs scale; abuse response shape; avoid list.

### DONE — 6. Security & supply chain

Closed in [06-security-supply-chain.md](./06-security-supply-chain.md): problem/principle (hostile attempts, in-repo policy, reproducibility, untrusted donated compute, sunshine; license is not security); layers (path allowlists / forbidden-path diffs, dependency allowlist + SBOM, secret hygiene + FP appeal, sandbox/egress, N-of-M attestation, pinned/signed harness + Shelf checksums, prompt/tool injection ties to [02](./02-judge-anti-gaming.md), SECURITY.md / coordinated disclosure, player surface—unsigned overlays, sideload warn, mods opt-in); FOSS-shaped choices (coordinated disclosure, Shelf verified baseline); boot vs scale dials; avoid list; cross-links to donated compute in [05](./05-infra-cost.md).

Residual (optional follow-ups, not blocking this gap):

- [ ] Exact per-ecosystem allowlist file schemas checked into harness (process is specified; concrete YAML pins still open).
- [x] Root `SECURITY.md` stub (coordinated disclosure; forge advisory path).
- [ ] Crash/telemetry schema detail (also noted under 3b)—opt-in, no dark patterns.

**Planning spikes 3, 3b, 4, 5, 6, 7, 8, 9, 10, 11 (+ engines path) are complete** (7 = legal/IP defaults; **CoC DONE**; 8 = credit economy; 9 = dispute/capture; 10 = cold-start; 11 = lifecycle). **Official content policy is DONE** ([content-policy.md](./content-policy.md); active Snake era). **Code of Conduct is DONE** ([`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md); stub [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)). **First-game premise (Foss Snake) is DONE;** playable stub landed; first race targets still open. Remaining planning work is the unchecked boxes under **Other known gaps** below—plus residual optional follow-ups noted under 3b, 6, 8, and Legal / community (trademark dedicated note). Practical next: harness/schema pins, first Snake race targets, token economics, trademark dedicated note.

---

### DONE — 7. Legal / IP

Closed in [07-legal-ip.md](./07-legal-ip.md): **not legal advice** disclaimer; principles (inbound=outbound, DCO not founder copyright-assignment CLA, engines≠game IP, AI tool not author, fork sacred); default license table (harness Apache-2.0, game code MIT with Apache-2.0 alt, assets CC0 or CC-BY-4.0, docs CC-BY-4.0; no dual-license fog; Snake under stack day one); DCO + AI disclosure + losing attempts same license + clean salvage; third-party provenance, model memorization honesty, Unity/Unreal EULA note; trademark light / hold for org; AS IS, no accounts v1, multiplayer later, security cross-link; under-18 / platform ToS; boot checklist; avoid list.

Residual (not closed by #7):

- [x] CoC + enforcement that does not become private kingmaking — **DONE** in root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) (stub [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)); appeals / multi-confirm via [09](./09-dispute-capture.md); [07](./07-legal-ip.md) points at CoC (not a substitute).
- [ ] Dedicated trademark / name-use note for “Foss Arcade” and Shelf branding (light hold described in [07](./07-legal-ip.md); formal policy still later).

### DONE — Content policy (official surfaces)

Closed in [content-policy.md](./content-policy.md): not-legal-advice banner; license freedom ≠ distribution obligation / venue stewardship; scope = official org, Shelf list/verified, org incubation, merges into org `games/`; all-ages / no pornographic or sexual content (defined; anime style OK when not pornographic; mild fantasy violence OK; conservative fade-to-black for v1); hard ban on illegal content (CSAM etc.) with no meta override; enforcement (refuse incubation/Shelf/PRs, public reasons, appeal); safety veto extended in [04](./04-sybil-grief.md); forks elsewhere allowed without harassment; `[meta]` slow-lane amend + adult sibling as intentional separate outcome; **boot active day one (Snake era)**.

- [x] Official content policy for org / Shelf / incubation / org `games/` — [content-policy.md](./content-policy.md).

### DONE — Code of Conduct (people behavior)

Closed in root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) (governance stub [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)): short FOSS-spirited CoC; purpose = usable contributing/playing spaces; scope = GitHub org + official Reddit/Discord/Shelf comments if any (not the whole internet); expected respect / good faith / no harassment-doxxing-threats-hate / no endless sealioning; **CoC ≠ content policy** cross-link; reporting (public issue or SECURITY-style private placeholder; no mob pile-ons); enforcement ladder warning → temp ban → permanent ban; public summary without drama doxxing; multi-maintainer serious actions + appeals via [09](./09-dispute-capture.md); no private kingmaking / logged reasons; applies to maintainers; not a substitute for law; Contributor Covenant spirit, project-specific short text.

- [x] CoC + enforcement without private kingmaking — [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md).

### DONE — 8. Credit economy

Closed in [08-credit-economy.md](./08-credit-economy.md): problem (winner-only fame, races→most lose, spend-to-rank); principle (credit for useful work not victory/burn; public exportable); earning table (serious attempt, merge, spec, playtest, accurate flags, infra-rep separate, design ADR); what does not earn; split ledgers (contribution credit with **two scopes**—general + per-game—vs infra-rep vs human CREDITS/Hall including non-winning serious attempters); **dual trust** (game-based vs general soft powers, hard caps / diminishing returns / quorum so specialists cannot capture); loser dignity (superseded keeps credit, public scorecards, salvage dual credit, season recaps); anti-gaming (serious-attempt bar, diminishing returns, no skip gates, exportable JSON); boot dials vs later automation; avoid list; cross-links to [02](./02-judge-anti-gaming.md), [04](./04-sybil-grief.md), [05](./05-infra-cost.md), [07](./07-legal-ip.md), [01](./01-design-authority.md), [09](./09-dispute-capture.md).

Residual (optional follow-ups, not blocking this gap):

- [ ] Exact credit-event point weights / diminishing-return curves in harness schema (contract is specified; numbers still open). **Follow-up:** dual-trust caps (general vs per-game soft-weight ceilings, max % of a decision’s weight pool, quorum N) as schema dials — contract in [08](./08-credit-economy.md#dual-trust-game-based-vs-general); Seed→City numbers still open.
- [ ] Stable export schema semver + fork import notes (stub → stable per boot dials).
- [ ] Hall / CREDITS generation pipeline (season draft from ledger + human edit window).

### DONE — 9. Dispute / capture / succession

Closed in [09-dispute-capture.md](./09-dispute-capture.md): problem (thin appeals insufficient; captured maintainers, dead founders, toxic leads); principles (no irreplaceable kings, public process, fork escape, org steward ≠ owner-of-souls); dispute layers (target/attempt → design block → maintainer conduct/capture → org constitutional crisis); game maintainer succession (credit thresholds, public nomination, idle timeout, emergency removal with multi-confirm + public log); quiet-root honesty (publish who holds root without doxxing; backup steward / recovery plan); forced-fork norms (split-to-variant vs leave org; Shelf related forks; no harassment); capture resistance (no private Discord as truth; sunshine; safety/content veto ≠ taste; `[meta]` high bar); boot vs scale dials; avoid list.

Residual (optional):

- [ ] Exact idle-timeout N and multi-confirm counts in harness/org config (contract specified; numbers open).
- [x] CoC enforcement that does not become private kingmaking — **DONE** in [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md); [09](./09-dispute-capture.md) remains the appeals / multi-confirm process companion.

### DONE — 10. Cold-start dials

Closed in [10-cold-start.md](./10-cold-start.md): problem (City rules at Seed / vibes-only stages); principle (same constitution, dials down, publish stage); Seed/Village/Town/City table (`max_active_jobs`, attempts, vote, funding, CI, judge, promote, credit, sybil); Snake bootstrap exception logged—next newGame needs votes when leaving Seed; explicit advance triggers; what not to turn on early (donated pool before attestation, auto-promote, shared inference arbiter); avoid list.

Residual (optional):

- [ ] Concrete stage file / `game.yaml` stage field schema checked into harness.
- [ ] Bootstrap exception log format (also noted under Design authority ops).

### DONE — 11. Game lifecycle

Closed in [11-game-lifecycle.md](./11-game-lifecycle.md): states (proposed → incubating → active → season-freeze → archived → optional forked-out); incubation caps + graduation gates (playable slice, harness, content policy, licenses); archive (targets closed, artifacts stay playable, Shelf badge); sunset (dim default browse, keep manifests/history, never delete git history); fork-out encouraged; staggered seasons pointer to [03b](./03b-unstable-to-stable.md) / OVERVIEW; who can archive (slow `[meta]` or maintainer+notice); boot (only Snake active; incubation empty); avoid list.

Residual (optional):

- [ ] Exact max-incubating dial numbers per stage in org config.
- [ ] Shelf archive/sunset badge UX copy (ties Lineage & Shelf residuals).

---

## Other known gaps

### Big remaining planning gaps (priority)

The former priority trio (**dispute/capture**, **cold-start**, **lifecycle**) is **DONE** (spikes 9–11). **CoC is DONE.** Largest remaining shapes are mostly **implementation / schema / ops** rather than missing constitution—plus token economics and the trademark dedicated note. Prefer ADRs / dedicated docs when closing—do not bury in chat.

Practical next (often listed elsewhere as residuals):

- [ ] Harness / allowlist / credit / stage **schemas** pinned in-repo (process docs exist; YAML pins open under 3b, 6, 8, 10).
- [x] Foss Snake **playable stub** ([games/snake.md](../games/snake.md)).
- [ ] First `targets/` + CI/replay wiring.
- [x] Root **LICENSE** / **SECURITY.md** stubs ([07](./07-legal-ip.md), [06](./06-security-supply-chain.md)).
- [x] **CoC + enforcement** without private kingmaking — [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md).
- [ ] Token meaning / refund / cross-game treasuries (below).

### Tokens / funding economics

Contribution **credit** / Hall / infra-rep split is **DONE** in [08-credit-economy.md](./08-credit-economy.md) (spend ≠ rank). Remaining:

- [ ] Token meaning at v1 (play-money, real, or hybrid) and failure modes.
- [ ] Refund / void race rules when gates or canaries invalidate a winner.
- [ ] Cross-game funding vs per-game treasuries.

### Judge & rubric ops

- [ ] Exact default weight table checked into harness (numbers, not only narrative).
- [ ] Canary corpus ownership and contribution guide.
- [ ] Model allowlist / pin policy for LLM assist (BYO keys vs recommended pins).
- [ ] Scorecard schema versioning and Shelf/forum display.

### Design authority ops

- [ ] Bootstrap exception log format for phase-0 CODEOWNERS without ADRs yet.
- [ ] Formal Medium+ size heuristic (LOC? systems touched? checklist?).
- [ ] Appeal SLA and panel rotation without recreating a CD — layer shape in [09](./09-dispute-capture.md); exact SLA still open.

### Lineage & Arcade Shelf

- [ ] Manifest schema (install URLs, checksums, optional signatures).
- [ ] Sideload trust UX (warn without DRM).
- [ ] Variant discovery and “related titles” UI rules.
- [ ] `split-to-variant` job automation vs manual PR template.
- [ ] Mirroring / federation: how third-party forges appear in Shelf.

### Security & supply chain

Closed as **DONE — 6** in [06-security-supply-chain.md](./06-security-supply-chain.md). Checklist items below marked done; residuals stay under DONE — 6 above.

- [x] Dependency allowlist process per language/ecosystem — [06](./06-security-supply-chain.md).
- [x] Forbidden-path lists per monorepo layout — [06](./06-security-supply-chain.md).
- [x] Secret-scan false-positive appeal path — [06](./06-security-supply-chain.md).
- [x] Reproducible builds goal (phase target) — [06](./06-security-supply-chain.md) (boot vs scale + checksum/SBOM honesty bar).

### Legal / community

Defaults / DCO / provenance / light trademark hold closed as **DONE — 7** in [07-legal-ip.md](./07-legal-ip.md). **CoC is DONE** (root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md)). Checklist items below marked where applicable; formal mark policy remains residual under DONE — 7 above.

- [x] Default license set for games, assets, and harness — [07](./07-legal-ip.md).
- [x] CoC + enforcement that does not become private kingmaking — [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md); [07](./07-legal-ip.md) / [09](./09-dispute-capture.md) cross-linked.
- [x] Trademark / name use for “Foss Arcade” and Shelf branding — light hold / principles in [07](./07-legal-ip.md); dedicated policy still residual under DONE — 7.
- [x] Third-party asset provenance requirements — [07](./07-legal-ip.md).
- [x] Official content policy (all-ages / no porn on official surfaces; illegal hard ban) — [content-policy.md](./content-policy.md).

### Seasons & catalog

- [ ] Season calendar template and freeze rules.
- [ ] Stagger algorithm or manual board for many games.
- [x] Archive / sunset policy for abandoned titles (fork-out encouraged) — [11-game-lifecycle.md](./11-game-lifecycle.md); season calendar / stagger still open above.

### Engines & runners

- [x] v1 stacks = web + Godot; Unity/Unreal later — [engines.md](../engines.md).
- [ ] Per-engine runner image / budget templates checked into harness.
- [ ] Open-game/closed-engine Shelf badge UX copy.

### Docs & onboarding

- [x] First-game premise docs (Foss Snake) — [games/snake.md](../games/snake.md) / [DESIGN.md](../../games/snake/DESIGN.md) (playable stub landed).
- [x] Reddit tags & proposal formats **draft** — [reddit-formats.md](./reddit-formats.md) (deferred until subreddit opens; Snake bootstrap without vote).
- [x] Reddit **ops kit** paste-ready under [`docs/reddit/`](../reddit/) (flairs, Automoderator YAML, templates, [SETUP.md](../reddit/SETUP.md)) — sub still not live; status remains DRAFT until create.
- [ ] Reddit sub create + bot wiring beyond Automod / exact sub name live (human checklist: [SETUP.md](../reddit/SETUP.md)).
- [ ] Contributor quickstart (human + agent).
- [ ] “How to open a race” checklist for maintainers.
- [ ] Public dashboard mock for races, scorecards, and appeals.

---

## How to close a gap

1. Open an issue referencing this checklist item.
2. Land an ADR or docs PR (slow lane if it affects judge/rubric/DESIGN authority).
3. Check the box here with a link in the same PR.
4. If the gap is rejected as out of scope, note **wontfix** + reason—do not silently drop it.

---

*Last bootstrap: spikes 3–11 closed (7 = legal/IP; **CoC DONE**; 8 = credit economy; 9 = dispute/capture; 10 = cold-start; 11 = lifecycle); official **content policy** landed ([content-policy.md](./content-policy.md)); **Code of Conduct** landed ([`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md)); Foss Snake first-game **premise** landed (`games/snake/` DESIGN + game.yaml + docs). Big planning trio closed. Practical next: schemas, first Snake race targets, token economics, trademark dedicated note, Reddit sub via [SETUP.md](../reddit/SETUP.md). Alignment skim: [ALIGN.md](../ALIGN.md). Treat every unchecked box as an invitation to patch, not as a secret backlog.*
