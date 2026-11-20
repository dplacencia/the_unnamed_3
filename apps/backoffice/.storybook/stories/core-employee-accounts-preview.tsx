import { useLocale } from "next-intl";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  employeeMessages,
  type EmployeeCopy,
} from "./core-employee-accounts-messages";
import {
  accountAction,
  administrativeChoices,
  administrativeResource,
  createEmployeeDraft,
  employeeName,
  employees,
  moveAdministrativeLocation,
  qualifiedUsername,
  restoreEmployee,
  sampleMerchantCode,
  sampleTemporaryPassword,
  updateDisabledOutcome,
  type AdministrativeResource,
  type EmployeeAccount,
  type EmployeeProfile,
} from "./core-employee-accounts-model";
import { CoreEmployeeCredentialsPanel } from "./core-employee-credentials-preview";
import { NavigationPrototype } from "./navigation-prototype";

export const employeeFixtures = [
  "overview",
  "new-employee",
  "temporary-password",
  "move-location",
  "disable",
  "provider-unavailable",
  "disable-unconfirmed",
  "reactivate",
  "delegated",
  "reactivate-denied",
] as const;
type Fixture = (typeof employeeFixtures)[number];
type AccountView =
  | "details"
  | "handoff"
  | "move"
  | "disable"
  | "reconcile"
  | "restore"
  | "credentials";
type View =
  { kind: "overview" | "new" } | { kind: AccountView; employeeId: string };
type Notice = { key: keyof EmployeeCopy; error?: boolean };
const frame =
  "min-w-0 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-5";
const buttonClass = "h-auto min-h-9 whitespace-normal max-sm:min-h-11";
const subdued = "text-sm text-gray-600 dark:text-gray-400";

function locationLabel(copy: EmployeeCopy, resource: AdministrativeResource) {
  if (resource.kind === "site") return `${copy.site} · ${resource.name}`;
  return `${copy.area} · ${administrativeResource(resource.siteId).name} / ${resource.name}`;
}

