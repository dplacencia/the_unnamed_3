# Partial Pending receipt correction

The walkthrough opens the existing Pan de masa madre receipt at Almacén. The
saved quantity is 8 ud. and its recorded reason concerns quantity rules. Once
the exact line read confirms Pending, Revisar cantidad appears next to the
return action.

Show the recorded product, destination, amount and reason above the correction.
Keep the unit fixed. The fixture requires a positive smaller amount and the
product's configured increment of three units. Use the existing validation so
5, 8 and 9 are refused and 3 or 6 may be confirmed. Explain the quantity rule
beside an invalid input. An edit to the entered amount clears any previous
confirmation. The merchant explicitly confirms the actual amount before use.

After Inventory confirms application, show 8 ud. recorded and the 3 ud. the
merchant indicated as separate facts from the returned 3 ud. stock effect.
Return through the existing Pendientes reread of the same list context. The
fixture exercises a supported one-line correction and the first list page.

## Review

Compare against the approved partial receipt review. Exercise the list, exact
inspection, review, invalid value, confirmed application and return with pinned
Chromium. Review the approved four profiles with all five languages represented.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T21-00-08.886Z/comparison.html)
  pairs the previous review with the proposal and shows the validation and
  confirmed result.
- [40 screenshot candidates](http://localhost:9324/runs/2026-11-20T21-00-08.886Z/review.html)
  cover four profiles and five languages. Their source fingerprint is
  `e504febf2e9a28624a37a3de43360d77ed0c875c9aebc2f6a3550d7b9d0076bc`.
  The candidates were approved as recorded below.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed 11 browser
  checks, including invalid quantities, reconfirmation after an edit and return
  to the same Pendientes list at 320 px.
  [60 approved-reference comparisons](http://localhost:9324/runs/2026-11-20T20-59-24.445Z/playwright-report/index.html)
  passed, including the approved departure walkthrough and previous receipt review.

## Visual approval

On November 20, 2026, the user replied “that looks much better, I approve it.
continue” to the [40-image partial receipt gallery](http://localhost:9324/runs/2026-11-20T21-00-08.886Z/review.html).
All 40 images were added using the preserved source and pinned renderer.
Verified hashes cover 2,672 references, including the 2,632 carried forward.
All 40 approved images passed a
[fresh comparison](http://localhost:9324/runs/2026-11-20T21-09-57.676Z/playwright-report/index.html)
after the duplicate cancellation preview was added.
