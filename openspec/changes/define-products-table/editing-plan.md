# Products editing prototype implementation plan

**Goal:** make PT-022–026 reviewable in the existing TailAdmin/TanStack Storybook
design, using synthetic catalogue records and simulated save outcomes.

**Architecture:** keep the browsing table and navigation shell. A preview-only
editor controller owns React Hook Form drafts, Zod validation, simulated
per-field outcomes and the in-app departure guard. Optional navigation callbacks
default to absent. Business drafts remain in preview memory; existing view
preferences retain their separate agreed behavior.

**Tech stack:** existing React, TypeScript, TailAdmin controls, TanStack Table
9.3.1, React Hook Form, Zod, Vitest and pinned Playwright. No dependency changes.

## Authority and boundaries

The user's “Done, continue with next steps” after `b955575` continues the design;
their subsequent PT-022–026 selections supply the initial field, save,
validation, departure and local-profile choices. This plan makes that selected
design concrete in Storybook. It does not authorize production routes, backend
changes, real business writes, new product policies, staging, commits or image
promotion. Keep exact spacing/widget treatment as review proposals.

The first editor changes names and explicitly assigns a missing SKU. Existing
SKU replacement, barcode/unit maintenance and stock writes are excluded. Never
trim/rewrite accepted input or use a name as permanent identity. Validate all
requested drafts before submitting any, with errors beside fields. A shared
Guardar cambios covers table drafts; confirmed, rejected and unconfirmed results
stay distinct. Retain only unconfirmed/unsuccessful draft content after confirmed
fields are applied to the synthetic records.

## Reviewable presentation

- Add Editar to read-only details and Editar tabla to the catalogue toolbar.
  Editing is deliberate; reading, expanding and changing Vista do not start it.
- Use retained inputs/buttons. Existing SKU values remain text; products without
  one offer an explicit Asignar SKU action and cancellation of that draft action.
  Barcodes, units, lifecycle and optional scoped stock stay readable.
  Use TailAdmin Textarea controls styled as compact fields so prohibited pasted
  line breaks can be rejected unchanged rather than silently stripped by a
  single-line HTML input.
- Table editing keeps compact cells and chosen columns. Draft values do not
  become confirmed records or change the working sort/search until confirmation.
  Count every edited product, including any outside the current visible filter.
- Show Guardar cambios / Cancelar, field errors and compact per-product results.
  A mixed result must expose field distinctions rather than label the whole row
  saved. Save keeps the editor available for repeated work; finishing the editor
  is a separate proposed control treatment.
  Visible validation feedback covers drafts hidden by the current search/columns.
  An explicit correction action exposes a hidden field in the summary while
  preserving search and Vista settings. Keep that correction field mounted while
  the merchant types, including after it becomes valid. Product results include
  available SKU identifiers to distinguish equal names.
- Guard ending editing, closing an edited panel and in-app navigation with the
  three selected actions. Guardar y salir completes departure only after every
  requested change is confirmed. Discarding drafts does not undo confirmed work.
- Include deterministic success, mixed and unconfirmed fixture outcomes. Unknown
  outcomes remain unresolved in this pass: retain the draft and show the state,
  without inventing an automatic retry, a status-check endpoint or recovery
  guarantee. The sample may pause further submission until its fixture is reset;
  this is a preview limitation, not a selected production recovery policy.
  Retained unconfirmed values use native read-only fields, allowing inspection
  and selection while changes/submission stay paused. Read-only inspection shows
  that product's own outcomes; it must not hide uncertainty behind confirmed data.
- Reuse phone pinning/horizontal scrolling and the full-phone details panel.
  Cover all five languages, light/dark themes and keyboard/focus interactions.
  Bound the result guard and panel to the viewport with internal scrolling;
  allowed long text and many failures must leave actions reachable on phones.

## Task 1 — Input and draft/outcome model

Create `apps/backoffice/.storybook/stories/products-editing-model.ts` and
`visual/products-editing.test.ts`.

