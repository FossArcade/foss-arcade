# Reddit API access (Foss Arcade)

How we talk to Reddit for the Foss Arcade bridge — without putting secrets in git.

## Current reality (RBP)

Reddit’s **Responsible Builder Policy** gates new Data API / OAuth apps. Self-service creation at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) is **blocked or redirected** for new credentials. New access goes through **Developer Support → Data Access Request**.

- Policy: https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy
- Form: https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164
- Paste-ready application: **[RBP-APPLICATION.md](./RBP-APPLICATION.md)**

Until OAuth is approved, do **not** invent client secrets in the repo. Use the public RSS path below.

## Interim path: RSS → GitHub intake

Public RSS (no OAuth):

- https://www.reddit.com/r/FOSSArcade/.rss
- https://www.reddit.com/r/FOSSArcade/new/.rss (alternate / “new” listing)

Scaffold: **[`tools/reddit-intake/`](../../tools/reddit-intake/)**

## Run

From repo root run the package script named reddit:intake (see tools/reddit-intake README).

Behavior (Seed-simple):

1. Fetch RSS with an identifying User-Agent
2. Parse items (title, link, author, GUID)
3. Skip GUIDs already in tools/reddit-intake/.seen.json (gitignored)
4. Open a GitHub issue on FossArcade/foss-arcade with labels reddit and intake
5. Record GUID to issue URL in .seen.json

No Reddit API keys. GitHub auth is via local gh CLI (never commit tokens).

## Future: OAuth (if RBP approved)

If Developer Support grants access:

1. Store client id / secret / refresh token only in local env or a private secret store — never in this repo
2. Prefer read scope limited to r/FOSSArcade; add comment write only if acknowledgements are approved
3. Keep volume low (&lt;60 req/h); same User-Agent discipline
4. Extend or replace the RSS poller; keep idempotency (GUID / fullname → issue)

Devvit remains useful for in-Reddit UX; the GitHub issue bridge still needs the external API or RSS+gh path described here.

## Related

- [RBP-APPLICATION.md](./RBP-APPLICATION.md) — application draft
- [SETUP.md](./SETUP.md) — human subreddit checklist
- [README.md](./README.md) — ops kit index

Note: Reddit `.rss` often serves Atom (`entry`); the intake parser handles both RSS and Atom.
