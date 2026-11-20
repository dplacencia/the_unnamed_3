# November 30 Core and Inventory review

The user requires live Core and Inventory for November 30, including Pending
resolution and live stock commitments. The scope follows Core's
[Inventory journey JNY-001–021](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md)
and the Core merchant workspace. JNY-022–026 defer bulk import, counts and
transfers and exclude a POS app and Integrations module from this journey.
The Storybook views and OpenSpec changes below cover the review. The browser
contracts and verified live flows remain release work.

## Visual approval

On November 20, 2026, the user replied “I approve them” to the
[944-image gallery for run `2026-11-20T16-30-47.589Z`](http://localhost:9324/runs/2026-11-20T16-30-47.589Z/review.html).
All 944 candidates were promoted. Their hashes and all 1,456 earlier reference
hashes verify against the registry, which now contains 2,400 references.

The gallery covers 148 Storybook views across the four approved profiles, with
all five languages represented. The 328 new captures cover the additions from
the coverage audit below. All 616 captures from the
[previous Employee gallery](http://localhost:9324/runs/2026-11-20T13-51-23.289Z/review.html)
match byte for byte in the approved run.

A fresh comparison passed all 944 approved cases on the same source and pinned
Chromium renderer. [Playwright results](http://localhost:9324/runs/2026-11-20T18-55-37.506Z/playwright-report/index.html)

`pnpm check` passed with 248 code tests, strict OpenSpec validation passed all
26 changes, and pinned Chromium passed 162 interaction tests for the connected
Owner and changed Core and Inventory views, including shared navigation,
receipt, departure and recorded stock checks. Capture used source
`0e9abd97ce324ad31ce2c92272f2391186f098c1f5003436e47a388e37a24cc8`.
The [36 sampled approved-reference comparisons](http://localhost:9324/runs/2026-11-20T16-34-01.925Z/playwright-report/index.html)
also passed.

## Core workspace

Start with the [connected Owner journey](http://localhost:6006/?path=/story/core-owner-journey--new-business)
or [choose an existing business](http://localhost:6006/?path=/story/core-owner-journey--business-selection).
Create a Core Site and its first Area, link an Inventory stock location, add a
product, and record opening stock. Create and explicitly enable a departure
channel before recording the departure. Select **Ver existencias** on the
confirmed movement to read its exact product and location. The prepared
[recorded stock view](http://localhost:6006/?path=/story/core-owner-journey--recorded-stock)
shows the result of receipts of 10 and 5 and a departure of 3. Business
switching keeps the confirmed fixture records scoped to each business.
[Owner journey design](../assemble-owner-journey/design.md)

| Review                                                                       | OpenSpec                                                                | Storybook                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign-in handoff, business list, creation, readiness and workspace            | [Merchant workspace](../define-core-merchant-workspace/design.md)       | [Sign-in](http://localhost:6006/?path=/story/core-merchant-workspace--sign-in), [businesses](http://localhost:6006/?path=/story/core-merchant-workspace--business-list), [create](http://localhost:6006/?path=/story/core-merchant-workspace--new-business)           |
| Separate creator-name form, as requested                                     | [Creator names](../define-core-merchant-workspace/design.md)            | [Create with creator names](http://localhost:6006/?path=/story/core-merchant-workspace--new-business-with-creator-names)                                                                                                                                              |
| Sites and Areas, scoped reads, archive checks and restoration                | [Hierarchy](../define-core-site-areas/design.md)                        | [Sites and Areas](http://localhost:6006/?path=/story/core-sites-and-areas--overview)                                                                                                                                                                                  |
| Team, member-name editing, roles, assignments and invitations                | [Team access](../define-core-team-access/design.md)                     | [Team](http://localhost:6006/?path=/story/core-team-access--members), [edit name](http://localhost:6006/?path=/story/core-team-access--edit-member-name), [invite](http://localhost:6006/?path=/story/core-team-access--new-invitation)                               |
| Employee account creation, Site or Area, status, credentials, and login code | [Employee management](../define-core-employee-management/design.md)     | [Employees](http://localhost:6006/?path=/story/core-employee-accounts--overview), [credentials](http://localhost:6006/?path=/story/core-employee-credentials--actions), [login code](http://localhost:6006/?path=/story/backoffice-core-employee-login-code--current) |
| Separate role-preselection and acceptance, as requested                      | [Invitation contract versions](../define-core-team-access/design.md)    | [Select a role](http://localhost:6006/?path=/story/core-team-access--new-invitation-with-role), [accepted](http://localhost:6006/?path=/story/core-team-access--invitation-accepted-with-role)                                                                        |
| Independent enablement, dependencies and provider availability               | [Capability enablement](../define-core-capability-enablement/design.md) | [Explore modules](http://localhost:6006/?path=/story/core-capability-enablement--explore)                                                                                                                                                                             |

## Inventory journey

| Review                                          | OpenSpec                                                                                                                                                                                             | Storybook                                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stock locations, channels and explicit ordering | [Inventory setup](../define-inventory-setup-workspace/design.md)                                                                                                                                     | [Setup](http://localhost:6006/?path=/story/backoffice-inventory-setup--overview)                                                                                                                                                                           |
| Product browsing, creation, editing and archive | [Products](../define-products-table/design.md), [creation](../define-product-creation/design.md), [archive](../define-product-archive/design.md)                                                     | [Catalogue](http://localhost:6006/?path=/story/inventory-products--catalogue), [create](http://localhost:6006/?path=/story/inventory-product-creation--catalogue), [archive](http://localhost:6006/?path=/story/inventory-product-lifecycle--confirmation) |
| Receipts and departures                         | [Receipt](../define-first-stock-receipt/design.md), [departure](../define-first-stock-departure/design.md)                                                                                           | [Receipt](http://localhost:6006/?path=/story/inventory-first-stock-receipt--movements), [departure](http://localhost:6006/?path=/story/inventory-first-stock-departure--movements)                                                                         |
| Recorded stock and channel availability         | [Recorded stock](../define-stock-lookup/design.md), [availability](../define-channel-availability/design.md)                                                                                         | [Recorded stock](http://localhost:6006/?path=/story/inventory-stock-lookup--lookup), [channel availability](http://localhost:6006/?path=/story/backoffice-channel-availability--lookup)                                                                    |
| Pending list, both inspectors and resolution    | [Browsing](../define-pending-movements-browsing/design.md), [departure inspection](../define-pending-departure-inspection/design.md), [resolution](../define-pending-resolution-workspace/design.md) | [Pending list](http://localhost:6006/?path=/story/backoffice-pending-movements-browsing--all-locations), [resolve](http://localhost:6006/?path=/story/backoffice-pending-resolution--review-release)                                                       |
| Reserve, release and fulfill commitments        | [Stock commitments](../define-stock-commitments-workspace/design.md)                                                                                                                                 | [Reserve](http://localhost:6006/?path=/story/inventory-stock-commitments--reserve), [release](http://localhost:6006/?path=/story/inventory-stock-commitments--release), [fulfill](http://localhost:6006/?path=/story/inventory-stock-commitments--fulfill) |

## Additions from the coverage audit

- Signup handoff, delayed merchant setup and trial access.
  [Signup](http://localhost:6006/?path=/story/core-merchant-workspace--signup-handoff) ·
  [Delayed setup](http://localhost:6006/?path=/story/core-merchant-workspace--creation-delayed) ·
  [Paused trial](http://localhost:6006/?path=/story/core-owner-journey--trial-paused)
- Verified-email account security recovery and the merchant MFA policy with a fresh
  check and explicit grace period.
  [Account recovery](http://localhost:6006/?path=/story/core-account-security--recovery-confirmation) ·
  [MFA grace](http://localhost:6006/?path=/story/core-account-security--merchant-mfa-grace) ·
  [OpenSpec](../define-account-security-review/design.md)
- Team role edit and deletion, non-employee membership deactivation, reactivation
  and removal, invitation acceptance and unresolved delivery, and assignment
  following employee creation.
  [Edit role](http://localhost:6006/?path=/story/core-team-access--role-edit) ·
  [Reactivate](http://localhost:6006/?path=/story/core-team-access--membership-reactivate) ·
  [Accept invitation](http://localhost:6006/?path=/story/core-team-access--accept-invitation) ·
  [Employee access](http://localhost:6006/?path=/story/core-team-access--employee-assign-access)
- Hierarchy archive filtering, permission and invitation reference refusals,
  paging, and explicit retry of an unconfirmed hierarchy creation.
  [Archived resources](http://localhost:6006/?path=/story/core-sites-and-areas--archive-filter) ·
  [Unconfirmed creation](http://localhost:6006/?path=/story/core-sites-and-areas--unconfirmed-create)
- Weekly stock-location calendars with exact overnight windows and dated
  exceptions, Pending receipt release and authorized duplicate counterpart
  selection, and hold settings with an explicit reservation scope.
  [Calendar](http://localhost:6006/?path=/story/backoffice-inventory-setup--scheduled-calendar) ·
  [Release receipt](http://localhost:6006/?path=/story/backoffice-pending-resolution--review-receipt-release) ·
  [Duplicate counterpart](http://localhost:6006/?path=/story/backoffice-pending-resolution--select-counterpart) ·
  [Hold settings](http://localhost:6006/?path=/story/inventory-stock-commitments--hold-settings) ·
  [Reservation scope](http://localhost:6006/?path=/story/inventory-stock-commitments--select-scope)

## Live release work

Employee management requires its own public Core lifecycle, credential and
login-code contracts. The user chose Core Sites and Areas as employee
administrative resources. Core needs the corresponding per-action grants and
provider integration. The current role-administration scope leaves employee
lifecycle out. [Employee dependencies](../define-core-employee-management/design.md#release-boundary)

| Dependency                                     | Verified status and next delivery                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inventory commitments and channel availability | The native contract defers reservation, release, fulfillment, exact commitment read and channel-aware availability. The published browser gateway has no such mapping. Deliver the native contract and executing service, then enforce merchant and resource authority in the gateway, and exercise original-operation delivery/recovery and exact effects in the browser. Keep one authoritative ledger in Inventory. [Native contract](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability-contract/spec.md), [gateway scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md)                                                                 |
| Core workspace and permission checks           | Published merchant creation and creator readiness support the start of the journey. Merchant discovery, Sites/Areas and team administration depend on the corresponding implemented Core routes and current-scope checks. Keep the separately previewed creator-name and invite-role flows tied to their respective contracts. [Core hierarchy and administration](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/design.md), [Membership and invitations](../../../../the_unnamed_2/openspec/changes/database-owned-merchant-membership/specs/merchant-access/spec.md)                                                                                                   |
| Inventory setup and movement inputs            | The current gateway pin exposes Inventory-local site/location creation and channel writes. A Core Area is a separate resource. The live path needs the agreed Core Area link and authorized reads for configured locations, products and enabled channels in recorded order. [Module ownership](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md), [gateway bounds](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md)                                                                                                                                                                                                                                 |
| Inventory catalogue and Pending work           | The current pin exposes permanent-ID product and exact recorded stock reads, and receipt and departure writes. Products need approved catalogue reads and edit/archive exposure. Pending work needs authorized list, exact details and resolution, including the exact identifiers and facts each action requires. [Gateway contract](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json), [Pending contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md)                                                                                                                                                                      |
| Live frontend and deployment                   | The previews use synthetic data. Connect static backoffice routes to the approved session and browser contracts. Verify an Owner can enter the correct business, configure a Core Site/Area and Inventory stock location, create and edit products, receive and depart exact quantities, resolve Pending and reserve/release/fulfill stock. Verify a scoped team member's allowed and denied actions. Apply Core's non-local login theme gate and, for real customer signup, legal acceptance requirements. [Deployment readiness](../../../../the_unnamed_2/openspec/specs/deployment-readiness/spec.md), [customer identity](../../../../the_unnamed_2/openspec/specs/customer-identity/spec.md) |

Prioritize the native and gateway commitments work in parallel with Core
workspace and Inventory configuration reads. Frontend contract integration can
proceed against callable operations, with the Owner journey serving as the
end-to-end release check once the blocking contracts are supplied.

In the live journey, verify that reservation and release leave recorded
physical stock unchanged, fulfillment changes it exactly once, and the channel
availability view shows the authoritative result for the selected scope. For
whole-batch duplicate cancellation, agree how the authorized frontend obtains
both complete batch identities and eligibility. The exact Pending line inspector
does not expose those facts. [Resolution inputs](../define-pending-resolution-workspace/design.md#dependencies-for-live-use)
