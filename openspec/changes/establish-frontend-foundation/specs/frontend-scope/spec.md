# Frontend product scope

## Purpose

Preserve the user's scope and design-foundation decisions for the two frontend
products in this repository, including their current merchant focus, Spain-only
market, initial languages and approved brand personality, without selecting
unresolved architecture, a final product name or a visual identity.

Source approval: [U1, U2 and U4–U17](../../design.md#source-instructions). The source
decisions are approved; this structured expression is newly recorded for review.
These scenarios describe constraints, not deployed products.

## ADDED Requirements

### Requirement: SCOPE-001 — Two separately deployed products

This repository SHALL cover the product backoffice and landing page as two
different frontend products. They SHALL be deployed separately under different
subdomains. This requirement MUST NOT determine actual subdomain names,
application directories, build tooling or hosting services.

#### Scenario: Frontend organization or deployment is proposed

- **WHEN** an organization or deployment approach is proposed for this repository
- **THEN** it preserves separate backoffice and landing-page products and their separate deployments under different subdomains
- **AND** choices not supplied by the user remain proposals for their decision.

### Requirement: SCOPE-002 — TailAdmin backoffice foundation

Backoffice design and implementation SHALL start from TailAdmin, for which the
user reports purchasing a full license. The archive filenames MUST NOT by
themselves establish the approved framework, component selection or product
branding.

#### Scenario: Backoffice design work begins

- **WHEN** the user initiates backoffice design or implementation
- **THEN** TailAdmin is used as the starting foundation
- **AND** any unresolved selection within that foundation is presented to the user before adoption.

### Requirement: SCOPE-003 — Custom landing-page design is permitted

Landing-page work SHALL allow design and code created from scratch. The
backoffice's TailAdmin requirement MUST NOT be treated as a requirement to use
TailAdmin for the landing page. The permission alone MUST NOT select the landing
page's design or implementation.

#### Scenario: A custom landing page is proposed

- **WHEN** the user considers a landing page designed and coded from scratch
- **THEN** that approach is within the permitted design scope
- **AND** its specific design and technology choices still require the user's decision.

### Requirement: SCOPE-004 — Branding choices require user approval

Each branding choice SHALL remain unresolved until the user defines or approves
it. The six agreed values and approved personality in SCOPE-010 SHALL guide
proposals without automatically selecting a product name, logo, colors,
typography, visual style or detailed voice guidelines.

#### Scenario: An agent finds default branding in the template

- **WHEN** TailAdmin includes names, colors, typography or other visual defaults
- **THEN** their presence is not treated as approval of the product's brand identity
- **AND** the agent asks the user before adopting an unresolved branding choice.

### Requirement: SCOPE-005 — Merchant-team backoffice

The backoffice SHALL serve only merchant teams, including merchant owners,
managers and employees. Its product scope SHALL exclude an internal platform
operator backoffice. This audience decision MUST NOT by itself define role
templates, permissions or which merchant workflows are implemented.

#### Scenario: A merchant-facing workflow is considered

- **WHEN** a workflow is proposed for a merchant owner, manager or employee
- **THEN** that audience is within the backoffice's intended scope
- **AND** the workflow's detailed requirements and permissions still need an approved basis.

#### Scenario: An internal platform console is proposed

- **WHEN** a proposed backoffice feature serves internal SaaS operators administering the platform
- **THEN** it is outside this backoffice's approved audience scope
- **AND** it is not introduced as part of merchant-team functionality.

### Requirement: SCOPE-006 — Current focus on greengrocers and neighbourhood shops

Initial design and messaging SHALL focus on greengrocers and small neighbourhood
shops for now. This focus MUST NOT be treated as permanent exclusion of other
sectors, validated customer demand, a selected geography or a language decision.

#### Scenario: Initial design and messaging are proposed

- **WHEN** an agent proposes an initial merchant experience or product message
- **THEN** greengrocers and small neighbourhood shops are its current target sector
- **AND** the provisional focus is preserved without claiming completed market validation.

### Requirement: SCOPE-007 — Different levels of comfort with technology

Backoffice proposals SHALL serve users ranging from people who can barely open
an app to highly skilled technical users. Everyday work SHALL be extremely simple
for beginners while preserving powerful configuration and flexibility for
advanced users. SCOPE-016 defines default simplicity and user control over
complexity. Tier count, specific controls and layouts SHALL remain unresolved
until approved.

#### Scenario: A merchant struggles with technology

- **WHEN** a proposed experience is assessed for a merchant who can barely open an app
- **THEN** the assessment considers whether everyday work is extremely simple and familiar for that user
- **AND** comfort with complex software is not assumed.

#### Scenario: A merchant wants extensive customization

- **WHEN** a proposed experience is assessed for a merchant who wants extensive customization
- **THEN** the assessment considers the configuration depth and flexibility that user needs
- **AND** the specific mechanisms remain subject to the user's design decisions.

#### Scenario: A multi-tier interface is explored

- **WHEN** interface tiers or adaptation are proposed to serve the skill spectrum
- **THEN** they respect SCOPE-016's simple default and user-selected complexity
- **AND** no fixed tier count, role mapping or specific layout is inferred from this direction.

### Requirement: SCOPE-008 — Spain-only initial market

The initial target market SHALL be Spain only. This market decision MUST NOT
by itself define geographic access restrictions, legal conclusions or technical
hosting locations.

#### Scenario: Initial launch targeting is proposed

- **WHEN** market targeting or launch messaging is proposed for the initial products
- **THEN** Spain is the sole initial geographic market.

### Requirement: SCOPE-009 — Spanish default with five supported languages

The initial frontend language scope SHALL include Spanish as the main and default
language, plus English, Catalan, Galician and Basque. Recommendations for further
languages SHALL remain proposals until the user approves them. This decision
MUST NOT by itself select translation tooling or language-preference behavior.

#### Scenario: The default language is specified

- **WHEN** the initial frontend's main and default language is defined
- **THEN** it is Spanish.

#### Scenario: Additional approved language support is planned

- **WHEN** the initial frontend's supported languages are planned
- **THEN** English, Catalan, Galician and Basque are included alongside Spanish
- **AND** other proposed languages are not treated as approved.

### Requirement: SCOPE-010 — Warm, approachable and quietly confident

The brand personality SHALL be warm, approachable and quietly confident.
Customer-facing language SHALL be precise and straightforward. This personality
MUST NOT by itself select a product name or visual identity.

#### Scenario: Brand expression is proposed

- **WHEN** product copy or visual direction is proposed
- **THEN** it is evaluated against warmth, approachability and quiet confidence
- **AND** its language is evaluated for precision and straightforwardness.

### Requirement: SCOPE-011 — Secular brand positioning with a truthful origin story

Brand positioning, slogans and product definitions SHALL be secular and MUST NOT
imply endorsement of a religion. A name's cultural or religious origin MAY be
explained accurately when relevant. A discoverable connection SHALL NOT by itself
disqualify a candidate. Final name selection SHALL remain the user's decision.

#### Scenario: A slogan or product definition is proposed

- **WHEN** customer-facing positioning, a slogan or a product definition is proposed
- **THEN** it describes the business product without religious positioning or implied religious endorsement.

#### Scenario: The origin of a name is explained

- **WHEN** it is relevant to explain the name's origin
- **THEN** its supported meaning and cultural context may be explained accurately
- **AND** that explanation does not present the product as endorsing a religion.

#### Scenario: A customer recognizes the cultural connection

- **WHEN** a naming candidate has a discoverable cultural or religious connection
- **THEN** that connection alone is not treated as a reason to exclude it
- **AND** the candidate is not treated as finally selected without user approval.

### Requirement: SCOPE-012 — Positioning through the modernization experience

The intended positioning SHALL emphasize an approachable experience that helps
merchants modernize and digitalize. Modularity SHALL support that experience and
MUST NOT be treated as the sole differentiator. The combined support direction is
defined by SCOPE-013; detailed services and claims of proven competitive
superiority MUST NOT be inferred from this positioning alone.

#### Scenario: The product's difference is presented

- **WHEN** the product's intended differentiation is described
- **THEN** the explanation centers on the merchant's modernization experience, simplicity and support
- **AND** a list of modules alone is not presented as the defining difference.

#### Scenario: Help with modernization is made concrete

- **WHEN** a proposed experience or message describes how merchants receive help
- **THEN** the specific guidance, human assistance or services require an approved basis
- **AND** this positioning direction alone is not treated as a promise of an implemented service or verified customer outcome.

### Requirement: SCOPE-013 — Combine product guidance and human assistance

The intended support model SHALL combine guidance built into the product with
human assistance for onboarding and migration available on merchant request.
This direction MUST NOT by itself select channels, availability, pricing or
detailed service deliverables, or establish that those services are already
operating.

#### Scenario: The modernization support model is described

- **WHEN** the intended approach to helping merchants modernize is described
- **THEN** both in-product guidance and human onboarding/migration assistance are included
- **AND** specific service commitments require their own approved definition.

#### Scenario: Human onboarding assistance is offered

- **WHEN** the human-assistance approach is described
- **THEN** assistance is available on merchant request
- **AND** proactively offering personal onboarding to every new merchant is not the selected model.

### Requirement: SCOPE-014 — Irin is the leading naming candidate for now

Irin SHALL be treated as the leading naming candidate for now. This provisional
preference MUST NOT be treated as final name selection, verified name/domain
availability, registration or approval of a visual identity.

#### Scenario: Naming discussion continues

- **WHEN** the current naming preference is recorded or discussed
- **THEN** Irin is identified as the leading candidate
- **AND** its provisional status and the unresolved final identity are preserved.

### Requirement: SCOPE-015 — Preserve the user's interface and brand references

Design discussions SHALL preserve AWS Console as this user's expert-interface
reference, preferred over Azure and Google Cloud consoles. Naturgy/Lowi names
and brand concepts SHALL remain negative trust references for the user. These
preferences MUST NOT be treated as objective company judgments, approval of
unidentified traits or a beginner-interface baseline.

#### Scenario: The AWS Console preference informs design

- **WHEN** a proposal derives design choices from the AWS Console preference
- **THEN** the specific aspects the user values are clarified before adoption
- **AND** its expert-user context is preserved alongside the need for an extremely simple beginner experience
- **AND** AWS remains a reference without replacing the required TailAdmin foundation.

#### Scenario: The negative brand examples inform naming or identity

- **WHEN** Naturgy or Lowi is considered as a brand reference
- **THEN** the user's lack-of-trust impression is preserved as personal preference
- **AND** specific disliked visual, verbal or naming traits are not invented.

### Requirement: SCOPE-016 — Simple by default, complexity chosen by the user

The backoffice SHALL provide a simple interface by default. Users SHALL choose
when to expose greater complexity. Interface depth MUST NOT change automatically
based on observed usage. This principle MUST NOT by itself select a tier count,
access mechanism, preference scope or persistence behavior.

#### Scenario: The default experience is defined

- **WHEN** the default interface depth is specified
- **THEN** the experience is simple.

#### Scenario: A user requests greater depth

- **WHEN** a user explicitly requests more complex controls or views
- **THEN** the interface depth follows that user choice through the subsequently defined mechanism
- **AND** the exact controls and available views still require an approved definition.

#### Scenario: Usage alone does not change the selected depth

- **WHEN** observed behavior suggests that a user may prefer a different level of complexity
- **THEN** the interface depth is not automatically changed on that basis
- **AND** any suggestion mechanism remains separately undefined.
