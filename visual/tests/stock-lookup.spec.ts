import { expect, test, type Page } from "@playwright/test";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import { lookupMessages } from "../../apps/backoffice/.storybook/stories/stock-lookup-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import { choosePreviewLocation, navigatePreview } from "../navigation-actions";
import {
  applyLookupReceipt,
  chooseLookupPair,
  chooseLookupProduct,
  openLookupFromProduct,
  openLookupFromReceipt,
  stockLookup,
} from "../stock-lookup-actions";

async function ready(
  page: Page,
  story = "lookup",
  locale: Locale = "es",
  fixture?: "race" | "single-location" | "denied-receipt",
) {
  await page.goto(
    `/iframe.html?id=inventory-stock-lookup--${story}&viewMode=story&globals=locale:${locale};theme:light${fixture ? `&args=fixture:${fixture}` : ""}`,
  );
  const lookup = stockLookup(page);
  await expect(lookup.workspace).toBeAttached();
  return lookup;
}

test("stock lookup starts with an incomplete product and location pair", async ({
  page,
}) => {
  const lookup = await ready(page);
  await expect(lookup.product).toHaveValue("");
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "idle",
  );
  await expect(lookup.result).toContainText(lookupMessages("es").pickPair);
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "0",
  );
});

test("stock lookup reads automatically for an exact selected product and location, not typed text", async ({
  page,
}) => {
  const lookup = await ready(page);
  await choosePreviewLocation(page, "stockroom", "es");
  await expect(lookup.result).toContainText(lookupMessages("es").pickProduct);
  const direct = page.locator('[data-stock-lookup-product-option="tomato"]');
  const bulk = page.locator('[data-stock-lookup-product-option="tomato-bulk"]');
  await lookup.product.fill("Tomate pera");
  await expect(direct).toBeVisible();
  await expect(bulk).toBeVisible();
  const references = await Promise.all([direct.innerText(), bulk.innerText()]);
  expect(references[0]).not.toBe(references[1]);
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "0",
  );
  await bulk.click();
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato-bulk",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.amount).toHaveText("0 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "1",
  );
  await lookup.product.fill("Harina");
  await expect(
    page.locator('[data-stock-lookup-product-option="flour"]'),
  ).toBeVisible();
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato-bulk",
  );
  await expect(lookup.amount).toHaveText("0 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "1",
  );
});

test("stock lookup selects the sole eligible location and waits for a chosen product", async ({
  page,
}) => {
  const lookup = await ready(page, "lookup", "es", "single-location");
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "sales-floor",
  );
  await expect(lookup.product).toHaveValue("");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "0",
  );
  await chooseLookupProduct(page, "tomato");
  await expect(lookup.amount).toHaveText("7,25 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "1",
  );
});

test("stock lookup preserves exact negative and zero balances and shows absence without an amount", async ({
  page,
}) => {
  const lookup = await ready(page);
  await chooseLookupPair(page, "es", "oil");
  await expect(lookup.amount).toHaveText(/^[−-]0,25 l$/u);
  await chooseLookupProduct(page, "tomato-bulk");
  await expect(lookup.previousAmount).toBeHidden();
  await expect(lookup.amount).toHaveText("0 kg");
  await chooseLookupProduct(page, "flour");
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "no-record",
  );
  await expect(lookup.result).toContainText(
    "No hay un registro de existencias para este producto en esta ubicación.",
  );
  await expect(lookup.amount).toBeHidden();
  await expect(lookup.previousAmount).toBeHidden();
  await expect(lookup.refresh).toBeVisible();
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "3",
  );
});

test("stock lookup clears the old result and ignores superseded A-B-A responses", async ({
  page,
}) => {
  const lookup = await ready(page, "lookup", "es", "race");
  await chooseLookupPair(page, "es");
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "loading",
  );
  await choosePreviewLocation(page, "sales-floor", "es");
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "sales-floor",
  );
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "loading",
  );
  await expect(lookup.previousAmount).toBeHidden();
  await choosePreviewLocation(page, "stockroom", "es");
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "3",
  );
  await expect(lookup.amount).toHaveText("16,875 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-settled-count",
    "3",
  );
  await expect(lookup.amount).toHaveText("16,875 kg");
  await expect(lookup.previousAmount).toBeHidden();
});

