# Security & supply chain

**Status:** living governance doc  
**Audience:** harness authors, race participants, Shelf clients, ops, reviewers, players who sideload  
**Spirit:** FOSS — open, forkable, no kings, public process. Sunshine beats secret sauce. **License is not security.** Hostile attempts are expected; trust is earned by reproducible gates, not vibes.

Race attempts, donated runners, and Shelf installs are **hostile by default**. A green narrative score must never paper over malware, secret exfil, or a poisoned dependency. This document is the contract for **in-repo policy, layered mechanical defense, untrusted donated compute, player-surface honesty, and coordinated disclosure**—without DRM, closed scanners-as-crown, or silent admin "trust this build."

If a rule here conflicts with a private allowlist, unpublished incident, or "just merge it, we know them"—**this doc wins**, or the process is broken. Patch the doc in the slow lane; do not silently override it.

Companions: mechanical gates and prompt/tool injection in [02-judge-anti-gaming.md](./02-judge-anti-gaming.md); sandboxed donated pools and N-of-M attestation in [05-infra-cost.md](./05-infra-cost.md); Shelf sideload / manifests in [lineage-and-shelf.md](./lineage-and-shelf.md).

---

## Problem and principle

### The problem

| Failure | What it looks like | Harm |
| --- | --- | --- |
| **Hostile attempts** | Obfuscated deps, postinstall hooks, path tricks, credential exfil, "helpful" scripts that phone home | Players and org burned; scorecard still looks thoughtful |
| **Policy folklore** | "We do not allow X" lives in a Discord pin, not in CI | Forks and strangers cannot audit; crowns return |
| **Non-reproducible green** | Build works only on one donor machine or with unpublished secrets | Merge theater; cannot re-run or challenge |
| **Blind donated compute** | Single volunteer runner is sole merge-gate oracle | Trojan CI; secrets leak to random hosts |
| **Secret sauce scanners** | Proprietary risk score nobody can reproduce | Invalid process; false trust |

Hostile actors (and curious agents) **will** try to game gates. Assume attempts are adversarial until mechanical layers say otherwise.

### Principles

1. **Hostile attempts are the default threat model.**  
   Treat race diffs, unpaid CI, and unsigned overlays as untrusted input. Fail closed when a gate cannot run.

2. **Policy lives in-repo.**  
   Path allowlists, dependency allowlists, forbidden paths, and secret-scan config are versioned files—not maintainer memory. Changing them is **slow lane** when they affect open races.

3. **Reproducibility over vibes.**  
   Prefer content-addressed artifacts (checksums, SBOM, attested logs) so anyone can re-run and compare. "It passed on my machine" is not evidence.

4. **Untrusted donated compute.**  
   Volunteer runners unload burn ([05](./05-infra-cost.md)) but **never** hold signing keys and **never** sole-attest merge/promote gates. Sandbox + egress policy + N-of-M.

5. **Sunshine.**  
   Incidents, quarantines, allowlist denials, and false-positive appeals are public (redact only true secrets / abuse material). Unpublished "we fixed it quietly" is invalid for org process.

6. **License is not security.**  
   An MIT dependency can still be malware. License compliance is necessary and **orthogonal** to supply-chain trust.

---

## Defense layers (ordered)

Cheap mechanical truth first; narrative and player UX last. Layers stack with [02](./02-judge-anti-gaming.md) gate-before-judge.

### 1. Path allowlists / forbidden-path diffs

Attempts that touch blast-radius paths **fail closed** unless the target explicitly allows them.

| Class | Examples (illustrative) | Default |
| --- | --- | --- |
| **Org secrets paths** | dotenv files, key material dirs, forge deploy token paths | Forbidden in attempt diffs |
| **Harness self-mod** | Judge rubric, canary corpus, harness entrypoints in the same attempt being scored | Forbidden (separate slow-lane PR) |
| **Unrelated monorepo blast** | Other games roots, org-wide bots, fiscal configs | Forbidden unless job scope says otherwise |
| **Supply-chain control plane** | Root package manifests / lockfiles outside declared scope, CI workflow privileges | Allowlist-scoped; surprise = reject |

Canonical lists live per layout (monorepo + per-game overlays) as in-repo YAML/JSON consumed by CI. **Folklore path rules do not count.**

False positives: public appeal (issue template) then thin panel then allowlist ADR or documented exception with expiry. Same sunshine as judge appeals ([02](./02-judge-anti-gaming.md)).

### 2. Dependency allowlist + SBOM

| Rule | Why |
| --- | --- |
| **Declared deps only** | New or changed packages must appear in lockfile / manifest + reviewable allowlist entry |
| **SBOM diff on every attempt** | Machine-readable bill of materials; surprise transitive edges fail or require explicit acknowledge |
| **No silent install / build scripts** | Ecosystem dials forbid or gate lifecycle scripts unless allowlisted |
| **Per-language process** | Each ecosystem has an in-repo list plus review checklist |

