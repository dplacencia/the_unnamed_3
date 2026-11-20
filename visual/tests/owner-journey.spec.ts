import { expect, test, type Page } from "@playwright/test";
import { coreMerchantMessages } from "../../apps/backoffice/.storybook/stories/core-merchant-workspace-messages";
import { ownerJourneyMessages } from "../../apps/backoffice/.storybook/stories/owner-journey-messages";

const entry = coreMerchantMessages.es;
const journey = ownerJourneyMessages.es;

async function open(page: Page, story: string, locale = "es") {
  await page.goto(
    `/iframe.html?id=core-owner-journey--${story}&viewMode=story&globals=locale:${locale};theme:light`,
  );
}

async function addSite(page: Page, name: string) {
  await page.locator("[data-owner-journey-start]").click();
  const editor = page.locator("[data-core-hierarchy-editor]");
  await editor.getByLabel("Nombre del centro").fill(name);
  await editor.getByLabel("Nombre de la primera área").fill("Sala inicial");
  await editor.getByLabel("Zona horaria del centro").fill("Europe/Madrid");
  await editor.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.locator("[data-owner-journey-sites]")).toContainText(name);
}

async function move(page: Page, quantity: string, departure = false) {
  const panel = page.locator(
    `[data-owner-journey-panel="${departure ? "departure" : "receipt"}"]`,
  );
  await panel.locator("[data-receipt-product]").fill("Manzana de prueba");
  await page.locator("[data-receipt-product-option]").click();
  const location = panel.locator("[data-receipt-location]");
  await expect(location).toHaveValue("");
  await location.selectOption({ label: "Sala inicial · Centro de prueba" });
  if (departure) {
    const channel = panel.getByLabel("Canal", { exact: true });
    await expect(channel).toHaveValue("");
    await channel.selectOption({ label: "Mostrador de prueba" });
  }
  await panel.locator("[data-receipt-quantity]").fill(quantity);
  await panel.locator("[data-receipt-submit]").click();
  await expect(panel).toHaveCount(0);
}

test("the same Owner journey supplies exact first receipts and departure to the stock lookup", async ({
  page,
}) => {
  await open(page, "new-business");
  await page.getByLabel(entry.name, { exact: true }).fill("Comercio Taller");
  await page
    .getByRole("button", { name: entry.createBusiness, exact: true })
    .click();
  await page.getByRole("button", { name: entry.checkReadiness }).click();
  await page.getByRole("button", { name: entry.enter }).click();
  await expect(page.locator("[data-owner-journey-merchant]")).toHaveText(
    "Comercio Taller",
  );

  await addSite(page, "Centro de prueba");
  const next = page.locator("[data-owner-journey-continue]");
  await next.click();
  const setup = page.locator('[data-owner-journey-panel="stock"]');
  await expect(setup).toContainText("Centro de prueba");
  await expect(setup).toContainText("Sala inicial");
  await setup.getByLabel("Calendario").selectOption("continuous");
  await setup.getByLabel("Hora de inicio del día operativo").fill("00:00");
  await setup.getByRole("button", { name: "Confirmar", exact: true }).click();

  await next.click();
  await page.locator("[data-creation-name]").fill("Manzana de prueba");
  await page.locator("[data-creation-unit]").selectOption("kg");
  await page.locator("[data-creation-submit]").click();
  await expect(page.locator("[data-owner-journey-products]")).toContainText(
    "Manzana de prueba",
  );

  await next.click();
  await move(page, "10");
  const operations = page.locator("[data-owner-journey-movements]");
  await operations.getByRole("button", { name: journey.receipt }).click();
  await move(page, "5");

  await next.click();
  const addChannel = page.locator('[data-owner-journey-panel="channel"]');
  await addChannel.getByLabel("Nombre del canal").fill("Mostrador de prueba");
  await addChannel
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await next.click();
  const enable = page.locator('[data-owner-journey-panel="enable"]');
  await enable
    .getByLabel("Ubicación de stock")
    .selectOption({ label: "Sala inicial · Centro de prueba" });
  await enable
    .getByRole("combobox", { name: "Canal", exact: true })
    .selectOption({ index: 1 });
  await enable.getByLabel("Posición en la lista").selectOption("end");
  await enable.getByRole("button", { name: "Confirmar", exact: true }).click();

  await next.click();
  await move(page, "3", true);
  const movements = page.locator("[data-owner-journey-movement]");
  await expect(movements).toHaveCount(3);
  await expect(movements.last()).toContainText("-3 kg");
  await movements
    .last()
    .getByRole("button", { name: journey.stockLink })
    .click();
  await expect(page.locator("[data-stock-lookup-amount]")).toHaveText("12 kg");
});

test("switching businesses keeps their confirmed configuration separate", async ({
  page,
}) => {
  await open(page, "business-selection");
  await page.getByRole("button", { name: /Frutería La Huerta/ }).click();
  await addSite(page, "Centro de La Huerta");
  await page.getByRole("button", { name: journey.switchStore }).click();
  await page.getByRole("button", { name: /Alimentación Plaza/ }).click();
  await expect(page.locator("[data-owner-journey-merchant]")).toHaveText(
    "Alimentación Plaza",
  );
  await expect(page.getByText("Centro de La Huerta")).toHaveCount(0);
  await page.getByRole("button", { name: journey.switchStore }).click();
  await page.getByRole("button", { name: /Frutería La Huerta/ }).click();
  await page.getByRole("button", { name: "Configuración del negocio" }).click();
  await expect(page.locator("[data-owner-journey-sites]")).toContainText(
    "Centro de La Huerta",
  );
});

for (const [story, access] of [
  ["trial-paused", "Acceso a Inventario pausado"],
  ["access-unavailable", "No se ha podido consultar el acceso a Inventario"],
] as const) {
  test(`${story} keeps authorized Core settings reachable`, async ({
    page,
  }) => {
    await open(page, story);
    await expect(
      page.locator("[data-merchant-inventory-access]"),
    ).toContainText(access);
    await expect(
      page.getByRole("button", { name: "Inventario", exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: "Configuración del negocio" })
      .click();
    await expect(page.locator("[data-owner-journey-sites]")).toContainText(
      "Tienda Centro",
    );
  });
}

test("recorded stock and first-use home fit a narrow phone in all supported locales", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  for (const locale of ["es", "en", "ca", "gl", "eu"]) {
    await open(page, "first-visit", locale);
    await expect(page.locator("[data-owner-journey-start]")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  }
  await open(page, "recorded-stock");
  await expect(page.locator("[data-stock-lookup-amount]")).toHaveText("12 kg");
});
