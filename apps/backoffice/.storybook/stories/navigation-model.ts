export const destinations = [
  "home",
  "products",
  "stock",
  "movements",
  "counts",
  "inventory-settings",
  "modules",
  "business-settings",
  "help",
] as const;
export type Destination = (typeof destinations)[number];
export const inventoryPages: Destination[] = [
  "products",
  "stock",
  "movements",
  "counts",
  "inventory-settings",
];
export const locationPages = ["stock", "movements", "counts"] as const;
export type LocationPage = (typeof locationPages)[number];
export type Choices = Partial<Record<LocationPage, string>>;
export type StockEntry = { productId: string; locationId?: string };
export type PermissionMode =
  "ready" | "restricted" | "no-module" | "loading" | "error";
export type Access =
  | { status: "ready"; destinations: Destination[] }
  | { status: "loading" | "error"; destinations: null };
export type NavigationState = {
  page: Destination;
  openGroup: string | null;
  choices: Choices;
  stockEntry?: StockEntry;
};
type Event =
  | { type: "page"; page: Destination }
  | { type: "stock-entry"; entry: StockEntry }
  | { type: "group"; group: string }
  | { type: "location"; page: LocationPage; location: string };
export function initialNavigation(page: Destination): NavigationState {
  return {
    page,
    openGroup: inventoryPages.includes(page) ? "inventory" : null,
    choices: {},
  };
}
export function navigate(
  state: NavigationState,
  event: Event,
): NavigationState {
  switch (event.type) {
    case "page":
      return {
        ...state,
        page: event.page,
        stockEntry: undefined,
        openGroup: inventoryPages.includes(event.page)
          ? "inventory"
          : state.openGroup,
      };
    case "stock-entry":
      return {
        ...state,
        page: "stock",
        openGroup: "inventory",
        stockEntry: event.entry,
      };
    case "group":
      return {
        ...state,
        openGroup: state.openGroup === event.group ? null : event.group,
      };
    case "location":
      return {
        ...state,
        choices: { ...state.choices, [event.page]: event.location },
        stockEntry:
          event.page === "stock" && state.stockEntry
            ? { productId: state.stockEntry.productId }
            : state.stockEntry,
      };
  }
}
export function accessFor(mode: PermissionMode): Access {
  if (mode === "loading" || mode === "error")
    return { status: mode, destinations: null };
  return {
    status: "ready",
    destinations: destinations.filter(
      (page) =>
        mode === "ready" ||
        !inventoryPages.includes(page) ||
        (mode === "restricted" && page === "products"),
    ),
  };
}
export function resolveLocation(
  choice: string | undefined,
  available: readonly string[],
): string | undefined {
  if (choice !== undefined)
    return available.includes(choice) ? choice : undefined;
  return available.length === 1 ? available[0] : undefined;
}
export function restoreChoices(
  raw: string | null,
  entryType = "reload",
  allowAllMovementsLocations = false,
): Choices {
  if (entryType !== "reload") return {};
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      locationPages.flatMap((page) => {
        const choice = (value as Record<string, unknown>)[page];
        return choice === "stockroom" ||
          choice === "sales-floor" ||
          (allowAllMovementsLocations &&
            page === "movements" &&
            choice === "all")
          ? [[page, choice]]
          : [];
      }),
    );
  } catch {
    return {};
  }
}
