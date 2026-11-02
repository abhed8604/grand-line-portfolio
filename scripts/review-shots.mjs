/**
 * Reusable review capture for the polish pass.
 * Produces 1440x900, 1366x768 and 390x844 stage shots plus Quick View.
 * Requires the dev server at BASE_URL.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = process.env.OUT_DIR ?? "/tmp/opencode/review-shots";
await mkdir(outDir, { recursive: true });

const stages = ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"];
const messages = [];
const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

function watch(page, label) {
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      messages.push(`${label} [${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`${label} [pageerror] ${error.stack}`));
}

async function settle(page, seconds = 2.8) {
  await page.evaluate(() => {
    const sim = window.__led?.engine?.sim;
    if (!sim) return;
    sim.__qaStart = sim.time;
    sim.__qaTarget = sim.targetTime;
  });
  await page.waitForFunction(
    (limit) => {
      const sim = window.__led?.engine?.sim;
      if (!sim || sim.__qaStart === undefined) return true;
      return sim.time - Math.max(sim.__qaStart, sim.__qaTarget) > limit;
    },
    seconds,
    { timeout: 60000 },
  );
  await page.waitForTimeout(180);
}

async function openDesktop(width, height, label) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  watch(page, label);
  await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await page.waitForTimeout(900);
  return { context, page };
}

async function desktop(width, height, label) {
  const { context, page } = await openDesktop(width, height, label);
  for (const stage of stages) {
    await page.evaluate((id) => window.__led?.story?.goTo(id, true), stage);
    await settle(page);
    await page.screenshot({ path: `${outDir}/${label}-${stage}.png` });
    const state = await page.evaluate(() => ({
      stage: document.body.dataset.stage,
      scrollWidth: document.documentElement.scrollWidth,
      telemetryHidden: document.querySelector("#telemetry")?.hidden ?? null,
      logPose: document.querySelectorAll(".log-pose").length,
      sceneLabels: Array.from(document.querySelectorAll(".scene-meta__eyebrow")).map((n) => n.textContent?.trim()),
    }));
    console.log(label, stage, JSON.stringify(state));
  }

  await page.evaluate(() => window.__led?.openQuickView());
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/${label}-quickview.png` });
  console.log(`${label} QUICKVIEW`, JSON.stringify(await page.evaluate(() => ({
    open: document.body.classList.contains("quickview-open"),
    dialogOpen: document.querySelector("#quickview")?.open ?? null,
    scrollHeight: document.querySelector(".quickview__scroll")?.scrollHeight ?? null,
  }))));
  await page.evaluate(() => window.__led?.closeQuickView());
  await context.close();
}

async function mobile() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  watch(page, "mobile-390x844");
  await page.goto(`${base}/?tier=low`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/mobile-390-home.png` });

  for (const stage of stages.slice(1)) {
    await page.evaluate((id) => {
      const el = document.getElementById(`flow-${id}`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: "auto" });
    }, stage);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${outDir}/mobile-390-${stage}.png` });
  }

  const metrics = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const style = header ? getComputedStyle(header) : null;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      headerBg: style?.backgroundColor ?? null,
      headerBorder: style?.borderBottomWidth ?? null,
      headerBlur: style?.backdropFilter ?? style?.webkitBackdropFilter ?? null,
      flowSections: document.querySelectorAll(".flow-document .static-section").length,
    };
  });
  console.log("mobile", JSON.stringify(metrics));

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.__led?.openQuickView());
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/mobile-390-quickview.png` });
  console.log("MOBILE QUICKVIEW", JSON.stringify(await page.evaluate(() => ({
    open: document.body.classList.contains("quickview-open"),
    dialogOpen: document.querySelector("#quickview")?.open ?? null,
  }))));
  await context.close();
}

await desktop(1440, 900, "1440x900");
await desktop(1366, 768, "1366x768");
await mobile();
console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
