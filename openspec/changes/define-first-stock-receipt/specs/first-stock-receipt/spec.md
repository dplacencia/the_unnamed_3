# First stock receipt

## ADDED Requirements

### Requirement: SR-001 — One product, one stock location and one receipt quantity

The first manual receipt in Movimientos SHALL record one existing product, one
stock location and one positive exact quantity. Application follows Inventory's
measurement rules. The recorded balance for that pair comes from the separate
authorized stock read.

#### Scenario: Recording a delivery after creating a product

- **WHEN** Inventory confirms that it applied the first delivery in this flow
- **THEN** the receipt applies to the specified product and stock location
- **AND** the authorized read supplies any displayed current recorded balance.

#### Scenario: Product creation has completed but no receipt has been applied

- **WHEN** the merchant has created the product without an applied receipt or other stock operation
- **THEN** the frontend does not treat the product identity or requested receipt quantity as a recorded balance.

### Requirement: SR-002 — Open the receipt from Movimientos or confirmed product details

The merchant SHALL be able to start the receipt from “Registrar entrada” in
Movimientos or a shortcut in the confirmed product's details. Both entry points
SHALL open the same receipt flow. The shortcut SHALL carry over the confirmed
product identity.

#### Scenario: Opening a receipt from the product's details

- **WHEN** a merchant with receipt access chooses the shortcut for a confirmed product
- **THEN** the receipt starts with that product selected
- **AND** the merchant supplies the stock location and quantity.

### Requirement: SR-003 — Require an explicit destination choice

A fresh receipt SHALL start with no selected destination. The merchant SHALL
choose an eligible stock location before submission, including when there is
only one eligible location. A selected stock viewing location SHALL NOT choose
the receipt destination.

#### Scenario: One eligible destination is available

- **WHEN** the merchant starts a receipt and can choose only one eligible location
- **THEN** the receipt still asks the merchant to choose that location explicitly.

### Requirement: SR-004 — Allow exact quantities in compatible units

The receipt form SHALL let merchants enter the amount in a predefined unit
compatible with the selected product's configured dimension. The form SHALL show
the selected unit with the quantity and submit the exact entered amount in
that unit. Exact conversion, increment and precision rules follow Inventory.

#### Scenario: A merchant receives a product measured by weight

- **WHEN** the product is configured in kilograms and the merchant chooses grams
- **THEN** the quantity can be entered in grams and remains an exact amount
- **AND** the applied equivalent must satisfy Inventory's base-unit quantity rules.

### Requirement: SR-005 — Confirm a unit change when a quantity is already entered

Changing the unit with a quantity present SHALL require confirmation. On
confirmation the form SHALL apply the new unit and clear the entered quantity.
Cancelling SHALL preserve the original unit and quantity.

#### Scenario: A merchant changes from grams to kilograms after entering 500

- **WHEN** the merchant requests a different unit with an amount already entered
- **THEN** the form asks to confirm the change and explains that it clears the amount
- **AND** confirmation requires the merchant to enter an amount in the new unit.

#### Scenario: The merchant cancels the unit change

- **WHEN** the merchant cancels the confirmation
- **THEN** the original unit and amount stay in the draft.

### Requirement: SR-006 — Start with the selected product's configured unit

The initial quantity unit for the selected product SHALL be its configured
unit. The form SHALL show the unit and let the merchant edit it under SR-004
and SR-005.

#### Scenario: A merchant selects a product that is tracked in kilograms

- **WHEN** the merchant selects the product, including through the product shortcut
- **THEN** kilograms appears initially beside the quantity field
- **AND** the merchant may choose another compatible unit before entering the amount.

### Requirement: SR-007 — Offer an optional delivery reference in advanced options

The form SHALL expose an optional delivery reference under “Opciones avanzadas”.
An empty reference SHALL be omitted. A provided value SHALL follow Inventory's
source reference profile and preserve the exact accepted text. Occurrence time
is deferred from the first receipt form.

#### Scenario: The merchant chooses to supply a reference

- **WHEN** the merchant opens advanced options and enters a valid delivery reference
- **THEN** the receipt includes that exact reference with its other supplied inputs.

#### Scenario: The merchant enters only the essential fields

- **WHEN** the merchant submits without entering a reference
- **THEN** the receipt has no supplied delivery reference.

### Requirement: SR-008 — Correct known quantity errors before reporting the receipt

When the form can determine that the entered quantity fails Inventory's rules
for the selected product and unit, it SHALL describe the issue, preserve the
entered draft and require correction before submission.

#### Scenario: The entered amount does not match a known quantity rule

- **WHEN** the merchant enters a fraction for whole pieces or an amount whose
  exact converted value fails a known precision or increment rule
- **THEN** the form explains the applicable requirement beside the input
- **AND** the submitted report waits for a valid entry without rounding or
  deliberately creating a Pending line.

### Requirement: SR-009 — Submit directly with the receipt inputs visible

The product, destination, amount and unit SHALL be visible for checking in the
form before submission. The merchant SHALL submit a valid receipt directly with
the deliberate “Registrar entrada” action.

#### Scenario: A merchant reports a valid receipt

- **WHEN** the merchant chooses “Registrar entrada” with the required inputs and any supplied reference valid
- **THEN** the receipt is submitted from that form without a separate review step.

### Requirement: SR-010 — Distinguish the authoritative receipt results

The frontend SHALL distinguish an applied receipt, confirmed Pending line,
confirmed rejection and unconfirmed submission. The applied effect SHALL use
the exact quantity and unit supplied by Inventory. A Pending or rejected result
SHALL display the reason when it is supplied and visible to the merchant.

