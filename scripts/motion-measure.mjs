import { chromium } from "@playwright/test";

const WIDTH = 1440;
const HEIGHT = 900;
const SIM_W = 512;
const SIM_H = 293;

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/?tier=high", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(6000);

await page.evaluate(() => {
  const engine = window.__led.engine;
  const sim = engine.sim;
  const read = () => {
    const index = sim.positionIndex;
    const target = sim.positionTargets[index];
    const buffer = new Float32Array(512 * 293 * 4);
    engine.renderer.readRenderTargetPixels(target, 0, 0, 512, 293, buffer);
    return Float32Array.from(buffer);
  };
  window.__snapshot = read;
  window.__baseline = read();
  engine.pause("measure");
});

const compare = async (label) => {
  const result = await page.evaluate(() => {
    const next = window.__snapshot();
    const base = window.__baseline;
    let count = 0;
    let max = 0;
    let sum = 0;
    for (let i = 0; i < next.length; i += 4) {
      const dx = next[i] - base[i];
      const dy = next[i + 1] - base[i + 1];
      const distance = Math.hypot(dx, dy);
      if (distance > 0.05) {
        count += 1;
        sum += distance;
        if (distance > max) max = distance;
      }
    }
    return { moved: count, max, mean: count ? sum / count : 0 };
  });
  console.log(label, JSON.stringify(result));
};

// Idle drift over 2.5 seconds.
await page.evaluate(() => window.__led.engine.resume("measure"));
await page.waitForTimeout(2500);
await page.evaluate(() => window.__led.engine.pause("measure"));
await compare("IDLE_2_5S");

// Stationary pointer held over the skull.
await page.mouse.move(360, 500);
await page.evaluate(() => window.__led.engine.resume("measure"));
await page.waitForTimeout(900);
await page.evaluate(() => window.__led.engine.pause("measure"));
await compare("POINTER_900MS");

// Clear pointer and let the spring settle.
await page.evaluate(() => window.__led.engine.clearPointer());
await page.evaluate(() => window.__led.engine.resume("measure"));
await page.waitForTimeout(400);
await page.evaluate(() => window.__led.engine.pause("measure"));
await compare("RETURN_400MS");
await page.evaluate(() => window.__led.engine.resume("measure"));
await page.waitForTimeout(700);
await page.evaluate(() => window.__led.engine.pause("measure"));
await compare("RETURN_1100MS");

// Single ripple.
await page.evaluate(() => {
  window.__led.engine.addRipple(360, 500, 1.5);
  window.__led.engine.resume("measure");
});
await page.waitForTimeout(180);
await page.evaluate(() => window.__led.engine.pause("measure"));
await compare("RIPPLE_180MS");

await browser.close();
