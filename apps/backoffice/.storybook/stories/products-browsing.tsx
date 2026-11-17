import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  beginBrowsingRead,
  browsingReadChanged,
  createBrowsingState,
  getBrowsingPage,
  isPageSize,
  settleBrowsingRead,
  shouldRestartBrowsing,
  type BrowsingRequest,
  type BrowsingResult,
  type BrowsingState,
  type PageSize,
} from "./products-browsing-model";
import type { PreviewProduct, ProductsView } from "./products-table-model";

export type BrowsingFixture =
  | "catalogue"
  | "delayed"
  | "loading"
  | "loading-next"
  | "read-error"
  | "next-read-error"
  | "unusable-position"
  | "without-estimate"
  | "zero-estimate"
  | "short-page";

type BrowsingOptions = {
  enabled: boolean;
  fixture: BrowsingFixture;
  records: PreviewProduct[];
  view: ProductsView;
  preferenceKey: string;
};

type BrowsingSnapshot = {
  state: BrowsingState;
  size: PageSize;
  canPrevious: boolean;
  canNext: boolean;
};

export type ProductsBrowsing = BrowsingSnapshot & {
  enter: () => void;
  leave: () => void;
  changeView: (view: ProductsView) => void;
  changeSize: (size: PageSize) => void;
  previous: () => void;
  next: () => void;
  retry: () => void;
  restart: () => void;
};

type RetainedBrowsing = {
  size: PageSize;
  position: string | null;
  present: boolean;
};

function retainedBrowsing(key: string): RetainedBrowsing {
  const empty: RetainedBrowsing = { size: 50, position: null, present: false };
  if (typeof window === "undefined") return empty;
  let stored: string | null;
  try {
    stored = sessionStorage.getItem(key);
  } catch {
    return empty;
  }
  if (stored === null) return empty;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const value = parsed as Record<string, unknown>;
      return {
        size: isPageSize(value.size) ? value.size : 50,
        position:
          value.position === null || typeof value.position === "string"
            ? value.position
            : "unusable-saved-fixture-position",
        present: true,
      };
    }
  } catch {
    // An accessible but malformed saved position is not a confirmed first page.
  }
  return {
    size: 50,
    position: "unusable-saved-fixture-position",
    present: true,
  };
}

/** Local demonstration source; none of these handles or timers is an API. */
class BrowsingController {
  private records: PreviewProduct[];
  private view: ProductsView;
  private readonly fixture: BrowsingFixture;
  private readonly preferenceKey: string;
  private state = createBrowsingState();
  private size: PageSize;
  private position: string | null;
  private active = false;
  private failedOnce = false;
  private lastRequest: BrowsingRequest | null = null;
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private readonly listeners = new Set<() => void>();
  private snapshot: BrowsingSnapshot;

