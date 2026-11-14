import { defineConfig } from "@playwright/test";
import path from "node:path";
import { chromiumArgs } from "./profiles.ts";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".cache/grid-comparison");

export default defineConfig({
  testDir: path.join(import.meta.dirname, "tests"),
  testMatch: "grid-comparison.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: path.join(output, "test-results"),
  updateSnapshots: "none",
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(output, "report"), open: "never" }],
    ["json", { outputFile: path.join(output, "results.json") }],
  ],
  use: {
    browserName: "chromium",
    headless: true,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    reducedMotion: "reduce",
    launchOptions: { args: chromiumArgs },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "node scripts/preview-static.mjs .cache/grid-comparison/storybook --port 6010",
    cwd: root,
    url: "http://localhost:6010",
    reuseExistingServer: false,
    timeout: 30_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
});
