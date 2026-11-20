import {
  newReceiptDraft,
  receiptBaseQuantity,
  type ReceiptProduct,
} from "./stock-receipt-model";

export const commitmentScope = {
  product: {
    id: "boxes",
    name: "Caja de cartón",
    unit: "piece",
    increment: "1",
  },
  location: { id: "stockroom", name: "Almacén", timeZone: "Europe/Madrid" },
  channel: { id: "counter", name: "Mostrador" },
} as const;

export type CommitmentScope = {
  reference: string;
  product: ReceiptProduct;
  location: { id: string; name: string; timeZone: string };
  channel: { id: string; name: string };
};

export const authorizedCommitmentScopes: readonly CommitmentScope[] = [
  { ...commitmentScope, reference: "R-101" },
  {
    reference: "R-102",
    product: {
      id: "bags",
      name: "Bolsa de papel",
      unit: "piece",
      increment: "1",
    },
    location: {
      id: "sales-floor",
      name: "Sala de ventas",
      timeZone: "Europe/Madrid",
    },
    channel: { id: "pickup", name: "Recogida en tienda" },
  },
];

export function commitmentScopeFor(
  product: string,
  location: string,
  channel: string,
) {
  return authorizedCommitmentScopes.find(
    (scope) =>
      scope.product.id === product &&
      scope.location.id === location &&
      scope.channel.id === channel,
  );
}

type HoldPolicyDraft = {
  perHold: string;
  total: string;
  duration: string;
  lifetime: string;
  extensions: "" | "disabled" | "enabled";
  extensionDuration: string;
  extensionCount: string;
};

export function holdPolicy(draft: HoldPolicyDraft) {
  const positiveInteger = (value: string) => /^[1-9][0-9]*$/u.test(value);
  const cap = (value: string) =>
    value === "unlimited" || positiveInteger(value);
  if (
    !cap(draft.perHold) ||
    !cap(draft.total) ||
    !positiveInteger(draft.duration) ||
    !positiveInteger(draft.lifetime) ||
    !draft.extensions
  )
    return null;
  const extensions =
    draft.extensions === "disabled"
      ? { kind: "disabled" as const }
      : positiveInteger(draft.extensionDuration) &&
          positiveInteger(draft.extensionCount)
        ? {
            kind: "enabled" as const,
            duration: draft.extensionDuration,
            count: draft.extensionCount,
          }
        : null;
  return extensions
    ? {
        perHold: draft.perHold,
        total: draft.total,
        duration: draft.duration,
        lifetime: draft.lifetime,
        extensions,
      }
    : null;
}

type CommitmentStatus = "active" | "released" | "fulfilled";
export type CommitmentRecord = Readonly<{
  reference: string;
  accepted: string;
  unaccepted: string;
  outstanding: string;
  fulfilled: string;
  onHand: string;
  available: string;
  expires: string;
  status: CommitmentStatus;
}>;

type ActionKind = "reserve" | "release" | "fulfill";
export type RemainderChoice = "keep" | "release";

type CommitmentAction = Readonly<{
  kind: ActionKind;
  reference: string;
  quantity: string;
  allowPartial: boolean;
  remainder: RemainderChoice | null;
  source: CommitmentRecord;
}>;

export type CommitmentResult =
  | {
      kind: "confirmed";
      record: CommitmentRecord;
      effect?: string;
      released?: string;
    }
  | { kind: "declined" | "unsupported" | "unconfirmed" };

export type CommitmentRead =
  | { kind: "confirmed"; record: CommitmentRecord }
  | { kind: "unavailable" | "error" };

export const activeCommitment: CommitmentRecord = Object.freeze({
  reference: "R-001",
  accepted: "3",
  unaccepted: "0",
  outstanding: "3",
  fulfilled: "0",
  onHand: "10",
  available: "7",
  expires: "2026-11-30T10:00:00Z",
  status: "active",
});

const partiallyAccepted = Object.freeze({
  ...activeCommitment,
  unaccepted: "1",
});

const released: CommitmentRecord = Object.freeze({
  ...activeCommitment,
  outstanding: "0",
  available: "10",
  status: "released",
});

