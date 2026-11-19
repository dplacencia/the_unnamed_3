# Pending receipt inspection Storybook preview plan

**Goal** — Let merchants inspect one confirmed pending receipt line in the
existing Movimientos receipt panel.

The [approved requirements](specs/pending-receipt-inspection/spec.md) define
the interaction. On 2026-11-19 the user selected **“Build the simulated
preview (Recommended)”**. The preview uses a synthetic receipt response and
a deterministic read of one exact line reference. The native and gateway
boundaries are documented in the [design](design.md).

## Implement and verify the simulated flow

1. Model the synthetic exact read and test its state transitions in
   `apps/backoffice/.storybook/stories/pending-receipt-inspection-model.ts`.
   Pass the stable line reference returned by the simulated confirmed receipt.
   Model current Pending and retained reasons, a later applied or rejected
   outcome, independently unresolved facts, unavailable detail and technical
   failure. Preserve the exact value and unit received.
2. Compose the inspector in the existing
   [receipt panel](../../../apps/backoffice/.storybook/stories/stock-receipt-preview.tsx)
   with TailAdmin controls. Opt in through the new
   `pending-receipt-inspection.stories.tsx` catalogue entry. Use the established
   receipt form and confirmed Pending response as the entry point. Keep the
   original result accessible through “Volver a la entrada”. Use the approved
   labels and localize controls, states and accessible text for all five
   languages. Existing stories use the panel without this opt-in.
3. Add browser checks in `visual/tests/pending-receipt-inspection.spec.ts`
   and register them in `visual/playwright.languages.config.ts`. Verify
   submission, the exact reference passed to the inspector, neutral loading,
   “Actualizar”, “Reintentar”, unavailable detail and Back. Check that reads
   and retries leave the receipt command count unchanged, that opening the
   inspector again starts a fresh read, and that a late read after Back or
   close cannot replace the active panel. Check keyboard focus and the five
   phone locales.

## Visual review

Use the existing desktop, tablet, mobile and desktop dark profiles. Register
the proposed cases in [the visual inventory](../../../visual/inventory.json).

| Language                              | Scenarios                                                                                                                                                                                                                                              | Images |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -----: |
| Spanish                               | Original Pending result, current Pending with recorded reasons, known quantity with unresolved unit, unresolved quantity with known unit and unresolved product, subsequent Applied, subsequent Rejected, loading, unavailable, technical read failure |     36 |
| English, Catalan, Galician and Basque | Current Pending with known receipt facts                                                                                                                                                                                                               |     16 |

Run `pnpm check`, `pnpm visual:prepare`, `pnpm visual:coverage`,
`pnpm visual:test-languages` and strict OpenSpec validation. Compare the
existing Pending, applied and recovery receipt scenarios and the
receipt-to-stock-lookup scenario with their accepted references. Capture
the proposed 52 images with
`pnpm visual:capture --grep pending-receipt-inspection` and present the exact
run for user review. Use the agreed exact-run approval workflow for any
reference promotion.

## Verification and candidate review — 2026-11-19

The Storybook scenario records a simulated receipt through the existing form
and passes the returned line reference to the read-only inspector. The
inspector replaces the panel contents and Back restores the original
outcome and focus. The unresolved field examples exercise the independent
value and unit states supported by the native read.

The initial browser check failed against the previous build because the
inspection story was absent. The first new build exposed a focus race when
the Back control was removed. Moving focus within the panel before returning
resolved it. All 18 focused browser checks passed after the fix, including
same-line refresh and retry, late responses, five phone locales and live
language switching while the inspector stays open. The full catalogue browser
suite passed all 255 checks at the candidate source.

`pnpm check` passed with 168 code and tooling tests. The visual build and
coverage passed with 128 catalogue stories and 336 scenarios. Strict
OpenSpec validation passed all 11 changes. All 16 sampled comparisons of
existing receipt and stock lookup references passed.

The [52-image candidate run](http://localhost:9324/runs/2026-11-19T14-03-44.421Z/review.html)
passed all captures with zero skipped, unexpected or flaky outcomes. Its
source fingerprint is
`9c2dca8eb115bedee807159b5a8ffbec52c21e9776339269648fc1906aff29d2`.
The candidate manifest SHA-256 is
`4e71811def4e3f8c6563c24cab3ad49549af15465673b7269d86d621c243cfc5`.
All 52 image hashes match the manifest. The 1,292 accepted references match
the previous checkpoint.

## Visual approval and reference promotion — 2026-11-19

The user chose **“Approve all 52 images”** for the exact candidate run above.
Promotion verified the approved source and renderer and registered those
52 PNGs with the approval text. The registry now contains 1,344 references.
The independent audit verified all 1,292 earlier image hashes and registry
entries against the stock lookup checkpoint. The local proof is
`.cache/pending-receipt-inspection-promotion-proof.json`.

All 52 references passed the scoped Playwright comparison in
`2026-11-19T15-12-40.819Z` at the approved source fingerprint, with zero
skipped, unexpected or flaky cases.

## Commit preparation — 2026-11-19

The user authorized the two-batch checkpoint and runs both commit commands.
The starting commit is `8cf77436728d31686a17784973a9af34e0d556ca`.

1. Stage the 25 preview, test, visual inventory and OpenSpec files for
   `feat: add simulated pending receipt inspection`.
2. Verify the first user commit, then stage the 52 approved PNGs and
   `visual/references.json` for
   `test: accept pending receipt inspection visual references`.

The ignored `.cache/pending-receipt-inspection-checkpoint.json` records the
approved source and the paths, blob IDs and modes for both batches. Verify
both user commits and the clean checkpoint before starting Pendientes
discovery in Movimientos.
