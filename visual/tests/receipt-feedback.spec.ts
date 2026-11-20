import { expect, test, type Page } from "@playwright/test";
import { pendingInspectionMessages } from "../../apps/backoffice/.storybook/stories/pending-receipt-inspection-messages";
import { receiptMessages } from "../../apps/backoffice/.storybook/stories/stock-receipt-messages";
import { pendingReceiptInspection } from "../pending-receipt-inspection-actions";
import { fillReceiptForm } from "../stock-receipt-actions";

const receiptCopy = receiptMessages.es;
const inspectionCopy = pendingInspectionMessages("es");
const pendingStockExplanation =
  "Al registrar esta entrada, las existencias no cambiaron.";

type Story = "current" | "pending" | "unconfirmed" | "balance-read-failed";

async function submit(page: Page, story: Story) {
  await page.goto(
    `/iframe.html?id=inventory-receipt-feedback--${story}&viewMode=story&globals=locale:es;theme:light`,
  );
  await expect(page.locator("[data-receipt-workspace]")).toBeVisible();
  const form = await fillReceiptForm(page);
  await form.submit.click();
  return form;
}

test("receipt feedback on a narrow phone distinguishes original Pending from the exact current state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  const baseline = await submit(page, "current");
  await expect(baseline.panel).toHaveAttribute("data-receipt-panel", "pending");
  await expect(
    baseline.panel.getByText(pendingStockExplanation, { exact: true }),
  ).toHaveCount(0);

  const receipt = await submit(page, "pending");
  const inspection = pendingReceiptInspection(page);
  const originalExplanation = receipt.panel.getByText(pendingStockExplanation, {
    exact: true,
  });
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "pending");
  await expect(originalExplanation).toBeVisible();
  await expect(inspection.original).toContainText(
    inspectionCopy.originalResult,
  );
  for (const reason of inspectionCopy.fixtureReasons.slice(0, 2)) {
    await expect(
      receipt.panel.getByText(reason, { exact: true }),
    ).toBeVisible();
  }
  await expect(receipt.effect).toBeHidden();
  await expect(receipt.balance).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );

  const reference = await inspection.open.getAttribute(
    "data-pending-inspection-open",
  );
  expect(reference).toBeTruthy();
  await inspection.open.click();
  await expect(inspection.heading).toHaveText(inspectionCopy.title);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  await expect(inspection.workspace).toHaveAttribute(
    "data-pending-inspection-last-reference",
    reference!,
  );
  await expect(inspection.workspace).toHaveAttribute(
    "data-pending-inspection-read-count",
    "1",
  );
  await expect(inspection.effect).toBeHidden();
  await expect(originalExplanation).toBeHidden();
  await inspection.refresh.click();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "applied",
  );
  await expect(inspection.effect).toContainText("500 g");
  await expect(inspection.workspace).toHaveAttribute(
    "data-pending-inspection-last-reference",
    reference!,
  );
  await expect(inspection.workspace).toHaveAttribute(
    "data-pending-inspection-read-count",
    "2",
  );

  await inspection.back.click();
  await expect(inspection.open).toBeFocused();
  await expect(receipt.panel).toContainText(receiptCopy.pending);
  await expect(originalExplanation).toBeVisible();
  await expect(inspection.effect).toBeHidden();
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
});

test("unconfirmed receipt gives one explicit recovery action after bounded attempts", async ({
  page,
}) => {
  const receipt = await submit(page, "unconfirmed");
  await expect(receipt.panel).toHaveAttribute(
    "data-receipt-panel",
    "unconfirmed",
  );
  await expect(
    receipt.panel.getByText(
      "No hemos podido confirmar el resultado de esta entrada.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
  const retry = receipt.panel.getByRole("button", { name: /^Reintentar/u });
  await expect(retry).toHaveCount(1);
  await expect(retry).toHaveAccessibleName("Reintentar la misma entrada");
  await expect(receipt.submit).toBeHidden();
  await expect(pendingReceiptInspection(page).open).toBeHidden();
  await expect(receipt.effect).toBeHidden();
  await expect(receipt.balance).toBeHidden();
  await expect(receipt.workspace).toHaveAttribute("data-receipt-run", "1");
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "3",
  );
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-read-count",
    "0",
  );

  await retry.click();
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.workspace).toHaveAttribute("data-receipt-run", "2");
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "4",
  );
});

test("failed balance lookup leaves the applied receipt visible and retries only the read", async ({
  page,
}) => {
  const receipt = await submit(page, "balance-read-failed");
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "applied");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.balance).toHaveAttribute(
    "data-receipt-balance",
    "error",
  );
  await expect(receipt.recordedQuantity).toBeHidden();
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-read-count",
    "1",
  );

  await receipt.balance
    .getByRole("button", { name: "Reintentar consulta", exact: true })
    .click();
  await expect(receipt.recordedQuantity).toHaveText("0,5 kg");
  await expect(receipt.effect).toHaveText("500 g");
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
  await expect(receipt.workspace).toHaveAttribute(
    "data-receipt-read-count",
    "2",
  );
});
