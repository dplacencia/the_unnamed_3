# Technical foundation tasks

Current status: the user selected the choices for tasks 3.3b, 3.4 and 3.5; their
approved implementation and verification are complete. The
[visual review workflow](../define-visual-review-workflow/proposal.md) is
implemented and remains a constraint. This completes the agreed repository stack;
future work and visual acceptance remain subject to the user's instructions.

## 1. Discovery and work order

- [x] 1.1 Record the user's work order and existing constraints in `proposal.md`
      and `design.md`; preserve the accepted UI reference without extending it.
- [x] 1.2 Inspect the supplied template's manifest, lock, TypeScript, Next and locale
      configuration; read relevant sibling contract/authority sources without changes.
- [x] 1.3 Present T1 for the user's choice; keep further stack/tooling selections open.
- [x] 1.4 Add current-assignment pointers in `AGENTS.md` and `openspec/config.yaml`;
      strictly validate native OpenSpec and check local links and status wording.

## 2. Define and implement approved technical decisions

- [x] 2.1 Record approved T1 (supplied Next.js edition), T3 (two app folders) and
      pnpm selection; keep runtime, landing stack and other choices open.
- [x] 2.2 Replace the documentation-only marker with relevant native capability
      deltas and a concrete implementation checklist for each approved subset.
- [x] 2.3 Prepare `apps/backoffice` from the selected archive, initially reserve
      `apps/landing/.gitkeep`, and create root `package.json`, `pnpm-workspace.yaml`,
      `.gitignore` and a backoffice typecheck command. Verify source provenance and
      independent command targeting; installation followed toolchain selection.
- [x] 2.4a Record selected Node 26 LTS and stable pnpm pins (26.13.1/12.18.0) and
      exact setup files/checks in `design.md` and ARCH-003.
- [x] 2.4b Bootstrap repo-local tools; migrate the supplied lock to pnpm while
      retaining its initial app dependency graph. Verify a reproducible install.
- [x] 2.5 Read installed Next guides, make necessary workspace-resolution changes,
      run backoffice type/lint/build/dev checks and record actual results. Do not
      create product flows, visual baselines, branding changes or commits.
- [x] 2.6 Record the user's Astro selection and prepare the minimal independent
      landing manifest/config/strict-TypeScript/empty-entry files from the design plan.
      Add independent root commands; check and build it without designing a landing.
- [x] 2.7 Apply the user's lean TailAdmin choice: retain shell/primitives and their
      import closure; remove unchanged copied demos/assets/dependencies after source
      comparison; replace the entry with an empty technical route and no invented flows.
- [x] 2.8 Resolve/add the selected code-test stack, then write behavior tests for
      retained state helpers before lint-driven refactoring. Verify source lint and
      tests, repeat changed app checks and diagnose the observed dev redirect loop.
- [x] 2.9a Record the two selected language-routing/default choices and LOC-001–002.
- [x] 2.9b Resolve language-cookie retention, implement the selected locale
      configuration/resources/routes without designing a picker, and verify real
      HTTP cookie/default behavior plus the generated five-language landing entries.
- [x] 2.9c Finish native OpenSpec validation, local-link checks and source/Git
      boundary checks; update verification wording to the actual approved subset.
- [x] 2.10a Record both apps static on S3 behind CloudFront and the selected neutral
      locale initialization state; specify the concrete adaptation and HOST-001–002.
- [x] 2.10b Add failing locale behavior tests, implement browser preference support
      and replace server routing with static export; preserve the lean TailAdmin shell.
- [x] 2.10c Add a local static preview without new dependencies, verify the static
      artifacts and appropriate code checks, and update guidance/status. Keep actual
      AWS infrastructure, deployment and unresolved policies outside this subset.
- [x] 2.10d Record the selected private S3/OAC origins and separate bucket/distribution
      per app in HOST-003–004, design, proposal, README and OpenSpec context. Check
      native strict validation and local links; do not create or deploy AWS resources.

## 3. Repository technology decisions — current scope

The user has selected the three remaining topics for discussion and subsequent
implementation of their choices. This does not select libraries, require extra
dependencies or authorize product flows. Keep already approved choices intact.

- [x] 3.1 Record the user's scope correction in proposal/design/spec/context and
      agent guidance; validate the documentation. Hosting is settled for this phase;
      do not ask further hosting/CDN questions. Defer Keycloak/API and deployment work.
- [x] 3.2a Record the approved React Hook Form + Zod choice, FORM-001–002 and the
      exact backoffice-only setup/verification plan before implementation.
- [x] 3.2b Add the test-only TailAdmin form integration fixture and inspect the
      pre-install failure. Install the three pinned dependencies under existing policy,
      then verify the fixture, code checks, static build, peers and frozen lock install.
- [x] 3.2c Update usage/agent/context guidance and actual verification evidence;
      validate OpenSpec and local links without adding product forms or business rules.
- [x] 3.3a Record approved React state/reducers with scoped Context in STATE-001–002,
      proposal/design/context and app guidance. Assess the existing helpers and run
      their relevant behavior tests; preserve compliant source without a new library.
- [x] 3.3b Record the user's selected feature folders and actual-reuse boundary
      in ARCH-007–008, proposal/design and this plan before updating usage guidance.
- [x] 3.3c Update root/app agent guidance, README and OpenSpec context; assess the
      current source for needed migration, validate OpenSpec/local links and check
      Git boundaries. Do not create speculative features/packages or change runtime
      source for this documentation-only subset.
- [x] 3.4a Record selected Tailwind 4 with native Astro/TypeScript in ARCH-009
      and the exact landing setup plan, preserving technical placeholders.
- [x] 3.5a Record selected repository-wide ESLint/Prettier and `pnpm check` in
      CODE-003–004 and the exact configuration/dependency/verification plan.
- [x] 3.4b Add the pinned landing dependencies, Astro/Vite integration and minimal
      stylesheet/layout import. Verify type/build output across all five routes.
- [x] 3.5b Configure the selected root/app quality tools and commands, format
      authored files and resolve actual lint findings. Preserve unrelated dependencies,
      script denials, supplied assets and runtime behavior; run local aggregate checks.
- [x] 3.5c Verify frozen install/peers, both apps/catalogues and refreshed browser/
      capture checks against the prior candidate run without accepting references.
      Update guidance/results, validate OpenSpec/links and verify Git/source boundaries
      before reporting the agreed repository stack complete.

## Deferred external work

The earlier agent-added hosting routing/cache/tooling and Keycloak/API integration
tasks are removed from the active phase by the user's correction. Their existence
in an earlier checklist does not authorize executing them or reopening hosting
questions. Existing sibling contracts remain constraints for eventual integration.

## Subsequent work, in user-selected order

The original sequence placed brand basics/TailAdmin configuration before the
visual workflow. The user subsequently advanced workflow definition and selected
Storybook, Astro-native previews, Playwright and the recorded Mac/responsive
matrix; the visual change owns that implementation, now completed. Latest
steering returns to the three remaining technical decisions above. Brand choices
and product-flow design remain unapproved.
