import { describe, expect, it } from "vitest";
import type { CreationUnitId } from "./products-creation-model";
import {
  addReceiptBalance,
  advanceReceiptRun,
  makeReceiptRecord,
  newReceiptDraft,
  receiptBaseQuantity,
  receiptCompatibleUnits,
  receiptDraftDirty,
  receiptErrors,
  receiptRetentionMode,
  receiveReceiptResult,
  restoreReceiptRecord,
  selectReceiptProduct,
  selectReceiptUnit,
  startReceiptRun,
  type ReceiptProduct,
} from "./stock-receipt-model";

const tomatoes: ReceiptProduct = {
  id: "tomatoes",
  name: "Tomate pera",
  unit: "kg",
  increment: "0.025",
};
const boxes: ReceiptProduct = {
  id: "boxes",
  name: "Cajas",
  unit: "piece",
  increment: "1",
};
const identity = {
  businessId: "shop-a",
  userId: "merchant-a",
  origin: "fixture-workspace",
  operationId: "receipt-1",
};

function enteredReceipt(quantity = "500", unit: CreationUnitId = "g") {
  return {
    ...selectReceiptUnit(newReceiptDraft(tomatoes), unit),
    locationId: "stockroom",
    quantity,
  };
}

describe("Receipt draft", () => {
  it("starts at the selected product's base unit and always requires a destination", () => {
    expect(newReceiptDraft()).toMatchObject({ product: null, unit: null });
    const shortcut = newReceiptDraft(tomatoes);
    expect(shortcut).toMatchObject({ product: tomatoes, unit: "kg" });
    expect(shortcut.locationId).toBe("");
    expect(receiptDraftDirty(shortcut, tomatoes)).toBe(false);
    expect(receiptErrors({ ...shortcut, quantity: "1" })).toEqual({
      location: "required",
    });
    expect(
      makeReceiptRecord({ ...shortcut, quantity: "1" }, identity),
    ).toBeNull();
  });

  it("clears quantities after confirmed product or unit changes", () => {
    const draft = { ...enteredReceipt(), reference: "A-071" };
    expect(selectReceiptUnit(draft, "g")).toBe(draft);
    expect(selectReceiptUnit(draft, "kg")).toEqual({
      ...draft,
      quantity: "",
      unit: "kg",
    });
    expect(selectReceiptProduct(draft, boxes)).toEqual({
      ...draft,
      product: boxes,
      quantity: "",
      unit: "piece",
    });
    expect(receiptDraftDirty(draft, tomatoes)).toBe(true);
  });

  it("filters units by dimension and validates the exact converted increment", () => {
    expect(receiptCompatibleUnits(tomatoes).map(({ id }) => id)).toEqual([
      "mg",
      "g",
      "kg",
      "t",
    ]);
    expect(receiptBaseQuantity(enteredReceipt("500,00"))).toBe("0.5");
    expect(receiptBaseQuantity(enteredReceipt("125000", "mg"))).toBe("0.125");
    expect(receiptBaseQuantity(enteredReceipt("0,0025", "t"))).toBe("2.5");
    expect(receiptErrors(enteredReceipt("499"))).toEqual({
      quantity: "increment",
    });
    expect(receiptErrors(enteredReceipt("0.01", "g"))).toEqual({
      quantity: "increment",
    });
    expect(receiptErrors(enteredReceipt("0.0001", "g"))).toEqual({
      quantity: "precision",
    });
    expect(receiptErrors(enteredReceipt("1", "ml"))).toEqual({
      unit: "incompatible",
    });
  });

  it("handles precise volume and area ratios without rounding", () => {
    const measured = (
      product: ReceiptProduct,
      quantity: string,
      unit: CreationUnitId,
    ) => ({
      ...selectReceiptUnit(newReceiptDraft(product), unit),
      quantity,
    });
    const liquid: ReceiptProduct = {
      ...tomatoes,
      unit: "l",
      increment: "0.001",
    };
    const floor: ReceiptProduct = {
      ...tomatoes,
      unit: "m2",
      increment: "0.0001",
    };
    expect(receiptBaseQuantity(measured(liquid, "450", "cm3"))).toBe("0.45");
    expect(receiptBaseQuantity(measured(liquid, "0,0015", "m3"))).toBe("1.5");
    expect(receiptBaseQuantity(measured(floor, "125", "cm2"))).toBe("0.0125");
  });

  it("rejects invalid, nonpositive and unrepresentable amounts", () => {
    expect(receiptErrors(enteredReceipt("1e3")).quantity).toBe("format");
    expect(receiptErrors(enteredReceipt("0")).quantity).toBe("positive");
    expect(receiptErrors(enteredReceipt("-500")).quantity).toBe("positive");
    expect(
      receiptErrors({ ...newReceiptDraft(boxes), quantity: "1.5" }).quantity,
    ).toBe("whole");
    expect(
      receiptErrors(enteredReceipt("9223372036854775808", "g")).quantity,
    ).toBe("range");
    expect(
      receiptErrors(enteredReceipt("9223372036854776", "t")).quantity,
    ).toBe("range");
    expect(
      receiptBaseQuantity({
        ...newReceiptDraft({ ...tomatoes, increment: "0.000001" }),
        quantity: "9223372036854.775807",
      }),
    ).toBe("9223372036854.775807");
  });

  it("omits an empty reference and preserves other accepted source text and quantities exactly", () => {
    const draft = enteredReceipt("0500,00");
    const reference = "  Albarán A-071  ";
    const record = makeReceiptRecord({ ...draft, reference }, identity)!;
    expect(record.command.content).toEqual({
      productId: tomatoes.id,
      locationId: "stockroom",
      quantity: "0500,00",
      unit: "g",
      reference,
    });
    expect(record.command.baseQuantity).toBe("0.5");
    expect(
      makeReceiptRecord(draft, identity)?.command.content,
    ).not.toHaveProperty("reference");
    expect(receiptErrors({ ...draft, reference: " " }).reference).toBe(
      "profile",
    );
    expect(receiptErrors({ ...draft, reference: "a\n1" }).reference).toBe(
      "profile",
    );
    expect(
      receiptErrors({ ...draft, reference: "é".repeat(513) }).reference,
    ).toBe("length");
  });
});

