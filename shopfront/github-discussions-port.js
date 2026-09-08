/**
 * GitHubDiscussionsPort — read-only Seed adapter for ForumPort.
 *
 * Surfaces constructed Discussions category / search / "new discussion" URLs for
 * FossArcade/foss-arcade. No live GraphQL in Seed; structure goes through ForumPort
 * so a GraphQL-backed implementation can replace this later without UI rewrites.
 *
 * @see docs/shopfront/community-forum.md
 * @see docs/shopfront/discussion-seed.md
 */

import {
  FORUM_STAGE_LABELS,
  FORUM_STATUS_LABELS,
  FORUM_TYPE_LABELS,
  SNAKE_CATEGORIES,
  SNAKE_FLAIRS,
} from "./forum-port.js";

/**
 * Intended GitHub Discussions category slugs (community-forum.md).
 * After Chief creates Proposals / Considerations / Briefs / Meta in the UI,
 * flip SEED_CATEGORY_SLUG_MAP (or set useInterimSlugs: false) to these identity slugs.
 */
export const INTENDED_CATEGORY_SLUGS = Object.freeze({
  announcements: "announcements",
  proposals: "proposals",
  considerations: "considerations",
  briefs: "briefs",
  "show-and-tell": "show-and-tell",
  "q-and-a": "q-and-a",
  meta: "meta",
});

/**
 * Interim slug map for live DEFAULT GitHub categories (until custom ones exist).
 * Live today: announcements, general, ideas, polls, q-a, show-and-tell.
 * - proposals → ideas (interim)
 * - considerations / briefs / meta → general (interim)
 * - q-and-a → q-a (GitHub default slug; avoids 404)
 * Chief is creating real Proposals/Considerations/Briefs/Meta; after that,
 * set useInterimSlugs: false (or replace this map with INTENDED_CATEGORY_SLUGS).
 */
export const SEED_CATEGORY_SLUG_MAP = Object.freeze({
  announcements: "announcements",
  proposals: "ideas", // interim until Proposals category exists
  considerations: "general", // interim until Considerations exists
  briefs: "general", // interim until Briefs exists
  "show-and-tell": "show-and-tell",
  "q-and-a": "q-a",
  meta: "general", // interim until Meta exists
});

const DEFAULT_CONFIG = {
  owner: "FossArcade",
  repo: "foss-arcade",
  /**
   * When true (Seed default), category URLs use SEED_CATEGORY_SLUG_MAP so links
   * hit live DEFAULT categories instead of 404ing on not-yet-created slugs.
   * Set false once Chief has created intended categories.
   */
  useInterimSlugs: true,
  /** Map ForumPort category ids → GitHub Discussions category slug fragments. */
  categories: { ...SEED_CATEGORY_SLUG_MAP },
  /** Optional label map for when GraphQL lands (UI must not read these directly). */
  labelMap: {
    flair: Object.fromEntries(SNAKE_FLAIRS.map((f) => [f.id, `type:${f.id === "bug" ? "bug" : f.id}`])),
    stage: Object.fromEntries(FORUM_STAGE_LABELS.map((t) => [t.id, t.id])),
    status: Object.fromEntries(FORUM_STATUS_LABELS.map((t) => [t.id, t.id])),
  },
};

function resolveCategories(cfg) {
  // When flipping off interim mode, start from intended identity slugs.
  // Only apply categories overrides that callers pass explicitly after that flip
  // (createGitHubDiscussionsPort strips the baked-in interim default first).
  if (cfg.useInterimSlugs === false) {
    return { ...INTENDED_CATEGORY_SLUGS, ...(cfg.categoryOverrides || {}) };
  }
  // Prefer explicit categories override; default Seed uses interim map.
  return { ...SEED_CATEGORY_SLUG_MAP, ...(cfg.categories || {}) };
}

function discussionsBase(cfg) {
  return `https://github.com/${cfg.owner}/${cfg.repo}/discussions`;
}

function categoryUrl(cfg, categoryId) {
  const cats = resolveCategories(cfg);
  const slug = cats[categoryId] || categoryId;
  return `${discussionsBase(cfg)}/categories/${encodeURIComponent(slug)}`;
}

function newDiscussionUrl(cfg, categoryId) {
  const cats = resolveCategories(cfg);
  const slug = cats[categoryId] || categoryId;
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
    categories: resolveCategories({
      ...DEFAULT_CONFIG,
      ...overrides,
      // Keep interim defaults out of the identity path; only explicit overrides apply.
      categories: overrides.categories
        ? { ...SEED_CATEGORY_SLUG_MAP, ...overrides.categories }
        : { ...SEED_CATEGORY_SLUG_MAP },
      categoryOverrides: overrides.categories || {},
    }),
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
