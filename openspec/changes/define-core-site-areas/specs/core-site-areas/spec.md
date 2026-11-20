# Core Sites and Areas

## ADDED Requirements

### Requirement: CSA-001 — Browse the authorized shared hierarchy

Configuración del negocio SHALL show authorized Core Sites and Areas by their
identities and expose empty, loading and failed-read states distinctly. An
Area-only view SHALL use only the Area and parent facts supplied to that caller.

#### Scenario: The viewer holds an Area scope

- **WHEN** the read reports one visible Area with the canonical parent's name and default time zone
- **THEN** the view shows that Area and the authorized parent facts without presenting a Site-wide control.

### Requirement: CSA-002 — Create and edit Sites and Areas under current Owner authority

The Owner view SHALL support creating a Site with an explicit default zone
and first Area, adding an Area to an active Site, editing a Site name or
default zone, and renaming an Area. Confirmed changes SHALL reflect the
returned Core result.

#### Scenario: The Owner creates a Site

- **WHEN** Core confirms the Site and first Area creation
- **THEN** the view displays both identities and the saved default zone.

#### Scenario: Creation is unconfirmed

- **WHEN** the Owner has sent a Site-and-first-Area creation or additional-Area creation and cannot confirm its outcome
- **THEN** the view retains the submitted fields and the original operation identity for an explicit matching retry
- **AND** shows the new resource only after receiving a confirmed result.

### Requirement: CSA-003 — Check each affected Area before archiving

The archive workflow SHALL obtain required owning-module confirmations for
each affected Area and keep submission paused while a dependency is open
or an answer is unavailable. An individual archive requires another active
Area at the Site. The view SHALL reflect Core's result for the operation.

#### Scenario: Inventory cannot report one Area during Site archive

- **WHEN** the owning module's check is unavailable for an Area within the Site
- **THEN** the archive panel shows that unavailable check and pauses submission.

### Requirement: CSA-004 — Restore the saved identities

The Owner view SHALL restore a Site with an explicitly chosen eligible Area
from the same Site. A standalone Area restore requires an active parent.

#### Scenario: The Owner restores an archived Site with one of its Areas

- **WHEN** Core confirms the restore
- **THEN** the view shows the original Site and selected Area active and their archived siblings still archived.

### Requirement: CSA-005 — Browse archived records explicitly

The ordinary list SHALL show active records. An Owner SHALL be able to
select archived-only or all records. Site and Area lists SHALL maintain
separate continuation for their current selection.

#### Scenario: Archived Areas in an active Site

- **WHEN** the Owner opens an active Site and selects archived Areas
- **THEN** its archived Areas are shown in their own list and the Site remains active.

### Requirement: CSA-006 — Present Core reference refusal without mutation

The archive review SHALL distinguish readiness of owning-module checks from a
confirmed Core refusal. A reference refusal SHALL leave Sites and Areas as
they were and SHALL NOT remove or rewrite assignments or invitations.

#### Scenario: A Core reference is still present despite positive prechecks

- **WHEN** the owning-module checks permit submission but Core establishes that a current reference prevents archiving
- **THEN** the review displays the refusal and preserves the displayed hierarchy.
