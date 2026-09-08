# Discussion seed checklist (Snake)

Short ops checklist for enabling GitHub Discussions on `FossArcade/foss-arcade`. No PII.

See also: [`community-forum.md`](./community-forum.md) · category map in `shopfront/github-discussions-port.js`.

## 1. Enable Discussions

1. Repo **Settings → General → Features → Discussions**.
2. Confirm the Discussions tab appears on the repo.

**Status:** Discussions enabled.

## 2. Categories

**Status:** Needed ForumPort categories are **created** (live in GraphQL).

| Category | Role | Live slug | Status |
| --- | --- | --- | --- |
| Announcements | Maintainer releases and seed rules | `announcements` | Created |
| Proposals | Intake: feature / fix / balance ideas | `proposals` | Created |
| Considerations | Design debate, tradeoffs, playtest notes | `considerations` | Created |
| Briefs | Living brief drafts toward export | `briefs` | Created |
| Show and tell | Clips, forks, skins | `show-and-tell` | Created |
| Q&A | Player help (not proposals) | `q-a` | Created (GitHub default slug) |
| Meta | Platform / ForumPort / Shelf Community | `meta` | Created |

Leftover DEFAULT categories may still appear (`general`, `ideas`, `polls`) — Shelf does not link to them.

Seed adapter map (`SEED_CATEGORY_SLUG_MAP`): identity for all ForumPort ids except `q-and-a` → `q-a`.

## 3. Create labels

Pipeline labels already exist on the repo (`type:*`, `stage:*`, `status:*`). Confirm:

- **Type:** `type:feature` · `type:bug` · `type:balance` · `type:docs` · `type:meta`
- **Stage:** `stage:proposal` · `stage:consideration` · `stage:brief` · `stage:harness` · `stage:pr`
- **Status:** `status:needs-votes` · `status:brief-ready` · `status:accepted` · `status:declined` · `status:shipped`

**Status:** Labels already present.

## 4. Optional first announcement

Post one Announcements Discussion with seed rules (all-ages, ForumPort-facing, Reddit = outreach only). Handle-only attribution (e.g. `MediumSweetPotato`). No personal emails or legal names.

## Related

- Shelf Community tab: `shopfront/community-ui.js`
- Seed adapter: `shopfront/github-discussions-port.js` (`SEED_CATEGORY_SLUG_MAP`)
