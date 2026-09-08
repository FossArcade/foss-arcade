# Arcade Shelf (shopfront)

Friendly all-ages landing for Foss Arcade — static HTML/CSS/JS, no build step.

## Run locally

From the **repo root**:

```bash
npm run shopfront
```

Opens a static server on **http://localhost:4322** serving the monorepo root so:

| Path | What |
| --- | --- |
| `/` | Redirects to `/shopfront/` |
| `/shopfront/` | Arcade Shelf (popular-first tiles) |
| `/shopfront/game?id=snake` | Game page (Play / About / Community / Changelog) |
| `/games/snake/` | Foss Snake (Play button target) |

Snake alone (port 4321):

```bash
npm start
```

## Catalog

Game tiles use the `GameTile` view model in `games.js`. Home: `shelf.js`. Game page: `game.html` + `game.js` (Play/About/Community for Snake; Changelog stub). Popular-first sort; stub metrics only.




## Run hash helpers

Pure helpers for shareable channel plus mod runs.

- run-hash helpers and play-run apply/confirm planning
- game.js Play tab Copy/Paste and Default Play

See design docs. Tests via test:shopfront.


### Run hash → Snake (smoke)

Play tab Copy/Paste builds run hash links into /games/snake/. Snake applies channel + known mods from the real registry (games/snake/mods/).

```bash
npm run shopfront
# http://localhost:4322/shopfront/game?id=snake
# http://localhost:4322/games/snake/?run=fa1_snake_unstable_snake.mod.speed-extreme
```

See docs/design/run-hash-deepen.md. Hiscores are namespaced by canonical fa1_ in the game HUD.

## Domain

Public shopfront + desktop builds will live at **fossarcade** (domain on the way). Until then, GitHub + `npm run shopfront` are the front door.

## Community

- **Binding commons:** Shelf Community + GitHub Discussions / briefs / targets (ForumPort) — see `docs/shopfront/community-forum.md` and `docs/ALIGN.md`.
- **Reddit:** [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) — outreach only (`community.subreddit` on tiles).

### Slice 2 (Community tab)

- `forum-port.js` — `ForumPort` contract (+ `CommunityStore` thin alias).
- `github-discussions-port.js` — read-only Seed adapter: category / search / compose URLs for `FossArcade/foss-arcade` Discussions (no GraphQL in UI).
- `community-ui.js` — TabCommunity: FlairFilter / FlairBadge, PipelineStrip, proposal/consideration/brief lists (empty + Open on GitHub), compose stubs, PlaceholderGameGate for non-Snake.
- Snake only for Community e2e; Changelog remains a stub.

### Slice 3 (considerations + pipeline)

- `SNAKE_CONSIDERATION_CATALOG` in `forum-port.js` — accessible always-on + optional hardcore rows (design §D).
- `ConsiderationCatalog` + `ConsiderationVoteRow` in Community tab — Seed votes are local ack / sunshine stubs (link to Discussions; no backend).
- `PipelineStrip` highlights from flair / status filters or a selected stage (not pure decoration).
- Category seed hygiene: `SEED_CATEGORY_SLUG_MAP` identity slugs (only `q-and-a→q-a`); checklist in `docs/shopfront/discussion-seed.md` (categories created).

## Notes

- Catalog player/activity/rating stats are **stub** until a live metrics pipeline; do not invent counts. Default tip is **unstable** (stub != shipped stable).
- Download buttons are placeholders until desktop packages ship.
- Keep the shelf all-ages; see [content policy](../docs/governance/content-policy.md).
