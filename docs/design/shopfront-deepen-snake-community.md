# Shopfront deepen + Foss Snake Community IA

**Audience:** Foss Games Chief · **Lane:** Marquee  
**Scope:** Deepen `shopfront/` (do not replace); Snake end-to-end; other titles tile/placeholder.  
**Constraints:** existing governance; all-ages copy; handle-only examples (`MediumSweetPotato`); Reddit = outreach.  
**Date:** 2026-09-08 (Australia/Brisbane)

**Steering (2026-09-08):** Community tab is a **UI + schema contract**; persistence is **pluggable** via **ForumPort** (see [`docs/shopfront/community-forum.md`](../shopfront/community-forum.md)). **Approved Snake Seed port:** GitHub Discussions + thin Shelf UI. NodeBB/Discourse later via `[meta]`. This deepen stays **adapter-facing** (do not hard-wire GraphQL into Shelf components).

---

### A. Current shopfront v0 (what exists)

**Surface:** static HTML/CSS/JS under `shopfront/` — no build; `npm run shopfront` → **4322**; `/` → `/shopfront/`; Play → `/games/snake/` (`shopfront/README.md`, `docs/ALIGN.md`).

#### Data shape in `games.js` (today)

One entry (`snake`). Fields consumed by `shelf.js`:

| Field | Type | Role |
| --- | --- | --- |
| `id` | string | Card `data-game-id` |
| `title` | string | Heading |
| `summary` | string | Blurb |
| `playHref` | string | Primary Play |
| `githubHref` | string | Open game files |
| `downloadLabel` / `downloadEnabled` | string / bool | Disabled download UX |
| `tags` | string[] | `all-ages`, `web`, `classic` |
| `community.subreddit` / `subredditLabel` | URL / string | Reddit outreach |
| `stats.players`, `activity`, `rating`, `lastUpdate` (+ notes) | stub | Placeholders (`—`, `Seed`, unrated) |

`games/snake/game.yaml` `shelf.*` is a parallel sketch — **not** loaded by shopfront.

#### What `shelf.js` renders

One card: title, summary, tags, stats `<dl>`, Play / Download(disabled) / GitHub. No game-page route, tabs, channels, lifecycle badges, or Community UI.

#### Gaps vs product vision

| Vision | v0 |
| --- | --- |
| FOSS launcher Shelf (`lineage-and-shelf.md`) | Single card; no manifests/sideload (`GAPS.md`) |
| Play / About / Community / Changelog | Play deep-links only |
| Proposal → brief → target | Reddit link only; `reddit-formats.md` still **DRAFT**; persistence unset |
| Lifecycle/stage honesty (`11`, `10`) | Free-text activity |
| Popular-first without fake metrics (`08`, `10`) | No sort keys |
| Align tile ↔ `game.yaml` / lineage | Missing slug/engine/channels/parent |

**Deepen:** typed catalog + game pages; Community = schema/UX + **adapter interface** (not a chosen forum product).

---

### B. Deepened tile schema

Align with `lineage-and-shelf.md`, `game.yaml`, `11-game-lifecycle.md`, `10-cold-start.md`. Catalog = Shelf **view model**; `game.yaml` remains ship/harness law when they diverge (reconcile by PR).

```ts
type GameTile = {
  // required
  id: string;                    // == game.yaml slug
  title: string;
  summary: string;               // all-ages
  lifecycle: "proposed"|"incubating"|"active"|"season-freeze"|"archived"|"forked-out";
  stage: "Seed"|"Village"|"Town"|"City";
  enginePrimary: "web"|"godot"|string;
  stacks: Array<"web"|"godot"|string>;
  playHref: string;
  tags: string[];                // official listings include "all-ages"
  channels: ChannelId[];         // e.g. unstable, stable
  defaultChannel: ChannelId;     // stub era: unstable (not shipped stable)
  href: string;                  // /shopfront/game/<id>/
  metrics: TileMetrics;
  sort: TileSortKeys;

  // optional
  parent?: null | { game: string; ref?: string; channel?: string };
  variantOf?: string;
  githubHref?: string;
  downloadEnabled?: boolean;
  downloadHref?: string;
  downloadLabel?: string;
  offlineFirst?: boolean;
  community?: {
    subreddit?: string;          // outreach only
    subredditLabel?: string;
    forumPath?: string;          // Community tab deep-link (UI)
    persistenceHint?: "pluggable"; // documentation only — not a backend choice
  };
  badgeHints?: Array<"verified"|"incubating"|"archived"|"sunset"|"forked-out"|"sideload">;
  placeholder?: boolean;         // true => no Community e2e
};

type ChannelId = "unstable"|"stable"|`season-${number}`|string;

type TileMetrics = {
  mode: "stub"|"live";
  players?: number|null;
  playersNote?: string;
  activityLabel?: string;
  activityNote?: string;
  rating?: number|null;
  ratingLabel?: string;
  ratingCount?: number|null;
  lastUpdate?: string;           // ISO date
  lastUpdateNote?: string;
  openTargets?: number|null;
  forumHeat7d?: number|null;     // adapter-supplied when live; stub = null
};

type TileSortKeys = {
  popularScore: number;
  lastUpdateTs: number;
  titleKey: string;
};
```

