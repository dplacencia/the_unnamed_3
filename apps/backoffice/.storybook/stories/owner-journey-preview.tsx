import { useState, type ComponentProps } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { CoreMerchantWorkspace } from "./core-merchant-workspace";
import { coreHierarchyMessages } from "./core-hierarchy-messages";
import type { Merchant } from "./core-merchant-workspace-model";
import { MerchantInventoryAccess } from "./merchant-inventory-access";
import { inventorySetupMessages } from "./inventory-setup-messages";
import { stockSetupEligible } from "./inventory-setup-model";
import { NavigationPrototype } from "./navigation-prototype";
import type { Destination, StockEntry } from "./navigation-model";
import { pendingBrowsingMessages } from "./pending-movements-browsing-messages";
import {
  creationMessages,
  formatCreationStep,
} from "./products-creation-messages";
import { creationUnit } from "./products-creation-model";
import { receiptMessages } from "./stock-receipt-messages";
import { stockDepartureMessages } from "./stock-departure-messages";
import { StockLookupContent, type LookupProduct } from "./stock-lookup-content";
import type { StockOutcome } from "./stock-lookup-model";
import { ownerFirstUseMessages } from "./owner-first-use-messages";
import { ownerJourneyMessages } from "./owner-journey-messages";
import {
  addJourneyProduct,
  applyJourneyHierarchy,
  applyJourneyMovement,
  applyJourneySetup,
  emptyOwnerJourney,
  journeyAreas,
  journeyStockKey,
  seededOwnerJourney,
  type OwnerJourneyData,
} from "./owner-journey-model";
import { OwnerJourneyPanel, type JourneyPanel } from "./owner-journey-panels";

export type OwnerJourneyFixture =
  | "new-business"
  | "business-selection"
  | "first-visit"
  | "one-area"
  | "choose-area"
  | "no-active-area"
  | "ready-to-receive"
  | "recorded-stock"
  | "trial-paused"
  | "access-unavailable";

const empty = emptyOwnerJourney();
const prepared = seededOwnerJourney("prepared");
const recorded = seededOwnerJourney("recorded");
const principalSite = {
  id: "site-principal",
  name: "Centro principal",
  zone: "Europe/Madrid",
  archived: false,
  areas: [{ id: "area-sales", name: "Sala de ventas", archived: false }],
};
const firstUseSeeds: Partial<Record<OwnerJourneyFixture, OwnerJourneyData>> = {
  "one-area": { ...empty, sites: [principalSite] },
  "choose-area": {
    ...empty,
    sites: [
      principalSite,
      {
        id: "site-north",
        name: "Centro norte",
        zone: "Europe/Madrid",
        archived: false,
        areas: [{ id: "area-stockroom", name: "Almacén", archived: false }],
      },
    ],
  },
  "no-active-area": {
    ...empty,
    sites: [
      {
        ...principalSite,
        areas: principalSite.areas.map((area) => ({ ...area, archived: true })),
      },
    ],
  },
};
const card =
  "max-w-3xl space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800";
const heading = "text-base font-semibold text-gray-900 dark:text-gray-100";
const action = "max-w-full whitespace-normal max-sm:min-h-11";
const trialEndsAt = "2026-12-20T11:00:00Z";

type StockVisitProps = Omit<
  ComponentProps<typeof StockLookupContent>,
  "product"
> & { initialProduct: LookupProduct | null };

type NextStep = {
  choice: string;
  page: Destination;
  label: string;
  hint: string;
  areaLabel?: string;
  panel?: JourneyPanel;
};

function OwnerStockVisit({
  initialProduct,
  onProductChange,
  ...props
}: StockVisitProps) {
  const [product, select] = useState(initialProduct);
  return (
    <StockLookupContent
      {...props}
      product={product}
      onProductChange={(next) => {
        select(next);
        onProductChange(next);
      }}
    />
  );
}

