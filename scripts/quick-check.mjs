/**
 * Focused check for the layout states that changed most recently.
 * Requires the dev server at BASE_URL.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { waitForSettled } from "./wait-for-settled.mjs";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = process.env.OUT_DIR ?? "/tmp/opencode/led-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const messages = [];
const watch = (page, label) => {
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) messages.push(`${label} [${message.type()}] ${message.text()}`);
  });
  page.on("pageerror", (error) => messages.push(`${label} [pageerror] ${error.stack}`));
};

async function desktop(width, height) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  watch(page, `desktop-${width}`);
  await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await waitForSettled(page, `desktop ${width} boot`);
  return { context, page };
}

{
  const { context, page } = await desktop(1366, 768);
  for (const id of ["home", "resume", "contact", "experience"]) {
    await page.evaluate((stage) => window.__led?.story?.goTo(stage, true), id);
    await waitForSettled(page, `quick-check ${id}`);
    await page.screenshot({ path: `${outDir}/fix-${id}-1366x768.png` });
  }
  const experience = await page.evaluate(() => {
    const panel = document.querySelector(".experience-panel");
    return {
      scrollHeight: panel?.scrollHeight,
      clientHeight: panel?.clientHeight,
      scrollable: panel ? panel.scrollHeight > panel.clientHeight + 1 : null,
      lastEntryBottom: document.querySelector(".experience-entry:last-child")?.getBoundingClientRect().bottom,
      panelBottom: panel?.getBoundingClientRect().bottom,
    };
  });
  console.log("EXPERIENCE 1366", JSON.stringify(experience));
  await context.close();
}

{
  const { context, page } = await desktop(1440, 900);
  await page.evaluate(() => window.__led?.story?.goTo("experience", true));
  await waitForSettled(page, "quick-check experience 1440");
  await page.screenshot({ path: `${outDir}/fix-experience-1440x900.png` });
  console.log("EXPERIENCE 1440", JSON.stringify(await page.evaluate(() => {
    const panel = document.querySelector(".experience-panel");
    return { scrollHeight: panel?.scrollHeight, clientHeight: panel?.clientHeight };
  })));
  await context.close();
}

{
  // Mobile
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  watch(page, "mobile");
  await page.goto(`${base}/?tier=low`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await waitForSettled(page, "quick-check mobile boot");
  await page.screenshot({ path: `${outDir}/fix-mobile-home-390x844.png` });
  await context.close();
}

{
  // No-WebGL fallback
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  watch(page, "fallback");
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (String(type).includes("webgl")) return null;
      return original.call(this, type, ...rest);
    };
  });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${outDir}/fix-no-webgl-1440x900.png` });
  await context.close();
}

console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
