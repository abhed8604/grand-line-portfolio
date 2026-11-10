import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: /.*\.test\.ts/,
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1366, height: 768 },
    launchOptions: {
      args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
    },
  },
  webServer: {
    command: "npm run dev -- --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
