## Why

Archiving lets a merchant remove a product from day-to-day use while keeping its permanent identity and history. It is required by Core's first Inventory journey (JNY-013).

## What Changes

- Preview archiving from the existing Products details sheet with explicit confirmation.
- Show the confirmed archived product, a confirmed refusal and an unconfirmed outcome.
- Use the active catalogue and existing archived inclusion filter to show the effect of a confirmed archive.

## Capabilities

### New Capabilities

- `product-archive` defines the archive interaction and handling of authoritative outcomes.

## Impact

This change adds Storybook fixtures and verification. Live writes depend on an implemented Inventory archive command and an authorized browser gateway route.