#### Popular-first (define how)

Do **not** invent players/Hall veterans (`10-cold-start`, `08-credit-economy`).

```
popularScore =
  1000 * lifecycleWeight(lifecycle)   // active=5 … archived/forked-out=0
+ 100  * (placeholder ? 0 : 1)
+ 10   * clamp(forumHeat7d ?? 0, 0, 50)   // only if metrics.mode=live
+ 5    * clamp(openTargets ?? 0, 0, 20)
+ 1    * (rating ?? 0) * log1p(ratingCount ?? 0)  // live only
+ 0.001 * (players ?? 0)              // live only; stub ignored
```

Sort: `popularScore` DESC → `lastUpdateTs` DESC → `titleKey` ASC.  
**Stub:** show `—` / stage / “Not rated yet”; exclude fake players from score.  
**Live:** numeric fields only after a published metrics pipeline (sunshine).

#### Snake tile sketch (identity-safe)

`id: snake`, `lifecycle: active`, `stage: Seed`, `enginePrimary: web`, `stacks: ["web"]`, `channels: [unstable, stable]`, `defaultChannel: unstable`, `tags: [all-ages, web, classic, harness-prover]`, `offlineFirst: true`, `placeholder: false`, `metrics.mode: stub`, Reddit outreach + `forumPath` to Community tab. Other titles: `placeholder: true`, Community gated.

---

### C. Game page schema + tabs

**Route:** `/shopfront/game/:id/` (static `game.html` + query OK for v0).  
**Tabs:** Play/Download · About · Community · Changelog.

```ts
type GamePage = {
  tile: GameTile;
  tabs: Array<"play"|"about"|"community"|"changelog">;
  primaryCta: { kind: "play"; href: string; label: "Play" } | { kind: "coming_soon"; label: string };
  secondaryCtas: Array<
    | { kind: "download"; enabled: boolean; href?: string; label: string }
    | { kind: "github"; href: string; label: "Open game files" }
    | { kind: "propose"; href: string; label: "Propose a change" }  // -> Community compose
    | { kind: "outreach_reddit"; href: string; label: string }
  >;
  channelSwitcher?: { channels: ChannelId[]; selected: ChannelId; riskLabels: Record<string,string> };
};
```

| Tab | Content model | CTAs |
| --- | --- | --- |
| Play/Download | Play link/embed; channel tip; download block; **stub ≠ shipped `stable`** banner | Play; Download; seed copy (Snake) |
| About | DESIGN one-liner + pillars; non-goals; engine; licenses; lineage; links to DESIGN/`game.yaml` | Open DESIGN; GitHub |
| Community | Lists/filters/post types/considerations/briefs/promote (§D) — **via `CommunityStore` adapter** | New post; flair filter; catalog |
| Changelog | Channel tips / promote evidence / freeze notes (links OK) | Channel filter |

**Snake-first:** only Snake gets Community e2e. Placeholders: shell tabs; Community “opens when active” or hide if `placeholder`.

---

### D. Snake Community tab IA

**Binding decisions** stay public (in-repo and/or official forum surfaces) — no private Discord as law (`01`, `reddit-formats`).  
**Reddit:** outreach/mirror only (tile link).  
**Persistence:** **pluggable** — UI talks to `CommunityStore`; near-term Seed handoff candidate = **GitHub Discussions and/or issues**; dedicated forum lib TBD. Do not hard-code a DB, JSON store, or vendor in Shelf code paths beyond an adapter.

#### Adapter contract (backend-agnostic)

```ts
/** Pluggable Community persistence — implement later; UI depends only on this. */
interface CommunityStore {
  listPosts(query: { game: string; flair?: string; status?: string; sort?: "new"|"hot"|"voted" }): Promise<PostSummary[]>;
  getPost(id: string): Promise<PostDetail>;
  createPost(input: ProposalInput | DiscussionInput): Promise<{ id: string; url: string }>;
  listConsiderations(game: string): Promise<ConsiderationRow[]>;
  voteConsideration(id: string, value: 1|-1|0): Promise<void>;  // Seed dial may be ack-only
  listBriefs(game: string): Promise<BriefSummary[]>;
  upsertBrief(brief: BriefDoc): Promise<{ id: string; url: string }>;
  // Promote remains git/PR shaped — store returns links + payload for intake-write-target
  exportBriefForTarget(briefId: string): Promise<TargetFrontmatterPayload>;
}

// Seed: GitHubDiscussionsPort (approved). Later: NodeBBPort | DiscoursePort via [meta].
// Prefer ForumPort method names from community-forum.md; CommunityStore below is the UI-facing alias.
```

