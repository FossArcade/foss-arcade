# Reddit RSS to GitHub intake

Seed-simple bridge: poll public r/FOSSArcade RSS, open GitHub issues on FossArcade/foss-arcade via gh (as MediumSweetPotato). Idempotent. Seen post GUIDs live in .seen.json (gitignored).

This is the interim path while Reddit RBP approval is pending. See docs/reddit/API-ACCESS.md and docs/reddit/RBP-APPLICATION.md.

## Requirements

- Node.js 18+ (built-in fetch)
- gh CLI with issue-create access to FossArcade/foss-arcade
- Network to www.reddit.com (clear User-Agent recommended)

No package dependencies. No Reddit secrets in the repo.

## Run

From repo root: invoke the package script key `reddit:intake` (see root package.json).

Directly: `node tools/reddit-intake/intake.mjs`

Optional env:

| Variable | Default | Meaning |
| --- | --- | --- |
| REDDIT_RSS_URL | https://www.reddit.com/r/FOSSArcade/.rss | Feed URL |
| REDDIT_USER_AGENT | FossArcade-intake/0.1 (...) | HTTP User-Agent |
| GH_REPO | FossArcade/foss-arcade | Issue target |
| DRY_RUN | unset | Set to 1 to print only |
| MAX_CREATE | unlimited | Cap new issues per run |

## Idempotency

- State file: tools/reddit-intake/.seen.json (gitignored)
- Key: RSS guid (fallback: link)
- Re-runs skip already-seen posts

## Labels

New issues get labels `reddit` and `intake` when the CLI can apply them.

## What gets filed

Each new RSS item becomes one issue:

- Title: `[reddit] <post title>` (truncated safely)
- Body: title, link, author, GUID, snippet for triage

This does not replace community votes or Automod; it is intake only.

Note: Reddit `.rss` URLs often return **Atom** (`<entry>`). The parser accepts both RSS `<item>` and Atom `<entry>`.

## Trial run notes (box / datacenter)

- Reddit `.rss` returns **Atom**; parser handles `<entry>` and RSS `<item>`.
- From shared cloud IPs, Reddit may return **HTTP 429** after a few fetches — wait and retry, or run from a residential network with a clear User-Agent.
- An empty sub produces a valid Atom feed with **zero** entries (intake creates nothing; that is success).
