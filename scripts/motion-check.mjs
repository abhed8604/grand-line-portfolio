import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    messages.push(`[${message.type()}] ${message.text()}`);
  }
});
page.on("pageerror", (error) => messages.push(`[pageerror] ${error.stack}`));

await page.goto("http://127.0.0.1:4173/?tier=high", { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
await page.waitForTimeout(6000);

const uniforms = await page.evaluate(() => {
  const engine = window.__led?.engine;
  const sim = engine?.sim?.velocityUniforms;
  const points = engine?.pointsMaterial?.uniforms;
  return {
    idleDrift: sim?.uIdleDrift?.value,
    returnSpeed: sim?.uReturnSpeed?.value,
    pushRadius: sim?.uPushRadius?.value,
    pushStrength: sim?.uPushStrength?.value,
    rippleStrength: sim?.uRippleStrength?.value,
    rippleLifetime: sim?.uRippleLifetime?.value,
    vertexIdleDrift: points?.uIdleDrift?.value,
    vertexPushRadius: points?.uPushRadius?.value,
  };
});
console.log("UNIFORMS", JSON.stringify(uniforms));

await page.screenshot({ path: "/tmp/opencode/motion-idle-a.png" });
await page.waitForTimeout(2200);
await page.screenshot({ path: "/tmp/opencode/motion-idle-b.png" });

await page.mouse.move(720, 450);
for (let i = 0; i < 16; i += 1) {
  await page.mouse.move(720 + Math.sin(i * 0.5) * 240, 450 + Math.cos(i * 0.7) * 150);
  await page.waitForTimeout(35);
}
await page.screenshot({ path: "/tmp/opencode/motion-cursor.png" });
await page.waitForTimeout(1800);
await page.screenshot({ path: "/tmp/opencode/motion-returned.png" });

console.log("MESSAGES", messages.length ? JSON.stringify(messages, null, 2) : "none");
await browser.close();
