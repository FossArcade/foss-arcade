/**
 * TabCommunity UI — FlairBadge / FlairFilter / PipelineStrip + ForumPort-backed lists.
 * Slice 3: ConsiderationCatalog + ConsiderationVoteRow; PipelineStrip tracks filter state.
 * Slice 4: brief-ready Promote export (markdown + target YAML stub) via ForumPort / brief-export.
 * Snake only for Community e2e; callers must respect PlaceholderGameGate.
 */

import {
  PIPELINE_STAGES,
  SNAKE_CATEGORIES,
  SNAKE_FLAIRS,
  FORUM_STATUS_LABELS,
  SNAKE_CONSIDERATION_CATALOG,
  FLAIR_TO_PIPELINE_STAGE,
  STATUS_TO_PIPELINE_STAGE,
  asCommunityStore,
} from "./forum-port.js";
import { githubDiscussionsPort } from "./github-discussions-port.js";
import {
  renderPromoteSection,
  bindPromoteSection,
  runExport,
  getSeedBriefFixture,
} from "./brief-export-ui.js";
import { isBriefReady } from "./brief-export.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

/** FlairBadge — one primary flair from docs/reddit/flairs.md */
export function renderFlairBadge(flairId) {
  if (!flairId) return "";
  const known = SNAKE_FLAIRS.find((f) => f.id === flairId);
  const label = known?.label || flairId;
  return `<span class="badge flair-badge flair-${escapeAttr(
    flairId
  )}">${escapeHtml(label)}</span>`;
}

/** Status badge from community-forum.md status:* labels (or proposal pipeline). */
export function renderStatusBadge(statusId) {
  if (!statusId) return "";
  const known = FORUM_STATUS_LABELS.find(
    (s) => s.id === statusId || s.label === statusId || s.id === `status:${statusId}`
  );
  const label = known?.label || statusId;
  const slug = String(statusId).replace(/^status:/, "");
  return `<span class="badge status-badge status-${escapeAttr(
    slug
  )}">${escapeHtml(label)}</span>`;
}

/**
 * FlairFilter — chip row; selected flair filters list views.
 * @param {string} selected
 * @param {string} [nameAttr]
 */
export function renderFlairFilter(selected = "", nameAttr = "flair-filter") {
  const chips = [
    `<button type="button" class="chip flair-chip${!selected ? " chip-active" : ""}" data-${nameAttr}="" aria-pressed="${
      !selected ? "true" : "false"
    }">All flairs</button>`,
    ...SNAKE_FLAIRS.map((f) => {
      const on = selected === f.id;
      return `<button type="button" class="chip flair-chip flair-${escapeAttr(
        f.id
      )}${on ? " chip-active" : ""}" data-${nameAttr}="${escapeAttr(
        f.id
      )}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(f.label)}</button>`;
    }),
  ];
  return `<div class="flair-filter" role="group" aria-label="Filter by flair">${chips.join(
    ""
  )}</div>`;
}

/**
 * Status chip row — filters pipeline highlight (Seed: UI only; lists stay empty).
 * @param {string} selected status id or ""
 */
export function renderStatusFilter(selected = "") {
  const chips = [
    `<button type="button" class="chip status-chip${!selected ? " chip-active" : ""}" data-status-filter="" aria-pressed="${
      !selected ? "true" : "false"
    }">Any status</button>`,
    ...FORUM_STATUS_LABELS.map((s) => {
      const on = selected === s.id;
      const short = s.label.replace(/^status:/, "");
      return `<button type="button" class="chip status-chip${on ? " chip-active" : ""}" data-status-filter="${escapeAttr(
        s.id
      )}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(short)}</button>`;
    }),
  ];
  return `<div class="status-filter" role="group" aria-label="Filter by status">${chips.join(
    ""
  )}</div>`;
}

/**
 * Resolve which pipeline stage should highlight from UI filter state.
 * @param {{ flair?: string, status?: string, focusStage?: string }} state
 */
