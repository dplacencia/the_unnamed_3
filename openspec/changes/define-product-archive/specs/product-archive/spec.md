## ADDED Requirements

### Requirement: Archive through product details

The frontend SHALL offer product archiving to an authorized merchant team member when the applicable product lifecycle capability is available. The frontend SHALL identify the selected product and ask for confirmation before sending an archive request. Inventory SHALL decide whether the product is eligible.

#### Scenario: Confirm or cancel

- **WHEN** the merchant opens archiving for an active product
- **THEN** the details show the effect on active catalogue inclusion, current identifiers and retained history
- **AND** only the confirm action may submit the request for that product.

### Requirement: Use the confirmed result

The frontend SHALL update the product status and active assignments only from confirmed Inventory results. It SHALL preserve the product's permanent identity, current table settings and the open details following confirmation.

#### Scenario: Confirmed archived product

- **WHEN** Inventory confirms the archive and returns the current archived state
- **THEN** the details show that the same product is archived and its former codes are no longer current assignments
- **AND** normal active-product results exclude it while explicit archived inclusion may return it.

#### Scenario: Refused or uncertain archive

- **WHEN** Inventory confirms a refusal
- **THEN** the frontend shows the confirmed outcome and retains the recorded product data.

#### Scenario: No confirmed outcome

- **WHEN** the frontend cannot confirm the archive outcome
- **THEN** it labels the last known state, makes the uncertainty visible, and withholds a fresh archive request for the affected product pending resolution.
