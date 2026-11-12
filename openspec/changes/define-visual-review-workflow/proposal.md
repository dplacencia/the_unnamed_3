# Define the collaborative visual review workflow

## Why

The user now prefers defining how design and visual testing will work, asking
what Playwright can do and for a way that both the user and agent can visually
test every component and view. This advances workflow definition ahead of the
remaining repository-stack questions and earlier branding order.

## What Changes

- Research a shared live-preview, interaction and visual-comparison workflow.
- Explain complementary component-catalogue and real-browser testing roles.
- Propose explicit coverage, repeatable screenshot conditions and human review
  of reference images and intentional visual changes.
- Keep tool selection, exact configuration and acceptance distinct from research.

## Capabilities

### New Capabilities

- `visual-review`: Storybook backoffice catalogue, Astro-native previews,
  Playwright browser capture/comparison, coverage inventory and reviewed references.

### Modified Capabilities

None. Existing approved application/toolchain/state/form decisions are preserved.

## Impact

The user selected the recommended workflow. Implementation adds development-only
Storybook configuration/stories, Astro preview configuration/gallery, a root
Playwright harness and coverage/review tooling, plus exact development dependencies.
Candidate captures are local artifacts; no accepted baseline, product-flow design,
brand identity, deployment or commit is inferred. Production app outputs retain
their existing scope and must exclude catalogue routes and technical fixtures.

## Authority and status

The user answered “go with your recommendation” to the Storybook + Playwright
workflow, including Astro-native previews and the explained review cycle. This
selects the workflow and authorizes its bounded implementation under the existing
define-and-implement assignment. They subsequently selected pinned Chromium on
this Mac as the initial screenshot reference environment and responsive coverage
at desktop 1440×900, tablet 768×1024 and mobile 390×844, plus desktop dark mode,
five-language assembled views and relevant interaction states. Candidate images still require user review
before becoming accepted visual references.
The user subsequently selected “Keep esbuild@0.28.2 install script blocked
(Recommended)” and “Use colour threshold 0.01; maxDiffPixels 0 (Recommended)”.
These settings are approved independently of image acceptance; the reference
registry remains empty until specific images receive user approval.
The feature-folder layout was subsequently selected in the technical foundation;
that change owns the approved source-organization policy.
Hosting/CDN questions and external integrations remain outside the active scope.

Walkthrough correction: the user reported that language did not change in
“Button, Form or another component example”. The locale provider worked, but
fixture text was hardcoded Spanish. The correction localizes catalogue-owned
copy in the existing five languages, preserving input, overrides and component
state. These development-only translations do not establish product wording.

### Initial reference approval — 2026-11-12

After the agent identified candidate run `2026-11-12T13-05-47.261Z` and explained
reference approval, the user said “commited, I approve all visual revisions”.
This approves all 368 images in that reviewed run as visual comparison references.
Their source fingerprint is
`d44a5aa085cd8370129102f81ae2ea264acc549cbfcf67cf1dbd728073d1f5f5`.
The promotion command verified the current source, renderer and each image hash
and registered the images with the user's verbatim approval. This does not select
final product branding or approve future changed images. Full reference comparison
and commit preparation follow under the user's current assignment; only the user
creates commits.
