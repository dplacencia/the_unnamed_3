# Core capability enablement

## ADDED Requirements

### Requirement: CE-001 — Manage each capability independently

The Explorar módulos preview SHALL display the confirmed configuration of Catalogue and Stock separately. An authorized merchant's action SHALL target one capability and the displayed configuration SHALL change only following a confirmed Core outcome.

#### Scenario: Activate Stock while Catalogue is disabled

- **WHEN** Core confirms the Stock activation and supplies no mutation to Catalogue
- **THEN** the view shows Stock enabled and Catalogue still disabled.

### Requirement: CE-002 — Show named dependency refusals

The preview SHALL represent MOD-009's explicit Pricing prerequisite and explain which affected capabilities caused a refusal. A refusal SHALL leave their confirmed configurations unchanged and trigger no automatic configuration changes.

#### Scenario: Catalogue is still required

- **WHEN** a Catalogue deactivation is refused because Pricing remains enabled
- **THEN** the view names Catalogue and Pricing and both stay displayed as enabled.

### Requirement: CE-003 — Distinguish authority, configuration and provider availability

The preview SHALL show a provider outage separately from known enablement. The unavailable-current-authority state SHALL identify the known configuration as the last confirmed result and prevent new changes. Confirmed denial SHALL keep the view read-only.

#### Scenario: Shared Inventory provider goes offline

- **WHEN** Catalogue and Stock are enabled and the shared Inventory provider stops responding
- **THEN** both remain enabled in the view and the current provider outage is shown separately.

#### Scenario: Core cannot confirm current management authority

- **WHEN** the view retains a previously confirmed configuration but current authority is unavailable
- **THEN** the view identifies that configuration as previously confirmed and presents no mutation action.
