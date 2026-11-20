import { expect, test, type Page } from "@playwright/test";
import { coreMerchantMessages } from "../../apps/backoffice/.storybook/stories/core-merchant-workspace-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

const copy = coreMerchantMessages.es;

async function openMerchantStory(
  page: Page,
  story: string,
  locale: Locale = "es",
  theme: "light" | "dark" = "light",
) {
  await page.goto(
    `/iframe.html?id=core-merchant-workspace--${story}&viewMode=story&globals=locale:${locale};theme:${theme}`,
  );
  await expect(page.locator("[data-core-merchant-view]")).toBeVisible();
}

test("session handoff leads to the chooser and its returned business pages", async ({
  page,
}) => {
  await openMerchantStory(page, "sign-in");
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: copy.signIn }).click();
  await expect(
    page.getByRole("heading", { name: copy.businesses }),
  ).toBeVisible();
  await page.getByRole("button", { name: copy.next }).click();
  await expect(
    page.getByRole("button", { name: /Mercado del barrio/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: copy.next })).toHaveCount(0);
  await page.getByRole("button", { name: copy.previous }).click();
  await page.getByRole("button", { name: /Alimentación Plaza/ }).click();
  await expect(
    page.getByRole("heading", { name: "Alimentación Plaza" }),
  ).toBeVisible();
  await page.getByRole("button", { name: copy.changeBusiness }).click();
  await expect(
    page.getByRole("heading", { name: copy.businesses }),
  ).toBeVisible();
});

test("creator-name review validates the fields and accepts explicit last-name absence", async ({
  page,
}) => {
  await openMerchantStory(page, "new-business");
  await expect(page.getByLabel(copy.firstName, { exact: true })).toHaveCount(0);
  await openMerchantStory(page, "new-business-with-creator-names");
  await expect(page.getByLabel(copy.firstName, { exact: true })).toHaveValue(
    "Marina",
  );
  const lastName = page.getByLabel(copy.lastName, { exact: true });
  await expect(lastName).toHaveValue("Soler");
  await page.getByLabel(copy.name, { exact: true }).fill("Comercio de prueba");
  await lastName.fill("  ");
  await page.getByRole("button", { name: copy.createBusiness }).click();
  await expect(lastName).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("checkbox", { name: copy.noLastName }).check();
  await expect(lastName).toBeDisabled();
  await page.getByRole("button", { name: copy.createBusiness }).click();
  await expect(page.getByRole("heading", { name: copy.pending })).toBeVisible();
});

test("separates a failed readiness read from a confirmed blocked or ready business", async ({
  page,
}) => {
  await openMerchantStory(page, "creation-pending");
  await page.getByRole("button", { name: copy.checkReadiness }).click();
  await expect(
    page.getByRole("heading", { name: copy.unavailable }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: copy.enter })).toHaveCount(0);
  await page.getByRole("button", { name: copy.retry }).click();
  await expect(page.getByRole("heading", { name: copy.ready })).toBeVisible();
  await page.getByRole("button", { name: copy.enter }).click();
  await expect(
    page.locator('[data-core-merchant-view="workspace"]'),
  ).toBeVisible();

  await openMerchantStory(page, "creation-blocked");
  await page.getByRole("button", { name: copy.checkReadiness }).click();
  await expect(page.getByRole("heading", { name: copy.blocked })).toBeVisible();
  await expect(page.getByRole("button", { name: copy.enter })).toHaveCount(0);
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`creator-name review fits a narrow phone in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await openMerchantStory(
      page,
      "new-business-with-creator-names",
      locale,
      "dark",
    );
    const messages = coreMerchantMessages[locale];
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute(
      "data-color-scheme",
      "dark",
    );
    await expect(page.getByLabel(messages.name, { exact: true })).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: messages.noLastName }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: messages.createBusiness }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  });
}
