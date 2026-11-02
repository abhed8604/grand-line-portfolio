import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = process.env.OUT_DIR ?? "/tmp/opencode/led-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1366, height: 768 },
  deviceScaleFactor: 1,
});
const messages = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    messages.push(`[${message.type()}] ${message.text()}`);
  }
});
page.on("pageerror", (error) => messages.push(`[pageerror] ${error.stack}`));

await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
await page.waitForFunction(
  () => !document.body.classList.contains("is-loading"),
  { timeout: 45000 },
).catch(() => {});
await page.waitForTimeout(4000);
const state = await page.evaluate(() => {
  const canvas = document.querySelector("#led-canvas");
  const gl = canvas?.getContext("webgl2");
  const debug = window.__led;
  return {
    mode: debug?.mode,
    stage: document.body.dataset.stage,
    loading: document.body.classList.contains("is-loading"),
    fallback: document.documentElement.classList.contains("no-webgl"),
    engineQuality: debug?.engine?.activeQuality,
    enginePoints: debug?.engine?.activePoints,
    storySection: debug?.story?.currentSection?.(),
    loaderDisplay: getComputedStyle(document.querySelector("#loader")).display,
    loaderOpacity: getComputedStyle(document.querySelector("#loader")).opacity,
    sceneOpacity: getComputedStyle(document.querySelector(".scene.is-active")).opacity,
    canvas: canvas ? `${canvas.width}x${canvas.height}` : null,
    gl: gl
      ? {
          version: gl.getParameter(gl.VERSION),
          renderer: gl.getParameter(gl.RENDERER),
          float: Boolean(gl.getExtension("EXT_color_buffer_float")),
        }
      : null,
    activeScene: document.querySelector(".scene.is-active")?.id,
    revealed: document.querySelectorAll(".scene.is-active [data-reveal]").length,
  };
});
console.log(JSON.stringify({ state, messages }, null, 2));
await page.screenshot({ path: `${outDir}/home-1366.png` });
await browser.close();
