/**
 * Snake mod registry — mirrors games/snake/mods/<slug>/mod.yaml.
 * Browser-safe static catalog (no fs / YAML parser at runtime).
 * Node tests assert YAML files stay in sync with this module.
 *
 * @see docs/design/run-hash-deepen.md
 */

/**
 * @typedef {object} ModPack
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {"*" | readonly string[]} compatibleChannels
 * @property {readonly string[]} conflicts
 * @property {boolean} replacesPillars
 * @property {string} [designRev]
 * @property {{ tickMs?: number }} [sim]
 * @property {string} [skin]
 * @property {string} [notes]
 */

/** @type {readonly ModPack[]} */
export const SNAKE_MOD_REGISTRY = Object.freeze([
  Object.freeze({
    id: "snake.mod.skin-neon",
    title: "Neon skin",
    slug: "skin-neon",
    compatibleChannels: Object.freeze(["unstable", "stable"]),
    conflicts: Object.freeze([]),
    replacesPillars: false,
    designRev: "games/snake/DESIGN.md",
    sim: Object.freeze({}),
    skin: "neon",
    notes: "Visual-only pack; does not change simulation rules.",
  }),
  Object.freeze({
    id: "snake.mod.speed-extreme",
    title: "Speed extreme",
    slug: "speed-extreme",
    compatibleChannels: Object.freeze(["unstable"]),
    conflicts: Object.freeze([]),
    replacesPillars: false,
    designRev: "games/snake/DESIGN.md",
    sim: Object.freeze({ tickMs: 70 }),
    notes: "Optional hardcore pace pack (Seed — unstable-only until compat widens).",
  }),
]);

/**
 * @param {string} [gameId="snake"]
 * @returns {readonly ModPack[]}
 */
export function listModsForGame(gameId = "snake") {
  if (gameId !== "snake") return Object.freeze([]);
  return SNAKE_MOD_REGISTRY;
}

/**
 * @param {string} id
 * @returns {ModPack | undefined}
 */
export function getModById(id) {
  return SNAKE_MOD_REGISTRY.find((m) => m.id === id);
}

/**
 * Shelf / Play-tab shape (compatible with shopfront seedModsForGame).
 * @param {string} [gameId="snake"]
 */
export function seedModsForGame(gameId = "snake") {
  return listModsForGame(gameId).map((m) => {
    const channels = m.compatibleChannels;
    /** @type {"*" | string[]} */
    let compatibleChannels;
    if (channels === "*") {
      compatibleChannels = "*";
    } else if (
      Array.isArray(channels) &&
      channels.includes("unstable") &&
      channels.includes("stable") &&
      channels.length === 2
    ) {
      // Full train coverage → Play-tab treats as "*"
      compatibleChannels = "*";
    } else {
      compatibleChannels = [...channels];
    }
    return Object.freeze({
      id: m.id,
      label: m.title,
      compatibleChannels,
      conflicts: [...(m.conflicts || [])],
    });
  });
}

/**
 * Soft-resolve mod ids against the registry.
 * Known mods are applied; unknown ids are listed (soft-fail, never throw).
 * replacesPillars: true → hard refuse (returned in refused).
 *
 * @param {string[]} modIds
 * @param {string} [channel]
 * @returns {{
 *   applied: ModPack[],
 *   unknown: string[],
 *   incompatible: { id: string, reason: string }[],
 *   refused: { id: string, reason: string }[],
 * }}
 */
export function resolveMods(modIds, channel) {
  /** @type {ModPack[]} */
  const applied = [];
  /** @type {string[]} */
  const unknown = [];
  /** @type {{ id: string, reason: string }[]} */
  const incompatible = [];
  /** @type {{ id: string, reason: string }[]} */
  const refused = [];

  const seen = new Set();
  for (const raw of modIds || []) {
    const id = String(raw || "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const mod = getModById(id);
    if (!mod) {
      unknown.push(id);
      continue;
    }
    if (mod.replacesPillars) {
      refused.push({
        id,
        reason: "replacesPillars — must be a variant, not a mod",
      });
      continue;
    }
    if (channel && mod.compatibleChannels !== "*") {
      const ok =
        Array.isArray(mod.compatibleChannels) &&
        mod.compatibleChannels.includes(channel);
      if (!ok) {
        incompatible.push({
          id,
          reason: `not compatible with channel "${channel}"`,
        });
        continue;
      }
    }
    applied.push(mod);
  }

  return { applied, unknown, incompatible, refused };
}

/**
 * Merge applied packs into createGame opts (+ skin for renderer).
 * @param {ModPack[]} packs
 * @param {object} [baseOpts]
 */
export function mergeModEffects(packs, baseOpts = {}) {
  const opts = { ...baseOpts };
  let skin = opts.skin || null;
  for (const pack of packs) {
    if (pack.sim && typeof pack.sim.tickMs === "number") {
      opts.tickMs = pack.sim.tickMs;
    }
    if (pack.skin) skin = pack.skin;
  }
  return { opts, skin };
}
