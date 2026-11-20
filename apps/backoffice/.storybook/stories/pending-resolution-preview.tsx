"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { NavigationPrototype } from "./navigation-prototype";
import { pendingDuplicateReviewMessages } from "./pending-duplicate-review-messages";
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
import { pendingReceiptQuantityMessages } from "./pending-receipt-quantity-messages";
import { pendingDepartureInspectionMessages } from "./pending-departure-inspection-messages";
import { pendingReleaseGuidanceMessages } from "./pending-release-guidance-messages";
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

function unitLabel(unit: PendingLine["unit"], locale: Locale) {
  const copy = pendingInspectionMessages(locale);
  if (unit === null) return copy.unknown;
  return unit === "piece"
    ? copy.pieceSymbol
    : (creationUnit(unit)?.symbol ?? unit);
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
  return `${quantity} ${unitLabel(line.unit, locale)}`;
}

type ReleaseCorrection = readonly [label: string, value: string];

function PendingReleaseFacts({
  locale,
  line,
  locationLabel,
  correction,
}: {
  locale: Locale;
  line: PendingLine;
  locationLabel: string;
  correction?: ReleaseCorrection;
}) {
  const copy = pendingReleaseGuidanceMessages[locale];
  const inspection =
    line.kind === "departure"
      ? pendingDepartureInspectionMessages(locale)
      : pendingInspectionMessages(locale);
  const facts = [
    [inspection.product, line.product ?? inspection.unknown],
    [inspection.location, locationLabel],
    [copy.registeredQuantity, quantityWithUnit(line, locale)],
    ...(correction ? [correction] : []),
  ];

  return (
    <div
      className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
      data-pending-release-summary={correction ? "" : undefined}
    >
      <dl className="grid grid-cols-2 gap-3">
        {facts.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-sm text-gray-600 dark:text-gray-400">
              {label}
            </dt>
            <dd className="font-medium [overflow-wrap:anywhere] whitespace-pre-wrap text-gray-800 dark:text-gray-100">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {!correction && line.reasons.length > 0 && (
        <div className="space-y-1 border-t border-gray-200 pt-2 text-sm dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {copy.recordedReason}
          </h3>
          {line.reasons.map((code) => (
            <p key={code}>{pendingBrowsingReason(locale, code)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function AttemptResult({
  locale,
  attempt,
  focusedRelease,
  focusedDuplicate,
  locationLabel,
  retry,
  close,
}: {
  locale: Locale;
  attempt: Attempt;
  focusedRelease: boolean;
  focusedDuplicate: boolean;
  locationLabel: string;
  retry(): void;
  close(): void;
}) {
  const copy = pendingResolutionMessages[locale];
  const { result, uncertain } = attempt;
  const original = result.kind === "resolved" ? result.original : null;
  const { request } = attempt.command;
  const release = request.kind === "release";
  const duplicateCopy = pendingDuplicateReviewMessages[locale];
  const confirmedCancellation =
    focusedDuplicate &&
    original?.kind === "rejected" &&
    original.reason === "duplicate-batch-cancelled" &&
    request.kind === "cancel"
      ? request
      : null;
  let correction: ReleaseCorrection | undefined;
  if (focusedRelease && original?.kind === "applied" && release) {
    const { corrections } = request;
    const { fixture } = attempt;
    if (fixture.kind === "release" && "channelId" in corrections) {
      const channel = fixture.channels.find(
        ({ id }) => id === corrections.channelId,
      );
      if (channel)
        correction = [
          pendingReleaseGuidanceMessages[locale].indicatedChannel,
          channel.label,
        ];
    }
    if (fixture.kind === "receipt-release" && "quantity" in corrections) {
      correction = [
        pendingReceiptQuantityMessages[locale].indicatedQuantity,
        quantityWithUnit(
          { quantity: corrections.quantity, unit: fixture.line.unit },
          locale,
        ),
      ];
    }
  }
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
      {correction && (
        <PendingReleaseFacts
          locale={locale}
          line={attempt.fixture.line}
          locationLabel={locationLabel}
          correction={correction}
        />
      )}
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
          {confirmedCancellation && (
            <dl
              data-pending-duplicate-summary
              className="mb-3 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
            >
              <div className="min-w-0">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  {duplicateCopy.cancelled}
                </dt>
                <dd className="font-medium [overflow-wrap:anywhere]">
                  {confirmedCancellation.target.callerOperationId}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  {duplicateCopy.kept}
                </dt>
                <dd className="font-medium [overflow-wrap:anywhere]">
                  {confirmedCancellation.counterpart.callerOperationId}
                </dd>
              </div>
            </dl>
          )}
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
  focusedRelease,
  focusedDuplicate,
  locationLabel,
  onSubmit,
  onBack,
}: {
  locale: Locale;
  fixture: ResolutionFixture;
  focusedRelease: boolean;
  focusedDuplicate: boolean;
  locationLabel: string;
  onSubmit(command: ResolutionCommand): void;
  onBack(): void;
}) {
  const copy = pendingResolutionMessages[locale];
  const duplicateGuide =
    focusedDuplicate && fixture.kind === "cancel"
      ? pendingDuplicateReviewMessages[locale]
      : undefined;
  const guide =
    focusedRelease &&
    (fixture.kind === "release" || fixture.kind === "receipt-release")
      ? pendingReleaseGuidanceMessages[locale]
      : undefined;
  const quantityGuide =
    guide && fixture.kind === "receipt-release"
      ? pendingReceiptQuantityMessages[locale]
      : undefined;
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
  const validDraft =
    prepareResolutionCommand(fixture, {
      ...draft,
      confirmed: !!quantityGuide || confirmed,
      operationId: "review",
    }) !== null;
  const canConfirm = confirmed && validDraft;
  const invalidQuantity = !!quantityGuide && quantity !== "" && !validDraft;
  const invalidReason = reason.length > 0 && !resolutionReasonValid(reason);

  function enterQuantity(value: string) {
    setQuantity(value);
    setConfirmed(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = prepareResolutionCommand(fixture, {
      ...draft,
      operationId: crypto.randomUUID(),
    });
    if (command) onSubmit(command);
  }

  const counterpartControl =
    fixture.kind === "cancel" &&
    (fixture.eligibleCounterparts ? (
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
    ) : (
      fixture.counterpart.callerOperationId
    ));
  const affectedLines = fixture.kind === "cancel" && (
    <ul className="list-disc space-y-1 ps-5">
      {[fixture.line, duplicateSibling].map((line) => (
        <li key={line.reference}>
          {line.product} · {quantityWithUnit(line, locale)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-4" data-pending-resolution-review={fixture.kind}>
      {guide ? (
        <PendingReleaseFacts
          locale={locale}
          line={fixture.line}
          locationLabel={locationLabel}
        />
      ) : (
        !duplicateGuide && (
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
        )
      )}
      {fixture.kind === "counterpart-unavailable" ? (
        <>
          <p role="status">{copy.unavailable}</p>
          <Button onClick={onBack} variant="outline">
            {copy.return}
          </Button>
        </>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          {fixture.kind === "cancel" &&
            (duplicateGuide ? (
              <>
                <section className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {copy.target}
                  </h3>
                  <p className="font-medium [overflow-wrap:anywhere]">
                    {fixture.target.callerOperationId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.batchScope}
                  </p>
                  <h4 className="border-t border-gray-200 pt-2 text-sm font-semibold dark:border-gray-800">
                    {duplicateGuide.affectedLines}
                  </h4>
                  {affectedLines}
                </section>
                <section className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {copy.counterpart}
                  </h3>
                  {counterpartControl}
                </section>
              </>
            ) : (
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
                    <dd
                      className={
                        fixture.eligibleCounterparts
                          ? undefined
                          : "font-medium break-all"
                      }
                    >
                      {counterpartControl}
                    </dd>
                  </div>
                </dl>
                <p>{copy.batchScope}</p>
                {affectedLines}
              </div>
            ))}
          {fixture.kind === "release" ? (
            <>
              <label className="block space-y-1 font-medium">
                <span>{guide?.channelLabel ?? copy.actualChannel}</span>
                <select
                  value={channelId}
                  onChange={(event) => {
                    setChannelId(event.target.value);
                    if (guide) setConfirmed(false);
                  }}
                  className="min-h-11 w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  aria-describedby={guide ? `${id}-channel-hint` : undefined}
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
              {guide && (
                <p
                  id={`${id}-channel-hint`}
                  className="-mt-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  {guide.fixChannelHint}
                </p>
              )}
            </>
          ) : fixture.kind === "receipt-release" && quantityGuide ? (
            <Field controlId={`${id}-quantity`}>
              <FieldLabel>{copy.actualQuantity}</FieldLabel>
              <div className="relative">
                <Input
                  className="pe-14 tabular-nums"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(event) => enterQuantity(event.target.value)}
                  required
                  aria-invalid={invalidQuantity || undefined}
                  aria-describedby={`${id}-unit ${id}-quantity-rule${invalidQuantity ? ` ${id}-quantity-error` : ""}`}
                />
                <span
                  id={`${id}-unit`}
                  className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm text-gray-600 dark:text-gray-300"
                >
                  {unitLabel(fixture.line.unit, locale)}
                </span>
              </div>
              <FieldDescription id={`${id}-quantity-rule`}>
                {quantityGuide.quantityRule
                  .replace(
                    "{original}",
                    fixture.line.quantity === null
                      ? inspection.unknown
                      : formatCreationStep(fixture.line.quantity, locale),
                  )
                  .replace(
                    "{increment}",
                    formatCreationStep(fixture.product.increment, locale),
                  )}
              </FieldDescription>
              {invalidQuantity && (
                <FieldError id={`${id}-quantity-error`}>
                  {quantityGuide.invalidQuantity}
                </FieldError>
              )}
            </Field>
          ) : fixture.kind === "receipt-release" ? (
            <label className="block space-y-1 font-medium">
              <span>{copy.actualQuantity}</span>
              <input
                className="min-h-11 w-full rounded-lg border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => enterQuantity(event.target.value)}
                required
                aria-describedby={id}
              />
              <span id={id} className="block font-normal">
                {copy.quantityHint}
              </span>
            </label>
          ) : (
            <label className="block space-y-1 font-medium">
              <span>{duplicateGuide?.reason ?? copy.reason}</span>
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
                ? (guide?.confirmChannel ?? copy.reviewRelease)
                : fixture.kind === "receipt-release"
                  ? copy.reviewReceiptRelease
                  : fixture.kind === "reject"
                    ? copy.reviewReject
                    : copy.reviewCancel}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!canConfirm}>
              {duplicateGuide?.confirm ?? guide?.confirmRelease ?? copy.confirm}
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
  focusedRelease = false,
  focusedDuplicate = false,
  startInList = false,
}: {
  preset: ResolutionPreset;
  denyRetry?: boolean;
  focusedRelease?: boolean;
  focusedDuplicate?: boolean;
  startInList?: boolean;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const t = useTranslations("catalogue");
  const [initial] = useState(() => initialSession(preset));
  const [line, setLine] = useState<PendingLine | null>(
    startInList ? null : initial.fixture.line,
  );
  const [review, setReview] = useState(!startInList);
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
    <div data-pending-release-guidance={focusedRelease ? "" : undefined}>
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
              focusedRelease={focusedRelease}
              focusedDuplicate={focusedDuplicate}
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
  focusedRelease,
  focusedDuplicate,
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
  focusedRelease: boolean;
  focusedDuplicate: boolean;
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
  const guidedAction =
    focusedDuplicate && fixture?.kind === "cancel"
      ? pendingDuplicateReviewMessages[locale].reviewDuplicate
      : focusedRelease && fixture?.kind === "release"
        ? pendingReleaseGuidanceMessages[locale].reviewChannel
        : focusedRelease && fixture?.kind === "receipt-release"
          ? pendingReceiptQuantityMessages[locale].reviewQuantity
          : undefined;
  const reviewButton =
    line && fixture && inspected === line.reference && !attempt?.uncertain ? (
      <Button
        className={guidedAction ? "max-sm:min-h-11" : undefined}
        onClick={() => {
          panelTitle.current?.focus();
          onReview();
        }}
      >
        {guidedAction ?? actionName(locale, fixture.kind)}
      </Button>
    ) : null;
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
              focusedRelease={focusedRelease}
              focusedDuplicate={focusedDuplicate}
              locationLabel={locations[visibleAttempt.fixture.line.location]}
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
              focusedRelease={focusedRelease}
              focusedDuplicate={focusedDuplicate}
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
                pendingAction={guidedAction ? reviewButton : undefined}
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
              {!guidedAction && reviewButton && <div>{reviewButton}</div>}
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
