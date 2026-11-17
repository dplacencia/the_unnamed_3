# Product creation Storybook preview plan

The user said **“go ahead”** after the PC-010 handoff recommended a simulated
Storybook preview of the ten creation requirements. This authorizes one preview
within the existing workspace and read-only reference to Inventory. Preserve
existing Products stories and the approved screenshot registry. Never commit.

1. Write and run failing model tests for explicit unit selection, exact draft
   validation, custom-step review, unchanged bounded retries and scope-safe
   restoration. Implement those behaviors in Storybook fixtures. Reuse Inventory
   rules and the existing recovery timing where applicable.
2. Compose the existing Products workspace, TailAdmin panel, form and dialog.
   Provide simple and advanced fields, direct submission, discard protection,
   confirmed details, honest rejection and unconfirmed recovery. Add copy for all
   five languages. Keep the new action isolated to the creation story variants.
3. Use deterministic synthetic responses and virtual recovery time. Demonstrate
   retained records and storage fallbacks with fixtures. The preview has no live
   Inventory requests or production browser storage, permissions, ownership or
   coordination semantics. The mobile panel follows the existing phone width.
4. Write browser regressions for confirmation without moving the table, unit
   change review, keyboard departure, bounded and restored recovery, and the
   memory-only state. Register representative responsive, dark and localized
   states in the existing visual workflow. Check code, build, catalogue coverage,
   browser behavior and strict OpenSpec conformance. Review the change independently
   and present the exact candidate gallery for user approval.

## Verification and visual review

The five stories cover the creation form, exhausted recovery, restored recovery,
the memory-only fallback and confirmed rejection. The fixtures simulate one
unresolved creation at a time. Restoration and request timing are simulated. A
confirmed product enters the existing table without stock or an invented SKU.
Its details are available in the panel even when the current table view excludes it.

`pnpm check` passed with 144 code tests. Storybook built and coverage found 103
stories and 286 named scenarios. Strict OpenSpec validation passed all eight
changes. The full browser run passed 198 checks, and 12 sampled existing reference
comparisons passed. After the final radio styling adjustment, all 14 creation
browser checks passed again. The independent review confirmed that restored
requests show their uncertain status before resumption, and that the final radio
uses the approved accent in dark mode. The visual review sampled desktop, tablet
and phone states. Earlier intermittent screenshot comparisons remain documented
in the [toolbar follow-up](../define-products-table/toolbar-rendering-followup.md).

The final [60-image candidate run](http://localhost:9324/runs/2026-11-17T20-35-50.069Z/review.html)
passed all capture checks with no skips or flaky outcomes. The source fingerprint
is `807073c81bb1fd7f54dc14c985dbbfe33d4cbc6fdbc888ae3f82fb3aaf5cfc2b`.
The run manifest SHA-256 is
`f48612ca1fa7687e7a42bd4e5d2b7cb878664cab4ef10becfa32c81004046042`.
All 60 candidate image hashes match the manifest. The four profiles and five
languages use the existing visual workflow. The 1,084 reference files and
registry were byte-identical to the committed checkpoint at handoff.

## Visual approval and reference promotion — 2026-11-17

After reviewing the linked 60-image gallery, the user said **“That looks ok so
far. I approve it”**. The approval applies to the exact run and manifest recorded
above. The current source fingerprint and pinned renderer matched the run. The
authorized promotion added those 60 images and entries, yielding 1,144 accepted
references. The 1,084 earlier images and their registry entries match the
committed checkpoint. The independent audit verified the 60 registered case IDs,
capture conditions, and image hashes. The local promotion receipt is
`.cache/creation-promotion-proof.json`.

Post-promotion comparison `2026-11-17T20-44-11.507Z` passed all 60 creation cases
at the same source fingerprint, with zero skipped, unexpected or flaky cases.
This comparison was scoped to the new creation references. The index was empty
after verification.

## Checkpoint before the receipt preview — 2026-11-17

The user said **“go ahead, but lets commit the previous work first, as we always
do”** after the first stock receipt design was ready for a simulated Storybook
preview. Prepare the completed work in the following order. The user runs each
commit command, and the next batch is staged after verification of the prior one.

1. Product creation Storybook, tests, inventory registrations and related OpenSpec
   and agent documentation. This batch has 23 files, including the prior toolbar
   checkpoint closeout in `define-products-table/tasks.md`.
2. The approved product creation visual registry and 60 PNGs from the exact
   run recorded above. This batch has 61 files and preserves earlier entries.
3. The five completed OpenSpec files in `define-first-stock-receipt`.
   The receipt preview starts after these definitions are committed and verified.

The starting HEAD is `2652246224e635e609d6c3b6daa97948c77abae4` with an empty
index. Preserve the approved source fingerprint, candidate hashes and baseline
reference entries. Store the three exact path, blob and mode manifests under
ignored `.cache` together with the expected order and later verification records.
Never create a commit.
