"use client";

import { useReducer, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTheme } from "@/context/theme-context";
import {
  ArrowLeftRightIcon,
  BoxIcon,
  CheckCircleIcon,
  GearIcon,
  InfoCircleIcon,
  LayoutGridIcon,
  ListIcon,
  MenuTwoIcon,
  MoonIcon,
  SunIcon,
  HorizontalDotsIcon,
  ChevronDownIcon,
  XIcon,
} from "@/icons";
import { cn } from "@/utils";
import {
  accessFor,
  initialNavigation,
  inventoryPages,
  locationPages,
  navigate,
  resolveLocation,
  restoreChoices,
  type Destination,
  type LocationPage,
  type PermissionMode,
  type Choices,
} from "./navigation-model";
import "./navigation-prototype.css";

const labels: Record<Destination, string> = {
  home: "navHome",
  products: "navProducts",
  stock: "navStock",
  movements: "navMovements",
  counts: "navCounts",
  "inventory-settings": "navInventorySettings",
  modules: "navModules",
  "business-settings": "navBusinessSettings",
  help: "navHelp",
};
const icons = {
  home: LayoutGridIcon,
  products: BoxIcon,
  stock: ListIcon,
  movements: ArrowLeftRightIcon,
  counts: CheckCircleIcon,
  "inventory-settings": GearIcon,
  modules: LayoutGridIcon,
  "business-settings": GearIcon,
  help: InfoCircleIcon,
};
export interface NavigationPrototypeProps {
  initialPage: Destination;
  permissionMode: PermissionMode;
  locationCount: "one" | "several";
}

export function NavigationPrototype(props: NavigationPrototypeProps) {
  return (
    <SidebarProvider
      data-navigation-shell
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <Workspace {...props} />
    </SidebarProvider>
  );
}

