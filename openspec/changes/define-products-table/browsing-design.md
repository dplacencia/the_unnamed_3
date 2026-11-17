# Products browsing at catalogue scale

## Authority and starting checkpoint — 2026-11-17

After the navigation checkpoint was committed and verified clean, root proposed
completing Products browsing at realistic catalogue sizes, followed separately by
product creation and spreadsheet migration. The user said:

> go ahead, make sure you check how inventory module handles pagination

This initiates the browsing discovery pass and the read-only Inventory source
check. Record findings and ask about unresolved frontend choices before adopting
them. Product creation/import, API/IAM/hosting work, Inventory changes, production
fetching/storage, new dependencies, staging and commits are outside this pass.
Retain the selected TailAdmin/TanStack foundation and existing table/edit/recovery
decisions. A later bounded preview plan must identify the agreed behavior and
synthetic limits before source edits; no candidate image is accepted automatically.

The preceding user commits `a3363fc` and `3ae4cbd` match the exact nine/21-file
manifests; tree/index were clean before this documentation pass. That staging
authority is spent. Source/build remain `8ac7d6d2…`; all 936 accepted references
remain the baseline. The navigation plan records the completed checkpoint.

## Current preview and the remaining gap

The default [fixture model](../../../apps/backoffice/.storybook/stories/products-table-model.ts)
contains 16 products. The [preview](../../../apps/backoffice/.storybook/stories/products-table-preview.tsx)
filters/sorts the fixture collection and renders every matching row. It already
demonstrates column visibility/order/width, density, search submission, stock
scope, filters, inspection, first editing and simulated recovery feedback.

Catalogue-level loading, retrieval failure and navigation through a larger result
set have not been designed. Current fixture matching/collation is demonstration
logic, not approval of precise production search/sort rules. Existing empty/filter
states must not be confused with a failed retrieval or incomplete assessment.
This pass begins with the browsing model; remaining choices are listed below.

## Inventory source findings — observed 2026-11-17

Read the sibling repository without mutations or runtime/test execution. Governing
source navigation uses published owning specifications, the provenance register
and retained open questions. The inspected Inventory HEAD is
`01c9218b92a4e14ff337c35202bbf6ea23b5d471`; relevant inspected contract/profile/
handler/pagination paths had no reported working-tree changes at inspection.
This is source evidence, not a claim of executed service behavior or deployment.

