import { expect, test, type Page } from "@playwright/test";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";
import { creationMessages } from "../../apps/backoffice/.storybook/stories/products-creation-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import { creationForm, fillCreationForm } from "../products-creation-actions";

const workspace = (page: Page) => page.locator("[data-creation-workspace]");
const panel = (page: Page) => page.locator("[data-creation-panel]");
const browsing = (page: Page) => page.locator("[data-products-browsing]");
const rows = (page: Page) => browsing(page).locator("table [data-product-id]");

async function ready(page: Page, story = "catalogue", locale: Locale = "es") {
  await page.goto(
    `/iframe.html?id=inventory-product-creation--${story}&viewMode=story&globals=locale:${locale};theme:light`,
  );
  await expect(page.locator("[data-creation-open]")).toBeVisible();
  await expect(browsing(page)).toHaveAttribute("data-browsing-state", "ready");
}

async function search(page: Page, value: string) {
  const input = page.getByRole("searchbox");
  await input.fill(value);
  await input.press("Enter");
  await expect(browsing(page)).toHaveAttribute(
    "data-browsing-settled-query",
    value,
  );
  await expect(browsing(page)).toHaveAttribute("data-browsing-state", "ready");
}

test("product creation opens a simple blank draft from Productos", async ({
  page,
}) => {
  await ready(page);
  await page.locator("[data-creation-open]").click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "form");
  await expect(page.locator("[data-creation-name]")).toHaveValue("");
  await expect(page.locator("[data-creation-unit]")).toHaveValue("");
  await expect(page.locator("[data-creation-step]")).toBeHidden();
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "0",
  );
});

test("product creation requires a name and explicit unit before submission", async ({
  page,
}) => {
  await ready(page);
  const form = creationForm(page);
  await form.open.click();
  await form.submit.click();
  await expect(form.name).toBeFocused();
  await expect(form.name).toHaveAttribute("aria-invalid", "true");
  await form.name.fill("Tomate pera");
  await form.submit.click();
  await expect(form.unit).toBeFocused();
  await expect(form.unit).toHaveAttribute("aria-invalid", "true");
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "0",
  );
});

test("product creation reviews an old custom step when its measurement unit changes", async ({
  page,
}) => {
  await ready(page);
  const form = creationForm(page);
  await fillCreationForm(page);
  await form.advanced.click();
  await form.custom.click();
  await form.step.fill("0,025");
  await form.advanced.click();
  await expect(form.step).toBeHidden();
  await form.advanced.click();
  await expect(form.step).toHaveValue("0,025");

  await form.unit.selectOption("g");
  await expect(form.review).toContainText("0,025");
  await expect(form.review).toContainText(/kg|kilogramo/i);
  await expect(form.unit).toHaveValue("g");
  await form.advanced.click();
  await expect(form.review).toBeHidden();
  await form.submit.click();
  await expect(form.review).toBeVisible();
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "0",
  );
  await form.standard.click();
  await expect(form.review).toBeHidden();
  await expect(form.name).toHaveValue("Tomate pera");
  await form.submit.click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "confirmed");
});

test("product creation confirms in the same panel and preserves the filtered page", async ({
  page,
}) => {
  await ready(page);
  await search(page, "Café molido");
  await page.locator("[data-products-filter-trigger]").click();
  await page
    .getByRole("checkbox", { name: catalogueMessages.es.pfIncludeArchived })
    .check();
  await page.locator("[data-products-filter-apply]").click();
  const archiveFilter = page.locator("[data-products-applied-filters]");
  await expect(archiveFilter).toContainText(
    catalogueMessages.es.pfIncludeArchived,
  );
  await page.locator("[data-browsing-next]").click();
  const pageNumber = page.locator("[data-browsing-page]");
  await expect(pageNumber).toHaveAttribute("data-page-number", "2");
  const visibleIds = () =>
    rows(page).evaluateAll((items) =>
      items.map((item) => item.getAttribute("data-product-id")),
    );
  const before = await visibleIds();

  await fillCreationForm(page);
  await creationForm(page).submit.click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "confirmed");
  await expect(panel(page)).toContainText(creationMessages.es.created);
  await expect(panel(page)).toContainText("Tomate pera");
  await page.locator("[data-creation-close]").click();
  await expect(panel(page)).toBeHidden();
  await expect(page.getByRole("searchbox")).toHaveValue("Café molido");
  await expect(archiveFilter).toContainText(
    catalogueMessages.es.pfIncludeArchived,
  );
  await expect(pageNumber).toHaveAttribute("data-page-number", "2");
  await expect.poll(visibleIds).toEqual(before);
  await search(page, "Tomate pera");
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toContainText("Tomate pera");
});

