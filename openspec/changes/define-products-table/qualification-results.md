# Grid qualification results — 2026-11-13

## Assessment and recommendation

**Recommend TanStack Table as Irin's table foundation, with TanStack Virtual
where the chosen workload actually needs virtualization.** This is the final
evaluation recommendation, not user approval of production adoption or a new
product interaction. Tabulator is the stronger ready-made grid and has better
measured large-fixture scrolling/heap results here, with similar large-mount
cost. It remains a credible alternative.

The recommendation follows the selected product: deliberate editing, bespoke
business status/draft boundaries, existing React Hook Form/TailAdmin controls,
and requested details rather than a general spreadsheet. Both engines passed
the tested workflows, including exact values and truthful unknowns. TanStack
keeps those controls and domain records in one React composition without a
second mutable grid-data lifecycle or native-DOM-to-React portal boundary.
Its vendor payload is smaller, and its semantic-table fixture has no detected
axe violations in the tested state. Tabulator's grid-role finding reproduces
with minimal native markup, and its range/edit keyboard integration needed
additional care for read-only cells and custom buttons.

This is a tradeoff, not a feature-count victory for TanStack. Tabulator supplies
more editing/validation/clipboard/file/history infrastructure. Its main adapter
also has fewer formatted source lines here (310 versus 357 before the separate
native-audit probe); line count does not measure long-term maintenance. TanStack
still requires our own keyboard/clipboard/editor UI and virtualizer integration.
If ready-made spreadsheet operations became the primary product requirement,
Tabulator's advantage would deserve more weight. Those additional product
features have not been selected merely by evaluating a library.

## Authority and scope

The user delegated any needed tests/comparison and requested the final assessment.
The [plan](qualification-plan.md) records that authority and bounded implementation.
Both engines are installed as exact **backoffice dev dependencies**, used only
by opt-in Storybook examples. Production routes, landing source, the application
state/form decisions, accepted images and pending navigation revisions are
unchanged. No staging, commits, dependency scripts or reference promotion occurred.

The examples implement evaluation mechanisms, not the full Products specification.
Generic note editing does not select editable product fields or identifier
replacement operations. Mocked Save/Cancel outcomes do not select an API,
transaction policy or production recovery behavior. PT-001–017 remain applicable;
neither a grid nor an expansion model has been adopted into production.

## Environment and installed versions

| Item      | Observed value                                                     |
| --------- | ------------------------------------------------------------------ |
| Machine   | Apple M1 Max, 10 CPU cores, 68,719,476,736 bytes memory            |
| Platform  | macOS 27.0.1, arm64                                                |
| Tools     | Node 26.13.1, pnpm 12.18.0, Vite 8.3.7, Storybook 10.6.7           |
| Browser   | Playwright 1.65.0 Chromium 158.0.8127.18; `--disable-gpu`; scale 1 |
| TanStack  | React Table 9.3.1, React Virtual 3.14.26; resolved React 19.2.8    |
| Tabulator | 6.7.1; separately maintained `@types/tabulator-tables` 6.3.6       |
| Audit     | `@axe-core/playwright` / `axe-core` 4.14.0                         |

Public npm publication metadata and the existing strict 1440-minute policy were
checked before installation. The lockfile adds ten packages without changing
existing package resolutions. All installation scripts were disabled; the four
existing exact-version denials and release policy remain unchanged. TanStack's
advertised package agent skill was not approved or adopted.

The table/runtime packages and reviewed new runtime transitives carry MIT
licences with included notices. Axe's MPL-2.0 packages are evaluation tools,
not production imports. Extra file-format libraries were not installed.
Installed package/version/licence/lifecycle metadata is in
[dependencies.json](../../../.cache/grid-comparison/evidence/dependencies.json).

## Browser checks and visual inspection

The final main run passed **34 checks**, with zero failed, skipped or flaky
cases and no retries. The HTML/JSON reports contain all 34 cases, including
panel inspection/edit audits, focus return and the dark-header contrast check.
The prior 32-case run and targeted additions are superseded by this full run.

Coverage includes:

- Catalogue-first, deliberate search submission and exact SKU/barcode lookup;
  native engine sorting/filtering and archived-filter drafts.
- Exact decimal strings beyond JavaScript Number precision, duplicate names
  distinguished by stable IDs, leading zeros, independent measurements and
  distinct zero/no-record/unknown/needs-verification output.
- Explicit note drafts, stock read-only during editing, mocked rejected/unknown
  save results retaining drafts, confirmed promotion and cancellation.
- Requested expansion, React locale context in both implementations, the shared
  details panel and React Hook Form/Zod validation. A draft survives filtering
  its product away and back. Collapse removes the rendered detail.
- Column ordering/width/density controls, retained reload choices, isolated
  business view settings and a fresh independently opened tab.
- Desktop 1440×900, tablet 768×1024, phone 390×844 and desktop dark screenshots;
  phone pinning and horizontal scrolling, no document-width overflow, tested
  row-action touch targets and a full-width phone panel.
