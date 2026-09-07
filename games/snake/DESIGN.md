# Foss Snake — DESIGN.md (constitution)

| Field | Value |
| --- | --- |
| **Name** | Foss Snake |
| **Slug** | `snake` |
| **Status** | Playable stub (vanilla JS; not a shipped stable build) |
| **Parent** | none (catalog root title) |

This file is **law** for Foss Snake. Medium+ changes need an accepted ADR under `adr/` before races open. Judges score design-fit against this document (and cited ADRs), not private taste. Disagree? Patch the slow lane—or fork to `variants/`.

---

## One-liner

A tiny, readable FOSS snake: eat fruit, grow, don’t crash—sessions fit a coffee break, and every race can prove determinism and mod surfaces without a king.

---

## Pillars

1. **Readable in ~3 seconds** — board, snake, fruit, and score are obvious at a glance; no tutorial wall.
2. **≤2 minute sessions** — a full run (or a clear loss) fits under two minutes at default speed; depth comes from skill and mods, not grind.
3. **Deterministic core** — same seed + same inputs ⇒ same simulation outcome (RNG and tick model are part of the contract).
4. **Mod-friendly** — skins, speed, board size, and fruit packs are first-class surfaces with declared schemas—not silent pillar rewrites.
5. **Harness prover** — this title exists to exercise Foss Arcade races, gates, channels, and Shelf manifests on a game small enough to reason about in public.

### Non-goals

- Competitive online multiplayer / ranked ladders as core (party forks → `variants/`).
- Always-online, account-gated, or DRM’d play.
- Deep RPG meta, gacha, or endless content treadmill.
- Photoreal / AAA fidelity; vibe over polygons.
- Using “mods” to redefine pillars without a variant or ADR.
- Shipping a full game engine inside the snake repo—use the declared web stack (Godot optional later).

---

## Core loop

1. Spawn on a fixed grid with a short snake and one fruit (seeded).
2. Each tick, snake advances one cell in the facing direction.
3. Eat fruit → grow + score + spawn next fruit (deterministic placement rules).
4. Hit wall or self → lose; fill the board (or hit a declared length target) → win.
5. Restart is instant; no load screens, no wallet.

Offline-first. Network is not required for the core loop.

---

## Controls (v1)

| Input | Action |
| --- | --- |
| Arrow keys / WASD | Change facing (queue at most one turn per tick; no 180° instant reverse into self unless a variant opts in) |
| Pause / Esc | Pause (does not advance sim) |
| R / Restart | New run (new or reused seed per UI; seed always visible/copyable for races) |

Touch / D-pad sketch: same four directions + pause/restart. Exact binding tables land with implementation ADRs; this section locks **intent**.

---

## Win / lose

| Outcome | Condition (v1 default) |
| --- | --- |
| **Lose** | Head enters wall or occupied self cell |
| **Win** | Snake occupies every free cell **or** reaches `win_length` if set in board/mod config (default: fill-board) |
| **Score** | Fruits eaten (primary); optional time/ticks as secondary for races—never secretly reweighted mid-season |

Ties in races use harness rules (smaller diff → stronger tests → earlier complete), not ad-hoc score inflation.

---

## Mod surfaces

Mods **must** declare compatibility with a DESIGN revision. Pillar changes are variants (or slow-lane ADRs)—not stealth mods.

| Surface | Intent | Notes |
| --- | --- | --- |
| **Skins** | Colors / sprites / tilesets | Cosmetic only; no hitbox or tick changes |
| **Speed** | Tick rate / cells-per-second presets | Bounded allowlist; extremes belong in variants |
| **Board** | Width × height, wrap vs solid walls | Schema-validated; huge boards may need perf budgets |
| **Fruit packs** | Fruit types, point values, spawn weights | Deterministic spawn still required; no network loot tables |

Mods live under the game’s mod layout when implemented; until then, schemas are sketched in targets/ADRs. Incompatible packs must say so—no silent pillar override.

---

## Testability / determinism

- **Fixed timestep** simulation; render may interpolate, logic must not.
- **Seeded RNG** for fruit placement (and any later random cosmetic that must not affect AC).
- **Replay**: record seed + input stream → bitwise-or cell-equal replay in CI.
- **Headless / pure core**: sim runnable without DOM/GPU for acceptance tests.
- Race attempts that break determinism fail mechanical gates—even if “fun.”
- Pin DESIGN.md / ADR git sha on race open (org-wide rule).

---

## Variants (not main)

Experimental or pillar-bending ideas go under `variants/<sub-slug>/` with `variant.yaml` parent metadata—not forced onto `snake` main.

Examples (pointers only; not commitments):

| Idea | Why a variant |
| --- | --- |
| Wrap-world / portal walls | Changes fail-space fantasy |
| Multi-fruit chaos / moving fruit | Shifts readability + determinism knobs |
| Two-player hotseat | Social surface ≠ solo prover |
| Endless / no-win treadmill | Breaks ≤2min / win clarity |
| Godot-native primary stack | Engine lineage diverge; web remains parent default |

Use `split-to-variant` when a direction should not bind the parent.

---

## Licensing

Licensing follows Foss Arcade org defaults in [`docs/governance/07-legal-ip.md`](../../docs/governance/07-legal-ip.md) (not legal advice): game code **MIT** (Apache-2.0 alternative only via ADR), assets **CC0** or **CC-BY-4.0** as declared in-tree, docs **CC-BY-4.0**, harness **Apache-2.0**. DCO sign-off and AI disclosure apply when contributions land. No copyright-assignment CLA to a founder.

---

## Related

- Manifest: [`game.yaml`](./game.yaml)
- Game docs index: [`../../docs/games/snake.md`](../../docs/games/snake.md)
- Design authority: [`../../docs/governance/01-design-authority.md`](../../docs/governance/01-design-authority.md)
- Lineage & Shelf: [`../../docs/governance/lineage-and-shelf.md`](../../docs/governance/lineage-and-shelf.md)
- Legal & IP: [`../../docs/governance/07-legal-ip.md`](../../docs/governance/07-legal-ip.md)
