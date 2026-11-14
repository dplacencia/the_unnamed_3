# Backoffice agent entry point

Read the [repository entry point](../../AGENTS.md), its OpenSpec sources and the
[current technical assignment](../../openspec/changes/establish-frontend-technical-foundation/proposal.md)
before actions. Module/shared-code organization, landing styling/interactions and
code conventions/local quality commands are now selected, implemented and verified
in that change. Preserve these choices. The completed
[brand-basics assignment](../../openspec/changes/define-brand-basics/proposal.md)
develops a restrained/approachable comparison in Storybook. D/ink indigo
(`#57528C`) and Source Sans 3 are the selected colour and typeface bases. The
initial identity is a simple “Irin” text wordmark in Source Sans 3; a bespoke
symbol is deferred and the name remains provisional. The user selected retaining
TailAdmin's current spacing, rounded corners and icons. The user approved the
concrete configuration in the brand change's design, including the full palette,
retained UI text metrics and 32px/20px semibold wordmark. That configuration and
the approved `brand-300` ordinary dark-text refinement under BRAND-007 are applied
and verified, retaining palette values and other visual roles. All 388 final-run
images are user-approved and promoted; full comparison passes. The design records
the exact approval and identities. Require new image approval for replacements.
The
[visual review workflow](../../openspec/changes/define-visual-review-workflow/proposal.md)
is implemented; preserve its review rules and the technical sources as constraints.
The current [Products table design](../../openspec/changes/define-products-table/proposal.md)
now follows the user's TanStack acceptance and continued-design instruction.
Latest staging authority: “go ahead” after the two-batch checkpoint recommendation.
Follow [commit preparation](../../openspec/changes/define-products-table/editing-plan.md#commit-preparation--2026-11-14):
25 code/specification/test files first, then 156 approved PNGs plus manifest only
after the user commits batch 1. Return commit commands; never commit.
Do not begin the next design pass before this checkpoint completes.
Latest authority: the user explicitly approved all current revisions after the
156-image Products gallery. Those exact references are promoted (628 baseline
entries); see the [approval record](../../openspec/changes/define-products-table/editing-plan.md#visual-approval--2026-11-14).
The separately pending 20 navigation images are outside that gallery.
A capture-only panel focus race is fixed; all 24 repeated profile comparisons
match the approved overview. Read the approval record for exact evidence. The subsequent batch-preparation scope above
adds no commit authority. Never commit.
The preceding review selected PT-027's dismissible result message; follow the
[bounded refinement](../../openspec/changes/define-products-table/editing-plan.md#review-refinement--dismissible-results-2026-11-14).
Closing/reopening changes presentation only and must preserve drafts/outcomes,
including an explicit unconfirmed status. The fresh 156-image revision supersedes
the earlier 140-image set and is now approved; future changes need fresh review.
The prepared batch was committed by the user as `b955575`. Their subsequent
“Done, continue with next steps” authorizes continuing the remaining design;
the [editing-field decision](../../openspec/changes/define-products-table/design.md#editing-field-scope--proposal-2026-11-14)
records “Name + missing SKU (Recommended)” under PT-022. Both editors allow name
changes and explicit assignment of an SKU only when unassigned; existing SKU
replacement, barcode maintenance and unit changes are outside the first editor.
PT-023 selects one Guardar cambios action with individual results, counting only
confirmed changes as saved and retaining failed/unconfirmed drafts without batch
atomicity. PT-024 checks all requested drafts before submission and blocks sending
until detectable field errors are corrected, showing errors beside fields.
PT-025 guards in-app departure with Guardar y salir / Descartar cambios / Seguir
editando, leaving after save only when all requested changes are confirmed.
PT-026 reuses Inventory's existing name/SKU profiles for local checks, preserving
exact text and the 1024/256 received UTF-8 byte limits. Do not repeat these choices.
Detailed outcome recovery and remaining draft lifecycle remain open. Preserve
explicit editing, drafts and read-only stock.
Follow the [editing prototype plan](../../openspec/changes/define-products-table/editing-plan.md)
for the selected PT-022–026 Storybook design. Its remaining recovery and storage
limits are explicit; the first browsing pass's editing exclusion is historical
for this later bounded design. Preserve production source and accepted images.
The editing design now passes 64 code tests, 97 browser checks, 156 candidate
captures and 451 unaffected approved comparisons. Read the editing plan's final
source/runs and limits. Unconfirmed drafts are read-only/selectable while the
fixture pauses submission; this is not a production recovery policy. All 156
Products images are accepted; the prior 20 navigation updates remain pending.
New staging, future image acceptance and commits do not
follow from this continuation; never execute a commit.
Read [PT-018–021's source decisions](../../openspec/changes/define-products-table/foundation-decision.md)
and the [browsing prototype plan](../../openspec/changes/define-products-table/prototype-plan.md).
TanStack Table 9.3.1 is selected and exactly pinned as a runtime dependency after
live latest-stable verification. Compact read-only expansions retain the full
panel, show identifiers/status/hidden catalogue fields and allow several rows
open independently, all initially collapsed. Do not ask these questions again.
The first Storybook design uses retained TailAdmin controls and optional Products
slots in the navigation preview. Editing/filter flows and production API/routes,
exact visual-metric acceptance and image promotion remain outside this pass.
The browsing preview passes 54 code tests, 69 browser checks, 84 candidate
captures and 451 unaffected reference comparisons. The plan records the exact
run/source, proposed metrics and fixture retention limits. No images are accepted.
The prior comparison authorization is recorded under the
[qualification plan](../../openspec/changes/define-products-table/qualification-plan.md).
Evaluation-only dependencies, Storybook fixtures and browser tests are authorized;
At that historical comparison checkpoint, production grid adoption, new product
behavior and image promotion remained open; PT-018–021 above now govern the foundation.
Earlier research-only boundaries below are historical for this evaluation scope.
The [results](../../openspec/changes/define-products-table/qualification-results.md)
record 34 browser checks and the final TanStack recommendation. Tabulator has
more supplied features and better measured large-fixture scroll/heap results;
its native ARIA finding and required keyboard integration are explicit. Both
libraries were dev-only at that checkpoint; the later TanStack selection above
supersedes its pre-adoption status. Tabulator remains evaluation-only.
The user requested understanding Excel's appeal for
inventory before designing a simple, powerful table. Read its research, design
alternatives and tasks. Use the selected browsing/comparison scenario; do not infer
unselected columns, editable stock, a spreadsheet engine, a grid dependency or an API from
the research. Existing values, exactness and user-controlled complexity apply.
Only the linked comparison and browsing previews are authorized; production
routes and staging remain outside this step.
The user does not know interviewees' main task and requested internet evidence.
The follow-up job map remains a hypothesis. The user selected table-first with
editing on request under PT-001 and catalogue plus optional read-only stock for
one selected location under PT-002. PT-003 records the selected initial columns:
Producto, Referencia (SKU), Unidad and Existencias registradas when shown.
PT-004 records stock on request: catalogue columns initially, with Mostrar
existencias revealing the stock column and location selector. PT-005 records
per-tab visibility/location retention, preserving location while stock is hidden,
existing page-owned location defaults and new tabs catalogue-only. Remembering
does not prove access or validity. PT-006 records compact default plus a
merchant-selected comfortable density, with exact sizes compared in Storybook.
PT-007 records one Buscar productos field for partial names and exact SKU/barcodes,
preserving codes and leaving product choice to the merchant. PT-008 records
Enter/Buscar submission, steady rows during typing and scoped clearing that
preserves stock/location. PT-009 records Producto A–Z initially, one active
Producto/SKU ascending/descending sort, text SKU and full-matching-set ordering.
PT-010 records optional Incluir archivados and Solo con existencias registradas
behind Filtros; stock-only uses the configured reservation dimension at the
selected location under the owning Inventory rules. PT-011 records Aplicar/Cancelar,
discarding unapplied panel drafts on close, removable applied labels, scoped
clearing and removal of the stock-only constraint when stock is hidden. PT-012
retains submitted search/sort/applied filters/density per tab in the same business,
with defaults in new tabs and unapplied view drafts discarded on leaving. Retain
PT-005; business-edit drafts stay undefined. PT-013 records Vista grouping
density/column visibility/order/width, per-tab choices, Producto included, stock
under Mostrar existencias and a column-only Restablecer columnas reset. PT-014
records product-name activation opening read-only desktop/phone panels while
preserving table settings. PT-015 records all active stock measurements with
units/main-first order, exact values and truthful verification/unknown states.
PT-016 records the full phone table with horizontal scrolling, sticky column
header and Producto pinned left, preserving chosen columns and saved desktop
layout. PT-017 records Editar in the panel plus optional Editar tabla, both
deliberate drafts with Guardar/Cancelar and read-only stock. Current steering
requests AG Grid expandable rows, Tabulator 6.x and TanStack Table research,
including actual commercial-use licences and TailAdmin fit. The user said continue.
The research addendum verifies MIT commercial-use licensing for TanStack Table
and Tabulator; AG Grid's relevant Master/Detail feature is Enterprise. The user
did not select the proposed TanStack-first candidate, asking for overall feature
power and platform fit beyond styling. Tabulator supplies more complete grid
operations; TanStack v9 has table/range engines and direct React composition,
with more interaction/integration work. The user subsequently delegated comparison
execution, now completed under the linked plan/results.
The initial 9.3.1/6.7.1 source observations preceded evaluation pins, and runtime
compatibility was initially unverified; use the subsequent bounded browser/build
evidence, not the earlier desk-only limit. Preserve PT-014/PT-017; production
library adoption and expansion behavior are now selected in PT-018–021. Retain application state
and form stack; the TanStack homepage does not select other ecosystem packages.
Fields, identifier operations, save outcomes, draft lifecycle, exact controls,
hidden-sort handling, matching/order, refresh, storage and implementation remain
undefined. Evaluation installation/UI is separately authorized and completed;
no production adoption or product-flow implementation follows from the results.
Do not repeat resolved or unavailable questions.
The preceding [navigation discovery](../../openspec/changes/define-backoffice-navigation/proposal.md)
records the shared sidebar under NAV-001 and enabled modules with separate
discovery under NAV-002. NAV-003 selects Inventory plus shared areas for the first
design map. NAV-004 records the accepted initial entries, with pending work inside
Movimientos. NAV-005 records one collapsible module group open at a time, opening
the current module on entry and leaving shared entries outside groups. NAV-006
hides known-inaccessible sections and groups with no accessible sections, with
explicit denial for restricted links. NAV-007 scopes permission loading/error
states to affected areas, with Retry on failure and unrelated controls usable.
NAV-008 records independent location selection per relevant Inventory page with
scope visible near its heading. NAV-009 selects a sole accessible location
automatically, otherwise asks for an initial choice, and remembers explicit page
choices while the tab stays open. NAV-010 records the selected prototype layout
and responsive drawer behavior. The development-only Storybook preview is
implemented and verified under the navigation change's plan, with simulated
states and neutral content. The user approved its 84 final images with “I approve
all revisions.”; those references are promoted, preserving the existing 388.
Read the design's run identities and preview
retention limits. Roles, real screen contents and other menu details remain open;
preserve production UI and accepted references.
The user's first review selects NAV-011–013 corrections: compact caret fit, one
content-area access error/Retry and a compact available-width page frame, keeping
text/control sizes. The revision is implemented and verified; its fresh candidates
initially awaited review. Positive wording on the old preview did not approve its images. No table columns,
row density or editing behavior is selected by the Excel space-use reference.
The second review requires the compact Inventory trigger/icon to match its
neighbors and selects NAV-014's one compact toolbar with visible page controls.
Section 5 is implemented and verified, including compact keyboard activation and
announced expansion. That revision's 76 candidates remain unapproved; 40 browser checks and
all 388 approved comparisons pass. Keep the production header unchanged and do
not introduce the unselected hover-activated alternative.
The third review selects a narrow centred rail, responsive ghost header actions
and initially open folding footer under NAV-015–017. NAV-018 records the user's
thinner Ubicación request, using 36px desktop/44px tablet-mobile targets with
14px text. Section 6 is implemented and verified: 54 code tests, 43 browser checks,
84 current captures and 388 approved comparisons pass. The design records the
exact final run and subsequent 84-image approval. Preserve production
components and accepted references.
The user authorized commit preparation in two staging batches: navigation code/
specifications, then approved references. Give the user each commit command;
never execute a commit, archive or deployment.
The full post-approval comparison passes all 472 accepted cases; preserve the
exact source/image/approval identities recorded in the navigation design.
The latest post-commit assignment corrects the split scoped phone header under
NAV-019 and plan section 7. The user chose “One compact mobile row (Recommended)”:
short location prompt, permitted visual ellipsis, full location names in the
dropdown and retained 44px touch targets. Preserve desktop presentation and state.
The committed 472 references remain intact until new images are specifically
approved; no automatic staging or commits follow from this correction.
The fix passes 54 code tests, 48 browser checks, 84 fresh captures and 451
unaffected comparisons. Only 12 phone images changed; read the design's exact
capture and pending replacement-approval identities before accepting references.
The latest NAV-020–021 refinement responds to the user's thinner-button and
full-row-hover feedback: 36px visible phone selector/44px pointer area and
contiguous full-width 44px dropdown rows. Apply plan section 8 only in the
preview; add open/hovered-option captures and retain specific image approval.
The implemented refinement passes 54 code tests, 53 browser checks, 92 current
captures and 451 unaffected comparisons. The design identifies 12 phone replacements and eight new dropdown
states requiring approval; 72 other navigation images are byte-identical.
User instructions and approved decisions govern over vendor
defaults. Never commit; sibling repositories remain read-only.

This is the selected lean TailAdmin Next.js foundation. The complete paid source
is preserved in the supplied ZIP at the repository root. Demo routes, fake data,
widgets and unused libraries were removed; do not recreate them from old examples.
Existing template colors, logos and typography are a vendor baseline, not approval
of final branding. The five-language configuration follows OpenSpec; its initial
framework labels do not establish complete product localization.

Use the root pnpm commands in [README.md](../../README.md). Keep the pinned runtime,
package manager, release waiting period and dependency-script policy. Ask before
adding an undefined technical dependency. Use the existing `@/components/ui/*`
primitives and `cn` utility. Keep component paths in kebab-case, strict TypeScript,
accessible native controls and logical CSS properties. Import existing icons from
`@/icons`; do not author icon SVG in new components.
Use the root Prettier configuration for the selected two-space/double-quote/
semicolon style, preserving its backoffice Tailwind stylesheet and `cn`/`cva`
sorting. `pnpm check` at the repository root covers formatting, both apps' lint,
types and code tests; builds and browser/visual checks remain separate.

Before Next-specific changes, read the relevant guide in
`node_modules/next/dist/docs/`; current APIs may differ from training knowledge.
Use the shared-URL navigation exports in `@/i18n/navigation`. Spanish is the
fallback; the browser reads a one-year host-only explicit preference cookie
without browser language detection. `LocaleProvider` shows neutral initialization
before chosen-language content; future explicit controls use `useLocalePreference`.
Product languages follow OpenSpec, not archived vendor demos.

Both apps target static S3 artifacts behind CloudFront. Preserve `output: export`
and static image delivery; do not add Next proxy/request-cookie logic, Server
Actions, request-time rendering or other server dependencies. New routes must fit
the selected static hosting and future approved deep-link strategy. Build output
is `out/`; the local `preview:backoffice` command serves it without a Next server.
The current phase focuses on the repository's own stack. Hosting/CDN choices are
settled; do not reopen them. Infrastructure and identity/API integration are
deferred work, not prerequisites for completing this phase.

Use the approved React Hook Form + Zod stack for form state and client schema
validation, connected through `@hookform/resolvers/zod`, with retained TailAdmin
controls. The fixture in `src/test/form-stack.test.tsx` verifies integration only;
it is not a product schema or a selected form design. Keep exact values as exact
values; do not add shared implicit numeric coercion or normalization. Product
rules/messages and form abstractions need an approved feature basis. Do not add
form dependencies to the landing through this backoffice selection.

Use React state/reducers and scoped Context as the approved UI-state default.
Keep state with its owning component/subtree and use Context for sharing where
needed; form state stays with React Hook Form. Retain compliant browser
subscriptions using `useSyncExternalStore`. Do not add a separate global-store
library, generic state wrapper or new persistence policy without a further
approved basis.

Group future feature-owned components, hooks, schemas and tests under
`src/features/<feature>` where applicable; use `src/app` to compose routes.
Keep generic TailAdmin controls and shared app infrastructure in their existing
locations. The two apps remain independent. Introduce a workspace package only
when code has actual consumers in both apps. Do not create empty feature/package
scaffolding or migrate generic source merely to demonstrate this organization.

Vitest/React Testing Library tests cover suitable client/logic behavior. Preserve
observable behavior when changing shared state helpers. Run relevant type, lint,
test and build checks; do not claim browser/visual coverage from those results.
Maintain the real-component Storybook catalogue in `.storybook/` and its root
`visual/inventory.json` entries when changing UI. Follow the
[visual review guide](../../visual/README.md); keep fixtures out of production
routes and accept only specifically reviewed references. Brand configuration and
product-flow design require their own decisions.
Catalogue-owned copy uses the development-only `catalogue` namespace and all five
`.storybook/messages/` dictionaries. Translate errors when rendering stable codes;
preserve typed values and explicit overrides during locale changes. Run
`pnpm visual:test-languages` with the current build, alongside relevant code and
capture checks. Do not add catalogue dictionaries to production app messages.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
