import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { root, cache, readBuild } from "./runtime.ts";

const [command, ...args] = process.argv.slice(2);
const env = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: path.join(root, ".cache/ms-playwright"),
  STORYBOOK_DISABLE_TELEMETRY: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  ASTRO_TELEMETRY_DISABLED: "1",
};
const cli = path.join(root, "node_modules/@playwright/test/cli.js");
function execute(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...arguments_], {
      cwd: root,
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
    for (const signal of ["SIGINT", "SIGTERM"])
      process.once(signal, () => child.kill(signal));
  });
}
if (command === "install") {
  process.exitCode = await execute(["install", "chromium"]);
} else if (command === "languages") {
  readBuild();
  process.exitCode = await execute([
    "test",
    "--config",
    "visual/playwright.languages.config.ts",
    ...args,
  ]);
} else if (command === "capture" || command === "compare" || command === "ui") {
  if (args.some((arg) => arg.includes("update-snapshot") || arg === "--headed"))
    throw new Error(
      "Reference captures use the recorded headless profile and forbid automatic updates",
    );
  const build = readBuild();
  const id = new Date().toISOString().replace(/[:]/g, "-");
  const directory = path.join(cache, "runs", id);
  await mkdir(directory, { recursive: true });
  env.VISUAL_MODE = command === "compare" ? "compare" : "capture";
  env.VISUAL_RUN_ID = id;
  await rm(path.join(cache, "results.json"), { force: true });
  await writeFile(
    path.join(directory, "request.json"),
    JSON.stringify(
      {
        id,
        mode: env.VISUAL_MODE,
        sourceHash: build.sourceHash,
        started: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );
  const code = await execute([
    "test",
    "--config",
    "visual/playwright.config.ts",
    ...(command === "ui" ? ["--ui"] : []),
    ...args,
  ]);
  if (existsSync(path.join(cache, "results.json"))) {
    const { createReview } = await import("./review.ts");
    await createReview(id, code);
    process.exitCode = code;
  } else {
    console.log(
      "No tests produced a report; the previous visual review was preserved.",
    );
    process.exitCode = code || (command === "ui" ? 0 : 1);
  }
} else if (command === "approve") {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(root, "visual/promote.ts"), ...args],
      { cwd: root, env, stdio: "inherit" },
    );
    child.once("error", reject);
    child.once("exit", (value) => resolve(value ?? 1));
  });
  process.exitCode = code;
} else if (command === "report") {
  process.exitCode = await execute([
    "show-report",
    path.join(cache, "playwright-report"),
    "--host",
    "localhost",
    "--port",
    "9323",
    ...args,
  ]);
} else {
  throw new Error(
    "Usage: node visual/cli.mjs install|languages|capture|compare|ui|report|approve",
  );
}
