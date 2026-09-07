# Target schema (minimal)

Harness **targets** live at `games/<game>/targets/<id>.yaml`. They are the Seed path for races and promote jobs. GitHub issues remain an optional parallel intake surface.

This note is the human-readable contract. Fields may tighten via ADR; keep ids stable once a target is `eligible` or beyond.

## Required fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug; file name should match (`<id>.yaml`). Prefer `<game>-<short-name>`. |
| `game` | string | Game slug (`snake`, …). Must match parent `games/<game>/`. |
| `title` | string | Short human title (one line). |
| `flair` | string | Primary Reddit-style flair / job kind: `feature`, `bug`, `balance`, `mod`, `promote`, `refactor`, `meta`, `newGame`. |
| `lane` | string | Primary lane: `spec`, `code`, `promote`, `meta`. |
| `status` | enum | `proposed` / `eligible` / `funded` / `queued` / `active` / `review` / `merged` / `failed` / `rejected`. |
| `source` | string | Provenance URL or fixture path (Reddit permalink, discussion, `fixture://…`). |
| `acceptance_criteria` | string[] | Executable or playable checks; empty list only while drafting. |
| `size` | enum | `S` / `M` / `L` (Seed maps S ≈ L0–L1). |
| `created` | string | ISO-8601 date (`YYYY-MM-DD`) or datetime. |
| `links` | object | Optional related paths/URLs (see below). |

## Optional / nested

```yaml
links:
  design: games/snake/DESIGN.md   # relative to repo root
  adr: null
  issue: null                     # GitHub issue URL if parallel intake
  discussion: null                # Reddit / forum OP
  related: []                     # other target ids or paths
```

## Example

```yaml
id: snake-local-hiscore
game: snake
title: Local high-score table
flair: feature
lane: code
status: proposed
source: fixture://tools/intake-write-target/fixtures/snake-local-hiscore.md
acceptance_criteria:
  - Persist top scores in localStorage (or equivalent) keyed by game slug
  - Show a readable high-score table in the HUD or a dedicated panel
  - Reset / clear scores is available and does not break a live run
  - npm test still passes; sim remains deterministic for a fixed seed
size: S
created: "2026-09-07"
links:
  design: games/snake/DESIGN.md
  discussion: null
  issue: null
```

## Status lifecycle (Seed)

`proposed` → `eligible` → (`funded` / `queued`) → `active` → `review` → `merged` / `failed` / `rejected`

At Seed, humans may advance status by PR; harness automation can tighten later.

## Related

- Writer: [`tools/intake-write-target/write.mjs`](../../tools/intake-write-target/write.mjs)
- Reddit interim intake (issues): [`tools/reddit-intake/README.md`](../../tools/reddit-intake/README.md)
- Player and ship path (promote targets): [`../governance/03-player-ship-path.md`](../governance/03-player-ship-path.md)

