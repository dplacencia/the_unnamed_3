# Collaborative visual review — selected workflow and implementation

## Source and current priority

The user said:

> I prefer defining now how are we going to achieve designing? Playwrith? What
> can we do with it? I need a way that you and I can visually test every
> component, view, etc.

This moves visual-workflow definition to the active priority. It does not approve
the preceding feature-folder proposal or automatically start branding/product
flows. The [technical foundation](../establish-frontend-technical-foundation/proposal.md)
retains approved choices and its remaining unresolved local-stack questions.

## User need versus proposed tools

The approved need is a shared way to inspect and visually test components and
views. The user answered “go with your recommendation” to the workflow below,
including the described catalogue, browser and explicit review cycle. This
supersedes the earlier pending tool-selection wording. Installation and actual
coverage must still be verified; selection is not an accepted reference image.

Selected: Storybook for the Next.js/React backoffice component catalogue,
Astro-rendered development previews for Astro-native landing components, and
Playwright Test for browser interactions and screenshot comparisons across both
catalogues and the actual app views. Existing Vitest tests retain their role.

Unselected alternative: custom development-only component galleries in both apps, also
tested with Playwright. This reduces catalogue-tool dependencies but requires
maintaining our own navigation, controls, state selection and coverage index.

Storybook's official Next.js/Vite integration is a suitable candidate to assess
against the pinned versions, SVG rules, actual CSS/fonts and locale/theme
providers before adopting it. Native Astro components should render through
Astro; do not select React for the landing or claim official Astro Storybook
support merely to unify the catalogue UI.

## What the tools provide

- A component catalogue gives the user and agent stable, named scenarios that
  render actual source components: normal, focused, disabled, error, open/closed,
  long-content and other applicable states. Controls help inspect variants live.
- Playwright can operate the browser, exercise pointer/keyboard interactions,
  inspect layout and capture component or page screenshots. Its assertions
  compare current screenshots with references and surface differences.
- Playwright UI Mode supports interactive test exploration. HTML reports and
  traces support reviewing failures and the actions leading to them.
- Actual backoffice and landing previews remain part of coverage: isolated
  component checks alone do not establish integrated layout/navigation behavior.

## Selected shared review cycle

1. Implement a scoped candidate in the actual component/view source and expose
   its named preview scenarios with deterministic technical fixtures.
2. The agent runs interactions/checks and inspects rendered images; the user opens
   the same preview URLs and tries the controls, layouts and relevant states.
3. Capture candidate images under the agreed rendering environment. The user
   approves the reference appearance; a newly generated image is only a candidate
   until accepted. Existing template branding stays provisional.
4. Later runs provide expected/current/difference images and a browser-readable
   report. The agent explains what changed and identifies clipping, spacing,
   text wrapping, interaction or other issues supported by the evidence.
5. Correct unintended changes. Update only specifically reviewed/approved
   references for intentional changes. A bulk snapshot update must not substitute
   for review or convert missing references into accepted designs.

Pixel comparison detects differences; the user and agent still assess whether
the design is useful, simple, familiar, accessible and aligned with the values.
Screenshots do not by themselves establish usability or complete accessibility.

## Coverage contract and selected profiles

Maintain a coverage inventory connecting each renderable component, reusable
composition and app view to its scenarios, preview link and checks. Include
existing retained TailAdmin primitives, then require coverage as new UI is added;
show missing coverage explicitly rather than claiming that enumerating existing
stories proves every component is covered. Nonvisual helpers use suitable code
tests rather than meaningless images.

For each item, agree applicable variants: responsive sizes, approved languages,
light/dark appearance where applicable, loading/empty/error states, long content,
focus/keyboard behavior and user-selected simple/advanced modes when implemented.
Do not invent product states, permissions or flows to populate a test matrix.
Select a practical matrix rather than silently multiplying every dimension.

