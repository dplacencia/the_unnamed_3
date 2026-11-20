import { expect, test, type Page } from "@playwright/test";
import { receiptMessages } from "../../apps/backoffice/.storybook/stories/stock-receipt-messages";
import { navigatePreview } from "../navigation-actions";
import { stockLookup } from "../stock-lookup-actions";
import { receiptForm } from "../stock-receipt-actions";

const productId = "product-1";
const productName = "Café molido";
const locationId = "stockroom";
const receiptCopy = receiptMessages.es;

type ReceiptStory = "proposed" | "balance-read-failed" | "pending";
type Story = "current" | ReceiptStory;

function productRow(page: Page) {
  return page.locator(`[data-product-id="${productId}"]`);
}

async function openProducts(page: Page, story: Story) {
  await page.goto(
    `/iframe.html?id=inventory-daily-stock-workflow--${story}&viewMode=story&globals=locale:es;theme:light`,
  );
  await expect(page.locator("[data-products-preview]")).toBeVisible();
}

async function findProduct(page: Page) {
  const search = page.getByRole("searchbox");
  await search.fill(productName);
  await search.press("Enter");
  const matchingNames = page.getByRole("button", {
    name: productName,
    exact: true,
  });
  await expect(matchingNames).toHaveCount(2);
  const row = productRow(page);
  await expect(row).toContainText("000001");
  await row.getByRole("button", { name: productName, exact: true }).click();
  const details = page.getByRole("dialog", { name: productName });
  await expect(details).toBeVisible();
  return details;
}

async function openProductReceipt(
  page: Page,
  story: ReceiptStory = "proposed",
) {
  await openProducts(page, story);
  const details = await findProduct(page);
  const shortcut = details.getByRole("button", {
    name: receiptCopy.open,
    exact: true,
  });
  await expect(shortcut).toBeVisible();
  await shortcut.click();

  const form = receiptForm(page);
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "form");
  await expect(form.form).toHaveAttribute(
    "data-receipt-selected-product",
    productId,
  );
  await expect(form.product).toHaveValue(productName);
  await expect(form.location).toHaveValue("");
  await expect(form.unit).toHaveValue("kg");
  await expect(form.quantity).toHaveValue("");
  return form;
}

async function submitProductReceipt(page: Page, story?: ReceiptStory) {
  const form = await openProductReceipt(page, story);
  await form.location.selectOption(locationId);
  await form.unit.selectOption("g");
  await form.quantity.fill("500");
  await form.submit.click();
  return form;
}

test("the product receipt keeps its exact identity from search through the recorded stock lookup", async ({
  page,
}) => {
  const receipt = await submitProductReceipt(page);
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.recordedQuantity).toHaveText("2,5 kg");
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );

  await page
    .getByRole("button", { name: "Ver existencias", exact: true })
    .click();
  const lookup = stockLookup(page);
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    productId,
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    locationId,
  );
  await expect(lookup.amount).toHaveText("2,5 kg");

  await navigatePreview(page, "products");
  await expect(page.getByRole("searchbox")).toHaveValue(productName);
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await expect(productRow(page)).toContainText("000001");
});

test("a failed balance read preserves the applied receipt and retries only the read", async ({
  page,
}) => {
  const receipt = await submitProductReceipt(page, "balance-read-failed");
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.balance).toHaveAttribute(
    "data-receipt-balance",
    "error",
  );
  await expect(receipt.recordedQuantity).toBeHidden();

  await receipt.balance
    .getByRole("button", { name: receiptCopy.readRetry, exact: true })
    .click();
  await expect(receipt.recordedQuantity).toHaveText("2,5 kg");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-read-count",
    "2",
  );
});

test("a confirmed pending receipt displays its status without claiming a stock effect", async ({
  page,
}) => {
  const receipt = await submitProductReceipt(page, "pending");
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "pending");
  await expect(
    receipt.panel.getByText(receiptCopy.pending, { exact: true }),
  ).toBeVisible();
  await expect(receipt.effect).toBeHidden();
  await expect(receipt.balance).toBeHidden();
  await expect(page.locator("[data-receipt-retry]")).toBeHidden();
  await expect(
    page.locator("[data-stock-lookup-receipt-shortcut]"),
  ).toBeHidden();
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-read-count",
    "0",
  );
});

test("both details variants fit a 320px phone and the proposed shortcut opens a usable receipt", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await openProducts(page, "current");
  const details = await findProduct(page);
  await expect(
    details.getByRole("button", { name: receiptCopy.open, exact: true }),
  ).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );

  const receipt = await openProductReceipt(page);
  await expect(receipt.submit).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

test("product actions are grouped in task order and fit phone and tablet", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 760 },
    { width: 768, height: 1024 },
  ]) {
    await test.step(`${viewport.width}px wide`, async () => {
      await page.setViewportSize(viewport);
      await openProducts(page, "proposed");
      const details = await findProduct(page);
      const actions = details.locator("[data-products-detail-actions]");
      await expect(actions).toBeVisible();
      const buttons = actions.getByRole("button");
      await expect(buttons).toHaveText([
        receiptCopy.open,
        "Ver existencias",
        "Editar",
      ]);
      for (const button of await buttons.all()) {
        await expect(button).toBeInViewport({ ratio: 1 });
      }
      expect(
        await actions.evaluate((group) => group.scrollWidth),
      ).toBeLessThanOrEqual(
        await actions.evaluate((group) => group.clientWidth),
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(viewport.width);
    });
  }
});

test("grouped product actions preserve the draft guard and the exact stock product", async ({
  page,
}) => {
  await openProducts(page, "proposed");
  const details = await findProduct(page);
  const actions = details.locator("[data-products-detail-actions]");
  await actions.getByRole("button", { name: "Editar", exact: true }).click();
  const name = details.locator(`[data-edit-name="${productId}"]`);
  await expect(name).toHaveValue(productName);
  await name.fill("Café molido de prueba");
  await details.getByRole("button", { name: "Cerrar", exact: true }).click();

  const guard = page.locator("[data-edit-guard]");
  await expect(guard).toBeVisible();
  await guard
    .getByRole("button", { name: "Seguir editando", exact: true })
    .click();
  await expect(name).toHaveValue("Café molido de prueba");
  await details.getByRole("button", { name: "Cerrar", exact: true }).click();
  await guard
    .getByRole("button", { name: "Descartar cambios", exact: true })
    .click();
  await expect(details).toBeHidden();

  await findProduct(page);
  await actions
    .getByRole("button", { name: "Ver existencias", exact: true })
    .click();
  const lookup = stockLookup(page);
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    productId,
  );
});
