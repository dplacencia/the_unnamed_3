## ADDED Requirements

### Requirement: OWJ-001 — One selected business through first stock

The Owner review SHALL retain the selected business throughout configuration,
product creation, receipt and departure. A confirmed Core Site and Area SHALL
be the resources displayed when establishing a separate Inventory stock location.
A departure SHALL use an explicit location and a channel enabled at that location.

#### Scenario: Confirmed setup becomes usable

- **WHEN** the Owner configures a Site, Area, stock location and product in the review
- **THEN** the Owner may select the confirmed product and location in a receipt without selecting another business
- **AND** the recorded stock lookup reflects the confirmed receipt and later departure exactly.

#### Scenario: Switching business

- **WHEN** the Owner switches to another business in the review
- **THEN** the replacement workspace shows only the new selected business and its data
- **AND** reopening the first business restores its confirmed fixture records for that visit.

### Requirement: OWJ-002 — Inventory access remains distinct from Core

The Owner review SHALL present Inventory trial and access outcomes supplied
by the fixture. A confirmed pause or unavailable access check SHALL keep
authorized Core workspace controls usable.

#### Scenario: Inventory paused

- **WHEN** the supplied state confirms that Inventory access is paused
- **THEN** the Owner sees that state and retains access to the Core workspace
- **AND** Inventory work is unavailable until the supplied access state allows it.
