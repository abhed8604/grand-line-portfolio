/**
 * Small dot-matrix LED motifs for the mobile document sections. These are
 * static, blue-only and intentionally cheap: one 96px canvas per section.
 */

const GRID = 12;
const SIZE = 96;
const MARGIN = 7;
const STEP = (SIZE - MARGIN * 2) / (GRID - 1);

const MOTIFS: Record<string, string[]> = {
  about: [
    "............",
    "....####....",
    "....####....",
    "...######...",
    "............",
    "..########..",
    ".##########.",
    ".###....###.",
    ".###....###.",
    "............",
    "............",
  ],
  skills: [
    "............",
    "..##....##..",
    "..##....##..",
    "............",
    "....####....",
    "...######...",
    "....####....",
    "............",
    "..##....##..",
    "..##....##..",
    "............",
    "............",
  ],
  projects: [
    "............",
    "....####....",
    "...##..##...",
    "..##....##..",
    ".##########.",
    "...##..##...",
    "...##..##...",
    "...##..##...",
    "...##..##...",
    ".##########.",
    "............",
    "............",
  ],
  education: [
    "............",
    "............",
    "..####..####",
    ".##..####..##",
    ".##..####..##",
    ".##..####..##",
    ".##..####..##",
    ".##..####..##",
    ".##..####..##",
    "..####..####",
    "............",
    "............",
  ],
  experience: [
    "............",
    "....####....",
    "....####....",
    ".##########.",
    ".##########.",
    ".##......##.",
    ".##......##.",
    ".##......##.",
    ".##########.",
    ".##########.",
    "............",
    "............",
  ],
  resume: [
    "............",
    "..########..",
    "..#......#..",
    "..#.####.#..",
    "..#......#..",
    "..#.####.#..",
    "..#......#..",
    "..#.####.#..",
    "..#......#..",
    "..########..",
    "............",
    "............",
  ],
  contact: [
    "............",
    "............",
    "############",
    "#..........#",
    "#.#......#.#",
    "#...####...#",
    "#..........#",
    "############",
    "............",
    "............",
    "............",
    "............",
  ],
};

function paint(canvas: HTMLCanvasElement, rows: string[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "rgba(92, 200, 255, 0.72)";
  ctx.shadowColor = "rgba(92, 200, 255, 0.65)";
  ctx.shadowBlur = 3;

  for (let row = 0; row < GRID; row += 1) {
    const line = rows[row] ?? "";
    for (let col = 0; col < GRID; col += 1) {
      if (line[col] !== "#") continue;
      const x = MARGIN + col * STEP;
      const y = MARGIN + row * STEP;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function initVignettes(): void {
  const canvases = document.querySelectorAll<HTMLCanvasElement>(".flow-vignette");
  for (const canvas of canvases) {
    const motif = MOTIFS[canvas.dataset.vignette ?? ""];
    if (motif) paint(canvas, motif);
  }
}
