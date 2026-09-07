#!/usr/bin/env node
/**
 * Write a harness target YAML from a markdown (frontmatter) or JSON proposal.
 * Usage: node tools/intake-write-target/write.mjs <path-to-proposal>
 * Idempotent: if games/<game>/targets/<id>.yaml exists, skip and exit 0.
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");

const STATUSES = new Set([
  "proposed",
  "eligible",
  "funded",
  "queued",
  "active",
  "review",
  "merged",
  "failed",
  "rejected",
]);
const SIZES = new Set(["S", "M", "L"]);

function usage(msg) {
  if (msg) console.error("error:", msg);
  console.error(
    "usage: node tools/intake-write-target/write.mjs <proposal.md|proposal.json>",
  );
  process.exit(msg ? 1 : 0);
}

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

/** Minimal YAML frontmatter + body split. */
function splitFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { meta: {}, body: normalized };
  }
  const end = normalized.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: normalized };
  const raw = normalized.slice(3, end).replace(/^\r?\n/, "");
  const body = normalized.slice(end + 4).replace(/^\r?\n/, "");
  return { meta: parseSimpleYaml(raw), body };
}

/**
 * Tiny subset YAML parser for flat keys + nested `links:` map + lists.
 * Good enough for intake fixtures; not a general YAML engine.
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
    const mapMatch = /^([A-Za-z_][\w-]*)\s*:\s*$/.exec(line);
    if (mapMatch) {
      const key = mapMatch[1];
      const nested = {};
      i++;
      while (i < lines.length) {
        const n = lines[i];
        if (!n.trim()) {
          i++;
          continue;
        }
        if (/^\S/.test(n)) break;
        const nm = /^\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(n);
        if (!nm) break;
        nested[nm[1]] = parseScalar(nm[2]);
        i++;
      }
      out[key] = nested;
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (kv) {
      const key = kv[1];
      const rest = kv[2].trim();
      if (rest === "" || rest === "|" || rest === ">") {
        // skip block scalars in this minimal parser
        out[key] = rest === "" ? "" : rest;
        i++;
        continue;
      }
      if (rest.startsWith("[")) {
        out[key] = parseInlineList(rest);
        i++;
        continue;
      }
      out[key] = parseScalar(rest);
      i++;
      continue;
    }
    i++;
  }
  return out;
}

function parseScalar(raw) {
  const t = raw.trim();
  if (t === "null" || t === "~" || t === "") return null;
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+$/.test(t)) return Number(t);
  return stripQuotes(t);
}

function parseInlineList(s) {
  const inner = s.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((x) => parseScalar(x));
}

function extractAcceptanceCriteria(body) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) =>
    /^#{1,3}\s*acceptance criteria\b/i.test(l.trim()),
  );
  if (start < 0) return [];
  const items = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{1,3}\s+/.test(l)) break;
    const m = /^\s*[-*]\s+(?:\[[ xX]\]\s+)?(.+)$/.exec(l);
    if (m) items.push(m[1].trim());
  }
  return items;
}

function loadProposal(path) {
  const abs = resolve(path);
  if (!existsSync(abs)) usage("file not found: " + path);
  const text = readFileSync(abs, "utf8");
  const ext = extname(abs).toLowerCase();
  if (ext === ".json") {
    const data = JSON.parse(text);
    return normalizeProposal(data, abs);
  }
  if (ext === ".md" || ext === ".markdown") {
    const { meta, body } = splitFrontmatter(text);
    if (
      !meta.acceptance_criteria ||
      !Array.isArray(meta.acceptance_criteria) ||
      meta.acceptance_criteria.length === 0
    ) {
      const fromBody = extractAcceptanceCriteria(body);
      if (fromBody.length) meta.acceptance_criteria = fromBody;
    }
    if (!meta.source) {
      const rel = abs.startsWith(REPO_ROOT)
        ? abs.slice(REPO_ROOT.length).replace(/^[/\\]/, "").replace(/\\/g, "/")
        : abs;
      meta.source = "fixture://" + rel;
    }
    return normalizeProposal(meta, abs);
  }
  usage("unsupported extension (use .md or .json): " + ext);
}

function normalizeProposal(raw) {
  const id = String(raw.id || "").trim();
  const game = String(raw.game || "").trim();
  const title = String(raw.title || "").trim();
  const flair = String(raw.flair || "").trim();
  const lane = String(raw.lane || "").trim();
  const status = String(raw.status || "proposed").trim();
  const size = String(raw.size || "S").trim().toUpperCase();
  const source = String(raw.source || "").trim();
  let acceptance = raw.acceptance_criteria;
  if (!Array.isArray(acceptance)) acceptance = [];
  acceptance = acceptance.map((x) => String(x).trim()).filter(Boolean);
  const created =
    raw.created != null && String(raw.created).trim() !== ""
      ? String(raw.created).trim()
      : new Date().toISOString().slice(0, 10);
  const links =
    raw.links && typeof raw.links === "object" && !Array.isArray(raw.links)
      ? { ...raw.links }
      : {};

  const missing = [];
  if (!id) missing.push("id");
  if (!game) missing.push("game");
  if (!title) missing.push("title");
  if (!flair) missing.push("flair");
  if (!lane) missing.push("lane");
  if (!source) missing.push("source");
  if (!acceptance.length) missing.push("acceptance_criteria");
  if (missing.length) {
    usage("proposal missing required fields: " + missing.join(", "));
  }
  if (!STATUSES.has(status)) {
    usage("invalid status: " + status);
  }
  if (!SIZES.has(size)) {
    usage("invalid size (want S|M|L): " + size);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    usage("id must be lowercase slug (a-z0-9-): " + id);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game)) {
    usage("game must be lowercase slug: " + game);
  }

  return {
    id,
    game,
    title,
    flair,
    lane,
    status,
    source,
    acceptance_criteria: acceptance,
    size,
    created,
    links,
  };
}

function yamlEscape(s) {
  if (s == null) return "null";
  if (typeof s === "boolean") return s ? "true" : "false";
  if (typeof s === "number") return String(s);
  const str = String(s);
  if (
    str === "" ||
    /[:#{}[\],&*?|>!%@`]/.test(str) ||
    /^\s|\s$/.test(str) ||
    /^(true|false|null|~)$/i.test(str)
  ) {
    return JSON.stringify(str);
  }
  return str;
}

function toYaml(target) {
  const lines = [];
  lines.push(`# Target: ${target.id} — generated by intake-write-target`);
  lines.push(`# Schema: docs/harness/target.schema.md`);
  lines.push(`id: ${yamlEscape(target.id)}`);
  lines.push(`game: ${yamlEscape(target.game)}`);
  lines.push(`title: ${yamlEscape(target.title)}`);
  lines.push(`flair: ${yamlEscape(target.flair)}`);
  lines.push(`lane: ${yamlEscape(target.lane)}`);
  lines.push(`status: ${yamlEscape(target.status)}`);
  lines.push(`source: ${yamlEscape(target.source)}`);
  lines.push("acceptance_criteria:");
  for (const ac of target.acceptance_criteria) {
    lines.push(`  - ${yamlEscape(ac)}`);
  }
  lines.push(`size: ${yamlEscape(target.size)}`);
  lines.push(`created: ${yamlEscape(target.created)}`);
  lines.push("links:");
  const linkKeys = Object.keys(target.links);
  if (linkKeys.length === 0) {
    lines.push("  design: null");
    lines.push("  discussion: null");
    lines.push("  issue: null");
  } else {
    for (const k of linkKeys) {
      const v = target.links[k];
      if (Array.isArray(v)) {
        if (v.length === 0) {
          lines.push(`  ${k}: []`);
        } else {
          lines.push(`  ${k}:`);
          for (const item of v) lines.push(`    - ${yamlEscape(item)}`);
        }
      } else {
        lines.push(`  ${k}: ${yamlEscape(v)}`);
      }
    }
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const arg = process.argv[2];
  if (!arg || arg === "-h" || arg === "--help") usage(arg ? null : "missing proposal path");

  const target = loadProposal(arg);
  const outDir = join(REPO_ROOT, "games", target.game, "targets");
  const outPath = join(outDir, `${target.id}.yaml`);

  if (existsSync(outPath)) {
    console.log("skip: target already exists:", outPath.replace(REPO_ROOT + "/", ""));
    process.exit(0);
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const yaml = toYaml(target);
  writeFileSync(outPath, yaml, "utf8");
  console.log("wrote:", outPath.replace(REPO_ROOT + "/", ""));
}

main();
