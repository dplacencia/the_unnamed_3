import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("./prepare-fonts.mjs", import.meta.url));

function fixture(css: string) {
  const root = mkdtempSync(path.join(tmpdir(), "irin-built-fonts-"));
  const staticPath = path.join(root, "apps/backoffice/out/_next/static");
  mkdirSync(path.join(root, "visual"));
  mkdirSync(path.join(staticPath, "css"), { recursive: true });
  mkdirSync(path.join(staticPath, "media"));
  copyFileSync(script, path.join(root, "visual/prepare-fonts.mjs"));
  writeFileSync(path.join(staticPath, "css/app.css"), css);
  const bytes = Buffer.from("synthetic local font bytes for extraction only");
  writeFileSync(path.join(staticPath, "media/source.ttf"), bytes);
  return {
    root,
    bytes,
    destination: path.join(root, ".cache/visual/fonts"),
    run: () =>
      spawnSync(
        process.execPath,
        [path.join(root, "visual/prepare-fonts.mjs")],
        {
          encoding: "utf8",
        },
      ),
  };
}

describe("built local-font preparation", () => {
  for (const url of ["/_next/static/media/source.ttf", "../media/source.ttf"]) {
    it(`copies and fingerprints the actual local face using ${url}`, () => {
      const item = fixture(`
        @font-face { font-family: 'sourceSans3_abc'; src: url('${url}') format('truetype'); font-weight: 200 900; }
        @font-face { font-family: 'sourceSans3_Fallback'; src: local('Arial'); }
        @font-face { font-family: 'Unrelated'; src: url('/missing.woff2'); }
      `);
      try {
        const result = item.run();
        expect(result.status, result.stderr).toBe(0);
        expect(readFileSync(path.join(item.destination, "source.ttf"))).toEqual(
          item.bytes,
        );
        expect(
          JSON.parse(
            readFileSync(path.join(item.destination, "manifest.json"), "utf8"),
          ),
        ).toEqual({
          "source.ttf": createHash("sha256").update(item.bytes).digest("hex"),
        });
        const css = readFileSync(
          path.join(item.destination, "fonts.css"),
          "utf8",
        );
        expect(css).toContain('font-family:"Source Sans 3";');
        expect(css).toContain('url("/__visual-fonts/source.ttf")');
        expect(css).toContain("font-weight: 200 900");
        expect(css).not.toMatch(/Fallback|Unrelated/);
      } finally {
        rmSync(item.root, { recursive: true, force: true });
      }
    });
  }

  it("fails clearly when the selected production font is missing", () => {
    const item = fixture(
      "@font-face { font-family: Outfit; src: local('Arial'); }",
    );
    try {
      const result = item.run();
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("No built Source Sans 3 font found");
    } finally {
      rmSync(item.root, { recursive: true, force: true });
    }
  });

  it("refuses an emitted font URL outside the app output", () => {
    const item = fixture(
      "@font-face { font-family: sourceSans3; src: url('../../../../outside.ttf'); }",
    );
    try {
      const result = item.run();
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("Font path outside app output");
    } finally {
      rmSync(item.root, { recursive: true, force: true });
    }
  });
});
