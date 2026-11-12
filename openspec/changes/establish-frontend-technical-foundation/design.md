# Technical foundation decisions

Current status: all three remaining repository choices are selected, implemented
and verified. See the implementation results at the end of this record. The
agreed local stack is complete; branding, product flows, external integration,
deployment and visual-reference acceptance retain their separate authority.

Latest steering: after the visual setup was implemented, the user said “ok, lets
work on these three” about the remaining code-organization, landing
styling/interaction, and code-convention/local-quality decisions. Resolve these
with the user and implement the selected choices under this change. The
instruction does not select their unanswered recommendations. Preserve the
implemented [visual workflow](../define-visual-review-workflow/proposal.md), its
reference-approval rules and all existing technical approvals. Branding and
product-flow implementation remain unapproved.

## User-selected work order

Source: the user's earlier conversation instruction, following acceptance of the
revised product-creation comparison:

> Lets define and implement the technical decisions first, then define a bit more
> about the branding that allow us to configure the basics of the TailAdmin
> template, then define how are we going to design (Playwright?) in a way we can
> detect changes, comparte and evaluate visuals. Only then, maybe start designing
> the first flows and visuals.

The selected sequence is:

1. Define and implement the technical foundation.
2. Define sufficient brand basics and apply them to TailAdmin.
3. Define and establish the design/visual comparison and evaluation workflow.
4. Consider product-flow and visual design only after those prerequisites.

Do not resume the proposed first-use journey now. The accepted simple/advanced
comparison is retained; its acceptance does not override this sequence.

### User correction: finish the repository's technology decisions first

The user clarified that the important hosting/CDN decisions are already defined,
instructed the agent not to ask further questions about them, and challenged the
premature move to Keycloak and API integration while this repository's own stack
is still incomplete. The earlier broader integration/deployment queue was an
agent scope expansion; it is not a prerequisite imposed by the user.

The current phase therefore focuses on the frontend stack and code organization
inside this repository. Existing hosting definitions remain preserved and settled
for this phase. Do not initiate more hosting/CDN questions. Keycloak/session/API
integration and infrastructure/deployment implementation are deferred; they do
not gate completion of the repository stack. No provider migration is inferred
from the correction.

Already selected: Next.js/React/strict TypeScript/Tailwind with TailAdmin for the
backoffice, Astro for the landing, pnpm workspaces, pinned Node/pnpm, the code-test
stack, static outputs and the five-language preference/routing foundation.

Proposed remaining discussion topics, not adopted dependencies or requirements:

- Frontend module organization and shared-code boundaries.
- Landing styling and any framework needed for interactive components.
- Repository code conventions, formatting/lint policy and local quality commands.

