"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { NavigationPrototype } from "./navigation-prototype";
import { PendingMovementsBrowsingContent } from "./pending-movements-browsing-content";
import {
  pendingBrowsingMessages,
  pendingBrowsingReason,
} from "./pending-movements-browsing-messages";
import {
  usePendingMovementsBrowsing,
  type PendingLine,
  type PendingLocation,
  type PendingPageSize,
  type PendingScope,
} from "./pending-movements-browsing-model";
import { PendingReceiptInspectionContent } from "./pending-receipt-inspection-content";
import type { InspectionRead } from "./pending-receipt-inspection-model";
import { pendingInspectionMessages } from "./pending-receipt-inspection-messages";
import { pendingDepartureInspectionMessages } from "./pending-departure-inspection-messages";
import {
  counterpartSelectionFixture,
  duplicateSibling,
  partialReceiptReleaseFixture,
  resolutionFixtures,
} from "./pending-resolution-fixtures";
import { pendingResolutionMessages } from "./pending-resolution-messages";
import {
  createResolutionSimulator,
  prepareResolutionCommand,
  resolutionReasonValid,
  type ResolutionCommand,
  type ResolutionFixture,
  type ResolutionResult,
} from "./pending-resolution-model";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnit } from "./products-creation-model";
import "./products-table-preview.css";

export type ResolutionPreset =
  | "review-release"
  | "review-rejection"
  | "review-duplicate"
  | "review-receipt-release"
  | "select-counterpart"
  | "unconfirmed"
  | "retained-applied"
  | "counterpart-unavailable";

type Attempt = {
  fixture: ResolutionFixture;
  command: ResolutionCommand;
  result: ResolutionResult;
  uncertain: boolean;
};

const lines = Object.values(resolutionFixtures).flatMap((fixture) =>
  fixture.kind === "cancel" ? [fixture.line, duplicateSibling] : [fixture.line],
);
const receiptReleaseLines = [...lines, partialReceiptReleaseFixture.line];

function fixtureFor(preset: ResolutionPreset): ResolutionFixture {
  if (preset === "review-rejection") return resolutionFixtures.rejection;
  if (preset === "review-duplicate") return resolutionFixtures.duplicate;
  if (preset === "review-receipt-release") return partialReceiptReleaseFixture;
  if (preset === "select-counterpart") return counterpartSelectionFixture;
  if (preset === "counterpart-unavailable")
    return resolutionFixtures.counterpartUnavailable;
  return resolutionFixtures.release;
}

function initialSession(preset: ResolutionPreset) {
  const simulator = createResolutionSimulator({
    loseFirstReply: preset === "unconfirmed",
  });
  const fixture = fixtureFor(preset);
  const resolved = new Set<string>();
  let attempt: Attempt | null = null;
  if (preset === "unconfirmed" || preset === "retained-applied") {
    const command = prepareResolutionCommand(fixture, {
      operationId: "demo-release-1",
      channelId: "channel-counter",
      confirmed: true,
    });
    if (command) {
      const result = simulator.attempt(fixture, command, true);
      if (result.kind === "resolved")
        result.references.forEach((ref) => resolved.add(ref));
      attempt = {
        fixture,
        command,
        result,
        uncertain: result.kind === "unconfirmed",
      };
    }
  }
  return { simulator, fixture, resolved, attempt };
}

function actionName(locale: Locale, kind: ResolutionFixture["kind"]) {
  const copy = pendingResolutionMessages[locale];
  if (kind === "release") return copy.releaseTitle;
  if (kind === "receipt-release") return copy.receiptReleaseTitle;
  if (kind === "reject") return copy.rejectTitle;
  return copy.cancelTitle;
}

function quantityWithUnit(
  line: Pick<PendingLine, "quantity" | "unit">,
  locale: Locale,
) {
  const copy = pendingInspectionMessages(locale);
  const quantity =
    line.quantity === null
      ? copy.unknown
      : formatCreationStep(line.quantity, locale);
  const unit =
    line.unit === null
      ? copy.unknown
      : line.unit === "piece"
        ? copy.pieceSymbol
        : (creationUnit(line.unit)?.symbol ?? line.unit);
  return `${quantity} ${unit}`;
}

