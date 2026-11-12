# Define backoffice navigation and module structure

## Why

The technical foundation, initial backoffice branding and its 388 visual references
are implemented and accepted. The user chose “Backoffice navigation and module
structure” as the next design topic. The retained shell has an empty business
sidebar. The user has now selected one shared sidebar grouped by module, showing
enabled modules with separate discovery for other available modules;
the first map covers Inventory and shared areas. The user accepted its initial
entries, with pending movements inside Movimientos, and one collapsible module
group open at a time. Known-inaccessible sections are hidden per team member,
with explicit denial for restricted direct links. Permission loading/errors stay
within affected navigation/content, with Retry on failure and unrelated controls
usable. Relevant Inventory pages have independent location selection with visible
scope near their headings. A sole accessible location is selected automatically;
otherwise an initial choice is requested and explicit page choices are remembered
while the tab stays open. The user selected the first prototype's layout and
responsive behavior. Real destination contents and other deferred product details
remain separate definitions.

## What Changes

- Discuss the navigation model, then define the merchant-facing module map,
  shared areas and navigation depth with the user.
- Ground proposals in the approved simplicity, modularity, honest-status and
  user-controlled complexity principles and relevant read-only module sources.
- Record decisions before preparing a concrete TailAdmin prototype plan.
- Keep proposed menu entries and future modules distinct from approved behavior
  and available functionality.

## Capabilities

### New Capabilities

- `backoffice-navigation`: the selected shared-sidebar model, enabled-module
  visibility with separate discovery, the initial Inventory/shared-area map,
  and unresolved menu interaction details.

### Modified Capabilities

None. Existing product values, audience, stack and branding remain applicable.

## Impact

The initial steps were documentation only. The user has now selected the layout
for the first Storybook prototype: add development-only preview code, translated
catalogue copy, meaningful state/browser tests and registered candidate captures
under the bounded [implementation plan](implementation-plan.md). Production app
source/routes, dependencies, landing, approved references and sibling repositories
remain unchanged. Backend/API/identity integration, hosting, staging, commits and
archive are outside this prototype.

## Authority and status

Asked whether to start with product creation, navigation/module structure or the
landing brief, the user selected “Backoffice navigation and module structure”.
This initiates navigation discovery under the standing instruction to record
definitions in OpenSpec and ask about undefined choices. It does not approve a
navigation model, module list, menu labels, screen layouts or implementation by
itself. The user subsequently answered “One shared sidebar, grouped by module
(Recommended)”. NAV-001 records that model choice.

The user then selected “Enabled modules + separate discovery (Recommended)”,
recorded in NAV-002. The user then selected “Inventory + shared areas
first (Recommended)”, recorded as design coverage in NAV-003, without selecting
launch scope or feature availability. The user subsequently answered “Use this
map as the starting point (Recommended)” to the concrete menu proposal. NAV-004
records its entries and pending work inside Movimientos. Screen contents, access
rules, discovery details and other menu behavior remain open. The user then
selected “One module group open at a time (Recommended)”; NAV-005 records that
interaction, opening the current module on entry and keeping shared entries
outside module groups.
The user subsequently chose “Hide sections the person cannot access
(Recommended)”; NAV-006 records permission-based navigation visibility and
restricted direct-link feedback, leaving roles and grants separate.
The user then selected “Loading/error only where access must be checked
(Recommended)”; NAV-007 records the scoped state model without selecting
permission acquisition or integration.
The user subsequently selected “Independent location selection per page
(Recommended)”; NAV-008 records page-owned scope with visible context, leaving
defaults and remembering choices separate.
The user then chose “Sole location automatic; otherwise ask and remember per tab
(Recommended)”; NAV-009 records the viewing-scope defaults and per-tab retention.
[design.md](design.md) records the choices and the first prototype-layout
proposal. The user then selected “Use this layout for the prototype
(Recommended)”. NAV-010 records that choice and its simulated, neutral-content
scope. The implementation plan details the bounded work authorized by this
prototype selection; [tasks.md](tasks.md) tracks progress. Production UI and the
accepted image baseline remain unchanged.

