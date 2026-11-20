import {
  creationUnit,
  creationUnits,
  type CreationUnitId,
  type RetentionMode,
} from "./products-creation-model";
import { validateEditingText } from "./products-editing-model";

export { creationRetentionMode as receiptRetentionMode } from "./products-creation-model";

export type ReceiptProduct = {
  id: string;
  name: string;
  reference?: string;
  unit: CreationUnitId;
  increment: string;
};

export type ReceiptLocation = { id: string; name: string };

export type ReceiptDraft = {
  product: ReceiptProduct | null;
  locationId: string;
  unit: CreationUnitId | null;
  quantity: string;
  reference: string;
};

export function newReceiptDraft(
  product: ReceiptProduct | null = null,
): ReceiptDraft {
  return {
    product,
    locationId: "",
    unit: product?.unit ?? null,
    quantity: "",
    reference: "",
  };
}

export function receiptDraftDirty(
  draft: ReceiptDraft,
  initialProduct?: ReceiptProduct | null,
) {
  return (
    draft.product?.id !== initialProduct?.id ||
    draft.unit !== (initialProduct?.unit ?? null) ||
    draft.locationId !== "" ||
    draft.quantity !== "" ||
    draft.reference !== ""
  );
}

export function selectReceiptProduct(
  draft: ReceiptDraft,
  product: ReceiptProduct | null,
): ReceiptDraft {
  if (draft.product?.id === product?.id) return draft;
  return { ...draft, product, unit: product?.unit ?? null, quantity: "" };
}

export function selectReceiptUnit(
  draft: ReceiptDraft,
  unit: CreationUnitId | null,
): ReceiptDraft {
  if (draft.unit === unit) return draft;
  return { ...draft, unit, quantity: "" };
}

export function receiptCompatibleUnits(product: ReceiptProduct | null) {
  const dimension = creationUnit(product?.unit ?? null)?.dimension;
  return creationUnits.filter((unit) => unit.dimension === dimension);
}

// Decimal exponents relative to each dimension's piece, kilogram, litre,
// metre or square metre. Conversion always stays within one dimension.
const unitExponent = {
  piece: 0,
  mg: -6,
  g: -3,
  kg: 0,
  t: 3,
  ml: -3,
  cl: -2,
  l: 0,
  cm3: -3,
  m3: 3,
  mm: -3,
  cm: -2,
  m: 0,
  cm2: -4,
  m2: 0,
} satisfies Record<CreationUnitId, number>;

type Decimal = { coefficient: bigint; scale: number };
type DecimalError = "format" | "precision" | "range";
type QuantityError =
  DecimalError | "required" | "positive" | "whole" | "increment";
const maxCoefficient = BigInt("9223372036854775807");
const minCoefficient = BigInt("-9223372036854775808");
const zero = BigInt(0);
const ten = BigInt(10);
const pow10 = (exponent: number) => ten ** BigInt(exponent);

function representable(coefficient: bigint) {
  return coefficient >= minCoefficient && coefficient <= maxCoefficient;
}

function readDecimal(
  raw: string,
  maxScale: number,
): { value: Decimal } | { error: DecimalError } {
  const parts = /^(-?)(\d+)(?:[.,](\d+))?$/u.exec(raw);
  if (!parts || parts[0] !== raw) return { error: "format" };
  const fraction = (parts[3] ?? "").replace(/0+$/u, "");
  if (fraction.length > maxScale) return { error: "precision" };
  const digits = (parts[2] + fraction).replace(/^0+(?=\d)/u, "");
  if (digits.length > 19) return { error: "range" };
  const coefficient = BigInt(parts[1] + digits);
  return representable(coefficient)
    ? { value: { coefficient, scale: fraction.length } }
    : { error: "range" };
}

function normalize(coefficient: bigint, scale: number): Decimal {
  if (coefficient === zero) return { coefficient, scale: 0 };
  if (scale < 0) return { coefficient: coefficient * pow10(-scale), scale: 0 };
  while (scale > 0 && coefficient % ten === zero) {
    coefficient /= ten;
    scale -= 1;
  }
  return { coefficient, scale };
}

