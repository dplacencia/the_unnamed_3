# Toolbar and visual comparison follow-up

## Authority and starting checkpoint — 2026-11-17

After root recommended reviewing the reported Basque phone toolbar overlap and
investigating intermittent visual comparisons without changing thresholds, the
user said **“go ahead”**. This initiates that bounded investigation and any
evidence-supported correction preserving the existing approved UI behavior.
It does not initiate product creation, API/backend work, reference promotion,
staging or commits. Exact changed images still need specific approval.

The user's commits `8a605fa8f77611d388455d48535b25acd91218c4` (31 files) and
`bb19133389526baff4c3b8f5bd21e7c4e934aa7d` (149 reference files) exactly match
their prepared parent/path/blob/mode manifests. The first subject is `eat: add
simulated product catalogue browsing`; only its metadata differs from the
suggested title. Tree/index were clean before this follow-up. Both staging
permissions are spent. The closeout proof is
`.cache/products-browsing-checkpoint-complete.json`; no agent created a commit.

Starting source/build: `5f628f39…`. All 1,084 approved images and registry entries
remain protected, aggregate
`56dc098b00be7c7f6f0a13f7adb42101812dba4d58d18e9988d27c1c1d58c86c`.
Keep Mac/pinned Chromium, fonts, GPU-disabled launch profile, DPR 1, colour
threshold 0.01 and maximum differing pixels 0 unchanged. Do not hide/mask pixels,
add retries until green or replace accepted images to conceal a failed comparison.

## Existing approved basis

- NAV-014/016/019/020 retain a single compact phone toolbar, visible controls,
  44px menu/theme targets, text ellipsis/full accessible names and slim location
  selection. They already require fitting without overlap; no new design is selected.
- VIS-002/004 retain human acceptance of exact references, registered profiles,
  the pinned renderer and strict comparison settings.
- Products editing/recovery/filters and the synthetic page-number design retain
  their approved behavior. The backend pagination gap remains separate.

## Investigation and implementation boundary

1. Reproduce the exact Products-injected toolbar with location/filter interactions
   in all five languages at the existing phone/tablet widths. Inspect DOM geometry,
   scroll offsets and actual pixels before changing CSS. A false-positive finding
   must be corrected, not turned into an unnecessary layout change.
2. Investigate the seven-pixel legacy tablet moon-icon and one-pixel phone control-
   border differences using isolated, bounded probes under `.cache`. Compare
   fresh contexts and successive frames; inspect fonts, rects, transforms,
   animations, focus and screenshot lifecycle. Preserve original failures.
3. Test one cause at a time. A capture-readiness repair is allowed only when
   evidence supports it, with the same renderer/thresholds and capture/compare
   semantics. Do not remove relevant interaction state or silently change controls.
4. Add meaningful regression coverage before a behavioral correction. Existing-
   behavior coverage may be green immediately; do not call it a reproduced failure.
   Use a meaningful baseline failure for any claimed repeatability correction.
5. Verify source conformance and quality, browser behavior, actual changed visual
   scope and unchanged references at a fresh source. Deliver an exact gallery if
   images change. Preserve all 1,084 references until their specific approval.

Permitted source paths: the shared `navigation-prototype.tsx/.css` and injected
Products toolbar only if a real defect is established; `visual/tests/navigation.spec.ts`
for geometric regression; shared capture preparation in `visual/tests/catalogue.spec.ts`
and a narrowly necessary helper/test under `visual/` if the cause warrants it.
Existing actions may change only for faithful state preparation. Do not alter
profiles, Playwright/browser versions, fonts, dependencies, screenshot threshold,
accepted reference files or production application routes. Root owns shared
capture preparation and OpenSpec/agent/context records; diagnostic helpers write
only their disjoint assigned source or ignored evidence paths. No concurrent
standard capture/compare runs share the same report paths.

## Initial findings

The reported Basque overlap is not present in the approved screenshot or exact
live reproduction. Menu hitbox is x12–56, title box x64–155 at 390px, and actual
title dark pixels begin x65. At 320px the title correctly ellipsizes inside
x64–120. The exact filter/location/two-RAF/full-page lifecycle also preserves
separation at 320/390/640. The original visual impression was wrong; root has
corrected it to the user. No layout/CSS fix is justified by this finding.
The existing geometric regression is extended to Products' injected toolbar,
since the earlier test only exercised Navigation's own selector. Five new locale
tests pass across 320/390/640px, both locations and positive-filter popup closure,
using the same font/scroll/two-frame preparation and full-page screenshot options.
The new test does not exercise the canonical consecutive-identical-frame polling.
Evidence is `.cache/toolbar-overlap/green.log`,
`results.json` and `exact-geometry.json`. Only the browser test changes; no app/CSS
fix or manufactured failing reproduction is claimed.

