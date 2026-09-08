# Walkthrough: implement a Snake target

Short steps for a human contributor on their own computer. Neutral — no personal names.

Or just run the contributor menu (`npm run foss`) to pick a target interactively and print next steps.

Example target: `games/snake/targets/snake-local-hiscore.yaml` (local high-score table).

## 1. Fork (default)

Outside contributors work on a **fork**. Direct push to `FossArcade/foss-arcade` is maintainer-only.


```bash
gh repo fork FossArcade/foss-arcade --remote=true
# or: GitHub UI fork, then clone your fork / add it as origin
```

## 2. Sync main

```bash
git fetch origin
git checkout main
git pull origin main
```

## 3. Read the target YAML

Open `games/snake/targets/snake-local-hiscore.yaml` (or the target id you are implementing). Treat `acceptance_criteria` as the job checklist. Skim `games/snake/DESIGN.md` for design-fit.

## 4. Branch

Suggested branch name pattern:

```text
target/snake-local-hiscore
```

Or `target/<id>` for other targets.

```bash
git checkout -b target/snake-local-hiscore
```

## 5. Implement against acceptance criteria

Implement the feature so each AC item is satisfied. Keep the sim deterministic for a fixed seed. Prefer small, scoped diffs under `games/snake/`.

## 6. Run tests

From the repo root:

```bash
npm test
```

All tests should pass before you open a PR.

## 7. Commit with DCO sign-off

Use **your own** GitHub identity. Outside contributors sign off as themselves — that is correct. Placeholder shape:

    Signed-off-by: YourGitHubName <123456+YourGitHubName@users.noreply.github.com>

Do **not** put a personal legal name or personal email in examples or commits for this project's brand docs; commons contributors use their GitHub noreply (or verified) identity.

```bash
git config user.name   # your GitHub login / public name
git config user.email  # your GitHub noreply or verified email
git add -p
git commit -s -m "feat(snake): local high-score table"
```

**Maintainers/brand only:** MediumSweetPotato one-shot `-c` is for org-brand commits — see CONTRIBUTING.md. Not the default for commons contributors.

## 8. Push fork and open a PR

Push the branch to **your fork**, then create a PR against **FossArcade/foss-arcade** `main`:

```bash
git push -u origin HEAD
gh pr create --repo FossArcade/foss-arcade --title "feat(snake): local high-score table" --body "## Summary
Implements target `snake-local-hiscore`.

## AI disclosure
- AI assistance: <used / not used>
- Scope: <code / docs / …>
"
```

Cite the target path in the PR body. Medium+ design changes still need an ADR when DESIGN.md requires it.

## Related

- Target schema: [`docs/harness/target.schema.md`](../harness/target.schema.md)
- Contributing / DCO: [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
- Snake README: [`games/snake/README.md`](../../games/snake/README.md)

