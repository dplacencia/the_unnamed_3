## ADDED Requirements

### Requirement: PDR-001 — Distinguish the cancelled and retained batches

The proposed Storybook walkthrough SHALL present the two roles and the whole
target line set using the existing duplicate cancellation rules.

#### Scenario: The exact pending line is eligible for duplicate cancellation

- **WHEN** the existing inspector confirms Pending for the prepared eligible line
- **THEN** Revisar duplicado opens the review for that target
- **AND** all affected lines are grouped with the batch to cancel
- **AND** the batch to keep must be chosen and affirmed explicitly.

#### Scenario: The chosen counterpart changes

- **WHEN** the merchant chooses a different authorized counterpart
- **THEN** the previous confirmation is cleared
- **AND** submission requires confirmation for the current choice and a valid reason.

#### Scenario: Inventory confirms duplicate cancellation

- **WHEN** the retained result confirms the target batch was cancelled as a duplicate
- **THEN** the result identifies the exact cancelled and retained batches
- **AND** the outcome states that stock did not change
- **AND** returning to Pendientes uses the refreshed results for the current list context.
