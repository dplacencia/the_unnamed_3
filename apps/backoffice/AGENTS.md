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
The active [navigation discovery](../../openspec/changes/define-backoffice-navigation/proposal.md)
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
