"use client";

import { useLocale } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { inventorySetupMessages } from "./inventory-setup-messages";
import {
  InventoryScheduleFields,
  inventoryScheduleMode,
} from "./inventory-schedule-fields";
import {
  channelNameValid,
  continuousCalendar,
  placementFor,
  simulateSetup,
  stockSetupEligible,
  type AreaSetup,
  type SetupChannel,
  type SetupCommand,
  type SetupReply,
  type StockCalendar,
} from "./inventory-setup-model";
import { NavigationPrototype } from "./navigation-prototype";
import "./products-table-preview.css";

export type {
  AreaSetup,
  SetupChannel,
  SetupCommand,
} from "./inventory-setup-model";

export type InventorySetupPreset =
  | "overview"
  | "stock-location"
  | "scheduled-calendar"
  | "create-channel"
  | "enable-channel"
  | "unavailable"
  | "unconfirmed";
type Copy = (typeof inventorySetupMessages)["es"];
type Panel =
  | { kind: "stock"; areaId: string }
  | { kind: "channel" }
  | { kind: "enable" }
  | { kind: "unconfirmed" }
  | { kind: "result"; reply: SetupReply; action: SetupCommand["kind"] };

const seedAreas: AreaSetup[] = [
  {
    id: "area-ventas",
    name: "Sala de ventas",
    siteId: "site-centro",
    siteName: "Tienda Centro",
    active: true,
    canSetUpStock: true,
    canEnableChannel: true,
    stock: {
      kind: "linked",
      location: {
        id: "stock-341",
        active: true,
        enabledChannelIds: ["counter", "web"],
      },
    },
  },
  {
    id: "area-almacen",
    name: "Almacén",
    siteId: "site-centro",
    siteName: "Tienda Centro",
    active: true,
    canSetUpStock: true,
    canEnableChannel: true,
    stock: { kind: "absent" },
  },
  {
    id: "area-recogida",
    name: "Zona de recogida",
    siteId: "site-norte",
    siteName: "Tienda Norte",
    active: true,
    canSetUpStock: true,
    canEnableChannel: true,
    stock: { kind: "unavailable" },
  },
];
const seedChannels: SetupChannel[] = [
  { id: "counter", name: "Mostrador" },
  { id: "web", name: "Tienda en línea" },
  { id: "delivery", name: "Reparto" },
];
const field =
  "min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

function Scope({ area, copy }: { area: AreaSetup; copy: Copy }) {
  return (
    <dl className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div>
        <dt className="font-semibold">{copy.site}</dt>
        <dd>{area.siteName}</dd>
        <dd className="font-mono text-xs break-all">{area.siteId}</dd>
      </div>
      <div>
        <dt className="font-semibold">{copy.area}</dt>
        <dd>{area.name}</dd>
        <dd className="font-mono text-xs break-all">{area.id}</dd>
      </div>
    </dl>
  );
}

export function CalendarForm({
  area,
  copy,
  submit,
  close,
  scheduledAvailable = false,
}: {
  area: AreaSetup;
  copy: Copy;
  submit(command: SetupCommand): void;
  close(): void;
  scheduledAvailable?: boolean;
}) {
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const id = useId();
  const [mode, setMode] = useState(scheduledAvailable ? "scheduled" : "");
  const [boundary, setBoundary] = useState("");
  const [schedule, setSchedule] = useState<StockCalendar | null>(null);
  const continuous = continuousCalendar(boundary);
  const calendar = mode === "scheduled" ? schedule : continuous;
  const invalid = boundary.length > 0 && !continuous;
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode && calendar)
      submit({
        kind: "stock",
        operationId: crypto.randomUUID(),
        areaId: area.id,
        calendar,
      });
  }
  return (
    <form className="space-y-4" onSubmit={send}>
      <Scope area={area} copy={copy} />
      <label className="block space-y-1 font-medium">
        <span>{copy.calendar}</span>
        <select
          className={field}
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
            setSchedule(null);
          }}
          required
        >
          <option value="" disabled>
            {copy.chooseCalendar}
          </option>
          <option value="continuous">{copy.continuous}</option>
          {scheduledAvailable && (
            <option value="scheduled">{inventoryScheduleMode(locale)}</option>
          )}
        </select>
      </label>
      {mode === "scheduled" && <InventoryScheduleFields change={setSchedule} />}
      {mode === "continuous" && (
        <label className="block space-y-1 font-medium">
          <span>{copy.boundary}</span>
          <input
            className={field}
            type="text"
            value={boundary}
            placeholder="HH:MM"
            onChange={(event) => setBoundary(event.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={id}
            required
          />
          <span
            id={id}
            className={
              invalid
                ? "text-error-600 dark:text-error-400 block"
                : "block text-gray-600 dark:text-gray-300"
            }
          >
            {invalid ? copy.boundaryError : copy.boundaryHint}
          </span>
        </label>
      )}
      <FormButtons copy={copy} disabled={!mode || !calendar} close={close} />
    </form>
  );
}

