import { previewProducts, type PreviewProduct } from "./products-table-model";

/** Deterministic demonstration data, not merchant evidence or a capacity claim. */
export function makeBrowsingProducts(count: number): PreviewProduct[] {
  if (!Number.isSafeInteger(count) || count < 0)
    throw new RangeError("Invalid synthetic catalogue size");
  const originals = previewProducts();
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const original = originals[index % originals.length];
    const retainedExample = number <= originals.length;
    const missingSku = number === 8 || (!retainedExample && number % 8 === 0);
    return {
      ...original,
      id: `product-${number}`,
      name: retainedExample
        ? original.name
        : `${original.name} ${String(number).padStart(5, "0")}`,
      sku: missingSku ? null : String(number).padStart(6, "0"),
      barcodes: missingSku
        ? []
        : retainedExample
          ? [...original.barcodes]
          : [`098${String(number).padStart(10, "0")}`],
      archived: !retainedExample && number % 37 === 0,
      stock: Object.fromEntries(
        Object.entries(original.stock).map(([location, stock]) => [
          location,
          {
            ...stock,
            measures: stock.measures.map((measure) => ({ ...measure })),
          },
        ]),
      ),
    };
  });
}