#### Scenario: Inventory confirms the line was applied

- **WHEN** Inventory establishes an applied result
- **THEN** the frontend confirms application and shows the exact applied effect
- **AND** that movement quantity is displayed separately from any recorded balance.

#### Scenario: Inventory confirms Pending or rejection

- **WHEN** the original receipt is confirmed as Pending or rejected
- **THEN** the frontend shows the established outcome with its available reason
- **AND** that receipt line has no applied stock effect.

#### Scenario: The result is unconfirmed

- **WHEN** the frontend cannot establish the authoritative outcome
- **THEN** the submission remains visibly unconfirmed instead of being shown as
  applied, Pending or rejected.

### Requirement: SR-011 — Read the current recorded balance after application

After confirmed application, the frontend SHALL display the receipt outcome
immediately and automatically request the current recorded balance for the same
product and stock location when authorized. The read result SHALL remain
independent of the confirmed receipt.

#### Scenario: Inventory returns a balance or no stock record

- **WHEN** the exact product and location read returns a recorded balance or reports no stock record
- **THEN** the frontend shows the exact returned balance and unit or the reported absence
- **AND** recorded zero and an absent record remain distinct.

#### Scenario: The balance read cannot complete

- **WHEN** the lookup is loading, unavailable or fails
- **THEN** the applied receipt stays visible alongside the actual lookup state
- **AND** for a technical read failure the merchant may retry the lookup without submitting another receipt.

### Requirement: SR-012 — Open the receipt and show its outcome in a responsive panel

The receipt SHALL open in a side panel on desktop and use the full screen on
phones. Its result SHALL appear in the same panel for either entry point.

#### Scenario: A merchant opens or finishes a receipt

- **WHEN** a merchant starts or submits a receipt in the panel
- **THEN** the same responsive panel contains its inputs and subsequent result.

### Requirement: SR-013 — Keep a never-submitted receipt draft in the open form

A receipt draft that has never been submitted SHALL stay in the open form.
Leaving the form within the app with unsent edits SHALL require a choice to
discard or continue editing.

#### Scenario: The merchant leaves with unsent changes

- **WHEN** the merchant tries to leave an edited draft that has never been submitted
- **THEN** the form offers “Descartar cambios” and “Seguir editando”
- **AND** continuing preserves the draft while discarding closes it.

### Requirement: SR-014 — Retry an unconfirmed original receipt within a bounded run

An unconfirmed submitted receipt SHALL use its original full operation identity
and unchanged content on retry under current authority. Each run SHALL allow up
to three attempts without deliberately overlapping them. If the outcome remains
unknown after the run stops, the frontend SHALL keep it unconfirmed and offer a
manual retry of the original receipt.

#### Scenario: Receipt confirmation is lost

- **WHEN** the outcome of the original submission is technically uncertain
- **THEN** recovery makes the remaining attempts automatically within the
  initial run's budget, counting the original submission as attempt one
- **AND** attempts use 15-second client timeouts and waits of 1 then 3 seconds before retries, randomized by ±50%.

#### Scenario: The merchant requests manual recovery

- **WHEN** a run has stopped with an unknown result and the merchant explicitly retries
- **THEN** one bounded run starts for the unchanged original receipt
- **AND** another stopped run requires a further explicit retry action.

#### Scenario: Inventory confirms the receipt outcome

- **WHEN** Inventory authoritatively establishes Applied, Pending or rejection for the original receipt
- **THEN** recovery stops and the frontend shows that outcome under SR-010
- **AND** a refusal of a later retry alone does not settle an earlier unknown outcome.

### Requirement: SR-015 — Restore submitted receipts and resume on request

The frontend SHALL retain an unconfirmed receipt's original request in the same
browser, business and user scope using available storage. On return it SHALL
offer explicit recovery for an accessible record. Resumption SHALL use the
original operation under SR-014. Never-submitted drafts follow SR-013.

#### Scenario: The merchant returns after refresh or reopening

- **WHEN** the same business and user are current in the same browser and the original record is accessible
- **THEN** the frontend shows its unconfirmed state and offers “Continuar recuperación”
- **AND** returning alone sends no receipt request.

#### Scenario: Persistent storage is unavailable

- **WHEN** the frontend selects storage for a submitted record
- **THEN** it uses usable IndexedDB, then usable localStorage, then open-app memory
- **AND** in memory mode it explains the refresh and close limits without blocking receipt or retry.

#### Scenario: The original receipt record is inaccessible

- **WHEN** the original request is unavailable to the current business and user
- **THEN** the frontend does not offer it for recovery or replace it with a new request
- **AND** missing local data does not settle the receipt's outcome.

### Requirement: SR-016 — Use the same editable product selector from both entry points

The form SHALL use a searchable product selector. It SHALL start blank from
Movimientos and preselect the confirmed product from its details. The merchant
MAY change the selected product in either case. Changing products with a quantity
present SHALL require confirmation.

#### Scenario: The merchant chooses a product

- **WHEN** the receipt starts from Movimientos or the product shortcut
- **THEN** the form displays the same editable selector, either blank or with the
  confirmed product preselected according to the entry point.

#### Scenario: The merchant changes product after entering a quantity

- **WHEN** the merchant confirms the product change
- **THEN** the form selects the new product, clears the quantity and loads the new
  product's configured unit under SR-006.

#### Scenario: The merchant cancels the product change

- **WHEN** the merchant cancels the confirmation
- **THEN** the current product, quantity and unit stay in the draft.
