# Define Core capability enablement

## Why

Merchant teams need to enable the capabilities they use and see when an enabled capability's provider is unavailable. The Core architecture treats Catalogue and Stock as independent capabilities hosted by one Inventory deployment.

## What changes

- Add a simulated Explorar módulos workspace for confirmed Catalogue and Stock configuration.
- Demonstrate Core's refusal when Pricing requires Catalogue, including the inverse refusal when disabling Catalogue would break enabled Pricing.
- Cover management authority and provider availability using separate, explicit fixture states.
