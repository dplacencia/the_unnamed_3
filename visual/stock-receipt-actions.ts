import { expect, type Page } from "@playwright/test";
import { fillCreationForm } from "./products-creation-actions";

export function receiptForm(page: Page) {
  return {
    workspace: page.locator("[data-receipt-workspace]"),
    panel: page.locator("[data-receipt-panel]"),
    form: page.locator("[data-receipt-form]"),
    open: page.locator("[data-receipt-open]"),
    product: page.locator("[data-receipt-product]"),
    location: page.locator("[data-receipt-location]"),
    unit: page.locator("[data-receipt-unit]"),
    quantity: page.locator("[data-receipt-quantity]"),
    advanced: page.locator("[data-receipt-advanced]"),
    reference: page.locator("[data-receipt-reference]"),
    submit: page.locator("[data-receipt-submit]"),
    cancel: page.locator("[data-receipt-cancel]"),
    effect: page.locator("[data-receipt-effect]"),
    balance: page.locator("[data-receipt-balance]"),
    recordedQuantity: page.locator("[data-receipt-recorded-quantity]"),
  };
}

const fixtureProductNames = {
  tomato: "Tomate pera",
  boxes: "Cajas",
};

export async function chooseReceiptProduct(
  page: Page,
  product: keyof typeof fixtureProductNames,
) {
  const input = receiptForm(page).product;
  await input.fill(fixtureProductNames[product]);
  await page.locator(`[data-receipt-product-option="${product}"]`).click();
}

export async function fillReceiptForm(page: Page) {
  const form = receiptForm(page);
  await form.open.click();
  await chooseReceiptProduct(page, "tomato");
  await form.location.selectOption("stockroom");
  await form.unit.selectOption("g");
  await form.quantity.fill("500");
  return form;
}

export async function openReceiptFromProduct(page: Page) {
  await expect(page.locator("[data-products-browsing]")).toHaveAttribute(
    "data-browsing-state",
    "ready",
  );
  const creation = await fillCreationForm(page);
  await creation.submit.click();
  const shortcut = page.locator("[data-receipt-shortcut]");
  await expect(page.locator("[data-creation-panel]")).toHaveAttribute(
    "data-creation-panel",
    "confirmed",
  );
  await shortcut.click();
  const form = receiptForm(page);
  await expect(form.panel).toHaveAttribute("data-receipt-panel", "form");
  await expect(form.product).toHaveValue("Tomate pera");
  return form;
}

export async function stockReceiptAction(page: Page, action: string) {
  const form = receiptForm(page);
  await expect(form.workspace).toBeVisible();
  switch (action) {
    case "stock-receipt-ready":
      await expect(form.open).toBeVisible();
      await expect(form.panel).toBeHidden();
      break;
    case "stock-receipt-blank":
      await form.open.click();
      await expect(form.panel).toHaveAttribute("data-receipt-panel", "form");
      await expect(form.location).toHaveValue("");
      break;
    case "stock-receipt-chooser":
      await form.open.click();
      await form.product.fill("tom");
      await expect(
        page.locator('[data-receipt-product-option="tomato"]'),
      ).toBeVisible();
      break;
    case "stock-receipt-validation":
      await form.open.click();
      await chooseReceiptProduct(page, "boxes");
      await form.location.selectOption("stockroom");
      await form.quantity.fill("0,5");
      await form.submit.click();
      await expect(
        page.locator('[data-receipt-error="quantity"]'),
      ).toBeVisible();
      break;
    case "stock-receipt-advanced":
      await fillReceiptForm(page);
      await form.advanced.click();
      await form.reference.fill("ALB-0500");
      await expect(form.reference).toBeVisible();
      break;
    case "stock-receipt-switch-product":
      await fillReceiptForm(page);
      await chooseReceiptProduct(page, "boxes");
      await expect(page.locator("[data-receipt-confirm-change]")).toBeVisible();
      break;
    case "stock-receipt-switch-unit":
      await fillReceiptForm(page);
      await form.unit.selectOption("kg");
      await expect(page.locator("[data-receipt-confirm-change]")).toBeVisible();
      break;
    case "stock-receipt-discard":
      await fillReceiptForm(page);
      await form.cancel.click();
      await expect(page.locator("[data-receipt-discard]")).toBeVisible();
      break;
    case "stock-receipt-from-product":
      await openReceiptFromProduct(page);
      await expect(form.location).toHaveValue("");
      break;
    case "stock-receipt-applied":
    case "stock-receipt-read-error":
    case "stock-receipt-read-denied": {
      await fillReceiptForm(page);
      await form.submit.click();
      await expect(form.panel).toHaveAttribute("data-receipt-panel", "applied");
      const balanceState = {
        "stock-receipt-applied": "ready",
        "stock-receipt-read-error": "error",
        "stock-receipt-read-denied": "denied",
      }[action];
      await expect(form.balance).toHaveAttribute(
        "data-receipt-balance",
        balanceState,
      );
      break;
    }
    case "stock-receipt-pending":
    case "stock-receipt-rejected":
    case "stock-receipt-unconfirmed":
    case "stock-receipt-memory": {
      await fillReceiptForm(page);
      await form.submit.click();
      await expect(form.panel).toHaveAttribute(
        "data-receipt-panel",
        action === "stock-receipt-memory"
          ? "unconfirmed"
          : action.replace("stock-receipt-", ""),
      );
      if (action === "stock-receipt-memory")
        await expect(page.locator("[data-receipt-memory]")).toBeVisible();
      break;
    }
    case "stock-receipt-restored":
      await expect(page.locator("[data-receipt-summary]")).toBeVisible();
      await expect(page.locator("[data-receipt-resume]")).toBeVisible();
      await expect(form.workspace).toHaveAttribute(
        "data-receipt-request-count",
        "0",
      );
      await expect(form.panel).toBeHidden();
      break;
    default:
      throw new Error(`Unknown stock receipt interaction: ${action}`);
  }
}
