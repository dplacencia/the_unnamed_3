# Products filters and applied-view preview plan

**Goal:** complete the already selected PT-010–012 filter/applied-view behavior in
the existing simulated Products table and make the result reviewable.

**Architecture:** extend the current Products view model and TailAdmin/TanStack
preview rather than introducing another table or production route. Keep draft
filter choices separate from the applied view, use the existing preview's scoped
per-tab view retention and preserve independent business-edit/recovery state.

**Tech stack:** existing React, TypeScript, TailAdmin, TanStack Table, Vitest and
pinned Playwright/Chromium. No new dependency or production persistence/API.

## Starting checkpoint and authority

The user selected **“Products filters and applied view (Recommended)”** after the
proposed frontend design pass to complete the approved filter and applied-view
rules. This authorizes the bounded simulated preview below, including archived
inclusion, scoped positive recorded stock, Aplicar/Cancelar, removable applied
labels, scoped clearing, per-tab retention and interaction with editing/recovery.
It is scope authorization, not approval of unreviewed placement, dimensions,
visual references or a new business-data policy.

Before this new pass, root verified the user's two completed checkpoint commits:

- **`b6756f7`** contains the recovery implementation/specification/test batch.
- **`9849d58`** contains its approved reference-image/registry batch.

That checkpoint was clean with no pending staged changes before this pass. Task
9.21 is complete; both staging authorizations are spent. They do not authorize
staging new filter work. Never create commits.

The accepted baseline remains **832 references**, including the approved
232-image recovery/Products revision. Preserve it during this pass. The separate
**20 navigation revisions** (12 replacements and eight new images) remain
unapproved. The deferred message-box redesign is outside this assignment.

## Selected functional behavior

