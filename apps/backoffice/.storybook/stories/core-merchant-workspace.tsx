"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ChevronRightIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { useLocale } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { coreMerchantMessages } from "./core-merchant-workspace-messages";
import {
  checkedReadiness,
  createMerchantRequest,
  createMerchantWithCreatorRequest,
  creationResult,
  merchantDiscoveryPage,
  validCreatorName,
  type CreateMerchantRequest,
  type CreationStatus,
  type Merchant,
  type MerchantPage,
  type UnconfirmedCreation,
} from "./core-merchant-workspace-model";

type View =
  | {
      kind:
        | "signed-out"
        | "signup-handoff"
        | "session-checking"
        | "session-unavailable"
        | "email-verification";
    }
  | { kind: "businesses"; page: MerchantPage | undefined }
  | { kind: "new-business"; withCreator: boolean }
  | { kind: "submitting"; request: CreateMerchantRequest }
  | CreationStatus
  | UnconfirmedCreation
  | { kind: "workspace"; merchant: Merchant };

const demoRequest = {
  caller_operation_id: "demo-merchant-creation",
  name: "Frutería La Huerta",
};
const demoCreatedId = "merchant-created";
const initialViews = {
  "sign-in": { kind: "signed-out" },
  "signup-handoff": { kind: "signed-out" },
  "session-checking": { kind: "session-checking" },
  "session-unavailable": { kind: "session-unavailable" },
  "email-verification": { kind: "email-verification" },
  "business-list": { kind: "businesses", page: merchantDiscoveryPage() },
  "business-list-empty": {
    kind: "businesses",
    page: merchantDiscoveryPage(undefined, true),
  },
  "business-list-unavailable": { kind: "businesses", page: undefined },
  "new-business": { kind: "new-business", withCreator: false },
  "new-business-with-creator-names": {
    kind: "new-business",
    withCreator: true,
  },
  "creation-pending": creationResult(demoRequest, {
    merchant_id: demoCreatedId,
    state: "pending",
  }),
  "creation-delayed": creationResult(demoRequest, {
    merchant_id: demoCreatedId,
    state: "pending",
  }),
  "creation-blocked": creationResult(demoRequest, {
    merchant_id: demoCreatedId,
    state: "blocked",
  }),
  "creation-unconfirmed": creationResult(demoRequest, undefined),
  "creation-ready": creationResult(demoRequest, {
    merchant_id: demoCreatedId,
    state: "ready",
  }),
  workspace: {
    kind: "workspace",
    merchant: { merchant_id: "merchant-huerta", name: "Frutería La Huerta" },
  },
} satisfies Record<string, View>;

type Fixture = keyof typeof initialViews;
type Copy = (typeof coreMerchantMessages)["es"];
const primaryButton = "h-auto min-h-11 w-full whitespace-normal sm:w-fit";
const inputError = "text-sm text-red-700 dark:text-red-400";

function CreationForm({
  copy,
  withCreator,
  onBack,
  onSubmit,
}: {
  copy: Copy;
  withCreator: boolean;
  onBack: () => void;
  onSubmit: (request: CreateMerchantRequest) => void;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("Marina");
  const [lastName, setLastName] = useState("Soler");
  const [noLastName, setNoLastName] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const nameInvalid = attempted && !createMerchantRequest(name, "validation");
  const firstInvalid = attempted && !validCreatorName(firstName);
  const lastInvalid = attempted && !noLastName && !validCreatorName(lastName);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const operation = crypto.randomUUID();
    const request = withCreator
      ? createMerchantWithCreatorRequest(
          name,
          operation,
          firstName,
          noLastName ? null : lastName,
        )
      : createMerchantRequest(name, operation);
    if (request) onSubmit(request);
  }

  return (
    <form className="space-y-6" onSubmit={submit} noValidate>
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>{copy.name}</Label>
        <Input
          id={`${id}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="organization"
          placeholder={copy.nameExample}
          required
          aria-invalid={nameInvalid || undefined}
          aria-describedby={nameInvalid ? `${id}-name-error` : undefined}
        />
        {nameInvalid && (
          <p className={inputError} id={`${id}-name-error`} role="alert">
            {copy.invalidName}
          </p>
        )}
      </div>
      {withCreator && (
        <fieldset className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <legend className="pe-2 font-semibold">{copy.creator}</legend>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {copy.creatorHint}
          </p>
          <div className="space-y-2">
            <Label htmlFor={`${id}-first-name`}>{copy.firstName}</Label>
            <Input
              id={`${id}-first-name`}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              autoComplete="given-name"
              required
              aria-invalid={firstInvalid || undefined}
              aria-describedby={firstInvalid ? `${id}-first-error` : undefined}
            />
            {firstInvalid && (
              <p className={inputError} id={`${id}-first-error`} role="alert">
                {copy.invalidCreatorName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-last-name`}>{copy.lastName}</Label>
            <Input
              id={`${id}-last-name`}
              value={noLastName ? "" : lastName}
              onChange={(event) => setLastName(event.target.value)}
              autoComplete="family-name"
              required={!noLastName}
              disabled={noLastName}
              aria-invalid={lastInvalid || undefined}
              aria-describedby={lastInvalid ? `${id}-last-error` : undefined}
            />
            {lastInvalid && (
              <p className={inputError} id={`${id}-last-error`} role="alert">
                {copy.invalidCreatorName}
              </p>
            )}
          </div>
          <Label
            htmlFor={`${id}-no-last-name`}
            className="min-h-11 leading-snug"
          >
            <Checkbox
              id={`${id}-no-last-name`}
              checked={noLastName}
              onCheckedChange={setNoLastName}
            />
            {copy.noLastName}
          </Label>
        </fieldset>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" className={primaryButton}>
          {copy.createBusiness}
        </Button>
        <Button
          type="button"
          variant="outline"
          className={primaryButton}
          onClick={onBack}
        >
          {copy.cancel}
        </Button>
      </div>
    </form>
  );
}

