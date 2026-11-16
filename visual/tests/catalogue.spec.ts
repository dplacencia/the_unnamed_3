import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  assertSnapshotUpdatesDisabled,
  digest,
  validateReference,
  type Reference,
} from "../core.ts";
import {
  cache,
  root,
  inventory,
  rendererEnvironment,
  readBuild,
  type Entry,
  type Scenario,
} from "../runtime.ts";
import { profiles, origins } from "../profiles.ts";
import { navigationAction } from "../navigation-actions.ts";
import { productsAction } from "../products-actions.ts";
import type { Locale } from "../../apps/backoffice/src/i18n/configuration";

const build = readBuild();
const mode = process.env.VISUAL_MODE === "compare" ? "compare" : "capture";
const runId = process.env.VISUAL_RUN_ID;
if (!runId || !/^[0-9A-Za-z.-]+$/.test(runId))
  throw new Error("Run through pnpm visual:capture or pnpm visual:compare");
const runDirectory = path.join(cache, "runs", runId);
const messages = Object.fromEntries(
  ["es", "en", "ca", "gl", "eu"].map((locale) => [
    locale,
    JSON.parse(
      readFileSync(
        path.join(root, `apps/backoffice/src/messages/${locale}.json`),
        "utf8",
      ),
    ),
  ]),
) as Record<
  string,
  {
    header: { toggleTheme: string; toggleSidebar: string };
    notFound: { backHome: string };
  }
>;
const screenshotOptions = {
  animations: "disabled" as const,
  caret: "hide" as const,
  scale: "css" as const,
  fullPage: true,
};

test.beforeAll(async () => {
  for (const origin of Object.values(origins)) {
    const response = await fetch(origin);
    expect(
      response.headers.get("X-Visual-Source"),
      `Source identity at ${origin}`,
    ).toBe(build.sourceHash);
  }
});

