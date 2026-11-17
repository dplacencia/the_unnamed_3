# Products table

## ADDED Requirements

### Requirement: PT-001 — Table-first with editing on request

The Products experience SHALL use a table for browsing and comparison. Editing
SHALL require a deliberate user action, with faster tools available on request
rather than required for everyday browsing. This direction SHALL NOT by itself
select columns, editable fields, activation/save/bulk behavior, permissions,
persistence or implementation.

#### Scenario: A merchant opens the Products table

- **WHEN** the merchant opens the table for ordinary browsing and comparison
- **THEN** they can inspect records without first entering an editing workflow
- **AND** inspecting a value does not by itself change its business data.

#### Scenario: A merchant requests editing or faster tools

- **WHEN** the merchant deliberately requests editing or faster work controls
- **THEN** those follow their separately defined behavior and access rules
- **AND** requesting a richer interface does not grant editing authority.

#### Scenario: Detailed table design follows the direction choice

- **WHEN** columns, editing, saving, bulk work or persistence are proposed
- **THEN** they remain subject to their own concrete user decisions
- **AND** this interaction choice is not treated as implementation authorization.

### Requirement: PT-002 — Catalogue with optional read-only stock context

The Products table SHALL offer optional read-only recorded-stock information for
one clearly selected location. This context SHALL remain distinct from editable
product details and stock-changing actions. PT-003 defines the initial columns;
PT-004 defines default visibility and its toggle; PT-005 defines per-tab retention
and location defaults. Implementation and further table behavior require separate decisions.

#### Scenario: A merchant requests stock context

- **WHEN** the merchant displays authorized recorded stock in the Products table
- **THEN** its single selected location is clearly identified
- **AND** the displayed stock is read-only and retains its known meaning and state.

#### Scenario: Catalogue editing is activated

- **WHEN** the merchant activates supported product-detail editing
- **THEN** the stock context remains read-only
- **AND** requesting editing does not authorize an implicit stock overwrite.

#### Scenario: Detailed presentation follows the context choice

- **WHEN** default visibility, columns or location-preference behavior is defined
- **THEN** it follows its separate concrete decision and existing domain constraints
- **AND** the optional-context choice does not imply a guessed location or aggregated stock.

### Requirement: PT-003 — Initial column set

The initial Products table column set SHALL be Producto, Referencia (SKU) and
Unidad, adding Existencias registradas when the optional stock context is shown.
This selection SHALL NOT decide initial stock visibility, additional optional
columns, responsive prioritization, density, editing behavior or implementation.

#### Scenario: Catalogue information is displayed without stock context

- **WHEN** the initial catalogue column set is displayed without stock context
- **THEN** its columns are Producto, Referencia (SKU) and Unidad
- **AND** this scenario does not select whether stock is hidden by default.

#### Scenario: Stock context is displayed

- **WHEN** authorized stock context is shown for one clearly selected location
- **THEN** Existencias registradas is added to the initial catalogue column set
- **AND** the stock context remains read-only under PT-002.

#### Scenario: Further table behavior is proposed

- **WHEN** additional columns, display controls or editing behavior are proposed
- **THEN** they follow their separate concrete decisions and domain constraints
- **AND** the column-set choice does not supply missing business values or permissions.

### Requirement: PT-004 — Stock context on request

The Products table SHALL default to the catalogue columns, with a labelled
Mostrar existencias toggle that reveals the read-only stock column and location
selector. Turning the toggle off SHALL hide that stock context. PT-005 defines
remembering the choice and location defaults. Responsive layout and implementation
remain subject to separate decisions.

#### Scenario: The default presentation is used

- **WHEN** the Products table uses its default presentation
- **THEN** it shows Producto, Referencia (SKU) and Unidad
- **AND** stock context is available on request through Mostrar existencias.

#### Scenario: A merchant requests stock context

- **WHEN** the merchant turns on Mostrar existencias
- **THEN** the table reveals Existencias registradas and its location selector
- **AND** stock remains read-only and scoped to one clearly selected location under PT-002.

#### Scenario: A merchant hides stock context

- **WHEN** the merchant turns off Mostrar existencias
- **THEN** the stock column and location selector are hidden
- **AND** hiding the context does not change product or stock records.

#### Scenario: Retention and location behavior use their dedicated decision

- **WHEN** remembering the toggle or choosing a location is specified
- **THEN** it follows PT-005 and existing scope principles
- **AND** this presentation choice does not establish a storage policy or new access rights.

### Requirement: PT-005 — Per-tab stock context and page-owned location

Products SHALL remember stock visibility and its page-owned location while the
tab stays open, retaining the location when stock is hidden. New tabs SHALL start
catalogue-only. Initial viewing scope SHALL apply the sole-location and
multiple-location rules of NAV-009. Remembering SHALL NOT establish continued
access or validity. Storage mechanism and implementation remain unspecified.

#### Scenario: A merchant returns to Products in the same tab

- **WHEN** the merchant returns to Products while the same tab remains open
- **THEN** its stock visibility and selected location are remembered
- **AND** its location choice does not implicitly change another Inventory page.

#### Scenario: Stock is hidden and shown again

- **WHEN** the merchant hides stock and then shows it again in the same tab
- **THEN** Products retains its selected location when still valid and accessible
- **AND** the selected scope is visible alongside the stock context.

#### Scenario: A sole accessible location is known

- **WHEN** stock needs an initial location and exactly one accessible location is known
- **THEN** Products selects that location automatically
- **AND** stock remains read-only with its scope clearly identified.

#### Scenario: Several locations require a choice

- **WHEN** several accessible locations exist and Products has no valid selected location
- **THEN** it asks for a location before showing quantities
- **AND** it does not guess a location or aggregate their stock.

#### Scenario: A new tab starts

- **WHEN** Products is opened in a new tab
- **THEN** it starts with the catalogue columns and no remembered Products location choice
- **AND** closing the previous tab ends its stock-context retention.

#### Scenario: A remembered location is considered

- **WHEN** a remembered location would be used to display stock
- **THEN** remembering it is not treated as proof of current access or validity
- **AND** an unresolved or failed check is not presented as confirmed stock or a confirmed lack of access.

### Requirement: PT-006 — Compact default and optional comfortable density

The Products table SHALL use compact rows by default and offer a merchant-selected
comfortable density. Both SHALL preserve readable text and appropriate touch
targets. Exact row measurements SHALL be compared in Storybook before being
settled. PT-012 defines retention and PT-013 control grouping. Exact controls,
mobile layout, visual references and implementation remain separate decisions.

#### Scenario: The default table density is used

- **WHEN** Products uses its default density
- **THEN** its rows use the compact presentation
- **AND** readable text and appropriate interaction targets are preserved.

#### Scenario: A merchant chooses comfortable density

- **WHEN** the merchant explicitly chooses comfortable density
- **THEN** the table offers the roomier presentation
- **AND** density changes do not change business values, available records or access rights.

#### Scenario: Exact sizing is proposed

- **WHEN** concrete row heights and padding are proposed
- **THEN** compact and comfortable presentations are compared in Storybook
- **AND** this direction choice does not accept screenshots or settle mobile layout.

### Requirement: PT-007 — One product search field

The Products table SHALL provide one labelled Buscar productos field for
partial-name discovery and exact SKU/barcode lookup. It SHALL preserve identifiers,
including leading zeros, and show matching products without automatic product
selection. PT-008 defines submission/clearing and PT-009 the initial sorting.
PT-010–011 define filters and PT-012 query retention. Detailed matching rules,
ranking and implementation remain separate decisions.

#### Scenario: A merchant finds products

- **WHEN** the merchant searches by a partial name or exact SKU/barcode
- **THEN** the search uses the single Buscar productos field
- **AND** applicable matches are presented without automatically choosing a product.

#### Scenario: An identifier contains leading zeros

- **WHEN** the merchant enters an identifier such as a leading-zero barcode
- **THEN** its exact characters are preserved
- **AND** search does not silently turn the code into a number or substitute a guessed code.

#### Scenario: Detailed search behavior is proposed

- **WHEN** matching, search triggers, ordering or integration is defined
- **THEN** it follows separately recorded decisions and current domain constraints
- **AND** the one-field choice does not establish an available API or a matching/ranking policy.

### Requirement: PT-008 — Explicit search submission and scoped clearing

Products SHALL run a search on Enter or activation of a visible Buscar button,
keeping current rows steady while the query is typed. A clear action SHALL remove
only the search constraint, preserving stock visibility and selected location.
Unsubmitted text SHALL NOT be presented as a completed search. PT-009 defines the
initial sort. Detailed matching/ordering, result/error presentation and integration
remain separate decisions.

#### Scenario: A merchant types a search query

- **WHEN** the merchant edits the search field without submitting it
- **THEN** typing alone does not run a search or change the current result rows
- **AND** the draft query is not represented as having produced those rows.

#### Scenario: A merchant submits a search

- **WHEN** the merchant presses Enter or activates Buscar
- **THEN** Products runs the explicitly submitted search
- **AND** running it does not itself choose a product or change business data.

#### Scenario: A merchant clears search

- **WHEN** the merchant activates the clear-search action
- **THEN** the search constraint is removed
- **AND** stock visibility and the selected location are preserved.

#### Scenario: Detailed result handling is designed

- **WHEN** loading, results, errors or matching behavior are specified
- **THEN** they follow their separately recorded decisions and honest-status principles
- **AND** the trigger choice does not imply completed results or an available search integration.

### Requirement: PT-009 — Initial single-column sorting