Use a fixed rendering environment for accepted references: pinned browser/tool
versions, stable fonts, data, time, locale, viewport and animation behavior.
Different operating systems/browser renderers can produce different pixels.
The user selected “Pinned Chromium on this Mac (Recommended)” for the initial
canonical environment; no Linux container or cross-browser matrix is selected.
The user selected “Responsive coverage plus theme/language cases (Recommended)”.
The initial matrix is desktop 1440×900, tablet 768×1024, mobile 390×844,
desktop dark-mode cases and five-language checks on assembled views. Relevant
registered interaction states have their own cases. Pixel comparison initially
used threshold 0. After the recorded repeat audit, the user selected colour
threshold 0.01 with maxDiffPixels 0. Unexplained differences remain evidence to
inspect; this approval does not authorize further tolerance changes.

## Implementation plan

Exact initial tooling pins from official registry metadata checked at
2026-11-11T23:02:00Z: Storybook, `@storybook/nextjs-vite` and `@storybook/addon-docs`
10.6.7; Playwright Test 1.65.0. All satisfy the selected 24-hour waiting period.
The official Next.js/Vite adapter peers include the locked Next 16/React 19/Vite 8
lines. Add `vite-plugin-svgr` 5.2.0 to preserve existing SVG-as-component imports;
use the existing Vite 8.3.7, TypeScript 5.9.3 and Node types 26.6.6 where direct
tooling declarations are needed. Root tooling tests may use the already selected
Vitest 5.1.0. No global installs, new script permission or age exception is implied.

1. Record VIS-001–005 and the selected scope before runtime edits. Save current
   manifests/lock under ignored cache for a dependency-resolution comparison.
   Record the approved responsive/theme/language matrix.
2. Add root Playwright/TypeScript/test tooling declarations and backoffice
   Storybook/Vite adapter declarations as exact development dependencies. Install
   with the repo-pinned toolchain/policies, inspect gates and retain existing
   direct resolutions. Install only the selected Chromium under repo-local cache.
3. Add `apps/backoffice/.storybook/main.ts`, `preview.tsx`, preview CSS/providers
   and typed stories under `.storybook/stories/`. Import the actual app CSS, font,
   retained icons and theme/locale providers. Configure SVG transformation and
   Next navigation mocks through the supported adapter. Support the five approved
   locale choices and light/dark preview appearances. Examples are technical
   fixtures, not a final brand, feature schema or product flow.
4. Inventory every retained UI/common/layout component, the icon set and current
   views. Compose real primitives in named stories and interaction states. Map
   compound/headless helpers to their owning compositions/code tests. Explicitly
   classify external media behavior; deterministic capture may stub external
   content but must not claim playback coverage.
5. Add `apps/landing/astro.visual.config.mjs` with preview-only injected routes
   and an Astro-native gallery under `apps/landing/visual/`. Preview the actual
   Foundation document/locales and normal landing entries. Normal Astro builds
   must not include `/__visual` or technical fixture data, and no React/styling
   framework is selected for the landing through this tooling.
6. Add root `visual/` inventory, profile/configuration, candidate/reference helpers,
   Playwright tests and a local review index. Add behavior tests before implementing
   coverage/reference promotion logic: missing/duplicate source coverage, explicit
   case selection, stale/corrupt candidate or renderer mismatch, and preservation
   of accepted reference hashes. Tests use isolated technical fixtures.
7. Expose independent commands for Storybook, Astro visual preview, coverage,
   candidate capture, strict comparison, review/report serving and explicit
   reviewed-run/case promotion. Capture mode must say visual review is pending;
   comparison fails on absent/unapproved references. Disable automatic snapshot
   updating and reject override flags. Never execute real promotion without the
   user's specific reference approval. Keep local artifacts under ignored cache.
8. Verify source coverage and story rendering, capture browser evidence, inspect
   images, and exercise at least input/error, menu/dialog and sidebar behavior.
   Test review-helper failures meaningfully. Run code/type/lint checks, both normal
   builds and catalogue builds/frozen install. Verify normal outputs exclude
   technical routes/fixture content. Open the local previews when the browser
   surface is available; otherwise report the handoff limit accurately.
