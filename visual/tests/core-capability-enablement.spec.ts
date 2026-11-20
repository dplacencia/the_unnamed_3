import { expect, test, type Page } from "@playwright/test";
import { capabilityEnablementMessages } from "../../apps/backoffice/.storybook/stories/core-capability-enablement-messages";

const t = capabilityEnablementMessages("es");

async function workspace(page: Page, fixture: string, locale = "es") {
  await page.goto(
    `/iframe.html?id=core-capability-enablement--${fixture}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  const surface = page.locator(
    `[data-core-capability-enablement-ready="${fixture}"]`,
  );
  await expect(surface).toBeVisible();
  return surface;
}

test("enablement opens in Explorar módulos and changes only the confirmed Stock capability", async ({
  page,
}) => {
  const surface = await workspace(page, "explore");
  const catalogue = surface.locator('[data-core-capability="catalogue"]');
  const stock = surface.locator('[data-core-capability="stock"]');
  const pricing = surface.locator('[data-core-capability="pricing"]');
  await expect(catalogue).toHaveAttribute("data-enabled", "false");
  await surface
    .getByRole("button", { name: t("activateAction", t("stock")) })
    .click();
  await expect(
    surface.locator('[data-core-capability-outcome="confirmed"]'),
  ).toContainText(t("activated", t("stock")));
  await expect(stock).toHaveAttribute("data-enabled", "true");
  await expect(catalogue).toHaveAttribute("data-enabled", "false");
  await expect(pricing).toHaveAttribute("data-enabled", "false");
});

test("the Pricing dependency refuses activation and Catalogue deactivation without cascading", async ({
  page,
}) => {
  const surface = await workspace(page, "explore");
  const catalogue = surface.locator('[data-core-capability="catalogue"]');
  const pricing = surface.locator('[data-core-capability="pricing"]');
  const activatePricing = surface.getByRole("button", {
    name: t("activateAction", t("pricing")),
  });
  await activatePricing.click();
  await expect(surface.getByRole("alert")).toContainText(
    t("requiresCatalogue"),
  );
  await expect(pricing).toHaveAttribute("data-enabled", "false");
  await surface
    .getByRole("button", { name: t("activateAction", t("catalogue")) })
    .click();
  await activatePricing.click();
  await surface
    .getByRole("button", { name: t("deactivateAction", t("catalogue")) })
    .click();
  await expect(surface.getByRole("alert")).toContainText(t("usedByPricing"));
  await expect(catalogue).toHaveAttribute("data-enabled", "true");
  await expect(pricing).toHaveAttribute("data-enabled", "true");
});

test("provider outage and unavailable management authority keep separate meanings", async ({
  page,
}) => {
  const outage = await workspace(page, "provider-unavailable");
  await expect(outage.locator("[data-core-capability-provider]")).toContainText(
    t("providerTitle"),
  );
  await expect(
    outage.locator('[data-core-capability="catalogue"]'),
  ).toHaveAttribute("data-enabled", "true");
  await expect(
    outage.locator('[data-core-capability="stock"]'),
  ).toHaveAttribute("data-enabled", "true");
  await outage
    .getByRole("button", { name: t("deactivateAction", t("stock")) })
    .click();
  await expect(
    outage.locator('[data-core-capability="stock"]'),
  ).toHaveAttribute("data-enabled", "false");
  await expect(outage.locator("[data-core-capability-provider]")).toBeVisible();

  const unavailable = await workspace(page, "management-unavailable");
  await expect(unavailable.getByRole("alert")).toContainText(
    t("lastConfirmed"),
  );
  await expect(unavailable.getByRole("button")).toHaveCount(0);
  const readOnly = await workspace(page, "read-only");
  await expect(readOnly.getByRole("status")).toHaveText(t("readOnly"));
  await expect(readOnly.getByRole("button")).toHaveCount(0);
});

test("capability controls fit a narrow phone in all five locales", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    const surface = await workspace(page, "prerequisite-blocked", locale);
    const local = capabilityEnablementMessages(locale);
    await expect(surface.getByRole("alert")).toContainText(
      local("requiresCatalogue"),
    );
    await expect(
      surface.getByRole("button", {
        name: local("activateAction", local("stock")),
      }),
    ).toBeVisible();
    const width = await surface.evaluate((element) => ({
      scroll: element.scrollWidth,
      layout: element.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.layout);
  }
});
