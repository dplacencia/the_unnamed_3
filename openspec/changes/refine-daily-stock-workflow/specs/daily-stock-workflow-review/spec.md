## ADDED Requirements

### Requirement: DSW-001 — Compare the current and proposed daily stock workflow

The Storybook review SHALL provide a current reference and a proposed
Productos → Registrar entrada → Existencias workflow for consistent review in
the approved visual environment.

#### Scenario: A merchant records a delivery for an existing product

- **WHEN** a merchant opens an existing product's details in the proposed workflow
- **THEN** the sheet provides Registrar entrada and opens the receipt with the exact existing product and its configured unit
- **AND** the merchant explicitly chooses a destination and can open advanced fields on request
- **AND** the catalogue retains its applied view.

#### Scenario: A merchant chooses an action in the proposed product sheet

- **WHEN** the merchant opens the details of an existing product
- **THEN** the available actions form one compact group below the product facts
- **AND** Registrar entrada is the primary action, Ver existencias is secondary, and Editar uses a text treatment
- **AND** the controls stay readable and operable within the sheet on narrow screens.

#### Scenario: Inventory confirms the movement and the balance separately

- **WHEN** the fixture confirms a receipt
- **THEN** the receipt displays the exact applied amount and the independent stock read separately
- **AND** Ver existencias carries the confirmed product and location
- **AND** a technical balance-read error offers retry of the read, with the confirmed movement still visible.

#### Scenario: The fixture reports a Pending receipt

- **WHEN** the receipt result is Pending
- **THEN** the preview presents the recorded status and reasons without showing an applied quantity or a new stock balance.
