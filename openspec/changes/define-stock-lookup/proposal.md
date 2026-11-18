# Define the recorded stock lookup

## Why

The receipt preview shows recorded stock immediately after the merchant receives
a delivery. The merchant also needs to consult that balance later in Existencias.
Start with a single product at a single stock location, using the exact read
already supported by Inventory.

## What changes

- Define how to open the lookup, identify the product and location, and read the
  recorded balance for that pair.
- Define how to show values and precise read outcomes, including zero, absence,
  unavailable data and errors.
- Capture the selected choices and their constraints in the [design](design.md)
  and [stock lookup requirements](specs/stock-lookup/spec.md).

## Capabilities

### New capabilities

- `stock-lookup` covers a merchant's read of recorded stock for an exact pair.

### Modified capabilities

None.

## Authority and impact

The user said **“go ahead”** after the recommendation to define Consultar
existencias for one product and one authorized location. The assignment covers
frontend definition and read-only source review. Collection browsing, multi-location
totals, physical verification, stock mutations and implementation are separate work.
Excel imports remain deferred.
