# Community forum (Snake Seed)

**Status:** Approved for Foss Snake seed (2026-09-08).  
**Owns:** Shelf Community UX sits on top; persistence is swappable.  
**Not:** Reddit as on-site home (outreach only). See [`docs/governance/content-policy.md`](../governance/content-policy.md).

## ForumPort

The Shelf Community tab talks to a **`ForumPort`** adapter. Shelf chrome and game pages do not hard-wire a vendor API.

Minimal contract:

- `listThreads` / `getThread` / `createThread` / `reply`
- `listTags` / `applyTag`
- `react` / `upvote`
- `exportBrief(threadId)` → `{ md, meta }`

## First port: GitHub Discussions

**Snake Seed uses GitHub Discussions** as the community backend, with a thin on-site Shelf UI.

- Categories + labels cover flairs and pipeline state.
- Upvotes and emoji reactions are enough for seed voting signals.
- Living briefs, harness targets, and fork→PR stay in the same repo surface.
- Ops cost is near zero for a tiny public seed.

**Do not** stand up NodeBB or Discourse for Snake seed. Those remain later ports when volume or moderation needs grow (NodeBB is the natural Node-aligned graduate).

## Snake starter: categories

| Category | Role |
| --- | --- |
| `announcements` | Maintainer releases and seed rules |
| `proposals` | Intake: feature / fix / balance ideas |
| `considerations` | Design debate, tradeoffs, playtest notes |
| `briefs` | Living brief drafts toward export |
| `show-and-tell` | Clips, forks, skins |
| `q-and-a` | Player help (not proposals) |
| `meta` | Platform / ForumPort / Shelf Community itself |

Flair patterns from [`docs/reddit/flairs.md`](../reddit/flairs.md) inform labels; on-site Community is not Reddit.

## Labels (flairs / pipeline)

Shared with Issues/PRs where useful:

- **Type:** `type:feature` · `type:fix` · `type:balance` · `type:docs` · `type:meta`
- **Stage:** `stage:proposal` · `stage:consideration` · `stage:brief` · `stage:harness` · `stage:pr`
- **Status:** `status:needs-votes` · `status:brief-ready` · `status:accepted` · `status:declined` · `status:shipped`

## brief-ready → export

When a thread reaches **`status:brief-ready`** (human or bot):

1. Write or update `community/briefs/<slug>.md` (living brief).
2. Optionally add or update a harness target YAML (see [`docs/harness/target.schema.md`](../harness/target.schema.md)).
3. Open a PR (outside contribs: fork→PR; brand commits: MediumSweetPotato noreply only).

Discussions remain the conversation log; Markdown in-repo is the durable brief.

## Swap via `[meta]`

Community / platform meta is itself a future **Shelf tile**. Meta config selects something like:

```text
{ port: "github-discussions", repo, categories, labelMap }
```

Later: `port: "nodebb"` or `port: "discourse"` behind the same ForumPort. Shelf Community tab stays stable; only the adapter and meta pointer change.

## Non-goals (Snake Seed)

- Self-hosting NodeBB or Discourse for seed
- Inventing a bespoke forum database or parallel governance law
- Using Giscus (or similar comment widgets) as the Community tab
- Conflating Issues with Community (Issues = tracked work; Discussions = conversation → brief)
- Hard-wiring Shelf UI to GitHub GraphQL field names (always go through ForumPort)
- Treating Reddit as on-site Community
- Real legal names or personal emails in templates, examples, commits, or PR bodies

## Seed checklist

Ops steps (enable Discussions, create categories, confirm labels): [`discussion-seed.md`](./discussion-seed.md).

Until custom categories exist, the Seed adapter maps ForumPort ids to live DEFAULT slugs (`ideas` / `general` / `q-a`) via `SEED_CATEGORY_SLUG_MAP` — see that checklist and `shopfront/github-discussions-port.js`.

## Related

- Shopfront v0: [`shopfront/`](../../shopfront/)
- Lineage / shelf: [`docs/governance/lineage-and-shelf.md`](../governance/lineage-and-shelf.md)