**Surprise supply chain = reject**, regardless of LLM narrative score. Adding a dep is a reviewable act; drive-by dependency noise is infra abuse ([05](./05-infra-cost.md)).

Exact package pins and CVE triage tooling evolve; **shape** here is required: allowlist + SBOM + fail closed.

### 3. Secret hygiene

- **Secret scan** on diffs and artifacts (high-confidence then fail closed).  
- **Org secrets** (signing keys, deploy tokens, fiscal host, abuse mailbox credentials) live only on the **tiny always-on core** ([05](./05-infra-cost.md))—never on random donors, never in attempt bundles.  
- **BYO inference keys** stay with authors; org does not collect them for "convenience."  
- **False-positive appeal path:** public issue then evidence (redacted) then scanner rule tweak or documented suppress with expiry. Suppressions without sunshine are invalid.  
- Rotations and leak responses follow **SECURITY.md** / incident process (below)—not private Discord only.

### 4. Sandbox / egress (runners)

Merge- and promote-adjacent jobs (and donated pool work) run in **disposable sandboxes**:

- Rootless (or equivalent) where practical; no privileged host mount for untrusted workloads.  
- **Network egress policy:** default deny or tight allowlist (registry mirrors, declared test endpoints)—not "full internet for every attempt."  
- Ephemeral workload credentials only; least privilege; short TTL.  
- Artifact outputs are content-addressed; logs are attested enough to re-check.

Local-first author machines are outside org sandbox—but **org re-runs** for merge trust still use these rules.

### 5. N-of-M attestation (donated compute)

From [05-infra-cost.md](./05-infra-cost.md) donated pool—restated as security law:

| Rule | Why |
| --- | --- |
| **Never trust a single donor** as sole merge/promote-gate oracle | One poisoned volunteer machine must not mint "green" |
| **N of M independent executors** confirm blocking results | Org core and/or distinct donors; disagreement then re-run / quarantine |
| **No secrets to random donors** | Signing and deploy stay core-only |
| **Poison handling** | Hash disagreement or malware then quarantine attestations, sunshine incident, re-run on trusted set |

Infra-rep is hygiene, not governance rank.

### 6. Pinned / signed harness + Shelf checksums

| Surface | Expectation |
| --- | --- |
| **Harness** | Race pins harness revision + rubric semver ([02](./02-judge-anti-gaming.md)); releases preferably signed by core keys |
| **Shelf manifests** | Install URLs carry **checksums**; clients verify before play; optional signatures on official channel tips |
| **Mirrors** | Same checksums as official; corrupt payloads fail verify and get delisted publicly |
| **Reproducible builds (goal)** | Phase target: bit-reproducible or practically reproducible artifacts where engine allows; until then, **checksum + SBOM + attested CI** are the minimum honesty bar |

Unsigned community overlays and sideloads remain allowed (FOSS)—with **honest UI warnings**, not silent trust.

### 7. Prompt / tool injection (ties to judge)

Judge and agent tool pipelines treat attempt content as **untrusted**:

- Structured attempt bundles only; fence raw PR/docs; ignore `SYSTEM:` / HTML-comment instruction shapes.  
- Prefer scoring from artifacts (JUnit, coverage, SBOM) over free-form claims.  
- Tool-call results from sandboxes are data, not instructions to raise privilege or skip gates.

Full contract: [02-judge-anti-gaming.md](./02-judge-anti-gaming.md) (prompt-injection hygiene + gate-before-judge). This doc does not weaken those rules.

### 8. Incident / SECURITY.md process

Org ships a root **`SECURITY.md`** (per forge norms) pointing here for policy shape:

1. **Coordinated disclosure** preferred for non-public exploits affecting players or org keys.  
2. **Public intake** (security advisory / issue template / mailbox)—reachable without a private crown.  
3. **Written timeline** after fix: what broke, what gates missed, what canary/allowlist changed.  
4. **No silent patch-only** for org-process bugs that strangers need to know.  
5. Redact credentials and abuse victims; do **not** redact the existence of the incident.

Narrow safety vetoes (malware, illegal, license sabotage, harassment) align with [04-sybil-grief.md](./04-sybil-grief.md)—appealable, written reasons.

### 9. Player surface (Shelf / sideload / mods)

Players are part of the threat model—as **victims** of trojans, not as captives of DRM.

| Surface | Rule |
| --- | --- |
| **Official channel tips** | Core-signed (or equivalent) pointers + checksums; verify on install/update |
| **Unsigned overlays** | Allowed; UI must mark **unverified**—never pretend they are `stable` org builds |
| **Sideload** | First-class ([lineage-and-shelf.md](./lineage-and-shelf.md)); **warn** on missing/failed checksum or unknown publisher; never block FOSS freedom with DRM |
| **Mods** | **Opt-in**; compatibility flags; must not silently rewrite pillars; incompatible/untrusted packs need explicit enable |
| **Verified Shelf badge** | Means **minimum baseline** below—not "we audited every line forever" |

