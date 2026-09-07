# Harness tools (Seed)

Seed helper scripts for targets.

From repo root run `npm run foss` (or node tools/harness/foss.mjs).

## What it does

1. Scan games target YAML files (skip empty and gitkeep)
2. List game, id, title, status, size, flair
3. Pick by number or quit
4. Print summary and next steps (branch, test, signed commit, PR)
5. Follow-up: w starts the configured agent, or back / quit


## Starting an agent (w)

w builds a prompt from the selected target (id, title, game, YAML path, acceptance criteria, branch target/<id>) and launches an agent.

Preferred: set FOSS_AGENT_CMD to a shell command.
Placeholders {{PROMPT}} {{TARGET_ID}} {{TARGET_PATH}} {{REPO_ROOT}} {{BRANCH}} are expanded in that string.
Child env also includes FOSS_PROMPT, FOSS_TARGET_ID, FOSS_TARGET_PATH, FOSS_REPO_ROOT, FOSS_BRANCH.

Example: FOSS_AGENT_CMD='agent -p "$FOSS_PROMPT"'

If FOSS_AGENT_CMD is unset, foss looks for agent then cursor on PATH (agent -p prompt, or cursor agent -p prompt best-effort). Prefer FOSS_AGENT_CMD.

Dry-run: FOSS_AGENT_DRY_RUN=1 or --dry-run prints the resolved command and first ~400 chars of the prompt without spawning.

Smoke: send 1 then q on stdin; expect snake-local-hiscore listed and clean exit.

## Brand identity on agent commits

Agent / brand commits must not use the workstation personal git config. Plain `git commit -s` leaks host `user.name` / `user.email` into Author, Committer, and Signed-off-by.

Always use the one-shot form (do not change global git config):

```bash
git -c user.name="MediumSweetPotato" -c user.email="325427902+MediumSweetPotato@users.noreply.github.com" commit -s -m "feat(snake): …"
```

`foss.mjs` next-steps and the agent prompt include this CRITICAL IDENTITY guidance. Keep DCO (`-s`) under that MediumSweetPotato identity for brand/harness work.

Related: docs/harness/target.schema.md, docs/walkthroughs/implement-snake-target.md, tools/intake-write-target/.