9. Provide concrete local URLs, report/candidate paths and current coverage counts
   for the user's review. Update README/AGENTS/context and actual verification
   evidence. Keep unapproved images pending, stop owned temporary servers at final
   teardown as required by the local preview workflow, and never commit/deploy.

## Completion boundary

Verify version compatibility and the existing dependency policy first. Prove a
small end-to-end slice using retained controls plus the current empty shell and
landing entry, without inventing product flows or final branding. Confirm that
both user and agent can open the previews, inspect images and read the comparison
report. Then inventory and cover the retained UI catalogue; a successful small
slice is not completion of the all-components/views objective.

No hosted visual-testing service, publication or new hosting decision is needed
for the proposed local workflow. Preview URLs/commands, any remote review access,
artifact storage and final approval mechanics remain to be concretely defined
within the selected implementation. No reference is accepted merely because its
browser capture succeeds. Actual execution and coverage results are recorded below.

## Checked primary sources

- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright UI Mode](https://playwright.dev/docs/test-ui-mode)
- [Playwright HTML reporter](https://playwright.dev/docs/test-reporters#html-reporter)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Storybook Next.js/Vite integration](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)
- [Storybook stories and rendered states](https://storybook.js.org/docs/writing-stories)
- [Storybook framework support](https://storybook.js.org/docs/configure/integration/frameworks)
- [Astro testing with Playwright](https://docs.astro.build/en/guides/testing/)
- [Chrome headless shell and screenshot flags](https://developer.chrome.com/docs/automation-and-testing/headless-chrome-shell)

## Historical discovery verification

Native strict OpenSpec validation passed all four changes. Local-link checking
covered 25 Markdown files and 55 links without missing paths. The Git index is
empty and history contains zero commits. This change only records the priority,
research and proposed workflow at that stage; application checks were not repeated, browser
availability was not tested, and no visual tooling or reference image was created.

## Implementation and verification record

The selected workflow is implemented under `.storybook/`, the Astro visual
configuration/gallery and root `visual/`. The [local guide](../../../visual/README.md)
documents commands, ports, capture conditions, review, comparison and explicit
case promotion. Source coverage maps 216 retained component modules through 50
stories and 21 view entries: 92 registered scenarios across four profiles, or
368 capture cases. Icons and compound primitives render in their actual owning
compositions. This is representative coverage, not every prop combination.

The canonical renderer is Playwright 1.65.0's Chromium 158.0.8127.18, headless on
this arm64 Mac (Darwin 27.0.0), DPR 1, Europe/Madrid, fixed fixture time and original
app font files. Captures require consecutive identical frames; the accordion case
also verifies the completed content switch. An audit of earlier captures exposed
intermediate transition frames and minor GPU edge-pixel variation. In a focused
15-sample experiment, default rendering produced two variants and CPU rendering
produced one. `--disable-gpu` is therefore recorded in the renderer identity and
used by capture/comparison and promotion verification. Initial native comparison
used threshold 0; the subsequently approved setting is 0.01 with maxDiffPixels 0.
Repeatability is assessed locally, not assumed universally.

Initial recorded full runs `2026-11-12T00-01-25.617Z` and
`2026-11-12T00-03-48.142Z` each passed 368 browser/capture cases with zero skips,
retries or failures, using identical source hash
`2b61332c308db8b8e7dc6fa36a629e47a47b782e24ef8d24e41f00b0a6bc2709`.
Their PNG hashes matched for 362 cases. Six images differed only at 5–39 border
pixels, with a maximum RGB-channel difference of one. The native matcher at
threshold 0 / maxDiffPixels 0 flagged two component-card pairs; the other four
byte-different pairs passed its native image handling. Byte identity and native
comparison outcomes are therefore reported separately.

An isolated cache-only comparison report tests those six pairs plus one unchanged
pair under strict and proposed 0.01 colour thresholds: 12 comparisons passed,
and the two strict component-card comparisons failed as expected. All seven
proposed-threshold comparisons passed. The actual harness stayed at threshold 0
until the user explicitly selected 0.01 while retaining maxDiffPixels 0. The
approved setting is now recorded in the harness and guide. Evidence is
under `.cache/visual/repeatability.json` and
`.cache/visual/repeatability-proof/playwright-report/`.

A separate synthetic red/blue surface smoke check proves that matching images
pass, changed images fail and native expected/current/difference report artifacts
are produced. Its isolated reference hash remained unchanged. Its one deliberate
failure is comparison-engine evidence, not a failing product test or an accepted
product reference; artifacts are under `.cache/visual/engine-proof/`.

Eleven helper tests pass, including missing source/story coverage, stale/corrupt
candidate and renderer rejection, explicit selection/approval, unapproved
reference rejection, automatic-update rejection, native-result filtering and
configuration/style/script freshness. The latter regression failed before its
fix and passed afterwards. Existing backoffice tests pass 26 cases. Backoffice,
landing and visual TypeScript checks pass; backoffice lint passes. Both normal
apps, Storybook and the Astro gallery build. Normal landing output contains only
the five language entries; neither production output contains technical gallery
routes or tested story-fixture markers.

Actual browser checks verify named states, all four profiles and the registered
five-language views. Storybook manager checks exercise editable button controls,
theme/language choices and the 390px viewport. Review-page checks exercise image
count, filtering, exact case selection, responsive layout and the archived report
link. Opening/interruption of an unexecuted Playwright UI session preserves the
previous review bytes and avoids the former missing-report exception. The
embedded browser host is unavailable, so no automatic opening in the user's
browser is claimed; local HTTP access and real Chromium operation are verified.

An independent read-only code review identified missing freshness inputs and the
unused-UI exit failure. Both were fixed and re-reviewed without remaining critical
or important findings. Review cards distinguish captured conditions from base
preview links and explain replay; actual app links retain browser preferences.
Only cases that passed the corresponding native report become review candidates.
Each run archives its own HTML/JSON report; old links do not point to newer runs.

Comparison of an unapproved button intentionally failed without creating a
reference. `visual/references.json` remains empty: successful captures and these
engineering repeatability checks do not accept the vendor appearance or branding.
The placeholder Astro documents and substituted external video document have
explicit limitations. No product flow, deployment, staging or commit follows.

The initial dependency install was gated by pnpm's exact-version script review
for `esbuild@0.28.2`. Its supplied native binary transforms TypeScript successfully
with the installer blocked; builds and browser checks also work. The user has now
selected “Keep esbuild@0.28.2 install script blocked (Recommended)”. The exact
denial is recorded alongside the three existing denials, with no script allowance
or release-age exception. The frozen install with strict peer checking now passes;
the lockfile is byte-identical to its state before these two approved settings.
Existing direct specifications and package resolutions are preserved.

Final native strict validation passes all four changes; local-link checks cover
26 Markdown files and 58 local links with no missing paths. The Git index is empty
and history still contains zero commits. Supplied archive size/mtime checks are
unchanged. Temporary preview/UI servers were stopped after verification; the
guide's commands reopen the preserved candidate and comparison reports locally.

## User-approved settings follow-up — 2026-11-12

The user's explicit selections are recorded in the proposal: deny the exact
`esbuild@0.28.2` install script and use colour threshold 0.01 with maxDiffPixels 0.
Both settings are applied; neither choice accepts reference images. Agent guidance,
OpenSpec context/capability scenarios and the local guide reflect the selections.

The frozen install with strict peer checking passes under the unchanged release
waiting period and four exact script denials. The lockfile remains byte-identical
(SHA-256 `e4ee53de7e94f7c1fe50726caa2cddf4b3978792e85d6d265f6f857bdf81541a`).
`visual:prepare` rebuilds both production apps and both catalogues successfully,
with all 216 source modules, 50 stories and 21 views still inventoried. Production
output checks find no technical fixture markers or gallery routes; Astro retains
only the five normal language entries.

Fresh run `2026-11-12T09-13-14.468Z` passed all 368 browser/capture cases without
failures, skips or retries. Source identity is
`f65c7bc51ff1df852f632b91fb9bed925985155d11833da7fb1aea7dfec9c792`.
Eleven helper tests, 26 backoffice tests, all three type checks and backoffice lint
also pass. The current review and archived native report belong to that run.

An isolated audit reads the actual selected comparison settings and passes all
368 previous repeat-capture pairs; its report is under
`.cache/visual/approved-policy-proof/playwright-report/`. The red/blue engineering
fixture still produces one deliberate comparison failure and its expected/current/
difference artifacts, while the matching fixture passes and its reference hash
stays unchanged. These cache-only engineering checks leave the product reference
registry empty. The two pending configuration tasks are complete; branding,
product flows and specific image acceptance remain outside this follow-up.

## Catalogue-language correction — 2026-11-12

During the live walkthrough the user reported that language did not change and
identified “Button, Form or another component example”. Reproduction confirms
that the toolbar and HTML locale change, but most sample text is fixed Spanish;
the actual translated 404 view switches correctly through all five languages.
The corrective scope is the catalogue examples, using the existing next-intl
provider and approved locales. It does not change language URLs, cookie policy,
branding, product validation or native Storybook/browser chrome.

Implementation plan:

1. Add a browser regression that fails on the current English Button label.
   Add separate language-test configuration/output so these checks do not overwrite
   candidate reports or create/approve references. Keep the main screenshot matrix.
2. Add development-only `.storybook/messages/{es,en,ca,gl,eu}.json`, with identical
   keys and ICU arguments. Merge the selected catalogue namespace into the current
   preview provider; retain real application messages. No new dependency is needed.
3. Replace fixture-owned text with reactive next-intl lookups in named story render
   functions. Default Button text localizes; explicit Controls overrides are kept.
   Form validation uses a stable technical error code translated when rendered,
   so visible errors update without resetting values or form state.
4. Localize supplied labels for existing compound controls. If a built-in close
   affordance lacks an override, expose an optional label while preserving its
   existing default. Native browser file-control text remains browser-owned.
5. Verify dictionary completeness and placeholder parity, live locale changes,
   open-dialog state, typed values, custom labels and the English preview catalogue.
   Include JSON dictionaries in source freshness checks and test that invalidation.
6. Rebuild normal apps/catalogues, rerun code checks and browser coverage, inspect
   representative images, and confirm production exclusion. Restart the owned
   walkthrough previews with the fresh source identity and guide the user to refresh.
   Keep all images unapproved and never stage, commit or deploy.

### Correction verification

The browser regression first failed because the English toolbar selection left
the Button labelled “Botón de muestra”. The corrected preview merges a catalogue
namespace into the existing next-intl provider. Each of the five development-only
dictionaries has 145 entries, with matching keys and ICU arguments. All text-bearing
fixtures use reactive translations; code identifiers/initials, Storybook chrome
and native browser text retain their separate roles. Technical translations are
not approved customer-facing copy or claimed native-speaker validation.

The Button's default `label` is unset and resolves from the current dictionary.
An explicit Controls value is used exactly; **Set string** creates that override
and **Reset controls** restores the translated default. Form validation keeps a
stable technical code and translates it when rendered, without keying/remounting
the form on locale changes. Combobox options retain stable IDs. DialogContent and
SheetContent accept an optional `closeLabel`; ComboboxInput accepts `clearLabel`.
Their prior defaults remain available and no next-intl dependency was added to
the UI primitives. Pagination uses its existing text/ARIA overrides.

All 16 helper/dictionary tests, 26 backoffice tests, type checks and lint pass.
Nine dedicated language browser cases pass: labels/errors in all five locales,
live error/value/status preservation, exact custom labels, open-dialog continuity,
and English rendering of all 50 catalogue stories without untranslated Spanish
fixture copy or translation errors. This suite uses a separate report directory
and checks the served source identity, including when reusing a running server.
The independent review's source-identity finding was addressed with the same
header assertion used by the capture suite. The JSON freshness regression failed
before the fingerprint included Storybook dictionaries and passes afterwards.

Both static apps and both catalogues build. Fresh capture run
`2026-11-12T11-30-05.520Z` passes all 368 cases with no skips, retries or failures,
using source hash `9cfbf7bbb34d7ec466524d9c339b9766eb17e68fc23a027eaf7283c14e5675eb`.
The inventory still covers 216 modules, 50 stories and 21 views. English form-error
and Basque-dialog mobile images were inspected. A live selected combobox option
also remained selected and changed its label to Catalan correctly.

Production outputs contain none of the checked catalogue strings/routes. Frozen
installation with strict peers passes, with no dependency or script-policy change;
the lockfile SHA-256 remains
`e4ee53de7e94f7c1fe50726caa2cddf4b3978792e85d6d265f6f857bdf81541a`.
The review/capture reports are refreshed, the product reference registry is empty,
and no staging, commit or deployment occurred. Owned previews are running for the
ongoing user walkthrough; refresh the browser to load the rebuilt examples.

## Initial visual-reference approval — 2026-11-12

The preceding empty-registry results describe the state before user acceptance.
The user has now said “commited, I approve all visual revisions”, after the agent
named current review run `2026-11-12T13-05-47.261Z` and explained case/run approval.
The approved set is all 368 images in that run, covering the four selected
viewport/theme profiles and registered language/interaction cases. Its source
fingerprint is
`d44a5aa085cd8370129102f81ae2ea264acc549cbfcf67cf1dbd728073d1f5f5`.

The existing promotion command selected every case from that exact run, verified
source/rendering environment and image hashes, copied the approved PNGs into
`visual/references/<profile>/` and stored the verbatim user instruction in each
`visual/references.json` entry. This is acceptance of the current technical image
baselines, not final product branding, product copy or future image changes.

Verification and commit-preparation plan:

1. Run the complete normal `pnpm visual:compare` matrix against the accepted
   references. Inspect the actual report and investigate any unexpected pixel or
   browser failure; never update the approved images to make the check pass.
2. Check that all 368 registry entries and PNG hashes match the approved run,
   with the same source/environment/profile identity and approval evidence.
   Run local formatting/code checks and strict native OpenSpec validation.
3. Preserve the user's commit batches: the runnable workspace/tooling batch has
   its initial empty registry staged; approval metadata, reference images and
   this acceptance record remain a subsequent unstaged batch. Verify exact index
   scope and whitespace, provide the user's next commit command and never commit.
4. Record actual comparison/check outcomes and keep this acceptance scoped to
   the named run. Later intentional visual changes need their own review.

### Accepted-reference verification

The normal full comparison run `2026-11-12T13-31-15.275Z` passes all 368 cases,
with zero failures, skips or retries, using the approved 0.01 colour threshold
and maxDiffPixels 0. This is reference comparison, not a new candidate approval.
All 368 registry entries retain the approved run/source/environment/profile
identities and verbatim user instruction. Every PNG hash matches its reviewed
candidate; comparison did not change the references. The accepted PNGs total
5,763,784 bytes.

`pnpm check` passes formatting, lint, type checks and all 42 code tests. Strict
native OpenSpec validation passes all four changes. The user's first documentation
commit is `317a8d7d113233d94578a71f2f31b77bef72d64c`; its 35 files match the
prepared first batch. The next 306 workspace/app/tooling files are staged and
pass the index whitespace check, including an initial empty reference registry.
The approved working registry, 368 PNGs and six acceptance/status documents remain
unstaged for the next batch. Only the user creates commits.

Ignored evidence: `.cache/initial-approved-reference-compare.log`,
`.cache/initial-approved-reference-check.log`,
`.cache/initial-approved-reference-integrity.json` and the comparison run's native
Playwright report. The ignored `.cache/commit-preparation.json` tracks the staged
batch and the subsequent reference batch for the user's commit handoffs.
