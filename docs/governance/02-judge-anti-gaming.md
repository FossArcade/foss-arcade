# Judge anti-gaming

**Status:** living governance doc  
**Audience:** harness authors, race participants, reviewers, anyone who might try to game a score  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce.

The Foss Arcade harness runs **parallel attempts (races)** and selects winners with a **judge**. A judge that can be gamed becomes a crown by another name. This document is the contract for keeping judgment **mechanical-first, public, reproducible enough to audit, and community-challengeable**.

If a rule here conflicts with a closed proprietary API, a private Discord override, or an unpublished rubric—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

---

## Principles

1. **Mechanical checks first, LLM last.**  
   CI, schema, allowlists, secret scans, executable acceptance tests, and canaries run before any narrative model score. An LLM never “vibes away” a red gate.

2. **Rubric in-repo and patchable (slow lane).**  
   Scoring criteria live in the repository (versioned). Changing them is a public PR with review window and canary re-run—not a mid-race hot edit.

3. **All judgments public and reproducible enough to audit.**  
   Scorecards, pinned rubric semver, inputs hashes, and rationales are published with the race. Unpublished scores are **invalid**.

4. **Sunshine > secret sauce.**  
   Prefer boring, inspectable gates over clever opaque ranking. Forks may run their own judges; the org judge must remain auditable.

5. **Community can challenge rubric and judgments.**  
   Appeals and rubric ADRs are first-class. Criteria lawyering that finds real ambiguity should produce clearer law—not quieter score tweaks.

---

## Threat model — what gaming looks like

| Threat | What it looks like | Why it hurts |
| --- | --- | --- |
| **Rubric theater** | Long essay PR, impressive prose, shallow or missing executable tests | Looks “thoughtful” to an LLM; ships weak product |
| **Hidden malice / supply chain** | Obfuscated deps, postinstall scripts, path tricks, credential exfil | Player and org harm; “green” narrative hides red reality |
| **Prompt injection** | `SYSTEM:`, HTML comments, fake scorecards in diffs/docs aimed at the judge | Model obeys attacker text instead of rubric |
| **Overfitting to known judge quirks** | Phrases, file layouts, or patterns tuned to a specific model’s biases | Wins the model, loses the game and DESIGN fit |
| **Collusion / sock attempts** | Multiple identities, shared attempts, vote/fund rings | Fake consensus; active pool becomes theater |
| **Criteria lawyering** | Literal compliance with wording while violating pillar intent | Passes checklist, breaks DESIGN.md fantasy |

Defense is layered. No single check is enough; the stack is ordered so cheap mechanical truth runs before expensive narrative judgment.

---

## Defense layers (ordered)

### 1. Gate before judge

Nothing reaches scoring unless these pass (or explicitly fail-closed):

- **CI must be green** (build, unit/integration as defined per game).
- **Schema validation** for job manifests, `variant.yaml`, Shelf manifests, ADR frontmatter—whatever the harness declares.
- **Forbidden path diffs** (e.g. secrets dirs, harness self-mod in the same attempt, unrelated monorepo blast radius).
- **Dependency allowlist / SBOM diff** — new or changed deps must be declared and reviewable; surprise supply chain = reject.
- **Secret scan** — fail on high-confidence leaks.
- **Size budgets** — diff size, asset size, binary growth caps per target tier.

**Fail closed:** if a gate cannot run, the attempt does not score.

### 2. Acceptance tests are code, not prose

- Each job/target ships **executable acceptance checks** (scripts, harness tests, golden playtraces—whatever the game defines).
- The judge **cannot waive** failing AC tests.
- Rubric theater without green AC is an automatic loss, regardless of narrative score.

### 3. Adversarial / canary suite in harness

- Maintain a suite of **known-bad PRs / attempts** that **must score low** (or fail gates).
- Run canaries on **every judge version bump** and every rubric semver change.
- If canaries pass a known-bad, the judge/rubric bump **does not ship**.

Canaries are part of the public process—add them when new gaming tricks appear.

### 4. Multi-signal score (weighted rubric)

Hard gates first; then a weighted composite. Illustrative weights (exact numbers live in-repo rubric YAML and move only via slow lane):

