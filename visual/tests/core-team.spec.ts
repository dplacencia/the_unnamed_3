import { expect, test, type Locator, type Page } from "@playwright/test";
import { coreTeamLifecycleMessages } from "../../apps/backoffice/.storybook/stories/core-team-lifecycle-messages";
import { employeeMessages } from "../../apps/backoffice/.storybook/stories/core-employee-accounts-messages";
import { coreTeamMessages } from "../../apps/backoffice/.storybook/stories/core-team-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

const copy = coreTeamMessages.es;
const lifecycle = coreTeamLifecycleMessages.es;

async function openTeamStory(page: Page, story: string, locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=core-team-access--${story}&viewMode=story&globals=locale:${locale};theme:dark`,
  );
  const team = page.locator("[data-core-team-view]");
  await expect(team).toBeVisible();
  return team;
}

async function choose(page: Page, field: Locator, option: string) {
  await field.click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("scoped management shows only supplied assignments and invitation authority remains separate", async ({
  page,
}) => {
  const team = await openTeamStory(page, "delegated-members");
  const marina = team.locator('[data-core-team-member="marina"]');
  const sofia = team.locator('[data-core-team-member="sofia"]');
  await expect(marina).toContainText(copy.empty);
  await expect(sofia).toContainText(copy.empty);
  await expect(
    team.getByRole("button", { name: copy.editMemberName }),
  ).toHaveCount(0);
  await expect(team.locator('[data-core-team-member="pablo"]')).toContainText(
    copy.inactive,
  );
  await expect(
    team.getByRole("button", { name: copy.invitations }),
  ).toHaveCount(0);

  await openTeamStory(page, "invite-only");
  await expect(
    team.getByRole("heading", { name: copy.invitations }),
  ).toBeVisible();
  await expect(team.getByRole("button", { name: copy.roles })).toHaveCount(0);
  await team.getByRole("button", { name: copy.newInvitation }).click();
  await expect(team.getByRole("combobox")).toHaveCount(0);
});

test("an assignment needs a role and explicit scope and updates only the selected member", async ({
  page,
}) => {
  const team = await openTeamStory(page, "assign-role");
  const role = team.getByRole("combobox", { name: copy.role, exact: true });
  const scope = team.getByRole("combobox", { name: copy.scope, exact: true });
  await expect(scope).toBeDisabled();
  await choose(page, role, "Consulta de existencias");
  await team.getByRole("button", { name: copy.assign }).click();
  await expect(team.getByRole("alert")).toContainText(copy.assignmentError);
  await choose(page, scope, `${copy.area} · ${copy.sales}`);
  await team.getByRole("button", { name: copy.assign }).click();
  await expect(team.locator('[data-core-team-member="sofia"]')).toContainText(
    `Consulta de existencias · ${copy.sales}`,
  );
  await expect(team.locator('[data-core-team-member="marina"]')).toContainText(
    copy.owner,
  );
});

test("role creation exposes the reserved permissions and preserves historic capability keys", async ({
  page,
}) => {
  const team = await openTeamStory(page, "roles");
  await team.getByText("Control previo de almacén", { exact: true }).click();
  await expect(
    team.getByText("legacy:inventory:audit", { exact: true }),
  ).toBeVisible();
  await expect(team.getByText(copy.notAssignable)).toBeVisible();
  await team.getByRole("button", { name: copy.newRole }).click();
  await expect(
    team.getByRole("checkbox", { name: new RegExp(copy.permissionLabels[2]) }),
  ).toBeDisabled();
  await team.getByLabel(copy.name).fill("Consulta por turno");
  await team
    .getByRole("checkbox", { name: copy.permissionLabels[10], exact: true })
    .check();
  await team.getByRole("button", { name: copy.newRole }).click();
  await expect(
    team.getByText("Consulta por turno", { exact: true }),
  ).toBeVisible();
});

test("last-Owner refusal preserves the Owner assignment", async ({ page }) => {
  const team = await openTeamStory(page, "members");
  const marina = team.locator('[data-core-team-member="marina"]');
  await marina.getByRole("button", { name: copy.revoke }).click();
  await expect(team.getByRole("alert")).toContainText(copy.lastOwner);
  await expect(marina).toContainText(`${copy.owner} · ${copy.merchant}`);
});

test("an Owner edits only the selected names and explicitly clears a last name", async ({
  page,
}) => {
  const team = await openTeamStory(page, "edit-member-name");
  const save = team.getByRole("button", { name: copy.saveMemberName });
  const first = team.getByLabel(copy.memberFirstName, { exact: true });
  const last = team.getByLabel(copy.memberLastName, { exact: true });
  await expect(save).toBeDisabled();
  await first.fill("  Lucía María  ");
  await last.fill("   ");
  await save.click();
  await expect(last).toHaveAttribute("aria-invalid", "true");
  await last.fill("Ortega");
  await save.click();
  const lucia = team.locator('[data-core-team-member="lucia"]');
  await expect(
    lucia.getByText("Lucía María Ortega", { exact: true }),
  ).toBeVisible();
  await lucia.getByRole("button", { name: copy.editMemberName }).click();
  await team.getByRole("checkbox", { name: copy.memberNoLastName }).check();
  await expect(last).toBeDisabled();
  await save.click();
  await expect(lucia.getByText("Lucía María", { exact: true })).toBeVisible();
  await expect(lucia).toContainText("lucia@huerta.example");
  await expect(lucia).toContainText("Administración de equipo");
});

test("invitation actions follow the returned states and pending cancellation is explicit", async ({
  page,
}) => {
  const team = await openTeamStory(page, "invitations");
  const pending = team.locator('[data-core-team-invitation="iv-ferran"]');
  const expired = team.locator('[data-core-team-invitation="iv-nuria"]');
  await expect(
    team.locator('[data-core-team-invitation="iv-lucia"]').getByRole("button"),
  ).toHaveCount(0);
  await expect(
    expired.getByRole("button", { name: copy.resend }),
  ).toBeVisible();
  await expect(
    expired.getByRole("button", { name: copy.cancelInvitation }),
  ).toHaveCount(0);
  await pending.getByRole("button", { name: copy.cancelInvitation }).click();
  await expect(pending.getByText(/¿Cancelar la invitación para/)).toBeVisible();
  await pending.getByRole("button", { name: copy.cancelInvitation }).click();
  await expect(pending).toContainText(copy.cancelled);
  await expect(pending.getByRole("button")).toHaveCount(0);
});

test("preselected invitation roles stay separate from members until a confirmed acceptance", async ({
  page,
}) => {
  const team = await openTeamStory(page, "new-invitation-with-role");
  await team.getByLabel(copy.email, { exact: true }).fill("ana@huerta.example");
  await choose(
    page,
    team.getByRole("combobox", { name: copy.role, exact: true }),
    "Consulta de existencias",
  );
  await choose(
    page,
    team.getByRole("combobox", { name: copy.scope, exact: true }),
    `${copy.area} · ${copy.sales}`,
  );
  await team.getByRole("button", { name: copy.send }).click();
  const invitation = team
    .locator("[data-core-team-invitation]")
    .filter({ hasText: "ana@huerta.example" });
  await expect(invitation).toContainText(copy.pending);
  await expect(invitation).toContainText(
    `Consulta de existencias · ${copy.sales}`,
  );
  await team.getByRole("button", { name: copy.members }).click();
  await expect(
    team.getByText("ana@huerta.example", { exact: true }),
  ).toHaveCount(0);

  await openTeamStory(page, "invitation-accepted");
  await expect(team.getByText(copy.inviteeHint)).toBeVisible();
  await expect(team.getByText(copy.grantedAssignment)).toHaveCount(0);
  await openTeamStory(page, "invitation-accepted-with-role");
  await expect(team.getByText(copy.grantedAssignment)).toBeVisible();
  await expect(
    team.getByText(`Consulta de existencias · ${copy.sales}`, { exact: true }),
  ).toBeVisible();
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`team and invitation controls fit a 320 px phone in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const team = await openTeamStory(page, "new-invitation-with-role", locale);
    const messages = coreTeamMessages[locale];
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      team.getByLabel(messages.email, { exact: true }),
    ).toBeVisible();
    await expect(
      team.getByRole("button", { name: messages.send }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
    await openTeamStory(page, "edit-member-name", locale);
    await expect(
      team.getByLabel(messages.memberFirstName, { exact: true }),
    ).toBeVisible();
    await expect(
      team.getByRole("button", { name: messages.saveMemberName }),
    ).toBeDisabled();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  });
}

