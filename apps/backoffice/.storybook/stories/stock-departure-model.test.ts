import { describe, expect, it } from "vitest";
import {
  advanceReceiptRun,
  startReceiptRun,
  type ReceiptProduct,
} from "./stock-receipt-model";
import {
  finishDepartureAttempt,
  makeDepartureRecord,
  newDepartureDraft,
  selectDepartureOrigin,
} from "./stock-departure-model";

const product: ReceiptProduct = {
  id: "tomato",
  name: "Tomate pera",
  unit: "kg",
  increment: "0.001",
};
const channels = [
  { id: "counter", enabledLocationIds: ["sales-floor"] },
  { id: "delivery", enabledLocationIds: ["sales-floor", "stockroom"] },
];
const identity = {
  businessId: "demo-merchant",
  userId: "demo-user",
  origin: "storybook-stock-departure",
  operationId: "original",
};
const chosen = {
  ...newDepartureDraft(),
  product,
  locationId: "sales-floor",
  channelId: "delivery",
  unit: "g" as const,
  quantity: "2250",
  reference: "Salida · 004",
};

describe("first stock departure", () => {
  it("clears the explicit channel when changing origin even when that channel remains eligible", () => {
    expect(selectDepartureOrigin(chosen, "sales-floor")).toBe(chosen);
    expect(selectDepartureOrigin(chosen, "stockroom")).toEqual({
      ...chosen,
      locationId: "stockroom",
      channelId: "",
    });
  });

  it("requires the chosen channel to be enabled at the actual origin", () => {
    expect(
      makeDepartureRecord({ ...chosen, channelId: "" }, channels, identity),
    ).toBeNull();
    expect(
      makeDepartureRecord(
        { ...chosen, locationId: "stockroom", channelId: "counter" },
        channels,
        identity,
      ),
    ).toBeNull();
  });

  it("freezes the exact entered unit and quantity with origin and channel", () => {
    const operation = makeDepartureRecord(chosen, channels, identity);
    expect(operation?.command).toMatchObject({
      identity,
      content: {
        productId: "tomato",
        locationId: "sales-floor",
        channelId: "delivery",
        quantity: "2250",
        unit: "g",
        reference: "Salida · 004",
      },
      baseQuantity: "2.25",
    });
    expect(Object.isFrozen(operation?.command.content)).toBe(true);
  });

  it("returns the confirmed negative effect separately from the entered quantity", () => {
    const operation = makeDepartureRecord(chosen, channels, identity)!;
    const active = startReceiptRun(operation, 0);
    const received = finishDepartureAttempt(active, "applied", 100);

    expect(received.result).toEqual({
      type: "applied",
      quantity: "-2.25",
      unit: "kg",
    });
    expect(received.command.content.quantity).toBe("2250");
  });

  it("retains the same frozen departure command through a bounded run and an explicit retry", () => {
    const operation = makeDepartureRecord(chosen, channels, identity)!;
    const timedOut = advanceReceiptRun(
      startReceiptRun(operation, 0),
      100_000,
      () => 0.5,
    );
    expect(timedOut).toMatchObject({
      outcome: "unconfirmed",
      phase: "stopped",
    });
    expect(timedOut.requests).toHaveLength(3);
    const newRun = startReceiptRun(timedOut, 100_000);
    expect(newRun.requests).toHaveLength(4);
    for (const attempt of newRun.requests)
      expect(attempt.command).toBe(operation.command);
  });

  it("records a Pending reason separately from a rejected operation", () => {
    const active = startReceiptRun(
      makeDepartureRecord(chosen, channels, identity)!,
      0,
    );
    expect(finishDepartureAttempt(active, "pending", 100).result).toMatchObject(
      {
        type: "pending",
        lineReference: "departure-line-original",
        reasons: ["channel-not-enabled"],
      },
    );
    expect(
      finishDepartureAttempt(active, "rejected", 100).result,
    ).toMatchObject({
      type: "rejected",
      reason: "location-unavailable",
    });
  });
});