| Source                                                                                                                                                                                                                                                                                                                                                            | Finding and limit for this frontend pass                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Catalogue collection pages](../../../../the_unnamed_1/openspec/specs/inventory-catalogue-reads-contract/spec.md#requirement-preserve-bounded-catalogue-collection-pages)                                                                                                                                                                                         | A17 collection pages cover families, attributes, attribute values, family allowances and units. Exact product lookups are unpaginated. There is no Products collection in this selection. All five collection branches remain outside the stated current local profile.                                                                      |
| [Opaque continuation](../../../../the_unnamed_1/openspec/specs/inventory-catalogue-reads-contract/spec.md#requirement-preserve-opaque-bidirectional-catalogue-continuation) and [estimates](../../../../the_unnamed_1/openspec/specs/inventory-catalogue-reads-contract/spec.md#requirement-preserve-catalogue-estimates-with-explicit-per-page-exclusion)        | For those existing collections, callers pass either returned Previous/Next token unchanged. Tokens determine continuation, even for a short page. Default size is at most 100; supplied size is 1–1000. These bounds do not select Products page sizes. Totals are estimates with explicit per-request exclusion/presence, not exact counts. |
| [Current-state traversal](../../../../the_unnamed_1/openspec/specs/inventory-catalogue-reads-contract/spec.md#requirement-preserve-current-authorized-catalogue-traversal-without-selecting-internal-order)                                                                                                                                                       | Every page checks current state/authority. Unchanged data and authority preserve coherent traversal; changed data can change later/backward pages. No frozen cross-page snapshot, stable page number, direct page-number jump or public comparator is supplied.                                                                              |
| [Search pagination boundary](../../../../the_unnamed_1/openspec/specs/inventory-product-search-contract/spec.md#requirement-scope-protection-and-existing-pagination-remain-bounded) and [unselected design](../../../../the_unnamed_1/openspec/specs/inventory-product-search-contract/spec.md#requirement-retained-dependencies-do-not-select-undefined-design) | Existing catalogue/stock paging expressly defines no future search pagination, cursor, sorting, limit or snapshot policy. Products search must not silently inherit these guarantees, fields or bounds.                                                                                                                                      |
| [Stock collections](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads-contract/spec.md#requirement-stock-collections-contain-recorded-rows-only)                                                                                                                                                                                            | Stock collection paging describes recorded stock rows, not a complete merchant catalogue. Products with no stock record cannot be discovered by treating an all-products stock selection as the Products list.                                                                                                                               |
| [Current profile](../../../../the_unnamed_1/inventory/contract/src/profile.rs) and [product handler](../../../../the_unnamed_1/inventory/application/src/operations/product.rs)                                                                                                                                                                                   | The inspected A17 implementation validates an exact permanent-product-ID read and calls `read_product`. Supporting collections and SKU/barcode branches are excluded by the current profile. No paginated product-list or broader-search handler was found in the inspected contract/profile/product path.                                   |
| [Wire schema](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto)                                                                                                                                                                                                                                                                    | `PageRequest` carries optional size, continuation token and estimate opt-out; `PageInfo` carries optional previous/next tokens and estimated records. `CatalogueSelector` has exact product and five supporting collections, not a Products-list branch. Shape availability does not make unsupported branches callable.                     |
| [Pending discovery implementation](../../../../the_unnamed_1/inventory/persistence/src/inspection.rs) and [token implementation](../../../../the_unnamed_1/inventory/persistence/src/inspection/token.rs)                                                                                                                                                         | The inspected Pending discovery code has its own forward/backward cursor handling, scoped opaque tokens, current read transaction and optional count work. It is implementation context for a different operation, not an approved Products paging adapter or token format to reproduce in the browser.                                      |

Root and an independent read-only source audit agree on the key boundary: there
is no existing Products search-pagination contract to bind this frontend to.
Broader search's [business requirements](../../../../the_unnamed_1/openspec/specs/inventory-product-search/spec.md#requirement-full-search-requirements-do-not-expand-current-interfaces)
retain their availability and undefined-design limits. No backend change or
workaround is initiated by documenting this gap.

## First browsing choice — selected 2026-11-17

**Recommended: compact Anterior / Siguiente controls replacing the visible rows.**
This keeps the working table bounded and provides explicit navigation without
requiring numbered-page or exact-total promises. Existing Inventory continuation
patterns are useful context, not inherited Products guarantees. The future
Products request/result contract remains separate and undefined.

**Alternative: Cargar más appends another group of rows.** This keeps previously
loaded rows available for comparison but grows the working list and introduces
additional questions about scrolling, refreshed data and retained editing.

**Numbered pages/random jumps** would require support not established by the
inspected sources. Do not present “page 3 of 50” or fabricate an exact last page
from an estimate. A local navigation position is not a stable server page identity.

The user answered **“Anterior / Siguiente (Recommended)”** to the question
contrasting controls that replace the visible rows with Cargar más appending
them. **PT-044 selects Anterior/Siguiente and replacement of the visible rows**
for the simulated Products browsing design. Do not repeat this choice or add
append/automatic infinite scrolling as the selected model.

This selects the frontend experience only. Products' backend pagination contract,
page size, total-count request policy, loading/reset/retention behavior and
implementation mechanism remain separate. Existing draft/recovery safeguards
are not waived by selecting directional navigation.

## Page-size choice — selected 2026-11-17

Recommend **50 products per page initially, with 25/50/100 available to choose**.
The alternative is 100 initially with the same options. These are proposed
starting points for the synthetic preview, not measured performance claims or
Products API bounds inherited from the supporting-collection contract.
The user answered **“50 by default; 25/50/100 options (Recommended)”**.
**PT-045 selects 50 products per page by default and choices of 25, 50 and 100**
for the first simulated Products preview. This adopts neither Inventory's
supporting-collection bounds nor a future Products API limit or performance claim.
PT-046 below subsequently selects page-size retention and the size-change reset.

## Page-size retention and change — selected 2026-11-17

Recommend remembering the explicit page-size choice in the current tab for the
same business, alongside the agreed applied view. A new tab starts at 50. When
the merchant changes page size, recommend starting at the first result group
while preserving submitted search, sorting, applied filters and stock/location
settings. Existing draft/recovery safeguards remain applicable; their concrete
cross-page interaction is still open.

The alternative is not retaining page size when returning to Products, using
50 again. Retention of the current navigation position on return is a separate
question: remembering page size does not by itself retain a page/token/scroll
position.

The user answered **“Remember per tab; restart when size changes (Recommended)”**.
**PT-046 selects remembering page size per tab for the same business**, with a
new tab starting at 50. Changing page size starts at the first result group and
preserves submitted search, sorting, applied filters and stock/location settings.
This selects neither the current page/token/scroll position on return nor a
storage engine. Existing draft/validation/recovery decisions retain their scope;
the concrete cross-page editing flow and loading presentation are still open.

## Result counts — selected 2026-11-17

Recommend showing the exact number of products currently displayed, with a
clearly labelled estimated total only when the data source supplies one for the
relevant matching/authorized selection. If no total is supplied, show the visible
count without fabricating a global count. The alternative is showing the visible
count only, even when an estimate is supplied.

The user answered **“Displayed count + supplied, labelled estimate (Recommended)”**.
**PT-047 selects the exact displayed-product count and an explicitly labelled
estimated total when the data source supplies one for the relevant selection**.
Without a supplied total, show only the displayed-product count.

This is frontend presentation, not adoption of a Products count API
or an estimate-request policy. It does not infer completeness, last-page status,
page numbers, stock quantity or a global unknown-stock count from loaded rows.
PT-042's incomplete-results meaning remains applicable. Exact copy/layout and
the remaining count-scope details still need subsequent review.

## Editing across pages — selected 2026-11-17

Recommend retaining table-edit drafts while moving between Products result groups,
with the existing Guardar cambios action covering all edited products, including
those outside the displayed group. Keep an obvious way to locate off-page edits
and validation errors. Leaving Products still follows the existing save/discard/
continue guard. The alternative is asking to save or discard before each page
change.

The user answered **“Keep drafts across pages; save together (Recommended)”**.
**PT-048 selects retaining table-edit drafts across result groups and one
Guardar cambios action covering all edited products, including off-page ones**.
Provide a clear way to find off-page edits and validation errors; leaving Products
keeps the existing save/discard/continue guard. Do not require resolving every
draft merely to move to another page within the table editor.

The proposal preserves the all-draft local validation gate, individual confirmed
outcomes, original-command recovery and affected-product protection. It does not
define a new backend batch, automatic save, production draft persistence or
request coordination. Exact behavior during an in-flight load/save remains open.

## Page loading and retrieval failure — selected 2026-11-17

Recommend a neutral first-load state. For later result-group requests, keep the
previously loaded results visible with a clear previous-results/loading state,
replacing them only after the requested result is successfully available. On a
technical retrieval failure, show an inline error with Retry and retain the previous results
when available. Neither failure nor an unfinished request is an empty success.

The alternative is hiding previous rows behind a loading placeholder for every
load. The user answered **“Keep marked previous results while loading
(Recommended)”**. **PT-049 selects the neutral first load, marked previous results
on later page loads, replacement only on success, and inline technical-read error
with Retry while retaining previous results when available**.

These presentation choices define neither a Products API nor an automatic read
retry budget or save/recovery policy. Previously loaded rows must retain their
own known scope and must not masquerade as a successful response for a newly
requested group or selection. Busy controls, changed-selection reset and late
responses remain details to define within the selected behavior.

## Result-set changes versus layout changes — selected 2026-11-17

Recommend starting at the first result group when a submitted/cleared search,
sorting or applied filter changes. Keep the selected page size and product drafts.
Changing column visibility/order/width or density would keep the current result
group, because those controls change presentation rather than the matching set.
Draft-only search/filter changes do not submit a new request under the existing
submission rules.

The alternative was reviewing reset behavior individually for each control.
The user answered **“Use shared reset policy (Recommended)”**. **PT-050 selects
first-group restart for submitted-search, sort and applied-filter changes,
retaining page size and product drafts; column-only layout and density changes
retain the current group**. Existing search/filter drafts do not submit new
constraints merely through typing or unconfirmed changes.

Location/stock-context changes, return/refresh position, unusable continuation,
busy controls and late responses remain separate. No future Products request or
cursor construction is inferred; exact matching/sort semantics remain open.

## Stock-location changes — selected 2026-11-17

With stock shown, recommend retaining the current result-group position when
location changes without the stock-only filter. If Solo con existencias
registradas is active, restart at the first group because matching products can
change. Retain page size, product drafts and the other applied settings.
Hiding stock when it clears that active filter follows the applied-filter reset.
The alternative is restarting at the first group for every location change.

The user answered **“Keep position when not stock-filtered (Recommended)”**.
**PT-051 selects retaining browsing position on a location change without the
stock-only filter, and first-group restart when that filter is active**. Hiding
stock when it clears the active stock-only filter also restarts. Retain page size,
drafts and other applied settings.

Retaining browsing position does not promise frozen product membership,
reusable backend cursors across selections
or a catalogue-search API. Quantities from a previous location must not be
relabelled as newly retrieved stock for the chosen location; exact loading/scope
presentation remains to review.

## Return, refresh and unusable browsing position — selected 2026-11-17

Recommend remembering the last browsing position within the same tab/business
and requesting fresh data for it on return to Products or tab refresh. Keep the
applied view and page size; existing explicit draft/recovery restoration remains
unchanged. This would retain navigation context without treating cached results
as an authoritative current read or promising an unchanged group membership.

If the saved position is reported as unusable, recommend an explanation and
Volver al inicio action; start fresh only on that explicit request, preserving
view settings and drafts. Technical read failure and known access denial retain
their own meanings rather than becoming an assumed unusable position.
The alternative is always starting at the first group on return or refresh.

The user answered **“Restore position with a fresh read (Recommended)”**.
**PT-052 selects same-tab/business last-result-group restoration with a fresh
read on return or refresh, plus an explanation and explicit Volver al inicio
when that position is reported unusable**. Keep applied view, page size and
existing draft/recovery restoration rules; do not silently restart on a reported
unusable position.

No backend position format, token lifetime, API, new storage engine or automatic command
recovery is selected. PT-046/050/051's intentional resets retain their scope.

## Next phase — bounded preview selected

The [prepared preview plan](browsing-preview-plan.md) would make PT-044–052
reviewable with the shared Products table, 1,000 synthetic products and a separate
10,000-record bounded-rendering check. It proposes reusing current matching/sort
logic as demonstration only, leaving precise production semantics and API support
for later selection. It also explicitly proposes selective paging-control busy
behavior and latest-view response protection; those additions are not adopted yet.

The user selected **“Build the prepared simulated preview (Recommended)”**.
Execute that file-bounded plan, including its 1,000/10,000 fixtures, demo-only
matching/sort, selective paging-control busy behavior and latest-view protection.
PT-053 records the preview read-control policy. Precise production matching/sort
and remaining production coordination stay deferred; task 12.4 is not complete.
Exact visuals require review; no reference promotion, staging or commit follows.

## Remaining choices and preserved boundaries

- Retain PT-047's separation of the displayed-product count from a supplied,
  explicitly labelled estimate. Define remaining count scope/refresh details
  without inventing precision or silently rounding. Missing totals, zero
  estimates and incomplete results differ.
- Apply PT-049/052's loading, technical-failure and explicit-restart presentation.
  Define the remaining busy/response
  behavior. A failed read is not empty success; previous data must not masquerade
  as a freshly confirmed response. Exact controls/copy remain review proposals.
- Apply PT-050–052's result-set, layout, stock-context and return/refresh rules,
  preserving the agreed per-tab view and unsent-draft/recovery behavior.
- Retain full-result sorting under PT-009; sorting only a loaded subset is not
  equivalent. Precise name matching/case/accent/token/collation and deterministic
  ties still need selection; existing name/SKU/code identity rules stay intact.
- Preserve PT-042's distinction between confirmed stock matches and unassessed
  candidates. A count observed on one loaded page cannot be presented as the
  unknown count for the entire matching catalogue without supporting evidence.
- Apply PT-048's cross-page table drafts and global save action while keeping
  affected products read-only during unresolved saves. Preserve field-error
  access, departure guards and outcomes; exact controls and in-flight load/save
  interaction must be reviewed before implementing them.
- Agree fixture volume, page-size controls and useful keyboard/phone scenarios
  before the bounded Storybook work. No virtualizer, new dependency or performance
  target follows automatically from the collection page-size bounds.

## Discovery verification

Check OpenSpec, formatting, links and documentation-only changes. Preserve app/
fixture/test/inventory source and all 936 accepted PNGs/registry. No service,
database, Inventory test, browser capture or reference-promotion run is needed
for this source-inspection/discovery step. Its checks do not claim runtime
pagination, performance or final design approval.

The discovery closeout passes repository formatting, strict validation of all
seven OpenSpec changes, 158 local file/heading links across seven changed/new
Markdown documents and `git diff --check`. Independent source/meaning review
found no material issue. An initial check found two same-repository source-link
paths one directory too high; both were corrected and all links rechecked.
All eight changed files are documentation/configuration. Source/build remain
`8ac7d6d2…`, the 936-reference aggregate remains `63d3e9bb…`, and the index is
empty. Proof is retained in `.cache/products-browsing-discovery-proof.json` and
`.cache/products-browsing-discovery-links.json`. At that discovery checkpoint the
browsing-model answer was pending; PT-044 above subsequently records its selection.
No UI or Inventory source was changed.

## Current selected-decision verification

Before execution, PT-044–052 and the prepared plan passed repository formatting, strict validation of
all seven changes, 164 local links across nine changed/new Markdown files,
independent scope review and `git diff --check`. The ten changed files were
documentation/configuration only. Source/build were `8ac7d6d2…`; all 936 accepted
references were unchanged and the index was empty. Historical proof is retained in
`.cache/products-browsing-current-selection-proof.json` and
`.cache/products-browsing-selection-links.json`. The remaining listed browsing
choices retain their stated scope. The subsequent bounded preview is now
authorized above; its execution/verification belongs in the preview plan.

## Current-page indicator — selected 2026-11-17

The user observed that Anterior/Siguiente and an estimated total did not reveal
which page was displayed. They selected **“Between Anterior and Siguiente
(Recommended)”** from a question proposing Página X, success-only advancement,
retention during a read error and a separately shown estimated total. PT-054 and
the [bounded revision](browsing-preview-plan.md#current-page-indicator-revision--2026-11-17)
record this direction. A source-known current group number does not supply an
exact total number of pages or promise stable production page numbers on refresh.
The previous 148-image proposal is not approved; updated images require review.
