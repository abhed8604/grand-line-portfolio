import { test, expect, type Page } from "@playwright/test";

type LedWindow = Window & {
  __led: {
    story: {
      goTo(id: string, immediate?: boolean): void;
    };
    engine: {
      sim: {
        targetTexture: {
          image: { data: Float32Array };
        };
      };
    };
  };
};

async function boot(page: Page): Promise<void> {
  await page.goto("/?tier=lite");
  await page.waitForFunction(
    () => !document.body.classList.contains("is-loading"),
    undefined,
    { timeout: 45_000 },
  );
  await page.waitForFunction(
    () => document.body.dataset.ledState === "settled",
    undefined,
    { timeout: 20_000 },
  );
}

test("chapter activates only after the scroll arrives", async ({ page }) => {
  await boot(page);
  await page.evaluate(() => {
    (window as unknown as LedWindow).__led.story.goTo("home", true);
  });
  await page.waitForTimeout(250);
  await expect(page.locator("body")).toHaveAttribute("data-stage", "home");

  await page.click('[data-goto-nav="projects"]');
  await expect(page.locator("body")).toHaveAttribute("data-stage", "home");

  await page.waitForFunction(
    () => document.body.dataset.stage === "projects",
    undefined,
    { timeout: 8_000 },
  );
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(2000);
});

test("resize rebuilds the target cloud for an inactive chapter", async ({ page }) => {
  await boot(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    (window as unknown as LedWindow).__led.story.goTo("about", true);
  });

  await page.waitForFunction(
    () => {
      const data = (window as unknown as LedWindow).__led.engine.sim.targetTexture.image.data;
      let maxX = -Infinity;
      for (let index = 0; index < data.length; index += 4) {
        maxX = Math.max(maxX, data[index]);
      }
      return maxX > 300 && maxX < 560;
    },
    undefined,
    { timeout: 15_000 },
  );
});
