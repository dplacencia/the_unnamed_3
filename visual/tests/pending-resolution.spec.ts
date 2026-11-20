import { expect, test, type Page } from "@playwright/test";

async function openResolution(page: Page, preset: string, args = "") {
  await page.goto(
    `/iframe.html?id=backoffice-pending-resolution--${preset}&viewMode=story&globals=locale:es;theme:light${args}`,
  );
  const panel = page.getByRole("dialog");
  await expect(panel).toBeVisible();
  return panel;
}

test("reviews an exact departure and applies the returned signed effect", async ({
  page,
}) => {
  const panel = await openResolution(page, "review-release");
  await expect(panel).toContainText("Manzana reineta");
  await expect(panel).toContainText("2,5 kg");
  const confirm = panel.getByRole("button", { name: "Confirmar acción" });
  await expect(confirm).toBeDisabled();
  await panel
    .getByRole("combobox", { name: "Canal real" })
    .selectOption("channel-counter");
  await expect(confirm).toBeDisabled();
  await panel.getByRole("checkbox").check();
  await confirm.click();
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveText(
    "-2,5 kg",
  );
  await panel.getByRole("button", { name: "Volver a Pendientes" }).click();
  await expect(panel).toBeHidden();
  await expect(
    page.locator('[data-pending-browsing-inspect="resolution-release-1"]'),
  ).toHaveCount(0);
});

test("rejects only the eligible receipt after an explicit reason and affirmation", async ({
  page,
}) => {
  const panel = await openResolution(page, "review-rejection");
  const confirm = panel.getByRole("button", { name: "Confirmar acción" });
  await panel.getByRole("checkbox").check();
  await expect(confirm).toBeDisabled();
  await panel
    .getByRole("textbox", { name: "Motivo" })
    .fill("No llegó el pedido.");
  await confirm.click();
  await expect(panel).toContainText("Entrada original rechazada");
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveCount(
    0,
  );
  await panel.getByRole("button", { name: "Volver a Pendientes" }).click();
  await expect(
    page.locator('[data-pending-browsing-inspect="resolution-receipt-1"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-pending-browsing-inspect="resolution-duplicate-1"]'),
  ).toBeVisible();
});

test("reviews both duplicate batch identities and removes the whole target", async ({
  page,
}) => {
  const panel = await openResolution(page, "review-duplicate");
  await expect(panel).toContainText("receipt-204");
  await expect(panel).toContainText("receipt-198");
  await expect(panel).toContainText("Harina de trigo");
  await panel
    .getByRole("textbox", { name: "Motivo" })
    .fill("El mismo albarán.");
  await panel.getByRole("checkbox").check();
  await panel.getByRole("button", { name: "Confirmar acción" }).click();
  await expect(panel).toContainText("Lote duplicado cancelado");
  await panel.getByRole("button", { name: "Volver a Pendientes" }).click();
  await expect(
    page.locator('[data-pending-browsing-inspect^="resolution-duplicate-"]'),
  ).toHaveCount(0);
});

test("keeps counterpart information private when unavailable", async ({
  page,
}) => {
  const panel = await openResolution(page, "counterpart-unavailable");
  await expect(panel.getByRole("status")).toHaveText(
    "El lote indicado no puede usarse para esta cancelación.",
  );
  await expect(
    panel.getByRole("button", { name: "Confirmar acción" }),
  ).toHaveCount(0);
  await expect(panel).not.toContainText("receipt-198");
});

test("reviews the actual receipt quantity and applies its exact positive effect", async ({
  page,
}) => {
  const panel = await openResolution(page, "review-receipt-release");
  await expect(panel).toContainText("8 ud.");
  const confirm = panel.getByRole("button", { name: "Confirmar acción" });
  const quantity = panel.getByRole("textbox", { name: "Cantidad que llegó" });
  await quantity.fill("5");
  await panel.getByRole("checkbox").check();
  await expect(confirm).toBeDisabled();
  await quantity.fill("3");
  await expect(confirm).toBeDisabled();
  await panel.getByRole("checkbox").check();
  await confirm.click();
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveText(
    "3 ud.",
  );
});

test("asks which authorized counterpart to retain before cancelling its duplicate", async ({
  page,
}) => {
  const panel = await openResolution(page, "select-counterpart");
  const confirm = panel.getByRole("button", { name: "Confirmar acción" });
  await panel.getByRole("textbox", { name: "Motivo" }).fill("Mismo albarán.");
  await panel.getByRole("checkbox").check();
  await expect(confirm).toBeDisabled();
  const select = panel.getByRole("combobox", {
    name: "Lote que se conservará",
  });
  await select.selectOption("receipt-197");
  await expect(confirm).toBeDisabled();
  await panel.getByRole("checkbox").check();
  await confirm.click();
  await expect(panel).toContainText("Lote duplicado cancelado");
  await panel.getByRole("button", { name: "Volver a Pendientes" }).click();
  await expect(
    page.locator('[data-pending-browsing-inspect^="resolution-duplicate-"]'),
  ).toHaveCount(0);
});

test("resumes the same uncertain operation after returning to the list", async ({
  page,
}) => {
  const panel = await openResolution(page, "unconfirmed");
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveCount(
    0,
  );
  await panel.getByRole("button", { name: "Volver a Pendientes" }).click();
  await page
    .getByRole("button", { name: "Volver a la operación sin confirmar" })
    .click();
  await panel
    .getByRole("button", { name: "Reintentar la misma operación" })
    .click();
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveText(
    "-2,5 kg",
  );
});

test("leaves uncertainty visible when a retained retry is denied", async ({
  page,
}) => {
  const panel = await openResolution(
    page,
    "unconfirmed",
    "&args=denyRetry:true",
  );
  await panel
    .getByRole("button", { name: "Reintentar la misma operación" })
    .click();
  await expect(panel).toContainText("El resultado sigue sin confirmar.");
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveCount(
    0,
  );
  await expect(
    panel.getByRole("button", { name: "Reintentar la misma operación" }),
  ).toBeVisible();
});
