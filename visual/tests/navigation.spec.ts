import { expect, test, type Page } from "@playwright/test";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import {
  choosePreviewLocation,
  navigatePreview,
  openNavigation,
} from "../navigation-actions.ts";

const url = (story = "workspace", locale: Locale = "es") =>
  `http://localhost:6006/iframe.html?id=navigation-merchant-workspace--${story}&viewMode=story&globals=locale:${locale}`;
async function ready(page: Page, story = "workspace", locale: Locale = "es") {
  await page.goto(url(story, locale));
  await expect(page.locator("[data-navigation-preview]")).toBeVisible();
  await expect(page.locator("[data-visual-stage]")).toHaveAttribute(
    "data-fullscreen",
    "true",
  );
  await expect(page.locator("#storybook-error")).toBeHidden();
}

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`navigation ${locale} keeps independent choices and accessible labels`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const copy = catalogueMessages[locale];
    await ready(page, "workspace", locale);
    await expect(page.locator("[data-navigation-title]")).toHaveText(
      copy.navStock,
    );
    await expect(
      page.getByRole("button", { name: copy.navInventory, exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByLabel(copy.navLocation)).toBeVisible();
    await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
      "data-navigation-scope",
      "unselected",
    );
    await choosePreviewLocation(page, "stockroom", locale);
    await navigatePreview(page, "movements");
    await expect(page.locator("[data-navigation-title]")).toHaveText(
      copy.navMovements,
    );
    await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
      "data-navigation-scope",
      "unselected",
    );
    await choosePreviewLocation(page, "sales-floor", locale);
    await navigatePreview(page, "stock");
    await expect(page.getByLabel(copy.navLocation)).toHaveText(
      copy.navStockroom,
    );
    await expect(page.locator('[data-navigation-to="stock"]')).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page
      .getByRole("button", { name: copy.navInventory, exact: true })
      .click();
    await expect(page.locator('[data-navigation-to="stock"]')).toBeHidden();
    await expect(page.locator('[data-navigation-to="home"]')).toBeVisible();
    await expect(page.locator('[data-navigation-to="help"]')).toBeVisible();
    await page.reload();
    await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
      "data-navigation-scope",
      "stockroom",
    );
    expect(errors).toEqual([]);
  });
}

test("known denial, no module access and permission failure remain distinct", async ({
  page,
}) => {
  await ready(page, "restricted");
  await expect(page.locator("[data-navigation-denied]")).toBeVisible();
  await expect(page.locator('[data-navigation-to="stock"]')).toHaveCount(0);
  await expect(page.locator('[data-navigation-to="products"]')).toBeVisible();
  await ready(page, "no-module-access");
  await expect(
    page.getByRole("button", { name: "Inventario", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('[data-navigation-to="help"]')).toBeVisible();
  await ready(page, "permission-loading");
  await expect(page.locator("[data-navigation-loading]")).toHaveCount(2);
  await expect(page.locator("[data-navigation-denied]")).toHaveCount(0);
  await expect(page.locator("header button").last()).toBeEnabled();
  await ready(page, "permission-error");
  await expect(page.locator("[data-navigation-error]")).toHaveCount(1);
  await expect(
    page.locator('[data-sidebar="content"] [data-navigation-error]'),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-sidebar="content"] [data-navigation-retry]'),
  ).toHaveCount(0);
  await expect(page.locator("[data-navigation-denied]")).toHaveCount(0);
  await page.locator("header button").first().click();
  await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
    "data-state",
    "collapsed",
  );
  await expect
    .poll(() =>
      page
        .locator("[data-navigation-error]")
        .first()
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    )
    .toBe(true);
  await page
    .locator("[data-navigation-error] [data-navigation-retry]")
    .last()
    .click();
  await expect(page.locator("[data-navigation-error]")).toHaveCount(0);
  await expect(page.locator("[data-navigation-scope]")).toBeVisible();
});

test("compact Inventory trigger fits its rail without a right caret", async ({
  page,
}) => {
  await ready(page);
  await page.locator("header button").first().click();
  await page.mouse.move(1200, 300);
  await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
    "data-state",
    "collapsed",
  );
  const trigger = page.getByRole("button", { name: "Inventario", exact: true });
  await expect
    .poll(
      async () =>
        (await page.locator('[data-slot="sidebar"]').first().boundingBox())!
          .width,
    )
    .toBe(64);
  await expect
    .poll(() =>
      trigger.evaluate(
        (element) =>
          element.getBoundingClientRect().width <=
          element.parentElement!.getBoundingClientRect().width,
      ),
    )
    .toBe(true);
  await expect(
    trigger.locator('[data-slot="accordion-trigger-icon"]'),
  ).toHaveCount(0);
  const home = page.locator('[data-navigation-to="home"]');
  const homeBox = (await home.boundingBox())!;
  const inventoryBox = (await trigger.boundingBox())!;
  expect(homeBox.width).toBe(44);
  expect(homeBox.height).toBe(44);
  expect(inventoryBox.width).toBe(homeBox.width);
  expect(inventoryBox.height).toBe(homeBox.height);
  const homeIcon = (await home.locator("svg").boundingBox())!;
  const inventoryIcon = (await trigger.locator("svg").boundingBox())!;
  expect(inventoryIcon.width).toBe(homeIcon.width);
  expect(inventoryIcon.height).toBe(homeIcon.height);
  expect(inventoryIcon.x + inventoryIcon.width / 2).toBe(
    homeIcon.x + homeIcon.width / 2,
  );
  const rail = (await page
    .locator('[data-slot="sidebar-container"]')
    .boundingBox())!;
  const leftGap = homeBox.x - rail.x;
  const rightGap = rail.x + rail.width - homeBox.x - homeBox.width;
  expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);
  expect(
    (await page.locator("[data-navigation-preview]").boundingBox())!.x,
  ).toBe(rail.x + rail.width);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
    "data-state",
    "expanded",
  );
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('[data-navigation-to="stock"]')).toBeVisible();
  await expect(
    trigger.locator('[data-slot="accordion-trigger-icon"]'),
  ).toBeVisible();
  expect((await trigger.locator("svg").first().boundingBox())!.width).toBe(
    (await home.locator("svg").boundingBox())!.width,
  );
});

