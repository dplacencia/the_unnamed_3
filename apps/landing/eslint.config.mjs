import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**", ".astro/**", "public/**", "node_modules/**"]),
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,astro}"],
    extends: [tseslint.configs.recommended],
  },
  ...astro.configs.recommended,
  {
    files: ["**/*.astro"],
    // pnpm's strict dependency boundaries prevent the plugin's parser auto-detection.
    processor: "astro/client-side-ts",
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ["**/*.astro/*.ts"],
    languageOptions: { parser: tseslint.parser },
  },
]);
