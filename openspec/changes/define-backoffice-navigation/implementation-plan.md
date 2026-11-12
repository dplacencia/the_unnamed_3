# Navigation prototype implementation plan

**Goal:** Make NAV-001–021 reviewable in the existing Storybook catalogue.

**Architecture:** Compose retained TailAdmin sidebar, header controls, accordion, select,
button and card primitives in a development-only preview. A small typed model
owns preview destinations, group state and independent location choices. Browser
tab storage is confined to this simulated fixture; no production route or API is
introduced. All visible fixture copy uses the five catalogue dictionaries.

**Stack:** Existing React/TypeScript, TailAdmin, next-intl, Vitest and pinned
Playwright/Chromium. No dependency or version changes.

Execute in the current authorized `_3` worktree, retaining existing uncommitted
navigation records. User requirements override skill defaults: this plan belongs
in OpenSpec, no commits or staging, no sibling writes, and no separate worktree
that would lose the in-progress decision record. Use writing-plans, TDD and
verification-before-completion; request an independent read-only code review
before the final report. The user's prototype selection authorizes this bounded
work; no additional execution question is needed.

## 1. Record the selection and establish behavior checks

Files: this change's proposal/design/tasks/spec, root/app AGENTS and OpenSpec
context; create `.storybook/stories/navigation-model.test.ts` and
`.storybook/stories/navigation-model.ts` under `apps/backoffice/`; modify
`apps/backoffice/vitest.config.mts`.

1. Record the exact user answer and NAV-010 before preview code.
2. Add `.storybook/**/*.test.ts` to the existing app test include.
3. Write behavioral tests first for navigation opening the owning group,
   collapsing the previous group, known permission filtering vs unresolved
   permission state, independent page choices, sole-location defaults, and no
   guessed substitution of an invalid retained location.
4. Run `pnpm --filter ./apps/backoffice exec vitest run
.storybook/stories/navigation-model.test.ts`; observe missing behavior, then
   implement the minimal typed model and confirm the assertions pass. Tests cover
   meaningful state transitions, not static rendering or every small helper.

## 2. Compose the selected Storybook preview

Create `apps/backoffice/.storybook/stories/navigation-prototype.tsx` and
`navigation.stories.tsx`. Extend `.storybook/messages/{es,en,ca,gl,eu}.json` only
with the translated preview labels/states. All source stays under the existing
`.storybook/stories` Tailwind source path. Production dictionaries are unchanged.

1. Compose real retained primitives with the selected brand and wordmark metrics.
   Inicio is above the module section; the three shared entries sit in the footer.
   Follow known access: hide restricted entries, keep groups with permitted
   sections, show scoped neutral loading/error with a locally simulated Retry,
   and show explicit denial for the restricted direct-link example.
2. Use page-owned viewing scope on Existencias/Movimientos/Recuentos; no selection
   prompt on other neutral destinations. Known single-location fixtures select
   their location; multi-location fixtures ask. Keep explicit selections per page
   while the preview tab is open, confined to the same fixture context, with no
   production storage policy inferred.
3. Retain desktop compact/expanded behavior and tablet/mobile drawer primitives;
   close the drawer on preview navigation. Use accessible controls, active-state
   indication, keyboard dismissal and focus restoration. Never add custom SVG.
4. Expose named stories for the workspace, known restricted access, no accessible
   module sections, permission loading, permission error and a sole location.
   Controls vary preview state, not real user roles. Neutral content clearly
   identifies this as a navigation preview with simulated information.

## 3. Register and verify the review surface

Modify `visual/inventory.json`, `visual/tests/catalogue.spec.ts`,
`visual/playwright.languages.config.ts`, `visual/README.md`; create
`visual/tests/navigation.spec.ts` and `visual/navigation-actions.ts`. No changes to renderer/profile/comparison
thresholds, approval logic, dependencies, production UI or existing references.

1. Register every added story, relevant states, and five-language assembled cases.
   Sources map to reused production primitives; development-only preview files
   remain outside the retained-production-source coverage count.
2. Add named capture interactions for opening navigation, selecting location,
   independent page remembering, retry and a restricted direct-link preview.
3. Add browser checks for all five languages, page-choice isolation and tab
   retention/reset, known denial vs loading/error, mobile/tablet destination
   closing and Escape/focus behavior. Reuse the existing browser runner/report.
4. Run `pnpm check`, native `openspec validate --all --strict --no-interactive`,
   and local Markdown links. Use the pinned runtime from README.
5. Run `node visual/prepare.mjs` directly with pinned PATH/telemetry/cache env,
   as required by the already observed wrapper/Turbopack environment issue.
   This retains the original build pipeline; no bundler workaround is introduced.
