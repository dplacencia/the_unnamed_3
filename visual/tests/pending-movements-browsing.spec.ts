import { expect, test, type Page } from "@playwright/test";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import { pendingBrowsingMessages } from "../../apps/backoffice/.storybook/stories/pending-movements-browsing-messages";
import { pendingInspectionMessages } from "../../apps/backoffice/.storybook/stories/pending-receipt-inspection-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import { navigatePreview } from "../navigation-actions";

function browsing(page: Page, locale: Locale = "es") {
  const copy = pendingBrowsingMessages(locale);
  const workspace = page.locator("[data-pending-browsing-workspace]");
  const table = workspace.getByRole("table");
  function button(name: string) {
    return workspace.getByRole("button", { name, exact: true });
  }
  return {
    workspace,
    table,
    copy,
    button,
    title: workspace.getByRole("heading", { name: copy.title, exact: true }),
    current: (number: number) =>
      workspace.getByText(copy.page(number), { exact: true }),
    rows: table.getByRole("row").filter({
      has: page.getByRole("cell", {
        name: new RegExp(`^(${copy.receipt}|${copy.departure})$`),
      }),
    }),
    size: workspace.getByRole("combobox", { name: copy.perPage, exact: true }),
    scope: page.locator("[data-navigation-location]"),
    previous: button(copy.previous),
    next: button(copy.next),
    retry: button(copy.retry),
    restart: button(copy.restart),
    details: workspace.locator("[data-pending-browsing-inspect]"),
  };
}

async function ready(
  page: Page,
  story = "movements-entry",
  { locale = "es", fixture }: { locale?: Locale; fixture?: string } = {},
) {
  const args = fixture ? `&args=fixture:${fixture}` : "";
  await page.goto(
    `/iframe.html?id=backoffice-pending-movements-browsing--${story}&viewMode=story&globals=locale:${locale};theme:light${args}`,
  );
  const list = browsing(page, locale);
  await expect(list.workspace).toBeVisible();
  await expect(
    page.locator(`[data-pending-browsing-ready="${story}"]`),
  ).toBeVisible();
  await expect(page.locator("#storybook-error")).toBeHidden();
  return list;
}

async function chooseScope(page: Page, name: string) {
  await browsing(page).scope.click();
  await page.getByRole("option", { name, exact: true }).click();
}

async function openPending(
  page: Page,
  list: ReturnType<typeof browsing>,
  scope = list.copy.allLocations,
) {
  await list.button(list.copy.open).click();
  await chooseScope(page, scope);
  await expect(list.current(1)).toBeVisible();
  await expect(list.rows.first()).toBeVisible();
}

async function expectDisplayedCount(list: ReturnType<typeof browsing>) {
  const count = await list.rows.count();
  expect(count).toBeGreaterThan(0);
  await expect(
    list.workspace.getByText(list.copy.displayed(count), { exact: true }),
  ).toBeVisible();
}

async function expectRequests(
  list: ReturnType<typeof browsing>,
  count: number,
) {
  await expect(list.workspace).toHaveAttribute(
    "data-pending-browsing-request-count",
    String(count),
  );
}

async function inspectPending(list: ReturnType<typeof browsing>) {
  const details = list.details.first();
  const reference = await details.getAttribute("data-pending-browsing-inspect");
  expect(reference).toBeTruthy();
  await details.focus();
  await details.press("Enter");
  await expect(list.workspace).toHaveAttribute(
    "data-pending-browsing-last-reference",
    reference!,
  );
  return details;
}

async function expectNoPageOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

