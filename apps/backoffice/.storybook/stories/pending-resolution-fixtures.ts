import type { ResolutionFixture } from "./pending-resolution-model";
import type { PendingLine } from "./pending-movements-browsing-model";

const duplicateLine: PendingLine = {
  reference: "resolution-duplicate-1",
  kind: "receipt",
  location: "stockroom",
  product: "Arroz largo",
  quantity: "5",
  unit: "kg",
  reasons: ["product-archived"],
};

export const duplicateSibling: PendingLine = {
  reference: "resolution-duplicate-2",
  kind: "receipt",
  location: "stockroom",
  product: "Harina de trigo",
  quantity: "3",
  unit: "kg",
  reasons: ["product-archived"],
};

export const resolutionFixtures = {
  release: {
    kind: "release",
    line: {
      reference: "resolution-release-1",
      kind: "departure",
      location: "sales-floor",
      product: "Manzana reineta",
      quantity: "2.5",
      unit: "kg",
      channel: null,
      reasons: ["channel-missing"],
    },
    channels: [
      { id: "channel-counter", label: "Mostrador" },
      { id: "channel-pickup", label: "Recogida en tienda" },
    ],
    result: { kind: "applied", effect: { quantity: "-2.5", unit: "kg" } },
  },
  rejection: {
    kind: "reject",
    line: {
      reference: "resolution-receipt-1",
      kind: "receipt",
      location: "stockroom",
      product: "Pan de masa madre",
      quantity: "8",
      unit: "piece",
      reasons: ["product-archived"],
    },
  },
  duplicate: {
    kind: "cancel",
    line: duplicateLine,
    target: {
      merchantId: "merchant-demo",
      originNamespace: "backoffice",
      callerOperationId: "receipt-204",
    },
    counterpart: {
      merchantId: "merchant-demo",
      originNamespace: "backoffice",
      callerOperationId: "receipt-198",
    },
    targetReferences: [duplicateLine.reference, duplicateSibling.reference],
  },
  counterpartUnavailable: {
    kind: "counterpart-unavailable",
    line: { ...duplicateLine, reference: "resolution-unavailable-1" },
  },
} as const satisfies Record<string, ResolutionFixture>;

// These fixtures represent facts already provided to an authorized caller.
// The Pending line lookup cannot enumerate the surviving batches.
export const counterpartSelectionFixture = {
  ...resolutionFixtures.duplicate,
  eligibleCounterparts: [
    resolutionFixtures.duplicate.counterpart,
    {
      merchantId: "merchant-demo",
      originNamespace: "backoffice",
      callerOperationId: "receipt-197",
    },
  ],
} as const satisfies ResolutionFixture;

export const partialReceiptReleaseFixture = {
  kind: "receipt-release",
  line: {
    reference: "resolution-receipt-release",
    kind: "receipt",
    location: "stockroom",
    product: "Pan de masa madre",
    quantity: "8",
    unit: "piece",
    reasons: ["quantity-rules"],
  },
  product: {
    id: "bread",
    name: "Pan de masa madre",
    unit: "piece",
    increment: "3",
  },
} as const satisfies ResolutionFixture;
