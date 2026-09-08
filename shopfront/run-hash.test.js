import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  encodeRunSpec,
  decodeRunSpec,
  encodeVerboseQuery,
  defaultPlayForTile,
  isValidModId,
  FORBIDDEN_FIELDS,
  RUN_HASH_PREFIX,
} from "./run-hash.js";

describe("isValidModId", () => {
  it("accepts namespaced ids", () => {
    assert.equal(isValidModId("snake.mod.speed-extreme"), true);
    assert.equal(isValidModId("snake.mod.skin-neon"), true);
    assert.equal(isValidModId("pong.pack.extra.fruit"), true);
  });

  it("rejects short aliases (UI-only)", () => {
    assert.equal(isValidModId("speed-extreme"), false);
    assert.equal(isValidModId("snake.mod"), false);
    assert.equal(isValidModId("Snake.mod.speed"), false);
  });
});

describe("encodeRunSpec", () => {
  it("encodes stable with no mods", () => {
    const r = encodeRunSpec({ game: "snake", channel: "stable", mods: [] });
    assert.equal(r.ok, true);
    assert.equal(r.hash, "fa1_snake_stable");
    assert.deepEqual(r.spec.mods, []);
  });

  it("sorts mod ids for deterministic hash", () => {
    const a = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.skin-neon", "snake.mod.speed-extreme"],
    });
    const b = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme", "snake.mod.skin-neon"],
    });
    assert.equal(a.ok && b.ok, true);
    assert.equal(a.hash, b.hash);
    assert.equal(
      a.hash,
      "fa1_snake_unstable_snake.mod.skin-neon~snake.mod.speed-extreme"
    );
    assert.deepEqual(a.spec.mods, [
      "snake.mod.skin-neon",
      "snake.mod.speed-extreme",
    ]);
  });

  it("appends optional tip", () => {
    const r = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
      tip: "3a1b2c",
    });
    assert.equal(r.ok, true);
    assert.equal(
      r.hash,
      "fa1_snake_unstable_snake.mod.speed-extreme_t3a1b2c"
    );
  });

  it("rejects short mod aliases", () => {
    const r = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["speed-extreme"],
    });
    assert.equal(r.ok, false);
    assert.equal(r.code, "invalid_mod_id");
  });

  it("rejects pillar/variant smuggling fields", () => {
    for (const field of ["variant", "pillars", "replacesPillars"]) {
      const r = encodeRunSpec({
        game: "snake",
        channel: "stable",
        mods: [],
        [field]: "nope",
      });
      assert.equal(r.ok, false);
      assert.equal(r.code, "smuggling");
    }
    assert.ok(FORBIDDEN_FIELDS.includes("variant"));
  });
});

describe("decodeRunSpec hash", () => {
  it("round-trips encode → decode", () => {
    const cases = [
      { game: "snake", channel: "stable", mods: [] },
      {
        game: "snake",
        channel: "unstable",
        mods: ["snake.mod.speed-extreme", "snake.mod.skin-neon"],
      },
      {
        game: "snake",
        channel: "unstable",
        mods: ["snake.mod.speed-extreme"],
        tip: "abc123",
      },
      { game: "snake", channel: "season-1", mods: [] },
    ];
    for (const raw of cases) {
      const enc = encodeRunSpec(raw);
      assert.equal(enc.ok, true, enc.error);
      const dec = decodeRunSpec(enc.hash);
      assert.equal(dec.ok, true, dec.error);
      assert.equal(dec.source, "hash");
      assert.deepEqual(dec.spec, enc.spec);
    }
  });

  it("decodes run= query param wrapper", () => {
    const dec = decodeRunSpec(
      "/shopfront/game?id=snake&run=fa1_snake_unstable_snake.mod.speed-extreme"
    );
    assert.equal(dec.ok, true, dec.error);
    assert.equal(dec.spec.game, "snake");
    assert.equal(dec.spec.channel, "unstable");
    assert.deepEqual(dec.spec.mods, ["snake.mod.speed-extreme"]);
  });

  it("rejects unsupported fa2_ prefix", () => {
    const dec = decodeRunSpec("fa2_snake_stable");
    assert.equal(dec.ok, false);
    assert.equal(dec.code, "unsupported_version");
  });
});

