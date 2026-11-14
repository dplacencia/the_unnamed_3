export type ProductColumn = "product" | "sku" | "unit" | "stock";
export type CatalogueColumn = Exclude<ProductColumn, "stock">;
export type ProductStock = {
  state: "known" | "unknown" | "none";
  measures: { value: string | null; unit: string }[];
  verify?: boolean;
};
export type PreviewProduct = {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  barcodes: string[];
  archived: boolean;
  stock: Record<string, ProductStock>;
};
export type ProductsView = {
  query: string;
  sort: { id: "product" | "sku"; desc: boolean };
  stock: boolean;
  location: string | null;
  density: "compact" | "comfortable";
  visible: { sku: boolean; unit: boolean };
  order: ProductColumn[];
  widths: Record<ProductColumn, number>;
};
export const defaultProductsView: ProductsView = {
  query: "",
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
        ? { state: "unknown", measures: [{ value: null, unit }] }
        : n === 4
          ? { state: "none", measures: [] }
          : n === 5
            ? {
                state: "known",
                measures: [
                  { value: "5.125", unit },
                  { value: null, unit: "ud" },
                ],
                verify: true,
              }
            : {
                state: "known",
                measures: [
                  {
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
                  ...(n === 1 ? [{ value: "6", unit: "ud" }] : []),
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
      stock: {
        "sales-floor": stock,
        stockroom: { state: "known", measures: [{ value: "2", unit }] },
      },
    };
  });
}

export function readProductsView(
  key: string,
  initial: Partial<ProductsView>,
): ProductsView {
  const fallback = { ...defaultProductsView, ...initial };
  try {
    const parent = window.parent as Window & {
      irinProductsPreviewEntered?: boolean;
    };
    const entry = parent.performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    if (!parent.irinProductsPreviewEntered && entry?.type !== "reload") {
      for (const stored of Object.keys(sessionStorage))
        if (stored.startsWith("irin-products-design:"))
          sessionStorage.removeItem(stored);
    }
    parent.irinProductsPreviewEntered = true;
    const stored = sessionStorage.getItem(key);
    return stored
      ? ({ ...fallback, ...JSON.parse(stored) } as ProductsView)
      : fallback;
  } catch {
    return fallback;
  }
}
