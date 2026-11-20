# Define Pendientes browsing in Movimientos

## Why

Merchants need a way to find receipts that remain pending after closing the
receipt panel. The agreed sidebar keeps pending movement work inside
Movimientos. The exact receipt inspector already demonstrates opening and
checking one line. [Navigation requirements](../define-backoffice-navigation/specs/backoffice-navigation/spec.md#requirement-nav-004--agreed-initial-inventory-and-shared-area-map) · [Receipt inspector](../define-pending-receipt-inspection/specs/pending-receipt-inspection/spec.md#requirement-pri-004--keep-the-first-preview-within-the-open-receipt-panel)

## What changes

- Define how merchants browse the lines Inventory currently reports as
  Pending and open a listed receipt for exact inspection.
- Check Inventory's filters, access scope, pagination and row facts before
  choosing the list interaction.
- Record the technical evidence and the user's choices in the
  [design](design.md) and [browsing requirements](specs/pending-movements-browsing/spec.md).

## Capabilities

### New capabilities

- `pending-movements-browsing` covers finding currently pending lines in
  Movimientos and opening a listed receipt for inspection.

### Modified capabilities

None.

## Authority and impact

The user said **“go ahead”** after the recommendation to complete both pending
receipt inspection commits and then define Pendientes in Movimientos. This
assignment covered frontend definition and read-only review of sibling sources.
The verified starting checkpoint is recorded in the design. The user then
selected **“Build the simulated preview (Recommended)”** for the
[Storybook plan](preview-plan.md). Resolution workflows and production
gateway integration require separate decisions.
