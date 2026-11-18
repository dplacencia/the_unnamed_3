"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnits } from "./products-creation-model";
import { lookupMessages } from "./stock-lookup-messages";
import {
  useStockLookup,
  type StockBalance,
  type StockOutcome,
  type StockPair,
} from "./stock-lookup-model";

export type LookupProduct = {
  id: string;
  name: string;
  reference?: string;
};

type StockLookupContentProps = {
  products: readonly LookupProduct[];
  product: LookupProduct | null;
  onProductChange: (product: LookupProduct | null) => void;
  location: { id: string; label: string } | null;
  read: (pair: StockPair) => Promise<StockOutcome>;
};

export function StockLookupContent({
  products,
  product,
  onProductChange,
  location,
  read,
}: StockLookupContentProps) {
  const t = useTranslations("catalogue");
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const copy = lookupMessages(locale);
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const pair =
    product && location
      ? { productId: product.id, locationId: location.id }
      : null;
  const { status, outcome, previous, refresh } = useStockLookup(pair, read);
  const denied = outcome?.kind === "denied" ? outcome : null;
  const visibleProduct = denied?.hideProduct ? null : product;
  const visibleLocation = denied?.hideLocation ? null : location;
  const visibleChoices = denied?.hideProduct
    ? products.filter(({ id }) => id !== product?.id)
    : products;

  const names = new Set<string>();
  const duplicateNames = new Set<string>();
  for (const { name } of products) {
    if (names.has(name)) duplicateNames.add(name);
    names.add(name);
  }
  const productReference = (choice: LookupProduct) =>
    choice.reference || `${copy.productId} ${choice.id}`;
  const disambiguate =
    visibleProduct && duplicateNames.has(visibleProduct.name);
  const result = outcome?.kind ?? status;
  const balance = outcome?.kind === "balance" ? outcome.balance : null;
  const canRefresh = result === "balance" || result === "no-record";
  const canRetry = result === "error";
  const feedback = {
    idle: product
      ? copy.pickLocation
      : location
        ? copy.pickProduct
        : copy.pickPair,
    loading: copy.loading,
    result: null,
    balance: null,
    "no-record": copy.noRecord,
    denied: copy.denied,
    invalid: copy.invalid,
    error: copy.error,
  }[result];

  const formatBalance = ({ amount, unit }: StockBalance) => {
    const measurement = creationUnits.find(
      ({ id, baseUnit }) => id === unit || baseUnit === unit,
    );
    const symbol =
      measurement?.id === "piece"
        ? copy.pieceSymbol
        : (measurement?.symbol ?? unit);
    return `${formatCreationStep(amount, locale)} ${symbol}`;
  };

  return (
    <div data-stock-lookup-content className="max-w-2xl space-y-4">
      <Field controlId={`${id}-product`} className="max-w-md">
        <FieldLabel>{copy.product}</FieldLabel>
        <Combobox<LookupProduct>
          items={visibleChoices}
          value={visibleProduct}
          inputValue={query ?? visibleProduct?.name ?? ""}
          itemToStringLabel={(choice) => choice.name}
          itemToStringValue={(choice) => choice.id}
          isItemEqualToValue={(choice, selected) => choice.id === selected.id}
          open={searchOpen}
          onOpenChange={(open) => {
            setSearchOpen(open);
            if (!open) setQuery(null);
          }}
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setQuery(value);
          }}
          onValueChange={(choice, details) => {
            details.cancel();
            if (!choice) return;
            setQuery(null);
            setSearchOpen(false);
            onProductChange(choice);
          }}
        >
          <ComboboxInput
            id={`${id}-product`}
            data-stock-lookup-product
            aria-describedby={
              disambiguate ? `${id}-product-reference` : undefined
            }
            placeholder={copy.searchProduct}
          />
          <ComboboxContent className="min-w-0">
            <ComboboxEmpty>{copy.noProducts}</ComboboxEmpty>
            <ComboboxList>
              {(choice: LookupProduct) => (
                <ComboboxItem
                  key={choice.id}
                  value={choice}
                  data-stock-lookup-product-option={choice.id}
                  className="min-h-11 [&>span:first-child]:min-w-0 [&>span:first-child]:shrink [&>span:first-child]:whitespace-normal"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere] whitespace-pre-wrap">
                    {choice.name}
                    {duplicateNames.has(choice.name) && (
                      <span className="block text-xs font-normal text-gray-600 dark:text-gray-400">
                        {productReference(choice)}
                      </span>
                    )}
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <section
        aria-labelledby={`${id}-recorded`}
        data-stock-lookup-result={result}
        className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            ref={heading}
            id={`${id}-recorded`}
            tabIndex={-1}
            className="text-base font-semibold text-gray-800 outline-none dark:text-white/90"
          >
            {copy.recorded}
          </h2>
          {(canRefresh || canRetry) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11 md:min-h-0"
              data-stock-lookup-refresh={canRefresh ? "" : undefined}
              data-stock-lookup-retry={canRetry ? "" : undefined}
              onClick={() => {
                heading.current?.focus();
                refresh();
              }}
            >
              {canRetry ? copy.retry : copy.refresh}
            </Button>
          )}
        </div>
        {(visibleProduct || visibleLocation) && (
          <dl className="grid grid-cols-2 gap-3 border-b border-gray-200 pb-3 text-gray-600 dark:border-gray-800 dark:text-gray-400">
            {visibleProduct && (
              <div className="min-w-0">
                <dt>{copy.product}</dt>
                <dd
                  data-stock-lookup-selected-product={visibleProduct.id}
                  className="font-medium [overflow-wrap:anywhere] whitespace-pre-wrap text-gray-800 dark:text-white/90"
                >
                  {visibleProduct.name}
                  {disambiguate && (
                    <span
                      className="block text-xs font-normal text-gray-600 dark:text-gray-400"
                      id={`${id}-product-reference`}
                    >
                      {productReference(visibleProduct)}
                    </span>
                  )}
                </dd>
              </div>
            )}
            {visibleLocation && (
              <div className="min-w-0">
                <dt>{t("navLocation")}</dt>
                <dd
                  data-stock-lookup-selected-location={visibleLocation.id}
                  className="font-medium [overflow-wrap:anywhere] text-gray-800 dark:text-white/90"
                >
                  {visibleLocation.label}
                </dd>
              </div>
            )}
          </dl>
        )}
        <div role="status" aria-atomic="true" className="space-y-2">
          {balance && (
            <p
              data-stock-lookup-amount
              className="text-2xl font-semibold break-all text-gray-900 tabular-nums dark:text-white/90"
            >
              {formatBalance(balance)}
            </p>
          )}
          {previous && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>{copy.previous}</p>
              <p
                data-stock-lookup-previous-amount
                className="text-lg font-semibold break-all tabular-nums"
              >
                {formatBalance(previous)}
              </p>
            </div>
          )}
          {feedback && (
            <p className="text-gray-600 dark:text-gray-300">{feedback}</p>
          )}
        </div>
      </section>
    </div>
  );
}
