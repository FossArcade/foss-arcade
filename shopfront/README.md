# Arcade Shelf (shopfront v0)

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
| `/shopfront/` | This Arcade Shelf |
| `/games/snake/` | Foss Snake (Play button target) |

Snake alone (port 4321):

```bash
npm start
```

## Catalog

Game cards come from [`games.js`](./games.js). Add entries there as titles land on the shelf.

## Domain

Public shopfront + desktop builds will live at **fossarcade** (domain on the way). Until then, GitHub + `npm run shopfront` are the front door.

## Community

- Reddit: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) — catalog cards link here via `games.js` `community.subreddit`.

## Notes

- Catalog player/activity/rating stats are placeholders until live metrics are wired up; subreddit is live.
- Download buttons are placeholders until desktop packages ship.
- Keep the shelf all-ages; see [content policy](../docs/governance/content-policy.md).
