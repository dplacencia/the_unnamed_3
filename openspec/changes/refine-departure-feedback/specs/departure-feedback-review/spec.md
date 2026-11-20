## ADDED Requirements

### Requirement: DFR-001 — Explain the stock departure outcome

The proposed Storybook result panel SHALL distinguish the known departure
outcome and preserve the exact product, origin, channel and entered quantity.

#### Scenario: The departure is applied

- **WHEN** the fixture supplies a confirmed applied result
- **THEN** the panel shows the exact signed stock effect separately from the entered quantity
- **AND** the panel shows no inferred balance.

#### Scenario: The departure is Pending or rejected

- **WHEN** the fixture confirms Pending or rejection
- **THEN** the panel shows the distinct result and supplied reason
- **AND** the Pending notice explains that stock did not change at registration.

#### Scenario: The outcome is unknown

- **WHEN** the bounded run stops with no confirmed departure outcome
- **THEN** the panel states the uncertainty and offers explicit retry of the same frozen departure
- **AND** the panel shows neither a confirmed movement effect nor a Pending line.
