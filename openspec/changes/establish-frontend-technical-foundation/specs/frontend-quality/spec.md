# Frontend code quality

## ADDED Requirements

### Requirement: CODE-001 — Vitest client and logic tests

The backoffice SHALL use Vitest with React Testing Library and jsdom for suitable
code-level unit and client-component tests. These tests SHALL verify observable
behavior of retained stateful helpers when those helpers are changed.
They MUST NOT be presented as browser, visual or async Server Component coverage.

#### Scenario: A retained shell helper is refactored

- **WHEN** initialization, media-query or navigation state handling changes
- **THEN** code-level tests exercise its supported observable behavior
- **AND** the independent backoffice test command reports the actual result.

### Requirement: CODE-002 — Separate checks from visual acceptance

The workspace SHALL expose independent build and type-check commands for each
app, plus the backoffice source lint and test commands. Failing checks MUST NOT
be reported as passing merely because a different check passed. Visual regression
and design evaluation SHALL follow the separately approved visual-workflow change,
including its explicit reference-acceptance rules.

#### Scenario: The supplied template builds but fails lint

- **WHEN** a baseline production build succeeds and source lint fails
- **THEN** both outcomes are recorded distinctly and the source findings are
  resolved or explicitly left open within the user's approved scope
- **AND** successful compilation does not become a visual or product-flow acceptance.

### Requirement: CODE-003 — Consistent repository formatting and lint

Authored source and repository tooling SHALL use ESLint and Prettier across both
apps, with Astro-aware support for `.astro` files and the retained Next.js rules
for the backoffice. Formatting SHALL use two-space indentation, double-quoted
JavaScript/TypeScript strings and semicolons. Existing component naming and strict
TypeScript guidance SHALL remain in effect.

#### Scenario: A contributor checks authored files

- **WHEN** repository formatting or lint is checked
- **THEN** the applicable app and tooling files use the shared conventions with framework-aware parsing
- **AND** generated outputs, downloaded tools, dependency stores, paid archives and third-party assets are excluded from formatting and linting.

### Requirement: CODE-004 — Local aggregate quality command

The root `pnpm check` command SHALL run formatting checks, lint, type checks and
code-level tests for the applicable repository sources. It SHALL report failures
through a nonzero exit status. Independent app build commands and browser/visual
commands SHALL remain available separately; a passing local code check MUST NOT
claim those checks ran or accept visual references.

#### Scenario: A formatting or code-quality check fails

- **WHEN** an included check fails during `pnpm check`
- **THEN** the command fails and the failing check is visible
- **AND** checks that did not run are not reported as passing.

#### Scenario: Code checks pass before visual review

- **WHEN** `pnpm check` succeeds
- **THEN** it establishes only the included formatting, lint, type and code-test results
- **AND** builds, browser behavior and visual acceptance retain their separate verification steps.
