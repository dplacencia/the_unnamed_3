# Stock lookup

## ADDED Requirements

### Requirement: SL-001 — Look up recorded stock for one authorized product and location

Existencias SHALL provide the recorded balance for one selected product and one
selected stock location under current access. The view SHALL identify both parts
of the pair and preserve the returned signed quantity and its unit exactly. Recorded
zero, absence of a record and an unsuccessful lookup SHALL remain distinct.

#### Scenario: A merchant consults one product at a stock location

- **WHEN** the authorized exact read returns a balance
- **THEN** the view shows the returned amount and unit for that product and location
- **AND** it identifies the result as recorded stock.

#### Scenario: An exact read reports no stock record or cannot complete

- **WHEN** Inventory reports absence or the lookup cannot establish a balance
- **THEN** the view shows that state without representing it as a recorded zero.

### Requirement: SL-002 — Open Existencias directly or from known context

The merchant SHALL be able to open the lookup from Existencias or through an
authorized “Ver existencias” shortcut in product details or an applied receipt.
The product shortcut SHALL carry the exact product. The receipt shortcut SHALL
carry the exact product and location. Each read SHALL require current access.

#### Scenario: A merchant opens the lookup from product details

- **WHEN** the merchant chooses the shortcut from an eligible product's details
- **THEN** Existencias uses that product as the starting selection
- **AND** the location follows the viewing scope rules for Existencias.

#### Scenario: A merchant opens the lookup from an applied receipt

- **WHEN** the merchant chooses the authorized shortcut for the applied receipt
- **THEN** Existencias opens with the receipt's exact product and location identified
- **AND** the lookup obtains its own recorded balance rather than using the receipt effect.

### Requirement: SL-003 — Use the receipt location for this consultation

Existencias SHALL use the authorized receipt location for the consultation opened
from the receipt. A subsequent ordinary visit SHALL use the existing location
preferences and defaults for Existencias in that tab. A location explicitly
chosen in the selector SHALL be remembered under the same viewing rules.

#### Scenario: The receipt location differs from the remembered location

- **GIVEN** the merchant previously chose Almacén in Existencias
- **WHEN** the merchant opens the shortcut from an applied receipt at Sala de ventas
- **THEN** the consultation shows Sala de ventas as its location
- **AND** on the next ordinary visit in the same tab, Existencias uses Almacén if still accessible.

#### Scenario: The merchant chooses a different location during a receipt consultation

- **WHEN** the merchant explicitly selects a location in Existencias after opening the receipt shortcut
- **THEN** Existencias uses the new selection as the current scope
- **AND** remembers that selection for ordinary visits in the same tab.

### Requirement: SL-004 — Read when both selections are available

Existencias SHALL start a fresh exact read when a selected product and an
eligible stock location form a complete pair. The same rule SHALL apply to a
completed pair supplied through an entry point. Text typed into product search
SHALL only help find a product choice.

#### Scenario: The merchant completes the pair

- **WHEN** the merchant selects the missing product or location
- **THEN** Existencias starts the authorized read for that pair automatically.

#### Scenario: The merchant opens Existencias with a complete pair

- **WHEN** the approved shortcut provides an exact product and eligible location
- **THEN** Existencias starts the authorized read without an additional submit action.

#### Scenario: The merchant searches for a product

- **WHEN** the merchant types search text without choosing a different product
- **THEN** Existencias uses the text to find choices and the selected pair is unchanged.

### Requirement: SL-005 — Clear the previous outcome on a pair change

When the selected product or location changes, Existencias SHALL clear the
previous lookup outcome. It SHALL show loading for the new complete pair or
prompt for the missing selection when the pair is incomplete. The current
consultation SHALL only accept the outcome of its latest read.

#### Scenario: The merchant changes location while a read is pending

- **GIVEN** Existencias is awaiting a read for Almacén
- **WHEN** the merchant chooses Sala de ventas
- **THEN** Existencias shows loading for Sala de ventas
- **AND** the earlier Almacén response cannot update the outcome.

#### Scenario: The merchant returns to a pair before its earlier read finishes

- **WHEN** the merchant switches away from a pair and then selects it again
- **THEN** Existencias starts a new read for the reselected pair
- **AND** any superseded response for that same pair is ignored.

#### Scenario: The merchant changes a pair with a recorded balance

- **WHEN** the merchant changes the selected product or location while a recorded balance is displayed
- **THEN** Existencias clears the previous result immediately
- **AND** shows the current scope and the corresponding loading or missing selection state.

### Requirement: SL-006 — Remember explicit product selections per tab

Existencias SHALL remember an explicitly selected product for the same business
in the current tab. A shortcut product SHALL supply the selection for its visit.
An ordinary entry SHALL restore the remembered product when still eligible or
start without a product. A restored pair SHALL require a fresh read.

