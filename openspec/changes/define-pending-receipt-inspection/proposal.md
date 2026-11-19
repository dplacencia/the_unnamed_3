# Define inspection of a pending receipt

## Why

Inventory can confirm that it recorded a receipt line as Pending. A merchant
needs to understand what Inventory recorded, the reason it supplied and which
stock outcome it confirmed. The agreed navigation puts that work inside
Movimientos. [Receipt design](../define-first-stock-receipt/design.md#selected-submission-result-and-draft-behavior) · [Navigation requirements](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-004--agreed-initial-inventory-and-shared-area-map)

## What changes

- Define read-only inspection of one specifically identified, confirmed pending
  receipt line.
- Check what the Inventory and gateway contracts let the frontend identify and
  display. Use that evidence to propose how a merchant opens the inspection and
  which facts appear.
- Record accepted choices and remaining questions in
  [the design](design.md) and [the inspection requirements](specs/pending-receipt-inspection/spec.md).

## Capabilities

### New capabilities

- `pending-receipt-inspection` covers read-only inspection of one confirmed
  receipt line.

### Modified capabilities

None.

## Authority and impact

The user said **“go ahead”** to defining inspection of a confirmed pending
receipt in Movimientos after the verified Consultar existencias checkpoint.
This authorizes frontend definition and read-only review of sibling sources.
Queue browsing, resolution actions, Storybook implementation and live gateway
integration require separate decisions.
