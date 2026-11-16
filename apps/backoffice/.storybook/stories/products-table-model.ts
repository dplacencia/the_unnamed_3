export type ProductColumn = "product" | "sku" | "unit" | "stock";
export type CatalogueColumn = Exclude<ProductColumn, "stock">;
export type ProductStock = {
  state: "known" | "unknown" | "none";
  measures: { dimension: string; value: string | null; unit: string }[];
  verify?: boolean;
};
export type PreviewProduct = {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  barcodes: string[];
  archived: boolean;
  reservationDimension: string;
  stock: Record<string, ProductStock>;
};
export type ProductsFilters = {
  includeArchived: boolean;
  positiveStockOnly: boolean;
};
export type ProductsView = {
  query: string;
  filters: ProductsFilters;
  sort: { id: "product" | "sku"; desc: boolean };
  stock: boolean;
  location: string | null;
  density: "compact" | "comfortable";
  visible: { sku: boolean; unit: boolean };
  order: ProductColumn[];
  widths: Record<ProductColumn, number>;
};
export type ProductsViewUpdate = Omit<
  Partial<ProductsView>,
  "filters" | "sort" | "visible" | "widths"
> & {
  filters?: Partial<ProductsFilters>;
  sort?: Partial<ProductsView["sort"]>;
  visible?: Partial<ProductsView["visible"]>;
  widths?: Partial<ProductsView["widths"]>;
};
export const defaultProductsView: ProductsView = {
  query: "",
  filters: { includeArchived: false, positiveStockOnly: false },
  sort: { id: "product", desc: false },
  stock: false,
  location: null,
  density: "compact",
  visible: { sku: true, unit: true },
  order: ["product", "sku", "unit", "stock"],
  widths: { product: 300, sku: 180, unit: 100, stock: 320 },
};
export function previewProducts(archived = false): PreviewProduct[] {
  const names = [
    "Café molido",
    "Azúcar blanco",
    "Arroz redondo",
    "Harina de trigo",
    "Aceite de oliva",
    "Almendras tostadas",
    "Agua mineral",
    "Chocolate negro",
    "Galletas de avena",
    "Garbanzos secos",
    "Miel de flores",
    "Pasta integral",
    "Aceite de oliva virgen extra de primera extracción en frío",
    "Té verde",
    "Tomate triturado",
    "Café molido",
  ];
  return names.map((name, index) => {
    const n = index + 1;
    const unit = n === 7 || n === 9 || n === 15 ? "ud" : "kg";
    const stock: ProductStock =
      n === 3
        ? {
            state: "unknown",
            measures: [{ dimension: "main", value: null, unit }],
          }
        : n === 4
          ? { state: "none", measures: [] }
          : n === 5
            ? {
                state: "known",
                measures: [
                  { dimension: "main", value: "5.125", unit },
                  { dimension: "secondary", value: null, unit: "ud" },
                ],
                verify: true,
              }
            : {
                state: "known",
                measures: [
                  {
                    dimension: "main",
                    value:
                      n === 1
                        ? "12.125"
                        : n === 2
                          ? "0"
                          : n === 6
                            ? "-2"
                            : String(n),
                    unit,
                  },
                  ...(n === 1
                    ? [{ dimension: "secondary", value: "6", unit: "ud" }]
                    : []),
                ],
              };
    return {
      id: `product-${n}`,
      name,
      sku: n === 8 ? null : String(n).padStart(6, "0"),
      unit,
      barcodes:
        n === 8
          ? []
          : [
              `084${String(n).padStart(10, "0")}`,
              ...(n === 1 ? ["0840000000101"] : []),
            ],
      archived: archived && n === 1,
      reservationDimension: "main",
      stock: {
        "sales-floor": stock,
        stockroom: {
          state: "known",
          measures: [{ dimension: "main", value: "2", unit }],
        },
      },
    };
  });
}

const previewLocations = ["sales-floor", "stockroom"];

