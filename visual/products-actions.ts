import { expect, type Page } from "@playwright/test";
import { catalogueMessages } from "../apps/backoffice/.storybook/catalogue-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";

export async function productsAction(
  page: Page,
  action: string,
  locale: Locale,
): Promise<void> {
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
    case "products-results-dismissed":
    case "products-mixed-results-dismissed":
    case "products-unconfirmed-results-dismissed":
    case "products-panel-results-dismissed": {
      const source =
        action === "products-results-dismissed"
          ? "products-editing-saved"
          : action === "products-mixed-results-dismissed"
            ? "products-editing-results"
            : action === "products-unconfirmed-results-dismissed"
              ? "products-editing-unconfirmed"
              : "products-editing-panel-results";
      await productsAction(page, source, locale);
      await page
        .getByRole("button", { name: text.peDismissResults, exact: true })
        .click();
      await expect(page.locator("[data-edit-results-collapsed]")).toBeVisible();
      break;
    }
    case "products-editing":
    case "products-editing-invalid":
    case "products-editing-guard":
    case "products-editing-saved":
    case "products-editing-results":
    case "products-editing-unconfirmed":
    case "products-editing-stock": {
      if (action === "products-editing-stock") await selectLocation();
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-1"]')
        .fill(
          action === "products-editing-invalid" ? " " : "Café de especialidad",
        );
      if (action !== "products-editing-unconfirmed")
        await page
          .locator('[data-edit-name="product-2"]')
          .fill("Azúcar moreno");
      if (
        [
          "products-editing-invalid",
          "products-editing-saved",
          "products-editing-results",
          "products-editing-unconfirmed",
        ].includes(action)
      ) {
        await page.locator("[data-edit-save]").click();
        if (action === "products-editing-invalid")
          await expect(
            page.locator('[data-edit-error="product-1-name"]'),
          ).toBeVisible();
        else await expect(page.locator("[data-edit-results]")).toBeVisible();
      }
      if (action === "products-editing-guard") {
        await page.locator("[data-edit-exit]").click();
        await expect(page.locator("[data-edit-guard]")).toBeVisible();
      }
      await page.locator("[data-products-scroll]").evaluate((element) => {
        element.scrollTop = 0;
      });
      break;
    }
    case "products-editing-hidden-error": {
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page.locator('[data-edit-name="product-1"]').fill(" ");
      await page.getByRole("searchbox").fill("000002");
      await page.getByRole("searchbox").press("Enter");
      await page.locator("[data-edit-save]").click();
      await page.locator('[data-edit-review="product-1-name"]').click();
      await expect(page.locator('[data-edit-name="product-1"]')).toBeVisible();
      break;
    }
    case "products-editing-panel":
    case "products-editing-panel-results": {
      await page
        .locator('[data-product-id="product-8"] [data-product-name]')
        .click();
      await page
        .getByRole("button", { name: text.peEdit, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-8"]')
        .fill("Chocolate artesanal");
      await page
        .getByRole("button", { name: text.peAssignSku, exact: true })
        .click();
      await page.locator('[data-edit-sku="product-8"]').fill("000008");
      if (action === "products-editing-panel-results") {
        await page.locator("[data-edit-save]").click();
        await expect(page.locator("[data-edit-results]")).toBeVisible();
      } else {
        // Capture the approved overview with no field active. Replacing the
        // assignment trigger schedules popup focus restoration, racing fill().
        await page.locator('[data-slot="sheet-title"]').click();
        await expect(
          page.locator('[data-edit-sku="product-8"]'),
        ).not.toBeFocused();
      }
      break;
    }
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
