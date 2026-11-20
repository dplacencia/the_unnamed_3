export type CoreArea = { id: string; name: string; archived: boolean };
export type CoreSite = {
  id: string;
  name: string;
  zone: string;
  archived: boolean;
  areas: readonly CoreArea[];
};

export type ArchiveEvidence = Readonly<
  Partial<Record<string, "clear" | "in-use" | "unavailable">>
>;

export function hierarchyArchiveCheck(
  site: CoreSite,
  areaId: string | undefined,
  evidence: ArchiveEvidence,
) {
  if (site.archived) return "refused";
  const area = site.areas.find((item) => item.id === areaId);
  if (areaId && (!area || area.archived)) return "refused";
  if (area && site.areas.filter((item) => !item.archived).length === 1)
    return "last-active";

  const affected = area ? [area] : site.areas;
  if (affected.some((item) => evidence[item.id] === "in-use")) return "in-use";
  if (affected.some((item) => evidence[item.id] !== "clear"))
    return "unavailable";
  return "ready";
}

export type HierarchyChange =
  | {
      kind: "create-site";
      siteId: string;
      areaId: string;
      name: string;
      zone: string;
      areaName: string;
    }
  | { kind: "edit-site"; siteId: string; name: string; zone: string }
  | {
      kind: "create-area" | "edit-area";
      siteId: string;
      areaId: string;
      name: string;
    }
  | { kind: "archive-site"; siteId: string }
  | {
      kind: "archive-area" | "restore-site" | "restore-area";
      siteId: string;
      areaId: string;
    };

function siteAfterChange(
  site: CoreSite,
  change: Exclude<HierarchyChange, { kind: "create-site" }>,
  evidence: ArchiveEvidence,
): CoreSite | undefined {
  const area =
    "areaId" in change
      ? site.areas.find((item) => item.id === change.areaId)
      : undefined;
  function updateArea(update: Partial<CoreArea>) {
    return site.areas.map((item) =>
      item === area ? { ...item, ...update } : item,
    );
  }

  switch (change.kind) {
    case "edit-site":
      return { ...site, name: change.name, zone: change.zone };
    case "create-area":
      if (site.archived || area) return;
      return {
        ...site,
        areas: [
          ...site.areas,
          { id: change.areaId, name: change.name, archived: false },
        ],
      };
    case "edit-area":
      if (area) return { ...site, areas: updateArea({ name: change.name }) };
      return;
    case "archive-site":
      if (hierarchyArchiveCheck(site, undefined, evidence) !== "ready") return;
      return {
        ...site,
        archived: true,
        areas: site.areas.map((item) => ({ ...item, archived: true })),
      };
    case "archive-area":
      if (hierarchyArchiveCheck(site, change.areaId, evidence) !== "ready")
        return;
      return { ...site, areas: updateArea({ archived: true }) };
    case "restore-site":
      if (!site.archived || !area?.archived) return;
      return {
        ...site,
        archived: false,
        areas: updateArea({ archived: false }),
      };
    case "restore-area":
      if (site.archived || !area?.archived) return;
      return { ...site, areas: updateArea({ archived: false }) };
  }
}

export function applyHierarchyChange(
  sites: readonly CoreSite[],
  change: HierarchyChange,
  evidence: ArchiveEvidence,
  referencedIds: readonly string[] = [],
): {
  kind: "saved" | "refused" | "reference-blocked";
  sites: readonly CoreSite[];
} {
  const site = sites.find((item) => item.id === change.siteId);
  if (
    site &&
    (change.kind === "archive-site" || change.kind === "archive-area")
  ) {
    const targetIds =
      change.kind === "archive-site"
        ? [site.id, ...site.areas.map((area) => area.id)]
        : [change.areaId];
    if (targetIds.some((id) => referencedIds.includes(id)))
      return { kind: "reference-blocked", sites };
  }
  if (change.kind === "create-site") {
    if (site) return { kind: "refused", sites };
    return {
      kind: "saved",
      sites: [
        ...sites,
        {
          id: change.siteId,
          name: change.name,
          zone: change.zone,
          archived: false,
          areas: [
            { id: change.areaId, name: change.areaName, archived: false },
          ],
        },
      ],
    };
  }
  const next = site && siteAfterChange(site, change, evidence);
  return next
    ? {
        kind: "saved",
        sites: sites.map((item) => (item === site ? next : item)),
      }
    : { kind: "refused", sites };
}
