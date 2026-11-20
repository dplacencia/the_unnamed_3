import { expect, test, type Locator, type Page } from "@playwright/test";
import { employeeMessages } from "../../apps/backoffice/.storybook/stories/core-employee-accounts-messages";
import { employeeCredentialMessages } from "../../apps/backoffice/.storybook/stories/core-employee-credentials-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

const copy = employeeMessages.es;

async function ready(page: Page, story: string, locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=core-employee-accounts--${story}&viewMode=story&globals=locale:${locale};theme:dark`,
  );
  const workspace = page.locator("[data-core-employee-view]");
  await expect(workspace).toBeVisible();
  return workspace;
}

async function chooseLocation(page: Page, workspace: Locator, name: string) {
  await workspace.getByRole("combobox", { name: copy.administrative }).click();
  await page.getByRole("option", { name, exact: true }).click();
}

test("the Team owner can visit Employees and return to the roster", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=core-team-access--members&viewMode=story&globals=locale:es;theme:light",
  );
  const team = page.locator("[data-core-team-view]");
  await team.getByRole("button", { name: copy.title, exact: true }).click();
  const employees = page.locator("[data-core-employee-view]");
  await expect(
    employees.getByRole("heading", { name: copy.title, exact: true }),
  ).toBeVisible();
  await employees.getByRole("button", { name: copy.team }).click();
  await expect(
    team.getByRole("heading", { name: "Equipo", exact: true }),
  ).toBeVisible();
  await expect(employees).toBeHidden();
});

test("provision uses an explicit Core Area and removes the private handoff after close", async ({
  page,
}) => {
  const workspace = await ready(page, "new-employee");
  await workspace.getByLabel(copy.name, { exact: true }).fill("Ángela");
  await workspace.getByLabel(copy.username, { exact: true }).fill("Angela23");
  await workspace.getByRole("button", { name: copy.add }).click();
  await expect(workspace.getByRole("alert")).toContainText(copy.formError);
  await chooseLocation(page, workspace, "Área · Centro / Sala de ventas");
  await workspace.getByRole("button", { name: copy.add }).click();
  await expect(workspace).toHaveAttribute("data-core-employee-view", "handoff");
  await expect(
    workspace.getByText("angela23.huerta", { exact: true }),
  ).toBeVisible();
  await expect(workspace.locator("[data-core-employee-secret]")).toBeVisible();
  await workspace.getByRole("button", { name: copy.handoffClose }).click();
  await expect(workspace.locator("[data-core-employee-secret]")).toHaveCount(0);
  await expect(
    workspace.getByText("Área · Centro / Sala de ventas", { exact: true }),
  ).toBeVisible();
});

test("account administration changes the selected Site or Area explicitly", async ({
  page,
}) => {
  const workspace = await ready(page, "move-location");
  const save = workspace.getByRole("button", { name: copy.save, exact: true });
  await expect(save).toBeDisabled();
  await chooseLocation(page, workspace, "Centro de trabajo · Centro");
  await save.click();
  await expect(workspace.getByRole("status")).toContainText(copy.locationSaved);
  await expect(
    workspace.getByText("Centro de trabajo · Centro", { exact: true }),
  ).toBeVisible();
});

test("disablement distinguishes provider refusal, unresolved access block and success", async ({
  page,
}) => {
  const workspace = await ready(page, "provider-unavailable");
  await expect(workspace.getByRole("alert")).toContainText(
    copy.providerUnavailable,
  );
  await expect(workspace.locator("[data-core-employee-state]")).toHaveAttribute(
    "data-core-employee-state",
    "enabled",
  );
  await ready(page, "disable-unconfirmed");
  await expect(workspace.getByRole("alert")).toContainText(copy.unconfirmed);
  await expect(workspace.locator("[data-core-employee-state]")).toHaveAttribute(
    "data-core-employee-state",
    "blocked",
  );
  await workspace.getByRole("button", { name: copy.reconcile }).click();
  const confirm = workspace.getByRole("button", { name: copy.confirmIntent });
  await expect(confirm).toBeDisabled();
  await workspace.getByRole("radio", { name: copy.leaveActive }).check();
  await confirm.click();
  await expect(workspace.locator("[data-core-employee-state]")).toHaveAttribute(
    "data-core-employee-state",
    "enabled",
  );
  await ready(page, "disable");
  await workspace.getByRole("button", { name: copy.disable }).click();
  await expect(workspace.locator("[data-core-employee-state]")).toHaveAttribute(
    "data-core-employee-state",
    "disabled",
  );
});

test("reactivation makes an explicit choice and refuses scopes outside delegated authority", async ({
  page,
}) => {
  const workspace = await ready(page, "reactivate-denied");
  const confirm = workspace.getByRole("button", { name: copy.confirmIntent });
  await expect(confirm).toBeDisabled();
  await workspace.getByRole("radio", { name: copy.keep, exact: true }).check();
  await confirm.click();
  await expect(workspace.getByRole("alert")).toContainText(copy.denied);
  for (const choice of [copy.keep, copy.discard]) {
    await ready(page, "reactivate");
    await expect(confirm).toBeDisabled();
    await workspace.getByRole("radio", { name: choice, exact: true }).check();
    await confirm.click();
    await expect(
      workspace.locator("[data-core-employee-state]"),
    ).toHaveAttribute("data-core-employee-state", "enabled");
  }
});

test("returning from credentials preserves the confirmed security lock and original reference", async ({
  page,
}) => {
  const credentials = employeeCredentialMessages("es");
  const workspace = await ready(page, "overview");
  await workspace
    .locator('[data-core-employee="alba"]')
    .getByRole("button", { name: copy.open })
    .click();
  await workspace.getByRole("button", { name: copy.credentials }).click();
  const panel = workspace.locator("[data-employee-credentials-view]");
  await panel
    .getByRole("button", { name: credentials("security"), exact: true })
    .click();
  await panel
    .getByRole("button", { name: credentials("confirm"), exact: true })
    .click();
  await expect(panel).toHaveAttribute(
    "data-employee-credentials-view",
    "security-uncertain",
  );
  const reference = await panel.getAttribute(
    "data-employee-recovery-reference",
  );
  expect(reference).toBeTruthy();
  await panel
    .getByRole("button", { name: credentials("back"), exact: true })
    .click();
  await expect(panel).toBeHidden();
  await workspace.getByRole("button", { name: copy.credentials }).click();
  await expect(panel).toHaveAttribute(
    "data-employee-recovery-reference",
    reference!,
  );
  await expect(
    panel.getByRole("button", {
      name: credentials("securityRetry"),
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    panel.getByRole("button", { name: credentials("security"), exact: true }),
  ).toHaveCount(0);
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`employee provision fits a 320px phone in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const workspace = await ready(page, "new-employee", locale);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      workspace.getByRole("combobox", {
        name: employeeMessages[locale].administrative,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  });
}
