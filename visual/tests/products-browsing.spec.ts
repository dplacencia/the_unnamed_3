import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import { navigatePreview } from "../navigation-actions.ts";

type Locale = keyof typeof catalogueMessages;

const rows = (page: Page) =>
  page.locator("[data-products-preview] table [data-product-id]");
const browsing = (page: Page) => page.locator("[data-products-browsing]");

function url(story = "catalogue", locale: Locale = "es") {
  return `/iframe.html?id=inventory-products-browsing--${story}&globals=locale:${locale};theme:light`;
}

async function ready(page: Page, story = "catalogue", locale: Locale = "es") {
  await page.goto(url(story, locale));
  await expect(browsing(page)).toBeVisible();
  await settled(page);
}

async function settled(page: Page) {
  await expect(browsing(page)).toHaveAttribute("data-browsing-state", "ready");
}

async function displayedPage(
  page: Page,
  number: number,
  locale: Locale = "es",
) {
  const label = page.locator("[data-browsing-page]");
  await expect(label).toHaveText(
    catalogueMessages[locale].pbPage.replace("{page}", String(number)),
  );
  await expect(label).toHaveAttribute("data-page-number", String(number));
}

async function ids(page: Page) {
  return rows(page).evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-product-id")!),
  );
}

async function move(page: Page, direction: "previous" | "next") {
  const before = await ids(page);
  await page.locator(`[data-browsing-${direction}]`).click();
  await expect.poll(() => ids(page)).not.toEqual(before);
  await settled(page);
}

async function viewMenu(page: Page, locale: Locale = "es") {
  await page
    .getByRole("button", {
      name: catalogueMessages[locale].gridView,
      exact: true,
    })
    .click();
}

async function pageSize(
  page: Page,
  size: 25 | 50 | 100,
  locale: Locale = "es",
) {
  await viewMenu(page, locale);
  await page.locator("[data-browsing-page-size]").click();
  await page.getByRole("option", { name: String(size), exact: true }).click();
  await page.keyboard.press("Escape");
  await settled(page);
  await expect(rows(page)).toHaveCount(size);
}

async function search(page: Page, value: string) {
  await page.getByRole("searchbox").fill(value);
  await page.getByRole("searchbox").press("Enter");
  await settled(page);
}

async function stockLocation(page: Page, value: "sales-floor" | "stockroom") {
  await page.locator("[data-products-location]").click();
  await page
    .getByRole("option", {
      name:
        value === "sales-floor"
          ? catalogueMessages.es.navSalesFloor
          : catalogueMessages.es.navStockroom,
      exact: true,
    })
    .click();
  await settled(page);
}

async function positiveStock(page: Page) {
  await page.locator("[data-products-filter-trigger]").click();
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.pfPositiveStockOnly,
      exact: true,
    })
    .check();
  await page.locator("[data-products-filter-apply]").click();
  await settled(page);
}

async function beginEditing(page: Page) {
  await page
    .getByRole("button", {
      name: catalogueMessages.es.peEditTable,
      exact: true,
    })
    .click();
  await expect(page.locator("[data-edit-name]")).toHaveCount(50);
}