Isolated raster probes reproduce context-to-context colour variants despite
identical control rects/transforms/fonts; successive frames within each context
are stable. Before the first screenshot, finite 150ms control transitions can
still be running after fonts and two animation frames. Awaiting all finite
animations is a negative experiment: zero animations remain but fresh-context
paint variants still occur. It does not justify a sleep or readiness repair.

Twenty-four real-app probe captures reproduce the exact mobile alternate variant
(25 raw pixels; one above the existing threshold), stable within each context but
variable between contexts. Thirty-six animation-settled probe captures do not
remove the effect. Forty-eight static minimal-control captures remain identical
within their viewport; primitive moon/border shapes alone do not reproduce it.
The original seven-pixel moon variant is not reproduced in these probes.
No Chromium subsystem or application-code cause is established.

The final discriminator froze the actual final DOM/CSS/form state into script-free,
JavaScript-disabled copies: eight fresh contexts, two screenshots each. Relevant
control geometry/styles, loaded fonts, stylesheets, focus and scroll matched the
source. All 16 toolbar regions were identical to its alternate border variant;
between-context variation did not reproduce. Known hover differences elsewhere
were excluded; one final pointer-matched context still had 245 uninstrumented
text-region pixels, also excluded. This is not full-document equivalence or proof
that React, Chromium or any specific mechanism causes the real-app variance.

The bounded probes are complete. Their evidence narrows the observation but does
not establish a repair. No application CSS, capture readiness, renderer, font,
threshold or reference change is justified. Preserve both real-app variants and
the original failures. The original seven-pixel moon variant remains unresolved,
as does the cause of the reproduced mobile border variant. See the retained
`.cache/raster-diagnosis/REPORT.md` and its linked probe records. Repeating strict
comparisons until green would not resolve this limitation.

## Verification and handoff

The only executable-source delta is the five existing-behavior toolbar browser
tests. Application, interaction preparation and screenshot configuration remain
unchanged, so no new visual candidates or acceptance are initiated.

Repository quality checks pass: formatting, lint, types and 134 code tests.
Storybook builds successfully; the rebuilt catalogue and unchanged app artifacts
are registered at source `2009868b1e33e0d982af8a17a79d3496d15ee0bc272f6417176567a8915b911e`.
Coverage inventory passes. Strict OpenSpec validation passes all seven changes.
The independent source/conformance review passes, with reporting precision
corrections applied. All 184 browser checks pass, including the five new locale
tests. Logs are `.cache/toolbar-rendering-check-final.log`,
`.cache/toolbar-rendering-browser.log`, `.cache/toolbar-rendering-storybook.log`
and `.cache/toolbar-rendering-openspec-final.log`. The changed-document link audit
passes all 122 links in four Markdown files.

All 1,084 reference images/entries and the font manifest retain their exact
starting hashes, recorded in `.cache/toolbar-rendering-preservation.json`.
At that investigation handoff, HEAD remained `bb191333…`; the index was empty.
Nothing had been staged or committed.
These checks do not imply wholly green or deterministic visual comparisons.

Status: this bounded follow-up is complete as an investigation and regression-
coverage pass. The alleged overlap is corrected as a false finding; visual
repeatability remains unresolved. No UI/capture repair or new visual review is
claimed. A broader renderer diagnostic would be a separate scoped next step,
not an implicit profile change or a prerequisite for further product discovery.

## Commit preparation — 2026-11-17

After root recommended checkpointing these tests and findings, the user said
**“go ahead”**. This authorizes preparation and staging of the following single
six-file batch, followed by providing the user's commit command. It supersedes
the investigation's no-staging boundary only for this batch. The agent must never
create a commit. No new feature, diagnostic, reference or API work follows.

- `AGENTS.md`
- `apps/backoffice/AGENTS.md`
- `openspec/config.yaml`
- `openspec/changes/define-products-table/tasks.md`
- `openspec/changes/define-products-table/toolbar-rendering-followup.md`
- `visual/tests/navigation.spec.ts`

Expected parent is `bb19133389526baff4c3b8f5bd21e7c4e934aa7d`; executable source
remains `2009868b1e33e0d982af8a17a79d3496d15ee0bc272f6417176567a8915b911e`.
The existing 134-code-test/184-browser-test verification remains applicable:
only preparation bookkeeping changes after that verification. Check formatting,
strict OpenSpec validation, changed-document links and whitespace, then stage the
exact allowlist and verify its file/blob/mode manifest against the working tree.
No application, renderer, fonts, references or ignored `.cache` evidence belongs
in this commit. Preserve the recorded unresolved raster limitations.

Provide:

```sh
git commit -m "test: cover product toolbar layout and record visual findings"
```

Record the prepared manifest and staging verification under ignored `.cache`.
After the user reports committing, verify its parent/path/blob/mode contents and
remaining tree/index state before recommending further work. Commit completion
must not be inferred from staging or from this preparation record.
