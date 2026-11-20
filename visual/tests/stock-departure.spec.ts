import { expect, test, type Page } from "@playwright/test";
import { stockDepartureMessages } from "../../apps/backoffice/.storybook/stories/stock-departure-messages";
import { chooseReceiptProduct, receiptForm } from "../stock-receipt-actions";

const messages = stockDepartureMessages("es");

async function ready(page: Page, fixture = "movements") {
  await page.goto(
    `/iframe.html?id=inventory-first-stock-departure--${fixture}&viewMode=story&globals=locale:es;theme:light`,
  );
  const panel = page.locator("[data-stock-departure-panel]");
  await expect(panel).toHaveAttribute("data-stock-departure-ready", fixture);
  return {
    panel,
    form: receiptForm(page),
    channel: page.locator("[data-stock-departure-channel]"),
    workspace: page.locator("[data-stock-departure-workspace]"),
  };
}

test("departure clears the channel when the origin changes and keeps the exact entered unit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { panel, form, channel, workspace } = await ready(page);
  await expect(form.location).toHaveValue("");
  await expect(channel).toBeDisabled();
  await form.product.fill("Tomate pera");
  await page.locator('[data-receipt-product-option="tomato-second"]').click();
  await expect(form.form).toHaveAttribute(
    "data-receipt-selected-product",
    "tomato-second",
  );
  await expect(form.unit).toHaveValue("kg");
  await form.location.selectOption("sales-floor");
  await channel.selectOption("delivery");
  await form.location.selectOption("stockroom");
  await expect(channel).toHaveValue("");
  await expect(channel.locator('option[value="counter"]')).toHaveCount(0);
  await expect(channel.locator('option[value="delivery"]')).toHaveCount(1);
  await form.unit.selectOption("g");
  await form.quantity.fill("2250");
  await form.submit.click();
  await expect(channel).toBeFocused();
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "0");
  await channel.selectOption("delivery");
  await form.submit.click();
  await expect(panel).toHaveAttribute("data-stock-departure-panel", "applied");
  await expect(panel).toContainText("2250 g");
  await expect(panel.locator("[data-stock-departure-effect]")).toHaveText(
    "-2,25 kg",
  );
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "1");
});

test("departure explains a location with no eligible channels and waits for an explicit choice", async ({
  page,
}) => {
  const { panel, form, channel, workspace } = await ready(
    page,
    "origin-without-channels",
  );
  await expect(form.location).toHaveValue("stockroom");
  await expect(channel).toBeDisabled();
  await expect(panel.getByText(messages.noChannels)).toBeVisible();
  await chooseReceiptProduct(page, "boxes");
  await form.quantity.fill("1");
  await form.submit.click();
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "0");
  await form.location.selectOption("sales-floor");
  await expect(channel).toBeEnabled();
  await expect(channel).toHaveValue("");
});

test("departure keeps an edited draft until the merchant confirms discard", async ({
  page,
}) => {
  const { panel, form, channel } = await ready(page);
  await form.location.selectOption("sales-floor");
  await channel.selectOption("counter");
  await form.cancel.click();
  const confirmation = page.getByRole("dialog", {
    name: messages.discardTitle,
  });
  await expect(confirmation).toBeVisible();
  await confirmation
    .getByRole("button", { name: messages.keepEditing })
    .click();
  await expect(channel).toHaveValue("counter");
  await form.cancel.click();
  await confirmation.getByRole("button", { name: messages.discard }).click();
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: messages.open }).click();
  await expect(form.location).toHaveValue("");
  await expect(channel).toBeDisabled();
});

test("departure recovers an unconfirmed command explicitly after the bounded run", async ({
  page,
}) => {
  const { panel, workspace } = await ready(page, "unconfirmed");
  await expect(panel).toContainText(messages.unconfirmed);
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "3");
  await panel.locator("[data-stock-departure-retry]").click();
  await expect(panel).toHaveAttribute("data-stock-departure-panel", "applied");
  await expect(panel).toContainText("2250 g");
  await expect(panel.locator("[data-stock-departure-effect]")).toHaveText(
    "-2,25 kg",
  );
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "4");
});
