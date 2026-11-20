import { useLocale } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { NavigationPrototype } from "./navigation-prototype";
import { stockCommitmentsMessages } from "./stock-commitments-messages";
import {
  activeCommitment,
  canonicalCommitmentQuantity,
  commitmentAction,
  commitmentFixtureResult,
  commitmentScope,
  fulfillmentKind,
  readCommitmentFixture,
  type CommitmentRead,
  type CommitmentRecord,
  type CommitmentResult,
  type CommitmentScope,
  type RemainderChoice,
} from "./stock-commitments-model";
import "./products-table-preview.css";

export type StockCommitmentFixture =
  | "reserve"
  | "active"
  | "partial-reservation"
  | "release"
  | "fulfill"
  | "partial-fulfillment"
  | "fulfilled"
  | "released"
  | "unconfirmed"
  | "read-unavailable"
  | "read-error";

type View = "reserve" | "inspect" | "release" | "fulfill";
type Action = ReturnType<typeof commitmentAction>;
type Copy = ReturnType<typeof stockCommitmentsMessages>;

function seed(fixture: StockCommitmentFixture) {
  let view: View = "inspect";
  let action: Action | null = null;
  let quantity = "";
  if (fixture === "reserve" || fixture === "release" || fixture === "fulfill")
    view = fixture;
  if (fixture === "partial-fulfillment") {
    view = "fulfill";
    quantity = "1";
  }
  if (fixture === "partial-reservation")
    action = commitmentAction("reserve", "4", true);
  if (fixture === "fulfilled") action = commitmentAction("fulfill", "3");
  if (fixture === "unconfirmed" || fixture === "released")
    action = commitmentAction("release", "");
  const result = action
    ? commitmentFixtureResult(
        action,
        fixture === "unconfirmed" ? "unconfirmed" : "ready",
      )
    : null;
  const current =
    result?.kind === "confirmed" ? result.record : activeCommitment;
  const read = readCommitmentFixture(
    current.reference,
    fixture === "read-unavailable"
      ? "unavailable"
      : fixture === "read-error"
        ? "error"
        : "ready",
    current,
  );
  return { view, action, result, quantity, current, read };
}

