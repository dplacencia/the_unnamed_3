import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import {
  navigatePreview,
  choosePreviewLocation,
} from "../navigation-actions.ts";

const url = (story = "catalogue", locale = "es", theme = "light") =>
  `/iframe.html?id=inventory-products--${story}&viewMode=story&globals=locale:${locale};theme:${theme}`;
async function ready(
  page: Page,
  story = "catalogue",
  locale = "es",
  theme = "light",
) {
  await page.goto(url(story, locale, theme));
  await expect(page.locator("[data-products-preview]")).toBeVisible();
  await expect(page.locator('[data-product-id="product-1"]')).toBeVisible();
}
async function location(page: Page) {
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .check();
  await page.locator("[data-products-location]").click();
  await page
    .getByRole("option", { name: "Sala de ventas", exact: true })
    .click();
}

test("catalogue is compact and search changes rows only on submission", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-product-id]")).toHaveCount(16);
  await expect(page.locator('[data-products-column="stock"]')).toHaveCount(0);
  await page.getByRole("searchbox").fill("000001");
  await expect(page.locator("[data-product-id]")).toHaveCount(16);
  await page.getByRole("searchbox").press("Enter");
  await expect(page.locator("[data-product-id]")).toHaveCount(1);
  await expect(page.locator('[data-product-id="product-1"]')).toContainText(
    "000001",
  );
});

test("summaries start collapsed and open independently with exact codes", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-product-summary]")).toHaveCount(0);
  await page.locator('[data-product-expand="product-1"]').click();
  await page.locator('[data-product-expand="product-2"]').click();
  await expect(page.locator("[data-product-summary]")).toHaveCount(2);
  await expect(
    page.locator('[data-product-summary="product-1"]'),
  ).toContainText("0840000000001");
  await expect(
    page.locator('[data-product-summary="product-1"]'),
  ).toContainText("Activo");
  await page.locator('[data-product-expand="product-1"]').click();
  await expect(
    page.locator('[data-product-summary="product-2"]'),
  ).toBeVisible();
});

test("hidden catalogue fields are available in summaries and details", async ({
  page,
}) => {
  await ready(page);
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Referencia (SKU)", exact: true })
    .uncheck();
  await page.keyboard.press("Escape");
  await expect(page.locator('th[data-products-column="sku"]')).toHaveCount(0);
  await page.locator('[data-product-expand="product-1"]').click();
  const summary = page.locator('[data-product-summary="product-1"]');
  await expect(summary).toContainText("000001");
  await summary
    .getByRole("button", { name: "Abrir detalles", exact: true })
    .click();
  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("0840000000001");
  await expect(panel.getByRole("textbox")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("stock is requested and scoped, with exact zero and unknown distinctions", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .check();
  await expect(page.locator('[data-product-id="product-1"]')).not.toContainText(
    "12.125",
  );
  await page.locator("[data-products-location]").click();
  await page
    .getByRole("option", { name: "Sala de ventas", exact: true })
    .click();
  await expect(page.locator('[data-product-id="product-1"]')).toContainText(
    "12.125 kg",
  );
  await expect(page.locator('[data-product-id="product-2"]')).toContainText(
    "0 kg",
  );
  await expect(page.locator('[data-product-id="product-3"]')).toContainText(
    "Desconocido",
  );
  await expect(page.locator('[data-product-id="product-4"]')).toContainText(
    "Sin registro",
  );
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .uncheck();
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .check();
  await expect(page.locator("[data-products-location]")).toHaveText(
    "Sala de ventas",
  );
});

test("phone keeps product pinned and the panel fills the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await location(page);
  const product = page.locator(
    '[data-product-id="product-1"] [data-products-column="product"]',
  );
  const before = await product.boundingBox();
  await page.locator("[data-products-scroll]").evaluate((element) => {
    element.scrollLeft = 300;
  });
  expect(Math.abs((await product.boundingBox())!.x - before!.x)).toBeLessThan(
    2,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await product.locator("[data-product-name]").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await page.getByRole("dialog").boundingBox())!.width).toBe(390);
});

