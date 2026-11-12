import { describe, expect, it } from "vitest";
import {
  auditCoverage,
  assertSnapshotUpdatesDisabled,
  digest,
  validatePromotion,
  validateReference,
  type CaptureRun,
  successfulCaseIds,
} from "./core";

const environment = {
  platform: "darwin",
  arch: "arm64",
  osRelease: "fixture-release",
  headless: true,
  launchArgs: "[]",
  browser: "fixture-chromium",
  playwright: "fixture-version",
  fonts: "fixture-fonts",
};
const image = Buffer.from("synthetic PNG bytes used only by unit tests");
const run: CaptureRun = {
  id: "unit-run",
  sourceHash: "source-a",
  environment,
  cases: [{ id: "button-desktop", file: "button-desktop.png", sha256: "" }],
};
const readyRun = () => ({
  ...run,
  cases: [{ ...run.cases[0], sha256: digest(image) }],
});
const request = () => ({
  caseIds: ["button-desktop"],
  sourceHash: "source-a",
  environment,
  images: new Map([["button-desktop", image]]),
  approval: "unit-test-only explicit approval",
});

describe("visual coverage inventory", () => {
  it("keeps only cases that passed the reported browser run, excluding stale UI captures", () => {
    const passed = successfulCaseIds([
      {
        suites: [
          {
            specs: [
              {
                title: "button-default",
                tests: [
                  { projectName: "desktop", results: [{ status: "passed" }] },
                ],
              },
              {
                title: "dialog-open",
                tests: [
                  { projectName: "mobile", results: [{ status: "failed" }] },
                ],
              },
              {
                title: "switch-toggled",
                tests: [
                  { projectName: "desktop", results: [{ status: "skipped" }] },
                ],
              },
            ],
          },
        ],
      },
    ]);
    expect([...passed]).toEqual(["button-default--desktop"]);
  });
  it("reports a catalogue example without a registered capture case", () => {
    const report = auditCoverage(
      ["button.tsx"],
      [{ id: "button", sources: ["button.tsx"], storyId: "ui--button" }],
      ["ui--button", "ui--new-example"],
    );
    expect(report.ok).toBe(false);
  });
  it("reports a newly added component missing from the catalogue", () => {
    const report = auditCoverage(
      ["button.tsx", "new-control.tsx"],
      [{ id: "button", sources: ["button.tsx"], storyId: "ui--button" }],
      ["ui--button"],
    );
    expect(report.missingSources).toEqual(["new-control.tsx"]);
    expect(report.ok).toBe(false);
  });
  it("rejects duplicate inventory identities and stories missing from the built index", () => {
    const report = auditCoverage(
      ["button.tsx"],
      [
        { id: "button", sources: ["button.tsx"], storyId: "ui--button" },
        { id: "button", sources: ["missing.tsx"], storyId: "ui--absent" },
      ],
      ["ui--button"],
    );
    expect(report.duplicateIds).toEqual(["button"]);
    expect(report.unknownSources).toEqual(["missing.tsx"]);
    expect(report.missingStories).toEqual(["ui--absent"]);
    expect(report.ok).toBe(false);
  });
});

describe("explicit reviewed-reference promotion", () => {
  it("accepts only the explicitly selected verified candidate", () => {
    const selected = validatePromotion(readyRun(), request());
    expect(selected.map((item) => item.id)).toEqual(["button-desktop"]);
  });
  it("requires a reviewed case selection and approval evidence", () => {
    expect(() =>
      validatePromotion(readyRun(), { ...request(), caseIds: [] }),
    ).toThrow(/explicit/i);
    expect(() =>
      validatePromotion(readyRun(), { ...request(), approval: "" }),
    ).toThrow(/approval/i);
    expect(() =>
      validatePromotion(readyRun(), { ...request(), caseIds: ["unknown"] }),
    ).toThrow(/unknown/i);
  });
  it("rejects stale source or a different renderer before promotion", () => {
    expect(() =>
      validatePromotion(readyRun(), { ...request(), sourceHash: "source-b" }),
    ).toThrow(/source/i);
    expect(() =>
      validatePromotion(readyRun(), {
        ...request(),
        environment: { ...environment, platform: "linux" },
      }),
    ).toThrow(/environment/i);
  });
  it("rejects corrupt images and unsafe candidate paths", () => {
    expect(() =>
      validatePromotion(readyRun(), {
        ...request(),
        images: new Map([["button-desktop", Buffer.from("changed")]]),
      }),
    ).toThrow(/hash/i);
    const unsafe = readyRun();
    unsafe.cases[0].file = "../outside.png";
    expect(() => validatePromotion(unsafe, request())).toThrow(/path/i);
  });
});

describe("reference integrity during comparison", () => {
  it("requires an approved reference for the same renderer and exact bytes", () => {
    expect(() => validateReference(undefined, image, environment)).toThrow(
      /approved/i,
    );
    const reference = {
      sha256: digest(image),
      environment,
      approval: "unit-test-only explicit approval",
    };
    expect(() =>
      validateReference(reference, image, environment),
    ).not.toThrow();
    expect(() =>
      validateReference(reference, Buffer.from("modified"), environment),
    ).toThrow(/hash/i);
    expect(() =>
      validateReference(reference, image, {
        ...environment,
        browser: "different",
      }),
    ).toThrow(/environment/i);
  });
  it("refuses automatic snapshot-update modes", () => {
    expect(() => assertSnapshotUpdatesDisabled("none")).not.toThrow();
    for (const mode of ["all", "changed", "missing"])
      expect(() => assertSnapshotUpdatesDisabled(mode)).toThrow(/update/i);
  });
});