6. Run `pnpm visual:coverage`, `node visual/cli.mjs languages`, and capture the
   named new navigation cases with `node visual/cli.mjs capture --grep 'navigation-'`.
   Compare the 388 existing accepted cases with a negative navigation filter.
   Full comparison including new cases is expected to require their approval.
7. Inspect representative desktop/mobile/dark candidate images. Request a
   read-only independent review of the actual diff against NAV-001–010; fix
   material findings, rerunning affected checks after source changes.
8. Record actual counts, identities, failures/limitations and the review URL in
   design/tasks. Keep existing references byte-for-byte and the index empty.
   Leave the catalogue available for user inspection. Capture success is not
   visual approval; never promote candidates without the user's specific answer.

## 4. Apply the user's first visual review

The user selected “Single content error + compact page frame (Recommended)”.
Follow the bounded revision plan in design.md: fix compact module-trigger
geometry, centralize access-check error/Retry in content, and reclaim page space
without reducing text/control sizes or choosing table behavior. Add the Products
story and regression/capture coverage; rerun the selected checks and compare the
388 accepted cases. The previous 72 candidates remain unapproved and are
superseded for review by a fresh run after source changes. No reference promotion,
production UI changes, staging or commits follow from positive review wording.

## 5. Match compact controls and combine the header

Follow the second-review plan in design.md. The compact Inventory trigger must
match neighboring menu controls in both footprint and icon dimensions. The user
selected “One compact toolbar with page controls (Recommended)”: combine menu,
title, location and theme controls while keeping them visible and preserving
control sizes. Compose this only in the existing prototype; the production header
does not change. Extend meaningful browser regressions before the fix, then run
the same complete verification and fresh 76-case capture/388-case comparison.

## 6. Narrow the rail and add lightweight actions/folding footer

Follow the third-review plan in design.md. The user explicitly selected 64px
collapsed width, centred 44px targets/16px icons, ghost header actions sized
36px desktop or 44px tablet/mobile, and an initially open “Más opciones” footer
toggle. Add meaningful rail/action/footer regressions first, then compose the
preview-only changes and scoped CSS. Update the five catalogue dictionaries,
`visual/navigation-actions.ts`, inventory and visual guide for the folded states.
Run the existing complete checks and fresh captures/comparisons. Shared production
primitives, header/theme components, dependencies and references are preserved.

The user's additional steering asks for a thinner Ubicación selector. Use its
existing small variant on desktop (36px), retaining the 44px tablet/mobile
target and text. Extend the responsive assertions under NAV-018 and refresh the
same combined-revision checks/captures; no new component or dependency is needed.

## 7. Correct the split phone header

The user reported the mobile multi-location header, confirmed the split row was
the defect, and selected “One compact mobile row (Recommended)”. Follow NAV-019:
below 640px keep menu/title/compact selector/theme together, use the existing
translated location label as the empty prompt, allow visual ellipsis and keep
full location names available in the dropdown. Retain 44px touch targets.

1. Add real-browser row alignment, bounds, target sizing, translated prompt and
   location-choice checks across five languages and 320/390/640px widths; observe
   the split-header failure against the committed build before changing the UI.
2. Adjust only the preview's scoped phone flex sizing, visible label/prompt and
   title overflow. Preserve production primitives, desktop styling and state.
3. Run root quality checks, builds and all browser checks; capture revised
   navigation candidates and compare unaffected accepted cases. Inspect the
   rendered phone views. Record exact results and changed case identities.
4. Preserve all 472 approved references until the user approves replacement
   images. Do not stage, commit, archive or deploy this new revision automatically.

## 8. Slim the visible selector and use full-width dropdown rows

The latest user corrections request a thinner button and hover over the whole
dropdown row. Under NAV-020–021, use a 36px visible phone selector with 44px
pointer area, preserve text and tablet/desktop sizing, and remove the location
popup's inset padding/list gaps and rounded option treatment. Retain 44px option
rows and native pointer/keyboard selection. Production select primitives stay unchanged.

1. Extend the phone regression to require 36px visible height; add a test for
   clicking its extra top/bottom target area. Add full-width row geometry and
   edge-hover/selection/keyboard checks in light/dark at phone/desktop widths.
   Observe failures against the current preview before changing its source.
2. Apply phone-only preview CSS for visible height and transparent target
   extension. Use SelectContent/SelectItem props for full-row treatment.
3. Add open-options and hovered-option capture states using the existing runner
   and inventory. Verify quality/build/browser checks and fresh captures; compare
   accepted unaffected cases and inspect the new popup states.
4. Record exact current identities and leave replacement/new images unapproved.
   Do not stage or commit automatically.
