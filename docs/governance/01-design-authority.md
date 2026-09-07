# Design authority + spec lane

Foss Arcade games are governed by **written, in-repo law**—not by a Creative Director, private taste, or unlogged vibe checks. If it is not in `DESIGN.md` or an accepted ADR, it is not binding. If you disagree with the law, patch it (slow lane) or **fork out**. Both are first-class FOSS moves.

## Law per game

For each game (and each variant that declares its own design surface):

| Artifact | Role |
| --- | --- |
| `DESIGN.md` | Pillars, non-goals, player fantasy, hard constraints, tone. The constitution. |
| `adr/` | Accepted Architecture / Design Records. Amendments and scoped decisions. |
| Spec lane issues / RFCs | Proposed changes before Medium+ code attempts. |

**DESIGN.md + accepted ADRs are law.** Race rubrics and judges score **design-fit against DESIGN.md** (and cited ADRs), not against a person's preference.

## No Creative Director

There is no CD role with unilateral taste veto.

- Direction changes go through **spec proposals → ADR merge**.
- Day-to-day merge rights come from **earned** designer/codeowner status (below), constrained by pillars.
- Disputes that cannot resolve in public process are resolved by **fork**—not by crowning a king.

## Spec before code (Medium+)

| Change size | Spec required before code attempts? |
| --- | --- |
| Small / L0–L1 (docs, tests, obvious bugfix aligned to existing design) | No (still cite relevant DESIGN/ADR if non-obvious) |
| **Medium+ / L2–L3** (features, balance shifts, new systems, pillar-adjacent) | **Yes** — accepted spec (issue+ADR or equivalent) **before** race/job opens |

Harness rule: Medium+ targets without an accepted spec **do not open**. Attempts against unaccepted Medium+ work are out of process.

## Designers / codeowners — earned block rights

- **DESIGNERS** / **codeowners** (CODEOWNERS or org equivalent) earn **block rights** by **merged ADRs** (and sustained stewardship), not by appointment theater.
- A **block** on a merge or race winner must:
  1. Be public.
  2. **Cite specific pillars** or ADR ids from DESIGN.md / adr/.
  3. State the design-fit failure in concrete terms (files, behavior, criteria).
- Blocks that cannot cite pillars are invalid process noise.
- Blocks are **appealable** (see judge appeals / thin human panel). Outcomes may spawn rubric or DESIGN ADRs.

Design-fit for races is judged **against DESIGN.md** (and cited ADRs), using the public scorecard—not private opinion.

## Fork-out welcomed

Forking a game or variant when pillars diverge is a **success mode**, not a failure. Use lineage metadata (`variant.yaml` parent pointers) so the Arcade Shelf and docs can show descent. See [lineage-and-shelf.md](./lineage-and-shelf.md).

---

## Concrete v1 rules

1. Every pilot game ships `DESIGN.md` with explicit **pillars**, **non-goals**, and **hard constraints** before public races.
2. Every accepted design change that binds future work lands as an **ADR** under `adr/` with a stable id.
3. **No Creative Director** title or equivalent unilateral taste veto in fossarcade process docs or harness config.
4. Harness **refuses to open** Medium+ / L2+ targets without a linked accepted spec (issue + ADR merge, or recorded equivalent).
5. Race scorecards must include a **design-fit** criterion referencing DESIGN.md section ids / ADR ids.
6. CODEOWNERS / DESIGNERS lists start empty or minimal; **block rights unlock after at least one merged ADR** (or documented bootstrap exception logged in-repo for phase 0 only).
7. Any block comment **must cite** pillar or ADR id; maintainers may dismiss uncitable blocks as non-blocking.
8. Blocks and dismissals are **public** (PR/issue); private Discord (or equivalent) overrides are **invalid**.
9. Appeals: public flag → thin human panel → written outcome; outcome may require a follow-up ADR if law was ambiguous.
10. **Fork-out** is documented as supported: `split-to-variant` job type + Shelf lineage; no social penalty in org norms for clean forks.
11. Rubric and DESIGN changes are **slow lane**: PR, review window, canary where applicable—no same-day silent edits mid-race.
12. Judge and humans score against **pinned** DESIGN.md / ADR revisions at race open time (git sha or tag recorded on the race).

---

## Related

- [Lineage and Arcade Shelf](./lineage-and-shelf.md)
- [Judge anti-gaming](./02-judge-anti-gaming.md)
- [Dispute, capture & succession](./09-dispute-capture.md) (block appeals → maintainer/org layers; succession)
- [Cold-start dials](./10-cold-start.md) (empty DESIGNERS / bootstrap exceptions)
- [Overview](../OVERVIEW.md)
