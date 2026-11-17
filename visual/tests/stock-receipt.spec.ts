import { expect, test, type Page } from "@playwright/test";
import { receiptMessages } from "../../apps/backoffice/.storybook/stories/stock-receipt-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import {
  chooseReceiptProduct,
  fillReceiptForm,
  openReceiptFromProduct,
  receiptForm,
} from "../stock-receipt-actions";

async function ready(page: Page, story = "movements", locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=inventory-first-stock-receipt--${story}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-receipt-workspace]")).toBeVisible();
}

test("stock receipt opens a blank draft from Movimientos", async ({ page }) => {
  await ready(page);
  const form = receiptForm(page);
  await form.open.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "form");
  await expect(form.product).toHaveValue("");
  await expect(form.location).toHaveValue("");
  await expect(form.quantity).toHaveValue("");
  await expect(form.reference).toBeHidden();
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "0",
  );
});

test("stock receipt requires an explicit destination and preserves an invalid whole-piece draft", async ({
  page,
}) => {
  await ready(page);
  const form = receiptForm(page);
  await form.open.click();
  await chooseReceiptProduct(page, "boxes");
  await expect(form.location).toHaveValue("");
  await expect(form.unit).toHaveValue("piece");
  await form.quantity.fill("0,5");
  await form.submit.click();
  await expect(page.locator('[data-receipt-error="location"]')).toBeVisible();
  await expect(form.location).toBeFocused();
  await form.location.selectOption("stockroom");
  await form.submit.click();
  await expect(page.locator('[data-receipt-error="quantity"]')).toBeVisible();
  await expect(form.quantity).toBeFocused();
  await expect(form.quantity).toHaveValue("0,5");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "0",
  );
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "form");
});

test("stock receipt shows exact applied grams separately from the recorded kilogram balance", async ({
  page,
}) => {
  await ready(page);
  const form = await fillReceiptForm(page);
  await form.submit.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.panel).toContainText("Tomate pera");
  await expect(form.panel).toContainText(
    receiptMessages.es.locationLabels.stockroom,
  );
  await expect(form.effect).toHaveText("500 g");
  await expect(form.balance).toHaveAttribute("data-receipt-balance", "ready");
  await expect(form.recordedQuantity).toHaveText("0,5 kg");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "1");
});

test("stock receipt confirms unit and product changes before clearing the amount", async ({
  page,
}) => {
  await ready(page);
  const form = await fillReceiptForm(page);
  const confirm = page.locator("[data-receipt-confirm-change]");
  const cancel = page.locator("[data-receipt-cancel-change]");
  await form.unit.selectOption("kg");
  await expect(confirm).toBeVisible();
  await cancel.click();
  await expect(form.unit).toHaveValue("g");
  await expect(form.quantity).toHaveValue("500");
  await form.unit.selectOption("kg");
  await confirm.click();
  await expect(form.unit).toHaveValue("kg");
  await expect(form.quantity).toHaveValue("");

  await form.quantity.fill("1,5");
  await chooseReceiptProduct(page, "boxes");
  await expect(confirm).toBeVisible();
  await cancel.click();
  await expect(form.product).toHaveValue("Tomate pera");
  await expect(form.unit).toHaveValue("kg");
  await expect(form.quantity).toHaveValue("1,5");
  await chooseReceiptProduct(page, "boxes");
  await confirm.click();
  await expect(form.product).toHaveValue("Cajas");
  await expect(form.unit).toHaveValue("piece");
  await expect(form.quantity).toHaveValue("");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "0",
  );
});

test("stock receipt keeps the unsent form until the merchant confirms discard", async ({
  page,
}) => {
  await ready(page);
  const form = await fillReceiptForm(page);
  await form.cancel.click();
  const keep = page.locator("[data-receipt-keep-editing]");
  await expect(keep).toBeVisible();
  await keep.click();
  await expect(form.quantity).toHaveValue("500");
  await expect(form.unit).toHaveValue("g");
  await form.cancel.click();
  await page.locator("[data-receipt-discard]").click();
  await expect(form.panel).toBeHidden();
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "0",
  );
  await form.open.click();
  await expect(form.product).toHaveValue("");
  await expect(form.location).toHaveValue("");
  await expect(form.quantity).toHaveValue("");
});

test("stock receipt retains an exact advanced reference when options are collapsed", async ({
  page,
}) => {
  await ready(page);
  const form = await fillReceiptForm(page);
  const reference = "  ALB-0500 á  ";
  await expect(form.reference).toBeHidden();
  await form.advanced.click();
  await form.reference.fill(reference);
  await form.advanced.click();
  await expect(form.reference).toBeHidden();
  await form.advanced.click();
  await expect(form.reference).toHaveValue(reference);
});

