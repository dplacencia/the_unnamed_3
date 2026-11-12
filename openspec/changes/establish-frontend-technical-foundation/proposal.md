# Establish the frontend technical foundation

## Why

The user has explicitly moved technical decisions and their implementation ahead
of further branding configuration, visual evaluation tooling and product-flow
design. The accepted product-creation comparison remains a design reference.

## What Changes

- Record the required work order and a bounded technical decision queue.
- Resolve technical choices with the user, then write their specifications and
  implementation tasks before implementing the approved foundation.
- Preserve separate backoffice/landing products and deployments, required TailAdmin
  reuse, five frontend languages and exact backend contract meaning.

## Capabilities

### New Capabilities

- `frontend-architecture`: the selected TailAdmin Next.js backoffice, Astro landing,
  two-app pnpm workspace, pinned toolchain, feature-owned backoffice source and
  shared workspace code introduced only for actual reuse by both apps, plus the
  landing's Tailwind/native Astro/TypeScript foundation.
- `frontend-quality`: the selected Vitest/React Testing Library code-test stack
  and repository-wide ESLint/Prettier conventions with local `pnpm check`.
  The separate visual-workflow
  change owns the subsequently selected and implemented visual tooling.
- `frontend-localization`: explicit cookie-based backoffice language choice and
  localized landing paths, with Spanish first and browser detection disabled.
- `frontend-hosting`: independent static outputs for S3 behind CloudFront, with
  browser-resolved backoffice language, neutral preference initialization and
  separate private S3/CloudFront resources per app using OAC.
- `frontend-forms`: selected React Hook Form + Zod backoffice foundation with the
  standard resolver, retained TailAdmin controls and exact-value preservation.
- `frontend-ui-state`: React state/reducers with scoped Context as the default,
  preserving the existing shell's state, form and preference boundaries.

### Modified Capabilities

None; these capabilities are new to this repository's OpenSpec records.

## Impact

The approved first subset adds the supplied TailAdmin source to `apps/backoffice`,
creates a minimal Astro scaffold in `apps/landing` and creates the root pnpm
workspace and independent development/build/check commands. Node 26.13.1 and pnpm
12.18.0 are selected. No new branding, product flows or visual workflow
is implemented. Supplied ZIPs remain untouched and sibling repos remain read-only.
Both apps now produce static artifacts for the selected S3/CloudFront hosting;
the backoffice resolves explicit language preference in the browser after neutral
initialization. No AWS infrastructure is created or deployed by this subset.
Never commit, deploy, publish or archive through inferred authority.

## Authority and status

The user's latest instruction is to define and implement technical decisions,
then define enough branding to configure TailAdmin basics, then define how to
design, detect changes, compare and evaluate visuals, and only afterwards consider
the first product flows and visuals. Playwright was raised as a question, not
selected. Each undefined choice still requires the user's decision under the
[existing workflow](../establish-frontend-foundation/specs/specification-workflow/spec.md).

This authorizes discovery and implementation of approved technical choices; it
does not let an agent choose a framework or deployment policy on the user's behalf.
No separate implementation permission is needed for work already covered by that
instruction once its dependent choices have been decided. See [design.md](design.md)
for the current queue and [tasks.md](tasks.md) for actual progress.

The user subsequently selected “Use the supplied Next.js edition (Recommended)”
and “Two app folders with pnpm workspaces”, then “Node.js 26 LTS + pinned stable
pnpm” and “Astro for the landing page”. Those choices authorize the initial
source/workspace/toolchain implementation. The later lean-source, code-test and
locale choices are recorded in the design and capability deltas. The user selected
“Both apps static on S3 (Recommended)” behind CloudFront and neutral language
initialization, followed by private S3 origins using OAC and a separate bucket and
distribution per app. Remaining infrastructure details and API/identity integration
remain open.

The user's latest scope correction limits the current phase to this repository's
own technology stack. Hosting/CDN choices are sufficiently defined; do not ask
further questions about them. Keycloak/API integration and deployment work are
deferred, not prerequisites for completing the repository stack. Continue with
frontend forms/validation, local state/code organization, landing styling and
repository quality conventions as proposals for the user's decisions.

The user then answered “That looks good” to React Hook Form + Zod for backoffice
form state and typed validation. That stack is approved and installed with its
standard resolver and an integration-test fixture. The user then selected the
recommended React state/reducers with scoped Context for UI state. The existing
shell fits this default, so it requires no new dependency or state migration.
At that point code organization, landing styling and remaining code conventions
were still open.

The user has now selected “Feature folders with shared code added when reused
(Recommended)”: future backoffice features own their source under
`src/features/<feature>`, routes compose features, and generic TailAdmin source
stays shared. Both apps remain independent; workspace packages follow actual
consumers in both apps. The current foundation needs guidance updates rather
than a speculative feature scaffold or migration. Landing styling and repository
quality conventions remain open.

The user subsequently advanced
[visual review workflow implementation](../define-visual-review-workflow/proposal.md).
The user selected Storybook, Astro-native previews and Playwright, pinned Chromium
on this Mac and responsive/theme/language coverage. This does not approve the
preceding feature-folder proposal, branding or product-flow design. The linked
change owns current tooling, reference-approval rules and verification evidence.
After that setup was implemented, the user said “ok, lets work on these three”
about the remaining module/shared-code organization, landing styling/interaction,
and code-convention/local-quality decisions. Those three topics are now active;
record the user's choices and implement the approved parts. None of their
unanswered recommendations is approved by this instruction.

The user subsequently selected “Tailwind 4 + native Astro/TypeScript
(Recommended)” and “Repo-wide ESLint + Prettier and pnpm check (Recommended)”.
The three repository decisions are now resolved. Their bounded implementation
plan is in the design/tasks: set up landing styles and local quality tools,
preserve empty product pages and refresh the existing visual checks. Completion
still requires actual verification; no branding, flow design or visual-reference
acceptance follows from these technical choices.

The selected repository foundation is now implemented and verified, including
the typed Astro client-script lint correction found during independent review.
See the final design/results and checked tasks for evidence. This completes the
agreed local stack scope; it does not publish/archive the change or begin the
next branding/product phase. The visual-reference registry remains unapproved.
