# Foss Snake (`snake`)

Phase-0 **pilot / harness prover** for Foss Arcade: small enough to reason about in public, strict enough to exercise races, gates, channels, and Shelf manifests.

Snake was **bootstrap-seeded** by founders (no community `[newGame]` vote); future games should arrive via `[newGame]` votes — see [reddit-formats.md](../governance/reddit-formats.md) (draft / later).

| Artifact | Path |
| --- | --- |
| Design constitution | [`games/snake/DESIGN.md`](../../games/snake/DESIGN.md) |
| Manifest sketch | [`games/snake/game.yaml`](../../games/snake/game.yaml) |
| Game README | [`games/snake/README.md`](../../games/snake/README.md) |
| Race targets | [`games/snake/targets/`](../../games/snake/targets/) |
| Playable stub | [`games/snake/`](../../games/snake/) (`index.html`, `src/sim/`, tests) |

## Why snake is the harness prover

- **Readable in seconds** — reviewers and judges can see failures without a design novel.
- **Deterministic core** — seed + inputs replay cleanly in CI (mechanical gates, not vibes).
- **Mod surfaces** — skins / speed / board / fruit packs prove “mod ≠ silent pillar rewrite.”
- **Short sessions** — playtest and soak evidence stay cheap on the commons pot.
- **No crown required** — DESIGN.md + ADRs bind the title; fork to `variants/` if pillars diverge.

A **playable stub** now lives under [`games/snake/`](../../games/snake/) (vanilla JS, headless tests). This index still covers premise / design / manifest. The stub is **not** a shipped `stable` build.

## Licensing

Foss Snake follows org defaults in [07-legal-ip.md](../governance/07-legal-ip.md) from day one: harness Apache-2.0, game code MIT (Apache-2.0 alt via ADR), assets CC0 or CC-BY-4.0 as declared, docs CC-BY-4.0; DCO + AI disclosure when contributions land. **Not legal advice**—see that doc’s disclaimer.

## Example first races (illustrative)

Targets will live under `games/snake/targets/` when opened. Early race shapes:

1. **Headless sim + replay AC** — pure core, fixed seed, input tape equals golden board hash.
2. **Board/schema validation** — reject illegal board/mod packs at gate time.
3. **Smoke web boot** — load shell, start run, pause/restart without sim drift.
4. **Promote-channel dry run** — once a build exists: CI/smoke → `unstable` → placeholder soak fields → evidence stubs (no silent admin ship).

Exact target YAML is not required for premise close-out.

## Non-goals (pilot)

- Full multiplayer / ranked online as the bootstrap proof.
- Building Unity/Unreal (or Godot-first) before web harness works.
- Token economics theater before mechanical gates exist.
- Treating green docs as a shipped `stable` player promise (**merge ≠ ship**).

## Related

- [Overview](../OVERVIEW.md) — first game = snake
- [Engines](../engines.md)
- [Player & ship path](../governance/03-player-ship-path.md)
- [Legal & IP](../governance/07-legal-ip.md) — org license defaults
- [Gaps](../governance/GAPS.md) — premise DONE; playable stub landed; first race targets still open
