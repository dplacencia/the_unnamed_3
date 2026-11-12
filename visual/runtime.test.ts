import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { sourceFingerprint } from "./runtime.ts";

describe("build input freshness", () => {
  it("invalidates candidates when alias configuration or native landing styles/scripts change", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "irin-visual-inputs-"));
    try {
      const inputs = [
        "apps/backoffice/tsconfig.json",
        "apps/backoffice/.storybook/messages/en.json",
        "apps/landing/tsconfig.json",
        "apps/landing/src/styles.css",
        "apps/landing/src/interaction.js",
      ];
      for (const input of inputs) {
        const file = path.join(directory, input);
        mkdirSync(path.dirname(file), { recursive: true });
        const before = sourceFingerprint(directory);
        writeFileSync(file, "first fixture value");
        const after = sourceFingerprint(directory);
        expect(after, `new input: ${input}`).not.toBe(before);
        writeFileSync(file, "changed fixture value");
        expect(
          sourceFingerprint(directory),
          `changed input: ${input}`,
        ).not.toBe(after);
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
