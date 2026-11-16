import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import {
  navigatePreview,
  choosePreviewLocation,
} from "../navigation-actions.ts";

async function editTable(page: Page, story = "catalogue") {
  await ready(page, story);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
}

test("editing starts only on request and cannot replace an existing SKU", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-edit-name]")).toHaveCount(0);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator("[data-edit-name]")).toHaveCount(16);
  await expect(page.locator('[data-edit-sku="product-1"]')).toHaveCount(0);
  await page
    .locator('[data-product-id="product-8"]')
    .getByRole("button", { name: "Asignar SKU", exact: true })
    .click();
  await expect(page.locator('[data-edit-sku="product-8"]')).toBeVisible();
});

test("editing validates every draft before saving and preserves accepted spaces", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill(" ");
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar nuevo");
  await page.locator("[data-edit-save]").click();
  await expect(
    page.locator('[data-edit-error="product-1-name"]'),
  ).toBeVisible();
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  await page.locator('[data-edit-name="product-1"]').fill("  Café nuevo  ");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "  Café nuevo  ",
  );
  await page.locator("[data-edit-exit]").click();
  expect(
    await page
      .locator('[data-product-id="product-1"] [data-product-name]')
      .textContent(),
  ).toBe("  Café nuevo  ");
});

test("editing retains raw prohibited pasted text instead of repairing it", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café\noriginal");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café\noriginal",
  );
  await expect(
    page.locator('[data-edit-error="product-1-name"]'),
  ).toContainText("caracteres");
});

test("editing reports mixed field outcomes and retains only the failed assignment", async ({
  page,
}) => {
  await ready(page, "editing-mixed");
  await page
    .locator('[data-product-id="product-8"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page.locator('[data-edit-name="product-8"]').fill("Chocolate puro");
  await page.getByRole("button", { name: "Asignar SKU", exact: true }).click();
  await page.locator('[data-edit-sku="product-8"]').fill("000008");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-8"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator('[data-edit-result="product-8"]')).toContainText(
    "Cambios no guardados",
  );
  await expect(page.locator('[data-edit-sku="product-8"]')).toHaveValue(
    "000008",
  );
  await page.locator("[data-edit-exit]").click();
  await page.locator("[data-edit-discard]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toContainText("Chocolate puro");
  await expect(page.getByRole("dialog")).toContainText("Sin asignar");
});

test("editing keeps unconfirmed results distinct and retains the draft", async ({
  page,
}) => {
  await editTable(page, "editing-unconfirmed");
  await page.locator('[data-edit-name="product-1"]').fill("Café nuevo");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Sin confirmar",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café nuevo",
  );
  await expect(page.locator("[data-edit-save]")).toBeDisabled();
  await page.locator('[data-edit-name="product-1"]').focus();
  await expect(page.locator('[data-edit-name="product-1"]')).toBeFocused();
  await page.keyboard.type("x");
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café nuevo",
  );
  await page.locator('[data-edit-details="product-1"]').click();
  await expect(page.locator('[data-slot="sheet-content"]')).toContainText(
    "Sin confirmar",
  );
  await expect(page.locator('[data-slot="sheet-content"]')).toContainText(
    "Café nuevo",
  );
});

test("editing guards departure and keeps or explicitly discards unsaved drafts", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café borrador");
  await page.locator('[data-navigation-to="home"]').click();
  await expect(page.locator("[data-edit-guard]")).toBeVisible();
  await page.locator("[data-edit-continue]").click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café borrador",
  );
  await page.locator('[data-navigation-to="home"]').click();
  await page.locator("[data-edit-discard]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "home",
  );
  await navigatePreview(page, "products");
  await expect(
    page.locator('[data-product-id="product-1"] [data-product-name]'),
  ).toHaveText("Café molido");
});