test("stock lookup carries product details context without replacing the explicit tab choice", async ({
  page,
}) => {
  const lookup = await ready(page, "from-product");
  await navigatePreview(page, "stock");
  await chooseLookupPair(page, "es");
  await expect(lookup.amount).toHaveText("12,125 kg");
  await navigatePreview(page, "products");
  await openLookupFromProduct(page);
  await expect(page.locator("[data-navigation-title]")).toBeFocused();
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "product-5",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.amount).toHaveText("2 kg");
  await navigatePreview(page, "movements");
  await navigatePreview(page, "stock");
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.amount).toHaveText("12,125 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "3",
  );
});

test("stock lookup uses an applied receipt pair for that visit and restores ordinary choices", async ({
  page,
}) => {
  const lookup = await ready(page, "from-receipt");
  await navigatePreview(page, "stock");
  await chooseLookupPair(page, "es", "oil");
  await expect(lookup.amount).toHaveText(/^[−-]0,25 l$/u);
  await navigatePreview(page, "movements");
  await openLookupFromReceipt(page, "sales-floor");
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "sales-floor",
  );
  await expect(lookup.amount).toHaveText("7,75 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "2",
  );
  await navigatePreview(page, "movements");
  await navigatePreview(page, "stock");
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "oil",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.amount).toHaveText(/^[−-]0,25 l$/u);
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "3",
  );
});

test("stock lookup remembers only explicit choices made during a receipt consultation", async ({
  page,
}) => {
  const lookup = await ready(page, "from-receipt");
  await openLookupFromReceipt(page);
  await expect(lookup.amount).toHaveText("12,625 kg");
  await choosePreviewLocation(page, "sales-floor", "es");
  await lookup.product.fill("Tomate");
  await page.locator('[data-stock-lookup-product-option="tomato"]').click();
  await navigatePreview(page, "movements");
  await navigatePreview(page, "stock");
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "sales-floor",
  );
});

test("stock lookup keeps receipt application separate when the merchant cannot consult the pair", async ({
  page,
}) => {
  const lookup = await ready(page, "lookup", "es", "denied-receipt");
  const receipt = await applyLookupReceipt(page);
  await expect(receipt.balance).toHaveAttribute(
    "data-receipt-balance",
    "denied",
  );
  await expect(
    page.locator("[data-stock-lookup-receipt-shortcut]"),
  ).toBeHidden();
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "0",
  );
  await page.locator("[data-receipt-close]").click();
  await navigatePreview(page, "stock");
  await chooseLookupPair(page, "es");
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "denied",
  );
  await expect(lookup.amount).toBeHidden();
});

test("stock lookup retains remembered choices in the current tab and starts a new tab without a product", async ({
  page,
}) => {
  const lookup = await ready(page);
  await chooseLookupPair(page, "es");
  await expect(lookup.amount).toHaveText("12,125 kg");
  await navigatePreview(page, "movements");
  await navigatePreview(page, "stock");
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.amount).toHaveText("12,125 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "2",
  );
  const other = await page.context().newPage();
  try {
    const independent = await ready(other);
    await expect(independent.product).toHaveValue("");
    await expect(independent.workspace).toHaveAttribute(
      "data-stock-lookup-request-count",
      "0",
    );
  } finally {
    await other.close();
  }
});

test("stock lookup does not request another read when the open tab regains focus", async ({
  page,
}) => {
  await page.clock.install();
  const lookup = await ready(page);
  await chooseLookupPair(page, "es");
  await expect(lookup.amount).toHaveText("12,125 kg");
  const other = await page.context().newPage();
  try {
    await other.bringToFront();
    await page.bringToFront();
    await expect
      .poll(() => page.evaluate(() => document.hasFocus()))
      .toBe(true);
    // Dispatch the browser lifecycle signals as well as changing tabs. In headless
    // Chromium, bringing a page forward can leave it continuously visible.
    await page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.clock.runFor(1_000);
    await expect(lookup.workspace).toHaveAttribute(
      "data-stock-lookup-request-count",
      "1",
    );
    await expect(lookup.amount).toHaveText("12,125 kg");
  } finally {
    await other.close();
  }
});

