import { describe, it } from "node:test";
import assert from "node:assert";
import {
  games,
  getGameById,
  sortedGames,
  sortedPlayableGames,
  sortedPlatformTiles,
  computePopularScore,
  playerFacingTags,
  isPlatformMetaTile,
} from "./games.js";
import { isBriefReady, exportBriefReady } from "./brief-export.js";
import { BRIEF_READY_SNAKE_WRAP } from "./fixtures/seed-briefs.js";
import { createGitHubDiscussionsPort } from "./github-discussions-port.js";
import { renderPromoteSection, runExport, getSeedBriefFixture } from "./brief-export-ui.js";

describe("catalog meta tile", () => {
  it("lists platform-meta as an honest non-game", () => {
    const meta = getGameById("platform-meta");
    assert.ok(meta);
    assert.equal(meta.kind, "platform-meta");
    assert.equal(meta.playable, false);
    assert.ok(meta.badgeHints.includes("platform-meta"));
    assert.ok(meta.badgeHints.includes("not-a-game"));
    assert.equal(meta.playHref, "");
    assert.ok(meta.community.discussionsHref.includes("/discussions/categories/meta"));
    assert.equal(meta.forumPortMeta.port, "github-discussions");
    assert.equal(meta.placeholder, false);
    assert.ok(isPlatformMetaTile(meta));
    assert.match(meta.summary, /not a game/i);
    assert.doesNotMatch(meta.summary, /ForumPort/);
  });

  it("keeps snake playable and sorts both listings", () => {
    const snake = getGameById("snake");
    assert.ok(snake);
    assert.notEqual(snake.playable, false);
    assert.ok(snake.playHref.includes("snake"));
    const ordered = sortedGames();
    assert.ok(ordered.length >= 2);
    assert.ok(ordered.every((g) => typeof g.sort.popularScore === "number"));
    assert.ok(computePopularScore(snake) > 0);
  });

  it("sorts playable Snake before Platform Meta", () => {
    const ordered = sortedGames();
    const ids = ordered.map((g) => g.id);
    assert.ok(ids.indexOf("snake") < ids.indexOf("platform-meta"));
    assert.equal(ordered[0].id, "snake");
    assert.equal(sortedPlayableGames()[0].id, "snake");
    assert.ok(sortedPlatformTiles().every((g) => g.kind === "platform-meta"));
    assert.ok(
      computePopularScore(getGameById("snake")) >
        computePopularScore(getGameById("platform-meta"))
    );
  });

  it("exposes player-facing tags only on cards", () => {
    const snake = getGameById("snake");
    const visible = playerFacingTags(snake.tags);
    assert.deepEqual(visible, ["all-ages", "web", "classic"]);
    assert.ok(!visible.includes("harness-prover"));
    const meta = getGameById("platform-meta");
    assert.deepEqual(playerFacingTags(meta.tags), ["all-ages"]);
  });

  it("uses optional Reddit label copy", () => {
    const snake = getGameById("snake");
    assert.equal(snake.community.subredditLabel, "Chat on Reddit (optional)");
  });
});

describe("ForumPort exportBrief + promote UI", () => {
  it("port exportBrief returns md + targetYaml via brief-export", async () => {
    const port = createGitHubDiscussionsPort();
    const out = await port.exportBrief("fixture-snake-wrap-walls", BRIEF_READY_SNAKE_WRAP);
    assert.ok(out.md.startsWith("---"));
    assert.ok(out.targetYaml.includes("id: snake-optional-wrap-walls-as-hardcore-variant"));
    assert.equal(out.meta.briefReady, true);
  });

  it("renderPromoteSection includes fixture CTA and export preview", () => {
    const exported = runExport(getSeedBriefFixture(), { created: "2026-09-08" });
    const { html } = renderPromoteSection({
      briefs: [],
      gameId: "snake",
      exported,
      exportFromFixture: true,
    });
    assert.ok(html.includes("data-export-fixture"));
    assert.ok(html.includes("Targets / Promote"));
    assert.ok(html.includes("Copy markdown"));
    assert.ok(html.includes(exported.meta.targetId));
    assert.ok(isBriefReady(BRIEF_READY_SNAKE_WRAP));
  });
});