test("an Owner can edit a custom role or delete its retained assignments", async ({
  page,
}) => {
  const team = await openTeamStory(page, "role-edit");
  await team.getByLabel(copy.name).fill("Consulta actualizada");
  await team
    .getByRole("checkbox", { name: copy.permissionLabels[9], exact: true })
    .uncheck();
  await team.getByRole("button", { name: lifecycle.saveRole }).click();
  await expect(
    team.getByText("Consulta actualizada", { exact: true }),
  ).toBeVisible();
  const updatedRole = team.getByText("Consulta actualizada", { exact: true });
  await updatedRole.click();
  const roleDetails = updatedRole.locator("..");
  await expect(
    roleDetails.getByText(copy.permissionLabels[10], { exact: true }),
  ).toBeVisible();
  await expect(
    roleDetails.getByText(copy.permissionLabels[9], { exact: true }),
  ).toHaveCount(0);
  await openTeamStory(page, "role-delete");
  await team.getByRole("button", { name: lifecycle.deleteRole }).click();
  await expect(team.getByRole("status")).toHaveText(lifecycle.roleDeleted);
  await team.getByRole("button", { name: copy.members, exact: true }).click();
  await expect(team.locator('[data-core-team-member="pablo"]')).toContainText(
    copy.empty,
  );
  await expect(team.locator('[data-core-team-member="marina"]')).toContainText(
    copy.owner,
  );
});

