## ADDED Requirements

### Requirement: ASR-001 — Registration and setup feedback

The review SHALL offer a native identity signup handoff and show setup delay only
when supplied by the authoritative scenario. User-facing delay feedback SHALL
avoid provider diagnostics.

#### Scenario: Signup handoff

- **WHEN** a signed-out account holder starts registration
- **THEN** the review shows the handoff to the hosted identity service.

#### Scenario: Delayed setup

- **WHEN** the business setup scenario reports a delay
- **THEN** the merchant sees a general delay message and can consult the state of that business again.

### Requirement: ASR-002 — Trial access status

The review SHALL distinguish confirmed trial access, confirmed pause after expiry
and a failed access read. An authoritative deadline SHALL be shown only when
received and applicable to the displayed state.

#### Scenario: Trial ended

- **WHEN** the response confirms Inventory access is paused after expiry
- **THEN** the view presents the pause of reads and changes.

### Requirement: ASR-003 — Email-account self-service recovery

The review SHALL require explicit confirmation for the holder's own security
recovery and present the confirmed outcome or applicable uncertainty.
The process SHALL keep account recovery, ordinary logout, and the provider's
ordinary password request semantically separate.

#### Scenario: Status access unavailable

- **WHEN** the status credential is unavailable or unusable
- **THEN** the view presents the status access limitation and appropriate native handoff without claiming that recovery completed or cancelled.

#### Scenario: Merchant creation incomplete

- **WHEN** the response reports that merchant creation prevents starting recovery
- **THEN** the account state remains intact and the merchant sees the current refusal.

### Requirement: ASR-004 — Merchant MFA changes require a fresh verification

The review SHALL present the Owner's current merchant MFA policy. Enabling,
disabling and changing an active grace deadline each require fresh,
confirmed MFA before the preview applies the confirmed change.

#### Scenario: New or adjusted grace

- **WHEN** the Owner enables enforcement or adjusts a running grace period
- **THEN** enabling uses an explicit 1–60 day choice and a new deadline is future and within 60 days of original enablement.

#### Scenario: Verification unavailable

- **WHEN** fresh verification is unconfirmed
- **THEN** the current policy remains displayed and unchanged.
