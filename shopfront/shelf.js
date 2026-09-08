import { sortedGames } from "./games.js";

const catalog = document.getElementById("catalog");

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

function renderSubreddit(community) {
  const c = community || {};
  if (c.subreddit) {
    const href = String(c.subreddit).startsWith("http")
      ? c.subreddit
      : `https://reddit.com/${String(c.subreddit).replace(/^\/?/, "")}`;
    const label =
      c.subredditLabel ||
      (String(c.subreddit).startsWith("http")
        ? c.subreddit.replace(/^https?:\/\/(www\.)?reddit\.com\//i, "r/")
        : c.subreddit);
    return `<a href="${escapeAttr(href)}" rel="noopener noreferrer">${escapeHtml(
      label
    )}</a> <span class="outreach-hint">(outreach)</span>`;
  }
  return `<span class="muted">${escapeHtml(
    c.subredditLabel || "Coming soon"
  )}</span>`;
}

function renderRating(metrics) {
  const m = metrics || {};
  if (m.mode === "live" && m.rating != null && m.rating !== "") {
    const n = Number(m.rating);
    const stars =
      Number.isFinite(n) && n > 0
        ? `${"★".repeat(Math.min(5, Math.round(n)))}${
            n < 5 ? "☆".repeat(Math.max(0, 5 - Math.round(n))) : ""
          } ${escapeHtml(String(m.rating))}`
        : escapeHtml(String(m.rating));
    return `<span class="rating" title="${escapeAttr(
      m.ratingLabel || String(m.rating)
    )}">${stars}</span>`;
  }
  return `<span class="muted">${escapeHtml(
    m.ratingLabel || "Not rated yet"
  )}</span>`;
}

function renderBadges(game) {
  const bits = [];
  if (game.lifecycle) {
    bits.push(
      `<span class="badge badge-lifecycle lifecycle-${escapeAttr(
        game.lifecycle
      )}" title="Lifecycle">${escapeHtml(game.lifecycle)}</span>`
    );
  }
  if (game.stage) {
    bits.push(
      `<span class="badge badge-stage" title="Community stage">${escapeHtml(
        game.stage
      )}</span>`
    );
  }
  if (game.placeholder) {
    bits.push(
      `<span class="badge badge-placeholder" title="Placeholder listing">placeholder</span>`
    );
  }
  if (game.metrics?.mode === "stub") {
    bits.push(
      `<span class="badge badge-stub" title="Metrics are stubs — not live counts">stub metrics</span>`
    );
  }
  if (!bits.length) return "";
  return `<div class="badges" aria-label="Listing badges">${bits.join("")}</div>`;
}

function renderMetrics(game) {
  const community = game.community || {};
  const m = game.metrics || {};
  const playersDisplay =
    m.mode === "live" && m.players != null ? String(m.players) : "—";
  const playersTitle = m.playersNote
    ? ` title="${escapeAttr(m.playersNote)}"`
    : "";
  const activity =
    m.activityLabel || game.stage || game.lifecycle || "—";
  const activityTitle = m.activityNote
    ? ` title="${escapeAttr(m.activityNote)}"`
    : "";
  const lastUpdate = m.lastUpdate
    ? `<div class="stat">
        <dt>Updated</dt>
        <dd${
          m.lastUpdateNote
            ? ` title="${escapeAttr(m.lastUpdateNote)}"`
            : ""
        }>${escapeHtml(m.lastUpdate)}</dd>
      </div>`
    : "";
  const engine = game.enginePrimary
    ? `<div class="stat">
        <dt>Engine</dt>
        <dd>${escapeHtml(game.enginePrimary)}</dd>
      </div>`
    : "";
  const channel = game.defaultChannel
    ? `<div class="stat">
        <dt>Channel</dt>
        <dd title="Default tip channel (stub era — not shipped stable)">${escapeHtml(
          game.defaultChannel
        )}</dd>
      </div>`
    : "";

  return `
    <dl class="stats" aria-label="Storefront details">
      <div class="stat">
        <dt>Subreddit</dt>
        <dd>${renderSubreddit(community)}</dd>
      </div>
      <div class="stat">
        <dt>Players</dt>
        <dd${playersTitle}>${escapeHtml(playersDisplay)}</dd>
      </div>
      <div class="stat">
        <dt>Activity</dt>
        <dd${activityTitle}>${escapeHtml(activity)}</dd>
      </div>
      <div class="stat">
        <dt>Rating</dt>
        <dd>${renderRating(m)}</dd>
      </div>
      ${engine}
      ${channel}
      ${lastUpdate}
    </dl>
  `;
}

/** CatalogTile — deepen card with badges, stub metrics, link to game page */
function renderCatalogTile(game) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.gameId = game.id;
  if (game.placeholder) card.classList.add("card-placeholder");

  const tags =
    game.tags && game.tags.length
      ? `<ul class="tags">${game.tags
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join("")}</ul>`
      : "";

  const downloadBtn = game.downloadEnabled
    ? `<a class="btn btn-secondary" href="${escapeAttr(game.downloadHref)}">Download</a>`
    : `<button type="button" class="btn btn-secondary" disabled aria-disabled="true" title="${escapeAttr(
        game.downloadLabel || "Coming soon"
      )}">Download</button>`;

  const downloadNote = game.downloadEnabled
    ? ""
    : `<p class="note">${escapeHtml(
        game.downloadLabel || "Desktop builds coming soon"
      )}</p>`;

  const github = game.githubHref
    ? `<a class="btn btn-secondary" href="${escapeAttr(
        game.githubHref
      )}" rel="noopener noreferrer">Open game files</a>`
    : "";

  const gamePageHref = game.href || `./game?id=${encodeURIComponent(game.id)}`;
  const sortTip = `popularScore ${game.sort?.popularScore ?? "—"} (lifecycle + listing honesty; stub metrics excluded)`;

  card.innerHTML = `
    <div class="card-head">
      <h3><a class="card-title-link" href="${escapeAttr(gamePageHref)}">${escapeHtml(
        game.title
      )}</a></h3>
      ${renderBadges(game)}
    </div>
    <p class="summary">${escapeHtml(game.summary)}</p>
    ${tags}
    ${renderMetrics(game)}
    <div class="actions">
      <a class="btn btn-primary" href="${escapeAttr(game.playHref)}">Play</a>
      <a class="btn btn-secondary" href="${escapeAttr(gamePageHref)}">Game page</a>
      ${downloadBtn}
      ${github}
    </div>
    ${downloadNote}
    <p class="sort-hint" title="${escapeAttr(sortTip)}">Sorted by popular-first (stub-safe)</p>
  `;

  return card;
}

const ordered = sortedGames();
for (const game of ordered) {
  catalog.appendChild(renderCatalogTile(game));
}

const shelfMeta = document.getElementById("shelf-meta");
if (shelfMeta) {
  shelfMeta.textContent = `${ordered.length} title${ordered.length === 1 ? "" : "s"} · popular-first`;
}
