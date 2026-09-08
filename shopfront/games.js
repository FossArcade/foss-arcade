/** Arcade Shelf catalog — GameTile view model (shopfront deepen slice 1) */

/** @typedef {"proposed"|"incubating"|"active"|"season-freeze"|"archived"|"forked-out"} Lifecycle */
/** @typedef {"Seed"|"Village"|"Town"|"City"} Stage */
/** @typedef {"unstable"|"stable"|string} ChannelId */

const LIFECYCLE_WEIGHT = {
  active: 5,
  incubating: 4,
  proposed: 3,
  "season-freeze": 2,
  archived: 0,
  "forked-out": 0,
};

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Popular-first score from design doc §B.
 * Stub metrics: ignore fake players/ratings/forumHeat; openTargets still count when set.
 */
export function computePopularScore(tile) {
  const m = tile.metrics || {};
  const live = m.mode === "live";
  let score = 1000 * (LIFECYCLE_WEIGHT[tile.lifecycle] ?? 0);
  score += 100 * (tile.placeholder ? 0 : 1);
  if (live) {
    score += 10 * clamp(m.forumHeat7d ?? 0, 0, 50);
  }
  score += 5 * clamp(m.openTargets ?? 0, 0, 20);
  if (live) {
    const rating = m.rating ?? 0;
    const count = m.ratingCount ?? 0;
    score += 1 * rating * Math.log1p(count);
    score += 0.001 * (m.players ?? 0);
  }
  return score;
}

function enrichTile(raw) {
  const metrics = {
    mode: "stub",
    players: null,
    playersNote: "Tracked when live metrics ship",
    activityLabel: undefined,
    activityNote: undefined,
    rating: null,
    ratingLabel: "Not rated yet",
    ratingCount: null,
    lastUpdate: undefined,
    lastUpdateNote: undefined,
    openTargets: null,
    forumHeat7d: null,
    ...raw.metrics,
  };
  const tile = {
    ...raw,
    metrics,
    href: raw.href || `/shopfront/game?id=${encodeURIComponent(raw.id)}`,
  };
  const lastUpdateTs = metrics.lastUpdate
    ? Date.parse(metrics.lastUpdate)
    : 0;
  tile.sort = {
    popularScore: computePopularScore(tile),
    lastUpdateTs: Number.isFinite(lastUpdateTs) ? lastUpdateTs : 0,
    titleKey: String(tile.title || tile.id || "").toLowerCase(),
  };
  return tile;
}

