# Product creation design

## Accepted basis

The [revised comparison](../explore-product-creation-ui/design.md#acceptance-of-the-revised-concept)
is an accepted design reference. In the simple form the name and measurement unit
are visible. Steps, increment, precision and code details are behind an explicit
request for more detail. Both presentations handle one product draft.
The sample product and kilogram selection, draft review button and retention
behavior illustrate options. The current decisions below supersede the example
defaults and settle disclosure only inside the creation flow.

Use the selected TailAdmin foundation, brand and five backoffice languages when
the design reaches a preview. Keep [simple by default](../establish-frontend-foundation/specs/frontend-scope/spec.md#requirement-scope-016--simple-by-default-complexity-chosen-by-the-user)
and preserve the [exactness and honest status value](../establish-frontend-foundation/specs/product-values/spec.md#requirement-val-002--exact-honest-and-dependable).
The [navigation map](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-004--agreed-initial-inventory-and-shared-area-map)
places Productos under Inventario. The Products table's selected stock location
scopes viewing. Creation has its own action and access rules.

## Inventory constraints

- The command takes a valid product name, a known measurement dimension and a
  compatible predefined base unit. Names follow Inventory's creation profile,
  including nonblank input, exact accepted text and a 1,024 UTF-8 byte limit.
  A product name can occur on multiple records.
  The form's unit choice can supply both dimension and unit. Inventory requires a
  supplied unit. It defines 15 predefined units across five dimensions. A used
  product identity cannot change its base unit, so a wrong choice can have lasting
  consequences.
- Omitting the entire increment field uses the selected unit's predefined exact
  increment. An empty increment object is invalid. A supplied increment must be
  positive and exactly representable in the base unit with at most six decimal
  places. Piece quantities are whole numbers. Precision derives from the
  increment. Exact defaults include 1 piece and 0.001 kg.
- The wire schema includes initial identifiers and family/variant fields. The
  current local native profile supports standalone creation without those fields
  and one measurement configuration. It excludes identifier assignment and the
  unit catalogue read. The current profile is recorded in the wire package's
  README as an approved operating profile pending publication. The sample SKU and
  barcode in the comparison remain illustrative.
- The creation request takes no location or opening quantity. Creating the record
  does not record stock, including zero. Subsequent stock operations have their own
  location, rules and outcomes.
- A confirmed result supplies the permanent product ID and established setup.
  After an ambiguous outcome, an equivalent retry uses the same full operation
  identity and original content. Name matching cannot confirm creation. Local
  operation lookup needs an operation reference that a lost reply may not supply.

Sources: [exact product name profile](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle-contract/spec.md),
[quantity rules and predefined units](../../../../the_unnamed_1/openspec/specs/inventory-quantities/spec.md),
[measurement contract](../../../../the_unnamed_1/openspec/specs/inventory-quantity-contract/spec.md),
[wire schema](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto),
[request validation](../../../../the_unnamed_1/inventory/application/src/adapters/validation.rs),
[local profile](../../../../the_unnamed_1/inventory/contract/README.md) and
[operation retry contract](../../../../the_unnamed_1/openspec/specs/inventory-operation-identity-retries-contract/spec.md).
Inventory was inspected at `01c9218b92a4e14ff337c35202bbf6ea23b5d471`.
The evidence is from repository sources. Service availability was not exercised.

## Selected form behavior

- **PC-001.** The user selected **“Choose the unit explicitly (Recommended)”**.
  Require the product name and one measurement unit, initially unselected. A
  preselected “Por unidades” option was considered. A single unit selection
  supplies the corresponding Inventory dimension and base unit.
- **PC-002.** The user selected **“Expand within the same form (Recommended)”**.
  Each new product opens in the simple view. The merchant expands “Opciones
  avanzadas” in the same form. Both views use one draft, and toggling the section
  preserves it.
- **PC-003.** The user selected **“Quantity settings only (Recommended)”** for
  the initial advanced scope. Offer a custom quantity step. With no custom step,
  use the selected unit's documented default. Initial identifiers are deferred.
- **PC-004.** The user selected **“Review the step after the unit changes
  (Recommended)”**. The standard step follows the selected unit. If the merchant
  has entered a custom step and changes unit, keep the previous value with its
  original unit visible and require an explicit choice of the new standard step
  or a valid new custom step. Confirming a reset before changing was the alternative.

## Selected creation flow

- **PC-005.** The user selected **“Create directly from the form (Recommended)”**.
  A deliberate “Crear producto” submits a valid draft. A separate review step
  was considered. The name and unit are available in the form for checking.
- **PC-006.** The user selected **“Side panel on desktop, full screen on phones
  (Recommended)”** for “Nuevo producto” from Productos. It preserves the existing
  table view. A dedicated page was the alternative. Access and any interaction
  with table editing remain distinct decisions.
- **PC-007.** The user selected **“Show the new product’s details (Recommended)”**.
  After a confirmed creation, show “Producto creado” and the created product's
  details in the same panel. Closing it returns to the existing table state.
  A product hidden by the current search or filters is still inspectable in the
  panel. Returning straight to the list with “Ver producto” was the alternative.
- **PC-008.** The user selected **“Confirm discard and keep the draft only in the
  open form (Recommended)”** for a draft that has never been submitted. Leaving
  the form with edits asks the merchant to discard or keep editing. Reopening
  starts a fresh draft. Submitted requests have a separate outcome lifecycle.
- **PC-009.** The user selected **“Use bounded automatic retries, then manual
  retry (Recommended)”**. Reuse the existing Products limits in
  [PT-034](../define-products-table/specs/products-table/spec.md#requirement-pt-034--initial-bounded-frontend-retry-profile)
  and [PT-038](../define-products-table/specs/products-table/spec.md#requirement-pt-038--explicit-manual-action-authorizes-a-bounded-recovery-run)
  for creation. Use up to three attempts per run, counting the original in the
  initial run. Each attempt has a 15-second client timeout, with retry waits of
  1 then 3 seconds randomized by ±50%. The retry uses the original identity and
  unchanged content. If the outcome remains unconfirmed, show “No hemos podido
  confirmar que se haya creado el producto” and offer an explicit manual retry
  with a new run of the same command. An equivalent retry can carry out the
  creation if no earlier attempt reached Inventory. It can also return the
  previously established result. One unanswered attempt followed by manual
  recovery was the alternative.
- **PC-010.** The user selected **“Restore submitted requests and resume on
  request (Recommended)”**. Keep the original submitted identity and content
  for unconfirmed creations scoped to the same browser, business and user.
  Offer “Continuar recuperación” on return if the record is accessible and
  resume with PC-009 only on request. Reuse the Products policy for
  [explicit resumption](../define-products-table/specs/products-table/spec.md#requirement-pt-031--restore-unresolved-operation-records-with-explicit-resumption)
  and [storage fallbacks](../define-products-table/specs/products-table/spec.md#requirement-pt-037--usable-persistence-fallbacks-with-honest-retention).
  Use IndexedDB if usable, then localStorage, then open-app memory. In memory
  mode, explain that refresh or close may lose the recovery record and keep
  creation and retry available. The alternative was open-app recovery only.

## Decisions that follow

- **Other surface behavior.** The permission model, interaction with active
  table editing and the exact labels, unit ordering and responsive details remain
  open. A later preview can check these details within its agreed scope.
- **Production coordination.** Active departure behavior, cross-tab coordination,
  storage reconciliation, retention duration and live API qualification are
  separate from the selected recovery and resumption rule.

All options in this section are for discussion. No global depth preference,
special permission or subsequent stock workflow is selected here.

## Starting checkpoint

The previous user commit `2652246224e635e609d6c3b6daa97948c77abae4` matched the
prepared six-file batch and the working tree and index were clean after it.
The receipt is `.cache/toolbar-followup-checkpoint-complete.json`. Its staging
authorization is complete. The prior visual comparison limitation remains recorded
in the [toolbar follow-up](../define-products-table/toolbar-rendering-followup.md).

## Scenarios for a later preview

The selected requirements give a future Storybook preview concrete cases: a fresh
form with no unit selected, standard steps for counted and weighed products,
expanding and collapsing advanced settings, reviewing a custom step after a unit
change, discarding or continuing an unsent draft, inspecting a confirmed product
hidden by the current table filters. Recovery cases include retrying the unchanged
command, explicitly resuming an accessible record on return and explaining the
limit of memory-only recovery. These states can be simulated independently of
production API integration. The
[visual workflow](../define-visual-review-workflow/proposal.md) governs any later
preview and candidate review.
