## Team workspace

Start from Configuración del negocio and offer Equipo, Roles and Invitaciones
according to the current authorized view. Show member name, permitted email,
membership activity and visible role/scope pairs. Members with no visible
assignments have the same presentation whether those assignments are absent or
outside the viewer's scope. An unavailable result gets a retry.

An administrator with employee-account access can open
[Empleados](../define-core-employee-management/design.md) from Equipo. The
employee operations have separate Core authority, account states and outcomes.

Show fixed Owner separately from merchant roles. The catalogue has twelve
approved keys, with Site and Area creation reserved to Owner. Keep unsupported
stored capability strings readable in role details. Preview role creation with
permission choices from the applicable catalogue and the caller's fixture
authority. The role name, operation response and administration endpoint
validation remain subject to the Core contract; the form uses display state.

An assignment chooses one role and one explicit scope. Owner is merchant-only.
Site and Area choices use Core identity and the response's eligible scopes.
One request addresses one assignment. An inactive member cannot receive a new
assignment. An Owner's attempt to remove the last active Owner remains refused.
Show the confirmed result and keep the current known assignment when refused.

The Owner can edit a person's name within the selected merchant. Show the stored
names and an explicit option to remove the last name. Submit only changed name
fields to the approved `POST /merchants/{merchant_id}/members/{person_id}` route
when live integration is available. Core trims supplied strings and preserves
omitted fields at commit under S97 and S101–106. The preview checks each supplied
string after trimming for a nonempty result, a limit of 255 Unicode code points
and absence of retained Cc controls. Creator-only byte limits do not apply.
Simulate the empty 204 followed by a refreshed roster. Confirmed changes affect
the selected membership names. Account email and roles remain separate.

## Invitations

Show the invitation address returned in the authorized history and its issued
state. The email-only flow offers a new invitation, resend for eligible pending
or expired items, and cancellation for eligible pending items. Accepted and
canceled entries stay in history according to Core. Fixture statuses are
supplied; the browser calculates neither expiry nor history retention. Resend
or cancellation reflects the provider's confirmed outcome and uses no automatic
repeat. A preview of acceptance shows membership established with no role
selections from this email-only invitation. Roles can be administered after
joining. The user approved a separate review of invitation role preselection.
Use current invite and permission-management authority and eligible role/scope
choices. This preview exercises one custom role. Core's accepted design permits
zero or more. The pending invitation shows the eligible selection separately
from effective roles. A separate authenticated acceptance result shows the
assignment only when the result supplies it. The accepted design evaluates
current role permissions and eligibility at acceptance. Admission, selection,
delivery and privacy depend on the live invitation implementation.

The recipient preview starts with the invited account already authenticated.
Admission requires an explicit acceptance and displays the membership only
after the supplied result. An expired or unavailable link instead directs the
recipient to ask for another invitation. Those outcomes do not show account or
assignment details. The preview contains no identity-provider traffic.

The sender can explicitly check an unconfirmed delivery using the same
recipient and role selection. This fixture reconciles to an established
pending invitation. Confirmed replacement failure and an authority-based
resend refusal preserve the original result and expiry. The refused resend
offers a deliberate review of replacement roles for the same recipient. The
remaining native delivery, reconciliation and recipient binding mechanisms
belong to Core.

## Roles, membership and navigation

The Owner can review editing the name and assignable permissions of one
custom role. The fixed Owner template remains separate. Deletion has an
explicit confirmation that explains its effect on assignments retained by
inactive memberships. The simulation applies the role and assignment changes
together. A pending invitation with a deleted role can no longer grant that
role. Delegated edit/delete depends on authoritative affected-scope checks.

Removing a person's merchant membership is distinct from disabling an
employee account. The Owner can separately deactivate a different email
account's access to this merchant, retaining its assignments, or reactivate
it with an explicit retain/discard choice. Keeping assignments skips deleted
roles. Email-account classification for these fixtures is supplied
independently of the roster email field. Own membership and the last Owner
remain protected. The Core public role-administration change currently
excludes activation endpoints, so the membership-lifecycle previews exercise
MER-026 behavior before public integration.

The employee access handoff fixture adds a confirmed newly provisioned account
to the same visit's team view. It starts without effective roles, supports
ordinary scoped role assignment and stays ineligible for Owner. The temporary
credential remains outside the team roster.

The member roster and custom-role lists each use their own separate demo page
positions and Previous/Next controls. The demonstration uses two rows per
page to exercise continuation on compact fixtures. The fixed Owner template
appears independently of the custom-role page. Live requests use Core's
opaque continuation and eligible rows rather than the fixture offsets.

## Sources and dependencies

- Published [merchant access](../../../../the_unnamed_2/openspec/specs/merchant-access/spec.md)
  covers invitations, authentication as the invited account, no permission
  grant for acceptance alone, cancellation, resend, Owner and last Owner.
- Recorded [role administration](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md)
  under MER-027–035 and MER-042 specifies current read visibility, fixed templates,
  exact assignment selectors, member display fields and roles. Live release
  depends on implementation and publication. The preview does not choose
  outstanding role-write, removal or error wire details.
- Recorded [invitation and delegation decisions](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/merchant-access/spec.md#requirement-mer-005--invitation-role-assignments)
  cover MER-005/015/016/020 and MER-024/026, including email-only invitations,
  history, invite permission, exact permissions, scoped delegation and
  affirmative admission. Invitation actions depend on the live authoritative
  workflow and a verified provider admission path.
- The current [gateway description](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
  has no equivalent public administration/invitation contract. Review uses
  in-memory fixtures. Storybook performs no identity-provider handoff, delivery
  or real permission mutations.