test("products browsing paging controls are explicit", async ({ page }) => {
  await ready(page);
  await expect(rows(page)).toHaveCount(50);
  await expect(
    page.getByRole("button", { name: "Anterior", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Siguiente", exact: true }),
  ).toBeEnabled();
  await viewMenu(page);
  const size = page.getByRole("combobox", {
    name: "Productos por página",
    exact: true,
  });
  await expect(size).toContainText("50");
  await size.click();
  await expect(page.getByRole("option")).toHaveText(["25", "50", "100"]);
});

test("products browsing displays the confirmed page number between paging controls", async ({
  page,
}) => {
  await ready(page);
  const label = page.locator("[data-browsing-page]");
  await expect(label).toHaveText("Página 1");
  await expect(page.locator(".products-browsing-pagination")).toHaveText(
    /^Anterior\s*Página 1\s*Siguiente$/,
  );
  await expect(page.locator("[data-browsing-estimate]")).not.toContainText(
    "Página",
  );
  await move(page, "next");
  await expect(label).toHaveText("Página 2");
  await move(page, "next");
  await expect(label).toHaveText("Página 3");
  await move(page, "previous");
  await expect(label).toHaveText("Página 2");
  await move(page, "previous");
  await expect(label).toHaveText("Página 1");
});

test("products browsing applies a live Storybook hidden-column argument", async ({
  page,
}) => {
  await ready(page);
  await expect(
    page.getByRole("columnheader", {
      name: catalogueMessages.es.gridSku,
      exact: true,
    }),
  ).toBeVisible();
  const updated = await page.evaluate(() => {
    type ArgsEvent = { storyId: string; args: { hiddenColumns?: boolean } };
    type Channel = {
      emit: (name: string, event: unknown) => void;
      on: (name: string, handler: (event: ArgsEvent) => void) => void;
      removeListener: (
        name: string,
        handler: (event: ArgsEvent) => void,
      ) => void;
    };
    const channel = (
      window as typeof window & { __STORYBOOK_ADDONS_CHANNEL__?: Channel }
    ).__STORYBOOK_ADDONS_CHANNEL__;
    if (!channel) throw new Error("Storybook argument channel is unavailable");
    const storyId = "inventory-products-browsing--catalogue";
    return new Promise<boolean>((resolve) => {
      const handler = (event: ArgsEvent) => {
        if (event.storyId !== storyId) return;
        channel.removeListener("storyArgsUpdated", handler);
        resolve(event.args.hiddenColumns === true);
      };
      channel.on("storyArgsUpdated", handler);
      channel.emit("updateStoryArgs", {
        storyId,
        updatedArgs: { hiddenColumns: true },
      });
    });
  });
  expect(updated).toBe(true);
  await expect(
    page.getByRole("columnheader", {
      name: catalogueMessages.es.gridSku,
      exact: true,
    }),
  ).toHaveCount(0);
});

test("products browsing replaces rows and can return to the previous group", async ({
  page,
}) => {
  await ready(page);
  await displayedPage(page, 1);
  const first = await ids(page);
  await move(page, "next");
  await displayedPage(page, 2);
  const second = await ids(page);
  await expect(rows(page)).toHaveCount(50);
  expect(second.filter((id) => first.includes(id))).toEqual([]);
  await move(page, "previous");
  await displayedPage(page, 1);
  expect(await ids(page)).toEqual(first);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
});

test("products browsing follows explicit continuation even when fewer than the chosen size arrive", async ({
  page,
}) => {
  await ready(page, "short-page");
  await displayedPage(page, 1);
  await expect(rows(page)).toHaveCount(20);
  await expect(page.locator("[data-products-count]")).toContainText("20");
  await viewMenu(page);
  await expect(page.locator("[data-browsing-page-size]")).toContainText("50");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-browsing-next]")).toBeEnabled();
  const first = await ids(page);
  await move(page, "next");
  await displayedPage(page, 2);
  expect((await ids(page)).filter((id) => first.includes(id))).toEqual([]);
  await expect(page.locator("[data-browsing-previous]")).toBeEnabled();
});

test("products browsing disables Next at the last group of a narrowed result set", async ({
  page,
}) => {
  await ready(page);
  await search(page, "café");
  let groups = 1;
  const seen = new Set(await ids(page));
  while (
    (await page.locator("[data-browsing-next]").isEnabled()) &&
    groups < 6
  ) {
    await move(page, "next");
    const current = await ids(page);
    expect(current.filter((id) => seen.has(id))).toEqual([]);
    current.forEach((id) => seen.add(id));
    groups += 1;
    await displayedPage(page, groups);
  }
  expect(groups).toBeGreaterThan(1);
  await expect(page.locator("[data-browsing-next]")).toBeDisabled();
  await expect(page.locator("[data-browsing-previous]")).toBeEnabled();
  expect(await rows(page).count()).toBeLessThanOrEqual(50);
});

test("products browsing sorts the full matching collection before projecting pages", async ({
  page,
}) => {
  await ready(page);
  await move(page, "next");
  await page
    .getByRole("button", { name: catalogueMessages.es.gridSku, exact: true })
    .click();
  await settled(page);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  const readCodes = async () =>
    (await rows(page).locator('[data-products-column="sku"]').allTextContents())
      .map((value) => value.trim())
      .filter((value) => value !== catalogueMessages.es.ptUnassigned);
  const firstCodes = await readCodes();
  await move(page, "next");
  const codes = [...firstCodes, ...(await readCodes())];
  expect(codes).toEqual(
    [...codes].sort((a, b) => a.localeCompare(b, "es", { numeric: false })),
  );
});

test("products browsing preserves the hidden-column sorting reminder and settled sort scope", async ({
  page,
}) => {
  await ready(page, "delayed");
  await page
    .getByRole("button", { name: catalogueMessages.es.gridSku, exact: true })
    .click();
  await settled(page);
  await move(page, "next");
  const current = await ids(page);
  await viewMenu(page);
  await page
    .getByRole("checkbox", { name: catalogueMessages.es.gridSku, exact: true })
    .uncheck();
  await page.keyboard.press("Escape");
  expect(await ids(page)).toEqual(current);
  const reminder = page.getByText(
    catalogueMessages.es.ptHiddenSort.replace(
      "{column}",
      catalogueMessages.es.gridSku,
    ),
    { exact: false },
  );
  await expect(reminder).toBeVisible();
  await expect(reminder).toContainText("↑");
  await page
    .getByRole("button", { name: catalogueMessages.es.ptProduct, exact: true })
    .click();
  await expect(page.locator("[data-browsing-previous-results]")).toBeVisible();
  expect(await ids(page)).toEqual(current);
  await expect(reminder).toBeVisible();
  await expect(reminder).toContainText("↑");
  await settled(page);
  await expect(reminder).toHaveCount(0);
});

test("products browsing uses 25 and 100 rows and remembers size and position on refresh", async ({
  page,
}) => {
  await ready(page);
  await pageSize(page, 25);
  await displayedPage(page, 1);
  await move(page, "next");
  await displayedPage(page, 2);
  await pageSize(page, 100);
  await displayedPage(page, 1);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await move(page, "next");
  await displayedPage(page, 2);
  const current = await ids(page);
  await page.reload();
  await settled(page);
  await expect(rows(page)).toHaveCount(100);
  await displayedPage(page, 2);
  expect(await ids(page)).toEqual(current);
});

test("products browsing starts a real opener-created tab at default size and position", async ({
  page,
}) => {
  await ready(page);
  const first = await ids(page);
  await pageSize(page, 100);
  await move(page, "next");
  const opened = page.context().waitForEvent("page");
  await page.evaluate((target) => {
    window.open(target, "_blank");
  }, page.url());
  const child = await opened;
  await expect(browsing(child)).toBeVisible();
  await settled(child);
  await expect(rows(child)).toHaveCount(50);
  await displayedPage(child, 1);
  expect(await ids(child)).toEqual(first);
  await expect(child.locator("[data-browsing-previous]")).toBeDisabled();
  await child.close();
});

test("products browsing restores position with another read after returning to Products", async ({
  page,
}) => {
  await ready(page);
  await move(page, "next");
  await displayedPage(page, 2);
  const current = await ids(page);
  const generation = Number(
    await browsing(page).getAttribute("data-browsing-read-generation"),
  );
  await navigatePreview(page, "home");
  await navigatePreview(page, "products");
  await expect
    .poll(async () =>
      Number(
        await browsing(page).getAttribute("data-browsing-read-generation"),
      ),
    )
    .toBeGreaterThan(generation);
  await settled(page);
  expect(await ids(page)).toEqual(current);
  await displayedPage(page, 2);
});

test("products browsing preserves its group for layout changes and resets submitted constraints", async ({
  page,
}) => {
  await ready(page);
  const first = await ids(page);
  await move(page, "next");
  const second = await ids(page);
  await viewMenu(page);
  await page
    .getByRole("checkbox", { name: catalogueMessages.es.gridSku, exact: true })
    .uncheck();
  await page.getByRole("combobox", { name: "Densidad", exact: true }).click();
  await page.getByRole("option", { name: "Cómoda", exact: true }).click();
  await page.keyboard.press("Escape");
  expect(await ids(page)).toEqual(second);
  await displayedPage(page, 2);
  await page.getByRole("searchbox").fill("000001");
  expect(await ids(page)).toEqual(second);
  await displayedPage(page, 2);
  await page.getByRole("searchbox").press("Enter");
  await settled(page);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await expect(rows(page)).toHaveCount(1);
  await displayedPage(page, 1);
  expect(await ids(page)).toEqual(["product-1"]);
  await page
    .getByRole("search")
    .getByRole("button", {
      name: catalogueMessages.es.ptClearSearch,
      exact: true,
    })
    .click();
  await settled(page);
  expect(await ids(page)).toEqual(first);
  await displayedPage(page, 1);
  await expect(page.locator("[data-products-preview]")).toHaveAttribute(
    "data-density",
    "comfortable",
  );
});

test("products browsing resets applied filters but does not apply a cancelled draft", async ({
  page,
}) => {
  await ready(page);
  await move(page, "next");
  const second = await ids(page);
  await page.locator("[data-products-filter-trigger]").click();
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.pfIncludeArchived,
      exact: true,
    })
    .check();
  expect(await ids(page)).toEqual(second);
  await page.keyboard.press("Escape");
  expect(await ids(page)).toEqual(second);
  await displayedPage(page, 2);
  await page.locator("[data-products-filter-trigger]").click();
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.pfIncludeArchived,
      exact: true,
    })
    .check();
  await page.locator("[data-products-filter-apply]").click();
  await settled(page);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await displayedPage(page, 1);
});

