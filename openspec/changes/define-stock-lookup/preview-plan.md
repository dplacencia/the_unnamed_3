# Consultar existencias Storybook preview plan

**Goal** — Let merchants try the approved exact product and location lookup in
the existing backoffice catalogue.

The [approved OpenSpec requirements](specs/stock-lookup/spec.md) define the
interaction. On 2026-11-18 the user selected **“Build the simulated preview
(Recommended)”** for this Storybook implementation. The chooser and the exact
reads use synthetic data. The preview makes no network requests to Inventory
and changes no route or deployment configuration.

## Implement and verify the simulated flow

1. Define deterministic read outcomes and timing in
   `apps/backoffice/.storybook/stories/stock-lookup-model.ts`. Test an exact pair
   becoming available, superseding a pending read, and A → B → A selection
   changes. Test that a stale response cannot replace the latest result.
   Represent balance, no record, denial, invalid pair and technical failure as
   distinct outcomes. Preserve signed decimal values and units without rounding.
2. Compose the view and stories in
   `apps/backoffice/.storybook/stories/stock-lookup-preview.tsx` and
   `apps/backoffice/.storybook/stories/stock-lookup.stories.tsx`. Reuse the
   [receipt product picker pattern](../../../apps/backoffice/.storybook/stories/stock-receipt-form.tsx)
   and the [navigation location control](../../../apps/backoffice/.storybook/stories/navigation-prototype.tsx).
   Keep the selected product identifiable while the search text changes. Use
   the existing TailAdmin primitives and localize visible controls, messages and
   accessible labels in all five supported languages.
3. Exercise all three entry points within the new preview. Opt in to the
   shortcut from confirmed product details and from an applied receipt. The
   receipt shortcut uses the exact authorized pair for this visit. Explicit
   selections update the business's remembered choices for this tab. Verify
   that shortcut selections alone do not replace those choices. Reuse existing
   surfaces without enabling the shortcut in previously reviewed stories.
4. Exercise refresh and retry with deterministic outcomes. Assert that a
   same-pair previous balance stays visibly marked during loading and after
   a technical failure, and clears when a successful read returns no record,
   when the selection changes, or when the read denies access or reports an
   invalid pair. A read following no record has no previous amount to show.
   Verify that focusing the tab triggers no read and denied or invalid outcomes
   leave permitted selectors usable. Add focused browser checks in
   `visual/tests/stock-lookup.spec.ts` and include them through
   `visual/playwright.languages.config.ts`.

## Visual review

Register the cases in [the visual inventory](../../../visual/inventory.json).
Use the existing desktop, tablet, mobile and desktop-dark profiles.

| Language                              | Scenarios                                                                                                                                                                                                                                             | Images |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| Spanish                               | Incomplete pair, duplicate-name picker, initial loading, positive balance, recorded zero, negative balance, no record, refreshing with previous balance, failed refresh with previous balance, initial technical failure, denied access, invalid pair |     48 |
| English, Catalan, Galician and Basque | Recorded balance with both selections visible                                                                                                                                                                                                         |     16 |

Run `pnpm check`, `pnpm visual:prepare` (which builds Storybook),
`pnpm visual:coverage`, `pnpm visual:test-languages` and strict OpenSpec
validation. Compare the affected existing navigation, product and receipt
references. Capture the proposed 64 images with
`pnpm visual:capture --grep stock-lookup` and link the exact successful run for
review. Existing references and the reference registry retain their accepted
content during candidate review.

## Verification and candidate review — 2026-11-18

The preview uses the shared workspace, product details and applied receipt
panel. Product details use confirmed catalogue records. The receipt and
lookup use the same synthetic ledger and location labels. Current stock
access controls the lookup after an applied receipt.
The Spanish positive and refreshing examples exercise the product and
receipt shortcuts respectively.

The first browser test failed against the previous Storybook build because
the lookup workspace was absent. The full catalogue browser suite later
passed 237 checks. After aligning the receipt and lookup location labels,
all 39 focused lookup and receipt checks passed. `pnpm check` passed with
161 code and tooling tests. The build and visual coverage passed with 120
catalogue stories and 323 scenarios. Strict OpenSpec validation passed all
ten changes.

The [64-image candidate run](http://localhost:9324/runs/2026-11-18T16-55-11.509Z/review.html)
passed all captures with zero skipped, unexpected or flaky outcomes. All 24
sampled comparisons of earlier navigation, product details and receipt
references passed at the candidate source. The source fingerprint is
`be00dd2ea4c055a1d3c87a1f4f8567139b2611765a25708f62d6596e9dd61525`.
The candidate manifest SHA-256 is
`0b2c01fd7e48efb3bae2aad32cdcb732919a7f81ca4bfb78108af2a52d082d3d`.
All 64 image hashes match the manifest.

## Visual approval and reference promotion — 2026-11-18

The user chose **“Approve all 64 images”** for the exact candidate run above.
Promotion verified the candidate source and renderer, then registered those
64 PNGs with the approval text. The registry now contains 1,292 references.
All 1,228 previous PNG hashes and registry entries match the receipt
checkpoint. The local proof is `.cache/stock-lookup-promotion-proof.json`.

All 64 references passed the scoped Playwright comparison in
`2026-11-18T17-32-47.087Z` at the approved source fingerprint, with zero
skipped, unexpected or flaky cases.

## Commit preparation — 2026-11-18

The user authorized the established two-batch checkpoint and runs both commit
commands. The starting commit is `04746aea0595e8dee686b8ffafbfc0aade5740c3`.

1. Stage the 25 preview, test, visual inventory and OpenSpec files for
   `feat: add simulated stock lookup preview`.
2. Verify the first user commit, then stage the 64 approved PNGs and
   `visual/references.json` for `test: accept stock lookup visual references`.

The ignored `.cache/stock-lookup-checkpoint.json` records the approved source
and the paths, blob IDs and modes for both batches. Verify each user commit
against its expected parent and manifest before starting the next batch or the
next Inventory design.
