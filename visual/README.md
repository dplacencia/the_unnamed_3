# Local visual review

Storybook renders the real retained TailAdmin components. The Astro gallery uses
native Astro documents. Playwright checks registered interactions and captures
both catalogues and the actual static app views. Fixtures are technical examples;
The backoffice uses the approved first Irin configuration; the name remains
provisional. Product examples are bounded simulated designs, not production flows.

Use the pinned Node/pnpm tools described in the [root README](../README.md).

```sh
pnpm visual:install-browser
pnpm visual:prepare
pnpm visual:capture
```

Browser installation uses the repo-local `.cache/ms-playwright`. Preparation
builds both normal apps, extracts the actual backoffice font for Storybook, builds
both catalogues and audits the inventory. Re-run preparation after source changes.
Captures automatically start and stop their own previews when no matching preview
server is running. An occupied port serving another build fails the identity check.

For interactive inspection, run these in separate terminals:

```sh
pnpm visual:preview
pnpm visual:review
```

| Local URL                       | Purpose                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| http://localhost:6006           | Built Storybook: named examples, controls, theme/language selectors and viewport sizes       |
| http://localhost:3100           | Actual static backoffice                                                                     |
| http://localhost:4321           | Actual static landing                                                                        |
| http://localhost:4323/__visual/ | Native Astro catalogue                                                                       |
| http://localhost:9324           | Latest candidate review: images, preview links, filters, selected-case list and run metadata |

`pnpm dev:storybook` starts the live source catalogue at localhost:6008. Prepare
the app fonts first. Use the built previews for canonical captures. Stop the local
servers with Ctrl-C when finished.

The language toolbar updates example text, labels, descriptions and form errors
using the catalogue-only dictionaries in `apps/backoffice/.storybook/messages/`.
Storybook's own interface, component/API identifiers and native browser prompts
keep their tool/browser text. Fixture translations do not define product copy.
For Button, leave `label` unset to use the translated default; **Set string** adds
an explicit custom label that remains exact across language changes. **Reset
controls** restores the translated default. Typed values and open dialogs are
preserved when the language changes.

The current inventory covers 216 retained component source modules through 98
stories and 21 view entries. Its 271 named scenarios produce 1,084 captures across
desktop 1440×900, tablet 768×1024, mobile 390×844 and desktop dark mode. The actual
assembled views cover Spanish, English, Catalan, Galician and Basque. Compound
primitives and icons are inspected in compositions; this is representative source
coverage, not every possible prop combination or complete accessibility testing.

## Products browsing at larger fixture sizes

