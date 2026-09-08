/** Brief export UI helpers (Seed slice 4). */
import { exportBriefReady, isBriefReady } from "./brief-export.js";
import { BRIEF_READY_SNAKE_WRAP } from "./fixtures/seed-briefs.js";

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
function flairBadge(flairId) {
  if (!flairId) return "";
  return `<span class="badge flair-badge flair-${escapeAttr(flairId)}">${escapeHtml(flairId)}</span>`;
}
function statusBadge(statusId) {
  if (!statusId) return "";
  const slug = String(statusId).replace(/^status:/, "");
  return `<span class="badge status-badge status-${escapeAttr(slug)}">${escapeHtml(statusId)}</span>`;
}
export function renderExportPreview(exported, isFixture = false) {
  const m = exported.meta || {};
  const note = isFixture
    ? "Seed fixture demo — not a live Discussion. Copy stubs for a human/bot PR."
    : m.note || "Copies markdown / YAML stubs for a human or bot to open a PR — no silent main writes.";
  return `
    <div class="brief-export-preview" data-export-preview="1">
      <p class="muted">${escapeHtml(note)}</p>
      <dl class="brief-export-meta">
        <dt>Target id</dt><dd><code>${escapeHtml(m.targetId || "")}</code></dd>
        <dt>Brief path</dt><dd><code>${escapeHtml(m.briefPathHint || "")}</code></dd>
        <dt>Target path</dt><dd><code>${escapeHtml(m.targetPathHint || "")}</code></dd>
        <dt>Intake</dt><dd><code class="intake-cmd">${escapeHtml(m.intakeCommand || "")}</code></dd>
      </dl>
      <div class="actions brief-export-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-copy-export="md">Copy markdown</button>
        <button type="button" class="btn btn-secondary btn-sm" data-copy-export="yaml">Copy target YAML</button>
        <button type="button" class="btn btn-secondary btn-sm" data-copy-export="intake">Copy intake command</button>
      </div>
      <p class="muted brief-export-status" data-export-status hidden></p>
      <details class="brief-export-details"><summary>Preview markdown</summary>
        <pre class="brief-export-pre">${escapeHtml(exported.md || "")}</pre></details>
      <details class="brief-export-details"><summary>Preview target YAML</summary>
        <pre class="brief-export-pre">${escapeHtml(exported.targetYaml || "")}</pre></details>
    </div>`;
}
export function renderPromoteSection(opts = {}) {
  const briefs = opts.briefs || [];
  const gameId = opts.gameId || "snake";
  const githubHref = opts.githubHref || "";
  const exported = opts.exported || null;
  const exportFromFixture = !!opts.exportFromFixture;
  const ready = briefs.filter(isBriefReady);
  const rows = ready
    .map(
      (t) => `
        <li class="thread-row">
          <a href="${escapeAttr(t.url || "#")}" rel="noopener noreferrer">${escapeHtml(t.title || t.id)}</a>
          <span class="thread-meta">
            ${flairBadge(t.flair)}
            ${statusBadge(t.status)}
            <button type="button" class="btn btn-primary btn-sm" data-export-thread="${escapeAttr(t.id)}">Export</button>
          </span>
        </li>`
    )
    .join("");
  const listBlock = ready.length
    ? `<ul class="thread-list">${rows}</ul>`
    : `<div class="empty-state"><p class="muted">No <code>status:brief-ready</code> threads in Shelf yet (Seed read-only port returns empty until live GraphQL). Try the fixture export below.</p></div>`;
  const preview = exported ? renderExportPreview(exported, exportFromFixture) : "";
  const html = `
    <section class="community-list promote-section" aria-labelledby="list-targets">
      <h3 id="list-targets">Targets / Promote</h3>
      <p class="muted">
        Harness targets stay in-repo (<code>games/${escapeHtml(gameId)}/targets/</code>).
        <code>brief-ready</code> exports markdown + target YAML stubs for
        <code>tools/intake-write-target</code> / fork→PR — no silent main writes.
      </p>
      <div class="actions" style="margin-bottom:0.5rem">
        <button type="button" class="btn btn-primary btn-sm" data-export-fixture="1">Export Seed fixture (brief-ready)</button>
        ${
          githubHref
            ? `<a class="btn btn-secondary btn-sm" href="${escapeAttr(githubHref)}" rel="noopener noreferrer">Open game files</a>`
            : ""
        }
      </div>
      ${listBlock}
      ${preview}
    </section>`;
  return { html, exported: exported || null };
}

export function runExport(thread, opts = {}) {
  return exportBriefReady(thread, opts);
}

export function getSeedBriefFixture() {
  return BRIEF_READY_SNAKE_WRAP;
}

export function bindPromoteSection(root, handlers = {}) {
  for (const btn of root.querySelectorAll("[data-export-fixture]")) {
    btn.addEventListener("click", () => handlers.onExportFixture && handlers.onExportFixture());
  }
  for (const btn of root.querySelectorAll("[data-export-thread]")) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-export-thread") || "";
      if (handlers.onExportThread) handlers.onExportThread(id);
    });
  }
  for (const btn of root.querySelectorAll("[data-copy-export]")) {
    btn.addEventListener("click", async () => {
      const kind = btn.getAttribute("data-copy-export");
      const exported = handlers.getExported ? handlers.getExported() : null;
      if (!exported) return;
      let text = "";
      if (kind === "md") text = exported.md || "";
      else if (kind === "yaml") text = exported.targetYaml || "";
      else if (kind === "intake") text = (exported.meta && exported.meta.intakeCommand) || "";
      const status = root.querySelector("[data-export-status]");
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          throw new Error("clipboard unavailable");
        }
        if (status) {
          status.hidden = false;
          status.textContent = "Copied to clipboard.";
        }
      } catch {
        if (status) {
          status.hidden = false;
          status.textContent = "Copy failed — select preview text manually.";
        }
      }
    });
  }
}
