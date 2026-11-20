# Duplicate cancellation review

Compare the existing counterpart-selection review with a focused Storybook
walkthrough from Pendientes. The simulated exact inspector offers Revisar
duplicado after the current line is confirmed Pending and the established
fixture permits cancellation.

The review groups the complete target and its two lines together. A separate
section offers the existing authorized counterpart choices with no selection
made. The counterpart options display the batch references supplied by the
fixture. Keep the explicit reason,
same-movement confirmation and reset on changing the counterpart, and label
the submit action Confirmar cancelación.

When Inventory confirms duplicate cancellation, display both identities from
the submitted command and the result that stock did not change. Return through
the existing list refresh. The unavailable fixture keeps its generic response.
The [Pending resolution design](../define-pending-resolution-workspace/design.md)
governs eligibility, transport, recovery and the live dependency.

## Review

Verify the chosen identity, reset of the confirmation and return to the same
list context at 320 px. Compare the existing resolution screenshots and
present the new list, exact inspection, selected review, confirmed result and
return in the four profiles. Include all five supported languages.

## Review evidence

- [Before and after](http://localhost:9324/runs/2026-11-20T21-10-33.920Z/comparison.html)
  shows the approved counterpart-selection review and the proposed walkthrough.
- [36 screenshot candidates](http://localhost:9324/runs/2026-11-20T21-10-33.920Z/review.html)
  cover four profiles and all five languages. Their source fingerprint is
  `05cebe3e47e2b558a04792345d1e180b1aee419fc6332563a2cd68b097442140`.
  The candidates await review.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed 12 browser
  checks, including explicit reconfirmation when switching from receipt-198 to
  receipt-197, the result for receipt-204 with no stock change, and return to
  the same Pendientes list at 320 px.
  [112 accepted-reference comparisons](http://localhost:9324/runs/2026-11-20T21-09-57.676Z/playwright-report/index.html)
  passed, including all 40 approved partial-receipt references.
