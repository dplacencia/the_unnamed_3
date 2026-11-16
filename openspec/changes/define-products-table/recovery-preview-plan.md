# Products recovery and draft ownership preview plan

**Goal:** make the selected PT-028–041 recovery and draft-resolution behavior
reviewable in the existing Products Storybook design.

**Architecture:** extend the preview through an optional recovery controller,
using synthetic immutable command snapshots, a controllable clock, simulated
retention capabilities and predefined ownership states. Reuse the TailAdmin,
TanStack and form controls already present. Existing stories keep their current
defaults; no production route or real recovery service is added.

**Tech stack:** existing React, TypeScript, TailAdmin, TanStack Table 9.3.1,
React Hook Form, Zod, Vitest and pinned Playwright/Chromium. No new dependency.

## Authority and review status

The user selected **“Build the simulated preview (Recommended)”** in response to
the prepared scope question. Execution of this bounded design pass is authorized;
production mechanisms and future image acceptance remain separate. Read the [technical decisions](recovery-technical-design.md),
[requirements](specs/products-table/spec.md) and the user's source replies before
implementation. Keep the existing [editing approval](editing-plan.md#visual-approval--2026-11-14)
separate from approval of future changed images. Never commit or stage through
this plan.

The initial checkpoint is user commit `eb49dea`, visual source
`e583af90ef3ea733a3961760d1364f9906ef66f588bcd6b36419031ef3aa8d60`, 628 accepted
references and the separately pending navigation revisions. Verify these again
at execution time; they are not a promise the workspace cannot change.

## Selected behavior to demonstrate

| Area                                  | Reviewable behavior                                                                                                                                               | Requirements           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Automatic recovery                    | At most three requests including the original; 15-second attempt timeout; 1/3-second retry waits with ±50% jitter; unchanged original command                     | PT-028, PT-034         |
| Exhaustion and manual continuation    | Uncertainty remains visible; explicit Reintentar starts a fresh bounded run of the same command after the earlier run stops                                       | PT-038                 |
| Independent work                      | Affected products remain read-only; other eligible products can be edited and saved without resending confirmed work                                              | PT-029–030             |
| Submitted records on return           | Accessible records are shown without dispatch; Continuar recuperación explicitly starts recovery using the original command                                       | PT-031                 |
| Unsent drafts on return               | Products starts read-only; explicit continuation/discard; changed current data requires review, unchanged data does not, unavailable data is not called unchanged | PT-032–033             |
| Retention capability                  | Simulated IndexedDB, localStorage and memory modes with honest nonblocking limits; memory does not promise reopening recovery                                     | PT-035–037             |
| Separate storage and business results | Authoritative success stays success after simulated retention failure; inaccessible history is not called empty                                                   | PT-036–037             |
| Recovery elsewhere                    | Known active same-command recovery is shown without a second deliberate run; unavailable coordination has the selected usable recovery fallback                   | PT-039                 |
| Second edit                           | Reject a second same-product edit with a clear error when its earlier editor is known active                                                                      | PT-040                 |
| Unreachable editor                    | Explicit Asumir edición or confirmed discard/start, plus Cancelar; no assertion that the old tab closed                                                           | PT-041                 |
| Returning previous editor             | After explicit ownership change, the former editor is read-only and cannot edit/save under its old ownership                                                      | PT-041                 |
| Submitted-work protection             | Draft discard/takeover never cancels, erases or resolves submitted commands or bypasses affected-product protection                                               | PT-029, PT-032, PT-041 |

## Presentation proposal

Keep the compact page frame and table. Put a short status/action beside affected
products and use a compact summary for unresolved work; detailed save results
retain the selected dismiss/reopen behavior. Present retry progress in plain
language without adding command identifiers, storage-engine names or attempt
mechanics to the merchant's normal workflow. Precise technical fixture controls
belong to Storybook controls/docs, outside the product canvas.

For a known active editor, propose “Este producto ya se está editando en otra
pestaña.” For an unreachable editor, propose “Hay una edición pendiente de este
producto. No podemos comprobar si la otra pestaña sigue abierta.” Only the
second state offers the selected explicit resolution. Use the retained dialog
for Asumir edición / Descartar y empezar de nuevo / Cancelar; discard requires
confirmation. Cancel leaves the original work untouched. After ownership change,
the former editor shows a clear read-only explanation when represented again.

Show current values beside restored draft values only where PT-033 requires
review. An unavailable current-data fixture must visibly retain that uncertainty
rather than enable an unchanged-data shortcut. A memory-only notice explains
that draft/recovery work may be lost on refresh or close; avoid repeated blocking
save prompts. Exact copy, placement and widget treatment are review proposals.

## Simulation boundaries

- No real API requests, domain writes, new endpoints or name/SKU command mapping.
  Fixture command snapshots are explicitly synthetic. Their identity/content
  remain immutable across retries; fixture grouping does not choose production
  batching or claim atomicity.
- No actual IndexedDB/localStorage journal, storage migration/reconciliation,
  cross-tab mutex, heartbeat, lease, expiry/logout cleanup or ownership fencing.
  Capability/owner states are supplied by the fixture. A virtual previous editor
  demonstrates the required returned-owner state, not a tested real-tab guarantee.
- Do not choose when Editar tabla acquires product ownership: whole-list,
  focus-based and first-change acquisition are unselected. Use predefined owned,
  free, unresolved and unreachable-product fixtures for this pass.
- Unknown owner status with an accessible draft is PT-041's selected case.
  Editing with no usable ownership coordination or retained record is a separate
  unresolved policy. Do not silently label that case free or permit a second
  editor by borrowing PT-039's recovery fallback.
- PT-033 fixtures supply changed/unchanged/unavailable classifications; they do
  not select production comparison fields, revision tokens or conflict semantics.
- A simulated return/reopen event exercises restoration behavior without
  promising actual refresh persistence. Storybook Reset only resets synthetic
  data; it does not establish a production deletion/retention policy.
- Use injected clock/randomness for tests and fixture controls. Preserve the
  selected 15-second and jitter calculations; do not add a faster production
  retry profile. Captures select deterministic settled states.
- Keep known rejection, uncertainty and authoritative success distinct. This
  pass does not design new business rejections, corrected-command submission
  rules or concurrent business-write resolution.

## Task 1 — Recovery and ownership presentation model

Create `apps/backoffice/.storybook/stories/products-recovery-model.ts` and
`visual/products-recovery.test.ts`. Reuse existing draft/result validation from
`products-editing-model.ts`; do not duplicate or alter the selected input profiles.

Write meaningful failing tests for state transitions before implementing the
smallest preview-only controller. Cover:

1. A lost-response fixture consumes the original attempt, waits within the exact
   selected bounds and retries the identical command snapshot at most twice.
2. Exhaustion retains uncertainty. A manual action after stopping grants another
   three-request run; repeated clicks during a run do not overlap/reset it.
3. Recovery confirmation changes only its established result. Saving an unrelated
   eligible product preserves original pending records and never resends already
   confirmed changes. Existing all-draft validation still gates the new set.
4. Simulated restoration sends nothing until explicitly requested; storage-mode
   changes preserve command identity/content, known outcomes and run counters.
5. A known active owner rejects the second edit. An unreachable retained unsent
   draft permits explicit assume, confirmed discard/start or cancel. A virtual
   returning former owner is read-only after transfer. Submitted protection wins.
6. Changed/unchanged/unavailable current-data fixtures take the distinct selected
   restoration paths; no automatic merge, save or inference from missing data.

Run the focused red/green check:

```sh
pnpm exec vitest run --config visual/vitest.config.mts visual/products-recovery.test.ts
```

Retain ignored-cache evidence. Tests must observe emitted synthetic requests,
unchanged snapshots and permitted transitions rather than merely mirror a state
object's implementation.

## Task 2 — Storybook interaction design

Create `apps/backoffice/.storybook/stories/products-recovery.tsx` and
`products-recovery.stories.tsx`. Add the smallest optional preview integration in
`products-editing.tsx`, `products-table-preview.tsx` and
`products-table-preview.css`. Existing defaults keep their prior behavior; label
the earlier unconfirmed fixture's limitations as historical first-editor preview
behavior, not the current selected recovery policy.

Add labels to the five existing `.storybook/messages/*.json` files. No production
message or application-source changes are included. Fixture/clock/virtual-editor
controls stay in Storybook's authoring surface. Reuse existing TailAdmin controls,
focus management and the full-phone panel rather than adding UI libraries.

Create `visual/tests/products-recovery.spec.ts` and add it to
`visual/playwright.languages.config.ts` and the focused test match in
`visual/products-table.config.ts`. Write the relevant failing browser assertions
before adding each interaction. Assert visible results, read-only fields, disabled
save paths and focus return; do not validate the flow solely through fixture
internals. Cover dismissal without loss of uncertainty, cancel/confirm paths,
keyboard use, phone reachability, five languages and applicable accessibility
checks. A virtual editor test is not a real multi-tab lock test.

## Task 3 — Candidate coverage and verification

Extend `visual/products-actions.ts` and `visual/inventory.json` with explicit
`products-recovery-` cases. Each added scenario gets the agreed desktop, tablet,
mobile and desktop-dark coverage. Include five-language assembled-view cases for
recovery, storage notices and ownership resolution. Exercise all matrix rows
above through either interaction checks or explicit stable-state captures; record
the final case list/count before executing the capture run.

Update `visual/README.md` with review URLs and the exact simulation limits. Run:

```sh
pnpm check
pnpm visual:prepare
```

Start or refresh the repository preview coordinator in a managed long-running
session before the browser checks:

```sh
pnpm visual:preview
```

After preparation changes source, do not blindly reuse an older server on port
6006: the coordinator's `X-Visual-Source` identity is fixed at startup. Verify its
identity matches the current prepared source before continuing. Stop/restart only
the task-owned coordinator as needed; the source handshake must pass.

```sh
pnpm visual:test-languages
pnpm exec playwright test --config visual/products-table.config.ts
pnpm visual:capture --grep '(^| )products-recovery-'
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered|(^| )products-recovery-'
```

The last command compares the currently accepted 607-case subset while excluding
the separately pending navigation cases and new, unaccepted recovery cases.
Report existing reference changes as new candidates; do not update references to
make a check pass. Keep the accepted registry and image bytes untouched.

Inspect desktop/tablet/phone/dark captures, long Spanish/Catalan/Galician/Basque
copy, dialog scrolling and the compact table. Obtain independent read-only review,
resolve material findings and rerun only affected checks. Record actual code and
browser results, source/renderer identities, run URLs, gallery and limitations
here before asking for visual review. Passing comparisons do not approve images.

## Completion and remaining production work

Execution is complete only when the authorized preview works, required checks
pass and its exact gallery is ready for user review. No success claim for real
persistence, coordination or Inventory integration follows. The broader recovery
tasks remain open for ownership enforcement/acquisition, unavailable-coordination
editing, storage reconciliation/retention/logout, actual command/transport mapping
and production current-data/concurrent-write rules. Any changed visual references
need specific user approval. Staging requires its own applicable instruction;
commits remain exclusively the user's action.

## Preparation checkpoint — 2026-11-14

The plan and PT-041 received independent read-only policy and technical review
without material findings. The technical review verified existing discovery and
script paths, the unused recovery-case namespace and the 607-case comparison
selection against the current accepted registry. The startup source-identity
reminder above records its operational finding.

Strict native OpenSpec validation passes all seven changes; repository formatting,
147 local links/anchors and diff whitespace checks pass. The ten changed/new
files are documentation/context only; the index is empty and HEAD remains
`eb49dea`. The visual source/prepared build still match `e583af90…` and the accepted
reference bytes are unchanged. No new recovery implementation, code/browser test,
build, capture or reference acceptance was performed for this preparation.

## Execution authorization — 2026-11-14

The user selected **“Build the simulated preview (Recommended)”** to:

> Next, I recommend building the prepared Storybook preview so we can visually
> test retries, restored drafts, storage-limit notices, second-edit rejection and
> takeover/discard. It uses synthetic commands and simulated storage/ownership.
> Shall we build this preview now, or define the production coordination and
> retention mechanisms first?

This supersedes the preparation checkpoint's pending execution status. Execute
the three tasks above in the authorized repository, preserving existing changes
and reference bytes. No Git commit, staging, real API/journal/locks, new dependency
or production-policy selection is authorized.

## Execution and verification — 2026-11-14

The authorized simulated recovery/ownership preview is implemented. It reuses the
existing Products workspace, TailAdmin controls and TanStack table through an
optional preview controller; original stories retain their defaults. It adds
15 recovery stories, 38 catalogue labels per language and 43 registered states /
172 profile cases. All commands, responses, retention capabilities, comparisons
and ownership/old-editor return states remain synthetic.

Verified final source:
`2058ed78f1f4f0f005510f8fa6d6e8f2b077dfae29e9a3431d5d8cd312526578`.
Renderer: macOS 27.0.0 arm64, headless Chromium 158.0.8127.18, Playwright 1.65.0,
GPU disabled and scale 1. Prepared font fingerprint:
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.

### Checks and exact review set

- `pnpm check` passes formatting, lint, all three type checks and **84 code tests**:
  34 backoffice tests and 50 visual-tool/model tests, including 20 new recovery
  model cases.
- `pnpm visual:test-languages` passes **124 browser checks**, with zero failed,
  skipped or flaky cases. The new file contributes 27 recovery checks covering
  timing, unrelated work, ownership, restoration, inaccessible/discarded work,
  five languages, phone controls, keyboard completion and focus isolation.
- `pnpm exec playwright test --config visual/products-table.config.ts` passes
  **71 focused desktop browser checks**, with zero failed, skipped or flaky cases.
- The static backoffice export is verified with `pnpm --filter ./apps/backoffice
build --webpack`; both Astro outputs, local fonts, Storybook and coverage also
  build successfully. Coverage reports 216 source modules, 82 stories, 21 view
  entries and 202 registered scenarios. See the environment-specific build note
  below before interpreting the failed default preparation commands.
- `pnpm visual:capture --grep '(^| )products-recovery-'` passes **172 candidates**
  in run **`2026-11-14T22-37-09.425Z`**, with zero skipped, unexpected or flaky cases.
- The plan's filtered comparison passes **607 existing accepted cases** in run
  **`2026-11-14T22-39-09.883Z`**, with zero skipped, unexpected or flaky cases.
  It excludes the separately pending navigation cases and the new recovery set.
  No accepted registry entry or image bytes were changed.

Review the [interactive recovery catalogue](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted),
[unreachable-editor resolution](http://localhost:6006/?path=/story/inventory-products-recovery--unreachable-editor),
[changed-data review](http://localhost:6006/?path=/story/inventory-products-recovery--changed-draft)
and the [exact 172-image candidate gallery](http://localhost:9324/runs/2026-11-14T22-37-09.425Z/review.html).
These are review candidates, not approved references. The 628 accepted references
and the earlier pending navigation review retain their separate status.

### Findings resolved and regression evidence

Independent specification and code-quality reviews found and verified fixes for:

- Takeover/discard transitions bypassing unrelated unsaved work. Ownership change
  is now deferred through the existing save/discard/keep-editing guard.
- Discarded/inaccessible drafts advertising resolution actions or fabricated
  current values. All entry paths now retain honest unavailable-state messages,
  neutral titles, no false comparison and no draft resurrection.
- An unsent-draft notice surviving successful confirmation or abandonment. Its
  presentation now follows actual draft changes without selecting ownership release.
- Unavailable history populating a guessed command. That fixture now has a separate
  history notice and no restored command/content; its current catalogue is independent.
- Manual recovery completion removing its focused action without announcing the
  result. Outcomes have stable polite status semantics and safe focus return
  scoped to their own preview; moving elsewhere prevents focus theft.

All were exercised through meaningful failing browser assertions before fixes.
Ignored-cache logs include `products-recovery-ui-red.log`,
`products-recovery-review-red.log`, `products-recovery-history-red.log`,
`products-recovery-unavailable-title-red.log`,
`products-recovery-discard-entry-red.log`, `products-recovery-focus-red.log` and
`products-recovery-focus-instance-red.log`. Model red/green evidence is in
`products-recovery-model-*.log`; final checks are in
`products-recovery-check-final.log`, `products-recovery-languages-final.log`,
`products-recovery-capture-font-final.log` and `products-recovery-compare-final.log`.

### Environment and capture preparation corrections

Default `pnpm visual:prepare` hit an OS port restriction in Turbopack's compiler
process, including on the escalated local execution attempt. This is not reported
as a passing default build. The installed CLI exposes supported `--webpack`;
using it verifies the unchanged static backoffice source without changing its
build script, dependencies or runtime configuration. The remaining preparation
steps then ran in their existing order; after Storybook-only fixes, only the
Storybook/source-metadata/coverage steps were rebuilt.

The shared screenshot harness freezes Date. Eight retry/resumption captures
initially stayed in progress despite successful normal-clock browser checks.
Their capture actions now advance only the fixed observation time for the
250ms synthetic response. All eight isolated cases and the subsequent full set
pass; production attempt deadlines/backoff were not shortened or altered.

Webpack named the same Source Sans 3 TTF differently, changing the temporary
prepared-font manifest. Reference validation correctly rejected that environment.
The original cached alias `source_sans_3-s.p.3qt9iekxw2qnx.ttf` was verified to have
the exact same bytes as the Webpack asset, SHA-256
`042fe2cc0b933e328410d7acbd0aa6a1873dca5aef81875f4bc214b08825c7b9`.
Restoring its prepared alias reproduces the exact accepted manifest fingerprint
above. No font source, reference metadata, tolerance or validation rule changed.
The evidence is in ignored `products-recovery-font-alias-proof.json`; the final
capture and comparison above use that restored environment.

### Visual inspection and limits

Root inspected representative desktop pending-work, phone ownership, Basque phone
copy and dark changed-data views. Independent review inspected six additional
phone/tablet/dark cases covering discarded unavailable work, the unsaved-transition
guard, current/draft comparison, Catalan ownership, memory notices and returned
read-only ownership. No material clipping, unreachable controls, unreadable theme
or incorrect state text was found in that sample. All six independently inspected
PNGs were byte-identical after font-alias restoration. After the later test-only
locator refresh, five remain byte-identical and the dark returned-owner example
differs at only three pixels by one channel step; root inspected that final image
again. Root's four earlier samples are byte-identical in the final review set.

During the font-alias recheck, 169 of 172 PNGs were byte-identical between the
two identical-UI capture runs.
Three differ only at 21 pixels each by one channel step; this records the measured
noise, not approval or a tolerance change. The existing user-selected comparison
threshold remains 0.01 with maxDiffPixels 0, and all 607 accepted comparisons pass.
The sample review is not an assertion that every image was manually inspected.

Real persistence, ownership acquisition/fencing, incompatible-coordination editing,
retention/logout, Inventory transport and concurrent business writes remain open.
A virtual former editor and simulated reopening do not certify actual cross-tab
locks or durability. No new dependency, production application route, real business
write, visual promotion, staging or Git commit was performed. The user must review
and explicitly approve the exact candidate set before any reference promotion.

### Final test-locator and evidence refresh

A final focused run exposed an existing generic `getByRole("dialog")` assertion
matching both a closing Vista popover and the product details sheet. The test's
locator is now scoped to `[data-slot="sheet-content"]`, preserving its intended
assertion rather than changing product behavior. The failure is retained in
ignored `products-recovery-focused-locator-red.log`. Both the final 71-case
focused run and 124-case catalogue run pass after this one-line test correction.

This test-only change updated the bound source fingerprint to the final value
above. The UI bundle and accepted font setup were unchanged; source metadata and
the exact 172-image/607-comparison evidence were refreshed rather than presenting
older source-bound results as current. Final documentation/whitespace checks,
strict OpenSpec, local links, scoped file list and unchanged-reference/index
checks are verified during closeout. The index remains empty and HEAD `eb49dea`.

## User review — Spanish wording and later message box revision

The user reported that **“Guardado sin confirmar”** is not natural Spanish and
requested a better suggestion. They also stated that the message box design is
not good, but is acceptable for now, and explicitly asked to record a later
revision rather than redesign it in this pass.

The assistant initially recommended **“No hemos podido confirmar el guardado.”**
and offered **“No hemos podido confirmar si los cambios se han guardado.”** as a
longer alternative. The user subsequently rejected the nominal “el guardado”
construction, as recorded below. That first recommendation is superseded; it must
not be treated as the selected wording.

The message box visual revision is deferred in tasks. At that later design step,
clarify the affected feedback surface(s) and present concrete alternatives; the
user has not selected a replacement layout, spacing, hierarchy or treatment.
The current design remains temporarily in use. This review note leaves the
specific 172-image approval task open and changes no accepted reference or
current executable/visual source.

### User clarification — changes and edits, with guardar as a verb

The user clarified the grammatical/style issue with these exact preferred forms:

- **“Puedes trabajar con otros productos mientras confirmamos que los cambios se
  han guardado.”**
- **“No hemos podido confirmar que los cambios se han guardado.”**

They explicitly rejected **“No hemos podido confirmar el guardado.”** The earlier
assistant response had retained the very noun construction being criticized.
For this product's Spanish change/save feedback, refer to **los cambios** or
**las ediciones** and describe their state/action with a verb, rather than using
**el/este/del guardado** or **los guardados** as the thing discussed. This is a
contextual writing rule; valid verbal/participial uses such as **Guardar cambios**,
**sin guardar**, **los cambios están guardados** and **trabajo guardado** are not a
lexical ban on the word.

The user's two sentences are now selected examples, superseding the earlier
unselected/rejected suggestion. Applying them must preserve the difference between
active checking and an unresolved result. Short row/badge labels need their own
contextual wording; the full sentence is not automatically a suitable replacement
for every compact label.

A read-only Spanish-copy audit found the same pattern in `peLastResults`,
`peDismissResults`, `prRecovering`, `prStorageProblem`, `prDiscardBody`, `prDetails`
and `prRecoveryTitle`, alongside the two explicitly discussed messages. The
nominal/elliptical status labels `gridConfirmed`, `prConfirmed`, `prUnconfirmed`
and `peResultsPartial` also need contextual review. Standalone `peSaved`/`peFailed`
are participial status forms and are not automatically the same grammatical case.
No blanket search/replace is selected by this guidance.

This turn records the clarification and exact examples; it changes no rendered
copy or layout. Applying the copy and reviewing remaining compact labels is
tracked separately. The requested later message box redesign stays deferred,
and task 9.10's specific candidate-image approval remains open.

## Spanish copy revision — authorized 2026-11-15

The user said **“Ok, make the changes to the simulated previews”**, authorizing
application of the recorded wording correction. This pass updates preview copy,
compact labels and copy selection from existing recovery state; it changes no
CSS/layout, retry/ownership behavior, production messages or dependencies. The
message box visual redesign remains explicitly deferred.

The exact selected uncertainty sentence is used for the unresolved headline,
and the exact “mientras confirmamos que los cambios se han guardado” sentence
for an active request/waiting run. Inactive/restored/exhausted cases instead say
“Puedes trabajar con otros productos.” so copy does not imply background work.
Compact row labels are separate from the longer headline. The section label is
neutral “Estado de los cambios” because it also covers confirmed/rejected and
retained-draft states. Remaining nominal feedback phrases refer to changes;
valid verbal/participial forms retain their contextual use.

A read-only inventory audit selects the 172 pending recovery cases plus 28
currently accepted Spanish images affected by the shared editing labels: 200
new review candidates. The remaining 579 eligible accepted cases are compared
separately. Existing references are preserved; the revised review set needs its
own explicit approval. Earlier source/run proof remains a previous-copy checkpoint
until refreshed below.

### Copy revision verification — 2026-11-15

Verified source:
`b7f6752a1113744116ed82352457669441a95b999472762777ce1eec15b5a1d9`.
The live preview build matches that source. The renderer and font fingerprint
remain the same as the earlier checkpoint.

- `pnpm check` passes formatting, lint, type checks and **84 code tests**.
- `pnpm visual:test-languages` passes **124 browser checks**; the focused Products
  configuration passes **71 checks**. Existing assertions now verify the exact
  active helper and neutral inactive helper as well as updated result labels.
- Storybook builds and coverage passes with the unchanged 216 modules, 82 stories,
  21 view entries and 202 scenarios. All five dictionaries have 334 matching keys.
- Strict OpenSpec validation passes all seven changes.
- **200 revised candidates** pass in run **`2026-11-14T23-11-26.688Z`**.
- **579 unaffected reference comparisons** pass in run
  **`2026-11-14T23-13-25.079Z`**. Both runs have zero skipped, unexpected or flaky
  cases. The selected threshold remains 0.01 with maxDiffPixels 0.

Capture selection:

```sh
pnpm visual:capture --grep '(^| )(products-recovery-|products-catalogue-(editing-saved|results-dismissed)$|products-editing-mixed-|products-editing-unconfirmed-result$)'
```

Unchanged-reference selection:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered|(^| )(products-recovery-|products-catalogue-(editing-saved|results-dismissed)$|products-editing-mixed-|products-editing-unconfirmed-result$)'
```

Root inspected the desktop active/unresolved cases and phone active/unresolved
and mixed-panel cases. Independent visual review inspected 12 tablet, phone and
dark images covering active/unresolved, mixed-table and confirmed-storage-failure
feedback. No new clipping or overlap was found in that sample. Existing phone
product-name ellipsis remains; this copy pass does not redesign that treatment.
The full set has not been manually inspected or approved by the user.

Review the [interactive preview](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted)
and [exact revised 200-image gallery](http://localhost:9324/runs/2026-11-14T23-11-26.688Z/review.html).
This replaces the earlier pending 172-image set for review and includes 28
changed accepted Spanish cases. The 628 accepted references remain byte-for-byte
unchanged; task 9.10 still requires explicit approval before promotion. The message
box redesign stays deferred under task 9.12. No staging or commit was performed.

Ignored evidence logs use the `products-spanish-preview-` prefix for formatting,
quality, build, language, focused-browser, capture and comparison runs. Final
link/whitespace/scope checks are recorded separately during closeout.

## Compact row-status revision — selected 2026-11-15

The user selected **“Existing row-control area + subtle tint (Recommended)”**
for status presentation in the simulated Products table. This authorizes the
bounded presentation revision below. It does not approve candidate images or
change any recovery, draft, ownership, validation or production behavior.

### Selected presentation and preserved behavior

- Remove status text placed inline beside the product name. Keep the name and
  editing field space available for product data rather than allocating another
  name-adjacent status slot.
- Show a compact, distinct state marker inside the existing row expander/control
  area, supported by a subtle row tint. Keep the chevron recognizable and preserve
  its expanded/collapsed meaning; the status marker must not replace or obscure
  the expansion affordance.
- Keep the existing columns, column widths, product-name/editor widths and row
  control targets. Do not introduce a status column, widen the expander/control
  area or shrink the name/editor to make room for the marker.
- Preserve the status explanation for hover and keyboard focus. Do not rely on
  color alone: retain an accessible status explanation and show it in the visible
  expanded row content so touch users can inspect it without hover.
- Keep field-level errors beside the affected inputs and preserve the existing
  feedback/result surfaces, dismiss/reopen behavior and truthful status wording.
  This pass does not redesign the message box; that requested revision remains
  deferred under task 9.12.

Exact marker geometry and tint values are implementation proposals for the next
visual review, within the retained TailAdmin/brand treatment. Distinct visual
states must reflect existing known state rather than infer a new outcome. No
new dependency, semantic status, retry timing, ownership transition, real API,
persistence mechanism or production application change is selected.

### Bounded implementation and regression plan

Change only the preview row-status/control integration in
`apps/backoffice/.storybook/stories/products-recovery.tsx`,
`products-table-preview.tsx` and `products-table-preview.css`, plus the relevant
Storybook browser assertions/capture actions and documentation as needed. Preserve
ordinary catalogue defaults and the already selected Spanish copy. No dictionary
or model change is required merely to move this presentation.

1. Add a focused regression that fails on the current name-adjacent status
   treatment. Check that the revised marker is inside the existing expander area,
   the chevron remains visible in both expansion states and the product/editor
   widths and column set do not change across status states.
2. Verify keyboard activation/focus explanation, hover explanation and visible
   expanded-row status on touch-sized layouts. Keep field validation and existing
   recovery/ownership/result actions covered; the presentation revision must not
   change their permitted actions or command state.
3. Implement the compact marker/tint treatment in the simulated preview and rerun
   the focused regression. Run the relevant existing Products/language checks and
   required repository quality checks, recording actual results rather than
   carrying the preceding copy-only proof forward as current.
4. Audit the affected capture cases after implementation. Capture revised
   candidates across the agreed desktop, tablet, mobile and desktop-dark profiles,
   including the assembled language cases and relevant expanded/focused states.
   Inspect name/editor space, control alignment, recognizable expansion, tint
   contrast and visible status access on phones.
5. Compare the genuinely unchanged accepted cases with the established exclusions
   for separately pending navigation revisions and all newly revised/unaccepted
   cases. Record the exact selection, source/run identities, counts and remaining
   limits. Do not assume the prior 200-candidate/579-comparison split still applies
   without checking the affected inventory.
6. Present the fresh interactive preview and exact revised gallery for explicit
   user approval. Preserve all accepted reference bytes/registry entries until
   that approval; successful code/browser/comparison checks do not accept images.

### Revision status and boundaries

The selected revision is implemented and verified below. Earlier copy/preview
proof is historical for its recorded source. The latest 232 images are now
explicitly approved and promoted under the approval record below, superseding
the earlier pending status. Staging, commits and deployment remain unauthorized;
sibling repositories stay read-only.

### Row-status verification — 2026-11-15

Verified final source:
`88dfe48b0ba13a65b178592d12ae07f06a98f7d67ffd43e97c21870c0ac7d990`.
The prepared build and live source identity match. The established Mac/Chromium
renderer and font fingerprint remain unchanged.

Status is now presentation metadata instead of an inline name-adjacent node.
Clock, information and lock symbols use the existing icons inside the retained
36px/44px expander footprint, with a 14px marker container and unchanged column,
name/editor and row sizing. Light `brand-50` and dark `brand-950` tints support
the symbols; the rendered states are included in the 232-image approval below.
Full localized
explanations appear in the tooltip and expanded row. An explicit accessible
description and tooltip role are scoped to this preview; shared primitives and
all five dictionaries remain unchanged by this revision.

#### Verification and review set

- `pnpm check` passes formatting, lint, types and **84 code tests**.
- The final `pnpm visual:test-languages` run passes **128 browser checks** with
  no failures, skips or flaky cases. Four new cases cover phone editor/name
  geometry, long names, hover/keyboard status and touch expansion. Existing
  automatic recovery coverage now verifies focus when confirmation clears status.
- The **75-case focused Products suite** also passes for this UI. After the final
  test-only geometry correction described below, the combined 128-case run
  re-verifies its cases. Visual TypeScript and formatting checks also pass.
- Storybook builds; coverage reports **216 modules, 83 stories, 21 view entries
  and 210 scenarios / 840 profile cases**. The added long-name story and eight
  registered states add 32 captures, making **232 revised candidates** including
  the preceding copy revision's affected cases.
- Capture run **`2026-11-14T23-55-57.165Z`** passes all **232 candidates**.
- Comparison run **`2026-11-14T23-58-21.271Z`** passes **579 unchanged accepted
  cases**. Both runs have zero skipped, unexpected or flaky cases. They use the
  same capture/comparison filters documented for the copy revision above: the
  `products-recovery-` prefix also selects the eight new states. Separately
  pending navigation exclusions remain unchanged.
- The user-selected screenshot threshold remains **0.01, maxDiffPixels 0**.
  The **628 accepted references** and registry remain byte-for-byte unchanged.

Review the [interactive row-status preview](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted),
[long-name example](http://localhost:6006/?path=/story/inventory-products-recovery--long-product-name)
and [exact 232-image candidate gallery](http://localhost:9324/runs/2026-11-14T23-55-57.165Z/review.html).
This superseded the preceding pending 200-image review set. At this verification
checkpoint no images had been promoted; the subsequent approval record below
closes task 9.10 for this exact 232-image set.

#### Regression findings and limits

The initial phone regression measured a 19.625px protected name editor beside a
136px unaffected editor: 116.375px lost to status text. The meaningful failing
assertion is retained in ignored `products-row-marker-red.log`; the final width
assertions pass with the same available space for both editors.

The initial capture run had 228 passes and four failed tooltip lookups. A keyboard
capture adjustment alone did not resolve them. Direct DOM inspection showed the
popup was visible but the retained Tooltip composition did not supply a role or
description link automatically. Adding these to this preview resolves the role
lookup and makes the full status available to assistive technology. Tests assert
both accessible description and visible tooltip content.

A computed-style regression caught the formatter removing a conditional class
separator, preventing the expanded chevron from rotating. Explicit complete class
branches now preserve its size and direction. A separate failing focus assertion
caught conditional Tooltip removal remounting the row button on confirmation.
Keeping the Tooltip/Trigger composition stable, disabled when no status exists,
preserves focus without changing recovery behavior. Their red logs use the
`products-row-marker-chevron-red` and `products-row-marker-focus-red` names.

The combined browser run initially hit an existing strict geometry assertion:
390.0000305175781px versus a 390px viewport. That assertion now polls for settled
layout and uses two-decimal geometric precision; it does not change screenshot
comparison policy. The final 128-case run passes. This test-only change refreshed
the source-bound gallery/metadata without rebuilding unchanged application code.

Independent visual review inspected 12 desktop/tablet/phone/dark examples for
tooltip, pending/checking/locked expansion and long-name browsing/editing. All
12 PNGs are byte-identical in the final source-bound gallery; the ignored
`products-row-marker-visual-sample-proof.json` records the exact filenames.
Root also inspected representative phone tooltip, long-name editor and locked
expansion views. No material clipping or width collision was found in that sample;
this is not a claim that every image was manually inspected or approved.

Evidence logs use `products-row-marker-` prefixes; final combined browser,
capture and comparison logs end in `-verified.log`. No new dependencies, model
rules, production source, persistence, API, retry/ownership behavior, staging or
commit changed. Message box redesign remains deferred under task 9.12.

## Visual approval and reference promotion — 2026-11-15

The user explicitly approved the latest row-status review with this verbatim
reply:

> That looks better, I accept the review

The approval applies to all **232 images** from capture run
**`2026-11-14T23-55-57.165Z`**, bound to source
`88dfe48b0ba13a65b178592d12ae07f06a98f7d67ffd43e97c21870c0ac7d990` and the
established Mac/Chromium/font environment. Review the
[exact approved gallery](http://localhost:9324/runs/2026-11-14T23-55-57.165Z/review.html).
This accepts that complete latest review set, including the 28 affected Products
copy cases; it supersedes the earlier pending 172-image recovery and 200-image
copy review sets. It does not approve unrelated pending navigation revisions or
future image changes.

Root executed the visual workflow's promotion command for the exact run using
the user's reply verbatim as approval evidence. Promotion and its scoped
verification confirm:

- **204 new recovery reference images/entries** were added.
- **28 existing Products reference images/entries** were replaced by their exact
  approved capture bytes.
- The **600 unrelated existing reference images and registry entries** were
  preserved; only the approved selection's reference/registry records changed.
- The accepted baseline grew from the historical **628** entries to **832**.

Task 9.10 is complete for this exact selection. The earlier first-editor
156-image approval and its 628-entry baseline remain historical checkpoints;
the current accepted set is 832. The separately pending navigation review still
contains **12 replacement images and eight new images** and remains unapproved.
Approval/promotion establishes these reference images, not production storage,
ownership locking, API integration, deployment readiness or broader product
completion. No staging, Git commit or deployment was authorized or performed by
this approval.

### Post-approval comparison — passed 2026-11-15

The post-approval accepted-reference comparison used this selection:

```sh
pnpm visual:compare --grep-invert '(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered'
```

It selects **811 accepted cases**, including Products and recovery. Only the
separately pending navigation exclusions remain: the 21 mobile navigation cases
and eight new dropdown cases. The exclusion does not approve those revisions;
nine of the excluded mobile cases are unchanged and 12 await replacement approval.
The command must not exclude Products/recovery now that their exact references
are accepted.

The comparison passes all **811 expected cases** in run
**`2026-11-15T00-12-39.768Z`**, with **zero skipped, unexpected or flaky cases**
and exit code 0. It uses the same source
`88dfe48b0ba13a65b178592d12ae07f06a98f7d67ffd43e97c21870c0ac7d990`;
recorded duration is 3.9 minutes. Ignored output is in
`.cache/products-row-marker-postapproval-compare.log`. This is the actual
post-promotion result and closes task 9.18; the earlier 579-case pre-promotion
comparison is retained as its separate historical checkpoint. Message box
redesign remains deferred under task 9.12.

## Commit preparation — 2026-11-16

After the 232-image approval and passing post-approval comparison, the assistant
recommended two commit batches: implementation/specifications, then approved
visual references. The user replied **“go ahead”**, authorizing this preparation.
This is new staging authority for the exact batches below; earlier statements
that visual approval alone did not authorize staging remain historically correct.
Only the user executes commits. No Git commit, push or deployment is authorized
for an agent.

| Batch | Contents                                                                                                                                                                      | Files | Proposed user commit                                    |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------- |
| 1     | Storybook recovery/ownership model and UI, row-status treatment, five-language copy, browser/model tests, visual inventory/actions/configuration, OpenSpec and agent guidance | 30    | `feat: prototype product recovery and draft ownership`  |
| 2     | The 232 specifically approved PNGs and `visual/references.json`                                                                                                               | 233   | `test: add approved product recovery visual references` |

Prepare one index batch at a time. The first excludes every reference image and
the registry. After the user reports the first commit, verify its contents and
the remaining working tree before staging the second batch. A checkout between
these commits has the new catalogue cases but lacks their new reference files;
the second commit completes the reviewed visual baseline. Do not stage unrelated
navigation candidates or start the deferred message box redesign.

The pre-preparation HEAD is `eb49dea` and the index was empty. A fresh `pnpm check`
on 2026-11-16 passes formatting, lint, types and 84 code tests. Current source and
prepared build still match the approved source
`88dfe48b0ba13a65b178592d12ae07f06a98f7d67ffd43e97c21870c0ac7d990`, so the recorded
128-case browser proof and 811-case post-approval comparison remain applicable;
the source-bound comparison metadata was verified again during preparation.
The staged path/blob scope, approved reference bytes, strict OpenSpec, local
links and whitespace are checked before handing off the user commit command.

The ignored `.cache/products-recovery-commit-batches.json` records the exact path
sets and preparation snapshot. It is a local aid, not a file to commit. The
approved image scope remains 204 new cases and 28 replacements, preserving the
other 600 entries for an 832-reference baseline. Neither staging batch changes
production code, dependencies, retry/storage/ownership policies or approval of
the separate navigation revisions.
