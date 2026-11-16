import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  ClockIcon,
  FilterIcon,
  InfoCircleIcon,
  LayoutGridIcon,
  LockIcon,
  XIcon,
} from "@/icons";
import { NavigationPrototype } from "./navigation-prototype";
import {
  defaultProductsView,
  applyProductsViewUpdate,
  matchesProductQuery,
  previewProducts,
  readProductsView,
  selectProducts,
  type ProductsViewUpdate,
  type CatalogueColumn,
  type PreviewProduct,
  type ProductColumn,
  type ProductsView,
} from "./products-table-model";
import "./products-table-preview.css";
import {
  EditingActions,
  EditingField,
  EditingGuard,
  EditingResultsView,
  EditingSku,
  EditingValidationSummary,
  useProductEditing,
  type ProductEditing,
  type SaveFixture,
} from "./products-editing";

const features = tableFeatures({
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
});
const subscribePhone = (listener: () => void) => {
  const query = matchMedia("(max-width: 639px)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const columnLabels = {
  product: "ptProduct",
  sku: "gridSku",
  unit: "gridUnit",
  stock: "gridStock",
} as const;
type T = ReturnType<typeof useTranslations>;

export type ProductRowStatus = {
  kind: "checking" | "unconfirmed" | "locked";
  description: string;
};

function ProductExpansion({
  product,
  expanded,
  phone,
  status,
  onToggle,
}: {
  product: PreviewProduct;
  expanded: boolean;
  phone: boolean;
  status?: ProductRowStatus;
  onToggle: () => void;
}) {
  const t = useTranslations("catalogue");
  const statusDescriptionId = useId();
  const StatusIcon =
    status?.kind === "checking"
      ? ClockIcon
      : status?.kind === "locked"
        ? LockIcon
        : InfoCircleIcon;
  const control = (
    <Button
      variant="ghost"
      size={phone ? "icon-lg" : "icon-sm"}
      className="products-expand"
      data-product-expand={product.id}
      data-product-row-state={status?.kind}
      aria-describedby={status ? statusDescriptionId : undefined}
      aria-expanded={expanded}
      aria-controls={expanded ? `summary-${product.id}` : undefined}
      aria-label={t(expanded ? "ptCollapseProduct" : "ptExpandProduct", {
        product: product.name,
        code: product.sku ?? product.id,
      })}
      onClick={onToggle}
    >
      <ChevronRightIcon
        className={
          expanded
            ? "products-expand-chevron size-4 rotate-90"
            : "products-expand-chevron size-4"
        }
        aria-hidden="true"
      />
      {status && (
        <span
          className="products-row-status-marker"
          data-product-status-marker={status.kind}
          aria-hidden="true"
        >
          <StatusIcon className="size-3" />
        </span>
      )}
      {status && (
        <span className="sr-only" id={statusDescriptionId}>
          {status.description}
        </span>
      )}
    </Button>
  );
  return (
    <Tooltip disabled={!status}>
      <TooltipTrigger render={control} />
      {status && (
        <TooltipContent
          role="tooltip"
          className="products-row-status-tooltip whitespace-normal"
          align="start"
        >
          {status.description}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export interface ProductsTablePreviewProps {
  initialStock: boolean;
  initialDensity: "compact" | "comfortable";
  hiddenColumns: boolean;
  locationCount: "one" | "several";
  archivedFixture: boolean;
  saveFixture?: SaveFixture;
}

function StockValue({
  product,
  view,
  t,
}: {
  product: PreviewProduct;
  view: ProductsView;
  t: T;
}) {
  if (!view.location)
    return <span className="products-muted">{t("navChooseLocationHint")}</span>;
  const stock = product.stock[view.location];
  if (stock.state === "unknown")
    return <span className="products-muted">{t("gridUnknown")}</span>;
  if (stock.state === "none")
    return <span className="products-muted">{t("gridNone")}</span>;
  return (
    <span className="products-stock-value">
      <span>
        {stock.measures
          .map(
            (measure) => `${measure.value ?? t("gridUnknown")} ${measure.unit}`,
          )
          .join(" · ")}
      </span>
      {stock.verify && (
        <span className="products-verification">{t("gridVerify")}</span>
      )}
    </span>
  );
}

function CatalogueFacts({
  product,
  hidden,
  t,
}: {
  product: PreviewProduct;
  hidden: CatalogueColumn[];
  t: T;
}) {
  return (
    <dl className="products-facts">
      {hidden.includes("sku") && (
        <div>
          <dt>{t("gridSku")}</dt>
          <dd>
            {product.sku ?? (
              <span className="products-muted">{t("ptUnassigned")}</span>
            )}
          </dd>
        </div>
      )}
      {hidden.includes("unit") && (
        <div>
          <dt>{t("gridUnit")}</dt>
          <dd>{product.unit}</dd>
        </div>
      )}
      <div>
        <dt>{t("ptBarcodes")}</dt>
        <dd>
          {product.barcodes.length ? (
            product.barcodes.map((code) => (
              <span key={code} className="products-code">
                {code}
              </span>
            ))
          ) : (
            <span className="products-muted">{t("ptUnassigned")}</span>
          )}
        </dd>
      </div>
      <div>
        <dt>{t("ptStatus")}</dt>
        <dd>{t(product.archived ? "ptArchived" : "ptActive")}</dd>
      </div>
    </dl>
  );
}

function ProductsTable({
  view,
  update,
  records,
  editor,
  summary,
  productStatus,
}: {
  view: ProductsView;
  update: (next: ProductsViewUpdate) => void;
  records: PreviewProduct[];
  editor: ProductEditing;
  summary?: ReactNode;
  productStatus?: (product: PreviewProduct) => ProductRowStatus | undefined;
}) {
  const t = useTranslations("catalogue");
  const phone = useSyncExternalStore(
    subscribePhone,
    () => matchMedia("(max-width: 639px)").matches,
    () => false,
  );
  const [queryDraft, setQueryDraft] = useState(view.query);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { panelId, inspect: setPanelId } = editor;
  const [viewOpen, setViewOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState({ ...view.filters });
  const filterHintId = useId();
  const selection = useMemo(
    () => selectProducts(records, view),
    [records, view],
  );
  const hasFilters =
    view.filters.includeArchived || view.filters.positiveStockOnly;
  const setFilterPanel = (open: boolean) => {
    setFiltersOpen(open);
    setFilterDraft(
      open ? { ...view.filters } : { ...defaultProductsView.filters },
    );
    if (open) setViewOpen(false);
  };
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(([entry]) => {
      frame.current?.style.setProperty(
        "--products-frame-width",
        `${entry.contentRect.width}px`,
      );
    });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  const columns = useMemo<ColumnDef<typeof features, PreviewProduct>[]>(
    () => [
      {
        id: "product",
        accessorKey: "name",
        header: t("ptProduct"),
        sortFn: (a, b) => a.original.name.localeCompare(b.original.name, "es"),
        filterFn: (row, _id, query: string) =>
          matchesProductQuery(row.original, query),
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: t("gridSku"),
        sortFn: (a, b) =>
          (a.original.sku ?? "").localeCompare(b.original.sku ?? "", "es", {
            numeric: false,
          }),
      },
      {
        id: "unit",
        accessorKey: "unit",
        header: t("gridUnit"),
        enableSorting: false,
      },
      { id: "stock", header: t("gridStock"), enableSorting: false },
    ],
    [t],
  );
  const sizing = {
    ...view.widths,
    product: phone ? Math.min(view.widths.product, 200) : view.widths.product,
  };
  const table = useTable({
    features,
    columns,
    data: selection.products,
    getRowId: (record) => record.id,
    getRowCanExpand: () => true,
    autoResetAll: false,
    enableMultiSort: false,
    enableSortingRemoval: false,
    state: {
      sorting: [view.sort],
      columnFilters: [{ id: "product", value: view.query }],
      expanded,
      columnOrder: view.order,
      columnSizing: sizing,
      columnVisibility: { ...view.visible, stock: view.stock },
      columnPinning: { start: phone ? ["product"] : [], end: [] },
    },
    onExpandedChange: (updater) =>
      setExpanded((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        return next === true ? current : next;
      }),
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater([view.sort]) : updater;
      if (next[0])
        update({
          sort: { id: next[0].id as "product" | "sku", desc: next[0].desc },
        });
    },
  });
  const rows = table.getRowModel().rows;
  const visible =
    table.getHeaderGroups()[0]?.headers.map((header) => header.column) ?? [];
  const hidden = (["sku", "unit"] as const).filter(
    (field) => !view.visible[field],
  );
  const panelProduct = records.find((product) => product.id === panelId);
  const tableEditing = editor.mode?.type === "table";
  const panelEditing =
    editor.mode?.type === "panel" && editor.mode.id === panelId;
  const moveOrder = view.order.filter(
    (field) => field !== "stock" || view.stock,
  );
  const move = (field: ProductColumn, direction: number) => {
    const next = [...view.order];
    const visibleIndex = moveOrder.indexOf(field);
    const neighbour = moveOrder[visibleIndex + direction];
    if (visibleIndex < 0 || !neighbour) return;
    const index = next.indexOf(field);
    const target = next.indexOf(neighbour);
    [next[index], next[target]] = [next[target], next[index]];
    update({ order: next });
  };
  return (
    <div
      data-products-preview
      className="products-preview"
      data-density={view.density}
      style={
        {
          "--products-table-width": `${table.getTotalSize()}px`,
        } as CSSProperties
      }
    >
      <div className="products-toolbar">
        <div className="products-search-controls">
          <form
            role="search"
            className="products-search"
            onSubmit={(event) => {
              event.preventDefault();
              update({ query: queryDraft });
            }}
          >
            <div className="products-search-field">
              <Input
                type="search"
                className="products-input"
                aria-label={t("gridSearch")}
                placeholder={t("gridSearch")}
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
              />
              {(queryDraft || view.query) && (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="products-clear"
                  aria-label={t("ptClearSearch")}
                  onClick={() => {
                    setQueryDraft("");
                    update({ query: "" });
                  }}
                >
                  <XIcon className="size-4" />
                </Button>
              )}
            </div>
            <Button type="submit" size={phone ? "lg" : "sm"}>
              {t("gridFind")}
            </Button>
          </form>
          <Popover open={filtersOpen} onOpenChange={setFilterPanel}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size={phone ? "lg" : "sm"}
                  aria-label={t("gridFilters")}
                  data-products-filter-trigger
                >
                  <FilterIcon className="size-4" aria-hidden="true" />
                  {t("gridFilters")}
                </Button>
              }
            />
            <PopoverContent
              align="end"
              role="dialog"
              aria-label={t("gridFilters")}
              className="products-view-menu products-filters-menu"
              data-products-filters
            >
              <PopoverTitle className="text-sm font-semibold">
                {t("gridFilters")}
              </PopoverTitle>
              <label className="products-checkbox-label products-filter-option">
                <Checkbox
                  checked={filterDraft.includeArchived}
                  onCheckedChange={(checked) =>
                    setFilterDraft((current) => ({
                      ...current,
                      includeArchived: checked,
                    }))
                  }
                />
                {t("pfIncludeArchived")}
              </label>
              {view.stock && view.location ? (
                <div>
                  <label className="products-checkbox-label products-filter-option">
                    <Checkbox
                      checked={filterDraft.positiveStockOnly}
                      aria-describedby={filterHintId}
                      onCheckedChange={(checked) =>
                        setFilterDraft((current) => ({
                          ...current,
                          positiveStockOnly: checked,
                        }))
                      }
                    />
                    {t("pfPositiveStockOnly")}
                  </label>
                  <p
                    id={filterHintId}
                    className="products-filter-hint products-muted"
                  >
                    {t("pfPositiveStockHint")}
                  </p>
                </div>
              ) : view.stock ? (
                <p className="products-filter-hint products-muted">
                  {t("pfChooseLocation")}
                </p>
              ) : null}
              <div className="products-filter-actions">
                <Button
                  type="button"
                  variant="outline"
                  size={phone ? "lg" : "sm"}
                  onClick={() => setFilterPanel(false)}
                >
                  {t("gridCancel")}
                </Button>
                <Button
                  type="button"
                  size={phone ? "lg" : "sm"}
                  data-products-filter-apply
                  onClick={() => {
                    update({ filters: filterDraft });
                    setFilterPanel(false);
                  }}
                >
                  {t("gridApply")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <label className="products-checkbox-label">
          <Checkbox
            checked={view.stock}
            onCheckedChange={(checked) => {
              if (!checked) setFilterPanel(false);
              update({ stock: checked });
            }}
          />
          {t("gridShowStock")}
        </label>
        <Popover
          open={viewOpen}
          onOpenChange={(open) => {
            setViewOpen(open);
            if (open) setFilterPanel(false);
          }}
        >
          <PopoverTrigger
            render={
              <Button variant="outline" size={phone ? "lg" : "sm"}>
                <LayoutGridIcon className="size-4" />
                {t("gridView")}
              </Button>
            }
          />
          <PopoverContent align="end" className="products-view-menu">
            <PopoverTitle className="text-sm font-semibold">
              {t("ptTableView")}
            </PopoverTitle>
            <label className="products-density-label">
              {t("ptDensity")}
              <Select
                value={view.density}
                onValueChange={(value) => {
                  if (value === "compact" || value === "comfortable")
                    update({ density: value });
                }}
                items={[
                  { value: "compact", label: t("ptCompact") },
                  { value: "comfortable", label: t("gridComfortable") },
                ]}
              >
                <SelectTrigger size="sm" aria-label={t("ptDensity")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">{t("ptCompact")}</SelectItem>
                  <SelectItem value="comfortable">
                    {t("gridComfortable")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </label>
            <p className="products-menu-title">{t("ptColumns")}</p>
            {view.order
              .filter((field) => field !== "stock" || view.stock)
              .map((field) => (
                <div key={field} className="products-column-control">
                  <div className="products-column-line">
                    {field === "product" || field === "stock" ? (
                      <span>{t(columnLabels[field])}</span>
                    ) : (
                      <label className="products-checkbox-label">
                        <Checkbox
                          checked={view.visible[field]}
                          onCheckedChange={(checked) =>
                            update({
                              visible: { ...view.visible, [field]: checked },
                            })
                          }
                        />
                        {t(columnLabels[field])}
                      </label>
                    )}
                    <div className="products-column-move">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={moveOrder.indexOf(field) <= 0}
                        aria-label={t("ptMoveBefore", {
                          column: t(columnLabels[field]),
                        })}
                        onClick={() => move(field, -1)}
                      >
                        <ArrowUpIcon className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={
                          !moveOrder.includes(field) ||
                          moveOrder.indexOf(field) === moveOrder.length - 1
                        }
                        aria-label={t("ptMoveAfter", {
                          column: t(columnLabels[field]),
                        })}
                        onClick={() => move(field, 1)}
                      >
                        <ArrowDownIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={
                      field === "product" ? 220 : field === "stock" ? 260 : 90
                    }
                    max={
                      field === "product" ? 500 : field === "stock" ? 500 : 260
                    }
                    step="10"
                    value={view.widths[field]}
                    aria-label={t("ptWidth", {
                      column: t(columnLabels[field]),
                    })}
                    onChange={(event) =>
                      update({
                        widths: {
                          ...view.widths,
                          [field]: Number(event.target.value),
                        },
                      })
                    }
                  />
                  {phone && field === "product" && (
                    <p className="products-menu-note">
                      {t("ptPhoneWidthScope")}
                    </p>
                  )}
                </div>
              ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                update({
                  visible: defaultProductsView.visible,
                  order: defaultProductsView.order,
                  widths: defaultProductsView.widths,
                })
              }
            >
              {t("ptResetColumns")}
            </Button>
          </PopoverContent>
        </Popover>
        {tableEditing ? (
          <EditingActions editor={editor} />
        ) : (
          <Button
            size={phone ? "lg" : "sm"}
            variant="outline"
            disabled={editor.sending || editor.entryBlocked}
            onClick={() => editor.begin({ type: "table" })}
          >
            {t("peEditTable")}
          </Button>
        )}
      </div>
      {hasFilters && (
        <div className="products-applied-filters" data-products-applied-filters>
          {(
            [
              ["includeArchived", "pfIncludeArchived"],
              ["positiveStockOnly", "pfPositiveStockOnly"],
            ] as const
          ).map(([filter, label]) =>
            view.filters[filter] ? (
              <Button
                key={filter}
                type="button"
                variant="outline"
                size={phone ? "lg" : "xs"}
                className="products-filter-chip"
                aria-label={t("pfRemoveFilter", { filter: t(label) })}
                data-products-filter-remove={filter}
                onClick={() => update({ filters: { [filter]: false } })}
              >
                {t(label)}
                <XIcon className="size-3.5" aria-hidden="true" />
              </Button>
            ) : null,
          )}
          <Button
            type="button"
            variant="link"
            size={phone ? "lg" : "sm"}
            data-products-clear-filters
            onClick={() => update({ filters: defaultProductsView.filters })}
          >
            {t("pfClearFilters")}
          </Button>
        </div>
      )}
      {selection.unknownCount > 0 && (
        <p
          className="products-filter-incomplete products-muted"
          data-products-filter-incomplete
          role="status"
          aria-atomic="true"
        >
          {t("pfIncomplete", { count: selection.unknownCount })}
        </p>
      )}
      {view.query && (
        <div className="products-applied-query">
          <span>{t("ptSearchFor", { query: view.query })}</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setQueryDraft("");
              update({ query: "" });
            }}
          >
            {t("ptClearSearch")}
          </Button>
        </div>
      )}
      {tableEditing && (
        <EditingValidationSummary
          editor={editor}
          fieldVisible={(id, field) =>
            rows.some((row) => row.id === id) &&
            (field === "name" || view.visible.sku)
          }
        />
      )}
      {(tableEditing || editor.hasUnconfirmed) && (
        <EditingResultsView editor={editor} />
      )}
      {summary}
      <div className="products-table-frame" ref={frame} data-products-scroll>
        <Table className="products-data-table">
          <caption className="sr-only">{t("gridProducts")}</caption>
          <colgroup>
            {visible.map((column) => (
              <col key={column.id} style={{ width: column.getSize() }} />
            ))}
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    isHeader
                    scope="col"
                    data-products-column={header.column.id}
                    data-pinned={phone && header.column.id === "product"}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="products-sort"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {t(columnLabels[header.column.id as ProductColumn])}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUpIcon className="size-3.5" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDownIcon className="size-3.5" />
                        ) : null}
                      </Button>
                    ) : (
                      t(columnLabels[header.column.id as ProductColumn])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {rows.map((row) => {
            const status = productStatus?.(row.original);
            return (
              <tbody key={row.id}>
                <tr
                  data-product-id={row.id}
                  data-product-row-state={status?.kind}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      data-products-column={cell.column.id}
                      data-pinned={phone && cell.column.id === "product"}
                    >
                      {cell.column.id === "product" ? (
                        <div className="products-name-cell">
                          <ProductExpansion
                            product={row.original}
                            expanded={row.getIsExpanded()}
                            phone={phone}
                            status={status}
                            onToggle={row.getToggleExpandedHandler()}
                          />
                          {tableEditing ? (
                            <EditingField
                              editor={editor}
                              product={row.original}
                              field="name"
                            />
                          ) : (
                            <Button
                              variant="link"
                              className="products-name"
                              data-product-name
                              title={row.original.name}
                              onClick={() => setPanelId(row.id)}
                            >
                              {row.original.name}
                            </Button>
                          )}
                        </div>
                      ) : cell.column.id === "stock" ? (
                        <StockValue product={row.original} view={view} t={t} />
                      ) : cell.column.id === "sku" ? (
                        tableEditing ? (
                          <EditingSku editor={editor} product={row.original} />
                        ) : (
                          (row.original.sku ?? (
                            <span className="products-muted">
                              {t("ptUnassigned")}
                            </span>
                          ))
                        )
                      ) : (
                        row.original.unit
                      )}
                    </TableCell>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr className="products-summary-row">
                    <td
                      colSpan={visible.length}
                      className="products-summary-cell"
                    >
                      <div
                        id={`summary-${row.id}`}
                        data-product-summary={row.id}
                        className="products-summary"
                      >
                        {status && (
                          <p
                            className="products-expanded-status"
                            data-product-expanded-status={row.id}
                          >
                            {status.description}
                          </p>
                        )}
                        <CatalogueFacts
                          product={row.original}
                          hidden={hidden}
                          t={t}
                        />
                        <Button
                          variant="link"
                          className="products-details-action"
                          onClick={() => setPanelId(row.id)}
                        >
                          {t("ptOpenDetails")}
                          <ChevronRightIcon className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </Table>
        {!rows.length && (
          <div className="products-empty">
            <p>
              {t(
                selection.unknownCount > 0
                  ? "pfNoConfirmedMatches"
                  : hasFilters
                    ? "pfNoFilterMatches"
                    : "ptNoResults",
              )}
            </p>
            <p className="products-muted">
              {t(hasFilters ? "pfNoFilterMatchesHint" : "ptNoResultsHint")}
            </p>
          </div>
        )}
      </div>
      <div className="products-results">
        <span data-products-count>
          {t(
            selection.unknownCount > 0 ? "pfConfirmedCount" : "ptResultCount",
            { count: rows.length },
          )}
        </span>
        {view.sort.id === "sku" && !view.visible.sku && (
          <span>
            {t("ptHiddenSort", { column: t("gridSku") })}{" "}
            {view.sort.desc ? "↓" : "↑"}
          </span>
        )}
      </div>
      <Sheet
        open={panelId !== null}
        onOpenChange={(open) => {
          if (!open) {
            if (panelEditing) editor.exit(() => setPanelId(null));
            else setPanelId(null);
          }
        }}
      >
        <SheetContent
          className="products-detail-panel"
          closeLabel={t("gridClose")}
        >
          <SheetHeader>
            <SheetTitle>{panelProduct?.name ?? t("gridDetails")}</SheetTitle>
            <SheetDescription>{t("gridDetails")}</SheetDescription>
          </SheetHeader>
          {panelProduct && (
            <>
              {panelEditing ? (
                <div className="products-panel-editor">
                  <label>{t("peName")}</label>
                  <EditingField
                    editor={editor}
                    product={panelProduct}
                    field="name"
                  />
                  <label>{t("gridSku")}</label>
                  <EditingSku editor={editor} product={panelProduct} />
                  <EditingResultsView editor={editor} />
                  <EditingActions editor={editor} />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={editor.sending || editor.entryBlocked}
                  onClick={() =>
                    editor.begin({ type: "panel", id: panelProduct.id })
                  }
                >
                  {t("peEdit")}
                </Button>
              )}
              {!panelEditing && (
                <EditingResultsView
                  editor={editor}
                  productId={panelProduct.id}
                />
              )}
              <CatalogueFacts
                product={panelProduct}
                hidden={panelEditing ? ["unit"] : ["sku", "unit"]}
                t={t}
              />
              {view.stock && (
                <div className="products-panel-stock">
                  <h3>{t("gridStock")}</h3>
                  <p className="products-muted">
                    {view.location
                      ? t(
                          view.location === "sales-floor"
                            ? "navSalesFloor"
                            : "navStockroom",
                        )
                      : t("navChooseLocationHint")}
                  </p>
                  <StockValue product={panelProduct} view={view} t={t} />
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function ProductsTableWorkspace(
  props: ProductsTablePreviewProps & {
    editor: ProductEditing;
    summary?: ReactNode;
    productStatus?: (product: PreviewProduct) => ProductRowStatus | undefined;
    viewKey?: string;
  },
) {
  const { editor } = props;
  const t = useTranslations("catalogue");
  const key = `${props.viewKey ?? "irin-products-design"}:${props.initialStock}:${props.initialDensity}:${props.hiddenColumns}:${props.locationCount}:${props.archivedFixture}:${props.saveFixture ?? "confirmed"}`;
  const [view, setView] = useState(() =>
    readProductsView(key, {
      stock: props.initialStock,
      density: props.initialDensity,
      visible: { sku: !props.hiddenColumns, unit: !props.hiddenColumns },
      location:
        props.initialStock && props.locationCount === "one"
          ? "sales-floor"
          : null,
    }),
  );
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(view));
    } catch {
      /* Fixture-only retention is best effort. */
    }
  }, [key, view]);
  const update = useCallback(
    (next: ProductsViewUpdate) =>
      setView((current) =>
        applyProductsViewUpdate(
          current,
          next,
          props.locationCount === "one" ? "sales-floor" : undefined,
        ),
      ),
    [props.locationCount],
  );
  const locations =
    props.locationCount === "one"
      ? ["sales-floor"]
      : ["sales-floor", "stockroom"];
  const toolbar = view.stock ? (
    <div className="products-location-control">
      <label
        id="products-location-label"
        className="hidden text-sm font-medium sm:block"
      >
        {t("navLocation")}
      </label>
      <Select
        value={view.location}
        onValueChange={(location) => update({ location })}
        items={locations.map((value) => ({
          value,
          label: t(value === "sales-floor" ? "navSalesFloor" : "navStockroom"),
        }))}
      >
        <SelectTrigger
          size="sm"
          className="w-32 min-w-0 sm:w-48"
          aria-labelledby="products-location-label"
          data-products-location
          data-navigation-location
        >
          <SelectValue placeholder={t("navLocation")} />
        </SelectTrigger>
        <SelectContent className="gap-0 p-0 [&_[role=listbox]]:gap-0">
          {locations.map((value) => (
            <SelectItem
              key={value}
              value={value}
              className="min-h-11 rounded-none"
            >
              {t(value === "sales-floor" ? "navSalesFloor" : "navStockroom")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : undefined;
  return (
    <>
      <NavigationPrototype
        initialPage="products"
        permissionMode="ready"
        locationCount={props.locationCount}
        productsToolbar={toolbar}
        beforeNavigate={(proceed) =>
          editor.exit(() => {
            editor.inspect(null);
            proceed();
          })
        }
        productsContent={
          <ProductsTable
            view={view}
            update={update}
            records={editor.records}
            editor={editor}
            summary={props.summary}
            productStatus={props.productStatus}
          />
        }
      />
      <EditingGuard editor={editor} />
    </>
  );
}

export function ProductsTablePreview(props: ProductsTablePreviewProps) {
  const initialRecords = useMemo(
    () => previewProducts(props.archivedFixture),
    [props.archivedFixture],
  );
  const editor = useProductEditing(
    initialRecords,
    props.saveFixture ?? "confirmed",
  );
  return <ProductsTableWorkspace {...props} editor={editor} />;
}
