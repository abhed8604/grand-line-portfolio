import { chromium } from "@playwright/test";

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(1200);
const boxes = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, missing: true };
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { sel, x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom, font: s.fontSize, line: s.lineHeight, margin: s.marginTop };
  };
  return [
    pick(".hero-copy"),
    pick(".hero-copy__role"),
    pick(".hero-copy__tagline"),
    pick(".hero-copy__actions"),
    pick(".hero-copy__availability"),
  ];
});
console.log(JSON.stringify(boxes, null, 2));
await browser.close();
