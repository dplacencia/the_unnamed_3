import { defineConfig } from "@playwright/test";
import path from "node:path";
import { cache, root } from "./runtime.ts";
import { profiles, chromiumArgs } from "./profiles.ts";

const mode = process.env.VISUAL_MODE === "compare" ? "compare" : "capture";
export default defineConfig({
  testDir: path.join(import.meta.dirname, "tests"),
  testMatch: "catalogue.spec.ts",
  fullyParallel: true,
  forbidOnly: true,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixels: 0,
      threshold: 0.01,
    },
  },
  updateSnapshots: "none",
  outputDir: path.join(cache, "test-results"),
  snapshotPathTemplate: path.join(
    root,
    "visual/references/{projectName}/{arg}{ext}",
  ),
  metadata: {
    runId: process.env.VISUAL_RUN_ID ?? "",
    workflow:
      mode === "capture"
        ? "Candidate capture; visual approval pending"
        : "Compare explicitly approved references",
  },
  reporter: [
    ["list"],
    [
      "html",
      { outputFolder: path.join(cache, "playwright-report"), open: "never" },
    ],
    ["json", { outputFile: path.join(cache, "results.json") }],
  ],
  use: {
    browserName: "chromium",
    headless: true,
    launchOptions: { args: chromiumArgs },
    deviceScaleFactor: 1,
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: profiles.map((profile) => ({
    name: profile.name,
    use: { viewport: profile.viewport, colorScheme: profile.theme },
  })),
  webServer: {
    command: "node visual/serve.ts",
    cwd: root,
    url: "http://localhost:6006",
    reuseExistingServer: true,
    timeout: 30_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
});
