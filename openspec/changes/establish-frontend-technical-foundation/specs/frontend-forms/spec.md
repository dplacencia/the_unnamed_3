# Backoffice form technology

## ADDED Requirements

### Requirement: FORM-001 — React Hook Form and Zod

The backoffice SHALL use React Hook Form for form state and Zod for client-side
schema validation, connected through `@hookform/resolvers/zod`. Form controls
SHALL reuse retained TailAdmin primitives. Initial direct versions SHALL be
pinned and meet the existing dependency policy. This selection MUST NOT create
product forms, business validation rules, a new form design or landing dependencies.

#### Scenario: The form foundation is prepared

- **WHEN** the approved backoffice dependencies are installed
- **THEN** React Hook Form, Zod and their standard resolver are available to typed
  client components and verified with retained TailAdmin form primitives
- **AND** a synthetic test fixture is not added as a product route or flow.

### Requirement: FORM-002 — Preserve exact form values

Form integration MUST preserve exact business-value semantics. It MUST NOT
introduce implicit numeric coercion, rounding or normalization through a shared
form helper. Product validation rules, error wording and presentation SHALL
require an approved feature basis rather than being inferred from this stack.

#### Scenario: The technical fixture submits an exact string

- **WHEN** a string-valued input passes its test-only schema validation
- **THEN** the submission callback receives the same string, including digits
  beyond JavaScript's safe integer range and retained decimal zeroes
- **AND** the fixture does not establish a business numeric grammar or wire contract.