function LocationPicker({
  copy,
  value,
  choices,
  onChange,
}: {
  copy: EmployeeCopy;
  value: string;
  choices: readonly AdministrativeResource[];
  onChange: (id: string) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{copy.administrative}</Label>
      <Select
        value={value || null}
        onValueChange={(selected) => onChange(selected ?? "")}
      >
        <SelectTrigger
          id={id}
          className="w-full"
          aria-describedby={`${id}-hint`}
        >
          <SelectValue placeholder={copy.select} />
        </SelectTrigger>
        <SelectContent>
          {choices.map((resource) => (
            <SelectItem key={resource.id} value={resource.id}>
              {locationLabel(copy, resource)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id={`${id}-hint`} className={subdued}>
        {copy.locationHint}
      </p>
    </div>
  );
}

function Actions({
  copy,
  primary,
  onBack,
  disabled = false,
  destructive = false,
}: {
  copy: EmployeeCopy;
  primary: string;
  onBack: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="submit"
        className={buttonClass}
        disabled={disabled}
        variant={destructive ? "destructive" : "default"}
      >
        {primary}
      </Button>
      <Button
        type="button"
        variant="outline"
        className={buttonClass}
        onClick={onBack}
      >
        {copy.back}
      </Button>
    </div>
  );
}

function ProvisionForm({
  copy,
  profile,
  accounts,
  onProvision,
  onBack,
}: {
  copy: EmployeeCopy;
  profile: EmployeeProfile;
  accounts: readonly EmployeeAccount[];
  onProvision: (account: EmployeeAccount) => void;
  onBack: () => void;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const account = createEmployeeDraft(
    profile,
    name,
    lastName,
    username,
    location,
    accounts,
  );
  const usernameInvalid =
    submitted &&
    (!/^[a-zA-Z0-9]{3,32}$/.test(username) ||
      accounts.some((item) => item.username === username.toLowerCase()));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (account) onProvision(account);
  }
  return (
    <form className={frame} onSubmit={submit} noValidate>
      <h2 className="text-xl font-semibold">{copy.add}</h2>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-name`}>{copy.name}</Label>
          <Input
            id={`${id}-name`}
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-last`}>{copy.lastName}</Label>
          <Input
            id={`${id}-last`}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-username`}>{copy.username}</Label>
        <Input
          id={`${id}-username`}
          value={username}
          required
          aria-describedby={`${id}-username-help`}
          aria-invalid={usernameInvalid || undefined}
          autoCapitalize="none"
          onChange={(event) => setUsername(event.target.value)}
        />
        <p id={`${id}-username-help`} className={subdued}>
          {usernameInvalid ? copy.usernameInvalid : copy.usernameHint}
        </p>
        {/^[a-zA-Z0-9]{3,32}$/.test(username) && (
          <p className="text-sm">
            {copy.signIn}{" "}
            <code>
              {username.toLowerCase()}.{sampleMerchantCode}
            </code>
          </p>
        )}
      </div>
      <LocationPicker
        copy={copy}
        value={location}
        choices={administrativeChoices(profile)}
        onChange={setLocation}
      />
      {submitted && !account && (
        <Alert variant="destructive">
          <AlertDescription>{copy.formError}</AlertDescription>
        </Alert>
      )}
      <Actions copy={copy} primary={copy.add} onBack={onBack} />
    </form>
  );
}

function MoveForm({
  copy,
  profile,
  account,
  onSave,
  onBack,
}: {
  copy: EmployeeCopy;
  profile: EmployeeProfile;
  account: EmployeeAccount;
  onSave: (account: EmployeeAccount) => void;
  onBack: () => void;
}) {
  const [destination, setDestination] = useState<string>(
    account.administrativeId,
  );
  const choices = administrativeChoices(profile);
  const selected = choices.find(({ id }) => id === destination);
  const move =
    selected && moveAdministrativeLocation(profile, account, selected.id);
  return (
    <form
      className={frame}
      onSubmit={(event) => {
        event.preventDefault();
        if (move) onSave(move);
      }}
    >
      <h2 className="text-xl font-semibold">{copy.change}</h2>
      <p className="font-medium">{employeeName(account)}</p>
      <LocationPicker
        copy={copy}
        value={destination}
        choices={choices}
        onChange={setDestination}
      />
      <Actions
        copy={copy}
        primary={copy.save}
        onBack={onBack}
        disabled={!move}
      />
    </form>
  );
}

function DecideForm<T extends string>({
  copy,
  title,
  question,
  options,
  account,
  onConfirm,
  onBack,
  children,
}: {
  copy: EmployeeCopy;
  title: string;
  question: string;
  options: readonly { value: T; label: string }[];
  account: EmployeeAccount;
  onConfirm: (choice: T) => void;
  onBack: () => void;
  children?: ReactNode;
}) {
  const id = useId();
  const [choice, setChoice] = useState<T>();
  return (
    <form
      className={frame}
      onSubmit={(event) => {
        event.preventDefault();
        if (choice) onConfirm(choice);
      }}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="font-medium">{employeeName(account)}</p>
      {children}
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">{question}</legend>
        {options.map(({ value, label }) => (
          <label
            key={value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
          >
            <input
              type="radio"
              name={`${id}-choice`}
              checked={choice === value}
              onChange={() => setChoice(value)}
              className="size-4 shrink-0 text-brand-500 focus:ring-brand-500"
            />
            {label}
          </label>
        ))}
      </fieldset>
      <Actions
        copy={copy}
        primary={copy.confirmIntent}
        onBack={onBack}
        disabled={!choice}
      />
    </form>
  );
}

function initialView(fixture: Fixture): View {
  switch (fixture) {
    case "new-employee":
      return { kind: "new" };
    case "temporary-password":
      return { kind: "handoff", employeeId: "alba" };
    case "move-location":
      return { kind: "move", employeeId: "alba" };
    case "disable":
      return { kind: "disable", employeeId: "alba" };
    case "provider-unavailable":
    case "disable-unconfirmed":
      return { kind: "details", employeeId: "alba" };
    case "reactivate":
    case "reactivate-denied":
      return { kind: "restore", employeeId: "pablo" };
    default:
      return { kind: "overview" };
  }
}

export function CoreEmployeeAccountContent({
  fixture = "overview",
  onBackToTeam,
  onConfirmedProvision,
}: {
  fixture?: Fixture;
  onBackToTeam?: () => void;
  onConfirmedProvision?: (account: EmployeeAccount) => void;
}) {
  const locale = useLocale();
  const copy = employeeMessages[isLocale(locale) ? locale : defaultLocale];
  const profile: EmployeeProfile =
    fixture === "delegated" || fixture === "reactivate-denied"
      ? "delegate"
      : "owner";
  const [view, setView] = useState<View>(() => initialView(fixture));
  const [accounts, setAccounts] = useState(() =>
    fixture === "disable-unconfirmed"
      ? employees.map((account) =>
          account.id === "alba"
            ? updateDisabledOutcome(account, "unconfirmed")
            : account,
        )
      : employees,
  );
  const [notice, setNotice] = useState<Notice | null>(
    fixture === "provider-unavailable"
      ? { key: "providerUnavailable", error: true }
      : null,
  );
  const [credentialAccounts, setCredentialAccounts] = useState<
    readonly string[]
  >([]);
  const account =
    "employeeId" in view
      ? accounts.find(({ id }) => id === view.employeeId)
      : undefined;

  function show(kind: AccountView, selected: EmployeeAccount) {
    setNotice(null);
    if (kind === "credentials") {
      setCredentialAccounts((current) =>
        current.includes(selected.id) ? current : [...current, selected.id],
      );
    }
    setView({ kind, employeeId: selected.id });
  }

  function overview() {
    setNotice(null);
    setView({ kind: "overview" });
  }

  function saveAccount(next: EmployeeAccount, feedback: Notice) {
    setAccounts((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    );
    setView({ kind: "details", employeeId: next.id });
    setNotice(feedback);
  }

  function disable(target: EmployeeAccount) {
    if (!accountAction(profile, target, "disable")) return;
    const outcome =
      fixture === "provider-unavailable"
        ? "unavailable"
        : fixture === "disable-unconfirmed"
          ? "unconfirmed"
          : "confirmed";
    saveAccount(updateDisabledOutcome(target, outcome), {
      key:
        outcome === "unavailable"
          ? "providerUnavailable"
          : outcome === "unconfirmed"
            ? "unconfirmed"
            : "disabledNotice",
      error: outcome !== "confirmed",
    });
  }

  let content: ReactNode;
  if (view.kind === "new") {
    content = (
      <ProvisionForm
        copy={copy}
        profile={profile}
        accounts={accounts}
        onBack={overview}
        onProvision={(created) => {
          setAccounts((current) => [created, ...current]);
          show("handoff", created);
          onConfirmedProvision?.(created);
        }}
      />
    );
  } else if (account) {
    const back = () => show("details", account);
    switch (view.kind) {
      case "handoff":
        content = (
          <div className={frame}>
            <h2 className="text-xl font-semibold">{copy.handoff}</h2>
            <p className="font-medium">{employeeName(account)}</p>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className={subdued}>{copy.signIn}</dt>
                <dd>
                  <code>{qualifiedUsername(account)}</code>
                </dd>
              </div>
              <div>
                <dt className={subdued}>{copy.handoff}</dt>
                <dd>
                  <code
                    data-core-employee-secret
                    className="[overflow-wrap:anywhere]"
                  >
                    {sampleTemporaryPassword}
                  </code>
                </dd>
              </div>
            </dl>
            <p className={subdued}>
              {copy.handoffHint} {copy.privateNotice}
            </p>
            <Button className={buttonClass} onClick={back}>
              {copy.handoffClose}
            </Button>
          </div>
        );
        break;
      case "move":
        content = (
          <MoveForm
            copy={copy}
            profile={profile}
            account={account}
            onBack={back}
            onSave={(next) => saveAccount(next, { key: "locationSaved" })}
          />
        );
        break;
      case "disable":
        content = (
          <form
            className={frame}
            onSubmit={(event) => {
              event.preventDefault();
              disable(account);
            }}
          >
            <h2 className="text-xl font-semibold">{copy.disable}</h2>
            <p className="font-medium">{employeeName(account)}</p>
            <p className={subdued}>{copy.disableHint}</p>
            <Actions
              copy={copy}
              primary={copy.disable}
              onBack={back}
              destructive
            />
          </form>
        );
        break;
      case "reconcile":
        content = (
          <DecideForm
            copy={copy}
            title={copy.reconcile}
            question={copy.intendedState}
            account={account}
            onBack={back}
            options={[
              { value: "enabled", label: copy.leaveActive },
              { value: "disabled", label: copy.disable },
            ]}
            onConfirm={(state) => {
              if (!accountAction(profile, account, "reconcile")) return;
              // The synthetic response resolves the provider outcome and confirms this intended state.
              saveAccount(
                { ...account, state },
                {
                  key: state === "enabled" ? "enabledNotice" : "disabledNotice",
                },
              );
            }}
          >
            <p className={subdued}>{copy.unconfirmed}</p>
          </DecideForm>
        );
        break;
      case "restore":
        content = (
          <DecideForm
            copy={copy}
            title={copy.reactivate}
            question={copy.roleChoice}
            account={account}
            onBack={back}
            options={[
              { value: "keep", label: copy.keep },
              { value: "discard", label: copy.discard },
            ]}
            onConfirm={(choice) => {
              const result = restoreEmployee(profile, account, choice);
              if (result) saveAccount(result, { key: "restored" });
              else setNotice({ key: "denied", error: true });
            }}
          >
            {profile === "owner" && (
              <ul className={`${subdued} list-disc ps-5`}>
                {account.roles
                  .filter((role) => !role.deleted)
                  .map((role) => (
                    <li key={`${role.name}-${role.scopeId}`}>
                      {role.name} ·{" "}
                      {locationLabel(
                        copy,
                        administrativeResource(role.scopeId),
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </DecideForm>
        );
        break;
      case "credentials":
        content = null;
        break;
      default:
        content = (
          <div className={frame} data-core-employee-state={account.state}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold [overflow-wrap:anywhere]">
                {employeeName(account)}
              </h2>
              <Badge
                size="sm"
                color={
                  account.state === "enabled"
                    ? "success"
                    : account.state === "blocked"
                      ? "warning"
                      : "gray"
                }
              >
                {copy[account.state]}
              </Badge>
            </div>
            {account.state === "blocked" && (
              <Alert variant="warning">
                <AlertDescription>{copy.unconfirmed}</AlertDescription>
              </Alert>
            )}
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className={subdued}>{copy.signIn}</dt>
                <dd>
                  <code>{qualifiedUsername(account)}</code>
                </dd>
              </div>
              <div>
                <dt className={subdued}>{copy.administrative}</dt>
                <dd>
                  {locationLabel(
                    copy,
                    administrativeResource(account.administrativeId),
                  )}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              {accountAction(profile, account, "move") && (
                <Button
                  variant="outline"
                  className={buttonClass}
                  onClick={() => show("move", account)}
                >
                  {copy.change}
                </Button>
              )}
              {profile === "owner" && account.state === "enabled" && (
                <Button
                  variant="outline"
                  className={buttonClass}
                  onClick={() => show("credentials", account)}
                >
                  {copy.credentials}
                </Button>
              )}
              {accountAction(profile, account, "disable") && (
                <Button
                  variant="outline"
                  className={buttonClass}
                  onClick={() => show("disable", account)}
                >
                  {copy.disable}
                </Button>
              )}
              {accountAction(profile, account, "reconcile") && (
                <Button
                  className={buttonClass}
                  onClick={() => show("reconcile", account)}
                >
                  {copy.reconcile}
                </Button>
              )}
              {accountAction(profile, account, "restore") && (
                <Button
                  className={buttonClass}
                  onClick={() => show("restore", account)}
                >
                  {copy.reactivate}
                </Button>
              )}
              <Button
                variant="ghost"
                className={buttonClass}
                onClick={overview}
              >
                {copy.back}
              </Button>
            </div>
          </div>
        );
    }
  } else {
    content = (
      <>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{copy.title}</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              className={buttonClass}
              onClick={() => {
                setNotice(null);
                setView({ kind: "new" });
              }}
            >
              {copy.add}
            </Button>
            {onBackToTeam && (
              <Button
                variant="outline"
                className={buttonClass}
                onClick={onBackToTeam}
              >
                {copy.team}
              </Button>
            )}
          </div>
        </div>
        <ul
          className="min-w-0 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
          aria-label={copy.title}
        >
          {accounts.map((listed) => (
            <li
              key={listed.id}
              data-core-employee={listed.id}
              className="grid min-w-0 gap-2 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-center sm:px-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium [overflow-wrap:anywhere]">
                  {employeeName(listed)}
                </p>
                <code className={`${subdued} [overflow-wrap:anywhere]`}>
                  {qualifiedUsername(listed)}
                </code>
              </div>
              <div className="min-w-0 space-y-1">
                <p className={subdued}>
                  {locationLabel(
                    copy,
                    administrativeResource(listed.administrativeId),
                  )}
                </p>
                <Badge
                  size="sm"
                  color={
                    listed.state === "enabled"
                      ? "success"
                      : listed.state === "blocked"
                        ? "warning"
                        : "gray"
                  }
                >
                  {copy[listed.state]}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`${buttonClass} justify-self-start`}
                onClick={() => show("details", listed)}
              >
                {copy.open}
              </Button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section
      data-core-employee-view={view.kind}
      className="mx-auto w-full max-w-4xl space-y-3 px-3 py-4 sm:px-5"
    >
      {notice && (
        <Alert
          role={notice.error ? "alert" : "status"}
          variant={notice.error ? "destructive" : "success"}
        >
          <AlertDescription>{copy[notice.key]}</AlertDescription>
        </Alert>
      )}
      {content}
      {accounts
        .filter((item) => credentialAccounts.includes(item.id))
        .map((item) => (
          <div
            key={item.id}
            hidden={view.kind !== "credentials" || account?.id !== item.id}
          >
            <CoreEmployeeCredentialsPanel
              employeeName={employeeName(item)}
              grants={{
                password: profile === "owner",
                mfa: profile === "owner",
                security: profile === "owner",
              }}
              onBack={() => show("details", item)}
            />
          </div>
        ))}
    </section>
  );
}

export function CoreEmployeeAccountsPreview({ fixture }: { fixture: Fixture }) {
  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="several"
      businessSettingsContent={<CoreEmployeeAccountContent fixture={fixture} />}
    />
  );
}
