import { expect, test } from "@playwright/test";
import { pendingBrowsingMessages } from "../../apps/backoffice/.storybook/stories/pending-movements-browsing-messages";

const copy = pendingBrowsingMessages("es");
const reference = "resolution-receipt-release";

test.use({ viewport: { width: 320, height: 760 } });

test("partial receipt release validates the reported quantity, reconfirms changes and returns to the same Pending list", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=backoffice-pending-receipt-quantity--flow&viewMode=story&globals=locale:es;theme:light",
  );
  const listHeading = page.getByRole("heading", {
    name: copy.title,
    exact: true,
  });
  await expect(listHeading).toBeVisible();

  const scope = page.locator("[data-navigation-location]");
  const size = page.getByRole("combobox", { name: copy.perPage, exact: true });
  const rows = page.locator("[data-pending-browsing-inspect]");
  const references = () =>
    rows.evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute("data-pending-browsing-inspect"),
      ),
    );
  await expect(scope).toContainText(copy.allLocations);
  await size.selectOption("25");
  await expect(size).toHaveValue("25");
  const row = page.locator(`[data-pending-browsing-inspect="${reference}"]`);
  await expect(row).toHaveText("Pan de masa madre");
  const initialReferences = await references();
  expect(initialReferences.length).toBeGreaterThan(1);

  await row.click();
  const inspector = page.getByRole("dialog", {
    name: "Detalles de la entrada",
  });
  await expect(
    inspector.locator("[data-pending-inspection-state]"),
  ).toHaveAttribute("data-pending-inspection-state", "pending");
  await expect(
    inspector.locator("[data-pending-inspection-product]"),
  ).toHaveText("Pan de masa madre");
  await inspector
    .getByRole("button", { name: "Revisar cantidad", exact: true })
    .click();

  const dialog = page.getByRole("dialog");
  const amount = dialog.getByRole("textbox", {
    name: "Cantidad que llegó",
    exact: true,
  });
  const affirmation = dialog.getByRole("checkbox");
  const confirm = dialog.getByRole("button", {
    name: "Confirmar liberación",
    exact: true,
  });
  await expect(dialog.getByText("8 ud.", { exact: true })).toBeVisible();
  await expect(dialog.getByText("ud.", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("combobox")).toHaveCount(0);
  await expect(amount).toHaveValue("");
  await expect(confirm).toBeDisabled();

  await amount.fill("5");
  await expect(amount).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.getByText(/menor (?:que|de|a) 8/iu)).toBeVisible();
  await expect(dialog.getByText(/múltiplos de (?:3|tres)/iu)).toBeVisible();
  for (const invalid of ["8", "0"]) {
    await amount.fill(invalid);
    await expect(amount).toHaveAttribute("aria-invalid", "true");
    await expect(confirm).toBeDisabled();
  }

  await amount.fill("6");
  await expect(amount).not.toHaveAttribute("aria-invalid", "true");
  await affirmation.check();
  await expect(confirm).toBeEnabled();
  await amount.fill("3");
  await expect(affirmation).not.toBeChecked();
  await expect(confirm).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );

  await affirmation.check();
  await confirm.click();
  const summary = dialog.locator("[data-pending-release-summary]");
  await expect(summary.getByText("8 ud.", { exact: true })).toBeVisible();
  await expect(
    summary.getByText("Cantidad indicada", { exact: true }),
  ).toBeVisible();
  await expect(summary.getByText("3 ud.", { exact: true })).toBeVisible();
  await expect(dialog.locator("[data-pending-resolution-effect]")).toHaveText(
    "3 ud.",
  );

  await dialog
    .getByRole("button", { name: "Volver a Pendientes", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(listHeading).toBeVisible();
  await expect(scope).toContainText(copy.allLocations);
  await expect(size).toHaveValue("25");
  await expect
    .poll(references)
    .toEqual(initialReferences.filter((value) => value !== reference));
});
