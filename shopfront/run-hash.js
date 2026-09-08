/**
 * Foss Arcade run-hash helpers (fa1_…)
 *
 * Pure encode/decode for channel + mod RunSpecs. No UI, no OAuth.
 * See docs/design/shelf-byo-github-and-run-hash.md
 *
 * Locked (product lock / Foss Games Chief):
 * - fa1_… is canonical; verbose query (channel=&mods=) is an accepted alias
 * - Mod ids are namespaced from day one (e.g. snake.mod.speed-extreme)
 * - Hash encodes channel + mods only — never variant / pillar smuggling
 * - Default Play = best shipped train (stable+[] when stable artifact exists;
 *   else unstable+[] with stub≠stable banner). Catalog defaultChannel may
 *   stay "unstable" until first real stable ships.
 */

/** @typedef {"unstable"|"stable"|`season-${number}`|string} ChannelId */

/**
 * @typedef {object} RunSpec
 * @property {1} v
 * @property {string} game
 * @property {ChannelId} channel
 * @property {string[]} mods  sorted unique namespaced mod ids
 * @property {string} [tip]   optional build tip (tag / sha prefix)
 */

/**
 * @typedef {object} DecodeOk
 * @property {true} ok
 * @property {RunSpec} spec
 * @property {"hash"|"query"} source
 */

/**
 * @typedef {object} DecodeErr
 * @property {false} ok
 * @property {string} error
 * @property {string} [code]
 */

/**
 * @typedef {object} EncodeOk
 * @property {true} ok
 * @property {string} hash
 * @property {RunSpec} spec
 */

/**
 * @typedef {object} EncodeErr
 * @property {false} ok
 * @property {string} error
 * @property {string} [code]
 */

export const RUN_HASH_VERSION = 1;
export const RUN_HASH_PREFIX = "fa1_";

/** Fields that must never appear in a RunSpec / verbose query (pillar/variant smuggling). */
export const FORBIDDEN_FIELDS = Object.freeze([
  "variant",
  "variantId",
  "variants",
  "pillar",
  "pillars",
  "design",
  "designOverride",
  "replacesPillars",
  "parent",
  "lineage",
]);

/** Game / channel / tip: slug-ish, no underscores (underscore is the segment separator). */
const SLUG_RE = /^[a-z][a-z0-9-]*$/;
const CHANNEL_RE = /^[a-z][a-z0-9-]*$/;
const TIP_RE = /^[a-zA-Z0-9][a-zA-Z0-9.-]*$/;

/**
 * Namespaced mod id from day one: at least three dot-separated segments,
 * e.g. snake.mod.speed-extreme. Short aliases are UI-only (not in the hash).
 */
const MOD_ID_RE = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*){2,}$/;

/**
 * @param {string} id
 * @returns {boolean}
 */
export function isValidModId(id) {
  return typeof id === "string" && MOD_ID_RE.test(id);
}

/**
 * @param {unknown} value
 * @returns {string | null} error message or null if ok
 */
function rejectSmuggling(value) {
  if (!value || typeof value !== "object") return null;
  for (const key of FORBIDDEN_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return `Rejected smuggling field "${key}" (channel ≠ mod ≠ variant; pillars belong in DESIGN / variants)`;
    }
  }
  return null;
}

/**
 * Normalize and validate a loose RunSpec-like object into a canonical RunSpec.
 * @param {object} raw
 * @returns {EncodeOk | EncodeErr}
 */
export function normalizeRunSpec(raw) {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "RunSpec must be an object", code: "invalid_spec" };
  }
  const smuggle = rejectSmuggling(raw);
  if (smuggle) {
    return { ok: false, error: smuggle, code: "smuggling" };
  }

  const v = raw.v === undefined || raw.v === null ? 1 : Number(raw.v);
  if (v !== 1) {
    return {
      ok: false,
      error: `Unsupported RunSpec version ${raw.v} (only v=1)`,
      code: "unsupported_version",
    };
  }

  const game = typeof raw.game === "string" ? raw.game.trim() : "";
  if (!SLUG_RE.test(game)) {
    return {
      ok: false,
      error: "game must be a lowercase slug (e.g. snake)",
      code: "invalid_game",
    };
  }

  const channel = typeof raw.channel === "string" ? raw.channel.trim() : "";
  if (!CHANNEL_RE.test(channel)) {
    return {
      ok: false,
      error: "channel must be a lowercase slug (e.g. stable, unstable, season-1)",
      code: "invalid_channel",
    };
  }

  let modsIn = raw.mods;
  if (modsIn === undefined || modsIn === null) modsIn = [];
  if (typeof modsIn === "string") {
    modsIn = modsIn
      .split(/[,~]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(modsIn)) {
    return { ok: false, error: "mods must be an array of mod ids", code: "invalid_mods" };
  }

  const mods = [];
  const seen = new Set();
  for (const m of modsIn) {
    if (typeof m !== "string" || !m.trim()) {
      return { ok: false, error: "mod id must be a non-empty string", code: "invalid_mod_id" };
    }
    const id = m.trim();
    if (!isValidModId(id)) {
      return {
        ok: false,
        error: `mod id "${id}" must be namespaced (e.g. snake.mod.speed-extreme); short aliases are UI-only`,
        code: "invalid_mod_id",
      };
    }
    if (seen.has(id)) continue;
    seen.add(id);
    mods.push(id);
  }
  mods.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  /** @type {RunSpec} */
  const spec = { v: 1, game, channel, mods };

  if (raw.tip !== undefined && raw.tip !== null && raw.tip !== "") {
    const tip = String(raw.tip).trim();
    if (!TIP_RE.test(tip)) {
      return {
        ok: false,
        error: "tip must be alphanumeric (optional . -)",
        code: "invalid_tip",
      };
    }
    spec.tip = tip;
  }

  return { ok: true, hash: "", spec };
}