- Spanish, English, Catalan, Galician and Basque labels/context; keyboard
  expansion, arrow navigation, exact selected-SKU copying and panel focus return.

The clipboard probe uses a synthetic ClipboardEvent and temporarily intercepts
native `execCommand('copy')` in the test, restoring it afterward. It checks the
library's generated data without changing the user's system clipboard. It is
not proof of every browser/OS shortcut or a complete multi-cell paste workflow.

Candidate screenshots live in
[evidence](../../../.cache/grid-comparison/evidence/). Representative desktop,
phone, expansion, dark and panel images were visually inspected. These are
evaluation captures; they are not selected designs or accepted references.

## Accessibility and integration findings

| Audited state     | TanStack fixture       | Tabulator fixture                               |
| ----------------- | ---------------------- | ----------------------------------------------- |
| Default catalogue | No detected violations | One critical `aria-required-children` violation |
| Read-only panel   | No detected violations | No detected violations                          |
| Panel form        | No detected violations | No detected violations                          |

The Tabulator finding concerns the native `role="grid"` container and its
focusable table-holder child. It also reproduces in a minimal native example
with no custom cells, portals, editors, range selection or React controls.
No vendor source or ARIA markup was patched to make the finding disappear.
This is a concrete release/integration issue to resolve if selecting Tabulator,
not proof that every Tabulator installation or screen-reader task is unusable.

Other observations:

- Tabulator's range Enter handler calls Edit for the selected cell, including
  columns with no editor setup. The original mixed read-only/editor fixture
  threw while reading `column.modules.edit.blocked`. The evaluated public-option
  workaround registers editor machinery but denies editing on every field except
  the explicitly enabled fixture note. Custom buttons also stop grid keyboard
  handling from consuming their activation. No vendor code was changed.
- Native range-highlight CSS overrode the dark header foreground in the initial
  theme adapter. Visual inspection found the black text; an explicit contrast
  check reproduced the 1.59:1 result. A scoped palette override fixes it, and
  both dark examples now pass that check. This is an adapter correction, not an
  unresolved vendor accessibility finding.
- Tabulator clipboard export needs the Export module in addition to Clipboard;
  both are included in the selected-module payload measurement. Its default
  paste insertion is disabled in this evaluation. React records are cloned for
  the native grid, and draft/cancel synchronization uses explicit row updates.
- Tabulator custom inline React content uses portals into formatter-owned DOM.
  Context and the tested filter/collapse lifecycle work, but the adapter owns
  those targets and synchronization. This is extra integration responsibility.
- TanStack v9 pinning uses logical `start`/`end`; this was corrected in the
  initial adapter. TanStack Virtual triggers the current React-hooks compiler
  compatibility warning. The fixture has a narrowly documented lint exception;
  React Compiler is not enabled. Future Compiler adoption needs a separate check.

Automated audit results are evidence, not accessibility certification. Full
screen-reader testing, every keyboard/range operation and every theme/state
combination have not been qualified. Raw catalogue, panel and native-baseline
audit JSON files are retained in the evidence directory.

An independent read-only review found no critical or important issues invalidating
this bounded comparison or recommendation. It checked source/evidence and prompted
the explicit disabled-module payload caveat and paste-comment correction. That
review is technical evaluation, not user approval of production adoption.

## Matched rendering measurements

Five samples per candidate and dataset size, alternating candidate order, ran
serially in the same browser/viewport with no concurrent builds or test suites.
The final run guards operation identities so an earlier render callback cannot
mark a later operation ready. Tabulator's initial redundant data replacement
was also removed before this run. Earlier exploratory timings are superseded.

Both adapters use a 480px virtual viewport, the same records, text, filtering
intent and fixture controls. Five percent of the synthetic records are archived,
so default matching results are 95/950/9,500. Modules are warmed; **mount is an
engine remount**, not a cold app download. Mount/search include two animation
frames after readiness; deep scroll waits for the last eligible row and two
frames. Figures below are milliseconds, median with observed min–max, presented
to the timer's practical decimal precision rather than as a capacity guarantee.

| Records | Candidate | Mount ms          | Exact lookup ms  | Deep scroll ms   |
| ------- | --------- | ----------------- | ---------------- | ---------------- |
| 100     | TanStack  | 29.1 (27.1–29.8)  | 17.6 (16.5–29.1) | 42.0 (37.0–47.7) |
| 100     | Tabulator | 47.6 (47.2–50.2)  | 27.9 (24.8–30.5) | 44.1 (25.0–47.1) |
| 1,000   | TanStack  | 28.0 (25.9–29.9)  | 22.7 (20.3–27.2) | 44.4 (42.1–46.3) |
| 1,000   | Tabulator | 48.0 (46.4–53.7)  | 30.2 (22.4–31.8) | 43.6 (40.9–44.6) |
| 10,000  | TanStack  | 76.8 (69.1–125.2) | 22.8 (7.6–28.3)  | 65.5 (61.1–74.5) |
| 10,000  | Tabulator | 76.5 (75.9–79.2)  | 20.6 (19.1–22.1) | 36.3 (19.8–39.1) |