1. Write failing tests for exact multibyte byte boundaries, fixed whitespace,
   prohibited/ill-formed text, preserved spaces/leading zeros, optional assignment,
   existing-SKU protection and mixed-field outcomes. Execute
   `pnpm exec vitest run --config visual/vitest.config.mts visual/products-editing.test.ts`.
2. Implement the smallest pure validation/draft/outcome functions required by
   those tests. Use the selected existing profiles; missing owner meaning is not
   permission to invent a rule. Keep matching and availability out of validation.
3. Re-run the focused tests and retain red/green evidence under ignored cache.

Example acceptance: a 1024-byte multibyte name passes unchanged and 1025 bytes
fails; `000001` remains text; confirmed name plus rejected SKU updates only the
name and retains only the SKU assignment draft.

## Task 2 — Concrete editing interactions

Create `apps/backoffice/.storybook/stories/products-editing.tsx`; modify
`products-table-preview.tsx`, `products-table-preview.css`,
`products-table.stories.tsx` and the optional navigation-preview boundary in
`navigation-prototype.tsx`. Use existing TailAdmin input/button/dialog/sheet,
React Hook Form and Zod rather than adding form/UI dependencies.

1. Add meaningful browser assertions to `visual/tests/products-table.spec.ts`:
   deliberate edit entry, existing-code protection, missing-code assignment,
   all-draft error gate, exact preservation, per-product/field results and all
   three departure choices. Verify a functional red before adding the controls.
2. Implement the controller and field/result/guard components. Inspecting another
   panel does not implicitly save a table draft. Transitions that leave an editor
   use the selected guard. Existing navigation cases have no callback and keep
   their behavior/appearance.
3. Add catalogue-only labels to the five `.storybook/messages/*.json` files.
   Do not write production messages or UI. Run the focused browser suite and fix
   actual findings before extending coverage.

## Task 3 — Candidate captures and regression evidence

Extend `visual/products-actions.ts` and `visual/inventory.json` with explicit
editing/validation/results/guard cases. Keep all existing reference entries.
Update Storybook docs and `visual/README.md` with fixture limits and review links.

Run `pnpm check`, `pnpm visual:prepare`, `pnpm visual:test-languages`, focused
Products captures and the existing 451 unaffected accepted comparisons using
the documented exclusion expression. Inspect desktop/tablet/phone/dark images,
especially input width, errors, mixed results, panel/dialog stacking and guard
focus return. Obtain independent read-only review and resolve material findings.
Do not regenerate accepted screenshots.

## Completion evidence

Record actual commands/counts, source/renderer/run identities, red/green evidence,
visual inspection and limitations here and in tasks. Validate strict OpenSpec,
formatting, links and scope. Verify the index empty and HEAD still `b955575`.
Present the interactive design and exact candidate gallery for user review.
Successful code/browser checks do not accept visual references or establish real
write availability, recovery, persistence or full Products-flow completion.

## Execution and verification — 2026-11-14

The selected first editing design is implemented in Storybook. It uses the
retained TailAdmin controls, React Hook Form/Zod and the pinned TanStack engine;
there are no new dependencies, production routes or real write requests.

Verified on the final source:

- `pnpm check`: formatting, lint, types and **64 code tests** pass (34 backoffice
  and 30 visual-tool/model tests).
- `pnpm visual:prepare`: both static apps and catalogues build; source and font
  preparation and coverage pass for 216 component modules, 67 stories, 21 views
  and 155 scenarios / 620 matrix cases.
- `pnpm visual:test-languages`: **93 browser checks pass**, zero failed, skipped
  or flaky cases. These include the prior 53 catalogue/navigation cases and 40
  Products browsing/editing cases, five-language controls, local field checks,
  hidden drafts, exact values, mixed/unconfirmed outcomes, safe transitions,
  viewport reachability and focused automated accessibility audits.
- `pnpm visual:capture --grep '(^| )products-'`: **140 candidates pass**, zero
  failed, skipped or flaky cases, in run `2026-11-14T02-35-56.811Z`.