/**
 * Encode a RunSpec to canonical fa1_… hash.
 * Mods are sorted; same set ⇒ same hash.
 * @param {object} raw
 * @returns {EncodeOk | EncodeErr}
 */
export function encodeRunSpec(raw) {
  const norm = normalizeRunSpec(raw);
  if (!norm.ok) return norm;
  const { spec } = norm;
  let hash = `${RUN_HASH_PREFIX}${spec.game}_${spec.channel}`;
  if (spec.mods.length) {
    hash += `_${spec.mods.join("~")}`;
  }
  if (spec.tip) {
    hash += `_t${spec.tip}`;
  }
  return { ok: true, hash, spec };
}

/**
 * @param {string} hash
 * @returns {DecodeOk | DecodeErr}
 */
function decodeHash(hash) {
  const trimmed = hash.trim();
  if (!trimmed.startsWith(RUN_HASH_PREFIX)) {
    return {
      ok: false,
      error: `Run hash must start with ${RUN_HASH_PREFIX}`,
      code: "bad_prefix",
    };
  }
  const body = trimmed.slice(RUN_HASH_PREFIX.length);
  if (!body) {
    return { ok: false, error: "Empty run hash body", code: "empty" };
  }

  // Optional tip: trailing _t<tip>
  let tip;
  let main = body;
  const tipMatch = body.match(/^(.*)_t([a-zA-Z0-9][a-zA-Z0-9.-]*)$/);
  if (tipMatch) {
    main = tipMatch[1];
    tip = tipMatch[2];
  }

  // game_channel or game_channel_mods
  const first = main.indexOf("_");
  if (first <= 0) {
    return {
      ok: false,
      error: "Run hash missing game_channel segments",
      code: "bad_format",
    };
  }
  const game = main.slice(0, first);
  const rest = main.slice(first + 1);
  const second = rest.indexOf("_");
  let channel;
  let modsPart = "";
  if (second < 0) {
    channel = rest;
  } else {
    channel = rest.slice(0, second);
    modsPart = rest.slice(second + 1);
  }

  /** @type {object} */
  const raw = { v: 1, game, channel, mods: [] };
  if (tip) raw.tip = tip;
  if (modsPart) {
    if (modsPart.includes("_")) {
      return {
        ok: false,
        error: "Unexpected underscore in mods segment (use ~ between mod ids)",
        code: "bad_format",
      };
    }
    raw.mods = modsPart.split("~").filter(Boolean);
  }

  const norm = normalizeRunSpec(raw);
  if (!norm.ok) return norm;
  return { ok: true, spec: norm.spec, source: "hash" };
}

/**
 * Parse verbose query alias: channel=&mods= (also game=, tip=, v=).
 * Accepts querystring, URLSearchParams, or a plain object of string values.
 * @param {string | URLSearchParams | Record<string, string | string[] | undefined>} input
 * @returns {DecodeOk | DecodeErr}
 */
function decodeQuery(input) {
  /** @type {URLSearchParams} */
  let params;
  if (typeof input === "string") {
    let q = input.trim();
    if (q.startsWith("?")) q = q.slice(1);
    // Allow full relative URLs with query
    const qIdx = q.indexOf("?");
    if (qIdx >= 0) q = q.slice(qIdx + 1);
    params = new URLSearchParams(q);
  } else if (input instanceof URLSearchParams) {
    params = input;
  } else if (input && typeof input === "object") {
    params = new URLSearchParams();
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        for (const item of v) params.append(k, String(item));
      } else {
        params.set(k, String(v));
      }
    }
  } else {
    return { ok: false, error: "Unsupported query input", code: "invalid_query" };
  }

  const plain = Object.fromEntries(params.entries());
  const smuggle = rejectSmuggling(plain);
  if (smuggle) {
    return { ok: false, error: smuggle, code: "smuggling" };
  }

  for (const key of params.keys()) {
    if (FORBIDDEN_FIELDS.includes(key)) {
      return {
        ok: false,
        error: `Rejected smuggling field "${key}"`,
        code: "smuggling",
      };
    }
  }

  const game = params.get("game") || params.get("id") || "";
  const channel = params.get("channel") || "";
  const modsRaw = params.get("mods") || "";
  const tip = params.get("tip") || undefined;
  const vRaw = params.get("v");
  const v = vRaw === null || vRaw === "" ? 1 : Number(vRaw);

  if (!channel && !modsRaw && !game) {
    return {
      ok: false,
      error: "Verbose query needs at least channel= (and usually game= / mods=)",
      code: "empty_query",
    };
  }

  const raw = {
    v,
    game,
    channel,
    mods: modsRaw
      ? modsRaw
          .split(/[,~]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };
  if (tip) raw.tip = tip;

  const norm = normalizeRunSpec(raw);
  if (!norm.ok) return norm;
  return { ok: true, spec: norm.spec, source: "query" };
}

