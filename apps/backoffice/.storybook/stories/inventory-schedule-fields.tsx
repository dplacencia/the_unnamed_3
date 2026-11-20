import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import {
  scheduledCalendar,
  type SessionDraft,
  type StockCalendar,
} from "./inventory-setup-model";

const es = {
  scheduled: "Horario semanal",
  choose: "Indica si abre o cierra",
  closed: "Cerrado todo el día",
  open: "Abre con horario",
  opening: "Apertura",
  closing: "Cierre",
  closingDay: "Día del cierre",
  sameDay: "El mismo día",
  nextDay: "El día siguiente",
  chooseDay: "Selecciona el día",
  addWindow: "Añadir franja",
  removeWindow: "Quitar franja",
  exceptions: "Excepciones por fecha",
  exceptionHint: "El horario especial sustituye el de ese día completo.",
  addException: "Añadir excepción",
  removeException: "Quitar excepción",
  date: "Fecha",
  localDate: "Fecha local del centro en esta revisión",
};

const messages: Record<Locale, typeof es> = {
  es,
  en: {
    scheduled: "Weekly schedule",
    choose: "Choose whether the location is open",
    closed: "Closed all day",
    open: "Open on a schedule",
    opening: "Opening",
    closing: "Closing",
    closingDay: "Closing day",
    sameDay: "Same day",
    nextDay: "Following day",
    chooseDay: "Select the day",
    addWindow: "Add time window",
    removeWindow: "Remove time window",
    exceptions: "Date exceptions",
    exceptionHint: "Special hours replace that day's entire schedule.",
    addException: "Add exception",
    removeException: "Remove exception",
    date: "Date",
    localDate: "Site's local date in this review",
  },
  ca: {
    scheduled: "Horari setmanal",
    choose: "Indica si obre o tanca",
    closed: "Tancat tot el dia",
    open: "Obert amb horari",
    opening: "Obertura",
    closing: "Tancament",
    closingDay: "Dia de tancament",
    sameDay: "El mateix dia",
    nextDay: "El dia següent",
    chooseDay: "Selecciona el dia",
    addWindow: "Afegeix franja",
    removeWindow: "Suprimeix franja",
    exceptions: "Excepcions per data",
    exceptionHint: "L’horari especial substitueix el de tot el dia.",
    addException: "Afegeix excepció",
    removeException: "Suprimeix excepció",
    date: "Data",
    localDate: "Data local del centre en aquesta revisió",
  },
  gl: {
    scheduled: "Horario semanal",
    choose: "Indica se abre ou pecha",
    closed: "Pechado todo o día",
    open: "Abre con horario",
    opening: "Apertura",
    closing: "Peche",
    closingDay: "Día do peche",
    sameDay: "O mesmo día",
    nextDay: "O día seguinte",
    chooseDay: "Selecciona o día",
    addWindow: "Engadir franxa",
    removeWindow: "Quitar franxa",
    exceptions: "Excepcións por data",
    exceptionHint: "O horario especial substitúe o de todo o día.",
    addException: "Engadir excepción",
    removeException: "Quitar excepción",
    date: "Data",
    localDate: "Data local do centro nesta revisión",
  },
  eu: {
    scheduled: "Asteko ordutegia",
    choose: "Adierazi irekita edo itxita dagoen",
    closed: "Egun osoan itxita",
    open: "Ordutegiarekin irekita",
    opening: "Irekiera",
    closing: "Itxiera",
    closingDay: "Itxiera-eguna",
    sameDay: "Egun berean",
    nextDay: "Hurrengo egunean",
    chooseDay: "Hautatu eguna",
    addWindow: "Gehitu ordu-tartea",
    removeWindow: "Kendu ordu-tartea",
    exceptions: "Data-salbuespenak",
    exceptionHint: "Ordutegi bereziak egun osoko ordutegia ordezkatzen du.",
    addException: "Gehitu salbuespena",
    removeException: "Kendu salbuespena",
    date: "Data",
    localDate: "Zentroaren tokiko data berrikuspen honetan",
  },
};

export function inventoryScheduleMode(locale: Locale) {
  return messages[locale].scheduled;
}

const siteDate = "2026-11-20";
const field =
  "min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

type WindowDraft = SessionDraft & { id: string };
type DayDraft = WindowDraft[] | null;
type ExceptionDraft = { id: string; date: string; sessions: DayDraft };

function newWindow(): WindowDraft {
  return {
    id: crypto.randomUUID(),
    opening: "",
    closing: "",
    closesFollowingDay: null,
  };
}

