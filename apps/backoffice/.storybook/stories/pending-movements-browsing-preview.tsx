"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { pendingDepartureInspectionMessages } from "./pending-departure-inspection-messages";
import { PendingMovementsBrowsingContent } from "./pending-movements-browsing-content";
import { pendingBrowsingMessages } from "./pending-movements-browsing-messages";
import {
  usePendingMovementsBrowsing,
  type PendingLine,
  type PendingPageSize,
  type PendingRead,
  type PendingReadInput,
  type PendingReadOutcome,
  type PendingScope,
} from "./pending-movements-browsing-model";
import {
  pendingFixtureRows,
  readPendingFixturePage,
} from "./pending-movements-browsing-model-fixtures";
import { PendingReceiptInspectionContent } from "./pending-receipt-inspection-content";
import type {
  InspectionDetail,
  InspectionOutcome,
  InspectionRead,
} from "./pending-receipt-inspection-model";
import { StockReceiptPreview } from "./stock-receipt-preview";

export const pendingBrowsingFixtures = [
  "standard",
  "single-location",
  "late-scope",
  "no-estimate",
  "technical-failure",
  "rejected-continuation",
  "empty-continuation",
  "access-denied",
  "refresh-error",
  "refresh-changed",
  "refresh-unavailable",
  "refresh-empty",
  "departure-applied",
  "departure-rejected",
  "departure-loading",
  "departure-unavailable",
  "departure-error",
  "departure-late-read",
] as const;
type Fixture = (typeof pendingBrowsingFixtures)[number];
const departurePresets = {
  "departure-pending": "pending",
  "departure-applied": "applied",
  "departure-rejected": "rejected",
  "departure-loading": "loading",
  "departure-unavailable": "unavailable",
  "departure-read-error": "error",
} as const;
type Preset =
  | "movements-entry"
  | "choose-location"
  | "initial-loading"
  | "one-location"
  | "all-locations"
  | "second-page"
  | "previous-results-loading"
  | "technical-failure"
  | "rejected-continuation"
  | "empty-continuation"
  | "empty-first-page"
  | "access-denied"
  | "receipt-inspection"
  | "empty-after-inspection"
  | keyof typeof departurePresets;

const sizeKey = "irin-pending-movements-preview:demo-merchant:page-size";

function restoreSize(): PendingPageSize {
  try {
    const entry = window.parent.performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type === "reload") {
      const size = Number(sessionStorage.getItem(sizeKey));
      if (size === 25 || size === 100) return size;
    } else {
      sessionStorage.removeItem(sizeKey);
    }
  } catch {
    // Keep the current tab choice in memory if the browser denies storage.
  }
  return 50;
}

function initialLocation(preset: Preset): PendingScope | undefined {
  if (preset === "movements-entry" || preset === "choose-location")
    return undefined;
  return preset === "one-location" ? "stockroom" : "all";
}

