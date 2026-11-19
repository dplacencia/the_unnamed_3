import { expect, test, type Page } from "@playwright/test";
import { pendingInspectionMessages } from "../../apps/backoffice/.storybook/stories/pending-receipt-inspection-messages";
import { receiptMessages } from "../../apps/backoffice/.storybook/stories/stock-receipt-messages";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";
import {
  pendingReceiptInspection,
  submitPendingReceipt,
} from "../pending-receipt-inspection-actions";
import { fillReceiptForm, receiptForm } from "../stock-receipt-actions";

async function ready(
  page: Page,
  story = "receipt",
  locale: Locale = "es",
  fixture?: "refresh" | "late-read",
) {
  await page.goto(
    `/iframe.html?id=inventory-pending-receipt-inspection--${story}&viewMode=story&globals=locale:${locale};theme:light${fixture ? `&args=fixture:${fixture}` : ""}`,
  );
  const inspection = pendingReceiptInspection(page);
  await expect(inspection.workspace).toBeAttached();
  return inspection;
}

async function expectReads(page: Page, count: number, reference?: string) {
  const { workspace } = pendingReceiptInspection(page);
  await expect(workspace).toHaveAttribute(
    "data-pending-inspection-read-count",
    String(count),
  );
  if (reference)
    await expect(workspace).toHaveAttribute(
      "data-pending-inspection-last-reference",
      reference,
    );
  await expect(receiptForm(page).workspace).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
}

async function openConfirmedLine(page: Page) {
  const inspection = pendingReceiptInspection(page);
  const reference = await inspection.open.getAttribute(
    "data-pending-inspection-open",
  );
  expect(reference).toBeTruthy();
  await inspection.open.click();
  return reference!;
}

test("pending receipt inspection reads the exact confirmed line on request", async ({
  page,
}) => {
  const copy = pendingInspectionMessages("es");
  const inspection = await ready(page);
  const receipt = await submitPendingReceipt(page);
  await expect(inspection.original).toContainText(
    "Resultado al registrar la entrada",
  );
  await expect(receipt.panel).toContainText(receiptMessages.es.pending);
  await expect(inspection.open).toHaveAccessibleName("Ver detalles");
  await expectReads(page, 0);
  const reference = await openConfirmedLine(page);
  await expectReads(page, 1, reference);
  await expect(inspection.heading).toHaveText("Estado actual");
  await expect(inspection.heading).toBeFocused();
  await expect(inspection.original).toBeHidden();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  await expect(inspection.product).toHaveText("Tomate pera");
  await expect(inspection.location).toHaveText(
    receiptMessages.es.locationLabels.stockroom,
  );
  await expect(inspection.quantity).toHaveText("500");
  await expect(inspection.unit).toHaveText("g");
  await expect(inspection.reasons.locator("li")).toHaveText(
    copy.fixtureReasons.slice(0, 2),
  );
  await expect(inspection.effect).toBeHidden();
  await expect(receipt.balance).toBeHidden();
  await expect(page.getByRole("dialog")).toHaveCount(1);
});

for (const variant of ["known-quantity", "known-unit"] as const) {
  test(`pending receipt inspection preserves the independently ${variant} fact`, async ({
    page,
  }) => {
    const copy = pendingInspectionMessages("es");
    const inspection = await ready(page, variant);
    await submitPendingReceipt(page);
    const reference = await openConfirmedLine(page);
    await expect(inspection.state).toHaveAttribute(
      "data-pending-inspection-state",
      "pending",
    );
    const quantityKnown = variant === "known-quantity";
    await expect(inspection.quantity).toHaveText(
      quantityKnown ? "500" : copy.unknown,
    );
    await expect(inspection.unit).toHaveText(
      quantityKnown ? copy.unknown : "g",
    );
    await expect(inspection.product).toHaveText(
      quantityKnown ? "Tomate pera" : copy.unknown,
    );
    await expect(inspection.location).toHaveText(
      receiptMessages.es.locationLabels.stockroom,
    );
    await expect(inspection.effect).toBeHidden();
    await expectReads(page, 1, reference);
  });
}

for (const outcome of ["applied", "rejected"] as const) {
  test(`pending receipt inspection shows the subsequent ${outcome} outcome and returns to original Pending`, async ({
    page,
  }) => {
    const copy = pendingInspectionMessages("es");
    const receiptCopy = receiptMessages.es;
    const inspection = await ready(page, outcome);
    const receipt = await submitPendingReceipt(page);
    const reference = await openConfirmedLine(page);
    await expect(inspection.state).toHaveAttribute(
      "data-pending-inspection-state",
      outcome,
    );
    await expect(inspection.content).toContainText(receiptCopy[outcome]);
    await expect(inspection.quantity).toHaveText("500");
    await expect(inspection.unit).toHaveText("g");
    if (outcome === "applied") {
      await expect(inspection.effect).toContainText("500 g");
      await expect(inspection.effect).toContainText(
        receiptCopy.appliedQuantity,
      );
    } else {
      await expect(inspection.effect).toBeHidden();
    }
    await expect(receipt.effect).toBeHidden();
    await expect(receipt.balance).toBeHidden();
    await inspection.back.click();
    await expect(inspection.content).toBeHidden();
    await expect(inspection.original).toContainText(copy.originalResult);
    await expect(receipt.panel).toContainText(receiptCopy.pending);
    await expect(receipt.panel).not.toContainText(receiptCopy[outcome]);
    await expect(inspection.open).toBeFocused();
    await expectReads(page, 1, reference);
    await expect(page.getByRole("dialog")).toHaveCount(1);
  });
}

