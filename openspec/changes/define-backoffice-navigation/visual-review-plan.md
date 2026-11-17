# Outstanding navigation visual review

**Goal:** present the existing 20 outstanding navigation revisions for specific
approval using fresh captures of the current verified source.

**Architecture:** reuse the registered Storybook examples and canonical screenshot
runner. No navigation/product UI, fixture, dependency, renderer or tolerance change.

**Tech stack:** existing pinned Playwright/Chromium and prepared local previews.

## Authority and starting checkpoint — 2026-11-16

After the feedback checkpoint commits were verified, root recommended closing
the outstanding review of 20 navigation screenshots. The user said **“go ahead”**.
This authorizes preparing and verifying that exact review, not accepting images,
changing selected NAV-019–021 behavior, staging or creating commits.

Read tasks 8.4/9.4, implementation-plan sections 7–8, the navigation proposal's
post-commit refinements and NAV-019–021. The legacy 92-image run
`2026-11-12T22-46-21.298Z` is scope provenance, not the new approval target.
Fresh review images must use the current prepared source.

Starting HEAD is `21ea7c7d3ee3fb2ac3b6452b24cd8f312ae83ae4`, parent
`0b0d9d63507ec1d3ab78db48f654189f689443ba`. Both feedback commits match their
21/165-file manifests and the checkpoint is clean. Staging authority is spent.
Current source/build are `8ac7d6d2…`, with 928 accepted references and aggregate
`9802bb768a649251991cbf6013eee931e11039143d0bb89e4ed887025dd4224c`.
No rebuild is needed while application/test/inventory source remains unchanged.

## Exact review scope

The legacy candidate/accepted-registry hash comparison identifies exactly 12
changed existing phone cases and eight missing dropdown cases, with 72 legacy
navigation images byte-identical to their accepted references. Independent
read-only audit corroborates these IDs and their current inventory membership.

Phone replacements (all use `--mobile`):

- `navigation-ca-menu`, `navigation-en-menu`, `navigation-eu-menu`, `navigation-gl-menu`.
- `navigation-permission-error-retried`, `navigation-sole-location-default`.
- `navigation-workspace-compact-footer-folded`, `navigation-workspace-default`.
- `navigation-workspace-footer-folded`, `navigation-workspace-location-selected`.
- `navigation-workspace-page-memory`, `navigation-workspace-sidebar-toggled`.

New dropdown states: `navigation-workspace-location-options` and
`navigation-workspace-location-option-hovered`, each at desktop, tablet, mobile
and desktop-dark profiles (eight images).

Retain the selected single-row phone header, 36px visible selector/44px target,
contiguous full-width 44px option rows and their hover/keyboard behavior. No new
visual design choice is needed for this capture pass.

## Verification and delivery

1. Confirm exact source/build, accepted-reference hashes, clean starting index
   and the 20-case inventory selection before capture. Store the scope/patterns
   in ignored `.cache/navigation-review-scope.json`.
2. Capture only those 20 current-source cases. Preserve the 928 accepted PNGs and
   registry. Use the approved Mac renderer/fonts and threshold 0.01/maxDiffPixels 0.
3. Separately compare the nine unchanged phone cases previously excluded by the
   broad mobile-navigation filter. They are outside the 20 proposed revisions.
   Retain the matching-source passing evidence for the other 907 cases from the
   completed feedback checkpoint, verifying their references remain unchanged.
   Together these checks cover the 916 cases outside the proposed review.
4. Capture and comparison run sequentially because their report paths are shared.
   Inspect the phone headers and open/hovered options across the four profiles;
   record exact run/source IDs, case/hash checks, outcomes and any limitation.
5. Present one exact 20-image gallery and the live example for specific approval.
   Tests/captures do not accept images. Do not promote references, stage, commit,
   start new Products work or change the known intermittent icon issue here.

The existing 113-code/149-browser evidence belongs to this unchanged source; do
not rerun unrelated suites merely because documentation or capture scope changes.
The previously documented seven-pixel icon comparison remains a rendering
limitation, not a claimed fix. Exact current review approval is still required.

