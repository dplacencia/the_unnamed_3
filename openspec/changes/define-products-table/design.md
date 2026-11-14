# Products table: design discovery

## Current authority

The user authorized definition/research after committing the navigation
corrections. [proposal.md](proposal.md) records the instruction and scope;
[research.md](research.md) records sources, contrary evidence and limitations.
PT-001 records the selected table-first interaction direction; PT-002 adds optional
read-only stock context for one clearly selected location; PT-003 records the
initial column set. PT-004 selects catalogue columns initially with stock context
on request through Mostrar existencias. PT-005 records per-tab stock visibility
and location retention, applying existing page-owned location defaults. PT-006
selects compact rows by default with an optional comfortable density. PT-007
records one Buscar productos field for partial names and exact SKU/barcodes,
preserving codes and leaving product choice to the merchant. PT-008 selects
Enter/Buscar submission and clearing only the search constraint while preserving
stock/location context. PT-009 selects Producto A–Z initially and one active
ascending/descending sort through Producto or SKU headings across matching
results. PT-010 selects optional archived inclusion and positive recorded-stock
filters under Filtros, using existing Inventory meanings. PT-011 selects
Aplicar/Cancelar, removable applied-filter labels and scoped clearing, including
removing stock-only filtering when stock is hidden. PT-012 retains submitted
search, sort, applied filters and density per tab within the same business, with
defaults for new tabs and unapplied view drafts discarded on leaving Products.
PT-013 selects Vista for density and column visibility/order/width, with per-tab
column choices, Producto included and Restablecer columnas preserving other
controls. PT-014 selects product-name activation opening read-only details in a
desktop side panel or a panel filling the phone screen, preserving table settings
on close. PT-015 selects all active tracked stock measurements in one cell, with
units, main/reservation dimension first, exact values and visible unknown or
verification-needed states. PT-016 selects the full phone table with horizontal
scrolling, sticky column header and Producto pinned left, preserving saved desktop
choices. PT-017 selects individual panel editing and optional table editing,
both explicit draft flows with Guardar/Cancelar and read-only stock. Other layouts,
interactions and field choices below remain proposals.
Existing scope, values, user-chosen depth and TailAdmin branding apply.

The [product thesis](../../../../the_unnamed_1/project_idea.md) reports Excel
inventory use and familiar fragmented workflows. It does not establish what
interviewees do most often in their sheets. Do not decide that from forum posts.

## Proposed outcome

A merchant can find and compare products, make the supported changes they need,
and stay oriented without repeatedly leaving the working list. They can start
with useful essentials and request more control. The experience preserves the
speed and ownership people value in spreadsheets while giving business data
explicit meaning, validation and honest outcomes.

This is an outcome hypothesis. It is not a promise of Excel feature parity,
universal ease of use, real-time physical accuracy or currently available APIs.

## Alternatives for discussion

| Direction                                                                      | Strength                                                                                                                   | Cost / when it fits                                                                                                                                                           |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Table-first with deliberate editing and contextual detail — recommended** | Keeps comparison and repeated work in one place; offers a clear everyday surface and optional editing/configuration depth. | Need to decide which changes can be quick and how editing is made obvious. Richer details still need an appropriate editor.                                                   |
| **B. Always-editable spreadsheet-style grid**                                  | Potentially very fast for skilled users doing many repetitive edits.                                                       | Greater accidental-edit risk and ambiguity for beginners; more grid behavior to learn and maintain. It can recreate spreadsheet complexity before a real need is established. |
| **C. Read-only list with separate forms for changes**                          | Clear boundaries and room for complex single-product work.                                                                 | Repeated per-record navigation loses comparison context and may make common batch work slower than the existing sheet.                                                        |

The user selected A through “Table-first; editing on request (Recommended)”. It must not be
implemented as a mandatory global simple/advanced mode or tied automatically to
permissions. Interface depth and permission to change data remain separate.

## Candidate interaction principles

1. **The table is the work area.** Compact toolbar and relevant columns, readable
   row identity, consistent alignment and enough records to compare. Avoid large
   KPI cards above the working list. PT-003 defines initial columns; density remains open.
2. **Keep place.** Search/filter/sort, scrolling and detail inspection should keep
   row identity understandable. Explore fixed headings/identity and contextual
   detail where useful; do not silently reset the user's work.
3. **Make repeated work cheap.** Explore explicit table editing, keyboard
   navigation, copying and bounded paste or batch actions. Every shortcut needs
   a clear discoverable pointer/touch path. No always-editable grid is selected.
4. **Adapt the representation deliberately.** Explore hiding/reordering/resizing
   columns, explicit density choices and views. Save scope/persistence, arbitrary
   custom fields and shared view administration remain unresolved.
5. **Preserve the meaning of changes.** Draft/cancel/confirmed/error/uncertain
   states should be clear. Committed business corrections are not destructive
   Ctrl+Z. Do not promise atomic bulk transactions or rollback without a basis.
6. **Bridge existing tools carefully.** Investigate migration/paste/export after
   learning the actual source format and work. Mapping, exact values and errors
   need review; no upload-and-guess behavior or format library is selected.
