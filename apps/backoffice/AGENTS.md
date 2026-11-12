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
