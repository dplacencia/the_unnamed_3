# Inventory spreadsheets: evidence and design hypotheses

Research date: **2026-11-13**. Public pages were read without posting, contacting
participants, registering accounts or supplying customer data. Findings below
are attributed self-reports and qualitative research; design implications are
our hypotheses for merchant review, not approved features.

## Local starting evidence

The user's [product thesis](../../../../the_unnamed_1/project_idea.md) describes
Excel inventory in small hospitality businesses, alongside WhatsApp/supplier
websites, separate delivery tools, POS and payment terminals (§§7–8). It proposes
that familiar, inexpensive, resilient tools can outweigh integration benefits
(§15 H9), and warns against adding a complex workflow to replace a simple one.
The document explicitly distinguishes these observations from demonstrated
demand. It contains no actual inventory workbook, interview transcript,
frequency ranking, measured task time or verified reason for choosing Excel.

The user now attributes Excel use to interviewed customers. That is the user's
reported evidence; it does not reveal whether those customers use formulas,
manual lists, printed counts, supplier files or several people sharing a file.
The older thesis's broader candidate audience does not replace the approved
Spain/greengrocer/neighbourhood-shop frontend focus.

## Method and evidence limits

Searches covered inventory/Excel discussions in Reddit's smallbusiness,
InventoryManagement and excel communities, UK Business Forums and Spanish
forums. Prefer original posters describing actual work and relevant replies;
exclude vendor recommendations, affiliate/template sales pages and software
builders' marketing claims as evidence of customer needs. Inclusion is purposive,
not a representative sample or a count of how common a preference is.

The forum accounts are not identity-verified and much of the evidence is from
other countries, unique-item sales or hospitality. Older posts support enduring
workflow questions, not current prices or competitor capability. One Spanish
food-shop account is second-hand. These limits prevent claims about prevalence,
willingness to pay or what our particular merchants want. Primary HCI work adds
explanatory support, not proof that its participants represent our customers.

## Forum evidence

