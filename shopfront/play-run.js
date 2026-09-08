/**
 * Play-tab run-hash stub helpers (apply / confirm planning).
 *
 * Pure functions — no DOM. Wired by game.js Play / Download.
 * See docs/design/shelf-byo-github-and-run-hash.md §2.4–2.5 + locked answers.
 *
 * Locked:
 * - Default Play = defaultPlayForTile(tile, artifacts)
 * - Cross-game paste → confirm navigate, then apply (never silent on wrong page)
 * - Unstable / conflicts → confirm before apply
 * - Mods: namespaced ids; Seed Snake has no real mod loader — UI state + playHref query only
 */

import {
  encodeRunSpec,
  decodeRunSpec,
  defaultPlayForTile,
  isValidModId,
} from "./run-hash.js";

/**
 * @typedef {import("./run-hash.js").RunSpec} RunSpec
 * @typedef {import("./run-hash.js").ChannelId} ChannelId
 */

/**
 * @typedef {object} SeedMod
 * @property {string} id
 * @property {string} label
 * @property {"*" | string[]} compatibleChannels
 * @property {string[]} [conflicts]
 */

/** Seed stub mod catalog for Snake (namespaced ids; no real loader yet). */
export const SNAKE_SEED_MODS = Object.freeze([
  {
    id: "snake.mod.skin-neon",
    label: "Skin — neon",
    compatibleChannels: "*",
  },
  {
    id: "snake.mod.speed-extreme",
    label: "Speed — extreme",
    compatibleChannels: ["unstable"],
  },
]);

/**
 * @param {string} gameId
 * @returns {readonly SeedMod[]}
 */
export function seedModsForGame(gameId) {
  if (gameId === "snake") return SNAKE_SEED_MODS;
  return Object.freeze([]);
}

/**
 * Seed artifact availability. No real stable train yet.
 * @param {object} [_tile]
 * @returns {{ stable: boolean, hasStable: boolean }}
 */
export function artifactsForTile(_tile) {
  return { stable: false, hasStable: false };
}

/**
 * Default Play RunSpec + banner for a tile (Seed artifacts).
 * @param {object} tile
 * @returns {ReturnType<typeof defaultPlayForTile>}
 */
export function defaultPlayState(tile) {
  return defaultPlayForTile(tile, artifactsForTile(tile));
}

/**
 * Append run query params to a play href (game build URL).
 * Prefer compact `run=fa1_…`; keep path/hash of base intact.
 * @param {string} baseHref
 * @param {object} rawSpec
 * @returns {{ ok: true, href: string, hash: string, spec: RunSpec } | { ok: false, error: string, code?: string }}
 */
export function buildPlayHref(baseHref, rawSpec) {
  const enc = encodeRunSpec(rawSpec);
  if (!enc.ok) return enc;
  const base = String(baseHref || "/");
  let url;
  try {
    url = new URL(base, "http://shopfront.local");
  } catch {
    return { ok: false, error: "Invalid play href", code: "invalid_href" };
  }
  url.searchParams.delete("run");
  url.searchParams.delete("channel");
  url.searchParams.delete("mods");
  url.searchParams.delete("tip");
  url.searchParams.delete("v");
  url.searchParams.delete("game");
  url.searchParams.set("run", enc.hash);
  const path = `${url.pathname}${url.search}${url.hash}`;
  // Preserve absolute paths; relative bases stay path-only (no origin).
  const href = base.startsWith("http") ? url.href : path;
  return { ok: true, href, hash: enc.hash, spec: enc.spec };
}

/**
 * Shareable game-page deep link with `?run=fa1_…` (canonical share form).
 * @param {string} gameId
 * @param {object} rawSpec
 * @param {string} [gamePageBase="/shopfront/game"]
 * @returns {{ ok: true, href: string, hash: string, spec: RunSpec } | { ok: false, error: string, code?: string }}
 */
