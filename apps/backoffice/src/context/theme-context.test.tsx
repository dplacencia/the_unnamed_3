import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { installMediaQueries } from "@/test/media-queries";
import { ThemeProvider, useTheme } from "./theme-context";

function Probe() {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
  return (
    <>
      <output aria-label="Resolved theme">{theme}</output>
      <output aria-label="Theme preference">{themeMode}</output>
      <button onClick={() => setThemeMode("auto")}>Automatic theme</button>
      <button onClick={toggleTheme}>Toggle theme</button>
    </>
  );
}

const tree = () => (
  <ThemeProvider>
    <Probe />
  </ThemeProvider>
);
const resolved = () => screen.getByLabelText("Resolved theme").textContent;
const preference = () => screen.getByLabelText("Theme preference").textContent;

describe("retained TailAdmin theme behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-color-scheme");
    installMediaQueries();
  });

  it("retains the vendor light default and persists explicit toggles", () => {
    render(tree());
    expect(resolved()).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(resolved()).toBe("dark");
    expect(preference()).toBe("dark");
    expect(localStorage.getItem("theme-mode")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("restores the saved preference ahead of the legacy resolved theme", () => {
    localStorage.setItem("theme-mode", "dark");
    localStorage.setItem("theme", "light");
    render(tree());
    expect(resolved()).toBe("dark");
    expect(preference()).toBe("dark");
  });

  it("tracks the operating-system preference in automatic mode", () => {
    const media = installMediaQueries(1440, true);
    render(tree());
    fireEvent.click(screen.getByRole("button", { name: "Automatic theme" }));
    expect(preference()).toBe("auto");
    expect(resolved()).toBe("dark");
    act(() => media.setDark(false));
    expect(resolved()).toBe("light");
    expect(localStorage.getItem("theme-mode")).toBe("auto");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe(
      "light",
    );
  });

  it("does not expose an invalid stored theme as a supported mode", () => {
    localStorage.setItem("theme-mode", "ultraviolet");
    render(tree());
    expect(preference()).toBe("light");
    expect(resolved()).toBe("light");
  });

  it("keeps the shell usable when browser preference storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    render(tree());
    expect(resolved()).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(resolved()).toBe("dark");
  });

  it("hydrates without replacing a saved preference with the server default", async () => {
    localStorage.setItem("theme-mode", "dark");
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree());
    expect(container.textContent).toContain("light");
    document.body.append(container);
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, tree());
    });
    await waitFor(() => expect(resolved()).toBe("dark"));
    expect(localStorage.getItem("theme-mode")).toBe("dark");
    act(() => root.unmount());
    container.remove();
  });
});
