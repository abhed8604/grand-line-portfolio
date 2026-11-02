import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:4173";
const out = "/tmp/opencode/led-audit-1440";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => messages.push(`pageerror: ${e.stack}`));
await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(3000);

const stages = ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"];
for (const id of stages) {
  await page.evaluate((s) => window.__led.story.goTo(s, true), id);
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `${out}/${id}.png` });
}

const metrics = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { sel, size: s.fontSize, line: s.lineHeight, color: s.color, family: s.fontFamily, w: Math.round(r.width), h: Math.round(r.height) };
  };
  return [
    pick(".scene.is-active .body-copy"),
    pick(".scene-meta__eyebrow"),
    pick(".scene-meta__theme"),
    pick(".micro-label"),
    pick(".fact-list dt"),
    pick(".fact-list dd"),
    pick(".tag-list li"),
    pick(".copy-button"),
    pick(".hero-copy__availability"),
    pick(".about-panel .lead"),
    pick(".education-panel__intro"),
    pick(".contact-link__label"),
    pick(".log-pose"),
  ];
});

const layout = await page.evaluate(() => {
  const sels = [".site-header", ".nav-rail", ".log-pose", ".scene-meta", ".hero-copy", ".about-panel", ".education-panel", ".experience-panel", ".resume-side", ".contact-panel", ".site-footer"];
  return sels.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, missing: true };
    const r = el.getBoundingClientRect();
    return { sel, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) };
  });
});

console.log("METRICS", JSON.stringify(metrics, null, 2));
console.log("LAYOUT", JSON.stringify(layout, null, 2));
console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
