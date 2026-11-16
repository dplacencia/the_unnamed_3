import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyProductsViewUpdate,
  defaultProductsView,
  matchesProductQuery,
  previewProducts,
  readProductsView,
  selectProducts,
  type PreviewProduct,
  type ProductStock,
} from "../apps/backoffice/.storybook/stories/products-table-model";

const view = (next: Parameters<typeof applyProductsViewUpdate>[1] = {}) =>
  applyProductsViewUpdate(defaultProductsView, next);

function browserStore(
  stored: unknown,
  entered = true,
  key = "irin-products-design:fixture",
  extraValues: Record<string, string> = {},
  navigationType = "navigate",
) {
  const values: Record<string, string> = {
    ...extraValues,
    [key]: JSON.stringify(stored),
  };
  const storage = {
    ...values,
    getItem: (key: string) => values[key] ?? null,
    removeItem: (key: string) => {
      delete values[key];
    },
  };
  const parent = {
    irinProductsPreviewEntered: entered,
    performance: { getEntriesByType: () => [{ type: navigationType }] },
  };
  vi.stubGlobal("sessionStorage", storage);
  vi.stubGlobal("window", { parent });
  return { parent, storage };
}

afterEach(() => vi.unstubAllGlobals());

describe("applied Products view transitions", () => {
  it("defaults to active catalogue products without a stock-only filter", () => {
    expect(defaultProductsView.filters).toEqual({
      includeArchived: false,
      positiveStockOnly: false,
    });
  });

  it("merges partial nested controls without losing independent applied choices", () => {
    const current = view({
      stock: true,
      location: "sales-floor",
      query: "Café",
      density: "comfortable",
      filters: { includeArchived: true, positiveStockOnly: true },
      visible: { sku: false },
    });
    const next = applyProductsViewUpdate(current, {
      filters: { includeArchived: false },
      widths: { sku: 240 },
      sort: { desc: true },
    });
    expect(next.filters).toEqual({
      includeArchived: false,
      positiveStockOnly: true,
    });
    expect(next.query).toBe("Café");
    expect(next.density).toBe("comfortable");
    expect(next.visible).toEqual({ sku: false, unit: true });
    expect(next.sort).toEqual({ id: "product", desc: true });
    expect(next.widths).toEqual({ ...defaultProductsView.widths, sku: 240 });
  });

  it("clears the stock-only filter when stock is hidden and does not restore it on show", () => {
    const current = view({
      stock: true,
      location: "stockroom",
      filters: { positiveStockOnly: true },
    });
    const hidden = applyProductsViewUpdate(current, { stock: false });
    expect(hidden.filters.positiveStockOnly).toBe(false);
    expect(hidden.location).toBe("stockroom");
    expect(
      applyProductsViewUpdate(hidden, { stock: true }).filters
        .positiveStockOnly,
    ).toBe(false);
  });

  it("uses the sole accessible fixture location only when stock is requested", () => {
    const shown = applyProductsViewUpdate(
      defaultProductsView,
      { stock: true },
      "sales-floor",
    );
    expect(shown.location).toBe("sales-floor");
    expect(
      applyProductsViewUpdate(
        defaultProductsView,
        { density: "comfortable" },
        "sales-floor",
      ).location,
    ).toBeNull();
  });

  it("clears an invalid stock-only condition without selecting a location by guess", () => {
    expect(
      view({
        stock: true,
        location: null,
        filters: { positiveStockOnly: true },
      }).filters.positiveStockOnly,
    ).toBe(false);
    const invalid = view({
      stock: true,
      location: "not-a-preview-location",
      filters: { positiveStockOnly: true },
    });
    expect(invalid.location).toBeNull();
    expect(invalid.filters.positiveStockOnly).toBe(false);
  });

  it("clears only the filters while preserving search, sort, layout and stock scope", () => {
    const current = view({
      query: "Café",
      sort: { id: "sku", desc: true },
      density: "comfortable",
      stock: true,
      location: "stockroom",
      visible: { sku: false },
      filters: { includeArchived: true, positiveStockOnly: true },
    });
    const cleared = applyProductsViewUpdate(current, {
      filters: defaultProductsView.filters,
    });
    expect(cleared).toEqual({
      ...current,
      filters: defaultProductsView.filters,
    });
    expect(current.filters.positiveStockOnly).toBe(true);
  });
});

