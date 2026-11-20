## Why

The November 30 review has useful Core and Inventory screens, but the current
business picker ends at a business name. An Owner needs to review how confirmed
configuration becomes usable stock work within one selected business.

## What Changes

- Open a shared backoffice workspace after business selection or creation.
- Add a compact first-use home with the next available action and the confirmed
  Inventory trial or access state.
- Reuse the existing hierarchy, stock setup, product, movement and stock lookup
  forms. Use one synthetic merchant-scoped data model so the results of setup
  and recorded movements are visible from later steps.

## Capabilities

### New Capabilities

- `owner-journey` adds an interactive connected first-use review for JNY-001–006.

## Impact

This change is a Storybook review of the Owner journey. Live application routes,
the provider handoff and Inventory contracts must be delivered through their
respective changes.
