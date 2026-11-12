import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { root } from "./runtime.ts";

describe("catalogue dictionaries", () => {
  const directory = path.join(root, "apps/backoffice/.storybook/messages");
  const spanish = JSON.parse(
    readFileSync(path.join(directory, "es.json"), "utf8"),
  ) as Record<string, string>;
  const argumentsOf = (text: string) =>
    [...text.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)]
      .map((match) => match[1])
      .sort();
  for (const locale of ["es", "en", "ca", "gl", "eu"]) {
    it(`${locale} has complete nonempty translations with the original ICU arguments`, () => {
      const file = path.join(directory, `${locale}.json`);
      expect(existsSync(file), `Missing catalogue dictionary: ${locale}`).toBe(
        true,
      );
      const messages = JSON.parse(readFileSync(file, "utf8")) as Record<
        string,
        string
      >;
      expect(Object.keys(messages).sort()).toEqual(Object.keys(spanish).sort());
      for (const [key, message] of Object.entries(messages)) {
        expect(typeof message, `${locale}.${key}`).toBe("string");
        expect(message.trim(), `${locale}.${key}`).not.toBe("");
        expect(argumentsOf(message), `${locale}.${key}`).toEqual(
          argumentsOf(spanish[key]),
        );
      }
    });
  }
});