/** Raw catalog entries — Snake is real; keep other titles placeholder if added. */
const RAW_GAMES = [
  {
    id: "snake",
    title: "Foss Snake",
    summary:
      "Eat fruit. Grow. Don't crash. A short, offline-friendly classic — seeded, deterministic, no account needed.",
    lifecycle: "active",
    stage: "Seed",
    enginePrimary: "web",
    stacks: ["web"],
    playHref: "/games/snake/",
    tags: ["all-ages", "web", "classic", "harness-prover"],
    channels: ["unstable", "stable"],
    defaultChannel: "unstable",
    href: "/shopfront/game?id=snake",
    parent: null,
    githubHref:
      "https://github.com/FossArcade/foss-arcade/tree/main/games/snake",
    downloadLabel: "Desktop builds coming — fossarcade domain soon",
    downloadEnabled: false,
    offlineFirst: true,
    placeholder: false,
    badgeHints: [],
    community: {
      subreddit: "https://www.reddit.com/r/FOSSArcade",
      subredditLabel: "r/FOSSArcade",
      forumPath: "/shopfront/game?id=snake#community",
      persistenceHint: "pluggable",
    },
    metrics: {
      mode: "stub",
      players: null,
      playersNote: "Tracked when live metrics ship",
      activityLabel: "Seed",
      activityNote: "Bootstrap catalog entry — stub metrics only",
      rating: null,
      ratingLabel: "Not rated yet",
      ratingCount: null,
      lastUpdate: "2026-09-05",
      lastUpdateNote: "Initial stub on the shelf",
      openTargets: null,
      forumHeat7d: null,
    },
    about: {
      oneLiner:
        "A tiny, readable FOSS snake: eat fruit, grow, don’t crash—sessions fit a coffee break, and every race can prove determinism and mod surfaces without a king.",
      pillars: [
        "Readable in ~3 seconds — board, snake, fruit, and score are obvious at a glance.",
        "≤2 minute sessions — a full run fits under two minutes at default speed.",
        "Deterministic core — same seed + same inputs ⇒ same simulation outcome.",
        "Mod-friendly — skins, speed, board size, and fruit packs are first-class surfaces.",
        "Harness prover — exercises Foss Arcade races, gates, channels, and Shelf manifests.",
      ],
      nonGoals: [
        "Competitive online / ranked ladders as core",
        "Always-online, account-gated, or DRM’d play",
        "Deep RPG meta, gacha, or endless content treadmill",
        "Photoreal / AAA fidelity",
        "Using mods to redefine pillars without a variant or ADR",
      ],
      engineNote: "Primary stack: web (canvas). Godot optional later — see game.yaml.",
      licenses: "Game code MIT · assets CC0 (original) · docs CC-BY-4.0 · harness Apache-2.0",
      lineage: "Catalog root title (no parent). Variants live under games/snake/variants/.",
      designHref: "/games/snake/DESIGN.md",
      gameYamlHref: "/games/snake/game.yaml",
    },
  },

  {
    id: "platform-meta",
    title: "Platform Meta",
    summary:
      "Not a playable game — Shelf + ForumPort platform commons. Discusses Discussions categories, adapter swaps, and Community chrome for the Arcade itself.",
    kind: "platform-meta",
    lifecycle: "active",
    stage: "Seed",
    enginePrimary: "web",
    stacks: ["web"],
    playHref: "",
    playable: false,
    tags: ["all-ages", "meta", "platform", "forumport"],
    channels: [],
    defaultChannel: "",
    href: "/shopfront/game?id=platform-meta",
    parent: null,
    githubHref:
      "https://github.com/FossArcade/foss-arcade/tree/main/shopfront",
    downloadLabel: "Not a downloadable title — platform meta only",
    downloadEnabled: false,
    offlineFirst: true,
    placeholder: false,
    badgeHints: ["platform-meta", "not-a-game"],
    community: {
      subreddit: "https://www.reddit.com/r/FOSSArcade",
      subredditLabel: "r/FOSSArcade",
      forumPath: "/shopfront/game?id=platform-meta#community",
      persistenceHint: "pluggable",
      discussionsCategory: "meta",
      discussionsHref:
        "https://github.com/FossArcade/foss-arcade/discussions/categories/meta",
    },
    forumPortMeta: {
      port: "github-discussions",
      owner: "FossArcade",
      repo: "foss-arcade",
      category: "meta",
    },
    metrics: {
      mode: "stub",
      players: null,
      playersNote: "N/A — not a playable title",
      activityLabel: "Meta",
      activityNote: "Platform / ForumPort / Shelf Community itself",
      rating: null,
      ratingLabel: "Not a rated game",
      ratingCount: null,
      lastUpdate: "2026-09-08",
      lastUpdateNote: "Meta Shelf tile (honest non-game listing)",
      openTargets: null,
      forumHeat7d: null,
    },
    about: {
      oneLiner:
        "Honest Shelf listing for platform meta: GitHub Discussions meta category, ForumPort adapter config, and Community chrome — not a fake playable game.",
      pillars: [
        "Discussions meta is the binding commons for Shelf / ForumPort itself.",
        "Adapter swaps (GitHub Discussions → NodeBB / Discourse later) land via [meta], not silent chrome rewrites.",
        "Honest badges: platform-meta / not-a-game — no Play CTA pretending this is a title.",
      ],
      nonGoals: [
        "Pretending Platform Meta is a playable Foss Arcade game",
        "Hard-wiring GraphQL field names into Shelf components",
        "Standing up NodeBB/Discourse for Snake Seed",
      ],
      engineNote: "N/A — platform listing. See docs/shopfront/community-forum.md.",
      licenses: "Docs CC-BY-4.0 · shopfront code Apache-2.0 (repo root)",
      lineage: "Org-level platform tile (not under games/).",
      designHref: "/docs/shopfront/community-forum.md",
      gameYamlHref: "",
    },
  },
];

export const games = RAW_GAMES.map(enrichTile);

/** Sort: popularScore DESC → lastUpdateTs DESC → titleKey ASC */
export function sortedGames(list = games) {
  return [...list].sort((a, b) => {
    const sa = a.sort?.popularScore ?? 0;
    const sb = b.sort?.popularScore ?? 0;
    if (sb !== sa) return sb - sa;
    const ta = a.sort?.lastUpdateTs ?? 0;
    const tb = b.sort?.lastUpdateTs ?? 0;
    if (tb !== ta) return tb - ta;
    return String(a.sort?.titleKey ?? "").localeCompare(
      String(b.sort?.titleKey ?? "")
    );
  });
}

export function getGameById(id) {
  return games.find((g) => g.id === id) || null;
}
