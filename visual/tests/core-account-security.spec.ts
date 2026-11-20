import { expect, test, type Page } from "@playwright/test";
import { accountSecurityMessages } from "../../apps/backoffice/.storybook/stories/core-account-security-messages";
import { coreMerchantMessages } from "../../apps/backoffice/.storybook/stories/core-merchant-workspace-messages";

const copy = accountSecurityMessages.es;
const merchantCopy = coreMerchantMessages.es;

async function open(page: Page, id: string, locale = "es") {
  await page.goto(
    `/iframe.html?id=${id}&viewMode=story&globals=locale:${locale};theme:dark`,
  );
}

test("signup offers a hosted handoff with no credential form", async ({
  page,
}) => {
  await open(page, "core-merchant-workspace--signup-handoff");
  await page.getByRole("button", { name: merchantCopy.signUp }).click();
  await expect(page.getByText(merchantCopy.signUpHandoff)).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: merchantCopy.continueSignUp }).click();
  await expect(
    page.getByRole("heading", { name: merchantCopy.verifyEmail }),
  ).toBeVisible();
});

test("setup delay does not grant workspace access until confirmed ready", async ({
  page,
}) => {
  await open(page, "core-merchant-workspace--creation-delayed");
  await expect(
    page.getByRole("heading", { name: merchantCopy.delayed }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: merchantCopy.enter }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: merchantCopy.checkReadiness }).click();
  await expect(
    page.getByRole("heading", { name: merchantCopy.ready }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: merchantCopy.enter }),
  ).toBeVisible();
});

test("known trial, pause and unavailable access remain distinct", async ({
  page,
}) => {
  await open(page, "core-inventory-trial-access--active");
  await expect(
    page.locator('[data-merchant-inventory-access="active"] time'),
  ).toHaveAttribute("datetime", "2026-12-20T12:00:00Z");
  for (const phase of ["paused", "unavailable"]) {
    await open(page, `core-inventory-trial-access--${phase}`);
    const status = page.locator(`[data-merchant-inventory-access="${phase}"]`);
    await expect(status).toBeVisible();
    await expect(status.locator("time")).toHaveCount(0);
  }
});

test("account recovery requires confirmation and hands off for setup", async ({
  page,
}) => {
  await open(page, "core-account-security--account");
  await page.getByRole("button", { name: copy.sessions }).click();
  await expect(
    page.locator('[data-account-native-handoff="sessions"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: copy.back }).click();
  await page.getByRole("button", { name: copy.confirmRecovery }).click();
  await expect(page.getByText(copy.confirmation)).toBeVisible();
  await expect(page.locator("[data-account-recovery-status]")).toHaveCount(0);
  await page.getByRole("button", { name: copy.confirmRecovery }).click();
  await expect(
    page.locator('[data-account-recovery-status="pending"]'),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: copy.cancel })).toHaveCount(0);
  await page.getByRole("button", { name: copy.consult }).click();
  await expect(
    page.locator('[data-account-recovery-status="action_required"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: copy.forgotPassword }).click();
  await expect(
    page.locator('[data-account-native-handoff="forgot-password"]'),
  ).toBeVisible();
});

test("unavailable status cannot start another recovery or claim completion", async ({
  page,
}) => {
  await open(page, "core-account-security--recovery-status-unavailable");
  await expect(
    page.locator('[data-account-recovery-status="unavailable"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: copy.confirmRecovery }),
  ).toHaveCount(0);
  await expect(page.getByText(copy.completed)).toHaveCount(0);
  await page.getByRole("button", { name: copy.signIn }).click();
  await expect(
    page.locator('[data-account-native-handoff="sign-in"]'),
  ).toBeVisible();
});

test("merchant policy retains its previous state until fresh MFA succeeds", async ({
  page,
}) => {
  await open(page, "core-account-security--merchant-mfa-policy");
  await page.getByRole("button", { name: copy.enable }).click();
  const days = page.getByLabel(copy.days, { exact: true });
  await days.fill("61");
  await expect(
    page.getByRole("button", { name: copy.continue, exact: true }),
  ).toBeDisabled();
  await days.fill("30");
  await page.getByRole("button", { name: copy.continue, exact: true }).click();
  await expect(page.locator('[data-mfa-policy="optional"]')).toBeVisible();
  await page.getByRole("button", { name: copy.recheckAction }).click();
  await expect(page.locator('[data-mfa-policy="grace"] time')).toHaveAttribute(
    "datetime",
    "2026-12-20",
  );
  await page.getByRole("button", { name: copy.adjust }).click();
  await page.getByLabel(copy.newDeadline).fill("2027-01-19");
  await page.getByRole("button", { name: copy.continue, exact: true }).click();
  await expect(page.locator('[data-mfa-policy="grace"] time')).toHaveAttribute(
    "datetime",
    "2026-12-20",
  );
  await page.getByRole("button", { name: copy.recheckAction }).click();
  await expect(page.locator('[data-mfa-policy="grace"] time')).toHaveAttribute(
    "datetime",
    "2027-01-19",
  );
  await page.getByRole("button", { name: copy.disable }).click();
  await page.getByRole("button", { name: copy.recheckAction }).click();
  await expect(page.locator('[data-mfa-policy="optional"]')).toBeVisible();
});

test("an unconfirmed MFA verification preserves the policy", async ({
  page,
}) => {
  await open(page, "core-account-security--merchant-mfa-unconfirmed");
  await page.getByRole("button", { name: copy.enable }).click();
  await page.getByLabel(copy.days, { exact: true }).fill("30");
  await page.getByRole("button", { name: copy.continue, exact: true }).click();
  await page.getByRole("button", { name: copy.recheckAction }).click();
  await expect(page.getByText(copy.recheckRefused)).toBeVisible();
  await expect(page.locator('[data-mfa-policy="optional"]')).toBeVisible();
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`recovery confirmation fits a narrow phone in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await open(page, "core-account-security--recovery-confirmation", locale);
    await expect(
      page.getByText(accountSecurityMessages[locale].confirmation),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  });
}
