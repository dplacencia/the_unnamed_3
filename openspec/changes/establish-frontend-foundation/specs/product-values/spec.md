# Product values

## Purpose

Preserve the six user-approved core values that guide the product experience and
future branding. These principles constrain proposals without choosing a visual
identity, a specific interface or a new backend capability.

Source approval: [U2 and U3](../../design.md#source-instructions). The values are
approved; this structured expression is newly recorded for user review. Scenarios
are evaluation criteria, not evidence of implemented behavior.

## ADDED Requirements

### Requirement: VAL-001 — Simple, adaptable and powerful

The product SHALL be simple to use while remaining adaptable, powerful, highly
configurable and flexible by design. Product and interface proposals MUST
preserve both approachable everyday use and access to the needed depth of control.

#### Scenario: Everyday use and advanced needs are considered together

- **WHEN** an experience is proposed for everyday work and more advanced configuration
- **THEN** the proposal addresses simplicity and the required flexibility together
- **AND** the value alone does not select a screen layout or configuration mechanism.

### Requirement: VAL-002 — Exact, honest and dependable

The product SHALL preserve exact business values and honestly represent the
known status. It MUST NOT guess, round or reinterpret business values, or present
uncertainty as a known result. Stability and dependable behavior SHALL guide
product decisions without implying an unapproved availability guarantee.

#### Scenario: A result is unresolved or unavailable

- **WHEN** the authoritative information leaves a result pending, unknown or technically unavailable
- **THEN** the experience represents that condition honestly
- **AND** it does not invent a value, claim completion or disguise the condition as a known empty result.

#### Scenario: Exact values reach the customer

- **WHEN** a known business quantity is presented or used in a proposed workflow
- **THEN** its exact meaning is preserved without guessed, rounded or reinterpreted business values
- **AND** no particular numeric encoding or display format is selected by this principle.

### Requirement: VAL-003 — Modular and scalable growth

The product SHALL support using and paying for the modules the customer needs,
with other modules available as the customer's needs grow. This value MUST NOT
be used to invent a price, billing formula, plan, technical topology or capacity
guarantee.

#### Scenario: A customer needs only one module

- **WHEN** a customer needs one product module
- **THEN** the proposed offering preserves that module's independent value and the principle of paying only for what is needed
- **AND** later growth can introduce other modules without requiring their adoption now.

### Requirement: VAL-004 — Familiar modernization with customer support

The product SHALL aim to accompany the customer throughout digitalization and
modernization, making the process as smooth and familiar as possible. This value
MUST NOT by itself establish a staffing model, support channel, service deadline
or managed-service package.

#### Scenario: A familiar workflow is modernized

- **WHEN** a modernization experience is proposed
- **THEN** the proposal considers the customer's familiar practices and the support needed during the transition
- **AND** the experience is assessed for smooth adoption alongside its functionality.

### Requirement: VAL-005 — Customer autonomy and consent

The product SHALL preserve customer control over module adoption, the continued
use of existing tools and commercial commitments. A commercial commitment MUST
depend on explicit agreement rather than being inferred from technical access
or stored payment information.

#### Scenario: Existing tools and commercial choices remain the customer's

- **WHEN** a proposal introduces a module or a paid offer
- **THEN** it respects the customer's adoption choices and the tools they intend to retain
- **AND** it does not substitute technical capability for explicit commercial consent.

### Requirement: VAL-006 — Traceability and accountability

The product SHALL preserve relevant reasons and committed business changes so
customers can understand supported results and how they arose. This value MUST
NOT imply unrestricted access to protected history, a new history API or
availability of functionality that has not been implemented.

#### Scenario: A supported result has recorded business history

- **WHEN** relevant reasons or committed changes are available within the customer's authorized scope
- **THEN** the proposed experience supports understanding the result through that recorded information
- **AND** missing explanations or history are not fabricated.