describe("decodeRunSpec verbose query alias", () => {
  it("accepts channel=&mods= query string", () => {
    const dec = decodeRunSpec(
      "game=snake&channel=unstable&mods=snake.mod.speed-extreme,snake.mod.skin-neon"
    );
    assert.equal(dec.ok, true, dec.error);
    assert.equal(dec.source, "query");
    assert.equal(dec.spec.game, "snake");
    assert.equal(dec.spec.channel, "unstable");
    assert.deepEqual(dec.spec.mods, [
      "snake.mod.skin-neon",
      "snake.mod.speed-extreme",
    ]);
  });

  it("accepts URLSearchParams", () => {
    const params = new URLSearchParams({
      game: "snake",
      channel: "stable",
      mods: "",
    });
    const dec = decodeRunSpec(params);
    assert.equal(dec.ok, true, dec.error);
    assert.equal(dec.spec.channel, "stable");
    assert.deepEqual(dec.spec.mods, []);
  });

  it("accepts plain object alias", () => {
    const dec = decodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: "snake.mod.speed-extreme",
    });
    assert.equal(dec.ok, true, dec.error);
    assert.deepEqual(dec.spec.mods, ["snake.mod.speed-extreme"]);
  });

  it("rejects smuggling in verbose query", () => {
    const dec = decodeRunSpec(
      "game=snake&channel=stable&variant=hardcore&mods="
    );
    assert.equal(dec.ok, false);
    assert.equal(dec.code, "smuggling");
  });

  it("verbose encode ↔ decode round-trip", () => {
    const enc = encodeVerboseQuery({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
      tip: "deadbeef",
    });
    assert.equal(enc.ok, true);
    const dec = decodeRunSpec(enc.query);
    assert.equal(dec.ok, true, dec.error);
    assert.deepEqual(dec.spec, enc.spec);
  });

  it("hash and verbose alias yield the same RunSpec", () => {
    const raw = {
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.skin-neon", "snake.mod.speed-extreme"],
    };
    const hash = encodeRunSpec(raw);
    const verbose = encodeVerboseQuery(raw);
    assert.equal(hash.ok && verbose.ok, true);
    const fromHash = decodeRunSpec(hash.hash);
    const fromQuery = decodeRunSpec(verbose.query);
    assert.deepEqual(fromHash.spec, fromQuery.spec);
  });
});

describe("defaultPlayForTile", () => {
  const snakeTile = {
    id: "snake",
    defaultChannel: "unstable",
    channels: ["unstable", "stable"],
  };

  it("uses unstable + stub banner when stable artifact missing", () => {
    const d = defaultPlayForTile(snakeTile, { stable: false });
    assert.equal(d.channel, "unstable");
    assert.deepEqual(d.mods, []);
    assert.equal(d.banner, "stub-not-shipped-stable");
    assert.equal(d.catalogDefaultChannel, "unstable");
    assert.equal(d.game, "snake");
  });

  it("uses stable + no mods when stable artifact exists", () => {
    const d = defaultPlayForTile(snakeTile, { hasStable: true });
    assert.equal(d.channel, "stable");
    assert.deepEqual(d.mods, []);
    assert.equal(d.banner, null);
    // catalog may still say unstable until maintainers flip it
    assert.equal(d.catalogDefaultChannel, "unstable");
  });

  it("does not invent mods for Default Play", () => {
    const d = defaultPlayForTile(snakeTile, {});
    assert.deepEqual(d.mods, []);
    assert.equal(d.v, 1);
  });
});

describe("prefix constant", () => {
  it("exports fa1_ prefix", () => {
    assert.equal(RUN_HASH_PREFIX, "fa1_");
  });
});