Products SHALL start in Producto A–Z order and offer ascending/descending sorting
through Producto and Referencia (SKU) headings, with one active sort column at a
time. SKU SHALL remain text. Sorting SHALL apply to the full matching result set.
PT-012 defines sort retention. Unit/stock and multi-column sorting, collation,
tie-breaking and implementation remain separate decisions.

#### Scenario: The initial ordering is used

- **WHEN** Products uses its initial sort
- **THEN** the ordering is Producto A–Z
- **AND** sorting does not alter product names or make them unique identities.

#### Scenario: A merchant sorts a selected heading

- **WHEN** the merchant activates Producto or Referencia (SKU) to change ordering
- **THEN** that heading controls ascending/descending ordering
- **AND** only one column is active as the selected sort at a time.

#### Scenario: SKU values are ordered

- **WHEN** Referencia (SKU) is used to sort
- **THEN** SKU remains a text identifier with its exact characters preserved
- **AND** it is not converted into a number or stripped of leading zeros.

#### Scenario: Results span more than the visible rows

- **WHEN** sorting is applied to a matching result set
- **THEN** the requested order covers that full result set
- **AND** sorting only the current viewport or loaded page is not represented as sorting all results.

#### Scenario: Further ordering is proposed

- **WHEN** unit/stock sorting, multiple sort columns or detailed collation is proposed
- **THEN** it follows its own concrete decision and applicable quantity/identity meaning
- **AND** this initial sort choice does not establish backend sorting support.

### Requirement: PT-010 — Initial optional filters

Products SHALL offer Incluir archivados and, with selected-location stock context,
Solo con existencias registradas under Filtros. Defaults SHALL exclude archived
products and retain eligible zero/no-record products. Stock-only SHALL use
positive recorded on-hand in the configured reservation dimension under the
owning Inventory rules. PT-011 defines interaction and PT-012 applied-filter
retention. Quantity presentation and implementation remain separate decisions.

#### Scenario: Default catalogue results are shown

- **WHEN** neither optional filter is selected
- **THEN** archived products are excluded under current domain authority
- **AND** an eligible product is not excluded merely for recorded zero or an absent stock record.

#### Scenario: A merchant requests filters

- **WHEN** the merchant opens Filtros
- **THEN** Incluir archivados is offered
- **AND** Solo con existencias registradas is offered with stock context for a selected location.

#### Scenario: Archived products are explicitly included

- **WHEN** the merchant requests authorized archived inclusion
- **THEN** applicable archived products can be included under current identifier assignments
- **AND** inclusion does not reactivate a product or recover historical code ownership.

#### Scenario: Positive recorded stock is filtered

- **WHEN** Solo con existencias registradas is evaluated at the selected location
- **THEN** its condition is positive recorded on-hand in the product's configured reservation dimension
- **AND** holds or allocations do not turn that recorded-stock condition into available-to-sell.

#### Scenario: Stock states differ

- **WHEN** the stock-only condition is evaluated with known stock data
- **THEN** zero, negative recorded balances and no record do not satisfy it
- **AND** failures or unresolved reads are not reinterpreted as zero or a confirmed negative result.

#### Scenario: Detailed filter behavior is proposed

- **WHEN** application, clearing, context switching or retained preferences are designed
- **THEN** they follow their own recorded decisions and current domain meaning
- **AND** this filter-set choice does not establish an available production search interface.

### Requirement: PT-011 — Explicit filter application and scoped clearing

Filters SHALL use Aplicar/Cancelar; closing without applying SHALL discard drafts.
Applied filters SHALL have removable labels. Limpiar filtros SHALL restore filter
defaults, preserving search, sort and stock/location settings. Hiding stock SHALL
clear its stock-only filter until explicitly selected again. PT-012 defines
applied-filter retention. Exact placement, styling and implementation remain
separate decisions.

#### Scenario: A merchant edits filters in the panel

- **WHEN** the merchant changes filter choices before activating Aplicar
- **THEN** those choices remain a draft and do not alter the applied filter state
- **AND** Aplicar applies the draft choices to the list.

#### Scenario: A merchant cancels or closes without applying

- **WHEN** the merchant activates Cancelar or closes the panel without Aplicar
- **THEN** draft filter changes are discarded
- **AND** the previously applied filters remain in effect.

#### Scenario: Applied filters are inspected or removed

- **WHEN** filters are applied
- **THEN** they are shown as removable labels outside the closed panel
- **AND** removing one label clears that filter while preserving other controls and filters.

#### Scenario: A merchant clears filters

- **WHEN** the merchant activates Limpiar filtros
- **THEN** the filters return to their defaults
- **AND** search, sort, density, stock visibility and selected location are preserved.

#### Scenario: Stock context is hidden

- **WHEN** the merchant hides stock context
- **THEN** its stock-only filter is cleared from draft and applied state
- **AND** showing stock again leaves that filter off until the merchant explicitly selects it.

#### Scenario: Further filter presentation or retention is proposed

- **WHEN** placement, styling, retention or implementation is proposed
- **THEN** it follows its own recorded decision and existing authority
- **AND** accepting these interaction rules does not approve visual references or business-data edits.

### Requirement: PT-012 — Applied view retained per tab

Products SHALL remember submitted search, selected sort, applied filters and
chosen density per tab within the same business. Returning SHALL restore these
controls; new tabs SHALL use defaults. Unsubmitted search/filter drafts SHALL be
discarded when leaving Products. PT-005 stock/location retention remains unchanged.
Business-edit drafts, refresh strategy, scroll position, storage mechanism and
implementation remain separate decisions.

#### Scenario: A merchant returns in the same tab and business

- **WHEN** the merchant returns to Products in the same tab and business
- **THEN** its submitted query, selected sort, applied filters and density are restored
- **AND** stock visibility and location continue to follow PT-005.

#### Scenario: A new tab opens Products

- **WHEN** Products is opened in a new tab
- **THEN** the four view controls use their initial defaults
- **AND** this retention does not establish cross-tab or long-term preferences.

#### Scenario: A merchant leaves with view drafts

- **WHEN** the merchant leaves Products with unsubmitted search or filter drafts
- **THEN** those drafts are discarded rather than restored as applied choices
- **AND** this rule does not define how product-edit drafts are saved or discarded.

#### Scenario: Restored controls are used

- **WHEN** a submitted query or other view control is restored
- **THEN** restoration does not establish current data, successful retrieval or access
- **AND** honest result states and existing current-authority rules continue to apply.

#### Scenario: Further state behavior is proposed

- **WHEN** scroll position, business switching, refresh or storage is specified
- **THEN** it follows its own recorded decision
- **AND** this view-retention choice does not select an implementation or integration.

### Requirement: PT-013 — On-request column customization in Vista

Vista SHALL group density and optional column visibility/order/width controls.
Choices SHALL be retained per tab within the same business. Producto SHALL stay
included and stock visibility SHALL follow Mostrar existencias. Restablecer
columnas SHALL restore agreed column defaults while preserving other table
controls. PT-016 defines the phone table model. Exact controls, sizing,
responsive details, hidden-sort behavior and implementation remain separate decisions.

#### Scenario: A merchant opens customization

- **WHEN** the merchant requests Vista
- **THEN** density and column visibility, order and width controls are available
- **AND** the agreed initial columns remain the default rather than requiring customization.

#### Scenario: A merchant changes column visibility

- **WHEN** the merchant chooses which selected columns to include
- **THEN** Producto remains included
- **AND** Mostrar existencias continues to control stock-context visibility under PT-004–005 and PT-011.

#### Scenario: A merchant changes column order or width

- **WHEN** the merchant deliberately changes a column's order or width
- **THEN** the choice changes the table presentation
- **AND** it does not create a business field, change a value or alter access rights.

#### Scenario: A merchant returns in the same tab and business

- **WHEN** the merchant returns to Products in that tab and business
- **THEN** column visibility, order and width choices are remembered
- **AND** a new tab starts with the agreed column defaults.

#### Scenario: A merchant restores columns

- **WHEN** the merchant activates Restablecer columnas
- **THEN** column visibility, order and width return to their agreed defaults
- **AND** search, sort, filters, density and stock/location context are preserved.

#### Scenario: Detailed customization behavior is proposed

- **WHEN** exact controls, hiding a sorted column or responsive behavior is designed
- **THEN** it follows its own recorded decision and existing presentation rules
- **AND** this scope choice does not select a grid library, extra field or visual reference.

### Requirement: PT-014 — Read-only product details panel

Activating a product's name SHALL open read-only details in a desktop side panel
and a panel filling the phone screen. Closing SHALL preserve table settings.
Editing SHALL require a separate explicit action. Detail contents, panel size
and modality, tablet behavior, focus/dismissal, history, scroll restoration,
refresh, edit fields/save semantics and implementation remain separate decisions.

#### Scenario: A merchant opens product details

- **WHEN** the merchant activates a product's name
- **THEN** read-only details open for that product in the device's selected panel form
- **AND** inspecting the product does not activate editing or change business data.

#### Scenario: Several products share a name

- **WHEN** the merchant activates one product's name among matching names
- **THEN** details refer to that row's product identity
- **AND** a name is not treated as a unique lookup key or permission to choose another product.

#### Scenario: A merchant uses a phone

- **WHEN** the merchant opens product details on a phone
- **THEN** the read-only panel fills the screen
- **AND** this choice does not independently select tablet breakpoints or desktop panel dimensions.

#### Scenario: A merchant closes details

- **WHEN** the merchant closes the details panel
- **THEN** submitted search, sorting, applied filters, density and column choices are preserved
- **AND** stock visibility and selected location retain their existing rules.

#### Scenario: A merchant requests editing

