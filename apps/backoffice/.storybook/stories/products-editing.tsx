import { useCallback, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PreviewProduct } from "./products-table-model";
import { ProductsFeedback } from "./products-feedback";
import {
  applyEditingResults,
  changedProducts,
  editingDefaults,
  editorSchema,
  type EditorForm,
  type EditingResults,
  type EditingRows,
  type EditingDraft,
  type ProductChange,
} from "./products-editing-model";

export type SaveFixture = "confirmed" | "mixed" | "unconfirmed";
export type EditorMode =
  { type: "table" } | { type: "panel"; id: string } | null;
export type EditingPreviewExtension = {
  isReadOnly: (id: string) => boolean;
  hasUnconfirmed: boolean;
  beforeBegin: (mode: Exclude<EditorMode, null>) => boolean;
  submit: (
    changes: ProductChange[],
    rows: EditingRows,
  ) => EditingResults | Promise<EditingResults>;
};

export function useProductEditing(
  initial: PreviewProduct[],
  fixture: SaveFixture,
  extension?: EditingPreviewExtension,
) {
  const [records, setRecords] = useState(initial);
  const confirmedRecords = useRef(initial);
  const unresolved = useRef(false);
  const [mode, setMode] = useState<EditorMode>(null);
  const [panelId, inspect] = useState<string | null>(null);
  const [results, setResults] = useState<EditingResults>({});
  const [submitted, setSubmitted] = useState<ProductChange[]>([]);
  const [sending, setSending] = useState(false);
  const [pendingExit, setPendingExit] = useState<(() => void) | null>(null);
  const form = useForm<EditorForm>({
    defaultValues: { rows: editingDefaults(initial) },
    resolver: zodResolver(editorSchema),
    reValidateMode: "onChange",
  });
  const watched = useWatch({ control: form.control });
  const rows = (watched.rows ?? form.getValues("rows")) as EditingRows;
  const hasUnconfirmed =
    !!extension?.hasUnconfirmed ||
    Object.values(results).some((fields) =>
      Object.values(fields).includes("unconfirmed"),
    );
  const isReadOnly = (id: string) =>
    extension ? extension.isReadOnly(id) : hasUnconfirmed;
  const eligible = (changes: ProductChange[]) =>
    extension ? changes.filter((change) => !isReadOnly(change.id)) : changes;
  const changes = eligible(changedProducts(records, rows));
  function resetDrafts() {
    const next = editingDefaults(confirmedRecords.current);
    if (extension)
      for (const product of records) {
        if (isReadOnly(product.id))
          next[product.id] = form.getValues(`rows.${product.id}`);
      }
    form.reset({ rows: next });
    if (!unresolved.current && !extension?.hasUnconfirmed) {
      setResults({});
      setSubmitted([]);
    }
  }
  function requestLeave(action: () => void) {
    if (changes.length || sending || (extension && hasUnconfirmed && mode))
      setPendingExit(() => action);
    else action();
  }
  function begin(next: Exclude<EditorMode, null>) {
    if (extension && !extension.beforeBegin(next)) return;
    requestLeave(() => {
      resetDrafts();
      setMode(next);
      inspect(next.type === "panel" ? next.id : null);
    });
  }
  function exit(after = () => {}) {
    requestLeave(() => {
      resetDrafts();
      setMode(null);
      after();
    });
  }
  const applyExternalResults = useCallback(
    (requested: ProductChange[], outcomes: EditingResults) => {
      const next = applyEditingResults(
        confirmedRecords.current,
        form.getValues("rows"),
        requested,
        outcomes,
      );
      confirmedRecords.current = next.records;
      setRecords(next.records);
      form.reset({ rows: next.rows }, { keepErrors: true });
      setResults((previous) => {
        const combined = { ...previous };
        for (const [id, fields] of Object.entries(outcomes))
          combined[id] = { ...combined[id], ...fields };
        unresolved.current = Object.values(combined).some((fields) =>
          Object.values(fields).includes("unconfirmed"),
        );
        return combined;
      });
      setSubmitted((previous) => [
        ...previous.filter(
          (change) =>
            !requested.some((nextChange) => nextChange.id === change.id),
        ),
        ...requested,
      ]);
    },
    [form],
  );
  // Used only after explicit resolution of a synthetic retained draft.
  function continueDraft(
    id: string,
    draft: EditingDraft,
    currentName?: string,
  ) {
    if (currentName !== undefined) {
      const next = confirmedRecords.current.map((product) =>
        product.id === id ? { ...product, name: currentName } : product,
      );
      confirmedRecords.current = next;
      setRecords(next);
    }
    form.setValue(`rows.${id}`, { ...draft });
    setMode({ type: "panel", id });
    inspect(id);
  }
  async function save(after?: () => void) {
    if (sending || (!extension && hasUnconfirmed)) return;
    await form.handleSubmit(
      async (values) => {
        const requested = eligible(
          changedProducts(confirmedRecords.current, values.rows),
        );
        if (!requested.length) {
          if (!hasUnconfirmed) {
            setPendingExit(null);
            after?.();
          }
          return;
        }
        setSending(true);
        let outcomes: EditingResults;
        if (extension)
          outcomes = await extension.submit(requested, values.rows);
        else {
          // Deliberately simulated latency/outcomes; no request is sent anywhere.
          await new Promise((resolve) => setTimeout(resolve, 250));
          outcomes = {};
          let operation = 0;
          for (const change of requested) {
            outcomes[change.id] = {};
            for (const field of ["name", "sku"] as const) {
              if (change[field] === undefined) continue;
              outcomes[change.id][field] =
                fixture === "unconfirmed"
                  ? "unconfirmed"
                  : fixture === "mixed" && operation > 0
                    ? "failed"
                    : "confirmed";
              operation++;
            }
          }
        }
        const next = applyEditingResults(
          confirmedRecords.current,
          values.rows,
          requested,
          outcomes,
        );
        if (extension) applyExternalResults(requested, outcomes);
        else {
          confirmedRecords.current = next.records;
          unresolved.current = Object.values(outcomes).some((fields) =>
            Object.values(fields).includes("unconfirmed"),
          );
          setRecords(next.records);
          form.reset({ rows: next.rows });
          setResults(outcomes);
          setSubmitted(requested);
        }
        setSending(false);
        const allConfirmed = Object.values(outcomes).every((fields) =>
          Object.values(fields).every((outcome) => outcome === "confirmed"),
        );
        if (
          !eligible(changedProducts(next.records, next.rows)).length &&
          allConfirmed &&
          (!extension || !hasUnconfirmed)
        ) {
          setPendingExit(null);
          after?.();
        }
      },
      (errors) => {
        setPendingExit(null);
        inspect(mode?.type === "panel" ? mode.id : null);
        const id = Object.keys(errors.rows ?? {})[0];
        const field = errors.rows?.[id]?.name ? "name" : "sku";
        if (id)
          requestAnimationFrame(() => form.setFocus(`rows.${id}.${field}`));
      },
    )();
  }
  function assignSku(id: string, requested: boolean) {
    if (isReadOnly(id)) return;
    form.setValue(`rows.${id}.assignSku`, requested);
    if (!requested) {
      form.setValue(`rows.${id}.sku`, "");
      form.clearErrors(`rows.${id}.sku`);
    }
  }
  return {
    records,
    panelId,
    inspect,
    rows,
    form,
    mode,
    results,
    submitted,
    changes,
    sending,
    hasUnconfirmed,
    pendingExit,
    begin,
    exit,
    save,
    assignSku,
    isReadOnly,
    saveBlocked: !extension && hasUnconfirmed,
    entryBlocked: !extension && hasUnconfirmed,
    applyExternalResults,
    continueDraft,
    requestTransition: requestLeave,
    keepEditing: () => setPendingExit(null),
    discard: () => {
      const action = pendingExit;
      setPendingExit(null);
      resetDrafts();
      action?.();
    },
  };
}
export type ProductEditing = ReturnType<typeof useProductEditing>;

