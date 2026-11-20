# Pending movements browsing

## ADDED Requirements

### Requirement: PMB-001 — Find currently pending lines in Movimientos

Movimientos SHALL provide Pendientes browsing under current inspection access.
The view SHALL present the Pending lines reported for its browsing scope.
The merchant SHALL be able to open a listed receipt by its exact line
reference.

#### Scenario: A merchant looks for a receipt after closing the receipt panel

- **WHEN** the merchant opens Pendientes and an authorized list read returns a still-pending receipt
- **THEN** the view offers access to inspection of that listed receipt line.

#### Scenario: A listed receipt is resolved before the merchant opens it

- **WHEN** the merchant opens the listed receipt and the exact read returns a resolution
- **THEN** the inspection shows the current outcome for that line.

### Requirement: PMB-002 — List pending receipts and departures together

Pendientes SHALL list both currently pending receipts and departures returned
for the browsing scope. The Spanish list SHALL label these kinds “Entrada”
and “Salida”. Receipt details SHALL use the exact receipt inspector.

#### Scenario: The authorized browsing page includes both movement kinds

- **WHEN** Inventory returns pending receipt and departure lines for the selected scope
- **THEN** the list presents both kinds with their corresponding labels.

### Requirement: PMB-003 — Offer one location or all locations with inspection access

Pendientes SHALL use the Movimientos viewing scope. The merchant SHALL be able
to select one location or explicitly choose “Todas las ubicaciones accesibles”.
Initial location selection SHALL follow NAV-009. The list SHALL identify its
current scope.

#### Scenario: The merchant chooses one location

- **WHEN** a single location is selected in Movimientos
- **THEN** Pendientes reads that location under current inspection access.

#### Scenario: The merchant chooses all accessible locations

- **WHEN** the merchant chooses “Todas las ubicaciones accesibles”
- **THEN** Pendientes uses the scope covered by current inspection access
- **AND** the view identifies the scope as all accessible locations.

### Requirement: PMB-004 — Open Pendientes on request inside Movimientos

Movimientos SHALL offer a visible “Pendientes” action. It SHALL open the list
in the main workspace and keep “Registrar entrada” available.

#### Scenario: The merchant opens Pendientes

- **WHEN** the merchant chooses “Pendientes” in Movimientos
- **THEN** the workspace opens the Pending lines view for the applicable scope
- **AND** “Registrar entrada” remains available.

### Requirement: PMB-005 — Remember an explicit all-accessible choice per tab

When the merchant chooses “Todas las ubicaciones accesibles”, Pendientes
SHALL remember that scope choice while the tab stays open for the same
business. Reopening the list SHALL use current inspection access.

#### Scenario: The merchant reopens Pendientes in the same tab and business

- **GIVEN** the merchant explicitly chose “Todas las ubicaciones accesibles”
- **WHEN** the merchant reopens Pendientes
- **THEN** the list restores the chosen scope and requests fresh data with current inspection access.

#### Scenario: The merchant opens Pendientes in a new tab or business

- **WHEN** the earlier scope choice does not apply to the tab and business
- **THEN** Pendientes follows the existing location selection rules.

### Requirement: PMB-006 — Show compact row facts and expandable reasons

The list SHALL show Tipo, Producto and the exact saved Cantidad and unit where
known. When viewing all accessible locations, it SHALL also show each line's
actual Ubicación. Both movement kinds SHALL offer inline expansion of
Inventory's recorded reasons.

#### Scenario: A merchant views multiple locations

- **WHEN** Pendientes displays rows for all accessible locations
- **THEN** the list identifies the actual location alongside each line.

#### Scenario: Inventory returns partly unresolved saved facts

- **WHEN** a row contains a known quantity value or known unit alongside an unresolved fact
- **THEN** the list displays the known component exactly and preserves the uncertainty of the unresolved component.

#### Scenario: A merchant expands a row

- **WHEN** the merchant expands an Entrada or Salida row
- **THEN** its inline detail shows the reasons Inventory retained when it recorded that line as Pending.

### Requirement: PMB-007 — Inspect a listed receipt in the responsive panel

Selecting a listed Entrada SHALL open the existing exact receipt inspector
as a side panel on desktop and full screen on phones. The panel SHALL offer
“Volver a Pendientes” with the list's scope and browsing position preserved.

#### Scenario: A merchant returns from inspecting a listed receipt

- **WHEN** the merchant uses “Volver a Pendientes”
- **THEN** the panel closes and the workspace returns to the list and its current browsing context.

### Requirement: PMB-008 — Refresh the list after resolution or unavailable detail

On return from an inspection that reported a resolution or unavailable detail,
Pendientes SHALL request fresh results for the current browsing position
under current access. The returned list determines which rows are displayed.

#### Scenario: The inspected line has been resolved or is unavailable

- **WHEN** the merchant returns to Pendientes after the inspector reported a resolution or unavailable detail
- **THEN** Pendientes requests fresh results at the current position
- **AND** the list uses its own read to determine which lines are visible.

#### Scenario: The inspected line is still pending

- **WHEN** the merchant returns after the inspection confirms the line is still pending
- **THEN** Pendientes keeps the current page and browsing position.