export function resolvePipelineActive(state = {}) {
  if (state.focusStage && PIPELINE_STAGES.some((s) => s.id === state.focusStage)) {
    return state.focusStage;
  }
  if (state.status && STATUS_TO_PIPELINE_STAGE[state.status]) {
    return STATUS_TO_PIPELINE_STAGE[state.status];
  }
  if (state.flair && FLAIR_TO_PIPELINE_STAGE[state.flair]) {
    return FLAIR_TO_PIPELINE_STAGE[state.flair];
  }
  return "proposal";
}

/**
 * PipelineStrip — Proposal → Considerations → Brief → Target.
 * Steps are selectable; highlight follows flair / status / focus filters.
 * @param {string} [activeId]
 * @param {{ interactive?: boolean }} [opts]
 */
export function renderPipelineStrip(activeId = "proposal", opts = {}) {
  const interactive = opts.interactive !== false;
  const steps = PIPELINE_STAGES.map((s, i) => {
    const active = s.id === activeId;
    const inner = `
        <span class="pipeline-index" aria-hidden="true">${i + 1}</span>
        <span class="pipeline-label">${escapeHtml(s.label)}</span>`;
    if (interactive) {
      return `
      <li class="pipeline-step${active ? " pipeline-step-active" : ""}" data-stage="${escapeAttr(
        s.id
      )}">
        <button type="button" class="pipeline-step-btn" data-pipeline-stage="${escapeAttr(
          s.id
        )}" aria-pressed="${active ? "true" : "false"}">${inner}</button>
      </li>`;
    }
    return `
      <li class="pipeline-step${active ? " pipeline-step-active" : ""}" data-stage="${escapeAttr(
        s.id
      )}">${inner}</li>`;
  }).join('<li class="pipeline-sep" aria-hidden="true">→</li>');

  return `
    <nav class="pipeline-strip" aria-label="Community pipeline">
      <ol class="pipeline-list">${steps}</ol>
      <p class="muted pipeline-hint">Highlight follows flair / status filters or a stage you select. Schema flow is storage-agnostic (ForumPort).</p>
    </nav>`;
}

/**
 * ConsiderationVoteRow — Seed: UI-only ack / sunshine stub (+ link to Discussions).
 * @param {import("./forum-port.js").ConsiderationRow} row
 * @param {{ vote?: 1|-1|0, discussHref?: string }} [state]
 */
