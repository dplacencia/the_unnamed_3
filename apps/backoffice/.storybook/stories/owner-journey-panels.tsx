import { useId, useState } from "react";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Locale } from "@/i18n/configuration";
import { coreHierarchyMessages } from "./core-hierarchy-messages";
import { HierarchyEditor, type Editor } from "./core-hierarchy-preview";
import type { HierarchyChange } from "./core-hierarchy-model";
import {
  CalendarForm,
  ChannelForm,
  EnableForm,
} from "./inventory-setup-preview";
import { inventorySetupMessages } from "./inventory-setup-messages";
import type { AreaSetup, SetupCommand } from "./inventory-setup-model";
import { ProductsCreationForm } from "./products-creation-form";
import { creationMessages } from "./products-creation-messages";
import {
  creationDraftDirty,
  newCreationDraft,
  type CreationDraft,
  type CreationUnitId,
} from "./products-creation-model";
import { stockDepartureMessages } from "./stock-departure-messages";
import { receiptMessages } from "./stock-receipt-messages";
import { ReceiptSelect, StockReceiptForm } from "./stock-receipt-form";
import {
  newReceiptDraft,
  receiptDraftDirty,
  selectReceiptProduct,
  selectReceiptUnit,
  type ReceiptDraft,
  type ReceiptLocation,
  type ReceiptProduct,
} from "./stock-receipt-model";
import {
  journeyAreas,
  type JourneyMovementKind,
  type OwnerJourneyData,
} from "./owner-journey-model";
import { ownerJourneyMessages } from "./owner-journey-messages";

export type JourneyPanel =
  | { kind: "hierarchy"; editor: Editor }
  | { kind: "stock"; area: AreaSetup }
  | { kind: "channel" | "enable" | "product" }
  | { kind: JourneyMovementKind; product?: ReceiptProduct };

type Confirmation =
  | { kind: "discard" }
  | { kind: "product"; product: ReceiptProduct }
  | { kind: "unit"; unit: CreationUnitId };

type PanelProps = {
  panel: JourneyPanel;
  data: OwnerJourneyData;
  locale: Locale;
  locations: ReceiptLocation[];
  close: () => void;
  saveHierarchy: (value: HierarchyChange) => boolean;
  saveSetup: (command: SetupCommand) => boolean;
  saveProduct: (draft: CreationDraft) => boolean;
  saveMovement: (
    draft: ReceiptDraft,
    kind: JourneyMovementKind,
    channel: string,
  ) => boolean;
};

