import { expect, test, type Page } from "@playwright/test";
import { employeeCredentialMessages } from "../../apps/backoffice/.storybook/stories/core-employee-credentials-messages";

const t = employeeCredentialMessages("es");
const examplePassword = "[data-employee-example-password]";

async function credentials(page: Page, fixture = "actions", locale = "es") {
  await page.goto(
    `/iframe.html?id=core-employee-credentials--${fixture}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  const panel = page.locator(`[data-employee-credentials-ready="${fixture}"]`);
  await expect(panel).toBeVisible();
  return panel;
}

test("normal reset requires an explicit session choice and removes the private handoff when dismissed", async ({
  page,
}) => {
  const panel = await credentials(page);
  await panel.getByRole("button", { name: t("password") }).click();
  const confirm = panel.getByRole("button", { name: t("confirm") });
  await expect(confirm).toBeDisabled();
  await expect(panel.getByRole("radio", { name: t("keep") })).not.toBeChecked();
  await expect(
    panel.getByRole("radio", { name: t("signOut") }),
  ).not.toBeChecked();
  await panel.getByRole("radio", { name: t("keep") }).check();
  await confirm.click();
  await expect(panel.locator(examplePassword)).toBeVisible();
  await expect(panel.getByRole("status")).toHaveText(t("kept"));
  await panel.getByRole("button", { name: t("dismissPassword") }).click();
  await expect(panel.locator(examplePassword)).toHaveCount(0);
  await panel.getByRole("button", { name: t("password") }).click();
  await expect(confirm).toBeDisabled();
  await panel.getByRole("radio", { name: t("signOut") }).check();
  await confirm.click();
  await expect(panel.getByRole("status")).toHaveText(t("signedOut"));
  expect(
    await page.evaluate(() =>
      JSON.stringify([localStorage, sessionStorage]).includes("DEMO-4W8Q-L3R6"),
    ),
  ).toBe(false);
});

test("assisted MFA reset stays separate and preserves the old factor until replacement verification", async ({
  page,
}) => {
  const panel = await credentials(page);
  await panel.getByRole("button", { name: t("mfa") }).click();
  await expect(panel.getByText(t("mfaWhat"))).toBeVisible();
  await panel.getByRole("button", { name: t("confirm") }).click();
  await expect(panel.getByRole("status")).toContainText(t("mfaInitiated"));
  await expect(panel.locator(examplePassword)).toHaveCount(0);
  await expect(panel.getByText(t("securityLocked"))).toHaveCount(0);
});

test("an uncertain security reset keeps the confirmed lock and reconciles the existing operation", async ({
  page,
}) => {
  const panel = await credentials(page);
  await panel.getByRole("button", { name: t("security") }).click();
  await expect(panel.getByText(t("securityWhat"))).toBeVisible();
  await panel.getByRole("button", { name: t("confirm") }).click();
  const original = await panel.getAttribute("data-employee-recovery-reference");
  expect(original).toBeTruthy();
  await expect(panel.getByRole("alert")).toContainText(t("securityUnknown"));
  await expect(panel.getByText(t("securityLocked"))).toBeVisible();
  await expect(panel.locator(examplePassword)).toHaveCount(0);
  await expect(panel.getByRole("button", { name: t("security") })).toHaveCount(
    0,
  );
  await panel.getByRole("button", { name: t("back") }).click();
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: t("title") }).click();
  await expect(panel.getByRole("alert")).toContainText(t("securityUnknown"));
  await expect(panel).toHaveAttribute(
    "data-employee-recovery-reference",
    original ?? "",
  );
  await expect(panel.getByRole("button", { name: t("security") })).toHaveCount(
    0,
  );
  await panel.getByRole("button", { name: t("securityRetry") }).click();
  await expect(panel).toHaveAttribute(
    "data-employee-recovery-reference",
    original ?? "",
  );
  await expect(panel.getByRole("status")).toContainText(t("securityDone"));
  await expect(panel.getByText(t("securityMfa"))).toBeVisible();
  await expect(panel.locator(examplePassword)).toBeVisible();
  await panel.getByRole("button", { name: t("back") }).click();
  await expect(panel.locator(examplePassword)).toHaveCount(0);
  await page.getByRole("button", { name: t("title") }).click();
  await expect(panel.getByRole("status")).toContainText(t("securityDone"));
  await expect(panel.locator(examplePassword)).toHaveCount(0);
});

test("credential action choices fit a narrow phone in all five languages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const panel = await credentials(page, "actions", locale);
    const local = employeeCredentialMessages(locale);
    await expect(
      panel.getByRole("heading", { name: local("title") }),
    ).toBeVisible();
    await expect(
      panel.getByRole("button", { name: local("mfa") }),
    ).toBeVisible();
    const width = await panel.evaluate((element) => ({
      scroll: element.scrollWidth,
      layout: element.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.layout);
  }
});
