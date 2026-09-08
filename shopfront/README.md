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

Game tiles use the `GameTile` view model in `games.js`. Home: `shelf.js`. Game page: `game.html` + `game.js` (Play/About wired for Snake; Community/Changelog stub). Popular-first sort; stub metrics only.



## Domain

Public shopfront + desktop builds will live at **fossarcade** (domain on the way). Until then, GitHub + `npm run shopfront` are the front door.

## Community

- **Binding commons:** Shelf Community + GitHub Discussions / briefs / targets (ForumPort) — see `docs/shopfront/community-forum.md` and `docs/ALIGN.md`.
- **Reddit:** [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) — outreach only (`community.subreddit` on tiles).

## Notes

- Catalog player/activity/rating stats are **stub** until a live metrics pipeline; do not invent counts. Default tip is **unstable** (stub != shipped stable).
- Download buttons are placeholders until desktop packages ship.
- Keep the shelf all-ages; see [content policy](../docs/governance/content-policy.md).