- **WHEN** editing is requested from product inspection
- **THEN** it requires its separately defined explicit action and current authority
- **AND** the panel choice does not define editable fields, saving or an available update API.

### Requirement: PT-015 — All active stock measurements in the cell

Recorded-stock cells SHALL show every actively tracked measurement with its
configured unit, main/reservation dimension first. Values SHALL remain exact.
Quantities needing verification SHALL be visibly marked and unknown quantities
SHALL remain unknown. Detailed formatting, status labels/icons, missing/error
rendering, wrapping/widths and implementation remain separate decisions.

#### Scenario: A product tracks one measurement

- **WHEN** authorized recorded stock has one active tracked measurement
- **THEN** the stock cell shows its exact quantity and configured unit
- **AND** no secondary measurement is invented.

#### Scenario: A product tracks two independent measurements

- **WHEN** recorded stock has active main weight and secondary piece measurements
- **THEN** both appear in the same cell with their units, main measurement first
- **AND** a presentation such as 5 kg · 12 uds. does not infer a ratio between them.

#### Scenario: A tracked quantity needs verification

- **WHEN** an active recorded quantity is known to need verification
- **THEN** that condition is visibly identified with its measurement
- **AND** the value is not presented as physically certified stock.

#### Scenario: An active quantity is unknown

- **WHEN** a tracked quantity is unknown
- **THEN** it remains visibly unknown
- **AND** it is not filled with zero or a value inferred from another dimension.

#### Scenario: Stock states differ

- **WHEN** stock has recorded zero, a negative balance, no record or a failed read
- **THEN** the distinct known state is preserved
- **AND** presentation does not round, guess or reinterpret a quantity to fill the cell.

#### Scenario: Secondary tracking is disabled

- **WHEN** a measurement is no longer actively tracked
- **THEN** its last historical value is not shown as a current stock measurement
- **AND** this presentation rule does not erase its history.

### Requirement: PT-016 — Full phone table with pinned product identity

Phones SHALL retain the selected table with horizontal scrolling, a sticky column
header and Producto pinned left. Other columns SHALL preserve chosen visibility
and relative order. Phone presentation SHALL preserve Producto's saved desktop
position and other column choices. Breakpoints, widths/caps, wrapping, touch and
keyboard controls, desktop/tablet scrolling and implementation remain separate
decisions.

#### Scenario: A merchant uses Products on a phone

- **WHEN** the merchant views the selected table on a phone
- **THEN** its selected columns remain available through horizontal scrolling
- **AND** Producto stays pinned left while the table's column header stays sticky.

#### Scenario: A merchant customized the columns

- **WHEN** the phone table renders customized columns
- **THEN** other columns keep their chosen visibility and relative order
- **AND** pinning Producto does not overwrite its saved desktop position or other choices.

#### Scenario: Stock context is displayed on a phone

- **WHEN** stock is requested for a selected location
- **THEN** its active measurements retain PT-015's exact quantity/unit/status meaning
- **AND** the phone model does not silently reduce the stock cell to only its main measurement.

#### Scenario: A merchant returns to the desktop presentation

- **WHEN** the table returns from phone to desktop presentation
- **THEN** the saved desktop column choices remain intact
- **AND** phone pinning has not reset the merchant's applied view controls.

#### Scenario: Detailed responsive behavior is proposed

- **WHEN** breakpoints, pinned widths, responsive caps or touch/keyboard controls are designed
- **THEN** they follow their separately recorded decisions and readability requirements
- **AND** this model choice does not settle pixel measurements, tablet behavior or implementation.

### Requirement: PT-017 — Panel and optional table editing paths

Products SHALL offer Editar in the product panel and optional Editar tabla for
repeated catalogue changes. Both SHALL require deliberate activation, start as
drafts and offer explicit Guardar/Cancelar. Stock SHALL remain read-only.
Editable fields, permissions, save outcomes, multi-row behavior, validation,
concurrent/unsaved drafts, responsive controls and implementation remain separate
decisions.

#### Scenario: A merchant requests an individual edit

- **WHEN** the merchant explicitly requests Editar in the product panel
- **THEN** the defined individual-product editing flow begins with a draft
- **AND** merely inspecting a product remains read-only under PT-014.

#### Scenario: A merchant requests repeated catalogue editing

- **WHEN** the merchant deliberately activates Editar tabla
- **THEN** the optional table-editing mode begins with drafts
- **AND** ordinary browsing does not require that mode.

#### Scenario: View controls are used

- **WHEN** the merchant uses search, filters, density or column customization
- **THEN** those actions do not activate business-data editing
- **AND** requesting editing does not itself grant permission to change data.

#### Scenario: Editing controls are presented

- **WHEN** either defined editing path is active
- **THEN** explicit Guardar and Cancelar actions are available for its defined draft scope
- **AND** stock context remains read-only.

#### Scenario: A save is requested

- **WHEN** the merchant activates Guardar
- **THEN** saving follows its separately defined scope and outcome rules
- **AND** pressing the control alone is not proof of a completed or atomic business write.

#### Scenario: Detailed editor behavior is proposed

- **WHEN** fields, validation, multiple rows or draft lifecycle behavior is designed
- **THEN** it follows its own recorded decision and applicable business rules
- **AND** this path selection does not establish an update API, rollback guarantee or implementation.

### Requirement: PT-018 — Selected TanStack Table foundation

Products SHALL use TanStack Table with retained TailAdmin controls and styling.
`@tanstack/react-table` SHALL be pinned exactly to `9.3.1`, verified as the latest
stable release on 2026-11-13. This selection SHALL preserve PT-001–017, the
approved application state/form stack and exact business meanings. It SHALL NOT
adopt other ecosystem packages or undefined product behavior.

#### Scenario: The foundation is installed

- **WHEN** the selected table foundation is registered in the backoffice
- **THEN** its runtime manifest and lock identify the exact 9.3.1 release
- **AND** installation retains the release waiting period and blocked-script policy.

#### Scenario: Table design continues

- **WHEN** the selected engine is used for the Products design
- **THEN** TailAdmin controls and the approved business/interaction rules remain applicable
- **AND** the engine does not select editable fields, save outcomes, an API or other TanStack packages.

### Requirement: PT-019 — Compact expansion with retained details panel

Products SHALL offer an explicitly requested compact read-only summary beneath
its row, retaining PT-014's full details panel and PT-017's deliberate editing
paths. Expansion SHALL NOT itself edit data, imply a child-product hierarchy or
replace the panel. PT-020 defines summary content; PT-021 defines initial/open
behavior. Exact dimensions, lifecycle and further mechanics remain separate.

#### Scenario: A product summary is requested

- **WHEN** a merchant expands a product row
- **THEN** a compact read-only summary appears beneath that product
- **AND** product-name activation and the full-details action retain the details-panel path.

#### Scenario: A summary is inspected

- **WHEN** summary content is read or the full panel is opened
- **THEN** no business value changes or editing mode begins implicitly
- **AND** presentation does not invent parent/child relationships from names or codes.

### Requirement: PT-020 — Summary identifiers, status and hidden catalogue fields

The compact summary SHALL show supported barcode(s), active/archived status,
catalogue fields hidden through Vista and Abrir detalles. Hidden fields SHALL
refer only to selected catalogue information. Codes SHALL remain exact and
stock SHALL retain its selected visibility, location and quantity/status rules.
This SHALL NOT add metadata, package management or new read capabilities.

#### Scenario: A merchant expands a row with hidden catalogue columns

- **WHEN** a selected catalogue column such as SKU or Unidad is hidden through Vista
- **THEN** its available information appears in the requested summary
- **AND** visible catalogue columns need not be duplicated there.

#### Scenario: Identifier and lifecycle information is presented

- **WHEN** supported barcodes and active/archived status are shown
- **THEN** exact codes and their supported associations are preserved, including multiple codes
- **AND** missing or unavailable information is not replaced with fabricated values or status.

#### Scenario: Stock is hidden or unscoped

- **WHEN** the merchant has not requested stock or selected its applicable location
- **THEN** summary expansion does not silently reveal stock or guess a location
- **AND** this content choice does not add stock-changing actions.

### Requirement: PT-021 — Independent requested row expansion

Product rows SHALL start collapsed. Merchants SHALL explicitly open each compact
summary, and several summaries SHALL be allowed open simultaneously. Opening one
SHALL NOT close another automatically. This choice SHALL NOT define expansion
retention across filtering/navigation, draft lifecycle or multi-product actions.

#### Scenario: The initial table is opened

- **WHEN** the initial Products table is presented
- **THEN** its summaries start collapsed
- **AND** opening a summary requires the merchant's explicit action.

#### Scenario: Products are compared through their summaries

- **WHEN** the merchant expands another product while a summary is open
- **THEN** both requested summaries can remain open
- **AND** each may be closed independently without changing business data.

### Requirement: PT-022 — Initial catalogue editing field and action scope

The first catalogue editor SHALL allow product-name changes and explicit SKU
assignment only for products with no SKU assigned, through both PT-017 editing
paths. Existing SKU replacement, barcode maintenance and unit changes SHALL
remain outside this first editor. Stock SHALL remain read-only. This field/action
choice SHALL NOT establish validation, save semantics, a production write
interface or UI implementation.

#### Scenario: A merchant deliberately edits a product name

- **WHEN** the merchant uses either selected editing path for a product
- **THEN** the first editor allows a product-name change as a draft
- **AND** the presentation name does not replace the permanent product identity.

#### Scenario: A product has no assigned SKU

