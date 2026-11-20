import { useLocale } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { cn } from "@/utils";
import {
  applyHierarchyChange,
  hierarchyArchiveCheck,
  type ArchiveEvidence,
  type CoreArea,
  type CoreSite,
  type HierarchyChange,
} from "./core-hierarchy-model";
import { coreHierarchyMessages } from "./core-hierarchy-messages";
import { CoreListNavigation } from "./core-team-forms";
import { coreTeamLifecycleMessages } from "./core-team-lifecycle-messages";
import { reviewPage } from "./core-team-lifecycle-model";
import { NavigationPrototype } from "./navigation-prototype";

export const coreHierarchyFixtures = [
  "overview",
  "new-site",
  "scoped-areas",
  "archive-unavailable",
  "archive-in-use",
  "restore-site",
  "read-loading",
  "read-error",
  "empty",
  "archive-filter",
  "reference-blocked",
  "unconfirmed-create",
] as const;
type Fixture = (typeof coreHierarchyFixtures)[number];
type Copy = typeof coreHierarchyMessages.es;
type ArchiveMode = "active" | "archived" | "all";
type CreateCommand =
  | Extract<HierarchyChange, { kind: "create-site" }>
  | {
      kind: "create-area";
      siteId: string;
      areaId: string;
      name: string;
    };
type PendingCreation = { id: string; command: CreateCommand };
const initialPending: PendingCreation = {
  id: "hierarchy-creation-review-1",
  command: {
    kind: "create-site",
    siteId: "site-preview-1",
    name: "Taller",
    zone: "Europe/Madrid",
    areaId: "area-preview-1",
    areaName: "Atención al público",
  },
};
export type Editor =
  | { kind: "create-site" }
  | { kind: "edit-site" | "create-area"; site: CoreSite }
  | { kind: "edit-area"; site: CoreSite; area: CoreArea };
type Lifecycle = ({ kind: "archive" } | { kind: "restore" }) & {
  site: CoreSite;
  area?: CoreArea;
};
type Panel = Editor | Lifecycle;

const fixtureSites: readonly CoreSite[] = [
  {
    id: "site-centro",
    name: "Centro",
    zone: "Europe/Madrid",
    archived: false,
    areas: [
      { id: "area-floor", name: "Sala de ventas", archived: false },
      { id: "area-stockroom", name: "Almacén", archived: false },
      { id: "area-mezzanine", name: "Altillo", archived: true },
    ],
  },
  {
    id: "site-market",
    name: "Mercado",
    zone: "Atlantic/Canary",
    archived: true,
    areas: [
      { id: "area-stand", name: "Puesto", archived: true },
      { id: "area-storage", name: "Depósito", archived: true },
    ],
  },
];
const pagedSites: readonly CoreSite[] = [
  {
    ...fixtureSites[0],
    areas: [
      ...fixtureSites[0].areas,
      { id: "area-pickup", name: "Punto de recogida", archived: false },
    ],
  },
  {
    id: "site-north",
    name: "Norte",
    zone: "Europe/Madrid",
    archived: false,
    areas: [{ id: "area-north", name: "Sala de ventas", archived: false }],
  },
  {
    id: "site-south",
    name: "Sur",
    zone: "Europe/Madrid",
    archived: false,
    areas: [{ id: "area-south", name: "Sala de ventas", archived: false }],
  },
  fixtureSites[1],
];
const fieldClass =
  "grid min-w-0 gap-1.5 font-medium text-gray-700 dark:text-gray-200";
const headerClass = "font-semibold text-gray-900 dark:text-white";
const compactAction = "max-sm:min-h-11";

function initialPanel(fixture: Fixture): Panel | null {
  if (fixture === "new-site") return { kind: "create-site" };
  if (fixture === "archive-unavailable")
    return { kind: "archive", site: fixtureSites[0] };
  if (fixture === "archive-in-use")
    return {
      kind: "archive",
      site: fixtureSites[0],
      area: fixtureSites[0].areas[0],
    };
  if (fixture === "restore-site")
    return { kind: "restore", site: fixtureSites[1] };
  if (fixture === "reference-blocked")
    return {
      kind: "archive",
      site: fixtureSites[0],
      area: fixtureSites[0].areas[1],
    };
  return null;
}

function editionTitle(editor: Editor, t: Copy) {
  switch (editor.kind) {
    case "create-site":
      return t.newSite;
    case "create-area":
      return t.newArea;
    case "edit-site":
      return t.editSite;
    case "edit-area":
      return t.editArea;
  }
}

