# Landing agent entry point

Read the [repository entry point](../../AGENTS.md), its OpenSpec sources and the
[technical foundation](../../openspec/changes/establish-frontend-technical-foundation/proposal.md)
before actions. User instructions and approved decisions govern. Never commit;
sibling repositories remain read-only.

The selected landing stack is Astro, strict TypeScript and Tailwind CSS 4 through
the Vite plugin. Use native Astro components and TypeScript scripts for small
browser interactions. React integration remains a separate future decision tied
to a concrete component need. Keep this app independent of the TailAdmin
dashboard. Shared workspace code requires actual consumers in both apps.

The shared document layout loads `src/styles/global.css`; its Tailwind source
scope is landing `src`. Do not import backoffice styles or infer a shared palette,
font or final visual identity from the common styling technology. The five
language routes and Spanish default follow OpenSpec. The current entries remain
empty technical documents until brand/product design is authorized. Preserve
static output and the settled hosting boundaries; do not reopen hosting or
expand into identity/API/deployment work.

Use the root Prettier configuration and the app's Astro-aware ESLint config.
Run `pnpm check` at root for formatting, lint, types and code tests; app builds
and browser/visual checks remain separate. Follow [visual/README.md](../../visual/README.md)
for the native Astro catalogue and capture workflow. Preview fixtures/routes
belong to the separate visual configuration and must stay out of normal builds.
Never accept candidate images without the user's specific review.