7. **Design phone tasks intentionally.** Prioritize the current task and product
   identity; details can be requested. Do not assume a desktop grid shrunk to a
   phone, a full card conversion, hidden information or bulk editing on touch.

These proposals are not an initial-release checklist. Decide them against the
primary task; a feature's presence in Excel is not sufficient reason to build it.

## The first unresolved boundary: which job is the table for?

The agreed navigation has **Productos**, **Existencias** and **Recuentos**. An
inventory workbook may combine all three jobs. Discover the customer's task
before mapping spreadsheet columns onto the Products page.

| Job                                           | Likely design questions, not selected behavior                                                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maintain the product catalogue                | What identifies an item? Which fields are routinely maintained? Which changes are supported? Do people add products individually or import many?                            |
| Inspect stock and decide what needs attention | Which location and quantity meaning? Which comparisons matter? What is an explicitly known threshold? Does this belong primarily in Existencias?                            |
| Enter counts or other stock changes           | Is this a draft physical observation, a receipt/departure or a correction? What scope and confirmation are needed? Which specialist workflow should receive the fast entry? |

The user answered the first customer-task question **“I dont know, try to find
some info in internet”**. The follow-up research records concrete published
stock-review, counting and ordering routines (F9–F13). It does not reveal our
interviewees' routine or establish a statistically most-common task. Do not ask
the user to supply the same unavailable fact again.

Recommend a first exploration centered on **find a product, understand its known
state in context and act without losing place**. Use the existing Productos,
Existencias and Recuentos distinction to keep data meaning clear while exploring
consistent table behavior. Products remains a catalogue-focused entry; stock
review and fast count entry must be tested in their relevant task context rather
than assuming a better catalogue editor replaces an inventory workbook. Related
information can be useful without making every displayed value overwritable.

The user selected **table-first, editing on request**, then **catalogue plus
optional stock context**. The first scenario is browsing/comparing products with
optional read-only stock for one visible location. PT-003 defines the initial
columns; defaults, additional columns and interaction details remain to be agreed.
Interviewee routines are still unknown.

## Selected interaction direction — 2026-11-13

The user answered **“Table-first; editing on request (Recommended)”** to:

> Which interaction model should we develop first? I recommend a table for browsing
> and comparison, with editing deliberately activated and faster tools available
> on request. This keeps everyday use clear while preserving efficient repeated
> work; exact columns and save/bulk behavior would follow.

PT-001 records only that selection. The table begins with browsing/comparison;
editing is deliberate rather than an accidental consequence of inspecting data.
Faster tools can be requested. Exact activation, editable fields, save/cancel,
bulk/paste scope, authority, density, views and persistence remain undefined.
This is not approval to implement an editor or a global UI mode.

## Information boundary — proposal and selection

Recommend exploring **catalogue essentials plus read-only stock context** for
the first Products table: identify an item by name/code, compare it with nearby
items and, when shown and authorized, inspect recorded on-hand for
one visibly selected location. This responds to the research's stock-inspection
work without treating the quantity as an editable product attribute.

The alternative is a **catalogue-only Products table**, with stock inspection
kept in Existencias. That simplifies the page and keeps it location-independent,
but may require more movement between pages for an inventory-sheet user.

The user selected the catalogue-plus-stock-context direction below. Its location must use the
existing explicit scope principles; page-entry/default/remembering applicability
must be recorded without silently changing the current navigation prototype.
Known absence, zero, negative values, loading, denial and retrieval failure stay
distinct, and recorded on-hand is not physical certification or available-to-sell.
No multi-location total, valuation, inferred replenishment or stock overwrite is
proposed by this context choice. PT-003 subsequently selects initial columns;
PT-004 defines stock-on-request presentation. Backend integration and UI implementation remain
outside this definition step.

### Selected optional stock context — 2026-11-13

The user answered **“Catalogue + optional stock context (Recommended)”** to:

> Should the Products table offer optional read-only stock information for one
> clearly selected location? I recommend this so merchants can compare products
> and quantities without changing pages. Exact columns and default visibility
> would follow. The alternative keeps Products focused on catalogue details and
> stock information in Existencias.

PT-002 records only this boundary. Stock visibility and product-editing state
are independent: activating catalogue editing cannot make stock cells editable.
PT-003 subsequently selects the initial columns and PT-004 the default visibility
and toggle. PT-005 subsequently defines retention and applicability of the existing
location defaults. Existing catalogue and
stock authority keep their meanings; this creates no grants or API capability.

## Initial column set — proposal and selection

Recommend starting with **Producto**, **Referencia (SKU)** and **Unidad** as
catalogue columns, plus **Existencias registradas** when stock context is shown.
The user selected this set below. It keeps the first design focused on identifying/comparing products and their
unit while supporting the optional inventory context already selected.

Names are human-readable identity cues, not uniqueness keys. SKU remains optional
and preserves its exact display; this proposal does not generate missing codes
or silently substitute a barcode. Unit refers to the product's configured main
measurement unit. Stock retains that quantity meaning and a clearly visible
location. Detailed rendering of missing values and additional dimensions/codes
still needs definition.

