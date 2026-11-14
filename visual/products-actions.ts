import { expect, type Page } from "@playwright/test";
import { catalogueMessages } from "../apps/backoffice/.storybook/catalogue-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";

export async function productsAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const text = catalogueMessages[locale];
  const selectLocation = async () => {
    await page
      .getByRole("checkbox", { name: text.gridShowStock, exact: true })
      .check();
    await page.locator("[data-products-location]").click();
    await page
      .getByRole("option", { name: text.navSalesFloor, exact: true })
      .click();
  };
  switch (action) {
    case "products-expanded":
      await page.locator('[data-product-expand="product-1"]').click();
      await page.locator('[data-product-expand="product-2"]').click();
      await expect(page.locator("[data-product-summary]")).toHaveCount(2);
      break;
    case "products-panel":
      await page
        .locator('[data-product-id="product-1"] [data-product-name]')
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      break;
    case "products-view":
      await page
        .getByRole("button", { name: text.gridView, exact: true })
        .click();
      await expect(
        page.getByRole("checkbox", { name: text.gridSku, exact: true }),
      ).toBeVisible();
      break;
    case "products-empty":
      await page.getByRole("searchbox").fill("__no_product_matches__");
      await page.getByRole("searchbox").press("Enter");
      await expect(
        page.getByText(text.ptNoResults, { exact: true }),
      ).toBeVisible();
      break;
    case "products-location":
      await selectLocation();
      break;
    case "products-expanded-stock":
      await selectLocation();
      await page.locator('[data-product-expand="product-1"]').click();
      break;
    case "products-location-options":
      await page.locator("[data-products-location]").click();
      await expect(page.getByRole("option")).toHaveCount(2);
      break;
    case "products-scrolled": {
      await selectLocation();
      const target = page.locator(
        '[data-product-id="product-1"] [data-products-column="product"]',
      );
      const before = await target.boundingBox();
      await page.locator("[data-products-scroll]").evaluate((element) => {
        element.scrollLeft = 320;
      });
      if ((page.viewportSize()?.width ?? 1440) < 640)
        expect(
          Math.abs((await target.boundingBox())!.x - before!.x),
        ).toBeLessThan(2);
      break;
    }
    default:
      throw new Error(`Unknown Products action: ${action}`);
  }
}
