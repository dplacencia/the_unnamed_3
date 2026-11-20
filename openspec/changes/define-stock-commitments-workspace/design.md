# Stock commitments workspace design

The Nov 30 review assignment covers JNY-019–021 with backed holds. Start reservation or exact inspection from Movimientos in the existing desktop side panel and phone full-screen panel. The scope selection example requires an explicit product, stock location and enabled channel from authorized fixture combinations. It opens the reservation with that exact scope, then displays its returned reference on confirmation. Fulfillment and release act on the exact displayed reference. Each scope starts with a synthetic recorded balance and channel availability. On-hand, available, accepted, outstanding and physical effect each have their own meaning and label. No amount is derived from recorded on-hand in view code.

Request the full reservation by default. Allow explicitly partial admission and report the returned accepted and unaccepted amounts. For exact fulfillment below the outstanding quantity, ask whether to keep or release the remainder. Releasing a reservation only releases its unfulfilled quantity. The simulated fulfillment result renders one returned signed stock effect and the resulting outstanding quantity. Keeping an outstanding remainder preserves its original expiry. The preview uses one configured measurement and compares exact decimal magnitudes. Excess fulfillment, backorders and multi-dimension items need a separate review.

The hold settings example takes an explicit site setting or location override.
The merchant supplies numeric caps or chooses unlimited separately for each
quantity cap. They supply initial duration and maximum lifetime and choose
whether to allow extensions. Enabling extensions requires duration and count.
These settings serve a known product in an authorized fixture. Inventory owns
policy inheritance, effectiveness and admission outcomes. [Native hold settings](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability/spec.md#requirement-explicit-setup-and-separate-hold-limit-hierarchy)

An exact read has its own action, and updates the displayed consultation from the supplied outcome. A read that fails or is unavailable cannot become a missing reservation or zero. A mutation with unconfirmed delivery retains its captured target and choices during the preview and displays the uncertainty. The current contract defines no commitment retry or lookup-by-operation semantics. Changing the previous intent into a new reserve, release, fulfill, departure, or Pending action would have no basis.

## Live delivery boundary

The approved product journey includes [JNY-019–021](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md#L189). Inventory's accepted [contract boundary](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability-contract/spec.md#L14) and [full-product rules](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability/spec.md#L72) retain the capability and explicitly defer its action inventory, reason fields and grant mapping. The current [native service](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto#L31) and [public merchant route scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md#L10) expose no creation, release, fulfillment, exact commitment read, or channel-availability interface. The approved architecture identifies those operations as a later delivery boundary, with [no substitute reservation ledger](../../../../the_unnamed_2/openspec/changes/archive/2026-11-06-design-v1-architecture/design.md#L93).

Live use requires the Inventory contract, resource authority and operation-specific grants, a closed public mapping for commands and exact reads, authoritative availability and returned facts, and delivery/recovery rules. Core and ordinary departure permissions remain separate. This preview introduces no runtime integration.

The user selected **Require live commitments** for November 30. Verified native
creation, exact read, release and fulfillment behavior and the browser gateway
routes are release gates. Storybook provides synthetic contract review while
those prerequisites are absent. Written preview requirements and accepted
images alone cannot satisfy either gate.
