import {
  applyHierarchyChange,
  type CoreSite,
  type HierarchyChange,
} from "./core-hierarchy-model";
import {
  simulateSetup,
  type AreaSetup,
  type SetupChannel,
  type SetupCommand,
  type StockLocation,
} from "./inventory-setup-model";
import {
  creationDraftErrors,
  creationStep,
  type CreationDraft,
} from "./products-creation-model";
import {
  applyRecordedStockDelta,
  receiptBaseQuantity,
  type ReceiptDraft,
  type ReceiptProduct,
} from "./stock-receipt-model";

export type JourneyMovementKind = "receipt" | "departure";
export type JourneyMovement = {
  id: string;
  kind: JourneyMovementKind;
  product: ReceiptProduct;
  locationId: string;
  quantity: string;
};
export type OwnerJourneyData = {
  sites: readonly CoreSite[];
  stock: Record<string, StockLocation>;
  channels: SetupChannel[];
  products: ReceiptProduct[];
  balances: Record<string, string>;
  movements: JourneyMovement[];
};

export function emptyOwnerJourney(): OwnerJourneyData {
  return {
    sites: [],
    stock: {},
    channels: [],
    products: [],
    balances: {},
    movements: [],
  };
}

export function journeyAreas(data: OwnerJourneyData): AreaSetup[] {
  return data.sites.flatMap((site) =>
    site.areas.map((area) => ({
      id: area.id,
      name: area.name,
      siteId: site.id,
      siteName: site.name,
      active: !site.archived && !area.archived,
      canSetUpStock: true,
      canEnableChannel: true,
      stock: data.stock[area.id]
        ? { kind: "linked", location: data.stock[area.id] }
        : { kind: "absent" },
    })),
  );
}

export function applyJourneyHierarchy(
  data: OwnerJourneyData,
  change: HierarchyChange,
): OwnerJourneyData {
  const result = applyHierarchyChange(data.sites, change, {});
  return result.kind === "refused" ? data : { ...data, sites: result.sites };
}

export function applyJourneySetup(
  data: OwnerJourneyData,
  command: SetupCommand,
): OwnerJourneyData {
  const result = simulateSetup(command, journeyAreas(data), data.channels);
  switch (result.kind) {
    case "stock":
      return {
        ...data,
        stock: { ...data.stock, [result.areaId]: result.location },
      };
    case "channel":
      return data.channels.some(({ id }) => id === result.channel.id)
        ? data
        : { ...data, channels: [...data.channels, result.channel] };
    case "enable": {
      const entry = Object.entries(data.stock).find(
        ([, location]) => location.id === result.location.id,
      );
      return entry
        ? { ...data, stock: { ...data.stock, [entry[0]]: result.location } }
        : data;
    }
    case "rejected":
      return data;
  }
}

export function addJourneyProduct(
  data: OwnerJourneyData,
  draft: CreationDraft,
): OwnerJourneyData {
  const increment = creationStep(draft);
  if (
    !draft.unit ||
    increment === null ||
    Object.values(creationDraftErrors(draft)).some(Boolean)
  )
    return data;
  const product = {
    id: "journey-product-" + (data.products.length + 1),
    name: draft.name,
    unit: draft.unit,
    increment,
  };
  return { ...data, products: [...data.products, product] };
}

export function journeyStockKey(productId: string, locationId: string) {
  return JSON.stringify([productId, locationId]);
}

export function applyJourneyMovement(
  data: OwnerJourneyData,
  draft: ReceiptDraft,
  kind: JourneyMovementKind,
  channelId?: string,
): OwnerJourneyData {
  const location = Object.values(data.stock).find(
    ({ id, active }) => active && id === draft.locationId,
  );
  const product = data.products.find(({ id }) => id === draft.product?.id);
  if (!location || !product) return data;
  if (
    kind === "departure" &&
    (!channelId || !location.enabledChannelIds.includes(channelId))
  )
    return data;
  const amount = receiptBaseQuantity({ ...draft, product });
  if (amount === null) return data;
  const delta = kind === "departure" ? "-" + amount : amount;
  const key = journeyStockKey(product.id, location.id);
  const balance = applyRecordedStockDelta(data.balances[key], delta);
  if (balance === null) return data;
  return {
    ...data,
    balances: { ...data.balances, [key]: balance },
    movements: [
      ...data.movements,
      {
        id: "journey-movement-" + (data.movements.length + 1),
        kind,
        product,
        locationId: location.id,
        quantity: delta,
      },
    ],
  };
}

export function seededOwnerJourney(
  stage: "prepared" | "recorded",
): OwnerJourneyData {
  const product = {
    id: "journey-product-1",
    name: "Tomate pera",
    unit: "kg",
    increment: "0.125",
  } as const;
  const data: OwnerJourneyData = {
    ...emptyOwnerJourney(),
    sites: [
      {
        id: "site-demo",
        name: "Tienda Centro",
        zone: "Europe/Madrid",
        archived: false,
        areas: [{ id: "area-demo", name: "Sala de ventas", archived: false }],
      },
    ],
    stock: {
      "area-demo": {
        id: "stock-demo",
        active: true,
        enabledChannelIds: ["channel-demo"],
      },
    },
    channels: [{ id: "channel-demo", name: "Mostrador" }],
    products: [product],
  };
  if (stage === "prepared") return data;
  const draft = {
    product,
    locationId: "stock-demo",
    unit: "kg",
    quantity: "10",
    reference: "",
  } as const;
  const initial = applyJourneyMovement(data, draft, "receipt");
  const continued = applyJourneyMovement(
    initial,
    { ...draft, quantity: "5" },
    "receipt",
  );
  return applyJourneyMovement(
    continued,
    { ...draft, quantity: "3" },
    "departure",
    "channel-demo",
  );
}