test("pending receipt inspection displays neutral loading with Back and close available", async ({
  page,
}) => {
  const copy = pendingInspectionMessages("es");
  const inspection = await ready(page, "loading");
  const receipt = await submitPendingReceipt(page);
  await openConfirmedLine(page);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "loading",
  );
  await expect(inspection.content).toContainText(copy.loading);
  await expect(receipt.panel).not.toContainText("Tomate pera");
  await expect(inspection.facts).toBeHidden();
  await expect(inspection.reasons).toBeHidden();
  await expect(inspection.effect).toBeHidden();
  await expect(inspection.refresh).toBeHidden();
  await expect(inspection.retry).toBeHidden();
  await expect(inspection.back).toBeEnabled();
  await expect(page.locator("[data-receipt-close]")).toBeEnabled();
});

test("pending receipt inspection shows generic unavailable detail without exposing facts", async ({
  page,
}) => {
  const copy = pendingInspectionMessages("es");
  const inspection = await ready(page, "unavailable");
  const receipt = await submitPendingReceipt(page);
  const reference = await openConfirmedLine(page);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "unavailable",
  );
  await expect(inspection.content).toContainText(
    "No se pueden consultar los detalles de esta entrada",
  );
  await expect(inspection.content).not.toContainText(copy.error);
  await expect(receipt.panel).not.toContainText("Tomate pera");
  await expect(receipt.panel).not.toContainText(
    receiptMessages.es.locationLabels.stockroom,
  );
  await expect(inspection.facts).toBeHidden();
  await expect(inspection.reasons).toBeHidden();
  await expect(inspection.effect).toBeHidden();
  await expect(inspection.refresh).toBeHidden();
  await expect(inspection.retry).toBeHidden();
  await expect(inspection.back).toBeEnabled();
  await expectReads(page, 1, reference);
});

test("pending receipt inspection retries a technical failure for the same line", async ({
  page,
}) => {
  const copy = pendingInspectionMessages("es");
  const inspection = await ready(page, "read-error");
  const receipt = await submitPendingReceipt(page);
  const reference = await openConfirmedLine(page);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "error",
  );
  await expect(inspection.content).toContainText(copy.error);
  await expect(receipt.panel).not.toContainText("Tomate pera");
  await expect(inspection.facts).toBeHidden();
  await expect(inspection.refresh).toBeHidden();
  await expect(inspection.retry).toHaveAccessibleName("Reintentar");
  await expect(inspection.back).toBeEnabled();
  await expectReads(page, 1, reference);
  await inspection.retry.click();
  await expect(inspection.heading).toBeFocused();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  await expect(inspection.product).toHaveText("Tomate pera");
  await expectReads(page, 2, reference);
});

test("pending receipt inspection refresh clears prior facts until a fresh same-line result", async ({
  page,
}) => {
  const inspection = await ready(page, "receipt", "es", "refresh");
  await submitPendingReceipt(page);
  const reference = await openConfirmedLine(page);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "pending",
  );
  await expect(inspection.facts).toBeVisible();
  await expect(inspection.refresh).toHaveAccessibleName("Actualizar");
  await inspection.refresh.click();
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "loading",
  );
  await expect(inspection.heading).toBeFocused();
  await expect(inspection.facts).toBeHidden();
  await expect(inspection.reasons).toBeHidden();
  await expect(inspection.effect).toBeHidden();
  await expectReads(page, 2, reference);
  await expect(inspection.state).toHaveAttribute(
    "data-pending-inspection-state",
    "applied",
  );
  await expect(inspection.effect).toContainText("500 g");
  await expectReads(page, 2, reference);
});

