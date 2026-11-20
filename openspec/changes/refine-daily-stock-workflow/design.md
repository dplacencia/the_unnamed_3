# Daily stock workflow comparison

The user chose the daily stock workflow after reviewing the proposed product
sheet, receipt form and stock result. The approved
[receipt requirements](../define-first-stock-receipt/specs/first-stock-receipt/spec.md)
and [stock lookup requirements](../define-stock-lookup/specs/stock-lookup/spec.md)
govern the behavior.

## Comparison

Both stories start in the same Products table. The Current path opens the
receipt from Movimientos. The Proposed path opens the existing TailAdmin sheet
from the product name and puts Registrar entrada in the sheet. Keep table
density, controls and working view. Use the existing button, field and sheet
components and TailAdmin's success alert for the confirmed movement. Use the
configured unit initially and collect the destination explicitly even when the
product is supplied. Retain the same draft, unit-change,
validation and submit guards. Present a reference for duplicate product names
when available and use the product ID as the fallback.

For the exact comparison, find **Café molido** with reference **000001**. There are
two rows of that name. Choose Almacén and enter 500 g. The fixture starts with
2 kg recorded there. A confirmed receipt reports 500 g applied. The independent
stock read reports 2.5 kg in the selected locale. Use the same product and
location to open Existencias. Returning to Productos retains the working view.
In the Pending story, show the confirmed Pending outcome without a stock effect.
In Balance read failed, retain the confirmed receipt and retry only the read.

## Implementation and checks

1. Exercise the existing-product path with Playwright and preserve the approved
   current and shared screens.
2. Add an opt-in catalogue handoff so the proposed story can use the existing
   receipt state, exact fixture ledger and stock lookup. Keep the fixture ledger
   scoped to the visual comparison.
3. Compare named states on desktop, tablet, phone and desktop dark mode. Check
   five languages and 320 px phone layout. Capture candidates with pinned
   Chromium and keep references subject to exact user approval.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T19-28-07.346Z/comparison.html)
  pairs the four main states across desktop, tablet, mobile and desktop dark.
- [72 candidates](http://localhost:9324/runs/2026-11-20T19-28-07.346Z/review.html)
  cover both paths, Pending, a failed balance read and all five languages.
  The capture uses source
  `e6b6ae2c7822f661a77e93ab6811011b1b2501128317a784e6250d70e134971c`.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed 43 interactions
  including the exact duplicate-product handoff, catalogue return, read-only
  retry, confirmed Pending and a 320 px layout check.
- [60 approved-reference comparisons](http://localhost:9324/runs/2026-11-20T19-27-18.872Z/playwright-report/index.html)
  passed for Products, receipt, stock lookup and the Owner journey.
  All 2,400 approved reference hashes verified. The action revision below supersedes this gallery.

The default local Turbopack build could not bind its build socket. The supported
Webpack build produced the static backoffice successfully. The preview uses the
verified Source Sans 3 bytes under the original approved filename and font
manifest so the renderer matches the existing references.

## Product-sheet action revision

The user asked for a clearer arrangement in the tablet product sheet. Place
**Registrar entrada**, **Ver existencias** and **Editar** together below the
product facts, separated by a light rule. Use the existing primary, outline
and ghost buttons in that order. On phones the primary action spans the row
and the other two share a row below it. Phone controls retain a 44 px minimum
height. Editing and stock lookup keep their existing guards and product scope.

The [before-and-after comparison](http://localhost:9324/runs/2026-11-20T19-48-54.079Z/product-actions.html)
shows the action group in all four profiles. The
[refreshed 72-image gallery](http://localhost:9324/runs/2026-11-20T19-48-54.079Z/review.html)
is the current review set. Source
`5baa54d5668fb8b87a679976afefca4bf918ff934dbb77a18a9636adf08397f3`
verified against its manifest. Four product-sheet captures show the new layout.
64 captures are byte-identical to the previous gallery. Four receipt forms
differ by one color step at four to eight pixels on form corners.

`pnpm check` passed with 248 code tests. Pinned Chromium passed 45 interaction
checks, including the action order and fit at 320 and 768 px, continuation or
discard of an unsaved edit, and stock lookup for the exact product. All 12
targeted approved-reference comparisons passed.
[Playwright results](http://localhost:9324/runs/2026-11-20T19-48-34.202Z/playwright-report/index.html)

## Visual approval

On November 20, 2026, the user selected **Approve all 72 images** for the
[revised gallery](http://localhost:9324/runs/2026-11-20T19-48-54.079Z/review.html).
The 72 approved images were added to the registry. All 2,472 reference hashes
verify, including the 2,400 references carried forward.

Pinned Chromium compared all 72 promoted images successfully on the same source
and renderer. [Playwright results](http://localhost:9324/runs/2026-11-20T19-55-05.775Z/playwright-report/index.html)
