# Shelf: bring-your-own GitHub + feature/mod run hash

**Audience:** Foss Games Chief · **Lane:** Marquee  
**Scope:** Design only — account/repo registration on the Arcade Shelf, and a shareable run hash for channel + mods.  
**Constraints:** existing governance; all-ages copy; handle-only examples (`MediumSweetPotato`); docs first — **no OAuth implementation**, no full UI in this PR.  
**Date:** 2026-09-08 (Australia/Brisbane)

**Steering (Michael locked):** Foss Arcade is a **platform** for community-driven game development, not only an org catalog. Users connect **their own GitHub** and register **their own** repos/games on the Shelf. Official FossArcade titles and community-registered titles share Community / ForumPort / consideration→brief→target patterns where possible. Separately: every game’s mods/features surface compresses into a **copy-pasteable run hash** so players can share or try channel + feature sets without silent pillar rewrites (`channel ≠ mod ≠ variant`).

---

## Goals / non-goals

### Goals

1. **BYO GitHub (platform)**  
   - Players/devs can link a GitHub identity and register a public game repo onto the Shelf catalog.  
   - Official (`origin: official`) and community (`origin: community`) tiles share the same game-page chrome where it fits: Play / About / Community / Changelog.  
   - Fork→PR against **their** repo (or FossArcade when official); Shelf provides chrome + process, not only hosting.  
   - ForumPort binds per game: `{ port, owner, repo, categories, labelMap }` so Community tabs talk to that repo’s Discussions (or a later port).

2. **Feature/mod run hash**  
   - Default Play = latest **stable**, **no optional mods**.  
   - Enabled mod/feature set + channel compress into a **versioned, human-shareable hash/code**.  
   - Paste hash → selects channel (e.g. `unstable`) + feature flags for that run — quick try of unstable builds with chosen features.  
   - Hash encodes **channel + mod ids** (+ optional build tip) — **not** silent pillar rewrites. Variants remain sibling titles (`lineage-and-shelf.md`).

### Non-goals (this note / Seed)

- Implementing OAuth, token storage, or GraphQL clients in `shopfront/`.  
- Building full account settings UI or a registration wizard beyond wireframe flows.  
- Claiming Steam-like install/sideload is shipped (`GAPS.md`).  
- Treating Reddit as binding Community (`ALIGN.md`, `community-forum.md`).  
- Encoding **variants** or DESIGN pillar rewrites inside the run hash.  
- Requiring a GitHub account to **play** Seed official Snake (identity optional to play FOSS titles — `lineage-and-shelf.md`).  
- Private repos as first-class Shelf listings (public manifests only for Seed→Village).  
- KYC or “verified developer” paywalls (`10-cold-start`, `04-sybil-grief`).

---

## Section 1 — Bring-your-own GitHub

### 1.1 Problem

Today the catalog is a static `shopfront/games.js` with one official Snake tile. That fits Seed, but Foss Arcade’s product claim is a **platform**: community titles should land on the Shelf with the same Community → brief → target loop, without forcing every game into the FossArcade org tree. Official titles stay first-class; community titles are not second-class chrome — they share patterns, with honest badges.

### 1.2 Data model sketches

Extend the deepened `GameTile` (`docs/design/shopfront-deepen-snake-community.md`, `shopfront/games.js`) — additive fields only:

```ts
type GameOrigin = "official" | "community";

type RepoRef = {
  owner: string;   // GitHub owner/org
  repo: string;    // repository name
  defaultBranch?: string;
  // Canonical browse URL derived, not stored twice when possible
};

/** ForumPort binding — same shape as community-forum.md meta pointer */
type ForumPortConfig = {
  port: "github-discussions" | "nodebb" | "discourse" | string;
  owner: string;
  repo: string;
  categories: string[];           // ForumPort identity slugs
  labelMap: Record<string, string>; // logical flair/stage → forge label
};

type GameTileExtensions = {
  origin: GameOrigin;             // official = FossArcade-stewarded; community = BYO
  repo: RepoRef;                  // where fork→PR and manifests live
  forumPort?: ForumPortConfig;    // Community tab binding; omit = Community gated
  registrantHandle?: string;      // e.g. "MediumSweetPotato" — public handle only
  registeredAt?: string;          // ISO date; stub-ok
  trustBadge?: "official" | "community" | "sideload" | "archived" | "sunset";
  // badgeHints already exists — keep using it for lifecycle; trustBadge is origin honesty
};
```

**Snake Seed sketch (no OAuth required):**

```text
origin: official
repo: { owner: "FossArcade", repo: "foss-arcade" }  // game path under games/snake/
forumPort: {
  port: "github-discussions",
  owner: "FossArcade",
  repo: "foss-arcade",
  categories: [announcements, proposals, …],
  labelMap: { … }   // per community-forum.md
}
trustBadge: official
```

**Community registration sketch (later):**

```text
origin: community
repo: { owner: "SomeDevHandle", repo: "cool-foss-pong" }
forumPort: {
  port: "github-discussions",
  owner: "SomeDevHandle",
  repo: "cool-foss-pong",
  categories: […defaults…],
  labelMap: { …defaults… }
}
registrantHandle: "SomeDevHandle"
trustBadge: community
```