export function HierarchyEditor({
  editor,
  t,
  sequence,
  onSave,
  onCancel,
}: {
  editor: Editor;
  t: Copy;
  sequence: number;
  onSave: (change: HierarchyChange) => void;
  onCancel: () => void;
}) {
  const siteForm = editor.kind === "create-site" || editor.kind === "edit-site";
  const [name, setName] = useState(
    editor.kind === "edit-site"
      ? editor.site.name
      : editor.kind === "edit-area"
        ? editor.area.name
        : "",
  );
  const [zone, setZone] = useState(
    editor.kind === "edit-site" ? editor.site.zone : "",
  );
  const [areaName, setAreaName] = useState("");
  const [invalidZone, setInvalidZone] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const zoneError = useId();
  const nameError = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const names = editor.kind === "create-site" ? [name, areaName] : [name];
    if (
      names.some((value) => {
        const trimmed = value.trim();
        return !trimmed || [...trimmed].length > 255 || /\p{Cc}/u.test(trimmed);
      })
    ) {
      setInvalidName(true);
      return;
    }
    if (siteForm) {
      if (zone !== zone.trim() || /^[+-]/.test(zone)) {
        setInvalidZone(true);
        return;
      }
      try {
        new Intl.DateTimeFormat("es", { timeZone: zone }).format();
      } catch {
        setInvalidZone(true);
        return;
      }
    }
    const newSite = "site-preview-" + sequence;
    const newArea = "area-preview-" + sequence;
    switch (editor.kind) {
      case "create-site":
        onSave({
          kind: editor.kind,
          siteId: newSite,
          areaId: newArea,
          name: name.trim(),
          zone,
          areaName: areaName.trim(),
        });
        break;
      case "edit-site":
        onSave({
          kind: editor.kind,
          siteId: editor.site.id,
          name: name.trim(),
          zone,
        });
        break;
      case "create-area":
        onSave({
          kind: editor.kind,
          siteId: editor.site.id,
          areaId: newArea,
          name: name.trim(),
        });
        break;
      case "edit-area":
        onSave({
          kind: editor.kind,
          siteId: editor.site.id,
          areaId: editor.area.id,
          name: name.trim(),
        });
        break;
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-4" data-core-hierarchy-editor>
      <label className={fieldClass}>
        {siteForm ? t.siteName : t.areaName}
        <Input
          value={name}
          required
          aria-describedby={invalidName ? nameError : undefined}
          onChange={(event) => {
            setName(event.currentTarget.value);
            setInvalidName(false);
          }}
        />
      </label>
      {editor.kind === "create-site" && (
        <label className={fieldClass}>
          {t.firstAreaName}
          <Input
            value={areaName}
            required
            aria-describedby={invalidName ? nameError : undefined}
            onChange={(event) => {
              setAreaName(event.currentTarget.value);
              setInvalidName(false);
            }}
          />
        </label>
      )}
      {invalidName && (
        <p
          id={nameError}
          role="alert"
          className="text-red-700 dark:text-red-300"
        >
          {t.invalidName}
        </p>
      )}
      {siteForm && (
        <label className={fieldClass}>
          {t.zone}
          <Input
            value={zone}
            required
            placeholder="Europe/Madrid"
            spellCheck={false}
            aria-invalid={invalidZone || undefined}
            aria-describedby={invalidZone ? zoneError : undefined}
            onChange={(event) => {
              setZone(event.currentTarget.value);
              setInvalidZone(false);
            }}
          />
          {invalidZone && (
            <span
              id={zoneError}
              role="alert"
              className="text-red-700 dark:text-red-300"
            >
              {t.invalidZone}
            </span>
          )}
        </label>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button type="submit">{t.save}</Button>
      </div>
    </form>
  );
}

function HierarchyLifecycle({
  panel,
  t,
  fixture,
  onSave,
  onCancel,
}: {
  panel: Lifecycle;
  t: Copy;
  fixture: Fixture;
  onSave: (change: HierarchyChange, evidence?: ArchiveEvidence) => void;
  onCancel: () => void;
}) {
  const { site, area } = panel;
  const affected = area ? [area] : site.areas;
  const [selected, setSelected] = useState("");
  const [retry, setRetry] = useState(false);
  const evidence: ArchiveEvidence = Object.fromEntries(
    affected.map((row) => [
      row.id,
      fixture === "archive-unavailable" && !retry && row.id === "area-stockroom"
        ? "unavailable"
        : fixture !== "archive-unavailable" && row.id === "area-floor"
          ? "in-use"
          : "clear",
    ]),
  );
  const check = hierarchyArchiveCheck(site, area?.id, evidence);
  const target = area?.id ?? selected;
  const archive = panel.kind === "archive";
  const checkText = (id: string) =>
    evidence[id] === "clear"
      ? t.clear
      : evidence[id] === "in-use"
        ? t.inUse
        : t.unavailable;
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (archive) {
          if (check !== "ready") return;
          onSave(
            area
              ? { kind: "archive-area", siteId: site.id, areaId: area.id }
              : { kind: "archive-site", siteId: site.id },
            evidence,
          );
        } else if (target) {
          onSave({
            kind: area ? "restore-area" : "restore-site",
            siteId: site.id,
            areaId: target,
          });
        }
      }}
    >
      <p className={headerClass}>
        {site.name}
        {area ? " · " + area.name : ""}
      </p>
      {archive ? (
        <div className="space-y-2">
          <p className={headerClass}>{t.archiveChecks}</p>
          <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 px-3 dark:divide-gray-800 dark:border-gray-800">
            {affected.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap justify-between gap-x-2 py-2"
              >
                <dt className="font-medium">{row.name}</dt>
                <dd>{checkText(row.id)}</dd>
              </div>
            ))}
          </dl>
          {check === "last-active" && <p role="status">{t.lastActive}</p>}
          {check === "unavailable" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={compactAction}
              onClick={() => setRetry(true)}
            >
              {t.checkAgain}
            </Button>
          )}
        </div>
      ) : (
        !area && (
          <label className={fieldClass}>
            {t.restoreChoice}
            <select
              value={selected}
              required
              onChange={(event) => setSelected(event.currentTarget.value)}
              className="min-h-11 min-w-0 rounded-lg border-gray-300 bg-white ps-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">{t.selectArea}</option>
              {site.areas
                .filter((row) => row.archived)
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
            </select>
          </label>
        )
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button type="submit" disabled={archive ? check !== "ready" : !target}>
          {archive ? t.archive : t.restore}
        </Button>
      </div>
    </form>
  );
}

