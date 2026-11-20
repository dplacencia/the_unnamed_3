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
    "receipt-feedback.spec.ts",
    "stock-lookup.spec.ts",
    "daily-stock.spec.ts",
    "pending-receipt-inspection.spec.ts",
    "pending-movements-browsing.spec.ts",
    "core-hierarchy.spec.ts",
    "core-merchant-workspace.spec.ts",
    "core-account-security.spec.ts",
    "owner-journey.spec.ts",
    "owner-first-use.spec.ts",
    "stock-departure.spec.ts",
    "departure-feedback.spec.ts",
    "pending-resolution.spec.ts",
    "pending-release-guidance.spec.ts",
    "pending-receipt-quantity.spec.ts",
    "pending-duplicate-review.spec.ts",
    "stock-commitments.spec.ts",
    "inventory-setup.spec.ts",
    "core-team.spec.ts",
    "core-employee-accounts.spec.ts",
    "core-employee-credentials.spec.ts",
    "core-employee-login-code.spec.ts",
    "product-lifecycle.spec.ts",
    "core-capability-enablement.spec.ts",
    "channel-availability.spec.ts",
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
