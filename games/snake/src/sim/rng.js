/**
 * Seeded PRNG for Foss Snake.
 * Same seed + same call sequence => same numbers (sim contract).
 */

/**
 * Normalize a seed (number or string) to a 32-bit unsigned int.
 * @param {number|string|undefined} seed
 * @returns {number}
 */
export function normalizeSeed(seed) {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return seed >>> 0;
  }
  const text = seed == null || seed === "" ? "1" : String(seed);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 — tiny, deterministic, good enough for fruit placement.
 * @param {number|string} [seed=1]
 */
export function createRng(seed = 1) {
  const original = seed;
  let s = normalizeSeed(seed);
  if (s === 0) s = 1;

  function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    seed: original,
    seedValue: normalizeSeed(seed) || 1,
    next,
    int(n) {
      const span = Number(n);
      if (!Number.isFinite(span) || span <= 0) return 0;
      return Math.floor(next() * span);
    },
    getState() {
      return s;
    },
    setState(value) {
      s = value >>> 0;
    },
    clone() {
      const copy = createRng(original);
      copy.setState(s);
      return copy;
    },
  };
}
