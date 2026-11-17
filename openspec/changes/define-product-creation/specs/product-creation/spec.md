# Product creation

## ADDED Requirements

### Requirement: PC-001 — Required product name and explicit measurement unit

The simple form SHALL require a valid product name and an explicitly selected
measurement unit. A new draft SHALL start without a selection. The selected
predefined unit SHALL determine the compatible Inventory dimension and base unit.

#### Scenario: Starting a fresh product

- **WHEN** a merchant opens a new creation draft
- **THEN** the form asks for a product name and how stock is measured
- **AND** leaves the unit unselected until the merchant chooses one.

#### Scenario: Trying to proceed without a required field

- **WHEN** the required name or measurement unit is missing
- **THEN** the form requires that input before creation may be submitted.

### Requirement: PC-002 — Advanced settings within the same draft

The form SHALL start in the simple view and allow the merchant to expand or
collapse advanced settings within it. Both views SHALL use one draft.

#### Scenario: The merchant changes the amount of detail

- **WHEN** the merchant expands or collapses advanced settings
- **THEN** the current draft values are retained
- **AND** quantity configuration details remain out of the normal simple view.

### Requirement: PC-003 — Initial advanced scope is quantity configuration

The initial advanced settings SHALL allow an optional custom quantity increment
for the selected base unit under Inventory's exact measurement rules. The
standard increment SHALL use Inventory's predefined exact value. Initial SKU
and barcode entry SHALL be deferred.

#### Scenario: Creating with the standard quantity step

- **WHEN** a merchant submits a valid draft with a selected unit and no custom step
- **THEN** the selected unit's documented exact default applies.

#### Scenario: Choosing a custom quantity step

- **WHEN** a merchant opens advanced settings to configure the measurement
- **THEN** they can set a supported exact increment
- **AND** quantity precision follows Inventory's derivation from the increment.

### Requirement: PC-004 — Explicit review of a custom step after a unit change

When the merchant changes units after entering a custom step, the form SHALL
show the previous step with its original unit during step review and require an
explicit choice of the new unit's standard step or a valid new custom step before
submission. The previous value SHALL NOT be converted or replaced automatically.

#### Scenario: Changing units with the standard step

- **WHEN** the merchant changes units and has not entered a custom step
- **THEN** the standard step follows the new unit's documented default.

#### Scenario: Changing units with a custom step

- **WHEN** the merchant selects a different unit after entering a custom step
- **THEN** the form shows the former value with its original unit during review
- **AND** submission waits for a choice under the new unit, even if the merchant
  closes the advanced section.

### Requirement: PC-005 — Direct explicit creation action

The form SHALL offer a deliberate creation action for a valid draft. The name
and selected unit SHALL be available in the form for checking before submission.
The normal submission path SHALL proceed directly from the form.

#### Scenario: A merchant submits a valid draft

- **WHEN** a merchant chooses “Crear producto” with a valid draft
- **THEN** the creation request begins without a separate review step.

### Requirement: PC-006 — Open the creation form in Products

Products SHALL offer “Nuevo producto” to a merchant with access to creation.
The action SHALL open a side panel on desktop and a full-screen form on phones,
preserving the current Products view. The access policy is defined separately.

#### Scenario: Opening the creation form while browsing

- **WHEN** an eligible merchant chooses “Nuevo producto” from Products
- **THEN** the form opens in the responsive panel
- **AND** the current search, filters and result-group position remain intact.

### Requirement: PC-007 — Show confirmed product details in the same panel

After Inventory confirms creation, the panel SHALL display a clear creation
confirmation and the newly created product's details, using its confirmed identity.
Closing the panel SHALL return to the existing Products view.

#### Scenario: The new product is outside the current results

- **WHEN** creation is confirmed and the current Products search or filters do
  not include the created product
- **THEN** the merchant can still inspect the created product in the panel
- **AND** the table retains the existing search, filters and result-group position.

### Requirement: PC-008 — Keep an unsent draft in the open form

A creation draft that has never been submitted SHALL stay in the open form only.
Leaving the form within the app with unsent edits SHALL require an explicit
discard or continue choice.

#### Scenario: A merchant tries to leave with unsent edits

- **WHEN** a merchant tries to leave the form after making unsent edits
- **THEN** the form offers “Descartar cambios” and “Seguir editando”
- **AND** continuing retains the open draft while discarding closes it.

#### Scenario: A merchant opens a new form later

- **WHEN** a merchant opens a new creation form after leaving an unsent draft
- **THEN** a new draft starts under PC-001 and PC-002.

### Requirement: PC-009 — Bounded retries for unconfirmed creation

For an unconfirmed creation, the frontend SHALL retry with the same full operation
identity and unchanged submitted content under current authority. Each run SHALL
allow up to three attempts without deliberately overlapping them. If it stops
with the outcome still unknown, the form SHALL preserve the unconfirmed state
and offer an explicit manual retry of the original request.

#### Scenario: The initial creation request receives no authoritative reply

- **WHEN** the result of a creation request is technically uncertain
- **THEN** automatic recovery uses the original full identity and content, within
  the initial run's remaining attempt budget
- **AND** only an authoritative success confirms creation under PC-007.

#### Scenario: Running the bounded retry policy

- **WHEN** an initial or manual recovery run sends requests
- **THEN** each attempt has a 15-second client timeout, with retry waits of 1
  then 3 seconds randomized by ±50%
- **AND** the original submission counts as attempt one of the initial run.

#### Scenario: The run ends without confirmation

- **WHEN** a run ends and the original outcome remains unknown
- **THEN** the form shows “No hemos podido confirmar que se haya creado el producto”
- **AND** offers manual recovery with the original identity and content.

#### Scenario: The merchant chooses manual recovery

- **WHEN** the merchant requests a retry after the previous run has stopped
- **THEN** one bounded run starts for that unchanged request
- **AND** another run requires another explicit action if confirmation remains unavailable.

#### Scenario: Inventory establishes a rejection

- **WHEN** Inventory authoritatively establishes a rejection of the original creation
- **THEN** the form represents that rejection and stops retrying it
- **AND** a timeout or refusal of a later attempt alone does not establish such a rejection.

### Requirement: PC-010 — Restore submitted creation requests on return

The frontend SHALL retain the original record of a submitted, unconfirmed
creation for the same browser, business and user using available storage. On
return it SHALL offer “Continuar recuperación” for accessible records. A run
SHALL resume only on explicit request and use the original identity and content
under PC-009. Never-submitted drafts follow PC-008.

#### Scenario: Returning to unconfirmed creation

- **WHEN** the same user returns to the same business in the same browser after
  refresh or reopening and an unconfirmed creation record is available
- **THEN** the frontend shows that the creation remains unconfirmed and offers
  “Continuar recuperación”
- **AND** returning alone sends no creation request.

#### Scenario: Continuing a restored creation request

- **WHEN** the merchant explicitly chooses to continue recovery
- **THEN** the frontend starts a bounded run under PC-009 with the original
  operation identity and submitted content, subject to current authority.

#### Scenario: Persistent storage is unavailable

- **WHEN** retention storage is selected
- **THEN** the frontend uses usable IndexedDB, then usable localStorage, then
  open-app memory according to availability
- **AND** when only memory is usable, a nonblocking notice explains that recovery
  can be lost on refresh or close while creation and retry remain available.

#### Scenario: An original request is inaccessible or belongs to another scope

- **WHEN** the original record is unavailable to the current user and business
- **THEN** the frontend does not offer it for recovery or replace it with a new
  request, and missing local data does not settle the business outcome.
