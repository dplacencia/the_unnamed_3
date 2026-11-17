import { expect, type Page } from "@playwright/test";

export function creationForm(page: Page) {
  return {
    open: page.locator("[data-creation-open]"),
    name: page.locator("[data-creation-name]"),
    unit: page.locator("[data-creation-unit]"),
    advanced: page.locator("[data-creation-advanced]"),
    standard: page.locator("[data-creation-standard]"),
    custom: page.locator("[data-creation-custom]"),
    step: page.locator("[data-creation-step]"),
    review: page.locator("[data-creation-review]"),
    submit: page.locator("[data-creation-submit]"),
    cancel: page.locator("[data-creation-cancel]"),
  };
}

export async function fillCreationForm(page: Page) {
  const form = creationForm(page);
  await form.open.click();
  await form.name.fill("Tomate pera");
  await form.unit.selectOption("kg");
  return form;
}

export async function productsCreationAction(page: Page, action: string) {
  const form = creationForm(page);
  const panel = page.locator("[data-creation-panel]");
  await expect(form.open).toBeVisible();
  await expect(page.locator("[data-products-browsing]")).toHaveAttribute(
    "data-browsing-state",
    "ready",
  );

  switch (action) {
    case "products-creation-ready":
      await expect(panel).toBeHidden();
      break;
    case "products-creation-simple":
      await form.open.click();
      await expect(panel).toHaveAttribute("data-creation-panel", "form");
      await expect(form.unit).toHaveValue("");
      break;
    case "products-creation-validation":
      await form.open.click();
      await form.submit.click();
      await expect(form.name).toHaveAttribute("aria-invalid", "true");
      break;
    case "products-creation-advanced":
    case "products-creation-review":
      await fillCreationForm(page);
      await form.advanced.click();
      await form.custom.click();
      await form.step.fill("0,025");
      if (action === "products-creation-review") {
        await form.unit.selectOption("g");
        await expect(form.review).toBeVisible();
        await expect(form.review).toContainText("0,025");
      } else await expect(form.step).toHaveValue("0,025");
      break;
    case "products-creation-discard":
      await fillCreationForm(page);
      await form.cancel.click();
      await expect(page.locator("[data-creation-discard]")).toBeVisible();
      break;
    case "products-creation-confirmed":
    case "products-creation-unconfirmed":
    case "products-creation-memory":
    case "products-creation-rejected": {
      await fillCreationForm(page);
      await form.submit.click();
      const state =
        action === "products-creation-memory"
          ? "unconfirmed"
          : action.replace("products-creation-", "");
      await expect(panel).toHaveAttribute("data-creation-panel", state);
      if (action === "products-creation-memory")
        await expect(page.locator("[data-creation-memory]")).toBeVisible();
      break;
    }
    case "products-creation-restored":
      await expect(page.locator("[data-creation-resume]")).toBeVisible();
      await expect(panel).toBeHidden();
      await expect(page.locator("[data-creation-workspace]")).toHaveAttribute(
        "data-creation-request-count",
        "0",
      );
      break;
    default:
      throw new Error(`Unknown product creation interaction: ${action}`);
  }
}
