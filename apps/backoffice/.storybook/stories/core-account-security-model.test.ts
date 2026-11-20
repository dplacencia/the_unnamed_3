import { describe, expect, it } from "vitest";
import {
  merchantMfaChange,
  recoveryStatus,
} from "./core-account-security-model";

describe("Core account security preview", () => {
  it("keeps status access failure distinct from confirmed completion", () => {
    expect(recoveryStatus(undefined)).toBe("unavailable");
    expect(recoveryStatus("future-provider-state")).toBe("unavailable");
    expect(recoveryStatus("support_required")).toBe("support_required");
    expect(recoveryStatus("completed")).toBe("completed");
  });

  it("requires the Owner's fresh MFA before applying each policy change", () => {
    const policy = { enabled: false } as const;
    expect(
      merchantMfaChange(policy, { enabled: true, days: "30" }, false),
    ).toBeNull();
    expect(
      merchantMfaChange(policy, { enabled: true, days: "0" }, true),
    ).toBeNull();
    expect(
      merchantMfaChange(policy, { enabled: true, days: "61" }, true),
    ).toBeNull();
    expect(
      merchantMfaChange(policy, { enabled: true, days: "30" }, true),
    ).toMatchObject({ enabled: true, graceDays: 30 });
  });

  it("accepts an adjusted future deadline only within 60 days of original enablement", () => {
    const policy = {
      enabled: true,
      since: "2026-11-10",
      until: "2026-12-10",
    } as const;
    expect(
      merchantMfaChange(policy, { enabled: true, until: "2026-11-20" }, true),
    ).toBeNull();
    expect(
      merchantMfaChange(policy, { enabled: true, until: "2027-01-10" }, true),
    ).toBeNull();
    expect(
      merchantMfaChange(policy, { enabled: true, until: "2027-01-09" }, true),
    ).toMatchObject({ enabled: true, until: "2027-01-09" });
    expect(merchantMfaChange(policy, { enabled: false }, false)).toBeNull();
    expect(merchantMfaChange(policy, { enabled: false }, true)).toEqual({
      enabled: false,
    });
  });
});
