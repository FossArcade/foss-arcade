/**
 * Canvas view for Foss Snake. Draws a snapshot; never ticks the sim.
 */

const COLORS = {
  bg: "#0d1412",
  grid: "#1a2621",
  wall: "#24352e",
  snake: "#6bd38a",
  head: "#c8f5c0",
  fruit: "#e85d4c",
  fruitHi: "#ffb39a",
};

const NEON_COLORS = {
  bg: "#050510",
  grid: "#1a1040",
  wall: "#5b2cff",
  snake: "#39ff14",
  head: "#e0ff66",
  fruit: "#ff2bd6",
  fruitHi: "#ff9cf0",
};

function paletteFor(state) {
  return state && state.skin === "neon" ? NEON_COLORS : COLORS;
}

export function boardPixelSize(state, cell = 28) {
  return { width: state.width * cell, height: state.height * cell, cell };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state  game state (or snapshot)
 * @param {number} [cell]
 */
export function render(ctx, state, cell = 28) {
  const palette = paletteFor(state);
  const w = state.width * cell;
  const h = state.height * cell;
  const canvas = ctx.canvas;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= state.width; x++) {
    ctx.moveTo(x * cell + 0.5, 0);
    ctx.lineTo(x * cell + 0.5, h);
  }
  for (let y = 0; y <= state.height; y++) {
    ctx.moveTo(0, y * cell + 0.5);
    ctx.lineTo(w, y * cell + 0.5);
  }
  ctx.stroke();

  ctx.strokeStyle = palette.wall;
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, w - 3, h - 3);

  if (state.fruit) {
    const fx = state.fruit.x * cell;
    const fy = state.fruit.y * cell;
    const pad = Math.max(3, cell * 0.18);
    ctx.fillStyle = palette.fruit;
    roundRect(ctx, fx + pad, fy + pad, cell - pad * 2, cell - pad * 2, 4);
    ctx.fill();
    ctx.fillStyle = palette.fruitHi;
    ctx.beginPath();
    ctx.arc(fx + cell * 0.38, fy + cell * 0.38, cell * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  const snake = state.snake;
  for (let i = snake.length - 1; i >= 0; i--) {
    const c = snake[i];
    const pad = i === 0 ? 2 : 3;
    ctx.fillStyle = i === 0 ? palette.head : palette.snake;
    roundRect(
      ctx,
      c.x * cell + pad,
      c.y * cell + pad,
      cell - pad * 2,
      cell - pad * 2,
      4,
    );
    ctx.fill();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export { COLORS, NEON_COLORS };
