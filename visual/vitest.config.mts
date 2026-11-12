import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { environment: "node", include: ["visual/**/*.test.ts"] },
});