Barcode, lifecycle state, family/variant information and further measurement
details can be considered separately rather than selecting them as initial
columns. No price, costing, generic category/custom-field model, status threshold
or new bulk capability follows from this proposal.

The column-set selection alone does **not** settle whether stock is visible
initially or the control used to show it; PT-004 subsequently defines those.
Mobile prioritization, density, editing fields and save behavior remain explicit
next decisions; no table UI is implemented.

### Selected initial columns — 2026-11-13

The user answered **“Use this initial column set (Recommended)”** to:

> For the first Products table, I recommend Producto, Referencia (SKU) and Unidad,
> adding Existencias registradas when stock context is shown. Shall we use this
> initial column set? Whether stock appears by default, additional optional
> columns and editing behavior would remain separate decisions.

PT-003 records only that initial set. Other optional columns have not been
rejected permanently or selected for implementation. Presentation of missing
values, field editing, search/filter/sort and responsive behavior remain open.

## Stock presentation — proposal and selection

Recommend starting with the three catalogue columns and offering a labelled
**Mostrar existencias** toggle. When on, it reveals the read-only stock column
and its location controls; when off, the table returns to the catalogue columns.
This gives a merchant a usable catalogue without requiring location context and
keeps stock comparison available in the same work area.

The alternative is to show the stock context from the outset, making quantities
immediately prominent but introducing location context before catalogue browsing.
Both options retain one clearly selected location and honest quantity states;
neither permits a guessed location or converts unavailable stock into zero.

The user selected the stock-on-request option below. PT-005 subsequently defines
retention and page-owned location defaults. Responsive layout, visual treatment
and the storage mechanism remain separate. The navigation prototype is unchanged.

### Selected stock-on-request presentation — 2026-11-13

The user answered **“Show stock on request (Recommended)”** to:

> For stock visibility, I recommend catalogue columns initially, with a labelled
> “Mostrar existencias” toggle that reveals the stock column and location
> selector. Would you prefer this or showing stock context immediately?
> Remembering the choice would be defined separately.

PT-004 records the default and show/hide control. Stock remains read-only;
showing it does not grant access or choose an unspecified location. PT-005
subsequently defines remembering the toggle and location defaults; implementation
is not selected here.

## Retention and location behavior — proposal and selection

Recommend remembering the Products stock toggle and its selected location while
the tab stays open, so returning to the table preserves the working context.
Apply the already selected Inventory location rules to this optional context:
automatically select the sole known accessible location; with several and no
valid selection, ask the merchant to choose before displaying quantities.
Keep the location choice when stock is hidden so turning it on again in the same
tab restores that context when it is still valid and accessible.

A fresh tab starts with the catalogue columns and no remembered Products choice.
The selection belongs to Products, not a global Inventory location; remembering
it does not establish current access or continued validity. No guessed location,
cross-tab/account preference or long-term storage policy is proposed.

The alternative is to reset the toggle and location choice whenever Products is
opened, keeping each visit explicit but requiring repeated setup. The user selected
the per-tab behavior and applicability of the existing
[NAV-008–009 scope rules](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-009--location-defaults-and-per-tab-remembering).
The storage mechanism and implementation stay deferred.

### Selected per-tab stock context — 2026-11-13

The user answered **“Remember per tab (Recommended)”** to:

> For Products, I recommend remembering stock visibility and the selected location
> while the tab stays open. Reuse the agreed location rules: select the sole
> accessible location automatically; with several, ask before showing quantities.
> Hiding stock keeps the location choice for that tab; a new tab starts
> catalogue-only. Shall we use this behavior?

PT-005 records the retention and location rules. Remembered context is a user
choice, not a current access grant or stock result. The existing honest loading,
failure and validity principles remain applicable. No cross-tab, account-level
or long-term preference or storage mechanism is selected.

## Table density — proposal and selection

Recommend compact rows by default, with an optional comfortable density selected
by the merchant. Use space efficiently through padding and alignment while
retaining readable text and appropriate touch targets. This follows the user's
emphasis on information-rich tables and offers roomier presentation without
inferring someone's skill or changing their access.

The alternative is a single comfortable density: fewer presentation controls,
but fewer visible rows in the same work area. Compare the selected direction in
Storybook before fixing pixel measurements. Exact row heights, density-control
placement, retention, mobile presentation and visual acceptance remain open.
The user selected the two-density direction below; UI implementation is deferred.

### Selected density direction — 2026-11-13

The user answered **“Compact default + comfortable option (Recommended)”** to:

> For table density, I recommend compact rows by default with an optional
> comfortable setting. Keep readable text and touch targets, and compare both in
> Storybook before fixing exact row heights. Shall we use this approach or a
> single comfortable density?

PT-006 records only this direction. Density is explicitly chosen, not inferred
from skill or permissions. It changes presentation, not data or access. No exact
row heights, control placement, density-preference retention, mobile layout,
reference images or implementation are selected. The per-tab stock-context
decision does not automatically extend to density.

## Product search surface — proposal and selection

