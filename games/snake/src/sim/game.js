/**
 * Foss Snake — pure simulation.
 * No DOM, no canvas. Same seed + same inputs => same outcome.
 */

import { createRng } from "./rng.js";

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export const DEFAULTS = {
  width: 16,
  height: 12,
  tickMs: 140,
  startLength: 3,
};

export function cellKey(x, y) {
  return `${x},${y}`;
}

function cloneSnake(snake) {
  return snake.map((c) => ({ x: c.x, y: c.y }));
}

function occupiedSet(snake) {
  const set = new Set();
  for (const c of snake) set.add(cellKey(c.x, c.y));
  return set;
}

function emptyCells(state) {
  const taken = occupiedSet(state.snake);
  const cells = [];
  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      if (!taken.has(cellKey(x, y))) cells.push({ x, y });
    }
  }
  return cells;
}

/**
 * Deterministic fruit pick among empty cells. Returns null if the board is full.
 */
export function placeFruit(state) {
  const cells = emptyCells(state);
  if (cells.length === 0) return null;
  return cells[state.rng.int(cells.length)];
}

function defaultSnake(width, height, startLength) {
  const len = Math.max(1, Math.min(startLength, width));
  const y = Math.floor(height / 2);
  const headX = Math.min(len, width) - 1;
  const snake = [];
  for (let i = 0; i < len; i++) {
    snake.push({ x: headX - i, y });
  }
  return snake;
}

/**
 * Create a new run.
 * @param {object} [opts]
 * @param {number} [opts.width]
 * @param {number} [opts.height]
 * @param {number|string} [opts.seed]
 * @param {number|null} [opts.winLength] fill-board when null/undefined
 * @param {number} [opts.startLength]
 * @param {string} [opts.dir]
 * @param {Array<{x:number,y:number}>} [opts.snake]
 * @param {{x:number,y:number}|null} [opts.fruit]
 * @param {number} [opts.tickMs]
 */
export function createGame(opts = {}) {
  const width = opts.width ?? DEFAULTS.width;
  const height = opts.height ?? DEFAULTS.height;
  const startLength = opts.startLength ?? DEFAULTS.startLength;
  const seed = opts.seed ?? 1;
  const rng = createRng(seed);
  const snake = opts.snake ? cloneSnake(opts.snake) : defaultSnake(width, height, startLength);
  const boardCells = width * height;
  const winLength = opts.winLength == null ? boardCells : opts.winLength;

  const state = {
    width,
    height,
    seed,
    tickMs: opts.tickMs ?? DEFAULTS.tickMs,
    snake,
    dir: opts.dir ?? "right",
    queued: null,
    fruit: null,
    score: 0,
    status: "playing",
    ticks: 0,
    winLength,
    rng,
  };

  if (opts.fruit === null) {
    state.fruit = null;
  } else if (opts.fruit) {
    state.fruit = { x: opts.fruit.x, y: opts.fruit.y };
  } else {
    state.fruit = placeFruit(state);
  }

  maybeWin(state);
  return state;
}

function maybeWin(state) {
  if (state.status !== "playing" && state.status !== "paused") return;
  if (state.snake.length >= state.winLength) {
    state.status = "won";
    state.queued = null;
  }
}

/**
 * Queue at most one facing for the next tick. 180° reverse into self is ignored.
 */
export function queueDir(state, dir) {
  if (!DIRS[dir]) return false;
  if (state.status === "lost" || state.status === "won") return false;
  if (OPPOSITE[state.dir] === dir) return false;
  state.queued = dir;
  return true;
}

export function pause(state) {
  if (state.status !== "playing") return;
  state.status = "paused";
}

export function resume(state) {
  if (state.status !== "paused") return;
  state.status = "playing";
}

export function togglePause(state) {
  if (state.status === "playing") pause(state);
  else if (state.status === "paused") resume(state);
}

/**
 * Advance one cell. No-op when paused / over.
 */
export function tick(state) {
  if (state.status !== "playing") return state;

  if (state.queued && OPPOSITE[state.dir] !== state.queued) {
    state.dir = state.queued;
  }
  state.queued = null;

  const step = DIRS[state.dir];
  const head = state.snake[0];
  const next = { x: head.x + step.x, y: head.y + step.y };

  if (next.x < 0 || next.y < 0 || next.x >= state.width || next.y >= state.height) {
    state.status = "lost";
    state.ticks += 1;
    return state;
  }

  const eating = state.fruit && next.x === state.fruit.x && next.y === state.fruit.y;
  const body = eating ? state.snake : state.snake.slice(0, -1);
  for (const c of body) {
    if (c.x === next.x && c.y === next.y) {
      state.status = "lost";
      state.ticks += 1;
      return state;
    }
  }

  state.snake.unshift(next);
  if (eating) {
    state.score += 1;
    state.fruit = placeFruit(state);
    maybeWin(state);
  } else {
    state.snake.pop();
  }

  state.ticks += 1;
  return state;
}

/** Replay-friendly snapshot (no RNG object). */
export function snapshot(state) {
  return {
    width: state.width,
    height: state.height,
    seed: state.seed,
    snake: cloneSnake(state.snake),
    dir: state.dir,
    queued: state.queued,
    fruit: state.fruit ? { x: state.fruit.x, y: state.fruit.y } : null,
    score: state.score,
    status: state.status,
    ticks: state.ticks,
    winLength: state.winLength,
    rngState: state.rng.getState(),
  };
}

export function sameBoard(a, b) {
  return JSON.stringify(snapshot(a)) === JSON.stringify(snapshot(b));
}

export function restart(opts = {}) {
  return createGame(opts);
}
