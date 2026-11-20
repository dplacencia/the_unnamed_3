# Core capability enablement design

Use the existing merchant workspace and Explorar módulos page. Catalogue and Stock each show the last confirmed configuration and their own explicit activation or deactivation action. Changes target exactly one capability. The shared Inventory provider status concerns operations that require that deployment. During a provider outage, Core configuration remains intact. The fixture can still apply a local Core change when current management authority is available. Confirmed denial hides mutation actions. Unavailable management authority leaves the last known configuration visibly labelled and prevents sending a new command.

Pricing appears only to demonstrate the published prerequisite. Requesting Pricing with Catalogue disabled identifies both in the refusal. Requesting Catalogue deactivation while Pricing is enabled also identifies both. Neither refusal changes any configuration. Stock works independently of these enablement choices and its enablement leaves Catalogue, Pricing and product identity intact.

The preview uses exact synthetic Core results. Live use requires the actual merchant capability read/write contract, current action-specific authority, and a trusted indication of required provider availability. This design adds no route, permission key, provider probe, billing offer, Pricing feature surface, or implication that enablement by itself establishes commercial eligibility or product/Area access.

- [Core responsibility, explicit dependencies and MOD-009](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#L272).
- [Approved enablement, dependency and provider decisions D3, D5 and D6](../../../../the_unnamed_2/openspec/changes/archive/2026-11-18-define-module-architecture/design.md#L163).
- [Core availability for current request authority](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#L263).