function matchesArchive(item: { archived: boolean }, mode: ArchiveMode) {
  return mode === "all" || item.archived === (mode === "archived");
}

function ArchiveFilter({
  label,
  t,
  value,
  onChange,
}: {
  label: string;
  t: Copy;
  value: ArchiveMode;
  onChange: (mode: ArchiveMode) => void;
}) {
  return (
    <label className={fieldClass}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as ArchiveMode)}
        className="min-h-11 min-w-0 rounded-lg border-gray-300 bg-white ps-3 text-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="active">{t.activeOnly}</option>
        <option value="archived">{t.archivedOnly}</option>
        <option value="all">{t.allStates}</option>
      </select>
    </label>
  );
}

export function HierarchyWorkspace({ fixture }: { fixture: Fixture }) {
  const activeLocale = useLocale();
  const locale = isLocale(activeLocale) ? activeLocale : defaultLocale;
  const t = coreHierarchyMessages[locale];
  const directions = coreTeamLifecycleMessages[locale];
  const paged = fixture === "archive-filter";
  const [sites, setSites] = useState(
    fixture === "empty" ? [] : paged ? pagedSites : fixtureSites,
  );
  const [siteId, setSiteId] = useState(
    fixture === "restore-site" ? "site-market" : "site-centro",
  );
  const [readFailed, setReadFailed] = useState(fixture === "read-error");
  const [panel, setPanel] = useState(() => initialPanel(fixture));
  const [status, setStatus] = useState<
    "saved" | "refused" | "reference-blocked" | null
  >(fixture === "reference-blocked" ? "reference-blocked" : null);
  const [sequence, setSequence] = useState(1);
  const [pendingCreation, setPendingCreation] =
    useState<PendingCreation | null>(
      fixture === "unconfirmed-create" ? initialPending : null,
    );
  const [siteFilter, setSiteFilter] = useState<ArchiveMode>("active");
  const [areaFilter, setAreaFilter] = useState<ArchiveMode>("active");
  const [siteStart, setSiteStart] = useState(0);
  const [areaStart, setAreaStart] = useState(0);
  const owner = fixture !== "scoped-areas";
  const sitePage = reviewPage(
    sites.filter((item) => matchesArchive(item, siteFilter)),
    siteStart,
  );
  const shownSites = paged ? sitePage.items : sites;
  const site =
    shownSites.find((item) => item.id === siteId) ??
    (paged ? shownSites[0] : undefined);
  const areaPage = reviewPage(
    site?.areas.filter((item) => matchesArchive(item, areaFilter)) ?? [],
    areaStart,
  );
  const close = () => {
    setPanel(null);
    setStatus((current) => (current === "saved" ? current : null));
  };
  function establish(change: HierarchyChange, evidence: ArchiveEvidence = {}) {
    if (!owner) return;
    const answer = applyHierarchyChange(
      sites,
      change,
      evidence,
      fixture === "reference-blocked" ? ["area-stockroom"] : [],
    );
    if (answer.kind !== "saved") {
      setStatus(answer.kind);
      return;
    }
    setSequence((current) => current + 1);
    setSites(answer.sites);
    setSiteId(change.siteId);
    setStatus("saved");
    close();
    return true;
  }
  function save(change: HierarchyChange, evidence: ArchiveEvidence = {}) {
    if (!owner) return;
    if (
      fixture === "unconfirmed-create" &&
      (change.kind === "create-site" || change.kind === "create-area")
    ) {
      if (pendingCreation) return;
      setPendingCreation({
        id: `hierarchy-creation-review-${sequence}`,
        command:
          change.kind === "create-site"
            ? change
            : { ...change, kind: "create-area" },
      });
      setStatus(null);
      close();
      return;
    }
    establish(change, evidence);
  }
  const pane =
    panel?.kind === "archive"
      ? panel.area
        ? t.archiveArea
        : t.archiveSite
      : panel?.kind === "restore"
        ? panel.area
          ? t.restoreArea
          : t.restoreSite
        : panel
          ? editionTitle(panel, t)
          : "";

  return (
    <section
      data-core-hierarchy-ready={fixture}
      className="space-y-3 text-sm text-gray-700 dark:text-gray-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={cn(headerClass, "text-lg")}>{t.title}</h2>
        {owner && !readFailed && fixture !== "read-loading" && (
          <Button
            size="sm"
            className={compactAction}
            disabled={!!pendingCreation}
            onClick={() => setPanel({ kind: "create-site" })}
          >
            {t.newSite}
          </Button>
        )}
      </div>
      {status === "saved" && <p role="status">{t.saved}</p>}
      {pendingCreation && (
        <div
          data-core-pending-create={pendingCreation.id}
          className="space-y-2 rounded-lg border border-amber-300 p-3 dark:border-amber-700"
        >
          <p role="status" className={headerClass}>
            {t.createUnconfirmed}
          </p>
          {status === "refused" && <p role="alert">{t.refused}</p>}
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-2 gap-y-1">
            <dt>{t.siteName}</dt>
            <dd className="wrap-anywhere">
              {pendingCreation.command.kind === "create-site"
                ? pendingCreation.command.name
                : sites.find(
                    (item) => item.id === pendingCreation.command.siteId,
                  )?.name}
            </dd>
            {pendingCreation.command.kind === "create-site" && (
              <>
                <dt>{t.zone}</dt>
                <dd className="wrap-anywhere">
                  {pendingCreation.command.zone}
                </dd>
              </>
            )}
            <dt>{t.areaName}</dt>
            <dd className="wrap-anywhere">
              {pendingCreation.command.kind === "create-site"
                ? pendingCreation.command.areaName
                : pendingCreation.command.name}
            </dd>
          </dl>
          <Button
            size="sm"
            variant="outline"
            className={compactAction}
            onClick={() => {
              // A retained fixture response supplies the original command's result.
              if (establish(pendingCreation.command)) setPendingCreation(null);
            }}
          >
            {t.retryCreation}
          </Button>
        </div>
      )}
      {fixture === "read-loading" ? (
        <p role="status">{t.loading}</p>
      ) : readFailed ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <p role="alert">{t.readError}</p>
          <Button
            size="sm"
            variant="outline"
            className={compactAction}
            onClick={() => setReadFailed(false)}
          >
            {t.retry}
          </Button>
        </div>
      ) : !owner ? (
        <div className="space-y-2">
          <h3 className={headerClass}>{t.visibleAreas}</h3>
          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
            <p className={headerClass}>{fixtureSites[0].areas[1].name}</p>
            <p>
              {fixtureSites[0].name} · {t.areaActive}
            </p>
            <p className="text-xs">
              {t.zone} · {fixtureSites[0].zone}
            </p>
          </div>
        </div>
      ) : sites.length === 0 ? (
        <p>{t.empty}</p>
      ) : (
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(10rem,15rem)_minmax(0,1fr)]">
          <nav
            aria-label={t.sites}
            className="space-y-1 rounded-lg border border-gray-200 p-2 dark:border-gray-800"
          >
            {paged && (
              <ArchiveFilter
                label={t.siteFilter}
                t={t}
                value={siteFilter}
                onChange={(mode) => {
                  setSiteFilter(mode);
                  setSiteStart(0);
                  setAreaStart(0);
                }}
              />
            )}
            {paged && !shownSites.length && <p>{t.noSitesInFilter}</p>}
            {shownSites.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={site?.id === item.id}
                data-core-site={item.id}
                className={cn(
                  "flex w-full justify-between gap-2 whitespace-normal",
                  compactAction,
                  site?.id === item.id &&
                    "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
                )}
                onClick={() => {
                  setSiteId(item.id);
                  setAreaStart(0);
                }}
              >
                <span className="text-start wrap-anywhere">{item.name}</span>
                <span className="text-xs">
                  {item.archived ? t.archived : t.active}
                </span>
              </Button>
            ))}
            {paged && (
              <CoreListNavigation
                labels={directions}
                previous={sitePage.previous}
                next={sitePage.next}
                onPage={(start) => {
                  setSiteStart(start);
                  setAreaStart(0);
                }}
              />
            )}
          </nav>
          {site && (
            <section className="min-w-0 space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h3 className={cn(headerClass, "text-base wrap-anywhere")}>
                    {site.name}
                  </h3>
                  <p>
                    {site.archived ? t.archived : t.active} · {site.zone}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={compactAction}
                    onClick={() => setPanel({ kind: "edit-site", site })}
                  >
                    {t.editSite}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={compactAction}
                    onClick={() =>
                      setPanel({
                        kind: site.archived ? "restore" : "archive",
                        site,
                      })
                    }
                  >
                    {site.archived ? t.restoreSite : t.archiveSite}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 dark:border-gray-800">
                <h4 className={headerClass}>{t.areas}</h4>
                {!site.archived && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={compactAction}
                    disabled={!!pendingCreation}
                    onClick={() => setPanel({ kind: "create-area", site })}
                  >
                    {t.newArea}
                  </Button>
                )}
              </div>
              {paged && (
                <ArchiveFilter
                  label={t.areaFilter}
                  t={t}
                  value={areaFilter}
                  onChange={(mode) => {
                    setAreaFilter(mode);
                    setAreaStart(0);
                  }}
                />
              )}
              {paged && !areaPage.items.length && <p>{t.noAreasInFilter}</p>}
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {(paged ? areaPage.items : site.areas).map((area) => (
                  <li
                    key={area.id}
                    data-core-area={area.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-1.5"
                  >
                    <span className="wrap-anywhere">
                      <strong className={headerClass}>{area.name}</strong> ·{" "}
                      {area.archived ? t.areaArchived : t.areaActive}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={compactAction}
                        onClick={() =>
                          setPanel({ kind: "edit-area", site, area })
                        }
                      >
                        {t.editArea}
                      </Button>
                      {!site.archived && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={compactAction}
                          onClick={() =>
                            setPanel({
                              kind: area.archived ? "restore" : "archive",
                              site,
                              area,
                            })
                          }
                        >
                          {area.archived ? t.restoreArea : t.archiveArea}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {paged && (
                <CoreListNavigation
                  labels={directions}
                  previous={areaPage.previous}
                  next={areaPage.next}
                  onPage={setAreaStart}
                />
              )}
            </section>
          )}
        </div>
      )}
      <Sheet
        open={panel !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <SheetContent
          className="products-detail-panel overflow-y-auto"
          showCloseButton={false}
        >
          <SheetHeader>
            <SheetTitle>{pane}</SheetTitle>
            <SheetDescription className="sr-only">{t.title}</SheetDescription>
          </SheetHeader>
          {status === "refused" && <p role="alert">{t.refused}</p>}
          {status === "reference-blocked" && (
            <p role="alert">{t.referenceBlocked}</p>
          )}
          {panel &&
            (panel.kind === "archive" || panel.kind === "restore" ? (
              <HierarchyLifecycle
                panel={panel}
                t={t}
                fixture={fixture}
                onSave={save}
                onCancel={close}
              />
            ) : (
              <HierarchyEditor
                editor={panel}
                t={t}
                sequence={sequence}
                onSave={save}
                onCancel={close}
              />
            ))}
        </SheetContent>
      </Sheet>
    </section>
  );
}

export function CoreHierarchyPreview({ fixture }: { fixture: Fixture }) {
  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="several"
      businessSettingsContent={<HierarchyWorkspace fixture={fixture} />}
    />
  );
}