Recommend one labelled **Buscar productos** field for partial-name discovery and
exact product SKU/barcode lookup. Present matching products for the merchant to
choose; names are not unique and input must preserve codes such as leading-zero
barcodes. The compact default should not require a separate search box for every
column. The alternative is separate fields by name/code/column, making search
scope explicit but adding controls to the initial work area.

The user selected this frontend interaction direction below. The owning
[Inventory search specification](../../../../the_unnamed_1/openspec/specs/inventory-product-search/spec.md)
defines partial-name and exact-code intent, excludes typo-tolerant guesses and
unapproved matching/ranking policies, and explicitly separates requirements from
current interface availability. Rechecked on 2026-11-13, the consulted source
matches the existing research snapshot.
One input must not silently select a winner between different matching products,
strip identifier characters or reinterpret a product match as stock availability.

This selection covers only the search surface and intended lookup tasks.
PT-008 subsequently defines submission and clearing. Matching across fields,
case/accent/token rules, ranking,
family/variant presentation, package lookup, filters, sorting and retention remain
separate. No backend method or production search support is inferred; future
prototype fixtures must be clearly distinguished from an available integration.

### Selected search surface — 2026-11-13

The user answered **“One search field (Recommended)”** to:

> For search, I recommend one “Buscar productos” field for partial names and exact
> SKU/barcode lookups, preserving codes such as leading zeros. Show matching
> products without automatically choosing one. Would you prefer this or separate
> search fields? Detailed matching rules and sorting would follow separately.

PT-007 records one field and its intended lookup tasks. It does not select
cross-field matching precedence, normalization, ranking, submission timing,
filters, sorting or an integration. Source constraints and exact code meaning
continue to apply.

## Search trigger — proposal and selection

Recommend submitting the search with **Enter** or a visible **Buscar** button.
The merchant can finish typing a query while the current rows remain steady.
Offer a clear action that removes the search constraint without changing the
stock toggle or selected location. Submitted-query results must remain
distinguishable from an unsubmitted draft; exact visual treatment is not selected.

The alternative is automatic searching after a short typing pause. That offers
faster feedback but changes results during query composition and requires clear
pending/result handling. Neither option selects debounce durations, matching
semantics, filters, sorting, storage or an API method.

The user selected the explicit trigger and search-clearing behavior below.
Detailed result/error presentation and responsive button placement remain to be
designed. This selection does not authorize implementation.

### Selected search submission and clearing — 2026-11-13

The user answered **“Enter or Buscar (Recommended)”** to:

> For running searches, I recommend Enter or a visible Buscar button, keeping
> rows steady while typing. The alternative searches automatically after a short
> pause. In either case, clearing search would remove only its search constraint
> and preserve stock/location settings. Which trigger do you prefer?

PT-008 records explicit submission and scoped clearing. A draft query is not a
completed search; the visual relationship between draft/submitted queries and
results still needs design. Clearing does not reset stock visibility or location.
Matching, sorting, result/error presentation, retention and implementation remain
separate decisions.

## Sorting direction — proposal and selection

Recommend **Producto A–Z** initially, with one active sort column at a time.
Activating **Producto** or **Referencia (SKU)** headings switches that column
between ascending and descending order, with the active order visible. SKU stays
an exact text identifier; sorting does not cast it into a number or rewrite it.
Sorting applies to the current matching result set, not just rows in the viewport.

The alternative is multi-column sorting controls from the outset. That supports
more complex ordering but adds concepts before the initial browse/compare flow
has been reviewed. Additional sortable fields and multi-column tools can be
considered later; they are not approved by the general request for optional depth.

The user selected the initial order, two sortable headings and single-column
interaction below. Unit/stock sorting remains separate: stock has exact
quantity and unit meaning, so comparing raw numbers across unlike units must not
be silently chosen. Collation, tie-breaking, retention, pagination, search ranking
and implementation remain unresolved; no API sorting capability is inferred.

### Selected initial sorting — 2026-11-13

The user answered **“Single-column sorting (Recommended)”** to:

> For sorting, I recommend Producto A–Z initially, with one active column at a
> time: click Producto or Referencia (SKU) to toggle ascending/descending. SKU
> stays text, and sorting applies to the full matching result set. Unit/stock
> sorting would be defined separately. Use this start, or develop multi-column
> sorting now?

PT-009 records that initial sorting behavior. It does not select unit/stock or
multi-column sorting, detailed collation, tie-breaking, retained preferences,
pagination mechanics or a sorting API. The active-order indicator still needs
visual design; no reference image or implementation is accepted by this choice.

## Initial filters — proposal and selection

Recommend a **Filtros** control with optional **Incluir archivados** and, while
stock context is shown for a selected location, **Solo con existencias registradas**.
The initial catalogue excludes archived products, following the existing domain
default. Without the stock-only filter, eligible products with zero stock or no
stock record remain discoverable; a missing record is not displayed as zero.
The alternative is search alone for the first table, deferring these filter controls.
The user selected the filter set below.

