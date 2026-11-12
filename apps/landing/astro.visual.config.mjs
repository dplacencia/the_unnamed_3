import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import base from "./astro.config.mjs";

// Selected only by visual-tooling commands; normal app builds never inject these routes.
export default defineConfig({
  ...base,
  outDir: "../../.cache/visual/landing-gallery",
  cacheDir: "../../.cache/visual/astro",
  integrations: [
    ...(base.integrations ?? []),
    {
      name: "local-visual-gallery",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          injectRoute({
            pattern: "/__visual",
            entrypoint: fileURLToPath(
              new URL("./visual/gallery.astro", import.meta.url),
            ),
          });
          injectRoute({
            pattern: "/__visual/foundation/[locale]",
            entrypoint: fileURLToPath(
              new URL("./visual/foundation.astro", import.meta.url),
            ),
          });
        },
      },
    },
  ],
});
