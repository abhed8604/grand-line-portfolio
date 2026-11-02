import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outDir = "/tmp/opencode/led-targets";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
  timeout: 45000,
});
await page.waitForTimeout(800);

for (const id of ["loader", "home", "about", "skills", "projects", "education", "experience", "resume", "contact", "one-piece"]) {
  const data = await page.evaluate(async (targetId) => {
    const factory = await import("/src/targets/target-factory.ts");
    return factory.paintTargetPreview(targetId, window.innerWidth, window.innerHeight);
  }, id);
  await writeFile(`${outDir}/${id}.png`, Buffer.from(data.split(",")[1], "base64"));
}

for (const id of ["about", "skills", "projects", "resume"]) {
  await page.evaluate((stage) => window.__led?.story?.goTo(stage, true), id);
  await page.waitForTimeout(4200);
  await page.screenshot({ path: `${outDir}/settled-${id}.png` });
}

console.log("done");
await browser.close();
