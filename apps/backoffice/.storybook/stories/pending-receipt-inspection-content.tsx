"use client";

import { useLocale } from "next-intl";
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  pendingDepartureInspectionMessages,
  pendingDepartureInspectionReason,
} from "./pending-departure-inspection-messages";
import {
  pendingInspectionMessages,
  pendingInspectionReason,
} from "./pending-receipt-inspection-messages";
import {
  usePendingReceiptInspection,
  type InspectionOutcome,
  type InspectionRead,
} from "./pending-receipt-inspection-model";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnit, type CreationUnitId } from "./products-creation-model";
import { receiptMessages } from "./stock-receipt-messages";

type PendingReceiptInspectionContentProps = {
  lineReference: string;
  read: InspectionRead;
  kind?: "receipt" | "departure";
  onBack: () => void;
  backLabel?: string;
  locationLabels?: Record<string, string>;
  onOutcome?: (outcome: InspectionOutcome) => void;
  pendingAction?: ReactNode;
};

export function PendingReceiptInspectionContent({
  lineReference,
  read,
  kind = "receipt",
  onBack,
  backLabel,
  locationLabels,
  onOutcome,
  pendingAction,
}: PendingReceiptInspectionContentProps) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const departure =
    kind === "departure" ? pendingDepartureInspectionMessages(locale) : null;
  const copy = departure ?? pendingInspectionMessages(locale);
  const reasonCopy = departure
    ? pendingDepartureInspectionReason
    : pendingInspectionReason;
  const { state, refresh } = usePendingReceiptInspection(lineReference, read);
  const titleId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const reportOutcome = useEffectEvent((outcome: InspectionOutcome) => {
    onOutcome?.(outcome);
  });

  useEffect(() => {
    heading.current?.focus();
  }, []);
  useEffect(() => {
    if (state.kind !== "loading") reportOutcome(state);
  }, [state]);

  const unitSymbol = (unit: CreationUnitId) =>
    unit === "piece" ? copy.pieceSymbol : (creationUnit(unit)?.symbol ?? unit);
  const formatQuantity = (quantity: string) =>
    formatCreationStep(quantity.replace(",", "."), locale);
  const requestFreshRead = () => {
    heading.current?.focus({ preventScroll: true });
    refresh();
  };

  const detail = state.kind === "found" ? state.detail : null;
  const result = detail?.outcome;
  const defaultLabels = receiptMessages[locale].locationLabels;
  const location = detail?.location;
  const locationName =
    location == null
      ? location
      : (locationLabels?.[location] ??
        (location === "sales-floor"
          ? defaultLabels.salesFloor
          : location === "stockroom"
            ? defaultLabels.stockroom
            : location));
  const feedback =
    state.kind === "found" ? copy[state.detail.outcome.kind] : copy[state.kind];
  const facts = detail && [
    { key: "product", label: copy.product, value: detail.product },
    { key: "location", label: copy.location, value: locationName },
    {
      key: "quantity",
      label: copy.savedQuantity,
      value: detail.quantity === null ? null : formatQuantity(detail.quantity),
    },
    {
      key: "unit",
      label: copy.unit,
      value: detail.unit === null ? null : unitSymbol(detail.unit),
    },
    ...(departure
      ? [
          {
            key: "channel",
            label: departure.channel,
            value: detail.channel ?? null,
          },
        ]
      : []),
  ];

  return (
    <section
      data-pending-inspection-content
      data-pending-inspection-state={result?.kind ?? state.kind}
      aria-labelledby={titleId}
      className="min-w-0 space-y-4 text-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id={titleId}
          ref={heading}
          tabIndex={-1}
          data-pending-inspection-heading
          className="text-base font-semibold text-gray-800 outline-none dark:text-white/90"
        >
          {copy.title}
        </h3>
        {detail && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="max-sm:min-h-11"
            data-pending-inspection-refresh
            onClick={requestFreshRead}
          >
            {copy.refresh}
          </Button>
        )}
      </div>
      <p
        role="status"
        aria-atomic="true"
        className={
          detail
            ? "font-semibold text-gray-800 dark:text-white/90"
            : "text-gray-600 dark:text-gray-300"
        }
      >
        {feedback}
      </p>
      {facts && (
        <dl
          data-pending-inspection-facts
          className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
        >
          {facts.map(({ key, label, value }) => (
            <div key={key} className="min-w-0">
              <dt className="text-gray-600 dark:text-gray-400">{label}</dt>
              <dd
                {...{ [`data-pending-inspection-${key}`]: "" }}
                className="font-medium [overflow-wrap:anywhere] whitespace-pre-wrap text-gray-800 tabular-nums dark:text-white/90"
              >
                {value ?? copy.unknown}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {result?.kind === "pending" && result.reasons.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            {copy.reasons}
          </h4>
          <ul
            data-pending-inspection-reasons
            className="list-disc space-y-1 ps-5 text-gray-700 dark:text-gray-300"
          >
            {result.reasons.map((reason, index) => (
              <li key={`${index}:${reason}`}>{reasonCopy(locale, reason)}</li>
            ))}
          </ul>
        </div>
      )}
      {result?.kind === "applied" && (
        <div
          data-pending-inspection-effect
          className="space-y-1 border-t border-gray-200 pt-3 dark:border-gray-800"
        >
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            {copy.appliedQuantity}
          </h4>
          <p className="font-medium [overflow-wrap:anywhere] text-gray-800 tabular-nums dark:text-white/90">
            {formatQuantity(result.effect.quantity)}{" "}
            {unitSymbol(result.effect.unit)}
          </p>
        </div>
      )}
      {result?.kind === "rejected" && result.reason && (
        <p className="text-gray-700 dark:text-gray-300">
          {reasonCopy(locale, result.reason)}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {result?.kind === "pending" && pendingAction}
        <Button
          type="button"
          variant="outline"
          className="max-sm:min-h-11"
          data-pending-inspection-back
          onClick={onBack}
        >
          {backLabel ?? copy.back}
        </Button>
        {state.kind === "error" && (
          <Button
            type="button"
            variant="outline"
            className="max-sm:min-h-11"
            data-pending-inspection-retry
            onClick={requestFreshRead}
          >
            {copy.retry}
          </Button>
        )}
      </div>
    </section>
  );
}
