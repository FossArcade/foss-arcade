# Dispute, capture & succession

**Status:** living governance doc  
**Audience:** maintainers, DESIGNERS / CODEOWNERS, org stewards, race participants, forkers, reviewers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **No irreplaceable kings.** Fork is always a legal escape. The org steward is not owner-of-souls.

Thin race appeals are not enough. Captured maintainers, dead or vanished founders, and toxic leads still break commons without a public succession and dispute ladder. This document is the contract for **escalating disputes without crowning a king**, **rotating maintainership**, **quiet-root honesty**, and **forced-fork norms**—so capture has somewhere to go besides silent Discord.

If a rule here conflicts with a private ban crown, unpublished “trust” that steers seats, or founder-for-life theater—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: design blocks and thin panels in [01-design-authority.md](./01-design-authority.md); race appeals in [02-judge-anti-gaming.md](./02-judge-anti-gaming.md); safety / content veto limits in [04-sybil-grief.md](./04-sybil-grief.md) and [content-policy.md](./content-policy.md); people-behavior CoC in [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md); fork lineage in [lineage-and-shelf.md](./lineage-and-shelf.md); cold-start dials in [10-cold-start.md](./10-cold-start.md); archive / sunset in [11-game-lifecycle.md](./11-game-lifecycle.md).

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **Thin appeals only** | Race scorecard appeals exist; nothing for maintainer abuse or org deadlock | Capture lives one layer above the judge |
| **Captured maintainers** | Active pool merges only one faction’s taste; blocks without pillars; slow-walks rivals | DESIGN.md becomes costume; fork is the only honest path—and may be harassed |
| **Dead / vanished founders** | Sole CODEOWNER or org root disappears; recovery codes unknown | Commons hostage to one laptop |
| **Toxic leads** | Harassment, malware merges, content-policy breach, quiet removals | Culture dies; good contributors leave without a public log |
| **Private Discord as truth** | Decisions made off-repo; public PR is theater | Unauditable crowns; newcomers cannot challenge |

### Principles

1. **No irreplaceable kings.**  
   Maintainership and org stewardship are **rotating, earned, and replaceable**. If one person must never leave, the process is already captured.

2. **Public process.**  
   Nominations, idle timeouts, emergency removals, succession plans, and crisis outcomes land in-repo or on the public forum with written reasons. Private chat is coordination, not law.

3. **Fork is always a legal escape.**  
   Clean fork-out and split-to-variant are first-class ([01](./01-design-authority.md), [lineage-and-shelf.md](./lineage-and-shelf.md)). No social penalty for honest forks; no harassment of forks.

4. **Org steward ≠ owner-of-souls.**  
   GitHub (or forge) org ownership is a **footgun and a quiet root**, not a Creative Director seat. Document who holds it; plan succession; do not confuse account power with DESIGN authority.

5. **Safety + content veto ≠ taste.**  
   Narrow vetoes (malware, illegal content, [content-policy.md](./content-policy.md) bans, license sabotage, harassment) stay narrow. They cannot steer balance, art style within policy, or season priorities.

---

## Layers of dispute

Escalate in order. Skip only when the lower layer cannot apply (e.g. org-root compromise).

| Layer | Subject | Where it lives | Outcome shape |
| --- | --- | --- | --- |
| **(1) Target / attempt appeal** | Race score, gate false positive, tie break, sock flag on an attempt | Existing judge / thin human panel ([02](./02-judge-anti-gaming.md)) | Written outcome; may spawn rubric ADR |
| **(2) Design block appeal** | CODEOWNERS / DESIGNERS block on merge or race winner | Must cite DESIGN.md / ADR ([01](./01-design-authority.md)); appeal → thin panel | Dismiss uncitable block; uphold cited fit; or require follow-up ADR if law was ambiguous |
| **(3) Maintainer conduct / capture** | Abuse of block rights, idle capture, harassment, malware / content-policy breach, silent removals | Public `[meta]` or slow target + multi-maintainer confirm (below) | Succession, emergency removal, public log; fork-out welcomed |
| **(4) Org-level constitutional crisis** | Quiet-root abuse, hostage infra, deadlock that freezes all games, attempt to waive this doc without high bar | Public `[meta]` high bar + published steward plan; **fork the org** remains escape | Recovery / steward rotation / forced fork norms; never private kingmaking |

