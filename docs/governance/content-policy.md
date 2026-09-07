# Official content policy

> **Not legal advice.** This is Foss Arcade **venue stewardship** policy for official surfaces—not counsel, not a jurisdiction-by-jurisdiction compliance manual, and not a substitute for advice from a qualified attorney. Applicable law still binds everyone; this doc does not create private law that overrides it.

**Status:** living governance doc — **active from day one (Snake era / phase 0)**  
**Audience:** newGame proposers, Shelf operators, incubators, PR authors, reviewers, forkers  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce.

---

## Principle

**License freedom ≠ distribution obligation.**

A free/open license lets people copy, modify, and redistribute software under that license. It does **not** oblige the **fossarcade** org, Arcade Shelf, or org-hosted incubation lanes to host, list, badge, merge, or promote every lawful fork. Official surfaces are a **stewarded venue**: the commons chooses what it carries under a public, amendable policy—not a private crown’s taste, and not “anything the license allows must ship on Shelf.”

Forks elsewhere remain allowed and expected (see below). They simply are not **official Foss Arcade** unless they meet this policy and the rest of in-repo law.

---

## Scope (official surfaces only)

This policy applies to:

| Surface | Examples |
| --- | --- |
| **Official fossarcade GitHub (or forge) org** | Repos under the org, bots, harness configs, org-owned `games/` trees |
| **Official Arcade Shelf listing / verified badge** | Catalog entries and “verified” (or equivalent) badges that claim official Foss Arcade status |
| **Org-hosted incubation** | Incubation that the org hosts or endorses toward becoming an official title |
| **Merges into org `games/`** | PRs and race winners that land content in org game trees |

It does **not** police every fork, mirror, Discord, personal site, or third-party launcher that happens to run Foss-licensed code. Those are outside the venue.

Companions: legal/IP defaults in [07-legal-ip.md](./07-legal-ip.md); proposal formats in [reddit-formats.md](./reddit-formats.md); safety veto shape in [04-sybil-grief.md](./04-sybil-grief.md); model overview in [OVERVIEW.md](../OVERVIEW.md).

---

## All-ages / no pornographic or sexual content on official surfaces

**Official surfaces are all-ages.** Do not incubate, Shelf-list, verify, or merge **pornographic or sexual content intended to arouse** into org trees or official listings.

### Banned (define)

On official surfaces, the following are **out of policy**:

- **Explicit sexual content** (graphic sexual acts, genitalia presented for arousal, etc.)
- **Pornography** (including softcore framed as product content for official listing)
- **Hentai** and other pornographic anime/manga-style sexual content
- **Fetish exhibition intended to arouse** (content whose primary purpose is sexual arousal via fetish display)

### Not banned (v1 conservative note)

The ban is **not** a culture panic against art styles or ordinary game fiction:

| OK (when not pornographic / not arousal-primary) | Still keep conservative for v1 |
| --- | --- |
| **Anime / cartoon style alone** — explicitly OK | Do not use “anime” as cover for hentai or explicit sexual content |
| **Mild fantasy violence** typical of games | Extreme gore / shock-for-shock is a separate design/ship concern; not a sexual-content loophole |
| **Non-sexual romance** and **fade-to-black** if ever relevant | Prefer fade-to-black / off-screen; no explicit sex scenes on official surfaces in v1 |

When unsure, **fail closed** for official incubation / Shelf / org merge, write a public reason, and allow appeal (below). Unofficial forks may choose differently—they are not official Foss Arcade.

---

## Hard ban: illegal content

**Illegal content is hard-banned** on official surfaces—**no meta override**, no “temporary exception,” no vote that waives it.

Includes (non-exhaustive): **CSAM** and any other material that is illegal to host or distribute under applicable law. Safety and legal floors beat process theater. See also narrow safety paths in [04-sybil-grief.md](./04-sybil-grief.md) and incident sunshine in [06-security-supply-chain.md](./06-security-supply-chain.md).

---

## Enforcement

| Action | When |
| --- | --- |
| **Refuse newGame incubation** | Proposal or incubation packet includes policy-banned content for an official path |
| **Refuse Shelf list / verified badge** | Title or build would put banned content on official Shelf surfaces |
| **Close / reject PRs** | Diff adds banned content to org `games/` (or other in-scope org trees) |

Rules:

- Give **public written reasons** (issue/PR comment or ledger)—no silent ghosting as the only record.
- **Appeal** exists for **edge cases** (style vs pornography ambiguity, false positive, salvage that strips banned assets). Appeals are written and public; outcomes may spawn ADRs if the line was unclear.
- Enforcement is **venue stewardship**, not a claim of ownership over every fork of the code.

### Safety veto extension

The narrow **safety veto** in [04-sybil-grief.md](./04-sybil-grief.md) (block opening a target / strip a vote batch’s effect on that target) **includes policy-banned sexual content** on official surfaces—alongside malware, illegal content, license sabotage, and harassment.

Same rules as that doc: **written, public, appealable**; not taste or “I don’t like this pillar”; private Discord veto is invalid.

---

## Forks elsewhere

- **Forks are allowed and expected.** License freedom means people can take the code elsewhere.
- **No harassment** of people for forking, including forks that host content Foss Arcade refuses to carry officially.
- A fork that diverges on content policy (or anything else) is simply **not official Foss Arcade**—no Shelf verified badge, no claim to speak for the org catalog, no incubation shortcut by sock flooding.

Trademark / name clarity remains light per [07-legal-ip.md](./07-legal-ip.md): do not imply official affiliation; do not use marks as soft DRM against lawful forks of licensed code and assets.

---

## Anime style

**Anime / cartoon style is explicitly OK** on official surfaces when the content is **not** pornographic or otherwise banned above. Style ≠ pornography. Hentai and arousal-primary fetish exhibition remain banned regardless of art style.

---

## Amending this policy (`[meta]`)

`[meta]` proposals may amend this policy, but only with a **high bar (slow lane)**: public PR / ADR-class review, rationale, impact on open incubation and Shelf listings, merge—same spirit as other governance and rubric edits.

**Adult sibling project:** an intentional, separate adult-oriented forge or catalog would be a **deliberate meta outcome** (new venue, clear labeling, not pretending to be all-ages Foss Arcade)—**not** a sneak-flood of pornographic content into official Snake-era surfaces via votes, socks, or “just one exception” PRs.

Illegal content remains non-overridable even by meta.

---

## Boot

This policy is **active from day one** for the Snake era (phase 0 bootstrap): Foss Snake and any early org titles / Shelf experiments inherit it immediately. Do not wait for a later “content spike” to apply the all-ages / no-porn / hard illegal bans on official surfaces.

---

## Related

- [Legal & IP](./07-legal-ip.md)
- [Reddit tags & proposal formats](./reddit-formats.md) (draft / later)
- [Sybil, grief funding & sock attempts](./04-sybil-grief.md) (safety veto)
- [Security & supply chain](./06-security-supply-chain.md)
- [Dispute, capture & succession](./09-dispute-capture.md) (veto ≠ taste; emergency removal for policy breach)
- [Game lifecycle](./11-game-lifecycle.md) (incubation / official listing gates)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
- [Lineage and Arcade Shelf](./lineage-and-shelf.md)

---

*Official venue policy. Patch in the slow lane; cite reasons. Forks welcome—official surfaces stay stewarded.*
