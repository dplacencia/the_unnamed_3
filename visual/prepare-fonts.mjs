import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  copyFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "apps/backoffice/out");
const destination = path.join(root, ".cache/visual/fonts");
await mkdir(destination, { recursive: true });
const files = await readdir(path.join(output, "_next/static"), {
  recursive: true,
});
const rules = [];
const copied = new Map();
for (const filename of files.filter((name) => name.endsWith(".css"))) {
  const cssPath = path.join(output, "_next/static", filename);
  const css = await readFile(cssPath, "utf8");
  for (const match of css.matchAll(/@font-face\s*\{[^{}]*\}/g)) {
    if (!/font-family:[^;]*Outfit/i.test(match[0]) || !/url\(/.test(match[0]))
      continue;
    let rule = match[0].replace(/font-family:[^;]+;/i, 'font-family:"Outfit";');
    for (const urlMatch of [...rule.matchAll(/url\(([^)]+)\)/g)]) {
      const original = urlMatch[1].replace(/["']/g, "");
      const source = original.startsWith("/")
        ? path.join(output, original)
        : path.resolve(path.dirname(cssPath), original);
      if (!source.startsWith(output + path.sep))
        throw new Error("Font path outside app output");
      const basename = path.basename(source);
      await copyFile(source, path.join(destination, basename));
      copied.set(
        basename,
        createHash("sha256")
          .update(await readFile(source))
          .digest("hex"),
      );
      rule = rule.replace(urlMatch[0], `url("/__visual-fonts/${basename}")`);
    }
    rules.push(rule);
  }
}
if (!rules.length)
  throw new Error(
    "No built Outfit font found. Run pnpm build:backoffice first.",
  );
await writeFile(
  path.join(destination, "fonts.css"),
  [...new Set(rules)].join("\n") + "\n",
);
await writeFile(
  path.join(destination, "manifest.json"),
  JSON.stringify(Object.fromEntries([...copied].sort()), null, 2) + "\n",
);
console.log(
  `Prepared ${copied.size} original app font files for local visual previews`,
);
