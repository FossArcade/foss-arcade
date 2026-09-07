# Reddit Responsible Builder / Developer Support — application draft

Paste-ready answers for a **narrow Foss Arcade mod bot**. Fill the contact email before submitting. Do **not** put secrets in this file.

> **Status:** Draft for the project operator to submit. Self-service `reddit.com/prefs/apps` is blocked / redirected under the Responsible Builder Policy (RBP). Use Developer Support (Data Access Request) instead — see [How to submit](#how-to-submit) and [API-ACCESS.md](./API-ACCESS.md).

---

## How to submit

1. Read the [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) and Data API / Developer Terms.
2. **Do not rely on** [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) for new credentials — that path is blocked or only shows the RBP page for new apps.
3. Open Reddit Help → **Submit a request** → **Data Access Request** (Developer Support form), e.g.  
   https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164
4. Choose the role that fits (**moderator** / developer building mod tooling). Note that Reddit asks developers to try **Devvit** first; explain below why Devvit alone is insufficient.
5. Paste the sections below into the form fields (adapt to whatever labels the form shows). Attach a link to this repo: https://github.com/FossArcade/foss-arcade
6. Until OAuth is approved, use the public **RSS intake** bridge documented in [API-ACCESS.md](./API-ACCESS.md) and `tools/reddit-intake/`.

---

## Project name

**Foss Arcade bridge** (community: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade))

---

## Account

**MediumSmallPotato** — moderator of [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)

(Brand/GitHub forge account for issue creation is separate: **MediumSweetPotato** on https://github.com/FossArcade/foss-arcade — no Reddit secrets stored in the repo.)

---

## Purpose

Moderator tooling for **one** subreddit only: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade).

We translate **approved community proposals** (and related flaired posts) into **GitHub issues** on [FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade) so the FOSS game forge can track votes → implement → merge in public.

This is **not**:

- a general Reddit scraper
- commercial data resale
- training-data / ML harvest
- a cross-subreddit aggregator
- bulk archival of Reddit content

Scope stays human-scale: one small all-ages community, issue creation for forge workflow, optional acknowledgement comments linking back to the GitHub issue when write access is approved.

---

## Data needed

| Need | Scope |
| --- | --- |
| **Read** | Posts and comments in **r/FOSSArcade only** (titles, bodies, authors, permalinks, flairs) sufficient to open matching GitHub issues |
| **Write (optional, if approved)** | Bot acknowledgements in-thread and/or short comments that link to the created GitHub issue — no spam, no cross-posting |

No access requested to other subs, private messages, or sitewide search dumps.

---

## Expected volume

**Low.** Human-scale subreddit.

- Target: well under **60 requests/hour** (typically far less — poll on the order of minutes, not seconds)
- Burst: tiny (a handful of concurrent reads when a proposal lands)
- Writes: rare (one acknowledgement per intake event, if write is granted)

We will identify with a clear **User-Agent**, respect rate limits, and back off on HTTP 429 / errors.

---

## Compliance

- Follow the **Responsible Builder Policy**, Developer Terms, and Data API Terms.
- Subreddit is **all-ages** / not NSFW; tooling supports that venue only.
- **No bulk archive** of Reddit; we store only what is needed for idempotent issue mapping (e.g. post GUID / permalink → GitHub issue number) on our side.
- **Respect rate limits**; no circumvention.
- **Transparent User-Agent** identifying the bot, project, and contact (once email is filled).
- Source of truth for game builds remains GitHub; Reddit remains the community vote surface.

---

## Why not Devvit alone?

Devvit is excellent for in-Reddit apps. Our forge needs to **create and update GitHub issues** on an external repository ([FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade)) and keep the Seed workflow (proposal → issue → PR → merge) outside Reddit’s runtime. That GitHub bridge is **not supported by Devvit alone**, so we request narrow Data API access for this mod-tooling use case. Until approved, we use public **RSS** for read-only intake (see [API-ACCESS.md](./API-ACCESS.md)).

---

## Contact

