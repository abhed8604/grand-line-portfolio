/**
 * Visual QA capture. Requires the dev server at BASE_URL.
 * Produces stage shots at three desktop sizes plus loader, Quick View,
 * project detail, reduced-motion, no-WebGL and mobile states.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = process.env.OUT_DIR ?? "/tmp/opencode/led-qa2";
await mkdir(outDir, { recursive: true });

const launchArgs = ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"];
const browser = await chromium.launch({ args: launchArgs });
const messages = [];

function watch(page, label) {
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      messages.push(`${label} [${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`${label} [pageerror] ${error.stack}`));
}

async function settle(page, ms = 3800) {
  await page.waitForTimeout(ms);
}

async function openDesktop(width, height, query = "?tier=high", reducedMotion = "no-preference") {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion,
  });
  const page = await context.newPage();
  watch(page, `desktop-${width}x${height}`);
  await page.goto(`${base}/${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
    timeout: 45000,
  });
  await settle(page, 2800);
  return { context, page };
}

const stages = ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"];

for (const [width, height] of [
  [1366, 768],
  [1440, 900],
  [1920, 1080],
]) {
  const { context, page } = await openDesktop(width, height);
  for (const stage of stages) {
    await page.evaluate((id) => window.__led?.story?.goTo(id, true), stage);
    await settle(page);
    await page.screenshot({ path: `${outDir}/desktop-${stage}-${width}x${height}.png` });
  }

  if (width === 1440) {
    await page.evaluate(() => window.__led?.story?.goTo("projects", true));
    await settle(page);
    await page.evaluate(async () => {
      const project = document.querySelector(".project-row")?.dataset.project;
      if (project) await window.__led?.story?.selectProject(project);
    });
    await settle(page);
    await page.screenshot({ path: `${outDir}/desktop-project-detail-1440x900.png` });

    const projectState = await page.evaluate(() => {
      const panel = document.querySelector("[data-project-panel].is-active, [data-project-panel]:not([hidden])");
      const index = document.querySelector("[data-project-index]");
      return {
        panel: panel?.getAttribute("data-project-panel") ?? null,
        indexHidden: index?.hasAttribute("hidden") ?? null,
        dockOverflow: document.querySelector("[data-project-details]")?.scrollHeight,
      };
    });
    console.log("PROJECT", JSON.stringify(projectState));

    await page.evaluate(() => window.__led?.openQuickView());
    await settle(page, 900);
    await page.screenshot({ path: `${outDir}/desktop-quickview-1440x900.png` });
    await page.evaluate(() => {
      const scroller = document.querySelector(".quickview__scroll");
      if (scroller) scroller.scrollTop = 760;
    });
    await settle(page, 700);
    await page.screenshot({ path: `${outDir}/desktop-quickview-scrolled-1440x900.png` });
    await page.evaluate(() => window.__led?.closeQuickView());
  }

  await context.close();
}

// Loader — capture mid-boot before the overlay leaves.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  watch(page, "loader");
  await page.goto(`${base}/?tier=high`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${outDir}/desktop-loader-1440x900.png` });
  await context.close();
}

// Reduced motion
{
  const { context, page } = await openDesktop(1440, 900, "?tier=high", "reduce");
  await page.evaluate(() => window.__led?.story?.goTo("home", true));
  await settle(page, 1200);
  await page.screenshot({ path: `${outDir}/desktop-reduced-motion-1440x900.png` });
  await context.close();
}

// Mobile document + Quick View
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  watch(page, "mobile");
  await page.goto(`${base}/?tier=low`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
    timeout: 45000,
  });
  await settle(page, 3200);
  await page.screenshot({ path: `${outDir}/mobile-home-390x844.png` });

  for (const [name, id] of [
    ["about", "flow-about"],
    ["projects", "flow-projects"],
    ["contact", "flow-contact"],
  ]) {
    await page.evaluate((target) => {
      const el = document.getElementById(target);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "auto" });
    }, id);
    await settle(page, 500);
    await page.screenshot({ path: `${outDir}/mobile-${name}-390x844.png` });
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.evaluate(() => window.__led?.openQuickView());
  await settle(page, 900);
  await page.screenshot({ path: `${outDir}/mobile-quickview-390x844.png` });
  await context.close();
}

// No-WebGL fallback
{
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
  await page.screenshot({ path: `${outDir}/desktop-no-webgl-1440x900.png` });
  const fallback = await page.evaluate(() => ({
    noWebgl: document.documentElement.classList.contains("no-webgl"),
    noteVisible: !document.querySelector("[data-fallback]")?.hidden,
    note: document.querySelector("[data-fallback]")?.textContent?.trim().slice(0, 90),
  }));
  console.log("FALLBACK", JSON.stringify(fallback));
  await context.close();
}

console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
