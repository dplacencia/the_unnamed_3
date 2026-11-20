## Why

Merchant onboarding needs clear handoffs to account registration and clear
feedback when setup takes longer than expected. A verified email account's
security recovery and an Owner's merchant MFA policy need separate reviews.

## What Changes

- Preview native registration handoff, delayed business setup and confirmed trial
  access, confirmed pause and access status unavailable.
- Preview verified-email account security recovery, including uncertainty,
  status outcomes and native next steps. Keep normal logout and ordinary
  password recovery with the identity provider.
- Preview the Owner's merchant MFA policy, including future deadline changes
  within the existing grace bounds and fresh verification for each change.

## Capabilities

### New Capabilities

- `account-security-review` traces account security, onboarding and trial
  presentation to directions in Core.

## Impact

Adds localized Storybook examples and tests using synthetic responses.
Production registration, provider theme, account callback, lifecycle and
read-model integrations have separate delivery and verification.
