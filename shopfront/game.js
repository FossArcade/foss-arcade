import { getGameById } from "./games.js";
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

function hashTab() {
  const h = (window.location.hash || "").replace(/^#/, "").toLowerCase();
  if (["play", "about", "community", "changelog"].includes(h)) return h;
  return "play";
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
  return bits.join(" ");
}

function heroPlayHref(game) {
  const built = buildPlayHref(game.playHref, currentSpec());
  return built.ok ? built.href : game.playHref;
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
            )}" rel="noopener noreferrer" title="Outreach only — not binding commons">${escapeHtml(
              game.community.subredditLabel || "Reddit"
            )} (outreach)</a>`
          : ""
      }
    </div>
  `;
}

function syncPlayHrefs(game) {
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
      plan.messages.find((m) => /unstable/i.test(m)) ||
      "This run uses the unstable channel. Continue?";
    if (!confirmFn(msg)) return null;
  }

  let specToApply = plan.spec;
  if (plan.needsConflictConfirm) {
    const detail = plan.messages.filter(
      (m) => /Unknown|Incompatible|Conflict/i.test(m)
    );
    const msg = [
      "Some mods cannot be applied as requested.",
      ...detail,
      "Apply a stripped-to-compatible run (drop failing mods)?",
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
      statusEl.textContent = "Paste a fa1_… hash or channel=&mods= query first.";
      statusEl.dataset.tone = "warn";
    }
    return { ok: false, error: "empty" };
  }

  const decoded = decodePasteInput(trimmed);
  if (!decoded.ok) {
    if (statusEl) {
      statusEl.textContent = decoded.error || "Could not decode run hash.";
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
      statusEl.textContent = `Applied ${plan.hash || "run"} (channel ${
        applied.channel
      }, mods: ${applied.mods.length ? applied.mods.join(", ") : "none"}).`;
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

/** TabPlayDownload — Default Play, channel/mods, copy/paste run hash stub */
function renderPlay(game) {
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
      ? `<p class="muted">No Seed mod catalog for this title yet.</p>`
      : `<ul class="run-mod-list">${knownMods
          .map((m) => {
            const on = mods.includes(m.id);
            return `<li class="run-mod-item${on ? " run-mod-on" : ""}">
              <label>
                <input type="checkbox" data-mod-id="${escapeAttr(m.id)}" ${
                  on ? "checked" : ""
                } />
                <span>${escapeHtml(m.label)}</span>
                <code>${escapeHtml(m.id)}</code>
              </label>
            </li>`;
          })
          .join("")}</ul>
        <p class="muted">Seed stub: toggling mods updates share state and Play query params only — no full mod loader yet.</p>`;

  const selectedSummary = mods.length
    ? mods.map((id) => escapeHtml(modLabel(game.id, id))).join(", ")
    : "none (Default Play = no optional mods)";

  panel.innerHTML = `
    <h2>Play / Download</h2>
    <p>Default <strong>Play</strong> targets the best shipped train via <code>defaultPlayForTile</code>
      — today: <code>${escapeHtml(def.channel)}</code> + no optional mods
      ${
        def.banner === "stub-not-shipped-stable"
          ? `(stub ≠ shipped <code>stable</code>)`
          : ""
      }.
    </p>
    <div class="actions">
      <a class="btn btn-primary" id="play-cta" href="${escapeAttr(
        playHref
      )}">Play ${escapeHtml(game.title)}</a>
      <button type="button" class="btn btn-secondary" id="btn-reset-default-play">Reset to Default Play</button>
    </div>

    <div class="channel-tip run-session">
      <h3>This run</h3>
      <p>
        Channel: <code id="run-channel">${escapeHtml(channel)}</code>
        ${
          channel === "unstable"
            ? ` <span class="badge badge-stub">unstable risk</span>`
            : ""
        }
      </p>
      <p>Mods: <span id="run-mods-summary">${selectedSummary}</span></p>
      <p class="muted">Catalog defaultChannel: <code>${escapeHtml(
        game.defaultChannel || "—"
      )}</code>
        ${
          game.channels?.length
            ? ` · listed: ${game.channels.map((c) => escapeHtml(c)).join(", ")}`
            : ""
        }
      </p>
      <div class="run-channel-picker" role="group" aria-label="Channel">
        ${(game.channels || ["unstable", "stable"])
          .map(
            (c) =>
              `<button type="button" class="chip${
                c === channel ? " chip-active" : ""
              }" data-channel="${escapeAttr(c)}">${escapeHtml(c)}</button>`
          )
          .join("")}
      </div>
    </div>

    <div class="run-mods-block">
      <h3>Mods / features</h3>
      ${modChips}
    </div>

    <div class="run-hash-block">
      <h3>Copy / Paste run</h3>
      <p class="muted">Share channel + mods as a compact <code>fa1_…</code> hash (or verbose <code>channel=&amp;mods=</code>). Variants / pillars are never encoded.</p>
      <p class="run-hash-display"><code id="run-hash-value">${escapeHtml(
        compactHash
      )}</code></p>
      <div class="actions">
        <button type="button" class="btn btn-secondary" id="btn-copy-hash">Copy run hash</button>
        <button type="button" class="btn btn-secondary" id="btn-copy-link">Copy run link</button>
      </div>
      <label class="run-paste-label" for="run-paste-input">Paste hash or link</label>
      <div class="run-paste-row">
        <input type="text" id="run-paste-input" class="run-paste-input"
          placeholder="fa1_snake_unstable_… or ?run=fa1_… / channel=&amp;mods="
          autocomplete="off" spellcheck="false" />
        <button type="button" class="btn btn-secondary" id="btn-paste-apply">Apply</button>
      </div>
      <p id="run-paste-status" class="run-paste-status muted" data-tone="muted" role="status"></p>
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
      statusEl.textContent = "Reset to Default Play (best shipped train, no optional mods).";
      statusEl.dataset.tone = "ok";
    }
  });

  for (const chip of document.querySelectorAll("[data-channel]")) {
    chip.addEventListener("click", () => {
      const channel = chip.getAttribute("data-channel");
      if (!channel) return;
      const next = { ...currentSpec(), game: game.id, channel };
      // Re-check mod compatibility when switching channel
      const plan = planApplyRunSpec({
        currentGameId: game.id,
        spec: next,
        knownMods: seedModsForGame(game.id),
      });
      if (plan.needsConflictConfirm) {
        const ok = window.confirm(
          [
            `Switch to channel "${channel}"?`,
            ...plan.messages.filter((m) => /Incompatible|Conflict|Unknown/i.test(m)),
            "Drop incompatible mods and continue?",
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
            `Enable ${id}?`,
            ...plan.messages.filter((m) => /Incompatible|Conflict|Unknown/i.test(m)),
            "Continue with stripped-to-compatible set?",
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
        statusEl.textContent = enc.error || "Could not encode run hash.";
        statusEl.dataset.tone = "warn";
      }
      return;
    }
    const ok = await copyText(enc.hash);
    if (statusEl) {
      statusEl.textContent = ok
        ? `Copied hash: ${enc.hash}`
        : `Copy failed — select and copy: ${enc.hash}`;
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
    // Prefer absolute URL when served from a real origin
    let absolute = link.href;
    try {
      absolute = new URL(link.href, window.location.href).href;
    } catch {
      /* keep relative */
    }
    const ok = await copyText(absolute);
    if (statusEl) {
      statusEl.textContent = ok
        ? `Copied run link (${link.hash})`
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
  const def = defaultPlayState(game);
  const arts = artifactsForTile(game);
  const showStub =
    def.banner === "stub-not-shipped-stable" ||
    (!arts.stable &&
      (game.defaultChannel === "unstable" || game.metrics?.mode === "stub"));
  const activeChannel = currentSpec().channel || def.channel;

  if (showStub) {
    el.hidden = false;
    el.innerHTML = `<strong>Stub ≠ shipped stable.</strong> Default Play uses <code>${escapeHtml(
      def.channel
    )}</code> + no optional mods until a real <code>stable</code> artifact ships (catalog <code>defaultChannel</code> may stay <code>${escapeHtml(
      game.defaultChannel || "unstable"
    )}</code>). This session channel: <code>${escapeHtml(
      activeChannel
    )}</code>. Metrics and downloads are placeholders until live pipelines and desktop packages ship.`;
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

/**
 * Apply URL ?run= / verbose query on load (with confirms). Default Play otherwise.
 * @param {object} game
 */
function bootstrapRunFromUrl(game) {
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
    // Bad run param — fall back to Default Play silently (banner still shows stub).
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

  // Cross-game deep link on wrong page → confirm navigate (do not apply here).
  if (plan.needsCrossGameConfirm) {
    // Keep Default Play visible until user confirms navigation.
    const def = defaultPlayState(game);
    playSession.spec = {
      v: 1,
      game: game.id,
      channel: def.channel,
      mods: [],
    };
    // Defer confirm until after first paint so the page is usable if they cancel.
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

  // Safe same-game apply (e.g. stable + known mods) — apply immediately.
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

// Testable hooks (optional DOM-free callers may import play-run.js directly).
export {
  handlePasteRun,
  confirmAndApplyPlan,
  applyRunSpec,
  bootstrapRunFromUrl,
};