async function action(
  page: Page,
  name: string | undefined,
  entry: Entry,
  theme: string,
) {
  if (name?.startsWith("navigation-"))
    return navigationAction(page, name, (entry.locale ?? "es") as Locale);
  if (name?.startsWith("products-"))
    return productsAction(page, name, (entry.locale ?? "es") as Locale);
  switch (name) {
    case "brand-font-inter":
      await page.getByRole("radio", { name: "Inter", exact: true }).check();
      await expect(page.locator("[data-brand-proposals]")).toHaveAttribute(
        "data-preview-font",
        "inter",
      );
      break;
    case "brand-font-outfit":
      await page.getByRole("radio", { name: "Outfit", exact: true }).check();
      await expect(page.locator("[data-brand-proposals]")).toHaveAttribute(
        "data-preview-font",
        "outfit",
      );
      break;
    case undefined:
      break;
    case "focus-button":
      await page
        .getByRole("button", { name: "Botón de muestra", exact: true })
        .focus();
      break;
    case "fill-input":
      await page
        .getByLabel("Texto de muestra", { exact: true })
        .fill("Texto extenso de muestra para revisar el ajuste");
      break;
    case "open-select":
      await page.getByLabel("Selección de muestra").click();
      await expect(page.getByRole("listbox")).toBeVisible();
      break;
    case "open-accordion":
      await page.getByRole("button", { name: "Segundo apartado" }).click();
      await expect(
        page.getByText("Contenido de muestra del segundo apartado."),
      ).toBeVisible();
      await expect(
        page.getByText("Contenido de muestra del primer apartado."),
      ).toBeHidden();
      break;
    case "open-collapsible":
      await page.getByRole("button", { name: "Mostrar contenido" }).click();
      await expect(
        page.getByText("Contenido desplegable de muestra."),
      ).toBeVisible();
      break;
    case "open-combobox":
      await page.getByLabel("Buscar opción de muestra").press("ArrowDown");
      await expect(page.getByRole("listbox")).toBeVisible();
      break;
    case "empty-combobox":
      await page
        .getByLabel("Buscar opción de muestra")
        .fill("Sin coincidencia técnica");
      await expect(
        page.getByText("Sin coincidencias de muestra"),
      ).toBeVisible();
      break;
    case "open-dialog":
      await page
        .getByRole("button", { name: "Abrir diálogo", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      break;
    case "open-menu":
      await page
        .getByRole("button", { name: "Abrir menú", exact: true })
        .click();
      await expect(page.getByRole("menu")).toBeVisible();
      break;
    case "open-popover":
      await page
        .getByRole("button", { name: "Abrir ventana emergente" })
        .click();
      await expect(
        page.getByText("Ventana de muestra", { exact: true }),
      ).toBeVisible();
      break;
    case "open-sheet":
      await page.getByRole("button", { name: "Abrir panel lateral" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      break;
    case "second-tab":
      await page.getByRole("tab", { name: "Segunda pestaña" }).click();
      await expect(
        page.getByText("Contenido de la segunda pestaña."),
      ).toBeVisible();
      break;
    case "open-tooltip":
      await page.getByRole("button", { name: "Ayuda de muestra" }).hover();
      await expect(
        page.getByText("Información técnica de ayuda.", { exact: true }),
      ).toBeVisible();
      break;
    case "toggle-checkbox":
      await page
        .getByRole("checkbox", { name: "Opción de muestra", exact: true })
        .check();
      await expect(
        page.getByRole("checkbox", { name: "Opción de muestra", exact: true }),
      ).toBeChecked();
      break;
    case "toggle-switch":
      await page
        .getByRole("switch", { name: "Interruptor de muestra", exact: true })
        .click();
      await expect(
        page.getByRole("switch", {
          name: "Interruptor de muestra",
          exact: true,
        }),
      ).toHaveAttribute("aria-checked", "true");
      break;
    case "invalid-form":
      await page.getByRole("button", { name: "Validar muestra" }).click();
      await expect(page.getByRole("alert")).toHaveText(
        "Completa el campo de muestra",
      );
      break;
    case "valid-form":
      await page
        .getByLabel("Campo técnico de muestra")
        .fill("9007199254740993");
      await page.getByRole("button", { name: "Validar muestra" }).click();
      await expect(page.getByLabel("Resultado de la muestra")).toHaveText(
        "Validación técnica completada",
      );
      break;
    case "toggle-theme":
      await page
        .getByRole("button", { name: messages.es.header.toggleTheme })
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-color-scheme",
        theme === "light" ? "dark" : "light",
      );
      break;
    case "toggle-sidebar": {
      await page
        .getByRole("button", {
          name: messages.es.header.toggleSidebar,
          exact: true,
        })
        .click();
      if ((page.viewportSize()?.width ?? 1440) < 1280)
        await expect(page.getByRole("dialog")).toBeVisible();
      else
        await expect(
          page.locator('[data-slot="sidebar"]').first(),
        ).toHaveAttribute("data-state", "collapsed");
      break;
    }
    default:
      throw new Error(`Unknown registered interaction: ${name}`);
  }
}

async function capture(
  page: Page,
  browserVersion: string,
  info: TestInfo,
  entry: Entry,
  scenario: Scenario,
) {
  assertSnapshotUpdatesDisabled(info.config.updateSnapshots);
  if (info.project.use.headless !== true)
    throw new Error(
      "Reference capture requires the recorded headless Chromium profile",
    );
  const profile = profiles.find((item) => item.name === info.project.name)!;
  const id = `${entry.id}-${scenario.id}--${profile.name}`;
  const locale = entry.locale ?? "es";
  const environment = rendererEnvironment(browserVersion);
  const profileHash = digest(
    JSON.stringify({
      viewport: profile.viewport,
      theme: profile.theme,
      locale,
      action: scenario.action ?? null,
    }),
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  if (await page.locator("[data-products-feedback]").count()) {
    // Full-page feedback captures start at the document origin after disclosure
    // focus changes; otherwise a sticky header can retain an incidental offset.
    await page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    });
  }
  let preview: string;
  if (entry.kind === "story") {
    preview = `${origins.storybook}/?path=/story/${entry.storyId}&globals=theme:${profile.theme};locale:${locale}`;
  } else preview = `${origins[entry.app!]}${entry.path}`;
  if (mode === "capture") {
    let bytes: Buffer | undefined;
    let previous: string | undefined;
    // As with Playwright comparison, require consecutive identical rendered frames.
    // Disabling an animation can itself complete a component's open/close lifecycle.
    await expect
      .poll(
        async () => {
          const frame = await page.screenshot(screenshotOptions);
          const signature = digest(frame);
          const stable = previous === signature;
          previous = signature;
          bytes = frame;
          return stable;
        },
        { timeout: 10_000, intervals: [100] },
      )
      .toBe(true);
    if (!bytes) throw new Error("No stable candidate frame was produced");
    if (scenario.action === "open-accordion") {
      await expect(
        page.getByText("Contenido de muestra del primer apartado."),
      ).toBeHidden();
      await expect(
        page.getByText("Contenido de muestra del segundo apartado."),
      ).toBeVisible();
    }
    const file = `${id}.png`;
    await mkdir(runDirectory, { recursive: true });
    await writeFile(path.join(runDirectory, file), bytes);
    const candidate = {
      id,
      file,
      sha256: digest(bytes),
      title: `${entry.title} · ${scenario.id}`,
      profile: profile.name,
      profileHash,
      conditions: {
        viewport: profile.viewport,
        theme: profile.theme,
        locale,
        action: scenario.action ?? null,
      },
      preview,
      environment,
      sourceHash: build.sourceHash,
      limitation: entry.limitation ?? null,
    };
    info.annotations.push({
      type: "visual-review",
      description: "Candidate captured; no visual approval implied",
    });
    await info.attach("Unapproved candidate", {
      body: bytes,
      contentType: "image/png",
    });
    return candidate;
  } else {
    const registry = JSON.parse(
      await readFile(path.join(root, "visual/references.json"), "utf8"),
    ) as { cases: Record<string, Reference> };
    const reference = registry.cases[id];
    if (!reference)
      throw new Error(
        `No approved reference for ${id}; capture and review it first`,
      );
    if (reference.profileHash !== profileHash)
      throw new Error(
        `Approved profile differs for ${id}; explicit review is required`,
      );
    const referencePath = info.snapshotPath(`${id}.png`);
    validateReference(reference, await readFile(referencePath), environment);
    await expect(page).toHaveScreenshot(`${id}.png`, screenshotOptions);
    validateReference(reference, await readFile(referencePath), environment);
  }
}

for (const entry of inventory.entries)
  for (const scenario of entry.cases) {
    test(`${entry.id}-${scenario.id}`, async ({
      page,
      browser,
      context,
    }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const profile = profiles.find((item) => item.name === info.project.name)!;
      const locale = entry.locale ?? "es";
      await page.clock.setFixedTime(new Date("2026-11-12T12:00:00Z"));
      await page.addInitScript((theme) => {
        localStorage.setItem("theme-mode", theme);
        localStorage.setItem("theme", theme);
      }, profile.theme);
      await context.addCookies([
        { name: "NEXT_LOCALE", value: locale, domain: "localhost", path: "/" },
      ]);
      await page.route("https://www.youtube.com/embed/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: '<!doctype html><html lang="es"><body style="margin:0;background:#20242b;color:white;display:grid;place-items:center;height:100vh;font:16px system-ui">Documento externo sustituido · muestra técnica</body></html>',
        }),
      );
      if (entry.kind === "story") {
        const url = new URL("/iframe.html", origins.storybook);
        url.searchParams.set("id", entry.storyId!);
        url.searchParams.set("viewMode", "story");
        url.searchParams.set(
          "globals",
          `theme:${profile.theme};locale:${locale}`,
        );
        await page.goto(url.href);
        await expect(page.locator("[data-visual-stage]")).toBeVisible();
        await expect(page.locator("#storybook-error")).toBeHidden();
        await expect(page.locator("html")).toHaveAttribute(
          "data-color-scheme",
          profile.theme,
        );
      } else {
        const response = await page.goto(`${origins[entry.app!]}${entry.path}`);
        expect(response?.status()).toBe(entry.expectedStatus ?? 200);
        if (entry.app === "backoffice") {
          await expect(page.locator("html")).toHaveAttribute(
            "data-color-scheme",
            profile.theme,
          );
          if (entry.expectedStatus === 404)
            await expect(
              page.getByRole("link", {
                name: messages[locale].notFound.backHome,
              }),
            ).toBeVisible();
          else
            await expect(
              page.getByRole("button", {
                name: messages[locale].header.toggleTheme,
              }),
            ).toBeVisible();
        }
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        if (entry.app === "astroGallery" && entry.id === "astro-gallery")
          await expect(page.locator("[data-visual-gallery]")).toBeVisible();
      }
      await action(page, scenario.action, entry, profile.theme);
      expect(errors, "Uncaught browser errors").toEqual([]);
      const candidate = await capture(
        page,
        browser.version(),
        info,
        entry,
        scenario,
      );
      if (
        scenario.action === "open-dialog" ||
        scenario.action === "open-sheet"
      ) {
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
      }
      expect(errors, "Uncaught browser errors after capture").toEqual([]);
      // Publish a reviewable candidate only after every interaction check passes.
      if (candidate)
        await writeFile(
          path.join(runDirectory, `${candidate.id}.json`),
          JSON.stringify(candidate, null, 2) + "\n",
        );
    });
  }