Read [PT-010–012](specs/products-table/spec.md#requirement-pt-010--initial-optional-filters)
and [PT-042](specs/products-table/spec.md#requirement-pt-042--confirmed-stock-matches-with-incomplete-results-notice)
and their scenarios before implementation. Existing browsing, editing, exact-value,
location, ownership and recovery requirements remain applicable.

- Defaults exclude archived products and do not exclude an otherwise eligible
  product merely for zero recorded stock or no stock record.
- Filtros offers Incluir archivados and, with selected-location stock context,
  Solo con existencias registradas. Inclusion does not reactivate products or
  change identifiers. Stock-only means positive recorded on-hand in the configured
  reservation dimension under Inventory's meaning, not available-to-sell.
- The user additionally selected **“Confirmed matches + incomplete-results notice
  (Recommended)”** under PT-042. Show only confirmed positive matches and a clear
  notice/count of otherwise query/archive-eligible products that could not be
  assessed. Unknowns are not zero or confirmed nonmatches. If no positive match
  can be confirmed while unassessed candidates remain, do not claim a complete
  empty result. Waiting for all stock was not selected; exact notice copy and
  visual metrics remain review proposals.
- Filter edits remain drafts until Aplicar. Cancelar, Escape or closing without
  applying discards the filter draft and preserves the applied view.
- Applied filters have individually removable labels outside the closed panel.
  Removing one leaves the other view controls/filters intact. Limpiar filtros
  restores only filter defaults, preserving submitted search, sort, density and
  stock/location context; existing column preferences remain independent.
- Hiding stock clears its stock-only filter from both draft and applied state.
  Showing stock again leaves that filter off until explicitly requested again.
- Submitted search, selected sort, applied filters and density are remembered per
  tab in the same business. Returning restores applied choices; a new tab uses
  defaults. Leaving Products discards unsubmitted search/filter drafts, not
  business-edit drafts or submitted recovery records.

## Required pre-code assessment

Root must assess these existing meanings/integration points before writing the
new behavior. Record the evidence and implementation implications here; do not
silently resolve a missing product decision through fixture code.

1. **Positive recorded stock:** inspect the owning Inventory meaning and the
   current synthetic stock representation. Identify the configured reservation
   dimension, exact positive/zero/negative/no-record distinction and any
   verification/unknown states. Do not parse a formatted display string into an
   approximate number, sum unlike measurements, substitute another location or
   treat holds/allocations as changing recorded on-hand. Unknown/failed reads
   must not become zero or a confirmed negative condition. PT-042 now selects
   confirmed matches plus the incomplete-results notice/count; concrete stock
   classification still follows the owning meaning, not a UI guess.
2. **Hidden validation correction:** trace current table/panel drafts, the
   complete requested validation gate and the hidden-field correction path.
   Filtering a row out must not discard its unsent edits, omit its errors from
   validation or leave its correction inaccessible. Correcting it must preserve
   the applied query/filters and the typed field rather than silently clearing
   the merchant's view or remounting the active correction field. Root has
   identified the existing mini field-review path that already preserves the
   view; reuse it rather than selecting a new correction policy.
3. **Applied view scope:** inspect existing per-tab fixture namespaces and return/
   new-tab behavior before adding retained filters. Preserve business isolation,
   stock/location rules and truthful fallback limits. This does not select a new
   production storage mechanism, browser-reopening guarantee or cross-tab shared
   preference. Assess location/context changes against the selected requirements;
   do not invent aggregation or an unsupported scope-switch policy.

These are implementation/source checks, not approval of new matching, quantity,
refresh, ownership or production persistence policies.

## Verified pre-code source findings — 2026-11-16

Root's read-only source assessment confirms that stock-only uses the product's
explicit configured reservation dimension, not any positive measurement, a
selected display unit or available-to-sell. Known recorded values marked as
needing verification remain known: a known positive qualifies while its
verification flag remains visible. An unknown configured dimension is not
rescued by a positive secondary measurement. The canonical product-search
contract's relevant clauses are in
`the_unnamed_1/openspec/specs/inventory-product-search/spec.md:124–155`, with the
owning quantity rules checked alongside them. These are source findings, not
executed backend tests or a new frontend business policy.

The preview may add explicit fixture-only reservation-dimension metadata so its
classifier can preserve that owning meaning instead of inferring it from rendered
text. Root also identified the existing hidden-field mini-review path, which
already preserves the view and active correction field. The new filters must
reuse and regression-test that path; no new correction policy is selected.
Per-tab return/new-tab integration and actual implementation proof are recorded
below under tasks 10.2–10.5. The inspected sibling source checkpoint was
`abc8dead6247765ff3a506925b6af49af733827e`; no sibling files were written or
backend tests executed. Quantity verification/unknown distinctions were checked
in `inventory-quantities/spec.md` alongside the product-search contract.

## Presentation proposal for review

Reuse the compact toolbar's existing TailAdmin treatment for Filtros. Propose a
small requested panel with the eligible checkboxes and clear Aplicar/Cancelar
actions, plus a compact line of removable applied labels and Limpiar filtros.
Keep the panel and applied-state explanation usable on phones and by keyboard.

Placement, exact spacing, panel dimensions and chip treatment remain review
proposals. Keep readable labels and retained control/touch targets. Do not add
another permanent table column or reduce product/editor space merely to fit the
filter controls. Preserve the approved compact row markers/tints, recognizable
chevron, visible touch expansion, field errors and current message surfaces.
This pass does not redesign the deferred message box.

## Task 1 — Selected state and filter logic, test first

Extend `apps/backoffice/.storybook/stories/products-table-model.ts` and its
existing visual model tests, or add focused `visual/products-filters.test.ts`
where that keeps the behavioral tests clear. Keep view draft/applied state separate
from product drafts and immutable submitted commands.

Write meaningful failing tests, run them to confirm the expected missing behavior,
then implement the smallest necessary functions. Cover default/archived inclusion;
known exact positive, zero, negative and no-record fixtures using the assessed
stock meaning; PT-042's otherwise-eligible unassessed-product count and truthful
empty-subset notice; draft versus applied choices; individual removal and scoped reset;
stock hiding; and valid scoped restoration/new-tab defaults. Test unknown cases
according to the recorded source assessment, without guessing their values.

Run the focused Vitest files through `visual/vitest.config.mts`. Preserve the
existing exact text/name/SKU validation and quantity presentation rules. Record
red/green evidence in ignored cache, not accepted screenshot files.

## Task 2 — Existing preview integration and interaction regressions

Extend the existing `products-table-preview.tsx`, `products-table-preview.css` and
`products-table.stories.tsx` with the requested filter controls and concrete
fixtures. Reuse the current controller/table, stock/location scope, TailAdmin
primitives and `.storybook/messages/{es,en,ca,gl,eu}.json` dictionaries. Touch
`products-editing.tsx` or recovery preview integration only where needed to
preserve the already selected hidden-error and pending-work behavior; no retry,
ownership, confirmation or submitted-command meaning changes.

Add failing browser assertions before the new interactions, using
`visual/tests/products-table.spec.ts` or a focused `products-filters.spec.ts`.
If a new browser file is used, register it in both existing language and focused
Products configurations. Verify:

- List rows stay steady while filter choices are drafts; Aplicar changes the
  applied set, and cancel/Escape/outside close restores the prior choices.
- Confirmed matching rows and PT-042's unassessed count/notice are distinct,
  including an empty confirmed subset with unresolved eligible candidates;
  query/archive exclusions do not inflate the incomplete-results count.
- Stock-only is offered only with its selected stock/location context. Individual
  label removal and Limpiar filtros preserve unrelated controls. Hiding stock
  clears draft/applied stock-only state, including while the panel is open.
- Returning within the same tab/business restores the applied view, while a new
  tab uses defaults and unapplied view drafts do not reappear as applied choices.
- Filtering away an edited/invalid product preserves its draft, the all-requested
  validation gate, truthful edited count and accessible correction path. Field
  review preserves current filters/search and keeps the correction input stable.
- Pending recovery records and affected-product protection survive view changes;
  hidden rows do not erase uncertainty or original commands. Other eligible work
  remains available under the existing rules; no confirmed change is resent.
- Five-language labels/errors, keyboard focus, panel dismissal, removable-label
  accessible names, phone scrolling/reachability and applicable accessibility
  checks remain usable with the retained dense table.

No new search matching, sorting semantics, pagination, production journal,
background refresh or cross-user preference is selected by this pass.

## Task 3 — Verification, candidate scope and visual review

Update `visual/products-actions.ts`, `visual/inventory.json` and the visual guide
for concrete filter/applied-view states after the interaction design exists.
Audit actual affected existing cases and new cases before choosing capture and
comparison selections. Counts were intentionally unassigned at planning time;
the executed audit below identifies the actual candidate/comparison selections.

Run the relevant focused tests, required repository quality checks and prepared
browser checks with the pinned runtime. Refresh task-owned preview/source identity
after preparation rather than reusing a stale server. Include five-language
assembled-view checks and desktop, tablet, mobile and desktop-dark candidate
coverage. Inspect open/draft/applied/cancel states, chips, scoped clearing,
stock/location context, hidden-field correction and recovery interaction.

Compare genuinely unchanged accepted cases with precise exclusions for new/
revised candidates and the separately pending navigation cases. Preserve all
832 accepted reference images and registry entries until specific approval.
Record actual commands, counts, source/renderer/run identities, red/green evidence,
independent review and limitations here. Existing passing recovery/reference proof
is a starting checkpoint, not proof of new filter behavior.

Present the exact candidate gallery and interactive preview for user review.
Successful tests/captures/comparisons do not accept those images, promote
references or authorize staging, commits or deployment. Production API/search,
quantity interfaces, persistent journals/ownership enforcement, pagination and
the deferred message-box redesign remain outside scope.

## Execution and verification — 2026-11-16

The simulated preview now implements separate filter drafts and applied choices,
archive exclusion/inclusion, the configured-dimension stock classifier, PT-042's
incomplete-results notice, removable applied labels and scoped clearing. The
Filtros control sits beside the search form; it never submits an unsubmitted
search draft. Existing TailAdmin controls and all five catalogue languages are
reused. No dependency or production source was added.

Filtering operates on the visible table projection while the editor retains its
complete product records, validation gate, correction field and recovery state.
The existing hidden-field mini-review corrects an excluded product without
clearing the view or remounting its active field. Recovery information remains
available when its affected product is filtered out. No retry/ownership command
semantics changed.

Applied preferences remain scoped to the current preview tab/business. A real
opener-created tab exposed copied `sessionStorage` preferences in the recovery
preview namespace. The correction clears only the two known Products view
prefixes on fresh entry; same-tab return/reload and unrelated keys are retained.
This is preview preference handling, not a production journal or tab lock.

### Test-first evidence

Meaningful failing model assertions established missing default/archive/view
behavior, configured stock membership, malformed-retained-view fallback and the
copied recovery-namespace bug before their respective fixes. The final focused
model file has **29 passing tests**. Evidence is retained in ignored cache:

- `.cache/products-filters-model-red.log`,
  `.cache/products-filters-model-red-stock.log` and
  `.cache/products-filters-model-red-retention.log`.
- `.cache/products-filters-model-red-new-tab.log` and
  `.cache/products-filters-model-green-new-tab.log`.
- `.cache/products-filters-browser-red.log` records the actual old archive-default
  failure, rather than merely testing for a missing control.
- `.cache/products-filters-opener-red-behavior.log` records the actual copied
  recovery-view failure; `.cache/products-filters-opener-green.log` passes the
  same browser scenario after the fix. A child's earlier port-permission failure
  was infrastructure evidence, not the behavioral RED.

Five native-runtime probes for decimal strings ending in line terminators passed
without a parser change. They are additional boundary checks, not a fixed regex
bug or a fabricated red/green cycle. The exact decimal classifier remains a
synthetic fixture helper, not a production quantity parser/profile.

### Final source and executed checks

Final source: **`3bf129963ace31f7af3449298afc9655484f33b6abb14acb1dd6096cecc0f618`**.
The prepared build identity matches this source. The retained approved renderer
is macOS 27 arm64, pinned Chromium `158.0.8127.18`, Playwright `1.65.0`, GPU
disabled, DPR 1, with font manifest
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
Comparison settings remain threshold `0.01`, `maxDiffPixels: 0`.

| Check                                         | Final result / evidence                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                  | Passed formatting, all lint/type checks and **113 code tests**: 34 app + 79 visual/model. `.cache/products-filters-check-verified.log`.         |
| Prepared Storybook rebuild and coverage audit | Passed; `.cache/products-filters-build-verified.log`. Production app source is unchanged; no new full production build is claimed.              |
| `pnpm visual:test-languages`                  | **139 passed**, including five-language catalogue/navigation/Products/recovery/filter checks. `.cache/products-filters-languages-verified.log`. |
| Focused Products browser suite                | **86 passed**; overlaps the combined suite and is not an additional 86 unique cases. `.cache/products-filters-browser-verified.log`.            |
| Products candidate capture                    | **440 passed** in `2026-11-16T17-45-52.365Z`; zero skipped/unexpected/flaky cases. `.cache/products-filters-capture-verified.log`.              |
| Unchanged-reference comparison                | **451 passed** in `2026-11-16T17-50-31.055Z`, exit 0, zero skipped/unexpected/flaky cases. `.cache/products-filters-compare-verified.log`.      |

The final inventory audit has no missing/unknown source, unregistered/missing
story or duplicate-identity findings: **216 source modules, 84 stories, 21 view
entries and 230 scenarios / 920 matrix cases**. Twenty added filter, interaction
and language scenarios contribute 80 new cases. The 360 existing Products cases
also receive the shared requested filter control, so all **440 Products cases**
are current review candidates. The archive-expanded setup explicitly includes
archived products before expanding them; ordinary defaults correctly exclude
them. Captures use the visible controls rather than injected preference state.

Executed selections:

```sh
pnpm visual:capture --grep '(^| )products-'
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered|(^| )products-'
```

The latter retains the separate pending navigation exclusions and selects 451
unaffected approved cases. Candidate capture and comparison run sequentially
because their report paths are shared. Earlier 440-image captures and browser
checkpoints predate the final copied-tab/copy correction and are historical,
not final-source proof.

### Independent review and reference preservation

Independent final source review found no material issue in PT-010–012/PT-042,
configured stock eligibility, draft application/clearing, scoped retention or
hidden-edit/recovery isolation. Final-source visual review inspected:

- `products-filters-incomplete-empty--tablet.png`.
- `products-filters-hidden-draft--tablet.png`.
- `products-filters-gl-positive--mobile.png`.
- `products-filters-eu-panel--mobile.png`.
- `products-filters-ca-positive--desktop-dark.png`.
- `products-filters-eu-positive--desktop-dark.png`.

No material clipping/layout defects were found. Root additionally inspected the
final Spanish phone positive-results view. These samples complement, rather than
replace, the user's full gallery review.

Before promotion, all **832 accepted PNGs plus the registry** matched their Git blob identities at
`9849d58aee8fb45a8875cbbaf34c6c8c2dbc9eca`, with no missing/extra/mismatched
accepted file. That pre-approval path-NUL-content SHA-256 aggregate was
`99a0901f416b06befa0dddbbdf608d835f2eea77f465b6858b8e762ab22f9ccf`.
See `.cache/products-filters-reference-integrity.json`; no reference had yet been promoted.

Pre-approval documentation validation passed: repository formatting, all seven changes
under strict OpenSpec validation, 154 local file/heading links across the eight
changed Markdown documents, and `git diff --check`. The final candidate audit
confirms 440 distinct case IDs, 80 new/360 existing cases, valid SHA-256 hashes
for every PNG and matching source/build/capture/comparison identities; see
`.cache/products-filters-final-artifact-proof.json`. Both review URLs respond
with HTTP 200. The index remains empty; no changes were staged or committed.

## Current status

Implementation, source review, the final 440-image capture and 451-case
unchanged-reference comparison and documentation validation are complete. Review the
[interactive Filters example](http://localhost:6006/?path=/story/inventory-products--filters)
and [exact final candidate gallery](http://localhost:9324/runs/2026-11-16T17-45-52.365Z/review.html).
The user subsequently approved all 440 images and the exact set is promoted under
the record below. Post-approval verification covers all 891 eligible cases using
the source-matched partitioned proof below. The separate 20
navigation revisions remain unapproved and the message box redesign remains
deferred. Production integration, new staging, commits and deployment remain
outside this pass.

## Visual approval and reference promotion — 2026-11-16

The user replied **“I approve them. They looks ok”** to the delivered
[440-image gallery](http://localhost:9324/runs/2026-11-16T17-45-52.365Z/review.html).
This specifically approves all 440 images in run `2026-11-16T17-45-52.365Z`,
source `3bf129963ace31f7af3449298afc9655484f33b6abb14acb1dd6096cecc0f618`.
It supersedes the pending-approval status above for that exact set.

Root promoted only those approved cases: **80 new entries and 360 replacements**,
preserving the other **472 accepted entries/images** byte-for-byte and preserving
their registry metadata. The resulting baseline contains **912 references**.
The scoped promotion proof confirms each promoted PNG/registry hash, source/run
identity and verbatim approval, with zero preservation issues:
`.cache/products-filters-promotion-proof.json` and
`.cache/products-filters-promotion.log`. The before-promotion record is retained
in `.cache/products-filters-before-promotion.json`.

The independent read-only scope audit confirms the 440-case selection and all PNG
hashes. The full post-approval comparison selects **891 cases**: 440 Products plus
451 unaffected cases. Its 29 navigation exclusions include the separate 20
pending revisions (12 replacements/eight new), plus nine unchanged mobile cases
excluded by the retained broad profile selection. No navigation case is promoted.
The post-approval verification is recorded below. No new staging, commits,
deployment or product work is authorized. The 20 separate navigation revisions
remain unapproved and the message box redesign remains deferred.

### Post-approval comparison and capture preparation

The first full comparison, `2026-11-16T18-57-09.316Z` at approved source `3bf12996…`,
finished with **889 passed / two failed**. The failures are retained rather than
treated as accepted differences: Galician phone positive-results and Basque
tablet positive-results. All approved reference bytes and the comparison
threshold remain unchanged.

The Galician difference was an exact three-pixel downward shift of the sticky
header; all pixels below it were identical. An isolated probe measured
`window.scrollY === 3` after popover focus, reproduced the failed screenshot at
offset 3, and matched the approved image at offset 0. The durable browser
regression failed with **Expected 0 / Received 3** before the correction and
passes afterward (`.cache/products-filters-scroll-red.log` /
`.cache/products-filters-scroll-green.log`).

Only the positive-results capture action now restores the document origin and
waits two animation frames before capture. Product UI, other capture states,
quantity/filter behavior, approved images and tolerances are unchanged. The
correction and regression test change the verification-source identity to
**`9be242374fa3080c4cca51ea7bca4a897837f8041751b9968623853902f4f58b`**;
Storybook was rebuilt and its local previews restarted with that identity.
The approval remains attached to the original `3bf12996…` gallery, not a newly
accepted image set.

The Basque tablet difference affected seven counted pixels on the moon icon's
inner curve. No changed hover/focus/theme state was observed. Four isolated
Basque probes passed; a rendering/subpixel cause remains a hypothesis rather
than a confirmed product defect or claimed fix. Repeat comparison and the final
full run must verify the unchanged approved reference. The initial probe's
expected offset failures and original failed screenshots are preserved under
`.cache/products-filters-approval-probe/`.

All **24 repeated affected comparisons passed** in
`2026-11-16T19-08-06.781Z` (three runs of both locales across all four profiles),
exit 0 with zero skipped/unexpected/flaky cases. All **12 focused filter browser
checks** pass, including the new scroll regression, and `pnpm check` passes all
formatting/lint/types and **113 code tests**. Evidence is retained in
`.cache/products-filters-scroll-repeat.log`,
`.cache/products-filters-approval-browser.log` and
`.cache/products-filters-approval-check.log`.

Independent review found no issue in the scoped capture-only correction or its
regression. The next full 891-case comparison, `2026-11-16T19-09-00.718Z` at
verification source `9be24237…`, finished with **888 passed / three failed**.
Galician phone and Basque tablet now matched. The three differences were Spanish,
English and Catalan phone positive-results references: their approved headers had
retained scroll offsets of three, three and 53 pixels respectively. Independent
pixel inspection found exact shifted headers and identical pixels below those
regions. The corrected capture restores the origin rather than selecting
locale-specific offsets or changing tolerance.

Before the subsequent three-image promotion, the 912-entry baseline's
path-NUL-content SHA-256 aggregate was
`f8413f77dce88a4cfc186c897e333bcaa19336274785b24297f108616ff7dcfb`.

### Three normalized phone references — approved 2026-11-16

Root captured exactly these three corrected phone cases in
[run `2026-11-16T19-15-26.254Z`](http://localhost:9324/runs/2026-11-16T19-15-26.254Z/review.html),
source `9be242374fa3080c4cca51ea7bca4a897837f8041751b9968623853902f4f58b`:

- `products-filters-positive--mobile`.
- `products-filters-en-positive--mobile`.
- `products-filters-ca-positive--mobile`.

The three captures passed with zero skipped/unexpected/flaky cases. Their hashes
were verified, and each is byte-identical to the corresponding actual image from
the preceding full comparison. The user specifically selected **“Approve the
three capture-only replacements”** after receiving that exact gallery and the
reason for renewed approval. This authorizes those three replacements only.

Root promoted the exact selection, preserving all other **909 references and
registry entries**. The accepted baseline remains **912**. Proof:
`.cache/products-filters-scroll-promotion-proof.json`; the original promotion
and the two failed full comparisons remain recorded above.

Fresh post-approval verification passes **nine comparisons** (three repetitions
of each replacement) in `2026-11-16T19-18-35.840Z`, exit 0, zero skipped/
unexpected/flaky cases. The other **888 cases** already passed in
`2026-11-16T19-09-00.718Z` at the identical source/build, and their reference PNGs
and registry entries are proven unchanged by the three-case promotion.
The union covers exactly all **891 eligible case IDs**, with no missing/extra
case or changed previously passing reference. This is partitioned verification;
the preceding full run's failed statistics are preserved above. See
`.cache/products-filters-completed-comparison-proof.json` and
`.cache/products-filters-scroll-post-approval.log`.

Current accepted-reference aggregate (registry followed by sorted PNG paths,
path-NUL-content SHA-256):
`5c536153dae8a9c86ba6d0a30fa7615df789f9405149afbe0c5000ca8b7a9f67`.
All selected images are approved/promoted. Separate navigation revisions remain
unapproved; message-box redesign remains deferred. No staging or commit follows.

Final approval closeout passes repository formatting, strict validation of all
seven OpenSpec changes, 159 local file/heading links across eight changed Markdown
documents, and `git diff --check`. The index is empty. No agent created a commit.

## Commit preparation — 2026-11-16

After approval and verification, root recommended preparing the implementation
and visual-reference commit batches. The user replied **“go ahead”**. This is
new staging authority for these exact two sequential batches; prior statements
that image approval alone did not authorize staging remain historical. The
standing instruction **never create commits** remains absolute.

Starting checkpoint: `9849d58aee8fb45a8875cbbaf34c6c8c2dbc9eca`, with an empty
index. The current verification source is unchanged at `9be24237…`, matching the
completed comparison proof. The 912-reference working tree matches the approved
aggregate `5c536153dae8a9c86ba6d0a30fa7615df789f9405149afbe0c5000ca8b7a9f67`.

### Batch 1 — Implementation, specifications and verification tooling

Stage exactly **24 files**: the preview model/UI/story, five language dictionaries,
filter model/browser tests, visual inventory/actions/configuration/guide, Products
OpenSpec artifacts and current agent/configuration entry points. The three new
files are this plan, `visual/products-filters.test.ts` and
`visual/tests/products-filters.spec.ts`; the other 21 are existing files.

Keep all reference files outside this first index. No production route, navigation
source, dependency/lockfile, generated/cache file, real API/persistence/ownership
mechanism or deferred message-box design is included. After checking the exact
staged paths/content, give the user this command without executing it:

```sh
git commit -m "feat: prototype product filters and retained table views"
```

### Batch 2 — Approved reference registry and images

After the user commits batch 1, verify that commit against the prepared manifest
and inspect the remaining working tree before staging batch 2. It contains
**433 actual Git paths**: `visual/references.json`, 352 changed existing PNGs and
80 new PNGs. The registry records all 440 approved cases; eight of the 360
reapproved existing images have unchanged bytes and need no PNG file change.
The three normalized phone images already carry their separate exact approval.

Only this approved Products selection is included. Preserve all unrelated
references, the separate 20 pending navigation revisions and the 912-entry total.
Give the user the second command only after staging/verifying that batch:

```sh
git commit -m "test: accept product filter visual references"
```

Ignored `.cache/products-filters-implementation-batch.json` and
`.cache/products-filters-reference-batch.json` retain the exact file/hash manifests;
staged verification proof is separate. No agent commit, push, deployment or new
design follows. At preparation, batch 2 waited for the user's first commit.

### Completed checkpoint

The user committed batch 1 as `382cfcdbb61ab83aeddb833bb61446cb7d43d236` and
batch 2 as `3853ee6860cd75eccd95217c001c6d0bd5dd9d80`. Root verified the exact
24/433 changed paths, every prepared Git blob identity, parent relationship,
unchanged source `9be24237…`, all 912 references/approved aggregate and a clean
index/working tree. Independent read-only review corroborated the commit scope
and clean status. The ignored completion proof is
`.cache/products-filters-checkpoint-complete.json`.

Both staging authorizations are spent. No agent committed or pushed. The later
message-box discovery assignment has its own [scope record](feedback-design.md)
and does not reuse these staging permissions.