- **WHEN** the merchant explicitly requests SKU assignment for a product without one
- **THEN** the first editor supports preparing that assignment through either selected path
- **AND** omission does not create an automatic SKU or an assignment deadline.

#### Scenario: A product already has an assigned SKU

- **WHEN** the merchant edits that product in the first editor
- **THEN** its existing SKU is not offered as a general replacement field
- **AND** the editor does not infer code retirement or remapping operations.

#### Scenario: Other catalogue and stock values are inspected during editing

- **WHEN** the first editor displays barcodes, units or stock context
- **THEN** it does not allow barcode maintenance, unit changes or stock writes
- **AND** any later extension requires its own design decision and supported operation.

### Requirement: PT-023 — Shared table save with individual truthful outcomes

Table editing SHALL offer one Guardar cambios action for edited products and
show clear results per product. Only confirmed changes SHALL count as saved.
Failed or unconfirmed changes SHALL retain their drafts. This interaction SHALL
NOT promise that all products save or fail together. Validation before submission,
detailed mixed/uncertain outcomes, retry and draft lifecycle remain separate.

#### Scenario: Several products have requested draft changes

- **WHEN** the merchant requests saving from Editar tabla
- **THEN** one Guardar cambios action covers the edited products
- **AND** results remain individually attributable rather than one assumed batch success.

#### Scenario: Some changes are confirmed and others fail

- **WHEN** a save produces confirmed changes and failed changes
- **THEN** only confirmed changes count as saved
- **AND** failed changes keep their drafts and are distinguishable in the results.

#### Scenario: A change's result is unconfirmed

- **WHEN** the interface cannot confirm whether a requested change succeeded
- **THEN** it does not mark that change saved or treat uncertainty as confirmed rejection
- **AND** it retains the draft without claiming that other confirmed changes were rolled back.

### Requirement: PT-024 — Detectable field errors block table submission

Before Guardar cambios sends any changes, the editor SHALL check all requested
drafts for detectable field errors. It SHALL show errors beside the relevant
fields and send nothing until those errors are corrected. This gate SHALL NOT
define new field-validity rules or guarantee acceptance after submission.

#### Scenario: A requested draft has a detectable field error

- **WHEN** the merchant requests saving with a detectable field error in any draft
- **THEN** the editor shows the error beside its field and preserves the drafts
- **AND** it sends none of the requested changes until the errors are corrected.

#### Scenario: Drafts pass the local field checks

- **WHEN** no detectable field error remains and the merchant requests saving
- **THEN** the local gate allows submission without claiming success in advance
- **AND** subsequent results retain PT-023's individual confirmed/failed/unconfirmed distinctions.

### Requirement: PT-025 — Guard in-app departure from unsaved editing

In-app departure from an editor with unsaved changes SHALL offer Guardar y salir,
Descartar cambios and Seguir editando. Guardar y salir SHALL leave only after all
requested changes are confirmed saved. This choice SHALL NOT define browser
closing/reload behavior, storage or the remaining draft-coordination policy.

#### Scenario: The merchant chooses to keep editing

- **WHEN** the merchant chooses Seguir editando in the in-app departure guard
- **THEN** the editor and its unsaved drafts remain available
- **AND** the requested departure does not discard or save them automatically.

#### Scenario: The merchant requests saving before leaving

- **WHEN** the merchant chooses Guardar y salir
- **THEN** departure occurs only after every requested change is confirmed saved
- **AND** validation errors, failures or unconfirmed outcomes keep the editor and remaining drafts available.

#### Scenario: The merchant explicitly discards unsaved changes

- **WHEN** the merchant chooses Descartar cambios in the departure guard
- **THEN** unsaved drafts are discarded and the requested in-app departure proceeds
- **AND** this does not claim to reverse already confirmed changes.

### Requirement: PT-026 — Reuse existing local name and SKU profiles

The first editor's local checks SHALL reuse Inventory's existing supplied-name
and supplied-SKU profiles: reject blank or prohibited input, preserve accepted
text exactly and apply limits of 1024 received UTF-8 bytes for names and 256 for
a supplied SKU. Existing fixed whitespace/control predicates SHALL retain their
meaning. This frontend choice SHALL NOT establish an update interface, change
the owning contract or claim authoritative SKU availability.

#### Scenario: A multibyte name or SKU is checked

- **WHEN** the editor validates a requested name or SKU assignment
- **THEN** its existing limit counts received UTF-8 bytes rather than characters
- **AND** it rejects overlength input without truncating or repairing it.

#### Scenario: Accepted text includes permitted surrounding spaces or leading zeros

- **WHEN** text passes the applicable existing profile
- **THEN** the editor preserves the accepted name or supplied SKU exactly
- **AND** matching transformations do not rewrite submitted content.

#### Scenario: An optional SKU is not being assigned

- **WHEN** a product has no SKU and the merchant has not requested assignment
- **THEN** local checks do not invent a required SKU or assignment deadline
- **AND** an explicitly requested invalid assignment remains subject to PT-024's gate.

### Requirement: PT-027 — Dismissible save-result presentation

The detailed Resultado del guardado presentation SHALL be dismissible. Dismissing
it SHALL change presentation only, preserving drafts and confirmed, failed or
unconfirmed outcomes. Dismissal SHALL NOT imply rollback, success or resolution
of an unconfirmed change. Current results SHALL remain available for inspection.

#### Scenario: The merchant dismisses a save result

- **WHEN** the merchant closes the detailed save-result message
- **THEN** its detailed presentation is hidden without changing business or draft state
- **AND** the last outcome remains distinguishable from a newly edited unsaved draft.

#### Scenario: A dismissed result includes an unconfirmed change

- **WHEN** an unconfirmed result's detailed presentation is dismissed
- **THEN** its uncertainty remains visible and its draft is preserved
- **AND** dismissal does not enable a submission that was paused awaiting resolution.

#### Scenario: A later save produces new results

- **WHEN** a later requested save completes with new results
- **THEN** the previous dismissal does not conceal that new result set
- **AND** the merchant may inspect the new results and dismiss their presentation separately.

### Requirement: PT-028 — Bounded unchanged retries with manual fallback

For supported idempotent mutations, the frontend SHALL make bounded automatic
recovery attempts using the original full identity and equivalent submitted
content under current authority and finite attempt deadlines. If confirmation
remains unavailable, it SHALL keep the unresolved result/draft and offer manual
retry of that same command. PT-025's explicit discard behavior remains applicable.

#### Scenario: A successful response is lost

- **WHEN** confirmation is lost for an operation covered by the supported retry guarantee
- **THEN** automatic recovery retries its unchanged original identity/content
- **AND** established committed effects are not repeated, and only authoritative results count as confirmed.

#### Scenario: The first attempt never arrived

- **WHEN** an unchanged recovery attempt is the first admitted attempt of that logical operation
- **THEN** it may perform the originally requested work under current authority and owning checks
- **AND** recovery is not represented as a guaranteed read-only check or eventual-success guarantee.

#### Scenario: Bounded recovery remains inconclusive

- **WHEN** automatic recovery ends without authoritative confirmation
- **THEN** the result remains visibly unconfirmed and its original submitted command and draft are preserved
- **AND** manual retry continues that same command rather than inventing a new operation identity or claiming rollback.

#### Scenario: Current input differs from the submitted command

- **WHEN** the interface holds newer edits alongside an unresolved original submission
- **THEN** recovery retains the original operation's identity and content rather than rebuilding it from newer input
- **AND** this rule does not select whether such editing is available or its remaining coordination policy.

#### Scenario: A later attempt is refused

- **WHEN** a recovery attempt is refused by its current authority or preflight checks
- **THEN** that refusal alone does not turn the earlier unknown outcome into confirmed failure
- **AND** existing drafts, established effects and protected result visibility retain their owning rules.

#### Scenario: A designed editor has no supported production operation

- **WHEN** the prototype includes a name or missing-SKU editor without an available corresponding production write
- **THEN** the retry direction does not claim that editor is integrated or that a new endpoint exists
- **AND** implementation and command mapping remain separately scoped work.

#### Scenario: Recovery scope remains bounded

- **WHEN** this recovery direction is developed further
- **THEN** numeric limits, backoff, storage, departure/discard coordination, concurrent editing, command grouping and production availability remain separately defined
- **AND** explicit draft discard does not undo confirmed effects or resolve the original unknown outcome.

### Requirement: PT-029 — Pause editing only for products with unresolved saves

While save outcomes remain unconfirmed, Products SHALL keep browsing and editing
other products available under their existing access rules. Products covered by
unresolved commands SHALL remain read-only, preserving their original submitted
commands for PT-028 recovery. This choice SHALL NOT select submission of new
drafts during recovery, command grouping, storage or production write availability.

#### Scenario: One product has an unresolved save

- **WHEN** a product is covered by a command with an unconfirmed outcome
- **THEN** that product remains read-only while its original command is preserved for recovery
- **AND** the merchant may still browse the table and edit other permitted products.

#### Scenario: A save result is dismissed

- **WHEN** the merchant dismisses the detailed presentation of an unresolved save
- **THEN** that product's read-only protection and visible uncertainty remain
- **AND** other products do not become paused because the presentation was closed.

#### Scenario: The merchant edits another product

- **WHEN** a permitted product is not covered by an unresolved command
- **THEN** unrelated uncertainty does not itself prevent editing that product
- **AND** sending its new draft follows the separately defined save-coordination behavior.

### Requirement: PT-030 — Submit other editable products during recovery