Layer (1)–(2) handle process capture; people-behavior enforcement and appeals also use root [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) (multi-maintainer serious actions, logged reasons). Harassment and safety still use narrow veto + sunshine incident paths ([04](./04-sybil-grief.md), [06](./06-security-supply-chain.md)).

---

## Game maintainer succession

CODEOWNERS / DESIGNERS are **earned seats**, not lifetime crowns ([01](./01-design-authority.md), [08](./08-credit-economy.md)).

### Credit thresholds and nomination

| Step | Rule |
| --- | --- |
| **Earn path** | Block rights unlock after merged ADR(s) (or documented bootstrap exception—see [10](./10-cold-start.md)). Contribution credit / design ADR events support the case; credit alone is not automatic appointment. Prefer **game trust** evidence for that title’s seats ([08 dual trust](./08-credit-economy.md#dual-trust-game-based-vs-general)). |
| **Public nomination** | Additions and rotations open via **`[meta]`** issue/PR or a **slow** maintainer-succession target—template fields: nominee, evidence (ADR ids, stewardship notes), game slug, idle/conflict context. |
| **Confirm** | At least **N existing maintainers** for that game (boot dial: often 1–2; scale: multi-confirm) + public review window. Empty pool falls back to org steward + open nomination (not silent founder fill). |
| **Publish** | CODEOWNERS / DESIGNERS diff is the record; forum note optional but encouraged. |

### Idle timeout

| Trigger | Effect |
| --- | --- |
| **No meaningful activity for N days** on that game’s steward surfaces (merges, ADR review, public stewardship replies—exact N in-repo dial, e.g. 90–180) | Seat marked **idle**; succession opens automatically via public nomination thread |
| **Partial idle** (rare drive-bys only) | Soft warn in public issue first; then idle path |
| **Return during window** | Nominee process may pause if the idle steward resumes **and** the pool agrees in public; no silent reclaim after emergency removal |

Idle is hygiene, not shame. Forks and archive paths remain available ([11](./11-game-lifecycle.md)).

### Emergency removal

For **abuse, malware, content-policy breach, or sustained harassment** tied to maintainer powers:

| Rule | Intent |
| --- | --- |
| **Multi-maintainer confirm** | Removal requires confirmation from **other** maintainers (or org steward + second when pool is tiny)—never solo quiet delete |
| **Public log** | Written reasons on a public issue/PR; link to evidence (diff, incident, policy cite). No “trust us” |
| **Scope** | Seat + block rights for that game (or org-wide if breach is org-scoped). Does not erase past merge credit or DCO history |
| **Appeal** | Layer (3)/(4) appeal window; fork escape always available |
| **Not for taste** | Disagreement over DESIGN-fit belongs in blocks + ADRs, not emergency removal |

---

## Org owner account (quiet root)

Forge **org ownership** (billing root, member kicks, repo delete powers) is **quiet root**—dangerous and necessary.

| Honesty | Practice |
| --- | --- |
| **Footgun** | GitHub/org ownership can override every soft norm. FOSS honesty: admit it; constrain it with process and succession, not pretend it does not exist |
| **Publish who holds root** | Name **steward roles / handles** (or public pseudonyms) that hold org owner / billing / recovery—**without doxxing** (no home address, phone, legal name requirement) |
| **Succession plan** | Documented recovery codes / break-glass procedure held by **at least one backup steward** (or sealed multi-party plan). Test recovery on a schedule; log that tests happened (not the secrets) |
| **What root is not** | Not DESIGN law, not race judge, not taste veto, not “I own contributors’ work” |
| **Crisis use** | Root acts for malware lockdown, account compromise, illegal-content takedown, or hostage-infra prevention—then **sunshine log** after (same spirit as [06](./06-security-supply-chain.md) incidents) |

If root holders vanish without a plan, treat it as layer (4): public crisis thread + fork-the-commons as legitimate escape.

---

## Forced fork norms

When disagreement or capture makes staying in-org worse than splitting:

| Path | When | Norms |
| --- | --- | --- |
| **`split-to-variant`** | Design direction diverges but lineage should stay related | Spec + parent metadata ([lineage-and-shelf.md](./lineage-and-shelf.md)); races move to variant |
| **Leave org / external fork** | Constitutional crisis, hostile capture, or desire for separate venue | Lawful under outbound licenses ([07](./07-legal-ip.md)); keep provenance |
| **Shelf related forks** | Fork keeps parent metadata and is not policy-banned | Shelf **may list related forks**; verified/official badge still requires org policy ([content-policy.md](./content-policy.md)) |
| **No harassment** | Any of the above | No pile-ons, no DM campaigns, no “traitor” framing in official channels. Critique code and process in public; do not hunt people |

Archive / sunset can **encourage** fork-out rather than zombie custody ([11](./11-game-lifecycle.md)).

---

## Capture resistance

| Defense | Intent |
| --- | --- |
| **No private Discord (or equivalent) as source of truth** | Coordination OK; binding decisions invalid unless mirrored in-repo / public forum with reasons ([01](./01-design-authority.md)) |
| **Sunshine ledgers** | Succession nominations, emergency removals, vetoes, steward lists, crisis outcomes—public or invalid |
| **Safety + content veto ≠ taste** | Cannot be used for art-direction wars, balance preference, or season gatekeeping ([04](./04-sybil-grief.md), [content-policy.md](./content-policy.md)) |
| **`[meta]` high bar to change this doc** | Same slow lane as rubric / content policy: PR, rationale, impact on open seats and crises, merge. Mid-crisis silent rewrite to favor one camp is itself an attack |
| **Export + fork** | Credit and reputation export ([08](./08-credit-economy.md), [04](./04-sybil-grief.md)) so exit is real |

---

## Boot vs scale dials

| Dial | Boot / early (Seed–Village) | Scale (Town–City) |
| --- | --- | --- |
| Maintainer confirm for succession | 1–2 maintainers or steward + public window | Multi-maintainer; longer review |
| Idle timeout N | Longer grace (small teams travel) | Documented N; auto-open succession |
| Emergency removal | Steward + one other + public log | Multi-confirm + panel note |
| Quiet-root publish | Named handles + “backup exists” attestation | Named roles + scheduled recovery drills (secrets stay secret) |
| Dispute layer (3)–(4) traffic | Rare; steward-heavy | Standing `[meta]` templates; rotate panelists |
| Forced-fork Shelf listing | Manual related links | Manifest-related forks UI ([lineage](./lineage-and-shelf.md) residuals) |
| This doc amend | Slow `[meta]` / PR | Same; higher notice if seats contested |

**Order of operations:** public CODEOWNERS + idle/emergency norms → published quiet-root honesty → richer panel rotation. Do not invent a shadow CD “for bootstrap convenience” without a logged exception ([10](./10-cold-start.md)).

---

## What we deliberately avoid

- **Founder-for-life** — permanent sole CODEOWNER / org narrative crown.
- **Silent removals** — seat or member gone with no public log.
- **Hostage infra** — sole root, unrecovered codes, or private CI that only one faction can run.
- **Private Discord as law** — off-repo overrides of DESIGN, races, or succession.
- **Taste veto as “safety”** — balance/art preference wearing malware clothes.
- **Harassment of forks** — social punishment for lawful escape.
- **Appeals that stop at scorecards** — no path for maintainer/org capture.
- **Doxxing “for transparency”** — publish steward handles/roles, not private life.
- **Mid-crisis rewrite of this doc** to entrench a faction.

Forks may tune dials; the fossarcade org stays on this contract unless this doc is amended in public.

---

## Patching this doc

Dispute and succession rules change who can hold seats and quiet root. Edits are **`[meta]` slow lane**: PR, rationale, impact on open nominations / emergencies, merge. Quietly rewriting succession mid-removal to favor one camp is itself capture—treat it that way.

## Related

- [Design authority](./01-design-authority.md)
- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Sybil, grief funding & sock attempts](./04-sybil-grief.md)
- [Credit economy](./08-credit-economy.md)
- [Cold-start dials](./10-cold-start.md)
- [Game lifecycle](./11-game-lifecycle.md)
- [Official content policy](./content-policy.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md) ([stub](./CODE_OF_CONDUCT.md))
- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
