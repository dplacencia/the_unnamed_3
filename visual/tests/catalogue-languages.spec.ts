import { test, expect, type Locator, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { inventory, readBuild } from "../runtime.ts";
import { catalogueMessages } from "../../apps/backoffice/.storybook/catalogue-messages";

const build = readBuild();

async function textContrast(elements: Locator) {
  return elements.evaluateAll((items) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    const rgba = (css: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = css;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data);
    };
    const blend = (front: number[], back: number[]) =>
      front
        .slice(0, 3)
        .map(
          (value, index) =>
            (value * front[3]) / 255 + back[index] * (1 - front[3] / 255),
        );
    const luminance = (rgb: number[]) =>
      rgb
        .map((value) => {
          const s = value / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        })
        .reduce(
          (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    return items.map((element) => {
      const ancestors: Element[] = [];
      for (
        let current: Element | null = element;
        current;
        current = current.parentElement
      )
        ancestors.unshift(current);
      const background = ancestors.reduce(
        (back, current) =>
          blend(rgba(getComputedStyle(current).backgroundColor), back),
        [255, 255, 255],
      );
      const foreground = blend(
        rgba(getComputedStyle(element).color),
        background,
      );
      const a = luminance(foreground),
        b = luminance(background);
      return {
        role: element.getAttribute("data-brand-text-role"),
        foreground,
        background,
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
      };
    });
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`ordinary brand text has sufficient composed contrast in ${theme} mode`, async ({
    page,
  }, info) => {
    await page.goto(
      `http://localhost:6006/iframe.html?id=tailadmin-compositions--brand-text-roles&viewMode=story&globals=theme:${theme};locale:en`,
    );
    await expect(page.locator("html")).toHaveAttribute(
      "data-color-scheme",
      theme,
    );
    await page.addStyleTag({
      content:
        "*,*::before,*::after{transition:none!important;animation:none!important}",
    });
    await expect(
      page.locator('[data-brand-text-role="accordion-link"]'),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const samples: {
      state: string;
      pairs: Awaited<ReturnType<typeof textContrast>>;
    }[] = [];
    const check = async (state: string) => {
      const pairs = await textContrast(page.locator("[data-brand-text-role]"));
      expect(pairs).toHaveLength(14);
      samples.push({ state, pairs });
      await info.attach(`brand-text-${theme}-${state}`, {
        body: JSON.stringify(pairs, null, 2),
        contentType: "application/json",
      });
      for (const pair of pairs)
        expect(pair.ratio, `${state}: ${pair.role}`).toBeGreaterThanOrEqual(
          4.5,
        );
    };
    await check("normal");
    await page.locator('[data-brand-text-role="field-link"]').hover();
    await check("field link hovered");
    await page.locator('[data-brand-text-role="accordion-link"]').hover();
    await check("accordion link hovered");
    await page.locator('[data-brand-text-role="pro-inactive"]').hover();
    await check("menu badge group hovered");
    await page
      .getByRole("tab", { name: catalogueMessages.en.secondTab })
      .click();
    await expect(
      page.getByRole("tab", { name: catalogueMessages.en.secondTab }),
    ).toHaveAttribute("aria-selected", "true");
    await check("second tab active");
    if (theme === "dark") {
      await expect(page.locator('[data-brand-text-role="menu"] svg')).toHaveCSS(
        "color",
        "rgb(141, 131, 187)",
      );
      await expect(page.getByRole("tab", { selected: true })).toHaveCSS(
        "border-bottom-color",
        "rgb(141, 131, 187)",
      );
      await expect(page.locator("[data-brand-disabled]")).toHaveCSS(
        "color",
        "rgb(141, 131, 187)",
      );
      await expect(
        page.locator('[data-brand-text-role="document-border"]'),
      ).toHaveCSS("border-inline-start-color", "rgb(87, 82, 140)");
    }
    await info.attach(`brand-text-${theme}-contrast`, {
      body: JSON.stringify(samples, null, 2),
      contentType: "application/json",
    });
  });
}

test.beforeAll(async () => {
  for (const origin of ["http://localhost:6006", "http://localhost:3100"]) {
    const response = await fetch(origin);
    expect(
      response.headers.get("X-Visual-Source"),
      `Current source identity at ${origin}`,
    ).toBe(build.sourceHash);
  }
});

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`backoffice ${locale}/${theme} uses the real brand font and keeps the wordmark usable in every sidebar state`, async ({
      page,
      context,
    }) => {
      const copy = JSON.parse(
        readFileSync(
          new URL(
            `../../apps/backoffice/src/messages/${locale}.json`,
            import.meta.url,
          ),
          "utf8",
        ),
      );
      await context.addCookies([
        { name: "NEXT_LOCALE", value: locale, domain: "localhost", path: "/" },
      ]);
      await page.addInitScript((mode) => {
        localStorage.setItem("theme-mode", mode);
      }, theme);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("http://localhost:3100/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute(
        "data-color-scheme",
        theme,
      );
      const wordmark = page.getByRole("link", { name: "Irin", exact: true });
      const text = wordmark.locator("span");
      await expect(text).toHaveCSS("font-size", "32px");
      await page.evaluate(() => document.fonts.ready);
      const font = await text.evaluate((element) => {
        const family = getComputedStyle(element).fontFamily;
        return {
          family,
          loaded: Array.from(document.fonts).some(
            (face) =>
              /sourceSans3/i.test(face.family) && face.status === "loaded",
          ),
        };
      });
      expect(font.family).toMatch(/sourceSans3/i);
      expect(font.loaded).toBe(true);
      const fits = () =>
        wordmark.evaluate((link) => {
          const child = link.querySelector("span")!;
          const bounds = link.getBoundingClientRect();
          const content = child.getBoundingClientRect();
          return (
            content.left >= bounds.left - 1 && content.right <= bounds.right + 1
          );
        });
      expect(await fits()).toBe(true);
      await page
        .getByRole("button", { name: copy.header.toggleSidebar })
        .click();
      await expect(text).toHaveCSS("font-size", "20px");
      await expect.poll(fits).toBe(true);
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(wordmark).toBeHidden();
      await page
        .getByRole("button", { name: copy.header.toggleSidebar })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(text).toHaveCSS("font-size", "32px");
      await expect.poll(fits).toBe(true);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
      await page.goto("http://localhost:3100/visual-missing-route");
      await expect(
        page.getByRole("link", { name: copy.notFound.backHome }),
      ).toBeVisible();
      await expect(page.getByText(/©.*Irin/)).toBeVisible();
    });
  }
}

