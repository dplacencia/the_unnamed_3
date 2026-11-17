import { validateEditingText } from "./products-editing-model";
import type { RetentionMode } from "./products-recovery-model";

export type { RetentionMode } from "./products-recovery-model";

// The identifiers used by the form follow the retained Storybook concept.
// Base units and defaults follow Inventory's predefined unit catalogue.
export const creationUnits = [
  {
    id: "piece",
    baseUnit: "unit",
    dimension: "count",
    symbol: "ud.",
    defaultStep: "1",
  },
  {
    id: "mg",
    baseUnit: "mg",
    dimension: "weight",
    symbol: "mg",
    defaultStep: "1",
  },
  {
    id: "g",
    baseUnit: "g",
    dimension: "weight",
    symbol: "g",
    defaultStep: "1",
  },
  {
    id: "kg",
    baseUnit: "kg",
    dimension: "weight",
    symbol: "kg",
    defaultStep: "0.001",
  },
  {
    id: "t",
    baseUnit: "t",
    dimension: "weight",
    symbol: "t",
    defaultStep: "0.000001",
  },
  {
    id: "ml",
    baseUnit: "ml",
    dimension: "volume",
    symbol: "ml",
    defaultStep: "1",
  },
  {
    id: "cl",
    baseUnit: "cl",
    dimension: "volume",
    symbol: "cl",
    defaultStep: "0.1",
  },
  {
    id: "l",
    baseUnit: "l",
    dimension: "volume",
    symbol: "l",
    defaultStep: "0.001",
  },
  {
    id: "cm3",
    baseUnit: "cubic_cm",
    dimension: "volume",
    symbol: "cm³",
    defaultStep: "1",
  },
  {
    id: "m3",
    baseUnit: "cubic_m",
    dimension: "volume",
    symbol: "m³",
    defaultStep: "0.001",
  },
  {
    id: "mm",
    baseUnit: "mm",
    dimension: "length",
    symbol: "mm",
    defaultStep: "1",
  },
  {
    id: "cm",
    baseUnit: "cm",
    dimension: "length",
    symbol: "cm",
    defaultStep: "1",
  },
  {
    id: "m",
    baseUnit: "m",
    dimension: "length",
    symbol: "m",
    defaultStep: "0.001",
  },
  {
    id: "cm2",
    baseUnit: "square_cm",
    dimension: "area",
    symbol: "cm²",
    defaultStep: "1",
  },
  {
    id: "m2",
    baseUnit: "square_m",
    dimension: "area",
    symbol: "m²",
    defaultStep: "0.01",
  },
] as const;

type CreationUnit = (typeof creationUnits)[number];
export type CreationUnitId = CreationUnit["id"];

export function creationUnit(id: CreationUnitId | null) {
  return creationUnits.find((unit) => unit.id === id);
}

export type CreationDraft = {
  name: string;
  unit: CreationUnitId | null;
  customStep: string | null;
  previousStep: { unit: CreationUnitId; value: string } | null;
};

type StepError =
  "required" | "format" | "positive" | "precision" | "whole" | "range";
export type CreationDraftErrors = {
  name?: "required" | "profile" | "length";
  unit?: "required";
  step?: StepError | "review";
};

export function newCreationDraft(): CreationDraft {
  return { name: "", unit: null, customStep: null, previousStep: null };
}

export function creationDraftDirty(draft: CreationDraft) {
  return (
    draft.name !== "" ||
    draft.unit !== null ||
    draft.customStep !== null ||
    draft.previousStep !== null
  );
}

export function selectCreationUnit(
  draft: CreationDraft,
  unit: CreationUnitId | null,
): CreationDraft {
  if (draft.unit === unit) return draft;
  const previousStep =
    draft.previousStep ??
    (draft.unit && draft.customStep
      ? { unit: draft.unit, value: draft.customStep }
      : null);
  return { ...draft, unit, customStep: null, previousStep };
}

export function selectStandardCreationStep(
  draft: CreationDraft,
): CreationDraft {
  return { ...draft, customStep: null, previousStep: null };
}

const maxCoefficient = "9223372036854775807";

function readStep(
  value: string,
  unit: CreationUnitId,
): { decimal: string } | { error: StepError } {
  if (value === "") return { error: "required" };
  const parts = /^(-?)(\d+)(?:[.,](\d+))?$/u.exec(value);
  if (!parts) return { error: "format" };
  const whole = parts[2].replace(/^0+(?=\d)/u, "");
  const fraction = (parts[3] ?? "").replace(/0+$/u, "");
  if (parts[1] || (whole === "0" && fraction === ""))
    return { error: "positive" };
  if (unit === "piece" && fraction) return { error: "whole" };
  if (fraction.length > 6) return { error: "precision" };
  const coefficient = (whole + fraction).replace(/^0+/u, "");
  if (
    coefficient.length > maxCoefficient.length ||
    (coefficient.length === maxCoefficient.length &&
      coefficient > maxCoefficient)
  )
    return { error: "range" };
  return { decimal: fraction ? `${whole}.${fraction}` : whole };
}

export function setCustomCreationStep(
  draft: CreationDraft,
  value: string,
): CreationDraft {
  if (!draft.unit) return draft;
  const valid = "decimal" in readStep(value, draft.unit);
  return {
    ...draft,
    customStep: value,
    previousStep: valid ? null : draft.previousStep,
  };
}

export function creationStep(draft: CreationDraft): string | null {
  const unit = creationUnit(draft.unit);
  if (!unit || draft.previousStep) return null;
  if (draft.customStep === null) return unit.defaultStep;
  const step = readStep(draft.customStep, unit.id);
  return "decimal" in step ? step.decimal : null;
}