  constructor(options: BrowsingOptions) {
    this.records = options.records;
    this.view = options.view;
    this.fixture = options.fixture;
    this.preferenceKey = `${options.preferenceKey}:browsing`;
    const retained = options.enabled
      ? retainedBrowsing(this.preferenceKey)
      : { size: 50 as const, position: null, present: false };
    this.size = retained.size;
    this.position =
      this.fixture === "unusable-position" && !retained.present
        ? "unusable-fixture-position"
        : retained.position;
    this.snapshot = this.makeSnapshot();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  private makeSnapshot(): BrowsingSnapshot {
    const current = this.state.settled;
    const usable =
      current !== null &&
      this.state.phase !== "loading" &&
      this.state.phase !== "idle" &&
      this.state.phase !== "unusable" &&
      current.size === this.size &&
      !browsingReadChanged(current.view, this.view);
    return {
      state: this.state,
      size: this.size,
      canPrevious: usable && current.previous !== null,
      canNext: usable && current.next !== null,
    };
  }

  private publish() {
    this.snapshot = this.makeSnapshot();
    for (const listener of this.listeners) listener();
  }

  private persist() {
    try {
      sessionStorage.setItem(
        this.preferenceKey,
        JSON.stringify({ size: this.size, position: this.position }),
      );
    } catch {
      // Existing fixture view preferences remain usable in open-app memory.
    }
  }

  setRecords = (records: PreviewProduct[]) => {
    if (records === this.records) return;
    this.records = records;
    const settled = this.state.settled;
    if (!settled) return;
    // Confirmed local fixture edits update the projection from the same known
    // source, preserving global demo ordering and any newer pending read intent.
    const updated = getBrowsingPage(
      records,
      { view: settled.view, size: settled.size, position: settled.position },
      this.estimateMode(),
      this.readOptions(),
    );
    if (updated.kind === "page") {
      this.state = { ...this.state, settled: updated };
    } else if (this.state.phase !== "loading") {
      this.state = { ...this.state, phase: "unusable", pending: null };
    }
    this.publish();
  };

  enter = () => {
    if (this.active) return;
    this.active = true;
    this.read({ view: this.view, size: this.size, position: this.position });
  };

  leave = () => {
    this.active = false;
    this.state = {
      ...this.state,
      generation: this.state.generation + 1,
      phase: "idle",
      pending: null,
    };
    this.publish();
  };

  dispose = () => {
    this.leave();
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
  };

  changeView = (next: ProductsView) => {
    const previous = this.view;
    this.view = next;
    if (!browsingReadChanged(previous, next)) {
      this.publish();
      return;
    }
    if (shouldRestartBrowsing(previous, next, this.size, this.size)) {
      this.position = null;
      this.persist();
    }
    if (this.active)
      this.read({ view: next, size: this.size, position: this.position });
    else this.publish();
  };

  changeSize = (size: PageSize) => {
    if (
      !isPageSize(size) ||
      this.state.phase === "loading" ||
      size === this.size
    )
      return;
    this.size = size;
    this.position = null;
    this.persist();
    if (this.active)
      this.read({ view: this.view, size, position: this.position });
    else this.publish();
  };

  previous = () => {
    const position = this.state.settled?.previous;
    if (this.snapshot.canPrevious && position)
      this.read({ view: this.view, size: this.size, position });
  };

  next = () => {
    const position = this.state.settled?.next;
    if (this.snapshot.canNext && position)
      this.read({ view: this.view, size: this.size, position });
  };

  retry = () => {
    if (this.state.phase === "loading" || !this.active) return;
    this.read({
      view: this.view,
      size: this.size,
      position: this.lastRequest ? this.lastRequest.position : this.position,
    });
  };

  restart = () => {
    if (this.state.phase === "loading" || !this.active) return;
    this.position = null;
    this.persist();
    this.read({ view: this.view, size: this.size, position: null });
  };

  private estimateMode() {
    return this.fixture === "without-estimate"
      ? "none"
      : this.fixture === "zero-estimate"
        ? "zero"
        : "supplied";
  }

  private readOptions() {
    return this.fixture === "short-page" ? { maxRecords: 20 } : {};
  }

  private read(request: BrowsingRequest) {
    this.state = beginBrowsingRead(this.state, request);
    this.lastRequest = this.state.pending!.request;
    const generation = this.state.generation;
    this.publish();
    if (
      this.fixture === "loading" ||
      (this.fixture === "loading-next" && request.position !== null)
    )
      return;
    const delay =
      this.fixture === "delayed" ? (request.view.query ? 50 : 800) : 250;
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (
        !this.active ||
        this.state.pending?.generation !== generation ||
        this.state.generation !== generation
      )
        return;
      let result: BrowsingResult;
      if (
        !this.failedOnce &&
        (this.fixture === "read-error" ||
          (this.fixture === "next-read-error" && request.position !== null))
      ) {
        this.failedOnce = true;
        result = { kind: "technical" };
      } else {
        result = getBrowsingPage(
          this.records,
          request,
          this.estimateMode(),
          this.readOptions(),
        );
      }
      this.state = settleBrowsingRead(this.state, generation, result);
      if (result.kind === "page") {
        this.position = result.position;
        this.persist();
      }
      this.publish();
    }, delay);
    this.timers.add(timer);
  }
}

export function useProductsBrowsing(
  options: BrowsingOptions,
): ProductsBrowsing | null {
  const [controller] = useState(() => new BrowsingController(options));
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  useEffect(
    () => controller.setRecords(options.records),
    [controller, options.records],
  );
  useEffect(() => () => controller.dispose(), [controller]);
  return useMemo(
    () =>
      options.enabled
        ? {
            ...snapshot,
            enter: controller.enter,
            leave: controller.leave,
            changeView: controller.changeView,
            changeSize: controller.changeSize,
            previous: controller.previous,
            next: controller.next,
            retry: controller.retry,
            restart: controller.restart,
          }
        : null,
    [controller, options.enabled, snapshot],
  );
}

