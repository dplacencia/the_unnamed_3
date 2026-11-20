"use client";

import { useLocale } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { sampleMerchantCode } from "./core-employee-accounts-model";
import { employeeLoginCodeMessages } from "./core-employee-login-code-messages";
import { NavigationPrototype } from "./navigation-prototype";

export type EmployeeLoginCodePreset = "unset" | "current" | "conflict";
type Step = "view" | "edit" | "confirm";
const unavailableCode = "rio8";

function canonicalCode(input: string) {
  if (input.length < 3 || input.length > 12 || /[^A-Za-z0-9]/.test(input))
    return null;
  return input.toLowerCase();
}

export function EmployeeLoginCodeContent({
  preset,
}: {
  preset: EmployeeLoginCodePreset;
}) {
  const currentLocale = useLocale();
  const copy =
    employeeLoginCodeMessages[
      isLocale(currentLocale) ? currentLocale : defaultLocale
    ];
  const inputId = useId();
  const hintId = useId();
  const conflictId = useId();
  const [current, setCurrent] = useState(
    preset === "unset" ? null : sampleMerchantCode,
  );
  const [candidate, setCandidate] = useState(
    preset === "conflict" ? unavailableCode : "",
  );
  const [step, setStep] = useState<Step>(
    preset === "current" ? "view" : "edit",
  );
  const [conflict, setConflict] = useState(preset === "conflict");
  const [established, setEstablished] = useState<{
    previous: string | null;
  } | null>(null);
  const proposed = canonicalCode(candidate);
  const same = proposed !== null && proposed === current;

  function startEdit() {
    setCandidate("");
    setConflict(false);
    setEstablished(null);
    setStep("edit");
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!proposed || same) return;
    setConflict(false);
    setStep("confirm");
  }

  function confirm() {
    if (!proposed || same) return;
    if (preset === "conflict" && proposed === unavailableCode) {
      setConflict(true);
      setStep("edit");
      return;
    }
    setEstablished({ previous: current });
    setCurrent(proposed);
    setStep("view");
  }

  return (
    <section
      data-core-employee-login-code-ready={preset}
      className="max-w-xl space-y-4 text-gray-700 dark:text-gray-300"
    >
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {copy.title}
        </h2>
        <p>{copy.hint}</p>
      </header>
      {current ? (
        <dl className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
          <dt className="font-medium">{copy.current}</dt>
          <dd>
            <code className="font-mono" data-current-employee-code>
              {current}
            </code>
          </dd>
        </dl>
      ) : (
        <p>{copy.unset}</p>
      )}
      {established && (
        <div
          role="status"
          className="space-y-1 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
        >
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {copy.saved}
          </p>
          {established.previous && (
            <>
              <p>
                {copy.old}{" "}
                <code className="font-mono">{established.previous}</code>
              </p>
              <p>{copy.sessions}</p>
              <p>{copy.retiredRule}</p>
            </>
          )}
        </div>
      )}
      {step === "view" && <Button onClick={startEdit}>{copy.change}</Button>}
      {step === "edit" && (
        <form className="space-y-3" onSubmit={review}>
          <div className="space-y-1">
            <label className="block font-medium" htmlFor={inputId}>
              {copy.candidate}
            </label>
            <Input
              id={inputId}
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="none"
              className="font-mono min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={candidate}
              onChange={(event) => {
                setCandidate(event.target.value);
                setConflict(false);
              }}
              aria-describedby={conflict ? `${hintId} ${conflictId}` : hintId}
              aria-invalid={
                conflict || (candidate.length > 0 && !proposed) || undefined
              }
              required
            />
            <p id={hintId}>{same ? copy.same : copy.format}</p>
            {conflict && (
              <p
                role="alert"
                id={conflictId}
                className="text-error-600 dark:text-error-400"
              >
                {copy.conflict}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!proposed || same}>
              {copy.review}
            </Button>
            {current && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("view")}
              >
                {copy.cancel}
              </Button>
            )}
          </div>
        </form>
      )}
      {step === "confirm" && proposed && (
        <section className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium">{copy.reviewing}</dt>
              <dd>
                <code className="font-mono">{proposed}</code>
              </dd>
            </div>
            <div>
              <dt className="font-medium">{copy.sample}</dt>
              <dd>
                <code className="font-mono">ana.{proposed}</code>
              </dd>
            </div>
          </dl>
          {current && <p>{copy.changeEffect}</p>}
          <div className="flex flex-wrap gap-2">
            <Button onClick={confirm}>{copy.confirm}</Button>
            <Button variant="outline" onClick={() => setStep("edit")}>
              {copy.edit}
            </Button>
          </div>
        </section>
      )}
    </section>
  );
}

export function EmployeeLoginCodePreview({
  preset,
}: {
  preset: EmployeeLoginCodePreset;
}) {
  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="several"
      businessSettingsContent={<EmployeeLoginCodeContent preset={preset} />}
    />
  );
}
