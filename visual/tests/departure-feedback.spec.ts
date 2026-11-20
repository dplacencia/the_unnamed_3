import { expect, test, type Locator, type Page } from "@playwright/test";
import { pendingDepartureInspectionReason } from "../../apps/backoffice/.storybook/stories/pending-departure-inspection-messages";
import { stockDepartureMessages } from "../../apps/backoffice/.storybook/stories/stock-departure-messages";

const copy = stockDepartureMessages("es");
type Outcome = "applied" | "pending" | "rejected" | "unconfirmed";

test.use({ viewport: { width: 320, height: 760 } });

async function open(page: Page, outcome: Outcome) {
  await page.goto(
    `/iframe.html?id=inventory-departure-feedback--${outcome}&viewMode=story&globals=locale:es;theme:light`,
  );
  const panel = page.locator("[data-stock-departure-panel]");
  await expect(panel).toHaveAttribute("data-stock-departure-panel", outcome);
  return {
    panel,
    effect: panel.locator("[data-stock-departure-effect]"),
    retry: panel.locator("[data-stock-departure-retry]"),
    workspace: page.locator("[data-stock-departure-workspace]"),
  };
}

async function expectReportedFacts(panel: Locator) {
  for (const fact of [
    "Tomate pera",
    copy.locationLabels.salesFloor,
    "Mostrador",
    "2250 g",
  ]) {
    await expect(panel.getByText(fact, { exact: true })).toBeVisible();
  }
}

test("applied departure separates the reported quantity from the signed effect at 320px", async ({
  page,
}) => {
  const { panel, effect, retry, workspace } = await open(page, "applied");
  await expectReportedFacts(panel);
  await expect(panel.getByText(copy.applied, { exact: true })).toBeVisible();
  await expect(effect).toHaveText("-2,25 kg");
  await expect(retry).toBeHidden();
  await expect(
    panel.getByText(/^(Existencias registradas|Saldo actual)$/u),
  ).toHaveCount(0);
  await expect(
    panel.getByRole("button", { name: "Ver existencias", exact: true }),
  ).toHaveCount(0);
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "1");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

test("pending and rejected departures show their own confirmed outcomes without a retry", async ({
  page,
}) => {
  const pending = await open(page, "pending");
  await expect(
    pending.panel.getByText("Resultado al registrar la salida", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    pending.panel.getByText(copy.pending, { exact: true }),
  ).toBeVisible();
  await expect(
    pending.panel.getByText(
      "Al registrar esta salida, las existencias no cambiaron.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    pending.panel.getByText(
      pendingDepartureInspectionReason("es", "channel-not-enabled"),
      { exact: true },
    ),
  ).toBeVisible();
  await expect(pending.retry).toBeHidden();
  await expect(pending.effect).toBeHidden();

  const rejected = await open(page, "rejected");
  await expect(
    rejected.panel.getByText(copy.rejected, { exact: true }),
  ).toBeVisible();
  await expect(
    rejected.panel.getByText(copy.rejectedReason, { exact: true }),
  ).toBeVisible();
  await expect(
    rejected.panel.getByText(copy.pending, { exact: true }),
  ).toHaveCount(0);
  await expect(rejected.retry).toBeHidden();
  await expect(rejected.effect).toBeHidden();
});

test("an unconfirmed departure recovers the same reported facts after a manual retry", async ({
  page,
}) => {
  const { panel, effect, retry, workspace } = await open(page, "unconfirmed");
  await expectReportedFacts(panel);
  await expect(
    panel.getByText("No hemos podido confirmar el resultado de esta salida.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(effect).toBeHidden();
  await expect(retry).toHaveAccessibleName("Reintentar la misma salida");
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "3");

  await retry.click();
  await expect(panel).toHaveAttribute("data-stock-departure-panel", "applied");
  await expectReportedFacts(panel);
  await expect(effect).toHaveText("-2,25 kg");
  await expect(workspace).toHaveAttribute("data-stock-departure-attempts", "4");
});