export function renderConsiderationVoteRow(row, state = {}) {
  const vote = state.vote === 1 || state.vote === -1 ? state.vote : 0;
  const discussHref = state.discussHref || "";
  const profileBadge =
    row.profile === "accessible"
      ? `<span class="badge profile-badge profile-accessible">accessible</span>`
      : `<span class="badge profile-badge profile-hardcore">optional hardcore</span>`;

  return `
    <li class="consideration-row" data-consideration-id="${escapeAttr(row.id)}">
      <div class="consideration-main">
        <code class="consideration-id">${escapeHtml(row.id)}</code>
        <p class="consideration-statement">${escapeHtml(row.statement)}</p>
        <div class="consideration-meta">
          ${profileBadge}
          <span class="muted">main: ${escapeHtml(row.accessible)}</span>
          <span class="muted">hardcore: ${escapeHtml(row.hardcore)}</span>
        </div>
      </div>
      <div class="consideration-vote" role="group" aria-label="Ack for ${escapeAttr(row.id)}">
        <button type="button" class="chip vote-chip${vote === 1 ? " chip-active" : ""}" data-consideration-vote="1" data-consideration-id="${escapeAttr(
          row.id
        )}" aria-pressed="${vote === 1 ? "true" : "false"}" title="Ack / support (Seed stub)">+ ack</button>
        <button type="button" class="chip vote-chip${vote === -1 ? " chip-active" : ""}" data-consideration-vote="-1" data-consideration-id="${escapeAttr(
          row.id
        )}" aria-pressed="${vote === -1 ? "true" : "false"}" title="Concern (Seed stub)">concern</button>
        ${
          discussHref
            ? `<a class="btn btn-secondary btn-sm" href="${escapeAttr(
                discussHref
              )}" rel="noopener noreferrer">Discuss</a>`
            : ""
        }
      </div>
      <p class="muted consideration-ack-note" hidden data-ack-for="${escapeAttr(
        row.id
      )}"></p>
    </li>`;
}

/**
 * ConsiderationCatalog — accessible always-on + optional hardcore rows.
 * @param {object} opts
 * @param {"any"|"accessible"|"hardcore"} [opts.profile]
 * @param {Record<string, 1|-1|0>} [opts.votes]
 * @param {string} [opts.discussHref]
 */
export function renderConsiderationCatalog(opts = {}) {
  const profile = opts.profile || "any";
  const votes = opts.votes || {};
  const discussHref = opts.discussHref || "";

  const rows = SNAKE_CONSIDERATION_CATALOG.filter((r) => {
    if (profile === "accessible") return r.profile === "accessible";
    if (profile === "hardcore") return r.profile === "hardcore";
    return true;
  });

  const profileChips = ["any", "accessible", "hardcore"]
    .map((p) => {
      const on = profile === p;
      const label =
        p === "any" ? "All profiles" : p === "accessible" ? "Accessible" : "Optional hardcore";
      return `<button type="button" class="chip profile-chip${on ? " chip-active" : ""}" data-profile-filter="${escapeAttr(
        p
      )}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(label)}</button>`;
    })
    .join("");

  return `
    <section class="consideration-catalog" aria-labelledby="list-consideration-catalog">
      <h3 id="list-consideration-catalog">Consideration catalog</h3>
      <p class="muted catalog-lede">
        Snake profiles from DESIGN + content-policy (design §D). Seed votes are
        <strong>local ack / sunshine</strong> only — no backend. Prefer Discussions for binding debate.
      </p>
      <div class="profile-filter" role="group" aria-label="Filter by profile">${profileChips}</div>
      <ul class="consideration-list">
        ${rows
          .map((r) =>
            renderConsiderationVoteRow(r, {
              vote: votes[r.id] || 0,
              discussHref,
            })
          )
          .join("")}
      </ul>
    </section>`;
}

function renderThreadList(title, threads, emptyLinks) {
  const items =
    threads.length > 0
      ? `<ul class="thread-list">${threads
          .map(
            (t) => `<li class="thread-row">
            <a href="${escapeAttr(t.url)}" rel="noopener noreferrer">${escapeHtml(
              t.title
            )}</a>
            <span class="thread-meta">
              ${t.flair ? renderFlairBadge(t.flair) : ""}
              ${t.status ? renderStatusBadge(t.status) : ""}
            </span>
          </li>`
          )
          .join("")}</ul>`
      : `<div class="empty-state">
          <p class="muted">No items in Shelf yet (Seed read-only port returns empty until live GraphQL).</p>
          <p class="empty-links">${emptyLinks
            .map(
              (l) =>
                `<a class="btn btn-secondary btn-sm" href="${escapeAttr(
                  l.href
                )}" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
            )
            .join(" ")}</p>
        </div>`;

  return `
    <section class="community-list" aria-labelledby="list-${escapeAttr(
      title.toLowerCase().replace(/\s+/g, "-")
    )}">
      <h3 id="list-${escapeAttr(
        title.toLowerCase().replace(/\s+/g, "-")
      )}">${escapeHtml(title)}</h3>
      ${items}
    </section>`;
}

/**
 * ProposalComposer stub — opens GitHub new-discussion via ForumPort compose URLs.
 * Full write API / OAuth is out of scope for Seed.
 */
export function renderProposalComposer(port) {
  const composeProposals = port.links.compose("proposals");
  const composeConsiderations = port.links.compose("considerations");
  const composeBriefs = port.links.compose("briefs");
  return `
    <section class="compose-stub" aria-labelledby="compose-heading">
      <h3 id="compose-heading">Compose</h3>
      <p>Open a new Discussion (GitHub). Shelf stays on ForumPort — write API lands later. Category slugs match live Discussions (ForumPort <code>q-and-a</code> → GitHub <code>q-a</code>).</p>
      <div class="actions">
        <a class="btn btn-primary" href="${escapeAttr(
          composeProposals
        )}" rel="noopener noreferrer">New proposal on GitHub</a>
        <a class="btn btn-secondary" href="${escapeAttr(
          composeConsiderations
        )}" rel="noopener noreferrer">New consideration</a>
        <a class="btn btn-secondary" href="${escapeAttr(
          composeBriefs
        )}" rel="noopener noreferrer">New brief draft</a>
      </div>
      <p class="muted">Use one primary flair per OP (<code>feature</code>, <code>bug</code>, <code>balance</code>, <code>mod</code>, <code>promote</code>, <code>refactor</code>, <code>meta</code>). Label with <code>type:*</code> / <code>stage:*</code> / <code>status:*</code> when helpful.</p>
    </section>`;
}

function renderCategoryLinks(port) {
  return `
    <section class="category-links" aria-label="Discussion categories">
      <h3>Categories</h3>
      <ul class="cat-grid">
        ${SNAKE_CATEGORIES.map(
          (c) => `<li>
            <a href="${escapeAttr(
              port.links.category(c.id)
            )}" rel="noopener noreferrer"><strong>${escapeHtml(
            c.label
          )}</strong></a>
            <span class="muted"> — ${escapeHtml(c.role)}</span>
          </li>`
        ).join("")}
      </ul>
    </section>`;
}

