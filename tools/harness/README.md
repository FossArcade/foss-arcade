# Harness tools (Seed)

Seed helper scripts for targets.

From repo root run `npm run foss` (or node tools/harness/foss.mjs).

## What it does

1. Scan games target YAML files (skip empty and gitkeep)
2. List game, id, title, status, size, flair
3. Pick by number or quit
4. Print summary and next steps (branch, test, signed commit, PR)
5. Follow-up: work / back / quit

Smoke: send 1 then q on stdin; expect snake-local-hiscore listed and clean exit.

Related: docs/harness/target.schema.md, docs/walkthroughs/implement-snake-target.md, tools/intake-write-target/.