const presetsWithPaging: Partial<Record<Preset, number>> = {
  "second-page": 2,
  "previous-results-loading": 2,
  "technical-failure": 2,
  "access-denied": 2,
  "rejected-continuation": 3,
  "empty-continuation": 3,
  "empty-after-inspection": 2,
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

const confirmedDepartureEffects: Partial<
  Record<
    string,
    Extract<InspectionDetail["outcome"], { kind: "applied" }>["effect"]
  >
> = {
  "pending-line-002": { quantity: "-2.5", unit: "kg" },
  "pending-line-054": { quantity: "-4.725", unit: "kg" },
};

function fixtureDetail(row: PendingLine, fixture: Fixture): InspectionDetail {
  const facts = {
    product: row.product,
    location: row.location,
    quantity: row.quantity,
    unit: row.unit,
  };
  if (row.kind === "departure") {
    const effect =
      fixture === "departure-applied"
        ? confirmedDepartureEffects[row.reference]
        : undefined;
    return {
      ...facts,
      channel: effect ? "Mostrador" : row.channel,
      outcome: effect
        ? { kind: "applied", effect }
        : fixture === "departure-rejected"
          ? { kind: "rejected", reason: "duplicate-batch-cancelled" }
          : { kind: "pending", reasons: row.reasons },
    };
  }

  const resolved = [
    "refresh-changed",
    "refresh-empty",
    "refresh-error",
  ].includes(fixture);
  return {
    ...facts,
    outcome: resolved
      ? row.quantity !== null && row.unit !== null
        ? {
            kind: "applied",
            effect: { quantity: row.quantity, unit: row.unit },
          }
        : { kind: "rejected", reason: "duplicate-entry" }
      : { kind: "pending", reasons: row.reasons },
  };
}

export function PendingMovementsBrowsingPreview({
  fixture,
  preset,
}: {
  fixture: Fixture;
  preset: Preset;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const copy = pendingBrowsingMessages(locale);
  const t = useTranslations("catalogue");
  const [size, setSize] = useState(() =>
    preset === "movements-entry" ? restoreSize() : 50,
  );
  const requests = useRef(0);
  const [trace, setTrace] = useState({
    requested: 0,
    settled: 0,
    scope: "",
    reference: "",
    inspectionReadCount: 0,
    inspectionSettledCount: 0,
  });
  const nextTokens = useRef(new Map<string, number>());
  const previousTokens = useRef(new Map<string, number>());
  const faultInjected = useRef(false);
  const resolvedLines = useRef(new Set<string>());
  const departureReads = useRef(0);
  const inspectionAttempts = useRef(new Map<string, number>());
  const pendingRefresh = useRef<PendingReadInput>(null);

  function chooseSize(next: PendingPageSize) {
    setSize(next);
    if (preset === "movements-entry") {
      try {
        sessionStorage.setItem(sizeKey, String(next));
      } catch {
        // The selected size stays available in memory for this tab.
      }
    }
  }

  const read: PendingRead = async (input) => {
    const sequence = ++requests.current;
    const refreshing = pendingRefresh.current === input;
    setTrace((current) => ({
      ...current,
      requested: sequence,
      scope: input.scope,
    }));
    const position = input.token
      ? (nextTokens.current.get(input.token) ??
        previousTokens.current.get(input.token))
      : 1;
    if (
      preset === "initial-loading" ||
      (preset === "previous-results-loading" && input.token)
    ) {
      // Keep loading scenarios available for visual inspection.
      return new Promise<PendingReadOutcome>(() => {});
    }
    await wait(
      fixture === "late-scope" && input.scope === "all" && position === 2
        ? 1900
        : 225,
    );
    let outcome = readPendingFixturePage(input, {
      exclude: resolvedLines.current,
      showEstimate: fixture !== "no-estimate",
      authorizedLocations:
        fixture === "single-location" ? ["sales-floor"] : undefined,
    });
    if (preset === "empty-first-page") {
      outcome = { kind: "success", page: { rows: [] } };
    } else if (refreshing) {
      if (fixture === "refresh-error" && !faultInjected.current) {
        faultInjected.current = true;
        outcome = { kind: "error" };
      } else {
        pendingRefresh.current = null;
        if (fixture === "refresh-empty" && input.token) {
          outcome = { kind: "success", page: { rows: [] } };
        }
      }
    } else if (input.token && !faultInjected.current) {
      if (fixture === "technical-failure") {
        faultInjected.current = true;
        outcome = { kind: "error" };
      } else if (fixture === "access-denied") {
        faultInjected.current = true;
        outcome = { kind: "denied" };
      } else if (position === 3 && fixture === "rejected-continuation") {
        faultInjected.current = true;
        outcome = { kind: "rejected" };
      } else if (position === 3 && fixture === "empty-continuation") {
        faultInjected.current = true;
        outcome = {
          kind: "success",
          page: {
            rows: [],
            estimate:
              outcome.kind === "success" ? outcome.page.estimate : undefined,
          },
        };
      }
    }
    if (outcome.kind === "success" && position !== undefined) {
      if (outcome.page.next)
        nextTokens.current.set(outcome.page.next, position + 1);
      if (outcome.page.previous)
        previousTokens.current.set(outcome.page.previous, position - 1);
    }
    setTrace((current) => ({ ...current, settled: current.settled + 1 }));
    return outcome;
  };

  const inspect: InspectionRead = async (reference) => {
    const row = pendingFixtureRows.find((line) => line.reference === reference);
    const departure = row?.kind === "departure";
    const firstDepartureRead = departure && ++departureReads.current === 1;
    const attempt = (inspectionAttempts.current.get(reference) ?? 0) + 1;
    inspectionAttempts.current.set(reference, attempt);
    setTrace((current) => ({
      ...current,
      reference,
      inspectionReadCount: current.inspectionReadCount + 1,
    }));
    if (departure && fixture === "departure-loading") {
      return new Promise<InspectionOutcome>(() => {});
    }
    await wait(
      fixture === "departure-late-read" && firstDepartureRead ? 1600 : 300,
    );
    setTrace((current) => ({
      ...current,
      inspectionSettledCount: current.inspectionSettledCount + 1,
    }));
    if (
      !row ||
      fixture === (departure ? "departure-unavailable" : "refresh-unavailable")
    )
      return { kind: "unavailable" };
    if (departure && fixture === "departure-error" && attempt === 1)
      return { kind: "error" };
    const detail = fixtureDetail(row, fixture);
    if (detail.outcome.kind !== "pending") resolvedLines.current.add(reference);
    return { kind: "found", detail };
  };

  return (
    <div
      data-pending-browsing-workspace
      data-pending-browsing-request-count={trace.requested}
      data-pending-browsing-settled-count={trace.settled}
      data-pending-browsing-last-scope={trace.scope}
      data-pending-browsing-last-reference={trace.reference}
      data-pending-browsing-inspection-read-count={trace.inspectionReadCount}
      data-pending-browsing-inspection-settled-count={
        trace.inspectionSettledCount
      }
    >
      <StockReceiptPreview
        fixture="movements"
        movementsBrowsing={{
          allLocationsLabel: copy.allLocations,
          initialLocation: initialLocation(preset),
          locationCount: fixture === "single-location" ? "one" : "several",
          render: (location, receiptAction, receiptSummary) => (
            <MovementsVisit
              locale={locale}
              preset={preset}
              location={location}
              locations={{
                "sales-floor": t("navSalesFloor"),
                stockroom: t("navStockroom"),
              }}
              size={size}
              onSize={chooseSize}
              read={read}
              inspect={inspect}
              markRefresh={(input) => {
                pendingRefresh.current = input;
              }}
              receiptAction={receiptAction}
              receiptSummary={receiptSummary}
            />
          ),
        }}
      />
    </div>
  );
}

function MovementsVisit({
  receiptAction,
  receiptSummary,
  ...list
}: PendingListProps & { receiptAction: ReactNode; receiptSummary: ReactNode }) {
  const { preset, locale } = list;
  const copy = pendingBrowsingMessages(locale);
  const [open, setOpen] = useState(() => preset !== "movements-entry");
  return (
    <div
      className="space-y-3 text-gray-800 dark:text-gray-100"
      data-pending-browsing-ready={
        preset === "movements-entry" && !open ? preset : undefined
      }
    >
      <div className="flex flex-wrap gap-2">
        {receiptAction}
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-pressed={open}
          className="max-sm:min-h-11"
          onClick={() => setOpen((value) => !value)}
        >
          {copy.open}
        </Button>
      </div>
      {receiptSummary}
      {open && <PendingList {...list} />}
    </div>
  );
}

type PendingListProps = {
  locale: Locale;
  preset: Preset;
  location: { id: string; label: string } | null;
  locations: Record<PendingLine["location"], string>;
  size: PendingPageSize;
  onSize: (value: PendingPageSize) => void;
  read: PendingRead;
  inspect: InspectionRead;
  markRefresh: (input: PendingReadInput) => void;
};

function PendingList({
  locale,
  preset,
  location,
  locations,
  size,
  onSize,
  read,
  inspect,
  markRefresh,
}: PendingListProps) {
  const copy = pendingBrowsingMessages(locale);
  const scope =
    location?.id === "all" ||
    location?.id === "stockroom" ||
    location?.id === "sales-floor"
      ? location.id
      : null;
  const browsing = usePendingMovementsBrowsing({ scope, size, read });
  const titleId = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [row, setRow] = useState<PendingLine | null>(null);
  const [outcome, setOutcome] = useState<InspectionOutcome | null>(null);
  const presetAttempted = useRef(0);
  const presetInspected = useRef(false);
  const { status, result, previousResults } = browsing;
  const position = result?.position;
  const departurePreset =
    departurePresets[preset as keyof typeof departurePresets];
  const inspectionKind = departurePreset
    ? "departure"
    : preset === "receipt-inspection" || preset === "empty-after-inspection"
      ? "receipt"
      : null;

  function closeInspection() {
    const needsRefresh =
      outcome?.kind === "unavailable" ||
      (outcome?.kind === "found" && outcome.detail.outcome.kind !== "pending");
    setRow(null);
    setOutcome(null);
    if (needsRefresh && result) {
      trigger.current = null;
      markRefresh(result.input);
      browsing.refresh();
    }
  }

  const runPreset = useEffectEvent(() => {
    const target = presetsWithPaging[preset] ?? 1;
    if (
      position &&
      status === "ready" &&
      position < target &&
      position > presetAttempted.current &&
      browsing.canNext
    ) {
      presetAttempted.current = position;
      browsing.next();
      return;
    }
    if (
      inspectionKind &&
      position === target &&
      status === "ready" &&
      !presetInspected.current
    ) {
      const line = result?.page.rows.find(
        (line) => line.kind === inspectionKind,
      );
      if (line) {
        presetInspected.current = true;
        setRow(line);
      }
    }
    if (
      preset === "empty-after-inspection" &&
      row &&
      outcome?.kind === "found"
    ) {
      closeInspection();
    }
  });
  useEffect(() => {
    if (preset === "movements-entry") return;
    const frame = requestAnimationFrame(() => runPreset());
    return () => cancelAnimationFrame(frame);
  }, [preset, status, position, row, outcome]);

  const ready = (() => {
    if (departurePreset) {
      const current =
        outcome?.kind === "found"
          ? outcome.detail.outcome.kind
          : (outcome?.kind ?? "loading");
      return row?.kind === "departure" && current === departurePreset;
    }
    switch (preset) {
      case "choose-location":
        return status === "choose";
      case "initial-loading":
        return status === "loading" && !result;
      case "one-location":
      case "all-locations":
        return status === "ready" && !!result?.page.rows.length;
      case "second-page":
        return status === "ready" && position === 2;
      case "previous-results-loading":
        return status === "loading" && previousResults;
      case "technical-failure":
        return status === "error" && previousResults;
      case "rejected-continuation":
        return status === "rejected";
      case "empty-continuation":
        return status === "empty-continuation" && previousResults;
      case "empty-first-page":
        return status === "ready" && result?.page.rows.length === 0;
      case "access-denied":
        return status === "denied";
      case "receipt-inspection":
        return !!row && outcome?.kind === "found";
      case "empty-after-inspection":
        return status === "empty-continuation" && !previousResults;
      default:
        return false;
    }
  })();

  return (
    <section
      aria-labelledby={titleId}
      className="min-w-0 space-y-2.5"
      data-pending-browsing-state={status}
      data-pending-browsing-ready={ready ? preset : undefined}
      data-pending-browsing-scope={scope ?? undefined}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h2
          id={titleId}
          ref={title}
          tabIndex={-1}
          className="text-lg font-semibold outline-none"
        >
          {copy.title}
        </h2>
        {location && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {location.label}
          </span>
        )}
      </div>
      <PendingMovementsBrowsingContent
        key={scope ?? "choose"}
        locale={locale}
        browsing={browsing}
        size={size}
        onSize={onSize}
        locations={locations}
        allLocations={scope === "all"}
        focusHeading={() => title.current?.focus({ preventScroll: true })}
        initialExpandedReference={
          preset === "all-locations" ? "pending-line-002" : undefined
        }
        onInspect={(line, button) => {
          trigger.current = button;
          setRow(line);
        }}
      />
      <Sheet
        open={!!row}
        onOpenChange={(open) => {
          if (!open) closeInspection();
        }}
      >
        <SheetContent
          className="products-detail-panel"
          closeLabel={copy.close}
          finalFocus={() =>
            trigger.current?.isConnected
              ? trigger.current
              : (title.current ?? false)
          }
          data-pending-browsing-inspector
        >
          <SheetHeader className="pe-10">
            <SheetTitle>
              {row?.kind === "departure"
                ? pendingDepartureInspectionMessages(locale).heading
                : copy.inspectionTitle}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {copy.title}
            </SheetDescription>
          </SheetHeader>
          {row && (
            <PendingReceiptInspectionContent
              lineReference={row.reference}
              kind={row.kind}
              read={inspect}
              onOutcome={setOutcome}
              locationLabels={locations}
              backLabel={copy.back}
              onBack={closeInspection}
            />
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