for (const exit of ["back", "close"] as const) {
  test(`pending receipt inspection ignores a late response after ${exit}`, async ({
    page,
  }) => {
    const inspection = await ready(page, "receipt", "es", "late-read");
    const receipt = await submitPendingReceipt(page);
    const reference = await openConfirmedLine(page);
    await expect(inspection.state).toHaveAttribute(
      "data-pending-inspection-state",
      "pending",
    );
    await inspection.refresh.click();
    await expect(inspection.state).toHaveAttribute(
      "data-pending-inspection-state",
      "loading",
    );
    await expectReads(page, 2, reference);
    if (exit === "back") {
      await inspection.back.click();
      await expect(inspection.content).toBeHidden();
      await expect(inspection.original).toBeVisible();
      await expect(inspection.open).toBeFocused();
      await expect(receipt.panel).toContainText(receiptMessages.es.pending);
      await expect(receipt.panel).not.toContainText(receiptMessages.es.applied);
      await openConfirmedLine(page);
      await expectReads(page, 3, reference);
      await expect(inspection.state).toHaveAttribute(
        "data-pending-inspection-state",
        "applied",
      );
      await expect(inspection.effect).toContainText("500 g");
      await expect(inspection.workspace).toHaveAttribute(
        "data-pending-inspection-settled-count",
        "3",
      );
      await expect(inspection.state).toHaveAttribute(
        "data-pending-inspection-state",
        "applied",
      );
      await expect(inspection.effect).toContainText("500 g");
    } else {
      await page.locator("[data-receipt-close]").click();
      await expect(receipt.panel).toBeHidden();
      await expect(receipt.open).toBeFocused();
      await expect(inspection.workspace).toHaveAttribute(
        "data-pending-inspection-settled-count",
        "2",
      );
      await expect(inspection.content).toBeHidden();
      await expect(receipt.panel).toBeHidden();
      await expect(inspection.open).toBeHidden();
    }
  });
}

test("pending receipt inspection stays out of submission recovery", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=inventory-first-stock-receipt--recovery&viewMode=story&globals=locale:es;theme:light",
  );
  const receipt = await fillReceiptForm(page);
  await receipt.submit.click();
  await expect(receipt.panel).toHaveAttribute(
    "data-receipt-panel",
    "unconfirmed",
  );
  await expect(page.locator("[data-receipt-retry]")).toBeVisible();
  await expect(pendingReceiptInspection(page).open).toBeHidden();
});

test("pending receipt inspection updates an open result when the Storybook language changes", async ({
  page,
}) => {
  await page.goto(
    "/?path=/story/inventory-pending-receipt-inspection--receipt",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  const inspection = pendingReceiptInspection(frame);
  await frame.locator("[data-receipt-open]").click();
  await frame.locator("[data-receipt-product]").fill("Tomate pera");
  await frame.locator('[data-receipt-product-option="tomato"]').click();
  await frame.locator("[data-receipt-location]").selectOption("stockroom");
  await frame.locator("[data-receipt-unit]").selectOption("g");
  await frame.locator("[data-receipt-quantity]").fill("500");
  await frame.locator("[data-receipt-submit]").click();
  await inspection.open.click();
  const reasons = inspection.reasons.locator("li");
  await expect(inspection.heading).toHaveText(
    pendingInspectionMessages("es").title,
  );
  await expect(inspection.location).toHaveText(
    receiptMessages.es.locationLabels.stockroom,
  );
  await expect(reasons).toHaveText(
    pendingInspectionMessages("es").fixtureReasons.slice(0, 2),
  );

  await page.getByRole("button", { name: /^Idioma de/ }).click();
  await page.getByText("English", { exact: true }).click();

  await expect(inspection.heading).toHaveText(
    pendingInspectionMessages("en").title,
  );
  await expect(inspection.location).toHaveText(
    receiptMessages.en.locationLabels.stockroom,
  );
  await expect(reasons).toHaveText(
    pendingInspectionMessages("en").fixtureReasons.slice(0, 2),
  );
  await expect(frame.getByRole("dialog")).toBeVisible();
  await expect(inspection.quantity).toHaveText("500");
  await expect(inspection.workspace).toHaveAttribute(
    "data-pending-inspection-read-count",
    "1",
  );
  await expect(frame.locator("[data-receipt-workspace]")).toHaveAttribute(
    "data-receipt-request-count",
    "1",
  );
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`pending receipt inspection ${locale} phone panel shows localized labels edge to edge`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const copy = pendingInspectionMessages(locale);
    const inspection = await ready(page, "receipt", locale);
    const receipt = await submitPendingReceipt(page);
    await expect(inspection.original).toContainText(copy.originalResult);
    await expect(inspection.open).toHaveAccessibleName(copy.open);
    await openConfirmedLine(page);
    await expect(inspection.heading).toHaveText(copy.title);
    await expect(inspection.back).toHaveAccessibleName(copy.back);
    await expect(inspection.refresh).toHaveAccessibleName(copy.refresh);
    await expect(inspection.location).toHaveText(
      receiptMessages[locale].locationLabels.stockroom,
    );
    await expect(inspection.quantity).toHaveText("500");
    await expect(inspection.unit).toHaveText("g");
    await expect(inspection.reasons.locator("li")).toHaveText(
      copy.fixtureReasons.slice(0, 2),
    );
    await expect
      .poll(async () =>
        Math.round((await receipt.panel.boundingBox())?.width ?? 0),
      )
      .toBe(390);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(390);
  });
}
