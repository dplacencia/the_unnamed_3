import { expect, test, type Page } from "@playwright/test";

async function openCode(page: Page, preset: string) {
  await page.goto(
    `/iframe.html?id=backoffice-core-employee-login-code--${preset}&viewMode=story&globals=locale:es;theme:light`,
  );
  const workspace = page.locator(
    `[data-core-employee-login-code-ready="${preset}"]`,
  );
  await expect(workspace).toBeVisible();
  return workspace;
}

test("reviews the lowercased canonical code before setting it", async ({
  page,
}) => {
  const workspace = await openCode(page, "unset");
  const entry = workspace.getByRole("textbox", { name: "Código nuevo" });
  const review = workspace.getByRole("button", { name: "Revisar código" });
  await entry.fill("ábc");
  await expect(review).toBeDisabled();
  await entry.fill(" RX7");
  await expect(review).toBeDisabled();
  await entry.fill("RX7");
  await review.click();
  await expect(workspace.getByText("ana.rx7", { exact: true })).toBeVisible();
  await expect(workspace.locator("[data-current-employee-code]")).toHaveCount(
    0,
  );
  await workspace.getByRole("button", { name: "Confirmar código" }).click();
  await expect(workspace.locator("[data-current-employee-code]")).toHaveText(
    "rx7",
  );
});

test("preserves the current code on conflict and existing sessions after a confirmed change", async ({
  page,
}) => {
  const workspace = await openCode(page, "conflict");
  await expect(workspace.getByRole("alert")).toHaveText(
    "Ese código no está disponible.",
  );
  const current = workspace.locator("[data-current-employee-code]");
  await expect(current).toHaveText("huerta");
  await workspace.getByRole("textbox", { name: "Código nuevo" }).fill("rio9");
  await workspace.getByRole("button", { name: "Revisar código" }).click();
  await expect(current).toHaveText("huerta");
  await workspace.getByRole("button", { name: "Confirmar código" }).click();
  await expect(current).toHaveText("rio9");
  await expect(workspace.getByRole("status")).toContainText(
    "Las sesiones abiertas siguen activas.",
  );
  await expect(workspace.getByRole("status")).toContainText("huerta");
});
