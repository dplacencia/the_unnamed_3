# First stock departure

## Why

Merchants need to record stock leaving a location. Movimientos already supports recording an entrada and inspecting pending movement results. This preview completes the first manual stock movement pair with the same product selection, precise quantity and result handling patterns.

## What Changes

- Add a focused “Registrar salida” preview for one existing product, one origin, one enabled channel and one positive exact quantity.
- Reuse the TailAdmin workspace, responsive panel and validated entry controls for the existing receipt flow.
- Present confirmed application, Pending, rejection and uncertainty as distinct outcomes.
- Exercise the preview in the five backoffice languages through synthetic responses. Record the authoritative contracts and delivery dependencies in [design](design.md).

## Authority and scope

The user authorized review-ready implementation and OpenSpec work on 2026-11-20, prioritizing the November 30 Core and Inventory journey. This proposal records the frontend preview for review. The underlying departure operation and Core Area ownership follow their owning repositories. The simulated preview does not establish runtime availability or API approval.
