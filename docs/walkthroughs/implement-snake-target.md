# Walkthrough: implement a Snake target

Short steps for a human contributor on their own computer. Neutral — no personal names.

Or just run `npm run foss` to pick a target interactively and print next steps.

Example target: `games/snake/targets/snake-local-hiscore.yaml` (local high-score table).

## 1. Sync main

```bash
git fetch origin
git checkout main
git pull origin main
```

## 2. Read the target YAML

Open `games/snake/targets/snake-local-hiscore.yaml` (or the target id you are implementing). Treat `acceptance_criteria` as the job checklist. Skim `games/snake/DESIGN.md` for design-fit.

## 3. Branch

Suggested branch name pattern:

```text
target/snake-local-hiscore
```

Or `target/<id>` for other targets.

```bash
git checkout -b target/snake-local-hiscore
```

## 4. Implement against acceptance criteria

Implement the feature so each AC item is satisfied. Keep the sim deterministic for a fixed seed. Prefer small, scoped diffs under `games/snake/`.

## 5. Run tests

From the repo root:

```bash
npm test
```

All tests should pass before you open a PR.

## 6. Commit with DCO sign-off

Commit as your FossArcade identity (org example: MediumSweetPotato). Sign off every commit (`git commit -s`):

```bash
git add -p
git commit -s -m "feat(snake): local high-score table"
```

## 7. Open a PR

Push the branch and create a PR against **FossArcade/foss-arcade** `main`:

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
