import { getGameById, isPlatformMetaTile, playerFacingTags } from "./games.js";
import {
  mountTabCommunity,
  renderPlaceholderGate,
} from "./community-ui.js";
import { encodeRunSpec } from "./run-hash.js";
import {
  artifactsForTile,
  buildPlayHref,
  buildRunLink,
  decodePasteInput,
  defaultPlayState,
  planApplyRunSpec,
  resolveInitialRun,
  seedModsForGame,
} from "./play-run.js";

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

function hashTab(game) {
  const h = (window.location.hash || "").replace(/^#/, "").toLowerCase();
  const allowed = isPlatformMetaTile(game)
    ? ["about", "community", "changelog"]
    : ["play", "about", "community", "changelog"];
  if (allowed.includes(h)) return h;
  return isPlatformMetaTile(game) ? "about" : "play";
}

/** @type {{ game: object, spec: object, banner: string | null } | null} */
let playSession = null;

function currentSpec() {
  return (
    playSession?.spec || {
      v: 1,
      game: "unknown",
      channel: "unstable",
      mods: [],
    }
  );
}

function modLabel(gameId, modId) {
  const found = seedModsForGame(gameId).find((m) => m.id === modId);
  return found?.label || modId;
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
  const hints = Array.isArray(game.badgeHints) ? game.badgeHints : [];
  if (game.kind === "platform-meta" || hints.includes("platform-meta")) {
    bits.push(`<span class="badge badge-platform-meta">platform</span>`);
  }
  if (game.playable === false || hints.includes("not-a-game")) {
    bits.push(`<span class="badge badge-not-a-game">not a game</span>`);
  }
  return bits.join(" ");
}

function heroPlayHref(game) {
  const built = buildPlayHref(game.playHref, currentSpec());
  return built.ok ? built.href : game.playHref;
}

function renderHero(game) {
  const hero = document.getElementById("game-hero");
  document.title = `${game.title} — Foss Arcade`;
  const tagsList = playerFacingTags(game.tags);
  const tags =
    tagsList.length
      ? `<ul class="tags">${tagsList
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join("")}</ul>`
      : "";

  const meta = isPlatformMetaTile(game);
  const discuss =
    game.community?.discussionsHref ||
    "https://github.com/FossArcade/foss-arcade/discussions/categories/meta";

  const ctas = meta
    ? `
      <a class="btn btn-primary" href="#community" id="hero-community">Open Community</a>
      ${
        game.githubHref
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              game.githubHref
            )}" rel="noopener noreferrer">Open repo</a>`
          : ""
      }
      <a class="btn btn-secondary" href="#about">About</a>
      ${
        game.community?.subreddit
          ? `<a class="btn btn-secondary" href="${escapeAttr(
              game.community.subreddit
            )}" rel="noopener noreferrer">${escapeHtml(
              game.community.subredditLabel || "Chat on Reddit (optional)"
            )}</a>`
          : ""
      }`
    : `
      <a class="btn btn-primary" id="hero-play" href="${escapeAttr(
        heroPlayHref(game)
      )}">Play</a>
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
            )}" rel="noopener noreferrer">${escapeHtml(
              game.community.subredditLabel || "Chat on Reddit (optional)"
            )}</a>`
          : ""
      }`;

  hero.innerHTML = `
    <div class="mark">${
      meta ? "Foss Arcade · Platform" : "Foss Arcade · Game"
    }</div>
    <div class="badges">${renderBadges(game)}</div>
    <h1>${escapeHtml(game.title)}</h1>
    <p class="lede">${escapeHtml(game.summary)}</p>
    ${tags}
    <div class="actions game-ctas">
      ${ctas}
    </div>
  `;

  if (meta) {
    document.getElementById("hero-community")?.addEventListener("click", (ev) => {
      ev.preventDefault();
      selectTab("community");
    });
  }
}

function syncPlayHrefs(game) {
  if (isPlatformMetaTile(game)) return;
  const href = heroPlayHref(game);
  const hero = document.getElementById("hero-play");
  if (hero) hero.setAttribute("href", href);
  const tabPlay = document.getElementById("play-cta");
  if (tabPlay) tabPlay.setAttribute("href", href);
}

/**
 * Apply a RunSpec to Play UI state (no navigation). Updates channel/mods display + Play hrefs.
 * @param {object} game
 * @param {object} spec
 */
