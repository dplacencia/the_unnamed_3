# Consultar existencias design

## Starting point

NAV-004 places Existencias under Inventario. NAV-008 gives each relevant page its
own visible stock location. NAV-009 selects the sole known accessible location
for an initial view, asks when several locations are available, and remembers
explicit choices for that page while the tab is open. Keep these viewing rules
distinct from the receipt's explicit mutation destination. [Backoffice navigation](../define-backoffice-navigation/specs/backoffice-navigation/spec.md)

SR-011 already reads the exact product/location pair after a confirmed receipt
where authorized. Consultar existencias gives the merchant a standalone way to
read that pair later. For example, the merchant can look up Tomate pera at
Almacén and see the exact recorded balance there. [Receipt stock read](../define-first-stock-receipt/specs/first-stock-receipt/spec.md#requirement-sr-011--read-the-current-recorded-balance-after-application)

## Source evidence

- Inventory supports exact-pair `ReadStock` for a permanent product ID and one
  stock location. Product catalogue lookup and write authority are separate.
  The lookup returns recorded stock, whose meaning differs from verified
  physical stock or availability to sell. [Recorded stock reads](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads/spec.md)
  · [Local Inventory profile](../../../../the_unnamed_1/inventory/contract/README.md)
- The gateway path is `POST /merchants/{merchant_id}/inventory/stock/read` with
  an exact product and location selector. The operation reads current state
  without mutation metadata. Each attempt checks `stock:read` for that location.
  Receipt authority and merchant-wide catalogue read authority remain separate.
  HTTP success alone does not establish a recorded balance. The typed read can
  be processed, rejected or unconfirmed.
  [Exact read contract](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads-contract/spec.md)
  · [Gateway API](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
- An authorized, valid pair can yield an exact signed recorded balance with its
  base unit and current measurement configuration, including zero or a negative
  amount. It can instead yield `no_record`, which supplies no quantity. Denied
  access, an invalid pair and technical uncertainty retain their own meanings.
  The exact result has no physical verification flag, availability or observation
  timestamp. A retry is a fresh read of the pair, not recovery of a write command.
  [Exact read contract](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads-contract/spec.md)
- The released gateway slice does not provide a product or location collection
  for the chooser. Current product read is exact permanent ID. A simulated view
  can use known scoped fixtures without selecting production discovery. Backend
  exact reads can reach existing archived products or retired locations where
  authorized. Lifecycle filtering and access to choices are separate from the
  exact read's validity. [Gateway route scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md)
  · [Exact-read acceptance cases](../../../../the_unnamed_1/inventory/acceptance/tests/authority.rs)

The supporting source check inspected Inventory at `01c9218` and the gateway at
`86b1f20`. It did not exercise either service.

For design review, `0 kg` means a recorded zero. `−0.25 kg` is a recorded
negative quantity and keeps its sign. An authorized `no_record` response has no
number to display. A failed or unconfirmed response cannot establish any of
these results. The absence response also lacks measurement data, so any product
details shown alongside it need their own known source. Exact presentation and
copy remain design choices.

## Selected entry points

- **SL-002.** On 2026-11-18 the user selected **“Existencias + product and
  receipt shortcuts (Recommended)”**. Keep the standalone menu entry and offer a
  deliberate “Ver existencias” action from product details and an applied receipt.
  Product details carry the exact product. The receipt shortcut carries the exact
  product and location when authorized. The receipt's applied quantity is separate
  from the balance shown by the lookup. Existencias alone was the alternative.

## Location remembered for Existencias

- **SL-003.** On 2026-11-18 the user selected **“Use the receipt location for
  this visit only (Recommended)”**. The receipt location supplies the scope for
  that consultation. The next ordinary visit follows NAV-009 using any location
  previously selected in Existencias in that tab. If the merchant deliberately
  selects a location in the current lookup, that selection becomes the remembered
  choice according to NAV-009.

## Read activation and selection changes

- **SL-004.** On 2026-11-18 the user selected **“Load when both are selected
  (Recommended)”**. An eligible product and location selection triggers a fresh
  exact read, including when a shortcut provides the complete pair. Typing in
  product search finds choices. Selecting a product is what changes the pair.
- **SL-005.** On 2026-11-18 the user selected **“Clear the previous balance
  (Recommended)”**. A pair change clears the previous outcome immediately and
  puts the new complete pair in a loading state. An incomplete pair prompts for
  the missing selection. Superseded read responses cannot replace the outcome for
  the current consultation, even when the merchant switches back to an earlier
  pair.

## Product remembered for Existencias

- **SL-006.** On 2026-11-18 the user selected **“Remember explicit product
  choices per tab (Recommended)”**. A new tab starts with no product selected
  on ordinary entry. A later ordinary visit in the same tab and business starts
  with the last eligible product explicitly selected there. A shortcut supplies
  its product for that visit only. A product explicitly chosen in the selector
  updates the remembered selection. Restore the selection and read the balance
  afresh when the pair is ready.

## Product picker and balance display

- **SL-007.** On 2026-11-18 the user selected **“Reuse the searchable picker
  (Recommended)”**. Use the searchable picker pattern from Registrar entrada
  for product name search. Identify each choice by its exact product ID and
  distinguish duplicate names with a reference or product ID.
  [Receipt picker](../../../apps/backoffice/.storybook/stories/stock-receipt-form.tsx)
- **SL-008.** On 2026-11-18 the user selected **“Show the balance and unit only
  (Recommended)”**. Keep the product and location visible and present the signed
  exact amount in its base unit under “Existencias registradas”. For a recorded
  zero show the number and unit. For authorized absence use “No hay un registro
  de existencias para este producto en esta ubicación.” Leave measurement
  settings outside the result.

## Refresh and previous balance

- **SL-009.** On 2026-11-18 the user selected **“Refresh on request
  (Recommended)”**. After a balance or no-record result, “Actualizar” reads
  the current pair again. A technical failure offers “Reintentar” for a fresh
  read of the same pair. Returning focus to the open tab does not trigger a read.
  Entry and selection changes continue to follow SL-004 and SL-006.
- **SL-010.** On 2026-11-18 the user selected **“Keep the previous balance
  clearly labelled (Recommended)”**. During a refresh of the same pair, mark
  the retained balance “Resultado anterior”. A technical failure keeps that
  label and offers “Reintentar”. An initial technical failure has no balance
  to show. A successful read replaces the previous result, including when it
  reports no record. A denial or invalid pair clears the previous result.
  Changing the pair still clears the outcome under SL-005.

## A denied read or invalid pair

- **SL-011.** On 2026-11-18 the user selected **“Keep the selection visible
  where permitted (Recommended)”**. For an authoritative denial or invalid
  pair, explain the applicable outcome in the result area and clear any
  previous balance. Keep permitted selection labels visible and let the
  merchant choose another product or location. Reserve “Reintentar” for
  technical failures.

The user authorized the [simulated Storybook preview](preview-plan.md) on
2026-11-18.

## Starting checkpoint

The receipt implementation commit `ac24bbb` and approved reference commit
`04746ae` match the exact 20- and 85-file manifests. The tree and index were
clean with 1,228 accepted references before this design pass. The local receipt
is `.cache/receipt-checkpoint-complete.json`.