test("editing saves before departure only after confirmed outcomes", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café confirmado");
  await page.locator('[data-navigation-to="home"]').click();
  await page.locator("[data-edit-save-exit]").click();
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "home",
  );
  await navigatePreview(page, "products");
  await expect(
    page.locator('[data-product-id="product-1"] [data-product-name]'),
  ).toHaveText("Café confirmado");
});

test("editing remains usable on phones with labelled fields and pinned product identity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await editTable(page);
  const input = page.locator('[data-edit-name="product-1"]');
  await input.fill("Café de prueba");
  await expect(input).toHaveAccessibleName(/Nombre/);
  const cell = page.locator(
    '[data-product-id="product-1"] [data-products-column="product"]',
  );
  const before = await cell.boundingBox();
  await page.locator("[data-products-scroll]").evaluate((element) => {
    element.scrollLeft = 300;
  });
  expect(Math.abs((await cell.boundingBox())!.x - before!.x)).toBeLessThan(2);
});

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

test("editing preserves overlength input and reports byte-limit errors", async ({
  page,
}) => {
  await editTable(page);
  const name = page.locator('[data-edit-name="product-1"]');
  await name.fill("á".repeat(513));
  await page.locator("[data-edit-save]").click();
  await expect(name).toHaveValue("á".repeat(513));
  await expect(
    page.locator('[data-edit-error="product-1-name"]'),
  ).toContainText("1024 bytes");
  await name.fill("Café válido");
  await page
    .locator('[data-product-id="product-8"]')
    .getByRole("button", { name: "Asignar SKU", exact: true })
    .click();
  await page.locator('[data-edit-sku="product-8"]').fill("é".repeat(129));
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-error="product-8-sku"]')).toContainText(
    "256 bytes",
  );
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
});

test("editing a missing SKU preserves its submitted code and stock stays read-only", async ({
  page,
}) => {
  await ready(page);
  await location(page);
  const stock = page.locator(
    '[data-product-id="product-1"] [data-products-column="stock"]',
  );
  const original = await stock.textContent();
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page
    .locator('[data-product-id="product-8"]')
    .getByRole("button", { name: "Asignar SKU", exact: true })
    .click();
  await page.locator('[data-edit-sku="product-8"]').fill(" 000008 ");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-8"]')).toContainText(
    "Cambios guardados",
  );
  expect(
    await page
      .locator('[data-product-id="product-8"] [data-products-column="sku"]')
      .textContent(),
  ).toBe(" 000008 ");
  expect(await stock.textContent()).toBe(original);
  await expect(stock.getByRole("textbox")).toHaveCount(0);
});

test("editing saves drafts outside the current visible search", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café conservado");
  await page.getByRole("searchbox").fill("000002");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(0);
  await expect(page.locator("[data-edit-count]")).toContainText("1 producto");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Cambios guardados",
  );
});

test("editing guards panel dismissal without losing its draft", async ({
  page,
}) => {
  await ready(page);
  await page
    .locator('[data-product-id="product-8"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page.locator('[data-edit-name="product-8"]').fill("Chocolate borrador");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-edit-guard]")).toBeVisible();
  await page.locator("[data-edit-continue]").click();
  await expect(page.locator('[data-edit-name="product-8"]')).toHaveValue(
    "Chocolate borrador",
  );
  await page.locator("[data-edit-exit]").click();
  await page.locator("[data-edit-discard]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toContainText("Chocolate negro");
});

test("editing does not leave after validation or partial save failure", async ({
  page,
}) => {
  await editTable(page, "editing-mixed");
  await page.locator('[data-edit-name="product-1"]').fill(" ");
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar editado");
  await page.locator('[data-navigation-to="home"]').click();
  await page.locator("[data-edit-save-exit]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(
    page.locator('[data-edit-error="product-1-name"]'),
  ).toBeVisible();
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "products",
  );
  await page.locator('[data-edit-name="product-1"]').fill("Café editado");
  await page.locator('[data-navigation-to="home"]').click();
  await page.locator("[data-edit-save-exit]").click();
  await expect(page.locator("[data-edit-guard]")).toContainText(
    "Cambios no guardados",
  );
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "products",
  );
});

