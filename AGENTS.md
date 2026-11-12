# Agent entry point

Before task actions, read these OpenSpec records in full:

1. [Specification workflow and agent boundaries](openspec/changes/establish-frontend-foundation/specs/specification-workflow/spec.md).
2. [Frontend product scope](openspec/changes/establish-frontend-foundation/specs/frontend-scope/spec.md).
3. [Product values](openspec/changes/establish-frontend-foundation/specs/product-values/spec.md).
4. The foundation change's [proposal](openspec/changes/establish-frontend-foundation/proposal.md),
   [source instructions, decisions and open questions](openspec/changes/establish-frontend-foundation/design.md)
   and [tasks](openspec/changes/establish-frontend-foundation/tasks.md).

Then read the current user assignment and its relevant OpenSpec specifications
and change artifacts. Start from the
[recorded authority and status](openspec/changes/establish-frontend-foundation/proposal.md#authority-and-status);
the linked records distinguish approved source decisions from newly recorded
wording and unresolved choices. Future accepted changes retain their explicit
scope; these entry-point links are not approval or execution authority.

Current assignment: [backoffice navigation discovery](openspec/changes/define-backoffice-navigation/proposal.md).
The user chose “Backoffice navigation and module structure” as the next design
topic. NAV-001 records one shared sidebar grouped by module. NAV-002 records
enabled modules in that sidebar with separate discovery for other available
modules. NAV-003 records Inventory plus shared areas as the first map's design
coverage. NAV-004 records the agreed starting map, including pending movements
within Movimientos. NAV-005 records collapsible module groups with at most one
open, opening the current module on entry and keeping shared entries outside
groups. NAV-006 hides known-inaccessible sections and groups with no accessible
sections, with clear denial for restricted direct links. NAV-007 limits permission
loading/error states to affected navigation/content, with Retry on failure and
unrelated controls usable. NAV-008 records independent location selection on
relevant Inventory pages, with scope visible near the heading. NAV-009 selects a
sole accessible location automatically, otherwise asks for an initial choice, and
remembers explicit page choices while the tab stays open. NAV-010 records the
selected top/middle/bottom layout and drawer closing after destination selection.
The user chose this layout for the first Storybook prototype. Its bounded
[implementation plan](openspec/changes/define-backoffice-navigation/implementation-plan.md)
is implemented and verified for the development-only preview, simulated states
and translations. The design records checks and the exact current 84-candidate
review run. The user approved its 84 images with “I approve all revisions.”;
those exact references are promoted alongside the preserved 388 existing cases.
Preserve the documented preview retention limits and require new approval for
future replacements.
Latest user review requests corrections under NAV-011–013: hide the compact
Inventory caret, show access-check errors once in content with Retry, and use a
compact page frame that leaves space for information-rich tables without shrinking
readable text/controls. The user chose that revision direction. Follow section 4
of the plan. Those corrections are implemented and verified, with 76 revised
candidates initially awaiting review; only the final 84-image run is now promoted.
Table contents, row density and spreadsheet-style editing remain undefined.
The second review refines NAV-011 to match the entire compact Inventory trigger
and icon to neighboring menu controls. Under NAV-014 the user chose one compact
toolbar combining menu, title, location and theme controls, keeping controls
visible at existing sizes. Section 5's preview-only correction is implemented
and verified, including matching compact keyboard state to visible content.
That revision's 76-candidate run and 40 browser checks passed. Production
header behavior remains unchanged; that run is superseded by the final revision.
The third review selects NAV-015–017: a 64px collapsed rail with centred 44px
targets/16px icons, ghost header actions at 36px desktop or 44px tablet/mobile,
and an initially open footer folding under “Más opciones”. Additional steering
under NAV-018 makes Ubicación 36px on desktop while retaining 44px tablet/mobile
targets and 14px text. Section 6 is implemented and verified: 54 code tests,
43 browser checks, 84 current captures and 388 approved comparisons pass. Read
the design's exact current run identities and subsequent 84-image approval.
Do not change production primitives. The user's commit-preparation request and
image approval authorize two staging batches: navigation code/specifications,
then approved visual references. Stage one batch at a time and give the user its
commit command; never execute a commit. Do not archive or deploy automatically.
The full post-approval comparison passes all 472 accepted cases; the navigation
design records the exact run and approval evidence.
Post-commit correction: the user reported the split multi-location phone header,
confirmed that defect and selected “One compact mobile row (Recommended)”.
NAV-019 and plan section 7 govern this preview-only fix: keep menu/title/compact
location/theme on one phone row, use the short translated location prompt,
allow visual ellipsis and preserve 44px touch targets and full dropdown names.
Retain the committed 472-image baseline pending new replacement-image approval.
This new correction does not authorize staging or commits automatically.
NAV-019 is implemented and verified: 54 code tests, 48 browser checks, 84 fresh
captures and 451 unaffected visual comparisons pass. Only 12 phone images changed;
the design links their before/after review and records the pending approval.
Latest feedback further requests a thinner selector and full-row dropdown hover.
NAV-020–021 and plan section 8 govern a 36px visible phone selector with 44px
pointer area, and contiguous full-width 44px option rows using preview-only
props/CSS. Preserve text, native interactions and production select primitives.
Add open/hovered-option capture states; keep all accepted references unchanged
until the new replacements and states receive specific approval.
The refinement is implemented: 54 code tests, 53 browser checks, 92 fresh
captures and 451 unaffected comparisons pass. Only 12 phone replacements and eight new dropdown states need
approval; the other 72 navigation images match accepted hashes. Read the design's
exact current run and review URL before reference acceptance.
Ask before adopting other unresolved choices; preserve production UI and approved
references. The design records sources, choices and limits. Product-creation flows and the
landing remain later work.

Completed brand configuration: [brand basics](openspec/changes/define-brand-basics/proposal.md).
The user said “go ahead” to defining brand basics before customizing TailAdmin.
Discuss the visual emphasis, then concrete colour/typography options and the
minimum identity treatment needed for configuration. The user selected restrained
and approachable: warm neutral backgrounds, clear typography, strong contrast
and limited accent colour. Develop the concrete comparisons in the brand change's
plan using actual TailAdmin components. The user selected D/ink indigo (`#57528C`)
as the colour basis and Source Sans 3 as the typeface basis. The initial identity
uses a simple “Irin” text wordmark in that font, with a bespoke symbol deferred
and the name still provisional. The user also selected retaining TailAdmin's
existing spacing, rounded corners and icons for the first backoffice configuration.
The user approved the concrete first configuration in the brand change's design:
full option-D indigo/warm-neutral mapping, current UI text metrics and a semibold
Irin wordmark at 32px expanded / 20px compact. That backoffice configuration and
the approved `brand-300` (`#B4ACD7`) ordinary dark-text refinement under BRAND-007
are applied and verified. The user approved all 388 images from the final run;
their references are promoted and the full comparison passes. The design records
the exact approval and run identities. Keep the landing unchanged and require
specific image approval for future replacements. Product-flow design remains later.

Completed foundation: the three repository decisions in the
[technical foundation](openspec/changes/establish-frontend-technical-foundation/proposal.md):
module/shared-code organization, landing styling/interaction technology, and
formatting/lint conventions with local quality commands. The user has selected
feature folders with workspace packages following actual reuse by both apps,
Tailwind 4 with native Astro/TypeScript for the landing, and repository-wide
ESLint/Prettier with `pnpm check`. Their implementation and verification are
complete within the agreed repository scope; see the change's design/tasks for
evidence. The brand configuration and its image approval are complete within the
scope recorded above; further work follows the user's next assignment.
The [visual review workflow](openspec/changes/define-visual-review-workflow/proposal.md)
is implemented. Storybook, Astro-native previews and Playwright are selected,
with pinned Chromium on this Mac and the recorded responsive/theme/language
matrix. Follow [visual/README.md](visual/README.md)
for the capture/review/compare workflow and retain the approved colour threshold
0.01 with maxDiffPixels 0. Keep the exact-version esbuild@0.28.2 install-script
denial in the pnpm policy. Never accept references without the user's
specific image approval; a passing capture is not visual acceptance. No product-flow or brand
design follows automatically. Preserve the approved technical foundation
and the scope of its remaining future work. The user selected future backoffice feature folders
in `src/features/<feature>` with routes composing them and generic TailAdmin code
remaining shared. Add workspace packages only for code actually consumed by both
apps; no feature or package scaffold is needed before real consumers exist.
Use `pnpm format` to apply the selected two-space/double-quote/semicolon style and
`pnpm check` for formatting, lint, types and code tests. Run the relevant builds
and browser/visual checks separately; successful code checks do not accept images.
Preserve formatter/linter exclusions for generated files, tools, dependencies,
third-party assets and reference archives. Both apps use the root formatter;
the backoffice retains its Next.js lint rules and Astro has its own lint config.
The completed technical phase focused on this repository's own stack. Hosting/CDN
choices are settled for now; do not initiate further questions about them.
Keycloak/API integration and infrastructure/deployment work remain deferred and
do not gate brand discovery. Preserve the scope correction and selected stack
in the technical change's design and tasks.

Retained UI reference: [product-creation comparison](openspec/changes/explore-product-creation-ui/proposal.md).
Its revised simple/advanced concept is accepted as a design reference; broader
choices and production implementation remain subject to the scope in its proposal.