At 10,000 records, post-GC **whole-page** JS heap medians were 23,173,084 bytes
for TanStack and 17,697,368 for Tabulator. This includes Storybook, React, data
and adapter allocations; it is not isolated library memory or process RAM.
The final viewport had 21 rendered product row groups for TanStack and 25 rows
for Tabulator. Neither rendered all 9,500 matches into the DOM.

**Tabulator has better measured large-fixture scrolling/heap results; the
large-mount medians are similar (76.8 versus 76.5 ms).** TanStack mounts faster
at the smaller sizes. Exploratory runs also showed inter-run mount variation;
these final samples do not establish an absolute mount-speed winner. Search differences are small and
the observed ranges include scheduling noise; five samples do not establish
statistical significance or a universal performance ranking. These are local
in-memory adapter measurements, with no backend/network or real merchant data.
Raw samples and the exact browser version are in
[benchmarks.json](../../../.cache/grid-comparison/evidence/benchmarks.json).

## Vendor payload measurement

Vite production ES-library probes use the same tool/minification settings,
external React/ReactDOM and gzip level 9, resolving both candidates and Virtual
to their ESM entries. The TanStack probe exports the exact
used features plus React Virtual; Tabulator registers the exact evaluated
modules. Adapter code, shared TailAdmin styles, forms, fonts and Storybook are
excluded. Tabulator's distributed CSS is included separately. This measures
vendor payload, not complete implementation or route size.

| Probe                      | JavaScript bytes / gzip bytes | CSS bytes / gzip bytes   |
| -------------------------- | ----------------------------- | ------------------------ |
| TanStack Table + Virtual   | 152,622 / 35,643              | No additional vendor CSS |
| Tabulator selected modules | 339,252 / 73,932              | 27,907 / 3,835           |
| Full Tabulator reference   | 531,223 / 112,100             | 27,907 / 3,835           |

TanStack's measured compressed vendor payload is 35,643 bytes; selected Tabulator
plus CSS is 77,767 bytes. Tabulator includes more supplied behavior, so this is
not a claim that the two vendor exports contain identical functionality.
The registered Tabulator set includes MoveColumns even though pointer moving is
disabled here, and native ResizeColumns behavior that the TanStack fixture does
not expose. These figures describe the evaluated module configuration, not each
library's minimum possible equal-feature bundle or complete app integration cost.
The probe outputs are in [payload/results.json](../../../.cache/grid-comparison/payload/results.json).

## Verification and reproduction

Verified commands:

```sh
pnpm check
pnpm build:backoffice
pnpm build:storybook
pnpm grid:build
pnpm grid:test
pnpm exec playwright test --config visual/grid-comparison.config.ts --grep 'panel accessibility' --reporter=line
node visual/grid-payload.mjs
```

`pnpm check` passes formatting, repository lint/types and the existing **54 code
tests** (34 backoffice + 20 visual tooling). The static backoffice and both normal
and opt-in Storybook builds pass. The normal catalogue excludes the evaluation
stories, and its coverage audit passes. Native OpenSpec validation, local links and protected-scope checks are
recorded with the final documentation verification. The index stays empty and
HEAD remains `f365765`. The accepted screenshot files/manifests are unchanged;
no canonical image comparison or new image approval is claimed for this work.

Use the pinned repo runtime/environment from README. To inspect the built
examples, run `pnpm grid:preview` and open:

- <http://localhost:6010/?path=/story/evaluation-grid-comparison--tan-stack>
- <http://localhost:6010/?path=/story/evaluation-grid-comparison--tabulator>
- <http://localhost:6010/?path=/story/evaluation-grid-comparison--tabulator-native>

The main browser report is `.cache/grid-comparison/report/index.html`, with raw
results in `results.json`; earlier targeted logs are supplementary diagnostics.
Generated evidence/builds are ignored and can be regenerated. The source and
artifact manifest is `.cache/grid-comparison/evidence/manifest.json`.

## Limits before production adoption

- This is one Mac/Chromium evaluation with synthetic in-memory data, not real
  merchant usability research, cross-browser certification or an API benchmark.
- The suite checks one-cell keyboard selection/copying. Arbitrary ranges,
  multi-row paste, imports/exports, printing, undo/redo and child-row trees are
  documented vendor capabilities, not fully qualified Irin workflows here.
- Retention probes cover reload, explicit business view changes and a fresh
  independently opened tab. Opener-copied session storage, browser restoration,
  corrupted/unavailable storage and production policy are not qualified.
- Column customization uses fixture controls and a bounded width range. This
  does not select production widgets or every drag/resize/hidden-sort behavior.
- Editable catalogue fields, permission semantics, concurrency, multi-row save
  atomicity, real failure recovery and draft persistence remain open. Simulations
  must not become production guarantees or new Inventory operations.
- Choose the production foundation explicitly, then define expansion contents
  and editing fields before the next product prototype. Do not ship both grids,
  evaluation notices, probe controls or generic test notes in the backoffice.