Guardar cambios SHALL permit submitting unsaved edits from other editable
products while earlier operations remain unconfirmed. Original recovery commands
SHALL continue separately, and previously confirmed changes SHALL NOT be resent
as part of the new submission. PT-024's all-draft validation gate SHALL apply to
the complete newly requested submission. This choice SHALL NOT define command
grouping, batch atomicity, persistence or production interface availability.

#### Scenario: Other products have new unsaved edits

- **WHEN** the merchant requests saving eligible edits while other products have unresolved operations
- **THEN** the new requested submission may proceed under its existing validation and access rules
- **AND** it neither changes the unresolved original commands nor sends previously confirmed changes again.

#### Scenario: The new requested submission has a detectable field error

- **WHEN** any draft requested for that new save has a detectable field error
- **THEN** PT-024 prevents that new submission until its errors are corrected
- **AND** the validation result does not alter the earlier operations or their recovery outcomes.

#### Scenario: Results from different submissions coexist

- **WHEN** an earlier recovery and a later save both have results or unresolved states
- **THEN** each remains attributable to its own submitted operation and product
- **AND** the newer result does not conceal or overwrite the earlier uncertainty.

### Requirement: PT-031 — Restore unresolved operation records with explicit resumption

Where persistent retention is usable, original unconfirmed-operation records
SHALL survive refresh/reopening in the same browser/business/user scope. On
return, recovery SHALL require explicit request using the original command.
Restoration SHALL use accessible retained copies under PT-036; reopening SHALL
NOT send mutations. Unsent drafts, storage details, clearing/logout, cross-tab
coordination and cross-device restoration remain separate.

#### Scenario: The merchant returns to unresolved submitted work

- **WHEN** the same user returns to that business in the same browser after refresh or reopening with retained operation copies accessible
- **THEN** retained unresolved operation records and their uncertainty are offered for recovery
- **AND** reopening alone does not restart mutation attempts.

#### Scenario: The merchant requests continued recovery

- **WHEN** the merchant explicitly chooses to continue a restored recovery
- **THEN** PT-028 uses the original full operation identity and submitted content under current authority
- **AND** it does not create a new logical operation or infer completion from current product values.

#### Scenario: Other scope or unsent edits are present

- **WHEN** the current business/user scope differs, or edits have never been submitted
- **THEN** this selected restoration rule does not import another scope's recovery record or define unsent-draft behavior
- **AND** browser storage availability is not represented as a cross-device durability guarantee.

### Requirement: PT-032 — Retain unsent drafts and restore them on request

Where persistent retention is usable, unsent drafts SHALL survive refresh and
reopening in the same browser/business/user scope. Products SHALL return read-only
with continuing/discarding offered; editing requires explicit request and sending
those drafts requires Guardar. Restoration SHALL use accessible copies under
PT-036 and remain separate from submitted recovery. Storage implementation,
expiry, logout and cross-tab coordination remain separate.

#### Scenario: The merchant returns to an unsent draft

- **WHEN** the same user returns to that business in the same browser after refresh or reopening with a retained unsent draft accessible
- **THEN** the retained never-submitted draft can be continued or discarded on request
- **AND** its existence does not automatically activate editing or send its contents.

#### Scenario: The merchant continues the draft

- **WHEN** the merchant explicitly chooses to continue a retained unsent draft
- **THEN** the selected restoration and editing rules apply
- **AND** saving still requires Guardar and its existing validation/access rules.

#### Scenario: The merchant discards an unsent draft

- **WHEN** the merchant explicitly discards a never-submitted draft
- **THEN** that draft is abandoned without a business write
- **AND** separate submitted-operation records, effects and uncertainty are not erased or resolved by that action.

### Requirement: PT-033 — Review changed products when restoring unsent drafts

Unsent-draft restoration SHALL load the product's current data and require review
when it differs from the draft's original baseline. It SHALL show current values
beside the draft and SHALL NOT automatically merge or overwrite them. An unchanged
product SHALL NOT require that extra review step. This selection SHALL NOT change
submitted-command immutability or choose comparison fields, a versioning mechanism
or a guarantee against changes after the restoration read.

#### Scenario: Current data differs from the unsent draft's baseline

- **WHEN** loaded current product data differs from the baseline of a restored unsent draft
- **THEN** the current values and draft are shown for review before the restored draft is saved
- **AND** no automatic merge or overwrite resolves the difference.

#### Scenario: Current data is unchanged

- **WHEN** loaded current product data matches the unsent draft's original baseline
- **THEN** the draft can continue under its ordinary editing rules without an extra changed-data review
- **AND** this does not bypass validation, authority or later save outcomes.

#### Scenario: Current data cannot be established

- **WHEN** current product data is unavailable during restoration
- **THEN** the interface does not claim that it matches the original baseline
- **AND** uncertainty is not used to bypass the changed-data review rule.

#### Scenario: A submitted command is being recovered

- **WHEN** a record represents an already submitted unresolved command rather than an unsent draft
- **THEN** recovery retains its original identity and content under PT-028 and PT-031
- **AND** restoration review does not rebuild that command from current product values.

### Requirement: PT-034 — Initial bounded frontend retry profile

The initial frontend recovery profile SHALL allow three attempts total, including
the original request, with a 15-second client timeout per attempt. Waits before
retries SHALL be 1 then 3 seconds, randomized by ±50%. Frontend attempts of the
same command SHALL NOT be deliberately concurrent. Inconclusive exhaustion SHALL retain
uncertainty under PT-028. PT-038 defines manual-run budgets; real-API qualification
remains separate. No completion or rollback guarantee is selected.

#### Scenario: The initial request needs recovery

- **WHEN** a supported command requires automatic recovery from uncertainty
- **THEN** the original request counts as attempt one and at most two automatic retries follow
- **AND** each retains its original full identity/content with a client timeout of 15 seconds.

#### Scenario: A retry is scheduled

- **WHEN** the first or second automatic retry is scheduled
- **THEN** its wait is respectively randomized within 500–1500ms or 1500–4500ms
- **AND** there is no deliberate frontend hedging or duplicate active dispatch for that command.

#### Scenario: A client timeout or budget exhaustion occurs

- **WHEN** an attempt times out or all three frontend attempts remain inconclusive
- **THEN** the result is not relabeled failed, rolled back or never applied
- **AND** manual recovery remains available under its separately defined budget and PT-031 restoration rules.

#### Scenario: Timers or remote work outlive the client's expectation

- **WHEN** browser scheduling is delayed or a timed-out remote attempt may still be finishing
- **THEN** the profile does not promise an exact wall-clock completion time or terminated remote work
- **AND** unchanged-identity safety remains necessary; production timing requires real-API qualification.

#### Scenario: Another outcome or retry layer exists

- **WHEN** an authoritative rejection, current preflight refusal or lower-layer retry is observed
- **THEN** technical uncertainty, established business outcomes and backend-internal retries retain their separate meanings
- **AND** this profile does not authorize repeating a business rejection or hidden extra frontend attempts outside its budget.

### Requirement: PT-035 — IndexedDB for retained drafts and operation records

Retained business drafts and submitted-operation records SHALL prefer IndexedDB
when usable, with compatibility behavior under PT-036. PT-031–032 scope and
explicit restoration SHALL remain applicable where retained copies are accessible.
This engine preference SHALL NOT select a wrapper, fallback chain, shared-tab
policy, retention period or backup/cross-device guarantee.

#### Scenario: Browser-local recovery data is retained

- **WHEN** selected business draft or operation-record persistence is implemented
- **THEN** it prefers usable IndexedDB within the selected browser/business/user scope and follows defined compatible fallback behavior when needed
- **AND** the engine alone does not assert another user/business's authority or guarantee survival of browser deletion/eviction.

#### Scenario: Preference and dependency scope are considered

- **WHEN** IndexedDB is adopted for recovery records and drafts
- **THEN** existing tab-scoped view/location preferences retain their separately chosen behavior
- **AND** no new library or broader preference migration follows automatically.

#### Scenario: Persistence failure or shared-tab coordination is designed

- **WHEN** failure handling, competing tabs or record retention rules are proposed
- **THEN** those follow their own concrete decisions
- **AND** engine selection is not treated as approval of those policies.

### Requirement: PT-036 — Compatibility without an IndexedDB prerequisite

IndexedDB absence or failure SHALL NOT by itself block Products use or business
saves. The experience SHALL follow its defined compatible fallback behavior and
honestly report actual draft/recovery retention capability. Storage failure SHALL
NOT change an authoritative business outcome. This clarification SHALL NOT select
the exact fallback chain, session-only policy, migration/coordination algorithm
or a guarantee for every browser.

#### Scenario: IndexedDB is unsupported or fails

- **WHEN** IndexedDB cannot be used in the current browser or fails during operation
- **THEN** the app follows defined compatible behavior rather than treating IndexedDB as an app-wide prerequisite
- **AND** existing access, validation, command-identity and business rules still apply.

#### Scenario: Local retention differs from business completion

- **WHEN** a local storage write fails after an authoritative result was observed
- **THEN** the known business result retains its meaning
- **AND** the separate retention problem is not presented as business failure or rollback.

#### Scenario: Earlier records cannot currently be read

- **WHEN** an earlier recovery store is inaccessible or a retained copy is unavailable
- **THEN** the interface does not claim there were no unresolved operations or that restoration succeeded
- **AND** it does not invent a replacement identity or rebuild an unknown original command from current edits.

#### Scenario: A fallback offers weaker retention

- **WHEN** compatible fallback behavior cannot provide the earlier persistence capability
- **THEN** its actual recovery limits are represented honestly and only accessible retained copies can be restored
- **AND** missing local data is not proof of Inventory rejecting or never receiving an earlier change.

### Requirement: PT-037 — Usable persistence fallbacks with honest retention

