import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CheckIcon, PlusIcon, XIcon } from "@/icons";
import type { Locale } from "@/i18n/configuration";
import { makeBrowsingProducts } from "./products-browsing-fixtures";
import { useProductEditing } from "./products-editing";
import { ProductsTableWorkspace } from "./products-table-preview";
import { ProductsCreationForm } from "./products-creation-form";
import { creationMessages } from "./products-creation-messages";
import {
  advanceCreationRun,
  creationDraftDirty,
  creationRetentionMode,
  creationUnit,
  makeCreationRecord,
  newCreationDraft,
  receiveCreationResult,
  restoreCreationRecord,
  startCreationRun,
  type CreationRecord,
  type CreationUnitId,
} from "./products-creation-model";

export type CreationFixture =
  "catalogue" | "recovery" | "restored" | "memory-only" | "rejected";

const scope = { businessId: "demo-merchant", userId: "demo-user" };
const identity = { ...scope, origin: "storybook-product-creation" };

function restoredFixture(): CreationRecord | null {
  const submitted = makeCreationRecord(
    { ...newCreationDraft(), name: "Tomate pera", unit: "kg" },
    { ...identity, operationId: "retained" },
    creationRetentionMode(false, true),
  );
  if (!submitted) return null;
  const stopped = advanceCreationRun(
    startCreationRun(submitted, 0),
    100_000,
    () => 0.5,
  );
  return restoreCreationRecord(stopped, scope);
}

// Display virtual deadlines with short, fixed fixture delays. No transport is used.
function advanceFixture(record: CreationRecord, fixture: CreationFixture) {
  const nextAt = record.nextAt;
  if (nextAt === null) return record;
  if (record.phase === "waiting") return advanceCreationRun(record, nextAt);
  if (fixture === "rejected")
    return receiveCreationResult(record, { type: "rejected" }, nextAt);
  if ((fixture === "recovery" || fixture === "memory-only") && record.run === 1)
    return advanceCreationRun(record, nextAt, () => 0.5);
  return receiveCreationResult(
    record,
    {
      type: "confirmed",
      productId: `preview-created-${record.command.identity.operationId}`,
    },
    nextAt,
  );
}

