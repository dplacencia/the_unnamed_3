import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { defaultLocale, locales } from "./src/i18n/locales.ts";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