function applyRunSpec(game, spec) {
  const enc = encodeRunSpec({ ...spec, game: spec.game || game.id });
  const next = enc.ok
    ? enc.spec
    : { v: 1, game: game.id, channel: "unstable", mods: [] };
  if (!playSession) {
    playSession = {
      game,
      spec: next,
      banner: defaultPlayState(game).banner,
    };
  } else {
    playSession.spec = next;
  }
  renderPlay(game);
  syncPlayHrefs(game);
  setStubBanner(game);
}

/**
 * Run confirm chain for a planned apply. Returns spec to apply, or null if cancelled.
 * Cross-game: navigate away (never apply on wrong page).
 * @param {object} game
 * @param {ReturnType<typeof planApplyRunSpec>} plan
 * @param {{ confirmFn?: (msg: string) => boolean, navigateFn?: (href: string) => void }} [hooks]
 */
function confirmAndApplyPlan(game, plan, hooks = {}) {
  const confirmFn =
    hooks.confirmFn || ((msg) => window.confirm(msg));
  const navigateFn =
    hooks.navigateFn || ((href) => {
      window.location.assign(href);
    });

  if (plan.needsCrossGameConfirm) {
    const msg =
      plan.messages.find((m) => /Navigate/i.test(m)) ||
      `This run is for "${plan.spec.game}". Navigate to that game page?`;
    if (!confirmFn(msg)) return null;
    if (plan.navigateHref) {
      navigateFn(plan.navigateHref);
      return null;
    }
    return null;
  }

  if (plan.needsUnstableConfirm) {
    const msg =
      plan.messages.find((m) => /unstable|Early test/i.test(m)) ||
      "This is an early test build — the polished release isn’t out yet. Continue?";
    if (!confirmFn(msg)) return null;
  }

  let specToApply = plan.spec;
  if (plan.needsConflictConfirm) {
    const detail = plan.messages.filter(
      (m) => /Unknown|Incompatible|Conflict/i.test(m)
    );
    const msg = [
      "Some extras cannot be applied as requested.",
      ...detail,
      "Apply a compatible run (drop failing extras)?",
    ].join("\n\n");
    if (!confirmFn(msg)) return null;
    specToApply = plan.strippedSpec;
  }

  applyRunSpec(game, specToApply);
  return specToApply;
}

/**
 * Paste → decode → plan → confirm → apply (or navigate).
 * @param {object} game
 * @param {string} raw
 * @param {{ confirmFn?: Function, navigateFn?: Function, statusEl?: HTMLElement | null }} [hooks]
 */