describe("Receipt operation and stock ledger", () => {
  it("adds an applied base-unit amount to fixture stock exactly", () => {
    expect(addReceiptBalance(undefined, "0.5")).toBe("0.5");
    expect(addReceiptBalance("0.025", "0.5")).toBe("0.525");
    expect(addReceiptBalance("-0.25", "0.25")).toBe("0");
    expect(addReceiptBalance("-0.5", "0.25")).toBe("-0.25");
    expect(addReceiptBalance("9223372036854775807", "1")).toBeNull();
  });

  it("retries the frozen receipt at most three times per run with the bounded deadlines", () => {
    const draft = { ...enteredReceipt(), reference: "  A-1  " };
    const record = startReceiptRun(makeReceiptRecord(draft, identity)!, 0);
    draft.quantity = "600";
    draft.reference = "different draft";
    expect(startReceiptRun(record, 1)).toBe(record);
    const stopped = advanceReceiptRun(record, 49_000, () => 0.5);
    expect(stopped).toMatchObject({ outcome: "unconfirmed", phase: "stopped" });
    expect(
      stopped.requests.map(({ startedAt, deadline }) => [startedAt, deadline]),
    ).toEqual([
      [0, 15_000],
      [16_000, 31_000],
      [34_000, 49_000],
    ]);
    const manual = startReceiptRun(stopped, 60_000);
    expect(manual).toMatchObject({ run: 2, attempt: 1 });
    for (const request of manual.requests) {
      expect(request.command).toBe(record.command);
      expect(request.command.content).toMatchObject({
        quantity: "500",
        reference: "  A-1  ",
      });
    }
    expect(Object.isFrozen(record.command.content)).toBe(true);
    expect(Object.isFrozen(record.command.identity)).toBe(true);
  });

  it("stops retries at an authoritative outcome without inferring a balance", () => {
    const record = startReceiptRun(
      makeReceiptRecord(enteredReceipt(), identity)!,
      0,
    );
    const pending = receiveReceiptResult(
      record,
      { type: "pending", reason: "quantity-check" },
      200,
    );
    expect(pending).toMatchObject({
      outcome: "pending",
      phase: "stopped",
      result: { type: "pending", reason: "quantity-check" },
    });
    expect(startReceiptRun(pending, 1000)).toBe(pending);
    const applied = receiveReceiptResult(
      record,
      { type: "applied", quantity: "400", unit: "g" },
      200,
    );
    expect(applied.result).toEqual({
      type: "applied",
      quantity: "400",
      unit: "g",
    });
    expect(applied.command.content.quantity).toBe("500");
    const rejected = receiveReceiptResult(
      record,
      { type: "rejected", reason: "location-closed" },
      200,
    );
    expect(advanceReceiptRun(rejected, 200_000)).toBe(rejected);
  });

  it("offers explicit recovery only for submitted durable records in the same scope", () => {
    const record = makeReceiptRecord(enteredReceipt(), identity)!;
    const submitted = startReceiptRun(record, 0);
    expect(restoreReceiptRecord(record, identity)).toBeNull();
    expect(
      restoreReceiptRecord(submitted, { ...identity, businessId: "shop-b" }),
    ).toBeNull();
    expect(
      restoreReceiptRecord(submitted, { ...identity, userId: "merchant-b" }),
    ).toBeNull();
    expect(
      restoreReceiptRecord({ ...submitted, mode: "memory" }, identity),
    ).toBeNull();
    const restored = restoreReceiptRecord(submitted, identity)!;
    expect(advanceReceiptRun(restored, 200_000)).toBe(restored);
    expect(restored).toMatchObject({
      restored: true,
      phase: "stopped",
      attempt: 1,
    });
    expect(restored.requests).toHaveLength(1);
    const resumed = startReceiptRun(restored, 300_000);
    expect(resumed.command).toBe(submitted.command);
    expect(resumed.requests).toHaveLength(2);
    expect(receiptRetentionMode(true, true)).toBe("indexeddb");
    expect(receiptRetentionMode(false, true)).toBe("localstorage");
    expect(receiptRetentionMode(false, false)).toBe("memory");
  });
});