function DayFields({
  label,
  day,
  copy,
  change,
}: {
  label: string;
  day: DayDraft;
  copy: typeof es;
  change(next: DayDraft): void;
}) {
  const sessions = day ?? [];
  function update(window: WindowDraft, patch: Partial<SessionDraft>) {
    change(
      sessions.map((item) =>
        item.id === window.id ? { ...item, ...patch } : item,
      ),
    );
  }

  return (
    <div className="grid min-w-0 gap-2">
      <label className="grid gap-1 font-medium sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center">
        {label}
        <select
          className={field}
          value={day === null ? "" : day.length ? "open" : "closed"}
          onChange={(event) =>
            change(
              event.target.value === "open"
                ? [newWindow()]
                : event.target.value === "closed"
                  ? []
                  : null,
            )
          }
        >
          <option value="">{copy.choose}</option>
          <option value="open">{copy.open}</option>
          <option value="closed">{copy.closed}</option>
        </select>
      </label>
      {sessions.map((window) => (
        <div
          key={window.id}
          className="grid gap-2 rounded-lg border border-gray-200 p-2 sm:grid-cols-3 dark:border-gray-800"
        >
          <label className="grid gap-1">
            {copy.opening}
            <input
              className={field}
              placeholder="HH:MM"
              value={window.opening}
              onChange={(event) =>
                update(window, { opening: event.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            {copy.closing}
            <input
              className={field}
              placeholder="HH:MM"
              value={window.closing}
              onChange={(event) =>
                update(window, { closing: event.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            {copy.closingDay}
            <select
              className={field}
              value={
                window.closesFollowingDay === null
                  ? ""
                  : String(window.closesFollowingDay)
              }
              onChange={(event) =>
                update(window, {
                  closesFollowingDay:
                    event.target.value === ""
                      ? null
                      : event.target.value === "true",
                })
              }
            >
              <option value="">{copy.chooseDay}</option>
              <option value="false">{copy.sameDay}</option>
              <option value="true">{copy.nextDay}</option>
            </select>
          </label>
          {sessions.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-start"
              onClick={() =>
                change(sessions.filter((item) => item.id !== window.id))
              }
            >
              {copy.removeWindow}
            </Button>
          )}
        </div>
      ))}
      {sessions.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => change([...sessions, newWindow()])}
        >
          {copy.addWindow}
        </Button>
      )}
    </div>
  );
}

export function InventoryScheduleFields({
  change,
}: {
  change(calendar: StockCalendar | null): void;
}) {
  const language = useLocale();
  const locale = isLocale(language) ? language : defaultLocale;
  const copy = messages[locale];
  const formatWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  });
  const [week, setWeek] = useState<DayDraft[]>(
    Array.from({ length: 7 }, () => null),
  );
  const [exceptions, setExceptions] = useState<ExceptionDraft[]>([]);

  function updateExceptions(next: ExceptionDraft[]) {
    setExceptions(next);
    change(scheduledCalendar(week, next, siteDate));
  }

  function updateException(
    exception: ExceptionDraft,
    patch: Partial<ExceptionDraft>,
  ) {
    updateExceptions(
      exceptions.map((item) =>
        item.id === exception.id ? { ...item, ...patch } : item,
      ),
    );
  }

  return (
    <div className="grid gap-4">
      <fieldset className="grid gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
        <legend className="px-1 font-semibold">{copy.scheduled}</legend>
        {week.map((day, index) => {
          const weekday = formatWeekday.format(
            new Date(Date.UTC(2026, 10, 23 + index)),
          );
          return (
            <DayFields
              key={weekday}
              label={weekday}
              day={day}
              copy={copy}
              change={(next) => {
                const updated = week.map((current, dayIndex) =>
                  dayIndex === index ? next : current,
                );
                setWeek(updated);
                change(scheduledCalendar(updated, exceptions, siteDate));
              }}
            />
          );
        })}
      </fieldset>
      <section className="grid gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
        <h3 className="font-semibold">{copy.exceptions}</h3>
        <p>{copy.exceptionHint}</p>
        {exceptions.length > 0 && (
          <p>
            {copy.localDate} · <time dateTime={siteDate}>{siteDate}</time>
          </p>
        )}
        {exceptions.map((exception) => (
          <div
            key={exception.id}
            className="grid gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-800"
            data-calendar-exception
          >
            <label className="grid gap-1 font-medium">
              {copy.date}
              <input
                type="date"
                className={field}
                value={exception.date}
                onChange={(event) =>
                  updateException(exception, { date: event.target.value })
                }
              />
            </label>
            <DayFields
              label={copy.scheduled}
              day={exception.sessions}
              copy={copy}
              change={(sessions) => updateException(exception, { sessions })}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-start"
              onClick={() =>
                updateExceptions(
                  exceptions.filter((item) => item.id !== exception.id),
                )
              }
            >
              {copy.removeException}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() =>
            updateExceptions([
              ...exceptions,
              { id: crypto.randomUUID(), date: "", sessions: null },
            ])
          }
        >
          {copy.addException}
        </Button>
      </section>
    </div>
  );
}
