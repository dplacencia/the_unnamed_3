import { describe, expect, it } from "vitest";
import { previewProducts } from "../apps/backoffice/.storybook/stories/products-table-model";
import {
  applyEditingResults,
  changedProducts,
  editingDefaults,
  editorSchema,
  validateEditingText,
} from "../apps/backoffice/.storybook/stories/products-editing-model";

const fixtureRows = (records = previewProducts()) =>
  Object.fromEntries(
    records.map((product) => [
      product.id,
      { name: product.name, sku: product.sku ?? "", assignSku: false },
    ]),
  );

describe("selected catalogue input profiles", () => {
  it("counts received UTF-8 bytes for multibyte names", () => {
    expect(validateEditingText("name", "á".repeat(512))).toBeNull();
    expect(validateEditingText("name", "á".repeat(512) + "a")).toBe("tooLong");
  });
  it("counts SKU bytes before any matching trim", () => {
    expect(validateEditingText("sku", "é".repeat(128))).toBeNull();
    expect(validateEditingText("sku", " " + "é".repeat(128))).toBe("tooLong");
  });
  it("uses the fixed whitespace set instead of JavaScript trim", () => {
    for (const character of [
      " ",
      "\u00a0",
      "\u1680",
      "\u2007",
      "\u202f",
      "\u3000",
    ])
      expect(validateEditingText("name", character.repeat(3))).toBe("blank");
    expect(validateEditingText("name", "\ufeff")).toBeNull();
    expect(validateEditingText("sku", "\ufeff")).toBeNull();
  });
  it("rejects prohibited input before trim and does not repair ill-formed text", () => {
    for (const kind of ["name", "sku"] as const)
      for (const value of ["\tA", "A\u0085", "\u2028A", "A\ud800", "A\u0000"])
        expect(validateEditingText(kind, value)).toBe("invalid");
    expect(validateEditingText("name", "Fruta 🍊")).toBeNull();
  });
  it("keeps an omitted optional SKU valid but rejects a requested blank assignment", () => {
    const rows = fixtureRows();
    expect(editorSchema.safeParse({ rows }).success).toBe(true);
    rows["product-8"].assignSku = true;
    const result = editorSchema.safeParse({ rows });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].path).toEqual(["rows", "product-8", "sku"]);
  });
});

describe("catalogue drafts and truthful outcomes", () => {
  it("starts from confirmed values without requesting an optional assignment", () => {
    expect(editingDefaults(previewProducts())["product-8"]).toEqual({
      name: "Chocolate negro",
      sku: "",
      assignSku: false,
    });
  });
  it("preserves spaces and leading zeros in requested changes", () => {
    const records = previewProducts();
    const rows = fixtureRows(records);
    rows["product-8"] = {
      name: "  Chocolate negro  ",
      assignSku: true,
      sku: " 000008 ",
    };
    expect(changedProducts(records, rows)).toEqual([
      { id: "product-8", name: "  Chocolate negro  ", sku: " 000008 " },
    ]);
  });
  it("does not replace an existing SKU even if a draft requests assignment", () => {
    const records = previewProducts();
    const rows = fixtureRows(records);
    rows["product-1"].assignSku = true;
    rows["product-1"].sku = "replacement";
    rows["product-1"].name = "Café nuevo";
    expect(changedProducts(records, rows)).toEqual([
      { id: "product-1", name: "Café nuevo" },
    ]);
  });
  it("applies only confirmed fields and retains the rejected assignment", () => {
    const records = previewProducts();
    const rows = fixtureRows(records);
    rows["product-8"] = {
      name: "Chocolate puro",
      assignSku: true,
      sku: "000008",
    };
    const changes = changedProducts(records, rows);
    const next = applyEditingResults(records, rows, changes, {
      "product-8": { name: "confirmed", sku: "failed" },
    });
    expect(
      next.records.find((product) => product.id === "product-8"),
    ).toMatchObject({ name: "Chocolate puro", sku: null });
    expect(changedProducts(next.records, next.rows)).toEqual([
      { id: "product-8", sku: "000008" },
    ]);
    expect(records.find((product) => product.id === "product-8")?.name).toBe(
      "Chocolate negro",
    );
  });
  it("does not apply unknown outcomes or lose unrelated drafts", () => {
    const records = previewProducts();
    const rows = fixtureRows(records);
    rows["product-1"].name = "Café nuevo";
    rows["product-2"].name = "Azúcar nuevo";
    rows["product-3"].name = "Arroz nuevo";
    const next = applyEditingResults(
      records,
      rows,
      changedProducts(records, rows).slice(0, 2),
      {
        "product-1": { name: "confirmed" },
        "product-2": { name: "unconfirmed" },
      },
    );
    expect(
      next.records.find((product) => product.id === "product-1")?.name,
    ).toBe("Café nuevo");
    expect(
      next.records.find((product) => product.id === "product-2")?.name,
    ).toBe("Azúcar blanco");
    expect(changedProducts(next.records, next.rows)).toEqual([
      { id: "product-2", name: "Azúcar nuevo" },
      { id: "product-3", name: "Arroz nuevo" },
    ]);
  });
});
