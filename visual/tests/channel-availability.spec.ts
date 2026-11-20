import { expect, test, type Page } from "@playwright/test";

async function openLookup(page: Page, preset: string) {
  await page.goto(
    `/iframe.html?id=backoffice-channel-availability--${preset}&viewMode=story&globals=locale:es;theme:light`,
  );
  const workspace = page.locator(
    `[data-channel-availability-ready="${preset}"]`,
  );
  await expect(workspace).toBeVisible();
  return workspace;
}

test("keeps exact positive, zero and unknown quantities separate for a selected channel", async ({
  page,
}) => {
  const workspace = await openLookup(page, "available");
  const amount = workspace.locator("[data-channel-availability-amount]");
  const consult = workspace.getByRole("button", {
    name: "Consultar disponibilidad",
  });
  await expect(amount).toHaveText("5,125 kg");
  await workspace.getByRole("combobox", { name: "Canal" }).selectOption("web");
  await expect(amount).toHaveCount(0);
  await consult.click();
  await expect(amount).toHaveText("0 kg");
  await workspace
    .getByRole("combobox", { name: "Producto" })
    .selectOption("tomato-bulk");
  await consult.click();
  await expect(workspace.getByRole("status")).toContainText(
    "No se puede mostrar la disponibilidad",
  );
  await expect(amount).toHaveCount(0);
});

test("retries a failed check with the same product and channel", async ({
  page,
}) => {
  const workspace = await openLookup(page, "read-failure");
  await expect(workspace.getByRole("status")).toContainText(
    "No se ha podido comprobar",
  );
  await workspace.getByRole("button", { name: "Reintentar" }).click();
  await expect(workspace.getByRole("status")).toContainText("Consultando");
  await expect(workspace.getByRole("status")).toContainText("5,125 kg");
  await expect(
    workspace.getByRole("combobox", { name: "Producto" }),
  ).toHaveValue("tomato");
  await expect(workspace.getByRole("combobox", { name: "Canal" })).toHaveValue(
    "counter",
  );
});