### Requirement: PMB-009 — Move between result groups and show the reached position

Pendientes SHALL use “Anterior” and “Siguiente” with the corresponding
Inventory continuation tokens. A successful navigation to a group with rows
SHALL replace the visible rows. “Página N” SHALL denote the position reached
through successful navigation from the first group of this view.

#### Scenario: Inventory returns the requested next or previous group

- **WHEN** an authorized directional page request returns a group with rows
- **THEN** Pendientes displays those rows and their reached page position.

#### Scenario: A directional page request fails

- **WHEN** a request cannot establish the next or previous group
- **THEN** Pendientes does not change the displayed page position to the requested one.

### Requirement: PMB-010 — Offer 25, 50 and 100 pending lines per page

Pendientes SHALL default to 50 lines per page and offer 25, 50 and 100.

#### Scenario: The merchant changes the page size

- **WHEN** the merchant chooses a different page size
- **THEN** Pendientes requests the first group at the chosen size for the current scope.

### Requirement: PMB-011 — Show a displayed line count and a supplied estimate

Pendientes SHALL show the exact number of lines on the displayed page. When
Inventory supplies an estimated total for that scope, the view SHALL show it
separately and label it as an estimate.

#### Scenario: The list read supplies an estimated total

- **WHEN** the authorized page carries an estimated total for its scope
- **THEN** Pendientes shows the displayed line count and supplied estimate as separate values.

#### Scenario: The list read supplies only the current rows

- **WHEN** the authorized page has no supplied estimate
- **THEN** the view shows the exact displayed line count.

### Requirement: PMB-012 — Retain page size and reopen at the first group

Pendientes SHALL remember an explicit page size for the same business in
the current tab. Reopening the list after leaving SHALL request the first
group for the applicable scope and size. Returning directly from the
inspector SHALL follow PMB-007 and PMB-008.

#### Scenario: The merchant leaves and reopens Pendientes

- **WHEN** the merchant reopens the list in the same business and tab
- **THEN** Pendientes uses the remembered size and reads the first group afresh.

#### Scenario: The browsing scope changes

- **WHEN** the merchant chooses a different scope
- **THEN** Pendientes starts with the first group for that scope at the current page size.

### Requirement: PMB-013 — Distinguish previous rows, loading and technical failure

Pendientes SHALL show neutral loading on the first read or after a scope
change. During a subsequent read within the same scope, it SHALL keep the
preceding rows identified as previous results until the request finishes.

#### Scenario: A first read for the scope fails technically

- **WHEN** a technical failure occurs before any results load for the current scope
- **THEN** Pendientes shows the read error and offers “Reintentar” for that request.

#### Scenario: A subsequent read fails technically within the same scope

- **WHEN** a subsequent list read fails technically
- **THEN** Pendientes retains the marked previous results
- **AND** it offers “Reintentar” for the requested read.

#### Scenario: The selected or known authorized scope changes

- **WHEN** the merchant changes the Movimientos viewing scope or the effective inspection scope is known to have changed
- **THEN** Pendientes clears the previous scope's rows and continuation tokens and shows neutral loading for the first group in the applicable scope
- **AND** an outcome from the superseded scope cannot update the new view.

#### Scenario: Inventory rejects access to the requested scope

- **WHEN** Inventory reports that current access does not permit the requested scope
- **THEN** Pendientes reports the access outcome and clears any affected previous rows.

### Requirement: PMB-014 — Preserve the previous page when the destination is unavailable

If Inventory rejects a directional continuation token or returns an empty
directional continuation, Pendientes SHALL explain the outcome and preserve
the previous page position and browsing settings. It SHALL keep the last
loaded rows visibly identified as previous results wherever current access
still permits their display.

#### Scenario: Inventory rejects the destination's continuation token

- **WHEN** Inventory reports that a directional continuation token is invalid
- **THEN** Pendientes explains that the requested page could not be opened and stays at the last reached position.

#### Scenario: The requested destination has no lines

- **WHEN** Inventory returns an authorized directional continuation with zero rows
- **THEN** Pendientes explains that the requested page has no results and stays at the last reached position.

### Requirement: PMB-015 — Restart on request after an unavailable page

Pendientes SHALL offer “Volver al inicio” when a continuation is rejected or
an authorized continuation read returns no rows. The action SHALL request
the first group for the current scope and page size. The displayed position
SHALL move to the first group when that read succeeds.

#### Scenario: The merchant restarts after an unavailable directional destination

- **WHEN** the merchant chooses “Volver al inicio” after the outcome described in PMB-014
- **THEN** Pendientes requests the first group with the existing scope and size
- **AND** a successful read shows its rows and first-group position.

#### Scenario: The current continuation is unavailable on return from the inspector

- **WHEN** the same-position read required by PMB-008 returns a rejected continuation or an authorized continuation with no rows
- **THEN** Pendientes explains the outcome and offers “Volver al inicio”
- **AND** a rejection retains any permitted previous rows visibly marked, while an authorized empty result shows zero rows at the current position.

#### Scenario: The first group has no lines

- **WHEN** an authorized first-group read returns no rows
- **THEN** Pendientes shows an empty result for the read scope without a restart action.