/**
 * PlaceholderGameGate — block Community e2e for placeholder titles.
 */
export function renderPlaceholderGate() {
  return `
    <h2>Community</h2>
    <div class="gate gate-placeholder">
      <p><strong>PlaceholderGameGate</strong> — Community e2e opens when this title is active on the Shelf (not a placeholder listing).</p>
      <p class="muted">Persistence is ForumPort-facing (GitHub Discussions for Snake Seed). Reddit remains outreach only.</p>
    </div>`;
}

/**
 * Mount TabCommunity for an active (non-placeholder) game via ForumPort.
 * @param {HTMLElement} panel
 * @param {object} game
 * @param {ReturnType<typeof import("./github-discussions-port.js").createGitHubDiscussionsPort>} [port]
 */
export async function mountTabCommunity(panel, game, port = githubDiscussionsPort) {
  const store = asCommunityStore(port);
  const gameId = game.id;

  let selectedFlair = "";
  let selectedStatus = "";
  let focusStage = "";
  /** @type {"any"|"accessible"|"hardcore"} */
  let profileFilter = "any";
  /** @type {Record<string, 1|-1|0>} */
  const localVotes = {};
  /** @type {ReturnType<typeof runExport>|null} */
  let lastExport = null;
  let lastExportFromFixture = false;

  async function paint() {
    const query = { game: gameId, sort: /** @type {"new"} */ ("new") };
    if (selectedFlair) query.flair = selectedFlair;
    if (selectedStatus) query.status = selectedStatus;

    const [proposals, considerations, briefs] = await Promise.all([
      store.listPosts({ ...query, category: "proposals" }),
      store.listConsiderations(gameId),
      store.listBriefs(gameId),
    ]);

    // Client-side flair filter (Seed empty anyway; ready when GraphQL fills lists).
    const filterFlair = (list) =>
      selectedFlair ? list.filter((t) => t.flair === selectedFlair) : list;

    const openGh = (categoryId, label) => ({
      href: port.links.category(categoryId),
      label: label || `Open ${categoryId} on GitHub`,
    });

    const pipelineActive = resolvePipelineActive({
      flair: selectedFlair,
      status: selectedStatus,
      focusStage,
    });

    const discussConsiderations = port.links.category("considerations");

    panel.innerHTML = `
      <h2>Community</h2>
      <p class="community-lede">
        Binding commons for <strong>${escapeHtml(
          game.title
        )}</strong> via <code>ForumPort</code>
        (Seed adapter: GitHub Discussions). Reddit is outreach only.
      </p>
      ${renderPipelineStrip(pipelineActive)}
      <div class="community-toolbar">
        <div class="filter-block">
          <h3 class="sr-only">Filters</h3>
          ${renderFlairFilter(selectedFlair)}
          ${renderStatusFilter(selectedStatus)}
        </div>
        <div class="actions community-actions">
          <a class="btn btn-secondary btn-sm" href="${escapeAttr(
            port.links.home
          )}" rel="noopener noreferrer">All Discussions</a>
          <a class="btn btn-primary btn-sm" href="${escapeAttr(
            port.links.compose("proposals")
          )}" rel="noopener noreferrer">Propose a change</a>
        </div>
      </div>
      ${renderThreadList("Open proposals", filterFlair(proposals), [
        openGh("proposals", "Open proposals on GitHub"),
        {
          href: port.links.search(["is:open", "category:Proposals"]),
          label: "Search proposals",
        },
      ])}
      ${renderConsiderationCatalog({
        profile: profileFilter,
        votes: localVotes,
        discussHref: discussConsiderations,
      })}
      ${renderThreadList("Consideration threads", filterFlair(considerations), [
        openGh("considerations", "Open considerations on GitHub"),
      ])}
      ${renderThreadList("Living briefs", filterFlair(briefs), [
        openGh("briefs", "Open briefs on GitHub"),
      ])}
      ${renderPromoteSection({
        briefs: filterFlair(briefs),
        gameId,
        githubHref:
          game.githubHref ||
          `https://github.com/FossArcade/foss-arcade/tree/main/games/${gameId}`,
        exported: lastExport,
        exportFromFixture: lastExportFromFixture,
      }).html}
      ${renderProposalComposer(port)}
      ${renderCategoryLinks(port)}
      <p class="muted community-foot">
        Adapter: <code>GitHubDiscussionsPort</code> (read-only Seed). UI never imports GraphQL field names.
        ${
          game.community?.subreddit
            ? ` · Outreach: <a href="${escapeAttr(
                game.community.subreddit
              )}" rel="noopener noreferrer">${escapeHtml(
                game.community.subredditLabel || "Reddit"
              )}</a> (non-binding)`
            : ""
        }
      </p>
    `;

    for (const chip of panel.querySelectorAll("[data-flair-filter]")) {
      chip.addEventListener("click", () => {
        selectedFlair = chip.getAttribute("data-flair-filter") || "";
        focusStage = "";
        paint();
      });
    }

    for (const chip of panel.querySelectorAll("[data-status-filter]")) {
      chip.addEventListener("click", () => {
        selectedStatus = chip.getAttribute("data-status-filter") || "";
        focusStage = "";
        paint();
      });
    }

    for (const btn of panel.querySelectorAll("[data-pipeline-stage]")) {
      btn.addEventListener("click", () => {
        focusStage = btn.getAttribute("data-pipeline-stage") || "";
        paint();
      });
    }

    for (const chip of panel.querySelectorAll("[data-profile-filter]")) {
      chip.addEventListener("click", () => {
        profileFilter = /** @type {"any"|"accessible"|"hardcore"} */ (
          chip.getAttribute("data-profile-filter") || "any"
        );
        paint();
      });
    }

    for (const btn of panel.querySelectorAll("[data-consideration-vote]")) {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-consideration-id") || "";
        const raw = btn.getAttribute("data-consideration-vote") || "0";
        const next = Number(raw);
        if (!id || (next !== 1 && next !== -1)) return;
        localVotes[id] = localVotes[id] === next ? 0 : /** @type {1|-1} */ (next);
        paint().then(() => {
          const note = panel.querySelector(`[data-ack-for="${CSS.escape(id)}"]`);
          if (!note) return;
          const v = localVotes[id] || 0;
          if (v === 0) {
            note.hidden = true;
            note.textContent = "";
            return;
          }
          note.hidden = false;
          note.textContent =
            v === 1
              ? "Local ack recorded (Seed sunshine stub — not synced). Discuss on GitHub for binding signal."
              : "Local concern noted (Seed sunshine stub — not synced). Open a consideration thread if it should bind.";
        });
      });
    }

    bindPromoteSection(panel, {
      getExported: () => lastExport,
      onExportFixture: () => {
        lastExport = runExport(getSeedBriefFixture(), { created: "2026-09-08" });
        lastExportFromFixture = true;
        paint();
      },
      onExportThread: async (threadId) => {
        const all = filterFlair(briefs);
        const hit = all.find((t) => t.id === threadId);
        if (hit && isBriefReady(hit)) {
          lastExport = runExport(hit);
          lastExportFromFixture = false;
        } else {
          const fromPort = await port.exportBrief(threadId, hit || null);
          lastExport = {
            md: fromPort.md,
            targetYaml: fromPort.targetYaml || "",
            proposal: fromPort.proposal || null,
            meta: fromPort.meta || {},
          };
          lastExportFromFixture = false;
        }
        paint();
      },
    });
  }

  await paint();
}
