## ADDED Requirements

### Requirement: CEM-001 — Authorized employee workspace

The backoffice SHALL provide employee account management through the selected
merchant's Team workspace using trusted Core account classification and current
capabilities. An absent email or a username shape alone SHALL NOT classify an
account as an employee account.

#### Scenario: Merchant-created employee account

- **WHEN** an authorized administrator opens Empleados
- **THEN** the view shows authorized employee account facts and actions for the selected merchant
- **AND** email invitations remain available through their own Team workflow.

### Requirement: CEM-002 — Provision for an explicit administrative resource

The frontend SHALL select a permitted Core Site or Area for creation. The
administrative association SHALL grant no business access. Creation and
permission assignment SHALL each use their applicable authority.

#### Scenario: Confirmed creation and private handoff

- **WHEN** Core confirms employee account creation and supplies the temporary password
- **THEN** the frontend shows the employee login details and temporary password for private handoff
- **AND** explains the required password change and makes no time-based expiry promise.

#### Scenario: Credential display closes

- **WHEN** the administrator closes the temporary-password handoff
- **THEN** the frontend no longer displays that credential and keeps no browser copy for retrieval.

### Requirement: CEM-003 — Administrative move and account lifecycle

Move SHALL preserve identity and assignments and require current authority over
the old and new administrative resources, with no self-move. Disablement SHALL
require the approved whole-account authority, including administrative and
access-scope coverage for a delegated administrator. An employee SHALL NOT
disable their own account. Reactivation SHALL require explicit keep or discard
of retained assignments with authority for the chosen action.

#### Scenario: Provider refusal before revocation dispatch

- **WHEN** Core reports that disablement was refused before provider revocation was requested
- **THEN** the view presents the refusal and retains the last confirmed account state.

#### Scenario: Pending disablement reconciliation

- **WHEN** Core reports that revocation was dispatched and account access is blocked while the result remains unconfirmed
- **THEN** the view shows the protective block and makes a fresh authorized reconciliation action available
- **AND** it does not automatically retry or present disablement as complete.

#### Scenario: Explicit reactivation

- **WHEN** an authorized actor reactivates a retained employee account
- **THEN** the actor explicitly chooses whether to keep or discard its retained assignments
- **AND** the view presents the established result while deleted roles are skipped and kept roles use their current permissions.

### Requirement: CEM-004 — Credential actions stay distinct

The backoffice SHALL offer separately authorized password reset, assisted MFA
reset and security recovery for potentially compromised employee accounts.
A delegated reset SHALL require the applicable permission across the
administrative location and access scopes. Security recovery SHALL require
both reset permissions for a delegated administrator.

#### Scenario: Normal password reset

- **WHEN** an authorized person requests a normal password reset
- **THEN** the view requires a choice to keep active sessions open or sign them out
- **AND** displays a temporary password only when Core supplies it after confirmation.

#### Scenario: Assisted MFA recovery

- **WHEN** an authorized person initiates employee MFA recovery
- **THEN** the view explains that sessions are signed out and the employee must prove their own password
- **AND** the old enrollment is retained until a replacement is verified.

#### Scenario: Security recovery is in progress

- **WHEN** Core reports protective locking during employee security recovery
- **THEN** the view shows the lock, preserves the relation to the same employee, and offers only applicable authorized reconciliation actions
- **AND** presents unlocking and the current MFA requirement from the confirmed result.

### Requirement: CEM-005 — Merchant code for employee login

The frontend SHALL allow an authorized Owner to set or change the employee
login code. The canonical code SHALL contain 3–12 lowercase ASCII letters or
digits. Core SHALL govern uniqueness and reuse. The frontend SHALL use the
confirmed code in employee login instructions.

#### Scenario: Confirmed code change

- **WHEN** Core confirms a code change
- **THEN** the new code appears in both employee login forms
- **AND** the view explains that the old code stops working for new logins while established sessions stay open.

#### Scenario: Code unavailable

- **WHEN** Core refuses a proposed code as unavailable
- **THEN** the view retains the last confirmed code and lets the Owner enter a different one.
