import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const requireApp = createRequire(
  path.join(root, "apps/backoffice/package.json"),
);
const { build } = await import(pathToFileURL(requireApp.resolve("vite")).href);
const output = path.join(root, ".cache/grid-comparison/payload");
await fs.mkdir(output, { recursive: true });
const table = JSON.stringify(requireApp.resolve("@tanstack/react-table"));
const virtual = JSON.stringify(
  path.join(
    path.dirname(requireApp.resolve("@tanstack/react-virtual/package.json")),
    "dist/esm/index.js",
  ),
);
// Resolve the ESM package entry rather than the CommonJS require entry.
const tabulatorRoot = path.dirname(
  path.dirname(path.dirname(requireApp.resolve("tabulator-tables"))),
);
const tabulator = JSON.stringify(
  path.join(tabulatorRoot, "dist/js/tabulator_esm.mjs"),
);
const css = JSON.stringify(path.join(tabulatorRoot, "dist/css/tabulator.css"));
const selected =
  "FilterModule, SortModule, FrozenColumnsModule, FormatModule, EditModule, ValidateModule, KeybindingsModule, ClipboardModule, SelectRangeModule, ResizeColumnsModule, MoveColumnsModule, ExportModule";
const probes = {
  tanstack: `export {useTable, tableFeatures, columnFilteringFeature, columnOrderingFeature, columnVisibilityFeature, columnSizingFeature, columnPinningFeature, rowSortingFeature, rowExpandingFeature, cellSelectionFeature, createFilteredRowModel, createSortedRowModel} from ${table};\nexport {useVirtualizer} from ${virtual};`,
  "tabulator-selected": `import {Tabulator, ${selected}} from ${tabulator};\nimport ${css};\nTabulator.registerModule([${selected}]);\nexport {Tabulator};`,
  "tabulator-full": `export {TabulatorFull} from ${tabulator};\nimport ${css};`,
};
const results = [];
for (const [name, source] of Object.entries(probes)) {
  const entry = path.join(output, `${name}.mjs`);
  const outDir = path.join(output, name);
  await fs.writeFile(entry, source);
  await build({
    configFile: false,
    root,
    logLevel: "error",
    build: {
      outDir,
      emptyOutDir: true,
      minify: true,
      cssMinify: true,
      sourcemap: false,
      lib: { entry, formats: ["es"], fileName: "vendor" },
      rolldownOptions: { external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/] },
    },
  });
  const files = [];
  for (const file of await fs.readdir(outDir)) {
    const bytes = await fs.readFile(path.join(outDir, file));
    files.push({
      file,
      bytes: bytes.length,
      gzip: gzipSync(bytes, { level: 9 }).length,
    });
  }
  results.push({ name, files });
}
const report = {
  method:
    "Vite 8.3.7 production ES-library probes; minification enabled; React/ReactDOM external; gzip level 9. Vendor modules only, excluding adapter/host code and shared TailAdmin styling; Tabulator CSS included. Selected module list exactly matches the evaluated adapter. Full Tabulator is an additional breadth/payload reference.",
  results,
};
await fs.writeFile(
  path.join(output, "results.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
