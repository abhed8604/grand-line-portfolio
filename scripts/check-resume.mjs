import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const sourceFile = await readFile(new URL("../src/resume.ts", import.meta.url), "utf8");
const sourceMatch = sourceFile.match(/export const RESUME_SOURCE = `([\s\S]*?)`;/);
if (!sourceMatch) {
  throw new Error("Could not read RESUME_SOURCE from src/resume.ts");
}

const allowed = `${sourceMatch[1]}\nNovember 2026`;
const port = 4174;
const base = process.env.BASE_URL ?? `http://127.0.0.1:${port}`;
let server = null;

if (!process.env.BASE_URL) {
  server = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port)],
    { stdio: "ignore" },
  );
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(base);
      if (response.ok) break;
    } catch {
      // The preview server is still starting.
    }
    await delay(250);
  }
}

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/?tier=lite`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), {
    timeout: 45000,
  });
  await page.locator(".quick-button").click();
  await page.locator("#quickview").waitFor({ state: "visible" });
  await page.waitForTimeout(250);

  const rendered = await page.locator("#quickview").innerText();
  const tokens = [...new Set(rendered.match(/\d[\d,]*(?:\.\d+)?(?:%|\+)?/g) ?? [])];
  const missing = tokens.filter((token) => !allowed.includes(token));

  if (missing.length) {
    throw new Error(`Quick View contains facts missing from RESUME_SOURCE: ${missing.join(", ")}`);
  }

  console.log(
    `Resume parity OK: ${tokens.length} numeric/date tokens found; ${rendered.length} characters checked.`,
  );
} finally {
  await browser.close();
  server?.kill("SIGTERM");
}