test("products browsing location changes retain position only without the stock filter", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.gridShowStock,
      exact: true,
    })
    .check();
  await stockLocation(page, "sales-floor");
  await move(page, "next");
  const current = await ids(page);
  await stockLocation(page, "stockroom");
  expect(await ids(page)).toEqual(current);
  await displayedPage(page, 2);
  await positiveStock(page);
  await displayedPage(page, 1);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await move(page, "next");
  await stockLocation(page, "sales-floor");
  await displayedPage(page, 1);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await move(page, "next");
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.gridShowStock,
      exact: true,
    })
    .uncheck();
  await settled(page);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await displayedPage(page, 1);
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toHaveCount(0);
});

test("products browsing shows supplied estimates separately from displayed rows", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-products-count]")).toContainText("50");
  await expect(page.locator("[data-browsing-estimate]")).toContainText(
    /estimad/i,
  );
  await ready(page, "without-estimate");
  await expect(page.locator("[data-products-count]")).toContainText("50");
  await expect(page.locator("[data-browsing-estimate]")).toHaveCount(0);
  await ready(page, "zero-estimate");
  await expect(rows(page)).toHaveCount(0);
  await expect(page.locator("[data-browsing-estimate]")).toContainText("0");
  await expect(page.locator("[data-browsing-error]")).toHaveCount(0);
});

