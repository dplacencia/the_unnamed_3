# Define the merchant Products table

## Why

The user committed the navigation corrections as `f365765` and authorized the
next proposed step: define the Productos table's information, density,
search/filtering, customization and mobile behavior before prototyping it.
They specifically requested reading the sibling product thesis and researching
forums to understand why people prefer Excel for inventory. The target is a
simple, powerful product table that preserves useful familiar work, without
building another general-purpose spreadsheet.

## What Changes

- Read the reported workflows and current frontend values, separating customer
  observations, hypotheses, approved constraints and available functionality.
- Record public forum evidence, primary usability research and limitations in
  [research.md](research.md).
- Develop table alternatives and a recommended direction in [design.md](design.md).
- Agree the primary merchant task before choosing columns, editing semantics,
  row density, customization, selection and mobile presentation.
- Keep production implementation and accepted visual references unchanged;
  the initial discovery phase itself was documentation-only.
- After the user's delegated evaluation authorization, execute only the
  development-only [grid qualification plan](qualification-plan.md), retaining
  production source and accepted references while comparing both candidates.
- After the user's acceptance, register TanStack Table 9.3.1 as the exact selected
  runtime dependency and develop the [first browsing design](prototype-plan.md)
  with the selected summary/panel/content/independent-expansion behavior.
- Following PT-022–026, develop the [first editing prototype](editing-plan.md)
  in Storybook with synthetic drafts/results and the selected validation and
  departure rules. Keep recovery, production integration and image acceptance separate.

## Capabilities

### New Capabilities

- `products-table`: the selected table-first interaction direction, with editing
  deliberately activated, faster tools available on request and optional
  read-only stock context for one clearly selected location. The selected initial
  columns are Producto, Referencia (SKU), Unidad and, when stock context is shown,
  Existencias registradas. Catalogue columns appear by default; Mostrar existencias
  reveals stock context and its location selector. Products remembers visibility
  and location per tab, using the agreed sole-location/multiple-location rules;
  a new tab starts catalogue-only. Density is compact by default, with an optional
  comfortable setting and exact row sizes to compare in Storybook. One Buscar
  productos field supports partial-name discovery and exact SKU/barcode lookup,
  preserving codes and leaving the choice among matches to the merchant. Searches
  run through Enter or Buscar; clearing removes only the search constraint and
  preserves stock/location context. Initial sorting is Producto A–Z, with one
  active ascending/descending sort through Producto or SKU headings, applied to
  the full matching result set and keeping SKU as text. Filtros offers optional
  archived inclusion and positive recorded-stock filtering with selected-location
  stock context, using existing Inventory meanings. Filters use Aplicar/Cancelar,
  removable applied labels and scoped clearing; hiding stock clears its stock-only
  filter until explicitly selected again. Submitted search, sort, applied filters
  and density are retained per tab within the same business; new tabs use defaults
  and leaving discards unsubmitted view drafts. Vista groups density and optional
  column visibility/order/width controls, with per-tab choices and a scoped
  Restablecer columnas action. Producto stays included and stock visibility keeps
  its existing toggle. Product-name activation opens read-only details in a
  desktop side panel or a panel filling the phone screen, preserving table
  settings on close. Stock cells show all active tracked measurements with units,
  main/reservation first, preserving exact values, verification needs and unknowns.
  Phones retain the selected table with horizontal scrolling, a sticky column
  header and Producto pinned left, preserving saved desktop choices. Detailed
  controls/content, matching/order, quantity formatting and storage remain open.
  Editing has two deliberate draft paths: Editar in the product panel and optional
  Editar tabla, with Guardar/Cancelar and read-only stock. The first editor allows
  name changes and explicit SKU assignment only when unassigned. Existing SKU
  replacement, barcode maintenance and unit changes are outside that first scope.
  Table drafts use one Guardar cambios action with individual product results;
  only confirmed changes count as saved and failed/unconfirmed changes retain
  drafts. No batch atomicity is promised. All requested drafts are checked for
  detectable field errors before any changes are sent; errors appear beside
  fields and block submission until corrected. In-app departure with unsaved
  edits offers Guardar y salir, Descartar cambios and Seguir editando, leaving
  after save only when all requested changes are confirmed. Local checks reuse
  Inventory's existing name/SKU profiles and preserve exact text and received-byte
  limits. Detailed outcome recovery, remaining draft lifecycle and implementation
  remain open.

### Modified Capabilities

