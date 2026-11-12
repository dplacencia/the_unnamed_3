# Brand basics

## ADDED Requirements

### Requirement: BRAND-001 — Restrained and approachable visual direction

Brand proposals SHALL develop the user's selected restrained, approachable
direction: warm neutral backgrounds, clear typography, strong contrast and
limited accent colour. This direction SHALL guide concrete comparisons without
selecting a final palette, typeface, wordmark, logo or product name.

#### Scenario: Concrete colour and typography options are explored

- **WHEN** visual options are prepared for the user's review
- **THEN** they express the selected direction through the retained TailAdmin components
- **AND** the options remain proposals until the user selects their concrete details.

#### Scenario: A development preview uses candidate tokens or fonts

- **WHEN** a comparison renders candidate colours or fonts
- **THEN** those changes are scoped to the comparison rather than applied to production app styling
- **AND** existing approved screenshot references are retained until changed images receive their own approval.

### Requirement: BRAND-002 — Ink indigo colour basis

The brand palette SHALL be developed from the user's selected D/ink indigo
accent, `#57528C`, within the restrained/approachable direction. Typography under
BRAND-003 and wordmark treatment under BRAND-004 SHALL remain separate choices.
This colour selection MUST NOT automatically apply a production theme or accept
changed screenshot references.

#### Scenario: The chosen accent guides further brand work

- **WHEN** typography pairings or final brand tokens are developed
- **THEN** D/ink indigo is the selected accent basis
- **AND** the other accent proposals are not treated as adopted alternatives.

#### Scenario: The existing comparison is used to choose typography

- **WHEN** the user switches the font selector while reviewing option D
- **THEN** those previews support the separate typeface decision
- **AND** the preview's default font is not inferred to be approved.

### Requirement: BRAND-003 — Source Sans 3 typeface basis

Brand typography SHALL be developed from the user's explicitly selected Source
Sans 3, paired with the ink indigo colour basis. This selection SHALL guide the
subsequent brand configuration plan without finalizing font weights, sizes,
wordmark treatment or production font packaging. Distributed font files SHALL
retain their applicable copyright and SIL Open Font License notices. The typeface
selection MUST NOT by itself accept changed screenshot references.

#### Scenario: The selected typeface guides brand configuration

- **WHEN** the initial brand typography is configured for either app
- **THEN** Source Sans 3 is the selected typeface basis
- **AND** implementation details follow the recorded configuration plan rather than being inferred from preview defaults.

#### Scenario: The user chooses the font after the licence clarification

- **WHEN** the user's “ok, I choose it” is recorded following the Source Sans 3 licence explanation
- **THEN** it is recorded as explicit typeface selection
- **AND** wordmark treatment follows BRAND-004, naming remains provisional and changed images still require separate approval.

### Requirement: BRAND-004 — Simple provisional Irin text wordmark

The initial brand identity SHALL use a simple “Irin” text wordmark in Source
Sans 3. A bespoke symbol SHALL be deferred for now. This treatment MUST preserve
Irin's provisional naming status and MUST NOT imply a finalized logo system or
accepted screenshot references. Component treatment follows BRAND-005. Exact wordmark
weight, size and placement SHALL be included in the subsequent configuration plan.

#### Scenario: The initial identity is prepared for configuration

- **WHEN** the initial wordmark treatment is prepared for either app
- **THEN** it uses the text “Irin” in Source Sans 3
- **AND** a bespoke symbol is not added as part of this selected treatment.

#### Scenario: A broader identity is considered later

- **WHEN** a bespoke symbol or final naming decision is proposed
- **THEN** it requires its own user decision
- **AND** the initial text-wordmark choice is not treated as approval of that later identity.

### Requirement: BRAND-005 — Retain TailAdmin component treatment

The first backoffice brand configuration SHALL retain TailAdmin's existing
spacing, rounded corners and icons. It SHALL apply the selected brand basics
through the retained components rather than introducing custom component shapes
or spacing. This selection MUST NOT by itself approve every proposed palette
token, exact wordmark style, product flow or changed screenshot reference.

#### Scenario: Initial backoffice branding is configured

- **WHEN** the selected brand basics are applied to the backoffice
- **THEN** existing component spacing, corner shapes and icons are retained
- **AND** colour, typography and the text wordmark follow their recorded configuration details.

#### Scenario: A custom component treatment is proposed

- **WHEN** custom component geometry, spacing or icons are considered later
- **THEN** that treatment requires a separate user decision
- **AND** it is not introduced under the first branding configuration.

### Requirement: BRAND-006 — First backoffice brand configuration

The first backoffice configuration SHALL use the full option-D indigo and
warm-neutral mapping in the design's approved configuration table, Source Sans 3
with existing UI text metrics, and the approved expanded/compact text wordmark.
Existing component treatment and non-brand semantic states SHALL be retained;
the landing SHALL remain outside this pass. New screenshot references SHALL
require separate explicit user approval.

#### Scenario: The approved configuration is implemented

- **WHEN** the first backoffice branding pass is applied
- **THEN** it uses the recorded full palette, Source Sans 3 and expanded/compact wordmark styles
- **AND** it preserves existing UI text metrics, component treatment and interactions.

#### Scenario: The approved wordmark is rendered

- **WHEN** the initial sidebar wordmark is rendered
- **THEN** it uses weight 600, tracking `-0.04em` and 32px/40px size/line height expanded or 20px/32px compact
- **AND** its colour is `gray-900` in light mode and the configured warm white `#FFFEFB` in dark mode.

#### Scenario: The result is checked and reviewed

- **WHEN** the configured backoffice is captured for review
- **THEN** the actual production font is used in both app and component previews
- **AND** the old approved references remain intact until specifically reviewed replacement images are approved.

### Requirement: BRAND-007 — Readable dark-mode brand text

Ordinary dark-mode brand text SHALL use the selected lighter `brand-300`
(`#B4ACD7`) for links, primary light/ghost badges, active line-tab labels and
corresponding menu/document text. The refinement SHALL retain palette values,
the primary accent, backgrounds, geometry, icon-specific rules, borders and
disabled styles. Actual configured text/background pairs SHALL meet 4.5:1.

#### Scenario: An affected ordinary text role is displayed in dark mode

- **WHEN** an affected link, primary light/ghost badge, active line-tab label or menu/document text is displayed
- **THEN** its dark brand-text role uses `brand-300`
- **AND** its rendered contrast is checked against its actual composed background.

#### Scenario: Other visual roles are retained

- **WHEN** the text refinement is applied
- **THEN** icon-specific `brand-400`, selected borders, disabled styles and filled primary controls retain their existing roles
- **AND** no palette value, component geometry or accepted screenshot reference is changed by that refinement alone.