test("products browsing initial loading is neutral rather than empty success", async ({
  page,
}) => {
  await page.goto(url("loading"));
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-state",
    "loading",
  );
  await expect(page.locator("[data-browsing-loading]")).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
  await expect(page.locator("[data-browsing-estimate]")).toHaveCount(0);
  await expect(page.locator("[data-products-count]")).toHaveCount(0);
  await expect(page.locator("[data-browsing-page]")).toHaveCount(0);
});

test("products browsing retains marked previous results while only paging controls are busy", async ({
  page,
}) => {
  await ready(page, "delayed");
  await displayedPage(page, 1);
  const previous = await ids(page);
  await page.locator("[data-browsing-next]").click();
  await expect(page.locator("[data-browsing-previous-results]")).toBeVisible();
  expect(await ids(page)).toEqual(previous);
  await displayedPage(page, 1);
  await expect(page.locator("[data-browsing-next]")).toBeDisabled();
  await expect(page.getByRole("searchbox")).toBeEnabled();
  await viewMenu(page);
  await expect(page.locator("[data-browsing-page-size]")).toBeDisabled();
  await page.keyboard.press("Escape");
  await settled(page);
  expect(await ids(page)).not.toEqual(previous);
  await displayedPage(page, 2);
  await expect(page.locator("[data-browsing-previous-results]")).toHaveCount(0);
});

