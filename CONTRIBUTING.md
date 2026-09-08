# Contributing to Foss Arcade

Welcome. This is a public FOSS forge: patch in the open, cite reasons, no private kingmaking.

Read [`docs/README.md`](./docs/README.md) and [`docs/OVERVIEW.md`](./docs/OVERVIEW.md) first. Game law lives in each title's `DESIGN.md` and `adr/`. People behavior: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Content on official surfaces: [`docs/governance/content-policy.md`](./docs/governance/content-policy.md).

**Not legal advice.** License defaults: [`docs/governance/07-legal-ip.md`](./docs/governance/07-legal-ip.md).

## Fork and pull request (default)

Outside contributors land work via **fork → branch → PR**. Direct push to `FossArcade/foss-arcade` is **maintainer-only**.

1. Fork `FossArcade/foss-arcade` (GitHub UI, or `gh repo fork FossArcade/foss-arcade --clone` / `--remote=true`).
2. Branch `target/<id>` (or another clear topic branch).
3. Implement against the target acceptance criteria; keep diffs scoped.
4. Run the test script from the repo root.
5. Commit with **your own** GitHub identity and DCO sign-off (`-s`). Outside contributors sign off as themselves — that is correct. Do **not** set `user.name` to MediumSweetPotato unless you are doing org-brand/maintainer work.
6. Push to **your fork**: `git push -u origin HEAD`.
7. Open a PR into FossArcade: `gh pr create --repo FossArcade/foss-arcade --title…` (or GitHub Compare & pull request from the fork).

Or run the contributor menu (`npm run foss`) to pick a target and print these next steps.

## Developer Certificate of Origin (DCO)

Every mergeable contribution (human or agent-assisted) must carry a **DCO sign-off**. We do **not** require a copyright-assignment CLA to a founder or studio.

The sign-off must match the **Git author** (name + email) used for the commit. `git commit -s` appends `Signed-off-by` from `user.name` / `user.email`.

**Default for commons contributors:** use your own GitHub name and noreply (or verified) email. Placeholder example:

    Signed-off-by: YourGitHubName <123456+YourGitHubName@users.noreply.github.com>

Git can add it for you:

    git commit -s -m "Your message"

Configure identity for this clone if needed (your account, not the org brand):

    git config user.name "YourGitHubName"
    git config user.email "123456+YourGitHubName@users.noreply.github.com"

### Maintainer / brand commits (MediumSweetPotato only)

Org-brand and maintainer work may use the public FossArcade brand account **MediumSweetPotato**. That path is **not** the default for outside contributors.

When committing as the brand (or on a maintainer machine that still has a personal global identity), use the one-shot form so Author, Committer, and Signed-off-by stay on the brand (does not change global git config):


    git -c user.name="MediumSweetPotato" -c user.email="325427902+MediumSweetPotato@users.noreply.github.com" commit -s -m "Your message"

Keep DCO (`-s`) under that brand identity only for org-brand/maintainer work. See also [`tools/harness/README.md`](./tools/harness/README.md).

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

1. Fork the repo (default), then open an issue or cite an accepted target / ADR for medium+ game changes.
2. Keep diffs scoped. Do not touch other games or harness control-plane files unless the job says so.
3. Run the test script from the repo root. Keep the snake sim deterministic.
4. Sign off (DCO) with your own identity and include the AI disclosure in the PR body.
5. Treat `DESIGN.md` as law. Pillar-bending work belongs in `variants/` or a slow-lane ADR.

## Licenses on new work

- Org / harness: Apache-2.0
- Game code (Snake): MIT (Apache-2.0 only via ADR)
- Original assets: CC0 or CC-BY-4.0, declared in-tree
- Docs: CC-BY-4.0

Third-party files keep their own licenses. Mystery packs without origin + license are rejected.

## Security reports

See [`SECURITY.md`](./SECURITY.md). Do not file a public issue for player-risk or key-risk bugs.
