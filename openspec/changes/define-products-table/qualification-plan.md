# Grid comparison implementation plan

**Goal:** assess Tabulator and TanStack Table against identical Irin-relevant
fixtures and return a final recommendation supported by browser evidence.

**Authority:** the user said: “Go ahead and do any test or comparison you want
to do, and come back to me with the final assessment and recommendation”. This
authorizes evaluation dependencies, development-only fixtures and tests within
this repository. It does not select a production grid or new product behavior.
The previous research-only limit is superseded for this bounded comparison.

**Architecture:** two Storybook adapters share synthetic records, controls,
state/draft policy and retained TailAdmin forms/panel. Each exercises its actual
grid engine, with virtual rendering enabled for the same fixed-height viewport.
No production route or sibling repository changes. No commits, staging or image
reference promotion. Results and screenshots stay under `.cache/grid-comparison/`.

**Tech stack:** existing Next.js/React/Storybook/Vite/Playwright tools; evaluation
dev dependencies `@tanstack/react-table@9.3.1`,
`@tanstack/react-virtual@3.14.26`, `tabulator-tables@6.7.1`,
`@types/tabulator-tables@6.3.6` and `@axe-core/playwright@4.14.0`.
Public npm metadata was checked on 2026-11-13: these releases date from
2026-07-12 through 2026-11-03 and meet the existing 1440-minute waiting period.
Types are separately maintained and versioned; verify the actual used APIs.
Retain strict release-age/script policy; no dependency scripts are authorized.

## 1. Reproducible installation and test harness

- Update only backoffice dev dependencies and the pnpm lockfile; use the pinned
  runtime and package manager, install with scripts disabled, inspect the lock
  change and installed licences/transitive packages.
- Add root `grid:build`, `grid:test` and `grid:preview` commands, opt-in
  `IRIN_GRID_COMPARISON=1` Storybook registration in `.storybook/main.ts`,
  `visual/grid-comparison.config.ts` and
  `visual/tests/grid-comparison.spec.ts`; use the existing pinned Chromium,
  software rendering, device scale 1, es-ES/Europe-Madrid, serial workers,
  no retries and dedicated output/report paths. Serve the dedicated static build
  under `.cache/grid-comparison/storybook` on port 6010; preserve the normal
  port-6006 catalogue and its registered visual inventory.
- Write observable fixture acceptance checks before implementing the adapters;
  verify the missing-fixture failure, then implement to pass them. Expand checks
  around newly discovered integration failures. No production code is involved.

## 2. Matched fixtures and adapters

Create development-only source under
`apps/backoffice/.storybook/stories/grid-comparison/`, with
`.storybook/evaluation/grid-comparison.stories.tsx` exposing both candidates
only in the opt-in build. Include:

- Identical permanent IDs, duplicate names, leading-zero identifiers, decimal
  strings, multiple stock measures and explicit zero/no-record/unknown/needs-
  verification states. No inferred physical stock or available-to-sell values.
- Shared catalogue-first controls, submitted search, applied filters, optional
  selected-location stock, compact/comfortable density and view tools. Probe
  column visibility/order/width with per-tab/business isolation. No new
  production storage or normalization policy.
- Native grid sorting/filtering where applicable, stable row IDs, bounded
  virtual viewport, pinned Producto and horizontal phone scrolling. Same
  comparator/predicate intent, fixture ordering and row content for both.
- Read-only requested inline detail plus the retained TailAdmin side/full-phone
  panel. These compare mechanisms; neither expansion model becomes a product
  decision. Check unmount/collapse/filter lifecycle and focus.
- Explicit editing of a generic fixture-only note, with shared draft ownership,
  React Hook Form/Zod in the details form, Save/Cancel and simulated confirmed,
  rejected or uncertain outcomes. Stock remains read-only. No actual catalogue
  editable fields, API operations or multi-row transaction policy are selected.
- Optional keyboard/clipboard capability probes using allowed fixture note
  cells only. Evaluate built-in machinery versus adapter work; avoid converting
  a capability probe into a selected first-release feature.
- Five-language fixture copy and light/dark themes. Catalogue dictionaries stay
  development-only. Keep evaluation notices in Storybook documentation.

## 3. Evidence and comparison

- Browser-test both on desktop 1440×900, tablet 768×1024, phone 390×844 and
  desktop dark; check all five languages and error/empty/draft states.
- Inspect screenshots of the compact table, details, editing and phone scroll.
  Save candidates without updating accepted references or the existing visual
  inventory. These are evaluation fixtures, not new production components.
- Add a minimal native Tabulator audit story to distinguish its default ARIA
  markup from our custom cells/portals/range configuration. Keep this additional
  probe lazily loaded so it cannot load Tabulator into the TanStack timing case.
- Exercise keyboard focus/navigation and run axe on both rendered tables and
  details. Report concrete findings and limits; this is not accessibility
  certification or a human screen-reader study.
- Measure sequential cold fixture mounts, submitted-search response and deep
  scrolling for synthetic 100/1,000/10,000-record datasets. Use repeated samples
  with alternating candidate order, store raw timings and report median/range.
  Separate browser fixture observations from real service latency or customer
  capacity promises. Record DOM row counts and visible results.
- Build comparable minimal vendor probes with the existing Vite build tool;
  report raw/gzip JavaScript and CSS plus exactly what is included/externalized.
  Treat measured payload as this build's observation, not a universal bundle size.
  The reproducible vendor probe is `visual/grid-payload.mjs`.
- Record adapter/source complexity and any required custom interaction code,
  React lifecycle issues, warnings, type gaps and unresolved capability limits.
  Do not use line counts alone as a quality verdict.

## 4. Verification and report

Run root `pnpm check`, `pnpm build:backoffice`, `pnpm build:storybook`, dedicated
comparison Playwright checks and targeted existing catalogue regressions as
appropriate. Keep builds and captures distinct from image approval. Validate
OpenSpec/formatting/links and verify index, HEAD, production source, landing and
accepted references remain unchanged. Record exact versions, commands, machine/
browser environment, results and recommendation in `qualification-results.md`.
Update the proposal/design/tasks and agent reading pointers with the actual
evaluation status; do not mark product adoption or unresolved product decisions
as approved. Return the final recommendation without requesting further
evaluation preferences already delegated by the user.

## Execution result

The comparison is implemented and browser-tested. Read
[qualification-results.md](qualification-results.md) for the actual versions,
measurements, accessibility findings, verification scope and final recommendation.
The user has not adopted a production grid or approved these candidate images.