IA below is **information architecture**, not storage design.

#### Forum structure (UX)

```
Community
├── Filters: flair · status · profile (accessible | hardcore | any) · sort
├── Lists: Open proposals · Considerations · Living briefs · Targets (links to YAML) · Implement intents
├── Post types: proposal | discussion | consideration | brief | implement-intent | meta
└── Compose → template by flair (proposal.md / implement-intent.md fields)
```

Votes attach to **OP / consideration row**, not every reply (`reddit-formats` rule of thumb).

#### Flairs (from `docs/reddit/flairs.md`)

| Flair | On Snake Community | Notes |
| --- | --- | --- |
| `feature` `bug` `balance` `mod` `promote` `refactor` `meta` | Yes | One primary flair per OP |
| `newGame` | **No** (org/Shelf-global) | Snake already seeded; next titles vote when leaving Seed (`10`) |

**Shelf-only (non-contradicting):** status/post-type badges `brief`, `consideration`; optional `outreach` on mirrored Reddit posts (non-binding). Prefer **badges** over new flairs if parity with Reddit ops kit matters.

#### Consideration catalog (Snake)

Profiles grounded in `DESIGN.md` + content-policy — not parallel law:

1. **Accessible (always-on main)** — readable ~3s, ≤2 min, offline/no account, basic input, determinism, all-ages, no paywall/DRM.  
2. **Optional hardcore** — opt-in via **mod** or **variant**; never forced onto main. Extremes/pillar bends → `variants/` + `variant.yaml` (`lineage-and-shelf`).

| Id | Statement | Accessible | Optional hardcore |
| --- | --- | --- | --- |
| `snake.a.readability` | Obvious board/snake/fruit/score | Always-on | Must not regress |
| `snake.a.session_length` | Default ≤2 min | Always-on | Speed mod may override (labeled) |
| `snake.a.offline` | No network/account for core | Always-on | N/A |
| `snake.a.input_basic` | Arrows/WASD + pause/restart; touch path | Always-on | N/A |
| `snake.a.determinism` | Seed+inputs ⇒ same sim | Always-on | N/A |
| `snake.a.all_ages` | Official all-ages | Always-on | N/A |
| `snake.a.no_paywall` | No toll/DRM | Always-on | N/A |
| `snake.h.speed_extreme` | Extreme tick allowlist | N/A main | Optional (mod) |
| `snake.h.wrap_walls` | Wrap/portal walls | N/A main | Optional (variant) |
| `snake.h.no_180_relax` | Allow 180 into self | Default off | Optional (variant) |
| `snake.h.endless` | No-win treadmill | N/A (non-goal) | Variant only |
| `snake.h.competitive_online` | Ranked online | N/A | N/A official Snake |

#### Pipeline (schema flow; storage-agnostic)

```
1. Post (proposal template fields)
2. Discuss (+ implement-intent when declaring attempt)
3. Attach/vote considerations (accessible always-ons auto-suggested)
4. considerations-approved (Seed: public ack + sunshine; later stage vote dials from 10)
5. Living brief.md (frontmatter ↔ target schema) — may live in adapter export and/or repo path
6. Promote → games/snake/targets/<id>.yaml (intake-write-target / PR + DCO)
7. Medium+ still needs accepted spec/ADR before code races (01) — brief ≠ ADR
```

Attribution example: “Proposed by **MediumSweetPotato**” only.

#### Status badges

**Proposal:** `open` → `needs-considerations` → `voting` → `considerations-approved` → `briefed` → `targeted` | `rejected`/`withdrawn`/`superseded`  

**Brief:** `draft` → `living` → `ready-to-promote` → `promoted` | `stale`/`retired`  

**Target** (`target.schema.md`): `proposed` → `eligible` → `funded`/`queued` → `active` → `review` → `merged`/`failed`/`rejected`  

UI **pipeline strip:** Proposal → Considerations → Brief → Target(status).

---

### E. Living brief.md shape

Bridge from approved Community artifacts → `games/<game>/targets/<id>.yaml`. Precedent: `tools/intake-write-target/fixtures/snake-local-hiscore.md`.

**Repo path (optional, not required for Seed):** `games/snake/briefs/<id>.md` — or adapter-exported markdown promoted by PR. Briefs are **intake/evidence**, not DESIGN law (`01`).

