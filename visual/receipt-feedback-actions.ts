import { expect, type Page } from "@playwright/test";
import {
  pendingReceiptInspection,
  submitPendingReceipt,
} from "./pending-receipt-inspection-actions";
import { fillReceiptForm } from "./stock-receipt-actions";

export async function receiptFeedbackAction(page: Page, action: string) {
  if (action === "receipt-feedback-unconfirmed") {
    const receipt = await fillReceiptForm(page);
    await receipt.submit.click();
    await expect(receipt.panel).toHaveAttribute(
      "data-receipt-panel",
      "unconfirmed",
    );
    await expect(receipt.panel.locator("[data-receipt-retry]")).toBeVisible();
    await expect(receipt.effect).toBeHidden();
    return;
  }
  if (action === "receipt-feedback-balance-failed") {
    const receipt = await fillReceiptForm(page);
    await receipt.submit.click();
    await expect(receipt.effect).toHaveText("500 g");
    await expect(receipt.balance).toHaveAttribute(
      "data-receipt-balance",
      "error",
    );
    await expect(
      receipt.balance.locator("[data-receipt-read-retry]"),
    ).toBeVisible();
    return;
  }

  const inspection = pendingReceiptInspection(page);
  await submitPendingReceipt(page);
  await expect(inspection.original).toBeVisible();
  await expect(inspection.open).toBeVisible();
  if (action === "receipt-feedback-original") return;

  await inspection.open.click();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  if (action === "receipt-feedback-current-pending") return;
  if (action !== "receipt-feedback-current-applied")
    throw new Error(`Unknown receipt feedback interaction: ${action}`);
  await inspection.refresh.click();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "applied",
  );
  await expect(inspection.effect).toContainText("500 g");
}
