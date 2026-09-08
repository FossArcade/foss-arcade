import { describe, it } from "node:test";
import assert from "node:assert";
import { games, getGameById, sortedGames, computePopularScore } from "./games.js";
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