export function buildRunLink(gameId, rawSpec, gamePageBase = "/shopfront/game") {
  const enc = encodeRunSpec({ ...rawSpec, game: rawSpec.game || gameId });
  if (!enc.ok) return enc;
  const params = new URLSearchParams();
  params.set("id", gameId || enc.spec.game);
  params.set("run", enc.hash);
  const base = String(gamePageBase || "/shopfront/game").replace(/\?.*$/, "");
  return {
    ok: true,
    href: `${base}?${params.toString()}`,
    hash: enc.hash,
    spec: enc.spec,
  };
}

/**
 * @param {SeedMod | undefined} mod
 * @param {ChannelId} channel
 * @returns {boolean}
 */
function modCompatibleWithChannel(mod, channel) {
  if (!mod) return false;
  if (mod.compatibleChannels === "*") return true;
  if (!Array.isArray(mod.compatibleChannels)) return false;
  return mod.compatibleChannels.includes(channel);
}

/**
 * Plan applying a RunSpec on the current game page (pure).
 *
 * @param {object} opts
 * @param {string} opts.currentGameId
 * @param {RunSpec} opts.spec
 * @param {readonly SeedMod[]} [opts.knownMods]
 * @returns {{
 *   ok: true,
 *   spec: RunSpec,
 *   hash: string | null,
 *   needsCrossGameConfirm: boolean,
 *   needsUnstableConfirm: boolean,
 *   needsConflictConfirm: boolean,
 *   unknownMods: string[],
 *   incompatibleMods: { id: string, reason: string }[],
 *   conflictMods: { a: string, b: string }[],
 *   strippedSpec: RunSpec,
 *   navigateHref: string | null,
 *   messages: string[],
 * }}
 */
export function planApplyRunSpec({
  currentGameId,
  spec,
  knownMods = seedModsForGame(currentGameId),
}) {
  const knownById = new Map(knownMods.map((m) => [m.id, m]));
  const knownIds = new Set(knownById.keys());

  const enc = encodeRunSpec(spec);
  const hash = enc.ok ? enc.hash : null;
  const canonical = enc.ok ? enc.spec : spec;

  const needsCrossGameConfirm =
    Boolean(canonical.game) &&
    Boolean(currentGameId) &&
    canonical.game !== currentGameId;

  const needsUnstableConfirm = canonical.channel === "unstable";

  const unknownMods = (canonical.mods || []).filter((id) => !knownIds.has(id));

  /** @type {{ id: string, reason: string }[]} */
  const incompatibleMods = [];
  for (const id of canonical.mods || []) {
    const mod = knownById.get(id);
    if (!mod) continue;
    if (!modCompatibleWithChannel(mod, canonical.channel)) {
      incompatibleMods.push({
        id,
        reason: `not compatible with channel "${canonical.channel}"`,
      });
    }
  }

  /** @type {{ a: string, b: string }[]} */
  const conflictMods = [];
  const selected = new Set(canonical.mods || []);
  for (const id of selected) {
    const mod = knownById.get(id);
    if (!mod?.conflicts?.length) continue;
    for (const other of mod.conflicts) {
      if (selected.has(other) && id < other) {
        conflictMods.push({ a: id, b: other });
      }
    }
  }

  const needsConflictConfirm =
    unknownMods.length > 0 ||
    incompatibleMods.length > 0 ||
    conflictMods.length > 0;

  // Strip-to-compatible: drop unknown, incompatible, and one side of pairwise conflicts.
  const drop = new Set([
    ...unknownMods,
    ...incompatibleMods.map((m) => m.id),
  ]);
  for (const { b } of conflictMods) drop.add(b);

  const strippedMods = (canonical.mods || []).filter((id) => !drop.has(id));
  const strippedNorm = encodeRunSpec({
    v: 1,
    game: canonical.game,
    channel: canonical.channel,
    mods: strippedMods,
    tip: canonical.tip,
  });
  const strippedSpec = strippedNorm.ok
    ? strippedNorm.spec
    : { v: 1, game: canonical.game, channel: canonical.channel, mods: [] };

  /** @type {string[]} */
  const messages = [];
  if (needsCrossGameConfirm) {
    messages.push(
      `This run is for "${canonical.game}", not "${currentGameId}". Navigate to that game page to apply?`
    );
  }
  if (needsUnstableConfirm) {
    messages.push(
      "This run uses the unstable channel (higher risk / Seed tip — not a shipped stable train)."
    );
  }
  if (unknownMods.length) {
    messages.push(
      `Unknown mod id(s) on this page (will not auto-enable): ${unknownMods.join(", ")}.`
    );
  }
  if (incompatibleMods.length) {
    messages.push(
      `Incompatible mod(s): ${incompatibleMods
        .map((m) => `${m.id} (${m.reason})`)
        .join("; ")}.`
    );
  }
  if (conflictMods.length) {
    messages.push(
      `Conflicting mods: ${conflictMods.map((c) => `${c.a} ↔ ${c.b}`).join("; ")}.`
    );
  }

  let navigateHref = null;
  if (needsCrossGameConfirm && hash) {
    const link = buildRunLink(canonical.game, canonical);
    navigateHref = link.ok ? link.href : `/shopfront/game?id=${encodeURIComponent(canonical.game)}&run=${encodeURIComponent(hash)}`;
  }

  return {
    ok: true,
    spec: canonical,
    hash,
    needsCrossGameConfirm,
    needsUnstableConfirm,
    needsConflictConfirm,
    unknownMods,
    incompatibleMods,
    conflictMods,
    strippedSpec,
    navigateHref,
    messages,
  };
}

