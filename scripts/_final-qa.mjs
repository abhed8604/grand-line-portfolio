import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:4173";
const out = "/tmp/opencode/led-final-qa";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

async function capture(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const messages = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
  await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await page.waitForTimeout(1000);

  for (const id of ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"]) {
    await page.evaluate((stage) => window.__led.story.goTo(stage, true), id);
    await page.evaluate(() => {
      const sim = window.__led.engine.sim;
      sim.__qaStart = sim.time;
      sim.__qaTarget = sim.targetTime;
    });
    await page.waitForFunction(
      () => {
        const sim = window.__led?.engine?.sim;
        if (!sim || sim.__qaStart === undefined) return false;
        return sim.time - Math.max(sim.__qaStart, sim.__qaTarget) > 3.4;
      },
      null,
      { timeout: 60000 },
    );
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${out}/${label}-${id}.png` });
    const state = await page.evaluate(() => ({
      stage: document.body.dataset.stage,
      fps: document.querySelector("[data-engine-fps]")?.textContent,
      quality: window.__led.engine.activeQuality,
    }));
    console.log(label, id, JSON.stringify(state));
  }

  console.log(`${label} MESSAGES`, JSON.stringify(messages));
  await page.close();
}

await capture(1366, 768, "1366");
await capture(1440, 900, "1440");
await browser.close();