function FormButtons({
  copy,
  disabled,
  close,
}: {
  copy: Copy;
  disabled: boolean;
  close(): void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" disabled={disabled}>
        {copy.confirm}
      </Button>
      <Button type="button" variant="outline" onClick={close}>
        {copy.cancel}
      </Button>
    </div>
  );
}

export function ChannelForm({
  copy,
  submit,
  close,
}: {
  copy: Copy;
  submit(command: SetupCommand): void;
  close(): void;
}) {
  const [name, setName] = useState("");
  const id = useId();
  const valid = channelNameValid(name);
  const invalid = name.length > 0 && !valid;
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid)
      submit({ kind: "channel", operationId: crypto.randomUUID(), name });
  }
  return (
    <form className="space-y-4" onSubmit={send}>
      <p>{copy.createHint}</p>
      <label className="block space-y-1 font-medium">
        <span>{copy.channelName}</span>
        <input
          className={field}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? id : undefined}
          required
        />
        {invalid && (
          <span id={id} className="text-error-600 dark:text-error-400 block">
            {copy.nameError}
          </span>
        )}
      </label>
      <FormButtons copy={copy} disabled={!valid} close={close} />
    </form>
  );
}

export function EnableForm({
  copy,
  areas,
  channels,
  submit,
  close,
  prepared,
}: {
  copy: Copy;
  areas: AreaSetup[];
  channels: SetupChannel[];
  submit(command: SetupCommand): void;
  close(): void;
  prepared: boolean;
}) {
  const [locationId, setLocationId] = useState(prepared ? "stock-341" : "");
  const [channelId, setChannelId] = useState(prepared ? "delivery" : "");
  const [position, setPosition] = useState("");
  const locations = areas.flatMap((area) =>
    area.active &&
    area.canEnableChannel &&
    area.stock.kind === "linked" &&
    area.stock.location.active
      ? [{ ...area.stock.location, label: `${area.name} · ${area.siteName}` }]
      : [],
  );
  const selected = locations.find((location) => location.id === locationId);
  const current = selected?.enabledChannelIds ?? [];
  const placement = placementFor(position, current);
  const canSubmit = Boolean(selected && channelId && placement);
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected && channelId && placement)
      submit({
        kind: "enable",
        operationId: crypto.randomUUID(),
        locationId: selected.id,
        channelId,
        placement,
      });
  }
  return (
    <form className="space-y-4" onSubmit={send}>
      <label className="block space-y-1 font-medium">
        <span>{copy.stock}</span>
        <select
          className={field}
          value={locationId}
          onChange={(event) => {
            setLocationId(event.target.value);
            setChannelId("");
            setPosition("");
          }}
          required
        >
          <option value="" disabled>
            {copy.chooseLocation}
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.label}
            </option>
          ))}
        </select>
      </label>
      {selected && (
        <div>
          <p className="font-mono text-xs break-all">{selected.id}</p>
          <ChannelOrder copy={copy} order={current} channels={channels} />
        </div>
      )}
      <label className="block space-y-1 font-medium">
        <span>{copy.channel}</span>
        <select
          className={field}
          value={channelId}
          onChange={(event) => setChannelId(event.target.value)}
          disabled={!selected}
          required
        >
          <option value="" disabled>
            {copy.chooseChannel}
          </option>
          {channels
            .filter((channel) => !current.includes(channel.id))
            .map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name} · {channel.id}
              </option>
            ))}
        </select>
      </label>
      <label className="block space-y-1 font-medium">
        <span>{copy.position}</span>
        <select
          className={field}
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          disabled={!selected}
          required
        >
          <option value="" disabled>
            {copy.choosePosition}
          </option>
          <option value="end">{copy.atEnd}</option>
          {current.map((key) => (
            <option key={key} value={`before:${key}`}>
              {copy.before}{" "}
              {channels.find((channel) => channel.id === key)?.name ?? key}
            </option>
          ))}
        </select>
      </label>
      <FormButtons copy={copy} disabled={!canSubmit} close={close} />
    </form>
  );
}

