import { useRef, useState } from "react";
import type { InspectionOutcome } from "./pending-receipt-inspection-model";
import {
  StockReceiptPreview,
  type InspectionReceiptFacts,
} from "./stock-receipt-preview";

export const pendingInspectionFixtures = [
  "receipt",
  "known-quantity",
  "known-unit",
  "applied",
  "rejected",
  "loading",
  "unavailable",
  "read-error",
  "refresh",
  "late-read",
] as const;
type Fixture = (typeof pendingInspectionFixtures)[number];

const defaultReasons = ["product-archived", "quantity-rules"];
const fixtureReasons: Partial<Record<Fixture, readonly string[]>> = {
  "known-quantity": ["unit-unresolved"],
  "known-unit": ["product-unresolved"],
};

function currentInspection(
  fixture: Fixture,
  facts: InspectionReceiptFacts,
  attempt: number,
): InspectionOutcome {
  if (fixture === "unavailable") return { kind: "unavailable" };
  if (fixture === "read-error" && attempt === 1) return { kind: "error" };

  const applied =
    fixture === "applied" ||
    (fixture === "refresh" && attempt >= 2) ||
    (fixture === "late-read" && attempt >= 3);
  const outcome = applied
    ? {
        kind: "applied" as const,
        effect: { quantity: facts.quantity, unit: facts.unit },
      }
    : fixture === "rejected"
      ? { kind: "rejected" as const, reason: "duplicate-entry" }
      : { kind: "pending" as const, reasons: facts.reasons };

  return {
    kind: "found",
    detail: {
      product: fixture === "known-unit" ? null : facts.product,
      location: facts.location,
      quantity: fixture === "known-unit" ? null : facts.quantity,
      unit: fixture === "known-quantity" ? null : facts.unit,
      outcome,
    },
  };
}

export function PendingReceiptInspectionPreview({
  fixture,
  focusedFeedback,
}: {
  fixture: Fixture;
  focusedFeedback?: boolean;
}) {
  const line = useRef<{
    reference: string;
    facts: InspectionReceiptFacts;
    attempts: number;
  }>(null);
  const [requested, setRequested] = useState(0);
  const [settled, setSettled] = useState(0);
  const [lastReference, setLastReference] = useState<string>();

  return (
    <div
      data-pending-inspection-workspace
      data-pending-inspection-read-count={requested}
      data-pending-inspection-settled-count={settled}
      data-pending-inspection-last-reference={lastReference}
    >
      <StockReceiptPreview
        fixture="pending"
        focusedFeedback={focusedFeedback}
        pendingInspection={{
          reasons: fixtureReasons[fixture] ?? defaultReasons,
          remember: (reference, facts) => {
            const previous = line.current;
            line.current = {
              reference,
              facts,
              attempts:
                previous?.reference === reference ? previous.attempts : 0,
            };
          },
          read: async (reference) => {
            setRequested((count) => count + 1);
            setLastReference(reference);
            const current = line.current;
            const matches = current?.reference === reference;
            const attempt = matches ? ++current.attempts : 0;
            const result: InspectionOutcome = matches
              ? currentInspection(fixture, current.facts, attempt)
              : { kind: "unavailable" };
            const delay =
              fixture === "loading"
                ? 6500
                : fixture === "late-read" && attempt === 2
                  ? 2400
                  : 350;
            await new Promise<void>((resolve) => setTimeout(resolve, delay));
            setSettled((count) => count + 1);
            return result;
          },
        }}
      />
    </div>
  );
}