Recovery/draft storage SHALL use usable IndexedDB, then usable localStorage, then
open-app memory when persistent storage is unavailable. Normal saves and retries
of known original commands SHALL remain available under existing checks, with an
accurate nonblocking retention notice. Memory-only mode SHALL NOT promise refresh
or close recovery. Cross-tab locking, reconciliation and all-browser guarantees
remain separate decisions.

#### Scenario: IndexedDB is absent or fails and localStorage is usable

- **WHEN** IndexedDB cannot retain the applicable record but localStorage is usable
- **THEN** the compatible localStorage path is used without making IndexedDB a prerequisite
- **AND** existing original command identities, content and observed results retain their meaning.

#### Scenario: No persistent store is usable

- **WHEN** persistent browser storage is unavailable for the applicable record
- **THEN** saves and retries of known original commands can continue in open-app memory with a nonblocking retention notice
- **AND** refresh, closing or another app instance is not promised access to that memory-only record.

#### Scenario: Storage capability changes during recovery

- **WHEN** an active command moves to another available storage mode
- **THEN** the original command identity/content and observed outcomes are preserved
- **AND** the change of storage mode neither creates a new logical operation nor silently resets its retry budget.

#### Scenario: Known business completion and unavailable history coexist

- **WHEN** retention fails after authoritative confirmation or an earlier store cannot currently be read
- **THEN** known business outcomes are preserved and inaccessible history remains unavailable rather than assumed empty
- **AND** recovery of an old command still requires its original record; current edits cannot be relabeled as that recovery.

#### Scenario: Weaker storage or app-instance capabilities are used

- **WHEN** localStorage or memory is the effective mode for a record
- **THEN** its actual retention capability is represented without claiming IndexedDB transactional or cross-tab guarantees
- **AND** this choice does not select locking, migration/reconciliation algorithms, a library or a browser-version support matrix.

### Requirement: PT-038 — Explicit manual action authorizes a bounded recovery run

After a recovery run stops, explicit Reintentar or Continuar recuperación SHALL
authorize up to three requests using the original full operation identity/content
and PT-034 timing. A new run SHALL NOT start automatically or deliberately overlap
an active run. Inconclusive exhaustion SHALL preserve uncertainty and the original
command. PT-031 resumption and PT-037 retention limits SHALL remain applicable.

#### Scenario: The merchant requests recovery after a stopped run

- **WHEN** the merchant explicitly chooses Reintentar or Continuar recuperación for a supported unresolved command after its run has stopped
- **THEN** that action authorizes a new run of up to three requests, each with a 15-second client timeout and retry waits of 1 then 3 seconds randomized by ±50%
- **AND** every request retains the original full operation identity and equivalent frozen content; the first request of this run is still a retry of the same business operation.

#### Scenario: Another bounded run ends without confirmation

- **WHEN** the newly authorized run exhausts its budget inconclusively
- **THEN** uncertainty and the original command remain available under their actual retention capability
- **AND** another run requires another explicit request; exhaustion does not automatically reset the budget or create a replacement identity.

#### Scenario: A run is already active or the app is reopened

- **WHEN** another recovery action is requested while a run is active, or retained records are restored after reopening
- **THEN** an active run is not silently reset or deliberately overlapped, and reopening alone does not dispatch a request
- **AND** explicit continuation after a stopped run follows this budget without promising access to unavailable or memory-only records.

#### Scenario: A client request times out or a rejection is established

- **WHEN** timeout leaves remote completion unknown or an authoritative business rejection is established
- **THEN** timeout does not prove remote work ended and business rejection is not relabeled technical uncertainty to authorize automatic repeats
- **AND** shared-tab enforcement, transport/command mapping and live qualification remain separately defined.

### Requirement: PT-039 — Coordinate recovery where usable without blocking fallback

For the same original command across tabs, the app SHALL show another known active
recovery run and SHALL NOT deliberately start a second while it is known active.
If coordination is unavailable, recovery SHALL remain usable in the current tab
with an honest limitation notice. Missing status SHALL NOT prove no other run
exists. Other eligible work SHALL remain available. PT-028/031/034/037/038 rules
SHALL remain applicable.

#### Scenario: Another tab is known to be running recovery

- **WHEN** coordination identifies an active recovery run for the same original command in another tab
- **THEN** that activity is shown and no second deliberate run is started while it is known active
- **AND** browsing and other eligible work remain available under existing access and affected-product rules.

#### Scenario: Cross-tab coordination is unavailable

- **WHEN** the current app cannot use cross-tab coordination for the original command
- **THEN** its recovery remains usable with an honest limitation notice and unchanged original identity/content
- **AND** the app does not claim global exclusion or that unavailable status proves no other run exists; deliberate same-command overlap within the current app remains prohibited.

#### Scenario: Another tab changes state or stops being observable

- **WHEN** a message or storage event arrives, an apparent owner disappears or another run stops being observable
- **THEN** that observation alone does not authorize a new recovery run, reset its budget or prove remote work ended
- **AND** later explicit continuation follows PT-038 with the original command and current authority rather than reconstructing missing commands from current edits.

#### Scenario: Unsent drafts or concrete mechanisms are considered

- **WHEN** same-product unsent editing, ownership enforcement or a coordination adapter is proposed
- **THEN** this selection is not treated as adopting that policy or mechanism
- **AND** no automatic draft merge/overwrite, one-editor-per-product rule, dependency or universal browser guarantee follows.

### Requirement: PT-040 — Reject a second same-product edit and account for closure

A request to start a second edit of a product already under editing in another
tab SHALL be rejected with a clear error. The experience SHALL account for the
original editing tab having closed through a separately defined discard/takeover
flow. This correction SHALL NOT adopt independent drafts, automatic ownership
release or a concrete transfer mechanism. Submitted-command recovery SHALL retain
its existing rules.

#### Scenario: A second edit is requested for the same product

- **WHEN** another tab already holds the product's editing session and a second edit is requested
- **THEN** the second edit is rejected with a clear explanation
- **AND** it does not silently open an independent concurrent editor or replace the existing draft.

#### Scenario: The original editing tab is closed

- **WHEN** a retained unsent edit exists and the tab that performed it has closed
- **THEN** the experience accounts for that case through the separately defined discard/takeover flow rather than depending only on a live reply from the closed tab
- **AND** this correction alone does not choose the available actions or approve automatic discard, takeover, expiry or ownership release.

#### Scenario: Owner activity cannot be established

- **WHEN** the app cannot establish whether the original editing tab is still active
- **THEN** it does not present that uncertainty as proof the tab is open, closed or safe to replace
- **AND** the compatibility/ownership behavior must be explicitly defined rather than silently allowing a second edit or claiming universal enforcement.

#### Scenario: Submitted work exists for the product

- **WHEN** a draft-resolution flow encounters submitted or unresolved save records
- **THEN** their original command identity/content and PT-029 protection remain applicable
- **AND** discarding a never-submitted draft is not presented as cancelling, reversing or resolving submitted work.

#### Scenario: The scope or enforcement mechanism is proposed

- **WHEN** ownership scope, release, takeover, timing or coordination mechanisms are designed
- **THEN** this reply is treated as the selected second-editor rejection in the current cross-tab discussion, with those details still requiring definition
- **AND** it is not treated as approval of cross-device/team-wide locks, a dependency or an implemented guarantee.

### Requirement: PT-041 — Explicit resolution for an unreachable unsent-draft editor

For an accessible unsent draft whose prior tab is unreachable and status unknown,
the app SHALL allow explicit Asumir edición or confirmed Descartar y empezar de
nuevo, with Cancelar preserving the work. After transfer, the prior editor SHALL
be read-only if it returns. Known active editors SHALL still block a second edit.
No automatic transfer/discard SHALL follow from lost contact. PT-029/032/033 and
submitted-command recovery SHALL remain applicable.

#### Scenario: The merchant assumes the retained unsent edit

- **WHEN** the prior editor is unreachable with unknown status and the merchant explicitly chooses Asumir edición for its accessible unsent draft
- **THEN** that draft and baseline are continued under PT-033's current-data review and existing access/validation rules
- **AND** no automatic merge, save or parallel independent edit is introduced.

#### Scenario: The merchant discards that draft and starts again

- **WHEN** the merchant explicitly confirms Descartar y empezar de nuevo in that unresolved-owner case
- **THEN** only that never-submitted draft is abandoned, and a new edit uses current product data under existing protections
- **AND** submitted command records, known outcomes and unresolved-result protection are not erased, cancelled or resolved by discard.

#### Scenario: The merchant cancels or loses contact without acting

- **WHEN** the merchant chooses Cancelar or the earlier tab becomes unreachable without a resolution request
- **THEN** loss of contact does not automatically transfer, discard or start an editor
- **AND** the retained work remains untouched by that observation alone.

#### Scenario: The earlier editor returns after ownership changed

- **WHEN** the previous editor returns after explicit takeover or confirmed discard/start
- **THEN** it is read-only and cannot continue editing/saving under its former ownership
- **AND** this required behavior must be enforced by a defined mechanism before claiming implementation support.

#### Scenario: Another editor is known active or retained work is inaccessible

- **WHEN** another editor is known active, or no accessible retained copy exists
- **THEN** a known active editor retains PT-040's second-edit rejection and unavailable data is not represented as successfully assumed or discarded
- **AND** missing owner status is not proof that the tab closed or submitted work stopped.

#### Scenario: Production coordination is considered