function ChannelOrder({
  copy,
  order,
  channels,
}: {
  copy: Copy;
  order: string[];
  channels: SetupChannel[];
}) {
  if (!order.length)
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {copy.emptyChannels}
      </p>
    );
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">{copy.enabledOrder}</p>
      <ol
        aria-label={copy.enabledOrder}
        className="list-decimal ps-5 break-words"
      >
        {order.map((id) => (
          <li key={id}>
            {channels.find((channel) => channel.id === id)?.name ?? id}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReplySummary({
  reply,
  copy,
  channels,
}: {
  reply: SetupReply;
  copy: Copy;
  channels: SetupChannel[];
}) {
  if (reply.kind === "rejected") return <p role="status">{copy.rejected}</p>;
  if (reply.kind === "channel")
    return (
      <>
        <p role="status">{copy.channelCreated}</p>
        <p>{reply.channel.name}</p>
        <p className="font-mono text-xs break-all">{reply.channel.id}</p>
        <p>{copy.createHint}</p>
      </>
    );
  return (
    <>
      <p role="status">
        {reply.kind === "stock" ? copy.stockCreated : copy.channelEnabled}
      </p>
      <p className="font-mono text-xs break-all">{reply.location.id}</p>
      <ChannelOrder
        copy={copy}
        order={reply.location.enabledChannelIds}
        channels={channels}
      />
    </>
  );
}

function SettingsContent({
  preset,
  copy,
}: {
  preset: InventorySetupPreset;
  copy: Copy;
}) {
  const [areas, setAreas] = useState(() =>
    preset === "unavailable" ? [seedAreas[2]] : seedAreas,
  );
  const [channels, setChannels] = useState(seedChannels);
  const [pending, setPending] = useState<Extract<
    SetupCommand,
    { kind: "channel" }
  > | null>(() =>
    preset === "unconfirmed"
      ? {
          kind: "channel",
          operationId: "setup-preview-1",
          name: "Venta mayorista",
        }
      : null,
  );
  const [panel, setPanel] = useState<Panel | null>(() => {
    if (preset === "stock-location" || preset === "scheduled-calendar")
      return { kind: "stock", areaId: "area-almacen" };
    if (preset === "create-channel") return { kind: "channel" };
    if (preset === "enable-channel") return { kind: "enable" };
    return preset === "unconfirmed" ? { kind: "unconfirmed" } : null;
  });
  const trigger = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLHeadingElement | null>(null);
  const open = (next: Panel, input: HTMLElement) => {
    trigger.current = input;
    setPanel(next);
  };
  const close = () => setPanel(null);
  const activeArea =
    panel?.kind === "stock"
      ? areas.find((area) => area.id === panel.areaId)
      : null;

  function submit(command: SetupCommand) {
    const reply = simulateSetup(command, areas, channels);
    if (reply.kind === "channel")
      setChannels((current) => [...current, reply.channel]);
    if (reply.kind === "stock" || reply.kind === "enable") {
      setAreas((current) =>
        current.map((area) => {
          const matches =
            reply.kind === "stock"
              ? area.id === reply.areaId
              : area.stock.kind === "linked" &&
                area.stock.location.id === reply.location.id;
          return matches
            ? { ...area, stock: { kind: "linked", location: reply.location } }
            : area;
        }),
      );
    }
    setPanel({ kind: "result", reply, action: command.kind });
  }

  const action = panel?.kind === "result" ? panel.action : panel?.kind;

  return (
    <section
      className="space-y-6 text-gray-700 dark:text-gray-300"
      data-inventory-setup-ready={panel ? undefined : preset}
    >
      {pending && !panel && (
        <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <p role="status">{copy.unconfirmed}</p>
          <Button
            variant="outline"
            onClick={(event) =>
              open({ kind: "unconfirmed" }, event.currentTarget)
            }
          >
            {copy.resume}
          </Button>
        </div>
      )}
      <section aria-labelledby="inventory-setup-areas" className="space-y-2">
        <h2
          ref={heading}
          tabIndex={-1}
          className="text-base font-semibold text-gray-800 outline-none dark:text-gray-100"
          id="inventory-setup-areas"
        >
          {copy.areas}
        </h2>
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {areas.map((area) => (
            <li
              key={area.id}
              className="grid gap-2 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start"
            >
              <div className="min-w-0">
                <span className="block font-semibold break-words text-gray-800 dark:text-gray-100">
                  {area.name}
                </span>
                <p className="text-sm break-words">{area.siteName}</p>
              </div>
              <div className="min-w-0">
                <p>{copy[area.stock.kind]}</p>
                {area.stock.kind === "linked" && (
                  <>
                    <p className="font-mono text-xs break-all">
                      {area.stock.location.id}
                    </p>
                    {!area.stock.location.active && <p>{copy.stockRetired}</p>}
                    <ChannelOrder
                      copy={copy}
                      order={area.stock.location.enabledChannelIds}
                      channels={channels}
                    />
                  </>
                )}
                {!area.active && <p>{copy.areaArchived}</p>}
              </div>
              {stockSetupEligible(
                area.stock.kind,
                area.active,
                area.canSetUpStock,
              ) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-self-start"
                  onClick={(event) =>
                    open(
                      { kind: "stock", areaId: area.id },
                      event.currentTarget,
                    )
                  }
                >
                  {copy.setup}
                </Button>
              )}
              {area.stock.kind === "unavailable" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-self-start"
                  onClick={() =>
                    setAreas((current) =>
                      current.map((entry) =>
                        entry.id === area.id
                          ? { ...entry, stock: { kind: "absent" } }
                          : entry,
                      ),
                    )
                  }
                >
                  {copy.retryRead}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="inventory-setup-channels" className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className="text-base font-semibold text-gray-800 dark:text-gray-100"
            id="inventory-setup-channels"
          >
            {copy.channels}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={Boolean(pending)}
              onClick={(event) =>
                open({ kind: "channel" }, event.currentTarget)
              }
            >
              {copy.create}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={
                !areas.some(
                  (area) =>
                    area.active &&
                    area.canEnableChannel &&
                    area.stock.kind === "linked" &&
                    area.stock.location.active,
                )
              }
              onClick={(event) => open({ kind: "enable" }, event.currentTarget)}
            >
              {copy.enable}
            </Button>
          </div>
        </div>
        <ul
          data-inventory-setup-channels
          className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800"
        >
          {channels.map((channel) => (
            <li
              key={channel.id}
              className="flex flex-wrap items-baseline justify-between gap-x-3 p-2.5"
            >
              <span className="font-medium break-all">{channel.name}</span>
              <span className="font-mono text-xs break-all">{channel.id}</span>
            </li>
          ))}
        </ul>
      </section>
      <Sheet
        open={panel !== null}
        onOpenChange={(value) => {
          if (!value) close();
        }}
      >
        <SheetContent
          className="products-detail-panel"
          data-inventory-setup-ready={preset}
          closeLabel={copy.close}
          finalFocus={() =>
            trigger.current?.isConnected &&
            !trigger.current.hasAttribute("disabled")
              ? trigger.current
              : (heading.current ?? false)
          }
        >
          <SheetHeader className="pe-10">
            <SheetTitle>
              {action === "stock"
                ? copy.setup
                : action === "enable"
                  ? copy.enable
                  : copy.create}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {copy.areas}
            </SheetDescription>
          </SheetHeader>
          {panel?.kind === "stock" && activeArea && (
            <CalendarForm
              area={activeArea}
              copy={copy}
              submit={submit}
              close={close}
              scheduledAvailable={preset === "scheduled-calendar"}
            />
          )}
          {panel?.kind === "channel" && (
            <ChannelForm copy={copy} submit={submit} close={close} />
          )}
          {panel?.kind === "enable" && (
            <EnableForm
              copy={copy}
              channels={channels}
              areas={areas}
              submit={submit}
              close={close}
              prepared={preset === "enable-channel"}
            />
          )}
          {panel?.kind === "unconfirmed" && pending && (
            <div className="space-y-3">
              <p role="status">{copy.unconfirmed}</p>
              <p className="font-medium">{pending.name}</p>
              <Button
                onClick={() => {
                  submit(pending);
                  setPending(null);
                }}
              >
                {copy.retry}
              </Button>
            </div>
          )}
          {panel?.kind === "result" && (
            <div className="space-y-3">
              <ReplySummary
                reply={panel.reply}
                copy={copy}
                channels={channels}
              />
              <Button variant="outline" onClick={close}>
                {copy.close}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}

export function InventorySetupPreview({
  preset,
}: {
  preset: InventorySetupPreset;
}) {
  const locale = useLocale();
  const copy =
    inventorySetupMessages[isLocale(locale) ? locale : defaultLocale];
  return (
    <NavigationPrototype
      initialPage="inventory-settings"
      permissionMode="ready"
      locationCount="several"
      inventorySettingsContent={<SettingsContent preset={preset} copy={copy} />}
    />
  );
}
