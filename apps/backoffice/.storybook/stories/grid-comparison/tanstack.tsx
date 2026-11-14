import { useEffect, useMemo, useRef } from "react";
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnPinningFeature,
  rowSortingFeature,
  rowExpandingFeature,
  cellSelectionFeature,
  createFilteredRowModel,
  createSortedRowModel,
  type ColumnDef,
  type CellSelectionDirection,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InlineDetail } from "./inline-detail";
import {
  compareText,
  fields,
  matches,
  stockText,
  width,
  type AdapterProps,
  type Field,
  type Product,
} from "./model";

const features = tableFeatures({
  columnFilteringFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnPinningFeature,
  rowSortingFeature,
  rowExpandingFeature,
  cellSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export function TanStackAdapter(props: AdapterProps) {
  const {
    records,
    view,
    text,
    phone,
    editing,
    drafts,
    expanded,
    onDraft,
    onExpand,
    onDetails,
    onSort,
    onReady,
  } = props;
  const container = useRef<HTMLDivElement>(null);
  const order = fields(view, phone, editing);
  const columns = useMemo<ColumnDef<typeof features, Product>[]>(
    () => [
      {
        id: "product",
        accessorKey: "product",
        header: text.products,
        filterFn: (row, _column, filter) => matches(row.original, filter),
        sortFn: (a, b) => compareText(a.original.product, b.original.product),
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: text.sku,
        sortFn: (a, b) => compareText(a.original.sku, b.original.sku),
      },
      {
        id: "unit",
        accessorKey: "unit",
        header: text.unit,
        enableSorting: false,
      },
      {
        id: "stock",
        accessorFn: (record) => stockText(record, view, text),
        header: text.stock,
        enableSorting: false,
      },
      {
        id: "note",
        accessorFn: (record) => drafts[record.id] ?? record.note,
        header: text.note,
        enableSorting: false,
      },
    ],
    [text, view, drafts],
  );
  const table = useTable({
    features,
    columns,
    data: records,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    autoResetAll: false,
    enableMultiSort: false,
    enableSortingRemoval: false,
    state: {
      sorting: [{ id: view.sort, desc: view.desc }],
      columnFilters: [{ id: "product", value: view }],
      columnOrder: order,
      columnVisibility: {
        sku: view.skuVisible,
        stock: view.stock,
        note: editing,
      },
      columnSizing: Object.fromEntries(
        order.map((field) => [field, width(field, view)]),
      ),
      columnPinning: { start: phone ? ["product"] : [], end: [] },
      expanded,
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater([{ id: view.sort, desc: view.desc }])
          : updater;
      if (next[0]) onSort(next[0].id as "product" | "sku");
    },
    onExpandedChange: (updater) => {
      const next = typeof updater === "function" ? updater(expanded) : updater;
      if (next !== true)
        for (const id of Object.keys({ ...expanded, ...next }))
          if (Boolean(expanded[id]) !== Boolean(next[id])) onExpand(id);
    },
  });
  const rows = table.getRowModel().rows;
  const rowHeight = phone ? 44 : view.comfortable ? 48 : 36;
  // Current public virtualizer API; this evaluation does not enable React Compiler.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtual = useVirtualizer({
    count: rows.length,
    getScrollElement: () => container.current,
    estimateSize: (index) => rowHeight + (expanded[rows[index]?.id] ? 86 : 0),
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 8,
  });
  useEffect(() => {
    onReady(rows.length);
  }, [rows, onReady]);
  useEffect(() => {
    virtual.measure();
  }, [virtual, rowHeight, expanded]);
  const items = virtual.getVirtualItems();
  const totalWidth = table.getTotalSize();
  const paddingTop = items[0]?.start ?? 0;
  const paddingBottom = virtual.getTotalSize() - (items.at(-1)?.end ?? 0);
  return (
    <div
      ref={container}
      className="comparison-viewport"
      data-grid-scroll
      data-engine="tanstack"
      data-selected-values={JSON.stringify(table.getSelectedCellRangesData())}
    >
      <Table className="comparison-table">
        <caption className="sr-only">{text.products}</caption>
        <colgroup>
          {table.getVisibleLeafColumns().map((column) => (
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
                  data-column={header.column.id}
                  data-pinned={phone && header.column.id === "product"}
                  style={{ width: header.getSize() }}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {header.column.getCanSort() ? (
                    <button
                      className="grid-sort"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {String(header.column.columnDef.header)}{" "}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === "desc"
                          ? "↓"
                          : "↑"
                        : ""}
                    </button>
                  ) : (
                    String(header.column.columnDef.header)
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {paddingTop > 0 && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={order.length}
                style={{ height: paddingTop, padding: 0 }}
              />
            </TableRow>
          </TableBody>
        )}
        {items.map((item) => {
          const row = rows[item.index];
          return (
            <tbody
              key={row.id}
              ref={virtual.measureElement}
              data-index={item.index}
              data-row-id={row.id}
            >
              <tr style={{ height: rowHeight }}>
                {row.getVisibleCells().map((cell) => {
                  const field = cell.column.id as Field;
                  return (
                    <TableCell
                      key={cell.id}
                      data-column={field}
                      data-pinned={phone && field === "product"}
                      data-cell={`${row.id}:${field}`}
                      tabIndex={cell.getTabIndex()}
                      onMouseDown={cell.getSelectionStartHandler()}
                      onMouseEnter={cell.getSelectionExtendHandler()}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        const directions: Record<
                          string,
                          CellSelectionDirection
                        > = {
                          ArrowDown: "down",
                          ArrowUp: "up",
                          ArrowLeft: "left",
                          ArrowRight: "right",
                        };
                        if (directions[event.key]) {
                          event.preventDefault();
                          table.setFocusedCell(row.id, field);
                          if (event.shiftKey)
                            table.extendCellSelection(directions[event.key]);
                          else table.moveCellSelection(directions[event.key]);
                          const focused = table.getFocusedCell();
                          if (focused) {
                            const next = rows.findIndex(
                              (entry) => entry.id === focused.row.id,
                            );
                            virtual.scrollToIndex(next, { align: "auto" });
                            requestAnimationFrame(() =>
                              container.current
                                ?.querySelector<HTMLElement>(
                                  `[data-cell="${focused.row.id}:${focused.column.id}"]`,
                                )
                                ?.focus(),
                            );
                          }
                        }
                      }}
                      onCopy={(event) => {
                        event.preventDefault();
                        event.clipboardData.setData(
                          "text/plain",
                          table
                            .getSelectedCellRangesData()
                            .map((range) =>
                              range
                                .map((values) => values.map(String).join("\t"))
                                .join("\n"),
                            )
                            .join("\n"),
                        );
                      }}
                    >
                      {field === "product" ? (
                        <div className="grid-cell-actions">
                          <button
                            className="grid-expand"
                            aria-label={`${text.expand} ${row.original.sku}`}
                            aria-expanded={row.getIsExpanded()}
                            onClick={row.getToggleExpandedHandler()}
                          >
                            {row.getIsExpanded() ? "−" : "+"}
                          </button>
                          <button
                            className="grid-product"
                            onClick={() => onDetails(row.id)}
                          >
                            {row.original.product}
                          </button>
                        </div>
                      ) : field === "stock" ? (
                        stockText(row.original, view, text)
                      ) : field === "note" ? (
                        <input
                          className="grid-note"
                          data-note={row.id}
                          aria-label={`${text.note} ${row.original.sku}`}
                          value={drafts[row.id] ?? row.original.note}
                          maxLength={80}
                          onChange={(event) =>
                            onDraft(row.id, event.target.value)
                          }
                        />
                      ) : (
                        String(cell.getValue())
                      )}
                    </TableCell>
                  );
                })}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={order.length}>
                    <InlineDetail record={row.original} props={props} />
                  </td>
                </tr>
              )}
            </tbody>
          );
        })}
        {paddingBottom > 0 && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={order.length}
                style={{ height: paddingBottom, padding: 0 }}
              />
            </TableRow>
          </TableBody>
        )}
      </Table>
      <style>{`.comparison-table { width: ${totalWidth}px; min-width: ${totalWidth}px; }`}</style>
      {rows.length === 0 && <p>{text.products}: 0</p>}
    </div>
  );
}
