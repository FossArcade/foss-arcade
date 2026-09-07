# Legal & IP posture

> **Not legal advice.** This document is a **FOSS-spirited project policy and planning note** for Foss Arcade contributors, reviewers, and forkers. It is **not** a lawyer’s opinion, not counsel to any person or entity, and not a substitute for advice from a qualified attorney in your jurisdiction. Licenses, trademarks, platform Terms of Service, export rules, and consumer law change; when in doubt, get real counsel before relying on anything here. The org may amend this doc in the slow lane; silence is not a warranty.

**Status:** living governance doc  
**Audience:** harness authors, game maintainers, race participants, asset contributors, Shelf operators, reviewers, forkers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **Inbound = outbound.** Copyright assignment to a founder is out of scope. **License is not security** (see [06-security-supply-chain.md](./06-security-supply-chain.md)).

This document is the contract for **default licenses, DCO (not founder CLA), AI disclosure, provenance honesty, trademark lightness, AS IS / accounts posture, and under-18 / platform ToS awareness**—without dual-license fog, proprietary IP theater, or “the model wrote it so nobody owns it” myths.

If a rule here conflicts with a private Discord pin, handshake CLA, or “just ship it, we know the artist”—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: supply-chain and hostile attempts in [06](./06-security-supply-chain.md); engine / Unity–Unreal notes in [engines.md](../engines.md); first-game defaults in [games/snake.md](../games/snake.md); proposal formats later in [reddit-formats.md](./reddit-formats.md).

---

## Principles

1. **Inbound = outbound.**  
   What you contribute under the game / harness / docs / asset defaults is what the commons redistributes. No secret inbound-only license that strands forks. Race attempts that win **and** lose stay under the same outbound terms (see attempts below).

2. **DCO, not copyright-assignment CLA to a founder.**  
   Contributors certify origin and license compatibility via a **Developer Certificate of Origin** (or equivalent public sign-off). We do **not** require assignment of copyright to a named founder, studio, or private holding company. Stewardship sits in the **fossarcade** org process and in-repo law—not in a crown that owns every line.

3. **Engines ≠ game IP.**  
   Using Godot, a browser stack, or (later) Unity/Unreal does **not** make the engine vendor the owner of Foss Arcade game content. Game source, assets, and DESIGN.md stay under the title’s declared licenses. Engine EULAs and store ToS still bind **how** you ship closed-engine builds—see [engines.md](../engines.md) and the Unity/Unreal note below. Badge honesty: open-game / closed-engine when applicable.

4. **AI is a tool, not an author.**  
   Models, agents, and autocomplete do not replace human (or accountable org) responsibility for license, provenance, and originality claims. Submitters disclose AI assistance; they remain the party asserting DCO / license fitness. “The bot wrote it” is not a license escape hatch.

5. **Fork is sacred.**  
   Anyone may fork under the outbound licenses. Fork-out for design drift is a first-class move ([01-design-authority.md](./01-design-authority.md), [lineage-and-shelf.md](./lineage-and-shelf.md)). Trademark and name use are lighter and later—they must **never** be used as a soft DRM against lawful forks of the code and assets.

---

## Default license table

Defaults apply to **new fossarcade org work** unless a game’s `LICENSE` / `game.yaml` / ADR explicitly records a compatible deviation **before** races open. Prefer one clear stack per layer; **avoid dual-license fog** (no “MIT OR proprietary optional for us,” no inbound Apache / outbound mystery).

| Layer | Default | Notes |
| --- | --- | --- |
| **Harness** (forge bots, judge runners, scorecard tooling, org CI templates) | **Apache-2.0** | Patent grant + clarity for infrastructure reused across titles |
| **Game code** (sim, UI glue, mods that are code) | **MIT** | Apache-2.0 is an **allowed alternative** per title via ADR if contributors want patent language; pick **one** primary license in-tree—do not dual-fog |
| **Assets** (art, audio, fonts where we control rights) | **CC0** *or* **CC-BY-4.0** | Prefer CC0 when possible; CC-BY-4.0 when attribution must travel. Declare which in the game tree |
| **Docs** (this tree, DESIGN.md, ADRs, READMEs as documentation) | **CC-BY-4.0** | Code snippets embedded in docs follow the **code** license of their home repo when clearly marked |

**Snake day one:** Foss Snake (`games/snake/`) sits under this org stack from premise onward—harness Apache-2.0, game code MIT (unless an ADR records Apache-2.0), assets CC0 or CC-BY-4.0 as declared, docs CC-BY-4.0. See [games/snake.md](../games/snake.md) and [`games/snake/DESIGN.md`](../../games/snake/DESIGN.md). Playable code may still be open; **license posture is not blocked on playable green.**

