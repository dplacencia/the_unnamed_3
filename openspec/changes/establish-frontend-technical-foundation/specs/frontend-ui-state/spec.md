# Frontend UI state

## ADDED Requirements

### Requirement: STATE-001 — React state and scoped Context

The backoffice SHALL use React's built-in state/reducers with scoped Context as
the default UI-state approach. Local state SHALL stay with its owning component
or subtree; Context SHALL share state where needed. Existing browser subscriptions
using `useSyncExternalStore` MAY remain. A separate shared-state library MUST NOT
be introduced without a further user-approved choice.

#### Scenario: A component needs UI state

- **WHEN** a frontend component or subtree owns an interaction's state
- **THEN** it uses appropriate built-in React state and may use a reducer for
  more involved transitions
- **AND** sharing that state uses a suitably scoped Context where needed, without
  requiring an application-wide store.

### Requirement: STATE-002 — Preserve form and preference boundaries

Form state SHALL continue to use the approved React Hook Form stack. The UI-state
choice MUST NOT introduce new persistence behavior, product state or a mandatory
state abstraction. Existing preference and hydration behavior SHALL be preserved
within its approved scope; the state strategy MUST NOT itself define new user
preference scope, duration or cross-device behavior.

#### Scenario: The existing shell is assessed

- **WHEN** theme, language, sidebar and media-query helpers already use React state,
  Context and browser subscription hooks
- **THEN** compliant helpers may be retained with their observable behavior
- **AND** a state-library migration or new feature store is not required to
  implement this default.
