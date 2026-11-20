# Pending departure inspection

## ADDED Requirements

### Requirement: PDI-001 — Read a listed departure by exact line reference

Pendientes SHALL open the listed Salida from its product-name control in
the shared responsive inspector. The read SHALL use that line's exact
reference and current inspection access.

#### Scenario: Two listed departures have the same product name

- **WHEN** a merchant opens one of those departures
- **THEN** the inspector reads the reference of the selected line.

### Requirement: PDI-002 — Show the authoritative current result and saved facts

The inspector SHALL use the current read to show status, product, actual
origin location, exact quantity, unit and channel. Independently unresolved
facts SHALL remain explicitly undetermined. A pending result SHALL show
recorded reasons. An applied result SHALL show the exact signed stock effect
returned by the read separately from the recorded quantity.
A rejected result SHALL show the recorded rejection reason where supplied.

#### Scenario: The amount is known and the channel is unresolved

- **WHEN** the read reports a pending departure with a known quantity and an unresolved channel
- **THEN** the inspector presents the exact amount, the undetermined channel and the reasons recorded for that line.

#### Scenario: The departure was resolved

- **WHEN** the read reports a committed resolution
- **THEN** the inspector displays that outcome and the confirmed effect or reason supplied with it.

### Requirement: PDI-003 — Distinguish the exact read states

The inspector SHALL offer an explicit same-line refresh after a detail result
loads, distinguish loading and a generic unavailable result from technical
failure, and offer same-line retry after a technical failure. A late result
for a closed inspector or a superseded line SHALL leave the current view intact.

#### Scenario: A technical detail read fails

- **WHEN** the merchant chooses Reintentar
- **THEN** the inspector reads the same line again and displays the actual outcome.

#### Scenario: A protected line is unavailable

- **WHEN** the read reports that the selected line is unavailable
- **THEN** the inspector displays the generic unavailable state as the only detail for the line.

### Requirement: PDI-004 — Return to the reached position in Pendientes

Returning from exact Salida inspection SHALL preserve the scope, page size
and reached page position. Apply the existing same-position refresh rule
after resolution or unavailable detail. A still-pending result SHALL leave
the list at its current page and restore focus to its opening control.

#### Scenario: The inspection reports a later resolution

- **WHEN** the merchant chooses Volver a Pendientes
- **THEN** Pendientes requests fresh results for the same browsing position
- **AND** the list response determines which rows remain visible.
