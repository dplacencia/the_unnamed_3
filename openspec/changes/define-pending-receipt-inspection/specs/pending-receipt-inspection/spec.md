# Pending receipt inspection

## ADDED Requirements

### Requirement: PRI-001 — Inspect one confirmed pending receipt line

Movimientos SHALL support read-only inspection of one specifically identified
receipt line that Inventory confirmed as Pending. The information displayed
SHALL be tied to that line and available under current access.

#### Scenario: A merchant inspects a confirmed pending receipt line

- **WHEN** an authorized merchant inspects the known receipt line
- **THEN** the inspection identifies that exact line and presents the established receipt facts
- **AND** it distinguishes the reported quantity from any stock effect Inventory confirms.

#### Scenario: A receipt submission has an unknown outcome

- **WHEN** the original submission remains unconfirmed
- **THEN** the receipt stays in the previously defined submission recovery flow.

### Requirement: PRI-002 — Open inspection from the confirmed Pending result

The confirmed Pending receipt result SHALL offer “Ver detalles” to open
inspection of the exact line in Movimientos. The inspection SHALL use the
line reference returned in the receipt result and current inspection access.
The Storybook design SHALL model the native current-detail read with synthetic
data.

#### Scenario: A merchant opens details for a pending line

- **WHEN** the merchant chooses “Ver detalles” on the confirmed Pending receipt result
- **THEN** the inspector reads the exact referenced line under current inspection access
- **AND** the displayed inspection outcome reflects the result of that read.

#### Scenario: The outcome changed after the original receipt reply

- **WHEN** the authorized exact read returns a subsequent resolution
- **THEN** the inspector presents the resolution returned by that read
- **AND** the original receipt result retains the outcome Inventory reported for the submission.

### Requirement: PRI-003 — Reuse the receipt panel for inspection

The inspection SHALL reuse the open receipt panel, as a side panel on desktop
and a full-screen panel on phones. It SHALL offer “Volver a la entrada” to
return to the original confirmed receipt result.

#### Scenario: A merchant opens the inspector from the receipt result

- **WHEN** the merchant chooses “Ver detalles” in the receipt panel
- **THEN** the open panel shows the exact-line inspection.

#### Scenario: A merchant returns from inspection to the receipt result

- **WHEN** the merchant chooses “Volver a la entrada”
- **THEN** the same panel shows the original confirmed receipt result.

### Requirement: PRI-004 — Keep the first preview within the open receipt panel

The first Storybook preview SHALL provide inspection through the confirmed
receipt result while its panel is open. Rediscovering earlier receipts is a
separate Movimientos browsing design.

#### Scenario: A merchant closes the receipt panel

- **WHEN** the merchant closes the receipt panel from the original result or the inspector
- **THEN** the preview ends its inspection flow and returns to the underlying workspace.

### Requirement: PRI-005 — Show the current outcome and saved receipt facts together

The inspector's default view SHALL show the current outcome, saved product,
actual location and exact saved quantity and unit to the extent known from the
authorized read and permitted context. It SHALL preserve the independent
certainty of the quantity value and unit.

#### Scenario: Inventory still reports the receipt line as Pending

- **WHEN** the authorized exact read returns Pending
- **THEN** the default view shows the current outcome and known receipt facts
- **AND** it shows the reasons Inventory retained when it recorded the line as Pending.

#### Scenario: Inventory supplies a confirmed applied stock effect

- **WHEN** the authorized exact read returns an applied stock effect
- **THEN** the default view shows the exact effect and unit separately from the saved receipt quantity.

#### Scenario: A saved detail is unresolved

- **WHEN** Inventory marks a saved product, quantity value or unit as unresolved
- **THEN** the view preserves that uncertainty and displays the facts that are known.

### Requirement: PRI-006 — Label the original outcome and the current inspection

In the inspection preview, the original confirmed receipt result SHALL be
labelled “Resultado al registrar la entrada”. The inspector's outcome from
the exact read SHALL be labelled “Estado actual”.

#### Scenario: A merchant returns after inspecting a subsequently applied line

- **GIVEN** the original receipt result was Pending and the inspection returned Applied
- **WHEN** the merchant chooses “Volver a la entrada”
- **THEN** the Pending outcome appears under “Resultado al registrar la entrada”.

#### Scenario: The outcomes match

- **WHEN** the original result and the inspection both report Pending
- **THEN** each view still displays its own label.

### Requirement: PRI-007 — Show the exact inspection read state

The inspector SHALL present a neutral state during loading and distinguish an
unavailable result from a technical read failure. In these cases it SHALL show
only the inspection state and keep “Volver a la entrada” available.

#### Scenario: The current inspection is loading

- **WHEN** the exact read is in progress
- **THEN** the inspector shows the neutral loading state.

#### Scenario: Inventory reports that the line is unavailable

- **WHEN** the exact read returns the generic unavailable outcome
- **THEN** the inspector displays “No se pueden consultar los detalles de esta entrada”
- **AND** it preserves the shared meaning of that outcome and shows no receipt details.

#### Scenario: A technical error prevents an inspection

- **WHEN** a technical read failure leaves the current outcome unconfirmed
- **THEN** the inspector explains the read failure and offers “Reintentar”
- **AND** choosing “Reintentar” requests a fresh exact read of the same line.

### Requirement: PRI-008 — Refresh the inspected line on request

While showing a current receipt outcome, the inspector SHALL offer
“Actualizar”. The action SHALL request a fresh read of the same line
reference under current inspection access.

#### Scenario: A merchant updates the inspection

- **WHEN** the merchant chooses “Actualizar” after an inspection
- **THEN** the inspector shows the neutral loading state until the new read completes
- **AND** the latest read determines the displayed inspection outcome.
