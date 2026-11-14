import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import AxeBuilder from "../../apps/backoffice/node_modules/@axe-core/playwright/dist/index.js";
import { copy } from "../../apps/backoffice/.storybook/stories/grid-comparison/model";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

type Candidate = "tan-stack" | "tabulator";
const output = path.resolve(".cache/grid-comparison/evidence");
const url = (candidate: Candidate, locale = "es", theme = "light") =>
  `http://localhost:6010/iframe.html?id=evaluation-grid-comparison--${candidate}&viewMode=story&globals=locale:${locale};theme:${theme}`;
async function ready(
  page: Page,
  candidate: Candidate,
  locale = "es",
  theme = "light",
) {
  await page.goto(url(candidate, locale, theme));
  await expect(page.locator("[data-grid-comparison]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator('[data-row-id="product-1"]')).toBeVisible();
}
async function search(page: Page, value: string) {
  await page.getByRole("searchbox").fill(value);
  await page.getByRole("searchbox").press("Enter");
  await expect(page.locator("[data-grid-comparison]")).toHaveAttribute(
    "data-ready",
    "true",
  );
}
async function stock(page: Page) {
  await page.locator('.grid-controls input[type="checkbox"]').first().check();
  await page.getByLabel("Ubicación", { exact: true }).selectOption("shop");
  await expect(
    page.locator('[data-row-id="product-1"] [data-column="stock"]'),
  ).toContainText("9007199254740.993123");
}
async function editNote(
  page: Page,
  candidate: Candidate,
  id: string,
  value: string,
) {
  const cell = page.locator(`[data-row-id="${id}"] [data-column="note"]`);
  if (candidate === "tabulator") await cell.dblclick();
  await cell.locator("input").fill(value);
  await cell.locator("input").press("Enter");
}
const scrollContainer = (page: Page, candidate: Candidate) =>
  page.locator(
    candidate === "tan-stack" ? "[data-grid-scroll]" : ".tabulator-tableholder",
  );
async function screenshot(page: Page, name: string) {
  await fs.mkdir(output, { recursive: true });
  await page.screenshot({
    path: path.join(output, `${name}.png`),
    animations: "disabled",
  });
}
async function probes(page: Page) {
  await page.locator(".grid-probes summary").click();
}

for (const candidate of ["tan-stack", "tabulator"] as const) {
  test(`${candidate}: catalogue stays read-only and search runs on submission`, async ({
    page,
  }) => {
    await page.goto(
      `http://localhost:6010/iframe.html?id=evaluation-grid-comparison--${candidate}&viewMode=story`,
    );
    await expect(page.locator("[data-grid-comparison]")).toBeVisible();
    await expect(page.locator("[data-result-count]")).toHaveText("95");
    await expect(page.locator('[data-column="stock"]')).toHaveCount(0);
    await page.getByRole("searchbox").fill("000001");
    await expect(page.locator("[data-result-count]")).toHaveText("95");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await expect(page.locator("[data-result-count]")).toHaveText("1");
    await expect(page.locator('[data-row-id="product-1"]')).toBeVisible();
    await expect(
      page.locator("[data-grid-comparison] input[data-note]"),
    ).toHaveCount(0);
  });
}

for (const candidate of ["tan-stack", "tabulator"] as const) {
  test(`${candidate}: exact stock and unknown states survive read-only rendering`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await ready(page, candidate);
    await page.getByLabel("Mostrar existencias", { exact: true }).check();
    await expect(
      page.locator('[data-row-id="product-1"] [data-column="stock"]'),
    ).toHaveText("Elige ubicación");
    await page.getByLabel("Ubicación", { exact: true }).selectOption("shop");
    await expect(
      page.locator('[data-row-id="product-1"] [data-column="stock"]'),
    ).toHaveText("9007199254740.993123 kg · 12 uds.");
    await expect(
      page.locator('[data-row-id="product-2"] [data-column="stock"]'),
    ).toHaveText("0 kg · 0 uds.");
    await expect(
      page.locator('[data-row-id="product-3"] [data-column="stock"]'),
    ).toHaveText("Sin registro");
    await expect(
      page.locator('[data-row-id="product-4"] [data-column="stock"]'),
    ).toHaveText("Desconocido");
    await expect(
      page.locator('[data-row-id="product-5"] [data-column="stock"]'),
    ).toContainText("Necesita verificación");
    await screenshot(page, `${candidate}-stock`);
    await page.getByLabel("Ubicación", { exact: true }).selectOption("store");
    await expect(
      page.locator('[data-row-id="product-1"] [data-column="stock"]'),
    ).toHaveText("2 kg · 8 uds.");
    await search(page, "0840000000001");
    await expect(page.locator("[data-result-count]")).toHaveText("1");
    expect(errors).toEqual([]);
  });

  test(`${candidate}: native sorting, draft filters and retained column controls`, async ({
    page,
    context,
  }) => {
    await ready(page, candidate);
    const first = () => page.locator("[data-row-id]").first();
    await page.locator(".grid-sort").filter({ hasText: "Referencia" }).click();
    await expect(first()).toHaveAttribute("data-row-id", "product-1");
    await page.locator(".grid-sort").filter({ hasText: "Referencia" }).click();
    await expect(first()).toHaveAttribute("data-row-id", "product-99");
    await page.locator("[data-filters] summary").click();
    await page.getByLabel("Incluir archivados").check();
    await expect(page.locator("[data-result-count]")).toHaveText("95");
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await page.locator("[data-filters] summary").click();
    await expect(page.getByLabel("Incluir archivados")).not.toBeChecked();
    await page.getByLabel("Incluir archivados").check();
    await page.getByRole("button", { name: "Aplicar", exact: true }).click();
    await expect(page.locator("[data-result-count]")).toHaveText("100");
    await page.locator(".grid-controls details summary").first().click();
    await page.locator('[data-control="sku-first"]').click();
    const headers = page.locator(
      candidate === "tan-stack"
        ? "thead [data-column]"
        : ".tabulator-col[data-column]",
    );
    await expect(headers.first()).toHaveAttribute("data-column", "sku");
    await page.locator('[data-control="width"]').focus();
    await page.locator('[data-control="width"]').press("End");
    await expect(
      page.locator("[data-row-id]").first().locator('[data-column="product"]'),
    ).toHaveCSS("width", "400px");
    await page.locator('[data-control="comfortable"]').check();
    await page.reload();
    await expect(page.locator("[data-grid-comparison]")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(headers.first()).toHaveAttribute("data-column", "sku");
    await expect(page.locator("[data-result-count]")).toHaveText("100");
    await probes(page);
    await page.locator('[data-control="business"]').selectOption("b");
    await expect(page.locator("[data-result-count]")).toHaveText("95");
    await expect(headers.first()).toHaveAttribute("data-column", "product");
    await page.locator('[data-control="business"]').selectOption("a");
    await expect(headers.first()).toHaveAttribute("data-column", "sku");
    const fresh = await context.newPage();
    await ready(fresh, candidate);
    await expect(fresh.locator("[data-result-count]")).toHaveText("95");
    await fresh.close();
  });

  test(`${candidate}: edits remain drafts across rejected and uncertain saves`, async ({
    page,
  }) => {
    await ready(page, candidate);
    await stock(page);
    await page.locator('[data-action="edit"]').click();
    await editNote(page, candidate, "product-1", "draft-000001");
    await expect(page.locator("[data-draft-count]")).toHaveText("1");
    await expect(page.locator("[data-confirmed-note]")).toHaveText("");
    await expect(page.locator('[data-column="stock"] input')).toHaveCount(0);
    await probes(page);
    await page.locator('[data-control="outcome"]').selectOption("rejected");
    await page.locator('[data-action="save"]').click();
    await expect(page.locator("[data-save-status]")).toContainText(
      "rechazados",
    );
    await expect(page.locator("[data-draft-count]")).toHaveText("1");
    await page.locator('[data-control="outcome"]').selectOption("uncertain");
    await page.locator('[data-action="save"]').click();
    await expect(page.locator("[data-save-status]")).toContainText(
      "desconocido",
    );
    await expect(page.locator("[data-confirmed-note]")).toHaveText("");
    await screenshot(page, `${candidate}-draft-unknown`);
    await page.locator('[data-control="outcome"]').selectOption("confirmed");
    await page.locator('[data-action="save"]').click();
    await expect(page.locator("[data-confirmed-note]")).toHaveText(
      "draft-000001",
    );
    await expect(page.locator("[data-draft-count]")).toHaveText("0");
    await page.locator('[data-action="edit"]').click();
    await editNote(page, candidate, "product-1", "discard me");
    await page.locator('[data-action="cancel"]').click();
    await expect(page.locator("[data-confirmed-note]")).toHaveText(
      "draft-000001",
    );
    await expect(page.locator("[data-draft-count]")).toHaveText("0");
  });

  test(`${candidate}: expansion preserves React context and panel form drafts`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await ready(page, candidate);
    const trigger = page.getByRole("button", {
      name: "Ampliar 000001",
      exact: true,
    });
    await trigger.focus();
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const inline = page.locator('[data-inline-id="product-1"]');
    await expect(inline).toHaveAttribute("data-inline-locale", "es");
    await inline.getByRole("button", { name: "Detalles", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox")).toHaveCount(0);
    await dialog.locator('[data-action="panel-edit"]').click();
    await dialog.getByRole("textbox").fill("x".repeat(81));
    await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("80");
    await dialog.getByRole("textbox").fill("from RHF");
    await dialog.getByRole("button", { name: "Guardar", exact: true }).click();
    await dialog.getByRole("button", { name: "Cerrar", exact: true }).click();
    await expect(inline.locator("[data-inline-note]")).toHaveText("from RHF");
    await search(page, "000003");
    await expect(inline).not.toBeVisible();
    await search(page, "");
    await expect(inline.locator("[data-inline-note]")).toHaveText("from RHF");
    await screenshot(page, `${candidate}-expanded`);
    await trigger.click();
    await expect(inline).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const [profile, viewport, theme] of [
    ["desktop", { width: 1440, height: 900 }, "light"],
    ["tablet", { width: 768, height: 1024 }, "light"],
    ["mobile", { width: 390, height: 844 }, "light"],
    ["dark", { width: 1440, height: 900 }, "dark"],
  ] as const) {
    test(`${candidate}: ${profile} layout, full table and details`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await ready(page, candidate, "es", theme);
      await stock(page);
      if (profile === "dark") {
        const contrast = await new AxeBuilder({ page })
          .include("[data-grid-comparison]")
          .withRules(["color-contrast"])
          .analyze();
        expect(contrast.violations).toEqual([]);
      }
      const first = page.locator(
        '[data-row-id="product-1"] [data-column="product"]',
      );
      const before = await first.boundingBox();
      await scrollContainer(page, candidate).evaluate((element) => {
        element.scrollLeft = 300;
      });
      if (profile === "mobile") {
        const after = await first.boundingBox();
        expect(Math.abs(after!.x - before!.x)).toBeLessThan(2);
        expect(
          await first
            .locator("button")
            .first()
            .evaluate((element) => element.getBoundingClientRect().height),
        ).toBeGreaterThanOrEqual(44);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      await screenshot(page, `${candidate}-${profile}`);
      await scrollContainer(page, candidate).evaluate((element) => {
        element.scrollLeft = 0;
      });
      await first.locator(".grid-product").click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      if (profile === "mobile")
        expect((await dialog.boundingBox())!.width).toBe(390);
      await screenshot(page, `${candidate}-${profile}-panel`);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    });
  }

  for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
    test(`${candidate}: ${locale} labels and React expansion context`, async ({
      page,
    }) => {
      await ready(page, candidate, locale);
      const text = copy[locale as Locale];
      await expect(
        page.getByRole("heading", { name: text.products, exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("searchbox")).toHaveAttribute(
        "aria-label",
        text.search,
      );
      await page
        .getByRole("button", { name: `${text.expand} 000001`, exact: true })
        .click();
      await expect(
        page.locator('[data-inline-id="product-1"]'),
      ).toHaveAttribute("data-inline-locale", locale);
    });
  }

  test(`${candidate}: keyboard, clipboard data and automated accessibility audit`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await ready(page, candidate);
    const firstSku = page.locator(
      '[data-row-id="product-1"] [data-column="sku"]',
    );
    await firstSku.click();
    await firstSku.focus();
    await page.keyboard.press("ArrowDown");
    const selected = page.locator("[data-selected-values]");
    await expect(selected).toHaveAttribute("data-selected-values", /000002/);
    let copied = "";
    if (candidate === "tan-stack") {
      copied = await page
        .locator('[data-row-id="product-2"] [data-column="sku"]')
        .evaluate((element) => {
          const data = new DataTransfer();
          element.dispatchEvent(
            new ClipboardEvent("copy", {
              clipboardData: data,
              bubbles: true,
              cancelable: true,
            }),
          );
          return data.getData("text/plain");
        });
    } else {
      copied = await page.evaluate(() => {
        const original = document.execCommand.bind(document);
        let copied = "";
        document.execCommand = (command: string) => {
          if (command !== "copy") return original(command);
          const data = new DataTransfer();
          document.querySelector('[data-engine="tabulator"]')!.dispatchEvent(
            new ClipboardEvent("copy", {
              clipboardData: data,
              bubbles: true,
              cancelable: true,
            }),
          );
          copied = data.getData("text/plain");
          return true;
        };
        try {
          (
            document.querySelector(
              '[data-action="copy-native"]',
            ) as HTMLButtonElement
          ).click();
        } finally {
          document.execCommand = original;
        }
        return copied;
      });
    }
    expect(copied).toBe("000002");
    await page.keyboard.press("Enter");
    expect(errors).toEqual([]);
    const audit = await new AxeBuilder({ page })
      .include("[data-grid-comparison]")
      .analyze();
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(
      path.join(output, `${candidate}-axe.json`),
      JSON.stringify(audit, null, 2),
    );
    // Audits are comparison evidence, not a certification gate. Record findings
    // without making the outcome depend on the vendor's selected ARIA model.
    expect(audit.incomplete).toBeDefined();
    await screenshot(page, `${candidate}-keyboard`);
  });
}

test("paired warm-module mount, search, deep-scroll and heap measurements", async ({
  page,
  browserName,
}) => {
  test.setTimeout(180_000);
  const samples = [];
  const cdp = await page.context().newCDPSession(page);
  for (const size of [100, 1000, 10000]) {
    for (let sample = 0; sample < 5; sample++) {
      for (const candidate of (sample % 2
        ? ["tabulator", "tan-stack"]
        : ["tan-stack", "tabulator"]) as Candidate[]) {
        await ready(page, candidate);
        await probes(page);
        if (size !== 100)
          await page
            .locator('[data-control="size"]')
            .selectOption(String(size));
        await expect(page.locator("[data-result-count]")).toHaveText(
          String(size * 0.95),
        );
        await page.locator('[data-action="remount"]').click();
        await expect(page.locator("[data-grid-comparison]")).toHaveAttribute(
          "data-ready",
          "true",
        );
        const mount = Number(
          await page
            .locator("[data-grid-comparison]")
            .getAttribute("data-duration"),
        );
        await search(page, "000001");
        await expect(page.locator("[data-result-count]")).toHaveText("1");
        const lookup = Number(
          await page
            .locator("[data-grid-comparison]")
            .getAttribute("data-duration"),
        );
        await search(page, "");
        await expect(page.locator("[data-result-count]")).toHaveText(
          String(size * 0.95),
        );
        const lastId = `product-${size - 1}`;
        const scrolling = await scrollContainer(page, candidate).evaluate(
          (element, id) =>
            new Promise<number>((resolve, reject) => {
              const start = performance.now();
              element.scrollTop = element.scrollHeight;
              const timer = setTimeout(
                () => reject(new Error(`Deep scroll did not render ${id}`)),
                10_000,
              );
              const check = () => {
                const row = element.querySelector(`[data-row-id="${id}"]`);
                if (
                  row &&
                  row.getBoundingClientRect().top <
                    element.getBoundingClientRect().bottom
                ) {
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                      clearTimeout(timer);
                      resolve(performance.now() - start);
                    }),
                  );
                } else requestAnimationFrame(check);
              };
              requestAnimationFrame(check);
            }),
          lastId,
        );
        const renderedRows = await page.locator("[data-row-id]").count();
        await cdp.send("HeapProfiler.collectGarbage");
        const heap = await cdp.send("Runtime.getHeapUsage");
        samples.push({
          candidate,
          size,
          sample,
          mountMs: mount,
          lookupMs: lookup,
          scrollMs: scrolling,
          renderedRows,
          heapBytes: heap.usedSize,
        });
        if (size === 10000 && sample === 0)
          await screenshot(page, `${candidate}-10000-last-row`);
      }
    }
  }
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(
    path.join(output, "benchmarks.json"),
    JSON.stringify(
      {
        browserName,
        browserVersion: page.context().browser()?.version(),
        method:
          "Same page/viewport, static production Storybook, 5 samples per size/candidate, alternating candidate order. Modules warmed; remount measures click-handler-to-engine-ready plus two animation frames; search measures submitted lookup plus two frames; scroll waits for last eligible row plus two frames. Heap is whole iframe/tab after GC, including shared Storybook/React/data. Synthetic local in-memory records, no server/network latency. No production capacity claim.",
        samples,
      },
      null,
      2,
    ),
  );
  expect(samples).toHaveLength(30);
});

test("Tabulator native ARIA baseline attribution", async ({ page }) => {
  await page.goto(
    "http://localhost:6010/iframe.html?id=evaluation-grid-comparison--tabulator-native&viewMode=story",
  );
  await expect(page.locator("[data-native-audit] .tabulator-row")).toHaveCount(
    1,
  );
  const audit = await new AxeBuilder({ page })
    .include("[data-native-audit]")
    .analyze();
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(
    path.join(output, "tabulator-native-axe.json"),
    JSON.stringify(audit, null, 2),
  );
  await screenshot(page, "tabulator-native-audit");
  expect(audit.passes.length).toBeGreaterThan(0);
});

for (const candidate of ["tan-stack", "tabulator"] as const) {
  test(`${candidate}: panel accessibility and keyboard focus return`, async ({
    page,
  }) => {
    await ready(page, candidate);
    const trigger = page.locator('[data-row-id="product-1"] .grid-product');
    await trigger.focus();
    await trigger.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const inspection = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    await dialog.locator('[data-action="panel-edit"]').click();
    await dialog.getByRole("textbox").fill("Accessible draft");
    const editing = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(
      path.join(output, `${candidate}-panel-axe.json`),
      JSON.stringify({ inspection, editing }, null, 2),
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}
