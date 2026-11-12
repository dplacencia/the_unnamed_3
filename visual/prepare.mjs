import { spawn } from "node:child_process";
import path from "node:path";
import { root } from "./runtime.ts";

const env = {
  ...process.env,
  STORYBOOK_DISABLE_TELEMETRY: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  ASTRO_TELEMETRY_DISABLED: "1",
};
const commands = [
  ["pnpm", ["build:backoffice"]],
  ["pnpm", ["build:landing"]],
  [process.execPath, ["visual/prepare-fonts.mjs"]],
  ["pnpm", ["build:storybook"]],
  [
    "pnpm",
    [
      "--filter",
      "./apps/landing",
      "exec",
      "astro",
      "build",
      "--config",
      "astro.visual.config.mjs",
    ],
  ],
  [process.execPath, ["visual/write-build.ts"]],
  [process.execPath, ["visual/coverage.ts"]],
];
for (const [command, args] of commands) {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (value) => resolve(value ?? 1));
  });
  if (code !== 0) process.exit(code);
}
console.log(`Visual artifacts ready under ${path.join(root, ".cache/visual")}`);