const errors = {
  name: {
    blank: "peNameBlank",
    tooLong: "peNameTooLong",
    invalid: "peNameInvalid",
  },
  sku: {
    blank: "peSkuBlank",
    tooLong: "peSkuTooLong",
    invalid: "peSkuInvalid",
  },
} as const;

export function EditingField({
  editor,
  product,
  field,
}: {
  editor: ProductEditing;
  product: PreviewProduct;
  field: "name" | "sku";
}) {
  const t = useTranslations("catalogue");
  const error =
    editor.form.formState.errors.rows?.[product.id]?.[field]?.message;
  const reason =
    error === "blank" || error === "tooLong" || error === "invalid"
      ? error
      : null;
  const errorId = `edit-error-${product.id}-${field}`;
  return (
    <div className="products-edit-field">
      <Textarea
        {...editor.form.register(`rows.${product.id}.${field}`)}
        rows={1}
        wrap="off"
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        className="products-edit-input"
        aria-label={t(field === "name" ? "peNameFor" : "peSkuFor", {
          product: product.name,
          code: product.sku ?? product.id,
        })}
        aria-invalid={!!reason}
        aria-describedby={reason ? errorId : undefined}
        disabled={editor.sending}
        readOnly={editor.isReadOnly(product.id)}
        data-edit-name={field === "name" ? product.id : undefined}
        data-edit-sku={field === "sku" ? product.id : undefined}
      />
      {reason && (
        <p
          id={errorId}
          data-edit-error={`${product.id}-${field}`}
          className="products-edit-error"
        >
          {t(errors[field][reason])}
        </p>
      )}
    </div>
  );
}

