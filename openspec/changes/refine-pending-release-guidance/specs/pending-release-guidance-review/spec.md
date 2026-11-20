## ADDED Requirements

### Requirement: PRG-001 — Carry exact movement context through release

The Storybook comparison SHALL carry the inspected departure through the
focused release review and return to Pendientes.

#### Scenario: The exact departure is still Pending

- **WHEN** the exact inspection read confirms the selected line is Pending and the fixture allows release
- **THEN** Revisar canal opens the review of that line
- **AND** the action is unavailable while the current read is loading or has not confirmed Pending.

#### Scenario: The merchant chooses the channel

- **WHEN** the merchant changes the channel selected for this release
- **THEN** the previous confirmation is cleared
- **AND** the merchant confirms the newly selected channel before submission.

#### Scenario: Inventory confirms an applied result

- **WHEN** the fixture supplies confirmed application
- **THEN** the result identifies the same product, origin and saved quantity
- **AND** the indicated channel and exact signed effect remain separate facts
- **AND** returning to Pendientes shows the current scoped list after refresh.

#### Scenario: A release attempt remains unconfirmed

- **WHEN** the released line's outcome cannot be confirmed
- **THEN** the view retains the existing recovery action for the original command
- **AND** it does not show a confirmed stock effect.
