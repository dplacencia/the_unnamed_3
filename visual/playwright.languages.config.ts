import { defineConfig } from "@playwright/test";
import path from "node:path";
import base from "./playwright.config.ts";
import { cache } from "./runtime.ts";

export default defineConfig({
  ...base,
  testMatch: [
    "catalogue-languages.spec.ts",
    "navigation.spec.ts",
    "products-table.spec.ts",
    "products-recovery.spec.ts",
    "products-filters.spec.ts",
    "products-feedback.spec.ts",
    "products-browsing.spec.ts",
    "products-creation.spec.ts",
    "stock-receipt.spec.ts",
    "stock-lookup.spec.ts",
    "pending-receipt-inspection.spec.ts",
    "pending-movements-browsing.spec.ts",
  ],
  use: { ...base.use, baseURL: "http://localhost:6006" },
  projects: [
    { name: "languages", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  metadata: {
    workflow: "Live catalogue language regressions; no reference acceptance",
  },
  outputDir: path.join(cache, "language-tests/test-results"),
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: path.join(cache, "language-tests/report"),
        open: "never",
      },
    ],
  ],
});
