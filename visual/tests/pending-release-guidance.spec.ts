import { expect, test, type Page } from "@playwright/test";
import { pendingBrowsingMessages } from "../../apps/backoffice/.storybook/stories/pending-movements-browsing-messages";

const copy = pendingBrowsingMessages("es");
const lineReference = "resolution-release-1";
const returnToList = "Volver a Pendientes";
const releaseEffect = "[data-pending-resolution-effect]";

test.use({ viewport: { width: 320, height: 760 } });

async function open(page: Page, story: "flow" | "unconfirmed") {
  await page.goto(
    `/iframe.html?id=backoffice-pending-release-guidance--${story}&viewMode=story&globals=locale:es;theme:light`,
  );
  await expect(page.locator("[data-pending-release-guidance]")).toBeAttached();
}

test("an exact pending release at 320px requires a fresh confirmation when the channel changes", async ({
  page,
}) => {
  await open(page, "flow");
  const size = page.getByRole("combobox", { name: copy.perPage, exact: true });
  const scope = page.locator("[data-navigation-location]");
  const rows = page.locator("[data-pending-browsing-inspect]");
  const releaseRow = page.locator(
    `[data-pending-browsing-inspect="${lineReference}"]`,
  );
  const references = () =>
    rows.evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute("data-pending-browsing-inspect"),
      ),
    );
  await expect(
    page.getByRole("heading", { name: copy.title, exact: true }),
  ).toBeVisible();
  await expect(scope).toContainText(copy.allLocations);
  await size.selectOption("25");
  await expect(size).toHaveValue("25");
  await expect(releaseRow).toHaveText("Manzana reineta");
  const priorReferences = await references();
  expect(priorReferences.length).toBeGreaterThan(1);

  await releaseRow.click();
  const inspector = page.getByRole("dialog", { name: "Detalles de la salida" });
  await expect(
    inspector.locator("[data-pending-inspection-state]"),
  ).toHaveAttribute("data-pending-inspection-state", "pending");
  await expect(
    inspector.locator("[data-pending-inspection-product]"),
  ).toHaveText("Manzana reineta");
  await inspector
    .getByRole("button", { name: "Revisar canal", exact: true })
    .click();

  const dialog = page.getByRole("dialog");
  const channel = dialog.getByRole("combobox", {
    name: "Canal de la salida",
    exact: true,
  });
  const affirmation = dialog.getByRole("checkbox");
  const confirm = dialog.getByRole("button", {
    name: "Confirmar liberación",
    exact: true,
  });
  await expect(channel).toHaveValue("");
  await expect(confirm).toBeDisabled();
  await channel.selectOption({ label: "Mostrador" });
  await affirmation.check();
  await expect(confirm).toBeEnabled();
  await channel.selectOption({ label: "Recogida en tienda" });
  await expect(affirmation).not.toBeChecked();
  await expect(confirm).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await affirmation.check();
  await confirm.click();

  const summary = dialog.locator("[data-pending-release-summary]");
  await expect(summary.getByText("2,5 kg", { exact: true })).toBeVisible();
  await expect(
    summary.getByText("Canal indicado", { exact: true }),
  ).toBeVisible();
  await expect(
    summary.getByText("Recogida en tienda", { exact: true }),
  ).toBeVisible();
  await expect(dialog.locator(releaseEffect)).toHaveText("-2,5 kg");

  await dialog.getByRole("button", { name: returnToList, exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(scope).toContainText(copy.allLocations);
  await expect(size).toHaveValue("25");
  await expect
    .poll(references)
    .toEqual(
      priorReferences.filter((reference) => reference !== lineReference),
    );
});

test("an unconfirmed release resumes the same attempt without claiming a stock effect before confirmation", async ({
  page,
}) => {
  await open(page, "unconfirmed");
  const dialog = page.getByRole("dialog");
  const retry = dialog.getByRole("button", {
    name: "Reintentar la misma operación",
    exact: true,
  });
  await expect(retry).toBeVisible();
  await expect(dialog.locator(releaseEffect)).toBeHidden();
  await dialog.getByRole("button", { name: returnToList, exact: true }).click();
  await page
    .getByRole("button", {
      name: "Volver a la operación sin confirmar",
      exact: true,
    })
    .click();
  await expect(dialog.locator(releaseEffect)).toBeHidden();
  await retry.click();
  await expect(dialog.locator(releaseEffect)).toHaveText("-2,5 kg");
});