test("editing keeps an unconfirmed result visible after explicit draft discard", async ({
  page,
}) => {
  await editTable(page, "editing-unconfirmed");
  await page.locator('[data-edit-name="product-1"]').fill("Café nuevo");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Sin confirmar",
  );
  await page.locator("[data-edit-exit]").click();
  await page.locator("[data-edit-discard]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.locator("[data-edit-name]")).toHaveCount(0);
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Sin confirmar",
  );
});

test("editing controls and guard translate in all five languages", async ({
  page,
}) => {
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const text = catalogueMessages[locale];
    await ready(page, "catalogue", locale);
    await page
      .getByRole("button", { name: text.peEditTable, exact: true })
      .click();
    await page.locator('[data-edit-name="product-1"]').fill("Café nuevo");
    await expect(page.locator("[data-edit-save]")).toHaveText(
      text.peSaveChanges,
    );
    await page.locator("[data-edit-exit]").click();
    await expect(page.locator("[data-edit-continue]")).toHaveText(
      text.peKeepEditing,
    );
    await page.locator("[data-edit-discard]").click();
    await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  }
});

test("editing reveals invalid drafts hidden by search", async ({ page }) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill(" ");
  await page.getByRole("searchbox").fill("000002");
  await page.getByRole("searchbox").press("Enter");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-validation-summary]")).toBeVisible();
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  await page.locator('[data-edit-review="product-1-name"]').click();
  await expect(page.locator('[data-edit-name="product-1"]')).toBeVisible();
  await expect(page.locator('[data-edit-name="product-1"]')).toBeFocused();
  await expect(page.getByRole("searchbox")).toHaveValue("000002");
  await page.locator('[data-edit-name="product-1"]').fill("Café corregido");
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café corregido",
  );
});

test("editing disambiguates save results for products with equal names", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café nuevo");
  await page.locator('[data-edit-name="product-16"]').fill("Café nuevo");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "000001",
  );
  await expect(page.locator('[data-edit-result="product-16"]')).toContainText(
    "000016",
  );
  const resultLink = page.locator('[data-edit-details="product-16"]');
  await expect(resultLink).toBeVisible();
  await expect(resultLink).toHaveAccessibleName(/000016/);
  await resultLink.click();
  await expect(page.locator('[data-slot="sheet-content"]')).toContainText(
    "000016",
  );
});

test("editing reveals a hidden SKU error on explicit review", async ({
  page,
}) => {
  await editTable(page);
  await page
    .locator('[data-product-id="product-8"]')
    .getByRole("button", { name: "Asignar SKU", exact: true })
    .click();
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await page
    .getByRole("checkbox", { name: catalogueMessages.es.gridSku, exact: true })
    .uncheck();
  await page.keyboard.press("Escape");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-validation-summary]")).toBeVisible();
  await page.locator('[data-edit-review="product-8-sku"]').click();
  await expect(page.locator('[data-edit-sku="product-8"]')).toBeVisible();
  await expect(page.locator('[data-edit-sku="product-8"]')).toBeFocused();
  await expect(page.locator('[data-products-column="sku"]')).toHaveCount(0);
  await page.locator('[data-edit-sku="product-8"]').fill("000008");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-8"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator('[data-edit-sku="product-8"]')).toHaveCount(0);
});

test("editing returns to its original draft when a panel switch fails validation", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill(" ");
  await page.locator('[data-product-expand="product-8"]').click();
  await page
    .locator('[data-product-summary="product-8"]')
    .getByRole("button", { name: "Abrir detalles", exact: true })
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page.locator("[data-edit-save-exit]").click();
  await expect(page.locator("[data-edit-guard]")).toHaveCount(0);
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
  await expect(page.locator("[data-edit-validation-summary]")).toBeVisible();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(" ");
});