function OwnerWorkspace({
  merchant,
  data,
  replace,
  changeMerchant,
  fixture,
  guidance,
}: {
  merchant: Merchant;
  data: OwnerJourneyData;
  replace: (data: OwnerJourneyData) => void;
  changeMerchant: () => void;
  fixture: OwnerJourneyFixture;
  guidance: boolean;
}) {
  const language = useLocale();
  const locale = isLocale(language) ? language : defaultLocale;
  const copy = ownerJourneyMessages[locale];
  const guide = ownerFirstUseMessages[locale];
  const core = coreHierarchyMessages[locale];
  const receipt = receiptMessages[locale];
  const departure = stockDepartureMessages(locale);
  const creation = creationMessages[locale];
  const setup = inventorySetupMessages[locale];
  const [panel, setPanel] = useState<JourneyPanel | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [selectedStockProduct, setSelectedStockProduct] =
    useState<LookupProduct | null>(() =>
      fixture === "recorded-stock" ? (data.products[0] ?? null) : null,
    );
  const [stockEntry, setStockEntry] = useState<StockEntry>();
  const areas = journeyAreas(data);
  const locations = areas.flatMap((area) =>
    area.active && area.stock.kind === "linked" && area.stock.location.active
      ? [
          {
            id: area.stock.location.id,
            name: `${area.name} · ${area.siteName}`,
          },
        ]
      : [],
  );
  const channelEnabled = guidance
    ? areas.some(
        ({ active, stock }) =>
          active &&
          stock.kind === "linked" &&
          stock.location.active &&
          stock.location.enabledChannelIds.some((id) =>
            data.channels.some((channel) => channel.id === id),
          ),
      )
    : Object.values(data.stock).some(
        ({ active, enabledChannelIds }) => active && enabledChannelIds.length,
      );
  const canMove = locations.length > 0 && data.products.length > 0;
  const phase =
    fixture === "trial-paused"
      ? "paused"
      : fixture === "access-unavailable"
        ? "unavailable"
        : "active";
  const initialRecorded =
    fixture === "recorded-stock" && data.products.length > 0;
  const setupAreas = areas.filter((area) =>
    guidance
      ? stockSetupEligible(area.stock.kind, area.active, area.canSetUpStock)
      : area.active && area.stock.kind === "absent",
  );
  const noStock = !locations.length;
  const confirmed = (next: OwnerJourneyData, message: string) => {
    if (next === data) return false;
    replace(next);
    setLastUpdate(message);
    return true;
  };

  function open(next: JourneyPanel) {
    setLastUpdate("");
    setPanel(next);
  }

  function showBalance(productId: string, locationId: string) {
    setStockEntry({ productId, locationId });
  }

  const access = (
    <MerchantInventoryAccess
      phase={phase}
      trialEndsAt={phase === "active" ? trialEndsAt : undefined}
    />
  );
  function selectNextStep(): NextStep {
    if (!data.sites.length) {
      return {
        choice: "new-site",
        page: "business-settings",
        label: core.newSite,
        hint: guide.newSiteHint,
        panel: { kind: "hierarchy", editor: { kind: "create-site" } },
      };
    }
    if (guidance && phase !== "active") {
      return {
        choice: "core",
        page: "business-settings",
        label: copy.chooseSection,
        hint: guide.coreHint,
      };
    }
    if (noStock) {
      const [area] = setupAreas;
      if (area && (!guidance || setupAreas.length === 1)) {
        return {
          choice: "stock-location",
          page: "inventory-settings",
          label: copy.stockSetup,
          hint: guide.oneAreaHint,
          areaLabel: `${area.name} · ${area.siteName}`,
          panel: { kind: "stock", area },
        };
      }
      if (guidance && setupAreas.length > 1) {
        return {
          choice: "choose-area",
          page: "inventory-settings",
          label: guide.chooseArea,
          hint: guide.chooseAreaHint,
        };
      }
      if (guidance && !areas.some(({ active }) => active)) {
        return {
          choice: "no-active-area",
          page: "business-settings",
          label: copy.sites,
          hint: guide.noActiveAreaHint,
        };
      }
      if (guidance) {
        return {
          choice: "check-setup",
          page: "inventory-settings",
          label: guide.checkSetup,
          hint: guide.checkSetupHint,
        };
      }
    }
    if (!data.products.length) {
      return {
        choice: "product",
        page: "products",
        label: copy.createProduct,
        hint: guide.productHint,
        panel: { kind: "product" },
      };
    }
    if (!data.movements.some(({ kind }) => kind === "receipt")) {
      return {
        choice: "receipt",
        page: "movements",
        label: copy.receipt,
        hint: guide.receiptHint,
        panel: { kind: "receipt" },
      };
    }
    if (!data.channels.length) {
      return {
        choice: "channel",
        page: "inventory-settings",
        label: copy.createChannel,
        hint: guide.channelHint,
        panel: { kind: "channel" },
      };
    }
    if (!channelEnabled) {
      return {
        choice: "enable-channel",
        page: "inventory-settings",
        label: copy.enableChannel,
        hint: guide.enableHint,
        panel: { kind: "enable" },
      };
    }
    if (!data.movements.some(({ kind }) => kind === "departure")) {
      return {
        choice: "departure",
        page: "movements",
        label: copy.departure,
        hint: guide.departureHint,
        panel: { kind: "departure" },
      };
    }
    return {
      choice: "stock",
      page: "stock",
      label: copy.openStock,
      hint: copy.readyHint,
    };
  }
  const nextStep = selectNextStep();

  function continueWith(navigate: (page: Destination) => void) {
    navigate(nextStep.page);
    if (nextStep.panel) open(nextStep.panel);
    else setLastUpdate("");
  }

  return (
    <div data-owner-journey-ready={fixture} data-owner-journey-phase={phase}>
      <NavigationPrototype
        initialPage={initialRecorded ? "stock" : "home"}
        permissionMode={phase === "active" ? "ready" : "no-module"}
        locationCount="several"
        locationOptions={locations.map(({ id, name }) => ({ id, label: name }))}
        hiddenDestinations={["counts"]}
        workspaceScope={`owner-journey:${merchant.merchant_id}`}
        workspaceContext={(navigate) => (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className="font-semibold break-words text-gray-900 dark:text-gray-100"
              data-owner-journey-merchant
            >
              {merchant.name}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className={action}
              onClick={changeMerchant}
            >
              {copy.switchStore}
            </Button>
            {lastUpdate && (
              <div
                role="status"
                className="flex w-full justify-between gap-2 text-sm"
              >
                <span>{lastUpdate}</span>
                <div className="flex flex-wrap justify-end gap-2">
                  {phase === "active" && (
                    <Button
                      data-owner-journey-continue
                      variant="outline"
                      size="sm"
                      className={action}
                      onClick={() => continueWith(navigate)}
                    >
                      {nextStep.label}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLastUpdate("")}
                  >
                    {receipt.close}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        homeContent={(navigate) => (
          <div className="max-w-3xl space-y-4">
            {(!guidance || phase !== "active") && access}
            {guidance ? (
              <section aria-labelledby="first-use-title">
                <Card
                  size="sm"
                  className="gap-4 border-brand-200 bg-brand-50/40 dark:border-brand-500/30 dark:bg-brand-500/10"
                  data-owner-first-use
                  data-owner-first-use-choice={nextStep.choice}
                >
                  <CardHeader>
                    <h2
                      id="first-use-title"
                      className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                    >
                      {nextStep.choice === "stock" ? copy.ready : guide.title}
                    </h2>
                    <CardDescription className="text-gray-700 dark:text-gray-300">
                      {nextStep.hint}
                    </CardDescription>
                    {nextStep.areaLabel && (
                      <p className="font-medium [overflow-wrap:anywhere] text-gray-900 dark:text-gray-100">
                        {nextStep.areaLabel}
                      </p>
                    )}
                  </CardHeader>
                  <Button
                    data-owner-journey-start
                    className={`${action} self-start px-4 py-2`}
                    onClick={() => continueWith(navigate)}
                  >
                    {nextStep.label}
                  </Button>
                </Card>
              </section>
            ) : (
              (phase === "active" || !data.sites.length) && (
                <section className={card}>
                  <h2 className={heading}>
                    {nextStep.panel ? copy.next : copy.ready}
                  </h2>
                  {!nextStep.panel && <p>{copy.readyHint}</p>}
                  <Button
                    data-owner-journey-start
                    className={action}
                    onClick={() => continueWith(navigate)}
                  >
                    {nextStep.label}
                  </Button>
                </section>
              )
            )}
            {guidance && phase === "active" && access}
          </div>
        )}
        modulesContent={access}
        businessSettingsContent={
          <section className={card} data-owner-journey-sites>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className={heading}>{copy.sites}</h2>
              <Button
                className={action}
                onClick={() =>
                  open({ kind: "hierarchy", editor: { kind: "create-site" } })
                }
              >
                {core.newSite}
              </Button>
            </div>
            {!data.sites.length && <p>{copy.noSites}</p>}
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.sites.map((site) => (
                <li
                  key={site.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-2"
                >
                  <div className="space-y-1">
                    <p className="font-semibold break-words">{site.name}</p>
                    <p>{site.zone}</p>
                    <ul>
                      {site.areas.map((area) => (
                        <li key={area.id} className="break-words">
                          {area.name}
                          {guidance && area.archived && (
                            <span className="ms-2 text-xs">
                              {core.archived}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(!guidance || !site.archived) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={action}
                      onClick={() =>
                        open({
                          kind: "hierarchy",
                          editor: { kind: "create-area", site },
                        })
                      }
                    >
                      {core.newArea}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        }
        inventorySettingsContent={
          <div className="max-w-3xl space-y-3" data-owner-journey-setup>
            <section className={card}>
              <h2 className={heading}>{setup.areas}</h2>
              {!areas.length && <p>{copy.needArea}</p>}
              {guidance && nextStep.choice === "check-setup" && (
                <p>{guide.checkSetupHint}</p>
              )}
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2"
                  >
                    <div>
                      <p className="font-medium break-words">
                        {area.name} · {area.siteName}
                      </p>
                      {area.stock.kind === "linked" && (
                        <>
                          <p className="text-xs">{area.stock.location.id}</p>
                          <ul>
                            {area.stock.location.enabledChannelIds.map((id) => (
                              <li key={id}>
                                {
                                  data.channels.find(
                                    (channel) => channel.id === id,
                                  )?.name
                                }
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    {(guidance
                      ? setupAreas.includes(area)
                      : area.stock.kind === "absent") && (
                      <Button
                        className={action}
                        variant="outline"
                        size="sm"
                        onClick={() => open({ kind: "stock", area })}
                      >
                        {copy.stockSetup}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <section className={card}>
              <h2 className={heading}>{copy.channels}</h2>
              {data.channels.length ? (
                <ul>
                  {data.channels.map(({ id, name }) => (
                    <li className="break-words" key={id}>
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{copy.noChannels}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className={action}
                  onClick={() => open({ kind: "channel" })}
                >
                  {copy.createChannel}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={action}
                  disabled={!data.channels.length || noStock}
                  onClick={() => open({ kind: "enable" })}
                >
                  {copy.enableChannel}
                </Button>
              </div>
            </section>
          </div>
        }
        productsContent={
          <section className={card} data-owner-journey-products>
            <Button
              className={action}
              onClick={() => open({ kind: "product" })}
            >
              {copy.createProduct}
            </Button>
            {!data.products.length ? (
              <p>{copy.noProducts}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>{receipt.product}</TableCell>
                    <TableCell isHeader>{receipt.unit}</TableCell>
                    <TableCell isHeader>
                      <span className="sr-only">{copy.receipt}</span>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {data.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="break-words">
                        {product.name}
                      </TableCell>
                      <TableCell>{creation.unitLabels[product.unit]}</TableCell>
                      <TableCell className="text-end">
                        <Button
                          size="sm"
                          className={action}
                          variant="link"
                          disabled={noStock}
                          onClick={() => open({ kind: "receipt", product })}
                        >
                          {copy.receipt}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </section>
        }
        movementsBrowsing={{
          allLocationsLabel: pendingBrowsingMessages(locale).allLocations,
          render: (scope) => {
            const visibleMovements = data.movements.filter(
              ({ locationId }) =>
                scope?.id === "all" || scope?.id === locationId,
            );
            return (
              <section className={card} data-owner-journey-movements>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={action}
                    disabled={!canMove}
                    onClick={() => open({ kind: "receipt" })}
                  >
                    {copy.receipt}
                  </Button>
                  <Button
                    className={action}
                    variant="outline"
                    disabled={!canMove || !channelEnabled}
                    onClick={() => open({ kind: "departure" })}
                  >
                    {copy.departure}
                  </Button>
                </div>
                {!canMove && <p>{copy.needMovementSetup}</p>}
                {canMove && !channelEnabled && <p>{copy.needChannel}</p>}
                {visibleMovements.length > 0 && (
                  <>
                    <h2 className={heading}>{copy.lastMovements}</h2>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                      {visibleMovements.map((movement) => (
                        <li
                          key={movement.id}
                          className="flex flex-wrap items-center justify-between gap-2 py-2"
                          data-owner-journey-movement
                        >
                          <div>
                            <p className="font-medium">
                              {movement.kind === "receipt"
                                ? receipt.applied
                                : departure.applied}
                            </p>
                            <p>
                              {movement.product.name} ·{" "}
                              {formatCreationStep(movement.quantity, locale)}{" "}
                              {movement.product.unit === "piece"
                                ? receipt.pieceSymbol
                                : creationUnit(movement.product.unit)?.symbol}
                            </p>
                            <p>
                              {
                                locations.find(
                                  ({ id }) => id === movement.locationId,
                                )?.name
                              }
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className={action}
                            variant="link"
                            onClick={() =>
                              showBalance(
                                movement.product.id,
                                movement.locationId,
                              )
                            }
                          >
                            {copy.stockLink}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            );
          },
        }}
        stockLookup={{
          scope: merchant.merchant_id,
          entry: stockEntry,
          render: (location, contextProduct) => (
            <OwnerStockVisit
              key={contextProduct ?? "ordinary"}
              products={data.products}
              initialProduct={
                contextProduct
                  ? (data.products.find(({ id }) => id === contextProduct) ??
                    null)
                  : selectedStockProduct
              }
              onProductChange={setSelectedStockProduct}
              location={location}
              read={async ({
                productId,
                locationId,
              }): Promise<StockOutcome> => {
                const product = data.products.find(
                  ({ id }) => id === productId,
                );
                if (!product || !locations.some(({ id }) => id === locationId))
                  return { kind: "invalid" };
                const quantity =
                  data.balances[journeyStockKey(productId, locationId)];
                return quantity === undefined
                  ? { kind: "no-record" }
                  : {
                      kind: "balance",
                      balance: {
                        amount: quantity,
                        unit:
                          creationUnit(product.unit)?.symbol ?? product.unit,
                      },
                    };
              }}
            />
          ),
        }}
      />
      {panel && (
        <OwnerJourneyPanel
          key={panel.kind}
          panel={panel}
          data={data}
          locale={locale}
          locations={locations}
          close={() => setPanel(null)}
          saveHierarchy={(change) =>
            confirmed(applyJourneyHierarchy(data, change), core.saved)
          }
          saveSetup={(command) =>
            confirmed(applyJourneySetup(data, command), copy.setupComplete)
          }
          saveProduct={(draft) =>
            confirmed(addJourneyProduct(data, draft), creation.created)
          }
          saveMovement={(draft, kind, channel) =>
            confirmed(
              applyJourneyMovement(data, draft, kind, channel),
              kind === "departure" ? departure.applied : receipt.applied,
            )
          }
        />
      )}
    </div>
  );
}

export function OwnerJourneyPreview({
  fixture,
  guidance = false,
}: {
  fixture: OwnerJourneyFixture;
  guidance?: boolean;
}) {
  const [byMerchant, setByMerchant] = useState<
    Readonly<Record<string, OwnerJourneyData>>
  >({});
  const seed =
    fixture === "ready-to-receive" ||
    fixture === "trial-paused" ||
    fixture === "access-unavailable"
      ? prepared
      : fixture === "recorded-stock"
        ? recorded
        : (firstUseSeeds[fixture] ?? empty);
  return (
    <CoreMerchantWorkspace
      fixture={
        fixture === "new-business"
          ? "new-business"
          : fixture === "business-selection"
            ? "business-list"
            : "workspace"
      }
      renderWorkspace={(merchant, changeMerchant) => (
        <OwnerWorkspace
          key={merchant.merchant_id}
          merchant={merchant}
          fixture={fixture}
          guidance={guidance}
          changeMerchant={changeMerchant}
          data={
            byMerchant[merchant.merchant_id] ??
            (merchant.merchant_id === "merchant-huerta" ? seed : empty)
          }
          replace={(data) =>
            setByMerchant((current) => ({
              ...current,
              [merchant.merchant_id]: data,
            }))
          }
        />
      )}
    />
  );
}