Third-party and engine files keep **their** licenses; provenance section applies. Do not relicense upstream blobs by wishful README.

---

## DCO, AI disclosure, attempts & salvage

### DCO (sign-off)

- Every mergeable contribution (human or agent-assisted) carries a **DCO sign-off** (or forge-equivalent checkbox that records the same certification).  
- Sign-off asserts: you have the right to submit under the applicable outbound license(s); the contribution is original or properly relicensed / attributed; you are not smuggling secrets or known-infringing material.  
- **No copyright-assignment CLA** to a founder. Optional **org CLA** that only restates inbound=outbound + DCO is discouraged as redundant theater; if ever added, it must not assign copyright away from contributors.

### AI disclosure checkbox

- Race / PR templates include an **AI assistance disclosure** (used / not used; rough scope: code, assets, text).  
- Disclosure does **not** waive DCO. Submitters still assert license fitness and that they did not knowingly paste memorized proprietary blobs.  
- Harness and judge must not treat “AI-made” as either automatic reject or automatic absolution ([02-judge-anti-gaming.md](./02-judge-anti-gaming.md) scores design-fit and gates—not authorship mysticism).

### Losing attempts = same license

- Attempts that **lose** a race remain under the same outbound terms as winners for anything submitted into the public harness / forge.  
- No “we keep losers proprietary” or private escrow of failed diffs. Sunshine: public attempts are commons-bound once submitted under the job rules.

### Salvage clean

- Reusing pieces from a losing (or withdrawn) attempt into another PR is fine **if** provenance stays clean: same license, attributed where required, no laundering of third-party or ToS-poisoned material.  
- Salvage that strips copyright headers, invents authorship, or mixes incompatible licenses **fails** review—treat like a supply-chain surprise ([06](./06-security-supply-chain.md)).

---

## Third-party provenance, models, engines

### Provenance

| Requirement | Why |
| --- | --- |
| **Declare origin** | Each non-trivial third-party asset / snippet / font lists source, license, and (if needed) attribution text in-repo |
| **No mystery packs** | “Found on Discord” / undated zip with no license = **reject** until cleared |
| **Compatible only** | Inbound license must be compatible with the title’s outbound defaults; fail closed on ambiguity |
| **SBOM / dep honesty** | Code dependencies follow [06](./06-security-supply-chain.md)—license metadata is necessary and **orthogonal** to malware gates |

### Model memorization honesty

- Treat generative models as **capable of regurgitating** training data. Do not assert “AI output is always public domain.”  
- If a contribution is substantially model-emitted, disclosers should avoid known trademarked / copyrighted franchise pastiche and be ready to replace on challenge.  
- Org process: challenge → public issue → replace or document fair-use/license basis; no quiet purge that erases the audit trail.

### Unity / Unreal (and similar) EULA note

- Later catalog titles may use closed/mixed engines ([engines.md](../engines.md)).  
- **Engine EULAs and store ToS are not dissolved** by Foss Arcade’s MIT/Apache defaults. Export, splash, telemetry, and redistribution rules of the engine vendor still apply to **engine runtime** bits.  
- Shelf **open-game / closed-engine** (or mixed) badges stay honest. Heavier CI / license attestations are expected. Do not imply the org “FOSS-washed” the engine.

---

## Trademark (light; hold for org)

- **Hold lightly.** “Foss Arcade,” Shelf wordmarks, and logos need a **short, later** trademark / name-use note once the org identity is stable—not a day-one enforcement crown.  
- Until that note lands: do not imply official affiliation for unrelated commercial products; do not use marks to block lawful forks of **licensed code and assets**.  
- Forks should rename if they claim to *be* the org catalog; renaming is courtesy and clarity, not a substitute for copyright law.  
- Residual tracking: see [GAPS.md](./GAPS.md) Legal / community until a dedicated mark policy ships.

---

## AS IS, accounts, multiplayer, security

- Software and docs are provided **AS IS**, without warranty of any kind, to the extent permitted by law—consistent with Apache-2.0 / MIT / CC disclaimer language in each LICENSE file.  
- **No accounts required at v1** for core offline play (player & ship path). Account systems, if ever added, are a deliberate product ADR—not a stealth ToS dump.  
- **Multiplayer / online services later:** when network features appear, expect separate ops, abuse, and ToS/privacy notes; do not pretend single-player AS IS covers live services.  
- Security, malware, and supply chain remain governed by [06-security-supply-chain.md](./06-security-supply-chain.md). Passing a license gate ≠ safe to run.

---

## Under-18 / platform ToS

