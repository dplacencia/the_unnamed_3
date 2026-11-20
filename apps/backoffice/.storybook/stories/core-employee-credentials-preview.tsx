import { useLocale } from "next-intl";
import { useEffect, useId, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoCircleIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { employeeCredentialMessages } from "./core-employee-credentials-messages";
import {
  confirmCredentialAction,
  credentialFixture,
  reconcileEmployeeSecurityReset,
  type CoreEmployeeCredentialsFixture,
  type EmployeeCredentialAction,
  type EmployeeCredentialGrants,
  type PasswordSessionChoice,
} from "./core-employee-credentials-model";

type CoreEmployeeCredentialsPanelProps = {
  employeeName: string;
  grants: EmployeeCredentialGrants;
  onBack: () => void;
  fixture?: CoreEmployeeCredentialsFixture;
};

const actions = ["password", "mfa", "security"] as const;

export function CoreEmployeeCredentialsPanel({
  employeeName,
  grants,
  onBack,
  fixture = "actions",
}: CoreEmployeeCredentialsPanelProps) {
  const language = useLocale();
  const t = employeeCredentialMessages(
    isLocale(language) ? language : defaultLocale,
  );
  const [state, setState] = useState(() => credentialFixture(fixture));
  const [sessions, setSessions] = useState<PasswordSessionChoice | null>(null);
  const [handoffHidden, setHandoffHidden] = useState(false);
  const id = useId();
  const { view } = state;
  const confirmation =
    view === "password-choice"
      ? "password"
      : view === "mfa-choice"
        ? "mfa"
        : view === "security-choice"
          ? "security"
          : null;
  const temporaryReady =
    !handoffHidden &&
    ((view === "password-handoff" && grants.password) ||
      (view === "security-complete" && grants.security));
  const confirmedLock =
    view === "security-locked" || view === "security-uncertain";

  useEffect(() => {
    if (fixture !== "actions" || state.view !== "security-locked") return;
    // Allow the interactive example to show a loss of final confirmation.
    // The prepared locked story stays stable for inspection.
    const timeout = window.setTimeout(() => {
      setState({ ...state, view: "security-uncertain" });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [fixture, state]);

  function actionsView() {
    setSessions(null);
    setHandoffHidden(false);
    setState({ view: "actions" });
  }

  function dismissHandoff() {
    if (view === "security-complete") setHandoffHidden(true);
    else actionsView();
  }

  function close() {
    if (!confirmedLock) dismissHandoff();
    onBack();
  }

  function confirm(action: EmployeeCredentialAction) {
    const next = confirmCredentialAction(grants, action, sessions);
    if (next) setState(next);
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="grid w-full max-w-2xl gap-4"
      data-employee-credentials-ready={fixture}
      data-employee-credentials-view={view}
      data-employee-recovery-reference={
        "reference" in state ? state.reference : undefined
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            id={`${id}-title`}
            className="text-lg font-semibold break-words text-gray-900 dark:text-gray-100"
          >
            {t("title")}
          </h2>
          <p className="break-words text-gray-600 dark:text-gray-300">
            {employeeName}
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={close}>
          {t("back")}
        </Button>
      </div>
      {view === "actions" && (
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {actions
            .filter((action) => grants[action])
            .map((action) => (
              <div
                key={action}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:px-4"
              >
                <p className="max-w-96 min-w-0 text-sm break-words text-gray-600 dark:text-gray-300">
                  {t(`${action}Help`)}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-auto min-h-9 max-w-full whitespace-normal max-sm:min-h-11"
                  onClick={() => setState({ view: `${action}-choice` })}
                >
                  {t(action)}
                </Button>
              </div>
            ))}
          {actions.every((action) => !grants[action]) && (
            <p role="status" className="p-3">
              {t("noAccess")}
            </p>
          )}
        </div>
      )}
      {confirmation && (
        <form
          className="grid gap-3 rounded-lg border border-gray-200 p-3 sm:p-4 dark:border-gray-800"
          onSubmit={(event) => {
            event.preventDefault();
            confirm(confirmation);
          }}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t(confirmation)}
          </h3>
          {confirmation === "password" ? (
            <fieldset className="grid gap-1 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
              <legend className="px-1 text-sm font-semibold">
                {t("sessions")}
              </legend>
              {(["keep", "sign-out"] as const).map((choice) => (
                <label
                  key={choice}
                  className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm"
                >
                  <input
                    type="radio"
                    name={`${id}-sessions`}
                    className="size-4 shrink-0 accent-brand-600"
                    checked={sessions === choice}
                    onChange={() => setSessions(choice)}
                  />
                  {t(choice === "keep" ? "keep" : "signOut")}
                </label>
              ))}
            </fieldset>
          ) : (
            <p className="text-sm leading-relaxed">
              {t(confirmation === "mfa" ? "mfaWhat" : "securityWhat")}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={
                !grants[confirmation] ||
                (confirmation === "password" && !sessions)
              }
            >
              {t("confirm")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={actionsView}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      )}
      {view === "mfa-initiated" && (
        <>
          <Alert role="status" variant="success">
            <InfoCircleIcon aria-hidden="true" />
            <AlertTitle>{t("mfaInitiated")}</AlertTitle>
            <AlertDescription>{t("mfaWhat")}</AlertDescription>
          </Alert>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="justify-self-start"
            onClick={actionsView}
          >
            {t("backToActions")}
          </Button>
        </>
      )}
      {confirmedLock && (
        <Alert
          role={view === "security-locked" ? "status" : "alert"}
          variant="warning"
        >
          <InfoCircleIcon aria-hidden="true" />
          <AlertTitle>{t("securityLocked")}</AlertTitle>
          <AlertDescription>
            {t(
              view === "security-locked"
                ? "securityPending"
                : "securityUnknown",
            )}
          </AlertDescription>
        </Alert>
      )}
      {view === "security-uncertain" && grants.security && (
        <Button
          type="button"
          size="sm"
          className="justify-self-start"
          onClick={() =>
            setState(reconcileEmployeeSecurityReset(grants, state))
          }
        >
          {t("securityRetry")}
        </Button>
      )}
      {view === "security-complete" && (
        <Alert role="status" variant="success">
          <InfoCircleIcon aria-hidden="true" />
          <AlertTitle>{t("securityDone")}</AlertTitle>
          <AlertDescription>{t("securityMfa")}</AlertDescription>
        </Alert>
      )}
      {view === "security-complete" && !temporaryReady && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="justify-self-start"
          onClick={actionsView}
        >
          {t("backToActions")}
        </Button>
      )}
      {temporaryReady && (
        <div className="grid gap-3 rounded-lg border border-gray-200 p-3 sm:p-4 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t("temporaryReady")}
          </h3>
          {view === "password-handoff" && (
            <p role="status">
              {t(state.sessions === "keep" ? "kept" : "signedOut")}
            </p>
          )}
          <p>
            {t("sharePrivately")} {t("shownOnce")}
          </p>
          <div
            className="grid gap-1 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900"
            data-employee-example-password
          >
            <span className="text-xs font-medium">{t("example")}</span>
            <code className="font-mono text-sm tracking-wide text-gray-900 dark:text-gray-100">
              DEMO-4W8Q-L3R6
            </code>
          </div>
          <Button
            type="button"
            size="sm"
            className="justify-self-start"
            onClick={dismissHandoff}
          >
            {t("dismissPassword")}
          </Button>
        </div>
      )}
    </section>
  );
}