test("editing review restores focus when correction removes the last change", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill(" ");
  await page.getByRole("searchbox").fill("000002");
  await page.getByRole("searchbox").press("Enter");
  await page.locator("[data-edit-save]").click();
  await page.locator('[data-edit-review="product-1-name"]').click();
  await page.locator('[data-edit-name="product-1"]').fill("Café molido");
  await expect(page.locator("[data-edit-save]")).toBeDisabled();
  await page
    .getByRole("button", { name: "Cerrar revisión", exact: true })
    .click();
  await expect(page.locator("[data-edit-exit]")).toBeFocused();
});

test("editing phone guard keeps many individual results and actions reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await editTable(page, "editing-mixed");
  for (let index = 1; index <= 16; index++)
    await page
      .locator(`[data-edit-name="product-${index}"]`)
      .fill(`Producto editado ${index}`);
  await page.locator("[data-edit-exit]").click();
  await page.locator("[data-edit-save-exit]").click();
  const guard = page.locator("[data-edit-guard]");
  await expect(guard.locator("[data-edit-result]")).toHaveCount(16);
  expect((await guard.boundingBox())!.height).toBeLessThanOrEqual(812);
  const keep = page.locator("[data-edit-continue]");
  await keep.scrollIntoViewIfNeeded();
  const box = (await keep.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  await keep.click();
  await expect(page.locator('[data-edit-name="product-16"]')).toHaveValue(
    "Producto editado 16",
  );
});

test("editing phone panel keeps a maximum-length name and its actions within reach", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await page
    .locator('[data-product-id="product-8"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page.locator('[data-edit-name="product-8"]').fill("a".repeat(1024));
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-8"]')).toContainText(
    "Cambios guardados",
  );
  const panel = page.locator('[data-slot="sheet-content"]');
  expect(
    await panel.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);
  const finish = page.locator("[data-edit-exit]");
  await finish.scrollIntoViewIfNeeded();
  const box = (await finish.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  await finish.click();
});

test("editing table and nested departure guard pass focused accessibility audits", async ({
  page,
}) => {
  await editTable(page);
  let result = await new AxeBuilder({ page })
    .include("[data-products-preview]")
    .analyze();
  expect(result.violations).toEqual([]);
  await page.locator('[data-edit-name="product-1"]').fill("Café nuevo");
  await page.locator("[data-edit-exit]").click();
  await page.locator("[data-edit-guard]").evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  result = await new AxeBuilder({ page })
    .include("[data-edit-guard]")
    .analyze();
  expect(result.violations).toEqual([]);
});

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
  const panel = page.locator('[data-slot="sheet-content"]');
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
  await expect
    .poll(async () => (await page.getByRole("dialog").boundingBox())!.width)
    .toBeCloseTo(page.viewportSize()!.width, 2);
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

test("editing blocks result inspection while a save is in flight", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café primero");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Café primero",
  );
  await page.locator('[data-edit-name="product-1"]').fill("Café segundo");
  await page.locator('[data-edit-details="product-1"]').evaluate((element) => {
    const state = window as Window & { inspectionWasBlocked?: boolean };
    state.inspectionWasBlocked = false;
    const observer = new MutationObserver(() => {
      if ((element as HTMLButtonElement).disabled) {
        state.inspectionWasBlocked = true;
        observer.disconnect();
      }
    });
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["disabled"],
    });
  });
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Café segundo",
  );
  expect(
    await page.evaluate(
      () =>
        (window as Window & { inspectionWasBlocked?: boolean })
          .inspectionWasBlocked,
    ),
  ).toBe(true);
});

