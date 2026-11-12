import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { auditCoverage } from "./core.ts";
import { cache, componentSources, inventory } from "./runtime.ts";

const index = JSON.parse(
  readFileSync(path.join(cache, "storybook/index.json"), "utf8"),
) as { entries: Record<string, { type: string }> };
const stories = Object.entries(index.entries)
  .filter(([, entry]) => entry.type === "story")
  .map(([id]) => id);
const sources = componentSources();
const report = {
  ...auditCoverage(sources, inventory.entries, stories),
  sourceModules: sources.length,
  catalogueStories: stories.length,
  viewEntries: inventory.entries.filter((entry) => entry.kind === "view")
    .length,
  namedScenarios: inventory.entries.reduce(
    (total, entry) => total + entry.cases.length,
    0,
  ),
  scope: inventory.coverageScope,
};
for (const entry of inventory.entries) {
  if (entry.kind === "story" && !entry.storyId)
    throw new Error(`Story entry has no catalogue identity: ${entry.id}`);
  const scenarios = entry.cases.map((scenario) => scenario.id);
  if (new Set(scenarios).size !== scenarios.length)
    throw new Error(`Duplicate scenario in ${entry.id}`);
  if (!entry.cases.length)
    throw new Error(`Inventory entry has no scenarios: ${entry.id}`);
  if (entry.kind === "view" && (!entry.app || !entry.path))
    throw new Error(`Invalid view entry: ${entry.id}`);
}
writeFileSync(
  path.join(cache, "coverage.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
