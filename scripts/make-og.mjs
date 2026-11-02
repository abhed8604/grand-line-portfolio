/**
 * Captures /public/og.png from the live hero at 1200 × 630.
 * Run the dev or preview server first, then: node scripts/make-og.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const root = resolve(import.meta.dirname, "..");
const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
    timeout: 45000,
  });
  await page.evaluate(() => window.__led?.story?.goTo("home", true));
  await page.waitForTimeout(5000);
  await mkdir(resolve(root, "public"), { recursive: true });
  await page.screenshot({
    path: resolve(root, "public/og.png"),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log("og.png written (1200 × 630)");
} finally {
  await browser.close();
}