function AttemptResult({
  locale,
  attempt,
  retry,
  close,
}: {
  locale: Locale;
  attempt: Attempt;
  retry(): void;
  close(): void;
}) {
  const copy = pendingResolutionMessages[locale];
  const { result, uncertain } = attempt;
  const original = result.kind === "resolved" ? result.original : null;
  const release = attempt.command.request.kind === "release";
  let status: string = copy.unconfirmed;
  if (result.kind === "denied")
    status = uncertain ? copy.deniedRetry : copy.denied;
  if (result.kind === "refused")
    status =
      result.reason === "already-resolved"
        ? copy.alreadyResolved
        : copy.refused;
  if (original?.kind === "applied") status = copy.applied;
  if (original?.kind === "rejected") {
    status = release
      ? copy.overflow
      : attempt.fixture.kind === "cancel"
        ? copy.cancelled
        : copy.rejected;
  }

  return (
    <div
      className="space-y-4"
      data-pending-resolution-result={original?.kind ?? result.kind}
    >
      <p
        role="status"
        className="font-semibold text-gray-800 dark:text-gray-100"
      >
        {status}
      </p>
      {original?.kind === "applied" && (
        <dl className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <dt>{copy.effect}</dt>
          <dd
            className="mt-1 font-semibold tabular-nums"
            data-pending-resolution-effect
          >
            {quantityWithUnit(original.effect, locale)}
          </dd>
        </dl>
      )}
      {original?.kind === "rejected" && (
        <div className="space-y-1">
          {release && <p>{copy.overflowReason}</p>}
          <p>{copy.noEffect}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {uncertain && <Button onClick={retry}>{copy.retry}</Button>}
        <Button onClick={close} variant="outline">
          {copy.return}
        </Button>
      </div>
    </div>
  );
}

function ResolutionReview({
  locale,
  fixture,
  locationLabel,
  onSubmit,
  onBack,
}: {
  locale: Locale;
  fixture: ResolutionFixture;
  locationLabel: string;
  onSubmit(command: ResolutionCommand): void;
  onBack(): void;
}) {
  const copy = pendingResolutionMessages[locale];
  const inspection =
    fixture.line.kind === "departure"
      ? pendingDepartureInspectionMessages(locale)
      : pendingInspectionMessages(locale);
  const id = useId();
  const [channelId, setChannelId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [counterpartId, setCounterpartId] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const draft = { channelId, quantity, counterpartId, reason, confirmed };
  const canConfirm =
    prepareResolutionCommand(fixture, { ...draft, operationId: "review" }) !==
    null;
  const invalidReason = reason.length > 0 && !resolutionReasonValid(reason);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = prepareResolutionCommand(fixture, {
      ...draft,
      operationId: crypto.randomUUID(),
    });
    if (command) onSubmit(command);
  }

  return (
    <div className="space-y-4" data-pending-resolution-review={fixture.kind}>
      <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          {copy.current}
        </h3>
        <p className="font-semibold break-words">
          {fixture.line.product ?? inspection.unknown}
        </p>
        <p>
          {locationLabel} · {quantityWithUnit(fixture.line, locale)}
        </p>
        {fixture.line.reasons.map((code) => (
          <p key={code}>{pendingBrowsingReason(locale, code)}</p>
        ))}
      </div>
      {fixture.kind === "counterpart-unavailable" ? (
        <>
          <p role="status">{copy.unavailable}</p>
          <Button onClick={onBack} variant="outline">
            {copy.return}
          </Button>
        </>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          {fixture.kind === "cancel" && (
            <div className="space-y-2">
              <dl className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <div>
                  <dt>{copy.target}</dt>
                  <dd className="font-medium break-all">
                    {fixture.target.callerOperationId}
                  </dd>
                </div>
                <div>
                  <dt>{copy.counterpart}</dt>
                  {fixture.eligibleCounterparts ? (
                    <dd>
                      <select
                        className="min-h-11 w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        aria-label={copy.counterpart}
                        required
                        value={counterpartId}
                        onChange={(event) => {
                          setCounterpartId(event.target.value);
                          setConfirmed(false);
                        }}
                      >
                        <option value="" disabled>
                          {copy.chooseCounterpart}
                        </option>
                        {fixture.eligibleCounterparts.map((candidate) => (
                          <option
                            key={candidate.callerOperationId}
                            value={candidate.callerOperationId}
                          >
                            {candidate.callerOperationId}
                          </option>
                        ))}
                      </select>
                    </dd>
                  ) : (
                    <dd className="font-medium break-all">
                      {fixture.counterpart.callerOperationId}
                    </dd>
                  )}
                </div>
              </dl>
              <p>{copy.batchScope}</p>
              <ul className="list-disc space-y-1 ps-5">
                {[fixture.line, duplicateSibling].map((line) => (
                  <li key={line.reference}>
                    {line.product} · {quantityWithUnit(line, locale)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {fixture.kind === "release" ? (
            <label className="block space-y-1 font-medium">
              <span>{copy.actualChannel}</span>
              <select
                value={channelId}
                onChange={(event) => setChannelId(event.target.value)}
                className="min-h-11 w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                required
              >
                <option value="" disabled>
                  {copy.chooseChannel}
                </option>
                {fixture.channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.label}
                  </option>
                ))}
              </select>
            </label>
          ) : fixture.kind === "receipt-release" ? (
            <label className="block space-y-1 font-medium">
              <span>{copy.actualQuantity}</span>
              <input
                className="min-h-11 w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setConfirmed(false);
                }}
                required
                aria-describedby={id}
              />
              <span id={id} className="block font-normal">
                {copy.quantityHint}
              </span>
            </label>
          ) : (
            <label className="block space-y-1 font-medium">
              <span>{copy.reason}</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                aria-invalid={invalidReason || undefined}
                aria-describedby={invalidReason ? id : undefined}
                className="w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                required
              />
              {invalidReason && (
                <span
                  id={id}
                  className="text-error-600 dark:text-error-400 block"
                >
                  {copy.invalidReason}
                </span>
              )}
            </label>
          )}
          <label className="flex min-h-11 items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>
              {fixture.kind === "release"
                ? copy.reviewRelease
                : fixture.kind === "receipt-release"
                  ? copy.reviewReceiptRelease
                  : fixture.kind === "reject"
                    ? copy.reviewReject
                    : copy.reviewCancel}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!canConfirm}>
              {copy.confirm}
            </Button>
            <Button type="button" onClick={onBack} variant="outline">
              {copy.return}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export function PendingResolutionPreview({
  preset,
  denyRetry = false,
}: {
  preset: ResolutionPreset;
  denyRetry?: boolean;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const t = useTranslations("catalogue");
  const [initial] = useState(() => initialSession(preset));
  const [line, setLine] = useState<PendingLine | null>(initial.fixture.line);
  const [review, setReview] = useState(true);
  const [observed, setObserved] = useState<ReadonlySet<string>>(
    initial.resolved,
  );
  const [attempt, setAttempt] = useState<Attempt | null>(initial.attempt);
  const locations = {
    "sales-floor": t("navSalesFloor"),
    stockroom: t("navStockroom"),
  };

  function dispatch(
    fixture: ResolutionFixture,
    command: ResolutionCommand,
    retry: boolean,
  ) {
    const result = initial.simulator.attempt(
      fixture,
      command,
      !retry || !denyRetry,
    );
    const uncertain =
      result.kind === "unconfirmed" || (result.kind === "denied" && retry);
    setAttempt({ fixture, command, result, uncertain });
    if (result.kind === "resolved") {
      setObserved((previous) => new Set([...previous, ...result.references]));
    }
    return result.kind === "resolved";
  }

  return (
    <div>
      <NavigationPrototype
        initialPage="movements"
        permissionMode="ready"
        locationCount="several"
        movementsBrowsing={{
          allLocationsLabel: pendingBrowsingMessages(locale).allLocations,
          initialLocation: "all",
          render: (location) => (
            <ResolutionWorkspace
              preset={preset}
              locale={locale}
              location={location}
              locations={locations}
              line={line}
              review={review}
              observed={observed}
              attempt={attempt}
              dispatch={dispatch}
              onReview={() => {
                if (!attempt?.uncertain) setAttempt(null);
                setReview(true);
              }}
              onOpen={(selected, showReview) => {
                setLine(selected);
                setReview(showReview);
              }}
            />
          ),
        }}
      />
    </div>
  );
}

function ResolutionWorkspace({
  preset,
  locale,
  location,
  locations,
  line,
  review,
  observed,
  attempt,
  dispatch,
  onReview,
  onOpen,
}: {
  preset: ResolutionPreset;
  locale: Locale;
  location: { id: string; label: string } | null;
  locations: Record<PendingLocation, string>;
  line: PendingLine | null;
  review: boolean;
  observed: ReadonlySet<string>;
  attempt: Attempt | null;
  dispatch(
    fixture: ResolutionFixture,
    command: ResolutionCommand,
    retry: boolean,
  ): boolean;
  onReview(): void;
  onOpen(line: PendingLine | null, review: boolean): void;
}) {
  const copy = pendingResolutionMessages[locale];
  const browsingCopy = pendingBrowsingMessages(locale);
  const heading = useRef<HTMLHeadingElement>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<PendingPageSize>(50);
  const [inspected, setInspected] = useState<string | null>(null);
  const rows =
    preset === "review-receipt-release" ? receiptReleaseLines : lines;
  const scope: PendingScope | null =
    location?.id === "all" ||
    location?.id === "sales-floor" ||
    location?.id === "stockroom"
      ? location.id
      : null;
  const browsing = usePendingMovementsBrowsing({
    scope,
    size,
    read: async (input) => ({
      kind: "success",
      page: {
        rows: rows.filter(
          (row) =>
            !observed.has(row.reference) &&
            (input.scope === "all" || input.scope === row.location),
        ),
      },
    }),
  });
  const storyFixture = fixtureFor(preset);
  const fixture =
    storyFixture.line.reference === line?.reference
      ? storyFixture
      : Object.values(resolutionFixtures).find(
          (candidate) => candidate.line.reference === line?.reference,
        );
  const visibleAttempt =
    review && attempt?.fixture.line.reference === line?.reference
      ? attempt
      : null;
  const close = () => onOpen(null, false);
  const inspect: InspectionRead = async (reference) => {
    const row = rows.find((candidate) => candidate.reference === reference);
    if (
      !row ||
      observed.has(reference) ||
      (scope !== "all" && scope !== row.location)
    )
      return { kind: "unavailable" };
    return {
      kind: "found",
      detail: {
        product: row.product,
        location: row.location,
        quantity: row.quantity,
        unit: row.unit,
        ...(row.kind === "departure" ? { channel: row.channel } : {}),
        outcome: { kind: "pending", reasons: row.reasons },
      },
    };
  };

  function submit(
    current: ResolutionFixture,
    command: ResolutionCommand,
    retry: boolean,
  ) {
    panelTitle.current?.focus();
    if (dispatch(current, command, retry)) {
      trigger.current = null;
      browsing.refresh();
    }
  }

  const inspection =
    line?.kind === "departure"
      ? pendingDepartureInspectionMessages(locale).heading
      : browsingCopy.inspectionTitle;

  return (
    <section className="min-w-0 space-y-4">
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-lg font-semibold outline-none"
      >
        {browsingCopy.title}
      </h2>
      {attempt?.uncertain && (
        <Button
          variant="outline"
          onClick={() => onOpen(attempt.fixture.line, true)}
        >
          {copy.resume}
        </Button>
      )}
      <PendingMovementsBrowsingContent
        locale={locale}
        browsing={browsing}
        size={size}
        onSize={setSize}
        locations={locations}
        allLocations={scope === "all"}
        focusHeading={() => heading.current?.focus({ preventScroll: true })}
        onInspect={(selected, button) => {
          setInspected(null);
          trigger.current = button;
          onOpen(selected, false);
        }}
      />
      <Sheet
        open={line !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <SheetContent
          data-pending-resolution-ready={
            browsing.status === "ready" ? preset : undefined
          }
          className="products-detail-panel"
          closeLabel={copy.close}
          finalFocus={() =>
            trigger.current?.isConnected
              ? trigger.current
              : (heading.current ?? false)
          }
        >
          <SheetHeader className="pe-10">
            <SheetTitle ref={panelTitle} tabIndex={-1} className="outline-none">
              {review && fixture
                ? actionName(locale, fixture.kind)
                : inspection}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {copy.heading}
            </SheetDescription>
          </SheetHeader>
          {visibleAttempt && (
            <AttemptResult
              attempt={visibleAttempt}
              locale={locale}
              retry={() =>
                submit(visibleAttempt.fixture, visibleAttempt.command, true)
              }
              close={close}
            />
          )}
          {line && review && fixture && !visibleAttempt && (
            <ResolutionReview
              key={line.reference}
              locale={locale}
              fixture={fixture}
              locationLabel={locations[line.location]}
              onBack={close}
              onSubmit={(command) => submit(fixture, command, false)}
            />
          )}
          {line && !review && (
            <>
              <PendingReceiptInspectionContent
                lineReference={line.reference}
                read={inspect}
                kind={line.kind}
                locationLabels={locations}
                backLabel={copy.return}
                onBack={close}
                onOutcome={(outcome) => {
                  setInspected(
                    outcome.kind === "found" &&
                      outcome.detail.outcome.kind === "pending"
                      ? line.reference
                      : null,
                  );
                }}
              />
              {fixture &&
                inspected === line.reference &&
                !attempt?.uncertain && (
                  <div>
                    <Button
                      onClick={() => {
                        panelTitle.current?.focus();
                        onReview();
                      }}
                    >
                      {actionName(locale, fixture.kind)}
                    </Button>
                  </div>
                )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
