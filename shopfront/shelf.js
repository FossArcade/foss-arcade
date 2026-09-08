import {
  sortedPlayableGames,
  sortedPlatformTiles,
  playerFacingTags,
  isPlatformMetaTile,
} from "./games.js";

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
    const label = c.subredditLabel || "Chat on Reddit (optional)";
    return `<a href="${escapeAttr(href)}" rel="noopener noreferrer">${escapeHtml(
      label
    )}</a>`;
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
  const hints = Array.isArray(game.badgeHints) ? game.badgeHints : [];
  if (game.kind === "platform-meta" || hints.includes("platform-meta")) {
    bits.push(
      `<span class="badge badge-platform-meta" title="Platform listing — Arcade settings & community">platform</span>`
    );
  }
  if (game.playable === false || hints.includes("not-a-game")) {
    bits.push(
      `<span class="badge badge-not-a-game" title="Honest listing: not a playable game">not a game</span>`
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

  return `
    <dl class="stats" aria-label="Storefront details">
      <div class="stat">
        <dt>Community</dt>
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
      ${lastUpdate}
    </dl>
  `;
}

/** CatalogTile — deepen card with badges, link to game page */
function renderCatalogTile(game) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.gameId = game.id;
  if (game.placeholder) card.classList.add("card-placeholder");

  const visibleTags = playerFacingTags(game.tags);
  const tags =
    visibleTags.length
      ? `<ul class="tags">${visibleTags
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
      )}" rel="noopener noreferrer">${
        isPlatformMetaTile(game) ? "Open repo" : "Open game files"
      }</a>`
    : "";

  const gamePageHref = game.href || `./game?id=${encodeURIComponent(game.id)}`;

  const isMeta = isPlatformMetaTile(game);
  if (isMeta) card.classList.add("card-platform-meta");
  const metaDiscuss =
    game.community?.discussionsHref ||
    "https://github.com/FossArcade/foss-arcade/discussions/categories/meta";
  const primaryCta = isMeta
    ? `<a class="btn btn-primary" href="${escapeAttr(
        `${gamePageHref}#community`
      )}">Open Community</a>`
    : `<a class="btn btn-primary" href="${escapeAttr(game.playHref)}">Play</a>`;
  const secondaryPage = isMeta
    ? `<a class="btn btn-secondary" href="${escapeAttr(gamePageHref)}">About</a>`
    : `<a class="btn btn-secondary" href="${escapeAttr(gamePageHref)}">Game page</a>`;
  const discussBtn = isMeta
    ? `<a class="btn btn-secondary" href="${escapeAttr(
        metaDiscuss
      )}" rel="noopener noreferrer">Discussions</a>`
    : "";

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
      ${primaryCta}
      ${secondaryPage}
      ${discussBtn}
      ${isMeta ? "" : downloadBtn}
      ${github}
    </div>
    ${
      isMeta
        ? `<p class="note">Settings &amp; community for the Arcade itself — not a game.</p>`
        : downloadNote
    }
  `;

  return card;
}

function appendSection(title, games, { labelId } = {}) {
  if (!games.length) return;
  const section = document.createElement("section");
  section.className = "catalog-section";
  section.setAttribute("aria-labelledby", labelId);
  const heading = document.createElement("h3");
  heading.id = labelId;
  heading.className = "catalog-section-title";
  heading.textContent = title;
  section.appendChild(heading);
  const grid = document.createElement("div");
  grid.className = "catalog-grid";
  for (const game of games) {
    grid.appendChild(renderCatalogTile(game));
  }
  section.appendChild(grid);
  catalog.appendChild(section);
}

const playable = sortedPlayableGames();
const platform = sortedPlatformTiles();

appendSection("Games", playable, { labelId: "catalog-games" });
appendSection("Platform", platform, { labelId: "catalog-platform" });

const shelfMeta = document.getElementById("shelf-meta");
if (shelfMeta) {
  const n = playable.length;
  shelfMeta.textContent =
    n === 0
      ? "Early catalog"
      : n === 1
        ? "Games · Early catalog"
        : `Games · ${n} titles`;
}
