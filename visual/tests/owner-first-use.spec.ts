import { expect, test, type Page } from "@playwright/test";
import { coreHierarchyMessages } from "../../apps/backoffice/.storybook/stories/core-hierarchy-messages";
import { ownerJourneyMessages } from "../../apps/backoffice/.storybook/stories/owner-journey-messages";
import { navigatePreview } from "../navigation-actions";

const storeArea = "Sala de ventas";
const storeSite = "Centro principal";
const qualifiedArea = `${storeArea} · ${storeSite}`;
const stockSetup = ownerJourneyMessages.es.stockSetup;

type Story =
  | "current"
  | "first-visit"
  | "one-area"
  | "choose-area"
  | "no-active-area"
  | "trial-paused"
  | "access-unavailable";

type Locale = keyof typeof coreHierarchyMessages;

async function open(page: Page, story: Story, locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=core-first-use-guidance--${story}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "home",
  );
}

function nextAction(page: Page) {
  return page
    .locator("[data-owner-first-use]")
    .locator("[data-owner-journey-start]");
}

function stockPanel(page: Page) {
  return page.locator('[data-owner-journey-panel="stock"]');
}

test("first-use Inicio offers one localized action to create the first site on a narrow phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await open(page, "current");
  await expect(page.locator("[data-owner-journey-start]")).toBeVisible();
  await expect(page.locator("[data-owner-first-use]")).toHaveCount(0);

  for (const locale of ["en", "ca", "gl", "eu", "es"] as const) {
    await test.step(locale, async () => {
      await open(page, "first-visit", locale);
      const action = nextAction(page);
      await expect(action).toHaveCount(1);
      await expect(action).toBeInViewport();
      await expect(action).toHaveAccessibleName(
        coreHierarchyMessages[locale].newSite,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(320);
    });
  }

  await nextAction(page).click();
  await expect(page.locator("[data-owner-journey-sites]")).toBeVisible();
  await expect(
    page
      .locator("[data-core-hierarchy-editor]")
      .getByLabel("Nombre del centro"),
  ).toBeVisible();
});

test("one eligible area opens setup for the exact named area and still requires confirmation", async ({
  page,
}) => {
  await open(page, "one-area");
  const guidance = page.locator("[data-owner-first-use]");
  await expect(guidance).toContainText(qualifiedArea);
  const action = nextAction(page);
  await expect(action).toHaveCount(1);
  await expect(stockPanel(page)).toHaveCount(0);
  await action.click();

  const panel = stockPanel(page);
  await expect(panel).toBeVisible();
  await expect(panel.getByText(storeSite, { exact: true })).toBeVisible();
  await expect(panel.getByText(storeArea, { exact: true })).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Confirmar", exact: true }),
  ).toBeDisabled();
});

test("multiple eligible areas open the list and wait for an explicit area selection", async ({
  page,
}) => {
  await open(page, "choose-area");
  const action = nextAction(page);
  await expect(action).toHaveCount(1);
  await action.click();

  const setup = page.locator("[data-owner-journey-setup]");
  await expect(setup).toBeVisible();
  await expect(stockPanel(page)).toHaveCount(0);
  const setupActions = setup.getByRole("button", {
    name: stockSetup,
    exact: true,
  });
  await expect(setupActions.nth(1)).toBeVisible();
  await setup
    .getByRole("listitem")
    .filter({ hasText: qualifiedArea })
    .getByRole("button", { name: stockSetup, exact: true })
    .click();
  await expect(
    stockPanel(page).getByText(storeArea, { exact: true }),
  ).toBeVisible();
});

test("without active areas the next action lands in Core business settings", async ({
  page,
}) => {
  await open(page, "no-active-area");
  const action = nextAction(page);
  await expect(action).toHaveCount(1);
  await action.click();

  await expect(page.locator("[data-navigation-preview]")).toHaveAttribute(
    "data-navigation-page",
    "business-settings",
  );
  await expect(page.locator("[data-owner-journey-sites]")).toBeVisible();
  await expect(stockPanel(page)).toHaveCount(0);
});

test("paused and unavailable Inventory leave Core settings accessible", async ({
  page,
}) => {
  for (const [story, status] of [
    ["trial-paused", "Acceso a Inventario pausado"],
    ["access-unavailable", "No se ha podido consultar el acceso a Inventario"],
  ] as const) {
    await test.step(story, async () => {
      await open(page, story);
      await expect(
        page.locator("[data-merchant-inventory-access]"),
      ).toContainText(status);
      await expect(
        page.getByRole("button", { name: "Inventario", exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: stockSetup, exact: true }),
      ).toHaveCount(0);
      await navigatePreview(page, "business-settings");
      await expect(page.locator("[data-owner-journey-sites]")).toBeVisible();
      await expect(stockPanel(page)).toHaveCount(0);
    });
  }
});
