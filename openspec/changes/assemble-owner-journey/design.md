# Connected Owner journey

The [November 30 scope](../establish-frontend-technical-foundation/november-30-review.md)
includes a continuous [first merchant journey](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md#requirement-jny-001--complete-customer-journey).
Use a short first-use home with an explicit next action and the normal shared
navigation. A product may be created before stock-location setup through the
ordinary Products entry. A receipt needs an existing product and explicitly
selected stock location. A departure also needs an enabled channel selected
at the origin. The home guides the usual order without adding new Inventory
eligibility rules.

Use the existing Core hierarchy and Inventory setup inputs. Creating a Core
Site also creates its first Area; linking a separately identified stock location
is another action. Keep the departure channel and its explicit enablement ordered
as separate actions. Read on-hand stock using the existing lookup and exact
fixture results. The absence of a recorded balance stays distinct from zero.
The fixture applies compatible units with the existing exact arithmetic.
Receipt and departure confirmations come from the same simulated ledger that
supplies the lookup.

Reuse the business chooser and creation readiness entry. Store confirmed
fixture data in the parent by merchant for one Storybook visit. Changing the
business resets its open form and shows only its own data. Use the existing
discard and unit-change confirmations where applicable. The trial/access result
is supplied by the fixture and does not follow the browser clock or the
member's role. A confirmed pause and unavailable entitlement keep Core usable
while preventing Inventory operations in the prepared scenarios.
[Trial access policy](../../../../the_unnamed_2/openspec/specs/inventory-access/spec.md)

Exact create/read contracts, user identity, authoritative billing status and
backend delivery remain live prerequisites. This review uses synthetic
outcomes and does not persist business data across browser sessions.