| Frontmatter | → Target field |
| --- | --- |
| `id` `game` `title` `flair` `lane` `size` `source` `created` | same |
| `acceptance_criteria[]` | same |
| `links.design/adr/discussion/issue/related` | same |
| `profiles` `considerations[]` | brief-only (echo into AC/notes) |
| `design_pin` | recorded at race open |

Body: Problem / Player value / Scope / Lane / Non-goals / Consideration checklist / AC / Success sniff / Promote checklist.  
Promote: validate against `docs/harness/target.schema.md` → write YAML (see `snake-local-hiscore.yaml`).

---

### F. Component list (implementation order)

UI contracts for Shelf deepen; **no forum-backend components** until research lands. Persistence behind `CommunityStore`.

| # | Component | Role | P |
| --- | --- | --- | --- |
| 1 | `CatalogTile` (deepen card) | Lifecycle/stage badges; stub metrics | P0 |
| 2 | `CatalogSort` | popularScore + tooltip | P0 |
| 3 | `GamePageShell` | Tabs + CTAs + stub≠stable banner | P0 |
| 4 | `TabPlayDownload` | Play/download/channel label | P0 |
| 5 | `TabAbout` | DESIGN summary + license/links | P0 |
| 6 | `TabCommunity` | Filters/lists/compose **against adapter** | P0 Snake |
| 7 | `CommunityStore` (interface + thin GitHub handoff stub later) | Pluggable persistence | P0 contract / P1 impl |
| 8 | `FlairBadge` / `FlairFilter` | flairs.md + badges | P0 |
| 9 | `ProposalComposer` | proposal.md fields | P0 |
| 10 | `ConsiderationCatalog` + `ConsiderationVoteRow` | Snake profiles | P0 |
| 11 | `PipelineStrip` | Proposal→…→Target | P0 |
| 12 | `BriefView` (+ export action) | Living brief; export for YAML | P0 |
| 13 | `PromoteToTargetAction` | Validate → PR / intake-write-target | P0 |
| 14 | `ImplementIntentForm` | implement-intent headings | P1 |
| 15 | `TabChangelog` | Manual feed stub | P1 |
| 16 | `OutreachRedditLink` | Labeled non-binding | P1 |
| 17 | `PlaceholderGameGate` | Block Community e2e | P0 |
| 18 | `TargetStatusBadge` | schema enum | P1 |
| 19 | `ChannelSwitcher` | risk labels | P2 |
| 20 | `VariantRelatedList` | lineage (GAPS) | P3 |

**Build slices:** (1) tile + shell + Play/About (2) Community UI wired to **interface** + read-only GitHub links OK (3) considerations + pipeline (4) brief export → target PR (5) changelog/channels/live metrics. **Do not** pick forum lib in these slices.

---

### G. Open questions / governance conflicts

1. **Binding surface vs Reddit “forum” wording** (`OVERVIEW`, DRAFT `reddit-formats`) — confirm Shelf Community + GitHub handoff vs Reddit outreach in a short ALIGN/ADR before treating any template set as live law.  
2. **When process becomes binding** — same promotion bar as reddit-formats; Seed may use maintainer ack + sunshine (`10`) without City vote theater.  
3. **OP vote vs per-consideration vote** — need one-line rule (e.g. OP opens brief; considerations bind profiles) without a second crown.  
4. **Brief authority** — confirm briefs = intake, not DESIGN law; Medium+ still needs ADR (`01`).  
5. **Hardcore mod vs variant UX** — DESIGN clear; confirm copy that pillar-bending forces `split-to-variant`.  
6. **`newGame` placement** — org-level only (recommended).  
7. **Popular-first under stub metrics** — formula above; confirm until live telemetry.  
8. **Forum backend (resolved for Seed)** — GitHub Discussions behind ForumPort; see `docs/shopfront/community-forum.md`. Remaining: when to graduate to NodeBB/Discourse.  
9. **GAPS Shelf residuals** (checksums, sideload UX, variant discovery) — Community deepen ≠ claiming Steam-like install is shipped.

---

### Citations

- `docs/governance/lineage-and-shelf.md`, `11-game-lifecycle.md`, `10-cold-start.md`, `01-design-authority.md`, `08-credit-economy.md`, `content-policy.md`  
- `docs/reddit/flairs.md`, `docs/governance/reddit-formats.md` (DRAFT), templates under `docs/reddit/templates/`  
- `docs/harness/target.schema.md`, `games/snake/targets/snake-local-hiscore.yaml`, fixture brief under `tools/intake-write-target/fixtures/`  
- `games/snake/DESIGN.md`, `game.yaml`, `README.md`  
- `shopfront/games.js`, `shelf.js`, `README.md` · `CONTRIBUTING.md` (DCO / `MediumSweetPotato`)

---
