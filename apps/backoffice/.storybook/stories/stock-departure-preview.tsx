import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PlusIcon, XIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { NavigationPrototype } from "./navigation-prototype";
import { pendingDepartureInspectionReason } from "./pending-departure-inspection-messages";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnit, type CreationUnitId } from "./products-creation-model";
import { receiptProducts } from "./stock-receipt-fixtures";
import { ReceiptSelect, StockReceiptForm } from "./stock-receipt-form";
import {
  advanceReceiptRun,
  receiptDraftDirty,
  selectReceiptProduct,
  selectReceiptUnit,
  startReceiptRun,
  type ReceiptDraft,
  type ReceiptProduct,
  type ReceiptRecord,
} from "./stock-receipt-model";
import { stockDepartureMessages } from "./stock-departure-messages";
import {
  advanceDepartureFixture,
  departureChannelId,
  eligibleDepartureChannels,
  finishDepartureAttempt,
  makeDepartureRecord,
  newDepartureDraft,
  selectDepartureOrigin,
} from "./stock-departure-model";
import "./products-table-preview.css";

export type StockDepartureFixture =
  | "movements"
  | "origin-without-channels"
  | "applied"
  | "pending"
  | "rejected"
  | "unconfirmed";

type Change =
  | { field: "product"; value: ReceiptProduct }
  | { field: "unit"; value: CreationUnitId };

const products = [
  ...receiptProducts,
  { id: "tomato-second", name: "Tomate pera", unit: "kg", increment: "0.001" },
] satisfies readonly ReceiptProduct[];
const channels = [
  { id: "counter", name: "Mostrador", enabledLocationIds: ["sales-floor"] },
  {
    id: "delivery",
    name: "Reparto",
    enabledLocationIds: ["stockroom", "sales-floor"],
  },
];
const identity = {
  businessId: "demo-merchant",
  userId: "demo-user",
  origin: "storybook-stock-departure",
};

function seededRecord(fixture: StockDepartureFixture): ReceiptRecord | null {
  if (fixture === "movements" || fixture === "origin-without-channels")
    return null;
  const draft = {
    product: products[0],
    locationId: "sales-floor",
    channelId: "counter",
    quantity: "2250",
    unit: "g" as const,
    reference: "",
  };
  const initial = makeDepartureRecord(draft, channels, {
    ...identity,
    operationId: "seeded",
  });
  if (!initial) throw new Error("Invalid departure fixture");
  const request = startReceiptRun(initial, 0);
  return fixture === "unconfirmed"
    ? advanceReceiptRun(request, 100_000, () => 0.5)
    : finishDepartureAttempt(request, fixture, request.nextAt ?? 0);
}

