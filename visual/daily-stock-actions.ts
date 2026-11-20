import { expect, type Page } from "@playwright/test";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { navigatePreview } from "./navigation-actions";
import { stockLookup } from "./stock-lookup-actions";
import { receiptForm } from "./stock-receipt-actions";

const productId = "product-1";
const productName = "Café molido";
const locationId = "stockroom";

export async function dailyStockAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const current = action.startsWith("daily-stock-current-");
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "products",
  );
  const search = page.getByRole("searchbox");
  await search.fill(productName);
  await search.press("Enter");
  await expect(
    page.getByRole("button", { name: productName, exact: true }),
  ).toHaveCount(2);
  const row = page.locator(`[data-product-id="${productId}"]`);
  await expect(row).toContainText("000001");
  await row.locator("[data-product-name]").click();
  const details = page.getByRole("dialog", { name: productName });
  await expect(
    details.getByRole("heading", { name: productName, exact: true }),
  ).toBeVisible();
  await expect(details.getByText("000001", { exact: true })).toBeVisible();

  const shortcut = details.locator("[data-products-receipt-shortcut]");
  const receipt = receiptForm(page);
  if (current) {
    await expect(shortcut).toBeHidden();
    if (action === "daily-stock-current-details") return;
    await details.locator('[data-slot="sheet-close"]').click();
    await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
    await navigatePreview(page, "movements");
    await receipt.open.click();
    await receipt.product.fill(productName);
    await page.locator(`[data-receipt-product-option="${productId}"]`).click();
  } else {
    await expect(shortcut).toBeVisible();
    if (action === "daily-stock-proposed-details") return;
    await shortcut.click();
  }

  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "form");
  await expect(receipt.form).toHaveAttribute(
    "data-receipt-selected-product",
    productId,
  );
  await expect(receipt.product).toHaveValue(productName);
  await expect(receipt.location).toHaveValue("");
  await expect(receipt.unit).toHaveValue("kg");
  await receipt.location.selectOption(locationId);
  await receipt.unit.selectOption("g");
  await receipt.quantity.fill("500");
  if (
    action === "daily-stock-current-receipt" ||
    action === "daily-stock-proposed-receipt"
  )
    return;

  await receipt.submit.click();
  const lookupShortcut = page.locator("[data-stock-lookup-receipt-shortcut]");
  if (action === "daily-stock-pending") {
    await expect(receipt.panel).toHaveAttribute(
      "data-receipt-panel",
      "pending",
    );
    await expect(receipt.effect).toBeHidden();
    await expect(receipt.balance).toBeHidden();
    await expect(lookupShortcut).toBeHidden();
    return;
  }

  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  if (action === "daily-stock-read-error") {
    await expect(receipt.balance).toHaveAttribute(
      "data-receipt-balance",
      "error",
    );
    await expect(receipt.recordedQuantity).toBeHidden();
    await expect(
      receipt.panel.locator("[data-receipt-read-retry]"),
    ).toBeVisible();
    return;
  }

  const recorded = locale === "en" ? "2.5 kg" : "2,5 kg";
  if (
    action === "daily-stock-current-applied" ||
    action === "daily-stock-proposed-applied"
  ) {
    await expect(receipt.balance).toHaveAttribute(
      "data-receipt-balance",
      "ready",
    );
    await expect(receipt.recordedQuantity).toHaveText(recorded);
    return;
  }
  if (
    action !== "daily-stock-current-lookup" &&
    action !== "daily-stock-proposed-lookup"
  )
    throw new Error(`Unknown daily stock interaction: ${action}`);

  await lookupShortcut.click();
  const lookup = stockLookup(page);
  await expect(lookup.result).toHaveAttribute(
    "data-stock-lookup-result",
    "balance",
  );
  await expect(lookup.selectedProduct).toHaveAttribute(
    "data-stock-lookup-selected-product",
    productId,
  );
  await expect(lookup.selectedLocation).toHaveAttribute(
    "data-stock-lookup-selected-location",
    locationId,
  );
  await expect(lookup.amount).toHaveText(recorded);
}