The next proposed decision was React Hook Form plus Zod for backoffice forms and
schema validation, versus React/native form validation with fewer dependencies.
The supplied archive originally contains both libraries, but the approved lean
cleanup removed demo-only dependencies; their presence in the ZIP is not adoption.
The user answered “That looks good” to the recommended React Hook Form + Zod
combination. This approves the form-stack foundation and supersedes its pending
status; no product form, business rule or visual design is selected.
Primary references: [React Hook Form](https://react-hook-form.com/get-started)
and [Zod](https://zod.dev/).

### Approved form-stack implementation plan

Scope: add the selected stack to the backoffice only, without creating a generic
form framework, product route, landing dependency or feature schema. The standard
`@hookform/resolvers/zod` adapter connects the two chosen libraries; it is supporting
integration, not an alternative validation framework.

1. Official npm registry metadata checked at 2026-11-11T22:25:11Z selected React
   Hook Form 7.91.0 (published October 23), Zod 4.6.7 (October 12) and
   `@hookform/resolvers` 7.0.5 (November 8). React Hook Form 7.92.0 is too recent
   under the selected 1,440-minute waiting period. Pin the eligible versions in
   `apps/backoffice/package.json`; retain the age policy and exact script denials.
2. Before installation, add `apps/backoffice/src/test/form-stack.test.tsx` with a
   test-only string schema and fixture using retained `Field`, `FieldLabel`,
   `FieldError`, `Input` and `Button`. Verify invalid input blocks the submission
   callback and exposes the linked field error, correction allows submission,
   and large/precise string values reach the callback unchanged. The fixture's
   required-field message is only test data, not product wording or validation.
   Run the suite before the dependencies are added and inspect the actual failure.
3. Add only the three selected direct dependencies and update `pnpm-lock.yaml`
   using the pinned repo-local toolchain. Inspect mandatory/optional peer metadata,
   any build-script gate and dependency changes. Do not accept release-age
   exceptions, enable scripts or upgrade unrelated existing direct dependencies.
4. Run the complete backoffice tests, typecheck, lint and static build. Run a frozen
   install, check peers and verify other direct resolutions are unchanged. No
   application wrapper or business form is required merely to prove setup.
5. Record actual results and usage boundaries in the app/root README and agent
   guidance, update this change's proposal/tasks/context, and run strict OpenSpec
   validation plus local-link/Git-boundary checks. Do not commit or reopen hosting,
   external integration, branding or product-flow work.

### Approved UI-state default

The user answered “go with your recommendation” to React state/reducers with
scoped Context, rather than adding Zustand. STATE-001–002 record the selected
backoffice UI-state default. Use component/subtree state where it is owned, a
reducer where useful for transitions, and scoped Context when state is shared.
The existing built-in `useSyncExternalStore` subscriptions remain appropriate
browser integrations. No new store dependency, common wrapper, persisted state
or cross-device preference follows from this selection. Form state continues
through React Hook Form.

Implementation is a compatibility assessment and guidance update: retain the
existing theme/locale per-provider stores and Context, sidebar state/Context and
media-query subscription. Inspect their state and hydration boundaries, run the
existing relevant tests, and record the actual results. Do not refactor working
helpers or add a synthetic store merely to create code for this decision.
Module/package organization and landing interaction technology are separate
decisions; the subsequently approved source layout is recorded below.

## Existing constraints

- [Two products](../establish-frontend-foundation/specs/frontend-scope/spec.md):
  one repository, separate backoffice/landing deployment under different subdomains.
  The user has selected the two app directories, pnpm and Node 26 as recorded
  below. The subsequently selected hosting constraints remain settled for this
  phase; external integration is deferred.
- TailAdmin is required for the backoffice. The supplied archive is one available
  edition, not implicit approval of its framework or every dependency.
- Spanish is default; English, Catalan, Galician and Basque are also in scope.
- [Public Inventory contract](../../../../the_unnamed_2/openspec/specs/public-inventory-contract/spec.md):
  exact numeric strings, explicit field presence, full typed outcomes and supported
  capability boundaries must survive any future frontend integration. A cache or
  optimistic UI must not invent confirmed business status.
- [Identity authority](../../../../the_unnamed_2/openspec/specs/identity-authority/spec.md)
  separates membership from scoped permissions. Frontend architecture must fit
  existing authority boundaries; this change does not redesign the sibling services.
- The user's AWS Console preference is an interface reference, not an AWS hosting
  decision. No hosting provider or service follows from it.
- Siblings remain read-only; no commits are allowed.

## Observed template and source baseline

Inspected within `tailadmin-nextjs-pro-2.5.zip`, without extracting/installing it:

- `package.json` identifies TailAdmin 2.5, Next.js 16, React 19, TypeScript,
  Tailwind CSS 4, Base UI, next-intl, react-hook-form and Zod, among other demos.
- `tsconfig.json` enables strict TypeScript.
- `next.config.ts` uses next-intl, SVG loaders and template demo redirects.
- `src/i18n/routing.ts` configures English as default plus Arabic, Spanish and
  German. It does not already implement the approved product language list.
- `package-lock.json` retains root version 2.4.0 while `package.json` says 2.5.0;
  the manifest also lists different Next/ESLint-config version ranges. These
  observations call for dependency/lock verification, not an assumed install
  failure, an automatic upgrade or use of `--legacy-peer-deps` without diagnosis.

Selected framework/toolchain choices are recorded below; the template alone
does not decide them. Demo dependencies need not all become product dependencies.

## Decision queue

This queue is proposed organization of the technical discussion, not adopted
implementation. Resolve dependent items in order; unrelated details can be
researched without treating silence as approval.

| Decision                                                       | Current status                                                                                                                                                                                                              | What it enables                                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| T1 Backoffice framework/edition                                | Approved: supplied TailAdmin Next.js edition                                                                                                                                                                                | Select the actual source and relevant technical documentation                                    |
| T2 Landing stack and rendering needs                           | Approved: Astro with static output for S3/CloudFront                                                                                                                                                                        | Independent landing scaffold and deployment constraints                                          |
| T3 Repository/app/shared-package structure                     | Approved: `apps/backoffice`, `apps/landing`, pnpm workspaces; shared packages only for code actually consumed by both apps                                                                                                  | Concrete directories and independent build/dev commands                                          |
| T4 Runtime, package manager, versions and dependency policy    | Approved: Node 26 LTS and pinned stable pnpm, retain template lock initially; exact pins 26.13.1/12.18.0                                                                                                                    | Reproducible setup and updates                                                                   |
| T5 Rendering/runtime/deployment interface                      | Settled for this phase: both apps static on S3 behind CloudFront, separate private bucket/distribution per app and OAC; no further hosting/CDN questions                                                                    | Preserve the approved static-output constraints                                                  |
| T6 API/identity integration boundaries and exact data handling | Deferred by the user's scope correction; not a current stack prerequisite                                                                                                                                                   | Future integration must preserve sibling contracts                                               |
| T7 Internationalization structure                              | Approved: unprefixed backoffice with one-year host-only explicit cookie, Spanish first; landing `/`, `/en`, `/ca`, `/gl`, `/eu`                                                                                             | Locale resources and routing; exact numeric presentation remains a separate API-related decision |
| T8 Technical quality checks and development setup              | Approved: independent type/build checks, backoffice lint, Vitest + React Testing Library + jsdom; CI deployment tooling deferred                                                                                            | Code checks and reproducible local commands, separate from later visual tooling                  |
| T9 Forms and client-side validation                            | Approved: React Hook Form + Zod for backoffice forms; standard Zod resolver, TailAdmin controls and exact direct pins                                                                                                       | Typed client form state/validation foundation without product forms                              |
| T10 Local UI state and frontend/shared-code organization       | Approved: React state/reducers with scoped Context; future backoffice features in `src/features/<feature>`, routes compose them, generic TailAdmin source stays shared, workspace packages follow actual reuse by both apps | Scoped UI and source ownership without a new state library or speculative package                |
| T11 Landing styling and interactive components                 | Approved: Tailwind CSS 4 with native Astro components and TypeScript scripts for small interactions; React integration is a separate future decision                                                                        | Landing implementation foundations without brand design                                          |
| T12 Code conventions and local quality workflow                | Approved: repository-wide ESLint + Prettier, two-space/double-quote/semicolon style and root `pnpm check`; builds/browser checks remain separate                                                                            | Consistent formatting/linting and local checks; deployment automation deferred                   |

Before implementing an approved subset, add its native specs, exact file tasks,
checks and limitations. Do not add new libraries solely because they are common.
Implementation is authorized within the user's assignment once the necessary
decisions are approved; do not repeatedly request the same permission.

## First question

Ask whether to use the supplied TailAdmin Next.js edition for the backoffice or
evaluate another edition first. Recommendation: use the supplied edition to keep
its source, component conventions and setup intact. A React/Vite edition is an
alternative to evaluate if the user prefers a client-only application toolchain;
it would require inspecting that edition rather than treating this Next.js archive
as portable unchanged. Do not couple the landing framework to this answer.

### Answers and authorized initial implementation

The user answered T1: “Use the supplied Next.js edition (Recommended)”. They then
selected “Two app folders with pnpm workspaces” for T3 and the package manager in
T4. The initial recommendation of npm is superseded by the user's pnpm choice.
`ARCH-001` and `ARCH-002` record this bounded selection.

Inspection found the manifest and npm lock root dependency maps match exactly.
Their different 2.5/2.4 package version labels are metadata, not evidence of a
dependency mismatch. The source lock resolves Next 16.3.4, React/React DOM 19.2.8,
Tailwind 4.3.3, TypeScript 5.9.3 and eslint-config-next 16.0.7. Preserve this initial
dependency graph during migration and assess actual checks before proposing fixes.

Source preparation can proceed without choosing production runtime versions:
copy the selected archive to `apps/backoffice`, keep its source and npm lock as
migration input, reserve `apps/landing/.gitkeep`, and add root `package.json`,
`pnpm-workspace.yaml` and `.gitignore`. Root scripts target the backoffice directory;
do not add a landing command that pretends an undecided app exists. The provisional
root package name follows the repository name, not a final brand decision.

The supplied template stays a vendor demonstration baseline. Keep its pages,
branding and locales unchanged during source preparation; product-specific brand
configuration and flows belong to the later selected stages. Add a typecheck
script without changing application behavior. Read the installed Next.js guides
before any Next-specific adaptation. Workspace-specific bundler resolution may
need an integration change after installation; that is not a new product decision.

The next question proposes Node.js 24 LTS versus 26 LTS, with a pinned current
stable pnpm and the template dependency graph retained initially. This question
does not authorize a global runtime/package-manager installation outside the repo.

The user selected “Node.js 26 LTS + pinned stable pnpm”. Official Node release
metadata at `https://nodejs.org/dist/index.json` and npm's pnpm `latest` metadata
resolved to Node 26.13.1 (Lithium LTS) and pnpm 12.18.0. These are the initial pins,
not an instruction to track floating `latest` on subsequent installs. `ARCH-003`
records the chosen line and exact pins. Preserve the existing host runtime; use
ignored `.tools/` and `.cache/` paths for this session's bootstrap and caches.

### Initial setup plan (executed before the later lean/localization selections)

1. Safely copy the 1,502 files (11,485,120 uncompressed bytes) from the selected
   archive under `apps/backoffice`. Validate archive paths and reject symlinks/Git
   metadata. Retain the archive untouched and compare copied file hashes, allowing
   only explicitly recorded integration edits.
2. Add root `package.json` (private, exact pnpm pin, Node 26 engine, directory-targeted
   backoffice commands), `pnpm-workspace.yaml` (`apps/*`), `.nvmrc`, `.gitignore`
   (dependencies/builds/local tools/caches), and `apps/landing/.gitkeep`. No landing
   manifest is created until its framework is selected.
3. Bootstrap the official macOS arm64 Node binary inside `.tools/`, verifying its
   SHA-256 against Node's published checksum. Install the exact pnpm tool locally
   through that Node distribution's npm, with repo-local cache paths. No global
   install or host configuration change.
4. Add `typecheck: tsc --noEmit` to `apps/backoffice/package.json`. Import the supplied
   npm lock using pnpm's official import support, then verify resolved app dependency
   versions. Keep one authoritative root `pnpm-lock.yaml`; remove the extracted
   npm lock after successful migration. The original remains in the supplied ZIP.
5. Read the installed Next documentation before workspace-specific integration
   edits. Adjust bundler root only if needed for the approved monorepo, preserving
   the template's behavior and avoiding new product code.
6. Run the independent root typecheck/lint/build commands with the selected tools.
   Inspect actual errors rather than suppressing peers, lint or type checks. Run a
   local HTTP development-server smoke check; no visual baseline or browser design
   workflow is introduced before the user's stage 3.
7. Add root `README.md` with exact prerequisites and available commands, linked
   OpenSpec decisions and the reserved landing status. Record actual results and
   source differences here. Check a frozen lock install and native OpenSpec before
   reporting. No commits, deployments or production-flow claims.

### Selected Astro landing subset

The user answered T2: “Astro for the landing page”. The recommendation to reuse
Next.js there is superseded. Official npm metadata initially resolved Astro 7.4.11
and its standard checker `@astrojs/check` 0.9.12. After the user's waiting-period
decision below, the eligible Astro pin is 7.4.10. A minimal strict TypeScript scaffold uses
the template's existing TypeScript 5.9.3 baseline rather than introducing another
compiler version. The checker is the standard Astro check command support, not
a selected visual/end-to-end testing framework.

Add `apps/landing/package.json`, `astro.config.mjs`, `tsconfig.json` and an empty
`src/pages/index.astro` document with Spanish language metadata. Remove the reserved
`.gitkeep`. Use Astro's default build capabilities without choosing a server
adapter, CMS, hosting provider, styling system or final rendering policy. Root
`dev:landing`, `build:landing`, `preview:landing` and `typecheck:landing` target this
app independently. Root ignores also cover Astro's generated `.astro/` and `dist/`.
Verify `astro check`, build and a local HTTP development-server response. No
marketing copy, landing design, final brand assets or product flows are included.

### Dependency-install decisions and evidence

The first install stopped with `ERR_PNPM_IGNORED_BUILDS` for three native-tooling
scripts. It had also automatically added four release-age exceptions for Astro
7.4.11 and three recently released Astro packages. These automatic edits were not
treated as user approval. Optional `@tanstack/react-table` agent skills remained
pending; no dependency-provided skills were approved or installed.

The user selected “Use versions that meet the waiting period (Recommended)”. The
pnpm default waiting period is 1,440 minutes. Enforce it explicitly with strict
resolution and no exceptions. Official npm publication timestamps checked at
2026-11-11T20:19:55Z identified Astro 7.4.10 (published 2026-11-10T20:11:04Z) as the
latest stable Astro 7 release satisfying that period. Re-importing with that pin
preserved all 47 backoffice direct dependency versions.

After the user asked whether script approval was safe, inspect the scripts and
verify the installed bindings without running them. Parcel watcher and unrs
resolver loaded, and SWC's binding returned `aarch64-apple-darwin` under Node 26.
This is evidence of local binding availability, not a safety audit or proof of
all-platform operation. One initial SWC probe used a function on the wrong export;
the corrected probe used its actual `binding.js` API.

The user then selected “Keep the three scripts blocked (Recommended)”. Record
exact-version denials for `@parcel/watcher@2.6.0`, `@swc/core@1.16.1` and
`unrs-resolver@1.12.2`; keep other unreviewed scripts subject to pnpm's review
gate. `ARCH-005` records this choice. The subsequent frozen install passed under
the selected age and build-script settings without executing those scripts.

The bootstrap pnpm package was initially installed with lifecycle scripts skipped.
Its version probe stalled in restricted execution; the native binary returned
12.18.0 outside that restriction. Running pnpm's own inspected installer completed
its repo-local native launcher links. No pnpm downgrade, global install or blanket
dependency-script permission was used.

### Workspace-specific source adjustments

The installed Next guide states that Turbopack does not resolve files outside its
root. The pnpm store is at the repository level, so `apps/backoffice/next.config.ts`
sets its Turbopack root to the repository root. The source's SVG rules remain.
The independent typecheck command uses the documented `next typegen && tsc --noEmit`
sequence to generate route and `next-env` declarations before checking a fresh tree.

### Selected localization subset

The user selected “Shared backoffice URLs; localized landing URLs (Recommended)”
and “Spanish first; remember explicit choices (Recommended)”. The earlier vendor
four-language/default-English configuration is superseded for the actual lean app.

Implement the selected source changes:

- `apps/backoffice/src/i18n/routing.ts`: the five approved codes, Spanish default,
  `localePrefix: never`, no browser language detection and a named host-only locale
  preference cookie. The user's subsequent “One year (Recommended)” selects 365
  days/31,536,000 seconds. Use root path, SameSite=Lax, Secure in production and
  no Domain attribute; no account/cross-device preference is implied.
- `src/proxy.ts`: validate the explicit cookie against the closed locale list and
  supply that request's chosen default to next-intl. Disable the middleware's own
  automatic cookie synchronization so it cannot record an inferred first-visit
  preference from browser headers. Keep locale-cookie support in navigation for
  a later explicit selection control. Prevent shared caching of cookie-dependent
  documents; the server-rendered baseline uses request-time rendering as described
  in verification below. Static hosting requires a different implementation.
- `src/i18n/languages.ts`: update locale metadata/autonyms and directions for the
  five languages. Do not design a picker or assign new flags.
- Retain only shell/common/not-found message resources, remove the old Arabic/German
  vendor resources and add Catalan/Galician/Basque resources. These are initial
  framework labels, not a claim of reviewed business-feature translations. Future
  primitive/content coverage and linguistic review remain part of subsequent work.
- `apps/landing/src/i18n/locales.ts` and `astro.config.mjs`: configure the same five
  codes, default Spanish and no default-language URL prefix.
- Share an empty technical document layout between `src/pages/index.astro` and
  `src/pages/[locale]/index.astro`; generate only `en`, `ca`, `gl`, `eu` under the
  dynamic locale path. No new visible landing design, CMS or hosting assumption.
- Verify the real backoffice HTTP language/resource results with/without valid
  cookies and with a conflicting browser header. Check generated landing HTML
  paths/language attributes, then type-check/build the changed apps. Do not add
  implementation-mirroring tests for simple locale constants.

Source references: [next-intl request routing](https://next-intl.dev/docs/routing/middleware),
[routing configuration](https://next-intl.dev/docs/routing/configuration), and
[Astro i18n routing](https://docs.astro.build/en/guides/internationalization/).
The installed next-intl middleware's `syncCookie` was also read: even when browser
negotiation is disabled, automatic synchronization can set a cookie when browser
headers differ. The per-request synchronization override prevents that inference.

This affects these two frontend apps only. No sibling Keycloak, email or other
identity-language configuration is changed or claimed complete.

### Lean backoffice and code-test decisions

The user selected “Lean TailAdmin app; full ZIP as reference (Recommended)”. The
full demo built 407 pages and passed typechecking, but its supplied source had
11 lint errors. The initial 1,101 warnings included 1,090 warnings from two
prebuilt MapLibre distribution files. Excluding those third-party generated
bundles from lint left 11 source errors and 11 source warnings; no source rule
was disabled. A cookie-aware HTTP probe also observed a redirect loop at the
unmodified demo's root; do not claim its dev server smoke check passed.

Implement the selected lean scope as follows:

- Retain the default TailAdmin shell geometry, shared UI primitives, icons, theme
  context, hooks, utilities and required i18n support. Keep the supplied ZIP as the
  complete reference. No final shell/brand/navigation design is inferred.
- Replace the demo dashboard route with an empty technical entry within the same
  shell. Remove demo routes, fake account/notification widgets, demo navigation
  and promotional widgets. Keep only sidebar/header structure and theme/sidebar
  controls; no business flow or module navigation is invented.
- Retain generic framework not-found handling and its required common assets.
  Keep only source files needed by the shell/primitives and their import closure;
  remove demo-only libraries and assets. Check hashes against the source ZIP
  before deleting copied source, preserving any unrecognized local edits.
- The original vendor locale baseline was retained during cleanup, then superseded
  by the five-language localization selection above.
- Add code-level tests only after the requested stack choice is answered. Use
  behavior tests for the retained stateful shell helpers before changing them to
  resolve lint. Preserve theme preference, mobile breakpoint and route-change
  behavior; do not create screenshot baselines or product-design tests here.
- Re-run focused lint/type/test checks, both builds, frozen installation and local
  HTTP smoke checks after cleanup. The existing full-demo build is not evidence
  that the cleaned app passes.

The code-test question recommends Vitest, React Testing Library and jsdom with
Next's documented supporting React/path plugins. Async Server Component/browser
coverage remains outside that runner; the later visual workflow is still open.

The user selected “Use Vitest + React Testing Library (Recommended)”. The initial
Next guide suggested React/path plugins. The installed Vite supports native
`resolve.tsconfigPaths: true`; its deprecation warning led to removal of the
unnecessary `vite-tsconfig-paths` plugin. Exact development pins are Vitest 5.1.0,
React Testing Library 16.3.3, DOM Testing Library 10.4.2, jsdom 31.0.0 and React
plugin 6.3.0. Node types were aligned to 26.6.6 after Vitest's peer requirements
rejected the vendor Node 20 types. No peer requirements were suppressed.

Add `apps/backoffice/vitest.config.mts`, `src/test/setup.ts`, a test-only media-query
helper, and colocated behavior tests for `use-mobile`, `theme-context` and the
sidebar provider. Add the root `test:backoffice` command. First establish behavior
coverage and observe existing failures (including invalid/unavailable theme storage)
before refactoring retained state helpers. Tests cover observable mode, DOM class,
storage, breakpoint and route changes; no snapshot/image approval is implied.

### Selected static hosting and implementation plan

Asked whether to use portable Docker/static artifacts or select hosting first,
the user answered: “I will use AWS Cloudfront with an S3 bucket as origin”. This
selects the hosting direction; Docker was not approved. The user then selected
“Both apps static on S3 (Recommended)”, including Next.js static export with
browser-managed locale preference. No server origin is selected. The user also
selected “Neutral loading state, then chosen language (Recommended)” to avoid
briefly showing Spanish before a remembered language.

The Astro build already produces static documents. The previous backoffice
server-cookie implementation cannot run unchanged on S3. The following approved
adaptation supersedes request-time rendering without changing the selected
framework, shared URLs, Spanish-first rule, language list or cookie retention:

1. Set `output: export` and disable the server image optimizer in
   `apps/backoffice/next.config.ts`; retained assets are static SVGs. Remove the
   next-intl server plugin, `src/proxy.ts` and `src/i18n/request.ts`.
2. Replace the internal `[locale]` route hierarchy with `src/app/layout.tsx`,
   `src/app/(admin-layout)/{layout,page}.tsx` and `src/app/not-found.tsx`. Remove
   the server catch-all. Keep the existing shell and generic error reference;
   no dynamic business routes or universal SPA fallback are invented.
3. Replace the server routing configuration with `src/i18n/configuration.ts`;
   `src/i18n/navigation.ts` re-exports ordinary Next navigation at shared URLs.
   `src/i18n/languages.ts` keeps the approved locale metadata.
4. Add `src/i18n/locale-provider.tsx`: a per-provider client store reads only the
   explicit cookie, validates the closed locale list, defaults to Spanish and
   never inspects browser languages. Before hydration it renders a neutral,
   semantic busy placeholder with no new designed spinner or copy. After reading
   the preference it supplies the matching messages and document language.
   A future explicit control can update the in-memory locale and write the
   one-year, root-path, SameSite=Lax, host-only cookie (Secure in production).
   Blocked cookie access falls back safely; persistence failure is not reported
   as successful. Do not add a visible picker.
5. Write behavior tests in `src/i18n/locale-provider.test.tsx` before the provider:
   Spanish-first despite browser language, all five remembered choices, invalid
   or blocked cookie fallback, no inferred cookie write, explicit switching and
   one-year host-only attributes, persistence failure and hydration without a
   Spanish-content flash. Keep the existing shell tests.
6. Replace the invalid `next start` command with a clearly named local static
   preview command using `scripts/preview-static.mjs` and built-in Node HTTP/file
   APIs, without a new dependency. Serve only files within the selected output,
   correct content types and a real 404; this tool does not model CloudFront.
   Update root/app scripts, README and agent guidance with the actual outputs
   `apps/backoffice/out` and `apps/landing/dist`.
7. Run red/green tests, lint/type checks and both builds. Inspect the exported
   artifact for absence of locale-prefixed entries/server requests and smoke-test
   the static HTML, CSS/JS, supplied images and missing-file responses. Cookie
   behavior is client-component/hydration coverage; do not claim a browser or
   deployed CloudFront check.

### Selected origin access and product isolation

The user answered “yes” to: “I recommend private S3 origins accessible through
CloudFront using OAC. Is that your intended setup?” They then selected “Separate
bucket and distribution per app (Recommended)” instead of sharing a bucket with
app prefixes. These are approved definitions, recorded in HOST-003–004.

Each product therefore has its own private S3 origin and CloudFront distribution.
CloudFront origin reads use OAC and a distribution-scoped bucket policy; visitors
cannot fetch these objects through public direct S3 access. AWS's OAC requirement
uses regular S3 bucket origins, not S3 website endpoints. This is an origin-access
boundary; merchant identity and API authorization remain the separate T6 decision.
Provisioning settings and checks will follow the selected infrastructure tooling;
this documentation update does not create resources or prove deployed access.

Resource names, accounts, regions, environment count, domains, certificates,
cache policy, deep-link mapping and deployment automation remain undecided.
Static build success alone does not select those policies or authorize deployment.

Primary sources: [Next.js static export and unsupported server features](https://nextjs.org/docs/app/guides/static-exports)
and [CloudFront S3 origin access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
Private S3 with OAC and separate bucket/distribution pairs are now selected.
No AWS resources have been read or changed.

## Historical visual workflow candidate

At this technical-foundation stage, Playwright was a candidate. The subsequent
selection and implementation are owned by the linked visual change. Its official
[visual comparison documentation](https://playwright.dev/docs/test-snapshots)
supports screenshot baselines and subsequent comparisons, and requires consistent
rendering environments for useful comparisons. Visual difference detection does
not by itself establish design quality; human evaluation and baseline acceptance
will need an explicit workflow in stage 3. No visual test installation or baseline
generation occurs at this stage.

Other checked primary sources:

- [TailAdmin Next.js setup](https://tailadmin.com/docs/installation/nextjs)
  corroborates the edition's Next.js/Tailwind foundation. The user's paid archive
  remains the relevant implementation source, rather than the public free edition.
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
  describes static output and its constraints; choosing Next.js alone does not
  select a server runtime or hosting provider.

## Verification

The approved source/workspace/test/localization/static-output subset is implemented.
The repository technology foundation remains open for its local stack decisions
above. Hosting is settled for this phase; identity/API integration and deployment
work are deferred and do not block those decisions.

### Server-rendered baseline (superseded by the static hosting selection)

- Source preparation safely copied and hash-compared all 1,502 archive files.
  The lean cleanup removed 1,257 unchanged copied files and 23 demo-only direct
  dependencies after source comparison. Both supplied ZIPs remain untouched.
- The initial lock migration preserved all 47 original direct dependency versions.
  The final lock reflects the approved lean removal, eligible Astro pin and test
  tooling. Frozen install and peer checks passed with all three native scripts
  denied; the release-age exception list is empty.
- Theme tests first produced 2 failures and 8 passes: invalid stored mode and
  unavailable storage exposed actual source behavior. The provider now validates
  stored values, tolerates blocked storage and preserves restored state through
  hydration. Mobile and sidebar helpers preserve observable breakpoint/navigation
  behavior. All 10 tests in 3 files pass; source lint reports no errors or warnings.
- After demo routes were removed, stale generated `.next` validators caused an
  initial typecheck failure. Removing only generated output and regenerating route
  declarations resolved it. Both app type checks pass; Astro reports no errors,
  warnings or hints. Both production builds pass.
- The development redirect loop was traced to this smoke test's `127.0.0.1` server
  binding versus Next's normalized `localhost` rewrite URL. Changing only the Host
  header did not resolve it; binding the server to `localhost` did. Diagnostic
  logging was removed and HTTP 200 rechecked. A raw Node middleware probe also
  failed on Next's extensionless ESM import outside the framework; this was not
  treated as an application failure or bypassed in production code.
- Production HTTP inspection found cookie-selected documents initially returned
  `s-maxage=31536000`, while Next's final response omitted the proxy's attempted
  `Vary: Cookie`. The installed Next `connection()` guide was read; the locale
  layout was changed to wait for a request without generating static locale params.
  The ineffective Vary append was removed. The rebuilt server returns
  `private, no-cache, no-store, max-age=0, must-revalidate`.
- Seven production HTTP cases pass: no preference plus English browser, all five
  explicit cookies with conflicting browser headers, and an invalid cookie.
  Each keeps `/`, renders the expected HTML language and shell label, emits no
  inferred preference cookie and prevents shared caching. The five built Astro
  entries have matching language attributes and empty bodies.
- These are local code/build/HTTP checks, not a browser/screenshot or linguistic
  review. There is no independent review, real API/session integration, AWS
  deployment, accepted branding, product flow, commit or OpenSpec archive.

Final checks: native `openspec validate --all --strict --no-interactive` passed
all three changes. Local-link checking covered 19 Markdown files and 46 links
without missing paths. Source comparison found 222 untouched original files,
20 changed original files and 1,260 original paths absent (including later locale
and extracted-lock removals beyond the initial lean cleanup). Both archive sizes
and modification timestamps match the recorded baseline. The Git index is empty
and history contains zero commits. Temporary smoke-test servers were stopped.
These source counts and HTTP results describe the baseline before the route moves
and server removal below.

### Static-hosting adaptation (current)

- The selected neutral initialization behavior is implemented in `LocaleProvider`.
  The new suite initially failed to load before the module existed; a minimal
  Spanish-only provider then exposed 8 actual failing assertions with 13 tests
  passing across the suite. Browser preference handling resolved those failures.
  A production Secure-attribute check brings the final result to 22 passing tests
  in 4 files, including real DOM hydration from a neutral document into the stored
  language without recoverable hydration errors. No visible picker was added.
- Both static production builds, both type checks and backoffice lint pass.
  Fresh generated Next declarations contain the moved routes; no stale generated
  validators or server locale hierarchy remain in the source. The frozen lock
  install passes with the same script denials and release-age policy.
- `apps/backoffice/out` contains the static root and not-found outputs; the Next
  manifest contains no proxy functions. There are no locale-prefixed backoffice
  entries. The exported visible body is a neutral busy placeholder until browser
  initialization. `apps/landing/dist` retains the five locale documents.
- The local built-in Node static preview passed root/HEAD checks and byte-for-byte
  responses with correct content types for all 28 generated JS/CSS/SVG/font/icon
  assets. Five missing/unsupported paths returned 404, including a missing JS
  asset and the removed server image endpoint; no universal success fallback was
  added. The preview's no-store header is only a local development behavior, not
  a selected CloudFront cache policy.
- Client logic/hydration tests and static HTTP checks do not establish actual
  browser rendering, JavaScript-disabled usability, AWS configuration or deployed
  routing behavior. The backoffice requires JavaScript. No AWS resources, Docker
  image, deployment, commit, branding or product flow were created.

Final adaptation checks covered 20 Markdown files and 46 local links, with no
missing paths. Source comparison found 218 untouched original paths, 17 changed
original paths and 1,267 original paths absent after cleanup/server-route moves;
new static routes and locale support are additional files. Archive sizes and
modification timestamps remain unchanged. The Git index is empty with zero
commits, and the temporary preview was stopped. The strict OpenSpec check caught
an overlong localization requirement; its wording was shortened without changing
meaning, then validation was repeated. Remaining decisions stay open in
[tasks.md](tasks.md).

### Origin-access and isolation decision checks

HOST-003–004 and the matching proposal, context and README now record the user's
OAC and per-app bucket/distribution choices. Native strict validation passed all
three changes. Link checking covered 20 Markdown files and 46 local links without
missing paths, and the hosting requirement IDs are unique. The Git index remains
empty with zero commits. This update changes documentation only; application
checks were not repeated, and no AWS credentials, resources or live policies were
accessed or changed. Deployed origin access remains unverified.

### Repository-stack scope correction checks

The latest user correction is reflected in ARCH-006, the active decision queue,
tasks, proposal, root/app agent guidance, README and OpenSpec context. Hosting/CDN
questions are closed for this phase; external integration/deployment tasks no
longer gate the repository stack. The proposed local stack choices remained
unapproved at that checkpoint; the subsequent form choice is recorded above.
Strict native validation passed all three changes; 20 Markdown files
and 46 local links were checked without missing paths. No application dependencies
or runtime behavior changed, so application tests were not repeated. The Git index
is empty and history contains zero commits.

### Approved form-stack verification

- Installed exact backoffice dependencies: `react-hook-form@7.91.0`, `zod@4.6.7`
  and `@hookform/resolvers@7.0.5`. The skipped React Hook Form 7.92.0 was published
  at 2026-11-11T10:45:48Z, less than 24 hours before the metadata check. No release-age
  exception or new script permission was added. The resolver's only mandatory
  peer is compatible React Hook Form; other validation-library peers are optional.
- Before installation, the new fixture suite could not resolve the missing Zod
  resolver, while the existing 22 tests passed. After installation, all 26 tests in
  5 files pass. The four fixture cases use real retained TailAdmin controls and the
  selected libraries, covering invalid submission/error association/focus,
  correction and unchanged large/precise/trailing-zero string values. No business
  schema or global form abstraction was created.
- Backoffice lint, explicit typecheck and static build pass. The frozen install
  with strict peer checking passes under the existing 1,440-minute age policy and
  three exact script denials. The existing ESLint deprecation warning remains;
  no unrelated upgrade was added to silence it.
- Every pre-existing direct dependency specifier and base resolution is unchanged.
  The lock added the form/resolver packages and `@standard-schema/utils@0.3.0`;
  Zod 4.6.7 already existed elsewhere in the graph. pnpm unified compatible Zod
  4.6.5 references to 4.6.7 and existing Node-type peer snapshots to the already
  selected Node 26 types, removing Node 20/undici type entries. Because this also
  changes the landing's shared compiler dependency snapshots, its build and type
  check were repeated and pass. Its direct manifest has no form dependencies.
- The synthetic form fixture is absent from the static output. Archive sizes and
  modification timestamps are unchanged. Root/app usage guidance and OpenSpec
  context now describe the approved stack and its limits. Strict native OpenSpec
  validation passed all three changes; 21 Markdown files and 47 local links were
  checked without missing paths. The index is empty and history has zero commits.

The user subsequently approved React's built-in state/reducers with scoped
Context. The selected scope and assessment are recorded above. No separate store
library or new persistence behavior is selected or installed.

### UI-state compatibility assessment and checks

The existing theme and locale helpers use per-provider state, scoped Context and
React's browser subscription hook. Sidebar state is owned by `SidebarProvider`
and shared through its Context. The mobile helper subscribes to the media-query
boundary through `useSyncExternalStore`. The form fixture uses React Hook Form.
These fit STATE-001–002 without a new runtime abstraction or source refactor.

All 22 relevant state/hydration tests in four existing files pass. Native strict
OpenSpec validation passes all three changes, and 22 Markdown files/48 local
links were checked without missing paths. Neither app declares an added global
state library. No manifest, lockfile, runtime source or persistence behavior was
changed for this decision; builds/type checks were not repeated for this
documentation-only update. The Git index is empty and history has zero commits.

### Approved frontend code organization

The user selected “Feature folders with shared code added when reused
(Recommended)” in response to the proposal below. ARCH-007–008 record this choice.
Group future backoffice feature code in
`apps/backoffice/src/features/<feature>` so each feature can keep its components,
hooks, schemas and tests together. Keep `src/app` for route composition and the
retained generic TailAdmin primitives/shell in their existing shared locations.
Keep the two apps independent, and introduce a workspace package only when code
has consumers in both apps. Continuing to organize all feature code solely in
top-level technical-layer folders was the alternative presented, not the selected
approach.

This selects source ownership, not a list of product modules or a new framework.
The source
[Next.js organization guide](https://nextjs.org/docs/app/getting-started/project-structure)
and the installed guide permit flexible organization; the user's answer is the
authority for this choice.

### Code-organization implementation plan

This is a documentation and compatibility subset: there are no product features
or actual shared-package consumers to migrate yet.

1. Add ARCH-007–008 and the answer/decision above in this change's architecture
   spec and design. Update the proposal and task status to distinguish this
   resolved choice from landing styling and code conventions, which remain open.
2. Update root/app `AGENTS.md`, root `README.md` and `openspec/config.yaml` with
   the selected feature ownership and actual-reuse boundary. Preserve retained
   generic source paths and the two independent app commands. Do not create a
   placeholder feature, package, route, new dependency or lint-boundary mechanism.
3. Inspect the source/manifests to confirm this foundation needs no migration.
   Run strict native OpenSpec validation, check local documentation links and
   verify an empty Git index/history. No app build, screenshot update or test-only
   behavior is needed for this documentation-only subset. Record actual results.

### Code-organization implementation and checks

The current foundation has only the shared shell/primitives/infrastructure and
technical routes; neither `src/features` nor a shared `packages` directory is
needed yet. The selected ownership rules are now in ARCH-007–008, the root/app
agent entry points, README and OpenSpec context. No runtime source, manifest,
lockfile, route, dependency or screenshot reference was changed.

Strict native OpenSpec validation passed all four changes. Twelve relevant
Markdown files and 34 local links were checked with no missing targets. The Git
index is empty and history has zero commits. Builds and application tests were
not repeated for this documentation-only subset.

### Approved landing styling and interaction choice

The user selected “Tailwind 4 + native Astro/TypeScript (Recommended)”. Use
Tailwind CSS 4 with native Astro components and TypeScript scripts for
small interactions. This keeps the styling technology familiar across the two
apps without importing the dashboard or selecting common branding. A React
integration remains a separate future choice if a concrete component needs it.
The alternative presented was Astro's scoped CSS plus native TypeScript, with
fewer styling dependencies. ARCH-009 records the selected approach.

Primary technical inputs: Astro's
[styling guide](https://docs.astro.build/en/guides/styling/) documents the Tailwind
Vite plugin and scoped CSS; its
[scripts guide](https://docs.astro.build/en/guides/client-side-scripts/) documents
TypeScript scripts and browser events. These describe supported mechanisms,
not approval of any particular landing component/design.

### Approved repository quality choice

The user selected “Repo-wide ESLint + Prettier and pnpm check (Recommended)”.
Extend the existing tools across both apps and repo tooling. Use two-space
indentation, double quotes and semicolons, keeping existing strict TypeScript and
component naming guidance. The aggregate command includes formatting, lint, type
checks and code tests; builds and browser/visual checks retain separate commands.
CODE-003–004 record this selection. No Git hook, CI or deployment automation is
selected by this local workflow.

### Landing and quality implementation plan

1. Preserve the current lock, authored source and latest candidate-capture
   manifest under ignored `.cache/` paths for dependency/diff inspection. Leave
   paid ZIPs and siblings untouched. Stop only this session's owned visual
   preview while replacing its artifacts.
2. Pin landing development dependencies `tailwindcss` and `@tailwindcss/vite`
   at 4.3.3, matching the retained backoffice Tailwind version. Official registry
   metadata confirms their July 16 publication and the plugin's Vite 8-compatible
   peer range. Add `vite.plugins` in `apps/landing/astro.config.mjs`, import a
   minimal `src/styles/global.css` from `src/layouts/foundation.astro`, and retain
   empty bodies on the five routes. Limit Tailwind source scanning to landing
   `src`. Do not add a palette, font, shared design package or sample interaction.
3. Declare root quality tools with exact compatible pins: ESLint/@eslint/js
   9.39.5, typescript-eslint 8.69.0, globals 16.4.0, Prettier 3.9.6 and the retained
   Tailwind Prettier plugin 0.8.1; add eslint-plugin-astro 1.7.0 and
   prettier-plugin-astro 1.1.2. Astro lint plugin 1.7 supports the retained ESLint
   9 line; its later major versions require ESLint 10. The formatter's peer range
   supports Prettier 3.9.6. Retain unrelated resolutions and the 1,440-minute age
   policy with all four exact script denials; review any new script gate rather
   than enabling it automatically.
4. Add root `.editorconfig`, `.prettierrc.json`, `.prettierignore` and
   `eslint.config.mjs`, and `apps/landing/eslint.config.mjs`. Centralize the
   backoffice's existing formatter configuration at root, preserving its
   `cn`/`cva` sorting and app stylesheet path. Load the Astro formatter before
   the Tailwind formatter, with separate app stylesheet overrides. Use ESLint's
   recommended JS/TypeScript and framework rules; ignore generated/build/cache,
   dependency, archive and third-party asset paths. Keep the backoffice's Next
   configuration. Add root `format`, `format:check`, `lint`, `lint:tooling`,
   `lint:landing`, `typecheck`, `test` and `check` commands plus landing lint.
5. Apply the formatter to authored source/docs/tooling and inspect its diff
   against the saved source, especially class strings. Resolve actual lint
   findings without inventing product behavior. For this configuration subset,
   verify the real commands and build artifacts instead of adding tests that
   merely repeat config entries. Check `pnpm check`, a frozen strict-peer install,
   independent app and catalogue builds, five empty landing bodies with compiled
   Tailwind CSS, retained dependency resolutions, fixture exclusion and archives.
6. Refresh visual build fingerprints and the owned previews. Run the existing
   language browser checks and capture matrix; compare new candidate images
   against the preceding candidate run to investigate unexpected rendering changes.
   Do not promote any screenshot reference. Update root/app guidance, README,
   proposal/tasks/context with actual results, then validate native OpenSpec,
   local links and empty Git index/history. Branding and product flows remain
   outside this implementation.

### Landing and quality implementation results

The landing now uses Tailwind and its Vite plugin at 4.3.3, with the stylesheet
loaded from the shared document layout. All five normal build entries retain
their correct `lang`, empty bodies and no client scripts; each loads the compiled
Tailwind stylesheet. No React integration, brand tokens, product content or
interaction component was added. The normal outputs contain none of the checked
catalogue/visual-fixture markers.

Root ESLint/Prettier/editor configuration and local commands cover both apps and
tooling. The initial format check detected 30 files; the formatter normalized
authored source/docs without modifying third-party assets or paid archives. The
backoffice source diff contains formatting and class ordering, with no changed
logic. `pnpm check` passed formatting, lint, three type-check targets and all
42 code tests (26 backoffice, 16 visual-tooling units). Both apps and both
catalogues built through `pnpm visual:prepare`; coverage remains 216 source
modules, 50 stories, 21 view entries and 92 scenarios.

Independent review then reproduced a client-script TypeScript parse failure in
the initial Astro lint configuration: the plugin's optional parser auto-detection
does not resolve the transitive parser through pnpm's dependency boundaries.
The app now explicitly selects `astro/client-side-ts` and the TypeScript parser
for virtual script files. A typed browser-event fixture failed before the fix
and passes afterwards; unused frontmatter/client-script variables and malformed
TypeScript still fail their expected lint diagnostics. The reviewer independently
rechecked the fix and reported no remaining critical or important findings.
These probes use stdin/ignored evidence; no product route or sample component was
created. Fresh aggregate validation after this correction passes all included
formatting/lint/type checks and all 42 code tests.

Strict-peer installation and a frozen-lock install passed. Existing direct
specifier/base versions are unchanged; only optional-peer snapshot suffixes for
the Tailwind formatter and Astro check gained the selected Astro formatter.
No release-age exception or script permission was added. All four exact script
denials remain intact. Supplied archive sizes and modification timestamps are
unchanged. ESLint 9's existing deprecation notice and vendor build warnings remain;
this work does not silently upgrade the vendor's lint/framework baseline.

All nine language browser regressions pass. Candidate run
`2026-11-12T13-05-47.261Z` contains all 368 expected cases with zero failures,
skips or retries, for source fingerprint
`d44a5aa085cd8370129102f81ae2ea264acc549cbfcf67cf1dbd728073d1f5f5`.
Against preceding candidate run `2026-11-12T11-30-05.520Z` in the same renderer,
366 images are byte-identical. The two differing tablet images (component card
and filled input) pass Playwright's own comparator at the approved threshold
0.01 and maxDiffPixels 0. This is a candidate-to-candidate regression check, not
visual acceptance. The reference registry remains empty.

Evidence is in ignored `.cache/repository-foundation-*` logs/JSON, including
`check.log`, `prepare.log`, `languages.log`, `capture.log`,
`candidate-comparison.json`, `dependency-diff.json`, `artifact-proof.json` and
`astro-ts-{red,green}.json`. Strict OpenSpec validation passes all four changes;
27 Markdown files and 62 local links have no missing targets. The Git index is
empty and history has zero commits. No files in the sibling repositories were written and no
commit, deployment or screenshot promotion was performed.

The user subsequently approved all 368 images from the named review run. The
[visual change](../define-visual-review-workflow/proposal.md) records their
separate promotion and verification; the empty-registry statements above describe
this technical implementation's earlier verification state.
