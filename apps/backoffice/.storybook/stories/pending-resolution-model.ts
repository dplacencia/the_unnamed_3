import type { PendingLine } from "./pending-movements-browsing-model";
import type { InspectionDetail } from "./pending-receipt-inspection-model";
import {
  newReceiptDraft,
  receiptBaseQuantity,
  type ReceiptProduct,
} from "./stock-receipt-model";

type Identity = Readonly<{
  merchantId: string;
  originNamespace: string;
  callerOperationId: string;
}>;

export type OriginalResolution = Exclude<
  InspectionDetail["outcome"],
  { kind: "pending" }
>;

export type ResolutionFixture = { line: PendingLine } & (
  | {
      kind: "release";
      channels: readonly { id: string; label: string }[];
      result: OriginalResolution;
    }
  | { kind: "receipt-release"; product: ReceiptProduct }
  | { kind: "reject" }
  | {
      kind: "cancel";
      target: Identity;
      counterpart: Identity;
      eligibleCounterparts?: readonly Identity[];
      targetReferences: readonly string[];
    }
  | { kind: "counterpart-unavailable" }
);

type ResolutionInput =
  | Readonly<{
      kind: "release";
      lineReference: string;
      corrections: Readonly<{ channelId: string } | { quantity: string }>;
    }>
  | Readonly<{ kind: "reject"; lineReference: string; reason: string }>
  | Readonly<{
      kind: "cancel";
      target: Identity;
      counterpart: Identity;
      reason: string;
    }>;

export type ResolutionCommand = Readonly<{
  operationId: string;
  request: ResolutionInput;
}>;

export type ResolutionDraft = {
  operationId: string;
  channelId?: string;
  quantity?: string;
  counterpartId?: string;
  reason?: string;
  confirmed: boolean;
};

export type ResolutionResult =
  | { kind: "unconfirmed" }
  | { kind: "denied" }
  | { kind: "refused"; reason: "invalid" | "conflict" | "already-resolved" }
  | {
      kind: "resolved";
      original: OriginalResolution;
      references: readonly string[];
    };

type Resolved = Extract<ResolutionResult, { kind: "resolved" }>;

// Fixed Unicode White_Space and ResolutionReason limits from the Inventory contract.
const onlyWhitespace =
  /^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*$/u;
const prohibitedControl =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/u;

export function resolutionReasonValid(reason: string) {
  return (
    new TextEncoder().encode(reason).length <= 4096 &&
    !prohibitedControl.test(reason) &&
    !onlyWhitespace.test(reason)
  );
}

export function prepareResolutionCommand(
  fixture: ResolutionFixture,
  {
    operationId,
    channelId,
    quantity,
    counterpartId,
    reason,
    confirmed,
  }: ResolutionDraft,
): ResolutionCommand | null {
  if (!operationId || !confirmed) return null;

  const lineReference = fixture.line.reference;
  let request: ResolutionInput;
  switch (fixture.kind) {
    case "release":
      if (
        fixture.line.kind !== "departure" ||
        !channelId ||
        !fixture.channels.some((channel) => channel.id === channelId)
      )
        return null;
      request = {
        kind: "release",
        lineReference,
        corrections: Object.freeze({ channelId }),
      };
      break;
    case "receipt-release": {
      if (
        fixture.line.kind !== "receipt" ||
        fixture.line.unit !== "piece" ||
        fixture.line.quantity === null ||
        !quantity
      )
        return null;
      const exact = receiptBaseQuantity({
        ...newReceiptDraft(fixture.product),
        locationId: fixture.line.location,
        quantity,
      });
      if (!exact || BigInt(exact) >= BigInt(fixture.line.quantity)) return null;
      request = {
        kind: "release",
        lineReference,
        corrections: Object.freeze({ quantity: exact }),
      };
      break;
    }
    case "reject":
      if (
        fixture.line.kind !== "receipt" ||
        !reason ||
        !resolutionReasonValid(reason)
      )
        return null;
      request = { kind: "reject", lineReference, reason };
      break;
    case "cancel": {
      if (!reason || !resolutionReasonValid(reason)) return null;
      const counterpart = fixture.eligibleCounterparts
        ? fixture.eligibleCounterparts.find(
            (candidate) => candidate.callerOperationId === counterpartId,
          )
        : fixture.counterpart;
      if (!counterpart) return null;
      request = {
        kind: "cancel",
        target: Object.freeze({ ...fixture.target }),
        counterpart: Object.freeze({ ...counterpart }),
        reason,
      };
      break;
    }
    case "counterpart-unavailable":
      return null;
  }
  return Object.freeze({ operationId, request: Object.freeze(request) });
}

function validateFixtureCommand(
  fixture: ResolutionFixture,
  command: ResolutionCommand,
) {
  const { request, operationId } = command;
  const corrections =
    request.kind === "release" ? request.corrections : undefined;
  const validated = prepareResolutionCommand(fixture, {
    operationId,
    confirmed: true,
    channelId:
      corrections && "channelId" in corrections
        ? corrections.channelId
        : undefined,
    quantity:
      corrections && "quantity" in corrections
        ? corrections.quantity
        : undefined,
    counterpartId:
      request.kind === "cancel"
        ? request.counterpart.callerOperationId
        : undefined,
    reason: request.kind === "release" ? undefined : request.reason,
  });
  return (
    validated !== null && JSON.stringify(validated) === JSON.stringify(command)
  );
}

export function createResolutionSimulator({ loseFirstReply = false } = {}) {
  const retained = new Map<string, { command: string; result: Resolved }>();
  const resolvedLines = new Set<string>();
  let effects = 0;

  function attempt(
    fixture: ResolutionFixture,
    command: ResolutionCommand,
    currentlyAuthorized: boolean,
  ): ResolutionResult {
    if (!currentlyAuthorized) return { kind: "denied" };
    const snapshot = JSON.stringify(command);
    const previous = retained.get(command.operationId);
    if (previous) {
      if (previous.command !== snapshot)
        return { kind: "refused", reason: "conflict" };
      return previous.result;
    }
    if (!validateFixtureCommand(fixture, command))
      return { kind: "refused", reason: "invalid" };
    const references =
      fixture.kind === "cancel"
        ? fixture.targetReferences
        : [fixture.line.reference];
    if (references.some((reference) => resolvedLines.has(reference))) {
      return { kind: "refused", reason: "already-resolved" };
    }
    const request = command.request;
    const original: OriginalResolution =
      fixture.kind === "release"
        ? fixture.result
        : request.kind === "release" && "quantity" in request.corrections
          ? {
              kind: "applied",
              effect: { quantity: request.corrections.quantity, unit: "piece" },
            }
          : {
              kind: "rejected",
              reason:
                fixture.kind === "cancel"
                  ? "duplicate-batch-cancelled"
                  : "receipt-goods-not-received",
            };
    references.forEach((reference) => resolvedLines.add(reference));
    if (original.kind === "applied") effects++;
    const result: Resolved = { kind: "resolved", original, references };
    retained.set(command.operationId, { command: snapshot, result });
    return loseFirstReply && retained.size === 1
      ? { kind: "unconfirmed" }
      : result;
  }

  return { attempt, appliedEffects: () => effects };
}