The owning Inventory search rules already define these meanings. Archived
inclusion uses current authority and identifier assignments; it does not restore
historical code ownership or reactivate products. Stock-only means positive
recorded on-hand in the product's configured reservation dimension at the selected
location, irrespective of holds or allocations. It is not available-to-sell and
must not silently substitute the displayed unit or another independent dimension.
Recorded zero, negative balances and no record do not qualify; failed/unknown
reads are not a known negative result. The source remains distinct from current
interface availability.

This selection covers the initial filter controls and their existing meaning.
PT-011 subsequently defines application, active-filter indicators, switching stock
context off and clear/reset scope. Retention, multi-dimension quantity presentation
and failure handling remain to be designed. No new filter field, category model,
threshold, quantity interpretation or production integration is selected here.

### Selected initial filters — 2026-11-13

The user answered **“Use these initial filters (Recommended)”** to:

> For the first filters, I recommend a Filtros button offering “Incluir archivados”
> and, when stock is shown, “Solo con existencias registradas” for the selected
> location. The stock filter means positive recorded stock under Inventory’s
> existing quantity rules. By default, show active products including those with
> zero stock or no stock record. Use this filter set, or start with search alone?

PT-010 records that initial set and inherited meaning. Current domain authority,
exact quantity states and configured reservation dimension remain applicable.
The filter is not an availability promise. PT-011 subsequently defines filter
interaction and hiding stock context; retained preferences, quantity presentation
and implementation remain open.

## Filter interaction — proposal and selection

Recommend a filter panel with **Aplicar** and **Cancelar**. Editing filter choices
changes a draft; Aplicar applies those choices to the list, while Cancelar or closing
without applying discards the draft. The alternative is applying each change
immediately. This is view configuration, not a business-data write.

For either trigger, propose compact removable labels for applied filters and a
**Limpiar filtros** action. Removing a label clears just that filter; clearing
filters restores their defaults while preserving search, sort, density and
stock/location context. Applied constraints remain visible after the panel closes.

When stock context is hidden, clear its stock-only constraint in both draft and
applied filter state. Preserve the other table controls; showing stock again
leaves the stock-only filter off until explicitly selected. This prevents an
invisible location-stock constraint from continuing to exclude products.

The user selected the filter trigger, cancellation, active indicators and
clear/context-switch behavior below. Retention, panel placement,
exact label styling, multi-dimension display, loading/failure treatment and
implementation remain separate.

### Selected filter interaction — 2026-11-13

The user answered **“Aplicar/Cancelar (Recommended)”** to:

> For filter interaction, I recommend Aplicar/Cancelar; closing without Aplicar
> discards the draft. In either approach, show removable labels for applied filters,
> and let Limpiar filtros preserve search, sorting and stock/location settings.
> Hiding stock would clear its stock-only filter until explicitly selected again.
> Prefer explicit Aplicar, or apply filter changes immediately?

PT-011 records that interaction. Panel edits remain drafts until Aplicar;
cancelling/closing discards them. Applied labels expose the current constraints;
removing one clears its filter, while Limpiar filtros resets filters without
resetting other table controls. Hiding stock clears the stock-only constraint in
draft and applied state, and turning stock on again does not restore it silently.
Visual placement, preference retention and implementation remain undefined.

## Applied-view retention — proposal and selection

Recommend extending per-tab Products context to the **submitted search query**,
**selected sort**, **applied filters** and **chosen density**, within the same
business. Returning to Products in that tab restores those controls; a new tab
uses their initial defaults. Stock visibility/location keep their already selected
PT-005 behavior. Unsubmitted search/filter drafts are not restored after leaving
Products. This concerns view controls; product-edit drafts have no selected
discard or persistence policy.

The alternative is resetting these four controls whenever Products is reopened,
while keeping PT-005 stock/location retention unchanged. That is simpler state
behavior but requires re-entering the working view after navigation.

The user selected retention only for these applied view controls below.
Restoring a query or selected location does not prove current data/access or a
successful read. Refresh/result behavior, scroll/pagination position, business
switching, column preferences, storage mechanism and implementation remain
separate. No cross-tab, account-level, shared-view or long-term preference is
selected by this decision.

### Selected applied-view retention — 2026-11-13

The user answered **“Remember applied view per tab (Recommended)”** to:

> To preserve the working list, I recommend remembering the submitted search,
> sort, applied filters and density in the current tab for the same business.
> Returning restores those controls; a new tab uses defaults. Unsubmitted
> search/filter drafts would be discarded when leaving Products. Keep this per-tab
> view, or reset these four controls on return? Stock/location retention stays as
> already agreed.

PT-012 records that extension. It does not define unfinished product edits,
current-data retrieval, business switching, column preferences, storage or an
implementation. Restored view controls still require honest result/access states.

## Column customization — proposal and selection

Recommend a **Vista** menu that groups the already selected density choice with
optional column visibility, order and width tools. Preserve the agreed initial
columns; Producto stays included, and Mostrar existencias remains the control
for revealing/hiding stock context. Customization concerns the selected columns,
not new product fields or arbitrary spreadsheet schema.

Remember column visibility/order/width per tab within the same business, alongside
the applied view. Offer **Restablecer columnas** to recover the default column
layout while preserving search, sort, filters, density and stock/location context.
The alternative is a smaller first scope with density and visibility only,
deferring column order/width controls.

