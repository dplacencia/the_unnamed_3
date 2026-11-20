## Identity handoff and initial access

The application starts registration through the existing hosted identity flow.
The separate signup Storybook example simulates handoff and shows the existing
verification notice. The underlying provider owns registration fields,
credentials, email verification and MFA setup. The signed-out example and
creator-name variants keep their existing previews.
[Native identity](../../../../the_unnamed_2/openspec/specs/identity-authority/spec.md#requirement-iau-020--native-account-flows)
· [Local gateway prototype](../../../../the_unnamed_2/platform/gateway/backoffice/index.html)

Use a separately supplied delayed-setup fixture for the existing business
readiness screen. This illustrates the approved general delay status without
provider diagnostics. The current readiness schema has pending, blocked and
ready. A production delay indicator needs a current authoritative signal,
rather than a timer started on browser entry.
[Setup delay](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/billing-state/spec.md#requirement-bil-028--pending-merchant-entitlement-reconciliation)

The access status preview accepts a confirmed active trial with its optional
authoritative end timestamp, a confirmed pause after expiry, or an unavailable
read. Scope visibility and individual permission still depend on the applicable
Core checks. The component displays an exact supplied time with its UTC zone.
The automatic initial trial starts in provisioning when Stripe creates it.
A confirmed business does not trigger another start. This preview supplies no
checkout or operator extension control.
[Inventory access](../../../../the_unnamed_2/openspec/specs/inventory-access/spec.md)
· [Automatic start amendment](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/inventory-access/spec.md)
· [Billing state](../../../../the_unnamed_2/openspec/specs/billing-state/spec.md)

## Account security

The account example is for a verified email account holder. A deliberate
confirmation starts their own security recovery. Pending or loss of status
access never claims completion. The fixture illustrates pending,
action required, support required and completed, as well as unconfirmed
submission, unavailable status credential and refusal for incomplete merchant
creation. The review demonstrates an ordinary manage-sessions handoff separately,
and action-required and expired-status paths point to native sign-in and
password request. The simulation issues no credential and makes no provider or
gateway request. Actual browser status integration must use the issued status
credential and honour the published polling and throttling behavior.
[Email-account recovery](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/customer-identity/spec.md#requirement-idn-029--email-account-self-service-security-reset)
· [Browser contract](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)

An Owner can preview requiring MFA, adjusting the future grace deadline no later
than 60 days from enablement or stopping enforcement. Each change has a fresh
MFA handoff; a simulated refusal preserves the current policy. The preview
uses deterministic dates and never infers the policy from the person's session
or prior verification. Provider challenge fields, backend authority checks
and version of the eventual policy route remain separate.
[Merchant MFA](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/customer-identity/spec.md#requirement-idn-006--merchant-specific-mfa-enrollment)

## Live boundary

The custom provider theme remains a non-local deployment gate and the approved
legal materials and recorded acceptance gate real customer registration.
The shipped recovery route does not supply a ready Irin product integration.
Live policy changes and trial or delay states still need their applicable
Core browser contracts. The paid lifecycle and provider-theme work remain
separately scoped.
[Provider theme proposal](../../../../the_unnamed_2/openspec/changes/brand-keycloak-login-theme/proposal.md)
· [Non-local deployment gate](../../../../the_unnamed_2/openspec/specs/public-technology-confidentiality/spec.md#requirement-tdc-004--violations-are-security-findings)
· [Legal readiness](../../../../the_unnamed_2/openspec/specs/customer-identity/spec.md#requirement-idn-020--legal-readiness-for-real-registration)
