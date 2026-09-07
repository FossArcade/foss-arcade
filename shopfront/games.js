/** Arcade Shelf catalog — shopfront v0 */
export const games = [
  {
    id: "snake",
    title: "Foss Snake",
    summary:
      "Eat fruit. Grow. Don't crash. A short, offline-friendly classic — seeded, deterministic, no account needed.",
    playHref: "/games/snake/",
    githubHref: "https://github.com/FossArcade/foss-arcade/tree/main/games/snake",
    downloadLabel: "Desktop builds coming — fossarcade domain soon",
    downloadEnabled: false,
    tags: ["all-ages", "web", "classic"],
    community: {
      subreddit: "https://www.reddit.com/r/FOSSArcade",
      subredditLabel: "r/FOSSArcade",
    },
    stats: {
      players: "—",
      playersNote: "Tracked when the shopfront goes live",
      activity: "Seed",
      activityNote: "New title — bootstrap catalog entry",
      rating: null,
      ratingLabel: "Not rated yet",
      lastUpdate: "2026-09-05",
      lastUpdateNote: "Initial stub on the shelf",
    },
  },
];
