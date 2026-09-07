# Contributing to Foss Arcade

Welcome. This is a public FOSS forge: patch in the open, cite reasons, no private kingmaking.

Read [`docs/README.md`](./docs/README.md) and [`docs/OVERVIEW.md`](./docs/OVERVIEW.md) first. Game law lives in each title's `DESIGN.md` and `adr/`. People behavior: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Content on official surfaces: [`docs/governance/content-policy.md`](./docs/governance/content-policy.md).

**Not legal advice.** License defaults: [`docs/governance/07-legal-ip.md`](./docs/governance/07-legal-ip.md).

## Developer Certificate of Origin (DCO)

Every mergeable contribution (human or agent-assisted) must carry a **DCO sign-off**. We do **not** require a copyright-assignment CLA to a founder or studio.

Add this line to each commit message:

    Signed-off-by: Your Name <you@example.com>

Git can add it for you:

    git commit -s -m "Your message"

Sign-off asserts (see [developercertificate.org](https://developercertificate.org/)):

- You have the right to submit the work under the applicable outbound license(s).
- The contribution is original, or properly relicensed and attributed.
- You are not smuggling secrets or known-infringing material.

Inbound = outbound. Losing race attempts stay under the same outbound terms once submitted.

## AI disclosure

AI is a tool, not an author. Models do not replace responsibility for license, provenance, or originality.

On every PR or race attempt, disclose:

| Field | What to say |
| --- | --- |
| **AI assistance** | used / not used |
| **Scope** | code, assets, text (rough is fine) |

Disclosure does **not** waive DCO. Do not paste memorized proprietary blobs. "The bot wrote it" is not a license escape hatch.

## How to work

1. Open an issue or cite an accepted target / ADR for medium+ game changes.
2. Keep diffs scoped. Do not touch other games or harness control-plane files unless the job says so.
3. Run the test script from the repo root. Keep the snake sim deterministic.
4. Sign off (DCO) and include the AI disclosure in the PR body.
5. Treat `DESIGN.md` as law. Pillar-bending work belongs in `variants/` or a slow-lane ADR.

## Licenses on new work

- Org / harness: Apache-2.0
- Game code (Snake): MIT (Apache-2.0 only via ADR)
- Original assets: CC0 or CC-BY-4.0, declared in-tree
- Docs: CC-BY-4.0

Third-party files keep their own licenses. Mystery packs without origin + license are rejected.

## Security reports

See [`SECURITY.md`](./SECURITY.md). Do not file a public issue for player-risk or key-risk bugs.
