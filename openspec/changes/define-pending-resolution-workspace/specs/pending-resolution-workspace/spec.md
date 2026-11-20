# Pending resolution workspace

## ADDED Requirements

### Requirement: PRW-001 — Review an eligible current movement

Pendientes SHALL open the exact line for review. Present its returned facts
and reasons alongside the available action established by current fixture
eligibility. A prepared missing-channel release SHALL require selection of
the actual enabled channel and explicit confirmation.

#### Scenario: The recorded departure has no channel

- **WHEN** an eligible merchant prepares release of the exact Pending departure
- **THEN** the saved quantity and origin remain visible
- **AND** the merchant explicitly supplies the actual eligible channel before confirming the release.

### Requirement: PRW-002 — Confirm that an eligible receipt never arrived

The receipt rejection review SHALL target the exact eligible Pending supplier
receipt. Require an affirmative never-arrived confirmation and an explicit
valid reason before dispatch. Show the retained rejection and no stock effect
when confirmed.

#### Scenario: An eligible Pending supplier receipt never arrived

- **WHEN** the merchant confirms no goods arrived and provides an explicit reason
- **THEN** the request carries the original line reference and exact reason
- **AND** a confirmed rejection affects that line alone.

#### Scenario: Only part of an eligible Pending receipt arrived

- **WHEN** the merchant supplies and confirms the smaller actual quantity under the recorded product rules
- **THEN** the preview shows the saved facts, supplies only the exact corrected value, and leaves the original unit in place
- **AND** any confirmed stock effect comes from the release reply.

### Requirement: PRW-003 — Confirm the scope of whole duplicate cancellation

A prepared duplicate cancellation SHALL identify the complete target and
surviving counterpart and the entire still-Pending target line set. Require an
explicit caller-asserted reason and confirmation. An unavailable counterpart
SHALL yield the same generic state and expose no counterpart details.

#### Scenario: A wholly Pending target has a confirmed counterpart

- **WHEN** an authorized merchant confirms the two reports describe the same event
- **THEN** the command addresses the complete target and counterpart identities
- **AND** the retained outcome applies to the entire target.

#### Scenario: The counterpart cannot be used

- **WHEN** current authorized evidence for a usable counterpart is unavailable
- **THEN** the view presents the generic unavailable state with no executable cancellation.

#### Scenario: The fixture supplies multiple authorized surviving batches

- **WHEN** the merchant reviews a wholly Pending target with multiple usable counterpart identities
- **THEN** the preview requires the merchant to choose and confirm one exact identity
- **AND** a new selection clears the previous confirmation.

### Requirement: PRW-004 — Present confirmed outcomes and recover uncertainty

The view SHALL distinguish the attempted command from the original movement
outcome. Only a returned applied result supplies a signed stock effect.
Retain an unconfirmed command's full identity and contents for an explicit
unchanged retry under current authority. Refresh the current list position
after a confirmed resolution.

#### Scenario: A confirmed release response was lost

- **WHEN** the merchant retries the frozen command under current authority
- **THEN** it returns the original retained effect once
- **AND** the resolved movement leaves the Pending list after refresh.

#### Scenario: Current authority is lost before a retry

- **WHEN** the same command is retried without current authority
- **THEN** the safe denial presents no protected result
- **AND** the original uncertainty remains visible.