describe("existing submitted query semantics and archived inclusion", () => {
  it("keeps partial names case insensitive without adding accent folding", () => {
    const product = previewProducts()[0];
    expect(matchesProductQuery(product, "CAFÉ")).toBe(true);
    expect(matchesProductQuery(product, "mol")).toBe(true);
    expect(matchesProductQuery(product, "cafe")).toBe(false);
    expect(matchesProductQuery(product, "")).toBe(true);
  });

  it("uses exact textual SKU and barcode matches, preserving leading zeros", () => {
    const product = previewProducts()[0];
    expect(matchesProductQuery(product, "000001")).toBe(true);
    expect(matchesProductQuery(product, "1")).toBe(false);
    expect(matchesProductQuery(product, product.barcodes[0])).toBe(true);
    expect(matchesProductQuery(product, product.barcodes[0].slice(1))).toBe(
      false,
    );
    expect(product.sku).toBe("000001");
  });

  it("excludes archived products by default and includes them only on request", () => {
    const products = previewProducts(true);
    expect(
      selectProducts(products, view()).products.some(
        (product) => product.id === "product-1",
      ),
    ).toBe(false);
    const included = selectProducts(
      products,
      view({ filters: { includeArchived: true } }),
    );
    expect(included.products).toHaveLength(products.length);
    expect(
      included.products.find((product) => product.id === "product-1")?.archived,
    ).toBe(true);
  });

  it("applies the submitted query without altering product text or choosing a result", () => {
    const products = previewProducts();
    const result = selectProducts(products, view({ query: "CAFÉ" }));
    expect(result.products.map((product) => product.id)).toEqual([
      "product-1",
      "product-16",
    ]);
    expect(result.products[0]).toBe(products[0]);
    expect(result.unknownCount).toBe(0);
  });
});

