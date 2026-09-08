/**
 * TabCommunity UI — FlairBadge / FlairFilter / PipelineStrip + ForumPort-backed lists.
 * Snake only for Community e2e; callers must respect PlaceholderGameGate.
 */

import {
  PIPELINE_STAGES,
  SNAKE_CATEGORIES,
  SNAKE_FLAIRS,
  FORUM_STATUS_LABELS,
  asCommunityStore,
} from "./forum-port.js";
import { githubDiscussionsPort } from "./github-discussions-port.js";

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
 * PipelineStrip — Proposal → Considerations → Brief → Target (decorative for Seed).
 * @param {string} [activeId]
 */
export function renderPipelineStrip(activeId = "proposal") {
  const steps = PIPELINE_STAGES.map((s, i) => {
    const active = s.id === activeId;
    return `
      <li class="pipeline-step${active ? " pipeline-step-active" : ""}" data-stage="${escapeAttr(
        s.id
      )}">
        <span class="pipeline-index" aria-hidden="true">${i + 1}</span>
        <span class="pipeline-label">${escapeHtml(s.label)}</span>
      </li>`;
  }).join('<li class="pipeline-sep" aria-hidden="true">→</li>');

  return `
    <nav class="pipeline-strip" aria-label="Community pipeline">
      <ol class="pipeline-list">${steps}</ol>
      <p class="muted pipeline-hint">Schema flow (storage-agnostic). Seed lists may be empty until Discussions fill in.</p>
    </nav>`;
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
 * ProposalComposer stub — opens GitHub new-discussion in the right category.
 * Full write API / OAuth is out of scope for slice 2.
 */
export function renderProposalComposer(composeUrl) {
  return `
    <section class="compose-stub" aria-labelledby="compose-heading">
      <h3 id="compose-heading">Compose</h3>
      <p>Open a new Discussion in the <strong>proposals</strong> category (GitHub). Shelf will stay on ForumPort — write API lands later.</p>
      <div class="actions">
        <a class="btn btn-primary" href="${escapeAttr(
          composeUrl
        )}" rel="noopener noreferrer">New proposal on GitHub</a>
        <a class="btn btn-secondary" href="${escapeAttr(
          composeUrl.replace("category=proposals", "category=considerations")
        )}" rel="noopener noreferrer">New consideration</a>
        <a class="btn btn-secondary" href="${escapeAttr(
          composeUrl.replace("category=proposals", "category=briefs")
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

  async function paint() {
    const query = { game: gameId, sort: /** @type {"new"} */ ("new") };
    if (selectedFlair) query.flair = selectedFlair;

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

    panel.innerHTML = `
      <h2>Community</h2>
      <p class="community-lede">
        Binding commons for <strong>${escapeHtml(
          game.title
        )}</strong> via <code>ForumPort</code>
        (Seed adapter: GitHub Discussions). Reddit is outreach only.
      </p>
      ${renderPipelineStrip("proposal")}
      <div class="community-toolbar">
        <div class="filter-block">
          <h3 class="sr-only">Filters</h3>
          ${renderFlairFilter(selectedFlair)}
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
          href: port.links.search(["is:open", "category:proposals"]),
          label: "Search proposals",
        },
      ])}
      ${renderThreadList("Considerations", filterFlair(considerations), [
        openGh("considerations", "Open considerations on GitHub"),
      ])}
      ${renderThreadList("Living briefs", filterFlair(briefs), [
        openGh("briefs", "Open briefs on GitHub"),
      ])}
      <section class="community-list" aria-labelledby="list-targets">
        <h3 id="list-targets">Targets</h3>
        <div class="empty-state">
          <p class="muted">Harness targets stay in-repo (<code>games/${escapeHtml(
            gameId
          )}/targets/</code>). Promote from brief-ready is a later slice.</p>
          <p class="empty-links">
            <a class="btn btn-secondary btn-sm" href="${escapeAttr(
              game.githubHref ||
                `https://github.com/FossArcade/foss-arcade/tree/main/games/${gameId}`
            )}" rel="noopener noreferrer">Open game files</a>
          </p>
        </div>
      </section>
      ${renderProposalComposer(port.links.compose("proposals"))}
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
        paint();
      });
    }
  }

  await paint();
}
