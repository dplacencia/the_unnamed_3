# Frontend architecture

## ADDED Requirements

### Requirement: ARCH-001 — Supplied TailAdmin Next.js backoffice

The backoffice SHALL use the supplied TailAdmin Next.js edition, retaining its
React, strict TypeScript and Tailwind foundation. Selection of this edition
MUST NOT itself select product branding, the landing-page framework, a hosting
provider or a server/session architecture.

#### Scenario: The backoffice foundation is prepared

- **WHEN** the selected backoffice source is initialized
- **THEN** it starts from the user-supplied TailAdmin Next.js archive
- **AND** any integration changes and checks are recorded rather than claiming
  the template demos are implemented product flows.

### Requirement: ARCH-002 — Two-app pnpm workspace

The repository SHALL use pnpm workspaces with the backoffice in `apps/backoffice`
and the landing product in `apps/landing`. Each implemented app SHALL have
independent development and build commands and remain separately deployable.
An undecided landing framework MUST NOT be chosen merely to populate its folder.

#### Scenario: Only the backoffice framework is selected

- **WHEN** the first technical subset is prepared
- **THEN** `apps/backoffice` contains the selected source and `apps/landing` is
  reserved without inventing a landing scaffold
- **AND** the workspace can run backoffice commands without a running landing app.

#### Scenario: The app dependencies are installed

- **WHEN** the selected toolchain installs the workspace
- **THEN** pnpm supplies the authoritative workspace dependency workflow
- **AND** migration from the supplied npm lock is documented and does not silently
  upgrade app dependencies or override unresolved toolchain decisions.

### Requirement: ARCH-003 — Pinned Node 26 and pnpm toolchain

The frontend workspace SHALL use Node.js 26 LTS and a pinned stable pnpm release.
The initial exact pins SHALL be Node.js 26.13.1 and pnpm 12.18.0, selected from
official release metadata after the user's choice of the Node 26 LTS line.
The supplied template dependency lock SHALL be the initial migration input;
unrelated dependency upgrades MUST NOT be silently folded into setup.

#### Scenario: A developer prepares the workspace

- **WHEN** the selected toolchain is configured
- **THEN** `.nvmrc` and the root `packageManager` identify the exact runtime and
  package-manager versions, and package engines constrain the supported Node line
- **AND** installation is verified against the resulting pnpm lockfile.

#### Scenario: This agent session bootstraps tools

- **WHEN** the selected runtime or pnpm is missing from the host
- **THEN** session-local tooling may be installed inside ignored repo-local paths
- **AND** no global toolchain or sibling repository is changed.

### Requirement: ARCH-004 — Independent Astro landing foundation

The landing app SHALL use Astro and retain independent development and production
build commands. Its initial scaffold SHALL establish a verifiable technical entry
point without importing the TailAdmin dashboard, choosing product branding or
designing marketing content. The scaffold MUST NOT select a hosting provider,
CMS or server adapter through an unstated assumption.

#### Scenario: The landing foundation is initialized

- **WHEN** the selected landing framework is set up
- **THEN** `apps/landing` contains a minimal Astro project with its own manifest
  and configuration, and the root workspace can check/build it independently
- **AND** its entry page remains an empty technical document until design work
  is authorized in the user's selected later stage.

### Requirement: ARCH-005 — Reviewed install scripts and release waiting period

The workspace SHALL enforce pnpm's 1,440-minute minimum release age without
automatic age exceptions. The install scripts for `@parcel/watcher@2.6.0`,
`@swc/core@1.16.1`, `unrs-resolver@1.12.2` and `esbuild@0.28.2` SHALL remain
explicitly denied, including the esbuild decision recorded in the visual change.
Other unreviewed dependency build scripts SHALL continue to require review.
No package or script safety guarantee SHALL be inferred from successful setup.

#### Scenario: A selected package version is too recent

- **WHEN** a dependency version fails the selected release waiting period
- **THEN** resolution uses an eligible version within the approved framework line
  or reports the unresolved requirement
- **AND** it does not add a release-age exception to make installation pass.

#### Scenario: A denied native-tooling install script is encountered

- **WHEN** the workspace installs one of the exact denied versions
- **THEN** its install script is not executed
- **AND** native binding and application checks verify what works without it,
  without claiming untested platforms are supported.

### Requirement: ARCH-006 — Repository technology decisions first

The current technical phase SHALL complete this repository's frontend stack
decisions before external integration work. Agents MUST preserve settled hosting
choices and MUST NOT initiate further hosting/CDN questions. Keycloak/API and
infrastructure/deployment work SHALL remain deferred and MUST NOT be treated as
prerequisites for this phase. Undefined local stack choices SHALL require the
user's decision before adoption.

#### Scenario: The repository stack is still incomplete

- **WHEN** the agent identifies an unresolved frontend technology choice
- **THEN** it discusses that repository-local choice with the user
- **AND** it does not widen the phase to identity/API integration or reopen hosting.

### Requirement: ARCH-007 — Feature-owned backoffice source

Future backoffice feature code SHALL be grouped in
`apps/backoffice/src/features/<feature>`, keeping its components, hooks, schemas
and tests with the feature where applicable. `src/app` SHALL compose routes from
feature code and the shared shell. Generic TailAdmin primitives and reusable
app infrastructure SHALL remain in their existing shared locations. This layout
MUST NOT itself select product modules or require empty feature scaffolding.

#### Scenario: An approved backoffice feature is implemented

- **WHEN** a feature adds its own components, hooks, schemas or tests
- **THEN** that feature-owned source is kept together under `src/features/<feature>`
- **AND** its route composes the feature rather than becoming its implementation directory.

#### Scenario: The retained foundation has no product features yet

- **WHEN** the code-organization decision is applied to the current lean foundation
- **THEN** the generic TailAdmin controls and shared shell retain their existing locations
- **AND** no product module, empty feature or source migration is invented merely to demonstrate the layout.

### Requirement: ARCH-008 — Shared workspace code follows actual reuse

The backoffice and landing apps SHALL retain independent boundaries. A shared
workspace package SHALL be introduced only for code actually consumed by both
apps. Similar styling technology or an anticipated future need MUST NOT by
itself create a common package or a dependency from one app's source to the other.

#### Scenario: Code is used in only one app

- **WHEN** a helper or component has consumers in just one app
- **THEN** it remains owned by that app rather than becoming a speculative shared package.

#### Scenario: Both apps need the same code

- **WHEN** concrete consumers in both apps need the same code
- **THEN** a shared workspace package may be introduced for that reused code
- **AND** each app preserves its independent development and build boundary.

### Requirement: ARCH-009 — Tailwind with native Astro landing components

The landing SHALL use Tailwind CSS 4 with native Astro components. Small browser
interactions SHALL use Astro's supported TypeScript scripts. A React integration
SHALL remain a separate future decision tied to a concrete component need. This
selection MUST NOT import the TailAdmin dashboard, select brand tokens or create
marketing content or speculative interaction code.

#### Scenario: The landing styling foundation is prepared

- **WHEN** the selected styling stack is installed
- **THEN** the landing's Astro/Vite build compiles its Tailwind stylesheet and the shared document layout loads it on all five language routes
- **AND** the pages remain technical placeholders pending approved brand and product design.

#### Scenario: A future landing component needs a small browser interaction

- **WHEN** an approved component needs browser event handling
- **THEN** native Astro components and TypeScript scripts are the selected approach
- **AND** this foundation does not silently introduce React or another interaction framework.
