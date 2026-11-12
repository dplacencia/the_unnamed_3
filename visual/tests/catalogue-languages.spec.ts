import { test, expect, type Page } from "@playwright/test";
import { inventory, readBuild } from "../runtime.ts";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";

const build = readBuild();
test.beforeAll(async () => {
  const response = await fetch("http://localhost:6006");
  expect(
    response.headers.get("X-Visual-Source"),
    "Current catalogue source identity",
  ).toBe(build.sourceHash);
});

async function selectLanguage(page: Page, language: string) {
  await page.getByRole("button", { name: /^Idioma de/ }).click();
  await page.getByText(language, { exact: true }).click();
}

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`sample labels and validation use ${locale}`, async ({ page }) => {
    const copy = catalogueMessages[locale];
    await page.goto(
      `http://localhost:6006/iframe.html?id=tailadmin-primitives--button&viewMode=story&globals=locale:${locale}`,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("button", { name: copy.buttonLabel, exact: true }),
    ).toBeVisible();
    await page.goto(
      `http://localhost:6006/iframe.html?id=tailadmin-compositions--form&viewMode=story&globals=locale:${locale}`,
    );
    await expect(page.getByLabel(copy.formField)).toBeVisible();
    await page.getByRole("button", { name: copy.formSubmit }).click();
    await expect(page.getByRole("alert")).toHaveText(copy.formRequired);
  });
}

test("button default follows locale and explicit custom text stays exact", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-primitives--button",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await expect(
    frame.getByRole("button", { name: "Botón de muestra", exact: true }),
  ).toBeVisible();
  await selectLanguage(page, "English");
  await expect(
    frame.getByRole("button", { name: "Sample button", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Set string", exact: true }).click();
  await page.locator("#control-label").fill("Merchant-defined label");
  await selectLanguage(page, "Català");
  await expect(
    frame.getByRole("button", { name: "Merchant-defined label", exact: true }),
  ).toBeVisible();
});

test("visible form errors translate without clearing entered values or status", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-compositions--form",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("button", { name: "Validar muestra" }).click();
  await expect(frame.getByRole("alert")).toHaveText(
    "Completa el campo de muestra",
  );
  await selectLanguage(page, "English");
  await expect(frame.getByRole("alert")).toHaveText(
    "Complete the sample field",
  );
  await frame.getByLabel("Sample technical field").fill("9007199254740993");
  await selectLanguage(page, "Català");
  await expect(frame.getByRole("textbox")).toHaveValue("9007199254740993");
  await frame.getByRole("button", { name: /Valid/ }).click();
  await selectLanguage(page, "English");
  await expect(frame.getByLabel("Sample result")).toHaveText(
    "Technical validation complete",
  );
});

test("an open dialog translates without resetting its open state", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-primitives--dialog",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame
    .getByRole("button", { name: "Abrir diálogo", exact: true })
    .click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await selectLanguage(page, "English");
  await expect(
    frame.getByRole("dialog", { name: "Sample dialog" }),
  ).toBeVisible();
  await expect(
    frame.getByRole("button", { name: "Close", exact: true }),
  ).toBeVisible();
});

test("all English examples render without Spanish fixture copy or translation errors", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>External document replaced for this technical check.</p>",
    }),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const entry of inventory.entries.filter(
    (item) => item.kind === "story",
  )) {
    await page.goto(
      `http://localhost:6006/iframe.html?id=${entry.storyId}&viewMode=story&globals=locale:en`,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const stage = page.locator("[data-visual-stage]");
    await expect(stage).toBeVisible();
    expect(await stage.innerText(), entry.id).not.toMatch(
      /muestra|técnic[oa]|opción|apartado|desactivad|pestaña|desplazamiento/i,
    );
  }
  expect(errors).toEqual([]);
});
