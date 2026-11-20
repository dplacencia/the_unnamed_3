# Pending movements browsing design

## Starting point

NAV-004 places pending movement work in Movimientos. The approved receipt
preview opens exact inspection from a confirmed Pending result in the open
panel. Finding a currently pending line later belongs to this browsing
design. NAV-008 and NAV-009 supply the existing rules for visible, independent
location scope when a page uses a location selector. A receipt destination
remains a separate input to the receipt command.
[Navigation requirements](../define-backoffice-navigation/specs/backoffice-navigation/spec.md) · [Receipt inspection scope](../define-pending-receipt-inspection/specs/pending-receipt-inspection/spec.md#requirement-pri-004--keep-the-first-preview-within-the-open-receipt-panel)

## Native Inventory source evidence

- `InspectPending.selector.discovery` takes a required location selection
  and optional page input. Location selection can be a nonempty set of exact
  location IDs or the scope currently authorized. This discovery branch
  returns one row per still-pending receipt or departure line. Its input has
  no movement-type, product, date or sort filter. A resolved line leaves
  discovery. Its stable reference still opens a separate exact detail read
  that can return the current resolution.
  [Inspection contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md) · [Discovery SQL](../../../../the_unnamed_1/inventory/persistence/src/sql/select_pending_page.sql#L14)
- A row supplies the stable line reference, movement kind, actual location
  ID, saved product resolution, independently known or unresolved quantity
  and unit, and retained Pending reasons. A departure also has a saved
  channel resolution. The default discovery view does not supply a timestamp,
  display names, the original source reference or a stock balance.
  [Movement view protocol](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto#L922)
- The default page returns at most 100 records. Explicit sizes range from
  1 to 1,000. Previous and next are opaque continuation tokens and the same
  request field accepts either direction. The total is an estimate supplied
  by default, with an opt-out. The implemented stable traversal uses operation
  key and line number. The contract supplies no page number, chronological
  sort label or frozen cross-page snapshot. State changes can leave a valid
  continuation with no rows even when the overall estimate is positive.
  An invalid continuation is rejected. A technical failure leaves the read
  unconfirmed.
  [Pending pagination contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md) · [Page implementation](../../../../the_unnamed_1/inventory/persistence/src/inspection.rs#L216)
- Discovery applies current `report:inspect` scope on every request.
  When explicit location selection includes an uncovered location, access
  denial applies to the requested set. With adequate scope, a missing
  selected location can produce `READ_INPUT_INVALID`. An authorized-scope
  request with empty coverage can return a processed empty page. These
  outcomes do not establish that the business has no pending lines.
  [Scope checks](../../../../the_unnamed_1/inventory/domain/src/inspection.rs#L132) · [Access acceptance cases](../../../../the_unnamed_1/inventory/acceptance/tests/pending.rs#L157)

The native specification and core discovery implementation were inspected at
`81bb17a`. This was a source review.

## Browser gateway source evidence

At gateway commit `84e5df2`, the approved public route set exposes receipt
submission and its original outcome. The gateway and backend allowlists
omit both Pending discovery and the exact Pending read. The pinned wire
protocol describes both selectors. JNY-015 calls for authorized Pending
status and reasons in the first merchant journey. Public discovery and
detail transport each need an exposed contract before live use.
[Public route scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md) · [Gateway bindings](../../../../the_unnamed_2/platform/gateway/lua/apisix/plugins/inventory-context.lua#L31) · [Backend allowlist](../../../../the_unnamed_2/backend/src/context.rs#L21) · [Journey requirements](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md)

## Selected movement kinds

- **PMB-002.** On 2026-11-19 the user selected **“List receipts and
  departures (Recommended)”**. The first Pendientes list shows both kinds
  returned by Inventory, labelled “Entrada” and “Salida”. A listed receipt
  opens the existing receipt inspector by exact line reference. Departure
  detail belongs to a later design.

## Selected location scope

- **PMB-003.** On 2026-11-19 the user selected **“Also offer all accessible
  locations”**. Pendientes uses the Movimientos viewing scope. Merchants
  can select one location or explicitly choose “Todas las ubicaciones
  accesibles”. The existing initial location rules apply in the absence
  of an applicable choice. Select the sole accessible location or ask
  when several are available. The aggregate option uses the scope covered
  by current inspection access, and the list identifies that scope.
- **PMB-005.** On 2026-11-19 the user selected **“Remember the
  all-accessible choice per tab (Recommended)”**. Retain this explicit
  scope for the same business while the tab stays open. Reopening
  Pendientes uses the remembered scope for a fresh read under current
  inspection access. The retained choice is the scope selection,
  independent of result rows and pagination.

## Selected entry point

- **PMB-004.** On 2026-11-19 the user selected **“Open the list through
  Pendientes (Recommended)”**. Movimientos offers a visible “Pendientes”
  action that opens the list in the main workspace. “Registrar entrada”
  remains available.

## Selected row presentation

- **PMB-006.** On 2026-11-19 the user selected **“Compact rows with
  expandable reasons (Recommended)”**. Show Tipo, Producto and the exact
  saved Cantidad with its unit where known. Include Ubicación when viewing
  all accessible locations. Allow each row to expand Inventory's retained
  reasons, including departure rows.

## Selected receipt inspector layout

- **PMB-007.** On 2026-11-19 the user selected **“Use the inspector panel
  (Recommended)”**. Open a listed Entrada in the existing exact receipt
  inspector as a side panel on desktop and full screen on phones. Use
  “Volver a Pendientes” to return to the list with its current scope and
  browsing position. The inspector shows the current read result for the
  selected line.
- **PMB-008.** On 2026-11-19 the user selected **“Refresh after resolution
  or unavailable detail (Recommended)”**. When the inspection reports a
  resolution or unavailable detail, returning requests fresh list results
  at the current browsing position. The list response determines whether
  the row is still visible. Returning after a still-pending result keeps
  the current page.

## Selected pagination controls

- **PMB-009.** On 2026-11-19 the user selected **“Anterior/Siguiente with
  a page label (Recommended)”**. Use the corresponding opaque token to
  replace the visible rows. “Página N” identifies the position reached
  through successful navigation from the first group in the current view.
  A failed traversal leaves that position unconfirmed and does not advance
  the displayed label.
- **PMB-010.** On 2026-11-19 the user selected **“50 by default, with
  25/50/100 choices (Recommended)”**. The initial view defaults to 50 lines
  per page and offers 25, 50 and 100. Changing size restarts at the first
  group for the selected scope.
- **PMB-011.** On 2026-11-19 the user selected **“Show the displayed count
  and supplied estimate (Recommended)”**. Show the exact count of lines
  displayed on the current page. When Inventory supplies an estimate for
  the selected scope, show it separately with an estimate label. The
  current-page label continues to represent the reached position.
- **PMB-012.** On 2026-11-19 the user selected **“Remember size and restart
  at the first group (Recommended)”**. Remember the chosen size for the
  same business and tab. Reopening Pendientes after leaving starts at the
  first group with a fresh read, using the applicable remembered scope.
  Returning from the inspector uses the existing list position under
  PMB-007 and PMB-008. Requests after a scope change start with a fresh
  first group for that scope.

## Selected loading and technical failure behavior

- **PMB-013.** On 2026-11-19 the user selected **“Keep marked previous
  rows during paging (Recommended)”**. The first read and a changed scope
  show neutral loading. While paging within the same scope, keep the
  prior rows visible and identify them as the previous results. A
  technical failure keeps that indication and offers “Reintentar” for
  the requested read. The same treatment of previous results applies
  when restarting or refreshing on return from inspection within that
  scope. A rejection of the current access clears affected rows because
  they are no longer authorized.

## Selected behavior when a destination page is unavailable

- **PMB-014.** On 2026-11-19 the user asked to show the error and preserve
  the previous state. If a directional request returns a rejected
  continuation token or a valid continuation with no rows, explain that
  the requested page could not be opened or has no rows,
  respectively. Keep the last loaded rows identified as previous results,
  the reached page number and the browsing settings, subject to current
  access. The displayed count remains tied to those rows. A continuation
  with no rows gives no basis to claim the whole scope is empty. The exact
  detail read still determines the current status of a listed receipt.
- **PMB-015.** On 2026-11-19 the user selected **“Offer restart only after
  a page becomes unavailable”**. Offer “Volver al inicio” after a page
  continuation is rejected or an attempted continuation has no rows.
  Stay at the current position until the merchant explicitly requests the
  first group and that read succeeds. The restart keeps scope and page
  size. “Reintentar” belongs to a technical failure.

A return from the inspector under PMB-008 reads the current group using
the request that loaded it. A rejected continuation leaves the previous
rows labelled. An authorized, empty continuation for the current group
replaces those rows with the confirmed empty result at that position.
Both outcomes offer “Volver al inicio”. An empty first group describes
only the scope used for the read and has no restart action.

A confirmed change in effective inspection scope invalidates the previous
result and its navigation tokens, even when the selected label is still
“Todas las ubicaciones accesibles”. A generic unavailable result for one
exact line does not establish a change in list access.

## Starting checkpoint

The user commits `a43e956` and `50ed9fd` match the 25-file implementation and
53-file reference manifests. Before this discovery, the working tree and
index were clean with 1,344 accepted references. The local proof is
`.cache/pending-receipt-inspection-checkpoint-complete.json`.
