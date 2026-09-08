import { getGameById } from "./games.js";
import {
  mountTabCommunity,
  renderPlaceholderGate,
} from "./community-ui.js";

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

function qsId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("game") || "";
}

function hashTab() {
  const h = (window.location.hash || "").replace(/^#/, "").toLowerCase();
  if (["play", "about", "community", "changelog"].includes(h)) return h;
  return "play";
}

function renderBadges(game) {
  const bits = [];
  if (game.lifecycle) {
    bits.push(
      `<span class="badge badge-lifecycle lifecycle-${escapeAttr(
        game.lifecycle
      )}">${escapeHtml(game.lifecycle)}</span>`
    );
  }
  if (game.stage) {
    bits.push(
      `<span class="badge badge-stage">${escapeHtml(game.stage)}</span>`
    );
  }
  if (game.placeholder) {
    bits.push(`<span class="badge badge-placeholder">placeholder</span>`);
  }
  return bits.join(" ");
}

function renderHero(game) {
  const hero = document.getElementById("game-hero");
  document.title = `${game.title} — Foss Arcade`;
  const tags =
    game.tags && game.tags.length
      ? `<ul class="tags">${game.tags
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join("")}</ul>`
      : "";

  hero.innerHTML = `
    <div class="mark">Foss Arcade · Game</div>
    <div class="badges">${renderBadges(game)}</div>
    <h1>${escapeHtml(game.title)}</h1>
    <p class="lede">${escapeHtml(game.summary)}</p>
    ${tags}
    <div class="actions game-ctas">
      <a class="btn btn-primary" href="${escapeAttr(game.playHref)}">Play</a>
      ${
        game.githubHref
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              game.githubHref
            )}" rel="noopener noreferrer">Open game files</a>`
          : ""
      }
      ${
        game.community?.subreddit
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              game.community.subreddit
            )}" rel="noopener noreferrer" title="Outreach only — not binding commons">${escapeHtml(
              game.community.subredditLabel || "Reddit"
            )} (outreach)</a>`
          : ""
      }
    </div>
  `;
}

/** TabPlayDownload — Play link, channel tip, stub!=stable banner, download block */
function renderPlay(game) {
  const panel = document.getElementById("panel-play");
  const channel = game.defaultChannel || "unstable";
  const downloadBlock = game.downloadEnabled
    ? `<p><a class="btn btn-secondary" href="${escapeAttr(
        game.downloadHref
      )}">${escapeHtml(game.downloadLabel || "Download")}</a></p>`
    : `<p><button type="button" class="btn btn-secondary" disabled aria-disabled="true">${escapeHtml(
        "Download"
      )}</button></p>
       <p class="note">${escapeHtml(
         game.downloadLabel || "Desktop builds coming soon"
       )}</p>`;

  panel.innerHTML = `
    <h2>Play / Download</h2>
    <p>Open the browser build on the <strong>${escapeHtml(
      channel
    )}</strong> tip channel.</p>
    <div class="actions">
      <a class="btn btn-primary" href="${escapeAttr(game.playHref)}">Play ${escapeHtml(
        game.title
      )}</a>
    </div>
    <div class="channel-tip">
      <h3>Channel</h3>
      <p>
        Default: <code>${escapeHtml(channel)}</code>
        ${
          game.channels?.length
            ? ` · listed: ${game.channels.map((c) => escapeHtml(c)).join(", ")}`
            : ""
        }
      </p>
      <p class="muted">Full channel switcher arrives in a later slice. Seed tip is <strong>unstable</strong> — not a shipped <code>stable</code> build.</p>
    </div>
    <div class="download-block">
      <h3>Download</h3>
      ${downloadBlock}
    </div>
    ${
      game.offlineFirst
        ? `<p class="muted">Offline-first: core loop does not require an account or network.</p>`
        : ""
    }
  `;
}

