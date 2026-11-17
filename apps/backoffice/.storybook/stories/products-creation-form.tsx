import { useLocale } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  formatCreationStep,
  type CreationMessages,
} from "./products-creation-messages";
import {
  creationDraftErrors,
  creationUnits,
  selectCreationUnit,
  selectStandardCreationStep,
  setCustomCreationStep,
  type CreationDraft,
} from "./products-creation-model";

type ProductsCreationFormProps = {
  copy: CreationMessages;
  draft: CreationDraft;
  onChange: (draft: CreationDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const errorText = "text-sm text-red-700 dark:text-red-300";
const radio =
  "grid size-4 shrink-0 appearance-none place-content-center rounded-full border border-gray-300 bg-white outline-hidden checked:border-brand-500 checked:bg-brand-500 checked:before:size-2 checked:before:rounded-full checked:before:bg-white checked:before:content-[''] focus-visible:ring-3 focus-visible:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:checked:border-brand-400 dark:checked:bg-brand-500";

export function ProductsCreationForm({
  copy,
  draft,
  onChange,
  onSubmit,
  onCancel,
}: ProductsCreationFormProps) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const [advanced, setAdvanced] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const id = useId();
  const nameControl = useRef<HTMLInputElement>(null);
  const unitControl = useRef<HTMLSelectElement>(null);
  const stepControl = useRef<HTMLInputElement>(null);
  const standardControl = useRef<HTMLInputElement>(null);
  const unit = creationUnits.find(({ id }) => id === draft.unit);
  const validation = creationDraftErrors(draft);
  const nameError =
    validation.name && attempted
      ? {
          required: copy.errors.nameRequired,
          profile: copy.errors.nameProfile,
          length: copy.errors.nameLength,
        }[validation.name]
      : undefined;
  const unitError =
    validation.unit && attempted ? copy.errors.unitRequired : undefined;
  const stepError =
    validation.step && attempted
      ? {
          required: copy.errors.stepRequired,
          format: copy.errors.stepFormat,
          positive: copy.errors.stepPositive,
          precision: copy.errors.stepPrecision,
          whole: copy.errors.stepWhole,
          range: copy.errors.stepRange,
          review: copy.errors.stepReview,
        }[validation.step]
      : undefined;
  const custom = draft.customStep !== null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (validation.name) {
      requestAnimationFrame(() => nameControl.current?.focus());
    } else if (validation.unit) {
      requestAnimationFrame(() => unitControl.current?.focus());
    } else if (validation.step) {
      setAdvanced(true);
      requestAnimationFrame(() =>
        (custom ? stepControl : standardControl).current?.focus(),
      );
    } else {
      onSubmit();
    }
  }

  return (
    <form
      data-creation-form
      noValidate
      onSubmit={submit}
      className="flex min-w-0 grow flex-col gap-5"
    >
      <Field controlId={`${id}-name`}>
        <FieldLabel>{copy.name}</FieldLabel>
        <Input
          data-creation-name
          ref={nameControl}
          name="productName"
          required
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          aria-invalid={!!nameError || undefined}
          aria-describedby={nameError ? `${id}-name-error` : undefined}
        />
        {nameError && (
          <p id={`${id}-name-error`} className={errorText}>
            {nameError}
          </p>
        )}
      </Field>
      <Field controlId={`${id}-unit`}>
        <FieldLabel>{copy.unit}</FieldLabel>
        <div className="relative min-w-0">
          <select
            data-creation-unit
            className="h-11 w-full min-w-0 appearance-none truncate rounded-[10px] border border-gray-300 bg-white ps-4 pe-9 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:aria-invalid:border-red-400"
            id={`${id}-unit`}
            ref={unitControl}
            required
            value={draft.unit ?? ""}
            onChange={(event) => {
              const selected = creationUnits.find(
                ({ id }) => id === event.target.value,
              );
              if (!selected) return;
              const next = selectCreationUnit(draft, selected.id);
              if (next.previousStep) setAdvanced(true);
              onChange(next);
            }}
            aria-invalid={!!unitError || undefined}
            aria-describedby={unitError ? `${id}-unit-error` : undefined}
          >
            <option value="" disabled>
              {copy.selectUnit}
            </option>
            {creationUnits.map(({ id, symbol }) => (
              <option key={id} value={id}>
                {id === "piece"
                  ? copy.unitLabels[id]
                  : `${copy.unitLabels[id]} (${symbol})`}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute end-3 top-3.5 size-4 text-gray-500 dark:text-gray-300"
          />
        </div>
        {unitError && (
          <p id={`${id}-unit-error`} className={errorText}>
            {unitError}
          </p>
        )}
      </Field>
      <div className="border-t border-gray-200 pt-1 dark:border-gray-700">
        <Button
          data-creation-advanced
          type="button"
          variant="ghost"
          className="my-1.5 min-h-11 w-full justify-between px-2 text-start whitespace-normal"
          aria-expanded={advanced}
          aria-controls={`${id}-advanced`}
          onClick={() => setAdvanced(!advanced)}
        >
          {copy.advanced}
          <ChevronDownIcon
            aria-hidden="true"
            className={advanced ? "size-4 rotate-180" : "size-4"}
          />
        </Button>
        <div id={`${id}-advanced`} hidden={!advanced}>
          <div className="rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-900/60">
            {unit ? (
              <fieldset
                aria-describedby={`${id}-step-help${stepError ? ` ${id}-step-error` : ""}`}
              >
                <legend className="sr-only">{copy.quantityStep}</legend>
                <p
                  aria-hidden="true"
                  className="font-medium text-gray-800 dark:text-gray-100"
                >
                  {copy.quantityStep}
                </p>
                <p
                  id={`${id}-step-help`}
                  className="mt-0.5 text-sm text-gray-600 dark:text-gray-300"
                >
                  {copy.stepHelp}
                </p>
                {draft.previousStep && (
                  <div
                    data-creation-review
                    role="status"
                    className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100"
                  >
                    <p>
                      <span className="font-medium">{copy.previousStep}</span>{" "}
                      <span className="break-all">
                        {draft.previousStep.value}
                      </span>{" "}
                      {copy.unitLabels[draft.previousStep.unit]}
                    </p>
                    <p>{copy.reviewStep}</p>
                  </div>
                )}
                <div className="mt-2 grid gap-0.5">
                  <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 hover:bg-white/70 dark:hover:bg-white/5">
                    <input
                      data-creation-standard
                      ref={standardControl}
                      type="radio"
                      name={`${id}-step-mode`}
                      className={radio}
                      checked={!custom && !draft.previousStep}
                      aria-invalid={(!!stepError && !custom) || undefined}
                      aria-describedby={
                        stepError && !custom ? `${id}-step-error` : undefined
                      }
                      onChange={() =>
                        onChange(selectStandardCreationStep(draft))
                      }
                    />
                    <span>{copy.standard}</span>
                    <span className="ms-auto text-end text-gray-600 tabular-nums dark:text-gray-300">
                      {formatCreationStep(unit.defaultStep, locale)}{" "}
                      {unit.id === "piece" ? copy.pieceSymbol : unit.symbol}
                    </span>
                  </label>
                  <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 hover:bg-white/70 dark:hover:bg-white/5">
                    <input
                      data-creation-custom
                      type="radio"
                      name={`${id}-step-mode`}
                      className={radio}
                      checked={custom}
                      onChange={() =>
                        onChange(setCustomCreationStep(draft, ""))
                      }
                    />
                    <span>{copy.custom}</span>
                  </label>
                </div>
                {custom && (
                  <Field className="mt-2" controlId={`${id}-step`}>
                    <FieldLabel>{copy.customStep}</FieldLabel>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Input
                        data-creation-step
                        ref={stepControl}
                        inputMode="decimal"
                        value={draft.customStep ?? ""}
                        onChange={(event) =>
                          onChange(
                            setCustomCreationStep(draft, event.target.value),
                          )
                        }
                        aria-invalid={!!stepError || undefined}
                        aria-describedby={`${id}-step-unit${stepError ? ` ${id}-step-error` : ""}`}
                      />
                      <span
                        id={`${id}-step-unit`}
                        className="shrink-0 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <span aria-hidden="true">
                          {unit.id === "piece" ? copy.pieceSymbol : unit.symbol}
                        </span>
                        <span className="sr-only">
                          {copy.unitLabels[unit.id]}
                        </span>
                      </span>
                    </div>
                  </Field>
                )}
                {stepError && (
                  <p id={`${id}-step-error`} className={`mt-2 ${errorText}`}>
                    {stepError}
                  </p>
                )}
              </fieldset>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {copy.chooseUnitFirst}
              </p>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-auto flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Button
          data-creation-cancel
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
        >
          {copy.cancel}
        </Button>
        <Button data-creation-submit type="submit" size="lg">
          {copy.submit}
        </Button>
      </footer>
    </form>
  );
}