export function creationDraftErrors(draft: CreationDraft): CreationDraftErrors {
  const errors: CreationDraftErrors = {};
  const nameError = validateEditingText("name", draft.name);
  if (nameError === "blank") errors.name = "required";
  if (nameError === "tooLong") errors.name = "length";
  if (nameError === "invalid") errors.name = "profile";
  const unit = creationUnit(draft.unit);
  if (!unit) errors.unit = "required";
  if (unit && draft.customStep !== null) {
    const step = readStep(draft.customStep, unit.id);
    if ("error" in step) errors.step = step.error;
  }
  if (draft.previousStep && !errors.step) errors.step = "review";
  return errors;
}

export type CreationScope = { businessId: string; userId: string };
type CreationIdentity = CreationScope & { origin: string; operationId: string };

// These simulated records are not request or persistence schemas.
type CreationCommand = Readonly<{
  identity: Readonly<CreationIdentity>;
  content: Readonly<{
    name: string;
    unit: CreationUnitId;
    baseUnit: CreationUnit["baseUnit"];
    dimension: CreationUnit["dimension"];
    increment?: string;
  }>;
}>;

type CreationRequest = {
  run: number;
  attempt: number;
  startedAt: number;
  deadline: number;
  command: CreationCommand;
};

export type CreationResult =
  | { type: "unconfirmed" }
  | { type: "rejected" }
  | { type: "confirmed"; productId: string };

export type CreationRecord = {
  command: CreationCommand;
  outcome: CreationResult["type"];
  productId: string | null;
  phase: "idle" | "request" | "waiting" | "stopped";
  run: number;
  attempt: number;
  nextAt: number | null;
  requests: readonly CreationRequest[];
  mode: RetentionMode;
  restored: boolean;
};

export function creationRetentionMode(
  indexedDbUsable: boolean,
  localStorageUsable: boolean,
): RetentionMode {
  if (indexedDbUsable) return "indexeddb";
  return localStorageUsable ? "localstorage" : "memory";
}

export function makeCreationRecord(
  draft: CreationDraft,
  identity: CreationIdentity,
  mode: RetentionMode = "indexeddb",
): CreationRecord | null {
  const unit = creationUnit(draft.unit);
  if (!unit || Object.keys(creationDraftErrors(draft)).length) return null;
  const step = creationStep(draft);
  const command = Object.freeze({
    identity: Object.freeze({ ...identity }),
    content: Object.freeze({
      name: draft.name,
      unit: unit.id,
      baseUnit: unit.baseUnit,
      dimension: unit.dimension,
      ...(draft.customStep !== null && step !== null
        ? { increment: step }
        : {}),
    }),
  });
  return {
    command,
    outcome: "unconfirmed",
    productId: null,
    phase: "idle",
    run: 0,
    attempt: 0,
    nextAt: null,
    requests: [],
    mode,
    restored: false,
  };
}

function dispatch(record: CreationRecord, now: number): CreationRecord {
  const attempt = record.attempt + 1;
  const deadline = now + 15_000;
  const request = {
    run: record.run,
    attempt,
    startedAt: now,
    deadline,
    command: record.command,
  };
  return {
    ...record,
    phase: "request",
    attempt,
    nextAt: deadline,
    requests: [...record.requests, request],
  };
}

export function startCreationRun(
  record: CreationRecord,
  now: number,
): CreationRecord {
  if (
    record.outcome !== "unconfirmed" ||
    record.phase === "request" ||
    record.phase === "waiting"
  ) {
    return record;
  }
  return dispatch(
    { ...record, run: record.run + 1, attempt: 0, restored: false },
    now,
  );
}

function scheduleRetry(
  record: CreationRecord,
  now: number,
  random: () => number,
): CreationRecord {
  if (record.attempt >= 3) return { ...record, phase: "stopped", nextAt: null };
  const wait =
    (record.attempt === 1 ? 1000 : 3000) *
    (0.5 + Math.max(0, Math.min(1, random())));
  return { ...record, phase: "waiting", nextAt: now + wait };
}

// Time advances only when the preview drives its virtual clock.
export function advanceCreationRun(
  record: CreationRecord,
  now: number,
  random = Math.random,
): CreationRecord {
  let current = record;
  while (
    current.outcome === "unconfirmed" &&
    current.nextAt !== null &&
    current.nextAt <= now
  ) {
    if (current.phase === "request")
      current = scheduleRetry(current, current.nextAt, random);
    else if (current.phase === "waiting")
      current = dispatch(current, current.nextAt);
    else break;
  }
  return current;
}

export function receiveCreationResult(
  record: CreationRecord,
  result: CreationResult,
  now: number,
  random = Math.random,
): CreationRecord {
  if (!record.requests.length || record.outcome !== "unconfirmed")
    return record;
  if (result.type === "unconfirmed") {
    return record.phase === "request"
      ? scheduleRetry(record, now, random)
      : record;
  }
  return {
    ...record,
    outcome: result.type,
    productId: result.type === "confirmed" ? result.productId : null,
    phase: "stopped",
    nextAt: null,
  };
}

export function restoreCreationRecord(
  record: CreationRecord | null,
  scope: CreationScope,
): CreationRecord | null {
  if (
    !record ||
    record.outcome !== "unconfirmed" ||
    !record.requests.length ||
    record.mode === "memory"
  ) {
    return null;
  }
  const { businessId, userId } = record.command.identity;
  if (businessId !== scope.businessId || userId !== scope.userId) return null;
  return { ...record, restored: true, phase: "stopped", nextAt: null };
}
