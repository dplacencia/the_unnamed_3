import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "apps/**",
    ".tools/**",
    ".cache/**",
    ".pnpm-store/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/out/**",
    "**/coverage/**",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,mts}"],
    extends: [tseslint.configs.recommended],
  },
]);