test("Movimientos opens Pendientes on request and scopes the first read", async ({
  page,
}) => {
  const list = await ready(page);
  const nav = catalogueMessages.es;
  await expect(
    page.getByRole("heading", { name: nav.navMovements }),
  ).toBeVisible();
  await expect(list.button("Registrar entrada")).toBeVisible();
  await expect(list.table).toBeHidden();
  await list.button(list.copy.open).click();
  await expect(list.button("Registrar entrada")).toBeVisible();
  await expect(
    list.workspace.getByText(list.copy.chooseLocation),
  ).toBeVisible();
  await expect(list.table).toBeHidden();
  await expectRequests(list, 0);
  await chooseScope(page, nav.navStockroom);
  await expect(list.scope).toContainText(nav.navStockroom);
  await expect(
    list.table.getByRole("cell", { name: "Entrada", exact: true }).first(),
  ).toBeVisible();
  await expect(
    list.table.getByRole("cell", { name: "Salida", exact: true }).first(),
  ).toBeVisible();
  await expect(
    list.table.getByRole("columnheader", { name: "Ubicación", exact: true }),
  ).toHaveCount(0);
  await expect(list.size).toHaveValue("50");
  await expectDisplayedCount(list);
  await expectRequests(list, 1);
});

test("Pendientes selects the sole accessible location automatically", async ({
  page,
}) => {
  const list = await ready(page, "movements-entry", {
    fixture: "single-location",
  });
  await list.button(list.copy.open).click();
  await expect(list.rows.first()).toBeVisible();
  await expect(list.workspace.getByText(list.copy.chooseLocation)).toBeHidden();
  await expectRequests(list, 1);
  await expect(list.scope).toContainText(catalogueMessages.es.navSalesFloor);
  await chooseScope(page, list.copy.allLocations);
  await expect(
    list.table.getByRole("cell", {
      name: catalogueMessages.es.navSalesFloor,
      exact: true,
    }),
  ).toHaveCount(50);
  await expect(
    list.table.getByRole("cell", {
      name: catalogueMessages.es.navStockroom,
      exact: true,
    }),
  ).toHaveCount(0);
  await expectRequests(list, 2);
});

test("all-accessible paging and page size keep scope and exact displayed counts", async ({
  page,
}) => {
  const list = await ready(page);
  await openPending(page, list);
  const nav = catalogueMessages.es;
  await expect(list.scope).toContainText(list.copy.allLocations);
  await expect(list.size.locator("option")).toHaveText(["25", "50", "100"]);
  await expect(
    list.table.getByRole("columnheader", { name: list.copy.location }),
  ).toBeVisible();
  for (const name of [nav.navStockroom, nav.navSalesFloor]) {
    await expect(
      list.table.getByRole("cell", { name, exact: true }).first(),
    ).toBeVisible();
  }
  await expectDisplayedCount(list);
  await expect(list.workspace.getByText(/^Total estimado · /)).toBeVisible();
  await expect(list.previous).toBeDisabled();
  const firstRows = await list.rows.allTextContents();
  await list.next.click();
  await expect(list.current(2)).toBeVisible();
  await expectDisplayedCount(list);
  expect(await list.rows.allTextContents()).not.toEqual(firstRows);
  await list.previous.click();
  await expect(list.current(1)).toBeVisible();
  await expect(list.rows).toHaveText(firstRows);
  await list.next.click();
  await expect(list.current(2)).toBeVisible();
  await list.size.selectOption("100");
  await expect(list.current(1)).toBeVisible();
  await expect(list.scope).toContainText(list.copy.allLocations);
  await expect(list.rows).toHaveCount(100);
  await list.next.click();
  await expect(list.current(2)).toBeVisible();
  await list.next.click();
  await expect(list.current(3)).toBeVisible();
  await expect(list.rows).toHaveCount(24);
  await expectDisplayedCount(list);
  await expect(list.next).toBeDisabled();
  await expect(list.previous).toBeEnabled();
});

test("page size leaves space for a vertically centered caret on desktop and phones", async ({
  page,
}) => {
  const list = await ready(page, "all-locations");
  await expect(list.size).toHaveValue("50");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(list.size).toHaveCSS("background-position-y", "50%");
    await expect(list.size).toHaveCSS(
      "background-position-x",
      "calc(100% - 8px)",
    );
    const { padding, caretWidth } = await list.size.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        padding: Number.parseFloat(style.paddingInlineEnd),
        caretWidth: Number.parseFloat(style.backgroundSize),
      };
    });
    expect(padding).toBeGreaterThanOrEqual(caretWidth + 8);
  }
});

