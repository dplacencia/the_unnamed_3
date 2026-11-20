## Source and decision record

[Core MER-025](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/merchant-access/spec.md#requirement-mer-025--employee-account-lifecycle-and-authority)
governs accounts the merchant creates without email. MER-026 addresses inactive
merchant memberships, and the newer [role administration design](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/design.md)
treats member removal as a separate merchant access operation.

On November 20 the user chose **Core Site or Area** for the employee's recorded
administrative resource. This replaces the older location alternative for the
frontend design. An Area uses its own Core identity and shows its parent Site.
The Core contract work will carry this choice into authority and route schemas.
Apply
[MOD-001](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#requirement-mod-001--one-owner-for-each-fact)
and keep this association separate from Inventory stock locations and role
assignments.

[IDN-025–027 and IDN-006](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/customer-identity/spec.md)
govern qualified login and credential recovery. The
[updated Core proposal](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/proposal.md)
withdraws the earlier temporary-password deadline and records the limit of
ordinary session sign-out for already-open password setup steps.

## Review interaction

Open Empleados from Equipo. The roster uses trusted employee classification
and authorized capabilities. It distinguishes administrative resource,
effective access and the confirmed account state. Creating an account asks for
its identity details and an explicit administrative Site or Area. Use approved
IDN-025 rules for an employee-local username. The exact employee-create fields
and validation for names remain with Core. The examples show a supplied
merchant login code, and Core still owns its setup, uniqueness and changes.

The Owner's employee login code has its own view. Show its current confirmed
value or a clear unset state. Review the canonical lowercase code before
submission. Provide the accepted sign-in examples in split-component and
qualified form. If Core refuses the new value, retain the current value and its
login examples. A confirmed change affects new sign-ins with the old code and
leaves established employee sessions active. Core enforces ownership,
uniqueness, the reuse hold and any reclaim. The review covers one refused code
through a synthetic outcome.

Confirmed creation supplies a temporary credential for private handoff, with a
required password change. Simulated credentials are inert display placeholders.
After closing the handoff, the preview discards the displayed credential and
keeps no credential in browser storage. An authorized reset can issue a new
temporary password. Account creation and its administrative association alone
grant no business access. Any separate assignment requires the applicable
permission-management authority. This creation example covers establishing the
account before assigning access through the existing Roles flow.

Move action preserves employee identity and role assignments. It only presents
permitted target Core resources. Disablement describes its whole-account impact.
When Core confirms refusal before revocation dispatch, retain the known account
state. If dispatched revocation is unconfirmed and Core reports protective
blocking, show that state and allow a new authorized reconciliation request. Do
not imply that uncertain disablement has completed. Reactivation explicitly
chooses how to handle retained assignments and requires the corresponding
assignment authority.

Show normal password reset, assisted MFA reset and compromise recovery as
distinct actions. A password reset starts with neither session choice selected.
MFA recovery describes the employee proving their own password and verifying a
replacement before losing the previous enrollment. Security recovery presents
the protective lock and reconciles the active operation on an authorized
request. Present completion only when supplied by the fixture. Preserve the
same Core person. Merchant MFA still applies after successful recovery.

## Release boundary

The [gateway OpenAPI](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
currently provides no employee creation, move, disable, reactivation or
credential-management routes. Core's
[implementation tasks](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/tasks.md)
record isolated recovery stage checks and an unimplemented employee creation
endpoint. Before live release, Core must agree the employee collection and
per-action authority projection, identify the selected Site or Area in its
contract, and verify the actual provider, private handoff and session behavior.
The active Core role-administration draft excludes employee lifecycle and its
fixed twelve-key catalogue does not expose the delegated employee grants.
The frontend must take the authorized operations from the applicable Core
contract, without adding synthetic keys to the role catalogue.
The preview runs entirely on fixtures and asserts no exact wire format,
browser secret durability or real provider outcome.

## Verification and review

Exercise creation and handoff closure, move scope checks, provider refusal,
unconfirmed disablement and explicit reconciliation, both assignment choices
on reactivation, explicit session choices on normal reset, MFA recovery,
retained security lock, the link from Team, and login code setup and change.
Capture the changed Team
examples and the new employee stories in desktop, tablet, phone and desktop
dark profiles, with examples in all five languages.