test("product creation keeps or discards unsent edits by explicit keyboard action", async ({
  page,
}) => {
  await ready(page);
  await fillCreationForm(page);
  await page.keyboard.press("Escape");
  const keep = page.locator("[data-creation-continue-editing]");
  await expect(keep).toBeVisible();
  await keep.focus();
  await page.keyboard.press("Enter");
  await expect(keep).toBeHidden();
  await expect(creationForm(page).name).toHaveValue("Tomate pera");
  await page.keyboard.press("Escape");
  const discard = page.locator("[data-creation-discard]");
  await discard.focus();
  await page.keyboard.press("Enter");
  await expect(panel(page)).toBeHidden();
  const form = creationForm(page);
  await expect(form.open).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(form.name).toHaveValue("");
  await expect(form.unit).toHaveValue("");
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "0",
  );
});

test("product creation keeps uncertainty after three requests and retries only on demand", async ({
  page,
}) => {
  await ready(page, "recovery");
  await fillCreationForm(page);
  await creationForm(page).submit.click();
  await expect(panel(page)).toHaveAttribute(
    "data-creation-panel",
    "unconfirmed",
  );
  await expect(panel(page)).toContainText(creationMessages.es.unconfirmed);
  await expect(panel(page)).not.toContainText(creationMessages.es.created);
  await expect(workspace(page)).toHaveAttribute("data-creation-run", "1");
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "3",
  );
  await page.locator("[data-creation-retry]").click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "confirmed");
  await expect(workspace(page)).toHaveAttribute("data-creation-run", "2");
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "4",
  );
  await expect(panel(page)).toContainText("Tomate pera");
});

test("product creation restores the fixture record without dispatch until explicitly resumed", async ({
  page,
}) => {
  await ready(page, "restored");
  const resume = page.locator("[data-creation-resume]");
  await expect(resume).toBeVisible();
  await expect(
    workspace(page).getByText(creationMessages.es.unconfirmed, { exact: true }),
  ).toBeVisible();
  await expect(panel(page)).toBeHidden();
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "0",
  );
  await resume.click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "confirmed");
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "1",
  );
  await expect(panel(page)).toContainText(creationMessages.es.created);
});

test("product creation memory fallback preserves retry and discloses refresh limits", async ({
  page,
}) => {
  await ready(page, "memory-only");
  await fillCreationForm(page);
  await creationForm(page).submit.click();
  await expect(panel(page)).toHaveAttribute(
    "data-creation-panel",
    "unconfirmed",
  );
  await expect(page.locator("[data-creation-memory]")).toHaveText(
    creationMessages.es.memory,
  );
  await page.locator("[data-creation-retry]").click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "confirmed");
});

test("product creation authoritative rejection ends the retry run", async ({
  page,
}) => {
  await ready(page, "rejected");
  await fillCreationForm(page);
  await creationForm(page).submit.click();
  await expect(panel(page)).toHaveAttribute("data-creation-panel", "rejected");
  await expect(panel(page)).toContainText(creationMessages.es.rejected);
  await expect(page.locator("[data-creation-retry]")).toBeHidden();
  await expect(workspace(page)).toHaveAttribute(
    "data-creation-request-count",
    "1",
  );
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`product creation ${locale} phone form has labelled inputs and fills the screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, "catalogue", locale);
    const form = creationForm(page);
    const copy = creationMessages[locale];
    await expect(form.open).toHaveAccessibleName(copy.open);
    await form.open.click();
    const dialog = page.getByRole("dialog", { name: copy.title, exact: true });
    await expect(form.name).toHaveAccessibleName(copy.name);
    await expect(form.unit).toHaveAccessibleName(copy.unit);
    await expect(form.submit).toHaveAccessibleName(copy.submit);
    await expect
      .poll(async () => (await dialog.boundingBox())?.width)
      .toBeCloseTo(390, 0);
    await expect
      .poll(async () => (await dialog.boundingBox())?.x)
      .toBeCloseTo(0, 0);
    await form.advanced.click();
    await expect(form.advanced).toHaveAttribute("aria-expanded", "true");
    await expect(form.submit).toBeInViewport();
    await expect(dialog).toBeVisible();
    // Check the form itself does not introduce horizontal document scrolling.
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(390);
  });
}
