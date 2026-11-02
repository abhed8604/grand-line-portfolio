import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = "/tmp/opencode/led-verify-latest";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

async function settle(page, seconds = 3.4) {
  await page.evaluate(() => {
    const sim = window.__led.engine.sim;
    sim.__qaStart = sim.time;
    sim.__qaTarget = sim.targetTime;
  });
  await page.waitForFunction(
    (limit) => {
      const sim = window.__led?.engine?.sim;
      if (!sim || sim.__qaStart === undefined) return false;
      return sim.time - Math.max(sim.__qaStart, sim.__qaTarget) > limit;
    },
    3.4,
    { timeout: 60000 },
  );
  await page.waitForTimeout(250);
}

// Desktop 1366: the two latest CSS/canvas fixes, settled.
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  const messages = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
  await page.goto("http://127.0.0.1:4173/?tier=high", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  for (const id of ["about", "skills"]) {
    await page.evaluate((stage) => window.__led.story.goTo(stage, true), id);
    await settle(page);
    await page.screenshot({ path: `${out}/1366-${id}.png` });
    console.log("1366", id, await page.evaluate(() => window.__led.engine.activeQuality));
  }
  const boxes = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const r = el.getBoundingClientRect();
      return { sel, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
    };
    return [
      pick(".skills-field"),
      pick(".skill-cluster:nth-of-type(1)"),
      pick(".skill-cluster:nth-of-type(2)"),
      pick(".skill-cluster:nth-of-type(3)"),
      pick(".skill-cluster:nth-of-type(4)"),
      pick(".skills-aside"),
      pick(".scene-note--skills"),
    ];
  });
  console.log("SKILL BOXES", JSON.stringify(boxes, null, 2));
  console.log("1366 MESSAGES", JSON.stringify(messages));
  await page.close();
}

// Mobile 390 x 844: home, about, resume/document and contact.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const messages = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
  await page.goto("http://127.0.0.1:4173/?tier=low", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  for (const id of ["home", "about", "projects", "resume", "contact"]) {
    await page.evaluate((stage) => window.__led.goTo(stage), id);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${out}/390-${id}.png` });
  }
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    stage: document.body.dataset.stage,
  }));
  console.log("MOBILE OVERFLOW", JSON.stringify(overflow));
  console.log("MOBILE MESSAGES", JSON.stringify(messages));
  await page.close();
}

await browser.close();
