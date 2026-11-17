# Define the first stock receipt in the backoffice

## Why

After creating a product, a merchant needs a way to record a delivery. This
flow connects the approved creation experience to Inventory's existing receipt
and recorded-stock operations. A merchant should be able to tell whether the
receipt was applied and what balance Inventory records at the selected location.

## What changes

- Define the first receipt in Movimientos for one product, one stock location
  and one quantity.
- Review which inputs are required, how to start from Products, and how to
  present receipt outcomes and the separately recorded stock balance.
- Record the user's choices in the [design](design.md) and
  [first stock receipt requirements](specs/first-stock-receipt/spec.md).

## Capabilities

### New capabilities

- `first-stock-receipt` covers the initial merchant-facing manual receipt.

### Modified capabilities

None.

## Authority and impact

The user deferred Excel imports and delegated selection of a feature already
defined in a sibling repository. They said **“good, go ahead”** after the
recommendation to define the first stock receipt. This authorizes frontend
definition and read-only source review. Physical counts, bulk import, Pending
resolution, a Storybook implementation and live gateway integration are separate
work.
