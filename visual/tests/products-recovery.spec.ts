import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";

async function ready(page: Page, story = "exhausted", locale = "es") {
  await page.goto(
    `/iframe.html?id=inventory-products-recovery--${story}&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-products-preview]")).toBeVisible();
}

test("pending recovery protects only affected products while another product saves", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "No hemos podido confirmar que los cambios se han guardado.",
  );
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Puedes trabajar con otros productos.",
  );
  await expect(page.locator("[data-recovery-summary]")).not.toContainText(
    "mientras confirmamos",
  );
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await page
    .locator('[data-edit-name="product-2"]')
    .fill("Azúcar sin interrumpir");
  await page.locator("[data-edit-save]").click();
  await expect(page.locator('[data-edit-result="product-2"]')).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "No hemos podido confirmar que los cambios se han guardado.",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
});

test("manual recovery is explicit and resolves the original pending save", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "3",
  );
  await page
    .getByRole("button", { name: "Reintentar", exact: true })
    .first()
    .click();
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "4",
  );
});

test("restored submitted work waits for explicit recovery", async ({
  page,
}) => {
  await ready(page, "restored");
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "0",
  );
  await expect(
    page
      .getByRole("button", { name: "Continuar recuperación", exact: true })
      .first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Continuar recuperación", exact: true })
    .first()
    .click();
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
});

test("known active editing rejects a second editor without takeover actions", async ({
  page,
}) => {
  await ready(page, "active-editor");
  await page
    .locator('[data-product-id="product-1"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await expect(page.locator("[data-recovery-owner-dialog]")).toContainText(
    "Este producto ya se está editando en otra pestaña.",
  );
  await expect(
    page.getByRole("button", { name: "Asumir edición", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveCount(0);
});

test("unreachable ownership is assumed explicitly and preserves its draft", async ({
  page,
}) => {
  await ready(page, "unreachable-editor");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await expect(page.locator("[data-recovery-owner-dialog]")).toContainText(
    "No podemos comprobar",
  );
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café de especialidad",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toBeEditable();
});

test("discard requires confirmation and starts from current product data", async ({
  page,
}) => {
  await ready(page, "unreachable-editor");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Descartar y empezar de nuevo", exact: true })
    .click();
  await expect(page.locator("[data-recovery-discard-dialog]")).toBeVisible();
  await page
    .getByRole("button", { name: "Cancelar", exact: true })
    .last()
    .click();
  await expect(page.locator("[data-recovery-owner-dialog]")).toBeVisible();
  await page
    .getByRole("button", { name: "Descartar y empezar de nuevo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Descartar y empezar", exact: true })
    .click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café molido",
  );
});

test("changed current data requires explicit review before draft editing", async ({
  page,
}) => {
  await ready(page, "changed-draft");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
    "Café actualizado",
  );
  await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
    "Café de especialidad",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveCount(0);
  await page
    .getByRole("button", { name: "He revisado los cambios", exact: true })
    .click();
  await expect(page.locator('[data-edit-name="product-1"]')).toBeEditable();
});

test("unavailable current data never passes as unchanged", async ({ page }) => {
  await ready(page, "unavailable-current-data");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
    "No podemos cargar los datos actuales",
  );
  await expect(
    page.getByRole("heading", { name: "Datos actuales", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "He revisado los cambios", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveCount(0);
});

test("former editor is read-only and cannot save under previous ownership", async ({
  page,
}) => {
  await ready(page, "former-editor");
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Aquí solo puedes consultarla",
  );
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await page.locator('[data-edit-name="product-1"]').focus();
  await page.keyboard.type("no");
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café molido",
  );
  await expect(page.locator("[data-edit-save]")).toBeDisabled();
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`recovery and ownership use the ${locale} catalogue language`, async ({
    page,
  }) => {
    await ready(page, "memory-only", locale);
    await expect(page.locator("[data-recovery-retention]")).toContainText(
      catalogueMessages[locale].prStorageMemory,
    );
    await ready(page, "unreachable-editor", locale);
    await page.locator('[data-recovery-owner-action="product-1"]').click();
    await expect(page.locator("[data-recovery-owner-dialog]")).toContainText(
      catalogueMessages[locale].prOwnerUnknown,
    );
    await expect(
      page.getByRole("button", {
        name: catalogueMessages[locale].prAssume,
        exact: true,
      }),
    ).toBeVisible();
  });
}

test("phone resolution actions stay reachable and keyboard-accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "unreachable-editor");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  const dialog = page.locator("[data-recovery-owner-dialog]");
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(390);
  expect(box!.height).toBeLessThanOrEqual(844);
  await expect(
    page.getByRole("button", { name: "Asumir edición", exact: true }),
  ).toBeInViewport();
  const audit = await new AxeBuilder({ page })
    .include("[data-recovery-owner-dialog]")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.locator('[data-recovery-owner-action="product-1"]'),
  ).toBeFocused();
});

test("automatic recovery respects its timeout and retries the original command", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T10:00:00Z") });
  await ready(page, "automatic");
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Puedes trabajar con otros productos mientras confirmamos que los cambios se han guardado.",
  );
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "1",
  );
  const expand = page.locator('[data-product-expand="product-1"]');
  await expand.focus();
  await page.clock.fastForward(16_000);
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "2",
  );
  await page.clock.fastForward(250);
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(expand).toBeFocused();
});

test("known recovery elsewhere prevents a second deliberate run", async ({
  page,
}) => {
  await ready(page, "recovery-elsewhere");
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "La recuperación se está realizando en otra pestaña",
  );
  await expect(
    page.getByRole("button", { name: "Reintentar", exact: true }).first(),
  ).toBeDisabled();
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "0",
  );
});

test("unavailable history stays unknown and a local retention error does not undo success", async ({
  page,
}) => {
  await ready(page, "unavailable-history");
  await expect(page.locator("[data-recovery-history]")).toContainText(
    "No podemos acceder",
  );
  await expect(
    page.getByRole("button", { name: "Continuar recuperación", exact: true }),
  ).toHaveCount(0);
  await ready(page, "confirmed-storage-failure");
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-recovery-retention]")).toContainText(
    "no hemos podido conservar la copia local",
  );
});

test("recovery confirmation preserves another product's latest unsent draft", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T10:00:00Z") });
  await ready(page, "automatic");
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page
    .locator('[data-edit-name="product-2"]')
    .fill("Borrador que debe conservarse");
  await page.clock.fastForward(16_000);
  await page.clock.fastForward(250);
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator('[data-edit-name="product-2"]')).toHaveValue(
    "Borrador que debe conservarse",
  );
  await expect(page.locator("[data-edit-count]")).toContainText("1");
});

test("draft takeover respects unrelated unsaved edits before changing ownership", async ({
  page,
}) => {
  await ready(page, "unreachable-editor");
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page
    .locator('[data-edit-name="product-2"]')
    .fill("Otro borrador sin guardar");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await expect(page.locator("[data-edit-guard]")).toBeVisible();
  await page
    .getByRole("button", { name: "Seguir editando", exact: true })
    .click();
  await expect(page.locator('[data-edit-name="product-2"]')).toHaveValue(
    "Otro borrador sin guardar",
  );
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveAttribute(
    "readonly",
    "",
  );
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Descartar cambios", exact: true })
    .click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café de especialidad",
  );
});

test("discard with unavailable current data never invents replacement values", async ({
  page,
}) => {
  await ready(page, "unavailable-current-data");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Descartar y empezar de nuevo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Descartar y empezar", exact: true })
    .click();
  await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
    "El borrador se ha descartado",
  );
  await expect(page.locator(".products-recovery-comparison")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(
    page.locator('[data-recovery-owner-action="product-1"]'),
  ).toHaveCount(0);
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveCount(0);
});

test("confirmed retained work is no longer described as an unsent draft", async ({
  page,
}) => {
  await ready(page, "unreachable-editor");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Asumir edición", exact: true })
    .click();
  await page.locator("[data-edit-save]").click();
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(page.locator("[data-recovery-summary]")).not.toContainText(
    "Hay un borrador pendiente de este producto.",
  );
});

test("inaccessible historical records do not restore guessed command content", async ({
  page,
}) => {
  await ready(page, "unavailable-history");
  await expect(page.locator("[data-recovery-history]")).toBeVisible();
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await expect(page.locator('[data-edit-name="product-1"]')).toHaveValue(
    "Café molido",
  );
  await expect(page.locator("[data-recovery-preview]")).toHaveAttribute(
    "data-request-count",
    "0",
  );
});

test("panel editing cannot resurrect a discarded inaccessible draft", async ({
  page,
}) => {
  await ready(page, "unavailable-current-data");
  await page.locator('[data-recovery-owner-action="product-1"]').click();
  await page
    .getByRole("button", { name: "Descartar y empezar de nuevo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Descartar y empezar", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await page
    .locator('[data-product-id="product-1"] [data-product-name]')
    .click();
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
    "El borrador se ha descartado",
  );
  await expect(
    page.getByRole("button", { name: "Continuar borrador", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Descartar y empezar de nuevo",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("keyboard recovery completion announces its outcome and keeps a useful focus", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T10:00:00Z") });
  await ready(page);
  const retry = page
    .getByRole("button", { name: "Reintentar", exact: true })
    .first();
  await retry.focus();
  await retry.press("Enter");
  await page.clock.fastForward(250);
  const outcome = page.locator(
    '[data-recovery-status="original-fixture-command"]',
  );
  await expect(outcome).toContainText("Cambios guardados");
  await expect(outcome).toHaveAttribute("role", "status");
  await expect(outcome).toHaveAttribute("aria-live", "polite");
  await expect(outcome).toBeFocused();
});

test("manual recovery never steals focus after the merchant moves to another field", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T10:00:00Z") });
  await ready(page);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  await page
    .getByRole("button", { name: "Reintentar", exact: true })
    .first()
    .click();
  const other = page.locator('[data-edit-name="product-2"]');
  await other.focus();
  await other.fill("Seguir trabajando aquí");
  await page.clock.fastForward(250);
  await expect(page.locator("[data-recovery-summary]")).toContainText(
    "Cambios guardados",
  );
  await expect(other).toBeFocused();
  await expect(other).toHaveValue("Seguir trabajando aquí");
});

test("recovery completion keeps focus inside its own preview instance", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T10:00:00Z") });
  await ready(page);
  await page.evaluate(() => {
    const anotherPreviewStatus = document.createElement("span");
    anotherPreviewStatus.setAttribute(
      "data-recovery-status",
      "original-fixture-command",
    );
    anotherPreviewStatus.setAttribute("data-other-preview-status", "true");
    anotherPreviewStatus.tabIndex = -1;
    document.body.prepend(anotherPreviewStatus);
  });
  const retry = page
    .getByRole("button", { name: "Reintentar", exact: true })
    .first();
  await retry.focus();
  await retry.press("Enter");
  await page.clock.fastForward(250);
  await expect(
    page.locator(
      '[data-recovery-preview] [data-recovery-status="original-fixture-command"]',
    ),
  ).toBeFocused();
  await expect(page.locator("[data-other-preview-status]")).not.toBeFocused();
});

test("row status editor preserves the available phone name-input width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await page.getByRole("button", { name: "Editar tabla", exact: true }).click();
  const row = page.locator('[data-product-id="product-1"]');
  const name = row.locator('[data-edit-name="product-1"]');
  const neighbor = page.locator('[data-edit-name="product-2"]');
  await expect(name).toHaveAttribute("readonly", "");
  await expect(neighbor).toBeEditable();
  const nameBox = await name.boundingBox();
  const neighborBox = await neighbor.boundingBox();
  const areaBox = await row.locator(".products-name-cell").boundingBox();
  expect(nameBox).not.toBeNull();
  expect(neighborBox).not.toBeNull();
  expect(areaBox).not.toBeNull();
  expect(Math.abs(nameBox!.width - neighborBox!.width)).toBeLessThanOrEqual(2);
  expect(
    Math.abs(nameBox!.x + nameBox!.width - areaBox!.x - areaBox!.width),
  ).toBeLessThanOrEqual(2);
  await expect(row).toHaveAttribute("data-product-row-state", "unconfirmed");
  await expect(
    row.locator(
      '[data-product-expand="product-1"] [data-product-status-marker]',
    ),
  ).toBeVisible();
  await expect(
    row.locator(".products-name-cell > .products-recovery-row-state"),
  ).toHaveCount(0);
});

test("row status long phone name retains the same space as unaffected products", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "long-product-name");
  const row = page.locator('[data-product-id="product-1"]');
  const neighbor = page.locator('[data-product-id="product-2"]');
  const name = row.locator("[data-product-name]");
  const fullName = (await name.textContent())!;
  await expect(name).toHaveAttribute("title", fullName);
  await expect(name).toHaveAccessibleName(fullName);
  const overflow = await name.evaluate((element) => ({
    content: element.scrollWidth,
    visible: element.clientWidth,
  }));
  expect(overflow.content).toBeGreaterThan(overflow.visible);
  const nameBox = await name.boundingBox();
  const neighborNameBox = await neighbor
    .locator("[data-product-name]")
    .boundingBox();
  const rowBox = await row.boundingBox();
  const neighborBox = await neighbor.boundingBox();
  expect(nameBox).not.toBeNull();
  expect(neighborNameBox).not.toBeNull();
  expect(rowBox).not.toBeNull();
  expect(neighborBox).not.toBeNull();
  expect(Math.abs(nameBox!.width - neighborNameBox!.width)).toBeLessThanOrEqual(
    2,
  );
  expect(Math.abs(rowBox!.height - neighborBox!.height)).toBeLessThanOrEqual(2);
  const cell = row.locator('[data-products-column="product"]');
  const neighborCell = neighbor.locator('[data-products-column="product"]');
  const cellBox = await cell.boundingBox();
  const neighborCellBox = await neighborCell.boundingBox();
  expect(cellBox).not.toBeNull();
  expect(neighborCellBox).not.toBeNull();
  expect(Math.abs(cellBox!.width - neighborCellBox!.width)).toBeLessThanOrEqual(
    2,
  );
  await expect(row.locator("td")).toHaveCount(3);
  await expect(
    cell.locator(".products-name-cell > .products-recovery-row-state"),
  ).toHaveCount(0);
  await expect(
    row.locator(
      '[data-product-expand="product-1"] [data-product-status-marker]',
    ),
  ).toBeVisible();
});

test("row status tooltip supports hover and keyboard without replacing expansion", async ({
  page,
}) => {
  const copy = catalogueMessages.es;
  for (const scenario of [
    {
      story: "exhausted",
      state: "unconfirmed",
      description: copy.prUnconfirmed,
    },
    { story: "automatic", state: "checking", description: copy.prRecovering },
    {
      story: "active-editor",
      state: "locked",
      description: copy.prOwnerActive,
    },
  ]) {
    await ready(page, scenario.story);
    const row = page.locator('[data-product-id="product-1"]');
    const expand = row.locator('[data-product-expand="product-1"]');
    const neighborExpand = page.locator('[data-product-expand="product-2"]');
    await expect(row).toHaveAttribute("data-product-row-state", scenario.state);
    await expect(expand.locator("[data-product-status-marker]")).toBeVisible();
    const expandBox = await expand.boundingBox();
    const neighborBox = await neighborExpand.boundingBox();
    expect(expandBox).not.toBeNull();
    expect(neighborBox).not.toBeNull();
    expect(Math.abs(expandBox!.width - neighborBox!.width)).toBeLessThanOrEqual(
      2,
    );
    const tooltip = page.locator('[data-slot="tooltip-content"]');
    await expect(expand).toHaveAccessibleDescription(scenario.description);
    await expand.hover();
    await expect(page.getByRole("tooltip")).toContainText(scenario.description);
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(scenario.description);
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
    await expand.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(expand).toBeFocused();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(scenario.description);
    await expand.press("Enter");
    await expect(expand).toHaveAttribute("aria-expanded", "true");
    await expect(expand.locator(".products-expand-chevron")).toHaveCSS(
      "rotate",
      "90deg",
    );
    await expect(
      page.locator(
        '[data-product-summary="product-1"] [data-product-expanded-status="product-1"]',
      ),
    ).toContainText(scenario.description);
    await expand.press("Enter");
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator('[data-product-summary="product-1"]'),
    ).toHaveCount(0);
  }
});

test("row status touch expansion exposes full pending context without hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const expand = page.locator('[data-product-expand="product-1"]');
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expand.click();
  await expect(expand).toHaveAttribute("aria-expanded", "true");
  const description = page.locator(
    '[data-product-summary="product-1"] [data-product-expanded-status="product-1"]',
  );
  await expect(description).toBeVisible();
  await expect(description).toContainText(catalogueMessages.es.prUnconfirmed);
  await description.scrollIntoViewIfNeeded();
  await expect(description).toBeInViewport();
  await expand.click();
  await expect(expand).toHaveAttribute("aria-expanded", "false");
});
