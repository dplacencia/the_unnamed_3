import type { CreationUnitId } from "./products-creation-model";
import {
  addReceiptBalance,
  advanceReceiptRun,
  makeReceiptRecord,
  newReceiptDraft,
  receiptRetentionMode,
  receiveReceiptResult,
  restoreReceiptRecord,
  startReceiptRun,
  type ReceiptProduct,
  type ReceiptRecord,
} from "./stock-receipt-model";

export type ReceiptFixture =
  | "movements"
  | "from-product"
  | "read-error"
  | "read-denied"
  | "pending"
  | "rejected"
  | "recovery"
  | "restored"
  | "memory-only";

export const receiptProducts: readonly ReceiptProduct[] = [
  { id: "tomato", name: "Tomate pera", unit: "kg", increment: "0.001" },
  { id: "boxes", name: "Cajas", unit: "piece", increment: "1" },
  { id: "oil", name: "Aceite de oliva", unit: "l", increment: "0.001" },
];

export const receiptScope = {
  businessId: "demo-merchant",
  userId: "demo-user",
};
export const receiptIdentity = {
  ...receiptScope,
  origin: "storybook-stock-receipt",
};

export type StockRead =
  | { phase: "idle" | "loading" | "error" | "denied" | "absent" }
  | { phase: "ready"; quantity: string; unit: CreationUnitId };

export type ReceiptSession = {
  record: ReceiptRecord | null;
  read: StockRead;
  readCount: number;
  balances: Record<string, string>;
};

export function retainedReceipt() {
  const record = makeReceiptRecord(
    {
      ...newReceiptDraft(receiptProducts[0]),
      locationId: "stockroom",
      quantity: "500",
      unit: "g",
    },
    { ...receiptIdentity, operationId: "retained" },
    receiptRetentionMode(false, true),
  );
  if (!record) return null;
  const stopped = advanceReceiptRun(
    startReceiptRun(record, 0),
    100_000,
    () => 0.5,
  );
  return restoreReceiptRecord(stopped, receiptScope);
}

function pair(record: ReceiptRecord) {
  return JSON.stringify([
    record.command.content.productId,
    record.command.content.locationId,
  ]);
}

// The simulated receipt updates a fixture ledger once. The read below uses that ledger.
export function advanceReceiptFixture(
  session: ReceiptSession,
  fixture: ReceiptFixture,
): ReceiptSession {
  const { record } = session;
  if (!record || record.nextAt === null) return session;
  const now = record.nextAt;
  if (
    record.phase === "waiting" ||
    ((fixture === "recovery" || fixture === "memory-only") && record.run === 1)
  ) {
    return { ...session, record: advanceReceiptRun(record, now, () => 0.5) };
  }
  if (fixture === "pending") {
    return {
      ...session,
      record: receiveReceiptResult(
        record,
        { type: "pending", reason: "product-archived" },
        now,
      ),
    };
  }
  if (fixture === "rejected") {
    return {
      ...session,
      record: receiveReceiptResult(
        record,
        { type: "rejected", reason: "location-unavailable" },
        now,
      ),
    };
  }
  const key = pair(record);
  const balance = addReceiptBalance(
    session.balances[key],
    record.command.baseQuantity,
  );
  if (balance === null) {
    return {
      ...session,
      record: receiveReceiptResult(
        record,
        { type: "rejected", reason: "balance-range" },
        now,
      ),
    };
  }
  const { quantity, unit } = record.command.content;
  return {
    record: receiveReceiptResult(
      record,
      { type: "applied", quantity, unit },
      now,
    ),
    balances: { ...session.balances, [key]: balance },
    read: { phase: fixture === "read-denied" ? "denied" : "loading" },
    readCount: fixture === "read-denied" ? 0 : 1,
  };
}

export function finishReceiptRead(
  session: ReceiptSession,
  fixture: ReceiptFixture,
): ReceiptSession {
  const { record, read, readCount } = session;
  if (record?.outcome !== "applied" || read.phase !== "loading") return session;
  if (fixture === "read-error" && readCount === 1)
    return { ...session, read: { phase: "error" } };
  const quantity = session.balances[pair(record)];
  return {
    ...session,
    read:
      quantity === undefined
        ? { phase: "absent" }
        : { phase: "ready", quantity, unit: record.command.product.unit },
  };
}