#### Scenario: The merchant returns to Existencias from the sidebar

- **GIVEN** the merchant explicitly chose an eligible product in Existencias in this tab and business
- **WHEN** the merchant reopens Existencias from the sidebar
- **THEN** Existencias restores the product selection
- **AND** reads the current balance when the selected location is available.

#### Scenario: An entry point supplies another product

- **WHEN** the merchant enters via an approved shortcut for a different product
- **THEN** the consultation uses that product for the visit
- **AND** an ordinary entry restores the earlier explicit choice unless the merchant has chosen a new product in the selector.

#### Scenario: The merchant opens Existencias in a new tab

- **WHEN** the merchant opens Existencias from the sidebar in a new tab
- **THEN** no product is selected until the merchant chooses one.

### Requirement: SL-007 — Select the exact product through a searchable picker

Existencias SHALL offer a searchable product picker based on Registrar entrada.
It SHALL find choices by product name and identify a selected product by its
exact product ID.

#### Scenario: Multiple products have the same name

- **WHEN** the picker shows choices for products with the same name
- **THEN** it provides a reference or product ID to distinguish them
- **AND** choosing one identifies the exact product for the lookup.

### Requirement: SL-008 — Show the exact recorded balance or absence for the selected pair

Existencias SHALL keep the selected product and location visible with the
result. A recorded result SHALL show the exact signed balance and base unit under
“Existencias registradas”. The balance display SHALL consist of the amount and
unit.

#### Scenario: Inventory returns a recorded zero or a negative balance

- **WHEN** the authorized read supplies zero or a negative amount
- **THEN** the amount is shown as returned with its unit, preserving a negative sign and the exact value.

#### Scenario: Inventory returns no record for the pair

- **WHEN** the authorized exact read succeeds with no stock record
- **THEN** Existencias shows “No hay un registro de existencias para este producto en esta ubicación.”
- **AND** the result contains no quantity.

### Requirement: SL-009 — Refresh or retry a lookup on request

After a balance or no-record result, Existencias SHALL offer “Actualizar”.
After a technical failure, it SHALL offer “Reintentar”. Either action SHALL
start a fresh, authorized read of the current exact pair. Regaining focus on
the open tab SHALL leave the consultation as it is.

#### Scenario: The merchant requests another read

- **WHEN** the merchant chooses “Actualizar” after a result or “Reintentar” after a technical failure
- **THEN** Existencias starts another read of the current product and location under current access.

#### Scenario: The merchant returns to an already open lookup tab

- **WHEN** that tab regains focus with the same consultation open
- **THEN** Existencias leaves the result and current selections as they are.

### Requirement: SL-010 — Label a retained balance as the previous result

When refreshing or retrying the same pair after a recorded balance, Existencias
SHALL retain that balance with “Resultado anterior”. The label SHALL remain if
the new read fails technically.
A successful read SHALL replace the retained balance with its own outcome.
Denied access or an invalid pair SHALL clear the previous result.

#### Scenario: Updating or retrying a pair after it returned a balance

- **WHEN** a fresh read of the same pair is in progress or fails technically
- **THEN** the last recorded balance is shown with “Resultado anterior” and the loading or failure state
- **AND** a technical failure offers “Reintentar”.

#### Scenario: The first read fails technically

- **WHEN** the read fails before a recorded balance has been established for the consultation
- **THEN** Existencias shows the failure and “Reintentar” without a quantity.

#### Scenario: Refresh yields a balance or no record

- **WHEN** a successful fresh read returns an outcome
- **THEN** Existencias replaces the previous result with the new balance or no-record message.

#### Scenario: The new read denies access or reports the pair invalid

- **WHEN** the read reports denied access or an invalid pair
- **THEN** Existencias clears the previous result and shows the applicable outcome without a quantity.

### Requirement: SL-011 — Explain authoritative denial or an invalid pair

Existencias SHALL distinguish denied access and an invalid pair from authorized
absence and technical failures. It SHALL identify the applicable reason in the
result area using information the merchant is permitted to see. The merchant
SHALL be able to choose another product or location.

#### Scenario: Inventory denies the stock read

- **WHEN** current access does not permit the exact read
- **THEN** Existencias explains denied access without showing a balance or protected selection details
- **AND** keeps any selection labels the merchant is permitted to see.

#### Scenario: Inventory reports the pair invalid

- **WHEN** the authorized read reports that the selected pair is invalid
- **THEN** Existencias explains that the selected pair cannot be consulted
- **AND** keeps the attempted selection visible where permitted.

#### Scenario: The read has an authoritative denial or invalid-pair outcome

- **WHEN** the corresponding explanation is displayed
- **THEN** Existencias offers the available selectors to change the pair
- **AND** “Reintentar” remains reserved for technical failures.
