# Lineage model + Arcade Shelf

Games in Foss Arcade are **lineage-aware**: a parent title can grow channels, variants, and mods without pretending every fork is a hostile schism. Players install through the **Arcade Shelf**—a FOSS launcher with open manifests, no DRM, and sideload as a feature.

## Repository layout

```text
games/<slug>/
  DESIGN.md
  adr/
  channels/          # release trains (e.g. unstable, stable, season-N)
  variants/
    <sub-slug>/
      variant.yaml   # parent metadata + divergence notes
      DESIGN.md      # optional override / additive design surface
      ...
  mods/              # optional community or official mod packs (if used)
```

- **`games/<slug>/`** — canonical game root for the org catalog.
- **`channels/`** — named release streams (versioned builds players can opt into).
- **`variants/<sub-slug>/`** — intentional design forks that remain in the family tree.

Exact channel naming is per-game; the harness and Shelf read manifests, not folklore.

## `variant.yaml` — parent metadata

Each variant declares where it came from and what it claims to change. Minimal shape (illustrative):

```yaml
# games/<slug>/variants/<sub-slug>/variant.yaml
id: <sub-slug>
parent:
  game: <slug>
  ref: <git-sha-or-tag>      # parent tip at split
  channel: stable            # optional
diverges:
  - pillars: []              # DESIGN sections intentionally different
  - systems: []
shelf:
  title: "…"
  summary: "…"
  inherit_assets: true
```

Parent pointers make Shelf UI, docs, and races honest about lineage. Updating parent refs is a deliberate sync job—not silent rebase theater.

## Versions / channels vs variants vs mods

| Kind | What it is | Design law | Typical player action |
| --- | --- | --- | --- |
| **Version / channel** | Build on the same design spine (`unstable` vs `stable`) | Same `DESIGN.md` (+ ADRs) | Switch channel in settings / Shelf |
| **Variant** | Forked design direction with own (or additive) DESIGN | Own or layered DESIGN + ADRs | Install variant as related title |
| **Mod** | Optional pack; should not silently rewrite pillars | Must not contradict parent law unless marked incompatible | Toggle mods in settings |

**Rule of thumb:** if pillars change, it is a **variant** (or a slow-lane ADR on the parent)—not a “mod” that redefines the game by stealth.

## In-game settings: channel + mods

Player-facing settings (and Shelf) should:

1. **Switch channel** (e.g. `stable` → `unstable`) with clear risk labels.
2. **Enable/disable mods** with compatibility flags.
3. Prefer **not** to bury variant switches inside “mods”—variants are sibling titles in the lineage UI.

Harness and CI may validate that channel builds and mod packs declare compatibility with the pinned DESIGN revision.

## Arcade Shelf

**Arcade Shelf** is the Foss Arcade launcher experience: Steam/Epic-*like* browsing and install, rebuilt FOSS-first.

| Property | v1 intent |
| --- | --- |
| DRM | **None** |
| Manifests | **Open** (public URLs, signed optional but inspectable) |
| Sideload | **First-class** — install from local/path/URL manifests |
| Catalog | fossarcade org + community mirrors |
| Updates | Channel-aware; player chooses train |
| Identity | Optional; no account wall required to play FOSS titles |

Shelf does not become a closed store gate. If Shelf cannot install a game from a public manifest, that is a bug—not a business model.

## Targets scoped per game / variant

Race and funding **targets** are scoped:

- `game:<slug>` — parent line
- `game:<slug>/variant:<sub-slug>` — variant line
- Optional channel filters for release-train work

A job against the parent must not silently land pillar-breaking changes “for convenience.” When direction should diverge, use:

### `split-to-variant` job type

1. Open accepted spec for the split (why pillars diverge).
2. Harness creates `variants/<sub-slug>/` with `variant.yaml` parent metadata and DESIGN delta.
3. Future races for that direction target the **variant**, not the parent.
4. Shelf indexes the new lineage node.

This keeps the active pool honest: parallel design directions without forcing a single crown compromise that satisfies no one.

## Related

- [Design authority](./01-design-authority.md)
- [Dispute, capture & succession](./09-dispute-capture.md) (forced-fork norms; Shelf related forks)
- [Game lifecycle](./11-game-lifecycle.md) (archive/sunset badges; fork-out + parent metadata)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md) — Shelf distribution, signing, and update UX still TODO-heavy
