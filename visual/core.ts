import { createHash } from "node:crypto";

export type Environment = {
  platform: string;
  arch: string;
  osRelease: string;
  headless: boolean;
  launchArgs: string;
  browser: string;
  playwright: string;
  fonts: string;
};
export type Candidate = {
  id: string;
  file: string;
  sha256: string;
  title?: string;
  preview?: string;
  profile?: string;
  profileHash?: string;
  conditions?: {
    viewport: { width: number; height: number };
    theme: string;
    locale: string;
    action: string | null;
  };
};
export type CaptureRun = {
  id: string;
  sourceHash: string;
  environment: Environment;
  cases: Candidate[];
};
export type Reference = {
  sha256: string;
  environment: Environment;
  approval: string;
  run?: string;
  sourceHash?: string;
  profileHash?: string;
};
type InventorySource = { id: string; sources: string[]; storyId?: string };

export function digest(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export type ReportSuite = {
  suites?: ReportSuite[];
  specs?: {
    title: string;
    tests: { projectName: string; results: { status: string }[] }[];
  }[];
};

export function successfulCaseIds(suites: ReportSuite[]): Set<string> {
  const ids = new Set<string>();
  const visit = (suite: ReportSuite) => {
    for (const spec of suite.specs ?? [])
      for (const test of spec.tests) {
        if (
          test.results.length &&
          test.results.every((result) => result.status === "passed")
        )
          ids.add(`${spec.title}--${test.projectName}`);
      }
    for (const child of suite.suites ?? []) visit(child);
  };
  suites.forEach(visit);
  return ids;
}

export function sameEnvironment(
  first: Environment,
  second: Environment,
): boolean {
  return (
    [
      "platform",
      "arch",
      "osRelease",
      "headless",
      "launchArgs",
      "browser",
      "playwright",
      "fonts",
    ] as const
  ).every((key) => first[key] === second[key]);
}

export function auditCoverage(
  sources: string[],
  inventory: InventorySource[],
  stories: string[],
) {
  const known = new Set(sources);
  const covered = new Set(inventory.flatMap((entry) => entry.sources));
  const registeredStories = new Set(inventory.map((entry) => entry.storyId));
  const identities = inventory.map((entry) => entry.id);
  const report = {
    missingSources: sources.filter((source) => !covered.has(source)).sort(),
    unknownSources: [...covered].filter((source) => !known.has(source)).sort(),
    unregisteredStories: stories
      .filter((story) => !registeredStories.has(story))
      .sort(),
    duplicateIds: [
      ...new Set(
        identities.filter((id, index) => identities.indexOf(id) !== index),
      ),
    ].sort(),
    missingStories: [
      ...new Set(
        inventory.flatMap((entry) =>
          entry.storyId && !stories.includes(entry.storyId)
            ? [entry.storyId]
            : [],
        ),
      ),
    ].sort(),
  };
  return {
    ...report,
    ok: Object.values(report).every((items) => items.length === 0),
  };
}

export function assertSnapshotUpdatesDisabled(mode: string) {
  if (mode !== "none")
    throw new Error(
      "Automatic snapshot updates are disabled. Capture candidates and explicitly review them first.",
    );
}

export function validatePromotion(
  run: CaptureRun,
  request: {
    caseIds: string[];
    sourceHash: string;
    environment: Environment;
    images: Map<string, Buffer>;
    approval: string;
  },
): Candidate[] {
  if (!request.caseIds.length)
    throw new Error("Explicit reviewed case selection is required");
  if (!request.approval.trim())
    throw new Error("Explicit user approval evidence is required");
  if (request.sourceHash !== run.sourceHash)
    throw new Error(
      "Source changed since candidate capture; capture the current source first",
    );
  if (!sameEnvironment(run.environment, request.environment))
    throw new Error(
      "Candidate environment does not match the current renderer",
    );
  return [...new Set(request.caseIds)].map((id) => {
    if (!/^[a-z0-9][a-z0-9.-]*$/.test(id))
      throw new Error(`Unsafe case path: ${id}`);
    const candidate = run.cases.find((item) => item.id === id);
    if (!candidate) throw new Error(`Unknown reviewed case: ${id}`);
    if (!/^[a-z0-9][a-z0-9.-]*\.png$/.test(candidate.file))
      throw new Error(`Unsafe candidate path: ${candidate.file}`);
    const image = request.images.get(id);
    if (!image || digest(image) !== candidate.sha256)
      throw new Error(`Candidate image hash mismatch: ${id}`);
    return candidate;
  });
}

export function validateReference(
  reference: Reference | undefined,
  bytes: Buffer,
  environment: Environment,
) {
  if (!reference?.approval.trim())
    throw new Error("No approved visual reference exists for this case");
  if (!sameEnvironment(reference.environment, environment))
    throw new Error(
      "Approved reference environment differs from the current renderer",
    );
  if (digest(bytes) !== reference.sha256)
    throw new Error("Approved reference image hash mismatch");
}
