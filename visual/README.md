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

The current inventory covers 216 retained component source modules through 83
stories and 21 view entries. Its 210 named scenarios produce 840 captures across
desktop 1440×900, tablet 768×1024, mobile 390×844 and desktop dark mode. The actual
assembled views cover Spanish, English, Catalan, Galician and Basque. Compound
primitives and icons are inspected in compositions; this is representative source
coverage, not every possible prop combination or complete accessibility testing.

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

Preserve that accepted baseline. Compare the 811 accepted cases outside only the
separately pending navigation review with:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

Products and recovery must not be excluded now that their exact references are
accepted. The post-approval comparison passes all 811 expected cases in run
`2026-11-15T00-12-39.768Z`, with zero skipped/unexpected/flaky cases and exit 0
(linked record/task 9.18). The final pre-promotion proof passed 84
code tests, 128 browser checks, 232 captures and 579 unaffected comparisons.
Those earlier comparison results are not a substitute for the post-approval run.
The prior initial-preview source `2058ed78…`/172-image proof is historical.
Simulation limits and compiler/font-alias evidence remain in the linked plan.
Future changes still need new captures and explicit image approval; this approval
does not accept the separate 20 navigation revisions or authorize staging,
commits or deployment. The message box redesign remains deferred.

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
closing/reload and production draft persistence remain undefined. The current
prototype visuals are accepted; applied filters, real retrieval and recovery
are subsequent work. Read the
[editing plan](../openspec/changes/define-products-table/editing-plan.md) for scope
and the current run evidence.

At the historical first-editing checkpoint, the user approved all 156 images
from `2026-11-14T12-42-43.360Z` with “That looks ok, I approve all current revision.”
Their promotion preserved 472 earlier entries for a **628-entry baseline at that
time**. The [original approval record](../openspec/changes/define-products-table/editing-plan.md#visual-approval--2026-11-14)
retains its source and scope. The latest 232-image approval above replaces 28
of those Products images and adds 204 recovery references; the current baseline
is 832. The separately pending 20 navigation images remain unapproved.

To capture future changes to these 156 cases (excluding the older navigation
Products-frame story), run:

```sh
pnpm visual:prepare
pnpm visual:capture --grep '(^| )products-'
```

`pnpm visual:test-languages` also runs the Products interaction, language,
accessibility and responsive checks. `visual/products-table.config.ts` provides
the focused suite with its own port/report. Future candidates require the same
explicit run/case approval as other designs. Do not promote future changes or the
prior pending navigation revisions automatically. The current editing run is recorded in the
[editing plan](../openspec/changes/define-products-table/editing-plan.md#review-refinement--dismissible-results-2026-11-14).

Compare the 811 current accepted cases outside the pending navigation revisions:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

This includes 156 Products cases, 204 accepted recovery cases and 451 other
accepted cases. It excludes eight navigation cases without references and the
21 mobile navigation cases, of which 12 are pending replacements and nine are
unchanged. It does not approve or replace their separate review. The current
811-case post-approval comparison passes under task 9.18 in run
`2026-11-15T00-12-39.768Z`.

Historical post-approval comparison `2026-11-14T13-03-52.919Z` passed the then-current
607-case selection. The original editing approval record also documents the
capture-only focus-race correction and 24 repeated overview comparisons; those
source-bound checkpoints are not the new 811-case result.

## Navigation prototype

The counts and baseline references below record historical navigation checkpoints.
The current accepted baseline is 832; the separate 12 replacement/eight new
navigation images still require specific approval and were outside the latest
232-image Products/recovery gallery.

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

Current capture `2026-11-12T22-46-21.298Z` passes all 92 navigation cases:
72 byte-identical images, 12 phone replacements and eight new dropdown images.
Review the 20 new/replacement images at
http://localhost:9324/location-refinement-review.html. This supersedes the earlier
mobile-only review; the accepted 472 references remain unchanged until approval.

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