Catalog may stay static JSON for Seed; later a registration index (signed/open manifest URL) feeds the same `GameTile` view model. `game.yaml` / DESIGN remain law for that repo when they diverge from the tile.

### 1.3 Trust / badges

| Badge | Meaning | Shelf copy tone |
| --- | --- | --- |
| **Official** | FossArcade-stewarded; content policy + org stage apply | “Official Foss Arcade title” |
| **Community** | Registrant-linked public repo; Shelf chrome + ForumPort | “Community-registered — fork→PR on their repo” |
| **Sideload** | Player-supplied manifest (existing Shelf intent) | Warn; inspectable; not curated |
| Lifecycle badges | From `11-game-lifecycle.md` | `archived` / `sunset` / `incubating` / `forked-out` unchanged |

**Honesty rules**

- Official and community share UI chrome; they must **not** share a fake “verified players” metric at Seed (`10-cold-start`).  
- Community does **not** inherit FossArcade content-policy automatic listing forever — listing can require a public checklist later; Seed may allow open registration with strong badge honesty first.  
- Fork→PR: Community tab / Propose CTAs open against `repo.owner/repo`, not silently against FossArcade unless `origin: official`.

### 1.4 UX flows (wireframes — not implemented here)

#### A. Connect GitHub (Village+)

```
Settings / Account
  → [Connect GitHub]   // OAuth later; Seed: omit or “coming when Village”
  → Show linked handle only (e.g. MediumSweetPotato)
  → Disconnect
```

- Play remains available **without** connect.  
- Connect is required only for **register repo** and for write paths on Community (createThread) when the port needs auth.

#### B. Register a repo

```
Shelf → Register a game
  1. Pick linked GitHub account
  2. Select public repo (or paste owner/repo)
  3. Confirm game.yaml / DESIGN / all-ages tags present (checklist)
  4. Choose ForumPort defaults (GitHub Discussions categories) or “Community later”
  5. Preview tile (origin: community, trustBadge: community)
  6. Publish → catalog entry + sunshine log
```

Seed alternative: maintainers add community tiles by PR to the catalog (no OAuth). Publish the path so Village OAuth is not a surprise crown.

#### C. Community tab binding

- Game page Community reads `tile.forumPort`.  
- Adapter constructed as `ForumPort.for(tile.forumPort)` — Shelf UI never hard-wires GraphQL (`community-forum.md`).  
- Official Snake keeps approved Seed port on FossArcade/foss-arcade.  
- Community title: Discussions on **their** repo; brief export → PR against **their** default branch.

### 1.5 Seed vs later

| Capability | Seed (now) | Village+ |
| --- | --- | --- |
| Play official Snake | No account | No account |
| Catalog | Static `games.js`; official Snake | Registration index + official |
| Connect GitHub | **Not required**; may be absent | OAuth link for register + write |
| Register community repo | Docs + optional maintainer PR to catalog | Self-serve register flow |
| ForumPort | Snake Discussions on org repo | Per-game `{owner,repo,…}` |
| Badges | Docs + tile fields | First-class Shelf chrome |

Cold-start honesty: do **not** block Seed Snake on OAuth theater (`10-cold-start`, Shelf identity optional).

---

## Section 2 — Feature/mod run hash

### 2.1 Problem

Players and racers need a **shareable** way to say “play this channel with these mods” without burying settings, and without pretending a mod is a variant. Default Play must stay boring and safe: **stable + no optional mods**. Unstable + experimental packs stay one paste away.

Aligns with `lineage-and-shelf.md`:

| Kind | In hash? |
| --- | --- |
| **Channel** | Yes |
| **Mod / feature flags** | Yes (ids + versions when available) |
| **Variant** | **No** — install/open the sibling title |
| **Silent DESIGN rewrite** | **Never** |

### 2.2 RunSpec + hash format

```ts
type RunSpec = {
  v: 1;                          // hash format version
  game: string;                  // tile id / slug
  channel: ChannelId;            // e.g. "stable" | "unstable"
  mods: string[];                // sorted mod ids; empty = none
  tip?: string;                  // optional build tip: tag, sha prefix, or channel tip id
  // deliberately omitted: variant id, pillar overrides, accounts
};

type ChannelId = "unstable" | "stable" | `season-${number}` | string;
```

**Default Play (no hash):**

```ts
{ v: 1, game: "snake", channel: "stable", mods: [] }
```

Note: Snake Seed catalog may still advertise `defaultChannel: "unstable"` while **stable is stub** — Play UI must show the existing stub≠shipped-stable banner from the deepen note. When a real stable artifact exists, Default Play follows this contract.

#### Human-shareable encoding (v1 sketch)

Prefer a short, copy-pasteable code plus an optional URL form.

```text
# Compact (illustrative — implementer may pick base58url / crockford base32)
fa1_<game>_<channel>[_<modId~modId>][_t<tip>]

# Examples
fa1_snake_stable
fa1_snake_unstable_speed-extreme~skin-neon
fa1_snake_unstable_speed-extreme_t3a1b2c

# URL form (Play tab deep link)
/shopfront/game?id=snake&run=fa1_snake_unstable_speed-extreme
# or /games/snake/?run=fa1_snake_unstable_speed-extreme
```