function handlePasteRun(game, raw, hooks = {}) {
  const statusEl = hooks.statusEl ?? document.getElementById("run-paste-status");
  const trimmed = String(raw || "").trim();
  if (!trimmed) {
    if (statusEl) {
      statusEl.textContent = "Paste a run code or link first.";
      statusEl.dataset.tone = "warn";
    }
    return { ok: false, error: "empty" };
  }

  const decoded = decodePasteInput(trimmed);
  if (!decoded.ok) {
    if (statusEl) {
      statusEl.textContent = decoded.error || "Could not decode run code.";
      statusEl.dataset.tone = "warn";
    }
    return decoded;
  }

  const plan = planApplyRunSpec({
    currentGameId: game.id,
    spec: decoded.spec,
    knownMods: seedModsForGame(game.id),
  });

  const applied = confirmAndApplyPlan(game, plan, hooks);
  if (applied) {
    if (statusEl) {
      statusEl.textContent = `Applied run (channel ${
        applied.channel
      }, extras: ${applied.mods.length ? applied.mods.join(", ") : "none"}).`;
      statusEl.dataset.tone = "ok";
    }
    return { ok: true, spec: applied, plan };
  }

  if (plan.needsCrossGameConfirm) {
    if (statusEl) {
      statusEl.textContent = "Navigate confirmed or cancelled — not applied on this page.";
      statusEl.dataset.tone = "muted";
    }
    return { ok: true, navigated: true, plan };
  }

  if (statusEl) {
    statusEl.textContent = "Paste cancelled — run not applied.";
    statusEl.dataset.tone = "muted";
  }
  return { ok: false, cancelled: true, plan };
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Meta pages have no Play tab — panel stays empty / unused. */
function renderMetaPlay(_game) {
  const panel = document.getElementById("panel-play");
  if (panel) panel.innerHTML = "";
}

/** TabPlay — one big Play + risk line; customize behind details */
function renderPlay(game) {
  if (isPlatformMetaTile(game)) {
    renderMetaPlay(game);
    return;
  }
  const panel = document.getElementById("panel-play");
  const def = defaultPlayState(game);
  const spec = currentSpec();
  const channel = spec.channel || def.channel;
  const mods = Array.isArray(spec.mods) ? spec.mods : [];
  const knownMods = seedModsForGame(game.id);
  const playBuilt = buildPlayHref(game.playHref, {
    ...spec,
    game: game.id,
  });
  const playHref = playBuilt.ok ? playBuilt.href : game.playHref;
  const hashEnc = encodeRunSpec({ ...spec, game: game.id });
  const compactHash = hashEnc.ok ? hashEnc.hash : "";

  const showRisk =
    channel === "unstable" || def.banner === "stub-not-shipped-stable";

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

  const modChips =
    knownMods.length === 0
      ? `<p class="muted">No optional extras listed for this title yet.</p>`
      : `<ul class="run-mod-list">${knownMods
          .map((m) => {
            const on = mods.includes(m.id);
            return `<li class="run-mod-item${on ? " run-mod-on" : ""}">
              <label>
                <input type="checkbox" data-mod-id="${escapeAttr(m.id)}" ${
                  on ? "checked" : ""
                } />
                <span>${escapeHtml(m.label)}</span>
              </label>
            </li>`;
          })
          .join("")}</ul>
        <p class="muted">Toggling extras updates the Play link and share code for this page.</p>`;

  const selectedSummary = mods.length
    ? mods.map((id) => escapeHtml(modLabel(game.id, id))).join(", ")
    : "none";

  const channelLabel =
    channel === "unstable"
      ? "Early build"
      : channel === "stable"
        ? "Polished release"
        : escapeHtml(channel);

  panel.innerHTML = `
    <h2>Play</h2>
    <div class="play-above-fold">
      <div class="actions play-primary-row">
        <a class="btn btn-primary btn-play-lg" id="play-cta" href="${escapeAttr(
          playHref
        )}">Play ${escapeHtml(game.title)}</a>
      </div>
      ${
        showRisk
          ? `<p class="play-risk" role="status">Early test build — the polished release isn’t out yet.</p>`
          : `<p class="muted">Ready to play in your browser.</p>`
      }
    </div>

    <details class="run-customize">
      <summary>Customize this run</summary>
      <div class="run-customize-body">
        <div class="channel-tip run-session">
          <h3>This run</h3>
          <p>
            Channel: <strong id="run-channel">${channelLabel}</strong>
            ${
              channel === "unstable"
                ? ` <span class="badge badge-stub">early</span>`
                : ""
            }
          </p>
          <p>Extras: <span id="run-mods-summary">${selectedSummary}</span></p>
          <div class="run-channel-picker" role="group" aria-label="Channel">
            ${(game.channels || ["unstable", "stable"])
              .map((c) => {
                const label =
                  c === "unstable"
                    ? "Early build"
                    : c === "stable"
                      ? "Polished release"
                      : c;
                return `<button type="button" class="chip${
                  c === channel ? " chip-active" : ""
                }" data-channel="${escapeAttr(c)}">${escapeHtml(label)}</button>`;
              })
              .join("")}
          </div>
          <p class="actions" style="margin-top:0.75rem">
            <button type="button" class="btn btn-secondary" id="btn-reset-default-play">Reset to default</button>
          </p>
        </div>

        <div class="run-mods-block">
          <h3>Extras</h3>
          ${modChips}
        </div>

        <div class="run-hash-block">
          <h3>Share / copy run</h3>
          <p class="muted">Copy a run code or link so someone else can match your channel and extras.</p>
          <p class="run-hash-display"><code id="run-hash-value">${escapeHtml(
            compactHash
          )}</code></p>
          <div class="actions">
            <button type="button" class="btn btn-secondary" id="btn-copy-hash">Copy run code</button>
            <button type="button" class="btn btn-secondary" id="btn-copy-link">Copy run link</button>
          </div>
          <label class="run-paste-label" for="run-paste-input">Paste run code or link</label>
          <div class="run-paste-row">
            <input type="text" id="run-paste-input" class="run-paste-input"
              placeholder="Paste a run code or link"
              autocomplete="off" spellcheck="false" />
            <button type="button" class="btn btn-secondary" id="btn-paste-apply">Apply</button>
          </div>
          <p id="run-paste-status" class="run-paste-status muted" data-tone="muted" role="status"></p>
        </div>

        <div class="download-block">
          <h3>Download</h3>
          ${downloadBlock}
        </div>
      </div>
    </details>
    ${
      game.offlineFirst
        ? `<p class="muted">Offline-friendly: the core loop does not require an account or network.</p>`
        : ""
    }
  `;

  wirePlayControls(game);
}

function wirePlayControls(game) {
  const statusEl = document.getElementById("run-paste-status");

  document.getElementById("btn-reset-default-play")?.addEventListener("click", () => {
    const def = defaultPlayState(game);
    applyRunSpec(game, {
      v: 1,
      game: game.id,
      channel: def.channel,
      mods: [],
    });
    if (statusEl) {
      statusEl.textContent = "Reset to default play settings.";
      statusEl.dataset.tone = "ok";
    }
  });

  for (const chip of document.querySelectorAll("[data-channel]")) {
    chip.addEventListener("click", () => {
      const channel = chip.getAttribute("data-channel");
      if (!channel) return;
      const next = { ...currentSpec(), game: game.id, channel };
      const plan = planApplyRunSpec({
        currentGameId: game.id,
        spec: next,
        knownMods: seedModsForGame(game.id),
      });
      if (plan.needsConflictConfirm) {
        const ok = window.confirm(
          [
            `Switch channel?`,
            ...plan.messages.filter((m) => /Incompatible|Conflict|Unknown/i.test(m)),
            "Drop incompatible extras and continue?",
          ].join("\n\n")
        );
        if (!ok) return;
        applyRunSpec(game, plan.strippedSpec);
      } else {
        applyRunSpec(game, next);
      }
    });
  }

  for (const input of document.querySelectorAll("input[data-mod-id]")) {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-mod-id");
      if (!id) return;
      const set = new Set(currentSpec().mods || []);
      if (input.checked) set.add(id);
      else set.delete(id);
      const next = {
        ...currentSpec(),
        game: game.id,
        mods: [...set],
      };
      const plan = planApplyRunSpec({
        currentGameId: game.id,
        spec: next,
        knownMods: seedModsForGame(game.id),
      });
      if (plan.needsConflictConfirm && input.checked) {
        const ok = window.confirm(
          [
            `Enable this extra?`,
            ...plan.messages.filter((m) => /Incompatible|Conflict|Unknown/i.test(m)),
            "Continue with a compatible set?",
          ].join("\n\n")
        );
        if (!ok) {
          input.checked = false;
          return;
        }
        applyRunSpec(game, plan.strippedSpec);
        return;
      }
      applyRunSpec(game, next);
    });
  }

  document.getElementById("btn-copy-hash")?.addEventListener("click", async () => {
    const enc = encodeRunSpec({ ...currentSpec(), game: game.id });
    if (!enc.ok) {
      if (statusEl) {
        statusEl.textContent = enc.error || "Could not encode run code.";
        statusEl.dataset.tone = "warn";
      }
      return;
    }
    const ok = await copyText(enc.hash);
    if (statusEl) {
      statusEl.textContent = ok
        ? `Copied run code`
        : `Copy failed — select and copy the code above`;
      statusEl.dataset.tone = ok ? "ok" : "warn";
    }
  });

  document.getElementById("btn-copy-link")?.addEventListener("click", async () => {
    const link = buildRunLink(game.id, { ...currentSpec(), game: game.id });
    if (!link.ok) {
      if (statusEl) {
        statusEl.textContent = link.error || "Could not build run link.";
        statusEl.dataset.tone = "warn";
      }
      return;
    }
    let absolute = link.href;
    try {
      absolute = new URL(link.href, window.location.href).href;
    } catch {
      /* keep relative */
    }
    const ok = await copyText(absolute);
    if (statusEl) {
      statusEl.textContent = ok
        ? `Copied run link`
        : `Copy failed — select and copy: ${absolute}`;
      statusEl.dataset.tone = ok ? "ok" : "warn";
    }
  });

  document.getElementById("btn-paste-apply")?.addEventListener("click", () => {
    const input = document.getElementById("run-paste-input");
    handlePasteRun(game, input?.value || "", { statusEl });
  });

  document.getElementById("run-paste-input")?.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      handlePasteRun(game, ev.target.value || "", { statusEl });
    }
  });
}

/** TabAbout — human DESIGN summary first; licenses; For contributors */
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

  const designSummary = about.oneLiner || game.summary;

  panel.innerHTML = `
    <h2>About</h2>
    <p class="about-oneliner">${escapeHtml(designSummary)}</p>
    ${
      about.pillars?.length
        ? `<h3>Design pillars</h3>${pillars}`
        : ""
    }
    ${
      about.nonGoals?.length
        ? `<h3>Non-goals</h3>${nonGoals}`
        : ""
    }
    <dl class="about-meta">
      <div><dt>Licenses</dt><dd>${escapeHtml(
        about.licenses || "See repo LICENSE files"
      )}</dd></div>
      <div><dt>Engine</dt><dd>${escapeHtml(
        about.engineNote || game.enginePrimary || "—"
      )}</dd></div>
      <div><dt>Lineage</dt><dd>${escapeHtml(
        about.lineage || "—"
      )}</dd></div>
      <div><dt>Lifecycle / stage</dt><dd>${escapeHtml(
        `${game.lifecycle || "—"} · ${game.stage || "—"}`
      )}</dd></div>
    </dl>
    <section class="about-contributors" aria-labelledby="about-contrib">
      <h3 id="about-contrib">For contributors</h3>
      <p class="muted">Want to help shape this title? Open the repo or design notes on GitHub.</p>
      <div class="actions">
        ${
          game.githubHref
            ? `<a class="btn btn-primary" href="${escapeAttr(
                game.githubHref
              )}" rel="noopener noreferrer">GitHub</a>`
            : ""
        }
        ${
          about.designHref
            ? `<a class="btn btn-secondary" href="${escapeAttr(
                about.designHref
              )}">DESIGN notes</a>`
            : ""
        }
        ${
          about.gameYamlHref
            ? `<a class="btn btn-secondary" href="${escapeAttr(
                about.gameYamlHref
              )}">game.yaml</a>`
            : ""
        }
        <a class="btn btn-secondary" href="https://github.com/FossArcade/foss-arcade/blob/main/CONTRIBUTING.md" rel="noopener noreferrer">Contributing guide</a>
      </div>
    </section>
  `;
}

/** TabCommunity — ForumPort-backed UI (Snake); PlaceholderGameGate otherwise */
async function renderCommunity(game) {
  const panel = document.getElementById("panel-community");
  if (game.placeholder && !isPlatformMetaTile(game)) {
    panel.innerHTML = renderPlaceholderGate();
    return;
  }
  if (isPlatformMetaTile(game)) {
    const discuss =
      game.community?.discussionsHref ||
      "https://github.com/FossArcade/foss-arcade/discussions/categories/meta";
    const compose = discuss.includes("/categories/")
      ? discuss.replace(/\/categories\/meta$/, "/new?category=meta")
      : `${discuss}/new?category=meta`;
    panel.innerHTML = `
      <h2>Community</h2>
      <div class="community-beginner">
        <h3>Talk about the Arcade</h3>
        <p>Share ideas and bugs about the Shelf and community settings — not a game proposal lane.</p>
        <div class="actions">
          <a class="btn btn-primary" href="${escapeAttr(
            compose
          )}" rel="noopener noreferrer">Start a discussion</a>
          <a class="btn btn-secondary" href="${escapeAttr(
            discuss
          )}" rel="noopener noreferrer">Open Community</a>
        </div>
      </div>
      <details class="community-advanced">
        <summary>Advanced — shape the next update</summary>
        <div class="gate gate-meta" style="margin-top:0.75rem">
          <p>Use the GitHub Discussions <strong>meta</strong> category for Arcade-wide settings
            (category map, community chrome, adapter swaps). Document changes in
            <code>docs/shopfront/community-forum.md</code>.</p>
        </div>
      </details>`;
    return;
  }
  panel.innerHTML = `<h2>Community</h2><p class="muted">Loading…</p>`;
  try {
    await mountTabCommunity(panel, game);
  } catch (err) {
    console.error(err);
    panel.innerHTML = `
      <h2>Community</h2>
      <div class="gate gate-stub">
        <p><strong>Could not load Community tab.</strong> ${escapeHtml(
          String(err?.message || err)
        )}</p>
        <p class="muted">Try opening GitHub Discussions from the game’s repo links.</p>
      </div>`;
  }
}

/** TabChangelog stub */
function renderChangelog(game) {
  const panel = document.getElementById("panel-changelog");
  if (isPlatformMetaTile(game)) {
    panel.innerHTML = `
      <h2>Changelog</h2>
      <div class="gate gate-meta">
        <p><strong>No game releases here.</strong> Platform Meta is not on a playable release train.
          Track Shelf and community changes via docs PRs and Discussions meta.</p>
      </div>`;
    return;
  }
  panel.innerHTML = `
    <h2>Changelog</h2>
    <div class="gate gate-stub">
      <p><strong>Coming soon.</strong> Release notes and tip channel history will land here.</p>
      <p class="muted">Today’s default is an early test build — a polished release train is not out yet.</p>
      ${
        game.metrics?.lastUpdate
          ? `<p class="muted">Catalog updated: ${escapeHtml(
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
  if (isPlatformMetaTile(game)) {
    el.hidden = true;
    return;
  }
  const def = defaultPlayState(game);
  const arts = artifactsForTile(game);
  const showStub =
    def.banner === "stub-not-shipped-stable" ||
    (!arts.stable &&
      (game.defaultChannel === "unstable" || game.metrics?.mode === "stub"));

  if (showStub) {
    el.hidden = false;
    el.innerHTML = `<strong>Early test build.</strong> The polished release isn’t out yet. Metrics and desktop downloads are placeholders until live pipelines and packages ship.`;
  } else {
    el.hidden = true;
  }
}

function configureTabsForGame(game) {
  const playTab = document.getElementById("tab-play");
  const playPanel = document.getElementById("panel-play");
  const meta = isPlatformMetaTile(game);
  if (playTab) {
    playTab.hidden = meta;
    if (meta) {
      playTab.setAttribute("aria-hidden", "true");
    } else {
      playTab.removeAttribute("aria-hidden");
    }
  }
  if (playPanel && meta) {
    playPanel.hidden = true;
  }
}

function selectTab(name) {
  const game = playSession?.game || getGameById(qsId());
  if (isPlatformMetaTile(game) && name === "play") {
    name = "about";
  }
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  for (const tab of tabs) {
    if (tab.hidden) continue;
    const on = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", on ? "true" : "false");
    tab.classList.toggle("tab-active", on);
  }
  for (const panel of panels) {
    if (panel.id === "panel-play" && isPlatformMetaTile(game)) {
      panel.hidden = true;
      continue;
    }
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

/**
 * Apply URL ?run= / verbose query on load (with confirms). Default Play otherwise.
 * @param {object} game
 */
function bootstrapRunFromUrl(game) {
  if (isPlatformMetaTile(game)) {
    playSession = {
      game,
      spec: { v: 1, game: game.id, channel: "", mods: [] },
      banner: null,
    };
    return;
  }
  const initial = resolveInitialRun(game, window.location.search);
  playSession = {
    game,
    spec: {
      v: 1,
      game: game.id,
      channel: initial.spec.channel,
      mods: [...(initial.spec.mods || [])],
      ...(initial.spec.tip ? { tip: initial.spec.tip } : {}),
    },
    banner: initial.banner,
  };

  if (initial.source === "default") return;

  if (initial.decode && !initial.decode.ok) {
    const def = defaultPlayState(game);
    playSession.spec = {
      v: 1,
      game: game.id,
      channel: def.channel,
      mods: [],
    };
    return;
  }

  const plan = planApplyRunSpec({
    currentGameId: game.id,
    spec: initial.spec,
    knownMods: seedModsForGame(game.id),
  });

  if (plan.needsCrossGameConfirm) {
    const def = defaultPlayState(game);
    playSession.spec = {
      v: 1,
      game: game.id,
      channel: def.channel,
      mods: [],
    };
    queueMicrotask(() => {
      confirmAndApplyPlan(game, plan);
    });
    return;
  }

  if (plan.needsUnstableConfirm || plan.needsConflictConfirm) {
    const def = defaultPlayState(game);
    playSession.spec = {
      v: 1,
      game: game.id,
      channel: def.channel,
      mods: [],
    };
    queueMicrotask(() => {
      confirmAndApplyPlan(game, plan);
    });
    return;
  }

  playSession.spec = plan.spec;
}

async function main() {
  const id = qsId();
  const game = getGameById(id);
  if (!game) {
    renderMissing(id);
    return;
  }

  bootstrapRunFromUrl(game);
  configureTabsForGame(game);
  renderHero(game);
  setStubBanner(game);
  renderPlay(game);
  renderAbout(game);
  await renderCommunity(game);
  renderChangelog(game);

  for (const tab of document.querySelectorAll(".tab")) {
    tab.addEventListener("click", () => {
      if (tab.hidden) return;
      selectTab(tab.dataset.tab);
    });
  }
  window.addEventListener("hashchange", () => selectTab(hashTab(game)));
  selectTab(hashTab(game));
}

main();

// Testable hooks (optional DOM-free callers may import play-run.js directly).
export {
  handlePasteRun,
  confirmAndApplyPlan,
  applyRunSpec,
  bootstrapRunFromUrl,
};
