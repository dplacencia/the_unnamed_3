# Define Core merchant workspace entry

## Why

Merchants need a clear path from signing in to selecting an existing business or
creating their first one. The result must distinguish identity readiness,
business creation status and access to individual operations.

## What changes

- Give the backoffice a session handoff, business chooser, creation form and a
  workspace entry using the merchant returned by the applicable operation.
- Preview successful, pending, blocked, uncertain and unavailable states with
  synthetic responses in Storybook.
- Include a separate creator-name review scenario based on the recorded Core
  decisions for initial Owner membership.
- Keep creation recovery exact and apply the separately specified membership
  collection contract to the chooser.

## Capability

- `core-merchant-workspace` covers backoffice entry, membership discovery and
  creator-side status.

## Scope and authority

The user authorized autonomous preparation of Core and Inventory views and
OpenSpec for review. This slice follows the Core contracts and keeps the
prototype in Storybook. The live integration needs the published creation and
readiness routes and the separately specified merchant discovery route.
[Design and source records](design.md)
