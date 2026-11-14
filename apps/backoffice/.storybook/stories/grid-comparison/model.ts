import { catalogueMessages } from "../../catalogue-messages";
import type { Locale } from "../../../src/i18n/configuration";

export type Candidate = "tanstack" | "tabulator";
export type Field = "product" | "sku" | "unit" | "stock" | "note";
export type Stock = {
  state: "known" | "verify" | "unknown" | "none";
  values: string[];
};
export type Product = {
  id: string;
  product: string;
  sku: string;
  barcode: string;
  unit: string;
  note: string;
  archived: boolean;
  stock: Record<string, Stock>;
};
export type View = {
  query: string;
  sort: "product" | "sku";
  desc: boolean;
  stock: boolean;
  location: string;
  archived: boolean;
  comfortable: boolean;
  skuVisible: boolean;
  skuFirst: boolean;
  width: number;
};
export const defaultView: View = {
  query: "",
  sort: "product",
  desc: false,
  stock: false,
  location: "",
  archived: false,
  comfortable: false,
  skuVisible: true,
  skuFirst: false,
  width: 240,
};

export function products(count: number): Product[] {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const state: Stock["state"] =
      n === 3 ? "none" : n === 4 ? "unknown" : n === 5 ? "verify" : "known";
    const values =
      n === 1
        ? ["9007199254740.993123 kg", "12 uds."]
        : n === 2
          ? ["0 kg", "0 uds."]
          : n === 6
            ? ["-2.125 kg"]
            : [`${n}.125 kg`, `${n} uds.`];
    return {
      id: `product-${n}`,
      product:
        n <= 2 ? "Aceite de oliva" : `Producto ${String(n).padStart(6, "0")}`,
      sku: String(n).padStart(6, "0"),
      barcode: `084${String(n).padStart(10, "0")}`,
      unit: "kg",
      note: "",
      archived: n % 20 === 0,
      stock: {
        shop: { state, values },
        store: { state, values: ["2 kg", "8 uds."] },
      },
    };
  });
}

export function matches(product: Product, view: View) {
  return (
    (view.archived || !product.archived) &&
    (!view.query ||
      product.product
        .toLocaleLowerCase("es")
        .includes(view.query.toLocaleLowerCase("es")) ||
      product.sku === view.query ||
      product.barcode === view.query)
  );
}
export function compareText(a: string, b: string) {
  return a.localeCompare(b, "es", { numeric: false });
}
export function fields(view: View, phone: boolean, editing: boolean): Field[] {
  const result: Field[] =
    view.skuFirst && !phone ? ["sku", "product"] : ["product", "sku"];
  return result
    .filter((field) => field !== "sku" || view.skuVisible)
    .concat("unit", view.stock ? ["stock"] : [], editing ? ["note"] : []);
}
export function width(field: Field, view: View) {
  return field === "product"
    ? view.width
    : field === "stock"
      ? 340
      : field === "note"
        ? 220
        : 140;
}

const labelKeys = {
  products: "gridProducts",
  sku: "gridSku",
  unit: "gridUnit",
  stock: "gridStock",
  search: "gridSearch",
  find: "gridFind",
  showStock: "gridShowStock",
  location: "gridLocation",
  choose: "gridChoose",
  shop: "gridShop",
  store: "gridStore",
  edit: "gridEdit",
  save: "gridSave",
  cancel: "gridCancel",
  details: "gridDetails",
  expand: "gridExpand",
  close: "gridClose",
  unknown: "gridUnknown",
  none: "gridNone",
  verify: "gridVerify",
  note: "gridNote",
  archived: "gridArchived",
  view: "gridView",
  comfortable: "gridComfortable",
  confirmed: "gridConfirmed",
  rejected: "gridRejected",
  uncertain: "gridUncertain",
  editDetails: "gridEditDetails",
  filters: "gridFilters",
  apply: "gridApply",
} as const;
export type Copy = Record<keyof typeof labelKeys, string>;
export const copy = Object.fromEntries(
  (["es", "en", "ca", "gl", "eu"] as const).map((locale) => [
    locale,
    Object.fromEntries(
      Object.entries(labelKeys).map(([key, message]) => [
        key,
        catalogueMessages[locale][message],
      ]),
    ),
  ]),
) as Record<Locale, Copy>;
export function stockText(product: Product, view: View, text: Copy) {
  if (!view.location) return text.choose;
  const stock = product.stock[view.location];
  if (stock.state === "unknown") return text.unknown;
  if (stock.state === "none") return text.none;
  return (
    stock.values.join(" · ") +
    (stock.state === "verify" ? ` · ${text.verify}` : "")
  );
}
export type AdapterProps = {
  records: Product[];
  view: View;
  text: Copy;
  phone: boolean;
  editing: boolean;
  drafts: Record<string, string>;
  expanded: Record<string, boolean>;
  onDraft: (id: string, value: string) => void;
  onExpand: (id: string) => void;
  onDetails: (id: string) => void;
  onSort: (field: "product" | "sku") => void;
  onReady: (count: number) => void;
};
