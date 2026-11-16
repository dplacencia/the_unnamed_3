import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import { navigatePreview } from "../navigation-actions.ts";
import { productsAction } from "../products-actions.ts";

async function ready(
  page: Page,
  story = "catalogue",
  locale = "es",
  catalogue = "products",
) {
  await page.goto(
    `/iframe.html?id=inventory-${catalogue}--${story}&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-products-preview]")).toBeVisible();
}

async function openFilters(page: Page) {
  await page.locator("[data-products-filter-trigger]").click();
  const popup = page.locator("[data-products-filters]");
  await expect(popup).toBeVisible();
  return popup;
}

test("products filters capture preparation restores the document origin after focus scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "filters", "gl");
  await productsAction(page, "products-filters-positive", "gl");
  await expect(page.locator("[data-products-filter-incomplete]")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

async function applyFilters(page: Page) {
  await page.locator("[data-products-filter-apply]").click();
  await expect(page.locator("[data-products-filters]")).toBeHidden();
}

async function submitSearch(page: Page, query: string) {
  await page.getByRole("searchbox").fill(query);
  await page.getByRole("searchbox").press("Enter");
}

async function location(
  page: Page,
  value: "sales-floor" | "stockroom",
  locale: keyof typeof catalogueMessages = "es",
) {
  const copy = catalogueMessages[locale];
  const label =
    value === "sales-floor" ? copy.navSalesFloor : copy.navStockroom;
  await page.locator("[data-products-location]").click();
  await page.getByRole("option", { name: label, exact: true }).click();
  await expect(page.locator("[data-products-location]")).toHaveText(label);
}

async function showStock(
  page: Page,
  value: "sales-floor" | "stockroom" = "sales-floor",
) {
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .check();
  await location(page, value);
}

async function positiveStock(page: Page) {
  const popup = await openFilters(page);
  await popup
    .getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    })
    .check();
  await applyFilters(page);
}

async function comfortable(page: Page) {
  await page.getByRole("button", { name: "Vista", exact: true }).click();
  await page.getByRole("combobox", { name: "Densidad", exact: true }).click();
  await page.getByRole("option", { name: "Cómoda", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-products-preview]")).toHaveAttribute(
    "data-density",
    "comfortable",
  );
}

test("products filters archive inclusion changes only after explicit Apply", async ({
  page,
}) => {
  await ready(page, "archived-product");
  const archived = page.locator('[data-product-id="product-1"]');
  await expect(archived).toHaveCount(0);
  const popup = await openFilters(page);
  await popup
    .getByRole("checkbox", { name: "Incluir archivados", exact: true })
    .check();
  await expect(archived).toHaveCount(0);
  await applyFilters(page);
  await expect(archived).toBeVisible();
  await expect(
    page.locator('[data-products-filter-remove="includeArchived"]'),
  ).toBeVisible();
});

test("products filters cancel Escape and outside dismissal abandon only draft choices", async ({
  page,
}) => {
  await ready(page, "archived-product");
  for (const close of ["cancel", "escape", "outside"]) {
    const popup = await openFilters(page);
    await popup
      .getByRole("checkbox", { name: "Incluir archivados", exact: true })
      .check();
    await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(0);
    if (close === "cancel")
      await popup
        .getByRole("button", { name: "Cancelar", exact: true })
        .click();
    else if (close === "escape") await page.keyboard.press("Escape");
    else
      await page
        .getByRole("heading", { name: "Productos", exact: true })
        .click();
    await expect(popup).toBeHidden();
    await expect(
      page.locator('[data-products-filter-remove="includeArchived"]'),
    ).toHaveCount(0);
    const reopened = await openFilters(page);
    await expect(
      reopened.getByRole("checkbox", {
        name: "Incluir archivados",
        exact: true,
      }),
    ).not.toBeChecked();
    await reopened
      .getByRole("button", { name: "Cancelar", exact: true })
      .click();
  }
});

test("products filters show confirmed location stock matches and scoped incompleteness", async ({
  page,
}) => {
  await ready(page);
  const unavailable = await openFilters(page);
  await expect(
    unavailable.getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    }),
  ).toHaveCount(0);
  await unavailable
    .getByRole("button", { name: "Cancelar", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "Mostrar existencias", exact: true })
    .check();
  const unselected = await openFilters(page);
  await expect(
    unselected.getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    }),
  ).toHaveCount(0);
  await unselected
    .getByRole("button", { name: "Cancelar", exact: true })
    .click();
  await location(page, "sales-floor");
  await positiveStock(page);
  await expect(page.locator("[data-product-id]")).toHaveCount(12);
  await expect(page.locator("[data-products-count]")).toContainText(/\b12\b/);
  for (const id of ["product-2", "product-3", "product-4", "product-6"])
    await expect(page.locator(`[data-product-id="${id}"]`)).toHaveCount(0);
  await expect(
    page.locator('[data-product-id="product-5"] .products-verification'),
  ).toBeVisible();
  await expect(page.locator("[data-products-filter-incomplete]")).toContainText(
    /\b1\b/,
  );
  await location(page, "stockroom");
  await expect(page.locator("[data-product-id]")).toHaveCount(16);
  await expect(page.locator("[data-products-count]")).toContainText(/\b16\b/);
  await expect(page.locator("[data-products-filter-incomplete]")).toHaveCount(
    0,
  );
  await location(page, "sales-floor");
  await submitSearch(page, "Café");
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await expect(page.locator("[data-products-filter-incomplete]")).toHaveCount(
    0,
  );
  await submitSearch(page, "000003");
  await expect(page.locator("[data-product-id]")).toHaveCount(0);
  await expect(page.locator("[data-products-filter-incomplete]")).toContainText(
    /\b1\b/,
  );
  await expect(
    page.getByText(catalogueMessages.es.ptNoResults, { exact: true }),
  ).toHaveCount(0);
});

test("products filters chips and scoped clear preserve the working view", async ({
  page,
}) => {
  await ready(page, "archived-product");
  await showStock(page, "stockroom");
  await comfortable(page);
  await submitSearch(page, "Café");
  const sku = page.locator('th[data-products-column="sku"]');
  await sku.getByRole("button").click();
  await sku.getByRole("button").click();
  await expect(sku).toHaveAttribute("aria-sort", "descending");
  await page.getByRole("searchbox").fill("búsqueda no enviada");
  const popup = await openFilters(page);
  await popup
    .getByRole("checkbox", { name: "Incluir archivados", exact: true })
    .check();
  await popup
    .getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    })
    .check();
  await applyFilters(page);
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await expect(page.getByRole("searchbox")).toHaveValue("búsqueda no enviada");
  await page.getByRole("searchbox").fill("Café");
  await page.locator('[data-products-filter-remove="includeArchived"]').click();
  await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(0);
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toBeVisible();
  await page.locator("[data-products-clear-filters]").click();
  await expect(page.locator("[data-products-filter-remove]")).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveValue("Café");
  await expect(sku).toHaveAttribute("aria-sort", "descending");
  await expect(page.locator("[data-products-preview]")).toHaveAttribute(
    "data-density",
    "comfortable",
  );
  await expect(page.locator("[data-products-location]")).toHaveText("Almacén");
  await expect(
    page.getByRole("checkbox", { name: "Mostrar existencias", exact: true }),
  ).toBeChecked();
  await expect(page.locator("[data-product-id]")).toHaveCount(1);
});

test("products filters hiding stock clears applied and unapplied stock constraints", async ({
  page,
}) => {
  await ready(page);
  await showStock(page);
  await positiveStock(page);
  const stock = page.getByRole("checkbox", {
    name: "Mostrar existencias",
    exact: true,
  });
  await stock.uncheck();
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toHaveCount(0);
  await stock.check();
  await expect(page.locator("[data-products-location]")).toHaveText(
    "Sala de ventas",
  );
  const popup = await openFilters(page);
  const draft = popup.getByRole("checkbox", {
    name: "Solo con existencias registradas",
    exact: true,
  });
  await expect(draft).not.toBeChecked();
  await draft.check();
  await stock.uncheck();
  await expect(popup).toBeHidden();
  await stock.check();
  const reopened = await openFilters(page);
  await expect(
    reopened.getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    }),
  ).not.toBeChecked();
  await applyFilters(page);
  await expect(page.locator("[data-product-id]")).toHaveCount(16);
});

test("products filters retain applied choices per tab and discard navigation drafts", async ({
  page,
}) => {
  await ready(page, "archived-product");
  await showStock(page, "stockroom");
  await comfortable(page);
  await submitSearch(page, "Café");
  const sku = page.locator('th[data-products-column="sku"]');
  await sku.getByRole("button").click();
  await sku.getByRole("button").click();
  const popup = await openFilters(page);
  await popup
    .getByRole("checkbox", { name: "Incluir archivados", exact: true })
    .check();
  await popup
    .getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    })
    .check();
  await applyFilters(page);
  await page.getByRole("searchbox").fill("búsqueda no enviada");
  const draft = await openFilters(page);
  await draft
    .getByRole("checkbox", { name: "Incluir archivados", exact: true })
    .uncheck();
  await navigatePreview(page, "stock");
  await navigatePreview(page, "products");
  await expect(page.getByRole("searchbox")).toHaveValue("Café");
  await expect(page.locator("[data-products-preview]")).toHaveAttribute(
    "data-density",
    "comfortable",
  );
  await expect(page.locator('th[data-products-column="sku"]')).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await expect(page.locator("[data-products-location]")).toHaveText("Almacén");
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  const restored = await openFilters(page);
  await expect(
    restored.getByRole("checkbox", { name: "Incluir archivados", exact: true }),
  ).toBeChecked();
  await expect(
    restored.getByRole("checkbox", {
      name: "Solo con existencias registradas",
      exact: true,
    }),
  ).toBeChecked();
  await restored.getByRole("button", { name: "Cancelar", exact: true }).click();
  const fresh = await page.context().newPage();
  try {
    await ready(fresh, "archived-product");
    await expect(fresh.getByRole("searchbox")).toHaveValue("");
    await expect(
      fresh.getByRole("checkbox", { name: "Mostrar existencias", exact: true }),
    ).not.toBeChecked();
    const defaults = await openFilters(fresh);
    await expect(
      defaults.getByRole("checkbox", {
        name: "Incluir archivados",
        exact: true,
      }),
    ).not.toBeChecked();
  } finally {
    await fresh.close();
  }
});

test("products filters preserve hidden invalid drafts and their explicit correction path", async ({
  page,
}) => {
  await ready(page);
  await showStock(page);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page.locator('[data-edit-name="product-2"]').fill(" ");
  await positiveStock(page);
  await expect(page.locator('[data-product-id="product-2"]')).toHaveCount(0);
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  await expect(page.locator("[data-edit-validation-summary]")).toBeVisible();
  await page.locator('[data-edit-review="product-2-name"]').click();
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar corregido");
  await expect(page.locator('[data-product-id="product-2"]')).toHaveCount(0);
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toBeVisible();
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-2"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator('[data-product-id="product-2"]')).toHaveCount(0);
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toBeVisible();
});

test("products filters never hide global recovery uncertainty or unlock a filtered product", async ({
  page,
}) => {
  await ready(page, "exhausted", "es", "products-recovery");
  await showStock(page);
  await positiveStock(page);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await submitSearch(page, "000007");
  await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(0);
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    catalogueMessages.es.prUnconfirmed,
  );
  await page.locator('[data-edit-name="product-7"]').fill("Agua editable");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-7"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    catalogueMessages.es.prUnconfirmed,
  );
  await submitSearch(page, "");
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
});

test("products filters phone panel is reachable by keyboard and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const trigger = page.locator("[data-products-filter-trigger]");
  await expect(trigger).toHaveAccessibleName("Filtros");
  await trigger.focus();
  await trigger.press("Enter");
  const popup = page.locator("[data-products-filters]");
  await expect(popup).toBeVisible();
  const bounds = await popup.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(-0.5);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390.5);
  expect(bounds!.height).toBeLessThanOrEqual(844.5);
  const archived = popup.getByRole("checkbox", {
    name: "Incluir archivados",
    exact: true,
  });
  await archived.focus();
  await archived.press("Space");
  await expect(archived).toBeChecked();
  await expect(
    popup.getByRole("button", { name: "Aplicar", exact: true }),
  ).toBeInViewport();
  await popup.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  const audit = await new AxeBuilder({ page })
    .include("[data-products-filters]")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("products filters actions and eligible fields use all five catalogue languages", async ({
  page,
}) => {
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const copy = catalogueMessages[locale];
    await ready(page, "catalogue", locale);
    await expect(
      page.locator("[data-products-filter-trigger]"),
    ).toHaveAccessibleName(copy.gridFilters);
    const popup = await openFilters(page);
    await expect(
      popup.getByRole("checkbox", {
        name: copy.pfIncludeArchived,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      popup.getByRole("button", { name: copy.gridApply, exact: true }),
    ).toBeVisible();
    await popup
      .getByRole("button", { name: copy.gridCancel, exact: true })
      .click();
    await page
      .getByRole("checkbox", { name: copy.gridShowStock, exact: true })
      .check();
    await location(page, "sales-floor", locale);
    const scoped = await openFilters(page);
    await expect(
      scoped.getByRole("checkbox", {
        name: copy.pfPositiveStockOnly,
        exact: true,
      }),
    ).toBeVisible();
    await scoped
      .getByRole("button", { name: copy.gridCancel, exact: true })
      .click();
  }
});

test("products filters recovery opener starts a fresh view without changing the original tab", async ({
  page,
}) => {
  await ready(page, "exhausted", "es", "products-recovery");
  await showStock(page);
  await positiveStock(page);
  const originalStock = page.getByRole("checkbox", {
    name: "Mostrar existencias",
    exact: true,
  });
  await expect(originalStock).toBeChecked();
  await expect(
    page.locator('[data-products-filter-remove="positiveStockOnly"]'),
  ).toBeVisible();

  const opened = page.waitForEvent("popup");
  await page.evaluate(() => window.open(window.location.href));
  const popup = await opened;
  try {
    await expect(popup.locator("[data-products-preview]")).toBeVisible();
    await expect(
      popup.getByRole("checkbox", {
        name: "Mostrar existencias",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(popup.locator("[data-products-filter-remove]")).toHaveCount(0);
    await expect(originalStock).toBeChecked();
    await expect(
      page.locator('[data-products-filter-remove="positiveStockOnly"]'),
    ).toBeVisible();
  } finally {
    await popup.close();
  }
});
