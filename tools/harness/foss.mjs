#!/usr/bin/env node
/**
 * Foss Arcade contributor menu - pick a harness target and get next steps.
 * Usage: npm run foss

 *        node tools/harness/foss.mjs

 * Non-interactive smoke: printf '1\nq\n' | npm run foss
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as readline from "node:readline";
import { spawn, spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const GAMES_DIR = join(REPO_ROOT, "games");

function stripQuotes(s) {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function parseScalar(raw) {
  const t = raw.trim();
  if (t === "null" || t === "~" || t === "") return null;
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+$/.test(t)) return Number(t);
  return stripQuotes(t);
}

/**
 * Tiny YAML subset: flat keys, indented lists (- item), nested maps (key:).
 */
function parseSimpleYaml(src) {
  const out = {};
  const lines = src.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    if (!/^\S/.test(line)) {
      i++;
      continue;
    }

    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) {
      i++;
      continue;
    }

    const key = kv[1];
    const rest = kv[2].trim();
    i++;

    if (rest !== "" && rest !== "|" && rest !== ">") {
      if (rest.startsWith("[")) {
        const inner = rest.replace(/^\[/, "").replace(/\]$/, "");
        out[key] = inner.trim()
          ? inner.split(",").map((x) => parseScalar(x))
          : [];
      } else {
        out[key] = parseScalar(rest);
      }
      continue;
    }

    const block = [];
    while (i < lines.length) {
      const n = lines[i];
      if (!n.trim() || n.trim().startsWith("#")) {
        i++;
        continue;
      }
      if (/^\S/.test(n)) break;
      block.push(n);
      i++;
    }

    if (block.length === 0) {
      out[key] = rest === "" ? "" : rest;
      continue;
    }

    const isList = block.every(
      (l) => /^\s*-\s+/.test(l) || !l.trim() || l.trim().startsWith("#"),
    );
    if (isList) {
      out[key] = block
        .filter((l) => /^\s*-\s+/.test(l))
        .map((l) => parseScalar(l.replace(/^\s*-\s+/, "")));
      continue;
    }

    const nested = {};
    for (const n of block) {
      const nm = /^\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(n);
      if (nm) nested[nm[1]] = parseScalar(nm[2]);
    }
    out[key] = nested;
  }

  return out;
}

function scanTargets() {
  const targets = [];
  let games;
  try {
    games = readdirSync(GAMES_DIR);
  } catch {
    return targets;
  }

  for (const game of games.sort()) {
    const targetsDir = join(GAMES_DIR, game, "targets");
    let entries;
    try {
      if (!statSync(targetsDir).isDirectory()) continue;
      entries = readdirSync(targetsDir);
    } catch {
      continue;
    }

    for (const name of entries.sort()) {
      if (name === ".gitkeep" || name.startsWith(".")) continue;
      if (!name.endsWith(".yaml") && !name.endsWith(".yml")) continue;
      const path = join(targetsDir, name);
      let st;
      try {
        st = statSync(path);
      } catch {
        continue;
      }
      if (!st.isFile() || st.size === 0) continue;

      let data;
      try {
        data = parseSimpleYaml(readFileSync(path, "utf8"));
      } catch {
        data = {};
      }

      const id = data.id || name.replace(/\.ya?ml$/, "");
      targets.push({
        path: relative(REPO_ROOT, path).replace(/\\/g, "/"),
        absPath: path,
        game: data.game || game,
        id,
        title: data.title || id,
        status: data.status || "unknown",
        size: data.size ?? null,
        flair: data.flair ?? null,
        lane: data.lane ?? null,
        source: data.source ?? null,
        created: data.created ?? null,
        acceptance_criteria: Array.isArray(data.acceptance_criteria)
          ? data.acceptance_criteria
          : [],
        links: data.links && typeof data.links === "object" ? data.links : {},
        raw: data,
      });
    }
  }

  return targets;
}

