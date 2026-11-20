## ADDED Requirements

### Requirement: PRQ-001 — Separate saved, indicated and applied receipt quantities

The proposed Storybook walkthrough SHALL preserve the recorded receipt facts
and distinguish them from the quantity the merchant indicates and the confirmed
stock effect.

#### Scenario: The exact receipt is confirmed Pending

- **WHEN** the existing inspection confirms Pending for a receipt eligible for the supported partial correction
- **THEN** Revisar cantidad opens the review of that exact receipt line
- **AND** the saved quantity, unit and recorded reason remain visible.

#### Scenario: The merchant supplies or edits the actual quantity

- **WHEN** the indicated amount does not satisfy the existing exact receipt and correction rules
- **THEN** the review explains the rule beside the amount and prevents confirmation
- **AND** changing an indicated amount clears the previous affirmative confirmation.

#### Scenario: Inventory confirms the correction

- **WHEN** the fixture supplies a confirmed applied result
- **THEN** the view identifies the same receipt, the saved quantity and the indicated quantity
- **AND** the exact returned effect is displayed separately
- **AND** returning to Pendientes shows the refreshed list for its current scope.
