#!/usr/bin/env node
/** Poll r/FOSSArcade RSS; create GitHub issues via gh. Idempotent. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEEN_PATH = join(__dirname, ".seen.json");
const RSS_URL =
  process.env.REDDIT_RSS_URL || "https://www.reddit.com/r/FOSSArcade/.rss";
const USER_AGENT =
  process.env.REDDIT_USER_AGENT ||
  "FossArcade-intake/0.1 (by /u/MediumSmallPotato; +https://github.com/FossArcade/foss-arcade)";
const GH_REPO = process.env.GH_REPO || "FossArcade/foss-arcade";
const DRY_RUN = process.env.DRY_RUN === "1";
const MAX_CREATE = process.env.MAX_CREATE
  ? Number.parseInt(process.env.MAX_CREATE, 10)
  : Infinity;

function loadSeen() {
  if (!existsSync(SEEN_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SEEN_PATH, "utf8"));
  } catch {
    console.warn("warn: could not parse " + SEEN_PATH + "; starting empty");
    return {};
  }
}

function saveSeen(seen) {
  writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2) + "\n", "utf8");
}
function decodeXml(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCharCode(Number.parseInt(h, 16)),
    );
}

function tagText(block, tag) {
  const lower = block.toLowerCase();
  const openTag = "<" + tag.toLowerCase();
  let i = lower.indexOf(openTag);
  if (i < 0) return "";
  const afterOpen = block.indexOf(">", i);
  if (afterOpen < 0) return "";
  const close = "</" + tag + ">";
  const j = lower.indexOf(close.toLowerCase(), afterOpen);
  if (j < 0) return "";
  return decodeXml(block.slice(afterOpen + 1, j).trim());
}

/** Tiny RSS/Atom extractor — no deps. */
function attrValue(openTag, name) {
  const key = name + "=";
  const lower = openTag.toLowerCase();
  const i = lower.indexOf(key.toLowerCase());
  if (i < 0) return "";
  let p = i + key.length;
  while (p < openTag.length && /\s/.test(openTag[p])) p++;
  const q = openTag.charCodeAt(p);
  // 34 = double quote, 39 = single quote
  if (q === 34 || q === 39) {
    const end = openTag.indexOf(openTag[p], p + 1);
    if (end < 0) return "";
    return decodeXml(openTag.slice(p + 1, end));
  }
  let end = p;
  while (end < openTag.length && !/[\s>]/.test(openTag[end])) end++;
  return decodeXml(openTag.slice(p, end));
}

function linkFromBlock(block) {
  const textLink = tagText(block, "link");
  if (textLink && /^https?:/i.test(textLink)) return textLink;
  const lower = block.toLowerCase();
  let idx = 0;
  while ((idx = lower.indexOf("<link", idx)) >= 0) {
    const end = block.indexOf(">", idx);
    if (end < 0) break;
    const open = block.slice(idx, end + 1);
    const href = attrValue(open, "href");
    const rel = (attrValue(open, "rel") || "alternate").toLowerCase();
    if (href && (rel === "alternate" || !attrValue(open, "rel"))) return href;
    idx = end + 1;
  }
  return textLink || "";
}

function blocksOf(xml, tag) {
  const out = [];
  const open = "<" + tag;
  const close = "</" + tag + ">";
  const lower = xml.toLowerCase();
  let idx = 0;
  while ((idx = lower.indexOf(open, idx)) >= 0) {
    const after = xml.indexOf(">", idx);
    if (after < 0) break;
    // avoid matching <itemX or namespaced wrong — require > or space/ after tag name
    const boundary = xml[idx + open.length];
    if (boundary && boundary !== ">" && !/\s/.test(boundary)) {
      idx = after + 1;
      continue;
    }
    const j = lower.indexOf(close, after);
    if (j < 0) break;
    out.push(xml.slice(after + 1, j));
    idx = j + close.length;
  }
  return out;
}