describe("retained applied view compatibility", () => {
  it("migrates a legacy retained view without filters while preserving its controls", () => {
    browserStore({
      query: "Café",
      density: "comfortable",
      stock: true,
      location: "stockroom",
    });
    const restored = readProductsView("irin-products-design:fixture", {});
    expect(restored.query).toBe("Café");
    expect(restored.density).toBe("comfortable");
    expect(restored.location).toBe("stockroom");
    expect(restored.filters).toEqual({
      includeArchived: false,
      positiveStockOnly: false,
    });
  });

  it("merges partial retained nested preferences and clears impossible stock filtering", () => {
    browserStore({
      query: "0840000000001",
      filters: { includeArchived: true, positiveStockOnly: true },
      stock: false,
      location: "sales-floor",
      visible: { sku: false },
      widths: { sku: 210 },
    });
    const restored = readProductsView("irin-products-design:fixture", {});
    expect(restored.filters).toEqual({
      includeArchived: true,
      positiveStockOnly: false,
    });
    expect(restored.visible).toEqual({ sku: false, unit: true });
    expect(restored.widths).toEqual({
      ...defaultProductsView.widths,
      sku: 210,
    });
    expect(restored.query).toBe("0840000000001");
  });

  it("keeps separate same-tab keys independent and starts a fresh preview tab with defaults", () => {
    browserStore({ query: "Café", filters: { includeArchived: true } });
    expect(
      readProductsView("irin-products-design:other-business", {}).query,
    ).toBe("");
    browserStore({ query: "Café", filters: { includeArchived: true } }, false);
    expect(
      readProductsView("irin-products-design:fixture", {}).filters
        .includeArchived,
    ).toBe(false);
  });

  it("clears cloned Products and recovery view preferences on fresh tab entry while preserving unrelated session data", () => {
    const key = "irin-recovery-preview:exhausted";
    const copied = view({
      stock: true,
      location: "sales-floor",
      filters: { positiveStockOnly: true, includeArchived: true },
      query: "Café",
    });
    const { storage } = browserStore(copied, false, key, {
      "irin-products-design:other-view": JSON.stringify(copied),
      "unrelated:pending-work": "keep-this-work",
    });
    const fresh = readProductsView(key, {});
    expect(fresh.stock).toBe(false);
    expect(fresh.filters).toEqual({
      includeArchived: false,
      positiveStockOnly: false,
    });
    expect(fresh.query).toBe("");
    expect(storage.getItem(key)).toBeNull();
    expect(storage.getItem("irin-products-design:other-view")).toBeNull();
    expect(storage.getItem("unrelated:pending-work")).toBe("keep-this-work");
  });

  it("retains the recovery view on reload instead of treating it as a new tab", () => {
    const key = "irin-recovery-preview:exhausted";
    const retained = view({
      stock: true,
      location: "sales-floor",
      filters: { positiveStockOnly: true },
    });
    const { storage } = browserStore(retained, false, key, {}, "reload");
    const restored = readProductsView(key, {});
    expect(restored.stock).toBe(true);
    expect(restored.filters.positiveStockOnly).toBe(true);
    expect(storage.getItem(key)).not.toBeNull();
  });

  it("falls back from malformed retained control types instead of treating strings as filter booleans", () => {
    browserStore({
      query: 23,
      filters: { includeArchived: "false" },
      density: "dense",
    });
    const result = readProductsView("irin-products-design:fixture", {
      query: "Arroz",
    });
    expect(result.query).toBe("Arroz");
    expect(result.density).toBe("compact");
    expect(result.filters).toEqual({
      includeArchived: false,
      positiveStockOnly: false,
    });
  });

  it("uses normalized initial values when browser storage is unavailable", () => {
    vi.stubGlobal("window", {
      get parent() {
        throw new Error("blocked");
      },
    });
    const result = readProductsView("key", {
      query: "Arroz",
      stock: false,
      location: "sales-floor",
      filters: { includeArchived: true, positiveStockOnly: true },
    });
    expect(result.query).toBe("Arroz");
    expect(result.location).toBe("sales-floor");
    expect(result.filters).toEqual({
      includeArchived: true,
      positiveStockOnly: false,
    });
  });
});

