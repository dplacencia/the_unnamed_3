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
