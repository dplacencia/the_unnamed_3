import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
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
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  XIcon,
} from "@/icons";
import { NavigationPrototype } from "./navigation-prototype";
import {
  defaultProductsView,
  previewProducts,
  readProductsView,
  type CatalogueColumn,
  type PreviewProduct,
  type ProductColumn,
  type ProductsView,
} from "./products-table-model";
import "./products-table-preview.css";

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

export interface ProductsTablePreviewProps {
  initialStock: boolean;
  initialDensity: "compact" | "comfortable";
  hiddenColumns: boolean;
  locationCount: "one" | "several";
  archivedFixture: boolean;
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
}: {
  view: ProductsView;
  update: (next: Partial<ProductsView>) => void;
  records: PreviewProduct[];
}) {
  const t = useTranslations("catalogue");
  const phone = useSyncExternalStore(
    subscribePhone,
    () => matchMedia("(max-width: 639px)").matches,
    () => false,
  );
  const [queryDraft, setQueryDraft] = useState(view.query);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [panelId, setPanelId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
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
          !query ||
          row.original.name
            .toLocaleLowerCase("es")
            .includes(query.toLocaleLowerCase("es")) ||
          row.original.sku === query ||
          row.original.barcodes.includes(query),
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
    data: records,
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
        <label className="products-checkbox-label">
          <Checkbox
            checked={view.stock}
            onCheckedChange={(checked) => update({ stock: checked })}
          />
          {t("gridShowStock")}
        </label>
        <Popover open={viewOpen} onOpenChange={setViewOpen}>
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
      </div>
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
          {rows.map((row) => (
            <tbody key={row.id}>
              <tr data-product-id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    data-products-column={cell.column.id}
                    data-pinned={phone && cell.column.id === "product"}
                  >
                    {cell.column.id === "product" ? (
                      <div className="products-name-cell">
                        <Button
                          variant="ghost"
                          size={phone ? "icon-lg" : "icon-sm"}
                          className="products-expand"
                          data-product-expand={row.id}
                          aria-expanded={row.getIsExpanded()}
                          aria-controls={
                            row.getIsExpanded()
                              ? `summary-${row.id}`
                              : undefined
                          }
                          aria-label={t(
                            row.getIsExpanded()
                              ? "ptCollapseProduct"
                              : "ptExpandProduct",
                            {
                              product: row.original.name,
                              code: row.original.sku ?? row.id,
                            },
                          )}
                          onClick={row.getToggleExpandedHandler()}
                        >
                          <ChevronRightIcon
                            className={
                              row.getIsExpanded()
                                ? "size-4 rotate-90"
                                : "size-4"
                            }
                          />
                        </Button>
                        <Button
                          variant="link"
                          className="products-name"
                          data-product-name
                          title={row.original.name}
                          onClick={() => setPanelId(row.id)}
                        >
                          {row.original.name}
                        </Button>
                      </div>
                    ) : cell.column.id === "stock" ? (
                      <StockValue product={row.original} view={view} t={t} />
                    ) : cell.column.id === "sku" ? (
                      (row.original.sku ?? (
                        <span className="products-muted">
                          {t("ptUnassigned")}
                        </span>
                      ))
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
          ))}
        </Table>
        {!rows.length && (
          <div className="products-empty">
            <p>{t("ptNoResults")}</p>
            <p className="products-muted">{t("ptNoResultsHint")}</p>
          </div>
        )}
      </div>
      <div className="products-results">
        <span data-products-count>
          {t("ptResultCount", { count: rows.length })}
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
          if (!open) setPanelId(null);
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
              <CatalogueFacts
                product={panelProduct}
                hidden={["sku", "unit"]}
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

export function ProductsTablePreview(props: ProductsTablePreviewProps) {
  const t = useTranslations("catalogue");
  const key = `irin-products-design:${props.initialStock}:${props.initialDensity}:${props.hiddenColumns}:${props.locationCount}:${props.archivedFixture}`;
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
    (next: Partial<ProductsView>) =>
      setView((current) => ({
        ...current,
        ...next,
        ...(next.stock && props.locationCount === "one" && !current.location
          ? { location: "sales-floor" }
          : {}),
      })),
    [props.locationCount],
  );
  const records = useMemo(
    () => previewProducts(props.archivedFixture),
    [props.archivedFixture],
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
    <NavigationPrototype
      initialPage="products"
      permissionMode="ready"
      locationCount={props.locationCount}
      productsToolbar={toolbar}
      productsContent={
        <ProductsTable view={view} update={update} records={records} />
      }
    />
  );
}
