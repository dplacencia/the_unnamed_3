# Pendientes Storybook preview plan

The preview would let a merchant find a pending receipt or departure in
Movimientos and open a receipt for exact inspection. It would use the
[agreed behavior](specs/pending-movements-browsing/spec.md) with synthetic
list and detail responses. Live discovery and inspection depend on the
browser gateway contracts documented in the [design](design.md).

On 2026-11-19 the user selected **“Build the simulated preview (Recommended)”**.

## Implementation

1. Add a deterministic simulated list read under
   `apps/backoffice/.storybook/stories`. Use opaque continuation tokens and
   stable line references. Include both movement kinds, two locations and
   enough lines to paginate at the agreed sizes. Include independently
   unresolved product, quantity or unit, recorded reasons and an optional
   supplied estimate. Exercise successful reads, technical errors, access
   rejection, rejected tokens and empty continuations.
2. Add `pending-movements-browsing.stories.tsx` with the established
   [navigation prototype](../../../apps/backoffice/.storybook/stories/navigation-prototype.tsx)
   and TailAdmin controls. Show “Pendientes” and “Registrar entrada” in
   Movimientos. Show a compact list with expandable reasons, visible
   location scope, and “Anterior · Página N · Siguiente”. Localize text
   and accessible labels in the five supported languages.
3. Reuse the
   [receipt inspection content](../../../apps/backoffice/.storybook/stories/pending-receipt-inspection-content.tsx)
   and its exact-read behavior in the list's inspection panel. Open the
   exact reference from a receipt row and return through “Volver a
   Pendientes”. For a reported resolution or unavailable detail, request
   the current group with its original read input. The returned list
   determines which rows appear.

## Verification

Add browser checks in `visual/tests/pending-movements-browsing.spec.ts`
and register them in
[the catalogue browser configuration](../../../visual/playwright.languages.config.ts).
Cover both scopes and both movement types, per-tab scope and size retention,
the first group on reopening, exact displayed counts and optional estimates,
end and start of navigation, and clearing rows on scope or access changes.
Exercise a late response after the scope changes. Verify same-scope loading
and technical retries, including retries after returning from inspection.

Check that a rejected token and an empty directional continuation keep the
last loaded rows and page number with an explanation. Verify that “Volver
al inicio” keeps the size and scope and changes the position only on a
successful read. An empty first group shows scoped emptiness. An authorized
same-position read with zero rows on return from inspection shows those zero
rows and offers restart. Test a successful same-position refresh and a
return from a still-pending inspection. Check keyboard focus and narrow
layouts in all five languages.

Run `pnpm check`, `pnpm visual:prepare`, `pnpm visual:coverage`,
`pnpm visual:test-languages` and strict OpenSpec validation. Compare
existing Movimientos, receipt and exact-inspection cases with their accepted
references.

## Proposed visual review

Use the existing desktop, tablet, mobile and desktop dark profiles. Register
the cases in [the visual inventory](../../../visual/inventory.json).

| Language                              | Scenarios                                                                                                                                                                                                                                                                                                                                                                                    | Images |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| Spanish                               | Movimientos entry, choose location, initial loading, one-location list, all-accessible list with expanded departure reasons, second page with an estimate, previous rows during paging, technical error with previous rows, rejected continuation, empty directional continuation, empty first page, access denial, receipt inspection from the list, empty current page on inspector return |     56 |
| English, Catalan, Galician and Basque | Populated all-accessible list                                                                                                                                                                                                                                                                                                                                                                |     16 |

Capture the proposed 72 images with
`pnpm visual:capture --grep pending-movements-browsing`. Present the exact
candidate set for the user's review before promoting any references.

## Verification — 2026-11-19

The interactive Movimientos entry opens Pendientes on request and shares the
existing location control. The list uses 224 synthetic lines across two
locations. An individual receipt is read by its stable reference through the
existing inspector. The fixtures exercise both successful and interrupted
list reads, access denial and resolution while the inspector is open.

`pnpm check` passed with 81 backoffice tests and 100 visual tooling tests.
Strict OpenSpec validation passed all 12 changes. Catalogue coverage passed
for 142 stories and 354 named scenarios. The 25 focused Playwright checks
passed, including the 320px Basque view, keyboard focus after restarts and
retries, and exact receipt inspection. The product name opens receipt details
so the list can show complete location names at 390px without a separate
action column. The list and inspector use the same location labels.

The default Next.js Turbopack build hit a local worker port permission
error. The Next.js static export passed with its Webpack fallback. The
Webpack font has the same bytes with a different asset name. The Storybook
build reused the existing approved font artifact after verifying its
manifest and bytes. The landing builds used the existing commands.

The broad Playwright run passed 278 checks. Two Products recovery checks
could not load the preview during a rebuild and both passed on rerun.
All 36 selected navigation, receipt, stock-lookup and exact-inspection
screenshots passed against their approved references. The 1,344 existing
reference image hashes matched the registry.

## Initial candidate review — 2026-11-19

The final build passed all 43 focused Playwright checks for Pendientes
and the existing receipt inspector. The
[72-image candidate gallery](http://localhost:9324/runs/2026-11-19T20-05-03.752Z/review.html)
contains 18 cases in each profile. The capture had zero skipped, unexpected
or flaky results. Every candidate PNG matched its manifest digest.
The source fingerprint is
`847e8f29e3cd4f7e90628f8c77598c4c704170cfe39def2e8b0e4aa9bb63c2f6`.
The run manifest SHA-256 is
`4bb7f1a32db0263151c72ef063d4db8546178391c740b4eefdc2b332606dacc4`.

## Page-size selector revision — 2026-11-20

The user reported that the caret overlapped the selected number in “Líneas
por página”. Restoring the select's default trailing padding reserved
space for the caret. The browser check reproduced the 4px padding on the
previous build and verifies the right-aligned, centered caret and sufficient
padding on desktop and phones. All 26 Pendientes browser checks and
`pnpm check` passed.

The [revised 72-image gallery](http://localhost:9324/runs/2026-11-20T10-08-52.620Z/review.html)
supersedes the first set. 60 images changed and 12 are byte-identical.
Every candidate matches its manifest. The source fingerprint is
`62183df730cd28e00c15315019492c3bc5f1eec2474894d49f64fb4bb2f09543` and the
run manifest SHA-256 is
`f1305c9f8676d4dbf65f53699f1abe2b64fffa2b3f8efce9443e717fe76702f1`.

## Visual approval — 2026-11-20

The user selected **“Approve all 72 images”** for run
`2026-11-20T10-08-52.620Z`. The promotion recorded that approval against
the exact candidates. The registry contains 1,416 references. An audit
verified all PNG hashes and confirmed that the 1,344 prior entries match
the receipt-inspection checkpoint.

The [Playwright comparison](http://localhost:9324/runs/2026-11-20T10-59-55.262Z/playwright-report/index.html)
passed all 72 Pendientes references at the approved source fingerprint,
with zero skipped, unexpected or flaky results.

## Commit preparation — 2026-11-20

The user said **“go ahead, prepare to commit as always”** and runs both
commit commands. The starting commit is
`50ed9fd48feae253f15a9c1c862b4f83f05ca4a0`.

1. Stage the 25 preview, test, visual inventory and OpenSpec files for
   `feat: add simulated pending movements browsing`.
2. Verify the first user commit, then stage the 72 approved PNGs and
   `visual/references.json` for
   `test: accept pending movements browsing visual references`.

The ignored `.cache/pending-movements-browsing-checkpoint.json` records the
approved source and the paths, blob IDs and modes for both batches.
