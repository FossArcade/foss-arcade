/**
 * Local high-score table partitioned by canonical fa1_ run hash.
 * Offline-first; no accounts. Default play uses its own namespace.
 */

import { encodeRunSpec } from "../../../../shopfront/run-hash.js";

export const HISCORE_PREFIX = "foss-snake:hiscores:";
export const DEFAULT_LIMIT = 10;

/**
 * @param {object} rawSpec  RunSpec-like { game, channel, mods, tip? }
 * @returns {string} canonical fa1_… or fallback key
 */
export function hiscoreNamespace(rawSpec) {
  const enc = encodeRunSpec({
    v: 1,
    game: rawSpec?.game || "snake",
    channel: rawSpec?.channel || "unstable",
    mods: rawSpec?.mods || [],
    tip: rawSpec?.tip,
  });
  if (enc.ok) return enc.hash;
  const game = rawSpec?.game || "snake";
  const channel = rawSpec?.channel || "unstable";
  return `${game}:${channel}:invalid`;
}

/**
 * @param {string} namespace  fa1_… or opaque partition key
 */
export function storageKey(namespace) {
  return `${HISCORE_PREFIX}${namespace}`;
}

/**
 * @typedef {object} HiscoreEntry
 * @property {number} score
 * @property {number} length
 * @property {string} [seed]
 * @property {number} at  unix ms
 */

/**
 * @param {Storage | { getItem(k:string): string|null, setItem(k:string,v:string): void, removeItem(k:string): void }} store
 * @param {string} namespace
 * @returns {HiscoreEntry[]}
 */
export function loadHiscores(store, namespace) {
  if (!store) return [];
  try {
    const raw = store.getItem(storageKey(namespace));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e) =>
          e &&
          typeof e.score === "number" &&
          Number.isFinite(e.score) &&
          e.score >= 0
      )
      .map((e) => ({
        score: e.score,
        length: typeof e.length === "number" ? e.length : 0,
        seed: e.seed != null ? String(e.seed) : undefined,
        at: typeof e.at === "number" ? e.at : 0,
      }));
  } catch {
    return [];
  }
}

/**
 * @param {Storage | { getItem(k:string): string|null, setItem(k:string,v:string): void, removeItem(k:string): void }} store
 * @param {string} namespace
 * @param {HiscoreEntry[]} entries
 */
export function saveHiscores(store, namespace, entries) {
  if (!store) return;
  store.setItem(storageKey(namespace), JSON.stringify(entries));
}

/**
 * Insert a score into the namespaced table (highest first).
 * @param {Storage | { getItem(k:string): string|null, setItem(k:string,v:string): void, removeItem(k:string): void }} store
 * @param {string} namespace
 * @param {{ score: number, length?: number, seed?: string|number, at?: number }} entry
 * @param {number} [limit=DEFAULT_LIMIT]
 * @returns {HiscoreEntry[]}
 */
export function recordHiscore(store, namespace, entry, limit = DEFAULT_LIMIT) {
  const list = loadHiscores(store, namespace);
  const next = {
    score: entry.score,
    length: entry.length ?? 0,
    seed: entry.seed != null ? String(entry.seed) : undefined,
    at: entry.at ?? Date.now(),
  };
  list.push(next);
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.at || 0) - (a.at || 0);
  });
  const trimmed = list.slice(0, Math.max(1, limit));
  saveHiscores(store, namespace, trimmed);
  return trimmed;
}

/**
 * @param {Storage | { getItem(k:string): string|null, setItem(k:string,v:string): void, removeItem(k:string): void }} store
 * @param {string} namespace
 */
export function clearHiscores(store, namespace) {
  if (!store) return;
  store.removeItem(storageKey(namespace));
}

/** In-memory Storage stand-in for tests. */
export function memoryStore() {
  /** @type {Map<string, string>} */
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(String(k), String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}
