import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "node:path";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: [
    "./stories/**/*.stories.tsx",
    ...(process.env.IRIN_GRID_COMPARISON === "1"
      ? ["./evaluation/**/*.stories.tsx"]
      : []),
  ],
  addons: ["@storybook/addon-docs"],
  staticDirs: [
    "../public",
    {
      from: path.resolve(import.meta.dirname, "../../../.cache/visual/fonts"),
      to: "/__visual-fonts",
    },
  ],
  core: { disableTelemetry: true },
  async viteFinal(base) {
    return mergeConfig(base, {
      plugins: [svgr({ include: "**/*.svg" })],
      resolve: { tsconfigPaths: true },
    });
  },
};

export default config;