test("rows preserve exact decimal quantities and disclose independently unknown facts", async ({
  page,
}) => {
  const list = await ready(page);
  await openPending(page, list);
  const receipt = list.rows.filter({ hasText: "Tomate pera" }).first();
  await expect(
    receipt.getByRole("cell", { name: "0,123456789 kg" }),
  ).toBeVisible();
  const unresolvedProduct = list.rows
    .filter({
      hasText: list.copy.unknownProduct,
    })
    .first();
  await expect(
    unresolvedProduct.getByRole("cell", { name: /12/ }),
  ).toContainText(list.copy.unknownUnit);
  await expect(
    list.rows.filter({ hasText: list.copy.unknownQuantity }).first(),
  ).not.toContainText(list.copy.unknownUnit);

  const departure = list.rows.filter({ hasText: "Manzana reineta" }).first();
  await expect(departure).toContainText(list.copy.departure);
  await expect(
    departure.getByRole("button", {
      name: list.copy.inspect("Manzana reineta"),
    }),
  ).toHaveCount(0);
  await departure
    .getByRole("button", { name: list.copy.showReasons("Manzana reineta") })
    .press("Enter");
  await expect(
    list.table.getByText(list.copy.insufficientStockReason),
  ).toBeVisible();
});

test("Pendientes keeps scope and size per tab but reopens at the first page", async ({
  page,
}) => {
  const list = await ready(page);
  await openPending(page, list);
  await list.size.selectOption("25");
  await expect(list.rows).toHaveCount(25);
  await list.next.click();
  await expect(list.current(2)).toBeVisible();
  await navigatePreview(page, "home");
  await navigatePreview(page, "movements");
  await expect(list.table).toBeHidden();
  await list.button(list.copy.open).click();
  await expect(list.current(1)).toBeVisible();
  await expect(list.rows).toHaveCount(25);
  await expect(list.scope).toContainText(list.copy.allLocations);
  await expect(list.size).toHaveValue("25");

  const newPage = await page.context().newPage();
  const fresh = await ready(newPage);
  await fresh.button(fresh.copy.open).click();
  await expect(
    fresh.workspace.getByText(fresh.copy.chooseLocation),
  ).toBeVisible();
  await chooseScope(newPage, fresh.copy.allLocations);
  await expect(fresh.rows.first()).toBeVisible();
  await expect(fresh.size).toHaveValue("50");
});

test("Pendientes omits a total when the scoped read supplies no estimate", async ({
  page,
}) => {
  const list = await ready(page, "movements-entry", { fixture: "no-estimate" });
  await openPending(page, list);
  await expectDisplayedCount(list);
  await expect(list.workspace.getByText(/^Total estimado · /)).toHaveCount(0);
});

test("Pendientes keeps previous rows marked while a directional read is loading", async ({
  page,
}) => {
  const list = await ready(page, "previous-results-loading");
  await expect(list.workspace.getByText(list.copy.loading)).toBeVisible();
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeVisible();
  await expect(list.rows.first()).toBeVisible();
  await expect(list.previous).toBeDisabled();
  await expect(list.next).toBeDisabled();
});

test("the initial read is neutral until results are known", async ({
  page,
}) => {
  const list = await ready(page, "initial-loading");
  await expect(list.workspace.getByText(list.copy.loading)).toBeVisible();
  await expect(list.rows).toHaveCount(0);
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeHidden();
  await expect(
    list.workspace.getByText(list.copy.empty, { exact: true }),
  ).toBeHidden();
});

