# Pending receipt inspection design

## Starting point

NAV-004 places pending movement work inside Movimientos. SR-010 already displays
an authoritative Pending reason when Inventory supplies one. Inventory records
the reported line without applying a stock effect. SR-014 governs receipt
submissions with an unknown outcome. Inspection starts with a confirmed line and
answers what Inventory has recorded for it. [Navigation requirements](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-004--agreed-initial-inventory-and-shared-area-map) · [Receipt outcome and recovery](../define-first-stock-receipt/design.md#selected-submission-result-and-draft-behavior)

The existing Pending Storybook scenario shows the original result while the
receipt panel is open. The new design will determine how the merchant can inspect
that exact line and what the available sources can establish.
[Receipt preview](../../../apps/backoffice/.storybook/stories/stock-receipt-preview.tsx)

## Native Inventory source evidence

- Native Inventory accepts `InspectPending` with the authenticated execution
  context and `selector.detail.line_reference`. The confirmed receipt line
  result supplies this stable reference. Current detail can be read with
  `include_business_history` omitted. The lookup is scoped by the line and
  merchant, so the original operation identity and the product/location
  selectors from Existencias are unnecessary.
  [Native protocol](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto#L1365) · [Report result contract](../../../../the_unnamed_1/openspec/specs/inventory-receipt-departure-processing-contract/spec.md)
- A found receipt view supplies the actual location, saved product resolution,
  and independently known or unresolved quantity and unit. The outcome can
  remain Pending with all retained admission reasons. If someone resolved it,
  the same reference can return Applied with its exact effect and timestamp
  or the retained rejection. The reasons explain admission as Pending.
  Current configuration may have changed since then. A balance and the raw
  submitted reference or quantity are separate data from the saved detail.
  [Detail contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md) · [Exact inspection acceptance scenario](../../../../the_unnamed_1/inventory/acceptance/tests/pending.rs#L265)
- The native detail requires current `report:inspect` access to the actual
  location through its applicable location or site scope. The same
  `unavailable` result covers a well-formed line reference with no visible
  Pending record, including nonexistent, foreign, never-Pending and protected
  lines. Malformed input is rejected. A technical retrieval failure gives an
  unconfirmed read. The separate discovery operation pages still-pending
  lines.
  [Inspection protection contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md) · [Inspection handler](../../../../the_unnamed_1/inventory/application/src/operations/inspection.rs#L15) · [Scope and protected result](../../../../the_unnamed_1/inventory/domain/src/inspection.rs#L424)

The native contract, core implementation and relevant acceptance scenario match
Inventory commit `88e5172`. This discovery inspected both repositories' sources.

## Gateway source evidence

- At gateway commit `84e5df2`, a confirmed receipt reply supplies its operation
  identity and reference, the exact line reference and Inventory's Pending reason
  codes with safe explanations. The original submitted line is the source for its
  product, location and reported quantity when those facts are visible. The
  Pending payload itself supplies the reasons.
  [Receipt response](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json#L2688) · [Pending line schema](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json#L2833)
- The public route allowlist covers receipt submission and the initial Inventory
  journey operations. The native protocol also declares Pending inspection and
  operation and movement-line lookup. Exposing those reads through the gateway
  requires a separate route and access contract.
  [Approved route scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md) · [Gateway operation mapping](../../../../the_unnamed_2/platform/gateway/lua/apisix/plugins/inventory-context.lua#L31) · [Backend operation allowlist](../../../../the_unnamed_2/backend/src/context.rs#L21)
- JNY-015 calls for an authorized merchant to see Pending status and reasons in
  the first Inventory journey. Release, rejection and duplicate cancellation have
  their own requirements. The public receipt result can anchor an original-result
  view. A current status or later rediscovery requires its own authorized read.
  [Inventory journey requirements](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md)

## Selected entry point and read

- **PRI-002.** On 2026-11-19 the user selected **“Design the exact inspector
  with a simulated read (Recommended)”**. Show “Ver detalles” on the
  confirmed Pending receipt result in Movimientos. Use the exact line reference
  from that result to simulate the native current-detail read under the
  merchant's current inspection access. The displayed inspection outcome comes
  from that read, and may show a resolution recorded since the original reply.
  The original receipt outcome remains its own record. This decision selects
  the inspection design and its data source for Storybook.

## Selected panel and return action

- **PRI-003.** On 2026-11-19 the user selected **“Reuse the receipt panel
  (Recommended)”**. Show the inspector in the open receipt panel, which is
  a side panel on desktop and full screen on phones. “Volver a la entrada”
  returns to the original confirmed receipt result within that panel.
  [Receipt panel requirement](../define-first-stock-receipt/specs/first-stock-receipt/spec.md#requirement-sr-012--open-the-receipt-and-show-its-outcome-in-a-responsive-panel)
- **PRI-004.** On 2026-11-19 the user selected **“Keep this preview within the
  open receipt panel (Recommended)”**. Merchants can open inspection and return
  to the receipt result while its panel is open. Closing the panel ends that
  preview flow. Finding an earlier receipt belongs to the later design of
  Movimientos browsing.

## Selected default facts

- **PRI-005.** On 2026-11-19 the user selected **“Show status and receipt
  facts together (Recommended)”**. The default view shows the outcome returned
  by the exact line read and the saved product, actual location and exact
  quantity and unit where known. A still-pending line shows the reasons
  Inventory retained when it recorded the line as Pending. A confirmed stock
  effect appears separately from the saved receipt quantity. A quantity value
  and its unit can be known independently.

## Selected result labels

- **PRI-006.** On 2026-11-19 the user selected **“Label the original result
  and current status (Recommended)”**. Use “Resultado al registrar la
  entrada” for the confirmed original outcome and “Estado actual” for the
  outcome returned by inspection. Both labels apply even if the outcomes
  agree. Going back after a subsequent resolution shows the original outcome
  with its time context.

## Selected loading and read failure behavior

- **PRI-007.** On 2026-11-19 the user selected **“Show only the inspection
  state (Recommended)”**. Show a neutral loading state while the exact read
  is pending. A technical failure offers “Reintentar” for a fresh read
  of the same line. An unavailable response shows “No se pueden consultar
  los detalles de esta entrada” because Inventory groups several causes in
  that outcome. These states show the inspection outcome alone. “Volver a
  la entrada” remains available to access the original result.

## Selected refresh behavior

- **PRI-008.** On 2026-11-19 the user selected **“Offer Actualizar in the
  inspector (Recommended)”**. Once the inspector shows the current receipt
  outcome, “Actualizar” requests a fresh read of the same exact line under
  current inspection access. Show the agreed neutral loading state until the
  latest read completes. “Reintentar” remains the action for a technical
  read failure.

The user authorized the [Storybook plan](preview-plan.md) on 2026-11-19.
It proposes 52 visual candidates and scoped behavior checks.

## Starting checkpoint

The user commits `d9952de` and `8cf7743` match the 25-file preview and 65-file
reference manifests for Consultar existencias. The working tree and index were
clean with 1,292 accepted references. The local proof is
`.cache/stock-lookup-checkpoint-complete.json`.
