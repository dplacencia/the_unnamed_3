# Brand-basics discovery

## Source and current authority

On 2026-11-12, after the user had committed the three repository-foundation
batches, the agent recommended defining brand basics before customizing TailAdmin.
The user replied “go ahead”. This starts brand discovery. Undefined choices still
require the user's answer under the existing specification workflow.

The current implementation and 368 accepted reference images are a comparison
baseline. Their approval does not make TailAdmin's vendor branding the final
product identity. Irin remains the leading naming candidate, not a finalized name.

## Inherited brief — already approved

Read the initial change's [values](../establish-frontend-foundation/specs/product-values/spec.md),
[scope](../establish-frontend-foundation/specs/frontend-scope/spec.md) and
[source instructions](../establish-frontend-foundation/design.md).

- Simplicity and familiarity alongside power, adaptability and configuration depth.
- Exact values and honest status, with stable and dependable behavior.
- Independently useful modules and growth at the customer's chosen pace.
- Support through modernization, with human assistance on merchant request.
- Customer autonomy and explicit consent; traceability and accountability.
- A warm, approachable, quietly confident personality with precise, straightforward
  language, serving merchant teams in Spain across the five selected languages.

Users range from people who can barely open an app to highly skilled technical
users. Simplicity is the default; users choose when to expose complexity. AWS
Console is the user's expert-interface reference, without selecting its colours,
branding, navigation or beginner experience. Naturgy/Lowi are personal negative
trust references; specific disliked visual traits have not been supplied.

Brand positioning and slogans are secular. The name's supported cultural origin
may be explained accurately when relevant. This does not prescribe religious,
iron, industrial, agricultural or local-market imagery for a visual identity.

## Observed implementation — not adopted brand choices

The retained [backoffice stylesheet](../../../apps/backoffice/src/app/globals.css)
has TailAdmin's `@theme` tokens, blue brand scale and Outfit font. The Astro
landing has its own minimal Tailwind stylesheet and no chosen identity. These
observations are source facts, not user selection of colours or typography.

## Proposed discussion order

1. Choose the visual emphasis to develop, using the first question below.
2. Compare concrete colour and typography options against the same components
   and content, so a change in layout does not obscure the identity comparison.
3. Resolve the minimum wordmark/logo treatment and basic shape/decoration choices
   needed for initial configuration. Preserve provisional naming unless changed
   explicitly; do not require a complete brand manual before basic configuration.
4. Record selected tokens, usage rules and scope in native specs and an exact
   implementation plan before applying them to TailAdmin. Decide any separate
   landing treatment from an approved basis rather than importing the dashboard.
5. Review resulting light/dark, responsive and language cases in the existing
   workflow. Keep accepted references until the user approves changed images.

This is a proposed discussion sequence, not approval of its unresolved outcomes
or a new product-flow assignment.

## Selected visual emphasis

Asked: which direction should be developed into concrete colour and typography
options for Irin as the working name?

| Proposal                                  | Visual emphasis                                                                       | Trade-off to assess                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Restrained and approachable — recommended | Warm neutral backgrounds, clear typography, strong contrast and limited accent colour | Needs a distinctive accent/type treatment to establish its own identity |
| More technical and geometric              | More geometric forms and a precise, instrumental presentation                         | Must retain the approved warmth and beginner approachability            |
| Softer and more expressive                | Softer forms and more expressive use of colour                                        | Must retain clear hierarchy and precise status/action communication     |

The recommendation is the agent's design judgment about expressing the approved
personality, not a measured claim that a style or colour causes trust. No specific
colour, font, radius, density, imagery or logo is chosen by these descriptions.
The user answered “Restrained and approachable (Recommended)”. This selects
the first direction; exact colours, fonts, geometry, density and identity remain
unselected. BRAND-001 preserves the answer and proposal boundaries.

## Concrete comparison plan

The user was told this choice would be developed into colour and typography
comparisons using real TailAdmin components. Prepare three accent proposals on
the same warm neutral base: deep teal, mineral blue and copper. Recommend teal
for exploration as the agent's design judgment, not a claim about measured trust.
Compare Source Sans 3, Inter and the retained Outfit separately, with one font
selector affecting every palette sample. No combination is adopted by default.

