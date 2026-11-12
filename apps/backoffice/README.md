# Backoffice foundation

Start with the [workspace README](../../README.md) for the pinned toolchain and
independent development, build, lint, type-check and code-test commands.

This app retains TailAdmin Pro's default shell and reusable UI primitives. Demo
routes, data, account widgets and demo-only dependencies were removed at the user's
request. The entry is intentionally empty while technical setup precedes branding
and product design. The complete supplied ZIP remains the source reference.

See the [technical foundation](../../openspec/changes/establish-frontend-technical-foundation/design.md)
for decisions, source changes, verification and remaining choices. Existing
TailAdmin branding is temporary; no production business flows or live API/session
integration are implemented. The app uses Next.js static export for S3 behind
CloudFront; `pnpm build:backoffice` produces `out/` and `pnpm preview:backoffice`
serves those files locally. Language preference is resolved in the browser after
a neutral initialization state. No production Node/Next server is required.

React Hook Form and Zod are installed for future forms, with the standard Zod
resolver and retained TailAdmin input/field/button primitives. The synthetic
`src/test/form-stack.test.tsx` checks their integration without creating a product
route, feature validation rules or a generic form framework.
