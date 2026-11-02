import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = process.env.OUT_DIR ?? "/tmp/opencode/led-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

async function makePage(width, height, query = "?tier=high", dpr = 1) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dpr });
  const messages = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      messages.push(`[${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`[pageerror] ${error.stack}`));
  await page.goto(`${base}/${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
    timeout: 45000,
  });
  await page.waitForTimeout(3200);
  return { page, messages };
}

const desktop = await makePage(1366, 768);
const state = await desktop.page.evaluate(() => ({
  mode: window.__led?.mode,
  stage: document.body.dataset.stage,
  quality: window.__led?.engine?.activeQuality,
  points: window.__led?.engine?.activePoints,
  fps: document.querySelector("[data-engine-fps]")?.textContent,
}));
console.log("DESKTOP", JSON.stringify(state));

for (const id of ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"]) {
  await desktop.page.evaluate((stage) => window.__led?.story?.goTo(stage, true), id);
  await desktop.page.waitForTimeout(4200);
  await desktop.page.screenshot({ path: `${outDir}/desktop-${id}-1366.png` });
}

const mobile = await makePage(390, 844, "?tier=low");
console.log(
  "MOBILE",
  JSON.stringify(
    await mobile.page.evaluate(() => ({
      mode: window.__led?.mode,
      stage: document.body.dataset.stage,
      quality: window.__led?.engine?.activeQuality,
      points: window.__led?.engine?.activePoints,
      heroH1: (() => {
        const h1 = document.querySelector(".flow-hero h1");
        if (!h1) return null;
        const style = getComputedStyle(h1);
        const rect = h1.getBoundingClientRect();
        return { display: style.display, width: rect.width, height: rect.height, text: h1.textContent };
      })(),
      heroCopyTop: document.querySelector(".flow-hero__copy")?.getBoundingClientRect().top,
      heroCopyBottom: document.querySelector(".flow-hero__copy")?.getBoundingClientRect().bottom,
      particleTargetHeight: document.querySelector("#led-canvas")?.getBoundingClientRect().height,
    })),
  ),
);
await mobile.page.screenshot({ path: `${outDir}/mobile-home-390.png` });
await mobile.page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.95));
await mobile.page.waitForTimeout(500);
await mobile.page.screenshot({ path: `${outDir}/mobile-document-390.png` });

console.log("DESKTOP MESSAGES", JSON.stringify(desktop.messages, null, 2));
console.log("MOBILE MESSAGES", JSON.stringify(mobile.messages, null, 2));
await browser.close();
