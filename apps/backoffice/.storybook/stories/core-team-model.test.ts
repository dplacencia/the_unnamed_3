import { describe, expect, it } from "vitest";
import {
  applyMemberNameEdit,
  assignmentRequest,
  canAdministerTeam,
  canManageInvitations,
  createRole,
  invitationActions,
  memberRows,
  revokeAssignment,
  roles,
  scopeChoices,
  teamMembers,
} from "./core-team-model";

describe("Core team review model", () => {
  it("updates only supplied merchant names and explicitly clears a last name", () => {
    const name = { first_name: " \tLucía María\n" };
    const result = applyMemberNameEdit("owner", teamMembers, "lucia", name);
    expect(result?.[1]).toEqual({
      ...teamMembers[1],
      first_name: "Lucía María",
    });
    expect(result?.[0]).toBe(teamMembers[0]);
    expect(
      applyMemberNameEdit("owner", result!, "lucia", { last_name: null })?.[1],
    ).toEqual({
      ...teamMembers[1],
      first_name: "Lucía María",
      last_name: null,
    });
    expect(
      applyMemberNameEdit("delegate", teamMembers, "lucia", name),
    ).toBeUndefined();
  });

  it("validates both supplied fields atomically with the actual trimmed code point limit", () => {
    const edit = (names: Parameters<typeof applyMemberNameEdit>[3]) =>
      applyMemberNameEdit("owner", teamMembers, "lucia", names);
    expect(edit({})).toBeUndefined();
    expect(edit({ first_name: "Ana", last_name: "\t\u00a0" })).toBeUndefined();
    expect(
      edit({ first_name: "Ana", last_name: "Or\u007ftega" }),
    ).toBeUndefined();
    expect(edit({ first_name: "🌿".repeat(256) })).toBeUndefined();
    expect(
      edit({ first_name: " ".repeat(4100) + "🌿".repeat(255) })?.[1].first_name,
    ).toBe("🌿".repeat(255));
    expect(teamMembers[1].first_name).toBe("Lucía");
  });
  it("admits delegated administrators and keeps invitation authority separate", () => {
    expect(canAdministerTeam("delegate")).toBe(true);
    expect(canManageInvitations("delegate")).toBe(false);
    expect(canAdministerTeam("inviter")).toBe(false);
    expect(canManageInvitations("inviter")).toBe(true);
  });

  it("includes all roster members and projects only authorized assignment details", () => {
    const delegated = memberRows("delegate", teamMembers);
    expect(delegated).toHaveLength(teamMembers.length);
    expect(
      delegated.find((item) => item.user_id === "marina")?.assignments,
    ).toEqual([]);
    expect(
      delegated.find((item) => item.user_id === "sofia")?.assignments,
    ).toEqual([]);
    expect(delegated.find((item) => item.user_id === "pablo")?.active).toBe(
      false,
    );
  });

  it("requires one explicit scope and keeps Owner merchant-wide", () => {
    const sofia = teamMembers.find((item) => item.user_id === "sofia")!;
    const pablo = teamMembers.find((item) => item.user_id === "pablo")!;
    expect(assignmentRequest("owner", sofia, "owner", "")).toBeUndefined();
    expect(
      assignmentRequest("owner", sofia, "owner", "site-central"),
    ).toBeUndefined();
    expect(assignmentRequest("owner", sofia, "owner", "merchant")).toEqual({
      action: "assign",
      template: "Owner",
      scope: { merchant: {} },
    });
    expect(
      assignmentRequest("delegate", sofia, "consultation", "area-sales"),
    ).toEqual({
      action: "assign",
      role_id: "consultation",
      scope: { area_id: "area-sales" },
    });
    expect(
      assignmentRequest("delegate", sofia, "consultation", "site-north"),
    ).toBeUndefined();
    expect(
      assignmentRequest("owner", pablo, "consultation", "merchant"),
    ).toBeUndefined();
    expect(
      assignmentRequest("owner", sofia, "historic", "merchant"),
    ).toBeUndefined();
    expect(
      scopeChoices("delegate", "consultation").some(
        ({ id }) => id === "merchant",
      ),
    ).toBe(false);
  });

  it("refuses removal of the last active Owner", () => {
    expect(
      revokeAssignment(
        "owner",
        teamMembers,
        "marina",
        teamMembers[0].assignments[0],
      ),
    ).toBe("last-owner");
  });

  it("preserves stored keys and allows an empty role without the protected catalogue keys", () => {
    expect(
      roles.find(({ role_id }) => role_id === "historic")?.permissions,
    ).toContain("legacy:inventory:audit");
    expect(createRole("owner", "Prueba", ["site:create"])).toBeUndefined();
    expect(
      createRole("delegate", "Prueba", ["permission:manage"]),
    ).toBeUndefined();
    expect(createRole("owner", "  Prueba ", [])).toEqual({
      name: "  Prueba ",
      permissions: [],
    });
  });

  it("makes invitation controls depend on the supplied state and authority", () => {
    expect(invitationActions("owner", "pending")).toEqual(["resend", "cancel"]);
    expect(invitationActions("inviter", "expired")).toEqual(["resend"]);
    expect(invitationActions("owner", "accepted")).toEqual([]);
    expect(invitationActions("owner", "cancelled")).toEqual([]);
    expect(invitationActions("delegate", "pending")).toEqual([]);
  });
});
