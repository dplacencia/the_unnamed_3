import { Fragment, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon } from "@/icons";
import type { Locale } from "@/i18n/configuration";
import { cn } from "@/utils";
import {
  pendingBrowsingMessages,
  pendingBrowsingReason,
} from "./pending-movements-browsing-messages";
import type {
  PendingLine,
  PendingPageSize,
  usePendingMovementsBrowsing,
} from "./pending-movements-browsing-model";
import { pendingInspectionMessages } from "./pending-receipt-inspection-messages";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnit } from "./products-creation-model";

type Browsing = ReturnType<typeof usePendingMovementsBrowsing>;
type Copy = ReturnType<typeof pendingBrowsingMessages>;

export function PendingMovementsBrowsingContent({
  locale,
  browsing,
  size,
  onSize,
  locations,
  allLocations,
  initialExpandedReference,
  focusHeading,
  onInspect,
}: {
  locale: Locale;
  browsing: Browsing;
  size: PendingPageSize;
  onSize: (size: PendingPageSize) => void;
  locations: Record<PendingLine["location"], string>;
  allLocations: boolean;
  initialExpandedReference?: string;
  focusHeading: () => void;
  onInspect: (row: PendingLine, button: HTMLButtonElement) => void;
}) {
  const copy = pendingBrowsingMessages(locale);
  const { status, result, previousResults } = browsing;
  const { page, position } = result ?? {};
  const loading = status === "loading";
  const previousLabelId = useId();
  const notice = {
    choose: copy.chooseLocation,
    loading: copy.loading,
    error: copy.error,
    denied: copy.denied,
    rejected: copy.rejectedDestination,
    "empty-continuation": previousResults
      ? copy.emptyDestination
      : copy.emptyCurrent,
    ready: page?.rows.length === 0 ? copy.empty : null,
  }[status];

  return (
    <div className="space-y-2.5">
      {status !== "choose" && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 dark:text-gray-300"
            id={previousLabelId}
          >
            {previousResults && (
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {copy.previousResults}
              </span>
            )}
            {page && <span>{copy.displayed(page.rows.length)}</span>}
            {page?.estimate !== undefined && (
              <span>{copy.estimated(page.estimate)}</span>
            )}
          </div>
          <label className="ms-auto flex items-center gap-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
            <span>{copy.perPage}</span>
            <select
              className="min-h-8 rounded-lg border border-gray-300 bg-white ps-2 text-gray-800 focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-8 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={size}
              disabled={loading}
              onChange={(event) =>
                onSize(Number(event.target.value) as PendingPageSize)
              }
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      )}
      <div
        className={cn(
          notice
            ? "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            : "sr-only",
          status === "denied" &&
            "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-900/10",
        )}
      >
        <p role="status" aria-atomic="true" className="min-w-0">
          {notice ??
            (position !== undefined && page
              ? `${copy.page(position)}. ${copy.displayed(page.rows.length)}`
              : "")}
        </p>
        {status === "error" && (
          <Button
            size="sm"
            variant="outline"
            className="max-sm:min-h-11"
            onClick={() => {
              focusHeading();
              browsing.retry();
            }}
          >
            {copy.retry}
          </Button>
        )}
        {browsing.canRestart && (
          <Button
            size="sm"
            variant="outline"
            className="max-sm:min-h-11"
            onClick={() => {
              focusHeading();
              browsing.restart();
            }}
          >
            {copy.restart}
          </Button>
        )}
      </div>
      {page && page.rows.length > 0 && (
        <PendingRows
          locale={locale}
          copy={copy}
          rows={page.rows}
          locations={locations}
          allLocations={allLocations}
          initialExpandedReference={initialExpandedReference}
          description={previousResults ? previousLabelId : undefined}
          disableInspection={loading}
          onInspect={onInspect}
        />
      )}
      {position !== undefined && (
        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-800 dark:text-gray-200"
          data-pending-browsing-pagination
        >
          <Button
            size="sm"
            variant="outline"
            className="max-sm:min-h-11"
            disabled={!browsing.canPrevious}
            onClick={browsing.previous}
          >
            {copy.previous}
          </Button>
          <span className="text-center font-semibold tabular-nums">
            {copy.page(position)}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="max-sm:min-h-11"
            disabled={!browsing.canNext}
            onClick={browsing.next}
          >
            {copy.next}
          </Button>
        </div>
      )}
    </div>
  );
}