test("membership deactivation retains grants until an explicit reactivation choice", async ({
  page,
}) => {
  const team = await openTeamStory(page, "membership-deactivate");
  await team
    .getByRole("button", { name: lifecycle.deactivate, exact: true })
    .click();
  const member = team.locator('[data-core-team-member="lucia"]');
  await expect(member).toContainText(copy.inactive);
  await expect(member).toContainText("Administración de equipo");
  await member.getByRole("button", { name: lifecycle.reactivate }).click();
  const confirm = team.getByRole("button", {
    name: lifecycle.reactivate,
    exact: true,
  });
  await expect(confirm).toBeDisabled();
  await team.getByRole("radio", { name: lifecycle.discardAssignments }).check();
  await confirm.click();
  await expect(member).toContainText(copy.active);
  await expect(member).toContainText(copy.empty);
  await openTeamStory(page, "member-removal");
  await team.getByRole("button", { name: lifecycle.remove }).click();
  await expect(team.locator('[data-core-team-member="sofia"]')).toHaveCount(0);
  await expect(team.locator('[data-core-team-member="marina"]')).toBeVisible();
});

test("an invited signed-in user explicitly accepts, with no action for expired or unavailable links", async ({
  page,
}) => {
  const team = await openTeamStory(page, "accept-invitation");
  await expect(team.getByText(lifecycle.authenticatedAs)).toBeVisible();
  await team.getByRole("button", { name: lifecycle.acceptInvitation }).click();
  await expect(
    team.getByRole("heading", { name: copy.inviteeTitle }),
  ).toBeVisible();
  for (const [story, heading] of [
    ["invitation-expired", lifecycle.invitationExpired],
    ["invitation-unavailable", lifecycle.invitationUnavailable],
  ]) {
    await openTeamStory(page, story);
    await expect(team.getByRole("heading", { name: heading })).toBeVisible();
    await expect(
      team.getByRole("button", { name: lifecycle.acceptInvitation }),
    ).toHaveCount(0);
    await expect(team.getByText(lifecycle.authenticatedAs)).toHaveCount(0);
  }
});

