# Products browsing preview implementation plan

Latest phase: the user said **“go ahead”** to preparing the two sequential commit
batches in the [preparation record](#commit-preparation--2026-11-17). Stage the
implementation batch only now; the reference batch waits for the user's verified
first commit. Never create commits or start the separately proposed follow-ups.

Latest revision: the user selected **“Between Anterior and Siguiente
(Recommended)”** for the current-page indicator. Execute the bounded
[page-number revision](#current-page-indicator-revision--2026-11-17) below.
The original gallery is superseded; the refreshed exact gallery is now approved
under the later instruction below. Preserve all 936 unrelated references and the
empty index while accepting only the reviewed 148 additions.

Latest approval — 2026-11-17: the user answered **“Approve all 148 images”** to
the question identifying exact run `2026-11-17T12-43-29.019Z`, source
`5f628f39d4e783d8ddc33bbb13810946ec7e81c3e194e6f4cab51ab401676943`.
Promote only those 148 reviewed cases, preserving the 936 unrelated references,
then verify the promoted scope. This supersedes pending-approval/no-promotion
wording for this set only. No backend implementation, staging or commit follows.

> For implementation: use the executing-plans workflow against the selected
> scope below. The user has selected execution of this bounded simulated preview.

**Goal:** make selected PT-044–052 reviewable in the existing Products workspace
with larger synthetic catalogues, paging, honest result states and cross-page edits.

**Architecture:** extend the shared TailAdmin/TanStack table with a fixture-only
browsing controller. Keep complete editor/form state above the displayed-page
projection. Separate requested view from the last successfully loaded result and
its scope. Use no real API, production position format or new dependency.

**Tech stack:** existing pinned React/TypeScript, TailAdmin, TanStack Table 9.3.1,
Vitest and Playwright/Chromium. Keep the established renderer and fonts.

## Authority, checkpoint and scope

The user answered **“Build the prepared simulated preview (Recommended)”** to the
delivered plan and question explicitly describing 1,000 synthetic products,
10,000-record bounded rendering, existing demo search/sort, no real API,
selective paging-control busy behavior and latest-view response protection.
This initiates the file-bounded implementation below and adopts those additional
preview choices. Exact visuals remain proposals for later review. It supersedes
the earlier no-source-edit status only for this plan; never stage or commit.

The user initiated browsing discovery and selected PT-044–052 in the
[browsing design](browsing-design.md). The later explicit build selection above
adopts the additional preview choices and initiates this concrete phase. It does
not resolve precise production search/matching/sort rules or API availability.

Starting HEAD is `3ae4cbda0ce31410302bfb81abd5b9578a00eb8f`, with the current
discovery documents retained. Before execution, source/build were `8ac7d6d2…`; the baseline is
936 accepted images, aggregate `63d3e9bb…`. The preceding nine/21-file commits
are complete and their staging authority is spent. Never stage or commit here.

Work stays in the current authorized `_3` checkout. The user's OpenSpec and
never-commit instructions override generic skill plan paths/commit steps.
Inventory and its sibling remain read-only; no API/IAM/hosting, real data,
production persistence/ownership, dependency upgrade or virtualizer is included.

## Concrete preview scope — adopted for bounded implementation

1. Extend the existing Products table/workspace rather than build a second grid.
   Add dedicated large-catalogue examples. Keep earlier fixtures for comparison
   and preserve existing browsing/editing/recovery behavior outside this scope.
2. Use **1,000 deterministic synthetic products** for interactive review and a
   **10,000-product bounded-DOM check**. These are fixture sizes, not page-size
   options, production caps, realistic merchant evidence or latency targets.
3. Preserve current fixture search/comparators as **demo logic only**. Apply the
   existing query/filter selection and full-result sorting before page projection.
   Do not choose normalization, accent/token/collation/ranking/tie semantics or
   claim a real Products search/pagination API.
4. During a simulated read, disable only Anterior/Siguiente and page-size changes.
   Other controls remain usable under existing guards. A newly submitted view
   supersedes the pending read intent; an older completion cannot replace the
   latest requested view. This is the adopted frontend simulation policy, not a
   claim about transport cancellation or server request concurrency.
5. Place compact Anterior/Siguiente controls and honest counts below the bounded
   table frame. Put Productos por página (25/50/100) alongside density in Vista.
   Retain existing control treatment, 16px icons, desktop sizing and 44px touch
   targets. Exact arrangement, copy, spacing and image metrics remain proposals
   to review; no extra large header/card or status text beside product names.
6. Reuse the existing mini field-review path for hidden/off-page validation errors.
   Add a compact way to find **valid off-page drafts too**, invoking that existing
   review mechanism without clearing the merchant's query/filters or remounting a
   typed correction field. Preserve global save/individual-result rules.

The selected scope deliberately defers precise production search/sort semantics
and remaining production read/write coordination. Building it does not complete
every open item in task 12.4. Those limits must remain explicit in Storybook docs
and the final handoff, with no unseen behavior treated as a new requirement.

## Permitted implementation files

- Create `.storybook/stories/products-browsing-model.ts` and
  `products-browsing-fixtures.ts` under `apps/backoffice`: pure browsing state,
  reset/projection helpers and the deterministic fixture provider.
- Create `.storybook/stories/products-browsing.tsx` and
  `products-browsing.stories.tsx`: fixture controller/controlled presentation and
  registered examples using the shared Products workspace.
- Modify `apps/backoffice/.storybook/stories/products-table-model.ts`,
  `products-table-preview.tsx` and `products-table-preview.css` for retained
  page-size/fixture position, rendered page projection, controls and result scope.
- Modify `apps/backoffice/.storybook/stories/products-editing.tsx` only for the
  valid off-page-draft/field-review presentation; preserve save/recovery policy.
- Modify `products-recovery.tsx`/its stories only if necessary to pass the same
  optional browsing interface through existing protected-product examples.
  Do not change ownership, persistence or original-command algorithms.
- Modify the five `apps/backoffice/.storybook/messages/{es,en,ca,gl,eu}.json`
  dictionaries for development-only preview labels. Keep the natural Spanish
  feedback wording and existing catalogue message typing.
- Create `visual/products-browsing.test.ts` and
  `visual/tests/products-browsing.spec.ts`; register browser coverage in
  `visual/products-table.config.ts` and `visual/playwright.languages.config.ts`.
- Update `visual/products-actions.ts`, `visual/inventory.json` and, only if capture
  preparation needs it, `visual/tests/catalogue.spec.ts`. Root owns capture scope.
- Update `visual/README.md`, this change's discovery/proposal/tasks/specification
  records and root/app agent/context pointers to record actual authorized scope,
  results and review limits. No reference promotion or Git operations follows.

All story files above are fixture/UI development code, not new production routes
or a `src/features` scaffold. An implementation need outside this list or a new
functional policy returns for the user's decision before adoption.

## 1. Obtain meaningful failing evidence

Add a browser regression against the current Products preview for the missing
named Anterior/Siguiente controls and page-size choices. Run it against the
existing source and retain RED evidence; an unavailable server/import is not the
expected failure. Register the new focused test before rebuilding.

Add pure model cases for selected resets/retention, result-scope snapshots,
latest-intent settlement, explicit unusable-position restart and exact count
presence. Once a minimal importable model exists, obtain a behavioral failing
assertion before implementing each branch; do not call an import error proof.

Commands under the pinned local environment:

```sh
pnpm exec playwright test --config visual/products-table.config.ts visual/tests/products-browsing.spec.ts
pnpm exec vitest run --config visual/vitest.config.mts visual/products-browsing.test.ts
```

Existing focused tests run their own isolated preview port. Stop only a task-owned
stale server when necessary; do not reuse or terminate an unrelated listener.

## 2. Fixture provider and controlled state

Represent the last settled result with its records, request-view/stock scope,
navigation availability and separately supplied estimate. Keep pending requested
view/position and a read generation distinct. A successful current read replaces
the result; technical error keeps it marked previous, while a confirmed unusable
position offers explicit restart. Do not treat failures as empty success.

The fixture provider may privately compute positions using its complete data;
the UI treats its position as a fixture handle. This is not a public token format
and must not decode real Inventory tokens or imply Products API support.
Use clearly synthetic success/delay/error/unusable fixtures with no business
writes, automatic retry loop or selected read-timeout budget.

Complete query/filter selection and current demo ordering must precede slicing.
Do not sort/filter only a returned group or derive continuation from its length
or estimate. Supplied estimate, supplied zero and no estimate remain distinct;
preserve the provided value rather than rounding or inventing a global total.
For PT-042 fixtures, expose only counts the provider actually knows and label their
scope; never claim page-local unknowns describe the whole catalogue.

## 3. Workspace, retention and editing integration

Keep `useProductEditing` and its complete records/form stable above paging.
Render only the settled page's product rows; pagination must not recreate the
editor or replace its store with a page response. Preserve exact identifiers,
stock measurements, statuses, expansions, details and all-draft validation.

Controls describe the requested view, while retained rows/counts/quantities keep
their last settled scope. In particular, do not relabel old-location stock using
a newly selected location while that read is pending or has failed. Layout-only
changes can update presentation without claiming fresh business data.

Classify resets **after** `applyProductsViewUpdate` normalizes updates; hiding
stock may implicitly clear an applied stock filter and therefore require reset.
Preserve selected page-size/draft settings and do not silently clear filters to
reach an off-page edit or error. Use actually rendered page rows for `fieldVisible`.

Extend validated per-tab view preferences using the existing fixture namespace
and fresh-opener cleanup. Remember size/fixture position, not cached rows as fresh
data. Trigger a fresh read on actual Products re-entry/remount as well as refresh;
Workspace may remain mounted when NavigationPrototype hides/remounts Products.
Test a real opener-created tab defaults to 50 instead of inheriting copied state.
Retained draft/command restoration remains explicit under its existing rules.

Read generations and Retry actions are separate from write operation identities,
write attempt counts and recovery timers. Original unresolved commands remain
frozen and their affected-product protections/global uncertainty stay visible.

## 4. Meaningful browser and model coverage

Cover first/intermediate/last groups, 25/50/100 choices, supplied/missing/zero
estimate, short groups with explicit continuation, previous-results scope,
technical read failure/Retry and confirmed unusable position/manual restart.
Check selected search/sort/filter/layout/location reset distinctions, same-tab
return and refresh with a fresh read, copied-opener defaults and business scope.

Edit products on different groups, verify one save covers them, block the whole
requested submission for an off-page field error and correct it through existing
mini-review without losing view settings/typed text. Verify valid off-page drafts
are reachable too. Preserve mixed/uncertain results and original recovery request
counts while paging and retrying reads. Include stale read completion after a
newer view request and unmount/re-entry under a pending read.

Verify the 10,000-record fixture renders at most the selected number of **product
rows** (expansion content is not another product). This proves bounded DOM
projection only; report no production capacity or timing benchmark.
Check keyboard/focus, status announcements, useful footer access, phone horizontal
scroll/pinned Producto, touch targets, dark mode and all five UI languages.

## 5. Verify, capture and deliver for specific approval

After meaningful RED becomes GREEN, run root quality checks and appropriate
browser coverage against a fresh prepared source:

```sh
pnpm check
pnpm visual:prepare
pnpm visual:preview
pnpm visual:test-languages
pnpm visual:coverage
```

Preview is a task-owned long-running server; launch/poll it without blocking
communication. Preserve font binaries/aliases and renderer/tolerance settings.
Do not run prepare-fonts or adjust comparison tolerance to make a result pass.

Audit actual new/changed visual scope before selecting exact capture/comparison
patterns. Cover registered responsive/theme/language and relevant interactive
states; do not promise a count before inventory is prepared. Run capture and
comparison sequentially because their report paths are shared. Preserve all
936 accepted images and registry; changed/new candidates require exact approval.

Independently review requirements, scope and representative phone/tablet/desktop/
dark images. Preserve failed results, distinguish known icon-rendering noise from
a fixed issue and never infer approval from green tests. Deliver the live examples,
exact candidate gallery, source/run identities, executed checks and limitations.
Stop for user review. No acceptance, promotion, staging, commit or next feature
follows automatically.

## Current status

Historical initial execution at `1e81de94…`: the following section records that
first pass. The current approval target and verification limits belong to the
page-number revision below at `5f628f39…`.

The bounded simulated preview is implemented and verified. The 148 candidates
captured below are ready for delivery and pending specific user approval. The
full browser suite passes; all 936 accepted cases have passing comparison
evidence at the same source, with the icon-rendering limitation below retained.
Precise production search/sort semantics and remaining production coordination
are explicitly deferred.

Before execution, preparation checks passed repository formatting, strict validation of all seven
OpenSpec changes, 164 local links across nine changed/new Markdown documents,
independent semantic/scope review and `git diff --check`. The ten changed files
were documentation/configuration only; source/build were `8ac7d6d2…`, all 936
accepted references remained unchanged and the index was empty. Those are the
starting checkpoint, not a claim that the new implementation is verified.

## Execution evidence — 2026-11-17

The shared table uses a fixture provider/controller, with selection and full-result
demo sorting before projection. The full editor remains above the displayed rows;
page requests do not recreate drafts or original recovery commands. Requested
controls and settled row/count/stock scope remain separate. Only navigation and
page-size controls are disabled for reads; a newer submitted view supersedes an
older read generation. Size/position retention uses the existing best-effort tab
namespace and return/reload requests fresh fixture data. There is no API adapter.

Meaningful RED evidence was obtained before implementation: the existing example
lacked the named paging controls, and 16 pure-model assertions failed behaviorally
before the model was completed. The model now passes all 17 focused cases. Logs:
`.cache/products-browsing-browser-red.log`, `.cache/products-browsing-model-red.log`
and `.cache/products-browsing-model-green.log`.

Independent source review found PT-044–053 conformant. Code-quality review found
two preservation issues: the hidden-SKU sort reminder was lost in the new footer,
and live Storybook fixture changes omitted two initializer args from the render
key. Separate browser regressions reproduced each before its fix. The footer now
uses settled sorting with current column visibility; the story key includes all
initializer-driving args. Re-review found no remaining actionable concern.
Both RED logs and traces are retained under `.cache/products-browsing-red/` and
the named hidden-sort/story-args RED logs in `.cache`.

Verified checks at source
`1e81de9490b0fb72e279400ec14daebddaed5f3923d052d9e39688b16c756500`:

- `pnpm check`: formatting, ESLint, all type checks, 34 backoffice tests and
  96 tooling/model tests pass (130 total).
- Both static apps, Storybook and the Astro visual gallery build. The local
  package-manager Next launcher failed its internal socket binding; invoking the
  same pinned Next build directly under Node 26 succeeded. No build configuration
  was changed. `prepare-fonts` was not run; existing font assets remain intact.
- All 29 focused browser checks pass, including the two review regressions,
  cross-page saves/validation/review, original-command recovery isolation,
  fresh reads on return, opener defaults, stale responses, phone touch/keyboard,
  five-language labels and accessibility checks.
- Inventory audit passes: 216 retained source modules, 98 stories, 21 view entries
  and 271 states / 1,084 profile cases. All 130 pre-existing inventory entries are
  semantically unchanged. The 26 new entries add 37 states / 148 candidates.
- The complete catalogue interaction/language suite passes all 178 browser checks
  in `.cache/products-browsing-languages.log`.
- All seven OpenSpec changes pass strict validation. The final local-link audit
  and unchanged-reference proof are retained in the files named below.

Logs are `.cache/products-browsing-{check,coverage,storybook-build,node26-build,
landing-build,browser-green,openspec}.log`. These checks do not approve appearance.

### Exact candidate set — approval pending

Historical first proposal: this set was not approved and is superseded by the
current-page revision below. Use its refreshed gallery as the approval target.

[Review all 148 candidates](http://localhost:9324/runs/2026-11-17T12-09-39.261Z/review.html),
run `2026-11-17T12-09-39.261Z`, at the source above. All 148 capture checks pass,
with zero failed, skipped or flaky cases. Its `run.json` and per-case hashes bind
the exact images; `.cache/products-browsing-candidate-manifest.json` records the
148-case manifest. The review's 148/1,084 display denotes this intentionally
selected new scope, not missing execution inside the 148 requested candidates.
Manifest SHA-256 is
`386a254504b064736aa3560c537d4ad8fb2c74750b2df6c284ec0530000b11b2`.

Coverage includes all 14 new stories, four approved profiles, Spanish plus
English/Catalan/Galician/Basque assemblies, paging/size/Vista/hidden-sort, initial
and retained-result loading, errors/retry, unusable/restart, valid and invalid
off-page review, mixed save outcomes and recovery/read isolation. The canonical
environment remains Mac arm64, Chromium `158.0.8127.18`, Playwright `1.65.0`,
GPU disabled, DPR 1, threshold `0.01`, maximum differing pixels `0`; font-manifest
hash remains `1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.

Independent visual review inspected 28 actual PNGs spanning all four profiles and
five languages with no confirmed visual defect. Root also inspected desktop,
phone, dark, loading, hidden-sort and off-page review captures. This is review
evidence, not user acceptance or exhaustive usability certification.

All 936 accepted references and registry are preserved. Their aggregate
path/NUL/content SHA-256 remains
`63d3e9bbd45e8760321dfe57526c605e93b04377c621146efbd66979e521ce3f`.
The index is empty. No image promotion, staging or commit has occurred.

### Existing-reference comparisons and final proof

Full unchanged-scope run `2026-11-17T12-11-53.043Z` executed all 936 accepted
cases at the same source: 935 passed, one failed, none skipped or classified
flaky. The failure was `products-filters-en-positive--tablet`: seven pixels above
the existing colour threshold differed only in the header's moon icon. Raw image
comparison found 21 changed pixels inside `(723,21)`–`(737,28)`; every other pixel
matched. This is the already documented intermittent icon-rendering category,
not a claim that its underlying cause has been fixed. The initial failure report
and actual/expected/diff images are preserved, including
`.cache/products-browsing-icon-review/`.

Three isolated comparisons of that exact case all pass in
`2026-11-17T12-17-51.512Z`, without source, reference, font, renderer or tolerance
changes. The union of successful case IDs from these two source-matched runs
equals all 936 accepted registry IDs, with none missing. This is partitioned
passing evidence, not a claim that the first full run was entirely green.

`.cache/products-browsing-execution-proof.json` records source, unchanged HEAD,
both comparison runs, unique accepted-case coverage, 148 successful candidates,
29 focused browser checks, the preserved 936-image aggregate and empty index.
The full browser log records 178 passing checks; the final link audit is
`.cache/products-browsing-selection-links.json`. Strict OpenSpec validation and
format/diff checks pass. Exact candidate approval remains the next gate.

The 1,000/10,000 synthetic fixtures establish reviewable behavior and bounded
rendered product rows only. They do not establish production capacity, latency,
precise matching/sort, Inventory Products pagination, transport cancellation,
production persistence/ownership or business writes.

## Current-page indicator revision — 2026-11-17

**Goal:** show the displayed page as Anterior · Página X · Siguiente, independently
of the estimated product total. The user selected the placement from a question
that also specified success-only advancement and retention on a loading error.
This records and executes PT-054; it does not approve any image set.

**Architecture:** put `pageNumber` on the synthetic provider's successful
`BrowsingPage`, not on a click counter or estimated-total calculation. Only the
provider knows its private uniform group limit and position; the UI continues to
treat fixture handles as opaque. Use the actual fixture cap for short groups.
Reject synthetic offsets that this provider would not issue as group boundaries
through its existing unusable-position result, rather than rounding an ordinal.
There is no real API, production token interpretation or new storage field.

**Files:** modify `products-browsing-model.ts`, `products-browsing.tsx` and the
pagination-scoped rules in `products-table-preview.css`; add `pbPage` to the five
catalogue dictionaries. Extend `visual/products-browsing.test.ts` and
`visual/tests/products-browsing.spec.ts`. Existing inventory/actions suffice
unless capture preparation reveals a necessary change. Keep documentation,
tasks/specification and agent entry points current. Do not change dependencies,
production routes, fonts, renderer, tolerance, accepted images or registry.

1. Add model assertions for first/next/previous numbers, short-group ordinals,
   incompatible synthetic positions and preservation through pending/failure/
   superseded reads. Add a browser assertion for the missing indicator and obtain
   behavioral RED against the existing prepared preview before implementation.
2. Return the exact known synthetic group number in successful results; render
   only `settled.pageNumber`, with a translated label between the buttons. No
   indicator appears before any successful result. Keep the control group compact
   and preserve the existing touch targets. Its number follows existing reset/
   fresh-restoration behavior only after successful reads.
3. Verify paging, failure, late reads, short groups, reset/return/refresh, missing
   totals, five languages and phone layout. Run root checks and rebuild Storybook;
   reuse unchanged static app artifacts and fonts, then refresh the shared build
   identity. Run the full catalogue/browser suite and inventory audit.
4. Independently review source behavior. Capture the entire existing 148-case
   browsing scope and inspect responsive/dark/language images, superseding the
   earlier proposal. Compare all 936 accepted cases at the refreshed source,
   preserving any actual failure and investigating it without tolerance changes.
5. Record source/run/check/reference evidence, deliver the exact gallery and stop
   for specific user approval. No promotion, staging, commit or next feature follows.

Status: implementation, root checks and browser/capture checks pass. The refreshed
set is user-approved and promoted under the later approval record. The full unchanged-reference comparison is not
clean: 935 cases pass and one existing icon case remains intermittent, as below.

### Current-page revision evidence

Source: `5f628f39d4e783d8ddc33bbb13810946ec7e81c3e194e6f4cab51ab401676943`.
The successful synthetic page carries its exact `pageNumber`; the footer reads
only the settled result. The provider uses its actual group cap and rejects
incompatible fixture boundaries rather than rounding. No controller counter,
storage field, business write or production API was added.

Meaningful RED showed the missing Página 1 label in the existing built preview
and four failing model assertions before implementation. Evidence is retained in
`.cache/products-page-number-red/` and the named RED logs. Model coverage now
passes 21 tests. Root `pnpm check` passes formatting/lint/types plus 34 backoffice
and 100 tooling/model tests (134 total). All 30 focused browser tests and all 179
full catalogue/language checks pass. Storybook rebuild and inventory audit pass;
unchanged static app artifacts and font assets are reused. All seven OpenSpec
changes validate strictly. The source/quality review found no actionable issue.

The new [148-image gallery](http://localhost:9324/runs/2026-11-17T12-43-29.019Z/review.html)
is the exact approved set. All 148 capture checks pass with zero
failures/skips/flaky cases. It supersedes `2026-11-17T12-09-39.261Z`; neither set
was approved at delivery; the later user answer approves this refreshed set only.
Its per-image hashes and source are retained in `run.json` and
`.cache/products-page-number-candidate-manifest.json`, manifest SHA-256
`5c1fc3a62af4cf1b626947ff37eb116db026a0e10fb35d06f02a432cc7a38427`.
The canonical renderer/font/tolerance profile is unchanged.

Independent image review inspected 16 actual PNGs across all four profiles and
five languages. Footer position, labels, initial/loading/error distinctions,
stock/off-page layouts and dark readability pass that scoped review. Root also
inspected desktop/tablet/phone/dark next-page and Basque stock screenshots.

Root separately observed a pre-existing title/menu overlap in the Basque phone
stock toolbar. The top 54px of
`products-browsing-eu-stock-context-positive--mobile.png` are pixel-identical
between the original and current proposal. This is recorded for a separate user-
selected navigation follow-up, not hidden by the footer review or changed here.

Logs: `.cache/products-page-number-{model-green,check,build,coverage,browser-green,
languages,capture,openspec}.log`. All 936 accepted references and the empty index
remain protected; no promotion, staging or commit follows.

### Current-page reference comparison and closeout

Run `2026-11-17T12-45-43.139Z` compares all 936 accepted cases at `5f628f39…`:
935 pass and `products-filters-ca-positive--tablet` fails on seven pixels in the
header moon icon above the unchanged threshold. The raw image comparison has
23 differing pixels: 21 in that icon and two one-channel, one-step table-border
variations below the approved colour threshold. Diagnostics and images are in
`.cache/products-page-number-icon-review/`; the complete failure report is kept
inside the source-bound run.

Three isolated checks in `2026-11-17T12-51-20.803Z` produce one pass and two
failures with the same seven-pixel icon difference. This matches the previously
observed intermittent icon-rendering category; its underlying cause remains
unresolved. No further repeats were used to seek a fully green run. This is not
a clean visual comparison or a fixed renderer. All 936 case IDs have at least
one passing observation across these two runs, but that does not remove this
case's intermittent failures. References, renderer, fonts and tolerances stay
unchanged.

`.cache/products-page-number-execution-proof.json` records the actual statuses,
including `comparisonClean: false`, both comparison runs, 148 verified image
hashes, 134 code tests, 179 full browser checks (30 focused), unchanged HEAD and
empty index. The preserved 936-image path/NUL/content aggregate remains
`63d3e9bbd45e8760321dfe57526c605e93b04377c621146efbd66979e521ce3f`.
Final formatting, strict seven-change validation, local links and diff checks
pass. The updated exact gallery is ready for specific user review, with the icon
comparison limitation and separate Basque toolbar observation explicitly retained.

## Visual approval and reference promotion — 2026-11-17

The user answered **“Approve all 148 images”** to the question linking exact run
`2026-11-17T12-43-29.019Z`, after the page-number revision and read-only Inventory
backend check. Its source is
`5f628f39d4e783d8ddc33bbb13810946ec7e81c3e194e6f4cab51ab401676943`;
the reviewed manifest remains
`5c1fc3a62af4cf1b626947ff37eb116db026a0e10fb35d06f02a432cc7a38427`.
This supersedes pending/no-promotion status only for those images. The original
`12-09-39` proposal remains superseded, not separately accepted.

The existing `visual:approve` validator checked the unchanged source, recorded
renderer and exact candidate hashes, then promoted only the 148 explicitly named
cases. They are all new references. Root and an independent read-only audit verify
that every prior registry entry and every prior image hash is unchanged. There
are exactly 1,084 registry entries and 1,084 PNGs, with no extra accepted IDs.

Before/after evidence is retained in
`.cache/products-browsing-before-approval.json` and
`.cache/products-browsing-promotion-proof.json`; the latter records the new
path/NUL/content aggregate
`56dc098b00be7c7f6f0a13f7adb42101812dba4d58d18e9988d27c1c1d58c86c`.
The index is empty and HEAD remains the user's `3ae4cbd` checkpoint. No source,
renderer, font, tolerance, staging or commit change accompanies this promotion.

This accepts the simulated appearance, not a production paging guarantee.
The current wire `PageInfo` supplies only opaque Previous/Next tokens and an
optional estimated record total; the catalogue contract excludes stable page
numbers and direct jumps, and Products search pagination remains undefined.
The preview's page number still comes from the synthetic provider. The known
intermittent legacy icon comparison and pre-existing Basque toolbar observation
remain unresolved; visual approval does not claim they were fixed.

Post-promotion comparison `2026-11-17T13-02-39.166Z` passes 147/148 cases.
`products-browsing-catalogue-invalid-offpage--mobile` differs by one pixel above
the existing threshold in a toolbar button border. Raw diagnostics find 25
small colour differences around existing control borders, with no shifted layout
or changed copy, inside `(25,103)`–`(245,159)`. The approved reference is unchanged;
actual/expected/diff images and pixel diagnostics are preserved in
`.cache/products-browsing-post-approval-variance/` and the source-bound report.

Three isolated comparisons in `2026-11-17T13-05-33.240Z` produce two passes and
one failure with the same one-pixel comparison difference. No further repeats
seek a clean run. This remains an intermittent comparison, not a fixed renderer
or wholly green post-promotion run. The earlier seven-pixel legacy icon variance
also remains; source, images, fonts, renderer and tolerance were not changed to
suppress either issue.

`.cache/products-browsing-post-approval-proof.json` verifies the exact 148 promoted
hashes, preservation of all 936 prior entries/images, the 1,084-reference aggregate,
actual comparison statuses, unchanged source/HEAD and empty index. Successful
observations across the recorded source-matched runs cover all 1,084 case IDs;
this does not remove the two cases' intermittent failures. Formatting, seven-change
strict OpenSpec validation, local-link checks and `git diff --check` pass.
No further flow, API work, staging or commit is initiated by visual approval.

## Commit preparation — 2026-11-17

After visual acceptance and promotion, root recommended checkpointing the browsing
work in two batches, with the user executing each commit. The user said **“go
ahead”**. This grants new staging authority for these sequential batches only,
superseding earlier no-staging language for them. **Never create commits.** The
Basque toolbar, rendering investigation, product creation and backend/API work
remain separate; no follow-up feature starts with this preparation.

Starting HEAD is `3ae4cbda0ce31410302bfb81abd5b9578a00eb8f`, with an empty index.
The unchanged source/build is `5f628f39…`; all 1,084 accepted references have
aggregate `56dc098b00be7c7f6f0a13f7adb42101812dba4d58d18e9988d27c1c1d58c86c`.
The approved run is `2026-11-17T12-43-29.019Z`. A read-only scope audit confirms
31 implementation/documentation files and 149 reference files, with no production
app source, dependencies, generated/cache files, secrets or sibling changes.

### Batch 1 — Simulated Products browsing and specification

Stage exactly **31 files** (23 modified and eight new): the synthetic browsing
model/provider/controller/stories, shared table/edit/recovery integration and CSS,
five catalogue dictionaries, browser/model coverage and capture configuration/
actions/inventory, OpenSpec discovery/plan/proposal/requirements/tasks, visual
guide and root/app/context pointers. Include the two existing navigation Markdown
closeout records confirming the user's prior `a3363fc`/`3ae4cbd` checkpoint;
they contain no navigation UI changes. No reference belongs in this index.

After exact path/blob/mode verification and required checks, give the user:

```sh
git commit -m "feat: add simulated product catalogue browsing"
```

### Batch 2 — Specifically approved browsing references

Only after the user commits the exact first batch, verify that commit against its
prepared manifest and inspect the remaining worktree. Then stage exactly **149
files**: `visual/references.json` plus the 148 approved new PNGs from the identified
run. Preserve every prior registry entry and all 936 prior image hashes. Give
this command only after staging/verifying that second batch:

```sh
git commit -m "test: accept product browsing visual references"
```

The ignored exact path/blob/mode manifests are
`.cache/products-browsing-implementation-batch.json` and
`.cache/products-browsing-reference-batch.json`, with separate staged proof.
The second manifest waits for the verified first user commit before its parent
can be fixed. Do not include caches, generated output, unrelated staged work,
pushes, deployments or new design. This preparation never authorizes an agent
commit.

### Checkpoint verification boundary

The browsing source was verified with 134 code tests, 179 full browser checks
(30 focused) and 148 successful candidate captures. Recheck root quality and
documentation for this preparation, and verify the source and reference hashes
remain unchanged. Do not rerun browser/capture suites merely for staging unchanged
bytes. Preserve the actual visual comparison limitations: original-scope 935/936
with one intermittent icon case, promoted-scope 147/148 with a one-pixel border
case (two passes/one failure in isolated checks). There is no wholly green visual
comparison or renderer-fix claim. The page number remains synthetic and production
Products search pagination remains undefined.

Batch 1 is staged for the user, with all 149 reference files outside the index.
Fresh `pnpm check` passes all 134 code tests plus formatting/lint/types; all seven
OpenSpec changes validate strictly, local links and diff checks pass. The prepared
source and 1,084-reference hashes are unchanged. Exact staged path/blob/mode and
reference-exclusion proof is retained in `.cache/products-browsing-staging-proof.json`.
The next action is the user's first commit, then verification of that exact commit
before staging batch 2. No agent commit or further feature work is authorized.