function formatListLine(index, t) {
  const bits = [
    "[" + index + "]",
    t.game,
    t.id,
    "\u2014 " + t.title,
    "(" + t.status + ")",
  ];
  if (t.size != null) bits.push("[" + t.size + "]");
  if (t.flair) bits.push(t.flair);
  return bits.join(" ");
}

function printTargetSummary(t) {
  console.log("");
  console.log("--- Target --------------------------------------");
  console.log("  id:      " + t.id);
  console.log("  game:    " + t.game);
  console.log("  title:   " + t.title);
  console.log("  status:  " + t.status);
  if (t.size != null) console.log("  size:    " + t.size);
  if (t.flair) console.log("  flair:   " + t.flair);
  if (t.lane) console.log("  lane:    " + t.lane);
  if (t.created) console.log("  created: " + t.created);
  if (t.source) console.log("  source:  " + t.source);
  console.log("  path:    " + t.path);
  if (t.links && t.links.design) console.log("  design:  " + t.links.design);
  if (t.acceptance_criteria.length) {
    console.log("  acceptance_criteria:");
    for (const ac of t.acceptance_criteria) {
      console.log("    - " + ac);
    }
  }
  console.log("");
}

function printNextSteps(t) {
  const branch = "target/" + t.id;
  const walkthrough = "docs/walkthroughs/implement-snake-target.md";
  console.log("--- Next steps ---------------------------");
  console.log("  1. Sync main, then branch:");
  console.log("       git fetch origin && git checkout main && git pull origin main");
  console.log("       git checkout -b " + branch);
  console.log("  2. Read the target YAML and implement against acceptance_criteria.");
  console.log("       Prefer scoped diffs under games/" + t.game + "/.");
  console.log("  3. Run tests from repo root:");
  console.log("       npm test");
  console.log("  4. Commit with DCO sign-off (-s) under FossArcade identity (no personal name/email):");
  console.log("       git add -p");
  console.log(
        '       git -c user.name="MediumSweetPotato" -c user.email="325427902+MediumSweetPotato@users.noreply.github.com" commit -s -m "feat(' +
          t.game +
          "): " +
          t.title +
          '"',
      );
  console.log(
        "       (one-shot -c; never rely on this machine's user.name / user.email)",
      );
  console.log("  5. Push and open a PR:");
  console.log("       git push -u origin HEAD");
  const prTitle = "feat(" + t.game + "): " + t.title;
  const prBody = "## Summary\nImplements target `" + t.id + "`.\n\n## AI disclosure\n- AI assistance: <used / not used>\n- Scope: <code / docs / …>\n";
  console.log("       gh pr create --repo FossArcade/foss-arcade --title " + JSON.stringify(prTitle) + " --body " + JSON.stringify(prBody));
  console.log("  Walkthrough (example): " + walkthrough);
  console.log("  Tip: press [w] to start the configured agent (FOSS_AGENT_CMD) on this target.");
  console.log("");
}


function buildAgentPrompt(t) {
  const branch = "target/" + t.id;
  const criteria =
    t.acceptance_criteria.length > 0
      ? t.acceptance_criteria.map((c) => "- " + c).join("\n")
      : "- (none listed — follow the target YAML)";
  return [
    "Implement Foss Arcade harness target `" + t.id + "`.",
    "",
    "Target:",
    "- id: " + t.id,
    "- title: " + t.title,
    "- game: " + t.game,
    "- YAML path: " + t.path,
    "",
    "Acceptance criteria:",
    criteria,
    "",
    "CRITICAL IDENTITY (brand / harness commits):",
    "- NEVER use this machine's default git identity (user.name / user.email).",
    "- Plain `git commit -s` WILL leak the host config into Author, Committer, and Signed-off-by.",
    "- ALWAYS use this one-shot form (sets author, committer, and Signed-off-by for that commit only; do NOT change global git config):",
    '  git -c user.name="MediumSweetPotato" -c user.email="325427902+MediumSweetPotato@users.noreply.github.com" commit -s -m "…"',
    "- Never put a personal/legal name or personal email in Author, Committer, or Signed-off-by for FossArcade brand/harness work.",
    "- Keep DCO (`-s`) but only under that MediumSweetPotato identity.",
    "",
    "Workflow:",
    "1. Create and work on branch `" + branch + "`.",
    "2. Prefer scoped diffs under games/" + t.game + "/ (do not expand scope unnecessarily).",
    "3. Run `npm test` from the repo root and fix failures.",
    '4. Commit with DCO under brand identity: `git -c user.name="MediumSweetPotato" -c user.email="325427902+MediumSweetPotato@users.noreply.github.com" commit -s -m "…"`.',
    "5. Push the branch and open a PR against main describing the change.",
    "",
    "Stay within the target acceptance criteria. Do not implement unrelated features.",
  ].join("\n");
}


