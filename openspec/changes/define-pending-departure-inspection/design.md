# Pending Salida inspection design

## Starting checkpoint

The two Pendientes commits are `b70eb76` and `bc83059`. Their paths, modes
and blobs matched the prepared manifests. The worktree was clean with 1,416
approved references. The user authorized the next read-only slice after this
checkpoint. [List approval](../define-pending-movements-browsing/preview-plan.md#visual-approval--2026-11-20)

## Authoritative read

Native Inventory can look up one previously Pending departure by exact line
reference. It checks current inspection access at the actual location. The
current view includes retained reasons or a committed resolution and the
saved channel, which may be unresolved independently of product, quantity and
unit. Use a generic unavailable result for an inaccessible or unavailable line.
[Native adapter](../../../../the_unnamed_1/inventory/application/src/adapters/inspection.rs#L279) ·
[Access rules](../define-pending-receipt-inspection/design.md#native-inventory-source-evidence)

An applied departure has an exact signed stock effect. Display the effect
returned by Inventory independently of the saved quantity. Committed duplicate
cancellation can produce a Rejected departure, so the shared inspector can
truthfully show that recorded outcome and its reason. The interaction remains
read-only. [Exact projection](../../../../the_unnamed_1/inventory/persistence/src/inspection.rs#L425) ·
[Duplicate cancellation contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#L729)

The preview replaces the insufficient-stock example with `CHANNEL_MISSING`,
a documented reason. A second line with the same product name retains a
known unit and channel alongside `QUANTITY_MISSING` and a channel that was
not enabled for its location. Inventory can apply an otherwise valid
departure that leaves a negative balance.
[Channel reasons](../../../../the_unnamed_1/openspec/specs/inventory-receipt-departure-processing-contract/spec.md#L449) ·
[Missing quantity test](../../../../the_unnamed_1/inventory/acceptance/tests/departure.rs#L334) ·
[Native stock test](../../../../the_unnamed_1/inventory/acceptance/tests/departure.rs#L220)

The Applied fixture represents a committed release that recorded the actual
channel after it was initially missing. The native exact read returns that
saved channel and the signed departure effect.
[Release test](../../../../the_unnamed_1/inventory/domain/src/resolution/tests.rs#L296) ·
[Resolved channel projection](../../../../the_unnamed_1/inventory/persistence/src/inspection.rs#L526)

The browser gateway's public method allowlist omits the exact Pending read,
so this preview uses synthetic outcomes. [Gateway evidence](../define-pending-movements-browsing/design.md#browser-gateway-source-evidence)

## Selected interaction

In Pendientes, open a Salida from the underlined product name in its row.
The existing TailAdmin inspector shows current status in the desktop side
panel and full-screen phone view. Use Salida wording, “Ubicación de origen”
and “Canal”. A loaded current status supports an explicit refresh. A technical
failure supports retry of the same reference. An unavailable detail remains
distinct from a technical failure.

“Volver a Pendientes” keeps scope, page size and the reached position. The
existing return rule refreshes that page after resolution or unavailable detail.
The fresh list result determines which rows are visible. A still-pending result
preserves the existing page and restores focus to its opening control.
[Existing list return rule](../define-pending-movements-browsing/design.md#selected-receipt-inspector-layout)

## Preview and verification

Reuse the shared exact-read observer, the Pendientes panel and its browsing
controller. Add departure-specific facts and copy to the existing view.
Fixtures cover Pending, Applied, Rejected, loading, unavailable and a
technical failure. The browser checks exercise exact references on duplicate
product names, independently unresolved facts, the recorded signed effect,
resolved and unavailable return paths, same-reference retry, and a late
response after switching lines.

Review six Spanish states and one populated Pending view in the four other
locales under the established four profiles. Capture all 72 existing
Pendientes cases and the 40 new ones so the approval can identify the
changed and added references precisely. Compare the existing receipt inspector
references. Reference promotion follows approval of an exact candidate set.

## Candidate review — 2026-11-20

`pnpm check` passed with 181 tests. Strict OpenSpec validation passed all 13
changes. Catalogue coverage passed with 148 stories and 364 named scenarios.
All 55 focused Playwright checks and all 52 accepted receipt-inspection
comparisons passed. The receipt comparison run was
`2026-11-20T11-56-41.098Z`. All 1,416 existing reference hashes matched
the registry.

The [112-image candidate gallery](http://localhost:9324/runs/2026-11-20T11-58-13.063Z/review.html)
contains 40 new scenes, 50 changed images and 22 byte-identical existing
images. All four profiles and five locales are represented. All captures
passed with zero skipped, unexpected or flaky results. Every image matched
its manifest hash. The source fingerprint is
`b95c960c666ecba4f5de71a1e2d51e25653fe14248418d26dfa2de8338b9e131`.
The run manifest SHA-256 is
`2db70bc8054af6eb8c46850f07a63842a12fee2e8ffee1362cf372678d93fe49`.

## Visual approval — 2026-11-20

The user selected **“Approve the 90 additions and replacements”** for run
`2026-11-20T11-58-13.063Z`. Promotion added 40 references and replaced 50.
It preserved the 22 byte-identical reviewed entries and all other prior
references. All 1,456 current PNG hashes match the registry. The local audit
is `.cache/pending-departure-inspection-promotion-proof.json`.

The [Playwright comparison](http://localhost:9324/runs/2026-11-20T12-22-39.359Z/playwright-report/index.html)
passed all 112 Pendientes references at the approved source fingerprint,
with zero skipped, unexpected or flaky results.
