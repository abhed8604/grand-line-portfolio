import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = "/tmp/opencode/led-verify-latest";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`);
});
page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(1200);

for (const id of ["home", "about", "projects", "resume", "contact"]) {
  await page.evaluate((stage) => window.__led.goTo(stage), id);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/390-${id}.png` });
  const state = await page.evaluate(() => ({
    stage: document.body.dataset.stage,
    y: Math.round(window.scrollY),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  console.log("MOBILE", JSON.stringify(state));
}

// Quick View on mobile.
const quick = page.locator("[data-quickview-open]").first();
if (await quick.count()) {
  await quick.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/390-quickview.png` });
  console.log("QUICKVIEW", await page.evaluate(() => ({
    open: document.body.classList.contains("is-quickview"),
    title: document.querySelector(".quickview__title")?.textContent,
  })));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

console.log("MOBILE MESSAGES", JSON.stringify(messages));
await browser.close();
