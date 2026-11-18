"use client";

import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  NavigationPrototype,
  type StockLookupNavigation,
} from "./navigation-prototype";
import type { StockEntry } from "./navigation-model";
import { previewProducts } from "./products-table-model";
import { ProductsTablePreview } from "./products-table-preview";
import { StockLookupContent, type LookupProduct } from "./stock-lookup-content";
import { lookupMessages } from "./stock-lookup-messages";
import type { StockOutcome, StockPair } from "./stock-lookup-model";
import { receiptProducts } from "./stock-receipt-fixtures";
import { StockReceiptPreview } from "./stock-receipt-preview";

export const stockLookupFixtures = [
  "lookup",
  "from-product",
  "from-receipt",
  "loading",
  "refresh",
  "initial-failure",
  "denied",
  "invalid",
  "race",
  "single-location",
  "denied-receipt",
] as const;
type Fixture = (typeof stockLookupFixtures)[number];
type Balances = Readonly<Record<string, string>>;
type ReadStock = (pair: StockPair) => Promise<StockOutcome>;

const productKey = "irin-stock-lookup:demo-merchant:product";
const lookupProducts: readonly LookupProduct[] = [
  { id: "tomato", name: "Tomate pera", reference: "TOM-001" },
  { id: "tomato-bulk", name: "Tomate pera", reference: "TOM-002" },
  { id: "boxes", name: "Cajas" },
  { id: "oil", name: "Aceite de oliva" },
  { id: "flour", name: "Harina de trigo" },
];
const tableProducts = previewProducts();
const initialBalances: Balances = {
  '["tomato","stockroom"]': "12.125",
  '["tomato","sales-floor"]': "7.25",
  '["tomato-bulk","stockroom"]': "0",
  '["tomato-bulk","sales-floor"]': "0",
  '["boxes","stockroom"]': "0",
  '["boxes","sales-floor"]': "0",
  '["oil","stockroom"]': "-0.25",
  '["oil","sales-floor"]': "-0.25",
};

function balance(amount: string, unit: string): StockOutcome {
  return { kind: "balance", balance: { amount, unit } };
}

function recordedStock(pair: StockPair, ledger: Balances): StockOutcome {
  const key = JSON.stringify([pair.productId, pair.locationId]);
  const amount = ledger[key];
  if (amount !== undefined) {
    const unit =
      receiptProducts.find(({ id }) => id === pair.productId)?.unit ?? "kg";
    return balance(amount, unit);
  }
  if (pair.productId === "flour") return { kind: "no-record" };
  const stock = tableProducts.find(({ id }) => id === pair.productId)?.stock[
    pair.locationId
  ];
  if (!stock) return { kind: "invalid" };
  if (stock.state === "none") return { kind: "no-record" };
  const main = stock.measures.find(({ dimension }) => dimension === "main");
  return main?.value != null
    ? balance(main.value, main.unit)
    : { kind: "error" };
}

function fixtureRead(
  fixture: Fixture,
  pair: StockPair,
  attempt: number,
  ledger: Balances,
): { delay: number; outcome: StockOutcome } {
  const recorded = recordedStock(pair, ledger);
  if (fixture === "race") {
    if (attempt === 1) return { delay: 1700, outcome: recorded };
    if (attempt === 2) return { delay: 1200, outcome: recorded };
    if (attempt === 3) return { delay: 120, outcome: balance("16.875", "kg") };
  }
  if (fixture === "refresh") {
    if (attempt === 2) return { delay: 950, outcome: { kind: "error" } };
    if (attempt === 3) return { delay: 250, outcome: { kind: "no-record" } };
  }
  if (fixture === "initial-failure" && attempt === 1)
    return { delay: 350, outcome: { kind: "error" } };
  if (fixture === "denied-receipt" || (fixture === "denied" && attempt === 2))
    return { delay: 350, outcome: { kind: "denied" } };
  if (fixture === "invalid" && attempt === 2)
    return { delay: 350, outcome: { kind: "invalid" } };
  const delay =
    fixture === "loading"
      ? 5200
      : fixture === "from-receipt" && attempt > 1
        ? 3100
        : 350;
  return { delay, outcome: recorded };
}