function Workspace({
  initialPage,
  permissionMode,
  locationCount,
}: NavigationPrototypeProps) {
  const t = useTranslations("catalogue");
  const headerT = useTranslations("header");
  const { theme, toggleTheme } = useTheme();
  const [footerOpen, setFooterOpen] = useState(true);
  const {
    isMobile,
    open,
    isHovered,
    openMobile,
    toggleSidebar,
    setOpen,
    setOpenMobile,
  } = useSidebar();
  const showLabels = open || isHovered || isMobile;
  // This namespace belongs only to this simulated Storybook fixture.
  const storageKey = `irin-navigation-preview:${permissionMode}:${locationCount}`;
  const [memoryUnavailable, setMemoryUnavailable] = useState(false);
  const [state, dispatch] = useReducer(navigate, initialPage, (page) => {
    let choices: Choices = {};
    try {
      // Same-origin Storybook manager reloads retain this fixture's choices.
      // Fresh entries reset copied sessionStorage, including opener-created tabs.
      const entry = window.parent.performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      choices = restoreChoices(
        sessionStorage.getItem(storageKey),
        entry?.type ?? "navigate",
      );
      if (entry?.type !== "reload") sessionStorage.removeItem(storageKey);
    } catch {
      /* Current visit still works without storage. */
    }
    return { ...initialNavigation(page), choices };
  });
  const [mode, setMode] = useState(permissionMode);
  const access = accessFor(mode);
  const permitted = access.destinations ?? [];
  const hasInventory = permitted.some((page) => inventoryPages.includes(page));
  const canView = access.status === "ready" && permitted.includes(state.page);
  const locationPage = locationPages.includes(state.page as LocationPage)
    ? (state.page as LocationPage)
    : undefined;
  const hasLocation = canView && !!locationPage;
  const available =
    locationCount === "one" ? ["sales-floor"] : ["sales-floor", "stockroom"];
  const selected = locationPage
    ? resolveLocation(state.choices[locationPage], available)
    : undefined;
  const locationName = (id: string) =>
    t(id === "sales-floor" ? "navSalesFloor" : "navStockroom");
  function go(page: Destination) {
    dispatch({ type: "page", page });
    setOpenMobile(false);
  }
  function choose(location: string | null) {
    if (!locationPage || !location || !available.includes(location)) return;
    dispatch({ type: "location", page: locationPage, location });
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ ...state.choices, [locationPage]: location }),
      );
      setMemoryUnavailable(false);
    } catch {
      setMemoryUnavailable(true);
    }
  }
  function entry(page: Destination) {
    const Icon = icons[page];
    return (
      <SidebarMenuItem
        key={page}
        className={cn(!showLabels && "flex justify-center")}
      >
        <SidebarMenuButton
          size="lg"
          tooltip={t(labels[page])}
          aria-label={t(labels[page])}
          aria-current={state.page === page ? "page" : undefined}
          isActive={state.page === page}
          data-navigation-to={page}
          onClick={() => go(page)}
          className={cn(
            "h-auto min-h-11 gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 focus-visible:ring-brand-500 dark:text-gray-300 dark:hover:bg-white/5",
            state.page === page &&
              "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
          )}
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />
          {showLabels && (
            <span className="whitespace-normal">{t(labels[page])}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  function permissionState(compact = false) {
    if (access.status === "loading")
      return (
        <div
          role="status"
          aria-label={t("navCheckingAccess")}
          className="flex items-center gap-3 p-3 text-sm text-gray-500 dark:text-gray-400"
          data-navigation-loading
        >
          <span
            className="size-2 shrink-0 rounded-full bg-gray-400"
            aria-hidden="true"
          />
          {(!compact || showLabels) && t("navCheckingAccess")}
        </div>
      );
    if (access.status === "error" && !compact)
      return (
        <Alert
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          data-navigation-error
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("navAccessError")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("ready")}
            data-navigation-retry
          >
            {t("navRetry")}
          </Button>
        </Alert>
      );
    return null;
  }
  return (
    <div className="contents">
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader className={showLabels ? "p-5" : "p-2"}>
          <button
            onClick={() => go("home")}
            aria-label="Irin"
            className={cn(
              "flex items-center font-semibold tracking-[-0.04em] text-gray-900 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-white",
              showLabels
                ? "text-[32px] leading-10"
                : "size-11 justify-center self-center text-xl leading-8",
            )}
          >
            Irin
          </button>
        </SidebarHeader>
        <SidebarContent className={cn("pb-4", showLabels ? "px-4" : "px-2")}>
          <nav aria-label={t("navPrimary")}>
            {access.status === "ready" ? (
              <>
                <SidebarMenu>
                  {permitted.includes("home") && entry("home")}
                </SidebarMenu>
                {hasInventory && (
                  <Accordion
                    value={
                      showLabels && state.openGroup === "inventory"
                        ? ["inventory"]
                        : []
                    }
                    onValueChange={() => {
                      if (!showLabels) {
                        setOpen(true);
                        if (state.openGroup !== "inventory")
                          dispatch({ type: "group", group: "inventory" });
                        return;
                      }
                      dispatch({ type: "group", group: "inventory" });
                    }}
                  >
                    <AccordionItem
                      value="inventory"
                      className={cn(
                        "border-0 pt-4",
                        !showLabels && "flex flex-col items-center",
                      )}
                    >
                      <AccordionTrigger
                        showIcon={showLabels}
                        aria-label={t("navInventory")}
                        className={cn(
                          "gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 hover:no-underline dark:hover:bg-white/5",
                          !showLabels &&
                            "size-11 flex-none justify-center gap-0 p-2",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <BoxIcon
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                          {showLabels && <span>{t("navInventory")}</span>}
                        </span>
                      </AccordionTrigger>
                      {showLabels && (
                        <AccordionContent className="ps-3 pt-1 pb-0">
                          <SidebarMenu>
                            {inventoryPages
                              .filter((page) => permitted.includes(page))
                              .map(entry)}
                          </SidebarMenu>
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  </Accordion>
                )}
              </>
            ) : (
              permissionState(true)
            )}
          </nav>
        </SidebarContent>
        <SidebarFooter
          className={cn(
            "border-t border-gray-200 dark:border-gray-800",
            showLabels ? "p-4" : "p-2",
          )}
        >
          {access.status === "ready" && (
            <nav aria-label={t("navShared")}>
              <SidebarMenu>
                <SidebarMenuItem
                  className={cn(!showLabels && "flex justify-center")}
                >
                  <SidebarMenuButton
                    size="lg"
                    tooltip={t("navMoreOptions")}
                    aria-label={t("navMoreOptions")}
                    aria-expanded={footerOpen}
                    aria-controls={
                      footerOpen ? "navigation-shared-items" : undefined
                    }
                    onClick={() => setFooterOpen((value) => !value)}
                    data-navigation-footer-toggle
                    className="h-auto min-h-11 gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 focus-visible:ring-brand-500 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <HorizontalDotsIcon aria-hidden="true" className="size-4" />
                    {showLabels && (
                      <>
                        <span>{t("navMoreOptions")}</span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={cn(
                            "ms-auto size-4 transition-transform",
                            !footerOpen && "-rotate-90",
                          )}
                        />
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {footerOpen && (
                <SidebarMenu id="navigation-shared-items">
                  {(["modules", "business-settings", "help"] as Destination[])
                    .filter((page) => permitted.includes(page))
                    .map(entry)}
                </SidebarMenu>
              )}
            </nav>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset data-navigation-preview data-navigation-page={state.page}>
        <header
          className={cn(
            "sticky top-0 z-50 flex w-full shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-200 bg-white px-3 py-1 md:px-4 dark:border-gray-800 dark:bg-gray-900",
            hasLocation && "max-sm:flex-nowrap max-sm:gap-x-2",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-3",
              hasLocation && "max-sm:gap-2",
            )}
          >
            <Button
              variant="ghost"
              size={isMobile ? "icon-lg" : "icon-sm"}
              className="shrink-0"
              onClick={toggleSidebar}
              aria-label={headerT("toggleSidebar")}
            >
              {openMobile ? (
                <XIcon className="size-4" />
              ) : (
                <MenuTwoIcon className="size-4 rtl:-scale-x-100" />
              )}
            </Button>
            <h1
              className={cn(
                "text-title-sm font-semibold text-gray-800 dark:text-white/90",
                hasLocation && "min-w-0 max-sm:truncate",
              )}
              data-navigation-title
            >
              {t(labels[state.page])}
            </h1>
          </div>
          <div
            className={cn(
              "flex min-w-0 shrink-0 items-center gap-3",
              hasLocation && "max-sm:gap-2",
            )}
          >
            {canView && locationPage && (
              <div
                className="flex min-w-0 flex-none items-center gap-3"
                data-navigation-scope={selected ?? "unselected"}
              >
                <label
                  id="navigation-location-label"
                  className="sr-only shrink-0 text-sm font-medium text-gray-700 sm:not-sr-only dark:text-gray-300"
                >
                  {t("navLocation")}
                </label>
                <Select
                  value={selected ?? null}
                  onValueChange={choose}
                  items={available.map((id) => ({
                    value: id,
                    label: locationName(id),
                  }))}
                >
                  <SelectTrigger
                    size={isMobile ? "default" : "sm"}
                    className="w-32 min-w-0 shrink-0 sm:w-56"
                    aria-labelledby="navigation-location-label"
                    data-navigation-location
                  >
                    <SelectValue
                      placeholder={
                        <>
                          <span className="sm:hidden">{t("navLocation")}</span>
                          <span className="hidden sm:inline">
                            {t("navChooseLocation")}
                          </span>
                        </>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="gap-0 p-0 [&_[role=listbox]]:gap-0">
                    {available.map((id) => (
                      <SelectItem
                        key={id}
                        value={id}
                        className="min-h-11 rounded-none"
                      >
                        {locationName(id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              variant="ghost"
              size={isMobile ? "icon-lg" : "icon-sm"}
              className="shrink-0"
              onClick={toggleTheme}
              aria-label={headerT("toggleTheme")}
            >
              {theme === "dark" ? (
                <SunIcon className="size-4" />
              ) : (
                <MoonIcon className="size-4" />
              )}
            </Button>
          </div>
        </header>
        <div className="w-full min-w-0 space-y-3 p-3 md:p-4">
          {memoryUnavailable && (
            <p
              role="status"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              {t("navMemoryUnavailable")}
            </p>
          )}
          {access.status !== "ready" ? (
            permissionState()
          ) : !canView ? (
            <Alert data-navigation-denied>
              <InfoCircleIcon aria-hidden="true" />
              <AlertTitle>{t("navAccessDenied")}</AlertTitle>
              <AlertDescription>{t("navAccessDeniedHint")}</AlertDescription>
            </Alert>
          ) : (
            <div
              className="text-sm text-gray-500 dark:text-gray-400"
              data-navigation-content
            >
              {locationPage && !selected
                ? t("navChooseLocationHint")
                : t("navContentHint")}
            </div>
          )}
        </div>
      </SidebarInset>
    </div>
  );
}
