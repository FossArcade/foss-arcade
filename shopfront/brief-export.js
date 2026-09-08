export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "brief";
}

export function proposeTargetId(thread) {
  if (thread.targetId && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(thread.targetId)) {
    return thread.targetId;
  }
  const game = String(thread.game || "game").trim();
  return game + "-" + slugify(thread.title);
}

export function isBriefReady(thread) {
  const status = String(thread && thread.status || "").toLowerCase();
  const tags = Array.isArray(thread && thread.tags) ? thread.tags : [];
  return (
    status === "brief-ready" ||
    status === "status:brief-ready" ||
    tags.includes("status:brief-ready") ||
    tags.includes("brief-ready")
  );
}

export function buildBriefMarkdown(thread, opts = {}) {
  const created = opts.created || new Date().toISOString().slice(0, 10);
  const flair = thread.flair || "feature";
  const game = thread.game || "unknown";
  const title = thread.title || "Untitled brief";
  const targetId = proposeTargetId(thread);
  const ac = Array.isArray(thread.acceptanceCriteria)
    ? thread.acceptanceCriteria
    : [];
  const acBlock =
    ac.length > 0
      ? ac.map((line) => "- " + line).join("\n")
      : "- (add acceptance criteria before opening a target PR)";
  const source = thread.url
    ? JSON.stringify(thread.url)
    : "discussion://" + thread.id;
  const disc = thread.url ? JSON.stringify(thread.url) : "null";
  const lines = [
    "---",
    "id: " + targetId,
    "game: " + game,
    "title: " + JSON.stringify(title),
    "flair: " + flair,
    "lane: " + (thread.lane || "code"),
    "status: proposed",
    "size: " + (thread.size || "S"),
    "source: " + source,
    "created: " + JSON.stringify(created),
    "links:",
    "  design: games/" + game + "/DESIGN.md",
    "  discussion: " + disc,
    "  issue: null",
    "---",
    "",
    "# [" + flair + "] " + title,
    "",
    (thread.body && thread.body.trim()) ||
      "_No body supplied — paste the living brief here._",
    "",
    "## Acceptance criteria",
    "",
    acBlock,
    "",
    "## Success sniff test",
    "",
    "A stranger can verify the change offline without an account wall.",
    "",
  ];
  return lines.join("\n");
}
export function buildTargetProposal(thread, opts = {}) {
  const created = opts.created || new Date().toISOString().slice(0, 10);
  const id = proposeTargetId(thread);
  const game = thread.game || "unknown";
  const acIn = thread.acceptanceCriteria;
  let ac = Array.isArray(acIn) && acIn.length ? acIn.map((x) => String(x).trim()).filter(Boolean) : ["Documented AC from the brief", "tests still pass"];
  return {
    id, game,
    title: thread.title || id,
    flair: thread.flair || "feature",
    lane: thread.lane || "code",
    status: "proposed",
    size: thread.size || "S",
    source: thread.url || ("discussion://" + thread.id),
    created,
    acceptance_criteria: ac,
    links: {
      design: "games/" + game + "/DESIGN.md",
      discussion: thread.url || null,
      issue: null,
    },
  };
}

export function buildTargetYamlStub(proposal) {
  const L = [];
  L.push("# Target: " + proposal.id + " — stub from brief-ready export");
  L.push("# Schema: docs/harness/target.schema.md");
  L.push("id: " + proposal.id);
  L.push("game: " + proposal.game);
  L.push("title: " + JSON.stringify(proposal.title));
  L.push("flair: " + proposal.flair);
  L.push("lane: " + proposal.lane);
  L.push("status: " + proposal.status);
  L.push("source: " + JSON.stringify(proposal.source));
  L.push("acceptance_criteria:");
  for (const ac of proposal.acceptance_criteria) L.push("  - " + JSON.stringify(ac));
  L.push("size: " + proposal.size);
  L.push("created: " + proposal.created);
  L.push("links:");
  L.push("  design: " + proposal.links.design);
  const d = proposal.links.discussion;
  L.push("  discussion: " + (d == null ? "null" : JSON.stringify(d)));
  L.push("  issue: null");
  L.push("");
  return L.join("\n");
}

export function exportBriefReady(thread, opts = {}) {
  const proposal = buildTargetProposal(thread, opts);
  const md = buildBriefMarkdown(thread, opts);
  const targetYaml = buildTargetYamlStub(proposal);
  return {
    md,
    targetYaml,
    proposal,
    meta: {
      threadId: thread.id,
      game: thread.game,
      status: thread.status || null,
      briefReady: isBriefReady(thread),
      targetId: proposal.id,
      briefPathHint: "community/briefs/" + proposal.id + ".md",
      targetPathHint: "games/" + proposal.game + "/targets/" + proposal.id + ".yaml",
      intakeCommand: "node tools/intake-write-target/write.mjs path/to/" + proposal.id + ".json",
      discussionsUrl: thread.url || null,
      note: "Copies markdown / YAML stubs for a human or bot to open a PR — no silent main writes.",
    },
  };
}
