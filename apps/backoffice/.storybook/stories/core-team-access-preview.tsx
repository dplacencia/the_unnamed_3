import { useLocale } from "next-intl";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import {
  AssignmentFields,
  compactButton,
  CoreListNavigation,
  MemberNameForm,
  permissionName,
  RoleForm,
  subduedText,
  TeamFormActions,
} from "./core-team-forms";
import { coreTeamMessages, type TeamCopy } from "./core-team-messages";
import {
  coreTeamLifecycleMessages,
  type TeamLifecycleCopy,
} from "./core-team-lifecycle-messages";
import {
  canChangeMembership,
  changeMembership,
  deleteRole,
  editRole,
  replaceInvitation,
  reviewPage,
  type MembershipAction,
  type RetainedAssignments,
} from "./core-team-lifecycle-model";
import {
  applyMemberNameEdit,
  assignmentRequest,
  canAdministerTeam,
  canManageInvitations,
  invitationActions,
  mayAssign,
  memberName,
  memberRows,
  permissionCatalogue,
  revokeAssignment,
  roleChoices,
  roleIdentity,
  roles,
  scopeIdentity,
  scopeLabel,
  teamInvitations,
  teamMembers,
  type Assignment,
  type MemberNameEdit,
  type RoleDefinition,
  type TeamInvitation,
  type TeamMember,
  type TeamProfile,
} from "./core-team-model";
import { NavigationPrototype } from "./navigation-prototype";
import { CoreEmployeeAccountContent } from "./core-employee-accounts-preview";
import { employeeMessages } from "./core-employee-accounts-messages";

export const coreTeamFixtures = [
  "members",
  "delegated-members",
  "invite-only",
  "access-unavailable",
  "roles",
  "new-role",
  "assign-role",
  "edit-member-name",
  "last-owner",
  "invitations",
  "new-invitation",
  "invitation-accepted",
  "new-invitation-with-role",
  "invitation-accepted-with-role",
  "role-edit",
  "role-delete",
  "member-removal",
  "membership-deactivate",
  "membership-reactivate",
  "accept-invitation",
  "invitation-expired",
  "invitation-unavailable",
  "invitation-uncertain",
  "resend-failed",
  "resend-refused",
  "team-paging",
  "employee-assign-access",
] as const;
type Fixture = (typeof coreTeamFixtures)[number];
type Section = "members" | "roles" | "invitations";
type Panel =
  | { kind: "new-role" | "new-invitation" | "new-invitation-with-role" }
  | { kind: "assign-role" | "edit-member-name"; member: TeamMember }
  | { kind: "edit-role" | "delete-role"; role: RoleDefinition }
  | { kind: "membership"; member: TeamMember; action: MembershipAction }
  | { kind: "resend"; invitation: TeamInvitation };
type Notice = {
  key: Exclude<keyof TeamCopy, "permissionLabels"> | keyof TeamLifecycleCopy;
  error?: boolean;
};
const prospective = { ...teamMembers[2], user_id: "prospective-member" };
const confirmedGrant: Assignment = {
  role_id: "consultation",
  scope: { area_id: "area-sales" },
};
const surface =
  "min-w-0 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900";
const sectionTitle = "text-xl font-semibold text-gray-900 dark:text-gray-100";
const formClass = `${surface} max-w-3xl space-y-4 p-4 sm:p-5`;

function getInitialSection(fixture: Fixture): Section {
  if (
    fixture === "roles" ||
    fixture === "new-role" ||
    fixture === "role-edit" ||
    fixture === "role-delete"
  )
    return "roles";
  if (
    fixture === "invite-only" ||
    fixture === "invitations" ||
    fixture.startsWith("new-invitation") ||
    fixture === "invitation-uncertain" ||
    fixture.startsWith("resend")
  )
    return "invitations";
  return "members";
}

function getInitialPanel(fixture: Fixture): Panel | null {
  if (
    fixture === "new-role" ||
    fixture === "new-invitation" ||
    fixture === "new-invitation-with-role"
  )
    return { kind: fixture };
  if (fixture === "assign-role")
    return { kind: fixture, member: teamMembers[2] };
  if (fixture === "edit-member-name")
    return { kind: fixture, member: teamMembers[1] };
  if (fixture === "role-edit" || fixture === "role-delete")
    return {
      kind: fixture === "role-edit" ? "edit-role" : "delete-role",
      role: roles[0],
    };
  if (fixture === "member-removal")
    return { kind: "membership", action: "remove", member: teamMembers[2] };
  if (
    fixture === "membership-deactivate" ||
    fixture === "membership-reactivate"
  )
    return {
      kind: "membership",
      action: fixture === "membership-deactivate" ? "deactivate" : "reactivate",
      member: {
        ...teamMembers[1],
        active: fixture === "membership-deactivate",
      },
    };
  return null;
}

