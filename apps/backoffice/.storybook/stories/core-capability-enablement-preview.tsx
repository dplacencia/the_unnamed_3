import { useLocale } from "next-intl";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoCircleIcon } from "@/icons";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { capabilityEnablementMessages } from "./core-capability-enablement-messages";
import {
  applyCapabilityCommand,
  capabilityEnablementFixture,
  type CapabilityFixture,
  type CoreCapability,
} from "./core-capability-enablement-model";
import { NavigationPrototype } from "./navigation-prototype";

export function CoreCapabilityEnablementPreview({
  fixture,
}: {
  fixture: CapabilityFixture;
}) {
  const currentLocale = useLocale();
  const t = capabilityEnablementMessages(
    isLocale(currentLocale) ? currentLocale : defaultLocale,
  );
  const [preview, setPreview] = useState(() =>
    capabilityEnablementFixture(fixture),
  );
  const { state, outcome } = preview;
  const canManage = state.management === "allowed";
  const authorityUnavailable = state.management === "unavailable";

  function changeCapability(capability: CoreCapability, enabled: boolean) {
    if (!canManage) return;
    const response = applyCapabilityCommand(state, capability, enabled);
    setPreview({
      state:
        response.kind === "confirmed"
          ? { ...state, configuration: response.configuration }
          : state,
      outcome: response,
    });
  }

  function capabilityRow(capability: CoreCapability) {
    const enabled = state.configuration[capability];
    const name = t(capability);
    const description = t(`${capability}Description`);
    return (
      <div
        className="grid min-h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_max-content_minmax(7rem,auto)] sm:px-4"
        data-core-capability={capability}
        data-enabled={enabled}
      >
        <div className="min-w-0">
          <h3 className="text-base font-semibold break-words text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm break-words text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
        <Badge size="sm" color={enabled ? "primary" : "gray"}>
          {enabled ? t("active") : t("inactive")}
        </Badge>
        {canManage && (
          <Button
            aria-label={t(
              enabled ? "deactivateAction" : "activateAction",
              name,
            )}
            className="col-span-2 w-fit max-sm:min-h-11 sm:col-span-1 sm:justify-self-end"
            type="button"
            size="sm"
            variant={enabled ? "outline" : "default"}
            onClick={() => changeCapability(capability, !enabled)}
          >
            {enabled ? t("deactivate") : t("activate")}
          </Button>
        )}
      </div>
    );
  }

  const blocked =
    outcome?.kind === "missing-prerequisite" ||
    outcome?.kind === "enabled-dependent";

  return (
    <NavigationPrototype
      initialPage="modules"
      permissionMode="ready"
      locationCount="one"
      modulesContent={
        <div
          className="grid w-full max-w-4xl gap-3"
          data-core-capability-enablement-ready={fixture}
        >
          {state.inventoryProvider === "unavailable" && (
            <Alert
              role="status"
              variant="warning"
              data-core-capability-provider="unavailable"
            >
              <InfoCircleIcon aria-hidden="true" />
              <AlertTitle>{t("providerTitle")}</AlertTitle>
              <AlertDescription>{t("providerDescription")}</AlertDescription>
            </Alert>
          )}
          {authorityUnavailable && (
            <Alert
              variant="warning"
              data-core-capability-authority="unavailable"
            >
              <InfoCircleIcon aria-hidden="true" />
              <AlertTitle>{t("managementUnavailable")}</AlertTitle>
              <AlertDescription>{t("lastConfirmed")}</AlertDescription>
            </Alert>
          )}
          {state.management === "denied" && (
            <p role="status">{t("readOnly")}</p>
          )}
          {blocked && (
            <Alert
              variant="warning"
              data-core-capability-outcome={outcome.kind}
            >
              <InfoCircleIcon aria-hidden="true" />
              <AlertTitle>
                {t(
                  outcome.kind === "missing-prerequisite"
                    ? "missingTitle"
                    : "dependentTitle",
                )}
              </AlertTitle>
              <AlertDescription>
                {t(
                  outcome.kind === "missing-prerequisite"
                    ? "requiresCatalogue"
                    : "usedByPricing",
                )}
              </AlertDescription>
            </Alert>
          )}
          {outcome?.kind === "confirmed" && (
            <Alert
              role="status"
              variant="success"
              data-core-capability-outcome="confirmed"
            >
              <InfoCircleIcon aria-hidden="true" />
              <AlertTitle>
                {t(
                  outcome.enabled ? "activated" : "deactivated",
                  t(outcome.capability),
                )}
              </AlertTitle>
            </Alert>
          )}
          <section aria-label={t("inventory")} className="grid gap-1.5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t("inventory")}
            </h2>
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {capabilityRow("catalogue")}
              {capabilityRow("stock")}
            </div>
          </section>
          <section
            aria-label={t("pricing")}
            className="rounded-lg border border-gray-200 dark:border-gray-800"
          >
            {capabilityRow("pricing")}
          </section>
        </div>
      }
    />
  );
}
