import { createGame, queueDir, tick, togglePause } from "./sim/game.js";
import { render } from "./render/canvas.js";
import {
  resolveSnakeRun,
  formatRunChip,
} from "./run/apply-run.js";
import {
  hiscoreNamespace,
  loadHiscores,
  recordHiscore,
  clearHiscores,
} from "./hiscore/storage.js";

const KEY_DIR = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  W: "up",
  A: "left",
  S: "down",
  D: "right",
};

function readSeedFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("seed");
  if (raw == null || raw === "") return Date.now() >>> 0;
  const asNum = Number(raw);
  return Number.isFinite(asNum) ? asNum >>> 0 : raw;
}

function freshSeed() {
  if (window.crypto && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] || (Date.now() >>> 0);
  }
  return Date.now() >>> 0;
}

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const lengthEl = document.getElementById("length");
const statusEl = document.getElementById("status");
const seedEl = document.getElementById("seed");
const copyBtn = document.getElementById("copy-seed");
const replayBtn = document.getElementById("replay");
const newRunBtn = document.getElementById("new-run");
const runChipEl = document.getElementById("run-chip");
const runHashEl = document.getElementById("run-hash");
const hiscoreListEl = document.getElementById("hiscore-list");
const clearHiscoresBtn = document.getElementById("clear-hiscores");
const runWarnEl = document.getElementById("run-warn");

/** Active run from ?run= / verbose query / Default Play. */
const activeRun = resolveSnakeRun(window.location.search);
const runNs = hiscoreNamespace(activeRun.spec);

function paintRunChrome() {
  if (runChipEl) {
    runChipEl.textContent = formatRunChip(activeRun.spec, activeRun.applied);
  }
  if (runHashEl) {
    runHashEl.textContent = activeRun.hash || "—";
    runHashEl.title = activeRun.hash || "";
  }
  if (runWarnEl) {
    const bits = [];
    if (activeRun.decodeError) bits.push(activeRun.decodeError);
    if (activeRun.unknownMods.length) {
      bits.push(`Unknown mods ignored: ${activeRun.unknownMods.join(", ")}`);
    }
    if (activeRun.incompatibleMods.length) {
      bits.push(
        `Incompatible mods skipped: ${activeRun.incompatibleMods
          .map((m) => m.id)
          .join(", ")}`
      );
    }
    if (activeRun.refusedMods.length) {
      bits.push(
        `Refused mods: ${activeRun.refusedMods.map((m) => m.id).join(", ")}`
      );
    }
    if (activeRun.banner === "stub-not-shipped-stable") {
      bits.push("Channel tip is Seed unstable (stub ≠ shipped stable).");
    }
    runWarnEl.textContent = bits.join(" ");
    runWarnEl.hidden = bits.length === 0;
  }
}

function paintHiscores() {
  if (!hiscoreListEl) return;
  const store = window.localStorage;
  const rows = loadHiscores(store, runNs);
  if (!rows.length) {
    hiscoreListEl.innerHTML = "<li class=\"muted\">No scores yet for this run.</li>";
    return;
  }
  hiscoreListEl.innerHTML = rows
    .map(
      (r, i) =>
        `<li><span class="hs-rank">${i + 1}.</span> <strong>${r.score}</strong>` +
        ` <span class="muted">len ${r.length}</span></li>`
    )
    .join("");
}

function makeGame(seed) {
  return createGame({
    seed,
    ...activeRun.gameOpts,
  });
}

let game = makeGame(readSeedFromUrl());
game.skin = activeRun.skin;
let acc = 0;
let last = performance.now();
let recordedForTicks = -1;

function maybeRecordHiscore() {
  if (game.status !== "lost" && game.status !== "won") return;
  if (recordedForTicks === game.ticks) return;
  recordedForTicks = game.ticks;
  if (game.score <= 0) {
    paintHiscores();
    return;
  }
  recordHiscore(window.localStorage, runNs, {
    score: game.score,
    length: game.snake.length,
    seed: game.seed,
  });
  paintHiscores();
}

function hud() {
  scoreEl.textContent = String(game.score);
  lengthEl.textContent = String(game.snake.length);
  statusEl.textContent = game.status;
  statusEl.dataset.status = game.status;
  seedEl.value = String(game.seed);
  maybeRecordHiscore();
}

function frame(now) {
  const dt = Math.min(80, now - last);
  last = now;
  if (game.status === "playing") {
    acc += dt;
    const step = game.tickMs;
    while (acc >= step) {
      tick(game);
      acc -= step;
    }
  }
  render(ctx, game);
  hud();
  requestAnimationFrame(frame);
}

function restart(seed) {
  game = makeGame(seed);
  game.skin = activeRun.skin;
  acc = 0;
  last = performance.now();
  recordedForTicks = -1;
  const url = new URL(window.location.href);
  url.searchParams.set("seed", String(seed));
  // Preserve run= / channel / mods already present.
  history.replaceState(null, "", url);
}

window.addEventListener("keydown", (ev) => {
  const dir = KEY_DIR[ev.key];
  if (dir) {
    ev.preventDefault();
    queueDir(game, dir);
    return;
  }
  if (ev.key === "Escape") {
    ev.preventDefault();
    togglePause(game);
    return;
  }
  if (ev.key === "r" || ev.key === "R") {
    ev.preventDefault();
    restart(freshSeed());
  }
});

copyBtn.addEventListener("click", async () => {
  const text = String(game.seed);
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied";
  } catch {
    seedEl.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied";
  }
  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 900);
});

replayBtn.addEventListener("click", () => restart(game.seed));
newRunBtn.addEventListener("click", () => restart(freshSeed()));

if (clearHiscoresBtn) {
  clearHiscoresBtn.addEventListener("click", () => {
    clearHiscores(window.localStorage, runNs);
    paintHiscores();
  });
}

seedEl.addEventListener("change", () => {
  const raw = seedEl.value.trim();
  if (raw === "") return;
  const asNum = Number(raw);
  restart(Number.isFinite(asNum) ? asNum >>> 0 : raw);
});

paintRunChrome();
paintHiscores();
hud();
render(ctx, game);
requestAnimationFrame(frame);