export function EditingSku({
  editor,
  product,
}: {
  editor: ProductEditing;
  product: PreviewProduct;
}) {
  const t = useTranslations("catalogue");
  if (product.sku !== null)
    return <span className="products-exact-code">{product.sku}</span>;
  return editor.rows[product.id]?.assignSku ? (
    <div className="products-sku-assignment">
      <EditingField editor={editor} product={product} field="sku" />
      <Button
        size="sm"
        variant="ghost"
        disabled={editor.sending || editor.isReadOnly(product.id)}
        onClick={() => editor.assignSku(product.id, false)}
      >
        {t("peCancelAssignment")}
      </Button>
    </div>
  ) : (
    <Button
      size="sm"
      variant="outline"
      disabled={editor.sending || editor.isReadOnly(product.id)}
      onClick={() => editor.assignSku(product.id, true)}
    >
      {t("peAssignSku")}
    </Button>
  );
}

export function EditingResultsView({
  editor,
  productId,
}: {
  editor: ProductEditing;
  productId?: string;
}) {
  const t = useTranslations("catalogue");
  const container = useRef<HTMLElement>(null);
  const [dismissed, setDismissed] = useState<{
    snapshot: ProductChange[];
    scope: string | undefined;
  } | null>(null);
  const submitted = editor.submitted.filter(
    (change) => !productId || change.id === productId,
  );
  if (!Object.keys(editor.results).length || !submitted.length) return null;
  const outcomes = submitted.flatMap((change) =>
    Object.values(editor.results[change.id] ?? {}),
  );
  if (!outcomes.length) return null;
  const summaryKey = outcomes.includes("unconfirmed")
    ? "peResultsUnconfirmed"
    : outcomes.includes("failed")
      ? outcomes.includes("confirmed")
        ? "peResultsPartial"
        : "peFailed"
      : "peSaved";
  const collapsed =
    dismissed !== null &&
    dismissed.snapshot === editor.submitted &&
    dismissed.scope === productId;
  function focusReplacement(selector: string) {
    const previous = document.activeElement;
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (
        active === document.body ||
        active === previous ||
        !active?.isConnected
      )
        container.current?.querySelector<HTMLButtonElement>(selector)?.focus();
    });
  }
  return (
    <ProductsFeedback
      ref={container}
      className={
        collapsed ? "products-edit-results-collapsed" : "products-edit-results"
      }
      data-edit-results={collapsed ? undefined : true}
      data-edit-results-collapsed={collapsed ? true : undefined}
      label={t("peLastResults")}
      summary={
        collapsed
          ? t("peResultsSummary", { status: t(summaryKey) })
          : t(summaryKey)
      }
      expanded={!collapsed}
      onExpandedChange={(expanded) => {
        setDismissed(
          expanded ? null : { snapshot: editor.submitted, scope: productId },
        );
        focusReplacement(
          expanded ? "[data-edit-dismiss-results]" : "[data-edit-show-results]",
        );
      }}
      detailsLabel={t("gridDetails")}
      expandLabel={t("peShowResults")}
      collapseLabel={t("peDismissResults")}
      disabled={editor.sending}
      tone={
        summaryKey === "peSaved"
          ? "success"
          : summaryKey === "peFailed"
            ? "error"
            : summaryKey === "peResultsPartial"
              ? "warning"
              : "info"
      }
      toggleAttributes={{
        "data-edit-dismiss-results": collapsed ? undefined : true,
        "data-edit-show-results": collapsed ? true : undefined,
      }}
    >
      <ul>
        {submitted.map((change) => (
          <li
            key={change.id}
            className="products-edit-result-item"
            data-edit-result={change.id}
          >
            <div className="products-result-identity">
              <Button
                variant="link"
                size="sm"
                className="products-result-name"
                data-edit-details={change.id}
                disabled={editor.sending}
                aria-label={`${t("ptOpenDetails")}: ${editor.records.find((record) => record.id === change.id)?.name} (${editor.records.find((record) => record.id === change.id)?.sku ?? change.id})`}
                onClick={() => {
                  editor.keepEditing();
                  editor.inspect(change.id);
                }}
              >
                {editor.records.find((record) => record.id === change.id)?.name}
              </Button>
              <span className="products-result-code">
                {t("gridSku")}:{" "}
                {editor.records.find((record) => record.id === change.id)
                  ?.sku ?? t("ptUnassigned")}
              </span>
            </div>
            <div className="products-result-fields">
              {(["name", "sku"] as const).map((field) => {
                const outcome = editor.results[change.id]?.[field];
                return outcome ? (
                  <span
                    key={field}
                    className="products-edit-outcome"
                    data-outcome={outcome}
                  >
                    <span className="products-result-field-label">
                      {t(field === "name" ? "peName" : "gridSku")}:
                    </span>
                    <span
                      className="products-result-value"
                      title={change[field]}
                    >
                      {change[field]}
                    </span>
                    <strong>
                      {t(
                        outcome === "confirmed"
                          ? "peSaved"
                          : outcome === "failed"
                            ? "peFailed"
                            : "peUnconfirmed",
                      )}
                    </strong>
                  </span>
                ) : null;
              })}
            </div>
          </li>
        ))}
      </ul>
    </ProductsFeedback>
  );
}