test("save results dismiss and reopen without losing confirmed changes and refresh for a new save", async ({
  page,
}) => {
  await editTable(page);
  await page.locator('[data-edit-name="product-1"]').fill("Café guardado");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-edit-dismiss-results]")).toBeVisible();
  await page.locator("[data-edit-dismiss-results]").click();
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  await expect(page.locator("[data-edit-results-collapsed]")).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-edit-show-results]")).toBeFocused();
  await expect(page.locator("[data-edit-save]")).toBeDisabled();
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-edit-results-collapsed]")
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.locator("[data-edit-show-results]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Café guardado",
  );
  await expect(page.locator("[data-edit-dismiss-results]")).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).include("[data-edit-results]").analyze())
      .violations,
  ).toEqual([]);
  await page.locator("[data-edit-dismiss-results]").click();
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar guardado");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-2"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-edit-results-collapsed]")).toHaveCount(0);
  await page.locator("[data-edit-exit]").click();
  await expect(
    page.locator('[data-product-id="product-1"] [data-product-name]'),
  ).toHaveText("Café guardado");
});

test("dismissing mixed results preserves failed drafts and scopes presentation to its view", async ({
  page,
}) => {
  await editTable(page, "editing-mixed");
  await page.locator('[data-edit-name="product-1"]').fill("Café confirmado");
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar pendiente");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-2"]')).toContainText(
    "Cambios no guardados",
  );
  await page.locator("[data-edit-dismiss-results]").click();
  await expect(page.locator("[data-edit-results-collapsed]")).toContainText(
    "Algunos cambios se han guardado",
  );
  await expect(page.locator('[data-edit-name="product-2"]')).toHaveValue(
    "Azúcar pendiente",
  );
  await expect(page.locator("[data-edit-count]")).toContainText("1 producto");
  await expect(page.locator("[data-edit-save]")).toBeEnabled();
  await page.locator('[data-product-expand="product-2"]').click();
  await page
    .locator('[data-product-summary="product-2"]')
    .getByRole("button", { name: "Abrir detalles", exact: true })
    .click();
  const panel = page.locator('[data-slot="sheet-content"]');
  await expect(panel.locator('[data-edit-result="product-2"]')).toContainText(
    "Cambios no guardados",
  );
  await panel.locator("[data-edit-dismiss-results]").click();
  await expect(panel.locator("[data-edit-results]")).toHaveCount(0);
  await expect(panel.locator("[data-edit-results-collapsed]")).toContainText(
    "Cambios no guardados",
  );
});

test("dismissing unconfirmed results preserves uncertainty and paused drafts", async ({
  page,
}) => {
  await editTable(page, "editing-unconfirmed");
  await page.locator('[data-edit-name="product-1"]').fill("Café sin confirmar");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Sin confirmar",
  );
  await page.locator("[data-edit-dismiss-results]").click();
  await expect(page.locator("[data-edit-results-collapsed]")).toContainText(
    "Hay cambios sin confirmar",
  );
  await expect(page.locator("[data-edit-save]")).toBeDisabled();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café sin confirmar",
  );
  await page.locator("[data-edit-show-results]").click();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Sin confirmar",
  );
  await page.locator("[data-edit-exit]").click();
  await expect(page.locator("[data-edit-guard]")).toContainText(
    "Hay cambios sin confirmar",
  );
});

test("save result dismissal and reopening translate in all five languages", async ({
  page,
}) => {
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const text = catalogueMessages[locale];
    await ready(page, "catalogue", locale);
    await page
      .getByRole("button", { name: text.peEditTable, exact: true })
      .click();
    await page.locator('[data-edit-name="product-1"]').fill("Café guardado");
    await page.locator("[data-edit-save]").click();
    await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
      text.peSaved,
    );
    await page
      .getByRole("button", {
        name: `${text.gridDetails}: ${text.peDismissResults}`,
        exact: true,
      })
      .click();
    await expect(page.locator("[data-edit-results-collapsed]")).toContainText(
      text.peSaved,
    );
    await page
      .getByRole("button", {
        name: `${text.gridDetails}: ${text.peShowResults}`,
        exact: true,
      })
      .click();
    await expect(page.locator("[data-edit-results]")).toHaveAttribute(
      "aria-label",
      text.peLastResults,
    );
    await expect(page.locator("[data-edit-results]")).toContainText(
      text.peSaved,
    );
  }
});
