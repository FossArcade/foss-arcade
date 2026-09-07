# Foss Snake (`snake`)

FOSS Arcade’s phase-0 pilot: a tiny snake title used to **prove the harness** (races, gates, channels, mods, Shelf manifests).

**Status:** playable stub (vanilla JS). Not a shipped `stable` player promise — merge ≠ ship.

| Doc | Role |
| --- | --- |
| [DESIGN.md](./DESIGN.md) | Constitution (pillars, loop, mods, determinism) |
| [game.yaml](./game.yaml) | Manifest sketch (engine, channels, boot job caps, soak placeholders) |
| [targets/](./targets/) | Race / promote targets (YAML; see [schema](../../docs/harness/target.schema.md)) |
| [implement walkthrough](../../docs/walkthroughs/implement-snake-target.md) | Human steps: sync → branch → AC → tests → DCO PR |
| [../../docs/games/snake.md](../../docs/games/snake.md) | Short docs index |
| [LICENSE](./LICENSE) | MIT (game code) |

## Play

From the monorepo root, run the start script (serves this folder on port 4321).

- **Arrows / WASD** — change facing (one queued turn per tick; no 180° reverse)
- **Esc** — pause (sim does not advance)
- **R** — new run (new seed; current seed stays copyable in the HUD)
- Seed is shown, editable, and copyable for races (`?seed=` on the URL)

## Layout

| Path | Role |
| --- | --- |
| `src/sim/game.js` | Pure headless sim |
| `src/sim/rng.js` | Seeded PRNG |
| `src/render/canvas.js` | Canvas view (no ticks) |
| `src/main.js` | Fixed-timestep loop + input |
| `tests/game.test.js` | Movement, growth, collision, determinism, win |

Open targets live under [`targets/`](./targets/) (e.g. `snake-local-hiscore`). To implement one on your machine, follow [implement-snake-target.md](../../docs/walkthroughs/implement-snake-target.md).

Variants that bend pillars belong under `variants/`, not silent mainline mods. See org [design authority](../../docs/governance/01-design-authority.md).
