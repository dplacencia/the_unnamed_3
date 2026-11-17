# Products feedback preview implementation plan

**Goal:** implement the selected compact inline summary and expandable details in
Products save-result and recovery-status previews, then present exact candidates.

**Architecture:** a small controlled, Storybook-only presentation component reused
by the two existing result/recovery views. Existing controllers own state,
scope, dismissal snapshots and original commands. Shared presentation does not
merge results, introduce counts or change recovery/ownership policy.

**Tech stack:** retained React/TypeScript, TailAdmin Button/icons, existing
catalogue messages, CSS and pinned Playwright. No new dependency or production UI.

## Authority and boundaries

The user selected **“Save results + recovery status (Recommended)”**, then
**“Compact inline summary + expandable details (Recommended)”** for development
in the simulated Storybook preview. Read [the selected design](feedback-design.md#selected-direction-and-preview-authority--2026-11-16)
and PT-027–041 before changes. The 912 accepted references and separate 20 pending
navigation revisions remain untouched; future candidates need specific approval.
Both prior staging permissions are spent. Never stage or commit in this pass.

Work in the current authorized `_3` checkout, retaining existing discovery docs;
do not create sibling changes or abandon that working state for another checkout.
The repository's OpenSpec and never-commit instructions override generic skill
plan locations/commit steps.

## 1. Test the selected disclosure and preserved behavior first

Create `visual/tests/products-feedback.spec.ts`; register it in
`visual/products-table.config.ts` and `visual/playwright.languages.config.ts`.
Against the existing prepared preview, obtain a meaningful failing assertion for
disclosure semantics (expanded state/controlled details and a truthful reopen
affordance), not an unrelated setup/import/port failure. Retain RED evidence in
ignored cache before implementing the new UI.

Cover both scoped surfaces: expanded/collapsed status, keyboard/focus return,
new editing results after dismissal, per-product/per-field values, retry
eligibility and paused affected products, global uncertainty under filtering,
phone wrapping/touch targets, five-language controls and focused accessibility.
Reuse current tests for established state transitions; do not invent a new
outcome/quantity/count policy to simplify assertions.

## 2. Reusable controlled presentation and editing integration

Create `.storybook/stories/products-feedback.tsx`. Its controlled API supplies a
region label, existing summary text, `expanded`/`onExpandedChange`, existing
expand/collapse labels, visible `gridDetails` label, optional disabled state and
presentation tone, children and optional always-visible footer. Allow existing
root/toggle data attributes so current scenario/test hooks remain stable.

Use a compact neutral TailAdmin frame, a meaningful status icon, clear summary
and a consistent labelled chevron disclosure. Use existing `gridDetails`,
`peShowResults` and `peDismissResults` translations; no new copy is needed merely
to label the control. Text and icons convey meaning alongside colour. Preserve
44px phone control targets, appropriate polite status announcements and natural
wrapping; no X whose action is to reopen details.

Integrate only `EditingResultsView` in `products-editing.tsx`; retain its submitted
snapshot/product-scoped dismissal model, sending guards, inspected-product scope
and new-result visibility. Preserve existing root/toggle/product/field data
attributes. Make product identity/SKU and field value/outcome rows compact and
readable without truncating away the accepted exact text or its inspection path.

Keep shared feedback styling in `products-table-preview.css`. Do not change row
markers, table controls, ordinary validation/guard dialogs or unrelated primitives.

## 3. Recovery integration without policy changes

Integrate the same presentation in `products-recovery.tsx` when recovery commands
exist. Retain its existing controlled details state, exact recovery header/status
selection, per-command actions and polite row announcements. Hiding details must
not hide the global unresolved state or restart a command.

Capability/retention/ownership content stays truthful and distinct from business
outcomes. Existing auxiliary notes remain visible according to current conditions,
including when details are collapsed. Keep draft-only/history-only notices and
their dialogs outside the result-box redesign; avoid changing their behavior or
styling merely because they share a current container. Do not reset other editor
state during the presentation change.

## 4. Verification and exact visual review

Root coordinates file ownership, reviews both integrations and verifies the RED
regression becomes GREEN. Run `pnpm check`, the combined language/browser suite
and appropriate focused checks once the final source is prepared. Rebuild the
Storybook artifacts with the pinned environment, refresh build identity and
restart task-owned previews; do not reuse an occupied stale-source server.

Audit actual visible feedback scenarios before selecting capture/comparison
patterns. Root owns `visual/products-actions.ts`, `visual/inventory.json` and
`visual/README.md` if they need updates. Cover expanded/collapsed, success/mixed/
unconfirmed/active recovery, long text, affected filtered products and five-language
views across desktop/tablet/phone/dark profiles. Counts are unassigned until that
audit. Normalize document position for intentionally full-page feedback cases
where focus scrolling would shift a sticky header; do not hardcode locale offsets.
The shared `data-products-feedback` marker scopes this capture preparation in
`visual/tests/catalogue.spec.ts`; frames without the redesigned surfaces retain
their existing preparation. The prior language reopen assertion may identify the
generic region label through `aria-label` and verify the actual saved summary,
instead of requiring a redundant visible heading.

Capture and unchanged-reference comparison must run sequentially because they
share report paths. Keep renderer/fonts/threshold 0.01/maxDiffPixels 0 unchanged.
Inspect representative final-source PNGs independently. Record exact source,
runs, passing/failing checks, limitations and preserved reference hashes here.
Present the exact gallery and interactive examples for user review; successful
tests/captures do not promote references or authorize staging/commits.

## Status

The selected preview is implemented and verified: 113 code tests, 149 combined
browser checks and 164 candidate captures pass. Unchanged-reference evidence
covers all 743 expected case IDs through the exact partitioned proof below.
The initial seven-pixel comparison variance remains documented rather than
claimed fixed. The user accepted the exact 164-image set with **“that looks ok”**;
all are promoted, bringing the baseline to 928 references. All 164 changed-case
post-approval comparisons pass; matching-source evidence covers all 907 eligible
cases as recorded below. No staging or commit follows.

## Scope audit and initial review evidence

Root exercised all **110 existing Products scenarios** against the prepared
`9be24237…` baseline, observing actual result/recovery DOM rather than guessing
from story names. **37 scenarios** contain the selected surfaces: ten have
editing feedback and 29 have command recovery feedback, with two overlapping.
Their 148 profile cases need new candidate captures. Draft/history-only frames
remain outside that set; an independent recovery-source audit corroborated its
29 command-feedback scenarios.

Four additional save-result cases in existing English, Catalan, Galician and
Basque stories add **16 cases**, so the final selection is **41 scenarios / 164
candidates**. The full inventory is 234 scenarios / 936 profile cases, with source
modules/stories/views unchanged. **743 unaffected approved comparisons** exclude
these cases and retain the existing 29 navigation exclusions. The audited exact
case IDs/patterns are in `.cache/products-feedback-scope.json`; the baseline DOM
audit is `.cache/products-feedback-audit.log` (110 passed). Capture/comparison
must use that exact selection and record their final run identities below.

The first new browser test meaningfully failed because the old recovery button
had no `aria-expanded` (`.cache/products-feedback-red.log`). The first integrated
pass had eight successes and an Axe failure: the visible Detalles label was not
part of the accessible name. Independent quality review confirmed that finding.
The correction composes the existing translated Details and expand/collapse
labels; multilingual label-in-name assertions and existing selectors follow the
same user-visible/accessibility contract. No translated status meaning changes.

Initial geometry probes also exposed a phone-space regression before review:
recovery desktop/phone heights changed from 126/142 to 131/159 pixels, and the
two-product mixed-result example from 172/200 to 125/211. Those measurements are
fixture evidence, not accepted layout limits. Header/body spacing was tightened
without shrinking control targets; remeasure after preparing the final source.
The old `.cache/products-feedback-green.log` therefore describes an intermediate
failed checkpoint, not final verification.

## Execution and review — 2026-11-16

Final source/build identity:
**`8ac7d6d269bffa275599b021feed1ec1057e36fe22e054058cc112194803265e`**.
The retained renderer is macOS 27 arm64, Chromium `158.0.8127.18`, Playwright
`1.65.0`, GPU disabled, DPR 1 and approved font manifest
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
Threshold `0.01` and `maxDiffPixels: 0` are unchanged.

The new controlled component is reused by `EditingResultsView` and command-present
recovery summaries. Both preserve their own source state. Draft/history-only
fallback frames retain their original class/conditioned content. Independent spec
review checked the controller/guard/remaining recovery source against HEAD and
found those portions unchanged. Independent quality review's label-in-name
finding was corrected and re-reviewed without remaining material findings.

The focused browser checks pass **9/9** after the real missing-disclosure RED and
the corrected accessible label. A subsequent test-readiness failure was fixed by
waiting for the asynchronous saved/collapsed region to become visible before
running Axe; no check was disabled. The final combined suite includes these
checks at the final prepared source.

| Verification                    | Result / evidence                                                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                    | Passed formatting/lint/types and **113 code tests** (34 app + 79 visual/model). `.cache/products-feedback-check-verified.log`.                                                      |
| Storybook preparation/coverage  | Passed; no production source/build change is claimed. `.cache/products-feedback-build-verified.log`.                                                                                |
| `pnpm visual:test-languages`    | **149 passed**, including all established Products/recovery/filter/navigation checks and the new feedback checks. `.cache/products-feedback-browser-verified.log`.                  |
| Focused feedback browser checks | **9 passed**; overlap the combined suite rather than adding nine unique cases. `.cache/products-feedback-green-ready.log`.                                                          |
| Feedback captures               | **164 passed**, exit 0, zero skipped/unexpected/flaky, in `2026-11-16T20-34-28.774Z`. `.cache/products-feedback-capture.log`.                                                       |
| Unchanged-reference comparison  | 742 passed in the batch; one existing seven-pixel case passed three isolated repeats. Exact partitioned proof covers all 743 IDs. `.cache/products-feedback-comparison-proof.json`. |

The audit confirms 216 retained source modules, 84 stories, 21 view entries and
234 named scenarios / 936 matrix cases, with no missing/unknown source, missing/
unregistered story or duplicate ID. Four new localized save-result scenarios
account for the inventory increase. All 164 expected image IDs and PNG hashes
match the final source/build, with no missing/extra case:
`.cache/products-feedback-candidate-proof.json`.

### Space and representative visual checks

The same two synthetic fixtures were measured before and after the final spacing
refinement. These results are bounded fixture observations, not approved universal
dimensions or a general usability/performance claim:

| Expanded box                       | Before | Revised |
| ---------------------------------- | -----: | ------: |
| Recovery, desktop 1440×900         |  126px |   115px |
| Recovery, phone 390×844            |  142px |   135px |
| Two-product mixed results, desktop |  172px |   109px |
| Two-product mixed results, phone   |  200px |   195px |

Control targets remain 44px on phones. The measurements are preserved in
`.cache/products-feedback-baseline-metrics.log` and
`.cache/products-feedback-revised-metrics-final.log`. Exact visual treatment
remains a review proposal.

Independent final-source image inspection found no material clipping/layout
defects in these ten PNGs; their source IDs and hashes were checked:

- `products-editing-mixed-table-results--desktop.png`.
- `products-editing-mixed-panel-results--desktop.png`.
- `products-editing-mixed-table-dismissed--tablet.png`.
- `products-recovery-exhausted-default--desktop.png`.
- `products-recovery-exhausted-dismissed--desktop.png`.
- `products-recovery-long-product-name-table-editing--mobile.png`.
- `products-recovery-confirmed-storage-failure-default--tablet.png`.
- `products-recovery-memory-only-default--mobile.png`.
- `products-ca-results--desktop-dark.png`.
- `products-eu-results--mobile.png`.

Root additionally inspected final desktop mixed results and phone exhausted
recovery. Those samples complement the user's complete gallery review.

### Exact candidate review and preserved baseline

Review the [164-image gallery](http://localhost:9324/runs/2026-11-16T20-34-28.774Z/review.html),
[live recovery example](http://localhost:6006/?path=/story/inventory-products-recovery--exhausted)
and [mixed-results example](http://localhost:6006/?path=/story/inventory-products--editing-mixed).
For the latter interactive example, explicitly edit and save synthetic product
changes; the gallery already displays prepared result states.

Before promotion, all **912 accepted PNGs and the registry** matched the approved aggregate
`5c536153dae8a9c86ba6d0a30fa7615df789f9405149afbe0c5000ca8b7a9f67`.
No image had yet been promoted at that checkpoint. The separate 20 navigation revisions remain
unapproved. No staging, commit, production write or dependency change follows.

### Comparison variance and final coverage

The initial scoped comparison `2026-11-16T20-36-38.232Z` had **742 passed / one
failed**, with exit 1. The unchanged `products-filters-eu-positive--tablet` case
showed the previously observed seven-pixel moon-icon difference. Its actual PNG
is byte-identical to the preserved unrelated failure from the prior filters
checkpoint. There is no new feedback frame in this case. A rendering/subpixel
cause remains a hypothesis; this pass does not claim to resolve the recurrence.

All **three isolated repeats** of that exact tablet case passed in
`2026-11-16T20-42-49.642Z`, exit 0, zero skipped/unexpected/flaky cases. The
source/build and all accepted reference bytes remained unchanged. The union of
742 batch passes and the one repeated case equals exactly the **743 expected
unchanged case IDs**, with no missing/extra case. Original failed statistics,
screenshots and traces are retained. See `.cache/products-feedback-comparison-proof.json`
and `.cache/products-feedback-compare-first/`. This is partitioned evidence, not
a claim that the initial batch passed or that future rendering is deterministic.

Exact scoped commands (capture and comparison run sequentially):

```sh
feedback_cases='(^| )(products-catalogue-(editing-saved|results-dismissed)$|products-editing-(mixed|unconfirmed)-|products-(en|ca|gl|eu)-results$|products-filters-recovery-pending$|products-recovery-(exhausted-|automatic-|restored-(default|resumed)$|long-product-name-|(memory-only|local-storage|confirmed-storage-failure|recovery-elsewhere|coordination-unavailable)-default$|(en|ca|gl|eu)-(memory-only|restored)-default$|unreachable-editor-saved$))'
pnpm visual:capture --grep "$feedback_cases"
pnpm visual:compare --grep-invert "(^mobile .*navigation-)|navigation-workspace-location-options|navigation-workspace-location-option-hovered|$feedback_cases"
```

Pre-approval documentation closeout passed repository formatting, strict validation of
all seven OpenSpec changes, 137 local file/heading links across nine changed
Markdown documents, and `git diff --check`. Both exact review URLs respond with
HTTP 200. The index was empty; no references had been promoted and no commit was made.

## Visual approval and reference promotion — 2026-11-16

The user replied **“that looks ok”** to the delivered live preview and exact
[164-image gallery](http://localhost:9324/runs/2026-11-16T20-34-28.774Z/review.html).
This accepts that named feedback revision: all 164 cases in run
`2026-11-16T20-34-28.774Z`, source
`8ac7d6d269bffa275599b021feed1ec1057e36fe22e054058cc112194803265e`.
It supersedes the pending approval above for this exact set only.

Root promoted **148 existing entries and 16 new localized-result entries**,
preserving the other **764 reference images/registry records** byte-for-byte.
The baseline now contains **928 references**. The official promotion validated
the reviewed source, renderer and image hashes. The independent scope audit and
`.cache/products-feedback-promotion-proof.json` confirm the exact selection and
zero preservation issues; the before state is retained in
`.cache/products-feedback-before-promotion.json`. Navigation is excluded.
Changed-case post-approval verification is complete.

Post-approval verification needs the changed 164 cases only. The other 743
eligible cases have matching-source passing evidence and unchanged reference
bytes; their union covers all 907 current eligible cases. Do not erase the
previous intermittent icon failure or call its cause resolved. No new staging,
commits, production work or deployment follows from this image approval.

### Post-approval verification — complete

All **164 freshly accepted cases passed** in `2026-11-16T20-57-02.794Z`, exit 0,
with zero skipped/unexpected/flaky cases. Source/build remain `8ac7d6d2…`.
The other **743 cases** retain their matching-source passing evidence and their
reference bytes/metadata are proven unchanged by promotion. The exact union is
all **907 eligible current case IDs**, with no missing/extra case. This is
partitioned evidence; the earlier icon variance and failed initial statistics
remain recorded above. Proof: `.cache/products-feedback-post-approval-proof.json`
and `.cache/products-feedback-post-approval-compare.log`.

The 928-image/registry path-NUL-content SHA-256 aggregate is
`9802bb768a649251991cbf6013eee931e11039143d0bb89e4ed887025dd4224c`.
The independent post-promotion audit verified all 928 PNGs against their ledger,
all 164 selected approval/source/run/profile records and all 764 preserved entries.
The index remains empty. No agent staged or committed changes in this pass.

Approval closeout also passes repository formatting, strict validation of all
seven OpenSpec changes, 141 local file/heading links across nine changed Markdown
documents and `git diff --check`. The source and accepted-reference aggregate
remain the verified values above.

## Commit preparation — 2026-11-16

After the accepted feedback revision and verification, root recommended two
commit batches: 21 implementation files, then 165 approved-reference files. The
user said **“go ahead”**. This is new staging authority for those exact sequential
batches, superseding the earlier no-staging status for them only. The standing
instruction **never create commits** remains absolute.

The starting checkpoint is `3853ee6860cd75eccd95217c001c6d0bd5dd9d80`, with an
empty index. Current source remains `8ac7d6d2…`; accepted-reference aggregate is
`9802bb768a649251991cbf6013eee931e11039143d0bb89e4ed887025dd4224c`.
Independent read-only audit confirms the exact file scope and approval identities.

### Batch 1 — Feedback implementation and specifications

Stage exactly **21 files**: the shared Storybook feedback component, its two
integrations and CSS, browser tests/configuration, capture preparation/actions,
localized-result inventory cases, visual guide, feedback design/plan/requirement
and tasks, prior checkpoint closeout, and current agent/configuration entry points.
There are 17 modified and four new files. No reference file belongs in this index.

After verifying exact paths and staged content, provide the user this command
without executing it:

```sh
git commit -m "feat: refine product save and recovery feedback"
```

### Batch 2 — Specifically approved visual references

After the user commits batch 1, verify that commit against its prepared manifest
and inspect the remaining tree. Then stage exactly **165 files**:
`visual/references.json`, 148 changed existing PNGs and 16 new localized-result
PNGs. All are bound to the accepted 164-case source/gallery. Preserve the other
764 reference entries/images and all separate navigation review boundaries.
Provide this command only after staging/verifying that batch:

```sh
git commit -m "test: accept product feedback visual references"
```

The ignored exact file/hash manifests are
`.cache/products-feedback-implementation-batch.json` and
`.cache/products-feedback-reference-batch.json`; staged proof is separate. No
production source, dependency, navigation source, cache/generated artifact, push,
deployment or additional design is included. Batch 2 waits for the user's first
commit. No agent commit is authorized.

## Completed checkpoint — 2026-11-16

The user created both commits: `0b0d9d63507ec1d3ab78db48f654189f689443ba`
(`feat: refine product save and recovery feedback`) and
`21ea7c7d3ee3fb2ac3b6452b24cd8f312ae83ae4`
(`test: accept product feedback visual references`). Root and an independent
read-only audit verified their exact 21/165-file path and blob manifests,
parent relationship and clean final tree/index. Tasks 11.10–11.11 are complete.

Source/build remain `8ac7d6d2…`, all 928 accepted images match their ledger,
and the reference aggregate remains `9802bb76…`. Ignored proof is in
`.cache/products-feedback-checkpoint-complete.json`. Both staging authorities
are spent; no agent committed. The subsequent user-authorized
[navigation review preparation](../define-backoffice-navigation/visual-review-plan.md)
preserves this baseline and requests separate approval of its own images.
