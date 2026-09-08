/**
 * ForumPort — pluggable Community persistence (docs/shopfront/community-forum.md).
 *
 * Shelf UI depends only on this contract. Do not hard-wire GraphQL field names
 * into game-page components; swap adapters via meta later (NodeBB / Discourse).
 *
 * CommunityStore (design doc §D) is a thin UI-facing alias over the same shape:
 * listPosts ≈ listThreads, getPost ≈ getThread, etc.
 */

/**
 * @typedef {Object} ForumTag
 * @property {string} id
 * @property {string} label
 * @property {"flair"|"type"|"stage"|"status"|"category"} kind
 * @property {string} [href]
 */

/**
 * @typedef {Object} ThreadSummary
 * @property {string} id
 * @property {string} title
 * @property {string} game
 * @property {string} [category]
 * @property {string} [flair]
 * @property {string} [status]
 * @property {string} [stage]
 * @property {string} [authorHandle]
 * @property {string} [updatedAt]
 * @property {string} url
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} ThreadDetail
 * @property {string} id
 * @property {string} title
 * @property {string} game
 * @property {string} [body]
 * @property {string} [category]
 * @property {string} [flair]
 * @property {string} [status]
 * @property {string} [stage]
 * @property {string} [authorHandle]
 * @property {string} [updatedAt]
 * @property {string} url
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} ListThreadsQuery
 * @property {string} game
 * @property {string} [flair]
 * @property {string} [status]
 * @property {string} [category]
 * @property {"new"|"hot"|"voted"} [sort]
 */

/**
 * @typedef {Object} BriefExport
 * @property {string} md
 * @property {Record<string, unknown>} meta
 */

/**
 * @typedef {Object} ForumPort
 * @property {(query: ListThreadsQuery) => Promise<ThreadSummary[]>} listThreads
 * @property {(id: string) => Promise<ThreadDetail>} getThread
 * @property {(input: { game: string, title: string, body?: string, category?: string, flair?: string }) => Promise<{ id: string, url: string }>} createThread
 * @property {(threadId: string, body: string) => Promise<{ id: string, url: string }>} reply
 * @property {(game?: string) => Promise<ForumTag[]>} listTags
 * @property {(threadId: string, tagId: string) => Promise<void>} applyTag
 * @property {(threadId: string, reaction: string) => Promise<void>} react
 * @property {(threadId: string) => Promise<void>} upvote
 * @property {(threadId: string) => Promise<BriefExport>} exportBrief
 */

/**
 * CommunityStore — UI-facing alias (design doc §D). Prefer ForumPort names in new code.
 * @param {ForumPort} port
 */
export function asCommunityStore(port) {
  return {
    listPosts: (query) => port.listThreads(query),
    getPost: (id) => port.getThread(id),
    createPost: (input) =>
      port.createThread({
        game: input.game,
        title: input.title,
        body: input.body,
        category: input.category || "proposals",
        flair: input.flair,
      }),
    listConsiderations: (game) =>
      port.listThreads({ game, category: "considerations" }),
    voteConsideration: async () => {
      throw new Error("voteConsideration: not available on this Seed port (read-only / ack later)");
    },
    listBriefs: (game) => port.listThreads({ game, category: "briefs" }),
    upsertBrief: async () => {
      throw new Error("upsertBrief: write path not wired in Seed read-only port");
    },
    exportBriefForTarget: (briefId) => port.exportBrief(briefId),
    /** Underlying ForumPort (for advanced callers). */
    forumPort: port,
  };
}

/** Snake Community flairs (docs/reddit/flairs.md) — newGame is org-level, not on Snake. */
export const SNAKE_FLAIRS = [
  { id: "feature", label: "feature", kind: "flair" },
  { id: "bug", label: "bug", kind: "flair" },
  { id: "balance", label: "balance", kind: "flair" },
  { id: "mod", label: "mod", kind: "flair" },
  { id: "promote", label: "promote", kind: "flair" },
  { id: "refactor", label: "refactor", kind: "flair" },
  { id: "meta", label: "meta", kind: "flair" },
];

/** Type / stage / status labels from docs/shopfront/community-forum.md */
export const FORUM_TYPE_LABELS = [
  { id: "type:feature", label: "type:feature", kind: "type" },
  { id: "type:bug", label: "type:bug", kind: "type" },
  { id: "type:balance", label: "type:balance", kind: "type" },
  { id: "type:docs", label: "type:docs", kind: "type" },
  { id: "type:meta", label: "type:meta", kind: "type" },
];

export const FORUM_STAGE_LABELS = [
  { id: "stage:proposal", label: "stage:proposal", kind: "stage" },
  { id: "stage:consideration", label: "stage:consideration", kind: "stage" },
  { id: "stage:brief", label: "stage:brief", kind: "stage" },
  { id: "stage:harness", label: "stage:harness", kind: "stage" },
  { id: "stage:pr", label: "stage:pr", kind: "stage" },
];

export const FORUM_STATUS_LABELS = [
  { id: "status:needs-votes", label: "status:needs-votes", kind: "status" },
  { id: "status:brief-ready", label: "status:brief-ready", kind: "status" },
  { id: "status:accepted", label: "status:accepted", kind: "status" },
  { id: "status:declined", label: "status:declined", kind: "status" },
  { id: "status:shipped", label: "status:shipped", kind: "status" },
];

/** Discussion categories for Snake Seed (community-forum.md). */
export const SNAKE_CATEGORIES = [
  { id: "announcements", label: "Announcements", role: "Maintainer releases and seed rules" },
  { id: "proposals", label: "Proposals", role: "Intake: feature / fix / balance ideas" },
  { id: "considerations", label: "Considerations", role: "Design debate, tradeoffs, playtest notes" },
  { id: "briefs", label: "Briefs", role: "Living brief drafts toward export" },
  { id: "show-and-tell", label: "Show and tell", role: "Clips, forks, skins" },
  { id: "q-and-a", label: "Q&A", role: "Player help (not proposals)" },
  { id: "meta", label: "Meta", role: "Platform / ForumPort / Shelf Community" },
];

/** Pipeline strip stages (design §D). */
export const PIPELINE_STAGES = [
  { id: "proposal", label: "Proposal" },
  { id: "considerations", label: "Considerations" },
  { id: "brief", label: "Brief" },
  { id: "target", label: "Target" },
];
