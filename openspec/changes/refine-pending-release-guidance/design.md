# Pending departure release walkthrough

Use the existing Manzana reineta line in Sala de ventas. Inventory recorded
2.5 kg and the reason that the channel was missing. After the current exact
read reports Pending, Revisar canal appears in the inspection's action group.
The existing Volver a Pendientes action remains available. The review is
available only for that confirmed line and uses the existing sheet.

Keep the saved facts and reason above the form. Present the authorized
Mostrador and Recogida en tienda options with no default. Require a new explicit
confirmation whenever the merchant changes the selected channel, and name the
write action Confirmar liberación. The existing frozen command, authority and
retry behavior govern the write.

After confirmed application, show the original line facts, the channel the
merchant indicated, and the exact signed stock effect. The fixture reports
-2.5 kg. Volver a Pendientes returns through the existing refresh behavior.
The refreshed response determines which lines remain. This fixture exercises
the first page with the chosen scope and page size. An unconfirmed attempt
does not show an applied effect and retains its original recovery action.

## Review

Compare the previous direct review with the proposed panel. Exercise the list,
exact inspection, review, application, return and unconfirmed outcome. Use
Spanish, English, Catalan, Galician and Basque in the approved visual profiles,
and verify the channel confirmation and retained list context at 320 px.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T20-45-12.342Z/comparison.html)
  pairs the approved prior review with the proposed review and shows the entire
  flow.
- [40 screenshot candidates](http://localhost:9324/runs/2026-11-20T20-45-12.342Z/review.html)
  cover four profiles and five languages. Their source fingerprint is
  `814ac93ad4053a265fe58ed5321fc23c7c7f73a724113c9ce4654b1375348254`.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed 28 browser
  interactions. The new tests include 320 px layout, explicit reconfirmation,
  exact signed effect, retained list scope and size, and resumed recovery.
  [52 approved-reference comparisons](http://localhost:9324/runs/2026-11-20T20-44-44.756Z/playwright-report/index.html)
  passed, including all 32 Salidas images. The new candidates await review.
