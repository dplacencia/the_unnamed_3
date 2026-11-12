# Frontend workspace

Technical decisions and current work live in
[OpenSpec](openspec/changes/establish-frontend-technical-foundation/proposal.md).
Agents start with [AGENTS.md](AGENTS.md).
The selected [visual review workflow](visual/README.md) uses Storybook for retained
backoffice components, Astro-native previews and Playwright on this Mac. Candidate
captures require explicit review before becoming accepted references.

## Toolchain

Use Node.js **26.13.1** (`.nvmrc`) and pnpm **12.18.0** (`packageManager`).
With those tools on `PATH`, run from this repository root:

```sh
pnpm install --frozen-lockfile --store-dir .pnpm-store --cache-dir .cache/pnpm
```

The selected release waiting period and dependency-script decisions are in
`pnpm-workspace.yaml`. Keep the existing release waiting period and script policy.
The user explicitly selected blocking `esbuild@0.28.2`'s install script, alongside
the three existing exact-version denials. Its supplied native binary works with
the script blocked. Visual comparison uses the approved colour threshold **0.01**
with **maxDiffPixels 0**; reference acceptance still requires specific user review.

This agent session bootstrapped tools into ignored `.tools/` paths, preserving
the host toolchain. On this macOS arm64 checkout, those local tools can be selected
for the current shell with:

```sh
export PATH="$PWD/.tools/node-v26.13.1-darwin-arm64/bin:$PWD/.tools/pnpm/node_modules/.bin:$PATH"
```

## Independent apps

| App               | Foundation                                                                | Commands                                                                  |
| ----------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `apps/backoffice` | Lean TailAdmin Next.js shell and reusable UI primitives                   | `pnpm dev:backoffice`, `pnpm build:backoffice`, `pnpm preview:backoffice` |
| `apps/landing`    | Astro + Tailwind 4, native components/TypeScript, empty technical entries | `pnpm dev:landing`, `pnpm build:landing`, `pnpm preview:landing`          |

Both apps target static files in S3 behind AWS CloudFront, with independent
deployment boundaries. The backoffice exports to `apps/backoffice/out`; Astro
builds to `apps/landing/dist`. Neither output requires a deployed Node/Next server.
`preview:backoffice` serves the built files on localhost:3100; it accepts `--port`
and returns real missing-file responses rather than a universal SPA fallback.
The preview is a local check, not a CloudFront emulator.

Each app has a separate private S3 bucket and CloudFront distribution. Origin
reads use OAC and a distribution-scoped bucket policy, with regular S3 origins
rather than website endpoints. Resource names, environments, domains, deep-link
mapping, CDN cache policy and deployment automation remain open. No Docker
packaging or AWS resources have been created.
The current phase completes this repository's own stack: forms/validation, local
UI state and code organization, landing styling/interactivity and code conventions.
Hosting/CDN choices are settled for this phase. External authentication/API
integration and infrastructure/deployment work are deferred; details live in OpenSpec.
The three remaining repository choices are now selected: feature organization,
landing styling/interactivity and shared quality conventions. Their implementation
and verification are tracked in OpenSpec. Brand configuration and product flows
still require separate decisions.

## Languages

Both apps are configured for Spanish, English, Catalan, Galician and Basque.
Backoffice URLs are shared across languages. Spanish appears without a valid
explicit preference; browser language headers do not select the UI language.
The host-only `NEXT_LOCALE` cookie is configured for 365 days, root path,
SameSite=Lax and Secure in production. A language picker has not been designed;
the configured preference does not imply an account or cross-device setting.
The browser reads the preference after a neutral loading state, then supplies
the chosen messages and document language. The same static files serve every
preference. JavaScript is required for the backoffice. Future explicit selection
can update the cookie through `useLocalePreference`; unavailable persistence is
reported to the caller. No visible language picker or loading design is included.

