## ADDED Requirements

### Requirement: CTA-001 — Authorized team views

The team workspace SHALL show the member and role views to callers admitted by
current permission administration authority, and invitation management to
callers with current merchant invite permission.

#### Scenario: Scoped member assignment view

- **WHEN** an admitted caller reviews the member roster
- **THEN** the view renders the returned member activity and permitted identity, and displays only returned visible assignments without distinguishing hidden assignments from their absence.

#### Scenario: Invitation delegation without role authority

- **WHEN** the caller has merchant invite authority alone
- **THEN** the invitation view is available and the role and roster actions are absent.

### Requirement: CTA-002 — Fixed and merchant-defined roles

The role view SHALL distinguish Core's fixed Owner template from merchant roles
and preserve complete returned role definitions. The selectable list for a new
custom role SHALL follow the authorized catalogue and protected keys.

#### Scenario: Viewing an existing permission outside the catalogue

- **WHEN** a returned custom role holds an unsupported stored capability string
- **THEN** the role keeps that string visible in its definition and is unavailable for new assignments under Core's rule.

### Requirement: CTA-003 — One explicit role and scope

A role assignment SHALL require one role and one choice of merchant, Site or
Core Area. The Owner template SHALL use merchant scope. Assigning to a person
who is inactive SHALL be unavailable. Visible scope alone SHALL confer no
mutation authority.

#### Scenario: Attempt to revoke the last active Owner

- **WHEN** Core refuses a revocation that would leave no active Owner
- **THEN** the workspace shows the refusal and keeps the current Owner assignment.

### Requirement: CTA-004 — Authorized email invitations

The invitation view SHALL show the authorized address and current invitation
outcome as supplied. It SHALL offer resend for eligible pending and expired
items, and cancellation for eligible pending items. An email-only invitation
SHALL confer no role on acceptance.

#### Scenario: Invitee joins through an email-only invitation

- **WHEN** Core confirms admission through an invitation with no role selections
- **THEN** the membership confirmation does not imply permission to use merchant operations.

#### Scenario: Invitation delivery is uncertain

- **WHEN** Core cannot confirm the outcome of the invitation operation
- **THEN** the view presents uncertainty and performs no automatic resend.

### Requirement: CTA-005 — Separate preview for preselected invitation roles

The role-selection preview SHALL require both invite and permission-management
authority plus the applicable role and scope eligibility. The pending selection
SHALL confer no effective authority.

#### Scenario: A selected assignment becomes effective

- **WHEN** the invited account completes authenticated acceptance and Core confirms membership with the eligible selected assignment
- **THEN** the confirmation shows that assignment from the supplied result.

### Requirement: CTA-006 — Merchant-local member-name editing

The workspace SHALL offer member-name editing to the current Owner of the
selected merchant. It SHALL submit only changed names. Supplied strings SHALL
be nonblank with at most 255 Unicode code points and no retained Cc controls
after trimming. The first name SHALL be non-null. An explicit last-name clearing
choice SHALL submit null and omission SHALL preserve the current value.

#### Scenario: One supplied name is invalid

- **WHEN** a supplied name fails the accepted validation
- **THEN** the form identifies that field and keeps both edits as drafts until corrected.

#### Scenario: An authorized edit changes the selected merchant names

- **WHEN** Core confirms the edit with an empty 204 response
- **THEN** the workspace acknowledges the completed change and refreshes the roster without applying the change to account email or assignments.

### Requirement: CTA-007 — Role and membership lifecycle review

The workspace SHALL let a currently authorized Owner review editing and
deletion of a custom role and removing a different person's merchant
membership. A custom-role deletion SHALL disclose its impact on retained
assignments. The workspace SHALL use the confirmed outcome to update the
affected roles or memberships.

#### Scenario: Deactivation and reactivation of email-account membership

- **WHEN** the Owner reviews reactivating an inactive email-account membership
- **THEN** they explicitly choose whether to retain or discard its applicable role assignments
- **AND** the choice concerns that merchant's membership and preserves the person's account and other memberships.

#### Scenario: Newly provisioned employee

- **WHEN** the employee fixture confirms provision and the Owner returns to Team
- **THEN** the new employee is available for an authorized scoped custom role without exposing the temporary credential or offering Owner.

### Requirement: CTA-008 — Invitation admission and replacement outcomes

The recipient review SHALL require explicit acceptance by the authenticated
invitee. An expired or unavailable invitation SHALL present no acceptance
action. Sender outcomes SHALL show confirmed refusal, failure or uncertain
delivery without changing a prior invitation unless its replacement is
confirmed.

#### Scenario: Sender checks uncertain delivery

- **WHEN** the sender explicitly checks an unconfirmed delivery
- **THEN** the review carries the original recipient and requested assignments and displays the authoritative result.

#### Scenario: Prior selection cannot be resent

- **WHEN** the sender is refused a replacement using earlier assignments
- **THEN** the prior invitation remains unchanged and an authorized sender may review a replacement selection for the same recipient.

### Requirement: CTA-009 — Member and custom-role paging

The workspace SHALL navigate separately through the member and custom-role
collections. Fixed role templates SHALL remain outside custom-role continuation.

#### Scenario: Paging through roles

- **WHEN** the owner opens the next custom-role page
- **THEN** the fixed Owner template remains visible separately and the member page position remains unchanged.
