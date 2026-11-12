import { expect, type Page } from "@playwright/test";
import { catalogueMessages } from "../apps/backoffice/.storybook/catalogue-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";

export async function openNavigation(page: Page) {
  if (
    (page.viewportSize()?.width ?? 1440) < 1280 &&
    !(await page.getByRole("dialog").isVisible())
  ) {
    await page.locator("header button").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  }
}
export async function choosePreviewLocation(
  page: Page,
  location: "sales-floor" | "stockroom",
  locale: Locale,
) {
  const copy = catalogueMessages[locale];
  await page.locator("[data-navigation-location]").click();
  await page
    .getByRole("option", {
      name: location === "sales-floor" ? copy.navSalesFloor : copy.navStockroom,
      exact: true,
    })
    .click();
  await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    location,
  );
}
export async function navigatePreview(page: Page, destination: string) {
  await openNavigation(page);
  await page.locator(`[data-navigation-to="${destination}"]`).click();
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    destination,
  );
  if ((page.viewportSize()?.width ?? 1440) < 1280)
    await expect(page.getByRole("dialog")).toBeHidden();
}
export async function navigationAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  switch (action) {
    case "navigation-footer-fold":
      await openNavigation(page);
      await page.locator("[data-navigation-footer-toggle]").click();
      await expect(
        page.locator("[data-navigation-footer-toggle]"),
      ).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator('[data-navigation-to="help"]')).toBeHidden();
      break;
    case "navigation-compact-footer-fold": {
      const mobile = (page.viewportSize()?.width ?? 1440) < 1280;
      if (mobile) await openNavigation(page);
      else await page.locator("header button").first().click();
      const toggle = page.locator("[data-navigation-footer-toggle]");
      await toggle.focus();
      await toggle.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.blur();
      if (!mobile) await page.mouse.move(1100, 500);
      await expect(page.locator('[data-navigation-to="help"]')).toBeHidden();
      break;
    }
    case "navigation-open":
      await openNavigation(page);
      break;
    case "navigation-location":
      await choosePreviewLocation(page, "stockroom", locale);
      break;
    case "navigation-memory":
      await choosePreviewLocation(page, "stockroom", locale);
      await navigatePreview(page, "movements");
      await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
        "data-navigation-scope",
        "unselected",
      );
      await choosePreviewLocation(page, "sales-floor", locale);
      await navigatePreview(page, "stock");
      await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
        "data-navigation-scope",
        "stockroom",
      );
      break;
    case "navigation-retry":
      await page
        .locator("[data-navigation-error] [data-navigation-retry]")
        .last()
        .click();
      await expect(page.locator("[data-navigation-error]")).toHaveCount(0);
      await expect(page.locator("[data-navigation-scope]")).toBeVisible();
      break;
    default:
      throw new Error(`Unknown navigation interaction: ${action}`);
  }
}
