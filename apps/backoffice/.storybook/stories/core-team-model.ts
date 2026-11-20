export type TeamProfile = "owner" | "delegate" | "inviter" | "unavailable";
export type AssignmentScope =
  | { merchant: Record<string, never> }
  | { site_id: string }
  | { area_id: string };
export type Assignment = ({ template: "Owner" } | { role_id: string }) & {
  scope: AssignmentScope;
};
export type TeamMember = {
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  active: boolean;
  assignments: readonly Assignment[];
};
export type MemberNameEdit = { first_name?: string; last_name?: string | null };
export type RoleDefinition = {
  role_id: string;
  name: string;
  permissions: readonly string[];
};
export type InvitationState = "pending" | "accepted" | "cancelled" | "expired";
export type TeamInvitation = {
  id: string;
  email: string;
  state: InvitationState;
  selection?: Assignment;
};

export const permissionCatalogue = [
  "product:create",
  "identifier:assign",
  "site:create",
  "area:create",
  "stock:location:create",
  "channel:create",
  "channel:enable",
  "stock:receipt:record",
  "stock:departure:record",
  "catalogue:read",
  "stock:read",
  "permission:manage",
] as const;
const protectedKeys = ["site:create", "area:create"];
const delegatedKeys = ["catalogue:read", "stock:read"];

const scopes = [
  { id: "merchant", value: { merchant: {} }, label: "merchant" },
  { id: "site-central", value: { site_id: "site-central" }, label: "central" },
  { id: "area-sales", value: { area_id: "area-sales" }, label: "sales" },
  { id: "site-north", value: { site_id: "site-north" }, label: "north" },
] as const satisfies readonly {
  id: string;
  value: AssignmentScope;
  label: string;
}[];

export const roles: readonly RoleDefinition[] = [
  {
    role_id: "consultation",
    name: "Consulta de existencias",
    permissions: delegatedKeys,
  },
  {
    role_id: "warehouse",
    name: "Movimientos de almacén",
    permissions: ["stock:receipt:record", "stock:departure:record"],
  },
  {
    role_id: "team",
    name: "Administración de equipo",
    permissions: ["permission:manage", ...delegatedKeys],
  },
  {
    role_id: "historic",
    name: "Control previo de almacén",
    permissions: ["stock:read", "legacy:inventory:audit"],
  },
];

export const teamMembers: readonly TeamMember[] = [
  {
    user_id: "marina",
    first_name: "Marina",
    last_name: "Soler",
    email: "marina@huerta.example",
    active: true,
    assignments: [{ template: "Owner", scope: { merchant: {} } }],
  },
  {
    user_id: "lucia",
    first_name: "Lucía",
    last_name: "Ortega",
    email: "lucia@huerta.example",
    active: true,
    assignments: [{ role_id: "team", scope: { site_id: "site-central" } }],
  },
  {
    user_id: "sofia",
    first_name: "Sofía",
    last_name: null,
    email: "sofia@huerta.example",
    active: true,
    assignments: [],
  },
  {
    user_id: "pablo",
    first_name: "Pablo",
    last_name: "Lago",
    email: null,
    active: false,
    assignments: [
      { role_id: "consultation", scope: { site_id: "site-north" } },
    ],
  },
];

export const teamInvitations: readonly TeamInvitation[] = [
  { id: "iv-ferran", email: "ferran@huerta.example", state: "pending" },
  { id: "iv-lucia", email: "lucia@huerta.example", state: "accepted" },
  { id: "iv-isabel", email: "isabel@huerta.example", state: "cancelled" },
  { id: "iv-nuria", email: "nuria@huerta.example", state: "expired" },
];

export function canAdministerTeam(profile: TeamProfile) {
  return profile === "owner" || profile === "delegate";
}

export function canManageInvitations(profile: TeamProfile) {
  return profile === "owner" || profile === "inviter";
}

export function memberName(member: TeamMember) {
  return member.last_name
    ? `${member.first_name} ${member.last_name}`
    : member.first_name;
}

export function normalizeMemberName(name: string): string | undefined {
  if (typeof name !== "string" || !name.isWellFormed()) return undefined;
  const trimmed = name.replace(/^\p{White_Space}+|\p{White_Space}+$/gu, "");
  if (!trimmed || [...trimmed].length > 255 || /\p{Cc}/u.test(trimmed))
    return undefined;
  return trimmed;
}

export function applyMemberNameEdit(
  profile: TeamProfile,
  members: readonly TeamMember[],
  userId: string,
  edit: MemberNameEdit,
): readonly TeamMember[] | undefined {
  if (profile !== "owner" || !members.some(({ user_id }) => user_id === userId))
    return undefined;
  const { first_name, last_name } = edit;
  if (first_name === undefined && last_name === undefined) return undefined;
  const first =
    first_name === undefined ? undefined : normalizeMemberName(first_name);
  const last = last_name == null ? last_name : normalizeMemberName(last_name);
  if (
    (first_name !== undefined && first === undefined) ||
    (last_name !== undefined && last === undefined)
  )
    return undefined;
  return members.map((member) =>
    member.user_id === userId
      ? {
          ...member,
          ...(first !== undefined && { first_name: first }),
          ...(last !== undefined && { last_name: last }),
        }
      : member,
  );
}

