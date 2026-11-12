import { spawn } from "node:child_process";
import { root, cache, readBuild } from "./runtime.ts";
import path from "node:path";

const build = readBuild();
const targets = [
  { directory: path.join(cache, "storybook"), port: 6006 },
  { directory: path.join(root, "apps/backoffice/out"), port: 3100 },
  { directory: path.join(root, "apps/landing/dist"), port: 4321 },
  { directory: path.join(cache, "landing-gallery"), port: 4323 },
];
const children = targets.map(({ directory, port }) =>
  spawn(
    process.execPath,
    [
      path.join(root, "scripts/preview-static.mjs"),
      directory,
      "--port",
      String(port),
      "--identity",
      build.sourceHash,
    ],
    { cwd: root, stdio: "inherit" },
  ),
);
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
}
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, stop);
for (const child of children) {
  child.on("error", (error) => {
    console.error(error);
    process.exitCode = 1;
    stop();
  });
  child.on("exit", (code) => {
    if (!stopping) {
      process.exitCode = code || 1;
      stop();
    }
  });
}
