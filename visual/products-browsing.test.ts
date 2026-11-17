import { describe, expect, it } from "vitest";
import {
  applyProductsViewUpdate,
  defaultProductsView,
  previewProducts,
  type PreviewProduct,
} from "../apps/backoffice/.storybook/stories/products-table-model";
import {
  beginBrowsingRead,
  browsingReadChanged,
  createBrowsingState,
  getBrowsingPage,
  isPageSize,
  settleBrowsingRead,
  shouldRestartBrowsing,
  type BrowsingPage,
  type BrowsingRequest,
} from "../apps/backoffice/.storybook/stories/products-browsing-model";
import { makeBrowsingProducts } from "../apps/backoffice/.storybook/stories/products-browsing-fixtures";

const view = (next: Parameters<typeof applyProductsViewUpdate>[1] = {}) =>
  applyProductsViewUpdate(defaultProductsView, next);
const request = (next: Partial<BrowsingRequest> = {}): BrowsingRequest => ({
  view: view(),
  size: 25,
  position: null,
  ...next,
});
function records(count = 110): PreviewProduct[] {
  const original = previewProducts()[0];
  return Array.from({ length: count }, (_, index) => {
    const number = count - index;
    return {
      ...original,
      id: `record-${number}`,
      name: `Item ${String(number).padStart(5, "0")}`,
      sku: String(number).padStart(6, "0"),
      barcodes: [`084${String(number).padStart(10, "0")}`],
      stock: structuredClone(original.stock),
    };
  });
}
function page(
  next: Partial<BrowsingRequest> = {},
  source = records(),
): BrowsingPage {
  const result = getBrowsingPage(source, request(next));
  expect(result.kind).toBe("page");
  if (result.kind !== "page") throw new Error("Expected fixture page");
  return result;
}

describe("fixture page projection", () => {
  it("numbers first, following and previous result groups", () => {
    const first = page({ size: 50 });
    const second = page({ size: 50, position: first.next });
    const third = page({ size: 50, position: second.next });
    const previous = page({ size: 50, position: third.previous });
    expect(first).toHaveProperty("pageNumber", 1);
    expect(second).toHaveProperty("pageNumber", 2);
    expect(third).toHaveProperty("pageNumber", 3);
    expect(previous).toHaveProperty("pageNumber", 2);
  });

  it("numbers short groups by their continuation rather than the requested row limit", () => {
    const source = records();
    const first = getBrowsingPage(source, request({ size: 50 }), "supplied", {
      maxRecords: 20,
    });
    expect(first.kind).toBe("page");
    if (first.kind !== "page") throw new Error("Expected first short group");
    const second = getBrowsingPage(
      source,
      request({ size: 50, position: first.next }),
      "supplied",
      { maxRecords: 20 },
    );
    expect(second.kind).toBe("page");
    if (second.kind !== "page") throw new Error("Expected second short group");
    expect(first.records).toHaveLength(20);
    expect(first).toHaveProperty("pageNumber", 1);
    expect(second.records).toHaveLength(20);
    expect(second).toHaveProperty("pageNumber", 2);
  });

  it("rejects synthetic handles between group boundaries instead of rounding a page number", () => {
    const source = records();
    const between = request({ size: 50, position: "fixture-position-25" });
    expect(getBrowsingPage(source, between)).toEqual({ kind: "unusable" });
    expect(
      getBrowsingPage(source, between, "supplied", { maxRecords: 20 }),
    ).toEqual({ kind: "unusable" });
  });

  it("selects and sorts the complete fixture result before slicing a page", () => {
    const source = records();
    const first = page(
      { view: view({ sort: { id: "sku", desc: false } }) },
      source,
    );
    expect(first.records.map((product) => product.sku)).toEqual(
      Array.from({ length: 25 }, (_, index) =>
        String(index + 1).padStart(6, "0"),
      ),
    );
    expect(source[0].id).toBe("record-110");
    expect(first.estimatedTotal).toBe("110");
  });

  it("traverses first, middle and final groups without duplicating records", () => {
    let current = page();
    expect(current.previous).toBeNull();
    const seen: string[] = [];
    while (true) {
      seen.push(...current.records.map((product) => product.id));
      if (!current.next) break;
      const previous = current;
      current = page({ position: current.next });
      expect(current.previous).toBe(previous.position);
    }
    expect(current.records).toHaveLength(10);
    expect(seen).toHaveLength(110);
    expect(new Set(seen).size).toBe(110);
  });

  it("uses explicit continuation even when the fixture returns a short group", () => {
    const first = getBrowsingPage(records(), request(), "supplied", {
      maxRecords: 3,
    });
    expect(first.kind).toBe("page");
    if (first.kind !== "page") return;
    expect(first.records).toHaveLength(3);
    expect(first.next).not.toBeNull();
    const second = getBrowsingPage(
      records(),
      request({ position: first.next }),
      "supplied",
      { maxRecords: 3 },
    );
    expect(second.kind).toBe("page");
    if (second.kind !== "page") return;
    expect(second.previous).toBe(first.position);
    expect(second.records.map((product) => product.id)).not.toEqual(
      first.records.map((product) => product.id),
    );
  });

  it("keeps missing, zero and large supplied estimates distinct", () => {
    const absent = getBrowsingPage(records(), request(), "none");
    const zero = getBrowsingPage(records(), request(), "zero");
    const supplied = getBrowsingPage(records(), request(), "supplied", {
      estimatedTotal: "9007199254740993",
    });
    expect(absent.kind).toBe("page");
    expect(zero.kind).toBe("page");
    expect(supplied.kind).toBe("page");
    expect(absent).not.toHaveProperty("estimatedTotal");
    expect(zero).toHaveProperty("estimatedTotal", "0");
    expect(supplied).toHaveProperty("estimatedTotal", "9007199254740993");
  });

  it("preserves full matching-scope unknown count independently of page rows", () => {
    const source = previewProducts();
    const result = page(
      {
        view: view({
          stock: true,
          location: "sales-floor",
          filters: { positiveStockOnly: true },
        }),
      },
      source,
    );
    expect(result.unknownCount).toBe(1);
    expect(
      result.records.every(
        (product) =>
          !["product-2", "product-3", "product-4", "product-6"].includes(
            product.id,
          ),
      ),
    ).toBe(true);
  });

  it("preserves exact identifiers and uses the existing demo matcher", () => {
    const source = records();
    const result = page({ view: view({ query: "000030" }) }, source);
    expect(result.records.map((product) => product.id)).toEqual(["record-30"]);
    expect(result.records[0].sku).toBe("000030");
    const noMatch = page(
      { view: view({ query: "not a matching name or code" }) },
      source,
    );
    expect(noMatch.records).toHaveLength(0);
    expect(noMatch.next).toBeNull();
    expect(noMatch.previous).toBeNull();
  });

  it("reports unusable positions without silently returning the first group", () => {
    for (const position of [
      "not-a-fixture-position",
      "fixture-position-0001",
      "fixture-position-99999",
    ])
      expect(getBrowsingPage(records(), request({ position }))).toEqual({
        kind: "unusable",
      });
    expect(page().records).toHaveLength(25);
  });

  it("takes detached snapshots of the loaded view and stock data", () => {
    const source = records();
    const selectedView = view({ stock: true, location: "sales-floor" });
    const result = page({ view: selectedView }, source);
    const first = result.records[0];
    const original = source.find((product) => product.id === first.id)!;
    selectedView.location = "stockroom";
    selectedView.filters.positiveStockOnly = true;
    original.stock["sales-floor"].measures[0].value = "999";
    expect(result.view.location).toBe("sales-floor");
    expect(result.view.filters.positiveStockOnly).toBe(false);
    expect(first.stock["sales-floor"].measures[0].value).toBe("12.125");
  });
});