**Email:** `REPLACE_WITH_CONTACT_EMAIL@example.com`  
*(Replace with contact email before submit. Do not commit a real address if you prefer it private — paste only into the Reddit form.)*

**Public project:** https://github.com/FossArcade/foss-arcade  
**Subreddit:** https://www.reddit.com/r/FOSSArcade  
**Source (intake scaffold):** https://github.com/FossArcade/foss-arcade/tree/main/tools/reddit-intake

---

## Provide a detailed description of what the Bot/App will be doing on Reddit

Paste-ready for the Developer Support / Data Access Request form field of the same name (or closest label). Keep operator-neutral; fill contact email only at submit time.

### Foss Arcade bridge — what the bot does on Reddit

This is a **moderator support bot** for a **single subreddit**: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade). It is **not** a site-wide scraper, **not** a marketing crawler, and **not** a data-resale or ML-training pipeline. Its only job is to help that community turn **public proposal posts** into **tracked work** on the open-source GitHub org ([FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade)), and optionally leave a **short public acknowledgement** on Reddit linking back to the GitHub issue.

#### On-platform behavior (Reddit)

1. **Read posts in r/FOSSArcade only** — title, flair, author, permalink, and self-text (body). Example: a feature-flaired post such as a Snake high-score proposal.
2. **Ignore noise** — skip removed/spam content, anything outside the subreddit, and duplicates (intake is **idempotent**: same post does not open a second issue).
3. **Optional flair-aware routing** — map flair to GitHub issue **labels** only. The bot does **not** remove, ban, or otherwise moderate users.
4. **Optional write (if approved):** at most **one** acknowledgement comment per intake event, containing the GitHub issue URL (and minimal context). No editing other people's content, no DMs, no mass commenting, no voting.
5. **Never:** operate outside r/FOSSArcade; bulk-archive Reddit for training/resale; perform auto-mod actions (remove/ban/approve); scrape user profiles, PMs, or modmail; high-rate crawl (target **&lt;60 requests/hour**).

#### Off-platform behavior

Creates (and may update) GitHub issues on [FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade) with the Reddit permalink, flair, and relevant body text so the forge can track proposal → implement → merge in public.

#### Volume / identity

Low and bursty (human-scale subreddit). Clear identifying **User-Agent** (bot, project, contact). Respect rate limits; **back off** on HTTP 429 / errors.

**Contact placeholder:** `REPLACE_WITH_CONTACT_EMAIL@example.com`

---

## Shorter version (character-limit fields)

Use when the form truncates the detailed description:

> Foss Arcade bridge is a mod-support bot for **r/FOSSArcade only**. It reads public posts (title/flair/author/permalink/body), ignores spam/duplicates, and opens matching GitHub issues on FossArcade/foss-arcade. Optional write: one acknowledgement comment with the issue URL — no DMs, no votes, no removes/bans, no other subs. Not a scraper, not resale, not ML training. Volume low (&lt;60 req/h), identifying User-Agent, backoff on 429. Contact: REPLACE_WITH_CONTACT_EMAIL@example.com

---

## Suggested one-paragraph summary (form “describe your use case”)

> Foss Arcade bridge is a narrow moderator tool for r/FOSSArcade only. It reads posts/comments in that single all-ages sub so approved community proposals can become GitHub issues on FossArcade/foss-arcade. It is not a scraper, not commercial resale, and not ML training harvest. Volume is low (&lt;60 req/h). Optional write is limited to acknowledgement comments linking the GitHub issue. Devvit alone cannot create those external GitHub issues. We comply with the Responsible Builder Policy, identify our User-Agent, and respect rate limits. Contact: REPLACE_WITH_CONTACT_EMAIL@example.com

---

## Checklist before send

- [ ] Replace contact email placeholder
- [ ] Confirm Reddit account **MediumSmallPotato** is still mod of r/FOSSArcade
- [ ] Link this repo / `docs/reddit/RBP-APPLICATION.md` in the ticket
- [ ] Select moderator / non-commercial mod-tooling path (not commercial Ads API)
- [ ] Keep a copy of the submitted ticket ID offline
