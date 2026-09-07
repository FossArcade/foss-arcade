import { createGame, queueDir, tick, togglePause } from "./sim/game.js";
import { render } from "./render/canvas.js";

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

let game = createGame({ seed: readSeedFromUrl() });
let acc = 0;
let last = performance.now();

function hud() {
  scoreEl.textContent = String(game.score);
  lengthEl.textContent = String(game.snake.length);
  statusEl.textContent = game.status;
  statusEl.dataset.status = game.status;
  seedEl.value = String(game.seed);
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
  game = createGame({ seed });
  acc = 0;
  last = performance.now();
  const url = new URL(window.location.href);
  url.searchParams.set("seed", String(seed));
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

seedEl.addEventListener("change", () => {
  const raw = seedEl.value.trim();
  if (raw === "") return;
  const asNum = Number(raw);
  restart(Number.isFinite(asNum) ? asNum >>> 0 : raw);
});

hud();
render(ctx, game);
requestAnimationFrame(frame);
