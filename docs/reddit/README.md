# Reddit ops kit

Paste-ready flairs, Automoderator, and post templates for the Foss Arcade subreddit.

> **Status:** Subreddit is **live** at **[r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)**. Foss Snake was a **bootstrap seed** without a community `[newGame]` vote. Ops files here are paste-ready for flairs / Automod / wiki; do not treat them as live forum law until governance promotes [reddit-formats.md](../governance/reddit-formats.md).

Canonical planning note: [governance/reddit-formats.md](../governance/reddit-formats.md).
Operational copies to paste into Reddit live **here**.

## Full human checklist

See **[SETUP.md](./SETUP.md)** — create step done; remaining: flairs, Automod, welcome pin, sidebar policy. Assistants cannot finish Reddit UI paste; A moderator uses a Reddit account (prefer MediumSweetPotato / FossArcade brand).

## Steps to stand up the sub (summary)

1. **Create the subreddit** — **done:** [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) — details in [SETUP.md](./SETUP.md).
2. **Apply flairs** — create link/post flairs matching [flairs.md](./flairs.md) (`newGame`, `feature`, `bug`, `balance`, `mod`, `promote`, `refactor`, `meta`). Enable flair requirement for submissions if the UI allows.
3. **Paste Automoderator** — copy [automoderator.yaml](./automoderator.yaml) into the sub Automoderator config wiki. Adjust after a quiet burn-in.
4. **Link templates** — pin or wiki-link:
   - [templates/proposal.md](./templates/proposal.md) for OPs
   - [templates/implement-intent.md](./templates/implement-intent.md) for attempt replies
5. **Bootstrap note** — pin [copy/welcome.md](./copy/welcome.md): Foss Snake was seeded to prove the harness; later titles should open as `[newGame]` and be voted.
6. **Promote docs** — when process binds the forge, update [governance/reddit-formats.md](../governance/reddit-formats.md) status from draft to operational and cite an ADR. Shopfront catalog already links [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) via `shopfront/games.js`.

## Files

| File | Purpose |
| --- | --- |
| [SETUP.md](./SETUP.md) | Human create-community checklist |
| [flairs.md](./flairs.md) | Flair table |
| [automoderator.yaml](./automoderator.yaml) | Paste-ready Automod |
| [templates/proposal.md](./templates/proposal.md) | OP proposal body |
| [templates/implement-intent.md](./templates/implement-intent.md) | Attempt reply body |
| [copy/about.md](./copy/about.md) | About blurb |
| [copy/welcome.md](./copy/welcome.md) | Stickied welcome post |
| [RBP-APPLICATION.md](./RBP-APPLICATION.md) | RBP / Developer Support paste draft |
| [API-ACCESS.md](./API-ACCESS.md) | API access notes + RSS intake |

## Rules of thumb (from governance)

1. Votes attach to the **OP**, not every nested reply.
2. Attempts / races **link back** to the OP (and ADR when required).
3. Medium+ need an **accepted in-repo spec** before code races — forum heat is not DESIGN acceptance.
4. No private Discord as source of truth for binding decisions.
5. `[newGame]` / `[meta]` on official surfaces must follow [content-policy.md](../governance/content-policy.md).

## Reddit ↔ GitHub bridge

- **[RBP-APPLICATION.md](./RBP-APPLICATION.md)** — paste-ready Responsible Builder / Developer Support application (prefs/apps is blocked).
- **[API-ACCESS.md](./API-ACCESS.md)** — RBP reality, RSS interim path, future OAuth notes.
- **Intake scaffold:** [`tools/reddit-intake/`](../../tools/reddit-intake/) — poll r/FOSSArcade RSS → GitHub issues via `gh`. From repo root: package script `reddit:intake`.