export function scopeIdentity(scope: AssignmentScope) {
  if ("site_id" in scope) return scope.site_id;
  if ("area_id" in scope) return scope.area_id;
  return "merchant";
}

export function scopeLabel(scope: AssignmentScope) {
  return scopes.find(({ id }) => id === scopeIdentity(scope))?.label;
}

export function roleIdentity(assignment: Assignment) {
  return "template" in assignment ? "owner" : assignment.role_id;
}

function coversScope(profile: TeamProfile, scope: string) {
  return (
    profile === "owner" ||
    (profile === "delegate" && ["site-central", "area-sales"].includes(scope))
  );
}

export function memberRows(
  profile: TeamProfile,
  members: readonly TeamMember[],
): readonly TeamMember[] {
  if (!canAdministerTeam(profile)) return [];
  return members.map((member) => ({
    ...member,
    assignments: member.assignments.filter((assignment) =>
      coversScope(profile, scopeIdentity(assignment.scope)),
    ),
  }));
}

export function canChoosePermission(profile: TeamProfile, key: string) {
  return (
    !protectedKeys.includes(key) &&
    (profile === "owner" ||
      (profile === "delegate" && delegatedKeys.includes(key)))
  );
}

function knownPermission(key: string) {
  return permissionCatalogue.some((permission) => permission === key);
}

export function createRole(
  profile: TeamProfile,
  name: string,
  permissions: readonly string[],
) {
  if (
    !canAdministerTeam(profile) ||
    !name.trim() ||
    permissions.some(
      (key) => !knownPermission(key) || !canChoosePermission(profile, key),
    )
  )
    return undefined;
  return { name, permissions };
}

export function scopeChoices(profile: TeamProfile, roleId: string) {
  if (!roleId) return [];
  return scopes.filter(
    ({ id }) =>
      coversScope(profile, id) && (roleId !== "owner" || id === "merchant"),
  );
}

export function mayAssign(profile: TeamProfile, member: TeamMember) {
  return (
    canAdministerTeam(profile) &&
    member.active &&
    !(profile === "delegate" && member.user_id === "lucia")
  );
}

export function roleChoices(
  profile: TeamProfile,
  member: TeamMember,
  definitions: readonly RoleDefinition[] = roles,
) {
  if (!mayAssign(profile, member)) return [];
  const available = definitions.filter((role) =>
    role.permissions.every(
      (key) => knownPermission(key) && canChoosePermission(profile, key),
    ),
  );
  // Fixture-only eligible active email-account subjects are explicit.
  const ownerEligible =
    profile === "owner" &&
    ["marina", "lucia", "sofia"].includes(member.user_id);
  return ownerEligible
    ? [{ role_id: "owner", name: "Owner", permissions: [] }, ...available]
    : available;
}

export function assignmentRequest(
  profile: TeamProfile,
  member: TeamMember,
  roleId: string,
  scopeId: string,
  definitions: readonly RoleDefinition[] = roles,
): (Assignment & { action: "assign" }) | undefined {
  const scope = scopeChoices(profile, roleId).find(({ id }) => id === scopeId);
  if (
    !scope ||
    !roleChoices(profile, member, definitions).some(
      ({ role_id }) => role_id === roleId,
    )
  )
    return undefined;
  if (
    member.assignments.some(
      (item) =>
        roleIdentity(item) === roleId && scopeIdentity(item.scope) === scopeId,
    )
  )
    return undefined;
  return roleId === "owner"
    ? { template: "Owner", scope: scope.value, action: "assign" }
    : { role_id: roleId, scope: scope.value, action: "assign" };
}

export function revokeAssignment(
  profile: TeamProfile,
  members: readonly TeamMember[],
  userId: string,
  assignment: Assignment,
) {
  if (profile !== "owner") return "forbidden" as const;
  const target = members.find((member) => member.user_id === userId);
  if (
    target?.active &&
    "template" in assignment &&
    members.filter(
      (member) =>
        member.active && member.assignments.some((item) => "template" in item),
    ).length < 2
  ) {
    return "last-owner" as const;
  }
  return members.map((member) =>
    member.user_id === userId
      ? {
          ...member,
          assignments: member.assignments.filter(
            (item) =>
              roleIdentity(item) !== roleIdentity(assignment) ||
              scopeIdentity(item.scope) !== scopeIdentity(assignment.scope),
          ),
        }
      : member,
  );
}

export function invitationActions(
  profile: TeamProfile,
  state: InvitationState,
): readonly ("resend" | "cancel")[] {
  if (!canManageInvitations(profile)) return [];
  if (state === "pending") return ["resend", "cancel"];
  return state === "expired" ? ["resend"] : [];
}