/**
 * Decode a fa1_… hash or verbose query alias into a RunSpec.
 * @param {string | URLSearchParams | Record<string, string | string[] | undefined>} hashOrQuery
 * @returns {DecodeOk | DecodeErr}
 */
export function decodeRunSpec(hashOrQuery) {
  if (hashOrQuery instanceof URLSearchParams) {
    return decodeQuery(hashOrQuery);
  }
  if (hashOrQuery && typeof hashOrQuery === "object") {
    return decodeQuery(hashOrQuery);
  }
  if (typeof hashOrQuery !== "string") {
    return {
      ok: false,
      error: "hashOrQuery must be a string, URLSearchParams, or object",
      code: "invalid_input",
    };
  }
  const trimmed = hashOrQuery.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty input", code: "empty" };
  }

  // Compact hash
  if (trimmed.startsWith(RUN_HASH_PREFIX) || trimmed.includes(`run=${RUN_HASH_PREFIX}`)) {
    // Allow ?run=fa1_… or &run=fa1_…
    const runParam = trimmed.match(/(?:^|[?&])run=(fa1_[^&#\s]+)/);
    if (runParam) {
      return decodeHash(decodeURIComponent(runParam[1]));
    }
    if (trimmed.startsWith(RUN_HASH_PREFIX)) {
      return decodeHash(trimmed);
    }
  }

  // Verbose query alias (channel= / mods=)
  if (
    trimmed.includes("channel=") ||
    trimmed.includes("mods=") ||
    trimmed.startsWith("?") ||
    trimmed.includes("?")
  ) {
    return decodeQuery(trimmed);
  }

  // Bare fa1 without recognizing — try hash anyway if it looks close
  if (/^fa\d+_/.test(trimmed)) {
    if (!trimmed.startsWith(RUN_HASH_PREFIX)) {
      return {
        ok: false,
        error: `Unsupported run-hash version prefix (expected ${RUN_HASH_PREFIX})`,
        code: "unsupported_version",
      };
    }
    return decodeHash(trimmed);
  }

  return {
    ok: false,
    error: "Unrecognized run hash or query (expected fa1_… or channel=&mods=)",
    code: "unrecognized",
  };
}

/**
 * Build a verbose query string alias for a RunSpec (debuggability).
 * Canonical share form remains encodeRunSpec → fa1_….
 * @param {object} raw
 * @returns {{ ok: true, query: string, spec: RunSpec } | EncodeErr}
 */
export function encodeVerboseQuery(raw) {
  const norm = normalizeRunSpec(raw);
  if (!norm.ok) return norm;
  const { spec } = norm;
  const params = new URLSearchParams();
  params.set("v", "1");
  params.set("game", spec.game);
  params.set("channel", spec.channel);
  if (spec.mods.length) params.set("mods", spec.mods.join(","));
  if (spec.tip) params.set("tip", spec.tip);
  return { ok: true, query: params.toString(), spec };
}

/**
 * Default Play button target from tile + artifact availability.
 *
 * Locked: best shipped train — stable + no mods when a real stable artifact
 * exists; otherwise unstable + [] and stub≠stable banner. Does not flip the
 * catalog tile.defaultChannel (that flips only when first real stable ships).
 *
 * @param {object} tile  GameTile-like ({ id, defaultChannel, channels, … })
 * @param {object} [artifacts]
 * @param {boolean} [artifacts.stable]  true when a real stable artifact is available
 * @param {boolean} [artifacts.hasStable]  alias of stable
 * @returns {{
 *   channel: ChannelId,
 *   mods: [],
 *   game: string,
 *   v: 1,
 *   banner: null | "stub-not-shipped-stable",
 *   catalogDefaultChannel: string | undefined
 * }}
 */
export function defaultPlayForTile(tile, artifacts = {}) {
  const game =
    tile && typeof tile.id === "string" && tile.id
      ? tile.id
      : tile && typeof tile.game === "string"
        ? tile.game
        : "unknown";
  const catalogDefaultChannel =
    tile && typeof tile.defaultChannel === "string"
      ? tile.defaultChannel
      : undefined;
  const stableShipped =
    artifacts.stable === true || artifacts.hasStable === true;

  if (stableShipped) {
    return {
      v: 1,
      game,
      channel: "stable",
      mods: [],
      banner: null,
      catalogDefaultChannel,
    };
  }

  return {
    v: 1,
    game,
    channel: "unstable",
    mods: [],
    banner: "stub-not-shipped-stable",
    catalogDefaultChannel,
  };
}

/** @deprecated Prefer defaultPlayForTile — alias for call-site clarity */
export const defaultPlay = defaultPlayForTile;