- **WHEN** ownership enforcement, incompatible coordination or a production browser matrix is designed
- **THEN** those mechanisms and qualification remain separate from this selected flow
- **AND** no universal locking guarantee, retry-budget reset, dependency or new backend interface follows from this selection.

### Requirement: PT-042 — Confirmed stock matches with incomplete-results notice

With stock-only filtering, only confirmed PT-010 matches SHALL be shown. If
otherwise query/archive-eligible products cannot be assessed, the view SHALL
show a clear incomplete-results notice and their product count. Unknowns SHALL
NOT become zero or confirmed nonmatches. An empty confirmed subset with
unassessed candidates SHALL NOT be presented as a complete empty result.
Wording and visual treatment remain review proposals.

#### Scenario: Confirmed positive matches and unassessed candidates coexist

- **WHEN** the selected-location stock filter has confirmed positive matches and other otherwise-query/archive-eligible products whose stock condition cannot be assessed
- **THEN** the matching rows contain only confirmed positive matches under PT-010
- **AND** the view clearly states that results are incomplete and counts the unassessed products rather than treating them as zero or confirmed nonmatches.

#### Scenario: Query or archived inclusion narrows the candidate set

- **WHEN** the submitted query or applied archived-inclusion choice excludes a product independently of stock
- **THEN** that product is not counted among the otherwise-eligible candidates that could not be assessed
- **AND** the incomplete-results count describes products, not their number of measurements or unrelated catalogue records.

#### Scenario: No positive match can be confirmed while candidates remain unassessed

- **WHEN** the confirmed-positive subset is empty but otherwise-eligible products remain unassessed
- **THEN** the view retains the incomplete-results notice and unassessed-product count
- **AND** it does not present that subset as a complete empty result or claim that all eligible products lack positive recorded stock.

#### Scenario: A stock state is known or unresolved

- **WHEN** a candidate has known zero/negative/no-record stock or an unresolved stock condition under the owning meaning
- **THEN** PT-010's known nonmatches retain their meaning and unresolved data remains unassessed
- **AND** this presentation choice does not redefine reservation dimensions, recorded quantities, verification flags or available-to-sell.

#### Scenario: Implementation or exact presentation is proposed

- **WHEN** classifier details, notice wording, placement, metrics or data-loading behavior are implemented or reviewed
- **THEN** concrete classification follows the owning stock meaning and exact visual treatment remains a preview review proposal
- **AND** this decision does not adopt a new API, refresh cadence, production storage, pagination, search matching or waiting-for-all-stock policy.

### Requirement: PT-043 — Compact expandable change feedback

Products' save-result and recovery-status surfaces SHALL use a consistent
compact inline summary with expandable product details. The shared presentation
SHALL preserve their separate state sources, current product/table scope and
per-product/per-field meanings. Existing PT-027 dismissal/new-result behavior and
PT-028–041 recovery/draft/ownership rules SHALL remain in force. Field validation,
confirmation dialogs and a general notice system are outside this revision.

#### Scenario: Details are expanded or collapsed

- **WHEN** a merchant operates either feedback surface's disclosure
- **THEN** its expanded state and action are clearly conveyed to keyboard, pointer and touch users
- **AND** collapsing changes presentation only, retaining inspectable results, visible uncertainty and all affected-product protections.

#### Scenario: New results or a recovery action arrive

- **WHEN** a new save result is produced or an existing eligible recovery action is invoked
- **THEN** the existing visibility, original-command and state rules remain unchanged
- **AND** the layout does not introduce global retries, inferred summary counts, automatic dismissal or a merged result model.

#### Scenario: Business results and retention limitations coexist

- **WHEN** a result or unresolved command has an applicable local-retention or coordination limitation
- **THEN** the limitation remains distinguishable from the business outcome and visible under its existing conditions
- **AND** a confirmed business result does not become a failure merely because local retention failed.

#### Scenario: Exact visual metrics are reviewed

- **WHEN** the selected pattern is developed in the simulated preview
- **THEN** TailAdmin component treatment and existing branding remain the basis
- **AND** exact spacing, responsive arrangement and new candidate images require visual review rather than being accepted by this direction alone.

### Requirement: PT-044 — Explicit directional browsing replaces visible rows

Products browsing SHALL use explicit Anterior/Siguiente controls to move between
groups of results, replacing the visible product rows rather than appending
another group to the working table. This selects the frontend browsing model
for the simulated design, without selecting a Products API, continuation-token
semantics, page size, counts, ordering, snapshot, loading or retention policy.
Existing editing, draft, validation and recovery decisions SHALL retain their
separate scope.

#### Scenario: The merchant navigates to another group of results

- **WHEN** the merchant uses Anterior or Siguiente and that requested group is successfully available
- **THEN** the table presents that group in place of the previously visible rows
- **AND** this model does not append groups through Cargar más or automatic infinite scrolling.

#### Scenario: Concrete paging behavior is designed

- **WHEN** page sizes, navigation availability, counts, loading, refresh or persistence are proposed
- **THEN** those choices require their own approved basis and do not follow automatically from directional navigation
- **AND** supporting catalogue/stock pagination does not become a Products search contract or a callable integration.

#### Scenario: Navigation intersects with editing or recovery

- **WHEN** cross-page editing, validation, draft handling or unresolved-command behavior is designed
- **THEN** existing selected safeguards retain their meaning
- **AND** this browsing-model choice alone does not authorize automatic saving, discarding drafts or restarting a recovery command.

### Requirement: PT-045 — Initial preview page size and explicit options

The first simulated Products browsing design SHALL default to 50 products per
page when no applicable explicit page-size choice exists. It SHALL offer the
merchant choices of 25, 50 and 100 products per page. These are frontend preview
settings, not an adopted Products API bound, measured performance guarantee or
inheritance of the supporting Inventory collection limits. Page-size retention,
traversal reset, loading and cross-page editing behavior remain separate choices.

#### Scenario: The preview has no applicable page-size choice

- **WHEN** the Products preview initializes page size without an applicable explicit choice
- **THEN** its page-size setting is 50 products per page
- **AND** this default does not select whether or how a previous explicit choice is retained.

#### Scenario: The merchant chooses a page size

- **WHEN** the merchant uses the page-size control
- **THEN** the available choices are 25, 50 and 100 products per page
- **AND** these choices do not select a future backend maximum, response-completeness promise or production-capacity claim.

#### Scenario: Retention and traversal behavior are designed

- **WHEN** remembering page size, changing the current result group or preserving edits is proposed
- **THEN** those behaviors require their own approved basis and preserve the existing editing/recovery decisions
- **AND** no persistence, automatic reset, save or discard follows from this page-size choice alone.

### Requirement: PT-046 — Per-tab page size and restart on size change

Products SHALL remember the explicit page-size choice within the current tab
for the same business. A new tab SHALL start with PT-045's default of 50.
Changing page size SHALL start browsing at the first result group, preserving
the submitted search, sorting, applied filters and stock/location settings.

#### Scenario: The merchant returns in the same tab and business

- **WHEN** the merchant returns to Products while the same tab remains open for the same business
- **THEN** the explicit page-size choice is retained
- **AND** this does not determine which result group, continuation token or scroll position is restored.

#### Scenario: A new tab opens Products

- **WHEN** Products is opened in a new tab
- **THEN** its page-size setting starts at 50 rather than inheriting another tab's choice
- **AND** this preference default does not discard retained drafts or submitted recovery records.

#### Scenario: The merchant changes page size

- **WHEN** the merchant chooses a different page size
- **THEN** browsing starts at the first result group with that size setting
- **AND** submitted search, sorting, applied filters and stock/location settings remain unchanged.

#### Scenario: Cross-page editing and loading are designed

- **WHEN** changing page size intersects with drafts, validation, unresolved commands or a pending retrieval
- **THEN** existing selected safeguards retain their meaning
- **AND** this preference decision does not select loading presentation, automatic save/discard or a recovery restart.
- **AND** the preference scope and size-change reset select neither a storage engine nor backend paging semantics.

### Requirement: PT-047 — Displayed count and supplied labelled estimate

Products SHALL show the exact number of products currently displayed. When a
data source supplies an estimated total for the relevant matching and authorized
selection, the view SHALL label it as an estimate. Without a supplied total, it
SHALL show only the displayed-product count. This selects count presentation,
not a Products API or estimate-request policy.

#### Scenario: No total is supplied

- **WHEN** the displayed results have no supplied total
- **THEN** the view shows their exact displayed-product count
- **AND** it does not fabricate a global count or substitute zero for the missing total.

#### Scenario: An estimated total is supplied

- **WHEN** the data source supplies an estimated total for the relevant matching and authorized selection
- **THEN** the view shows it explicitly as an estimate alongside the exact displayed-product count
- **AND** the supplied value is preserved without silent rounding; a present zero remains distinguishable from an absent estimate.

#### Scenario: Counts are used while browsing

- **WHEN** displayed counts or estimates appear beside navigation
- **THEN** this presentation alone establishes no stable page number, exact total-page count, continuation availability or end-of-results status
- **AND** neither a product count nor an estimated record total becomes a stock quantity or verification of physical stock.

#### Scenario: Stock filtering leaves unassessed candidates

- **WHEN** PT-042's incomplete-results conditions apply
- **THEN** the existing distinction between confirmed matches and unassessed candidates remains visible
- **AND** this count-presentation decision does not promote a count observed on one loaded page into an unknown-stock count for the entire matching catalogue.

### Requirement: PT-048 — Table drafts and one save action across pages

While Editar tabla is active, Products SHALL retain drafts when moving between
result groups. One explicit Guardar cambios action SHALL cover all edited
products, including those on other pages. Merchants SHALL have a clear way to
find off-page edits and validation errors. Leaving Products SHALL retain
PT-025's guard; PT-023–024's individual outcomes and all-draft validation remain
applicable.

