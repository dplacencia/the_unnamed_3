## ADDED Requirements

### Requirement: CAV-001 — Independently inspect channel availability

The channel-availability lookup SHALL use the selected product, actual stock
location and enabled channel. It SHALL present a returned exact available
quantity and unit without deriving availability from recorded stock.
Changing the selection SHALL clear the earlier result.

#### Scenario: Two channels return different amounts

- **WHEN** Inventory supplies a positive exact quantity for one channel and an
  explicit zero for another at the same product and location
- **THEN** each lookup displays the respective returned quantity and unit

### Requirement: CAV-002 — Show availability uncertainty honestly

A loading, failed or unavailable read SHALL be distinct from a known result.
A technical failure SHALL offer retrying the exact same scoped lookup.

#### Scenario: Requested information cannot be shown

- **WHEN** the preview receives an unavailable response
- **THEN** the workspace describes it without showing an amount or unit
- **AND** the operation changes no recorded stock or commitment
