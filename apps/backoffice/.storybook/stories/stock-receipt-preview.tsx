import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CheckIcon, ClockIcon, InfoCircleIcon, PlusIcon, XIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  NavigationPrototype,
  type MovementsBrowsingNavigation,
  type StockLookupNavigation,
} from "./navigation-prototype";
import type { StockEntry } from "./navigation-model";
import { ProductsCreationPreview } from "./products-creation-preview";
import { DailyStockCatalogue } from "./daily-stock-catalogue";
import type { LookupProduct } from "./stock-lookup-content";
import { lookupMessages } from "./stock-lookup-messages";
import { PendingReceiptInspectionContent } from "./pending-receipt-inspection-content";
import {
  pendingInspectionMessages,
  pendingInspectionReason,
} from "./pending-receipt-inspection-messages";
import type { InspectionRead } from "./pending-receipt-inspection-model";
import { creationUnit, type CreationUnitId } from "./products-creation-model";
import { formatCreationStep } from "./products-creation-messages";
import { receiptFeedbackMessages } from "./receipt-feedback-messages";
import {
  advanceReceiptFixture,
  finishReceiptRead,
  receiptIdentity,
  receiptProducts,
  retainedReceipt,
  type ReceiptFixture,
  type ReceiptSession,
} from "./stock-receipt-fixtures";
import { StockReceiptForm } from "./stock-receipt-form";
import { receiptMessages } from "./stock-receipt-messages";
import {
  makeReceiptRecord,
  newReceiptDraft,
  receiptDraftDirty,
  receiptRetentionMode,
  selectReceiptProduct,
  selectReceiptUnit,
  startReceiptRun,
  type ReceiptProduct,
} from "./stock-receipt-model";

type Change =
  | { field: "product"; value: ReceiptProduct | null }
  | { field: "unit"; value: CreationUnitId | null };

type ReceiptStockLookup = Omit<StockLookupNavigation, "render"> & {
  label: string;
  open: (entry: StockEntry) => void;
  initialBalances: ReceiptSession["balances"];
  render: (
    ...args: [
      ...Parameters<StockLookupNavigation["render"]>,
      ReceiptSession["balances"],
      products?: readonly LookupProduct[],
    ]
  ) => ReturnType<StockLookupNavigation["render"]>;
};

export type InspectionReceiptFacts = {
  product: string;
  location: string;
  quantity: string;
  unit: CreationUnitId;
  reasons: readonly string[];
};

type ReceiptPendingInspection = {
  reasons: readonly string[];
  remember: (lineReference: string, facts: InspectionReceiptFacts) => void;
  read: InspectionRead;
};

