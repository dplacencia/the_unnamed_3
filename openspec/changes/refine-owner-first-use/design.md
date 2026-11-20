# Owner first-use guidance comparison

The daily stock workflow improves a task a merchant performs repeatedly. This
comparison applies the same clear hierarchy to the first Inventory setup.
Both variants start in the existing merchant workspace.

## Inicio

Put a short task explanation and one primary action in a TailAdmin card. For
an active trial, display the supplied trial facts below it. A pause or failed
access check retains its distinct notice and offers an authorized Core action.
The sidebar remains available for merchants who already know where to go.

| Confirmed setup                                     | Primary action                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| The business has no Site                            | Open the existing Site form, which also creates its first Area.                            |
| One eligible Area and no usable stock location      | Show its full Area and Site names, then open the existing stock setup form when requested. |
| Several eligible Areas and no usable stock location | Open the Inventory settings list so the merchant can choose an Area.                       |
| No active Area                                      | Open Centros y áreas to work on the existing Core hierarchy.                               |
| Active Areas and no usable or eligible location     | Open the existing Inventory settings and surface the known state.                          |
| Usable stock location                               | Continue the established product, receipt, channel, departure and exact stock sequence.    |

The eligibility helper already used for stock setup governs the Area choice.
Use only active locations under active Areas to decide whether an enabled
channel can support departure. Product creation remains available through the
ordinary workspace where permitted. Existing forms continue to confirm the
intended target and preserve the Owner's choices.

## Comparison and verification

Use localized text in Spanish, English, Catalan, Galician and Basque. Review
the current and proposed first visit, one Area, multiple Areas, no active Area,
paused Inventory and an unavailable access check at the established four visual
profiles. Exercise the actual CTA, the explicit Area choice and the narrow
phone layout in pinned Chromium. Capture the candidates against the approved
renderer and preserve existing reference approvals.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T20-01-29.550Z/comparison.html)
  shows the earlier Inicio beside the proposal and follows the multi-Area choice
  to the existing setup list.
- [48 candidates](http://localhost:9324/runs/2026-11-20T20-01-29.550Z/review.html)
  span all four profiles and five languages. The source fingerprint is
  `502026010663a28307bfd6e8fb91d71b8666e24f2d10b97dbc4dabdebc4e626f`.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed ten
  interaction tests, including all five languages at 320 px. All
  [16 existing Owner reference comparisons](http://localhost:9324/runs/2026-11-20T20-01-22.050Z/playwright-report/index.html)
  passed. The 48 new candidates await visual review.