The user selected the customization scope, Vista grouping and per-tab column
choices below. Exact controls and measurements, mobile adaptation, what happens
when hiding the active sort column, scroll/frozen columns and implementation stay
separate. It selects no extra field, grid library or image reference. This
customization direction does not authorize implementation.

### Selected column customization — 2026-11-13

The user answered **“Vista with visibility/order/width (Recommended)”** to:

> For customization, I recommend a Vista menu for density, column visibility,
> order and width, remembering column choices per tab. Keep Producto included,
> stock visibility under Mostrar existencias, and the agreed default columns.
> Add Restablecer columnas to recover the layout. Use this scope, or start with
> density and visibility only?

PT-013 records that scope. Column choices remain within the same tab/business;
resetting columns preserves search, sort, filters, density and stock/location.
Producto cannot be hidden; this does not make it a frozen column or fix its
position. Stock-context visibility retains its existing rules. Exact tools,
measurements, hidden-sort behavior, responsive adaptation and implementation
remain separate decisions.

## Product inspection — proposal and selection

Recommend activating a product's **name** to open read-only product details in a
desktop side panel, with a full-screen panel on phones. Keep the table's applied
controls and column choices intact when the panel closes. Opening details is a
deliberate inspection action and does not enter editing. Editing would require
its own explicit action, with fields, permission behavior and save/cancel semantics
still to be defined.

The alternative is a separate product-details page that restores the agreed
table settings on return. It provides more page space but adds navigation away
from the list. The panel direction keeps product inspection close to comparison
work and does not make every table cell a product-opening target.

The user selected activation, the responsive container and read-only boundary
below. Exact detail contents, panel size/modality, tablet breakpoints,
focus/dismissal, URL/history, scroll restoration, data refresh, editing and
implementation remain separate. A selected details container would not establish
an available read/update API or authorize a business mutation.

### Selected product inspection — 2026-11-13

The user answered **“Details panel (Recommended)”** to:

> For opening a product, I recommend clicking its name to show read-only details
> in a desktop side panel and a panel filling the screen on phones, preserving
> the table’s settings. Editing would require a separate explicit action; its
> fields and save behavior would follow. Prefer this or a separate product page?

PT-014 records that inspection flow. A row's permanent product identity determines
which details open; duplicate names do not authorize choosing another product.
Inspection remains read-only. Contents, edit flow, panel behavior, responsive
thresholds, focus/history, scroll restoration and data retrieval remain open.

## Stock quantity presentation — proposal and selection

Recommend showing each actively tracked quantity with its configured unit in the
same stock cell, main/reservation dimension first. For example, **5 kg · 12 uds.**
shows two recorded measures; it does not assert a conversion ratio between them.
Preserve each exact value and visibly identify its known verification state.
An unknown quantity stays unknown; no-record, recorded zero, negative balances
and failed reads keep their distinct meanings. Disabled tracking must not expose
its last historical value as a current quantity.

The alternative is showing only the configured main quantity in the table and
making the secondary measure available through details on request. That keeps
the cell narrower but requires inspection to see the second tracked quantity.
Neither choice silently changes the main/reservation dimension used by stock-only
filtering or creates another dimension/configuration.

Source reviewed on 2026-11-13: the published
[quantity specification](../../../../the_unnamed_1/openspec/specs/inventory-quantities/spec.md),
clean at supporting revision `7240bfa0136cbe889146cdc243149a5160b94afa`.
Applicable sections cover exact quantity configuration/consumer display,
predefined units, signed stock/zero/absence, independent dimensions, secondary
tracking lifecycle and the configured reservation dimension. They define domain
meaning, not a frontend rendering or proof of runtime availability.

The user selected which active measurements appear in stock cells and their
explicit unit/status context below. Exact numeric/locale formatting, verification
labels/icons, missing/error rendering, wrapping/widths, detailed panel contents
and implementation remain separate.

### Selected stock measurements — 2026-11-13

The user answered **“All tracked measurements (Recommended)”** to:

> For recorded stock, I recommend showing every actively tracked measurement in
> the same cell—for example, 5 kg · 12 uds.—with the configured main measurement
> first. Preserve exact values and mark quantities needing verification; unknowns
> stay unknown. Show all measurements in the table, or only the main one with the
> rest in details?

PT-015 records all active measurements, unit/main ordering and truthful status
context. One measurement does not supply an omitted independent measurement;
disabled tracking does not make a historical observation current. Numeric/locale
format, exact status copy/icons, wrapping/widths, error presentation and
implementation remain separate. No physical-stock certification or API capability
is implied by showing recorded quantities.

## Phone table behavior — proposal and selection

Recommend retaining the full selected table on phones with horizontal scrolling,
a sticky header and **Producto pinned at the left**. Other columns retain their
chosen visibility and relative order. Apply this phone presentation without
rewriting Producto's saved desktop position or other column choices. Details
continue to fill the phone screen under PT-014.

The alternative is a reduced phone table with Producto and optional stock,
placing SKU/unit information in details. That reduces horizontal movement but
requires product inspection for catalogue comparisons available in the full table.
Both directions keep the selected stock measurements exact and preserve the
merchant's submitted search, sort and filter context.

