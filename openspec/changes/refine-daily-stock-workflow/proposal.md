# Refine the daily stock workflow

## Why

Recording a delivery for an existing product is a useful test of how Irin
combines a compact workspace with a focused form and a clear result. The user
selected Productos → Registrar entrada → Existencias as the first UX comparison.

## What changes

- Add a separate Storybook comparison for the current and proposed workflows.
- Expose the approved receipt entry point inside the ordinary product details
  sheet. Keep the product editable and the destination an explicit choice.
- Give the quantity and unit a clear visual place in the form. Keep the delivery
  reference under Opciones avanzadas.
- Distinguish the confirmed movement from the current recorded balance and place
  Ver existencias with the balance. Review Pending and balance-read failure.

## Scope

The comparison uses the existing TailAdmin and Inventory fixture components.
It introduces synthetic results for visual and interaction review. Acceptance of
this proposal and its visual references follows review of the actual preview.
