import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  seedModsForGame,
  artifactsForTile,
  defaultPlayState,
  buildPlayHref,
  buildRunLink,
  planApplyRunSpec,
  decodePasteInput,
  resolveInitialRun,
  SNAKE_SEED_MODS,
} from "./play-run.js";
import { encodeRunSpec } from "./run-hash.js";

const snakeTile = {
  id: "snake",
  defaultChannel: "unstable",
  channels: ["unstable", "stable"],
  playHref: "/games/snake/",
};

describe("seedModsForGame", () => {
  it("returns namespaced Snake seed mods", () => {
    const mods = seedModsForGame("snake");
    assert.ok(mods.length >= 2);
    for (const m of mods) {
      assert.match(m.id, /^snake\.mod\./);
    }
    assert.equal(seedModsForGame("other").length, 0);
  });

  it("exports SNAKE_SEED_MODS catalog", () => {
    assert.equal(SNAKE_SEED_MODS[0].id, "snake.mod.skin-neon");
  });
});

describe("defaultPlayState / artifactsForTile", () => {
  it("Seed artifacts: unstable + stub banner, no mods", () => {
    const arts = artifactsForTile(snakeTile);
    assert.equal(arts.stable, false);
    const d = defaultPlayState(snakeTile);
    assert.equal(d.channel, "unstable");
    assert.deepEqual(d.mods, []);
    assert.equal(d.banner, "stub-not-shipped-stable");
  });
});

describe("buildPlayHref", () => {
  it("appends run=fa1_… to play href", () => {
    const r = buildPlayHref("/games/snake/", {
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
    });
    assert.equal(r.ok, true);
    assert.equal(
      r.href,
      "/games/snake/?run=fa1_snake_unstable_snake.mod.speed-extreme"
    );
    assert.equal(r.hash, "fa1_snake_unstable_snake.mod.speed-extreme");
  });

  it("replaces existing run param", () => {
    const r = buildPlayHref("/games/snake/?run=fa1_snake_stable", {
      game: "snake",
      channel: "unstable",
      mods: [],
    });
    assert.equal(r.ok, true);
    assert.equal(r.href, "/games/snake/?run=fa1_snake_unstable");
  });
});

describe("buildRunLink", () => {
  it("builds game page deep link with run=", () => {
    const r = buildRunLink("snake", {
      game: "snake",
      channel: "stable",
      mods: [],
    });
    assert.equal(r.ok, true);
    assert.equal(r.href, "/shopfront/game?id=snake&run=fa1_snake_stable");
  });
});

describe("planApplyRunSpec", () => {
  it("flags cross-game paste and builds navigate href", () => {
    const plan = planApplyRunSpec({
      currentGameId: "snake",
      spec: { v: 1, game: "pong", channel: "stable", mods: [] },
    });
    assert.equal(plan.needsCrossGameConfirm, true);
    assert.ok(plan.navigateHref?.includes("id=pong"));
    assert.ok(plan.navigateHref?.includes("run=fa1_pong_stable"));
    assert.ok(plan.messages.some((m) => /pong/.test(m)));
  });

  it("flags unstable confirm on same game", () => {
    const plan = planApplyRunSpec({
      currentGameId: "snake",
      spec: {
        v: 1,
        game: "snake",
        channel: "unstable",
        mods: ["snake.mod.skin-neon"],
      },
    });
    assert.equal(plan.needsCrossGameConfirm, false);
    assert.equal(plan.needsUnstableConfirm, true);
    assert.equal(plan.needsConflictConfirm, false);
    assert.deepEqual(plan.strippedSpec.mods, ["snake.mod.skin-neon"]);
  });

  it("flags unknown mods and strips them", () => {
    const plan = planApplyRunSpec({
      currentGameId: "snake",
      spec: {
        v: 1,
        game: "snake",
        channel: "stable",
        mods: ["snake.mod.skin-neon", "snake.mod.does-not-exist"],
      },
    });
    assert.equal(plan.needsConflictConfirm, true);
    assert.deepEqual(plan.unknownMods, ["snake.mod.does-not-exist"]);
    assert.deepEqual(plan.strippedSpec.mods, ["snake.mod.skin-neon"]);
  });

  it("flags channel-incompatible mods (speed-extreme on stable)", () => {
    const plan = planApplyRunSpec({
      currentGameId: "snake",
      spec: {
        v: 1,
        game: "snake",
        channel: "stable",
        mods: ["snake.mod.speed-extreme"],
      },
    });
    assert.equal(plan.needsConflictConfirm, true);
    assert.equal(plan.incompatibleMods.length, 1);
    assert.deepEqual(plan.strippedSpec.mods, []);
  });

  it("stable + known compatible mod needs no confirms", () => {
    const plan = planApplyRunSpec({
      currentGameId: "snake",
      spec: {
        v: 1,
        game: "snake",
        channel: "stable",
        mods: ["snake.mod.skin-neon"],
      },
    });
    assert.equal(plan.needsCrossGameConfirm, false);
    assert.equal(plan.needsUnstableConfirm, false);
    assert.equal(plan.needsConflictConfirm, false);
  });
});

describe("decodePasteInput", () => {
  it("decodes compact hash and verbose alias", () => {
    const a = decodePasteInput("fa1_snake_unstable_snake.mod.speed-extreme");
    assert.equal(a.ok, true);
    assert.equal(a.spec.channel, "unstable");
    const b = decodePasteInput(
      "game=snake&channel=unstable&mods=snake.mod.speed-extreme"
    );
    assert.equal(b.ok, true);
    assert.deepEqual(a.spec.mods, b.spec.mods);
  });
});

describe("resolveInitialRun", () => {
  it("defaults to Default Play when no run query", () => {
    const r = resolveInitialRun(snakeTile, "");
    assert.equal(r.source, "default");
    assert.equal(r.spec.channel, "unstable");
    assert.deepEqual(r.spec.mods, []);
    assert.equal(r.banner, "stub-not-shipped-stable");
  });

  it("picks up ?run=fa1_…", () => {
    const enc = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.skin-neon"],
    });
    assert.equal(enc.ok, true);
    const r = resolveInitialRun(snakeTile, `id=snake&run=${enc.hash}`);
    assert.equal(r.source, "url-run");
    assert.deepEqual(r.spec.mods, ["snake.mod.skin-neon"]);
  });

  it("picks up verbose channel=&mods=", () => {
    const r = resolveInitialRun(
      snakeTile,
      "id=snake&channel=stable&mods=snake.mod.skin-neon"
    );
    assert.equal(r.source, "url-verbose");
    assert.equal(r.spec.channel, "stable");
    assert.deepEqual(r.spec.mods, ["snake.mod.skin-neon"]);
  });
});
