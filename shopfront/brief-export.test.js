import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  isBriefReady,
  slugify,
  proposeTargetId,
  buildBriefMarkdown,
  buildTargetProposal,
  buildTargetYamlStub,
  exportBriefReady,
} from "./brief-export.js";

const fixturePath = fileURLToPath(
  new URL("./fixtures/brief-ready-snake-wrap.json", import.meta.url)
);
const fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));

describe("brief-export helpers", () => {
  it("detects brief-ready status and tags", () => {
    assert.equal(isBriefReady({status: "brief-ready"}), true);
    assert.equal(isBriefReady({status: "status:brief-ready"}), true);
    assert.equal(isBriefReady({tags: ["status:brief-ready"]}), true);
    assert.equal(isBriefReady({status: "open"}), false);
  });

  it("slugifies titles and proposes target ids", () => {
    assert.equal(slugify("Optional Wrap Walls!"), "optional-wrap-walls");
    assert.equal(
      proposeTargetId({title: "Optional wrap walls as hardcore variant", game: "snake"}),
      "snake-optional-wrap-walls-as-hardcore-variant"
    );
    assert.equal(proposeTargetId({targetId: "snake-wrap", title: "x"}), "snake-wrap");
  });

  it("builds markdown brief with target frontmatter", () => {
    const md = buildBriefMarkdown(fixture, { created: "2026-09-08" });
    assert.ok(md.startsWith("---"));
    assert.ok(md.includes("id: snake-optional-wrap-walls-as-hardcore-variant"));
    assert.ok(md.includes("game: snake"));
    assert.ok(md.includes("status: proposed"));
    assert.ok(md.includes("# [feature] Optional wrap walls as hardcore variant"));
    assert.ok(md.includes("## Acceptance criteria"));
    assert.ok(md.includes("Wrap walls ship only as an opt-in mod or variant"));
  });

  it("builds target proposal + YAML stub for intake-write-target", () => {
    const proposal = buildTargetProposal(fixture, { created: "2026-09-08" });
    assert.equal(proposal.game, "snake");
    assert.equal(proposal.status, "proposed");
    assert.equal(proposal.flair, "feature");
    assert.equal(proposal.acceptance_criteria.length, 3);
    const yaml = buildTargetYamlStub(proposal);
    assert.ok(yaml.includes("# Target: "));
    assert.ok(yaml.includes("Schema: docs/harness/target.schema.md"));
    assert.ok(yaml.includes("id: snake-optional-wrap-walls-as-hardcore-variant"));
    assert.ok(yaml.includes("acceptance_criteria:"));
  });

  it("exportBriefReady returns md, yaml, meta + intake hint", () => {
    const out = exportBriefReady(fixture, { created: "2026-09-08" });
    assert.equal(out.meta.briefReady, true);
    assert.ok(out.meta.briefPathHint.endsWith(".md"));
    assert.ok(out.meta.targetPathHint.includes("games/snake/targets/"));
    assert.ok(out.meta.intakeCommand.includes("tools/intake-write-target/write.mjs"));
    assert.ok(out.md.length > 50);
    assert.ok(out.targetYaml.length > 30);
    assert.equal(out.proposal.id, out.meta.targetId);
  });
});