test("a late continuation cannot replace results in a newly selected scope", async ({
  page,
}) => {
  const list = await ready(page, "movements-entry", { fixture: "late-scope" });
  await openPending(page, list);
  await list.next.click();
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeVisible();
  await chooseScope(page, catalogueMessages.es.navStockroom);
  await expectRequests(list, 3);
  await expect(list.workspace).toHaveAttribute(
    "data-pending-browsing-settled-count",
    "3",
  );
  await expect(list.current(1)).toBeVisible();
  await expect(list.current(2)).toBeHidden();
  await expect(
    list.table.getByRole("columnheader", { name: list.copy.location }),
  ).toHaveCount(0);
  await expect(list.rows.first()).toContainText("Tomate pera");
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeHidden();
});

test("technical paging failure keeps the prior page and retries the requested page", async ({
  page,
}) => {
  const list = await ready(page, "movements-entry", {
    fixture: "technical-failure",
  });
  await openPending(page, list);
  const firstRows = await list.rows.allTextContents();
  await list.next.click();
  await expect(list.workspace.getByText(list.copy.error)).toBeVisible();
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeVisible();
  await expect(list.rows).toHaveText(firstRows);
  await expect(list.current(1)).toBeVisible();
  await expect(list.restart).toBeHidden();
  await list.retry.press("Enter");
  await expect(list.title).toBeFocused();
  await expect(list.current(2)).toBeVisible();
  expect(await list.rows.allTextContents()).not.toEqual(firstRows);
  await expect(
    list.workspace.getByText(list.copy.previousResults),
  ).toBeHidden();
});

for (const preset of ["rejected-continuation", "empty-continuation"] as const) {
  test(`Pendientes preserves the reached page after ${preset} and restarts on request`, async ({
    page,
  }) => {
    const list = await ready(page, preset);
    const message =
      preset === "rejected-continuation"
        ? list.copy.rejectedDestination
        : list.copy.emptyDestination;
    await expect(list.workspace.getByText(message)).toBeVisible();
    await expect(
      list.workspace.getByText(list.copy.previousResults),
    ).toBeVisible();
    await expect(list.rows.first()).toBeVisible();
    await expect(list.current(2)).toBeVisible();
    await expectDisplayedCount(list);
    await expect(list.retry).toBeHidden();
    const priorSize = await list.size.inputValue();
    const priorScope = await list.scope.textContent();
    await list.restart.press("Enter");
    await expect(list.title).toBeFocused();
    await expect(list.current(1)).toBeVisible();
    await expect(list.workspace.getByText(message)).toBeHidden();
    await expect(
      list.workspace.getByText(list.copy.previousResults),
    ).toBeHidden();
    await expect(list.size).toHaveValue(priorSize);
    await expect(list.scope).toHaveText(priorScope ?? "");
  });
}

test("an empty first group reports scoped emptiness without restart", async ({
  page,
}) => {
  const list = await ready(page, "empty-first-page");
  await expect(
    list.workspace.getByText(list.copy.empty, { exact: true }),
  ).toBeVisible();
  await expect(list.rows).toHaveCount(0);
  await expect(list.restart).toBeHidden();
  await expect(list.retry).toBeHidden();
});

test("authoritative access denial clears rows and is distinct from emptiness", async ({
  page,
}) => {
  const list = await ready(page, "movements-entry", {
    fixture: "access-denied",
  });
  await openPending(page, list);
  await list.next.click();
  await expect(list.workspace.getByText(list.copy.denied)).toBeVisible();
  await expect(
    list.workspace.getByText(list.copy.empty, { exact: true }),
  ).toBeHidden();
  await expect(list.rows).toHaveCount(0);
  await expect(list.restart).toBeHidden();
  await expect(list.retry).toBeHidden();
});

test("a successful empty current-page read after inspection replaces previous rows", async ({
  page,
}) => {
  const list = await ready(page, "empty-after-inspection");
  await expect(list.workspace.getByText(list.copy.emptyCurrent)).toBeVisible();
  await expect(list.current(2)).toBeVisible();
  await expect(list.rows).toHaveCount(0);
  await expect(list.restart).toBeVisible();
});

