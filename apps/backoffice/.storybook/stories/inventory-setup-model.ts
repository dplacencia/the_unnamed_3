import { validateEditingText } from "./products-editing-model";

export type StockLocation = {
  id: string;
  active: boolean;
  enabledChannelIds: string[];
};
export type AreaSetup = {
  id: string;
  name: string;
  siteId: string;
  siteName: string;
  active: boolean;
  canSetUpStock: boolean;
  canEnableChannel: boolean;
  stock:
    | { kind: "linked"; location: StockLocation }
    | { kind: "absent" | "unavailable" };
};
export type SetupChannel = { id: string; name: string };
export type Placement =
  { at_end: Record<string, never> } | { before_channel_id: string };

export function stockSetupEligible(
  stock: AreaSetup["stock"]["kind"],
  active: boolean,
  allowed: boolean,
) {
  return stock === "absent" && active && allowed;
}

export function channelNameValid(name: string) {
  return validateEditingText("name", name) === null;
}

function timeOfDay(boundary: string) {
  const match =
    /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.(\d{1,6}))?)?$/.exec(boundary);
  if (!match || match[0] !== boundary) return null;
  const [, hours, minutes, seconds = "0", fraction = "0"] = match;
  return {
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
    nanos: Number(fraction.padEnd(9, "0")),
  };
}

export function continuousCalendar(boundary: string) {
  const dailyBoundary = timeOfDay(boundary);
  return dailyBoundary
    ? { continuous: { daily_boundary: dailyBoundary } }
    : null;
}

export type SessionDraft = {
  opening: string;
  closing: string;
  closesFollowingDay: boolean | null;
};

type ScheduleDay = readonly SessionDraft[] | null;
type ExceptionDraft = { date: string; sessions: ScheduleDay };
type TimeOfDay = NonNullable<ReturnType<typeof timeOfDay>>;
type ScheduleSession = {
  opening: TimeOfDay;
  closing: TimeOfDay;
  closes_following_day: boolean;
};

function nanosSinceMidnight(time: TimeOfDay) {
  return (
    ((time.hours * 60 + time.minutes) * 60 + time.seconds) * 1_000_000_000 +
    time.nanos
  );
}

function calendarSessions(drafts: ScheduleDay): ScheduleSession[] | null {
  if (!drafts) return null;
  const sessions: ScheduleSession[] = [];
  for (const draft of drafts) {
    const opening = timeOfDay(draft.opening);
    const closing = timeOfDay(draft.closing);
    if (!opening || !closing || draft.closesFollowingDay === null) return null;
    if (
      !draft.closesFollowingDay &&
      nanosSinceMidnight(closing) <= nanosSinceMidnight(opening)
    )
      return null;
    sessions.push({
      opening,
      closing,
      closes_following_day: draft.closesFollowingDay,
    });
  }
  return sessions;
}

function calendarDate(text: string) {
  if (
    text.length !== 10 ||
    !/^\d{4}-\d{2}-\d{2}$/u.test(text) ||
    text.startsWith("0000")
  )
    return null;
  const instant = new Date(`${text}T00:00:00Z`);
  if (
    !Number.isFinite(instant.getTime()) ||
    instant.toISOString().slice(0, 10) !== text
  )
    return null;
  const [year, month, day] = text.split("-").map(Number);
  return { year, month, day, millis: instant.getTime() };
}

export function scheduledCalendar(
  days: readonly ScheduleDay[],
  exceptions: readonly ExceptionDraft[],
  siteDate: string,
) {
  const processingDate = calendarDate(siteDate);
  if (days.length !== 7 || !processingDate) return null;
  const weekdays = [];
  for (const [index, drafts] of days.entries()) {
    const sessions = calendarSessions(drafts);
    if (!sessions) return null;
    weekdays.push({ weekday: index + 1, sessions });
  }
  const dates = new Set<string>();
  const replacements = [];
  for (const draft of exceptions) {
    const date = calendarDate(draft.date);
    const sessions = calendarSessions(draft.sessions);
    if (!date || !sessions || dates.has(draft.date)) return null;
    const closingDate =
      date.millis +
      (sessions.some((session) => session.closes_following_day)
        ? 86_400_000
        : 0);
    if (closingDate < processingDate.millis) return null;
    dates.add(draft.date);
    replacements.push({
      date: { year: date.year, month: date.month, day: date.day },
      replacement_sessions: sessions,
    });
  }
  return { scheduled: { weekdays, exceptions: replacements } };
}

export function placementFor(
  choice: string,
  currentOrder: readonly string[],
): Placement | null {
  if (choice === "end") return { at_end: {} };
  const anchor = choice.replace(/^before:/, "");
  if (!choice.startsWith("before:") || !currentOrder.includes(anchor))
    return null;
  return { before_channel_id: anchor };
}

export function applyPlacement(
  currentOrder: readonly string[],
  channelId: string,
  placement: Placement,
) {
  if (currentOrder.includes(channelId)) return null;
  if ("at_end" in placement) return [...currentOrder, channelId];
  const index = currentOrder.indexOf(placement.before_channel_id);
  if (index < 0) return null;
  return [
    ...currentOrder.slice(0, index),
    channelId,
    ...currentOrder.slice(index),
  ];
}

export type StockCalendar = NonNullable<
  ReturnType<typeof continuousCalendar> | ReturnType<typeof scheduledCalendar>
>;
export type SetupCommand =
  | {
      kind: "stock";
      operationId: string;
      areaId: string;
      calendar: StockCalendar;
    }
  | { kind: "channel"; operationId: string; name: string }
  | {
      kind: "enable";
      operationId: string;
      locationId: string;
      channelId: string;
      placement: Placement;
    };

export type SetupReply =
  | { kind: "stock"; areaId: string; location: StockLocation }
  | { kind: "channel"; channel: SetupChannel }
  | {
      kind: "enable";
      location: StockLocation;
      channelId: string;
      placement: Placement;
    }
  | { kind: "rejected" };

export function simulateSetup(
  command: SetupCommand,
  areas: AreaSetup[],
  channels: SetupChannel[],
): SetupReply {
  if (command.kind === "stock") {
    const area = areas.find((entry) => entry.id === command.areaId);
    return area &&
      stockSetupEligible(area.stock.kind, area.active, area.canSetUpStock)
      ? {
          kind: "stock",
          areaId: area.id,
          location: {
            id: `stock-${command.operationId}`,
            active: true,
            enabledChannelIds: [],
          },
        }
      : { kind: "rejected" };
  }
  if (command.kind === "channel") {
    return channelNameValid(command.name)
      ? {
          kind: "channel",
          channel: { id: `channel-${command.operationId}`, name: command.name },
        }
      : { kind: "rejected" };
  }
  const area = areas.find(
    (entry) =>
      entry.stock.kind === "linked" &&
      entry.stock.location.id === command.locationId,
  );
  if (
    !area?.active ||
    !area.canEnableChannel ||
    area.stock.kind !== "linked" ||
    !area.stock.location.active ||
    !channels.some((channel) => channel.id === command.channelId)
  )
    return { kind: "rejected" };
  const order = applyPlacement(
    area.stock.location.enabledChannelIds,
    command.channelId,
    command.placement,
  );
  return order
    ? {
        kind: "enable",
        location: { ...area.stock.location, enabledChannelIds: order },
        channelId: command.channelId,
        placement: command.placement,
      }
    : { kind: "rejected" };
}