export function EditingValidationSummary({
  editor,
  fieldVisible,
  includeOffPageDrafts = false,
}: {
  editor: ProductEditing;
  fieldVisible: (id: string, field: "name" | "sku") => boolean;
  includeOffPageDrafts?: boolean;
}) {
  const t = useTranslations("catalogue");
  const [review, setReview] = useState<{
    id: string;
    field: "name" | "sku";
  } | null>(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const draftListId = useId();
  const offPage = includeOffPageDrafts
    ? editor.changes.filter((change) => !fieldVisible(change.id, "name"))
    : [];
  const issues = editor.records.flatMap((product) =>
    (["name", "sku"] as const).flatMap((field) => {
      const reason =
        editor.form.formState.errors.rows?.[product.id]?.[field]?.message;
      return reason === "blank" || reason === "tooLong" || reason === "invalid"
        ? [{ product, field, reason } as const]
        : [];
    }),
  );
  const reviewedProduct = editor.records.find(
    (product) => product.id === review?.id,
  );
  if (!issues.length && !review && !offPage.length) return null;
  return (
    <div className="products-edit-validation" data-edit-validation-summary>
      {offPage.length > 0 && (
        <div data-browsing-off-page-edits>
          <p>{t("pbOffPageEdits", { count: offPage.length })}</p>
          <Button
            size="sm"
            variant="outline"
            disabled={editor.sending}
            aria-expanded={showDrafts}
            aria-controls={draftListId}
            onClick={() => setShowDrafts((current) => !current)}
          >
            {t("pbReviewEdits")}
          </Button>
          {showDrafts && (
            <ul id={draftListId}>
              {offPage.map((change) => {
                const product = editor.records.find(
                  (record) => record.id === change.id,
                )!;
                return (
                  <li key={change.id}>
                    <span>
                      {product.name} ({product.sku ?? t("ptUnassigned")}):{" "}
                    </span>
                    {(["name", "sku"] as const).map(
                      (field) =>
                        change[field] !== undefined && (
                          <Button
                            key={field}
                            size="sm"
                            variant="outline"
                            disabled={editor.sending}
                            data-edit-draft-review={`${change.id}-${field}`}
                            onClick={() => {
                              setReview({ id: change.id, field });
                              requestAnimationFrame(() =>
                                editor.form.setFocus(
                                  `rows.${change.id}.${field}`,
                                ),
                              );
                            }}
                          >
                            {t("peReview")}{" "}
                            {t(field === "name" ? "peName" : "gridSku")}
                          </Button>
                        ),
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {(issues.length > 0 || review) && (
        <>
          <p
            className="font-semibold"
            role={issues.length ? "alert" : undefined}
          >
            {t(issues.length ? "peValidationTitle" : "peReviewField")}
          </p>
          <ul>
            {issues.map(({ product, field, reason }) => (
              <li key={`${product.id}-${field}`}>
                <span>
                  {product.name} ({product.sku ?? t("ptUnassigned")}):{" "}
                  {t(errors[field][reason])}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  data-edit-review={`${product.id}-${field}`}
                  onClick={() => {
                    setReview(
                      fieldVisible(product.id, field)
                        ? null
                        : { id: product.id, field },
                    );
                    requestAnimationFrame(() =>
                      editor.form.setFocus(`rows.${product.id}.${field}`),
                    );
                  }}
                >
                  {t("peReview")}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
      {review && reviewedProduct && (
        <div className="products-hidden-field-review">
          <p>
            {reviewedProduct.name} ·{" "}
            {t(review.field === "name" ? "peName" : "gridSku")}
          </p>
          {!fieldVisible(review.id, review.field) &&
          (review.field === "name" ||
            (reviewedProduct.sku === null &&
              editor.rows[review.id]?.assignSku)) ? (
            <EditingField
              editor={editor}
              product={reviewedProduct}
              field={review.field}
            />
          ) : (
            <span className="products-exact-code">
              {review.field === "sku"
                ? (reviewedProduct.sku ?? t("ptUnassigned"))
                : null}
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            disabled={editor.sending}
            onClick={() => {
              setReview(null);
              requestAnimationFrame(() => {
                const target =
                  document.querySelector<HTMLButtonElement>(
                    "[data-edit-save]:not(:disabled)",
                  ) ??
                  document.querySelector<HTMLButtonElement>(
                    "[data-edit-exit]:not(:disabled)",
                  );
                target?.focus();
              });
            }}
          >
            {t("peCloseReview")}
          </Button>
        </div>
      )}
    </div>
  );
}

export function EditingActions({ editor }: { editor: ProductEditing }) {
  const t = useTranslations("catalogue");
  return (
    <div className="products-edit-actions">
      <span data-edit-count>
        {t("peChangeCount", { count: editor.changes.length })}
      </span>
      <Button
        size="sm"
        variant="outline"
        data-edit-exit
        disabled={editor.sending}
        onClick={() => editor.exit()}
      >
        {t(editor.changes.length ? "gridCancel" : "peFinish")}
      </Button>
      <Button
        size="sm"
        data-edit-save
        disabled={
          !editor.changes.length || editor.sending || editor.saveBlocked
        }
        onClick={() => void editor.save()}
      >
        {t(editor.sending ? "peSaving" : "peSaveChanges")}
      </Button>
    </div>
  );
}

export function EditingGuard({ editor }: { editor: ProductEditing }) {
  const t = useTranslations("catalogue");
  return (
    <Dialog
      open={!!editor.pendingExit}
      onOpenChange={(open) => {
        if (!open && !editor.sending) editor.keepEditing();
      }}
    >
      <DialogContent
        data-edit-guard
        showCloseButton={false}
        className="products-edit-guard"
      >
        <DialogHeader>
          <DialogTitle>{t("peUnsavedTitle")}</DialogTitle>
          <DialogDescription>
            {t(
              editor.hasUnconfirmed
                ? "peUnconfirmedGuard"
                : editor.changes.length
                  ? "peUnsavedBody"
                  : "peAllSaved",
            )}
          </DialogDescription>
        </DialogHeader>
        <EditingResultsView editor={editor} />
        <DialogFooter>
          <Button
            variant="outline"
            data-edit-continue
            disabled={editor.sending}
            onClick={editor.keepEditing}
          >
            {t("peKeepEditing")}
          </Button>
          <Button
            variant="outline"
            data-edit-discard
            disabled={editor.sending}
            onClick={editor.discard}
          >
            {t("peDiscard")}
          </Button>
          <Button
            data-edit-save-exit
            disabled={editor.sending || editor.hasUnconfirmed}
            onClick={() => void editor.save(editor.pendingExit ?? undefined)}
          >
            {t(editor.sending ? "peSaving" : "peSaveLeave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