#### Scenario: The merchant changes pages with table drafts

- **WHEN** the merchant moves to another result group while Editar tabla has drafts
- **THEN** those drafts remain available across pages without requiring save/discard before each page change
- **AND** page navigation itself does not save or discard them.

#### Scenario: Guardar cambios includes off-page edits

- **WHEN** the merchant explicitly saves changes in the table editor
- **THEN** the action covers the edited products across pages under the existing validation and eligible-submission rules
- **AND** outcomes remain individual confirmations rather than a promise of atomic batch success.

#### Scenario: An off-page product has a field error

- **WHEN** an edited product outside the displayed result group has a detectable field error
- **THEN** the all-draft local validation gate still applies before sending the requested changes
- **AND** the merchant can find that product and its field error rather than losing access to it through pagination.

#### Scenario: The merchant leaves Products or has unresolved commands

- **WHEN** the merchant leaves Products with unsaved changes or paging intersects with original unresolved commands
- **THEN** the existing departure guard, original-command recovery and affected-product protections retain their meaning
- **AND** this choice defines no new backend batch, automatic save, production persistence or recovery restart.

### Requirement: PT-049 — Marked previous results during page loading and failure

Products SHALL use a neutral first-load state. Later page requests SHALL retain
previously loaded results with a clear previous-results/loading indication and
replace them only on success. Technical read failure SHALL show an inline error
with Retry and retain previous results when available. This selects presentation,
not automatic read retries or a write/recovery policy.

#### Scenario: The first page has no previous result

- **WHEN** the initial page is loading without previously loaded results
- **THEN** the view shows a neutral loading state
- **AND** a technical read failure shows an error with Retry rather than fabricated rows or successful empty results.

#### Scenario: Another page is loading

- **WHEN** a later page request is pending
- **THEN** previously loaded results remain visible and clearly identified as previous results while loading
- **AND** they retain their known scope and do not become a confirmed response for the requested group or selection.

#### Scenario: The requested page succeeds or fails technically

- **WHEN** the requested result is successfully available
- **THEN** it replaces the previous result group
- **WHEN** the read fails technically
- **THEN** an inline error and Retry are shown, retaining previous results when available and their honest previous-results status.

#### Scenario: A read retry intersects with drafts or commands

- **WHEN** the merchant retries a failed page read
- **THEN** that action concerns retrieval rather than resubmitting business writes or restarting original-command recovery
- **AND** existing editing/draft protections remain; automatic read budgets, busy controls, late responses and distinct access/continuation failures require their own approved basis.

### Requirement: PT-050 — Result-set resets and layout-only retention

Changes to submitted search, sorting or applied filters SHALL start Products
browsing at the first result group, preserving page size and product drafts.
Column-only visibility/order/width and density changes SHALL keep the current
result group. Existing search/filter submission rules SHALL retain their scope.
This selects frontend reset behavior, not matching, ordering or backend cursor
mechanisms.

#### Scenario: The submitted search, sort or applied filters change

- **WHEN** the submitted search is changed or cleared, sorting changes or applied filters change
- **THEN** browsing starts at the first result group for the changed result-set settings
- **AND** the chosen page size and product drafts remain available under their existing rules.

#### Scenario: The merchant changes only table presentation

- **WHEN** column visibility, column order/width or density changes without changing an applied result-set constraint
- **THEN** the current result group is retained
- **AND** a layout-only action does not itself submit search, change applied filters or save/discard product drafts.

#### Scenario: Search or filter choices are still drafts

- **WHEN** search text is being edited without submission or filter changes have not been applied
- **THEN** the existing search/filter submission and cancellation rules remain applicable
- **AND** this reset policy does not apply an unsubmitted query or unconfirmed filter draft.

#### Scenario: Other traversal and ordering choices are considered

- **WHEN** location/stock context, return/refresh position, exact matching/sort rules or backend continuation is designed
- **THEN** those choices need their own approved basis and do not follow solely from this reset policy
- **AND** PT-048–049's draft and honest loading/failure protections retain their meaning.

### Requirement: PT-051 — Stock-location navigation respects filtering

With stock shown, changing location SHALL retain Products' browsing position
when the stock-only filter is inactive and restart at the first result group
when it is active. Hiding stock that clears this active filter SHALL also
restart at the first group. Preserve page size, product drafts and other applied
settings. This selects frontend navigation, not frozen membership or backend
continuation semantics.

#### Scenario: Location changes without the stock-only filter

- **WHEN** the merchant changes the shown stock location without Solo con existencias registradas active
- **THEN** the current browsing position is retained
- **AND** this does not promise a frozen product membership or a reusable backend cursor across selections.

#### Scenario: Location changes with the stock-only filter

- **WHEN** the merchant changes location while Solo con existencias registradas is active
- **THEN** browsing restarts at the first group for the changed stock-filter context
- **AND** the existing stock meaning and PT-042 confirmed/unassessed distinction remain applicable.

#### Scenario: Hiding stock clears the active stock-only filter

- **WHEN** hiding stock clears the active stock-only filter under the existing visibility/filter rules
- **THEN** browsing restarts at the first result group
- **AND** page size, product drafts and the other applied settings remain unchanged.

#### Scenario: Stock context is loading or unavailable

- **WHEN** the selected stock location differs from the scope of previously loaded quantities
- **THEN** previous-location quantities are not relabelled as newly retrieved stock for the chosen location
- **AND** existing honest loading/failure, location-retention and draft/recovery rules retain their scope; exact presentation requires review.

### Requirement: PT-052 — Fresh restoration and explicit unusable-position restart

Within the same tab/business, Products SHALL remember the last result-group
position and request fresh data for it on return or refresh. If that position
is reported unusable, show an explanation and Volver al inicio; restart only on
explicit request. Preserve the applied view, page size and existing draft/recovery
restoration rules.

#### Scenario: The merchant returns or refreshes in the same tab and business

- **WHEN** Products is revisited or refreshed with a remembered result-group position
- **THEN** the view requests fresh data for that position and preserves the applied view and page size
- **AND** this does not make cached rows authoritative or promise unchanged membership, a frozen snapshot, a stable page number or exact scroll restoration.

#### Scenario: The saved position is reported unusable

- **WHEN** the data source reports that the remembered position cannot be used
- **THEN** the view explains the condition and offers Volver al inicio
- **AND** it does not silently reset, fabricate empty success or reinterpret a technical read failure or known access denial as an unusable position.

#### Scenario: The merchant explicitly starts again

- **WHEN** the merchant requests Volver al inicio after an unusable-position report
- **THEN** browsing requests the first result group while preserving view settings, page size and drafts under their existing rules
- **AND** this does not resume editing, resend business writes or restart original-command recovery automatically.

#### Scenario: Existing intentional resets or restoration rules apply

- **WHEN** PT-046/050/051 requires an intentional first-group restart or retained drafts/commands are offered for restoration
- **THEN** those selected rules retain their scope and PT-052 does not override them
- **AND** backend position formats, token lifetimes, APIs and storage mechanisms remain separate implementation decisions.

### Requirement: PT-053 — Simulated page reads protect the latest view

The bounded Products preview SHALL disable page navigation and page-size changes
while a simulated page read is pending. Other controls retain their existing
guards. A newer submitted view SHALL supersede the pending read intent; an older
completion SHALL NOT replace the latest requested view. This is a simulation
policy, not a guarantee of server-side cancellation or request concurrency.

#### Scenario: A simulated page read is active

- **WHEN** the preview is waiting for a requested page
- **THEN** Anterior/Siguiente and page-size changes are disabled
- **AND** unrelated controls remain usable under existing edit, validation and recovery guards.

#### Scenario: Another view is requested before completion

- **WHEN** a newer submitted view supersedes a pending read and an older response completes later
- **THEN** only the result for the latest requested view may replace the displayed result
- **AND** read intent/generation state remains separate from business operation identities, retry counts and recovery commands.

### Requirement: PT-054 — Current displayed page is visible

The simulated Products preview SHALL show the current displayed page number
between Anterior and Siguiente after a successful read. It SHALL update only
when the requested result succeeds, retaining the displayed result's number
while loading or after failure. Keep estimated product totals separate; do not
infer an exact page total from them. Existing reset and restoration rules remain.

#### Scenario: A result group loads successfully

- **WHEN** the first, next or previous group is successfully displayed
- **THEN** its known current-page number appears between the directional controls
- **AND** a click alone does not advance the displayed number.

#### Scenario: A read is pending or fails

- **WHEN** another result is loading or a read fails while prior rows remain displayed
- **THEN** the indicator retains the prior displayed result's number
- **AND** an older superseded response cannot change that number.

#### Scenario: No successful result exists

- **WHEN** initial loading, technical failure or an unusable position has not produced a displayed result
- **THEN** the preview does not invent a current displayed page number
- **AND** existing loading, retry and explicit restart behavior remains.

#### Scenario: Short groups or estimated totals exist

- **WHEN** the synthetic provider returns fewer records than the requested size or supplies an estimated total
- **THEN** the indicator uses the provider's known group position rather than inferring an ordinal from record count or estimated totals
- **AND** it does not claim an exact total number of pages or a production Inventory page-number contract.

#### Scenario: Existing browsing resets or fresh restoration apply

- **WHEN** an existing rule requests the first group or freshly reads a restored position
- **THEN** the number reflects the successfully loaded group under that rule
- **AND** the indicator introduces no additional reset, cached-data authority or write/recovery behavior.