export function StockDeparturePreview({
  fixture,
}: {
  fixture: StockDepartureFixture;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const copy = stockDepartureMessages(locale);
  const id = useId();
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState(() =>
    selectDepartureOrigin(
      newDepartureDraft(),
      fixture === "origin-without-channels" ? "stockroom" : "",
    ),
  );
  const [record, setRecord] = useState(() => seededRecord(fixture));
  const [discard, setDiscard] = useState(false);
  const [change, setChange] = useState<Change | null>(null);
  const [checkChannel, setCheckChannel] = useState(false);
  const sequence = useRef(0);
  const entry = useRef<HTMLButtonElement>(null);
  const recovery = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const channelControl = useRef<HTMLSelectElement>(null);
  const noChannelsDescription = useRef<HTMLParagraphElement>(null);
  const availableChannels =
    fixture === "origin-without-channels" ? channels.slice(0, 1) : channels;
  const eligibleChannels = eligibleDepartureChannels(
    availableChannels,
    draft.locationId,
  );
  const channelMissing =
    checkChannel && !draft.channelId && eligibleChannels.length > 0;
  const active = record?.phase === "request" || record?.phase === "waiting";
  const phase = active ? "submitting" : (record?.outcome ?? "form");
  const resumable = record?.outcome === "unconfirmed" && !active;
  const expected =
    fixture === "movements" || fixture === "origin-without-channels"
      ? "form"
      : fixture;
  const locations = [
    { id: "stockroom", name: copy.locationLabels.stockroom },
    { id: "sales-floor", name: copy.locationLabels.salesFloor },
  ];
  const resultOrigin = locations.find(
    ({ id }) => id === record?.command.content.locationId,
  );
  const resultChannel =
    record &&
    availableChannels.find(({ id }) => id === departureChannelId(record));
  const amount = (quantity: string, unit: CreationUnitId) =>
    `${formatCreationStep(quantity, locale)} ${unit === "piece" ? copy.pieceSymbol : (creationUnit(unit)?.symbol ?? unit)}`;

  useEffect(() => {
    if (open && phase !== "form")
      heading.current?.focus({ preventScroll: true });
  }, [open, phase]);

  useEffect(() => {
    if (!record || record.nextAt === null) return;
    const outcome =
      fixture === "movements" || fixture === "origin-without-channels"
        ? "applied"
        : fixture;
    // Storybook accelerates the existing virtual retry clock for review.
    const timer = window.setTimeout(
      () => {
        setRecord((current) =>
          current === record
            ? advanceDepartureFixture(record, outcome)
            : current,
        );
      },
      record.phase === "waiting" ? 250 : 350,
    );
    return () => window.clearTimeout(timer);
  }, [fixture, record]);

  function openDraft() {
    setDraft(newDepartureDraft());
    setRecord(null);
    setCheckChannel(false);
    setOpen(true);
  }

  function finishClose() {
    setDiscard(false);
    setChange(null);
    setOpen(false);
    setDraft(newDepartureDraft());
    if (record?.outcome !== "unconfirmed") setRecord(null);
  }

  function requestClose() {
    if (active) return;
    if (phase === "form" && (receiptDraftDirty(draft) || draft.channelId)) {
      setDiscard(true);
      return;
    }
    finishClose();
  }

  function updateDraft(next: ReceiptDraft) {
    setDraft((current) => ({
      ...next,
      channelId: selectDepartureOrigin(current, next.locationId).channelId,
    }));
    if (next.locationId !== draft.locationId) setCheckChannel(false);
  }

  function applyChange(next: Change) {
    setDraft((current) => ({
      ...(next.field === "product"
        ? selectReceiptProduct(current, next.value)
        : selectReceiptUnit(current, next.value)),
      channelId: current.channelId,
    }));
  }

  function requestChange(next: Change) {
    if (draft.quantity === "") applyChange(next);
    else setChange(next);
  }

  function submit() {
    if (record) return;
    const next = makeDepartureRecord(draft, availableChannels, {
      ...identity,
      operationId: `departure-${++sequence.current}`,
    });
    if (!next) {
      setCheckChannel(true);
      if (eligibleChannels.length) channelControl.current?.focus();
      else noChannelsDescription.current?.focus();
      return;
    }
    setRecord(startReceiptRun(next, 0));
  }

  function resume() {
    if (!resumable || !record) return;
    setOpen(true);
    setRecord(startReceiptRun(record, record.requests.at(-1)?.deadline ?? 0));
  }

  return (
    <div
      data-stock-departure-workspace
      data-stock-departure-attempts={record?.requests.length ?? 0}
    >
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose();
        }}
      >
        <NavigationPrototype
          initialPage="movements"
          permissionMode="ready"
          locationCount="several"
          movementsContent={
            <div className="space-y-3">
              <Button
                ref={entry}
                type="button"
                size="sm"
                className="max-sm:min-h-11"
                disabled={resumable}
                onClick={openDraft}
              >
                <PlusIcon className="size-4" aria-hidden="true" />
                {copy.open}
              </Button>
              {resumable && !open && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                  <p role="status" className="font-semibold">
                    {copy.unconfirmed}
                  </p>
                  <Button
                    ref={recovery}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={resume}
                  >
                    {copy.resume}
                  </Button>
                </div>
              )}
            </div>
          }
        />
        <SheetContent
          className="products-detail-panel"
          showCloseButton={false}
          finalFocus={() =>
            (resumable ? recovery.current : entry.current) ?? false
          }
          data-stock-departure-panel={phase}
          data-stock-departure-ready={
            open && phase === expected ? fixture : undefined
          }
        >
          <SheetHeader className="pe-10">
            <SheetTitle
              ref={heading}
              tabIndex={-1}
              className="text-xl outline-none"
            >
              {copy.title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {copy.panelDescription}
            </SheetDescription>
          </SheetHeader>
          {!active && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute end-3 top-3 max-sm:min-h-11 max-sm:min-w-11"
              aria-label={copy.close}
              data-stock-departure-close
              onClick={requestClose}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          )}
          {phase === "form" && (
            <StockReceiptForm
              copy={copy}
              products={products}
              locations={locations}
              draft={draft}
              onChange={updateDraft}
              onProductChange={(value) =>
                requestChange({ field: "product", value })
              }
              onUnitChange={(value) => requestChange({ field: "unit", value })}
              onSubmit={submit}
              onCancel={requestClose}
              afterLocation={
                <Field controlId={`${id}-channel`}>
                  <FieldLabel>{copy.channel}</FieldLabel>
                  <ReceiptSelect
                    ref={channelControl}
                    id={`${id}-channel`}
                    data-stock-departure-channel
                    value={draft.channelId}
                    required
                    disabled={!eligibleChannels.length}
                    aria-invalid={channelMissing || undefined}
                    aria-describedby={
                      channelMissing
                        ? `${id}-channel-error`
                        : !eligibleChannels.length
                          ? `${id}-channel-hint`
                          : undefined
                    }
                    onChange={(event) => {
                      setDraft({ ...draft, channelId: event.target.value });
                      setCheckChannel(false);
                    }}
                  >
                    <option value="" disabled>
                      {copy.selectChannel}
                    </option>
                    {eligibleChannels.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </ReceiptSelect>
                  {!eligibleChannels.length && (
                    <FieldDescription
                      ref={noChannelsDescription}
                      tabIndex={-1}
                      id={`${id}-channel-hint`}
                    >
                      {draft.locationId ? copy.noChannels : copy.originFirst}
                    </FieldDescription>
                  )}
                  {channelMissing && (
                    <FieldError
                      id={`${id}-channel-error`}
                      className="text-red-700 dark:text-red-300"
                    >
                      {copy.selectChannel}.
                    </FieldError>
                  )}
                </Field>
              }
            />
          )}
          {record && (
            <dl className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              {[
                [copy.product, record.command.product.name],
                [copy.destination, resultOrigin?.name],
                [copy.channel, resultChannel && resultChannel.name],
                [
                  copy.quantity,
                  amount(
                    record.command.content.quantity,
                    record.command.content.unit,
                  ),
                ],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-gray-600 dark:text-gray-400">{label}</dt>
                  <dd className="font-medium whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {phase === "submitting" && <p role="status">{copy.submitting}</p>}
          {record?.result?.type === "applied" && (
            <div role="status" className="space-y-1">
              <p className="text-success-700 dark:text-success-400 font-semibold">
                {copy.applied}
              </p>
              <p>
                {copy.appliedQuantity}{" "}
                <strong data-stock-departure-effect>
                  {amount(record.result.quantity, record.result.unit)}
                </strong>
              </p>
            </div>
          )}
          {record?.result?.type === "pending" && (
            <div role="status" className="space-y-1">
              <p className="font-semibold">{copy.pending}</p>
              {!!record.result.reasons?.length && (
                <ul className="list-disc ps-5">
                  {record.result.reasons.map((reason) => (
                    <li key={reason}>
                      {pendingDepartureInspectionReason(locale, reason)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {record?.result?.type === "rejected" && (
            <div role="alert" className="space-y-1">
              <p className="font-semibold">{copy.rejected}</p>
              {record.result.reason === "location-unavailable" && (
                <p>{copy.rejectedReason}</p>
              )}
            </div>
          )}
          {resumable && (
            <>
              <p role="status" className="font-semibold">
                {copy.unconfirmed}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{copy.memory}</p>
              <Button
                type="button"
                variant="outline"
                className="self-start"
                data-stock-departure-retry
                onClick={resume}
              >
                {copy.retry}
              </Button>
            </>
          )}
          <Dialog
            open={change !== null}
            onOpenChange={(next) => {
              if (!next) setChange(null);
            }}
          >
            <DialogContent
              closeLabel={copy.close}
              className="max-w-[calc(100vw-32px)] sm:max-w-[420px]"
            >
              <DialogHeader>
                <DialogTitle>
                  {change?.field === "product"
                    ? copy.changeProductTitle
                    : copy.changeUnitTitle}
                </DialogTitle>
                <DialogDescription>{copy.changeClearsAmount}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChange(null)}
                >
                  {copy.cancelChange}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (change) applyChange(change);
                    setChange(null);
                  }}
                >
                  {copy.confirmChange}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={discard} onOpenChange={setDiscard}>
            <DialogContent
              closeLabel={copy.close}
              className="max-w-[calc(100vw-32px)] sm:max-w-[420px]"
            >
              <DialogHeader>
                <DialogTitle>{copy.discardTitle}</DialogTitle>
                <DialogDescription>{copy.discardText}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDiscard(false)}
                >
                  {copy.keepEditing}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={finishClose}
                >
                  {copy.discard}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetContent>
      </Sheet>
    </div>
  );
}