test("products browsing keeps previous stock scope while another location is requested", async ({
  page,
}) => {
  await ready(page, "delayed");
  await page
    .getByRole("checkbox", {
      name: catalogueMessages.es.gridShowStock,
      exact: true,
    })
    .check();
  await stockLocation(page, "sales-floor");
  await page.locator("[data-products-location]").click();
  await page
    .getByRole("option", {
      name: catalogueMessages.es.navStockroom,
      exact: true,
    })
    .click();
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-location",
    "sales-floor",
  );
  await expect(page.locator("[data-browsing-previous-results]")).toContainText(
    catalogueMessages.es.navSalesFloor,
  );
  await settled(page);
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-location",
    "stockroom",
  );
});

test("products browsing initial technical failure offers a read retry without fake data", async ({
  page,
}) => {
  await page.goto(url("read-error"));
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-state",
    "technical",
  );
  await expect(page.locator("[data-browsing-error]")).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
  await expect(page.locator("[data-browsing-estimate]")).toHaveCount(0);
  await expect(page.locator("[data-browsing-page]")).toHaveCount(0);
  await page.locator("[data-browsing-retry]").click();
  await settled(page);
  await expect(rows(page)).toHaveCount(50);
  await displayedPage(page, 1);
});

test("products browsing ignores an older result that arrives after a newer requested view", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-17T10:00:00Z") });
  await ready(page, "delayed");
  await page.locator("[data-browsing-next]").click();
  await expect(page.locator("[data-browsing-previous-results]")).toBeVisible();
  await search(page, "000001");
  await expect(rows(page)).toHaveCount(1);
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-query",
    "000001",
  );
  expect(await ids(page)).toEqual(["product-1"]);
  await displayedPage(page, 1);
  await page.clock.fastForward(1000);
  await expect(browsing(page)).toHaveAttribute("data-browsing-state", "ready");
  expect(await ids(page)).toEqual(["product-1"]);
  await displayedPage(page, 1);
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-query",
    "000001",
  );
});

test("products browsing re-entry starts a fresh intent and rejects a pending old view", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-17T10:00:00Z") });
  await ready(page, "delayed");
  await page.locator("[data-browsing-next]").click();
  await page.getByRole("searchbox").fill("000001");
  await page.getByRole("searchbox").press("Enter");
  await navigatePreview(page, "home");
  await navigatePreview(page, "products");
  await settled(page);
  await expect(rows(page)).toHaveCount(1);
  await page.clock.fastForward(1000);
  expect(await ids(page)).toEqual(["product-1"]);
  await displayedPage(page, 1);
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-query",
    "000001",
  );
});

test("products browsing later technical failure retains the prior group until read retry succeeds", async ({
  page,
}) => {
  await ready(page, "next-read-error");
  const previous = await ids(page);
  await page.locator("[data-browsing-next]").click();
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-state",
    "technical",
  );
  expect(await ids(page)).toEqual(previous);
  await displayedPage(page, 1);
  await expect(page.locator("[data-browsing-previous-results]")).toBeVisible();
  await page.locator("[data-browsing-retry]").click();
  await settled(page);
  expect(await ids(page)).not.toEqual(previous);
  await displayedPage(page, 2);
});

test("products browsing read retries leave original recovery requests and protections unchanged", async ({
  page,
}) => {
  await ready(page, "recovery-next-error");
  const recovery = page.locator("[data-recovery-preview]");
  await expect(recovery).toHaveAttribute("data-request-count", "3");
  await page.locator("[data-browsing-next]").click();
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-state",
    "technical",
  );
  await page.locator("[data-browsing-retry]").click();
  await settled(page);
  await expect(recovery).toHaveAttribute("data-request-count", "3");
  await search(page, "000001");
  await page
    .getByRole("button", {
      name: catalogueMessages.es.peEditTable,
      exact: true,
    })
    .click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await expect(recovery).toHaveAttribute("data-request-count", "3");
});

test("products browsing restarts an unusable position only after an explicit request", async ({
  page,
}) => {
  await page.goto(url("unusable-position"));
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-state",
    "unusable",
  );
  await expect(page.locator("[data-browsing-restart]")).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
  await expect(page.locator("[data-browsing-page]")).toHaveCount(0);
  await expect(page.locator("[data-browsing-retry]")).toHaveCount(0);
  await page.locator("[data-browsing-restart]").click();
  await settled(page);
  await expect(rows(page)).toHaveCount(50);
  await expect(page.locator("[data-browsing-previous]")).toBeDisabled();
  await displayedPage(page, 1);
});

