import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Locale } from "@/i18n/configuration";
import {
  copy,
  defaultView,
  products,
  stockText,
  type Candidate,
  type Copy,
  type Product,
  type View,
} from "./model";
import "./comparison.css";

const TanStack = lazy(() =>
  import("./tanstack").then((m) => ({ default: m.TanStackAdapter })),
);
const Tabulator = lazy(() =>
  import("./tabulator").then((m) => ({ default: m.TabulatorAdapter })),
);
const noteSchema = z.object({ note: z.string().max(80) });
function readView(candidate: Candidate, business: string): View {
  const stored = sessionStorage.getItem(
    `irin-grid-qualification:${candidate}:${business}`,
  );
  return stored ? (JSON.parse(stored) as View) : defaultView;
}
const subscribePhone = (fn: () => void) => {
  const query = matchMedia("(max-width: 639px)");
  query.addEventListener("change", fn);
  return () => query.removeEventListener("change", fn);
};

function NoteForm({
  record,
  text,
  onDraft,
}: {
  record: Product;
  text: Copy;
  onDraft: (id: string, value: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { note: record.note },
    resolver: zodResolver(noteSchema),
  });
  return (
    <form onSubmit={handleSubmit(({ note }) => onDraft(record.id, note))}>
      <label>
        {text.note}
        <input {...register("note")} aria-invalid={Boolean(errors.note)} />
      </label>
      {errors.note && <p role="alert">{text.note}: max. 80</p>}
      <Button type="submit" size="sm" variant="outline">
        {text.save}
      </Button>
    </form>
  );
}

