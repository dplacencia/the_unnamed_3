import { expect, type Page } from "@playwright/test";
import { pendingDuplicateReviewMessages } from "../apps/backoffice/.storybook/stories/pending-duplicate-review-messages";
import { pendingResolutionMessages } from "../apps/backoffice/.storybook/stories/pending-resolution-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { pendingReceiptInspection } from "./pending-receipt-inspection-actions";

export async function pendingDuplicateReviewAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const copy = pendingDuplicateReviewMessages[locale];
  const resolution = pendingResolutionMessages[locale];
  const panel = page.getByRole("dialog");
  const line = page.locator(
    '[data-pending-browsing-inspect="resolution-duplicate-1"]',
  );
  await expect(line).toBeVisible();
  if (action === "pending-duplicate-review-list") return;

  await line.click();
  await expect(pendingReceiptInspection(page).state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  const review = panel.getByRole("button", {
    name: copy.reviewDuplicate,
    exact: true,
  });
  await expect(review).toBeVisible();
  if (action === "pending-duplicate-review-inspection") return;

  await review.click();
  const retained = panel.getByRole("combobox", {
    name: resolution.counterpart,
    exact: true,
  });
  await expect(retained).toHaveValue("");
  await retained.selectOption("receipt-197");
  if (action === "pending-duplicate-review-review") return;

  await panel
    .getByRole("textbox", { name: copy.reason })
    .fill("Mismo albarán.");
  await panel.getByRole("checkbox").check();
  await panel.getByRole("button", { name: copy.confirm, exact: true }).click();
  const summary = panel.locator("[data-pending-duplicate-summary]");
  await expect(summary).toContainText("receipt-204");
  await expect(summary).toContainText("receipt-197");
  await expect(panel.getByText(resolution.noEffect)).toBeVisible();
  if (action === "pending-duplicate-review-confirmed") return;
  if (action !== "pending-duplicate-review-returned")
    throw new Error(`Unknown duplicate review interaction: ${action}`);
  await panel
    .getByRole("button", { name: resolution.return, exact: true })
    .click();
  await expect(panel).toBeHidden();
  await expect(line).toHaveCount(0);
}
