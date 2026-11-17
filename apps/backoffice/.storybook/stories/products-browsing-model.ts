import {
  selectProducts,
  type PreviewProduct,
  type ProductsView,
} from "./products-table-model";

export type PageSize = 25 | 50 | 100;
export type BrowsingRequest = {
  view: ProductsView;
  size: PageSize;
  position: string | null;
};
export type BrowsingPage = {
  kind: "page";
  view: ProductsView;
  size: PageSize;
  position: string;
  pageNumber: number;
  records: PreviewProduct[];
  previous: string | null;
  next: string | null;
  estimatedTotal?: string;
  unknownCount: number;
};
export type BrowsingResult =
  BrowsingPage | { kind: "technical" } | { kind: "unusable" };
export type BrowsingState = {
  generation: number;
  phase: "idle" | "loading" | "ready" | "technical" | "unusable";
  pending: { generation: number; request: BrowsingRequest } | null;
  settled: BrowsingPage | null;
};
export type EstimateMode = "supplied" | "none" | "zero";
export type FixtureReadOptions = {
  maxRecords?: number;
  estimatedTotal?: string;
};

export function isPageSize(value: unknown): value is PageSize {
  return value === 25 || value === 50 || value === 100;
}

export function getBrowsingPage(
  records: PreviewProduct[],
  request: BrowsingRequest,
  estimateMode: EstimateMode = "supplied",
  options: FixtureReadOptions = {},
): BrowsingPage | { kind: "unusable" } {
  if (!isPageSize(request.size))
    throw new RangeError("Invalid preview page size");
  if (
    options.maxRecords !== undefined &&
    (!Number.isSafeInteger(options.maxRecords) || options.maxRecords < 1)
  )
    throw new RangeError("Invalid fixture record cap");
  const offset = fixtureOffset(request.position);
  if (offset === null) return { kind: "unusable" };
  const limit = Math.min(request.size, options.maxRecords ?? request.size);
  // Only the synthetic provider knows its issued group boundaries. Do not
  // round an incompatible retained handle into an invented page number.
  if (offset % limit !== 0) return { kind: "unusable" };

  // This deliberately retains the existing preview's demonstration matcher and
  // comparator. It is not an approved production search or ordering policy.
  const selection = selectProducts(records, request.view);
  const ordered = [...selection.products].sort((first, second) => {
    const compared =
      request.view.sort.id === "sku"
        ? (first.sku ?? "").localeCompare(second.sku ?? "", "es", {
            numeric: false,
          })
        : first.name.localeCompare(second.name, "es");
    return request.view.sort.desc ? -compared : compared;
  });
  if (offset > 0 && offset >= ordered.length) return { kind: "unusable" };
  const end = Math.min(offset + limit, ordered.length);
  return {
    kind: "page",
    view: snapshotView(request.view),
    size: request.size,
    position: fixturePosition(offset),
    pageNumber: offset / limit + 1,
    records: ordered.slice(offset, end).map(snapshotProduct),
    previous: offset > 0 ? fixturePosition(Math.max(0, offset - limit)) : null,
    next: end < ordered.length ? fixturePosition(end) : null,
    ...(estimateMode === "none"
      ? {}
      : {
          estimatedTotal:
            estimateMode === "zero"
              ? "0"
              : (options.estimatedTotal ?? String(ordered.length)),
        }),
    unknownCount: selection.unknownCount,
  };
}

export function browsingReadChanged(
  previous: ProductsView,
  next: ProductsView,
): boolean {
  return (
    resultSetChanged(previous, next) ||
    previous.stock !== next.stock ||
    previous.location !== next.location
  );
}

export function shouldRestartBrowsing(
  previous: ProductsView,
  next: ProductsView,
  previousSize: PageSize,
  nextSize: PageSize,
): boolean {
  return (
    previousSize !== nextSize ||
    resultSetChanged(previous, next) ||
    (next.filters.positiveStockOnly && previous.location !== next.location)
  );
}

export function createBrowsingState(): BrowsingState {
  return { generation: 0, phase: "idle", pending: null, settled: null };
}

export function beginBrowsingRead(
  state: BrowsingState,
  request: BrowsingRequest,
): BrowsingState {
  const generation = state.generation + 1;
  return {
    ...state,
    generation,
    phase: "loading",
    pending: {
      generation,
      request: { ...request, view: snapshotView(request.view) },
    },
  };
}

export function settleBrowsingRead(
  state: BrowsingState,
  generation: number,
  result: BrowsingResult,
): BrowsingState {
  if (
    state.phase !== "loading" ||
    state.pending?.generation !== generation ||
    state.generation !== generation
  )
    return state;
  return {
    ...state,
    phase: result.kind === "page" ? "ready" : result.kind,
    pending: null,
    settled:
      result.kind === "page"
        ? {
            ...result,
            view: snapshotView(result.view),
            records: result.records.map(snapshotProduct),
          }
        : state.settled,
  };
}

function resultSetChanged(previous: ProductsView, next: ProductsView): boolean {
  return (
    previous.query !== next.query ||
    previous.sort.id !== next.sort.id ||
    previous.sort.desc !== next.sort.desc ||
    previous.filters.includeArchived !== next.filters.includeArchived ||
    previous.filters.positiveStockOnly !== next.filters.positiveStockOnly
  );
}

function snapshotView(view: ProductsView): ProductsView {
  return {
    ...view,
    filters: { ...view.filters },
    sort: { ...view.sort },
    visible: { ...view.visible },
    order: [...view.order],
    widths: { ...view.widths },
  };
}

function snapshotProduct(product: PreviewProduct): PreviewProduct {
  return {
    ...product,
    barcodes: [...product.barcodes],
    stock: Object.fromEntries(
      Object.entries(product.stock).map(([location, stock]) => [
        location,
        {
          ...stock,
          measures: stock.measures.map((measure) => ({ ...measure })),
        },
      ]),
    ),
  };
}

// Only the synthetic provider interprets these handles. This is not an
// Inventory token format, page-number API or cross-request snapshot guarantee.
function fixturePosition(offset: number): string {
  return `fixture-position-${offset}`;
}

function fixtureOffset(position: string | null): number | null {
  if (position === null) return 0;
  const match = /^fixture-position-(0|[1-9]\d*)$/.exec(position);
  if (!match) return null;
  const offset = Number(match[1]);
  return Number.isSafeInteger(offset) ? offset : null;
}