export function OwnerJourneyPanel({
  panel,
  data,
  locale,
  locations,
  close,
  saveHierarchy,
  saveSetup,
  saveProduct,
  saveMovement,
}: PanelProps) {
  const t = ownerJourneyMessages[locale];
  const core = coreHierarchyMessages[locale];
  const setup = inventorySetupMessages[locale];
  const productCopy = creationMessages[locale];
  const departureCopy = stockDepartureMessages(locale);
  const movementCopy =
    panel.kind === "departure" ? departureCopy : receiptMessages[locale];
  const channelId = useId();
  const startingProduct = "product" in panel ? panel.product : undefined;
  const [productDraft, setProductDraft] = useState(newCreationDraft);
  const [movementDraft, setMovementDraft] = useState(() =>
    newReceiptDraft(startingProduct),
  );
  const [channel, setChannel] = useState("");
  const [channelInvalid, setChannelInvalid] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [refused, setRefused] = useState(false);
  const isMovement = panel.kind === "receipt" || panel.kind === "departure";

  function accept(result: boolean) {
    if (result) close();
    else setRefused(true);
  }

  function requestClose() {
    const dirty =
      (panel.kind === "product" && creationDraftDirty(productDraft)) ||
      (isMovement &&
        (receiptDraftDirty(movementDraft, startingProduct) || channel));
    if (dirty) setConfirmation({ kind: "discard" });
    else close();
  }

  function proposeChange(change: Exclude<Confirmation, { kind: "discard" }>) {
    if (movementDraft.quantity) {
      setConfirmation(change);
      return;
    }
    applyChange(change);
  }

  function applyChange(change: Exclude<Confirmation, { kind: "discard" }>) {
    setMovementDraft((current) =>
      change.kind === "product"
        ? selectReceiptProduct(current, change.product)
        : selectReceiptUnit(current, change.unit),
    );
    setConfirmation(null);
  }

  let title: string;
  let content;
  switch (panel.kind) {
    case "hierarchy":
      title = panel.editor.kind === "create-area" ? core.newArea : core.newSite;
      content = (
        <HierarchyEditor
          editor={panel.editor}
          t={core}
          sequence={
            data.sites.length +
            data.sites.reduce((total, site) => total + site.areas.length, 0) +
            1
          }
          onSave={(next) => accept(saveHierarchy(next))}
          onCancel={close}
        />
      );
      break;
    case "stock":
      title = t.stockSetup;
      content = (
        <CalendarForm
          area={panel.area}
          copy={setup}
          submit={(command) => accept(saveSetup(command))}
          close={close}
        />
      );
      break;
    case "channel":
      title = t.createChannel;
      content = (
        <ChannelForm
          copy={setup}
          submit={(command) => accept(saveSetup(command))}
          close={close}
        />
      );
      break;
    case "enable":
      title = t.enableChannel;
      content = (
        <EnableForm
          copy={setup}
          areas={journeyAreas(data)}
          channels={data.channels}
          submit={(command) => accept(saveSetup(command))}
          close={close}
          prepared={false}
        />
      );
      break;
    case "product":
      title = t.createProduct;
      content = (
        <ProductsCreationForm
          copy={productCopy}
          draft={productDraft}
          onChange={setProductDraft}
          onSubmit={() => accept(saveProduct(productDraft))}
          onCancel={requestClose}
        />
      );
      break;
    case "receipt":
    case "departure": {
      const kind = panel.kind;
      title = movementCopy.title;
      const origin = Object.values(data.stock).find(
        ({ id }) => id === movementDraft.locationId,
      );
      const enabled = data.channels.filter(({ id }) =>
        origin?.enabledChannelIds.includes(id),
      );
      content = (
        <StockReceiptForm
          copy={movementCopy}
          draft={movementDraft}
          products={data.products}
          locations={locations}
          afterLocation={
            kind === "departure" && (
              <div className="space-y-1">
                <label htmlFor={channelId} className="text-sm font-medium">
                  {departureCopy.channel}
                </label>
                <ReceiptSelect
                  id={channelId}
                  value={channel}
                  onChange={(event) => {
                    setChannel(event.target.value);
                    setChannelInvalid(false);
                  }}
                  disabled={!enabled.length}
                  aria-invalid={channelInvalid || undefined}
                >
                  <option value="">{departureCopy.selectChannel}</option>
                  {enabled.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </ReceiptSelect>
                {origin && !enabled.length && <p>{departureCopy.noChannels}</p>}
                {channelInvalid && enabled.length > 0 && (
                  <p role="alert">{departureCopy.selectChannel}</p>
                )}
              </div>
            )
          }
          onChange={(next) => {
            if (next.locationId !== movementDraft.locationId) {
              setChannel("");
              setChannelInvalid(false);
            }
            setMovementDraft(next);
          }}
          onProductChange={(product) => {
            if (product.id !== movementDraft.product?.id)
              proposeChange({ kind: "product", product });
          }}
          onUnitChange={(unit) => {
            if (unit !== movementDraft.unit)
              proposeChange({ kind: "unit", unit });
          }}
          onSubmit={() => {
            if (
              kind === "departure" &&
              !enabled.some(({ id }) => id === channel)
            ) {
              setChannelInvalid(true);
              document.getElementById(channelId)?.focus();
            } else accept(saveMovement(movementDraft, kind, channel));
          }}
          onCancel={requestClose}
        />
      );
      break;
    }
  }

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
      >
        <SheetContent
          closeLabel={movementCopy.close}
          className="w-full max-w-none gap-3 overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">{title}</SheetDescription>
          </SheetHeader>
          <div
            data-owner-journey-panel={panel.kind}
            className="space-y-3 px-5 pb-6 text-sm"
          >
            {refused && (
              <p role="alert" className="text-error-700 dark:text-error-300">
                {t.refused}
              </p>
            )}
            {content}
          </div>
        </SheetContent>
      </Sheet>
      <Dialog
        open={!!confirmation}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
      >
        <DialogContent closeLabel={movementCopy.close}>
          <DialogHeader>
            <DialogTitle>
              {confirmation?.kind === "discard"
                ? movementCopy.discardTitle
                : confirmation?.kind === "product"
                  ? movementCopy.changeProductTitle
                  : movementCopy.changeUnitTitle}
            </DialogTitle>
            <DialogDescription>
              {confirmation?.kind === "discard"
                ? movementCopy.discardText
                : movementCopy.changeClearsAmount}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmation(null)}>
              {confirmation?.kind === "discard"
                ? movementCopy.keepEditing
                : movementCopy.cancel}
            </Button>
            <Button
              variant={
                confirmation?.kind === "discard" ? "destructive" : "default"
              }
              onClick={() => {
                if (confirmation?.kind === "discard") close();
                else if (confirmation) applyChange(confirmation);
              }}
            >
              {confirmation?.kind === "discard"
                ? movementCopy.discard
                : movementCopy.confirmChange}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