function displayDecimal({ coefficient, scale }: Decimal) {
  if (!scale) return coefficient.toString();
  const negative = coefficient < zero;
  const digits = (negative ? -coefficient : coefficient)
    .toString()
    .padStart(scale + 1, "0");
  return `${negative ? "-" : ""}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function scaledAt(value: Decimal, scale: number) {
  return value.coefficient * pow10(scale - value.scale);
}

function measureQuantity(
  quantity: string,
  unit: CreationUnitId,
  product: ReceiptProduct,
): { base: string } | { error: QuantityError } {
  if (quantity === "") return { error: "required" };
  const parsed = readDecimal(quantity, 18);
  if ("error" in parsed) return parsed;
  if (parsed.value.coefficient <= zero) return { error: "positive" };
  const base = normalize(
    parsed.value.coefficient,
    parsed.value.scale + unitExponent[product.unit] - unitExponent[unit],
  );
  if (product.unit === "piece" && base.scale) return { error: "whole" };
  if (base.scale > 6) return { error: "precision" };
  if (!representable(base.coefficient)) return { error: "range" };

  const step = readDecimal(product.increment, 6);
  if ("error" in step || step.value.coefficient <= zero)
    return { error: "increment" };
  const scale = Math.max(base.scale, step.value.scale);
  if (scaledAt(base, scale) % scaledAt(step.value, scale) !== zero)
    return { error: "increment" };
  return { base: displayDecimal(base) };
}

export type ReceiptErrors = {
  product?: "required";
  location?: "required";
  quantity?: QuantityError;
  unit?: "required" | "incompatible";
  reference?: "profile" | "length";
};

function validateReceiptDraft(draft: ReceiptDraft) {
  const errors: ReceiptErrors = {};
  const { product, unit, quantity, locationId, reference } = draft;
  if (!product) errors.product = "required";
  if (!locationId) errors.location = "required";
  if (quantity === "") errors.quantity = "required";
  if (product && !unit) errors.unit = "required";
  if (
    product &&
    unit &&
    !receiptCompatibleUnits(product).some(({ id }) => id === unit)
  )
    errors.unit = "incompatible";
  let baseQuantity: string | null = null;
  if (product && unit && !errors.unit && !errors.quantity) {
    const measure = measureQuantity(quantity, unit, product);
    if ("error" in measure) errors.quantity = measure.error;
    else baseQuantity = measure.base;
  }
  if (reference !== "") {
    // Inventory's source reference profile has the same limits as a name.
    const problem = validateEditingText("name", reference);
    if (problem)
      errors.reference = problem === "tooLong" ? "length" : "profile";
  }
  return { errors, baseQuantity };
}

export function receiptErrors(draft: ReceiptDraft): ReceiptErrors {
  return validateReceiptDraft(draft).errors;
}

export function receiptBaseQuantity(draft: ReceiptDraft): string | null {
  return validateReceiptDraft(draft).baseQuantity;
}

// The Storybook fixture ledger adds the amount only after application. An
// absent record stays distinct from a recorded zero until that mutation.
export function addReceiptBalance(
  current: string | undefined,
  delta: string,
): string | null {
  if (delta.startsWith("-"))
    throw new Error("Invalid fixture receipt quantity");
  return applyRecordedStockDelta(current, delta);
}

export function applyRecordedStockDelta(
  current: string | undefined,
  delta: string,
): string | null {
  const balance = readDecimal(current ?? "0", 6);
  const amount = readDecimal(delta, 6);
  if (
    "error" in balance ||
    "error" in amount ||
    amount.value.coefficient === zero
  )
    throw new Error("Invalid fixture stock quantity");
  const scale = Math.max(balance.value.scale, amount.value.scale);
  const sum = normalize(
    scaledAt(balance.value, scale) + scaledAt(amount.value, scale),
    scale,
  );
  return representable(sum.coefficient) ? displayDecimal(sum) : null;
}

export type ReceiptScope = { businessId: string; userId: string };
export type ReceiptIdentity = ReceiptScope & {
  origin: string;
  operationId: string;
};

// This is a simulated operation snapshot. The quantity's exact value and
// entered unit are retained, together with the optional source reference.
export type ReceiptCommand = Readonly<{
  identity: Readonly<ReceiptIdentity>;
  content: Readonly<{
    productId: string;
    locationId: string;
    quantity: string;
    unit: CreationUnitId;
    reference?: string;
  }>;
  product: Readonly<ReceiptProduct>;
  baseQuantity: string;
}>;

export type ReceiptResult =
  | { type: "unconfirmed" }
  | { type: "applied"; quantity: string; unit: CreationUnitId }
  | {
      type: "pending";
      lineReference: string;
      reason?: string;
      reasons?: readonly string[];
    }
  | { type: "rejected"; reason?: string };

type ReceiptRequest = {
  run: number;
  attempt: number;
  startedAt: number;
  deadline: number;
  command: ReceiptCommand;
};

export type ReceiptRecord = {
  command: ReceiptCommand;
  outcome: ReceiptResult["type"];
  result: Readonly<Exclude<ReceiptResult, { type: "unconfirmed" }>> | null;
  phase: "idle" | "request" | "waiting" | "stopped";
  run: number;
  attempt: number;
  nextAt: number | null;
  requests: readonly ReceiptRequest[];
  mode: RetentionMode;
  restored: boolean;
};

export function makeReceiptRecord(
  draft: ReceiptDraft,
  identity: ReceiptIdentity,
  mode: RetentionMode = "indexeddb",
): ReceiptRecord | null {
  const { errors, baseQuantity } = validateReceiptDraft(draft);
  if (
    !draft.product ||
    !draft.unit ||
    baseQuantity === null ||
    Object.keys(errors).length
  )
    return null;
  const command = Object.freeze({
    identity: Object.freeze({ ...identity }),
    content: Object.freeze({
      productId: draft.product.id,
      locationId: draft.locationId,
      quantity: draft.quantity,
      unit: draft.unit,
      ...(draft.reference !== "" ? { reference: draft.reference } : {}),
    }),
    product: Object.freeze({ ...draft.product }),
    baseQuantity,
  });
  return {
    command,
    outcome: "unconfirmed",
    result: null,
    phase: "idle",
    run: 0,
    attempt: 0,
    nextAt: null,
    requests: [],
    mode,
    restored: false,
  };
}

function dispatch(record: ReceiptRecord, now: number): ReceiptRecord {
  const attempt = record.attempt + 1;
  const deadline = now + 15_000;
  return {
    ...record,
    attempt,
    phase: "request",
    nextAt: deadline,
    requests: [
      ...record.requests,
      {
        run: record.run,
        attempt,
        startedAt: now,
        deadline,
        command: record.command,
      },
    ],
  };
}

export function startReceiptRun(
  record: ReceiptRecord,
  now: number,
): ReceiptRecord {
  if (
    record.outcome !== "unconfirmed" ||
    record.phase === "request" ||
    record.phase === "waiting"
  )
    return record;
  return dispatch(
    { ...record, run: record.run + 1, attempt: 0, restored: false },
    now,
  );
}

function scheduleRetry(
  record: ReceiptRecord,
  now: number,
  random: () => number,
): ReceiptRecord {
  if (record.attempt >= 3) return { ...record, phase: "stopped", nextAt: null };
  const delay =
    (record.attempt === 1 ? 1000 : 3000) *
    (0.5 + Math.max(0, Math.min(1, random())));
  return { ...record, phase: "waiting", nextAt: now + delay };
}

export function advanceReceiptRun(
  record: ReceiptRecord,
  now: number,
  random = Math.random,
): ReceiptRecord {
  let current = record;
  while (
    current.outcome === "unconfirmed" &&
    current.nextAt !== null &&
    current.nextAt <= now
  ) {
    const at = current.nextAt;
    if (current.phase === "request")
      current = scheduleRetry(current, at, random);
    else if (current.phase === "waiting") current = dispatch(current, at);
    else break;
  }
  return current;
}

export function receiveReceiptResult(
  record: ReceiptRecord,
  result: ReceiptResult,
  now: number,
  random = Math.random,
): ReceiptRecord {
  if (!record.requests.length || record.outcome !== "unconfirmed")
    return record;
  if (result.type === "unconfirmed")
    return record.phase === "request"
      ? scheduleRetry(record, now, random)
      : record;
  return {
    ...record,
    outcome: result.type,
    result: Object.freeze({ ...result }),
    phase: "stopped",
    nextAt: null,
  };
}

export function restoreReceiptRecord(
  record: ReceiptRecord | null,
  scope: ReceiptScope,
): ReceiptRecord | null {
  if (
    !record ||
    record.outcome !== "unconfirmed" ||
    !record.requests.length ||
    record.mode === "memory"
  )
    return null;
  const { businessId, userId } = record.command.identity;
  if (businessId !== scope.businessId || userId !== scope.userId) return null;
  return { ...record, restored: true, phase: "stopped", nextAt: null };
}
