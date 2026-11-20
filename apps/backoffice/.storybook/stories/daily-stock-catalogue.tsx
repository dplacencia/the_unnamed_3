import { useMemo, type ReactNode } from "react";
import { creationUnits } from "./products-creation-model";
import { useProductEditing } from "./products-editing";
import { previewProducts, type PreviewProduct } from "./products-table-model";
import {
  ProductsTableWorkspace,
  type ProductsTablePreviewProps,
} from "./products-table-preview";
import type { ReceiptProduct } from "./stock-receipt-model";

const catalogue = previewProducts().map((product) =>
  product.id === "product-3"
    ? {
        ...product,
        stock: {
          ...product.stock,
          "sales-floor": {
            state: "known" as const,
            measures: [{ dimension: "main", value: "3", unit: product.unit }],
          },
        },
      }
    : product,
);
const stockKey = (productId: string, locationId: string) =>
  JSON.stringify([productId, locationId]);

export const dailyStockBalances = Object.fromEntries(
  catalogue.flatMap((product) =>
    Object.entries(product.stock).flatMap(([location, stock]) => {
      const value = stock.measures.find(
        ({ dimension }) => dimension === "main",
      )?.value;
      return value == null ? [] : [[stockKey(product.id, location), value]];
    }),
  ),
);

function receiptProduct(record: PreviewProduct): ReceiptProduct | null {
  const measurement = creationUnits.find(
    ({ id, symbol }) =>
      symbol === record.unit || (id === "piece" && record.unit === "ud"),
  );
  return measurement
    ? {
        id: record.id,
        name: record.name,
        reference: record.sku ?? undefined,
        unit: measurement.id,
        increment: measurement.defaultStep,
      }
    : null;
}

export function DailyStockCatalogue({
  proposeShortcut,
  balances,
  receipt,
  stockLookup,
  stockShortcut,
}: {
  proposeShortcut: boolean;
  balances: Readonly<Record<string, string>>;
  receipt: {
    label: string;
    disabled: boolean;
    open: (
      product: ReceiptProduct | undefined,
      products: readonly ReceiptProduct[],
    ) => void;
    movement: (open: () => void) => ReactNode;
  };
  stockLookup?: ProductsTablePreviewProps["stockLookup"];
  stockShortcut?: ProductsTablePreviewProps["stockShortcut"];
}) {
  const editor = useProductEditing(catalogue, "confirmed");
  const displayedRecords = useMemo(
    () =>
      editor.records.map((product) => ({
        ...product,
        stock: Object.fromEntries(
          Object.entries(product.stock).map(([location, stock]) => {
            const key = stockKey(product.id, location);
            const amount = balances[key];
            if (amount === undefined || amount === dailyStockBalances[key])
              return [location, stock];
            const main = {
              dimension: "main",
              value: amount,
              unit: product.unit,
            };
            return [
              location,
              {
                ...stock,
                state: "known" as const,
                measures: [
                  main,
                  ...stock.measures.filter(
                    ({ dimension }) => dimension !== "main",
                  ),
                ],
              },
            ];
          }),
        ),
      })),
    [editor.records, balances],
  );
  const products = editor.records.flatMap((record) => {
    const product = record.archived ? null : receiptProduct(record);
    return product ? [product] : [];
  });

  return (
    <ProductsTableWorkspace
      initialStock={false}
      initialDensity="compact"
      hiddenColumns={false}
      locationCount="several"
      archivedFixture={false}
      editor={editor}
      displayedRecords={displayedRecords}
      viewKey={`irin-daily-stock:${proposeShortcut ? "proposed" : "current"}`}
      movementsContent={receipt.movement(() =>
        receipt.open(undefined, products),
      )}
      stockLookup={stockLookup}
      stockShortcut={stockShortcut}
      receiptShortcut={
        proposeShortcut
          ? {
              label: receipt.label,
              disabled: receipt.disabled,
              open: ({ id }) => {
                const product = products.find((option) => option.id === id);
                if (product) receipt.open(product, products);
              },
            }
          : undefined
      }
    />
  );
}
