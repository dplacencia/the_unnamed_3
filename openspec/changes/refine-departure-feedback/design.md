# Stock departure feedback comparison

The comparison uses the same fixture as the approved departure panels. It
shows 2250 g of Tomate pera from Sala de ventas via Mostrador, with the
origin, channel and reported amount visible above one result notice.

- **Applied.** Show the exact signed stock effect, `-2,25 kg` in Spanish,
  separately from the entered `2250 g`. The panel has the movement effect.
  A current recorded balance would require an independent read.
- **Pending.** Keep the original-result label, the known reason, and the
  statement that stock did not change when the departure was registered.
  The existing current-status inspector opens from the departure's entry in
  Pendientes and requires the exact line reference.
- **Rejected.** Show the confirmed outcome and the supplied reason.
- **Unconfirmed.** Say the outcome could not be confirmed. Use
  Reintentar la misma salida to recover the frozen original command through
  the existing bounded run. Preserve the memory-only notice.

The layout reuses the approved TailAdmin success, warning, destructive and
neutral alerts. The comparison uses the existing approved images on one side
and captures the four proposed outcome states on the other. Review desktop,
tablet, phone and desktop dark, with five locales represented. Verify exact
effects, confirmed Pending and refusal, explicit bounded recovery, and narrow
phone layout in pinned Chromium.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T20-28-43.029Z/comparison.html)
  uses the existing approved departure reference for each of the four outcomes.
- [32 screenshot candidates](http://localhost:9324/runs/2026-11-20T20-28-43.029Z/review.html)
  cover all four profiles and five languages. The verified source is
  `1f23345acc541891878dd2a327bfbae246dac2e44046409f63e087e0c3d98295`.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed ten receipt
  and departure interactions, including the three new departure cases at
  320 px. All
  [56 approved-reference comparisons](http://localhost:9324/runs/2026-11-20T20-28-15.340Z/playwright-report/index.html)
  passed, including 40 receipt images and 16 departure baselines. The
  32 departure images await visual approval.

## Visual approval

On November 20, 2026, the user selected **Approve all 32 images** for the
[exact Salidas feedback gallery](http://localhost:9324/runs/2026-11-20T20-28-43.029Z/review.html).
The promotion used the preserved source from that run and the pinned Chromium
renderer. All 32 images were added. All 2,592 registry hashes verify, including
the 2,560 carried forward.

All 32 approved Salidas images passed fresh comparison in the Storybook build
that adds the Pending release guidance.
[Playwright results](http://localhost:9324/runs/2026-11-20T20-44-44.756Z/playwright-report/index.html)