- The README's 451-case unaffected-reference comparison passes in run
  `2026-11-14T02-40-22.939Z`, with zero failed, skipped or flaky cases. Products
  and the pending navigation revisions remain excluded from acceptance.

Both runs use source
`227b6ae5299287e0a0f6cd7bf1438ef76e5ec2512894c64215a4de313d0c043e`.
Renderer: macOS 27.0.0 arm64, Playwright 1.65.0, Chromium 158.0.8127.18, headless,
GPU disabled and scale 1. The font fingerprint remains
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.

Review:

- [Interactive Products catalogue](http://localhost:6006/?path=/story/inventory-products--catalogue).
- [Mixed outcomes](http://localhost:6006/?path=/story/inventory-products--editing-mixed).
- [Unconfirmed outcomes](http://localhost:6006/?path=/story/inventory-products--editing-unconfirmed).
- [Exact 140-case gallery](http://localhost:9324/runs/2026-11-14T02-35-56.811Z/review.html).

Desktop/tablet/phone/dark candidates were inspected for compact editing,
read-only stock, field errors/correction, panel fitting, individual outcomes and
guard layout. Browser tests separately verify many-result guard scrolling and a
maximum-length name within the phone panel. Full-page captures can include
document content beyond the configured viewport; reachability assertions use
the actual viewport bounds rather than image dimensions.

### Review findings and diagnostic evidence

Independent read-only review found and the browser checks reproduced hidden
validation errors and phone result overflow. The correction summary now exposes
off-screen fields without changing search/Vista, stays mounted while typing,
and becomes read-only after successful SKU assignment. Validation restores the
active editor when an inspection panel would otherwise conceal its errors.
Guard/panel scrolling is bounded; focus returns to an enabled control. Results
include available SKUs and record-bound inspection actions, disabled during
saving; inspection retains the selected product's own outcome visibility.
The final targeted review found no further critical/important source findings.

Ten model assertions were observed red before implementation, then green.
Functional browser reds cover missing edit entry, the four first review cases,
follow-up SKU/transition/focus cases, duplicate-name identification, in-flight
inspection and retained unconfirmed values. Logs are under ignored
`.cache/products-editing-*-red.log`; these are development evidence, not references.

The first broad audit sampled the dialog's entrance fade. A settled-style probe
confirmed opacity 0 during opening and 1 after completion; the accessibility
test now waits for the actual animations to finish rather than changing colours.
An initial mobile unconfirmed capture alternated one border pixel by one RGB
step under tracing. Retained drafts now use native read-only fields instead of
disabled fields, keeping values focusable/selectable and immutable during the
fixture pause. Twelve traced read-only samples were byte-identical. The probe
PNGs/hashes are in `.cache/products-editing-repeatability-proof/`; temporary
colour/clip experiments were diagnostic only. The renderer, strict consecutive
frame gate, approved threshold 0.01 and maxDiffPixels 0 remain unchanged.

An initial sandboxed Next build failed to bind its worker socket. A loopback
probe succeeded outside that sandbox; preserving the generated failed `.next`
cache and rebuilding cleanly resolved the cached failure. Final preparation
passes without changing app configuration.

### Remaining boundaries

All 140 Products candidates and the prior 20 navigation revisions await specific
image approval. The 472 accepted references are unchanged. Drafts/confirmed
fixtures live in preview memory and can reset with reload/fixture controls;
production persistence, actual operation availability, unconfirmed-result
recovery/retry, concurrent changes and broader identifier/lifecycle operations
remain future design/integration work. This is not full accessibility or browser
certification. No staging, commit, deployment or archive was performed; HEAD
remains the user's `b955575`.

## Review refinement — dismissible results, 2026-11-14

The user reviewed the preview and requested:

> The “Resultado del guardado” message should be discardable.

PT-027 records presentation dismissal without discarding drafts or changing any
save outcome. “Looks ok” is positive review feedback, not specific image approval.
The previous 140-case run above remains historical evidence for that version.

The revised control treatment uses a small close button in the result header.
Closing details leaves a compact last-outcome line and Ver resultados action;
unconfirmed outcomes stay explicit. Reopening changes presentation only. A fresh
save result opens its own details; local dismissal is scoped to the displayed
result snapshot and inspected product, not a production notification/storage
preference. Existing in-flight controls, drafts, guard and recovery limits remain.

Implementation stays in `products-editing.tsx`, its preview CSS and the five
catalogue dictionaries. Add browser checks for preserved confirmed/failed/unknown
state, keyboard focus, reopening, new-result visibility and translations. Add
four responsive/theme capture scenarios (table success, mixed, unconfirmed and
panel dismissal). Preserve production source, dependencies and accepted images.
Verify code, the full browser suite, current Products candidates, unaffected
references, OpenSpec/links and an empty index before returning the revision.

### Refinement verification

The dismiss/reopen treatment is implemented in the shared result presentation,
so both table and panel use it. A local result-snapshot/product scope controls
visibility; no draft or result-controller mutation is involved. Reopening restores
the detailed outcomes, and a subsequent save automatically reveals its new result.
Focus transfers between the close button and Ver resultados without taking focus
from a later interaction. Sending disables these transitions.

The new browser regression was observed red because the close control was absent
(`.cache/products-results-dismiss-red.log`). All four added browser cases now
pass, covering confirmed values, failed drafts, unknown outcomes, panel scoping,
reopening/new saves, keyboard focus and all five languages. Focused axe checks
pass for both expanded and collapsed presentation.

Current source:
`05c8b18610bbe4fe87dd174a6aabbd50c34b79533efe6e0b9fe4e17e2890d715`.
`pnpm visual:prepare` passes; all four local preview servers advertise that same
source. `pnpm visual:test-languages` passes all 97 checks. The new capture run is
`2026-11-14T12-42-43.360Z`: all 156 Products captures pass with no skipped,
unexpected or flaky cases. Its 16 added cases cover four dismissal scenarios
across the agreed responsive/theme profiles. The full inventory now has 159
named scenarios / 636 matrix cases. Renderer, strict frame-stability gate,
threshold 0.01 and maxDiffPixels 0 are unchanged.

Inspected the desktop confirmed/unknown summaries, tablet panel partial result,
phone confirmed/unknown summaries, phone expanded close control and dark unknown
summary. The close target, full-width table/panel layout, last-outcome labels and
reopen action remain visible without clipping in these samples.

Review: [current 156-image gallery](http://localhost:9324/runs/2026-11-14T12-42-43.360Z/review.html).
This run supersedes the previous 140-image Products set; all images remain
unapproved. The prior 20 navigation revisions also remain pending. Draft storage,
unconfirmed-result recovery and other production boundaries above are unchanged.

Final root `pnpm check` passes formatting, lint, all type checks and 64 code tests
(34 backoffice + 30 tooling/model assertions). The unaffected-reference comparison
`2026-11-14T12-44-11.805Z` passes all 451 selected accepted cases on the same source.
No references or comparison tolerances changed. Strict OpenSpec validation passes
all seven changes. The final local-link/scope, formatting and index audits are
recorded in the task's ignored check logs. No production source, dependencies,
landing files, accepted images, staging or commits changed; HEAD remains `b955575`.

## Visual approval — 2026-11-14

After receiving the exact 156-image gallery above, the user said:

> That looks ok, I approve all current revision. What is the next recommended steps

This specifically approves the current Products set from
`2026-11-14T12-42-43.360Z`, on source
`05c8b18610bbe4fe87dd174a6aabbd50c34b79533efe6e0b9fe4e17e2890d715`.
All 156 exact cases were promoted through `visual/promote.ts`, which verified
current source, renderer and each image hash. The registry preserves the previous
472 entries unchanged and now contains 628 accepted references. No other images
were promoted. The older 20 navigation replacements/new cases are outside the
linked Products gallery and remain pending separately.

This accepts the reviewed Storybook visuals; it does not select production
recovery/storage behavior or authorize staging, commits, production routes,
deployment or another feature. The index remains empty and HEAD is `b955575`.

### Recommended continuation, not a new selection

1. Prepare a commit checkpoint, with implementation/specifications and accepted
   images as reviewable batches, once the user instructs staging. Never commit.
2. Define the failed/unconfirmed save recovery journey and remaining draft
   coordination (task 2.2k), then design it in Storybook. The existing fixture's
   pause-until-reset is a documented limitation, not product behavior to adopt.
   Preserve the selected guard, individual outcomes and explicit editing.
3. Complete the already selected filter experience (PT-010–012), then validate
   realistic find/compare/edit/recover tasks across keyboard and phone paths.

These are recommendations responding to the user's question, not selection of
retry, persistence, concurrency or interface contracts. No feature implementation
began with this approval.

### Post-approval focus repeatability

The first post-promotion comparison `2026-11-14T12-55-31.955Z` passed 606 cases
and failed the mobile panel-overview image: the SKU field had a focus ring while
the approved overview did not. A six-repeat mobile probe reproduced two failures
and four passes with no source or reference change. All differing pixels were
inside that field's border/ring bounds.

Inspection of BaseUI's FloatingFocusManager showed the focused Asignar SKU
trigger's removal restores popup focus immediately and on the next animation
frame. The capture action filled the new textarea before that frame had settled;
the final active element could be the field or popup. The standalone probe and
failed trace confirmed both states. This was an unspecified capture-end state,
not a reason to change field styling or the approved reference.

Only the generic `products-editing-panel` action now clicks the noninteractive
panel title after filling, then asserts SKU is not focused. This ordinary pointer
action explicitly ends editing for the approved overview. Save-result actions,
UI behavior, focus styles, renderer, comparison tolerance and all approved image
bytes remain unchanged. Dedicated browser checks retain actual editing/focus
coverage.

The refreshed test source is
`e583af90ef3ea733a3961760d1364f9906ef66f588bcd6b36419031ef3aa8d60`.
Preparation and root `pnpm check` pass (64 code tests); all four preview identities
match that source. Run `2026-11-14T13-02-45.455Z` passes 24 comparisons: six
repeats of the overview in each of the four agreed profiles, against the exact
approved reference images. No references were regenerated or replaced.
The approved capture/source metadata remains the original reviewed run above.

Final comparison `2026-11-14T13-03-52.919Z` passes all 607 selected accepted
cases (156 Products + 451 unaffected), with zero skipped, unexpected or flaky
cases on that final source. It supersedes the initial comparison's focus-race
failure. The 21 mobile navigation cases and eight new dropdown cases remain
excluded only for the separately pending navigation review; 12 of those mobile
images are revised and nine are unchanged. The registry still has 628 entries,
with all original 472 records/files and the approved 156 image hashes preserved.
Formatting, all seven strict OpenSpec changes and 101 local links/anchors pass;
the scoped diff is clean, the index is empty, and HEAD remains `b955575`.

## Commit preparation — 2026-11-14

After the recommendation to prepare code/specifications first and approved
screenshots second, the user said **“go ahead”**. This authorizes that two-batch
staging checkpoint, with the user executing each commit. Never create a commit.
Complete the checkpoint before beginning the proposed recovery/filter design.

The base is `b955575`, and the index was empty when preparation started. The
executable source remains
`e583af90ef3ea733a3961760d1364f9906ef66f588bcd6b36419031ef3aa8d60`,
matching the verified build, 24 repeated overview checks and final 607-case
comparison. Source and renderer did not change during preparation; no new
browser capture, image acceptance or feature decision follows from staging.

Batch 1 contains the 25 changed/new non-reference files: preview editing and
navigation integration, five catalogue dictionaries, meaningful model/browser
checks, visual inventory/actions, OpenSpec and agent/review documentation.
Exclude `visual/references.json` and every PNG under `visual/references/`.
Return the user a commit command for:
`feat: prototype product editing and save feedback`.

Batch 2 follows only after the user commits batch 1: the 156 explicitly approved
Products PNGs plus `visual/references.json` (157 files). Preserve all earlier
472 reference entries/files and the separate pending navigation review. Give
its own commit command then; never stage both batches together or commit.
The ignored `.cache/products-editing-commit-batches.json` records the exact
local file lists, and final staged/unstaged audits verify that separation.

A clean checkout of batch 1 alone intentionally lacks the second reference batch;
its new Products screenshot comparisons become reproducible from committed files
once batch 2 is committed. This split does not discard the local accepted images
or change their approved metadata.

### Batch 1 staged

The first batch is staged: exactly 25 code/specification/test/documentation files.
Its staged diff excludes all references. The 157 approved-reference paths remain
unstaged/untracked for batch 2. Fresh `pnpm check` passes formatting, lint, types
and 64 code tests; all seven OpenSpec changes pass strict validation and 104
local links/anchors pass. The executable source still matches the recorded
24-repeat and 607-case visual proof, so browser builds/captures were not repeated
for this documentation/staging step. Final staged/remaining-path audits enforce
the batch split. HEAD remains `b955575`; no commit was created. Await the user's
first commit before staging batch 2.

## Completed checkpoint and email-privacy repair — 2026-11-14

The user committed batch 1 as `a8a4374` and batch 2 as `df1f321`, then reported
GitHub rejecting the initial push because of the commit email privacy protection.
Only the repository-local future commit email was configured and a local backup
branch was created by the agent; no agent commit or history rewrite occurred.
The user ran the supplied root-rebase repair and pushed `main` themselves.

Live verification confirms both batches are complete after the user-run rewrite:
`6636828` contains exactly the 25 source/specification/test/documentation paths,
and `eb49dea` contains exactly 156 approved Products PNGs plus their manifest.
The remote `main` was read and matched local
`eb49dea2718a4d6d03933ac4d745bfb916b840e7`. The working tree and index were clean
before the following discovery documentation began. No rebase is in progress.

All ten old/new commit pairs preserve exact trees, messages, author names and
author dates. All author/committer emails now use the GitHub noreply identity;
private email values are not copied into these project records. The original
history remains on the local `backup/before-email-privacy-fix` branch; it was
not pushed. Historical commit references elsewhere in these records can be
resolved through this mapping:

| Original local ID | Current ID |
| ----------------- | ---------- |
| `317a8d7`         | `4264038`  |
| `dc395c2`         | `fd7566d`  |
| `0580e97`         | `f2b3c15`  |
| `07db0bb`         | `8ff7955`  |
| `183a65b`         | `676643f`  |
| `4a5b979`         | `b07a040`  |
| `f365765`         | `b5949bf`  |
| `b955575`         | `c117e2b`  |
| `a8a4374`         | `6636828`  |
| `df1f321`         | `eb49dea`  |

The visual source remains
`e583af90ef3ea733a3961760d1364f9906ef66f588bcd6b36419031ef3aa8d60`,
matching the prepared build and recorded 607-case proof. The 628 accepted
references retain their exact images and original approval metadata; the older
20 navigation image revisions remain pending separately. Rewriting Git metadata
changed neither the UI nor image approval. This checkpoint is closed; its
staging authorization does not carry forward to new discovery changes.

The user then said **“go ahead”** after the recommendation to define save
recovery and draft handling. This continues product discovery under task 2.2k.
Read the [unconfirmed-save proposal](design.md#unconfirmed-save-verification--proposal-2026-11-14).
The initial read-only-verification question was not selected: the user first
requested an Inventory retry-contract check. The subsequent PT-028 selection is
recorded in the [source findings](design.md#inventory-retry-findings-and-selected-recovery-direction--2026-11-14).
No new prototype, production interface, image promotion, staging or commit is
authorized by this discovery continuation.
