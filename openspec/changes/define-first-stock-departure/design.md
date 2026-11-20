# First stock departure design

## Workspace and form

Open the same responsive side-panel pattern as [Registrar entrada](../define-first-stock-receipt/specs/first-stock-receipt/spec.md). Start from “Registrar salida” in Movimientos. A searchable controlled picker identifies the existing product by permanent ID, including when products share names. The operator chooses the origin and a channel enabled at that location explicitly. A new draft starts with blank origin and channel even when the workspace displays a location or the picker has one option. When the origin changes, clear the previous channel and show the options available at the new origin. If the list of enabled channels is known to be empty, show that state beside the selector.

Use the existing quantity controls and exact receipt conversion for the shared measurement rules. Default the input unit from the selected product configuration. If a quantity has been entered, changing the product or the unit asks for confirmation before clearing it. The advanced optional reference follows the same native text profile. Discarding a changed open draft requires confirmation. A shortage alone does not block this operation. Inventory can record a negative balance after an otherwise valid departure.

## Authority and exact results

The existing gateway route accepts a departure batch with a single line. The line supplies the real Inventory location ID, selected channel, permanent product ID and exact decimal coefficient/scale and unit. It preserves the presence of an optional source reference; the first form leaves occurrence time absent. The native outcome supplies the applied signed stock effect and unit, a Pending reference with reasons, or a rejection. Unknown delivery remains visibly unconfirmed; same-command recovery retains identity, content and field presence. The gateway obtains current authority per attempt.

The preview adapts the existing receipt retry scheduler, with up to three attempts per run, separate accepted and rejected states, and explicit recovery after an unconfirmed run. An immutable departure snapshot includes the channel before the first simulated attempt. Delays are virtual. Preview records remain in memory for the open story visit. The fixture produces a confirmed signed stock effect separately from the entered amount and never displays an inferred current recorded balance. A Pending case models the selected channel becoming unavailable before the operation was applied. It supplies `CHANNEL_NOT_ENABLED` as the recorded reason where the channel remains known and reports no stock effect.

- [Public departure route](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json#L1160) and [exact input shape](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json#L2270).
- [Result, retry and authority contract](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md#L54).
- [Inventory departure outcomes](../../../../the_unnamed_1/openspec/specs/inventory-receipt-departure-processing-contract/spec.md#L405) and [stock balance behavior](../../../../the_unnamed_1/openspec/specs/inventory-quantities/spec.md#L988).

## Live delivery dependencies

Merchant bootstrap and location authority come from the real Core flow. Core owns Merchant–Site–Area identity and lifecycle. Inventory owns the stock location associated with an Area, and sends only actual Inventory location IDs through the departure route. The approved gateway reports departures and reads stock by exact pair. Authoritative eligible product, location and channel collections remain delivery dependencies for live pickers, and Pending inspection requires a separate browser read. The Storybook fixtures supply these facts without claiming browser transport or shared Core binding is available.

- [Core and Inventory ownership](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#L10).
- [Browser route boundary](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md#L10).
