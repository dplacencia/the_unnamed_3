# First stock receipt design

## Starting point

PC-007 shows the product's details after creation is confirmed. Creation records
the product and its measurement configuration. A receipt is a separate addition
at a specified stock location. The [Inventory navigation map](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-004--agreed-initial-inventory-and-shared-area-map)
places movements and Pending work under Movimientos. Excel imports stay deferred
per the user's instruction. [Creation design](../define-product-creation/design.md)

The first slice is one actual receipt for one existing product, one existing
stock location and one positive quantity. For example, the merchant receives
12 kg of Tomate pera in the stockroom. An existing physical count or a correction
uses a different business operation. This pass is about recording an incoming
delivery and showing its result honestly.

## Source evidence

- The merchant journey includes a manual opening receipt at an eligible location
  without recorded stock. The current gateway exposes
  `POST /merchants/{merchant_id}/inventory/receipts` plus an exact stock read.
  The typed receipt response can be processed, rejected or unconfirmed. A
  processed response carries the line result of applied, Pending or rejected.
  HTTP success alone cannot establish that stock changed.
  [Inventory onboarding](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md)
  · [Gateway API](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
- The local Inventory profile includes `ReportReceiptBatch` and exact-pair
  `ReadStock`. One line fits the allowed report cardinality. The receipt adds a
  positive exact quantity at an explicit location when the line is applied.
  Application requires the product's measurement rules to be satisfied. The
  exact stock read is a separate operation
  with its own authority and result. [Local Inventory profile](../../../../the_unnamed_1/inventory/contract/README.md)
  · [Receipt contract](../../../../the_unnamed_1/openspec/specs/inventory-receipt-departure-processing-contract/spec.md)
  · [Recorded stock reads](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads/spec.md)
- In the gateway receipt request, the product is named by its permanent ID. The
  quantity has an exact coefficient, scale and unit. The backend can convert
  compatible units exactly and checks the applied quantity against the current
  product increment. It limits applied precision to six decimal places in the
  base unit. Counts in pieces must be whole. Source reference and occurrence time
  are optional. Occurrence time gives context and does not backdate stock effects.
  [Quantity contract](../../../../the_unnamed_1/openspec/specs/inventory-quantity-contract/spec.md)
  · [Gateway request and response contracts](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
- A Pending line records the report and its reasons with no applied quantity.
  Replaying the same report returns its retained result rather than resolving
  Pending. A technical failure may leave the original command unconfirmed.
  Recovery needs the same full operation identity and equivalent submitted
  content and current authority to retry. A refusal of a later attempt alone does
  not settle the earlier unknown outcome.
  [Retry contract](../../../../the_unnamed_1/openspec/specs/inventory-operation-identity-retries-contract/spec.md)
- Recording receipt authority and stock read authority are separate at the
  destination. The receipt returns its applied effect in the effective unit.
  An exact product/location read returns the current recorded stock in the base
  unit. It can return no record, an exact balance including zero, or an error.
  A separate failed or denied read preserves the confirmed receipt outcome.
  [Stock read contract](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads-contract/spec.md)
  · [Accepted gateway routes](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md)
- The checked acceptance scenario covers a product with no stock record, a
  Pending report that leaves that state intact, and a subsequent applied receipt
  that results in a recorded balance. These are source checks. No service or
  acceptance tests were run for discovery. [Acceptance scenario](../../../../the_unnamed_1/inventory/acceptance/tests/stock.rs)

## Selected entry points and destination

- **SR-002.** The user selected **“Movimientos + product shortcut
  (Recommended)”**. Offer “Registrar entrada” in Movimientos and a shortcut
  in confirmed product details. The shortcut carries the confirmed product
  identity into the same flow. A single entry in Movimientos was the alternative.
- **SR-003.** The user selected **“Always choose the destination explicitly
  (Recommended)”**. A new receipt starts without a location and requires a
  choice even when one eligible location is available. A location already used
  for stock viewing is independent of this selection.

## Selected quantity entry

- **SR-004.** The user selected **“Allow compatible units”**. The receipt offers
  compatible predefined units for the product's measurement dimension and shows
  the chosen unit with the entered quantity. For example, a product configured
  in kilograms can be received in grams. It keeps the exact entered quantity
  and selected unit for the receipt. Inventory checks the equivalent base-unit
  value against its precision and increment rules. An equivalent amount is
  computed exactly, with no rounding.
- **SR-005.** The user selected **“Confirm the unit change and clear the
  quantity (Recommended)”**. If an amount has been typed, ask before changing
  units. Confirming changes the unit and clears the amount. Cancelling preserves
  both. Explicitly showing and accepting an exact conversion was the alternative.
- **SR-006.** The user selected **“Default to the configured unit
  (Recommended)”**. Once the product is selected, show its configured unit as the
  initial quantity unit. The merchant may choose any compatible unit under
  SR-004 and SR-005. Keeping the unit blank was the alternative.
- **SR-007.** The user selected **“Offer an optional delivery reference”** under
  “Opciones avanzadas”. An empty reference is omitted. A supplied reference
  follows Inventory's exact text profile, including nonblank text and a 1,024
  UTF-8 byte limit. The occurrence time is outside the first form. Keeping only
  the essential fields was the alternative.
- **SR-008.** The user selected **“Correct known quantity errors before
  submitting (Recommended)”**. When the form can determine that an entered
  amount fails the available measurement rules, keep the exact draft and explain
  what needs correction. A deliberate Pending submission was the alternative.
  Inventory can still establish a Pending result after submission, for example
  if the product or the location changed since the form loaded.

## Selected submission, result and draft behavior

- **SR-009.** The user selected **“Submit directly from the form (Recommended)”**.
  Keep product, destination, amount and unit visible for checking. The deliberate
  “Registrar entrada” action sends the valid form. A separate confirmation step
  was the alternative.
- **SR-010.** The selected first-receipt scope includes showing the authoritative
  line outcome. Applied carries the exact applied effect and unit. A confirmed
  Pending line has a reason when Inventory supplies one and no applied stock effect.
  Rejected and unconfirmed each keep their own meaning. Show a known rejection
  without guessing a reason or treating a lost reply as rejection.
- **SR-011.** The user selected **“Read the balance automatically (Recommended)”**.
  Show the applied receipt immediately and request the exact current recorded
  balance for the same product and location when read access permits. Loading,
  no record, denied access and technical read failure keep the applied result
  visible. Retry a failed lookup independently. A lookup on request was the alternative.
- **SR-012.** The user selected **“Side panel on desktop, full screen on phones
  (Recommended)”**. Both entry points use the same panel and show the receipt
  result there. The alternative was a dedicated receipt page.
- **SR-013.** The user selected **“Confirm discard and keep the draft only in the
  open form (Recommended)”** for never-submitted drafts. Leaving with edits
  offers “Descartar cambios” and “Seguir editando”. A fresh form starts with its
  normal defaults. Retaining the unsent draft across reopening was the alternative.

## Selected recovery behavior

- **SR-014.** The user selected **“Use bounded automatic retries, then manual
  retry (Recommended)”**. Reuse [PC-009](../define-product-creation/specs/product-creation/spec.md#requirement-pc-009--bounded-retries-for-unconfirmed-creation).
  Up to three attempts per run preserve the original receipt identity and
  its exact product, destination, quantity, unit and any supplied reference.
  If the run stops with the outcome still unknown, offer explicit manual retry.
  First-attempt-only followed by manual retry was the alternative. A confirmed
  Pending line is an established outcome and this procedure does not release it.
- **SR-015.** The user selected **“Restore submitted receipts and resume on
  request (Recommended)”**. Reuse [PC-010](../define-product-creation/specs/product-creation/spec.md#requirement-pc-010--restore-submitted-creation-requests-on-return)
  for an accessible original receipt record in the same browser, business and
  user. Offer “Continuar recuperación” without sending a request on reopening.
  Use usable IndexedDB, then localStorage, then open-app memory. In memory mode,
  explain that recovery can be lost on refresh or close while receipt and retry
  remain usable. Open-app-only recovery was the alternative.

## Selected product picker

- **SR-016.** The user selected **“Use the editable selector from both entry
  points (Recommended)”**. The shared searchable product selector starts blank
  from Movimientos. The shortcut selects the confirmed product, and the merchant
  may change it. A product change after entering a quantity asks for confirmation.
  Confirming clears that quantity and loads the new product's configured unit.
  Cancelling preserves the previous product, quantity and unit. Keeping the
  shortcut's product fixed was the alternative.

## Production work to define separately

- Gateway chooser integration and availability of product and location
  eligibility data.
- Production storage and coordination details, such as record retention
  duration and handling an active run across tabs, are separate work.

## Scenarios for a later preview

Use the existing backoffice navigation and responsive panel with scoped fixture
products and stock locations. Start both from Movimientos and from confirmed
product details. Exercise the blank and preselected product picker, switching
products with a quantity present, a blank destination, a compatible unit
selection, an invalid increment, an optional reference and leaving an unsent draft.

For example, a fixture receipt of 500 g can show **500 g applied** and the
separate read can show **0.5 kg recorded** for the selected product and location.
Keep the receipt visible if the stock lookup fails, and retry that lookup on
its own. Separate fixture outcomes cover Pending with a known reason, rejection,
an unconfirmed reply, bounded retries, explicit resumption and memory-only
retention. These are proposed Storybook scenarios using the
[visual workflow](../define-visual-review-workflow/proposal.md).
