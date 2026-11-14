# Products browsing and inspection design plan

**Goal:** provide the first concrete TailAdmin/TanStack Products browsing design
for responsive visual review, using PT-001–021 and the user's instruction to
continue design after selecting TanStack. It is a development-only proposal,
not a production route or approval of exact visual metrics.

**Architecture:** a new Storybook Products preview composes the existing merchant
navigation shell through optional Products content/header slots. Those slots
default to absent, preserving the navigation reference. TanStack Table 9.3.1
owns table sorting/columns/expansion; React owns fixture records and view state.
Use the retained TailAdmin table, input, button, checkbox, select, popover and
sheet controls, existing icons and selected branding. No new dependency or
virtualizer is needed for this small fixture collection.

## Phase-one design scope

- Dense catalogue rows and comfortable comparison, with approved initial columns,
  exact identifiers, optional scoped read-only stock and explicit search/sort.
- A compact toolbar for search, stock visibility and Vista. Vista demonstrates
  density and column visibility/order/width with a column-only reset. Products'
  optional location belongs in the existing compact header beside theme controls.
- Initially collapsed independent summaries with barcode(s), known lifecycle
  status, hidden SKU/unit fields and full-details action. All approved catalogue
  information is available in the read-only panel; stock respects the same scope.
- Full phone table, horizontal scroll, pinned product identity, sticky headings,
  keyboard-accessible expansion and a full-width phone panel.
- All five catalogue languages and themes; synthetic data includes duplicate
  names, missing assignments, multiple barcodes, zero/no-record/unknown stock and
  exact independent measurements. Fixture data is not customer/API evidence.

This pass designs browsing, customization and inspection. Applied-filter UI,
editable fields/save flows, production fetching/pagination, concurrency and
business draft retention remain later work. Do not fill them with technical
placeholder controls or infer stock-only filtering results for unknown values.
Existing selected requirements remain in force for their later design passes.
Exact prototype row heights/widths and missing-value copy are proposals to review,
not new approved product defaults. No approval, staging, commit or deployment.

## Files and sequence

1. Record PT-018–021 and current source/version evidence in
   `foundation-decision.md`, proposal/design/tasks and agent/context pointers.
2. Write `visual/tests/products-table.spec.ts` and a dedicated
   `visual/products-table.config.ts` acceptance harness before UI implementation.
   Verify missing-story failure; do not treat a server/compile error as the
   expected functional failure.
3. Add `apps/backoffice/.storybook/stories/products-table.stories.tsx` and
   `products-table-preview.tsx` / `products-table-model.ts` /
   `products-table-preview.css`. Keep preview state/copy out of production routes.
4. Extend `navigation-prototype.tsx` only with optional Products slots and header
   fit when those slots exist. Existing examples/appearance must remain unchanged.
5. Add catalogue-only messages in all five `.storybook/messages/*.json` files.
   Add the new stories/scenarios to `visual/inventory.json`; register explicit
   actions in `visual/products-actions.ts` / `visual/tests/catalogue.spec.ts`.
6. Run focused browser assertions for submitted search, exact codes, independent
   expansion, hidden fields, stock rules, panel focus, column controls and phone
   pinning/overflow. Capture desktop/tablet/phone/dark states, inspect them and
   retain candidates without promoting references. Add five-language assertions.
7. Run root `pnpm check`, static backoffice build, fresh visual preparation,
   coverage audit and relevant existing navigation/language regressions. Compare
   approved cases where applicable; identify intended candidates separately from
   the prior 20 pending navigation images. Validate OpenSpec/links/diffs and keep
   the index empty and HEAD unchanged.
8. Record the actual run identities, results, limitations and review links here
   and in the change's design/tasks. Ask for review of the concrete first design;
   do not label candidate captures accepted or the full Products flow complete.

## Execution and verification — 2026-11-13

The first browsing/inspection design is implemented in six Storybook examples,
registered through ten inventory entries and 21 named scenarios. Coverage now
passes for 216 retained component modules, 65 catalogue stories, 21 view entries
and 141 scenarios (564 capture cases). No production route or shared primitive
was changed; navigation's Products slots are optional and absent in its existing
reference stories. TanStack Table 9.3.1 is an exact runtime dependency.

