# Stock commitments workspace

## ADDED Requirements

### Requirement: SC-001 — Inspect and reserve exact stock scope

The review workspace SHALL show the exact reservation product, stock location and channel. It SHALL present recorded on-hand and authoritative channel availability as distinct quantities where supplied. A reservation SHALL default to full quantity with partial acceptance available only by explicit choice.

#### Scenario: The requested quantity cannot be fully reserved

- **WHEN** a merchant explicitly permits partial acceptance and the fixture returns part of the exact requested quantity
- **THEN** the view shows the returned accepted and unaccepted amounts separately.

#### Scenario: An exact reservation read is unavailable

- **WHEN** the exact reference cannot be consulted
- **THEN** the view reports the read state without displaying a fabricated record, quantity or release/fulfillment action.

#### Scenario: Choose a reservation scope

- **WHEN** the merchant chooses a product, stock location and enabled channel from supplied authorized combinations
- **THEN** the reservation shows those exact selected facts and the reference supplied on confirmation
- **AND** changing a selection clears any dependent choices that require a new selection.

### Requirement: SC-002 — Release unfulfilled stock and show authoritative results

The workspace SHALL route release through an explicit action targeting the inspected reference and SHALL show the supplied released and remaining quantities independently from any sourced physical stock result.

#### Scenario: Release after a partial fulfillment

- **WHEN** the merchant releases remaining quantity after goods have left
- **THEN** the view shows only the confirmed remaining quantity released, and any supplied physical stock value retains the effect of the earlier fulfillment.

### Requirement: SC-003 — Confirm fulfillment and the outstanding remainder

The workspace SHALL show the exact unit and require an explicit keep or release choice for partial fulfillment. It SHALL render the returned signed physical effect and returned outstanding quantity as separate facts. No ordinary departure SHALL represent commitment fulfillment.

#### Scenario: Fulfill part and keep the remainder

- **WHEN** the merchant records an exact partial fulfillment and chooses to keep the rest
- **THEN** the view shows the confirmed physical effect, outstanding quantity and unchanged expiry where supplied.

### Requirement: SC-004 — Preserve genuine uncertainty

The review workspace SHALL keep unconfirmed delivery distinct from acceptance, rejection and exact-read unavailability. The preview SHALL retain the captured action during the visit and introduce no retry meaning while the callable commitment contract is deferred.

#### Scenario: A release reply is unavailable

- **WHEN** the release simulation has no confirmed outcome
- **THEN** the workspace displays the uncertainty and neither updates the reservation as released nor resends the action.

### Requirement: SC-005 — Require native and browser interfaces for live commitments

November 30 live delivery SHALL include verified native Inventory behavior and verified browser gateway routes for authorized commitment creation, exact reads, release and fulfillment. Browser integration SHALL preserve current authority, exact facts and the approved operation-specific outcome and recovery contract once available.

#### Scenario: Storybook review passes while deferred interfaces are unavailable

- **WHEN** the review fixtures and their images are accepted before the native and browser interfaces are available
- **THEN** live commitments remain blocked until both verified interfaces are available.

### Requirement: SC-006 — Review explicit backed-hold settings

The settings review SHALL distinguish site settings and a location override.
It SHALL require explicit per-hold and total-active numeric caps or an explicit
unlimited choice for each quantity cap, initial duration, maximum lifetime and
an extension choice. If extensions are enabled, require their duration and
count before showing a simulated established outcome.

#### Scenario: One required setting is missing

- **WHEN** a quantity cap or timing setting is still blank, or the selected extension policy is incomplete
- **THEN** the review does not confirm the settings.
