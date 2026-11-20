import { describe, expect, it } from "vitest";
import {
  applyHierarchyChange,
  hierarchyArchiveCheck,
  type CoreSite,
} from "./core-hierarchy-model";

const site: CoreSite = {
  id: "site-a",
  name: "Centro",
  zone: "Europe/Madrid",
  archived: false,
  areas: [
    { id: "area-a", name: "Sala", archived: false },
    { id: "area-b", name: "Almacén", archived: true },
  ],
};

describe("Core hierarchy preview", () => {
  it("preserves the entire hierarchy when Core holds an explicit archive reference", () => {
    const current = [site];
    expect(
      applyHierarchyChange(
        current,
        { kind: "archive-site", siteId: site.id },
        { "area-a": "clear", "area-b": "clear" },
        ["area-b"],
      ),
    ).toEqual({ kind: "reference-blocked", sites: current });
  });

  it("pauses a Site archive when any Area confirmation is unavailable", () => {
    expect(hierarchyArchiveCheck(site, undefined, { "area-a": "clear" })).toBe(
      "unavailable",
    );
  });

  it("keeps the last active Area in an active Site", () => {
    expect(hierarchyArchiveCheck(site, "area-a", { "area-a": "clear" })).toBe(
      "last-active",
    );
  });

  it("restores the original Site and exactly the selected Area", () => {
    const archived = {
      ...site,
      archived: true,
      areas: site.areas.map((area) => ({ ...area, archived: true })),
    };
    const result = applyHierarchyChange(
      [archived],
      { kind: "restore-site", siteId: site.id, areaId: "area-b" },
      {},
    );
    expect(result.kind).toBe("saved");
    expect(result.sites).toEqual([
      {
        ...site,
        areas: [
          { ...site.areas[0], archived: true },
          { ...site.areas[1], archived: false },
        ],
      },
    ]);
  });

  it("rejects a Site restore for an Area outside that Site", () => {
    const archived = { ...site, archived: true };
    const current = [archived];
    expect(
      applyHierarchyChange(
        current,
        { kind: "restore-site", siteId: site.id, areaId: "foreign-area" },
        {},
      ),
    ).toEqual({ kind: "refused", sites: current });
  });
});
