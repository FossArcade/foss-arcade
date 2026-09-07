# Engines & play stacks

Foss Arcade is **engine-agnostic at the forge layer**: pools, races, judges, channels, and Arcade Shelf treat games as public artifacts with manifests—not as “Phaser projects” or “Godot projects” exclusively. Engines differ in **runners and budgets**; they share the same coordination spine.

## Engine-agnostic manifests

Every shippable title declares, in-repo (Shelf / `game.yaml` / install manifest):

| Field | Role |
| --- | --- |
| **engine** | Stack id and version pin (e.g. `phaser@…`, `godot@4.x`, later `unity@…`) |
| **play method** | How players launch: browser (wasm/web), native export, containerized runner, etc. |
| **artifacts** | Build outputs, checksums, size budgets, optional signatures |
| **channel tips** | Pointers into `unstable` / `stable` / `season-N` (see ship path) |

Harness jobs select a **runner** from the engine field. Rubrics, DESIGN.md law, promote gates, and Shelf UX stay the same shape across stacks.

## v1 first-class FOSS stacks

**v1 includes both web and Godot** as first-class playable stacks—not web-only.

| Stack | Examples | Why v1 |
| --- | --- | --- |
| **Web** | Phaser, Svelte (+ canvas/WebGL), other FOSS browser engines | Fast CI, easy Shelf preview, low friction for strangers |
| **Godot** | Godot 4.x FOSS exports (desktop / web export where declared) | Full FOSS engine, strong offline-native path, same open process |

Both are **FOSS end-to-end** by default: open game source, open engine, open manifests. A title picks one primary engine in manifest; variants may differ if lineage declares it.

Playable v1 still means **offline-first** core loops (see [03-player-ship-path.md](./governance/03-player-ship-path.md))—browser or Godot export alike.

## Unity / Unreal later (not default)

Closed or mixed engines (Unity, Unreal, and similar) are **later, optional catalog entries**, not the default forge posture.

| Expectation | Rule of thumb |
| --- | --- |
| **Badge** | Shelf shows an honest **open-game / closed-engine** (or mixed) badge—no greenwash |
| **CI / escrow** | Heavier: licensed runner images, export escrow, dependency and license attestations |
| **Budgets** | Larger compute/time/size budgets; stricter quota dials |
| **Default** | Not assumed for new fossarcade pilots; web + Godot remain the bootstrap path |

Forks may use anything; the org catalog and harness templates prioritize FOSS stacks until phase maturity and contributor capacity say otherwise.

## Same spine, different runners

Across engines, Foss Arcade keeps one model:

- **Active pool**, vote/fund board, seasons
- **Parallel attempts (races)** + public judge / scorecards
- **Channels** (`unstable`, `stable`, `season-N`) and `promote-channel` targets
- **Arcade Shelf** as player front door

What changes per engine:

- **Runners** — image, export toolchain, play-method smoke
- **Budgets** — CI minutes, artifact size, perf thresholds in `game.yaml`
- **Evidence shapes** — same classes (playtest / regress / perf / migration), stack-specific tooling underneath

Do not invent a second governance crown per engine. If process differs, document it as runner/budget policy—not a private Unity lane.

## Practical sequencing

| Horizon | Stacks |
| --- | --- |
| **v1** | **Web** (e.g. Phaser / Svelte) **and Godot** — both first-class |
| **Later** | Unity / Unreal (and peers) behind open-game/closed-engine badges, heavier CI/escrow, non-default |

**Order of ops:** pick a v1 FOSS stack → playable offline build → Shelf manifest → `unstable` → evidence → `stable`. Engine choice does not waive ship gates.

## Related

- [Overview](./OVERVIEW.md)
- [Player & ship path](./governance/03-player-ship-path.md)
- [Unstable → stable promotion](./governance/03b-unstable-to-stable.md)
- [Lineage and Arcade Shelf](./governance/lineage-and-shelf.md)
- [Gaps](./governance/GAPS.md)
