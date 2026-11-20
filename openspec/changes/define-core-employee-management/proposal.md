## Why

A merchant can provide a work account to an employee without requiring a
personal email address. The employee account lifecycle needs its own review
alongside Team, Roles and email invitations.

## What Changes

- Add **Empleados** within the Core team workspace and direct Storybook examples
  for creating an employee account, moving its administrative association, and
  disabling or reactivating it.
- Use Core Sites or Areas for the administrative resource, as selected by the
  user. Keep access assignments separate.
- Preview authorized normal password reset, assisted MFA recovery and security
  recovery for a potentially compromised employee account.
- Preview the Owner's employee login code setup and change.

## Capabilities

### New Capabilities

- `core-employee-management` defines employee lifecycle and credential
  management in the merchant backoffice.

## Impact

This review adds localized Storybook designs and OpenSpec requirements.
Production needs the employee lifecycle and recovery operations, current
authority checks, provider outcomes, and a rollout for the approved Core
administrative resource model. The published browser API lacks these routes.
