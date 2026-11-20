# First stock departure

## ADDED Requirements

### Requirement: SD-001 — Identify one departure in Movimientos

The merchant SHALL start “Registrar salida” from Movimientos in the existing responsive panel pattern. The form SHALL require one existing product identified by permanent ID, an explicitly selected Inventory origin and an explicitly selected channel enabled at that origin.

#### Scenario: Opening with a remembered viewing location

- **WHEN** the merchant starts a departure from Movimientos with a viewing location selected
- **THEN** the report form starts with an empty origin and channel, ready for explicit selection.

#### Scenario: The origin changes

- **WHEN** the merchant changes the origin after choosing a channel
- **THEN** the form clears the old channel and presents only eligible channels at the new origin.

#### Scenario: The selected origin has no eligible channels

- **WHEN** the channel read confirms that no channel is enabled for the selected origin
- **THEN** the form explains that state and a submitted departure waits for an eligible channel.

### Requirement: SD-002 — Preserve exact quantity and draft choices

The form SHALL reuse the shared receipt measurement rules for a positive exact quantity with a compatible input unit, starting with the configured product unit. A changed product or unit with an entered quantity SHALL require confirmation to clear it. A valid optional reference SHALL be kept exactly, with empty reference omitted. Discarding an edited open form SHALL require confirmation.

#### Scenario: The product is recorded in kilograms and the merchant enters grams

- **WHEN** the merchant submits a supported exact gram amount that satisfies the configured base-unit rules
- **THEN** the command retains the chosen unit and exact entered amount.

#### Scenario: Recorded stock may become negative

- **WHEN** the selected departure inputs satisfy the known form checks and the latest known balance is lower than the departure quantity
- **THEN** the merchant can submit the departure for Inventory's authoritative decision.

### Requirement: SD-003 — Distinguish departure outcomes and preserve uncertain commands

The form SHALL show confirmed Applied with the exact returned signed effect, confirmed Pending with recorded reasons, confirmed rejection, and unconfirmed delivery as distinct outcomes. Recovery of uncertain delivery SHALL use one frozen command and the existing bounded retry pattern. The command SHALL retain origin, channel, product, quantity, unit, reference presence and operation identity across attempts.

#### Scenario: The channel is disabled before Inventory evaluates the line

- **WHEN** Inventory retains the admitted departure as Pending for the disabled channel
- **THEN** the panel displays that recorded reason with the Pending outcome.

#### Scenario: A departure result is unknown after the bounded run

- **WHEN** attempts stop without a confirmed outcome and the merchant chooses to retry
- **THEN** the recovery reuses the original frozen command and waits for a confirmed result.