export function ProductsCreationPreview({
  fixture,
  receiptShortcut,
  movementsContent,
}: {
  fixture: CreationFixture;
  receiptShortcut?: {
    label: string;
    open: (product: {
      id: string;
      name: string;
      unit: CreationUnitId;
      increment: string;
    }) => void;
    disabled: boolean;
  };
  movementsContent?: ReactNode;
}) {
  const copy = creationMessages[useLocale() as Locale];
  const initial = useMemo(() => makeBrowsingProducts(1000), []);
  const editor = useProductEditing(initial, "confirmed");
  const { addPreviewProduct } = editor;
  const [open, setOpen] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [draft, setDraft] = useState(newCreationDraft);
  const [retained] = useState(() =>
    fixture === "restored" ? restoredFixture() : null,
  );
  const [record, setRecord] = useState(retained);
  const openButton = useRef<HTMLButtonElement>(null);
  const resumeButton = useRef<HTMLButtonElement>(null);
  const outcomeHeading = useRef<HTMLHeadingElement>(null);
  const openingReceipt = useRef(false);
  const sequence = useRef(0);
  const resumingRetained = !!record && record.command === retained?.command;
  const canResume = record?.outcome === "unconfirmed";
  const active = record?.phase === "request" || record?.phase === "waiting";
  const phase = !record ? "form" : active ? "pending" : record.outcome;

  useEffect(() => {
    if (!record || !active) return;
    const timer = setTimeout(
      () =>
        setRecord((current) =>
          current === record ? advanceFixture(record, fixture) : current,
        ),
      record.phase === "waiting" ? 100 : 380,
    );
    return () => clearTimeout(timer);
  }, [active, fixture, record]);

  useEffect(() => {
    if (!record || record.outcome !== "confirmed" || !record.productId) return;
    const { name, unit, dimension } = record.command.content;
    const measurement = creationUnit(unit);
    if (!measurement) return;
    const noRecordedStock = { state: "none" as const, measures: [] };
    addPreviewProduct({
      id: record.productId,
      name,
      unit: measurement.symbol,
      sku: null,
      barcodes: [],
      archived: false,
      reservationDimension: dimension,
      stock: { "sales-floor": noRecordedStock, stockroom: noRecordedStock },
    });
  }, [addPreviewProduct, record]);

  useEffect(() => {
    if (open && phase !== "form") outcomeHeading.current?.focus();
  }, [open, phase]);

  function finishClose() {
    setDiscard(false);
    setDraft(newCreationDraft());
    setOpen(false);
    if (!canResume) setRecord(null);
  }

  function requestClose() {
    if (active) return;
    if (phase === "form" && creationDraftDirty(draft)) setDiscard(true);
    else finishClose();
  }

  function submit() {
    if (record) return;
    const submitted = makeCreationRecord(
      draft,
      { ...identity, operationId: String(++sequence.current) },
      creationRetentionMode(fixture !== "memory-only", false),
    );
    if (submitted) setRecord(startCreationRun(submitted, 0));
  }

  function resume() {
    setOpen(true);
    setRecord((current) =>
      current
        ? startCreationRun(current, current.requests.at(-1)?.deadline ?? 0)
        : current,
    );
  }

  return (
    <div
      data-creation-workspace
      data-creation-run={
        (record?.run ?? 0) - (resumingRetained ? (retained?.run ?? 0) : 0)
      }
      data-creation-attempt={record?.restored ? 0 : (record?.attempt ?? 0)}
      data-creation-request-count={
        (record?.requests.length ?? 0) -
        (resumingRetained ? (retained?.requests.length ?? 0) : 0)
      }
    >
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose();
        }}
      >
        <ProductsTableWorkspace
          editor={editor}
          initialStock={false}
          initialDensity="compact"
          hiddenColumns={false}
          locationCount="several"
          archivedFixture
          browsingFixture="catalogue"
          browsingCount={1000}
          viewKey={`irin-products-design:${receiptShortcut ? "receipt-product" : "creation"}:${fixture}`}
          movementsContent={movementsContent}
          summary={
            canResume &&
            !open && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                <div role="status" className="min-w-0">
                  <p className="font-semibold">{copy.unconfirmed}</p>
                  <p className="[overflow-wrap:anywhere] whitespace-pre-wrap">
                    {record?.command.content.name}
                  </p>
                  {record?.mode === "memory" && (
                    <p
                      className="text-gray-600 dark:text-gray-400"
                      data-creation-memory
                    >
                      {copy.memory}
                    </p>
                  )}
                </div>
                <Button
                  ref={resumeButton}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="max-sm:min-h-11"
                  data-creation-resume
                  disabled={Boolean(editor.mode)}
                  onClick={resume}
                >
                  {copy.resume}
                </Button>
              </div>
            )
          }
          catalogueAction={
            <Button
              ref={openButton}
              size="sm"
              className="max-sm:min-h-11"
              data-creation-open
              disabled={Boolean(editor.mode) || canResume}
              onClick={() => setOpen(true)}
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              {copy.open}
            </Button>
          }
        />
        <SheetContent
          className="products-detail-panel"
          showCloseButton={false}
          finalFocus={() => {
            if (openingReceipt.current) {
              openingReceipt.current = false;
              return false;
            }
            return canResume ? resumeButton.current : openButton.current;
          }}
          data-creation-panel={phase}
        >
          <SheetHeader className="pe-10">
            <SheetTitle
              ref={outcomeHeading}
              tabIndex={-1}
              className="text-xl whitespace-pre-wrap outline-none"
            >
              {record?.command.content.name ?? copy.title}
            </SheetTitle>
          </SheetHeader>
          {!active && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute end-3 top-3 max-sm:min-h-11 max-sm:min-w-11"
              aria-label={copy.close}
              data-creation-close
              onClick={requestClose}
            >
              <XIcon className="size-4" />
            </Button>
          )}
          {phase === "form" && (
            <ProductsCreationForm
              copy={copy}
              draft={draft}
              onChange={setDraft}
              onSubmit={submit}
              onCancel={requestClose}
            />
          )}
          {phase === "pending" && <p role="status">{copy.busy}</p>}
          {phase === "confirmed" && record && (
            <>
              <p
                role="status"
                className="text-success-700 dark:text-success-400 flex items-center gap-2 font-semibold"
              >
                <CheckIcon className="size-4" aria-hidden="true" />
                {copy.created}
              </p>
              <dl className="border-t border-gray-200 pt-4 dark:border-gray-800">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  {copy.detailUnit}
                </dt>
                <dd className="mt-1 font-medium">
                  {copy.unitLabels[record.command.content.unit]}
                </dd>
              </dl>
              {receiptShortcut && (
                <Button
                  type="button"
                  variant="outline"
                  className="self-start max-sm:min-h-11"
                  data-receipt-shortcut
                  disabled={receiptShortcut.disabled}
                  onClick={() => {
                    const { name, unit, increment } = record.command.content;
                    const measurement = creationUnit(unit);
                    if (!measurement || !record.productId) return;
                    openingReceipt.current = true;
                    finishClose();
                    receiptShortcut.open({
                      id: record.productId,
                      name,
                      unit,
                      increment: increment ?? measurement.defaultStep,
                    });
                  }}
                >
                  {receiptShortcut.label}
                </Button>
              )}
            </>
          )}
          {phase === "rejected" && <p role="alert">{copy.rejected}</p>}
          {phase === "unconfirmed" && (
            <>
              <p role="status" className="font-semibold">
                {copy.unconfirmed}
              </p>
              <Button
                type="button"
                variant="outline"
                className="self-start"
                data-creation-retry
                onClick={resume}
              >
                {copy.retry}
              </Button>
            </>
          )}
          {record?.mode === "memory" && canResume && (
            <p
              className="text-gray-600 dark:text-gray-400"
              data-creation-memory
            >
              {copy.memory}
            </p>
          )}
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
                  data-creation-continue-editing
                  onClick={() => setDiscard(false)}
                >
                  {copy.keepEditing}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  data-creation-discard
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