function Facts({ facts }: { facts: ReadonlyArray<readonly [string, string]> }) {
  return (
    <dl className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm">
      {facts.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="min-w-0 break-words text-gray-600 dark:text-gray-300">
            {label}
          </dt>
          <dd className="text-end font-semibold whitespace-nowrap tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StockFacts({
  copy,
  record,
}: {
  copy: Copy;
  record: CommitmentRecord | null;
}) {
  const amount = (value: string) => `${value} ${copy.unitSymbol}`;
  return (
    <div className="rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-800">
      <Facts
        facts={[
          [copy.onHand, amount(record?.onHand ?? "10")],
          [copy.available, amount(record?.available ?? "10")],
        ]}
      />
    </div>
  );
}

export function StockCommitmentsPreview({
  fixture,
  selectedScope,
}: {
  fixture: StockCommitmentFixture;
  selectedScope?: CommitmentScope;
}) {
  const language = useLocale();
  const locale = isLocale(language) ? language : defaultLocale;
  const copy = stockCommitmentsMessages(locale);
  const [initial] = useState(() => seed(fixture));
  const id = useId();
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<View>(initial.view);
  const [quantity, setQuantity] = useState(initial.quantity);
  const [allowPartial, setAllowPartial] = useState(false);
  const [remainder, setRemainder] = useState<RemainderChoice | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(initial.action);
  const [result, setResult] = useState<CommitmentResult | null>(initial.result);
  const [current, setCurrent] = useState<CommitmentRecord | null>(
    selectedScope ? null : initial.current,
  );
  const [read, setRead] = useState<CommitmentRead>(
    selectedScope ? { kind: "unavailable" } : initial.read,
  );
  const [reference, setReference] = useState(
    selectedScope ? "" : activeCommitment.reference,
  );
  const record = read.kind === "confirmed" ? read.record : null;
  const unknown = result?.kind === "unconfirmed";
  const amount = (value: string) => `${value} ${copy.unitSymbol}`;
  const kind =
    view === "fulfill" && record ? fulfillmentKind(quantity, record) : null;
  const status =
    record &&
    {
      active: copy.active,
      released: copy.released,
      fulfilled: copy.fulfilledStatus,
    }[record.status];
  const title = {
    reserve: copy.reserve,
    inspect: copy.details,
    release: copy.release,
    fulfill: copy.fulfill,
  }[view];
  const scope = selectedScope ?? commitmentScope;

  function readExact(nextReference: string) {
    setResult(null);
    setAction(null);
    setView("inspect");
    setRead(
      current
        ? readCommitmentFixture(nextReference, "ready", current)
        : { kind: "unavailable" },
    );
    setOpen(true);
  }

  function start(next: View) {
    setResult(null);
    setAction(null);
    setQuantity("");
    setAllowPartial(false);
    setRemainder(null);
    setFieldError(null);
    setView(next);
    setOpen(true);
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unknown || view === "inspect") return;
    if (view !== "reserve" && (!record || record.status !== "active")) return;
    if (
      (view === "reserve" && canonicalCommitmentQuantity(quantity) === null) ||
      kind === "invalid"
    ) {
      setFieldError(copy.wholeQuantity);
      return;
    }
    if (kind === "unsupported") {
      setFieldError(copy.excess);
      return;
    }
    if (kind === "partial" && !remainder) {
      setFieldError(copy.chooseRemainder);
      return;
    }
    const attempt = commitmentAction(
      view,
      quantity,
      allowPartial,
      remainder,
      record ??
        (selectedScope
          ? { ...activeCommitment, reference: selectedScope.reference }
          : activeCommitment),
    );
    const outcome = commitmentFixtureResult(attempt);
    setAction(attempt);
    setResult(outcome);
    if (outcome.kind === "confirmed") {
      setView("inspect");
      setCurrent(outcome.record);
      setRead({ kind: "confirmed", record: outcome.record });
      if (selectedScope) setReference(outcome.record.reference);
    }
  }

  function changeQuantity(value: string) {
    setQuantity(value);
    setRemainder(null);
    setResult(null);
    setFieldError(null);
  }

  const resultTitle =
    result?.kind === "confirmed" && action
      ? {
          reserve: copy.reserved,
          release: copy.released,
          fulfill: copy.delivery,
        }[action.kind]
      : null;

  return (
    <div data-stock-commitments-workspace>
      <Sheet open={open} onOpenChange={setOpen}>
        <NavigationPrototype
          initialPage="movements"
          permissionMode="ready"
          locationCount="several"
          movementsContent={
            <div className="flex flex-wrap items-end gap-3">
              {unknown ? (
                <Button type="button" size="sm" onClick={() => setOpen(true)}>
                  {copy.viewAttempt}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => start("reserve")}
                  >
                    {copy.reserve}
                  </Button>
                  <form
                    className="flex flex-wrap items-end gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      readExact(reference);
                    }}
                  >
                    <Field className="w-48" data-stock-commitments-reference>
                      <FieldLabel htmlFor={`${id}-reference`}>
                        {copy.reference}
                      </FieldLabel>
                      <Input
                        id={`${id}-reference`}
                        value={reference}
                        required
                        onChange={(event) => setReference(event.target.value)}
                      />
                    </Field>
                    <Button type="submit" size="sm" variant="outline">
                      {copy.inspect}
                    </Button>
                  </form>
                </>
              )}
            </div>
          }
        />
        <SheetContent
          className="products-detail-panel"
          showCloseButton={false}
          data-stock-commitments-ready={open ? fixture : undefined}
          data-stock-commitments-view={view}
          data-stock-commitments-outcome={result?.kind}
        >
          <SheetHeader className="pe-28">
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <SheetDescription className="sr-only">
              {copy.details}
            </SheetDescription>
            <Button
              className="absolute end-4 top-4"
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {copy.close}
            </Button>
          </SheetHeader>
          <div className="grid content-start gap-4 overflow-y-auto p-4 sm:p-5">
            {unknown ? (
              <div
                className="space-y-2 rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-800"
                role="alert"
              >
                <p className="font-semibold">{copy.unconfirmed}</p>
                {action && (
                  <Facts
                    facts={[
                      [copy.reference, action.reference],
                      [copy.product, scope.product.name],
                      [copy.location, scope.location.name],
                      [copy.channel, scope.channel.name],
                      ...(action.quantity
                        ? [[copy.quantity, amount(action.quantity)] as const]
                        : []),
                    ]}
                  />
                )}
              </div>
            ) : (
              <>
                {(view !== "inspect" || record) && (
                  <Facts
                    facts={[
                      [copy.product, scope.product.name],
                      [copy.location, scope.location.name],
                      [copy.channel, scope.channel.name],
                      ...(view !== "reserve" && record
                        ? [[copy.reference, record.reference] as const]
                        : []),
                    ]}
                  />
                )}
                {view === "reserve" && <StockFacts copy={copy} record={null} />}
                {view === "inspect" && record && (
                  <>
                    <section className="grid gap-2.5" aria-label={copy.details}>
                      <div role="status" className="font-semibold">
                        {resultTitle ?? status}
                      </div>
                      <Facts
                        facts={[
                          [copy.accepted, amount(record.accepted)],
                          ...(record.unaccepted !== "0"
                            ? [
                                [
                                  copy.unaccepted,
                                  amount(record.unaccepted),
                                ] as const,
                              ]
                            : []),
                          [copy.outstanding, amount(record.outstanding)],
                          [copy.fulfilled, amount(record.fulfilled)],
                          ...(record.status === "active"
                            ? [
                                [
                                  copy.expiry,
                                  new Intl.DateTimeFormat(locale, {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                    timeZone: scope.location.timeZone,
                                  }).format(new Date(record.expires)),
                                ] as const,
                              ]
                            : []),
                          ...(result?.kind === "confirmed" && result.effect
                            ? [[copy.effect, amount(result.effect)] as const]
                            : []),
                          ...(result?.kind === "confirmed" && result.released
                            ? [
                                [
                                  copy.releasedQuantity,
                                  amount(result.released),
                                ] as const,
                              ]
                            : []),
                        ]}
                      />
                    </section>
                    <StockFacts copy={copy} record={record} />
                    <div className="flex flex-wrap gap-2">
                      {record.status === "active" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => start("fulfill")}
                          >
                            {copy.fulfill}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => start("release")}
                          >
                            {copy.release}
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => readExact(record.reference)}
                      >
                        {copy.refreshRead}
                      </Button>
                    </div>
                  </>
                )}
                {view === "inspect" && !record && (
                  <div
                    className="grid justify-items-start gap-2.5"
                    role="alert"
                  >
                    <p>
                      {read.kind === "error"
                        ? copy.readError
                        : copy.unavailable}
                    </p>
                    {read.kind === "error" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => readExact(reference)}
                      >
                        {copy.retryRead}
                      </Button>
                    )}
                  </div>
                )}
                {view !== "inspect" && (
                  <form
                    className="grid gap-3"
                    onSubmit={apply}
                    noValidate
                    data-stock-commitments-form={view}
                  >
                    {view === "release" && record && (
                      <div className="space-y-2">
                        <p className="font-semibold">{copy.releaseQuestion}</p>
                        <Facts
                          facts={[
                            [copy.outstanding, amount(record.outstanding)],
                          ]}
                        />
                        {record.fulfilled !== "0" && (
                          <p className="text-sm">{copy.releaseDescription}</p>
                        )}
                      </div>
                    )}
                    {view !== "release" && (
                      <>
                        {view === "fulfill" && record && (
                          <Facts
                            facts={[
                              [copy.outstanding, amount(record.outstanding)],
                            ]}
                          />
                        )}
                        <Field
                          data-invalid={Boolean(
                            fieldError && kind !== "partial",
                          )}
                        >
                          <FieldLabel htmlFor={`${id}-quantity`}>
                            {view === "fulfill"
                              ? copy.fulfillmentQuantity
                              : copy.quantity}
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id={`${id}-quantity`}
                              className="pe-14"
                              inputMode="numeric"
                              value={quantity}
                              aria-invalid={Boolean(
                                fieldError && kind !== "partial",
                              )}
                              aria-describedby={
                                fieldError && kind !== "partial"
                                  ? `${id}-quantity-error`
                                  : undefined
                              }
                              onChange={(event) =>
                                changeQuantity(event.target.value)
                              }
                            />
                            <span className="pointer-events-none absolute end-3 top-3 text-sm text-gray-600 dark:text-gray-300">
                              {copy.unitSymbol}
                            </span>
                          </div>
                          {fieldError && kind !== "partial" && (
                            <FieldError id={`${id}-quantity-error`}>
                              {fieldError}
                            </FieldError>
                          )}
                        </Field>
                      </>
                    )}
                    {view === "reserve" && (
                      <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 shrink-0 accent-brand-600"
                          checked={allowPartial}
                          onChange={(event) => {
                            setAllowPartial(event.target.checked);
                            setResult(null);
                          }}
                        />
                        {copy.allowPartial}
                      </label>
                    )}
                    {view === "fulfill" && kind === "partial" && (
                      <fieldset className="grid gap-1 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                        <legend className="px-1 text-sm font-semibold">
                          {copy.remainder}
                        </legend>
                        {(["keep", "release"] as const).map((choice) => (
                          <label
                            key={choice}
                            className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm"
                          >
                            <input
                              type="radio"
                              name={`${id}-remainder`}
                              className="size-4 shrink-0 accent-brand-600"
                              value={choice}
                              checked={remainder === choice}
                              onChange={() => {
                                setRemainder(choice);
                                setFieldError(null);
                                setResult(null);
                              }}
                            />
                            {choice === "keep"
                              ? copy.keepRemainder
                              : copy.releaseRemainder}
                          </label>
                        ))}
                        {fieldError && <FieldError>{fieldError}</FieldError>}
                      </fieldset>
                    )}
                    {(result?.kind === "declined" ||
                      result?.kind === "unsupported") && (
                      <p
                        role="alert"
                        className="text-sm text-red-700 dark:text-red-300"
                      >
                        {result.kind === "declined"
                          ? copy.declined
                          : copy.noFixture}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" size="sm">
                        {title}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (view === "reserve") setOpen(false);
                          else start("inspect");
                        }}
                      >
                        {view === "reserve" ? copy.cancel : copy.back}
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
