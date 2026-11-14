import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Tabulator,
  FilterModule,
  SortModule,
  FrozenColumnsModule,
  FormatModule,
  EditModule,
  ValidateModule,
  KeybindingsModule,
  ClipboardModule,
  SelectRangeModule,
  ResizeColumnsModule,
  MoveColumnsModule,
  ExportModule,
  type ColumnDefinition,
  type RowComponent,
} from "tabulator-tables";
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
import "tabulator-tables/dist/css/tabulator.css";
import "./tabulator.css";

Tabulator.registerModule([
  FilterModule,
  SortModule,
  FrozenColumnsModule,
  FormatModule,
  EditModule,
  ValidateModule,
  KeybindingsModule,
  ClipboardModule,
  SelectRangeModule,
  ResizeColumnsModule,
  MoveColumnsModule,
  ExportModule,
]);

export function TabulatorAdapter(props: AdapterProps) {
  const container = useRef<HTMLDivElement>(null);
  const native = useRef<Tabulator | null>(null);
  const configured = useRef(false);
  const previousRecords = useRef(props.records);
  const latest = useRef(props);
  const [built, setBuilt] = useState(false);
  const [targets, setTargets] = useState<Record<string, HTMLElement>>({});
  useEffect(() => {
    latest.current = props;
  }, [props]);
  const { records, view, phone, text, editing, drafts, expanded } = props;
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const table = new Tabulator(element, {
      height: 480,
      index: "id",
      layout: "fitData",
      renderVertical: "virtual",
      data: latest.current.records.map((record) => ({ ...record })),
      columns: [],
      columnHeaderSortMulti: false,
      movableColumns: false,
      selectableRange: true,
      selectableRangeColumns: false,
      selectableRangeRows: false,
      selectableRangeClearCells: false,
      editTriggerEvent: "dblclick",
      clipboard: true,
      clipboardCopyRowRange: "range",
      clipboardCopyStyled: false,
      clipboardCopyConfig: { columnHeaders: false },
      // Clipboard insertion is disabled. Fixture note edits use the configured
      // editor; paste workflows are outside this qualification.
      clipboardPasteParser: () => [],
      rowFormatter: (row: RowComponent) => {
        const record = row.getData() as Product;
        const element = row.getElement();
        element.dataset.rowId = record.id;
        const open = latest.current.expanded[record.id];
        let target = element.querySelector<HTMLElement>("[data-inline-target]");
        if (open) {
          if (!target) {
            target = document.createElement("div");
            target.dataset.inlineTarget = record.id;
            element.append(target);
          }
          const next = target;
          setTargets((current) =>
            current[record.id] === next
              ? current
              : { ...current, [record.id]: next },
          );
        } else if (target) {
          target.remove();
          setTargets((current) =>
            Object.fromEntries(
              Object.entries(current).filter(([id]) => id !== record.id),
            ),
          );
        }
      },
    });
    native.current = table;
    table.on("tableBuilt", () => setBuilt(true));
    table.on("rangeChanged", () => {
      element.dataset.selectedValues = JSON.stringify(table.getRangesData());
    });
    table.on("renderComplete", () => {
      if (configured.current)
        latest.current.onReady(table.getRows("active").length);
    });
    table.on("cellEdited", (cell) => {
      if (cell.getField() === "note")
        latest.current.onDraft(
          (cell.getRow().getData() as Product).id,
          String(cell.getValue()),
        );
    });
    return () => {
      native.current = null;
      table.destroy();
    };
  }, []);

  useEffect(() => {
    const table = native.current;
    if (!built || !table) return;
    configured.current = false;
    const order = fields(view, phone, editing);
    const titles = {
      product: text.products,
      sku: text.sku,
      unit: text.unit,
      stock: text.stock,
      note: text.note,
    };
    const columns: ColumnDefinition[] = order.map((field: Field) => ({
      field,
      title: titles[field],
      width: width(field, view),
      frozen: phone && field === "product",
      headerSort: false,
      titleFormatter: () => {
        const title = document.createElement(
          field === "product" || field === "sku" ? "button" : "span",
        );
        title.textContent =
          titles[field] +
          (view.sort === field ? (view.desc ? " ↓" : " ↑") : "");
        if (
          title instanceof HTMLButtonElement &&
          (field === "product" || field === "sku")
        ) {
          title.className = "grid-sort";
          title.onclick = () => latest.current.onSort(field);
        }
        return title;
      },
      sorter: (a, b) => compareText(String(a), String(b)),
      formatter: (cell) => {
        const record = cell.getRow().getData() as Product;
        const element = cell.getElement();
        element.dataset.column = field;
        element.dataset.cell = `${record.id}:${field}`;
        if (field === "product") {
          const actions = document.createElement("div");
          actions.className = "grid-cell-actions";
          const expand = document.createElement("button");
          expand.className = "grid-expand";
          expand.textContent = latest.current.expanded[record.id] ? "−" : "+";
          expand.setAttribute("aria-label", `${text.expand} ${record.sku}`);
          expand.setAttribute(
            "aria-expanded",
            String(Boolean(latest.current.expanded[record.id])),
          );
          expand.onclick = () => latest.current.onExpand(record.id);
          expand.onkeydown = (event) => {
            if (event.key === "Enter" || event.key === " ")
              event.stopPropagation();
          };
          const name = document.createElement("button");
          name.className = "grid-product";
          name.textContent = record.product;
          name.onkeydown = (event) => {
            if (event.key === "Enter" || event.key === " ")
              event.stopPropagation();
          };
          name.onclick = () => latest.current.onDetails(record.id);
          actions.append(expand, name);
          return actions;
        }
        const value = document.createElement("span");
        value.textContent =
          field === "stock"
            ? stockText(record, view, text)
            : field === "note"
              ? (latest.current.drafts[record.id] ?? record.note)
              : String(record[field]);
        return value;
      },
      // SelectRange's Enter handler calls Edit even on non-editor columns in
      // 6.7.1. Register the editor machinery but deny edits for every other field.
      editor: "input",
      editable: () => field === "note" && latest.current.editing,
      editorParams: {
        elementAttributes: {
          maxlength: "80",
          "aria-label": text.note,
          "data-note": "native",
        },
      },
      validator: field === "note" ? "maxLength:80" : undefined,
    }));
    table.setColumns(columns);
    table.setFilter((record) => matches(record as Product, view));
    table.setSort(view.sort, view.desc ? "desc" : "asc");
    configured.current = true;
    latest.current.onReady(table.getRows("active").length);
    container.current
      ?.querySelectorAll<HTMLElement>(".tabulator-col")
      .forEach((column) => {
        const field = column.getAttribute("tabulator-field");
        if (field) column.dataset.column = field;
        if (field === view.sort)
          column.setAttribute(
            "aria-sort",
            view.desc ? "descending" : "ascending",
          );
      });
  }, [built, view, phone, text, editing]);

  useEffect(() => {
    if (!built || !native.current || previousRecords.current === records)
      return;
    previousRecords.current = records;
    void native.current.replaceData(
      records.map((record) => ({
        ...record,
        note: drafts[record.id] ?? record.note,
      })),
    );
    // Draft changes use row updates below; replacing all data while typing would
    // destroy active editors and add unrelated O(n) work to every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, records]);
  const previousDrafts = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!built || !native.current) return;
    const changed = new Set([
      ...Object.keys(previousDrafts.current),
      ...Object.keys(drafts),
    ]);
    for (const id of changed) {
      const row = native.current.getRow(id);
      if (row)
        void row.update({
          note:
            drafts[id] ??
            records.find((record) => record.id === id)?.note ??
            "",
        });
    }
    previousDrafts.current = drafts;
  }, [built, drafts, records]);
  useEffect(() => {
    if (!built || !native.current) return;
    for (const row of native.current.getRows("visible")) row.reformat();
    native.current.redraw(true);
  }, [built, expanded]);
  return (
    <>
      <div
        ref={container}
        className="comparison-tabulator"
        data-engine="tabulator"
        data-comfortable={view.comfortable}
        aria-label={text.products}
      />
      <details data-native-probes>
        <summary>Native clipboard probe</summary>
        <button
          data-action="copy-native"
          onClick={() => native.current?.copyToClipboard("range")}
        >
          Copy selected cells
        </button>
      </details>
      {Object.entries(targets).map(([id, target]) => {
        const record = records.find((record) => record.id === id);
        return record && expanded[id]
          ? createPortal(
              <InlineDetail record={record} props={props} />,
              target,
              id,
            )
          : null;
      })}
    </>
  );
}

// Attribution probe: native markup without our custom cells, portals, ranges,
// editors or React controls. It is loaded only by its dedicated evaluation story.
export function NativeTabulatorProbe() {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const table = new Tabulator(element.current, {
      height: 240,
      data: [{ product: "Native fixture", sku: "000001" }],
      columns: [
        { title: "Product", field: "product" },
        { title: "SKU", field: "sku" },
      ],
    });
    return () => table.destroy();
  }, []);
  return (
    <section data-native-audit>
      <div ref={element} aria-label="Native Tabulator fixture" />
    </section>
  );
}