- Contributors and operators must respect **platform Terms of Service** (forge hosts, model APIs, store fronts, Discord/Reddit if used) and applicable law on age-restricted accounts.  
- Foss Arcade does not ask anyone to bypass age gates or parental-consent rules of third platforms.  
- Game content ratings / age suitability for *players* are per-title concerns (DESIGN / ship notes)—not a claim that the forge is a childcare service.  
- **Official surfaces** (org, Shelf verified, incubation, org `games/` merges) additionally follow the all-ages / no-porn venue rules in [content-policy.md](./content-policy.md)—license freedom ≠ obligation to distribute on those surfaces.  
- Forum drafts ([reddit-formats.md](./reddit-formats.md)) inherit Reddit’s own ToS when that surface opens.

---

## Code of Conduct

Community people-behavior policy lives in the **canonical** root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) (stub: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)). This legal/IP doc does **not** restate it.

- **CoC ≠ content policy:** sexual content on official surfaces → [content-policy.md](./content-policy.md); personal harassment → CoC.
- Enforcement stays public (logged reasons, multi-maintainer for serious actions, appeals via [09-dispute-capture.md](./09-dispute-capture.md))—**no private kingmaking**.
- Narrow safety / illegal paths in [04-sybil-grief.md](./04-sybil-grief.md) and incident sunshine in [06](./06-security-supply-chain.md) still apply; they complement the CoC, they do not replace it.

---

## Boot checklist

Bootstrap legal posture before strangers pour assets and attempts into the forge:

| # | Check | Boot bar |
| --- | --- | --- |
| 1 | **Disclaimer** | This doc (or root pointer) visible; “not legal advice” not stripped |
| 2 | **LICENSE files** | Harness Apache-2.0; each game declares code + assets + docs licenses in-tree |
| 3 | **Snake stack** | Foss Snake under org defaults day one ([games/snake.md](../games/snake.md)) |
| 4 | **DCO** | Sign-off / checkbox wired on merge path (even if manual at phase 0) |
| 5 | **AI disclosure** | Template field on race/PR |
| 6 | **Provenance** | Third-party asset checklist; reject undated mystery packs |
| 7 | **No founder assignment CLA** | Confirmed; inbound=outbound only |
| 8 | **Engine honesty** | Web/Godot FOSS path; Unity/Unreal badge + EULA awareness if present |
| 9 | **AS IS + no accounts v1** | Matches ship path; no warranty theater |
| 10 | **Trademark** | Hold light; do not block forks with mark panic |
| 11 | **CoC** | Root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) linked; IP doc does not restate conduct |
| 12 | **Security cross-link** | License gates never replace [06](./06-security-supply-chain.md) |

---

## What we deliberately avoid

- **Copyright assignment CLA to a founder** (or private studio crown).  
- **Dual-license fog** and inbound≠outbound traps.  
- **“AI is the author / public domain by default”** myths.  
- **Relicensing upstream** engine or asset blobs by README fiction.  
- **Keeping losing attempts proprietary** after public submission.  
- **Trademark as soft DRM** against lawful forks.  
- **License check as sole security gate** ([06](./06-security-supply-chain.md)).  
- **FOSS-washing Unity/Unreal** without badges and EULA honesty ([engines.md](../engines.md)).  
- **Account walls / warranty claims** that contradict AS IS and offline-first v1.  
- **Silent CoC enforcement** bypassing root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) / [09](./09-dispute-capture.md) (private kingmaking).  
- **Private Discord as the real license authority.**

Forks may choose different outbound licenses for *their* trees; the fossarcade org catalog and harness stay on this contract unless this doc is amended in public.

---

## Patching this doc

License and IP defaults change what strangers can safely contribute and redistribute. Edits are **slow lane**: PR, rationale, impact on open races / in-flight asset packs / harness consumers, merge. Quietly swapping outbound terms mid-season or adding a founder assignment CLA off-docs is itself process sabotage—treat it that way.

## Related

- [Security & supply chain](./06-security-supply-chain.md) (license ≠ security; provenance meets SBOM)
- [Official content policy](./content-policy.md) (all-ages venue; license ≠ distribution obligation)
- [Code of Conduct](../../CODE_OF_CONDUCT.md) ([stub](./CODE_OF_CONDUCT.md)) (people behavior; CoC ≠ content policy)
- [Dispute, capture & succession](./09-dispute-capture.md) (CoC appeals / multi-confirm)
- [Engines & play stacks](../engines.md) (engine ≠ game IP; Unity/Unreal later)
- [Foss Snake](../games/snake.md) / [DESIGN.md](../../games/snake/DESIGN.md) (day-one defaults)
- [Design authority](./01-design-authority.md) (fork-out)
- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Sybil, grief funding & sock attempts](./04-sybil-grief.md) (safety class; complements CoC)
- [Reddit tags & proposal formats](./reddit-formats.md) (draft / later; platform ToS)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
