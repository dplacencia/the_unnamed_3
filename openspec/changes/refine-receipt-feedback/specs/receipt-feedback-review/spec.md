## ADDED Requirements

### Requirement: RFR-001 — Show the receipt outcome with the applicable next action

The proposed Storybook comparison SHALL show supplied receipt facts and provide
the action that corresponds to the known outcome.

#### Scenario: Inventory confirmed Pending when the receipt was recorded

- **WHEN** the fixture returns a confirmed Pending receipt line
- **THEN** the panel shows the original result, retained reasons and absence of an effect at registration
- **AND** Ver detalles uses that line's exact reference for the existing current-status inspector
- **AND** Volver a la entrada restores the original result, including after a current detail read reports a resolution.

#### Scenario: Inventory's receipt outcome cannot be confirmed

- **WHEN** the existing recovery run stops with the result unconfirmed
- **THEN** the panel makes that uncertainty explicit
- **AND** Reintentar la misma entrada uses the original operation identity and contents through the existing bounded retry
- **AND** the panel does not present a confirmed effect or a Pending line.

#### Scenario: The separate balance read fails after application

- **WHEN** the receipt is confirmed applied and its balance lookup fails technically
- **THEN** the exact applied quantity remains visible
- **AND** Reintentar consulta runs the balance read for the same product and location.
