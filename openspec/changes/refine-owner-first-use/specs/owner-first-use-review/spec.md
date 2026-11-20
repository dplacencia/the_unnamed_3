## ADDED Requirements

### Requirement: OFU-001 — Explain one confirmed next action on Inicio

The proposed Storybook view SHALL present one primary next action on Inicio
and a short explanation based on confirmed setup and access facts.

#### Scenario: A merchant begins Inventory setup

- **WHEN** the merchant opens a business with no Site and Core setup is available
- **THEN** the guidance explains the need for a Site and its first Area and opens the existing Site form on request.

#### Scenario: A merchant has one eligible Area

- **WHEN** there is no usable stock location and exactly one Area is eligible for stock setup
- **THEN** the guidance displays the Area and Site names and opens the stock setup form for that Area when requested.

#### Scenario: A merchant has more than one eligible Area

- **WHEN** several Areas are eligible and there is no usable stock location
- **THEN** the action opens the Area list with no selection made
- **AND** the merchant can choose an eligible Area there.

#### Scenario: A stock location still requires attention

- **WHEN** there is no active Area or no eligible or usable location
- **THEN** the guidance opens the relevant setup area
- **AND** it does not offer to record a receipt for an unavailable location.

#### Scenario: Inventory access is paused or the check is unavailable

- **WHEN** the supplied Inventory access result is a confirmed pause or cannot be checked
- **THEN** the view presents the distinct state and the authorized Core action
- **AND** the guidance does not offer Inventory work while that state applies.