test("the app serves the exact selected font and its original notice locally", async ({
  page,
  request,
}) => {
  const urls: string[] = [];
  page.on("request", (item) => {
    if (/\.(ttf|woff2?)(?:\?|$)/.test(item.url())) urls.push(item.url());
  });
  await page.goto("http://localhost:3100/");
  await expect(
    page.getByRole("link", { name: "Irin", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(urls.length).toBeGreaterThan(0);
  expect(urls.every((url) => url.startsWith("http://localhost:3100/"))).toBe(
    true,
  );
  const font = await request.get(urls[0]);
  expect(
    createHash("sha256")
      .update(await font.body())
      .digest("hex"),
  ).toBe("042fe2cc0b933e328410d7acbd0aa6a1873dca5aef81875f4bc214b08825c7b9");
  const notice = await request.get(
    "http://localhost:3100/licenses/source-sans-3-OFL.txt",
  );
  expect(notice.ok()).toBe(true);
  expect(
    createHash("sha256")
      .update(await notice.body())
      .digest("hex"),
  ).toBe("09746787287a289323b0ec3cff4d1a4a801331b82b7207c1e186f5d26619a392");
});

for (const theme of ["light", "dark"] as const) {
  test(`ordinary catalogue controls use the actual brand font in ${theme} mode`, async ({
    page,
  }) => {
    for (const story of ["button", "tabs", "tooltip"]) {
      await page.goto(
        `http://localhost:6006/iframe.html?id=tailadmin-primitives--${story}&viewMode=story&globals=theme:${theme};locale:en`,
      );
      const control =
        story === "tabs"
          ? page.getByRole("tab").first()
          : page.getByRole("button").first();
      await expect(control).toBeVisible();
      await expect(control).toHaveCSS(
        "font-family",
        '"Source Sans 3", sans-serif',
      );
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() =>
          Array.from(document.fonts).some(
            (face) =>
              face.family.replaceAll('"', "") === "Source Sans 3" &&
              face.status === "loaded",
          ),
        ),
      ).toBe(true);
    }
  });
}

async function selectLanguage(page: Page, language: string) {
  await page.getByRole("button", { name: /^Idioma de/ }).click();
  await page.getByText(language, { exact: true }).click();
}

for (const locale of ["es", "en", "ca", "gl", "eu"] as const) {
  test(`sample labels and validation use ${locale}`, async ({ page }) => {
    const copy = catalogueMessages[locale];
    await page.goto(
      `http://localhost:6006/iframe.html?id=tailadmin-primitives--button&viewMode=story&globals=locale:${locale}`,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("button", { name: copy.buttonLabel, exact: true }),
    ).toBeVisible();
    await page.goto(
      `http://localhost:6006/iframe.html?id=tailadmin-compositions--form&viewMode=story&globals=locale:${locale}`,
    );
    await expect(page.getByLabel(copy.formField)).toBeVisible();
    await page.getByRole("button", { name: copy.formSubmit }).click();
    await expect(page.getByRole("alert")).toHaveText(copy.formRequired);
    await page.goto(
      `http://localhost:6006/iframe.html?id=brand-explorations--basics&viewMode=story&globals=locale:${locale}`,
    );
    await expect(
      page.getByRole("heading", { name: copy.brandTitle, exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel(copy.brandSampleField)).toHaveCount(6);
  });
}

test("button default follows locale and explicit custom text stays exact", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-primitives--button",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await expect(
    frame.getByRole("button", { name: "Botón de muestra", exact: true }),
  ).toBeVisible();
  await selectLanguage(page, "English");
  await expect(
    frame.getByRole("button", { name: "Sample button", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Set string", exact: true }).click();
  await page.locator("#control-label").fill("Merchant-defined label");
  await selectLanguage(page, "Català");
  await expect(
    frame.getByRole("button", { name: "Merchant-defined label", exact: true }),
  ).toBeVisible();
});

test("brand preview retains exact input and chosen font while changing language", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/brand-explorations--basics",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  const exact = "009007199254740993.00500";
  await frame.locator("[data-brand-input]").first().fill(exact);
  await frame.getByRole("radio", { name: "Inter", exact: true }).check();
  for (const language of ["English", "Català", "Euskara"]) {
    await selectLanguage(page, language);
    await expect(frame.locator("[data-brand-input]").first()).toHaveValue(
      exact,
    );
    await expect(
      frame.getByRole("radio", { name: "Inter", exact: true }),
    ).toBeChecked();
    await expect(frame.locator("[data-brand-proposals]")).toHaveAttribute(
      "data-preview-font",
      "inter",
    );
  }
  await frame.getByRole("radio", { name: "Outfit", exact: true }).check();
  await expect(frame.locator("[data-brand-input]").first()).toHaveValue(exact);
});

for (const theme of ["light", "dark"] as const) {
  test(`brand ${theme} preview loads local fonts, keeps text contrast and fits its viewport`, async ({
    page,
  }, info) => {
    await page.setViewportSize(
      theme === "light"
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
    );
    const requests: string[] = [];
    page.on("request", (request) => {
      if (/\.(ttf|woff2?)(?:\?|$)/.test(request.url()))
        requests.push(request.url());
    });
    await page.goto(
      `http://localhost:6006/iframe.html?id=brand-explorations--basics&viewMode=story&globals=theme:${theme};locale:en`,
    );
    const root = page.locator("[data-brand-proposals]");
    await expect(root).toBeVisible();
    if (theme === "dark")
      await expect(page.locator("html")).toHaveClass(/dark/);
    else await expect(page.locator("html")).not.toHaveClass(/dark/);
    for (const [font, id, family] of [
      ["Source Sans 3", "source-sans", "Proposal Source Sans 3"],
      ["Inter", "inter", "Proposal Inter"],
      ["Outfit", "outfit", "Outfit"],
    ]) {
      await page.getByRole("radio", { name: font, exact: true }).check();
      await expect(root).toHaveAttribute("data-preview-font", id);
      await page.evaluate(() => document.fonts.ready);
      const proof = await root.evaluate(
        (element, expected) => ({
          fits:
            element.scrollWidth <=
            Math.ceil(element.getBoundingClientRect().width),
          inputFamilies: Array.from(
            element.querySelectorAll("input[data-brand-input]"),
          ).map((input) => getComputedStyle(input).fontFamily),
          loaded: Array.from(document.fonts).some(
            (face) =>
              face.family.replaceAll('"', "") === expected &&
              face.status === "loaded",
          ),
        }),
        family,
      );
      expect(proof.fits).toBe(true);
      expect(proof.loaded, `${font} font bytes loaded`).toBe(true);
      expect(proof.inputFamilies.every((value) => value.includes(family))).toBe(
        true,
      );
    }
    const contrast = await page
      .locator("[data-brand-primary]")
      .evaluateAll((buttons) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d")!;
        const colour = (css: string) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = css;
          ctx.fillRect(0, 0, 1, 1);
          return Array.from(ctx.getImageData(0, 0, 1, 1).data);
        };
        const luminance = (rgb: number[]) =>
          rgb
            .slice(0, 3)
            .map((value) => {
              const s = value / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            })
            .reduce(
              (sum, value, index) =>
                sum + value * [0.2126, 0.7152, 0.0722][index],
              0,
            );
        return buttons.map((button) => {
          const style = getComputedStyle(button);
          const foreground = colour(style.color),
            background = colour(style.backgroundColor);
          const a = luminance(foreground),
            b = luminance(background);
          return {
            palette: button
              .closest("[data-palette]")
              ?.getAttribute("data-palette"),
            ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
            opaque: foreground[3] === 255 && background[3] === 255,
          };
        });
      });
    expect(contrast).toHaveLength(6);
    for (const pair of contrast) {
      expect(pair.opaque).toBe(true);
      expect(pair.ratio, pair.palette ?? "palette").toBeGreaterThanOrEqual(4.5);
    }
    expect(requests.some((url) => url.includes("source-sans-3"))).toBe(true);
    expect(requests.some((url) => url.includes("inter-"))).toBe(true);
    expect(
      requests.every((url) => url.startsWith("http://localhost:6006/")),
    ).toBe(true);
    await info.attach(`brand-${theme}-contrast`, {
      body: JSON.stringify(contrast, null, 2),
      contentType: "application/json",
    });
  });
}

test("visible form errors translate without clearing entered values or status", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-compositions--form",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("button", { name: "Validar muestra" }).click();
  await expect(frame.getByRole("alert")).toHaveText(
    "Completa el campo de muestra",
  );
  await selectLanguage(page, "English");
  await expect(frame.getByRole("alert")).toHaveText(
    "Complete the sample field",
  );
  await frame.getByLabel("Sample technical field").fill("9007199254740993");
  await selectLanguage(page, "Català");
  await expect(frame.getByRole("textbox")).toHaveValue("9007199254740993");
  await frame.getByRole("button", { name: /Valid/ }).click();
  await selectLanguage(page, "English");
  await expect(frame.getByLabel("Sample result")).toHaveText(
    "Technical validation complete",
  );
});

test("an open dialog translates without resetting its open state", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:6006/?path=/story/tailadmin-primitives--dialog",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame
    .getByRole("button", { name: "Abrir diálogo", exact: true })
    .click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await selectLanguage(page, "English");
  await expect(
    frame.getByRole("dialog", { name: "Sample dialog" }),
  ).toBeVisible();
  await expect(
    frame.getByRole("button", { name: "Close", exact: true }),
  ).toBeVisible();
});

test("all English examples render without Spanish fixture copy or translation errors", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>External document replaced for this technical check.</p>",
    }),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const entry of inventory.entries.filter(
    (item) => item.kind === "story",
  )) {
    await page.goto(
      `http://localhost:6006/iframe.html?id=${entry.storyId}&viewMode=story&globals=locale:en`,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const stage = page.locator("[data-visual-stage]");
    await expect(stage).toBeVisible();
    expect(await stage.innerText(), entry.id).not.toMatch(
      /muestra|técnic[oa]|opción|apartado|desactivad|pestaña|desplazamiento/i,
    );
  }
  expect(errors).toEqual([]);
});
