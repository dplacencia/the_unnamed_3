# Stock receipt feedback comparison

Compare the original receipt panel and the proposed feedback using Tomate pera,
Trastienda and 500 g. Reuse the TailAdmin sheet, alert and buttons. Keep the
product and location visible with the result and use ordinary Spanish labels
for the distinct actions. Review the same facts in all five supported languages.

| Result                              | Facts and next action                                                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmed Pending                   | Keep Resultado al registrar la entrada, Entrada pendiente and the recorded reasons. Say that stock did not change when this entry was registered. Ver detalles opens the existing inspector for the exact recorded line.                    |
| Outcome unknown                     | Say that the result could not be confirmed. Reintentar la misma entrada retries the original operation and contents through the existing bounded recovery. Keep effects and exact line inspection unavailable while the outcome is unknown. |
| Applied and the balance read failed | Keep the exact applied quantity visible. Show the failed lookup separately under Existencias registradas. Reintentar consulta retries the read of that pair.                                                                                |

In the Pending fixture, the first exact read returns Pending and Actualizar
returns Applied with a 500 g effect. Volver a la entrada restores the original
result. The statement about recorded stock refers to that original result and
still describes it accurately after the current status changes.

## Review

Check the current and proposed original Pending result, the two inspector
states, and both retry examples across desktop, tablet, mobile and desktop
dark. Include the localized original Pending result. Use pinned Chromium for
the exact reference, historical return, bounded write retry and read-only
retry behavior. The fixture controls the statuses and amounts.

## Review evidence

- [Side-by-side comparison](http://localhost:9324/runs/2026-11-20T20-16-37.301Z/comparison.html)
  shows the two original-result treatments, both current statuses, and the
  distinct retry actions.
- [40 screenshot candidates](http://localhost:9324/runs/2026-11-20T20-16-37.301Z/review.html)
  cover four profiles and five languages. The source fingerprint is
  `d5291b825673c9f26d668c353715411b380a3384b0a8fc6d8b026b3c5f58dbd6`.
- `pnpm check` passed with 248 code tests. Pinned Chromium passed 40 receipt and
  inspector interactions. The new tests exercise the same line reference,
  the return to the original result, both retry paths and a 320 px viewport.
  [28 approved-reference comparisons](http://localhost:9324/runs/2026-11-20T20-16-13.247Z/playwright-report/index.html)
  passed. The new images await visual review.
