import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, state: string) {
  await page.goto(
    `/iframe.html?id=inventory-product-lifecycle--${state}&viewMode=story&globals=locale:es;theme:light`,
  );
  const sheet = page.getByRole("dialog");
  await expect(sheet.locator("[data-product-lifecycle-ready]")).toBeVisible();
  return sheet;
}

test("archive waits for confirmation and retains the product detail", async ({
  page,
}) => {
  const sheet = await open(page, "review");
  const archive = sheet.getByRole("button", { name: "Archivar producto" });
  await archive.click();
  await expect(
    sheet.getByText("¿Quieres archivar este producto?"),
  ).toBeVisible();
  await sheet.getByRole("button", { name: "Cancelar" }).click();
  await expect(sheet.getByText("Activo", { exact: true })).toBeVisible();
  await archive.click();
  await archive.click();
  await expect(sheet.getByRole("status")).toHaveText("Producto archivado.");
  await expect(sheet.getByText("Archivado", { exact: true })).toBeVisible();
  await expect(sheet.getByText("000001", { exact: true })).toBeHidden();
  await expect(page.locator('tr[data-product-id="product-1"]')).toHaveCount(0);
});

test("an unconfirmed archive labels the last read and withholds a fresh archive", async ({
  page,
}) => {
  const sheet = await open(page, "unconfirmed");
  await expect(sheet.getByRole("alert")).toContainText(
    "No hemos podido confirmar",
  );
  await expect(sheet.getByText("Activo", { exact: true })).toBeVisible();
  await expect(
    sheet.getByRole("button", { name: "Archivar producto" }),
  ).toHaveCount(0);
});