The user selected the phone information/scrolling model and pinned identity
below. Breakpoints, column widths and responsive caps, wrapping, touch/keyboard
behavior, visible pin/customization controls, desktop/tablet scrolling and
implementation remain separate. Phone pinning would be a responsive presentation
rule that preserves saved desktop layout. This direction does not authorize implementation.

### Selected phone table model — 2026-11-13

The user answered **“Full table + pinned Producto (Recommended)”** to:

> For phones, I recommend keeping the full table with horizontal scrolling, a
> sticky header and Producto pinned on the left. Other columns keep their chosen
> visibility/order, and Producto’s saved desktop position stays intact. Prefer
> this, or a reduced phone table with Producto + optional stock and the other
> fields in details?

PT-016 records that phone model. The sticky header is the table's column-heading
row. Saved visibility/order choices and desktop Producto position remain intact;
stock retains its selected quantity meaning. Breakpoints, pinned width/caps,
wrapping, mobile customization tools, keyboard/touch details, desktop/tablet
scrolling and implementation remain undefined.

## Editing paths — proposal and selection

Recommend **Editar** in the product panel for one product and an optional
**Editar tabla** mode for repeated catalogue changes. Both are deliberate requests
and begin with drafts, with explicit **Guardar** and **Cancelar** actions. Merely
inspecting details, choosing Vista or using search/filter controls does not start
business-data editing. Stock remains read-only under the selected context rules.

The alternative is panel editing first, deferring a repeated-work table editor.
That reduces initial editor scope but makes repeated catalogue changes require
per-product inspection. Offering both paths would support the selected table-first
direction and let the merchant request deeper working controls.

The user selected editing entry points and the draft/save/cancel boundary below.
Editable fields, permissions, multi-row save/partial-failure
semantics, validation, concurrent drafts, navigation with unsaved edits, responsive
controls and implementation remain separate decisions. No atomic batch, undo,
stock overwrite, update API or completed save is implied.

### Selected editing paths — 2026-11-13

The user answered **“Panel + optional table editing (Recommended)”** to:

> For editing, I recommend Editar in the product panel for one product, plus an
> optional Editar tabla mode for repeated catalogue changes. Both start as drafts
> and require Guardar/Cancelar; stock stays read-only. Editable fields and multi-row
> save/failure behavior would follow. Develop both paths, or panel editing first?

PT-017 records both paths and the draft boundary. It does not choose editable
fields, multi-row atomicity, save/error handling, concurrency, draft persistence
or an update interface. View-retention rules do not discard business-edit drafts.

## Grid reference research — current steering

After the editing-path choice, the user requested looking at AG Grid expandable
rows, then Tabulator 6.x examples and TanStack, checking whether their licences
permit commercial use and building on them. The subsequent “continue” resumes
that comparison. Library selection and the exact expansion concept remain open.
The previously selected details panel and editing paths remain applicable until
the user explicitly chooses a change.