The empty Astro technical entries are `/` (Spanish), `/en`, `/ca`, `/gl` and `/eu`.
Only initial framework labels exist; business content and identity/email
translations are outside this implementation.

## Backoffice forms

The approved form stack is React Hook Form **7.91.0**, Zod **4.6.7** and
`@hookform/resolvers` **7.0.5**. Use `zodResolver` from `@hookform/resolvers/zod`
with the retained TailAdmin controls. These dependencies belong to the backoffice;
the landing has no form-stack dependencies.

The [form specification](openspec/changes/establish-frontend-technical-foundation/specs/frontend-forms/spec.md)
records the scope. The synthetic integration fixture in
`apps/backoffice/src/test/form-stack.test.tsx` checks field/error wiring and exact
string submission; it is not a product form or feature schema. Product validation,
error wording, interaction design and any reusable abstraction need their own
approved feature basis. Do not implicitly coerce or normalize exact business values.

## Backoffice UI state

The approved default is React state/reducers with scoped Context. Keep local state
with its owning component/subtree and share it through Context where needed.
Existing browser subscriptions use `useSyncExternalStore`; form state stays with
React Hook Form. The current shell fits this approach without a state migration
or additional library. See the
[UI-state specification](openspec/changes/establish-frontend-technical-foundation/specs/frontend-ui-state/spec.md).
This selection adds no new persistence behavior or product state.

## Code organization

Future backoffice features live in `apps/backoffice/src/features/<feature>`,
keeping their components, hooks, schemas and tests together where applicable.
`src/app` composes routes from feature code and the shared shell. Generic
TailAdmin primitives and shared app infrastructure keep their existing locations.

The apps stay independent. Introduce a shared workspace package only for code
actually consumed by both apps; one app's own code stays within that app. There
are no product features or shared packages to create or move in the current lean
foundation. See the
[architecture specification](openspec/changes/establish-frontend-technical-foundation/specs/frontend-architecture/spec.md).

## Landing styling and interactions

The landing uses Tailwind CSS **4.3.3**, matching the retained backoffice version,
through `@tailwindcss/vite`. Its shared document layout loads
`apps/landing/src/styles/global.css`; source scanning is limited to landing `src`.
Use native Astro components and TypeScript scripts for small browser interactions.
A React integration remains a separate future decision if a concrete component
needs it. The styling technology selects no brand colors, typography or content;
the five language entries remain empty technical documents.

## Code checks

ESLint and Prettier cover both apps and repository tooling. The root formatter
uses two spaces, double quotes and semicolons, with Astro support and separate
Tailwind stylesheet paths for each app. Editor defaults are in `.editorconfig`.
Generated files, local tools/caches, dependencies, third-party assets and paid
reference archives are excluded. Use:

```sh
pnpm format       # apply formatting to authored files
pnpm check        # check formatting, lint, types and code tests
```

The aggregate command stops with a nonzero status when a check fails. It includes
the backoffice tests and visual-tooling unit tests; it does not run app builds,
Playwright browser checks or accept visual references. Individual commands remain
available:

```sh
pnpm typecheck:backoffice
pnpm lint:backoffice
pnpm test:backoffice
pnpm typecheck:landing
pnpm lint:landing
pnpm lint:tooling
pnpm visual:test
pnpm build:backoffice
pnpm build:landing
```

Vitest tests cover suitable client/logic behavior. See the
[visual review guide](visual/README.md) for browser captures, interactive previews,
coverage checks, reports and reviewed-reference comparison.

Astro's current development CLI starts a background server. Stop the server
for this app with:

```sh
pnpm --filter ./apps/landing exec astro dev stop
```

## TailAdmin reference

The supplied `tailadmin-nextjs-pro-2.5.zip` is the complete paid source reference;
it remains unchanged. The lean app omits demos and their dependencies. Existing
template branding is a temporary baseline. Product decisions and source changes
are recorded in the technical foundation's
[design](openspec/changes/establish-frontend-technical-foundation/design.md).