test("uncertain delivery can be checked and a failed or refused resend leaves the original", async ({
  page,
}) => {
  const team = await openTeamStory(page, "invitation-uncertain");
  await expect(team.getByRole("status")).toContainText(
    lifecycle.deliveryUnconfirmed,
  );
  await team
    .getByRole("button", { name: lifecycle.reviewSameDelivery })
    .click();
  await expect(team.getByRole("status")).toHaveText(copy.sent);
  await expect(
    team
      .locator("[data-core-team-invitation]")
      .filter({ hasText: "aina@huerta.example" }),
  ).toContainText(copy.pending);
  await openTeamStory(page, "resend-failed");
  const original = team.locator('[data-core-team-invitation="iv-ferran"]');
  await original
    .getByRole("button", { name: copy.resend, exact: true })
    .click();
  await expect(team.getByRole("alert")).toHaveText(lifecycle.resendFailed);
  await expect(original).toContainText("Consulta de existencias");
  await openTeamStory(page, "resend-refused");
  await original.getByRole("button", { name: lifecycle.reviewResend }).click();
  await expect(team.getByLabel(copy.email, { exact: true })).toHaveAttribute(
    "readonly",
    "",
  );
  await team.getByRole("button", { name: copy.resend, exact: true }).click();
  await expect(original).toHaveCount(0);
  await expect(team.getByRole("status")).toHaveText(copy.resent);
});

test("member and custom-role lists page independently and the Owner template stays fixed", async ({
  page,
}) => {
  const team = await openTeamStory(page, "team-paging");
  const next = team.getByRole("button", { name: lifecycle.next, exact: true });
  const previous = team.getByRole("button", {
    name: lifecycle.previous,
    exact: true,
  });
  await expect(team.locator("[data-core-team-member]")).toHaveCount(2);
  await next.click();
  await expect(team.locator('[data-core-team-member="pablo"]')).toBeVisible();
  await team.getByRole("button", { name: copy.roles, exact: true }).click();
  await next.click();
  await expect(
    team.getByText("Control previo de almacén", { exact: true }),
  ).toBeVisible();
  await expect(team.getByText(copy.owner, { exact: true })).toBeVisible();
  await previous.click();
  await expect(
    team.getByText("Consulta de existencias", { exact: true }),
  ).toBeVisible();
  await team.getByRole("button", { name: copy.members, exact: true }).click();
  await expect(team.locator('[data-core-team-member="pablo"]')).toBeVisible();
});

test("a confirmed new employee can receive a scoped custom role from Team", async ({
  page,
}) => {
  const team = await openTeamStory(page, "employee-assign-access");
  const employee = employeeMessages.es;
  await team.getByRole("button", { name: employee.title, exact: true }).click();
  const workspace = page.locator("[data-core-employee-view]");
  await workspace
    .getByRole("button", { name: employee.add, exact: true })
    .click();
  await workspace.getByLabel(employee.name, { exact: true }).fill("Ángela");
  await workspace
    .getByLabel(employee.username, { exact: true })
    .fill("Angela23");
  await choose(
    page,
    workspace.getByRole("combobox", { name: employee.administrative }),
    "Área · Centro / Sala de ventas",
  );
  await workspace
    .getByRole("button", { name: employee.add, exact: true })
    .click();
  await workspace.getByRole("button", { name: employee.handoffClose }).click();
  await workspace
    .getByRole("button", { name: employee.back, exact: true })
    .click();
  await workspace.getByRole("button", { name: employee.team }).click();
  const created = team.locator('[data-core-team-member="employee-angela23"]');
  await expect(created).toContainText(copy.empty);
  await created.getByRole("button", { name: copy.assign }).click();
  const role = team.getByRole("combobox", { name: copy.role, exact: true });
  await role.click();
  await expect(
    page.getByRole("option", { name: copy.owner, exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("option", { name: "Consulta de existencias", exact: true })
    .click();
  await choose(
    page,
    team.getByRole("combobox", { name: copy.scope, exact: true }),
    `${copy.area} · ${copy.sales}`,
  );
  await team.getByRole("button", { name: copy.assign }).click();
  await expect(created).toContainText("Consulta de existencias");
});
