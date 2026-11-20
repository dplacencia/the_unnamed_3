import { expect, test, type Page } from "@playwright/test";
import { stockCommitmentsMessages } from "../../apps/backoffice/.storybook/stories/stock-commitments-messages";

const copy = stockCommitmentsMessages("es");

async function panelFor(page: Page, fixture: string, locale = "es") {
  await page.goto(
    `/iframe.html?id=inventory-stock-commitments--${fixture}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  const panel = page.locator(`[data-stock-commitments-ready="${fixture}"]`);
  await expect(panel).toBeVisible();
  return panel;
}

test("scope selection cannot mix authorized products, locations and channels", async ({
  page,
}) => {
  const picker = await panelFor(page, "select-scope");
  const proceed = picker.getByRole("button", { name: "Continuar" });
  await expect(proceed).toBeDisabled();
  await picker
    .getByRole("combobox", { name: copy.product })
    .selectOption("bags");
  await picker
    .getByRole("combobox", { name: copy.location })
    .selectOption("sales-floor");
  await expect(picker.locator('option[value="counter"]')).toHaveCount(0);
  await picker
    .getByRole("combobox", { name: copy.channel })
    .selectOption("pickup");
  await proceed.click();
  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("Bolsa de papel");
  await expect(panel).toContainText("Recogida en tienda");
  await panel.getByRole("textbox", { name: copy.quantity }).fill("3");
  await panel.getByRole("button", { name: copy.reserve }).click();
  await expect(panel.getByRole("status")).toHaveText(copy.reserved);
  await expect(panel).toContainText("R-102");
});

test("hold settings require caps, time settings and an explicit extension choice", async ({
  page,
}) => {
  const form = await panelFor(page, "hold-settings");
  const save = form.getByRole("button", { name: "Guardar configuración" });
  await form
    .getByRole("combobox", { name: "Configuración de referencia" })
    .selectOption("location");
  await form.getByRole("textbox", { name: "Máximo por reserva" }).fill("3");
  await form
    .getByRole("checkbox", { name: "Sin límite de cantidad" })
    .nth(1)
    .check();
  await form
    .getByRole("textbox", { name: "Duración máxima inicial en minutos" })
    .fill("60");
  await form
    .getByRole("textbox", { name: "Vigencia total máxima en minutos" })
    .fill("180");
  await expect(save).toBeDisabled();
  await form
    .getByRole("combobox", { name: "Prórrogas", exact: true })
    .selectOption("enabled");
  await expect(save).toBeDisabled();
  await form
    .getByRole("textbox", { name: "Duración máxima por prórroga en minutos" })
    .fill("30");
  await form
    .getByRole("textbox", { name: "Número máximo de prórrogas por reserva" })
    .fill("2");
  await save.click();
  await expect(form.getByRole("status")).toContainText("Almacén");
});

test("reserve requires an explicit choice to accept less and shows both returned quantities", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const panel = await panelFor(page, "reserve");
  const choice = panel.getByRole("checkbox", { name: copy.allowPartial });
  const submit = panel.getByRole("button", { name: copy.reserve });
  await expect(choice).not.toBeChecked();
  await panel.getByRole("textbox", { name: copy.quantity }).fill("4");
  await submit.click();
  await expect(panel).toHaveAttribute(
    "data-stock-commitments-outcome",
    "declined",
  );
  await expect(panel.getByRole("alert")).toHaveText(copy.declined);
  await choice.check();
  await submit.click();
  await expect(panel).toHaveAttribute(
    "data-stock-commitments-outcome",
    "confirmed",
  );
  await expect(panel.getByRole("status")).toHaveText(copy.reserved);
  await expect(panel.getByText(copy.unaccepted, { exact: true })).toBeVisible();
  await expect(
    panel.getByText(`1 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`10 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`7 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
});

test("partial fulfillment preserves the selected remainder and releases it separately", async ({
  page,
}) => {
  const panel = await panelFor(page, "partial-fulfillment");
  await expect(
    panel.getByRole("radio", { name: copy.keepRemainder }),
  ).not.toBeChecked();
  await expect(
    panel.getByRole("radio", { name: copy.releaseRemainder }),
  ).not.toBeChecked();
  await panel.getByRole("button", { name: copy.fulfill }).click();
  await expect(panel.getByText(copy.chooseRemainder)).toBeVisible();
  await panel.getByRole("radio", { name: copy.keepRemainder }).check();
  await panel.getByRole("button", { name: copy.fulfill }).click();
  await expect(panel.getByRole("status")).toHaveText(copy.delivery);
  await expect(
    panel.getByText(`-1 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`2 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(panel.getByText(copy.expiry, { exact: true })).toBeVisible();
  await panel.getByRole("button", { name: copy.release }).click();
  await expect(panel.getByText(copy.releaseQuestion)).toBeVisible();
  await panel.getByRole("button", { name: copy.release }).click();
  await expect(panel.getByRole("status")).toHaveText(copy.released);
  await expect(
    panel.getByText(copy.releasedQuantity, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`2 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`9 ${copy.unitSymbol}`, { exact: true }).first(),
  ).toBeVisible();
  await expect(panel.getByText(copy.effect, { exact: true })).toHaveCount(0);
});

test("full fulfillment shows the one signed stock effect and no remaining action", async ({
  page,
}) => {
  const panel = await panelFor(page, "fulfill");
  await panel
    .getByRole("textbox", { name: copy.fulfillmentQuantity })
    .fill("3");
  await panel.getByRole("button", { name: copy.fulfill }).click();
  await expect(panel.getByRole("status")).toHaveText(copy.delivery);
  await expect(
    panel.getByText(`-3 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText(`0 ${copy.unitSymbol}`, { exact: true }),
  ).toBeVisible();
  await expect(panel.getByRole("button", { name: copy.release })).toHaveCount(
    0,
  );
});

test("a technical exact read error can recover while an unknown mutation offers no replay", async ({
  page,
}) => {
  const read = await panelFor(page, "read-error");
  await expect(read.getByRole("alert")).toContainText(copy.readError);
  await expect(read.getByText(copy.onHand)).toHaveCount(0);
  await read.getByRole("button", { name: copy.retryRead }).click();
  await expect(read.getByRole("status")).toHaveText(copy.active);
  const pending = await panelFor(page, "unconfirmed");
  await expect(pending.getByRole("alert")).toContainText(copy.unconfirmed);
  await expect(pending.getByRole("button")).toHaveCount(1);
  await pending.getByRole("button", { name: copy.close }).click();
  await expect(pending).toBeHidden();
  await page.getByRole("button", { name: copy.viewAttempt }).click();
  await expect(pending.getByRole("alert")).toContainText(copy.unconfirmed);
});

test("all five languages keep the reservation panel within a narrow phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const panel = await panelFor(page, "partial-fulfillment", locale);
    await expect(
      panel.getByRole("heading", {
        name: stockCommitmentsMessages(locale).fulfill,
      }),
    ).toBeVisible();
    await expect(
      panel.getByRole("group", {
        name: stockCommitmentsMessages(locale).remainder,
      }),
    ).toBeVisible();
    const width = await panel.evaluate((element) => ({
      scroll: element.scrollWidth,
      layout: element.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.layout);
  }
});