The [reference and licence review](research.md#grid-libraries-and-row-expansion--2026-11-13)
records official source facts, candidate versions and limitations. Both TanStack
Table and Tabulator publish MIT licences permitting commercial use with notice
retention. AG Grid's relevant Master/Detail implementation is Enterprise.
No implementation, paid licence or dependency selection follows from those facts.

The initial recommendation was TanStack Table first, for its direct React and
TailAdmin composition. The user did not select it and instead asked which
candidate is more powerful considering all features and how Irin works, beyond
styling. The [broader assessment](research.md#full-feature-and-platform-fit-assessment--2026-11-13)
finds **Tabulator supplies more complete grid operations**, including editing,
validation, keyboard/clipboard, virtual rendering, files and local history.
**TanStack v9 supplies substantial table/range-selection engines with more direct
React composition**, but keyboard binding, clipboard serialization, editors and
any needed virtualization integration remain application work.

The updated recommendation is a **small comparison of both using identical
Irin cases before adoption**. Compare exact/status-rich data, explicit draft/save
boundaries, detail lifecycle/focus, the selected full phone table, view retention
and the custom adapter code needed. Optional capability probes do not select new
product features. Both candidates require Irin's business semantics; supplied
grid edits, persistence and undo are not confirmed business writes, the selected
retention policy or business reversal. The React integration advantage and
feature-work savings are source-based assessments, not measured runtime results.
Exact package/version, release-age eligibility, workload, installation scope and
a bounded Storybook qualification plan remain separate decisions. Neither
candidate, new dependency nor expansion behavior had been selected at that point.

The user subsequently delegated any needed tests/comparisons and requested the
final assessment. The [qualification plan](qualification-plan.md) implements
that bounded authorization; the [results](qualification-results.md) record the
executed comparison. Recommend TanStack Table for Irin's React/domain-workflow
composition and smaller vendor payload, while explicitly preserving Tabulator's
ready-made feature advantage and measured 10,000-record scroll/heap advantage, with similar mount cost.
The report records its native ARIA finding, keyboard workaround and audit limits.
Both libraries are dev-only evaluation dependencies, not a selected production
foundation. Editable fields, expansion design and all other open product choices
remain open; the delegated test authority does not approve those choices.

For interaction exploration, recommend comparing a compact read-only expansion
beneath a product with the existing full panel. Keep the panel available for full
inspection and the selected editing path; do not replace PT-014 implicitly.
An actual family/variant hierarchy is a distinct expansion concept. A collapsed
row, requested summary and explicit full-details action are a design proposal,
not selected defaults, field content, expansion-count rules or draft lifecycle.

The engine choice does not select categories, family stock totals, automatic
hidden columns or product-edit behavior. In particular, Tabulator's optional
responsive-collapse mode does not satisfy the selected full phone table; source
availability is not permission to hide the merchant's chosen columns.
Sorting/filtering must keep their agreed result-set scope and domain meanings.
Keyboard/focus, detail height, mobile width, loading/refresh, expansion retention,
unsaved edits and collapse behavior still need concrete design/verification.

Editable fields remain open. When that discussion resumes, the owning identity
source's supported later-code assignment must not be expanded into general SKU
replacement, retirement or remapping by an editable field alone. No name/SKU
fieldset or identifier-operation policy has been selected in this discovery.

## Selected foundation and first browsing design — 2026-11-13

The user accepted TanStack and requested continued design with the latest
available exact version. [Foundation decisions](foundation-decision.md) record
the instruction, registry verification and PT-018–021 selections. TanStack Table
9.3.1 is now the selected runtime dependency. React Virtual stays available for
evaluation and is not needed for the first small browsing fixture.

The user selected compact requested read-only expansion plus the retained full
details panel; barcode(s), lifecycle status and hidden catalogue fields in that
summary; and multiple independently opened summaries, all initially collapsed.
Product fields, status and barcode associations retain their existing domain
meanings. These choices do not introduce product hierarchies or business edits.

The [browsing prototype plan](prototype-plan.md) implements the first concrete
TailAdmin design in the existing merchant shell. It covers browsing, requested
stock, search/sort, Vista, summaries and inspection. Exact visual sizes/copy and
column-control treatment are proposals to review. Applied-filter UI, editing
fields/save flows and production retrieval/pagination remain subsequent work.
The qualification report's pre-adoption statements remain historical evidence;
the latest user decisions govern current design authority.

## Decision sequence after the research framing

1. Select the interaction direction and an explicit first scenario, preserving
   the catalogue/stock/count boundary without inventing customer interview data.
2. Agree the minimal information needed for it and what is optional/contextual.
3. Decide how changes begin, which fields/actions are available and what a
   confirmed result means. Define repeated/bulk work with its scope and failures.
4. Compare readable density, search/filter/sort and explicit customization.
5. Agree phone priorities and keyboard/accessibility behavior.
6. Prepare the bounded TailAdmin/Storybook implementation and screenshot plan
   for the chosen design; keep fixtures distinct from production functionality.

No grid library, backend integration, arbitrary business metadata or schema is
selected in this sequence. Current contracts are constraints for later checks,
not authorization to broaden another repo or claim implemented functionality.

## Proposed validation before accepting a table design

Use representative synthetic/redacted products and agreed tasks, with the current
customer process as a comparison where available. Include a merchant comfortable
with spreadsheets and someone who struggles with technology. Record task success,
time, mistakes, assistance and confidence rather than inventing an advantage.

Candidate tasks: find an item, compare relevant attributes across several items,
perform the agreed repeated update, recover from an invalid value and resume after
filter/detail navigation. Check keyboard and phone paths. No numerical success
threshold or completed user study is claimed.

Include truthful edge cases: duplicate names, leading-zero identifiers, measured
units/decimals, no stock record versus zero, permission-dependent columns/actions,
empty versus failed search and draft versus confirmed/uncertain changes. Data
that is unavailable or deferred must not be invented to fill a column.

## Verification scope for this research step

Native OpenSpec validation, formatting, local links, exact source-snapshot checks
and a documentation-only diff are appropriate. App builds and new screenshots
would not validate this research. Preserve the current visual source fingerprint
and accepted references. No code, staging, commit or archive is part of this step.

Research checkpoint on 2026-11-13, before the PT-001 selection: all seven OpenSpec
changes passed strict native validation with no discovery specification deltas. Formatting
and 42 local Markdown links/anchors pass. All eight recorded supporting-source
hashes match their snapshot. Exactly eight documentation files are changed/new;
app/catalogue source, visual inventory/references and dependencies are unchanged.
HEAD remains `f365765`, the index is empty and the visual freshness check retains
source hash `2c94c3155971b9efa39ffc9b265c65b9067ca71df04c05eca1b2f8d728feb040`.
App builds/code/browser tests were not rerun for this documentation-only step.
The research and alternatives are ready for the user's interaction-direction
choice; validation does not accept the proposed design.

After the PT-001 selection, all seven changes pass strict native validation with
the new Products-table delta. Formatting, 42 local links and the diff check pass.
Nine documentation files are changed/new, with the index empty and application,
visual, dependency and accepted-reference sources unchanged. The next information
boundary is presented as a proposal; no UI is implemented.
