# Clarify release of a Pending departure

## Why

The missing-channel departure asks the merchant to verify the actual channel.
The current review keeps that confirmation checked when the channel changes.
The result also drops the movement facts that identify what was released.

## What changes

- Start a separate Storybook walkthrough in the existing Pendientes list.
  Put Revisar canal beside the return action after the exact inspector has
  confirmed the line is Pending.
- Keep the saved product, origin, quantity and recorded reason visible in the
  release review. Make the explicit confirmation apply to the selected channel.
- In the confirmed result, separate the saved quantity, the merchant's
  indicated channel and the signed stock effect returned by the fixture.
  Return through the existing Pendientes refresh and scope behavior.

The comparison uses the existing synthetic missing-channel departure.
[Resolution requirements](../define-pending-resolution-workspace/specs/pending-resolution-workspace/spec.md)
and [departure inspection](../define-pending-departure-inspection/specs/pending-departure-inspection/spec.md)
govern the walkthrough.
