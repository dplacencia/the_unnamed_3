"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { availabilityMessages } from "./channel-availability-messages";
import {
  NavigationPrototype,
  type StockLookupNavigation,
} from "./navigation-prototype";
import { formatCreationStep } from "./products-creation-messages";

export type AvailabilityPreset =
  "lookup" | "available" | "zero" | "unavailable" | "read-failure";
type Read =
  | { kind: "available"; amount: string; unit: string }
  | { kind: "unavailable" | "failure" | "loading" };
type Location = Parameters<StockLookupNavigation["render"]>[0];

const products = [
  { id: "tomato", name: "Tomate pera", sku: "TOM-001" },
  { id: "tomato-bulk", name: "Tomate pera", sku: "TOM-002" },
];
const channels = {
  "sales-floor": [
    { id: "counter", name: "Mostrador" },
    { id: "web", name: "Tienda en línea" },
  ],
  stockroom: [{ id: "delivery", name: "Reparto" }],
} as const;
const exactReads: Readonly<Record<string, Read>> = {
  "sales-floor:tomato:counter": {
    kind: "available",
    amount: "5.125",
    unit: "kg",
  },
  "sales-floor:tomato:web": { kind: "available", amount: "0", unit: "kg" },
  "stockroom:tomato:delivery": {
    kind: "available",
    amount: "12.2",
    unit: "kg",
  },
};
const field =
  "min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

function AvailabilityLookup({
  preset,
  locale,
  location,
}: {
  preset: AvailabilityPreset;
  locale: Locale;
  location: Location;
}) {
  const copy = availabilityMessages[locale];
  const seeded = location?.id === "sales-floor" && preset !== "lookup";
  const initialProduct = preset === "unavailable" ? "tomato-bulk" : "tomato";
  const initialChannel = preset === "zero" ? "web" : "counter";
  const [productId, setProductId] = useState(seeded ? initialProduct : "");
  const [channelId, setChannelId] = useState(seeded ? initialChannel : "");
  const [read, setRead] = useState<Read | null>(() => {
    if (!seeded) return null;
    if (preset === "read-failure") return { kind: "failure" };
    return (
      exactReads[`sales-floor:${initialProduct}:${initialChannel}`] ?? {
        kind: "unavailable",
      }
    );
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const enabled = location
    ? (channels[location.id as keyof typeof channels] ?? [])
    : [];

  function resetRead() {
    clearTimeout(timer.current);
    setRead(null);
  }

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!location || !productId || !enabled.some(({ id }) => id === channelId))
      return;
    clearTimeout(timer.current);
    setRead({ kind: "loading" });
    const result = exactReads[`${location.id}:${productId}:${channelId}`] ?? {
      kind: "unavailable",
    };
    timer.current = setTimeout(() => setRead(result), 300);
  }

  return (
    <section
      data-channel-availability-ready={preset}
      className="max-w-2xl space-y-3 text-gray-700 dark:text-gray-300"
    >
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
        {copy.title}
      </h2>
      <form onSubmit={check} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block min-w-0 space-y-1 font-medium">
            <span>{copy.product}</span>
            <select
              required
              className={field}
              value={productId}
              onChange={(event) => {
                setProductId(event.target.value);
                resetRead();
              }}
            >
              <option value="">{copy.chooseProduct}</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} · {product.sku}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0 space-y-1 font-medium">
            <span>{copy.channel}</span>
            <select
              required
              className={field}
              value={channelId}
              disabled={!location}
              onChange={(event) => {
                setChannelId(event.target.value);
                resetRead();
              }}
            >
              <option value="">{copy.chooseChannel}</option>
              {enabled.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!location && <p>{copy.chooseLocation}</p>}
        <Button
          type="submit"
          disabled={
            !location || !productId || !channelId || read?.kind === "loading"
          }
        >
          {read?.kind === "failure" ? copy.retry : copy.consult}
        </Button>
      </form>
      {read && (
        <div
          role="status"
          data-channel-availability-outcome={read.kind}
          className="rounded-lg border border-gray-200 p-3 dark:border-gray-800"
        >
          {read.kind === "available" ? (
            <dl>
              <dt className="font-medium">{copy.available}</dt>
              <dd
                className="mt-0.5 text-xl font-semibold text-gray-800 tabular-nums dark:text-gray-100"
                data-channel-availability-amount
              >
                {formatCreationStep(read.amount, locale)} {read.unit}
              </dd>
            </dl>
          ) : (
            <p>
              {read.kind === "loading"
                ? copy.loading
                : read.kind === "failure"
                  ? copy.failed
                  : copy.unavailable}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function ChannelAvailabilityPreview({
  preset,
}: {
  preset: AvailabilityPreset;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  return (
    <NavigationPrototype
      initialPage="stock"
      permissionMode="ready"
      locationCount={preset === "lookup" ? "several" : "one"}
      stockLookup={{
        scope: "channel-availability",
        entry:
          preset === "lookup"
            ? undefined
            : { productId: "tomato", locationId: "sales-floor" },
        render: (location) => (
          <AvailabilityLookup
            key={location?.id ?? "unknown"}
            locale={locale}
            preset={preset}
            location={location}
          />
        ),
      }}
    />
  );
}
