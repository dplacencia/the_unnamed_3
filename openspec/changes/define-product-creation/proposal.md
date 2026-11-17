# Define product creation in the backoffice

## Why

Merchants need to add one product to Inventory without learning its quantity
configuration first. The accepted comparison gives us a simple starting point
with details available on request. The creation flow needs its own definitions
for the form, submission and result.

## What changes

- Record which parts of the [accepted comparison](../explore-product-creation-ui/proposal.md#authority-and-status)
  guide the flow and which details remain open.
- Check the [Inventory inputs and outcomes](design.md#inventory-constraints)
  that apply to a single product and use those findings to propose the frontend behavior.
- Record the user's choices as requirements as they are made. The
  [design](design.md) identifies proposals awaiting decisions.

## Capabilities

### New capabilities

- [Product creation](specs/product-creation/spec.md) records the selected simple
  fields, explicit unit choice, on-request measurement configuration, submission
  and recovery behavior.

### Modified capabilities

None.

## Authority and impact

The user said **“go ahead”** after the recommendation to define the product-creation
flow in OpenSpec, including required fields, defaults and simple/advanced behavior,
before building a Storybook preview. This pass covers definition and read-only
Inventory research. Storybook, application integration, spreadsheet import,
stock-entry design and deployment are separate work. Git commits are user-owned.
