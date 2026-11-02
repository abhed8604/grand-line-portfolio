import { chromium } from "@playwright/test";

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
for (const [w, h] of [[1366, 768], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await page.evaluate(() => window.__led.story.goTo("about", true));
  await page.waitForTimeout(800);
  const boxes = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const r = el.getBoundingClientRect();
      return { sel, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
    };
    return [
      pick(".about-panel"),
      pick(".about-panel .lead"),
      pick(".about-panel .body-copy"),
      pick(".about-panel .aside-note"),
      pick(".about-panel .fact-list"),
      pick(".about-panel .fact-list > div:last-child"),
      pick(".scene-note--about"),
    ];
  });
  console.log(w, h, JSON.stringify(boxes, null, 2));
  await page.close();
}
await browser.close();