test("a still-pending inspector return preserves the reached page and restores focus", async ({
  page,
}) => {
  const list = await ready(page);
  await openPending(page, list);
  await list.next.click();
  await expect(list.current(2)).toBeVisible();
  const details = await inspectPending(list);
  const dialog = page.getByRole("dialog", { name: list.copy.inspectionTitle });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Estado actual", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText("Entrada pendiente", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: list.copy.back, exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(list.current(2)).toBeVisible();
  await expect(details).toBeFocused();
  await expectRequests(list, 2);
});

for (const fixture of [
  "refresh-changed",
  "refresh-unavailable",
  "refresh-error",
] as const) {
  test(`returning from receipt inspection reads the reached page again (${fixture})`, async ({
    page,
  }) => {
    const list = await ready(page, "movements-entry", { fixture });
    await openPending(page, list);
    await list.next.click();
    await expect(list.current(2)).toBeVisible();
    const selectedReference = await list.details
      .first()
      .getAttribute("data-pending-browsing-inspect");
    const priorRows = await list.rows.allTextContents();
    await inspectPending(list);
    const dialog = page.getByRole("dialog", {
      name: list.copy.inspectionTitle,
    });
    const inspectionCopy = pendingInspectionMessages("es");
    await expect(
      dialog.getByText(
        fixture === "refresh-unavailable"
          ? inspectionCopy.unavailable
          : inspectionCopy.applied,
        { exact: true },
      ),
    ).toBeVisible();
    await dialog
      .getByRole("button", { name: list.copy.back, exact: true })
      .click();
    await expect(dialog).toBeHidden();
    await expect(list.title).toBeFocused();
    await expectRequests(list, 3);
    const inspected = list.workspace.locator(
      `[data-pending-browsing-inspect="${selectedReference}"]`,
    );
    if (fixture === "refresh-error") {
      await expect(list.workspace.getByText(list.copy.error)).toBeVisible();
      await expect(
        list.workspace.getByText(list.copy.previousResults),
      ).toBeVisible();
      await expect(list.rows).toHaveText(priorRows);
      await expect(list.current(2)).toBeVisible();
      await list.retry.press("Enter");
      await expectRequests(list, 4);
    }
    if (fixture === "refresh-unavailable") {
      await expect(list.rows).toHaveText(priorRows);
      await expect(inspected).toBeVisible();
    } else {
      await expect(inspected).toHaveCount(0);
      await expect(list.rows.first()).toBeVisible();
      await expect(list.title).toBeFocused();
    }
    await expect(list.current(2)).toBeVisible();
    await expect(
      list.workspace.getByText(list.copy.previousResults),
    ).toBeHidden();
  });
}

test("the list and receipt inspector stay inside a 320px phone viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const list = await ready(page, "all-locations", { locale: "eu" });
  await expectNoPageOverflow(page);
  await inspectPending(list);
  const dialog = page.getByRole("dialog", { name: list.copy.inspectionTitle });
  await expect(dialog).toBeVisible();
  await expectNoPageOverflow(page);
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`Pendientes shows localized ${locale} controls and fits a phone`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const list = await ready(page, "all-locations", { locale });
    const copy = list.copy;
    await expect(list.scope).toContainText(copy.allLocations);
    for (const name of [
      copy.type,
      copy.product,
      copy.quantity,
      copy.location,
    ]) {
      await expect(
        list.table.getByRole("columnheader", { name, exact: true }),
      ).toBeVisible();
    }
    await expect(list.current(1)).toBeVisible();
    await expect(list.previous).toHaveAccessibleName(copy.previous);
    await expect(list.next).toHaveAccessibleName(copy.next);
    const expanded = list.table.getByRole("button", { expanded: true });
    await expect(expanded).toHaveCount(1);
    await expect(list.table.getByText(copy.recordedReasons)).toBeVisible();
    await expanded.press("Enter");
    await expect(list.table.getByText(copy.recordedReasons)).toBeHidden();
    await expectNoPageOverflow(page);
  });
}
