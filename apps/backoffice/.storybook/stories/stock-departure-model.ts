import {
  advanceReceiptRun,
  makeReceiptRecord,
  newReceiptDraft,
  receiveReceiptResult,
  type ReceiptDraft,
  type ReceiptIdentity,
  type ReceiptRecord,
  type ReceiptResult,
} from "./stock-receipt-model";

export type DepartureDraft = ReceiptDraft & { channelId: string };
export type DepartureChannel = {
  id: string;
  enabledLocationIds: readonly string[];
};

type DepartureOutcome = ReceiptResult["type"];

export function newDepartureDraft(): DepartureDraft {
  return { ...newReceiptDraft(), channelId: "" };
}

export function selectDepartureOrigin(
  draft: DepartureDraft,
  locationId: string,
): DepartureDraft {
  return draft.locationId === locationId
    ? draft
    : { ...draft, locationId, channelId: "" };
}

export function eligibleDepartureChannels<Channel extends DepartureChannel>(
  channels: readonly Channel[],
  locationId: string,
) {
  return channels.filter((channel) =>
    channel.enabledLocationIds.includes(locationId),
  );
}

export function makeDepartureRecord(
  draft: DepartureDraft,
  channels: readonly DepartureChannel[],
  identity: ReceiptIdentity,
): ReceiptRecord | null {
  if (
    !draft.channelId ||
    !eligibleDepartureChannels(channels, draft.locationId).some(
      ({ id }) => id === draft.channelId,
    )
  )
    return null;

  const record = makeReceiptRecord(draft, identity, "memory");
  if (!record) return null;

  const content = Object.freeze({
    ...record.command.content,
    channelId: draft.channelId,
  });
  return { ...record, command: Object.freeze({ ...record.command, content }) };
}

export function departureChannelId(record: ReceiptRecord) {
  const { content } = record.command;
  return "channelId" in content && typeof content.channelId === "string"
    ? content.channelId
    : null;
}

export function finishDepartureAttempt(
  record: ReceiptRecord,
  outcome: DepartureOutcome,
  now: number,
): ReceiptRecord {
  let result: ReceiptResult;
  switch (outcome) {
    case "applied":
      result = {
        type: "applied",
        quantity: `-${record.command.baseQuantity}`,
        unit: record.command.product.unit,
      };
      break;
    case "pending":
      result = {
        type: "pending",
        lineReference: `departure-line-${record.command.identity.operationId}`,
        reasons: ["channel-not-enabled"],
      };
      break;
    case "rejected":
      result = { type: "rejected", reason: "location-unavailable" };
      break;
    case "unconfirmed":
      result = { type: "unconfirmed" };
  }
  return receiveReceiptResult(record, result, now, () => 0.5);
}

export function advanceDepartureFixture(
  record: ReceiptRecord,
  outcome: DepartureOutcome,
): ReceiptRecord {
  if (record.nextAt === null) return record;
  if (record.phase === "waiting")
    return advanceReceiptRun(record, record.nextAt, () => 0.5);
  const confirmed =
    outcome === "unconfirmed" && record.run > 1 ? "applied" : outcome;
  return finishDepartureAttempt(record, confirmed, record.nextAt);
}
