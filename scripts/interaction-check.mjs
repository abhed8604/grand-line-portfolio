/**
 * Behavioural QA: keyboard, dialogs, project panels, easter eggs, overflow.
 * Requires the dev server at BASE_URL.
 */
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const results = [];
const messages = [];

function watch(page, label) {
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) messages.push(`${label} [${message.type()}] ${message.text()}`);
  });
  page.on("pageerror", (error) => messages.push(`${label} [pageerror] ${error.stack}`));
}

async function boot(page) {
  await page.goto(`${base}/?tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await page.waitForTimeout(2400);
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
watch(page, "desktop");
await boot(page);

results.push({
  label: "visible h1 count",
  value: await page.evaluate(() => Array.from(document.querySelectorAll("h1")).filter((el) => el.getClientRects().length).length),
});
results.push({
  label: "horizontal overflow",
  value: await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
});

// Nav dot to projects without instant jump.
await page.click('[data-goto-nav="projects"]');
await page.waitForTimeout(2600);
results.push({
  label: "nav -> projects",
  value: await page.evaluate(() => ({
    stage: document.body.dataset.stage,
    current: document.querySelector('[data-goto-nav="projects"]')?.getAttribute("aria-current"),
  })),
});

// Project row opens detail.
await page.click('[data-project="project-two"]');
await page.waitForTimeout(2500);
results.push({
  label: "project panel open",
  value: await page.evaluate(() => ({
    project: document.querySelector("[data-project-panel]:not([hidden])")?.getAttribute("data-project-panel"),
    indexHidden: document.querySelector("[data-project-index]")?.hasAttribute("hidden"),
    focused: document.activeElement?.tagName,
  })),
});

// Escape closes the project.
await page.keyboard.press("Escape");
await page.waitForTimeout(700);
results.push({
  label: "project escape close",
  value: await page.evaluate(() => ({
    indexHidden: document.querySelector("[data-project-index]")?.hasAttribute("hidden"),
    detailHidden: document.querySelector("[data-project-details]")?.hasAttribute("hidden"),
  })),
});

// Quick View opens and closes via Escape.
await page.click("[data-quick-view]");
await page.waitForTimeout(500);
results.push({
  label: "quickview open",
  value: await page.evaluate(() => ({
    open: document.querySelector("#quickview")?.hasAttribute("open"),
    bodyClass: document.body.classList.contains("quickview-open"),
    focused: document.activeElement?.getAttribute("data-close-quick") !== null,
  })),
});
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
results.push({
  label: "quickview escape close",
  value: await page.evaluate(() => ({
    open: document.querySelector("#quickview")?.hasAttribute("open"),
    bodyClass: document.body.classList.contains("quickview-open"),
  })),
});

// Copy email feedback.
await page.evaluate(() => window.__led?.story?.goTo("contact", true));
await page.waitForTimeout(800);
await page.click("[data-copy-email]");
await page.waitForTimeout(300);
results.push({
  label: "copy email toast",
  value: await page.evaluate(() => ({
    visible: document.querySelector(".toast")?.classList.contains("is-visible"),
    text: document.querySelector(".toast")?.textContent,
  })),
});

// Easter eggs.
for (const egg of ["hat", "ship", "mark"]) {
  const stage = egg === "hat" ? "home" : egg === "ship" ? "projects" : "contact";
  await page.evaluate((id) => window.__led?.story?.goTo(id, true), stage);
  await page.waitForTimeout(700);
  await page.evaluate((name) => document.querySelector(`[data-egg="${name}"]`)?.click(), egg);
  await page.waitForTimeout(900);
  results.push({
    label: `egg ${egg}`,
    value: await page.evaluate(() => document.querySelector(".toast")?.textContent?.slice(0, 80)),
  });
  await page.waitForTimeout(650);
}

// Layout clearance at 1440.
for (const stage of ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"]) {
  await page.evaluate((id) => window.__led?.story?.goTo(id, true), stage);
  await page.waitForTimeout(900);
  results.push({
    label: `clearance ${stage}`,
    value: await page.evaluate(() => {
      const footerTop = document.querySelector(".site-footer")?.getBoundingClientRect().top ?? window.innerHeight;
      const panels = Array.from(document.querySelectorAll(".scene:not([aria-hidden='true']) .about-panel, .scene:not([aria-hidden='true']) .skills-aside, .scene:not([aria-hidden='true']) .project-dock, .scene:not([aria-hidden='true']) .education-panel, .scene:not([aria-hidden='true']) .experience-panel, .scene:not([aria-hidden='true']) .resume-side, .scene:not([aria-hidden='true']) .contact-panel, .scene:not([aria-hidden='true']) .hero-copy"));
      return panels.map((panel) => {
        const rect = panel.getBoundingClientRect();
        return {
          className: panel.className.split(" ")[0],
          bottom: Math.round(rect.bottom),
          footerTop: Math.round(footerTop),
          overlapsFooter: rect.bottom > footerTop + 1,
          rightOverflow: Math.round(rect.right - window.innerWidth),
        };
      });
    }),
  });
}

await context.close();

// Mobile checks.
for (const width of [390, 320]) {
  const mobile = await browser.newContext({
    viewport: { width, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mobile.newPage();
  watch(mp, `mobile-${width}`);
  await mp.goto(`${base}/?tier=low`, { waitUntil: "networkidle" });
  await mp.waitForFunction(() => !document.body.classList.contains("is-loading"), { timeout: 45000 });
  await mp.waitForTimeout(1600);
  results.push({
    label: `mobile ${width} overflow`,
    value: await mp.evaluate(() => ({
      doc: document.documentElement.scrollWidth - window.innerWidth,
      header: document.querySelector(".site-header")?.getBoundingClientRect().right,
      contact: document.querySelector(".static-contact-list")?.getBoundingClientRect().right,
    })),
  });
  await mp.evaluate(() => window.__led?.openQuickView());
  await mp.waitForTimeout(500);
  results.push({
    label: `mobile ${width} quickview`,
    value: await mp.evaluate(() => ({
      open: document.querySelector("#quickview")?.hasAttribute("open"),
      width: document.querySelector("#quickview")?.getBoundingClientRect().width,
      scrollWidth: document.querySelector(".quickview__scroll")?.scrollWidth,
      clientWidth: document.querySelector(".quickview__scroll")?.clientWidth,
    })),
  });
  await mp.evaluate(() => window.__led?.closeQuickView());
  await mobile.close();
}

console.log("RESULTS", JSON.stringify(results, null, 2));
console.log("MESSAGES", JSON.stringify(messages, null, 2));
await browser.close();
