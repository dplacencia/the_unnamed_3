import { expect, test } from "vitest";
import { roles, teamMembers } from "./core-team-model";
import {
  changeMembership,
  deleteRole,
  editRole,
  replaceInvitation,
  reviewPage,
} from "./core-team-lifecycle-model";

test("only admitted custom role changes apply and role deletion clears inactive assignments", () => {
  expect(editRole("delegate", roles, "consultation", roles[0])).toBeUndefined();
  expect(editRole("owner", roles, "owner", roles[0])).toBeUndefined();
  expect(
    editRole("owner", roles, "consultation", {
      name: "Edit",
      permissions: ["area:create"],
    }),
  ).toBeUndefined();
  const updated = editRole("owner", roles, "consultation", {
    name: "Edit",
    permissions: ["stock:read"],
  });
  expect(updated?.[0]).toEqual({
    role_id: "consultation",
    name: "Edit",
    permissions: ["stock:read"],
  });
  const deleted = deleteRole("owner", roles, teamMembers, "consultation");
  expect(deleted?.definitions.map((role) => role.role_id)).not.toContain(
    "consultation",
  );
  expect(
    deleted?.members.find((member) => member.user_id === "pablo")?.assignments,
  ).toEqual([]);
  expect(deleted?.members.find((member) => member.user_id === "lucia")).toEqual(
    teamMembers[1],
  );
});

test("protects own membership and employee lifecycle while keeping or discarding inactive role selections", () => {
  expect(
    changeMembership("owner", teamMembers, roles, "marina", "remove"),
  ).toBeUndefined();
  expect(
    changeMembership("owner", teamMembers, roles, "pablo", "deactivate"),
  ).toBeUndefined();
  expect(
    changeMembership("delegate", teamMembers, roles, "lucia", "remove"),
  ).toBeUndefined();
  const inactive = changeMembership(
    "owner",
    teamMembers,
    roles,
    "lucia",
    "deactivate",
  )!;
  expect(inactive[1]).toEqual({ ...teamMembers[1], active: false });
  expect(
    changeMembership("owner", inactive, roles, "lucia", "reactivate"),
  ).toBeUndefined();
  expect(
    changeMembership(
      "owner",
      inactive,
      roles,
      "lucia",
      "reactivate",
      "keep",
    )?.[1],
  ).toEqual(teamMembers[1]);
  expect(
    changeMembership("owner", inactive, [], "lucia", "reactivate", "keep")?.[1]
      .assignments,
  ).toEqual([]);
  expect(
    changeMembership(
      "owner",
      inactive,
      roles,
      "lucia",
      "reactivate",
      "discard",
    )?.[1].assignments,
  ).toEqual([]);
  expect(
    changeMembership("owner", inactive, roles, "lucia", "remove")?.some(
      (member) => member.user_id === "lucia",
    ),
  ).toBe(false);
});

test("refused and uncertain resends preserve the exact established invitation", () => {
  const invitation = {
    id: "sent",
    email: "review@example.com",
    state: "pending",
  } as const;
  for (const outcome of ["failed", "refused", "unconfirmed"] as const)
    expect(
      replaceInvitation(
        [invitation],
        invitation.id,
        "replacement",
        outcome,
        undefined,
      ),
    ).toEqual([invitation]);
  expect(
    replaceInvitation(
      [invitation],
      invitation.id,
      "replacement",
      "confirmed",
      undefined,
    ),
  ).toEqual([{ ...invitation, id: "replacement" }]);
});

test("fixture pagination navigates in both directions without counting nested or fixed rows", () => {
  expect(reviewPage(roles, 0)).toEqual({
    items: roles.slice(0, 2),
    previous: undefined,
    next: 2,
  });
  expect(reviewPage(roles, 2)).toEqual({
    items: roles.slice(2),
    previous: 0,
    next: undefined,
  });
  expect(reviewPage(roles.slice(0, 1), 2)).toEqual({
    items: roles.slice(0, 1),
    previous: undefined,
    next: undefined,
  });
});
