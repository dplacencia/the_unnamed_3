# Agent entry point

Before task actions, read these OpenSpec records in full:

1. [Specification workflow and agent boundaries](openspec/changes/establish-frontend-foundation/specs/specification-workflow/spec.md).
2. [Frontend product scope](openspec/changes/establish-frontend-foundation/specs/frontend-scope/spec.md).
3. [Product values](openspec/changes/establish-frontend-foundation/specs/product-values/spec.md).
4. The foundation change's [proposal](openspec/changes/establish-frontend-foundation/proposal.md),
   [source instructions, decisions and open questions](openspec/changes/establish-frontend-foundation/design.md)
   and [tasks](openspec/changes/establish-frontend-foundation/tasks.md).

Then read the current user assignment and its relevant OpenSpec specifications
and change artifacts. Start from the
[recorded authority and status](openspec/changes/establish-frontend-foundation/proposal.md#authority-and-status);
the linked records distinguish approved source decisions from newly recorded
wording and unresolved choices. Future accepted changes retain their explicit
scope; these entry-point links are not approval or execution authority.

Current assignment — 2026-11-18: the [Consultar existencias definition](openspec/changes/define-stock-lookup/proposal.md)
records the exact read contract and SL-001–011 for one product and one
authorized stock location. The user selected **“Build the simulated preview
(Recommended)”** for the [Storybook plan](openspec/changes/define-stock-lookup/preview-plan.md).
Read sibling sources without changes. Never create a commit.

The first stock receipt checkpoint is complete. User commits `ac24bbb` and
`04746ae` match the 20- and 85-file manifests. The tree and index were clean and
the registry carried 1,228 accepted references before stock lookup discovery.
See the [receipt approval record](openspec/changes/define-first-stock-receipt/preview-plan.md#visual-approval-and-reference-promotion--2026-11-17).

Previous assignment — 2026-11-17: the user said **“go ahead”** to the simulated
Storybook [product creation preview](openspec/changes/define-product-creation/preview-plan.md)
after defining PC-001–010. The [creation design](openspec/changes/define-product-creation/design.md)
records the accepted concept, Inventory constraints and selected behavior. Use
the existing Products workspace and synthetic outcomes. Review new candidates
against the current visual workflow. Read sibling repositories without changes.
Never create a commit.

The user approved the exact 60-image creation gallery. The
[approval record](openspec/changes/define-product-creation/preview-plan.md#visual-approval-and-reference-promotion--2026-11-17)
records promotion and preservation of 1,084 prior references. The later
checkpoint assignment above covers staging these references.

The toolbar checkpoint is complete at user commit `2652246`. The exact six-file
batch and clean tree/index were verified before this pass. Its staging authority
is spent. The [investigation record](openspec/changes/define-products-table/toolbar-rendering-followup.md#verification-and-handoff)
preserves the unresolved visual differences.

Previous investigation — 2026-11-17: the user said **“go ahead”** to investigating the
reported Basque toolbar overlap and intermittent visual comparisons without
threshold changes. Follow the [bounded follow-up](openspec/changes/define-products-table/toolbar-rendering-followup.md).
The alleged overlap is not present in the measured approved/live state; the
earlier screenshot impression was wrong. Five Products-injected-toolbar locale
regressions are added; no CSS fix is justified. Bounded real-app probes reproduce
the mobile border variant, but transition waiting does not remove it and static
replays do not reproduce between-context variation. The underlying cause and
original moon-icon variant remain unresolved; no capture/renderer repair is claimed.
The bounded investigation is complete: 134 code tests, 184 browser checks,
Storybook/coverage and seven strict OpenSpec changes pass. Independent reviews
pass; all 1,084 reference paths/hashes and the font manifest are preserved.
No new visual candidates or wholly green comparison claim. Changes were unstaged
at that handoff; the later preparation authority above supersedes its no-Git limit.
Preserve all 1,084 approved references, renderer/fonts/profiles and thresholds.
Any changed images need new specific approval. No Git, API or next-flow work.

The [browsing checkpoint](openspec/changes/define-products-table/toolbar-rendering-followup.md#authority-and-starting-checkpoint--2026-11-17)
is complete: both user commits match the exact 31/149-file manifests and the
tree/index were clean before this new work. Previous staging authority is spent.
Never create commits.

Previous commit preparation — 2026-11-17: the user said **“go ahead”** after the
recommendation to checkpoint the approved browsing work in two sequential batches.
Follow the [preparation record](openspec/changes/define-products-table/browsing-preview-plan.md#commit-preparation--2026-11-17).
Stage only the 31 implementation/specification/test/documentation files first and
provide the commit command. Leave all 149 reference files unstaged. After the user
commits that exact first batch, verify its prepared manifest, then stage the 149
reference files and provide their command. No UI/API continuation is initiated;
the visual comparison limitations remain explicit. Never create commits.

Previous visual approval — 2026-11-17: the user answered **“Approve all 148 images”**
for exact run `2026-11-17T12-43-29.019Z`, source `5f628f39…`. Read the
[approval record](openspec/changes/define-products-table/browsing-preview-plan.md#visual-approval-and-reference-promotion--2026-11-17).
Only those 148 new cases are promoted, preserving all 936 prior images/entries,
for 1,084 accepted references. Earlier pending/no-promotion wording is superseded
for this set only. The page number remains synthetic; Inventory supplies no
authoritative current-page number or Products search-pagination contract.
Retain the known icon intermittency and Basque toolbar follow-up. No new UI/API
work, staging or commit follows. Never create commits.
Post-promotion comparison is 147/148: one phone invalid-off-page image has an
intermittent one-pixel button-border difference (two passes/one isolated failure).
The original-scope icon variance also remains. Read the record; do not claim
wholly green comparisons or alter accepted references/tolerance to hide variance.

Previous revision — 2026-11-17: the user selected **“Between Anterior and Siguiente
(Recommended)”** for a visible current-page number under PT-054. Execute the
[bounded page-number revision](openspec/changes/define-products-table/browsing-preview-plan.md#current-page-indicator-revision--2026-11-17).
Advance only with a successful displayed result; retain its number during reads/
errors and keep estimated totals separate. Refresh the exact visual proposal;
the original 148 images are not approved. Preserve all 936 accepted references,
renderer/fonts/tolerance and empty index. Never promote, stage or commit.

Revision evidence: source `5f628f39d4e783d8ddc33bbb13810946ec7e81c3e194e6f4cab51ab401676943`,
134 code tests, 179 full browser checks (30 focused), and 148 successful capture
checks. The exact gallery `2026-11-17T12-43-29.019Z` supersedes the unapproved
`12-09-39` proposal. Footer-scoped source/visual reviews pass. Read the revision
record for the accepted-reference comparison proof and separately recorded
pre-existing Basque phone toolbar observation. Visual approval is recorded above.
The current reference comparison is not wholly green: 935/936 pass; one existing
Catalan tablet moon-icon case remains intermittent (one pass/two isolated failures).
Keep that limitation explicit; no renderer fix or new visual acceptance is claimed.

Previous execution — 2026-11-17: the user selected **“Build the prepared simulated
preview (Recommended)”**. Execute the [bounded browsing plan](openspec/changes/define-products-table/browsing-preview-plan.md)
for PT-044–053: 1,000 synthetic products, 10,000-record bounded-DOM check, existing
demo matching/sort, selective paging-control busy/latest-view protection and no
real API or new dependency. The plan's file scope supersedes the earlier
no-source-edit status for this preview only. Keep the full editor stable, settled
scope honest and all 936 accepted references unchanged. Exact visuals require
review. No promotion, staging or commit follows; never create commits.

Previous verification — 2026-11-17: that preview is implemented at source
`1e81de9490b0fb72e279400ec14daebddaed5f3923d052d9e39688b16c756500`.
The linked plan records 130 code tests, 178 browser checks, 148 candidate captures,
independent reviews and passing comparison evidence for all 936 accepted cases,
including one documented moon-icon variance followed by three passing repeats.
The exact run `2026-11-17T12-09-39.261Z` is pending specific visual approval;
accepted references remain unchanged and the index is empty. Continue from that
review boundary; do not repeat implementation or infer image approval.

Previous discovery — 2026-11-17: the user said **“go ahead, make sure you check how
inventory module handles pagination”** after root recommended completing Products
browsing at realistic catalogue sizes. Follow the [browsing discovery](openspec/changes/define-products-table/browsing-design.md).
Inventory is read-only. Its supporting catalogue/stock collection paging does
not define Products search pagination; the inspected product handler reads an
exact permanent ID. Record the current contract/implementation distinction and
ask about unresolved frontend choices. The user selected **“Anterior / Siguiente
(Recommended)”**: PT-044 records explicit directional controls replacing visible
rows. The user also selected **“50 by default; 25/50/100 options (Recommended)”**;
PT-045 records first-preview page sizes without adopting backend limits. Do not
repeat these choices. The user selected **“Remember per tab; restart when size
changes (Recommended)”** under PT-046: remember size for the same tab/business,
start new tabs at 50 and restart at the first result group on size change,
preserving submitted search, sorting, applied filters and stock/location settings.
The user selected **“Displayed count + supplied, labelled estimate (Recommended)”**
under PT-047: exact displayed-product count plus an explicitly labelled supplied
estimate; with no supplied total, show only the displayed count. No count API or
estimate-request policy follows. The user selected **“Keep drafts across pages;
save together (Recommended)”** under PT-048: retain table drafts across groups,
one explicit save includes off-page edits, errors remain accessible and leaving
Products keeps the existing guard. Individual outcomes, all-draft validation and
original-command recovery remain. The user selected **“Keep marked previous
results while loading (Recommended)”** under PT-049: neutral first load, marked
previous results during later page loads, replacement on success and inline
technical-read error with Retry, retaining previous results when available.
No automatic read budget or write retry follows. The user selected **“Use shared
reset policy (Recommended)”** under PT-050: submitted-search/sort/applied-filter
changes restart at the first group, retaining size/drafts; layout-only/density
changes keep the current group. The user selected **“Keep position when not
stock-filtered (Recommended)”** under PT-051: location changes retain position
without the stock-only filter and restart with it active; hiding stock that
clears it also restarts. Preserve size/drafts/other settings and honest stock
scope. The user selected **“Restore position with a fresh read (Recommended)”**
under PT-052: restore last result-group position in the same tab/business on
return/refresh using fresh data; if reported unusable, explain and offer explicit
Volver al inicio. Preserve view/size and draft/recovery rules. No silent reset or
automatic write/recovery follows. Precise matching/sort and in-flight load/save
details remain open. The [bounded browsing preview plan](openspec/changes/define-products-table/browsing-preview-plan.md)
is selected for implementation: demo-only matching/sort, larger synthetic fixtures
and explicit paging-control busy/latest-view behavior under PT-053. Execute only
its bounded file scope and preserve all 936 accepted references until specific
candidate approval. Production matching/sort and coordination stay deferred.
No new dependency, API/IAM/hosting, Inventory edit, staging or commit follows.

The [navigation checkpoint is complete](openspec/changes/define-backoffice-navigation/visual-review-plan.md#completed-checkpoint--2026-11-17):
user commits `a3363fc` and `3ae4cbd` match the exact nine/21-file manifests.
Tree/index were verified clean before this discovery documentation pass.
The former staging authority is spent. Never create commits.

Previous assignment — 2026-11-17: the user said **“go ahead”** to two sequential
commit batches. Follow the [commit-preparation record](openspec/changes/define-backoffice-navigation/visual-review-plan.md#commit-preparation--2026-11-17).
Stage exactly nine documentation/configuration files first and give the user the
commit command. Leave all 21 approved-reference files outside the index. After
the user commits that exact first batch, verify it and stage the reference batch.
This new authority applies only to these batches; image approval alone did not
authorize staging. No further design follows. Never create a commit.

Latest approval — 2026-11-17: the user said **“I approve them”** for the exact
20-image navigation gallery `2026-11-16T21-25-06.512Z`, source `8ac7d6d2…`.
Read the [approval and verification record](openspec/changes/define-backoffice-navigation/visual-review-plan.md#visual-approval-and-reference-promotion--2026-11-17).
All 12 phone replacements and eight new dropdown images are promoted, preserving
916 unrelated images/registry entries, for **936 accepted references**.
All 20 changed-case comparisons pass; matching-source preserved evidence covers
the other 916 cases. The exact union verifies all 936 current IDs. No renderer
fix is claimed for the previously recorded intermittent icon variance.
No new staging, commit, UI design or further Products work follows. Never commit.

Previous preparation — 2026-11-16: the user said **“go ahead”** to closing the
outstanding navigation visual review. Follow the [bounded review plan](openspec/changes/define-backoffice-navigation/visual-review-plan.md):
prepare the exact 12 phone replacements and eight new dropdown states at the
current source, compare the nine unchanged phone cases, and present the fresh
20-image gallery for specific approval. Preserve all 928 accepted references and
selected NAV-019–021 behavior. No new UI design, reference promotion, staging,
commit or further Products work follows from this review-preparation authority.

The [feedback checkpoint is complete](openspec/changes/define-products-table/feedback-preview-plan.md#completed-checkpoint--2026-11-16):
user commits `0b0d9d6` and `21ea7c7` match the exact 21/165-file manifests.
Both were verified with a clean tree/index before this new documentation pass.
Tasks 11.10–11.11 are complete and their staging authority is spent. Never commit.

Previous design assignment — 2026-11-16: the user said **“go ahead”** to revisiting the
deferred message-box design. Read the [feedback design discovery](openspec/changes/define-products-table/feedback-design.md)
and task 9.12. Inventory the existing save-result/recovery surfaces and preserve
their selected state, dismissal, uncertainty, retry and accessibility rules.
The user selected **“Save results + recovery status (Recommended)”**. Field
validation, confirmation dialogs and a general notice system remain separate.
The user then selected **“Compact inline summary + expandable details
(Recommended)”** for development in the simulated Storybook preview. Execute the
[bounded feedback plan](openspec/changes/define-products-table/feedback-preview-plan.md),
preserving distinct state sources and current save/retry/dismissal/new-result
rules. Do not repeat those choices. Exact visual metrics remain review proposals;
new candidate images require specific approval. No new staging or commit follows.
The [execution record](openspec/changes/define-products-table/feedback-preview-plan.md#execution-and-review--2026-11-16)
now records final source `8ac7d6d2…`, 113 code tests, 149 browser checks, 164
candidate images and partitioned verification of 743 unchanged cases. The known
intermittent seven-pixel icon comparison and its passing repeats remain explicit;
it is not claimed fixed. The user accepted all 164 feedback images with
**“that looks ok”** for that exact gallery/source. All are promoted: 148 existing
entries, 16 new and 764 unrelated entries preserved, for **928 accepted
references**. Read the [approval record](openspec/changes/define-products-table/feedback-preview-plan.md#visual-approval-and-reference-promotion--2026-11-16).
All 164 changed-case post-approval comparisons pass in `2026-11-16T20-57-02.794Z`;
their union with the 743 preserved-case evidence covers exactly 907 eligible IDs
at the same source. The earlier icon variance remains recorded. No new staging
or commit follows.

The prior two-batch checkpoint is complete: user commits `382cfcd` and `3853ee6`
match the exact 24/433-file manifests. Root verified it clean before this new
documentation pass. Tasks 10.11–10.12 are complete and staging authority is spent.
That checkpoint had 912 references; preserve the current 928-reference baseline
and the separate pending navigation review.
Never create commits.

Previous assignment — 2026-11-16: the user said **“go ahead”** to preparing two
sequential commit batches. Read the [filters commit-preparation record](openspec/changes/define-products-table/filters-preview-plan.md#commit-preparation--2026-11-16).
Stage only the 24 implementation/specification/test/documentation files first and
provide the user commit command. After the user commits that exact batch, verify
it and stage the 433 approved-reference files as the second batch. Keep all other
work outside the index. This new staging authority supersedes the earlier
no-staging status for these exact batches only. Never create a commit.

Current assignment — 2026-11-16: the user selected **“Products filters and
applied view (Recommended)”**. Execute the [bounded filters preview plan](openspec/changes/define-products-table/filters-preview-plan.md)
and tasks 10.1–10.6 to complete selected PT-010–012 in the simulated table:
archived inclusion, scoped positive recorded stock, Aplicar/Cancelar, removable
applied labels, scoped clearing, per-tab retention and editing/recovery interaction.
PT-042 additionally selects confirmed stock matches plus a clear notice/count of
otherwise-eligible products that could not be assessed; an empty confirmed subset
with unknowns is not a complete empty result. Follow the owning stock semantics
and reuse the existing hidden-validation correction path before extending code.
The exact approved presentation is recorded below. No new dependency/API,
production storage/journal, pagination, search matching or message box redesign.
The [final execution proof](openspec/changes/define-products-table/filters-preview-plan.md#execution-and-verification--2026-11-16)
records 113 code tests, 139 combined browser checks, 440 Products candidates and
451 unchanged-reference comparisons passing at source `3bf12996…`. The user then
said **“I approve them. They looks ok”** for that exact 440-image set. All 440 are
promoted: 80 new, 360 replacements and 472 unrelated references preserved, for
**912 accepted references**. Read the [approval record](openspec/changes/define-products-table/filters-preview-plan.md#visual-approval-and-reference-promotion--2026-11-16).
Post-approval verification now covers all 891 eligible cases at source `9be24237…`:
888 unchanged passing cases plus three normalized phone replacements approved
with **“Approve the three capture-only replacements”**, promoted and verified by
nine repeated comparisons. The capture-only scroll fix, failed initial runs and
partitioned proof are recorded in the plan. The separate 20 navigation revisions
remain unapproved; the message box redesign remains deferred.

The previous two user commits, `b6756f7` and `9849d58`, complete the recovery and
approved-reference batches. Root verified that checkpoint clean before this new
pass; task 9.21 is complete and the staging authority is spent. No staging,
deployment or commit follows for filter work. The later exact image approval
authorizes only the promotion above and verification. Never commit.

Previous visual approval — 2026-11-15: the user said **“That looks better, I accept
the review”** for all 232 images from `2026-11-14T23-55-57.165Z`, source
`88dfe48b…`. Read the [approval and promotion record](openspec/changes/define-products-table/recovery-preview-plan.md#visual-approval-and-reference-promotion--2026-11-15).
All 232 are promoted: 204 new recovery cases and 28 Products replacements; 600
unrelated references were preserved and the then-accepted baseline was 832.
The post-approval comparison passes all 811 expected cases in
`2026-11-15T00-12-39.768Z`, with zero skipped/unexpected/flaky cases (task 9.18).
Earlier 172/200-image pending
proof is historical and superseded for this review. Message box redesign and
the separate 20 navigation revisions remain deferred/unapproved. No staging,
commit or deployment follows. Never commit.

Previous copy review follow-up — 2026-11-15: the user authorized applying the Spanish
copy correction to the simulated previews. Read the [copy revision](openspec/changes/define-products-table/recovery-preview-plan.md#spanish-copy-revision--authorized-2026-11-15).
The contextual copy/compact labels were verified in that historical 200-image
candidate set, with 579 unaffected comparisons passing. The latest 232-image
approval above includes its affected cases. Keep the message box redesign
deferred; that prior proof does not describe the current accepted count.

Current assignment: [Products table design](openspec/changes/define-products-table/proposal.md).
Latest continuation: the user said “go ahead” to defining retry-budget and
browser-persistence details. Read the [technical decision record](openspec/changes/define-products-table/recovery-technical-design.md).
PT-034 selects three attempts total, 15 seconds per attempt and 1/3-second waits
with ±50% jitter; no deliberate overlapping attempts under PT-039's actual
cross-tab capability. The user rejected an IndexedDB-only gate: PT-035 is
preferred storage, and PT-036 requires compatible behavior when it is absent/fails.
PT-037 selects IndexedDB→localStorage→open-app memory fallbacks and a nonblocking retention notice; memory does not promise
reopening recovery. PT-038 selects a new bounded run of up to three requests per
explicit manual retry/continuation after the previous run stops, using the same
original command and PT-034 timing. PT-039 selects coordination when possible:
show another known active run and avoid a second deliberate run; if coordination
is unavailable, recovery stays usable here with an honest limitation notice.
Missing status is not proof no other run exists. No automatic restart or active
run reset. PT-040 rejects a second edit of the same product with a clear error;
the user rejected the independent-drafts proposal and asked to define an explicit
discard/takeover flow that accounts for the original tab being closed. PT-041
allows explicit takeover or confirmed discard/start for an accessible unsent draft
when its owner is unreachable/unknown; the previous editor is read-only on return.
A known active editor still blocks a second edit. No automatic transfer/discard.
Production ownership enforcement and unavailable-coordination editing behavior
remain unselected. The user selected building the bounded simulated preview;
UI changes within that plan are authorized. Dependencies and staging are outside
that scope. Never commit.
The [bounded recovery preview plan](openspec/changes/define-products-table/recovery-preview-plan.md) is now authorized by “Build the simulated preview (Recommended)”. Use synthetic
commands, capability states and virtual ownership; no production mechanism or new
dependency follows. New candidate images require separate approval.
Historical initial recovery checkpoint: read its [execution proof](openspec/changes/define-products-table/recovery-preview-plan.md#execution-and-verification--2026-11-14).
That source `2058ed78…` passed 84 code tests, 124 browser checks, 172 captures
and 607 comparisons. Its earlier pending run `2026-11-14T22-37-09.425Z` and
628-entry baseline were superseded by the 232-image approval/then-832-entry
baseline. The current baseline is 912 under the filters approval above.
No production persistence/locking/API, staging or commit follows.
Latest review: the user requested a more natural Spanish uncertainty message and
explicitly deferred the message box redesign. Read the [review follow-up](openspec/changes/define-products-table/recovery-preview-plan.md#user-review--spanish-wording-and-later-message-box-revision)
and tasks 9.11–9.13. The user rejected nominal “el/este guardado” and selected
“No hemos podido confirmar que los cambios se han guardado.” plus the matching
help sentence. Refer to changes/edits and use guardar verbally in this context;
review compact labels individually. Copy implementation is tracked separately;
retain the deferred message box design. That historical 172-image pending status
is superseded by the latest exact approval above.
Latest assignment: continue save-recovery/draft discovery. The user first asked
for an Inventory operation-identity check, then selected “Bounded automatic
retries + manual fallback (Recommended)” under PT-028. Read the
[source findings and selection](openspec/changes/define-products-table/design.md#inventory-retry-findings-and-selected-recovery-direction--2026-11-14).
Keep the original full command identity/content for retries; this replaces the
earlier unselected read-only-only/no-resend suggestion. PT-029 selects pausing
only affected products while browsing/other editing remain available. PT-030
permits new saves of other editable products during recovery. Command grouping
remains open. Where persistent retention is usable and copies are accessible,
PT-031 restores submitted records in the same browser/business/user with explicit
resumption, and PT-032 restores/discards unsent drafts on request with Products
initially read-only. These do not promise reopening recovery in memory-only mode.
PT-033 reviews only changed current data against an unsent draft's baseline.
No automatic merge/overwrite. PT-034/038 define initial/manual run budgets;
remaining storage policies, command mapping and comparison/concurrency details
remain open; the six functional choices are settled.
Those discovery choices alone did not authorize a prototype; the bounded simulated
preview is now authorized above. Production integration, image promotion and
staging remain outside scope.
Never commit.
The [two-batch checkpoint is complete](openspec/changes/define-products-table/editing-plan.md#completed-checkpoint-and-email-privacy-repair--2026-11-14):
user commits `6636828` and `eb49dea` contain the exact code and reference batches.
The user-run email repair preserved all content; historical ID mapping is linked
there. The 628-entry baseline was that checkpoint. `e583af90…` was the pre-recovery
visual source; the authorized new preview has separate proof in its plan.
Old staging authority is spent and does not apply to these discovery documents.
Latest authority: the user said “That looks ok, I approve all current revision.
What is the next recommended steps”. The exact 156 Products images from
`2026-11-14T12-42-43.360Z` are approved and promoted; see the
[approval record](openspec/changes/define-products-table/editing-plan.md#visual-approval--2026-11-14).
The post-approval panel-overview focus race is fixed in capture setup only;
24 repeated profile comparisons pass without changing any approved image.
Read the approval record before interpreting the initial failed comparison.
That historical baseline had 628 entries; the separately pending 20 navigation revisions
are outside this latest gallery. The subsequent staging scope above adds no
commit authority. Never commit.
The preceding review requested a dismissible Resultado del guardado message. Follow
[PT-027's refinement](openspec/changes/define-products-table/editing-plan.md#review-refinement--dismissible-results-2026-11-14):
close/reopen presentation only; preserve drafts, outcomes and visible uncertainty.
The revised 156-image proof supersedes the earlier 140-image set. Its subsequent
explicit approval above supersedes the earlier pending-image status.
Latest assignment — 2026-11-14: after committing the prepared batch as `b955575`,
the user said “Done, continue with next steps”. Continue the remaining Products
design. The user selected “Name + missing SKU (Recommended)” under PT-022:
name changes plus explicit assignment of an SKU only when none is assigned,
in both selected editors. Existing SKU replacement, barcode maintenance and unit
changes remain outside this first editor; stock stays read-only. Read the
[editing-field decision and next save proposal](openspec/changes/define-products-table/design.md#editing-field-scope--proposal-2026-11-14).
PT-023 selects one Guardar cambios action for edited products with individual
results: only confirmed changes count as saved, and failed/unconfirmed changes
retain their drafts. This does not promise batch atomicity. Do not repeat these
questions. PT-024 requires checking all requested drafts for detectable field
errors before sending any changes, showing errors beside their fields and
blocking submission until corrected. PT-025 guards in-app departure from unsaved
editing with Guardar y salir / Descartar cambios / Seguir editando; saving leaves
only after all requested changes are confirmed. PT-026 selects the existing
Inventory name/SKU profiles for local checks, with exact text preservation and
1024/256 received UTF-8 byte limits. Detailed outcomes/recovery and remaining
draft lifecycle still need definition.
The [editing prototype plan](openspec/changes/define-products-table/editing-plan.md)
makes PT-022–026 concrete in Storybook using synthetic records and simulated
results. Retain its recovery/persistence limits and the distinction between a
review proposal and a production policy. No real writes; future image changes
require fresh approval.
The selected editing preview is implemented and verified: 64 code tests,
97 browser checks, 156 Products captures and 451 unaffected comparisons pass.
The editing plan records source `05c8b186…`, exact runs and review findings/limits.
Its 156 images supersede the earlier Products review set and are now accepted.
The prior 20 navigation revisions remain pending separately.
The preceding [commit preparation](openspec/changes/define-products-table/prototype-plan.md#commit-preparation--2026-11-14)
is complete; it grants no staging authority for new work. This continuation does
not approve future candidate images or undefined editing/save behavior. Never commit.
Latest authority: the user accepted TanStack and instructed continued design with
the latest available exact version. [PT-018–021 and source decisions](openspec/changes/define-products-table/foundation-decision.md)
select `@tanstack/react-table@9.3.1`, compact read-only row summaries plus the full
panel, identifiers/status/hidden catalogue fields and independently requested
multiple expansions, initially collapsed. Registry verification confirms 9.3.1
is current stable and eligible; it is now a runtime dependency. Other grids and
React Virtual remain evaluation-only. Do not reopen these choices.
The [first browsing prototype plan](openspec/changes/define-products-table/prototype-plan.md)
authorizes a TailAdmin/TanStack Storybook design with synthetic data, optional
Products slots in the existing navigation preview and browser/candidate coverage.
Editing/filter flows, production fetching, exact visual-metric approval, image
promotion, staging, commits and deployment do not follow from this design scope.
The first browsing preview is implemented and verified: 54 code tests, 69 browser
checks, 84 new candidate captures and 451 unaffected approved comparisons pass.
Read the prototype plan's exact run/source and limitations before review or
promotion. Candidates are unapproved; the existing 472 references are unchanged.
Earlier comparison authority: the user authorized any tests/comparison needed and requested
the final assessment/recommendation. Follow the bounded
[qualification plan](openspec/changes/define-products-table/qualification-plan.md):
evaluation-only dev dependencies, Storybook adapters and Playwright evidence are
now authorized. Earlier research-only restrictions below are historical for this
evaluation scope. At that checkpoint production grid adoption, product decisions, staging, commits
and reference-image promotion remain unapproved.
The [qualification results](openspec/changes/define-products-table/qualification-results.md)
record 34 executed browser checks, repeated rendering/heap/payload evidence and
the final TanStack recommendation. Tabulator has more supplied features and won
the measured large-fixture scroll/heap comparison; its native ARIA finding
and keyboard integration workaround remain documented. Both grids are dev-only
evaluation dependencies at that checkpoint. The subsequent PT-018 adoption above
supersedes its pre-adoption status. Do not rerun discovery questions already answered.
After committing the navigation fixes as `f365765`, the user authorized the next
table-definition step and requested research into why customers use Excel for
inventory, using the sibling `project_idea.md` and public forums. Read this change's
[research](openspec/changes/define-products-table/research.md),
[design alternatives](openspec/changes/define-products-table/design.md) and
[tasks](openspec/changes/define-products-table/tasks.md). Findings are qualitative
evidence and proposed implications, not approval of unspecified choices or new
customer interviews. The selected starting scenario is browsing/comparing the
catalogue with optional read-only stock, not entering counts. The user selected “Table-first; editing on request
(Recommended)”; PT-001 records that interaction direction, leaving detailed
fields, save/bulk behavior and implementation undefined.
The user does not know the interviewees' main spreadsheet task and asked for
further internet research. Follow-up sources describe stock review, counts and
ordering; these support candidate scenarios, not prevalence or invented customer
facts. Do not repeat that factual question or the selected interaction-model
question. The user selected catalogue plus optional read-only stock context for
one clearly selected location under PT-002. Do not repeat that boundary question.
PT-003 records the user's selected initial columns: Producto, Referencia (SKU),
Unidad and Existencias registradas when stock context is shown. Do not repeat
that column-set question. PT-004 records “Show stock on request (Recommended)”:
catalogue columns initially, with Mostrar existencias revealing the stock column
and location selector. Do not repeat that presentation question. PT-005 records
per-tab visibility/location retention, keeping location while stock is hidden,
sole accessible location automatic, several requiring a choice, and new tabs
catalogue-only. Location stays page-owned; remembering is not current authority.
Do not repeat that retention question. PT-006 records compact rows by default
with a merchant-selected comfortable option and a Storybook comparison before
fixing exact sizes. PT-012 defines retention and PT-013 Vista grouping; exact controls/mobile layout remain open.
PT-007 records one Buscar productos field for partial names and exact SKU/barcodes,
preserving codes and leaving the merchant to choose among matches. Do not repeat
that search-surface question. PT-008 records Enter/Buscar submission, steady rows
while typing and clearing only search while preserving stock/location context.
Do not repeat that trigger question. PT-009 records Producto A–Z initially and
one active ascending/descending sort through Producto/SKU headings, with text SKU
and full-result-set ordering. Do not repeat that sorting question. PT-010 records
Incluir archivados and, with selected-location stock context, Solo con existencias
registradas behind Filtros. Use current domain archived/positive-stock meanings,
including the configured reservation dimension and interface availability limits.
Do not repeat that filter-set question. PT-011 records Aplicar/Cancelar with draft
discard on close, removable applied-filter labels, scoped clearing and clearing
the stock-only filter when stock context is hidden until explicitly selected again.
Do not repeat that interaction question. PT-012 records submitted search, sort,
applied filters and density retained per tab within the same business, new-tab
defaults and discarding unapplied search/filter drafts on leaving. Retain PT-005;
business-edit drafts remain undefined. Do not repeat that retention question.
PT-013 records Vista grouping density/column visibility/order/width, per-tab column
choices, Producto included, stock under Mostrar existencias and a column-only
Restablecer columnas reset. Do not repeat that customization question. PT-014
records product-name activation opening read-only details in a desktop side panel
or a panel filling the phone screen, preserving table settings. Do not repeat that
inspection question. PT-015 records all active stock measurements in one cell,
with exact values, units, main/reservation first and truthful verification/unknown
states under the owning quantity/tracking meaning. Do not repeat that measurement
question. PT-016 records the full phone table with horizontal scrolling, sticky
column header and Producto pinned left, preserving other visibility/order choices
and saved desktop layout. Do not repeat that phone-model question. PT-017 records
Editar in the product panel plus optional Editar tabla, both explicit drafts with
Guardar/Cancelar and read-only stock. Do not repeat that path question.
Current steering: research AG Grid expandable rows, Tabulator 6.x and TanStack
Table, including commercial-use licensing and fit with TailAdmin. The user said
continue. The research addendum verifies both MIT licences and official
expansion/source models. The user did not choose the proposed TanStack-first
candidate; they asked for overall power/platform fit beyond styling. The broader
assessment finds Tabulator supplies more grid operations; TanStack v9 supplies
table/range engines and direct React composition, with more interaction work.
The proposed comparison was subsequently authorized and executed under the
qualification plan; the results above supersede the desk-only recommendation.
Initial source manifests were TanStack React Table 9.3.1 and Tabulator 6.7.1;
the later exact evaluation pins and actual browser/build evidence are recorded
in the results. PT-018 subsequently selects Table as a runtime dependency. The original live
vendor demo was unavailable; the qualification tests our own matched fixtures.
PT-018–021 subsequently select the library and expansion behavior. Evaluation
versions/workloads/probes are recorded in the completed plan/results. Retain PT-014 and PT-017 while exploring
in-row detail and actual family/variant hierarchies as separate concepts.
Editable fields, identifier-operation scope, save outcomes, draft lifecycle,
exact controls, hidden-sort handling, matching, refresh, storage and implementation
remain unselected. Only TanStack Table is promoted to a selected dependency;
continue the bounded browsing design without inventing editing or API semantics.
Stock stays read-only in edit mode.
Preserve existing values, TailAdmin, exact business meanings and user-chosen
depth. No UI implementation, grid library, integration, staging or commit follows
automatically from this research. The prior 20 navigation image updates remain
pending specific approval and do not block this independent discovery step.

Navigation reference: [backoffice navigation discovery](openspec/changes/define-backoffice-navigation/proposal.md).
The user chose “Backoffice navigation and module structure” as the next design
topic. NAV-001 records one shared sidebar grouped by module. NAV-002 records
enabled modules in that sidebar with separate discovery for other available
modules. NAV-003 records Inventory plus shared areas as the first map's design
coverage. NAV-004 records the agreed starting map, including pending movements
within Movimientos. NAV-005 records collapsible module groups with at most one
open, opening the current module on entry and keeping shared entries outside
groups. NAV-006 hides known-inaccessible sections and groups with no accessible
sections, with clear denial for restricted direct links. NAV-007 limits permission
loading/error states to affected navigation/content, with Retry on failure and
unrelated controls usable. NAV-008 records independent location selection on
relevant Inventory pages, with scope visible near the heading. NAV-009 selects a
sole accessible location automatically, otherwise asks for an initial choice, and
remembers explicit page choices while the tab stays open. NAV-010 records the
selected top/middle/bottom layout and drawer closing after destination selection.
The user chose this layout for the first Storybook prototype. Its bounded
[implementation plan](openspec/changes/define-backoffice-navigation/implementation-plan.md)
is implemented and verified for the development-only preview, simulated states
and translations. The design records checks and the exact current 84-candidate
review run. The user approved its 84 images with “I approve all revisions.”;
those exact references are promoted alongside the preserved 388 existing cases.
Preserve the documented preview retention limits and require new approval for
future replacements.
Latest user review requests corrections under NAV-011–013: hide the compact
Inventory caret, show access-check errors once in content with Retry, and use a
compact page frame that leaves space for information-rich tables without shrinking
readable text/controls. The user chose that revision direction. Follow section 4
of the plan. Those corrections are implemented and verified, with 76 revised
candidates initially awaiting review; only the final 84-image run is now promoted.
Table contents, row density and spreadsheet-style editing remain undefined.
The second review refines NAV-011 to match the entire compact Inventory trigger
and icon to neighboring menu controls. Under NAV-014 the user chose one compact
toolbar combining menu, title, location and theme controls, keeping controls
visible at existing sizes. Section 5's preview-only correction is implemented
and verified, including matching compact keyboard state to visible content.
That revision's 76-candidate run and 40 browser checks passed. Production
header behavior remains unchanged; that run is superseded by the final revision.
The third review selects NAV-015–017: a 64px collapsed rail with centred 44px
targets/16px icons, ghost header actions at 36px desktop or 44px tablet/mobile,
and an initially open footer folding under “Más opciones”. Additional steering
under NAV-018 makes Ubicación 36px on desktop while retaining 44px tablet/mobile
targets and 14px text. Section 6 is implemented and verified: 54 code tests,
43 browser checks, 84 current captures and 388 approved comparisons pass. Read
the design's exact current run identities and subsequent 84-image approval.
Do not change production primitives. The user's commit-preparation request and
image approval authorize two staging batches: navigation code/specifications,
then approved visual references. Stage one batch at a time and give the user its
commit command; never execute a commit. Do not archive or deploy automatically.
The full post-approval comparison passes all 472 accepted cases; the navigation
design records the exact run and approval evidence.
Post-commit correction: the user reported the split multi-location phone header,
confirmed that defect and selected “One compact mobile row (Recommended)”.
NAV-019 and plan section 7 govern this preview-only fix: keep menu/title/compact
location/theme on one phone row, use the short translated location prompt,
allow visual ellipsis and preserve 44px touch targets and full dropdown names.
Retain the committed 472-image baseline pending new replacement-image approval.
This new correction does not authorize staging or commits automatically.
NAV-019 is implemented and verified: 54 code tests, 48 browser checks, 84 fresh
captures and 451 unaffected visual comparisons pass. Only 12 phone images changed;
the design links their before/after review and records the pending approval.
Latest feedback further requests a thinner selector and full-row dropdown hover.
NAV-020–021 and plan section 8 govern a 36px visible phone selector with 44px
pointer area, and contiguous full-width 44px option rows using preview-only
props/CSS. Preserve text, native interactions and production select primitives.
Add open/hovered-option capture states; keep all accepted references unchanged
until the new replacements and states receive specific approval.
The refinement is implemented: 54 code tests, 53 browser checks, 92 fresh
captures and 451 unaffected comparisons pass. Only 12 phone replacements and eight new dropdown states need
approval; the other 72 navigation images match accepted hashes. Read the design's
exact current run and review URL before reference acceptance.
Ask before adopting other unresolved choices; preserve production UI and approved
references. The design records sources, choices and limits. Product-creation flows and the
landing remain later work.

Completed brand configuration: [brand basics](openspec/changes/define-brand-basics/proposal.md).
The user said “go ahead” to defining brand basics before customizing TailAdmin.
Discuss the visual emphasis, then concrete colour/typography options and the
minimum identity treatment needed for configuration. The user selected restrained
and approachable: warm neutral backgrounds, clear typography, strong contrast
and limited accent colour. Develop the concrete comparisons in the brand change's
plan using actual TailAdmin components. The user selected D/ink indigo (`#57528C`)
as the colour basis and Source Sans 3 as the typeface basis. The initial identity
uses a simple “Irin” text wordmark in that font, with a bespoke symbol deferred
and the name still provisional. The user also selected retaining TailAdmin's
existing spacing, rounded corners and icons for the first backoffice configuration.
The user approved the concrete first configuration in the brand change's design:
full option-D indigo/warm-neutral mapping, current UI text metrics and a semibold
Irin wordmark at 32px expanded / 20px compact. That backoffice configuration and
the approved `brand-300` (`#B4ACD7`) ordinary dark-text refinement under BRAND-007
are applied and verified. The user approved all 388 images from the final run;
their references are promoted and the full comparison passes. The design records
the exact approval and run identities. Keep the landing unchanged and require
specific image approval for future replacements. Product-flow design remains later.

Completed foundation: the three repository decisions in the
[technical foundation](openspec/changes/establish-frontend-technical-foundation/proposal.md):
module/shared-code organization, landing styling/interaction technology, and
formatting/lint conventions with local quality commands. The user has selected
feature folders with workspace packages following actual reuse by both apps,
Tailwind 4 with native Astro/TypeScript for the landing, and repository-wide
ESLint/Prettier with `pnpm check`. Their implementation and verification are
complete within the agreed repository scope; see the change's design/tasks for
evidence. The brand configuration and its image approval are complete within the
scope recorded above; further work follows the user's next assignment.
The [visual review workflow](openspec/changes/define-visual-review-workflow/proposal.md)
is implemented. Storybook, Astro-native previews and Playwright are selected,
with pinned Chromium on this Mac and the recorded responsive/theme/language
matrix. Follow [visual/README.md](visual/README.md)
for the capture/review/compare workflow and retain the approved colour threshold
0.01 with maxDiffPixels 0. Keep the exact-version esbuild@0.28.2 install-script
denial in the pnpm policy. Never accept references without the user's
specific image approval; a passing capture is not visual acceptance. No product-flow or brand
design follows automatically. Preserve the approved technical foundation
and the scope of its remaining future work. The user selected future backoffice feature folders
in `src/features/<feature>` with routes composing them and generic TailAdmin code
remaining shared. Add workspace packages only for code actually consumed by both
apps; no feature or package scaffold is needed before real consumers exist.
Use `pnpm format` to apply the selected two-space/double-quote/semicolon style and
`pnpm check` for formatting, lint, types and code tests. Run the relevant builds
and browser/visual checks separately; successful code checks do not accept images.
Preserve formatter/linter exclusions for generated files, tools, dependencies,
third-party assets and reference archives. Both apps use the root formatter;
the backoffice retains its Next.js lint rules and Astro has its own lint config.
The completed technical phase focused on this repository's own stack. Hosting/CDN
choices are settled for now; do not initiate further questions about them.
Keycloak/API integration and infrastructure/deployment work remain deferred and
do not gate brand discovery. Preserve the scope correction and selected stack
in the technical change's design and tasks.

Retained UI reference: [product-creation comparison](openspec/changes/explore-product-creation-ui/proposal.md).
Its revised simple/advanced concept is accepted as a design reference; broader
choices and production implementation remain subject to the scope in its proposal.
