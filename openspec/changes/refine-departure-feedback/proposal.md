# Clarify stock departure outcomes

## Why

Registrar salida benefits from the same distinction as Registrar entrada
between an applied movement, a confirmed Pending result, rejection and an
outcome Inventory has yet to confirm. A merchant also needs to distinguish the
amount reported from the signed effect returned by Inventory.

## What changes

- Show four proposed result panels using the existing TailAdmin sheet, alert
  and button. Compare them with the approved departure views.
- Preserve the product, origin, channel and reported quantity with the result.
- Keep Pending and rejection tied to confirmed facts. Make retry of an
  unconfirmed submission explicitly about the same departure.

Use synthetic fixtures in Storybook for the comparison. The
[departure requirements](../define-first-stock-departure/specs/first-stock-departure/spec.md)
and [departure inspector](../define-pending-departure-inspection/specs/pending-departure-inspection/spec.md)
remain the behavior sources.
