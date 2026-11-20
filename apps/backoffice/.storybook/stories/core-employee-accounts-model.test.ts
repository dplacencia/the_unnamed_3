import { describe, expect, it } from "vitest";
import {
  accountAction,
  administrativeChoices,
  createEmployeeDraft,
  employees,
  restoreEmployee,
  updateDisabledOutcome,
} from "./core-employee-accounts-model";

describe("Core employee account fixtures", () => {
  it("checks the canonical username and uses only supplied Core resources", () => {
    expect(
      createEmployeeDraft("owner", "Alba", "", "aLBA21", "area-floor"),
    ).toMatchObject({
      username: "alba21",
      administrativeId: "area-floor",
      state: "enabled",
      roles: [],
    });
    expect(
      createEmployeeDraft("owner", "Alba", "", "aa", "area-floor"),
    ).toBeUndefined();
    expect(
      createEmployeeDraft(
        "owner",
        "Alba",
        "",
        "alba21",
        "inventory-location-id",
      ),
    ).toBeUndefined();
    expect(
      createEmployeeDraft("delegate", "Alba", "", "alba21", "site-market"),
    ).toBeUndefined();
    expect(administrativeChoices("delegate").map(({ id }) => id)).toEqual([
      "site-centro",
      "area-floor",
      "area-stockroom",
    ]);
  });

  it("checks whole-account coverage and does not allow delegated self-disable", () => {
    expect(accountAction("delegate", employees[0], "disable")).toBe(true);
    expect(accountAction("delegate", employees[2], "disable")).toBe(false);
    expect(accountAction("delegate", employees[3], "disable")).toBe(false);
  });

  it("keeps unavailable, blocked and confirmed disablement separate", () => {
    expect(updateDisabledOutcome(employees[0], "unavailable")).toBe(
      employees[0],
    );
    const blocked = updateDisabledOutcome(employees[0], "unconfirmed");
    expect(blocked.state).toBe("blocked");
    expect(updateDisabledOutcome(blocked, "confirmed").state).toBe("disabled");
  });

  it("requires an explicit authorized reactivation choice and leaves removed roles removed", () => {
    const member = employees[1];
    expect(restoreEmployee("delegate", member, "")).toBeUndefined();
    expect(restoreEmployee("delegate", member, "discard")).toBeUndefined();
    expect(restoreEmployee("owner", member, "keep")).toMatchObject({
      state: "enabled",
      roles: [member.roles[0]],
    });
    expect(restoreEmployee("owner", member, "discard")).toMatchObject({
      state: "enabled",
      roles: [],
    });
  });
});
