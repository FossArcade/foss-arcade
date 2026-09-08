import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveSnakeRun,
  defaultSnakePlay,
  formatRunChip,
} from "../src/run/apply-run.js";
import {
  SNAKE_MOD_REGISTRY,
  getModById,
  resolveMods,
  mergeModEffects,
  seedModsForGame,
  listModsForGame,
} from "../mods/registry.js";
import { createGame, tick } from "../src/sim/game.js";
import { encodeRunSpec } from "../../../shopfront/run-hash.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modsRoot = join(__dirname, "../mods");

describe("defaultSnakePlay", () => {
  it("Seed default is unstable + [] with stub banner", () => {
    const d = defaultSnakePlay();
    assert.equal(d.game, "snake");
    assert.equal(d.channel, "unstable");
    assert.deepEqual(d.mods, []);
    assert.equal(d.banner, "stub-not-shipped-stable");
  });

  it("uses stable + [] when stable artifact exists", () => {
    const d = defaultSnakePlay({ stable: true, hasStable: true });
    assert.equal(d.channel, "stable");
    assert.deepEqual(d.mods, []);
    assert.equal(d.banner, null);
  });
});

describe("resolveSnakeRun", () => {
  it("default path (no query) is stable Default Play behavior", () => {
    const r = resolveSnakeRun("");
    assert.equal(r.source, "default");
    assert.equal(r.spec.channel, "unstable");
    assert.deepEqual(r.spec.mods, []);
    assert.equal(r.hash, "fa1_snake_unstable");
    assert.equal(r.applied.length, 0);
    assert.equal(r.decodeError, null);
  });

  it("applies known speed-extreme from ?run=", () => {
    const r = resolveSnakeRun(
      "?run=fa1_snake_unstable_snake.mod.speed-extreme"
    );
    assert.equal(r.source, "url-run");
    assert.equal(r.spec.channel, "unstable");
    assert.deepEqual(r.spec.mods, ["snake.mod.speed-extreme"]);
    assert.equal(r.applied.length, 1);
    assert.equal(r.applied[0].id, "snake.mod.speed-extreme");
    assert.equal(r.gameOpts.tickMs, 70);
    assert.deepEqual(r.unknownMods, []);
  });

  it("applies verbose channel=&mods= alias", () => {
    const r = resolveSnakeRun(
      "channel=unstable&mods=snake.mod.speed-extreme&game=snake"
    );
    assert.equal(r.source, "url-verbose");
    assert.equal(r.gameOpts.tickMs, 70);
  });

  it("soft-fails unknown mods without breaking known ones", () => {
    const r = resolveSnakeRun({
      run: "fa1_snake_unstable_snake.mod.no-such~snake.mod.speed-extreme",
    });
    // encode sorts mods; decode keeps them sorted
    assert.ok(r.unknownMods.includes("snake.mod.no-such"));
    assert.equal(r.applied.some((m) => m.id === "snake.mod.speed-extreme"), true);
    assert.equal(r.gameOpts.tickMs, 70);
  });

  it("marks speed-extreme incompatible on stable channel", () => {
    const r = resolveSnakeRun("?run=fa1_snake_stable_snake.mod.speed-extreme");
    assert.equal(r.spec.channel, "stable");
    assert.ok(r.incompatibleMods.some((m) => m.id === "snake.mod.speed-extreme"));
    assert.equal(r.applied.length, 0);
    assert.equal(r.gameOpts.tickMs, undefined);
  });

  it("applies neon skin without changing tickMs", () => {
    const r = resolveSnakeRun("?run=fa1_snake_unstable_snake.mod.skin-neon");
    assert.equal(r.skin, "neon");
    assert.equal(r.gameOpts.tickMs, undefined);
  });

  it("formatRunChip uses human labels", () => {
    const def = resolveSnakeRun("");
    assert.equal(formatRunChip(def.spec, def.applied), "Early build");
    const r = resolveSnakeRun(
      "?run=fa1_snake_unstable_snake.mod.speed-extreme"
    );
    assert.match(formatRunChip(r.spec, r.applied), /Unstable/);
    assert.match(formatRunChip(r.spec, r.applied), /1 extra/);
  });
});

describe("mod effects on sim", () => {
  it("speed-extreme creates a faster tickMs game", () => {
    const { applied } = resolveMods(["snake.mod.speed-extreme"], "unstable");
    const { opts } = mergeModEffects(applied, { seed: 1 });
    const g = createGame(opts);
    assert.equal(g.tickMs, 70);
    tick(g);
    assert.equal(g.status, "playing");
  });
});

describe("registry ↔ mod.yaml", () => {
  it("lists snake mods with namespaced ids", () => {
    const mods = listModsForGame("snake");
    assert.ok(mods.length >= 1);
    assert.ok(getModById("snake.mod.speed-extreme"));
    assert.equal(listModsForGame("other").length, 0);
  });

  it("seedModsForGame matches Play-tab shape", () => {
    const seed = seedModsForGame("snake");
    const extreme = seed.find((m) => m.id === "snake.mod.speed-extreme");
    assert.ok(extreme);
    assert.deepEqual(extreme.compatibleChannels, ["unstable"]);
    const neon = seed.find((m) => m.id === "snake.mod.skin-neon");
    assert.equal(neon.compatibleChannels, "*");
  });

  it("each registry entry has a matching mod.yaml id", () => {
    for (const pack of SNAKE_MOD_REGISTRY) {
      const yamlPath = join(modsRoot, pack.slug, "mod.yaml");
      assert.equal(existsSync(yamlPath), true, `missing ${yamlPath}`);
      const text = readFileSync(yamlPath, "utf8");
      assert.match(text, new RegExp(`^id:\\s*${pack.id.replace(/\./g, "\\.")}\\s*$`, "m"));
      assert.match(text, /^title:/m);
      assert.match(text, /^compatibleChannels:/m);
      assert.match(text, /replacesPillars:\s*false/);
    }
  });

  it("every mods/*/mod.yaml slug is registered", () => {
    const dirs = readdirSync(modsRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const slug of dirs) {
      const yamlPath = join(modsRoot, slug, "mod.yaml");
      assert.equal(existsSync(yamlPath), true);
      const text = readFileSync(yamlPath, "utf8");
      const idMatch = /^id:\s*(\S+)\s*$/m.exec(text);
      assert.ok(idMatch, `id missing in ${slug}`);
      const pack = getModById(idMatch[1]);
      assert.ok(pack, `registry missing ${idMatch[1]}`);
      assert.equal(pack.slug, slug);
    }
  });
});

describe("canonical hash lock", () => {
  it("encodes speed-extreme run as documented", () => {
    const enc = encodeRunSpec({
      game: "snake",
      channel: "unstable",
      mods: ["snake.mod.speed-extreme"],
    });
    assert.equal(enc.ok, true);
    assert.equal(enc.hash, "fa1_snake_unstable_snake.mod.speed-extreme");
  });
});
