import { expect, type Page } from "@playwright/test";
import { pendingReleaseGuidanceMessages } from "../apps/backoffice/.storybook/stories/pending-release-guidance-messages";
import { pendingResolutionMessages } from "../apps/backoffice/.storybook/stories/pending-resolution-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { pendingReceiptInspection } from "./pending-receipt-inspection-actions";

export async function pendingReleaseGuidanceAction(
  page: Page,
  action: string,
  locale: Locale,
) {
  const copy = pendingReleaseGuidanceMessages[locale];
  const resolution = pendingResolutionMessages[locale];
  const panel = page.getByRole("dialog");
  await expect(page.locator("[data-pending-release-guidance]")).toBeVisible();
  if (action === "pending-release-guidance-unconfirmed") {
    await expect(
      panel.locator('[data-pending-resolution-result="unconfirmed"]'),
    ).toBeVisible();
    return;
  }

  const line = page.locator(
    '[data-pending-browsing-inspect="resolution-release-1"]',
  );
  await expect(line).toBeVisible();
  if (action === "pending-release-guidance-list") return;

  await line.click();
  await expect(pendingReceiptInspection(page).state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  const reviewChannel = panel.getByRole("button", {
    name: copy.reviewChannel,
    exact: true,
  });
  await expect(reviewChannel).toBeVisible();
  if (action === "pending-release-guidance-inspection") return;

  await reviewChannel.click();
  await expect(
    panel.locator('[data-pending-resolution-review="release"]'),
  ).toBeVisible();
  const channel = panel.getByRole("combobox", {
    name: copy.channelLabel,
    exact: true,
  });
  await expect(channel).toHaveValue("");
  if (action === "pending-release-guidance-review") return;

  await channel.selectOption("channel-pickup");
  await panel.getByRole("checkbox").check();
  await panel
    .getByRole("button", { name: copy.confirmRelease, exact: true })
    .click();
  await expect(panel.locator("[data-pending-resolution-effect]")).toHaveText(
    locale === "en" ? "-2.5 kg" : "-2,5 kg",
  );
  await expect(panel.locator("[data-pending-release-summary]")).toContainText(
    "Recogida en tienda",
  );
  if (action === "pending-release-guidance-applied") return;
  if (action !== "pending-release-guidance-returned")
    throw new Error(`Unknown Pending release interaction: ${action}`);
  await panel
    .getByRole("button", { name: resolution.return, exact: true })
    .click();
  await expect(panel).toBeHidden();
  await expect(line).toHaveCount(0);
}