/**
 * Decode paste input (fa1_…, ?run=, or verbose channel=&mods=).
 * @param {string} input
 * @returns {ReturnType<typeof decodeRunSpec>}
 */
export function decodePasteInput(input) {
  return decodeRunSpec(input);
}

/**
 * Whether a string looks like a namespaced mod id (re-export clarity for UI).
 * @param {string} id
 */
export { isValidModId };

/**
 * Resolve initial Play state: URL ?run= / verbose query wins; else Default Play.
 * Pure — caller still runs confirms before applying a URL run.
 *
 * @param {object} tile
 * @param {string | URLSearchParams | Record<string, string>} [search]
 * @returns {{
 *   source: "url-run" | "url-verbose" | "default",
 *   spec: RunSpec,
 *   banner: null | "stub-not-shipped-stable",
 *   decode: ReturnType<typeof decodeRunSpec> | null,
 * }}
 */
export function resolveInitialRun(tile, search) {
  const def = defaultPlayState(tile);
  const defaultSpec = {
    v: /** @type {1} */ (1),
    game: def.game,
    channel: def.channel,
    mods: /** @type {[]} */ ([]),
  };

  /** @type {URLSearchParams | null} */
  let params = null;
  if (typeof search === "string") {
    let q = search.trim();
    if (q.startsWith("?")) q = q.slice(1);
    const qIdx = q.indexOf("?");
    if (qIdx >= 0) q = q.slice(qIdx + 1);
    params = new URLSearchParams(q);
  } else if (search instanceof URLSearchParams) {
    params = search;
  } else if (search && typeof search === "object") {
    params = new URLSearchParams();
    for (const [k, v] of Object.entries(search)) {
      if (v != null) params.set(k, String(v));
    }
  }

  if (!params) {
    return {
      source: "default",
      spec: defaultSpec,
      banner: def.banner,
      decode: null,
    };
  }

  const run = params.get("run");
  if (run) {
    const decode = decodeRunSpec(run);
    if (decode.ok) {
      return {
        source: "url-run",
        spec: decode.spec,
        banner: def.banner,
        decode,
      };
    }
    return {
      source: "default",
      spec: defaultSpec,
      banner: def.banner,
      decode,
    };
  }

  if (params.get("channel") || params.get("mods")) {
    const decode = decodeRunSpec(params);
    if (decode.ok) {
      return {
        source: "url-verbose",
        spec: decode.spec,
        banner: def.banner,
        decode,
      };
    }
    return {
      source: "default",
      spec: defaultSpec,
      banner: def.banner,
      decode,
    };
  }

  return {
    source: "default",
    spec: defaultSpec,
    banner: def.banner,
    decode: null,
  };
}