| ID / source                                                                                                                                                                                         | Reported observation                                                                                                                                                                                               | Useful inference and limits                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1 — [Food-shop software discussion, ForoCoches](https://forocoches.com/foro/index.php/showthread.php?p=475348687), 31 May 2024, original post                                                      | A relative describes a small food shop recording sales in Excel, with stock disorder, and asks about barcode-based stock/sales tracking.                                                                           | Geographically and sectorally relevant evidence of the workflow and friction. It does not establish why the shop originally chose Excel, scanner compatibility, or any vendor's actual features. Ignore the product-promotion replies.        |
| F2 — [Small inventory/invoicing business, Reddit](https://www.reddit.com/r/smallbusiness/comments/1mecoxb/small_business_needs_inventoryinvoicing/), original post and process-simplification reply | An auction business repeatedly reconciles item stickers, sales and cost sheets; the poster finds supposedly small-business software confusing and too broad. A reply suggests simplifying the current master list. | Switching has to remove repeated work. New software with the same unnecessary handoffs may provide little benefit. This is a different business model and the reply is advice, not a measured successful intervention.                        |
| F3 — [Stock Management System, UK Business Forums](https://www.ukbusinessforums.co.uk/threads/stock-management-system.328967/), 2 July 2014, original post                                          | A merchant copies warehouse reports into Excel, says some packages lack needed fields, and cannot reshape the warehouse system's data.                                                                             | Control over information and compatibility with existing systems matter alongside automation. This historical account is not a current comparison of vendors or their prices.                                                                 |
| F4 — [Simple stock control, UK Business Forums](https://www.ukbusinessforums.co.uk/threads/simple-stock-control.427504/), October–November 2024, original poster                                    | The poster wants a narrow stock workflow, finds other offerings too broad, struggles to create a spreadsheet, and eventually plans to enlist people with Excel expertise.                                          | Simple requirements can hide substantial construction work. A manager's or colleague's spreadsheet skill cannot be assumed for everyday staff.                                                                                                |
| F5 — [Excel-like inventory, easier for employees, Reddit](https://www.reddit.com/r/InventoryManagement/comments/1s7r16p/looking_for_simple_inventory_management_software/), original post           | The poster wants bulk product setup, per-store stock and easier daily use, reporting that their spreadsheet is too complicated for staff across locations.                                                         | Familiar tabular work and a simpler employee workflow can coexist; copying Excel's full surface is not the same as making work easy. Use the workflow account, not vendor replies or automatic scan-to-decrement as a proposed business rule. |
| F6 — [Unique inventory and CSV support, Reddit](https://www.reddit.com/r/InventoryManagement/comments/1ov9y3u/recommendation_for_tracking_unique_inventory_csv/), original post and clarification   | Inventory arrives in spreadsheets/CSV and photos. Staff scroll and tag items for sales; the author wants a replacement at least as convenient and prefers offline operation.                                       | Fast repeated manipulation, existing data exchange and continuity are reasons to preserve the working table. This one-of-a-kind auction workflow does not establish our product identity model or an offline requirement.                     |
| F7 — [Why successful shops retain Excel, Reddit](https://www.reddit.com/r/smallbusiness/comments/1t1r4fu/talked_to_a_12m_shop_running_inventory_in_excel/), participant replies                     | Replies describe keeping a working setup, avoiding training and recurring charges, adapting their own data, and concern over retrieving data from providers.                                                       | Switching is a trust, effort and control decision as well as a UI decision. The original poster's revenue/interview claims are not verified or used; the thread includes pushback about market-research posts.                                |
| F8 — [Cafe inventory, Reddit](https://www.reddit.com/r/smallbusiness/comments/1adi2ch/inventory_management/), original poster and follow-ups                                                        | A cafe manager describes a working handwritten process, considers an app or sheet, and wants purchasing/ingredient information with low overhead. The manager reports being comfortable with spreadsheets.         | Some users actively choose a familiar tool rather than lack awareness of alternatives. Recipe/production automation is outside this table discovery and must not be imported from the example.                                                |

## Follow-up: what people actually do in the sheets

The user answered the first customer-task question with **“I dont know, try to
find some info in internet”**. Further searches therefore focused on actual
food-business counting, ordering and spreadsheet routines. These are additional
qualitative examples, not a frequency survey of the initial Spanish target.

| ID / source                                                                                                                                  | Actual account or stated limitation                                                                                                                                                     | Candidate lesson                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F9 — [Weekly inventory, restaurant owner](https://www.reddit.com/r/restaurantowners/comments/1me5wvj/weekly_inventory/)                      | The owner describes moving from monthly whole-business counts to a smaller weekly category sheet, then struggling to connect those numbers to decisions and other records.              | Shorter task lists can make counting manageable; a completed table is not automatically useful insight. Do not copy the financial calculations into current Inventory scope.                                                            |
| F10 — [Bar inventory-sheet design](https://www.reddit.com/r/BarOwners/comments/1t5p615/new_inventory_system_to_begin_to_track_costs/)        | The poster proposes reference data separately from a smaller staff count sheet, followed by manager review. This is a proposed V1, not a proven successful system.                      | Configuration and repetitive entry need different surfaces; staff should not have to rebuild the owner's spreadsheet. Permission to see a field remains separate from UI complexity.                                                    |
| F11 — [Deli ordering and inventory](https://www.reddit.com/r/KitchenConfidential/comments/1wgvl69/how_do_you_handle_ordering_and_inventory/) | The original poster describes staff sending shelf photos/videos to owners. Replies describe supplier lists, categories and row order matching storage/shelf order.                      | The working sequence can be physical, not alphabetical. Explore a useful task order or grouping instead of assuming every list starts with a generic sort. These replies are self-reports/advice, not a controlled productivity result. |
| F12 — [Cafe inventory routines](https://www.reddit.com/r/barista/comments/1pfqcbq/how_do_other_cafes_and_restaurant_owners_track/)           | The poster uses a sheet with their own thresholds to decide when to order. Replies report different count/order cadences and Excel/Sheets use. Exclude the later app-promotion replies. | Inspecting stock and deciding what needs attention are plausible routine tasks. No universal daily/weekly cadence, threshold or automatic-order rule follows.                                                                           |
| F13 — [Cafe/ice-cream inventory sheets](https://www.reddit.com/r/restaurantowners/comments/1xsd7vs/inventory_sheets/)                        | The poster asks for a template but clarifies the concrete problem is staff opening new packages while others are already open.                                                          | A spreadsheet request can conceal a physical organization/process problem. A nicer table alone will not fix every inventory issue; no package/expiry policy is inferred.                                                                |

Across the included examples, useful candidate jobs are: **inspect what remains
and needs attention; enter a sequence of physical observations; record/understand
receipts, usage and differences; maintain the reference list occasionally**.
This is a job map, not a measured ranking. The strongest concrete task material
is about stock work and counting, rather than evidence that editing product
names/codes is the dominant everyday job.

For design exploration, use the hypothesis **find a product, understand its known
state in context, and perform the intended action without losing place**. Give
catalogue maintenance, stock review and count entry explicit meanings within the
existing navigation. Keep consistent table interactions; do not assume they all
need an always-editable quantity cell or identical columns. The physical
shelf-order insight is particularly worth testing in a later count-oriented view.

## Primary usability evidence

- **R1 — [Chalhoub and Sarkar, CHI 2022](https://www.microsoft.com/en-us/research/publication/its-freedom-to-put-things-where-my-mind-wants-understanding-and-improving-the-user-experience-of-structuring-data-in-spreadsheets/):** 21 contextual interviews and follow-up prototypes with 20 participants examine why flexible grids survive structured alternatives. Layout is influenced by expertise, other tools and collaborators; stronger column operations do not remove every benefit of the free grid. This supports investigating users' own representations and workflows. It does not justify implementing arbitrary cells, formulas or every layout freedom. See the [author paper](https://www.cs.ox.ac.uk/files/13563/chalhoub_2022_data_structuring.pdf), especially the introduction and study framing. Small qualitative samples and mixed domains limit generalization.
- **R2 — [Nardi and Miller, INTERACT 1990, author-hosted paper](https://www.miramontes.com/writing/spreadsheet-eup/):** an eleven-user study links spreadsheet usefulness to task-relevant operations, visible tabular models and useful results without first learning general programming. It distinguishes domain specialists from aspiring programmers. This is historical explanatory evidence, not a contemporary usability benchmark.
- **R3 — [Nielsen Norman Group, Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/), 2022:** finding, comparing, individual-record work and acting on records require different support. The article discusses stable row/header context, visible filter state, configurable comparison and editing that preserves adjacent records. It cautions that modal editing can hide information people need. These observations inform the comparison tasks below; no exact row height, pagination strategy or editing mechanism follows automatically.

## Why a person might prefer the spreadsheet

These are synthesized explanations to test, not universal traits of humans.

| Possible human advantage         | How it appears in the evidence                                                                                                | Proposed product response                                                                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Immediate recognition            | The records and comparisons are already visible; the user works in the data itself (R2, R3, F6).                              | Make the table the main work surface, with readable identities and stable context. Avoid requiring a details screen to inspect every row.                                                      |
| Momentum                         | A repeated scroll/tag/change task has a familiar rhythm (F6); repeated cross-list reconciliation becomes burdensome (F2).     | Explore keyboard navigation, direct safe editing, copying and bounded bulk actions. Preserve position and selection rather than restarting the task after each operation.                      |
| Ownership and agency             | Existing layouts/fields may match the business better than a provider's imposed model (F3, F7, R1).                           | Propose explicit column visibility/order/width and useful views. Arbitrary custom business fields, formulas and persistence still need separate decisions.                                     |
| Small initial commitment         | A working list may need less setup or training than a broad system (F2, F4, F7).                                              | Make one useful task possible with essentials. Deeper tools should be explicitly available without a mandatory configuration project.                                                          |
| Compatibility and an exit        | Incoming files and vendor data already participate in the workflow (F3, F6); data-access concerns affect trust (F7).          | Explore copy/paste and import/export paths with review and exact identifiers. Do not promise unsupported formats, perfect migration or new commercial terms.                                   |
| Familiar recovery and confidence | Visual inspection and familiar routines can feel more controllable, while more complex sheets also burden staff (F4, F5, R1). | Distinguish drafts, confirmed changes and failed/unknown outcomes. Cancellation of a draft can be easy; reversal of a committed business fact must retain its proper correction/history rules. |
| Reliability where work happens   | One workflow explicitly needs local/offline access (F6).                                                                      | Treat connection and continuity as a discovery question. No offline implementation or availability promise is selected by this research.                                                       |

My working interpretation is that the appeal is **control over familiar work with
little overhead**. A rectangular grid alone does not provide that. Conversely,
Excel use does not imply that its user enjoys formulas or that their colleagues
are spreadsheet experts.

## Implications specific to Irin

These are proposals within existing approved values, not new feature acceptance.

1. **Efficient information matters more than decorative simplicity.** A small,
   consistent set of relevant columns may be easier than sparse cards requiring
   repeated navigation. Density still needs review for readability and touch.
2. **Provide a useful default and let people deliberately expand it.** Column
   configuration and editing accelerators should not require every employee to
   understand them. Do not infer complexity preferences from roles or usage.
3. **Keep task meaning even when input resembles a cell.** Product details,
   physical observations and authoritative stock balances are different data.
   A simple count entry must not silently become an unexplained overwrite of
   recorded stock. Fast entry can feed an explicit domain workflow.
4. **Make confidence visible.** Preserve exact quantities and units, leading-zero
   identifiers, duplicate-name disambiguation and known access/state distinctions.
   A failed read is not an empty table; a missing stock record is not zero.
5. **Remove repeated work instead of just recoloring it.** A well-designed
   individual editor alone will not replace a frequent spreadsheet batch task.
   Establish which tasks and editable fields matter before choosing the UI.
6. **Let the user retain their useful tools.** Interoperability and supported
   exports are candidates; a mandatory replacement of POS, purchasing or
   accounting is outside this table. Switching-cost and pricing concerns cannot
   be solved solely through row styling.

## Read-only domain constraints

Following the sibling [source-navigation policy](../../../../the_unnamed_1/team/policy.md#inventory-source-navigation),
the thesis is product context; published owning requirements constrain business
meaning. They are not proof of implemented API availability. Relevant excerpts:

- [Product identity](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle/spec.md): names are not unique identity; codes may be omitted in supported setup and identifiers keep their own matching/preservation rules. Do not use a displayed row number or name as permanent identity.
- [Product search](../../../../the_unnamed_1/openspec/specs/inventory-product-search/spec.md): preserve exact identifier/partial-name meanings and their applicability limits. Do not introduce typo tolerance or arbitrary filters as already supported.
- [Recorded stock](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads/spec.md): on-hand is recorded product/location stock, not physical certification or available-to-sell. Missing record, recorded zero, negative stock, denial and read failure differ.
- [Counts](../../../../the_unnamed_1/openspec/specs/inventory-stock-count-reconciliation/spec.md): editable draft observations and completed reconciliation facts have different lifecycles. A generic spreadsheet undo must not erase committed facts.
- [Module boundaries](../../../../the_unnamed_1/openspec/specs/inventory-module-boundaries/spec.md): current Inventory does not define monetary stock/loss valuation; physical-expiry detail is discovery-deferred. Forum examples do not justify adding prices, margin or expiry policy to the initial table.
- [Catalogue reads](../../../../the_unnamed_1/openspec/specs/inventory-catalogue-reads-contract/spec.md): where a response supplies an estimate, it must not become an exact count; these specific collection branches do not establish a generic Products-table API or its local availability.

The human-visible screen may eventually bring authorized context together without
combining these business meanings. Exact fields, operations, sorting/filtering,
list traversal and supported editing require the relevant later decisions.

## Source snapshot

Supporting repo HEAD at inspection: `7240bfa0136cbe889146cdc243149a5160b94afa`.
Consulted files had no local modifications. The source paths above are live
reading links; refresh them before an implementation that depends on them.

| File under `the_unnamed_1`                                    | SHA-256 at inspection                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `project_idea.md`                                             | `88d89b83fa08787df58c80958de6925a50957017cea26ab2351f49a8c3661faa` |
| `team/policy.md`                                              | `a94f5bc8f813303afe5c3120f553f3b1a3afc8b5d59eff8922f513f46c7d5b33` |
| `openspec/specs/inventory-product-identity-lifecycle/spec.md` | `599761cfa39e5c6800afc975f214e16e567a71832dd1d39a7b4feba7c948a80a` |
| `openspec/specs/inventory-product-search/spec.md`             | `aef21c914eda893a349613c8bf01c639500ded8c44807aead7ce5295e3f7df7e` |
| `openspec/specs/inventory-recorded-stock-reads/spec.md`       | `04879ae3269c2e31e1c48da6b0d26fa9bd87c30df8a527d971699f1a6257e965` |
| `openspec/specs/inventory-stock-count-reconciliation/spec.md` | `7593df3544224a55e33cad9eb0638ebfc84b8bb7872704d5500f579fd729df74` |
| `openspec/specs/inventory-module-boundaries/spec.md`          | `68769fcc9cc43888e5e0fa66c04b19b5cec2058e0356ff62357f3ba8b5525c47` |
| `openspec/specs/inventory-catalogue-reads-contract/spec.md`   | `2bd3bdfdee89e93de04da0ba8c1dfdf25fffd5a7ccc306e9dc5034e1adf0549a` |

## Grid libraries and row expansion — 2026-11-13

The user requested AG Grid expandable-row reference research, then Tabulator's
6.x examples and TanStack as possible commercially usable foundations. These
are official documentation/source observations and fit recommendations, not
dependency selection or executed UI/performance evidence.

### Commercial-use licence findings

- [TanStack Table's MIT licence](https://github.com/TanStack/table/blob/main/LICENSE)
  was read in full through its public raw source. It permits commercial use,
  modification and distribution, including use within a proprietary application,
  subject to retaining its copyright and permission notice.
- [Tabulator's MIT licence](https://github.com/tabulator-tables/tabulator/blob/master/LICENSE)
  was also read in full. It grants the same commercial-use permissions and notice
  condition. Its reviewed source manifest reports `tabulator-tables` version
  `6.7.1`; the [official README](https://github.com/tabulator-tables/tabulator)
  identifies the project as MIT and describes React/framework support.
- [AG Grid's licence index](https://github.com/ag-grid/ag-grid/blob/latest/LICENSE.txt)
  distinguishes MIT community packages from commercially licensed
  `ag-grid-enterprise`. Its
  [Master/Detail documentation](https://www.ag-grid.com/react-data-grid/master-detail/)
  labels that feature Enterprise. Community licensing therefore does not itself
  grant use of the Enterprise Master/Detail implementation.

These findings concern the reviewed direct-project sources. An adoption still
needs the exact package/version and its bundled/transitive notices checked under
the repository's existing dependency policy. No library, version, paid licence
or installation is selected here.

### Different expansion concepts

| Pattern                            | Official source finding                                                                                                                                                                                                                                                                                                             | Possible Irin use; not selected                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Product row with detail underneath | [AG Grid Custom Detail](https://www.ag-grid.com/react-data-grid/master-detail-custom-detail/) permits a custom component, including a form, instead of another grid. [TanStack's React expansion guide](https://tanstack.com/table/latest/docs/framework/react/guide/expanding) supports custom detail content as well as sub-rows. | Compact, initially requested product inspection near the row; preserve the selected full panel unless the user chooses a replacement.   |
| Groups derived from a column       | [AG Grid Row Grouping](https://www.ag-grid.com/react-data-grid/grouping/) introduces groups from equal column values.                                                                                                                                                                                                               | A display grouping would need its own field and ordering decisions; equal names/SKU prefixes do not establish product families.         |
| Supplied parent/child hierarchy    | [AG Grid Tree Data](https://www.ag-grid.com/react-data-grid/tree-data/) consumes a supplied hierarchy. Tabulator's [DataTree module](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/DataTree/DataTree.js) implements child rows and explicit expansion/collapse.        | A family/variant view is a separate proposal with actual domain relationships; it is not another presentation of one product's details. |
| Hidden-column responsive collapse  | Tabulator's [ResponsiveLayout module](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/ResponsiveLayout/ResponsiveLayout.js) can hide columns as width decreases and render their collapsed content; the feature is optional.                                             | Do not enable this mode for PT-016's selected full phone table. Explicit selected columns and horizontal scrolling remain applicable.   |

AG Grid's [full-width row reference](https://www.ag-grid.com/react-data-grid/full-width-rows/)
shows a viewport-width information region independent of horizontal column
scrolling/pinned sections. Its
[height reference](https://www.ag-grid.com/react-data-grid/master-detail-height/)
offers fixed, content-based and per-row detail height. A compact custom summary
is the relevant space-use hypothesis; vendor example heights and nested grids
are not selected Irin designs. Custom detail focus/keyboard handling requires
implementation and verification; the AG Grid custom-detail guide explicitly
describes that responsibility.

### Foundation comparison

| Candidate          | Verified model                                                                                                                                                                                                                                                       | Fit assessment for this repo                                                                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Table** | Headless table logic, with React support and custom detail/sub-row expansion. The [overview](https://tanstack.com/table/latest/docs/overview) leaves markup, styles, events and state ownership to the application.                                                  | Strong fit for composing retained TailAdmin table/form primitives and our own draft/status behavior. We still implement and verify the visible UI, interactions, keyboard/accessibility and exact quantities.                                                                             |
| **Tabulator**      | A rendered JavaScript grid with its own CSS/setup, framework support and tree expansion. The [row implementation](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/core/row/Row.js) exposes a row-formatting hook. | A credible alternative when more rendered grid behavior is preferred. Its styling/widgets and custom React content/lifecycle need adaptation and validation against TailAdmin and our chosen flows. A row hook is not proof that our desired detail/edit behavior is already implemented. |
| **AG Grid**        | Rendered grid with documented custom Master/Detail; the relevant feature is Enterprise.                                                                                                                                                                              | Useful interaction reference and a possible separately licensed candidate. Choosing its demos does not require choosing its rendering or commercial package.                                                                                                                              |

Observed source manifest versions were `@tanstack/react-table` **9.3.1** and
`tabulator-tables` **6.7.1**, not installed/pinned release decisions.
The [TanStack React manifest](https://github.com/TanStack/table/blob/main/packages/react-table/package.json)
declares React `>=18`; the backoffice declares `^19.2.7`, so the peer ranges fit.
This is not a Next.js build or runtime compatibility test. The adapter's internal
TanStack Store dependency does not select an application-wide state architecture.
Its expansion source retains the supported controlled-state integration, so the
approved React state/Context and form-stack decisions remain the application basis.
Do not migrate to TanStack Router, Query, Form or another ecosystem package from
the homepage reference.

The initial recommendation was to qualify **TanStack Table inside the TailAdmin
design** first. The user did not select it and requested a broader comparison of
features and platform fit beyond styling. The assessment below supersedes that
recommendation. A grid engine does not supply missing API capabilities,
full-dataset sorting from a loaded page, business validation or write-confirmation
semantics.

### Review method and limits

The initial review used official web documentation and code examples. Live
browser access was unavailable. The web connector later lost authentication;
credential-free, read-only public-source retrieval completed the licence and
source review. Tabulator's linked examples and 6.3 docs
returned HTTP 403 in this environment, so its comparison uses official README,
manifest and source modules rather than an observed live demo. TanStack's raw
React expansion guide and all three licence sources were accessible. The
Tabulator source snapshot was `c9a7e67287557adba1fdde50a6e0e5c463a50769`.

No packages or demos were installed or executed. No performance benchmark,
interactive accessibility result, rendering match or production suitability is
claimed. Keep the pinned-version, 1440-minute release waiting period and blocked
dependency-script policy when a concrete installation is separately authorized.

## Full feature and platform-fit assessment — 2026-11-13

The user's follow-up asks which candidate is more powerful for Irin, considering
everything rather than headless styling alone. It selects neither candidate.
The distinction is between supplied grid behavior and the application work
needed to deliver Irin's selected workflows. The following is an assessment of
official source capabilities, not a completed implementation comparison.

### Verified capability comparison

| Area                                | Tabulator                                                                                                                     | TanStack Table                                                                                                                                       | Consequence for Irin                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sorting, filters and columns        | Rendered sorting/filtering and column visibility, moving, sizing and freezing modules.                                        | Engines for sorting, filtering/faceting, column visibility/order/sizing/pinning and pagination; application renders controls.                        | Both cover the underlying requirements; neither makes a loaded page equal the whole matching result set.                                                 |
| Expansion                           | DataTree supplies child-row expansion; row-formatting hooks permit custom row content.                                        | Explicit support for supplied sub-rows and application-rendered detail content.                                                                      | A supplied hierarchy differs from inspecting one product. Custom React detail lifecycle and focus still need qualification, especially for Tabulator.    |
| Editing and validation              | Edit and Validate modules, editor hooks, editability controls and local edit events.                                          | Application composes editors, validation and draft/save controls around the table engine.                                                            | Tabulator supplies more editing machinery; both need the agreed explicit editing modes and separate draft/confirmed states.                              |
| Cell ranges, keyboard and clipboard | SelectRange, Keybindings and Clipboard modules provide more complete grid operations.                                         | Current v9 includes rectangular cell selection and selection APIs; its guide leaves keyboard binding and clipboard serialization to the application. | This is a significant implementation difference for optional repeated work, not just a styling difference. Those product features remain unselected.     |
| Virtual rendering                   | Core options select vertical virtual rendering by default; horizontal rendering defaults to basic.                            | No built-in virtualization; integrate a virtualizer if the chosen data/rendering strategy needs it.                                                  | Tabulator supplies more infrastructure. Neither source establishes performance with Irin's exact cells, expansion or phone layout.                       |
| Files, printing and local undo      | Import, Download, Print and History modules exist; some file formats need external libraries.                                 | Equivalent user workflows require application code or other integrations.                                                                            | Tabulator offers a broader starting point, but file mapping, exact values and accepted business actions still belong to Irin.                            |
| View retention                      | Persistence supports default browser storage and custom reader/writer callbacks.                                              | Controlled state slices can be connected to application retention.                                                                                   | Neither automatically implements per-tab, same-business semantics. Tabulator's default persistence storage must not be mistaken for the selected policy. |
| React, forms and application state  | Supports React integration but renders and manages its own grid; custom React content and lifecycle need an adapter.          | React adapter and application-owned markup/events fit direct composition with retained controls, React state/Context and React Hook Form.            | TanStack's advantage extends beyond appearance to data flow, component lifecycle, forms and testing. This remains a fit inference until exercised.       |
| Phone and accessibility behavior    | Rendered behaviors and keyboard bindings provide a starting point; optional responsive hiding is not the chosen phone design. | Application controls semantic markup, pinned-column layout, focus and interactions.                                                                  | Both need the same touch, keyboard, focus and full-table mobile checks. Feature presence does not establish accessibility compliance.                    |

Tabulator's [module registry](https://github.com/tabulator-tables/tabulator/tree/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules)
and TanStack's [core features](https://github.com/TanStack/table/tree/main/packages/table-core/src/features)
support the comparison. TanStack v9 has cell selection and cell spanning; treating
it as lacking ranges based on an older release would be inaccurate. Its
[cell-selection guide](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/cell-selection.md)
supplies range/pointer APIs while explicitly leaving keyboard handling and
clipboard text formatting to the application. Its
[virtualization guide](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/virtualization.md)
explicitly separates Table from a virtualizer. TanStack Virtual is an example
integration, not an approved additional dependency or a mandatory small-table
requirement.

### Important integration details

- Tabulator's [Edit implementation](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Edit/Edit.js)
  supplies editor/editability hooks and local edit tracking. Its default edit
  trigger is focus when editors are configured; we would configure/gate editing
  to the selected explicit modes. A local `cellEdited` event does not confirm a
  backend write.
- Its [keyboard bindings](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Keybindings/defaults/bindings.js)
  include Tab/Shift+Tab, arrow navigation and paging/home/end operations. These
  are useful supplied behavior, not a claim of complete Excel equivalence or
  accessibility certification.
- Its [Clipboard implementation](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Clipboard/Clipboard.js)
  has copy/paste hooks and parsers. When enabled, its default paste action is
  insert. That cannot silently become permission to create products, overwrite
  recorded stock or bypass draft/validation boundaries.
- Its [core options](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/core/defaults/options.js)
  expose virtual rendering. Its [History module](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/History/History.js)
  implements local undo/redo, not reversal of confirmed business operations.
- Its [download formats](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Download/defaults/downloaders.js)
  include CSV, JSON, JSONLines, PDF, XLSX and HTML. The
  [XLSX exporter](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Download/defaults/downloaders/xlsx.js)
  looks up an XLSX dependency; the
  [PDF exporter](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Download/defaults/downloaders/pdf.js)
  uses jsPDF/autoTable. Export format support is not a complete inventory import
  or migration workflow, and those dependencies have not been selected/reviewed.
- Its [Persistence module](https://github.com/tabulator-tables/tabulator/blob/c9a7e67287557adba1fdde50a6e0e5c463a50769/src/js/modules/Persistence/Persistence.js)
  defaults to local storage/cookies when enabled and allows custom callbacks.
  This needs explicit adaptation to PT-005/PT-012/PT-013. Both projects support
  modular composition; modularity alone does not establish either as the winner.
- TanStack's [React state guide](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/table-state.md)
  supports controlled state slices with their callbacks. Its v9 atom mechanisms
  do not change the approved application state/Context or form-stack decisions.
  The [React expansion guide](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/expanding.md)
  expressly supports custom detail UI as distinct from child-row hierarchy.

### Recommendation after the broader comparison

**Tabulator leads in delivered grid features. TanStack leads in direct React
composition and application control.** The initial TanStack-first recommendation
gave too much weight to headless integration without enough weight to the grid
behaviors we would have to build and maintain. For Irin, reducing repeated-work
implementation is relevant alongside control of simple defaults, honest status
and exact data. Neither dimension establishes a final winner from source alone.

Recommend a small **comparison of both candidates against the same Irin cases**
before adoption, rather than choosing TanStack from styling flexibility alone.
This is a proposed qualification scope, not authorization to install/implement:

1. Preserve exact multi-measure quantities/statuses, leading-zero codes, stable
   product IDs and nonunique names, with read-only stock throughout editing.
2. Separate drafts from confirmed data and demonstrate explicit mode/save/cancel
   boundaries plus mocked rejected/uncertain results. Use generic editing
   fixtures until product fields and save/failure rules are selected.
3. Compare compact requested details with the retained panel and inspect focus,
   collapse/filter/virtualization lifecycle. Supplied child rows remain a
   separate concept; do not invent product families.
4. Exercise full phone scrolling, pinned Producto, controlled column choices
   and per-tab/same-business state, including return from details.
5. Compare the public-API adapter/custom code needed for React controls/forms,
   keyboard and any separately agreed clipboard capability probes. A probe
   does not approve that behavior as a first-release product feature.
6. Use identical agreed synthetic workloads and the existing static build,
   language/theme and Playwright review process. Measure rather than assume
   speed, bundle cost, accessibility or maintainability. No real customer
   volume, performance target or numerical success threshold is established.

Exact versions, fixture sizes, files, commands, optional dependencies and
installation scope require a bounded plan before work starts. No grid or UI
has been installed or executed; the source-access and live-demo limitations
above continue to apply. PT-001–017, TailAdmin, the selected application stack
and deferred backend/infrastructure scope remain unchanged.

## Executed qualification

The user delegated the comparison details after this desk assessment. The
[qualification results](qualification-results.md) provide actual browser,
rendering/heap, payload and accessibility evidence. Both tested workflows work;
Tabulator has the broader supplied feature set and better measured large-fixture
scroll/heap results, with similar large-mount cost. The final recommendation is TanStack Table for Irin's
React/business-workflow composition, smaller vendor payload and the tested
semantic-table accessibility result. This remains a recommendation, with the
native Tabulator findings and all evaluation limits recorded. No production
library, expansion model or editable field has been adopted.