Verified:

- `pnpm check`: formatting/lint/types and all 54 existing code tests pass.
- `pnpm visual:prepare`: static backoffice, landing and catalogues build; coverage
  passes with current fonts and source identity.
- `pnpm visual:test-languages`: **69 browser checks pass**, no failed, skipped
  or flaky cases. These include the previous 53 catalogue/navigation checks and
  16 Products cases for search, stock distinctions/scope, summaries, hidden
  fields, column controls, phone pinning, long names, view retention, five
  languages, keyboard/panel focus and light/dark automated accessibility audits.
- `pnpm visual:capture --grep '(^| )products-'`: **84 Products candidates pass**,
  with no failed, skipped or flaky cases. Representative desktop, dark, phone,
  stock, expanded, hidden-field, archived, Vista and panel captures were inspected.
- `pnpm visual:compare --grep-invert '(^mobile .*navigation-)|(^| )products-|navigation-workspace-location-options|navigation-workspace-location-option-hovered'`:
  **451 unaffected approved comparisons pass**. This excludes unapproved new
  Products/dropdown cases and pending mobile-navigation replacements. An earlier
  overbroad invocation correctly rejected missing references; it accepted nothing.

Current Products capture:

- Run: `2026-11-13T16-58-54.687Z`.
- Source: `a1bf07dc238b62c98a70bcee332f255f47f315589734b9327cc52ac069d9be4f`.
- Renderer: Playwright 1.65.0 / Chromium 158.0.8127.18, macOS arm64, GPU disabled,
  scale 1; font fingerprint
  `1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
- Profiles: desktop 1440×900, tablet 768×1024, phone 390×844, desktop dark;
  assembled-view cases cover Spanish, English, Catalan, Galician and Basque.
- [Interactive catalogue](http://localhost:6006/?path=/story/inventory-products--catalogue).
- [Exact 84-case gallery](http://localhost:9324/runs/2026-11-13T16-58-54.687Z/review.html).
- Source/image/run metadata is retained under
  `.cache/visual/runs/2026-11-13T16-58-54.687Z/`; language results are under
  `.cache/visual/language-tests/`. Generated files are ignored, not committed.

Independent read-only review found no remaining critical/important issues. Its
Vista observation was reproduced with a failing browser check, then corrected:
move targets/boundaries follow the menu's actual entries, excluding stock when
off while retaining hidden catalogue fields' saved ordering. Long names now
shrink within their cells and stay complete in details. Phone Product width
controls explain their desktop scope; the phone cap is a review proposal.

These results do not certify complete accessibility, real API failures, large
datasets, production persistence or the full Products flow. The fixture retains
applied views per example/tab and resets requested summaries on leaving Products;
those mechanics do not settle production storage or expansion retention.
Archived examples model an explicitly included read; no archival action exists.
Exact sizes, width caps, widget interactions and missing-value copy remain
proposals. All 84 candidates and the prior 20 navigation updates await specific
approval. The 472 accepted references/manifests remain unchanged. Nothing is
staged or committed; HEAD remains `f365765`.

## Commit preparation — 2026-11-14

After reviewing the design, the user said:

> That is looking good, prepare the commit before moving to the next steps

This authorizes one cohesive staging batch for the Products research, matched
grid qualification, selected TanStack pin and first browsing/inspection prototype,
including their OpenSpec records, context pointers and validation tooling. Give
the user the commit command and stop before the next design pass. Never create
the commit. This request does not identify or approve candidate captures; retain
the existing 472 references and the separate pending Products/navigation reviews.

`pnpm check` was rerun successfully for this preparation: formatting, lint,
types and all 54 code tests pass. The current visual source fingerprint still
matches `a1bf07dc238b62c98a70bcee332f255f47f315589734b9327cc52ac069d9be4f`,
the prepared build and the exact reviewed capture/comparison runs above. Their
69 browser checks, 84 Products captures and 451 unaffected visual comparisons
remain evidence for that unchanged executable source; they were not rerun for
this documentation/staging step. Generated build/test/cache artifacts remain
ignored. Staging must exclude production source, the landing app, script-review
policy and screenshot references. The base commit is `f365765`.
