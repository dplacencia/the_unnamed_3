import { expect, test, type Page } from "@playwright/test";

async function openSetup(page: Page, preset: string) {
  await page.goto(
    `/iframe.html?id=backoffice-inventory-setup--${preset}&viewMode=story&globals=locale:es;theme:light`,
  );
  await expect(
    page.locator(`[data-inventory-setup-ready="${preset}"]`),
  ).toBeVisible();
  return page.getByRole("dialog");
}

test("keeps stock setup unavailable until the authoritative read confirms absence", async ({
  page,
}) => {
  await openSetup(page, "unavailable");
  await expect(
    page.getByText("No se ha podido comprobar la vinculación"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Configurar ubicación de stock" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Volver a consultar" }).click();
  await expect(page.getByText("Sin ubicación de stock")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Configurar ubicación de stock" }),
  ).toBeVisible();
});

test("requires a calendar and exact explicit boundary and displays the separate stock identity", async ({
  page,
}) => {
  const panel = await openSetup(page, "stock-location");
  await expect(panel).toContainText("site-centro");
  await expect(panel).toContainText("area-almacen");
  const confirm = panel.getByRole("button", { name: "Confirmar" });
  await expect(confirm).toBeDisabled();
  await panel
    .getByRole("combobox", { name: "Calendario" })
    .selectOption("continuous");
  const boundary = panel.getByRole("textbox", {
    name: /Hora de inicio del día operativo/,
  });
  await boundary.fill("24:00");
  await expect(confirm).toBeDisabled();
  await boundary.fill("00:00");
  await confirm.click();
  await expect(panel.getByRole("status")).toHaveText(
    "Ubicación de stock configurada",
  );
  await expect(panel.getByText(/^stock-/)).toBeVisible();
});

test("requires deliberate weekly closures, overnight windows and dated exceptions", async ({
  page,
}) => {
  const panel = await openSetup(page, "scheduled-calendar");
  const confirm = panel.getByRole("button", { name: "Confirmar" });
  await expect(confirm).toBeDisabled();
  for (const weekday of [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "sábado",
    "domingo",
  ]) {
    await panel
      .getByRole("combobox", { name: weekday, exact: true })
      .selectOption("closed");
  }
  await panel
    .getByRole("combobox", { name: "viernes", exact: true })
    .selectOption("open");
  await panel.getByRole("textbox", { name: "Apertura" }).fill("20:00");
  await panel
    .getByRole("textbox", { name: "Cierre", exact: true })
    .fill("02:00");
  const closeDay = panel.getByRole("combobox", { name: "Día del cierre" });
  await closeDay.selectOption("false");
  await expect(confirm).toBeDisabled();
  await closeDay.selectOption("true");
  await panel.getByRole("button", { name: "Añadir excepción" }).click();
  const exception = panel.locator("[data-calendar-exception]");
  await exception.getByLabel("Fecha", { exact: true }).fill("2026-11-21");
  await expect(confirm).toBeDisabled();
  await exception
    .getByRole("combobox", { name: "Horario semanal" })
    .selectOption("closed");
  await confirm.click();
  await expect(panel.getByRole("status")).toHaveText(
    "Ubicación de stock configurada",
  );
});

test("creates a channel without enabling it in any location", async ({
  page,
}) => {
  const panel = await openSetup(page, "create-channel");
  const name = panel.getByRole("textbox", { name: /Nombre del canal/ });
  await name.fill("   ");
  const confirm = panel.getByRole("button", { name: "Confirmar" });
  await expect(confirm).toBeDisabled();
  await name.fill("Venta directa");
  await confirm.click();
  await expect(panel.getByRole("status")).toHaveText("Canal creado");
  await panel
    .getByRole("button", { name: "Cerrar", exact: true })
    .first()
    .click();
  await expect(
    page.locator("[data-inventory-setup-channels]").getByText("Venta directa"),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Orden de los canales habilitados" }),
  ).not.toContainText("Venta directa");
});

test("requires the real stock location and an explicit placement", async ({
  page,
}) => {
  const panel = await openSetup(page, "overview");
  await page.getByRole("button", { name: "Habilitar canal" }).click();
  const location = panel.getByRole("combobox", { name: "Ubicación de stock" });
  await expect(location).toHaveValue("");
  await location.selectOption("stock-341");
  await panel.getByRole("combobox", { name: "Canal" }).selectOption("delivery");
  const confirm = panel.getByRole("button", { name: "Confirmar" });
  await expect(confirm).toBeDisabled();
  await panel
    .getByRole("combobox", { name: "Posición en la lista" })
    .selectOption("before:web");
  await confirm.click();
  await expect(panel.getByRole("status")).toHaveText(
    "Canal habilitado en esta ubicación",
  );
  await expect(panel.getByRole("listitem")).toHaveText([
    "Mostrador",
    "Reparto",
    "Tienda en línea",
  ]);
});

test("keeps a channel unlisted until the explicit retry confirms the original operation", async ({
  page,
}) => {
  const panel = await openSetup(page, "unconfirmed");
  await expect(panel.getByRole("status")).toContainText(
    "No hemos podido confirmar el resultado.",
  );
  await panel.getByRole("button", { name: "Cerrar" }).click();
  await expect(
    page.locator("[data-inventory-setup-channels]"),
  ).not.toContainText("Venta mayorista");
  await page
    .getByRole("button", { name: "Ver la operación sin confirmar" })
    .click();
  await panel
    .getByRole("button", { name: "Reintentar la misma operación" })
    .click();
  await expect(panel.getByRole("status")).toHaveText("Canal creado");
  await expect(panel.getByText("channel-setup-preview-1")).toBeVisible();
});