None. Existing navigation and Inventory rules remain unchanged. The new delta
records the selected table interaction, columns, stock presentation and per-tab
scope, density, search field, submission/clearing, initial sorting and optional
filter set/application/clearing, applied-view retention, column customization and
read-only product inspection, active stock-measurement presentation and phone
table model and editing entry points/draft boundaries.

## Impact

The initial discovery affected documentation and agent/context pointers only. Existing
TailAdmin branding, source, dependencies, landing and screenshot references stay
unchanged. No grid library, backend/API integration, persistence, production
screen, spreadsheet engine, stock-changing action, staging, commit or archive
is introduced. The preceding navigation revision still has 20 image changes/new
states awaiting separate specific approval; this research does not accept them.

The later comparison authorization permits evaluation-only backoffice dev
dependencies, Storybook fixtures and browser/build tests under the linked plan.
This supersedes the research-only limit for that scope, without selecting a
production grid, expansion behavior, fields, business writes or image references.

## Authority and status

On 2026-11-13, after the assistant proposed defining the Products table in
OpenSpec and then prototyping it in Storybook, the user said:

> Commited. Go ahead with the next proposed step. Note that has this document
> mentions (/Users/daniel/Projects/personal/the_unnamed_1/project_idea.md) some
> inteviewed customers use Excel to keep track of their inventory. Think about
> it, research in internet foros, etc. We got to build a product table as simple
> and powerful as excel but without building another Excel, try to discover why
> a human been would prefer excel and base the design on that.

This initiates research and definition under the standing instruction to ask
before adopting undefined choices. It does not approve a column set, editable
fields, bulk mutation semantics, a third-party library or implementation.
The report is a qualitative desk study, not new customer interviews or validated
market demand. Table details remain proposals except for the selected decisions
recorded below.

The approved [scope](../establish-frontend-foundation/specs/frontend-scope/spec.md),
[values](../establish-frontend-foundation/specs/product-values/spec.md) and
[navigation reference](../define-backoffice-navigation/proposal.md) constrain the
discussion. Asked about the interviewees' most frequent spreadsheet task, the
user answered **“I dont know, try to find some info in internet”**. Continue with
public workflow evidence; do not require knowledge they do not have. Their actual
routine remains unknown and proposed first scenarios must be labeled hypotheses.

The user then selected **“Table-first; editing on request (Recommended)”** for
the concrete interaction-model question. PT-001 records a table for browsing
and comparison, editing deliberately activated, and faster tools available on
request. This selects direction A; it does not choose columns, save or bulk
semantics, editing controls, permissions, persistence or implementation.

The user subsequently chose **“Catalogue + optional stock context (Recommended)”**.
PT-002 records optional read-only recorded stock for one clearly selected
location alongside the catalogue. The presented question expressly left exact
columns and default visibility for the next decision. This does not define
location defaults/retention, editing stock, aggregation or implementation.

The user then answered **“Use this initial column set (Recommended)”** to the
proposal of Producto, Referencia (SKU), Unidad and Existencias registradas when
stock context is shown. PT-003 records that set. The question explicitly left
initial stock visibility, additional optional columns and editing behavior for
separate decisions; no UI implementation follows from this approval.

The user subsequently chose **“Show stock on request (Recommended)”** for
catalogue columns initially, with a labelled Mostrar existencias toggle revealing
the stock column and location selector. PT-004 records that presentation. The
question explicitly left remembering the choice for a separate decision. Precise
location behavior and UI implementation also remain open.

The user then chose **“Remember per tab (Recommended)”** for remembering Products
stock visibility and location while the tab stays open, selecting the sole
accessible location automatically, asking with several before quantities, keeping
the location when stock is hidden and starting a new tab catalogue-only. PT-005
records that choice under the existing page-owned scope principles. Storage
mechanism, further table behavior and UI implementation are not selected.

The user subsequently chose **“Compact default + comfortable option
(Recommended)”** for compact rows by default with an optional comfortable setting,
preserving readable text and touch targets and comparing both in Storybook before
fixing exact row heights. PT-006 records that direction. Density-control placement,
retention, mobile layout, exact measurements and implementation remain open.

The user then chose **“One search field (Recommended)”** for a single Buscar
productos field supporting partial names and exact SKU/barcodes, preserving
leading zeros and presenting matching products without automatically choosing one.
PT-007 records that surface and lookup intent. The presented question expressly
left detailed matching and sorting for separate decisions. Search triggers,
filters, retention and implementation are also unselected.

