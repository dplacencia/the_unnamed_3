import { useLocale } from "next-intl";
import {
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { formatCreationStep } from "./products-creation-messages";
import { creationUnit, type CreationUnitId } from "./products-creation-model";
import type { ReceiptMessages } from "./stock-receipt-messages";
import {
  receiptCompatibleUnits,
  receiptErrors,
  type ReceiptDraft,
  type ReceiptLocation,
  type ReceiptProduct,
} from "./stock-receipt-model";

type ReceiptFormProps = {
  copy: ReceiptMessages;
  draft: ReceiptDraft;
  products: readonly ReceiptProduct[];
  locations: readonly ReceiptLocation[];
  onChange: (draft: ReceiptDraft) => void;
  onProductChange: (product: ReceiptProduct) => void;
  onUnitChange: (unit: CreationUnitId) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const errorStyle = "text-red-700 dark:text-red-300";

function ReceiptSelect({ children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative min-w-0">
      <select
        className="h-11 w-full min-w-0 appearance-none truncate rounded-[10px] border border-gray-300 bg-white ps-4 pe-9 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-gray-100/50 disabled:text-gray-500 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:disabled:bg-gray-900/40 dark:disabled:text-gray-400 dark:aria-invalid:border-red-400"
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute end-3 top-3.5 size-4 text-gray-500 dark:text-gray-300"
      />
    </div>
  );
}

export function StockReceiptForm({
  copy,
  draft,
  products,
  locations,
  onChange,
  onProductChange,
  onUnitChange,
  onSubmit,
  onCancel,
}: ReceiptFormProps) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const [advanced, setAdvanced] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const id = useId();
  const productControl = useRef<HTMLInputElement>(null);
  const locationControl = useRef<HTMLSelectElement>(null);
  const unitControl = useRef<HTMLSelectElement>(null);
  const amountControl = useRef<HTMLInputElement>(null);
  const referenceControl = useRef<HTMLInputElement>(null);
  const productNames = new Set<string>();
  const sharedNames = new Set<string>();
  for (const { name } of products) {
    if (productNames.has(name)) sharedNames.add(name);
    productNames.add(name);
  }
  const distinguishSelection =
    draft.product && sharedNames.has(draft.product.name);
  const units = receiptCompatibleUnits(draft.product);
  const baseUnit = creationUnit(draft.product?.unit ?? null);
  const baseSymbol =
    baseUnit?.id === "piece" ? copy.pieceSymbol : baseUnit?.symbol;
  const validation = receiptErrors(draft);
  const searching =
    searchOpen && query !== null && query !== draft.product?.name;
  const productError = attempted && (validation.product || searching);
  const locationError = attempted && validation.location;
  const unitError = attempted && draft.product ? validation.unit : undefined;
  const referenceError = attempted ? validation.reference : undefined;
  const quantityError =
    attempted && draft.product && draft.unit && validation.quantity
      ? {
          required: copy.errors.quantityRequired,
          format: copy.errors.quantityFormat,
          positive: copy.errors.quantityPositive,
          whole: copy.errors.quantityWhole,
          precision: copy.errors.quantityPrecision,
          range: copy.errors.quantityRange,
          increment: copy.errors.quantityIncrement,
        }[validation.quantity]
          .replace("{unit}", baseSymbol ?? "")
          .replace(
            "{step}",
            formatCreationStep(draft.product.increment, locale),
          )
      : undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (validation.product || searching) {
      requestAnimationFrame(() => productControl.current?.focus());
    } else if (validation.location) {
      requestAnimationFrame(() => locationControl.current?.focus());
    } else if (validation.unit) {
      requestAnimationFrame(() => unitControl.current?.focus());
    } else if (validation.quantity) {
      requestAnimationFrame(() => amountControl.current?.focus());
    } else if (validation.reference) {
      setAdvanced(true);
      requestAnimationFrame(() => referenceControl.current?.focus());
    } else {
      onSubmit();
    }
  }

  return (
    <form
      data-receipt-form
      data-receipt-selected-product={draft.product?.id ?? ""}
      noValidate
      onSubmit={submit}
      className="flex min-w-0 grow flex-col gap-5"
    >
      <Field controlId={`${id}-product`}>
        <FieldLabel>{copy.product}</FieldLabel>
        <Combobox<ReceiptProduct>
          items={products}
          value={draft.product}
          inputValue={query ?? draft.product?.name ?? ""}
          itemToStringLabel={(product) => product.name}
          itemToStringValue={(product) => product.id}
          isItemEqualToValue={(product, selected) => product.id === selected.id}
          open={searchOpen}
          onOpenChange={(open) => {
            setSearchOpen(open);
            if (!open) setQuery(null);
          }}
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setQuery(value);
          }}
          onValueChange={(product, details) => {
            // Selection remains controlled by the draft, including during confirmation.
            details.cancel();
            if (!product) return;
            setQuery(null);
            setSearchOpen(false);
            if (product.id !== draft.product?.id) onProductChange(product);
          }}
        >
          <ComboboxInput
            data-receipt-product
            id={`${id}-product`}
            ref={productControl}
            aria-required="true"
            aria-invalid={!!productError || undefined}
            aria-describedby={
              [
                productError && `${id}-product-error`,
                distinguishSelection && `${id}-product-id`,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            placeholder={copy.searchProduct}
          />
          <ComboboxContent className="min-w-0">
            <ComboboxEmpty>{copy.noProducts}</ComboboxEmpty>
            <ComboboxList>
              {(product: ReceiptProduct) => (
                <ComboboxItem
                  data-receipt-product-option={product.id}
                  key={product.id}
                  value={product}
                  className="min-h-11 [&>span:first-child]:min-w-0 [&>span:first-child]:shrink [&>span:first-child]:whitespace-normal"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    {product.name}
                    {sharedNames.has(product.name) && (
                      <span className="block text-xs font-normal text-gray-600 dark:text-gray-400">
                        {copy.productId} {product.id}
                      </span>
                    )}
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {distinguishSelection && (
          <FieldDescription
            id={`${id}-product-id`}
            className="[overflow-wrap:anywhere]"
          >
            {copy.productId} {draft.product?.id}
          </FieldDescription>
        )}
        {productError && (
          <FieldError
            data-receipt-error="product"
            id={`${id}-product-error`}
            className={errorStyle}
          >
            {copy.errors.product}
          </FieldError>
        )}
      </Field>
      <Field controlId={`${id}-location`}>
        <FieldLabel>{copy.destination}</FieldLabel>
        <ReceiptSelect
          data-receipt-location
          id={`${id}-location`}
          ref={locationControl}
          required
          value={draft.locationId}
          onChange={(event) =>
            onChange({ ...draft, locationId: event.target.value })
          }
          aria-invalid={!!locationError || undefined}
          aria-describedby={locationError ? `${id}-location-error` : undefined}
        >
          <option value="" disabled>
            {copy.selectLocation}
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </ReceiptSelect>
        {locationError && (
          <FieldError
            data-receipt-error="location"
            id={`${id}-location-error`}
            className={errorStyle}
          >
            {copy.errors.location}
          </FieldError>
        )}
      </Field>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-3">
        <Field controlId={`${id}-quantity`}>
          <FieldLabel>{copy.quantity}</FieldLabel>
          <Input
            data-receipt-quantity
            id={`${id}-quantity`}
            ref={amountControl}
            required
            inputMode="decimal"
            spellCheck={false}
            disabled={!draft.product}
            value={draft.quantity}
            onChange={(event) =>
              onChange({ ...draft, quantity: event.target.value })
            }
            aria-invalid={!!quantityError || undefined}
            aria-describedby={
              quantityError ? `${id}-quantity-error` : undefined
            }
          />
        </Field>
        <Field controlId={`${id}-unit`}>
          <FieldLabel>{copy.unit}</FieldLabel>
          <ReceiptSelect
            data-receipt-unit
            id={`${id}-unit`}
            ref={unitControl}
            required
            disabled={!draft.product}
            value={draft.unit ?? ""}
            title={draft.product ? undefined : copy.selectUnit}
            onChange={(event) => {
              const next = units.find(({ id }) => id === event.target.value);
              if (next && next.id !== draft.unit) onUnitChange(next.id);
            }}
            aria-invalid={!!unitError || undefined}
            aria-describedby={unitError ? `${id}-unit-error` : undefined}
          >
            <option value="" disabled>
              —
            </option>
            {units.map(({ id, symbol }) => (
              <option key={id} value={id}>
                {id === "piece"
                  ? copy.unitLabels[id]
                  : `${copy.unitLabels[id]} (${symbol})`}
              </option>
            ))}
          </ReceiptSelect>
        </Field>
        {quantityError && (
          <FieldError
            data-receipt-error="quantity"
            id={`${id}-quantity-error`}
            className={`col-span-2 -mt-1 ${errorStyle}`}
          >
            {quantityError}
          </FieldError>
        )}
        {unitError && (
          <FieldError
            data-receipt-error="unit"
            id={`${id}-unit-error`}
            className={`col-span-2 -mt-1 ${errorStyle}`}
          >
            {unitError === "required"
              ? copy.errors.unitRequired
              : copy.errors.unitIncompatible}
          </FieldError>
        )}
      </div>
      <div className="border-t border-gray-200 pt-1 dark:border-gray-700">
        <Button
          data-receipt-advanced
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
          <Field controlId={`${id}-reference`}>
            <FieldLabel>{copy.reference}</FieldLabel>
            <Input
              data-receipt-reference
              id={`${id}-reference`}
              ref={referenceControl}
              value={draft.reference}
              spellCheck={false}
              onChange={(event) =>
                onChange({ ...draft, reference: event.target.value })
              }
              aria-invalid={!!referenceError || undefined}
              aria-describedby={
                referenceError ? `${id}-reference-error` : undefined
              }
            />
            {referenceError && (
              <FieldError
                data-receipt-error="reference"
                id={`${id}-reference-error`}
                className={errorStyle}
              >
                {referenceError === "length"
                  ? copy.errors.referenceLength
                  : copy.errors.referenceProfile}
              </FieldError>
            )}
          </Field>
        </div>
      </div>
      <footer className="mt-auto flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Button
          data-receipt-cancel
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
        >
          {copy.cancel}
        </Button>
        <Button data-receipt-submit type="submit" size="lg">
          {copy.submit}
        </Button>
      </footer>
    </form>
  );
}
