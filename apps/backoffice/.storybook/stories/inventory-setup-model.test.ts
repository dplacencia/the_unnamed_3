import { describe, expect, it } from "vitest";
import {
  applyPlacement,
  channelNameValid,
  continuousCalendar,
  placementFor,
  scheduledCalendar,
  stockSetupEligible,
} from "./inventory-setup-model";

describe("Inventory setup inputs", () => {
  it("allows stock setup only for an active Area with confirmed absence and authority", () => {
    expect(stockSetupEligible("absent", true, true)).toBe(true);
    expect(stockSetupEligible("absent", false, true)).toBe(false);
    expect(stockSetupEligible("absent", true, false)).toBe(false);
    expect(stockSetupEligible("linked", true, true)).toBe(false);
    expect(stockSetupEligible("unavailable", true, true)).toBe(false);
  });

  it("requires an exact explicit continuous calendar boundary", () => {
    expect(continuousCalendar("")).toBeNull();
    expect(continuousCalendar("24:00")).toBeNull();
    expect(continuousCalendar("12:30:60")).toBeNull();
    expect(continuousCalendar("12:30:01.1234567")).toBeNull();
    expect(continuousCalendar("00:00")).toEqual({
      continuous: {
        daily_boundary: { hours: 0, minutes: 0, seconds: 0, nanos: 0 },
      },
    });
    expect(continuousCalendar("05:01:02.003456")).toEqual({
      continuous: {
        daily_boundary: { hours: 5, minutes: 1, seconds: 2, nanos: 3456000 },
      },
    });
  });

  it("preserves accepted channel name text and follows the byte and control profile", () => {
    expect(channelNameValid(" Venta online ")).toBe(true);
    expect(channelNameValid("é".repeat(512))).toBe(true);
    expect(channelNameValid("é".repeat(513))).toBe(false);
    expect(channelNameValid("\u0085\u2028 ")).toBe(false);
    expect(channelNameValid("\u2002\u202F ")).toBe(false);
  });

  it("requires explicit ordered enablement and retains the existing relative order", () => {
    const current = ["walk-in", "online"];
    expect(placementFor("", current)).toBeNull();
    expect(placementFor("before:missing", current)).toBeNull();
    expect(placementFor("end", current)).toEqual({ at_end: {} });
    const before = placementFor("before:online", current)!;
    expect(before).toEqual({ before_channel_id: "online" });
    expect(applyPlacement(current, "delivery", before)).toEqual([
      "walk-in",
      "delivery",
      "online",
    ]);
    expect(applyPlacement([], "delivery", { at_end: {} })).toEqual([
      "delivery",
    ]);
    expect(applyPlacement(current, "online", before)).toBeNull();
    expect(
      applyPlacement(current, "delivery", { before_channel_id: "lost" }),
    ).toBeNull();
  });

  it("requires all seven explicit weekday decisions and an explicit overnight choice", () => {
    const friday = {
      opening: "20:00",
      closing: "02:00",
      closesFollowingDay: true,
    };
    const days = [[], [], [], [], [friday], [], []];
    expect(scheduledCalendar(days.slice(0, 6), [], "2026-11-20")).toBeNull();
    expect(
      scheduledCalendar([null, ...days.slice(1)], [], "2026-11-20"),
    ).toBeNull();
    expect(
      scheduledCalendar(
        [[], [], [], [], [{ ...friday, closesFollowingDay: false }], [], []],
        [],
        "2026-11-20",
      ),
    ).toBeNull();
    expect(
      scheduledCalendar(
        days,
        [{ date: "2026-11-21", sessions: [] }],
        "2026-11-20",
      ),
    ).toMatchObject({
      scheduled: {
        weekdays: [
          { weekday: 1, sessions: [] },
          { weekday: 2, sessions: [] },
          { weekday: 3, sessions: [] },
          { weekday: 4, sessions: [] },
          {
            weekday: 5,
            sessions: [
              {
                opening: { hours: 20 },
                closing: { hours: 2 },
                closes_following_day: true,
              },
            ],
          },
          { weekday: 6, sessions: [] },
          { weekday: 7, sessions: [] },
        ],
        exceptions: [
          {
            date: { year: 2026, month: 11, day: 21 },
            replacement_sessions: [],
          },
        ],
      },
    });
  });

  it("rejects duplicate or past date exceptions and permits an overnight close on the processing date", () => {
    const days = [[], [], [], [], [], [], []];
    const closed = { date: "2026-11-19", sessions: [] };
    expect(scheduledCalendar(days, [closed], "2026-11-20")).toBeNull();
    expect(
      scheduledCalendar(
        days,
        [{ ...closed, date: "2026-02-30" }],
        "2026-11-20",
      ),
    ).toBeNull();
    const today = { ...closed, date: "2026-11-20" };
    expect(scheduledCalendar(days, [today, today], "2026-11-20")).toBeNull();
    expect(
      scheduledCalendar(
        days,
        [
          {
            ...closed,
            sessions: [
              { opening: "20:00", closing: "02:00", closesFollowingDay: true },
            ],
          },
        ],
        "2026-11-20",
      ),
    ).not.toBeNull();
  });
});