function assignmentLabel(
  copy: TeamCopy,
  definitions: readonly RoleDefinition[],
  assignment: Assignment,
) {
  const role =
    "template" in assignment
      ? copy.owner
      : (definitions.find(({ role_id }) => role_id === assignment.role_id)
          ?.name ?? assignment.role_id);
  const label = scopeLabel(assignment.scope);
  const scope = label ? copy[label] : scopeIdentity(assignment.scope);
  return `${role} · ${scope}`;
}

function MemberList({
  copy,
  profile,
  members,
  definitions,
  onAssign,
  onEditName,
  onRevoke,
  accessActions,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  members: readonly TeamMember[];
  definitions: readonly RoleDefinition[];
  onAssign: (member: TeamMember) => void;
  onEditName: (member: TeamMember) => void;
  onRevoke: (member: TeamMember, assignment: Assignment) => void;
  accessActions?: (member: TeamMember) => ReactNode;
}) {
  return (
    <ul
      className={`${surface} divide-y divide-gray-200 dark:divide-gray-800`}
      aria-label={copy.members}
    >
      {memberRows(profile, members).map((member) => (
        <li
          key={member.user_id}
          data-core-team-member={member.user_id}
          className="grid min-w-0 gap-3 p-3 sm:grid-cols-[minmax(10rem,1fr)_minmax(12rem,1.4fr)_auto] sm:items-start sm:px-4"
        >
          <div className="min-w-0 space-y-1.5">
            <p className="font-semibold [overflow-wrap:anywhere]">
              {memberName(member)}
            </p>
            {member.email && (
              <p className={`${subduedText} [overflow-wrap:anywhere]`}>
                {member.email}
              </p>
            )}
            <Badge color={member.active ? "success" : "gray"} size="sm">
              {member.active ? copy.active : copy.inactive}
            </Badge>
          </div>
          <div className="min-w-0 space-y-1" aria-label={copy.assignments}>
            {!member.assignments.length && (
              <p className={subduedText}>{copy.empty}</p>
            )}
            {member.assignments.map((assignment) => (
              <div
                key={`${roleIdentity(assignment)}-${scopeIdentity(assignment.scope)}`}
                className="flex flex-wrap items-center gap-x-2 text-sm"
              >
                <span className="[overflow-wrap:anywhere]">
                  {assignmentLabel(copy, definitions, assignment)}
                </span>
                {profile === "owner" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="max-sm:min-h-11"
                    onClick={() => onRevoke(member, assignment)}
                  >
                    {copy.revoke}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            {mayAssign(profile, member) && (
              <Button
                variant="outline"
                size="sm"
                className={compactButton}
                onClick={() => onAssign(member)}
              >
                {copy.assign}
              </Button>
            )}
            {profile === "owner" && (
              <Button
                variant="ghost"
                size="sm"
                className={compactButton}
                onClick={() => onEditName(member)}
              >
                {copy.editMemberName}
              </Button>
            )}
            {accessActions?.(member)}
          </div>
        </li>
      ))}
    </ul>
  );
}

function RoleList({
  copy,
  definitions,
  onCreate,
  roleActions,
}: {
  copy: TeamCopy;
  definitions: readonly RoleDefinition[];
  onCreate: () => void;
  roleActions?: (definition: RoleDefinition) => ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={sectionTitle}>{copy.roles}</h2>
        <Button className={compactButton} onClick={onCreate}>
          {copy.newRole}
        </Button>
      </div>
      <div
        className={`${surface} flex flex-wrap items-center justify-between gap-2 p-4`}
      >
        <strong>{copy.owner}</strong>
        <Badge color="gray" size="sm">
          {copy.fixed}
        </Badge>
      </div>
      <h3 className="font-semibold">{copy.custom}</h3>
      <ul
        className={`${surface} divide-y divide-gray-200 dark:divide-gray-800`}
      >
        {definitions.map((definition) => (
          <li key={definition.role_id} className="min-w-0 p-3 sm:px-4">
            <details>
              <summary className="cursor-pointer rounded-md py-1 font-medium [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-brand-500">
                {definition.name}
              </summary>
              <div className="space-y-2 py-2 ps-4">
                <ul className="list-disc space-y-1 ps-4 text-sm">
                  {definition.permissions.map((key) => (
                    <li key={key} className="[overflow-wrap:anywhere]">
                      {permissionName(copy, key)}
                    </li>
                  ))}
                </ul>
                {definition.permissions.some(
                  (key) => !permissionCatalogue.some((known) => known === key),
                ) && <p className={subduedText}>{copy.notAssignable}</p>}
                {roleActions?.(definition)}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssignForm({
  copy,
  profile,
  member,
  definitions,
  onSave,
  onBack,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  member: TeamMember;
  definitions: readonly RoleDefinition[];
  onSave: (assignment: Assignment) => void;
  onBack: () => void;
}) {
  const [roleId, setRoleId] = useState("");
  const [scopeId, setScopeId] = useState("");
  const [invalid, setInvalid] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request = assignmentRequest(
      profile,
      member,
      roleId,
      scopeId,
      definitions,
    );
    setInvalid(!request);
    if (!request) return;
    const assignment =
      "template" in request
        ? { template: request.template, scope: request.scope }
        : { role_id: request.role_id, scope: request.scope };
    onSave(assignment);
  }

  return (
    <form className="space-y-4" onSubmit={save}>
      <p className="font-medium">{memberName(member)}</p>
      <AssignmentFields
        copy={copy}
        profile={profile}
        roleId={roleId}
        scopeId={scopeId}
        definitions={roleChoices(profile, member, definitions)}
        onRole={(role) => {
          setRoleId(role);
          setScopeId("");
        }}
        onScope={setScopeId}
      />
      {invalid && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {copy.assignmentError}
        </p>
      )}
      <TeamFormActions copy={copy} action={copy.assign} onBack={onBack} />
    </form>
  );
}

function InvitationForm({
  copy,
  profile,
  withRole,
  definitions,
  onSend,
  onBack,
  replacement,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  withRole: boolean;
  definitions: readonly RoleDefinition[];
  onSend: (email: string, selection?: Assignment) => void;
  onBack: () => void;
  replacement?: TeamInvitation;
}) {
  const id = useId();
  const [email, setEmail] = useState(replacement?.email ?? "");
  const [roleId, setRoleId] = useState("");
  const [scopeId, setScopeId] = useState("");
  const [invalid, setInvalid] = useState(false);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageInvitations(profile)) return;
    if (!withRole || !roleId) {
      onSend(email);
      return;
    }
    const request = assignmentRequest(
      profile,
      prospective,
      roleId,
      scopeId,
      definitions,
    );
    if (!request || !("role_id" in request)) {
      setInvalid(true);
      return;
    }
    onSend(email, { role_id: request.role_id, scope: request.scope });
  }

  return (
    <form className="space-y-4" onSubmit={send}>
      <div className="space-y-2">
        <Label htmlFor={id}>{copy.email}</Label>
        <Input
          id={id}
          type="email"
          autoComplete="off"
          value={email}
          required
          readOnly={replacement ? true : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {withRole && canAdministerTeam(profile) && (
        <fieldset className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <legend className="px-2 text-sm font-semibold">
            {copy.invitationRole}
          </legend>
          <p className={subduedText}>{copy.roleAfterAcceptance}</p>
          <AssignmentFields
            copy={copy}
            profile={profile}
            roleId={roleId}
            scopeId={scopeId}
            definitions={roleChoices(profile, prospective, definitions)}
            onRole={(role) => {
              setRoleId(role);
              setScopeId("");
            }}
            onScope={setScopeId}
          />
          {invalid && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-400">
              {copy.assignmentError}
            </p>
          )}
        </fieldset>
      )}
      <TeamFormActions
        copy={copy}
        action={replacement ? copy.resend : copy.send}
        onBack={onBack}
      />
    </form>
  );
}

function InvitationList({
  copy,
  profile,
  invitations,
  definitions,
  canPreselect,
  onCreate,
  onResend,
  onCancel,
  onKeep,
  pendingCancel,
  onReviewResend,
  reviewResendTitle,
  sendingUnconfirmed,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  invitations: readonly TeamInvitation[];
  definitions: readonly RoleDefinition[];
  canPreselect: boolean;
  onCreate: (withRole: boolean) => void;
  onResend: (invitation: TeamInvitation) => void;
  onCancel: (invitation: TeamInvitation) => void;
  onKeep: () => void;
  pendingCancel: string | null;
  onReviewResend?: (invitation: TeamInvitation) => void;
  reviewResendTitle?: string;
  sendingUnconfirmed?: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={sectionTitle}>{copy.invitations}</h2>
        <Button
          className={compactButton}
          disabled={sendingUnconfirmed}
          onClick={() => onCreate(canPreselect)}
        >
          {copy.newInvitation}
        </Button>
      </div>
      <ul
        className={`${surface} divide-y divide-gray-200 dark:divide-gray-800`}
        aria-label={copy.invitations}
      >
        {invitations.map((invitation) => {
          const actions = invitationActions(profile, invitation.state);
          return (
            <li
              key={invitation.id}
              data-core-team-invitation={invitation.id}
              className="space-y-3 p-3 sm:px-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <p className="font-medium [overflow-wrap:anywhere]">
                    {invitation.email}
                  </p>
                  <Badge
                    size="sm"
                    color={
                      invitation.state === "pending"
                        ? "warning"
                        : invitation.state === "accepted"
                          ? "success"
                          : "gray"
                    }
                  >
                    {copy[invitation.state]}
                  </Badge>
                  {invitation.selection &&
                    invitation.state === "pending" &&
                    canAdministerTeam(profile) &&
                    ("template" in invitation.selection ||
                      definitions.some(
                        (definition) =>
                          definition.role_id ===
                          roleIdentity(invitation.selection!),
                      )) && (
                      <p className={`${subduedText} [overflow-wrap:anywhere]`}>
                        {copy.invitationRole} ·{" "}
                        {assignmentLabel(
                          copy,
                          definitions,
                          invitation.selection,
                        )}
                      </p>
                    )}
                </div>
                {pendingCancel !== invitation.id && actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {actions.includes("resend") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={compactButton}
                        onClick={() => onResend(invitation)}
                      >
                        {copy.resend}
                      </Button>
                    )}
                    {actions.includes("resend") && onReviewResend && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={compactButton}
                        onClick={() => onReviewResend(invitation)}
                      >
                        {reviewResendTitle}
                      </Button>
                    )}
                    {actions.includes("cancel") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={compactButton}
                        onClick={() => onCancel(invitation)}
                      >
                        {copy.cancelInvitation}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {pendingCancel === invitation.id && (
                <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <p className="text-sm [overflow-wrap:anywhere]">
                    {copy.confirmCancel.replace("{email}", invitation.email)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className={compactButton}
                      onClick={() => onCancel(invitation)}
                    >
                      {copy.cancelInvitation}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={compactButton}
                      onClick={onKeep}
                    >
                      {copy.keep}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function MembershipForm({
  copy,
  labels,
  member,
  action,
  onSave,
  onBack,
}: {
  copy: TeamCopy;
  labels: TeamLifecycleCopy;
  member: TeamMember;
  action: MembershipAction;
  onSave: (retained?: RetainedAssignments) => void;
  onBack: () => void;
}) {
  const id = useId();
  const [retained, setRetained] = useState<RetainedAssignments>();
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (action !== "reactivate" || retained) onSave(retained);
      }}
    >
      <p className="font-medium [overflow-wrap:anywhere]">
        {memberName(member)}
      </p>
      {action === "reactivate" ? (
        <fieldset className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <legend className="px-1 text-sm">{labels.reactivateEffect}</legend>
          <Label className="min-h-10 gap-2">
            <input
              type="radio"
              name={id}
              checked={retained === "keep"}
              onChange={() => setRetained("keep")}
            />
            {labels.keepAssignments}
          </Label>
          <Label className="min-h-10 gap-2">
            <input
              type="radio"
              name={id}
              checked={retained === "discard"}
              onChange={() => setRetained("discard")}
            />
            {labels.discardAssignments}
          </Label>
        </fieldset>
      ) : (
        <>
          <p className={subduedText}>
            {action === "remove"
              ? labels.removeEffect
              : labels.deactivateEffect}
          </p>
          <p className={subduedText}>{labels.membershipOnly}</p>
        </>
      )}
      <TeamFormActions
        copy={copy}
        action={labels[action]}
        disabled={action === "reactivate" && !retained}
        onBack={onBack}
      />
    </form>
  );
}

export function CoreTeamContent({ fixture }: { fixture: Fixture }) {
  const selectedLocale = useLocale();
  const locale = isLocale(selectedLocale) ? selectedLocale : defaultLocale;
  const copy = coreTeamMessages[locale];
  const labels = coreTeamLifecycleMessages[locale];
  const messages = { ...copy, ...labels };
  const [profile, setProfile] = useState<TeamProfile>(
    fixture === "delegated-members"
      ? "delegate"
      : fixture === "invite-only"
        ? "inviter"
        : fixture === "access-unavailable"
          ? "unavailable"
          : "owner",
  );
  const [section, setSection] = useState<Section>(() =>
    getInitialSection(fixture),
  );
  const [panel, setPanel] = useState<Panel | null>(() =>
    getInitialPanel(fixture),
  );
  const [notice, setNotice] = useState<Notice | null>(
    fixture === "last-owner"
      ? { key: "lastOwner", error: true }
      : fixture === "resend-failed"
        ? { key: "resendFailed", error: true }
        : fixture === "resend-refused"
          ? { key: "resendRefused", error: true }
          : null,
  );
  const [members, setMembers] = useState(() =>
    fixture === "membership-reactivate"
      ? changeMembership("owner", teamMembers, roles, "lucia", "deactivate")!
      : teamMembers,
  );
  const [definitions, setDefinitions] = useState(roles);
  const [invitations, setInvitations] = useState(() =>
    fixture === "role-delete" || fixture.startsWith("resend")
      ? teamInvitations.map((invitation, index) =>
          index === 0
            ? { ...invitation, selection: confirmedGrant }
            : invitation,
        )
      : teamInvitations,
  );
  const [pendingCancel, setPendingCancel] = useState<string | null>(null);
  const [pendingDelivery, setPendingDelivery] = useState<{
    email: string;
    selection?: Assignment;
  } | null>(
    fixture === "invitation-uncertain"
      ? { email: "aina@huerta.example" }
      : null,
  );
  const [admitted, setAdmitted] = useState(false);
  const [memberStart, setMemberStart] = useState(0);
  const [roleStart, setRoleStart] = useState(0);
  const [employeeSection, setEmployeeSection] = useState<
    "unvisited" | "open" | "closed"
  >("unvisited");
  const canPreselect =
    fixture === "new-invitation-with-role" &&
    canAdministerTeam(profile) &&
    canManageInvitations(profile);
  const admin = canAdministerTeam(profile);
  const invite = canManageInvitations(profile);
  const lifecycle =
    fixture === "role-edit" ||
    fixture === "role-delete" ||
    fixture === "member-removal" ||
    fixture.startsWith("membership-") ||
    fixture === "team-paging";
  const paged = fixture === "team-paging";
  const memberPage = reviewPage(members, memberStart);
  const rolePage = reviewPage(definitions, roleStart);
  const sections: Section[] = [
    ...(admin ? (["members", "roles"] as const) : []),
    ...(invite ? (["invitations"] as const) : []),
  ];

  function switchSection(next: Section) {
    setSection(next);
    setPanel(null);
    setNotice(null);
    setPendingCancel(null);
  }

  function saveRole(role: Omit<RoleDefinition, "role_id">) {
    setDefinitions((current) => [
      { ...role, role_id: crypto.randomUUID() },
      ...current,
    ]);
    setPanel(null);
    setNotice({ key: "roleCreated" });
  }

  function saveName(member: TeamMember, edit: MemberNameEdit) {
    const refreshed = applyMemberNameEdit(
      profile,
      members,
      member.user_id,
      edit,
    );
    if (!refreshed) {
      setNotice({ key: "forbidden", error: true });
      return;
    }
    // The fixture simulates a confirmed bodyless 204 followed by a roster read.
    setMembers(refreshed);
    setPanel(null);
    setNotice({ key: "memberNameSaved" });
  }

  function saveRoleEdit(
    role: RoleDefinition,
    changes: Omit<RoleDefinition, "role_id">,
  ) {
    const updated = editRole(profile, definitions, role.role_id, changes);
    if (!updated) return setNotice({ key: "forbidden", error: true });
    setDefinitions(updated);
    setPanel(null);
    setNotice({ key: "roleSaved" });
  }

  function confirmRoleDeletion(role: RoleDefinition) {
    const updated = deleteRole(profile, definitions, members, role.role_id);
    if (!updated) return setNotice({ key: "forbidden", error: true });
    setDefinitions(updated.definitions);
    setMembers(updated.members);
    setPanel(null);
    setNotice({ key: "roleDeleted" });
  }

  function saveMembership(
    member: TeamMember,
    action: MembershipAction,
    retained?: RetainedAssignments,
  ) {
    const updated = changeMembership(
      profile,
      members,
      definitions,
      member.user_id,
      action,
      retained,
    );
    if (!updated) return setNotice({ key: "forbidden", error: true });
    setMembers(updated);
    setPanel(null);
    setNotice({
      key:
        action === "remove"
          ? "removed"
          : action === "deactivate"
            ? "deactivated"
            : "reactivated",
    });
  }

  function assign(member: TeamMember, assignment: Assignment) {
    setMembers((current) =>
      current.map((item) =>
        item.user_id === member.user_id
          ? { ...item, assignments: [...item.assignments, assignment] }
          : item,
      ),
    );
    setPanel(null);
    setNotice({ key: "assigned" });
  }

  function revoke(member: TeamMember, assignment: Assignment) {
    const result = revokeAssignment(
      profile,
      members,
      member.user_id,
      assignment,
    );
    if (result === "last-owner" || result === "forbidden") {
      setNotice({
        key: result === "last-owner" ? "lastOwner" : "forbidden",
        error: true,
      });
      return;
    }
    setMembers(result);
    setNotice({ key: "revoked" });
  }

  function send(email: string, selection?: Assignment, reconciled = false) {
    const existing = invitations.find(
      (item) =>
        item.state === "pending" &&
        item.email.toLowerCase() === email.toLowerCase(),
    );
    if (existing) {
      const sameSelection =
        JSON.stringify(existing.selection) === JSON.stringify(selection);
      setNotice({
        key: sameSelection ? "sent" : "duplicate",
        error: !sameSelection,
      });
      if (sameSelection) setPanel(null);
      return;
    }
    if (fixture === "invitation-uncertain" && !reconciled) {
      setPendingDelivery({ email, selection });
      setPanel(null);
      setNotice(null);
      return;
    }
    setInvitations((current) => [
      { email, selection, id: crypto.randomUUID(), state: "pending" },
      ...current,
    ]);
    setPanel(null);
    setNotice({ key: "sent" });
  }

  function resend(invitation: TeamInvitation) {
    if (fixture === "resend-failed" || fixture === "resend-refused") {
      setNotice({
        key: fixture === "resend-failed" ? "resendFailed" : "resendRefused",
        error: true,
      });
      return;
    }
    confirmReplacement(invitation, invitation.selection);
  }

  function confirmReplacement(
    invitation: TeamInvitation,
    selection?: Assignment,
  ) {
    if (!canManageInvitations(profile)) return;
    const replacementId = crypto.randomUUID();
    setInvitations((current) =>
      replaceInvitation(
        current,
        invitation.id,
        replacementId,
        "confirmed",
        selection,
      ),
    );
    setPanel(null);
    setNotice({ key: "resent" });
  }

  function cancel(invitation: TeamInvitation) {
    if (pendingCancel !== invitation.id) {
      setPendingCancel(invitation.id);
      return;
    }
    setInvitations((current) =>
      current.map((item) =>
        item.id === invitation.id ? { ...item, state: "cancelled" } : item,
      ),
    );
    setPendingCancel(null);
    setNotice({ key: "cancelledMessage" });
  }

  let content: ReactNode;
  if (
    fixture === "invitation-expired" ||
    fixture === "invitation-unavailable"
  ) {
    content = (
      <div className={formClass}>
        <h2 className={sectionTitle}>
          {fixture === "invitation-expired"
            ? labels.invitationExpired
            : labels.invitationUnavailable}
        </h2>
        <p className={subduedText}>{labels.askToResend}</p>
      </div>
    );
  } else if (fixture === "accept-invitation" && !admitted) {
    content = (
      <div className={formClass}>
        <h2 className={sectionTitle}>{labels.invitationTitle}</h2>
        <p className={subduedText}>{labels.authenticatedAs}</p>
        <Button className={compactButton} onClick={() => setAdmitted(true)}>
          {labels.acceptInvitation}
        </Button>
      </div>
    );
  } else if (
    fixture === "invitation-accepted" ||
    fixture === "invitation-accepted-with-role" ||
    admitted
  ) {
    const hasGrant = fixture === "invitation-accepted-with-role";
    content = (
      <div className={formClass}>
        <h2 className={sectionTitle}>{copy.inviteeTitle}</h2>
        {hasGrant ? (
          <div className="space-y-1">
            <p className="font-semibold">{copy.grantedAssignment}</p>
            <p>{assignmentLabel(copy, definitions, confirmedGrant)}</p>
          </div>
        ) : (
          <p className={subduedText}>{copy.inviteeHint}</p>
        )}
      </div>
    );
  } else if (profile === "unavailable") {
    content = (
      <div className={formClass}>
        <h2 className={sectionTitle}>{copy.members}</h2>
        <Alert variant="destructive">
          <AlertDescription>{copy.unavailable}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className={compactButton}
          onClick={() => setProfile("owner")}
        >
          {copy.retry}
        </Button>
      </div>
    );
  } else if (panel) {
    content = (
      <div className={formClass}>
        <h2 className={sectionTitle}>
          {panel.kind === "membership"
            ? labels[panel.action]
            : panel.kind === "edit-role"
              ? labels.editRole
              : panel.kind === "delete-role"
                ? labels.deleteRole
                : panel.kind === "resend"
                  ? labels.reviewResend
                  : panel.kind === "new-role"
                    ? copy.newRole
                    : panel.kind === "assign-role"
                      ? copy.assign
                      : panel.kind === "edit-member-name"
                        ? copy.editMemberName
                        : copy.newInvitation}
        </h2>
        {panel.kind === "new-role" && (
          <RoleForm
            copy={copy}
            profile={profile}
            onSave={saveRole}
            onBack={() => switchSection("roles")}
          />
        )}
        {panel.kind === "assign-role" && (
          <AssignForm
            copy={copy}
            profile={profile}
            member={panel.member}
            definitions={definitions}
            onSave={(assignment) => assign(panel.member, assignment)}
            onBack={() => switchSection("members")}
          />
        )}
        {panel.kind === "edit-member-name" && (
          <MemberNameForm
            copy={copy}
            member={panel.member}
            onSave={(edit) => saveName(panel.member, edit)}
            onBack={() => switchSection("members")}
          />
        )}
        {panel.kind === "edit-role" && (
          <>
            <p className={subduedText}>{labels.roleEditEffect}</p>
            <RoleForm
              copy={copy}
              profile={profile}
              initial={panel.role}
              action={labels.saveRole}
              onSave={(changes) => saveRoleEdit(panel.role, changes)}
              onBack={() => switchSection("roles")}
            />
          </>
        )}
        {panel.kind === "delete-role" && (
          <>
            <p className="font-medium [overflow-wrap:anywhere]">
              {panel.role.name}
            </p>
            <p className={subduedText}>{labels.roleDeleteEffect}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="destructive"
                className={compactButton}
                onClick={() => confirmRoleDeletion(panel.role)}
              >
                {labels.deleteRole}
              </Button>
              <Button
                variant="outline"
                className={compactButton}
                onClick={() => switchSection("roles")}
              >
                {copy.back}
              </Button>
            </div>
          </>
        )}
        {panel.kind === "membership" && (
          <MembershipForm
            copy={copy}
            labels={labels}
            member={panel.member}
            action={panel.action}
            onSave={(retained) =>
              saveMembership(panel.member, panel.action, retained)
            }
            onBack={() => switchSection("members")}
          />
        )}
        {panel.kind === "resend" && (
          <InvitationForm
            copy={copy}
            profile={profile}
            withRole
            definitions={definitions}
            replacement={panel.invitation}
            onSend={(_, selection) =>
              confirmReplacement(panel.invitation, selection)
            }
            onBack={() => switchSection("invitations")}
          />
        )}
        {(panel.kind === "new-invitation" ||
          panel.kind === "new-invitation-with-role") && (
          <InvitationForm
            copy={copy}
            profile={profile}
            withRole={panel.kind === "new-invitation-with-role"}
            definitions={definitions}
            onSend={send}
            onBack={() => switchSection("invitations")}
          />
        )}
      </div>
    );
  } else {
    content = (
      <>
        <nav
          aria-label={copy.members}
          className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-gray-800"
        >
          {sections.map((item) => (
            <Button
              key={item}
              size="sm"
              className={compactButton}
              variant={section === item ? "default" : "ghost"}
              aria-current={section === item ? "page" : undefined}
              onClick={() => switchSection(item)}
            >
              {copy[item]}
            </Button>
          ))}
          {profile === "owner" && (
            <Button
              size="sm"
              className={compactButton}
              variant="ghost"
              onClick={() => setEmployeeSection("open")}
            >
              {employeeMessages[locale].title}
            </Button>
          )}
        </nav>
        {section === "members" && admin && (
          <>
            <h2 className={sectionTitle}>{copy.members}</h2>
            <MemberList
              copy={copy}
              profile={profile}
              members={paged ? memberPage.items : members}
              definitions={definitions}
              onAssign={(member) => {
                setNotice(null);
                setPanel({ kind: "assign-role", member });
              }}
              onEditName={(member) => {
                setNotice(null);
                setPanel({ kind: "edit-member-name", member });
              }}
              onRevoke={revoke}
              accessActions={
                lifecycle
                  ? (member) =>
                      (["deactivate", "reactivate", "remove"] as const)
                        .filter((action) =>
                          canChangeMembership(profile, member, action),
                        )
                        .map((action) => (
                          <Button
                            key={action}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={compactButton}
                            onClick={() => {
                              setNotice(null);
                              setPanel({ kind: "membership", member, action });
                            }}
                          >
                            {labels[action]}
                          </Button>
                        ))
                  : undefined
              }
            />
            {paged && (
              <CoreListNavigation
                labels={labels}
                previous={memberPage.previous}
                next={memberPage.next}
                onPage={setMemberStart}
              />
            )}
          </>
        )}
        {section === "roles" && admin && (
          <>
            <RoleList
              copy={copy}
              definitions={paged ? rolePage.items : definitions}
              onCreate={() => {
                setNotice(null);
                setPanel({ kind: "new-role" });
              }}
              roleActions={
                lifecycle && profile === "owner"
                  ? (role) => (
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.every((key) =>
                          permissionCatalogue.some((known) => known === key),
                        ) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={compactButton}
                            onClick={() =>
                              setPanel({ kind: "edit-role", role })
                            }
                          >
                            {labels.editRole}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className={compactButton}
                          onClick={() =>
                            setPanel({ kind: "delete-role", role })
                          }
                        >
                          {labels.deleteRole}
                        </Button>
                      </div>
                    )
                  : undefined
              }
            />
            {paged && (
              <CoreListNavigation
                labels={labels}
                previous={rolePage.previous}
                next={rolePage.next}
                onPage={setRoleStart}
              />
            )}
          </>
        )}
        {section === "invitations" && invite && (
          <>
            {pendingDelivery && (
              <div className="space-y-2">
                <Alert variant="warning" role="status">
                  <AlertDescription>
                    {labels.deliveryUnconfirmed}
                    <span className="block [overflow-wrap:anywhere]">
                      {pendingDelivery.email}
                    </span>
                  </AlertDescription>
                </Alert>
                <Button
                  className={compactButton}
                  variant="outline"
                  onClick={() => {
                    send(
                      pendingDelivery.email,
                      pendingDelivery.selection,
                      true,
                    );
                    setPendingDelivery(null);
                  }}
                >
                  {labels.reviewSameDelivery}
                </Button>
              </div>
            )}
            <InvitationList
              copy={copy}
              profile={profile}
              invitations={invitations}
              definitions={definitions}
              canPreselect={canPreselect}
              onCreate={(withRole) => {
                setNotice(null);
                setPanel({
                  kind: withRole
                    ? "new-invitation-with-role"
                    : "new-invitation",
                });
              }}
              onResend={resend}
              onCancel={cancel}
              onKeep={() => setPendingCancel(null)}
              pendingCancel={pendingCancel}
              sendingUnconfirmed={pendingDelivery !== null}
              reviewResendTitle={labels.reviewResend}
              onReviewResend={
                fixture === "resend-refused"
                  ? (invitation) => {
                      setNotice(null);
                      setPanel({ kind: "resend", invitation });
                    }
                  : undefined
              }
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {employeeSection !== "unvisited" && (
        <div hidden={employeeSection !== "open"}>
          <CoreEmployeeAccountContent
            onBackToTeam={() => setEmployeeSection("closed")}
            onConfirmedProvision={
              fixture === "employee-assign-access"
                ? (account) => {
                    setMembers((current) => [
                      ...current,
                      {
                        user_id: account.id,
                        first_name: account.name,
                        last_name: account.lastName,
                        email: null,
                        active: account.state === "enabled",
                        assignments: [],
                      },
                    ]);
                  }
                : undefined
            }
          />
        </div>
      )}
      <div hidden={employeeSection === "open"}>
        <section
          data-core-team-view={panel?.kind ?? fixture}
          className="mx-auto w-full max-w-5xl space-y-3 px-3 py-4 sm:px-5 sm:py-5"
        >
          {notice && (
            <Alert
              role={notice.error ? "alert" : "status"}
              variant={notice.error ? "destructive" : "success"}
            >
              <AlertDescription>{messages[notice.key]}</AlertDescription>
            </Alert>
          )}
          {content}
        </section>
      </div>
    </>
  );
}

export function CoreTeamAccessPreview({ fixture }: { fixture: Fixture }) {
  const accepted =
    fixture === "invitation-accepted" ||
    fixture === "invitation-accepted-with-role" ||
    fixture === "accept-invitation" ||
    fixture === "invitation-expired" ||
    fixture === "invitation-unavailable";
  if (accepted) return <CoreTeamContent fixture={fixture} />;
  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="several"
      businessSettingsContent={<CoreTeamContent fixture={fixture} />}
    />
  );
}
