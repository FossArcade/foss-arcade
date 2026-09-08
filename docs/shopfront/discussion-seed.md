# Discussion seed checklist (Snake)

Short ops checklist for enabling GitHub Discussions on `FossArcade/foss-arcade`. No PII.

See also: [`community-forum.md`](./community-forum.md) · category map in `shopfront/github-discussions-port.js`.

## 1. Enable Discussions

1. Repo **Settings → General → Features → Discussions**.
2. Confirm the Discussions tab appears on the repo.

## 2. Create categories

GitHub defaults today (live): `announcements`, `general`, `ideas`, `polls`, `q-a`, `show-and-tell`.

**Needed** (ForumPort / community-forum.md). GraphQL cannot create categories — create these in the UI:

| Intended category | Role | Interim live slug (Seed map) |
| --- | --- | --- |
| Announcements | Maintainer releases and seed rules | `announcements` |
| Proposals | Intake: feature / fix / balance ideas | `ideas` |
| Considerations | Design debate, tradeoffs, playtest notes | `general` |
| Briefs | Living brief drafts toward export | `general` |
| Show and tell | Clips, forks, skins | `show-and-tell` |
| Q&A | Player help (not proposals) | `q-a` |
| Meta | Platform / ForumPort / Shelf Community | `general` |

After Proposals / Considerations / Briefs / Meta exist with those names/slugs, set `useInterimSlugs: false` on the Seed port (or point `SEED_CATEGORY_SLUG_MAP` at `INTENDED_CATEGORY_SLUGS`) so category links stop using interim fallbacks.

## 3. Create labels

Pipeline labels already exist on the repo (`type:*`, `stage:*`, `status:*`). Confirm:

- **Type:** `type:feature` · `type:bug` · `type:balance` · `type:docs` · `type:meta`
- **Stage:** `stage:proposal` · `stage:consideration` · `stage:brief` · `stage:harness` · `stage:pr`
- **Status:** `status:needs-votes` · `status:brief-ready` · `status:accepted` · `status:declined` · `status:shipped`

## 4. Optional first announcement

Post one Announcements Discussion with seed rules (all-ages, ForumPort-facing, Reddit = outreach only). Handle-only attribution (e.g. `MediumSweetPotato`). No personal emails or legal names.

## Related

- Shelf Community tab: `shopfront/community-ui.js`
- Seed adapter: `shopfront/github-discussions-port.js` (`SEED_CATEGORY_SLUG_MAP`)