Rules:

1. Prefix `fa1_` = Foss Arcade run hash version 1 (bump `fa2_` on breaking encode changes).  
2. `mods` sorted lexicographically before encode — same set ⇒ same hash.  
3. Unknown mod id on decode → soft-fail: show compatibility panel; do not auto-enable.  
4. Mod incompatible with channel (declared in mod manifest) → block enable + explain; offer “open without that mod” or “switch channel”.  
5. Variant ids in the mod list are **rejected** (compatibility error pointing at lineage UI).  
6. Optional `tip` pins a build when sharing race repros; omit for “channel tip / latest”.

Decode → `RunSpec`; encode is pure / deterministic.

### 2.3 Compatibility

```ts
type ModManifestCompat = {
  id: string;
  compatibleChannels: ChannelId[] | "*";
  conflicts?: string[];          // other mod ids
  replacesPillars?: boolean;     // if true → must be a variant, not a mod; Shelf refuses
};
```

UI when paste conflicts:

1. List failing mods / channel mismatches.  
2. Offer strip-to-compatible or cancel.  
3. Never silently drop mods without a toast/banner.

### 2.4 UX flows (Play tab)

```
Play / Download
├── Primary CTA: Play (default = stable, mods [])
├── Channel switcher (risk labels) — existing deepen component P2
├── Mods / features panel (optional packs)
├── [Copy run link]  → clipboard URL + compact hash
├── [Copy hash]      → compact fa1_… only
└── [Paste hash]     → input → apply RunSpec → confirm if unstable / conflicts
```

- Pasting an `unstable` hash shows the risk label before Play.  
- Attribution / share text stays handle-safe (“Shared by MediumSweetPotato” only if we ever show sharer — not required for v1).  
- Changelog / race repros may cite `fa1_…` in briefs and targets as evidence links.

### 2.5 Seed vs later

| Capability | Seed | Later |
| --- | --- | --- |
| Default Play semantics | Documented; UI may still deep-link `/games/snake/` | Enforce stable+no-mods when stable ships |
| Hash encode/decode | Spec + pure helpers OK | Wired to channel switcher + mod panel |
| Copy / Paste controls | Wireframe / stub buttons OK | Live clipboard + confirm dialog |
| Mod manifests | Snake DESIGN mod surfaces | Machine-readable compat in repo |
| Tip pin | Optional sha/tag in hash | Channel tip registry |

---

## Implementation order (for Marquee later — not this PR)

1. Extend `GameTile` types/docs with `origin`, `repo`, `forumPort`, `trustBadge` (Snake filled official).  
2. Pure `encodeRunSpec` / `decodeRunSpec` + tests (no OAuth).  
3. Play tab: Copy hash / Paste hash stubs against local mod list.  
4. ForumPort already per-repo shaped — ensure Community uses `tile.forumPort` when multi-game.  
5. Village: Connect GitHub + Register repo (separate security review).  
6. Registration sunshine log + content-policy checklist for community listings.

---

## Open questions for Foss Games Chief

1. **Default Play vs Snake Seed `defaultChannel: unstable`** — When stub stable exists, do we keep catalog `defaultChannel: unstable` for honesty, while Default Play *button* still targets “best shipped” with an explicit banner? Or flip catalog default on first real stable artifact only?  
2. **Community listing gate** — Open self-register at Village, or maintainer-ack checklist (content policy + licenses) before the tile is browsable?  
3. **Hash alphabet** — Prefer compact `fa1_…` opaque string, or always also show a verbose query (`channel=unstable&mods=a,b`) for debuggability? (Recommendation: both; hash canonical, query accepted as alias.)  
4. **Cross-game paste** — If hash `game` ≠ current page, navigate to that game page or reject? (Recommendation: confirm navigate.)  
5. **Official game in a non-org repo** — Allowed (mirror) or must `origin: official` imply FossArcade-owned `repo`?  
6. **Mod ids stability** — Require reverse-domain ids (`snake.mod.speed-extreme`) vs short slugs? Short slugs need collision rules once BYO catalog grows.

---

## Related

- [Lineage + Arcade Shelf](../governance/lineage-and-shelf.md) — channel ≠ mod ≠ variant  
- [Shopfront deepen + Snake Community IA](./shopfront-deepen-snake-community.md) — GameTile / tabs  
- [Community forum (ForumPort)](../shopfront/community-forum.md) — `{ port, owner, repo, categories, labelMap }`  
- [Cold-start dials](../governance/10-cold-start.md) — no City theater at Seed; identity optional to play  
- [Game lifecycle](../governance/11-game-lifecycle.md) — badges; archive/sunset  
- [ALIGN.md](../ALIGN.md) — binding commons = Shelf + GitHub; Reddit outreach only  
- `shopfront/games.js` — current tile fields to extend

---

*Design note only. Patch freely; cite reasons. No OAuth or full UI in the landing PR for this doc.*