/** TabAbout — DESIGN summary, pillars, licenses, links */
function renderAbout(game) {
  const panel = document.getElementById("panel-about");
  const about = game.about || {};
  const pillars =
    about.pillars?.length
      ? `<ol class="pillars">${about.pillars
          .map((p) => `<li>${escapeHtml(p)}</li>`)
          .join("")}</ol>`
      : "";
  const nonGoals =
    about.nonGoals?.length
      ? `<ul>${about.nonGoals
          .map((p) => `<li>${escapeHtml(p)}</li>`)
          .join("")}</ul>`
      : "";

  panel.innerHTML = `
    <h2>About</h2>
    <p class="about-oneliner">${escapeHtml(
      about.oneLiner || game.summary
    )}</p>
    ${
      about.pillars?.length
        ? `<h3>Pillars</h3>${pillars}`
        : ""
    }
    ${
      about.nonGoals?.length
        ? `<h3>Non-goals</h3>${nonGoals}`
        : ""
    }
    <dl class="about-meta">
      <div><dt>Engine</dt><dd>${escapeHtml(
        about.engineNote || game.enginePrimary || "—"
      )}</dd></div>
      <div><dt>Licenses</dt><dd>${escapeHtml(
        about.licenses || "See repo LICENSE files"
      )}</dd></div>
      <div><dt>Lineage</dt><dd>${escapeHtml(
        about.lineage || "—"
      )}</dd></div>
      <div><dt>Lifecycle / stage</dt><dd>${escapeHtml(
        `${game.lifecycle || "—"} · ${game.stage || "—"}`
      )}</dd></div>
    </dl>
    <div class="actions">
      ${
        about.designHref
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              about.designHref
            )}">Open DESIGN.md</a>`
          : ""
      }
      ${
        about.gameYamlHref
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              about.gameYamlHref
            )}">Open game.yaml</a>`
          : ""
      }
      ${
        game.githubHref
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              game.githubHref
            )}" rel="noopener noreferrer">GitHub</a>`
          : ""
      }
    </div>
  `;
}

/** TabCommunity — ForumPort-backed UI (Snake); PlaceholderGameGate otherwise */
async function renderCommunity(game) {
  const panel = document.getElementById("panel-community");
  if (game.placeholder) {
    panel.innerHTML = renderPlaceholderGate();
    return;
  }
  panel.innerHTML = `<h2>Community</h2><p class="muted">Loading ForumPort…</p>`;
  try {
    await mountTabCommunity(panel, game);
  } catch (err) {
    console.error(err);
    panel.innerHTML = `
      <h2>Community</h2>
      <div class="gate gate-stub">
        <p><strong>Could not load Community tab.</strong> ${String(err?.message || err)}</p>
        <p class="muted">Binding commons: Shelf Community + GitHub Discussions via ForumPort.</p>
      </div>`;
  }
}

/** TabChangelog stub */
function renderChangelog(game) {
  const panel = document.getElementById("panel-changelog");
  panel.innerHTML = `
    <h2>Changelog</h2>
    <div class="gate gate-stub">
      <p><strong>Coming in a later slice.</strong> Channel tips, promote evidence, and freeze notes will land here.</p>
      <p class="muted">Default tip today: <code>${escapeHtml(
        game.defaultChannel || "unstable"
      )}</code> — stub era, not a shipped <code>stable</code> release train.</p>
      ${
        game.metrics?.lastUpdate
          ? `<p class="muted">Catalog lastUpdate: ${escapeHtml(
              game.metrics.lastUpdate
            )}${
              game.metrics.lastUpdateNote
                ? ` — ${escapeHtml(game.metrics.lastUpdateNote)}`
                : ""
            }</p>`
          : ""
      }
    </div>
  `;
}

function setStubBanner(game) {
  const el = document.getElementById("stub-banner");
  if (!el) return;
  const isStubTip =
    game.defaultChannel === "unstable" || game.metrics?.mode === "stub";
  if (isStubTip) {
    el.hidden = false;
    el.innerHTML = `<strong>Stub ≠ shipped stable.</strong> You are on the Seed tip (<code>${escapeHtml(
      game.defaultChannel || "unstable"
    )}</code>). Metrics and downloads are placeholders until live pipelines and desktop packages ship.`;
  } else {
    el.hidden = true;
  }
}

function selectTab(name) {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  for (const tab of tabs) {
    const on = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", on ? "true" : "false");
    tab.classList.toggle("tab-active", on);
  }
  for (const panel of panels) {
    panel.hidden = panel.dataset.panel !== name;
  }
  if (window.location.hash.replace(/^#/, "") !== name) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${name}`);
  }
}

function renderMissing(id) {
  const hero = document.getElementById("game-hero");
  hero.innerHTML = `
    <h1>Game not found</h1>
    <p class="lede">No catalog entry for <code>${escapeHtml(id || "(missing id)")}</code>.</p>
    <p><a class="btn btn-secondary" href="./">Back to Arcade Shelf</a></p>
  `;
  for (const panel of document.querySelectorAll(".tab-panel")) {
    panel.hidden = true;
  }
  document.querySelector(".tablist")?.setAttribute("hidden", "true");
  const banner = document.getElementById("stub-banner");
  if (banner) banner.hidden = true;
}

async function main() {
  const id = qsId();
  const game = getGameById(id);
  if (!game) {
    renderMissing(id);
    return;
  }

  renderHero(game);
  setStubBanner(game);
  renderPlay(game);
  renderAbout(game);
  await renderCommunity(game);
  renderChangelog(game);

  for (const tab of document.querySelectorAll(".tab")) {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));
  }
  window.addEventListener("hashchange", () => selectTab(hashTab()));
  selectTab(hashTab());
}

main();