test("stock receipt opens the same editable form from confirmed product creation", async ({
  page,
}) => {
  await ready(page, "from-product");
  const form = await openReceiptFromProduct(page);
  await expect(form.form).toHaveAttribute(
    "data-receipt-selected-product",
    "preview-created-1",
  );
  await expect(form.location).toHaveValue("");
  await expect(form.unit).toHaveValue("kg");
  await expect(form.quantity).toHaveValue("");
  await chooseReceiptProduct(page, "boxes");
  await expect(form.product).toHaveValue("Cajas");
  await expect(form.unit).toHaveValue("piece");
});

test("stock receipt retries a failed balance read without sending another receipt", async ({
  page,
}) => {
  await ready(page, "read-error");
  const form = await fillReceiptForm(page);
  await form.submit.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.balance).toHaveAttribute("data-receipt-balance", "error");
  await expect(form.effect).toHaveText("500 g");
  await expect(form.recordedQuantity).toBeHidden();
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "1");
  await page.locator("[data-receipt-read-retry]").click();
  await expect(form.balance.getByRole("heading")).toBeFocused();
  await expect(form.balance).toHaveAttribute("data-receipt-balance", "ready");
  await expect(form.recordedQuantity).toHaveText("0,5 kg");
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "2");
});

test("stock receipt stays applied when the merchant lacks balance read access", async ({
  page,
}) => {
  await ready(page, "read-denied");
  const form = await fillReceiptForm(page);
  await form.submit.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.effect).toHaveText("500 g");
  await expect(form.balance).toHaveAttribute("data-receipt-balance", "denied");
  await expect(form.recordedQuantity).toBeHidden();
  await expect(page.locator("[data-receipt-read-retry]")).toBeHidden();
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "0");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
});

for (const outcome of ["pending", "rejected"] as const) {
  test(`stock receipt keeps authoritative ${outcome} separate from application and recovery`, async ({
    page,
  }) => {
    await ready(page, outcome);
    const form = await fillReceiptForm(page);
    await form.submit.click();
    await expect(form.panel).toHaveAttribute("data-receipt-panel", outcome);
    const copy = receiptMessages.es;
    await expect(form.panel).toContainText(copy[outcome]);
    await expect(form.panel).toContainText(
      outcome === "pending" ? copy.pendingReason : copy.rejectedReason,
    );
    await expect(form.effect).toBeHidden();
    await expect(form.balance).toBeHidden();
    await expect(page.locator("[data-receipt-retry]")).toBeHidden();
    await expect(form.workspace).toHaveAttribute(
      "data-receipt-request-count",
      "1",
    );
    await expect(form.workspace).toHaveAttribute(
      "data-receipt-read-count",
      "0",
    );
  });
}

test("stock receipt remains unconfirmed after three attempts until explicit recovery", async ({
  page,
}) => {
  await ready(page, "recovery");
  const form = await fillReceiptForm(page);
  await form.submit.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "unconfirmed");
  await expect(form.workspace).toHaveAttribute("data-receipt-run", "1");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "3",
  );
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "0");
  await page.locator("[data-receipt-retry]").click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.effect).toHaveText("500 g");
  await expect(form.workspace).toHaveAttribute("data-receipt-run", "2");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "4",
  );
});

test("stock receipt restoration shows the record without dispatch until resumed", async ({
  page,
}) => {
  await ready(page, "restored");
  const form = receiptForm(page);
  await expect(page.locator("[data-receipt-summary]")).toBeVisible();
  await expect(form.panel).toBeHidden();
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "0",
  );
  await expect(form.workspace).toHaveAttribute("data-receipt-read-count", "0");
  await page.locator("[data-receipt-resume]").click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.effect).toHaveText("500 g");
  await expect(form.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
});

test("stock receipt memory fallback explains retention limits and still allows recovery", async ({
  page,
}) => {
  await ready(page, "memory-only");
  const form = await fillReceiptForm(page);
  await form.submit.click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "unconfirmed");
  await expect(page.locator("[data-receipt-memory]")).toBeVisible();
  await page.locator("[data-receipt-retry]").click();
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(form.effect).toHaveText("500 g");
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`stock receipt ${locale} phone form fits and exposes translated field labels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, "movements", locale);
    const form = receiptForm(page);
    const copy = receiptMessages[locale];
    await form.open.click();
    await expect(form.product).toHaveAccessibleName(copy.product);
    await expect(form.location).toHaveAccessibleName(copy.destination);
    await chooseReceiptProduct(page, "tomato");
    await expect(form.quantity).toHaveAccessibleName(copy.quantity);
    await expect(form.unit).toHaveAccessibleName(copy.unit);
    await expect(form.submit).toHaveAccessibleName(copy.submit);
    await expect
      .poll(async () => (await form.panel.boundingBox())?.width)
      .toBeCloseTo(390, 0);
    await expect
      .poll(async () => (await form.panel.boundingBox())?.x)
      .toBeCloseTo(0, 0);
    await form.advanced.click();
    await expect(form.reference).toHaveAccessibleName(copy.reference);
    await expect(form.submit).toBeInViewport();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(390);
  });
}
