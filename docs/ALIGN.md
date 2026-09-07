# Docs alignment notes (2026-09-06)

Docs skim for contradictions (OVERVIEW, README, shopfront, 01–11, content-policy, reddit-formats, `docs/reddit/*`, games/snake, credit dual-trust). Small fixes only — constitution not rewritten.

## Checked / fixed

- **Channel naming:** tip train is **`unstable`** (not nightly). Historical “was nightly” notes in 03/03b/GAPS kept on purpose. OVERVIEW lineage + lineage-and-shelf examples updated from `beta` → `unstable` / `stable`.
- **Org URLs:** GitHub links use **[FossArcade](https://github.com/FossArcade)** casing (`docs/README.md`, OVERVIEW org sentence). Narrative `fossarcade` brand / domain-on-the-way unchanged.
- **Seed bootstrap Snake:** Consistent across OVERVIEW, 10-cold-start, reddit-formats, `docs/reddit/*`, games/snake docs — first title seeded without `[newGame]` vote; later titles need votes when leaving Seed.
- **Shopfront path:** `./shopfront/` + `npm run shopfront` on **4322**; root `/` → `/shopfront/`; Snake play on **4321** via `npm start` — README / shopfront README / package.json agree.
- **Dual trust:** Mentioned wherever credit/rep soft powers are summarized — OVERVIEW credit blurb, 04 Reputation rules, 09 earn-path seats; full contract remains [08-credit-economy.md](./governance/08-credit-economy.md#dual-trust-game-based-vs-general).
- **Reddit status:** Sub is live at [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade); shopfront catalog links it. [reddit-formats.md](./governance/reddit-formats.md) stays **DRAFT / LATER** (process not yet promoted); ops kit + [SETUP.md](./reddit/SETUP.md) remain paste-ready for flairs/Automod. Not treated as live forum law until promoted.

## Intentional tensions left alone

- Brand string `fossarcade` (domain / lowercase narrative) vs GitHub org **FossArcade** — both correct in their lanes.
- `channels/` directory sketch in lineage vs `game.yaml` channel list — layout illustrative; manifests remain source of truth.
- Content policy / CoC split (game content vs people behavior) — deliberate, not a contradiction.
- Reddit governance draft vs ops kit files — draft = law-when-promoted; ops kit = paste-ready; sub [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) is live.