export function applyProductsViewUpdate(
  current: ProductsView,
  next: ProductsViewUpdate,
  soleLocation?: string,
): ProductsView {
  const merged: ProductsView = {
    ...current,
    ...next,
    filters: { ...current.filters, ...next.filters },
    sort: { ...current.sort, ...next.sort },
    visible: { ...current.visible, ...next.visible },
    widths: { ...current.widths, ...next.widths },
  };
  if (next.stock && soleLocation && !merged.location)
    merged.location = soleLocation;
  if (
    !(soleLocation && merged.location === soleLocation) &&
    !previewLocations.includes(merged.location ?? "")
  )
    merged.location = null;
  if (!merged.stock || !merged.location)
    merged.filters.positiveStockOnly = false;
  return merged;
}

export function matchesProductQuery(
  product: PreviewProduct,
  query: string,
): boolean {
  return (
    !query ||
    product.name
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es")) ||
    product.sku === query ||
    product.barcodes.includes(query)
  );
}

function recordedStockMatch(
  product: PreviewProduct,
  location: string,
): "positive" | "nonpositive" | "unknown" {
  const stock = product.stock[location];
  if (!stock || stock.state === "unknown") return "unknown";
  if (stock.state === "none") return "nonpositive";
  const measure = stock.measures.find(
    (entry) => entry.dimension === product.reservationDimension,
  );
  const value = measure?.value;
  // These fixtures carry exact plain decimal text, not binary floating point.
  // An unsupported/missing value stays unknown; no other dimension rescues it.
  if (
    !product.reservationDimension ||
    typeof value !== "string" ||
    !/^-?\d+(?:\.\d+)?$/.test(value)
  )
    return "unknown";
  return !value.startsWith("-") && /[1-9]/.test(value)
    ? "positive"
    : "nonpositive";
}

export function selectProducts(
  products: PreviewProduct[],
  view: ProductsView,
): { products: PreviewProduct[]; unknownCount: number } {
  const candidates = products.filter(
    (product) =>
      (view.filters.includeArchived || !product.archived) &&
      matchesProductQuery(product, view.query),
  );
  if (!view.filters.positiveStockOnly || !view.stock || !view.location)
    return { products: candidates, unknownCount: 0 };
  const matches: PreviewProduct[] = [];
  let unknownCount = 0;
  for (const product of candidates) {
    const match = recordedStockMatch(product, view.location);
    if (match === "positive") matches.push(product);
    else if (match === "unknown") unknownCount++;
  }
  return { products: matches, unknownCount };
}

function isUsableRetainedView(view: ProductsView): boolean {
  const columns = defaultProductsView.order;
  return (
    typeof view.query === "string" &&
    typeof view.filters.includeArchived === "boolean" &&
    typeof view.filters.positiveStockOnly === "boolean" &&
    (view.sort.id === "product" || view.sort.id === "sku") &&
    typeof view.sort.desc === "boolean" &&
    typeof view.stock === "boolean" &&
    (view.location === null || typeof view.location === "string") &&
    (view.density === "compact" || view.density === "comfortable") &&
    typeof view.visible.sku === "boolean" &&
    typeof view.visible.unit === "boolean" &&
    Array.isArray(view.order) &&
    view.order.length === columns.length &&
    new Set(view.order).size === columns.length &&
    view.order.every((column) => columns.includes(column)) &&
    columns.every(
      (column) =>
        typeof view.widths[column] === "number" &&
        Number.isFinite(view.widths[column]) &&
        view.widths[column] > 0,
    )
  );
}

export function readProductsView(
  key: string,
  initial: ProductsViewUpdate,
): ProductsView {
  const fallback = applyProductsViewUpdate(defaultProductsView, initial);
  try {
    const parent = window.parent as Window & {
      irinProductsPreviewEntered?: boolean;
    };
    const entry = parent.performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    if (!parent.irinProductsPreviewEntered && entry?.type !== "reload") {
      for (const stored of Object.keys(sessionStorage))
        if (
          ["irin-products-design:", "irin-recovery-preview:"].some((prefix) =>
            stored.startsWith(prefix),
          )
        )
          sessionStorage.removeItem(stored);
    }
    parent.irinProductsPreviewEntered = true;
    const stored = sessionStorage.getItem(key);
    if (!stored) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return fallback;
    const restored = applyProductsViewUpdate(
      fallback,
      parsed as ProductsViewUpdate,
    );
    return isUsableRetainedView(restored) ? restored : fallback;
  } catch {
    return fallback;
  }
}
