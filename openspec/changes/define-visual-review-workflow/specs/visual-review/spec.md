# Collaborative visual review

## ADDED Requirements

### Requirement: VIS-006 — Locale-aware catalogue examples

The selected locale SHALL update catalogue-owned sample text, accessible labels,
descriptions and validation messages in all five approved languages. Changing
locale SHALL preserve entered values, explicit custom labels and component state.
Catalogue dictionaries SHALL remain development-only and MUST NOT define product
copy or business rules. Tool chrome, code identifiers and native browser text are
outside the example-content locale selector.

#### Scenario: A sample switches language

- **WHEN** the user switches the Button, Form or another text-bearing example to English
- **THEN** its catalogue-owned text uses the English dictionary
- **AND** Spanish remains the default when no locale is selected.

#### Scenario: A form error is already visible

- **WHEN** the user changes locale after submitting an empty technical field
- **THEN** the error message updates without clearing entered values or resetting the form.

### Requirement: VIS-001 — Shared live component and view previews

The workflow SHALL use Storybook for actual backoffice components, Astro-rendered
development previews for native landing components, and actual application views
for integration checks. User and agent SHALL have documented local preview links
and commands. The catalogue MUST reuse retained components/styles and MUST NOT
introduce product flows or final branding through technical examples.

#### Scenario: A retained control is reviewed

- **WHEN** its named catalogue scenario is opened
- **THEN** it renders the actual component with a deterministic technical fixture
- **AND** user and agent can inspect applicable states and interactions.

### Requirement: VIS-002 — Browser evidence and explicit reference approval

Playwright SHALL capture browser interactions and images and compare against
accepted references. Unreviewed captures SHALL be labelled candidates, not visual
acceptance. Missing references MUST NOT be automatically accepted or updated to
make comparison pass. Reference promotion SHALL identify the reviewed run/cases
and preserve evidence of explicit user approval.

#### Scenario: No accepted reference exists

- **WHEN** candidate images are captured successfully
- **THEN** browser/capture results and pending visual review are reported separately
- **AND** comparison cannot claim approved visual coverage for those cases.

### Requirement: VIS-003 — Explicit component and view coverage

The workflow SHALL maintain an inventory mapping renderable components,
compositions and views to named scenarios and checks. Missing sources/scenarios
SHALL be reported. Nonvisual helpers and external-content limitations SHALL have
explicit classifications rather than fabricated screenshots. A small working
demonstration MUST NOT be presented as complete catalogue coverage.

#### Scenario: A new component lacks a catalogue entry

- **WHEN** the coverage check runs
- **THEN** it reports the missing coverage instead of inferring coverage from
  the success of unrelated stories or tests.

### Requirement: VIS-004 — Repeatable reference environment

Initial references SHALL use the user's selected pinned Playwright Chromium on
this Mac. Captures and references SHALL identify the browser/platform and agreed
viewport/theme/locale profile. Data, time, fonts and animation behavior SHALL be
controlled where relevant. Different rendering environments MUST NOT silently
reuse the same accepted reference identity or hide differences with broad tolerances.

#### Scenario: The approved matrix is captured

- **WHEN** the registered capture cases run
- **THEN** they cover desktop 1440×900, tablet 768×1024, mobile 390×844 and desktop dark appearance
- **AND** assembled views cover all five approved languages
- **AND** relevant interaction states have separate registered cases.

#### Scenario: A different platform attempts reference comparison

- **WHEN** its renderer identity differs from the accepted reference environment
- **THEN** the workflow reports the mismatch or uses a separately reviewed reference
- **AND** it does not silently reclassify changed pixels as an accepted design.

#### Scenario: The approved colour policy is applied

- **WHEN** a case is compared against an accepted reference
- **THEN** Playwright uses per-pixel colour threshold 0.01 and maxDiffPixels 0
- **AND** this comparison setting does not accept or update reference images.

### Requirement: VIS-005 — Development-only tooling boundaries

Catalogue routes, fixtures and review artifacts SHALL remain separate from
production app outputs. Existing code checks SHALL retain their roles; visual
comparison MUST NOT be described as complete usability/accessibility acceptance.
The workflow MUST NOT commit, publish or deploy through inferred authority.

#### Scenario: The production apps are built

- **WHEN** the normal app build commands run
- **THEN** their outputs exclude the technical gallery routes and story fixtures
- **AND** the separate preview/review commands remain documented for local use.