function restoreProduct() {
  try {
    const entry = window.parent.performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type === "reload") return sessionStorage.getItem(productKey);
    sessionStorage.removeItem(productKey);
  } catch {
    // Explicit choices still work in memory while the catalogue is open.
  }
  return null;
}

function LookupVisit({
  productId,
  products,
  remember,
  location,
  read,
}: {
  productId: string | undefined;
  products: readonly LookupProduct[];
  remember: (product: LookupProduct | null) => void;
  location: Parameters<StockLookupNavigation["render"]>[0];
  read: ReadStock;
}) {
  const [product, setProduct] = useState(
    () => products.find(({ id }) => id === productId) ?? null,
  );
  return (
    <StockLookupContent
      products={products}
      product={product}
      onProductChange={(next) => {
        setProduct(next);
        remember(next);
      }}
      location={location}
      read={read}
    />
  );
}

export function StockLookupPreview({ fixture }: { fixture: Fixture }) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const label = lookupMessages(locale).viewStock;
  const [entry, setEntry] = useState<StockEntry>();
  const [rememberedProduct, setRememberedProduct] = useState(restoreProduct);
  const [requested, setRequested] = useState(0);
  const [settled, setSettled] = useState(0);
  const sequence = useRef(0);

  function remember(product: LookupProduct | null) {
    setRememberedProduct(product?.id ?? null);
    try {
      if (product) sessionStorage.setItem(productKey, product.id);
      else sessionStorage.removeItem(productKey);
    } catch {
      // The current tab can still retain the selection in memory.
    }
  }

  function render(
    location: Parameters<StockLookupNavigation["render"]>[0],
    contextProduct?: string,
    ledger: Balances = initialBalances,
    products: readonly LookupProduct[] = lookupProducts,
  ) {
    return (
      <LookupVisit
        key={contextProduct ?? "ordinary"}
        productId={contextProduct ?? rememberedProduct ?? undefined}
        products={products}
        remember={remember}
        location={location}
        read={async (pair) => {
          const attempt = ++sequence.current;
          setRequested(attempt);
          const { delay, outcome } = fixtureRead(
            fixture,
            pair,
            attempt,
            ledger,
          );
          await new Promise<void>((resolve) => setTimeout(resolve, delay));
          setSettled((count) => count + 1);
          return outcome;
        }}
      />
    );
  }

  const stockLookup = { scope: "stock-lookup:demo-merchant", entry, render };
  return (
    <div
      data-stock-lookup-workspace
      data-stock-lookup-request-count={requested}
      data-stock-lookup-settled-count={settled}
    >
      {fixture === "from-product" ? (
        <ProductsTablePreview
          initialStock={false}
          initialDensity="compact"
          hiddenColumns={false}
          locationCount="several"
          archivedFixture={false}
          stockLookup={{
            ...stockLookup,
            render: (location, productId, records) =>
              render(location, productId, initialBalances, [
                ...lookupProducts,
                ...records.map(({ id, name, sku }) => ({
                  id,
                  name,
                  reference: sku ?? undefined,
                })),
              ]),
          }}
          stockShortcut={{
            label,
            open: ({ id }) => setEntry({ productId: id }),
          }}
        />
      ) : fixture === "from-receipt" || fixture === "denied-receipt" ? (
        <StockReceiptPreview
          fixture={fixture === "denied-receipt" ? "read-denied" : "movements"}
          stockLookup={{
            ...stockLookup,
            label,
            open: setEntry,
            initialBalances,
          }}
        />
      ) : (
        <NavigationPrototype
          initialPage="stock"
          permissionMode="ready"
          locationCount={fixture === "single-location" ? "one" : "several"}
          stockLookup={{
            ...stockLookup,
            render: (location, productId) => render(location, productId),
          }}
        />
      )}
    </div>
  );
}
