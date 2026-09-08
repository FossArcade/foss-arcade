/**
 * Apply fa1_ / verbose run query to Foss Snake (pure helpers).
 * Shares encode/decode rules via shopfront/run-hash.js — do not fork the codec.
 */

import {
  decodeRunSpec,
  encodeRunSpec,
  defaultPlayForTile,
} from "../../../../shopfront/run-hash.js";
import {
  resolveMods,
  mergeModEffects,
  listModsForGame,
} from "../../mods/registry.js";

/** Seed tile shape for Default Play (no stable artifact yet). */
export const SNAKE_SEED_TILE = Object.freeze({
  id: "snake",
  defaultChannel: "unstable",
  channels: Object.freeze(["unstable", "stable"]),
});

/**
 * @param {object} [artifacts]
 * @returns {{ v: 1, game: string, channel: string, mods: string[], banner: string | null }}
 */
export function defaultSnakePlay(artifacts = { stable: false, hasStable: false }) {
  const d = defaultPlayForTile(SNAKE_SEED_TILE, artifacts);
  return {
    v: /** @type {1} */ (1),
    game: d.game,
    channel: d.channel,
    mods: [],
    banner: d.banner,
  };
}

/**
 * Resolve URL search / hash input into a RunSpec + soft-applied mods.
 *
 * @param {string | URLSearchParams | Record<string, string> | null | undefined} search
 * @param {object} [opts]
 * @param {object} [opts.artifacts]
 * @param {string} [opts.expectedGame="snake"]
 * @returns {{
 *   source: "url-run" | "url-verbose" | "default",
 *   spec: { v: 1, game: string, channel: string, mods: string[], tip?: string },
 *   hash: string | null,
 *   banner: string | null,
 *   applied: import("../../mods/registry.js").ModPack[],
 *   unknownMods: string[],
 *   incompatibleMods: { id: string, reason: string }[],
 *   refusedMods: { id: string, reason: string }[],
 *   gameOpts: object,
 *   skin: string | null,
 *   decodeError: string | null,
 * }}
 */
export function resolveSnakeRun(search, opts = {}) {
  const expectedGame = opts.expectedGame || "snake";
  const def = defaultSnakePlay(opts.artifacts);
  const defaultSpec = {
    v: /** @type {1} */ (1),
    game: def.game,
    channel: def.channel,
    mods: /** @type {string[]} */ ([]),
  };

  /** @type {URLSearchParams | null} */
  let params = null;
  if (typeof search === "string") {
    let q = search.trim();
    if (q.startsWith("?")) q = q.slice(1);
    const qIdx = q.indexOf("?");
    if (qIdx >= 0) q = q.slice(qIdx + 1);
    // Also accept bare fa1_… pasted as the whole search
    if (q.startsWith("fa1_") && !q.includes("=")) {
      params = new URLSearchParams();
      params.set("run", q);
    } else {
      params = new URLSearchParams(q);
    }
  } else if (search instanceof URLSearchParams) {
    params = search;
  } else if (search && typeof search === "object") {
    params = new URLSearchParams();
    for (const [k, v] of Object.entries(search)) {
      if (v != null) params.set(k, String(v));
    }
  }

  let source = /** @type {"url-run" | "url-verbose" | "default"} */ ("default");
  let spec = defaultSpec;
  /** @type {string | null} */
  let decodeError = null;

  if (params) {
    const run = params.get("run");
    if (run) {
      const decoded = decodeRunSpec(run);
      if (decoded.ok) {
        source = "url-run";
        spec = decoded.spec;
      } else {
        decodeError = decoded.error;
      }
    } else if (params.get("channel") || params.get("mods")) {
      const decoded = decodeRunSpec(params);
      if (decoded.ok) {
        source = "url-verbose";
        spec = decoded.spec;
      } else {
        decodeError = decoded.error;
      }
    }
  }

  // Soft-ignore cross-game hashes on Snake page (keep default play).
  if (spec.game && spec.game !== expectedGame) {
    decodeError = `Run is for game "${spec.game}", not "${expectedGame}"`;
    source = "default";
    spec = defaultSpec;
  }

  const resolved = resolveMods(spec.mods || [], spec.channel);
  const { opts: gameOpts, skin } = mergeModEffects(resolved.applied, {});

  const enc = encodeRunSpec(spec);
  const hash = enc.ok ? enc.hash : null;

  return {
    source,
    spec,
    hash,
    banner: def.banner,
    applied: resolved.applied,
    unknownMods: resolved.unknown,
    incompatibleMods: resolved.incompatible,
    refusedMods: resolved.refused,
    gameOpts,
    skin,
    decodeError,
  };
}

/**
 * Label for HUD chip.
 * @param {{ channel: string, mods?: string[] }} spec
 * @param {import("../../mods/registry.js").ModPack[]} [applied]
 */
export function formatRunChip(spec, applied = []) {
  const modCount = (applied.length ? applied : spec.mods || []).length;
  const channel = spec.channel || "unstable";
  if (modCount === 0) {
    if (channel === "unstable") return "Early build";
    if (channel === "stable") return "Stable · no extras";
    return `${channel} · no extras`;
  }
  const extras = `${modCount} extra${modCount === 1 ? "" : "s"}`;
  if (channel === "unstable") return `Unstable · ${extras}`;
  if (channel === "stable") return `Stable · ${extras}`;
  return `${channel} · ${extras}`;
}

export { listModsForGame, decodeRunSpec, encodeRunSpec };