## Execution and review delivery — 2026-11-16

All **20 candidates passed** in capture run `2026-11-16T21-25-06.512Z`, exit 0,
with zero skipped/unexpected/flaky cases. The captured IDs match exactly the
12 replacement/eight new cases above, and every PNG matches its recorded SHA-256.
Source/build remain
`8ac7d6d269bffa275599b021feed1ec1057e36fe22e054058cc112194803265e`.
Renderer remains Mac 27 arm64, Playwright 1.65.0/Chromium 158.0.8127.18,
GPU disabled, DPR 1 and font manifest `1f28fef1…`; no tolerance changed.

The nine unchanged phone cases all passed in `2026-11-16T21-25-34.167Z`, exit 0,
with zero skipped/unexpected/flaky cases. Root and independent read-only audit
verified the prior matching-source partitions: 742 passing IDs in
`2026-11-16T20-36-38.232Z`, one ID in `2026-11-16T20-42-49.642Z` and 164 IDs in
`2026-11-16T20-57-02.794Z`. These cover exactly 907 distinct current IDs.
Together with the fresh nine, they verify exactly **916 unaffected cases**, the
complement of the 20 candidates in the 936-case inventory. This is partitioned
evidence; the earlier seven-pixel icon failure/repeats remain recorded in the
feedback plan, with no claimed rendering fix.

Visual inspection covered all 20 candidates across root and the independent
reviewer. All eight dropdown images were inspected: full names fit, hovered
Almacén fills the complete row, options are contiguous, and light/dark text is
readable. All 12 phone replacements were inspected: controls fit one toolbar,
the selector remains thin, long translated menu labels fit, and the folded
footer is visible. No material layout finding was observed. Production navigation
and real permissions/location data remain outside this simulated preview.

All **928 accepted PNGs and their registry remain unchanged** and match their
ledger hashes. The aggregate remains `9802bb76…`. The exact scope/hash/coverage
proof is `.cache/navigation-review-proof.json`; capture and comparison logs are
`.cache/navigation-review-capture.log` and `.cache/navigation-review-unchanged.log`.
No source, fixture, inventory, dependency, renderer or reference was changed.

