---
id: snake-local-hiscore
game: snake
title: Local high-score table
flair: feature
lane: code
status: proposed
size: S
source: fixture://tools/intake-write-target/fixtures/snake-local-hiscore.md
created: "2026-09-07"
links:
  design: games/snake/DESIGN.md
  discussion: null
  issue: null
---

# [feature] Local high-score table — persist and show top scores offline

All-ages Seed-sized feature for Foss Snake. Offline-first; no account wall.

## Problem

Players finish a run and only see the current-session score. There is no local table of best scores to chase across reloads.

## Player value

A stranger can beat their own best without signing in. Supports the offline-first / all-ages official surface.

## Scope

- [x] S — small / L0–L1
- [ ] M — medium / L2
- [ ] L — large / L3

## Lane

code

## Non-goals

- Online / ranked leaderboards
- Cloud sync or accounts
- Changing scoring rules mid-season

## Acceptance criteria

- Persist top scores in localStorage (or equivalent) keyed by game slug
- Show a readable high-score table in the HUD or a dedicated panel
- Reset / clear scores is available and does not break a live run
- npm test still passes; sim remains deterministic for a fixed seed

## Success sniff test

Reload the page after a few runs; previous top scores are still listed; clearing them empties the table without crashing the sim.