function MerchantChooser({
  copy,
  page,
  onSelect,
  onList,
  onCreate,
}: {
  copy: Copy;
  page: MerchantPage;
  onSelect: (merchant: Merchant) => void;
  onList: (token: string) => void;
  onCreate: () => void;
}) {
  const { previous_page_token, next_page_token } = page.page;
  return (
    <>
      {page.merchants.length ? (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {page.merchants.map((merchant) => (
            <li key={merchant.merchant_id}>
              <Button
                variant="ghost"
                className="h-auto min-h-12 w-full justify-between px-4 py-3 text-start whitespace-normal"
                onClick={() => onSelect(merchant)}
              >
                <span className="min-w-0 break-words">{merchant.name}</span>
                <ChevronRightIcon aria-hidden="true" className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">{copy.empty}</p>
      )}
      {(previous_page_token || next_page_token) && (
        <div className="flex flex-wrap gap-2">
          {previous_page_token && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 sm:min-h-9"
              onClick={() => onList(previous_page_token)}
            >
              {copy.previous}
            </Button>
          )}
          {next_page_token && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 sm:min-h-9"
              onClick={() => onList(next_page_token)}
            >
              {copy.next}
            </Button>
          )}
        </div>
      )}
      <Button onClick={onCreate} className={primaryButton}>
        {copy.createBusiness}
      </Button>
    </>
  );
}

function pause() {
  return new Promise<void>((resolve) => setTimeout(resolve, 250));
}

export function CoreMerchantWorkspace({
  fixture,
  renderWorkspace,
}: {
  fixture: Fixture;
  renderWorkspace?: (
    merchant: Merchant,
    changeMerchant: () => void,
  ) => ReactNode;
}) {
  const locale = useLocale();
  const copy = coreMerchantMessages[isLocale(locale) ? locale : defaultLocale];
  const [view, setView] = useState<View>(() => initialViews[fixture]);
  const [checkingReadiness, setCheckingReadiness] = useState(false);
  const [readinessAttempts, setReadinessAttempts] = useState(0);
  const [publishedMerchant, setPublishedMerchant] = useState<Merchant>();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const empty =
    fixture === "business-list-empty" || fixture.startsWith("new-business");

  function readBusinesses(token?: string) {
    const page = merchantDiscoveryPage(token, empty);
    // The demonstration provider exposes a newly published membership when read.
    const nextPage =
      page && publishedMerchant && !token
        ? { ...page, merchants: [publishedMerchant, ...page.merchants] }
        : page;
    setView({ kind: "businesses", page: nextPage });
  }

  async function signIn() {
    setView({ kind: "session-checking" });
    await pause();
    readBusinesses();
  }

  async function submit(request: CreateMerchantRequest) {
    setView({ kind: "submitting", request });
    await pause();
    setView(
      creationResult(request, { merchant_id: demoCreatedId, state: "pending" }),
    );
  }

  async function check(creation: CreationStatus) {
    setCheckingReadiness(true);
    const attempt = readinessAttempts + 1;
    setReadinessAttempts(attempt);
    await pause();
    const response =
      fixture === "creation-pending" && attempt === 1
        ? undefined
        : {
            merchant_id: creation.merchantId,
            state:
              creation.state === "blocked"
                ? ("blocked" as const)
                : ("ready" as const),
          };
    setView(checkedReadiness(creation, response));
    setCheckingReadiness(false);
  }

  function enterCreated(creation: CreationStatus) {
    const merchant = {
      merchant_id: creation.merchantId,
      name: creation.request.name,
    };
    setPublishedMerchant(merchant);
    setView({ kind: "workspace", merchant });
  }

  let title: string;
  let details: ReactNode;
  switch (view.kind) {
    case "signed-out":
      title = copy.signInTitle;
      details = (
        <>
          <Button className={primaryButton} onClick={signIn}>
            {copy.signIn}
          </Button>
          {fixture === "signup-handoff" && (
            <Button
              className={primaryButton}
              onClick={() => setView({ kind: "signup-handoff" })}
              variant="outline"
            >
              {copy.signUp}
            </Button>
          )}
        </>
      );
      break;
    case "signup-handoff":
      title = copy.signUp;
      details = (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {copy.signUpHandoff}
          </p>
          <Button
            className={primaryButton}
            onClick={() => setView({ kind: "email-verification" })}
          >
            {copy.continueSignUp}
          </Button>
        </>
      );
      break;
    case "session-checking":
      title = copy.checkingSession;
      details = <Spinner aria-label={copy.checkingSession} />;
      break;
    case "session-unavailable":
      title = copy.sessionUnavailable;
      details = (
        <Button className={primaryButton} onClick={signIn}>
          {copy.retry}
        </Button>
      );
      break;
    case "email-verification":
      title = copy.verifyEmail;
      details = (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {copy.verifyEmailHint}
          </p>
          <Button variant="outline" className={primaryButton} onClick={signIn}>
            {copy.signIn}
          </Button>
        </>
      );
      break;
    case "businesses":
      title = view.page ? copy.businesses : copy.listUnavailable;
      details = view.page ? (
        <MerchantChooser
          copy={copy}
          page={view.page}
          onSelect={(merchant) => setView({ kind: "workspace", merchant })}
          onList={readBusinesses}
          onCreate={() => setView({ kind: "new-business", withCreator: false })}
        />
      ) : (
        <Button className={primaryButton} onClick={() => readBusinesses()}>
          {copy.retry}
        </Button>
      );
      break;
    case "new-business":
      title = copy.createBusiness;
      details = (
        <CreationForm
          copy={copy}
          withCreator={view.withCreator}
          onBack={() => readBusinesses()}
          onSubmit={submit}
        />
      );
      break;
    case "submitting":
      title = copy.sendingCreation;
      details = <Spinner aria-label={copy.sendingCreation} />;
      break;
    case "creation-unconfirmed":
      title = copy.unconfirmed;
      details = (
        <>
          <p className="font-medium break-words">{view.request.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {copy.unconfirmedHint}
          </p>
          <Button
            className={primaryButton}
            onClick={() => submit(view.request)}
          >
            {copy.replay}
          </Button>
        </>
      );
      break;
    case "creation": {
      const delayed =
        fixture === "creation-delayed" && view.state === "pending";
      title = checkingReadiness
        ? copy.checkingReadiness
        : delayed
          ? copy.delayed
          : copy[view.state];
      details = (
        <>
          <p className="font-medium break-words">{view.request.name}</p>
          {delayed && !checkingReadiness && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {copy.delayedHint}
            </p>
          )}
          {checkingReadiness ? (
            <Spinner aria-label={copy.checkingReadiness} />
          ) : view.state === "ready" ? (
            <Button
              className={primaryButton}
              onClick={() => enterCreated(view)}
            >
              {copy.enter}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={primaryButton}
              onClick={() => check(view)}
            >
              {view.state === "unavailable" ? copy.retry : copy.checkReadiness}
            </Button>
          )}
        </>
      );
      break;
    }
    case "workspace":
      title = view.merchant.name;
      details = (
        <Button
          variant="outline"
          className={primaryButton}
          onClick={() => readBusinesses()}
        >
          {copy.changeBusiness}
        </Button>
      );
      break;
  }

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [title]);

  if (view.kind === "workspace" && renderWorkspace) {
    return renderWorkspace(view.merchant, () => readBusinesses());
  }

  return (
    <div
      data-core-merchant-view={view.kind}
      className="min-h-dvh bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100"
    >
      <header className="border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-16 max-w-3xl items-center">
          <span className="text-[32px] leading-none font-semibold tracking-[-0.04em]">
            Irin
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <Card>
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-semibold break-words outline-none"
          >
            {title}
          </h1>
          {details}
        </Card>
      </div>
    </div>
  );
}
