import { expect, test, type Page } from "@playwright/test";
import { coreHierarchyMessages } from "../../apps/backoffice/.storybook/stories/core-hierarchy-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

async function open(page: Page, fixture = "overview", locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=core-sites-and-areas--${fixture}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  const view = page.locator(`[data-core-hierarchy-ready="${fixture}"]`);
  await expect(view).toBeVisible();
  return view;
}

test("a Site needs a valid zone and appears with its first Area only after save", async ({
  page,
}) => {
  const view = await open(page, "new-site");
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre del centro").fill("  Taller  ");
  await dialog
    .getByLabel("Nombre de la primera área")
    .fill("Atención al público");
  await dialog.getByLabel("Zona horaria del centro").fill("Europa/MyTown");
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("zona horaria IANA");
  await expect(view.locator("[data-core-site]")).toHaveCount(2);
  await dialog.getByLabel("Zona horaria del centro").fill("+01:00");
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("zona horaria IANA");
  await dialog.getByLabel("Zona horaria del centro").fill("US/Eastern");
  await dialog.getByLabel("Nombre del centro").fill("x".repeat(256));
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("255 caracteres");
  await dialog.getByLabel("Nombre del centro").fill("  Taller  ");
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(view.locator('[data-core-site="site-preview-1"]')).toContainText(
    "Taller",
  );
  await expect(view.getByText("Activo · US/Eastern")).toBeVisible();
  await expect(view.locator('[data-core-area="area-preview-1"]')).toContainText(
    "Atención al público",
  );
  await expect(view.getByRole("status")).toHaveText("Cambios guardados.");
});

test("archiving a Site waits for every Area check", async ({ page }) => {
  const view = await open(page, "archive-unavailable");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("No se ha podido comprobar la ubicación"),
  ).toBeVisible();
  const archive = dialog.getByRole("button", { name: "Archivar", exact: true });
  await expect(archive).toBeDisabled();
  await expect(dialog.locator("dl dt")).toHaveCount(3);
  await dialog.getByRole("button", { name: "Volver a comprobar" }).click();
  await expect(archive).toBeEnabled();
  await archive.click();
  await expect(view.locator('[data-core-site="site-centro"]')).toContainText(
    "Archivado",
  );
  await expect(view.locator('[data-core-area="area-floor"]')).toContainText(
    "Archivada",
  );
});

test("an open Inventory location prevents Area archive", async ({ page }) => {
  await open(page, "archive-in-use");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Tiene una ubicación de inventario abierta"),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Archivar", exact: true }),
  ).toBeDisabled();
});

test("restoring a Site asks for one of its Areas and preserves both IDs", async ({
  page,
}) => {
  const view = await open(page, "restore-site");
  const dialog = page.getByRole("dialog");
  const restore = dialog.getByRole("button", {
    name: "Restaurar",
    exact: true,
  });
  await expect(restore).toBeDisabled();
  await dialog
    .getByLabel("Área que se restaurará con el centro")
    .selectOption("area-storage");
  await restore.click();
  await expect(view.locator('[data-core-site="site-market"]')).toContainText(
    "Activo",
  );
  await expect(view.locator('[data-core-area="area-storage"]')).toContainText(
    "Activa",
  );
  await expect(view.locator('[data-core-area="area-stand"]')).toContainText(
    "Archivada",
  );
});

test("Area-only access exposes the permitted Area and scoped parent facts", async ({
  page,
}) => {
  const view = await open(page, "scoped-areas");
  await expect(view.getByText("Almacén", { exact: true })).toBeVisible();
  await expect(view.getByText("Centro · Activa")).toBeVisible();
  await expect(view.getByRole("button", { name: "Nuevo centro" })).toHaveCount(
    0,
  );
  await expect(
    view.getByText("Zona horaria del centro · Europe/Madrid"),
  ).toBeVisible();
  await expect(view.getByText("Sala de ventas", { exact: true })).toHaveCount(
    0,
  );
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`Centro review fits a phone in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const view = await open(page, "overview", locale);
    await expect(
      view.getByRole("heading", { name: coreHierarchyMessages[locale].title }),
    ).toBeVisible();
    await expect(
      view.getByRole("button", { name: coreHierarchyMessages[locale].newSite }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  });
}

test("the ordinary hierarchy hides archived rows and Site and Area filters work independently", async ({
  page,
}) => {
  const view = await open(page, "archive-filter");
  await expect(view.locator('[data-core-site="site-market"]')).toHaveCount(0);
  await expect(view.locator('[data-core-area="area-mezzanine"]')).toHaveCount(
    0,
  );
  await view
    .getByRole("button", { name: "Siguiente", exact: true })
    .first()
    .click();
  await expect(view.locator('[data-core-site="site-south"]')).toBeVisible();
  await view
    .getByRole("button", { name: "Anterior", exact: true })
    .first()
    .click();
  await view.getByLabel("Estado de las áreas").selectOption("archived");
  await expect(view.locator('[data-core-area="area-mezzanine"]')).toBeVisible();
  await expect(view.locator('[data-core-area="area-floor"]')).toHaveCount(0);
  await view.getByLabel("Estado de los centros").selectOption("archived");
  await expect(view.locator('[data-core-site="site-market"]')).toBeVisible();
  await expect(view.locator('[data-core-area="area-storage"]')).toBeVisible();
});

test("a Core reference stops archive even when the owning-module check is clear", async ({
  page,
}) => {
  const view = await open(page, "reference-blocked");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Sin ubicación de inventario abierta"),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Archivar", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("impide archivar");
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(view.locator('[data-core-area="area-stockroom"]')).toContainText(
    "Activa",
  );
});

test("an unconfirmed Site or Area creation keeps the original request for an explicit retry", async ({
  page,
}) => {
  const view = await open(page, "unconfirmed-create");
  const retained = view.locator("[data-core-pending-create]");
  await expect(retained).toHaveAttribute(
    "data-core-pending-create",
    "hierarchy-creation-review-1",
  );
  await expect(retained).toContainText("Taller");
  await expect(retained).toContainText("Europe/Madrid");
  await expect(retained).toContainText("Atención al público");
  await expect(view.locator('[data-core-site="site-preview-1"]')).toHaveCount(
    0,
  );
  await expect(
    view.getByRole("button", { name: "Nuevo centro" }),
  ).toBeDisabled();
  await retained
    .getByRole("button", { name: "Reintentar la creación" })
    .click();
  await expect(view.locator('[data-core-site="site-preview-1"]')).toContainText(
    "Taller",
  );
  await expect(view.locator('[data-core-area="area-preview-1"]')).toContainText(
    "Atención al público",
  );
  await expect(retained).toHaveCount(0);
  await view.getByRole("button", { name: "Nueva área" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre del área").fill("Recogidas");
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(retained).toHaveAttribute(
    "data-core-pending-create",
    "hierarchy-creation-review-2",
  );
  await expect(retained).toContainText("Taller");
  await expect(retained).toContainText("Recogidas");
  await expect(view.locator('[data-core-area="area-preview-2"]')).toHaveCount(
    0,
  );
  await retained
    .getByRole("button", { name: "Reintentar la creación" })
    .click();
  await expect(view.locator('[data-core-area="area-preview-2"]')).toContainText(
    "Recogidas",
  );
  await expect(retained).toHaveCount(0);
});
