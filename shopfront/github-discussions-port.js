/**
 * GitHubDiscussionsPort — read-only Seed adapter for ForumPort.
 *
 * Surfaces constructed Discussions category / search / "new discussion" URLs for
 * FossArcade/foss-arcade. No live GraphQL in Seed; structure goes through ForumPort
 * so a GraphQL-backed implementation can replace this later without UI rewrites.
 *
 * @see docs/shopfront/community-forum.md
 */

import {
  FORUM_STAGE_LABELS,
  FORUM_STATUS_LABELS,
  FORUM_TYPE_LABELS,
  SNAKE_CATEGORIES,
  SNAKE_FLAIRS,
} from "./forum-port.js";

const DEFAULT_CONFIG = {
  owner: "FossArcade",
  repo: "foss-arcade",
  /** Map ForumPort category ids → GitHub Discussions category slug fragments. */
  categories: Object.fromEntries(
    SNAKE_CATEGORIES.map((c) => [c.id, c.id])
  ),
  /** Optional label map for when GraphQL lands (UI must not read these directly). */
  labelMap: {
    flair: Object.fromEntries(SNAKE_FLAIRS.map((f) => [f.id, `type:${f.id === "bug" ? "bug" : f.id}`])),
    stage: Object.fromEntries(FORUM_STAGE_LABELS.map((t) => [t.id, t.id])),
    status: Object.fromEntries(FORUM_STATUS_LABELS.map((t) => [t.id, t.id])),
  },
};

function discussionsBase(cfg) {
  return `https://github.com/${cfg.owner}/${cfg.repo}/discussions`;
}

function categoryUrl(cfg, categoryId) {
  const slug = cfg.categories[categoryId] || categoryId;
  return `${discussionsBase(cfg)}/categories/${encodeURIComponent(slug)}`;
}

function newDiscussionUrl(cfg, categoryId) {
  const slug = cfg.categories[categoryId] || categoryId;
  return `${discussionsBase(cfg)}/new?category=${encodeURIComponent(slug)}`;
}

function searchUrl(cfg, parts) {
  const q = parts.filter(Boolean).join(" ");
  return `${discussionsBase(cfg)}?discussions_q=${encodeURIComponent(q)}`;
}

/**
 * Create a read-only GitHub Discussions ForumPort.
 * @param {Partial<typeof DEFAULT_CONFIG>} [overrides]
 * @returns {import("./forum-port.js").ForumPort & {
 *   config: typeof DEFAULT_CONFIG,
 *   links: {
 *     home: string,
 *     category: (id: string) => string,
 *     compose: (categoryId?: string) => string,
 *     search: (parts: string[]) => string,
 *   },
 *   readOnly: true,
 * }}
 */
export function createGitHubDiscussionsPort(overrides = {}) {
  const config = {
    ...DEFAULT_CONFIG,
    ...overrides,
    categories: { ...DEFAULT_CONFIG.categories, ...(overrides.categories || {}) },
    labelMap: { ...DEFAULT_CONFIG.labelMap, ...(overrides.labelMap || {}) },
  };

  const links = {
    home: discussionsBase(config),
    category: (id) => categoryUrl(config, id),
    compose: (categoryId = "proposals") => newDiscussionUrl(config, categoryId),
    search: (parts) => searchUrl(config, parts),
  };

  /** @type {import("./forum-port.js").ForumPort} */
  const port = {
    async listThreads(query) {
      // Seed: no live GraphQL — return empty; UI shows empty states + Open on GitHub.
      void query;
      return [];
    },

    async getThread(id) {
      return {
        id,
        title: "Open on GitHub Discussions",
        game: "snake",
        url: `${discussionsBase(config)}/${encodeURIComponent(id)}`,
        body: "",
      };
    },

    async createThread(input) {
      const category = input.category || "proposals";
      return {
        id: "",
        url: newDiscussionUrl(config, category),
      };
    },

    async reply(threadId) {
      return {
        id: "",
        url: `${discussionsBase(config)}/${encodeURIComponent(threadId)}`,
      };
    },

    async listTags() {
      return [
        ...SNAKE_FLAIRS,
        ...FORUM_TYPE_LABELS,
        ...FORUM_STAGE_LABELS,
        ...FORUM_STATUS_LABELS,
        ...SNAKE_CATEGORIES.map((c) => ({
          id: `category:${c.id}`,
          label: c.label,
          kind: /** @type {"category"} */ ("category"),
          href: categoryUrl(config, c.id),
        })),
      ];
    },

    async applyTag() {
      throw new Error("applyTag: write path not wired in Seed read-only GitHubDiscussionsPort");
    },

    async react() {
      throw new Error("react: write path not wired in Seed read-only GitHubDiscussionsPort");
    },

    async upvote() {
      throw new Error("upvote: write path not wired in Seed read-only GitHubDiscussionsPort");
    },

    async exportBrief(threadId) {
      return {
        md: "",
        meta: {
          threadId,
          note: "brief-ready → export automation is out of scope for slice 2",
          discussionsUrl: `${discussionsBase(config)}/${encodeURIComponent(threadId)}`,
        },
      };
    },
  };

  return Object.assign(port, { config, links, readOnly: true });
}

/** Default Seed port for FossArcade/foss-arcade. */
export const githubDiscussionsPort = createGitHubDiscussionsPort();
