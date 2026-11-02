import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:4173";
const out = "/tmp/opencode/led-interaction";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(4500);

// Cursor ripple path: move across the field, then capture immediately.
await page.mouse.move(400, 500);
for (let i = 0; i < 18; i++) {
  await page.mouse.move(400 + i * 24, 500 + Math.sin(i * 0.7) * 80, { steps: 2 });
}
await page.waitForTimeout(80);
await page.screenshot({ path: `${out}/cursor-ripple.png` });
const ripples = await page.evaluate(() => [...document.querySelectorAll(".cursor__ripple")].map((el) => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })).filter((r) => Number(r.opacity) > 0.01));
const cursor = await page.evaluate(() => {
  const head = document.querySelector(".cursor__head");
  const log = document.querySelector(".log-pose");
  return {
    head: head ? getComputedStyle(head).width : null,
    rippleLayer: Boolean(document.querySelector(".cursor-ripples")),
    log: log ? { w: getComputedStyle(log).width, h: getComputedStyle(log).height, needle: getComputedStyle(document.querySelector(".log-pose__needle")).transform } : null,
  };
});

// Log pose closeup.
await page.evaluate(() => window.__led.story.goTo("home", true));
await page.waitForTimeout(1200);
const logBox = await page.evaluate(() => {
  const r = document.querySelector(".log-pose-group").getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
await page.screenshot({ path: `${out}/log-pose.png`, clip: { x: Math.max(0, logBox.x - 30), y: Math.max(0, logBox.y - 40), width: logBox.width + 60, height: logBox.height + 80 } });

// Quick view.
await page.evaluate(() => window.__led.openQuickView());
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/quickview.png` });
await page.evaluate(() => window.__led.closeQuickView());

// Scroll progress check across all stages.
const angles = [];
for (const id of ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"]) {
  await page.evaluate((s) => window.__led.story.goTo(s, true), id);
  await page.waitForTimeout(250);
  angles.push(await page.evaluate(() => ({
    stage: document.body.dataset.stage,
    scroll: Math.round(scrollY),
    needle: getComputedStyle(document.querySelector(".log-pose__needle")).transform,
  })));
}

console.log("RIPPLES", JSON.stringify(ripples, null, 2));
console.log("CURSOR", JSON.stringify(cursor, null, 2));
console.log("ANGLES", JSON.stringify(angles, null, 2));
console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