function PendingRows({
  locale,
  copy,
  rows,
  locations,
  allLocations,
  initialExpandedReference,
  description,
  disableInspection,
  onInspect,
}: {
  locale: Locale;
  copy: Copy;
  rows: readonly PendingLine[];
  locations: Record<PendingLine["location"], string>;
  allLocations: boolean;
  initialExpandedReference?: string;
  description?: string;
  disableInspection: boolean;
  onInspect: (row: PendingLine, button: HTMLButtonElement) => void;
}) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set(initialExpandedReference ? [initialExpandedReference] : []),
  );
  const reasonsId = useId();
  const heading =
    "border-b border-gray-200 px-1.5 py-2 text-start font-semibold sm:px-3 dark:border-gray-800";
  function toggle(reference: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (!next.delete(reference)) next.add(reference);
      return next;
    });
  }

  return (
    <div
      className="relative isolate max-h-[min(63vh,42rem)] overflow-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      aria-describedby={description}
    >
      <Table className="text-sm text-gray-800 dark:text-gray-200">
        <caption className="sr-only">{copy.title}</caption>
        <TableHeader className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
          <TableRow>
            <TableCell isHeader scope="col" className={heading}>
              <span className="sr-only">{copy.reasons}</span>
            </TableCell>
            <TableCell isHeader scope="col" className={heading}>
              {copy.type}
            </TableCell>
            <TableCell isHeader scope="col" className={heading}>
              {copy.product}
            </TableCell>
            <TableCell isHeader scope="col" className={heading}>
              {copy.quantity}
            </TableCell>
            {allLocations && (
              <TableCell isHeader scope="col" className={heading}>
                {copy.location}
              </TableCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.map((row) => {
            const product = row.product ?? copy.unknownProduct;
            const isOpen = expanded.has(row.reference);
            const id = `${reasonsId}-${row.reference}`;
            const unit =
              row.unit === null
                ? copy.unknownUnit
                : row.unit === "piece"
                  ? pendingInspectionMessages(locale).pieceSymbol
                  : (creationUnit(row.unit)?.symbol ?? row.unit);
            const quantity =
              row.quantity === null
                ? copy.unknownQuantity
                : formatCreationStep(row.quantity, locale);
            const cell = "px-1.5 py-1 sm:px-3";
            return (
              <Fragment key={row.reference}>
                <TableRow className="align-middle hover:bg-gray-50 dark:hover:bg-white/5">
                  <TableCell className="w-11 text-center sm:w-12">
                    {row.reasons.length > 0 && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="max-sm:min-h-11 max-sm:min-w-11"
                        aria-label={
                          isOpen
                            ? copy.hideReasons(product)
                            : copy.showReasons(product)
                        }
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? id : undefined}
                        onClick={() => toggle(row.reference)}
                      >
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={cn("size-4", !isOpen && "-rotate-90")}
                        />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className={cell}>
                    {row.kind === "receipt" ? copy.receipt : copy.departure}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cell,
                      "w-[45%] min-w-24 font-medium [overflow-wrap:anywhere]",
                    )}
                  >
                    {row.kind === "receipt" ? (
                      <Button
                        variant="link"
                        className="max-w-full rounded-sm text-start font-semibold [overflow-wrap:anywhere] whitespace-normal text-brand-600 underline decoration-brand-200 underline-offset-2 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:text-gray-500 max-sm:min-h-11 dark:text-brand-300 dark:decoration-brand-700 dark:disabled:text-gray-400"
                        disabled={disableInspection}
                        aria-label={copy.inspect(product)}
                        data-pending-browsing-inspect={row.reference}
                        onClick={(event) => onInspect(row, event.currentTarget)}
                      >
                        {product}
                      </Button>
                    ) : (
                      product
                    )}
                  </TableCell>
                  <TableCell className={cn(cell, "tabular-nums")}>
                    <span className="sm:whitespace-nowrap">
                      {quantity} {unit}
                    </span>
                  </TableCell>
                  {allLocations && (
                    <TableCell className={cell}>
                      {locations[row.location]}
                    </TableCell>
                  )}
                </TableRow>
                {isOpen && (
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableCell
                      colSpan={allLocations ? 5 : 4}
                      className="py-2 ps-11 pe-3 sm:ps-12"
                    >
                      <div id={id} className="space-y-1">
                        <p className="font-semibold">{copy.recordedReasons}</p>
                        <ul className="list-disc ps-4 text-gray-700 dark:text-gray-300">
                          {row.reasons.map((reason) => (
                            <li key={reason}>
                              {pendingBrowsingReason(locale, reason)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
