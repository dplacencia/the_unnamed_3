# Clarify stock receipt outcomes

## Why

A receipt panel can show a confirmed Pending movement, a submission whose
outcome is unknown, or a confirmed receipt with a failed balance lookup. Each
situation needs a different next action. The merchant should see what Inventory
confirmed before deciding what to do.

## What changes

- Compare the current Pending result and a compact proposed result notice using
  the same synthetic receipt.
- Preserve the original result, exact movement facts and recorded reasons.
  Reuse the current-status inspector and its exact line reference.
- Show the uncertain receipt and failed balance read beside the comparison
  as examples of the different retry actions.

The Storybook comparison follows the existing receipt and inspection contracts.
[Receipt requirements](../define-first-stock-receipt/specs/first-stock-receipt/spec.md)
· [Inspection requirements](../define-pending-receipt-inspection/specs/pending-receipt-inspection/spec.md)
