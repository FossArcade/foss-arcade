# Run hash — deep design

**Audience:** Foss Games Chief · Marquee (Shelf)  
**Status:** Product lock flesh-out (2026-09-08)  
**Related:** [`shelf-byo-github-and-run-hash.md`](./shelf-byo-github-and-run-hash.md), [`../governance/lineage-and-shelf.md`](../governance/lineage-and-shelf.md), [`../../shopfront/run-hash.js`](../../shopfront/run-hash.js)

## What problem it solves

A friend (or a race report) says “play Snake like *this*.” You need one pasteable string that means: **which release train** + **which optional packs** — not “which of 10,000 commits.” Default Play stays boring: **latest stable, no mods**.

## The three layers (do not mix them)

| Layer | What it is | In the hash? |
| --- | --- | --- |
| **Channel** | Moving tip: `stable` / `unstable` / `season-N` | Yes |
| **Mod / feature pack** | Named optional pack with a stable id | Yes (id list) |
| **Commit / build tip** | Exact git sha or build id | Optional (`_t…`) only for repro |
| **Variant** | Different DESIGN pillars | **Never** — separate title |
| **Bugfix merged to main** | Just lands on `unstable` then promotes | **Not a hash bit** — it’s “whatever the channel tip is” |

So thousands of commits do **not** explode the hash. Commits advance the **channel tip**. The hash usually says `unstable` (= “whatever tip is live”), not a sha. Pin a tip only when you need a pixel-perfect repro.

---

## How a run is represented

```text
RunSpec v1
  game:    snake
  channel: stable | unstable | season-3
  mods:    [snake.mod.speed-extreme, snake.mod.skin-neon]  // sorted
  tip?:    3a1b2c7   // optional short sha / build id
```

**Canonical string** (already implemented in `shopfront/run-hash.js`):

```text
fa1_snake_stable
fa1_snake_unstable_snake.mod.skin-neon~snake.mod.speed-extreme
fa1_snake_unstable_snake.mod.speed-extreme_t3a1b2c
```

Also accepted: verbose `?channel=unstable&mods=snake.mod.speed-extreme` (debug alias).

Zero new deps: pure JS encode/decode, no crypto library for v1.

---

## What it looks like (Play tab)

```
┌ Play / Download ─────────────────────────────┐
│  [ Play ]     ← default: stable, mods off     │
│  Channel: (•) Stable  ( ) Unstable  [risk]    │
│  Features / mods                              │
│    ☐ Speed extreme     snake.mod.speed-extreme│
│    ☐ Neon skin         snake.mod.skin-neon    │
│  Active run: fa1_snake_unstable_…             │
│  [Copy hash] [Copy link]  Paste: [________] ▶ │
└───────────────────────────────────────────────┘
```

Paste flow: decode → if `unstable`, show risk confirm → check each mod against the **registry** (known? compatible with channel? conflicts?) → apply or offer “strip incompatible.” Never silently drop mods. Cross-game hash → confirm navigate to that game, then apply.

In-game (later): small chip showing channel + mod count; pause menu “Copy run hash.”

---

## How every feature / fix / etc. gets allocated

Think **registry**, not “bit per commit.”

**1. Bugfix / small chore**  
Merges to main → lands on `unstable` tip → eventually `stable`.  
No new mod id. Hash `fa1_snake_unstable` already means “latest unstable including that fix.”

**2. Optional feature (player can turn on/off)**  
Becomes a **mod pack** with a stable namespaced id:

```text
snake.mod.<name>     // e.g. snake.mod.speed-extreme
```

Lives under something like:

```text
games/snake/mods/speed-extreme/
  mod.yaml          # id, title, compatibleChannels, conflicts, designRev
  …assets/code…
```

`mod.yaml` sketch:

```yaml
id: snake.mod.speed-extreme
title: Speed extreme
compatibleChannels: [unstable, stable]   # or [unstable] only while experimental
conflicts: []
replacesPillars: false    # if true → refuse; must be a variant
designRev: <sha-or-tag>   # DESIGN revision this pack claims
```

Allocation path (commons): proposal → considerations → brief → target → PR → registry entry. The **id is forever**; implementations can move. UI may show a short label (“Speed extreme”); the hash always stores the full id.

**3. Balance tweak**  
- If it’s the new default feel → commit on channel tip (no hash bit).  
- If it’s optional alternate rules → mod id.  
- If it bends pillars → **variant**, new Shelf title, not a mod.

**4. UI / accessibility option**  
Prefer first-class settings if always-on-safe; optional pack only if it changes sim/rules enough to need race isolation.

**Id rules (scale + BYO):**  
`{game}.mod.{slug}` from day one — no short ids in the hash (avoids collisions when 1000 community games exist). Short names are display-only.

---

## Staying manageable with thousands of commits

1. **Channels are pointers, not changelogs.** Shelf resolves `stable` / `unstable` to current artifacts via manifest. Hash does not list commits.  
2. **Tip pin is rare.** Race repros / bug reports add `_t<shortsha>`. Everyday shares omit tip.  
3. **Mod registry is small.** Dozens of packs per game, not thousands. Each pack has its own version/compat; old packs stay installable or marked retired.  
4. **Don’t version the hash per commit.** Bump `fa1_` → `fa2_` only on *encode format* breaks.  
5. **Compat is data, not folklore.** Unknown mod id → soft fail. `replacesPillars: true` → hard refuse.  
6. **Content-address builds (later).** Channel tip → artifact digest in manifest; hash tip can eventually pin digest instead of git sha — still optional.  
7. **Tests stay cheap.** Pure encode/decode unit tests (already 20); game tests stay deterministic with seed + inputs; mod packs declare sim impact.

Mental model: **git history is the factory; the hash is the shopping list** (train + optional extras), not the receipt for every bolt.

---

## Minimise dependencies

| Piece | Approach |
| --- | --- |
| Encode/decode | Pure ESM already in `shopfront/run-hash.js` — no npm deps |
| Registry | Static YAML/JSON in the game repo; Shelf fetches or vendors at build |
| Clipboard UX | Browser Clipboard API / fallback textarea — no libs |
| Deep links | Query params on existing shopfront routes |
| Auth | None for play/hash |
| Compression | v1 stays readable `fa1_…`; only move to base58/binary if hashes get huge (many mods) — postpone |

Avoid: protobuf, custom binary codecs, server-side hash shorteners, accounts to resolve hashes.

---

## End-to-end example

1. Community ships `snake.mod.speed-extreme` onto `unstable`.  
2. You enable it on Play tab → hash becomes  
   `fa1_snake_unstable_snake.mod.speed-extreme`  
3. Friend pastes → unstable + that mod.  
4. Fix lands tomorrow on `unstable` → same hash now includes the fix automatically.  
5. For a tournament freeze:  
   `fa1_snake_unstable_snake.mod.speed-extreme_t8f3a91`  
6. After promote: Default Play is `fa1_snake_stable`; extreme speed may stay unstable-only until compat says otherwise.

---

## Seed → later

**Seed (now):** helpers + Copy/Paste stub; stub mod list OK; Default Play helper already encodes stable-when-shipped.  
**Next:** real `mods/*/mod.yaml` for Snake; resolve channel tips from manifests.  
**Later:** in-game chip; digest tips; BYO games with their own `{game}.mod.*` registries.
