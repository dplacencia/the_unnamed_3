# Inspect a pending Salida from Movimientos

## Why

Pendientes shows receipts and departures together. Merchants can open a listed
receipt and check its current state, while a departure currently offers only its
recorded reasons inline. Extend the inspection pattern to Salida without adding
columns to the compact list. [Browsing design](../define-pending-movements-browsing/design.md#selected-movement-kinds)

## What changes

- Open a listed Salida in the existing responsive inspector by exact line
  reference, then return to the same Pendientes browsing position.
- Show its saved facts, recorded channel, reasons and any confirmed resolution
  or stock effect. Keep unknown facts explicit.
- Use a documented pending-departure reason in the simulated list and verify the
  preview in all five supported languages.

## Capabilities

- `pending-departure-inspection` covers read-only inspection of a listed
  departure.

## Authority and impact

On 2026-11-20 the user said **“go ahead”** to defining the Pending Salida
inspection slice in OpenSpec and building its read-only Storybook preview. The
assignment includes synthetic data and exact visual review. Production gateway
integration and stock-changing workflows are separate assignments. See the
[design](design.md) for the native read and reuse boundaries.
