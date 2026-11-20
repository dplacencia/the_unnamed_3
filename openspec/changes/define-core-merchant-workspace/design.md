# Core merchant workspace entry

## Source contracts

- Account readiness precedes merchant use. The existing browser flow starts
  identity-provider sign-in and reconciles an authenticated session. The view
  represents reconciling, confirmed session and unavailable checks as distinct
  states.
  [Identity requirements](../../../../the_unnamed_2/openspec/specs/customer-identity/spec.md)
  · [Browser reconciliation](../../../../the_unnamed_2/platform/gateway/backoffice/app.js#L142)
- The creation body contains `caller_operation_id` and exact `name`. The
  creator needs a verified email. A name contains non-whitespace content and
  fits the 255 UTF-8 byte limit. Replaying the same identity and exact name
  yields the same reservation. Creator readiness yields `merchant_id` and
  `pending`, `blocked` or `ready`. The creation response may be HTTP 202
  for pending or blocked, so the body state controls the view.
  [Gateway OpenAPI](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
- The specified merchant discovery response contains active memberships with
  `merchant_id` and `name`, independently of readiness and assigned roles.
  Use only returned continuation tokens and omit the count by requesting the
  specified estimate opt-out. Keep discovery, creator readiness and
  operation-specific permissions independent.
  [Merchant discovery draft with recorded decisions](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md#requirement-mer-043--caller-merchant-discovery)

## Views

Use the approved Irin typography, palette and TailAdmin controls for simple
account entry and status views. Keep one primary action visible for each
state. The chooser displays supplied business names and lets the person select
one by identity. A successful empty result offers creation. A failed listing
offers a retry.

After sending a creation request, freeze the identity and exact name. An
uncertain result offers a retry with that same request. Once an ID is confirmed,
use the creator readiness read for that exact ID. Pending and blocked states
allow a deliberate status check. A readiness error keeps the confirmation
action unavailable until a successful read.

Open the created workspace after confirmed readiness. For an existing
membership, selection establishes an active merchant context. Its downstream
views need their own access results. The prototype closes at that workspace
entry boundary.

## Review and live dependencies

Storybook exercises the presentation with deterministic in-memory responses
and five locales. The identity handoff is simulated. Exact snapshots, readiness
and token requests can be exercised interactively. Live selection depends on
the merchant collection contract and the remaining Core admission decisions.
Live continuation into authorized screens depends on the relevant Core and
Inventory contracts. The status refresh and retry controls in this preview
show explicit user actions. Live timing and browser retention need their
applicable contract and deployment decisions.

The user selected **“Include creator names in a separate preview”**. The
standard creation preview follows the published body. The separate preview
uses the creator object selected by S108 and S109. Current-account profile
hints appear for review, an explicit absence choice supplies `last_name: null`,
and the submitted body retains the reviewed names. Validate the 4096-byte
pre-trim bound, 255 Unicode code points after trimming, nonblank strings and
retained Cc controls. Preserve the original request on an uncertain retry.
Production wiring depends on publication of the updated creation contract.
[Creator-name decisions](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md)
