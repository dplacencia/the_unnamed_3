# Static frontend hosting

## ADDED Requirements

### Requirement: HOST-001 — Static S3 artifacts behind CloudFront

Both frontend products SHALL produce independent static artifacts for an S3
origin behind AWS CloudFront. The backoffice SHALL retain Next.js using static
export; the landing SHALL retain Astro's static output. Neither artifact SHALL
require a deployed Next.js server, proxy, server action or image optimizer.
Infrastructure details and deployment MUST NOT be inferred from this selection.

#### Scenario: Each frontend product is built

- **WHEN** its independent production build succeeds
- **THEN** the backoffice supplies `apps/backoffice/out` and the landing supplies
  `apps/landing/dist` containing static assets
- **AND** no Docker/server origin, AWS resource mutation or deployment is implied.

### Requirement: HOST-002 — Browser-resolved locale with neutral initialization

The static backoffice SHALL resolve its approved language preference in the
browser while preserving shared URLs, Spanish fallback, the five approved
languages and the one-year host-only cookie. Until preference initialization
completes, it SHALL present a neutral loading state rather than Spanish content
that later flashes into a remembered language. Browser language inference MUST
remain disabled. Unavailable persistence MUST NOT be reported as successful.

#### Scenario: A remembered English preference is opened

- **WHEN** the static document is loaded before browser preference initialization
- **THEN** it presents the neutral initialization state
- **AND** after reading the explicit cookie it presents English messages and a
  matching document language without changing the URL or writing an inferred choice.

#### Scenario: No valid readable preference exists

- **WHEN** initialization finds no supported cookie or cookie access is blocked
- **THEN** the backoffice uses Spanish without inspecting browser languages
- **AND** initialization itself does not write an explicit preference.

### Requirement: HOST-003 — Private S3 origins with CloudFront OAC

Frontend S3 origins SHALL be private regular bucket origins, with CloudFront
object reads authorized through Origin Access Control and a distribution-scoped
bucket policy. Public direct-origin reads MUST be denied. S3 website endpoints
MUST NOT be used with this OAC setup. This origin-access decision MUST NOT be
treated as merchant authentication or authority to create or deploy resources.

#### Scenario: A visitor requests a frontend asset

- **WHEN** the configured CloudFront distribution reads an asset from its S3 origin
- **THEN** OAC and the bucket policy authorize that distribution's origin read
- **AND** an unauthenticated direct S3 request does not publicly expose the object.

### Requirement: HOST-004 — Separate hosting resources per product

The backoffice and landing SHALL each have a separate private S3 bucket and
CloudFront distribution, preserving independent deployment and access-policy
boundaries. This selection MUST NOT determine resource names, accounts, regions,
environment count, domains, certificates, routing, cache policy or infrastructure
tooling without a further approved basis.

#### Scenario: The hosting topology is prepared

- **WHEN** the approved frontend hosting resources are specified
- **THEN** each product targets its own bucket and distribution
- **AND** a shared bucket with app prefixes is not substituted for the selected topology.