export function BrowsingStatus({
  browsing,
  view,
}: {
  browsing: ProductsBrowsing;
  view: ProductsView;
}) {
  const t = useTranslations("catalogue");
  const { state } = browsing;
  if (state.phase === "ready") return null;
  const previous = state.settled?.view;
  const scope: string[] = [];
  if (previous) {
    scope.push(
      previous.query
        ? t("ptSearchFor", { query: previous.query })
        : t("pbAllProducts"),
    );
    if (
      previous.sort.id !== view.sort.id ||
      previous.sort.desc !== view.sort.desc
    )
      scope.push(
        `${t(previous.sort.id === "product" ? "ptProduct" : "gridSku")} ${t(previous.sort.desc ? "pbDescending" : "pbAscending")}`,
      );
    if (
      previous.filters.includeArchived !== view.filters.includeArchived ||
      previous.filters.positiveStockOnly !== view.filters.positiveStockOnly
    ) {
      const filters = [
        previous.filters.includeArchived ? t("pfIncludeArchived") : null,
        previous.filters.positiveStockOnly ? t("pfPositiveStockOnly") : null,
      ].filter(Boolean);
      scope.push(filters.length ? filters.join(" · ") : t("pbNoFilters"));
    }
    scope.push(
      previous.stock
        ? previous.location
          ? t(
              previous.location === "sales-floor"
                ? "navSalesFloor"
                : "navStockroom",
            )
          : t("navChooseLocationHint")
        : t("pbCatalogueOnly"),
    );
    if (state.settled?.size !== browsing.size)
      scope.push(`${t("pbPageSize")}: ${state.settled?.size}`);
  }
  return (
    <div className="products-browsing-status">
      {(state.phase === "loading" || state.phase === "idle") && (
        <p data-browsing-loading role="status">
          {t("pbLoading")}
        </p>
      )}
      {state.phase === "technical" && (
        <div
          data-browsing-error
          className="products-browsing-error"
          role="alert"
        >
          <span>{t("pbReadError")}</span>
          <Button
            variant="outline"
            size="sm"
            data-browsing-retry
            onClick={browsing.retry}
          >
            {t("pbRetry")}
          </Button>
        </div>
      )}
      {state.phase === "unusable" && (
        <div
          data-browsing-unusable
          className="products-browsing-error"
          role="alert"
        >
          <span>{t("pbUnusable")}</span>
          <Button
            variant="outline"
            size="sm"
            data-browsing-restart
            onClick={browsing.restart}
          >
            {t("pbRestart")}
          </Button>
        </div>
      )}
      {previous && (
        <p
          className="products-muted"
          data-browsing-previous-results
          role="status"
        >
          {t("pbPreviousResults")} {scope.join(" · ")}
        </p>
      )}
    </div>
  );
}

export function BrowsingFooter({
  browsing,
  displayedCount,
  view,
}: {
  browsing: ProductsBrowsing;
  displayedCount: number;
  view: ProductsView;
}) {
  const t = useTranslations("catalogue");
  return (
    <div className="products-browsing-footer">
      {browsing.state.settled && (
        <div
          className="products-browsing-counts"
          aria-live="polite"
          aria-atomic="true"
        >
          <span data-products-count>
            {t("pbDisplayed", { count: displayedCount })}
          </span>
          {browsing.state.settled.estimatedTotal !== undefined && (
            <span data-browsing-estimate>
              {t("pbEstimated", {
                count: browsing.state.settled.estimatedTotal,
              })}
            </span>
          )}
          {view.sort.id === "sku" && !view.visible.sku && (
            <span data-browsing-hidden-sort>
              {t("ptHiddenSort", { column: t("gridSku") })}{" "}
              {view.sort.desc ? "↓" : "↑"}
            </span>
          )}
        </div>
      )}
      <nav
        className="products-browsing-pagination"
        aria-label={t("gridProducts")}
      >
        <Button
          variant="outline"
          size="sm"
          data-browsing-previous
          disabled={!browsing.canPrevious}
          onClick={browsing.previous}
        >
          {t("pbPrevious")}
        </Button>
        {browsing.state.settled && (
          <span
            className="products-browsing-page"
            data-browsing-page
            data-page-number={browsing.state.settled.pageNumber}
            aria-current="page"
            aria-live="polite"
            aria-atomic="true"
          >
            {t("pbPage", { page: browsing.state.settled.pageNumber })}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          data-browsing-next
          disabled={!browsing.canNext}
          onClick={browsing.next}
        >
          {t("pbNext")}
        </Button>
      </nav>
    </div>
  );
}