The user subsequently chose **“Enter or Buscar (Recommended)”** to explicitly
submit searches while rows stay steady during typing. The question also proposed
that clearing search removes only its constraint and preserves stock/location
settings. PT-008 records that trigger and clearing scope. It does not select
detailed matching, ordering, result/error presentation or integration.

The user then chose **“Single-column sorting (Recommended)”** for Producto A–Z
initially, one active sort toggled through Producto or Referencia (SKU), keeping
SKU as text and sorting the full matching result set. PT-009 records that choice.
The question left unit/stock sorting separate. Multi-column ordering, detailed
collation, tie-breaking, retention and implementation are also unselected.

The user subsequently chose **“Use these initial filters (Recommended)”** for
Filtros offering Incluir archivados and, when stock is shown for a selected
location, Solo con existencias registradas. The question defined stock-only as
positive recorded stock under existing Inventory quantity rules and default
active results including zero/no-record products. PT-010 records this set and
meaning. Application/reset mechanics, retention, detailed quantity presentation
and implementation remain separate decisions.

The user then chose **“Aplicar/Cancelar (Recommended)”** for the filter panel,
discarding drafts on close without applying, showing removable applied-filter
labels, preserving search/sort/stock-location settings when clearing filters and
clearing the stock-only filter when stock is hidden until explicitly selected
again. PT-011 records this interaction. Placement, styling, retention and
implementation remain open.

The user subsequently chose **“Remember applied view per tab (Recommended)”**
for retaining submitted search, sort, applied filters and density in the same
tab/business, restoring them on return, using defaults in new tabs and discarding
unsubmitted search/filter drafts when leaving Products. PT-012 records this
extension without reopening PT-005 stock/location retention. Business-edit draft
policy, refresh, scroll/pagination position, storage and implementation remain open.

The user then chose **“Vista with visibility/order/width (Recommended)”** for
grouping density and column visibility/order/width in Vista, remembering column
choices per tab, keeping Producto included, preserving stock visibility under
Mostrar existencias and the agreed initial columns, and offering Restablecer
columnas. PT-013 records this scope and column-only reset. Exact interactions,
measurements, hidden-sort behavior, mobile adaptation and implementation remain open.

The user subsequently chose **“Details panel (Recommended)”** for activating a
product's name to open read-only details in a desktop side panel and a panel
filling the phone screen, preserving table settings. The question explicitly
kept editing as a separate action, with fields and save behavior to follow.
PT-014 records that inspection flow. Detail contents, panel dimensions/modality,
tablet behavior, dismissal/focus/history, scroll, refresh and implementation remain open.

The user then chose **“All tracked measurements (Recommended)”** for showing all
active stock measurements in the same cell with units, configured main measurement
first, exact values, visible verification needs and unknowns kept unknown. PT-015
records that choice under existing quantity/tracking meanings. Exact numeric
formatting, status/missing/error rendering, widths/wrapping and implementation
remain open.

The user subsequently chose **“Full table + pinned Producto (Recommended)”** for
the phone table: horizontal scrolling, sticky header and Producto pinned left,
other columns retaining visibility/order and Producto's saved desktop position
kept intact. PT-016 records that responsive model. Exact widths/caps, breakpoints,
touch/keyboard controls, desktop/tablet scrolling and implementation remain open.

The user then chose **“Panel + optional table editing (Recommended)”** for Editar
in the product panel and optional Editar tabla for repeated catalogue changes,
both beginning as drafts with Guardar/Cancelar while stock remains read-only.
PT-017 records those paths. Fields, permissions, multi-row save/failure semantics,
validation, concurrent/unsaved drafts and implementation remain unselected.

The user subsequently requested examining AG Grid's expandable-row concepts,
then Tabulator's 6.x examples and TanStack as potential commercially usable
open-source foundations, followed by **“continue”**. This authorizes reference
and licence research within this discovery. It does not select a library/version,
replace the selected details panel, choose an expansion model or initiate UI
implementation. Preserve PT-014 and PT-017 while evaluating the alternatives.