function isDryRun() {
  if (process.env.FOSS_AGENT_DRY_RUN === "1") return true;
  return process.argv.includes("--dry-run");
}

function expandAgentCmd(template, vars) {
  return template
    .replaceAll("{{PROMPT}}", vars.PROMPT)
    .replaceAll("{{TARGET_ID}}", vars.TARGET_ID)
    .replaceAll("{{TARGET_PATH}}", vars.TARGET_PATH)
    .replaceAll("{{REPO_ROOT}}", vars.REPO_ROOT)
    .replaceAll("{{BRANCH}}", vars.BRANCH);
}

function whichBin(name) {
  const r = spawnSync("which", [name], { encoding: "utf8" });
  if (r.status === 0 && r.stdout && r.stdout.trim()) {
    return r.stdout.trim();
  }
  return null;
}

function resolveAgentLaunch(prompt, vars) {
  const custom = process.env.FOSS_AGENT_CMD;
  if (custom && custom.trim()) {
    const cmd = expandAgentCmd(custom, vars);
    return { mode: "shell", cmd, label: cmd };
  }

  const agentPath = whichBin("agent");
  if (agentPath) {
    return {
      mode: "args",
      file: agentPath,
      args: ["-p", prompt],
      label: agentPath + " -p <prompt>",
    };
  }

  const cursorPath = whichBin("cursor");
  if (cursorPath) {
    return {
      mode: "args",
      file: cursorPath,
      args: ["agent", "-p", prompt],
      label: cursorPath + " agent -p <prompt>",
    };
  }

  return null;
}

function spawnAndWait(fileOrCmd, options) {
  return new Promise((resolvePromise, reject) => {
    const child =
      options.shell === true
        ? spawn(fileOrCmd, { ...options })
        : spawn(fileOrCmd, options.args || [], options);
    child.on("error", reject);
    child.on("close", (code, signal) => {
      resolvePromise({ code, signal });
    });
  });
}