describe("confirmed positive recorded stock and incomplete results", () => {
  const scoped = (next: Parameters<typeof applyProductsViewUpdate>[1] = {}) =>
    view({
      stock: true,
      location: "sales-floor",
      filters: { positiveStockOnly: true },
      ...next,
    });
  const withStock = (
    id: string,
    stock: ProductStock,
    reservationDimension = "main",
  ): PreviewProduct => ({
    ...previewProducts()[0],
    id,
    name: id,
    reservationDimension,
    stock: { "sales-floor": stock },
  });
  const measured = (main: string | null, secondary = "999"): ProductStock => ({
    state: "known",
    measures: [
      { dimension: "secondary", value: secondary, unit: "kg" },
      { dimension: "main", value: main, unit: "kg" },
    ],
  });

  it("uses the configured dimension rather than the first, any positive or unit label", () => {
    const products = [
      withStock("main-zero", measured("0")),
      withStock("main-negative", measured("-1")),
      withStock("main-positive", measured("0.125", "-200")),
      withStock("secondary-selected", measured("0", "3"), "secondary"),
    ];
    expect(
      selectProducts(products, scoped()).products.map((product) => product.id),
    ).toEqual(["main-positive", "secondary-selected"]);
  });

  it("compares exact decimal text without rounding or floating-point underflow", () => {
    const products = [
      withStock("tiny-positive", measured("0." + "0".repeat(400) + "1")),
      withStock("huge-positive", measured("9".repeat(400))),
      withStock("zero", measured("000.00000")),
      withStock("negative-zero", measured("-0.00000")),
      withStock("tiny-negative", measured("-0." + "0".repeat(400) + "1")),
    ];
    expect(
      selectProducts(products, scoped()).products.map((product) => product.id),
    ).toEqual(["tiny-positive", "huge-positive"]);
  });

  it("keeps verified positive recorded quantity eligible without treating verification as zero", () => {
    const product = withStock("verify-positive", {
      ...measured("5.125"),
      verify: true,
    });
    const result = selectProducts([product], scoped());
    expect(result.products).toEqual([product]);
    expect(result.products[0].stock["sales-floor"].verify).toBe(true);
    expect(result.unknownCount).toBe(0);
  });

  it("returns confirmed positives and counts unknown configured quantities without rescuing them from secondary values", () => {
    const products = [
      withStock("positive", measured("1")),
      withStock("unknown-state", {
        state: "unknown",
        measures: [{ dimension: "main", value: null, unit: "kg" }],
      }),
      withStock("unknown-main", measured(null)),
      withStock("missing-main", {
        state: "known",
        measures: [{ dimension: "secondary", value: "100", unit: "kg" }],
      }),
      withStock("missing-location", measured("1")),
      withStock("no-record", { state: "none", measures: [] }),
      withStock("zero", measured("0")),
      withStock("negative", measured("-2")),
    ];
    products[4].stock = {};
    const result = selectProducts(products, scoped());
    expect(result.products.map((product) => product.id)).toEqual(["positive"]);
    expect(result.unknownCount).toBe(4);
  });

  it("scopes unknown counts to query, archived inclusion and selected location", () => {
    const products = previewProducts(true);
    products[0].stock["sales-floor"] = {
      state: "unknown",
      measures: [{ dimension: "main", value: null, unit: "kg" }],
    };
    const salesFloor = selectProducts(products, scoped());
    expect(salesFloor.unknownCount).toBe(1);
    expect(
      selectProducts(
        products,
        scoped({ filters: { includeArchived: true, positiveStockOnly: true } }),
      ).unknownCount,
    ).toBe(2);
    expect(
      selectProducts(products, scoped({ query: "Arroz" })).unknownCount,
    ).toBe(1);
    expect(
      selectProducts(products, scoped({ query: "Chocolate" })).unknownCount,
    ).toBe(0);
    expect(
      selectProducts(products, scoped({ location: "stockroom" })).unknownCount,
    ).toBe(0);
  });

  it("does not report incomplete stock filtering while the stock-only filter is off", () => {
    const products = previewProducts();
    const result = selectProducts(
      products,
      view({ stock: true, location: "sales-floor" }),
    );
    expect(result.products).toHaveLength(products.length);
    expect(result.unknownCount).toBe(0);
    expect(result.products.some((product) => product.id === "product-4")).toBe(
      true,
    );
  });

  it.each(["\n", "\r", "\r\n", "\u2028", "\u2029"])(
    "keeps a recorded quantity with trailing line terminator %j unassessed",
    (terminator) => {
      const product = withStock(
        "trailing-terminator",
        measured(`1${terminator}`),
      );
      const result = selectProducts([product], scoped());
      expect(result.products).toEqual([]);
      expect(result.unknownCount).toBe(1);
    },
  );

  it("keeps malformed fixture quantities unknown rather than inventing a numeric result", () => {
    const products = ["NaN", "1,5", "", " 1 "].map((value, index) =>
      withStock(`invalid-${index}`, measured(value)),
    );
    const result = selectProducts(products, scoped());
    expect(result.products).toEqual([]);
    expect(result.unknownCount).toBe(products.length);
  });
});
