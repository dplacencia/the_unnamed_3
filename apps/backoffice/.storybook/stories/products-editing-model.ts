import { z } from "zod";
import type { PreviewProduct } from "./products-table-model";

export type EditingDraft = { name: string; assignSku: boolean; sku: string };
export type EditingRows = Record<string, EditingDraft>;
export type ProductChange = { id: string; name?: string; sku?: string };
export type Outcome = "confirmed" | "failed" | "unconfirmed";
export type EditingResults = Record<string, { name?: Outcome; sku?: Outcome }>;
// Inventory's frozen Unicode 18.0.0 White_Space predicate, not JS trim().
const whitespace = new Set([
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  ...Array.from({ length: 11 }, (_, index) => 8192 + index),
  8232,
  8233,
  8239,
  8287,
  12288,
]);
export function validateEditingText(
  kind: "name" | "sku",
  value: string,
): "blank" | "tooLong" | "invalid" | null {
  for (const character of value) {
    const point = character.codePointAt(0)!;
    if (
      point <= 31 ||
      (point >= 127 && point <= 159) ||
      point === 8232 ||
      point === 8233 ||
      (point >= 0xd800 && point <= 0xdfff)
    )
      return "invalid";
  }
  if (
    new TextEncoder().encode(value).byteLength > (kind === "name" ? 1024 : 256)
  )
    return "tooLong";
  if (
    ![...value].some((character) => !whitespace.has(character.codePointAt(0)!))
  )
    return "blank";
  return null;
}
export function editingDefaults(records: PreviewProduct[]): EditingRows {
  return Object.fromEntries(
    records.map((product) => [
      product.id,
      { name: product.name, sku: product.sku ?? "", assignSku: false },
    ]),
  );
}
const draftSchema = z
  .object({ name: z.string(), assignSku: z.boolean(), sku: z.string() })
  .superRefine((draft, context) => {
    for (const field of ["name", ...(draft.assignSku ? ["sku"] : [])] as (
      "name" | "sku"
    )[]) {
      const reason = validateEditingText(field, draft[field]);
      if (reason)
        context.addIssue({ code: "custom", path: [field], message: reason });
    }
  });
export const editorSchema = z.object({
  rows: z.record(z.string(), draftSchema),
});
export type EditorForm = z.infer<typeof editorSchema>;

export function changedProducts(
  records: PreviewProduct[],
  rows: EditingRows,
): ProductChange[] {
  return records.flatMap((product) => {
    const draft = rows[product.id];
    if (!draft) return [];
    const change: ProductChange = { id: product.id };
    if (draft.name !== product.name) change.name = draft.name;
    if (product.sku === null && draft.assignSku) change.sku = draft.sku;
    return Object.keys(change).length > 1 ? [change] : [];
  });
}
export function applyEditingResults(
  records: PreviewProduct[],
  rows: EditingRows,
  changes: ProductChange[],
  results: EditingResults,
) {
  const nextRows = Object.fromEntries(
    Object.entries(rows).map(([id, draft]) => [id, { ...draft }]),
  );
  const nextRecords = records.map((product) => {
    const change = changes.find((entry) => entry.id === product.id);
    if (!change) return product;
    const next = { ...product };
    if (
      change.name !== undefined &&
      results[product.id]?.name === "confirmed"
    ) {
      next.name = change.name;
      nextRows[product.id].name = change.name;
    }
    if (
      change.sku !== undefined &&
      product.sku === null &&
      results[product.id]?.sku === "confirmed"
    ) {
      next.sku = change.sku;
      nextRows[product.id].sku = change.sku;
      nextRows[product.id].assignSku = false;
    }
    return next;
  });
  return { records: nextRecords, rows: nextRows };
}