function parseItems(xml) {
  const items = [];
  const blocks = blocksOf(xml, "item").concat(blocksOf(xml, "entry"));
  for (const block of blocks) {
    const title = tagText(block, "title");
    const link = linkFromBlock(block);
    const guid =
      tagText(block, "guid") ||
      tagText(block, "id") ||
      link;
    const nameOpen = block.toLowerCase().indexOf("<name>");
    let author = "";
    if (nameOpen >= 0) {
      const ns = nameOpen + 6;
      const ne = block.toLowerCase().indexOf("</name>", ns);
      if (ne > ns) author = decodeXml(block.slice(ns, ne).trim());
    }
    if (!author) {
      author =
        tagText(block, "dc:creator") ||
        tagText(block, "author") ||
        "";
    }
    const content =
      tagText(block, "description") ||
      tagText(block, "content") ||
      tagText(block, "summary") ||
      tagText(block, "content:encoded") ||
      "";
    const published =
      tagText(block, "pubDate") ||
      tagText(block, "published") ||
      tagText(block, "updated") ||
      "";
    if (!guid && !link) continue;
    items.push({
      guid: guid || link,
      title: title || "(no title)",
      link,
      author: author.replace(/^\/u\//, "") || "unknown",
      content,
      published,
    });
  }
  return items;
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "...";
}

function issueBody(item) {
  const snippet = truncate(stripHtml(item.content || ""), 1500);
  return [
    "## Reddit intake",
    "",
    "| Field | Value |",
    "| --- | --- |",
    "| Title | " + item.title.replace(/\|/g, "\\|") + " |",
    "| Link | " + (item.link || "(none)") + " |",
    "| Author | u/" + item.author + " |",
    "| GUID | `" + item.guid + "` |",
    "| Published | " + (item.published || "(unknown)") + " |",
    "",
    "### Snippet",
    "",
    snippet || "_No description in feed._",
    "",
    "---",
    "_Opened by tools/reddit-intake from r/FOSSArcade RSS. Not a binding vote — triage per governance._",
  ].join("\n");
}

function ghCreateIssue(item) {
  const title = truncate("[reddit] " + item.title, 200);
  const body = issueBody(item);
  const args = [
    "issue", "create", "--repo", GH_REPO,
    "--title", title, "--body", body,
    "--label", "reddit", "--label", "intake",
  ];
  const r = spawnSync("gh", args, { encoding: "utf8" });
  if (r.status !== 0) {
    const err = ((r.stderr || r.stdout || "") + "").trim();
    if (/label/i.test(err)) {
      console.warn("warn: label apply failed; retrying without labels");
      const args2 = [
        "issue", "create", "--repo", GH_REPO,
        "--title", title, "--body", body,
      ];
      const r2 = spawnSync("gh", args2, { encoding: "utf8" });
      if (r2.status !== 0) {
        throw new Error(((r2.stderr || r2.stdout || "gh failed") + "").trim());
      }
      return ((r2.stdout || "") + "").trim();
    }
    throw new Error(err || "gh issue create failed");
  }
  return ((r.stdout || "") + "").trim();
}

async function main() {
  console.log("Fetching " + RSS_URL);
  let res;
  try {
    res = await fetch(RSS_URL, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      redirect: "follow",
    });
  } catch (e) {
    console.error("Network error fetching RSS: " + e.message);
    process.exit(1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("RSS HTTP " + res.status + " " + res.statusText);
    console.error(truncate(text, 500));
    console.error("Hint: Reddit may block datacenter IPs or require a clearer User-Agent.");
    process.exit(1);
  }

  const xml = await res.text();
  const items = parseItems(xml);
  console.log("Parsed " + items.length + " item(s)");

  if (items.length === 0) {
    console.warn("warn: zero items — empty feed (new sub?) or parse miss. First 200 chars:");
    console.warn(xml.slice(0, 200));
  }

  const seen = loadSeen();
  let created = 0;
  const ordered = items.slice().reverse();

  for (const item of ordered) {
    if (seen[item.guid]) {
      console.log("skip (seen): " + item.guid);
      continue;
    }
    if (created >= MAX_CREATE) {
      console.log("MAX_CREATE=" + MAX_CREATE + " reached; stopping");
      break;
    }

    console.log("new: " + item.title + " (" + (item.link || item.guid) + ")");
    if (DRY_RUN) {
      console.log("  DRY_RUN=1 — not creating issue");
      created += 1;
      continue;
    }

    try {
      const url = ghCreateIssue(item);
      console.log("  created: " + (url || "(ok)"));
      seen[item.guid] = {
        link: item.link,
        title: item.title,
        issue: url || null,
        at: new Date().toISOString(),
      };
      saveSeen(seen);
      created += 1;
    } catch (e) {
      console.error("  failed: " + e.message);
      process.exitCode = 1;
      break;
    }
  }

  console.log("Done. New issues this run: " + created + (DRY_RUN ? " (dry)" : ""));
}

main();
