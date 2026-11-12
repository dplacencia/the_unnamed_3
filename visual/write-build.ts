import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cache, sourceFingerprint } from "./runtime.ts";
mkdirSync(cache, { recursive: true });
writeFileSync(
  path.join(cache, "build.json"),
  JSON.stringify({ sourceHash: sourceFingerprint() }, null, 2) + "\n",
);
console.log("Recorded the visual artifacts' source fingerprint");