test("one compact toolbar contains visible page controls without a second header row", async ({
  page,
}) => {
  await ready(page);
  const header = page.locator("header");
  await expect(header.locator("[data-navigation-title]")).toHaveText(
    catalogueMessages.es.navStock,
  );
  await expect(header.locator("[data-navigation-location]")).toBeVisible();
  expect((await header.boundingBox())!.height).toBeLessThanOrEqual(56);
  expect(
    (await header.locator("[data-navigation-location]").boundingBox())!.height,
  ).toBe(36);
  await page.mouse.move(1200, 300);
  await expect(header.locator("button").first()).toBeVisible();
  await expect(header.locator("button").last()).toBeVisible();
  for (const button of [
    header.locator("button").first(),
    header.locator("button").last(),
  ]) {
    expect((await button.boundingBox())!.width).toBe(36);
    expect((await button.locator("svg").boundingBox())!.width).toBe(16);
    await expect(button).toHaveCSS("border-top-width", "0px");
  }
  await navigatePreview(page, "products");
  expect(
    (await page.locator("[data-navigation-content]").boundingBox())!.y,
  ).toBeLessThanOrEqual(88);
});

test("Products frame leaves space for dense content without shrinking controls", async ({
  page,
}) => {
  await ready(page);
  await navigatePreview(page, "products");
  const content = page.locator("[data-navigation-content]");
  expect((await content.boundingBox())!.y).toBeLessThanOrEqual(160);
  await expect(
    page.getByText(catalogueMessages.es.navPreview, { exact: true }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 1920, height: 1080 });
  const available = (await page
    .locator("[data-navigation-preview]")
    .boundingBox())!.width;
  expect((await content.boundingBox())!.width).toBeGreaterThanOrEqual(
    available - 32,
  );
  await navigatePreview(page, "stock");
  expect(
    (await page.locator("[data-navigation-location]").boundingBox())!.height,
  ).toBe(36);
});

test("a sole location is visible and independent tabs do not share page choices", async ({
  page,
  context,
}) => {
  await ready(page, "sole-location");
  await expect(page.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "sales-floor",
  );
  await ready(page);
  await choosePreviewLocation(page, "stockroom", "es");
  const second = await context.newPage();
  await ready(second);
  await expect(second.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "unselected",
  );
  const popupOpened = page.waitForEvent("popup");
  await page.evaluate((target) => window.open(target, "_blank"), url());
  const popup = await popupOpened;
  await expect(popup.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "unselected",
  );
  await page.close();
  const afterClose = await context.newPage();
  await ready(afterClose);
  await expect(afterClose.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "unselected",
  );
});

for (const width of [390, 768]) {
  test(`navigation drawer at ${width}px closes on destination choice and Escape restores focus`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    const trigger = page.locator("header button").first();
    await openNavigation(page);
    await expect(page.locator('[data-navigation-to="help"]')).toBeVisible();
    await navigatePreview(page, "products");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("[data-navigation-title]")).toHaveText(
      catalogueMessages.es.navProducts,
    );
    await trigger.focus();
    await trigger.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflows).toBe(false);
  });
}

test("Storybook language changes and manager reload retain the page choice", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/navigation-merchant-workspace--workspace",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("[data-navigation-location]").click();
  await frame
    .getByRole("option", {
      name: catalogueMessages.es.navStockroom,
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /^Idioma de/ }).click();
  await page.getByText("English", { exact: true }).click();
  await expect(frame.locator("[data-navigation-title]")).toHaveText(
    catalogueMessages.en.navStock,
  );
  await expect(frame.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "stockroom",
  );
  await page.reload();
  await expect(frame.locator("[data-navigation-scope]")).toHaveAttribute(
    "data-navigation-scope",
    "stockroom",
  );
});

for (const width of [1440, 768, 390]) {
  test(`shared footer folds with keyboard at ${width}px and preserves access to its links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    await expect(page.locator("[data-navigation-location]")).toHaveCSS(
      "height",
      width < 1280 ? "44px" : "36px",
    );
    await openNavigation(page);
    const toggle = page.getByRole("button", {
      name: "Más opciones",
      exact: true,
    });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-navigation-to="help"]')).toBeVisible();
    await toggle.focus();
    await toggle.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator('[data-navigation-to="help"]')).toBeHidden();
    await toggle.press("Enter");
    await expect(page.locator('[data-navigation-to="help"]')).toBeVisible();
    await navigatePreview(page, "help");
    await expect(page.locator("[data-navigation-title]")).toHaveText(
      catalogueMessages.es.navHelp,
    );
    if (width < 1280) {
      await expect(page.locator("header button").first()).toHaveCSS(
        "width",
        "44px",
      );
      await expect(page.locator("header button").last()).toHaveCSS(
        "width",
        "44px",
      );
    }
  });
}
