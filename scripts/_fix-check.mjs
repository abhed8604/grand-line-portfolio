import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = "/tmp/opencode/led-fix-check";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
for (const id of ["about", "skills"]) {
  await page.evaluate((stage) => window.__led.story.goTo(stage, true), id);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${out}/${id}-1366.png` });
}
console.log("MESSAGES", JSON.stringify(messages));
await browser.close();
