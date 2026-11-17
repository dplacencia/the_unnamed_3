import { describe, expect, it } from "vitest";
import {
  advanceCreationRun,
  creationDraftDirty,
  creationDraftErrors,
  creationRetentionMode,
  creationStep,
  creationUnit,
  creationUnits,
  makeCreationRecord,
  newCreationDraft,
  receiveCreationResult,
  restoreCreationRecord,
  selectCreationUnit,
  selectStandardCreationStep,
  setCustomCreationStep,
  startCreationRun,
} from "./products-creation-model";

const identity = {
  businessId: "fixture-business",
  userId: "fixture-user",
  origin: "storybook",
  operationId: "creation-1",
};

function weightedDraft(name = "  Nectarines ácidas  ") {
  return selectCreationUnit({ ...newCreationDraft(), name }, "kg");
}

describe("Product creation draft", () => {
  it("requires an explicit unit and leaves a fresh draft clean", () => {
    const draft = newCreationDraft();
    expect(creationDraftDirty(draft)).toBe(false);
    expect(creationDraftErrors(draft)).toEqual({
      name: "required",
      unit: "required",
    });
    expect(makeCreationRecord({ ...draft, name: "Nectarines" }, identity)).toBe(
      null,
    );
    expect(creationDraftDirty(selectCreationUnit(draft, "piece"))).toBe(true);
  });

  it("uses the Inventory base unit and its exact standard step", () => {
    expect(creationUnits).toHaveLength(15);
    const draft = selectCreationUnit(weightedDraft(), "cm3");
    const selected = creationUnit("cm3");
    expect(selected).toMatchObject({
      dimension: "volume",
      baseUnit: "cubic_cm",
      defaultStep: "1",
    });
    expect(creationStep(draft)).toBe("1");
    expect(creationStep(selectCreationUnit(draft, "t"))).toBe("0.000001");
    expect(makeCreationRecord(draft, identity)?.command.content).toEqual({
      name: "  Nectarines ácidas  ",
      unit: "cm3",
      baseUnit: "cubic_cm",
      dimension: "volume",
    });
  });

  it("preserves exact accepted names and validates their UTF-8 profile", () => {
    const name = "🍐".repeat(256);
    expect(
      makeCreationRecord(weightedDraft(name), identity)?.command.content.name,
    ).toBe(name);
    expect(creationDraftErrors(weightedDraft(name + "a")).name).toBe("length");
    expect(creationDraftErrors(weightedDraft("\u00a0\u202f")).name).toBe(
      "required",
    );
    expect(creationDraftErrors(weightedDraft("A\u2028B")).name).toBe("profile");
    expect(creationDraftErrors(weightedDraft("A\ud800B")).name).toBe("profile");
  });

  it("validates and normalizes a custom step without binary floating point", () => {
    const draft = weightedDraft();
    const exact = setCustomCreationStep(draft, "0009223372036854,77580700");
    expect(creationStep(exact)).toBe("9223372036854.775807");
    expect(makeCreationRecord(exact, identity)?.command.content.increment).toBe(
      "9223372036854.775807",
    );
    expect(
      creationDraftErrors(setCustomCreationStep(draft, "9223372036854.775808"))
        .step,
    ).toBe("range");
    expect(
      creationDraftErrors(setCustomCreationStep(draft, "0.0000001")).step,
    ).toBe("precision");
    expect(creationDraftErrors(setCustomCreationStep(draft, "1e-2")).step).toBe(
      "format",
    );
    expect(creationDraftErrors(setCustomCreationStep(draft, "-0.1")).step).toBe(
      "positive",
    );
    expect(creationDraftErrors(setCustomCreationStep(draft, "0")).step).toBe(
      "positive",
    );
    expect(
      creationStep(setCustomCreationStep(draft, "9223372036854775807")),
    ).toBe("9223372036854775807");
  });

  it("requires whole pieces when a custom step is supplied", () => {
    const draft = selectCreationUnit(weightedDraft(), "piece");
    expect(creationDraftErrors(setCustomCreationStep(draft, "1.5")).step).toBe(
      "whole",
    );
    expect(creationStep(setCustomCreationStep(draft, "02,000"))).toBe("2");
  });

  it("retains the original step until a unit change is explicitly resolved", () => {
    const custom = setCustomCreationStep(weightedDraft(), "0,125");
    const review = selectCreationUnit(selectCreationUnit(custom, "g"), "piece");
    expect(review.previousStep).toEqual({ value: "0,125", unit: "kg" });
    expect(review.customStep).toBe(null);
    expect(creationDraftErrors(review).step).toBe("review");
    expect(makeCreationRecord(review, identity)).toBe(null);
    const invalid = setCustomCreationStep(review, "0.5");
    expect(invalid.previousStep).toBe(review.previousStep);
    expect(creationDraftErrors(invalid).step).toBe("whole");
    expect(creationStep(selectStandardCreationStep(invalid))).toBe("1");
    const resolved = setCustomCreationStep(invalid, "2");
    expect(resolved.previousStep).toBe(null);
    expect(creationStep(resolved)).toBe("2");
  });
});

