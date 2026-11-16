import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "@/icons";
import {
  ProductsTableWorkspace,
  type ProductRowStatus,
} from "./products-table-preview";
import { previewProducts, type PreviewProduct } from "./products-table-model";
import { useProductEditing, type ProductEditing } from "./products-editing";
import {
  editingDefaults,
  type EditingResults,
  type ProductChange,
} from "./products-editing-model";
import {
  advanceRecovery,
  createDraftRecord,
  createRecoveryRecord,
  formerEditorReadOnly,
  receiveRecoveryResult,
  requestDraftEdit,
  resolveDraft,
  reviewDraft,
  startRecoveryRun,
  validateSubmission,
  type DraftRecord,
  type RecoveryRecord,
} from "./products-recovery-model";

export type RecoveryFixture =
  | "exhausted"
  | "long-name"
  | "automatic"
  | "restored"
  | "memory"
  | "localstorage"
  | "history"
  | "storage-failure"
  | "elsewhere"
  | "uncoordinated"
  | "active"
  | "unreachable"
  | "draft"
  | "changed"
  | "current-unavailable"
  | "former";
const previewClock = { now: () => Date.now() };
const draftFixtures = new Set<RecoveryFixture>([
  "active",
  "unreachable",
  "draft",
  "changed",
  "current-unavailable",
  "former",
]);
function command(
  productId: string,
  operationId: string,
  content: { name?: string; sku?: string },
) {
  return {
    identity: {
      businessId: "sample-business",
      userId: "sample-merchant",
      origin: "storybook",
      operationId,
    },
    productId,
    content,
  };
}
function recoveryFixture(fixture: RecoveryFixture): RecoveryRecord[] {
  if (draftFixtures.has(fixture) || fixture === "history") return [];
  let record = createRecoveryRecord(
    command("product-1", "original-fixture-command", {
      name: "Café de especialidad",
    }),
    {
      mode:
        fixture === "memory"
          ? "memory"
          : fixture === "localstorage"
            ? "localstorage"
            : "indexeddb",
      restored: fixture === "restored",
      historyAccessible: true,
      retentionProblem: fixture === "storage-failure",
      knownOtherRun: fixture === "elsewhere",
      coordination: fixture === "uncoordinated" ? "unavailable" : "available",
    },
  );
  if (fixture === "automatic")
    return [startRecoveryRun(record, previewClock.now())];
  if (["restored", "elsewhere"].includes(fixture)) return [record];
  record = startRecoveryRun(record, 0);
  if (fixture === "storage-failure")
    return [receiveRecoveryResult(record, "confirmed", 1)];
  return [advanceRecovery(record, 60_000, () => 0.5)];
}
function draftFixture(
  fixture: RecoveryFixture,
  product: PreviewProduct,
): DraftRecord | null {
  if (!draftFixtures.has(fixture)) return null;
  let draft = createDraftRecord(
    product,
    { ...editingDefaults([product])[product.id], name: "Café de especialidad" },
    {
      owner:
        fixture === "active"
          ? "active"
          : fixture === "draft"
            ? "none"
            : "unreachable",
      comparison:
        fixture === "changed"
          ? "changed"
          : fixture === "current-unavailable"
            ? "unavailable"
            : "unchanged",
      ...(fixture === "changed"
        ? {
            current: {
              ...editingDefaults([product])[product.id],
              name: "Café actualizado",
            },
          }
        : {}),
    },
  );
  if (fixture === "former") draft = resolveDraft(draft, "assume");
  return draft;
}
function outcomes(
  change: ProductChange,
  result: "confirmed" | "unconfirmed",
): EditingResults {
  return {
    [change.id]: {
      ...(change.name !== undefined ? { name: result } : {}),
      ...(change.sku !== undefined ? { sku: result } : {}),
    },
  };
}

