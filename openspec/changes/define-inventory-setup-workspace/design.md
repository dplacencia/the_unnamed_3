# Inventory setup design

## Owning facts

Core supplies the merchant, Site and Area identity, names and lifecycle.
Inventory manages its own stock-location ID and links it to exactly one Core
Area, at most once per Area. A single incomplete or unavailable read must leave
the relationship unknown. The preview offers a retry and only shows setup after
a successful read confirms absence, with an active Area and authority to act.
[Core and module boundary](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#requirement-mod-001--one-owner-for-each-fact)

## Stock location setup

A side panel shows the chosen Core Site and Area before submission. The
continuous calendar example requires an explicitly picked calendar and a
merchant-entered daily boundary, including explicit midnight if intended.
The preview accepts exact hours and minutes, optional seconds and up to six
fractional digits. It serializes integers at the same precision as the published
time-of-day profile. The scheduled example asks for an explicit open or closed
choice on all seven weekdays, exact windows with an explicit next-day flag, and
optional complete-date replacements including closures. It validates date
uniqueness and whether the latest close has passed in the fixture Site's local
date. The preview leaves overlap and duration validity to the owning contract.
[Native calendar representation](../../../../the_unnamed_1/openspec/specs/inventory-site-location-channel-configuration-contract/spec.md#requirement-initial-calendar-representation)

## Departure channels

Channel creation is merchant-wide. The native product gives the new channel a
permanent ID and no enablement. In a separate action, the merchant selects an
authorized, active stock location using its Inventory ID, chooses a channel and
explicitly chooses the position. Before uses a known enabled channel ID and
append uses the empty marker. The order and explicit placement come from the
simulated established outcome. A command whose result could not be confirmed
can be explicitly retried with the original ID and contents. The unconfirmed
story keeps the new channel unlisted until it obtains the known reply.
[Native create and enable](../../../../the_unnamed_1/openspec/specs/inventory-site-location-channel-configuration-contract/spec.md#requirement-channel-creation-and-ordered-enablement)

## Live dependencies

MOD-001 specifies an Area-based lookup and setup using distinct Core Site and
Area IDs. The inspected gateway exposes the older Inventory-local
`POST /merchants/{merchant_id}/inventory/sites` and
`POST /merchants/{merchant_id}/inventory/locations` contracts. The former
requires an Inventory site name, first location name and timezone. The latter
takes an Inventory site ID, name and calendar. Neither accepts the shared Area
identity and the gateway provides no stock-location-by-Area read. The continuous
calendar editor is a review of a documented representation, with exact
Area-linked setup fields still to be supplied by the eventual contract.

The gateway publishes channel creation and enablement writes, with exact
`caller_operation_id` retry rules and current operation-specific grants. The
settings list and ordering also require authorized reads of channel and
location identities, lifecycle and enablement order. The reviewed OpenAPI
supplies these writes but lacks those setup discovery reads. These dependencies
remain open for live wiring. Every lookup, grant and reply in this preview is
synthetic.
[Public browser OpenAPI](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json)
