import { chromium } from "@playwright/test";

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
page.on("console", (m) => console.log("CONSOLE", m.type(), m.text()));
page.on("pageerror", (e) => console.log("PAGEERROR", e.stack));
await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(1000);
const before = await page.evaluate(() => {
  const engine = window.__led?.engine;
  return {
    led: Boolean(window.__led),
    engine: Boolean(engine),
    keys: engine ? Object.keys(engine) : [],
    time: engine?.sim?.time,
    targetTime: engine?.sim?.targetTime,
    stage: document.body.dataset.stage,
  };
});
console.log("BEFORE", JSON.stringify(before, null, 2));
await page.evaluate(() => window.__led.story.goTo("about", true));
await page.waitForTimeout(500);
const after = await page.evaluate(() => {
  const engine = window.__led?.engine;
  return {
    time: engine?.sim?.time,
    targetTime: engine?.sim?.targetTime,
    stage: document.body.dataset.stage,
  };
});
console.log("AFTER", JSON.stringify(after, null, 2));
await page.waitForTimeout(4000);
const later = await page.evaluate(() => {
  const engine = window.__led?.engine;
  return {
    time: engine?.sim?.time,
    targetTime: engine?.sim?.targetTime,
    delta: engine ? engine.sim.time - engine.sim.targetTime : null,
  };
});
console.log("LATER", JSON.stringify(later, null, 2));
await browser.close();