| Signal | Role |
| --- | --- |
| **AC tests** | **Hard gate** — not a soft weight |
| **Regression suite** | Strong weight; regressions fail or heavily penalize |
| **Diff complexity penalty** | Prefer smaller, clearer diffs for equal outcomes |
| **Duplication vs DESIGN** | Penalize reinventing or contradicting DESIGN.md / ADRs |
| **Coverage delta** | Reward meaningful test growth; ignore vanity |
| **Playtest harness** (if present) | Smoke / scripted play; failure is serious |
| **LLM narrative score** | **Capped minority weight** — assist, never sole authority |

Design-fit is scored against **pinned** DESIGN.md / ADR revisions at race open (see [01-design-authority.md](./01-design-authority.md)).

### 5. Explainability

Every judgment **must** emit:

1. **Machine-readable scorecard** (JSON or equivalent): criteria ids, scores, gate pass/fail, rubric semver, input hashes, model id if used.
2. **Human rationale** citing **files, lines, and criteria ids**.

**Unpublished scores are invalid.** A “winner” without a public scorecard did not win under Foss Arcade process.

### 6. Blindness where useful

- Strip **author identity** from the scoring package where practical (names, tokens, funding labels).
- Compare attempts on **equal footing**: same rubric pin, same canary version, same harness revision.
- Funding/vote signals may open races; they do **not** appear as positive features inside the score model.

### 7. Prompt-injection hygiene

- Judge reads a **structured attempt bundle only**: diff, test output, checklist, declared metadata.
- **Ignore** HTML comments, `SYSTEM:` / roleplay strings, and similar untrusted instruction shapes inside diffs and docs.
- Fence untrusted content explicitly in the judge prompt/pipeline; never concatenate raw PR body as system instruction.
- Prefer tools that score from artifacts (JUnit, coverage XML, SBOM) over free-form markdown claims.

### 8. Multi-judge / panel on L2+

- For **L2+** (or when scores are close, or risk flags trip): optional **second model** and/or **human spot-check**.
- Panel does not invent private criteria; it applies the **same public rubric** and may escalate ambiguity to an ADR.
- Disagreement between judges → publish both scorecards; escalate per appeals if needed.

### 9. Appeals

- Flow: **public flag** → **thin human panel** → written outcome.
- Outcomes **feed rubric ADRs** (or DESIGN ADRs) when the law was unclear or gamed.
- Panel members are accountable in public notes; no silent Discord overturn.

### 10. Rubric versioning

- Every judgment **pins rubric semver** (and git sha of rubric files).
- Changing the rubric is a **slow-lane target**: PR, review, **canary re-run**, then bump.
- In-flight races keep the pin from race open unless the race is voided and restarted publicly.

---

## Winner selection — ties

When composite scores are equal (within declared epsilon):

1. **Smaller diff** wins (complexity / line budget—exact metric in rubric).
2. Else **stronger tests** (coverage delta / AC depth as defined).
3. Else **earlier complete submission** (harness timestamp of green complete bundle).

Ties are logged on the public scorecard with the tie-break reason.

---

## What we deliberately avoid

- **Closed proprietary judge API as sole authority** — BYO keys and open rubrics; no black-box crown.
- **Private Discord (or equivalent) overrides** — invalid as process; sunshine or it did not happen.
- **Unpublished rubrics** — if contributors cannot read the criteria, the race is illegitimate.

Forks may experiment with other judges; the fossarcade org harness stays on this contract unless this doc is amended in public.

---

## v1 boot dials

Bootstrap tight; widen only when canaries and culture hold.

| Dial | v1 setting |
| --- | --- |
| Gates | **Hard AC tests + CI** mandatory before any narrative score |
| Rubric | **Simple**, in-repo, few criteria, explicit DESIGN-fit id |
| Canaries | **Add and run before opening to strangers** (end of phase 1) |
| LLM assist | **Only after mechanical gates**; capped minority weight; off by default until trusted |
| Panel | Human spot-check on early L2; automate later |
| Blindness | Strip authors in scoring package as soon as harness supports it |
| Appeals | Public issue label + thin panel from day one of public races |

**Order of operations:** mechanical truth → canaries → limited LLM assist → broader participation. Do not invert that order for hype.

---

## Patching this doc

Anti-gaming rules change the way power works. Edits are **slow lane**: PR, rationale, canary impact note, merge. Gaming the judge by editing the judge mid-race is itself a threat—treat it that way.

## Related

- [Design authority](./01-design-authority.md)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
