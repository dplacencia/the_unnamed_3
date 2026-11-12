import { mkdir, readFile, writeFile, copyFile, rename } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromiumArgs } from "./profiles.ts";
import { validatePromotion, type CaptureRun, type Reference } from "./core.ts";
import {
  root,
  cache,
  rendererEnvironment,
  sourceFingerprint,
} from "./runtime.ts";

const { values } = parseArgs({
  options: {
    run: { type: "string" },
    case: { type: "string", multiple: true },
    approval: { type: "string" },
  },
});
if (!values.run || !/^[0-9A-Za-z.-]+$/.test(values.run))
  throw new Error("An explicit reviewed run is required");
if (!values.case?.length || !values.approval?.trim())
  throw new Error(
    "Explicit reviewed cases and user approval evidence are required",
  );
const directory = path.join(cache, "runs", values.run);
const run = JSON.parse(
  await readFile(path.join(directory, "run.json"), "utf8"),
) as CaptureRun;
const images = new Map<string, Buffer>();
for (const id of values.case ?? []) {
  const candidate = run.cases.find((item) => item.id === id);
  if (!candidate || !/^[a-z0-9][a-z0-9.-]*\.png$/.test(candidate.file))
    throw new Error(`Unknown or unsafe candidate: ${id}`);
  images.set(id, await readFile(path.join(directory, candidate.file)));
}
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(root, ".cache/ms-playwright");
const { chromium } = await import("@playwright/test");
const browser = await chromium.launch({ args: chromiumArgs });
let selected;
try {
  selected = validatePromotion(run, {
    caseIds: values.case ?? [],
    approval: values.approval ?? "",
    sourceHash: sourceFingerprint(),
    environment: rendererEnvironment(browser.version()),
    images,
  });
} finally {
  await browser.close();
}
const registryPath = path.join(root, "visual/references.json");
const registry = JSON.parse(await readFile(registryPath, "utf8")) as {
  version: number;
  cases: Record<string, Reference>;
};
for (const candidate of selected) {
  if (!candidate.profile || !/^[a-z0-9-]+$/.test(candidate.profile))
    throw new Error("Invalid reviewed profile");
  const destination = path.join(root, "visual/references", candidate.profile);
  await mkdir(destination, { recursive: true });
  await copyFile(
    path.join(directory, candidate.file),
    path.join(destination, candidate.file),
  );
  registry.cases[candidate.id] = {
    sha256: candidate.sha256,
    environment: run.environment,
    approval: values.approval!,
    run: run.id,
    sourceHash: run.sourceHash,
    profileHash: candidate.profileHash,
  };
}
await writeFile(
  registryPath + ".tmp",
  JSON.stringify(registry, null, 2) + "\n",
);
await rename(registryPath + ".tmp", registryPath);
console.log(
  `Promoted ${selected.length} specifically reviewed references; no other cases were accepted`,
);
