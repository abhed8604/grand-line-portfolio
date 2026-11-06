export async function waitForSettled(page, label = "page") {
  try {
    await page.waitForFunction(() => document.body.dataset.ledState === "settled", {
      timeout: 8000,
    });
  } catch (error) {
    throw new Error(`LED morph did not settle for ${label} within 8s`, { cause: error });
  }
  await page.evaluate(() => document.fonts.ready);
}
