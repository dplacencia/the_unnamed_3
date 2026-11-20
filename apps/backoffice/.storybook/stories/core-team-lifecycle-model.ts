import {
  createRole,
  roleIdentity,
  type Assignment,
  type RoleDefinition,
  type TeamInvitation,
  type TeamMember,
  type TeamProfile,
} from "./core-team-model";

export type MembershipAction = "remove" | "deactivate" | "reactivate";
export type RetainedAssignments = "keep" | "discard";
export type DeliveryOutcome =
  "confirmed" | "failed" | "refused" | "unconfirmed";

export function canChangeMembership(
  profile: TeamProfile,
  member: TeamMember,
  action: MembershipAction,
) {
  if (profile !== "owner" || member.user_id === "marina") return false;
  if (action === "remove") return true;
  // The demo returns explicit email-account classification separately from the roster email.
  const emailAccount = member.user_id === "lucia" || member.user_id === "sofia";
  return emailAccount && member.active === (action === "deactivate");
}

export function changeMembership(
  profile: TeamProfile,
  members: readonly TeamMember[],
  definitions: readonly RoleDefinition[],
  memberId: string,
  action: MembershipAction,
  retained?: RetainedAssignments,
): readonly TeamMember[] | undefined {
  const target = members.find((member) => member.user_id === memberId);
  if (!target || !canChangeMembership(profile, target, action))
    return undefined;
  if (action === "remove")
    return members.filter((member) => member.user_id !== memberId);
  if (action === "reactivate" && !retained) return undefined;
  const assignments =
    action === "deactivate"
      ? target.assignments
      : retained === "keep"
        ? target.assignments.filter(
            (assignment) =>
              "template" in assignment ||
              definitions.some((role) => role.role_id === assignment.role_id),
          )
        : [];
  return members.map((member) =>
    member === target
      ? { ...member, active: action === "reactivate", assignments }
      : member,
  );
}

export function editRole(
  profile: TeamProfile,
  definitions: readonly RoleDefinition[],
  id: string,
  changes: Omit<RoleDefinition, "role_id">,
) {
  if (
    profile !== "owner" ||
    id === "owner" ||
    !definitions.some((role) => role.role_id === id)
  )
    return undefined;
  const replacement = createRole(profile, changes.name, changes.permissions);
  if (!replacement) return undefined;
  return definitions.map((role) =>
    role.role_id === id ? { role_id: id, ...replacement } : role,
  );
}

export function deleteRole(
  profile: TeamProfile,
  definitions: readonly RoleDefinition[],
  members: readonly TeamMember[],
  id: string,
) {
  if (
    profile !== "owner" ||
    id === "owner" ||
    !definitions.some((role) => role.role_id === id)
  )
    return undefined;
  return {
    definitions: definitions.filter((role) => role.role_id !== id),
    members: members.map((member) => ({
      ...member,
      assignments: member.assignments.filter(
        (assignment) => roleIdentity(assignment) !== id,
      ),
    })),
  };
}

export function replaceInvitation(
  invitations: readonly TeamInvitation[],
  id: string,
  replacementId: string,
  outcome: DeliveryOutcome,
  selection: Assignment | undefined,
) {
  if (outcome !== "confirmed") return invitations;
  return invitations.map((invitation) =>
    invitation.id === id &&
    (invitation.state === "expired" || invitation.state === "pending")
      ? {
          ...invitation,
          id: replacementId,
          state: "pending" as const,
          selection,
        }
      : invitation,
  );
}

export function reviewPage<T>(rows: readonly T[], start: number) {
  const pageSize = 2;
  const offset = start < rows.length ? start : 0;
  return {
    items: rows.slice(offset, offset + pageSize),
    previous: offset > 0 ? Math.max(0, offset - pageSize) : undefined,
    next: offset + pageSize < rows.length ? offset + pageSize : undefined,
  };
}