describe("selected reset and read boundaries", () => {
  it("accepts only the three selected preview page sizes", () => {
    for (const size of [25, 50, 100]) expect(isPageSize(size)).toBe(true);
    for (const size of [0, 75, 1000, "50", null])
      expect(isPageSize(size)).toBe(false);
  });

  it("restarts for page size, submitted query, sorting and applied filter changes", () => {
    const initial = view();
    expect(shouldRestartBrowsing(initial, initial, 25, 50)).toBe(true);
    for (const next of [
      view({ query: "Café" }),
      view({ sort: { desc: true } }),
      view({ filters: { includeArchived: true } }),
    ])
      expect(shouldRestartBrowsing(initial, next, 50, 50)).toBe(true);
    expect(shouldRestartBrowsing(initial, initial, 50, 50)).toBe(false);
  });

  it("keeps position on unfiltered location changes and resets on filtered ones", () => {
    const current = view({ stock: true, location: "sales-floor" });
    const next = applyProductsViewUpdate(current, { location: "stockroom" });
    expect(shouldRestartBrowsing(current, next, 50, 50)).toBe(false);
    expect(browsingReadChanged(current, next)).toBe(true);
    const filtered = applyProductsViewUpdate(current, {
      filters: { positiveStockOnly: true },
    });
    expect(
      shouldRestartBrowsing(
        filtered,
        applyProductsViewUpdate(filtered, { location: "stockroom" }),
        50,
        50,
      ),
    ).toBe(true);
    expect(
      shouldRestartBrowsing(
        filtered,
        applyProductsViewUpdate(filtered, { stock: false }),
        50,
        50,
      ),
    ).toBe(true);
  });

  it("does not fetch or restart for layout-only changes", () => {
    const current = view();
    const next = view({
      density: "comfortable",
      visible: { sku: false },
      widths: { product: 400 },
      order: ["sku", "product", "stock", "unit"],
    });
    expect(shouldRestartBrowsing(current, next, 50, 50)).toBe(false);
    expect(browsingReadChanged(current, next)).toBe(false);
    for (const change of [
      view({ query: "Arroz" }),
      view({ sort: { id: "sku" } }),
      view({ filters: { includeArchived: true } }),
      view({ stock: true }),
      view({ location: "sales-floor" }),
    ])
      expect(browsingReadChanged(current, change)).toBe(true);
  });
});

