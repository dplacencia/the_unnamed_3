## ADDED Requirements

### Requirement: ISW-001 — Identify a stock location by owning facts

Inventory settings SHALL show Core Site and Area context separately from the
Inventory-owned stock-location ID and linkage state. Confirmed absence, a
confirmed link and an unavailable read SHALL have distinct presentation.

#### Scenario: Check an Area without a current answer

- **WHEN** the location lookup is unavailable or incomplete
- **THEN** the workspace shows that the link could not be checked and offers a fresh read
- **AND** stock setup requires confirmed absence, an active Area and current authority

### Requirement: ISW-002 — Set up stock explicitly

The stock-location setup review SHALL identify the selected Core Site and Area
and require an explicit calendar. The continuous example SHALL require the
business-day boundary, preserve supported entered precision and avoid calendar
or timezone defaults.

#### Scenario: Record a deliberate midnight boundary

- **WHEN** the merchant chooses continuous operation and explicitly enters midnight
- **THEN** the preview can submit a present calendar with a zero-valued boundary
- **AND** a successful reply supplies the separate stock-location ID

#### Scenario: An overnight schedule and a dated closure

- **WHEN** the merchant chooses a scheduled calendar, explicitly configures each weekday and adds a dated closure
- **THEN** the preview represents the closure as that date's complete replacement with no sessions
- **AND** a weekday session that closes the next day retains its explicit next-day selection.

### Requirement: ISW-003 — Create channels separately from location enablement

The workspace SHALL offer channel creation as a merchant operation. Enablement
SHALL require a known authorized active stock location, a channel and an
explicit before-anchor or at-end placement.

#### Scenario: Enable a channel between two existing channels

- **GIVEN** a known location's channels are Mostrador then Tienda en línea
- **WHEN** the merchant confirms Reparto before Tienda en línea and Inventory establishes that placement
- **THEN** the workspace shows Mostrador, Reparto, Tienda en línea at that location

#### Scenario: Create a channel without enablement

- **WHEN** Inventory confirms a new merchant channel
- **THEN** the channel appears in the merchant list and has no location enablement

### Requirement: ISW-004 — Retain honest configuration outcomes

The workspace SHALL distinguish an established outcome, refusal and an
unconfirmed result. A retry from the retained unconfirmed state SHALL reuse the
complete original command including its operation identity.

#### Scenario: Recover a channel creation reply

- **WHEN** the original creation outcome is unconfirmed and the merchant explicitly retries
- **THEN** the preview uses the same original command
- **AND** adds the channel to the confirmed list only after an established outcome

### Requirement: ISW-005 — Review using synthetic owning responses

The review SHALL use synthetic Core and Inventory inputs and replies across the
backoffice's supported locales and responsive profiles.

#### Scenario: Review an Area-linked setup

- **WHEN** the stock setup example is opened in Storybook
- **THEN** it can be inspected without a Core or Inventory connection
- **AND** the design records the difference between the target Area-linked
  contract and the Inventory-only browser routes that exist
