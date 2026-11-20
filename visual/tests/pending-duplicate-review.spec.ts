import { expect, test } from "@playwright/test";
import { pendingBrowsingMessages } from "../../apps/backoffice/.storybook/stories/pending-movements-browsing-messages";
import { pendingResolutionMessages } from "../../apps/backoffice/.storybook/stories/pending-resolution-messages";

const browsing = pendingBrowsingMessages("es");
const resolution = pendingResolutionMessages.es;
const duplicate = "resolution-duplicate-1";
const sibling = "resolution-duplicate-2";
const keptBatch = "Lote que se conservará";

test.use({ viewport: { width: 320, height: 760 } });

test("duplicate cancellation at 320px confirms the exact retained batch and removes only the duplicate lines", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=backoffice-pending-duplicate-review--flow&viewMode=story&globals=locale:es;theme:light",
  );
  const listHeading = page.getByRole("heading", {
    name: browsing.title,
    exact: true,
  });
  await expect(listHeading).toBeVisible();

  const scope = page.locator("[data-navigation-location]");
  const pageSize = page.getByRole("combobox", {
    name: browsing.perPage,
    exact: true,
  });
  const references = () =>
    page
      .locator("[data-pending-browsing-inspect]")
      .evaluateAll((rows) =>
        rows.map((row) => row.getAttribute("data-pending-browsing-inspect")),
      );
  await expect(scope).toContainText(browsing.allLocations);
  await pageSize.selectOption("25");
  await expect(pageSize).toHaveValue("25");
  const row = page.locator(`[data-pending-browsing-inspect="${duplicate}"]`);
  await expect(row).toHaveText("Arroz largo");
  const before = await references();
  expect(before).toEqual(expect.arrayContaining([duplicate, sibling]));
  expect(before.length).toBeGreaterThan(2);

  await row.click();
  const inspector = page.getByRole("dialog", {
    name: browsing.inspectionTitle,
  });
  await expect(
    inspector.locator("[data-pending-inspection-state]"),
  ).toHaveAttribute("data-pending-inspection-state", "pending");
  await inspector
    .getByRole("button", { name: "Revisar duplicado", exact: true })
    .click();

  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Lote que se cancelará", exact: true }),
  ).toBeVisible();
  await expect(dialog.getByText("receipt-204", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/Arroz largo.*5 kg/iu)).toBeVisible();
  await expect(dialog.getByText(/Harina de trigo.*3 kg/iu)).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: keptBatch, exact: true }),
  ).toBeVisible();

  const retained = dialog.getByRole("combobox", {
    name: keptBatch,
    exact: true,
  });
  const reason = dialog.getByRole("textbox", {
    name: "Motivo de la cancelación",
    exact: true,
  });
  const affirmation = dialog.getByRole("checkbox");
  const confirm = dialog.getByRole("button", {
    name: "Confirmar cancelación",
    exact: true,
  });
  await expect(confirm).toBeDisabled();
  await retained.selectOption("receipt-198");
  await reason.fill("Mismo albarán.");
  await affirmation.check();
  await expect(confirm).toBeEnabled();
  await retained.selectOption("receipt-197");
  await expect(affirmation).not.toBeChecked();
  await expect(confirm).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await affirmation.check();
  await confirm.click();

  await expect(
    dialog.getByText("Lote cancelado", { exact: true }),
  ).toBeVisible();
  await expect(dialog.getByText("receipt-204", { exact: true })).toBeVisible();
  await expect(
    dialog.getByText("Lote conservado", { exact: true }),
  ).toBeVisible();
  await expect(dialog.getByText("receipt-197", { exact: true })).toBeVisible();
  await expect(dialog).not.toContainText("receipt-198");
  await expect(dialog.locator("[data-pending-resolution-effect]")).toHaveCount(
    0,
  );
  await expect(
    dialog.getByText(resolution.noEffect, { exact: true }),
  ).toBeVisible();

  await dialog
    .getByRole("button", { name: resolution.return, exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(listHeading).toBeVisible();
  await expect(scope).toContainText(browsing.allLocations);
  await expect(pageSize).toHaveValue("25");
  await expect
    .poll(references)
    .toEqual(
      before.filter(
        (reference) => reference !== duplicate && reference !== sibling,
      ),
    );
});
