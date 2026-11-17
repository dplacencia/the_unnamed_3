import { expect, type Page } from "@playwright/test";
import { catalogueMessages } from "../apps/backoffice/.storybook/catalogue-messages";
import type { Locale } from "../apps/backoffice/src/i18n/configuration";
import { navigatePreview } from "./navigation-actions";

export async function productsAction(
  page: Page,
  action: string,
  locale: Locale,
): Promise<void> {
  const text = catalogueMessages[locale];
  if (action.startsWith("products-browsing-")) {
    await browsingAction(page, action, locale);
    return;
  }
  if (action.startsWith("products-recovery-")) {
    await recoveryAction(page, action, locale);
    return;
  }
  if (action.startsWith("products-filters-")) {
    await filtersAction(page, action, locale);
    return;
  }
  const selectLocation = async () => {
    await page
      .getByRole("checkbox", { name: text.gridShowStock, exact: true })
      .check();
    await page.locator("[data-products-location]").click();
    await page
      .getByRole("option", { name: text.navSalesFloor, exact: true })
      .click();
  };
  switch (action) {
    case "products-archived-expanded":
      await productsAction(page, "products-filters-archived", locale);
      await productsAction(page, "products-expanded", locale);
      break;
    case "products-results-dismissed":
    case "products-mixed-results-dismissed":
    case "products-unconfirmed-results-dismissed":
    case "products-panel-results-dismissed": {
      const source =
        action === "products-results-dismissed"
          ? "products-editing-saved"
          : action === "products-mixed-results-dismissed"
            ? "products-editing-results"
            : action === "products-unconfirmed-results-dismissed"
              ? "products-editing-unconfirmed"
              : "products-editing-panel-results";
      await productsAction(page, source, locale);
      await page
        .getByRole("button", {
          name: `${text.gridDetails}: ${text.peDismissResults}`,
          exact: true,
        })
        .click();
      await expect(page.locator("[data-edit-results-collapsed]")).toBeVisible();
      break;
    }
    case "products-editing":
    case "products-editing-invalid":
    case "products-editing-guard":
    case "products-editing-saved":
    case "products-editing-results":
    case "products-editing-unconfirmed":
    case "products-editing-stock": {
      if (action === "products-editing-stock") await selectLocation();
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-1"]')
        .fill(
          action === "products-editing-invalid" ? " " : "Café de especialidad",
        );
      if (action !== "products-editing-unconfirmed")
        await page
          .locator('[data-edit-name="product-2"]')
          .fill("Azúcar moreno");
      if (
        [
          "products-editing-invalid",
          "products-editing-saved",
          "products-editing-results",
          "products-editing-unconfirmed",
        ].includes(action)
      ) {
        await page.locator("[data-edit-save]").click();
        if (action === "products-editing-invalid")
          await expect(
            page.locator('[data-edit-error="product-1-name"]'),
          ).toBeVisible();
        else await expect(page.locator("[data-edit-results]")).toBeVisible();
      }
      if (action === "products-editing-guard") {
        await page.locator("[data-edit-exit]").click();
        await expect(page.locator("[data-edit-guard]")).toBeVisible();
      }
      await page.locator("[data-products-scroll]").evaluate((element) => {
        element.scrollTop = 0;
      });
      break;
    }
    case "products-editing-hidden-error": {
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page.locator('[data-edit-name="product-1"]').fill(" ");
      await page.getByRole("searchbox").fill("000002");
      await page.getByRole("searchbox").press("Enter");
      await page.locator("[data-edit-save]").click();
      await page.locator('[data-edit-review="product-1-name"]').click();
      await expect(page.locator('[data-edit-name="product-1"]')).toBeVisible();
      break;
    }
    case "products-editing-panel":
    case "products-editing-panel-results": {
      await page
        .locator('[data-product-id="product-8"] [data-product-name]')
        .click();
      await page
        .getByRole("button", { name: text.peEdit, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-8"]')
        .fill("Chocolate artesanal");
      await page
        .getByRole("button", { name: text.peAssignSku, exact: true })
        .click();
      await page.locator('[data-edit-sku="product-8"]').fill("000008");
      if (action === "products-editing-panel-results") {
        await page.locator("[data-edit-save]").click();
        await expect(page.locator("[data-edit-results]")).toBeVisible();
      } else {
        // Capture the approved overview with no field active. Replacing the
        // assignment trigger schedules popup focus restoration, racing fill().
        await page.locator('[data-slot="sheet-title"]').click();
        await expect(
          page.locator('[data-edit-sku="product-8"]'),
        ).not.toBeFocused();
      }
      break;
    }
    case "products-expanded":
      await page.locator('[data-product-expand="product-1"]').click();
      await page.locator('[data-product-expand="product-2"]').click();
      await expect(page.locator("[data-product-summary]")).toHaveCount(2);
      break;
    case "products-panel":
      await page
        .locator('[data-product-id="product-1"] [data-product-name]')
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      break;
    case "products-view":
      await page
        .getByRole("button", { name: text.gridView, exact: true })
        .click();
      await expect(
        page.getByRole("checkbox", { name: text.gridSku, exact: true }),
      ).toBeVisible();
      break;
    case "products-empty":
      await page.getByRole("searchbox").fill("__no_product_matches__");
      await page.getByRole("searchbox").press("Enter");
      await expect(
        page.getByText(text.ptNoResults, { exact: true }),
      ).toBeVisible();
      break;
    case "products-location":
      await selectLocation();
      break;
    case "products-expanded-stock":
      await selectLocation();
      await page.locator('[data-product-expand="product-1"]').click();
      break;
    case "products-location-options":
      await page.locator("[data-products-location]").click();
      await expect(page.getByRole("option")).toHaveCount(2);
      break;
    case "products-scrolled": {
      await selectLocation();
      const target = page.locator(
        '[data-product-id="product-1"] [data-products-column="product"]',
      );
      const before = await target.boundingBox();
      await page.locator("[data-products-scroll]").evaluate((element) => {
        element.scrollLeft = 320;
      });
      if ((page.viewportSize()?.width ?? 1440) < 640)
        expect(
          Math.abs((await target.boundingBox())!.x - before!.x),
        ).toBeLessThan(2);
      break;
    }
    default:
      throw new Error(`Unknown Products action: ${action}`);
  }
}

async function browsingAction(page: Page, action: string, locale: Locale) {
  const text = catalogueMessages[locale];
  const root = page.locator("[data-products-browsing]");
  const rows = page.locator("[data-products-preview] table [data-product-id]");
  const state = (phase: "ready" | "loading" | "technical" | "unusable") =>
    expect(root).toHaveAttribute("data-browsing-state", phase);
  const generation = async () =>
    Number(await root.getAttribute("data-browsing-read-generation"));
  const read = async (
    trigger: () => Promise<unknown>,
    phase: "ready" | "loading" | "technical" = "ready",
  ) => {
    const previous = await generation();
    await trigger();
    await expect.poll(generation).toBeGreaterThan(previous);
    await state(phase);
  };
  const next = (phase: "ready" | "loading" | "technical" = "ready") =>
    read(() => page.locator("[data-browsing-next]").click(), phase);
  const view = () =>
    page.getByRole("button", { name: text.gridView, exact: true }).click();
  const stock = async () => {
    const toggle = page.getByRole("checkbox", {
      name: text.gridShowStock,
      exact: true,
    });
    if (!(await toggle.isChecked())) await read(() => toggle.check());
    await page.locator("[data-products-location]").click();
    await read(() =>
      page
        .getByRole("option", { name: text.navSalesFloor, exact: true })
        .click(),
    );
    await expect(root).toHaveAttribute(
      "data-browsing-settled-location",
      "sales-floor",
    );
  };
  const offPage = async (invalid = false) => {
    const id = await rows.first().getAttribute("data-product-id");
    if (!id) throw new Error("The browsing fixture has no product to edit");
    await page
      .getByRole("button", { name: text.peEditTable, exact: true })
      .click();
    await page
      .locator(`[data-edit-name="${id}"]`)
      .fill(invalid ? " " : "Producto revisado en otra página");
    await next();
    await expect(page.locator(`[data-product-id="${id}"]`)).toHaveCount(0);
    await expect(page.locator("[data-browsing-off-page-edits]")).toBeVisible();
    return id;
  };

  await expect(root).toBeVisible();
  switch (action) {
    case "products-browsing-initial-loading":
      await state("loading");
      await expect(rows).toHaveCount(0);
      return;
    case "products-browsing-initial-error":
      await state("technical");
      await expect(page.locator("[data-browsing-retry]")).toBeVisible();
      return;
    case "products-browsing-retry":
      await state("technical");
      await read(() => page.locator("[data-browsing-retry]").click());
      return;
    case "products-browsing-unusable":
      await state("unusable");
      await expect(page.locator("[data-browsing-restart]")).toBeVisible();
      return;
    case "products-browsing-restart":
      await state("unusable");
      await read(() => page.locator("[data-browsing-restart]").click());
      return;
  }

  await state("ready");
  switch (action) {
    case "products-browsing-ready":
      break;
    case "products-browsing-next":
      await next();
      break;
    case "products-browsing-view":
      await view();
      await expect(page.locator("[data-browsing-page-size]")).toBeVisible();
      break;
    case "products-browsing-hidden-sort":
      await read(() =>
        page.getByRole("button", { name: text.gridSku, exact: true }).click(),
      );
      await next();
      await view();
      await page
        .getByRole("checkbox", { name: text.gridSku, exact: true })
        .uncheck();
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-browsing-hidden-sort]")).toBeVisible();
      break;
    case "products-browsing-size25":
      await view();
      await page.locator("[data-browsing-page-size]").click();
      await read(() =>
        page.getByRole("option", { name: "25", exact: true }).click(),
      );
      await page.keyboard.press("Escape");
      await expect(rows).toHaveCount(25);
      break;
    case "products-browsing-stock":
      await stock();
      break;
    case "products-browsing-stock-positive":
      await stock();
      await page.locator("[data-products-filter-trigger]").click();
      await page
        .locator("[data-products-filters]")
        .getByRole("checkbox", { name: text.pfPositiveStockOnly, exact: true })
        .check();
      await read(() => page.locator("[data-products-filter-apply]").click());
      await expect(
        page.locator('[data-products-filter-remove="positiveStockOnly"]'),
      ).toBeVisible();
      await page.mouse.move(1, 1);
      await page.keyboard.press("Escape");
      break;
    case "products-browsing-previous-results":
      await next("loading");
      await expect(
        page.locator("[data-browsing-previous-results]"),
      ).toBeVisible();
      break;
    case "products-browsing-later-error":
      await next("technical");
      await expect(
        page.locator("[data-browsing-previous-results]"),
      ).toBeVisible();
      break;
    case "products-browsing-offpage":
      await offPage();
      break;
    case "products-browsing-offpage-review": {
      const id = await offPage();
      await page
        .getByRole("button", { name: text.pbReviewEdits, exact: true })
        .click();
      await page.locator(`[data-edit-draft-review="${id}-name"]`).click();
      await expect(page.locator(".products-hidden-field-review")).toBeVisible();
      break;
    }
    case "products-browsing-invalid-offpage": {
      const id = await offPage(true);
      await page.locator("[data-edit-save]").click();
      await page.locator(`[data-edit-review="${id}-name"]`).click();
      await expect(page.locator(".products-hidden-field-review")).toBeVisible();
      break;
    }
    case "products-browsing-mixed": {
      await offPage();
      const id = await rows.first().getAttribute("data-product-id");
      if (!id)
        throw new Error("The second browsing group has no product to edit");
      await page
        .locator(`[data-edit-name="${id}"]`)
        .fill("Segundo producto revisado");
      await page.locator("[data-edit-save]").click();
      await expect(page.locator("[data-edit-results]")).toBeVisible();
      break;
    }
    case "products-browsing-recovery-next-error": {
      const recovery = page.locator("[data-recovery-preview]");
      const count = await recovery.getAttribute("data-request-count");
      await expect(recovery).toHaveAttribute("data-request-count", "3");
      await next("technical");
      await read(() => page.locator("[data-browsing-retry]").click());
      await expect(recovery).toHaveAttribute("data-request-count", count!);
      break;
    }
    default:
      throw new Error(`Unknown Products browsing capture action: ${action}`);
  }
}

async function filtersAction(page: Page, action: string, locale: Locale) {
  const text = catalogueMessages[locale];
  const popup = page.locator("[data-products-filters]");
  const openFilters = async () => {
    await page.locator("[data-products-filter-trigger]").click();
    await expect(popup).toBeVisible();
  };
  const applyFilters = async () => {
    await page.locator("[data-products-filter-apply]").click();
    await expect(popup).toBeHidden();
    await page.mouse.move(1, 1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toBeHidden();
  };
  const includeArchived = () =>
    popup
      .getByRole("checkbox", { name: text.pfIncludeArchived, exact: true })
      .check();
  const showStock = async () => {
    await page
      .getByRole("checkbox", { name: text.gridShowStock, exact: true })
      .check();
    await page.locator("[data-products-location]").click();
    await page
      .getByRole("option", { name: text.navSalesFloor, exact: true })
      .click();
    await expect(page.locator("[data-products-location]")).toHaveText(
      text.navSalesFloor,
    );
  };
  const applyBoth = async () => {
    await openFilters();
    await includeArchived();
    await popup
      .getByRole("checkbox", { name: text.pfPositiveStockOnly, exact: true })
      .check();
    await applyFilters();
    await expect(
      page.locator('[data-products-filter-remove="includeArchived"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-products-filter-remove="positiveStockOnly"]'),
    ).toBeVisible();
  };
  const search = async (query: string) => {
    await page.getByRole("searchbox").fill(query);
    await page.getByRole("searchbox").press("Enter");
  };
  const sortSku = async () => {
    const heading = page.locator('th[data-products-column="sku"]');
    await heading.getByRole("button").click();
    await heading.getByRole("button").click();
    await expect(heading).toHaveAttribute("aria-sort", "descending");
  };
  switch (action) {
    case "products-filters-panel":
      await openFilters();
      await expect(
        popup.getByRole("checkbox", {
          name: text.pfIncludeArchived,
          exact: true,
        }),
      ).not.toBeChecked();
      break;
    case "products-filters-draft":
      await openFilters();
      await includeArchived();
      await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(
        0,
      );
      break;
    case "products-filters-archived":
      await openFilters();
      await includeArchived();
      await applyFilters();
      await expect(page.locator('[data-product-id="product-1"]')).toBeVisible();
      break;
    case "products-filters-stock-panel":
      await showStock();
      await openFilters();
      await expect(
        popup.getByRole("checkbox", {
          name: text.pfPositiveStockOnly,
          exact: true,
        }),
      ).toBeVisible();
      break;
    case "products-filters-positive":
      await showStock();
      await applyBoth();
      await expect(
        page.locator("[data-products-filter-incomplete]"),
      ).toContainText(/\b1\b/);
      // Popover focus can scroll a phone document by a few pixels. Start this
      // full-page case at the approved origin so its sticky header stays aligned.
      await page.evaluate(async () => {
        window.scrollTo(0, 0);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      });
      break;
    case "products-filters-incomplete-empty":
    case "products-filters-no-match":
      await showStock();
      await applyBoth();
      await search(
        action === "products-filters-incomplete-empty" ? "000003" : "000002",
      );
      await expect(page.locator("[data-product-id]")).toHaveCount(0);
      if (action === "products-filters-incomplete-empty") {
        await expect(
          page.locator("[data-products-filter-incomplete]"),
        ).toContainText(/\b1\b/);
        await expect(
          page.getByText(text.ptNoResults, { exact: true }),
        ).toHaveCount(0);
      } else {
        await expect(
          page.locator("[data-products-filter-incomplete]"),
        ).toHaveCount(0);
        await expect(
          page.getByText(text.pfNoFilterMatches, { exact: true }),
        ).toBeVisible();
      }
      break;
    case "products-filters-cleared":
    case "products-filters-restored":
      await showStock();
      await applyBoth();
      await search(action === "products-filters-cleared" ? "Café" : "Aceite");
      await sortSku();
      if (action === "products-filters-cleared") {
        await page.locator("[data-products-clear-filters]").click();
        await expect(page.locator("[data-products-filter-remove]")).toHaveCount(
          0,
        );
        await expect(page.getByRole("searchbox")).toHaveValue("Café");
        await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(
          0,
        );
      } else {
        await navigatePreview(page, "stock");
        await navigatePreview(page, "products");
        await expect(page.getByRole("searchbox")).toHaveValue("Aceite");
        await expect(page.locator("[data-products-filter-remove]")).toHaveCount(
          2,
        );
      }
      await expect(page.locator("[data-products-location]")).toHaveText(
        text.navSalesFloor,
      );
      await expect(
        page.locator('th[data-products-column="sku"]'),
      ).toHaveAttribute("aria-sort", "descending");
      break;
    case "products-filters-hidden-draft":
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page.locator('[data-edit-name="product-2"]').fill(" ");
      await showStock();
      await applyBoth();
      await expect(page.locator('[data-product-id="product-2"]')).toHaveCount(
        0,
      );
      await page.locator("[data-edit-save]").click();
      await expect(page.locator("[data-edit-results]")).toHaveCount(0);
      await expect(
        page.locator("[data-edit-validation-summary]"),
      ).toBeVisible();
      await page.locator('[data-edit-review="product-2-name"]').click();
      await expect(page.locator('[data-edit-name="product-2"]')).toBeVisible();
      await expect(page.locator('[data-edit-name="product-2"]')).toBeFocused();
      break;
    case "products-filters-recovery-pending":
      await showStock();
      await applyBoth();
      await search("000002");
      await expect(page.locator('[data-product-id="product-1"]')).toHaveCount(
        0,
      );
      await expect(page.locator("[data-recovery-summary]")).toContainText(
        text.prUnconfirmed,
      );
      break;
    default:
      throw new Error(`Unknown Products filters action: ${action}`);
  }
}

async function recoveryAction(page: Page, action: string, locale: Locale) {
  const text = catalogueMessages[locale];
  const owner = async () => {
    await page.locator('[data-recovery-owner-action="product-1"]').click();
    await expect(page.locator("[data-recovery-owner-dialog]")).toBeVisible();
  };
  const hideTooltip = async () => {
    await page.mouse.move(1, 1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toBeHidden();
  };
  switch (action) {
    case "products-recovery-row-tooltip":
      await page.locator('[data-product-expand="product-1"]').focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(
        page.locator('[data-product-expand="product-1"]'),
      ).toBeFocused();
      await expect(page.getByRole("tooltip")).toContainText(text.prUnconfirmed);
      break;
    case "products-recovery-row-expanded":
      await page.locator('[data-product-expand="product-1"]').click();
      await hideTooltip();
      await expect(
        page.locator('[data-product-expanded-status="product-1"]'),
      ).toBeVisible();
      break;
    case "products-recovery-table-editing": {
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await hideTooltip();
      const protectedField = page.locator('[data-edit-name="product-1"]');
      const otherField = page.locator('[data-edit-name="product-2"]');
      await expect(protectedField).toHaveAttribute("readonly", "");
      await expect(otherField).toBeEditable();
      const [protectedBox, otherBox] = await Promise.all([
        protectedField.boundingBox(),
        otherField.boundingBox(),
      ]);
      expect(protectedBox).not.toBeNull();
      expect(otherBox).not.toBeNull();
      expect(Math.abs(protectedBox!.width - otherBox!.width)).toBeLessThan(1);
      break;
    }
    case "products-recovery-takeover-guard":
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-2"]')
        .fill("Otro borrador sin guardar");
      await owner();
      await page
        .getByRole("button", { name: text.prAssume, exact: true })
        .click();
      await expect(page.locator("[data-edit-guard]")).toBeVisible();
      break;
    case "products-recovery-assumed-saved":
      await owner();
      await page
        .getByRole("button", { name: text.prAssume, exact: true })
        .click();
      await page.locator("[data-edit-save]").click();
      await expect(page.locator("[data-recovery-summary]")).toContainText(
        text.prConfirmed,
      );
      await page.locator('[data-slot="sheet-title"]').click();
      break;
    case "products-recovery-discarded-unavailable":
      await owner();
      await page
        .getByRole("button", { name: text.prDiscardStart, exact: true })
        .click();
      await page
        .getByRole("button", { name: text.prConfirmDiscard, exact: true })
        .click();
      await expect(page.locator("[data-recovery-review-dialog]")).toContainText(
        text.prDiscardedCurrentUnavailable,
      );
      break;
    case "products-recovery-other-saved":
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await page
        .locator('[data-edit-name="product-2"]')
        .fill("Azúcar sin interrumpir");
      await page.locator("[data-edit-save]").click();
      await expect(
        page.locator('[data-edit-result="product-2"]'),
      ).toBeVisible();
      break;
    case "products-recovery-retried":
    case "products-recovery-resumed":
      await page
        .getByRole("button", {
          name:
            action === "products-recovery-retried"
              ? text.prRetry
              : text.prResumeRecovery,
          exact: true,
        })
        .first()
        .click();
      // The common screenshot harness freezes Date. Advance its observation of
      // time so the deterministic 250ms synthetic response can settle; the
      // selected attempt deadlines/backoff in the product model are unchanged.
      await page.clock.setFixedTime(
        new Date((await page.evaluate(() => Date.now())) + 1000),
      );
      await expect(page.locator("[data-recovery-summary]")).toContainText(
        text.prConfirmed,
      );
      break;
    case "products-recovery-dismissed":
      await page
        .getByRole("button", {
          name: `${text.gridDetails}: ${text.peDismissResults}`,
          exact: true,
        })
        .click();
      await expect(
        page
          .getByRole("button", {
            name: `${text.gridDetails}: ${text.peShowResults}`,
            exact: true,
          })
          .first(),
      ).toBeVisible();
      break;
    case "products-recovery-owner":
      await owner();
      break;
    case "products-recovery-discard":
      await owner();
      await page
        .getByRole("button", { name: text.prDiscardStart, exact: true })
        .click();
      await expect(
        page.locator("[data-recovery-discard-dialog]"),
      ).toBeVisible();
      break;
    case "products-recovery-assumed":
    case "products-recovery-continued":
    case "products-recovery-review":
    case "products-recovery-reviewed":
    case "products-recovery-unavailable":
      await owner();
      await page
        .getByRole("button", {
          name:
            action === "products-recovery-continued"
              ? text.prContinueDraft
              : text.prAssume,
          exact: true,
        })
        .click();
      if (
        ["products-recovery-review", "products-recovery-unavailable"].includes(
          action,
        )
      ) {
        await expect(
          page.locator("[data-recovery-review-dialog]"),
        ).toBeVisible();
      } else {
        if (action === "products-recovery-reviewed")
          await page
            .getByRole("button", { name: text.prAcceptReview, exact: true })
            .click();
        await expect(
          page.locator('[data-edit-name="product-1"]'),
        ).toBeVisible();
        await page.locator('[data-slot="sheet-title"]').click();
      }
      break;
    case "products-recovery-former-table":
      await page
        .getByRole("button", { name: text.peEditTable, exact: true })
        .click();
      await expect(
        page.locator('[data-edit-name="product-1"]'),
      ).toHaveAttribute("readonly", "");
      break;
    default:
      throw new Error(`Unknown recovery action: ${action}`);
  }
}