test("products browsing saves edits from different pages in one explicit action", async ({
  page,
}) => {
  await ready(page);
  await beginEditing(page);
  const first = (await ids(page))[0];
  await page
    .locator(`[data-edit-name="${first}"]`)
    .fill("Primer cambio exacto");
  await move(page, "next");
  const second = (await ids(page))[0];
  await page
    .locator(`[data-edit-name="${second}"]`)
    .fill("Segundo cambio exacto");
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.locator("[data-edit-count]")).toContainText("2");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator(`[data-edit-result="${first}"]`)).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator(`[data-edit-result="${second}"]`)).toContainText(
    "Cambios guardados",
  );
});

test("products browsing exposes valid off-page edits before saving", async ({
  page,
}) => {
  await ready(page);
  await beginEditing(page);
  const first = (await ids(page))[0];
  await page
    .locator(`[data-edit-name="${first}"]`)
    .fill("Borrador para revisar");
  await move(page, "next");
  await page
    .getByRole("button", {
      name: catalogueMessages.es.pbReviewEdits,
      exact: true,
    })
    .click();
  await page.locator(`[data-edit-draft-review="${first}-name"]`).click();
  await expect(
    page.locator(`.products-hidden-field-review [data-edit-name="${first}"]`),
  ).toHaveValue("Borrador para revisar");
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
});

test("products browsing gates every requested draft on an off-page error and preserves its correction", async ({
  page,
}) => {
  await ready(page);
  await beginEditing(page);
  const first = (await ids(page))[0];
  await page.locator(`[data-edit-name="${first}"]`).fill(" ");
  await move(page, "next");
  const second = (await ids(page))[0];
  await page.locator(`[data-edit-name="${second}"]`).fill("Cambio válido");
  const current = await ids(page);
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-validation-summary]")).toBeVisible();
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  await page.locator(`[data-edit-review="${first}-name"]`).click();
  const correction = page.locator(
    `.products-hidden-field-review [data-edit-name="${first}"]`,
  );
  await expect(correction).toBeFocused();
  await correction.fill("Corrección fuera de página");
  await expect(correction).toHaveValue("Corrección fuera de página");
  expect(await ids(page)).toEqual(current);
  await page.locator("[data-edit-save]").click();
  await expect(page.locator(`[data-edit-result="${first}"]`)).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator(`[data-edit-result="${second}"]`)).toContainText(
    "Cambios guardados",
  );
});

test("products browsing stays bounded with a ten-thousand-product fixture", async ({
  page,
}) => {
  await ready(page, "large-catalogue");
  await expect(rows(page)).toHaveCount(50);
  await pageSize(page, 100);
  await move(page, "next");
  await expect(rows(page)).toHaveCount(100);
  expect(new Set(await ids(page)).size).toBe(100);
});

test("products browsing phone pager stays reachable and product identity stays pinned", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const product = rows(page)
    .first()
    .locator('[data-products-column="product"]');
  const before = await product.boundingBox();
  await page.locator("[data-products-scroll]").evaluate((element) => {
    element.scrollLeft = 400;
  });
  expect(Math.abs((await product.boundingBox())!.x - before!.x)).toBeLessThan(
    2,
  );
  const next = page.locator("[data-browsing-next]");
  await next.scrollIntoViewIfNeeded();
  const bounds = await next.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  await next.focus();
  await expect(next).toBeFocused();
  const current = await ids(page);
  await next.press("Enter");
  await expect.poll(() => ids(page)).not.toEqual(current);
  await settled(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("products browsing paging labels translate and keyboard controls have accessible names", async ({
  page,
}) => {
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    await ready(page, "catalogue", locale);
    const copy = catalogueMessages[locale];
    await displayedPage(page, 1, locale);
    await expect(page.locator("[data-browsing-previous]")).toHaveAccessibleName(
      copy.pbPrevious,
    );
    await expect(page.locator("[data-browsing-next]")).toHaveAccessibleName(
      copy.pbNext,
    );
    await viewMenu(page, locale);
    await expect(
      page.locator("[data-browsing-page-size]"),
    ).toHaveAccessibleName(copy.pbPageSize);
    await page.keyboard.press("Escape");
  }
  const result = await new AxeBuilder({ page })
    .include("[data-products-browsing]")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
