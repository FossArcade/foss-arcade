# Reddit tags & proposal formats

> **Status: DRAFT / LATER** — sub [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) is **live**; this governance note is not yet promoted to binding forum law.  
> Foss Snake was a **bootstrap seed** without a community vote. Do not treat this doc as live process until the forum exists and this draft is promoted.  
> **Operational templates** (flairs table, Automoderator YAML, proposal / implement-intent paste templates, standup checklist) live in [`docs/reddit/`](../reddit/). This file remains the governance sketch; paste-ready ops copies are under `docs/reddit/`.

This note sketches flair, proposal templates, and implement-intent replies for the public Reddit forum ([r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)). Automoderator and templates are drafted in `docs/reddit/` for paste into the live sub.

---

## Cold start

- **First game (Foss Snake)** was seeded by founders to prove the harness. No `[newGame]` vote was required for that bootstrap.
- **Subsequent new games** should open as `[newGame]` posts and be **voted** before becoming in-repo titles / race targets.
- Until this draft is promoted, treat this file as planning only—not as binding forum law. The sub itself is live at [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade).

---

## Flair / tags

| Flair | Use for |
| --- | --- |
| `newGame` | Propose a new game title for the Arcade |
| `feature` | New player-facing capability within an existing game |
| `bug` | Defect / incorrect behavior vs DESIGN or accepted AC |
| `balance` | Numbers / pacing / difficulty shifts (still DESIGN-bound) |
| `mod` | Mod pack / overlay / optional content (not silent pillar rewrite) |
| `promote` | Channel promotion / ship-path evidence (`unstable` → `stable`, etc.) |
| `refactor` | Internal structure with no intended player-facing change |
| `meta` | Forum, process, docs, harness UX—not a game race |

Use **one primary flair** per OP. Attempts and race threads should link back to the accepted OP (or ADR), not invent a parallel flair language.

---

## OP proposal template

**Title:** `[flair] short name — one-line outcome`

**Body fields** (copy into the post):

```markdown
## Problem
What is broken, missing, or unclear for players / maintainers?

## Player value
Who benefits and how do they feel it in-game (or in the forge UX)?

## Scope
- [ ] S — small / L0–L1
- [ ] M — medium / L2
- [ ] L — large / L3

## Lane
Spec / code / promote / meta (pick one primary)

## Non-goals
Explicitly what this proposal will **not** do.

## Success sniff test
How a stranger knows this shipped (playable check, gate, or scorecard signal).

## Links (optional)
DESIGN.md / ADR / prior issue / prototype / related race
```

Votes apply to the **OP**. Medium+ work still needs an **accepted spec** (issue + ADR or equivalent) before code races open—Reddit upvotes alone are not a substitute for in-repo law.

---

## Implement-intent reply

Anyone declaring an attempt should reply under the OP (or race thread linked to the OP) with this structure. The harness **may parse** these fields later; keep headings stable.

```markdown
## Implement intent

**Target:** <game slug / target id / channel>
**Engine:** <web | godot | …>
**Approach:** <short plan; files/systems touched>
**Balance notes:** <n/a or numbers / DESIGN citations>
**Tests / AC checks:** <gates, replay, playtest sniff>
**Risks:** <compat, perf, design-fit, supply chain>
**Budget:** <compute / time / infra ask if any>
```

Rules:

- Link the attempt / race back to the OP.
- Do not treat a private Discord (or DM) thread as source of truth—post the intent publicly.
- Medium+ still blocked until the accepted spec exists, even if implement-intent is filled out.

---

## Rules of thumb

1. **Votes on OP** — judgment attaches to the proposal post, not to every nested reply.
2. **Attempts / races link back** — every implement-intent and harness job cites the OP (and ADR when required).
3. **Medium+ need accepted spec before code races** — forum heat ≠ DESIGN/ADR acceptance.
4. **No private Discord as source of truth** — decisions that bind the forge live in-repo and/or on the public forum.
5. **`[newGame]` / `[meta]` proposals for official surfaces must comply with [content-policy.md](./content-policy.md)** — all-ages venue; no pornographic content on org / Shelf / incubation paths.

---

## Ops kit location

Paste-ready materials: [`docs/reddit/`](../reddit/) (`SETUP.md` human checklist, `README.md`, `flairs.md`, `automoderator.yaml`, `templates/`, `copy/`).

Still TODO:

- Bot automation beyond Automoderator (harness hooks, template checks)
- Promote this draft via ADR / docs PR — do not silently treat this file as live ops
- Done: sub name [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade); shopfront `games.js` points at the live URL

---

*Deferred planning draft. Sub is live; promote this file when process binds the forge; cite reasons.*