The completed [grid reference/licence review](research.md#grid-libraries-and-row-expansion--2026-11-13)
verified MIT commercial-use permissions for TanStack Table and Tabulator and
distinguished AG Grid Community licensing from its Enterprise Master/Detail
feature. The initial TanStack-first recommendation remained unselected. In
response to the candidate question, the user asked which is more powerful for
Irin considering all features and platform fit beyond styling.

The [broader assessment](research.md#full-feature-and-platform-fit-assessment--2026-11-13)
finds Tabulator supplies more ready-made grid operations, while TanStack offers
more direct React composition but leaves more interaction/integration work to
the application. Current TanStack v9 includes cell/range selection; its keyboard
binding, clipboard serialization and any needed virtualizer are separate work.
The updated recommendation is a bounded comparison of both against identical
Irin cases before adoption. Neither the recommendation, either candidate,
installation scope nor expansion behavior has been selected. The review records
source versions, peer-range evidence and unavailable live-demo checks rather
than claiming runtime compatibility, performance or measured integration cost.

The user then said: **“Go ahead and do any test or comparison you want to do,
and come back to me with the final assessment and recommendation”.** This
delegates the evaluation details in the [qualification plan](qualification-plan.md).
It authorizes concrete comparison work and a final recommendation, without
adopting either library into production or resolving product-flow decisions.

The executed [qualification](qualification-results.md) compares matched
development fixtures, 34 browser checks, repeated rendering/heap measurements
and vendor payloads. The final recommendation is TanStack Table for Irin's
React/business-workflow composition, while recording Tabulator's broader supplied
features and better measured large-fixture scroll/heap results with similar mount cost. Both are
evaluation-only dev dependencies. Accessibility findings and remaining limits
are explicit in the results; no production adoption or new product design follows.

The user subsequently accepted TanStack and instructed continued design with the
latest available pinned version. [The foundation decision](foundation-decision.md)
records the exact instruction, live registry check and move of 9.3.1 to runtime
dependencies under PT-018. PT-019–021 record the user's compact-summary/full-panel,
summary-content and independent-multiple-expansion selections. The bounded
browsing design is authorized in Storybook; editable fields, filter-interface
design, production fetching, save semantics and visual acceptance remain separate.

On 2026-11-14, the user reviewed the preview and said **“That is looking good,
prepare the commit before moving to the next steps”**. This authorizes the
[bounded commit preparation](prototype-plan.md#commit-preparation--2026-11-14):
stage the research, qualification and browsing-prototype batch and return a
commit command for the user. It does not authorize creating a commit, promoting
candidate images or beginning the next design pass.

The user then said **“Done, continue with next steps”**. Commit `b955575` is
present and the working tree was clean at the start of this continuation.
Continue the remaining Products-table definition, starting with the
[editing-field proposal](design.md#editing-field-scope--proposal-2026-11-14)
left open under PT-017. This continuation does not select its proposed fields,
identifier operations, save outcomes or new image references. The prior staging
authorization is complete; further staging and commits are not implied.

The user subsequently chose **“Name + missing SKU (Recommended)”**. PT-022
selects product-name changes plus explicit SKU assignment only for products
without one, through both selected editing paths. Existing SKU replacement,
barcode maintenance and unit changes remain outside this first editor; stock
stays read-only. This selects the initial field/action scope, not validation,
save outcomes, production write availability or implementation.

The user then selected **“Save together, show individual results (Recommended)”**.
PT-023 records one Guardar cambios action for edited products and per-product
results, counting only confirmed changes as saved and retaining failed or
unconfirmed drafts. It does not promise all-or-nothing multi-product saving.
Validation before submission, detailed mixed/uncertain outcomes, retry,
concurrency and draft lifecycle remain separate decisions. Read the
[selected save interaction](design.md#table-save-interaction--proposal-2026-11-14).

The user subsequently chose **“Correct all field errors before saving
(Recommended)”**. PT-024 records the local validation gate for all requested
drafts, with errors beside fields and no submission until detectable errors are
corrected. This does not guarantee acceptance or define new field-validity rules.

The user then selected **“Ask before leaving unsaved edits (Recommended)”**.
PT-025 records the in-app navigation guard with Guardar y salir, Descartar cambios
and Seguir editando. Saving leaves only after every requested change is confirmed
saved. Browser closing/reload, persistence and remaining draft coordination are
not selected by this choice. Read the
[validation and navigation decisions](design.md#selected-validation-gate--2026-11-14).

The user subsequently chose **“Reuse existing profiles (Recommended)”**.
PT-026 selects Inventory's existing supplied-name and supplied-SKU profiles for
the first editing prototype's local checks, including exact preservation,
nonblank/prohibited-text rules and limits of 1024/256 received UTF-8 bytes.
This frontend design selection does not establish a name-update interface or
modify the owning contract. Detailed outcome recovery and production integration
remain separate from the bounded Storybook editing design.

The [first editing prototype](editing-plan.md#execution-and-verification--2026-11-14)
is now implemented and verified within that Storybook scope: 64 code tests,
93 browser checks, 140 candidate captures and 451 unaffected reference
comparisons pass. The plan records exact source/renderer/run evidence and
resolved review findings. Production writes/storage, detailed recovery and
specific image acceptance remain separate. Nothing is staged or committed.

Subsequent review requests a dismissible Resultado del guardado message. PT-027
and the [editing refinement](editing-plan.md#review-refinement--dismissible-results-2026-11-14)
govern that presentation-only revision; drafts/outcomes and prior recovery limits
remain intact. Positive review wording does not promote screenshots.

The dismissible presentation is implemented and verified: 64 code tests,
97 browser checks, 156 current Products captures and 451 unaffected accepted
comparisons pass. The refinement section records current source and exact runs.
The 156-image set supersedes the previous Products candidates and remains
unapproved; accepted references and the empty index are preserved.

The user subsequently said **“That looks ok, I approve all current revision. What
is the next recommended steps”** after receiving the current 156-image gallery.
The [visual approval record](editing-plan.md#visual-approval--2026-11-14) records
promotion of those exact Products images (628 accepted references in total),
preserving the earlier 472 entries. The separately pending 20 navigation images
are outside that gallery. Staging/commits and new product decisions remain separate.

The user then said **“go ahead”** to the recommended two-batch commit checkpoint.
The [current preparation](editing-plan.md#commit-preparation--2026-11-14)
authorizes staging code/specifications first and approved images after the user
commits the first batch. Only the user executes commits. This does not begin the
proposed save-recovery or filter design.

The user completed both batches and the user-run email-privacy history repair.
The [checkpoint completion](editing-plan.md#completed-checkpoint-and-email-privacy-repair--2026-11-14)
records the original/current commit mapping, unchanged content and verified push.
Current `main` is `eb49dea`; 628 accepted image references remain intact.

The latest **“go ahead”** continues save-recovery and draft-handling discovery.
The [initial verification proposal](design.md#unconfirmed-save-verification--proposal-2026-11-14)
was not selected: the user first requested checking Inventory's operation identity
and retry behavior. The [source findings and subsequent choice](design.md#inventory-retry-findings-and-selected-recovery-direction--2026-11-14)
record the supported unchanged-retry guarantee and the user's selection of
**“Bounded automatic retries + manual fallback (Recommended)”** under PT-028.
Exact retry limits, storage/duration/clearing details, remaining coordination and
production integration are still open. The earlier no-automatic-resend recommendation does not apply.

The user also selected **“Pause only affected products (Recommended)”** under
PT-029: unresolved-command products remain read-only while browsing and other
permitted product editing stay available. The user then selected **“Save other products independently (Recommended)”**
under PT-030. New requested saves retain validation and their own outcomes while
older recovery commands remain unchanged. PT-031 subsequently records **“Restore records; resume on request (Recommended)”**:
submitted unresolved records survive refresh/reopening in the same browser,
business and user; recovery resumes only on request. PT-032 then records **“Keep drafts across reopening; restore on request
(Recommended)”** for never-submitted drafts in that same scope, keeping initial
Products read-only. PT-033 records **“Review only changed products (Recommended)”**
when loaded current product data differs from an unsent draft's original baseline;
no automatic merge/overwrite or changed submitted-command content follows.

These functional selections do not define exact retry budgets, storage mechanisms,
comparison/versioning, command mapping or production write availability. The
current prototype and all accepted images remain unchanged; next prepare the
bounded recovery design/technical choices without inferring implementation authority.

The next **“go ahead”** continues retry-budget and browser-persistence discovery.
The [technical decision record](recovery-technical-design.md) prepares the initial
client profile and storage-engine alternatives. The user chose **“3 total attempts
(Recommended)”** under PT-034: original plus two retries, 15 seconds per attempt,
1/3-second waits randomized by ±50%, with no deliberately concurrent frontend
attempts of that command. The user also selected **“IndexedDB (Recommended)”**
under PT-035 for retained business drafts and operation records. They then rejected
making IndexedDB a prerequisite when it is absent or fails. PT-036 records the
compatibility clarification and makes IndexedDB preferred, not mandatory. The
technical record presents the IndexedDB/localStorage/open-app-memory fallback,
which the user explicitly selected with **“Use this fallback design (Recommended)”**
under PT-037, including the nonblocking retention notice and memory-only limits.
The user selected **“New bounded run per manual action (Recommended)”** under
PT-038: after a stopped run, explicit Reintentar/Continuar recuperación authorizes
up to three attempts with the same original command and PT-034 timing. It does
not restart automatically or deliberately overlap a known active run. The user
then selected **“Coordinate when possible; usable fallback (Recommended)”** under
PT-039: show another known active recovery run and avoid a second deliberate run,
while keeping recovery usable with an honest limitation notice when coordination
is unavailable. Missing status is not proof of no other run. Other eligible work
stays available. PT-040 then records the user's rejection of independent
same-product edits: a second edit must be rejected with a clear error. The user
asked to discuss discard/takeover because the original tab may be closed.
They then selected **“Explicit resolution when owner is unreachable (Recommended)”**
under PT-041: allow explicit Asumir edición or confirmed discard/start for an
accessible unsent draft when its earlier tab is unreachable and its status
unknown; make the earlier editor read-only if it returns. Known active editors
still block a second edit. Recovery of submitted commands keeps its existing
rules. Ownership enforcement, editing without usable coordination and live
qualification remain separate. No new implementation is authorized.

The [bounded recovery/ownership preview plan](recovery-preview-plan.md) is now
prepared for review. It makes PT-028–041 concrete with synthetic commands,
simulated persistence/owner states and a virtual returning editor. Implementation
of this new preview is not yet selected. Production mechanisms, actual retention,
real APIs, dependencies, image approval, staging and commits remain separate.

### Bounded preview execution selected — 2026-11-14

The user selected **“Build the simulated preview (Recommended)”**. The
[preview plan](recovery-preview-plan.md#execution-authorization--2026-11-14) is now
authorized for synthetic commands, simulated storage/ownership and candidate
visual review. This supersedes earlier pending execution wording only; actual
production mechanisms, new dependencies, image acceptance, staging and commits
remain outside scope.

### Simulated preview implemented and ready for review — 2026-11-14

The authorized [bounded preview](recovery-preview-plan.md#execution-and-verification--2026-11-14)
is implemented and verified with 84 code tests, 124 browser checks, 172 new
candidate captures and 607 unchanged-reference comparisons. Source `2058ed78…`,
exact run identities, resolved review findings, local build/font preparation
corrections and simulation limits are recorded there. The exact 172-image gallery
is pending user approval. The 628 accepted references, separate navigation review,
production-policy gaps and never-commit boundary retain their status.

### Products filters continuation — selected 2026-11-16

The user selected **“Products filters and applied view (Recommended)”** to complete
the approved PT-010–012 behavior through the [bounded simulated preview](filters-preview-plan.md).
They then selected **“Confirmed matches + incomplete-results notice (Recommended)”**
under PT-042: list confirmed stock matches and visibly count otherwise-eligible
products that could not be assessed. Unknowns remain unassessed; an empty confirmed
subset is not a complete empty result while unresolved candidates remain. Waiting
for all stock is not the selected presentation. Exact notice treatment and other
visual placement/metrics remain review proposals. The prior user commits
`b6756f7`/`9849d58` complete the recovery checkpoint and spend its staging authority;
832 accepted references remain intact. No new API, dependency, production journal,
pagination/search policy, message-box redesign, reference promotion or commit
was authorized by that initial preview selection.

The user subsequently said **“I approve them. They looks ok”** for the exact
440-image gallery from `2026-11-16T17-45-52.365Z`, source `3bf12996…`.
The [approval and promotion record](filters-preview-plan.md#visual-approval-and-reference-promotion--2026-11-16)
supersedes the pending-visual status for that exact set. All 440 cases are promoted:
80 new entries, 360 replacements and 472 unrelated references preserved, for 912
accepted references. The 891-case post-approval comparison includes Products and
retains the separate navigation exclusions. Post-approval capture verification
identified inconsistent scroll positions in three phone references. The user
specifically approved their normalized replacements with **“Approve the three
capture-only replacements”**; those three are promoted with the baseline still 912. Source-matched proof covers all 891 eligible cases: 888 unchanged passing
cases and three freshly verified replacements. No product UI/tolerance change,
new staging, commits, deployment,
production integration or deferred message-box work follows from the approval.