describe("read generations and settled scope", () => {
  it("keeps the confirmed page number through loading, failure and stale completion", () => {
    const second = page({ size: 50, position: "fixture-position-50" });
    const firstPending = beginBrowsingRead(
      createBrowsingState(),
      request({ size: 50, position: second.position }),
    );
    const ready = settleBrowsingRead(
      firstPending,
      firstPending.generation,
      second,
    );
    expect(ready.settled).toHaveProperty("pageNumber", 2);
    const thirdRequest = request({ size: 50, position: second.next });
    const pending = beginBrowsingRead(ready, thirdRequest);
    expect(pending.phase).toBe("loading");
    expect(pending.settled).toHaveProperty("pageNumber", 2);
    const failed = settleBrowsingRead(pending, pending.generation, {
      kind: "technical",
    });
    expect(failed.settled).toHaveProperty("pageNumber", 2);
    const retry = beginBrowsingRead(failed, thirdRequest);
    const third = page({ size: 50, position: second.next });
    const stale = settleBrowsingRead(retry, pending.generation, third);
    expect(stale).toBe(retry);
    expect(stale.settled).toHaveProperty("pageNumber", 2);
    const confirmed = settleBrowsingRead(retry, retry.generation, third);
    expect(confirmed.settled).toHaveProperty("pageNumber", 3);
    const late = settleBrowsingRead(confirmed, firstPending.generation, second);
    expect(late).toBe(confirmed);
    expect(late.settled).toHaveProperty("pageNumber", 3);
  });

  it("starts with no fabricated result and snapshots each new request", () => {
    const initial = createBrowsingState();
    expect(initial).toEqual({
      generation: 0,
      phase: "idle",
      pending: null,
      settled: null,
    });
    const nextRequest = request({
      view: view({ stock: true, location: "sales-floor" }),
    });
    const pending = beginBrowsingRead(initial, nextRequest);
    nextRequest.view.location = "stockroom";
    expect(pending.phase).toBe("loading");
    expect(pending.generation).toBe(1);
    expect(pending.pending?.request.view.location).toBe("sales-floor");
    expect(pending.settled).toBeNull();
  });

  it("retains the settled result during a later request and technical failure", () => {
    const pending = beginBrowsingRead(createBrowsingState(), request());
    const ready = settleBrowsingRead(pending, pending.generation, page());
    const next = beginBrowsingRead(
      ready,
      request({ view: view({ query: "Item" }) }),
    );
    expect(next.phase).toBe("loading");
    expect(next.settled).toBe(ready.settled);
    expect(next.settled?.view.query).toBe("");
    const failed = settleBrowsingRead(next, next.generation, {
      kind: "technical",
    });
    expect(failed.phase).toBe("technical");
    expect(failed.pending).toBeNull();
    expect(failed.settled).toBe(ready.settled);
  });

  it("ignores late and repeated completions instead of replacing newer intent", () => {
    const first = beginBrowsingRead(createBrowsingState(), request());
    const second = beginBrowsingRead(
      first,
      request({ view: view({ query: "Item 00030" }) }),
    );
    expect(settleBrowsingRead(second, first.generation, page())).toBe(second);
    const result = page({ view: view({ query: "Item 00030" }) });
    const ready = settleBrowsingRead(second, second.generation, result);
    expect(ready.phase).toBe("ready");
    expect(ready.settled?.records.map((product) => product.id)).toEqual([
      "record-30",
    ]);
    expect(
      settleBrowsingRead(ready, second.generation, { kind: "technical" }),
    ).toBe(ready);
  });

  it("keeps an unusable position unresolved until an explicit new request", () => {
    const pending = beginBrowsingRead(
      createBrowsingState(),
      request({ position: "unusable" }),
    );
    const failed = settleBrowsingRead(pending, pending.generation, {
      kind: "unusable",
    });
    expect(failed.phase).toBe("unusable");
    expect(failed.settled).toBeNull();
    expect(failed.pending).toBeNull();
    const restart = beginBrowsingRead(failed, request({ position: null }));
    expect(restart.generation).toBe(2);
    expect(restart.pending?.request.position).toBeNull();
    expect(settleBrowsingRead(restart, restart.generation, page()).phase).toBe(
      "ready",
    );
  });
});

describe("deterministic synthetic catalogue", () => {
  it("supplies the chosen review volumes with unique permanent IDs and exact codes", () => {
    const small = makeBrowsingProducts(1000);
    expect(small).toHaveLength(1000);
    expect(new Set(small.map((product) => product.id)).size).toBe(1000);
    expect(small[0].id).toBe("product-1");
    expect(small[0].sku).toBe("000001");
    expect(small[0].stock["sales-floor"].measures[0].value).toBe("12.125");
    expect(small.some((product) => product.sku === null)).toBe(true);
    expect(small.some((product) => product.archived)).toBe(true);
    expect(small).toEqual(makeBrowsingProducts(1000));
    expect(makeBrowsingProducts(10_000)).toHaveLength(10_000);
  });
});
