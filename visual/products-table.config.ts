import path from "node:path";
import { defineConfig } from "@playwright/test";
import base from "./grid-comparison.config.ts";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".cache/products-table");
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: "http://localhost:6012" },
  testMatch: "products-table.spec.ts",
  outputDir: path.join(output, "test-results"),
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(output, "report"), open: "never" }],
    ["json", { outputFile: path.join(output, "results.json") }],
  ],
  webServer: {
    command:
      "node scripts/preview-static.mjs .cache/visual/storybook --port 6012",
    cwd: root,
    url: "http://localhost:6012",
    reuseExistingServer: false,
    timeout: 30_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
});
