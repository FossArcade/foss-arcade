import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hiscoreNamespace,
  storageKey,
  loadHiscores,
  recordHiscore,
  clearHiscores,
  memoryStore,
  HISCORE_PREFIX,
} from "../src/hiscore/storage.js";
import { defaultSnakePlay } from "../src/run/apply-run.js";

describe("hiscore namespace", () => {
  it("partitions by canonical fa1_ hash", () => {
    const def = defaultSnakePlay();
    const ns = hiscoreNamespace(def);
    assert.equal(ns, "fa1_snake_unstable");
    assert.equal(storageKey(ns), `${HISCORE_PREFIX}fa1_snake_unstable`);
  });

  it("keeps default play separate from modded runs", () => {
    const a = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: [],
    });
    const b = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
    });
    const c = hiscoreNamespace({
      game: "snake",
      channel: "stable",
      mods: [],
    });
    assert.equal(a, "fa1_snake_unstable");
    assert.equal(b, "fa1_snake_unstable_snake.mod.speed-extreme");
    assert.equal(c, "fa1_snake_stable");
    assert.notEqual(a, b);
    assert.notEqual(a, c);
  });

  it("sorts mods so namespace is order-independent", () => {
    const a = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme", "snake.mod.skin-neon"],
    });
    const b = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.skin-neon", "snake.mod.speed-extreme"],
    });
    assert.equal(a, b);
  });
});

describe("hiscore storage", () => {
  it("records and loads top scores per namespace", () => {
    const store = memoryStore();
    const ns = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: [],
    });
    recordHiscore(store, ns, { score: 3, length: 6, seed: 1, at: 100 });
    recordHiscore(store, ns, { score: 10, length: 13, seed: 2, at: 200 });
    recordHiscore(store, ns, { score: 5, length: 8, seed: 3, at: 150 });
    const list = loadHiscores(store, ns);
    assert.equal(list.length, 3);
    assert.equal(list[0].score, 10);
    assert.equal(list[1].score, 5);
    assert.equal(list[2].score, 3);
  });

  it("does not leak scores across run hashes", () => {
    const store = memoryStore();
    const def = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: [],
    });
    const modded = hiscoreNamespace({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
    });
    recordHiscore(store, def, { score: 99, length: 20, seed: "a" });
    recordHiscore(store, modded, { score: 1, length: 4, seed: "b" });
    assert.equal(loadHiscores(store, def)[0].score, 99);
    assert.equal(loadHiscores(store, modded)[0].score, 1);
    assert.equal(loadHiscores(store, def).length, 1);
  });

  it("clear empties one namespace only", () => {
    const store = memoryStore();
    const a = "fa1_snake_unstable";
    const b = "fa1_snake_stable";
    recordHiscore(store, a, { score: 1, length: 3 });
    recordHiscore(store, b, { score: 2, length: 4 });
    clearHiscores(store, a);
    assert.deepEqual(loadHiscores(store, a), []);
    assert.equal(loadHiscores(store, b)[0].score, 2);
  });
});