test("stock lookup labels a retained amount through a same-pair refresh error and clears it after no record", async ({
  page,
}) => {
  const copy = lookupMessages("es");
  await ready(page, "refresh");
  const lookup = await chooseLookupPair(page, "es");
  await expect(lookup.amount).toHaveText("12,125 kg");
  await lookup.refresh.click();
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "loading",
  );
  await expect(lookup.result).toContainText(copy.loading);
  await expect(lookup.result).toContainText(copy.previous);
  await expect(lookup.previousAmount).toHaveText("12,125 kg");
  await expect(lookup.amount).toBeHidden();
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "error",
  );
  await expect(lookup.result).toContainText(copy.error);
  await expect(lookup.result).toContainText(copy.previous);
  await expect(lookup.previousAmount).toHaveText("12,125 kg");
  await lookup.retry.click();
  await expect(lookup.result.getByRole("heading")).toBeFocused();
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "no-record",
  );
  await expect(lookup.result).toContainText(copy.noRecord);
  await expect(lookup.result).not.toContainText(copy.previous);
  await expect(lookup.previousAmount).toBeHidden();
  await expect(lookup.amount).toBeHidden();
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    "tomato",
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    "stockroom",
  );
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "3",
  );
  await lookup.refresh.click();
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "loading",
  );
  await expect(lookup.previousAmount).toBeHidden();
});

test("stock lookup retries an initial technical failure with no previous quantity", async ({
  page,
}) => {
  await ready(page, "initial-failure");
  const lookup = await chooseLookupPair(page, "es");
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "error",
  );
  await expect(lookup.amount).toBeHidden();
  await expect(lookup.previousAmount).toBeHidden();
  await expect(lookup.refresh).toBeHidden();
  await lookup.retry.click();
  await expect(lookup.amount).toHaveText("12,125 kg");
  await expect(lookup.workspace).toHaveAttribute(
    "data-stock-lookup-request-count",
    "2",
  );
});

for (const outcome of ["denied", "invalid"] as const) {
  test(`stock lookup clears the previous balance on authoritative ${outcome} and keeps selectors usable`, async ({
    page,
  }) => {
    const copy = lookupMessages("es");
    await ready(page, outcome);
    const lookup = await chooseLookupPair(page, "es");
    await expect(lookup.amount).toHaveText("12,125 kg");
    await lookup.refresh.click();
    await expect(lookup.result).toHaveAttribute(
      "data-stock-lookup-result",
      outcome,
    );
    await expect(lookup.result).toContainText(copy[outcome]);
    await expect(lookup.result).not.toContainText(copy.previous);
    await expect(lookup.amount).toBeHidden();
    await expect(lookup.previousAmount).toBeHidden();
    await expect(lookup.refresh).toBeHidden();
    await expect(lookup.retry).toBeHidden();
    await expect(lookup.product).toBeEnabled();
    await expect(lookup.location).toBeEnabled();
    await chooseLookupProduct(page, "oil");
    await expect(lookup.workspace).toHaveAttribute(
      "data-stock-lookup-request-count",
      "3",
    );
  });
}

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`stock lookup ${locale} phone view exposes translated labels and exact scope`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const copy = lookupMessages(locale);
    const nav = catalogueMessages[locale];
    const lookup = await ready(page, "lookup", locale);
    await expect(page.locator("[data-navigation-title]")).toHaveText(
      nav.navStock,
    );
    await expect(lookup.product).toHaveAccessibleName(copy.product);
    await expect(lookup.location).toHaveAccessibleName(nav.navLocation);
    await expect(lookup.result.getByRole("heading")).toHaveText(copy.recorded);
    await expect(lookup.result).toContainText(copy.pickPair);
    await chooseLookupPair(page, locale);
    await expect(lookup.amount).toHaveText(
      locale === "en" ? "12.125 kg" : "12,125 kg",
    );
    await expect(lookup.refresh).toHaveAccessibleName(copy.refresh);
    await expect(lookup.selectedProduct).toContainText("Tomate pera");
    await expect(lookup.selectedLocation).toHaveText(nav.navStockroom);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(390);
  });
}