describe("Product creation recovery", () => {
  it("exhausts a bounded run and retries only the frozen original creation", () => {
    const draft = setCustomCreationStep(weightedDraft(), "0,125");
    const record = makeCreationRecord(draft, identity)!;
    const started = startCreationRun(record, 0);
    draft.name = "Other product";
    expect(startCreationRun(started, 1)).toBe(started);
    expect(started.nextAt).toBe(15_000);
    const waiting = advanceCreationRun(started, 15_000, () => 0);
    expect(waiting).toMatchObject({ phase: "waiting", nextAt: 15_500 });
    expect(startCreationRun(waiting, 15_100)).toBe(waiting);
    const second = advanceCreationRun(waiting, 15_500, () => 1);
    expect(second).toMatchObject({
      phase: "request",
      nextAt: 30_500,
      attempt: 2,
    });
    const stopped = advanceCreationRun(second, 50_000, () => 1);
    expect(stopped).toMatchObject({
      phase: "stopped",
      attempt: 3,
      outcome: "unconfirmed",
      nextAt: null,
    });
    expect(stopped.requests.map((request) => request.startedAt)).toEqual([
      0, 15_500, 35_000,
    ]);
    expect(
      stopped.requests.every((request) => request.command === record.command),
    ).toBe(true);
    expect(record.command.content).toMatchObject({
      name: "  Nectarines ácidas  ",
      increment: "0.125",
    });
    expect(Object.isFrozen(record.command.identity)).toBe(true);
    expect(Object.isFrozen(record.command.content)).toBe(true);
    const retry = startCreationRun(stopped, 50_100);
    expect(retry).toMatchObject({ run: 2, attempt: 1, phase: "request" });
    expect(retry.requests.at(-1)?.command).toBe(record.command);
  });

  it("distinguishes a lost reply from an authoritative result", () => {
    const record = makeCreationRecord(weightedDraft(), identity)!;
    const started = startCreationRun(record, 5_000);
    const waiting = receiveCreationResult(
      started,
      { type: "unconfirmed" },
      5_100,
      () => 0.5,
    );
    expect(waiting).toMatchObject({
      phase: "waiting",
      outcome: "unconfirmed",
      nextAt: 6_100,
      productId: null,
    });
    const confirmed = receiveCreationResult(
      waiting,
      { type: "confirmed", productId: "product-confirmed-id" },
      5_200,
    );
    expect(confirmed).toMatchObject({
      phase: "stopped",
      outcome: "confirmed",
      productId: "product-confirmed-id",
      nextAt: null,
    });
    expect(startCreationRun(confirmed, 6_100)).toBe(confirmed);
    const rejected = receiveCreationResult(
      started,
      { type: "rejected" },
      5_100,
    );
    expect(rejected).toMatchObject({
      phase: "stopped",
      outcome: "rejected",
      productId: null,
      nextAt: null,
    });
    expect(advanceCreationRun(rejected, 100_000)).toBe(rejected);
  });

  it("restores an accessible submitted record only in the same scope", () => {
    const record = makeCreationRecord(
      weightedDraft(),
      identity,
      "localstorage",
    )!;
    expect(restoreCreationRecord(record, identity)).toBe(null);
    const started = startCreationRun(record, 0);
    expect(
      restoreCreationRecord(started, { ...identity, userId: "other-user" }),
    ).toBe(null);
    expect(
      restoreCreationRecord(started, {
        ...identity,
        businessId: "other-business",
      }),
    ).toBe(null);
    expect(
      restoreCreationRecord({ ...started, mode: "memory" }, identity),
    ).toBe(null);
    const restored = restoreCreationRecord(started, identity)!;
    expect(restored).toMatchObject({
      phase: "stopped",
      restored: true,
      nextAt: null,
    });
    expect(advanceCreationRun(restored, 50_000)).toBe(restored);
    expect(restored.requests).toHaveLength(1);
    expect(startCreationRun(restored, 60_000).requests.at(-1)?.command).toBe(
      record.command,
    );
  });

  it("chooses the best available simulated storage without blocking a memory-only run", () => {
    expect(creationRetentionMode(true, true)).toBe("indexeddb");
    expect(creationRetentionMode(false, true)).toBe("localstorage");
    const mode = creationRetentionMode(false, false);
    expect(mode).toBe("memory");
    expect(
      startCreationRun(makeCreationRecord(weightedDraft(), identity, mode)!, 0),
    ).toMatchObject({
      mode,
      phase: "request",
      attempt: 1,
    });
  });
});