const fulfilled: CommitmentRecord = Object.freeze({
  ...activeCommitment,
  outstanding: "0",
  fulfilled: "3",
  onHand: "7",
  status: "fulfilled",
});

const partiallyFulfilled: CommitmentRecord = Object.freeze({
  ...activeCommitment,
  outstanding: "2",
  fulfilled: "1",
  onHand: "9",
});

const partialRemainderReleased: CommitmentRecord = Object.freeze({
  ...partiallyFulfilled,
  outstanding: "0",
  available: "9",
  status: "fulfilled",
});

const releasedAfterPartial: CommitmentRecord = Object.freeze({
  ...partialRemainderReleased,
  status: "released",
});

function preserveAdmission(
  action: CommitmentAction,
  returned: CommitmentRecord,
): CommitmentRecord {
  return Object.freeze({
    ...returned,
    reference: action.reference,
    accepted: action.source.accepted,
    unaccepted: action.source.unaccepted,
  });
}

export function canonicalCommitmentQuantity(quantity: string) {
  return receiptBaseQuantity({
    ...newReceiptDraft(commitmentScope.product),
    locationId: commitmentScope.location.id,
    quantity,
  });
}

export function fulfillmentKind(quantity: string, record: CommitmentRecord) {
  const canonical = canonicalCommitmentQuantity(quantity);
  if (canonical === null) return "invalid";
  const ordered = BigInt(canonical);
  const outstanding = BigInt(record.outstanding);
  if (record.status !== "active" || ordered > outstanding) return "unsupported";
  return ordered === outstanding ? "full" : "partial";
}

// Retain the exact request intent for the preview visit. No wire identity or
// replay semantics are supplied by Inventory's deferred commitment contract.
export function commitmentAction(
  kind: ActionKind,
  quantity: string,
  allowPartial = false,
  remainder: RemainderChoice | null = null,
  source = activeCommitment,
): CommitmentAction {
  return Object.freeze({
    kind,
    reference: source.reference,
    quantity,
    allowPartial,
    remainder,
    source,
  });
}

// Readable fixed responses represent the synthetic authority for this story.
// The workspace never computes balances or fills absent product facts.
export function commitmentFixtureResult(
  action: CommitmentAction,
  mode: "ready" | "unconfirmed" = "ready",
): CommitmentResult {
  if (mode === "unconfirmed") return { kind: "unconfirmed" };
  const quantity = canonicalCommitmentQuantity(action.quantity);
  if (action.kind === "reserve") {
    if (quantity === "3")
      return {
        kind: "confirmed",
        record: { ...activeCommitment, reference: action.reference },
      };
    if (quantity === "4") {
      return action.allowPartial
        ? {
            kind: "confirmed",
            record: { ...partiallyAccepted, reference: action.reference },
          }
        : { kind: "declined" };
    }
    return { kind: "unsupported" };
  }
  if (action.source.status !== "active") return { kind: "unsupported" };
  const releasingPartial = action.source.fulfilled === "1";
  if (action.kind === "release") {
    return releasingPartial
      ? {
          kind: "confirmed",
          record: preserveAdmission(action, releasedAfterPartial),
          released: "2",
        }
      : {
          kind: "confirmed",
          record: preserveAdmission(action, released),
          released: "3",
        };
  }
  if (releasingPartial) return { kind: "unsupported" };
  if (quantity === "3")
    return {
      kind: "confirmed",
      record: preserveAdmission(action, fulfilled),
      effect: "-3",
    };
  if (quantity === "1" && action.remainder)
    return {
      kind: "confirmed",
      record: preserveAdmission(
        action,
        action.remainder === "keep"
          ? partiallyFulfilled
          : partialRemainderReleased,
      ),
      effect: "-1",
      ...(action.remainder === "release" ? { released: "2" } : {}),
    };
  return { kind: "unsupported" };
}

export function readCommitmentFixture(
  reference: string,
  mode: "ready" | "error" | "unavailable",
  current = activeCommitment,
): CommitmentRead {
  if (mode === "error") return { kind: "error" };
  if (mode === "unavailable" || reference !== current.reference)
    return { kind: "unavailable" };
  return { kind: "confirmed", record: current };
}
