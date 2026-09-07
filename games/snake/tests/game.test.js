import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  tick,
  queueDir,
  pause,
  resume,
  snapshot,
  sameBoard,
  placeFruit,
} from "../src/sim/game.js";
import { createRng, normalizeSeed } from "../src/sim/rng.js";

function play(state, dirs = []) {
  for (const dir of dirs) {
    if (dir) queueDir(state, dir);
    tick(state);
  }
  return state;
}

describe("movement", () => {
  it("advances one cell per tick in the facing direction", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 1,
      snake: [
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      fruit: { x: 7, y: 7 },
      dir: "right",
    });
    tick(g);
    assert.deepEqual(g.snake[0], { x: 4, y: 4 });
    assert.equal(g.snake.length, 3);
    assert.equal(g.ticks, 1);
    assert.equal(g.status, "playing");
  });

  it("applies a queued turn on the next tick", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 1,
      snake: [
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      fruit: { x: 7, y: 7 },
      dir: "right",
    });
    queueDir(g, "up");
    tick(g);
    assert.equal(g.dir, "up");
    assert.deepEqual(g.snake[0], { x: 3, y: 3 });
    assert.equal(g.queued, null);
  });

  it("ignores a 180 reverse into self", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 1,
      snake: [
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      fruit: { x: 7, y: 7 },
      dir: "right",
    });
    const accepted = queueDir(g, "left");
    assert.equal(accepted, false);
    assert.equal(g.queued, null);
    tick(g);
    assert.equal(g.dir, "right");
    assert.deepEqual(g.snake[0], { x: 4, y: 4 });
  });
});

describe("growth", () => {
  it("grows and scores when the head eats fruit", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 42,
      snake: [
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      fruit: { x: 4, y: 4 },
      dir: "right",
    });
    tick(g);
    assert.equal(g.score, 1);
    assert.equal(g.snake.length, 4);
    assert.deepEqual(g.snake[0], { x: 4, y: 4 });
    assert.ok(g.fruit);
    assert.notEqual(`${g.fruit.x},${g.fruit.y}`, "4,4");
  });

  it("never places the next fruit on the snake", () => {
    const g = createGame({
      width: 6,
      height: 4,
      seed: 99,
      snake: [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      fruit: { x: 3, y: 1 },
      dir: "right",
    });
    tick(g);
    const body = new Set(g.snake.map((c) => `${c.x},${c.y}`));
    assert.ok(g.fruit);
    assert.equal(body.has(`${g.fruit.x},${g.fruit.y}`), false);
  });
});

describe("collision", () => {
  it("loses when the head hits a wall", () => {
    const g = createGame({
      width: 4,
      height: 4,
      seed: 1,
      snake: [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ],
      fruit: { x: 0, y: 0 },
      dir: "right",
    });
    tick(g);
    assert.equal(g.status, "lost");
  });

  it("loses when the head hits the body", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 1,
      snake: [
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ],
      fruit: { x: 7, y: 7 },
      dir: "left",
    });
    tick(g);
    assert.equal(g.status, "lost");
    assert.deepEqual(g.snake[0], { x: 2, y: 1 });
  });
});

describe("determinism", () => {
  it("same seed and inputs produce the same board", () => {
    const inputs = ["up", null, "right", null, "down", null, "right", null, "up"];
    const a = createGame({ width: 10, height: 8, seed: 2026, startLength: 3 });
    const b = createGame({ width: 10, height: 8, seed: 2026, startLength: 3 });
    play(a, inputs);
    play(b, inputs);
    assert.equal(sameBoard(a, b), true);
    assert.deepEqual(snapshot(a).snake, snapshot(b).snake);
    assert.deepEqual(snapshot(a).fruit, snapshot(b).fruit);
  });

  it("seeded RNG is stable and placeFruit stays on empty cells", () => {
    const rng = createRng(7);
    const seq = [rng.next(), rng.next(), rng.int(10)];
    const again = createRng(7);
    assert.deepEqual([again.next(), again.next(), again.int(10)], seq);
    assert.equal(normalizeSeed(7), 7);
    const g = createGame({ width: 5, height: 5, seed: 7 });
    const fruit = placeFruit(g);
    const body = new Set(g.snake.map((c) => `${c.x},${c.y}`));
    assert.ok(fruit);
    assert.equal(body.has(`${fruit.x},${fruit.y}`), false);
  });
});

describe("win / pause", () => {
  it("wins when the snake reaches winLength", () => {
    const g = createGame({
      width: 6,
      height: 4,
      seed: 3,
      winLength: 4,
      snake: [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      fruit: { x: 3, y: 1 },
      dir: "right",
    });
    tick(g);
    assert.equal(g.snake.length, 4);
    assert.equal(g.status, "won");
    assert.equal(g.score, 1);
  });

  it("pause does not advance the simulation", () => {
    const g = createGame({
      width: 8,
      height: 8,
      seed: 1,
      snake: [
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      fruit: { x: 7, y: 7 },
      dir: "right",
    });
    pause(g);
    const before = snapshot(g);
    tick(g);
    tick(g);
    assert.equal(g.status, "paused");
    assert.deepEqual(snapshot(g).snake, before.snake);
    assert.equal(g.ticks, before.ticks);
    resume(g);
    tick(g);
    assert.equal(g.status, "playing");
    assert.deepEqual(g.snake[0], { x: 4, y: 4 });
  });
});
