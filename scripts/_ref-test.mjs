import { chromium } from "@playwright/test";

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.evaluate(() => window.__led.story.goTo("about", true));
await page.waitForTimeout(5000);
await page.screenshot({ path: "/tmp/opencode/led-ref-test/about-reference.png" });
console.log("MESSAGES", JSON.stringify(messages));
await browser.close();
