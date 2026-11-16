import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";

function disclosureName(
  locale: keyof typeof catalogueMessages,
  expanded: boolean,
) {
  const text = catalogueMessages[locale];
  return `${text.gridDetails}: ${expanded ? text.peDismissResults : text.peShowResults}`;
}

function visibleLabelPattern(value: string) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

async function ready(
  page: Page,
  story = "exhausted",
  locale = "es",
  recovery = true,
) {
  await page.goto(
    `/iframe.html?id=inventory-products${recovery ? "-recovery" : ""}--${story}&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-products-preview]")).toBeVisible();
}

test("feedback recovery disclosure exposes its state and preserves uncertainty when collapsed", async ({
  page,
}) => {
  await ready(page);
  const summary = page.locator("[data-recovery-summary]");
  const toggle = summary.getByRole("button", {
    name: disclosureName("es", true),
    exact: true,
  });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const detailsId = await toggle.getAttribute("aria-controls");
  expect(detailsId).toBeTruthy();
  await expect(page.locator(`[id="${detailsId}"]`)).toBeVisible();
  await toggle.click();
  await expect(summary).toContainText(
    "No hemos podido confirmar que los cambios se han guardado.",
  );
  const reopen = summary.getByRole("button", {
    name: disclosureName("es", false),
    exact: true,
  });
  await expect(reopen).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(`[id="${detailsId}"]`)).toBeHidden();
  await expect(
    summary.getByRole("button", { name: "Reintentar", exact: true }),
  ).toHaveCount(0);
  await reopen.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    summary.getByRole("button", { name: "Reintentar", exact: true }),
  ).toBeVisible();
});

test("feedback editing disclosure supports keyboard use and reveals a later result set", async ({
  page,
}) => {
  await ready(page, "catalogue", "es", false);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page.locator('[data-edit-name="product-1"]').fill("Café conservado");
  await page.locator("[data-edit-save]").click();
  const close = page.locator("[data-edit-dismiss-results]");
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await close.focus();
  await page.keyboard.press("Enter");
  const compact = page.locator("[data-edit-results-collapsed]");
  await expect(compact).toContainText("Cambios guardados");
  await expect(page.locator("[data-edit-results]")).toHaveCount(0);
  const reopen = page.locator("[data-edit-show-results]");
  await expect(reopen).toHaveAttribute("aria-expanded", "false");
  await expect(reopen).toBeFocused();
  await page.keyboard.press("Space");
  await expect(close).toBeFocused();
  await expect(page.locator('[data-edit-result="product-1"]')).toContainText(
    "Café conservado",
  );
  await close.click();
  await page.locator('[data-edit-name="product-2"]').fill("Azúcar siguiente");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-results-collapsed]")).toHaveCount(0);
  await expect(page.locator('[data-edit-result="product-2"]')).toContainText(
    "Azúcar siguiente",
  );
  await expect(close).toHaveAttribute("aria-expanded", "true");
});

test("feedback panel preserves each mixed field outcome and exact submitted values", async ({
  page,
}) => {
  await ready(page, "editing-mixed", "es", false);
  await page
    .locator('[data-product-id="product-8"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  const panel = page.locator('[data-slot="sheet-content"]');
  const name = "  Chocolate puro  ";
  const sku = "000008";
  await page.locator('[data-edit-name="product-8"]').fill(name);
  await page.getByRole("button", { name: "Asignar SKU", exact: true }).click();
  await page.locator('[data-edit-sku="product-8"]').fill(sku);
  await page.locator("[data-edit-save]").click();
  const results = panel.locator("[data-edit-results]");
  await expect(results).toContainText("Algunos cambios se han guardado");
  await expect(results.locator("[data-edit-result]")).toHaveCount(1);
  await expect(results.locator('[data-outcome="confirmed"]')).toContainText(
    "Cambios guardados",
  );
  await expect(results.locator('[data-outcome="failed"]')).toContainText(
    "Cambios no guardados",
  );
  await expect(
    results.locator('[data-outcome="confirmed"] [title]'),
  ).toHaveAttribute("title", name);
  await expect(
    results.locator('[data-outcome="failed"] [title]'),
  ).toHaveAttribute("title", sku);
  await panel.locator("[data-edit-dismiss-results]").click();
  await expect(panel.locator("[data-edit-results-collapsed]")).toContainText(
    "Algunos cambios se han guardado",
  );
  await expect(page.locator('[data-edit-sku="product-8"]')).toHaveValue(sku);
  await expect(page.locator("[data-edit-save]")).toBeEnabled();
});

test("feedback recovery disclosure preserves retention notices without restarting requests", async ({
  page,
}) => {
  await ready(page, "memory-only");
  const summary = page.locator("[data-recovery-summary]");
  const preview = page.locator("[data-recovery-preview]");
  const count = await preview.getAttribute("data-request-count");
  await summary
    .getByRole("button", { name: disclosureName("es", true), exact: true })
    .click();
  await expect(summary).toContainText(
    "No hemos podido confirmar que los cambios se han guardado.",
  );
  await expect(page.locator("[data-recovery-retention]")).toContainText(
    "mientras esta página siga abierta",
  );
  await expect(preview).toHaveAttribute("data-request-count", count!);
  await summary
    .getByRole("button", { name: disclosureName("es", false), exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-request-count", count!);
  await expect(
    summary.getByRole("button", { name: "Reintentar", exact: true }),
  ).toBeEnabled();
});

test("feedback keeps confirmed business results distinct from local retention problems", async ({
  page,
}) => {
  await ready(page, "confirmed-storage-failure");
  const summary = page.locator("[data-recovery-summary]");
  await expect(summary).toContainText("Cambios guardados");
  await expect(page.locator("[data-recovery-retention]")).toContainText(
    "no hemos podido conservar la copia local",
  );
  await summary
    .getByRole("button", { name: disclosureName("es", true), exact: true })
    .click();
  await expect(summary).toContainText("Cambios guardados");
  await expect(page.locator("[data-recovery-retention]")).toBeVisible();
  await expect(summary).not.toContainText("Cambios no guardados");
});

test("feedback uncertainty survives filtered rows and preserves affected-product protection", async ({
  page,
}) => {
  await ready(page);
  const summary = page.locator("[data-recovery-summary]");
  await summary
    .getByRole("button", { name: disclosureName("es", true), exact: true })
    .click();
  const search = page.getByRole("searchbox");
  await search.fill("000002");
  await search.press("Enter");
  await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(0);
  await expect(summary).toContainText(
    "No hemos podido confirmar que los cambios se han guardado.",
  );
  await search.fill("");
  await search.press("Enter");
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await expect(page.locator('[data-edit-name="product-2"]')).toBeEditable();
  await summary
    .getByRole("button", { name: disclosureName("es", false), exact: true })
    .click();
  await expect(
    summary.getByRole("button", { name: "Reintentar", exact: true }),
  ).toBeEnabled();
});

test("feedback phone disclosure stays reachable with long product identity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "long-product-name");
  const summary = page.locator("[data-recovery-summary]");
  const toggle = summary.locator("[data-products-feedback-toggle]");
  await expect(toggle).toBeVisible();
  const box = (await toggle.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(
    await summary.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(
    summary.getByRole("button", {
      name: disclosureName("es", false),
      exact: true,
    }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    summary.getByRole("button", { name: "Reintentar", exact: true }),
  ).toBeVisible();
});

test("feedback disclosure labels and summaries translate in all five languages", async ({
  page,
}) => {
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const text = catalogueMessages[locale];
    await ready(page, "exhausted", locale);
    const recovery = page.locator("[data-recovery-summary]");
    const close = recovery.getByRole("button", {
      name: disclosureName(locale, true),
      exact: true,
    });
    await expect(close).toContainText(text.gridDetails);
    await expect(close).toHaveAccessibleName(
      visibleLabelPattern(text.gridDetails),
    );
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await close.click();
    await expect(recovery).toContainText(text.prUnconfirmed);
    await expect(
      recovery.getByRole("button", {
        name: disclosureName(locale, false),
        exact: true,
      }),
    ).toHaveAttribute("aria-expanded", "false");
    await expect(
      recovery.getByRole("button", {
        name: disclosureName(locale, false),
        exact: true,
      }),
    ).toHaveAccessibleName(visibleLabelPattern(text.gridDetails));
    await ready(page, "catalogue", locale, false);
    await page
      .getByRole("button", { name: text.peEditTable, exact: true })
      .click();
    await page
      .locator('[data-edit-name="product-1"]')
      .fill("Producto revisado");
    await page.locator("[data-edit-save]").click();
    const editClose = page.locator("[data-edit-dismiss-results]");
    await expect(editClose).toContainText(text.gridDetails);
    await expect(editClose).toHaveAccessibleName(
      visibleLabelPattern(text.gridDetails),
    );
    await editClose.click();
    await expect(page.locator("[data-edit-results-collapsed]")).toContainText(
      text.peSaved,
    );
    await expect(page.locator("[data-edit-show-results]")).toHaveAccessibleName(
      visibleLabelPattern(text.gridDetails),
    );
  }
});

test("feedback expanded and collapsed scopes pass focused accessibility checks", async ({
  page,
}) => {
  await ready(page);
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-recovery-summary]")
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .locator("[data-recovery-summary]")
    .getByRole("button", { name: disclosureName("es", true), exact: true })
    .click();
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-recovery-summary]")
        .analyze()
    ).violations,
  ).toEqual([]);
  await ready(page, "catalogue", "es", false);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page.locator('[data-edit-name="product-1"]').fill("Café verificado");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-edit-results]")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include("[data-edit-results]").analyze())
      .violations,
  ).toEqual([]);
  await page.locator("[data-edit-dismiss-results]").click();
  await expect(page.locator("[data-edit-results-collapsed]")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-edit-results-collapsed]")
        .analyze()
    ).violations,
  ).toEqual([]);
});
