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

Current status: the three remaining repository decisions in the
[technical foundation](openspec/changes/establish-frontend-technical-foundation/proposal.md):
module/shared-code organization, landing styling/interaction technology, and
formatting/lint conventions with local quality commands. The user has selected
feature folders with workspace packages following actual reuse by both apps,
Tailwind 4 with native Astro/TypeScript for the landing, and repository-wide
ESLint/Prettier with `pnpm check`. Their implementation and verification are
complete within the agreed repository scope; see the change's design/tasks for
evidence. Further product or brand design requires the user's next instruction.
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
The current technical phase focuses on this repository's own stack. Hosting/CDN
choices are settled for now; do not initiate further questions about them.
Keycloak/API integration and infrastructure/deployment work are deferred and do
not gate completion of the repository stack. Follow the latest scope correction
and proposed local decision queue in the technical change's design and tasks.

Retained UI reference: [product-creation comparison](openspec/changes/explore-product-creation-ui/proposal.md).
Its revised simple/advanced concept is accepted as a design reference; broader
choices and production implementation remain subject to the scope in its proposal.
