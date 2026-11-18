import { expect, type Page } from "@playwright/test";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { choosePreviewLocation } from "./navigation-actions";
import { fillReceiptForm } from "./stock-receipt-actions";

export function stockLookup(page: Page) {
  return {
    workspace: page.locator("[data-stock-lookup-workspace]"),
    content: page.locator("[data-stock-lookup-content]"),
    product: page.locator("[data-stock-lookup-product]"),
    location: page.locator("[data-navigation-location]"),
    selectedProduct: page.locator("[data-stock-lookup-selected-product]"),
    selectedLocation: page.locator("[data-stock-lookup-selected-location]"),
    result: page.locator("[data-stock-lookup-result]"),
    amount: page.locator("[data-stock-lookup-amount]"),
    previousAmount: page.locator("[data-stock-lookup-previous-amount]"),
    refresh: page.locator("[data-stock-lookup-refresh]"),
    retry: page.locator("[data-stock-lookup-retry]"),
  };
}

const productNames = {
  tomato: "Tomate pera",
  "tomato-bulk": "Tomate pera",
  boxes: "Cajas",
  oil: "Aceite de oliva",
  flour: "Harina de trigo",
};

type ProductChoice = keyof typeof productNames;
type LocationChoice = "sales-floor" | "stockroom";

export async function chooseLookupProduct(page: Page, id: ProductChoice) {
  const { product } = stockLookup(page);
  await product.fill(productNames[id]);
  await page.locator(`[data-stock-lookup-product-option="${id}"]`).click();
  await expect(product).toHaveValue(productNames[id]);
}

export async function chooseLookupPair(
  page: Page,
  locale: Locale,
  product: ProductChoice = "tomato",
  location: LocationChoice = "stockroom",
) {
  await chooseLookupProduct(page, product);
  await choosePreviewLocation(page, location, locale);
  return stockLookup(page);
}

export async function openLookupFromProduct(page: Page) {
  await page
    .locator('[data-product-id="product-5"] [data-product-name]')
    .click();
  await page.locator("[data-stock-lookup-product-shortcut]").click();
  const lookup = stockLookup(page);
  await expect(lookup.content).toBeVisible();
  return lookup;
}

export async function applyLookupReceipt(
  page: Page,
  location: LocationChoice = "stockroom",
) {
  const receipt = await fillReceiptForm(page);
  if (location !== "stockroom") await receipt.location.selectOption(location);
  await receipt.submit.click();
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  const workspaceLocation =
    location === "stockroom" ? "Almacén" : "Sala de ventas";
  await expect(
    receipt.panel.getByText(workspaceLocation, { exact: true }),
  ).toBeVisible();
  return receipt;
}

export async function openLookupFromReceipt(
  page: Page,
  location: LocationChoice = "stockroom",
) {
  await applyLookupReceipt(page, location);
  await page.locator("[data-stock-lookup-receipt-shortcut]").click();
  const lookup = stockLookup(page);
  await expect(lookup.content).toBeVisible();
  return lookup;
}

export async function stockLookupAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const lookup = stockLookup(page);
  await expect(lookup.workspace).toBeAttached();
  switch (action) {
    case "stock-lookup-incomplete":
      await expect(lookup.product).toHaveValue("");
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "idle",
      );
      break;
    case "stock-lookup-duplicate-picker":
      await lookup.product.fill("Tomate pera");
      await expect(
        page.locator('[data-stock-lookup-product-option="tomato"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-stock-lookup-product-option="tomato-bulk"]'),
      ).toBeVisible();
      await expect(lookup.workspace).toHaveAttribute(
        "data-stock-lookup-request-count",
        "0",
      );
      break;
    case "stock-lookup-loading":
      await chooseLookupPair(page, locale);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "loading",
      );
      await expect(lookup.amount).toBeHidden();
      break;
    case "stock-lookup-positive":
    case "stock-lookup-zero":
    case "stock-lookup-negative":
    case "stock-lookup-absence": {
      const productByAction = {
        "stock-lookup-positive": "tomato",
        "stock-lookup-zero": "tomato-bulk",
        "stock-lookup-negative": "oil",
        "stock-lookup-absence": "flour",
      } as const;
      await chooseLookupPair(page, locale, productByAction[action]);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        action === "stock-lookup-absence" ? "no-record" : "balance",
      );
      break;
    }
    case "stock-lookup-refreshing":
    case "stock-lookup-failed-refresh":
    case "stock-lookup-denied":
    case "stock-lookup-invalid": {
      await chooseLookupPair(page, locale);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "balance",
      );
      await lookup.refresh.click();
      const phase = {
        "stock-lookup-refreshing": "loading",
        "stock-lookup-failed-refresh": "error",
        "stock-lookup-denied": "denied",
        "stock-lookup-invalid": "invalid",
      }[action];
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        phase,
      );
      if (phase === "loading" || phase === "error")
        await expect(lookup.previousAmount).toBeVisible();
      else await expect(lookup.previousAmount).toBeHidden();
      break;
    }
    case "stock-lookup-initial-error":
      await chooseLookupPair(page, locale);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "error",
      );
      await expect(lookup.previousAmount).toBeHidden();
      break;
    case "stock-lookup-positive-from-product":
      await openLookupFromProduct(page);
      await expect(lookup.selectedProduct).toHaveAttribute(
        "data-stock-lookup-selected-product",
        "product-5",
      );
      await choosePreviewLocation(page, "stockroom", locale);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "balance",
      );
      break;
    case "stock-lookup-refreshing-from-receipt":
      await openLookupFromReceipt(page);
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "balance",
      );
      await lookup.refresh.click();
      await expect(lookup.result).toHaveAttribute(
        "data-stock-lookup-result",
        "loading",
      );
      await expect(lookup.previousAmount).toBeVisible();
      break;
    default:
      throw new Error(`Unknown stock lookup interaction: ${action}`);
  }
}
