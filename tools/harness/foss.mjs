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
  console.log("  4. Commit with DCO sign-off (-s):");
  console.log("       git add -p");
  console.log("       git commit -s -m \"feat(" + t.game + "): " + t.title + "\"");
  console.log("  5. Push and open a PR:");
  console.log("       git push -u origin HEAD");
  const prTitle = "feat(" + t.game + "): " + t.title;
  const prBody = "## Summary\nImplements target `" + t.id + "`.\n\n## AI disclosure\n- AI assistance: <used / not used>\n- Scope: <code / docs / …>\n";
  console.log("       gh pr create --repo FossArcade/foss-arcade --title " + JSON.stringify(prTitle) + " --body " + JSON.stringify(prBody));
  console.log("  Walkthrough (example): " + walkthrough);
  console.log("");
}

function question(rl, prompt) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value == null ? "" : value);
    };
    rl.question(prompt, finish);
    rl.once("close", () => finish("q"));
  });
}

async function secondMenu(rl, t) {
  console.log("  [w] Work on this   [b] Back to list   [q] Quit");
  for (;;) {
    const ans = (await question(rl, "> ")).trim().toLowerCase();
    if (ans === "q" || ans === "quit") return "quit";
    if (ans === "b" || ans === "back" || ans === "") return "back";
    if (ans === "w" || ans === "work" || ans === "1") {
      console.log("");
      console.log("  You're set on " + t.id + ". Follow the next steps above.");
      console.log("  Suggested branch: target/" + t.id);
      console.log("");
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
  });

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

      const ans = (await question(rl, "Pick a target number (or q): ")).trim();
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

      const next = await secondMenu(rl, t);
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