export function ProductsRecoveryPreview({
  fixture,
}: {
  fixture: RecoveryFixture;
}) {
  const t = useTranslations("catalogue");
  const initial = useMemo(() => {
    const products = previewProducts();
    if (fixture === "long-name")
      products[0] = {
        ...products[0],
        name: "Café molido de especialidad de origen único con tueste natural",
      };
    return products;
  }, [fixture]);
  const [recoveries, setRecoveries] = useState(() => recoveryFixture(fixture));
  const [draft, setDraft] = useState(() => draftFixture(fixture, initial[0]));
  const [dialog, setDialog] = useState<"owner" | "discard" | "review" | null>(
    null,
  );
  const [details, setDetails] = useState(true);
  const sequence = useRef(0);
  const previewRoot = useRef<HTMLDivElement>(null);
  const manualRecovery = useRef<{
    operationId: string;
    trigger: HTMLButtonElement;
    retainFocus: boolean;
  } | null>(null);
  useEffect(() => {
    const moved = (event: FocusEvent) => {
      if (
        manualRecovery.current &&
        event.target !== document.body &&
        event.target !== manualRecovery.current.trigger
      )
        manualRecovery.current.retainFocus = false;
    };
    document.addEventListener("focusin", moved);
    return () => document.removeEventListener("focusin", moved);
  }, []);
  useEffect(() => {
    const manual = manualRecovery.current;
    if (!manual) return;
    const record = recoveries.find(
      (item) => item.command.identity.operationId === manual.operationId,
    );
    if (!record || record.outcome === "unconfirmed") return;
    if (
      manual.retainFocus &&
      (document.activeElement === manual.trigger ||
        document.activeElement === document.body)
    ) {
      previewRoot.current
        ?.querySelector<HTMLSpanElement>(
          `[data-recovery-status="${CSS.escape(manual.operationId)}"]`,
        )
        ?.focus({ preventScroll: true });
    }
    manualRecovery.current = null;
  }, [recoveries]);
  const former = fixture === "former" && !!draft && formerEditorReadOnly(draft);
  const pending = recoveries.filter(
    (record) => record.outcome === "unconfirmed",
  );
  const isReadOnly = (id: string) =>
    pending.some((record) => record.productId === id) ||
    (draft?.productId === id &&
      (former ||
        !draft.accessible ||
        draft.blockedBySubmission ||
        draft.status !== "editing" ||
        draft.owner !== "current"));
  const editor: ProductEditing = useProductEditing(initial, "confirmed", {
    isReadOnly,
    hasUnconfirmed: pending.length > 0,
    beforeBegin: (mode) => {
      if (mode.type !== "panel" || mode.id !== draft?.productId) return true;
      if (former) return false;
      if (
        (!draft.accessible || draft.status === "discarded") &&
        draft.owner !== "active"
      ) {
        setDialog("review");
        return false;
      }
      const result = requestDraftEdit(draft);
      if (result.reason || draft.status === "retained") {
        setDialog("owner");
        return false;
      }
      return true;
    },
    submit: (requested, rows) => {
      const checked = validateSubmission(editor.records, rows, recoveries);
      if (Object.keys(checked.errors).length) return {};
      const next: RecoveryRecord[] = [];
      let results: EditingResults = {};
      for (const change of requested) {
        if (!checked.changes.some((eligible) => eligible.id === change.id))
          continue;
        const content = {
          ...(change.name !== undefined ? { name: change.name } : {}),
          ...(change.sku !== undefined ? { sku: change.sku } : {}),
        };
        let record = startRecoveryRun(
          createRecoveryRecord(
            command(
              change.id,
              `new-fixture-command-${++sequence.current}`,
              content,
            ),
          ),
          previewClock.now(),
        );
        record = receiveRecoveryResult(record, "confirmed", previewClock.now());
        next.push(record);
        results = { ...results, ...outcomes(change, "confirmed") };
      }
      setRecoveries((previous) => [...previous, ...next]);
      return results;
    },
  });
  const { form, applyExternalResults } = editor;
  // Initial pending values are retained command content, not fresh editable input.
  useEffect(() => {
    for (const record of recoveryFixture(fixture)) {
      if (record.outcome === "confirmed") {
        const change = { id: record.productId, ...record.command.content };
        applyExternalResults([change], outcomes(change, "confirmed"));
      } else if (record.command.content.name)
        form.setValue(
          `rows.${record.productId}.name`,
          record.command.content.name,
        );
    }
  }, [fixture, form, applyExternalResults]);
  useEffect(() => {
    const active = recoveries.filter(
      (record) => record.phase === "request" || record.phase === "waiting",
    );
    if (!active.length) return;
    const now = previewClock.now();
    const completionAt = (record: RecoveryRecord) =>
      record.phase === "request" &&
      (fixture !== "automatic" || record.attempt > 1 || record.run > 1)
        ? record.requests.at(-1)!.startedAt + 250
        : Infinity;
    const at = Math.min(
      ...active.map((record) =>
        Math.min(record.nextAt ?? Infinity, completionAt(record)),
      ),
    );
    const timer = setTimeout(
      () => {
        const now = previewClock.now();
        const next = recoveries.map((record) => {
          let updated = record;
          if (record.phase === "request" && completionAt(record) <= now)
            updated = receiveRecoveryResult(record, "confirmed", now);
          else updated = advanceRecovery(record, now, () => 0.5);
          if (
            record.outcome === "unconfirmed" &&
            updated.outcome === "confirmed"
          ) {
            const change = { id: record.productId, ...record.command.content };
            editor.applyExternalResults(
              [change],
              outcomes(change, "confirmed"),
            );
          }
          return updated;
        });
        setRecoveries(next);
      },
      Math.max(1, at - now),
    );
    return () => clearTimeout(timer);
  }, [recoveries, fixture, editor]);

  function continueResolved(next: DraftRecord) {
    setDraft(next);
    if (next.status === "editing") {
      setDialog(null);
      editor.continueDraft(next.productId, next.draft, next.current.name);
    } else setDialog("review");
  }
  function resolve(action: "assume" | "discard") {
    if (
      !draft ||
      pending.some((record) => record.productId === draft.productId)
    )
      return;
    setDialog(null);
    editor.requestTransition(() =>
      continueResolved(resolveDraft(draft, action, action === "discard")),
    );
  }
  function retry(record: RecoveryRecord, trigger: HTMLButtonElement) {
    const next = startRecoveryRun(record, previewClock.now());
    if (next !== record)
      manualRecovery.current = {
        operationId: record.command.identity.operationId,
        trigger,
        retainFocus: document.activeElement === trigger,
      };
    setRecoveries((previous) =>
      previous.map((item) => (item === record ? next : item)),
    );
  }
  function recoveryAction(record: RecoveryRecord) {
    const active = record.phase === "request" || record.phase === "waiting";
    if (record.outcome !== "unconfirmed" || !record.historyAccessible)
      return null;
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={
          active ||
          (record.knownOtherRun && record.coordination === "available")
        }
        onClick={(event) => retry(record, event.currentTarget)}
      >
        {t(record.restored ? "prResumeRecovery" : "prRetry")}
      </Button>
    );
  }
  function recoveryLabel(record: RecoveryRecord) {
    return t(
      record.outcome === "confirmed"
        ? "prConfirmed"
        : record.outcome === "rejected"
          ? "prRejected"
          : record.phase === "request" || record.phase === "waiting"
            ? "prRecoveringLabel"
            : "prUnconfirmedLabel",
    );
  }
  const hasActiveRecovery = pending.some(
    (record) => record.phase === "request" || record.phase === "waiting",
  );
  const historyUnavailable = fixture === "history";
  const showDraftNotice =
    draft &&
    (former ||
      draft.status !== "editing" ||
      editor.changes.some((change) => change.id === draft.productId));
  const summary = (recoveries.length > 0 ||
    historyUnavailable ||
    showDraftNotice) && (
    <section
      className="products-recovery-summary"
      data-recovery-summary
      aria-label={t("prRecoveryTitle")}
    >
      {recoveries.length > 0 && (
        <>
          <div className="products-recovery-summary-heading">
            <strong>
              {t(
                pending.length
                  ? hasActiveRecovery
                    ? "prRecovering"
                    : "prUnconfirmed"
                  : recoveries.some((record) => record.outcome === "rejected")
                    ? "prRejected"
                    : "prConfirmed",
              )}
            </strong>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={t(details ? "peDismissResults" : "peShowResults")}
              onClick={() => setDetails(!details)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          {details ? (
            <div className="products-recovery-details">
              {recoveries.map((record) => (
                <div
                  className="products-recovery-line"
                  key={record.command.identity.operationId}
                >
                  <div>
                    <span className="font-medium">
                      {
                        editor.records.find(
                          (product) => product.id === record.productId,
                        )?.name
                      }
                    </span>
                    <span
                      className="products-recovery-state"
                      data-outcome={record.outcome}
                      data-recovery-status={record.command.identity.operationId}
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      tabIndex={-1}
                    >
                      <span className="sr-only">
                        {
                          editor.records.find(
                            (product) => product.id === record.productId,
                          )?.name
                        }
                        :{" "}
                      </span>
                      {recoveryLabel(record)}
                    </span>
                  </div>
                  {recoveryAction(record)}
                </div>
              ))}
              {pending.length > 0 && (
                <p className="products-muted">
                  {t(
                    hasActiveRecovery
                      ? "prRecoveryHint"
                      : "prOtherWorkAvailable",
                  )}
                </p>
              )}
            </div>
          ) : (
            <Button size="sm" variant="link" onClick={() => setDetails(true)}>
              {t("peShowResults")}
            </Button>
          )}
        </>
      )}
      {(historyUnavailable ||
        recoveries.some((record) => !record.historyAccessible)) && (
        <p role="status" data-recovery-history>
          {t("prHistoryUnavailable")}
        </p>
      )}
      {recoveries.some((record) => record.retentionProblem) && (
        <p role="status" data-recovery-retention>
          {t("prStorageProblem")}
        </p>
      )}
      {recoveries.some((record) => record.mode === "memory") && (
        <p role="status" data-recovery-retention>
          {t("prStorageMemory")}
        </p>
      )}
      {recoveries.some((record) => record.mode === "localstorage") && (
        <p role="status" data-recovery-retention>
          {t("prStoragePersistent")}
        </p>
      )}
      {recoveries.some((record) => record.knownOtherRun) && (
        <p role="status">{t("prRecoveryElsewhere")}</p>
      )}
      {recoveries.some((record) => record.coordination === "unavailable") && (
        <p role="status">{t("prCoordinationUnavailable")}</p>
      )}
      {draft && showDraftNotice && (
        <div className="products-recovery-line">
          <p>
            {t(
              draft.status === "discarded"
                ? "prDiscardedCurrentUnavailable"
                : former
                  ? "prFormerReadOnly"
                  : draft.owner === "active"
                    ? "prOwnerActive"
                    : draft.owner === "unreachable"
                      ? "prOwnerUnknown"
                      : "prDraftAvailable",
            )}
          </p>
          {!former &&
            draft.accessible &&
            draft.status !== "discarded" &&
            draft.status !== "editing" && (
              <Button
                size="sm"
                variant="outline"
                data-recovery-owner-action={draft.productId}
                onClick={() => setDialog("owner")}
              >
                {t(
                  draft.owner === "none"
                    ? "prContinueDraft"
                    : "prOpenResolution",
                )}
              </Button>
            )}
        </div>
      )}
    </section>
  );
  const status = (product: PreviewProduct): ProductRowStatus | undefined => {
    const record = recoveries.findLast((item) => item.productId === product.id);
    if (record?.outcome === "unconfirmed") {
      const active = record.phase === "request" || record.phase === "waiting";
      return {
        kind: active ? "checking" : "unconfirmed",
        description: t(active ? "prRecovering" : "prUnconfirmed"),
      };
    }
    if (draft?.productId === product.id && isReadOnly(product.id))
      return {
        kind: "locked",
        description: t(
          former
            ? "prFormerReadOnly"
            : draft.status === "discarded"
              ? "prDiscardedCurrentUnavailable"
              : !draft.accessible
                ? "prHistoryUnavailable"
                : draft.comparison === "unavailable"
                  ? "prCurrentUnavailable"
                  : draft.status === "review"
                    ? "prReviewBody"
                    : draft.owner === "active"
                      ? "prOwnerActive"
                      : draft.owner === "unreachable"
                        ? "prOwnerUnknown"
                        : "prDraftAvailable",
        ),
      };
    return undefined;
  };
  return (
    <div
      ref={previewRoot}
      data-recovery-preview
      data-request-count={recoveries.reduce(
        (total, record) => total + record.requests.length,
        0,
      )}
    >
      <ProductsTableWorkspace
        initialStock={false}
        initialDensity="compact"
        hiddenColumns={false}
        locationCount="several"
        archivedFixture={false}
        editor={editor}
        summary={summary}
        productStatus={status}
        viewKey={`irin-recovery-preview:${fixture}`}
      />
      <Dialog
        open={dialog === "owner"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent
          data-recovery-owner-dialog
          className="products-recovery-dialog"
        >
          <DialogHeader>
            <DialogTitle>{t("prOwnerTitle")}</DialogTitle>
            <DialogDescription>
              {t(
                draft?.status === "discarded"
                  ? "prDiscardedCurrentUnavailable"
                  : !draft?.accessible
                    ? "prHistoryUnavailable"
                    : draft?.owner === "active"
                      ? "prOwnerActive"
                      : draft?.owner === "unreachable"
                        ? "prOwnerUnknown"
                        : "prDraftAvailable",
              )}
            </DialogDescription>
          </DialogHeader>
          <p className="products-recovery-product-name">{initial[0].name}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              {t("gridCancel")}
            </Button>
            {draft?.accessible &&
              draft.status !== "discarded" &&
              draft.owner !== "active" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setDialog("discard")}
                  >
                    {t("prDiscardStart")}
                  </Button>
                  <Button onClick={() => resolve("assume")}>
                    {t(
                      draft?.owner === "none" ? "prContinueDraft" : "prAssume",
                    )}
                  </Button>
                </>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialog === "discard"}
        onOpenChange={(open) => {
          if (!open) setDialog("owner");
        }}
      >
        <DialogContent
          data-recovery-discard-dialog
          className="products-recovery-dialog"
        >
          <DialogHeader>
            <DialogTitle>{t("prDiscardTitle")}</DialogTitle>
            <DialogDescription>{t("prDiscardBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog("owner")}>
              {t("gridCancel")}
            </Button>
            <Button variant="destructive" onClick={() => resolve("discard")}>
              {t("prConfirmDiscard")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialog === "review"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent
          data-recovery-review-dialog
          className="products-recovery-dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {t(
                !draft?.accessible || draft?.comparison === "unavailable"
                  ? "prCurrent"
                  : "prReviewTitle",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                draft?.status === "discarded"
                  ? "prDiscardedCurrentUnavailable"
                  : draft?.comparison === "unavailable"
                    ? "prCurrentUnavailable"
                    : "prReviewBody",
              )}
            </DialogDescription>
          </DialogHeader>
          {draft?.comparison !== "unavailable" && draft?.accessible && (
            <dl className="products-recovery-comparison">
              <div>
                <dt>{t("prCurrent")}</dt>
                <dd>{draft?.current.name}</dd>
              </div>
              <div>
                <dt>{t("prDraft")}</dt>
                <dd>{draft?.draft.name}</dd>
              </div>
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              {t("gridCancel")}
            </Button>
            {draft?.status === "review" && (
              <Button
                onClick={() => draft && continueResolved(reviewDraft(draft))}
              >
                {t("prAcceptReview")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