test("applied view survives leaving Products while search drafts do not", async ({
  page,
}) => {
  await ready(page);
  await location(page);
  await page.getByRole("searchbox").fill("Café");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await page.getByRole("searchbox").fill("unsubmitted draft");
  await navigatePreview(page, "stock");
  await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "unselected",
  );
  await choosePreviewLocation(page, "stockroom", "es");
  await navigatePreview(page, "products");
  await expect(page.getByRole("searchbox")).toHaveValue("Café");
  await expect(page.locator("[data-products-location]")).toHaveText(
    "Sala de ventas",
  );
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("Café");
});

test("column order and widths survive phone pinning and reset only columns", async ({
  page,
}) => {
  await ready(page);
  await location(page);
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Mover Referencia (SKU) hacia delante",
      exact: true,
    })
    .click();
  await page
    .getByRole("slider", { name: "Ancho de Referencia (SKU)", exact: true })
    .focus();
  await page
    .getByRole("slider", { name: "Ancho de Referencia (SKU)", exact: true })
    .press("End");
  await page.keyboard.press("Escape");
  await expect(
    page.locator("[data-products-preview] th").first(),
  ).toHaveAttribute("data-products-column", "sku");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.locator("[data-products-preview] th").first(),
  ).toHaveAttribute("data-products-column", "product");
  const productWidth = await page
    .locator('[data-product-id="product-1"] [data-products-column="product"]')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(productWidth).toBeLessThanOrEqual(201);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.locator("[data-products-preview] th").first(),
  ).toHaveAttribute("data-products-column", "sku");
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await page
    .getByRole("button", { name: "Restablecer columnas", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.locator("[data-products-preview] th").first(),
  ).toHaveAttribute("data-products-column", "product");
  await expect(page.locator("[data-products-location]")).toHaveText(
    "Sala de ventas",
  );
  await expect(
    page.getByRole("checkbox", { name: "Mostrar existencias", exact: true }),
  ).toBeChecked();
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`Products ${locale} has translated controls and summary labels`, async ({
    page,
  }) => {
    await ready(page, "catalogue", locale);
    const copy = catalogueMessages[locale];
    await expect(
      page.locator("[data-products-preview] th").first(),
    ).toContainText(copy.ptProduct);
    await page.locator('[data-product-expand="product-1"]').focus();
    await page.locator('[data-product-expand="product-1"]').press("Enter");
    await expect(
      page.locator('[data-product-summary="product-1"]'),
    ).toContainText(copy.ptBarcodes);
    await expect(
      page.locator('[data-product-summary="product-1"]'),
    ).toContainText(copy.ptActive);
    await page
      .locator('[data-product-summary="product-1"]')
      .getByRole("button", { name: copy.ptOpenDetails, exact: true })
      .click();
    await expect(page.getByRole("dialog")).toContainText("0840000000001");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
}

for (const theme of ["light", "dark"]) {
  test(`Products browsing and panel accessibility in ${theme}`, async ({
    page,
  }) => {
    await ready(page, "catalogue", "es", theme);
    await page.locator('[data-product-expand="product-1"]').click();
    const tableAudit = await new AxeBuilder({ page })
      .include("[data-products-preview]")
      .analyze();
    expect(tableAudit.violations).toEqual([]);
    await page
      .locator('[data-product-id="product-1"] [data-product-name]')
      .focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    const panelAudit = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    expect(panelAudit.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(
      page.locator('[data-product-id="product-1"] [data-product-name]'),
    ).toBeFocused();
  });
}

test("column movement matches the available menu entries", async ({ page }) => {
  await ready(page);
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Mover Unidad hacia atrás", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Mover Unidad hacia delante", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.locator("[data-products-preview] th").nth(1),
  ).toHaveAttribute("data-products-column", "unit");
});

test("long product names fit the pinned cell and remain complete in details", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const cell = page.locator(
    '[data-product-id="product-13"] [data-products-column="product"]',
  );
  const name = cell.locator("[data-product-name]");
  const label = "Aceite de oliva virgen extra de primera extracción en frío";
  await expect(name).toHaveText(label);
  const bounds = await name.boundingBox();
  const parent = await cell.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
    parent!.x + parent!.width,
  );
  await name.click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(label);
});
