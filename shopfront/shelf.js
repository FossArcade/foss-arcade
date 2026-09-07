import { games } from "./games.js";

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
    )}</a>`;
  }
  return `<span class="muted">${escapeHtml(
    c.subredditLabel || "Coming soon"
  )}</span>`;
}

function renderRating(stats) {
  const s = stats || {};
  if (s.rating != null && s.rating !== "") {
    const n = Number(s.rating);
    const stars =
      Number.isFinite(n) && n > 0
        ? `${"★".repeat(Math.min(5, Math.round(n)))}${
            n < 5 ? "☆".repeat(Math.max(0, 5 - Math.round(n))) : ""
          } ${escapeHtml(String(s.rating))}`
        : escapeHtml(String(s.rating));
    return `<span class="rating" title="${escapeAttr(
      s.ratingLabel || String(s.rating)
    )}">${stars}</span>`;
  }
  return `<span class="muted">${escapeHtml(
    s.ratingLabel || "Not rated yet"
  )}</span>`;
}

function renderStats(game) {
  const community = game.community || {};
  const stats = game.stats || {};
  const playersTitle = stats.playersNote
    ? ` title="${escapeAttr(stats.playersNote)}"`
    : "";
  const activityTitle = stats.activityNote
    ? ` title="${escapeAttr(stats.activityNote)}"`
    : "";
  const lastUpdate = stats.lastUpdate
    ? `<div class="stat">
        <dt>Updated</dt>
        <dd${
          stats.lastUpdateNote
            ? ` title="${escapeAttr(stats.lastUpdateNote)}"`
            : ""
        }>${escapeHtml(stats.lastUpdate)}</dd>
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
        <dd${playersTitle}>${escapeHtml(stats.players ?? "—")}</dd>
      </div>
      <div class="stat">
        <dt>Activity</dt>
        <dd${activityTitle}>${escapeHtml(stats.activity ?? "—")}</dd>
      </div>
      <div class="stat">
        <dt>Rating</dt>
        <dd>${renderRating(stats)}</dd>
      </div>
      ${lastUpdate}
    </dl>
  `;
}

for (const game of games) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.gameId = game.id;

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

  card.innerHTML = `
    <h3>${escapeHtml(game.title)}</h3>
    <p class="summary">${escapeHtml(game.summary)}</p>
    ${tags}
    ${renderStats(game)}
    <div class="actions">
      <a class="btn btn-primary" href="${escapeAttr(game.playHref)}">Play</a>
      ${downloadBtn}
      ${github}
    </div>
    ${downloadNote}
  `;

  catalog.appendChild(card);
}
