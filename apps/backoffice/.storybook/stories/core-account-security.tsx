import { useId, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { InfoCircleIcon } from "@/icons";
import {
  accountSecurityMessages,
  type AccountSecurityCopy,
} from "./core-account-security-messages";
import {
  fixtureToday,
  merchantMfaChange,
  recoveryStatus,
  type MerchantMfaChange,
  type MerchantMfaPolicy,
  type RecoveryStatus,
} from "./core-account-security-model";
import { NavigationPrototype } from "./navigation-prototype";

const actionClass = "h-auto min-h-10 max-w-full whitespace-normal";

type SecurityView =
  | {
      kind:
        "account" | "confirmation" | "creation-incomplete" | "delivery-unknown";
    }
  | { kind: "sessions" | "sign-in" | "forgot-password" }
  | { kind: "status"; status: RecoveryStatus };

const securityFixtures = {
  account: { kind: "account" },
  "recovery-confirmation": { kind: "confirmation" },
  "recovery-pending": { kind: "status", status: "pending" },
  "recovery-action-required": { kind: "status", status: "action_required" },
  "recovery-support-required": { kind: "status", status: "support_required" },
  "recovery-completed": { kind: "status", status: "completed" },
  "recovery-status-unavailable": { kind: "status", status: "unavailable" },
  "recovery-delivery-unknown": { kind: "delivery-unknown" },
  "recovery-creation-incomplete": { kind: "creation-incomplete" },
} as const satisfies Record<string, SecurityView>;
const mfaFixtures = {
  "merchant-mfa-policy": { enabled: false },
  "merchant-mfa-grace": {
    enabled: true,
    since: "2026-11-10",
    until: "2026-12-10",
  },
  "merchant-mfa-required": {
    enabled: true,
    since: "2026-10-01",
    until: "2026-11-01",
  },
  "merchant-mfa-unconfirmed": { enabled: false },
} as const satisfies Record<string, MerchantMfaPolicy>;

type SecurityFixture = keyof typeof securityFixtures;
type MfaFixture = keyof typeof mfaFixtures;
export type CoreAccountSecurityFixture = SecurityFixture | MfaFixture;
const messageClass = "text-sm leading-relaxed text-gray-600 dark:text-gray-300";

function RecoveryContent({
  fixture,
  copy,
}: {
  fixture: SecurityFixture;
  copy: AccountSecurityCopy;
}) {
  const [view, setView] = useState<SecurityView>(
    () => securityFixtures[fixture],
  );
  const [handoffReturn, setHandoffReturn] = useState<SecurityView>({
    kind: "account",
  });

  function openNative(kind: "sessions" | "sign-in" | "forgot-password") {
    setHandoffReturn(view);
    setView({ kind });
  }

  return (
    <section
      className="grid max-w-xl gap-4"
      data-core-account-security={view.kind}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {copy.security}
      </h2>
      {view.kind === "account" && (
        <div className="space-y-4">
          <Button
            className={actionClass}
            variant="outline"
            onClick={() => openNative("sessions")}
          >
            {copy.sessions}
          </Button>
          <div className="grid gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {copy.recovery}
            </h3>
            <p className={messageClass}>{copy.recoveryHint}</p>
            <Button
              className={`${actionClass} justify-self-start`}
              variant="outline"
              onClick={() => setView({ kind: "confirmation" })}
            >
              {copy.confirmRecovery}
            </Button>
          </div>
        </div>
      )}
      {view.kind === "confirmation" && (
        <div className="grid gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {copy.recovery}
          </h3>
          <p className={messageClass}>{copy.confirmation}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              className={actionClass}
              onClick={() => setView({ kind: "status", status: "pending" })}
            >
              {copy.confirmRecovery}
            </Button>
            <Button
              className={actionClass}
              variant="outline"
              onClick={() => setView({ kind: "account" })}
            >
              {copy.cancel}
            </Button>
          </div>
        </div>
      )}
      {view.kind === "status" && (
        <>
          <Alert
            role="status"
            variant={view.status === "completed" ? "success" : "warning"}
            data-account-recovery-status={view.status}
          >
            <InfoCircleIcon aria-hidden="true" />
            <AlertTitle>{copy[view.status]}</AlertTitle>
            <AlertDescription>{copy[`${view.status}Hint`]}</AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2">
            {view.status === "pending" && (
              <Button
                className={actionClass}
                onClick={() =>
                  setView({
                    kind: "status",
                    status: recoveryStatus("action_required"),
                  })
                }
              >
                {copy.consult}
              </Button>
            )}
            {(view.status === "action_required" ||
              view.status === "unavailable") && (
              <Button
                className={actionClass}
                variant="outline"
                onClick={() => openNative("forgot-password")}
              >
                {copy.forgotPassword}
              </Button>
            )}
            {view.status !== "pending" &&
              view.status !== "support_required" && (
                <Button
                  className={actionClass}
                  onClick={() => openNative("sign-in")}
                >
                  {copy.signIn}
                </Button>
              )}
          </div>
        </>
      )}
      {view.kind === "delivery-unknown" && (
        <>
          <Alert role="status" variant="warning">
            <InfoCircleIcon aria-hidden="true" />
            <AlertTitle>{copy.deliveryUnknown}</AlertTitle>
            <AlertDescription>{copy.deliveryUnknownHint}</AlertDescription>
          </Alert>
          <Button
            className={`${actionClass} justify-self-start`}
            variant="outline"
            onClick={() => openNative("sign-in")}
          >
            {copy.signIn}
          </Button>
        </>
      )}
      {view.kind === "creation-incomplete" && (
        <Alert role="status" variant="warning">
          <InfoCircleIcon aria-hidden="true" />
          <AlertTitle>{copy.creationIncomplete}</AlertTitle>
          <AlertDescription>{copy.creationIncompleteHint}</AlertDescription>
        </Alert>
      )}
      {(view.kind === "sessions" ||
        view.kind === "sign-in" ||
        view.kind === "forgot-password") && (
        <div className="grid gap-3" data-account-native-handoff={view.kind}>
          <p className={messageClass}>
            {view.kind === "sessions"
              ? copy.sessionsHandoff
              : view.kind === "sign-in"
                ? copy.signedOut
                : copy.passwordHandoff}
          </p>
          <Button
            className={`${actionClass} justify-self-start`}
            variant="outline"
            onClick={() => setView(handoffReturn)}
          >
            {copy.back}
          </Button>
        </div>
      )}
    </section>
  );
}

type PolicyForm = "enable" | "adjust";

function MfaPolicyContent({
  fixture,
  copy,
  locale,
}: {
  fixture: MfaFixture;
  copy: AccountSecurityCopy;
  locale: string;
}) {
  const id = useId();
  const [policy, setPolicy] = useState<MerchantMfaPolicy>(
    () => mfaFixtures[fixture],
  );
  const [form, setForm] = useState<PolicyForm | null>(null);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState<MerchantMfaChange | null>(null);
  const [outcome, setOutcome] = useState<"saved" | "recheckRefused" | null>(
    null,
  );
  const grace = policy.enabled && policy.until > fixtureToday;
  const proposed =
    form === "enable"
      ? ({ enabled: true, days: value } as const)
      : ({ enabled: true, until: value } as const);

  function beginForm(next: PolicyForm) {
    setForm(next);
    setValue(next === "adjust" && policy.enabled ? policy.until : "");
    setOutcome(null);
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!merchantMfaChange(policy, proposed, true)) return;
    setPending(proposed);
    setForm(null);
  }

  function confirm() {
    if (!pending) return;
    const response = merchantMfaChange(
      policy,
      pending,
      fixture !== "merchant-mfa-unconfirmed",
    );
    setPending(null);
    if (!response) {
      setOutcome("recheckRefused");
      return;
    }
    setPolicy(response);
    setOutcome("saved");
  }

  return (
    <section
      className="grid max-w-xl gap-4"
      data-core-account-security="merchant-mfa"
      data-mfa-policy={
        policy.enabled ? (grace ? "grace" : "required") : "optional"
      }
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {copy.mfa}
        </h2>
        <p className={messageClass}>{copy.mfaHint}</p>
      </div>
      <dl className="grid gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <dt className="font-semibold text-gray-900 dark:text-gray-100">
          {copy[policy.enabled ? (grace ? "grace" : "required") : "off"]}
        </dt>
        {grace && (
          <dd>
            {copy.deadline} ·{" "}
            <time dateTime={policy.until}>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(policy.until))}
            </time>
          </dd>
        )}
      </dl>
      {outcome && <p role="status">{copy[outcome]}</p>}
      {!form && !pending && (
        <div className="flex flex-wrap gap-2">
          {!policy.enabled && (
            <Button className={actionClass} onClick={() => beginForm("enable")}>
              {copy.enable}
            </Button>
          )}
          {grace && (
            <Button
              className={actionClass}
              variant="outline"
              onClick={() => beginForm("adjust")}
            >
              {copy.adjust}
            </Button>
          )}
          {policy.enabled && (
            <Button
              className={actionClass}
              variant="outline"
              onClick={() => {
                setOutcome(null);
                setPending({ enabled: false });
              }}
            >
              {copy.disable}
            </Button>
          )}
        </div>
      )}
      {form && (
        <form
          className="grid gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
          onSubmit={review}
        >
          <Label htmlFor={id}>
            {copy[form === "enable" ? "days" : "newDeadline"]}
          </Label>
          <Input
            id={id}
            type={form === "enable" ? "number" : "date"}
            min={form === "enable" ? 1 : undefined}
            max={form === "enable" ? 60 : undefined}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            required
          />
          {form === "enable" && <p className={messageClass}>{copy.daysHint}</p>}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              className={actionClass}
              disabled={!merchantMfaChange(policy, proposed, true)}
            >
              {copy.continue}
            </Button>
            <Button
              className={actionClass}
              variant="outline"
              type="button"
              onClick={() => setForm(null)}
            >
              {copy.cancel}
            </Button>
          </div>
        </form>
      )}
      {pending && (
        <div
          className="grid gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
          data-account-native-handoff="fresh-mfa"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {copy.recheck}
          </h3>
          <p className={messageClass}>{copy.recheckHint}</p>
          <div className="flex flex-wrap gap-2">
            <Button className={actionClass} onClick={confirm}>
              {copy.recheckAction}
            </Button>
            <Button
              className={actionClass}
              variant="outline"
              onClick={() => setPending(null)}
            >
              {copy.cancel}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function isMfaFixture(
  fixture: CoreAccountSecurityFixture,
): fixture is MfaFixture {
  return Object.hasOwn(mfaFixtures, fixture);
}

export function CoreAccountSecurityPreview({
  fixture,
}: {
  fixture: CoreAccountSecurityFixture;
}) {
  const language = useLocale();
  const locale = isLocale(language) ? language : defaultLocale;
  const copy = accountSecurityMessages[locale];
  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="one"
      businessSettingsContent={
        isMfaFixture(fixture) ? (
          <MfaPolicyContent fixture={fixture} copy={copy} locale={locale} />
        ) : (
          <RecoveryContent fixture={fixture} copy={copy} />
        )
      }
    />
  );
}