export function GridComparison({
  candidate,
  size = 100,
}: {
  candidate: Candidate;
  size?: number;
}) {
  const locale = useLocale() as Locale;
  const text = copy[locale];
  const [business, setBusiness] = useState("a");
  const [view, setView] = useState<View>(() => readView(candidate, "a"));
  const [query, setQuery] = useState(view.query);
  const [filterDraft, setFilterDraft] = useState(view.archived);
  const [count, setCount] = useState(size);
  const [generation, setGeneration] = useState(0);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [details, setDetails] = useState<string | null>(null);
  const [panelEditing, setPanelEditing] = useState(false);
  const [outcome, setOutcome] = useState("confirmed");
  const [status, setStatus] = useState("");
  const [resultCount, setResultCount] = useState(0);
  const [ready, setReady] = useState(false);
  const started = useRef(0);
  const activeOperation = useRef(0);
  const [operation, setOperation] = useState(0);
  const [duration, setDuration] = useState(0);
  const phone = useSyncExternalStore(
    subscribePhone,
    () => matchMedia("(max-width: 639px)").matches,
    () => false,
  );
  const records = useMemo(
    () =>
      products(count).map((record) =>
        saved[record.id] === undefined
          ? record
          : { ...record, note: saved[record.id] },
      ),
    [count, saved],
  );
  const storage = `irin-grid-qualification:${candidate}:${business}`;
  useEffect(() => {
    sessionStorage.setItem(storage, JSON.stringify(view));
  }, [view, storage]);
  const begin = () => {
    started.current = performance.now();
    setReady(false);
    setOperation(++activeOperation.current);
  };
  const update = (next: Partial<View>) => {
    begin();
    setView((current) => ({ ...current, ...next }));
  };
  const onReady = useCallback(
    (total: number) => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (operation !== activeOperation.current) return;
          setResultCount(total);
          setReady(true);
          if (started.current) setDuration(performance.now() - started.current);
        }),
      );
    },
    [operation],
  );
  const onDraft = useCallback(
    (id: string, value: string) =>
      setDrafts((current) => ({ ...current, [id]: value })),
    [],
  );
  const onExpand = useCallback(
    (id: string) =>
      setExpanded((current) => ({ ...current, [id]: !current[id] })),
    [],
  );
  const active = records.find((record) => record.id === details);
  const Adapter = candidate === "tanstack" ? TanStack : Tabulator;
  const save = () => {
    setStatus(text[outcome as "confirmed" | "rejected" | "uncertain"]);
    if (outcome === "confirmed") {
      setSaved((current) => ({ ...current, ...drafts }));
      setDrafts({});
      setEditing(false);
    }
  };
  return (
    <section
      className="grid-comparison"
      data-grid-comparison={candidate}
      data-ready={String(ready)}
      data-duration={duration}
      data-operation={operation}
    >
      <header>
        <h1>{text.products}</h1>
        <span>{candidate === "tanstack" ? "TanStack Table" : "Tabulator"}</span>
      </header>
      <div className="grid-controls">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            update({ query });
          }}
        >
          <input
            type="search"
            aria-label={text.search}
            placeholder={text.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button size="sm" type="submit">
            {text.find}
          </Button>
        </form>
        <label>
          <input
            type="checkbox"
            checked={view.stock}
            onChange={(event) => update({ stock: event.target.checked })}
          />
          {text.showStock}
        </label>
        {view.stock && (
          <label>
            {text.location}
            <select
              aria-label={text.location}
              value={view.location}
              onChange={(event) => update({ location: event.target.value })}
            >
              <option value="">{text.choose}</option>
              <option value="shop">{text.shop}</option>
              <option value="store">{text.store}</option>
            </select>
          </label>
        )}
        <details>
          <summary>{text.view}</summary>
          <div className="grid-menu">
            <label>
              <input
                data-control="comfortable"
                type="checkbox"
                checked={view.comfortable}
                onChange={(event) =>
                  update({ comfortable: event.target.checked })
                }
              />
              {text.comfortable}
            </label>
            <label>
              <input
                data-control="sku-visible"
                type="checkbox"
                checked={view.skuVisible}
                onChange={(event) =>
                  update({ skuVisible: event.target.checked })
                }
              />
              {text.sku}
            </label>
            <Button
              data-control="sku-first"
              variant="outline"
              size="sm"
              onClick={() => update({ skuFirst: !view.skuFirst })}
            >
              {text.sku} ↔ {text.products}
            </Button>
            <label>
              {text.products} px
              <input
                data-control="width"
                type="range"
                min="180"
                max="400"
                step="20"
                value={view.width}
                onChange={(event) =>
                  update({ width: Number(event.target.value) })
                }
              />
            </label>
          </div>
        </details>
        <details
          data-filters
          onToggle={(event) => {
            if (!event.currentTarget.open) setFilterDraft(view.archived);
          }}
        >
          <summary>{text.filters}</summary>
          <div className="grid-menu">
            <label>
              <input
                type="checkbox"
                checked={filterDraft}
                onChange={(event) => setFilterDraft(event.target.checked)}
              />
              {text.archived}
            </label>
            <Button
              size="sm"
              onClick={(event) => {
                update({ archived: filterDraft });
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
            >
              {text.apply}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(event) => {
                setFilterDraft(view.archived);
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
            >
              {text.cancel}
            </Button>
          </div>
        </details>
        {!editing ? (
          <Button
            data-action="edit"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            {text.edit}
          </Button>
        ) : (
          <>
            <Button data-action="save" size="sm" onClick={save}>
              {text.save}
            </Button>
            <Button
              data-action="cancel"
              variant="outline"
              size="sm"
              onClick={() => {
                setDrafts({});
                setEditing(false);
                setStatus("");
              }}
            >
              {text.cancel}
            </Button>
          </>
        )}
      </div>
      <Suspense fallback={<div role="status">…</div>}>
        <Adapter
          key={`${count}:${generation}:${business}`}
          records={records}
          view={view}
          text={text}
          phone={phone}
          editing={editing}
          drafts={drafts}
          expanded={expanded}
          onDraft={onDraft}
          onExpand={onExpand}
          onDetails={(id) => {
            setPanelEditing(false);
            setDetails(id);
          }}
          onSort={(field) =>
            update({
              sort: field,
              desc: view.sort === field ? !view.desc : false,
            })
          }
          onReady={onReady}
        />
      </Suspense>
      <footer>
        <output aria-label="Resultados" data-result-count>
          {resultCount}
        </output>
        <span data-save-status role="status">
          {status}
        </span>
        <output data-confirmed-note>{saved["product-1"] ?? ""}</output>
        <output data-draft-count>{Object.keys(drafts).length}</output>
      </footer>
      <details className="grid-probes">
        <summary>Evaluation</summary>
        <div className="grid-controls">
          <label>
            Records
            <select
              data-control="size"
              value={count}
              onChange={(event) => {
                begin();
                setCount(Number(event.target.value));
              }}
            >
              <option>100</option>
              <option>1000</option>
              <option>10000</option>
            </select>
          </label>
          <Button
            data-action="remount"
            variant="outline"
            size="sm"
            onClick={() => {
              begin();
              setGeneration((n) => n + 1);
            }}
          >
            Remount
          </Button>
          <label>
            Business
            <select
              data-control="business"
              value={business}
              onChange={(event) => {
                const next = readView(candidate, event.target.value);
                setView(next);
                setQuery(next.query);
                setFilterDraft(next.archived);
                setBusiness(event.target.value);
              }}
            >
              <option>a</option>
              <option>b</option>
            </select>
          </label>
          <label>
            Save result
            <select
              data-control="outcome"
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
            >
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="uncertain">Unknown</option>
            </select>
          </label>
        </div>
      </details>
      <Sheet
        open={details !== null}
        onOpenChange={(open) => {
          if (!open) setDetails(null);
        }}
      >
        <SheetContent className="grid-detail-panel" closeLabel={text.close}>
          <SheetHeader>
            <SheetTitle>{text.details}</SheetTitle>
            <SheetDescription>
              {active?.product} · {active?.sku}
            </SheetDescription>
          </SheetHeader>
          {active && (
            <>
              <p>{active.id}</p>
              <p>
                {text.stock}: {stockText(active, view, text)}
              </p>
              <p data-panel-note>{drafts[active.id] ?? active.note}</p>
              {panelEditing ? (
                <NoteForm
                  key={active.id}
                  record={{ ...active, note: drafts[active.id] ?? active.note }}
                  text={text}
                  onDraft={(id, value) => {
                    onDraft(id, value);
                    setEditing(true);
                    setPanelEditing(false);
                  }}
                />
              ) : (
                <Button
                  data-action="panel-edit"
                  size="sm"
                  variant="outline"
                  onClick={() => setPanelEditing(true)}
                >
                  {text.editDetails}
                </Button>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