Review the exact
[20-image gallery](http://localhost:9324/runs/2026-11-16T21-25-06.512Z/review.html)
and [live navigation preview](http://localhost:6006/?path=/story/navigation-merchant-workspace--workspace).
This fresh gallery supersedes the legacy image set as the approval target;
the old run remains provenance. Specific user approval is pending. Nothing is
promoted, staged or committed, and further Products work has not started.

Documentation closeout passes repository formatting, strict validation of all
seven OpenSpec changes, 114 local file/heading links across eight changed/new
Markdown documents and `git diff --check`. Both exact review links return HTTP 200. The index is empty; only nine documentation/configuration files changed.

## Visual approval and reference promotion — 2026-11-17

The user replied **“I approve them”** directly to the delivered
[20-image gallery](http://localhost:9324/runs/2026-11-16T21-25-06.512Z/review.html).
This specifically accepts all 20 cases from run `2026-11-16T21-25-06.512Z` at
source `8ac7d6d269bffa275599b021feed1ec1057e36fe22e054058cc112194803265e`.
It supersedes the pending navigation approval above and tasks 8.4/9.4 for this
exact set only. Future image changes still require specific approval.

Root promoted **12 existing phone references and eight new dropdown references**
through the official approval command, with the actual approval text and exact
run/source/profile/renderer/image identities. The other **916 images and registry
records remain byte-for-byte unchanged**, independently audited against the
before-state. There are now **936 accepted references**, matching the full current
inventory. The path-NUL-content SHA-256 aggregate is
`63d3e9bbd45e8760321dfe57526c605e93b04377c621146efbd66979e521ce3f`.
Proof is in `.cache/navigation-review-before-approval.json` and
`.cache/navigation-review-promotion-proof.json`.

All **20 changed-case comparisons passed** in `2026-11-17T07-47-03.167Z`, exit 0,
with zero skipped/unexpected/flaky cases. Source/build remain `8ac7d6d2…`.
The other 916 retain their matching-source passing evidence and unchanged image/
registry hashes. Their exact union verifies **all 936 current case IDs**, with
no missing/extra cases. This is partitioned evidence, preserving the previously
recorded icon variance and repeat results without claiming a renderer fix.
Proof: `.cache/navigation-review-post-approval-proof.json`; log:
`.cache/navigation-review-post-approval.log`.

The navigation visual review is complete. There is no remaining unapproved case
in the current inventory. No application/UI source, fixture, dependency, renderer
or tolerance changed. The index remains empty; image approval does not authorize
staging, commits, deployment or further Products design.

Approval closeout passes repository formatting, strict validation of all seven
OpenSpec changes, 119 local file/heading links across eight changed/new Markdown
documents and `git diff --check`. The working tree contains nine documentation/
configuration files plus exactly 21 reference files (registry and 20 PNGs).

## Commit preparation — 2026-11-17

After approval/promotion and verification, root recommended two commit batches:
documentation first, then approved visual references. The user said **“go ahead”**.
This grants new staging authority for those exact sequential batches, replacing
the earlier no-staging status for them only. **Never create commits.**

Starting HEAD is `21ea7c7d3ee3fb2ac3b6452b24cd8f312ae83ae4`, with an empty
index. Source/build remain `8ac7d6d2…`; the 936-reference aggregate remains
`63d3e9bbd45e8760321dfe57526c605e93b04377c621146efbd66979e521ce3f`.
No UI, fixture, dependency, tolerance or renderer change is included.

### Batch 1 — Documentation and review records

Stage exactly these **nine files**, including the previous feedback checkpoint
closeout already present in this documentation pass:

- `AGENTS.md`
- `apps/backoffice/AGENTS.md`
- `openspec/config.yaml`
- `openspec/changes/define-backoffice-navigation/proposal.md`
- `openspec/changes/define-backoffice-navigation/tasks.md`
- `openspec/changes/define-backoffice-navigation/visual-review-plan.md`
- `openspec/changes/define-products-table/feedback-preview-plan.md`
- `openspec/changes/define-products-table/tasks.md`
- `visual/README.md`

There are eight modified files and one new plan. Verify exact staged paths/blobs,
documentation checks and absence of references from the index, then provide:

```sh
git commit -m "docs: close navigation visual review"
```

### Batch 2 — Approved navigation references

Only after the user commits the exact first batch, verify that commit against its
prepared manifest and inspect the remaining working tree. Then stage exactly
**21 files**: `visual/references.json`, the 12 changed phone PNGs and eight new
open/hovered dropdown PNGs. All 20 images belong to approved run
`2026-11-16T21-25-06.512Z`, source `8ac7d6d2…`, and the user's **“I approve them”**.
Preserve the other 916 reference images and records. Then provide:

```sh
git commit -m "test: accept navigation visual references"
```

The ignored path/content manifests are
`.cache/navigation-review-documentation-batch.json` and
`.cache/navigation-review-reference-batch.json`. Batch 2 waits for the user's
first commit. Neither batch includes caches/generated files, further design,
push or deployment. No agent commit is authorized.

## Completed checkpoint — 2026-11-17

The user created commits `a3363fc19c6c98e54d01a9eff63f01cb67dfed92`
(`docs: close navigation visual review`) and
`3ae4cbda0ce31410302bfb81abd5b9578a00eb8f`
(`test: accept navigation visual references`). Root and an independent read-only
audit verified their exact nine/21-file paths/blobs, parent relationship and
clean final tree/index. Tasks 11.3–11.4 are complete and staging authority is spent.

Source/build remain `8ac7d6d2…`; all 936 PNGs match the registry, including the
20 approved navigation images, and the aggregate remains `63d3e9bb…`. The other
916 entries/images remain unchanged. Proof is retained in
`.cache/navigation-review-checkpoint-complete.json`. No agent committed.
The later user-authorized [Products browsing discovery](../define-products-table/browsing-design.md)
preserves that baseline; it does not inherit staging or future image approval.
