import { describe, expect, it } from "vitest";
import {
  accessFor,
  initialNavigation,
  navigate,
  resolveLocation,
  restoreChoices,
} from "./navigation-model";

describe("merchant navigation preview behavior", () => {
  it("opens the destination's module while preserving independent page choices", () => {
    const state = {
      ...initialNavigation("home"),
      choices: { stock: "stockroom" },
    };
    expect(navigate(state, { type: "page", page: "movements" })).toEqual({
      page: "movements",
      openGroup: "inventory",
      choices: { stock: "stockroom" },
    });
  });
  it("keeps at most one expanded group and allows closing it", () => {
    const state = initialNavigation("stock");
    const next = navigate(state, { type: "group", group: "fixture-only" });
    expect(next.openGroup).toBe("fixture-only");
    expect(
      navigate(next, { type: "group", group: "fixture-only" }).openGroup,
    ).toBeNull();
  });
  it("does not turn unresolved permission information into known denial", () => {
    expect(accessFor("loading")).toEqual({
      status: "loading",
      destinations: null,
    });
    expect(accessFor("error")).toEqual({ status: "error", destinations: null });
    expect(accessFor("no-module")).toEqual({
      status: "ready",
      destinations: ["home", "modules", "business-settings", "help"],
    });
  });
  it("filters known restricted sections without disabling the business module", () => {
    const access = accessFor("restricted");
    expect(access.status).toBe("ready");
    expect(access.destinations).toContain("products");
    expect(access.destinations).not.toContain("stock");
  });
  it("remembers two pages' choices independently through navigation", () => {
    let state = navigate(initialNavigation("stock"), {
      type: "location",
      page: "stock",
      location: "stockroom",
    });
    state = navigate(state, { type: "page", page: "movements" });
    state = navigate(state, {
      type: "location",
      page: "movements",
      location: "sales-floor",
    });
    state = navigate(state, { type: "page", page: "stock" });
    expect(state.choices).toEqual({
      stock: "stockroom",
      movements: "sales-floor",
    });
  });
  it("chooses a sole accessible location without guessing among several or substituting an invalid saved choice", () => {
    expect(resolveLocation(undefined, ["stockroom"])).toBe("stockroom");
    expect(
      resolveLocation(undefined, ["stockroom", "sales-floor"]),
    ).toBeUndefined();
    expect(resolveLocation("stockroom", ["stockroom", "sales-floor"])).toBe(
      "stockroom",
    );
    expect(resolveLocation("removed", ["stockroom"])).toBeUndefined();
  });
  it("restores only valid page/location entries from tab storage", () => {
    expect(
      restoreChoices('{"stock":"stockroom","home":"stockroom","counts":42}'),
    ).toEqual({ stock: "stockroom" });
    expect(restoreChoices("broken")).toEqual({});
    expect(restoreChoices("null")).toEqual({});
  });
  it("does not restore another document's copied tab storage on fresh preview entry", () => {
    const saved = '{"stock":"stockroom"}';
    expect(restoreChoices(saved, "navigate")).toEqual({});
    expect(restoreChoices(saved, "reload")).toEqual({ stock: "stockroom" });
  });
});
