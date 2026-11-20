import { expect, type Page } from "@playwright/test";
import { pendingReceiptQuantityMessages } from "../apps/backoffice/.storybook/stories/pending-receipt-quantity-messages";
import { pendingReleaseGuidanceMessages } from "../apps/backoffice/.storybook/stories/pending-release-guidance-messages";
import { pendingResolutionMessages } from "../apps/backoffice/.storybook/stories/pending-resolution-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { pendingReceiptInspection } from "./pending-receipt-inspection-actions";

export async function pendingReceiptQuantityAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const copy = pendingReceiptQuantityMessages[locale];
  const release = pendingReleaseGuidanceMessages[locale];
  const resolution = pendingResolutionMessages[locale];
  const panel = page.getByRole("dialog");
  const line = page.locator(
    '[data-pending-browsing-inspect="resolution-receipt-release"]',
  );
  await expect(line).toBeVisible();
  if (action === "pending-receipt-quantity-list") return;

  await line.click();
  await expect(pendingReceiptInspection(page).state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  const review = panel.getByRole("button", {
    name: copy.reviewQuantity,
    exact: true,
  });
  await expect(review).toBeVisible();
  if (action === "pending-receipt-quantity-inspection") return;

  await review.click();
  await expect(
    panel.locator('[data-pending-resolution-review="receipt-release"]'),
  ).toBeVisible();
  const quantity = panel.getByRole("textbox", {
    name: resolution.actualQuantity,
    exact: true,
  });
  await expect(quantity).toHaveValue("");
  if (action === "pending-receipt-quantity-review") return;

  const submit = panel.getByRole("button", {
    name: release.confirmRelease,
    exact: true,
  });
  if (action === "pending-receipt-quantity-invalid") {
    await quantity.fill("5");
    await expect(quantity).toHaveAttribute("aria-invalid", "true");
    await expect(
      panel.getByText(copy.invalidQuantity, { exact: true }),
    ).toBeVisible();
    await expect(submit).toBeDisabled();
    return;
  }

  await quantity.fill("3");
  await panel.getByRole("checkbox").check();
  await submit.click();
  await expect(panel.locator("[data-pending-release-summary]")).toContainText(
    copy.indicatedQuantity,
  );
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveText(
    "3 ud.",
  );
  if (action === "pending-receipt-quantity-applied") return;
  if (action !== "pending-receipt-quantity-returned")
    throw new Error(`Unknown Pending receipt quantity interaction: ${action}`);
  await panel
    .getByRole("button", { name: resolution.return, exact: true })
    .click();
  await expect(panel).toBeHidden();
  await expect(line).toHaveCount(0);
}
