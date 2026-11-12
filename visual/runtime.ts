import { globSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { release } from "node:os";
import { fileURLToPath } from "node:url";
import { digest, type Environment } from "./core.ts";
import { chromiumArgs } from "./profiles.ts";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const cache = path.join(root, ".cache/visual");
export type Scenario = { id: string; action?: string };
export type Entry = {
  id: string;
  title: string;
  kind: "story" | "view";
  sources: string[];
  storyId?: string;
  app?: "backoffice" | "landing" | "astroGallery";
  path?: string;
  locale?: string;
  cases: Scenario[];
  limitation?: string;
  expectedStatus?: number;
};
export const inventory = JSON.parse(
  readFileSync(path.join(root, "visual/inventory.json"), "utf8"),
) as { version: number; coverageScope: string; entries: Entry[] };

export function componentSources() {
  return [
    ...globSync(
      [
        "apps/backoffice/src/**/*.tsx",
        "apps/backoffice/src/icons/*.svg",
        "apps/landing/src/**/*.astro",
      ],
      { cwd: root },
    ),
  ]
    .filter((name) => !name.includes(".test.") && !name.includes("/src/test/"))
    .sort();
}

export function sourceFingerprint(sourceRoot = root) {
  const files = [
    ...globSync(
      [
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
        ".nvmrc",
        "apps/*/package.json",
        "apps/*/tsconfig.json",
        "apps/backoffice/src/**/*.{ts,tsx,js,jsx,mjs,cjs,css,json,svg}",
        "apps/backoffice/.storybook/**/*.{ts,tsx,css,html,json}",
        "apps/backoffice/public/**/*",
        "apps/landing/public/**/*",
        "apps/backoffice/next.config.ts",
        "apps/backoffice/postcss.config.mjs",
        "apps/landing/src/**/*.{ts,tsx,js,jsx,mjs,cjs,astro,css,json,svg}",
        "apps/landing/visual/**/*.astro",
        "apps/landing/astro*.mjs",
        "visual/**/*.{ts,mts,mjs,json}",
        "scripts/preview-static.mjs",
      ],
      { cwd: sourceRoot },
    ),
  ]
    .filter(
      (name) =>
        !name.includes(".test.") &&
        !name.endsWith("/references.json") &&
        statSync(path.join(sourceRoot, name)).isFile(),
    )
    .sort();
  return digest(
    files
      .map(
        (name) =>
          `${name}\0${digest(readFileSync(path.join(sourceRoot, name)))}`,
      )
      .join("\n"),
  );
}

export function rendererEnvironment(browserVersion: string): Environment {
  if (process.platform !== "darwin")
    throw new Error(
      "Initial visual references are configured for the approved Mac renderer",
    );
  const pkg = JSON.parse(
    readFileSync(
      path.join(root, "node_modules/@playwright/test/package.json"),
      "utf8",
    ),
  );
  return {
    platform: process.platform,
    arch: process.arch,
    osRelease: release(),
    headless: true,
    launchArgs: JSON.stringify(chromiumArgs),
    browser: browserVersion,
    playwright: pkg.version,
    fonts: digest(readFileSync(path.join(cache, "fonts/manifest.json"))),
  };
}

export function readBuild() {
  const build = JSON.parse(
    readFileSync(path.join(cache, "build.json"), "utf8"),
  ) as { sourceHash: string };
  if (build.sourceHash !== sourceFingerprint())
    throw new Error(
      "Visual build is stale. Run pnpm visual:prepare before serving or capturing.",
    );
  return build;
}
