# Resolve eligible movements from Pendientes

## Why

The November 30 review includes Pending resolution. Merchants need to act on
confirmed facts from the current movement and see whether their action applied
stock, retained a rejection, or remains unconfirmed.

## What changes

- Keep the exact movement reference and its current status visible when a
  merchant prepares a release or records that a pending receipt never arrived.
- Present duplicate cancellation as a separate whole-batch decision when the
  complete target and eligible surviving counterpart are available.
- Preview review, confirmation, retained results, current access denial and
  unchanged-command recovery in Storybook.

## Scope

The user confirmed Pending resolution for the November 30 review. The
[review design](design.md) uses synthetic inputs in the existing TailAdmin
workspace. The native resolution methods define the business boundary.
[Onboarding requirements](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md#requirement-jny-016--release-eligible-pending-items)
