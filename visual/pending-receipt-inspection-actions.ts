import { expect, type FrameLocator, type Page } from "@playwright/test";
import { fillReceiptForm } from "./stock-receipt-actions";

export function pendingReceiptInspection(page: Page | FrameLocator) {
  const locator = (name: string) =>
    page.locator(`[data-pending-inspection-${name}]`);

  return {
    workspace: locator("workspace"),
    open: locator("open"),
    original: locator("original"),
    content: locator("content"),
    state: locator("state"),
    heading: locator("heading"),
    back: locator("back"),
    refresh: locator("refresh"),
    retry: locator("retry"),
    facts: locator("facts"),
    product: locator("product"),
    location: locator("location"),
    quantity: locator("quantity"),
    unit: locator("unit"),
    reasons: locator("reasons"),
    effect: locator("effect"),
  };
}

export async function submitPendingReceipt(page: Page) {
  const receipt = await fillReceiptForm(page);
  await receipt.submit.click();
  await expect(receipt.panel).toHaveAttribute("data-receipt-panel", "pending");
  return receipt;
}

const inspectionStates = {
  "pending-receipt-inspection-pending": "pending",
  "pending-receipt-inspection-known-quantity": "pending",
  "pending-receipt-inspection-known-unit": "pending",
  "pending-receipt-inspection-applied": "applied",
  "pending-receipt-inspection-rejected": "rejected",
  "pending-receipt-inspection-loading": "loading",
  "pending-receipt-inspection-unavailable": "unavailable",
  "pending-receipt-inspection-read-error": "error",
} as const;

export async function pendingReceiptInspectionAction(
  page: Page,
  action: string,
) {
  const inspection = pendingReceiptInspection(page);
  await expect(inspection.workspace).toBeAttached();
  await submitPendingReceipt(page);
  await expect(inspection.original).toBeVisible();
  if (action === "pending-receipt-inspection-original") return;
  const state = inspectionStates[action as keyof typeof inspectionStates];
  if (!state)
    throw new Error(
      `Unknown pending receipt inspection interaction: ${action}`,
    );

  await inspection.open.click();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    state,
  );
  if (action === "pending-receipt-inspection-known-quantity") {
    await expect(inspection.quantity).toHaveText("500");
    await expect(inspection.unit).not.toHaveText("g");
  }
  if (action === "pending-receipt-inspection-known-unit") {
    await expect(inspection.quantity).not.toHaveText("500");
    await expect(inspection.unit).toHaveText("g");
  }
}
