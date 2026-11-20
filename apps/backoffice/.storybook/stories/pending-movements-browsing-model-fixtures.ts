import type {
  PendingLine,
  PendingLocation,
  PendingReadInput,
  PendingReadOutcome,
} from "./pending-movements-browsing-model";

const locations = ["stockroom", "sales-floor"] as const;

const items = [
  { product: "Pimiento rojo", quantity: "18.450", unit: "kg" },
  { product: "Naranja de mesa", quantity: "4.725", unit: "kg" },
  { product: "Aceite de oliva", quantity: "2.500", unit: "l" },
  { product: "Cajas de cartón", quantity: "12", unit: "piece" },
  { product: "Limón", quantity: "0.950", unit: "kg" },
  { product: "Bolsas de papel", quantity: "25", unit: "piece" },
] as const;

export const pendingFixtureRows: readonly PendingLine[] = [
  {
    reference: "pending-line-001",
    kind: "receipt",
    location: "stockroom",
    product: "Tomate pera",
    quantity: "0.123456789",
    unit: "kg",
    reasons: ["product-archived"],
  },
  {
    reference: "pending-line-002",
    kind: "departure",
    location: "sales-floor",
    product: "Manzana reineta",
    quantity: "2.5",
    unit: "kg",
    channel: null,
    reasons: ["channel-missing"],
  },
  {
    reference: "pending-line-003",
    kind: "receipt",
    location: "stockroom",
    product: null,
    quantity: "12",
    unit: null,
    reasons: ["product-unresolved", "unit-unresolved"],
  },
  {
    reference: "pending-line-004",
    kind: "departure",
    location: "sales-floor",
    product: "Manzana reineta",
    quantity: null,
    unit: "piece",
    channel: "Mostrador",
    reasons: ["quantity-missing", "channel-not-enabled"],
  },
  ...Array.from({ length: 220 }, (_, index): PendingLine => {
    const sequence = index + 5;
    const facts = {
      ...items[index % items.length],
      reference: `pending-line-${String(sequence).padStart(3, "0")}`,
      location: locations[sequence % 2 ? 0 : 1],
    };
    if (sequence % 4 < 2)
      return { ...facts, kind: "receipt", reasons: ["product-archived"] };
    const channel = sequence === 54 ? "Mostrador" : null;
    return {
      ...facts,
      kind: "departure",
      channel,
      reasons: [channel === null ? "channel-missing" : "channel-not-enabled"],
    };
  }),
];

type FixtureOptions = {
  authorizedLocations?: readonly PendingLocation[];
  exclude?: ReadonlySet<string>;
  showEstimate?: boolean;
};
type Cursor = { direction: "before" | "after"; reference: string };

function encodeToken(scopeKey: string, cursor: Cursor): string {
  return btoa(`${scopeKey}|${cursor.direction}|${cursor.reference}`);
}

function decodeToken(
  scopeKey: string,
  token: string,
  scopedRows: readonly PendingLine[],
): Cursor | null {
  let decoded: string;
  try {
    decoded = atob(token);
  } catch {
    return null;
  }

  const [scope, direction, reference] = decoded.split("|");
  if (scope !== scopeKey || (direction !== "before" && direction !== "after")) {
    return null;
  }
  const cursor: Cursor = { direction, reference };
  return encodeToken(scopeKey, cursor) === token &&
    scopedRows.some((row) => row.reference === reference)
    ? cursor
    : null;
}

export function readPendingFixturePage(
  input: PendingReadInput,
  {
    authorizedLocations = locations,
    exclude,
    showEstimate = true,
  }: FixtureOptions = {},
): PendingReadOutcome {
  const { scope, size, token } = input;
  if (scope !== "all" && !authorizedLocations.includes(scope)) {
    return { kind: "denied" };
  }

  const selectedLocations = locations.filter(
    (location) =>
      authorizedLocations.includes(location) &&
      (scope === "all" || scope === location),
  );
  const scopeKey = `${scope}:${selectedLocations.join(",")}:${size}`;
  const scoped = pendingFixtureRows.filter((row) =>
    selectedLocations.includes(row.location),
  );
  const cursor =
    token === undefined ? null : decodeToken(scopeKey, token, scoped);
  if (token !== undefined && !cursor) return { kind: "rejected" };

  const pending = scoped.filter((row) => !exclude?.has(row.reference));
  const candidates = cursor
    ? pending.filter((row) =>
        cursor.direction === "before"
          ? row.reference < cursor.reference
          : row.reference > cursor.reference,
      )
    : pending;
  const rows =
    cursor?.direction === "before"
      ? candidates.slice(-size)
      : candidates.slice(0, size);
  const first = rows[0];
  const last = rows.at(-1);
  const earliest = pending[0];
  const latest = pending.at(-1);

  return {
    kind: "success",
    page: {
      rows,
      ...(first && earliest && first.reference > earliest.reference
        ? {
            previous: encodeToken(scopeKey, {
              direction: "before",
              reference: first.reference,
            }),
          }
        : {}),
      ...(last && latest && last.reference < latest.reference
        ? {
            next: encodeToken(scopeKey, {
              direction: "after",
              reference: last.reference,
            }),
          }
        : {}),
      ...(showEstimate ? { estimate: pending.length } : {}),
    },
  };
}