export function StockReceiptPreview({
  fixture,
  stockLookup,
  dailyStock,
  focusedFeedback = false,
  pendingInspection,
  movementsBrowsing,
}: {
  fixture: ReceiptFixture;
  stockLookup?: ReceiptStockLookup;
  dailyStock?: "current" | "proposed";
  focusedFeedback?: boolean;
  pendingInspection?: ReceiptPendingInspection;
  movementsBrowsing?: Omit<MovementsBrowsingNavigation, "render"> & {
    locationCount: "one" | "several";
    render: (
      location: Parameters<MovementsBrowsingNavigation["render"]>[0],
      receiptAction: React.ReactNode,
      receiptSummary: React.ReactNode,
    ) => React.ReactNode;
  };
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const copy = receiptMessages[locale];
  const feedbackCopy = receiptFeedbackMessages[locale];
  const uncertainty = focusedFeedback
    ? feedbackCopy.uncertaintyTitle
    : copy.unconfirmed;
  const inspectionCopy = pendingInspection && pendingInspectionMessages(locale);
  const receiptReasons = pendingInspection?.reasons;
  const workspaceCopy = useTranslations("catalogue");
  const locationLabels =
    stockLookup || movementsBrowsing
      ? {
          salesFloor: workspaceCopy("navSalesFloor"),
          stockroom: workspaceCopy("navStockroom"),
        }
      : copy.locationLabels;
  const locations = [
    { id: "sales-floor", name: locationLabels.salesFloor },
    { id: "stockroom", name: locationLabels.stockroom },
  ];
  const [retained] = useState(() =>
    fixture === "restored" ? retainedReceipt() : null,
  );
  const [session, setSession] = useState<ReceiptSession>({
    record: retained,
    balances: stockLookup?.initialBalances ?? {},
    read: { phase: "idle" },
    readCount: 0,
  });
  const [open, setOpen] = useState(false);
  const [shortcutProduct, setShortcutProduct] = useState<ReceiptProduct>();
  const [catalogueProducts, setCatalogueProducts] = useState<
    readonly ReceiptProduct[]
  >([]);
  const returnProduct = useRef<string | undefined>(undefined);
  const [draft, setDraft] = useState(() => newReceiptDraft());
  const [change, setChange] = useState<Change | null>(null);
  const [discard, setDiscard] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const workspace = useRef<HTMLDivElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const balanceHeading = useRef<HTMLHeadingElement>(null);
  const inspectionTrigger = useRef<HTMLButtonElement>(null);
  const sequence = useRef(0);
  const { record, read, readCount } = session;
  const active = record?.phase === "request" || record?.phase === "waiting";
  const canResume = record?.outcome === "unconfirmed";
  const phase = !record ? "form" : active ? "submitting" : record.outcome;
  const pendingResult =
    phase === "pending" && record?.result?.type === "pending"
      ? record.result
      : null;
  const inspectionReference = inspecting
    ? pendingResult?.lineReference
    : undefined;
  const isRetained = !!record && record.command === retained?.command;
  const proposed = dailyStock === "proposed";
  const emphasizeResult = proposed || focusedFeedback;
  const lookupCopy = emphasizeResult ? lookupMessages(locale) : undefined;
  const products = dailyStock
    ? catalogueProducts
    : shortcutProduct
      ? [shortcutProduct, ...receiptProducts]
      : receiptProducts;
  const locationName = locations.find(
    ({ id }) => id === record?.command.content.locationId,
  )?.name;
  const amount = (quantity: string, unit: CreationUnitId) =>
    `${formatCreationStep(quantity.replace(",", "."), locale)} ${unit === "piece" ? copy.pieceSymbol : (creationUnit(unit)?.symbol ?? unit)}`;

  useEffect(() => {
    if (!record || !active) return;
    const timer = setTimeout(
      () =>
        setSession((current) =>
          current.record === record
            ? advanceReceiptFixture(current, fixture, receiptReasons)
            : current,
        ),
      record.phase === "waiting" ? 110 : 390,
    );
    return () => clearTimeout(timer);
  }, [active, fixture, receiptReasons, record]);

  useEffect(() => {
    if (read.phase !== "loading") return;
    const timer = setTimeout(
      () =>
        setSession((current) =>
          current.read === read ? finishReceiptRead(current, fixture) : current,
        ),
      500,
    );
    return () => clearTimeout(timer);
  }, [fixture, read]);

  useEffect(() => {
    if (open && phase !== "form") resultHeading.current?.focus();
  }, [open, phase]);

  function openDraft(product?: ReceiptProduct) {
    setShortcutProduct(product);
    setDraft(newReceiptDraft(product));
    setOpen(true);
  }

  function finishClose() {
    setOpen(false);
    setInspecting(false);
    setDiscard(false);
    setChange(null);
    setDraft(newReceiptDraft());
    setShortcutProduct(undefined);
    if (!canResume)
      setSession((current) => ({
        ...current,
        record: null,
        read: { phase: "idle" },
        readCount: 0,
      }));
  }

  function requestClose() {
    if (active || change || discard) return;
    if (phase === "form" && receiptDraftDirty(draft, shortcutProduct))
      setDiscard(true);
    else finishClose();
  }

  function applyChange(next: Change) {
    setDraft((current) =>
      next.field === "product"
        ? selectReceiptProduct(current, next.value)
        : selectReceiptUnit(current, next.value),
    );
  }

  function requestChange(next: Change) {
    if (
      next.field === "product"
        ? next.value?.id === draft.product?.id
        : next.value === draft.unit
    )
      return;
    if (draft.quantity !== "") setChange(next);
    else applyChange(next);
  }

  function submit() {
    if (record || change || discard) return;
    if (!locations.some(({ id }) => id === draft.locationId)) return;
    const command = makeReceiptRecord(
      draft,
      { ...receiptIdentity, operationId: String(++sequence.current) },
      receiptRetentionMode(fixture !== "memory-only", false),
    );
    if (command)
      setSession((current) => ({
        ...current,
        record: startReceiptRun(command, 0),
        read: { phase: "idle" },
        readCount: 0,
      }));
  }

  function resume() {
    setOpen(true);
    setSession((current) =>
      current.record
        ? {
            ...current,
            record: startReceiptRun(
              current.record,
              current.record.requests.at(-1)?.deadline ?? 0,
            ),
          }
        : current,
    );
  }

  const memoryNotice = record?.mode === "memory" && canResume && (
    <p className="text-gray-600 dark:text-gray-400" data-receipt-memory>
      {copy.memory}
    </p>
  );
  const receiptAction = (openReceipt: () => void) => (
    <Button
      type="button"
      size="sm"
      className="max-sm:min-h-11"
      data-receipt-open
      disabled={canResume}
      onClick={openReceipt}
    >
      <PlusIcon className="size-4" aria-hidden="true" />
      {copy.open}
    </Button>
  );
  const receiptSummary = canResume && !open && (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800"
      data-receipt-summary
    >
      <div role="status" className="min-w-0 space-y-1">
        <p className="font-semibold">{uncertainty}</p>
        <p className="[overflow-wrap:anywhere] whitespace-pre-wrap">
          {record.command.product.name} · {locationName}
        </p>
        {memoryNotice}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="max-sm:min-h-11"
        data-receipt-resume
        onClick={resume}
      >
        {copy.resume}
      </Button>
    </div>
  );
  const movementsContent = (
    <div className="space-y-3 text-gray-800 dark:text-gray-100">
      {receiptAction(() => openDraft())}
      {receiptSummary}
    </div>
  );

  const viewStock = stockLookup &&
    record &&
    phase === "applied" &&
    read.phase !== "denied" && (
      <Button
        type="button"
        variant="outline"
        className="self-start max-sm:min-h-11"
        data-stock-lookup-receipt-shortcut
        onClick={() => {
          const { productId, locationId } = record.command.content;
          returnProduct.current = undefined;
          finishClose();
          stockLookup.open({ productId, locationId });
        }}
      >
        {stockLookup.label}
      </Button>
    );

  const originalLabel = inspectionCopy && (
    <p
      className="text-gray-600 dark:text-gray-400"
      data-pending-inspection-original
    >
      {inspectionCopy.originalResult}
    </p>
  );
  const pendingReasons = pendingResult && (
    <>
      {pendingResult.reason === "product-archived" && (
        <p>
          {focusedFeedback
            ? pendingInspectionReason(locale, pendingResult.reason)
            : copy.pendingReason}
        </p>
      )}
      {!!pendingResult.reasons?.length && (
        <ul className="list-disc space-y-1 ps-5">
          {pendingResult.reasons.map((reason) => (
            <li key={reason}>{pendingInspectionReason(locale, reason)}</li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div
      ref={workspace}
      data-receipt-workspace
      data-receipt-run={
        (record?.run ?? 0) - (isRetained ? (retained?.run ?? 0) : 0)
      }
      data-receipt-request-count={
        (record?.requests.length ?? 0) -
        (isRetained ? (retained?.requests.length ?? 0) : 0)
      }
      data-receipt-read-count={readCount}
    >
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose();
        }}
      >
        {dailyStock ? (
          <DailyStockCatalogue
            proposeShortcut={proposed}
            balances={session.balances}
            receipt={{
              label: copy.open,
              disabled: canResume,
              open: (product, choices) => {
                returnProduct.current = product?.id;
                setCatalogueProducts(choices);
                openDraft(product);
              },
              movement: (openReceipt) => (
                <div className="space-y-3 text-gray-800 dark:text-gray-100">
                  {receiptAction(openReceipt)}
                  {receiptSummary}
                </div>
              ),
            }}
            stockLookup={
              stockLookup && {
                ...stockLookup,
                render: (location, productId, records) =>
                  stockLookup.render(
                    location,
                    productId,
                    session.balances,
                    records.map(({ id, name, sku }) => ({
                      id,
                      name,
                      reference: sku ?? undefined,
                    })),
                  ),
              }
            }
            stockShortcut={
              stockLookup && {
                label: stockLookup.label,
                open: ({ id }) => stockLookup.open({ productId: id }),
              }
            }
          />
        ) : fixture === "from-product" ? (
          <ProductsCreationPreview
            fixture="catalogue"
            receiptShortcut={{
              label: copy.shortcut,
              open: openDraft,
              disabled: canResume,
            }}
            movementsContent={movementsContent}
          />
        ) : (
          <NavigationPrototype
            initialPage="movements"
            permissionMode="ready"
            locationCount={movementsBrowsing?.locationCount ?? "several"}
            movementsContent={movementsContent}
            movementsBrowsing={
              movementsBrowsing && {
                ...movementsBrowsing,
                render: (location) =>
                  movementsBrowsing.render(
                    location,
                    receiptAction(() => openDraft()),
                    receiptSummary,
                  ),
              }
            }
            stockLookup={
              stockLookup && {
                ...stockLookup,
                render: (location, productId) =>
                  stockLookup.render(location, productId, session.balances),
              }
            }
          />
        )}
        <SheetContent
          className="products-detail-panel"
          showCloseButton={false}
          finalFocus={() => {
            const productId = returnProduct.current;
            const selector = productId
              ? `[data-product-id="${CSS.escape(productId)}"] [data-product-name]`
              : canResume
                ? "[data-receipt-resume]"
                : "[data-receipt-open], [data-creation-open]";
            return (
              workspace.current?.querySelector<HTMLElement>(selector) ?? false
            );
          }}
          data-receipt-panel={phase}
          data-receipt-feedback={focusedFeedback ? phase : undefined}
        >
          <SheetHeader className="pe-10">
            <SheetTitle
              ref={resultHeading}
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
              data-receipt-close
              onClick={requestClose}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          )}
          {phase === "form" && (
            <StockReceiptForm
              dailyStock={proposed}
              copy={copy}
              products={products}
              locations={locations}
              draft={draft}
              onChange={setDraft}
              onProductChange={(value) =>
                requestChange({ field: "product", value })
              }
              onUnitChange={(value) => requestChange({ field: "unit", value })}
              onSubmit={submit}
              onCancel={requestClose}
            />
          )}
          {pendingInspection && inspectionReference && (
            <PendingReceiptInspectionContent
              lineReference={inspectionReference}
              read={pendingInspection.read}
              onBack={() => {
                // Move focus within the dialog before removing the focused Back button.
                resultHeading.current?.focus({ preventScroll: true });
                setInspecting(false);
                requestAnimationFrame(() =>
                  inspectionTrigger.current?.focus({ preventScroll: true }),
                );
              }}
            />
          )}
          {record && !inspectionReference && (
            <>
              <dl className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <div className="min-w-0">
                  <dt className="text-gray-600 dark:text-gray-400">
                    {copy.product}
                  </dt>
                  <dd
                    className={
                      proposed
                        ? "font-medium [overflow-wrap:anywhere] whitespace-pre-wrap"
                        : "font-medium whitespace-pre-wrap"
                    }
                  >
                    {record.command.product.name}
                  </dd>
                  {proposed && record.command.product.reference && (
                    <dd className="text-sm [overflow-wrap:anywhere] text-gray-600 dark:text-gray-400">
                      <bdi>{record.command.product.reference}</bdi>
                    </dd>
                  )}
                </div>
                <div className="min-w-0">
                  <dt className="text-gray-600 dark:text-gray-400">
                    {copy.destination}
                  </dt>
                  <dd className="font-medium">{locationName}</dd>
                </div>
              </dl>
              {phase === "submitting" && <p role="status">{copy.submitting}</p>}
              {phase === "applied" &&
                record.result?.type === "applied" &&
                (emphasizeResult ? (
                  <Alert
                    variant="success"
                    role="status"
                    className="gap-y-1 border-green-200 p-4"
                  >
                    <CheckIcon className="size-4" aria-hidden="true" />
                    <AlertTitle className="font-semibold">
                      {copy.applied}
                    </AlertTitle>
                    <p className="col-start-2 flex flex-wrap items-baseline gap-x-3">
                      {copy.appliedQuantity}{" "}
                      <strong
                        className="text-xl tabular-nums"
                        data-receipt-effect
                      >
                        {amount(record.result.quantity, record.result.unit)}
                      </strong>
                    </p>
                  </Alert>
                ) : (
                  <div role="status" className="space-y-1">
                    <p className="text-success-700 dark:text-success-400 font-semibold">
                      {copy.applied}
                    </p>
                    <p>
                      {copy.appliedQuantity}{" "}
                      <strong data-receipt-effect>
                        {amount(record.result.quantity, record.result.unit)}
                      </strong>
                    </p>
                  </div>
                ))}
              {!proposed && viewStock}
              {pendingResult && (
                <>
                  {focusedFeedback ? (
                    <Alert
                      variant="warning"
                      role="status"
                      className="border-amber-200 p-4"
                    >
                      <ClockIcon className="size-4" aria-hidden="true" />
                      <div className="min-w-0 space-y-1">
                        {originalLabel}
                        <AlertTitle className="font-semibold">
                          {copy.pending}
                        </AlertTitle>
                        <AlertDescription className="text-gray-700 dark:text-gray-300">
                          {feedbackCopy.pendingOriginalNoEffect}
                        </AlertDescription>
                        {pendingReasons}
                      </div>
                    </Alert>
                  ) : (
                    <div role="status" className="space-y-1">
                      {originalLabel}
                      <p className="font-semibold">{copy.pending}</p>
                      {pendingReasons}
                    </div>
                  )}
                  {pendingInspection && inspectionCopy && (
                    <Button
                      ref={inspectionTrigger}
                      type="button"
                      variant="outline"
                      className="self-start max-sm:min-h-11"
                      data-pending-inspection-open={pendingResult.lineReference}
                      onClick={() => {
                        const { quantity, unit, locationId } =
                          record.command.content;
                        pendingInspection.remember(
                          pendingResult.lineReference,
                          {
                            product: record.command.product.name,
                            location: locationId,
                            quantity,
                            unit,
                            reasons: pendingResult.reasons ?? [],
                          },
                        );
                        setInspecting(true);
                      }}
                    >
                      {inspectionCopy.open}
                    </Button>
                  )}
                </>
              )}
              {phase === "rejected" && (
                <div role="alert" className="space-y-1">
                  <p className="font-semibold">{copy.rejected}</p>
                  {record.result?.type === "rejected" &&
                    record.result.reason === "location-unavailable" && (
                      <p>{copy.rejectedReason}</p>
                    )}
                  {record.result?.type === "rejected" &&
                    record.result.reason === "balance-range" && (
                      <p>{copy.balanceRangeReason}</p>
                    )}
                </div>
              )}
              {phase === "unconfirmed" && (
                <>
                  {focusedFeedback ? (
                    <Alert role="status" className="p-4">
                      <InfoCircleIcon className="size-4" aria-hidden="true" />
                      <AlertTitle className="font-semibold">
                        {uncertainty}
                      </AlertTitle>
                    </Alert>
                  ) : (
                    <p role="status" className="font-semibold">
                      {uncertainty}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className={
                      focusedFeedback
                        ? "self-start max-sm:min-h-11"
                        : "self-start"
                    }
                    data-receipt-retry
                    onClick={resume}
                  >
                    {focusedFeedback
                      ? feedbackCopy.sameReceiptRetry
                      : copy.retry}
                  </Button>
                </>
              )}
              {memoryNotice}
            </>
          )}
          {phase === "applied" && read.phase !== "idle" && (
            <section
              className={
                emphasizeResult
                  ? "space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                  : "space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800"
              }
              data-receipt-balance={read.phase}
            >
              <h3
                ref={balanceHeading}
                tabIndex={-1}
                className="font-semibold outline-none"
              >
                {lookupCopy?.recorded ?? copy.balance}
              </h3>
              {read.phase === "loading" && (
                <p role="status">
                  {lookupCopy?.loading ?? copy.balanceLoading}
                </p>
              )}
              {read.phase === "ready" && (
                <p
                  role="status"
                  className={
                    emphasizeResult
                      ? "text-xl font-semibold tabular-nums"
                      : "text-base font-semibold"
                  }
                  data-receipt-recorded-quantity
                >
                  {amount(read.quantity, read.unit)}
                </p>
              )}
              {read.phase === "absent" && (
                <p role="status">
                  {lookupCopy?.noRecord ?? copy.balanceAbsent}
                </p>
              )}
              {read.phase === "denied" && (
                <p role="status">{lookupCopy?.denied ?? copy.balanceDenied}</p>
              )}
              {read.phase === "error" && (
                <>
                  <p role="status">{lookupCopy?.error ?? copy.balanceError}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className={focusedFeedback ? "max-sm:min-h-11" : undefined}
                    data-receipt-read-retry
                    onClick={() => {
                      balanceHeading.current?.focus();
                      setSession((current) =>
                        current.read.phase === "error"
                          ? {
                              ...current,
                              read: { phase: "loading" },
                              readCount: current.readCount + 1,
                            }
                          : current,
                      );
                    }}
                  >
                    {focusedFeedback ? feedbackCopy.readRetry : copy.readRetry}
                  </Button>
                </>
              )}
              {proposed && viewStock && <div className="pt-1">{viewStock}</div>}
            </section>
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
                  data-receipt-cancel-change
                  onClick={() => setChange(null)}
                >
                  {copy.cancelChange}
                </Button>
                <Button
                  type="button"
                  data-receipt-confirm-change
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
                  data-receipt-keep-editing
                  onClick={() => setDiscard(false)}
                >
                  {copy.keepEditing}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  data-receipt-discard
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
