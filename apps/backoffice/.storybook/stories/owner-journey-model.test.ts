import { expect, test } from "vitest";
import { newReceiptDraft } from "./stock-receipt-model";
import {
  applyJourneyMovement,
  emptyOwnerJourney,
  seededOwnerJourney,
} from "./owner-journey-model";

test("one exact fixture ledger records receipts and departures without rounding", () => {
  const initial = seededOwnerJourney("prepared");
  const product = initial.products[0];
  const locationId = Object.values(initial.stock)[0].id;
  const draft = { ...newReceiptDraft(product), locationId, quantity: "10" };
  expect(initial.balances).toEqual({});
  const first = applyJourneyMovement(initial, draft, "receipt");
  expect(Object.values(first.balances)).toEqual(["10"]);
  const continued = applyJourneyMovement(
    first,
    { ...draft, quantity: "5" },
    "receipt",
  );
  const completed = applyJourneyMovement(
    continued,
    { ...draft, quantity: "3" },
    "departure",
    initial.channels[0].id,
  );
  expect(Object.values(completed.balances)).toEqual(["12"]);
  expect(completed.movements.map(({ quantity }) => quantity)).toEqual([
    "10",
    "5",
    "-3",
  ]);
});

test("unconfirmed scope and missing channels cannot change the fixture ledger", () => {
  const initial = seededOwnerJourney("prepared");
  const draft = {
    ...newReceiptDraft(initial.products[0]),
    locationId: Object.values(initial.stock)[0].id,
    quantity: "3",
  };
  expect(applyJourneyMovement(initial, draft, "departure", "unknown")).toBe(
    initial,
  );
  const other = emptyOwnerJourney();
  expect(applyJourneyMovement(other, draft, "receipt")).toBe(other);
});