The bounded prototype is implemented and verified. Its 72 navigation candidates
await user review; the 388 existing reference comparisons pass. Exact results,
identities and preview limitations are recorded in the design. This status is
not new image approval, production integration or archive authority.

The user's first review requests a compact-rail caret correction, a single
content-area access error/Retry and a more space-efficient page frame for future
information-rich tables. They selected “Single content error + compact page frame
(Recommended)”. NAV-011–013 and section 4 of the plan bound that revision; fresh
candidate images will replace the earlier unapproved run for review.

That revision is implemented and verified. The latest run contains 76 unapproved
navigation candidates, including Products; 54 code tests, 39 browser checks and
all 388 existing reference comparisons pass. The design records measured space
reclaimed, exact run identities and the before/after review link.

The second review requires the compact Inventory control to match its neighbors
in footprint and icon dimensions, refining NAV-011. The user chose “One compact
toolbar with page controls (Recommended)” under NAV-014, removing the separate
two-button header row from the preview. Section 5 bounds these corrections and
their fresh verification; the reusable production header remains unchanged.

The second correction is implemented and verified. The current 76-candidate run
has matching compact button/icon metrics and one combined visible toolbar;
54 code tests, 40 browser checks and the 388 accepted reference comparisons pass.
The current images remain unapproved and the prototype remains development-only.

The third review selects NAV-015–017: 64px compact rail with centred 44px targets,
responsive ghost header actions with 16px icons, and an initially open folding
shared footer under “Más opciones”. Section 6 bounds implementation and fresh
verification; new folded states extend the review matrix to 84 navigation cases.

The combined revision, including the user's subsequent thinner Ubicación request
under NAV-018, is implemented and verified. The final 84-candidate run is
`2026-11-12T21-36-33.733Z`: 54 code tests, 43 browser checks and all 388 approved
reference comparisons pass. See the design for exact identities and renderer
details. At that verification point no navigation images were approved or promoted.

After asking whether this was a suitable commit checkpoint, the user explicitly
said **“I approve all revisions.”** in response to the exact final 84-image review
request. Only those cases from `2026-11-12T21-36-33.733Z` are now promoted; the
existing 388 references remain unchanged. This supersedes the earlier pending
image status. The user's commit-preparation request authorizes two staging
batches: navigation code/specifications first, approved references second.
Agents stage each batch and supply its commit command; the user performs commits.
No production integration, archive or deployment follows from this approval.

The post-approval comparison `2026-11-12T21-47-49.746Z` passes all **472** accepted
cases with zero failed, skipped or flaky cases. Final root quality checks and
strict OpenSpec validation pass. The first staging batch contains 26 navigation
code/specification files; the 84 PNGs and registry remain for the second batch.

Both batches were committed by the user (`183a65b`, `4a5b979`). The subsequent
review identifies the multi-location phone header's split rows as a defect. The
user selected “One compact mobile row (Recommended)”; NAV-019 and plan section 7
bound this preview-only refinement. Preserve all 472 accepted references until
specific approval of replacement images. No automatic staging or commit follows.

The phone correction is implemented and verified: 54 code tests, 48 browser
checks, 84 fresh navigation captures and 451 unaffected visual comparisons pass.
Only 12 phone images changed; 72 navigation captures remain byte-identical.
The design links the exact before/after review. Existing 472 references remain
unchanged while the 12 replacement images await specific user approval.

Subsequent user feedback requests a thinner button and hover over each entire
dropdown line. NAV-020–021 and plan section 8 refine only the preview: a 36px
visible phone selector with 44px pointer area, and contiguous full-width 44px
option rows. Add named open/hovered-option capture states; preserve accepted
references until the current replacements and new states are specifically approved.

This refinement passes 54 code tests, 53 browser checks and 92 fresh navigation
captures. Run `2026-11-12T22-46-21.298Z` contains 12 phone replacements and eight
new dropdown states requiring approval, with 72 byte-identical navigation images.
The design links the current review; all accepted references remain unchanged.
