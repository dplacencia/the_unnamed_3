## ADDED Requirements

### Requirement: CMW-001 — Session entry through the configured identity provider

The backoffice SHALL offer the existing identity-provider handoff and present
an indeterminate session separately from a confirmed authenticated session and
a failed check.

#### Scenario: Account setup has not completed

- **WHEN** the account session is still being reconciled
- **THEN** the backoffice shows the session check in progress and awaits confirmation before presenting authenticated actions.

### Requirement: CMW-002 — Merchant choices from current memberships

The business chooser SHALL display merchant identities returned by the caller's
membership collection. Available directions SHALL use the returned continuation
token unchanged. An unavailable collection SHALL have its own retry state.

#### Scenario: A successful discovery returns no eligible memberships

- **WHEN** the response carries an empty merchant collection
- **THEN** the chooser shows a confirmed empty result and offers the existing creation entry point for an eligible caller.

#### Scenario: A listed business is selected

- **WHEN** the person chooses a returned business
- **THEN** the backoffice enters that merchant context and continues to use current access results for each business operation.

### Requirement: CMW-003 — Exact merchant creation request

Merchant creation SHALL submit an eligible verified caller's operation identity
and original business name under the published input contract. The name SHALL
contain non-whitespace content and fit 255 UTF-8 bytes.

#### Scenario: The creation result is uncertain

- **WHEN** delivery ends without a conclusive response
- **THEN** the creation view keeps the outcome uncertain and offers a replay with the same operation identity and exact submitted name.

### Requirement: CMW-004 — Read readiness for the confirmed creation

The creator-side status view SHALL use the status returned for the exact
confirmed merchant ID. Pending, blocked, unavailable and ready SHALL each
have distinct presentation. Opening the newly created workspace SHALL require
authoritative ready status.

#### Scenario: A creation response carries pending or blocked

- **WHEN** HTTP 202 carries either state in the response body
- **THEN** the view displays that state and offers a check of the same merchant's readiness.

#### Scenario: Ready is confirmed

- **WHEN** the creation response or matching readiness read returns ready
- **THEN** the view offers entry to the newly created workspace.

### Requirement: CMW-005 — Review the initial Owner names in the separate preview

The separate creator-name preview SHALL offer current-account profile names
for review and explicit submission under the Core creator object rules.
The merchant name and original creator strings SHALL be retained on retry.

#### Scenario: The creator has no last name to record

- **WHEN** the person explicitly chooses absence
- **THEN** the preview includes the required `creator.last_name` key with JSON null.

#### Scenario: A provided name is invalid

- **WHEN** a provided creator string exceeds 4096 UTF-8 bytes before trimming, is blank after trimming, exceeds 255 Unicode code points after trimming or contains a retained control
- **THEN** the form reports that field and prevents submission.