Primary font sources: [Adobe Source Sans](https://github.com/adobe-fonts/source-sans),
[Inter](https://github.com/rsms/inter) and the
[Google Fonts repository](https://github.com/google/fonts). Bundle only the two
upright variable-font files and their SIL Open Font License notices, pinned to
Google Fonts revision `c30b221beb0c1da59d563feb91ec8656a1fa972a`. Keep their original
bytes and record URLs/SHA-256 identities alongside the development assets. Outfit
continues to use the existing local preview font. No font package, browser CDN
request or production font change is needed.

Implementation plan, using the existing workspace and OpenSpec rather than
commits or a parallel planning system:

1. Record the selected direction, BRAND-001 and this plan before source edits.
   Update root/context/app guidance to distinguish selected direction from the
   unresolved palette/font/name choices.
2. Extend the existing `visual/runtime.test.ts` freshness behavior check with a
   binary `.storybook/assets/fonts/` input. Observe failure before extending
   `sourceFingerprint` to hash those actual asset bytes in `visual/runtime.ts`.
   This prevents stale proposals after a bundled font changes without altering
   the existing accepted renderer's Outfit manifest.
3. Add `.storybook/assets/fonts/` with the two original TTFs, license notices and
   source/hash manifest. Create `.storybook/stories/brand-basics.stories.tsx` and
   scoped `brand-basics.css`. Compose actual Card, Field, Input, Button and Badge
   primitives. Keep the same layout, content, shapes and neutral tokens across
   the three palettes. Scoped custom properties and font inheritance must not
   change other stories, app views or runtime source.
4. Localize comparison labels in all five existing catalogue dictionaries.
   Keep font identifiers and exact specimen values stable. Use controlled native
   radio controls for the preview font; changing font or locale must retain typed
   input. Clearly label everything as proposals and Irin as a working name.
5. Register the story and three font scenarios in `visual/inventory.json`, with
   the corresponding font-selection actions in `visual/tests/catalogue.spec.ts`.
   Extend language-browser checks for the proposal labels, actual loaded fonts,
   typed-value preservation and applied foreground/background contrast. Do not
   add unit tests that merely repeat the fixture's layout or constants.
6. Verify `pnpm check`, source/license hashes, local font requests and production
   exclusion. Run `visual:prepare` to refresh normal apps and catalogue outputs,
   then language/browser checks. Compare the 368 existing accepted cases with the
   new proposal entry excluded; capture the 12 proposal/font/profile cases as
   unapproved candidates. Inspect actual images and responsive overflow, and
   obtain an independent scoped review before handing off the live comparison.
7. Record results, provide the interactive preview and ask one concrete choice
   at a time, starting with accent colour. Preserve all 368 existing references;
   do not auto-promote proposal images, stage changes or commit.

## Technical research for later evaluation

- [TailAdmin customization](https://tailadmin.com/docs/customizations) documents
  CSS-first `@theme` tokens for its Tailwind 4 foundation. Its
  [colour guide](https://tailadmin.com/docs/customizations/color) describes the
  vendor palette. These are implementation mechanisms, not identity approval.
- [W3C text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  explains 4.5:1 for ordinary text and 3:1 for qualifying large text, with its
  stated exceptions. Palette proposals should be evaluated using actual colour
  pairs; apparent readability alone is not a contrast test.
- [W3C use-of-colour guidance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
  explains why colour alone cannot carry meaning. This supports evaluating
  explicit text/icon status cues alongside any brand accent.

These sources inform proposed evaluation. They neither certify an interface nor
select an accessibility-conformance target, palette or status design on the
user's behalf.

## Initial discovery checks

Native strict OpenSpec validation passes all five changes. The four relevant
Markdown files have 18 local links with no missing paths. Agent/context pointers
now identify this discovery assignment. Only documentation changed; runtime
source, approved references and the Git index remain unchanged. No application
build or browser run is needed for this documentation-only subset.

## Comparison implementation and verification — 2026-11-12

The real-component comparison is available in Storybook at
`/?path=/story/brand-explorations--basics`. It shows A/deep teal (`#1D7567`),
B/mineral blue (`#355E83`) and C/copper (`#965637`) on the same warm neutral base.
The font selector applies Source Sans 3, Inter or the retained Outfit to all three
samples. Source Sans 3 is the preview's recommended starting option, not an adopted
typeface. Colours and fonts remain separate pending choices. The first colour
question asks which proposal should form the basis for Irin's palette; A is the
agent recommendation at that stage. No palette was selected; the user's later
feedback requests further options, recorded below.

The page uses retained Card/Field/Input/Button/Badge primitives, unchanged shapes
and exact sample text. Its CSS/custom properties and fonts are scoped to the
development preview. Both upright font binaries and license notices retain their
recorded hashes; their binaries total 1,522,916 bytes. A font-cmap check found all
80 distinct non-whitespace characters used in the five current dictionaries and
glyph specimen in both proposal fonts. This checks those samples, not arbitrary
future content. The browser loads the fonts locally and verifies the selected
font is applied to actual sample inputs.

The existing freshness test failed when a new binary catalogue font was ignored,
then passed after the asset directory entered the fingerprint. All 42 code tests
(26 app, 16 visual-tooling units), formatting, lint and type checks pass. All 12
language/browser cases pass, covering the new labels in every locale, typed exact
values and font choice across locale changes, local font loading, mobile overflow
and primary-button foreground/background contrast of at least 4.5:1 in light and
dark modes. Twenty-five new keys bring each catalogue dictionary to 170 entries;
key/ICU parity remains checked. These fixtures do not define final product copy
or establish complete interface accessibility conformance.

Both production apps and both catalogues build. Coverage is 216 retained source
modules, 51 stories, 21 view entries and 95 scenarios (380 profile cases). The
368 existing accepted references pass the filtered comparison run
`2026-11-12T14-46-08.916Z`; all stored reference images and metadata remain
unchanged. The 12 new font/profile cases pass candidate capture run
`2026-11-12T14-47-44.972Z`, with source fingerprint
`4c8f15047d5d92f59b36b185fc85d5ac1c0ee7af22d57184244d18624def51fb`.
These filtered runs do not claim 380 accepted references; proposal images remain
unapproved. Desktop Source Sans 3, mobile Source Sans 3 and desktop-dark Inter
captures were visually inspected. Independent scoped review found no critical or
important issues.

Normal production outputs contain none of the checked proposal/font markers.
No production source/assets, manifest/lock, accepted reference, staging or commit
was changed. Root/app guidance and the visual guide describe the comparison and
filtered checks. Evidence is under ignored `.cache/brand-basics/`, including
`freshness-{red,green}.log`, `check.log`, `prepare.log`, `languages.log`,
`existing-reference-compare.log`, `capture.log` and `glyph-proof.json`, plus the
native Playwright run reports. The live comparison remains open for the user's
palette and typography decisions.

## Further accent options after user feedback

The user said: “Give me other options, Deep teal looks very good but I worked
in Aptimyz in the past and its color were similar”. This preserves the positive
reaction to teal while requesting alternatives that move away from that personal
association. It is the user's recollection, not a verified statement about
Aptimyz's current branding. No palette has been selected, and no permanent ban
on a colour family is inferred.

Extend the existing comparison with three proposals: D/ink indigo (`#57528C`),
E/plum (`#80516B`) and F/graphite (`#4E5B62`). Recommend exploring D as a restrained
alternative outside teal; E provides a warmer accent and F a quieter neutral
option. These are design judgments, not empirical colour-psychology claims.
Place D–F first and label them as new; retain A–C below for comparison. Keep the
neutral base, typography choices, geometry and sample content unchanged.

Plan: add the three scoped scales and five-language names/new-option label;
update comparison copy and existing browser checks from three to six samples.
Rebuild the catalogues through the normal preparation command, check code and
language/contrast/viewport behavior, compare the 368 existing accepted cases and
capture/inspect the same 12 proposal/font/profile cases. No production branding,
font asset, dependency, accepted reference, staging or commit changes follow.

### Further-option verification

D–F now appear first with localized new-option labels; A–C retain their original
scales below. All five dictionaries have 174 matching keys. `pnpm check` passes
all formatting/lint/type checks and 42 code tests. The 12 language/browser cases
pass with six sample fields and six primary-button contrast pairs per theme,
including local fonts, exact input preservation and responsive bounds.

Both apps/catalogues build. Filtered comparison run
`2026-11-12T15-43-36.523Z` passes all 368 existing accepted cases. Proposal capture
run `2026-11-12T15-45-35.673Z` passes all 12 font/profile cases for source hash
`850c8a48baf21ef3a0787a3b8ad800edbff48da282147c11d5f1287c110d7905`.
Desktop Source Sans 3, mobile Inter and desktop-dark Outfit images were inspected.
The expanded page remains a proposal; none of its images was promoted. Production
source/output boundaries, dependencies and accepted references remain unchanged,
and the index is empty. Evidence is in `.cache/brand-basics/round2-*.log` and the
native run reports.

The new question asks which of D/ink indigo (recommended), E/plum and F/graphite
feels closer, while retaining the previous colours for comparison. Colour and
typography remain separate pending choices.

## Selected colour basis — 2026-11-12

The user answered “D — Ink indigo (Recommended)” to the further-options question.
This selects D/ink indigo, `#57528C`, as the basis for the brand palette within
the approved restrained/approachable direction. BRAND-002 records this selection.
The other five palettes remain comparison history. The chosen accent does not
finalize a typeface, logo, wordmark, product name or every derived token/state.

Next, compare Source Sans 3, Inter and Outfit against option D using the existing
font selector. Recommend Source Sans 3 for the calm, approachable character it
has in these samples; Inter offers a more neutral alternative and Outfit retains
the template's geometric character. These are design judgments, not measured
readability rankings. The new font question is pending; the preview default is
not font approval.

This decision needs only specification/guidance updates now. The live comparison
already contains D and all three font options. No production source, preview
source, font asset or accepted reference changes are required to record it.
Check native OpenSpec, documentation links and formatting; do not repeat app
builds/captures for this documentation-only subset or stage/commit changes.

## Selected typeface basis — 2026-11-12

The font question recommended Source Sans 3 alongside option D, with Inter and
Outfit as alternatives. Before choosing, the user asked: “is Source Sans 3
opensource and commercially usable?” The agent explained its SIL Open Font
License 1.1, commercial use and self-hosting, the ability to keep application
code proprietary, and preservation of copyright/licence notices when distributing
the font files. The user then replied: “ok, I choose it”. This explicitly selects
Source Sans 3 as the brand typeface basis, recorded in BRAND-003; selection is
not inferred from its previous preview-default status.

The licence explanation used [Adobe's licence](https://github.com/adobe-fonts/source-sans/blob/release/LICENSE.md)
and the [official OFL usage guidance](https://openfontlicense.org/how-to-use-ofl-fonts/).
The pinned comparison font and original licence notice are already retained with
their source/hash manifest in `.storybook/assets/fonts/`. Their development-only
packaging does not implement font distribution for either production app.

Ink indigo and Source Sans 3 are now selected bases. Weights, sizes, detailed
typography roles, final token states and production packaging belong to the
configuration plan. The minimum identity treatment remains open, and Irin remains
the working naming candidate. No production styling or accepted reference changes
follow from recording this choice; only specification and guidance updates are
needed. Verify native OpenSpec, documentation links and formatting, leaving the
Git index unchanged.

### Next identity question — proposal only

Recommend starting with a simple text wordmark using “Irin” in Source Sans 3,
while retaining the name's provisional status. This provides a concrete identity
basis for initial configuration without requiring a bespoke symbol now. The
alternative is to explore a wordmark plus a separate symbol before configuration;
that provides an additional compact identity asset but needs its own design and
review. Ask the user which scope to take. Neither approach, its exact lettering,
nor any symbol is adopted by this recommendation.

## Selected initial wordmark — 2026-11-12

Asked whether to start with a simple “Irin” text wordmark in Source Sans 3,
keeping the name provisional and leaving a bespoke symbol for later, or explore
a wordmark plus symbol now, the user answered: “Simple text wordmark for now
(Recommended)”. BRAND-004 records this initial treatment. This does not finalize
the product name, select exact lettering weight/size/placement, or approve
component geometry or screenshot references.

Record this decision in the native spec, proposal, tasks and agent/context
pointers. Verify strict OpenSpec validation, local documentation targets and
formatting. No preview or production source, font asset, accepted reference or
Git index changes are needed for this decision record.

### Next component-treatment question — proposal only

The retained [Button](../../../apps/backoffice/src/components/ui/button.tsx)
already defines its corner shapes and sizes, while
[Card](../../../apps/backoffice/src/components/ui/card.tsx) defines rounded
corners and responsive padding. Recommend retaining TailAdmin's existing spacing,
corner shapes and icons for the first brand configuration. The alternative is
to explore custom shapes and spacing before that configuration. Retaining the
existing treatment keeps the first pass focused on the selected colour/typeface
and text wordmark; custom treatment allows more differentiation but needs a
separate comparison. Ask which scope the user prefers before adopting it.

The warm-neutral direction is already selected, but the complete light/dark
token mapping, type scale and exact wordmark styling still belong in a concrete
configuration proposal. The existing palette comparison provides candidate
values for that proposal, not automatic approval of every token. Product-flow
design remains later work.

## Selected component treatment — 2026-11-12

Asked whether to retain TailAdmin's existing spacing, rounded corners and icons
while applying the selected branding, or explore custom shapes and spacing first,
the user answered: “Retain TailAdmin’s component treatment (Recommended)”.
BRAND-005 records that choice. The visual direction, accent basis, typeface,
simple wordmark scope and component treatment are now selected. The exact full
palette and wordmark styling below remain a concrete proposal, not decisions
inferred from those bases.

## First backoffice configuration — proposal

**Goal:** configure the current backoffice with the selected brand basics, then
review the real components and current views before accepting new references.

**Architecture:** use the existing TailAdmin theme tokens and primitives, replace
the global font through Next's existing font tooling, and render the simple text
wordmark in the existing sidebar header. Keep the two applications independent;
this first pass targets the backoffice, while landing styling remains later work.

**Tech stack:** the approved Next.js/React/TypeScript/Tailwind foundation,
Storybook and pinned local Playwright. No dependency or infrastructure change.

**Status:** the user answered “Use this configuration (Recommended)” to the full
option-D/warm-neutral mapping, retained UI text sizes/weights and semibold Irin
wordmark at 32px expanded / 20px compact. This approves the first backoffice
configuration below, recorded in BRAND-006. Execute the agreed scope without
another general permission question. Screenshot acceptance is still separate.

### Exact appearance proposed for the first pass

Use the full option-D accent scale and the warm-neutral base already visible in
the existing comparison. Retain the current components' light/dark token roles;
the table proposes replacement values, not new layout or automatic status rules.
The accent is for brand/action cues. Existing success/warning/error semantics
remain unchanged by this colour proposal.

| Token suffix | Indigo accent | Warm neutral (`gray`) |
| ------------ | ------------- | --------------------- |
| 50           | `#F5F3FA`     | `#F6F4EF`             |
| 100          | `#EAE6F3`     | `#EBE8E0`             |
| 200          | `#D4CDEA`     | `#D8D6CE`             |
| 300          | `#B4ACD7`     | `#BCBEB4`             |
| 400          | `#8D83BB`     | `#9BA694`             |
| 500          | `#57528C`     | `#626C61`             |
| 600          | `#464174`     | `#4C584E`             |
| 700          | `#39365F`     | `#354137`             |
| 800          | `#302E4F`     | `#27332B`             |
| 900          | `#292842`     | `#1D2821`             |
| 950          | `#19182B`     | `#141C17`             |

Propose `--color-white: #FFFEFB` as in the comparison. Retain the current black
token and non-brand semantic scales. The existing focus-shadow accent becomes
`rgba(87, 82, 140, 0.12)`; audit literal vendor-blue action decorations and map
those to the corresponding brand token instead of recolouring semantic statuses.
Any pair that fails the agreed readability checks must be reported and refined
as a visible proposal, rather than silently changing the selected base accent.

Use Source Sans 3 throughout the backoffice while retaining existing UI font
sizes, weights and line heights for this first pass. This makes any later density
or typography refinement an observable separate change. The upright variable
font already selected for the comparison supports weights 200–900; verify all
actual used weights and all five current-language strings rather than assuming
arbitrary future content is covered.

Propose the sidebar text “Irin” at weight 600, tracking `-0.04em`, neutral
`gray-900` in light mode and the warm white in dark mode. Use 32px/40px size/line
height when expanded, and the full word at 20px/32px when compact. These retain
the current logo slots' 40px/32px heights; compact mode does not invent an icon
or use an unexplained single-letter symbol. Verify the actual text fits the
existing sidebar bounds at every registered viewport. Keep the current home-link
destination and give the text link its visible accessible name.

### Implementation and verification plan

Use `superpowers:executing-plans` for the subsequent agreed implementation.
Keep its plan and checklist in these native OpenSpec artifacts; no worktree,
staging or commit step is introduced by this plan.

1. **Package and apply the chosen font.** Add
   `apps/backoffice/src/assets/fonts/source-sans-3.ttf` with the exact selected
   binary and `apps/backoffice/public/licenses/source-sans-3-OFL.txt` with the
   original notice. Verify both against the existing comparison manifest hashes.
   In `apps/backoffice/src/app/layout.tsx`, use `next/font/local` for this file,
   normal style, weight range `200 900`, `display: swap` and a named CSS variable.
   The installed Next guide confirms local paths resolve from the calling file;
   read its current API reference before edits. Serve the built font locally;
   do not add a browser font CDN, package or newly downloaded font version.
2. **Apply only the agreed theme mapping.** In
   `apps/backoffice/src/app/globals.css`, map the agreed brand/neutral values and
   introduce a neutral font token for Source Sans 3. Update the explicit
   `font-outfit` uses in that stylesheet,
   `apps/backoffice/src/components/ui/tooltip.tsx` and
   `apps/backoffice/src/components/ui/tabs.tsx` to the chosen font token. Audit
   literal accent colours without rewriting semantic states or geometry. Preserve
   spacing, breakpoints, corner shapes, icons, UI text metrics and behavior.
3. **Apply the agreed text identity.** In
   `apps/backoffice/src/layout/app-layout/sidebar/sidebar-header.tsx`, replace
   vendor images with the proposed expanded/compact text treatment and remove
   the now-unused image import. Replace the visible vendor footer name in
   `apps/backoffice/src/app/not-found.tsx` with “Irin”. Preserve routes, translated
   messages and existing page structure. No bespoke favicon, symbol, product
   feature or new page is designed in this pass.
4. **Keep previews tied to real production font bytes.** The current
   `visual/prepare-fonts.mjs` hard-codes Outfit. Adapt it to extract the actual
   Source Sans 3 emitted faces and normalize the preview family name, failing
   clearly when no valid built face exists. Retain its output-path safety checks.
   Add focused extraction checks using representative local-font CSS/path inputs
   before changing parsing behavior; do not add tests that only repeat palette
   constants. Update `.storybook/preview.css`, the exploration font fallback and
   `visual/README.md` so Storybook matches the new application font. If retaining
   Outfit as the historical comparison, preserve its two current original files
   from `.cache/visual/fonts/` as explicitly recorded development assets, verify
   their existing manifest hashes and obtain their matching licence notice before
   redistribution. Do not make future builds depend on an old ignored cache.
5. **Update real browser coverage.** In
   `visual/tests/catalogue-languages.spec.ts`, verify the actual app and Storybook
   font, local requests, expanded/compact wordmark fit, light/dark behaviour and
   the five-language views. Check primary action, normal text, focus/invalid and
   disabled states in context; preserve entered exact strings and existing shell
   interactions. Retain current screenshot profiles, threshold 0.01 and zero
   differing pixels. Update `visual/inventory.json` only for actual changed/new
   coverage, not speculative components or empty feature folders.
6. **Run quality and rebuild evidence.** With the pinned repository toolchain,
   run `pnpm check`, `pnpm visual:prepare` and `pnpm visual:test-languages`. Inspect
   the static outputs for local font/notice delivery and absence of the replaced
   customer-facing vendor identity. Confirm normal landing outputs/source remain
   unchanged. Stop/restart only the owned preview sessions so source identities
   match; do not bypass the stale-build or occupied-port guards.
7. **Capture and review the new font environment.** Run `pnpm visual:capture`
   for every registered case (currently 380). Changing the actual app-font manifest
   changes the recorded renderer identity: existing reference comparison must
   refuse that mismatch. Preserve the guard and all 368 accepted reference PNGs
   and metadata. Review new candidates alongside those immutable prior images;
   do not claim the old comparison passed in the new font environment. Inspect
   the actual shell, collapsed/mobile sidebar, 404 and primitive states across
   themes/viewports/languages, then obtain scoped review and report the run IDs.
8. **Hand off the concrete result.** Provide the live catalogue/backoffice and
   the exact candidate run for user image review. Promote only named cases with
   actual user approval through the existing `visual:approve` command. No staging,
   commit, landing-page design, API, hosting or product-flow work follows from
   preparing or validating this plan.

The next question bundles only the remaining appearance details: use this full
option-D/warm-neutral mapping, retain current UI text metrics and use the proposed
expanded/compact wordmark styles for the first backoffice pass, or refine those
details first. It does not reopen the selected accent, typeface, wordmark scope
or TailAdmin component treatment.

### Configuration approval and execution — 2026-11-12

The user selected “Use this configuration (Recommended)”. This authorizes the
first backoffice pass in this section and its verification, while preserving the
provisional name, retained component geometry, independent unchanged landing,
no commits and separate screenshot acceptance.

Before implementation, inspection found that the freshness glob also needs to
include the new production font binary in `src/assets/fonts/`; extend the existing
binary-input freshness test before that change. Font extraction will be checked
through its real CLI with synthetic built CSS/assets, including root-relative and
relative emitted URLs, ignored fallback faces, missing-font failure and output
path containment. These are in-scope tooling corrections needed by local fonts,
not changes to the approved renderer/approval policy.

The 404 illustrations contain 23 literal vendor-accent fills each. Map the light
asset's old `#465FFF` to selected `brand-500` (`#57528C`) and the dark asset's
`#7592FF` to selected `brand-400` (`#8D83BB`), retaining all SVG geometry. This
completes the approved palette mapping without introducing new artwork or icons.

### Dark-text refinement — proposal pending user decision

The scoped independent review identified a contrast shortfall from the new
palette in existing dark-mode text roles. Settled browser measurements confirm
the ordinary Button link in `brand-400` (`#8D83BB`) over `gray-900` at 4.425:1,
and the light primary Badge's tinted surface at 4.016:1. Both fall below the
4.5:1 ordinary-text check. Filled primary buttons and solid primary badges remain
at 6.962:1. CSS transitions are disabled for the measurement so it uses final
colours rather than intermediate animation frames.

Propose using the already selected lighter `brand-300` (`#B4ACD7`) for ordinary
dark-mode brand text: links, primary light/ghost badges, active line-tab labels,
and corresponding menu/document text and hovered field-description links. Retain
the base accent, token values, component geometry, icons, disabled states,
backgrounds and non-brand semantic states. The measured link becomes 7.130:1,
and the light primary badge 6.471:1. This changes text-token usage, not the
selected palette, and is a proposal until the user answers.

Temporary browser-only before/after samples and measurements are served at
`http://localhost:9324/brand-contrast/`; source remains at the approved initial
configuration. The original scripts, PNGs and JSON evidence are in ignored
`.cache/brand-configuration/`. Extend real-control contrast coverage when the
user selects the refinement, then rebuild and capture the full matrix for review.
The existing font/sidebar/language browser suite passes all 25 checks under the
approved configuration; those results do not imply the contrast issue is solved
or that screenshot references have been approved.

### Initial configuration verification — 2026-11-12

The approved initial configuration is applied to the actual backoffice and its
component previews. Pinned Source Sans 3 and its original public notice match
their recorded SHA-256 identities; the browser verifies those served bytes, a
loaded actual font and local-only font requests. The two original Outfit faces
and matching OFL notice are retained only as historical development comparison
assets, with source/hash records. The current app uses named weights 400–700,
within the font's 200–900 range; the current dictionary glyph check has no missing
characters. This does not promise arbitrary future glyph coverage.

The new extraction CLI/freshness checks failed as expected before implementation,
then passed. `pnpm check` passes formatting, lint, both apps' types, and all
46 code tests (26 backoffice, 20 tooling). The expanded language/browser suite
passes all 25 checks, including five languages in both themes, real font/notice
bytes, the actual app's expanded/compact/mobile sidebar and localized 404, plus
the existing dictionary/input/state regressions and preview fonts.

The initial `pnpm visual:prepare` wrapper failed because Turbopack's CSS worker
could not bind a local port, including on the first escalated wrapper retry.
A minimal permitted bind check succeeded, as did invoking the same pinned
Next/Turbopack compiler directly. Running the existing preparation file directly
with pinned Node (`node visual/prepare.mjs`) then passed the complete unchanged
build sequence: both normal apps, actual-font extraction, Storybook, native Astro
gallery, fingerprint and coverage. No bundler, package script or dependency was
changed as a workaround. Evidence is in `prepare.log`, `direct-next-build.log`
and `prepare-direct.log` under `.cache/brand-configuration/`.

Initial full candidate run `2026-11-12T17-27-12.710Z` passes all 380 cases with
zero failures/skips/retries. Its source identity is
`9f939e5e90097ea47126015f06d0c818f077323db9e2174486f6f3c25b2e52f0`.
The actual production-font manifest now contains the selected Source Sans 3
binary rather than Outfit. A direct integrity check confirms that the existing
accepted reference is correctly rejected for this changed font environment;
no comparison success against old references is claimed. All 368 accepted PNGs
and the registry retain their original hashes, as do the 13 landing source/config
files recorded before this pass. HEAD and the empty Git index are unchanged.

Expanded and compact desktop shell captures, the mobile drawer and Basque mobile
404 were visually inspected. The actual dark-link/primary-badge proof images
were inspected separately with the proposed text-only refinement. Scoped review
found that contrast issue and no other critical/important findings. This initial
capture is available at `http://localhost:9324/`; it still contains the current
contrast shortfall, while `http://localhost:9324/brand-contrast/` shows the
browser-only proposed correction. The live app/catalogue are at ports 3100/6006.
Nothing is promoted. Final text refinement, its verification and image approval
remain pending; the current capture is a reviewable first pass, not final design
acceptance or an implemented product flow.

### Approved dark-text refinement — 2026-11-12

The user answered “Use the lighter shade for dark text (Recommended)” to using
existing `#B4ACD7` for ordinary indigo text in dark mode: links, primary light/ghost
badges, active tabs and corresponding menu text. BRAND-007 records the decision.
This authorizes the measured text-role adjustment, not a change to palette
values, primary accent, backgrounds, shapes or screenshot acceptance.

Plan: first add a focused development example composed of the affected actual
Button, Badge, line Tabs, Accordion link, FieldDescription link and menu/document
utilities, reusing current catalogue translations. Register its normal and
second-tab states. Add real browser contrast checks that composite transparent
backgrounds, disable transitions, check normal/hover states and select the second
tab. Capture the expected initial contrast failures before changing source roles.
Then change only ordinary dark text from `brand-400` to `brand-300` in those
controls/utilities, preserving icon-specific rules, active borders and disabled
styles. Rebuild using the unchanged preparation script invoked directly with
pinned Node, rerun code/browser checks and capture the complete updated matrix.
Inspect affected images and obtain a scoped follow-up review before handing off
the exact run for image approval.

### Refined configuration verification — 2026-11-12

The approved dark-text roles are applied without changing palette definitions,
backgrounds, component geometry or icon-specific/border/disabled rules. Follow-up
review identified two further ordinary text utilities within the already approved
menu/document scope: the pro menu badges and the document item with a border.
They are included in the focused example and use the same approved lighter text
role, preserving their backgrounds and borders. No extra product choice was
inferred from the review.

The focused browser check first passed light mode and failed dark mode at the
original link's 4.425:1. The expanded menu check then failed at the original pro
badge's 1.908:1 before its adjustment. These expected failures are in
`contrast-red.log` and `contrast-menu-red.log`. The completed browser checks
compose transparent ancestor backgrounds and pass for all 14 ordinary text
samples in light/dark modes, including hovered field/accordion links, hovered
menu badge groups and second-tab selection. They also verify unchanged explicit
icon, active tab border, disabled text and document border colours.

`pnpm check` passes formatting, lint, types and all 46 code tests. The complete
browser suite passes all 27 checks. The unchanged preparation sequence, invoked
directly with pinned Node as above, passes both app builds, both catalogues,
actual-font extraction, freshness and inventory checks. One automatic execution
permission review timed out before starting a rebuild; its explicitly permitted
single retry succeeded. No dependency, bundler or script policy was changed.

The added `Brand Text Roles` composition uses the actual retained controls and
existing translations. Its normal/second-tab scenarios bring coverage to 216
source modules, 52 stories, 21 view entries and 97 scenarios across four profiles.
Final candidate run **`2026-11-12T17-47-13.318Z`** passes all **388** cases with
zero failures, skips or retries. Its source hash is
`f3a81133d8061102614693778bc174e9e22b264a069b2a96a8a28e3cb729590e`;
the actual-font environment remains
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
This supersedes the initial 380-case capture for review, not the accepted
reference registry.

Light desktop, light mobile, dark default/second-tab text-role images and the
ordinary dark Button image were inspected. Scoped follow-up review confirms both
contrast findings are resolved and reports no remaining critical/important issues.
The final live example is
`http://localhost:6006/?path=/story/tailadmin-compositions--brand-text-roles&globals=theme:dark`;
the exact candidate run and before/after images are available from
`http://localhost:9324/`. Current source and server freshness identities match.
The separate `/brand-contrast/` page retains the historical initial-versus-approved
diagnostic proof; it is not a reference-approval action.

The 13 recorded landing source/config files, all 368 accepted PNGs, reference
registry, empty Git index and HEAD remain unchanged. Nothing is staged, committed
or promoted. Logs for this pass are `.cache/brand-configuration/refinement-*.log`.
Implementation and verification are complete within the approved first-backoffice
scope; task 3.2b remains at the user's specific image review/approval gate.

### Image approval and reference promotion — 2026-11-12

After the final handoff identified all 388 images and linked the updated dark-text
example and full review, the user replied: **“I approve them all”**. This explicitly
approves every candidate from final run `2026-11-12T17-47-13.318Z`, rather than the
superseded initial 380-case run. The recorded palette, provisional name and
development-only comparison scope continue to apply.

All 388 named cases were promoted through the existing guarded promotion command,
using the verbatim approval `I approve them all`. Source and renderer/font identity
checks passed, and an independent file/registry check confirmed every image's
SHA-256, profile, source, environment, run and approval text match that exact run.
`visual/references.json` now has 388 entries: 368 refreshed references plus the
20 new comparison/text-role cases. A copy of the previous registry is retained
under ignored `.cache/brand-configuration/`; the prior committed baseline remains
in Git. Full comparison against the new references is the final verification step.

This approval and local promotion do not stage files, commit, archive the change,
deploy either app or initiate product-flow design.

Full comparison run **`2026-11-12T17-59-51.333Z`** passes all **388** cases with
zero failures, skips or retries, using the same source hash as the approved run.
Reference bytes and metadata were verified individually against every approved
candidate. The landing remains unchanged, the Git index is empty and HEAD is
unchanged. The brand change's implementation, verification, image approval and
reference-promotion scope is complete; the change remains unarchived. Evidence
is in `.cache/brand-configuration/approved-compare.log` and the native run report.

### Authorized commit preparation — 2026-11-12

After approval/promotion and successful comparison, the agent recommended
preparing the branding changes as a commit batch for the user. The user replied
“go ahead”. This authorizes inspection, staging and a supplied commit command;
the user retains responsibility for creating the commit. No agent commit,
publication, archive or next design phase is authorized.

Prepare one coherent batch containing the recorded decisions, actual backoffice
branding, pinned local fonts/notices, development comparisons, necessary visual
tooling/tests and approved references. The tested source identity remains
`f3a81133d8061102614693778bc174e9e22b264a069b2a96a8a28e3cb729590e`.
Original font notices contain upstream CRLF/trailing whitespace. Narrow
`.gitattributes` entries disable text normalization and whitespace diagnostics
only for those upstream notice paths, preserving their approved source hashes.
No font or licence content is normalized for commit preparation.

Before handoff, verify the staged file inventory and raw blob hashes against the
worktree, font/source manifest and all 388 approved reference records. Check
staged whitespace, native OpenSpec, documentation formatting and local links,
the unchanged landing/HEAD, and absence of generated/cache/dependency files.
Leave the batch staged for the user and supply a repository-scoped commit command.

The complete batch contains 393 staged files: 39 source/documentation/tooling
files, 10 font assets/notices/manifests and 344 changed/new reference PNGs. The
registry still covers all 388 approved cases; the other reference PNGs were
already byte-identical. Staged whitespace checks pass, including the preserved
upstream notices. Every staged blob matches its working file; font/licence and
approved-image hashes are intact. OpenSpec and documentation-format checks pass,
and there are no remaining unstaged/untracked project changes. HEAD remains at
`0580e97b5fd0a1e43eef5c5c9737e6ce3ad03055`; no commit was created.

Prepared subject: `feat: apply initial Irin branding`. The exact staged inventory
and preparation state are recorded locally in ignored
`.cache/brand-configuration/commit-preparation.json`. The user runs the supplied
repository-scoped commit command when ready.
