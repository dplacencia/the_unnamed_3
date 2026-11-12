# Specification workflow and agent boundaries

## Purpose

Preserve the user's current documentation, decision-authority and repository
boundaries for future agents. This initial record does not define a complete
GitHub assignment system, specialist registry or agent-container setup.

Source approval: [U1 and U3](../../design.md#source-instructions). These are
records of the user's existing instructions, not agent-granted permissions.
The structured wording is newly recorded for review.

## ADDED Requirements

### Requirement: WORK-001 — Definitions live in OpenSpec

Product, branding, technical and process definitions SHALL be recorded in
OpenSpec specs and changes. Root `AGENTS.md` SHALL serve as a reading entry point
to those records rather than a competing definition of the product or workflow.

#### Scenario: A user decision needs a durable home

- **WHEN** an agent records an authorized definition or decision
- **THEN** it records it in the relevant OpenSpec artifact with its source and scope
- **AND** it does not create a parallel standing definition in unrelated notes.

### Requirement: WORK-002 — The user decides undefined choices

Agents MUST ask the user before adopting an undefined product, branding or
technical choice. Recommendations and deductions SHALL remain proposals until
the user approves them. Silence, a tool result or an existing template MUST NOT
substitute for that approval.

#### Scenario: A design choice has no approved basis

- **WHEN** an agent reaches a choice not already defined by an applicable user instruction
- **THEN** it presents the question and any recommendation to the user before adopting it
- **AND** preserves already approved decisions without reopening them unnecessarily.

### Requirement: WORK-003 — Repository access stays scoped

Agents SHALL confine writes and command execution with effects on project files
to the authorized scope in `/Users/daniel/Projects/personal/the_unnamed_3`.
`the_unnamed_1` and `the_unnamed_2` SHALL remain read-only supporting sources.
Filesystem write capability MUST NOT be treated as permission to change them.

#### Scenario: A supporting specification belongs to another repo

- **WHEN** an agent consults a source in either sibling repository
- **THEN** it may read that source within the assignment
- **AND** it does not edit it or run a command that changes that repository.

### Requirement: WORK-004 — Never create commits

Agents MUST NOT create Git commits. Permission to write files, initialize
OpenSpec or execute project commands MUST NOT be interpreted as commit authority.

#### Scenario: Authorized documentation work is finished

- **WHEN** an agent finishes writing and checking the requested documents
- **THEN** it leaves the changes uncommitted and reports the result to the user.

### Requirement: WORK-005 — Execution remains within the user's assignment

Agents SHALL perform only the work the user has authorized. Recording definitions
and preparing agent instructions MUST NOT automatically initiate application
design, implementation, deployment, publication or archive. An unresolved choice
SHALL stop the work that depends on it while preserving existing work.

#### Scenario: OpenSpec setup has passed validation

- **WHEN** the setup records and agent entry point have been written and checked
- **THEN** the agent reports the result and waits for further instructions
- **AND** successful checks do not start the next stage or imply user acceptance.

### Requirement: WORK-006 — Agents read the relevant decision records first

Before task actions, agents SHALL read the OpenSpec records linked from
`AGENTS.md`, then the current assignment and its relevant specifications and
change artifacts. They MUST distinguish approved source decisions, newly written
wording, proposals, open questions and verified implementation.

#### Scenario: A future agent starts in this repository

- **WHEN** an agent receives a new assignment
- **THEN** it loads the linked scope, values, workflow and source instructions before acting
- **AND** it does not infer implementation, approval or new authority from artifact existence.
