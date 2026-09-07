# Reddit setup checklist

Practical human steps to stand up the Foss Arcade subreddit. Paste-ready materials live next to this file.

> **Live sub:** [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) — community **created**. Remaining steps below are flairs / Automod / wiki / welcome pin / mods.

> **Honest limit:** An assistant (or any bot using the public Reddit API alone) **cannot create a community for you**. Reddit requires a signed-in human account in the Create Community UI. You must create the sub yourself (or while sharing your screen). After it exists, mods can paste Automoderator / flairs / wiki from this kit.

Prefer a **brand account** (e.g. **MediumSweetPotato** — same handle as GitHub — or a dedicated FossArcade identity) rather than a personal Reddit if you want separation. Matching brand across GitHub + Reddit keeps the commons story clear.

Canonical planning note (still DRAFT until process binds the forge): [governance/reddit-formats.md](../governance/reddit-formats.md).

---

## 1. Before you click Create

- [x] Decide the Reddit account (prefer MediumSweetPotato / FossArcade brand, not personal if you want separation).
- [x] Verify sub name availability yourself in Reddit search / create UI (names can be taken).
- [x] **Chosen name:** **[r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)** (live)
  - Earlier candidates considered: r/FossArcade, r/fossarcade, r/Foss_Arcade

## 2. Create Community (step-by-step)

**Done** — sub is live at https://www.reddit.com/r/FOSSArcade

Reference steps (for posterity / forks):

1. Log into Reddit with the brand account.
2. Open **Create Community** (sidebar / user menu — UI moves occasionally; search Reddit help for "create a community" if needed).
3. **Name:** `FOSSArcade` → becomes `r/FOSSArcade`.
4. **Type:** **Public**.
5. **Mature (18+) / NSFW:** **Off**.
6. **Topics / age:** all-ages friendly; no adult community flag.
7. Create the community.
8. You are the first mod — keep it that way for Seed; add commons mods later when trust is earned ([10-cold-start](../governance/10-cold-start.md)).

---

## 3. Description / sidebar blurb (paste-ready)

Short description (community settings):

```text
Free, open-source games — built in public. Propose, vote, race, merge. All-ages venue.
```

Sidebar / widgets (expand as you like):

```markdown
**Foss Arcade** — FOSS games forged in the open.

- Community: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)
- Play & catalog: [Arcade Shelf (shopfront)](https://github.com/FossArcade/foss-arcade/tree/main/shopfront) · run `npm run shopfront`
- Code: [github.com/FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade)
- First game: **Foss Snake** (bootstrap seed — later titles use `[newGame]` votes)
- Content: **all-ages** official surfaces ([policy](https://github.com/FossArcade/foss-arcade/blob/main/docs/governance/content-policy.md))
- Templates: wiki / [docs/reddit/templates](https://github.com/FossArcade/foss-arcade/tree/main/docs/reddit/templates)
```

Also paste **About** from [copy/about.md](./copy/about.md) into the community About field if separate.

## 4. Flairs checklist (exact from [flairs.md](./flairs.md))

Create **post/link flairs** with these exact names (one primary flair per OP). Enable "require flair" if the UI allows.

- [ ] `newGame` — Propose a new game title for the Arcade
- [ ] `feature` — New player-facing capability within an existing game
- [ ] `bug` — Defect / incorrect behavior vs DESIGN or accepted AC
- [ ] `balance` — Numbers / pacing / difficulty shifts (still DESIGN-bound)
- [ ] `mod` — Mod pack / overlay / optional content (not silent pillar rewrite)
- [ ] `promote` — Channel promotion / ship-path evidence (`unstable` → `stable`, etc.)
- [ ] `refactor` — Internal structure with no intended player-facing change
- [ ] `meta` — Forum, process, docs, harness UX—not a game race

---

## 5. Automoderator

1. Open **Mod tools → Automoderator** (or wiki page `config/automoderator` for the sub).
2. Paste the full contents of [automoderator.yaml](./automoderator.yaml).
3. Save. Do a quiet burn-in; tweak spam heuristics after real traffic.
4. Keep flair names in sync with [flairs.md](./flairs.md).

Reddit Automod docs: https://www.reddit.com/wiki/automoderator/full-documentation

---

## 6. Wiki or pinned post — templates

- [ ] Create a wiki page (or stickied meta post) linking:
  - [templates/proposal.md](./templates/proposal.md) — OP proposal body
  - [templates/implement-intent.md](./templates/implement-intent.md) — attempt reply body
- [ ] Optional: mirror paste-ready text into the wiki so Redditors need not leave the site.

---

## 7. First pin — bootstrap + next games

Stickied welcome post — paste from [copy/welcome.md](./copy/welcome.md). Must say clearly:

- **Foss Snake** is the **bootstrap** seed (no community `[newGame]` vote required for that first title).
- **Next games** open as **`[newGame]`** posts and should be **voted** before becoming in-repo titles / race targets.

---

## 8. Mod list

- [ ] At least **you** (brand account) as mod.
- [ ] Later: add commons maintainers when Seed→Village trust exists — no private Discord as source of truth for appointments ([09](../governance/09-dispute-capture.md)).

---

## 9. Content policy one-liner (sidebar)

Keep this visible in sidebar / rules:

> Official Foss Arcade is an **all-ages** venue. Mods: see content-policy.md for the full rule. Forks elsewhere are fine — they just are not official Foss Arcade.

Full policy: [content-policy.md](../governance/content-policy.md).

---

## 10. After create — shopfront follow-up

**Done** in-repo: [`shopfront/games.js`](../../shopfront/games.js) points Foss Snake (and catalog community) at:

- `subreddit`: `https://www.reddit.com/r/FOSSArcade`
- `subredditLabel`: `r/FOSSArcade`

Optionally refresh catalog notes in [shopfront/README.md](../../shopfront/README.md).

Still open: promote [reddit-formats.md](../governance/reddit-formats.md) status from DRAFT → operational via docs PR / ADR when process binds the forge.

---

## Quick file map

| File | Use |
| --- | --- |
| [flairs.md](./flairs.md) | Flair table |
| [automoderator.yaml](./automoderator.yaml) | Paste into Automod |
| [templates/](./templates/) | Proposal + implement-intent |
| [copy/about.md](./copy/about.md) | About blurb |
| [copy/welcome.md](./copy/welcome.md) | Stickied welcome |
| [RBP-APPLICATION.md](./RBP-APPLICATION.md) | Paste-ready RBP / Dev Support draft |
| [API-ACCESS.md](./API-ACCESS.md) | API access + RSS path |

---

## 11. Reddit API / intake bridge

- Self-service `prefs/apps` is blocked under RBP — use the draft in [RBP-APPLICATION.md](./RBP-APPLICATION.md) via Developer Support (Data Access Request).
- Until OAuth is approved, poll public RSS with [`tools/reddit-intake/`](../../tools/reddit-intake/) (see [API-ACCESS.md](./API-ACCESS.md)).
- Run from repo root via the `reddit:intake` package script (`gh` must be authenticated as MediumSweetPotato).

---

*Human checklist. Sub is live at [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade); remaining paste/mod steps still need a human mod.*
