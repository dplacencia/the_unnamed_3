import { act, fireEvent, render, screen } from "@testing-library/react";
import { useTranslations } from "next-intl";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider, useLocalePreference } from "./locale-provider";

function Probe() {
  const t = useTranslations("common");
  const { locale, setLocale } = useLocalePreference();
  return (
    <>
      <output aria-label="Locale">{locale}</output>
      <output aria-label="Home label">{t("home")}</output>
      <button onClick={() => setLocale("ca")}>Choose Catalan</button>
      <button
        onClick={() => {
          const persisted = setLocale("en");
          document.getElementById("persistence")!.textContent =
            String(persisted);
        }}
      >
        Choose English
      </button>
      <output id="persistence" aria-label="Preference persisted" />
    </>
  );
}

const tree = () => (
  <LocaleProvider>
    <Probe />
  </LocaleProvider>
);

describe("static backoffice locale preference", () => {
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=; Path=/; Max-Age=0";
    document.documentElement.lang = "es";
    vi.stubGlobal("navigator", { language: "en-US", languages: ["en-US"] });
  });

  it("uses Spanish without inferring or writing a browser preference", () => {
    const write = vi.spyOn(document, "cookie", "set");
    render(tree());
    expect(screen.getByLabelText("Locale").textContent).toBe("es");
    expect(screen.getByLabelText("Home label").textContent).toBe("Inicio");
    expect(document.documentElement.lang).toBe("es");
    expect(write).not.toHaveBeenCalled();
  });

  it.each([
    ["es", "Inicio"],
    ["en", "Home"],
    ["ca", "Inici"],
    ["gl", "Inicio"],
    ["eu", "Hasiera"],
  ])("restores the explicit %s preference", (locale, home) => {
    document.cookie = `NEXT_LOCALE=${locale}; Path=/`;
    const write = vi.spyOn(document, "cookie", "set");
    render(tree());
    expect(screen.getByLabelText("Locale").textContent).toBe(locale);
    expect(screen.getByLabelText("Home label").textContent).toBe(home);
    expect(document.documentElement.lang).toBe(locale);
    expect(write).not.toHaveBeenCalled();
  });

  it("falls back to Spanish for an unsupported preference", () => {
    document.cookie = "NEXT_LOCALE=fr; Path=/";
    render(tree());
    expect(screen.getByLabelText("Locale").textContent).toBe("es");
  });

  it("tolerates blocked cookie access without losing the local UI", () => {
    vi.spyOn(document, "cookie", "get").mockImplementation(() => {
      throw new DOMException("Cookie access blocked", "SecurityError");
    });
    render(tree());
    expect(screen.getByLabelText("Locale").textContent).toBe("es");
    fireEvent.click(screen.getByRole("button", { name: "Choose English" }));
    expect(screen.getByLabelText("Locale").textContent).toBe("en");
    expect(screen.getByLabelText("Preference persisted").textContent).toBe(
      "false",
    );
  });

  it("changes language explicitly with a one-year host-only cookie", () => {
    const write = vi.spyOn(document, "cookie", "set");
    render(tree());
    fireEvent.click(screen.getByRole("button", { name: "Choose Catalan" }));
    expect(screen.getByLabelText("Home label").textContent).toBe("Inici");
    expect(document.documentElement.lang).toBe("ca");
    expect(document.cookie).toContain("NEXT_LOCALE=ca");
    const cookie = write.mock.calls.at(-1)![0];
    expect(cookie).toMatch(/Max-Age=31536000/i);
    expect(cookie).toMatch(/Path=\//i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).not.toMatch(/Domain=/i);
  });

  it("reports an ignored cookie write as unavailable persistence", () => {
    vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
    render(tree());
    fireEvent.click(screen.getByRole("button", { name: "Choose English" }));
    expect(screen.getByLabelText("Locale").textContent).toBe("en");
    expect(screen.getByLabelText("Preference persisted").textContent).toBe(
      "false",
    );
  });

  it("marks production preference cookies Secure", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      const write = vi
        .spyOn(document, "cookie", "set")
        .mockImplementation(() => {});
      render(tree());
      fireEvent.click(screen.getByRole("button", { name: "Choose English" }));
      expect(write.mock.calls.at(-1)![0]).toMatch(/; Secure$/);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("hydrates from a neutral document into the remembered language", async () => {
    document.cookie = "NEXT_LOCALE=en; Path=/";
    const write = vi.spyOn(document, "cookie", "set");
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree());
    expect(
      container.querySelector('[role="status"][aria-busy="true"]'),
    ).not.toBeNull();
    expect(container.textContent).toBe("");
    document.body.append(container);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, tree(), {
        onRecoverableError: (error) => errors.push(error),
      });
    });
    expect(container.querySelector('[aria-label="Locale"]')?.textContent).toBe(
      "en",
    );
    expect(
      container.querySelector('[aria-label="Home label"]')?.textContent,
    ).toBe("Home");
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(errors).toEqual([]);
    expect(write).not.toHaveBeenCalled();
    await act(async () => root!.unmount());
    container.remove();
  });
});