async function launchAgent(t) {
  console.log("");
  console.log("Starting agent for " + t.id + "…");

  const prompt = buildAgentPrompt(t);
  const branch = "target/" + t.id;
  const vars = {
    PROMPT: prompt,
    TARGET_ID: t.id,
    TARGET_PATH: t.path,
    REPO_ROOT,
    BRANCH: branch,
  };

  const env = {
    ...process.env,
    FOSS_PROMPT: prompt,
    FOSS_TARGET_ID: t.id,
    FOSS_TARGET_PATH: t.path,
    FOSS_REPO_ROOT: REPO_ROOT,
    FOSS_BRANCH: branch,
  };

  const resolved = resolveAgentLaunch(prompt, vars);
  const dry = isDryRun();

  if (dry) {
    console.log("  [dry-run] FOSS_AGENT_DRY_RUN / --dry-run set — not spawning.");
    if (resolved) {
      console.log("  [dry-run] command: " + resolved.label);
    } else {
      console.log(
        "  [dry-run] no FOSS_AGENT_CMD and no agent/cursor on PATH.",
      );
      console.log(
        "  Set FOSS_AGENT_CMD, e.g. FOSS_AGENT_CMD='agent -p \"$FOSS_PROMPT\"'",
      );
    }
    const preview =
      prompt.length > 400 ? prompt.slice(0, 400) + "…" : prompt;
    console.log("  [dry-run] prompt (first ~400 chars):");
    console.log(preview);
    console.log("");
    return;
  }

  if (!resolved) {
    console.log("  No agent command configured.");
    console.log(
      "  Set FOSS_AGENT_CMD to launch an agent, e.g.:",
    );
    console.log("    FOSS_AGENT_CMD='agent -p \"$FOSS_PROMPT\"'");
    console.log(
      "  Placeholders: {{PROMPT}} {{TARGET_ID}} {{TARGET_PATH}} {{REPO_ROOT}} {{BRANCH}}",
    );
    console.log(
      "  Env passed to the child: FOSS_PROMPT, FOSS_TARGET_ID, FOSS_TARGET_PATH, FOSS_REPO_ROOT, FOSS_BRANCH",
    );
    console.log("");
    return;
  }

  const common = {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env,
  };

  let result;
  if (resolved.mode === "shell") {
    result = await spawnAndWait(resolved.cmd, { ...common, shell: true });
  } else {
    result = await spawnAndWait(resolved.file, {
      ...common,
      args: resolved.args,
    });
  }

  if (result.code != null && result.code !== 0) {
    console.log(
      "  Agent exited with code " + result.code + (result.signal ? " (signal " + result.signal + ")" : "") + ".",
    );
  }
  console.log("");
}

function createAsk(rl) {
  const queue = [];
  const waiters = [];
  rl.on("line", (line) => {
    if (waiters.length) waiters.shift()(line);
    else queue.push(line);
  });
  rl.on("close", () => {
    while (waiters.length) waiters.shift()(null);
  });
  return (prompt) => {
    process.stdout.write(prompt);
    return new Promise((resolve) => {
      if (queue.length) resolve(queue.shift());
      else waiters.push(resolve);
    });
  };
}

function question(ask, prompt) {
  return ask(prompt).then((value) => (value == null ? "q" : value));
}

async function secondMenu(ask, t) {
  console.log("  [w] Work (start agent)   [b] Back to list   [q] Quit");
  for (;;) {
    const ans = (await question(ask, "> ")).trim().toLowerCase();
    if (ans === "q" || ans === "quit") return "quit";
    if (ans === "b" || ans === "back" || ans === "") return "back";
    if (ans === "w" || ans === "work" || ans === "1") {
      await launchAgent(t);
      return "back";
    }
    console.log("  Enter w, b, or q.");
  }
}

async function main() {
  const targets = scanTargets();

  if (targets.length === 0) {
    console.log("No harness targets found under games/*/targets/.");
    console.log(
      "Add a *.yaml target (see docs/harness/target.schema.md), or run npm run intake:target.",
    );
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY),
  });
  const ask = createAsk(rl);

  try {
    for (;;) {
      console.log("");
      console.log("Foss Arcade — contributor targets");
      console.log("--------------------------------");
      targets.forEach((t, i) => {
        console.log(formatListLine(i + 1, t));
      });
      console.log("  [q] Quit");
      console.log("");

      const ans = (await question(ask, "Pick a target number (or q): ")).trim();
      if (
        ans === "" ||
        ans.toLowerCase() === "q" ||
        ans.toLowerCase() === "quit"
      ) {
        console.log("Bye.");
        break;
      }

      const n = Number.parseInt(ans, 10);
      if (!Number.isFinite(n) || n < 1 || n > targets.length) {
        console.log("  Invalid choice. Enter 1-" + targets.length + ", or q.");
        continue;
      }

      const t = targets[n - 1];
      printTargetSummary(t);
      printNextSteps(t);

      const next = await secondMenu(ask, t);
      if (next === "quit") {
        console.log("Bye.");
        break;
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