Open the [browsing catalogue](http://localhost:6006/?path=/story/inventory-products-browsing--catalogue).
The 14 added examples use the existing shared Products table with 1,000 synthetic
products; Large Catalogue uses 10,000 solely to check bounded DOM rendering.
Previous/Next replaces the displayed group. Vista offers 25/50/100 products per
page; the default is 50. Selection and demo sorting apply before projection.
The current page appears between the directional buttons after a successful
read. During loading/errors it stays with the displayed rows, independently of
the estimated total; short groups do not cause skipped or inferred page numbers.
The existing editor retains all drafts, including products on other groups.
Off-page changes and field errors have an explicit review path.

Loading, prior-result scope, technical errors/Retry, missing/supplied/zero estimates,
short groups with continuation and unusable-position restart have dedicated
fixtures. A delayed fixture demonstrates that late responses cannot replace a
newer submitted view. Read retries remain independent of original write recovery.
The stored fixture position/page size uses the existing best-effort tab namespace;
returning requests fresh data. This is not a production preferences or API adapter.

The [bounded implementation plan](../openspec/changes/define-products-table/browsing-preview-plan.md)
records authorization, checks and the exact review set. These 37 new scenario
states contribute 148 reviewed images, including responsive/dark cases and
assembled English/Catalan/Galician/Basque examples. The user approved these 148
additions, preserving all 936 previous references, for 1,084 accepted references.

The current [148-image review](http://localhost:9324/runs/2026-11-17T12-43-29.019Z/review.html)
was approved with **“Approve all 148 images”** at source `5f628f39…` and is promoted.
It supersedes the unapproved initial
`12-09-39` proposal. Root checks pass 134 code tests; the full interaction/language
suite passes 179 browser checks, including 30 focused browsing cases. The
[page-number revision record](../openspec/changes/define-products-table/browsing-preview-plan.md#current-page-indicator-revision--2026-11-17)
retains the exact source/check/comparison evidence and the separate pre-existing
Basque mobile toolbar observation. References, fonts and tolerances are preserved.
The original-scope comparison is 935/936: the remaining tablet
moon-icon case stays intermittent, with one pass/two failures in isolated checks.
The plan preserves the failures and makes no renderer-fix or wholly green claim.
The [approval record](../openspec/changes/define-products-table/browsing-preview-plan.md#visual-approval-and-reference-promotion--2026-11-17)
verifies exact promotion and preservation. The displayed page number remains a
synthetic preview value; Inventory currently provides no authoritative page number.
Post-promotion comparison passes 147/148; the phone invalid-off-page case has a
one-pixel button-border variation and passes two of three isolated checks. Both
comparison runs and the preserved-image proof remain in the approval record;
this is not a wholly green comparison or a fix for rendering intermittency.

```sh
pnpm visual:capture --grep 'products-browsing-'
pnpm visual:compare --grep-invert 'products-browsing-'
```

Current demo matching/sort, fixture handles and known fixture estimates do not
define an Inventory Products pagination API or production search rules. The
10,000-record check is not a capacity or timing benchmark. No production business
writes, persistence, cross-tab ownership or backend changes are implemented here.

## Products change feedback

Open the [recovery example](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted)
and [mixed save results](http://localhost:6006/?path=/story/inventory-products--editing-mixed).
The selected feedback revision uses a consistent compact inline summary and
expandable product details in both surfaces. They retain separate state sources,
initial/new-result visibility, per-product/per-field facts and eligible command
actions. Collapsing details leaves uncertainty and applicable capability notes
visible; opening details does not restart a command.

The Details label and chevron expose the actual expanded state; the accessible
name includes the visible translated label. Existing row markers and draft/
history-only notices stay outside this redesign. Field validation, confirmation
dialogs, a general notification system and production mechanisms remain separate.

The user accepted the exact **164-image** revision with **“that looks ok”** on
2026-11-16. All 148 existing/16 new entries are promoted, preserving the other
764 references, for **928 accepted references**. The
[feedback approval record](../openspec/changes/define-products-table/feedback-preview-plan.md#visual-approval-and-reference-promotion--2026-11-16)
preserves the exact gallery/source/approval and verification proof. That checkpoint
used this 907-case selection while navigation remained separately pending:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

The final [164-image gallery](http://localhost:9324/runs/2026-11-16T20-34-28.774Z/review.html)
is approved at source `8ac7d6d2…`. Code tests and all 149 browser checks pass.
All 164 changed-case post-approval comparisons pass; the other 743 cases retain
their matching-source passing proof and unchanged references. This verifies all
907 eligible IDs across those partitions. The plan preserves the earlier
seven-pixel icon variance and failed initial run; no renderer fix or tolerance
change is claimed. Future revisions still require specific approval.
The later navigation approval below closes those exclusions and raises the current
accepted baseline to 936, covering every inventory case.

## Products filters and applied view

Open [Products/Filters](http://localhost:6006/?path=/story/inventory-products--filters).
This simulated preview completes the selected filter controls with the existing
TailAdmin/TanStack table. The example includes an archived product to exercise
default exclusion and requested inclusion; its records are synthetic.

Filtros sits beside the search form, with a visible label on phones as well as
desktop. Checkbox choices remain drafts until Aplicar; Cancelar, Escape and
outside dismissal discard them. Applied labels can be removed independently;
Limpiar filtros preserves query, sorting, density, columns and stock/location.
Hiding stock clears its filter in both applied and draft state. The stock-only
choice is offered only with visible stock and a selected location.

Positive recorded-stock matching uses the explicitly configured reservation
dimension. Other measurements and available-to-sell do not substitute for it.
Known recorded values needing verification retain their value and flag. Under
PT-042, confirmed positives are shown while otherwise-eligible unknown candidates
are counted in a clear incomplete-results notice. An empty confirmed subset does
not claim a complete empty result; counts remain query/archive/location scoped.

Filtering keeps the full business-edit/recovery records intact. Hidden validation
errors use the existing explicit correction field while preserving the applied
view. Retention remains the existing best-effort preview namespace, with applied
choices retained in the tab and fresh opener-created tabs using defaults. This
does not implement a production preference store, journal, cross-tab lock or API.

The 20 added filter/interaction/language scenarios contribute 80 new profile
cases. The user approved the exact [440-image gallery](http://localhost:9324/runs/2026-11-16T17-45-52.365Z/review.html)
with **“I approve them. They looks ok”** on 2026-11-16, source `3bf12996…`.
All 440 are promoted: 80 new, 360 replacements and 472 unrelated entries/images
preserved, for **912 accepted references**. Capture future revisions to this scope:

```sh
pnpm visual:capture --grep '(^| )products-'
```

At the completed filters checkpoint, this selection compared all 891 eligible
accepted cases with the separate navigation exclusions retained:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

See the [filters plan](../openspec/changes/define-products-table/filters-preview-plan.md)
for selected decisions, source assessment, actual execution proof and review
status. The 451 unaffected comparisons passed before promotion in
`2026-11-16T17-50-31.055Z`. Post-approval verification covers all 891 eligible
cases at source `9be24237…`: 888 unchanged passing cases plus three normalized
phone replacements specifically approved in
`2026-11-16T19-15-26.254Z`, promoted and verified by nine repeated comparisons in
`2026-11-16T19-18-35.840Z`. The capture-only correction restores the screenshot
document origin after focus scrolling; product UI and tolerances are unchanged.
The plan retains the initial failed runs and exact partitioned proof.
The separate navigation
review, message box redesign, new matching or
pagination choices and production integration remain outside this pass.

## Products recovery and ownership preview

The user authorized the bounded [recovery preview plan](../openspec/changes/define-products-table/recovery-preview-plan.md).
Open the following Storybook examples for interactive review:

- [Unconfirmed save and manual retry](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted).
- [Automatic recovery](http://localhost:6006/?path=/story/inventory-products-recovery--automatic).
- [Restored submitted work](http://localhost:6006/?path=/story/inventory-products-recovery--restored).
- [Unreachable editor and explicit takeover/discard](http://localhost:6006/?path=/story/inventory-products-recovery--unreachable-editor).
- [Changed-data review](http://localhost:6006/?path=/story/inventory-products-recovery--changed-draft).
- [Former editor returning read-only](http://localhost:6006/?path=/story/inventory-products-recovery--former-editor).

The 16 recovery stories cover 51 registered states and 204 desktop/tablet/mobile/
dark matrix cases, including five-language assembled-view examples. Retry deadlines
retain the selected 15-second profile; browser checks control time rather than
shortening that profile. Unknown and confirmed outcomes remain distinct while
other eligible products can be edited/saved. Retained drafts use the explicit
continue/discard flow and changed-data review. A second edit is rejected for a
known active editor, while an unreachable editor permits the selected explicit
resolution. Switching editors respects existing unsaved work.

Commands and responses are synthetic. Retention modes, data comparison and owner
states are predefined fixtures; an old editor's return is virtual. There is no
actual IndexedDB journal, browser-tab lock or API integration. The unavailable
history example supplies no restored command or guessed values; its current
catalogue is an independent synthetic fixture. Whole-list/focus/first-change
ownership acquisition and production behavior with unusable ownership coordination
remain undecided. Storybook Reset only resets the example.

Capture future revisions to these recovery cases with:

```sh
pnpm visual:capture --grep '(^| )products-recovery-'
```

The user approved the [exact 232-image latest gallery](http://localhost:9324/runs/2026-11-14T23-55-57.165Z/review.html)
with **“That looks better, I accept the review”**. Its source is
`88dfe48b0ba13a65b178592d12ae07f06a98f7d67ffd43e97c21870c0ac7d990`.
The approved set contains all 204 recovery cases and 28 affected Products copy
cases. It supersedes the earlier pending 172-image recovery and 200-image copy
review sets. Root promoted the exact selection: 204 new entries, 28 replacements
and 600 unrelated references preserved, for **832 accepted references**.
Read the [approval/promotion record](../openspec/changes/define-products-table/recovery-preview-plan.md#visual-approval-and-reference-promotion--2026-11-15)
for source, scope and verbatim evidence.

That 832-entry baseline was the preceding checkpoint; the filters approval raised
it to 912 and the current feedback approval to 928. Before the filters revision, the
811-case recovery checkpoint comparison used this selection:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

Those Products/recovery references were accepted for that source. The historical
post-approval comparison passes all 811 expected cases in run
`2026-11-15T00-12-39.768Z`, with zero skipped/unexpected/flaky cases and exit 0
(linked record/task 9.18). The final pre-promotion proof passed 84
code tests, 128 browser checks, 232 captures and 579 unaffected comparisons.
Those earlier comparison results are not a substitute for the post-approval run.
The prior initial-preview source `2058ed78…`/172-image proof is historical.
Simulation limits and compiler/font-alias evidence remain in the linked plan.
Future changes still need new captures and explicit image approval; this approval
does not accept the separate 20 navigation revisions or authorize staging,
commits or deployment. At that checkpoint, comparisons included the approved
Products revisions using the then-891-case selection. The current 907-case
selection is in the feedback section above. The formerly
deferred message-box revision is now covered by the feedback section above.

## Products browsing and editing design

Open http://localhost:6006/?path=/story/inventory-products--catalogue for the
first TailAdmin/TanStack Products design. TanStack Table is selected and
exactly pinned at 9.3.1, verified on 2026-11-13 as latest stable. The
[foundation record](../openspec/changes/define-products-table/foundation-decision.md)
contains the user's library and expansion choices.

The examples cover compact/comfortable rows, submitted search, requested scoped
stock, Vista column controls, independent read-only summaries and the details
panel. Editar in details and Editar tabla expose the selected name/missing-SKU
draft flows, with local validation and explicit saving. The save-result header
has a dismiss control; a compact last-outcome line keeps uncertainty explicit
and lets merchants reopen details. New save results reveal their own details.
Closing results does not change drafts or outcome facts. Existing SKUs, units,
barcodes and stock remain read-only. The in-app departure guard offers save,
discard or continued editing. Errors hidden by search/columns have an explicit
correction control that preserves the view. All data and save results are
synthetic; no business write occurs.

Try Comfortable, Hidden columns, Stock context, Sole location and Archived
product alongside Editing mixed and Editing unconfirmed. The latter examples
simulate individual outcomes: mixed confirms the first requested field and
rejects the rest; unconfirmed retains drafts/results and pauses submission until
the fixture resets. This pause is not a production recovery policy. Browser
closing/reload and production draft persistence were outside that initial pass.
The subsequent simulated recovery and applied-filter designs are now implemented
and accepted above; real retrieval and production mechanisms remain separate.
Read the
[editing plan](../openspec/changes/define-products-table/editing-plan.md) for scope
and the current run evidence.

At the historical first-editing checkpoint, the user approved all 156 images
from `2026-11-14T12-42-43.360Z` with “That looks ok, I approve all current revision.”
Their promotion preserved 472 earlier entries for a **628-entry baseline at that
time**. The [original approval record](../openspec/changes/define-products-table/editing-plan.md#visual-approval--2026-11-14)
retains its source and scope. The later 232-image approval replaced 28 of those
Products images and added 204 recovery references for a then-832-entry baseline.
The filters approval brought the baseline to 912 and feedback approval to 928.
The navigation approval below adds eight cases and replaces 12, bringing the
current accepted baseline to 936. All current inventory cases are approved.

To capture future changes to all 456 current Products cases (excluding the older
navigation Products-frame story), run:

```sh
pnpm visual:prepare
pnpm visual:capture --grep '(^| )products-'
```

`pnpm visual:test-languages` also runs the Products interaction, language,
accessibility and responsive checks. `visual/products-table.config.ts` provides
the focused suite with its own port/report. Future candidates require the same
explicit run/case approval as other designs. Do not promote future changes
automatically. The current editing run is recorded in the
[editing plan](../openspec/changes/define-products-table/editing-plan.md#review-refinement--dismissible-results-2026-11-14).

The completed filters checkpoint used this command for 891 cases. The feedback
checkpoint used it for 907 cases with the then-pending navigation exclusions:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

This includes all 456 Products cases and 451 other accepted cases. It excluded
eight then-unapproved navigation cases and all 21 mobile navigation cases,
including 12 pending replacements and nine unchanged cases. The navigation
approval below closes that review; current full comparisons need no exclusion.
The preceding
811-case post-approval comparison passed under task 9.18 in run
`2026-11-15T00-12-39.768Z`.

Historical post-approval comparison `2026-11-14T13-03-52.919Z` passed the then-current
607-case selection. The original editing approval record also documents the
capture-only focus-race correction and 24 repeated overview comparisons; those
source-bound checkpoints are not the new 811-case result.

## Navigation prototype

The counts and baseline references below record historical navigation checkpoints.
The current accepted baseline is **936**, covering the full current inventory.
The previously separate 12 replacement/eight new navigation images were approved
on 2026-11-17 and promoted; they were outside the older Products galleries.

The user authorized refreshing that exact review on 2026-11-16. Review the
[fresh 20-image gallery](http://localhost:9324/runs/2026-11-16T21-25-06.512Z/review.html):
12 phone replacements plus eight open/hovered dropdown states across four profiles.
All 20 captures pass at current source `8ac7d6d2…`; all nine unchanged phone
comparisons pass in `2026-11-16T21-25-34.167Z`. Their union with 907 existing
matching-source passing IDs verifies exactly 916 unaffected cases. All 20
candidate images were visually inspected, with no material layout finding.
The [review plan](../openspec/changes/define-backoffice-navigation/visual-review-plan.md)
records exact IDs, hashes, partitioned evidence and existing rendering limits.
The user then said **“I approve them”** for that exact 20-image gallery. All
12 replacements/eight additions are promoted, preserving the other 916 images
and registry records byte-for-byte. All 20 post-approval comparisons pass in
`2026-11-17T07-47-03.167Z`; their union with matching-source preserved evidence
verifies all 936 current case IDs. Read the [approval record](../openspec/changes/define-backoffice-navigation/visual-review-plan.md#visual-approval-and-reference-promotion--2026-11-17)
for exact approval/source/hash evidence and the retained icon-rendering limitation.
No staging or commit follows from image approval. Current full comparisons use:

```sh
pnpm visual:compare
```

Open http://localhost:6006/?path=/story/navigation-merchant-workspace--workspace.
The seven examples under Navigation/Merchant workspace cover the selected
navigation map, restricted direct links, no accessible module sections, permission
loading/error, a sole location and the compact Products frame. Permissions, locations and retry outcomes are
simulated; destination content is neutral. Use Storybook's theme, language and
viewport controls, and try selecting different locations on Existencias and
Movimientos. Production app routes remain unchanged.

The 23 navigation scenarios provide 92 candidate cases, including all five
languages. The user approved all 84 final images from
`2026-11-12T21-36-33.733Z` with **“I approve all revisions.”**. They are promoted
in `visual/references/` and `visual/references.json`, preserving the existing 388
cases. The full accepted baseline at that checkpoint had **472 images**. Future replacements
still require specific approval. To capture new navigation candidates and compare
the full accepted matrix:

```sh
pnpm visual:capture --grep 'navigation-'
pnpm visual:compare
```

Follow the same capture/run/case approval procedure below for future changes;
successful captures accept nothing.

The post-approval comparison `2026-11-12T21-47-49.746Z` passes all 472 accepted
cases with zero failed, skipped or flaky cases. The navigation design records
the exact approval, source and renderer identities.

Page choices persist during in-preview navigation and supported reloads, using
a fixture-only tab namespace. Fresh preview entry/re-entry and fixture-control
resets can clear the simulation. Fresh entries discard browser-copied session
storage, so opener-created tabs do not inherit another preview's choices. Direct
preview reload and whole Storybook-manager reload are browser-tested. Reloading
only an embedded iframe under a freshly entered manager is treated as fresh
entry. Browser-chrome reopening/session restoration is not verified. These are
development-preview limits, not production persistence guarantees.

The first user review selected a compact frame for information-rich work.
Prototype notices live in Storybook documentation, the page has one slim
title/location toolbar, and the large empty card is removed. Text/control sizes
are preserved. Access-check errors appear once in main content with Retry; the
compact module control hides its caret. Future table columns, row density and
editing behavior remain undefined. The earlier 72-candidate run was not approved;
use the fresh revision run linked from the navigation change's design.

The second review matches the compact Inventory button and icon to neighboring
controls, including footprint and alignment, and combines menu/title/location/
theme into one visible compact toolbar. The separate two-button header row is
removed only in this preview. Location controls wrap on small screens; hover is
not required to reveal controls. The same 76 cases are recaptured after this
revision, with the exact current run linked from the navigation design.

The third review narrows the collapsed rail to 64px with centred 44px targets,
uses 16px ghost header actions (36px desktop targets, 44px tablet/mobile), and
adds the initially open “Más opciones” footer toggle. It folds/unfolds the three
shared destinations using local preview state. The new expanded/compact folded
states add eight captures; review the current 84-case run linked from the design.
The subsequent thinner Ubicación refinement uses the existing 36px desktop
variant, retaining 44px tablet/mobile targets and 14px text in that same final run.
Production sidebar/header/theme components remain unchanged.

The subsequent post-commit mobile review selects NAV-019: below 640px, menu,
page title, compact location selector and theme share one 53px row. The phone
selector uses the short translated location label as its empty prompt. Long
titles/selected names may show an ellipsis; full location names remain in the
dropdown. All touch targets remain 44px high. Desktop/tablet presentation and
page-owned scope are preserved.

The revised capture `2026-11-12T22-04-18.822Z` contains 84 navigation cases:
12 changed mobile images and 72 byte-identical images. Review
http://localhost:9324/mobile-header-comparison.html for the 12 before/after pairs.
The 472 accepted references remain intact pending specific replacement approval.
During this revision, compare unaffected cases with:

```sh
pnpm visual:compare --grep-invert '^mobile .*navigation-'
```

That explicitly excludes the 21 mobile navigation cases; the candidate hash
audit identifies nine of those as unchanged and 12 as revised. A full comparison
against the previous baseline includes intentional differences until replacement
images are approved. Do not update references automatically.

The latest NAV-020–021 revision further slims the visible phone selector to 36px
while retaining a transparent 44px pointer target and unchanged text. Its location
options use contiguous full-width 44px rows, with full-row hover/keyboard highlight.
Two new open/hovered-option scenarios add eight captures. The revised/new images
require fresh approval; previous mobile correction captures are superseded for
this review. To compare existing unaffected cases while those images are pending:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|(navigation-workspace-location-options)|(navigation-workspace-location-option-hovered)'
```

Historical capture `2026-11-12T22-46-21.298Z` passed all 92 navigation cases:
72 byte-identical images, 12 phone replacements and eight new dropdown images.
Review the 20 new/replacement images at
http://localhost:9324/location-refinement-review.html. It superseded the earlier
mobile-only review at that checkpoint, when 472 references remained unchanged.
The fresh 20-image gallery above superseded that approval target and was
specifically accepted on 2026-11-17, bringing the current baseline to 936.

`pnpm visual:test-languages` also runs the navigation interaction suite, covering
five-language labels, independent choices, access-state distinctions, tab
isolation, drawer closing and keyboard focus restoration.

The added Brand/Explorations example is a development-only comparison of six
accent proposals and Source Sans 3, Inter and the original Outfit. New options
D/ink indigo, E/plum and F/graphite appear first; the earlier A–C remain for reference.
Open
http://localhost:6006/?path=/story/brand-explorations--basics and use the font,
theme and language controls. Fonts are bundled locally with their license and
source identities in `apps/backoffice/.storybook/assets/fonts/`. The user selected
D/ink indigo, its warm-neutral base and Source Sans 3 for the first backoffice;
the other options remain comparison references. Font controls affect only this
preview and preserve entered text. Its 12 font/profile images are included in
the approved 388-case baseline as technical comparisons; the other palette/font
options retain their reference-only design status.

After the production font changes, capture the full matrix for fresh review:

```sh
pnpm visual:capture
```

The user approved all 388 images from run `2026-11-12T17-47-13.318Z` with
“I approve them all”. Their source/environment/profile/image identities and that
verbatim approval are recorded in `visual/references.json`. These supersede the
original Outfit baseline, which remains in Git history. Full comparison passes
for those approved images. The subsequently approved 84 navigation cases extend
this baseline without replacing its original 388 entries. Compare all cases:

```sh
pnpm visual:compare
```

Future app-font changes require fresh review because they change the recorded
environment. Keep that guard; do not weaken validation or automatically update
references. Capture success alone does not accept future images. Comparison runs
produce comparison results rather than new candidate images; the registry records
acceptance, and the per-run capture viewer preserves the reviewed images.

`TailAdmin/Compositions/Brand Text Roles` exercises the affected real links,
badges, line tabs and menu/document text, including hover and selection states.
Its two scenarios add eight profile cases. Browser checks compose alpha
backgrounds for 14 ordinary text samples and retain the icon, border and disabled
colours. The selected dark text role is `brand-300` (`#B4ACD7`); palette values
and the primary accent remain unchanged.

The landing currently contains empty technical documents. Its gallery honestly
shows that state. The video frame replaces external YouTube content during capture
and does not verify video playback. New UI source without an inventory mapping
fails `pnpm visual:coverage`; add real examples and relevant states as UI grows.

## Review and comparison

1. Run `pnpm visual:capture`. A successful run verifies its browser checks and
   produces **unapproved candidate images**, not a passing visual regression.
2. Open the review page and full-size images, try the linked previews, and discuss
   named cases. The selected-case panel only displays identifiers; it accepts nothing.
   Each card records its capture conditions. Preview links open the base example;
   use Storybook's controls and repeat the indicated interaction/viewport. Actual
   app links use your browser's language preference; use the registered language
   case in Playwright UI to reproduce that isolated test environment.
3. After the user specifically approves images, promote only those cases from
   that exact run, recording the actual approval text:

   ```sh
   pnpm visual:approve --run RUN_ID --case button-default--desktop --approval 'Actual user approval evidence'
   ```

   Repeat `--case` for each specifically approved image. Agents must never invent
   approval evidence. Source, renderer, font and image hashes are checked; stale
   or altered candidates require a fresh capture. Accepted PNGs and metadata live
   under `visual/references/` and `visual/references.json`.

4. Run comparison for accepted cases:

   ```sh
   pnpm visual:compare --project desktop --grep 'button-default$'
   pnpm visual:report
   ```

   The Playwright report at localhost:9323 shows expected/current/difference images
   for pixel failures and traces for browser failures. Unapproved cases fail
   comparison explicitly. A full comparison succeeds only after every included
   case has an approved reference. Automatic snapshot updates are disabled.

Capture candidates are stored in `.cache/visual/runs/RUN_ID/`; the run's
`review.html` remains available under `/runs/RUN_ID/review.html` on the review
server. The latest Playwright HTML report is `.cache/visual/playwright-report/`.
Capture counts and process status stay visible, including partial/failed runs.
These local artifacts are ignored by Git; preserve an important review run before
clearing the cache. Nothing in this workflow commits, publishes or deploys.

## Repeatable checks

The canonical renderer is the pinned Playwright Chromium, headless on this Mac,
with OS/architecture, browser, Playwright and actual font hashes recorded. Changing
the environment requires explicit fresh reference review. Screenshots use DPR 1,
fixed time, Europe/Madrid, stable fixtures and disabled animations/hidden caret.
Comparison uses the user-approved per-pixel colour threshold **0.01** with
**maxDiffPixels 0**. Existing references are never silently regenerated.
Chromium uses `--disable-gpu`, recorded with the renderer identity: a focused
experiment on this Mac found small input-border differences under the default
renderer, while all 15 CPU-rendered samples matched. This is a local repeatability
measure, not a guarantee across machines or browser versions.
The initial full repeat audit matched 362/368 PNG hashes. Six images had tiny
border-colour differences; native strict comparison flagged two. The user selected
the tested 0.01 colour threshold, retaining maxDiffPixels 0. To inspect the initial
isolated comparison evidence, start
the review server and open
http://localhost:9324/repeatability-proof/playwright-report/index.html.
The audit using the actual approved settings is available at
http://localhost:9324/approved-policy-proof/playwright-report/index.html; all 368
repeat-capture pairs pass. These are isolated engineering comparisons and do not
approve product reference images.
Candidate capture waits for consecutive identical rendered frames before saving
an image; completing a CSS transition can itself update a component's lifecycle.

```sh
pnpm visual:test
pnpm visual:test-languages
pnpm typecheck:visual
pnpm visual:coverage
pnpm visual:ui
```

UI Mode supports interactive browser test exploration using the capture path;
reference acceptance remains separate. Closing it without executing tests leaves
the previous review intact. Failed/skipped cases from its latest report cannot
appear as successful candidates from an earlier UI run. Filter captures with the same `--project`
and `--grep` options as comparison. A filtered run is partial coverage and the
review report says so. App code checks remain separate root commands. Catalogue
routes and fixture content must remain absent from normal production outputs.
The language browser suite uses a separate report under
`.cache/visual/language-tests/report/`; it does not replace candidate review
reports or accept reference images. It verifies all five locales, live errors,
custom text, retained state and English rendering of the complete story catalogue.