---

## FOSS-shaped choices

### License is not security

SPDX / license allowlists catch **compliance** problems. They do **not** replace SBOM, allowlists, sandboxing, or checksums. A permissive license on a malicious package is still malicious.

### Coordinated disclosure

Default posture: give maintainers a reasonable window before full public detail **when** players or keys are at risk—then sunshine the write-up. "Coordinated" is not "forever private." Forks may choose full immediate disclosure; fossarcade org defaults document contact in `SECURITY.md`.

### Minimum baseline for Shelf "verified"

A build may show **verified** (or equivalent) only if **all** hold:

1. Checksums match manifest (and signature verifies when the channel claims signed tips).  
2. SBOM / dependency gate passed for that release train tip.  
3. CI / promote evidence is public for the channel tip ([03](./03-player-ship-path.md), [03b](./03b-unstable-to-stable.md)).  
4. No open critical incident flag on that tip without a published advisory pointer.

Verified is not perfect. It means **mechanical baseline**, not a warranty crown. Sideload and unsigned overlays stay playable with warnings.

---

## Boot vs scale dials

Bootstrap strict and boring; widen participation when canaries, appeals, and incident notes work—not when hype demands "trust the pool."

| Dial | Boot / early (phases 0–1) | Scale (phases 2–4) |
| --- | --- | --- |
| Path / forbidden lists | Tight; few games; manual review OK | Per-layout overlays; automated gate on every attempt |
| Dependency allowlist | Small; human ACK for every new dep | Per-ecosystem allowlists + SBOM diff automation |
| Secret scan | On from day one; fail closed | Same + documented FP appeal SLA |
| Sandbox / egress | Org runners locked down; BYO local-first | Donated pool with sandbox + egress; still core-only secrets |
| N-of-M | Org re-run sufficient if no pool | N-of-M required for merge/promote when donors attest |
| Harness pin / sign | Pin git sha; signing optional but planned | Signed harness releases + pinned races |
| Shelf checksums | Required on official manifests | Same + multi-mirror verify UX |
| Reproducible builds | Goal stated; checksum honesty mandatory | Phase target per engine; document gaps honestly |
| SECURITY.md / intake | Stub + mailbox/issue template | Full coordinated disclosure + public advisories |
| Player warnings | Sideload warn + mods opt-in | Richer trust badges; still no DRM |
| Prompt injection | Gates before LLM; structured bundles | Same; canaries for new injection tricks ([02](./02-judge-anti-gaming.md)) |

**Order of operations:** path + secret + dep gates then checksummed artifacts then sandbox/egress then N-of-M when donating then richer Shelf trust UX. Do not invert for a closed scanner vendor that hides findings from contributors.

---

## What we deliberately avoid

- **DRM / anti-sideload** as "security" — freedom to run unsigned builds with **warnings**, not locks.  
- **License check as sole supply-chain gate** — license is not security.  
- **Single-donor merge attestation** — never sole oracle ([05](./05-infra-cost.md)).  
- **Shipping org secrets to random donors or into attempt bundles.**  
- **Unpublished allowlists / silent suppressions** — sunshine or invalid.  
- **Trust-me verified badges** without checksum + SBOM + public CI evidence.  
- **Mods on by default** that rewrite pillars or skip trust UI.  
- **Private Discord as the real incident process.**  
- **Waiving red gates because the LLM liked the PR** ([02](./02-judge-anti-gaming.md)).  
- **Fail-open when scanners or sandboxes are down** — fail closed for merge/promote trust.  
- **Security theater KYC** — identity for influence is [04](./04-sybil-grief.md); it does not replace artifact verification.

Forks may tune scanner vendors and N/M numbers; the fossarcade org harness stays on this contract unless this doc is amended in public.

---

## Patching this doc

Security and supply-chain rules change what can reach players and what can burn the org. Edits are **slow lane**: PR, rationale, impact on open races / channel tips / donor pool, merge. Quietly widening an allowlist mid-race to land a pet dep is itself an attack—treat it that way.

## Related

- [Judge anti-gaming](./02-judge-anti-gaming.md) (gates, prompt injection, canaries)
- [Infra cost & abuse](./05-infra-cost.md) (donated compute, sandbox, N-of-M, core secrets)
- [Lineage and Arcade Shelf](./lineage-and-shelf.md) (sideload, manifests)
- [Player & ship path](./03-player-ship-path.md)
- [Unstable → stable promotion](./03b-unstable-to-stable.md)
- [Sybil, grief funding & sock attempts](./04-sybil-grief.md) (safety veto class)
- [Overview](../OVERVIEW.md)
- [Gaps](./GAPS.md)
